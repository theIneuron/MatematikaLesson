// Dars20 · Amaliyot 08 — Belgilang: natijasi 1/3 · 🟢 · tag: sub_select_all
// Qaysi ayirmalarning natijasi 1/3 ga teng? Hammasini belgilash (select-all).
// 5/6−1/2 = 2/6 = 1/3 ✓ ; 3/4−1/2 = 1/4 ✗ ; 3/4−5/12 = 4/12 = 1/3 ✓ ; 5/6−1/3 = 3/6 = 1/2 ✗
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
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
const FracStr = ({ s, size = 19, color }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} color={color} />; };

// Har xil maxrajli ayirmalar; natijasi 1/3 ga teng bo'lganlarini belgilash kerak.
const D08_OPTS = [
  { a: '5/6', b: '1/2', hit: true },   // 5/6 − 3/6 = 2/6 = 1/3
  { a: '3/4', b: '1/2', hit: false },  // 3/4 − 2/4 = 1/4
  { a: '3/4', b: '5/12', hit: true },  // 9/12 − 5/12 = 4/12 = 1/3
  { a: '5/6', b: '1/3', hit: false },  // 5/6 − 2/6 = 3/6 = 1/2
];
const D08_CORRECT = D08_OPTS.reduce((s, o, i) => (o.hit ? s.add(i) : s), new Set());
const D08_T = {
  uz: {
    eyebrow: 'Belgila', setup: "Aziza bir nechta ayirmani hisobladi. Ular orasidan natijasi aynan 1/3 ga teng bo'lganlarini toping.",
    ask: "Natijasi 1/3 ga teng ayirmalarni belgilang (bittadan ko'p bo'lishi mumkin):",
    correct: "To'g'ri. 5/6 − 1/2 = 2/6 = 1/3 va 3/4 − 5/12 = 4/12 = 1/3. Qolgan ikkitasi boshqa natija beradi.",
    wrong: "Maslahat: ayirmalarni bir-biriga emas, har birini nishon 1/3 bilan solishtiring. Buning uchun ularni qanday ko'rinishga keltirish kerak?",
    rule: "Natijalarni solishtirishdan oldin har ayirmani bir xil bo'lakka keltiring va soddalashtiring.",
  },
  ru: {
    eyebrow: 'Отметь', setup: 'Азиза посчитала несколько разностей. Найди среди них те, чей результат равен ровно 1/3.',
    ask: 'Отметь разности, результат которых равен 1/3 (их может быть несколько):',
    correct: 'Верно. 5/6 − 1/2 = 2/6 = 1/3 и 3/4 − 5/12 = 4/12 = 1/3. Остальные две дают другой результат.',
    wrong: 'Подсказка: сравнивай не разности между собой, а каждую с целью 1/3. К какому виду для этого их привести?',
    rule: 'Прежде чем сравнивать результаты, приведи каждую разность к одинаковым долям и упрости.',
  },
};

export default function D20_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(() => new Set());
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (Array.isArray(sa?.picked)) { setPicked(new Set(sa.picked)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked.size > 0 && !checked); }, [picked, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (i) => { if (locked) return; setPicked((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; }); };
  const check = useCallback(() => {
    const correct = picked.size === D08_CORRECT.size && [...picked].every((i) => D08_CORRECT.has(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_OPTS.map((o, i) => ({ id: String(i), label: o.a + ' − ' + o.b })), studentAnswer: { picked: [...picked].sort() }, correctAnswer: { picked: [...D08_CORRECT].sort() }, correct, meta: { tag: 'sub_select_all', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0 2px' }}>
        <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#7c3aed' }}>{lang === 'uz' ? 'nishon:' : 'цель:'}</span>
        <Frac num="1" den="3" size={22} color="#7c3aed" />
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {D08_OPTS.map((o, i) => {
          const on = picked.has(i);
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; }
          if (checked && on) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={locked} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 60, borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 6, left: 8, width: 16, height: 16, borderRadius: 5, border: '2px solid ' + (on ? '#2563eb' : '#cbd5e1'), background: on ? '#2563eb' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{on ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : null}</span>
              <FracStr s={o.a} size={19} /><span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#64748b' }}>−</span><FracStr s={o.b} size={19} />
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
