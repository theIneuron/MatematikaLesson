import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ============================================================================
// ░░ 1-SINF · Dars05 — "Sonning tarkibi 2–5" (num-1-05-v1) · syujet:
// Anvar Ra'noga beshta olma keltiradi; "5 faqat 5" da'vosi — sonni qizil va yashil ikki
// qismga bo'lib ko'rsatish (2 dan 5 gacha sonlar tarkibi). Oxirida Anvar tan oladi:
// sonni ko'p xil ikki qismdan tuzsa bo'larkan. ░░
// Infratuzilma + ETALON KIT (personaj/sahna/Bit-kartochka) oldingi 1-sinf darslaridan
// BYTE-FOR-BYTE ko'chirildi.
// YANGI vizualizatorlar (Dars05): BondFrame (ikki rangli ten-frame), NumberBond (qism-butun),
// PairCard (juftlar), BondAuto (avto-aylanuvchi tarkib), Domino (fakt).
//
// Cast: Bit (boshlovchi) + Ra'no + Anvar. Yangi personaj yo'q.
// ETALON KIT bloklari Dars03 dan o'zgarishsiz (grep: "ETALON KIT ·").
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
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'f' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// Slaydlararo o'tish blokirovkasi (production): "Davom" javob/ovoz tugagach ochiladi,
// javob faqat ovoz tugagach tanlanadi. (Test paytida vaqtincha true qilingan edi.)
const FREE_NAV = true; // TEST — slayd gating O'CHIRILGAN (ishlab chiqarishdan oldin false ga qaytaring)

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
      .replace(/\s{2,}/g, ' ')
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
    this.gender = 'f';
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
    engine.setGender(ttsConfig.voiceGender || 'f');
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
                   size === 'mid' ? 'clamp(24px, 5vw, 34px)' :
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

