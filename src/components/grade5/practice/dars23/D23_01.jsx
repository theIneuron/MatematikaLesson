// Dars23 · Amaliyot 01 — Ustunli qo'shish · 🟢 · tag: add_mixed_simple
// 4 2/7 + 3 3/7 = 7 5/7. Butunlar 4+3=7, kasrlar 2/7+3/7=5/7 (o'tkazmasiz).
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d23-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const Mixed = ({ w, n, d, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 6, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);

const D01 = { w: 7, n: 5 }; // 7 5/7
const D01_T = {
  uz: {
    eyebrow: 'Ombor', setup: "Bekzod bo'yoq idishiga birinchi kuni 4 2/7 litr, ikkinchi kuni yana 3 3/7 litr bo'yoq quydi. Idishda jami qancha bo'yoq to'plandi?",
    ask: "Yig'indini toping: 4 2/7 + 3 3/7 = ?",
    l1: 'Butun:', l2: 'Kasr:',
    correct: "To'g'ri. Butunlar: 4 + 3 = 7. Kasrlar: 2/7 + 3/7 = 5/7. Demak 4 2/7 + 3 3/7 = 7 5/7.",
    wrong: "Butun qism va kasr qismini alohida diqqat bilan qarab chiqing, so'ng qayta urinib ko'ring.",
    rule: "Aralash sonlarni qo'shganda butunni butunga, kasrni kasrga qo'shamiz (maxraj o'zgarmaydi).",
  },
  ru: {
    eyebrow: 'Склад', setup: 'Бекзод налил в банку краски в первый день 4 2/7 литра, во второй ещё 3 3/7 литра. Сколько всего краски в банке?',
    ask: 'Найди сумму: 4 2/7 + 3 3/7 = ?',
    l1: 'Целое:', l2: 'Дробь:',
    correct: 'Верно. Целые: 4 + 3 = 7. Дроби: 2/7 + 3/7 = 5/7. Значит 4 2/7 + 3 3/7 = 7 5/7.',
    wrong: 'Рассмотри целую часть и дробную часть по отдельности и попробуй снова.',
    rule: 'Сложение смешанных: сложи целые, сложи дроби (знаменатель не меняется).',
  },
};

export default function D23_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.n != null) setN(String(s.n)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(n);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D01.w && parseInt(n, 10) === D01.n;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), n: parseInt(n, 10) }, correctAnswer: D01, correct, meta: { tag: 'add_mixed_simple', level: '🟢' } });
  }, [w, n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 46, height: 40, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-pop { animation: d23pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d23pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      {/* ustunlar */}
      <div style={{ display: 'grid', gridTemplateColumns: '30px 70px 70px', justifyContent: 'center', alignItems: 'center', rowGap: 4, columnGap: 6, margin: '8px 0' }}>
        <span />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textAlign: 'center' }}>{t.l1}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textAlign: 'center' }}>{t.l2}</span>
        <span />
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, textAlign: 'center', color: '#2563eb' }}>4</span>
        <span style={{ textAlign: 'center' }}><Frac num="2" den="7" size={20} color="#2563eb" /></span>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8', textAlign: 'center' }}>+</span>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, textAlign: 'center', color: '#2563eb' }}>3</span>
        <span style={{ textAlign: 'center' }}><Frac num="3" den="7" size={20} color="#2563eb" /></span>
        <span style={{ gridColumn: '1 / span 3', height: 2, background: '#cbd5e1', margin: '2px 0' }} />
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8', textAlign: 'center' }}>=</span>
        <span style={{ textAlign: 'center' }}>{box(w, setW, D01.w)}</span>
        <span style={{ textAlign: 'center' }}><div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>{box(n, setN, D01.n)}<div style={{ width: 42, height: 2.5, background: '#1f2430' }} /><div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>7</div></div></span>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
