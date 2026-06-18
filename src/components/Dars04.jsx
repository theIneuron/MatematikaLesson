// ============================================================
// УРОК nat_5_04 — Умножение столбиком, 5 класс (11 экранов).
// Пересборка под актуальную infrastructure_v1 (двухрежимный движок, 06.06.2026):
//   - инфраструктура строка-в-строку из infrastructure_v1 (фетч 11:37):
//     playSegment с развилкой по ttsApiBase -> HTTP <audio>+buildTtsUrl (платформа)
//     либо playSegmentPreview/Web Speech (artifacts, пустой ttsApiBase);
//     configureLesson, useSfx + чайм-фолбэк, gradeAnswer, stripAudioTags,
//     useAudio (resume-по-жесту), QuestionScreen, NumInputScreen, FeedbackBlock.
//   - КОРНЕВОЙ = default export = сам урок (platform_contract §1):
//     { studentName, lang, ttsApiBase, correctSoundUrl, wrongSoundUrl,
//       aiGradingEndpoint, onFinished }; isPreview = (lang == null);
//     preview RU/UZ-тумблер; БЕЗ Preview-обёртки, БЕЗ хардкода ttsApiBase.
//     Озвучка превью — Web Speech через пустой ttsApiBase (зашито в движок).
//   - finishedRef-гард в корне: onFinished ровно один раз (platform_contract §2).
//     Урочный summary (Screen10) — из v13 как есть; гард обезвреживает on-mount-вызов.
//   - УЗ-терминология (правки методиста, на валидации узб. методиста):
//     умножение -> "karra"; "в уме" -> "dilda" (с аффиксом -> "dildagi").
// Урочный слой (CONTENT, LESSON_META, SCREEN_META, math-визуализаторы, экраны) —
// из nat_5_04_v13.jsx без изменений, кроме двух терминологических правок выше.
// ============================================================

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

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
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS: {base}/api/tts?text=<теги+текст, encoded>&g=m|f
// Если в тексте уже есть языковой тег (смешанные языки) — свой не добавляем.
function buildTtsUrl(base, text, lang, gender) {
  const tag = LANG_TAG[lang] || LANG_TAG.ru;
  const raw = String(text);
  const tagged = TAG_RE.test(raw) ? raw : `${tag} ${raw}`;
  const enc = encodeURIComponent(tagged.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
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

  setLang(lang) { this.currentLang = lang; }

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

    const lang = segment.lang || this.currentLang;
    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, lang, gender);
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
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  <button className="btn-white-accent" disabled={disabled} onClick={onClick}
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev }) => {
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

    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || c.audio.on_wrong[lang];
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(17px, 2.5vw, 24px)' }}>
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            if (solved) {
              if (i === correctIdx) cls += ' option-correct';
              else if (isWrongPicked) cls += ' option-picked-wrong';
              else cls += ' option-wrong';
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : T.ink3 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass={c[`hint_${picked}`] ? 'frame-tip' : undefined}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {solved ? t(c.correct_text) : t(c[`hint_${picked}`] || c[`wrong_${picked}`] || c.wrong_default)}
          </p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// ============================================================
// NUM INPUT SCREEN — числовой ввод: веди-до-верного + наводящая подсказка,
// счёт первой попытки. CONTENT-поля: question, base?, placeholder, btn_check,
// hint, audio_hint? (обязателен, если в hint цифры — числа словами),
// fb_correct, audio: { intro, on_correct, on_wrong? }
// ============================================================
const NumInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();
  const correct = Number(correctValue);
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [value, setValue] = useState(wasSolved ? String(correct) : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = parseInt(value, 10); if (isNaN(v)) return;
    const isCorrect = v === correct;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(v); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: String(correct), studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c.audio_hint && c.audio_hint[lang]) || (c.hint && c.hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(17px, 2.5vw, 24px)' }}>
        <div className="fade-up"><h2 className="title h-sub">{t(c.question)}</h2></div>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {c.base && <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 }}>{t(c.base)}</span>}
          {c.base && <span className="mop">≈</span>}
          <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.hint)}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

const ArrowLeft = ({ color }) => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 7H3"/><path d="M9 1 3 7l6 6"/>
  </svg>
);

// Моноширинный контекст: ch-ширина черты считается тем же шрифтом, что и числа,
// поэтому черта точно доходит до краёв самого широкого числа.
const MONO = { fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(20px, 4.4vw, 30px)', lineHeight: 1.5 };

const ColRow = ({ children, caption, captionColor, numStyle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={numStyle}>{children}</div>
    {caption && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: captionColor }}>
        <ArrowLeft color={captionColor}/>
        <span className="mono small" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{caption}</span>
      </div>
    )}
  </div>
);

const renderNum = (str, color, shift, animate) => {
  const chars = String(str).split('');
  const n = chars.length;
  const out = chars.map((ch, i) => (
    <span key={i} className={animate ? 'mb-pop' : undefined}
      style={{ color, fontWeight: 700, animationDelay: animate ? `${(n - 1 - i) * 0.16}s` : undefined }}>{ch}</span>
  ));
  for (let k = 0; k < (shift || 0); k++) out.push(<span key={`sp${k}`}>{'\u00A0'}</span>);
  return out;
};

// ============================================================
// ЛЕСОН-ВИЗУАЛИЗАТОР — столбик умножения (перенос из nat_5_04 v9).
// Раскладка как в учебнике: «×»/«+» слева вплотную к числу; цифры —
// разряд под разрядом по правому краю; неполные произведения со сдвигом.
// Цвета: единицы — accent (оранжевый), десятки/сотни — blue, нулевая
// строка — ink3 (серый), результат — success (зелёный).
// ============================================================
const MulBoard = ({ top, mult, partials, result }) => {
  const eff = (p) => p.digits.length + (p.shift || 0);
  const multLen = mult.reduce((a, m) => a + String(m.d).length, 0) + 2;
  const maxLen = Math.max(top.length, multLen, ...partials.map(p => eff(p) + 2), result ? result.digits.length : 0);
  const W = `${maxLen}ch`;
  const numStyle = { ...MONO, whiteSpace: 'pre', textAlign: 'right', minWidth: W };
  const rule = <div style={{ ...MONO, height: 2, background: T.ink, width: W, margin: '4px 0', borderRadius: 1 }}/>;
  const sp = (n) => '\u00A0'.repeat(n || 0);
  const op = (c) => <span style={{ color: T.ink2, fontWeight: 700 }}>{c}</span>;
  const addAt = (result && partials.length >= 2) ? partials.length - 1 : -1;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <ColRow numStyle={numStyle}>{top}</ColRow>
      <ColRow numStyle={numStyle}>
        {op('\u00D7 ')}{mult.map((m, i) => <span key={i} style={{ color: m.color, fontWeight: 600 }}>{m.d}</span>)}
      </ColRow>
      {rule}
      {partials.map((p, i) => (
        <ColRow key={i} numStyle={numStyle} caption={p.caption} captionColor={p.color}>
          {i === addAt ? op('+ ') : null}<span style={{ color: p.color, fontWeight: 600 }}>{p.digits}</span>{sp(p.shift)}
        </ColRow>
      ))}
      {result && (<>{rule}<ColRow numStyle={numStyle}><span style={{ color: result.color || T.success, fontWeight: 700 }}>{result.digits}</span></ColRow></>)}
    </div>
  );
};

// Поэтапный столбик: разбор умножения цифры за цифрой.
// rows: [{ digits, shift, color, caption, kind?, work?:[{a,b,carryIn?}], active }]
const WorkChip = ({ w, color, delay, isLast }) => {
  const prod = w.a * w.b;
  const withCarry = prod + (w.carryIn || 0);
  const carryOut = (!isLast && withCarry >= 10) ? Math.floor(withCarry / 10) : 0;
  return (
    <span className="mb-chip mb-pop" style={{ animationDelay: `${delay}s` }}>
      <span className="mono">{w.a} × {w.b}</span>
      {w.carryIn ? <span className="mono" style={{ color: T.ink3 }}> + {w.carryIn}</span> : null}
      <span className="mono"> = </span>
      <span className="mono" style={{ color, fontWeight: 700 }}>{withCarry}</span>
      {carryOut ? <sup className="mb-carry" style={{ color: T.accent }}>+{carryOut}</sup> : null}
    </span>
  );
};

const MulColumnStepwise = ({ top, mult, rows, result }) => {
  const eff = (r) => r.digits.length + (r.shift || 0);
  const multLen = mult.reduce((a, m) => a + String(m.d).length, 0) + 2;
  const maxLen = Math.max(top.length, multLen, ...rows.map(r => eff(r) + 2), result ? result.digits.length : 0);
  const W = `${maxLen}ch`;
  const numStyle = { ...MONO, whiteSpace: 'pre', textAlign: 'right', minWidth: W };
  const rule = <div style={{ ...MONO, height: 2, background: T.ink, width: W, margin: '4px 0', borderRadius: 1 }}/>;
  const op = (c) => <span style={{ color: T.ink2, fontWeight: 700 }}>{c}</span>;
  const addAt = (result && rows.length >= 2) ? rows.length - 1 : -1;
  const activeRow = rows.find(r => r.active && r.kind !== 'zero' && r.work);
  const activeZero = rows.find(r => r.active && r.kind === 'zero');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', width: '100%', alignItems: 'center' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <ColRow numStyle={numStyle}>{top}</ColRow>
        <ColRow numStyle={numStyle}>
          {op('\u00D7 ')}{mult.map((m, i) => <span key={i} style={{ color: m.color, fontWeight: 600 }}>{m.d}</span>)}
        </ColRow>
        {rule}
        {rows.map((r, i) => (
          <ColRow key={i} numStyle={numStyle} caption={r.caption} captionColor={r.color}>
            {i === addAt ? op('+ ') : null}{renderNum(r.digits, r.color, r.shift, !!r.active)}
          </ColRow>
        ))}
        {result && (<>{rule}<ColRow numStyle={numStyle}>{renderNum(result.digits, result.color || T.success, 0, true)}</ColRow></>)}
      </div>
      {(activeRow || activeZero) && (
        <div className="mb-work">
          <div className="mb-work-title mono small" style={{ color: (activeRow || activeZero).color }}>
            {(activeRow || activeZero).caption}
          </div>
          <div className="mb-work-chips">
            {activeRow
              ? activeRow.work.map((w, i) => <WorkChip key={i} w={w} color={activeRow.color} delay={i * 0.18} isLast={i === activeRow.work.length - 1}/>)
              : <span className="mb-chip mb-pop"><span className="mono">{top} × 0 = 0</span></span>}
          </div>
        </div>
      )}
    </div>
  );
};

