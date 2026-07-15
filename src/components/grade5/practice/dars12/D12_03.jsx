// Dars12 · Amaliyot 03 — Bo'yalgan chiziq · 🟢 · tag: visual_compare
// Ikki bir xil chiziqda bo'yalgan qismning uzunligini ko'z bilan taqqoslash.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- SHARED ---------- */
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Bar = ({ n, k, color = '#2563eb', height = 40, onCell = null, disabled = false }) => (
  <div style={{ display: 'flex', width: '100%', border: '2px solid #1f2430', borderRadius: 8, overflow: 'hidden', height, background: '#fff' }}>
    {Array.from({ length: n }).map((_, i) => {
      const on = i < k;
      const base = {
        flex: 1, minWidth: 0, padding: 0, border: 'none',
        background: on ? color : '#fff',
        boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none',
        transition: 'background .18s',
      };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!on && !disabled && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#cbd2dc' }} />}
        </button>
      );
    })}
  </div>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #2563eb; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;
/* ---------- /SHARED ---------- */

const D12_03_DATA = { correct: 1, tag: 'visual_compare', level: '🟢' };
const D12_03_T = {
  uz: {
    eyebrow: "Ko'rish", title: "Bo'yalgan chiziq",
    setup: "Ikki bir xil chiziq 6 ta teng bo'lakka bo'lingan.",
    ask: "Qaysi kasr kattaroq?",
    opts: ['2/6', '4/6', 'Teng', "Bilib bo'lmaydi"],
    correct: "To'g'ri. To'rt bo'lak ikki bo'lakdan uzunroq.",
    wrongMsg: "Maslahat: bo'yalgan qismlarning uzunligini ko'z bilan solishtiring.",
  },
  ru: {
    eyebrow: 'Взгляд', title: 'Закрашенная полоска',
    setup: 'Две одинаковые полоски разделены на 6 равных частей.',
    ask: 'Какая дробь больше?',
    opts: ['2/6', '4/6', 'Поровну', 'Узнать нельзя'],
    correct: 'Верно. Четыре части длиннее, чем две.',
    wrongMsg: 'Подсказка: сравните глазами длину закрашенных участков.',
  },
};

export default function D12_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_03_T[lang] || D12_03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer?.studentAnswer?.idx != null) {
      setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D12_03_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: D12_03_DATA.correct, label: t.opts[D12_03_DATA.correct] },
      correct, meta: { tag: D12_03_DATA.tag, level: D12_03_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === D12_03_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div className="pq-row"><span className="pq-tag">A</span><Bar n={6} k={2} /></div>
      <div className="pq-row"><span className="pq-tag">B</span><Bar n={6} k={4} color="#7c3aed" /></div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => (
          <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
