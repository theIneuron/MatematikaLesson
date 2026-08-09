// _kit/index.jsx — ОБЩИЙ ДВИЖОК УРОКОВ 3 КЛАССА.
//
// Сюда вынесено только то, что было БАЙТ-В-БАЙТ одинаково во всех уроках: движок звука и
// навигации, персонажи и анимационный кит, сцена Лумо, базовые компоненты. Текст не
// переписан — он перенесён как есть, поэтому вынос не меняет поведение уроков.
//
// Что осталось в уроке: CONTENT, BRIDGES, S14_PAYOFF, LESSON_META, SCREEN_META, сцена
// урока, его фигуры, экраны, корневой компонент и собственный CSS.
//
// Виджеты с разошедшимися версиями (NumPad, CheckStrip, TaskTable, FoldRow, useTapSteps,
// MeasureCell) СПЕЦИАЛЬНО не вынесены: в разных уроках они отличаются, свести их к одной
// версии можно только с разбором каждой правки — это отдельная задача.
//
// Файл собран скриптом scripts/grade3-kit-extract.mjs. Правки вносить сюда, а не в копии.
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

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

let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'f' };

const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

const FREE_NAV = true;

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

function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

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

const LangContext = createContext('ru');

const useLang = () => useContext(LangContext);

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

const makeAutoSegments = (screenContent, lang) => {
  const a = screenContent.audio?.[lang];
  const arr = Array.isArray(a) ? a : (a ? [a] : []);
  return arr.map((text, i) => ({ id: `aud_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null }));
};

function useCanAnswer(audio) {
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    if (audio.isPlaying && !hasPlayed) { const id = setTimeout(() => setHasPlayed(true), 0); return () => clearTimeout(id); }
    return undefined;
  }, [audio.isPlaying, hasPlayed]);
  useEffect(() => { const id = setTimeout(() => setHasPlayed(true), 12000); return () => clearTimeout(id); }, []);
  return FREE_NAV || audio.muted || (hasPlayed && !audio.isPlaying);
}

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

const autoScrollTo = (el, block = 'nearest') => {
  if (!el || typeof el.scrollIntoView !== 'function') return;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
};

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
            <span className="g1-cele-wrap">
              <button className="option option-correct" disabled
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6vw, 54px)', minWidth: 'clamp(120px, 40vw, 220px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: T.success }}>✓</span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>{options[correctIdx]}</span>
              </button>
              <SparkBurst/>
            </span>
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

const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };

const READY_LABEL = { ru: 'Планета Лумо', uz: "Lumo sayyorasi" };

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

const Pips = ({ n, kind = 'apple', anim = 'bob', wrap = false }) => (
  <div className={`g1-pips ${wrap ? 'g1-pips-wrap' : ''}`}>
    {Array.from({ length: n }).map((_, i) => <Obj key={i} kind={kind} i={i} anim={anim}/>)}
  </div>
);

const PRAISE = { ru: ['Молодец!', 'Отлично!', 'Здорово!', 'Умница!'], uz: ['Barakalla!', 'Ajoyib!', "Zo'r!", 'Ofarin!'] };

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

const HeroContext = createContext({ setMood: () => {} });

const useHero = (mood) => {
  const { setMood } = useContext(HeroContext);
  useEffect(() => { setMood(mood); }, [mood, setMood]);
};

const StageHero = ({ mood }) => {
  if (mood !== 'present') return null;
  return (
    <div className="g1-stage-hero g1-sh-present" aria-hidden="true">
      <BitSVG state="present" className="g1-hero-bit"/>
    </div>
  );
};

const Confetti = () => (
  <>
    <span className="g1-conf g1-conf1"/><span className="g1-conf g1-conf2"/><span className="g1-conf g1-conf3"/>
    <span className="g1-conf g1-conf4"/><span className="g1-conf g1-conf5"/><span className="g1-conf g1-conf6"/>
  </>
);

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

const AnsPop = ({ n }) => (
  <span className="g1-anspop g1-pop-in" aria-hidden="true">
    <i className="g1-anspop-eq">=</i><b className="g1-anspop-num">{n}</b>
  </span>
);

const SPARKS = [
  { dx: '0px', dy: '-30px', s: 8, d: '0s' },
  { dx: '24px', dy: '-20px', s: 6, d: '0.05s' },
  { dx: '-24px', dy: '-20px', s: 6, d: '0.09s' },
  { dx: '30px', dy: '2px', s: 5, d: '0.13s' },
  { dx: '-30px', dy: '2px', s: 5, d: '0.07s' },
  { dx: '14px', dy: '-28px', s: 4, d: '0.11s' },
];

const SparkBurst = () => (
  <>{SPARKS.map((p, i) => (
    <span key={i} className="g1-csp" style={{ width: `${p.s}px`, height: `${p.s}px`, ['--dx']: p.dx, ['--dy']: p.dy, animationDelay: p.d }}/>
  ))}</>
);

const Bridge = () => null;

const InfoNote = ({ badge, text }) => (
  <div className="d2-infonote fade-up">
    <span className="d2-infonote-badge mono">{badge}</span>
    <p className="d2-infonote-txt">{text}</p>
  </div>
);

const QTitle = ({ title, q }) => (
  <div>
    {title && <p className="d2-qlead">{title}</p>}
    <h2 className="title h-sub" style={{ textAlign: 'center' }}>{q}</h2>
  </div>
);

const BigNum = ({ v, accent = false }) => (
  <span className={`lm-bignum ${accent ? 'lm-bignum-accent' : ''}`}>{v}</span>
);

const D2Defs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="lmGlow" cx="42%" cy="36%" r="72%">
        <stop offset="0%" stopColor="#FFF6D0"/><stop offset="50%" stopColor="#FFD86E"/><stop offset="100%" stopColor="#FBA83C"/>
      </radialGradient>
      <linearGradient id="lmSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#AAD0EE"/><stop offset="50%" stopColor="#FBDCB0"/><stop offset="100%" stopColor="#FFEECE"/>
      </linearGradient>
      <radialGradient id="lmSun" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#FFF8E2"/><stop offset="55%" stopColor="#FFDF9A"/><stop offset="100%" stopColor="#FFC468"/>
      </radialGradient>
      <linearGradient id="lmGround" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ECD8AE"/><stop offset="100%" stopColor="#DAC090"/>
      </linearGradient>
      <linearGradient id="lmTree" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7ECB8C"/><stop offset="100%" stopColor="#4E9E62"/>
      </linearGradient>
    </defs>
  </svg>
);

const D2Motes = () => (
  <div className="lm-motes" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => <i key={i} className="lm-mote" style={{ animationDelay: `${i * 1.6}s` }}/>)}
  </div>
);

const Chiroq = ({ className = '' }) => (
  <svg className={`lm-chiroq ${className}`} viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7.2" fill="#FF9A2E" opacity="0.42"/>
    <circle cx="8" cy="8" r="4.6" fill="url(#lmGlow)"/>
    <circle cx="6.4" cy="6.4" r="1.6" fill="rgba(255,255,255,0.9)"/>
  </svg>
);

const Lenta = ({ className = '' }) => (
  <svg className={`lm-lenta ${className}`} viewBox="0 0 92 20" aria-hidden="true">
    <rect x="1" y="2" width="90" height="16" rx="6" fill="#1B2A4A" stroke="#3A4E78" strokeWidth="1"/>
    {Array.from({ length: 10 }).map((_, i) => (
      <circle key={i} cx={9.5 + i * 8.1} cy="10" r="3" fill="url(#lmGlow)"/>
    ))}
  </svg>
);

const Panel = ({ className = '' }) => (
  <svg className={`lm-panel ${className}`} viewBox="0 0 96 96" aria-hidden="true">
    <rect x="1" y="1" width="94" height="94" rx="9" fill="#152342" stroke="#3A4E78" strokeWidth="1.4"/>
    {Array.from({ length: 100 }).map((_, i) => {
      const col = i % 10; const row = Math.floor(i / 10);
      return <circle key={i} cx={9.5 + col * 8.5} cy={9.5 + row * 8.5} r="2.6" fill="url(#lmGlow)"/>;
    })}
  </svg>
);

const PlaceViz = ({ hundreds = 0, tens = 0, ones = 0, ans = null, small = false }) => (
  <div className={`lm-pv ${small ? 'lm-pv-sm' : ''}`}>
    {hundreds > 0 && <span className="lm-pv-grp">{Array.from({ length: hundreds }).map((_, i) => <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${i * 0.08}s` }}><Panel/></span>)}</span>}
    {tens > 0 && <span className="lm-pv-grp">{Array.from({ length: tens }).map((_, i) => <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${(hundreds + i) * 0.06}s` }}><Lenta/></span>)}</span>}
    {ones > 0 && <span className="lm-pv-grp lm-pv-ones">{Array.from({ length: ones }).map((_, i) => <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${(hundreds + tens + i) * 0.05}s` }}><Chiroq/></span>)}</span>}
    {hundreds === 0 && tens === 0 && ones === 0 && <span className="lm-pv-empty mono">?</span>}
    {ans != null && <AnsPop n={ans}/>}
  </div>
);

const PLAT_Y = 176;

const FAR_TOWN = [[-8, 30, 130], [22, 24, 122], [52, 34, 134], [92, 26, 118], [124, 32, 128], [162, 24, 116], [190, 36, 126], [234, 26, 120], [266, 34, 132], [304, 24, 118], [332, 32, 128], [370, 30, 122]];

const TOWN = [
  [-4, 44, 102, '#F2B49A', '#DF8A6C', 'pitch'], // marjon
  [44, 38, 122, '#F5D592', '#E0AE5A', 'dome'],  // sariq — gumbaz
  [86, 40, 90, '#BEA9E0', '#9A7CC6', 'pitch'],  // siyohrang
  [130, 34, 118, '#A6D8C2', '#7CB69E', 'flat'], // mint
  [168, 50, 82, '#F6BCC6', '#E489A2', 'dome'],  // pushti — gumbaz
  [222, 36, 116, '#F3CB9E', '#DCA265', 'flat'], // shaftoli
  [262, 46, 94, '#AECDEC', '#83A9D2', 'pitch'], // ko'k
  [312, 34, 120, '#F0AE94', '#DB8062', 'flat'], // marjon-2
  [350, 52, 100, '#C6B0E4', '#9E82CA', 'dome']  // siyohrang — gumbaz
];

const LAMPS = [118, 210, 300];

const houseWindows = (x, w, topY, idx) => {
  const out = []; const startX = x + 7; const innerW = w - 14;
  const cols = Math.max(1, Math.round(innerW / 11));
  const stepX = cols > 1 ? innerW / (cols - 1) : 0;
  const rows = Math.floor((PLAT_Y - 10 - (topY + 12)) / 12);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const wx = startX + c * stepX; const wy = topY + 14 + r * 12;
      if (wy > PLAT_Y - 10) continue;
      const flick = (c + r + idx) % 4 === 0;
      out.push(<rect key={`${r}-${c}`} className={flick ? 'lm-cwin' : ''} style={flick ? { animationDelay: `${(r % 5) * 0.6}s` } : undefined} x={wx - 3} y={wy - 3.4} width="6" height="6.8" rx="1.6" fill="url(#lmGlow)" stroke="rgba(120,80,30,0.35)" strokeWidth="0.6"/>);
    }
  }
  return out;
};

const Cloud = ({ x, y, s }) => (
  <g fill="#FFFFFF" opacity="0.72">
    <ellipse cx={x} cy={y} rx={20 * s} ry={9 * s}/>
    <ellipse cx={x - 15 * s} cy={y + 3 * s} rx={13 * s} ry={7 * s}/>
    <ellipse cx={x + 15 * s} cy={y + 3 * s} rx={13 * s} ry={7 * s}/>
  </g>
);