// Распределительный принцип: наглядное «почему» столбик раскладывает по разрядам.
const DistributiveWhy = ({ top, mult, tens, units, caption }) => {
  const t = useT();
  const lineStyle = { fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(15px, 2.4vw, 19px)', lineHeight: 1.5 };
  return (
    <div className="frame-tip fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
        <span className="mb-pop" style={{ ...lineStyle, animationDelay: '0s', fontWeight: 700 }}>{top} × {mult}</span>
        <span className="mb-pop" style={{ ...lineStyle, animationDelay: '0.5s' }}>= {top} × (<b style={{ color: T.blue }}>{tens}</b> + <b style={{ color: T.accent }}>{units}</b>)</span>
        <span className="mb-pop" style={{ ...lineStyle, animationDelay: '1s' }}>= <b style={{ color: T.blue }}>{top} × {tens}</b> + <b style={{ color: T.accent }}>{top} × {units}</b></span>
      </div>
      {caption && <p className="body" style={{ margin: 0 }}>{t(caption)}</p>}
    </div>
  );
};

const UI = {
  hint:         { ru: 'Подсказка', uz: 'Maslahat' },
  hide:         { ru: 'Скрыть подсказку', uz: 'Maslahatni yashirish' },
  solution:     { ru: 'Решение', uz: 'Yechim' },
  showSolution: { ru: 'Показать решение', uz: "Yechimni ko'rsatish" },
  replay:       { ru: '↻ Повторить', uz: '↻ Qaytarish' },
  tryAgain:     { ru: 'Не сходится. Загляни в подсказку и попробуй ещё раз.', uz: "To'g'ri kelmadi. Maslahatga qarang va yana urinib ko'ring." },
  retryOk:      { ru: 'Теперь верно. В счёт идёт первая попытка.', uz: "Endi to'g'ri. Hisobga birinchi urinish kiradi." },
  gaveUp:       { ru: 'Ничего страшного. Посмотри разбор решения ниже.', uz: "Hechqisi yo'q. Quyida yechim tahlilini ko'ring." },
  wrongAudio:   { ru: 'Не совсем. Попробуй ещё раз.', uz: "Unchalik emas. Yana urinib ko'ring." }
};

// Math-вариант HintToggle (math-секция v1.1): раскрытая подсказка — жёлтый .frame-tip.
const HintToggle = ({ hint }) => {
  const t = useT();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  if (!hint) return null;
  return (
    <div>
      <button className="hint-toggle" onClick={() => setOpen(o => !o)}>
        {open ? UI.hide[lang] : `? ${UI.hint[lang]}`}
      </button>
      {open && (
        <div className="frame-tip" style={{ marginTop: 8 }}>
          <p className="body" style={{ margin: 0 }}>{t(hint)}</p>
        </div>
      )}
    </div>
  );
};

const RefNote = ({ idx }) => {
  const t = useT();
  const r = REFS[idx];
  if (!r) return null;
  return (
    <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
      <span style={{ flexShrink: 0, paddingTop: 3 }}><ArrowLeft color={T.ink3}/></span>
      <span className="small" style={{ color: T.ink3 }}>{t(r)}</span>
    </div>
  );
};

// CheckLabel (infra)
const CheckLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Tekshirish' : 'Проверить';
};

// Короткая озвучка ответа на верный ввод/выбор. Числа словами.
const ANSWER_VOICE = {
  '980':   { ru: 'Верно. Ответ девятьсот восемьдесят.', uz: "To'g'ri. Javob to'qqiz yuz sakson." },
  '3430':  { ru: 'Верно. Ответ три тысячи четыреста тридцать.', uz: "To'g'ri. Javob uch ming to'rt yuz o'ttiz." },
  '21939': { ru: 'Верно. Ответ двадцать одна тысяча девятьсот тридцать девять.', uz: "To'g'ri. Javob yigirma bir ming to'qqiz yuz o'ttiz to'qqiz." },
  '4464':  { ru: 'Верно. Ответ четыре тысячи четыреста шестьдесят четыре.', uz: "To'g'ri. Javob to'rt ming to'rt yuz oltmish to'rt." },
  '129792':{ ru: 'Верно. Ответ сто двадцать девять тысяч семьсот девяносто два.', uz: "To'g'ri. Javob bir yuz yigirma to'qqiz ming yetti yuz to'qson ikki." }
};

// ============================================================
// Озвученный авто-разбор умножения (паттерн AnimatedSolution из math-секции v1.1):
// реплика narr[i] открывает строку i (ухо=глаз); последняя реплика — заключение,
// на ней появляется результат; затем onDone (родитель разблокирует «Дальше»).
// «Повторить». Страховочный таймер (narr.length+1)*9000мс.
// narr длиной rows.length+1: по реплике на строку + заключение с суммой.
// ============================================================
const AnimatedMulSolution = ({ sol, onDone }) => {
  const lang = useLang();
  const narr = (sol.narr && sol.narr[lang]) || [];
  const rowCount = sol.rows.length;
  const lastIdx = narr.length - 1;
  const [runId, setRunId] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [reachedLast, setReachedLast] = useState(false);
  const doneRef = useRef(false);
  const fireDone = () => { if (!doneRef.current) { doneRef.current = true; onDone && onDone(); } };
  const segs = narr.map((text, i) => ({ id: `sol${i}`, text, trigger: i === 0 ? 'on_mount' : `solseq${i}`, waits_for: null, _r: runId }));
  const audio = useAudio(segs);
  useEffect(() => {
    const cs = audio.currentSegment;
    if (cs && cs.slice(0, 3) === 'sol') {
      const k = parseInt(cs.slice(3), 10);
      if (!isNaN(k)) { setMaxStep(m => Math.max(m, Math.min(k + 1, rowCount))); if (k >= lastIdx) setReachedLast(true); }
    }
  }, [audio.currentSegment]);
  useEffect(() => { if (reachedLast && !audio.isPlaying) fireDone(); }, [reachedLast, audio.isPlaying]);
  useEffect(() => { const id = setTimeout(fireDone, (narr.length + 1) * 9000); return () => clearTimeout(id); }, []);
  const onReplay = () => { setMaxStep(0); setReachedLast(false); setRunId(r => r + 1); };

  const shownRows = sol.rows.slice(0, maxStep).map((r, i) => ({ ...r, active: !reachedLast && i === maxStep - 1 }));
  const result = reachedLast ? sol.result : null;
  return (
    <div className="frame-success fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span className="mono small" style={{ color: T.success, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{UI.solution[lang]}</span>
        <button className="btn-ghost" onClick={onReplay} style={{ padding: 'clamp(7px, 1.2vw, 9px) clamp(12px, 1.8vw, 16px)', fontSize: 'clamp(12px, 1.4vw, 13px)' }}>{UI.replay[lang]}</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        <MulColumnStepwise top={sol.top} mult={sol.mult} rows={shownRows} result={result}/>
      </div>
      {reachedLast && narr[lastIdx] && <p className="body" style={{ margin: 0, color: T.ink2 }}>{narr[lastIdx]}</p>}
    </div>
  );
};

// ============================================================
// Интерактивный столбик умножения на ОДНУ цифру (s3).
// Ученик вписывает переносы над чертой и цифры результата под чертой.
// «Проверить» — только когда заполнены все клетки; зачёт — полное совпадение.
// 3 неверные попытки → «Решение» → озвученный AnimatedMulSolution (narr из SOLUTIONS);
// «Дальше» откроется по окончании разбора. Первая попытка — в аналитику.
// DigitBox — math-секция v1.1 (высота 1.55em).
// ============================================================
const DigitBox = ({ value, onChange, status, locked, label, faded, len = 1 }) => (
  <input
    type="text" inputMode="numeric" maxLength={len} value={value} disabled={locked}
    aria-label={label}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(-len))}
    style={{
      width: len > 1 ? '2.2em' : '1.55em', height: '1.55em', padding: 0, textAlign: 'center',
      fontFamily: MONO.fontFamily, fontWeight: 700, fontSize: faded ? '0.66em' : '1em',
      color: status === 'wrong' ? T.accent : (status === 'ok' ? T.success : T.ink),
      background: T.paper, borderRadius: 7, border: 'none', outline: 'none',
      boxShadow: status === 'wrong' ? `0 0 0 2px ${T.accent}`
        : (status === 'ok' ? `0 0 0 2px ${T.success}` : 'inset 0 0 0 1.5px rgba(58, 53, 48, 0.18)'),
      transition: 'box-shadow 0.15s, color 0.15s'
    }}
  />
);

// Решатель ×однозначное. onResolved({ firstOk, solved, attempts }) — один раз.
// narrSol — SOLUTIONS-объект с narr для озвученного разбора при «Показать решение».
const MulColumnSolver = ({ top, mul, result, texts, narrSol, onResolved }) => {
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const mulNum = parseInt(mul, 10);
  const dU = String(top).split('').map(Number).reverse();   // единицы первыми
  const writes = []; const carryInto = []; let carry = 0;
  for (let j = 0; j < dU.length; j++) {
    carryInto[j] = carry;
    const p = dU[j] * mulNum + carry;
    writes[j] = p % 10;
    carry = Math.floor(p / 10);
  }
  if (carry > 0) { carryInto.push(carry); writes.push(carry % 10); }
  const resStr = writes.slice().reverse().join('');
  const n = resStr.length;
  const topD = String(top).padStart(n, ' ').split('');
  const expResByPos = writes;
  const expCarryByPos = carryInto;

  const [res, setRes] = useState(Array(n).fill(''));
  const [above, setAbove] = useState(Array(n).fill(''));
  const [solved, setSolved] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const firstRef = useRef(null);
  const attemptsRef = useRef(0);
  const resolvedRef = useRef(false);
  const locked = solved || gaveUp;

  const aboveExp = (d) => { const j = n - 1 - d; return (j >= 1 && expCarryByPos[j] > 0) ? String(expCarryByPos[j]) : null; };
  const allAboveFilled = Array.from({ length: n }).every((_, d) => aboveExp(d) === null || above[d] !== '');
  const allFilled = res.every(v => v !== '') && allAboveFilled;
  const allOk = res.every((v, d) => v === String(expResByPos[n - 1 - d]))
    && Array.from({ length: n }).every((_, d) => { const e = aboveExp(d); return e === null || above[d] === e; });

  const fire = (solvedFlag) => { if (!resolvedRef.current) { resolvedRef.current = true; onResolved && onResolved({ firstOk: firstRef.current === 'ok', solved: solvedFlag, attempts: attemptsRef.current }); } };
  const doCheck = () => {
    if (locked || !allFilled) return;
    const ok = allOk;
    attemptsRef.current += 1;
    if (firstRef.current === null) firstRef.current = ok ? 'ok' : 'wrong';
    if (ok) { setSolved(true); setWrongFlash(false); sfx.playCorrect(); fire(true); }
    else { setWrongFlash(true); setWrongCount(w => w + 1); sfx.playWrong(); }
  };
  // «Показать решение»: ввод остаётся, играет озвученный разбор; «Дальше» — по его окончании (fire в onDone).
  const reveal = () => { if (firstRef.current === null) firstRef.current = 'wrong'; setGaveUp(true); };
  const cellStatus = () => solved ? 'ok' : 'idle';

  const numStyle = { fontFamily: MONO.fontFamily, fontWeight: 600, fontSize: 'clamp(20px, 5vw, 26px)', color: T.ink, textAlign: 'center', minWidth: '1.55em', display: 'inline-block', lineHeight: 1 };
  const cells = [];
  for (let d = 0; d < n; d++) {
    const gc = d + 2;
    const ae = aboveExp(d);
    if (ae !== null) {
      cells.push(<div key={`a${d}`} style={{ gridColumn: gc, gridRow: 1, display: 'flex', justifyContent: 'center' }}>
        <DigitBox value={above[d]} onChange={(v) => { if (!locked) { setWrongFlash(false); setAbove(p => { const a = [...p]; a[d] = v; return a; }); } }} status={cellStatus()} locked={locked} faded len={1} label={`перенос над разрядом ${n - d}`}/>
      </div>);
    }
    cells.push(<div key={`t${d}`} style={{ gridColumn: gc, gridRow: 2, ...numStyle }}>{topD[d] === ' ' ? '\u00A0' : topD[d]}</div>);
    cells.push(<div key={`m${d}`} style={{ gridColumn: gc, gridRow: 3, ...numStyle, color: T.accent }}>{d === n - 1 ? String(mul) : '\u00A0'}</div>);
    cells.push(<div key={`r${d}`} style={{ gridColumn: gc, gridRow: 5, display: 'flex', justifyContent: 'center' }}>
      <DigitBox value={res[d]} onChange={(v) => { if (!locked) { setWrongFlash(false); setRes(p => { const a = [...p]; a[d] = v; return a; }); } }} status={cellStatus()} locked={locked} label={`цифра результата, разряд ${n - d}`}/>
    </div>);
  }

  const hintLine = lang === 'uz'
    ? "Chiziq ustiga dilda saqlanadigan raqamlarni, ostiga javob raqamlarini yozing"
    : 'Над чертой впиши перенос (что держишь в уме), под чертой — цифры ответа';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
      {!locked && <p className="small" style={{ margin: 0, color: T.ink2 }}>{hintLine}</p>}
      <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(20px, 3.4vw, 26px) clamp(10px, 2vw, 18px) clamp(16px, 3vw, 24px)', overflowX: 'auto', boxShadow: (wrongFlash && !solved) ? `0 0 0 2px ${T.accent}, 0 8px 22px -6px rgba(58, 53, 48, 0.14)` : undefined }}>
        <div style={{ display: 'inline-grid', gridTemplateColumns: `auto repeat(${n}, auto)`, alignItems: 'center', columnGap: 'clamp(6px, 1.5vw, 10px)', rowGap: 4 }}>
          <div style={{ gridColumn: 1, gridRow: '2 / 4', alignSelf: 'center', justifySelf: 'center', ...numStyle, color: T.ink2 }}>{'\u00D7'}</div>
          <div style={{ gridColumn: `1 / ${n + 2}`, gridRow: 4, height: 2, background: T.ink, borderRadius: 1, margin: '4px 0' }}/>
          {cells}
        </div>
      </div>
      {!locked && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {wrongCount >= 3 && <button className="btn-ghost" onClick={reveal} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 19px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{UI.showSolution[lang]}</button>}
          <button className="btn-white-accent" disabled={!allFilled} onClick={doCheck} style={{ padding: 'clamp(11px, 1.8vw, 13px) clamp(20px, 2.6vw, 28px)', fontSize: 'clamp(13px, 1.6vw, 14px)' }}><CheckLabel/></button>
        </div>
      )}
      {wrongFlash && !solved && (
        <p className="small" style={{ margin: 0, color: T.accent }}>{lang === 'uz' ? "Hali mos emas — qaytadan tekshiring" : 'Пока не сходится — проверь и нажми ещё раз'}</p>
      )}
      {solved && (
        <div className="frame-success fade-up">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
          <p className="body" style={{ margin: 0 }}>{firstRef.current === 'ok' ? (texts && texts.correct ? t(texts.correct) : '') : UI.retryOk[lang]}</p>
        </div>
      )}
      {gaveUp && narrSol && <AnimatedMulSolution sol={narrSol} onDone={() => fire(false)}/>}
      {gaveUp && !narrSol && texts && texts.reveal && (
        <div className="frame-success fade-up"><p className="body" style={{ margin: 0 }}>{t(texts.reveal)}</p></div>
      )}
    </div>
  );
};

