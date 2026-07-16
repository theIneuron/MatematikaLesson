// Dars12 · Amaliyot 10 — Nechta kasr · 🔴 · tag: count_between
// 2/9 va 8/9 orasida (chegaralar sanalmaydi) maxraji 9 bo'lgan 5 ta kasr bor.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- SHARED ---------- */
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
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
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  .d10-div { transform: scaleY(0); transform-origin: top; animation: d10div .5s cubic-bezier(.22,1,.36,1) both; }
  @keyframes d10div { to { transform: scaleY(1); } }
  .d10-cell { opacity: 0; transform: scaleX(.4); transform-origin: left; animation: d10fill .5s cubic-bezier(.22,1,.36,1) both; }
  @keyframes d10fill { to { opacity: 1; transform: scaleX(1); } }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; }
    .d10-div { transform: scaleY(1); } .d10-cell { opacity: 1; transform: none; } }
`;
/* ---------- /SHARED ---------- */

const D12_10_DATA = { correct: 5, den: 9, lo: 2, hi: 8, tag: 'count_between', level: '🔴' };
const D12_10_T = {
  uz: {
    eyebrow: 'Sanash', title: 'Nechta kasr',
    setup: "Butun bir chiziq. Uni maxraji 9 bo'lgan kasrlar bilan belgilaymiz.",
    ask: "2/9 va 8/9 ning orasida maxraji 9 bo'lgan nechta kasr bor? Chegaralar sanalmaydi.",
    correct: "To'g'ri. 3/9, 4/9, 5/9, 6/9, 7/9 — beshta.",
    wrongMsg: "Maslahat: chegaralar sanalmaydi. Surat 2 dan katta va 8 dan kichik bo'lsin.",
    inputLabel: 'Javob',
  },
  ru: {
    eyebrow: 'Счёт', title: 'Сколько дробей',
    setup: 'Целая полоска. Разметим её дробями со знаменателем 9.',
    ask: 'Сколько дробей со знаменателем 9 находится между 2/9 и 8/9? Границы не считаются.',
    correct: 'Верно. 3/9, 4/9, 5/9, 6/9, 7/9 — пять.',
    wrongMsg: 'Подсказка: границы не считаются. Числитель должен быть больше 2 и меньше 8.',
    inputLabel: 'Ответ',
  },
};

export default function D12_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_10_T[lang] || D12_10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false); // to'g'ri javobdan keyingi animatsiya

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.value != null) {
      setVal(String(sa.value));
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); }
    }
  }, [initialAnswer]);
  const valid = /^\d+$/.test(val.trim());
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);

  const check = useCallback(() => {
    const n = parseInt(val, 10);
    const correct = n === D12_10_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) setTimeout(() => setReveal(true), 260);
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { value: n, label: String(n) },
      correctAnswer: { value: 5, label: '5' },
      correct, meta: { tag: D12_10_DATA.tag, level: D12_10_DATA.level },
    });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const N = 9;
  const SPLIT_MS = 90;                 // bo'linish qadami
  const SPLIT_END = (N - 1) * SPLIT_MS + 500;
  const FILL_MS = 200;                 // bo'yash qadami

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>

      <div style={{ margin: '18px 0 8px' }}>
        <div style={{ position: 'relative', height: 46, border: '2px solid #1f2430', borderRadius: 8, background: '#ffe7d8', overflow: 'hidden' }}>
          {/* bo'yaladigan bo'laklar: 3/9 … 7/9 (indeks 2..6) */}
          {reveal && [2, 3, 4, 5, 6].map((c, j) => (
            <div key={c} className="d10-cell"
              style={{ position: 'absolute', top: 0, bottom: 0, left: (c / N * 100) + '%', width: (100 / N) + '%', background: '#fe5b1a', animationDelay: (SPLIT_END + j * FILL_MS) + 'ms' }} />
          ))}
          {/* ajratgich chiziqlar: chapdan o'ngga paydo bo'ladi */}
          {reveal && Array.from({ length: N - 1 }).map((_, i) => (
            <div key={i} className="d10-div"
              style={{ position: 'absolute', top: 0, bottom: 0, left: ((i + 1) / N * 100) + '%', width: 2, background: '#1f2430', animationDelay: (i * SPLIT_MS) + 'ms' }} />
          ))}
        </div>
        <div style={{ position: 'relative', height: 34, marginTop: 4 }}>
          <div style={{ position: 'absolute', left: (2 / N * 100) + '%', transform: 'translateX(-50%)', textAlign: 'center' }}><Frac a={2} b={9} size={13} tone="#6b7280" /></div>
          <div style={{ position: 'absolute', left: (8 / N * 100) + '%', transform: 'translateX(-50%)', textAlign: 'center' }}><Frac a={8} b={9} size={13} tone="#6b7280" /></div>
        </div>
      </div>

      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '8px 0' }}>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: '#6b7280' }}>{t.inputLabel}</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))}
          disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 76, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
