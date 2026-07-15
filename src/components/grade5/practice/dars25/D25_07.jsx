// Dars25 · Amaliyot 07 — Masala: kim ko'proq · 🔴 · tag: compare_story
// Aziza 0,8 L, Malika 0,75 L bo'yoq. Xato: "0,75 da ko'p raqam, demak ko'proq". To'g'ri: 0,8=0,80 > 0,75.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Bo'yoq bankasi — to'lganlik darajasi frac (0..1)
function Can({ frac, name, val, color }) {
  const w = 78, h = 96, top = 16;
  const fillH = (h - top - 6) * frac;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="8" y={top} width={w - 16} height={h - top - 4} rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <rect x="10" y={h - 6 - fillH} width={w - 20} height={fillH} rx="4" fill={color} />
        <rect x="4" y={top - 8} width={w - 8} height="12" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      </svg>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{name}</div>
      <div style={{ ...S.mono, fontSize: 18, fontWeight: 800, color }}>{val} L</div>
    </div>
  );
}

const D07_OPTS = [{ v: '0,8', name: { uz: 'Aziza', ru: 'Азиза' } }, { v: '0,75', name: { uz: 'Malika', ru: 'Малика' } }];
const D07_CORRECT = 0; // 0,8 > 0,75
const D07_T = {
  uz: {
    eyebrow: "Kim ko'proq", setup: "Aziza 0,8 litr, Malika 0,75 litr bo'yoq ishlatdi. Bankalardagi bo'yoq darajasiga qarang.",
    ask: "Kim ko'proq bo'yoq ishlatdi? Ismini bos:",
    correct: "To'g'ri. 0,8 = 0,80. o'ndan: 8 > 7, demak 0,8 > 0,75. Aziza ko'proq ishlatdi.",
    wrong: "Ikkala banka darajasini yana solishtiring. Shoshilmang — raqamlar soni aldab qo'ymasin.",
    rule: "Oxiriga nol qo'shsa qiymat o'zgarmaydi: 0,8 = 0,80 > 0,75.",
  },
  ru: {
    eyebrow: 'Кто больше', setup: 'Азиза использовала 0,8 литра, Малика 0,75 литра краски. Посмотри на уровень краски в банках.',
    ask: 'Кто использовал больше краски? Нажми имя:',
    correct: 'Верно. 0,8 = 0,80. Десятые: 8 > 7, значит 0,8 > 0,75. Азиза использовала больше.',
    wrong: 'Сравни уровень в обеих банках ещё раз. Не спеши — число цифр может обмануть.',
    rule: 'Добавление нуля справа не меняет значение: 0,8 = 0,80 > 0,75.',
  },
};

export default function D25_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_OPTS.map((o, i) => ({ id: String(i), label: o.v })), studentAnswer: { idx: pick }, correctAnswer: { idx: D07_CORRECT }, correct, meta: { tag: 'compare_story', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const colors = ['#f59e0b', '#38bdf8'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '8px 0' }}>
        {D07_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#e2e8f0', bg = '#fff';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ padding: '10px 14px', borderRadius: 16, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}><Can frac={parseFloat(o.v.replace(',', '.'))} name={o.name[lang] || o.name.uz} val={o.v} color={colors[i]} /></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
