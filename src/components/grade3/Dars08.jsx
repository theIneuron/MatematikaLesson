import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ============================================================================
// DD 3-SINF | Dars08 — "Sanoq sistemalari; Rim raqamlari" (num-3-08) | B1 | belgi-devor
// Syujet: Bit sayyorasi LUMO, belgi-devor (SYUJET_3SINF.md B1 d.8, B1 yakuni). Qadimiy
//   belgilar bilan son o'qish/yozish. Bit — mezbon-gid. Darslik: matematika_3_uzb.pdf 88-89-bet.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: I V X L C; kichik belgi o'ngda->qo'shiladi (VI=6), chapda->ayiriladi (IX=9); 3 martadan ko'p yo'q.
// MEXANIKA: recall pozitsion/nopozitsion (s1), belgilar jadvali (s2), qo'shuv (s3), ayiruv (s4),
//   QOIDA (s5), Rim->son MC (s6), son->Rim MC (s7), xatoni top (s8), oy masala (s9),
//   final panel (s10), yakun (s11). RomanBig (belgi vizuali). Audio TTS-toza: harf ovozda emas, tasvirda.
// Misconception: M1 qo'shuv/ayiruv chalkash (IV=6), M2 o'rin muhim deb (XI vs IX), M3 belgi qiymati, M4 IIII.
//
// FREE_NAV=true (blokirovka o'chiq — push oldidan false ga qaytariladi).
// ============================================================

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
const FREE_NAV = true;   // TEST/EDIT — blokirovka o'chiq (erkin navigatsiya). PUSH oldidan false ga qaytaring!

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

  playNext(forced = false) {
    if (this.currentIdx >= this.queue.length) return;
    const seg = this.queue[this.currentIdx];
    // on_event segmenti O'Z hodisasini KUTADI — avtomatik o'tib ketmasin.
    // (Aks holda savol-oldin-qoida buziladi: bola javob bermasdan tushuntirish yangraydi.)
    if (!forced && seg && typeof seg.trigger === 'string' && seg.trigger.indexOf('on_event:') === 0) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      return;
    }
    this.playSegment(seg);
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
      this.playNext(true);
    }
  }

  pushOneOff(text, gender) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: 'manual', waits_for: null, g: gender });
    this.currentIdx = this.queue.length - 1;
    this.playNext(true);
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext(true);
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

// ============================================================
// --- 2-SINF DARS: num_2_01 — O'nliklar va birliklar (Б1, 100 gacha) ---
// 7-8 yosh: ovoz yetakchi kanal, typing YO'Q (tap), concrete-avval (batareya/kasseta ->
// pult-bloklar -> displey kartasi), bar model YO'Q. Manba: 2sinf_metodologiya.md +
// ETALON_2SINF.md + Dars01_CONTENT.md v2 (Yulduz porti). Barcha sonlar 100 ichida (Б1).
// ============================================================

// v5 IXCHAMLASH (18 -> 15): test tomoni ixchamlashdi (tushuntirish s2-s6 + qoida s7 TEGILMADI).
//   sPANEL «Bort testi» = eski s11 + sCMP + sERR (3 ketma-ket sub).
//   sCASE «Yuk xati» = eski s12 (kirish) + s13 (savol) BITTA ekranда.
// v6 FAKT ALOHIDA (bekor): sPANEL sub-1 dagi FactCard SKROLL chiqargani uchun undan olindi.
// v7 FAKT FINAL SLAYDGA (16 -> 15): alohida fakt-slaydi BEKOR; fakt endi FINAL test s14 ga
//   factOnCorrect bilan (bitta savolli slaydда joy bor, skrollsiz — etalon naqsh). sPANEL faktsiz qoladi.
const TOTAL_SCREENS = 12;
const LESSON_META = {
  lessonId: 'num-3-08',
  lessonTitle: { ru: 'Урок 8. Римские цифры', uz: "8-dars. Rim raqamlari" }
};
// STRUKTURA (12 ekran): s0 hook · s1–s4 kashfiyot · s5 qoida · s6–s9 mashq · s10 final · s11 xulosa.
// Syujet: Bit sayyorasi Lumo, belgi-devor (SYUJET_3SINF.md Б1 d.8).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];

// shuffleMC/shuffleArr — grade2 etalon helperlari (MC variant tartibi). Saqlanadi.
// shuffleMC — variantlarni QAT'IY order bo'yicha joylashtiradi va wrong_N/hint_N
// kalitlarni YANGI indekslarga ko'chiradi (wrong_N kontentda ASL indeks bilan yoziladi,
// to'g'ri javob indeksi tashlab ketiladi). order[newIdx] = oldIdx. (grade5 etalon helper.)
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

// Fisher-Yates (brauzerda Math.random — faqat hodisalarda/effektda, render'da emas).
const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };

// Ball + EMOTSIONAL baho: quruq "3 / 3" o'rniga bolaga murojaat.
const scorePraise = (score, total, lang) => {
  const s = `${score} / ${total}`;
  if (score >= total) return lang === 'ru' ? `Великолепно! ${s}. Ни одной ошибки!` : `Ajoyib! ${s}. Bitta ham xato yo'q!`;
  if (score * 2 >= total) return lang === 'ru' ? `Хорошая работа! ${s}. Почти всё с первого раза.` : `Zo'r ish! ${s}. Deyarli hammasi birinchi urinishda.`;
  return lang === 'ru' ? `Вы дошли до конца! ${s}. Главное — вы всё разобрали.` : `Oxirigacha yetdingiz! ${s}. Eng muhimi — hammasini tushunib oldingiz.`;
};

// ============================================================
// CONTENT — 3-sinf Dars08 «Rim raqamlari» (num-3-08). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: Rim belgilari (I V X L C) · belgi-devor. Lumo shahri, Bit sayyorasi.
// ============================================================

