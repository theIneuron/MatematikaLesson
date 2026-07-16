// PracticeHost — LOKAL PREVIEW uchun platforma host'ini taqlid qiluvchi qobiq.
// Maqsad: jsx-question kontraktidagi props'ni (onReady, registerCheck, onSubmit,
// playCorrect/playWrong) berib, native "Tekshirish" tugmasini chiqarish — shunda
// savolni local saytda alohida darslik sifatida sinab ko'rsa bo'ladi.
// Ichida UZ/RU almashtirgich bor. Ozvuchka yo'q (faqat to'g'ri/noto'g'ri beep cue).
// Faqat react importi; ikonkalar — inline SVG.

import React, { useState, useRef, useCallback, useEffect } from 'react';

// usePracticeZoom — amaliyot sahifasi uchun mobil yagona masshtab qatlami
// (MOBIL_DESKTOP_MOSLASH.md, etalon kenglik 390px). <640px: root 390px kenglikda
// joylashadi va real ekranga zoom bilan masshtablanadi; desktop: --pqz=1, tegilmaydi.
export const PQ_MOBILE_W = 390;
export function usePracticeZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / PQ_MOBILE_W : 1;
      root.style.setProperty('--pqz', String(z));
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--pqz');
    };
  }, [breakpoint]);
}

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconRetry = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>);

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

const UI = {
  uz: { check: 'Tekshirish', retry: 'Qayta urinish', correct: "To'g'ri", wrong: 'Maslahat' },
  ru: { check: 'Проверить', retry: 'Заново', correct: 'Верно', wrong: 'Подсказка' },
};

export default function PracticeHost({ Question, lang: langProp = 'uz', title }) {
  const [lang, setLang] = useState(langProp);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [qKey, setQKey] = useState(0);
  const checkFnRef = useRef(null);
  const ui = UI[lang] || UI.uz;

  const onReady = useCallback((v) => setReady(!!v), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((res) => setResult(res || { correct: false }), []);
  const playCorrect = useCallback(() => beep(true), []);
  const playWrong = useCallback(() => beep(false), []);

  const reset = useCallback(() => {
    setResult(null); setReady(false); checkFnRef.current = null;
    setQKey((k) => k + 1);
  }, []);

  // til almashganda savolni tozalab qayta yuklash
  useEffect(() => { reset(); }, [lang, reset]);

  const runCheck = () => { checkFnRef.current && checkFnRef.current(); };

  const chip = (active) => ({
    padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#fe5b1a' : '#d6dae3'),
    background: active ? '#fe5b1a' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
  });
  const btnBase = { padding: '14px 22px', fontSize: 17, fontWeight: 700, borderRadius: 14, fontFamily: "'Manrope', system-ui, sans-serif" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '78vh', maxWidth: 680, margin: '0 auto', width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderBottom: '1px solid #eef0f4', fontFamily: "'Manrope', system-ui, sans-serif",
      }}>
        <strong style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>{title || ''}</strong>
        <button type="button" style={chip(lang === 'uz')} onClick={() => setLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => setLang('ru')}>RU</button>
      </div>

      <div style={{ flex: 1, padding: '12px 12px 90px' }}>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: result.correct ? '#1a7f43' : '#c0392b' }}>
            {result.correct ? <IconOk /> : <IconNo />}
            {result.correct ? ui.correct : ui.wrong}
          </div>
        )}
        {!result ? (
          <button type="button" disabled={!ready} onClick={runCheck}
            style={{ ...btnBase, minWidth: 200, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', color: '#fff', background: ready ? '#fe5b1a' : '#c2c8d2' }}>
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
