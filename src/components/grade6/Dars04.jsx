import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import './Grade6TheoryTheme.css';
import { normalizeTtsColons } from './ttsMathColon.js';
import { useIntroStages } from './Dars01.jsx';
// УРОК: Умножение десятичных дробей — dec_5_05
// --- ИЗ infrastructure_v1 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen/NumInputScreen) ---

// ============================================================
// ПАЛИТРА
// ============================================================
const T = {
  bg: '#F6F4EF',
  ink: '#0E0E10',
  ink2: '#494550',
  ink3: '#8A8883',
  paper: '#FFFFFF',
  accent: '#FF4F28',
  accentSoft: '#FFE8E1',
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  blue: '#019ACB',
  shadowBase: '58, 53, 48'
};

// ============================================================
// КОНФИГ УРОКА (props от LMS) — модульный, ставится корневым компонентом.
// Движок/SFX/AI читают отсюда; экраны не нужно перепровязывать.
// ============================================================
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'm' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const END_TAG = '[end]';
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]/g;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// Ekrandagi formula o'z ko'rinishida qoladi, TTS esa matematik belgilarni
// tabiiy so'zlar bilan oladi. Bu ayniqsa "Nega shunday" qatorlari uchun kerak:
// brauzer/TTS provayderi ":" yoki "·" ni o'zicha, ba'zan noto'g'ri o'qimasin.
const NUM_WORDS = {
  uz: {
    0: 'nol', 1: 'bir', 2: 'ikki', 3: 'uch', 4: "to'rt", 5: 'besh',
    6: 'olti', 7: 'yetti', 8: 'sakkiz', 9: "to'qqiz", 10: "o'n",
    20: 'yigirma', 30: "o'ttiz", 40: 'qirq', 50: 'ellik',
    60: 'oltmish', 70: 'yetmish', 80: 'sakson', 90: "to'qson",
  },
  ru: {
    0: 'ноль', 1: 'один', 2: 'два', 3: 'три', 4: 'четыре', 5: 'пять',
    6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять', 10: 'десять',
    11: 'одиннадцать', 12: 'двенадцать', 13: 'тринадцать', 14: 'четырнадцать',
    15: 'пятнадцать', 16: 'шестнадцать', 17: 'семнадцать',
    18: 'восемнадцать', 19: 'девятнадцать', 20: 'двадцать',
    30: 'тридцать', 40: 'сорок', 50: 'пятьдесят', 60: 'шестьдесят',
    70: 'семьдесят', 80: 'восемьдесят', 90: 'девяносто',
  },
};

const numberToWords = (value, lang) => {
  const n = Number(value);
  const words = NUM_WORDS[lang] || NUM_WORDS.uz;
  if (!Number.isInteger(n) || n < 0 || n > 999999) return String(value);
  if (Object.prototype.hasOwnProperty.call(words, n)) return words[n];
  if (n < 20 && lang === 'uz') return `${words[10]} ${words[n - 10]}`;
  if (n < 100) return `${words[Math.floor(n / 10) * 10]} ${words[n % 10]}`.trim();
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    const thousandWord = lang === 'ru'
      ? `${numberToWords(thousands, lang)} тысяч`
      : `${numberToWords(thousands, lang)} ming`;
    const rest = n % 1000;
    return rest ? `${thousandWord} ${numberToWords(rest, lang)}` : thousandWord;
  }
  const hundred = lang === 'ru'
    ? ({ 1: 'сто', 2: 'двести', 3: 'триста', 4: 'четыреста', 5: 'пятьсот', 6: 'шестьсот', 7: 'семьсот', 8: 'восемьсот', 9: 'девятьсот' })[Math.floor(n / 100)]
    : `${words[Math.floor(n / 100)]} yuz`;
  const rest = n % 100;
  return rest ? `${hundred} ${numberToWords(rest, lang)}` : hundred;
};

const toTtsMath = (text, lang) => {
  const ops = lang === 'ru'
    ? { mul: ' умножить на ', div: ' разделить на ', eq: ' равно ', minus: ' минус ', plus: ' плюс ' }
    : { mul: ' karra ', div: " bo'lingan ", eq: ' teng ', minus: ' minus ', plus: " qo'shuv " };
  const pronunciationSafe = lang === 'uz'
    ? stripAudioTags(String(text || ''))
        .replace(/\bqismga\b/gi, "bo'lakka")
        .replace(/\bqismda\b/gi, "bo'lakda")
        .replace(/\bqismni\b/gi, "bo'lakni")
        .replace(/\bqism\b/gi, "bo'lak")
    : stripAudioTags(String(text || ''));
  const clean = pronunciationSafe.replace(
    /\b(\d{1,6})\s*:\s*(\d{1,6})\s*=\s*(\d{1,6})\b/g,
    (_, a, b, c) => lang === 'ru'
      ? `${numberToWords(a, lang)} разделить на ${numberToWords(b, lang)} равно ${numberToWords(c, lang)}`
      : `${numberToWords(a, lang)}ni ${numberToWords(b, lang)}ga bo'lsak, ${numberToWords(c, lang)} chiqadi`
  );
  return normalizeTtsColons(clean, { divisionWord: ops.div })
    .replace(/\s*·\s*/g, ops.mul)
    .replace(/\s*=\s*/g, ops.eq)
    .replace(/\s*\+\s*/g, ops.plus)
    .replace(/\s*[−–]\s*/g, ops.minus)
    .replace(/\b\d{1,6}\b/g, (m) => numberToWords(m, lang))
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык — маркерами внутри text (только смешанные строки языковых курсов); math шлёт без маркеров,
// сервер определяет язык сам (ru=кириллица, uz=латиница). Движок свой тег НЕ добавляет.
function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = 'm'; // v5.5-male: erkak ovoz qattiq qulflangan
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

function pickPreviewVoice(synth, lang) {
  const voices = synth.getVoices?.() || [];
  const prefixes = lang === 'uz'
    ? ['uz', 'tr', 'az', 'en']
    : (lang === 'en' ? ['en'] : ['ru']);
  for (const prefix of prefixes) {
    const voice = voices.find((item) => String(item.lang || '').toLowerCase().startsWith(prefix));
    if (voice) return voice;
  }
  return null;
}

// SFX — короткие звуки верно/неверно, URL из ttsConfig (correctSoundUrl/wrongSoundUrl).
function useSfx() {
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { correctSoundUrl, wrongSoundUrl } = ttsConfig;
    if (correctSoundUrl) { const a = new Audio(correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; correctRef.current = a; }
    if (wrongSoundUrl)   { const a = new Audio(wrongSoundUrl);   a.preload = 'auto'; a.volume = 0.6; wrongRef.current = a; }
    return () => {
      try { correctRef.current && correctRef.current.pause(); } catch (e) {}
      try { wrongRef.current && wrongRef.current.pause(); } catch (e) {}
      correctRef.current = null; wrongRef.current = null;
    };
  }, []);
  const play = useCallback((kind) => {
    const ref = kind === 'correct' ? correctRef : wrongRef;
    const a = ref.current; if (!a) { playChime(kind === 'correct'); return; }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }, []);
  return { playCorrect: () => play('correct'), playWrong: () => play('wrong') };
}

// Неречевой сигнал (фолбэк SFX в preview / игры закрепления).
let _chimeCtx = null;
function playChime(ok) {
  try {
    if (typeof window === 'undefined') return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    _chimeCtx = _chimeCtx || new AC();
    const ctx = _chimeCtx; if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const notes = ok ? [660, 880] : [320, 240];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const t0 = now + i * 0.12;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0 + 0.2);
    });
  } catch (e) { /* no-op */ }
}

// AI-проверка открытых ответов — единственный разрешённый fetch (кроме <audio>.src).
// Возвращает { correct, feedback, transcript? } или бросает.
async function gradeAnswer({ screenIdx, question, rubric, lang, mode, answerText, audioBlob }) {
  const endpoint = ttsConfig.aiGradingEndpoint;
  if (!endpoint) throw new Error('No grading endpoint configured');
  const lessonId = (typeof LESSON_META !== 'undefined' && LESSON_META.lessonId) || '';
  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId); fd.append('screenIdx', String(screenIdx));
    fd.append('question', question || ''); fd.append('rubric', rubric || '');
    fd.append('lang', lang); fd.append('mode', 'voice');
    if (audioBlob) fd.append('audio', audioBlob, 'answer.webm');
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, screenIdx, question: question || '', rubric: rubric || '', lang, mode: 'text', answerText: answerText || '' }),
    });
  }
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') throw new Error('Malformed grading response');
  return data;
}

// ============================================================
// LANGUAGE CONTEXT + useT
// ============================================================
const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string') return stripAudioTags(node);
    if (React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return stripAudioTags(node[lang]);
    return stripAudioTags(node.ru ?? '');
  }, [lang]);
};

// ============================================================
// useIsMobile (design_system 5.0)
// ============================================================
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ============================================================
// useMobileZoom — mobil yagona masshtab qatlami (etalon kenglik 390px).
// <640px: butun urok 390px kenglikda joylashadi va real ekranga zoom bilan
// fotografik masshtablanadi — barcha telefonlarda BIR XIL ko'rinish, QA faqat
// 390px da. Desktop (>=640px): --g1z=1, hech narsa o'zgarmaydi.
// Balandlik JS'da o'lchanmaydi: .lesson-root position:fixed + inset:0 —
// brauzer viewport o'zgarishini (URL-panel) o'zi kuzatadi.
// ============================================================
const MOBILE_DESIGN_W = 390;
function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g1z', String(z));
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g1z');
    };
  }, [breakpoint]);
}

