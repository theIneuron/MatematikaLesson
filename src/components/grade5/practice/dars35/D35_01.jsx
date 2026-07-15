// Dars35 · Amaliyot 01 — Yuza nima · 🟢 · tag: area_concept
// Yuza — shakl ichini to'ldiruvchi birlik kvadratlar soni (chegara emas). Vizual: to'r plitka bilan to'ladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: orange
const C = { dark: '#b45309', lt: '#fff7ed', mid: '#fed7aa', tile: '#fcd34d', tileLn: '#f59e0b', floor: '#fffdf5', floorLn: '#e5c07b' };
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
function AreaGrid({ cols, rows, filledRows, cell = 30, animate = true }) {
  const w = cols * cell, h = rows * cell;
  return (
    <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w} height={h} rx="4" fill={C.floor} stroke={C.floorLn} strokeWidth="1.5" />
      {Array.from({ length: rows }).map((_, r) => r < filledRows && Array.from({ length: cols }).map((_, c) => (
        <rect key={r + '-' + c} className={animate ? 'd35-tile' : undefined} style={animate ? { animationDelay: (r * 0.13) + 's' } : undefined}
          x={1 + c * cell + 1.5} y={1 + r * cell + 1.5} width={cell - 3} height={cell - 3} rx="3" fill={C.tile} stroke={C.tileLn} strokeWidth="1.4" />
      )))}
    </svg>
  );
}

const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Yuza nima', setup: "Bekzod to'rtburchak polni 1×1 birlik kvadratlar bilan to'ldirdi.",
    ask: 'Yuza nima?',
    opts: ["Ichiga sig'adigan birlik kvadratlar soni", 'Chegara uzunligi', 'Tomonlar soni'],
    correct: "To'g'ri. Yuza — shakl ichini to'ldiruvchi birlik kvadratlar soni.",
    wrong: "Yuza shaklning ichimi yoki chetimi? Plitkalar shaklning qayerini to'ldirganini o'ylang.",
    rule: "Yuza — ichini to'ldirgan kvadratlar soni.",
  },
  ru: {
    eyebrow: 'Что такое площадь', setup: 'Бекзод заполнил прямоугольный пол единичными квадратами 1×1.',
    ask: 'Что такое площадь?',
    opts: ['Число единичных квадратов, помещающихся внутри', 'Длина границы', 'Число сторон'],
    correct: 'Верно. Площадь — число единичных квадратов, заполняющих фигуру внутри.',
    wrong: 'Площадь — это внутри фигуры или её край? Подумай, что заполняют плитки.',
    rule: 'Площадь — число квадратов, заполняющих фигуру внутри.',
  },
};

export default function D35_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'area_concept', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d35-pop { animation: d35pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d35pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d35-tile { animation: d35til .45s ease both; }
        @keyframes d35til { 0% { opacity: 0; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .d35-pop, .d35-tile { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 14px', padding: '12px', borderRadius: 14, background: C.lt, border: '1.5px solid ' + C.mid }}>
        <AreaGrid cols={4} rows={3} filledRows={3} />
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = C.dark; bg = C.lt; col = '#1f2430'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