const AlienBloom = ({ x, s, tint }) => {
  const b = PLAT_Y; const hy = b - 44 * s;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={11 * s} ry={3.2 * s} fill="rgba(50,40,30,0.2)"/>
      <path d={`M${x} ${b} Q${x - 5 * s} ${b - 22 * s} ${x} ${hy}`} stroke="#3C7A50" strokeWidth={3.6 * s} fill="none" strokeLinecap="round"/>
      <path d={`M${x - 1 * s} ${b - 18 * s} Q${x - 15 * s} ${b - 22 * s} ${x - 18 * s} ${b - 12 * s} Q${x - 8 * s} ${b - 12 * s} ${x - 1 * s} ${b - 18 * s} Z`} fill="#54A86E"/>
      <path d={`M${x + 1 * s} ${b - 28 * s} Q${x + 15 * s} ${b - 32 * s} ${x + 18 * s} ${b - 22 * s} Q${x + 8 * s} ${b - 22 * s} ${x + 1 * s} ${b - 28 * s} Z`} fill="#54A86E"/>
      <circle cx={x} cy={hy} r={17 * s} fill={tint} opacity="0.22"/>
      {Array.from({ length: 7 }).map((_, i) => { const a = (i / 7) * Math.PI * 2; const px = x + Math.cos(a) * 9 * s; const py = hy + Math.sin(a) * 9 * s; return <ellipse key={i} cx={px} cy={py} rx={7 * s} ry={4 * s} fill={tint} transform={`rotate(${a * 180 / Math.PI} ${px} ${py})`}/>; })}
      <circle cx={x} cy={hy} r={6.5 * s} fill={tint}/>
      <circle className="lm-glow" cx={x} cy={hy} r={4 * s} fill="#FFF7D6"/>
    </g>
  );
};

