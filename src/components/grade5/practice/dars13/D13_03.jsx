// Dars13 · Amaliyot 03 — To'g'ri gap · 🟢 · true_statement
// Ikki chiziq (1/3 va 1/6) asosida to'g'ri xulosani tanlash.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const Bar = ({ n, k, color = '#fe5b1a', height = 40, onCell = null, disabled = false }) => (
  <div style={{ display: 'flex', width: '100%', border: '2px solid #1f2430', borderRadius: 8, overflow: 'hidden', height, background: '#fff' }}>
    {Array.from({ length: n }).map((_, i) => {
      const on = i < k;
      const base = { flex: 1, minWidth: 0, padding: 0, border: 'none', background: on ? color : '#fff', boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none', transition: 'background .18s' };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer' }} />
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
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #fe5b1a; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_03_DATA = { correct: 1, tag: 'true_statement', level: '🟢' };
const D13_03_T = {
  uz: {
    eyebrow: 'Qoida', setup: "Bir xil ikki chiziq. Biri 3 ta bo'lakka, ikkinchisi 6 ta bo'lakka bo'lingan.",
    ask: "Qaysi gap to'g'ri?",
    opts: [
      "Maxraj katta bo'lsa, kasr ham katta bo'ladi.",
      "Maxraj katta bo'lsa, bo'laklar mayda bo'ladi.",
      "Maxraj kasr kattaligiga ta'sir qilmaydi.",
    ],
    correct: "To'g'ri. Butun o'zgarmaydi. Bo'laklar soni ortsa, har bir bo'lak kichrayadi.",
    wrongMsg: "Maslahat: butun ikkalasida ham bir xil. O'zgargani — bo'laklar soni. Bir bo'lakning uzunligiga qarang.",
  },
  ru: {
    eyebrow: 'Правило', setup: 'Две одинаковые полоски. Одна разделена на 3 части, другая на 6.',
    ask: 'Какое утверждение верно?',
    opts: [
      'Чем больше знаменатель, тем больше дробь.',
      'Чем больше знаменатель, тем мельче доли.',
      'Знаменатель не влияет на величину дроби.',
    ],
    correct: 'Верно. Целое не меняется. Когда долей больше, каждая доля меньше.',
    wrongMsg: 'Подсказка: целое одинаковое в обоих случаях. Изменилось количество долей. Посмотрите на длину одной доли.',
  },
};

export default function D13_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_03_T[lang] || D13_03_T.uz;
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
    const correct = picked === D13_03_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 1, label: t.opts[1] },
      correct, meta: { tag: D13_03_DATA.tag, level: D13_03_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === D13_03_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '14px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, lineHeight: 1.4, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 50 };
  };

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div className="pq-row"><Frac a={1} b={3} size={14} /><Bar n={3} k={1} height={32} /></div>
      <div className="pq-row"><Frac a={1} b={6} size={14} /><Bar n={6} k={1} height={32} color="#7c3aed" /></div>
      <p className="pq-ask">{t.ask}</p>
      {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
