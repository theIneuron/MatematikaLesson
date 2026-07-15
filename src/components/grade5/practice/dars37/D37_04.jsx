// Dars37 · Amaliyot 04 — Parallelepiped hajmi · 🟡 · tag: vol_rect_pick
// Quti 4 × 3 × 2 sm. Bir qatlam 4 × 3 = 12, ikki qatlam → 24 sm³. Vizual: ajratilgan qatlamlar (exploded).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0f766e', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
// To'liq 3D parallelepiped (a×b×c): uch ko'rinadigan yog' + qirra o'lchamlari.
// Ichki birlik-to'r YO'Q — javobni (hajmni) oshkor qilmaydi, V = a×b×c bilan hisoblanadi.
function RectBox({ a, b, c, U = 30, dp = 0.5, animate = true }) {
  const w = a * U, h = c * U;
  const dx = b * U * dp, dy = -b * U * dp;
  const pad = 24, padL = 44; // padL — chap tik qirra yorlig'iga joy
  const bx = padL, by = pad + h + (-dy);
  const bl = [bx, by], br = [bx + w, by], tr = [bx + w, by - h], tl = [bx, by - h];
  const tlb = [bx + dx, by - h + dy], trb = [bx + w + dx, by - h + dy], brb = [bx + w + dx, by + dy];
  const P = (arr) => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const TOP = '#99f6e4', RIGHT = '#5eead4', FRONT = '#ccfbf1', LN = '#0f766e';
  const W = bx + w + dx + pad + 18, H = by + pad;
  const lbl = { fontSize: '13.5', fontWeight: '800', fill: LN, fontFamily: "'JetBrains Mono', monospace", stroke: '#fff', strokeWidth: '3.5', paintOrder: 'stroke', strokeLinejoin: 'round' };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <g className={animate ? 'd37-slab' : undefined}>
        <polygon points={P([tl, tlb, trb, tr])} fill={TOP} stroke={LN} strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points={P([br, brb, trb, tr])} fill={RIGHT} stroke={LN} strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points={P([bl, br, tr, tl])} fill={FRONT} stroke={LN} strokeWidth="2" strokeLinejoin="round" />
        <text x={(bl[0] + br[0]) / 2} y={by + 17} textAnchor="middle" {...lbl}>{a} sm</text>
        <text x={bl[0] - 7} y={(bl[1] + tl[1]) / 2 + 5} textAnchor="end" {...lbl}>{c} sm</text>
        <text x={(br[0] + brb[0]) / 2 + 12} y={(br[1] + brb[1]) / 2 + 16} textAnchor="start" {...lbl}>{b} sm</text>
      </g>
    </svg>
  );
}

const D04_OPTS = [12, 24, 9, 48]; // 12=faqat bir qatlam, 9=qo'shish, 48=ikki barobar
const D04_CORRECT = 1;            // 24 = 4 × 3 × 2
const D04_T = {
  uz: {
    eyebrow: 'Hajmni tanlang', setup: "Bekzod qutini kubchalar bilan to'ldirdi: uzunligi 4 sm, eni 3 sm, balandligi 2 sm.",
    ask: 'Qutining hajmi qancha (sm³)?', unit: 'sm³',
    correct: "To'g'ri. 4 × 3 = 12; 12 × 2 = 24 sm³.",
    wrong: "Quti bir xil qatlamlardan tuzilgan. Bitta qatlam va qatlamlar soni birga hajmni qanday hosil qiladi?",
    rule: "V = a × b × c.",
  },
  ru: {
    eyebrow: 'Выбери объём', setup: 'Бекзод заполнил коробку кубиками: длина 4 см, ширина 3 см, высота 2 см.',
    ask: 'Каков объём коробки (см³)?', unit: 'см³',
    correct: 'Верно. 4 × 3 = 12; 12 × 2 = 24 см³.',
    wrong: 'Коробка состоит из одинаковых слоёв. Как один слой и число слоёв вместе дают объём?',
    rule: 'V = a × b × c.',
  },
};

export default function D37_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((v, i) => ({ id: String(i), label: v + ' ' + t.unit })), studentAnswer: { idx: picked, value: D04_OPTS[picked] }, correctAnswer: { idx: D04_CORRECT, value: D04_OPTS[D04_CORRECT] }, correct, meta: { tag: 'vol_rect_pick', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d37-slab { animation: d37rise .5s ease both; transform-box: fill-box; }
        @keyframes d37rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop, .d37-slab { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 6px' }}>
        <RectBox a={4} b={3} c={2} animate={!isReview} />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '8px 0' }}>
        {D04_OPTS.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; }
          if (checked && on) { const ok = i === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ height: 62, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 22, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>{o}<span style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>{t.unit}</span></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