const AlienShroom = ({ x, s, tint }) => {
  const b = PLAT_Y;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={14 * s} ry={3.6 * s} fill="rgba(50,40,30,0.2)"/>
      <path d={`M${x - 5 * s} ${b} Q${x - 6 * s} ${b - 24 * s} ${x} ${b - 30 * s} Q${x + 6 * s} ${b - 24 * s} ${x + 5 * s} ${b} Z`} fill="#EFE2C8"/>
      <circle cx={x} cy={b - 32 * s} r={20 * s} fill={tint} opacity="0.16"/>
      <path d={`M${x - 22 * s} ${b - 30 * s} Q${x} ${b - 54 * s} ${x + 22 * s} ${b - 30 * s} Q${x} ${b - 40 * s} ${x - 22 * s} ${b - 30 * s} Z`} fill={tint}/>
      <path d={`M${x - 22 * s} ${b - 30 * s} Q${x} ${b - 54 * s} ${x + 22 * s} ${b - 30 * s}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2 * s}/>
      <g fill="rgba(255,255,255,0.95)"><circle cx={x - 8 * s} cy={b - 36 * s} r={2.6 * s}/><circle cx={x + 7 * s} cy={b - 34 * s} r={2.2 * s}/><circle cx={x} cy={b - 44 * s} r={2.2 * s}/></g>
      <circle className="lm-glow" cx={x} cy={b - 38 * s} r={2.8 * s} fill="#FFF7D6"/>
    </g>
  );
};

const AlienLantern = ({ x, s, tint }) => {
  const b = PLAT_Y; const hy = b - 40 * s;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={10 * s} ry={3 * s} fill="rgba(50,40,30,0.2)"/>
      <path d={`M${x} ${b} Q${x + 12 * s} ${b - 26 * s} ${x - 2 * s} ${hy}`} stroke="#3C7A50" strokeWidth={3.4 * s} fill="none" strokeLinecap="round"/>
      <path d={`M${x + 5 * s} ${b - 16 * s} Q${x + 18 * s} ${b - 20 * s} ${x + 20 * s} ${b - 10 * s} Q${x + 10 * s} ${b - 10 * s} ${x + 5 * s} ${b - 16 * s} Z`} fill="#54A86E"/>
      <circle cx={x - 2 * s} cy={hy + 3 * s} r={16 * s} fill={tint} opacity="0.2"/>
      <path d={`M${x - 2 * s} ${hy - 10 * s} Q${x - 12 * s} ${hy + 2 * s} ${x - 2 * s} ${hy + 13 * s} Q${x + 8 * s} ${hy + 2 * s} ${x - 2 * s} ${hy - 10 * s} Z`} fill={tint}/>
      <ellipse className="lm-glow" cx={x - 3 * s} cy={hy + 2 * s} rx={3.4 * s} ry={5 * s} fill="#FFF7D6"/>
    </g>
  );
};

const AlienCrystal = ({ x, s, tint }) => {
  const b = PLAT_Y;
  return (
    <g>
      <ellipse cx={x} cy={b} rx={17 * s} ry={5 * s} fill={tint} opacity="0.14"/>
      <path d={`M${x - 2 * s} ${b} L${x - 8 * s} ${b - 15 * s} L${x - 4 * s} ${b - 21 * s} L${x} ${b - 11 * s} Z`} fill={tint} opacity="0.85"/>
      <path d={`M${x + 1 * s} ${b} L${x + 2 * s} ${b - 24 * s} L${x + 6 * s} ${b - 13 * s} L${x + 8 * s} ${b} Z`} fill={tint}/>
      <path d={`M${x + 6 * s} ${b} L${x + 12 * s} ${b - 12 * s} L${x + 13 * s} ${b} Z`} fill={tint} opacity="0.7"/>
      <path d={`M${x + 2 * s} ${b - 24 * s} L${x + 3 * s} ${b - 20 * s}`} stroke="rgba(255,255,255,0.7)" strokeWidth={1 * s} strokeLinecap="round"/>
    </g>
  );
};

const SPORES = [[120, 150, '#8FE0D0'], [252, 132, '#C6A6F0'], [318, 116, '#FFD98A'], [70, 132, '#8FD8F0'], [186, 120, '#B0F0C0'], [292, 150, '#F0A0C8']];

const farWindows = (x, w, ty, idx) => {
  const out = []; const cols = Math.max(1, Math.round((w - 6) / 7));
  const stepX = cols > 1 ? (w - 6) / (cols - 1) : 0;
  const rows = Math.floor((PLAT_Y - 6 - (ty + 6)) / 9);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if ((c * 5 + r * 7 + idx * 3) % 3 === 0) continue;
      out.push(<circle key={`${r}-${c}`} cx={x + 3 + c * stepX} cy={ty + 8 + r * 9} r="0.9" fill="#FFE6A6" opacity="0.72"/>);
    }
  }
  return out;
};

const Lamp = ({ x, h = 34 }) => {
  const b = PLAT_Y;
  return (
    <g>
      <rect x={x - 1.4} y={b - h} width="2.8" height={h} rx="1.4" fill="#7A6448"/>
      <path d={`M${x} ${b - h} q0 -5 7 -5`} stroke="#7A6448" strokeWidth="2.4" fill="none"/>
      <circle cx={x + 8} cy={b - h - 3} r="6.5" fill="#FFE39A" opacity="0.4"/>
      <circle className="lm-glow" cx={x + 8} cy={b - h - 3} r="3.4" fill="url(#lmGlow)"/>
    </g>
  );
};

const LandingPod = ({ x, s = 1 }) => {
  const b = PLAT_Y;
  return (
    <g>
      <path d={`M${x - 15 * s} ${b} L${x - 10 * s} ${b - 14 * s} M${x + 15 * s} ${b} L${x + 10 * s} ${b - 14 * s}`} stroke="#8A93A0" strokeWidth={2.8 * s} strokeLinecap="round"/>
      <ellipse cx={x} cy={b} rx={24 * s} ry={4 * s} fill="#8FD8EE" opacity="0.22"/>
      <ellipse cx={x} cy={b - 20 * s} rx={21 * s} ry={13 * s} fill="#D9E0E8"/>
      <ellipse cx={x} cy={b - 24 * s} rx={21 * s} ry={9 * s} fill="#EEF3F7"/>
      <path d={`M${x - 21 * s} ${b - 19 * s} Q${x} ${b - 12 * s} ${x + 21 * s} ${b - 19 * s}`} stroke="#FF7A4A" strokeWidth={2.6 * s} fill="none"/>
      <path d={`M${x - 11 * s} ${b - 27 * s} A ${11 * s} ${11 * s} 0 0 1 ${x + 11 * s} ${b - 27 * s} Z`} fill="#8FD8EE"/>
      <path d={`M${x - 11 * s} ${b - 27 * s} A ${11 * s} ${11 * s} 0 0 1 ${x + 11 * s} ${b - 27 * s}`} fill="none" stroke="#B9C6D2" strokeWidth={1.4 * s}/>
      <ellipse cx={x - 4 * s} cy={b - 31 * s} rx={3 * s} ry={2 * s} fill="rgba(255,255,255,0.75)"/>
    </g>
  );
};

const FloatCrystal = ({ x, y, s, tint, d = 0 }) => (
  <g className="lm-float" style={{ animationDelay: `${d}s` }}>
    <circle cx={x} cy={y} r={13 * s} fill={tint} opacity="0.16"/>
    <path d={`M${x} ${y - 13 * s} L${x + 8 * s} ${y} L${x} ${y + 13 * s} L${x - 8 * s} ${y} Z`} fill={tint} opacity="0.9"/>
    <path d={`M${x} ${y - 13 * s} L${x + 8 * s} ${y} L${x} ${y} Z`} fill="rgba(255,255,255,0.42)"/>
  </g>
);

const FlyCreature = ({ x, y, s, tint, d = 0 }) => (
  <g className="lm-fly" style={{ animationDelay: `${d}s` }}>
    <path d={`M${x - 9 * s} ${y} Q${x - 3 * s} ${y - 6 * s} ${x} ${y} Q${x + 3 * s} ${y - 6 * s} ${x + 9 * s} ${y} Q${x + 3 * s} ${y + 3 * s} ${x} ${y + 1 * s} Q${x - 3 * s} ${y + 3 * s} ${x - 9 * s} ${y} Z`} fill={tint} opacity="0.85"/>
    <circle cx={x} cy={y} r={1.6 * s} fill="rgba(255,255,255,0.85)"/>
  </g>
);

const FLORA = [
  { x: 20, s: 1.3, C: AlienBloom, tint: '#4FD8C2' },
  { x: 92, s: 1.05, C: AlienShroom, tint: '#CD8AE2' },
  { x: 302, s: 1.05, C: AlienLantern, tint: '#6FD0F0' },
  { x: 346, s: 1.18, C: AlienShroom, tint: '#F0A0C8' },
  { x: 386, s: 1.3, C: AlienBloom, tint: '#9BE86A' }
];

const CRYSTALS = [{ x: 114, s: 0.85, tint: '#7FE0D8' }, { x: 322, s: 0.85, tint: '#BEA0F0' }, { x: 370, s: 0.72, tint: '#8FD8F0' }];

const FLOATERS = [{ x: 120, y: 92, s: 0.85, tint: '#7FE0D8', d: 0 }, { x: 292, y: 78, s: 1.0, tint: '#BEA0F0', d: 1.3 }];

const CREATURES = [{ x: 100, y: 62, s: 1.0, tint: '#B4E4F0', d: 0 }, { x: 246, y: 48, s: 0.8, tint: '#F0C0E0', d: 1.1 }, { x: 320, y: 70, s: 0.9, tint: '#C6E8A6', d: 0.5 }];

const GROUND_FLOWERS = [[38, '#8FE0D0'], [116, '#F0A0C8'], [300, '#8FD8F0'], [352, '#C6A6F0'], [388, '#FFD98A']];

const LumoCityBg = ({ fill = false }) => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio={fill ? 'xMidYMid slice' : 'xMidYMax meet'} aria-hidden="true">
    <rect x="0" y="0" width="400" height="230" fill="url(#lmSky)"/>
    {/* iliq quyosh (yuqori-o'ng) */}
    <circle cx="336" cy="38" r="42" fill="#FFE39A" opacity="0.4"/>
    <circle cx="336" cy="38" r="23" fill="url(#lmSun)"/>
    {/* O'ZGA SAYYORA OSMONI: halqali sayyora + oy */}
    <g>
      <circle cx="62" cy="44" r="15" fill="#C79AD6"/>
      <ellipse cx="62" cy="44" rx="25" ry="5.5" fill="none" stroke="#E6C8F0" strokeWidth="2.4" opacity="0.85"/>
      <ellipse cx="56" cy="39" rx="5" ry="3.2" fill="rgba(255,255,255,0.32)"/>
    </g>
    <g>
      <circle cx="150" cy="28" r="9" fill="#FBEAC6"/>
      <circle cx="154" cy="25" r="8" fill="url(#lmSky)"/>
    </g>
    <Cloud x={104} y={56} s={1.0}/>
    <Cloud x={244} y={40} s={0.8}/>
    {/* uchuvchi jonzotlar (osmon hayoti) */}
    {CREATURES.map((c, i) => <FlyCreature key={i} {...c}/>)}
    {/* uchar kristallar (havoda) */}
    {FLOATERS.map((f, i) => <FloatCrystal key={i} {...f}/>)}
    {/* UZOQ SHAHAR (xira, yuzlab chiroq) */}
    <g opacity="0.5">
      {FAR_TOWN.map(([x, w, ty], i) => (
        <g key={i}>
          <rect x={x} y={ty} width={w} height={230 - ty} rx="5" fill="#D6B4C0"/>
          {farWindows(x, w, ty, i + 1)}
        </g>
      ))}
    </g>
    {/* asosiy uylar — pastel; tom uchli/tekis/gumbaz; iliq derazalar */}
    {TOWN.map(([x, w, ty, body, roof, type], i) => (
      <g key={i}>
        {type === 'pitch' && <path d={`M${x - 3} ${ty + 2} L${x + w / 2 - 6} ${ty - 15} Q${x + w / 2} ${ty - 21} ${x + w / 2 + 6} ${ty - 15} L${x + w + 3} ${ty + 2} Z`} fill={roof}/>}
        {type === 'dome' && <path d={`M${x} ${ty + 2} A ${w / 2} ${w / 2.4} 0 0 1 ${x + w} ${ty + 2} Z`} fill={roof}/>}
        {type === 'flat' && <rect x={x - 3} y={ty - 8} width={w + 6} height="11" rx="4.5" fill={roof}/>}
        <rect x={x} y={ty} width={w} height={230 - ty} rx="9" fill={body}/>
        <rect x={x + 2} y={ty + 2} width="4" height={228 - ty} rx="2" fill="rgba(255,255,255,0.28)"/>
        {houseWindows(x, w, ty, i + 1)}
      </g>
    ))}
    {/* chiroq-ustunlar */}
    {LAMPS.map((x, i) => <Lamp key={i} x={x}/>)}
    {/* havoda porlovchi sporalar */}
    {SPORES.map(([sx, sy, c], i) => <circle key={i} className="lm-glow" style={{ animationDelay: `${i * 0.6}s` }} cx={sx} cy={sy} r="2.3" fill={c} opacity="0.85"/>)}
    {/* pol + yumshoq soya (grade1 naqsh) */}
    <rect x="0" y={PLAT_Y} width="400" height={230 - PLAT_Y} fill="url(#lmGround)"/>
    <line x1="0" y1={PLAT_Y} x2="400" y2={PLAT_Y} stroke="#C9A96E" strokeWidth="2"/>
    <ellipse cx="200" cy={PLAT_Y + 26} rx="180" ry="15" fill="#C9A96E" opacity="0.4"/>
    {/* shaharga eltuvchi yo'l */}
    <path d={`M168 230 L246 230 L216 ${PLAT_Y + 1} L198 ${PLAT_Y + 1} Z`} fill="#E4CDA0" opacity="0.6"/>
    <path d={`M198 ${PLAT_Y + 1} L216 ${PLAT_Y + 1} L214 ${PLAT_Y + 8} L200 ${PLAT_Y + 8} Z`} fill="#EFDCB4" opacity="0.5"/>
    {/* qo'ngan kema (old plan chap) */}
    <LandingPod x={52} s={1.05}/>
    {/* o'zga o'simlik + kristall + gullar (polda, old plan) */}
    {CRYSTALS.map(({ x, s, tint }, i) => <AlienCrystal key={i} x={x} s={s} tint={tint}/>)}
    {FLORA.map(({ x, s, C, tint }, i) => <C key={i} x={x} s={s} tint={tint}/>)}
    {GROUND_FLOWERS.map(([x, c], i) => (
      <g key={i}>
        <g fill={c} opacity="0.7"><circle cx={x - 2.6} cy={PLAT_Y + 8} r="1.6"/><circle cx={x + 2.6} cy={PLAT_Y + 8} r="1.6"/><circle cx={x} cy={PLAT_Y + 5.6} r="1.6"/><circle cx={x} cy={PLAT_Y + 10.4} r="1.6"/></g>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={PLAT_Y + 8} r="1.7" fill="#FFF4D0"/>
      </g>
    ))}
  </svg>
);

// QADIMGI ZAL — 8-darsning sahnasi (rim raqamlari kvartali). Metodist 2026-08-09: qolgan
// darslarning HAMMASIDA shu sahna turadi.
//
// Bu yerda faqat BINONING o'zi: devor, ravoq, ustunlar, pol, moss-fonarlar. Markazdagi stela
// va yon artefaktlar YO'Q — ularni har dars o'z qatlamida chizadi, chunki ular darsning
// mavzusiga tegishli. 24–32 darslarda zal har safar 87 satrdan nusxalangan; endi bitta joyda.
// id lar `lmh` bilan boshlanadi: darslardagi eski `h8…` nusxalari bilan to'qnashmasin.
const AncientHallBg = ({ fill = false }) => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio={fill ? 'xMidYMid slice' : 'xMidYMax meet'} aria-hidden="true">
    <defs>
      <linearGradient id="lmhWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EADAB4"/><stop offset="100%" stopColor="#CDB689"/></linearGradient>
      <linearGradient id="lmhCol" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A8946A"/><stop offset="42%" stopColor="#E8D8B2"/><stop offset="100%" stopColor="#A8946A"/></linearGradient>
      <linearGradient id="lmhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5E4256"/><stop offset="45%" stopColor="#A8705E"/><stop offset="82%" stopColor="#D89A66"/><stop offset="100%" stopColor="#F2C88E"/></linearGradient>
      <linearGradient id="lmhFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9B283"/><stop offset="100%" stopColor="#A38A5E"/></linearGradient>
      <linearGradient id="lmhSlab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4D3AC"/><stop offset="100%" stopColor="#C6AE7E"/></linearGradient>
      <radialGradient id="lmhSun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#EE9A5A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <radialGradient id="lmhMoss" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#BFF0C8"/><stop offset="100%" stopColor="#7FD0A0" stopOpacity="0"/></radialGradient>
      <clipPath id="lmhArch"><path d="M124 96 L124 70 Q124 40 200 40 Q276 40 276 70 L276 96 Z"/></clipPath>
    </defs>
    {/* devor va shift */}
    <rect x="0" y="0" width="400" height="180" fill="url(#lmhWall)"/>
    <rect x="0" y="0" width="400" height="20" fill="#C2AC7E"/><rect x="0" y="19" width="400" height="3" fill="#9A855C"/>
    <g fill="#B09A6E">{[40, 96, 152, 248, 304, 360].map((x, i) => <rect key={i} x={x} y="6" width="30" height="8" rx="1.5"/>)}</g>
    {/* osma moss-fonarlar */}
    {[104, 200, 296].map((cx, i) => (
      <g key={i}>
        <line x1={cx} y1="20" x2={cx} y2="30" stroke="#8A7550" strokeWidth="1.6"/>
        <path d={`M${cx - 6} 30 h12 l-2 9 h-8 Z`} fill="#B7A176" stroke="#8A7550" strokeWidth="0.8"/>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="35" r="4.2" fill="#BFF0C8"/>
        <ellipse cx={cx} cy="34" rx="11" ry="16" fill="url(#lmhMoss)" opacity="0.5"/>
      </g>
    ))}
    {/* ravoq ortida vayrona mahalla */}
    <g clipPath="url(#lmhArch)">
      <rect x="120" y="38" width="160" height="60" fill="url(#lmhSky)"/>
      <g><circle cx="150" cy="60" r="7" fill="#C79AD6"/><ellipse cx="150" cy="60" rx="12" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.3" opacity="0.8"/></g>
      <circle cx="250" cy="88" r="15" fill="url(#lmhSun)"/><circle cx="250" cy="88" r="7" fill="#FFD89A"/>
      <g opacity="0.6" fill="#9A6E68"><path d="M132 96 v-16 q6 -8 12 0 v16 Z"/><rect x="160" y="82" width="12" height="14"/><path d="M182 96 v-20 l7 -6 l7 6 v20 Z"/><rect x="214" y="84" width="10" height="12"/></g>
      <g fill="#FFE39A" opacity="0.8"><circle cx="138" cy="88" r="1"/><circle cx="187" cy="86" r="1"/></g>
    </g>
    <path d="M116 96 L116 70 Q116 32 200 32 Q284 32 284 70 L284 96 L276 96 L276 70 Q276 40 200 40 Q124 40 124 70 L124 96 Z" fill="url(#lmhCol)" stroke="#8A7550" strokeWidth="1.2"/>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.7"><path d="M150 43 l-4 -7"/><path d="M200 36 v-8"/><path d="M250 43 l4 -7"/></g>
    {/* ramka ustunlari */}
    {[28, 334].map((x, i) => (
      <g key={i}>
        <rect x={x - 6} y="24" width="54" height="12" rx="3" fill="url(#lmhCol)" stroke="#8A7550" strokeWidth="1"/>
        <rect x={x} y="36" width="42" height="140" fill="url(#lmhCol)" stroke="#8A7550" strokeWidth="1"/>
        <g stroke="#9A855C" strokeWidth="1.2" opacity="0.55">{[10, 21, 32].map((dx, k) => <line key={k} x1={x + dx} y1="40" x2={x + dx} y2="172"/>)}</g>
        <rect x={x - 4} y="168" width="50" height="10" rx="2" fill="url(#lmhCol)" stroke="#8A7550" strokeWidth="1"/>
        <circle className="lm-glow" cx={x + 21} cy="30" r="3" fill="#BFF0C8"/>
      </g>
    ))}
    {/* o'ng ustunga o'ralgan o'zga sayyora uzumchasi */}
    <path d="M356 172 Q346 150 356 130 Q366 110 356 90 Q348 74 356 60" fill="none" stroke="#6FBF8E" strokeWidth="2.4"/>
    <g fill="#8FD8A8">{[[352, 150], [360, 118], [350, 96], [358, 72]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="2.6"/>)}</g>
    {/* pol */}
    <rect x="0" y="176" width="400" height="54" fill="url(#lmhFloor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#8A7550" strokeWidth="2"/>
    <g stroke="#8A7550" strokeWidth="1" opacity="0.4"><path d="M30 230 L178 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M370 230 L222 178"/></g>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g fill="none" stroke="#8A7550" strokeWidth="0.8" opacity="0.3">{[160, 200, 240].map((cx, k) => <path key={k} d={`M${cx} 186 l8 5 l-8 5 l-8 -5 Z`}/>)}</g>
    {/* yiqilgan ustun bo'lagi va havodagi sporalar */}
    <g transform="translate(58 176)"><rect x="-2" y="-12" width="34" height="11" rx="3" fill="url(#lmhCol)" stroke="#8A7550" strokeWidth="1" transform="rotate(-6)"/><circle className="lm-glow" cx="0" cy="-8" r="2.6" fill="#BFF0C8"/></g>
    <g><circle className="lm-glow" cx="96" cy="70" r="1.5" fill="#DFF0C8"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="320" cy="150" r="1.4" fill="#CFEFD8"/></g>
  </svg>
);
// Zal ichidagi TAXTA: har dars markazga o'z narsasini qo'yadi, o'lchami hamma darsda bir xil.
const HALL_SLAB = { x: 116, y: 94, w: 168, h: 66, cx: 200 };

const RanoSVG = ({ mood = 'pointing', className = '' }) => {
  const big = mood === 'happy' || mood === 'celebrate';
  return (
    <svg className={`g1-char g1-char-rano ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1mskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1mdress" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF92B8"/><stop offset="100%" stopColor="#E84F86"/></linearGradient>
        <linearGradient id="g1mhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3A22"/><stop offset="100%" stopColor="#3A2516"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="34" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="57" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1mskin)"/>
      <rect x="65.5" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1mskin)"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#C23B63"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#C23B63"/>
      <path d="M43 36 Q43 11 65 11 Q87 11 87 36 L87 80 Q82 66 77 62 L77 40 Q77 27 65 27 Q53 27 53 40 L53 62 Q48 66 43 80 Z" fill="url(#g1mhair)"/>
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
      <path d="M50 56 Q52 50 58 49 L72 49 Q78 50 80 56 L94 146 Q65 155 36 146 Z" fill="url(#g1mdress)"/>
      <path d="M37 140 Q65 149 93 140 L94 146 Q65 155 36 146 Z" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="51" cy="57" rx="7" ry="6" fill="url(#g1mdress)"/>
      <ellipse cx="79" cy="57" rx="7" ry="6" fill="url(#g1mdress)"/>
      <path d="M58 50 Q65 57 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#FFFFFF"/>
      <path d="M46 67 Q65 72 84 67 L85 73 Q65 78 45 73 Z" fill="#D43E74"/>
      <circle cx="65" cy="70" r="2.6" fill="#FFD86B" stroke="#C99A2E" strokeWidth="0.8"/>
      <circle cx="65" cy="37" r="16.5" fill="url(#g1mskin)"/>
      <ellipse cx="45" cy="44" rx="7.5" ry="11" fill="url(#g1mhair)"/>
      <ellipse cx="85" cy="44" rx="7.5" ry="11" fill="url(#g1mhair)"/>
      <circle cx="48.5" cy="35" r="2.4" fill="#FF4F8B"/>
      <circle cx="81.5" cy="35" r="2.4" fill="#FF4F8B"/>
      <path d="M49 37 Q50 18 65 17 Q80 18 81 37 Q74 27 65 26 Q56 27 49 37 Z" fill="url(#g1mhair)"/>
      <path d="M65 16 L58 12 Q56 17 62 18 Z M65 16 L72 12 Q74 17 68 18 Z" fill="#FF4F8B"/>
      <circle cx="65" cy="16.5" r="2" fill="#E03A78"/>
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

