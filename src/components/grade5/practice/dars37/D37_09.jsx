// Dars37 · Amaliyot 09 — Yuza va hajm · 🔴 · tag: vol_vs_area
// Kub qirrasi 3. Bir yog' YUZASI 3 × 3 = 9 sm². Butun HAJM 3 × 3 × 3 = 27 sm³.
// Vizual: qirralari belgilangan simli kub (birlik to'rlarsiz — javobni oshkor qilmaydi), bir yog' yoritilgan.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0e7490', background: '#ecfeff', border: '1px solid #a5f3fc', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d37-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Simli kub: qirralari belgilangan, old yog'i (yuza) yoritilgan. Birlik to'rlar yo'q.
function WireCube({ lang }) {
  const u = 82, dp = 0.44, pad = 14, padL = 44; // padL — chap tik qirra yorlig'iga joy
  const dx = u * dp, dy = -u * dp;
  const bx = padL, by = pad + u + (-dy);
  const bl = [bx, by], br = [bx + u, by], tr = [bx + u, by - u], tl = [bx, by - u];
  const blb = [bx + dx, by + dy], brb = [bx + u + dx, by + dy], trb = [bx + u + dx, by - u + dy], tlb = [bx + dx, by - u + dy];
  const P = (a) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const LN = '#0e7490';
  const W = bx + u + dx + pad + 44, H = by + pad;
  const faceLbl = lang === 'uz' ? "bir yog'" : 'грань';
  const lbl = { fontSize: '12.5', fontWeight: '800', fill: LN, fontFamily: "'JetBrains Mono', monospace", stroke: '#fff', strokeWidth: '3.5', paintOrder: 'stroke', strokeLinejoin: 'round' };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={P([tl, tlb, trb, tr])} fill="#ecfeff" stroke={LN} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={P([br, brb, trb, tr])} fill="#cffafe" stroke={LN} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={P([bl, br, tr, tl])} fill="#67e8f9" stroke={LN} strokeWidth="2" strokeLinejoin="round" />
      <text x={(bl[0] + br[0]) / 2} y={by + 13} textAnchor="middle" {...lbl}>3 sm</text>
      <text x={bl[0] - 5} y={(bl[1] + tl[1]) / 2 + 4} textAnchor="end" {...lbl}>3 sm</text>
      <text x={(br[0] + brb[0]) / 2 + 13} y={(br[1] + brb[1]) / 2 + 15} textAnchor="start" {...lbl}>3 sm</text>
      <text x={(bl[0] + br[0]) / 2} y={(bl[1] + tr[1]) / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0e7490">{faceLbl}</text>
    </svg>
  );
}

const D09_AREA = 9, D09_VOL = 27;
const D09_T = {
  uz: {
    eyebrow: 'Yuza va hajm', setup: "Sabina qirrasi 3 sm bo'lgan kubni oldi. Bir yog'ining YUZASI va butun HAJMIni toping.",
    labelA: "Bir yog' yuzasi (sm²):", labelV: 'Butun hajm (sm³):',
    correct: "To'g'ri. Yuza: 3 × 3 = 9 sm². Hajm: 3 × 3 × 3 = 27 sm³.",
    wrong: "Yuza va hajm nechta o'lcham bilan farq qiladi — yuza ikkita, hajm uchta. Har biriga qirra necha marta kiradi?",
    rule: "Yuza = sm² (2 o'lcham); hajm = sm³ (3 o'lcham).",
  },
  ru: {
    eyebrow: 'Площадь и объём', setup: 'Сабина взяла куб с ребром 3 см. Найди ПЛОЩАДЬ одной грани и весь ОБЪЁМ.',
    labelA: 'Площадь грани (см²):', labelV: 'Весь объём (см³):',
    correct: 'Верно. Площадь: 3 × 3 = 9 см². Объём: 3 × 3 × 3 = 27 см³.',
    wrong: 'Чем различаются площадь и объём — числом измерений: у площади два, у объёма три. Сколько раз ребро входит в каждое?',
    rule: 'Площадь = см² (2 измерения); объём = см³ (3 измерения).',
  },
};

export default function D37_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [va, setVa] = useState('');
  const [vv, setVv] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.area != null) { setVa(String(sa.area)); setVv(String(sa.vol)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const both = /^\d+$/.test(va.trim()) && /^\d+$/.test(vv.trim());
  useEffect(() => { onReady?.(both && !checked); }, [both, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(va, 10) === D09_AREA && parseInt(vv, 10) === D09_VOL;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.labelA + ' / ' + t.labelV, options: [], studentAnswer: { area: parseInt(va, 10), vol: parseInt(vv, 10) }, correctAnswer: { area: D09_AREA, vol: D09_VOL }, correct, meta: { tag: 'vol_vs_area', level: '🔴' } });
  }, [va, vv, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bA = checked ? (parseInt(va, 10) === D09_AREA ? '#1a7f43' : '#c0392b') : '#2563eb';
  const bV = checked ? (parseInt(vv, 10) === D09_VOL ? '#1a7f43' : '#c0392b') : '#2563eb';
  const field = (label, val, setter, bd) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#374151' }}>{label}</span>
      <input value={val} onChange={(e) => setter(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 84, height: 50, textAlign: 'center', fontSize: 25, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 8px' }}>
        <WireCube lang={lang} />
      </div>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', margin: '8px 0' }}>
        {field(t.labelA, va, setVa, bA)}
        {field(t.labelV, vv, setVv, bV)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
