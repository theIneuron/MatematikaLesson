// Dars17 · Amaliyot 10 — Masala + qisqartirish · 🔴 · tag: add_story_reduce
// Madina pizza (6 bo'lak): 2/6 + 2/6 = 4/6, eng sodda holda = 2/3. Dars16 bilan bog'lash.
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

// pizza — dars09 amaliyotidagi model (qobiq + sous + kolbasa/pomidor/zaytun).
// Boshida BUTUN pitsa (6 bo'lak). reveal=true bo'lganda yeyilgan `eaten` bo'lak
// chetga siljib, sekin (birma-bir) yo'qoladi — qolgan qism ko'rinadi.
const Pizza = ({ den = 6, eaten = 0, size = 132, reveal = false }) => {
  const R = size / 2, C = R;
  const rCrust = R - 3, rSauce = R - 12;
  const dist = size * 0.17; // yo'qolayotgan bo'lakning chetga siljishi
  const seg = [];
  for (let k = 0; k < den; k++) {
    const a0 = (k / den) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((k + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const am = (a0 + a1) / 2;
    const cx0 = C + rCrust * Math.cos(a0), cy0 = C + rCrust * Math.sin(a0);
    const cx1 = C + rCrust * Math.cos(a1), cy1 = C + rCrust * Math.sin(a1);
    const sx0 = C + rSauce * Math.cos(a0), sy0 = C + rSauce * Math.sin(a0);
    const sx1 = C + rSauce * Math.cos(a1), sy1 = C + rSauce * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const topp = [
      { x: C + rSauce * 0.58 * Math.cos(am - 0.18), y: C + rSauce * 0.58 * Math.sin(am - 0.18), r: size * 0.036, c: '#dc2626' }, // kolbasa
      { x: C + rSauce * 0.72 * Math.cos(am + 0.22), y: C + rSauce * 0.72 * Math.sin(am + 0.22), r: size * 0.026, c: '#b91c1c' }, // pomidor
      { x: C + rSauce * 0.4 * Math.cos(am + 0.1), y: C + rSauce * 0.4 * Math.sin(am + 0.1), r: size * 0.018, c: '#1f2937' },   // zaytun
    ];
    seg.push({ crust: `M${C},${C} L${cx0},${cy0} A${rCrust},${rCrust} 0 ${large} 1 ${cx1},${cy1} Z`, sauce: `M${C},${C} L${sx0},${sy0} A${rSauce},${rSauce} 0 ${large} 1 ${sx1},${sy1} Z`, topp, am, leaving: k < eaten, k });
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {/* bo'sh tarelka izi (bo'lak ketganda ostidan ko'rinadi) */}
      <circle cx={C} cy={C} r={rCrust} fill="#fbe5c8" stroke="#f0d9b0" strokeWidth="1" />
      {seg.map((sg) => {
        const go = reveal && sg.leaving;
        const dx = (Math.cos(sg.am) * dist).toFixed(1), dy = (Math.sin(sg.am) * dist).toFixed(1);
        const style = {
          transform: go ? `translate(${dx}px, ${dy}px)` : 'none',
          opacity: go ? 0 : 1,
          transition: `transform .8s ease ${(sg.k * 0.2).toFixed(2)}s, opacity .8s ease ${(sg.k * 0.2).toFixed(2)}s`,
        };
        return (
          <g key={sg.k} style={style}>
            {/* qobiq (crust) */}
            <path d={sg.crust} fill="#e0a458" stroke="#cf8f43" strokeWidth="1.5" />
            {/* sous + pishloq (cheti qobiqdan ajralib turadi) */}
            <path d={sg.sauce} fill="#f4b942" stroke="#e0913b" strokeWidth="1.2" />
            {sg.topp.map((tp, j) => <circle key={j} cx={tp.x} cy={tp.y} r={tp.r} fill={tp.c} />)}
          </g>
        );
      })}
      <circle cx={C} cy={C} r="2.5" fill="#cf8f43" />
    </svg>
  );
};

const D10_SUM = 4, D10_A = 2, D10_B = 3; // 4/6 = 2/3
const D10_T = {
  uz: {
    eyebrow: 'Masala', setup: "Madina pizzani 6 teng bo'lakka kesdi. Avval 2/6 qismini, keyin yana 2/6 qismini yedi.",
    ask: "Madina jami qancha pizza yedi? Yig'indini, so'ng eng sodda holini yozing.",
    l1: "Yig'indi:", l2: 'Eng sodda:',
    correct: "To'g'ri. 2/6 + 2/6 = 4/6. 4 va 6 ikkalasi 2 ga bo'linadi: 4/6 = 2/3.",
    wrong: "Maslahat: maxraj o'zgarmaydi, suratlar qo'shiladi. Hosil bo'lgan kasrni yana qisqartirib bo'ladimi — Dars 16 dagidek?",
    rule: "Avval qo'sh (suratlar), keyin natijani eng sodda holga keltiring: 4/6 = 2/3.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Мадина разрезала пиццу на 6 равных частей. Сначала съела 2/6, потом ещё 2/6.',
    ask: 'Сколько всего пиццы съела Мадина? Запиши сумму, затем её простейший вид.',
    l1: 'Сумма:', l2: 'Простейший:',
    correct: 'Верно. 2/6 + 2/6 = 4/6. И 4, и 6 делятся на 2: 4/6 = 2/3.',
    wrong: 'Подсказка: знаменатель не меняется, складываются числители. Можно ли полученную дробь ещё сократить — как в Уроке 16?',
    rule: 'Сначала сложи (числители), затем приведи результат к простейшему виду: 4/6 = 2/3.',
  },
};

export default function D17_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [sum, setSum] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.sum != null) setSum(String(sa.sum)); if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(sum) && /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(sum, 10) === D10_SUM && parseInt(a, 10) === D10_A && parseInt(b, 10) === D10_B;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sum: parseInt(sum, 10), a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: { sum: D10_SUM, a: D10_A, b: D10_B }, correct, meta: { tag: 'add_story_reduce', level: '🔴' } });
  }, [sum, a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = (v, ok) => checked ? (v === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cell = (val, set, ok, w = 50) => (
    <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: w, height: 42, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd(parseInt(val, 10), ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d17slice { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop { animation: none !important; } svg [style] { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <Pizza den={6} eaten={4} size={132} reveal={reveal} />
      </div>
      {reveal && <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e', marginBottom: 2 }}><Frac num="4" den="6" size={18} color="#0f766e" /><span>=</span><Frac num="2" den="3" size={18} color="#0f766e" /></div>}
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 4 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {cell(sum, setSum, D10_SUM)}
            <div style={{ width: 54, height: 3, background: '#1f2430' }} />
            <div style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#64748b' }}>6</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {cell(a, setA, D10_A)}
            <div style={{ width: 54, height: 3, background: '#1f2430' }} />
            {cell(b, setB, D10_B)}
          </div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