// ============================================================
// AUDIO ENGINE
// ============================================================
class AudioEngine {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.onStateChange = null;
    this.waitingFor = null;
    this.currentLang = 'ru';
    this.gender = 'm';
    this.autoplayBlocked = false;
    this.audioEl = null;
    this.isStarting = false;
    this.isBusy = false;
    this.muted = false;
    this.watchdog = null;
    this.hasStarted = false;
    this.advanceTimer = null;
    this.previewStartTimer = null;
  }

  ensureEl() {
    if (this.audioEl || typeof window === 'undefined') return this.audioEl;
    const el = new Audio();
    el.crossOrigin = 'anonymous';
    el.preload = 'auto';
    this.audioEl = el;
    return el;
  }

  setLang(lang) { this.currentLang = lang; }              // только preview Web Speech
  setGender(g) { this.gender = 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет
  setMuted(value) { this.muted = !!value; if (this.muted) this.stop(); }

  emit(patch) {
    if (this.onStateChange) this.onStateChange({
      isPlaying: this.isPlaying,
      isBusy: this.isBusy,
      currentSegment: null,
      ...patch,
    });
  }

  clearWatchdog() {
    if (this.watchdog) clearTimeout(this.watchdog);
    this.watchdog = null;
  }

  // Ba'zi brauzer ovozlari uzun gapda onend bermaydi. Navbat qotib qolmasligi
  // uchun matn uzunligiga mos yuqori chegara qo'yamiz va keyingi segmentga o'tamiz.
  armWatchdog(segment) {
    this.clearWatchdog();
    const words = String(segment?.text || '').trim().split(/\s+/).filter(Boolean).length;
    const limit = Math.max(8000, Math.min(45000, words * 900 + 5000));
    this.watchdog = setTimeout(() => {
      this.watchdog = null;
      if (this.audioEl) {
        try { this.audioEl.pause(); } catch (e) { /* no-op */ }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
      }
      this.completeSegment(segment);
    }, limit);
  }

  completeSegment(segment) {
    if (!segment || segment._audioCompleted) return;
    segment._audioCompleted = true;
    if (this.previewStartTimer) clearTimeout(this.previewStartTimer);
    this.previewStartTimer = null;
    this.clearWatchdog();
    this.isStarting = false;
    this.isPlaying = false;
    this.emit({ isPlaying: false, currentSegment: null, lastCompletedSegment: segment.id });
    this.handleSegmentEnd(segment);
  }

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
    this.isBusy = false;
    this.hasStarted = false;
    this.emit({ isPlaying: false, isBusy: false, hasStarted: false, currentSegment: null, lastCompletedSegment: null });
  }

  playSegment(segment) {
    if (!segment) return;
    if (this.muted) return;
    this.clearWatchdog();
    segment._audioCompleted = false;
    this.isStarting = true;
    this.isBusy = true;
    this.emit({ isBusy: true, hasStarted: true, currentSegment: segment.id });
    const base = ttsConfig.ttsApiBase;
    // Нет текста → пропускаем (логика очереди сохраняется).
    if (!segment.text) {
      setTimeout(() => this.completeSegment(segment), 0);
      return;
    }
    // База НЕ пришла от LMS → этап разработки (artifacts). Озвучка через браузерный
    // Web Speech (preview-стендин, «корявый» голос). На платформе эта ветка мёртвая:
    // LMS всегда передаёт ttsApiBase, и тогда идёт HTTP-ветка ниже.
    // speechSynthesis запрещён контрактом в БОЕВОЙ ветке (platform_contract §4);
    // здесь он допустим как preview-стендин — согласовано с разработчиком платформы (июнь 2026).
    if (!base) { this.playSegmentPreview(segment); return; }
    const el = this.ensureEl();
    if (!el) { setTimeout(() => this.handleSegmentEnd(segment), 0); return; }

    el.onended = () => {
      this.completeSegment(segment);
    };
    el.onerror = () => {
      this.completeSegment(segment);
    };

    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, gender);
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        if (segment._audioCompleted) return;
        this.autoplayBlocked = false;
        this.isStarting = false;
        this.isPlaying = true;
        this.emit({ isPlaying: true, isBusy: true, currentSegment: segment.id });
        this.armWatchdog(segment);
      }).catch(() => {
        if (segment._audioCompleted) return;
        // автоплей заблокирован браузером — ждём первого жеста
        this.isStarting = false;
        this.autoplayBlocked = true;
        this.isPlaying = false;
        this.emit({ isPlaying: false, isBusy: true, currentSegment: null });
        this.armWatchdog(segment);
      });
    }
  }

  // PREVIEW-ВЕТКА (только при пустом ttsApiBase, т.е. вне LMS): браузерный Web Speech.
  // НЕ копировать как боевой транспорт — на платформе всегда идёт HTTP-ветка playSegment.
  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.completeSegment(segment), 0); return;
    }
    const synth = window.speechSynthesis;
    // тег языка/настроения на экран и в Web Speech не нужен — снимаем
    const clean = stripAudioTags(String(segment.text));
    if (!clean) {
      setTimeout(() => this.completeSegment(segment), 0);
      return;
    }
    this.armWatchdog(segment);
    const speakAttempt = (attempt = 0) => {
      if (segment._audioCompleted || this.muted) return;
    const u = new SpeechSynthesisUtterance(clean);
    const lang = segment.lang || this.currentLang;
    u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
    const voice = pickPreviewVoice(synth, lang);
    if (voice) u.voice = voice;
    u.rate = 0.95; u.pitch = 1.0;
      u.onstart = () => {
        if (segment._audioCompleted) return;
        if (this.previewStartTimer) clearTimeout(this.previewStartTimer);
        this.previewStartTimer = null;
        this.isStarting = false;
        this.isPlaying = true;
        this.emit({ isPlaying: true, isBusy: true, currentSegment: segment.id });
        this.armWatchdog(segment);
      };
      u.onend = () => this.completeSegment(segment);
      u.onerror = () => this.completeSegment(segment);
      this.previewUtterance = u;
      try {
        synth.speak(u);
        // Chrome/Windows ba'zan speak() ni qabul qiladi, lekin onstart bermay jim
        // qoladi. Bir marta yangi utterance bilan qayta urinish slayd 6 dagi
        // shunday "ovoz yoqilgan, ammo ovoz yo'q" holatini tiklaydi.
        if (attempt === 0) {
          this.previewStartTimer = setTimeout(() => {
            this.previewStartTimer = null;
            if (!segment._audioCompleted && this.isStarting && !this.isPlaying && !this.muted) {
              try { synth.cancel(); } catch (e) { /* no-op */ }
              setTimeout(() => speakAttempt(1), 120);
            }
          }, 1400);
        }
      } catch (e) {
        if (attempt === 0) setTimeout(() => speakAttempt(1), 120);
        else this.completeSegment(segment);
      }
    };
    setTimeout(() => speakAttempt(0), 80);
  }

  // Возобновление после блокировки автоплея (по первому жесту).
  resumeIfBlocked() {
    if (!this.autoplayBlocked) return;
    this.autoplayBlocked = false;
    this.playSegment(this.queue[this.currentIdx]);
  }

  handleSegmentEnd(segment) {
    // Navbatda kutayotgan yangi segment bo'lsa, waits_for'ni KUTMAYMIZ. Aks holda
    // bola javobni ovoz tugashidan oldin bosganda hodisa allaqachon o'tib ketgan
    // bo'ladi va dars shu yerda jim qotib qolardi (izoh hech qachon aytilmasdi).
    const hasQueued = this.currentIdx + 1 < this.queue.length;
    if (segment && segment.waits_for && !hasQueued) {
      this.waitingFor = segment.waits_for;
      this.isBusy = false;
      this.emit({ isPlaying: false, isBusy: false, currentSegment: null, waitingFor: segment.waits_for });
    } else {
      this.waitingFor = null;
      this.currentIdx++;
      if (segment?.pauseAfterMs) {
        if (this.advanceTimer) clearTimeout(this.advanceTimer);
        this.advanceTimer = setTimeout(() => {
          this.advanceTimer = null;
          this.playNext();
        }, segment.pauseAfterMs);
      } else {
        this.playNext();
      }
    }
  }

  playNext() {
    if (this.currentIdx >= this.queue.length) {
      this.isStarting = false;
      this.isBusy = false;
      this.emit({ isPlaying: false, isBusy: false, currentSegment: null, waitingFor: null });
      return;
    }
    this.playSegment(this.queue[this.currentIdx]);
  }

  start() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.currentIdx = 0;
    this.waitingFor = null;
    this.playNext();
  }

  triggerEvent(eventType, target) {
    if (!this.waitingFor) return;
    const matches = this.waitingFor.type === eventType &&
                   (this.waitingFor.target === target || !this.waitingFor.target);
    if (matches) {
      this.waitingFor = null;
      this.currentIdx++;
      this.playNext();
    }
  }

  triggerInternalEvent(eventName) {
    const nextIdx = this.queue.findIndex((s, i) => i >= this.currentIdx && s.trigger === `on_event:${eventName}`);
    if (nextIdx !== -1) {
      this.currentIdx = nextIdx;
      this.waitingFor = null;
      this.playNext();
    }
  }

  // NAVBATGA qo'yadi, joriy gapni UZMAYDI. Ilgari har chaqiruv currentIdx'ni
  // oxirga otib playNext qilardi — ketma-ket ikki push bo'lsa (masalan qadam matni
  // + fakt, yoki xulosaning uch qatori) birinchisi ikkinchisi bilan yuvib
  // yuborilardi. Ovoz "yo'qolib qolishi" va "chala aytilishi" shundan edi.
  pushOneOff(text, gender, id, pauseAfterMs = 0) {
    if (!text || this.muted) return null;
    this._oneOffSeq = (this._oneOffSeq || 0) + 1;
    const segmentId = id || `oneoff_${this._oneOffSeq}`;
    this.queue.push({
      id: segmentId,
      text: toTtsMath(text, this.currentLang),
      lang: this.currentLang,
      trigger: 'manual',
      waits_for: null,
      g: gender,
      pauseAfterMs,
    });
    // Ekran endigina ochilib, 300 ms boshlash taymeri hali ishlamagan bo'lishi
    // mumkin. Feedbackni navbat oxiriga qo'shamiz, lekin introni tashlab ketmaymiz
    // va taymer keyin navbatni ikkinchi marta boshidan qayta yoqmaydi.
    if (!this.hasStarted) {
      this.isBusy = true;
      this.emit({ isBusy: true, currentSegment: null });
      return segmentId;
    }
    if (this.isPlaying || this.isStarting) return segmentId; // joriy segment tugagach navbat davom etadi
    this.waitingFor = null;              // yangi gap keldi — kutish bekor
    this.currentIdx = this.queue.length - 1;
    this.playNext();
    return segmentId;
  }

  interruptFeedbackQueue() {
    const currentSegment = this.queue[this.currentIdx];
    if (currentSegment) currentSegment._audioCompleted = true;
    this.clearWatchdog();
    if (this.previewStartTimer) clearTimeout(this.previewStartTimer);
    this.previewStartTimer = null;
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    if (this.audioEl) {
      try {
        this.audioEl.onended = null;
        this.audioEl.onerror = null;
        this.audioEl.pause();
      } catch (e) { /* no-op */ }
    }
    this.audioEl = null;
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
    }
    this.queue = [];
    this.currentIdx = 0;
    this.waitingFor = null;
    this.isStarting = false;
    this.isPlaying = false;
    this.isBusy = false;
    this.autoplayBlocked = false;
    this.hasStarted = true;
    this.emit({
      isPlaying: false,
      isBusy: false,
      currentSegment: null,
      lastCompletedSegment: null,
      waitingFor: null,
    });
  }

  // Bola savol ovozi tugashini kutmay javob bersa, eski gapni darhol to'xtatib,
  // aynan yangi feedback navbatini boshidan ijro etadi.
  interruptWith(segments) {
    if (this.muted) return;
    const nextQueue = (segments || []).filter(segment => segment?.text);
    if (!nextQueue.length) return;
    this.interruptFeedbackQueue();
    this.queue = nextQueue.map(segment => ({ ...segment, _audioCompleted: false }));
    this.currentIdx = 0;
    this.waitingFor = null;
    this.hasStarted = true;
    this.isBusy = true;
    this.emit({ isPlaying: false, isBusy: true, hasStarted: true, currentSegment: null, lastCompletedSegment: null });
    this.playNext();
  }

  replay() {
    if (this.muted || !this.queue.length) return;
    this.stop();
    this.queue.forEach(segment => { segment._audioCompleted = false; });
    this.currentIdx = 0;
    this.waitingFor = null;
    this.hasStarted = true;
    this.isBusy = true;
    this.emit({ isPlaying: false, isBusy: true, hasStarted: true, currentSegment: null, lastCompletedSegment: null });
    setTimeout(() => this.playNext(), 80);
  }

  stop() {
    this.clearWatchdog();
    if (this.previewStartTimer) clearTimeout(this.previewStartTimer);
    this.previewStartTimer = null;
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    if (this.audioEl) {
      try { this.audioEl.pause(); this.audioEl.onended = null; this.audioEl.onerror = null; } catch (e) {}
    }
    // preview-ветка: гасим браузерную озвучку
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isStarting = false;
    this.isPlaying = false;
    this.isBusy = false;
    this.emit({ isPlaying: false, isBusy: false, currentSegment: null, waitingFor: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ isPlaying: false, isBusy: false, hasStarted: false, currentSegment: null, lastCompletedSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);

  // Стабилизация segments по содержимому, не по ссылке (без этого cancel-loop, звук молчит)
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableSegments = useMemo(
    () => segments?.map((segment) => ({
      ...segment,
      lang,
      text: toTtsMath(segment.text, lang),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [segmentsKey, lang],
  );

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.setGender(ttsConfig.voiceGender || 'm');
    engine.muted = state.muted;
    engine.onStateChange = (s) => setState(prev => ({ ...prev, ...s }));
    // Возобновление по первому жесту, если браузер заблокировал автоплей.
    const resume = () => { if (engineRef.current) engineRef.current.resumeIfBlocked(); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    if (stableSegments && stableSegments.length > 0 && !state.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
        engine.stop();
      };
    }
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      engine.stop();
    };
  // eslint-disable-next-line
  }, [stableSegments, lang]);

  const triggerEvent = useCallback((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const triggerInternal = useCallback((eventName) => {
    if (engineRef.current) engineRef.current.triggerInternalEvent(eventName);
  }, []);
  const replay = useCallback(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.muted;
      if (engineRef.current) engineRef.current.setMuted(newMuted);
      return { ...prev, muted: newMuted };
    });
  }, []);

  return { ...state, triggerEvent, triggerInternal, replay, toggleMute };
}

// Хелпер: построить audio-segments для экрана из CONTENT
const makeAudioSegments = (screenContent, lang) => {
  if (Array.isArray(screenContent.audio?.[lang])) {
    return screenContent.audio[lang].map((text, i) => ({
      id: `aud_${i}`,
      text,
      trigger: i === 0 ? 'on_mount' : (i === 1 ? 'after_previous' : `on_event:step_${i - 1}`),
      waits_for: i < screenContent.audio[lang].length - 1
        ? { type: 'button_click', target: 'step' }
        : { type: 'button_click', target: 'next' }
    }));
  }
  const text = screenContent.audio?.[lang];
  if (!text) return [];
  return [{ id: 'aud_0', text, trigger: 'on_mount', waits_for: null }];
};

// ============================================================
// БАЗОВЫЕ КОМПОНЕНТЫ
// ============================================================
const Op = React.memo(({ children, size = 'mid' }) => {
  const fontSize = size === 'big' ? 'clamp(25px, 4.7vw, 38px)' :
                   size === 'mid' ? 'clamp(16px, 3vw, 27px)' :
                   'clamp(12px, 2.1vw, 18px)';
  return <span className="mop" style={{ fontSize }}>{children}</span>;
});

const Frac = React.memo(({ n, d, color, size = 'sm' }) => (
  <span className={`frac frac-${size}`} style={{ color }}>
    <span className="n">{n}</span>
    <span className="bar"/>
    <span className="d">{d}</span>
  </span>
));

// mt: рендерит текст, заменяя «a/b» (и «?/b») настоящей дробью Frac — без слэша.
// Если дробей нет, возвращает строку как есть. Применяется во всех видимых текстах.
const FRAC_RE = /(\d+|\?)\/(\d+)/g;
const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (s.indexOf('/') === -1) return s;
  const out = []; let last = 0; let m; let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<Frac key={`mtf${key}`} n={m[1]} d={m[2]} size="sm"/>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};

const AudioIndicator = ({ audioState }) => {
  const { isPlaying, muted, replay, toggleMute } = audioState;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={toggleMute} title={muted ? 'Sound on' : 'Sound off'}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: muted ? T.ink3 : (isPlaying ? T.accent : T.ink2) }}>
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
      {!muted && (
        <button onClick={replay} title="Replay"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: T.ink2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// autoScrollTo — yangi paydo bo'lgan kontentni ko'rinish zonasiga olib keladi.
// 'nearest' — element ko'rinib turgan bo'lsa sakramaydi; reduced-motion'da silliqsiz.
const autoScrollTo = (el, block = 'nearest') => {
  if (!el || typeof el.scrollIntoView !== 'function') return;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
};

// useRevealScroll — active=true bo'lganda (kontent paydo bo'lganda) unga avtoskroll.
// FeedbackBlock naqshi: double-rAF + kechikish (fade-up animatsiyasi joylashgach).
function useRevealScroll(active, delay = 350, block = 'nearest') {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    let tid;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      tid = setTimeout(() => autoScrollTo(ref.current, block), delay);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(tid); };
  }, [active, delay, block]);
  return ref;
}

const FeedbackBlock = ({ show, isCorrect, wrongClass, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (show) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 350);
      }));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(timer);
    }
  }, [show]);
  if (!mounted) return null;
  return (
    <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}>
      <div className={isCorrect ? 'frame-success' : (wrongClass || 'frame-soft')}>{children}</div>
    </div>
  );
};

// Slider — компонент v15 с track-wrap + track-bg + track-fill + glow
const Slider = ({ value, min, max, step = 1, onChange, disabled = false }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="track-wrap">
      <div className="track-bg"/>
      <div className="track-fill" style={{ width: `${pct}%` }}/>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input"
      />
    </div>
  );
};

// Stage — progress + chrome вынесены в отдельный stage-header (sticky, flex-shrink: 0)
const Stage = ({ children, eyebrow, screen, totalScreens, navContent, audioState }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const padH = isMobile ? 12 : 100;
  return (
    <div className={`stage screen-${screen + 1}`}>
      <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }}/>
        </div>
        <div className="chrome">
          <div className="chrome-left eyebrow">
            <span className="dot"/>
            <span>{t(eyebrow)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {audioState && <AudioIndicator audioState={audioState}/>}
            <div className="mono small" style={{ color: T.ink, fontWeight: 700, fontSize: 14 }}>
              {String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
      <div className="stage-content" style={{ paddingLeft: padH, paddingRight: padH }}>
        {children}
      </div>
      {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
    </div>
  );
};

const NavBack = ({ onPrev, label = 'Назад' }) => (
  <button className="btn-ghost" onClick={onPrev}
    style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
    {label}
  </button>
);

const NavNext = ({ label, onClick }) => (
  <button className="btn-white-accent" onClick={onClick}
    style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>
    {label}
  </button>
);

const NextLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Davom etish' : 'Дальше';
};

const BackLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Orqaga' : 'Назад';
};

const whyLabel = (lang) => lang === 'uz' ? 'Nega shunday' : 'Почему так';
const speakMath = (engine, text, lang, id, pauseAfterMs = 0) => {
  if (!engine || !text) return;
  engine.pushOneOff(toTtsMath(text, lang), undefined, id, pauseAfterMs);
};

const interruptWithSpeech = (engine, text, lang, id) => {
  if (!engine || !text) return;
  engine.interruptWith([{
    id,
    text: toTtsMath(text, lang),
    trigger: 'manual',
    waits_for: null,
  }]);
};

const audioReached = (audio, phase) => {
  if (audio.muted) return true;
  const current = String(audio.currentSegment || '');
  const completed = String(audio.lastCompletedSegment || '');
  const ids = `${current} ${completed}`;
  if (phase === 'whyTitle') return /_(why_title|why|fact)\b/.test(ids);
  if (phase === 'why') return /_why\b/.test(ids) || /_fact\b/.test(ids);
  if (phase === 'fact') return /_fact\b/.test(ids) || (!audio.isBusy && /_why\b/.test(completed));
  return false;
};

