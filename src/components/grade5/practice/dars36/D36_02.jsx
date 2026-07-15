// Dars36 · Amaliyot 02 — Yuzani toping · 🟢 · tag: tri_basic
// Asos 6, balandlik 4 → (6 × 4) : 2 = 12. Vizual: to'g'ri uchburchak (labellar), ishlangan yechim reveal.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: rose
const HUE = { d: '#be123c', l: '#fff1f2', m: '#fecdd3', deep: '#9f1239', fill: '#f43f5e' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d36-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Javobdan OLDIN: labellangan to'g'ri uchburchak (givens — javobni oshkor qilmaydi).
function TriFig({ base = 6, height = 4, bText, hText }) {
  const scale = Math.min(180 / base, 104 / height);
  const w = base * scale, h = height * scale;
  const pad = 30, x0 = pad, y0 = pad, W = w + pad * 2 + 16, H = h + pad * 2;
  const A = [x0, y0 + h], B = [x0 + w, y0 + h], C = [x0 + w, y0];
  const m = 12;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={HUE.fill} fillOpacity="0.4" stroke={HUE.d} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={C[0]} y1={A[1]} x2={C[0]} y2={C[1]} stroke={HUE.deep} strokeWidth="1.6" strokeDasharray="3 3" />
      <path d={`M ${B[0] - m} ${B[1]} L ${B[0] - m} ${B[1] - m} L ${B[0]} ${B[1] - m}`} fill="none" stroke="#1f2430" strokeWidth="1.5" />
      <text x={x0 + w / 2} y={y0 + h + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{bText}</text>
      <text x={x0 + w + 8} y={y0 + h / 2 + 4} fontSize="14" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{hText}</text>
    </svg>
  );
}

const D02_ANS = 12;
const D02_T = {
  uz: {
    eyebrow: 'Yuzani toping', setup: "Devorga uchburchak shaklidagi plakat osilgan: asosi 6 sm, balandligi 4 sm.",
    ask: 'Uchburchak yuzasini toping (sm²):', bText: '6 sm', hText: '4 sm',
    correct: "To'g'ri. 6 × 4 = 24, keyin : 2 = 12 sm².",
    wrong: "Bu — to'rtburchakning yarmi. Butun to'rtburchak yuzasidan yarmini olish uchun qaysi amal kerak?",
    rule: "Avval ko'paytiring, keyin 2 ga bo'ling.",
  },
  ru: {
    eyebrow: 'Найди площадь', setup: 'На стене висит плакат в форме треугольника: основание 6 см, высота 4 см.',
    ask: 'Найди площадь треугольника (см²):', bText: '6 sm', hText: '4 sm',
    correct: 'Верно. 6 × 4 = 24, затем : 2 = 12 см².',
    wrong: 'Это половина прямоугольника. Какое действие нужно, чтобы из площади всего прямоугольника получить половину?',
    rule: 'Сначала умножь, потом раздели на 2.',
  },
};

export default function D36_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'tri_basic', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : HUE.d;
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d36-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}><TriFig bText={t.bText} hText={t.hText} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#374151' }}>S =</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151' }}>sm²</span>
      </div>
      {revealed && (
        <div className="d36-pop" style={{ ...S.mono, textAlign: 'center', marginTop: 12, padding: '10px', borderRadius: 12, fontSize: 15, fontWeight: 800, color: HUE.d, background: HUE.l, border: '1.5px solid ' + HUE.m }}>6 × 4 = 24 → 24 : 2 = 12</div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
