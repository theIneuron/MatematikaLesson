// PracticeHost (3-sinf) — LOKAL PREVIEW uchun platforma host'ini taqlid qiluvchi qobiq.
// Maqsad: jsx-question kontraktidagi props'ni (onReady, registerCheck, onSubmit,
// playCorrect/playWrong) berib, native "Tekshirish" tugmasini chiqarish — shunda
// mashqni local saytda alohida sinab ko'rsa bo'ladi.
// 3-sinf (8–9 yosh): grade2 bilan bir xil qobiq, kontrakt o'zgarmagan.
// Ichida UZ/RU almashtirgich bor. Narratsiya (ovoz) yo'q — javobda faqat qisqa beep-signal.
// Grade1/Grade2/Grade5 practice/PracticeHost bilan bir xil kontrakt.

import { useState, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
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
  } catch { /* preview-only */ }
}

const UI = {
  uz: { check: 'Tekshirish', retry: 'Qayta urinish', change: "Javobni o'zgartiring", correct: "Barakalla!", wrong: 'Maslahat' },
  ru: { check: 'Проверить', retry: 'Заново', change: 'Измени ответ', correct: 'Молодец!', wrong: 'Подсказка' },
};

export default function PracticeHost({ Question, lang: langProp = 'uz', title, onResult, source }) {
  const [lang, setLang] = useState(langProp);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [qKey, setQKey] = useState(0);
  const checkFnRef = useRef(null);
  const ui = UI[lang] || UI.uz;

  const onReady = useCallback((v) => setReady(!!v), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((res) => {
    const next = {
      ...(res || { correct: false }),
      meta: { ...(res?.meta || {}), source: res?.meta?.source || source },
    };
    setResult(next);
    onResult?.(next);
  }, [onResult, source]);
  const playCorrect = useCallback(() => beep(true), []);
  const playWrong = useCallback(() => beep(false), []);

  const reset = useCallback(() => {
    setResult(null); setReady(false); checkFnRef.current = null;
    setQKey((k) => k + 1);
  }, []);

  const changeLang = (nextLang) => {
    if (nextLang === lang) return;
    setLang(nextLang);
    reset();
  };

  const runCheck = () => { checkFnRef.current && checkFnRef.current(); };

  const chip = (active) => ({
    padding: '6px 13px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif",
  });
  const btnBase = { padding: '15px 24px', fontSize: 18, fontWeight: 800, borderRadius: 16, fontFamily: "'Manrope', system-ui, sans-serif" };

  return (
    <div className="g3-practice-host">
      <style>{`
        .g3-practice-host {
          position: relative;
          display: flex;
          flex: 1;
          flex-direction: column;
          width: 100%;
          max-width: 1120px;
          height: 100%;
          min-height: 0;
          margin: 0 auto;
        }
        .g3-practice-toolbar {
          position: fixed;
          top: 7px;
          right: 8px;
          z-index: 1101;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .g3-practice-toolbar-title {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }
        .g3-practice-viewport {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          padding: 10px 12px 8px;
          overscroll-behavior: contain;
        }
        .g3-practice-content {
          width: 100%;
          height: 100%;
          min-height: 0;
        }
        .g3-practice-footer {
          min-height: 62px;
          box-sizing: border-box;
          flex-shrink: 0;
          padding: 8px 12px;
          border-top: 1px solid #EEF0F4;
          background: rgba(255,255,255,.97);
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 639.98px) {
          .g3-practice-toolbar { top: 6px; gap: 4px; }
          .g3-practice-viewport { padding: 8px 10px 6px; }
          .g3-practice-footer { min-height: 58px; padding: 6px 10px; }
        }
      `}</style>
      <div className="g3-practice-toolbar">
        <strong className="g3-practice-toolbar-title">{title || ''}</strong>
        <button type="button" style={chip(lang === 'uz')} onClick={() => changeLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => changeLang('ru')}>RU</button>
      </div>

      <div className="g3-practice-viewport">
        <div className="g3-practice-content">
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
      </div>

      <div className="g3-practice-footer">
        {result && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, color: result.correct ? '#1a7f43' : '#c0392b' }}>
            {result.correct ? <IconOk /> : <IconNo />}
            {result.correct ? ui.correct : ui.wrong}
          </div>
        )}
        {result?.correct ? null : ready ? (
          <button type="button" disabled={!ready} onClick={runCheck}
            style={{ ...btnBase, minWidth: 210, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', color: '#fff', background: ready ? '#2563eb' : '#c2c8d2' }}>
            {ui.check}
          </button>
        ) : result ? (
          <span style={{ padding: '10px 12px', color: '#6B7280', fontSize: 14, fontWeight: 800 }}>
            {ui.change}
          </span>
        ) : (
          <button type="button" disabled
            style={{ ...btnBase, minWidth: 210, border: 'none', color: '#fff', background: '#c2c8d2', cursor: 'not-allowed' }}>
            {ui.check}
          </button>
        )}
      </div>
    </div>
  );
}
