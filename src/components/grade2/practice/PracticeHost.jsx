// PracticeHost (2-sinf) — LOKAL PREVIEW uchun platforma host'ini taqlid qiluvchi qobiq.
// Maqsad: jsx-question kontraktidagi props'ni (onReady, registerCheck, onSubmit,
// playCorrect/playWrong) berib, native "Tekshirish" tugmasini chiqarish — shunda
// mashqni local saytda alohida sinab ko'rsa bo'ladi.
// 2-sinf (7–8 yosh): kattaroq shrift, kattaroq tegish maydonlari (grade1 bilan bir xil).
// Ichida UZ/RU almashtirgich bor.
// OVOZ (v-audio): oddiy dars kabi gapiradi. Har topshiriqning `Question.audio[lang]`
//   statik maydoni ({ intro, on_correct, on_wrong }, TTS-toza) o'qiladi:
//   ochilganda intro, javobda maqtov/maslahat. Preview — Web Speech (prototip ovoz);
//   platformada window.__PRACTICE_TTS_BASE__ berilsa HTTP TTS (v5.2). Karnay + mute tugmalari.
// Grade1/Grade5 practice/PracticeHost bilan bir xil kontrakt.

import React, { useState, useRef, useCallback, useEffect } from 'react';

const IconOk = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconRetry = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>);
const IconSpeaker = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>);
const IconMuted = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>);

// preview "to'g'ri/noto'g'ri" signal — qisqa beep (ovoz/narratsiya emas)
function beep(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = ok ? 880 : 220;
    g.gain.value = 0.06;
    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch (e) { /* preview-only */ }
}

