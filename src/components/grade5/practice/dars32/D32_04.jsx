// Dars32 · Amaliyot 04 — Pitssa · 🟡 · tag: whole_quarter
// 25% = 12 → butun = 12 × 4 = 48. Vizual: pirog (doira) 4 chorakka bo'lingan (reveal).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0f766e', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const QPATH = [
  'M60,60 L110,60 A50,50 0 0 1 60,110 Z',
  'M60,60 L60,110 A50,50 0 0 1 10,60 Z',
  'M60,60 L10,60 A50,50 0 0 1 60,10 Z',
  'M60,60 L60,10 A50,50 0 0 1 110,60 Z',
];
const QLABEL = [[85, 85], [35, 85], [35, 40], [85, 40]];
function Pizza({ filled }) {
  return (
    <svg viewBox="0 0 120 120" style={{ display: 'block', width: 132, height: 132 }}>
      {QPATH.map((d, i) => {
        const on = i < filled;
        return <path key={i} className={on ? 'd32-slice' : ''} style={{ animationDelay: (i * 0.14) + 's' }} d={d} fill={on ? '#2dd4bf' : '#f0fdfa'} stroke="#0d9488" strokeWidth="2" />;
      })}
      {Array.from({ length: filled }).map((_, i) => (
        <text key={i} x={QLABEL[i][0]} y={QLABEL[i][1]} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="'JetBrains Mono', monospace">12</text>
      ))}
    </svg>
  );
}

const D04_ANS = 48;
const D04_T = {
  uz: {
    eyebrow: 'Butunni top', setup: "Alisher tug'ilgan kunida pitssa buyurtma qildi. Mehmonlar kelgunicha u pitssaning 25% ini yeb qo'ydi — bu 12 bo'lakcha edi. Endi butun pitssada nechta bo'lakcha bo'lganini eslay olmayapti.",
    ask: "Butun pitssada nechta bo'lakcha bor edi?", label: 'butun:',
    correct: "To'g'ri. 25% — chorak. To'rtta chorak butunni beradi: 12 × 4 = 48.",
    wrong: "25% qanday ulush? Butun nechta shunday ulushdan iborat — qismni necha marta olasiz?",
    rule: "25% = chorak → butun = qism × 4.",
  },
  ru: {
    eyebrow: 'Найди целое', setup: 'Алишер заказал пиццу на день рождения. Пока гости не пришли, он съел 25% пиццы — это 12 кусочков. Теперь он не может вспомнить, сколько кусочков было в целой пицце.',
    ask: 'Сколько кусочков было в целой пицце?', label: 'целое:',
    correct: 'Верно. 25% — это четверть. Четыре четверти дают целое: 12 × 4 = 48.',
    wrong: 'Что за доля 25%? Из скольких таких долей состоит целое — сколько раз взять часть?',
    rule: '25% = четверть → целое = часть × 4.',
  },
};

export default function D32_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D04_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D04_ANS }, correct, meta: { tag: 'whole_quarter', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#0f766e';
  const reveal = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d32-slice { transform-box: fill-box; transform-origin: 60px 60px; animation: d32sl .5s ease both; }
        @keyframes d32sl { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop, .d32-slice { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, margin: '8px 0 4px' }}>
        <Pizza filled={reveal ? 4 : 1} />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f766e' }}>
          {reveal ? (<span style={S.mono}>100% = 48</span>) : (lang === 'uz' ? "yeyilgan ulush · 25%" : 'съедено · 25%')}
        </div>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