// Dars01 etaloni: to'g'ri javobdan keyin
// "To'g'ri" -> "Nega shunday" -> izoh qatorlari -> "Bilasizmi?".
// Har bir izoh qatori aynan o'z ovozi boshlanganda ochiladi.
const WHY_TITLE = { ru: 'Почему так', uz: 'Nega shunday' };
const useAnswerSequence = ({ audio, screen, correctText, whyNode, factAudio, initiallyComplete = false }) => {
  const t = useT();
  const lang = useLang();
  const whyItems = useMemo(() => whyNode?.props?.lines?.[lang] || [], [lang, whyNode]);
  const prefix = useMemo(() => `post_s${screen}_${lang}`, [lang, screen]);
  const [restored] = useState(initiallyComplete);
  const [skipAudio, setSkipAudio] = useState(false);
  const startedRef = useRef(restored);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (audio.muted) {
      setSkipAudio(true);
      return;
    }
    const engine = getAudioEngine();
    if (!engine) {
      setSkipAudio(true);
      return;
    }
    const segments = [{
      id: `${prefix}_correct`,
      text: toTtsMath(correctText, lang),
      trigger: 'manual',
      waits_for: null,
    }];
    if (whyItems.length > 0) {
      segments.push({
        id: `${prefix}_why_title`,
        text: t(WHY_TITLE),
        trigger: 'after_previous',
        waits_for: null,
      });
      whyItems.forEach((line, i) => {
        segments.push({
          id: `${prefix}_why_${i}`,
          text: toTtsMath(line, lang),
          trigger: 'after_previous',
          waits_for: null,
        });
      });
    }
    if (factAudio) {
      segments.push({
        id: `${prefix}_fact`,
        text: toTtsMath(factAudio, lang),
        trigger: 'after_previous',
        waits_for: null,
      });
    }
    engine.interruptWith(segments);
  }, [audio.muted, correctText, factAudio, lang, prefix, t, whyItems]);

  const activeId = audio.currentSegment?.startsWith(prefix)
    ? audio.currentSegment
    : (audio.lastCompletedSegment?.startsWith(prefix) ? audio.lastCompletedSegment : '');
  const whyMatch = activeId.match(new RegExp(`^${prefix}_why_(\\d+)$`));
  const showAll = restored || skipAudio;
  const showWhy = whyItems.length > 0 && (
    showAll ||
    activeId === `${prefix}_why_title` ||
    !!whyMatch ||
    activeId === `${prefix}_fact`
  );
  const visibleWhyLines = showAll || activeId === `${prefix}_fact`
    ? whyItems.length
    : (whyMatch ? Math.min(whyItems.length, Number(whyMatch[1]) + 1) : 0);
  const showFact = !!factAudio && (showAll || activeId === `${prefix}_fact`);

  return { showWhy, visibleWhyLines, showFact, start };
};

