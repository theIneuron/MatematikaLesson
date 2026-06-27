import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ============================================================================
// ░░ 1-SINF · Dars02 — "Raqamlar 1–5" (num-1-02-v1) · syujet: Anvar raqamli uyni qidiradi · spec: ETALON_1SINF.md ░░
// Bu fayl 1-sinf darslarining ETALON nusxa-manbai (copy source). Har dars mustaqil
// .jsx bo'lib qoladi: yangi dars yaratganda quyidagi "ETALON KIT" bloklari shu fayldan
// O'ZGARTIRMASDAN ko'chiriladi (faqat CONTENT / SCREEN_META / Screen-komponentlar /
// root yangi darsga moslanadi).
//
// AVVAL: metodistdan personaj ismlarini so'ra (cast kengayadi — Ra'no+Anvar + reja
// bo'yicha yana 2 personaj, ular ham syujetga ulanadi va alohida chiziladi).
//
// ETALON KIT bloklari (grep: "ETALON KIT ·"):
//   1) PERSONAJLAR — RanoSVG, AnvarSVG, BitSVG, HeroContext/useHero, StageHero
//   2) BIT-KARTOCHKA + rag'bat — Reaction, PRAISE/ENCOURAGE, nextPraise/nextEncourage
//   3) SAHNALAR — SceneBg (room/door), DasturxonScene, AmbientBg, GradientDefs
//   4) WIDGETLAR — BasketArt, DStar/DressStars, CountDemo/CountExamples/CountTrack/
//      CountingHand, Pips/Obj/ObjSvg, Confetti, animatsion kit (useCountOnce...)
//   5) INFRA (infrastructure_v1) — T, LangContext/useT, AudioEngine/useAudio,
//      Stage/QuestionScreen/Nav*, useCanAnswer/useAdvanceGate, CSS (STYLES)
// Tegishli CSS — STYLES bloki ichida ("ETALON KIT CSS ·" izohlari bilan).
// ============================================================================

// ============================================================
// ПАЛИТРА
// ============================================================
const T = {
  bg: '#F6F4EF',
  ink: '#0E0E10',
  ink2: '#5A5A60',
  ink3: '#A7A6A2',
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

// Slaydlararo o'tish blokirovkasi (production): "Davom" javob/ovoz tugagach ochiladi,
// javob faqat ovoz tugagach tanlanadi. (Test paytida vaqtincha true qilingan edi.)
const FREE_NAV = false;

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

// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык — маркерами внутри text (только смешанные строки языковых курсов); math шлёт без маркеров,
// сервер определяет язык сам (ru=кириллица, uz=латиница). Движок свой тег НЕ добавляет.
function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
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

// Yulduz-kopilka: to'g'ri javoblar soni (test ekranlari) — yuqorida to'planib boradi.
const ProgressContext = createContext({ stars: 0, total: 0 });

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
  setGender(g) { this.gender = g === 'f' ? 'f' : 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
  }

  playSegment(segment) {
    if (!segment) return;
    const base = ttsConfig.ttsApiBase;
    // Нет текста → пропускаем (логика очереди сохраняется).
    if (!segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
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
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    el.onerror = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };

    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, gender);
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        this.autoplayBlocked = false;
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
      }).catch(() => {
        // автоплей заблокирован браузером — ждём первого жеста
        this.autoplayBlocked = true;
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      });
    }
  }

  // PREVIEW-ВЕТКА (только при пустом ttsApiBase, т.е. вне LMS): браузерный Web Speech.
  // НЕ копировать как боевой транспорт — на платформе всегда идёт HTTP-ветка playSegment.
  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.handleSegmentEnd(segment), 0); return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    // тег языка/настроения на экран и в Web Speech не нужен — снимаем
    const clean = stripAudioTags(String(segment.text));
    const u = new SpeechSynthesisUtterance(clean);
    const lang = segment.lang || this.currentLang;
    u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
    u.rate = 0.95; u.pitch = 1.0;
    u.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
    };
    u.onend = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    u.onerror = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    this.previewUtterance = u;
    setTimeout(() => { try { synth.speak(u); } catch (e) { this.handleSegmentEnd(segment); } }, 60);
  }

  // Возобновление после блокировки автоплея (по первому жесту).
  resumeIfBlocked() {
    if (!this.autoplayBlocked) return;
    this.autoplayBlocked = false;
    this.playSegment(this.queue[this.currentIdx]);
  }

  handleSegmentEnd(segment) {
    if (segment && segment.waits_for) {
      this.waitingFor = segment.waits_for;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: segment.waits_for });
    } else {
      this.currentIdx++;
      this.playNext();
    }
  }

  playNext() {
    if (this.currentIdx >= this.queue.length) return;
    this.playSegment(this.queue[this.currentIdx]);
  }

  start() {
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

  pushOneOff(text, gender) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: 'manual', waits_for: null, g: gender });
    this.currentIdx = this.queue.length - 1;
    this.playNext();
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }

  stop() {
    if (this.audioEl) {
      try { this.audioEl.pause(); this.audioEl.onended = null; this.audioEl.onerror = null; } catch (e) {}
    }
    // preview-ветка: гасим браузерную озвучку
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
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
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);

  // Стабилизация segments по содержимому, не по ссылке (без этого cancel-loop, звук молчит)
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.setGender(ttsConfig.voiceGender || 'm');
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
      if (newMuted && engineRef.current) engineRef.current.stop();
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

// Avto-zanjir segmentlar: barcha bo'laklar ketma-ket O'ZI yangraydi (step-tugmasiz).
// Interaktiv bo'lmagan tushuntirish slaydlari uchun (s1, s5, s6).
const makeAutoSegments = (screenContent, lang) => {
  const a = screenContent.audio?.[lang];
  const arr = Array.isArray(a) ? a : (a ? [a] : []);
  return arr.map((text, i) => ({ id: `aud_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null }));
};

// useCanAnswer — javob tanlash faqat ovoz tugagandan keyin (bola avval tinglaydi).
// Ovoz yangrayotganda yoki hali boshlanmaganda -> false. Mute -> true. 12s himoya (bloklanmasin).
function useCanAnswer(audio) {
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    if (audio.isPlaying && !hasPlayed) { const id = setTimeout(() => setHasPlayed(true), 0); return () => clearTimeout(id); }
    return undefined;
  }, [audio.isPlaying, hasPlayed]);
  useEffect(() => { const id = setTimeout(() => setHasPlayed(true), 12000); return () => clearTimeout(id); }, []);
  return FREE_NAV || audio.muted || (hasPlayed && !audio.isPlaying);
}

// useAdvanceGate — "Davom" faqat javobdan keyingi izoh ovozi TUGAGACH ochiladi
// (o'quvchi tushuntirishni oxirigacha eshitsin). Mute -> darrov. 6s himoya.
function useAdvanceGate(solved, audio) {
  const [fbStarted, setFbStarted] = useState(false);
  useEffect(() => {
    if (solved && audio.isPlaying && !fbStarted) { const id = setTimeout(() => setFbStarted(true), 0); return () => clearTimeout(id); }
    return undefined;
  }, [solved, audio.isPlaying, fbStarted]);
  useEffect(() => {
    if (!solved) return undefined;
    const id = setTimeout(() => setFbStarted(true), 6000);
    return () => clearTimeout(id);
  }, [solved]);
  if (!solved) return false;
  if (audio.muted) return true;
  return fbStarted && !audio.isPlaying;
}

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
    <div className="stage">
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

const NavNext = ({ disabled, label, onClick }) => {
  const isDisabled = FREE_NAV ? false : disabled;
  // Faol (bosilishi kerak) bo'lganda — to'q rang + puls (bola e'tiborini tortadi).
  return (
    <button className={isDisabled ? 'btn-white-accent' : 'btn-white-accent btn-ready'} disabled={isDisabled} onClick={onClick}
      style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>
      {label}
    </button>
  );
};

const NextLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Davom etish' : 'Дальше';
};

const BackLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Orqaga' : 'Назад';
};

// ============================================================
// QUESTION SCREEN — универсальный MC-компонент под формат audio: { intro, on_correct, on_wrong }
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure, celebrateOnCorrect, mascot = true, optionsCols = 2 }) => {
  const lang = useLang();
  const c = screenContent;
  const sfx = useSfx();

  const audio = useAudio([{
    id: `s${idx}_intro`,
    text: c.audio.intro[lang],
    trigger: 'on_mount',
    waits_for: { type: 'option_picked' }
  }]);
  const canAns = useCanAnswer(audio);   // javob faqat ovoz tugagach

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
  const [praiseWord, setPraiseWord] = useState('');   // navbatdagi maqtov so'zi (reaktsiya uchun)
  const [encWord, setEncWord] = useState('');         // navbatdagi UNIKAL rag'bat (xato javob)
  const praiseRef = useRef('');

  const pick = (i) => {
    if (!canAns) return;       // ovoz tugamaguncha javob yo'q
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
      const pw = nextPraise(lang); praiseRef.current = pw; setPraiseWord(pw);
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
      setEncWord(nextEncourage(lang));   // har xatoda boshqa pozitiv so'z
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }

    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          if (isCorrect) { engine.pushOneOff(praiseRef.current); engine.pushOneOff(c.audio.on_correct[lang]); }   // maqtov so'zi + izoh
          else engine.pushOneOff(wrongVoice);
          if (isCorrect && c.fact_audio && c.fact_audio[lang]) engine.pushOneOff(c.fact_audio[lang]);  // FactCard ovozlanadi (TTS-toza)
        }
      }, 300);
    }
  };

  const canAdv = useAdvanceGate(solved, audio);   // izoh ovozi tugagach Davom
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {!solved && (
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${optionsCols}, minmax(0, 1fr))`, gap: 10 }}>
          {options.map((opt, i) => {
            const isWrongPicked = wrong.has(i);
            const cls = `option${isWrongPicked ? ' option-picked-wrong' : ''}`;
            const disabled = isWrongPicked || !canAns;   // ovoz tugamaguncha + погашенный неверный
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: isWrongPicked ? '#D8A93A' : T.ink3 }}>
                  {isWrongPicked ? '↺' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>{opt}</span>
              </button>
            );
          })}
        </div>
        )}
        {/* to'g'ri javobdan keyin: faqat to'g'ri variant qoladi (noto'g'rilari yo'qoladi). celebrateOnCorrect bo'lsa -> animatsiya */}
        {solved && !celebrateOnCorrect && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="option option-correct" disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6vw, 54px)', minWidth: 'clamp(120px, 40vw, 220px)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="mono small" style={{ minWidth: 20, color: T.success }}>✓</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>{options[correctIdx]}</span>
            </button>
          </div>
        )}
        {solved && celebrateOnCorrect && <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>{typeof celebrateOnCorrect === 'function' ? celebrateOnCorrect() : celebrateOnCorrect}</div>}
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <Reaction state={solved ? 'correct' : 'wrong'} praise={solved ? praiseWord : encWord} mascot={mascot}/>
        </FeedbackBlock>
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// ============================================================
// --- POD UROK: num_1_01 — Predmetlarni sanash va 1–5 sonlar (1-sinf, Dars01) ---
// 1-sinf (6–7 yosh): ovoz yetakchi kanal, typing YO'Q (tap/drag), concrete ustun,
// bar model YO'Q. Manba: 1sinf_metodologiya.md (§4, §6, §7 Б1) + DIZAYN_STANDART_1SINF.md.
// Misconception'lar: M1 kardinallik yo'q · M2 miscount (sakrab/ikki marta) · M3 raqam↔miqdor.
// ============================================================

const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'num-1-02-v1',
  lessonTitle: { ru: 'Цифры 1–5', uz: 'Raqamlar 1–5' }
};
const SCREEN_META = [
  { id: 'sIntro', type: 'hook',        template: 'custom',   scored: false, scope: null },            // syujet: Anvar Ra'noning uyini qidiradi (raqamli uylar)
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // jumboq: uy raqamlari aralashib ketdi
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // har uy raqamini bosib tanish (nom + buyumlar)
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // o'zi: uy raqamigacha buyum joylaydi
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // raqam = sonni yozadigan belgi (eshik plitasi)
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // uy oldida nechta? raqamni tanla
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // raqam SHAKLI: eshik plitalaridagi farq (2/5, 3)
  { id: 's6',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // ko'rinishidan tanib olamiz
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // qaysi eshik besh? (shakl)
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },  // raqami noto'g'ri uyni top
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },  // raqam<->uy juftlash (tap)
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },  // uylarni 1->5 tartiblash (tap)
  { id: 'sd',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // mini-o'yin: uy oldiga buyum torting (drag), ball yo'q
  { id: 'sGuest', type: 'hook',     template: 'custom',   scored: false, scope: null },            // syujet ko'prik: oxirgi uy qoldi
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // final: qaysi uy beshinchi? + fakt
  { id: 's12', type: 'summary',     template: 'custom',   scored: false, scope: null }             // yakun + can-do + ConnectionsBlock
];

// Sonlar — so'z bilan (audio_rules: audioda raqam emas, so'z). Indeks = son.
const NUM_WORDS = { ru: ['', 'один', 'два', 'три', 'четыре', 'пять'], uz: ['', 'bir', 'ikki', 'uch', "to'rt", 'besh'] };

// Fisher-Yates (brauzerda Math.random — faqat hodisalarda/effektda, render'da emas).
const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };

const CONTENT = {
  // ---- sIntro SYUJET KIRISH — Bit boshlovchi, o'tgan darsga bog'lanish (qayta tanishtirish YO'Q) ----
  sIntro: {
    eyebrow: { ru: 'История', uz: 'Hikoya' },
    title: { ru: "Анвар ищет дом Рано", uz: "Anvar Ra'noning uyini qidiradi" },
    body: {
      ru: 'В прошлый раз мы вместе считали. Сегодня Анвар идёт в гости к Рано. На улице пять домов, и у каждого свой номер. Рано живёт в пятом доме. Но номера на дверях перепутались — поможем Анвару найти нужный дом.',
      uz: "O'tgan safar biz birga sanagandik. Bugun Anvar Ra'nonikiga mehmonga ketyapti. Ko'chada beshta uy bor, har birining o'z raqami bor. Ra'no beshinchi uyda yashaydi. Lekin eshiklardagi raqamlar aralashib ketdi — Anvarga kerakli uyni topishga yordam beramiz."
    },
    bit_label: { ru: 'Бит', uz: 'Bit' },
    rano_label: { ru: 'Рано', uz: "Ra'no" },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    audio: {
      ru: [
        'Привет, друг! В прошлый раз мы с тобой считали предметы. А сегодня будем узнавать цифры.',
        'Анвар идёт в гости к Рано. На улице пять домов, и у каждого свой номер.',
        'Рано живёт в пятом доме. Но номера на дверях перепутались.',
        'Поможем Анвару найти нужный дом. Слушай меня до конца и нажимай кнопку дальше.'
      ],
      uz: [
        "Salom, do'stim! O'tgan safar biz narsalarni sanagandik. Bugun esa raqamlarni tanib olamiz.",
        "Anvar Ra'nonikiga mehmonga ketyapti. Ko'chada beshta uy bor, har birining o'z raqami bor.",
        "Ra'no beshinchi uyda yashaydi. Lekin eshiklardagi raqamlar aralashib ketdi.",
        "Anvarga kerakli uyni topishga yordam beramiz. Meni oxirigacha tinglang va davom tugmasini bosing."
      ]
    }
  },

  // ---- sGuest SYUJET KO'PRIK — oxirgi uy qoldi (final oldidan, interaktiv emas) ----
  sGuest: {
    eyebrow: { ru: 'Почти у цели', uz: 'Manzilga yaqin' },
    title: { ru: 'Остался последний дом', uz: 'Oxirgi uy qoldi' },
    body: {
      ru: 'Анвар уже на улице Рано. Все номера на дверях он прочитал. Остался последний шаг: найти дом номер пять — там живёт Рано.',
      uz: "Anvar Ra'noning ko'chasiga yetib keldi. Eshiklardagi barcha raqamlarni o'qib chiqdi. Oxirgi qadam qoldi: beshinchi uyni topish — Ra'no o'sha yerda yashaydi."
    },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    audio: {
      ru: [
        'Анвар уже на улице Рано и прочитал все номера на дверях.',
        'Остался последний шаг. Найди дом номер пять — там живёт Рано.'
      ],
      uz: [
        "Anvar Ra'noning ko'chasiga yetib keldi va eshiklardagi barcha raqamlarni o'qib chiqdi.",
        "Oxirgi qadam qoldi. Beshinchi uyni toping — Ra'no o'sha yerda yashaydi."
      ]
    }
  },

  // ---- s0 HOOK — yumshoq jumboq (uy raqamlari aralash; to'g'ri javob yo'q, hammasi mos) ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title_part1: { ru: 'Номера домов', uz: 'Uy raqamlari' },
    title_part2_em: { ru: 'перепутались', uz: 'aralashib' },
    title_part3: { ru: '. Узнаёшь их?', uz: ' ketdi. Taniysizmi?' },
    question: { ru: 'Ты узнаёшь все цифры от 1 до 5? Нажми ответ.', uz: 'Birdan beshgacha raqamlarni taniysizmi? Javobni bosing.' },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Не все', uz: 'Hammasini emas' },
    opt2: { ru: 'Сейчас узнаю', uz: 'Hozir tanib olaman' },
    audio: {
      intro: {
        ru: 'Номера на дверях перепутались. У каждой цифры свой вид и своё имя. Ты узнаёшь их все? Нажми ответ, любой подойдёт.',
        uz: "Eshiklardagi raqamlar aralashib ketdi. Har raqamning o'z ko'rinishi va o'z nomi bor. Hammasini taniysizmi? Javobni bosing, qaysi bo'lsa ham bo'ladi."
      },
      on_correct: { ru: 'Хорошо. Сейчас рассмотрим каждую по очереди.', uz: "Yaxshi. Endi har birini navbat bilan ko'rib chiqamiz." },
      on_wrong: { ru: 'Хорошо. Сейчас рассмотрим каждую по очереди.', uz: "Yaxshi. Endi har birini navbat bilan ko'rib chiqamiz." }
    }
  },

  // ---- s1 EXPLORATION — har uy raqamini bosib tanish (nom + buyumlar) ----
  s1: {
    eyebrow: { ru: 'Знакомимся', uz: 'Tanishamiz' },
    instruction: { ru: 'Нажми на номер каждого дома по очереди', uz: "Har uyning raqamini navbat bilan bosing" },
    count_label: { ru: 'Узнали', uz: 'Tanildi' },
    done_text: { ru: 'Молодец! Ты узнал все пять цифр.', uz: "Barakalla! Beshta raqamni ham tanidingiz." },
    done_audio: { ru: 'Молодец! Ты узнал все пять цифр.', uz: "Barakalla! Beshta raqamni ham tanidingiz." },
    audio: {
      ru: [
        'Нажимай на номер каждого дома по очереди. Ты услышишь его имя и увидишь, сколько предметов лежит у этого дома.',
        'У каждой цифры свой вид и своё число. Один, два, три, четыре, пять.'
      ],
      uz: [
        "Har uyning raqamini navbat bilan bosing. Uning nomini eshitasiz va uy oldida nechta buyum borligini ko'rasiz.",
        "Har raqamning o'z ko'rinishi va o'z soni bor. Bir, ikki, uch, to'rt, besh."
      ]
    }
  },

  // ---- s2 EXPLORATION — o'zi: uy raqamigacha buyum joylaydi ----
  s2: {
    eyebrow: { ru: 'Сделай сам', uz: "O'zingiz qiling" },
    instruction: { ru: 'На двери номер четыре. Положи к дому столько же предметов', uz: "Eshikda raqam to'rt. Uy oldiga shuncha buyum qo'ying" },
    count_label: { ru: 'Положено', uz: "Qo'yildi" },
    done_text: { ru: 'Молодец! Предметов столько же, сколько на двери.', uz: "Barakalla! Buyumlar eshikdagidek bo'ldi." },
    done_audio: { ru: 'Молодец! Получилось столько же, сколько показывает цифра.', uz: "Barakalla! Raqam ko'rsatgancha bo'ldi." },
    audio: {
      ru: [
        'На двери этого дома цифра четыре. Она говорит, что нужно ровно четыре предмета.',
        'Нажимай на предметы по одному. На каждое нажатие звучит одно число. Остановись, когда дойдёшь до четырёх.'
      ],
      uz: [
        "Bu uyning eshigida to'rt raqami bor. U roppa-rosa to'rtta buyum kerakligini bildiradi.",
        "Buyumlarni bittadan bosing. Har bosishda bitta son aytiladi. To'rtga yetganda to'xtang."
      ]
    }
  },

  // ---- s3 RULE — raqam = sonni yozadigan belgi (eshik plitasi) ----
  s3: {
    eyebrow: { ru: 'Запомним', uz: 'Eslab qolamiz' },
    title_part1: { ru: 'Цифра — это', uz: 'Raqam — bu' },
    title_part2_em: { ru: 'знак для числа', uz: "sonni yozadigan belgi" },
    tip: {
      ru: 'Сколько предметов мы сосчитали — такую цифру и пишем на двери. Три предмета — пишем три.',
      uz: "Nechta buyum sanagan bo'lsak — eshikka o'sha raqamni yozamiz. Uchta buyum — uch deb yozamiz."
    },
    audio: {
      ru: 'Когда мы сосчитали предметы, мы записываем число цифрой. Сосчитали три предмета — пишем на двери цифру три. Так у каждого дома появляется свой номер.',
      uz: "Buyumlarni sanab bo'lgach, sonni raqam bilan yozamiz. Uchta buyum sanadik — eshikka uch raqamini yozamiz. Shunday qilib har uyning o'z raqami bo'ladi."
    }
  },

  // ---- s4 TEST MC — uy oldida nechta? raqamni tanla (miqdor -> raqam) ----
  s4: {
    eyebrow: { ru: 'Тренировка · 1 / 6', uz: 'Mashq · 1 / 6' },
    title: { ru: 'Сколько предметов у дома? Выбери цифру для двери.', uz: 'Uy oldida nechta buyum bor? Eshik uchun raqamni tanlang.' },
    correct_text: {
      ru: 'Верно. Три предмета — это цифра три.',
      uz: "To'g'ri. Uchta buyum — bu uch raqami."
    },
    wrong_0: {
      ru: 'Это не два. Посчитай ещё раз. Один, два, три. Их три.',
      uz: "Bu ikki emas. Yana sanang. Bir, ikki, uch. Ular uchta."
    },
    wrong_2: {
      ru: 'Это не четыре. Посчитай по одному. Один, два, три. Их три.',
      uz: "Bu to'rt emas. Bittadan sanang. Bir, ikki, uch. Ular uchta."
    },
    wrong_3: {
      ru: 'Это не пять. Посчитай ещё раз. Один, два, три. Их три.',
      uz: "Bu besh emas. Yana sanang. Bir, ikki, uch. Ular uchta."
    },
    wrong_default: {
      ru: 'Не совсем. Посчитай предметы по одному и выбери цифру.',
      uz: "Unchalik emas. Buyumlarni bittadan sanang va raqamni tanlang."
    },
    audio: {
      intro: { ru: 'Сколько предметов у этого дома? Посчитай и нажми нужную цифру.', uz: "Bu uy oldida nechta buyum bor? Sanang va kerakli raqamni bosing." },
      on_correct: { ru: 'Верно. Их три.', uz: "To'g'ri. Ular uchta." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana sanang." }
    }
  },

  // ---- s5 EXPLORATION — raqam SHAKLI: eshik plitalaridagi farq ----
  s5: {
    eyebrow: { ru: 'Смотрим на вид', uz: "Ko'rinishga qaraymiz" },
    instruction: { ru: 'Нажми на цифру — посмотри на её форму, чтобы узнавать её', uz: "Raqamni bosing — uni tanish uchun shakliga qarang" },
    done_text: { ru: 'Теперь ты различаешь их по виду.', uz: "Endi ularni ko'rinishidan farqlaysiz." },
    audio: {
      ru: [
        'У каждой цифры свой вид. Нажимай на цифру и смотри на её форму.',
        'Два смотрит вправо, а пять — влево, и у пятёрки сверху шапочка. Тройка — это два мостика. Так их легко различить.'
      ],
      uz: [
        "Har raqamning o'z ko'rinishi bor. Raqamni bosing va uning shakliga qarang.",
        "Ikki o'ngga, besh esa chapga qaraydi, beshning tepasida shapkasi bor. Uch — bu ikkita ko'prikcha. Shunday qilib ularni oson farqlash mumkin."
      ]
    }
  },

  // ---- s6 RULE — ko'rinishidan tanib olamiz ----
  s6: {
    eyebrow: { ru: 'Запомним', uz: 'Eslab qolamiz' },
    title_part1: { ru: 'Каждую цифру', uz: 'Har raqamni' },
    title_part2_em: { ru: 'узнаём по виду', uz: "ko'rinishidan tanaymiz" },
    tip: {
      ru: 'Не обязательно считать каждый раз. Номер на двери можно узнать по виду, как буквы.',
      uz: "Har safar sanash shart emas. Eshikdagi raqamni harflar kabi ko'rinishidan tanib olsa bo'ladi."
    },
    audio: {
      ru: 'Номер можно узнать сразу, по виду, не пересчитывая. Один, два, три, четыре, пять — у каждой цифры свой вид.',
      uz: "Raqamni qayta sanamasdan, ko'rinishidan darrov tanib olsa bo'ladi. Bir, ikki, uch, to'rt, besh — har birining o'z ko'rinishi bor."
    }
  },

  // ---- s7 TEST MC — qaysi eshik besh? (faqat shakl) ----
  s7: {
    eyebrow: { ru: 'Тренировка · 2 / 6', uz: 'Mashq · 2 / 6' },
    title: { ru: 'На какой двери цифра пять? Узнай по виду.', uz: "Qaysi eshikda besh raqami bor? Ko'rinishidan toping." },
    correct_text: {
      ru: 'Верно. Это пять: шапочка сверху и поворот влево.',
      uz: "To'g'ri. Bu besh: tepasida shapka, chapga buriladi."
    },
    wrong_0: {
      ru: 'Это два. Двойка смотрит вправо. Пятёрка другая. Посмотри снова.',
      uz: "Bu ikki. Ikki o'ngga qaraydi. Besh boshqacha. Yana qarang."
    },
    wrong_2: {
      ru: 'Это три. У тройки два мостика. Найди пятёрку.',
      uz: "Bu uch. Uchning ikkita ko'prikchasi bor. Beshni toping."
    },
    wrong_3: {
      ru: 'Это четыре. У четвёрки есть уголок. Пятёрка другая.',
      uz: "Bu to'rt. To'rtning burchagi bor. Besh boshqacha."
    },
    wrong_default: {
      ru: 'Не совсем. Найди пятёрку по её виду.',
      uz: "Unchalik emas. Beshni ko'rinishidan toping."
    },
    audio: {
      intro: { ru: 'На какой двери цифра пять? Посмотри на вид каждой и выбери.', uz: "Qaysi eshikda besh raqami bor? Har birining ko'rinishiga qarang va tanlang." },
      on_correct: { ru: 'Верно. Это пять.', uz: "To'g'ri. Bu besh." },
      on_wrong: { ru: 'Не совсем. Посмотри на вид ещё раз.', uz: "Unchalik emas. Ko'rinishiga yana qarang." }
    }
  },

  // ---- s8 TEST custom — raqami noto'g'ri uyni top (find-the-wrong) ----
  s8: {
    eyebrow: { ru: 'Тренировка · 3 / 6', uz: 'Mashq · 3 / 6' },
    title: { ru: 'У одного дома номер не совпадает с предметами. Найди его.', uz: "Bir uyning raqami buyumlariga to'g'ri kelmaydi. Uni toping." },
    correct_text: {
      ru: 'Верно. Здесь четыре предмета, а на двери три — это и есть ошибка.',
      uz: "To'g'ri. Bu yerda to'rtta buyum bor, lekin eshikda uch — xato shu."
    },
    wrong_default: {
      ru: 'Здесь номер совпадает с числом предметов. Посчитай у каждого дома и найди, где не совпало.',
      uz: "Bu yerda raqam buyumlar soniga to'g'ri keladi. Har uyda sanang va mos kelmaganini toping."
    },
    audio: {
      intro: { ru: 'У каждого дома есть предметы и номер на двери. Где-то номер не совпадает с числом предметов. Посчитай и найди неправильный дом.', uz: "Har uyda buyumlar va eshikda raqam bor. Bir joyda raqam buyumlar soniga to'g'ri kelmaydi. Sanang va noto'g'ri uyni toping." },
      on_correct: { ru: 'Верно. Ты нашёл ошибку.', uz: "To'g'ri. Xatoni topdingiz." },
      on_wrong: { ru: 'Тут всё верно. Посчитай у других домов.', uz: "Bu yerda hammasi to'g'ri. Boshqa uylarda sanang." }
    }
  },

  // ---- s9 TEST MC — raqamga mos uyni top (predmetlarni sanab) ----
  s9: {
    eyebrow: { ru: 'Тренировка · 4 / 6', uz: 'Mashq · 4 / 6' },
    title: { ru: 'Какому дому подходит цифра четыре? Посчитай предметы.', uz: "To'rt raqami qaysi uyga mos? Predmetlarni sanang." },
    correct_text: { ru: 'Верно. В этом доме четыре предмета.', uz: "To'g'ri. Bu uyda to'rtta predmet bor." },
    wrong_0: { ru: 'Здесь только два. А нужно четыре. Посчитай ещё раз.', uz: "Bu yerda atigi ikkita. To'rtta kerak. Yana sanang." },
    wrong_2: { ru: 'Здесь пять, это больше четырёх. Посчитай ещё раз.', uz: "Bu yerda beshta, to'rttadan ko'p. Yana sanang." },
    wrong_default: { ru: 'Не совсем. Посчитай предметы и найди четыре.', uz: "Unchalik emas. Predmetlarni sanang va to'rttalisini toping." },
    audio: {
      intro: { ru: 'Какому дому подходит цифра четыре? Посчитай предметы у каждого дома и выбери дом, где их четыре.', uz: "To'rt raqami qaysi uyga mos? Har uydagi predmetlarni sanang va to'rttasi bor uyni tanlang." },
      on_correct: { ru: 'Верно. Их четыре.', uz: "To'g'ri. Ular to'rtta." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana sanang." }
    }
  },

  // ---- s10 TEST custom — uylarni 1->5 tartiblash (tap) ----
  s10: {
    eyebrow: { ru: 'Тренировка · 5 / 6', uz: 'Mashq · 5 / 6' },
    instruction: { ru: 'Анвар идёт по улице. Нажимай дома по порядку: от 1 до 5', uz: "Anvar ko'cha bo'ylab ketyapti. Uylarni tartib bilan bosing: 1 dan 5 gacha" },
    correct_text: { ru: 'Верно, дальше.', uz: "To'g'ri, davom eting." },
    done_text: { ru: 'Молодец! Все дома по порядку. Один, два, три, четыре, пять.', uz: "Barakalla! Hamma uy tartib bilan. Bir, ikki, uch, to'rt, besh." },
    wrong_default: { ru: 'Это не следующий дом. Подумай, какое число идёт дальше.', uz: "Bu keyingi uy emas. Keyin qaysi son kelishini o'ylab ko'ring." },
    audio: {
      intro: { ru: 'Помоги Анвару пройти по улице по порядку. Нажимай дома от одного до пяти. Начни с одного.', uz: "Anvarga ko'chadan tartib bilan o'tishga yordam bering. Uylarni birdan beshgacha bosing. Birdan boshlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Какой дом дальше?', uz: "Unchalik emas. Keyingi uy qaysi?" }
    }
  },

  // ---- sd MINI-O'YIN — uy oldiga buyum torting (drag), ball yo'q ----
  sd: {
    eyebrow: { ru: 'Игра', uz: "O'yin" },
    instruction: { ru: 'Перетащи к дому столько предметов, сколько на его двери', uz: "Uy oldiga eshikdagi raqamcha buyum torting" },
    correct_text: { ru: 'Верно! Идём дальше.', uz: "To'g'ri! Davom etamiz." },
    done_text: { ru: 'Молодец! У каждого дома столько предметов, сколько на двери.', uz: "Barakalla! Har uyda eshikdagidek buyum bor." },
    retry_audio: { ru: 'Ничего страшного. Посчитай ещё раз.', uz: "Zarari yo'q. Yana bir bor sanang." },
    audio: {
      intro: { ru: 'Немного поиграем. Перетаскивай предметы пальцем или просто нажимай. Положи к дому столько, сколько на двери.', uz: "Endi biroz o'ynaymiz. Buyumlarni barmoq bilan torting yoki bosib qo'ying. Uy oldiga eshikdagidek qo'ying." }
    }
  },

  // ---- s11 TEST final + FactCard — qaysi uy beshinchi? ----
  s11: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    title: { ru: 'Где дом номер пять? Туда придёт Анвар.', uz: "Beshinchi uy qaysi biri? Anvar o'sha yerga boradi." },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    rano_label: { ru: 'Рано', uz: "Ra'no" },
    correct_text: { ru: 'Верно. Это дом номер пять — здесь живёт Рано.', uz: "To'g'ri. Bu beshinchi uy — Ra'no shu yerda yashaydi." },
    wrong_0: { ru: 'Здесь четыре. До пяти не хватает одного. Посчитай до пяти.', uz: "Bu yerda to'rtta. Beshtaga bittasi yetmaydi. Beshtagacha sanang." },
    wrong_2: { ru: 'Здесь только три. Цифра пять — это пять. Посчитай ещё раз.', uz: "Bu yerda atigi uchta. Besh raqami — bu beshta. Yana sanang." },
    wrong_default: { ru: 'Не совсем. Посчитай предметы у каждого дома до пяти.', uz: "Unchalik emas. Har uy oldidagi buyumlarni beshtagacha sanang." },
    fact_badge: { ru: 'А знаешь? · Мир', uz: 'Bilasizmi? · Dunyo' },
    fact_text: { ru: 'Эти цифры понимают во всём мире — их пишут одинаково в каждой стране.', uz: "Bu raqamlarni butun dunyo tushunadi — har mamlakatda bir xil yoziladi." },
    fact_audio: { ru: 'А знаешь, эти цифры пишут одинаково во всём мире.', uz: "Bilasizmi, bu raqamlar butun dunyoda bir xil yoziladi." },
    audio: {
      intro: { ru: 'Где дом номер пять? Посчитай предметы у каждого дома и выбери.', uz: "Beshinchi uy qaysi biri? Har uy oldidagi buyumlarni sanang va tanlang." },
      on_correct: { ru: 'Верно. Их пять.', uz: "To'g'ri. Ular beshta." },
      on_wrong: { ru: 'Не совсем. Посчитай до пяти.', uz: "Unchalik emas. Beshtagacha sanang." }
    }
  },

  // ---- s12 SUMMARY — can-do + ConnectionsBlock ----
  s12: {
    eyebrow: { ru: 'Готово', uz: 'Tayyor' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    main_1: { ru: 'Теперь ты', uz: 'Endi siz' },
    main_2_em: { ru: 'узнаёшь цифры 1–5', uz: '1–5 raqamlarini taniysiz' },
    main_3: { ru: 'и знаешь, как выглядит каждая цифра.', uz: "va har raqam qanday ko'rinishini bilasiz." },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    connections_title: { ru: 'Что дальше', uz: 'Keyin nima' },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'Счёт предметов 1–5', uz: "Predmetlarni sanash 1–5" },
    conn_label_next: { ru: 'Следующий урок', uz: 'Keyingi dars' },
    conn_next: { ru: 'Числа от 6 до 10 и число ноль.', uz: "6 dan 10 gacha sonlar va nol soni." },
    audio: {
      ru: 'Анвар нашёл дом Рано. А ты сегодня научился узнавать цифры от одного до пяти. Важно знать не только их имена, но и как выглядит каждая цифра. На следующем уроке встретим числа от шести до десяти и ноль.',
      uz: "Anvar Ra'noning uyini topdi. Siz esa bugun birdan beshgacha raqamlarni o'rgandingiz. Faqat ularning nomini emas, balki har raqam qanday ko'rinishini bilish ham muhim. Keyingi darsda oltidan o'ngacha sonlar va nol bilan tanishamiz."
    }
  }
};

// ============================================================
// 1-SINF ANIMATSION KIT (etalon — keyingi darslar shundan meros oladi)
// Barcha sikllar prefers-reduced-motion bilan to'xtaydi (CSS @media + usePrefersReducedMotion).
// ============================================================

// Reduced-motion holatini kuzatadi — JS sikllarini ham to'xtatish uchun.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply); else mq.addListener(apply);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', apply); else mq.removeListener(apply); };
  }, []);
  return reduced;
}