const AnvarSVG = ({ pose = 'door', className = '' }) => {
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
      <rect x="57" y="120" width="8" height="48" rx="3.5" fill="#46566B"/>
      <rect x="65" y="120" width="8" height="48" rx="3.5" fill="#3C4A5C"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#22303F"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#22303F"/>
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
      <path d="M51 56 Q53 50 60 49 L70 49 Q77 50 79 56 L86 118 Q65 124 44 118 Z" fill="url(#g1ashirt)"/>
      <ellipse cx="52" cy="57" rx="6.5" ry="5.5" fill="url(#g1ashirt)"/>
      <ellipse cx="78" cy="57" rx="6.5" ry="5.5" fill="url(#g1ashirt)"/>
      <path d="M58 50 Q65 56 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#1F4E8C"/>
      <ellipse cx="50" cy="39" rx="2.6" ry="3.6" fill="url(#g1askin)"/>
      <ellipse cx="80" cy="39" rx="2.6" ry="3.6" fill="url(#g1askin)"/>
      <circle cx="65" cy="37" r="16" fill="url(#g1askin)"/>
      <path d="M49 39 Q48 32 54 30 L56 37 Q52 38 50 41 Z" fill="url(#g1ahair)"/>
      <path d="M81 39 Q82 32 76 30 L74 37 Q78 38 80 41 Z" fill="url(#g1ahair)"/>
      <path d="M47 34 Q47 15 65 14 Q83 15 83 34 Q65 28 47 34 Z" fill="#2C7BD6"/>
      <path d="M47 34 Q49 20 60 15 Q55 19 52 25 Q49 30 49 35 Z" fill="#2569B8"/>
      <rect x="47" y="32" width="36" height="4" rx="2" fill="#2569B8"/>
      <circle cx="65" cy="14.5" r="2.2" fill="#2569B8"/>
      <path d="M47 35 Q31 36 27 42 Q42 45 50 39 Z" fill="#2569B8"/>
      <path d="M47 35 Q34 36 29 41 Q42 42 49 38 Z" fill="#1E5599"/>
      <g stroke="#3A2A1E" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M55 36 Q59 34.6 62.5 36"/>
        <path d="M67.5 36 Q71 34.6 75 36"/>
      </g>
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
    </svg>
  );
};

