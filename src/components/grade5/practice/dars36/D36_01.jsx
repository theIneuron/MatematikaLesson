// Dars36 · Amaliyot 01 — Qaysi formula · 🟢 · tag: tri_formula
// Uchburchak yuzasi formulasini tanlash. Vizual: to'rtburchak diagonal bo'yicha yarmiga buklanadi (reveal).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: orange
const HUE = { d: '#b45309', l: '#fff7ed', m: '#fed7aa', deep: '#9a3412', fill: '#f97316' };
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
// Javobdan OLDIN: reveal animatsiyasidagi asosiy uchburchak bilan bir xil (o'rni/o'lchami mos — sakramaydi).
function TriGlyph() {
  const w = 176, h = 108, pad = 26, x0 = pad, y0 = pad, W = w + pad * 2, H = h + pad * 2;
  const A = [x0, y0 + h], B = [x0 + w, y0 + h], C = [x0 + w, y0], m = 12;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={HUE.fill} fillOpacity="0.55" stroke={HUE.d} strokeWidth="2" strokeLinejoin="round" />
      <path d={`M ${B[0] - m} ${B[1]} L ${B[0] - m} ${B[1] - m} L ${B[0]} ${B[1] - m}`} fill="none" stroke={HUE.d} strokeWidth="1.6" />
    </svg>
  );
}
// Javobdan KEYIN: ikkinchi (to'ldiruvchi) uchburchak siljib kirib to'rtburchak hosil qiladi (reveal).
function RectFromTwoTris() {
  const w = 176, h = 108, pad = 26, x0 = pad, y0 = pad, W = w + pad * 2, H = h + pad * 2;
  const A = [x0, y0 + h], B = [x0 + w, y0 + h], C = [x0 + w, y0], D = [x0, y0], m = 12;
  const cx = (A[0] + B[0] + C[0]) / 3, cy = (A[1] + B[1] + C[1]) / 3;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={HUE.fill} fillOpacity="0.55" stroke={HUE.d} strokeWidth="2" strokeLinejoin="round" />
      <polygon className="d36-second" points={`${A[0]},${A[1]} ${C[0]},${C[1]} ${D[0]},${D[1]}`} fill={HUE.fill} fillOpacity="0.28" stroke={HUE.d} strokeWidth="2" strokeLinejoin="round" />
      <line className="d36-diag" x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} stroke={HUE.deep} strokeWidth="2.5" />
      <path d={`M ${B[0] - m} ${B[1]} L ${B[0] - m} ${B[1] - m} L ${B[0]} ${B[1] - m}`} fill="none" stroke={HUE.d} strokeWidth="1.6" />
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="22" fontWeight="800" fill={HUE.deep} style={{ fontFamily: 'JetBrains Mono, monospace' }}>½</text>
    </svg>
  );
}

const D01_CORRECT = 1;
const D01_T = {
  uz: {
    eyebrow: 'Formula', setup: "Diagonal to'rtburchakni ikkita bir xil uchburchakka ajratadi.",
    ask: 'Uchburchak yuzasi formulasi qaysi?',
    opts: ['asos × balandlik', '(asos × balandlik) : 2', 'asos + balandlik'],
    correct: "To'g'ri. Uchburchak — to'rtburchakning yarmi, shuning uchun : 2.",
    wrong: "Diagonal to'rtburchakni nechta teng bo'lakka ajratadi? Bir uchburchak — shulardan biri. Shu nisbatga mos amalli formulani tanlang.",
    rule: "S = (asos × balandlik) : 2.",
  },
  ru: {
    eyebrow: 'Формула', setup: 'Диагональ делит прямоугольник на два одинаковых треугольника.',
    ask: 'Какая формула площади треугольника?',
    opts: ['основание × высота', '(основание × высота) : 2', 'основание + высота'],
    correct: 'Верно. Треугольник — половина прямоугольника, поэтому : 2.',
    wrong: 'На сколько равных частей диагональ делит прямоугольник? Один треугольник — одна из них. Выбери формулу с действием, дающим эту долю.',
    rule: 'S = (основание × высота) : 2.',
  },
};

export default function D36_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick, label: t.opts[pick] }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'tri_formula', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d36-diag { stroke-dasharray: 340; stroke-dashoffset: 340; animation: d36draw .7s ease .1s forwards; }
        @keyframes d36draw { to { stroke-dashoffset: 0; } }
        .d36-second { opacity: 0; animation: d36slide .7s cubic-bezier(.34,1.2,.64,1) .45s forwards; }
        @keyframes d36slide { 0% { opacity: 0; transform: translate(14px, -14px); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d36-pop,.d36-diag,.d36-second { animation: none !important; } .d36-diag { stroke-dashoffset: 0; } .d36-second { opacity: 1; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}>
        {revealed ? <RectFromTwoTris /> : <TriGlyph />}
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = HUE.d; bg = HUE.l; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', ...S.mono }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