// ===== OVOZ (narratsiya) =====
// Platformada real TTS: window.__PRACTICE_TTS_BASE__ berilsa {base}/api/tts?text=..&g=f (v5.2).
// Bo'lmasa (artifacts/local preview) — brauzer Web Speech (prototip, "korявый" ovoz).
// speechSynthesis faqat preview'da; boевой vetkada HTTP-audio (platform_contract §4).
const ttsBase = () => (typeof window !== 'undefined' && window.__PRACTICE_TTS_BASE__) || '';
let _audioEl = null;
function stopNarration() {
  try { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  try { if (_audioEl) { _audioEl.pause(); _audioEl.onended = null; } } catch (e) {}
}
function speak(text, lang, gender = 'f') {
  if (!text || typeof window === 'undefined') return;
  stopNarration();
  const base = ttsBase();
  if (base) {                                   // BOEVOY: HTTP TTS
    try {
      const enc = encodeURIComponent(String(text).slice(0, 1000));
      const el = _audioEl || (_audioEl = new Audio());
      el.src = `${base}/api/tts?text=${enc}&g=${gender === 'f' ? 'f' : 'm'}`;
      const p = el.play(); if (p && p.catch) p.catch(() => {});
    } catch (e) { /* no-op */ }
    return;
  }
  if (!window.speechSynthesis) return;          // PREVIEW: Web Speech
  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
  u.rate = 0.95; u.pitch = 1.0;
  setTimeout(() => { try { window.speechSynthesis.speak(u); } catch (e) {} }, 40);
}

const UI = {
  uz: { check: 'Tekshirish', retry: 'Qayta urinish', correct: "Barakalla!", wrong: 'Maslahat', listen: 'Tinglash', mute: 'Ovozni o‘chirish' },
  ru: { check: 'Проверить', retry: 'Заново', correct: 'Молодец!', wrong: 'Подсказка', listen: 'Прослушать', mute: 'Выключить звук' },
};

export default function PracticeHost({ Question, lang: langProp = 'uz', title }) {
  const [lang, setLang] = useState(langProp);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [qKey, setQKey] = useState(0);
  const [muted, setMuted] = useState(false);
  const checkFnRef = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const ui = UI[lang] || UI.uz;
  const aud = (Question && Question.audio && Question.audio[lang]) || null;

  const onReady = useCallback((v) => setReady(!!v), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((res) => {
    const r = res || { correct: false };
    setResult(r);
    // javob-reaksiya ovozi (beep'dan keyin)
    const a = (Question && Question.audio && Question.audio[lang]) || null;
    if (a && !mutedRef.current) {
      const line = r.correct ? a.on_correct : a.on_wrong;
      if (line) setTimeout(() => { if (!mutedRef.current) speak(line, lang); }, 400);
    }
  }, [Question, lang]);
  const playCorrect = useCallback(() => beep(true), []);
  const playWrong = useCallback(() => beep(false), []);

  const reset = useCallback(() => {
    stopNarration();
    setResult(null); setReady(false); checkFnRef.current = null;
    setQKey((k) => k + 1);
  }, []);

  // til almashganda mashqni tozalab qayta yuklash
  useEffect(() => { reset(); }, [lang, reset]);

  // topshiriq ochilganda intro'ni o'qish (unmute bo'lsa)
  useEffect(() => {
    stopNarration();
    if (muted || !aud || !aud.intro) return;
    const id = setTimeout(() => { if (!mutedRef.current) speak(aud.intro, lang); }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qKey, lang, muted, aud && aud.intro]);

  // komponent tark etilganda ovozni to'xtatish
  useEffect(() => () => stopNarration(), []);

  const runCheck = () => { checkFnRef.current && checkFnRef.current(); };
  const replay = () => { if (aud && aud.intro) { setMuted(false); speak(aud.intro, lang); } };
  const toggleMute = () => { setMuted((m) => { const nm = !m; if (nm) stopNarration(); return nm; }); };

  const chip = (active) => ({
    padding: '6px 13px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
  });
  const iconBtn = (active) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 34,
    borderRadius: 10, cursor: 'pointer', border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#eef4ff' : '#fff', color: active ? '#2563eb' : '#6b7280',
  });
  const btnBase = { padding: '15px 24px', fontSize: 18, fontWeight: 800, borderRadius: 16, fontFamily: "'Manrope', system-ui, sans-serif" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '78vh', maxWidth: 700, margin: '0 auto', width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderBottom: '1px solid #eef0f4', fontFamily: "'Manrope', system-ui, sans-serif",
      }}>
        <strong style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>{title || ''}</strong>
        {aud && (
          <button type="button" title={ui.listen} aria-label={ui.listen} style={iconBtn(false)} onClick={replay}><IconSpeaker /></button>
        )}
        {aud && (
          <button type="button" title={ui.mute} aria-label={ui.mute} style={iconBtn(muted)} onClick={toggleMute}>{muted ? <IconMuted /> : <IconSpeaker />}</button>
        )}
        <button type="button" style={chip(lang === 'uz')} onClick={() => setLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => setLang('ru')}>RU</button>
      </div>

      <div style={{ flex: 1, padding: '14px 12px 96px' }}>
        <Question
          key={qKey + '-' + lang}
          lang={lang}
          mode="answer"
          initialAnswer={null}
          onReady={onReady}
          registerCheck={registerCheck}
          onSubmit={onSubmit}
          playCorrect={playCorrect}
          playWrong={playWrong}
          studentName="O'quvchi"
        />
      </div>

      <div style={{
        position: 'sticky', bottom: 0, padding: '12px', background: 'linear-gradient(rgba(255,255,255,0),#fff 28%)',
        display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center',
      }}>
        {result && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, color: result.correct ? '#1a7f43' : '#c0392b' }}>
            {result.correct ? <IconOk /> : <IconNo />}
            {result.correct ? ui.correct : ui.wrong}
          </div>
        )}
        {!result ? (
          <button type="button" disabled={!ready} onClick={runCheck}
            style={{ ...btnBase, minWidth: 210, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', color: '#fff', background: ready ? '#2563eb' : '#c2c8d2' }}>
            {ui.check}
          </button>
        ) : (
          <button type="button" onClick={reset}
            style={{ ...btnBase, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #d6dae3', background: '#fff', color: '#374151', cursor: 'pointer' }}>
            <IconRetry /> {ui.retry}
          </button>
        )}
      </div>
    </div>
  );
}
