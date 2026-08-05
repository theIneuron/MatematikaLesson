// ---------------------------------------------------------------------------
// Fish Audio TTS — общая логика для /api/tts.
//
// Контракт со стороны урока НЕ меняется (v5.2): GET /api/tts?text=<текст>&g=m|f.
// Так его вызывают 144 файла уроков, поэтому эндпоинт обязан принимать именно
// такой запрос и отдавать mp3. Здесь только три вещи: определить язык, выбрать
// голос, вызвать Fish Audio.
//
// Файл начинается с «_», поэтому Vercel не делает из него маршрут.
// ---------------------------------------------------------------------------

export const FISH_ENDPOINT = 'https://api.fish.audio/v1/tts';

// Столько же, сколько режет buildTtsUrl в уроках. Один сегмент = одна мысль,
// длиннее 1000 символов сегментов не бывает. Заодно потолок расхода на запрос.
export const MAX_TEXT = 1000;

// Языковые маркеры контракта v5.2. Математика их не ставит (сервер определяет
// язык сам), языковые курсы — ставят. Если маркер пришёл, его нельзя отдавать
// в TTS: голос прочитает его вслух.
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]/g;

const TAG_LANG = {
  'Русское произношение': 'ru',
  "O'zbekcha tallaffuz": 'uz',
  'English pronunciation': 'en',
};

/** Язык сегмента: по маркеру, если он есть, иначе по алфавиту (кириллица = ru). */
export function detectLang(text) {
  const s = String(text);
  for (const [tag, lang] of Object.entries(TAG_LANG)) {
    if (s.includes(`[${tag}]`)) return lang;
  }
  return /[Ѐ-ӿ]/.test(s) ? 'ru' : 'uz';
}

/** Текст для синтеза: без маркеров, без двойных пробелов, обрезанный по MAX_TEXT. */
export function cleanText(raw) {
  return String(raw).replace(TAG_RE, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT);
}

function firstSet(env, names) {
  for (const name of names) {
    const value = (env[name] || '').trim();
    if (value) return { id: value, from: name };
  }
  return null;
}

// Порядок поиска голоса. Смысл цепочек: достаточно задать ОДНУ переменную
// FISH_VOICE_M — и этот голос читает всё. Как только появится отдельный женский
// или отдельный узбекский голос, он подхватывается без правок кода.
const VOICE_CHAINS = {
  ru: {
    m: ['FISH_VOICE_RU_M', 'FISH_VOICE_M'],
    f: ['FISH_VOICE_RU_F', 'FISH_VOICE_F', 'FISH_VOICE_RU_M', 'FISH_VOICE_M'],
  },
  uz: {
    m: ['FISH_VOICE_UZ_M', 'FISH_VOICE_M', 'FISH_VOICE_RU_M'],
    f: ['FISH_VOICE_UZ_F', 'FISH_VOICE_F', 'FISH_VOICE_UZ_M', 'FISH_VOICE_M', 'FISH_VOICE_RU_F', 'FISH_VOICE_RU_M'],
  },
  en: {
    m: ['FISH_VOICE_EN_M', 'FISH_VOICE_M'],
    f: ['FISH_VOICE_EN_F', 'FISH_VOICE_F', 'FISH_VOICE_EN_M', 'FISH_VOICE_M'],
  },
};

/** Какой reference_id Fish Audio взять для (язык, пол). null — голос не настроен. */
export function pickVoice(env, lang, gender) {
  const byLang = VOICE_CHAINS[lang] || VOICE_CHAINS.uz;
  return firstSet(env, byLang[gender === 'f' ? 'f' : 'm']);
}

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Синтез одного сегмента. Ничего не бросает: возвращает результат или причину отказа,
 * чтобы вызывающий эндпоинт сам решал, какой HTTP-код отдать уроку.
 */
export async function synthesize(env, { text, gender, signal } = {}) {
  const apiKey = (env.FISH_API_KEY || '').trim();
  if (!apiKey) return { ok: false, status: 503, reason: 'FISH_API_KEY не задан' };

  const clean = cleanText(text);
  if (!clean) return { ok: false, status: 400, reason: 'пустой text' };

  const lang = detectLang(text);
  const voice = pickVoice(env, lang, gender);
  if (!voice) {
    return { ok: false, status: 503, reason: `голос для ${lang}/${gender} не задан (нужна FISH_VOICE_M)` };
  }

  const body = {
    text: clean,
    reference_id: voice.id,
    format: 'mp3',
    mp3_bitrate: num(env.FISH_MP3_BITRATE, 64), // речь; 64 kbps хватает и экономит трафик
    chunk_length: 200,
    // По схеме Fish Audio normalize выправляет числа только для английского и
    // китайского, на русский и узбекский не влияет. Оставляем true (это и есть
    // их дефолт), но полагаться на него нельзя: числа в уроке должны быть словами
    // в самом тексте сегмента — так и требуют правила аудио.
    normalize: true,
    // normal = лучшее качество, balanced/low = меньше задержка. Урок ребёнок
    // проходит один раз, поэтому качество важнее сотен миллисекунд; первый
    // слушатель ждёт синтез, остальные получают тот же файл из кеша CDN.
    latency: (env.FISH_LATENCY || 'normal').trim(),
    prosody: { speed: num(env.FISH_SPEED, 1), volume: 0 },
  };

  let res;
  try {
    res = await fetch(FISH_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        model: (env.FISH_MODEL || 's2.1-pro').trim(),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    return { ok: false, status: 504, reason: `сеть до Fish Audio: ${err && err.message}`, lang, voice };
  }

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 500); } catch { /* тело не обязано быть текстом */ }
    return { ok: false, status: res.status === 401 || res.status === 402 ? res.status : 502,
             reason: `Fish Audio ${res.status}: ${detail}`, lang, voice };
  }

  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) return { ok: false, status: 502, reason: 'Fish Audio вернул пустое тело', lang, voice };

  return { ok: true, audio, contentType: 'audio/mpeg', lang, voice, chars: clean.length };
}
