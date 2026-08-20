// 4-sinf nazariy darslarining umumiy ish qatlami: til, ovoz, javob gate'i,
// javoblar hisobi va dars ildizi. Ilgari bularning hammasi har bir DarsNN.jsx
// ichida nusxa turardi — bitta xatoni 50 joyda tuzatishga to'g'ri kelardi
// (CLAUDE.md §5). Endi dars faqat kontent va ekran tarkibini beradi.
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';

export const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
export const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
export const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');

// ---------------------------------------------------------------------------
// Kontekstlar
// ---------------------------------------------------------------------------
export const LangContext = createContext('uz');
export const ActivityContext = createContext({ activityState: {}, markActivity: () => {} });
// Dars haqidagi ma'lumot: meta, kontent, kadr sonlari. Stage va useNarration
// shu yerdan oladi, shuning uchun ular darsga bog'lanib qolmaydi.
export const LessonContext = createContext(null);

export const useLang = () => useContext(LangContext);
export const useLesson = () => useContext(LessonContext);

export const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.uz ?? '';
  }, [lang]);
};

// ---------------------------------------------------------------------------
// Ish vaqti sozlamalari (TTS bazasi, ovoz, sfx)
// ---------------------------------------------------------------------------
let runtimeConfig = {
  ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false,
};
export const configureTheoryRuntime = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };

export function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

// ---------------------------------------------------------------------------
// Ovoz: production'da HTTP TTS (MIGRATION_v5_2_math.md), previewda Web Speech
// ---------------------------------------------------------------------------
const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

class AudioEngine {
  constructor() {
    this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null;
    this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null;
  }

  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }

  setLang(lang) { this.lang = lang; }

  stop() {
    if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null; this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null; this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* preview only */ }
    }
  }

  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }

  start() { this.play(); }

  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? 900);
  }

  play() {
    const item = this.queue[this.index];
    if (!item) {
      this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase });
      return;
    }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item, 900);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => {
            try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 900); }
          }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 900);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play()
      .then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false }))
      .catch(() => this.timed(item, 900));
  }

  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }

  pushOneOff(text) { this.load([{ id: `feedback-${this.index}-${this.queue.length}`, text }]); this.start(); }
}

let audioEngineInstance = null;
export const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

export function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({
    muted: audioEngineInstance?.muted ?? false,
    completed: false,
    currentSegment: null,
    visualOnly: !runtimeConfig.ttsApiBase,
  });
  /* eslint-disable react-hooks/refs -- stable audio queue */
  const segmentsRef = useRef(segments);
  const segmentsKey = JSON.stringify(segments || []);
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

// Ekran hikoyasi: audio segmentlari va ular bilan bog'langan kadr raqami.
export function useNarration(value, screen) {
  const lang = useLang();
  const lesson = useLesson();
  const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => {
    const source = value?.intro ?? value;
    const texts = source?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts])
      .filter(Boolean)
      .map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const finalFrame = Math.max(0, (lesson?.frameCounts?.[screen] ?? segments.length) - 1);
  const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true;
  const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
}

// Javob gate'i: ovoz yoqilgan bo'lsa ko'rsatma tugamaguncha javob bloklanadi
// (ETALON_4SINF.md §13). 12 sekundlik zaxira — TTS uzilib qolsa bola ekranda
// qulflanib qolmasligi uchun. visualOnly ataylab hisobga olinmaydi: previewda
// HTTP TTS bo'lmasa ham Web Speech ko'rsatma o'qiydi.
export function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);
  return audio.muted || audio.completed || timedOut;
}

export const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};

// ---------------------------------------------------------------------------
// Javob variantlari tartibi: barqaror, lekin har bir mashqda boshqa o'rinda
// ---------------------------------------------------------------------------
const stableChoiceOffset = (lessonId, length) => {
  const input = `${lessonId}:${length}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

export const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