const WhyCard = ({ lines, figure, visibleCount }) => {
  const t = useT();
  const lang = useLang();
  const items = lines[lang];
  const n = visibleCount === undefined ? items.length : visibleCount;
  return (
    <div className="why">
      <p className="why-h"><span className="why-dot" aria-hidden="true"/>{t(WHY_TITLE)}</p>
      {figure && <div className="why-fig">{figure}</div>}
      <div className="why-list">
        {items.slice(0, n).map((line, i) => (
          <div key={i} className="why-row">
            <span className="why-num">{i + 1}</span>
            <p className="why-tx">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// QUESTION SCREEN — универсальный MC-компонент под формат audio: { intro, on_correct, on_wrong }
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, titleNode, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, whyNode, factOnCorrect, figure }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();

  const audio = useAudio([{
    id: `s${idx}_intro`,
    text: c.audio.intro[lang],
    trigger: 'on_mount',
    waits_for: { type: 'option_picked' }
  }]);

  // Веди-до-верного: экран НЕ блокируется на первом ответе.
  // Неверный гаснет и отключается, остальные активны, «Дальше» — только когда выбран верный.
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);  // текущий показываемый вариант
  const [wrong, setWrong]   = useState(() => new Set());                // погашенные неверные
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const post = useAnswerSequence({
    audio,
    screen: idx,
    correctText: c.correct_text[lang],
    whyNode,
    factAudio: c.fact_audio?.[lang],
    initiallyComplete: wasSolved,
  });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);

  const pick = (i) => {
    if (solved) return;        // после верного — заблокировано
    if (wrong.has(i)) return;  // уже погашенный неверный — игнор
    const isCorrect = i === correctIdx;

    if (firstTryRef.current === null) {   // фиксируем первую попытку (аналитика)
      firstTryRef.current = isCorrect;
      firstIdxRef.current = i;
    }
    attemptsRef.current += 1;
    setPicked(i);

    if (!introAdvancedRef.current) {      // продвинуть intro-очередь один раз
      introAdvancedRef.current = true;
      audio.triggerEvent('option_picked');
    }

    if (isCorrect) {
      setSolved(true);
      sfx.playCorrect();
      post.start();
      onAnswer({
        stage: screenMeta?.scope ?? null,
        screenIdx: idx,
        question: typeof question === 'string' ? question : null,
        options: options.map(o => typeof o === 'string' ? o : null),
        correctIndex: correctIdx,
        correctAnswer: typeof options[correctIdx] === 'string' ? options[correctIdx] : null,
        studentAnswerIndex: firstIdxRef.current,                                   // ПЕРВЫЙ выбор
        studentAnswer: typeof options[firstIdxRef.current] === 'string' ? options[firstIdxRef.current] : null,
        correct: firstTryRef.current,                                              // верность ПЕРВОЙ попытки
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true
      });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }

    if (!isCorrect && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) {
        const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
        interruptWithSpeech(engine, wrongVoice, lang, `s${idx}_wrong_${i}`);
      }
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        {titleNode && <Title node={titleNode}/>}
        {/* Заголовок (Title) + текст вопроса остаются и после верного ответа — сворачиваются только неверные варианты. */}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {/* После верного: остаётся только верный вариант, неверные плавно (с задержкой) сворачиваются — keep-visible anti-scroll. */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;        // после верного неверные сворачиваются
            let cls = 'option';
            if (collapse) cls += ' g6-option-collapsed';
            if (solved) {
              if (isCorrect) cls += ' option-correct';
              // неверным НЕ добавляем цвет-класс — плавно гаснут через inline opacity
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(15px, 1.8vw, 16px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {mt(solved ? t(c.correct_text) : t(c[`hint_${picked}`] || c[`wrong_${picked}`] || c.wrong_default))}
          </p>
        </FeedbackBlock>
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {solved && post.showFact && factOnCorrect && <div ref={factRef}>{factOnCorrect}</div>}
      </div>
    </Stage>
  );
};


// ============================================================
// --- UROK: div_6_04 — Простые и составные числа / Tub va murakkab sonlar ---
// Infra grade6/Dars01-03 (baytma-bayt). Mobil naqsh BOSHIDAN ichida (ETALON_6SINF.md §5).
// Kontekst: Dars02-03 dagi do'kon dunyosi davomi — narxni necha xil usulda teng
// bo'lish mumkinligi orqali tub/murakkab farqi ochiladi.
// DARSNING O'Q CHIZIG'I: 12 ni ko'p xil bo'lish mumkin, 13 ni esa faqat ikki xil.
// Bo'luvchilar soni hal qiladi: roppa-rosa 2 ta -> tub, 2 tadan ko'p -> murakkab.
// Dars02-03 dagi 2, 3, 5, 9 alomatlari bu yerda TEKSHIRISH QUROLIGA aylanadi.
// s6-s13 tub ko'paytuvchilarga ajratishni to'liq o'rgatadi: 12 va 18 dan
// boshlanib, ustun usulida 420 gacha boriladi va 180 bilan mustahkamlanadi.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_04',
  lessonTitle: { ru: 'Простые и составные числа', uz: 'Tub va murakkab sonlar' }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0  (12 va 13, RASM)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (bo'luvchilarni sanaymiz)
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 3  (tub / murakkab ta'rifi)
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (alomatlarni eslash, RASM)
  { id: 's4',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 4  (4 narxdan tubini top, RASM)
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 5  (1 soni alohida + fakt)
  { id: 's6',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 6  (tub ko'paytuvchi tushunchasi)
  { id: 's7',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 7  (18 ni ustun usulida yoyish)
  { id: 's8',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 8  (42 uchun birinchi tub bo'luvchi)
  { id: 's9',  type: 'test',        template: 'InputScreen',    scored: true,  scope: 'practice' }, // 9  (36 dagi tub ko'paytuvchilar soni)
  { id: 's10', type: 'exploration', template: 'custom',         scored: false, scope: null },       // 10 (420 — katta sonni ustun usulida yoyish)
  { id: 's11', type: 'test',        template: 'DragMatch',      scored: true,  scope: 'practice' }, // 11 (son -> tub yoyilma)
  { id: 's12', type: 'test',        template: 'Classify',       scored: true,  scope: 'practice' }, // 12 (to'g'ri/xato tub yoyilma)
  { id: 's13', type: 'test',        template: 'InputScreen',    scored: true,  scope: 'final' },    // 13 (180 — yakuniy mustahkamlash)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 14
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Тема урока', uz: 'Dars mavzusi' },
    topic: { ru: 'Простые и составные числа', uz: 'Tub va murakkab sonlar' },
    global_q: { ru: 'Как отличить простое число и разложить составное на простые множители?', uz: "Tub sonni qanday ajratamiz va murakkab sonni tub ko'paytuvchilarga qanday yoyamiz?" },
    lead: { ru: 'Два ценника рядом: 12 и 13 тысяч. Счёт на 12 тысяч компания разделит хоть на двоих, хоть на троих, хоть на четверых. А счёт на 13 тысяч — только если платит один или скинутся тринадцать человек.', uz: "Yonma-yon ikki narx: 12 va 13 ming. 12 minglik hisobni kompaniya ikki kishiga ham, uch kishiga ham, to'rt kishiga ham bo'la oladi. 13 minglik hisobni esa faqat bitta odam to'laydi yoki o'n uch kishi yig'iladi." },
    question: { ru: 'Как думаешь, чем 13 отличается от 12?', uz: "Nima deb o'ylaysiz, 13 soni 12 dan nimasi bilan farq qiladi?" },
    opt_yes: { ru: 'Кажется, понимаю', uz: "Tushunganga o'xshayman" },
    opt_no: { ru: 'Пока не понимаю', uz: 'Hozircha tushunmadim' },
    opt_idk: { ru: 'Хочу разобраться', uz: "O'rganmoqchiman" },
    audio: {
      intro: { ru: 'Два ценника рядом: двенадцать и тринадцать тысяч. У двенадцати много делителей, а у тринадцати только один и тринадцать. Сначала разберём, какие числа называют простыми и составными. Затем научимся раскладывать составные числа на простые множители столбиком, от простых примеров к более крупным числам.', uz: "Yonma-yon ikki narx: o'n ikki va o'n uch ming. O'n ikkida bo'luvchilar ko'p, o'n uchda esa faqat bir va o'n uch bor. Avval qanday sonlar tub va murakkab deb atalishini tushunamiz. Keyin murakkab sonlarni sodda misollardan katta sonlargacha ustun shaklida tub ko'paytuvchilarga ajratishni o'rganamiz." },
      on_correct: { ru: 'Тогда разберёмся.', uz: 'Unda aniqlab olamiz.' },
      on_wrong: { ru: 'Тогда разберёмся.', uz: 'Unda aniqlab olamiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Первое наблюдение', uz: 'Birinchi kuzatuv' },
    bridge: { ru: 'Сначала найдём число, у которого только два делителя.', uz: "Avval faqat ikkita bo'luvchisi bor sonni topamiz." },
    question: { ru: 'Какое число делится только на 1 и само на себя?', uz: "Qaysi son faqat 1 ga va o'ziga bo'linadi?" },
    opt0: { ru: '8 тысяч', uz: '8 ming' },
    opt1: { ru: '9 тысяч', uz: '9 ming' },
    opt2: { ru: '11 тысяч', uz: '11 ming' },
    opt3: { ru: '12 тысяч', uz: '12 ming' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. У 11 только два делителя: 1 и 11. Такие числа скоро получат своё название.', uz: "To'g'ri. 11 ning faqat ikkita bo'luvchisi bor: 1 va 11. Bunday sonlarning alohida nomi bor." },
    why: {
      ru: ['Делители числа 11 — только 1 и 11.', 'Делителей ровно два, поэтому 11 — простое число.'],
      uz: ["11 ning bo'luvchilari faqat 1 va 11.", "Bo'luvchilar soni roppa-rosa ikkita bo'lgani uchun 11 tub son."]
    },
    wrong_0: { ru: '8 делится на 1, 2, 4 и 8. Делителей больше двух.', uz: "8 soni 1, 2, 4 va 8 ga bo'linadi. Bo'luvchilari ikkitadan ko'p." },
    wrong_1: { ru: '9 делится на 1, 3 и 9. У него три делителя.', uz: "9 soni 1, 3 va 9 ga bo'linadi. Uning uchta bo'luvchisi bor." },
    wrong_3: { ru: '12 делится на 1, 2, 3, 4, 6 и 12. Делителей много.', uz: "12 soni 1, 2, 3, 4, 6 va 12 ga bo'linadi. Uning bo'luvchilari ko'p." },
    audio: {
      intro: { ru: 'Первое наблюдение. Сначала найдём число, у которого только два делителя. Какое число делится только на единицу и само на себя? Выбери ответ.', uz: "Birinchi kuzatuv. Avval faqat ikkita bo'luvchisi bor sonni topamiz. Qaysi son faqat birga va o'ziga bo'linadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. У одиннадцати только два делителя.', uz: "To'g'ri. O'n birning faqat ikkita bo'luvchisi bor." },
      on_wrong: { ru: 'У этого числа больше двух делителей.', uz: "Bu sonning bo'luvchilari ikkitadan ko'p." }
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Считаем все делители', uz: "Barcha bo'luvchilarni sanaymiz" },
    bridge: { ru: 'Выпишем для каждой цены все числа, на которые её можно разделить поровну.', uz: "Har bir narx uchun uni teng bo'lish mumkin bo'lgan barcha sonlarni yozamiz." },
    audio: {
      ru: [
        'У двенадцати делители один, два, три, четыре, шесть и двенадцать. Целых шесть штук, компания разделит счёт как угодно.',
        'А у тринадцати всего два делителя: один и само тринадцать. Больше ничего не подходит.',
        'У восемнадцати снова шесть делителей. Такие числа делятся легко.',
        'А у девятнадцати опять только два: один и девятнадцать. Вот в чём разница. Всё решает количество делителей.'
      ],
      uz: [
        "O'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti va o'n ikki. Jami oltita. Demak, hisobni bir necha usulda teng bo'lish mumkin.",
        "O'n uchda esa bor-yo'g'i ikkita bo'luvchi: bir va o'n uchning o'zi. Boshqa hech narsa to'g'ri kelmaydi.",
        "O'n sakkizda yana oltita bo'luvchi. Bunday sonlar oson bo'linadi.",
        "O'n to'qqizda esa yana faqat ikkita: bir va o'n to'qqiz. Farq mana shunda. Hammasini bo'luvchilar soni hal qiladi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Простые и составные', uz: 'Tub va murakkab' },
    rule_1: { ru: 'Простое число — у него ровно два делителя: 1 и само число. Например, 13 и 19.', uz: "Tub son — uning roppa-rosa ikkita bo'luvchisi bor: 1 va sonning o'zi. Masalan, 13 va 19." },
    rule_2: { ru: 'Составное число — у него больше двух делителей. Например, 12 и 18.', uz: "Murakkab son — uning ikkitadan ko'p bo'luvchisi bor. Masalan, 12 va 18." },
    audio: { ru: 'Запомним правило. Простое число это число, у которого ровно два делителя: единица и само число. Например, тринадцать и девятнадцать. Составное число это число, у которого делителей больше двух. Например, двенадцать и восемнадцать.', uz: "Qoidani eslab qolamiz. Tub son bu shunday sonki, uning roppa-rosa ikkita bo'luvchisi bor: bir va sonning o'zi. Masalan, o'n uch va o'n to'qqiz. Murakkab son bu shunday sonki, uning bo'luvchilari ikkitadan ko'p. Masalan, o'n ikki va o'n sakkiz." }
  },

  s4: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    bridge: { ru: 'Теперь применим определение.', uz: "Endi ta'rifni qo'llaymiz." },
    question: { ru: 'Какая из этих цен — простое число?', uz: 'Bu narxlarning qaysi biri tub son?' },
    opt0: { ru: '21 тысяча', uz: '21 ming' },
    opt1: { ru: '27 тысяч', uz: '27 ming' },
    opt2: { ru: '23 тысячи', uz: '23 ming' },
    opt3: { ru: '33 тысячи', uz: '33 ming' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. 23 не делится ни на 2, ни на 3, ни на 5. Делители только 1 и 23 — это простое число.', uz: "To'g'ri. 23 soni 2 ga ham, 3 ga ham, 5 ga ham bo'linmaydi. Bo'luvchilari faqat 1 va 23 — bu tub son." },
    why: {
      ru: ['21, 27 и 33 делятся на 3, поэтому они составные.', '23 не делится на 2, 3 или 5; его делители только 1 и 23.', 'Поэтому 23 — простое число.'],
      uz: ["21, 27 va 33 sonlari 3 ga bo'linadi, shuning uchun ular murakkab.", "23 soni 2, 3 va 5 ga bo'linmaydi; bo'luvchilari faqat 1 va 23.", 'Shuning uchun 23 tub son.']
    },
    wrong_0: { ru: '21 = 3 · 7. Кроме 1 и 21 есть ещё делители 3 и 7, значит число составное.', uz: "21 = 3 · 7. 1 va 21 dan tashqari 3 va 7 ham bo'luvchi, demak son murakkab." },
    wrong_1: { ru: '27 = 3 · 9. Сумма цифр 2 + 7 = 9 делится на 3, значит число составное.', uz: "27 = 3 · 9. Raqamlar yig'indisi 2 + 7 = 9, u 3 ga bo'linadi, demak son murakkab." },
    wrong_3: { ru: '33 = 3 · 11. Сумма цифр 3 + 3 = 6 делится на 3, значит число составное.', uz: "33 = 3 · 11. Raqamlar yig'indisi 3 + 3 = 6, u 3 ga bo'linadi, demak son murakkab." },
    audio: {
      intro: { ru: 'Теперь применим определение. Какая из этих цен простое число? Проверь каждую на делимость. Выбери ответ.', uz: "Endi ta'rifni qo'llaymiz. Bu narxlarning qaysi biri tub son? Har birini bo'linishga tekshiring. Javobni tanlang." },
      on_correct: { ru: 'Верно. Только два делителя.', uz: "To'g'ri. Faqat ikkita bo'luvchi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Особый случай — единица', uz: 'Alohida holat — bir soni' },
    bridge: { ru: 'А куда отнести число 1? Посмотрим на его делители.', uz: "1 sonini qayerga qo'yamiz? Uning bo'luvchilariga qaraymiz." },
    fact: { ru: 'Простых чисел бесконечно много — это доказал Евклид больше двух тысяч лет назад. Но чем дальше по числовому ряду, тем реже они встречаются: до 100 их 25, а между 900 и 1000 — только 14.', uz: "Tub sonlar cheksiz ko'p — buni Evklid ikki ming yildan ko'proq vaqt oldin isbotlagan. Lekin son qatorida qanchalik uzoqqa borsak, ular shunchalik kam uchraydi: 100 gacha 25 ta, 900 va 1000 orasida esa atigi 14 ta." },
    fact_audio: { ru: 'Знаешь ли ты? Простых чисел бесконечно много, это доказал Евклид больше двух тысяч лет назад. Но чем дальше по числовому ряду, тем реже они встречаются. До ста их двадцать пять, а между девятьюстами и тысячей только четырнадцать.', uz: "Bilasizmi? Tub sonlar cheksiz ko'p, buni Evklid ikki ming yildan ko'proq vaqt oldin isbotlagan. Lekin son qatorida qanchalik uzoqqa borsak, ular shunchalik kam uchraydi. Yuzgacha ular yigirma beshta, to'qqiz yuz va ming orasida esa atigi o'n to'rtta." },
    audio: {
      ru: [
        'У единицы всего один делитель. Она делится только сама на себя.',
        'Для простого нужно ровно два делителя, а для составного больше двух. Единица не подходит ни туда, ни туда.',
        'Поэтому единицу не относят ни к простым, ни к составным. Она стоит отдельно. Самое маленькое простое число это два.'
      ],
      uz: [
        "Bir sonining bor-yo'g'i bitta bo'luvchisi bor. U faqat o'ziga bo'linadi.",
        "Tub son uchun roppa-rosa ikkita bo'luvchi kerak, murakkab uchun esa ikkitadan ko'p. Bir soni na unisiga, na bunisiga to'g'ri keladi.",
        "Shuning uchun bir soni na tub, na murakkab hisoblanadi. U alohida turadi. Eng kichik tub son bu ikki."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Новое понятие', uz: 'Yangi tushuncha' },
    title: { ru: 'Что такое простые множители?', uz: "Tub ko'paytuvchilar nima?" },
    bridge: { ru: 'Составное число будем разбирать только на простые числа.', uz: "Murakkab sonni faqat tub sonlar ko'paytmasiga ajratamiz." },
    audio: {
      ru: [
        'Числа, которые перемножают, называют множителями. Например, двенадцать равно два умножить на шесть.',
        'Но шесть составное число. Его тоже можно разделить: шесть равно два умножить на три.',
        'Получаем: двенадцать равно два умножить на два умножить на три. Два и три простые, поэтому это простые множители числа двенадцать.',
        'Разложить число на простые множители значит представить его произведением только простых чисел. Удобнее всего делать это столбиком.'
      ],
      uz: [
        "Ko'paytirishda qatnashayotgan sonlar ko'paytuvchilar deyiladi. Masalan, o'n ikki ikki karra oltiga teng.",
        "Lekin olti murakkab son. Uni ham ajratish mumkin: olti ikki karra uchga teng.",
        "Natijada o'n ikki ikki karra ikki karra uchga teng bo'ladi. Ikki va uch tub sonlar, shuning uchun ular o'n ikkining tub ko'paytuvchilaridir.",
        "Sonni tub ko'paytuvchilarga ajratish — uni faqat tub sonlar ko'paytmasi ko'rinishida yozish demakdir. Buni ustun shaklida bajarish eng qulay."
      ]
    }
  },

  s7: {
    eyebrow: { ru: 'Столбик · легко', uz: 'Ustun usuli · oson' },
    title: { ru: 'Разложим 18', uz: '18 ni ajratamiz' },
    bridge: { ru: 'Всегда пробуй самое маленькое простое число: 2, затем 3, 5, 7 и так далее.', uz: "Har doim eng kichik tub sondan boshlang: 2, keyin 3, 5, 7 va hokazo." },
    audio: {
      ru: [
        'Восемнадцать чётное, поэтому делим на два. Получаем девять. Справа записываем простой делитель два.',
        'Девять на два не делится. Сумма цифр равна девяти, поэтому делим на три. Получаем три.',
        'Три уже простое. Делим три на три и получаем единицу. На единице столбик заканчивается.',
        'Читаем простые делители справа: восемнадцать равно два умножить на три умножить на три.'
      ],
      uz: [
        "O'n sakkiz juft, shuning uchun uni ikkiga bo'lamiz. To'qqiz chiqadi. O'ng tomonga tub bo'luvchi ikki yoziladi.",
        "To'qqiz ikkiga bo'linmaydi. Raqamlar yig'indisi to'qqiz, shuning uchun uchga bo'lamiz. Uch chiqadi.",
        "Uch tub son. Uchni uchga bo'lib, birni hosil qilamiz. Ustun bir sonida tugaydi.",
        "O'ng tomondagi tub bo'luvchilarni o'qiymiz: o'n sakkiz ikki karra uch karra uchga teng."
      ]
    }
  },

  s8: {
    eyebrow: { ru: 'Проверяем первый шаг', uz: 'Birinchi qadamni tekshiramiz' },
    bridge: { ru: 'Начинай с самого маленького простого делителя, который подходит.', uz: "Mos keladigan eng kichik tub bo'luvchidan boshlang." },
    question: { ru: 'На какой простой делитель сначала разделим 42?', uz: "42 ni avval qaysi tub bo'luvchiga bo'lamiz?" },
    opt0: { ru: 'на 2', uz: '2 ga' },
    opt1: { ru: 'на 3', uz: '3 ga' },
    opt2: { ru: 'на 5', uz: '5 ga' },
    opt3: { ru: 'на 7', uz: '7 ga' },
    correctIndex: 0,
    correct_text: { ru: 'Верно. 42 чётное, поэтому начинаем с 2: 42 : 2 = 21. Затем 21 : 3 = 7 и 7 : 7 = 1. Значит, 42 = 2 · 3 · 7.', uz: "To'g'ri. 42 juft, shuning uchun 2 dan boshlaymiz: 42 : 2 = 21. Keyin 21 : 3 = 7 va 7 : 7 = 1. Demak, 42 = 2 · 3 · 7." },
    why: {
      ru: ['42 — чётное число, поэтому самый маленький подходящий простой делитель — 2.', '42 : 2 = 21, 21 : 3 = 7, 7 : 7 = 1.', 'Значит, 42 = 2 · 3 · 7.'],
      uz: ["42 juft son, demak eng kichik mos tub bo'luvchi 2.", '42 : 2 = 21, 21 : 3 = 7, 7 : 7 = 1.', 'Demak, 42 = 2 · 3 · 7.']
    },
    wrong_1: { ru: '42 делится на 3, но сначала выбираем самый маленький подходящий простой делитель. Это 2.', uz: "42 soni 3 ga bo'linadi, lekin avval eng kichik mos tub bo'luvchini tanlaymiz. Bu 2." },
    wrong_2: { ru: '42 не оканчивается на 0 или 5, поэтому на 5 не делится.', uz: "42 soni 0 yoki 5 bilan tugamaydi, shuning uchun 5 ga bo'linmaydi." },
    wrong_3: { ru: '42 делится на 7, но 2 меньше и тоже подходит. Начинаем с 2.', uz: "42 soni 7 ga bo'linadi, lekin 2 kichikroq va u ham mos keladi. 2 dan boshlaymiz." },
    audio: {
      intro: { ru: 'Проверим первый шаг. Начинай с самого маленького простого делителя, который подходит. На какой простой делитель сначала разделим сорок два? Выбери ответ.', uz: "Birinchi qadamni tekshiramiz. Mos keladigan eng kichik tub bo'luvchidan boshlang. Qirq ikkini avval qaysi tub bo'luvchiga bo'lamiz? Javobni tanlang." },
      on_correct: { ru: 'Верно. Начинаем с двух.', uz: "To'g'ri. Ikkidan boshlaymiz." },
      on_wrong: { ru: 'Ищи самый маленький подходящий простой делитель.', uz: "Eng kichik mos tub bo'luvchini qidiring." }
    }
  },

  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    label: { ru: 'считаем множители', uz: "ko'paytuvchilarni sanaymiz" },
    context: { ru: 'Разложи 36 столбиком до единицы.', uz: "36 ni ustun shaklida birgacha ajrating." },
    question: { ru: 'Сколько простых множителей получится у числа 36?', uz: "36 sonida nechta tub ko'paytuvchi chiqadi?" },
    answer: '4',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно. 36 = 2 · 2 · 3 · 3. В разложении четыре простых множителя.', uz: "To'g'ri. 36 = 2 · 2 · 3 · 3. Yoyilmada to'rtta tub ko'paytuvchi bor." },
    why: {
      ru: ['36 : 2 = 18, 18 : 2 = 9.', '9 : 3 = 3, 3 : 3 = 1.', 'Значит, 36 = 2 · 2 · 3 · 3 — всего 4 простых множителя.'],
      uz: ['36 : 2 = 18, 18 : 2 = 9.', '9 : 3 = 3, 3 : 3 = 1.', "Demak, 36 = 2 · 2 · 3 · 3 — jami 4 ta tub ko'paytuvchi."]
    },
    hint: { ru: 'Дели по порядку: 36 : 2 = 18, 18 : 2 = 9, 9 : 3 = 3, 3 : 3 = 1.', uz: "Navbat bilan bo'ling: 36 : 2 = 18, 18 : 2 = 9, 9 : 3 = 3, 3 : 3 = 1." },
    fact: { ru: 'Одинаковые множители можно записать степенью: 36 = 2² · 3². Но при подсчёте множителей здесь две двойки и две тройки — всего четыре.', uz: "Bir xil ko'paytuvchilarni daraja bilan yozish mumkin: 36 = 2² · 3². Lekin ko'paytuvchilarni sanaganda ikkita 2 va ikkita 3 — jami to'rtta." },
    fact_audio: { ru: 'Знаешь ли ты? Одинаковые множители можно записать степенью. Тридцать шесть равно два в квадрате умножить на три в квадрате. Здесь две двойки и две тройки, всего четыре множителя.', uz: "Bilasizmi? Bir xil ko'paytuvchilarni daraja bilan yozish mumkin. O'ttiz olti ikki kvadrat karra uch kvadratga teng. Bu yerda ikkita ikki va ikkita uch, jami to'rtta ko'paytuvchi bor." },
    audio: {
      intro: { ru: 'Разложи тридцать шесть столбиком до единицы. Сколько простых множителей получится у числа тридцать шесть? Набери ответ.', uz: "O'ttiz oltini ustun shaklida birgacha ajrating. O'ttiz olti sonida nechta tub ko'paytuvchi chiqadi? Javobni tering." },
      on_correct: { ru: 'Верно, четыре простых множителя.', uz: "To'g'ri, to'rtta tub ko'paytuvchi." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s10: {
    eyebrow: { ru: 'Столбик · сложнее', uz: 'Ustun usuli · qiyinroq' },
    title: { ru: 'Разложим большое число 420', uz: 'Katta 420 sonini ajratamiz' },
    bridge: { ru: 'Правило не меняется: на каждом шаге берём самый маленький подходящий простой делитель.', uz: "Qoida o'zgarmaydi: har qadamda eng kichik mos tub bo'luvchini olamiz." },
    audio: {
      ru: [
        'Четыреста двадцать чётное. Делим на два и получаем двести десять.',
        'Двести десять тоже чётное. Снова делим на два и получаем сто пять.',
        'Сто пять на два не делится. Сумма цифр равна шести, поэтому делим на три. Получаем тридцать пять.',
        'Тридцать пять оканчивается на пять. Делим на пять и получаем семь.',
        'Семь простое. Делим на семь и получаем единицу. Значит, четыреста двадцать равно два умножить на два умножить на три умножить на пять умножить на семь.'
      ],
      uz: [
        "To'rt yuz yigirma juft. Ikkiga bo'lib, ikki yuz o'nni hosil qilamiz.",
        "Ikki yuz o'n ham juft. Yana ikkiga bo'lib, bir yuz beshni hosil qilamiz.",
        "Bir yuz besh ikkiga bo'linmaydi. Raqamlar yig'indisi olti, shuning uchun uchga bo'lamiz. O'ttiz besh chiqadi.",
        "O'ttiz besh besh bilan tugaydi. Beshga bo'lib, yettini hosil qilamiz.",
        "Yetti tub son. Yettiga bo'lib, birni hosil qilamiz. Demak, to'rt yuz yigirma ikki karra ikki karra uch karra besh karra yettiga teng."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Соедини число с разложением', uz: 'Sonni yoyilmasi bilan moslang' },
    lead: { ru: 'Проверь каждую строку обратным умножением.', uz: "Har bir qatorni teskari ko'paytirib tekshiring." },
    pairs: [
      { number: '18', label: { ru: 'число', uz: 'son' }, reading: { ru: '2 · 3 · 3', uz: '2 · 3 · 3' } },
      { number: '60', label: { ru: 'число', uz: 'son' }, reading: { ru: '2 · 2 · 3 · 5', uz: '2 · 2 · 3 · 5' } },
      { number: '84', label: { ru: 'число', uz: 'son' }, reading: { ru: '2 · 2 · 3 · 7', uz: '2 · 2 · 3 · 7' } }
    ],
    correct_text: { ru: 'Верно. Во всех разложениях остались только простые числа, а их произведение даёт исходное число.', uz: "To'g'ri. Barcha yoyilmalarda faqat tub sonlar qolgan va ularning ko'paytmasi dastlabki sonni beradi." },
    why: {
      ru: ['18 = 2 · 3 · 3; 60 = 2 · 2 · 3 · 5.', '84 = 2 · 2 · 3 · 7.', 'Произведение в каждой строке даёт число слева.'],
      uz: ['18 = 2 · 3 · 3; 60 = 2 · 2 · 3 · 5.', '84 = 2 · 2 · 3 · 7.', "Har bir qatordagi ko'paytma chapdagi sonni beradi."]
    },
    hint: { ru: 'Сначала посчитай произведение справа. Оно должно точно совпасть с числом слева.', uz: "Avval o'ng tomondagi ko'paytmani hisoblang. U chapdagi songa aynan teng bo'lishi kerak." },
    audio: {
      intro: { ru: 'Соедини каждое число с его разложением на простые множители. Нажми на число, затем выбери строку. Проверяй обратным умножением.', uz: "Har bir sonni tub ko'paytuvchilarga yoyilmasi bilan moslang. Songa bosing, keyin qatorni tanlang. Teskari ko'paytirib tekshiring." },
      on_correct: { ru: 'Верно, все простые разложения на местах.', uz: "To'g'ri, barcha tub yoyilmalar o'z o'rniga tushdi." },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Верное разложение или нет?', uz: "To'g'ri yoyilmami yoki yo'q?" },
    lead: { ru: 'В верном разложении все множители простые и их произведение равно числу слева.', uz: "To'g'ri yoyilmada barcha ko'paytuvchilar tub bo'ladi va ularning ko'paytmasi chapdagi songa teng chiqadi." },
    bin_a: { ru: 'Верно', uz: "To'g'ri" },
    bin_b: { ru: 'Неверно', uz: 'Xato' },
    cards: [
      { label: '72 = 2 · 2 · 2 · 3 · 3', bin: 'a' },
      { label: '90 = 2 · 3 · 3 · 5', bin: 'a' },
      { label: '100 = 2 · 2 · 5 · 5', bin: 'a' },
      { label: '72 = 2 · 3 · 12', bin: 'b' },
      { label: '90 = 3 · 30', bin: 'b' },
      { label: '100 = 4 · 25', bin: 'b' }
    ],
    hint: { ru: 'Числа 12, 30, 4 и 25 составные. Если они остались справа, разложение ещё не закончено.', uz: "12, 30, 4 va 25 murakkab sonlar. Agar ular o'ng tomonda qolgan bo'lsa, yoyish hali tugamagan." },
    correct_text: { ru: 'Верно. В верных строках справа только простые числа. В неверных строках остались составные множители 12, 30, 4 или 25.', uz: "To'g'ri. To'g'ri qatorlarda o'ng tomonda faqat tub sonlar bor. Xato qatorlarda esa 12, 30, 4 yoki 25 kabi murakkab ko'paytuvchilar qolgan." },
    why: {
      ru: ['В верном разложении все множители должны быть простыми.', '12, 30, 4 и 25 — составные, поэтому строки с ними не закончены.', 'В остальных трёх строках справа стоят только простые множители.'],
      uz: ["To'g'ri yoyilmada barcha ko'paytuvchilar tub bo'lishi kerak.", "12, 30, 4 va 25 murakkab, shuning uchun ular qatnashgan yoyilmalar tugallanmagan.", "Qolgan uchta yozuvda faqat tub ko'paytuvchilar bor."]
    },
    audio: {
      intro: { ru: 'Раздели записи на две группы: верное разложение или неверное. В верном разложении все множители простые и их произведение равно числу слева.', uz: "Yozuvlarni ikki guruhga ajrating: to'g'ri yoyilma yoki xato yoyilma. To'g'ri yoyilmada barcha ko'paytuvchilar tub bo'ladi va ularning ko'paytmasi chapdagi songa teng chiqadi." },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi." },
      on_wrong: { ru: 'Проверь, все ли множители простые.', uz: "Barcha ko'paytuvchilar tub ekanini tekshiring." }
    }
  },

  s13: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
    label: { ru: 'финальная задача', uz: 'yakuniy masala' },
    context: { ru: 'Закрепим способ на числе 180: разложи его столбиком до единицы.', uz: "Usulni 180 sonida mustahkamlaymiz: uni ustun shaklida birgacha ajrating." },
    question: { ru: 'Сколько простых множителей получится у числа 180?', uz: "180 sonida nechta tub ko'paytuvchi chiqadi?" },
    answer: '5',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно, 5 множителей: 180 = 2 · 2 · 3 · 3 · 5.', uz: "To'g'ri, 5 ta ko'paytuvchi: 180 = 2 · 2 · 3 · 3 · 5." },
    why: {
      ru: ['180 — чётное, поэтому 180 : 2 = 90, затем 90 : 2 = 45.', '45 делится на 3: 45 : 3 = 15, затем 15 : 3 = 5.', '5 — простое число: 5 : 5 = 1. На единице столбик заканчивается.', 'Значит, 180 = 2 · 2 · 3 · 3 · 5 — всего 5 простых множителей.'],
      uz: ["180 juft son, shuning uchun 180 : 2 = 90, keyin 90 : 2 = 45.", "45 soni 3 ga bo'linadi: 45 : 3 = 15, keyin 15 : 3 = 5.", "5 tub son: 5 : 5 = 1. Ustun 1 sonida tugaydi.", "Demak, 180 = 2 · 2 · 3 · 3 · 5 — jami 5 ta tub ko'paytuvchi."]
    },
    hint: { ru: 'Иди по столбику: 180, 90, 45, 15, 5, 1. Справа получатся 2, 2, 3, 3 и 5.', uz: "Ustun bo'ylab yuring: 180, 90, 45, 15, 5, 1. O'ng tomonda 2, 2, 3, 3 va 5 chiqadi." },
    fact: { ru: 'Разложение на простые множители у каждого числа единственное — в каком порядке ни дели, набор множителей получится тот же. Это правило называют основной теоремой арифметики.', uz: "Har bir sonning tub ko'paytuvchilarga yoyilmasi yagona — qanday tartibda bo'lmang, ko'paytuvchilar to'plami bir xil chiqadi. Bu qoidani arifmetikaning asosiy teoremasi deyishadi." },
    fact_audio: { ru: 'Знаешь ли ты? Разложение на простые множители у каждого числа единственное. В каком порядке ни дели, набор множителей получится тот же. Это правило называют основной теоремой арифметики.', uz: "Bilasizmi? Har bir sonning tub ko'paytuvchilarga yoyilmasi yagona. Qanday tartibda bo'lmang, ko'paytuvchilar to'plami bir xil chiqadi. Bu qoidani arifmetikaning asosiy teoremasi deyishadi." },
    audio: {
      intro: { ru: 'Финальная задача. Закрепим способ на числе сто восемьдесят. Разложи его столбиком до единицы. Сколько простых множителей получится? Набери ответ.', uz: "Yakuniy masala. Usulni bir yuz sakson sonida mustahkamlaymiz. Uni ustun shaklida birgacha ajrating. Nechta tub ko'paytuvchi chiqadi? Javobni tering." },
      on_correct: { ru: 'Верно, пять простых множителей.', uz: "To'g'ri, beshta tub ko'paytuvchi." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi" },
    heading: { ru: 'Простые и составные числа', uz: 'Tub va murakkab sonlar' },
    score_label: { ru: 'Ваш результат по заданиям:', uz: "Topshiriqlar bo'yicha natijangiz:" },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'У простого числа ровно два делителя: 1 и оно само. У составного — больше двух.', uz: "Tub sonning roppa-rosa ikkita bo'luvchisi bor: 1 va sonning o'zi. Murakkabniki esa ikkitadan ko'p." },
    main_2: { ru: 'Число 1 не простое и не составное — у него всего один делитель. Самое маленькое простое число — 2.', uz: "1 soni na tub, na murakkab — uning bor-yo'g'i bitta bo'luvchisi bor. Eng kichik tub son — 2." },
    main_3: { ru: 'Составное число раскладывают столбиком до 1, каждый раз выбирая самый маленький подходящий простой делитель.', uz: "Murakkab sonni har safar eng kichik mos tub bo'luvchini tanlab, ustun shaklida 1 gacha ajratamiz." },
    hook_close: { ru: 'Теперь мы умеем не только отличать 13 от 12, но и раскладывать составные числа: 180 = 2 · 2 · 3 · 3 · 5.', uz: "Endi 13 ni 12 dan ajratishni ham, murakkab sonlarni yoyishni ham bilamiz: 180 = 2 · 2 · 3 · 3 · 5." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Nimaga tayanadi' },
    conn_refs: { ru: 'признаки делимости на 2, 3, 5 и 9', uz: "2, 3, 5 va 9 ga bo'linish alomatlari" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'наибольший общий делитель (НОД)', uz: "eng katta umumiy bo'luvchi (EKUB)" },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'У простого числа ровно два делителя: единица и оно само. У составного делителей больше двух. А единица не простая и не составная, у неё всего один делитель.',
        'Составное число раскладывают столбиком до единицы. Каждый раз выбирают самый маленький подходящий простой делитель. Так мы разложили сто восемьдесят: два умножить на два умножить на три умножить на три умножить на пять.'
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Tub sonning roppa-rosa ikkita bo'luvchisi bor: bir va sonning o'zi. Murakkab sonda bo'luvchilar ikkitadan ko'p. Bir soni esa na tub, na murakkab, uning bor-yo'g'i bitta bo'luvchisi bor.",
        "Murakkab son ustun shaklida birgacha ajratiladi. Har safar eng kichik mos tub bo'luvchi tanlanadi. Shu usul bilan bir yuz saksonni ajratdik: ikki karra ikki karra uch karra uch karra besh."
      ]
    }
  }
};

// ============================================================
// SHUFFLE / FORMAT / ANIM HELPERS (div_6_04)
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const fmtNum = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffleArr = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const tick = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick); else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
const CountUp = ({ target, duration, style, className }) => {
  const v = useCountUp(target, duration);
  return <span className={className} style={style}>{fmtNum(v)}</span>;
};

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// BO'LUVCHILAR SONI — darsning asosiy vizual modeli.
// Dars01 da "nechta xil usulda teng joylash mumkin" savoli qo'yilgan edi; bu yerda
// o'sha savol hukm chiqaradi: roppa-rosa 2 ta bo'luvchi -> tub, ko'proq -> murakkab.
// Markaziy komponent — DivisorFan.
// ============================================================
const CoinIcon = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill="#C9922B"/>
    <circle cx="12" cy="12" r="8" fill="#F6C453"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="#C9922B" strokeWidth="0.9" opacity="0.6"/>
  </svg>
);

// Narx yorlig'i: son + birlik. Do'kondagi narx shaklida.
const PriceTag = ({ value, unit, tone = 'plain', size = 'md' }) => {
  const bg = tone === 'ok' ? '#E3F0E8' : (tone === 'no' ? '#FFE8E1' : '#FFFFFF');
  const fg = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : T.ink);
  const bd = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : 'rgba(167, 166, 162, 0.4)');
  const fs = size === 'lg' ? 'clamp(22px, 5vw, 34px)' : 'clamp(15px, 3vw, 21px)';
  return (
    <span className="pr-tag" style={{ background: bg, borderColor: bd, color: fg }}>
      <span className="mono" style={{ fontSize: fs, fontWeight: 700, lineHeight: 1 }}>{value}</span>
      {unit && <span className="mono" style={{ fontSize: 'clamp(9px, 1.9vw, 11px)', opacity: 0.75 }}>{unit}</span>}
    </span>
  );
};

const divisorsOf = (n) => { const r = []; for (let i = 1; i <= n; i++) { if (n % i === 0) r.push(i); } return r; };

// Darsning yuragi: sonning barcha bo'luvchilari chip bo'lib yoyiladi va sanaladi.
// Tub sonda ikkita chip qoladi — bu ko'zga darrov tashlanadi.
const DivisorFan = ({ value, tone = 'plain', countLabel, size = 'md' }) => {
  const ds = divisorsOf(value);
  const col = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : T.ink2);
  const bg = tone === 'ok' ? '#E3F0E8' : (tone === 'no' ? '#FFE8E1' : '#F1EFE9');
  const fs = size === 'lg' ? 'clamp(15px, 3vw, 20px)' : 'clamp(13px, 2.5vw, 17px)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(4px, 1.1vw, 8px)' }}>
        {ds.map((d, i) => (
          <span key={d} className="df-chip mono" style={{ fontSize: fs, animationDelay: `${i * 0.06}s` }}>{d}</span>
        ))}
      </div>
      <span className="df-count mono" style={{ color: col, background: bg, borderColor: col }}>
        {ds.length}{countLabel ? ` ${countLabel}` : ''}
      </span>
    </div>
  );
};

// Eratosfen g'alviri — KO'RSATUV (bola bosmaydi, qadamlar avtomatik o'chiradi).
// step 0: 1 o'chadi · 1: 2 ning karralari · 2: 3 ning karralari · 3: 5 va 7 niki.
// 50 gacha 2, 3, 5, 7 ni tekshirish yetarli, chunki 7 * 7 = 49.
const SIEVE_PRIMES = [[], [2], [2, 3], [2, 3, 5, 7]];
const sieveState = (n, step) => {
  if (n === 1) return 'crossed';
  const ps = SIEVE_PRIMES[Math.min(step, SIEVE_PRIMES.length - 1)];
  for (const p of ps) { if (n !== p && n % p === 0) return 'crossed'; }
  return step >= 3 ? 'prime' : 'plain';
};
const SieveGrid = ({ max = 50, step = 0 }) => (
  <div className="sv-grid">
    {Array.from({ length: max }).map((_, i) => {
      const n = i + 1;
      const st = sieveState(n, step);
      return <span key={n} className={`sv-cell mono sv-${st}`}>{n}</span>;
    })}
  </div>
);

// Tub ko'paytuvchilarga yoyish: 12 = 2 * 2 * 3 (Dars05 uchun tayyorgarlik).
const primeFactors = (n) => { const r = []; let x = n; for (let p = 2; p * p <= x; p++) { while (x % p === 0) { r.push(p); x /= p; } } if (x > 1) r.push(x); return r; };
const FactorChain = ({ value, showValue = true }) => {
  const fs = primeFactors(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(4px, 1.1vw, 8px)' }}>
      {showValue && (
        <>
          <span className="mono" style={{ fontSize: 'clamp(17px, 3.4vw, 24px)', fontWeight: 700, color: T.ink }}>{value}</span>
          <span className="mono" style={{ fontSize: 'clamp(15px, 3vw, 20px)', color: T.ink3 }}>=</span>
        </>
      )}
      {fs.map((f, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="mono" style={{ fontSize: 'clamp(13px, 2.6vw, 17px)', color: T.ink3 }}>·</span>}
          <span className="fc-chip mono" style={{ animationDelay: `${i * 0.09}s` }}>{f}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

// Ustun (столбик) usuli: sonni tublarga ketma-ket bo'lamiz — chapda bo'linuvchi,
// o'ngda tub bo'luvchi, pastda 1 qolguncha. Qatorlar ketma-ket paydo bo'ladi (animatsiya).
const FactorLadder = ({ value, visibleRows = Infinity }) => {
  const rows = [];
  let x = value, p = 2;
  while (x > 1) { if (x % p === 0) { rows.push([x, p]); x = x / p; } else { p = p === 2 ? 3 : p + 2; } }
  const shown = rows.slice(0, Math.max(0, visibleRows));
  const complete = shown.length >= rows.length;
  return (
    <div className="ladder" aria-label={`${value}`}>
      {shown.map(([n, d], i) => (
        <div className="ladder-row" key={i} style={{ animationDelay: `${i * 0.16}s` }}>
          <span className="ladder-n mono">{n}</span>
          <span className="ladder-bar"/>
          <span className="ladder-p mono">{d}</span>
        </div>
      ))}
      {!complete && rows[shown.length] && (
        <div className="ladder-row fade-up">
          <span className="ladder-n mono">{rows[shown.length][0]}</span>
          <span className="ladder-bar"/>
          <span className="ladder-p mono"/>
        </div>
      )}
      {complete && (
        <div className="ladder-row" style={{ animationDelay: `${rows.length * 0.16}s` }}>
          <span className="ladder-n ladder-one mono">1</span>
          <span className="ladder-bar"/>
          <span className="ladder-p mono"/>
        </div>
      )}
    </div>
  );
};

const FactorPrompt = ({ value, lang }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div className="ladder">
      <div className="ladder-row">
        <span className="ladder-n mono">{value}</span>
        <span className="ladder-bar"/>
        <span className="ladder-p mono" style={{ color: T.accent }}>?</span>
      </div>
    </div>
    <p className="small" style={{ margin: 0, color: T.ink3, textAlign: 'center' }}>
      {lang === 'uz' ? "Eng kichik mos tub bo'luvchidan boshlang" : 'Начни с самого маленького подходящего простого делителя'}
    </p>
  </div>
);

// Alomat / ta'rif chiplari (qoida ekranlarida).
const DivisorChips = ({ list, active = -1 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)' }}>
    {list.map((d, i) => (
      <span key={i} className="dv-chip" style={{ animationDelay: `${i * 0.07}s`, background: active === i ? T.accentSoft : '#FFFFFF', color: active === i ? T.accent : T.ink, borderColor: active === i ? T.accent : 'rgba(167, 166, 162, 0.35)' }}>{d}</span>
    ))}
  </div>
);
// Xona katakchalari: bir sinf ichidagi uch raqam to'lganda yashilga o'tadi.
const PlaceGrid = ({ answer, filled }) => {
  const digits = String(answer).split('');
  const n = digits.length;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
      {digits.map((d, i) => {
        const classBreak = (n - i) % 3 === 0 && i !== 0;
        return (
          <React.Fragment key={i}>
            {classBreak && <span style={{ width: 8 }}/>}
            <span className={`place-cell ${filled ? 'filled' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{filled ? d : '·'}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================
// FACTCARD — ovozli fakt to'g'ri javobdan keyin (ko'k tema + darsga xos Anim*).
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',    uz: "Bilasizmi? · IT" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};
const AnimDigits = () => (<div className="fa-dg" aria-hidden="true">{Array.from({ length: 3 }).map((_, g) => (<span key={g} className="fa-dg-grp">{Array.from({ length: 3 }).map((_, d) => (<i key={d}/>))}</span>))}</div>);
const AnimStars = () => (<div className="fa-st" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => (<span key={i} style={{ animationDelay: `${i * 0.22}s` }}/>))}</div>);
const AnimData = () => (<div className="fa-da" aria-hidden="true">{[40, 60, 80, 100].map((h, i) => (<span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }}/>))}</div>);

// ============================================================
// SHARED SCREEN HELPERS
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Floaters = () => (<div className="amb" aria-hidden="true"><span className="amb-o amb-o1"/><span className="amb-o amb-o2"/><span className="amb-o amb-o3"/></div>);
const StepLine = ({ children, soft }) => (
  <div className={`fade-up ${soft ? 'frame-tip' : 'frame'}`} style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
    <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
  </div>
);
// Bosqichli izohlar yig'iladi: oldingi qatorlar (so'lg'in) qoladi, yangisi pastdan chiqadi (fade-up).
const StepLinesAccum = ({ lines, step, className = '' }) => (
  <div className={`g6-step-lines ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 12px)' }}>
    {lines.slice(0, step + 1).map((ln, i) => {
      const isCurrent = i === step;
      return (
        <div key={i} className={`${isCurrent ? 'fade-up ' : ''}frame-tip g6-explanation-step`} style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
          <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
          <p className="body g6-explanation-text" style={{ margin: 0, color: T.ink2 }}>{ln}</p>
        </div>
      );
    })}
  </div>
);
const HintBlock = ({ show, children }) => {
  const lang = useLang();
  if (!show) return null;
  return (
    <div className="frame-tip fade-up" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
      <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
      <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
    </div>
  );
};
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// Bosqichli kashfiyot: bitta ovozli qator + bitta ko'rinadigan izoh (skrollsiz, qatorlar yig'ilmaydi).
const StepExploration = ({ screen, screenContent, onNext, onPrev, totalScreens, renderBody, factOnLast }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const last = lines.length - 1;
  const narration = useMemo(() => {
    const items = lines.map((line, i) => ({
      id: `s${screen}_a${i}`,
      text: toTtsMath(line, lang),
      trigger: i === 0 ? 'on_mount' : 'after_previous',
      waits_for: null,
      pauseAfterMs: i < last ? 650 : 0,
    }));
    if (factOnLast && c.fact_audio?.[lang]) {
      items.push({
        id: `s${screen}_fact`,
        text: toTtsMath(c.fact_audio[lang], lang),
        trigger: 'after_previous',
        waits_for: null,
      });
    }
    return items;
  }, [c, factOnLast, lang, last, lines, screen]);
  const audio = useAudio(narration);
  const [mutedStep, setMutedStep] = useState(0);
  const currentMatch = String(audio.currentSegment || '').match(new RegExp(`^s${screen}_a(\\d+)$`));
  const completedMatch = String(audio.lastCompletedSegment || '').match(new RegExp(`^s${screen}_a(\\d+)$`));
  const factCompleted = audio.lastCompletedSegment === `s${screen}_fact`;
  const voicedStep = factCompleted
    ? last
    : Math.min(Number(currentMatch?.[1] ?? completedMatch?.[1] ?? 0), last);
  const step = audio.muted ? mutedStep : voicedStep;

  const mutedAdvance = () => {
    if (step < last) setMutedStep((value) => Math.min(value + 1, last));
    else onNext();
  };
  const ready = audio.muted ? step >= last : (step >= last && audio.hasStarted && !audio.isBusy);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!audio.muted && !ready} label={<NextLabel/>} onClick={audio.muted ? mutedAdvance : onNext}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      {renderBody({ t, lang, step, last, audio })}
    </Stage>
  );
};

// Qoida ekrani (s3, s6): ikki qoida qatori (pale-yellow) + misol.
const RuleScreen = ({ screen, screenContent, onNext, onPrev, totalScreens, exampleNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_a`, text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 20px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_1)}</p></div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_2)}</p></div>
        <div className="frame fade-up delay-3" style={{ position: 'relative', textAlign: 'center' }}>
          {exampleNode || <p className="body" style={{ margin: 0, color: T.ink }}>{t(c.example)}</p>}
        </div>
      </div>
    </Stage>
  );
};

// Javob terish ekrani (s9, s13) — keep-visible: savol qoladi, faqat input to'ladi/yashilga o'tadi.
const InputScreen = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, whyNode, factNode, figureNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const norm = (s) => String(s).replace(/[^0-9]/g, '');
  const solvedInit = storedAnswer !== undefined && norm(storedAnswer.studentAnswer) === norm(c.answer);
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(solvedInit);
  const [showHint, setShowHint] = useState(storedAnswer !== undefined && !solvedInit);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.fb_correct[lang],
    whyNode,
    factAudio: c.fact_audio?.[lang],
    initiallyComplete: solvedInit,
  });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);
  const isCorrect = norm(value) === norm(c.answer) && norm(value) !== '';
  const changeValue = (nextValue) => {
    if (showHint && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    setValue(nextValue);
  };

  const submit = () => {
    if (norm(value) === '' || solved) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: null, correctIndex: null, correctAnswer: c.answer, studentAnswerIndex: null, studentAnswer: String(value), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); sfx.playCorrect(); post.start(); } else { setShowHint(true); sfx.playWrong(); }
    if (!isCorrect && !audio.muted) {
      const e = getAudioEngine();
      if (e) interruptWithSpeech(e, c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang, `s${screen}_wrong`);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)} · {t(c.label)}</p>
          {/* Kontekstda masalaning sharti (masalan 4?2) turadi — u eng och kulrangda
              qolib ketmasligi kerak, shuning uchun ink2. Savolning o'zi esa boshqa
              sarlavhalardan ajralib turishi uchun kattaroq va to'q. */}
          {c.context && <p className="small" style={{ marginTop: 6, color: T.ink2 }}>{t(c.context)}</p>}
          <h2 className="title h-sub" style={{ marginTop: 8, fontSize: 'clamp(19px, 3.1vw, 23px)', color: T.ink }}>{t(c.question)}</h2>
        </div>
        {figureNode && <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.2vw, 18px)' }}>{typeof figureNode === 'function' ? figureNode(solved) : figureNode}</div>}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : (showHint ? 'wrong' : '')}`} value={value} placeholder={t(c.placeholder)} onChange={e => changeValue(e.target.value)} disabled={solved} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'min(100%, 320px)' }}/>
          <PlaceGrid answer={c.answer} filled={solved}/>
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!value} onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// Xato o'qishni top (s7) — keep-visible: to'g'ri (xato) variant qoladi, qolganlari yig'iladi.
const OddOneOut = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const correctIdx = c.errorIdx;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const factRef = useRevealScroll(solved && !!factNode, 900);

  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isC = i === correctIdx;
    if (firstTryRef.current === null) firstTryRef.current = isC;
    setPicked(i);
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isC) {
      setSolved(true);
      sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: c.items.map(it => it.num), correctIndex: correctIdx, correctAnswer: c.items[correctIdx].num, studentAnswerIndex: i, studentAnswer: c.items[i].num, correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }
    if (!audio.muted) {
      const e = getAudioEngine();
      if (e) {
        const wv = (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
        if (isC) {
          e.interruptWith([
            { id: `s${screen}_correct`, text: toTtsMath(c.audio.on_correct[lang], lang), trigger: 'manual', waits_for: null },
            { id: `s${screen}_why_title`, text: whyLabel(lang), trigger: 'after_previous', waits_for: null },
            { id: `s${screen}_why`, text: toTtsMath(c.correct_text?.[lang], lang), trigger: 'after_previous', waits_for: null },
          ]);
        } else {
          interruptWithSpeech(e, wv, lang, `s${screen}_wrong_${i}`);
        }
      }
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.question)}</h2>
          <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {c.items.map((it, i) => {
            const isCorrect = i === correctIdx;
            const isWrongPicked = wrong.has(i);
            const collapse = solved && !isCorrect;
            let cls = 'option';
            if (collapse) cls += ' g6-option-collapsed';
            if (solved && isCorrect) cls += ' option-correct';
            else if (isWrongPicked) cls += ' option-picked-wrong';
            return (
              <button key={i} className={cls} disabled={solved || isWrongPicked} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 18px)' : 'clamp(11px, 1.7vw, 14px) clamp(14px, 2.1vw, 18px)', maxHeight: collapse ? 0 : 140, opacity: collapse ? 0 : 1, overflow: 'hidden', borderWidth: collapse ? 0 : undefined, display: 'flex', alignItems: 'center', gap: 12, transition: 'opacity 0.5s cubic-bezier(0.33,0,0.2,1), max-height 0.65s cubic-bezier(0.33,0,0.2,1), padding 0.5s cubic-bezier(0.33,0,0.2,1)', transitionDelay: collapse ? `${i * 0.06}s` : '0s' }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>{solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}</span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                  <span className="display" style={{ fontSize: 'clamp(16px, 2.6vw, 22px)' }}>{it.num}</span>
                  <span className="small" style={{ color: T.ink2 }}>{t(it.reading)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}</p>
          {solved && audioReached(audio, 'whyTitle') && <p className="small mono fade-up" style={{ margin: '0 0 6px', color: T.ink2, fontWeight: 700 }}>{whyLabel(lang)}</p>}
          {(!solved || audioReached(audio, 'why')) && <p className="body fade-up" style={{ margin: 0 }}>{t(solved ? c.correct_text : (c[`wrong_${picked}`] || c.audio.on_wrong))}</p>}
        </FeedbackBlock>
        {solved && factNode && audioReached(audio, 'fact') && <div ref={factRef}>{factNode}</div>}
      </div>
    </Stage>
  );
};

// Tasniflash (s12) — son bittalab chiqadi, bola guruhni bosadi; веди-до-верного; joylanganlar yashil chip.
const Classify = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, whyNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const cards = c.cards;
  const total = cards.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  // Tartib HAR seansda RANDOM (Fisher-Yates, useState init — seans ichida o'zgarmaydi, tiklanish buzilmaydi).
  const [deck] = useState(() => shuffleArr([...Array(total).keys()]));
  const [pos, setPos] = useState(wasSolved ? total : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? cards.map(c2 => c2.bin) : []));
  const [wrongBin, setWrongBin] = useState(null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const solved = pos >= total;
  const cardIdx = solved ? -1 : deck[pos];
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode,
    initiallyComplete: wasSolved,
  });
  const whyRef = useRevealScroll(post.showWhy, 300);

  const tap = (bin) => {
    if (solved) return;
    const isC = bin === cards[cardIdx].bin;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isC) {
      setWrongBin(null);
      const np = [...placed]; np[cardIdx] = bin; setPlaced(np);
      const nPos = pos + 1; setPos(nPos);
      if (nPos >= total) {
        if (firstTryRef.current === null) firstTryRef.current = true;
        onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'sorted', studentAnswer: JSON.stringify(np), correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
        sfx.playCorrect();
        post.start();
      } else if (!audio.muted) {
        const e = getAudioEngine();
        if (e) interruptWithSpeech(e, lang === 'uz' ? "To'g'ri, davom eting." : 'Верно, продолжай.', lang, `s${screen}_item_correct_${nPos}`);
      }
    } else {
      if (firstTryRef.current === null || firstTryRef.current === true) firstTryRef.current = false;
      setWrongBin(bin);
      sfx.playWrong();
      if (!audio.muted) {
        const e = getAudioEngine();
        if (e) interruptWithSpeech(e, c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang, `s${screen}_wrong`);
      }
    }
  };

  const bins = [{ key: 'a', label: c.bin_a }, { key: 'b', label: c.bin_b }];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        {!solved && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 92, justifyContent: 'center' }}>
            <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{pos + 1} / {total}</p>
            <div key={pos} className="display fade-up" style={{ fontSize: 'clamp(26px, 5.6vw, 42px)', color: T.ink }}>{cards[cardIdx].label}</div>
          </div>
        )}
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {bins.map(b => {
            const chips = placed.map((p, k) => (p === b.key ? cards[k].label : null)).filter(Boolean);
            const isWrong = wrongBin === b.key;
            return (
              <button key={b.key} disabled={solved} onClick={() => tap(b.key)} className="option" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', padding: 'clamp(12px, 2vw, 16px)', borderWidth: isWrong ? 2 : undefined, borderStyle: isWrong ? 'solid' : undefined, borderColor: isWrong ? T.accent : undefined, cursor: solved ? 'default' : 'pointer' }}>
                <span className="small mono" style={{ color: T.ink2, fontWeight: 700 }}>{t(b.label)}</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {chips.map((ch, k) => (<span key={k} className="mono small" style={{ padding: '3px 8px', borderRadius: 8, background: '#E3F0E8', color: T.success }}>{ch}</span>))}
                </span>
              </button>
            );
          })}
        </div>
        {wrongBin && !solved && <HintBlock show={true}>{t(c.hint)}</HintBlock>}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
      </div>
    </Stage>
  );
};

// Moslash (s11) — songa bos, ro'yxatdan o'qilishini tanla; keep-visible (savol qoladi); веди-до-верного.
const DragMatch = ({ screen, screenContent, onAnswer, onNext, onPrev, totalScreens, whyNode, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const isMobile = useIsMobile();
  const pairs = c.pairs;
  const n = pairs.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [order] = useState(() => shuffleArr([...Array(n).keys()]));
  const [assign, setAssign] = useState(() => Array(n).fill(null));
  const [activeSlot, setActiveSlot] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(null);
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode,
    factAudio: c.fact_audio?.[lang],
  });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);
  // Slot bosilganda pastda ochiladigan variantlar ro'yxati — tap natijasi, mobilda
  // ekrandan pastda qolmasligi uchun ko'rinishga olib kelinadi.
  const optionsRef = useRevealScroll(!solved && activeSlot !== null);

  const allPlaced = assign.every(a => a !== null);
  const isCorrect = assign.every((a, k) => a === k);
  const slotOf = (pairIdx) => assign.findIndex(a => a === pairIdx);

  const assignToActive = (pairIdx) => {
    if (solved || activeSlot === null) return;
    if (showHint && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    setAssign(prev => { const nx = prev.map(a => (a === pairIdx ? null : a)); nx[activeSlot] = pairIdx; return nx; });
    setActiveSlot(null);
  };
  const clearSlot = (k, e) => {
    if (e) e.stopPropagation();
    if (solved) return;
    if (showHint && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    setAssign(prev => { const nx = [...prev]; nx[k] = null; return nx; });
  };

  const check = () => {
    if (solved || !allPlaced) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'match', studentAnswer: JSON.stringify(assign), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); setActiveSlot(null); sfx.playCorrect(); post.start(); } else { setShowHint(true); sfx.playWrong(); }
    if (!isCorrect && !audio.muted) {
      const e = getAudioEngine();
      if (e) interruptWithSpeech(e, c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang, `s${screen}_wrong`);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  const readingFont = isMobile ? 'clamp(12px, 3.4vw, 14px)' : 'clamp(13px, 1.7vw, 15px)';
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="g6-match-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        <div className="fade-up delay-1 g6-match-rows" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pairs.map((pr, k) => {
            const placedPair = assign[k];
            const active = activeSlot === k;
            return (
              <div key={k} className="frame" onClick={() => { if (!solved) setActiveSlot(active ? null : k); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(10px,1.8vw,14px)', cursor: solved ? 'default' : 'pointer', border: `2px solid ${solved ? T.success : (active ? T.accent : 'transparent')}`, transition: 'border-color 0.25s ease' }}>
                <div style={{ minWidth: 'clamp(100px, 28vw, 150px)' }}>
                  <div className="display" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', color: T.ink }}>{pr.number}</div>
                  <div className="small mono" style={{ color: T.ink3 }}>{t(pr.label)}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {placedPair !== null ? (
                    <>
                      <span style={{ flex: 1, fontSize: readingFont, lineHeight: 1.3, color: solved ? T.success : T.ink }}>{t(pairs[placedPair].reading)}</span>
                      {!solved && <button onClick={(e) => clearSlot(k, e)} aria-label={lang === 'uz' ? 'tozalash' : 'очистить'} className="mono" style={{ border: 'none', background: 'transparent', color: T.ink3, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>}
                    </>
                  ) : (
                    <span className="small" style={{ color: active ? T.accent : T.ink3 }}>{active ? (lang === 'uz' ? "ro'yxatdan tanlang ↓" : 'выбери из списка ↓') : (lang === 'uz' ? 'tanlash' : 'выбрать')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && activeSlot !== null && (
          <div ref={optionsRef} className="fade-up g6-match-options" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.map(pi => {
              const usedSlot = slotOf(pi);
              const usedHere = usedSlot === activeSlot;
              return (
                <button key={pi} onClick={() => assignToActive(pi)} className="option" style={{ padding: 'clamp(10px,1.8vw,13px) clamp(12px,2vw,16px)', fontSize: readingFont, lineHeight: 1.3, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, opacity: usedSlot >= 0 && !usedHere ? 0.5 : 1, borderColor: usedHere ? T.accent : undefined }}>
                  <span className="mono small" style={{ minWidth: 18, color: usedSlot >= 0 ? T.accent : T.ink3 }}>{usedSlot >= 0 ? (usedHere ? '✓' : '•') : ''}</span>
                  <span style={{ flex: 1 }}>{t(pairs[pi].reading)}</span>
                </button>
              );
            })}
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// Qiyinlik pog'onasi: bo'luvchilar -> tub/murakkab -> 12 -> 18 -> 36 -> 42
// -> 420 -> 180. Ustun har bir ovozli qadam bilan bittadan qator ochadi.
// ============================================================
const UNIT = { ru: 'тыс.', uz: 'ming' };
const LBL_DIVISORS = { ru: 'делителя', uz: "bo'luvchi" };

const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: `${lang === 'uz' ? `Dars mavzusi: ${c.topic.uz}. ` : `Тема урока: ${c.topic.ru}. `}${c.audio.intro[lang]}`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const introReady = audio.muted || (audio.hasStarted && !audio.isBusy);
  const introStages = useIntroStages({ start: introReady, optionsReady: introReady });
  const optionsRef = useRevealScroll(introStages.showOptions);
  const pick = (v) => { if (pickedRef.current) return; pickedRef.current = true; setPicked(v); onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: v, correct: true }); audio.triggerEvent('option_picked'); setTimeout(onNext, 300); };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className="g6-custom-hook" style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 1.8vw, 14px)', textAlign: 'center' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.accent }}>{t(c.eyebrow)}</p>
        <h1 className="display fade-up" style={{ position: 'relative', width: '100%', margin: 0, color: T.ink, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: introStages.compact ? 'clamp(30px, 6vw, 48px)' : 'clamp(38px, 8vw, 64px)', fontWeight: 600, fontVariationSettings: '"opsz" 60', lineHeight: 1.14, textAlign: 'center', transform: introStages.compact ? 'translateY(-7px)' : 'none', transition: 'font-size 1.2s cubic-bezier(.2,.7,.3,1), transform 1.2s cubic-bezier(.2,.7,.3,1)' }}>{t(c.topic)}</h1>
        <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: 'clamp(64px, 16vw, 104px)', height: 5, margin: 'clamp(4px,1vw,8px) 0', borderRadius: 99, background: T.accent, boxShadow: '0 0 14px rgba(255,79,40,.45)' }}/>
        <h2 className="body fade-up delay-1" style={{ position: 'relative', maxWidth: '38ch', margin: 0, fontSize: 'clamp(18px, 2.8vw, 21px)', fontWeight: 600, lineHeight: 1.35, textAlign: 'center' }}>{t(c.global_q)}</h2>
        <p className="body fade-up delay-1" style={{ position: 'relative', maxWidth: '62ch', color: T.ink2, margin: 0, textAlign: 'center' }}>{t(c.lead)}</p>
        {introStages.showExample && (
          <>
          <div className="frame fade-up" style={{ position: 'relative', width: '100%', maxWidth: 520, minHeight: 128, alignSelf: 'center', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2.4vw, 18px)', padding: 'clamp(14px, 2.5vw, 18px)', animationDuration: '1.2s' }}>
            <PriceTag value={12} unit={t(UNIT)} size="lg"/>
            <PriceTag value={13} unit={t(UNIT)} size="lg"/>
          </div>
          <div ref={optionsRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'center', gap: 10, width: '100%', maxWidth: 520 }}>
            <div style={{ minHeight: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="small" style={{ margin: 0, color: '#43855F', fontSize: 'clamp(18px, 2.9vw, 21px)', fontWeight: 500, lineHeight: 1.25, textAlign: 'center', opacity: introStages.showPrompt ? 1 : 0, transition: 'opacity 1.05s ease' }}>{lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Готовы начать?'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 520, opacity: introStages.showOptions ? 1 : 0, visibility: introStages.showOptions ? 'visible' : 'hidden', transform: introStages.showOptions ? 'none' : 'translateY(18px)', transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.7,.3,1)' }}>
              <button className="option" style={{ minHeight: 58, padding: 'clamp(14px, 2.5vw, 18px) clamp(18px, 3vw, 24px)', textAlign: 'center', border: '2px solid #D8D3C8', background: '#FFFFFF', color: '#0E0E10', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(18px, 3.2vw, 22px)', fontWeight: 300, lineHeight: 1.2, boxShadow: '0 10px 24px -8px rgba(58,53,48,.24)' }} disabled={picked !== null} onClick={() => pick('know')}>{t(c.opt_yes)}</button>
              <button className="option" style={{ minHeight: 58, padding: 'clamp(14px, 2.5vw, 18px) clamp(18px, 3vw, 24px)', textAlign: 'center', border: '2px solid #D8D3C8', background: '#FFFFFF', color: '#0E0E10', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(18px, 3.2vw, 22px)', fontWeight: 300, lineHeight: 1.2, boxShadow: '0 10px 24px -8px rgba(58,53,48,.24)' }} disabled={picked !== null} onClick={() => pick('learn')}>{t(c.opt_idk)}</button>
            </div>
          </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s1 — o'tgan darslardagi alomatlarni eslash.
const S1_PRICES = [8, 9, 11, 12];
const Screen1 = (props) => {
  const t = useT();
  const c = CONTENT.s1;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [3, 2, 0, 1]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.6vw, 12px)' }}>
      {S1_PRICES.map(v => <PriceTag key={v} value={v} unit={t(UNIT)} tone={solved ? (divisorsOf(v).length === 2 ? 'ok' : 'no') : 'plain'}/>)}
    </div>
  );
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} whyNode={<WhyCard lines={CONTENT.s1.why}/>}/>;
};

// s2 — bo'luvchilarni sanaymiz: ko'p / roppa-rosa ikkita.
const S2_CASES = [12, 13, 18, 19];
const Screen2 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s2} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => {
      const v = S2_CASES[Math.min(step, S2_CASES.length - 1)];
      const two = divisorsOf(v).length === 2;
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s2.title)}</h2>
          <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s2.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <PriceTag value={v} unit={t(UNIT)}/>
            <DivisorFan value={v} tone={two ? 'ok' : 'no'} countLabel={t(LBL_DIVISORS)} size="lg"/>
          </div>
          <StepLinesAccum lines={CONTENT.s2.audio[lang]} step={step}/>
        </div>
      );
    }}/>
);

// s3 — ta'rif: ikkita bo'luvchi / ikkitadan ko'p, yonma-yon.
const Screen3 = (props) => {
  const lang = useLang();
  const example = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{lang === 'uz' ? 'TUB · 13' : 'ПРОСТОЕ · 13'}</span>
        <DivisorFan value={13} tone="ok"/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>{lang === 'uz' ? 'MURAKKAB · 12' : 'СОСТАВНОЕ · 12'}</span>
        <DivisorFan value={12} tone="no"/>
      </div>
    </div>
  );
  return <RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS} exampleNode={example}/>;
};

// s4 — ta'rifni qo'llash. Javobdan keyin to'rttala narx yoyilmasi ochiladi.
const S4_PRICES = [21, 27, 23, 33];
const Screen4 = (props) => {
  const t = useT();
  const c = CONTENT.s4;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [0, 3, 1, 2]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => (solved
    ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{S4_PRICES.map(v => <FactorChain key={v} value={v}/>)}</div>
    : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.6vw, 12px)' }}>{S4_PRICES.map(v => <PriceTag key={v} value={v} unit={t(UNIT)}/>)}</div>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} whyNode={<WhyCard lines={CONTENT.s4.why}/>}/>;
};

// s5 — 1 soni: bitta bo'luvchi, shuning uchun alohida turadi.
const Screen5 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s5} totalScreens={TOTAL_SCREENS} factOnLast
    renderBody={({ t, lang, step, last, audio }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s5.title)}</h2>
        <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s5.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <DivisorFan value={1} tone="no" countLabel={t(LBL_DIVISORS)} size="lg"/>
          {step >= 2 && (
            <span className="dv-chip fade-up" style={{ background: '#FFE8E1', color: T.accent, borderColor: T.accent }}>
              {lang === 'uz' ? 'na tub, na murakkab' : 'ни простое, ни составное'}
            </span>
          )}
        </div>
        <StepLinesAccum lines={CONTENT.s5.audio[lang]} step={step}/>
        {step >= last && audioReached(audio, 'fact') && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={CONTENT.s5.fact}/>}
      </div>
    )}/>
);

// s6 — tub ko'paytuvchi ta'rifi: 12 = 2 · 6 dan 12 = 2 · 2 · 3 gacha.
const Screen6 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s6.title)}</h2>
        <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s6.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {step === 0 && <div className="mono display fade-up" style={{ fontSize: 'clamp(22px, 5vw, 34px)' }}>12 = 2 · 6</div>}
          {step === 1 && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="mono display" style={{ fontSize: 'clamp(20px, 4.5vw, 30px)' }}>12 = 2 · 6</div>
              <div className="mono display" style={{ fontSize: 'clamp(20px, 4.5vw, 30px)', color: T.accent }}>6 = 2 · 3</div>
            </div>
          )}
          {step >= 2 && <FactorChain value={12}/>}
          {step >= 3 && (
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span className="mono small" style={{ color: T.ink3, fontWeight: 700, letterSpacing: '0.12em' }}>{lang === 'uz' ? 'USTUN SHAKLI' : 'СТОЛБИКОМ'}</span>
              <FactorLadder value={12}/>
            </div>
          )}
        </div>
        <StepLinesAccum lines={CONTENT.s6.audio[lang]} step={step}/>
      </div>
    )}/>
);

// s7 — birinchi to'liq ustun: har bir ovozli qadam bilan bitta qator ochiladi.
const Screen7 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s7} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s7.title)}</h2>
        <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s7.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(18px, 4vw, 36px)' }}>
          <FactorLadder value={18} visibleRows={step + 1}/>
          {step >= 3 && <FactorChain value={18}/>}
        </div>
        <StepLinesAccum lines={CONTENT.s7.audio[lang]} step={step}/>
      </div>
    )}/>
);

