// ---------------------------------------------------------------------------
// GET /api/tts?text=<текст>&g=m|f  ->  audio/mpeg
//
// Это ТОТ ЖЕ эндпоинт, который уроки вызывают с 2025 года (контракт v5.2,
// MIGRATION_v5_2_math.md). Раньше его давала внешняя платформа; теперь он живёт
// в этом же проекте и озвучивает через Fish Audio. Уроки не переписываются.
//
// Обработчик написан на голом Node-API (req.url, res.statusCode/setHeader/end),
// поэтому один и тот же файл работает и как функция Vercel, и в dev-сервере Vite
// (см. плагин fish-tts-dev в vite.config.js).
// ---------------------------------------------------------------------------

import { synthesize } from './_fish.js';

// Fish Audio берёт деньги за символы, поэтому один и тот же сегмент не должен
// синтезироваться дважды: ключ кеша CDN — это весь URL, а значит текст+пол.
// Год в s-maxage безопасен: изменился текст — изменился URL.
const CACHE = 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800, immutable';

const UPSTREAM_TIMEOUT_MS = 20000;

function hostOf(value) {
  try { return new URL(value).host; } catch { return ''; }
}

/** Необязательная защита от расхода чужими руками: TTS_ALLOWED_HOSTS=a.com,b.com */
function originAllowed(env, req) {
  const list = (env.TTS_ALLOWED_HOSTS || '')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!list.length) return true; // список не задан — проверки нет
  const src = hostOf(req.headers.origin || '') || hostOf(req.headers.referer || '');
  if (!src) return false;
  return list.some((allowed) => src === allowed || src.endsWith(`.${allowed}`));
}

function fail(res, status, reason) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store'); // ошибку кешировать на год нельзя
  res.end(reason);
}

export default async function handler(req, res) {
  const env = process.env;

  res.setHeader('Access-Control-Allow-Origin', '*'); // урок может быть встроен в LMS другого домена
  res.setHeader('Access-Control-Allow-Headers', 'Range');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') return fail(res, 405, 'только GET');

  const url = new URL(req.url || '/', 'http://tts.local');
  const text = url.searchParams.get('text') || '';
  const gender = url.searchParams.get('g') === 'f' ? 'f' : 'm';

  if (!text.trim()) return fail(res, 400, 'нет параметра text');
  if (!originAllowed(env, req)) return fail(res, 403, 'домен не в TTS_ALLOWED_HOSTS');

  // Диагностика настройки без расхода символов: /api/tts?text=...&debug=1
  // Работает только при TTS_DEBUG=1 — иначе наружу утекали бы id голосов.
  if (url.searchParams.get('debug') === '1' && env.TTS_DEBUG === '1') {
    const { detectLang, cleanText, pickVoice } = await import('./_fish.js');
    const lang = detectLang(text);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({
      lang, gender,
      voice: pickVoice(env, lang, gender),
      model: env.FISH_MODEL || 's2.1-pro',
      speed: Number(env.FISH_SPEED) || 1,
      hasApiKey: Boolean((env.FISH_API_KEY || '').trim()),
      textToSpeak: cleanText(text),
    }, null, 2));
    return;
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS);
  let out;
  try {
    out = await synthesize(env, { text, gender, signal: ac.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!out.ok) {
    // Урок не зависает: движок ловит onerror у <audio> и идёт дальше молча.
    // Поэтому здесь важнее оставить причину в логах Vercel, чем изобретать фолбэк.
    console.error('[tts] отказ', out.status, out.reason);
    return fail(res, out.status, out.reason);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', out.contentType);
  res.setHeader('Content-Length', String(out.audio.length));
  res.setHeader('Cache-Control', CACHE);
  res.setHeader('X-Tts-Voice', out.voice.from); // какой переменной выбран голос, без самого id
  res.setHeader('X-Tts-Lang', out.lang);
  if (req.method === 'HEAD') { res.end(); return; }
  res.end(out.audio);
}
