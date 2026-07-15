// Dars35 · Amaliyot 04 — Qaysi yuza katta · 🟡 · tag: area_compare
// Taqqoslash: A = 2,5 × 4 = 10, B = 5 × 2 = 10 → yuzalar TENG (shakli har xil bo'lsa ham).
// Markaziy xato: "uzunroq/kattaroq ko'ringan yuzasi katta" intuitsiyasi. jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: teal
const C = { dark: '#0f766e', lt: '#f0fdfa', mid: '#99f6e4', fill: '#ccfbf1', stroke: '#14b8a6' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.lt, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d35-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.lt, border: '1.5px solid ' + C.mid, color: C.dark }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// To'rtburchak + tomon yozuvlari (mahsulot ko'rsatilmaydi — javobni oshkor qilmaydi)
function RectCard({ a, b, aLabel, bLabel }) {
  const u = 17, w = a * u, h = b * u;
  const padL = 42, padR = 12, padT = 8, padB = 24;
  const W = padL + w + padR, H = padT + h + padB;
  const x0 = padL, y0 = padT;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <rect x={x0} y={y0} width={w} height={h} rx="3" fill={C.fill} stroke={C.stroke} strokeWidth="2" />
      <text x={x0 + w / 2} y={y0 + h + 17} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.dark} fontFamily="'JetBrains Mono', monospace">{aLabel} m</text>
      <text x={x0 - 6} y={y0 + h / 2 + 4} textAnchor="end" fontSize="12.5" fontWeight="800" fill={C.dark} fontFamily="'JetBrains Mono', monospace">{bLabel} m</text>
    </svg>
  );
}

const D04_CORRECT = 2; // 0=A, 1=B, 2=teng
const D04_T = {
  uz: {
    eyebrow: 'Qaysi yuza katta', setup: "Ikki bog'cha bo'lagi berilgan: A va B.",
    ask: 'Qaysi birining yuzasi kattaroq?',
    opts: ['A kattaroq', 'B kattaroq', 'Ikkalasi teng'],
    correct: "To'g'ri. A: 2,5 × 4 = 10; B: 5 × 2 = 10. Shakli har xil, ammo yuza teng.",
    wrong: "Uzunroq ko'ringan shakl doim yuzasi kattami? Har birining ichiga nechta birlik katak sig'ishini o'ylab solishtiring.",
    rule: "Shakli har xil bo'lsa ham yuza teng bo'lishi mumkin.",
  },
  ru: {
    eyebrow: 'Где площадь больше', setup: 'Даны два участка сада: A и B.',
    ask: 'У какого площадь больше?',
    opts: ['A больше', 'B больше', 'Равны'],
    correct: 'Верно. A: 2,5 × 4 = 10; B: 5 × 2 = 10. Форма разная, а площадь равна.',
    wrong: 'Всегда ли фигура, что кажется длиннее, больше по площади? Сравни, сколько единичных квадратов помещается внутри каждой.',
    rule: 'При разной форме площадь может быть равной.',
  },
};

export default function D35_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick, label: t.opts[pick] }, correctAnswer: { idx: D04_CORRECT }, correct, meta: { tag: 'area_compare', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d35-pop { animation: d35pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d35pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d35-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 22, margin: '10px 0 6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>A</span>
          <RectCard a={2.5} b={4} aLabel="2,5" bLabel="4" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>B</span>
          <RectCard a={5} b={2} aLabel="5" bLabel="2" />
        </div>
      </div>
      {revealed && <div className="d35-pop" style={{ ...S.mono, textAlign: 'center', fontSize: 14.5, fontWeight: 800, color: C.dark, margin: '4px 0' }}>2,5 × 4 = 10 &nbsp;=&nbsp; 5 × 2 = 10</div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = C.dark; bg = C.lt; }
          if (checked && on) { const ok = i === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ flex: 1, minHeight: 54, padding: '10px 6px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