// Экран s3 — интерактив (умножение на одну цифру).
const InteractiveMulColumn = ({ idx, screen, totalScreens, storedAnswer, onAnswer, onNext, onPrev }) => {
  const c = CONTENT[`s${idx}`];
  const meta = SCREEN_META[idx];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [resolved, setResolved] = useState(storedAnswer !== undefined);

  const handleResolved = ({ firstOk, solved, attempts }) => {
    onAnswer({
      stage: meta.scope, screenIdx: idx,
      question: c.question ? c.question[lang] : null,
      correctAnswer: String(c.result),
      correct: firstOk,
      firstTry: firstOk,
      attempts,
      solved
    });
    setResolved(true);
    audio.triggerEvent('check_pressed');
    // верно → короткая озвучка ответа; «Решение» (give-up) озвучивает AnimatedMulSolution сам
    if (solved && ANSWER_VOICE[c.result] && !audio.muted) {
      setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ANSWER_VOICE[c.result][lang]); }, 250);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!resolved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: resolved ? 'clamp(11px, 1.8vw, 15px)' : 'clamp(16px, 2.5vw, 22px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          {resolved
            ? <p className="small" style={{ marginTop: 5, color: T.ink2 }}>{t(c.question)}</p>
            : <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>}
        </div>
        {!resolved && c.hint && <div className="fade-up delay-1"><HintToggle hint={c.hint}/></div>}
        <div className="fade-up delay-1"><MulColumnSolver top={c.top} mul={c.mul} result={c.result} texts={{ correct: c.fb_correct, reveal: c.fb_wrong }} narrSol={SOLUTIONS[idx]} onResolved={handleResolved}/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// Дорешивание на MC (вариант Б, утверждён методистом 06.06.2026):
// неполные произведения показаны готовыми (они разобраны в фидбэке по варианту),
// ученик РУКАМИ складывает строки со сдвигом — вводит цифры итоговой суммы.
// «Проверить» — когда заполнены все клетки; зачёт — полное совпадение.
// 3 неверных → «Показать решение» → озвученный AnimatedMulSolution.
// onResolved({ solved, attempts }) — один раз.
// ============================================================
const MulSumSolver = ({ sol, onResolved }) => {
  const lang = useLang();
  const sfx = useSfx();
  const expected = sol.result.digits;
  const W = expected.length;
  const topD = String(sol.top).padStart(W, ' ').split('');
  const multD = sol.mult.map(m => m.d);

  const [res, setRes] = useState(Array(W).fill(''));
  const [solved, setSolved] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const attemptsRef = useRef(0);
  const resolvedRef = useRef(false);
  const locked = solved || gaveUp;

  const allFilled = res.every(v => v !== '');
  const allOk = res.join('') === expected;

  const fire = (solvedFlag) => { if (!resolvedRef.current) { resolvedRef.current = true; onResolved && onResolved({ solved: solvedFlag, attempts: attemptsRef.current }); } };
  const doCheck = () => {
    if (locked || !allFilled) return;
    attemptsRef.current += 1;
    if (allOk) { setSolved(true); setWrongFlash(false); sfx.playCorrect(); fire(true); }
    else { setWrongFlash(true); setWrongCount(w => w + 1); sfx.playWrong(); }
  };
  const reveal = () => { setGaveUp(true); };
  const cellStatus = () => solved ? 'ok' : 'idle';

  const numStyle = { fontFamily: MONO.fontFamily, fontWeight: 600, fontSize: 'clamp(18px, 4.2vw, 23px)', color: T.ink, textAlign: 'center', minWidth: '1.55em', display: 'inline-block', lineHeight: 1 };
  const R = sol.rows.length;
  const cells = [];
  // верхнее число и множитель — по правому краю
  for (let d = 0; d < W; d++) {
    cells.push(<div key={`t${d}`} style={{ gridColumn: d + 2, gridRow: 1, ...numStyle }}>{topD[d] === ' ' ? '\u00A0' : topD[d]}</div>);
  }
  for (let k = 0; k < multD.length; k++) {
    const gc = 2 + (W - multD.length) + k;
    cells.push(<div key={`m${k}`} style={{ gridColumn: gc, gridRow: 2, ...numStyle, color: sol.mult[k].color, fontWeight: 600 }}>{multD[k]}</div>);
  }
  // строки неполных произведений (готовые), со сдвигом; знак «+» у последней
  sol.rows.forEach((r, ri) => {
    const L = r.digits.length;
    const s = r.shift || 0;
    for (let k = 0; k < L; k++) {
      const pos = s + (L - 1 - k);            // разряд цифры (0 = единицы)
      const gc = 2 + (W - 1 - pos);
      cells.push(<div key={`p${ri}_${k}`} style={{ gridColumn: gc, gridRow: 4 + ri, ...numStyle, color: r.color, fontWeight: 600 }}>{r.digits[k]}</div>);
    }
  });
  // клетки ввода суммы
  for (let d = 0; d < W; d++) {
    cells.push(<div key={`r${d}`} style={{ gridColumn: d + 2, gridRow: 5 + R, display: 'flex', justifyContent: 'center' }}>
      <DigitBox value={res[d]} onChange={(v) => { if (!locked) { setWrongFlash(false); setRes(p => { const a = [...p]; a[d] = v; return a; }); } }} status={cellStatus()} locked={locked} label={`цифра суммы, разряд ${W - d}`}/>
    </div>);
  }

  const hintLine = lang === 'uz'
    ? "Qatorlarni xonama-xona qo'shing. Surishni unutmang: o'ngdagi bo'sh joy nol degani"
    : 'Сложи строки по разрядам. Помни про сдвиг: пустое место справа считай нулём';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
      {!locked && <p className="small" style={{ margin: 0, color: T.ink2 }}>{hintLine}</p>}
      <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(20px, 3.4vw, 26px) clamp(10px, 2vw, 18px) clamp(16px, 3vw, 24px)', overflowX: 'auto', boxShadow: (wrongFlash && !solved) ? `0 0 0 2px ${T.accent}, 0 8px 22px -6px rgba(58, 53, 48, 0.14)` : undefined }}>
        <div style={{ display: 'inline-grid', gridTemplateColumns: `auto repeat(${W}, auto)`, alignItems: 'center', columnGap: 'clamp(5px, 1.3vw, 9px)', rowGap: 4 }}>
          <div style={{ gridColumn: 1, gridRow: '1 / 3', alignSelf: 'center', justifySelf: 'center', ...numStyle, color: T.ink2 }}>{'\u00D7'}</div>
          <div style={{ gridColumn: `1 / ${W + 2}`, gridRow: 3, height: 2, background: T.ink, borderRadius: 1, margin: '4px 0' }}/>
          <div style={{ gridColumn: 1, gridRow: 3 + R, alignSelf: 'center', justifySelf: 'center', ...numStyle, color: T.ink2 }}>{'+'}</div>
          <div style={{ gridColumn: `1 / ${W + 2}`, gridRow: 4 + R, height: 2, background: T.ink, borderRadius: 1, margin: '4px 0' }}/>
          {cells}
        </div>
      </div>
      {!locked && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {wrongCount >= 3 && <button className="btn-ghost" onClick={reveal} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 19px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{UI.showSolution[lang]}</button>}
          <button className="btn-white-accent" disabled={!allFilled} onClick={doCheck} style={{ padding: 'clamp(11px, 1.8vw, 13px) clamp(20px, 2.6vw, 28px)', fontSize: 'clamp(13px, 1.6vw, 14px)' }}><CheckLabel/></button>
        </div>
      )}
      {wrongFlash && !solved && (
        <p className="small" style={{ margin: 0, color: T.accent }}>{lang === 'uz' ? "Hali mos emas — qaytadan tekshiring" : 'Пока не сходится — проверь и нажми ещё раз'}</p>
      )}
      {solved && (
        <div className="frame-success fade-up">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "Endi to'g'ri" : 'Теперь верно'}</p>
          <p className="body" style={{ margin: 0 }}>{UI.retryOk[lang]}</p>
        </div>
      )}
      {gaveUp && sol.narr && <AnimatedMulSolution sol={sol} onDone={() => fire(false)}/>}
    </div>
  );
};