// s8 — bola ustunning birinchi tub bo'luvchisini tanlaydi.
const Screen8 = (props) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s8;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [2, 0, 3, 1]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => solved
    ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 24 }}><FactorLadder value={42}/><FactorChain value={42}/></div>
    : <FactorPrompt value={42} lang={lang}/>;
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} whyNode={<WhyCard lines={CONTENT.s8.why}/>}/>;
};

const Screen9 = (props) => {
  const lang = useLang();
  const fig = (solved) => solved
    ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 24 }}><FactorLadder value={36}/><FactorChain value={36}/></div>
    : <FactorPrompt value={36} lang={lang}/>;
  return <InputScreen {...props} screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} figureNode={fig} whyNode={<WhyCard lines={CONTENT.s9.why}/>} factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s9.fact}/>}/>;
};

// s10 — katta son: ovoz aytgan sari ustunning aynan bitta yangi qatori ochiladi.
const Screen10 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s10.title)}</h2>
        <p className="small g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2, margin: 0 }}>{t(CONTENT.s10.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(18px, 4vw, 36px)', padding: 'clamp(10px, 2vw, 14px)' }}>
          <FactorLadder value={420} visibleRows={step + 1}/>
          {step >= 4 && <FactorChain value={420}/>}
        </div>
        <StepLinesAccum lines={CONTENT.s10.audio[lang]} step={step}/>
      </div>
    )}/>
);

