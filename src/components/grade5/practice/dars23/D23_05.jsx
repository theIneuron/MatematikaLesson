// Dars23 · Amaliyot 05 — O'tkazma bilan qo'shish · 🔴 · tag: add_mixed_carry
// 4 5/6 + 2 5/6. Kasrlar: 5/6+5/6=10/6 (1 dan katta!) = 1 4/6. Butunlar 4+2=6, o'tkazma 1 → 7 4/6.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
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

const D05 = { w: 7, n: 4 }; // 7 4/6
const D05_T = {
  uz: {
    eyebrow: 'Kitob', setup: "Kamola bir hafta 4 5/6 soat, keyingi hafta yana 2 5/6 soat kitob o'qidi. Jami necha soat o'qigan?",
    ask: '4 5/6 + 2 5/6 = ?',
    btn: "Kasrlarni qo'shib ko'rish", l1: 'Butun:', l2: 'Kasr:',
    correct: "To'g'ri. Kasrlar 5/6 + 5/6 = 10/6 = 1 4/6. Butunlar 4 + 2 = 6, ustiga o'tkazma 1 → 7. Demak 4 5/6 + 2 5/6 = 7 4/6.",
    wrong: "Kasrlar yig'indisi qanday chiqdi — u bir butundan katta emasmi? Yana bir bor qarang.",
    rule: "Kasrlar yig'indisi bir butundan katta bo'lsa, undagi butunni butun qismga qo'shamiz.",
  },
  ru: {
    eyebrow: 'Книга', setup: 'Камола за одну неделю читала 4 5/6 часа, за следующую ещё 2 5/6 часа. Сколько часов она читала всего?',
    ask: '4 5/6 + 2 5/6 = ?',
    btn: 'Сложить дроби и посмотреть', l1: 'Целое:', l2: 'Дробь:',
    correct: 'Верно. Дроби 5/6 + 5/6 = 10/6 = 1 4/6. Целые 4 + 2 = 6, плюс перенос 1 → 7. Значит 4 5/6 + 2 5/6 = 7 4/6.',
    wrong: 'Какой получилась сумма дробей — не больше ли она одного целого? Посмотри ещё раз.',
    rule: 'Если сумма дробей больше 1, целое из неё прибавь к целой части.',
  },
};

export default function D23_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [combined, setCombined] = useState(false);
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.n != null) setN(String(s.n)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(n);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D05.w && parseInt(n, 10) === D05.n;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), n: parseInt(n, 10) }, correctAnswer: D05, correct, meta: { tag: 'add_mixed_carry', level: '🔴' } });
  }, [w, n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={locked} inputMode="numeric" placeholder="?" style={{ width: 46, height: 40, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-pop { animation: d23pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d23pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0' }}>
        <Mixed w={4} n={5} d={6} size={22} color="#fe5b1a" /><span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>+</span><Mixed w={2} n={5} d={6} size={22} color="#fe5b1a" />
      </div>
      {!combined && <div style={{ textAlign: 'center', margin: '4px 0' }}><button type="button" disabled={locked} onClick={() => setCombined(true)} style={{ padding: '8px 14px', borderRadius: 13, border: '1.5px dashed #c4b5fd', background: '#faf5ff', color: '#7c3aed', fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 13, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>{t.btn}</button></div>}
      {combined && <div className="d23-pop" style={{ textAlign: 'center', fontSize: 12.5, color: '#7c3aed', fontWeight: 700, marginBottom: 4 }}>kasr: 5/6 + 5/6 = 10/6 = 1 4/6</div>}
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>{box(w, setW, D05.w)}</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div><div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>{box(n, setN, D05.n)}<div style={{ width: 42, height: 2.5, background: '#1f2430' }} /><div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>6</div></div></div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