// ============================================================
// MC умножения с дорешиванием (паттерн QuestionScreenRetry урока 3):
// выбор один раз (анти-скролл: вопрос → строка, варианты → чипы).
// Верный → озвученный AnimatedMulSolution; «Дальше» — по окончании разбора.
// НЕВЕРНЫЙ → фидбэк по варианту (wrong_N) + СРАЗУ столбик MulSumSolver:
// ученик руками складывает готовые строки со сдвигом (вариант Б).
// В аналитику идёт первая попытка (firstTry); attempts копит и попытки в столбике.
// ============================================================
const MulQuestionRetry = ({ idx, screen, totalScreens, storedAnswer, onAnswer, onNext, onPrev }) => {
  const c = CONTENT[`s${idx}`];
  const meta = SCREEN_META[idx];
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const opts = [c.opt0, c.opt1, c.opt2, c.opt3].filter(o => o !== undefined);
  const correctIdx = c.correctIndex;
  const sol = SOLUTIONS[idx];
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);

  const restored = storedAnswer !== undefined;
  const [picked, setPicked] = useState(restored ? storedAnswer.studentAnswerIndex : null);
  const [firstDone, setFirstDone] = useState(restored);
  const [resolved, setResolved] = useState(restored ? storedAnswer.solved !== false : false);
  const [navReady, setNavReady] = useState(restored);
  const isCorrect = picked === correctIdx;

  const writeAnswer = (extra) => {
    onAnswer({
      stage: meta.scope, screenIdx: idx,
      question: c.question ? c.question[lang] : null,
      options: opts.map(o => o[lang]),
      correctIndex: correctIdx,
      correctAnswer: opts[correctIdx] ? opts[correctIdx][lang] : null,
      studentAnswerIndex: picked === null ? extra.pickedIdx : picked,
      studentAnswer: opts[picked === null ? extra.pickedIdx : picked] ? opts[picked === null ? extra.pickedIdx : picked][lang] : null,
      ...extra
    });
  };

  const pick = (i) => {
    if (firstDone) return;
    const ok = i === correctIdx;
    setPicked(i);
    setFirstDone(true);
    audio.triggerEvent('option_picked');
    if (ok) {
      setResolved(true);
      sfx.playCorrect();
      writeAnswer({ pickedIdx: i, correct: true, firstTry: true, attempts: 1, solved: true });
      // разбор (AnimatedMulSolution) озвучен сам; navReady откроет его onDone
    } else {
      sfx.playWrong();
      writeAnswer({ pickedIdx: i, correct: false, firstTry: false, attempts: 1, solved: false });
      if (!audio.muted) {
        setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
      }
    }
  };

  const handleSumResolved = ({ solved, attempts }) => {
    setResolved(true);
    setNavReady(true);
    writeAnswer({ correct: false, firstTry: false, attempts: 1 + attempts, solved });
    if (solved && ANSWER_VOICE[String(c.result)] && !audio.muted) {
      setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ANSWER_VOICE[String(c.result)][lang]); }, 250);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!navReady} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: firstDone ? 'clamp(11px, 1.8vw, 15px)' : 'clamp(16px, 2.5vw, 22px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          {firstDone
            ? <p className="small" style={{ marginTop: 5, color: T.ink2 }}>{t(c.question)}</p>
            : <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>}
        </div>
        {!firstDone && c.hint && <div className="fade-up delay-1"><HintToggle hint={c.hint}/></div>}
        {!firstDone ? (
          <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {opts.map((opt, i) => (
              <button key={i} className="option" onClick={() => pick(i)}
                style={{ padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{t(opt)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {opts.map((opt, i) => {
              const show = i === picked || (resolved && i === correctIdx);
              if (!show) return null;
              const isC = i === correctIdx;
              return (
                <span key={i} className="small" style={{ padding: '6px 12px', borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, background: isC ? T.successSoft : T.accentSoft, color: isC ? T.success : T.accent }}>
                  <span className="mono">{isC ? '✓' : '✗'}</span>
                  <span>{t(opt)}</span>
                </span>
              );
            })}
          </div>
        )}
        {firstDone && isCorrect && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}
            </p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
            {sol && <AnimatedMulSolution sol={sol} onDone={() => setNavReady(true)}/>}
          </div>
        )}
        {firstDone && !isCorrect && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="frame-tip" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">✗</span>{lang === 'uz' ? "Noto'g'ri" : 'Не совсем'}
              </p>
              <p className="body" style={{ margin: 0 }}>{t(c[`wrong_${picked}`] || c.wrong_default)}</p>
            </div>
            <span className="mono small" style={{ color: T.ink2, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {lang === 'uz' ? 'Ustun shaklida hisoblang' : 'Посчитай в столбике'}
            </span>
            {sol && <MulSumSolver sol={sol} onResolved={handleSumResolved}/>}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// Демо-разбор (s1, s5): поэтапный столбик + озвучка по шагам.
// s1 — добавляет распределительный «почему».
// ============================================================
const MulExploration = ({ idx, screen, totalScreens, onNext, onPrev, top, mult, rows, result, why }) => {
  const c = CONTENT[`s${idx}`];
  const t = useT();
  const lang = useLang();
  const segs = c.audio[lang].map((text, i) => ({
    id: `s${idx}_a${i}`, text,
    trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`,
    waits_for: { type: 'button_click', target: i < c.audio[lang].length - 1 ? 'step' : 'next' }
  }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const last = c.audio[lang].length - 1;
  const revealRows = Math.min(step + 1, rows.length);
  const activeIdx = Math.min(step, rows.length - 1);
  const shownRows = rows.slice(0, revealRows).map((r, i) => ({ ...r, active: i === activeIdx }));
  const showResult = step >= last;

  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : <NextLabel/>} onClick={handleStep}/></>);

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 22px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ textAlign: 'center' }}>{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(18px, 3.4vw, 28px) clamp(10px, 2vw, 18px)', overflowX: 'auto' }}>
          <MulColumnStepwise top={top} mult={mult} rows={shownRows} result={showResult ? result : null}/>
        </div>
        {why && showResult && <DistributiveWhy top={why.top} mult={why.mult} tens={why.tens} units={why.units} caption={c.why_caption}/>}
      </div>
    </Stage>
  );
};

// ============================================================
// Правило с готовым столбиком (s2, s6): правила + термин + ref + демо-доска.
// ============================================================
const MulRuleGold = ({ idx, screen, totalScreens, onNext, onPrev, rules, demo }) => {
  const c = CONTENT[`s${idx}`];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${idx}_a`, text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'next' } }]);
  const handleNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={handleNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.5vw, 24px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rules.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'start' }}>
              <div className="mono small" style={{ color: T.accent, fontWeight: 600, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</div>
              <div className="body" style={{ color: T.ink }}>{t(c[r])}</div>
            </div>
          ))}
          {c.term && (<div className="frame-tip" style={{ marginTop: 4 }}><p className="body" style={{ margin: 0 }}>{t(c.term)}</p></div>)}
        </div>
        {demo && (
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(16px, 3vw, 22px) clamp(12px, 2vw, 18px)' }}>
            <span className="eyebrow" style={{ color: T.accent }}>{lang === 'uz' ? 'Ustun shaklida tahlil' : 'Разбор в столбик'}</span>
            <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
              <MulColumnStepwise top={demo.top} mult={demo.mult} rows={demo.rows.map(r => ({ ...r, active: false }))} result={demo.result}/>
            </div>
          </div>
        )}
        <RefNote idx={idx}/>
      </div>
    </Stage>
  );
};

// ============================================================
// CONTENT — урок nat_5_04 (Умножение столбиком), 5 класс.
// Видео-блог; герой Шахзода, ошибается Бекзод. Вопрос урока:
// «Почему большие числа нельзя перемножить, просто сложив промежуточные
//  результаты?» Числа в визуале — цифрами; в аудио — словами (audio_rules).
// UZ — DRAFT, требует валидации узбекским методистом.
//   Особо: 'ustun shaklida' (столбиком), 'dilda saqlash' (держать в уме),
//   'ko'paytuvchi' (множитель), неполное произведение — без термина (описательно).
// ============================================================
const LESSON_META = {
  lessonId: 'nat-5-04-v13',
  lessonTitle: { ru: 'Умножение столбиком', uz: "Ustun shaklida ko'paytirish" },
  globalQuestion: {
    ru: 'Почему нельзя просто сложить промежуточные результаты?',
    uz: "Nega oraliq natijalarni shunchaki qo'shib bo'lmaydi?",
    posed_on: 's0', answered_on: 's10'
  }
};

const CONTENT = {
  // ===== s0 — HOOK: Бекзод умножает без сдвига =====
  s0: {
    eyebrow: { ru: 'Вопрос урока', uz: 'Dars savoli' },
    global_q: { ru: 'Куда уходят разряды при умножении?', uz: "Ko'paytirishda xonalar qayerga ketadi?" },
    claim_lead: {
      ru: 'Шахзода снимает видео про быстрый счёт. Бекзод умножает 213 на 12 в столбик, но обе строки пишет одна под другой, без сдвига, складывает и говорит:',
      uz: "Shahzoda tez hisoblash haqida video olyapti. Bekzod 213 ni 12 ga ustun shaklida ko'paytiradi, lekin ikkala qatorni surishsiz bir-birining tagiga yozadi, qo'shadi va deydi:"
    },
    claim_em: { ru: '213 × 12 = 639', uz: '213 × 12 = 639' },
    question: { ru: 'Бекзод прав?', uz: 'Bekzod haqmi?' },
    opt_yes: { ru: 'Бекзод прав', uz: 'Bekzod haq' },
    opt_no: { ru: 'Бекзод ошибается', uz: 'Bekzod xato qilyapti' },
    opt_idk: { ru: 'Не уверен', uz: 'Ishonchim komil emas' },
    audio: {
      intro: { ru: 'Шахзода снимает видео про быстрый счёт. Бекзод умножает двести тринадцать на двенадцать в столбик, но обе строки пишет одна под другой, без сдвига, складывает и получает шестьсот тридцать девять. Как думаешь, прав ли он?', uz: "Shahzoda tez hisoblash haqida video olyapti. Bekzod ikki yuz o'n uchni o'n ikkiga ustun shaklida ko'paytiradi, ammo ikkala qatorni surishsiz bir-birining tagiga yozadi, qo'shadi va olti yuz o'ttiz to'qqiz oladi. Sizningcha, u haqmi?" },
      on_correct: { ru: 'Сейчас проверим вместе.', uz: 'Hozir birga tekshiramiz.' },
      on_wrong: { ru: 'Сейчас проверим вместе.', uz: 'Hozir birga tekshiramiz.' }
    }
  },

  // ===== s1 — EXPLORATION: 213 × 12 + распределительный «почему» =====
  s1: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz" },
    title: { ru: 'Почему строки сдвигаются', uz: 'Nega qatorlar suriladi' },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    why_caption: {
      ru: 'Двенадцать — это десять плюс два. Поэтому умножаем 213 на 2 и на 10 отдельно, а строку «×10» сдвигаем на разряд влево. Сложить их без сдвига — значит потерять разряды.',
      uz: "O'n ikki — bu o'n qo'shiluv ikki. Shuning uchun 213 ni 2 ga va 10 ga alohida ko'paytiramiz, '×10' qatorini esa bir xona chapga suramiz. Ularni surishsiz qo'shish — xonalarni yo'qotish demakdir."
    },
    audio: { ru: [
      'Проверим вместе. Сначала умножаем двести тринадцать на единицы, то есть на два. Два на три это шесть, два на один это два, два на два это четыре. Выходит четыреста двадцать шесть.',
      'Теперь умножаем на десятки. Цифра десятков это один, но стоит она в разряде десятков, поэтому результат двести тринадцать пишем со сдвигом на одну клетку влево. Это уже не двести тринадцать, а две тысячи сто тридцать.',
      'Складываем строки со сдвигом и получаем две тысячи пятьсот пятьдесят шесть. Вот почему сдвиг важен: двенадцать это десять плюс два, и каждую часть мы умножаем отдельно. Сложить без сдвига как у Бекзода значит потерять разряды.'
    ], uz: [
      "Birga tekshiramiz. Avval ikki yuz o'n uchni birlarga, ya'ni ikkiga ko'paytiramiz. Ikki karra uch olti, ikki karra bir ikki, ikki karra ikki to'rt. To'rt yuz yigirma olti chiqadi.",
      "Endi o'nlarga ko'paytiramiz. O'nlar raqami bir, lekin u o'nlar xonasida turibdi, shuning uchun natija ikki yuz o'n uchni bir katak chapga surib yozamiz. Bu endi ikki yuz o'n uch emas, ikki ming bir yuz o'ttiz.",
      "Surilgan qatorlarni qo'shamiz va ikki ming besh yuz ellik olti chiqadi. Mana nega surish muhim: o'n ikki bu o'n qo'shiluv ikki, har bir qismni alohida ko'paytiramiz. Bekzoddek surishsiz qo'shish xonalarni yo'qotish demakdir."
    ] }
  },

  // ===== s2 — RULE: умножение столбиком =====
  s2: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Умножение столбиком', uz: "Ustun shaklida ko'paytirish" },
    rule_1: { ru: 'Записываем числа разряд под разрядом, выравнивая справа. Умножаем верхнее число на каждую цифру нижнего по очереди, справа налево.', uz: "Sonlarni xonama-xona, o'ngdan tekislab yozamiz. Yuqori sonni pastki sonning har bir raqamiga navbatma-navbat, o'ngdan chapga ko'paytiramiz." },
    rule_2: { ru: 'Каждый результат пишем со сдвигом: под единицами — без сдвига, под десятками — на разряд левее, и так далее. В конце складываем строки.', uz: "Har bir natijani surib yozamiz: birlar tagida — surishsiz, o'nlar tagida — bir xona chaproq, va hokazo. Oxirida qatorlarni qo'shamiz." },
    term: { ru: 'Результат умножения на одну цифру — это отдельная строка (неполное произведение). Сдвиг показывает разряд этой цифры.', uz: "Bir raqamga ko'paytirish natijasi — alohida qator (alohida ko'paytma). Surish shu raqamning xonasini ko'rsatadi." },
    ref: { ru: 'Разряды и классы — из уроков о многозначных числах (nat_5_01).', uz: "Xonalar va sinflar — ko'p xonali sonlar darslaridan (nat_5_01)." },
    audio: { ru: 'Закрепим. Числа пишем разряд под разрядом и умножаем верхнее на каждую цифру нижнего справа налево. Каждый результат это отдельная строка, и пишем её со сдвигом по разряду цифры: под единицами без сдвига, под десятками на клетку левее. В конце складываем строки. Так двести тринадцать на двенадцать дают две тысячи пятьсот пятьдесят шесть.', uz: "Mustahkamlaymiz. Sonlarni xonama-xona yozamiz va yuqorini pastning har bir raqamiga o'ngdan chapga ko'paytiramiz. Har bir natija alohida qator, uni raqam xonasiga qarab surib yozamiz: birlar tagida surishsiz, o'nlar tagida bir katak chaproq. Oxirida qatorlarni qo'shamiz. Shunday qilib ikki yuz o'n uch karra o'n ikki ikki ming besh yuz ellik olti beradi." }
  },

  // ===== s3 — TEST интерактив: 245 × 4 = 980 =====
  s3: {
    eyebrow: { ru: 'Тренировка · 1 из 4', uz: 'Mashq · 4 dan 1' },
    label: { ru: 'Умножь сам', uz: "O'zingiz ko'paytiring" },
    question: { ru: 'Шахзода считает кадры: 245 кадров в секунду, запись 4 секунды. Сколько кадров? Реши 245 × 4 в столбик.', uz: "Shahzoda kadrlarni sanaydi: sekundiga 245 kadr, yozuv 4 sekund. Necha kadr? 245 × 4 ni ustun shaklida yeching." },
    top: '245', mul: '4', result: '980',
    hint: { ru: 'Умножай справа налево: 5×4, потом 4×4, потом 2×4. Перенос держи над чертой и прибавляй к следующему разряду.', uz: "O'ngdan chapga ko'paytiring: 5×4, keyin 4×4, keyin 2×4. Ko'chirishni chiziq ustida saqlang va keyingi xonaga qo'shing." },
    fb_correct: { ru: 'Правильно. 5×4=20 — пишем 0, держим 2; 4×4=16, плюс 2 — 18, пишем 8, держим 1; 2×4=8, плюс 1 — 9. Итог 980.', uz: "To'g'ri. 5×4=20 — 0 yozamiz, 2 dilda; 4×4=16, 2 bilan — 18, 8 yozamiz, 1 dilda; 2×4=8, 1 bilan — 9. Natija 980." },
    fb_wrong: { ru: 'Верный ответ — 980. Главное — не потерять перенос: 5×4=20 даёт перенос 2, 4×4=16+2=18 даёт перенос 1.', uz: "To'g'ri javob — 980. Asosiysi ko'chirishni yo'qotmaslik: 5×4=20 ko'chirish 2 beradi, 4×4=16+2=18 ko'chirish 1 beradi." },
    audio: {
      intro: { ru: 'Теперь твоя очередь. Умножь двести сорок пять на четыре в столбик. Иди справа налево и не теряй перенос.', uz: "Endi sizning navbatingiz. Ikki yuz qirq beshni to'rtga ustun shaklida ko'paytiring. O'ngdan chapga yuring va ko'chirishni yo'qotmang." },
      on_correct: { ru: 'Верно. Перенос на месте.', uz: "To'g'ri. Ko'chirish joyida." },
      on_wrong: { ru: 'Пока не сходится. Проверь перенос в каждом разряде.', uz: "Hali mos emas. Har bir xonadagi ko'chirishni tekshiring." }
    }
  },

  // ===== s4 — TEST MC: 245 × 14 = 3430 =====
  s4: {
    eyebrow: { ru: 'Тренировка · 2 из 4', uz: 'Mashq · 4 dan 2' },
    label: { ru: 'Найди верное произведение', uz: "To'g'ri ko'paytmani toping" },
    question: { ru: 'Сколько будет 245 × 14?', uz: '245 × 14 nechaga teng?' },
    result: '3430',
    opt0: { ru: '1225', uz: '1225' },
    opt1: { ru: '3430', uz: '3430' },
    opt2: { ru: '1715', uz: '1715' },
    opt3: { ru: '2695', uz: '2695' },
    correctIndex: 1,
    hint: { ru: '14 — это десятки и единицы. Сначала 245×4, потом 245×1 со сдвигом на разряд влево, и сложи строки.', uz: "14 — bu o'nlar va birlar. Avval 245×4, keyin 245×1 ni bir xona chapga surib, qatorlarni qo'shing." },
    correct_text: { ru: 'Правильно. 245×4=980, 245×1=245 со сдвигом это 2450, сумма 3430.', uz: "To'g'ri. 245×4=980, 245×1=245 surilganda 2450, yig'indi 3430." },
    wrong_0: { ru: 'Это только 245×5. Нужно умножить на каждую цифру отдельно и сложить со сдвигом. Верно 3430.', uz: "Bu faqat 245×5. Har bir raqamga alohida ko'paytirib, surib qo'shish kerak. To'g'risi 3430." },
    wrong_2: { ru: 'Это 245×7. Здесь 14 — это 10 и 4, строки складываем со сдвигом. Верно 3430.', uz: "Bu 245×7. Bu yerda 14 — bu 10 va 4, qatorlarni surib qo'shamiz. To'g'risi 3430." },
    wrong_3: { ru: 'Строку «×10» забыли сдвинуть. 245×1 стоит в десятках, значит это 2450. Верно 3430.', uz: "'×10' qatorini surishni unutdingiz. 245×1 o'nlarda turibdi, demak bu 2450. To'g'risi 3430." },
    wrong_default: { ru: 'Умножь на каждую цифру и сложи строки со сдвигом. Верно 3430.', uz: "Har bir raqamga ko'paytiring va qatorlarni surib qo'shing. To'g'risi 3430." },
    audio: {
      intro: { ru: 'Выбери верный ответ. Если сомневаешься, посчитай в столбик и проверь себя.', uz: "To'g'ri javobni tanlang. Shubhalansangiz, ustun shaklida hisoblab tekshiring." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Давай разберёмся вместе. Посмотри, как считается в столбик.', uz: "Keling, birga ko'rib chiqamiz. Ustun shaklida qanday hisoblanishini ko'ring." }
    }
  },

  // ===== s5 — EXPLORATION: 132 × 204 (нулевая строка) =====
  s5: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz" },
    title: { ru: 'Что делать с нулём в множителе', uz: "Ko'paytuvchidagi nol bilan nima qilamiz" },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    audio: { ru: [
      'Умножаем сто тридцать два на двести четыре. Сначала единицы, четыре. Четыре на два восемь, четыре на три двенадцать, четыре на один четыре, с переносом выходит пятьсот двадцать восемь.',
      'В разряде десятков стоит ноль. Умножать не на что: вся строка это ноль. Но место разряда мы держим, поэтому ставим ноль и идём дальше.',
      'Теперь сотни, двойка. Сто тридцать два на два это двести шестьдесят четыре, и пишем со сдвигом на два разряда влево, потому что это сотни.',
      'Складываем строки и получаем двадцать шесть тысяч девятьсот двадцать восемь. Ноль в множителе не пропускаем, он держит разряд.'
    ], uz: [
      "Bir yuz o'ttiz ikkini ikki yuz to'rtga ko'paytiramiz. Avval birlar, to'rt. To'rt karra ikki sakkiz, to'rt karra uch o'n ikki, to'rt karra bir to'rt, ko'chirish bilan besh yuz yigirma sakkiz chiqadi.",
      "O'nlar xonasida nol turibdi. Ko'paytirishga narsa yo'q: butun qator nol. Lekin xona o'rnini saqlaymiz, shuning uchun nol qo'yib oldinga yuramiz.",
      "Endi yuzlar, ikki. Bir yuz o'ttiz ikki karra ikki ikki yuz oltmish to'rt, buni ikki xona chapga surib yozamiz, chunki bu yuzlar.",
      "Qatorlarni qo'shamiz va yigirma olti ming to'qqiz yuz yigirma sakkiz chiqadi. Ko'paytuvchidagi nolni tashlab ketmaymiz, u xonani saqlaydi."
    ] }
  },

  // ===== s6 — RULE: сдвиг и нулевая строка =====
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Сдвиг и ноль в множителе', uz: "Surish va ko'paytuvchidagi nol" },
    rule_1: { ru: 'Каждая следующая строка сдвигается на один разряд левее предыдущей — по разряду цифры, на которую умножаем.', uz: "Har bir keyingi qator oldingisidan bir xona chaproqqa suriladi — ko'paytirilayotgan raqamning xonasiga qarab." },
    rule_2: { ru: 'Если цифра множителя — ноль, строка целиком равна нулю, но разряд всё равно держим: ставим ноль и переходим к следующей цифре.', uz: "Agar ko'paytuvchi raqami nol bo'lsa, qator butunlay nol, lekin xonani baribir saqlaymiz: nol qo'yib keyingi raqamga o'tamiz." },
    rule_3: { ru: 'В конце складываем все строки по правилам столбика — не теряя перенос.', uz: "Oxirida barcha qatorlarni ustun qoidasi bo'yicha qo'shamiz — ko'chirishni yo'qotmay." },
    term: { ru: 'Сдвиг — это запись строки на разряд левее, потому что цифра множителя стоит в старшем разряде.', uz: "Surish — bu qatorni bir xona chaproq yozish, chunki ko'paytuvchi raqami yuqori xonada turibdi." },
    ref: { ru: 'Сложение строк — из урока сложения столбиком (nat_5_03).', uz: "Qatorlarni qo'shish — ustun shaklida qo'shish darsidan (nat_5_03)." },
    audio: { ru: 'Запомним два момента. Первый: каждая строка сдвигается на разряд левее, по разряду цифры множителя. Второй: если цифра множителя ноль, вся строка ноль, но разряд держим, ставим ноль и идём дальше. А в конце складываем строки, как в столбике сложения, не теряя перенос.', uz: "Ikki narsani eslab qolamiz. Birinchi: har bir qator bir xona chaproqqa suriladi, ko'paytuvchi raqamining xonasiga qarab. Ikkinchi: agar ko'paytuvchi raqami nol bo'lsa, butun qator nol, lekin xonani saqlaymiz, nol qo'yib oldinga yuramiz. Oxirida esa qatorlarni qo'shish ustunidagidek qo'shamiz, ko'chirishni yo'qotmay." }
  },

  // ===== s7 — TEST MC: 213 × 103 = 21939 (нулевая строка) =====
  s7: {
    eyebrow: { ru: 'Тренировка · 3 из 4', uz: 'Mashq · 4 dan 3' },
    label: { ru: 'Найди верное произведение', uz: "To'g'ri ko'paytmani toping" },
    question: { ru: 'Сколько будет 213 × 103?', uz: '213 × 103 nechaga teng?' },
    result: '21939',
    opt0: { ru: '2769', uz: '2769' },
    opt1: { ru: '21939', uz: '21939' },
    opt2: { ru: '4899', uz: '4899' },
    opt3: { ru: '2343', uz: '2343' },
    correctIndex: 1,
    hint: { ru: '103 — это сотни, ноль десятков и единицы. Строка десятков — нулевая, но разряд держим. Потом 213×1 со сдвигом на два разряда.', uz: "103 — bu yuzlar, nol o'nlik va birlar. O'nlar qatori nol, lekin xonani saqlaymiz. Keyin 213×1 ni ikki xona surib." },
    correct_text: { ru: 'Правильно. 213×3=639, строка десятков нулевая, 213×1 со сдвигом на два разряда это 21300, сумма 21939.', uz: "To'g'ri. 213×3=639, o'nlar qatori nol, 213×1 ikki xona surilganda 21300, yig'indi 21939." },
    wrong_0: { ru: 'Это только 213×13. Ноль в сотнях... нет, 103 — это сотни и единицы, строка сотен сдвигается на два разряда. Верно 21939.', uz: "Bu faqat 213×13. 103 — bu yuzlar va birlar, yuzlar qatori ikki xona suriladi. To'g'risi 21939." },
    wrong_2: { ru: 'Похоже на 213×23. Здесь средняя цифра — ноль, и строка десятков нулевая. Верно 21939.', uz: "213×23 ga o'xshaydi. Bu yerda o'rtadagi raqam nol, o'nlar qatori nol. To'g'risi 21939." },
    wrong_3: { ru: 'Это 213×11. В 103 сотни стоят в третьем разряде, строку 213×1 сдвигаем на две клетки. Верно 21939.', uz: "Bu 213×11. 103 da yuzlar uchinchi xonada, 213×1 qatorini ikki katak suramiz. To'g'risi 21939." },
    wrong_default: { ru: 'Строка десятков нулевая, держим разряд; 213×1 сдвигаем на два разряда. Верно 21939.', uz: "O'nlar qatori nol, xonani saqlaymiz; 213×1 ni ikki xona suramiz. To'g'risi 21939." },
    audio: {
      intro: { ru: 'Здесь в множителе есть ноль. Выбери верный ответ, а если нужно — посчитай в столбик.', uz: "Bu yerda ko'paytuvchida nol bor. To'g'ri javobni tanlang, kerak bo'lsa ustun shaklida hisoblang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Давай разберём по строкам в столбик.', uz: "Keling, qatorma-qator ustun shaklida ko'rib chiqamiz." }
    }
  },

  // ===== s8 — TEST MC (кейс): 124 × 36 = 4464 =====
  s8: {
    eyebrow: { ru: 'Тренировка · 4 из 4', uz: 'Mashq · 4 dan 4' },
    label: { ru: 'Реши задачу', uz: 'Masalani yeching' },
    question: { ru: 'В одном альбоме 124 наклейки. Сколько наклеек в 36 альбомах? 124 × 36.', uz: "Bitta albomda 124 ta stiker. 36 ta albomda nechta stiker? 124 × 36." },
    result: '4464',
    opt0: { ru: '4464', uz: '4464' },
    opt1: { ru: '1116', uz: '1116' },
    opt2: { ru: '888', uz: '888' },
    opt3: { ru: '4092', uz: '4092' },
    correctIndex: 0,
    hint: { ru: 'Сначала 124×6, потом 124×3 со сдвигом на разряд влево. Сложи две строки.', uz: "Avval 124×6, keyin 124×3 ni bir xona chapga surib. Ikki qatorni qo'shing." },
    correct_text: { ru: 'Правильно. 124×6=744, 124×3=372 со сдвигом это 3720, сумма 4464.', uz: "To'g'ri. 124×6=744, 124×3=372 surilganda 3720, yig'indi 4464." },
    wrong_1: { ru: 'Это только 124×9. 36 — это 30 и 6, умножаем отдельно и складываем со сдвигом. Верно 4464.', uz: "Bu faqat 124×9. 36 — bu 30 va 6, alohida ko'paytirib surib qo'shamiz. To'g'risi 4464." },
    wrong_2: { ru: 'Это 124×... слишком мало. Нужно умножить на обе цифры и сложить со сдвигом. Верно 4464.', uz: "Bu juda kam. Ikkala raqamga ko'paytirib surib qo'shish kerak. To'g'risi 4464." },
    wrong_3: { ru: 'Строку десятков не сдвинули. 124×3 стоит в десятках, значит 3720, а не 372. Верно 4464.', uz: "O'nlar qatorini surmadingiz. 124×3 o'nlarda turibdi, demak 3720, 372 emas. To'g'risi 4464." },
    audio: {
      intro: { ru: 'Задача про наклейки. Посчитай и выбери верный ответ, при сомнении считай в столбик.', uz: "Stikerlar haqida masala. Hisoblab to'g'ri javobni tanlang, shubhalansangiz ustun shaklida hisoblang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Давай посчитаем в столбик вместе.', uz: "Keling, birga ustun shaklida hisoblaymiz." }
    }
  },

  // ===== s9 — ПРОВЕРКА ЗНАНИЙ: 1248 × 104 = 129792 =====
  s9: {
    eyebrow: { ru: 'Проверка знаний', uz: 'Bilim tekshiruvi' },
    label: { ru: 'Проверь себя', uz: "O'zingizni tekshiring" },
    question: { ru: 'Сколько будет 1248 × 104?', uz: '1248 × 104 nechaga teng?' },
    result: '129792',
    opt0: { ru: '129792', uz: '129792' },
    opt1: { ru: '12480', uz: '12480' },
    opt2: { ru: '13728', uz: '13728' },
    opt3: { ru: '124800', uz: '124800' },
    correctIndex: 0,
    hint: { ru: '104 — сотни, ноль десятков, единицы. 1248×4, нулевая строка десятков, 1248×1 со сдвигом на два разряда. Сложи.', uz: "104 — yuzlar, nol o'nlik, birlar. 1248×4, o'nlar qatori nol, 1248×1 ni ikki xona surib. Qo'shing." },
    correct_text: { ru: 'Правильно. 1248×4=4992, строка десятков нулевая, 1248×1 со сдвигом на два разряда это 124800, сумма 129792.', uz: "To'g'ri. 1248×4=4992, o'nlar qatori nol, 1248×1 ikki xona surilganda 124800, yig'indi 129792." },
    wrong_1: { ru: 'Это только 1248×10. Здесь 104 — сотни и единицы, нужна и строка 1248×4. Верно 129792.', uz: "Bu faqat 1248×10. Bu yerda 104 — yuzlar va birlar, 1248×4 qatori ham kerak. To'g'risi 129792." },
    wrong_2: { ru: 'Это 1248×11. Средняя цифра — ноль, а сотни сдвигаются на два разряда. Верно 129792.', uz: "Bu 1248×11. O'rtadagi raqam nol, yuzlar ikki xona suriladi. To'g'risi 129792." },
    wrong_3: { ru: 'Это только строка сотен (1248×100). Не хватает 1248×4. Верно 129792.', uz: "Bu faqat yuzlar qatori (1248×100). 1248×4 yetishmaydi. To'g'risi 129792." },
    wrong_default: { ru: 'Нужны строка единиц и строка сотен со сдвигом на два разряда, средняя — нулевая. Верно 129792.', uz: "Birlar qatori va ikki xona surilgan yuzlar qatori kerak, o'rtadagisi nol. To'g'risi 129792." },
    audio: {
      intro: { ru: 'А теперь проверь себя на большом числе. Выбери верный ответ, при сомнении посчитай в столбик.', uz: "Endi katta sonda o'zingizni tekshiring. To'g'ri javobni tanlang, shubhalansangiz ustun shaklida hisoblang." },
      on_correct: { ru: 'Верно. Все строки и сдвиги на месте.', uz: "To'g'ri. Barcha qatorlar va surishlar joyida." },
      on_wrong: { ru: 'Давай разберём по строкам.', uz: "Keling, qatorma-qator ko'rib chiqamiz." }
    }
  },

  // ===== s10 — SUMMARY =====
  s10: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    title: { ru: 'Разряды никуда не уходят', uz: 'Xonalar hech qayerga ketmaydi' },
    ring_back: { ru: 'Помнишь Бекзода и его 639? Он сложил строки без сдвига и потерял разряды. На самом деле 213 × 12 = 2556.', uz: "Bekzodni va uning 639 ini eslaysizmi? U qatorlarni surishsiz qo'shib, xonalarni yo'qotdi. Aslida 213 × 12 = 2556." },
    score_label: { ru: 'Твой результат', uz: 'Sizning natijangiz' },
    learned_1: { ru: 'Умножаем на каждую цифру отдельно и пишем строки со сдвигом по разряду.', uz: "Har bir raqamga alohida ko'paytiramiz va qatorlarni xonaga qarab surib yozamiz." },
    learned_2: { ru: 'Ноль в множителе держит разряд; в конце складываем строки, не теряя перенос.', uz: "Ko'paytuvchidagi nol xonani saqlaydi; oxirida qatorlarni ko'chirishni yo'qotmay qo'shamiz." },
    why_heading: { ru: 'Почему так', uz: 'Nega bunday' },
    why_1: { ru: 'Сдвиг — это разряд: строка «×10» в десять раз больше, поэтому стоит на разряд левее.', uz: "Surish — bu xona: '×10' qatori o'n barobar katta, shuning uchun bir xona chaproqda turadi." },
    why_2: { ru: 'Сложить строки без сдвига нельзя — это и была ошибка Бекзода.', uz: "Qatorlarni surishsiz qo'shib bo'lmaydi — Bekzodning xatosi shu edi." },
    teaser: { ru: 'Дальше — деление уголком: разберём, как разложить число на равные части.', uz: "Keyingi — burchak usulida bo'lish: sonni teng qismlarga qanday ajratishni ko'rib chiqamiz." },
    ref: { ru: 'Это продолжение линии многозначных чисел (nat_5_01 — nat_5_03).', uz: "Bu ko'p xonali sonlar chizig'ining davomi (nat_5_01 — nat_5_03)." },
    audio: { ru: 'Подведём итог. Бекзод получил шестьсот тридцать девять, потому что сложил строки без сдвига и потерял разряды. На самом деле двести тринадцать на двенадцать дают две тысячи пятьсот пятьдесят шесть. Главное: умножаем на каждую цифру отдельно, пишем строки со сдвигом по разряду, ноль держит разряд, а в конце складываем. Дальше нас ждёт деление уголком.', uz: "Yakunlaymiz. Bekzod olti yuz o'ttiz to'qqiz oldi, chunki qatorlarni surishsiz qo'shib xonalarni yo'qotdi. Aslida ikki yuz o'n uch karra o'n ikki ikki ming besh yuz ellik olti beradi. Asosiysi: har bir raqamga alohida ko'paytiramiz, qatorlarni xonaga qarab surib yozamiz, nol xonani saqlaydi, oxirida qo'shamiz. Keyingi safar burchak usulida bo'lish kutadi." }
  }
};

const SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const TOTAL_SCREENS = SEQUENCE.length;

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',              scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',              scored: false, scope: null },
  { id: 's2',  type: 'rule',        template: 'custom',              scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'InteractiveMulColumn', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'test',        template: 'MCScreen',            scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',              scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',              scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen',            scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'case',        template: 'MCScreen',            scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'test',        template: 'MCScreen',            scored: true,  scope: 'final' },
  { id: 's10', type: 'summary',     template: 'custom',              scored: false, scope: null }
];