const Screen11 = (props) => <DragMatch {...props} screenContent={CONTENT.s11} totalScreens={TOTAL_SCREENS} whyNode={<WhyCard lines={CONTENT.s11.why}/>}/>;

const Screen12 = (props) => <Classify {...props} screenContent={CONTENT.s12} totalScreens={TOTAL_SCREENS} whyNode={<WhyCard lines={CONTENT.s12.why}/>}/>;

const Screen13 = (props) => {
  const lang = useLang();
  const fig = (solved) => solved
    ? <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 24 }}><FactorLadder value={180}/><FactorChain value={180}/></div>
    : <FactorPrompt value={180} lang={lang}/>;
  return <InputScreen {...props} screenContent={CONTENT.s13} totalScreens={TOTAL_SCREENS} figureNode={fig} whyNode={<WhyCard lines={CONTENT.s13.why}/>} factNode={<FactCard badge={FB_SCI} anim={<AnimData/>} text={CONTENT.s13.fact}/>}/>;
};
const Screen14 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's14_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach((l, i) => speakMath(e, l, lang, `s14_a${i + 1}`, 300)); }
    /* eslint-disable-next-line */
  }, []);
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers[i]?.correct).length;
  const total = scoredIdx.length;
  const mains = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="g6-final-slide" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow" style={{ color: T.success }}>{t(c.eyebrow)}</p>
            <h2 className="title" style={{ marginTop: 8, fontSize: 'clamp(30px, 6vw, 50px)', lineHeight: 1.04 }}>{t(c.heading)}</h2>
          </div>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', margin: '-4px 0 0', color: T.ink2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 9 }}>
          <span>{t(c.score_label)}</span>
          <strong className="mono" style={{ color: T.success, fontSize: 'clamp(20px, 3.8vw, 28px)', lineHeight: 1.15 }}>{correct}/{total}</strong>
        </p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{t(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{t(c.hook_close)}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
/* position: fixed + inset: 0 — dars oqimdan chiqib, doim aynan KO'RINADIGAN
   viewport'ga mixlanadi. Host (LessonPage/LMS) 100vh bilan balandroq bo'lsa ham
   body-skroll darsga ta'sir qilmaydi, "Davom" tugmasi joyidan siljimaydi.
   URL-panel ochilib-yopilganda balandlikni brauzer o'zi kuzatadi (JS o'lchovsiz). */
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  position: fixed;
  inset: 0;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g1z, 1);
}
/* Mobil yagona masshtab (useMobileZoom): layout doim 390px, zoom real ekranga
   moslaydi — barcha telefonlarda aynan bir xil ko'rinish. Desktop tegilmaydi. */
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}