// 0..max gacha sanaydi (sekin, ovoz tempida). loop=false -> max da to'xtaydi (PM audit);
// loop=true -> max da holdMs kutib qaytadan boshlaydi (summary qo'li uchun).
// reduced-motion -> darrov max.
function useCountOnce(max, { stepMs = 1300, startDelay = 600, loop = false, holdMs = 1600 } = {}) {
  const reduced = usePrefersReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced) { const id = setTimeout(() => setK(max), 0); return () => clearTimeout(id); }
    let alive = true; let timer;
    let val = 0;
    const tick = () => {
      if (!alive) return;
      setK(val);
      if (val >= max) {
        if (!loop) return;                       // bir martalik: to'xtaydi
        timer = setTimeout(() => { val = 0; tick(); }, holdMs);  // loop: qaytadan
        return;
      }
      val += 1;
      timer = setTimeout(tick, val === 1 ? startDelay : stepMs);
    };
    timer = setTimeout(tick, startDelay);
    return () => { alive = false; clearTimeout(timer); };
  }, [max, stepMs, startDelay, loop, holdMs, reduced]);
  return k;
}

// Umumiy gradientlar — bir marta hujjatga qo'yiladi; ObjSvg va barcha sahnalar shu id'larga murojaat qiladi.
const GradientDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="g1apA" cx="36%" cy="28%" r="74%">
        <stop offset="0%" stopColor="#FF7A63"/><stop offset="48%" stopColor="#E5301C"/><stop offset="100%" stopColor="#9C1008"/>
      </radialGradient>
      <radialGradient id="g1chrG" cx="36%" cy="30%" r="72%">
        <stop offset="0%" stopColor="#FF6A66"/><stop offset="50%" stopColor="#C8102E"/><stop offset="100%" stopColor="#7A0820"/>
      </radialGradient>
      <radialGradient id="g1nonG" cx="40%" cy="33%" r="72%">
        <stop offset="0%" stopColor="#F0CC86"/><stop offset="58%" stopColor="#D9A35A"/><stop offset="100%" stopColor="#B07734"/>
      </radialGradient>
      <radialGradient id="g1teaG" cx="36%" cy="28%" r="82%">
        <stop offset="0%" stopColor="#46BEE8"/><stop offset="68%" stopColor="#019ACB"/><stop offset="100%" stopColor="#016E93"/>
      </radialGradient>
      <radialGradient id="g1starG" cx="42%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FFE08A"/><stop offset="55%" stopColor="#FFC23C"/><stop offset="100%" stopColor="#EE9A1E"/>
      </radialGradient>
      <radialGradient id="g1fishG" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#5FCAEF"/><stop offset="65%" stopColor="#019ACB"/><stop offset="100%" stopColor="#0179A0"/>
      </radialGradient>
      <radialGradient id="g1flwG" cx="40%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#FFA6C6"/><stop offset="55%" stopColor="#FF6FA0"/><stop offset="100%" stopColor="#E0497E"/>
      </radialGradient>
    </defs>
  </svg>
);

// Tabiiy shakllar (bolalar taniydigan). viewBox 0 0 40 40. Mevalar (apple/cherry) — realniy, gradientli.
const ICON = {
  apple: <g transform="translate(20 21)"><path d="M0 -7 C -5 -13 -11 -13 -13.5 -8 C -16.5 -2 -15.5 9 -8 14.5 C -4 17 -1.5 16.5 0 14.5 C 1.5 16.5 4 17 8 14.5 C 15.5 9 16.5 -2 13.5 -8 C 11 -13 5 -13 0 -7 Z" fill="url(#g1apA)"/><circle cx="0" cy="14.2" r="1.5" fill="rgba(110,40,20,0.45)"/><path d="M0 -8 Q1 -16 5 -18" stroke="#6E3A20" strokeWidth="2.4" fill="none" strokeLinecap="round"/><ellipse cx="9" cy="-16" rx="6" ry="3.4" fill="#2C9A57" transform="rotate(-18 9 -16)"/><ellipse cx="-6.5" cy="-1" rx="2.8" ry="6.2" fill="rgba(255,255,255,0.55)" transform="rotate(-16 -6.5 -1)"/><circle cx="-3.5" cy="-7" r="1.8" fill="rgba(255,255,255,0.7)"/></g>,
  star: <g><path d="M20 3 L24.9 14.7 L37.5 15.8 L28 24.2 L30.9 36.5 L20 29.8 L9.1 36.5 L12 24.2 L2.5 15.8 L15.1 14.7 Z" fill="url(#g1starG)" stroke="#E0992A" strokeWidth="0.8" strokeLinejoin="round"/><path d="M20 9 L22.4 15.4 L20 20 L17.6 15.4 Z" fill="rgba(255,255,255,0.38)"/></g>,
  fish: <g><path d="M26 20 L39 9 L39 31 Z" fill="url(#g1fishG)"/><ellipse cx="16" cy="20" rx="15" ry="12" fill="url(#g1fishG)"/><path d="M11 11 Q16 6 21 11" stroke="#0179A0" strokeWidth="1.8" fill="none" strokeLinecap="round"/><ellipse cx="12" cy="14.5" rx="5" ry="2.7" fill="rgba(255,255,255,0.4)"/><circle cx="8.5" cy="18" r="2.4" fill="#FFFFFF"/><circle cx="8" cy="18" r="1.2" fill="#0E0E10"/></g>,
  flower: <g><g fill="url(#g1flwG)"><ellipse cx="20" cy="10" rx="5.5" ry="8"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(72 20 20)"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(144 20 20)"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(216 20 20)"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(288 20 20)"/></g><circle cx="20" cy="20" r="6" fill="#FFC23C" stroke="#E8A92A" strokeWidth="0.8"/><circle cx="17.6" cy="17.6" r="1.8" fill="rgba(255,255,255,0.45)"/></g>,
  balloon: <g><path d="M20 27 L20 36" stroke="#A7A6A2" strokeWidth="1.4" fill="none"/><ellipse cx="20" cy="15" rx="10" ry="12" fill="#FF4F28"/><path d="M17.6 26 L22.4 26 L20 29 Z" fill="#FF4F28"/><ellipse cx="16" cy="11" rx="2.4" ry="3.4" fill="rgba(255,255,255,0.4)"/></g>,
  cherry: <g><path d="M20 9 Q27 13 28 25" stroke="#3E7D2A" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M20 9 Q14 14 12 24" stroke="#3E7D2A" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M19 9 Q24 3 31 6 Q26 10 19 9 Z" fill="#3E9B3A"/><circle cx="12" cy="29" r="8" fill="url(#g1chrG)"/><circle cx="27" cy="27" r="8" fill="url(#g1chrG)"/><ellipse cx="9.5" cy="26" rx="2.3" ry="3.3" fill="rgba(255,255,255,0.6)" transform="rotate(-18 9.5 26)"/><ellipse cx="24.5" cy="24" rx="2.3" ry="3.3" fill="rgba(255,255,255,0.6)" transform="rotate(-18 24.5 24)"/></g>
};
const KIND_ORDER = ['apple', 'star', 'fish', 'flower', 'balloon'];

const ObjSvg = ({ kind }) => (
  <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">{ICON[kind] || ICON.apple}</svg>
);

const Obj = ({ kind = 'apple', i = 0, anim = 'bob' }) => (
  <span className={`g1-obj ${anim ? 'g1-' + anim : ''}`} style={{ animationDelay: `${(i % 5) * 0.16}s` }}>
    <ObjSvg kind={kind}/>
  </span>
);

// Pips — statik pips o'rniga animatsion (idle bob/twinkle). API saqlangan (n, kind).
// wrap=true -> ko'p qatorga o'raladi (tor idishda skrol bo'lmasin); aks holda bitta qator (sanash uchun).
const Pips = ({ n, kind = 'apple', anim = 'bob', wrap = false }) => (
  <div className={`g1-pips ${wrap ? 'g1-pips-wrap' : ''}`}>
    {Array.from({ length: n }).map((_, i) => <Obj key={i} kind={kind} i={i} anim={anim}/>)}
  </div>
);

// ============================================================
// ETALON KIT · BIT-KARTOCHKA + RAG'BAT — yagona reaktsiya (Bit + maqtov) barcha javob ekranlarida
// ============================================================
// Maqtov so'zlari navbat bilan (monoton bo'lmasin)
const PRAISE = { ru: ['Молодец!', 'Отлично!', 'Здорово!', 'Умница!'], uz: ['Barakalla!', 'Ajoyib!', "Zo'r!", 'Ofarin!'] };
// Rag'bat — xato javobda navbat bilan UNIKAL, to'g'ri javobga YO'NALTIRUVCHI so'z
// (javobni OCHIB QO'YMAYDI — faqat usulni ko'rsatadi: qaytadan/bittadan/diqqat bilan sana).
const ENCOURAGE = {
  ru: [
    'Почти! Посчитай ещё раз, по одному.',
    'Уже близко! Посмотри внимательно и сосчитай снова.',
    'Хорошая попытка! Считай не спеша, по порядку.',
    'Ещё чуть-чуть! Дотронься до каждого и посчитай.',
    'Молодец! Начни счёт сначала, спокойно.'
  ],
  uz: [
    'Sal qoldi! Yana bir bor, bittadan sanang.',
    'Yaqin qoldingiz! Diqqat bilan qaytadan sanang.',
    'Yaxshi urinish! Shoshmasdan, tartib bilan sanang.',
    'Ozgina qoldi! Har biriga qarab, bittadan sanang.',
    "Zo'r harakat! Sanashni boshidan, sekin boshlang."
  ]
};
let _encIdx = 0;
const nextEncourage = (lang) => { const a = ENCOURAGE[lang] || ENCOURAGE.ru; const p = a[_encIdx % a.length]; _encIdx += 1; return p; };
let _praiseIdx = 0;
const nextPraise = (lang) => { const a = PRAISE[lang] || PRAISE.ru; const p = a[_praiseIdx % a.length]; _praiseIdx += 1; return p; };

// ============================================================
// ETALON KIT · PERSONAJLAR — koddan SVG (Ra'no + Anvar + Bit). Yangi personaj — shu uslubda chiziladi.
// Uslub: sayqalli flat-vector (fotorealizm emas). Ko'z pirpiratish/qo'l silkitish — CSS animatsiya.
// Pilot: keyingi darslarga ko'chsa, shared/ ga chiqariladi.
// ============================================================

// Ra'no — KANONIK o'zbek qizcha (butun darsda bitta xil ko'rinish; DressStars ham shuni ishlatadi).
// mood: pointing | happy | encourage | celebrate. stars=true -> ko'ylakda 3 yulduz (s4 mashqi).
// Gradient soya + panjalar + oyoq soyasi (realroq). g1-eyes -> pirpiratish.
const RanoSVG = ({ mood = 'pointing', className = '', stars = false }) => {
  const big = mood === 'happy' || mood === 'celebrate';
  return (
    <svg className={`g1-char g1-char-rano ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1mskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1mdress" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF92B8"/><stop offset="100%" stopColor="#E84F86"/></linearGradient>
        <linearGradient id="g1mhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3A22"/><stop offset="100%" stopColor="#3A2516"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="34" ry="5" fill="rgba(58,53,48,0.13)"/>
      {/* oyoqlar + tufli */}
      <rect x="57" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1mskin)"/>
      <rect x="65.5" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1mskin)"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#C23B63"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#C23B63"/>
      {/* soch (orqa, uzun) */}
      <path d="M43 36 Q43 11 65 11 Q87 11 87 36 L87 80 Q82 66 77 62 L77 40 Q77 27 65 27 Q53 27 53 40 L53 62 Q48 66 43 80 Z" fill="url(#g1mhair)"/>
      {/* qo'llar — kayfiyatga qarab (panjalar bilan) */}
      {big ? (
        <g>
          <path d="M53 58 Q45 42 41 28" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="41" cy="27" r="4.6" fill="url(#g1mskin)"/>
          <path d="M77 58 Q85 42 89 28" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="89" cy="27" r="4.6" fill="url(#g1mskin)"/>
        </g>
      ) : (
        <g>
          <path d="M53 58 Q46 74 43 91" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="43" cy="92" r="4.6" fill="url(#g1mskin)"/>
          <path d="M77 58 Q84 74 87 91" stroke="url(#g1mskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="87" cy="92" r="4.6" fill="url(#g1mskin)"/>
        </g>
      )}
      {/* ko'ylak + jiyak + yenglar + yoqa + belbog' */}
      <path d="M50 56 Q52 50 58 49 L72 49 Q78 50 80 56 L94 146 Q65 155 36 146 Z" fill="url(#g1mdress)"/>
      <path d="M37 140 Q65 149 93 140 L94 146 Q65 155 36 146 Z" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="51" cy="57" rx="7" ry="6" fill="url(#g1mdress)"/>
      <ellipse cx="79" cy="57" rx="7" ry="6" fill="url(#g1mdress)"/>
      <path d="M58 50 Q65 57 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#FFFFFF"/>
      <path d="M46 67 Q65 72 84 67 L85 73 Q65 78 45 73 Z" fill="#D43E74"/>
      <circle cx="65" cy="70" r="2.6" fill="#FFD86B" stroke="#C99A2E" strokeWidth="0.8"/>
      {stars && <><DStar x={55} y={88} sc={0.46}/><DStar x={80} y={104} sc={0.46}/><DStar x={53} y={126} sc={0.46}/></>}
      {/* bosh + pigtaylar + bantik + peshona sochi */}
      <circle cx="65" cy="37" r="16.5" fill="url(#g1mskin)"/>
      <ellipse cx="45" cy="44" rx="7.5" ry="11" fill="url(#g1mhair)"/>
      <ellipse cx="85" cy="44" rx="7.5" ry="11" fill="url(#g1mhair)"/>
      <circle cx="48.5" cy="35" r="2.4" fill="#FF4F8B"/>
      <circle cx="81.5" cy="35" r="2.4" fill="#FF4F8B"/>
      <path d="M49 37 Q50 18 65 17 Q80 18 81 37 Q74 27 65 26 Q56 27 49 37 Z" fill="url(#g1mhair)"/>
      <path d="M65 16 L58 12 Q56 17 62 18 Z M65 16 L72 12 Q74 17 68 18 Z" fill="#FF4F8B"/>
      <circle cx="65" cy="16.5" r="2" fill="#E03A78"/>
      {/* yuz */}
      <g className="g1-eyes">
        <circle cx="59" cy="37" r="2.1" fill="#3A2A1E"/><circle cx="71" cy="37" r="2.1" fill="#3A2A1E"/>
        <path d="M56 33.6 Q59 32.2 61.4 33.6" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M68.6 33.6 Q71 32.2 74 33.6" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {big
        ? <path d="M59 43 Q65 51 71 43 Q65 47 59 43 Z" fill="#C0392B"/>
        : <path d="M60 44 Q65 48 70 44" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="54" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
      <ellipse cx="76" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
    </svg>
  );
};

// Anvar — o'zbek bolakay (Ra'no bilan bir xil uslub: gradient soya, panjalar, oyoq soyasi).
// pose: coming (yo'lda + sovg'a sumkasi) | door (qo'l silkitadi) | happy (savat + qo'l yuqori)
const AnvarSVG = ({ pose = 'coming', className = '' }) => {
  const happy = pose === 'happy';
  const door = pose === 'door';
  return (
    <svg className={`g1-char g1-char-anvar ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1askin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1ashirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C90E6"/><stop offset="100%" stopColor="#2C63B0"/></linearGradient>
        <linearGradient id="g1ahair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A2E26"/><stop offset="100%" stopColor="#211915"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="32" ry="5" fill="rgba(58,53,48,0.13)"/>
      {/* oyoqlar (shim) + tufli */}
      <rect x="57" y="120" width="8" height="48" rx="3.5" fill="#46566B"/>
      <rect x="65" y="120" width="8" height="48" rx="3.5" fill="#3C4A5C"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#22303F"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#22303F"/>
      {/* qo'llar pozaga qarab (panjalar bilan) */}
      {pose === 'coming' && (
        <g>
          <path d="M52 60 Q46 78 44 95" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="44" cy="96" r="4.6" fill="url(#g1askin)"/>
          <path d="M78 60 Q84 78 86 95" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="86" cy="96" r="4.6" fill="url(#g1askin)"/>
        </g>
      )}
      {door && (
        <g>
          <path d="M52 60 Q46 78 44 95" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="44" cy="96" r="4.6" fill="url(#g1askin)"/>
          <g className="g1-anvar-wave">
            <path d="M78 58 Q88 44 90 30" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="90" cy="29" r="4.6" fill="url(#g1askin)"/>
          </g>
        </g>
      )}
      {happy && (
        <g>
          <path d="M52 58 Q44 42 40 28" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="40" cy="27" r="4.6" fill="url(#g1askin)"/>
          <path d="M78 58 Q86 42 90 28" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="90" cy="27" r="4.6" fill="url(#g1askin)"/>
        </g>
      )}
      {/* futbolka + yenglar + yoqa */}
      <path d="M51 56 Q53 50 60 49 L70 49 Q77 50 79 56 L86 118 Q65 124 44 118 Z" fill="url(#g1ashirt)"/>
      <ellipse cx="52" cy="57" rx="6.5" ry="5.5" fill="url(#g1ashirt)"/>
      <ellipse cx="78" cy="57" rx="6.5" ry="5.5" fill="url(#g1ashirt)"/>
      <path d="M58 50 Q65 56 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#1F4E8C"/>
      {/* quloq */}
      <ellipse cx="50" cy="39" rx="2.6" ry="3.6" fill="url(#g1askin)"/>
      <ellipse cx="80" cy="39" rx="2.6" ry="3.6" fill="url(#g1askin)"/>
      {/* bosh */}
      <circle cx="65" cy="37" r="16" fill="url(#g1askin)"/>
      {/* kalta soch (kepka ostidan, yon va orqada ozgina) */}
      <path d="M49 39 Q48 32 54 30 L56 37 Q52 38 50 41 Z" fill="url(#g1ahair)"/>
      <path d="M81 39 Q82 32 76 30 L74 37 Q78 38 80 41 Z" fill="url(#g1ahair)"/>
      {/* KEPKA (sport) — gumbaz + band + tugma + kozirek (o'g'il bola) */}
      <path d="M47 34 Q47 15 65 14 Q83 15 83 34 Q65 28 47 34 Z" fill="#2C7BD6"/>
      <path d="M47 34 Q49 20 60 15 Q55 19 52 25 Q49 30 49 35 Z" fill="#2569B8"/>
      <rect x="47" y="32" width="36" height="4" rx="2" fill="#2569B8"/>
      <circle cx="65" cy="14.5" r="2.2" fill="#2569B8"/>
      <path d="M47 35 Q31 36 27 42 Q42 45 50 39 Z" fill="#2569B8"/>
      <path d="M47 35 Q34 36 29 41 Q42 42 49 38 Z" fill="#1E5599"/>
      {/* qosh (kiprik emas — o'g'il bola) */}
      <g stroke="#3A2A1E" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M55 36 Q59 34.6 62.5 36"/>
        <path d="M67.5 36 Q71 34.6 75 36"/>
      </g>
      {/* ko'zlar */}
      <g className="g1-eyes">
        <circle cx="59" cy="39" r="2.2" fill="#3A2A1E"/><circle cx="71" cy="39" r="2.2" fill="#3A2A1E"/>
        <circle cx="59.8" cy="38.2" r="0.7" fill="#fff"/><circle cx="71.8" cy="38.2" r="0.7" fill="#fff"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {happy
        ? <path d="M59 43 Q65 51 71 43 Q65 47 59 43 Z" fill="#C0392B"/>
        : <path d="M60 44 Q65 48 70 44" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="54" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.34)"/>
      <ellipse cx="76" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.34)"/>
      {/* coming: sovg'a sumkasi (qo'lда) */}
      {pose === 'coming' && <g><rect x="30" y="98" width="22" height="20" rx="3" fill="#E0563B"/><path d="M30 105 h22" stroke="#fff" strokeWidth="2"/><path d="M37 98 q4 -7 8 0" stroke="#B23A26" strokeWidth="2.4" fill="none"/></g>}
      {/* happy: olma savati — to'qimali, gardishli, dastali */}
      {happy && (
        <g>
          {/* tana (konus) */}
          <path d="M44 153 h42 l-5 27 a4 4 0 0 1 -4 3 h-24 a4 4 0 0 1 -4 -3 Z" fill="#C8893E"/>
          {/* to'qima: gorizontal qatorlar + vertikal o'rim */}
          <g stroke="#8F5E26" strokeWidth="0.9" opacity="0.55" fill="none" strokeLinecap="round">
            <path d="M46 161 h38 M47 169 h36 M48 177 h34"/>
            <path d="M53 154 l-1.5 30 M61 154 v30 M69 154 v30 M77 154 l1.5 30"/>
          </g>
          {/* gardish */}
          <rect x="42" y="149" width="46" height="6.5" rx="3.2" fill="#B07636"/>
          {/* dasta */}
          <path d="M51 150 q14 -15 28 0" stroke="#9A6428" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          {/* olmalar (gardishdan ko'rinadi) */}
          <circle cx="55" cy="147" r="5" fill="#E0563B"/><circle cx="65" cy="145" r="5.5" fill="#E0563B"/><circle cx="75" cy="147" r="5" fill="#E0563B"/>
          <ellipse cx="63" cy="143.5" rx="1.6" ry="2.4" fill="rgba(255,255,255,0.5)"/>
          <path d="M65 140 q1.5 -3 4 -2.5" stroke="#1F7A4D" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </g>
      )}
    </svg>
  );
};