// ============================================================
// РЕШЕНИЯ для анимированного разбора (формат столбика умножения).
// rows: [{ digits, shift, color, caption, kind?, work? }]

// ============================================================
// РЕШЕНИЯ для озвученного разбора (AnimatedMulSolution).
// mult — цифры множителя СЛЕВА НАПРАВО (старшие первыми), цвета по разрядам:
// единицы accent, десятки/сотни blue, ноль ink3. rows — строки сверху вниз.
// narr — длиной rows+1: реплика на строку + заключение с суммой (числа словами).
// UZ — DRAFT, требует валидации узбекским методистом.
// ============================================================
const SOLUTIONS = {
  3: {
    top: '245', mult: [{ d: '4', color: T.accent }], result: { digits: '980' },
    rows: [
      { digits: '980', shift: 0, color: T.accent, caption: '245 × 4', work: [{ a: 5, b: 4 }, { a: 4, b: 4, carryIn: 2 }, { a: 2, b: 4, carryIn: 1 }] }
    ],
    narr: {
      ru: [
        'Идём справа налево. Пять на четыре двадцать. Ноль пишем, два держим в уме. Четыре на четыре шестнадцать, и два из ума, восемнадцать. Восемь пишем, один в уме. Два на четыре восемь, и один из ума, девять.',
        'Получается девятьсот восемьдесят. Вот верный ответ.'
      ],
      uz: [
        "O'ngdan chapga yuramiz. Besh karra to'rt yigirma. Nolni yozamiz, ikkini dilda saqlaymiz. To'rt karra to'rt o'n olti, dildagi ikki bilan o'n sakkiz. Sakkizni yozamiz, bir dilda. Ikki karra to'rt sakkiz, dildagi bir bilan to'qqiz.",
        "To'qqiz yuz sakson chiqadi. Mana to'g'ri javob."
      ]
    }
  },
  4: {
    top: '245', mult: [{ d: '1', color: T.blue }, { d: '4', color: T.accent }], result: { digits: '3430' },
    rows: [
      { digits: '980', shift: 0, color: T.accent, caption: '245 × 4', work: [{ a: 5, b: 4 }, { a: 4, b: 4, carryIn: 2 }, { a: 2, b: 4, carryIn: 1 }] },
      { digits: '245', shift: 1, color: T.blue,   caption: '245 × 1 (десятки)', work: [{ a: 5, b: 1 }, { a: 4, b: 1 }, { a: 2, b: 1 }] }
    ],
    narr: {
      ru: [
        'Проверим в столбик. Сначала умножаем двести сорок пять на единицы, то есть на четыре. Пять на четыре двадцать, ноль пишем, два в уме. Четыре на четыре шестнадцать, и два из ума, восемнадцать. Восемь пишем, один в уме. Два на четыре восемь, и один, девять. Первая строка девятьсот восемьдесят.',
        'Теперь десятки. Двести сорок пять на один это двести сорок пять, но пишем со сдвигом на одну клетку влево, потому что это десятки. На самом деле это две тысячи четыреста пятьдесят.',
        'Складываем строки со сдвигом и получаем три тысячи четыреста тридцать. Вот верный ответ.'
      ],
      uz: [
        "Ustun shaklida tekshiramiz. Avval ikki yuz qirq beshni birlarga, ya'ni to'rtga ko'paytiramiz. Besh karra to'rt yigirma, nolni yozamiz, ikki dilda. To'rt karra to'rt o'n olti, dildagi ikki bilan o'n sakkiz. Sakkizni yozamiz, bir dilda. Ikki karra to'rt sakkiz, bir bilan to'qqiz. Birinchi qator to'qqiz yuz sakson.",
        "Endi o'nlar. Ikki yuz qirq besh karra bir ikki yuz qirq besh, lekin bir katak chapga surib yozamiz, chunki bu o'nlar. Aslida bu ikki ming to'rt yuz ellik.",
        "Surilgan qatorlarni qo'shamiz va uch ming to'rt yuz o'ttiz chiqadi. Mana to'g'ri javob."
      ]
    }
  },
  7: {
    top: '213', mult: [{ d: '1', color: T.blue }, { d: '0', color: T.ink3 }, { d: '3', color: T.accent }], result: { digits: '21939' },
    rows: [
      { digits: '639', shift: 0, color: T.accent, caption: '213 × 3', work: [{ a: 3, b: 3 }, { a: 1, b: 3 }, { a: 2, b: 3 }] },
      { digits: '0',   shift: 1, color: T.ink3,   caption: '213 × 0 (десятки)', kind: 'zero' },
      { digits: '213', shift: 2, color: T.blue,   caption: '213 × 1 (сотни)', work: [{ a: 3, b: 1 }, { a: 1, b: 1 }, { a: 2, b: 1 }] }
    ],
    narr: {
      ru: [
        'Считаем в столбик. Сначала единицы, три. Три на три девять, один на три три, два на три шесть. Первая строка шестьсот тридцать девять.',
        'В разряде десятков стоит ноль. Вся строка ноль, но разряд держим: ставим ноль и идём дальше.',
        'Теперь сотни, один. Двести тринадцать пишем со сдвигом на два разряда влево. На самом деле это двадцать одна тысяча триста.',
        'Складываем строки и получаем двадцать одну тысячу девятьсот тридцать девять. Вот верный ответ.'
      ],
      uz: [
        "Ustun shaklida hisoblaymiz. Avval birlar, uch. Uch karra uch to'qqiz, bir karra uch uch, ikki karra uch olti. Birinchi qator olti yuz o'ttiz to'qqiz.",
        "O'nlar xonasida nol turibdi. Butun qator nol, lekin xonani saqlaymiz: nol qo'yib oldinga yuramiz.",
        "Endi yuzlar, bir. Ikki yuz o'n uchni ikki xona chapga surib yozamiz. Aslida bu yigirma bir ming uch yuz.",
        "Qatorlarni qo'shamiz va yigirma bir ming to'qqiz yuz o'ttiz to'qqiz chiqadi. Mana to'g'ri javob."
      ]
    }
  },
  8: {
    top: '124', mult: [{ d: '3', color: T.blue }, { d: '6', color: T.accent }], result: { digits: '4464' },
    rows: [
      { digits: '744', shift: 0, color: T.accent, caption: '124 × 6', work: [{ a: 4, b: 6 }, { a: 2, b: 6, carryIn: 2 }, { a: 1, b: 6, carryIn: 1 }] },
      { digits: '372', shift: 1, color: T.blue,   caption: '124 × 3 (десятки)', work: [{ a: 4, b: 3 }, { a: 2, b: 3, carryIn: 1 }, { a: 1, b: 3 }] }
    ],
    narr: {
      ru: [
        'Считаем в столбик. Сначала единицы, шесть. Четыре на шесть двадцать четыре, четыре пишем, два в уме. Два на шесть двенадцать, и два из ума, четырнадцать. Четыре пишем, один в уме. Один на шесть шесть, и один, семь. Первая строка семьсот сорок четыре.',
        'Теперь десятки, три. Сто двадцать четыре на три это триста семьдесят два, пишем со сдвигом на клетку влево. На самом деле это три тысячи семьсот двадцать.',
        'Складываем строки и получаем четыре тысячи четыреста шестьдесят четыре. Вот верный ответ.'
      ],
      uz: [
        "Ustun shaklida hisoblaymiz. Avval birlar, olti. To'rt karra olti yigirma to'rt, to'rtni yozamiz, ikki dilda. Ikki karra olti o'n ikki, dildagi ikki bilan o'n to'rt. To'rtni yozamiz, bir dilda. Bir karra olti olti, bir bilan yetti. Birinchi qator yetti yuz qirq to'rt.",
        "Endi o'nlar, uch. Bir yuz yigirma to'rt karra uch uch yuz yetmish ikki, bir katak chapga surib yozamiz. Aslida bu uch ming yetti yuz yigirma.",
        "Qatorlarni qo'shamiz va to'rt ming to'rt yuz oltmish to'rt chiqadi. Mana to'g'ri javob."
      ]
    }
  },
  9: {
    top: '1248', mult: [{ d: '1', color: T.blue }, { d: '0', color: T.ink3 }, { d: '4', color: T.accent }], result: { digits: '129792' },
    rows: [
      { digits: '4992', shift: 0, color: T.accent, caption: '1248 × 4', work: [{ a: 8, b: 4 }, { a: 4, b: 4, carryIn: 3 }, { a: 2, b: 4, carryIn: 1 }, { a: 1, b: 4 }] },
      { digits: '0',    shift: 1, color: T.ink3,   caption: '1248 × 0 (десятки)', kind: 'zero' },
      { digits: '1248', shift: 2, color: T.blue,   caption: '1248 × 1 (сотни)', work: [{ a: 8, b: 1 }, { a: 4, b: 1 }, { a: 2, b: 1 }, { a: 1, b: 1 }] }
    ],
    narr: {
      ru: [
        'Считаем в столбик. Сначала единицы, четыре. Восемь на четыре тридцать два, два пишем, три в уме. Четыре на четыре шестнадцать, и три из ума, девятнадцать. Девять пишем, один в уме. Два на четыре восемь, и один, девять. Один на четыре четыре. Первая строка четыре тысячи девятьсот девяносто два.',
        'В разряде десятков ноль. Строка нулевая, но разряд держим.',
        'Теперь сотни, один. Тысячу двести сорок восемь пишем со сдвигом на два разряда влево. На самом деле это сто двадцать четыре тысячи восемьсот.',
        'Складываем строки и получаем сто двадцать девять тысяч семьсот девяносто два. Вот верный ответ.'
      ],
      uz: [
        "Ustun shaklida hisoblaymiz. Avval birlar, to'rt. Sakkiz karra to'rt o'ttiz ikki, ikkini yozamiz, uch dilda. To'rt karra to'rt o'n olti, dildagi uch bilan o'n to'qqiz. To'qqizni yozamiz, bir dilda. Ikki karra to'rt sakkiz, bir bilan to'qqiz. Bir karra to'rt to'rt. Birinchi qator to'rt ming to'qqiz yuz to'qson ikki.",
        "O'nlar xonasida nol. Qator nol, lekin xonani saqlaymiz.",
        "Endi yuzlar, bir. Bir ming ikki yuz qirq sakkizni ikki xona chapga surib yozamiz. Aslida bu bir yuz yigirma to'rt ming sakkiz yuz.",
        "Qatorlarni qo'shamiz va bir yuz yigirma to'qqiz ming yetti yuz to'qson ikki chiqadi. Mana to'g'ri javob."
      ]
    }
  }
};