const JasurSVG = ({ pose = 'pointing', className = '' }) => {
  const happy = pose === 'happy';
  return (
    <svg className={`g1-char g1-char-jasur ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1jskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F6C79A"/><stop offset="100%" stopColor="#D89A63"/></radialGradient>
        <linearGradient id="g1jvest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#54B777"/><stop offset="100%" stopColor="#2F8E52"/></linearGradient>
        <linearGradient id="g1jhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#332A22"/><stop offset="100%" stopColor="#1C1611"/></linearGradient>
        <linearGradient id="g1jbag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F0843A"/><stop offset="100%" stopColor="#D2611E"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="32" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="79" y="60" width="25" height="46" rx="9" fill="url(#g1jbag)" stroke="#B9531A" strokeWidth="1.5"/>
      <rect x="85" y="76" width="15" height="18" rx="4" fill="#E5752B" stroke="#B9531A" strokeWidth="1.1"/>
      <path d="M88 76 v18" stroke="#B9531A" strokeWidth="1.2"/>
      <rect x="57" y="120" width="8" height="48" rx="3.5" fill="#4A5A48"/>
      <rect x="65" y="120" width="8" height="48" rx="3.5" fill="#3E4D3D"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#5B3A24"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#4A2E1C"/>
      {!happy && (
        <g>
          <path d="M78 60 Q86 76 86 92" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="86" cy="93" r="4.6" fill="url(#g1jskin)"/>
          <path d="M52 58 Q42 50 36 40" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="35" cy="39" r="4.6" fill="url(#g1jskin)"/>
        </g>
      )}
      {happy && (
        <g>
          <path d="M52 58 Q44 42 40 28" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="40" cy="27" r="4.6" fill="url(#g1jskin)"/>
          <path d="M78 58 Q86 42 90 28" stroke="url(#g1jskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="90" cy="27" r="4.6" fill="url(#g1jskin)"/>
        </g>
      )}
      <path d="M51 56 Q53 50 60 49 L70 49 Q77 50 79 56 L86 118 Q65 124 44 118 Z" fill="url(#g1jvest)"/>
      <ellipse cx="52" cy="57" rx="6.5" ry="5.5" fill="url(#g1jvest)"/>
      <ellipse cx="78" cy="57" rx="6.5" ry="5.5" fill="url(#g1jvest)"/>
      <path d="M59 49 L65 57 L71 49 L68.5 48 L65 52.5 L61.5 48 Z" fill="#FFFFFF"/>
      <path d="M60 50 L65 57.5 L70 50" stroke="#2A7E48" strokeWidth="1.6" fill="none"/>
      <path d="M58 51 Q60 82 63 113" stroke="#E5752B" strokeWidth="4.6" fill="none" strokeLinecap="round"/>
      <path d="M73 51 Q70 82 68 113" stroke="#E5752B" strokeWidth="4.6" fill="none" strokeLinecap="round"/>
      <circle cx="62" cy="100" r="2.2" fill="#C25E1C"/><circle cx="69" cy="100" r="2.2" fill="#C25E1C"/>
      <ellipse cx="50" cy="39" rx="2.6" ry="3.6" fill="url(#g1jskin)"/>
      <ellipse cx="80" cy="39" rx="2.6" ry="3.6" fill="url(#g1jskin)"/>
      <circle cx="65" cy="37" r="16" fill="url(#g1jskin)"/>
      <path d="M49 37 Q47 19 65 17 Q84 18 82 36 Q79 27 70 25 Q74 31 69 32 Q64 24 55 28 Q50 31 51 39 Z" fill="url(#g1jhair)"/>
      <path d="M54 29 Q61 23 71 27 Q63 28 58 33 Q55 32 54 29 Z" fill="#241B14"/>
      <g stroke="#332419" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M55 36 Q59 34.6 62.5 36"/>
        <path d="M67.5 36 Q71 34.6 75 36"/>
      </g>
      <g className="g1-eyes">
        <circle cx="59" cy="39" r="2.2" fill="#332419"/><circle cx="71" cy="39" r="2.2" fill="#332419"/>
        <circle cx="59.8" cy="38.2" r="0.7" fill="#fff"/><circle cx="71.8" cy="38.2" r="0.7" fill="#fff"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {happy
        ? <path d="M59 43 Q65 51 71 43 Q65 47 59 43 Z" fill="#B83A2B"/>
        : <path d="M60 44 Q65 48 70 44" stroke="#B83A2B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="54" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.32)"/>
      <ellipse cx="76" cy="44" rx="3" ry="2" fill="rgba(255,120,120,0.32)"/>
      {!happy && <g><rect x="79" y="92" width="23" height="16" rx="2" fill="#3C7BC0"/><rect x="79" y="92" width="23" height="4" fill="#2C63A0"/><line x1="90.5" y1="96" x2="90.5" y2="108" stroke="#2C63A0" strokeWidth="1.3"/></g>}
    </svg>
  );
};

const ZuhraSVG = ({ mood = 'pointing', className = '' }) => {
  const big = mood === 'happy' || mood === 'celebrate';
  return (
    <svg className={`g1-char g1-char-zuhra ${className}`} viewBox="0 0 130 190" aria-hidden="true">
      <defs>
        <radialGradient id="g1uskin" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id="g1udress" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFC24B"/><stop offset="100%" stopColor="#EF8E22"/></linearGradient>
        <linearGradient id="g1uhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3E2A1A"/><stop offset="100%" stopColor="#241307"/></linearGradient>
      </defs>
      <ellipse cx="64" cy="178" rx="34" ry="5" fill="rgba(58,53,48,0.13)"/>
      <rect x="57" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1uskin)"/>
      <rect x="65.5" y="140" width="7.5" height="28" rx="3.7" fill="url(#g1uskin)"/>
      <ellipse cx="60" cy="170" rx="8" ry="4.2" fill="#C26A12"/>
      <ellipse cx="70" cy="170" rx="8" ry="4.2" fill="#C26A12"/>
      <path d="M38 46 Q33 32 41 24 Q41 13 53 14 Q57 5 66 9 Q75 5 80 14 Q92 14 91 26 Q98 34 92 47 Q97 60 87 68 L87 50 Q87 30 64 30 Q43 30 43 50 L43 68 Q33 60 38 46 Z" fill="url(#g1uhair)"/>
      <circle cx="42" cy="50" r="7.5" fill="url(#g1uhair)"/>
      <circle cx="88" cy="50" r="7.5" fill="url(#g1uhair)"/>
      <circle cx="40" cy="40" r="6" fill="url(#g1uhair)"/>
      <circle cx="90" cy="40" r="6" fill="url(#g1uhair)"/>
      {big ? (
        <g>
          <path d="M53 58 Q45 42 41 28" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="41" cy="27" r="4.6" fill="url(#g1uskin)"/>
          <path d="M77 58 Q85 42 89 28" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="89" cy="27" r="4.6" fill="url(#g1uskin)"/>
        </g>
      ) : (
        <g>
          <path d="M53 58 Q46 74 43 91" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="43" cy="92" r="4.6" fill="url(#g1uskin)"/>
          <path d="M77 58 Q84 74 87 91" stroke="url(#g1uskin)" strokeWidth="7" fill="none" strokeLinecap="round"/><circle cx="87" cy="92" r="4.6" fill="url(#g1uskin)"/>
        </g>
      )}
      <path d="M50 56 Q52 50 58 49 L72 49 Q78 50 80 56 L94 146 Q65 155 36 146 Z" fill="url(#g1udress)"/>
      <path d="M37 140 Q65 149 93 140 L94 146 Q65 155 36 146 Z" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="51" cy="57" rx="7" ry="6" fill="url(#g1udress)"/>
      <ellipse cx="79" cy="57" rx="7" ry="6" fill="url(#g1udress)"/>
      <path d="M58 50 Q65 57 72 50 Q68 54 65 54 Q62 54 58 50 Z" fill="#FFFFFF"/>
      <path d="M46 67 Q65 72 84 67 L85 73 Q65 78 45 73 Z" fill="#D9781A"/>
      <circle cx="65" cy="70" r="2.6" fill="#FFF1C2" stroke="#C99A2E" strokeWidth="0.8"/>
      <circle cx="65" cy="37" r="16.5" fill="url(#g1uskin)"/>
      <path d="M48 39 Q47 24 56 22 Q59 17 65 21 Q71 17 74 22 Q83 24 82 39 Q79 31 74 32 Q71 27 67 31 Q64 26 60 31 Q56 27 53 32 Q50 31 48 39 Z" fill="url(#g1uhair)"/>
      <g>
        <circle cx="50" cy="27" r="2.6" fill="#FF7AA8"/>
        <circle cx="50" cy="22" r="2.3" fill="#FF9CC0"/><circle cx="54.5" cy="25" r="2.3" fill="#FF9CC0"/><circle cx="52.5" cy="30" r="2.3" fill="#FF9CC0"/><circle cx="46.5" cy="29" r="2.3" fill="#FF9CC0"/><circle cx="45.5" cy="24" r="2.3" fill="#FF9CC0"/>
        <circle cx="50" cy="26" r="1.5" fill="#FFD86B"/>
      </g>
      <g className="g1-eyes">
        <circle cx="59" cy="37" r="2.1" fill="#3A2A1E"/><circle cx="71" cy="37" r="2.1" fill="#3A2A1E"/>
        <path d="M55.5 33 Q59 31.4 62 33" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M68 33 Q71 31.4 74.5 33" stroke="#3A2A1E" strokeWidth="1" fill="none" strokeLinecap="round"/>
      </g>
      <g fill="none" stroke="#2B7CD3" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="59" cy="37" r="5"/>
        <circle cx="71" cy="37" r="5"/>
        <path d="M64 37 Q65 35.8 66 37"/>
        <path d="M54 36 L49.5 34.5"/>
        <path d="M76 36 L80.5 34.5"/>
      </g>
      <path d="M64.6 39 Q65 41 65.9 41" stroke="#C98A6A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {big
        ? <path d="M59 44 Q65 52 71 44 Q65 48 59 44 Z" fill="#C0392B"/>
        : <path d="M60 45 Q65 49 70 45" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round"/>}
      <ellipse cx="53" cy="45" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
      <ellipse cx="77" cy="45" rx="3" ry="2" fill="rgba(255,120,120,0.4)"/>
    </svg>
  );
};

const LUMO_CAST = [
  { key: 'rano',  El: RanoSVG,  hook: { mood: 'pointing' } },
  { key: 'anvar', El: AnvarSVG, hook: { pose: 'door' } },
  { key: 'zuhra', El: ZuhraSVG, hook: { mood: 'pointing' } },
  { key: 'jasur', El: JasurSVG, hook: { pose: 'pointing' } }
];

const LUMO_ZONES = ['#F2A65A', '#7FD69B', '#C6A0F0', '#F0C24A', '#7FC4D6', '#5A8FD6'];

const ReadinessMeter = ({ screen, total, lang }) => {
  const pct = total > 1 ? screen / (total - 1) : 0;
  return (
    <div className="lm-meter" aria-hidden="true">
      <div className="lm-meter-label mono">{(READY_LABEL[lang] || READY_LABEL.ru)}</div>
      <div className="lm-meter-track">
        <div className="lm-meter-fill" style={{ height: `${Math.round(pct * 100)}%` }}/>
        {LUMO_ZONES.map((col, i) => (
          <span key={i} className={`lm-meter-dot ${i === 0 ? 'lm-meter-dot-cur' : ''}`} style={{ bottom: `${(i / (LUMO_ZONES.length - 1)) * 100}%`, background: col }}/>
        ))}
      </div>
    </div>
  );
};

const FrameFx = () => (
  <span className="lm-fx" aria-hidden="true"><i/><i/><i/><i/><i/></span>
);

const npKey = { width: 'clamp(38px, 9.5vw, 48px)', height: 'clamp(34px, min(8.5vw, 5.6dvh), 44px)', borderRadius: 11, border: `2px solid ${T.ink3}`, background: T.paper, fontWeight: 800, fontSize: 'clamp(17px, 4.4vw, 21px)', color: T.ink, fontFamily: "'JetBrains Mono', monospace" };

function useTapSteps(audio, total) {
  const [step, setStep] = useState(0);
  const done = step >= total - 1;
  const advance = () => {
    if (done) return;
    const nx = step + 1;
    setStep(nx);
    audio.triggerInternal(`step${nx}`);
  };
  return { step, done, advance };
}

const CheckStrip = ({ expr, cap = '', ok = true }) => (
  <span className={`d15-check ${ok ? 'd15-check-ok' : 'd15-check-no'} lm-reveal`}>
    <span className="mono d15-check-sign">{ok ? '✓' : '↺'}</span>
    <span className="mono d15-check-expr">{expr}</span>
    {cap ? <span className="d15-check-cap">{cap}</span> : null}
  </span>
);

const TaskTable = ({ heads, cells, hot = -1 }) => (
  <div className="d16-tbl" role="table">
    <div className="d16-tbl-row d16-tbl-head" role="row">
      {heads.map((h, i) => <span key={i} className="d16-tbl-cell" role="columnheader">{h}</span>)}
    </div>
    <div className="d16-tbl-row" role="row">
      {cells.map((c, i) => (
        <span key={i} className={`d16-tbl-cell mono d16-tbl-val ${i === hot ? 'd16-tbl-hot' : ''}`} role="cell">{c}</span>
      ))}
    </div>
  </div>
);

const FoldRow = ({ items }) => (
  <div className="d14-expr mono" aria-hidden="true">
    {items.map((it, i) => (
      <span key={i} className={`d14-tok${it.hot ? ' d14-tok-hot' : ''}${it.fresh ? ' d14-tok-fresh lm-reveal' : ''}${it.big ? ' d14-tok-big' : ''}`}>{it.txt}</span>
    ))}
  </div>
);

// Мост между экранами: текст берётся из BRIDGES урока, поэтому кит отдаёт фабрику.
export const makeBrgSeg = (BRIDGES) => (key, lang) => ({ id: `${key}_brg`, text: BRIDGES[key][lang], trigger: 'on_mount', waits_for: null });



// ============================================================
// GEOMETRIYA FIGURALARI (Б5 «KRISTALL ARXITEKTURA» uchun umumiy to'plam)
// ============================================================
// Metodist qarori 2026-08-06: «hamma geometrik figurani ideal qil, 1, 2 va 5-sinfdan
// olsang ham bo'ladi». Shu bo'yicha yig'ildi:
//   · katak to'r va yuza — 5-sinf `AreaGrid` va `TileGrid` g'oyasi (Dars20, Dars33);
//   · burchak, uchi, yoyi va to'g'ri burchak belgisi — 5-sinf `AngleFig` (Dars33);
//   · o'q simmetriyasi — 1-sinf `SymDemoFig` (Dars33);
//   · fazoviy shakllar — 1-sinf `SolidFig` (Dars33) va 5-sinf `AnimPyramid` (Dars36);
//   · ko'pburchaklar — 2-sinf `PolyFig` (Dars26).
// MUHIM FARQ: bu yerdagi figuralar CSS ga BOG'LIQ EMAS — hamma bo'yoq va qalinlik
// atributda yozilgan. Sabab: 1, 2 va 5-sinfda figuralar o'z darsining CSS iga tayanadi,
// ko'chirishda esa uslub qolib ketardi va figura «yalang'och» chiqardi.
//
// Umumiy o'lchov tili (hamma figurada bir xil):
//   chiziq #8A7550, ichki to'ldirish #F7F1E4, faol to'ldirish #F2A85C, urg'u #C06A2E,
//   yordamchi (ko'rinmas qirra) — punktir, qalinligi 1.
const GEO = {
  line: '#8A7550',
  fill: '#F7F1E4',
  on: '#F2A85C',
  accent: '#C06A2E',
  cool: '#2E7E9E',
  soft: '#EFE6D6',
  label: '#5A4A2E'
};

// --- KATAK TO'R: yuza (kataklarni sanash) va perimetr (chegarani aylanib chiqish).
// `mode`: 'area' — `filled` ta katak bo'yaladi; 'perimeter' — chegara yoritiladi va
// tomonlar bo'ylab yurish ko'rinadi; 'plain' — faqat to'r.
// `walk` (0..2·(w+h)) perimetr rejimida nechta chegara bo'lagi bosib o'tilganini beradi.
const GridFig = ({ w = 4, h = 3, mode = 'plain', filled = 0, walk = 0, unit = null, cell = 18, labels = null }) => {
  const pad = 14;
  const W = w * cell + pad * 2;
  const H = h * cell + pad * 2;
  const x0 = pad;
  const y0 = pad;
  // perimetr yurishi: yuqori qator -> o'ng ustun -> pastki qator -> chap ustun
  const edges = [];
  for (let i = 0; i < w; i++) edges.push([x0 + i * cell, y0, x0 + (i + 1) * cell, y0]);
  for (let i = 0; i < h; i++) edges.push([x0 + w * cell, y0 + i * cell, x0 + w * cell, y0 + (i + 1) * cell]);
  for (let i = w; i > 0; i--) edges.push([x0 + i * cell, y0 + h * cell, x0 + (i - 1) * cell, y0 + h * cell]);
  for (let i = h; i > 0; i--) edges.push([x0, y0 + i * cell, x0, y0 + (i - 1) * cell]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: `min(${W * 1.6}px, 88%)`, height: 'auto', display: 'block', margin: '0 auto' }} aria-hidden="true">
      {Array.from({ length: h }).map((_, r) => (
        Array.from({ length: w }).map((_, c) => {
          const i = r * w + c;
          const on = mode === 'area' && i < filled;
          return (
            <rect key={`${r}-${c}`} x={x0 + c * cell} y={y0 + r * cell} width={cell} height={cell}
              fill={on ? GEO.on : GEO.fill} stroke={GEO.line} strokeWidth="0.9"
              style={on ? { transition: 'fill .25s ease', transitionDelay: `${i * 0.03}s` } : undefined}/>
          );
        })
      ))}
      <rect x={x0} y={y0} width={w * cell} height={h * cell} fill="none" stroke={GEO.line} strokeWidth="1.8"/>
      {mode === 'perimeter' && edges.slice(0, walk).map(([ax, ay, bx, by], i) => (
        <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={GEO.accent} strokeWidth="3.4" strokeLinecap="round"/>
      ))}
      {labels && (
        <>
          <text x={x0 + (w * cell) / 2} y={y0 - 4} textAnchor="middle" fontSize="9" fontWeight="800"
            fill={GEO.label} fontFamily="'JetBrains Mono', monospace">{labels[0]}</text>
          <text x={x0 + w * cell + 4} y={y0 + (h * cell) / 2 + 3} fontSize="9" fontWeight="800"
            fill={GEO.label} fontFamily="'JetBrains Mono', monospace">{labels[1]}</text>
        </>
      )}
      {unit && (
        <text x={W - 4} y={H - 3} textAnchor="end" fontSize="8" fill={GEO.line}
          fontFamily="'JetBrains Mono', monospace">{unit}</text>
      )}
    </svg>
  );
};

// --- BURCHAK: 5-sinfning `AngleFig` i, uchi, yoyi va to'g'ri burchak kvadratchasi bilan.
// `deg` — burchak kattaligi; `mark` — to'g'ri burchakda kvadratcha chiqarish.
const AngleFig = ({ deg = 90, len = 62, mark = true, lab = null, tone = 'line' }) => {
  const W = 150;
  const H = 108;
  const vx = 34;
  const vy = 86;
  const rad = (deg * Math.PI) / 180;
  const x3 = vx + len * Math.cos(rad);
  const y3 = vy - len * Math.sin(rad);
  const r = 20;
  const stroke = tone === 'accent' ? GEO.accent : GEO.line;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 'min(190px, 46%)', height: 'auto', display: 'block' }} aria-hidden="true">
      <path d={`M ${vx + r} ${vy} A ${r} ${r} 0 0 0 ${vx + r * Math.cos(rad)} ${vy - r * Math.sin(rad)}`}
        fill="none" stroke={GEO.cool} strokeWidth="1.6"/>
      {mark && deg === 90 && (
        <polyline points={`${vx + 13},${vy} ${vx + 13},${vy - 13} ${vx},${vy - 13}`}
          fill="none" stroke={GEO.accent} strokeWidth="1.6"/>
      )}
      <line x1={vx} y1={vy} x2={vx + len} y2={vy} stroke={stroke} strokeWidth="2.6" strokeLinecap="round"/>
      <line x1={vx} y1={vy} x2={x3} y2={y3} stroke={stroke} strokeWidth="2.6" strokeLinecap="round"/>
      <circle cx={vx} cy={vy} r="3.4" fill={GEO.line}/>
      {lab && (
        <text x={vx + r + 6} y={vy - r / 2} fontSize="9" fontWeight="800" fill={GEO.label}
          fontFamily="'JetBrains Mono', monospace">{lab}</text>
      )}
    </svg>
  );
};

// --- UCHBURCHAK: turini `kind` belgilaydi. Teng tomonlar shtrix bilan, to'g'ri burchak
// kvadratcha bilan ko'rsatiladi — bola turni RASMDAN ajratadi, nomidan emas.
const TRI = {
  right: [[16, 96], [16, 26], [104, 96]],
  acute: [[18, 96], [62, 22], [110, 96]],
  obtuse: [[12, 92], [58, 58], [124, 92]],
  // asos 92, balandlik 92 · sqrt(3) / 2 = 79.7 -> uchi 96 - 79.7. Tomonlari ANIQ teng.
  equilateral: [[20, 96], [66, 16.3], [112, 96]],
  isosceles: [[24, 96], [66, 24], [108, 96]],
  scalene: [[14, 96], [40, 30], [122, 96]]
};
const TriangleFig = ({ kind = 'right', size = 'md', lab = null }) => {
  const pts = TRI[kind] || TRI.right;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const tick = (a, b, n) => {
    const [mx, my] = mid(a, b);
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = (-dy / L) * 4;
    const ny = (dx / L) * 4;
    const ux = (dx / L) * 3;
    const uy = (dy / L) * 3;
    return Array.from({ length: n }).map((_, k) => {
      const ox = (k - (n - 1) / 2) * ux * 1.6;
      const oy = (k - (n - 1) / 2) * uy * 1.6;
      return <line key={k} x1={mx + ox - nx} y1={my + oy - ny} x2={mx + ox + nx} y2={my + oy + ny}
        stroke={GEO.accent} strokeWidth="1.6" strokeLinecap="round"/>;
    });
  };
  return (
    <svg viewBox="0 0 138 112" style={{ width: size === 'sm' ? 'min(112px, 34%)' : 'min(172px, 46%)', height: 'auto', display: 'block' }} aria-hidden="true">
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={GEO.fill} stroke={GEO.line} strokeWidth="2.2" strokeLinejoin="round"/>
      {kind === 'right' && <polyline points="16,84 28,84 28,96" fill="none" stroke={GEO.accent} strokeWidth="1.6"/>}
      {kind === 'equilateral' && (
        <>{tick(pts[0], pts[1], 1)}{tick(pts[1], pts[2], 1)}{tick(pts[2], pts[0], 1)}</>
      )}
      {kind === 'isosceles' && (
        <>{tick(pts[0], pts[1], 1)}{tick(pts[1], pts[2], 1)}</>
      )}
      {lab && (
        <text x="69" y="108" textAnchor="middle" fontSize="9" fontWeight="800" fill={GEO.label}
          fontFamily="'JetBrains Mono', monospace">{lab}</text>
      )}
    </svg>
  );
};

// --- IKKI TO'G'RI CHIZIQ: parallel, perpendikulyar yoki oddiy kesishuvchi.
// Perpendikulyarda to'g'ri burchak kvadratchasi turadi — belgi rasmda, so'zda emas.
const LinePairFig = ({ kind = 'parallel', lab = null }) => (
  <svg viewBox="0 0 138 104" style={{ width: 'min(172px, 46%)', height: 'auto', display: 'block' }} aria-hidden="true">
    {kind === 'parallel' && (
      <>
        <line x1="14" y1="38" x2="124" y2="38" stroke={GEO.line} strokeWidth="2.6" strokeLinecap="round"/>
        <line x1="14" y1="68" x2="124" y2="68" stroke={GEO.line} strokeWidth="2.6" strokeLinecap="round"/>
        {[44, 74].map((x, i) => (
          <g key={i} stroke={GEO.accent} strokeWidth="1.6" strokeLinecap="round">
            <line x1={x} y1="33" x2={x + 6} y2="43"/>
            <line x1={x} y1="63" x2={x + 6} y2="73"/>
          </g>
        ))}
      </>
    )}
    {kind === 'perpendicular' && (
      <>
        <line x1="14" y1="60" x2="124" y2="60" stroke={GEO.line} strokeWidth="2.6" strokeLinecap="round"/>
        <line x1="66" y1="14" x2="66" y2="94" stroke={GEO.line} strokeWidth="2.6" strokeLinecap="round"/>
        <polyline points="66,48 78,48 78,60" fill="none" stroke={GEO.accent} strokeWidth="1.8"/>
      </>
    )}
    {kind === 'intersect' && (
      <>
        <line x1="14" y1="76" x2="124" y2="30" stroke={GEO.line} strokeWidth="2.6" strokeLinecap="round"/>
        <line x1="20" y1="26" x2="118" y2="82" stroke={GEO.line} strokeWidth="2.6" strokeLinecap="round"/>
        <circle cx="68" cy="54" r="3.4" fill={GEO.accent}/>
      </>
    )}
    {lab && (
      <text x="69" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill={GEO.label}
        fontFamily="'JetBrains Mono', monospace">{lab}</text>
    )}
  </svg>
);

// --- O'Q SIMMETRIYASI (1-sinfning `SymDemoFig` g'oyasi): shakl va uning o'qi.
// `axis`: 'v' | 'h' | 'd' | 'none'. O'q punktir, ikki yarim bir xil rangda.
const SYM_SHAPES = {
  house: 'M20,86 L20,46 L60,18 L100,46 L100,86 Z',
  arrow: 'M60,16 L96,56 L74,56 L74,88 L46,88 L46,56 L24,56 Z',
  leaf: 'M60,16 C92,36 92,72 60,90 C28,72 28,36 60,16 Z',
  flag: 'M28,18 L28,90 M28,22 L96,34 L28,50 Z'
};
const SymFig = ({ shape = 'house', axis = 'v', lab = null }) => (
  <svg viewBox="0 0 120 104" style={{ width: 'min(150px, 42%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d={SYM_SHAPES[shape] || SYM_SHAPES.house} fill={GEO.fill} stroke={GEO.line} strokeWidth="2.2" strokeLinejoin="round"/>
    {axis === 'v' && <line x1="60" y1="8" x2="60" y2="98" stroke={GEO.accent} strokeWidth="1.8" strokeDasharray="5 4"/>}
    {axis === 'h' && <line x1="8" y1="53" x2="112" y2="53" stroke={GEO.accent} strokeWidth="1.8" strokeDasharray="5 4"/>}
    {axis === 'd' && <line x1="14" y1="96" x2="106" y2="12" stroke={GEO.accent} strokeWidth="1.8" strokeDasharray="5 4"/>}
    {lab && (
      <text x="60" y="101" textAnchor="middle" fontSize="9" fontWeight="800" fill={GEO.label}
        fontFamily="'JetBrains Mono', monospace">{lab}</text>
    )}
  </svg>
);

// --- FAZOVIY SHAKLLAR (1-sinf `SolidFig` va 5-sinf `AnimPyramid` asosida):
// ko'rinmas qirralar PUNKTIR bilan — shakl hajmli ekani shundan ko'rinadi.
const SolidFig = ({ kind = 'pyramid4', lab = null }) => (
  <svg viewBox="0 0 132 116" style={{ width: 'min(164px, 44%)', height: 'auto', display: 'block' }} aria-hidden="true">
    {kind === 'pyramid4' && (
      <>
        <polygon points="24,86 66,102 108,86 66,72" fill={GEO.soft} stroke={GEO.line} strokeWidth="1.8"/>
        <polygon points="24,86 66,16 66,102" fill={GEO.fill} stroke={GEO.line} strokeWidth="2"/>
        <polygon points="108,86 66,16 66,102" fill="#E8D8B2" stroke={GEO.line} strokeWidth="2"/>
        <line x1="24" y1="86" x2="66" y2="72" stroke={GEO.line} strokeWidth="1.1" strokeDasharray="4 3"/>
        <line x1="108" y1="86" x2="66" y2="72" stroke={GEO.line} strokeWidth="1.1" strokeDasharray="4 3"/>
        <line x1="66" y1="72" x2="66" y2="16" stroke={GEO.line} strokeWidth="1.1" strokeDasharray="4 3"/>
      </>
    )}
    {kind === 'pyramid3' && (
      <>
        <polygon points="26,88 106,88 66,20" fill={GEO.fill} stroke={GEO.line} strokeWidth="2"/>
        <polygon points="26,88 106,88 78,74" fill="#E8D8B2" stroke={GEO.line} strokeWidth="1.6"/>
        <line x1="78" y1="74" x2="66" y2="20" stroke={GEO.line} strokeWidth="1.1" strokeDasharray="4 3"/>
      </>
    )}
    {kind === 'cone' && (
      <>
        <path d="M30,88 L66,16 L102,88" fill={GEO.fill} stroke={GEO.line} strokeWidth="2" strokeLinejoin="round"/>
        <ellipse cx="66" cy="88" rx="36" ry="12" fill={GEO.soft} stroke={GEO.line} strokeWidth="1.8"/>
        <path d="M30,88 A36,12 0 0 0 102,88" fill="none" stroke={GEO.line} strokeWidth="1.1" strokeDasharray="4 3"/>
      </>
    )}
    {kind === 'cylinder' && (
      <>
        <rect x="34" y="30" width="64" height="58" fill={GEO.fill} stroke={GEO.line} strokeWidth="2"/>
        <ellipse cx="66" cy="30" rx="32" ry="11" fill={GEO.soft} stroke={GEO.line} strokeWidth="1.8"/>
        <path d="M34,88 A32,11 0 0 0 98,88" fill="none" stroke={GEO.line} strokeWidth="2"/>
        <path d="M34,88 A32,11 0 0 1 98,88" fill="none" stroke={GEO.line} strokeWidth="1.1" strokeDasharray="4 3"/>
      </>
    )}
    {lab && (
      <text x="66" y="112" textAnchor="middle" fontSize="9" fontWeight="800" fill={GEO.label}
        fontFamily="'JetBrains Mono', monospace">{lab}</text>
    )}
  </svg>
);

// --- TO'RTBURCHAK TOMON YOZUVLARI BILAN: perimetr va yuza formulalari uchun.
const RectFig = ({ a = 5, b = 3, unit = 'sm', showArea = false, lab = null }) => {
  const k = 13;
  const W = a * k + 46;
  const H = b * k + 44;
  const x0 = 26;
  const y0 = 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: `min(${W * 1.5}px, 82%)`, height: 'auto', display: 'block', margin: '0 auto' }} aria-hidden="true">
      <rect x={x0} y={y0} width={a * k} height={b * k} fill={showArea ? GEO.on : GEO.fill} stroke={GEO.line} strokeWidth="2.2"/>
      {showArea && Array.from({ length: b }).map((_, r) => (
        Array.from({ length: a }).map((_, c) => (
          <rect key={`${r}-${c}`} x={x0 + c * k} y={y0 + r * k} width={k} height={k} fill="none" stroke="#C08A3E" strokeWidth="0.6" opacity="0.7"/>
        ))
      ))}
      <text x={x0 + (a * k) / 2} y={y0 - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={GEO.label}
        fontFamily="'JetBrains Mono', monospace">{a} {unit}</text>
      <text x={x0 - 6} y={y0 + (b * k) / 2 + 4} textAnchor="end" fontSize="10" fontWeight="800" fill={GEO.label}
        fontFamily="'JetBrains Mono', monospace">{b} {unit}</text>
      {lab && (
        <text x={x0 + (a * k) / 2} y={y0 + b * k + 18} textAnchor="middle" fontSize="10" fontWeight="800" fill={GEO.accent}
          fontFamily="'JetBrains Mono', monospace">{lab}</text>
      )}
    </svg>
  );
};


// ============================================================================
// УРОК ИЗ ДАННЫХ — вторая дорога кита (с блока Б5, урок 37 и дальше).
//
// Зачем: в уроках 1-36 экраны копировались из донора, и в файле урока на 2400 строк
// содержания было 386, а остальное — та же машинерия, что у соседа (сверка уроков 33-36
// дала 88% совпадения). Правило проекта запрещает копировать инфраструктуру между
// уроками; здесь она наконец лежит в одном месте.
//
// Урок теперь описывает только СЕБЯ: тексты (CONTENT), мосты между экранами, метаданные,
// узел сцены и героя карточки факта. Всё остальное приходит отсюда.
//
//   createLesson берётся из этого файла, LESSON_STYLES — из _kit/styles.js
//   export default createLesson({ CONTENT, BRIDGES, S14_PAYOFF, SCREEN_META, LESSON_META,
//                                 TOTAL_SCREENS, Scene, FactFig });
//
// Уроки 1-36 сюда НЕ переводились: они опубликованы и работают, а перевод ради единообразия
// стоил бы повторной проверки каждого. Старая дорога остаётся рабочей.
// ============================================================================
const LessonDataContext = createContext(null);
const useLessonData = () => useContext(LessonDataContext);

const LgRazryadTable = ({ h = 0, t = 0, o = 0, labels, emph = null, concrete = false, digits = false, onCell = null, cellSel = null }) => {
  const cols = [['h', h], ['t', t], ['o', o]];
  return (
    <div className="lm-mat">
      {cols.map(([k, n]) => (
        <div key={k} className={`lm-mat-col ${emph === k ? 'lm-mat-emph' : ''}`}>
          <div className="lm-mat-head mono">{labels[k]}</div>
          <div className="lm-mat-cell">
            {concrete && (
              <div className="lm-mat-stack">
                {n === 0
                  ? <span className="lm-mat-zero mono">0</span>
                  : Array.from({ length: n }).map((_, i) => (
                      <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        {k === 'h' ? <Panel className="lm-mat-panel"/> : k === 't' ? <Lenta className="lm-mat-lenta"/> : <Chiroq className="lm-mat-chiroq"/>}
                      </span>
                    ))}
              </div>
            )}
            {digits && (
              onCell
                ? <button className={`lm-mat-digit lm-mat-digit-btn mono ${cellSel === k ? 'lm-mat-digit-ok' : ''}`} onClick={() => onCell(k)}>{n}</button>
                : <div className="lm-mat-digit mono">{n}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};






























// --- HOOK SAHNASI: Lumo shahri + butun ekipaj sayyorada qo'ngan. Bit mezbon MARKAZDA, do'stlar yon-atrofda.




// ============================================================
// EKRANLAR — Dars09 «Ko'paytirish jadvali» (Б2 «Nur bog'lari»)
// ============================================================



// --- ZAL TAXTASI (D36): 8-darsning qadimgi zali kitdan keladi, dars faqat markaziy
// taxtaga o'z narsasini qo'yadi — kvadrat panel, tomoni belgilangan. Chapda va o'ngda
// mavzuning ikki yuzi: yuza (ichkaridagi kataklar) va perimetr (chekka bo'ylab yo'l).

const LgNumPad = ({ value, setValue, disabled, max = 3, state = null }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className={`mono${state === 'bad' ? ' lm-ans-bad' : ''}`} style={{ minWidth: 120, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#E0563A' : T.accent}`, background: state === 'ok' ? '#EAF6EF' : state === 'bad' ? '#FDECE7' : T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#B33F27' : T.ink, letterSpacing: 4, padding: '0 14px', transition: 'border-color .18s, background .18s, color .18s' }}>{value || '—'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 6 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={{ ...npKey, cursor: disabled ? 'default' : 'pointer' }}>{d}</button>
        ))}
        <span/>
        <button type="button" disabled={disabled} onClick={() => push('0')} style={{ ...npKey, cursor: disabled ? 'default' : 'pointer' }}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...npKey, fontSize: 18, color: T.accent, cursor: disabled ? 'default' : 'pointer' }}>⌫</button>
      </div>
    </div>
  );
};

// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================





// --- KONSOL YACHEYKASI (1-darsdan ko'chirilgan `.lm-cons*` uslubi, 15-darsning komponenti):
// `label` berilsa ekranchada YOZUV ko'rsatiladi (10 · 7), tagida terilgan javob yoki «?».
const LgMeasureCell = ({ head, n = 8, badge, val, lit = false, label = null }) => (
  <div className={`lm-cons ${lit ? 'lm-cons-lit' : ''}`}>
    {head ? <div className="lm-cons-head mono">{head}</div> : null}
    <div className="lm-cons-screen">
      {label !== null ? (
        <span className="mono d16-plate">{label}</span>
      ) : (
        <span className="d16-row">
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} className="d16-row-lamp"><Chiroq/></span>
          ))}
        </span>
      )}
      {badge ? <span className="lm-cons-x mono">{badge}</span> : null}
    </div>
    {val !== null && val !== undefined ? <div className="lm-cons-val mono lm-reveal">{val}</div> : <div className="lm-cons-val mono" style={{ color: '#C4BEB4' }}>?</div>}
  </div>
);





// --- FACTCARD QAHRAMONI: bir xil arqon, ikki xil shakl. Chekka teng, ichkaridagi joy esa
// yo'q. Kataklar chizilgan: bola sanab tekshirishi mumkin, gap ishonishda emas.
const LgMCOne = ({ props, ck, mono = false, figLine = null, figNode = null }) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const segs = Array.isArray(c.audio.intro[lang]) ? c.audio.intro[lang] : [c.audio.intro[lang]];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...segs.map((text, i) => ({ id: `${ck}_i${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: c.opts[c.ci][lang], studentAnswer: c.opts[c.ci][lang], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          {figNode}
          {figLine && <span className="mono lg3-errline">{figLine}</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: mono ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: mono ? "'JetBrains Mono', monospace" : undefined }}>{t(c.opts[k])}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.audio.on_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// --- BITTA TOPSHIRIQLI LgNumPad TRENAJYOR (16-darsning s11 naqshi, bitta misolga): javob
// teriladi, to'g'rida CheckStrip bilan teskari tekshirish, noto'g'rida turtki-hint.
const LgNumOne = ({ props, ck }) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const [solved, setSolved] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.hint)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.hint); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans), studentAnswer: String(c.ans), correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <LgNumPad value={solved ? String(c.ans) : val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || numLock || solved} max={String(c.ans).length} state={numState}/>
          {!solved && <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

const LgScreen0 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const order = React.useMemo(() => shuffleArr([0, 1, 2, 3]), []);
  const ok = picked !== null && order[picked] === 0;
  const fbKey = (i) => {
    const k = order[i];
    return k === 0 ? 'on_correct' : (k === 1 ? 'on_wrong1' : (k === 2 ? 'on_wrong2' : 'on_idk'));
  };
  const pick = (i) => {
    if (picked !== null || !canAct) return;
    setPicked(i);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio[fbKey(i)][lang]); }
  };
  const canAdv = useAdvanceGate(picked !== null, audio);
  const navContent = (
    <>
      {props.screen > 0 && <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>}
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const opts = [c.opt0, c.opt1, c.opt2, c.opt3];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1vw, 8px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1 lg3-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <Scene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
<span className="lg3-order">
              <span className="mono lg3-order-plate">6</span>
              <span className="lg3-order-sep mono">·</span>
              <span className="mono lg3-order-plate">6</span>
            </span>
            <span className="lg3-note">{t(c.order_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(12.5px, 2vw, 16px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, textAlign: 'center' }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span>{t(opts[order[picked]])}</span>
            </button>
          </div>
        )}
        {picked !== null && (
          <FeedbackBlock show={true} isCorrect={ok} wrongClass="frame-tip">
            <Reaction state={ok ? 'correct' : 'wrong'} praise={t(c.audio[fbKey(picked)])}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s1 — XONALAR BO'YICHA: tanish usul (darslik 45-bet, a bandi)
const LgScreen1 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <span className="mono lg3-plate">{lang === 'ru' ? c.task_line : c.task_line_uz}</span>
          {step >= 1 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono lg3-expr">{c.step1}</span>
              <span className="lg3-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono lg3-expr">{c.step2}</span>
              <span className="lg3-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono lg3-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
          )}
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

// s2 — MODEL: chegara bo'ylab kataklab yurish (kitning `GridFig` i, perimetr rejimi)
const LgScreen2 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const total = 2 * (c.w + c.h);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <GridFig w={c.w} h={c.h} mode="area" filled={step >= 2 ? c.w * c.h : step >= 1 ? c.w : 0} labels={[String(c.w), String(c.h)]}/>
          <div className="lg3-gridrow">
            {step >= 1 && (
              <span className="lg3-gridcap lm-reveal">
                <span className="lg3-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)', color: '#C97F35' }}>{t(c.capA)}</span>
              </span>
            )}
            {step >= 2 && (
              <span className="lg3-gridcap lm-reveal">
                <span className="lg3-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)', color: '#2E7E9E' }}>{t(c.capB)}</span>
              </span>
            )}
          </div>
          {step >= 2 && <span className="mono lg3-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
          )}
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

// s3 — SAVOL-OLDIN-QOIDA
const LgScreen3 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const solved = picked === ci;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(`${c.on_correct[lang]} ${c.rule_speech[lang]}`); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.hints[1])[lang]); }
    }
  };
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center', color: T.accent }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 800, textAlign: 'center' }}>
                {t(c.opts[k])}
              </button>
            ))}
          </div>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <div className="d15-rulelines">
              {c.rule_lines[lang].map((l, i) => <span key={i} className="d15-ruleline lm-reveal" style={{ animationDelay: `${i * 0.18}s` }}>{l}</span>)}
              <span className="mono d15-ruleex lm-reveal" style={{ animationDelay: '0.54s' }}>{c.rule_ex}</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s4 — RASM BO'YICHA: chizmadagi panelning yuzasi
// Чертёж на экране даёт урок (figs.s4). Клетчатая сетка остаётся ответом по умолчанию —
// она подходит уроку про площадь, но не уроку про треугольники или симметрию.
const LgScreen4 = (props) => {
  const { CONTENT, figs } = useLessonData();
  const own = figs && figs.s4;
  return (
  <LgMCOne props={props} ck="s4"
    figNode={own || <GridFig w={CONTENT.s4.fig_w} h={CONTENT.s4.fig_h} mode="area" filled={CONTENT.s4.fig_w * CONTENT.s4.fig_h} unit="sm2" labels={[String(CONTENT.s4.fig_w), String(CONTENT.s4.fig_h)]}/>}/>
  );
};

// s5 — SARALASH: tekis bo'linadi yoki qoldiq bilan
const LgScreen5 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [sel, setSel] = useState(false);
  const [wrongBin, setWrongBin] = useState(null);
  const [okBin, setOkBin] = useState(props.storedAnswer !== undefined ? (c.items[c.items.length - 1].a ? 'a' : 'b') : null);
  const [hintMsg, setHintMsg] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const triedRef = useRef(false);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  const place = (bin) => {
    if (!canAct || done || okBin !== null) return;
    const right = (bin === 'a') === it.a;
    if (right) {
      setOkBin(bin); sfx.playCorrect(); setHintMsg(null);
      if (!triedRef.current) setScore((s) => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => {
        const last = idx + 1 >= c.items.length;
        if (!last) { setOkBin(null); setSel(false); setWrongBin(null); }
        triedRef.current = false;
        setIdx((n) => n + 1);
      }, 1300);
    } else {
      setWrongBin(bin);
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(it.hint[lang]); }
      setTimeout(() => setWrongBin(null), 900);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'sort-bins',
        correctAnswer: String(c.items.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const bin = (key, label) => (
    <button className={`lm-bin ${okBin === key ? 'lm-bin-full' : ''} ${wrongBin === key ? 'option-picked-wrong' : ''} ${sel && okBin === null ? 'lm-bin-open' : ''}`}
      disabled={!canAct || done || okBin !== null} onClick={() => place(key)}>
      <span className="lm-bin-head mono">{t(label)}</span>
      <span className="lm-bin-slot mono">{okBin === key ? t(it.n) : ''}</span>
    </button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, c.items.length)} из ${c.items.length}` : `${Math.min(idx + 1, c.items.length)}-topshiriq, jami ${c.items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <div className="lm-digtray">
                {okBin === null
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{t(it.n)}</button>
                  : <span className="lm-digtray-empty mono">{t(it.n)}</span>}
              </div>
              <div className="lg3-bins">
                {bin('a', c.bin_a)}
                {bin('b', c.bin_b)}
              </div>
              {hintMsg && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${c.items.length}` : `To'g'ri: ${c.items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — TEST: 25 : 2, nechtasi ortadi
const LgScreen6 = (props) => <LgMCOne props={props} ck="s6" mono/>;

// s7 — KONSOL: 38 : 3, bo'linma va qoldiq
const LgScreen7 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s7;
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [phase, setPhase] = useState(props.storedAnswer ? c.cells.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const solved = phase >= c.cells.length;
  const cell = c.cells[Math.min(phase, c.cells.length - 1)];
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === cell.ans;
    setNumState(isOk ? 'ok' : 'bad');
    const last = phase + 1 >= c.cells.length;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : cell.hint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setPhase((p) => p + 1); }, last ? 400 : 900);
    } else {
      firstRef.current = false;
      setHintMsg(cell.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.lead),
        correctAnswer: '12', studentAnswer: '12', correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.1vw, 9px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <span className="mono lg3-expr">{c.swap_line}</span>
          <div className="lm-console" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 320 }}>
            {c.cells.map((cl, i) => (
              <LgMeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <LgNumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={String(c.cells[Math.min(phase, c.cells.length - 1)].ans).length} state={numState}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s8 — XATONI TOP: 53 : 4 = 12 (qold. 5)
const LgScreen8 = (props) => {
  const { CONTENT, figs } = useLessonData();
  return <LgMCOne props={props} ck="s8" figLine={CONTENT.s8.fig_line} figNode={figs && figs.s8}/>;
};

// s9 — BIT TUZOG'I: «javob chiroyli, tekshirish shart emas» (yopiq maydon)
const LgScreen9 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's9_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = trapPick === c.trap_ci || props.storedAnswer?.correct === true;
  const pickTrap = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === c.trap_ci) {
      setTrapPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.trap_label),
        correctAnswer: c.trap_opts[lang][c.trap_ci], studentAnswer: c.trap_opts[lang][c.trap_ci], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const lines = lang === 'ru' ? c.lines : c.lines_uz;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <span className="mono lg3-plate">{lines[0]}</span>
          <span className="lg3-bad">{lines[1]}</span>
          <span className="lg3-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="lg3-trap">
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.trap_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR: ko'paytirishni bo'lish bilan tekshirish (96 : 8)
const LgScreen10 = (props) => <LgNumOne props={props} ck="s10"/>;

// s11 — TRENAJYOR LgNumPad: 53 : 4
const LgScreen11 = (props) => <LgNumOne props={props} ck="s11"/>;

// s12 — MASALA: 74 : 6, yashiklar va ortiqcha detallar
const LgScreen12 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s12;
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const [pickIdx, setPickIdx] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [stepNum, setStepNum] = useState(0);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const chosen = pickIdx === ci || solved;
  const pick = (i) => {
    if (!canAct || chosen || wrongSet.has(i)) return;
    if (i === ci) {
      setPickIdx(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.pick_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.hints[1])[lang]); }
    }
  };
  const stepAns = stepNum === 0 ? c.ans1 : c.ans2;
  const stepHint = stepNum === 0 ? c.hint1 : c.hint2;
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === stepAns;
    setNumState(isOk ? 'ok' : 'bad');
    const last = stepNum === 1;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : stepHint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      if (last) { setSolved(true); }
      else { setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setStepNum(1); }, 900); }
    } else {
      firstRef.current = false;
      setHintMsg(stepHint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans2), studentAnswer: String(c.ans2), correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.1vw, 9px)' }}>
        <h1 className="title h-sub fade-up" style={{ margin: 0, fontSize: 'clamp(13px, 2.1vw, 18px)' }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <TaskTable heads={c.tbl_heads.map((h) => t(h))} cells={c.tbl_cells}/>
          {!chosen && (
            <>
              <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(c.pick_label)}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(96px, 1fr))', gap: 10, width: '100%' }}>
                {order.map((k, i) => (
                  <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2.4vw, 19px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.opts[k])}</button>
                ))}
              </div>
            </>
          )}
          {chosen && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <span className="lg3-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <LgNumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={String(stepNum === 0 ? c.ans1 : c.ans2).length} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono lg3-res lm-reveal">{c.ans1} · {c.ans2}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s7.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s13 — FINAL 3 misol + FactCard
const LgScreen13 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s13;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2, 3])), []);
  const audio = useAudio([
    brgSeg('s13', lang),
    { id: 's13_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[Math.min(idx, items.length - 1)];
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const numTriedRef = useRef(false);
  const done = idx >= items.length;
  const PASS = Math.ceil(items.length * 0.7);
  useEffect(() => {
    if (done || audio.muted || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const pick = (i) => {
    if (!canAct || picked !== null || done || wrongSet.has(i)) return;
    const isOk = orders[idx][i] === 0;
    if (isOk) {
      setPicked(i); sfx.playCorrect();
      if (wrongSet.size === 0) setScore((s) => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => { setPicked(null); setWrongSet(new Set()); setHintMsg(null); setIdx((n) => n + 1); }, 1500);
    } else {
      const nw = new Set(wrongSet); nw.add(i); setWrongSet(nw);
      const hint = it[`wrong_${orders[idx][i]}`] || it.wrong_1 || c.audio.on_wrong;
      setHintMsg(hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(hint[lang]); }
    }
  };
  const checkNum = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1700);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      const finalScore = score;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.fact_audio[lang]); }
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.intro_line),
        correctAnswer: String(items.length), studentAnswer: finalScore, correct: finalScore >= PASS,
        firstTry: finalScore >= PASS, attempts: 1, solved: finalScore >= PASS
      });
    }
  }, [idx]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.intro_line)}</p>
        {!done && it && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
            <FrameFx/>
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${idx + 1} из ${items.length}` : `${idx + 1}-topshiriq, jami ${items.length}`}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <LgNumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={String(it.ans).length} state={numState}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </div>
                {hintMsg && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2.1vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                      {t(it[`opt${k}`])}
                    </button>
                  ))}
                </div>
                {hintMsg && (
                  <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>
                )}
              </>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success reveal-soft" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><FactFig/></div>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s14 — YAKUN