// Bit — robot-yordamchi/boshlovchi (gradient korpus, panjalar, oyoq soyasi, ekran porlashi).
// state: present (salomlashadi) | happy (to'g'ri javob) | hint (xato/yordam)
const BitSVG = ({ state = 'present', className = '' }) => (
  <svg className={`g1-char g1-char-bit ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g1bbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2ECF2"/><stop offset="100%" stopColor="#B6C7D2"/></linearGradient>
      <linearGradient id="g1bhead" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EBF2F6"/><stop offset="100%" stopColor="#C4D3DC"/></linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)"/>
    {/* antenna */}
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="60" cy="11" r="6" fill="#FF4F28"/>
      <circle cx="58" cy="9" r="2" fill="#FFB9A6"/>
    </g>
    {/* oyoqchalar */}
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
    {/* tana */}
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g1bbody)" stroke="#A9BCC8" strokeWidth="2"/>
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5"/>
    {/* qo'llar + panjalar (state) */}
    {state === 'happy' && (
      <g>
        <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="22" cy="47" r="5" fill="#B6C7D2"/>
        <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="47" r="5" fill="#B6C7D2"/>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/>
        <g className="g1-bit-wave"><path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="43" r="5" fill="#B6C7D2"/></g>
      </g>
    )}
    {state === 'hint' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/>
        <path d="M84 74 C 92 64 96 54 95 46" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="95" cy="45" r="5" fill="#B6C7D2"/>
      </g>
    )}
    {/* bosh */}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g1bhead)" stroke="#A9BCC8" strokeWidth="2"/>
    {/* ekran-yuz + porlash */}
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C"/>
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)"/>
    <g className="g1-eyes" fill="#5BD6F2">
      {state === 'hint'
        ? <><circle cx="50" cy="50" r="4.5"/><circle cx="70" cy="49" r="5.5"/></>
        : <><circle cx="50" cy="50" r="5"/><circle cx="70" cy="50" r="5"/></>}
    </g>
    {state === 'happy' && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round"/>}
    {state === 'present' && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round"/>}
    {state === 'hint' && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2"/>}
    {/* hint: yordam belgisi */}
    {state === 'hint' && <g><circle cx="99" cy="38" r="9" fill="#FFC23C"/><text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text></g>}
  </svg>
);

// Personaj holatini butun urok darajasida boshqaruvchi kontekst.
// Har bir ekran o'z holatini e'lon qiladi (useHero), bitta doimiy overlay ko'rsatadi.
const HeroContext = createContext({ setMood: () => {} });
const useHero = (mood) => {
  const { setMood } = useContext(HeroContext);
  useEffect(() => { setMood(mood); }, [mood, setMood]);
};
// Overlay personaj (pastki-chap): o'quv ekranlarida Ra'no (syujet ichi), ramkada Bit (boshlovchi).
// 'present' — Bit BOSHLOVCHI (sIntro/sGuest/s11). Reaksiyada Bit endi OVERLAY emas, KARTOCHKADA (Reaction).
// Overlay faqat BIT (boshlovchi, 'present' — ramka ekranlari). Ra'no overlay olib tashlandi
// (metodist talabi): Ra'no endi faqat frame ichidagi cast'da; reaksiya — Bit-kartochkada.
const StageHero = ({ mood }) => {
  if (mood !== 'present') return null;
  return (
    <div className="g1-stage-hero g1-sh-present" aria-hidden="true">
      <BitSVG state="present" className="g1-hero-bit"/>
    </div>
  );
};

// Confetti — bayram bo'laklari (qayta ishlatiladigan)
const Confetti = () => (
  <>
    <span className="g1-conf g1-conf1"/><span className="g1-conf g1-conf2"/><span className="g1-conf g1-conf3"/>
    <span className="g1-conf g1-conf4"/><span className="g1-conf g1-conf5"/><span className="g1-conf g1-conf6"/>
  </>
);

// Reaction — javob otkligi: Bit-KARTOCHKA (matn + o'ngda animatsion Bit), 5-sinf fakt-kartochka uslubi.
// To'g'ri -> Bit happy (sakraydi); xato -> Bit hint (yordam, qiyshayadi). Ra'no overlay ham reaksiya qiladi.
const Reaction = ({ state, praise }) => {
  const ok = state === 'correct';
  useHero(ok ? 'happy' : 'encourage');
  return (
    <div className={`g1-bitcard ${ok ? 'g1-bitcard-ok' : 'g1-bitcard-enc'}`}>
      <div className="g1-bitcard-fig"><BitSVG state={ok ? 'happy' : 'hint'}/></div>
      <div className="g1-bitcard-body"><span className="g1-bitcard-txt">{praise}</span></div>
    </div>
  );
};

// CountDemo — jonli sanash: narsalar birma-bir paydo (loop), katta son. variety=har xil narsa.
const CountDemo = ({ max = 5, kind = 'apple', variety = false, highlightLast = false, stepMs = 1300, onDone, showNumbers = true }) => {
  const k = useCountOnce(max, { stepMs });
  const firedRef = useRef(false);
  useEffect(() => { if (k >= max && !firedRef.current) { firedRef.current = true; if (onDone) onDone(); } }, [k, max, onDone]);
  return (
    <div className="g1-demo">
      <div className="g1-demo-row">
        {Array.from({ length: max }).map((_, i) => {
          const on = i < k;
          const isLast = i === k - 1;
          const kk = variety ? KIND_ORDER[i % KIND_ORDER.length] : kind;
          return (
            <span key={i} className={`g1-demo-cell ${on ? 'on' : ''} ${on && isLast && highlightLast ? 'pulse' : ''}`}>
              <ObjSvg kind={kk}/>
              {on && showNumbers && <span className="g1-demo-tag mono">{i + 1}</span>}
            </span>
          );
        })}
      </div>
      {showNumbers && <div className={`g1-demo-num mono ${highlightLast ? 'big' : ''}`}>{k}</div>}
    </div>
  );
};

// CountTrack — son qatori: belgi oldinga (1->5), 5 da pauza, keyin orqaga (5->1).
// speak=true bo'lsa, har songa kelganda o'sha son ovozda aytiladi (vizual bilan sinxron).
// Yo'nalish yorlig'i ko'rinadi; demo kuzatish uchun takrorlanadi. reduced-motion -> statik.
const CountTrack = ({ max = 5, speak = false, muted = false, startDelay = 650, onDone, started = true }) => {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(0);
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => {
    if (!started) return;   // "Boshlash" bosilmaguncha turadi (statik qator)
    if (reduced) { const id = setTimeout(() => { setPos(0); setDir(0); if (onDone) onDone(); }, 0); return () => clearTimeout(id); }
    const steps = [];
    for (let n = 1; n <= max; n += 1) steps.push({ n, d: 1 });
    for (let n = max - 1; n >= 1; n -= 1) steps.push({ n, d: -1 });
    let alive = true; let timer; let i = 0; let fired = false;
    const tick = () => {
      if (!alive) return;
      if (i >= steps.length) {
        if (!fired) { fired = true; if (onDone) onDone(); }   // birinchi sweep tugadi
        setPos(0); setDir(0); timer = setTimeout(() => { i = 0; tick(); }, 1700); return;
      }
      const s = steps[i];
      setPos(s.n); setDir(s.d);
      if (speak && !mutedRef.current) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][s.n]); }
      const atPeak = s.n === max && s.d === 1;   // 5 da pauza
      i += 1;
      timer = setTimeout(tick, atPeak ? 1500 : 900);
    };
    timer = setTimeout(tick, startDelay);
    return () => { alive = false; clearTimeout(timer); };
  }, [max, reduced, speak, lang, startDelay, onDone, started]);
  const label = dir > 0 ? (lang === 'uz' ? 'Oldinga' :'Вперёд') : dir < 0 ? (lang === 'uz' ? 'Orqaga' :'Назад') : ' ';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
      <div className={`g1-track-label mono ${dir < 0 ? 'back' : ''}`}>
        {dir > 0 ? '→ ' : dir < 0 ? '← ' : ''}{label}
      </div>
      <div className="g1-track">
        {Array.from({ length: max }).map((_, i) => {
          const n = i + 1;
          const active = pos === n;
          return <div key={n} className={`g1-track-tile ${active ? 'active ' + (dir > 0 ? 'fwd' : 'back') : ''}`}><span className="mono">{n}</span></div>;
        })}
      </div>
    </div>
  );
};

// MissingTrack — son qatori bo'sh joy bilan (figura: 1 2 ? 4 5).
// solved bo'lsa, bo'sh joyga javob (yashil) paydo bo'ladi.
const MissingTrack = ({ seq, answer, solved }) => (
  <div className="g1-track">
    {seq.map((v, i) => {
      if (v === '?' && solved && answer != null) {
        return <div key={i} className="g1-track-tile g1-track-filled g1-pop-in"><span className="mono">{answer}</span></div>;
      }
      return <div key={i} className={`g1-track-tile ${v === '?' ? 'gap' : ''}`}><span className="mono">{v}</span></div>;
    })}
  </div>
);

// CountingHand — realroq qo'l: teri rangli kaft + yumaloq barmoqlar (cho'zilgan/bukilgan).
// Barmoqlar 1..max bir marta ko'tariladi (5 da bosh barmoq ham). Darslik 2-bob 13-dars.
const CountingHand = ({ max = 5, big = false, loop = false }) => {
  const k = useCountOnce(max, { stepMs: 950, loop, holdMs: 1700 });
  const SKIN = '#F4BC8E', SKIN2 = '#E3A678', NAIL = '#FCE6D6';
  const palmTop = 86, bottom = 124;
  const fingers = [
    { x: 42, up: 50 },  // ko'rsatkich
    { x: 63, up: 62 },  // o'rta (eng uzun)
    { x: 84, up: 52 },  // nomsiz
    { x: 105, up: 40 }, // jimjiloq
  ];
  const upCount = Math.min(k, 4);
  const thumbUp = k >= 5;
  const ftrans = { transition: 'y 0.32s cubic-bezier(0.34,1.4,0.64,1), height 0.32s cubic-bezier(0.34,1.4,0.64,1), fill 0.3s ease' };
  return (
    <div className={`g1-hand ${big ? 'g1-hand-big' : ''}`}>
      <svg viewBox="0 0 162 184" width="100%" height="100%" aria-hidden="true">
        {/* bilak */}
        <rect x="60" y="150" width="46" height="32" rx="14" fill={SKIN2}/>
        {/* barmoqlar (bukilgan = kalta + to'qroq) */}
        {fingers.map((f, i) => {
          const up = i < upCount;
          const tip = palmTop - (up ? f.up : 18);
          return (
            <g key={i}>
              <rect x={f.x} y={tip} width="17" height={bottom - tip} rx="8.5" fill={up ? SKIN : SKIN2} style={ftrans}/>
              {up && <rect x={f.x + 3.5} y={tip + 6} width="10" height="13" rx="5" fill={NAIL}/>}
            </g>
          );
        })}
        {/* kaft */}
        <rect x="34" y="82" width="94" height="80" rx="34" fill={SKIN}/>
        <path d="M52 118 q29 11 56 0" stroke={SKIN2} strokeWidth="2.4" fill="none" opacity="0.5" strokeLinecap="round"/>
        <path d="M58 134 q23 8 46 0" stroke={SKIN2} strokeWidth="2.2" fill="none" opacity="0.42" strokeLinecap="round"/>
        {/* bosh barmoq (5 da chiqadi) */}
        <g transform={thumbUp ? 'rotate(-42 44 124)' : ''} style={{ transition: 'transform 0.32s ease' }}>
          <rect x={thumbUp ? 14 : 30} y={thumbUp ? 92 : 108} width="18" height={thumbUp ? 50 : 18} rx="9" fill={thumbUp ? SKIN : SKIN2} style={{ transition: 'fill 0.3s ease' }}/>
          {thumbUp && <rect x="18" y="97" width="10" height="13" rx="5" fill={NAIL}/>}
        </g>
      </svg>
      <div className="g1-hand-num mono">{k}</div>
    </div>
  );
};

// DressStars — Ra'no yulduzli ko'ylakda; 3 yulduz ko'ylak ichida sochilgan.
// happy=true (to'g'ri javob): qiz qo'llarini ko'taradi, sakraydi, "Molodec/Ajoyib" chiqadi.
const DStar = ({ x, y, sc }) => (
  <g transform={`translate(${x} ${y}) scale(${sc})`}>
    <g transform="translate(-20 -21)">
      <path d="M20 3 L24.9 14.7 L37.5 15.8 L28 24.2 L30.9 36.5 L20 29.8 L9.1 36.5 L12 24.2 L2.5 15.8 L15.1 14.7 Z" fill="url(#g1starG)" stroke="#E0992A" strokeWidth="0.8" strokeLinejoin="round"/>
      <path d="M20 9 L22.4 15.4 L20 20 L17.6 15.4 Z" fill="rgba(255,255,255,0.38)"/>
    </g>
  </g>
);
// DressStars — s4 mashqi: kanonik Ra'no (xush holatda) + ko'ylakda 3 yulduz + xursand uchqunlari.
// Yagona Ra'no manbai — RanoSVG (boshqa joydagi Ra'no bilan AYNAN bir xil).
// DressStars — s4 figura: boshqa slaydlarda ISHLAYOTGAN cast tuzilishini aynan ishlatadi
// (g1-cast + g1-cast-fig idle). Shu sabab animatsiya kafolatli (xuddi slayd 1/13/15 dagidek).
const DressStars = ({ happy = false }) => (
  <div className="g1-cast in" style={{ position: 'relative' }}>
    <div className="g1-cast-fig" style={{ height: 'clamp(160px, 40vw, 250px)' }}>
      <RanoSVG mood={happy ? 'happy' : 'pointing'} stars className="g1-cast-svg"/>
    </div>
    {happy && (
      <>
        <span className="g1-spark g1-spark1"/><span className="g1-spark g1-spark2"/><span className="g1-spark g1-spark3"/>
        <span className="g1-conf g1-conf1"/><span className="g1-conf g1-conf2"/><span className="g1-conf g1-conf3"/>
        <span className="g1-conf g1-conf4"/><span className="g1-conf g1-conf5"/><span className="g1-conf g1-conf6"/>
      </>
    )}
  </div>
);

// ETALON KIT · WIDGET · BasketArt — chinakam SVG savat (egma dasta + konus tana + egri to'qima + oval gardish).
// Olmalar buning ustiga (g1-rb-bowl) qo'yiladi — gardishdan ko'rinib turadi.
const BasketArt = () => (
  <svg className="g1-rb-svg" viewBox="0 0 220 170" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs>
      <linearGradient id="g1baskBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D89A4C"/><stop offset="100%" stopColor="#B0712C"/></linearGradient>
    </defs>
    {/* dasta */}
    <path d="M62 86 Q110 14 158 86" fill="none" stroke="#90591D" strokeWidth="12" strokeLinecap="round"/>
    <path d="M62 86 Q110 22 158 86" fill="none" stroke="#C68E42" strokeWidth="4.5" strokeLinecap="round" opacity="0.7"/>
    {/* tana (konus, yumaloq tag) */}
    <path d="M30 84 Q110 72 190 84 L173 144 Q170 156 158 158 Q110 164 62 158 Q50 156 47 144 Z" fill="url(#g1baskBody)" stroke="#8A561B" strokeWidth="2"/>
    {/* to'qima — gorizontal egri qatorlar */}
    <g fill="none" stroke="#8A561B" strokeWidth="1.6" opacity="0.45">
      <path d="M41 100 Q110 89 179 100"/>
      <path d="M44 114 Q110 104 176 114"/>
      <path d="M47 128 Q110 119 173 128"/>
      <path d="M50 142 Q110 134 170 142"/>
    </g>
    {/* to'qima — vertikal o'rim */}
    <g fill="none" stroke="#8A561B" strokeWidth="1.2" opacity="0.32">
      <path d="M72 86 L68 152"/><path d="M91 84 L89 156"/><path d="M110 83 V158"/><path d="M129 84 L131 156"/><path d="M148 86 L152 152"/>
    </g>
    {/* gardish (oval old lab) */}
    <path d="M28 82 Q110 98 192 82 L192 94 Q110 110 28 94 Z" fill="#B5793A" stroke="#8A561B" strokeWidth="1.5"/>
    <path d="M32 84 Q110 98 188 84" fill="none" stroke="#EAB97A" strokeWidth="2" opacity="0.6"/>
  </svg>
);

// BasketCelebration — yakuniy testда to'g'ri javobdan keyin: savat ko'tariladi, olmalar
// birma-bir sekin tushadi (ko'z charchamaydi). reduced-motion -> darrov.
const BasketCelebration = ({ n = 5 }) => (
  <div className="g1-celebrate" style={{ position: 'relative' }}>
    <Confetti/>
    <div className="g1-realbasket g1-celebrate-basket">
      <BasketArt/>
      <div className="g1-rb-bowl">
        {Array.from({ length: n }).map((_, i) => (
          <span key={i} className="g1-token-obj g1-celebrate-apple" style={{ animationDelay: `${0.6 + i * 0.45}s` }}><ObjSvg kind="apple"/></span>
        ))}
      </div>
    </div>
  </div>
);

// AmbientBg — bo'sh joyni to'ldiruvchi yengil suzuvchi shakllar (dekor, reduced-motion bilan o'chadi).
const AmbientBg = () => (
  <div className="amb" aria-hidden="true">
    <div className="amb-o amb-o1"/>
    <div className="amb-o amb-o2"/>
    <div className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// GameDrill — drag+tap o'yin bloki (4 mashq): olma yig'ish / pazl / juftlash / tartiblash.
// Drag (pointer events, touch'da ishlaydi) + TAP-zaxira (tok bos -> zona bos). Ball yo'q.
// ============================================================
const PIECE_COLORS = ['#FF4F28', '#019ACB', '#1F7A4D', '#FFC23C', '#FF7AA8'];
const FLOWER_POS = [[50, 14], [82, 40], [69, 80], [31, 80], [18, 40]];   // 5 bargcha joylashuvi (% )
const GAME_EX = [
  // savat: chalg'ituvchilar orasidan kerakli narsalarni topib sanab solish
  { type: 'basket', targets: { apple: 3, cherry: 2 }, tray: [{ kind: 'apple', count: 5 }, { kind: 'cherry', count: 4 }, { kind: 'star', count: 3 }, { kind: 'fish', count: 2 }] },
  { type: 'puzzle', n: 5 },
  { type: 'match', groups: [2, 4, 5] },
  { type: 'order', n: 5 },
];
const kindOfId = (id) => id.replace(/[0-9]+$/, '');
const exTokens = (ex) => {
  if (ex.type === 'basket') {
    const toks = [];
    ex.tray.forEach((g) => { for (let i = 0; i < g.count; i += 1) toks.push({ id: `${g.kind}${i}`, kind: g.kind }); });
    return toks;
  }
  if (ex.type === 'puzzle') return Array.from({ length: ex.n }, (_, i) => ({ id: `p${i}`, color: PIECE_COLORS[i % PIECE_COLORS.length] }));
  if (ex.type === 'match') return ex.groups.map((v) => ({ id: `n${v}`, value: v }));
  return [1, 2, 3, 4, 5].map((v) => ({ id: `o${v}`, value: v }));   // order (natural; tray aralashadi)
};
const exZones = (ex) => {
  if (ex.type === 'basket') return [{ id: 'basket' }];
  if (ex.type === 'puzzle') return Array.from({ length: ex.n }, (_, i) => ({ id: `s${i}` }));
  if (ex.type === 'match') return ex.groups.map((v) => ({ id: `b${v}`, count: v }));
  return [1, 2, 3, 4, 5].map((i) => ({ id: `z${i}`, order: i }));
};
const exComplete = (ex, placement) => {
  if (ex.type === 'basket') {
    const cnt = (k) => Object.keys(placement).filter((tid) => placement[tid] === 'basket' && kindOfId(tid) === k).length;
    return Object.keys(ex.targets).every((k) => cnt(k) === ex.targets[k]);
  }
  return exTokens(ex).every((tk) => placement[tk.id] != null);
};

// useDnd — pointer-drag + tap. onDrop(tokenId, zoneId|null). Tap: tok bos -> sel; zona bos -> joylash.
function useDnd(onDrop) {
  const [drag, setDrag] = useState(null);   // { id, x, y }
  const [sel, setSel] = useState(null);
  const startRef = useRef(null);
  const onDropRef = useRef(onDrop);
  useEffect(() => { onDropRef.current = onDrop; }, [onDrop]);
  useEffect(() => {
    if (!drag) return undefined;
    const move = (e) => {
      const s = startRef.current;
      if (s && (Math.abs(e.clientX - s.sx) > 6 || Math.abs(e.clientY - s.sy) > 6)) s.moved = true;
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : null));
    };
    const up = (e) => {
      const s = startRef.current;
      startRef.current = null;
      setDrag(null);
      if (!s) return;
      if (!s.moved) { setSel(s.id); return; }   // tap -> tanlash
      const el = (typeof document !== 'undefined') ? document.elementFromPoint(e.clientX, e.clientY) : null;
      const z = el && el.closest ? el.closest('[data-zone]') : null;
      onDropRef.current(s.id, z ? z.getAttribute('data-zone') : null);
      setSel(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [drag]);
  const startDrag = (e, id) => {
    if (e.button != null && e.button !== 0) return;
    startRef.current = { id, sx: e.clientX, sy: e.clientY, moved: false };
    setDrag({ id, x: e.clientX, y: e.clientY });
  };
  const tapZone = (zoneId) => { if (sel != null) { onDropRef.current(sel, zoneId); setSel(null); } };
  return { drag, sel, startDrag, tapZone };
}

// Savatga meva qo'yishni ko'rsatuvchi qo'l-demo (mevani olib savatga tashlaydi, sikl).
const HandSvg = () => (
  <svg className="g1-bhd-hand" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#5A5A60" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 9.5V4a2 2 0 0 0-4 0v10"/>
    <path d="M14 10V9a2 2 0 0 0-4 0v1"/>
    <path d="M18 11v-1a2 2 0 0 0-4 0v1"/>
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);
const BasketHandDemo = ({ piece }) => (
  <div className="g1-bhd" aria-hidden="true">
    <div className="g1-bhd-move">
      {piece}
      <HandSvg/>
    </div>
  </div>
);

const GameDrill = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sd;
  const sfx = useSfx();
  const audio = useAudio([{ id: 'sd_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const total = GAME_EX.length;
  const [exIdx, setExIdx] = useState(0);
  const [placement, setPlacement] = useState({});   // tokenId -> zoneId
  const [solvedItem, setSolvedItem] = useState(false);
  const [wrongZone, setWrongZone] = useState(null);   // noto'g'ri sudralganda zona yumshoq tebranadi
  const [bounceTok, setBounceTok] = useState(null);   // noto'g'ri token tray'ga sakrab qaytadi
  const [demoOff, setDemoOff] = useState(false);   // qo'l-demo birinchi harakatdan keyin so'nadi
  const ex = GAME_EX[exIdx];
  const tokens = exTokens(ex);
  const zones = exZones(ex);
  const allDone = exIdx >= total - 1 && solvedItem;
  const tokenById = (id) => tokens.find((tk) => tk.id === id);
  const tokenInZone = (zid) => Object.keys(placement).find((tid) => placement[tid] === zid);
  const promptText = c[`q_${ex.type}`] ? t(c[`q_${ex.type}`]) : '';

  const [displayOrder, setDisplayOrder] = useState(() => exTokens(GAME_EX[0]).map((tk) => tk.id));
  const [praiseWord, setPraiseWord] = useState('');
  const shuffledRef = useRef(false);
  useEffect(() => {
    if (shuffledRef.current) return undefined;
    shuffledRef.current = true;
    const id = setTimeout(() => setDisplayOrder(shuffleArr(exTokens(GAME_EX[exIdx]).map((tk) => tk.id))), 0);
    return () => clearTimeout(id);
  }, [exIdx]);

  // har mashq savolini ovozli aytish
  const prevRef = useRef(-1);
  useEffect(() => {
    if (exIdx !== prevRef.current) {
      prevRef.current = exIdx;
      if (!audio.muted) { const e = getAudioEngine(); if (e && c[`q_${GAME_EX[exIdx].type}`]) e.pushOneOff(c[`q_${GAME_EX[exIdx].type}`][lang]); }
    }
  }, [exIdx, audio.muted, lang, c]);

  const placedKind = (kind) => Object.keys(placement).filter((tid) => placement[tid] === 'basket' && kindOfId(tid) === kind).length;
  const accept = (tokenId, zoneId) => {
    const tok = tokenById(tokenId);
    if (!tok) return false;
    if (ex.type === 'basket') return zoneId === 'basket' && (ex.targets[tok.kind] || 0) > placedKind(tok.kind);
    if (ex.type === 'puzzle') return zones.some((z) => z.id === zoneId) && tokenInZone(zoneId) == null;
    if (ex.type === 'match') { const z = zones.find((zz) => zz.id === zoneId); return !!z && z.count === tok.value; }
    const zo = zones.find((zz) => zz.id === zoneId);
    return !!zo && zo.order === tok.value && tokenInZone(zoneId) == null;
  };
  const handleDrop = useCallback((tokenId, zoneId) => {
    if (solvedItem || !zoneId) return;   // darrov ishlaydi (canAns darvozasi yo'q)
    if (placement[tokenId]) return;
    if (!accept(tokenId, zoneId)) {   // yumshoq: token tray'ga sakrab qaytadi, zona tebranadi, ovoz "yana sana"
      sfx.playWrong();
      setBounceTok(tokenId); setTimeout(() => setBounceTok(null), 500);
      setWrongZone(zoneId); setTimeout(() => setWrongZone(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.retry_audio[lang]); }
      return;
    }
    setPlacement((prev) => ({ ...prev, [tokenId]: zoneId }));
    if (!audio.muted) {
      const e = getAudioEngine();
      if (e) {
        if (ex.type === 'basket') { const tk = tokenById(tokenId); if (tk) e.pushOneOff(NUM_WORDS[lang][placedKind(tk.kind) + 1] || ''); }   // shu turdan nechinchi
        else if (ex.type === 'match' || ex.type === 'order') { const tk = tokenById(tokenId); if (tk && tk.value) e.pushOneOff(NUM_WORDS[lang][tk.value] || ''); }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solvedItem, placement, exIdx, audio.muted, lang]);
  const dnd = useDnd(handleDrop);

  // tugallanganini aniqlash
  useEffect(() => {
    if (solvedItem) return undefined;
    const done = exComplete(GAME_EX[exIdx], placement);
    if (!done) return undefined;
    const tm = setTimeout(() => {
      setSolvedItem(true);
      sfx.playCorrect();
      const pw = nextPraise(lang); setPraiseWord(pw);
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff((exIdx >= total - 1 ? c.done_text : c.correct_text)[lang]); } }
    }, 0);
    return () => clearTimeout(tm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, solvedItem, exIdx]);

  const nextItem = () => {
    const ni = exIdx + 1;
    setExIdx(ni);
    setDisplayOrder(shuffleArr(exTokens(GAME_EX[ni]).map((tk) => tk.id)));
    setPlacement({});
    setSolvedItem(false);
    setDemoOff(false);   // har mashqда qo'l-demo qayta ko'rinadi (q1 savat, q2 pazl)
  };

  const tokenVisual = (tok) => {
    if (ex.type === 'basket') return <span className="g1-token-obj"><ObjSvg kind={tok.kind}/></span>;
    if (ex.type === 'puzzle') return <span className="g1-petal"/>;
    return <span className="g1-token-num mono">{tok.value}</span>;
  };
  const trayTokens = displayOrder.map(tokenById).filter((tk) => tk && !placement[tk.id]);

  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!allDone} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{promptText} <span className="mono small" style={{ color: T.ink3 }}>{exIdx + 1} / {total}</span></p>

        {/* nishon (zonalar) */}
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          {(ex.type === 'basket' || ex.type === 'puzzle') && exIdx <= 1 && !demoOff && !solvedItem && Object.keys(placement).length === 0 && (
            <BasketHandDemo piece={ex.type === 'basket'
              ? <span className="g1-bhd-apple"><ObjSvg kind="apple"/></span>
              : <span className="g1-bhd-petal"/>}/>
          )}
          {ex.type === 'basket' && (
            <div className="g1-basketwrap">
              <div className="g1-recipe">
                {Object.keys(ex.targets).map((k) => (
                  <span key={k} className="g1-recipe-item">
                    <span className="g1-recipe-ic"><ObjSvg kind={k}/></span>
                    <span className="g1-recipe-cnt mono">{placedKind(k)} / {ex.targets[k]}</span>
                  </span>
                ))}
              </div>
              <div className={`g1-realbasket g1-dropzone ${wrongZone === 'basket' ? 'g1-nudge' : ''}`} data-zone="basket" onClick={() => dnd.tapZone('basket')}>
                <BasketArt/>
                <div className="g1-rb-bowl">
                  {Object.keys(placement).map((tid) => <span key={tid} className="g1-token-obj"><ObjSvg kind={kindOfId(tid)}/></span>)}
                </div>
              </div>
            </div>
          )}
          {ex.type === 'puzzle' && (
            <div className="g1-flowerwrap">
              <div className={`g1-flower ${solvedItem ? 'g1-flower-spin' : ''}`}>
                <div className="g1-flower-center"/>
                {zones.map((z, i) => {
                  const tid = tokenInZone(z.id);
                  return <div key={z.id} className={`g1-petal-slot g1-dropzone ${tid ? 'filled' : ''} ${wrongZone === z.id ? 'g1-nudge' : ''}`} data-zone={z.id}
                    style={{ left: `${FLOWER_POS[i][0]}%`, top: `${FLOWER_POS[i][1]}%` }} onClick={() => dnd.tapZone(z.id)}>
                    {tid && <span className="g1-petal g1-pop-in"/>}
                  </div>;
                })}
              </div>
              <span className="g1-basket-count mono">{Object.keys(placement).length} / {ex.n}</span>
            </div>
          )}
          {ex.type === 'match' && (
            <div className="g1-mbaskets">
              {zones.map((z) => {
                const tid = tokenInZone(z.id);
                return <div key={z.id} className={`g1-mbasket g1-dropzone ${wrongZone === z.id ? 'g1-nudge' : ''}`} data-zone={z.id} onClick={() => dnd.tapZone(z.id)}>
                  <div className="g1-mbasket-num mono">{tid ? tokenById(tid).value : ''}</div>
                  <Pips n={z.count} kind="apple"/>
                </div>;
              })}
            </div>
          )}
          {ex.type === 'order' && (
            <div className="g1-order">
              {zones.map((z) => {
                const tid = tokenInZone(z.id);
                return <div key={z.id} className={`g1-pos g1-dropzone ${tid ? 'filled' : ''} ${wrongZone === z.id ? 'g1-nudge' : ''}`} data-zone={z.id} onClick={() => dnd.tapZone(z.id)}>
                  {tid && <span className="g1-token-num mono">{tokenById(tid).value}</span>}
                </div>;
              })}
            </div>
          )}
        </div>

        {/* tray (sudraladigan tokenlar) */}
        {!solvedItem && (
          <div className="g1-tray fade-up delay-2">
            {trayTokens.map((tok) => (
              <div key={tok.id} className={`g1-token ${dnd.sel === tok.id ? 'g1-token-sel' : ''} ${bounceTok === tok.id ? 'g1-bounceback' : ''}`}
                onPointerDown={(e) => { if (!solvedItem) { e.preventDefault(); setDemoOff(true); dnd.startDrag(e, tok.id); } }}>
                {tokenVisual(tok)}
              </div>
            ))}
          </div>
        )}

        {solvedItem && (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Reaction state="correct" praise={praiseWord}/>
            {!allDone && (
              <button className="btn-white-accent" onClick={nextItem}
                style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                {lang === 'uz' ? 'Keyingisi' : 'Дальше'}
              </button>
            )}
          </div>
        )}

        {/* drag arvohi */}
        {dnd.drag && tokenById(dnd.drag.id) && (
          <div className="g1-ghost" style={{ left: dnd.drag.x, top: dnd.drag.y }}>{tokenVisual(tokenById(dnd.drag.id))}</div>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// EKRANLAR
// ============================================================

// ============================================================
// SYUJET (hikoya) slaydlari — interaktiv emas: sahna + matn + audio + Davom.
// "Ra'no mehmon kutmoqda" syujetining kirish va ko'prik lahzalari.
// ============================================================

// Dasturxon sahnasi — krem dasturxon BUTUN stolni yopadi (taxta ko'rinmaydi),
// haqiqiy olma shakli, aniq choynak (qopqoq + C-dasta + jo'mrak), bug' jo'mrakdan.
const DasturxonScene = () => (
  <div className="g1-table-scene">
    <svg className="g1-table-svg" viewBox="0 0 280 200" aria-hidden="true">
      <defs>
        <linearGradient id="g1clothT" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCF6E6"/><stop offset="100%" stopColor="#F0E2C2"/>
        </linearGradient>
        <linearGradient id="g1clothS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4E8CB"/><stop offset="100%" stopColor="#E7D5AA"/>
        </linearGradient>
        <linearGradient id="g1woodG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C68A45"/><stop offset="100%" stopColor="#8A5A28"/>
        </linearGradient>
        <linearGradient id="g1gleam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0"/>
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="g1bandSh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22"/>
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0"/>
          <stop offset="100%" stopColor="#003A52" stopOpacity="0.3"/>
        </linearGradient>
        <clipPath id="g1clothClip">
          <ellipse cx="140" cy="108" rx="130" ry="19"/>
          <path d="M12 108 V148 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 V108 Z"/>
        </clipPath>
      </defs>
      {/* pol soyasi */}
      <ellipse cx="140" cy="190" rx="110" ry="6" fill="rgba(58,53,48,0.10)"/>
      {/* stol oyoqlari (dasturxon ostidan ko'rinadi) */}
      <ellipse cx="64" cy="188" rx="11" ry="3" fill="rgba(58,53,48,0.16)"/>
      <ellipse cx="216" cy="188" rx="11" ry="3" fill="rgba(58,53,48,0.16)"/>
      <rect x="57" y="144" width="14" height="42" rx="4" fill="url(#g1woodG)"/>
      <rect x="209" y="144" width="14" height="42" rx="4" fill="url(#g1woodG)"/>
      <rect x="55" y="182" width="18" height="5" rx="2.5" fill="#7A4E22"/>
      <rect x="207" y="182" width="18" height="5" rx="2.5" fill="#7A4E22"/>
      {/* dasturxon etagi (butun old yuzni yopadi, to'lqinli) */}
      <path d="M12 108 V148 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 q16 12 32 0 V108 Z" fill="url(#g1clothS)"/>
      {/* MILLIY NAQSH bezak chizig'i: ko'k zamin + oltin jiyak + romb-nuqta takrori */}
      <rect x="12" y="127" width="256" height="15" fill="#0E86B4"/>
      <rect x="12" y="127" width="256" height="15" fill="url(#g1bandSh)"/>
      <rect x="12" y="126.5" width="256" height="2" fill="#E8B24A"/>
      <rect x="12" y="140.5" width="256" height="2" fill="#E8B24A"/>
      <rect x="12" y="124.5" width="256" height="1.2" fill="#F4E8CB"/>
      {[24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264].map((x) => (
        <g key={x} transform={`translate(${x} 134.5)`}>
          {/* romb (oq jiyakli) + ko'k markaz */}
          <rect x="-4.4" y="-4.4" width="8.8" height="8.8" rx="1" fill="#FCF6E6" transform="rotate(45)"/>
          <rect x="-2.4" y="-2.4" width="4.8" height="4.8" fill="#0E86B4" transform="rotate(45)"/>
          <circle r="1.1" fill="#FCF6E6"/>
        </g>
      ))}
      {[36, 60, 84, 108, 132, 156, 180, 204, 228, 252].map((x) => (
        <circle key={x} cx={x} cy="134.5" r="1.4" fill="#E8B24A"/>
      ))}
      {/* dasturxon usti (krem sirt) */}
      <ellipse cx="140" cy="108" rx="130" ry="19" fill="url(#g1clothT)" stroke="#E3D2A6" strokeWidth="1.5"/>
      <ellipse cx="116" cy="103" rx="66" ry="7" fill="rgba(255,255,255,0.32)"/>
      {/* suzib o'tuvchi yorug'lik (dasturxon ustida) */}
      <g clipPath="url(#g1clothClip)">
        <rect className="g1-table-sweep" x="0" y="86" width="30" height="70" fill="url(#g1gleam)"/>
      </g>
      {/* narsa soyalari */}
      <ellipse cx="74" cy="111" rx="27" ry="5.5" fill="rgba(58,53,48,0.11)"/>
      <ellipse cx="143" cy="113" rx="27" ry="6" fill="rgba(58,53,48,0.11)"/>
      <ellipse cx="214" cy="113" rx="26" ry="5.5" fill="rgba(58,53,48,0.11)"/>
      {/* NON (lochira: jiyak + bosma markaz + kunjut) */}
      <g className="g1-table-non">
        <ellipse cx="74" cy="90" rx="27" ry="22" fill="url(#g1nonG)" stroke="#A86B28" strokeWidth="1.6"/>
        <ellipse cx="74" cy="90" rx="13" ry="10.5" fill="#C9923F"/>
        <ellipse cx="74" cy="90" rx="13" ry="10.5" fill="none" stroke="#A86B28" strokeWidth="1.2" strokeDasharray="2 3"/>
        <g fill="#A06A28">
          <circle cx="74" cy="71.5" r="1.4"/><circle cx="58" cy="80" r="1.4"/><circle cx="55" cy="93" r="1.4"/>
          <circle cx="62" cy="103" r="1.4"/><circle cx="86" cy="103" r="1.4"/><circle cx="93" cy="93" r="1.4"/><circle cx="90" cy="80" r="1.4"/>
        </g>
        <ellipse cx="64" cy="80" rx="7" ry="3.4" fill="rgba(255,255,255,0.20)"/>
      </g>
      {/* CHOYNAK: dasta (orqada) -> tana -> jo'mrak -> qopqoq */}
      <g>
        <path d="M123 80 C 104 82 104 106 123 106" stroke="url(#g1teaG)" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="143" cy="93" rx="24" ry="20" fill="url(#g1teaG)"/>
        <path d="M163 83 Q177 81 181 69 L186 72 Q182 86 166 94 Z" fill="url(#g1teaG)"/>
        <ellipse cx="143" cy="75" rx="15" ry="5" fill="#0892C2"/>
        <ellipse cx="143" cy="75" rx="15" ry="5" fill="none" stroke="#016E93" strokeWidth="1"/>
        <circle cx="143" cy="69" r="4" fill="#016E93"/>
        <ellipse cx="133" cy="85" rx="7.5" ry="4.5" fill="rgba(255,255,255,0.42)"/>
        <path d="M127 99 Q143 105 159 99" stroke="rgba(255,255,255,0.45)" strokeWidth="2.6" fill="none"/>
      </g>
      {/* OLMALAR (qizil, yelkali shakl, cho'qqi botig'i + band/barg + yaltiroq) */}
      <g className="g1-table-apples">
        <g transform="translate(224 92)">
          <path d="M0 -7 C -5 -13 -11 -13 -13.5 -8 C -16.5 -2 -15.5 9 -8 14.5 C -4 17 -1.5 16.5 0 14.5 C 1.5 16.5 4 17 8 14.5 C 15.5 9 16.5 -2 13.5 -8 C 11 -13 5 -13 0 -7 Z" fill="url(#g1apA)"/>
          <circle cx="0" cy="14.2" r="1.5" fill="rgba(110,40,20,0.45)"/>
          <path d="M0 -8 Q1 -16 5 -18" stroke="#6E3A20" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <ellipse cx="9" cy="-16" rx="6" ry="3.4" fill="#2C9A57" transform="rotate(-18 9 -16)"/>
          <ellipse cx="-6" cy="-1" rx="2.6" ry="6" fill="rgba(255,255,255,0.5)" transform="rotate(-16 -6 -1)"/>
          <circle cx="-3" cy="-7" r="1.7" fill="rgba(255,255,255,0.65)"/>
        </g>
        <g transform="translate(205 97)">
          <path d="M0 -7 C -5 -13 -11 -13 -13.5 -8 C -16.5 -2 -15.5 9 -8 14.5 C -4 17 -1.5 16.5 0 14.5 C 1.5 16.5 4 17 8 14.5 C 15.5 9 16.5 -2 13.5 -8 C 11 -13 5 -13 0 -7 Z" fill="url(#g1apA)"/>
          <circle cx="0" cy="14.2" r="1.5" fill="rgba(110,40,20,0.45)"/>
          <path d="M0 -8 Q1 -16 5 -18" stroke="#6E3A20" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <ellipse cx="9" cy="-16" rx="6" ry="3.4" fill="#2C9A57" transform="rotate(-18 9 -16)"/>
          <ellipse cx="-6.5" cy="-1" rx="2.8" ry="6.2" fill="rgba(255,255,255,0.55)" transform="rotate(-16 -6.5 -1)"/>
          <circle cx="-3.5" cy="-7" r="1.8" fill="rgba(255,255,255,0.7)"/>
        </g>
      </g>
      {/* bug' (jo'mrak uchidan) — 3 ingichka tabiiy girdob, ko'tarilib tarqaydi */}
      <g className="g1-steam"><path d="M181 64 q-6 -8 0 -15 q6 -8 0 -16 q-5 -6 -1 -12" stroke="#CBD9DF" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85"/></g>
      <g className="g1-steam g1-steam2"><path d="M188 62 q6 -8 0 -15 q-6 -8 0 -16 q5 -6 1 -12" stroke="#D8E2E7" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8"/></g>
      <g className="g1-steam g1-steam3"><path d="M184 60 q-5 -7 0 -14 q5 -7 0 -15" stroke="#E2EAEE" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/></g>
      {/* tayyor dasturxon uchqunlari */}
      <g fill="#FFD86B">
        <path className="g1-table-spark" style={{ animationDelay: '0s' }} d="M0,-5 L1.4,-1.4 L5,0 L1.4,1.4 L0,5 L-1.4,1.4 L-5,0 L-1.4,-1.4 Z" transform="translate(70 66)"/>
        <path className="g1-table-spark" style={{ animationDelay: '0.55s' }} d="M0,-5 L1.4,-1.4 L5,0 L1.4,1.4 L0,5 L-1.4,1.4 L-5,0 L-1.4,-1.4 Z" transform="translate(143 60) scale(0.85)"/>
        <path className="g1-table-spark" style={{ animationDelay: '1s' }} d="M0,-5 L1.4,-1.4 L5,0 L1.4,1.4 L0,5 L-1.4,1.4 L-5,0 L-1.4,-1.4 Z" transform="translate(228 74) scale(0.8)"/>
      </g>
    </svg>
  </div>
);

// useStoryReveal — auto-zanjir audio segmentlariga bog'langan bosqichma-bosqich ochilish.
// Qaytaradi: boshlangan segmentlar soni (1-asosli). aud_0 -> 1, aud_1 -> 2, ...
// Mute yoki autoplay bloklansa / kechiksa -> hammasi ko'rinadi (personaj qotib qolmasin).
function useStoryReveal(audio, total) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (audio.muted) { setStep(total); return; }
    const cs = audio.currentSegment;
    if (!cs) return;
    const m = /(\d+)/.exec(cs);
    if (m) setStep((s) => Math.max(s, parseInt(m[1], 10) + 1));
  }, [audio.currentSegment, audio.muted, total]);
  useEffect(() => { const id = setTimeout(() => setStep((s) => Math.max(s, total)), 16000); return () => clearTimeout(id); }, [total]);
  return step;
}

// AnvarFig — Anvar SVG'ga ingichka wrapper (variant -> pose). Eski PNG placeholder olib tashlandi.
const AnvarFig = ({ variant = 'coming' }) => <AnvarSVG pose={variant} className="g1-cast-svg"/>;

// ETALON KIT · SAHNALAR · SceneBg — hikoya ekranlari uchun ORQA SAHNA (xona/eshik), personajlar oldida.
// variant: room (sIntro/s11 — deraza, parda, stol, gilam) | door (sGuest — eshik, payoff).
const SceneBg = ({ variant = 'room' }) => (
  <svg className="g1-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <rect x="0" y="0" width="400" height="178" fill="#FBEFE0"/>
    <rect x="0" y="178" width="400" height="52" fill="#EAD8C2"/>
    <line x1="0" y1="178" x2="400" y2="178" stroke="#D8C2A6" strokeWidth="2"/>
    <ellipse cx="200" cy="206" rx="170" ry="14" fill="#F2D7A8" opacity="0.55"/>
    {variant === 'room' && (
      <>
        {/* deraza + parda (kichikroq, real) */}
        <rect x="34" y="40" width="66" height="56" rx="5" fill="#CBEAF5" stroke="#B9986F" strokeWidth="3"/>
        <line x1="67" y1="40" x2="67" y2="96" stroke="#B9986F" strokeWidth="2.5"/>
        <line x1="34" y1="68" x2="100" y2="68" stroke="#B9986F" strokeWidth="2.5"/>
        <circle cx="84" cy="55" r="6" fill="#FFE9A8"/>
        <path d="M28 37 q7 32 0 62 l9 0 q-6 -32 0 -62 Z" fill="#F2B8C6"/>
        <path d="M106 37 q-7 32 0 62 l-9 0 q6 -32 0 -62 Z" fill="#F2B8C6"/>
        {/* devordagi rasm — MUSHUK */}
        <rect x="306" y="42" width="54" height="50" rx="5" fill="#FFFFFF" stroke="#B9986F" strokeWidth="3"/>
        <rect x="312" y="48" width="42" height="38" rx="4" fill="#FBF1E2"/>
        <path d="M324 62 L321 52 L330 59 Z" fill="#E89A4C"/><path d="M342 62 L345 52 L336 59 Z" fill="#E89A4C"/>
        <path d="M324.5 60 L323 55.5 L327 58 Z" fill="#F4C39A"/><path d="M341.5 60 L343 55.5 L339 58 Z" fill="#F4C39A"/>
        <ellipse cx="333" cy="68" rx="13" ry="11" fill="#E89A4C"/>
        <path d="M333 58 v5 M328 59 l1 4 M338 59 l-1 4" stroke="#C97A2E" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <ellipse cx="328" cy="67" rx="2" ry="2.6" fill="#3A7D44"/><ellipse cx="338" cy="67" rx="2" ry="2.6" fill="#3A7D44"/>
        <circle cx="328" cy="66.3" r="0.6" fill="#fff"/><circle cx="338" cy="66.3" r="0.6" fill="#fff"/>
        <path d="M331.6 71 h2.8 l-1.4 1.6 Z" fill="#D86B6B"/>
        <path d="M333 72.6 v1.2" stroke="#9A5A2E" strokeWidth="0.9" strokeLinecap="round"/>
        <g stroke="#C97A2E" strokeWidth="0.7" strokeLinecap="round"><path d="M327 71 l-7 -1 M327 73 l-7 1"/><path d="M339 71 l7 -1 M339 73 l7 1"/></g>
        {/* stol — alohida DasturxonScene bilan qo'yiladi (g1-scene-table) */}
      </>
    )}
    {variant === 'door' && (
      <>
        {/* eshik (markazda) — pastroq/qisqaroq (tepaga cho'zilmaydi) */}
        <rect x="178" y="66" width="52" height="112" rx="5" fill="#C68B5B" stroke="#9A6738" strokeWidth="3"/>
        <rect x="185" y="78" width="38" height="42" rx="3" fill="#B97C4C"/>
        <rect x="185" y="126" width="38" height="42" rx="3" fill="#B97C4C"/>
        <circle cx="223" cy="146" r="3.5" fill="#FFD86B"/>
        <path d="M178 66 h52 v6 h-52 Z" fill="#9A6738"/>
        {/* KIYIM SHKAFI (chapda) */}
        <rect x="36" y="66" width="78" height="112" rx="4" fill="#C99A6A" stroke="#9A6738" strokeWidth="3"/>
        <line x1="75" y1="70" x2="75" y2="174" stroke="#9A6738" strokeWidth="2.5"/>
        <rect x="43" y="74" width="28" height="46" rx="2" fill="#BB8C54"/>
        <rect x="79" y="74" width="28" height="46" rx="2" fill="#BB8C54"/>
        <rect x="43" y="126" width="28" height="46" rx="2" fill="#BB8C54"/>
        <rect x="79" y="126" width="28" height="46" rx="2" fill="#BB8C54"/>
        <circle cx="71" cy="123" r="2.4" fill="#5E3F1E"/><circle cx="79" cy="123" r="2.4" fill="#5E3F1E"/>
        {/* devor ilgichi + kepka osilgan */}
        <rect x="250" y="50" width="58" height="6" rx="3" fill="#9A6738"/>
        <circle cx="262" cy="58" r="2" fill="#9A6738"/><circle cx="296" cy="58" r="2" fill="#9A6738"/>
        <path d="M256 60 Q254 70 262 72 Q270 70 268 60 Q262 64 256 60 Z" fill="#2C7BD6"/>
        {/* devordagi rasm — MUSHUK */}
        <rect x="318" y="64" width="46" height="36" rx="3" fill="#FFFFFF" stroke="#B9986F" strokeWidth="3"/>
        <rect x="322" y="68" width="38" height="28" rx="2" fill="#FBF1E2"/>
        <path d="M334 80 L331 71 L339 77 Z" fill="#E89A4C"/><path d="M348 80 L351 71 L343 77 Z" fill="#E89A4C"/>
        <path d="M334.5 78 L333 73.5 L337 76 Z" fill="#F4C39A"/><path d="M347.5 78 L349 73.5 L345 76 Z" fill="#F4C39A"/>
        <ellipse cx="341" cy="84" rx="11" ry="9" fill="#E89A4C"/>
        <path d="M341 76 v4 M337 77 l1 3 M345 77 l-1 3" stroke="#C97A2E" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <ellipse cx="337" cy="83" rx="1.7" ry="2.2" fill="#3A7D44"/><ellipse cx="345" cy="83" rx="1.7" ry="2.2" fill="#3A7D44"/>
        <path d="M339.8 86.5 h2.4 l-1.2 1.4 Z" fill="#D86B6B"/>
        <g stroke="#C97A2E" strokeWidth="0.6" strokeLinecap="round"><path d="M336 86 l-6 -1 M336 88 l-6 1"/><path d="M346 86 l6 -1 M346 88 l6 1"/></g>
        {/* gul tuvak (o'ngda, polда) */}
        <path d="M338 178 l3 -22 h26 l3 22 Z" fill="#D98C4A"/><rect x="338" y="154" width="32" height="4" fill="#B86F2E"/>
        <path d="M354 154 Q344 134 352 118 Q357 134 354 154 Z" fill="#3FA45C"/>
        <path d="M354 154 Q366 138 362 122 Q356 138 354 154 Z" fill="#4FB56A"/>
        <path d="M354 154 Q348 140 350 126 Q356 140 354 154 Z" fill="#349152"/>
        {/* gilamcha eshik oldida */}
        <ellipse cx="204" cy="196" rx="70" ry="10" fill="#E9B7C2" opacity="0.6"/>
        <ellipse cx="204" cy="196" rx="48" ry="6" fill="#F2CBD6" opacity="0.7"/>
      </>
    )}
  </svg>
);

// ============================================================
// RAQAM VIZUALIZATORLARI (Dars02 — raqamli uylar / eshiklar, 1-5)
// Uslub: Dars01 etaloni kabi sayqalli flat-vector (gradient soya, yorug'lik, soyalar).
// ============================================================

// HouseDefs — barcha uy/buyum/ko'cha gradientlari (hujjatga bir marta qo'yiladi, root'da).
const HouseDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <linearGradient id="d2wall0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FCEAD0"/><stop offset="100%" stopColor="#E7C794"/></linearGradient>
      <linearGradient id="d2wall1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FBE0CC"/><stop offset="100%" stopColor="#E8BE94"/></linearGradient>
      <linearGradient id="d2wall2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#DCEFD9"/><stop offset="100%" stopColor="#B6D9AE"/></linearGradient>
      <linearGradient id="d2wall3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#DCE7F2"/><stop offset="100%" stopColor="#B6C8DC"/></linearGradient>
      <linearGradient id="d2wall4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F7DEE6"/><stop offset="100%" stopColor="#E6BCCB"/></linearGradient>
      <linearGradient id="d2roof0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4724E"/><stop offset="100%" stopColor="#A8381F"/></linearGradient>
      <linearGradient id="d2roof1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CE9460"/><stop offset="100%" stopColor="#8A5A2E"/></linearGradient>
      <linearGradient id="d2roof2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#54AEB8"/><stop offset="100%" stopColor="#2E737B"/></linearGradient>
      <linearGradient id="d2roof3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#828FA8"/><stop offset="100%" stopColor="#535F77"/></linearGradient>
      <linearGradient id="d2roof4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E0574A"/><stop offset="100%" stopColor="#A8281F"/></linearGradient>
      <linearGradient id="d2door" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C2864F"/><stop offset="100%" stopColor="#8A5A28"/></linearGradient>
      <linearGradient id="d2win" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#DCF1F9"/><stop offset="100%" stopColor="#A6D6EC"/></linearGradient>
      <radialGradient id="d2ball" cx="38%" cy="30%" r="72%"><stop offset="0%" stopColor="#FF8A6B"/><stop offset="55%" stopColor="#F0492E"/><stop offset="100%" stopColor="#C42316"/></radialGradient>
      <linearGradient id="d2cubeT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7FB3F2"/><stop offset="100%" stopColor="#5E9CEC"/></linearGradient>
      <linearGradient id="d2cubeL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C90E6"/><stop offset="100%" stopColor="#3877C9"/></linearGradient>
      <linearGradient id="d2cubeR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#346FBE"/><stop offset="100%" stopColor="#24508F"/></linearGradient>
      <linearGradient id="d2pot" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E0945A"/><stop offset="100%" stopColor="#B06A2E"/></linearGradient>
      <linearGradient id="d2leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5FC47C"/><stop offset="100%" stopColor="#2E8B4E"/></linearGradient>
      <linearGradient id="d2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BDE7F6"/><stop offset="100%" stopColor="#EAF7FC"/></linearGradient>
      <linearGradient id="d2grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE08F"/><stop offset="100%" stopColor="#97C96A"/></linearGradient>
      <linearGradient id="d2walk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D6CEBF"/><stop offset="100%" stopColor="#BEB4A1"/></linearGradient>
    </defs>
  </svg>
);

// DigitGlyph — yirik raqam belgisi (display shrift). Eshik plitasi/raqam tokeni uchun.
const DigitGlyph = ({ d, tone = 'ink', size = 'mid' }) => (
  <span className={`g1-digit g1-digit-${size} g1-digit-${tone}`} aria-hidden="true">{d}</span>
);

// Buyum ikonlari (meva emas): koptok / kubik / gultuvak — gradientli, soyali, real. viewBox 0 0 40 40.
const ITEM2 = {
  ball: (
    <g>
      <ellipse cx="20" cy="35.5" rx="11" ry="2.8" fill="rgba(58,53,48,0.18)"/>
      <circle cx="20" cy="21" r="14" fill="url(#d2ball)"/>
      <path d="M6.4 17.5 Q20 11.5 33.6 17.5" stroke="#FFFFFF" strokeWidth="2.3" fill="none" opacity="0.85"/>
      <path d="M7 26 Q20 32 33 26" stroke="#FFFFFF" strokeWidth="2.1" fill="none" opacity="0.7"/>
      <path d="M20 7.1 Q13.5 21 20 34.9" stroke="rgba(150,20,8,0.4)" strokeWidth="1.4" fill="none"/>
      <ellipse cx="14.5" cy="14.5" rx="4.3" ry="2.9" fill="rgba(255,255,255,0.6)"/>
    </g>
  ),
  cube: (
    <g>
      <ellipse cx="20" cy="35.5" rx="10.5" ry="2.6" fill="rgba(58,53,48,0.18)"/>
      <path d="M20 6 L33 13 L20 20 L7 13 Z" fill="url(#d2cubeT)"/>
      <path d="M7 13 L20 20 L20 34 L7 27 Z" fill="url(#d2cubeL)"/>
      <path d="M33 13 L20 20 L20 34 L33 27 Z" fill="url(#d2cubeR)"/>
      <path d="M11 14.6 L18.5 18.7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M20 6 L33 13 L20 20 L7 13 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
    </g>
  ),
  pot: (
    <g>
      <ellipse cx="20" cy="36" rx="10" ry="2.6" fill="rgba(58,53,48,0.18)"/>
      <path d="M20 23 Q13.5 13 20 5 Q26.5 13 20 23 Z" fill="url(#d2leaf)"/>
      <path d="M20 22 Q11.5 18.5 9.5 10 Q17.5 13 20 22 Z" fill="#5BC078"/>
      <path d="M20 22 Q28.5 18.5 30.5 10 Q22.5 13 20 22 Z" fill="#3E9B57"/>
      <circle cx="20" cy="6.5" r="2.5" fill="#FFC23C" stroke="#E8A92A" strokeWidth="0.6"/>
      <path d="M12 24 h16 l-1.7 10 a2 2 0 0 1 -2 1.6 h-8.6 a2 2 0 0 1 -2 -1.6 Z" fill="url(#d2pot)"/>
      <rect x="10.4" y="21.4" width="19.2" height="4.8" rx="2.4" fill="#C2783A"/>
      <ellipse cx="15" cy="28.5" rx="2.4" ry="4" fill="rgba(255,255,255,0.2)"/>
    </g>
  ),
};
const ItemSvg = ({ kind = 'ball' }) => (
  <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">{ITEM2[kind] || ITEM2.ball}</svg>
);
// ItemRow — sanaladigan buyumlar qatori (kit'ning g1-pips/g1-obj animatsiyasini qayta ishlatadi).
const ItemRow = ({ n, kind = 'ball', anim = 'bob', wrap = false }) => (
  <div className={`g1-pips ${wrap ? 'g1-pips-wrap' : ''}`}>
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className={`g1-obj ${anim ? 'g1-' + anim : ''}`} style={{ animationDelay: `${(i % 5) * 0.16}s` }}><ItemSvg kind={kind}/></span>
    ))}
  </div>
);

// DoorCard — eshik (raqam plitasi bilan). Raqamga e'tibor qaratiladigan ekranlar uchun.
const DoorCard = ({ d, tone = 'ink', size = 'sm' }) => (
  <span className="g1-door" aria-hidden="true">
    <span className="g1-door-panel"/>
    <span className="g1-door-plate"><DigitGlyph d={d} size={size} tone={tone}/></span>
    <span className="g1-door-knob"/>
  </span>
);

// HouseSVG — IKKI QAVATLI uy, BALAND eshik (odam eshikdan o'tadi — real proporsiya). viewBox 0 0 120 184.
// v = rang varianti (0..4). digit=null -> bo'sh plita. open -> eshik ochiq (final 5-uy).
const HouseSVG = ({ digit = null, open = false, v = null, cat = false, className = '' }) => {
  // Rang RAQAMga bog'langan (v berilmasa): har raqamli uy butun darsda bir xil rangda.
  const base = (v == null) ? (digit == null ? 0 : digit - 1) : v;
  const wv = ((base % 5) + 5) % 5;
  return (
  <svg className={`g1-house-svg ${className}`} viewBox="0 0 120 184" aria-hidden="true">
    <ellipse cx="60" cy="179" rx="46" ry="5" fill="rgba(58,53,48,0.14)"/>
    {/* mo'ri */}
    <rect x="80" y="16" width="11" height="24" rx="1.5" fill="#7A4A30"/>
    <rect x="78" y="14" width="15" height="6" rx="2" fill="#5E3522"/>
    {/* tom */}
    <path d="M8 62 L60 18 L112 62 Z" fill={`url(#d2roof${wv})`} stroke="#7A3018" strokeWidth="2" strokeLinejoin="round"/>
    <g stroke="rgba(60,20,10,0.35)" strokeWidth="1" opacity="0.5" fill="none"><path d="M20 56 L100 56"/><path d="M30 48 L90 48"/><path d="M42 40 L78 40"/></g>
    <path d="M60 18 L112 62 L104 62 L60 25 Z" fill="rgba(0,0,0,0.13)"/>
    <path d="M8 62 L60 18 L63 20 L14 62 Z" fill="rgba(255,255,255,0.15)"/>
    {/* devor — 2 qavat */}
    <rect x="22" y="60" width="76" height="116" rx="3" fill={`url(#d2wall${wv})`} stroke="#C9A877" strokeWidth="2"/>
    <g stroke="rgba(120,90,40,0.18)" strokeWidth="0.8" fill="none"><path d="M22 82 h76 M22 100 h76 M22 138 h76 M22 158 h76"/></g>
    <rect x="22" y="116" width="76" height="2.5" fill="rgba(120,90,40,0.28)"/>
    {/* yuqori qavat — 2 deraza */}
    <g>
      <rect x="33" y="72" width="20" height="22" rx="2" fill="url(#d2win)" stroke="#8A5A28" strokeWidth="2.2"/>
      <line x1="43" y1="72" x2="43" y2="94" stroke="#8A5A28" strokeWidth="1.3"/><line x1="33" y1="83" x2="53" y2="83" stroke="#8A5A28" strokeWidth="1.3"/>
      <path d="M36 75 l5 0 -7 7 0 -5 Z" fill="rgba(255,255,255,0.5)"/>
      <rect x="67" y="72" width="20" height="22" rx="2" fill="url(#d2win)" stroke="#8A5A28" strokeWidth="2.2"/>
      <line x1="77" y1="72" x2="77" y2="94" stroke="#8A5A28" strokeWidth="1.3"/><line x1="67" y1="83" x2="87" y2="83" stroke="#8A5A28" strokeWidth="1.3"/>
      <path d="M70 75 l5 0 -7 7 0 -5 Z" fill="rgba(255,255,255,0.5)"/>
    </g>
    {/* pastki qavat — BALAND eshik (markaz) + ikki yon deraza */}
    <rect x="26" y="128" width="15" height="22" rx="2" fill="url(#d2win)" stroke="#8A5A28" strokeWidth="2"/>
    <line x1="26" y1="139" x2="41" y2="139" stroke="#8A5A28" strokeWidth="1.2"/>
    <rect x="79" y="128" width="15" height="22" rx="2" fill="url(#d2win)" stroke="#8A5A28" strokeWidth="2"/>
    <line x1="79" y1="139" x2="94" y2="139" stroke="#8A5A28" strokeWidth="1.2"/>
    {open ? (
      <g>
        <rect x="45" y="118" width="30" height="58" rx="2" fill="#3E2715"/>
        <path d="M45 118 L31 112 L31 170 L45 176 Z" fill="url(#d2door)" stroke="#7A4E22" strokeWidth="1.5"/>
        <circle cx="36" cy="146" r="2" fill="#FFD86B"/>
      </g>
    ) : (
      <g>
        <rect x="45" y="118" width="30" height="58" rx="3" fill="url(#d2door)" stroke="#7A4E22" strokeWidth="2"/>
        <rect x="49" y="124" width="22" height="22" rx="2" fill="rgba(0,0,0,0.12)"/>
        <rect x="49" y="150" width="22" height="20" rx="2" fill="rgba(0,0,0,0.12)"/>
        <circle cx="69" cy="150" r="2.8" fill="#FFD86B" stroke="#B8862E" strokeWidth="0.8"/>
      </g>
    )}
    <rect x="41" y="174" width="38" height="4" rx="1.5" fill="#9A6738"/>
    {/* raqam plitasi (eshik tepasida) */}
    <rect x="47" y="100" width="26" height="15" rx="3" fill="#FCFAF5" stroke="#C9A877" strokeWidth="1.6"/>
    <circle cx="50.5" cy="103" r="1" fill="#C9A877"/><circle cx="69.5" cy="103" r="1" fill="#C9A877"/>
    {digit != null && <text x="60" y="112" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="14" fill="#FF4F28">{digit}</text>}
    {/* buta */}
    <g><ellipse cx="29" cy="170" rx="8.5" ry="6.5" fill="#5BA85C"/><ellipse cx="35" cy="172" rx="6.5" ry="5" fill="#4F9A50"/><ellipse cx="26" cy="167" rx="3" ry="2" fill="rgba(255,255,255,0.18)"/></g>
    {/* mushukcha — uy uchidan (tom cho'qqisidan) chiqadi */}
    {cat && (
      <g className="g1-house-cat">
        <ellipse cx="54" cy="20" rx="3" ry="2" fill="#7A5230"/>
        <ellipse cx="66" cy="20" rx="3" ry="2" fill="#7A5230"/>
        <path d="M52 6 L51 0 L57 4 Z" fill="#7A5230"/>
        <path d="M68 6 L69 0 L63 4 Z" fill="#7A5230"/>
        <circle cx="60" cy="12" r="8.5" fill="#8A5E3B"/>
        <path d="M53 7 L52.2 2 L56.5 5 Z" fill="#C98A5A"/>
        <path d="M67 7 L67.8 2 L63.5 5 Z" fill="#C98A5A"/>
        <ellipse cx="56.6" cy="12" rx="1.5" ry="2" fill="#2A2A2A"/>
        <ellipse cx="63.4" cy="12" rx="1.5" ry="2" fill="#2A2A2A"/>
        <path d="M59 15 h2 l-1 1.3 Z" fill="#D87A8A"/>
        <g stroke="#5A4030" strokeWidth="0.6" strokeLinecap="round"><path d="M53.5 13 l-6 -0.8 M53.5 14.5 l-6 0.8 M66.5 13 l6 -0.8 M66.5 14.5 l6 0.8"/></g>
      </g>
    )}
  </svg>
  );
};

// HouseFig — uy + oldida buyumlar (miqdor). Miqdor-kontekstli ekranlar uchun.
const HouseFig = ({ digit = null, n = 0, kind = 'ball', cat = false, v = null, className = '' }) => (
  <div className={`g1-housefig ${className}`}>
    <HouseSVG digit={digit} cat={cat} v={v}/>
    {n > 0 && <div className="g1-yard"><ItemRow n={n} kind={kind} anim="bob"/></div>}
  </div>
);

// BitSays — qoida/izoh kartochkasi: CHAPDA animatsion Bit, o'ngda matn (Bit "gapiradi").
// Etalon Bit-kartochka uslubi (g1-bitcard), neytral frame-tip ichida.
const BitSays = ({ text }) => (
  <div className="frame-tip fade-up delay-1">
    <div className="g1-bitcard">
      <div className="g1-bitcard-fig"><BitSVG state="present"/></div>
      <div className="g1-bitcard-body"><span className="g1-bitcard-txt">{text}</span></div>
    </div>
  </div>
);

// StreetBg — ko'cha foni (osmon, quyosh, bulutlar, daraxtlar, maysa, trotuar, fonar).
const StreetBg = () => (
  <svg className="g1-street-bg" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="400" height="220" fill="url(#d2sky)"/>
    {/* quyosh + nurlar */}
    <g><circle cx="352" cy="40" r="20" fill="#FFE08A"/><g stroke="#FFD86B" strokeWidth="3" strokeLinecap="round"><path d="M352 8 v-7 M352 79 v7 M320 40 h-7 M384 40 h7 M329 17 l-5 -5 M375 63 l5 5 M375 17 l5 -5 M329 63 l-5 5"/></g></g>
    {/* bulutlar */}
    <g fill="#FFFFFF" opacity="0.95"><ellipse cx="80" cy="40" rx="26" ry="13"/><ellipse cx="104" cy="44" rx="20" ry="11"/><ellipse cx="60" cy="46" rx="18" ry="10"/></g>
    <g fill="#FFFFFF" opacity="0.85"><ellipse cx="220" cy="28" rx="20" ry="10"/><ellipse cx="240" cy="32" rx="15" ry="8"/></g>
    {/* uzoq daraxtlar (devor ortida) */}
    <g><ellipse cx="150" cy="150" rx="26" ry="22" fill="#7FB86A"/><rect x="146" y="150" width="8" height="20" fill="#8A5A33"/></g>
    <g><ellipse cx="300" cy="150" rx="22" ry="19" fill="#6FAE5C"/><rect x="296" y="150" width="7" height="20" fill="#8A5A33"/></g>
    {/* maysa */}
    <rect x="0" y="150" width="400" height="34" fill="url(#d2grass)"/>
    {/* trotuar */}
    <rect x="0" y="182" width="400" height="38" fill="url(#d2walk)"/>
    <line x1="0" y1="182" x2="400" y2="182" stroke="#A99E89" strokeWidth="2"/>
    <g stroke="#B3A893" strokeWidth="2" opacity="0.7"><path d="M60 184 v34 M150 184 v34 M240 184 v34 M330 184 v34"/></g>
    {/* fonar */}
    <g><rect x="22" y="120" width="4" height="64" fill="#5A6470"/><rect x="14" y="116" width="20" height="8" rx="3" fill="#FFD86B" stroke="#5A6470" strokeWidth="1.5"/></g>
  </svg>
);

// StreetScene — ko'cha: fon + 5 uy (trotuarda) + Anvar (+ final'da Ra'no 5-uy oldida).
// Barcha ko'cha sahnalarida uylar BIR XIL joylashuvda (raqam aralash — audio "aralashib ketdi"ga mos).
// 5-uy o'rtada (indeks 2); final/yakunda o'sha uy porlaydi + Ra'no o'sha yerda.
const STREET_NUMS = [3, 1, 5, 2, 4];
const StreetScene = ({ step = 9, final = false }) => {
  const t = useT();
  const nums = STREET_NUMS;
  return (
    <div className={`g1-street ${final ? 'g1-street-final' : ''}`}>
      <StreetBg/>
      <div className="g1-street-houses">
        {nums.map((n, i) => (
          <div key={n} className={`g1-street-house ${final && n === 5 ? 'g1-street-target' : ''} ${step >= 2 ? 'in' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <HouseSVG digit={n} open={final && n === 5}/>
          </div>
        ))}
      </div>
      <div className={`g1-street-anvar ${step >= 3 ? 'in' : ''}`}>
        <AnvarSVG pose={final ? 'happy' : 'coming'} className="g1-cast-svg"/>
        <span className="g1-cast-name g1-cast-sub">{t(CONTENT.sIntro.anvar_label)}</span>
      </div>
      {final && (
        <div className="g1-street-rano in">
          <RanoSVG mood="happy" className="g1-cast-svg"/>
          <span className="g1-cast-name">{t(CONTENT.sIntro.rano_label)}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// EKRANLAR — Dars02 (raqamli uylar)
// ============================================================

const OnboardHint = () => {
  const lang = useLang();
  return (
    <div className="g1-onboard fade-up delay-2">
      <svg className="g1-onboard-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#019ACB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/>
      </svg>
      <span className="g1-onboard-txt">{lang === 'uz' ? 'Ovozni oxirigacha tinglang' : 'Дослушай до конца'}</span>
      <span className="g1-onboard-arrow" aria-hidden="true">→</span>
      <span className="g1-onboard-pill">{lang === 'uz' ? 'Davom' : 'Дальше'}</span>
    </div>
  );
};

// StoryLayout — umumiy hikoya-slayd qolipi (Bit boshlovchi overlay + sahna + matn).
const StoryLayout = ({ props, c, children, hint = false }) => {
  const lang = useLang();
  const t = useT();
  const audio = useAudio(makeAutoSegments(c, lang));
  useHero('present');
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 16px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center' }}>{t(c.title)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(10px, 2vw, 16px)', overflow: 'hidden' }}>
          {typeof children === 'function' ? children(audio) : children}
        </div>
        {hint && <OnboardHint/>}
      </div>
    </Stage>
  );
};

const IntroCast = ({ audio }) => {
  const step = useStoryReveal(audio, 4);
  return <StreetScene step={step}/>;
};
const GuestCast = ({ audio }) => {
  const step = useStoryReveal(audio, 2);
  return <StreetScene step={Math.max(step, 3)}/>;
};
const ScreenIntro = (props) => (
  <StoryLayout props={props} c={CONTENT.sIntro} hint>{(audio) => <IntroCast audio={audio}/>}</StoryLayout>
);
const ScreenGuest = (props) => (
  <StoryLayout props={props} c={CONTENT.sGuest}>{(audio) => <GuestCast audio={audio}/>}</StoryLayout>
);

// s0 — HOOK: aralash uy raqamlari suzadi, KEYIN yumshoq savol (to'g'ri javob yo'q).
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const sfx = useSfx();
  const [picked, setPicked] = useState(null);
  const [praiseWord, setPraiseWord] = useState('');
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    sfx.playCorrect();
    const pw = nextPraise(lang); setPraiseWord(pw);
    if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.audio.on_correct[lang]); } }
  };
  const opts = [c.opt0, c.opt1, c.opt2];
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={picked === null} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <h1 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span>{t(c.title_part3)}
        </h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <DigitScatter/>
        </div>
        <p className="g1-q fade-up delay-1">{t(c.question)}</p>
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className={`g1-tile ${picked === i ? 'g1-tile-ok' : ''}`} disabled={picked !== null} onClick={() => pick(i)} style={{ width: '100%', fontSize: 'clamp(14px, 1.9vw, 17px)' }}>
              {t(o)}
            </button>
          ))}
        </div>
        {picked !== null && (
          <FeedbackBlock show={true} isCorrect={true} wrongClass="frame-tip">
            <Reaction state="correct" praise={praiseWord}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// DigitScatter — s0: 1-5 raqamlari sochilgan (aralash uy raqamlari), yengil suzadi.
const SCATTER = [
  { d: 3, x: 8, y: 14, r: -12, dl: '0s' },
  { d: 5, x: 64, y: 6, r: 9, dl: '0.4s' },
  { d: 1, x: 38, y: 40, r: -4, dl: '0.8s' },
  { d: 4, x: 76, y: 52, r: 14, dl: '1.1s' },
  { d: 2, x: 14, y: 60, r: 8, dl: '0.6s' },
];
function DigitScatter() {
  return (
    <div className="g1-scatter" aria-hidden="true">
      {SCATTER.map((s) => (
        <span key={s.d} className="g1-scatter-d g1-digit g1-digit-mid g1-digit-accent"
          style={{ left: `${s.x}%`, top: `${s.y}%`, '--r': `${s.r}deg`, animationDelay: s.dl }}>
          {s.d}
        </span>
      ))}
    </div>
  );
}

// DIGIT_FEATURE — s5: raqam farqlovchi belgisi.
const DIGIT_FEATURE = {
  ru: { 1: 'прямая палочка', 2: 'смотрит вправо', 3: 'два мостика', 4: 'есть уголок', 5: 'шапочка сверху' },
  uz: { 1: 'tik tayoqcha', 2: "o'ngga qaraydi", 3: "ikki ko'prikcha", 4: 'burchagi bor', 5: 'tepada shapka' },
};

// DigitDraw — raqamni YOZISH animatsiyasi: qalam raqamni chizib beradi (shakl -> raqam).
// Har raqam o'z chiziq yo'li bilan (feature'iga mos) chiziladi. key={d} -> har bosishda qaytadan chizadi.
// QO'LYOZMA (maktab propisi) shakllari — bosma/shrift shaklidan farq qiladi. Tor, baland, o'ngga suyangan.
//  1 — kichik tayoq markaz tepasidan o'ng-yuqori burchakka, keyin asosiy QIYA tayoq pastki o'rtaga.
//  2 — yuqori yarim-oval, qiya pastga chap-pastga, pastda TO'LQINLI chiziq o'ngga (tekis tag emas).
//  3 — ikki yarim-oval (pastkisi kattaroq), uzmasdan.
// QO'LYOZMA (maktab propisi) usuli, pathLength=100 bilan ketma-ket silliq chiziladi:
//  1 — markazdan o'ng-yuqori burchakka, so'ng tik tayoq pastga (bitta chiziq).
//  2 — yuqorida dumaloq bosh -> o'rtada to'lqin -> pastda dumcha (bitta chiziq).
//  3 — ikki ilmoq (yuqorigi pastkidan ~2 barobar kichik), uzilishsiz.
//  4 — chap tik pastga -> o'ng ko'ndalang -> tepaga -> ikki barobar uzun tik pastga (uzluksiz, ochiq).
//  5 — maktab usuli: AVVAL tana (tik tayoq pastga + o'ng yarim doira/qorin), SO'NG yuqori chiziq OXIRIDA chapdan-o'ngga.
const DIGIT_PATHS = {
  1: 'M29 44 L42 16 L40 80',
  2: 'M20 29 Q20 16 33 16 Q45 16 45 29 Q45 40 24 60 L20 73 Q28 68 35 73 Q42 78 48 71',
  3: 'M19 27 Q21 16 33 16 Q45 16 44 28 Q43 38 31 40 Q45 41 46 56 Q47 71 33 75 Q20 78 17 65',
  4: 'M24 16 L24 48 L43 48 L43 16 L41 81',
  5: 'M26 17 L26 47 Q50 45 47 63 Q46 80 24 76 M26 17 L46 17',
};
// DigitWrite — raqamni YOZISH demosi: raqam chiziq tartibida o'zi chiziladi (qalam yo'q —
// o'quvchi chiziqni ko'rib, undan ko'chirib o'rganadi). Yumshoq (ease), takrorlanadi.
// reduced-motion -> to'liq raqam, animatsiyasiz.
const DigitWrite = ({ d }) => {
  const reduced = usePrefersReducedMotion();
  const path = DIGIT_PATHS[d];
  // Ko'p elementli raqam (masalan 5: tana + shapochka) bo'lsa, bosqichlar ORASIGA PAUZA:
  // tana chiziladi -> to'xtaydi -> keyin shapochka (bir vaqtda emas). Bitta element bo'lsa -> silliq.
  const lift = (path.match(/M/g) || []).length > 1;
  const values     = lift ? '100;20;20;0;0'                              : '100;0;0';
  const keyTimes   = lift ? '0;0.40;0.54;0.72;1'                         : '0;0.64;1';
  const keySplines = lift ? '0.42 0 0.58 1;0 0 1 1;0.42 0 0.58 1;0 0 1 1' : '0.42 0 0.58 1;0 0 1 1';
  return (
    <svg className="g1-write" viewBox="0 0 64 92" aria-hidden="true">
      <path className="g1-write-ghost" d={path}/>
      <path className="g1-write-ink" d={path} pathLength="100" style={reduced ? { strokeDashoffset: 0 } : undefined}>
        {!reduced && <animate attributeName="stroke-dashoffset" values={values} keyTimes={keyTimes} calcMode="spline" keySplines={keySplines} dur="3.8s" repeatCount="indefinite"/>}
      </path>
    </svg>
  );
};

// s1 — EXPLORATION: har uy raqamini bosib tanish (nom ovozda + buyumlar).
const S1_KIND = { 1: 'ball', 2: 'cube', 3: 'pot', 4: 'ball', 5: 'cube' };
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio(makeAutoSegments(c, lang));
  const [seen, setSeen] = useState({});
  const [active, setActive] = useState(null);
  const count = Object.keys(seen).length;
  const full = count === 5;
  const tap = (d) => {
    setActive(d);
    if (!seen[d]) setSeen((p) => ({ ...p, [d]: true }));
    if (!audio.muted) {
      const e = getAudioEngine();
      if (e) { e.pushOneOff(NUM_WORDS[lang][d]); if (count + (seen[d] ? 0 : 1) === 5) e.pushOneOff(c.done_audio[lang]); }
    }
  };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!full} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)} <span className="mono small" style={{ color: T.ink3 }}>{count} / 5</span></p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.2vw, 16px)' }}>
          <div className="g1-drow">
            {[1, 2, 3, 4, 5].map((d) => (
              <button key={d} className={`g1-doorbtn ${seen[d] ? 'seen' : ''} ${active === d ? 'active' : ''}`} onClick={() => tap(d)}>
                <DoorCard d={d} tone={active === d ? 'accent' : 'ink'}/>
              </button>
            ))}
          </div>
          <div className="g1-dpips">
            {active ? <ItemRow n={active} kind={S1_KIND[active]}/> : <span className="g1-hint-txt">{lang === 'uz' ? 'Raqamni bosing' : 'Нажми цифру'}</span>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION: o'zi joylaydi — eshikda raqam (4), shuncha buyum qo'yiladi.
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const TARGET = 4;
  const [orders, setOrders] = useState({});
  const count = Object.keys(orders).length;
  const done = count === TARGET;
  const tap = (i) => {
    if (orders[i] || count >= TARGET) return;
    const order = count + 1;
    setOrders((prev) => ({ ...prev, [i]: order }));
    if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(NUM_WORDS[lang][order]); if (order === TARGET) e.pushOneOff(c.done_audio[lang]); } }
  };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!done} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 3vw, 30px)', padding: 'clamp(14px, 2.6vw, 20px)', flexWrap: 'wrap' }}>
          <div className="g1-s2house"><HouseSVG digit={TARGET}/></div>
          <div className="g1-tapgrid">
            {Array.from({ length: TARGET }).map((_, i) => {
              const on = !!orders[i];
              return (
                <button key={i} className={`g1-tapcell ${on ? 'on' : ''}`} disabled={done || on} onClick={() => tap(i)}>
                  <ItemSvg kind="ball"/>
                  {on && <span className="g1-tapcell-tag mono">{orders[i]}</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="g1-count-line fade-up delay-1">
          <span className="g1-count-label">{t(c.count_label)}</span>
          <span className="g1-count-val mono">{count} / {TARGET}</span>
        </div>
        {done && (
          <div className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — RULE: buyum -> o'q -> eshik raqami.
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s3;
  const audio = useAudio([{ id: 's3', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <h1 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span>
        </h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.6vw, 22px)', padding: 'clamp(18px, 3.4vw, 28px)', flexWrap: 'wrap' }}>
          <ItemRow n={3} kind="pot"/>
          <span className="g1-arrow" aria-hidden="true">→</span>
          <DoorCard d={3} size="mid" tone="accent"/>
        </div>
        <BitSays text={t(c.tip)}/>
      </div>
    </Stage>
  );
};

// s4 — TEST MC: uy oldida nechta? raqamni tanla. figura = uy + 3 buyum; variantlar raqamlar (to'g'ri idx1).
const Screen4 = (props) => {
  const c = CONTENT.s4;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      figure={(solved) => <HouseFig digit={solved ? 3 : null} n={3} kind="ball" cat={solved} v={2}/>}
      options={[<DigitGlyph d={2} size="sm"/>, <DigitGlyph d={3} size="sm"/>, <DigitGlyph d={4} size="sm"/>, <DigitGlyph d={5} size="sm"/>]}
      correctIdx={1}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s5 — EXPLORATION: raqam YOZISH — katakli daftar (kletka) fonida raqam maktab qoidasi bo'yicha yoziladi.
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const audio = useAudio(makeAutoSegments(c, lang));
  const [active, setActive] = useState(1);   // kirishda 1 raqami yoziladi
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)' }}>
          <div className="g1-krow">
            {[1, 2, 3, 4, 5].map((d) => (
              <button key={d} className={`g1-kcell ${active === d ? 'active' : ''}`} onClick={() => setActive(d)} aria-label={String(d)}>
                {active === d
                  ? <DigitWrite key={d} d={d}/>
                  : <span className="g1-kcell-num"><DigitGlyph d={d} size="sm" tone="ink"/></span>}
              </button>
            ))}
          </div>
          <p className="g1-feature-txt">{DIGIT_FEATURE[lang][active]}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — RULE: ko'rinishidan tanaymiz (1-5 eshik plitalari qatori).
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const audio = useAudio([{ id: 's6', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <h1 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span>
        </h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(8px, 2vw, 16px)', padding: 'clamp(16px, 3vw, 24px)' }}>
          {[1, 2, 3, 4, 5].map((d) => <DoorCard key={d} d={d} size="sm"/>)}
        </div>
        <BitSays text={t(c.tip)}/>
      </div>
    </Stage>
  );
};

// s7 — TEST MC: qaysi eshik besh? (faqat shakl). variantlar eshiklar [2,5,3,4] to'g'ri idx1.
const Screen7 = (props) => {
  const c = CONTENT.s7;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[<DoorCard d={2}/>, <DoorCard d={5}/>, <DoorCard d={3}/>, <DoorCard d={4}/>]}
      correctIdx={1}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s8 — TEST (raqami noto'g'ri uyni top): 3 uy = buyumlar + plita raqami; biri mos kelmaydi.
const S8_HOUSES = [{ n: 3, label: 3, kind: 'pot' }, { n: 4, label: 3, kind: 'ball' }, { n: 2, label: 2, kind: 'cube' }];
const S8_WRONG = 1;
const Screen8 = (props) => {
  const c = CONTENT.s8;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={S8_HOUSES.map((b, i) => (
        <div key={i} className="g1-opt-house"><HouseSVG digit={b.label} v={b.n - 1}/><div className="g1-yard"><ItemRow n={b.n} kind={b.kind}/></div></div>
      ))}
      optionsCols={1}
      correctIdx={S8_WRONG}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s9 — TEST MC: raqamga mos uyni top (predmetlarni sanab). s10/s15 ko'rinishi (A/B/C, bitta qatordan).
const S9_TARGET = 4;
const S9_OPTS = [{ n: 2, kind: 'ball' }, { n: 4, kind: 'cube' }, { n: 5, kind: 'pot' }];   // to'g'ri = idx1 (to'rtta)
const S9_CORRECT = 1;
const Screen9 = (props) => {
  const c = CONTENT.s9;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      figure={() => <div className="g1-qfig"><DoorCard d={S9_TARGET} size="mid"/></div>}
      options={S9_OPTS.map((o, i) => (
        <div key={i} className="g1-opt-house"><HouseSVG digit={null} v={o.n - 1}/><div className="g1-yard"><ItemRow n={o.n} kind={o.kind}/></div></div>
      ))}
      optionsCols={1}
      correctIdx={S9_CORRECT}
      celebrateOnCorrect={() => (
        <div className="g1-opt-house g1-opt-house-cel">
          <HouseSVG digit={S9_TARGET} v={S9_TARGET - 1}/>
          <div className="g1-yard"><ItemRow n={S9_OPTS[S9_CORRECT].n} kind={S9_OPTS[S9_CORRECT].kind}/></div>
        </div>
      )}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s10 — TEST (tartiblash, tap): uylarni 1->5 tartibida bosish (Anvar ko'cha bo'ylab).
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const ORDER = [3, 1, 5, 2, 4];
  const wasSolved = props.storedAnswer?.solved === true;
  const [next, setNext] = useState(wasSolved ? 6 : 1);
  const [nudge, setNudge] = useState(null);
  const [praiseWord, setPraiseWord] = useState('');
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? 0);
  const allDone = next > 5;
  const tap = (d) => {
    if (allDone || d < next || !canAns) return;
    attemptsRef.current += 1;
    if (d === next) {
      const nn = next + 1;
      setNext(nn);
      sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][d]); }
      if (nn > 5) {
        const pw = nextPraise(lang); setPraiseWord(pw);
        if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.done_text[lang]); } }
        const ft = firstTryRef.current !== false;
        props.onAnswer({
          stage: SCREEN_META[props.screen].scope, screenIdx: props.screen,
          question: null, options: null, correctIndex: null, correctAnswer: null,
          studentAnswerIndex: null, studentAnswer: null,
          correct: ft, firstTry: ft, attempts: attemptsRef.current, solved: true
        });
      }
    } else {
      firstTryRef.current = false;
      setNudge(d); setTimeout(() => setNudge(null), 450);
      sfx.playWrong();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((c.wrong_default || c.audio.on_wrong)[lang]); }
    }
  };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!allDone} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 24px)' }}>
          <div className="g1-track">
            {[1, 2, 3, 4, 5].map((slot) => (
              <div key={slot} className={`g1-track-tile ${slot < next ? 'g1-track-filled g1-pop-in' : 'gap'}`}>
                <span className="mono">{slot < next ? slot : ''}</span>
              </div>
            ))}
          </div>
          <div className="g1-drow">
            {ORDER.map((d) => {
              const placed = d < next;
              return (
                <button key={d} className={`g1-doorbtn ${placed ? 'placed' : ''} ${nudge === d ? 'g1-nudge' : ''}`} disabled={placed || allDone || !canAns} onClick={() => tap(d)}>
                  <DoorCard d={d} tone={placed ? 'ink' : 'accent'}/>
                </button>
              );
            })}
          </div>
        </div>
        {allDone && (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Reaction state="correct" praise={praiseWord}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// sd — MINI-O'YIN (drag): uy oldiga eshikdagi raqamcha buyum torting. Ball yo'q.
const COLLECT_ROUNDS = [{ digit: 3, kind: 'ball' }, { digit: 5, kind: 'cube' }];
const HouseCollect = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sd;
  const sfx = useSfx();
  const audio = useAudio([{ id: 'sd_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const total = COLLECT_ROUNDS.length;
  const [ri, setRi] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [solvedItem, setSolvedItem] = useState(false);
  const [bounceTok, setBounceTok] = useState(null);
  const [wrongZone, setWrongZone] = useState(false);
  const [praiseWord, setPraiseWord] = useState('');
  const round = COLLECT_ROUNDS[ri];
  const TRAY = round.digit + 2;
  const allDone = ri >= total - 1 && solvedItem;
  const trayIds = Array.from({ length: TRAY }, (_, i) => `${round.kind}${ri}_${i}`);

  const handleDrop = useCallback((tokenId, zoneId) => {
    if (solvedItem || zoneId !== 'yard') return;
    setPlaced((prev) => {
      if (prev.includes(tokenId)) return prev;
      if (prev.length >= round.digit) {
        sfx.playWrong();
        setBounceTok(tokenId); setTimeout(() => setBounceTok(null), 500);
        setWrongZone(true); setTimeout(() => setWrongZone(false), 450);
        if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.retry_audio[lang]); }
        return prev;
      }
      const np = [...prev, tokenId];
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][np.length] || ''); }
      return np;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solvedItem, ri, audio.muted, lang]);
  const dnd = useDnd(handleDrop);

  useEffect(() => {
    if (solvedItem) return undefined;
    if (placed.length !== round.digit) return undefined;
    const tm = setTimeout(() => {
      setSolvedItem(true);
      sfx.playCorrect();
      const pw = nextPraise(lang); setPraiseWord(pw);
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff((ri >= total - 1 ? c.done_text : c.correct_text)[lang]); } }
    }, 0);
    return () => clearTimeout(tm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, solvedItem, ri]);

  const nextRound = () => {
    setRi((v) => v + 1);
    setPlaced([]);
    setSolvedItem(false);
  };

  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!allDone} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const trayLeft = trayIds.filter((id) => !placed.includes(id));
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)} <span className="mono small" style={{ color: T.ink3 }}>{ri + 1} / {total}</span></p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <div className={`g1-collecthouse g1-dropzone ${wrongZone ? 'g1-nudge' : ''}`} data-zone="yard" onClick={() => dnd.tapZone('yard')}>
            <HouseSVG digit={round.digit}/>
            <div className="g1-yard g1-yard-drop"><ItemRow n={placed.length} kind={round.kind} anim="none"/></div>
          </div>
          <span className="g1-count-val mono">{placed.length} / {round.digit}</span>
        </div>
        {!solvedItem && (
          <div className="g1-tray fade-up delay-2">
            {trayLeft.map((id) => (
              <div key={id} className={`g1-token ${dnd.sel === id ? 'g1-token-sel' : ''} ${bounceTok === id ? 'g1-bounceback' : ''}`}
                onPointerDown={(e) => { if (!solvedItem) { e.preventDefault(); dnd.startDrag(e, id); } }}>
                <span className="g1-token-obj"><ItemSvg kind={round.kind}/></span>
              </div>
            ))}
          </div>
        )}
        {solvedItem && (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Reaction state="correct" praise={praiseWord}/>
            {!allDone && (
              <button className="btn-white-accent" onClick={nextRound}
                style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                {lang === 'uz' ? 'Keyingisi' : 'Дальше'}
              </button>
            )}
          </div>
        )}
        {dnd.drag && (
          <div className="g1-ghost" style={{ left: dnd.drag.x, top: dnd.drag.y }}><span className="g1-token-obj"><ItemSvg kind={round.kind}/></span></div>
        )}
      </div>
    </Stage>
  );
};

// s11 — TEST final + FactCard: qaysi uy beshinchi? (uylar 4/5/3). Tabrik+fakt YONMA-YON (skrolsiz).
const Screen11 = (props) => {
  const c = CONTENT.s11;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[
        <div className="g1-opt-house"><HouseSVG digit={4}/><div className="g1-yard"><ItemRow n={4} kind="ball"/></div></div>,
        <div className="g1-opt-house"><HouseSVG digit={5}/><div className="g1-yard"><ItemRow n={5} kind="cube"/></div></div>,
        <div className="g1-opt-house"><HouseSVG digit={3}/><div className="g1-yard"><ItemRow n={3} kind="pot"/></div></div>,
      ]}
      optionsCols={1}
      correctIdx={1}
      celebrateOnCorrect={() => (
        <div className="g1-final-street"><StreetScene final/></div>
      )}
      factOnCorrect={(
        <div className="g1-handfact fade-up">
          <div className="g1-factdigits">{[1, 2, 3, 4, 5].map((d) => <DigitGlyph key={d} d={d} size="sm"/>)}</div>
          <p className="g1-handfact-txt">{t(c.fact_text)}</p>
        </div>
      )}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s12 — SUMMARY: Dars01 etaloni kabi joylashuv (reyting -> can-do -> sahna, ustma-ust).
// Sahna = ko'cha uchrashuvi (Anvar Ra'noni topdi). Bit boshlovchi yopadi.
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s12;
  useHero('present');
  const audio = useAudio(makeAutoSegments(c, lang));
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 16px)' }}>
        <div className="g1-rating fade-up">
          <div className="g1-rating-stars">
            {[0, 1, 2].map((i) => (
              <span key={i} className="g1-rating-star g1-pop-in" style={{ animationDelay: `${0.15 + i * 0.22}s` }}>
                <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 L25.2 14.6 L38 16 L28.5 24.6 L31.2 37 L20 30.4 L8.8 37 L11.5 24.6 L2 16 L14.8 14.6 Z" fill="#FFC23C"/></svg>
              </span>
            ))}
          </div>
          <p className="g1-rating-praise">{t(c.praise)}</p>
        </div>
        <div className="frame-success fade-up">
          <h2 className="title h-sub" style={{ margin: 0 }}>
            {t(c.main_1)} <span className="italic" style={{ color: T.success }}>{t(c.main_2_em)}</span>
          </h2>
          <p className="g1-cando-sub">{t(c.main_3)}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <div className="g1-final-street"><StreetScene final/></div>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1)
// ============================================================
export default function CountingDigitsLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [heroMood, setHeroMood] = useState('pointing');   // personaj holati (butun urok bo'ylab bitta overlay)
  const heroCtx = React.useMemo(() => ({ setMood: setHeroMood }), []);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); setHeroMood('pointing'); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
  const scored = SCREEN_META.filter(s => s.scored);
  const finalScreens = scored.filter(s => s.scope === 'final');
  const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && a.correct).length;
  const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
  const payload = {
    lessonId: LESSON_META.lessonId,
    lessonTitle: LESSON_META.lessonTitle,
    durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
    totalQuestions: scored.length,
    correctAnswers: correctCount,
    scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
    finalScore: finalCorrect,
    finalTotal: finalScreens.length,
    passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
    firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
    answers: answers.filter(Boolean)
  };
  safeOnFinished(payload);
}, [answers, safeOnFinished]);

  const screens = [ScreenIntro, Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, HouseCollect, ScreenGuest, Screen11, Screen12];
  const CurrentScreen = screens[current];

  // Ekran almashganda personajni "ko'rsatadi" (pointing) holatiga qaytaramiz;
  // javobdan keyin Reaction uni happy/encourage'ga o'zgartiradi.
  const next = () => { setHeroMood('pointing'); setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { setHeroMood('pointing'); setCurrent(s => Math.max(s - 1, 0)); };

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  const starTotal = SCREEN_META.filter((s) => s.scored).length;
  const starsEarned = answers.filter((a, i) => a && SCREEN_META[i] && SCREEN_META[i].scored && a.correct).length;

  return (
    <LangContext.Provider value={lang}>
      <ProgressContext.Provider value={{ stars: starsEarned, total: starTotal }}>
      <HeroContext.Provider value={heroCtx}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <GradientDefs/>
        <HouseDefs/>
        <AmbientBg/>
        <StageHero mood={heroMood}/>
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
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
      </HeroContext.Provider>
      </ProgressContext.Provider>
    </LangContext.Provider>
  );
}


const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
}

/* Reset margins для типографики внутри урока */
.lesson-root h1,
.lesson-root h2,
.lesson-root h3,
.lesson-root h4,
.lesson-root h5,
.lesson-root h6,
.lesson-root p,
.lesson-root ul,
.lesson-root ol { margin: 0; padding: 0; }

.title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: "opsz" 60; }
.display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: "opsz" 60; }
.italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; font-variation-settings: "opsz" 60; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; font-weight: 400; }
.frac .n, .frac .d { padding: 0 0.12em; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }

@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
.delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }

/* === КНОПКИ v15 (тени вместо рамок) === */
.btn {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #0E0E10;
  color: #F6F4EF;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32);
}
.btn:hover:not(:disabled) {
  background: #FF4F28;
  box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45);
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-white-accent {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #FFFFFF;
  color: #FF4F28;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12);
}
.btn-white-accent:hover:not(:disabled) {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55);
}
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }
/* btn-ready — "Davom" bosish kerak bo'lgan paytdagi holat: to'q rang + puls (g1) */
.btn-white-accent.btn-ready {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 10px 26px -5px rgba(255, 79, 40, 0.5), 0 0 0 1px rgba(255, 79, 40, 0.25);
  animation: btnReadyPulse 1.5s ease-in-out infinite;
}
.btn-white-accent.btn-ready:hover:not(:disabled) { background: #E8431F; color: #FFFFFF; }
@keyframes btnReadyPulse {
  0%, 100% { transform: scale(1);     box-shadow: 0 10px 26px -5px rgba(255, 79, 40, 0.45), 0 0 0 0 rgba(255, 79, 40, 0.5); }
  50%      { transform: scale(1.045); box-shadow: 0 14px 30px -6px rgba(255, 79, 40, 0.6),  0 0 0 9px rgba(255, 79, 40, 0); }
}
@media (prefers-reduced-motion: reduce) { .btn-white-accent.btn-ready { animation: none; } }

.btn-ghost {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #0E0E10;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: none;
}
.btn-ghost:hover:not(:disabled) {
  background: #FFFFFF;
  box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18);
}
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

/* === ОПЦИИ v15 (без рамок, на тенях) === */
.option {
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  text-align: left;
  border-radius: 12px;
  width: 100%;
  border: none;
  color: #0E0E10;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.option:hover:not(:disabled) {
  background: #FDFBF7;
  box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22);
}
.option:disabled { cursor: default; }
.option-correct {
  background: #E3F0E8 !important;
  color: #1F7A4D !important;
  box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important;
}
.option-wrong {
  background: #FFFFFF !important;
  color: #A7A6A2 !important;
  opacity: 0.32 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.06) !important;
}
.option-picked-wrong {
  background: #FBF3D6 !important;
  color: #C99A2E !important;
  box-shadow: 0 8px 22px -6px rgba(216, 169, 58, 0.32) !important;
}

/* === ТИПОГРАФИКА v15 (× 0.85 upper bounds) === */
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(20px, 3.2vw, 23px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; position: relative; z-index: 1; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(8px, 1.5vw, 11px);
  padding-bottom: clamp(11px, 2.4vw, 15px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.stage-nav {
  flex-shrink: 0;
  background: #F6F4EF;
  border-top: 1px solid rgba(167, 166, 162, 0.25);
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(11px, 2vw, 11px);
  display: flex;
  gap: 12px;
}

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
/* yulduz-kopilka (yuqorida): to'g'ri javoblar to'planadi */
.g1-stars { display: flex; gap: clamp(2px,0.8vw,5px); align-items: center; }
.g1-star-slot { font-size: clamp(13px,1.9vw,17px); line-height: 1; color: rgba(167,166,162,0.4); }
.g1-star-slot.on { color: #FFC23C; animation: g1starpop 0.45s cubic-bezier(0.34,1.6,0.64,1); }
@keyframes g1starpop { 0% { transform: scale(0.3); } 60% { transform: scale(1.35); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-star-slot.on { animation: none; } }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FF4F28;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.55);
}

/* === PROGRESS v15 (с orange glow) === */
.progress-track {
  height: 6px;
  background: rgba(167, 166, 162, 0.25);
  width: 100%;
  margin-bottom: 12px;
  border-radius: 99px;
  overflow: visible;
}
.progress-bar {
  height: 100%;
  background: #FF4F28;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
  box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40);
}

/* === SLIDER v15 === */
.track-wrap {
  position: relative;
  height: 26px;
  margin: 18px 0;
  display: flex;
  align-items: center;
}
.track-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: rgba(167, 166, 162, 0.30);
  border-radius: 99px;
  pointer-events: none;
}
.track-fill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #FF4F28;
  border-radius: 99px;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40);
  transition: width 0.15s ease-out;
}
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  width: 100%;
  height: 24px;
  background: transparent;
  outline: none;
  margin: 0;
  cursor: grab;
  z-index: 2;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.1s;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

/* === INPUT v15 === */
.answer-input {
  font-family: 'Fraunces', serif;
  font-size: clamp(22px, 4vw, 27px);
  font-weight: 400;
  text-align: center;
  border-radius: 12px;
  background: #FFFFFF;
  padding: 8px 12px;
  outline: none;
  border: none;
  color: #0E0E10;
  transition: all 0.2s;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.answer-input:focus {
  box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20);
}
.answer-input.correct {
  background: #E3F0E8;
  color: #1F7A4D;
  box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30);
}
.answer-input.wrong {
  background: #FFE8E1;
  color: #FF4F28;
  box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36);
}

/* === FRAMES v15 === */
.frame {
  background: #FFFFFF;
  border-radius: 16px;
  padding: clamp(20px, 4.2vw, 24px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
  overflow: hidden;
}
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }
/* MATH: ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста. */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

/* MATH: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

/* === GRADE1 num_1_01 — sanash vizuallari (animatsion to'plam) === */
.g1-listen-hint { margin: 0; color: #019ACB; font-weight: 600; letter-spacing: 0.04em; opacity: 0.9; animation: g1twinkle 1.8s ease-in-out infinite; }
.g1-pips { display: flex; flex-wrap: nowrap; gap: clamp(4px, 1.2vw, 9px); justify-content: center; align-items: center; max-width: 100%; }
.g1-pips-wrap { flex-wrap: wrap; }
.g1-obj { width: clamp(36px, 8.5vw, 58px); aspect-ratio: 1 / 1; height: auto; min-width: 0; display: inline-flex; flex-shrink: 1; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bob { animation: g1bob 3s ease-in-out infinite; }
.g1-twinkle { animation: g1twinkle 2s ease-in-out infinite; }
@keyframes g1bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-7px) rotate(3deg); } }
@keyframes g1twinkle { 0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); } 50% { opacity: 0.5; transform: scale(0.82) rotate(8deg); } }
@keyframes g1pop { 0% { opacity: 0; transform: scale(0.4); } 60% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
@keyframes g1drop { 0% { opacity: 0; transform: translateY(-30px); } 72% { transform: translateY(3px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes g1pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
@keyframes g1gap { 0%, 100% { transform: scale(1); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.30); } 50% { transform: scale(1.06); box-shadow: 0 10px 22px -6px rgba(255,79,40,0.5); } }

/* CountDemo — jonli sanash */
.g1-demo { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.4vw, 16px); }
.g1-demo-row { display: flex; gap: clamp(12px, 3vw, 20px); justify-content: center; align-items: flex-end; min-height: clamp(60px, 13vw, 86px); }
.g1-demo-cell { position: relative; width: clamp(52px, 11vw, 78px); height: clamp(52px, 11vw, 78px); opacity: 0; }
.g1-demo-cell.on { opacity: 1; animation: g1pop 0.45s ease-out; }
.g1-demo-cell.pulse { animation: g1pop 0.45s ease-out, g1pulse 1.7s ease-in-out 0.5s infinite; }
.g1-demo-cell svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-demo-tag { position: absolute; top: -8px; right: -6px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-demo-num { font-weight: 800; font-size: clamp(40px, 9vw, 62px); color: #FF4F28; line-height: 1; }
.g1-demo-num.big { font-size: clamp(52px, 13vw, 86px); }

/* TenFrame — bo'sh kataklar */
.g1-tenframe { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-cell { width: clamp(64px, 14vw, 94px); height: clamp(64px, 14vw, 94px); border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.25s, box-shadow 0.25s; }
.g1-cell-target { background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); }
.g1-cell-filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; }
.g1-cell-empty { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; }
.g1-cell-obj { width: 74%; height: 74%; display: inline-flex; animation: g1drop 0.4s ease-out; }
.g1-cell-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.18)); }
/* interaktiv ten-frame (s5): bosiladigan kataklar */
.g1-cell-btn { position: relative; width: clamp(64px, 14vw, 94px); height: clamp(64px, 14vw, 94px); border: none; border-radius: 14px; cursor: pointer; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); display: flex; align-items: center; justify-content: center; transition: background 0.2s, box-shadow 0.2s, transform 0.15s; }
.g1-cell-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 2px #019ACB; }
.g1-cell-btn.filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }
.g1-cell-num { position: absolute; top: 3px; right: 6px; font-weight: 800; font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; }

/* CountTrack / MissingTrack — son qatori */
.g1-track-label { font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #FF4F28; letter-spacing: 0.02em; min-height: 1.3em; transition: color 0.25s; }
.g1-track-label.back { color: #019ACB; }
.g1-track { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-track-tile { width: clamp(52px, 11.5vw, 72px); height: clamp(56px, 13vw, 80px); background: #FFFFFF; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, color 0.25s, box-shadow 0.25s; }
.g1-track-tile span { font-weight: 800; font-size: clamp(28px, 6.5vw, 42px); color: #0E0E10; }
.g1-track-tile.active { background: #FF4F28; transform: translateY(-7px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-track-tile.active span { color: #FFFFFF; }
.g1-track-tile.gap { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; animation: g1gap 1.4s ease-in-out infinite; }
.g1-track-tile.gap span { color: #D8A93A; }
.g1-track-tile.g1-track-filled { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-track-tile.g1-track-filled span { color: #FFFFFF; }
/* count javob badge'i (sanagandan keyin son paydo bo'ladi) */
.g1-countfig { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-countfig-ans { font-weight: 800; font-size: clamp(30px, 7vw, 46px); color: #1F7A4D; }
/* BigNumberCue (keyingi/oldingi savol uchun tayanch son) */
.g1-cue { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 3vw, 22px); }
.g1-cue-num { width: clamp(82px, 20vw, 124px); height: clamp(82px, 20vw, 124px); background: #FF4F28; color: #FFFFFF; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(44px, 10vw, 68px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-cue-arrow { font-size: clamp(44px, 11vw, 70px); font-weight: 800; color: #A7A6A2; }
.g1-cue-num.g1-cue-ans { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-pop-in { animation: g1pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }

/* CountingHand — sanaydigan qo'l */
.g1-hand { position: relative; width: clamp(143px, 32vw, 218px); height: clamp(135px, 30vw, 204px); display: flex; align-items: center; justify-content: center; }
.g1-hand-big { width: clamp(200px, 50vw, 300px); height: clamp(190px, 48vw, 280px); }
.g1-hand svg { width: 100%; height: 100%; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.2)); }
.g1-hand-num { position: absolute; top: -2px; right: 2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(15px, 2.4vw, 20px); min-width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -4px rgba(31,122,77,0.5); }

/* s5 dasturxon: tepadan ko'rilgan stol (naqshli) + non/choynak + likobchalar */
.g1-dasturxon { position: relative; background: #FBF3DE; border-radius: 18px; border: clamp(6px,1.6vw,9px) solid #019ACB; padding: clamp(12px,2.6vw,18px) clamp(12px,2.6vw,18px) clamp(14px,3vw,20px); display: flex; flex-direction: column; align-items: center; gap: clamp(10px,2.2vw,15px); box-shadow: 0 8px 22px -6px rgba(58,53,48,0.18); }
.g1-dasturxon::before { content: ''; position: absolute; inset: clamp(4px,1vw,6px); border: 2px dashed rgba(1,154,203,0.45); border-radius: 12px; pointer-events: none; }
.g1-dx-decor { display: flex; align-items: flex-end; justify-content: center; gap: clamp(8px,2vw,16px); position: relative; z-index: 1; }
.g1-dx-non { width: clamp(34px,8vw,48px); height: clamp(34px,8vw,48px); filter: drop-shadow(0 3px 5px rgba(58,53,48,0.18)); }
.g1-dx-teapot { width: clamp(44px,10vw,60px); height: clamp(34px,8vw,46px); filter: drop-shadow(0 3px 5px rgba(58,53,48,0.18)); }
/* SYUJET (hikoya) sahnalari — kirish (dasturxon) va ko'prik (mehmon) */
.g1-table-scene { display: flex; justify-content: center; width: 100%; }
.g1-table-svg { width: clamp(280px, 72vw, 430px); height: auto; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.16)); }
/* ovqat: realroq — joyida turadi, faqat sezilmas vertikal "nafas" (aylanishsiz) */
.g1-table-non { animation: g1float 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.g1-table-apples { animation: g1float 4s ease-in-out 0.7s infinite; transform-box: fill-box; transform-origin: center bottom; }
@keyframes g1float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
.g1-steam { transform-box: fill-box; transform-origin: center bottom; animation: g1steam 2.9s ease-in-out infinite; }
.g1-steam2 { animation-delay: 0.95s; }
.g1-steam3 { animation-delay: 1.7s; }
@keyframes g1steam { 0% { opacity: 0; transform: translateY(6px) scale(0.8); } 35% { opacity: 0.85; } 70% { opacity: 0.5; } 100% { opacity: 0; transform: translateY(-24px) scale(1.18); } }
/* dasturxon ustidan suzib o'tuvchi yorug'lik (chap->o'ng) — "tayyor, chiroyli" */
.g1-table-sweep { animation: g1tsweep 3.6s ease-in-out infinite; }
@keyframes g1tsweep { 0% { transform: translateX(-110px) skewX(-20deg); opacity: 0; } 22% { opacity: 0.9; } 78% { opacity: 0.9; } 100% { transform: translateX(300px) skewX(-20deg); opacity: 0; } }
/* tayyorlangan dasturxon ustidagi uchqunlar */
.g1-table-spark { animation: g1tspark 1.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes g1tspark { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-table-non, .g1-table-apples, .g1-steam, .g1-table-sweep, .g1-table-spark { animation: none; } }
/* yo'riqnoma chipi (1-slayd): tingla -> Davom */
.g1-onboard { display: flex; align-items: center; justify-content: center; gap: clamp(8px,1.6vw,12px); align-self: center; background: #EAF6FB; border: 1px solid rgba(1,154,203,0.3); border-radius: 99px; padding: clamp(8px,1.5vw,11px) clamp(14px,2.6vw,20px); }
.g1-onboard-ic { flex-shrink: 0; animation: g1twinkle 1.8s ease-in-out infinite; }
.g1-onboard-txt { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.7vw,15px); color: #017BA3; }
.g1-onboard-arrow { color: #A7A6A2; font-weight: 800; font-size: clamp(15px,2vw,18px); }
.g1-onboard-pill { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,1.5vw,13px); color: #FFFFFF; background: #FF4F28; border-radius: 99px; padding: clamp(5px,1vw,7px) clamp(12px,2.2vw,16px); }
/* mehmon: o'ngdan kirib keladi (1x), keyin yengil tebranadi */
.g1-guest { animation: g1guestEnter 0.85s cubic-bezier(0.34,1.5,0.6,1) both, g1guestBob 2.6s ease-in-out 0.9s infinite; }
.g1-guest-hand { animation: g1wave 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom left; }
.g1-knock { transform-box: fill-box; transform-origin: left center; animation: g1knock 1.5s ease-in-out infinite; }
.g1-doorglow { animation: g1glow 2.2s ease-in-out infinite; }
.g1-giftspark { animation: g1giftspark 1.4s ease-in-out infinite; }
@keyframes g1guestEnter { 0% { opacity: 0; transform: translateX(48px); } 100% { opacity: 1; transform: translateX(0); } }
@keyframes g1guestBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes g1wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-14deg); } }
@keyframes g1knock { 0% { opacity: 0; transform: translateX(-4px) scale(0.85); } 45% { opacity: 1; } 100% { opacity: 0; transform: translateX(6px) scale(1.14); } }
@keyframes g1glow { 0%,100% { opacity: 0.22; } 50% { opacity: 0.6; } }
@keyframes g1giftspark { 0%,100% { opacity: 0.1; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-guest, .g1-guest-hand, .g1-knock, .g1-doorglow, .g1-giftspark { animation: none; } }
.g1-tablescene { display: flex; flex-direction: column; align-items: center; width: 100%; }
.g1-plates { display: flex; gap: clamp(6px,1.8vw,12px); justify-content: center; position: relative; z-index: 1; flex-wrap: wrap; }
.g1-plate { position: relative; width: clamp(62px,14vw,90px); height: clamp(62px,14vw,90px); border-radius: 50%; border: clamp(3px,0.8vw,4px) solid #5FBFE0; cursor: pointer; background: radial-gradient(circle at 50% 36%, #FFFFFF 0%, #FBFAF5 54%, #E6DDCB 100%); box-shadow: 0 7px 16px -6px rgba(58,53,48,0.4), inset 0 7px 12px -5px rgba(58,53,48,0.22); display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.g1-plate::before { content: ''; position: absolute; inset: clamp(6px,1.5vw,9px); border-radius: 50%; border: 1.5px dashed rgba(1,154,203,0.5); pointer-events: none; }
.g1-plate:hover:not(:disabled) { transform: translateY(-2px); }
.g1-plate.filled { cursor: default; }
.g1-plate-obj { width: 62%; height: 62%; display: inline-flex; }
.g1-plate-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 5px rgba(58,53,48,0.2)); }
.g1-plate-num { position: absolute; bottom: -2px; right: -2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px,1.6vw,14px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-tabletop { width: clamp(230px,60vw,380px); height: clamp(20px,4.4vw,30px); background: linear-gradient(#C8893E, #B17B34); border-radius: 7px; box-shadow: 0 8px 16px -6px rgba(58,53,48,0.35); position: relative; z-index: 0; }

/* s4 figura (TOZA): idle animatsiya HTML div'da — kafolatli ishlaydi */
.g1-s4fig { position: relative; display: inline-block; line-height: 0; animation: g1idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
.g1-s4fig-svg { width: clamp(150px,38vw,200px); height: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.18)); }
.g1-s4fig-happy { animation: g1jump 0.7s ease, g1idle 3.2s ease-in-out 0.7s infinite; }

/* DressStars (s4) eski meros — endi ishlatilmaydi (saqlangan, zararsiz) */
.g1-dress { position: relative; display: inline-flex; }
.g1-dress-svg { width: clamp(150px,38vw,200px); height: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.18)); }
.g1-arm-up { opacity: 0; transition: opacity 0.35s; }
.g1-arm-dn { opacity: 1; transition: opacity 0.35s; }
.g1-dress-happy .g1-arm-up { opacity: 1; }
.g1-dress-happy .g1-arm-dn { opacity: 0; }
.g1-dress-happy .g1-dress-svg { animation: g1jump 0.7s ease; transform-origin: center bottom; }
@keyframes g1jump { 0%, 100% { transform: translateY(0); } 35% { transform: translateY(-14px); } 70% { transform: translateY(0); } }
.g1-mouth-happy { opacity: 0; }
.g1-dress-happy .g1-mouth-happy { opacity: 1; }
.g1-dress-happy .g1-mouth { opacity: 0; }
.g1-spark { position: absolute; width: 14px; height: 14px; background: radial-gradient(circle, #FFD86B 0%, rgba(255,216,107,0) 70%); border-radius: 50%; pointer-events: none; }
.g1-spark1 { left: 8%; top: 22%; animation: g1spark 0.9s ease-out 0s infinite; }
.g1-spark2 { right: 6%; top: 30%; animation: g1spark 0.9s ease-out 0.3s infinite; }
.g1-spark3 { left: 16%; top: 52%; animation: g1spark 0.9s ease-out 0.6s infinite; }
@keyframes g1spark { 0% { opacity: 0; transform: scale(0.4); } 40% { opacity: 1; transform: scale(1.15); } 100% { opacity: 0; transform: scale(0.5); } }
.g1-conf { position: absolute; top: -8%; width: 8px; height: 12px; border-radius: 2px; pointer-events: none; }
.g1-conf1 { left: 16%; background: #FF4F28; animation: g1conf 1.1s ease-in 0s infinite; }
.g1-conf2 { left: 34%; background: #019ACB; animation: g1conf 1.3s ease-in 0.2s infinite; }
.g1-conf3 { left: 50%; background: #FFC23C; animation: g1conf 1.0s ease-in 0.45s infinite; }
.g1-conf4 { left: 64%; background: #1F7A4D; animation: g1conf 1.25s ease-in 0.1s infinite; }
.g1-conf5 { left: 80%; background: #FF7AA8; animation: g1conf 1.15s ease-in 0.55s infinite; }
.g1-conf6 { left: 26%; background: #9B5DE5; animation: g1conf 1.2s ease-in 0.75s infinite; }
@keyframes g1conf { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 12% { opacity: 1; } 100% { opacity: 0; transform: translateY(190px) rotate(420deg); } }
/* Reaction — yagona emotsional otklik (maskot + maqtov) */
.g1-react { display: flex; align-items: center; gap: clamp(8px,1.8vw,12px); }
/* === PNG personaj overlay — butun urok bo'ylab bitta doimiy element (personaj.md) ===
   Doimiy joylashuv (sakramaydi), pastki chap burchak, nav ustida; pointer-events yo'q
   (taplar o'tib ketadi, tugma/predmetlarni bloklamaydi). */
.g1-hero { width: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.24)); }
/* SVG personajlar (Ra'no/Anvar/Bit): bazaviy o'lcham + jonlanish */
.g1-char { display: block; height: 100%; width: auto; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.22)); }
.g1-eyes { transform-box: fill-box; transform-origin: center; animation: g1blink 4.4s infinite; }
@keyframes g1blink { 0%, 93%, 100% { transform: scaleY(1); } 96.5% { transform: scaleY(0.12); } }
.g1-bit-ant { transform-box: fill-box; transform-origin: bottom center; animation: g1antbob 2.2s ease-in-out infinite; }
@keyframes g1antbob { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
.g1-bit-wave, .g1-anvar-wave { transform-box: fill-box; transform-origin: bottom left; animation: g1wavebig 1s ease-in-out infinite; }
@keyframes g1wavebig { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(-26deg); } }
@keyframes g1bitfloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
/* idle — Ra'no/Anvar figuralar (cast + s4 ko'ylak) sezilarli nafas/tebranish (#8: kattaroq) */
/* idle — HTML o'rovchida (svg ildizida emas; ishonchli va yaqqol ko'rinadi) */
.g1-cast-fig, .g1-dress { animation: g1idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
@keyframes g1idle { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
.g1-stage-hero { position: absolute; left: clamp(2px,1.6vw,28px); bottom: clamp(72px,11vh,104px); z-index: 6; pointer-events: none; display: flex; align-items: flex-end; gap: clamp(2px,1vw,8px); }
.g1-stage-hero .g1-hero { transform-origin: bottom center; }
.g1-stage-hero .g1-hero-rano { height: clamp(104px,22vh,208px); }
.g1-stage-hero .g1-hero-bit { height: clamp(80px,17vh,156px); }   /* Bit Ra'nodan kichikroq */
/* Mobil (tor ekran): personaj kichikroq va burchakka, kontentni kamroq yopadi */
@media (max-width: 640px) {
  .g1-stage-hero { left: 0; bottom: clamp(62px,9vh,84px); gap: 0; }
  .g1-stage-hero .g1-hero-rano { height: clamp(78px,14vh,116px); }
  .g1-stage-hero .g1-hero-bit { height: clamp(62px,11vh,92px); }
}
.g1-sh-pointing .g1-hero-rano { animation: g1heroIn 0.45s ease; }
.g1-sh-happy .g1-hero-rano { animation: g1mhop 0.6s ease; }
.g1-sh-encourage .g1-hero-rano { animation: g1mtilt 0.7s ease; }
.g1-sh-encourage .g1-hero-bit { animation: g1heroIn 0.45s ease 0.1s both; }
.g1-sh-celebrate .g1-hero-rano { animation: g1mhop 0.9s ease; }
/* Bit BOSHLOVCHI (present) — ramka ekranlarida diktor, Ra'no o'lchamida (kirish + suzish) */
.g1-sh-present .g1-hero-bit { height: clamp(104px,22vh,200px); animation: g1heroIn 0.45s ease, g1bitfloat 3.2s ease-in-out 0.45s infinite; }
@media (max-width: 640px) { .g1-sh-present .g1-hero-bit { height: clamp(76px,14vh,112px); } }
/* Story cast (frame ichi): Ra'no + Anvar, bosqichma-bosqich ochiladi (useStoryReveal) */
/* Orqa sahna (xona/eshik) — personajlar oldida, REAL masshtab (personaj katta, jihoz proporsional) */
.g1-scene { position: relative; width: 100%; display: flex; align-items: flex-end; justify-content: center; min-height: clamp(200px,44vw,340px); overflow: hidden; border-radius: 14px; }
.g1-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.g1-scene > .g1-cast-row { position: relative; z-index: 1; padding-bottom: clamp(8px,2.4vw,18px); }
.g1-scene .g1-cast-fig { height: clamp(132px,32vw,230px); }   /* sahnada personaj kattaroq */
/* slayd 1 dasturxon (chiroyli stol) — personajlar orqasida, polda */
.g1-scene-table { position: absolute; left: 50%; bottom: clamp(2px,1.4vw,12px); transform: translateX(-50%); width: clamp(230px,60vw,420px); z-index: 0; pointer-events: none; }
.g1-scene-table .g1-table-svg { width: 100%; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.14)); }
.g1-scene-intro .g1-cast-row { gap: clamp(80px,30vw,260px); }   /* personajlar dasturxon yon tomonlarida */
.g1-cast-row { display: flex; align-items: flex-end; justify-content: center; gap: clamp(18px,5vw,48px); flex-wrap: wrap; }
.g1-cast { display: flex; flex-direction: column; align-items: center; gap: clamp(6px,1.4vw,10px); opacity: 0; transform: translateY(10px) scale(0.96); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-cast.in { opacity: 1; transform: translateY(0) scale(1); }
.g1-cast-fig { height: clamp(96px,20vw,150px); display: flex; align-items: flex-end; justify-content: center; }
.g1-cast-sm .g1-cast-fig { height: clamp(72px,15vw,110px); }
.g1-cast-img { height: 100%; width: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.22)); }
.g1-cast-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.8vw,16px); color: #5A5A60; }
.g1-cast-sub { color: #A7A6A2; font-weight: 600; }
/* Anvar PLACEHOLDER (rasm hali yo'q): punktir ramka -> "rasm tez orada keladi" signali */
.g1-anvar-ph { height: 100%; aspect-ratio: 2 / 3; display: flex; align-items: center; justify-content: center; padding: clamp(6px,1.4vw,10px); border: 2px dashed rgba(1,154,203,0.55); border-radius: 16px; background: rgba(205,231,241,0.18); }
.g1-anvar-coming { opacity: 0.92; }
.g1-anvar-door { animation: g1pulse 1.8s ease-in-out infinite; }
.g1-anvar-happy { animation: g1mhop 0.9s ease; }
/* s10/s11 final bayram: savat + Anvar yonma-yon */
.g1-final-cel { display: flex; align-items: center; justify-content: center; gap: clamp(12px,3vw,28px); flex-wrap: wrap; }
/* s10 fakt: 5 barmoqli qo'l + matn (barmoqlar ko'rsatiladi) */
.g1-handfact { display: flex; align-items: center; gap: clamp(12px,2.6vw,18px); background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px,2.2vw,16px); box-shadow: 0 6px 16px -6px rgba(1,154,203,0.22); margin-top: clamp(10px,2vw,14px); }
.g1-handfact-hand { flex-shrink: 0; }
.g1-handfact-hand .g1-hand { width: clamp(96px,22vw,150px); height: clamp(92px,21vw,142px); }
.g1-handfact-txt { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,2vw,18px); color: #0E5F7F; }
@media (prefers-reduced-motion: reduce) { .g1-cast { transition: none; } .g1-anvar-door, .g1-anvar-happy, .g1-cast-fig, .g1-dress { animation: none; } }
@keyframes g1heroIn { 0% { opacity: 0; transform: translateY(10px) scale(0.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes g1mhop { 0%,100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-13px) scale(1.14); } 55% { transform: translateY(0) scale(1); } 70% { transform: translateY(-6px) scale(1.07); } }
@keyframes g1mtilt { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-11deg); } 55% { transform: rotate(8deg); } 80% { transform: rotate(-4deg); } }
.g1-react-txt { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(16px,2.6vw,22px); }
.g1-react-ok .g1-react-txt { color: #1F7A4D; }
.g1-react-enc .g1-react-txt { color: #D8A93A; }
/* Bit-KARTOCHKA (har javobda): matn chap, animatsion Bit o'ng — 5-sinf fakt-kartochka uslubi */
.g1-bitcard { display: flex; align-items: center; gap: clamp(10px,2.4vw,16px); width: 100%; }
.g1-bitcard-body { flex: 1; min-width: 0; }
.g1-bitcard-txt { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(16px,2.6vw,22px); }
.g1-bitcard-ok .g1-bitcard-txt { color: #1F7A4D; }
.g1-bitcard-enc .g1-bitcard-txt { color: #D8A93A; }
.g1-bitcard-fig { flex-shrink: 0; height: clamp(48px,11vw,68px); }
.g1-bitcard-ok .g1-bitcard-fig .g1-char { animation: g1mhop 0.7s ease; }
.g1-bitcard-enc .g1-bitcard-fig .g1-char { animation: g1mtilt 0.7s ease; }
@media (prefers-reduced-motion: reduce) {
  .g1-hero, .g1-char, .g1-eyes, .g1-bit-ant, .g1-bit-wave, .g1-anvar-wave { animation: none !important; }
  .g1-sh-present .g1-hero-bit, .g1-bitcard-ok .g1-bitcard-fig .g1-char, .g1-bitcard-enc .g1-bitcard-fig .g1-char { animation: none !important; }
}
@media (prefers-reduced-motion: reduce) { .g1-s4fig, .g1-s4fig-happy, .g1-dress-happy .g1-dress-svg, .g1-spark1, .g1-spark2, .g1-spark3, .g1-conf1, .g1-conf2, .g1-conf3, .g1-conf4, .g1-conf5, .g1-conf6 { animation: none; } }
/* yakuniy reyting (rag'bat): 3 yulduz + maqtov */
.g1-rating { display: flex; flex-direction: column; align-items: center; gap: clamp(4px,1vw,8px); }
.g1-rating-stars { display: flex; gap: clamp(6px,1.6vw,12px); }
.g1-rating-star { width: clamp(50px,11vw,72px); height: clamp(50px,11vw,72px); display: inline-flex; }
.g1-rating-star svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 8px rgba(255,194,60,0.55)); }
.g1-rating-praise { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(22px,5vw,32px); color: #FF4F28; }

/* === GameDrill (drag+tap o'yin bloki) === */
.g1-tray { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px,1.7vw,12px); padding: clamp(7px,1.7vw,11px); min-height: clamp(48px,10vw,68px); background: #FBF9F4; border-radius: 14px; }
.g1-token { background: #FFFFFF; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; display: flex; align-items: center; justify-content: center; padding: clamp(8px,1.8vw,12px); min-width: clamp(58px,13vw,78px); min-height: clamp(58px,13vw,78px); transition: transform 0.15s, box-shadow 0.15s; }
.g1-token:active { cursor: grabbing; transform: scale(1.05); }
.g1-token-sel { box-shadow: 0 0 0 3px #FF4F28, 0 8px 20px -6px rgba(255,79,40,0.4); }
/* noto'g'ri sudralganda: token yumshoq sakrab qaytadi (jazo emas) */
.g1-bounceback { animation: g1bounceback 0.5s ease; }
@keyframes g1bounceback { 0% { transform: translateY(0) scale(1); } 28% { transform: translateY(-9px) scale(1.1); } 55% { transform: translateY(0) scale(0.97); } 78% { transform: translateY(-3px) scale(1.02); } 100% { transform: translateY(0) scale(1); } }
/* savatga qo'yishni ko'rsatuvchi qo'l-demo */
.g1-bhd { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; pointer-events: none; z-index: 7; padding-bottom: clamp(6px,1.6vw,12px); }
.g1-bhd-move { display: flex; flex-direction: column; align-items: center; animation: g1bhd 2.6s ease-in-out infinite; filter: drop-shadow(0 8px 14px rgba(58,53,48,0.28)); }
.g1-bhd-apple { width: clamp(30px,7vw,42px); height: clamp(30px,7vw,42px); display: inline-flex; }
.g1-bhd-apple svg { width: 100%; height: 100%; }
.g1-bhd-petal { width: clamp(26px,6vw,36px); height: clamp(32px,7.5vw,46px); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: linear-gradient(155deg, #FFB6CE 0%, #FF6FA0 52%, #DA4A82 100%); display: inline-block; }
.g1-bhd-hand { width: clamp(28px,6.5vw,38px); height: auto; margin-top: -4px; }
@keyframes g1bhd { 0% { transform: translateY(12px); opacity: 0; } 12% { opacity: 1; } 46% { transform: translateY(-58px); opacity: 1; } 58% { transform: translateY(-58px) scale(0.94); } 74% { opacity: 1; } 88% { transform: translateY(-64px); opacity: 0; } 100% { transform: translateY(-64px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .g1-bounceback, .g1-bhd-move { animation: none; } }
.g1-token-obj { width: clamp(40px,9vw,56px); height: clamp(40px,9vw,56px); display: inline-flex; pointer-events: none; }
.g1-token-obj svg { width: 100%; height: 100%; }
.g1-token-num { font-weight: 800; font-size: clamp(32px,7vw,44px); color: #0E0E10; pointer-events: none; }
.g1-piece { width: clamp(30px,7vw,44px); height: clamp(30px,7vw,44px); border-radius: 8px; display: inline-block; pointer-events: none; }
.g1-dropzone { transition: background 0.2s, box-shadow 0.2s; cursor: pointer; }
/* noto'g'ri sudralganda: yumshoq sariq puls (jazo emas, "yana sana") */
.g1-nudge { animation: g1nudge 0.45s ease; }
@keyframes g1nudge { 0%, 100% { outline: 2px solid rgba(216,169,58,0); outline-offset: 2px; } 45% { outline: 3px solid rgba(216,169,58,0.75); outline-offset: 3px; } }
@media (prefers-reduced-motion: reduce) { .g1-nudge { animation: none; } }
.g1-basket { min-width: clamp(150px,42vw,280px); min-height: clamp(80px,16vw,112px); background: #FBF3D6; border-radius: 16px; box-shadow: inset 0 0 0 2px #D8A93A; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: clamp(10px,2vw,14px); }
.g1-basket-objs { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(5px,1.4vw,9px); }
.g1-basket-objs .g1-token-obj { width: clamp(26px,6vw,38px); height: clamp(26px,6vw,38px); }
.g1-basket-count { font-weight: 800; font-size: clamp(20px,3.4vw,26px); color: #1F7A4D; }
.g1-puzzle { display: flex; gap: clamp(5px,1.4vw,8px); }
.g1-slot { width: clamp(34px,8vw,52px); height: clamp(46px,10vw,66px); border-radius: 10px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; }
.g1-slot.filled { box-shadow: none; }
.g1-slot .g1-piece { width: 82%; height: 86%; }
/* match: har variant (2/4/5 olma) o'z qatorida — raqam-uyasi chapda, olmalar bitta qatorda o'ngda */
.g1-mbaskets { display: flex; flex-direction: column; gap: clamp(8px,1.8vw,12px); align-items: stretch; width: 100%; max-width: clamp(280px,90vw,460px); margin: 0 auto; }
.g1-mbasket { background: #FFFFFF; border-radius: 14px; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); padding: clamp(8px,1.8vw,12px) clamp(12px,2.6vw,18px); display: flex; flex-direction: row; align-items: center; gap: clamp(12px,3vw,20px); min-width: 0; }
.g1-mbasket-num { flex-shrink: 0; width: clamp(46px,10vw,60px); height: clamp(46px,9vw,58px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(30px,6.5vw,40px); color: #1F7A4D; }
.g1-order { display: flex; gap: clamp(6px,1.6vw,10px); justify-content: center; }
.g1-pos { width: clamp(56px,12vw,74px); height: clamp(60px,13vw,80px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; background: #FFFFFF; }
.g1-pos.filled { box-shadow: 0 6px 16px -6px rgba(31,122,77,0.3); background: #E3F0E8; }
.g1-pos .g1-token-num { color: #1F7A4D; }
.g1-ghost { position: fixed; transform: translate(-50%,-50%); z-index: 999; pointer-events: none; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 28px -6px rgba(58,53,48,0.35); padding: clamp(6px,1.4vw,10px); display: flex; align-items: center; justify-content: center; }
/* pazl = gul yig'ish */
.g1-flowerwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); }
.g1-flower { position: relative; width: clamp(210px,50vw,290px); height: clamp(210px,50vw,290px); }
.g1-flower-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: clamp(40px,10vw,58px); height: clamp(40px,10vw,58px); border-radius: 50%; background: #FFC23C; box-shadow: 0 4px 10px -4px rgba(180,138,30,0.5); }
.g1-petal-slot { position: absolute; transform: translate(-50%,-50%); width: clamp(54px,13vw,76px); height: clamp(54px,13vw,76px); border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; }
.g1-petal-slot.filled { box-shadow: none; }
.g1-petal { width: clamp(38px,9vw,56px); height: clamp(48px,11vw,68px); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: linear-gradient(155deg, #FFB6CE 0%, #FF6FA0 52%, #DA4A82 100%); box-shadow: 0 4px 9px -4px rgba(218,74,130,0.55), inset 0 2px 5px rgba(255,255,255,0.4); display: inline-block; pointer-events: none; }
.g1-petal-slot .g1-petal { width: 80%; height: 88%; }
/* gul yig'ilib bo'lgach: bir marta sakrab, keyin sekin aylanadi */
.g1-flower-spin { animation: g1flowerPop 0.55s ease-out, g1spin 5s linear 0.55s infinite; }
@keyframes g1flowerPop { 0% { transform: scale(1) rotate(0deg); } 45% { transform: scale(1.14) rotate(18deg); } 100% { transform: scale(1) rotate(0deg); } }
@keyframes g1spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* savat (3 olma + 2 gilos) */
.g1-basketwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); width: 100%; }
.g1-recipe { display: flex; gap: clamp(12px,3vw,22px); }
.g1-recipe-item { display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 10px; padding: 5px 10px; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); }
.g1-recipe-ic { width: clamp(22px,4.5vw,30px); height: clamp(22px,4.5vw,30px); display: inline-flex; }
.g1-recipe-ic svg { width: 100%; height: 100%; }
.g1-recipe-cnt { font-weight: 800; font-size: clamp(14px,2vw,17px); color: #1F7A4D; }
/* SVG savat (BasketArt) + ustidan olmalar (gardishdan ko'rinadi) */
.g1-realbasket { position: relative; width: clamp(230px,60vw,356px); aspect-ratio: 220 / 170; cursor: pointer; }
.g1-rb-svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 9px 18px rgba(58,53,48,0.34)); }
.g1-rb-bowl {
  position: absolute; left: 16%; right: 16%; top: 14%; bottom: 48%; z-index: 1;
  display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: clamp(3px,1.2vw,7px);
}
.g1-rb-bowl .g1-token-obj { width: clamp(24px,5.5vw,36px); height: clamp(24px,5.5vw,36px); animation: g1drop 0.5s ease-out; }
/* yakuniy test: savat ko'tarilib, olmalar sekin tushadi */
.g1-celebrate { display: flex; justify-content: center; }
.g1-celebrate-basket { animation: g1rise 0.6s ease-out; }
.g1-celebrate-apple { animation: g1fallin 0.7s ease-in both; }
@keyframes g1rise { from { transform: translateY(70px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes g1fallin { 0% { transform: translateY(-80px); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }

.g1-count-grid { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.5vw, 18px); justify-content: center; }
.g1-item { position: relative; background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(16px, 3.4vw, 24px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.18s, background 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; }
.g1-item:hover { transform: translateY(-2px); }
.g1-item-on { background: #E3F0E8; box-shadow: 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-item-num { position: absolute; top: 4px; right: 8px; font-weight: 800; font-size: clamp(14px, 2vw, 18px); color: #1F7A4D; }
.g1-item-icon { width: clamp(40px, 9vw, 60px); height: clamp(40px, 9vw, 60px); display: inline-flex; }
.g1-item-icon svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bigcount { text-align: center; margin-top: 14px; font-weight: 800; font-size: clamp(22px, 3.4vw, 28px); color: #0E0E10; }

.g1-numrow { display: flex; align-items: center; gap: clamp(12px, 3vw, 20px); padding: clamp(5px, 1.3vw, 9px) clamp(8px, 1.6vw, 12px); border-radius: 12px; transition: background 0.3s ease; }
.g1-numrow-on { background: #FFE8E1; }
.g1-digit { font-weight: 800; font-size: clamp(36px, 8vw, 58px); color: #FF4F28; min-width: 1.2em; text-align: center; transition: transform 0.3s cubic-bezier(0.34,1.4,0.64,1); }
.g1-numrow-on .g1-digit { transform: scale(1.18); }

/* tap-pair (s5) */
.g1-groups { display: flex; gap: clamp(8px, 2vw, 16px); justify-content: center; flex-wrap: wrap; }
.g1-group { flex: 1; min-width: clamp(88px, 26vw, 150px); background: #FFFFFF; border: 2px dashed #A7A6A2; border-radius: 16px; padding: clamp(10px, 2vw, 16px); display: flex; flex-direction: column; align-items: center; gap: 10px; transition: border-color 0.18s, background 0.18s; cursor: pointer; }
.g1-group-armed { border-color: #019ACB; background: #EAF6FB; }
.g1-group-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.g1-group-wrong { border-color: #D8A93A; background: #FBF3D6; }
.g1-group-faded { opacity: 0.3; cursor: default; }
.g1-slot { min-height: clamp(38px, 7vw, 50px); display: flex; align-items: center; justify-content: center; }
.g1-slot-num { font-weight: 800; font-size: clamp(34px, 8vw, 52px); color: #1F7A4D; }
.g1-tiles { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; margin-top: 4px; }
.g1-tile { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(13px, 2.6vw, 21px) clamp(21px, 4vw, 31px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(32px, 7vw, 46px); color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.18); transition: transform 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s; }
.g1-tile:hover:not(:disabled) { transform: translateY(-2px); }
.g1-tile-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 10px 24px -6px rgba(255,79,40,0.5); }
.g1-tile-ok { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 10px 24px -6px rgba(31,122,77,0.4); }
.g1-tile-used { opacity: 0.3; cursor: default; }
.g1-tile:disabled { cursor: default; }

/* ===== Dars02 — RAQAMLI UYLAR (digit / house / street) ===== */
.g1-digit { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #3A3530; display: inline-flex; align-items: center; justify-content: center; }
.g1-digit-ink { color: #3A3530; }
.g1-digit-accent { color: #FF4F28; }
.g1-digit-success { color: #1F7A4D; }
.g1-digit-sm { font-size: clamp(26px, 5.2vw, 38px); }
.g1-digit-mid { font-size: clamp(40px, 8vw, 60px); }
.g1-digit-big { font-size: clamp(60px, 13vw, 104px); }

/* hook — sochilgan uy raqamlari */
.g1-scatter { position: relative; width: 100%; max-width: 360px; height: clamp(150px, 26vw, 200px); }
.g1-scatter-d { position: absolute; animation: g1Float 3.4s ease-in-out infinite; filter: drop-shadow(0 4px 8px rgba(58,53,48,0.18)); }
@keyframes g1Float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-9px) rotate(var(--r,0deg)); } }

/* savol / izoh matni */
.g1-q { font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: #3A3530; margin: 0; }
.g1-hint-txt { font-size: clamp(13px, 1.7vw, 15px); color: #8A8780; }
.g1-arrow { font-size: clamp(28px, 5vw, 44px); color: #8A8780; }
.g1-tip-txt { font-size: clamp(14px, 1.8vw, 16px); color: #3A3530; line-height: 1.45; }

/* qator konteyner + sanagich */
.g1-drow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 1.8vw, 14px); }
.g1-dpips { min-height: clamp(46px, 9vw, 62px); display: flex; align-items: center; justify-content: center; }
.g1-count-line { display: flex; align-items: center; justify-content: center; gap: 10px; }
.g1-count-label { font-size: clamp(13px, 1.7vw, 15px); color: #8A8780; }
.g1-count-val { font-size: clamp(16px, 2.2vw, 20px); font-weight: 800; color: #FF4F28; }

/* ESHIK (raqam plitasi bilan) */
.g1-door { position: relative; display: inline-flex; flex-direction: column; align-items: center; width: clamp(54px, 11.5vw, 76px); height: clamp(78px, 16.5vw, 106px); background: repeating-linear-gradient(90deg, rgba(122,78,34,0) 0, rgba(122,78,34,0.12) 5px, rgba(255,255,255,0.05) 9px, rgba(122,78,34,0) 13px), linear-gradient(180deg, #C2864F, #9A6738); border: 2px solid #7A4E22; border-radius: 11px 11px 4px 4px; box-shadow: inset 0 2px 0 rgba(255,255,255,0.18), 0 4px 10px -5px rgba(58,53,48,0.35); overflow: hidden; }
.g1-door-panel { position: absolute; left: 16%; right: 16%; top: 34%; bottom: 9%; border: 2px solid rgba(0,0,0,0.16); border-radius: 4px; background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.07)); }
.g1-door-plate { position: relative; z-index: 2; margin-top: clamp(5px, 1.4vw, 9px); background: #FCFAF5; border: 1.5px solid #C9A877; border-radius: 6px; padding: 0 clamp(6px, 1.4vw, 10px); box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.g1-door-knob { position: absolute; right: clamp(7px, 1.6vw, 10px); top: 56%; width: 7px; height: 7px; border-radius: 50%; background: #FFD86B; box-shadow: 0 0 0 1px #B8862E; z-index: 2; }
.g1-doorbtn { background: transparent; border: none; padding: 5px; cursor: pointer; border-radius: 12px; transition: transform 0.15s ease; }
.g1-doorbtn:hover:not(:disabled) { transform: translateY(-3px); }
.g1-doorbtn.active .g1-door { border-color: #FF4F28; box-shadow: 0 0 0 3px #FFD3C7, inset 0 2px 0 rgba(255,255,255,0.18); }
.g1-doorbtn.seen .g1-door { border-color: #1F7A4D; }
.g1-doorbtn.used { opacity: 0.4; }
.g1-doorbtn.placed { opacity: 0.45; }
.g1-doorbtn:disabled { cursor: default; }

/* UY (svg) + hovli — ixcham (mobil + skrolsiz) */
.g1-house-svg { width: clamp(74px, 15.5vw, 104px); height: auto; display: block; }
/* mushukcha uy uchidan chiqadi (to'g'ri javobda) */
.g1-house-cat { animation: g1CatPop 0.55s cubic-bezier(0.34,1.5,0.6,1) both; }
@keyframes g1CatPop { 0% { transform: translateY(16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
.g1-housefig { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.g1-yard { display: flex; justify-content: center; }
.g1-s2house .g1-house-svg { width: clamp(80px, 16vw, 106px); }
/* s11 — har variant alohida qatorda: uy | buyumlar (gorizontal, predmetlar ko'rinadi) */
.g1-opt-house { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: clamp(14px, 3.4vw, 26px); width: 100%; padding-left: clamp(4px, 2vw, 16px); }
.g1-opt-house .g1-house-svg { width: clamp(56px, 13vw, 82px); flex: none; }
.g1-opt-house .g1-yard { flex: none; }
/* s9 — variant harfi (A/B/C), s15 dagidek */
.g1-opt-letter { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 1.6vw, 14px); font-weight: 700; color: #A7A6A2; min-width: 18px; flex: none; text-align: center; }
/* s9 — to'g'ri javobdan keyin uy raqami bilan ko'rinadi (markazda) */
.g1-opt-house-cel { justify-content: center; }

/* s8 / s9 — uy tugmalari: HAR UY ALOHIDA QATORDA, gorizontal (uy | predmetlar), chapga tekis */
.g1-houses { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 14px); }
.g1-housebtn { background: #FFFFFF; border: none; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); padding: clamp(8px, 1.8vw, 13px) clamp(14px, 3.4vw, 24px); display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: clamp(14px, 3.6vw, 28px); width: 100%; max-width: 460px; cursor: pointer; transition: all 0.2s; }
.g1-housebtn:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.g1-housebtn-ok { background: #E3F0E8; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32); }
.g1-housebtn-faded { opacity: 0.4; }
.g1-housebtn:disabled { cursor: default; }
.g1-housebtn .g1-house-svg { width: clamp(56px, 13vw, 82px); flex: none; }
.g1-housebtn .g1-yard { flex: none; }

/* s9 — juftlash tartibi */
.g1-match { display: flex; flex-direction: column; gap: clamp(12px, 2.4vw, 18px); }
.g1-match-digits { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); }
.g1-match-houses { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 14px); }

/* s5 — shakl belgisi */
.g1-feature { display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: clamp(120px, 24vw, 168px); justify-content: center; }
.g1-feature-txt { font-size: clamp(14px, 1.9vw, 17px); font-weight: 600; color: #FF4F28; }

/* s5 — KATAKLI DAFTAR (kletka) fonida raqam yoziladi */
.g1-krow { display: flex; flex-wrap: nowrap; justify-content: center; align-items: stretch; gap: clamp(6px, 1.8vw, 16px); width: 100%; }
.g1-kcell { position: relative; flex: 1 1 0; min-width: 0; max-width: clamp(98px, 17.5vw, 150px); aspect-ratio: 64 / 92; padding: 0; cursor: pointer; overflow: hidden; border: 2.5px solid #BFE0EC; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  background-color: #FBFEFF;
  background-image: linear-gradient(#D7EEF6 1.2px, transparent 1.2px), linear-gradient(90deg, #D7EEF6 1.2px, transparent 1.2px);
  background-size: clamp(18px, 4.4vw, 29px) clamp(18px, 4.4vw, 29px); }
.g1-kcell:hover:not(.active) { transform: translateY(-2px); }
.g1-kcell.active { border-color: #FF4F28; box-shadow: 0 0 0 2px #FFD3C7; }
.g1-kcell .g1-write { width: 100%; height: 100%; }
.g1-kcell-num { display: flex; align-items: center; justify-content: center; opacity: 0.5; }

/* s5 — raqamni YOZISH demosi (qizil chiziq pathLength bilan ketma-ket) */
.g1-write { width: clamp(86px, 19vw, 128px); height: auto; }
.g1-write-ghost { fill: none; stroke: #F2DDD3; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
.g1-write-ink { fill: none; stroke: #FF4F28; stroke-width: 8.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 100; }

/* summary — qo'shimcha "ko'rinishini bilasiz" qatori */
.g1-cando-sub { font-size: clamp(13px, 1.7vw, 15px); color: #1F7A4D; font-weight: 600; margin: 6px 0 0; }

/* s2 — joylash katakchalari */
.g1-tapgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(8px, 1.6vw, 12px); }
.g1-tapcell { position: relative; background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 14px; width: clamp(50px, 10vw, 64px); height: clamp(50px, 10vw, 64px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease; }
.g1-tapcell svg { width: 64%; height: 64%; opacity: 0.5; transition: opacity 0.2s ease; }
.g1-tapcell.on { border-color: #1F7A4D; background: #EFF7F1; }
.g1-tapcell.on svg { opacity: 1; }
.g1-tapcell-tag { position: absolute; top: 2px; right: 5px; font-size: 12px; color: #1F7A4D; font-weight: 700; }
.g1-tapcell:disabled { cursor: default; }

/* sd — o'yin: uy oldiga buyum torting */
.g1-collecthouse { position: relative; display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); padding: clamp(8px, 1.8vw, 14px); border-radius: 18px; border: 2px dashed #D8CFBF; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-collecthouse.g1-dropzone { background: #FCF7EE; }
.g1-yard-drop { min-height: clamp(40px, 8vw, 54px); align-items: center; }

/* KO'CHA sahnasi — fon + ustiga uylar/personajlar (proporsiya qulflangan) */
.g1-street { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 400 / 218; container-type: size; border-radius: 14px; overflow: hidden; }
.g1-street-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.g1-street-houses { position: absolute; left: 2%; right: 2%; bottom: 13%; display: flex; justify-content: center; align-items: flex-end; gap: 1cqw; }
.g1-street-house { opacity: 0; transform: translateY(8%); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-street-house.in { opacity: 1; transform: none; }
.g1-street-house .g1-house-svg { width: 18cqw; }   /* baland 2-qavatli uy: eshik odam bo'yidan baland */
.g1-street-target .g1-house-svg { filter: drop-shadow(0 0 7px rgba(255,79,40,0.8)); }
.g1-street-anvar, .g1-street-rano { position: absolute; display: flex; flex-direction: column; align-items: center; opacity: 0; transition: opacity 0.5s ease; z-index: 3; }
.g1-street-anvar.in, .g1-street-rano.in { opacity: 1; }
/* personajlar OLD PLANDA, kichik (eshik bo'yida) — real proporsiya + chuqurlik */
.g1-street-anvar { left: 6%; bottom: 0; }
.g1-street-rano { left: 46%; right: auto; bottom: 6%; }   /* 5-uy o'rtada -> Ra'no markazda, o'z eshigi oldida */
.g1-street-anvar .g1-char, .g1-street-rano .g1-char { width: 6cqw; height: auto; }
.g1-street .g1-cast-name { display: none; }
.g1-street-final .g1-street-anvar { left: 28%; right: auto; bottom: 0; }   /* final: Anvar markazdan 5-uy (o'ng) tomon yuradi, Ra'no bilan tig'iz emas */
/* Anvar YURIB keladi (chapdan o'z joyiga) */
@keyframes g1WalkIn {
  0%   { transform: translateX(-260%) translateY(0)    rotate(0deg); }
  18%  { transform: translateX(-205%) translateY(-5%)  rotate(2.5deg); }
  36%  { transform: translateX(-150%) translateY(0)    rotate(-2.5deg); }
  54%  { transform: translateX(-100%) translateY(-5%)  rotate(2.5deg); }
  72%  { transform: translateX(-55%)  translateY(0)    rotate(-2.5deg); }
  88%  { transform: translateX(-16%)  translateY(-3%)  rotate(1.5deg); }
  100% { transform: translateX(0)     translateY(0)    rotate(0deg); }
}
.g1-street-anvar.in { animation: g1WalkIn 2.6s ease-out both; }

/* final / summary — rasm + matn YONMA-YON (skrolsiz) */
.g1-final-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(12px, 2.6vw, 22px); width: 100%; }
.g1-final-row .g1-final-street { flex: 1 1 280px; max-width: 420px; }
.g1-final-row .g1-handfact { flex: 1 1 200px; max-width: 320px; display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-sum-row { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(12px, 2.6vw, 22px); }
.g1-sum-row .g1-final-street { flex: 1 1 300px; max-width: 440px; }
.g1-sum-col { flex: 1 1 240px; min-width: 230px; display: flex; flex-direction: column; gap: clamp(10px, 2vw, 14px); }
.g1-final-street { width: 100%; max-width: 440px; margin: 0 auto; }

/* s11 — final fakt: 1-5 raqamlari qatori */
.g1-factdigits { display: flex; justify-content: center; gap: clamp(6px, 1.6vw, 12px); }
.g1-handfact-txt { font-size: clamp(13px, 1.7vw, 15px); color: #3A3530; line-height: 1.4; text-align: center; margin: 0; }

/* summary — ball + bog'lanishlar */
.g1-score { font-size: clamp(18px, 2.6vw, 24px); font-weight: 800; color: #1F7A4D; margin: 6px 0 0; }
.g1-conn { display: flex; flex-direction: column; gap: 8px; }
.g1-conn-title { font-size: clamp(14px, 1.8vw, 16px); font-weight: 800; color: #3A3530; margin: 0 0 2px; }
.g1-conn-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.g1-conn-tag { font-size: clamp(11px, 1.4vw, 13px); font-weight: 700; padding: 3px 10px; border-radius: 99px; white-space: nowrap; }
.g1-conn-ref { background: #EAF6FB; color: #017CA3; }
.g1-conn-next { background: #FFF1EC; color: #D63E18; }
.g1-conn-txt { font-size: clamp(13px, 1.7vw, 15px); color: #5A5A60; }

@media (prefers-reduced-motion: reduce) {
  .g1-scatter-d { animation: none; }
  .g1-street-house, .g1-street-anvar, .g1-street-rano { transition: none; }
  .g1-street-anvar.in { animation: none; }
  .g1-house-cat { animation: none; }
}

`;