const NavNext = ({ disabled, label, onClick }) => (
  <button className="btn-white-accent" disabled={FREE_NAV ? false : disabled} onClick={onClick}
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

// ============================================================
// QUESTION SCREEN — универсальный MC-компонент под формат audio: { intro, on_correct, on_wrong }
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure, celebrateOnCorrect, mascot = true }) => {
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
  const factRef = useRevealScroll(solved && !!factOnCorrect, 900);   // feedback skrollidan keyin fakt ham ko'rinadi
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
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {options.map((opt, i) => {
            const isWrongPicked = wrong.has(i);
            const cls = `option${isWrongPicked ? ' option-picked-wrong' : ''}`;
            const disabled = isWrongPicked || !canAns;   // ovoz tugamaguncha + погашенный неверный
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(16px, 2.1vw, 18px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', gap: 12 }}>
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
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(16px, 2.1vw, 18px)', minHeight: 'clamp(48px, 7vw, 58px)', minWidth: 'clamp(120px, 40vw, 220px)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="mono small" style={{ minWidth: 20, color: T.success }}>✓</span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>{options[correctIdx]}</span>
            </button>
          </div>
        )}
        {solved && celebrateOnCorrect && <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>{typeof celebrateOnCorrect === 'function' ? celebrateOnCorrect() : celebrateOnCorrect}</div>}
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <Reaction state={solved ? 'correct' : 'wrong'} praise={solved ? praiseWord : encWord} mascot={mascot}/>
        </FeedbackBlock>
        {solved && factOnCorrect && <div ref={factRef}>{factOnCorrect}</div>}
      </div>
    </Stage>
  );
};

// ============================================================
// --- POD UROK: num_1_05 — Sonning tarkibi 2–5 (1-sinf, Dars05) ---
// 1-sinf (6–7 yosh): ovoz yetakchi kanal, typing YO'Q (tap/drag), concrete ustun,
// bar model YO'Q. Manba: 1sinf_metodologiya.md (§4, §5.2, §7 Б1) + DIZAYN_STANDART_1SINF.md.
// Misconception'lar: M1 sonni faqat bitta usulda ikkiga bo'lish mumkin deb o'ylash · M2 qismni butun bilan adashtirish · M3 qismlarni birga sanamaslik.
// ============================================================

const TOTAL_SCREENS = 17;
const LESSON_META = {
  lessonId: 'num-1-05-v1',
  lessonTitle: { ru: 'Состав числа 2–5', uz: "Sonning tarkibi 2–5" }
};
const SCREEN_META = [
  { id: 'sIntro', type: 'hook',        template: 'custom',   scored: false, scope: null },            // hikoya: Anvar 5 olma bilan, "5 faqat 5" da'vosi
  { id: 's0',     type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // jumboq: 5 ni necha xil ikki guruhga bo'lish mumkin?
  { id: 's1',     type: 'exploration', template: 'custom',   scored: false, scope: null },            // tap-to-fill: 5 ramkasini qizil/yashil bilan to'ldirish
  { id: 's2',     type: 'exploration', template: 'custom',   scored: false, scope: null },            // berk qism: 3 qizil ochiq, qolgani berk -> ochib topish
  { id: 's3',     type: 'rule',        template: 'custom',   scored: false, scope: null },            // qoida: son ikki qismdan (avto-aylanuvchi juftlar)
  { id: 's4',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 5 = 3 va ?
  { id: 's5',     type: 'exploration', template: 'custom',   scored: false, scope: null },            // yangi son 4: tap-to-fill splitlari
  { id: 's6',     type: 'rule',        template: 'custom',   scored: false, scope: null },            // qoida: o'rin almashinuvi (avto rang almashinuvi)
  { id: 's7',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // 4 = ? va 1
  { id: 's8',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // ha/yo'q: 3 qizil va 1 yashil birga 5mi? (yo'q, 4)
  { id: 's9',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // qaysi juft birga 5 ni beradi?
  { id: 's10',    type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },  // juftlash: qizil qism -> yetishmagan yashil son (5 gacha)
  { id: 'sDrill', type: 'exploration', template: 'custom',   scored: false, scope: null },            // trenirovka: 6 mashq ketma-ket (yetishmagan qism), ball yo'q
  { id: 'sd',     type: 'exploration', template: 'custom',   scored: false, scope: null },            // mini-o'yin: maqsadli raundlar — qizil yasang (tap, ball yo'q)
  { id: 'sGuest', type: 'hook',        template: 'custom',   scored: false, scope: null },            // ko'prik: Anvar tan oladi (5 ni ko'p xil yasasa bo'larkan)
  { id: 's11',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // final: 5 = 2 va ? + fakt
  { id: 's12',    type: 'summary',     template: 'custom',   scored: false, scope: null }             // yakun + can-do + ConnectionsBlock
];

// Sonlar — so'z bilan (audioda raqam emas, so'z). Indeks = son.
const NUM_WORDS = {
  ru: ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять'],
  uz: ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz", "o'n"]
};

// Fisher-Yates (saqlangan kit GameDrill ishlatadi).
const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };

const CONTENT = {
  // ---- sIntro HIKOYA — Bit boshlovchi; Anvar 5 olma bilan, "5 faqat 5" da'vosi ----
  sIntro: {
    eyebrow: { ru: 'История', uz: 'Hikoya' },
    title: { ru: 'Анвар и пять яблок', uz: 'Anvar va beshta olma' },
    bit_label: { ru: 'Бит', uz: 'Bit' },
    rano_label: { ru: 'Рано', uz: "Ra'no" },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    audio: {
      ru: [
        'Привет, друг! Анвар принёс Рано пять яблок.',
        'Анвар думает так. Пять это пять, и показать его можно только одним способом.',
        'А Рано хочет разделить яблоки на красные и зелёные. Вдруг способов больше одного. Слушай до конца и нажимай дальше.'
      ],
      uz: [
        "Salom, do'stim! Anvar Ra'noga beshta olma olib keldi.",
        "Anvar shunday o'ylaydi. Besh. Bu besh, uni faqat bitta yo'l bilan ko'rsatsa bo'ladi.",
        "Ra'no esa olmalarni qizil va yashilga ajratib ko'rmoqchi. Balki yo'l bittadan ko'pdir. Oxirigacha tinglang va davom bosing."
      ]
    }
  },

  // ---- s0 HOOK — jumboq: 5 ni necha xil ikki guruhga bo'lish mumkin? (to'g'ri javob yo'q) ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title_part1: { ru: 'Пять яблок на', uz: 'Beshta olmani' },
    title_part2_em: { ru: 'две части', uz: 'ikki qismga' },
    title_part3: { ru: '. Сколько способов?', uz: ". Necha xil yo'l bilan?" },
    question: { ru: 'Как думаешь — способ один или их много? Нажми ответ.', uz: "Sizningcha — yo'l bittami yoki ko'pmi? Javobni bosing." },
    opt0: { ru: 'Только один', uz: 'Faqat bitta' },
    opt1: { ru: 'Их много', uz: "Ko'p" },
    opt2: { ru: 'Сейчас узнаю', uz: 'Hozir bilib olaman' },
    audio: {
      intro: {
        ru: 'Пять яблок можно разделить на две части. Анвар думает, что способ только один. А как считаешь ты, способ один или их много? Нажми любой ответ.',
        uz: "Beshta olmani ikki qismga ajratish mumkin. Anvar bitta yo'l bor deb o'ylaydi. Sizningcha-chi, yo'l bittami yoki ko'pmi? Qaysi javob bo'lsa ham bosing."
      },
      on_correct: { ru: 'Хорошо. Сейчас разложим яблоки и посмотрим.', uz: "Yaxshi. Endi olmalarni ajratib ko'ramiz." },
      on_wrong: { ru: 'Хорошо. Сейчас разложим яблоки и посмотрим.', uz: "Yaxshi. Endi olmalarni ajratib ko'ramiz." }
    }
  },

  // ---- s1 EXPLORATION — tap-to-fill: 5 ramkasini qizil bilan to'ldirish, qolgani yashil ----
  s1: {
    eyebrow: { ru: 'Пробуем', uz: "Sinab ko'ramiz" },
    instruction: { ru: 'Нажимай на яблоки — они станут красными. Остальные останутся зелёными', uz: "Olmalarni bosing — ular qizil bo'ladi. Qolganlari yashil bo'lib qoladi" },
    done_text: { ru: 'Видишь? Пять. Это красные и зелёные вместе. Частей бывает по-разному.', uz: "Ko'rdingizmi? Besh. Bu qizil va yashil birga. Qismlar har xil bo'ladi." },
    done_audio: { ru: 'Видишь? Пять. Это красные и зелёные вместе. Частей бывает по-разному.', uz: "Ko'rdingizmi? Besh. Bu qizil va yashil birga. Qismlar har xil bo'ladi." },
    audio: {
      ru: [
        'Здесь пять яблок. Нажимай на яблоко, оно станет красным.',
        'Сколько яблок ты не тронул, столько останется зелёных. Красные и зелёные вместе всегда пять.'
      ],
      uz: [
        "Bu yerda beshta olma bor. Olmani bosing, olma qizil bo'ladi.",
        "Nechta olmani bosmasangiz, shuncha yashil qoladi. Qizil va yashil birga doim besh."
      ]
    }
  },

  // ---- s2 EXPLORATION — berk qism: 3 qizil ochiq, qolgani berk -> ochib topish ----
  s2: {
    eyebrow: { ru: 'Закрытая часть', uz: 'Berk qism' },
    instruction: { ru: 'Три яблока красные. Всего пять. Угадай, сколько зелёных закрыто, и открой', uz: "Uchta olma qizil. Hammasi besh. Nechta yashil berk — toping va oching" },
    done_text: { ru: 'Открыли! Два зелёных. Пять. Это три и ещё два.', uz: "Ochdik! Ikkita yashil. Besh. Bu uch va yana ikki." },
    audio: {
      ru: [
        'Три яблока уже красные. А всего у нас пять.',
        'Значит, зелёные яблоки спрятались. Сколько их? Открой и проверь. Пять это три и ещё два.'
      ],
      uz: [
        "Uchta olma qizil bo'ldi. Hammasi esa beshta.",
        "Demak, yashil olmalar yashiringan. Ular nechta? Oching va tekshiring. Besh. Bu uch va yana ikki."
      ]
    }
  },

  // ---- s3 RULE — son ikki qismdan (avto-aylanuvchi juftlar) ----
  s3: {
    eyebrow: { ru: 'Запомним', uz: 'Eslab qolamiz' },
    title_part1: { ru: 'Число — это', uz: 'Son — bu' },
    title_part2_em: { ru: 'две части вместе', uz: 'ikki qism birga' },
    tip: {
      ru: 'Пять — это один и четыре, два и три, три и два, четыре и один. Части разные, а вместе всегда пять.',
      uz: "Besh — bu bir va to'rt, ikki va uch, uch va ikki, to'rt va bir. Qismlar har xil, birga esa doim besh."
    },
    audio: {
      ru: 'Любое число можно разделить на две части. Смотри. Одно красное и четыре зелёных. Два красных и три зелёных. Три красных и два зелёных. Части меняются, а вместе всегда пять.',
      uz: "Har qanday sonni ikki qismga bo'lish mumkin. Qarang. Bir qizil va to'rt yashil. Ikki qizil va uch yashil. Uch qizil va ikki yashil. Qismlar o'zgaradi, birga esa doim besh."
    }
  },

  // ---- s4 TEST MC — 5 = 3 va ? · plitalar [5,3,2,4], to'g'ri = ikki (idx2) ----
  s4: {
    eyebrow: { ru: 'Тренировка · 1 / 6', uz: 'Mashq · 1 / 6' },
    title: { ru: 'Три яблока красные. Всего пять. Сколько зелёных?', uz: "Uchta olma qizil. Hammasi besh. Nechta yashil?" },
    correct_text: { ru: 'Верно. Три и ещё два. Это пять.', uz: "To'g'ri. Uch va yana ikki. Bu besh." },
    wrong_0: {
      ru: 'Пять. Это всё вместе. Это не одна часть. Часть меньше целого.',
      uz: "Besh. Bu hammasi birga. Bu bitta qism emas. Qism butundan kichik."
    },
    wrong_1: {
      ru: 'Столько уже красных. Зелёных другое число. Считай от трёх до пяти.',
      uz: "Bu qizil olmalar soni. Yashillari boshqa son. Uchdan beshgacha sanang."
    },
    wrong_3: {
      ru: 'Это на одну больше. Посчитай по порядку от трёх до пяти.',
      uz: "Bu bittaga ko'p. Uchdan beshgacha tartib bilan sanang."
    },
    wrong_default: {
      ru: 'Не совсем. Считай от трёх до пяти и узнаешь, сколько зелёных.',
      uz: "Unchalik emas. Uchdan beshgacha sanang va nechta yashil ekanini bilasiz."
    },
    audio: {
      intro: { ru: 'Три яблока красные. Всего пять. Сколько яблок зелёные? Нажми число.', uz: "Uchta olma qizil. Hammasi besh. Nechta olma yashil? Sonni bosing." },
      on_correct: { ru: 'Верно. Их две.', uz: "To'g'ri. Ular ikkita." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana sanang." }
    }
  },

  // ---- s5 EXPLORATION — yangi son 4: tap-to-fill splitlari ----
  s5: {
    eyebrow: { ru: 'Другое число', uz: 'Boshqa son' },
    instruction: { ru: 'Теперь яблок четыре. Нажимай — красные и зелёные, а вместе четыре', uz: "Endi olma to'rtta. Bosing — qizil va yashil, birga esa to'rt" },
    done_text: { ru: 'Четыре тоже состоит из частей. Один и три, два и два, три и один.', uz: "To'rt ham qismlardan iborat. Bir va uch, ikki va ikki, uch va bir." },
    done_audio: { ru: 'Четыре тоже состоит из частей. Один и три, два и два, три и один.', uz: "To'rt ham qismlardan iborat. Bir va uch, ikki va ikki, uch va bir." },
    audio: {
      ru: [
        'Не только пять состоит из частей. Возьмём четыре яблока.',
        'Нажимай и смотри. Красные и зелёные вместе всегда четыре.'
      ],
      uz: [
        "Faqat besh emas, har son qismlardan iborat. To'rtta olmani olamiz.",
        "Bosing va qarang. Qizil va yashil birga doim to'rt."
      ]
    }
  },

  // ---- s6 RULE — o'rin almashinuvi (avto rang almashinuvi) ----
  s6: {
    eyebrow: { ru: 'Запомним', uz: 'Eslab qolamiz' },
    title_part1: { ru: 'Поменяй части местами —', uz: 'Qismlarni almashtiring —' },
    title_part2_em: { ru: 'число не изменится', uz: "son o'zgarmaydi" },
    tip: {
      ru: 'Два красных и три зелёных — это пять. Три красных и два зелёных — тоже пять. Части поменялись, а всего столько же.',
      uz: "Ikki qizil va uch yashil — bu besh. Uch qizil va ikki yashil — ham besh. Qismlar almashdi, hammasi esa o'sha."
    },
    audio: {
      ru: 'Смотри на яблоки. Два красных и три зелёных, вместе пять. Теперь поменяем местами. Три красных и два зелёных, снова пять. Части можно менять местами, число от этого не меняется.',
      uz: "Olmalarga qarang. Ikki qizil va uch yashil, birga besh. Endi o'rin almashtiramiz. Uch qizil va ikki yashil, yana besh. Qismlarni almashtirsa bo'ladi, son bundan o'zgarmaydi."
    }
  },

  // ---- s7 TEST MC — 4 = ? va 1 · plitalar [3,4,1,2], to'g'ri = uch (idx0) ----
  s7: {
    eyebrow: { ru: 'Тренировка · 2 / 6', uz: 'Mashq · 2 / 6' },
    title: { ru: 'Одно яблоко зелёное. Всего четыре. Сколько красных?', uz: "Bitta olma yashil. Hammasi to'rt. Nechta qizil?" },
    correct_text: { ru: 'Верно. Три и ещё одно. Это четыре.', uz: "To'g'ri. Uch va yana bir. Bu to'rt." },
    wrong_1: {
      ru: 'Четыре. Это всё вместе. Это не одна часть. Часть меньше целого.',
      uz: "To'rt. Bu hammasi birga. Bu bitta qism emas. Qism butundan kichik."
    },
    wrong_2: {
      ru: 'Столько зелёных. Красных другое число. Считай от одного до четырёх.',
      uz: "Bu yashil olmalar soni. Qizillari boshqa son. Birdan to'rtgacha sanang."
    },
    wrong_3: {
      ru: 'Это на одну меньше. Посчитай по порядку от одного до четырёх.',
      uz: "Bu bittaga kam. Birdan to'rtgacha tartib bilan sanang."
    },
    wrong_default: {
      ru: 'Не совсем. Считай от одного до четырёх и узнаешь, сколько красных.',
      uz: "Unchalik emas. Birdan to'rtgacha sanang va nechta qizil ekanini bilasiz."
    },
    audio: {
      intro: { ru: 'Одно яблоко зелёное. Всего четыре. Сколько яблок красные? Нажми число.', uz: "Bitta olma yashil. Hammasi to'rt. Nechta olma qizil? Sonni bosing." },
      on_correct: { ru: 'Верно. Их три.', uz: "To'g'ri. Ular uchta." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana sanang." }
    }
  },

  // ---- s8 TEST ha/yo'q — 3 qizil + 1 yashil birga 5mi? (yo'q, bu 4). To'g'ri = Yo'q (idx1) ----
  s8: {
    eyebrow: { ru: 'Тренировка · 3 / 6', uz: 'Mashq · 3 / 6' },
    title: { ru: 'Три красных и одно зелёное. Бит говорит: вместе пять. Это верно?', uz: "Uch qizil va bitta yashil. Bit aytadi: birga besh. Bu to'g'rimi?" },
    opt0: { ru: 'Да, верно', uz: "Ha, to'g'ri" },
    opt1: { ru: 'Нет, неверно', uz: "Yo'q, noto'g'ri" },
    correct_text: { ru: 'Верно. Здесь три и одно. Это четыре, а не пять.', uz: "To'g'ri. Bu yerda uch va bir, to'rt, besh emas." },
    wrong_0: {
      ru: 'Посчитай вместе. Три и ещё одно, четыре. До пяти не хватает одного.',
      uz: "Birga sanang. Uch va yana bir, to'rt. Beshgacha bittasi yetmaydi."
    },
    wrong_default: {
      ru: 'Посчитай обе части вместе. Получится четыре, а не пять.',
      uz: "Ikkala qismni birga sanang. To'rt chiqadi, besh emas."
    },
    audio: {
      intro: { ru: 'Здесь три красных и одно зелёное яблоко. Бит говорит, что вместе пять. Посчитай и нажми да или нет.', uz: "Bu yerda uch qizil va bitta yashil olma bor. Bit birga besh deydi. Sanang va ha yoki yo'q bosing." },
      on_correct: { ru: 'Верно. Это четыре.', uz: "To'g'ri. Bu to'rt." },
      on_wrong: { ru: 'Не совсем. Посчитай обе части.', uz: "Unchalik emas. Ikkala qismni sanang." }
    }
  },

  // ---- s9 TEST MC — qaysi juft birga 5? juftlar [(2,2),(2,3),(3,3),(1,2)], to'g'ri = idx1 ----
  s9: {
    eyebrow: { ru: 'Тренировка · 4 / 6', uz: 'Mashq · 4 / 6' },
    title: { ru: 'У какой пары вместе ровно пять?', uz: "Qaysi juftda birga aniq besh bor?" },
    correct_text: { ru: 'Верно. Два и три. Это ровно пять.', uz: "To'g'ri. Ikki va uch, aniq besh." },
    wrong_0: {
      ru: 'Здесь вместе четыре. До пяти не хватает одного. Посчитай обе части.',
      uz: "Bu yerda birga to'rt. Beshgacha bittasi yetmaydi. Ikkala qismni sanang."
    },
    wrong_2: {
      ru: 'Здесь вместе шесть. Это на один больше пяти. Посчитай обе части.',
      uz: "Bu yerda birga olti. Bu beshdan bittaga ko'p. Ikkala qismni sanang."
    },
    wrong_3: {
      ru: 'Здесь вместе только три. До пяти не хватает двух. Посчитай обе части.',
      uz: "Bu yerda birga atigi uch. Beshgacha ikkitasi yetmaydi. Ikkala qismni sanang."
    },
    wrong_default: {
      ru: 'Не совсем. Считай обе части вместе и ищи пять.',
      uz: "Unchalik emas. Ikkala qismni birga sanang va beshni qidiring."
    },
    audio: {
      intro: { ru: 'Перед тобой четыре пары. Найди ту, где красные и зелёные вместе ровно пять. Посчитай и нажми.', uz: "Oldingizda to'rtta juft bor. Qizil va yashil birga aniq besh bo'lgan juftni toping. Sanang va bosing." },
      on_correct: { ru: 'Верно. Вместе пять.', uz: "To'g'ri. Birga besh." },
      on_wrong: { ru: 'Не совсем. Посчитай обе части.', uz: "Unchalik emas. Ikkala qismni sanang." }
    }
  },

  // ---- s10 TEST juftlash — qizil qism -> yetishmagan yashil son (besh gacha) ----
  s10: {
    eyebrow: { ru: 'Тренировка · 5 / 6', uz: 'Mashq · 5 / 6' },
    instruction: { ru: 'Сколько зелёных не хватает до пяти? Нажми число, потом его яблоки', uz: "Beshgacha nechta yashil yetishmaydi? Sonni bosing, keyin uning olmalarini bosing" },
    correct_text: { ru: 'Верно. Вместе ровно пять.', uz: "To'g'ri. Birga aniq besh." },
    done_text: { ru: 'Молодец! Каждая часть нашла свою пару до пяти.', uz: "Barakalla! Har qism beshgacha o'z juftini topdi." },
    wrong_default: { ru: 'Здесь вместе не пять. Посчитай красные и подбери зелёные до пяти.', uz: "Bu yerda birga besh emas. Qizillarni sanang va beshgacha yashilni toping." },
    audio: {
      intro: { ru: 'У каждой части свои красные яблоки. Подбери, сколько зелёных не хватает до пяти. Сначала нажми число, потом его яблоки.', uz: "Har qismda qizil olmalar bor. Beshgacha nechta yashil yetishmasligini toping. Avval sonni bosing, keyin uning olmalarini bosing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не совсем. Посчитай до пяти.', uz: "Unchalik emas. Beshgacha sanang." }
    }
  },

  // ---- sDrill TRENIROVKA — 6 mashq ketma-ket (yetishmagan qism), ball yo'q ----
  sDrill: {
    eyebrow: { ru: 'Тренировка', uz: 'Trenirovka' },
    instruction: { ru: 'Сколько яблок закрыто? Найди и нажми число', uz: "Nechta olma berk? Toping va sonni bosing" },
    correct_text: { ru: 'Верно, дальше.', uz: "To'g'ri, davom eting." },
    done_text: { ru: 'Молодец! Ты прошёл всю тренировку.', uz: "Barakalla! Butun trenirovkani o'tdingiz." },
    wrong_default: { ru: 'Не совсем. Посчитай, сколько закрыто до всех.', uz: "Unchalik emas. Berk olmalarni hammasigacha sanang." },
    audio: {
      intro: { ru: 'Небольшая тренировка. Часть яблок видна, часть закрыта. Посчитай, сколько закрыто, и нажми число.', uz: "Kichik trenirovka. Olmaning bir qismi ko'rinadi, bir qismi berk. Nechta berk ekanini sanang va sonni bosing." }
    }
  },

  // ---- sd MINI-O'YIN — maqsadli raundlar: qizil yasang (tap, ball yo'q). Ikki rang ham shart. ----
  sd: {
    eyebrow: { ru: 'Игра', uz: "O'yin" },
    instruction: { ru: 'Сделай столько красных, сколько просит Бит. Остальные станут зелёными', uz: "Bit so'ragancha olmani qizil qiling. Qolgani yashil bo'ladi" },
    target_label: { ru: 'Сделай красных', uz: 'Qizil yasang' },
    correct_text: { ru: 'Верно! Получилось.', uz: "To'g'ri! Bo'ldi." },
    done_text: { ru: 'Молодец! Ты сделал все.', uz: "Barakalla! Hammasini yasadingiz." },
    retry_audio: { ru: 'Сделай столько красных, сколько просят.', uz: "So'ralgancha qizil olma yasang." },
    audio: {
      intro: { ru: 'Поиграем. Бит просит сделать несколько красных яблок. Нажимай. Яблоко станет красным, остальные будут зелёными.', uz: "O'ynaymiz. Bit bir nechta qizil olma so'raydi. Bosing. Olma qizil bo'ladi, qolgani yashil bo'ladi." }
    }
  },

  // ---- sGuest KO'PRIK — Anvar tan oladi (5 ni ko'p xil yasasa bo'larkan) ----
  sGuest: {
    eyebrow: { ru: 'Возвращаемся к Анвару', uz: 'Anvarga qaytamiz' },
    title: { ru: 'Анвар передумал', uz: "Anvar fikrini o'zgartirdi" },
    rano_label: { ru: 'Рано', uz: "Ra'no" },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    audio: {
      ru: [
        'Помнишь, в начале Анвар думал, что пять можно показать только одним способом?',
        'Теперь он сам разделил яблоки по-разному. Один и четыре. Два и три. Три и два.',
        'Анвар понял. У числа много частей. Осталось одно задание.'
      ],
      uz: [
        "Esingizdami, boshida Anvar besh faqat bitta yo'l bilan ko'rsatiladi deb o'ylagandi?",
        "Endi u olmalarni o'zi turlicha ajratdi. Bir va to'rt. Ikki va uch. Uch va ikki.",
        "Anvar tushundi. Son ko'p qismdan iborat. Bitta topshiriq qoldi."
      ]
    }
  },

  // ---- s11 TEST final + FAKT — 5 = 2 va ? · plitalar [2,5,4,3], to'g'ri = uch (idx3) ----
  s11: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    title: { ru: 'Два яблока красные. Всего пять. Сколько зелёных?', uz: "Ikkita olma qizil. Hammasi besh. Nechta yashil?" },
    correct_text: { ru: 'Верно. Два и ещё три. Это пять.', uz: "To'g'ri. Ikki va yana uch. Bu besh." },
    wrong_0: {
      ru: 'Столько уже красных. Зелёных другое число. Считай от двух до пяти.',
      uz: "Bu qizil olmalar soni. Yashillari boshqa son. Ikkidan beshgacha sanang."
    },
    wrong_1: {
      ru: 'Пять. Это всё вместе. Это не одна часть. Часть меньше целого.',
      uz: "Besh. Bu hammasi birga. Bu bitta qism emas. Qism butundan kichik."
    },
    wrong_2: {
      ru: 'Это на одну больше. Посчитай по порядку от двух до пяти.',
      uz: "Bu bittaga ko'p. Ikkidan beshgacha tartib bilan sanang."
    },
    wrong_default: {
      ru: 'Не совсем. Считай от двух до пяти и узнаешь, сколько зелёных.',
      uz: "Unchalik emas. Ikkidan beshgacha sanang va nechta yashil ekanini bilasiz."
    },
    fact_badge: { ru: 'А знаешь? · Игра', uz: "Bilasizmi? · O'yin" },
    fact_text: {
      ru: 'На косточке домино всегда две части с точками. Сложишь их — получишь число косточки. Кто помнит состав числа, тот играет быстрее.',
      uz: "Domino toshida doim ikki qism — nuqtalar bor. Ularni qo'shsangiz, tosh soni chiqadi. Sonning tarkibini bilgan tezroq o'ynaydi."
    },
    fact_audio: {
      ru: 'А знаешь, на косточке домино всегда две части с точками. Сложишь их и получишь число косточки.',
      uz: "Bilasizmi, domino toshida doim ikkita nuqtali qism bor. Ularni qo'shsangiz, tosh soni chiqadi."
    },
    audio: {
      intro: { ru: 'Последнее задание. Два яблока красные. Всего пять. Сколько яблок зелёные? Нажми число.', uz: "Oxirgi topshiriq. Ikkita olma qizil. Hammasi besh. Nechta olma yashil? Sonni bosing." },
      on_correct: { ru: 'Верно. Их три.', uz: "To'g'ri. Ular uchta." },
      on_wrong: { ru: 'Не совсем. Посчитай от двух до пяти.', uz: "Unchalik emas. Ikkidan beshgacha sanang." }
    }
  },

  // ---- s12 SUMMARY — can-do + ConnectionsBlock ----
  s12: {
    eyebrow: { ru: 'Готово', uz: 'Tayyor' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    main_1: { ru: 'Теперь ты', uz: 'Endi siz' },
    main_2_em: { ru: 'умеешь делить число на две части', uz: "sonni ikki qismga bo'lishni bilasiz" },
    rano_label: { ru: 'Рано', uz: "Ra'no" },
    anvar_label: { ru: 'Анвар', uz: 'Anvar' },
    connections_title: { ru: 'Что дальше', uz: 'Keyin nima' },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'Сравнение чисел до 10', uz: "10 gacha sonlarni taqqoslash" },
    conn_label_next: { ru: 'Следующий урок', uz: 'Keyingi dars' },
    conn_next: { ru: 'Состав числа 6–10.', uz: "Son tarkibi 6–10." },
    audio: {
      ru: 'Сегодня Анвар увидел, что пять можно разделить по-разному. А ты научился делить числа от двух до пяти на две части и запомнил: части бывают разные, а всего остаётся столько же. На следующем уроке будем составлять числа от шести до десяти. Молодец!',
      uz: "Bugun Anvar beshni turlicha ajratish mumkinligini ko'rdi. Siz esa ikkidan beshgacha sonlarni ikki qismga bo'lishni o'rgandingiz va eslab qoldingiz: qismlar har xil, hammasi esa o'sha bo'lib qoladi. Keyingi darsda oltidan o'ngacha sonlarni tuzamiz. Barakalla!"
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
  cherry: <g><path d="M20 12 Q21.5 20 20 27" stroke="#3E7D2A" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M19 12 Q24 4 31.5 7.5 Q25.5 13 19 12 Z" fill="#3E9B3A"/><path d="M20.5 11 Q24.5 9 29 11" stroke="#2C7A2E" strokeWidth="0.8" fill="none" strokeLinecap="round"/><circle cx="20" cy="28" r="9" fill="url(#g1chrG)"/><ellipse cx="16.5" cy="24.5" rx="2.4" ry="3.4" fill="rgba(255,255,255,0.6)" transform="rotate(-18 16.5 24.5)"/><circle cx="15.5" cy="22.5" r="1.4" fill="rgba(255,255,255,0.72)"/></g>
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
      {/* idle — ikkala qo'l pastga osilgan, qo'lda HECH NARSA yo'q (yerdagi savat yetarli) */}
      {pose === 'idle' && (
        <g>
          <path d="M52 60 Q46 78 44 95" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="44" cy="96" r="4.6" fill="url(#g1askin)"/>
          <path d="M78 60 Q84 78 86 95" stroke="url(#g1askin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="86" cy="96" r="4.6" fill="url(#g1askin)"/>
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

// CountExamples — bir nechta misolni ketma-ket sanaydi (har xil narsa), so'ng onDone.
// "Sonlar bilan hamma narsani sanaymiz" g'oyasi uchun. reduced-motion -> oxirgi misol + onDone.
const S1_EXAMPLES = [{ n: 2, kind: 'flower' }, { n: 3, kind: 'apple' }, { n: 4, kind: 'star' }, { n: 5, kind: 'fish' }];
const CountExamples = ({ examples, onDone, stepMs = 680, pauseMs = 1100 }) => {
  const reduced = usePrefersReducedMotion();
  const [ei, setEi] = useState(0);
  const [k, setK] = useState(0);
  const doneRef = useRef(false);
  useEffect(() => {
    if (reduced) {
      const id = setTimeout(() => { setEi(examples.length - 1); setK(examples[examples.length - 1].n); if (onDone) onDone(); }, 0);
      return () => clearTimeout(id);
    }
    let alive = true; let timer; let e = 0; let c = 0;
    const tick = () => {
      if (!alive) return;
      setEi(e); setK(c);
      const n = examples[e].n;
      if (c < n) { c += 1; timer = setTimeout(tick, stepMs); return; }
      if (e < examples.length - 1) { e += 1; c = 0; timer = setTimeout(tick, pauseMs); return; }
      if (!doneRef.current) { doneRef.current = true; if (onDone) onDone(); }
    };
    timer = setTimeout(tick, 550);
    return () => { alive = false; clearTimeout(timer); };
  }, [examples, onDone, reduced, stepMs, pauseMs]);
  const cur = examples[ei];
  return (
    <div className="g1-demo">
      <div className="g1-demo-row">
        {Array.from({ length: cur.n }).map((_, i) => {
          const on = i < k;
          return (
            <span key={i} className={`g1-demo-cell ${on ? 'on' : ''}`}>
              <ObjSvg kind={cur.kind}/>
              {on && <span className="g1-demo-tag mono">{i + 1}</span>}
            </span>
          );
        })}
      </div>
      <div className="g1-demo-num mono">{k}</div>
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

// BasketRimFront — savatning faqat OLD labi (gardish), mevalar USTIga chiziladi -> mevalar
// savat ichida "tiqilgan" ko'rinadi (yon ko'rinish sahna savatlari uchun). viewBox BasketArt bilan bir xil.
const BasketRimFront = () => (
  <svg className="d4-rimfront" viewBox="0 0 220 170" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
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
  const revealRef = useRevealScroll(solvedItem);
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
          <div ref={revealRef} className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
          <div className="g1-ghost" style={{ left: `calc(${dnd.drag.x}px / var(--g1z, 1))`, top: `calc(${dnd.drag.y}px / var(--g1z, 1))` }}>{tokenVisual(tokenById(dnd.drag.id))}</div>
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

// Mehmon sahnasi — gradientli eshik + choponli, yuzli mehmon (qo'l silkitadi, sovg'ali) + "taq-taq".
const GuestScene = () => (
  <div className="g1-guest-scene">
    <svg viewBox="0 0 240 200" aria-hidden="true">
      <defs>
        <linearGradient id="g1doorS" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B5793C"/><stop offset="100%" stopColor="#9A6430"/>
        </linearGradient>
        <linearGradient id="g1doorF" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#CE9351"/><stop offset="100%" stopColor="#A86B28"/>
        </linearGradient>
        <radialGradient id="g1skin" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/>
        </radialGradient>
        <linearGradient id="g1robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A93DE"/><stop offset="100%" stopColor="#275FA8"/>
        </linearGradient>
        <radialGradient id="g1warm" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#FFE7AE" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#FFD27A" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#FFD27A" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* pol soyalari */}
      <ellipse cx="66" cy="178" rx="48" ry="5.5" fill="rgba(58,53,48,0.12)"/>
      <ellipse cx="170" cy="170" rx="34" ry="5" fill="rgba(58,53,48,0.12)"/>
      {/* gilamcha (ostona oldida) */}
      <ellipse cx="68" cy="183" rx="42" ry="7.5" fill="#C4452F"/>
      <ellipse cx="68" cy="183" rx="34" ry="5.2" fill="none" stroke="#F0D9A0" strokeWidth="1.4" strokeDasharray="3 3"/>
      {/* ESHIK: ramka + ichki soya + tabaqa */}
      <rect x="22" y="18" width="92" height="160" rx="6" fill="url(#g1doorF)"/>
      <rect x="28" y="24" width="80" height="154" rx="4" fill="#704626"/>
      <rect x="31" y="27" width="74" height="151" rx="4" fill="url(#g1doorS)"/>
      {/* yog'och tola chiziqlari */}
      <g stroke="#7A4E22" strokeWidth="0.8" opacity="0.38">
        <line x1="46" y1="30" x2="46" y2="175"/>
        <line x1="68" y1="30" x2="68" y2="175"/>
        <line x1="90" y1="30" x2="90" y2="175"/>
      </g>
      {/* panellar — bevel: tashqi quyuq ramka + ichki yorqin yuza */}
      <rect x="38" y="36" width="58" height="54" rx="5" fill="#8A5826" stroke="#6E4520" strokeWidth="1.5"/>
      <rect x="41" y="39" width="52" height="48" rx="4" fill="#A06A2E" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
      <rect x="38" y="98" width="58" height="68" rx="5" fill="#8A5826" stroke="#6E4520" strokeWidth="1.5"/>
      <rect x="41" y="101" width="52" height="62" rx="4" fill="#A06A2E" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
      {/* dasta: plastinka + dumaloq tutqich */}
      <rect x="93" y="97" width="6" height="20" rx="3" fill="#C98E33"/>
      <circle cx="96" cy="107" r="4.6" fill="#F0C24A" stroke="#B8862E" strokeWidth="1.2"/>
      <circle cx="94.5" cy="105.5" r="1.4" fill="rgba(255,255,255,0.6)"/>
      {/* ostona */}
      <rect x="20" y="176" width="96" height="5" rx="2" fill="#8A5A28"/>
      {/* iliq kutib-olish nuri (eshikdan) */}
      <ellipse className="g1-doorglow" cx="67" cy="100" rx="62" ry="78" fill="url(#g1warm)"/>
      {/* taq-taq tovush yoylari */}
      <g className="g1-knock" stroke="#8A8780" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M120 64 q7 10 0 22"/>
        <path d="M127 58 q11 16 0 34"/>
      </g>
      {/* MEHMON */}
      <g className="g1-guest">
        <path d="M152 100 Q150 95 157 93 L181 93 Q188 95 186 100 L193 156 Q195 163 186 163 L152 163 Q143 163 145 156 Z" fill="url(#g1robe)"/>
        <path d="M169 96 L169 160" stroke="rgba(0,0,0,0.12)" strokeWidth="2"/>
        <path d="M161 94 L169 102 L177 94" fill="#275FA8"/>
        {/* poyabzal (chopon etagidan ko'rinadi) */}
        <ellipse cx="160" cy="164" rx="8.5" ry="3.6" fill="#3A2A1E"/>
        <ellipse cx="178" cy="164" rx="8.5" ry="3.6" fill="#3A2A1E"/>
        <ellipse cx="158" cy="163" rx="4" ry="1.4" fill="rgba(255,255,255,0.18)"/>
        {/* pastki qo'l + sovg'a quticha */}
        <path d="M156 102 Q149 120 153 137" stroke="url(#g1robe)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <g>
          <rect x="143" y="139" width="20" height="15" rx="2.5" fill="#E8557A"/>
          <rect x="151" y="139" width="4" height="15" fill="#FBE3CF"/>
          <rect x="143" y="145" width="20" height="4" fill="#FBE3CF"/>
          <ellipse cx="149" cy="138" rx="4" ry="3" fill="#FBE3CF"/><ellipse cx="157" cy="138" rx="4" ry="3" fill="#FBE3CF"/><circle cx="153" cy="138" r="2" fill="#F0C9A0"/>
        </g>
        <circle cx="153" cy="138" r="5.5" fill="url(#g1skin)"/>
        {/* sovg'a ustida uchqunlar */}
        <g fill="#FFD86B">
          <path className="g1-giftspark" style={{ animationDelay: '0s' }} d="M0,-4 L1.1,-1.1 L4,0 L1.1,1.1 L0,4 L-1.1,1.1 L-4,0 L-1.1,-1.1 Z" transform="translate(138 131)"/>
          <path className="g1-giftspark" style={{ animationDelay: '0.5s' }} d="M0,-4 L1.1,-1.1 L4,0 L1.1,1.1 L0,4 L-1.1,1.1 L-4,0 L-1.1,-1.1 Z" transform="translate(168 134) scale(0.8)"/>
          <path className="g1-giftspark" style={{ animationDelay: '0.9s' }} d="M0,-4 L1.1,-1.1 L4,0 L1.1,1.1 L0,4 L-1.1,1.1 L-4,0 L-1.1,-1.1 Z" transform="translate(153 123) scale(0.7)"/>
        </g>
        {/* silkiydigan qo'l */}
        <g className="g1-guest-hand">
          <path d="M184 100 Q202 88 208 70" stroke="url(#g1robe)" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <circle cx="209" cy="67" r="6.5" fill="url(#g1skin)"/>
        </g>
        {/* bo'yin + bosh */}
        <rect x="164" y="84" width="10" height="10" fill="#E0A06E"/>
        <circle cx="169" cy="72" r="16.5" fill="url(#g1skin)"/>
        {/* soch (chakka) */}
        <path d="M152 73 Q154 62 159 60 Q156 68 158 74 Z" fill="#3A2517"/>
        <path d="M186 73 Q184 62 179 60 Q182 68 180 74 Z" fill="#3A2517"/>
        {/* DOPPI (milliy bosh kiyim): gumbaz + jiyak + oq naqsh */}
        <path d="M151 61 Q169 39 187 61 Q169 67 151 61 Z" fill="#1E2A33"/>
        <path d="M151 61 Q169 67 187 61 L187 65 Q169 73 151 65 Z" fill="#121A22"/>
        {/* qalampir motivlari (gumbazda): oq, to'q jiyakli, markaziy tomirli */}
        <g fill="#F2F0EA" stroke="#121A22" strokeWidth="0.5" strokeLinejoin="round">
          <g transform="translate(169 56.5)"><path d="M0 1 C -2.7 -1.6 -2.7 -6.2 0 -9.4 C 2.7 -6.2 2.7 -1.6 0 1 Z"/><path d="M0 -0.5 V-8" fill="none"/></g>
          <g transform="translate(159.5 58) rotate(-26)"><path d="M0 1 C -2.3 -1.4 -2.3 -5.6 0 -8.4 C 2.3 -5.6 2.3 -1.4 0 1 Z"/><path d="M0 -0.5 V-7" fill="none"/></g>
          <g transform="translate(178.5 58) rotate(26)"><path d="M0 1 C -2.3 -1.4 -2.3 -5.6 0 -8.4 C 2.3 -5.6 2.3 -1.4 0 1 Z"/><path d="M0 -0.5 V-7" fill="none"/></g>
        </g>
        {/* band jiyagi: an'anaviy mayda kamarchalar */}
        <g fill="none" stroke="#F2F0EA" strokeWidth="0.9" strokeLinecap="round">
          <path d="M154 64.2 q1.8 -2.5 3.6 0 M159.6 64.4 q1.8 -2.5 3.6 0 M165.2 64.5 q1.8 -2.5 3.6 0 M170.8 64.5 q1.8 -2.5 3.6 0 M176.4 64.4 q1.8 -2.5 3.6 0 M182 64.2 q1.8 -2.5 3.6 0"/>
        </g>
        {/* yuz */}
        <circle cx="163" cy="71" r="1.9" fill="#3A2A1E"/>
        <circle cx="175" cy="71" r="1.9" fill="#3A2A1E"/>
        <path d="M163 78 Q169 84 175 78" stroke="#3A2A1E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="159" cy="78" rx="3" ry="2" fill="rgba(255,120,120,0.32)"/>
        <ellipse cx="179" cy="78" rx="3" ry="2" fill="rgba(255,120,120,0.32)"/>
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
// VIZUALIZATORLAR — Dars05 (sonning tarkibi 2–5): ten-frame ikki rangli (qizil/ko'k)
// Uslub: etalon (Dars01/03/04) ten-frame. Qism = rangli nuqta. Berk qism = "?".
// ============================================================

// Rang so'zlari (audio uchun, TTS-toza)
const CW = { uz: ['qizil', "yashil"], ru: ['красных', 'зелёных'] };

// AppleIcon — olma ikoni; c='r' qizil, c='g' yashil (ikki rangli sanagich, hikoyaga bog'liq).
const AppleIcon = ({ c = 'r' }) => {
  const body = c === 'r' ? '#EE5436' : '#5DBB54';
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">
      <g transform="translate(20 21)">
        <path d="M0 -7 C -5 -13 -11 -13 -13.5 -8 C -16.5 -2 -15.5 9 -8 14.5 C -4 17 -1.5 16.5 0 14.5 C 1.5 16.5 4 17 8 14.5 C 15.5 9 16.5 -2 13.5 -8 C 11 -13 5 -13 0 -7 Z" fill={body}/>
        <path d="M0 -8 Q1 -16 5 -18" stroke="#6E3A20" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <ellipse cx="9" cy="-16" rx="6" ry="3.4" fill="#3E9B57" transform="rotate(-18 9 -16)"/>
        <ellipse cx="-6.5" cy="-1" rx="2.8" ry="6.2" fill="rgba(255,255,255,0.42)" transform="rotate(-16 -6.5 -1)"/>
      </g>
    </svg>
  );
};

// Domino — fakt animatsiyasi (s11): ikki qismdan iborat tosh (2 qizil + 3 yashil = 5).
const Domino = () => (
  <svg viewBox="0 0 100 60" width="100%" height="100%" aria-hidden="true">
    <rect x="3" y="3" width="94" height="54" rx="9" fill="#FFFDF8" stroke="#0E0E10" strokeWidth="2"/>
    <line x1="50" y1="7" x2="50" y2="53" stroke="#0E0E10" strokeWidth="2"/>
    <circle cx="27" cy="22" r="6" fill="#EE5436"/><circle cx="27" cy="40" r="6" fill="#EE5436"/>
    <circle cx="65" cy="18" r="6" fill="#5DBB54"/><circle cx="74" cy="30" r="6" fill="#5DBB54"/><circle cx="65" cy="42" r="6" fill="#5DBB54"/>
  </svg>
);

// BondFrame — 5 katakli ramka; 0..a-1 qizil olma, a..total-1 yashil olma, qolgani bo'sh.
// hide=true -> hideSide ('blue'=yashil | 'red'=qizil) qismi "?" bilan yashiriladi. anim -> ketma-ket "pop".
const BondFrame = ({ total = 5, a = 0, hide = false, hideSide = 'blue', anim = false }) => (
  <div className="g1-bf" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => {
      const filled = i < total;
      const red = i < a;
      const hidden = hide && (hideSide === 'blue' ? !red : red);
      return (
        <span key={i} className={`g1-bf-cell ${filled ? 'on' : ''} ${anim && filled ? 'g1-bf-pop' : ''}`} style={anim && filled ? { animationDelay: `${i * 0.1}s` } : undefined}>
          {filled && (hidden
            ? <span className="g1-bf-q">?</span>
            : <span className="g1-bf-ap"><AppleIcon c={red ? 'r' : 'g'}/></span>)}
        </span>
      );
    })}
  </div>
);

// NumTile — son plitkasi (MC variant)
const NumTile = ({ d }) => <span className="g1-numtile" aria-hidden="true">{d}</span>;

// PairCard — kompakt juft: a qizil olma + b yashil olma guruhlari (s9 variantlari)
const PairCard = ({ a, b, big = false }) => (
  <div className={`g1-paircard ${big ? 'g1-paircard-big' : ''}`}>
    <span className="g1-pc-grp">{Array.from({ length: a }).map((_, i) => <span key={i} className="g1-pc-ap"><AppleIcon c="r"/></span>)}</span>
    <span className="g1-pc-div" aria-hidden="true"/>
    <span className="g1-pc-grp">{Array.from({ length: b }).map((_, i) => <span key={i} className="g1-pc-ap"><AppleIcon c="g"/></span>)}</span>
  </div>
);

// NumberBond — qism-butun "gilos" diagrammasi (Singapur): tepada butun, pastda ikki qism.
// CPA ko'prigi: konkret (ten-frame) -> tasviriy (bond) -> belgi. Chap qism qizil, o'ng yashil.
const NumberBond = ({ total = 5, a = 0 }) => (
  <svg className="g1-nb" viewBox="0 0 160 132" aria-hidden="true">
    <path d="M80 40 L42 92" stroke="#CDC6BA" strokeWidth="3" strokeLinecap="round"/>
    <path d="M80 40 L118 92" stroke="#CDC6BA" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="80" cy="27" r="22" fill="#FFFFFF" stroke="#FF4F28" strokeWidth="3"/>
    <text x="80" y="35" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0E0E10">{total}</text>
    <circle cx="42" cy="104" r="20" fill="#FFE8E1" stroke="#EE5436" strokeWidth="3"/>
    <text x="42" y="112" textAnchor="middle" fontSize="22" fontWeight="800" fill="#EE5436">{a}</text>
    <circle cx="118" cy="104" r="20" fill="#E7F4E5" stroke="#3E9B3A" strokeWidth="3"/>
    <text x="118" y="112" textAnchor="middle" fontSize="22" fontWeight="800" fill="#3E9B3A">{total - a}</text>
  </svg>
);

// BondAuto — qoida vizuali: ten-frame (konkret) + number bond (tasviriy) BIRGA, qism AVTO aylanadi.
// s3: seq=[1,2,3,4]; s6: seq=[2,3] (almashinuv). CPA: olmalar -> bond -> "a va b" belgi.
const BondAuto = ({ seq }) => {
  const lang = useLang();
  const k = useCountOnce(seq.length, { loop: true, stepMs: 1500, holdMs: 800 });
  const a = seq[k % seq.length];
  return (
    <div className="g1-bondcycle">
      <div className="g1-bondcpa">
        <BondFrame total={5} a={a}/>
        <NumberBond total={5} a={a}/>
      </div>
      <div className="g1-bc-parts">
        <span className="g1-bc-part g1-bc-r">{a}</span>
        <span className="g1-bc-and">{lang === 'uz' ? 'va' : 'и'}</span>
        <span className="g1-bc-part g1-bc-b">{5 - a}</span>
      </div>
    </div>
  );
};

// BitSays — qoida/izoh kartochkasi: CHAPDA animatsion Bit, o'ngda matn.
const BitSays = ({ text }) => (
  <div className="frame-tip fade-up delay-1">
    <div className="g1-bitcard">
      <div className="g1-bitcard-fig"><BitSVG state="present"/></div>
      <div className="g1-bitcard-body"><span className="g1-bitcard-txt">{text}</span></div>
    </div>
  </div>
);

// ============================================================
// EKRANLAR — Dars05 (sonning tarkibi 2–5)
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

// CompStory — hikoya slaydi (sIntro/sGuest): SceneBg + Ra'no/Anvar + BondFrame dekoratsiya.
// NavNext ovoz tugagach ochiladi (etalon: bola hikoyani tinglaydi).
const CompStory = ({ props, c, variant = 'room', final = false }) => {
  const lang = useLang();
  const t = useT();
  const audio = useAudio(makeAutoSegments(c, lang));
  useHero('present');
  const total = Array.isArray(c.audio?.[lang]) ? c.audio[lang].length : 3;
  const step = useStoryReveal(audio, total);
  const canGo = useCanAnswer(audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canGo} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 16px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center' }}>{t(c.title)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(22px, 4.4vw, 32px)' }}>
          <div className="g1-scene">
            <SceneBg variant={variant}/>
            <div className="g1-cast-row">
              <div className={`g1-cast ${step >= 1 ? 'in' : ''}`}>
                <div className="g1-cast-fig"><RanoSVG mood={final ? 'happy' : 'pointing'} className="g1-cast-svg"/></div>
                <span className="g1-cast-name">{t(c.rano_label)}</span>
              </div>
              <div className="g1-comp-frame">
                <BondFrame total={5} a={final ? 2 : 0}/>
              </div>
              <div className={`g1-cast ${step >= 1 ? 'in' : ''}`}>
                <div className="g1-cast-fig"><AnvarSVG pose={final ? 'happy' : 'door'} className="g1-cast-svg"/></div>
                <span className="g1-cast-name">{t(c.anvar_label)}</span>
              </div>
            </div>
          </div>
        </div>
        <OnboardHint/>
      </div>
    </Stage>
  );
};

const ScreenIntro = (props) => <CompStory props={props} c={CONTENT.sIntro} variant="room"/>;
const ScreenGuest = (props) => <CompStory props={props} c={CONTENT.sGuest} variant="door" final/>;

// s0 — HOOK: 5 ramka (bir rang) + yumshoq jumboq (to'g'ri javob yo'q).
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
    const right = i === 1;
    if (right) sfx.playCorrect();
    const pw = nextPraise(lang); setPraiseWord(pw);
    if (!audio.muted) { const e = getAudioEngine(); if (e) { if (right) { e.pushOneOff(pw); e.pushOneOff(c.audio.on_correct[lang]); } else { e.pushOneOff(c.audio.on_wrong[lang]); } } }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <h1 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span>{t(c.title_part3)}
        </h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <BondFrame total={5} a={0} anim/>
        </div>
        <p className="g1-q fade-up delay-1">{t(c.question)}</p>
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className={`g1-tile ${picked === i && i === 1 ? 'g1-tile-ok' : ''} ${picked === i && i !== 1 ? 'g1-tile-used' : ''}`} disabled={picked !== null} onClick={() => pick(i)} style={{ width: '100%', fontSize: 'clamp(14px, 1.9vw, 17px)' }}>
              {t(o)}
            </button>
          ))}
        </div>
        {picked !== null && (
          <FeedbackBlock show={true} isCorrect={picked === 1} wrongClass="frame-tip">
            <Reaction state={picked === 1 ? 'correct' : 'wrong'} praise={picked === 1 ? praiseWord : t(c.audio.on_wrong)}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// FillExplore — tap-to-fill: total katak, bosish qizil/ko'k qiladi; qizil va ko'k birga total.
// needWays — necha xil bo'linishni ko'rgach Davom (s1: 5/3, s5: 4/3).
const FillExplore = ({ c, total, needWays, ...props }) => {
  const lang = useLang();
  const t = useT();
  const audio = useAudio(makeAutoSegments(c, lang));
  const init = Array.from({ length: total }, () => false); // hammasi yashil; bosish qizil qiladi
  const [cells, setCells] = useState(init);
  const [seen, setSeen] = useState(() => new Set(['0']));
  const red = cells.filter(Boolean).length;
  const done = seen.size >= needWays;
  const revealRef = useRevealScroll(done);
  const tap = (i) => {
    const nc = [...cells]; nc[i] = !nc[i];
    const nr = nc.filter(Boolean).length;
    setCells(nc);
    setSeen((sv) => { const ns = new Set(sv); ns.add(String(nr)); return ns; });
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(`${NUM_WORDS[lang][nr]} ${CW[lang][0]} ${lang === 'uz' ? 'va' : 'и'} ${NUM_WORDS[lang][total - nr]} ${CW[lang][1]}`); }
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
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(14px, 2.8vw, 20px)' }}>
          <div className="g1-fillrow">
            <span className="g1-fillcnt g1-bc-r">{red}</span>
            <div className="g1-bf g1-bf-tap">
              {cells.map((isRed, i) => (
                <button key={i} className="g1-bf-cell on g1-bf-btn" onClick={() => tap(i)} aria-label={isRed ? CW[lang][0] : CW[lang][1]}>
                  <span className="g1-bf-ap"><AppleIcon c={isRed ? 'r' : 'g'}/></span>
                </button>
              ))}
            </div>
            <span className="g1-fillcnt g1-bc-b">{total - red}</span>
          </div>
          <p className="g1-explore-hint">
            {lang === 'uz' ? "Olmani bosing — rangi o'zgaradi" : 'Нажми яблоко — цвет поменяется'}
            <span className="mono small" style={{ color: T.ink3, marginLeft: 8 }}>{Math.min(seen.size, needWays)} / {needWays}</span>
          </p>
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

const Screen1 = (props) => <FillExplore c={CONTENT.s1} total={5} needWays={3} {...props}/>;
const Screen5 = (props) => <FillExplore c={CONTENT.s5} total={4} needWays={3} {...props}/>;

// s2 — EXPLORATION: 3 qizil ochiq, qolgani berk -> ochib ko'k qismini topish.
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio(makeAutoSegments(c, lang));
  const [open, setOpen] = useState(false);
  const revealRef = useRevealScroll(open);
  const reveal = () => {
    if (open) return;
    setOpen(true);
    if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(NUM_WORDS[lang][2]); e.pushOneOff(c.done_text[lang]); } }
  };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!open} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <BondFrame total={5} a={3} hide={!open} anim={open}/>
        </div>
        {!open && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={reveal} style={{ padding: 'clamp(9px, 1.5vw, 12px) clamp(16px, 2.4vw, 24px)', fontSize: 'clamp(13px, 1.6vw, 15px)' }}>
              {lang === 'uz' ? 'Berk qismni ochish' : 'Открыть зелёные'}
            </button>
          </div>
        )}
        {open && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — RULE: son ikki qismdan (avto-aylanuvchi juftlar) + Bit-kartochka.
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <BondAuto seq={[1, 2, 3, 4]}/>
        </div>
        <BitSays text={t(c.tip)}/>
      </div>
    </Stage>
  );
};

// s6 — RULE: o'rin almashinuvi (avto rang almashinuvi) + Bit-kartochka.
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <BondAuto seq={[2, 3]}/>
        </div>
        <BitSays text={t(c.tip)}/>
      </div>
    </Stage>
  );
};

// s4 — TEST MC: 5 = 3 va ? (ramka 3 qizil + berk ko'k; javobda ochiladi). Plitalar [5,3,2,4], to'g'ri idx2.
const Screen4 = (props) => {
  const c = CONTENT.s4;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      figure={(solved) => <BondFrame total={5} a={3} hide={!solved} anim={solved}/>}
      options={[<NumTile d={5}/>, <NumTile d={3}/>, <NumTile d={2}/>, <NumTile d={4}/>]}
      correctIdx={2}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s7 — TEST MC: 4 = ? va 1 (1 ko'k ko'rinadi, qizil berk). Plitalar [3,4,1,2], to'g'ri idx0.
const Screen7 = (props) => {
  const c = CONTENT.s7;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      figure={(solved) => <BondFrame total={4} a={3} hide={!solved} hideSide="red" anim={solved}/>}
      options={[<NumTile d={3}/>, <NumTile d={4}/>, <NumTile d={1}/>, <NumTile d={2}/>]}
      correctIdx={0}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s8 — TEST ha/yo'q: 3 qizil + 1 ko'k birga 5mi? To'g'ri = Yo'q (idx1).
const Screen8 = (props) => {
  const c = CONTENT.s8;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      figure={() => <BondFrame total={4} a={3}/>}
      options={[<span className="g1-opt-txt">{t(c.opt0)}</span>, <span className="g1-opt-txt">{t(c.opt1)}</span>]}
      correctIdx={1}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s9 — TEST MC: qaysi juft birga 5? Juftlar [(2,2),(2,3),(3,3),(1,2)], to'g'ri idx1.
const Screen9 = (props) => {
  const c = CONTENT.s9;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[<PairCard a={2} b={2}/>, <PairCard a={2} b={3}/>, <PairCard a={3} b={3}/>, <PairCard a={1} b={2}/>]}
      correctIdx={1}
      mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s10 — TEST juftlash: qizil qism -> yetishmagan ko'k son (besh gacha). Tap son, keyin ramka.
const S10_ITEMS = [{ red: 1, miss: 4 }, { red: 3, miss: 2 }, { red: 2, miss: 3 }];
const S10_TILES = [4, 2, 3];
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const wasSolved = props.storedAnswer?.solved === true;
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState(() => new Set(wasSolved ? S10_ITEMS.map((x) => x.red) : []));
  const [nudge, setNudge] = useState(null);
  const [praiseWord, setPraiseWord] = useState('');
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? 0);
  const usedTiles = new Set([...matched].map((r) => S10_ITEMS.find((x) => x.red === r).miss));
  const allDone = matched.size >= S10_ITEMS.length;
  const revealRef = useRevealScroll(allDone);
  const tapFrame = (it) => {
    if (allDone || !canAns || sel == null || matched.has(it.red)) return;
    attemptsRef.current += 1;
    if (sel === it.miss) {
      const nm = new Set(matched); nm.add(it.red); setMatched(nm); setSel(null); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.correct_text[lang]); }
      if (nm.size >= S10_ITEMS.length) {
        const ft = firstTryRef.current !== false;
        const pw = nextPraise(lang); setPraiseWord(pw);
        if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.done_text[lang]); } }
        props.onAnswer({
          stage: SCREEN_META[props.screen].scope, screenIdx: props.screen,
          question: null, options: null, correctIndex: null, correctAnswer: null,
          studentAnswerIndex: null, studentAnswer: null,
          correct: ft, firstTry: ft, attempts: attemptsRef.current, solved: true
        });
      }
    } else {
      firstTryRef.current = false;
      setNudge(it.red); setTimeout(() => setNudge(null), 450); sfx.playWrong();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.wrong_default[lang]); }
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
        <p className="h-sub title fade-up">{t(c.instruction)} <span className="mono small" style={{ color: T.ink3 }}>{matched.size} / {S10_ITEMS.length}</span></p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.8vw, 20px)' }}>
          <div className="g1-m-tiles">
            {S10_TILES.map((d) => (
              <button key={d} className={`g1-tile ${sel === d ? 'g1-tile-sel' : ''} ${usedTiles.has(d) ? 'g1-tile-used' : ''}`} disabled={usedTiles.has(d) || allDone || !canAns} onClick={() => setSel(d)} style={{ fontSize: 'clamp(24px, 5vw, 34px)', padding: 'clamp(8px,1.8vw,14px) clamp(14px,3vw,22px)' }}>
                {d}
              </button>
            ))}
          </div>
          <div className="g1-m-frames">
            {S10_ITEMS.map((it) => {
              const done = matched.has(it.red);
              return (
                <button key={it.red} className={`g1-m-frame ${done ? 'g1-m-frame-ok' : ''} ${nudge === it.red ? 'g1-nudge' : ''}`} disabled={done || allDone || !canAns} onClick={() => tapFrame(it)}>
                  <BondFrame total={5} a={it.red} hide={!done} anim={done}/>
                </button>
              );
            })}
          </div>
        </div>
        {allDone && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={praiseWord}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// sDrill — TRENIROVKA (ball yo'q): 6 mashq ketma-ket — yetishmagan qismni topish. Dars01 drill naqshi.
const DRILL = [
  { total: 5, a: 3, hide: 'blue', ans: 2, tiles: [4, 2, 3] },
  { total: 4, a: 1, hide: 'blue', ans: 3, tiles: [3, 2, 1] },
  { total: 3, a: 2, hide: 'blue', ans: 1, tiles: [2, 1, 3] },
  { total: 5, a: 4, hide: 'blue', ans: 1, tiles: [2, 1, 5] },
  { total: 2, a: 1, hide: 'blue', ans: 1, tiles: [1, 2] },
  { total: 4, a: 2, hide: 'red', ans: 2, tiles: [3, 2, 4] },
];
const ScreenDrill = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sDrill;
  const sfx = useSfx();
  const audio = useAudio([{ id: 'sdrill_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const total = DRILL.length;
  const [idx, setIdx] = useState(0);
  const [solvedItem, setSolvedItem] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const [praiseWord, setPraiseWord] = useState('');
  const [encWord, setEncWord] = useState('');
  const revealRef = useRevealScroll(solvedItem);
  const item = DRILL[idx];
  const allDone = idx >= total - 1 && solvedItem;
  const pick = (v) => {
    if (solvedItem || wrong.has(v) || !canAns) return;
    if (v === item.ans) {
      setSolvedItem(true); sfx.playCorrect();
      const pw = nextPraise(lang); setPraiseWord(pw);
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff((idx >= total - 1 ? c.done_text : c.correct_text)[lang]); } }
    } else {
      sfx.playWrong(); setEncWord(nextEncourage(lang));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.wrong_default[lang]); }
      setWrong((prev) => { const s = new Set(prev); s.add(v); return s; });
    }
  };
  const nextItem = () => { setIdx(idx + 1); setSolvedItem(false); setWrong(new Set()); };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!allDone} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)} <span className="mono small" style={{ color: T.ink3 }}>{idx + 1} / {total}</span></p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <BondFrame total={item.total} a={item.a} hide={!solvedItem} hideSide={item.hide} anim={solvedItem}/>
        </div>
        {!solvedItem && (
          <div className="fade-up delay-1" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {item.tiles.map((v) => (
              <button key={v} className={`g1-tile ${wrong.has(v) ? 'g1-tile-used' : ''}`} disabled={wrong.has(v) || !canAns} onClick={() => pick(v)} style={{ fontSize: 'clamp(24px, 5vw, 34px)', padding: 'clamp(8px, 1.8vw, 14px) clamp(16px, 3.4vw, 24px)' }}>{v}</button>
            ))}
          </div>
        )}
        {solvedItem && (
          <div ref={revealRef} className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Reaction state="correct" praise={praiseWord}/>
            {!allDone && (
              <button className="btn-white-accent" onClick={nextItem} style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                {lang === 'uz' ? 'Keyingisi' : 'Дальше'}
              </button>
            )}
          </div>
        )}
        {!solvedItem && wrong.size > 0 && (
          <FeedbackBlock show={true} isCorrect={false} wrongClass="frame-tip">
            <Reaction state="wrong" praise={encWord}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// sd — MINI-O'YIN (ball yo'q): maqsadli raundlar. Bit "qizil yasang: N" so'raydi; olmalar yashil
// boshlanadi, bosish qizil qiladi. Qizil soni maqsadga tenglashganda raund yutiladi (ikki rang ham shart).
const SD_TARGETS = [3, 2, 4];
const ScreenD = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sd;
  const sfx = useSfx();
  const audio = useAudio([{ id: 'sd_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const total = SD_TARGETS.length;
  const [ri, setRi] = useState(0);
  const [cells, setCells] = useState(() => [false, false, false, false, false]);
  const [roundDone, setRoundDone] = useState(false);
  const [done, setDone] = useState(false);
  const [praiseWord, setPraiseWord] = useState('');
  const revealRef = useRevealScroll(roundDone);
  const target = SD_TARGETS[ri];
  const redCount = cells.filter(Boolean).length;
  const tap = (i) => {
    if (roundDone || done || !canAns) return;
    setCells((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };
  useEffect(() => {
    if (roundDone || done) return undefined;
    if (redCount !== target) return undefined;
    const tm = setTimeout(() => {
      setRoundDone(true); sfx.playCorrect();
      const pw = nextPraise(lang); setPraiseWord(pw);
      if (ri >= total - 1) {
        setDone(true);
        if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.done_text[lang]); } }
      } else if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.correct_text[lang]); } }
    }, 0);
    return () => clearTimeout(tm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redCount, target, roundDone, done, ri]);
  const nextRound = () => { setRi(ri + 1); setCells([false, false, false, false, false]); setRoundDone(false); };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!done} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)} <span className="mono small" style={{ color: T.ink3 }}>{Math.min(ri + 1, total)} / {total}</span></p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(16px, 3vw, 24px)' }}>
          <div className="g1-sd-target"><span className="g1-sd-target-lbl">{t(c.target_label)}</span><span className="g1-sd-target-num g1-bc-r">{target}</span></div>
          <div className="g1-bf g1-bf-tap">
            {cells.map((isRed, i) => (
              <button key={i} className="g1-bf-cell g1-bf-btn on" onClick={() => tap(i)} disabled={roundDone || done} aria-label={isRed ? CW[lang][0] : CW[lang][1]}>
                <span className="g1-bf-ap"><AppleIcon c={isRed ? 'r' : 'g'}/></span>
              </button>
            ))}
          </div>
          <div className="g1-bc-parts">
            <span className="g1-bc-part g1-bc-r">{redCount}</span>
            <span className="g1-bc-and">{lang === 'uz' ? 'va' : 'и'}</span>
            <span className="g1-bc-part g1-bc-b">{5 - redCount}</span>
          </div>
        </div>
        {roundDone && (
          <div ref={revealRef} className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Reaction state="correct" praise={praiseWord}/>
            {!done && (
              <button className="btn-white-accent" onClick={nextRound} style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                {lang === 'uz' ? 'Keyingisi' : 'Дальше'}
              </button>
            )}
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — TEST final + FAKT: 5 = 2 va ? (2 qizil + berk ko'k). Plitalar [2,5,4,3], to'g'ri idx3.
const Screen11 = (props) => {
  const c = CONTENT.s11;
  const t = useT();
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      figure={(solved) => <BondFrame total={5} a={2} hide={!solved} anim={solved}/>}
      options={[<NumTile d={2}/>, <NumTile d={5}/>, <NumTile d={4}/>, <NumTile d={3}/>]}
      correctIdx={3}
      mascot={false}
      factOnCorrect={(
        <div className="fact-card fade-up" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <span className="fact-badge">{t(c.fact_badge)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.8vw, 20px)', width: '100%' }}>
            <div style={{ flexShrink: 0, width: 'clamp(90px, 20vw, 120px)' }}><Domino/></div>
            <p className="fact-text" style={{ flex: 1, margin: 0 }}>{t(c.fact_text)}</p>
          </div>
        </div>
      )}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s12 — SUMMARY: reyting + can-do + ConnectionsBlock + yakuniy sahna.
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s12;
  useHero('present');
  const audio = useAudio(makeAutoSegments(c, lang));
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Yakunlash' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
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
        <div className="frame-success fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 22px)', flexWrap: 'wrap' }}>
          <h2 className="title h-sub" style={{ margin: 0, flex: 1, minWidth: 'min(100%, 190px)' }}>
            {t(c.main_1)} <span className="italic" style={{ color: T.success }}>{t(c.main_2_em)}</span>
          </h2>
          <div className="g1-nb-sm"><NumberBond total={5} a={2}/></div>
        </div>
        <div className="frame g1-conn fade-up delay-1" style={{ padding: 'clamp(10px, 1.8vw, 14px)' }}>
          <h3 className="g1-conn-title">{t(c.connections_title)}</h3>
          <div className="g1-conn-row"><span className="g1-conn-tag g1-conn-ref">{t(c.conn_label_refs)}</span><span className="g1-conn-txt">{t(c.conn_refs)}</span></div>
          <div className="g1-conn-row"><span className="g1-conn-tag g1-conn-next">{t(c.conn_label_next)}</span><span className="g1-conn-txt">{t(c.conn_next)}</span></div>
        </div>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <div className="g1-scene" style={{ minHeight: 'clamp(150px, 30vw, 230px)' }}>
            <SceneBg variant="room"/>
            <div className="g1-cast-row">
              <div className="g1-cast in">
                <div className="g1-cast-fig"><RanoSVG mood="happy" stars className="g1-cast-svg"/></div>
                <span className="g1-cast-name">{t(c.rano_label)}</span>
              </div>
              <div className="g1-comp-frame"><BondFrame total={5} a={2}/></div>
              <div className="g1-cast in">
                <div className="g1-cast-fig"><AnvarSVG pose="happy" className="g1-cast-svg"/></div>
                <span className="g1-cast-name">{t(c.anvar_label)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1)
// ============================================================
export default function CompositionLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'f' });
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

  const screens = [ScreenIntro, Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, ScreenDrill, ScreenD, ScreenGuest, Screen11, Screen12];
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
.stage { max-width: 936px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; position: relative; z-index: 1; }
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
  overscroll-behavior: contain;
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
.g1-guest-scene svg { width: clamp(275px, 68vw, 420px); height: auto; }
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
.g1-dpips { min-height: clamp(92px, 18vw, 128px); display: flex; align-items: center; justify-content: center; }

/* TenFrame — "besh-besh ramka": pastki qator (besh) qizil, tepa qator (ortiqcha) ko'k */
.g1-tenframe { display: inline-flex; flex-direction: column; gap: clamp(5px, 1vw, 8px); padding: clamp(7px, 1.5vw, 11px); background: #FFFFFF; border-radius: 16px; box-shadow: 0 5px 16px -9px rgba(58, 53, 48, 0.4); }
.g1-tf-row { display: flex; gap: clamp(5px, 1vw, 8px); }
.g1-tf-cell { width: clamp(26px, 5.2vw, 38px); height: clamp(26px, 5.2vw, 38px); border-radius: 9px; border: 2px solid #E6E1D6; background: #F6F4EF; display: flex; align-items: center; justify-content: center; }
.g1-tf-base .g1-tf-cell { border-color: #FFD2C6; }
.g1-tf-dot { width: 56%; height: 56%; border-radius: 50%; background: transparent; }
.g1-tf-cell.on { background: #FFE8E1; border-color: #FF4F28; }
.g1-tf-cell.on .g1-tf-dot { background: #FF4F28; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell.on { background: #E3F2FB; border-color: #019ACB; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell.on .g1-tf-dot { background: #019ACB; }
/* to'lgan katak = meva tokeni (savatlardagi USTDAN ko'rinish meva bilan bir xil) */
.g1-tf-fruit { width: 76%; height: 76%; display: inline-flex; align-items: center; justify-content: center; }
.g1-tf-fruit svg { width: 100%; height: 100%; }
@keyframes g1tfPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
.g1-tf-pop .g1-tf-dot, .g1-tf-pop .g1-tf-fruit { animation: g1tfPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
@media (prefers-reduced-motion: reduce) { .g1-tf-pop .g1-tf-dot, .g1-tf-pop .g1-tf-fruit { animation: none; } }
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

/* UY (svg) + hovli */
.g1-house-svg { width: clamp(92px, 19vw, 126px); height: auto; display: block; }
.g1-housefig { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.g1-yard { display: flex; justify-content: center; }
.g1-s2house .g1-house-svg { width: clamp(92px, 19vw, 122px); }
.g1-opt-house { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-opt-house .g1-house-svg { width: clamp(62px, 13vw, 86px); }

/* s8 / s9 — uy tugmalari */
.g1-houses { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(10px, 2.2vw, 18px); }
.g1-housebtn { background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 18px; padding: clamp(8px, 1.8vw, 13px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease, opacity 0.2s ease; }
.g1-housebtn:hover:not(:disabled) { transform: translateY(-2px); }
.g1-housebtn-ok { border-color: #1F7A4D; background: #EFF7F1; }
.g1-housebtn-faded { opacity: 0.4; }
.g1-housebtn:disabled { cursor: default; }
.g1-housebtn .g1-house-svg { width: clamp(64px, 13.5vw, 92px); }

/* s9 — juftlash tartibi */
.g1-match { display: flex; flex-direction: column; gap: clamp(12px, 2.4vw, 18px); }
.g1-match-digits { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); }
.g1-match-houses { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(10px, 2.2vw, 16px); }

/* s5 — shakl belgisi */
.g1-feature { display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: clamp(90px, 18vw, 130px); justify-content: center; }
.g1-feature-txt { font-size: clamp(14px, 1.9vw, 17px); font-weight: 600; color: #FF4F28; }

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
.g1-street-house .g1-house-svg { width: 15cqw; }   /* 6 uy (5 raqamli + 1 bo'sh) sig'ishi uchun ozroq tor */
.g1-street-new { margin-left: 2.5cqw; }            /* yangi bo'sh uy — ko'cha oxirida ajralib turadi */
.g1-street-target .g1-house-svg { filter: drop-shadow(0 0 7px rgba(255,79,40,0.8)); }
.g1-street-anvar, .g1-street-rano, .g1-street-zuhra { position: absolute; display: flex; flex-direction: column; align-items: center; opacity: 0; transition: opacity 0.5s ease; z-index: 3; }
.g1-street-anvar.in, .g1-street-rano.in, .g1-street-zuhra.in { opacity: 1; }
/* personajlar OLD PLANDA, kichik (eshik bo'yida) — real proporsiya + chuqurlik */
.g1-street-anvar { left: 6%; bottom: 0; }
.g1-street-rano { right: 11%; bottom: 6%; }
.g1-street-zuhra { right: 4%; bottom: 0; }
.g1-street-anvar .g1-char, .g1-street-rano .g1-char, .g1-street-zuhra .g1-char { width: 6cqw; height: auto; }
.g1-street .g1-cast-name { display: none; }
.g1-street-final .g1-street-anvar { left: auto; right: 27%; bottom: 0; }
.g1-street-final .g1-street-rano { right: 15%; bottom: 4%; }
.g1-street-final .g1-street-zuhra { right: 3%; bottom: 6%; }
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

/* "5 va yana" — 5 talik guruh + qolgani orasida bo'shliq (6-10 ni o'qish uchun) */
.g1-pips-five { gap: 0; }
.g1-five-grp, .g1-more-grp { display: inline-flex; flex-wrap: nowrap; gap: clamp(4px, 1.2vw, 9px); align-items: center; }
.g1-five-grp { padding-right: clamp(8px, 2.4vw, 18px); border-right: 2px dashed rgba(58,53,48,0.16); margin-right: clamp(8px, 2.4vw, 18px); }
.g1-pips-wrap.g1-pips-five { flex-wrap: wrap; row-gap: clamp(4px, 1.2vw, 9px); }

/* s2 — "5 ta tayyor" kataklari (bosib bo'lmaydi, yengil ko'rsatilgan) */
.g1-tapcell-base { border-color: #D8D0C2; background: #F4F1EA; cursor: default; }
.g1-tapcell-base svg { opacity: 0.78; }

/* final / summary — rasm + matn YONMA-YON (skrolsiz) */
.g1-final-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(12px, 2.6vw, 22px); width: 100%; }
.g1-final-row .g1-final-street { flex: 1 1 280px; max-width: 420px; }
.g1-final-row .g1-handfact { flex: 1 1 200px; max-width: 320px; display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-sum-row { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(12px, 2.6vw, 22px); }
.g1-sum-row .g1-final-street { flex: 1 1 300px; max-width: 440px; }
.g1-sum-col { flex: 1 1 240px; min-width: 230px; display: flex; flex-direction: column; gap: clamp(10px, 2vw, 14px); }
.g1-final-street { width: 100%; }

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
  .g1-street-house, .g1-street-anvar, .g1-street-rano, .g1-street-zuhra { transition: none; }
  .g1-street-anvar.in { animation: none; }
}


/* === Dars04 — taqqoslash vizuallari (TwoBaskets / CompareFrames / CompareSign) === */
.d4-baskets { display: flex; align-items: flex-end; justify-content: center; gap: clamp(20px, 7vw, 64px); flex-wrap: wrap; }
.d4-basket { position: relative; width: clamp(140px, 32vw, 200px); aspect-ratio: 220 / 170; }
.d4-basket .g1-rb-svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.3)); }
/* old lab (gardish) mevalar USTIda -> mevalar savat ichida tiqilgan ko'rinadi (yon ko'rinish) */
.d4-rimfront { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
/* bowl = container; mevalar savat OG'ZI ichida heap bo'lib turadi, gap YO'Q, soniga qarab avto-kichrayadi */
.d4-bowl { position: absolute; left: 14%; right: 14%; top: 24%; bottom: 42%; container-type: size; display: flex; flex-wrap: wrap; align-items: center; align-content: flex-end; justify-content: center; gap: 0; }
.d4-fruit { flex: 0 0 auto; width: min(calc(100cqw / var(--cols, 3)), calc(100cqh / var(--rows, 2))); height: min(calc(100cqw / var(--cols, 3)), calc(100cqh / var(--rows, 2))); display: inline-flex; align-items: center; justify-content: center; position: relative; }
.d4-fruit-bob { width: 100%; height: 100%; display: inline-flex; animation: d4bob 2.8s ease-in-out infinite; }
.d4-fruit svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
@keyframes d4bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.d4-mount { animation: d4slidein 0.6s cubic-bezier(0.34,1.2,0.64,1) both; }
.d4-mount-r { animation: d4slideinr 0.6s cubic-bezier(0.34,1.2,0.64,1) both; }
@keyframes d4slidein { from { opacity: 0; transform: translateX(-30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes d4slideinr { from { opacity: 0; transform: translateX(30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }

/* kichik savatlar (sahna / sanash / tartiblash) — d4-basket o'lchamini parent boshqaradi */
.d4-scenebasket .d4-basket, .d4-countbasket .d4-basket, .d4-orderbasket .d4-basket { width: 100%; }
.d4-scenebasket { width: clamp(50px, 13vw, 78px); }
/* hikoya sahnasida (sIntro/sGuest) personajni kichraytirish — bulutcha qo'shilgani uchun scrollni oldini olish; summary o'z rulei (d4-scene-sum) bilan baribir kichikroq */
.d4-scene .g1-cast-fig { height: clamp(100px, 22vw, 166px); }
.d4-countbasket { width: clamp(84px, 20vw, 120px); }
.d4-orderbasket { width: clamp(92px, 22vw, 132px); }
/* meva o'lchami endi bowl container'idan (cqw/cqh + --cols/--rows) avtomatik — qat'iy override YO'Q */

/* ikki "besh-besh ramka" */
.d4-frames { display: flex; align-items: flex-end; justify-content: center; gap: clamp(16px, 5vw, 44px); flex-wrap: wrap; }
.d4-frame-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }

/* belgi-timsoh > < = (och timsoh og'zini katta songa ochadi; teng -> og'iz yopiq, ikkita teng chiziq) */
.d4-sign { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #FF4F28; font-size: clamp(38px, 8vw, 58px); display: inline-flex; align-items: center; justify-content: center; }
.d4-sign-big { font-size: clamp(52px, 12vw, 86px); }
/* timsoh SVG o'lchami font-size (em) ga bog'liq -> mavjud joylarga (slot/chip/variant/misol) mos keladi */
.d4-croc svg { width: 1.55em; height: 1.18em; overflow: visible; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.22)); }
/* ochilish: jag'lar mount'da ochiladi (scaleX) + yengil joyida nafas. KO'CHMAYDI. */
.d4-croc-anim { animation: d4crocopen 0.5s cubic-bezier(0.34,1.5,0.64,1) both, d4crocbreathe 2.8s ease-in-out 0.55s infinite; transform-origin: center; }
@keyframes d4crocopen { 0% { opacity: 0; transform: scaleX(0.5); } 100% { opacity: 1; transform: scaleX(1); } }
@keyframes d4crocbreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }

/* CHASE & EAT mukofoti (s4/s9): timsoh kattaroq songa yuguradi va "yeydi"; son xursand chayqaladi */
.d4-chase { display: inline-flex; align-items: center; gap: clamp(2px, 1.2vw, 10px); padding: clamp(4px, 1vw, 8px); }
.d4-chase-croc { display: inline-flex; width: clamp(58px, 16vw, 96px); animation: d4chaserun 1.45s cubic-bezier(0.4, 0.9, 0.4, 1) both; transform-origin: center; }
.d4-chase-croc svg { width: 100%; height: auto; overflow: visible; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.22)); }
.d4-chase-num { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(42px, 11vw, 66px); line-height: 1; color: #1F7A4D; display: inline-flex; }
.d4-numwiggle { animation: d4numwiggle 0.7s ease-in-out 0.6s both; transform-origin: center; }
/* s7: slotdagi timsoh kattaroq son (8, chapda) tomon hujum qiladi */
.d4-slotchase { animation: d4slotchase 1.3s ease-in-out both; transform-origin: center; }
@keyframes d4chaserun {
  0% { transform: translateX(-46px) scaleX(0.9); opacity: 0.25; }
  46% { transform: translateX(0) scaleX(1); opacity: 1; }
  60% { transform: translateX(3px) scale(1.1); }
  73% { transform: translateX(0) scale(0.94); }
  100% { transform: translateX(0) scale(1); }
}
@keyframes d4numwiggle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  28% { transform: scale(1.28) rotate(-7deg); }
  52% { transform: scale(0.9) rotate(6deg); }
  76% { transform: scale(1.1) rotate(-3deg); }
}
@keyframes d4slotchase {
  0% { transform: translateX(0) scaleX(1); }
  45% { transform: translateX(-9px) scaleX(1.06); }
  60% { transform: translateX(-7px) scaleX(0.9); }
  100% { transform: translateX(-5px) scaleX(1); }
}

/* son tokeni */
.d4-numtile { font-family: 'Manrope', sans-serif; font-weight: 800; color: #0E0E10; font-size: clamp(40px, 9vw, 64px); line-height: 1; display: inline-flex; align-items: center; justify-content: center; min-width: 1.1em; }
.d4-opt-txt { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px, 1.9vw, 17px); }

/* s6 — uchta belgi misollari */
.d4-signrow { display: flex; align-items: center; justify-content: center; gap: clamp(16px, 6vw, 56px); flex-wrap: wrap; }
.d4-signex { display: flex; align-items: center; gap: clamp(6px, 1.6vw, 12px); }
.d4-signex .d4-numtile { font-size: clamp(28px, 6vw, 42px); }

/* s7 — slot + belgi chiplari */
.d4-slot { min-width: clamp(56px, 14vw, 86px); min-height: clamp(56px, 14vw, 86px); display: inline-flex; align-items: center; justify-content: center; background: #FFFFFF; border-radius: 16px; box-shadow: inset 0 0 0 2px #E4DED4; }
.d4-slot-ok { box-shadow: inset 0 0 0 2px #1F7A4D; background: #E3F0E8; }
.d4-slot-empty { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(34px, 8vw, 52px); color: #C7C0B4; }
.d4-tray { display: flex; gap: clamp(10px, 2.6vw, 18px); justify-content: center; flex-wrap: wrap; }
.d4-chip { background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(8px, 1.8vw, 14px) clamp(16px, 3vw, 24px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
.d4-chip:hover:not(:disabled) { transform: translateY(-2px); }
.d4-chip:disabled { cursor: default; }
.d4-chip-wrong { opacity: 0.32; }

/* s10 — tartiblash rozetkasi */
.d4-orderrow { display: flex; align-items: flex-end; justify-content: center; gap: clamp(12px, 4vw, 36px); flex-wrap: wrap; }
.d4-orderrow .g1-housebtn { position: relative; }
.d4-rank { position: absolute; top: 6px; right: 8px; background: #1F7A4D; color: #FFFFFF; font-weight: 800; font-size: clamp(13px, 1.8vw, 16px); width: 1.7em; height: 1.7em; border-radius: 99px; display: flex; align-items: center; justify-content: center; }

/* kichik savat varianti (MC test ekranlarida balandlikni kamaytirish: s4 / s8 / s11) */
.d4-baskets-sm .d4-basket { width: clamp(92px, 22vw, 132px); }

/* s1 — har bir meva alohida bosiladi (sanash) */
.d4-tapcol { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d4-tapbasket { transition: filter 0.2s, transform 0.2s; }
.d4-tapbasket-on { filter: drop-shadow(0 0 0 rgba(31,122,77,0)); }
.d4-tapbasket-on .d4-basket .g1-rb-svg { filter: drop-shadow(0 8px 16px rgba(31,122,77,0.35)); }
.d4-tapbasket-done .d4-basket .g1-rb-svg { filter: drop-shadow(0 6px 12px rgba(31,122,77,0.45)); }
/* tugma-meva: scatter tashqi tugmada (static), pulse/bob ichki .d4-fruit-bob da */
.d4-tapfruit { background: none; border: none; padding: 0; position: relative; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.d4-tapfruit:not(:disabled) .d4-fruit-bob { animation: d4tappulse 1.8s ease-in-out infinite; }
.d4-tapfruit-done { opacity: 0.34; cursor: default; }
.d4-tapfruit-done .d4-fruit-bob { animation: none; }
.d4-tapcheck { position: absolute; right: -2px; bottom: -2px; font-size: 0.7em; font-weight: 800; color: #1F7A4D; line-height: 1; }
@keyframes d4tappulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }

/* hovli sahnasi (sIntro/sGuest/s12): personaj + savat YONMA-YON, yerda; markaz bo'sh emas */
.d4-scene .g1-cast-row { gap: clamp(20px, 7vw, 80px); }
.d4-castpair { display: flex; align-items: flex-end; gap: clamp(2px, 1.4vw, 10px); }

/* === USTDAN ko'rinish savat (s0/s1/s4/s8/s10/s11/sd) — mevalar aniq rim ichida, zich, sanaladigan === */
.d4-topbasket { position: relative; width: clamp(128px, 30vw, 188px); aspect-ratio: 1 / 0.9; }
.d4-baskets-sm .d4-topbasket { width: clamp(96px, 23vw, 134px); }
.d4-toprim { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.28)); }
.d4-topbowl { position: absolute; left: 18%; right: 18%; top: 19%; bottom: 23%; container-type: size; display: flex; flex-wrap: wrap; align-items: center; align-content: center; justify-content: center; gap: 0; }
.d4-tfruit { flex: 0 0 auto; width: min(calc(100cqw / var(--cols, 3)), calc(100cqh / var(--rows, 2))); height: min(calc(100cqw / var(--cols, 3)), calc(100cqh / var(--rows, 2))); display: inline-flex; align-items: center; justify-content: center; position: relative; }
.d4-tfruit-bob { width: 100%; height: 100%; display: inline-flex; animation: d4bob 2.8s ease-in-out infinite; }
.d4-tfruit svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.18)); }
.d4-tapfruit:not(:disabled) .d4-tfruit-bob { animation: d4tappulse 1.8s ease-in-out infinite; }
.d4-tapfruit-done .d4-tfruit-bob { animation: none; }
.d4-counttop { width: clamp(96px, 24vw, 140px); }
.d4-ordertop { width: clamp(100px, 24vw, 142px); }
.d4-sdtop { width: clamp(112px, 27vw, 162px); }
.d4-counttop .d4-topbasket, .d4-ordertop .d4-topbasket, .d4-sdtop .d4-topbasket { width: 100%; }
.d4-topbasket-on .d4-toprim { filter: drop-shadow(0 8px 16px rgba(31,122,77,0.40)); }
.d4-topbasket-done .d4-toprim { filter: drop-shadow(0 6px 12px rgba(31,122,77,0.50)); }

/* pufakcha TO'G'RIDAN-TO'G'RI bo'sh savat ustida turadi; personaj yonida */
.d4-basketstack { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: clamp(2px, 1vw, 6px); }

/* o'ylov pufakchasi (sIntro/sGuest/s12): savat ustida, ichida USTDAN ko'rinish */
.d4-bubble { position: relative; display: flex; flex-direction: column; align-items: center; }
.d4-bubble-body { background: #FFFFFF; border-radius: 50% / 44%; box-shadow: 0 6px 18px -6px rgba(58,53,48,0.28); padding: clamp(6px,1.6vw,12px); display: flex; align-items: center; justify-content: center; }
.d4-bubble-body .d4-topbasket { width: clamp(46px, 12vw, 74px); }
.d4-bubble-tail { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 2px; }
.d4-bubble-dot { background: #FFFFFF; border-radius: 50%; box-shadow: 0 2px 5px -1px rgba(58,53,48,0.25); }
.d4-bubble-dot1 { width: 10px; height: 10px; }
.d4-bubble-dot2 { width: 6px; height: 6px; }
/* yig'ish sahnasida pufakcha savatining ichki to'lishi (s12 ham) */
.d4-scene-sum .g1-cast-fig { height: clamp(96px, 22vw, 168px); }

/* s1 — qisqa izoh chizig'i (BitSays karta o'rniga) */
.d4-framenote { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px, 1.8vw, 15px); color: #8A8780; }

/* s1 — "shu yerga bos" qo'l ko'rsatkichi (faol savat ustida, 0 sanalganda) */
.d4-tapwrap { position: relative; }
.d4-taphand { position: absolute; right: 6%; bottom: 8%; width: clamp(30px, 7vw, 46px); pointer-events: none; z-index: 3; animation: d4taphand 1.3s ease-in-out infinite; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.3)); }
.d4-taphand svg { width: 100%; height: auto; display: block; }
@keyframes d4taphand { 0%, 100% { transform: translate(0, 0) rotate(-6deg); } 50% { transform: translate(-3px, -6px) rotate(-6deg); } }

@media (prefers-reduced-motion: reduce) {
  .d4-mount, .d4-mount-r, .d4-croc-anim, .d4-fruit-bob, .d4-tapfruit, .d4-fruit, .d4-tfruit-bob, .d4-tfruit, .d4-taphand, .d4-chase-croc, .d4-numwiggle, .d4-slotchase { animation: none; }
}


/* ============================================================ */
/* DARS05 — sonning tarkibi: ten-frame ikki rangli (qizil/ko'k) */
/* ============================================================ */

/* BondFrame — 5 katakli ramka */
.g1-bf { display: inline-flex; gap: clamp(5px, 1.4vw, 10px); padding: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); }
.g1-bf-cell { width: clamp(38px, 8vw, 52px); height: clamp(38px, 8vw, 52px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); display: flex; align-items: center; justify-content: center; }
.g1-bf-cell.on { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.13); }
.g1-bf-dot { width: 64%; height: 64%; border-radius: 50%; display: inline-block; transition: background 0.4s ease; box-shadow: inset 0 -3px 5px rgba(0,0,0,0.18), inset 0 3px 4px rgba(255,255,255,0.32); }
.g1-bf-dot-r { background: #EE5436; }
.g1-bf-dot-b { background: #149AD0; }
.g1-bf-q { font-weight: 800; font-size: clamp(20px, 4vw, 28px); color: #B6B2AB; }
.g1-bf-ap { width: 80%; height: 80%; display: inline-flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.2)); }
.g1-bf-ap svg { width: 100%; height: 100%; }
.g1-bf-pop { animation: g1pop 0.4s ease-out; }
.g1-bf-tap { background: #FFFFFF; box-shadow: none; padding: 0; }
.g1-bf-btn { border: none; cursor: pointer; padding: 0; transition: transform 0.15s ease; }
.g1-bf-btn:hover { transform: translateY(-2px); }
.g1-bf-btn:active { transform: scale(0.93); }

/* NumTile — MC son varianti */
.g1-numtile { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(28px, 6vw, 42px); color: #0E0E10; }

/* PairCard — qizil/ko'k nuqta juftlari (s9) */
.g1-paircard { display: inline-flex; align-items: center; gap: clamp(5px, 1.4vw, 9px); background: #FFFFFF; border-radius: 14px; padding: clamp(8px, 1.8vw, 12px) clamp(10px, 2.2vw, 14px); box-shadow: 0 5px 14px -6px rgba(58,53,48,0.18); }
.g1-pc-grp { display: inline-flex; gap: clamp(3px, 1vw, 5px); }
.g1-pc-ap { width: clamp(16px, 3.6vw, 22px); height: clamp(16px, 3.6vw, 22px); display: inline-flex; }
.g1-pc-ap svg { width: 100%; height: 100%; }
.g1-pc-div { width: 2px; align-self: stretch; min-height: clamp(20px, 5vw, 30px); background: rgba(58,53,48,0.18); border-radius: 2px; }
.g1-paircard-big .g1-pc-ap { width: clamp(22px, 4.8vw, 30px); height: clamp(22px, 4.8vw, 30px); }

/* BondAuto — qoida avto-aylanuvchi ramka + qism yorliqlari */
.g1-bondcycle { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.2vw, 16px); }
.g1-bc-parts { display: inline-flex; align-items: center; gap: clamp(8px, 2vw, 14px); background: #FFFFFF; border-radius: 99px; padding: clamp(5px, 1.2vw, 8px) clamp(14px, 2.8vw, 20px); box-shadow: 0 5px 14px -6px rgba(58,53,48,0.16); }
.g1-bc-part { font-weight: 800; font-size: clamp(22px, 4.4vw, 32px); transition: color 0.4s ease; min-width: 1em; text-align: center; }
.g1-bc-r { color: #EE5436; }
.g1-bc-b { color: #3E9B3A; }
.g1-bc-and { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(13px, 1.8vw, 16px); color: #A7A6A2; }

/* FillExplore — tap-to-fill */
.g1-fillrow { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2.2vw, 16px); }
.g1-fillcnt { font-weight: 800; font-size: clamp(22px, 4.4vw, 32px); min-width: 1.1em; text-align: center; }
.g1-explore-hint { text-align: center; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px, 1.8vw, 15px); color: #5A5A60; margin: clamp(10px, 2vw, 14px) 0 0; }

/* ha/yo'q variant matni (s8) */
.g1-opt-txt { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(15px, 2.2vw, 19px); }

/* s10 juftlash */
.g1-m-tiles { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.g1-m-frames { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); align-items: center; }
.g1-m-frame { background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(5px, 1.2vw, 9px); box-shadow: 0 5px 14px -6px rgba(58,53,48,0.18); transition: transform 0.16s ease, box-shadow 0.16s ease; }
.g1-m-frame:hover:not(:disabled) { transform: translateY(-2px); }
.g1-m-frame-ok { box-shadow: 0 0 0 2px #1F7A4D, 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-m-frame:disabled { cursor: default; }

/* CompStory sahnasidagi BondFrame (personajlar orasida, kichikroq) */
.g1-comp-frame { align-self: flex-end; display: inline-flex; align-items: flex-end; }
.g1-comp-frame .g1-bf { padding: clamp(5px, 1.2vw, 8px); gap: clamp(3px, 1vw, 6px); }
.g1-comp-frame .g1-bf-cell { width: clamp(20px, 4.6vw, 32px); height: clamp(20px, 4.6vw, 32px); border-radius: 8px; }

@media (prefers-reduced-motion: reduce) {
  .g1-bf-pop, .g1-bf-btn, .g1-bf-dot, .g1-bc-part { animation: none; transition: none; }
}

/* sd o'yini — maqsad chipi */
.g1-sd-target { display: inline-flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); background: #FFF1EE; border-radius: 99px; padding: clamp(5px, 1.2vw, 8px) clamp(14px, 2.8vw, 20px); box-shadow: inset 0 0 0 2px rgba(255,79,40,0.2); }
.g1-sd-target-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px, 1.9vw, 16px); color: #5A5A60; }
.g1-sd-target-num { font-weight: 800; font-size: clamp(22px, 3.4vw, 30px); }

/* NumberBond — qism-butun gilos diagrammasi (CPA tasviriy) */
.g1-nb { width: clamp(140px, 33vw, 184px); height: auto; }
.g1-bondcpa { display: flex; align-items: center; justify-content: center; gap: clamp(14px, 3.4vw, 30px); flex-wrap: wrap; }
.g1-nb-sm .g1-nb { width: clamp(118px, 28vw, 148px); }

`;