const CONTENT = {
  // s0 — HOOK: belgi-devor, IV qaysi son (ayiruv seed)
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: римские цифры', uz: 'Mavzu: Rim raqamlari' },
    lead: { ru: 'На стене Бита числа записаны знаками.', uz: 'Bit devorida sonlar belgilar bilan yozilgan.' },
    roman: 'IV',
    q: { ru: 'Какое это число?', uz: 'Bu qaysi son?' },
    opt0: { ru: '4', uz: '4' },
    opt1: { ru: '6', uz: '6' },
    opt2: { ru: '51', uz: '51' },
    audio: {
      intro: {
        ru: [
          'Тема урока — римские цифры. Научимся читать и записывать числа древними знаками.',
          'В прошлой области заработал счётный терминал. Теперь Бит показывает стену со старыми знаками.',
          'Такими знаками писали в древнем Риме. Вот один знак, за ним ещё один.',
          'Маленький знак стоит слева от большего. Как думаешь, какое это число? Выбери вариант.'
        ],
        uz: [
          "Dars mavzusi — Rim raqamlari. Sonlarni qadimiy belgilar bilan o'qish va yozishni o'rganamiz.",
          "O'tgan hududda hisob terminali ishga tushdi. Endi Bit eski belgili devorni ko'rsatadi.",
          "Bunday belgilar bilan qadimgi Rimda yozishgan. Mana bitta belgi, uning ketidan yana bittasi.",
          "Kichik belgi kattaroq belgidan chapda turibdi. Sizningcha, bu qaysi son? Variantni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Маленький знак слева отнимается: пять минус один это четыре.', uz: "To'g'ri. Kichik belgi chapda ayiriladi: besh ayir bir bu to'rt." },
      on_wrong: { ru: 'Смотри на порядок. Маленький знак слева отнимается, не прибавляется.', uz: "Tartibga qara. Kichik belgi chapda ayiriladi, qo'shilmaydi." }
    }
  },

  // s1 — RECALL/kirish: pozitsion va nopozitsion
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'У наших цифр важно место. У знаков — нет.', uz: "Bizning raqamlarda o'rin muhim. Belgilarda esa yo'q." },
    audio: {
      ru: [
        'Вспомним. В наших числах значение цифры зависит от места. В числе двести двадцать два три одинаковых цифры, но значат разное.',
        'Это позиционная система. А есть и другая, непозиционная.',
        'В непозиционной системе значение знака не зависит от места. Знак десять всегда значит десять, где бы он ни стоял. Римские цифры — как раз такая система.'
      ],
      uz: [
        "Eslaymiz. Bizning sonlarda raqamning qiymati o'rniga bog'liq. Ikki yuz yigirma ikkida uchta bir xil raqam bor, lekin har xil qiymatga ega.",
        "Bu pozitsion sistema. Yana boshqasi ham bor, nopozitsion.",
        "Nopozitsion sistemada belgining qiymati o'rniga bog'liq emas. O'n belgisi qayerda tursa ham doim o'n degani. Rim raqamlari ana shunday sistema."
      ]
    }
  },

  // s2 — RIM BELGILARI jadvali: I V X L C
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Знаки римских цифр.', uz: 'Rim raqamlari belgilari.' },
    symbols: [
      { r: 'I', v: '1' }, { r: 'V', v: '5' }, { r: 'X', v: '10' }, { r: 'L', v: '50' }, { r: 'C', v: '100' }
    ],
    extra: { ru: 'Ещё есть D = 500 и M = 1000.', uz: 'Yana D = 500 va M = 1000 ham bor.' },
    audio: {
      ru: [
        'Выучим главные знаки. Знак один это единица. Знак пять это пятёрка. Знак десять это десяток.',
        'Знак пятьдесят это пять десятков. Знак сто это сотня. Есть ещё знаки пятьсот и тысяча. Из этих знаков собирают любое число.'
      ],
      uz: [
        "Asosiy belgilarni o'rganamiz. Bir belgisi birga teng. Besh belgisi beshga teng. O'n belgisi o'nga teng.",
        "Ellik belgisi besh o'nlikka teng. Yuz belgisi yuzga teng. Yana besh yuz va ming belgilari ham bor. Bu belgilardan har qanday son yig'iladi."
      ]
    }
  },

  // s3 — QO'SHUV qoidasi (kichik o'ngda)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Маленький знак справа — прибавляем.', uz: "Kichik belgi o'ngda — qo'shamiz." },
    examples: [
      { r: 'VI', calc: '5 + 1', v: '6' },
      { r: 'XII', calc: '10 + 1 + 1', v: '12' },
      { r: 'XV', calc: '10 + 5', v: '15' }
    ],
    done_text: { ru: 'Если меньший знак стоит справа от большего, их значения складывают.', uz: "Kichik belgi kattadan o'ngda tursa, ularning qiymatlari qo'shiladi." },
    audio: {
      ru: [
        'Первое правило. Если маленький знак стоит справа от большего, знаки складывают.',
        'Пятёрка и единица справа это шесть. Десяток и две единицы это двенадцать.',
        'Десяток и пятёрка справа это пятнадцать. Справа — значит прибавляем.'
      ],
      uz: [
        "Birinchi qoida. Agar kichik belgi kattadan o'ngda tursa, belgilar qo'shiladi.",
        "Beshlik va o'ngdagi birlik bu olti. O'nlik va ikkita birlik bu o'n ikki.",
        "O'nlik va o'ngdagi beshlik bu o'n besh. O'ngda bo'lsa, demak qo'shamiz."
      ]
    }
  },

  // s4 — AYIRUV qoidasi (kichik chapda) + 3 martadan ko'p yo'q
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Маленький знак слева — отнимаем.', uz: "Kichik belgi chapda — ayiramiz." },
    examples: [
      { r: 'IV', calc: '5 − 1', v: '4' },
      { r: 'IX', calc: '10 − 1', v: '9' },
      { r: 'XL', calc: '50 − 10', v: '40' },
      { r: 'XC', calc: '100 − 10', v: '90' }
    ],
    note_bad: 'IIII', note_good: 'IV',
    done_text: { ru: 'Если меньший знак слева от большего — отнимаем. И один знак не пишут больше трёх раз подряд.', uz: "Kichik belgi kattadan chapda bo'lsa — ayiramiz. Va bitta belgi uch martadan ko'p ketma-ket yozilmaydi." },
    audio: {
      ru: [
        'Второе правило. Если маленький знак стоит слева от большего, его значение отнимают.',
        'Единица слева от пятёрки это четыре. Единица слева от десятка это девять.',
        'Десяток слева от пятидесяти это сорок. Десяток слева от сотни это девяносто.',
        'И запомни ещё. Один и тот же знак не пишут больше трёх раз подряд. Поэтому четыре пишут не четырьмя единицами, а как пять без одного.'
      ],
      uz: [
        "Ikkinchi qoida. Agar kichik belgi kattadan chapda tursa, uning qiymati ayiriladi.",
        "Beshlikning chapidagi birlik bu to'rt. O'nlikning chapidagi birlik bu to'qqiz.",
        "Ellikning chapidagi o'nlik bu qirq. Yuzning chapidagi o'nlik bu to'qson.",
        "Va yana yodda tuting. Bitta belgi uch martadan ko'p ketma-ket yozilmaydi. Shuning uchun to'rtni to'rtta birlik bilan emas, beshdan bitta kam qilib yozamiz."
      ]
    }
  },

  // s5 — QOIDA
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Меньший знак справа от большего — прибавляем, слева — отнимаем. Один знак не повторяют больше трёх раз подряд.', uz: "Kichik belgi kattadan o'ngda — qo'shamiz, chapda — ayiramiz. Bitta belgi uch martadan ko'p takrorlanmaydi." },
    check_roman: 'IX',
    check_q: { ru: 'Какое число записано знаками IX? Нажми верный ответ.', uz: 'IX belgilari qaysi sonni yozadi? To\'g\'ri javobni bosing.' },
    check_opts: ['9', '11'],
    check_ci: 0,
    check_ok: { ru: 'Верно! Единица слева от десятка отнимается: десять минус один это девять.', uz: "To'g'ri! O'nlikning chapidagi birlik ayiriladi: o'n ayir bir bu to'qqiz." },
    check_no: { ru: 'Маленький знак слева отнимается: десять минус один это девять.', uz: "Kichik belgi chapda ayiriladi: o'n ayir bir bu to'qqiz." },
    audio: {
      ru: [
        'Отлично, теперь запомним правило римских цифр.',
        'Если меньший знак стоит справа от большего, их значения складывают.',
        'Если меньший знак стоит слева, его значение отнимают от большего.',
        'И один и тот же знак не пишут больше трёх раз подряд.'
      ],
      uz: [
        "Zo'r, endi Rim raqamlari qoidasini eslab qolamiz.",
        "Agar kichik belgi kattadan o'ngda tursa, ularning qiymatlari qo'shiladi.",
        "Agar kichik belgi chapda tursa, uning qiymati kattadan ayiriladi.",
        "Va bitta belgi uch martadan ko'p yozilmaydi."
      ]
    }
  },

  // s6 — MASHQ Rim -> son (MC), 3 raund
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какое это число?', uz: 'Bu qaysi son?' },
    items: [
      {
        roman: 'XIV', ci: 0,
        opts: [{ ru: '14', uz: '14' }, { ru: '16', uz: '16' }, { ru: '6', uz: '6' }],
        hints: {
          1: { ru: 'После десятка идёт четыре, а не шесть: единица слева от пятёрки. Это 14.', uz: "O'nlikdan keyin to'rt keladi, olti emas: birlik beshning chapida. Bu 14." },
          2: { ru: 'Не забудь десяток впереди. Десять и четыре это 14.', uz: "Oldidagi o'nlikni unutma. O'n va to'rt bu 14." }
        }
      },
      {
        roman: 'XL', ci: 0,
        opts: [{ ru: '40', uz: '40' }, { ru: '60', uz: '60' }, { ru: '10', uz: '10' }],
        hints: {
          1: { ru: 'Десяток слева от пятидесяти отнимается: пятьдесят минус десять это 40.', uz: "Ellikning chapidagi o'nlik ayiriladi: ellik ayir o'n bu 40." },
          2: { ru: 'Здесь два знака: десяток и пятьдесят. Это 40.', uz: "Bu yerda ikki belgi: o'nlik va ellik. Bu 40." }
        }
      },
      {
        roman: 'XXVII', ci: 0,
        opts: [{ ru: '27', uz: '27' }, { ru: '22', uz: '22' }, { ru: '32', uz: '32' }],
        hints: {
          1: { ru: 'Два десятка, пятёрка и две единицы: двадцать семь.', uz: "Ikki o'nlik, beshlik va ikki birlik: yigirma yetti." },
          2: { ru: 'Десятков ровно два, не три: это 27.', uz: "O'nlik roppa-rosa ikkita, uch emas: bu 27." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Читай числа, записанные римскими знаками. Три задания.', uz: "Rim belgilari bilan yozilgan sonlarni o'qi. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри, где меньший знак: слева отнимаем, справа прибавляем.', uz: "Kichik belgi qayerda ekaniga qara: chapda ayiramiz, o'ngda qo'shamiz." }
    }
  },

  // s7 — MASHQ son -> Rim (MC), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Как записать это число римскими цифрами?', uz: 'Bu sonni Rim raqamlarida qanday yozamiz?' },
    items: [
      {
        num: 8, ci: 0,
        opts: [{ ru: 'VIII', uz: 'VIII' }, { ru: 'IIX', uz: 'IIX' }, { ru: 'IX', uz: 'IX' }],
        hints: {
          1: { ru: 'Отнимают только один знак слева. Восемь это пять и три единицы: VIII.', uz: "Chapda faqat bitta belgi ayiriladi. Sakkiz bu besh va uch birlik: VIII." },
          2: { ru: 'Это девять, а не восемь. Восемь пишут VIII.', uz: "Bu to'qqiz, sakkiz emas. Sakkizni VIII deb yozamiz." }
        }
      },
      {
        num: 9, ci: 0,
        opts: [{ ru: 'IX', uz: 'IX' }, { ru: 'VIIII', uz: 'VIIII' }, { ru: 'XI', uz: 'XI' }],
        hints: {
          1: { ru: 'Один знак нельзя писать больше трёх раз. Девять это десять без одного: IX.', uz: "Bitta belgi uch martadan ko'p yozilmaydi. To'qqiz bu o'ndan bitta kam: IX." },
          2: { ru: 'Это одиннадцать. Девять пишут IX, единица слева.', uz: "Bu o'n bir. To'qqizni IX deb yozamiz, birlik chapda." }
        }
      },
      {
        num: 40, ci: 0,
        opts: [{ ru: 'XL', uz: 'XL' }, { ru: 'XXXX', uz: 'XXXX' }, { ru: 'LX', uz: 'LX' }],
        hints: {
          1: { ru: 'Четыре десятка нельзя писать четырьмя знаками. Сорок это XL.', uz: "To'rt o'nlikni to'rtta belgi bilan yozib bo'lmaydi. Qirq bu XL." },
          2: { ru: 'Это шестьдесят. Сорок пишут XL, десяток слева.', uz: "Bu oltmish. Qirqni XL deb yozamiz, o'nlik chapda." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Выбери верную запись числа римскими знаками. Три задания.', uz: "Sonning Rim belgilaridagi to'g'ri yozuvini tanla. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Помни: один знак не больше трёх раз, четыре и девять пишут через вычитание.', uz: "Yodda tut: bitta belgi uch martadan ko'p emas, to'rt va to'qqiz ayirish orqali yoziladi." }
    }
  },

  // s8 — MASHQ xatoni top (Rim juftlari), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверную запись.', uz: "Noto'g'ri yozuvni toping." },
    items: [
      {
        stmts: ['VI = 6', 'IX = 11', 'XX = 20'],
        wrong: 1,
        hint: { ru: 'В записи с единицей слева от десятка отнимаем: это 9, а не 11.', uz: "Birlik o'nlikning chapida bo'lsa ayiramiz: bu 9, 11 emas." }
      },
      {
        stmts: ['XV = 15', 'IV = 6', 'XXX = 30'],
        wrong: 1,
        hint: { ru: 'Единица слева от пятёрки отнимается: это 4, а не 6.', uz: "Beshlikning chapidagi birlik ayiriladi: bu 4, 6 emas." }
      },
      {
        stmts: ['XC = 90', 'VII = 7', 'XL = 60'],
        wrong: 2,
        hint: { ru: 'Десяток слева от пятидесяти отнимается: это 40, а не 60.', uz: "Ellikning chapidagi o'nlik ayiriladi: bu 40, 60 emas." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три записи. Одна неверная. Найди неверную запись.', uz: "Uchta yozuv beraman. Bittasi noto'g'ri. Noto'g'ri yozuvni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь порядок знаков: слева отнимаем, справа прибавляем.', uz: "Belgilar tartibini tekshir: chapda ayiramiz, o'ngda qo'shamiz." }
    }
  },

  // s9 — MASALA (case): oy nomi (Bit devor belgisi)
  s9: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'На стене Бит показал месяц числом VIII.', uz: 'Bit devorda oyni VIII soni bilan ko\'rsatdi.' },
    roman: 'VIII', ci: 0,
    q: { ru: 'Какой это месяц по счёту?', uz: 'Bu nechanchi oy?' },
    opts: [{ ru: '8', uz: '8' }, { ru: '6', uz: '6' }, { ru: '3', uz: '3' }],
    hints: {
      1: { ru: 'Пятёрка и три единицы справа это восемь, а не шесть.', uz: "Beshlik va o'ngdagi uch birlik bu sakkiz, olti emas." },
      2: { ru: 'Не забудь пятёрку впереди: пять и три это восемь.', uz: "Oldidagi beshlikni unutma: besh va uch bu sakkiz." }
    },
    setup_audio: { ru: 'Год делят на месяцы, и каждый месяц можно записать римским числом по порядку. Бит показал на стене знаки: пятёрка и три единицы.', uz: "Yil oylarga bo'linadi, va har oyni tartib bo'yicha Rim soni bilan yozish mumkin. Bit devorda belgilarni ko'rsatdi: beshlik va uch birlik." },
    audio: {
      intro: { ru: 'Прочитай, какой это месяц по счёту. Выбери верный ответ.', uz: "Bu nechanchi oy ekanini o'qi. To'g'ri javobni tanla." },
      on_correct: { ru: 'Верно. Пять и три это восемь — восьмой месяц.', uz: "To'g'ri. Besh va uch bu sakkiz — sakkizinchi oy." },
      on_wrong: { ru: 'Считай знаки: пятёрка и три единицы это восемь.', uz: "Belgilarni sana: beshlik va uch birlik bu sakkiz." }
    }
  },

  // s10 — FINAL panel (5 savol, hammasi MC) + FactCard
  s10: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'mc',
        q: { ru: 'Какое число записано знаками XIII?', uz: 'XIII belgilari qaysi sonni yozadi?' },
        opt0: { ru: '13', uz: '13' },
        opt1: { ru: '15', uz: '15' },
        opt2: { ru: '8', uz: '8' },
        wrong_1: { ru: 'Десяток и три единицы это тринадцать.', uz: "O'nlik va uch birlik bu o'n uch." },
        wrong_2: { ru: 'Впереди десяток, потом три единицы: тринадцать.', uz: "Oldida o'nlik, keyin uch birlik: o'n uch." }
      },
      {
        kind: 'mc',
        q: { ru: 'Как записать 12 римскими цифрами?', uz: '12 ni Rim raqamlarida qanday yozamiz?' },
        opt0: { ru: 'XII', uz: 'XII' },
        opt1: { ru: 'IIX', uz: 'IIX' },
        opt2: { ru: 'XXII', uz: 'XXII' },
        wrong_1: { ru: 'Слева отнимают только один знак. Двенадцать это XII.', uz: "Chapda faqat bitta belgi ayiriladi. O'n ikki bu XII." },
        wrong_2: { ru: 'Это двадцать два. Двенадцать это XII.', uz: "Bu yigirma ikki. O'n ikki bu XII." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число записано знаками IX?', uz: 'IX belgilari qaysi sonni yozadi?' },
        opt0: { ru: '9', uz: '9' },
        opt1: { ru: '11', uz: '11' },
        opt2: { ru: '6', uz: '6' },
        wrong_1: { ru: 'Единица слева отнимается: десять минус один это девять.', uz: "Chapdagi birlik ayiriladi: o'n ayir bir bu to'qqiz." },
        wrong_2: { ru: 'Это не шесть. Единица слева от десятка это девять.', uz: "Bu olti emas. O'nlikning chapidagi birlik bu to'qqiz." }
      },
      {
        kind: 'mc',
        q: { ru: 'Как записать 90 римскими цифрами?', uz: '90 ni Rim raqamlarida qanday yozamiz?' },
        opt0: { ru: 'XC', uz: 'XC' },
        opt1: { ru: 'CX', uz: 'CX' },
        opt2: { ru: 'LXL', uz: 'LXL' },
        wrong_1: { ru: 'Это сто десять. Девяносто это десяток слева от сотни: XC.', uz: "Bu bir yuz o'n. To'qson bu yuzning chapidagi o'nlik: XC." },
        wrong_2: { ru: 'Так знаки не пишут. Девяносто это XC.', uz: "Belgilar bunday yozilmaydi. To'qson bu XC." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число записано знаками XXIV?', uz: 'XXIV belgilari qaysi sonni yozadi?' },
        opt0: { ru: '24', uz: '24' },
        opt1: { ru: '26', uz: '26' },
        opt2: { ru: '16', uz: '16' },
        wrong_1: { ru: 'Два десятка и четыре: двадцать четыре, а не двадцать шесть.', uz: "Ikki o'nlik va to'rt: yigirma to'rt, yigirma olti emas." },
        wrong_2: { ru: 'Десятков два, не один: двадцать четыре.', uz: "O'nlik ikkita, bitta emas: yigirma to'rt." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Самая близкая к нам звезда после Солнца — Проксима Центавра — тоже красный карлик. До неё свет летит больше четырёх лет.', uz: "Quyoshdan keyin bizga eng yaqin yulduz — Proksima Sentavri — ham qizil mitti. Uning nuri bizgacha to'rt yildan ko'proq uchadi." },
    fact_audio: { ru: 'Самая близкая к нам звезда после Солнца — Проксима Центавра — тоже красный карлик. До неё свет летит больше четырёх лет.', uz: "Quyoshdan keyin bizga eng yaqin yulduz — Proksima Sentavri — ham qizil mitti. Uning nuri bizgacha to'rt yildan ko'proq uchadi." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает записи, отвечай на каждую.', uz: "Yakuniy tekshiruv. Shahar kompyuteri yozuvlar ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — YAKUN (Б1 hudud yakuni)
  s11: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Стена знаков прочитана — город Бита открыт!', uz: 'Belgili devor o\'qildi — Bit shahri ochildi!' },
    cando: { ru: 'Теперь ты читаешь и записываешь числа римскими цифрами.', uz: "Endi siz sonlarni Rim raqamlarida o'qiysiz va yozasiz." },
    rule_recap: { ru: 'Меньший знак справа — прибавляем, слева — отнимаем. Один знак не больше трёх раз подряд.', uz: "Kichik belgi o'ngda — qo'shamiz, chapda — ayiramiz. Bitta belgi uch martadan ko'p emas." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'чтение и запись чисел', uz: "sonlarni o'qish va yozish" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'новая область — Сады света: таблица умножения', uz: "yangi hudud — Nur bog'lari: ko'paytirish jadvali" },
    audio: {
      ru: 'Стена знаков прочитана, и город Бита полностью открыт. Мы научились читать и записывать числа римскими цифрами. Запомни. Меньший знак справа от большего прибавляем, а слева отнимаем. И один и тот же знак не пишут больше трёх раз подряд. Дальше нас ждёт новая область — Сады света, где мы вспомним таблицу умножения.',
      uz: "Belgili devor o'qildi, va Bit shahri to'liq ochildi. Biz sonlarni Rim raqamlarida o'qish va yozishni o'rgandik. Yodda tuting. Kichik belgi kattadan o'ngda bo'lsa qo'shamiz, chapda bo'lsa ayiramiz. Va bitta belgi uch martadan ko'p yozilmaydi. Endi bizni yangi hudud kutmoqda — Nur bog'lari, u yerda ko'paytirish jadvalini eslaymiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним про место цифры.', uz: 'Raqam o\'rni haqida eslaymiz.' },
  s2:  { ru: 'Выучим знаки.', uz: 'Belgilarni o\'rganamiz.' },
  s3:  { ru: 'Первое правило — сложение.', uz: 'Birinchi qoida — qo\'shish.' },
  s4:  { ru: 'Второе правило — вычитание.', uz: 'Ikkinchi qoida — ayirish.' },
  s5:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s6:  { ru: 'Правило знаем. Читай сам.', uz: "Qoidani bilamiz. O'zingiz o'qing." },
  s7:  { ru: 'Теперь записывай сам.', uz: 'Endi o\'zingiz yozing.' },
  s8:  { ru: 'Проверим записи на ошибку.', uz: 'Yozuvlarni xatoga tekshiramiz.' },
  s9:  { ru: 'Бит показал месяц на стене.', uz: 'Bit devorda oyni ko\'rsatdi.' },
  s10: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s11: { ru: 'Город открыт. Идём дальше!', uz: 'Shahar ochildi. Davom etamiz!' }
};

// s11 payoff (xulosadan oldin aytiladi)
const S11_PAYOFF = {
  ru: 'Миссия выполнена! Мы разгадали древние знаки на стене, и весь город Бита теперь открыт. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz devordagi qadimiy belgilarni yechdik, va Bitning butun shahri endi ochiq. Yordamingiz uchun rahmat!"
};

// Lumo yo'l-xaritasi yozuvi (lang-lookup)
const READY_LABEL = { ru: 'Планета Лумо', uz: "Lumo sayyorasi" };

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
// AnsPop — to'g'ri javob raqami savol vizualining o'zida paydo bo'ladi ("= N", pop).
// Barcha test-figuralar shu orqali javobni ko'rsatadi (bola javobni rasmda ham ko'radi).
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


// ============================================================
// LUMO VIZUALIZATORLAR — «BIT SHAHRI» (yuzlik/o'nlik/birlik):
// chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik).
// Qizil mitti yulduz osmoni, chiroqli minoralar. Razryad-mat (3 ustun).
// ============================================================

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg/withBridgeAudio orqali).
const Bridge = () => null;
const brgSeg = (key, lang) => ({ id: `${key}_brg`, text: BRIDGES[key][lang], trigger: 'on_mount', waits_for: null });
const withBridgeAudio = (c, key) => {
  const b = BRIDGES[key];
  if (!b || !c.audio || !c.audio.intro) return c;
  return { ...c, audio: { ...c.audio, intro: { ru: `${b.ru} ${c.audio.intro.ru}`, uz: `${b.uz} ${c.audio.intro.uz}` } } };
};

// FOYDALI ma'lumot/qoida kartasi (tushuntirish slaydlarida)
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

// Lumo gradient-defs (root <D2Defs/> shu nomni chaqiradi).
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

// Ambient yorug'lik zarralari (root <D2Motes/>).
const D2Motes = () => (
  <div className="lm-motes" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => <i key={i} className="lm-mote" style={{ animationDelay: `${i * 1.6}s` }}/>)}
  </div>
);

// --- BIRLIK: bitta chiroq (yorug' nuqta).
const Chiroq = ({ className = '' }) => (
  <svg className={`lm-chiroq ${className}`} viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7.2" fill="#FF9A2E" opacity="0.42"/>
    <circle cx="8" cy="8" r="4.6" fill="url(#lmGlow)"/>
    <circle cx="6.4" cy="6.4" r="1.6" fill="rgba(255,255,255,0.9)"/>
  </svg>
);

// --- O'NLIK: lenta = 10 chiroqli tasma.
const Lenta = ({ className = '' }) => (
  <svg className={`lm-lenta ${className}`} viewBox="0 0 92 20" aria-hidden="true">
    <rect x="1" y="2" width="90" height="16" rx="6" fill="#1B2A4A" stroke="#3A4E78" strokeWidth="1"/>
    {Array.from({ length: 10 }).map((_, i) => (
      <circle key={i} cx={9.5 + i * 8.1} cy="10" r="3" fill="url(#lmGlow)"/>
    ))}
  </svg>
);

// --- YUZLIK: panel = 10x10 chiroqli katak (10 lenta).
const Panel = ({ className = '' }) => (
  <svg className={`lm-panel ${className}`} viewBox="0 0 96 96" aria-hidden="true">
    <rect x="1" y="1" width="94" height="94" rx="9" fill="#152342" stroke="#3A4E78" strokeWidth="1.4"/>
    {Array.from({ length: 100 }).map((_, i) => {
      const col = i % 10; const row = Math.floor(i / 10);
      return <circle key={i} cx={9.5 + col * 8.5} cy={9.5 + row * 8.5} r="2.6" fill="url(#lmGlow)"/>;
    })}
  </svg>
);

// --- Razryad-vizual: panel(h) + lenta(t) + chiroq(o) guruhlangan. ans!=null -> AnsPop.
const PlaceViz = ({ hundreds = 0, tens = 0, ones = 0, ans = null, small = false }) => (
  <div className={`lm-pv ${small ? 'lm-pv-sm' : ''}`}>
    {hundreds > 0 && <span className="lm-pv-grp">{Array.from({ length: hundreds }).map((_, i) => <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${i * 0.08}s` }}><Panel/></span>)}</span>}
    {tens > 0 && <span className="lm-pv-grp">{Array.from({ length: tens }).map((_, i) => <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${(hundreds + i) * 0.06}s` }}><Lenta/></span>)}</span>}
    {ones > 0 && <span className="lm-pv-grp lm-pv-ones">{Array.from({ length: ones }).map((_, i) => <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${(hundreds + tens + i) * 0.05}s` }}><Chiroq/></span>)}</span>}
    {hundreds === 0 && tens === 0 && ones === 0 && <span className="lm-pv-empty mono">?</span>}
    {ans != null && <AnsPop n={ans}/>}
  </div>
);

// --- RAZRYAD-MAT (3 ustun: yuzlik/o'nlik/birlik). concrete -> panel/lenta/chiroq; digits -> raqam.
const RazryadTable = ({ h = 0, t = 0, o = 0, labels, emph = null, concrete = false, digits = false, onCell = null, cellSel = null }) => {
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

// --- LUMO SHAHRI FONI: grade1 SceneBg naqshi — yorug' iliq osmon + pol + soya + pastel
// do'stona uylar (yumaloq tom, iliq deraza) + o'simlik. Personajlar polda turadi. (viewBox 400x230)
// Ko'p iliq deraza = «yuzlab chiroq» (razryad motivi). GROUND = 176.
const PLAT_Y = 176;
// Uy [x, kenglik, tepa-Y, tana rangi, tom rangi, tom turi]. Yorug' pastel — do'stona shaharcha.
// Uzoq shahar qatori (xira, tumanli) — «shahar juda katta, chiroqlar yuzlab» (matematik motiv).
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
// Iliq deraza — do'stona uydagi yoruq derazalar (grade1 detali). Yumaloq, iliq amber.
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
// Yumshoq bulut (yorug' kunduz osmoni).
const Cloud = ({ x, y, s }) => (
  <g fill="#FFFFFF" opacity="0.72">
    <ellipse cx={x} cy={y} rx={20 * s} ry={9 * s}/>
    <ellipse cx={x - 15 * s} cy={y + 3 * s} rx={13 * s} ry={7 * s}/>
    <ellipse cx={x + 15 * s} cy={y + 3 * s} rx={13 * s} ry={7 * s}/>
  </g>
);
// === O'ZGA SAYYORA O'SIMLIKLARI (Lumo — nur sochuvchi flora, Yer daraxti EMAS) ===
// Nurli gul — aniq poya + 2 barg + gulbarglar + porlovchi markaz. (Iconik, ko'rinadigan.)
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
// Nurli qo'ziqorin — aniq poya + katta qalpoq + nuqta. (Kattaroq, ko'rinadigan.)
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
// Nurli fonar-o'simlik — egik poya + osilgan porlovchi tomchi-bulb. (Iconik.)
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
// Yerdan chiqqan porlovchi kristall klasteri.
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
// Uzoq bino derazalari — mitti nuqta (uzoqdan yuzlab chiroq).
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
// Chiroq-ustun (shahar chiroqlari — «yuzlab chiroq» motivi).
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
// QO'NGAN KEMA (syujet — do'stlar shu bilan yetib keldi).
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
// Uchar kristall (havoda suzadi — o'zga sayyora).
const FloatCrystal = ({ x, y, s, tint, d = 0 }) => (
  <g className="lm-float" style={{ animationDelay: `${d}s` }}>
    <circle cx={x} cy={y} r={13 * s} fill={tint} opacity="0.16"/>
    <path d={`M${x} ${y - 13 * s} L${x + 8 * s} ${y} L${x} ${y + 13 * s} L${x - 8 * s} ${y} Z`} fill={tint} opacity="0.9"/>
    <path d={`M${x} ${y - 13 * s} L${x + 8 * s} ${y} L${x} ${y} Z`} fill="rgba(255,255,255,0.42)"/>
  </g>
);
// Uchuvchi jonzot (yumshoq nurli qanotli — hayot).
const FlyCreature = ({ x, y, s, tint, d = 0 }) => (
  <g className="lm-fly" style={{ animationDelay: `${d}s` }}>
    <path d={`M${x - 9 * s} ${y} Q${x - 3 * s} ${y - 6 * s} ${x} ${y} Q${x + 3 * s} ${y - 6 * s} ${x + 9 * s} ${y} Q${x + 3 * s} ${y + 3 * s} ${x} ${y + 1 * s} Q${x - 3 * s} ${y + 3 * s} ${x - 9 * s} ${y} Z`} fill={tint} opacity="0.85"/>
    <circle cx={x} cy={y} r={1.6 * s} fill="rgba(255,255,255,0.85)"/>
  </g>
);
// Chet zonalarga (markaz — personajlar), kattaroq va aniq.
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

// --- EKIPAJ (do'stlar, yuzli canon SVG — grade1 merosi). Ra'no/Anvar/Zuhra/Jasur.
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

// --- HOOK SAHNASI: Lumo shahri + butun ekipaj sayyorada qo'ngan. Bit mezbon MARKAZDA, do'stlar yon-atrofda.
const HookScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- Lumo hudud-progress (root <ReadinessMeter/>). 6 hudud; Dars01 = 1-hudud (Bit shahri).
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

// ============================================================
// EKRANLAR — Dars08 «Rim raqamlari» (sanoq sistemalari)
// ============================================================

// --- Savol-frame fon effekti.
const FrameFx = () => (
  <span className="lm-fx" aria-hidden="true"><i/><i/><i/><i/><i/></span>
);

// --- QADIMGI CHORAK SAHNASI (D08 namuna): nurab ketgan tosh xaroba, o'yilgan qadimiy belgilar
//     (Rim raqami + sayyora runasi), biolyuminessent mox, qizil mitti osmoni. Bit shahrining arxeologik chorak.
const AncientHallBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="h8wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EADAB4"/><stop offset="100%" stopColor="#CDB689"/></linearGradient>
      <linearGradient id="h8col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A8946A"/><stop offset="42%" stopColor="#E8D8B2"/><stop offset="100%" stopColor="#A8946A"/></linearGradient>
      <linearGradient id="h8sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5E4256"/><stop offset="45%" stopColor="#A8705E"/><stop offset="82%" stopColor="#D89A66"/><stop offset="100%" stopColor="#F2C88E"/></linearGradient>
      <linearGradient id="h8floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9B283"/><stop offset="100%" stopColor="#A38A5E"/></linearGradient>
      <linearGradient id="h8slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4D3AC"/><stop offset="100%" stopColor="#C6AE7E"/></linearGradient>
      <radialGradient id="h8sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#EE9A5A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <radialGradient id="h8moss" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#BFF0C8"/><stop offset="100%" stopColor="#7FD0A0" stopOpacity="0"/></radialGradient>
      <clipPath id="h8arch"><path d="M124 96 L124 70 Q124 40 200 40 Q276 40 276 70 L276 96 Z"/></clipPath>
    </defs>
    {/* --- DEVOR + shift lintel (interyer) --- */}
    <rect x="0" y="0" width="400" height="180" fill="url(#h8wall)"/>
    <rect x="0" y="0" width="400" height="20" fill="#C2AC7E"/><rect x="0" y="19" width="400" height="3" fill="#9A855C"/>
    <g fill="#B09A6E">{[40, 96, 152, 248, 304, 360].map((x, i) => <rect key={i} x={x} y="6" width="30" height="8" rx="1.5"/>)}</g>
    {/* osma moss-fonar (3) */}
    {[104, 200, 296].map((cx, i) => (
      <g key={i}>
        <line x1={cx} y1="20" x2={cx} y2="30" stroke="#8A7550" strokeWidth="1.6"/>
        <path d={`M${cx - 6} 30 h12 l-2 9 h-8 Z`} fill="#B7A176" stroke="#8A7550" strokeWidth="0.8"/>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="35" r="4.2" fill="#BFF0C8"/>
        <ellipse cx={cx} cy="34" rx="11" ry="16" fill="url(#h8moss)" opacity="0.5"/>
      </g>
    ))}
    {/* --- ORTDA: RAVOQ -> vayrona mahalla (chuqurlik) --- */}
    <g clipPath="url(#h8arch)">
      <rect x="120" y="38" width="160" height="60" fill="url(#h8sky)"/>
      <g><circle cx="150" cy="60" r="7" fill="#C79AD6"/><ellipse cx="150" cy="60" rx="12" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.3" opacity="0.8"/></g>
      <circle cx="250" cy="88" r="15" fill="url(#h8sun)"/><circle cx="250" cy="88" r="7" fill="#FFD89A"/>
      {/* uzoq vayrona siluet */}
      <g opacity="0.6" fill="#9A6E68"><path d="M132 96 v-16 q6 -8 12 0 v16 Z"/><rect x="160" y="82" width="12" height="14"/><path d="M182 96 v-20 l7 -6 l7 6 v20 Z"/><rect x="214" y="84" width="10" height="12"/></g>
      <g fill="#FFE39A" opacity="0.8"><circle cx="138" cy="88" r="1"/><circle cx="187" cy="86" r="1"/></g>
    </g>
    {/* ravoq toshi (voussoir) */}
    <path d="M116 96 L116 70 Q116 32 200 32 Q284 32 284 70 L284 96 L276 96 L276 70 Q276 40 200 40 Q124 40 124 70 L124 96 Z" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1.2"/>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.7"><path d="M150 43 l-4 -7"/><path d="M200 36 v-8"/><path d="M250 43 l4 -7"/></g>
    {/* --- RAMKA USTUNLARI (old plan, chuqurlik) --- */}
    {[28, 334].map((x, i) => (
      <g key={i}>
        <rect x={x - 6} y="24" width="54" height="12" rx="3" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1"/>
        <rect x={x} y="36" width="42" height="140" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1"/>
        <g stroke="#9A855C" strokeWidth="1.2" opacity="0.55">{[10, 21, 32].map((dx, k) => <line key={k} x1={x + dx} y1="40" x2={x + dx} y2="172"/>)}</g>
        <rect x={x - 4} y="168" width="50" height="10" rx="2" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1"/>
        <circle className="lm-glow" cx={x + 21} cy="30" r="3" fill="#BFF0C8"/>
      </g>
    ))}
    {/* o'ng ustunga o'ralgan alien uzumcha */}
    <path d="M356 172 Q346 150 356 130 Q366 110 356 90 Q348 74 356 60" fill="none" stroke="#6FBF8E" strokeWidth="2.4"/>
    <g fill="#8FD8A8">{[[352, 150], [360, 118], [350, 96], [358, 72]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="2.6"/>)}</g>
    {/* --- MARKAZIY STELA: rim <-> zamonaviy (XII = 12) --- */}
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x="116" y="94" width="168" height="66" rx="5" fill="url(#h8slab)" stroke="#8A7550" strokeWidth="2"/>
    <rect x="122" y="100" width="156" height="54" rx="3" fill="none" stroke="#A8946A" strokeWidth="1" opacity="0.7"/>
    <rect x="130" y="103" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="111.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">RIM RAQAMI</text>
    <text x="156" y="142" textAnchor="middle" fontSize="24" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">XII</text>
    <text x="205" y="140" textAnchor="middle" fontSize="20" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">=</text>
    <text x="248" y="142" textAnchor="middle" fontSize="24" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">12</text>
    {/* --- CHAP artefakt: quyosh soati --- */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <ellipse cx="0" cy="4" rx="24" ry="9" fill="url(#h8slab)" stroke="#8A7550" strokeWidth="1.2"/>
      <path d="M0 4 L-2 -6 L2 -6 Z" fill="#8A7550"/>
      <g stroke="#8A7550" strokeWidth="0.8">{[-18, -9, 0, 9, 18].map((dx, k) => <line key={k} x1={dx} y1={4 - Math.abs(dx) * 0.16} x2={dx * 0.8} y2={0 - Math.abs(dx) * 0.14}/>)}</g>
      <text x="0" y="-3" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">XII</text>
    </g>
    {/* --- O'NG artefakt: I V X L C tosh-tabletlari --- */}
    {[['I', 92], ['V', 108], ['X', 124], ['L', 140], ['C', 156]].map(([g, y], i) => (
      <g key={i} transform={`translate(306 ${y})`}>
        <rect x="0" y="0" width="26" height="14" rx="3" fill="url(#h8slab)" stroke="#8A7550" strokeWidth="1"/>
        <text x="13" y="11" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{g}</text>
      </g>
    ))}
    <circle className="lm-glow" cx="300" cy="90" r="2.4" fill="#BFF0C8"/>
    {/* --- POL: mozaik tosh + perspektiva --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#h8floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#8A7550" strokeWidth="2"/>
    <g stroke="#8A7550" strokeWidth="1" opacity="0.4"><path d="M30 230 L178 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M370 230 L222 178"/></g>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g fill="none" stroke="#8A7550" strokeWidth="0.8" opacity="0.3">{[160, 200, 240].map((cx, k) => <path key={k} d={`M${cx} 186 l8 5 l-8 5 l-8 -5 Z`}/>)}</g>
    {/* --- OLD PLAN: yiqilgan ustun bo'lagi (chap) + moss --- */}
    <g transform="translate(58 176)"><rect x="-2" y="-12" width="34" height="11" rx="3" fill="url(#h8col)" stroke="#8A7550" strokeWidth="1" transform="rotate(-6)"/><circle className="lm-glow" cx="0" cy="-8" r="2.6" fill="#BFF0C8"/></g>
    {/* havoda porlovchi sporalar */}
    <g><circle className="lm-glow" cx="96" cy="70" r="1.5" fill="#DFF0C8"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="320" cy="150" r="1.4" fill="#CFEFD8"/></g>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- Rim belgisi (katta).
const RomanBig = ({ r, color }) => (
  <span className="mono" style={{ fontSize: 'clamp(34px, 8.5vw, 54px)', fontWeight: 800, color: color || T.ink, letterSpacing: 'clamp(3px, 1vw, 6px)' }}>{r}</span>
);

// --- KO'P-RAUNDLI MC (heading/renderFig render-props).
const MCRoundD2 = ({ props, ck, heading, renderFig, cols = 2 }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  const items = React.useMemo(() => c.items.map((it) => {
    const order = shuffleArr(it.opts.map((_, i) => i));
    return { ...it, opts: order.map((i) => it.opts[i]), hints: it.hints ? order.map((i) => it.hints[i]) : it.hints, ci: order.indexOf(it.ci) };
  }), []);
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [okIdx, setOkIdx] = useState(null);   // to'g'ri tanlangan variant YASHIL bo'lib turadi
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[idx];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  const pick = (i) => {
    if (!canAct || done || wrongSet.has(i)) return;
    if (i === it.ci) {
      setOkIdx(i);
      sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { setOkIdx(null); setWrongSet(new Set()); setHintMsg(null); setIdx((n) => n + 1); }, 1100);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      setHintMsg((it.hints && it.hints[i]) || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(((it.hints && it.hints[i]) || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: ck,
        correctAnswer: String(items.length), studentAnswer: score, correct: firstAllRef.current,
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {!done && it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h1 className="title h-sub fade-up">{heading(it)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${okIdx === i ? 'option-correct' : ''}`} disabled={!canAct || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 21px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={scorePraise(score, items.length, lang)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s0 — HOOK: IV qaysi son
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const ok = picked === 0;
  const revealed = picked !== null;
  const fbKey = (i) => (i === 0 ? 'on_correct' : 'on_wrong');
  const pick = (i) => {
    if (picked !== null || !canAct) return;
    setPicked(i);
    if (!audio.muted) {
      const e = getAudioEngine();
      if (e) {
        e.pushOneOff(c.audio[fbKey(i)][lang]);
        if (i !== 0) e.pushOneOff(c.audio.on_correct[lang]);   // noto'g'ri -> to'g'ri javob emotsiya bilan ochiladi
      }
    }
  };
  const canAdv = useAdvanceGate(picked !== null, audio);
  const navContent = (
    <>
      {props.screen > 0 && <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>}
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const opts = [c.opt0, c.opt1, c.opt2];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={revealed}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(18px, 3.6vw, 30px)', background: '#F0EBE1' }}>
          <RomanBig r={c.roman}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {opts.map((o, i) => {
            const cls = revealed
              ? (i === 0 ? 'option option-correct' : (picked === i ? 'option option-picked-wrong' : 'option'))
              : 'option';
            return (
              <button key={i} className={cls} disabled={!canAct || revealed} onClick={() => pick(i)}
                style={{ position: 'relative', padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(16px, 2.4vw, 22px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {revealed && i === 0 && <span className="mono" style={{ position: 'absolute', top: 4, right: 7, color: '#1F7A4D', fontWeight: 800 }}>✓</span>}
                {t(o)}
              </button>
            );
          })}
        </div>
        {revealed && (
          <FeedbackBlock show={true} isCorrect={ok} wrongClass="frame-tip">
            <Reaction state={ok ? 'correct' : 'wrong'} praise={t(c.audio[fbKey(picked)])}/>
            {!ok && (
              <p className="fade-up" style={{ margin: 'clamp(6px, 1.4vw, 10px) 0 0', textAlign: 'center', color: '#1F7A4D', fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 16px)' }}>
                {(lang === 'ru' ? 'Верный ответ' : "To'g'ri javob")}: <b>{t(c.opt0)}</b>. {t(c.audio.on_correct)}
              </p>
            )}
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s1 — RECALL: pozitsion/nopozitsion
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s1_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s1_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: T.ink, letterSpacing: 4 }}>222</span>
            <span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.ink2, fontWeight: 700 }}>{lang === 'ru' ? 'место важно (позиционная)' : "o'rin muhim (pozitsion)"}</span>
          </div>
          {reached >= 2 && (
            <div className="lm-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <RomanBig r="X X X"/>
              <span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.accent, fontWeight: 700 }}>{lang === 'ru' ? 'знак всегда 10 (непозиционная)' : "belgi doim 10 (nopozitsion)"}</span>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s2 — RIM BELGILARI jadvali
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s2_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s2_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const showExtra = reached >= 1;
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 24px)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px, 2.4vw, 16px)', justifyContent: 'center' }}>
            {c.symbols.map((s, i) => (
              <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 'clamp(50px, 13vw, 70px)', padding: 'clamp(6px, 1.4vw, 10px)', background: T.paper, borderRadius: 12, boxShadow: '0 4px 12px -5px rgba(58, 53, 48, 0.25)' }}>
                <span className="mono" style={{ fontSize: 'clamp(26px, 6vw, 38px)', fontWeight: 800, color: T.accent }}>{s.r}</span>
                <span className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', fontWeight: 800, color: T.ink }}>{s.v}</span>
              </div>
            ))}
          </div>
          {showExtra && <p className="mono lm-reveal" style={{ margin: 0, color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.8vw, 15px)' }}>{t(c.extra)}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3/s4 — QO'SHUV/AYIRUV qoidasi (misollar)
const ExploreRoman = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...c.audio[lang].map((text, i) => ({ id: `${ck}_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  const re = new RegExp(`^${ck}_\\d+$`);
  useEffect(() => { if (seg && re.test(seg)) setReached((r) => Math.max(r, +seg.slice(ck.length + 1))); }, [seg]);
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2.2vw, 16px)', padding: 'clamp(14px, 2.8vw, 22px)' }}>
          {c.examples.map((ex, i) => (
            <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.14}s`, display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 36px)', fontWeight: 800, color: T.accent, letterSpacing: 2, minWidth: 'clamp(56px, 15vw, 84px)', textAlign: 'center' }}>{ex.r}</span>
              <span className="mono" style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: T.ink3, fontWeight: 700 }}>{ex.calc}</span>
              <span className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', color: T.ink3, fontWeight: 800 }}>=</span>
              <span className="mono" style={{ fontSize: 'clamp(20px, 4.4vw, 30px)', fontWeight: 800, color: T.ink }}>{ex.v}</span>
            </div>
          ))}
          {c.note_bad && reached >= (c.audio[lang].length - 1) && (
            <div className="frame-tip lm-reveal" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(8px, 1.6vw, 12px)', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', fontWeight: 800, color: '#C0392B', textDecoration: 'line-through' }}>{c.note_bad}</span>
              <span className="mono" style={{ fontSize: 'clamp(16px, 2.6vw, 20px)', color: T.ink3 }}>→</span>
              <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', fontWeight: 800, color: T.success }}>{c.note_good}</span>
            </div>
          )}
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
const Screen3 = (props) => <ExploreRoman props={props} ck="s3"/>;
const Screen4 = (props) => <ExploreRoman props={props} ck="s4"/>;