.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4, .lesson-root h5, .lesson-root h6,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }

.title { font-family: 'Manrope', system-ui, sans-serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: normal; }
.display { font-family: 'Manrope', system-ui, sans-serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: normal; }
.italic { font-family: 'Manrope', system-ui, sans-serif; font-style: italic; font-weight: 500; font-variation-settings: normal; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: inherit; font-variation-settings: inherit; font-weight: inherit; }
.frac .n, .frac .d { padding: 0 0.12em; font: inherit; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }

@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
.delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }

.btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #0E0E10; color: #F6F4EF; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32); }
.btn:hover:not(:disabled) { background: #FF4F28; box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #FF4F28; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12); }
.btn-white-accent:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55); }
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }

.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #0E0E10; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', system-ui, sans-serif !important; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.option:disabled { cursor: default; }
.option-correct { background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important; }
.option-wrong { background: #FFFFFF !important; color: #A7A6A2 !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(19px, 2.7vw, 22px); }
.body { font-size: clamp(17px, 2.1vw, 17px); line-height: 1.55; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(15px, 1.7vw, 15px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

.stage { max-width: 936px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(12px, 2vw, 18px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 16px); padding-bottom: clamp(17px, 3.4vw, 34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(12px, 2vw, 15px); padding-bottom: clamp(12px, 2vw, 15px); display: flex; gap: 12px; }

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

.track-wrap { position: relative; height: 26px; margin: 18px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 30px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (div_6_04) ===== */
.place-cell { font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center; min-width: clamp(20px, 3.6vw, 30px); height: clamp(28px, 5vw, 40px); border-radius: 8px; background: #FFFFFF; color: #A7A6A2; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); transition: all 0.35s; }
.place-cell.filled { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.30); }

@keyframes rg-dot-in { from { opacity: 0; transform: translateY(6px) scale(0.6); } to { opacity: 1; transform: none; } }

/* PriceTag — do'kon narx yorlig'i. */
.pr-tag { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; padding: clamp(7px,1.5vw,11px) clamp(11px,2.2vw,16px); border-radius: 12px; border: 1.5px solid; animation: rg-dot-in 0.36s ease-out both; box-shadow: 0 5px 14px -8px rgba(58,53,48,0.35); transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* DivisorFan — darsning yuragi: barcha bo'luvchilar chip bo'lib yoyiladi. */
.df-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 1.5em; padding: 4px 8px; border-radius: 8px; background: #FFFFFF; color: #0E0E10; border: 1.5px solid rgba(167,166,162,0.4); font-weight: 700; line-height: 1.15; animation: rg-dot-in 0.32s ease-out both; }
.df-count { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 99px; border: 2px solid; font-weight: 700; font-size: clamp(12px,2.3vw,15px); transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* SieveGrid — Eratosfen g'alviri: 50 katak, o'nlab qatorlarda. */
.sv-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: clamp(2px, 0.7vw, 4px); }
.sv-cell { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 6px; font-size: clamp(9px, 2vw, 13px); font-weight: 600; transition: background 0.4s ease, color 0.4s ease, opacity 0.4s ease; }
.sv-plain { background: #FFFFFF; color: #0E0E10; box-shadow: 0 2px 6px -3px rgba(58,53,48,0.25); }
.sv-crossed { background: transparent; color: #A7A6A2; opacity: 0.45; text-decoration: line-through; }
.sv-prime { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 2px 8px -3px rgba(31,122,77,0.4); }

/* FactorChain — tub ko'paytuvchilar zanjiri (12 = 2 · 2 · 3). */
.fc-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 1.5em; padding: 5px 9px; border-radius: 8px; background: #E3F0E8; color: #1F7A4D; border: 1.5px solid #1F7A4D; font-weight: 700; font-size: clamp(14px, 2.8vw, 19px); line-height: 1.15; animation: rg-dot-in 0.34s ease-out both; }

/* FactorLadder — tub ko'paytuvchilarга ustun (столбик) usuli. Qatorlar ketma-ket tushadi. */
.ladder { display: inline-grid; grid-auto-rows: auto; gap: 3px; margin: 2px 0; }
.ladder-row { display: grid; grid-template-columns: minmax(2em, 1fr) auto minmax(2em, 1fr); align-items: stretch; column-gap: clamp(12px, 2.4vw, 20px); animation: ladderIn 0.42s cubic-bezier(0.33, 0, 0.2, 1) both; }
.ladder-n { text-align: right; align-self: center; font-weight: 700; font-size: clamp(16px, 3vw, 22px); color: #0E0E10; }
.ladder-p { text-align: left; align-self: center; font-weight: 700; font-size: clamp(16px, 3vw, 22px); color: #1F7A4D; }
.ladder-bar { width: 2.5px; min-height: 1.5em; background: rgba(58, 53, 48, 0.28); border-radius: 2px; }
.ladder-one { color: #A7A6A2; }
@keyframes ladderIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }

/* DivisorChips — ruxsat etilgan oxirgi raqamlar / alomat chiplari. */
.dv-chip { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 17px); font-weight: 600; padding: clamp(6px,1.2vw,9px) clamp(11px,2vw,15px); border-radius: 10px; border: 1.5px solid; animation: rg-dot-in 0.4s ease-out both; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* Dars01 etalonidagi "Nega shunday" kartasi. */
.why { background: #FFFFFF; border-radius: 14px; border-left: 4px solid #019ACB; padding: clamp(12px, 2.2vw, 17px); box-shadow: 0 8px 22px -6px rgba(1, 154, 203, 0.2); margin-top: clamp(10px, 1.8vw, 14px); animation: fade-in-up 0.7s ease-out both; }
.why-h { display: flex; align-items: center; gap: 8px; margin: 0 0 clamp(8px, 1.6vw, 12px); font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.9vw, 12px); font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: #019ACB; }
.why-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.6); animation: rv-dot-pulse 1.8s ease-in-out infinite; }
.why-fig { display: flex; justify-content: center; padding-bottom: clamp(8px, 1.6vw, 12px); }
.why-list { position: relative; display: flex; flex-direction: column; gap: clamp(7px, 1.4vw, 10px); }
.why-list::before { content: ''; position: absolute; left: 10.5px; top: 12px; bottom: 12px; width: 1px; background: linear-gradient(180deg, rgba(1,154,203,0.55), rgba(1,154,203,0.08)); }
.why-row { position: relative; display: flex; align-items: flex-start; gap: 10px; animation: why-in 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
.why-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #EAF6FB; color: #019ACB; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; margin-top: 1px; }
.why-tx { margin: 0; font-size: clamp(15px, 2.9vw, 16px); line-height: 1.45; color: #0E0E10; }
@keyframes why-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }

.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
.fa-dg { display: flex; gap: 7px; align-items: center; }
.fa-dg-grp { display: flex; gap: 2px; animation: faDg 2.4s ease-in-out infinite; }
.fa-dg-grp i { width: 7px; height: clamp(20px, 4vw, 30px); background: #019ACB; opacity: 0.25; border-radius: 2px; }
.fa-dg-grp:nth-child(1) { animation-delay: 0s; }
.fa-dg-grp:nth-child(2) { animation-delay: 0.3s; }
.fa-dg-grp:nth-child(3) { animation-delay: 0.6s; }
@keyframes faDg { 0%, 100% { opacity: 0.3; } 45% { opacity: 1; } }
.fa-st { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1.4vw, 10px); width: clamp(70px, 14vw, 96px); }
.fa-st span { width: clamp(8px, 1.8vw, 11px); height: clamp(8px, 1.8vw, 11px); border-radius: 50%; background: #019ACB; box-shadow: 0 0 6px rgba(1, 154, 203, 0.6); animation: faSt 2.2s ease-in-out infinite; }
@keyframes faSt { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
.fa-da { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.fa-da span { width: clamp(10px, 2.2vw, 14px); background: #019ACB; opacity: 0.3; border-radius: 3px; animation: faDa 2.4s ease-in-out infinite; }
@keyframes faDa { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }

.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (platform_contract §1)
// ============================================================
export default function PrimeCompositeLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const nextArr = [...prev]; nextArr[screenIdx] = data; return nextArr; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    };
    safeOnFinished(payload);
  }, [answers, safeOnFinished]);

  const screens = [Screen0, Screen2, Screen3, Screen1, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
  const CurrentScreen = screens[current];

  const navLockRef = useRef(0);
  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { if (navGuard()) setCurrent(s => Math.max(s - 1, 0)); };
  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root grade6-theory-etalon grade6-dars04">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
