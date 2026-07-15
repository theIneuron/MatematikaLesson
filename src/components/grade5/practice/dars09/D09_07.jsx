// Dars09 · Amaliyot 07 — Vaqt kasri · 🔴 · time_fraction (soat + kiritish)
// Soatning 3/4 qismi = necha daqiqa? 60:4=15, 15×3=45. Soat vizuali.
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
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D07_TOTAL = 60, D07_NUM = 3, D07_DEN = 4, D07_ANS = 45;
const D07_T = {
  uz: {
    eyebrow: 'Vaqt kasri', setup: "Bir soatda 60 daqiqa bor.",
    ask: 'Soatning 3/4 qismi necha daqiqa?', label: 'Javobni yozing:',
    correct: "To'g'ri. 60 : 4 = 15; 15 × 3 = 45 daqiqa.",
    wrong: "Maslahat: bir soat teng ulushlarga bo'linadi — bitta ulush necha daqiqa? Surat nechta ulush kerakligini aytadi.",
    rule: "Vaqtning kasr qismi: 60 daqiqani maxrajga bo'ling, suratga ko'paytiring.",
  },
  ru: {
    eyebrow: 'Дробь времени', setup: 'В одном часе 60 минут.',
    ask: 'Сколько минут в 3/4 часа?', label: 'Запишите ответ:',
    correct: 'Верно. 60 : 4 = 15; 15 × 3 = 45 минут.',
    wrong: 'Подсказка: час делится на равные доли — сколько минут в одной доле? Числитель говорит, сколько долей нужно.',
    rule: 'Дробь времени: 60 минут делим на знаменатель, умножаем на числитель.',
  },
};
export default function D09_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(0); // 0..3 ulush yoritiladi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setFill(3); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D07_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [0, 1, 2].forEach((k) => timers.current.push(setTimeout(() => setFill(k + 1), 400 + k * 450)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D07_ANS }, correct, meta: { tag: 'time_fraction', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  // soat: 4 chorak, har biri 90°. fill tasi bo'yaladi
  const R = 65, C = 75;
  const quarters = [0, 1, 2, 3].map((k) => {
    const a0 = k * (Math.PI / 2) - Math.PI / 2;
    const a1 = (k + 1) * (Math.PI / 2) - Math.PI / 2;
    const x0 = C + R * Math.cos(a0), y0 = C + R * Math.sin(a0);
    const x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1);
    return { d: `M${C},${C} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`, on: k < fill };
  });
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* to'lgan choraklar (och ko'k urg'u) */}
          {quarters.map((q, k) => <path key={k} d={q.d} fill={q.on ? '#bfdbfe' : '#f8fafc'} stroke="#fff" strokeWidth="2" style={{ transition: 'fill .4s' }} />)}
          {/* soat gardishi */}
          <circle cx="75" cy="75" r="65" fill="none" stroke="#1e3a8a" strokeWidth="4" />
          {/* daqiqa bo'linmalari */}
          {Array.from({ length: 12 }).map((_, k) => { const a = k * (Math.PI / 6) - Math.PI / 2; const big = k % 3 === 0; const r1 = big ? 55 : 59; const r2 = 63; return <line key={k} x1={75 + r1 * Math.cos(a)} y1={75 + r1 * Math.sin(a)} x2={75 + r2 * Math.cos(a)} y2={75 + r2 * Math.sin(a)} stroke="#1e3a8a" strokeWidth={big ? 3 : 1.5} strokeLinecap="round" />; })}
          {/* 12,3,6,9 raqamlari */}
          {[[75, 26, '12'], [124, 80, '3'], [75, 130, '6'], [26, 80, '9']].map(([x, y, n]) => <text key={n} x={x} y={y} fontSize="15" fontWeight="800" fill="#1e3a8a" textAnchor="middle" fontFamily="'Manrope', sans-serif">{n}</text>)}
          {/* strelkalar: 3/4 = 45 daqiqa → daqiqa strelkasi 9 da (270°) */}
          <line x1="75" y1="75" x2="75" y2="42" stroke="#1f2430" strokeWidth="4" strokeLinecap="round" />
          {fill >= 3 && <line x1="75" y1="75" x2="46" y2="75" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" style={{ transition: 'all .5s' }} />}
          {fill < 3 && <line x1="75" y1="75" x2="100" y2="63" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />}
          <circle cx="75" cy="75" r="5" fill="#1f2430" />
        </svg>
      </div>
      {fill >= 3 && <div className="d9-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 15, fontWeight: 800, color: '#2563eb', marginBottom: 4 }}>60 : 4 = 15 · 15 × 3 = 45</div>}
      <p style={{ ...S.ask, fontSize: 16, margin: '6px 0' }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 140, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