// s5 — QOIDA + check
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const sfx = useSfx();
  // SAVOL avval (aksent) -> javob bergach QOIDA + tushuntirish ochiladi.
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_q', text: c.check_q[lang], trigger: 'after_previous', waits_for: null },
    ...c.audio[lang].map((text, i) => ({ id: `s5_${i}`, text, trigger: i === 0 ? 'on_event:answered' : 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const ok = picked === c.check_ci;
  const revealRef = useRevealScroll(ok, 500);
  const pick = (i) => {
    if (!canAct || ok) return;
    setPicked(i);
    if (i === c.check_ci) { sfx.playCorrect(); audio.triggerInternal('answered'); }
  };
  const canAdv = useAdvanceGate(ok, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        {!ok ? (
          <div className="lm-q-accent fade-up">{t(c.check_q)}</div>
        ) : (
          <div className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <p className="d2-rulecard-txt">{t(c.rule)}</p>
          </div>
        )}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <RomanBig r={c.check_roman}/>
          {picked !== null && !ok && <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.check_no)}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            {c.check_opts.map((o, i) => (
              <button key={i} className={`option ${ok && i === c.check_ci ? 'option-correct' : ''} ${picked === i && i !== c.check_ci ? 'option-picked-wrong' : ''}`} disabled={!canAct || ok} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {ok && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.check_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — MASHQ Rim -> son (MC)
const Screen6 = (props) => {
  const t = useT();
  const c = CONTENT.s6;
  const heading = () => t(c.q);
  const renderFig = (it) => <RomanBig r={it.roman}/>;
  return <MCRoundD2 props={props} ck="s6" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s7 — MASHQ son -> Rim (MC)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(36px, 8vw, 54px)', fontWeight: 800, color: T.ink }}>{it.num}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s8 — MASHQ xatoni top
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([
    brgSeg('s8', lang),
    { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [solvedRound, setSolvedRound] = useState(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[idx];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  const pick = (i) => {
    if (!canAct || done || solvedRound || wrongSet.has(i)) return;
    if (i === it.wrong) {
      setSolvedRound(true); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { setSolvedRound(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1300);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'find-error',
        correctAnswer: String(items.length), studentAnswer: score, correct: firstAllRef.current,
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {!done && it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(16px, 3vw, 22px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(it.hint)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={scorePraise(score, items.length, lang)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s9 — MASALA (case): oy nomi
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  const order = React.useMemo(() => shuffleArr([0, 1, 2]), []);
  const opts = order.map((k) => c.opts[k]);
  const ci = order.indexOf(c.ci);
  const hints = order.map((k) => c.hints[k]);
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(props.storedAnswer ? props.storedAnswer.studentAnswerIndex : null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const revealRef = useRevealScroll(solved, 500);
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect();
      if (firstRef.current === null) firstRef.current = wrongSet.size === 0;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((hints[i] || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        studentAnswerIndex: ci, correctAnswer: String(c.opts[c.ci][lang]), studentAnswer: String(c.opts[c.ci][lang]), correct: firstRef.current === null ? true : firstRef.current,
        firstTry: firstRef.current === null ? true : firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const hintMsg = wrongSet.size > 0 ? [...wrongSet].map((i) => hints[i]).filter(Boolean).slice(-1)[0] : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 22px)' }}>
          <FrameFx/>
          <RomanBig r={c.roman}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
            {opts.map((o, i) => (
              <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solved && i === ci ? 'option-correct' : ''}`} disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
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

// s10 — FINAL panel (5 savol, hammasi MC) + FactCard
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[idx];
  const PASS = Math.ceil(items.length * 0.7);
  const pick = (i) => {
    if (!canAct || picked !== null || idx >= items.length) return;
    setPicked(i);
    const isOk = orders[idx][i] === 0;
    if (isOk) setScore((s) => s + 1);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    setTimeout(() => { setPicked(null); setIdx((n) => n + 1); }, 1500);
  };
  useEffect(() => {
    if (idx >= items.length && !recorded) {
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
  const done = idx >= items.length;
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.intro_line)}</p>
        {!done && it && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
            <FrameFx/>
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {orders[idx].map((k, i) => (
                <button key={i} className={`option ${picked === i ? (orders[idx][i] === 0 ? 'option-correct' : 'option-picked-wrong') : ''}`} disabled={!canAct || picked !== null} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 21px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                  {t(it[`opt${k}`])}
                </button>
              ))}
            </div>
            {picked !== null && orders[idx][picked] !== 0 && (
              <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(it[`wrong_${orders[idx][picked]}`] || it.wrong_1)}</p>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef} className="frame-success fade-up">
            <div style={{ marginBottom: 10 }}><Reaction state="correct" praise={scorePraise(score, items.length, lang)}/></div>
            <div className="d2-factcard">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — YAKUN
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const audio = useAudio([
    { id: 's11_pay', text: S11_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's11_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 16px)', position: 'relative' }}>
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
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.ink2 }}>{t(c.conn_label_refs)}: {t(c.conn_refs)}</span>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.conn_label_next)}: {t(c.conn_next)}</span>
        </div>
        <div className="fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function RomanLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11];
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
.g1-drop { animation: g1drop 0.5s ease-out both; }
.g1-twinkle { animation: g1twinkle 2s ease-in-out infinite; }
@keyframes g1bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-7px) rotate(3deg); } }
/* Ambient — masala olami sahnasiga yengil jon. reduced-motion'da o'chadi. */
.g1-amb-cloud { animation: g1drift 9s ease-in-out infinite alternate; }
.g1-amb-cloud2 { animation: g1driftB 12s ease-in-out infinite alternate; }
.g1-amb-sun { transform-box: fill-box; transform-origin: center; animation: g1sunPulse 4.5s ease-in-out infinite; }
.g1-amb-rays { transform-box: fill-box; transform-origin: center; animation: g1sunRays 44s linear infinite; }
.g1-amb-sway { transform-box: fill-box; transform-origin: bottom center; animation: g1sway 4.8s ease-in-out infinite; }
@keyframes g1drift { 0% { transform: translateX(0); } 100% { transform: translateX(24px); } }
@keyframes g1driftB { 0% { transform: translateX(0); } 100% { transform: translateX(-20px); } }
@keyframes g1sunPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.93; } }
@keyframes g1sunRays { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes g1sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@media (prefers-reduced-motion: reduce) { .g1-amb-cloud, .g1-amb-cloud2, .g1-amb-sun, .g1-amb-rays, .g1-amb-sway { animation: none; } }
/* To'g'ri javob nishonlashi — uchqun + yengil sakrash. reduced-motion'da o'chadi. */
.g1-cele-wrap { position: relative; display: inline-flex; animation: g1celePop 0.7s cubic-bezier(0.3, 1.3, 0.5, 1) both; }
@keyframes g1celePop { 0% { transform: scale(1); } 30% { transform: scale(1.14); } 60% { transform: scale(0.97); } 100% { transform: scale(1); } }
.g1-csp { position: absolute; top: 40%; left: 50%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFF4CC, #FFB23C); box-shadow: 0 0 5px rgba(255,190,70,0.85); opacity: 0; pointer-events: none; }
.g1-cele-wrap .g1-csp { animation: g1sparkPop 0.8s ease-out both; }
@keyframes g1sparkPop { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, -24px))) scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-cele-wrap, .g1-cele-wrap .g1-csp { animation: none; } }
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
@keyframes g1tfPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
.g1-tf-pop .g1-tf-dot { animation: g1tfPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
@media (prefers-reduced-motion: reduce) { .g1-tf-pop .g1-tf-dot { animation: none; } }

/* PROPIS — kataklı daftarda raqam yozish (Dars02'dan) + s3 raqam tanlovi */
.g1-kcell { position: relative; aspect-ratio: 64 / 92; padding: 0; overflow: hidden; border: 2.5px solid #BFE0EC; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  background-color: #FBFEFF;
  background-image: linear-gradient(#D7EEF6 1.2px, transparent 1.2px), linear-gradient(90deg, #D7EEF6 1.2px, transparent 1.2px);
  background-size: clamp(15px, 3.6vw, 24px) clamp(15px, 3.6vw, 24px); }
.g1-kcell.active { border-color: #FF4F28; box-shadow: 0 0 0 2px #FFD3C7; }
.g1-kcell-write { flex: 0 0 auto; width: clamp(70px, 13vw, 94px); }
.g1-kcell .g1-write { width: 100%; height: 100%; }
.g1-write { width: clamp(80px, 17vw, 116px); height: auto; }
.g1-write-ghost { fill: none; stroke: #F2DDD3; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
.g1-write-ink { fill: none; stroke: #FF4F28; stroke-width: 8.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 100; }
.g1-digit-pick { display: flex; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.g1-pickbtn { width: clamp(40px, 8vw, 52px); height: clamp(40px, 8vw, 52px); border-radius: 12px; border: 2px solid #E6E1D6; background: #FFFFFF; font-family: 'Fraunces', Georgia, serif; font-size: clamp(18px, 3.4vw, 24px); font-weight: 600; color: #5A5A60; cursor: pointer; transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease, transform 0.15s ease; box-shadow: 0 3px 8px -4px rgba(58, 53, 48, 0.3); }
.g1-pickbtn:hover:not(.active) { transform: translateY(-2px); }
.g1-pickbtn.active { border-color: #FF4F28; color: #FF4F28; background: #FFF3EF; }

/* FingerHand — barmoqlar vizualizatori (s2) */
.g1-fhand { width: clamp(72px, 15vw, 104px); height: auto; }
.g1-hand-group, .g1-handbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-handbtn { border: 2.5px dashed #FFB9A8; border-radius: 16px; background: #FFF6F3; padding: clamp(6px, 1.4vw, 10px); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.g1-handbtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px -8px rgba(255, 79, 40, 0.5); }
.g1-handbtn:disabled { cursor: default; border-style: solid; border-color: #1F7A4D; background: #E3F0E8; }
.g1-hand-cap { font-size: clamp(17px, 3vw, 22px); font-weight: 700; color: #FF4F28; }
.g1-handbtn:disabled .g1-hand-cap { color: #1F7A4D; }

/* Ten-frame drag o'yin (sd): drop zona + nuqta tokenlar */
.g1-tfdrop { padding: clamp(8px, 2vw, 14px); border-radius: 18px; border: 2.5px dashed #BFD9E6; background: #F7FBFD; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-token-dot { width: clamp(20px, 4.4vw, 28px); height: clamp(20px, 4.4vw, 28px); border-radius: 50%; background: #FF4F28; display: block; box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.15); }
/* ten-frame PREDMET rejimi (sd o'yini): kataklar neytral, ichida buyum, tushganda pop */
.g1-tf-cell-obj.on { background: #FFFDF9; border-color: #E0DACE; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell-obj.on { background: #FFFDF9; border-color: #E0DACE; }
.g1-tf-base .g1-tf-cell-obj { border-color: #E0DACE; }
.g1-tf-item { width: 82%; height: 82%; display: flex; align-items: center; justify-content: center; animation: g1tfDrop 0.46s cubic-bezier(0.34, 1.4, 0.64, 1) backwards; }
@keyframes g1tfDrop { 0% { transform: translateY(-75%); opacity: 0; } 65% { transform: translateY(7%); } 100% { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-tf-item { animation: none; } }
/* keyingi to'ldiriladigan katak — pulslab "qayerga qo'yish"ni ko'rsatadi */
.g1-tf-next { border-color: #FF4F28; border-style: dashed; animation: g1tfPulse 1.1s ease-in-out infinite; }
@keyframes g1tfPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255, 79, 40, 0.45); } 60% { box-shadow: 0 0 0 6px rgba(255, 79, 40, 0); } }
.g1-dropzone-wait { border-color: #FF8A6E; background: #FFF4F0; }
.g1-drophint { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: clamp(13px, 1.8vw, 15px); color: #C23B1E; font-weight: 600; }
.g1-drophint-arrow { font-size: clamp(18px, 3vw, 24px); animation: g1hintBounce 1s ease-in-out infinite; }
@keyframes g1hintBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .g1-tf-next, .g1-drophint-arrow { animation: none; } }
/* s8 — raqam plitasini eshikka sudrash */
.g1-plate-drop { padding: clamp(10px, 2.4vw, 16px); border-radius: 18px; border: 2.5px dashed #BFD9E6; background: #F7FBFD; display: flex; justify-content: center; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-plate-house { display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); }
.g1-plate-house .g1-house-svg { width: clamp(88px, 19vw, 124px); }
.g1-token-plate { background: #FCFAF5; border: 2px solid #C9A877; box-shadow: 0 4px 10px -4px rgba(58, 53, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6); min-width: clamp(48px, 10vw, 62px); min-height: clamp(48px, 10vw, 62px); }

/* sGuest (slayd 15) yaqin plan: yangi uy 0 -> 1 (Zuhra ko'chib keladi) */
.g1-newhouse-scene { display: flex; align-items: center; justify-content: center; gap: clamp(16px, 5vw, 48px); flex-wrap: wrap; min-height: clamp(170px, 32vw, 230px); }
.g1-newhouse-house .g1-house-svg { width: clamp(118px, 25vw, 176px); }
.g1-newhouse-side { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 2vw, 14px); }
.g1-zerorow { display: flex; align-items: center; gap: clamp(6px, 1.6vw, 12px); }
.g1-newhouse-zuhra { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g1-newhouse-zuhra .g1-char { width: clamp(58px, 12vw, 86px); height: auto; }
.g1-newhouse-empty { font-size: clamp(13px, 1.8vw, 16px); color: #8A8780; }
.g1-newhouse-num { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g1-newhouse-note { font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; font-weight: 600; }
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
/* Dars02 realizatsiyasi: uy variantlari BIR QATORDAN, gorizontal tasma (uy | predmetlar), chapga */
.g1-opt-house { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: clamp(12px, 3vw, 24px); width: 100%; padding-left: clamp(4px, 2vw, 14px); }
.g1-opt-house .g1-house-svg { width: clamp(56px, 12vw, 78px); flex: none; }
.g1-opt-house .g1-yard { flex: 1 1 auto; justify-content: flex-start; min-width: 0; }
.g1-opt-house .g1-pips { justify-content: flex-start; }

/* s8 / s9 — uy tugmalari */
.g1-houses { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 14px); }
.g1-housebtn { background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 18px; padding: clamp(8px, 1.8vw, 13px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease, opacity 0.2s ease; }
/* s8/s9 uy tugmalari ham bir qatordan, gorizontal tasma (uy | predmetlar), chapga */
.g1-houses .g1-housebtn, .g1-match-houses .g1-housebtn { flex-direction: row; justify-content: flex-start; width: 100%; gap: clamp(12px, 3vw, 22px); }
.g1-houses .g1-housebtn .g1-house-svg, .g1-match-houses .g1-housebtn .g1-house-svg { width: clamp(54px, 12vw, 74px); flex: none; }
.g1-houses .g1-housebtn .g1-yard, .g1-match-houses .g1-housebtn .g1-yard { flex: 1 1 auto; justify-content: flex-start; min-width: 0; }
.g1-houses .g1-pips, .g1-match-houses .g1-pips { justify-content: flex-start; }
.g1-housebtn:hover:not(:disabled) { transform: translateY(-2px); }
.g1-housebtn-ok { border-color: #1F7A4D; background: #EFF7F1; }
.g1-housebtn-faded { opacity: 0.4; }
.g1-housebtn:disabled { cursor: default; }
.g1-housebtn .g1-house-svg { width: clamp(64px, 13.5vw, 92px); }

/* s9 — juftlash tartibi */
.g1-match { display: flex; flex-direction: column; gap: clamp(12px, 2.4vw, 18px); }
.g1-match-digits { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); }
.g1-match-houses { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); }

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
.g1-street-rano { left: 22%; bottom: 4%; }
.g1-street-zuhra { right: 4%; bottom: 0; }
.g1-street-anvar .g1-char, .g1-street-rano .g1-char, .g1-street-zuhra .g1-char { width: 6cqw; height: auto; }
.g1-street .g1-cast-name { display: none; }
.g1-street-final .g1-street-anvar { left: auto; right: 27%; bottom: 0; }
.g1-street-final .g1-street-rano { left: auto; right: 15%; bottom: 4%; }
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


/* ====== Dars07 — qo'shishning ma'nosi: pufakchali savatlar + hovli sahnasi ====== */

/* --- birlashtirish qatori (pufakchali savatlar) --- */
.g1-cg { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 18px); }
.g1-cg-joined { flex-direction: column; gap: clamp(8px, 1.8vw, 14px); }
.g1-cg-op { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #FF4F28; line-height: 1; }
.g1-cg-sent { display: flex; align-items: center; gap: clamp(5px, 1.4vw, 10px); font-weight: 800; font-size: clamp(22px, 4.6vw, 34px); color: #0E0E10; }
.g1-cg-sent .g1-cg-sign { font-style: normal; color: #FF4F28; }
.g1-cg-sent .g1-cg-tot { color: #1F7A4D; }

/* birlashganda pufakcha suzib kiradi */
.d4-mount { animation: d4slidein 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
.d4-mount-r { animation: d4slideinr 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
@keyframes d4slidein { from { opacity: 0; transform: translateX(-30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes d4slideinr { from { opacity: 0; transform: translateX(30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }

/* --- TEPADAN savat (sodda %-o'lcham, container-query YO'Q) --- */
.bt { position: relative; width: clamp(100px, 25vw, 152px); aspect-ratio: 1 / 0.9; }
.bt-rim { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 6px 13px rgba(58,53,48,0.26)); }
.bt-fruit { position: absolute; left: 18%; right: 18%; top: 15%; bottom: 22%; display: flex; flex-wrap: wrap; align-items: center; align-content: center; justify-content: center; gap: 1.5%; }
.bt-f { aspect-ratio: 1 / 1; display: inline-flex; align-items: center; justify-content: center; }
.bt-f svg { width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(58,53,48,0.18)); }

/* --- o'ylov pufakchasi (ichida tepadan savat) --- */
.fb { display: inline-flex; flex-direction: column; align-items: center; }
.fb-body { background: #FFFFFF; border-radius: 50%; box-shadow: 0 6px 18px -6px rgba(58,53,48,0.3); padding: clamp(7px, 1.8vw, 13px); width: clamp(84px, 22vw, 128px); }
.fb-body .bt { width: 100%; }
.fb-dot { background: #FFFFFF; border-radius: 50%; box-shadow: 0 2px 5px -1px rgba(58,53,48,0.25); }
.fb-dot1 { width: 11px; height: 11px; margin-top: 3px; }
.fb-dot2 { width: 7px; height: 7px; margin-top: 2px; }
/* birlashtirish figurasidagi pufakcha o'lchami (skrolsiz) */
.g1-cg .fb-body { width: clamp(78px, 20vw, 116px); }
.g1-cg-joined .fb-body { width: clamp(92px, 24vw, 134px); }

/* --- s5 sudrab-birlashtirish: drop-zona = tepadan savat (punktir -> javobda yashil) + tray --- */
.g1-cg-drop { position: relative; transition: outline 0.2s, background 0.2s; }
.g1-s5-drop { width: clamp(118px, 30vw, 168px); aspect-ratio: 1 / 0.9; display: flex; align-items: center; justify-content: center; padding: 5px; border-radius: 50%; outline: 2px dashed rgba(255,79,40,0.5); outline-offset: 3px; }
.g1-s5-drop .bt { width: 100%; }
.g1-s5-drop.full { outline: 2px solid #1F7A4D; }
.g1-combine-row { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 18px); }
.g1-combine-grouplabel { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-combine-name { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); color: #5A5A60; font-weight: 700; }
.g1-gameopts { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 18px); }
.g1-numopt { display: flex; align-items: center; justify-content: center; min-width: clamp(56px, 14vw, 78px); min-height: clamp(56px, 14vw, 78px);
  background: #FFFFFF; border: none; border-radius: 16px; box-shadow: 0 4px 12px -5px rgba(58,53,48,0.3); cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
.g1-numopt:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 18px -7px rgba(58,53,48,0.4); }
.g1-numopt-wrong { opacity: 0.4; box-shadow: inset 0 0 0 2px #FFCDBF; cursor: default; }
.g1-numopt-ok { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }

/* AnsPop — javob raqami savol vizualida ("= N", yashil, pop). Barcha test-figuralar. */
.g1-anspop { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); margin-left: clamp(4px, 1vw, 8px); }
.g1-anspop-eq { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #5A5A60; line-height: 1; }
.g1-anspop-num { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(44px, 9vw, 66px); line-height: 1; color: #1F7A4D; }

/* --- s6 son-yozuv varianti --- */
.g1-sent { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); font-weight: 800; font-size: clamp(20px, 4vw, 30px); color: #0E0E10; }
.g1-sent .g1-sent-op { font-style: normal; font-weight: 800; }
.g1-sent .g1-sent-plus { color: #FF4F28; }
.g1-sent .g1-sent-minus { color: #5A5A60; }

/* --- s8 fakt kartasi (ko'k) --- */
.g1-factcard { display: flex; flex-direction: column; gap: 6px; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 14px; padding: clamp(9px, 1.8vw, 14px); }
.g1-factcard-badge { font-size: clamp(10px, 1.3vw, 12px); letter-spacing: 0.12em; text-transform: uppercase; color: #0A7FA8; font-weight: 700; }
.g1-factcard-row { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.g1-factcard-plus { flex: 0 0 auto; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #019ACB;
  font-size: clamp(34px, 8vw, 52px); line-height: 1; animation: factPlus 2.4s ease-in-out infinite; }
.g1-factcard-txt { margin: 0; font-size: clamp(13px, 1.8vw, 15px); line-height: 1.38; color: #0E0E10; }
@keyframes factPlus { 0%,100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(90deg) scale(1.12); } }

/* --- hovli sahnasi (CastScene) — 560px cheklangan (skrolsiz) --- */
.g1-yardscene { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 400 / 215; container-type: size; border-radius: 14px; overflow: hidden; }
.g1-yard-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.g1-yard-cast { position: absolute; inset: 0; }
.g1-yc-fig { position: absolute; bottom: 4cqh; display: flex; flex-direction: column; align-items: center; gap: 2px;
  opacity: 0; transform: translateY(8cqh) scale(0.96); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-yc-fig.in { opacity: 1; transform: translateY(0) scale(1); }
.g1-yc-fig .g1-cast-svg { height: 42cqh; width: auto; }
.g1-yc-rano { left: 16cqw; }
.g1-yc-anvar { left: 44cqw; }
.g1-yc-zuhra { right: 14cqw; }
.g1-yc-zuhra.walkin { animation: yardWalkIn 1.6s ease-out both; }
/* Dars13 maktab sahnasi — 4 personaj (Jasur kirib keladi), kattaroq + yengil tebranish (jonli) */
.g1-maktabscene .g1-yc-fig .g1-cast-svg { height: 48cqh; animation: g1castbob 3.2s ease-in-out infinite; }
.g1-maktabscene .g1-cast-name { font-size: clamp(10px, 1.5vw, 13px); }
.g1-yc-mrano { left: 2cqw; }
.g1-yc-mrano .g1-cast-svg { animation-delay: 0s; }
.g1-yc-manvar { left: 25cqw; }
.g1-yc-manvar .g1-cast-svg { animation-delay: 0.5s; }
.g1-yc-mzuhra { left: 49cqw; }
.g1-yc-mzuhra .g1-cast-svg { animation-delay: 1s; }
.g1-yc-jasur { right: 2cqw; }
.g1-yc-jasur .g1-cast-svg { animation-delay: 0.75s; }
.g1-yc-jasur.walkin { animation: yardWalkIn 1.4s cubic-bezier(0.34, 1.2, 0.64, 1) both; }
@keyframes g1castbob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3%); } }
@media (prefers-reduced-motion: reduce) { .g1-maktabscene .g1-yc-fig .g1-cast-svg { animation: none; } }
/* yerda turgan savatlar (Dars04 uslubi) — personaj yonida, oyog'i oldida, dekorativ (bo'sh) */
.g1-yard-basket { position: absolute; bottom: 1cqh; width: 15cqw; z-index: 4; opacity: 0; transition: opacity 0.5s ease; }
.g1-yard-basket.in { opacity: 1; }
.g1-yard-basket .g1-rb-svg { width: 100%; height: auto; filter: drop-shadow(0 4px 8px rgba(58,53,48,0.28)); }
.g1-yard-basket-rano { left: 1cqw; }
.g1-yard-basket-zuhra { right: 1cqw; }
/* o'ylov pufakchasi — personaj boshidan YUQORIDA, yuzni to'smaydi (Ra'no 3, Zuhra 2) */
.g1-yard-bubble { position: absolute; bottom: 54cqh; width: 16cqw; z-index: 5; opacity: 0; transition: opacity 0.5s ease; }
.g1-yard-bubble.in { opacity: 1; }
.g1-yard-bubble .fb, .g1-yard-bubble .fb-body { width: 100%; }
.g1-yard-bubble-rano { left: 13cqw; }
.g1-yard-bubble-zuhra { right: 11cqw; }
@keyframes yardWalkIn { from { opacity: 0; transform: translateX(18cqw) translateY(0) scale(1); } to { opacity: 1; transform: translateX(0) translateY(0) scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .g1-factcard-plus, .g1-yc-zuhra.walkin, .d4-mount, .d4-mount-r { animation: none; }
  .g1-yc-fig, .g1-yard-bubble { transition: none; }
}

/* === Dars08 — ayirish vizuallari === */
/* BondFrame (s7, Dars06 dan): 10 katak, qizil/yashil olma, "?" yashirin qism */
@keyframes g1pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
.g1-bf { display: inline-grid; grid-template-columns: repeat(5, auto); gap: clamp(4px, 1.2vw, 9px); padding: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); justify-items: center; }
.g1-bf-cell { width: clamp(38px, 8vw, 52px); height: clamp(38px, 8vw, 52px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); display: flex; align-items: center; justify-content: center; }
.g1-bf-cell.on { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.13); }
.g1-bf-q { font-weight: 800; font-size: clamp(20px, 4vw, 28px); color: #B6B2AB; }
.g1-bf-ap { width: 80%; height: 80%; display: inline-flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.2)); }
.g1-bf-ap svg { width: 100%; height: 100%; }
.g1-bf-pop { animation: g1pop 0.4s ease-out; }

/* RemoveRow (MC figuralari): total olma, oxirgi "gone" tasi xira + chizib tashlangan */
.g1-removerow { display: flex; flex-wrap: wrap; gap: clamp(6px, 1.6vw, 12px); justify-content: center; align-items: center; max-width: 470px; }
.g1-rr-item { width: clamp(34px, 7vw, 46px); height: clamp(34px, 7vw, 46px); display: inline-flex; align-items: center; justify-content: center; position: relative; transition: opacity 0.3s ease; }
.g1-rr-item svg { width: 100%; height: 100%; }
.g1-rr-gone { opacity: 0.24; }
.g1-rr-gone::after { content: ''; position: absolute; left: 10%; right: 10%; top: 50%; height: 3px; background: #C0392B; border-radius: 2px; transform: rotate(-14deg); opacity: 0.72; }

/* tap-to-remove (s0, sg): olma bosilsa uchib ketadi */
.g1-rcell { cursor: pointer; }
.g1-flyaway { animation: g1flyaway 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards; pointer-events: none; }
@keyframes g1flyaway { 0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); } 100% { opacity: 0; transform: translateY(-46px) scale(0.5) rotate(18deg); } }

/* nishon satri (sg) */
.g1-target-row { display: flex; align-items: center; gap: 10px; }
.g1-target-num { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #FF4F28; line-height: 1; }

/* katta ifoda (s3 qoida): 7 − 2 = 5 */
.g1-sent-lg { font-size: clamp(28px, 6vw, 44px); gap: clamp(8px, 2vw, 14px); }
.g1-sent .g1-sent-eq { font-style: normal; font-weight: 800; color: #5A5A60; }
.g1-sent .g1-sent-res { color: #1F7A4D; }

/* ayirish belgisi variantlari */
.g1-cg-op-minus { color: #5A5A60; }
.g1-factcard-minus { animation: none; }
.g1-s5-basket { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); }

@media (prefers-reduced-motion: reduce) {
  .g1-flyaway { animation: none; opacity: 0; }
  .g1-bf-pop { animation: none; }
}

/* === Dars09 — son oqi (NumberLine) + juftlash ===*/
.g1-nl { width: 100%; display: flex; justify-content: center; }
.g1-nl-line { width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: clamp(2px, 1vw, 8px); padding: clamp(58px, 13vw, 76px) clamp(14px, 3.4vw, 26px) clamp(6px, 1.6vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); position: relative; }
.g1-nl-line::before { content: ""; position: absolute; left: calc(clamp(14px, 3.4vw, 26px) + clamp(10px, 2.2vw, 14px)); right: calc(clamp(14px, 3.4vw, 26px) + clamp(10px, 2.2vw, 14px)); top: calc(clamp(58px, 13vw, 76px) + clamp(10px, 2.2vw, 14px)); height: 3px; background: #D8D2C6; border-radius: 2px; }
/* quyon-sakrovchi: o'lchanган pozitsiyaga gorizontal siljiydi; ichki span yoy chizib sakraydi + qo'nishda sapchiydi */
.g1-nl-rabbit { position: absolute; z-index: 4; pointer-events: none; transform: translate(-50%, -100%); transition: left 1.2s cubic-bezier(0.34, 1.06, 0.66, 1), top 1.2s cubic-bezier(0.34, 1.06, 0.66, 1); }
.g1-nl-rabbit-hop { display: block; width: clamp(36px, 8.5vw, 50px); transform-origin: center bottom; animation: g1rabbithop 1.25s cubic-bezier(0.4, 0, 0.5, 1); }
.g1-nl-rabbit-hop svg { width: 100%; height: auto; display: block; transform: scaleX(1.3); transform-origin: center bottom; filter: drop-shadow(0 4px 5px rgba(58,53,48,0.2)); }
/* sakrash izi: ikki raqam orasidagi yoy chiziq (qisqa muddat ko'rinib o'chadi) */
.g1-nl-trail { position: absolute; z-index: 2; pointer-events: none; height: clamp(20px, 4.6vw, 28px); border: 2.5px dashed #FF8A6E; border-bottom: none; border-radius: 50% 50% 0 0 / 100% 100% 0 0; transform: translateY(-100%); animation: g1trail 1.5s ease-out both; }
@keyframes g1trail { 0% { opacity: 0; } 22% { opacity: 0.95; } 100% { opacity: 0; } }
@keyframes g1rabbithop {
  0%   { transform: translateY(0)     scaleX(1)    scaleY(1);    }
  16%  { transform: translateY(3px)   scaleX(1.12) scaleY(0.82); }
  50%  { transform: translateY(-24px) scaleX(0.93) scaleY(1.1);  }
  84%  { transform: translateY(0)     scaleX(1.14) scaleY(0.84); }
  100% { transform: translateY(0)     scaleX(1)    scaleY(1);    }
}
@media (prefers-reduced-motion: reduce) {
  .g1-nl-rabbit { transition: none; }
  .g1-nl-rabbit-hop { animation: none; }
  .g1-nl-trail { animation: none; opacity: 0.55; }
}
.g1-nl-tick { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; background: transparent; border: none; padding: 0 clamp(2px, 0.8vw, 6px); cursor: default; }
button.g1-nl-tick { cursor: pointer; }
.g1-nl-dot { width: clamp(20px, 4.4vw, 28px); height: clamp(20px, 4.4vw, 28px); border-radius: 50%; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.16); transition: transform 0.2s ease, background 0.2s ease; }
.g1-nl-dot.marker { background: #FF4F28; box-shadow: 0 2px 8px rgba(255,79,40,0.4); transform: scale(1.15); }
.g1-nl-tick.inpath .g1-nl-dot { background: #FFD3C7; }
button.g1-nl-tick.picked .g1-nl-dot { background: #FFE8E1; box-shadow: inset 0 0 0 2px #FF8A6E; }
button.g1-nl-tick.ok .g1-nl-dot { background: #1F7A4D; box-shadow: 0 2px 8px rgba(31,122,77,0.4); transform: scale(1.15); }
button.g1-nl-tick:not(:disabled):hover .g1-nl-dot { transform: scale(1.12); }
.g1-nl-num { font-size: clamp(13px, 2vw, 16px); font-weight: 700; color: #5A5A60; }
.g1-nl-legend { display: flex; gap: clamp(16px, 4vw, 32px); }
.g1-nl-leg { display: inline-flex; align-items: center; gap: 6px; font-size: clamp(13px, 1.8vw, 15px); font-weight: 700; color: #0E0E10; }
.g1-nl-arrow { font-size: clamp(18px, 3.4vw, 24px); font-weight: 800; }
.g1-nl-arrow-fwd { color: #FF4F28; }
.g1-nl-arrow-back { color: #5A5A60; }
.g1-mrow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.g1-numopt-sel { box-shadow: 0 0 0 3px #FF4F28, 0 4px 12px rgba(255,79,40,0.25) !important; }
.g1-mexp { background: #FFFFFF; border: none; border-radius: 14px; padding: clamp(8px, 1.8vw, 14px) clamp(12px, 2.6vw, 20px); cursor: pointer; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.1); transition: transform 0.15s ease, box-shadow 0.2s ease; }
.g1-mexp:not(:disabled):hover { transform: translateY(-2px); }
.g1-mexp:disabled { cursor: default; }
.g1-mexp-ok { box-shadow: inset 0 0 0 2px #1F7A4D, 0 4px 12px rgba(31,122,77,0.18); background: #E3F0E8; }

/* === Dars12 — TIMSOH-BELGI (> < =) — Dars04 KIT CSS, baytma-bayt === */
.d4-sign { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #FF4F28; font-size: clamp(38px, 8vw, 58px); display: inline-flex; align-items: center; justify-content: center; }
.d4-sign-big { font-size: clamp(52px, 12vw, 86px); }
.d4-croc svg { width: 1.55em; height: 1.18em; overflow: visible; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.22)); }
.d4-croc-anim { animation: d4crocopen 0.5s cubic-bezier(0.34,1.5,0.64,1) both, d4crocbreathe 2.8s ease-in-out 0.55s infinite; transform-origin: center; }
@keyframes d4crocopen { 0% { opacity: 0; transform: scaleX(0.5); } 100% { opacity: 1; transform: scaleX(1); } }
@keyframes d4crocbreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
.d4-numtile { font-family: 'Manrope', sans-serif; font-weight: 800; color: #0E0E10; font-size: clamp(30px, 6.6vw, 46px); line-height: 1; display: inline-flex; align-items: center; justify-content: center; min-width: 1.1em; }

/* === Dars13 — REKENREK (munchoq tasmasi) — YANGI MEXANIKA === */
.g1-rk { display: inline-flex; flex-direction: column; gap: clamp(9px, 2.2vw, 15px); padding: clamp(12px, 2.8vw, 18px) clamp(15px, 3.4vw, 24px); background: linear-gradient(100deg, #D9AB73 0%, #C0904F 40%, #A8763E 100%); border-radius: 18px; border: 2px solid #7E5429; box-shadow: inset 0 3px 4px rgba(255,255,255,0.34), inset 0 -4px 6px rgba(0,0,0,0.24), inset 3px 0 5px rgba(255,255,255,0.12), 0 9px 22px -8px rgba(58,53,48,0.4); }
.g1-rk-row { position: relative; display: flex; justify-content: space-between; align-items: center; min-width: clamp(170px, 44vw, 290px); max-width: 100%; height: clamp(24px, 5vw, 32px); }
.g1-rk-wire { position: absolute; left: -3px; right: -3px; top: 50%; height: 4px; background: linear-gradient(#9A8463, #6E5436 45%, #4E3A22); transform: translateY(-50%); border-radius: 3px; box-shadow: 0 1px 0 rgba(255,255,255,0.18), inset 0 1px 1px rgba(255,255,255,0.25); }
.g1-rk-grp { position: relative; z-index: 1; display: inline-flex; gap: clamp(1px, 0.5vw, 3px); }
.g1-rk-bead { position: relative; width: clamp(18px, 4.3vw, 27px); height: clamp(18px, 4.3vw, 27px); border-radius: 50%; box-shadow: 0 3px 5px rgba(58,53,48,0.34), inset 0 -3px 4px rgba(0,0,0,0.26), inset 0 2px 3px rgba(255,255,255,0.4); }
.g1-rk-bead::after { content: ""; position: absolute; top: 13%; left: 19%; width: 40%; height: 32%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 75%); pointer-events: none; }
.g1-rk-red { background: radial-gradient(circle at 36% 30%, #FBA388 0%, #EC6040 38%, #C7401F 78%, #A8331A 100%); }
.g1-rk-white { background: radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F4EFE5 48%, #DCD2C0 82%, #C7BBA4 100%); }
.g1-rk-gap { margin-left: clamp(7px, 1.8vw, 13px); }
.g1-rk-bslide { animation: g1rkbead 0.62s cubic-bezier(0.34, 1.56, 0.5, 1) both; }
@keyframes g1rkbead {
  0%   { transform: translateX(44px) scale(0.8) rotate(7deg);                  opacity: 0; }
  42%  { transform: translateX(-6px) scaleX(1.2) scaleY(0.84) rotate(-4deg);   opacity: 1; }
  60%  { transform: translateX(4px)  scaleX(0.9) scaleY(1.14) rotate(2.5deg); }
  76%  { transform: translateX(-2px) scaleX(1.07) scaleY(0.96) rotate(-1deg); }
  90%  { transform: translateX(1px)  scale(1.02) rotate(0.5deg); }
  100% { transform: translateX(0)    scale(1) rotate(0); }
}
/* ramka zarbadan yengil silkinadi (jonli) */
.g1-rk-shake { animation: g1rkshake 0.5s ease-out 0.18s both; }
@keyframes g1rkshake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-2px) rotate(-0.5deg); }
  55% { transform: translateX(2px) rotate(0.5deg); }
  80% { transform: translateX(-1px) rotate(0); }
}
@media (prefers-reduced-motion: reduce) { .g1-rk-bslide, .g1-rk-shake { animation: none; } }

/* === Dars15 — BOZOR sahnasi jonli harakatlari === */
.g1-bz-swing { transform-box: view-box; transform-origin: 330px 28px; animation: g1bzswing 3.6s ease-in-out infinite; }
@keyframes g1bzswing { 0%, 100% { transform: rotate(-2.4deg); } 50% { transform: rotate(2.4deg); } }
.g1-bz-sway { transform-box: view-box; transform-origin: 200px 44px; animation: g1bzsway 4.4s ease-in-out infinite; }
@keyframes g1bzsway { 0%, 100% { transform: translateY(0) rotate(-0.7deg); } 50% { transform: translateY(1.6px) rotate(0.7deg); } }
.g1-bz-fringe { transform-box: view-box; transform-origin: 200px 28px; animation: g1bzfringe 3.1s ease-in-out infinite; }
@keyframes g1bzfringe { 0%, 100% { transform: skewX(0deg) translateY(0); } 50% { transform: skewX(1.5deg) translateY(0.9px); } }
@media (prefers-reduced-motion: reduce) { .g1-bz-swing, .g1-bz-sway, .g1-bz-fringe { animation: none; } }

/* === Dars15 — OLMA / yashik (bozor sanoq metodi) === */
.g1-apple { display: inline-flex; width: clamp(20px, 4.6vw, 30px); }
.g1-apple svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 2px rgba(58,53,48,0.18)); }
.g1-crate { position: relative; display: inline-flex; flex-direction: column; align-items: center; padding: clamp(6px, 1.6vw, 9px) clamp(8px, 2vw, 12px) clamp(16px, 3.4vw, 22px); background: linear-gradient(#CDA068, #A8763E); border-radius: 9px; border: 2px solid #855A2F; box-shadow: inset 0 2px 3px rgba(255,255,255,0.28), inset 0 -3px 5px rgba(0,0,0,0.18), 0 5px 12px -5px rgba(58,53,48,0.32); }
.g1-crate-apples { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(1px, 0.5vw, 3px); }
.g1-crate-label { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); font-weight: 800; font-size: clamp(11px, 2.2vw, 15px); color: #FBEFD8; letter-spacing: 0.04em; }
.g1-fviz { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px, 2.6vw, 20px); flex-wrap: wrap; }
.g1-fviz-ones { display: inline-flex; flex-wrap: wrap; align-items: flex-end; gap: clamp(2px, 0.8vw, 5px); max-width: clamp(120px, 34vw, 210px); }
.g1-fviz-one { display: inline-flex; }
.g1-fviz-plus { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 4vw, 30px); color: #A7A6A2; align-self: center; }
.g1-fviz-pop .g1-fviz-one { animation: g1fpop 0.42s cubic-bezier(0.34, 1.5, 0.6, 1) both; }
@keyframes g1fpop { 0% { transform: translateY(-16px) scale(0.6); opacity: 0; } 60% { transform: translateY(2px) scale(1.1); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-fviz-pop .g1-fviz-one { animation: none; } }

/* ============================================================ */
/* === D2 (2-sinf Dars01) — «KEMA ICHIDA»: yuk bo'limi + MIKROGRAVITATSIYA + realistik hardware === */
/* Barcha harakat = suzish/aylanish/magnit-dok. Tortishish-tushish YO'Q. reduced-motion -> statik. */
/* ============================================================ */

/* YUK BO'LIMI interyeri — SceneBg-texnika: aspect-ratio 400/230 + container-type:size,
   fon svg preserveAspectRatio="xMidYMax meet" — fon va figuralar BIRGA miqyoslanadi. */
.d2-scene { position: relative; width: 100%; min-height: clamp(200px, 42vw, 280px); container-type: size; border-radius: 14px; overflow: hidden; background: #E3D9C4; }
.d2-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.d2-scene-bit { position: absolute; right: 3cqw; bottom: 8cqh; height: 42cqh; z-index: 2; display: flex; align-items: flex-end; animation: d2hover 6.5s ease-in-out infinite; }
.d2-scene-bit .g1-cast-fig { height: 100%; }
.d2-scene-bit .g1-char { height: 100%; width: auto; }
.d2-bit-cheer { animation: d2hover 6.5s ease-in-out infinite; }
/* Bit vaznsizlikda suzadi (yuqori-past + yengil aylanish) */
@keyframes d2hover { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-4%) rotate(1.5deg); } }

/* ambient: illyuminator yulduzlari miltillashi + neon + kasseta LED + shift porlashi */
.d2-star { animation: d2tw 2.8s ease-in-out infinite; }
@keyframes d2tw { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.d2-neon { animation: d2neon 2.2s ease-in-out infinite; }
@keyframes d2neon { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.d2-casslight { animation: d2neon 1.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.d2-ceilglow { animation: d2neon 4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .d2-star, .d2-neon, .d2-casslight, .d2-ceilglow, .d2-scene-bit, .d2-bit-cheer { animation: none; } }

/* MIKROGRAVITATSIYA — universal suzish: sekin yuqori-past + doimiy yengil aylanish (inersiya). */
.d2-float { animation: d2float 9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.d2-float-b { animation-duration: 11s; animation-delay: -3s; }
@keyframes d2float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
/* magnit-dok: buyum yondan suzib kelib ohista joylashadi (ease-out, tushish YO'Q) */
.d2-dock { animation: d2dockL 0.7s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-dock-r { animation-name: d2dockR; }
@keyframes d2dockL { 0% { transform: translateX(-26px) rotate(-10deg); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0) rotate(0); opacity: 1; } }
@keyframes d2dockR { 0% { transform: translateX(26px) rotate(10deg); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0) rotate(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d2-float, .d2-float-b, .d2-dock, .d2-dock-r { animation: none; } }

/* suzuvchi chang-zarralar (har ekranda ambient) */
.d2-motes { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.d2-mote { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle at 40% 40%, rgba(143,224,244,0.5), rgba(143,224,244,0)); animation: d2mote 22s linear infinite; }
.d2-mote:nth-child(1) { left: 12%; top: 20%; } .d2-mote:nth-child(2) { left: 30%; top: 70%; width: 4px; height: 4px; }
.d2-mote:nth-child(3) { left: 52%; top: 30%; } .d2-mote:nth-child(4) { left: 68%; top: 62%; width: 6px; height: 6px; }
.d2-mote:nth-child(5) { left: 82%; top: 24%; } .d2-mote:nth-child(6) { left: 44%; top: 84%; width: 4px; height: 4px; }
.d2-mote:nth-child(7) { left: 90%; top: 50%; } .d2-mote:nth-child(8) { left: 8%; top: 56%; width: 6px; height: 6px; }
@keyframes d2mote { 0% { transform: translate(0, 0); opacity: 0; } 15% { opacity: 0.7; } 85% { opacity: 0.7; } 100% { transform: translate(22px, -30px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .d2-mote { animation: none; opacity: 0.4; } }

/* hook (s0) — KONTEYNER markazidan burst -> inersiya bilan suzish; --r butun davomida saqlanadi.
   OUTER (.d2-hbatt): pozitsiya (left/top) + burst (markazdan --dx/--dy vektor bo'ylab, rotate(--r)).
   INNER (.d2-hbatt-in): doimiy idle drift+spin (svg root'da EMAS — HTML o'rovchida). */
.d2-hbatt { position: absolute; width: 5.6cqw; z-index: 3; }
.d2-hbatt-in { display: inline-block; width: 100%; transform-origin: center; }
.d2-hbatt-in .d2-battsvg, .d2-hbatt-in .d2-casssvg { width: 100%; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45)); }
/* burst: markazdan (translate(-dx,-dy)) o'z joyiga, sekin ease-out (inersiya); rotate(--r) doim saqlanadi */
.d2-hbatt-burst { animation: d2burst 1.15s cubic-bezier(0.16, 0.75, 0.28, 1) both; }
@keyframes d2burst {
  0%   { transform: translate(calc(var(--dx, 0px) * -1), calc(var(--dy, 0px) * -1)) rotate(var(--r, 0deg)) scale(0.45); opacity: 0; }
  28%  { opacity: 1; }
  100% { transform: translate(0, 0) rotate(var(--r, 0deg)) scale(1); opacity: 1; }
}
/* idle: parallaks tezlikda suzish (Y) + sekin spin — inner wrapper, base --r bilan urishmaydi */
.d2-hbatt-in { animation: d2floatspin 9s ease-in-out infinite; }
@keyframes d2floatspin { 0%, 100% { transform: translateY(0) rotate(-7deg); } 50% { transform: translateY(-7px) rotate(7deg); } }
/* yig'ilish: markazga suzib kelib magnit qulf (green snap glow); --r -> 0 */
.d2-hbatt-latch { transition: left 1s cubic-bezier(0.22, 0.9, 0.3, 1), top 1s cubic-bezier(0.22, 0.9, 0.3, 1); animation: d2latch 0.6s ease-out 0.9s both; }
.d2-hbatt-latch .d2-hbatt-in { animation: none; }
@keyframes d2latch { 0% { filter: drop-shadow(0 0 0 rgba(110,242,155,0)); } 45% { filter: drop-shadow(0 0 8px rgba(110,242,155,0.95)); } 100% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45)); } }
.d2-hcass { position: absolute; left: 52%; top: 42%; width: 12cqw; z-index: 4; filter: drop-shadow(0 3px 7px rgba(0,0,0,0.55)); }
/* konteyner (qopqog'i ochiladi, batareyalar shundan otiladi) */
.d2-hbox { position: absolute; left: 48%; top: 40%; width: 12cqw; height: 10cqh; z-index: 2; transition: opacity 0.5s ease; }
.d2-hbox i { position: absolute; left: 0; right: 0; border-radius: 2px; }
.d2-hbox-body { bottom: 0; height: 62%; background: linear-gradient(#3A4763, #1E273E); box-shadow: inset 0 0 0 1.5px #55697C; }
.d2-hbox-lid { top: 0; height: 34%; background: linear-gradient(#55697C, #3A4763); box-shadow: inset 0 0 0 1.5px #7E93A8; transform-origin: left bottom; animation: d2lidpop 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) both; }
@keyframes d2lidpop { 0% { transform: rotate(0); } 100% { transform: rotate(-46deg); } }
.d2-hbox-empty { opacity: 0.55; }
@media (prefers-reduced-motion: reduce) {
  .d2-hbatt-burst, .d2-hbatt-in, .d2-hbatt-latch, .d2-hbox-lid { animation: none; }
  .d2-hbatt-latch { transition: none; }
  .d2-hbatt-burst { transform: rotate(var(--r, 0deg)); }
}

/* s1 (v11) — PackTenViz: 10 batareya suzadi -> to'g'ri javobda markazga suzib BITTA
   kassetaga joylashadi (magnit-latch porlashi + LED). Mavhum "element" CSS olib tashlandi. */
.d2-packviz { position: relative; width: 100%; max-width: clamp(250px, 62vw, 380px); height: clamp(110px, 24vw, 170px); margin: 0 auto; }
.d2-packb { position: absolute; width: clamp(14px, 3vw, 20px); transform: rotate(var(--r, 0deg)); }
.d2-packb .d2-battsvg { width: 100%; height: auto; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.3)); }
/* javobgacha: sekin drift + spin (mikrogravitatsiya, s0 lug'ati) */
.d2-packb-in { display: inline-block; animation: d2floatspin 9s ease-in-out infinite; transform-origin: center; }
/* to'g'ri javobda: markazga suzib kirish (left/top + kichrayish), so'ng yo'qoladi */
.d2-packin { animation: d2packin 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) forwards; }
.d2-packin .d2-packb-in { animation: none; }
@keyframes d2packin {
  55%  { opacity: 1; }
  100% { left: 48%; top: 42%; transform: rotate(0deg) scale(0.45); opacity: 0; }
}
/* yig'ilgan kasseta: markazda pop + magnit-latch porlashi (d2latch), keyin tinch suzish */
.d2-packcass { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.d2-packcass-pop { display: inline-block; opacity: 0; animation: d2packpop 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) 0.75s forwards, d2latch 0.6s ease-out 0.85s both; }
@keyframes d2packpop { 0% { opacity: 0; transform: scale(0.4); } 100% { opacity: 1; transform: scale(1); } }
.d2-packcass-idle { display: inline-block; animation: d2float 9s ease-in-out 1.4s infinite; }
@media (prefers-reduced-motion: reduce) {
  .d2-packb-in { animation: none; }
  .d2-packin { animation: none; opacity: 0; }
  .d2-packcass-pop { animation: none; opacity: 1; }
  .d2-packcass-idle { animation: none; }
}

/* BATAREYA / KASSETA o'lchamlari */
.d2-battsvg { width: clamp(14px, 3vw, 20px); height: auto; display: inline-block; }
.d2-battsvg-slot { width: clamp(12px, 2.6vw, 17px); }
.d2-battsvg-btn { width: clamp(12px, 2.6vw, 17px); }
.d2-casssvg { width: clamp(36px, 8vw, 56px); height: auto; display: inline-block; }
.d2-casssvg-big { width: clamp(56px, 13vw, 86px); }
.d2-casssvg-btn { width: clamp(24px, 5vw, 34px); }
.d2-mini { width: clamp(16px, 3.4vw, 24px); height: auto; display: inline-block; }

/* kasseta+batareya vizuali: o'nliklar guruhi chapda, birliklar o'ngda */
.d2-bsviz { display: flex; align-items: flex-end; justify-content: center; gap: clamp(14px, 3.4vw, 26px); flex-wrap: wrap; min-height: clamp(56px, 12vw, 84px); }
.d2-bs-grp { display: inline-flex; align-items: flex-end; gap: clamp(4px, 1vw, 8px); flex-wrap: wrap; justify-content: center; max-width: clamp(190px, 48vw, 330px); }
.d2-bs-ones { gap: clamp(2px, 0.7vw, 5px); }
.d2-bs-empty { font-weight: 800; font-size: clamp(30px, 6.5vw, 44px); color: #B6B2AB; }
.d2-bsviz-sm .d2-casssvg { width: clamp(28px, 6vw, 42px); }
.d2-bsviz-sm .d2-battsvg { width: clamp(11px, 2.4vw, 16px); }

/* katta son-displey (pult ekranlari) */
.d2-bignum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(38px, 8vw, 58px); line-height: 1; color: #0E0E10; }
.d2-bignum-accent { color: #1F7A4D; }

/* s2 — kassetaga joylash maydoni (yuk bo'limi panel) */
.d2-field { position: relative; width: 100%; min-height: clamp(200px, 42vw, 280px); background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 14px; box-shadow: inset 0 0 0 2px #D9CCB2; overflow: hidden; }
/* suzuvchi debris — xaotik mikrogravitatsiya (batareya/sim/lampochka) */
.d2-debris { position: absolute; inset: 0; pointer-events: none; }
.d2-debris-el { position: absolute; line-height: 0; filter: drop-shadow(0 2px 4px rgba(58,53,48,0.22)); animation-name: d2debris; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
@keyframes d2debris { 0% { transform: translate(0,0) rotate(0deg); } 25% { transform: translate(14px,-11px) rotate(48deg); } 50% { transform: translate(-6px,10px) rotate(-24deg); } 75% { transform: translate(9px,6px) rotate(30deg); } 100% { transform: translate(0,0) rotate(0deg); } }
@media (prefers-reduced-motion: reduce) { .d2-debris-el { animation: none; } }
.d2-nlcue-slide { animation: d2nlcueslide 3.4s ease-in-out infinite; }
.d2-nlcue-hand { animation: d2nlcuebob 1.1s ease-in-out infinite; }
.d2-nlcue-ring { transform-box: fill-box; transform-origin: center; animation: d2nlcuering 1.1s ease-in-out infinite; }
@keyframes d2nlcueslide { 0%, 100% { transform: translateX(54px); } 50% { transform: translateX(214px); } }
@keyframes d2nlcuebob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes d2nlcuering { 0% { opacity: 0.85; transform: scale(0.7); } 70% { opacity: 0; transform: scale(1.9); } 100% { opacity: 0; transform: scale(1.9); } }
@media (prefers-reduced-motion: reduce) { .d2-nlcue-slide { animation: none; transform: translateX(134px); } .d2-nlcue-hand, .d2-nlcue-ring { animation: none; } }
.d2-fbatt { position: absolute; background: transparent; border: none; padding: 8px; cursor: pointer; transform: rotate(var(--r, 0deg)); animation: d2driftin 0.6s ease-out both, d2float 10s ease-in-out 0.6s infinite; }
.d2-fbatt .d2-battsvg { width: clamp(17px, 3.6vw, 24px); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.d2-fbatt:hover:not(:disabled) { filter: drop-shadow(0 0 6px rgba(143,224,244,0.8)); }
.d2-fbatt:disabled { cursor: default; }
@keyframes d2driftin { 0% { opacity: 0; transform: scale(0.6) rotate(var(--r, 0deg)); } 100% { opacity: 1; transform: scale(1) rotate(var(--r, 0deg)); } }
@media (prefers-reduced-motion: reduce) { .d2-fbatt { animation: none; } }
.d2-casszone { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: clamp(130px, 33vw, 195px); min-height: clamp(104px, 23vw, 156px); border: 2.5px dashed rgba(58,71,99,0.45); border-radius: 16px; background: rgba(246,240,226,0.86); box-shadow: 0 6px 18px -8px rgba(58,53,48,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: clamp(8px, 1.8vw, 12px); transition: border-color 0.25s, background 0.25s, box-shadow 0.25s; z-index: 2; }
.d2-casszone-tied { border-style: solid; border-color: #1F7A4D; background: rgba(227,240,232,0.92); box-shadow: 0 0 16px -6px rgba(31,122,77,0.45); }
.d2-slotgrid { display: grid; grid-template-columns: repeat(5, auto); gap: clamp(3px, 0.8vw, 6px); justify-items: center; }
.d2-slot { width: clamp(18px, 4vw, 26px); height: clamp(26px, 5.6vw, 36px); border-radius: 6px; box-shadow: inset 0 0 0 1.5px rgba(58,71,99,0.3); display: flex; align-items: center; justify-content: center; }
.d2-slot-full { box-shadow: inset 0 0 0 1.5px #1F7A4D; background: rgba(31,122,77,0.12); }
.d2-slot .g1-pop-in { animation: d2dockR 0.55s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-count { font-weight: 800; font-size: clamp(13px, 1.9vw, 16px); color: #5A6B88; }
.d2-count-ok { color: #1F7A4D; }

/* manba-tugmalar (s3/s4/s8): kasseta+ / batareya+ */
.d2-srcrow { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; flex-wrap: wrap; }
.d2-srcbtn { display: inline-flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); font-size: clamp(15px, 2.2vw, 19px) !important; padding: clamp(10px, 2vw, 15px) clamp(14px, 2.8vw, 22px) !important; }
.d2-src-wait { opacity: 0.45; }
.d2-srcbtn:disabled { cursor: default; }

/* yuklash pulti (brushed-metal panel) — vizual + displey ichida */
.d2-console { width: 100%; background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 16px; box-shadow: inset 0 0 0 2px #D9CCB2, inset 0 2px 6px rgba(255,255,255,0.5), 0 8px 22px -10px rgba(58,53,48,0.25); padding: clamp(12px, 2.6vw, 20px); display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.2vw, 16px); position: relative; }
.d2-console::before { content: ''; position: absolute; top: 7px; left: 10px; right: 10px; height: 4px; border-radius: 2px; background: repeating-linear-gradient(90deg, #F0A81E 0 8px, #D9CCB2 8px 14px); opacity: 0.5; }
.d2-console-sm { padding: clamp(10px, 2vw, 14px); }
.d2-console .d2-bignum { color: #2A3550; }
.d2-console .d2-bignum-accent { color: #1F7A4D; }
.d2-console .d2-bs-empty { color: #A79E88; }
.d2-console .g1-anspop-num { color: #1F7A4D; }
.d2-console .g1-anspop-eq { color: #5A6B88; }

/* s5 — neon-displey kartasi (34 <-> 30 + 4), 7-seg-ish porlash */
.d2-cardbtn { background: transparent; border: none; padding: 6px; cursor: pointer; }
.d2-cardbtn:disabled { cursor: default; }
.d2-card { display: inline-flex; align-items: center; justify-content: center; background: #0C1424; border-radius: 18px; box-shadow: inset 0 0 0 2px #2C3A60, 0 8px 22px -6px rgba(16,24,44,0.55); font-family: 'JetBrains Mono', monospace; font-weight: 800; letter-spacing: 0.06em; font-size: clamp(44px, 10vw, 68px); line-height: 1; color: #5BD6F2; text-shadow: 0 0 14px rgba(91,214,242,0.7); padding: clamp(12px, 2.6vw, 20px) clamp(20px, 4.4vw, 34px); }
.d2-card-tens { color: #FF8A6E; text-shadow: 0 0 14px rgba(255,138,110,0.6); }
.d2-card-ones { color: #6EF29B; text-shadow: 0 0 14px rgba(110,242,155,0.6); }
.d2-splitrow { display: inline-flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.d2-plus { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px, 6vw, 44px); color: #9FD8EA; }
.d2-tap-pulse { animation: d2tappulse 1.8s ease-in-out infinite; }
@keyframes d2tappulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.d2-eq { font-weight: 800; font-size: clamp(20px, 4.4vw, 32px); color: #1F7A4D; }
/* s15 QOIDA recap — yakunda qoidani qayta ko'rsatadi (ko'rinadigan qonun qatori) */
.d2-recap { margin-top: clamp(8px, 1.6vw, 12px); padding: clamp(7px, 1.4vw, 10px) clamp(12px, 2.2vw, 16px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(31,122,77,0.35); color: #1F7A4D; font-weight: 800; font-size: clamp(12px, 1.8vw, 15px); text-align: center; }
/* FOYDALI matematik ma'lumot/qoida kartasi */
.d2-infonote { display: flex; align-items: flex-start; gap: clamp(8px, 1.8vw, 12px); background: #EAF6FB; border-radius: 14px; padding: clamp(9px, 1.8vw, 13px) clamp(12px, 2.2vw, 16px); box-shadow: inset 3px 0 0 #019ACB; }
.d2-infonote-badge { flex-shrink: 0; font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #017CA3; background: #FFFFFF; border-radius: 99px; padding: 3px 10px; margin-top: 2px; }
.d2-infonote-txt { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(13px, 1.9vw, 15px); line-height: 1.4; color: #0E0E10; }
/* s5 lyuk — noto'g'ri kodda silkinish */
.d2-hatchwrap { line-height: 0; }
.d2-hatch-shake { animation: d2hshake 0.45s ease; }
@keyframes d2hshake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
@media (prefers-reduced-motion: reduce) { .d2-hatch-shake { animation: none; } }
/* s0 «video» — Yer globusi: bulutlar sekin aylanadi, globus ohista suzadi (kema uzoqlashadi) */
.d2-earth { animation: d2earthdrift 26s ease-in-out infinite alternate; }
.d2-earth-clouds { transform-origin: 64px 46px; animation: d2earthspin 46s linear infinite; }
@keyframes d2earthdrift { from { transform: translate(0px, 0px); } to { transform: translate(-5px, 4px); } }
@keyframes d2earthspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* s15 warp — Yer uzoqlashadi (kichrayadi + chetga suzadi), kema uchmoqda */
.d2-earth-recede { transform-origin: 64px 46px; animation: d2earthrecede 5.5s ease-in 0.4s forwards; }
@keyframes d2earthrecede { 0% { transform: scale(1) translate(0px, 0px); opacity: 1; } 100% { transform: scale(0.28) translate(34px, -22px); opacity: 0.85; } }
@media (prefers-reduced-motion: reduce) { .d2-earth, .d2-earth-clouds, .d2-earth-recede { animation: none; } }
/* s5 — lyuk oldidagi KOD TABLOSI (o'rnatilgan panel) */
.d2-hatchtablo { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); width: min(290px, 88%); background: #F6F0E2; border-radius: 14px; box-shadow: inset 0 0 0 2px #D9CCB2, 0 5px 14px -7px rgba(58,53,48,0.22); padding: clamp(8px, 1.8vw, 12px) clamp(12px, 2.2vw, 16px); margin-top: clamp(-10px, -1.6vw, -6px); }
@media (prefers-reduced-motion: reduce) { .d2-tap-pulse { animation: none; } }

/* s6 — lyuk-kod panellari (45 va 54) — v10 ANIQLIK: raqam <-> yuk bog'i ko'rinadi.
   Panelda raqobatlashuvchi harakat YO'Q (lampa statik, faqat reveal + pop). */
.d2-panels { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; align-items: stretch; flex-wrap: wrap; }
.d2-panel { position: relative; flex: 1 1 150px; max-width: 340px; background: #FFFFFF; border-radius: 14px; box-shadow: 0 8px 22px -6px rgba(58,53,48,0.14); padding: clamp(12px, 2.4vw, 18px); display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); opacity: 0.22; transform: translateY(6px); transition: opacity 0.5s ease, transform 0.5s ease; }
.d2-panel.on { opacity: 1; transform: none; }
.d2-panel-num { display: inline-flex; gap: 2px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(36px, 7.5vw, 54px); line-height: 1; color: #0E0E10; }
.d2-panel-num span { transition: color 0.3s ease; }
.d2-digit-tens { color: #FF4F28; }
.d2-digit-ones { color: #019ACB; }
.d2-lamp { width: clamp(12px, 2.6vw, 17px); height: clamp(12px, 2.6vw, 17px); border-radius: 50%; background: #C8CDD4; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.15); }
.d2-lamp-still-g { background: #6EF29B; box-shadow: 0 0 8px rgba(110,242,155,0.7); }
.d2-lamp-still-y { background: #FFC23C; box-shadow: 0 0 8px rgba(255,194,60,0.7); }
.d2-hpanel { min-height: clamp(190px, 42vw, 280px); justify-content: flex-start; }
.d2-hwait { font-weight: 800; font-size: clamp(34px, 7vw, 52px); color: #B6B2AB; margin: auto 0; }
/* ikki ustun: raqam + belgi + ulagich + yuk-guruh (bog' shubhasiz ko'rinsin) */
.d2-hcols { display: flex; gap: clamp(10px, 2.4vw, 18px); align-items: stretch; justify-content: center; width: 100%; }
.d2-hcol { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: clamp(3px, 0.8vw, 6px); border-radius: 12px; padding: clamp(6px, 1.4vw, 10px) clamp(4px, 1vw, 8px); }
.d2-hcol-tens { background: #EAF6FB; box-shadow: inset 0 0 0 1.5px rgba(1,154,203,0.35); }
.d2-hcol-ones { background: #FFF4E0; box-shadow: inset 0 0 0 1.5px rgba(199,119,0,0.3); }
.d2-hdigit { font-weight: 800; font-size: clamp(40px, 9vw, 62px); line-height: 1; letter-spacing: 0.04em; }
.d2-hcol-tens .d2-hdigit { color: #017CA3; }
.d2-hcol-ones .d2-hdigit { color: #C77700; }
.d2-hicon { display: inline-flex; opacity: 0.9; }
.d2-hline { width: 2px; height: clamp(10px, 2.2vw, 16px); border-radius: 1px; }
.d2-hcol-tens .d2-hline { background: rgba(1,154,203,0.55); }
.d2-hcol-ones .d2-hline { background: rgba(199,119,0,0.5); }
.d2-hcargo { display: flex; flex-wrap: wrap; gap: clamp(2px, 0.6vw, 5px); justify-content: center; align-items: flex-end; min-height: clamp(38px, 8.5vw, 58px); }
.d2-hgc { width: clamp(20px, 4.4vw, 30px); height: auto; display: inline-block; }
.d2-hgb { width: clamp(10px, 2.2vw, 15px); height: auto; display: inline-block; }
/* 3-qadam: 4 va 5 KO'RINIB joy almashadi (yoy bo'ylab, bir marta, sekin) */
.d2-swap { position: relative; display: flex; align-items: center; justify-content: center; gap: clamp(34px, 9vw, 60px); min-height: clamp(40px, 8.5vw, 58px); }
.d2-swapchip { display: inline-flex; align-items: center; justify-content: center; width: clamp(34px, 7.4vw, 50px); height: clamp(34px, 7.4vw, 50px); border-radius: 12px; font-weight: 800; font-size: clamp(22px, 4.8vw, 32px); background: #FFFFFF; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.3); }
.d2-swapchip-l { color: #017CA3; animation: d2swapL 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards; }
.d2-swapchip-r { color: #C77700; animation: d2swapR 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards; }
.d2-swaparrow { font-weight: 800; font-size: clamp(18px, 4vw, 26px); color: #A7A6A2; }
@keyframes d2swapL { 0% { transform: translate(0, 0); } 50% { transform: translate(calc(50% + clamp(26px, 6.5vw, 43px)), -18px); } 100% { transform: translateX(calc(100% + clamp(52px, 13vw, 86px))); } }
@keyframes d2swapR { 0% { transform: translate(0, 0); } 50% { transform: translate(calc(-50% - clamp(26px, 6.5vw, 43px)), 18px); } 100% { transform: translateX(calc(-100% - clamp(52px, 13vw, 86px))); } }
.d2-panel-tags { display: inline-flex; gap: clamp(8px, 2vw, 14px); }
.d2-panel-tags i { font-style: normal; font-weight: 700; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.08em; text-transform: uppercase; border-radius: 99px; padding: 3px 9px; }
.d2-tag-tens { background: #FFE8E1; color: #D63E18; }
.d2-tag-ones { background: #EAF6FB; color: #017CA3; }
@media (prefers-reduced-motion: reduce) { .d2-panel { transition: none; } .d2-swapchip-l, .d2-swapchip-r { animation: none; } }

/* s10 — bort kodi 63 (7-seg tablo) */
.d2-claim { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.d2-board { display: inline-flex; gap: clamp(3px, 0.8vw, 6px); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; font-weight: 800; font-size: clamp(44px, 10vw, 68px); line-height: 1; background: #0C1424; color: #E8F4FF; border-radius: 14px; padding: clamp(8px, 1.8vw, 14px) clamp(18px, 4vw, 30px); box-shadow: inset 0 0 0 2px #2C3A60, 0 8px 22px -6px rgba(16,24,44,0.5); }
.d2-board .d2-digit-tens { color: #FF8A6E; text-shadow: 0 0 10px rgba(255,138,110,0.5); }
.d2-board .d2-digit-ones { color: #5BD6F2; text-shadow: 0 0 10px rgba(91,214,242,0.5); }
.d2-board span { transition: color 0.3s ease; }

/* s8 — build+check boshqaruvi */
.d2-buildrows { display: flex; gap: clamp(16px, 4vw, 32px); justify-content: center; flex-wrap: wrap; }
.d2-buildcol { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-collabel { font-weight: 700; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.1em; text-transform: uppercase; color: #5A6B88; }
.d2-pm { display: flex; gap: clamp(6px, 1.4vw, 10px); align-items: stretch; }

/* MC raqam-varianti */
.d2-mcnum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(21px, 4.4vw, 30px); line-height: 1; color: inherit; }
.d2-qlead { margin: 0 0 clamp(4px, 1vw, 8px); text-align: center; color: #A7A6A2; font-weight: 600; font-size: clamp(12px, 1.6vw, 14px); }

/* MASALA — magnit-rack + yuk xati */
.d2-rackwrap { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 22px); flex-wrap: wrap; }
.d2-manifest { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 8px); background: #F3EBDA; border: 2px solid #D9CCB2; border-radius: 12px; padding: clamp(8px, 1.8vw, 13px) clamp(10px, 2.2vw, 16px); box-shadow: 0 6px 16px -8px rgba(58,53,48,0.28); }
.d2-manifest-title { font-weight: 800; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.1em; text-transform: uppercase; color: #1F7A4D; border-bottom: 1.5px dashed #D9CCB2; padding-bottom: 3px; }
.d2-manifest-row { display: inline-flex; align-items: center; gap: 7px; font-size: clamp(13px, 1.8vw, 16px); color: #2A3550; border-radius: 8px; padding: 2px 6px; }
.d2-manifest-row b { font-weight: 800; color: #5A6B88; }
/* v10: yuk-xati qatorlari KETMA-KET yonadi (audio bilan sinxron): avval "6", keyin "3" */
.d2-mrow-1 { animation: d2mrowhl 1.4s ease 1s; }
.d2-mrow-2 { animation: d2mrowhl 1.4s ease 4.2s; }
@keyframes d2mrowhl { 0%, 100% { background: transparent; } 35% { background: rgba(110,242,155,0.22); box-shadow: 0 0 10px -2px rgba(110,242,155,0.6); } }
@media (prefers-reduced-motion: reduce) { .d2-mrow-1, .d2-mrow-2 { animation: none; } }
/* magnit-rack: yuqorida magnit-bar, ostida suzuvchi yuk */
/* v10: "sirli uzun tayoq" (magnit-rack relsi) OLIB TASHLANDI — yuk endi ikki toza
   YORLIQLI guruhda: "6" chipli kassetalar + "3" chipli batareyalar; chip+guruh
   yuk-xati qatori bilan bir vaqtda ketma-ket porlaydi (tushunarli sekvensiya). */
.d2-cargogrps { display: flex; align-items: flex-end; justify-content: center; gap: clamp(14px, 3.4vw, 26px); flex-wrap: wrap; }
.d2-cgrp { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); border-radius: 14px; padding: clamp(8px, 1.8vw, 12px); }
.d2-cgrp-1 { background: rgba(91,214,242,0.08); box-shadow: inset 0 0 0 1.5px rgba(91,214,242,0.35); animation: d2grpglow 1.4s ease 1s; }
.d2-cgrp-2 { background: rgba(255,194,60,0.08); box-shadow: inset 0 0 0 1.5px rgba(255,194,60,0.35); animation: d2grpglow 1.4s ease 4.2s; }
@keyframes d2grpglow { 0%, 100% { transform: scale(1); } 35% { transform: scale(1.04); box-shadow: inset 0 0 0 2px rgba(110,242,155,0.8), 0 0 16px -2px rgba(110,242,155,0.6); } }
.d2-cgrp-chip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(24px, 5.2vw, 34px); height: clamp(24px, 5.2vw, 34px); border-radius: 99px; font-weight: 800; font-size: clamp(15px, 3vw, 21px); padding: 0 8px; }
.d2-cgrp-chip-c { background: #EAF6FB; color: #017CA3; box-shadow: inset 0 0 0 1.5px rgba(1,154,203,0.4); }
.d2-cgrp-chip-b { background: #FFF4E0; color: #C77700; box-shadow: inset 0 0 0 1.5px rgba(199,119,0,0.35); }
.d2-cgrp-items { display: flex; flex-wrap: wrap; gap: clamp(3px, 0.8vw, 6px); justify-content: center; align-items: flex-end; max-width: clamp(150px, 38vw, 250px); }
.d2-cgrp-cass { width: clamp(24px, 5.2vw, 36px); height: auto; display: inline-block; }
.d2-cgrp-batt { width: clamp(11px, 2.4vw, 16px); height: auto; display: inline-block; }
@media (prefers-reduced-motion: reduce) { .d2-cgrp-1, .d2-cgrp-2 { animation: none; } }

/* raketa + olov (faqat s11 fakt) */
.d2-rocketsvg { width: clamp(44px, 9.5vw, 66px); height: auto; display: inline-block; filter: drop-shadow(0 4px 8px rgba(16,24,44,0.4)); }
.d2-rocket-fact { width: clamp(34px, 7vw, 48px); }
.d2-flame { transform-box: fill-box; transform-origin: center top; animation: d2flick 0.5s ease-in-out infinite alternate; }
@keyframes d2flick { 0% { transform: scaleY(0.85) scaleX(0.95); } 100% { transform: scaleY(1.12) scaleX(1.05); } }
@media (prefers-reduced-motion: reduce) { .d2-flame { animation: none; } }

/* s11 fakt: teskari sanash */
.d2-factrocket { flex: 0 0 auto; display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-cd { display: inline-flex; flex-direction: column; gap: 2px; align-items: flex-end; }
.d2-cd i { font-style: normal; font-weight: 800; color: #019ACB; line-height: 1; }
.d2-cd i:nth-child(1) { font-size: clamp(16px, 3vw, 22px); animation: d2neon 1.8s ease-in-out infinite; }
.d2-cd i:nth-child(2) { font-size: clamp(13px, 2.4vw, 18px); opacity: 0.75; animation: d2neon 1.8s ease-in-out 0.6s infinite; }
.d2-cd i:nth-child(3) { font-size: clamp(11px, 2vw, 15px); opacity: 0.55; animation: d2neon 1.8s ease-in-out 1.2s infinite; }
@media (prefers-reduced-motion: reduce) { .d2-cd i { animation: none; } }

/* s15 — v10 UCHISH SEKVENSIYASI (3 takt, animation-delay zanjiri, holatsiz):
   1) zaryad (0-2.5s): kassetalar dvigatel slotlariga dok, indikator to'ladi;
   2) ot oldirish (~2.6s): korpus tebranadi + dvigatel porlashi;
   3) uchish (4s+): warp-chiziqlar + sayyora uzoqlashadi. reduced-motion -> statik. */
.d2-launchseq { position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-warp-svgwrap { position: relative; width: 100%; max-width: clamp(240px, 62vw, 380px); }
.d2-warp-svg { width: 100%; height: auto; border-radius: 14px; display: block; }
/* 2-takt: korpus tebranishi — dvigatel ot olgach boshlanadi (2.6s dan) */
.d2-hullvib { animation: d2hull 0.18s ease-in-out 2.6s infinite; }
@keyframes d2hull { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(0.6px, -0.4px); } 75% { transform: translate(-0.5px, 0.5px); } }
/* dvigatel porlashi (pastdan) — 2.6s da yonadi, so'ng lipillaydi */
.d2-engglow { position: absolute; left: 12%; right: 12%; bottom: -4px; height: clamp(10px, 2.2vw, 16px); border-radius: 99px; background: radial-gradient(ellipse at center, rgba(110,242,155,0.85), rgba(110,242,155,0)); opacity: 0; animation: d2glowon 1s ease 2.6s forwards, d2neon 1.6s ease-in-out 3.6s infinite; }
@keyframes d2glowon { from { opacity: 0; } to { opacity: 1; } }
/* 3-takt: warp-chiziqlar (delay inline 4s+), sayyora 4s dan uzoqlashadi */
.d2-streak { animation: d2warpstreak 1.3s ease-in infinite; opacity: 0; }
@keyframes d2warpstreak {
  0%   { transform: translateY(0) scaleY(1); opacity: 0.9; }
  60%  { transform: translateY(26px) scaleY(9); opacity: 1; }
  100% { transform: translateY(60px) scaleY(16); opacity: 0; }
}
.d2-planet-recede { animation: d2recede 4s ease-in 4s forwards; transform-box: fill-box; transform-origin: center; }
@keyframes d2recede { 0% { transform: scale(1); opacity: 0.95; } 100% { transform: scale(0.35); opacity: 0.35; } }
/* 1-takt: dvigatel slot-qatori — kassetalar chapdan suzib dok qiladi, indikator yashilga to'ladi */
.d2-engrow { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 16px); background: #EFE8D8; border-radius: 12px; box-shadow: inset 0 0 0 2px #D9CCB2; padding: clamp(6px, 1.4vw, 10px) clamp(10px, 2.2vw, 16px); }
.d2-engslots { display: inline-flex; gap: clamp(5px, 1.2vw, 8px); }
.d2-engslot { display: inline-flex; align-items: center; justify-content: center; width: clamp(26px, 5.6vw, 38px); height: clamp(34px, 7.4vw, 50px); border-radius: 8px; background: #F6F0E2; box-shadow: inset 0 0 0 1.5px #D9CCB2; overflow: hidden; }
.d2-engcass { display: inline-flex; animation: d2engdock 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-engcass-svg { width: clamp(18px, 4vw, 27px); height: auto; display: inline-block; }
@keyframes d2engdock { 0% { transform: translateX(-34px); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0); opacity: 1; } }
.d2-engbar { position: relative; width: clamp(60px, 14vw, 100px); height: clamp(8px, 1.8vw, 12px); border-radius: 99px; background: #EAE0CC; box-shadow: inset 0 0 0 1.5px #D9CCB2; overflow: hidden; }
.d2-engfill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-radius: 99px; background: linear-gradient(90deg, #2FA0CC, #6EF29B); animation: d2engfill 1.8s ease-out 0.5s forwards; }
@keyframes d2engfill { from { width: 0; } to { width: 100%; } }
/* old planda Bit bayram qiladi */
.d2-launch-bit { position: absolute; right: clamp(2px, 1vw, 10px); bottom: clamp(2px, 1vw, 10px); height: clamp(56px, 12.5vw, 86px); z-index: 3; animation: d2hover 6.5s ease-in-out infinite; pointer-events: none; }
.d2-launch-bit .g1-cast-fig { height: 100%; }
.d2-launch-bit .g1-char { height: 100%; width: auto; }
@media (prefers-reduced-motion: reduce) {
  .d2-hullvib, .d2-streak, .d2-planet-recede, .d2-engcass, .d2-engfill, .d2-engglow, .d2-launch-bit { animation: none; }
  .d2-engfill { width: 100%; }
  .d2-engglow { opacity: 0.8; }
}

/* === v4 — sSORT (tasniflash: tap-to-bin) === */
.d2-sortpool { display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); justify-content: center; align-items: center; }
.d2-sortitem { background: #FFFFFF; border: 2px solid #D9CCB2; border-radius: 12px; padding: clamp(6px, 1.4vw, 10px); cursor: pointer; transition: transform 0.15s, box-shadow 0.2s, border-color 0.2s; display: inline-flex; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-sortitem .d2-casssvg { width: clamp(30px, 6.5vw, 46px); }
.d2-sortitem .d2-battsvg { width: clamp(15px, 3.2vw, 21px); }
.d2-sortitem:hover:not(:disabled) { transform: translateY(-2px); }
.d2-sortitem-sel { border-color: #FF4F28; box-shadow: 0 0 14px -2px rgba(255,79,40,0.5); }
.d2-sortitem:disabled { cursor: default; }
.d2-sortdone { font-weight: 800; font-size: clamp(30px, 7vw, 46px); color: #6EF29B; }
.d2-holds { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; align-items: stretch; }
.d2-hold { flex: 1 1 0; max-width: 260px; min-height: clamp(78px, 17vw, 110px); background: #FFFFFF; border: 2.5px dashed #A7A6A2; border-radius: 16px; padding: clamp(8px, 1.8vw, 12px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
.d2-hold-armed { border-color: #5BD6F2; background: #F2FBFE; }
.d2-hold-armed:hover:not(:disabled) { box-shadow: 0 0 14px -3px rgba(91,214,242,0.6); }
.d2-hold-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.d2-hold-wrong { border-color: #D8A93A; background: #FBF3D6; animation: d2holdnudge 0.45s ease; }
@keyframes d2holdnudge { 0%,100% { transform: translateX(0); } 30% { transform: translateX(-4px); } 60% { transform: translateX(4px); } }
.d2-hold:disabled { cursor: default; }
.d2-hold-label { font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); letter-spacing: 0.08em; color: #5A5A60; }
.d2-hold-ok .d2-hold-label { color: #1F7A4D; }
.d2-hold-slot { flex: 1; display: flex; flex-wrap: wrap; gap: 3px; align-items: center; justify-content: center; min-height: clamp(28px, 6vw, 42px); }
.d2-hold-chip .d2-casssvg-btn { width: clamp(18px, 4vw, 28px); }
.d2-hold-chip .d2-battsvg-btn { width: clamp(10px, 2.2vw, 15px); }
.d2-hold-count { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(16px, 2.6vw, 22px); color: #A7A6A2; }
.d2-hold-count.on { color: #1F7A4D; }
@media (prefers-reduced-motion: reduce) { .d2-hold-wrong { animation: none; } }

/* === v4 — sDIAG (diagnostika: ketma-ket sub) === */
.d2-diag-head { display: flex; align-items: center; justify-content: space-between; }
.d2-diag-title { font-weight: 800; font-size: clamp(11px, 1.5vw, 13px); letter-spacing: 0.14em; text-transform: uppercase; color: #017CA3; }
.d2-diag-prog { font-weight: 800; font-size: clamp(13px, 1.8vw, 15px); color: #5A5A60; }
.d2-diag-panel-ok { box-shadow: 0 0 0 2px #1F7A4D, 0 8px 22px -6px rgba(31,122,77,0.3) !important; background: #F1FAF4 !important; }
.d2-diag-rows { display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); }
.d2-diag-done { display: flex; align-items: center; gap: 10px; background: #E3F0E8; border-radius: 10px; padding: clamp(6px, 1.3vw, 9px) clamp(10px, 2vw, 14px); }
.d2-diag-check { width: clamp(18px, 3vw, 22px); height: clamp(18px, 3vw, 22px); border-radius: 50%; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 14px); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.d2-diag-donetxt { font-weight: 700; font-size: clamp(13px, 1.8vw, 15px); color: #1F7A4D; }
.d2-diag-active { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 12px; padding: clamp(10px, 2vw, 14px); box-shadow: inset 0 0 0 2px rgba(1,154,203,0.25); }
.d2-diag-q { margin: 0; text-align: center; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px, 2.1vw, 18px); color: #0E0E10; }
.d2-diag-opts { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.d2-tapbtn { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(8px, 1.8vw, 12px) clamp(16px, 3.4vw, 26px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s; }
.d2-tapbtn:hover:not(:disabled) { transform: translateY(-2px); }
.d2-tapbtn-wrong { opacity: 0.32; box-shadow: inset 0 0 0 2px #E7C46B; cursor: default; }
.d2-tapbtn:disabled { cursor: default; }
.d2-tapnum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 5vw, 34px); line-height: 1; color: #0E0E10; }

/* === v4 — sCMP (taqqoslash: ikki kema) === */
.d2-cmp { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2.4vw, 20px); flex-wrap: nowrap; }
.d2-cmp-ship { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); padding: clamp(8px, 1.8vw, 12px); border-radius: 14px; border: 2px solid transparent; transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
.d2-cmp-win { border-color: #6EF29B; box-shadow: 0 0 18px -3px rgba(110,242,155,0.7); transform: translateY(-3px); }
.d2-shipsvg { width: clamp(96px, 24vw, 150px); height: auto; display: block; filter: drop-shadow(0 4px 8px rgba(16,24,44,0.4)); }
.d2-cmp-vs { font-weight: 800; font-size: clamp(22px, 4.6vw, 32px); color: #A7A6A2; }

/* === v4 — sERR (xatoni-top: ko'rsatkich qatorlari) === */
.d2-readout { display: flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d2-readout-n { font-weight: 800; font-size: clamp(22px, 4.6vw, 32px); color: #0E0E10; min-width: 1.6em; text-align: right; }
.d2-readout-eq { font-weight: 800; font-size: clamp(18px, 3.4vw, 24px); color: #A7A6A2; }
.d2-readout-part { display: inline-flex; align-items: baseline; gap: 4px; font-size: clamp(13px, 1.9vw, 16px); color: #5A5A60; }
.d2-readout-part b { font-size: clamp(19px, 3.6vw, 26px); color: #0E0E10; }
.option .d2-readout-n, .option .d2-readout-part b { color: #0E0E10; }
.option-correct .d2-readout-n, .option-correct .d2-readout-part b, .option-correct .d2-readout-part, .option-correct .d2-readout-eq { color: #1F7A4D !important; }

/* === v5 — sPANEL (bort testi: har sub o'z figurasi + reveal payoff) === */
.d2-panel-fig { display: flex; justify-content: center; padding: clamp(4px, 1vw, 8px) 0; }
.d2-panel-reveal { display: flex; align-items: center; justify-content: center; padding: clamp(8px, 2vw, 14px) 0; min-height: clamp(60px, 13vw, 90px); }
.d2-err-found { display: inline-flex; align-items: center; gap: clamp(8px, 2vw, 14px); background: #E3F0E8; border-radius: 12px; padding: clamp(8px, 1.6vw, 12px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 2px #1F7A4D; }
.d2-err-badge { width: clamp(22px, 4vw, 28px); height: clamp(22px, 4vw, 28px); border-radius: 50%; background: #1F7A4D; color: #fff; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.d2-err-found .d2-readout-n, .d2-err-found .d2-readout-part b { color: #1F7A4D; }

/* === v5 — sCASE (yuk xati: kontekst + savol bitta ekranда) === */
.d2-case-ctx { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px, 2vw, 17px); line-height: 1.3; color: #0E0E10; }

/* === v7/v10 — s14 FINAL: haqiqiy devor-TABLO (bezel + boltlar + porlovchi sarlavha + skanline) === */
.d2-tablo { position: relative; width: 100%; max-width: clamp(280px, 74vw, 460px); margin: 0 auto; background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 16px; box-shadow: inset 0 0 0 3px #D9CCB2, inset 0 2px 6px rgba(255,255,255,0.5), 0 10px 26px -10px rgba(58,53,48,0.3); padding: clamp(10px, 2.2vw, 16px); }
.d2-tablo-bolt { position: absolute; width: clamp(6px, 1.3vw, 9px); height: clamp(6px, 1.3vw, 9px); border-radius: 50%; background: radial-gradient(circle at 35% 35%, #AEBEC9, #55697C); box-shadow: inset 0 -1px 1px rgba(0,0,0,0.5); }
.d2-tb1 { left: 6px; top: 6px; } .d2-tb2 { right: 6px; top: 6px; } .d2-tb3 { left: 6px; bottom: 6px; } .d2-tb4 { right: 6px; bottom: 6px; }
.d2-tablo-head { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 10px); padding-bottom: clamp(6px, 1.4vw, 10px); margin-bottom: clamp(6px, 1.4vw, 10px); border-bottom: 2px solid rgba(58,71,99,0.22); box-shadow: 0 8px 12px -11px rgba(58,53,48,0.4); }
.d2-tablo-plus { font-weight: 800; font-size: clamp(14px, 2.8vw, 19px); color: #5A6B88; }
.d2-tablo-lamp { width: clamp(8px, 1.7vw, 12px); height: clamp(8px, 1.7vw, 12px); border-radius: 50%; background: #6EF29B; box-shadow: 0 0 8px rgba(110,242,155,0.85); animation: d2neon 2.2s ease-in-out infinite; margin-left: clamp(6px, 1.4vw, 10px); }
/* displey-oyna: ichida yuk-o'qish + skanline (ekran bo'lib o'qilsin) */
.d2-tablo-screen { position: relative; border-radius: 10px; background: #F6F0E2; box-shadow: inset 0 0 0 2px #D9CCB2; padding: clamp(10px, 2.2vw, 16px); overflow: hidden; }
.d2-tablo-screen .d2-casssvg { width: clamp(26px, 5.6vw, 40px); }
.d2-tablo-screen .d2-battsvg { width: clamp(10px, 2.2vw, 15px); }
.d2-tablo-screen .g1-anspop-num { color: #1F7A4D; }
.d2-tablo-screen .g1-anspop-eq { color: #5A6B88; }
.d2-tablo-scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(180deg, rgba(58,71,99,0.025) 0 2px, transparent 2px 4px); }
.d2-tablo-scan::after { content: ''; position: absolute; left: 0; right: 0; height: 18%; background: linear-gradient(rgba(143,224,244,0), rgba(143,224,244,0.1), rgba(143,224,244,0)); animation: d2scan 4.5s linear infinite; }
@keyframes d2scan { 0% { top: -20%; } 100% { top: 120%; } }
@media (prefers-reduced-motion: reduce) { .d2-tablo-lamp, .d2-tablo-scan::after { animation: none; } }
/* FactCard s14 javob zonasida — ixcham (bir qator), skrollsiz */
.d2-fact-final { margin-top: clamp(8px, 1.8vw, 12px); padding: clamp(8px, 1.6vw, 12px) clamp(10px, 2vw, 14px); }
.d2-fact-final .g1-factcard-txt { font-size: clamp(13px, 1.8vw, 15px); line-height: 1.36; }
.d2-fact-final .d2-rocket-fact { width: clamp(30px, 6.5vw, 44px); }

/* === v10 — s8 pult-tugmalari: predmet-ikonkali, rangli (kasseta=moviy, batareya=amber) === */
.d2-conbtn { display: inline-flex; align-items: center; gap: clamp(7px, 1.6vw, 11px); border: none; border-radius: 14px; cursor: pointer; padding: clamp(10px, 2vw, 14px) clamp(13px, 2.6vw, 20px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #1F2430; transition: transform 0.15s, box-shadow 0.2s, filter 0.2s; }
.d2-conbtn-ic { width: clamp(20px, 4.4vw, 30px); height: auto; display: inline-block; }
.d2-conbtn-icb { width: clamp(13px, 2.8vw, 19px); height: auto; display: inline-block; }
.d2-conbtn-lbl { line-height: 1; }
.d2-conbtn-cass { background: #FFFFFF; box-shadow: inset 0 0 0 2px #2AA9D0, 0 6px 16px -6px rgba(58,53,48,0.2); }
.d2-conbtn-batt { background: #FFFFFF; box-shadow: inset 0 0 0 2px #F0A81E, 0 6px 16px -6px rgba(58,53,48,0.2); }
.d2-conbtn:hover:not(:disabled) { transform: translateY(-2px); }
.d2-conbtn-cass:active:not(:disabled) { box-shadow: inset 0 0 0 2px #2AA9D0, 0 0 16px -4px rgba(42,169,208,0.55); }
.d2-conbtn-batt:active:not(:disabled) { box-shadow: inset 0 0 0 2px #F0A81E, 0 0 16px -4px rgba(240,168,30,0.55); }
.d2-conbtn:disabled { opacity: 0.38; cursor: default; filter: saturate(0.5); }
/* minus — mos rangli kichik dumaloq */
.d2-conbtn-minus { width: clamp(34px, 7vw, 44px); border: none; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: clamp(18px, 3.6vw, 24px); line-height: 1; color: #5A6B88; background: #FFFFFF; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.18); transition: transform 0.15s, box-shadow 0.2s; }
.d2-conbtn-minus-c { box-shadow: inset 0 0 0 1.5px rgba(42,169,208,0.5), 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-conbtn-minus-b { box-shadow: inset 0 0 0 1.5px rgba(240,168,30,0.55), 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-conbtn-minus:hover:not(:disabled) { transform: translateY(-2px); }
.d2-conbtn-minus:disabled { opacity: 0.35; cursor: default; }
/* Tekshirish — konsol GO-tugmasi (manba-tugmalardan aniq farqli, yashil) */
.d2-gobtn { border: none; border-radius: 99px; cursor: pointer; padding: clamp(11px, 2.2vw, 15px) clamp(26px, 5vw, 40px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px, 2.2vw, 18px); letter-spacing: 0.04em; color: #0B2A1A; background: linear-gradient(#8FF7B6, #5BE08E); box-shadow: inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 3px rgba(255,255,255,0.5), 0 8px 20px -6px rgba(110,242,155,0.65); transition: transform 0.15s, box-shadow 0.2s; }
.d2-gobtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 26px -6px rgba(110,242,155,0.8); }
.d2-gobtn:disabled { opacity: 0.4; cursor: not-allowed; filter: saturate(0.4); }

/* === v8 — «UCHISHGA TAYYORLIK» missiya-shkalasi (dars-ichi, INFRA'дан tashqarida) === */
/* O'ng gutterда ixcham vertikal quvvat-shkala; markazда vertikal (nav/audio/javob bilan urishmaydi).
   pointer-events yo'q; skroll qo'shmaydi; Stage progress-baridan FARQLI (thematik). */
.d2-gauge { position: absolute; right: clamp(1px, 0.6vw, 8px); top: 50%; transform: translateY(-50%); z-index: 6; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 8px; height: clamp(210px, 58vh, 370px); }
.d2-gauge-label { writing-mode: vertical-rl; text-orientation: mixed; font-size: clamp(9px, 1.4vw, 12px); letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: #5A6B88; opacity: 0.85; }
.d2-gauge-track { position: relative; flex: 1; width: clamp(6px, 1.3vw, 9px); border-radius: 99px; background: #E0D7C4; box-shadow: inset 0 0 0 1px #D0C4AB; overflow: visible; }
.d2-gauge-fill { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 99px; background: linear-gradient(180deg, #6EF29B, #2FA0CC); box-shadow: 0 0 8px rgba(110,242,155,0.55); transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.d2-gauge-rocket { position: absolute; left: 50%; transform: translate(-50%, 50%); width: clamp(22px, 4.6vw, 34px); transition: bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.d2-gauge-rocket .d2-rocketsvg { width: 100%; filter: drop-shadow(0 2px 4px rgba(16,24,44,0.5)); }
/* C — yo'l xaritasi: vertikal marshrut (Yer past → Bit uyi tepa), planeta-nuqtalar */
.d2-jroute { position: relative; flex: 1; width: clamp(30px, 6.4vw, 44px); }
.d2-jroute::before { content: ''; position: absolute; left: 50%; top: 12px; bottom: 10px; width: 3px; transform: translateX(-50%); background: #D0C4AB; border-radius: 2px; }
.d2-jplanet { position: absolute; left: 50%; transform: translate(-50%, 50%); width: clamp(17px, 3.8vw, 24px); line-height: 0; filter: drop-shadow(0 1px 2px rgba(58,53,48,0.34)); }
.d2-jplanet svg { width: 100%; height: auto; display: block; overflow: visible; }
.d2-jplanet-cur { width: clamp(22px, 4.8vw, 30px); filter: drop-shadow(0 0 7px rgba(80,155,215,0.9)) drop-shadow(0 1px 2px rgba(58,53,48,0.34)); }
.d2-jhome { position: absolute; left: 50%; top: -10px; transform: translateX(-50%); font-size: clamp(17px, 3.4vw, 24px); line-height: 1; }
/* juda tor ekranда (mobil zoom-qatlam <=640) yozuv olib tashlanadi — faqat shkala + raketa */
@media (max-width: 639.98px) { .d2-gauge { height: clamp(180px, 46vh, 280px); } .d2-gauge-label { display: none; } }
@media (prefers-reduced-motion: reduce) { .d2-gauge-fill, .d2-gauge-rocket { transition: none; } }

/* ============================================================ */
/* LUMO (grade3 Dars01) — chiroq/lenta/panel, shahar, razryad-mat */
/* ============================================================ */
.lm-bignum { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(30px, 7vw, 48px); color: #3A3530; letter-spacing: 1px; }
.lm-bignum-accent { color: #ff4f28; }

.lm-motes { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.lm-mote { position: absolute; left: calc(6% + var(--i, 0) * 11%); bottom: -12px; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #FFF2C6, #FF8A22); opacity: 0.68; animation: lm-mote-rise 14s linear infinite; }
.lm-mote:nth-child(2n) { left: 18%; } .lm-mote:nth-child(3n) { left: 74%; } .lm-mote:nth-child(4n) { left: 44%; } .lm-mote:nth-child(5n) { left: 88%; }
@keyframes lm-mote-rise { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 0.5; } 100% { transform: translateY(-102vh); opacity: 0; } }

.lm-chiroq { width: clamp(15px, 3vw, 20px); height: auto; display: block; }
.lm-lenta { width: clamp(74px, 15vw, 96px); height: auto; display: block; }
.lm-panel { width: clamp(58px, 12vw, 80px); height: auto; display: block; }
.lm-panel-big { width: clamp(74px, 18vw, 104px); }

.lm-pv { display: flex; align-items: flex-end; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; position: relative; padding: 6px; }
.lm-pv-sm { transform: scale(0.9); }
.lm-pv-grp { display: inline-flex; align-items: flex-end; gap: 4px; flex-wrap: wrap; max-width: 210px; }
.lm-pv-ones { max-width: 130px; }
.lm-pv-item { display: inline-flex; }
.lm-pv-empty { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px, 6vw, 40px); font-weight: 800; color: #B8B2A8; }

.lm-mat { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1.6vw, 12px); width: 100%; max-width: 460px; }
.lm-mat-col { display: flex; flex-direction: column; align-items: center; gap: 6px; border-radius: 14px; padding: clamp(6px, 1.4vw, 10px) 4px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); transition: box-shadow 0.25s, background 0.25s; }
.lm-mat-emph { background: #FFF3E9; box-shadow: 0 4px 14px -6px rgba(255,79,40,0.45), inset 0 0 0 1.5px rgba(255,79,40,0.5); }
.lm-mat-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-mat-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; min-height: 40px; justify-content: flex-end; }
.lm-mat-stack { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.lm-mat-zero { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 24px); font-weight: 800; color: #C4BEB4; }
.lm-mat-digit { font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 32px); font-weight: 800; color: #3A3530; }
.lm-mat-digit-btn { border: none; background: #FFFFFF; border-radius: 10px; padding: 4px 12px; cursor: pointer; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.3); transition: transform 0.12s, box-shadow 0.2s; }
.lm-mat-digit-btn:hover { transform: translateY(-1px); }
.lm-mat-digit-ok { background: #E9F7EE; color: #1F7A4D; box-shadow: 0 4px 12px -4px rgba(31,122,77,0.5); }
.lm-mat-panel { width: clamp(40px, 9vw, 56px); }
.lm-mat-lenta { width: clamp(52px, 11vw, 72px); }
.lm-mat-chiroq { width: clamp(13px, 2.6vw, 17px); }

.lm-scene { position: relative; width: 100%; aspect-ratio: 400 / 210; border-radius: 14px; overflow: hidden; }
.lm-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.lm-scene-cast { position: absolute; left: 0; right: 0; bottom: 2%; display: flex; align-items: flex-end; justify-content: center; gap: clamp(1px, 0.8vw, 8px); z-index: 2; padding: 0 3%; }
.lm-crew { display: inline-flex; align-items: flex-end; }
.lm-crew-kid { height: clamp(72px, 17vw, 122px); }
.lm-crew-kid .g1-char { height: 100%; width: auto; display: block; }
.lm-crew-host { width: clamp(42px, 10vw, 66px); margin: 0 clamp(2px, 1vw, 8px); }
.lm-crew-host .g1-cast-fig { width: 100%; height: auto; }
.lm-cstar { animation: lm-tw 3.4s ease-in-out infinite; }
@keyframes lm-tw { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.lm-cwin { animation: lm-flick 4s ease-in-out infinite; }
@keyframes lm-flick { 0%, 100% { opacity: 0.68; } 50% { opacity: 1; } }
.lm-glow { animation: lm-glow-a 2.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes lm-glow-a { 0%, 100% { opacity: 0.72; } 50% { opacity: 1; } }
.lm-float { animation: lm-float-a 5.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes lm-float-a { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(8deg); } }
.lm-fly { animation: lm-fly-a 7s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes lm-fly-a { 0% { transform: translate(0, 0); } 25% { transform: translate(10px, -4px); } 50% { transform: translate(20px, 2px); } 75% { transform: translate(10px, -3px); } 100% { transform: translate(0, 0); } }
/* Video-uslub silliq ochilish (sekin fade + siljish, ovozga sinxron bosqichma-bosqich) */
.lm-reveal { animation: lm-reveal-a 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.lm-write { display: inline-block; animation: lm-reveal-a 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes lm-reveal-a { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
.lm-d1 { animation-delay: 0.28s; } .lm-d2 { animation-delay: 0.56s; } .lm-d3 { animation-delay: 0.84s; }
/* raqam yuqoridan sakrab tushadi (video-harakat) */
.lm-drop { display: inline-block; animation: lm-drop-a 0.62s cubic-bezier(0.34, 1.5, 0.5, 1) both; }
@keyframes lm-drop-a { 0% { opacity: 0; transform: translateY(-32px) scale(0.8); } 60% { opacity: 1; } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.lm-fadein { display: inline-block; animation: lm-fadein-a 0.4s ease both; }
@keyframes lm-fadein-a { 0% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .lm-reveal, .lm-write, .lm-drop, .lm-fadein { animation: none; } }
.lm-nl-cue { position: absolute; top: 50%; transform: translateX(-50%); z-index: 3; pointer-events: none; display: flex; flex-direction: column; align-items: center; }
.lm-nl-ring { width: 16px; height: 16px; border-radius: 50%; border: 2.5px solid #F0A81E; margin-bottom: 4px; animation: lm-nl-ring-a 1.4s ease-out infinite; }
@keyframes lm-nl-ring-a { 0% { transform: scale(0.7); opacity: 0.9; } 70% { transform: scale(1.5); opacity: 0; } 100% { opacity: 0; } }
.lm-nl-finger { font-size: clamp(20px, 5vw, 28px); line-height: 1; animation: lm-nl-finger-a 1.3s ease-in-out infinite; }
@keyframes lm-nl-finger-a { 0%, 100% { transform: translateY(3px); } 50% { transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { .lm-cstar, .lm-cwin, .lm-glow, .lm-float, .lm-fly, .lm-nl-ring, .lm-nl-finger { animation: none; } }

.lm-field { position: relative; width: 100%; aspect-ratio: 400 / 250; border-radius: 12px; overflow: hidden; }
.lm-flenta { position: absolute; width: clamp(60px, 13vw, 88px); border: none; background: transparent; padding: 0; cursor: pointer; transform: rotate(var(--r, 0deg)); animation: lm-fl-in 0.5s both; z-index: 2; transition: transform 0.15s; }
.lm-flenta:hover { transform: rotate(var(--r, 0deg)) scale(1.06); }
@keyframes lm-fl-in { from { opacity: 0; transform: rotate(var(--r,0deg)) scale(0.6); } to { opacity: 1; } }
.lm-panelzone { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(20,14,34,0.55); border-radius: 14px; padding: 10px 14px; z-index: 3; }
.lm-panelzone-tied { box-shadow: 0 0 24px -4px rgba(255,184,77,0.7); }
.lm-slotgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px; }
.lm-slot { width: clamp(30px, 6vw, 44px); height: clamp(8px, 1.8vw, 11px); border-radius: 4px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; }
.lm-slot-full { background: transparent; }
.lm-lenta-slot { width: clamp(30px, 6vw, 44px); }
.lm-count { font-size: clamp(12px, 2.2vw, 15px); font-weight: 800; color: #FFE7B0; }
.lm-count-ok { color: #6EF29B; }
.lm-bob { animation: lm-bob-a 2.4s ease-in-out infinite; }
@keyframes lm-bob-a { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

.lm-srcrow { display: flex; gap: clamp(8px, 2vw, 14px); flex-wrap: wrap; justify-content: center; }
.lm-srcbtn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: clamp(8px, 1.6vw, 12px) clamp(10px, 2vw, 16px); font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); }
.lm-src-wait { opacity: 0.45; }
.lm-src-ico { width: clamp(26px, 5.5vw, 38px); height: auto; }
.lm-ctrl { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.lm-ctrl-ico { width: clamp(26px, 5.5vw, 38px); display: inline-flex; }
.lm-ctrl-btn { width: clamp(30px, 6vw, 38px); height: clamp(30px, 6vw, 38px); border: none; border-radius: 10px; background: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #ff4f28; cursor: pointer; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.3); }
.lm-ctrl-btn:disabled { opacity: 0.35; cursor: default; }
.lm-eq { color: #3A3530; }

/* Missiya-karta (s0/s15) — dars maqsadi */
.lm-mission { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); background: #FFF6DC; border: 1.5px solid #E8CB7A; border-radius: 12px; padding: clamp(8px, 1.8vw, 12px) clamp(12px, 2.4vw, 18px); font-weight: 700; color: #5A5A60; font-size: clamp(12px, 1.7vw, 15px); }
.lm-mission-ico { font-size: clamp(18px, 3vw, 24px); line-height: 1; }
/* Savol-slayd fon-animatsiyasi: shahar chiroq-uchqunlari frame ichida ko'tarilib porlaydi */
.lm-fx { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; z-index: 0; }
.lm-fx i { position: absolute; bottom: -8px; width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle at 38% 32%, #FFF6D2, #FFC63F 60%, rgba(255,138,30,0)); opacity: 0; animation: lm-fx-rise 7s linear infinite; }
.lm-fx i:nth-child(1) { left: 8%; animation-delay: 0s; }
.lm-fx i:nth-child(2) { left: 24%; animation-delay: 2.4s; animation-duration: 8.5s; }
.lm-fx i:nth-child(3) { left: 55%; animation-delay: 1.2s; animation-duration: 7.6s; }
.lm-fx i:nth-child(4) { left: 76%; animation-delay: 3.6s; }
.lm-fx i:nth-child(5) { left: 91%; animation-delay: 0.8s; animation-duration: 9s; }
@keyframes lm-fx-rise { 0% { transform: translateY(0) scale(0.7); opacity: 0; } 12% { opacity: 0.55; } 55% { opacity: 0.4; } 100% { transform: translateY(-160px) scale(1.1); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .lm-fx i { animation: none; } }
/* Hisob-karta (sCASE) — qog'oz-hisobot ko'rinishi */
.lm-report { display: flex; flex-direction: column; gap: clamp(5px, 1.2vw, 8px); background: #FFFDF8; border: 1.5px solid #E4D9C4; border-top: 6px solid #FF4F28; border-radius: 12px; padding: clamp(10px, 2vw, 16px) clamp(16px, 3.4vw, 26px); box-shadow: 0 6px 16px -8px rgba(58,53,48,0.25); }
.lm-report-head { text-transform: uppercase; letter-spacing: 2px; font-size: clamp(10px, 1.4vw, 12px); font-weight: 800; color: #A7A6A2; text-align: center; }
.lm-report-cols { display: flex; gap: clamp(14px, 3.4vw, 28px); justify-content: center; }
.lm-report-col { display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 7px); }
.lm-report-n { width: clamp(36px, 8vw, 48px); height: clamp(36px, 8vw, 48px); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: clamp(19px, 3.6vw, 25px); font-weight: 800; }
.lm-report-lbl { font-weight: 700; color: #5A5A60; font-size: clamp(11px, 1.6vw, 14px); }
.lm-digrow { display: flex; gap: clamp(6px, 1.6vw, 12px); perspective: 500px; }
.lm-cardflip { animation: lm-cardflip-a 0.55s cubic-bezier(0.3, 0.9, 0.4, 1) both; transform-origin: center; backface-visibility: hidden; }
@keyframes lm-cardflip-a { 0% { transform: rotateY(-90deg); opacity: 0; } 55% { opacity: 1; } 100% { transform: rotateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .lm-cardflip { animation: none; } }
.lm-digcard { width: clamp(38px, 8vw, 54px); height: clamp(48px, 10vw, 68px); display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #FBF7F0; font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #3A3530; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.08); }
.lm-digcard-hot { background: #FFF3E9; color: #ff4f28; box-shadow: 0 4px 14px -6px rgba(255,79,40,0.5); }
/* Raqam o'z rangini olib yuradi — o'rin almashganda kuzatish oson (3 qizil, 4 yashil, 5 ko'k) */
.lm-dig-3 { background: #FBE9E7; color: #C0392B; box-shadow: 0 4px 12px -6px rgba(192,57,43,0.45); }
.lm-dig-4 { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 4px 12px -6px rgba(31,122,77,0.45); }
.lm-dig-5 { background: #E3F2F8; color: #019ACB; box-shadow: 0 4px 12px -6px rgba(1,154,203,0.45); }

.lm-nl { position: relative; height: 64px; margin: 0 10px; cursor: pointer; }
.lm-nl-line { position: absolute; left: 0; right: 0; top: 28px; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #F2A65A, #ff4f28); }
.lm-nl-tick { position: absolute; top: 20px; width: 2px; height: 20px; background: rgba(58,53,48,0.35); transform: translateX(-1px); }
.lm-nl-lbl { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 700; color: #8A8378; }
.lm-nl-mark { position: absolute; top: 6px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
.lm-nl-mark::after { content: ''; width: 3px; height: 34px; background: currentColor; }
.lm-nl-target { color: #1F7A4D; }
.lm-nl-guess { color: #D64545; }
.lm-nl-flag { font-size: 12px; font-weight: 800; margin-bottom: 2px; }

.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: 54px; align-items: center; }
.lm-digtray-empty { font-size: 22px; font-weight: 800; color: #C4BEB4; letter-spacing: 2px; }
.lm-digchip { width: clamp(42px, 9vw, 56px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; cursor: pointer; box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #ff4f28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bins { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none; border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #F1EDE5; }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.lm-bin-slot { width: clamp(36px, 8vw, 50px); height: clamp(40px, 9vw, 56px); display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }

.lm-figwrap { display: flex; justify-content: center; padding: 6px 0; }
.lm-cmprow { display: flex; align-items: center; justify-content: center; gap: clamp(12px, 3vw, 24px); }
.lm-cmpcell { padding: clamp(8px, 2vw, 14px) clamp(14px, 3vw, 22px); border-radius: 14px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); }
.lm-cmpvs { font-size: clamp(20px, 4vw, 28px); font-weight: 800; color: #8A8378; }
.lm-cmpslot { font-size: clamp(30px, 8vw, 46px); font-weight: 800; color: #A7A6A2; min-width: clamp(38px, 10vw, 58px); text-align: center; line-height: 1; }
.lm-sign-in { display: inline-block; color: #FF4F28; animation: lm-sign-a 0.6s cubic-bezier(0.34, 1.6, 0.5, 1) both; }
@keyframes lm-sign-a { 0% { opacity: 0; transform: scale(0.2) rotate(-14deg); } 60% { opacity: 1; } 100% { opacity: 1; transform: scale(1) rotate(0); } }
.lm-cmp-big { animation: lm-cmp-big-a 0.7s ease both; border-radius: 14px; }
@keyframes lm-cmp-big-a { 0% { transform: scale(1); } 45% { transform: scale(1.14); box-shadow: 0 0 0 3px rgba(31,122,77,0.4), inset 0 0 0 1px rgba(58,53,48,0.07); } 100% { transform: scale(1.07); box-shadow: 0 0 0 2px rgba(31,122,77,0.35), inset 0 0 0 1px rgba(58,53,48,0.07); } }
.lm-signrow { display: flex; gap: clamp(10px, 3vw, 20px); justify-content: center; }
.lm-signbtn { width: clamp(52px, 14vw, 68px); height: clamp(52px, 14vw, 68px); border-radius: 16px; border: 2.5px solid #A7A6A2; background: #FFFFFF; font-size: clamp(26px, 7vw, 34px); font-weight: 800; color: #0E0E10; cursor: pointer; transition: transform 0.15s, border-color 0.15s; }
.lm-signbtn:hover:not(:disabled) { border-color: #FF4F28; transform: translateY(-2px); }
.lm-signbtn:disabled { cursor: default; }
.lm-signbtn-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; }
.lm-signbtn-wrong { border-color: #C0392B; background: #FBE9E7; opacity: 0.55; }
@media (prefers-reduced-motion: reduce) { .lm-sign-in, .lm-cmp-big { animation: none; } }

.lm-conn { display: flex; flex-direction: column; gap: 8px; }
.lm-conn-row { display: flex; gap: 10px; align-items: baseline; font-size: clamp(13px, 1.8vw, 15px); color: #5A554E; }
.lm-conn-lbl { font-size: 11px; font-weight: 800; color: #ff4f28; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }

.lm-meter { position: fixed; right: 8px; top: 50%; transform: translateY(-50%); z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; }
.lm-meter-label { font-size: 9px; font-weight: 800; color: #8A8378; writing-mode: vertical-rl; text-transform: uppercase; letter-spacing: 1px; }
.lm-meter-track { position: relative; width: 8px; height: clamp(150px, 34vh, 240px); border-radius: 6px; background: rgba(58,53,48,0.12); overflow: visible; }
.lm-meter-fill { position: absolute; left: 0; bottom: 0; width: 100%; border-radius: 6px; background: linear-gradient(0deg, #ff4f28, #F2A65A); transition: height 0.5s ease; box-shadow: 0 0 8px -1px rgba(255,79,40,0.6); }
.lm-meter-dot { position: absolute; left: 50%; transform: translate(-50%, 50%); width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 2px #FBF7F0; }
.lm-meter-dot-cur { width: 14px; height: 14px; box-shadow: 0 0 0 2px #FBF7F0, 0 0 10px -1px rgba(255,79,40,0.8); }
@media (max-width: 639.98px) { .lm-meter-label { display: none; } }

/* FaktCard + Qoida-card (grade3 lokal, d2- nomlari bilan mos) */
.d2-factcard { display: flex; flex-direction: column; gap: 6px; background: #14203C; border-radius: 14px; padding: clamp(12px, 2.4vw, 18px); }
.d2-factcard-badge { align-self: flex-start; background: rgba(255,184,77,0.2); color: #FFC23C; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-factcard-txt { margin: 0; color: #EAF0F8; font-size: clamp(14px, 1.9vw, 16px); line-height: 1.5; }
.d2-rulecard { display: flex; flex-direction: column; gap: 8px; background: #FFF3E9; border-radius: 16px; padding: clamp(12px, 2.4vw, 18px); box-shadow: 0 6px 20px -10px rgba(255,79,40,0.4); }
.d2-rulecard-badge { align-self: flex-start; background: #ff4f28; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-rulecard-txt { margin: 0; color: #3A3530; font-weight: 700; font-size: clamp(15px, 2.1vw, 18px); line-height: 1.45; }
/* Aksent savol (QOIDA — javob oldindan berilmasin). */
.lm-q-accent { align-self: center; background: #FFF3E9; color: #C0392B; border: 1.5px solid rgba(255,79,40,0.4); border-radius: 14px; padding: clamp(10px,2vw,14px) clamp(16px,3vw,24px); font-family: 'Fraunces', Georgia, serif; font-weight: 700; font-size: clamp(16px,2.6vw,20px); text-align: center; }
`;
