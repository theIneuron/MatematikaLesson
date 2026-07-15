// Dars36 · Amaliyot 10 — Asosni top · 🔴 · tag: tri_inverse_b
// Yuza 15, balandlik 5 → 15×2=30; 30:5=6. Teskari masala: asosni topish. Figurada asos "?" reveal.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: fuchsia
const HUE = { d: '#a21caf', l: '#fdf4ff', m: '#f5d0fe', deep: '#86198f', fill: '#d946ef' };
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
// Figurada: balandlik = 5, yuza S = 15 (ichida), asos = ? (yechilgach 6).
function TriUnknownBase({ bText, hText, sText }) {
  const W = 240, H = 156, pad = 30, padR = 50; // padR — o'ng balandlik yorlig'iga joy
  const A = [pad, H - pad], B = [W - padR, H - pad], C = [W - padR, pad];
  const m = 12;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={HUE.fill} fillOpacity="0.32" stroke={HUE.d} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M ${B[0] - m} ${B[1]} L ${B[0] - m} ${B[1] - m} L ${B[0]} ${B[1] - m}`} fill="none" stroke="#1f2430" strokeWidth="1.4" />
      <text x={(A[0] + B[0] + C[0]) / 3} y={(A[1] + B[1] + C[1]) / 3 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={HUE.deep} stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{sText}</text>
      <text x={(A[0] + B[0]) / 2} y={H - pad + 20} textAnchor="middle" fontSize="15" fontWeight="800" fill={HUE.d} stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{bText}</text>
      <text x={B[0] + 8} y={(B[1] + C[1]) / 2 + 4} fontSize="14" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{hText}</text>
    </svg>
  );
}

const D10_ANS = 6;
const D10_T = {
  uz: {
    eyebrow: 'Teskari masala', setup: "Uchburchak yuzasi 15 sm², balandligi 5 sm. Asosi noma'lum.",
    ask: 'Asosini toping (sm):', hText: '5 sm', sText: 'S = 15',
    correct: "To'g'ri. 15 × 2 = 30; keyin 30 : 5 = 6.",
    wrong: "Yuza formulada 2 ga bo'lingan. Berilgan yuza to'liq ko'paytmami yoki uning yarmimi? Shundan boshlab noma'lum asosni izlang.",
    rule: "Asos = (yuza × 2) : balandlik.",
  },
  ru: {
    eyebrow: 'Обратная задача', setup: 'Площадь треугольника 15 см², высота 5 см. Основание неизвестно.',
    ask: 'Найди основание (см):', hText: '5 sm', sText: 'S = 15',
    correct: 'Верно. 15 × 2 = 30; затем 30 : 5 = 6.',
    wrong: 'В формуле площадь делится на 2. Данная площадь — это полное произведение или его половина? Отсюда ищи неизвестное основание.',
    rule: 'Основание = (площадь × 2) : высота.',
  },
};

export default function D36_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value).replace('.', ',')); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+([.,]\d+)?$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.replace(',', '.'));
    const correct = Math.abs(num - D10_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: num }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'tri_inverse_b', level: '🔴' } });
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
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}><TriUnknownBase bText={revealed ? '6 sm' : '?'} hText={t.hText} sText={t.sText} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#374151' }}>asos =</span>
        <input value={val} onChange={(e) => { const p = e.target.value.replace(/[^\d.,]/g, '').replace(/\./g, ',').split(','); setVal((p.length > 1 ? p[0] + ',' + p.slice(1).join('') : p[0]).slice(0, 5)); }} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151' }}>sm</span>
      </div>
      {revealed && (
        <div className="d36-pop" style={{ ...S.mono, textAlign: 'center', marginTop: 12, padding: '10px', borderRadius: 12, fontSize: 15, fontWeight: 800, color: HUE.d, background: HUE.l, border: '1.5px solid ' + HUE.m }}>15 × 2 = 30 → 30 : 5 = 6</div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