// Подсказки для HintToggle (из CONTENT) — на test-экранах.
const EXTRA = {};
[3, 4, 7, 8, 9].forEach((i) => { const h = CONTENT[`s${i}`] && CONTENT[`s${i}`].hint; if (h) EXTRA[i] = { hint: h }; });

// Отсылки к другим урокам — для RefNote.
const REFS = { 2: CONTENT.s2.ref, 6: CONTENT.s6.ref, 10: CONTENT.s10.ref };

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// s0 — HOOK
const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);

  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer({ stage: null, screenIdx: 0, studentAnswer: v, correct: true });
    audio.triggerEvent('option_picked');
    setTimeout(onNext, 300);
  };

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.5vw, 24px)' }}>
        <h1 className="title h-title fade-up">{t(c.global_q)}</h1>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.claim_lead)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2vw, 18px)' }}>
          <MulBoard top="213" mult={[{ d: '1', color: T.ink2 }, { d: '2', color: T.ink2 }]}
            partials={[{ digits: '426', shift: 0, color: T.ink2 }, { digits: '213', shift: 0, color: T.ink2 }]}
            result={{ digits: '639', color: T.accent }}/>
          <p className="body italic" style={{ margin: 0, color: T.accent, textAlign: 'center' }}>{t(c.claim_em)}</p>
        </div>
        <p className="h-sub title fade-up delay-3">{t(c.question)}</p>
        <div className="fade-up delay-4" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[{ id: 'yes', label: c.opt_yes }, { id: 'no', label: c.opt_no }, { id: 'idk', label: c.opt_idk }].map((opt) => (
            <button key={opt.id} className="option" disabled={picked !== null} onClick={() => pick(opt.id)}
              style={{ padding: 'clamp(14px, 2vw, 15px) clamp(16px, 2.5vw, 20px)', fontSize: 'clamp(15px, 1.9vw, 15px)' }}>
              {t(opt.label)}
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION 213 × 12 + распределительный «почему»
const Screen1 = (props) => (
  <MulExploration {...props} idx={1} top="213" mult={[{ d: '1', color: T.blue }, { d: '2', color: T.accent }]}
    rows={[
      { digits: '426', shift: 0, color: T.accent, caption: '213 × 2', work: [{ a: 3, b: 2 }, { a: 1, b: 2 }, { a: 2, b: 2 }] },
      { digits: '213', shift: 1, color: T.blue,   caption: '213 × 1 (десятки)', work: [{ a: 3, b: 1 }, { a: 1, b: 1 }, { a: 2, b: 1 }] }
    ]}
    result={{ digits: '2556' }}
    why={{ top: '213', mult: '12', tens: '10', units: '2' }}/>
);

// s2 — RULE умножение
const Screen2 = (props) => (
  <MulRuleGold {...props} idx={2} rules={['rule_1', 'rule_2']}
    demo={{ top: '213', mult: [{ d: '1', color: T.blue }, { d: '2', color: T.accent }],
      rows: [
        { digits: '426', shift: 0, color: T.accent, caption: '213 × 2' },
        { digits: '213', shift: 1, color: T.blue,   caption: '213 × 1' }
      ], result: { digits: '2556' } }}/>
);

// s3 — TEST интерактив 245 × 4
const Screen3 = (props) => <InteractiveMulColumn {...props} idx={3}/>;
// s4 — TEST MC 245 × 14
const Screen4 = (props) => <MulQuestionRetry {...props} idx={4}/>;

// s5 — EXPLORATION 132 × 204 (нулевая строка)
const Screen5 = (props) => (
  <MulExploration {...props} idx={5} top="132" mult={[{ d: '2', color: T.blue }, { d: '0', color: T.ink3 }, { d: '4', color: T.accent }]}
    rows={[
      { digits: '528', shift: 0, color: T.accent, caption: '132 × 4', work: [{ a: 2, b: 4 }, { a: 3, b: 4, carryIn: 0 }, { a: 1, b: 4, carryIn: 1 }] },
      { digits: '0',   shift: 1, color: T.ink3,   caption: '132 × 0 (десятки)', kind: 'zero' },
      { digits: '264', shift: 2, color: T.blue,   caption: '132 × 2 (сотни)', work: [{ a: 2, b: 2 }, { a: 3, b: 2 }, { a: 1, b: 2 }] }
    ]}
    result={{ digits: '26928' }}/>
);

// s6 — RULE сдвиг и ноль
const Screen6 = (props) => (
  <MulRuleGold {...props} idx={6} rules={['rule_1', 'rule_2', 'rule_3']}
    demo={{ top: '132', mult: [{ d: '2', color: T.blue }, { d: '0', color: T.ink3 }, { d: '4', color: T.accent }],
      rows: [
        { digits: '528', shift: 0, color: T.accent, caption: '132 × 4' },
        { digits: '0',   shift: 1, color: T.ink3,   caption: '132 × 0', kind: 'zero' },
        { digits: '264', shift: 2, color: T.blue,   caption: '132 × 2' }
      ], result: { digits: '26928' } }}/>
);

// s7 — TEST MC 213 × 103
const Screen7 = (props) => <MulQuestionRetry {...props} idx={7}/>;
// s8 — CASE MC 124 × 36
const Screen8 = (props) => <MulQuestionRetry {...props} idx={8}/>;
// s9 — ПРОВЕРКА ЗНАНИЙ 1248 × 104
const Screen9 = (props) => <MulQuestionRetry {...props} idx={9}/>;

// s10 — SUMMARY. Балл ученику не показывается (no-scoring, teaching_methodology §1.4).
const Screen10 = ({ screen, totalScreens, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s10;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(makeAudioSegments(c, lang));

  useEffect(() => { finishLesson(); /* eslint-disable-next-line */ }, []);

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
        {lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}
      </button>
      <button className="btn-white-accent" disabled style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>
        {lang === 'uz' ? 'Keyingi dars →' : 'Следующий урок →'}
      </button>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 24px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame-soft fade-up delay-1"><p className="body" style={{ margin: 0 }}>{t(c.ring_back)}</p></div>
        <div className="frame fade-up delay-2">
          <p className="eyebrow" style={{ color: T.accent, margin: 0 }}>{lang === 'uz' ? 'Asosiy' : 'Главное'}</p>
          <ul className="body" style={{ marginTop: 12, paddingLeft: 20, color: T.ink2, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>{t(c.learned_1)}</li>
            <li>{t(c.learned_2)}</li>
          </ul>
        </div>
        <div className="frame-success fade-up delay-3">
          <p className="eyebrow" style={{ color: T.success, margin: 0 }}>{t(c.why_heading)}</p>
          <ul className="body" style={{ marginTop: 12, paddingLeft: 20, color: T.ink2, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>{t(c.why_1)}</li>
            <li>{t(c.why_2)}</li>
          </ul>
        </div>
        <p className="body fade-up delay-4" style={{ color: T.ink2 }}>{t(c.teaser)}</p>
        <RefNote idx={10}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ (шаблон infrastructure_v1, props-контракт V5.1).
// Preview-обвязка: без langProp показываем RU/UZ-переключатель для прокликивания
// методистом в artifacts (допустимо по infrastructure_v1).
// ============================================================

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ = default export = сам урок (platform_contract §1).
// ============================================================
export default function MultiplicationColumnLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  // Preview-режим = props от LMS не пришли (запуск в artifacts).
  // Сигнал превью — отсутствие lang; озвучка идёт через Web Speech (пустой ttsApiBase),
  // на платформе LMS передаёт lang + ttsApiBase и работает HTTP-ветка движка.
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());
  // Контракт platform_contract §2: onFinished вызывается ровно один раз за сессию
  // урока. Гард живёт в корне, чтобы повторный заход на итог (или summary-вызов
  // на mount) не дублировал отправку. «Пройти заново» гард не сбрасывает.
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => {
    setAnswers([]); setCurrent(0); startTimeRef.current = Date.now();
  }, []);

  const finishLesson = useCallback(() => {
  if (finishedRef.current) return;
  finishedRef.current = true;
  // Уроки оцениваются по ПЕРВОЙ попытке (teaching_methodology §1.4, ревизия июнь 2026).
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10];
  const CurrentScreen = screens[current];
  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));
  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
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
          screen={current} studentName={safeName} storedAnswer={answers[current]}
          answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev}
          onReset={reset} finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

// ============================================================
// STYLES (CSS-ядро из infrastructure_v1 + урочные классы из v13)
// ============================================================
const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  height: 100dvh;
  overflow: hidden;
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
/* .btn — Dark CTA, резерв. Главные действия используют .btn-white-accent. */
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

/* .btn-white-accent — главная CTA (белая, оранжевая тень, текст оранжевый; на hover заливается оранжевым, текст белый) */
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

/* .btn-ghost — вторичная (прозрачная без тени → белая карточка на hover) */
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
  opacity: 0.55 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important;
}
.option-picked-wrong {
  background: #FFE8E1 !important;
  color: #FF4F28 !important;
  box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important;
}

/* === ТИПОГРАФИКА v15 (× 0.85 upper bounds) === */
.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(17px, 2.5vw, 20px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.5; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(12px, 2vw, 18px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(10px, 1.7vw, 16px);
  padding-bottom: clamp(17px, 3.4vw, 34px);
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
  padding-top: clamp(12px, 2vw, 15px);
  padding-bottom: clamp(12px, 2vw, 15px);
  display: flex;
  gap: 12px;
}

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
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

/* === SLIDER v15 (track-wrap + track-bg + track-fill + glow + круговая тень handle) === */
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

/* === INPUT v15 (без рамок, на тенях) === */
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

/* === FRAMES v15 (без рамок, на тенях; polosa-исключение в soft/success) === */
.frame {
  background: #FFFFFF;
  border-radius: 16px;
  padding: clamp(17px, 3.4vw, 30px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
}
/* frame-soft и frame-success сохраняют polosa 4px слева как функциональный сигнал статуса */
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 20px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 20px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}



/* === MATH-дополнения (math-секция v1.1) === */
/* MATH: анимация появления цифры в квадрате. */
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы, термины, факты). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* === УРОЧНЫЕ дополнения (визуализатор умножения, preview) === */
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  display: flex;
  gap: 4px;
  background: #FFFFFF;
  border-radius: 99px;
  padding: 3px;
  box-shadow: 0 3px 9px -4px rgba(58, 53, 48, 0.16), 0 1px 3px -1px rgba(58, 53, 48, 0.10);
}
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 99px;
  border: none;
  background: transparent;
  color: #5A5A60;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.06em;
}

@keyframes mb-pop-in { from { opacity: 0; transform: translateY(6px) scale(0.9); } to { opacity: 1; transform: none; } }
.mb-pop { display: inline-block; animation: mb-pop-in 0.32s ease-out both; }
.mb-work { display: flex; flex-direction: column; gap: 8px; align-items: center; width: 100%; }
.mb-work-title { font-weight: 600; letter-spacing: 0.04em; }
.mb-work-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.mb-chip { background: #FFFFFF; border-radius: 10px; padding: 6px 10px; font-size: clamp(13px, 1.7vw, 15px); box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.16); white-space: nowrap; }
.mb-carry { font-size: 0.6em; margin-left: 1px; font-weight: 700; }

.hint-toggle { background: transparent; border: 1px dashed rgba(58, 53, 48, 0.28); border-radius: 10px; padding: 8px 14px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #A07D14; cursor: pointer; transition: all 0.15s; }
.hint-toggle:hover { border-color: rgba(178, 90, 30, 0.6); }
.sol-replay { background: #FFFFFF; border: 1px solid rgba(58, 53, 48, 0.14); border-radius: 99px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #5A5A60; cursor: pointer; transition: color 0.15s; }
.sol-replay:hover { color: #0E0E10; }
`;