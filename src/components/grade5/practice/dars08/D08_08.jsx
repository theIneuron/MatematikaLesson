// Dars08 · Amaliyot 08 — Aqlli kvadrat · 🔴 · Sardor · tag: square_big
// 9². Qulay yo'l: 9×10 to'r, oxirgi ustun (9 ta) olib tashlanadi → 90 − 9 = 81.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d8-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// daraja ko'rsatkichini yuqori indeks qilib chizish
const Pow = ({ base, exp, size = 30, color = '#1f2430' }) => (
  <span style={{ ...S.mono, fontWeight: 800, color }}>
    <span style={{ fontSize: size }}>{base}</span><sup style={{ fontSize: size * 0.6 }}>{exp}</sup>
  </span>
);

const D08_N = 9, D08_ANS = 81;
const D08_T = {
  uz: {
    eyebrow: 'Aqlli kvadrat', setup: "Sardor 9² ni tez topmoqchi. U 9 qator × 10 ustun to'r chizdi.",
    ask: '9² nechaga teng?', label: 'Javobni yozing:',
    correct: "To'g'ri. 9×10 = 90, undan 9 ni ayiramiz: 90 − 9 = 81. Demak 9² = 81.",
    wrong: "Maslahat: 9×10 to'liq to'rni hisoblash oson. 9×9 to'r undan qancha katakka kam — o'sha farqni to'r ustidan o'ylang.",
    rule: "Qulay usul: 9×9 = 9×10 − 9 = 90 − 9 = 81.",
  },
  ru: {
    eyebrow: 'Умный квадрат', setup: 'Сардор хочет быстро найти 9². Он начертил сетку 9 рядов × 10 столбцов.',
    ask: 'Чему равно 9²?', label: 'Запишите ответ:',
    correct: 'Верно. 9×10 = 90, вычитаем 9: 90 − 9 = 81. Значит 9² = 81.',
    wrong: 'Подсказка: полную сетку 9×10 посчитать легко. На сколько клеток меньше сетка 9×9 — подумай об этой разнице по рисунку.',
    rule: 'Удобный способ: 9×9 = 9×10 − 9 = 90 − 9 = 81.',
  },
};
export default function D08_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1 → oxirgi ustun o'chadi · 2 → natija
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 400], [2, 1200]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    onSubmit?.({ questionText: '9²', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'square_big', level: '🔴' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  // 9 qator × 10 ustun. oxirgi ustun (indeks 9) ph>=1 da o'chadi
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d8-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 15px)', gap: 3, padding: 12, borderRadius: 14, background: '#f8fafc', border: '1.5px solid #e5e7eb' }}>
            {Array.from({ length: 90 }).map((_, k) => {
              const colIdx = k % 10;
              const isLast = colIdx === 9; // oxirgi ustun — ayiriladigan 9 ta
              let bg = '#93c5fd';
              if (isLast) bg = ph >= 1 ? '#fecaca' : '#c7d2e8';
              return <span key={k} style={{ width: 15, height: 15, borderRadius: 3, background: bg, opacity: (isLast && ph >= 2) ? 0.25 : 1, transition: 'all .5s ease', transform: (isLast && ph >= 1) ? 'scale(.85)' : 'none' }} />;
            })}
          </div>
          {/* izoh yorliqlari */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, ...S.mono, fontSize: 12, fontWeight: 800 }}>
            <span style={{ color: '#2563eb' }}>{lang === 'uz' ? '9 × 10 = 90' : '9 × 10 = 90'}</span>
            {ph >= 1 && <span className="d8-pop" style={{ color: '#c0392b' }}>− 9</span>}
          </div>
        </div>
      </div>
      {ph >= 2 && <div className="d8-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 18, fontWeight: 800, color: '#1a7f43', marginBottom: 4 }}>90 − 9 = 81</div>}
      <div style={{ textAlign: 'center', margin: '4px 0 2px' }}><Pow base="9" exp="2" size={30} /></div>
      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700, textAlign: 'center', margin: '4px 0 8px' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 140, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
