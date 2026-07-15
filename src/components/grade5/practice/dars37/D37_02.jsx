// Dars37 · Amaliyot 02 — Necha kubcha · 🟢 · tag: vol_box
// Quti 3 × 2 × 2, birlik kublar bilan qatlam-qatlam to'ladi. Hajm = 3 × 2 × 2 = 12 kubcha.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#be123c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
function CubeBox({ a, b, c, u = 26, dp = 0.5, animate = true, layerDelay = 0.45 }) {
  const list = [];
  for (let k = 0; k < c; k++) for (let j = 0; j < b; j++) for (let i = 0; i < a; i++) list.push({ i, j, k });
  list.sort((p, q) => (q.j - p.j) || (p.k - q.k) || (p.i - q.i));
  const px = (i, j, k) => [i * u + j * u * dp, -(j * u * dp) - k * u];
  const tx = 4, ty = b * u * dp + c * u + 4;
  const W = a * u + b * u * dp + 8, H = c * u + b * u * dp + 8;
  const TOP = '#ffe4e6', FRONT = '#fda4af', RIGHT = '#f43f5e', LN = '#9f1239';
  const poly = (pts, fill) => <polygon points={pts.map(([x, y]) => `${(x + tx).toFixed(1)},${(y + ty).toFixed(1)}`).join(' ')} fill={fill} stroke={LN} strokeWidth="0.8" strokeLinejoin="round" />;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      {list.map(({ i, j, k }, idx) => {
        const c000 = px(i, j, k), c100 = px(i + 1, j, k), c110 = px(i + 1, j + 1, k);
        const c001 = px(i, j, k + 1), c101 = px(i + 1, j, k + 1), c011 = px(i, j + 1, k + 1), c111 = px(i + 1, j + 1, k + 1);
        return (
          <g key={idx} className={animate ? 'd37-cube' : undefined} style={animate ? { animationDelay: (k * layerDelay).toFixed(2) + 's' } : undefined}>
            {poly([c001, c101, c111, c011], TOP)}
            {poly([c000, c100, c101, c001], FRONT)}
            {poly([c100, c110, c111, c101], RIGHT)}
          </g>
        );
      })}
    </svg>
  );
}

const D02_ANS = 12;
const D02_T = {
  uz: {
    eyebrow: 'Necha kubcha', setup: "Alisher qutini birlik kubchalar bilan qatlam-qatlam to'ldirdi. Uzunligi 3, eni 2, balandligi 2 kubcha.",
    ask: 'Qutining hajmi necha kubcha?',
    correct: "To'g'ri. 3 × 2 × 2 = 12 kubcha.",
    wrong: "Quti bir xil qatlamlardan tuzilgan. Bitta qatlam va qatlamlar soni birga hajmni qanday hosil qiladi?",
    rule: "V = a × b × c.",
  },
  ru: {
    eyebrow: 'Сколько кубиков', setup: 'Алишер заполнил коробку единичными кубиками слой за слоем. Длина 3, ширина 2, высота 2 кубика.',
    ask: 'Каков объём коробки в кубиках?',
    correct: 'Верно. 3 × 2 × 2 = 12 кубиков.',
    wrong: 'Коробка состоит из одинаковых слоёв. Как один слой и число слоёв вместе дают объём?',
    rule: 'V = a × b × c.',
  },
};

export default function D37_02(props) {
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'vol_box', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d37-cube { animation: d37rise .5s ease both; transform-box: fill-box; }
        @keyframes d37rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop, .d37-cube { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 6px' }}>
        <CubeBox a={3} b={2} c={2} />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 78, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 17, fontWeight: 700, color: '#6b7280' }}>{lang === 'uz' ? 'kubcha' : 'кубиков'}</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
