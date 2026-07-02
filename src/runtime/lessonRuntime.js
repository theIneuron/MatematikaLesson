// ============================================================================
// @lesson/runtime — PREVIEW shim (local dev server only).
//
// Bu modul faqat LOKAL PREVIEW uchun. Platformada (production) bu hooklarni
// lesson-runner beradi (ElevenLabs TTS, real SFX URL, AI grading endpoint,
// asset manifest). Bu yerda ular brauzer imkoniyatlari bilan taqlid qilinadi:
//   - useAudio  -> Web Speech API (preview-standin, "korawka" ovoz)
//   - useSfx    -> WebAudio bip tovushlari
//   - useGrader -> mock (endpoint yo'q; ijobiy javob qaytaradi)
//   - useAssets -> bo'sh manifest (SVG-only darslar uchun yetarli)
//
// Audio-engine Dars01 (etalon) ning isbotlangan preview-tarmog'idan olingan:
// singleton engine + segment-queue (on_mount / after_previous / on_event,
// waits_for: option_picked | check_pressed | button_click). getAudioEngine()
// ham eksport qilinadi — Dars01 ekranlari pushOneOff'ni shundan chaqiradi.
// Til matndan aniqlanadi (kirill -> ru, lotin -> uz) — TTS serveri ham shunday.
//
// speechSynthesis production kontraktida taqiqlangan; bu yerda faqat preview
// standin sifatida ruxsat.
// ============================================================================
import { useState, useRef, useEffect, useCallback } from 'react';

// ---- audio matnidan til/ohang teglarini olib tashlash ----
function stripAudioTags(s) {
  return typeof s === 'string'
    ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|language:\s*\w+|end)\]\s*/gi, '')
        .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    : s;
}

// ---- tilni matndan aniqlash: English marker -> en, kirill -> ru, aks holda uz ----
function detectLang(text) {
  const s = String(text || '');
  if (/English pronunciation/.test(s)) return 'en';
  if (/[а-яё]/i.test(s)) return 'ru';
  return 'uz';
}
function speechLang(lang) {
  return lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ';
}

// ============================================================
// AUDIO ENGINE (preview: Web Speech). Dars01 engine bilan bir xil semantika.
// ============================================================
class AudioEngine {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.onStateChange = null;
    this.waitingFor = null;
    this.autoplayBlocked = false; // brauzer jestsiz speak()'ni bloklasa -> true
    this._pending = null;         // hozir boshlanishini kutayotgan segment (watchdog)
  }

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
    this.autoplayBlocked = false;
    this._pending = null;
  }

  playSegment(segment) {
    if (!segment) return;
    if (!segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const clean = stripAudioTags(String(segment.text));
    if (!clean) { setTimeout(() => this.handleSegmentEnd(segment), 0); return; }
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = speechLang(segment.lang || detectLang(segment.text));
    u.rate = 0.95; u.pitch = 1.0;
    u.onstart = () => {
      this._pending = null;
      this.autoplayBlocked = false;
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
    this._pending = segment;
    setTimeout(() => { try { synth.speak(u); } catch (e) { this.handleSegmentEnd(segment); } }, 60);
    // Watchdog: jestsiz sahifada Chrome speak()'ni bloklaydi (onstart yonmaydi).
    // Shu holatni belgilaymiz — birinchi jestda resumeIfBlocked qayta yoqadi.
    setTimeout(() => { if (this._pending === segment && !this.isPlaying) this.autoplayBlocked = true; }, 400);
  }

  // Birinchi foydalanuvchi jesti (bosish/klavish) — bloklangan ovozni qayta yoqadi.
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

  pushOneOff(text) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${this.queue.length}`, text, trigger: 'manual', waits_for: null });
    this.currentIdx = this.queue.length - 1;
    this.playNext();
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this._pending = null;
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
  }
}

let audioEngineInstance = null;
export const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

// ============================================================
// useAudio(segments) — Dars01 bilan bir xil qaytaruv shakli
//   { isPlaying, currentSegment, waitingFor, muted, triggerEvent,
//     triggerInternal, replay, toggleMute, pushOneOff }
// (til LangContextsiz — har segment matnidan aniqlanadi)
// ============================================================
export function useAudio(segments) {
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);

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
    if (!engine) return undefined;
    engineRef.current = engine;
    engine.onStateChange = (s) => setState((prev) => ({ ...prev, ...s }));
    // Autoplay bloklansa (jestsiz yuklash) — birinchi jestda ovoz qayta yoqiladi.
    const resume = () => { if (engineRef.current) engineRef.current.resumeIfBlocked(); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    if (stableSegments && stableSegments.length > 0 && !state.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 300);
      return () => { clearTimeout(timer); cleanupListeners(); engine.stop(); };
    }
    return () => { cleanupListeners(); engine.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableSegments]);

  const triggerEvent = useCallback((type, target) => { if (engineRef.current) engineRef.current.triggerEvent(type, target); }, []);
  const triggerInternal = useCallback((eventName) => { if (engineRef.current) engineRef.current.triggerInternalEvent(eventName); }, []);
  const replay = useCallback(() => { if (engineRef.current) engineRef.current.replay(); }, []);
  const pushOneOff = useCallback((text) => { if (engineRef.current) engineRef.current.pushOneOff(text); }, []);
  const toggleMute = useCallback(() => {
    setState((prev) => {
      const newMuted = !prev.muted;
      if (newMuted && engineRef.current) engineRef.current.stop();
      return { ...prev, muted: newMuted };
    });
  }, []);

  return { ...state, triggerEvent, triggerInternal, replay, toggleMute, pushOneOff };
}

// ============================================================
// useSfx() -> { playCorrect, playWrong } (WebAudio bip)
// ============================================================
let sharedCtx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!sharedCtx) sharedCtx = new AC();
  if (sharedCtx.state === 'suspended') { try { sharedCtx.resume(); } catch (e) {} }
  return sharedCtx;
}
function beep(freqs, dur = 0.18) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    const t0 = now + i * 0.12;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    o.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + 0.2);
  });
}
export function useSfx() {
  const playCorrect = useCallback(() => beep([660, 880]), []);
  const playWrong = useCallback(() => beep([320, 240]), []);
  return { playCorrect, playWrong };
}

// ============================================================
// useGrader() -> async grade(args) (mock; endpoint yo'q)
// ============================================================
export function useGrader() {
  return useCallback(async ({ question, rubric, mode }) => {
    await new Promise((r) => setTimeout(r, 900));
    const ru = /[а-яё]/i.test(`${question || ''} ${rubric || ''}`);
    const feedback = ru
      ? 'Отлично! (preview-режим: ответ засчитан без реальной проверки)'
      : "Zo'r! (preview rejimi: javob real tekshiruvsiz qabul qilindi)";
    return {
      correct: true,
      feedback,
      transcript: mode === 'voice' ? (ru ? '(preview: запись не расшифрована)' : '(preview: yozuv matnga aylantirilmadi)') : undefined,
    };
  }, []);
}

// ============================================================
// useAssets() -> { assets, resolveUrl } (bo'sh manifest)
// ============================================================
export function resolveAssetUrl(asset, base) {
  if (!asset) return null;
  const path = typeof asset === 'string' ? asset : asset.path;
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return base ? `${base.replace(/\/$/, '')}/${path}` : path;
}
export function useAssets() {
  const assets = {};
  const resolveUrl = useCallback(() => null, []);
  return { assets, resolveUrl };
}