const LgScreen14 = (props) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, S14_PAYOFF, brgSeg, Scene, FactFig } = useLessonData();
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const audio = useAudio([
    { id: 's14_pay', text: S14_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's14_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.2vw, 14px)', position: 'relative' }}>
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.1 + i * 0.18}s`, display: 'inline-flex' }}>
              <svg viewBox="0 0 40 40" style={{ width: 'clamp(26px, 6vw, 34px)', height: 'auto', animation: `g1twinkle ${1.8 + i * 0.3}s ease-in-out ${0.7 + i * 0.25}s infinite` }} aria-hidden="true">
                <path d="M20 3 L25.2 14.6 L38 16 L28.5 24.6 L31.2 37 L20 30.4 L8.8 37 L11.5 24.6 L2 16 L14.8 14.6 Z" fill="#FFC23C"/>
              </svg>
            </span>
          ))}
        </div>
        <Confetti/>
        <div className="frame-success fade-up">
          <h2 className="title h-title" style={{ margin: 0, textAlign: 'center' }}>{t(c.mission_done)}</h2>
          <p className="title" style={{ margin: 'clamp(4px, 1vw, 8px) 0 0', fontSize: 'clamp(14px, 2vw, 17px)', color: '#1F7A4D', textAlign: 'center' }}>{t(c.cando)}</p>
        </div>
        <div className="d2-rulecard fade-up delay-1">
          <span className="d2-rulecard-badge mono">{lang === 'ru' ? 'Помни' : 'Yodda tut'}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 'clamp(10px, 2.4vw, 20px)', rowGap: 3 }}>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.ink2 }}>{t(c.conn_label_refs)}: {t(c.conn_refs)}</span>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.conn_label_next)}: {t(c.conn_next)}</span>
        </div>
        <div className="lg3-final-scene fade-up delay-1"><Scene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================

const LessonRoot = ({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) => {
  const { CONTENT, TOTAL_SCREENS, SCREEN_META, LESSON_META, STYLES } = useLessonData();
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
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && SCREEN_META[i]?.scored && a.correct).length;
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

  const screens = [LgScreen0, LgScreen1, LgScreen2, LgScreen3, LgScreen4, LgScreen5, LgScreen6, LgScreen7, LgScreen8, LgScreen9, LgScreen10, LgScreen11, LgScreen12, LgScreen13, LgScreen14];
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
        <D2Defs/>
        <D2Motes/>
        <StageHero mood={heroMood}/>
        {/* v8: «UCHISHGA TAYYORLIK» shkalasi — INFRA/Stage'дан TASHQARIDA (lesson-root darajasi) */}
        <ReadinessMeter screen={current} total={TOTAL_SCREENS} lang={lang}/>
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
};

// Собирает компонент урока из его данных. brgSeg (реплика-мост перед экраном) строится здесь,
// чтобы урок не повторял эту строчку у себя.
const createLesson = (data) => {
  const value = { ...data, brgSeg: makeBrgSeg(data.BRIDGES) };
  const Lesson = (props) => (
    <LessonDataContext.Provider value={value}>
      <LessonRoot {...props}/>
    </LessonDataContext.Provider>
  );
  Lesson.displayName = (data.LESSON_META && data.LESSON_META.lessonId) || 'Lesson';
  return Lesson;
};

export {
  T,
  ttsConfig,
  configureLesson,
  FREE_NAV,
  LANG_TAG,
  END_TAG,
  TAG_RE,
  stripAudioTags,
  buildTtsUrl,
  useSfx,
  _chimeCtx,
  playChime,
  LangContext,
  useLang,
  ProgressContext,
  useT,
  useIsMobile,
  MOBILE_DESIGN_W,
  useMobileZoom,
  AudioEngine,
  audioEngineInstance,
  getAudioEngine,
  useAudio,
  makeAudioSegments,
  makeAutoSegments,
  useCanAnswer,
  useAdvanceGate,
  Op,
  Frac,
  FRAC_RE,
  mt,
  AudioIndicator,
  autoScrollTo,
  useRevealScroll,
  FeedbackBlock,
  Slider,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  QuestionScreen,
  shuffleMC,
  shuffleArr,
  READY_LABEL,
  usePrefersReducedMotion,
  useCountOnce,
  GradientDefs,
  ICON,
  KIND_ORDER,
  ObjSvg,
  Obj,
  Pips,
  PRAISE,
  ENCOURAGE,
  _encIdx,
  nextEncourage,
  _praiseIdx,
  nextPraise,
  BitSVG,
  HeroContext,
  useHero,
  StageHero,
  Confetti,
  Reaction,
  AnsPop,
  SPARKS,
  SparkBurst,
  Bridge,
  InfoNote,
  QTitle,
  BigNum,
  D2Defs,
  D2Motes,
  Chiroq,
  Lenta,
  Panel,
  PlaceViz,
  PLAT_Y,
  FAR_TOWN,
  TOWN,
  LAMPS,
  houseWindows,
  Cloud,
  AlienBloom,
  AlienShroom,
  AlienLantern,
  AlienCrystal,
  SPORES,
  farWindows,
  Lamp,
  LandingPod,
  FloatCrystal,
  FlyCreature,
  FLORA,
  CRYSTALS,
  FLOATERS,
  CREATURES,
  GROUND_FLOWERS,
  LumoCityBg,
  AncientHallBg,
  HALL_SLAB,
  createLesson,
  useLessonData,
  RanoSVG,
  AnvarSVG,
  JasurSVG,
  ZuhraSVG,
  LUMO_CAST,
  LUMO_ZONES,
  ReadinessMeter,
  FrameFx,
  npKey,
  useTapSteps,
  CheckStrip,
  TaskTable,
  FoldRow,
  GridFig,
  AngleFig,
  TriangleFig,
  LinePairFig,
  SymFig,
  SolidFig,
  RectFig
};
