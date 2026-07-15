// Dars35 · Amaliyot 09 — Yuza va perimetr · 🔴 · tag: area_vs_peri
// To'rtburchak 6×2. Yuza (ichi) = 6 × 2 = 12 m²; perimetr (chegara) = 2 × (6 + 2) = 16 m.
// Boshda faqat kontur (ichi to'ldirilmagan); to'g'ri javobdan keyin ichki plitkalar ochiladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: purple
const C = { dark: '#7c3aed', lt: '#faf5ff', mid: '#e9d5ff', tile: '#c4b5fd', tileLn: '#8b5cf6', floor: '#faf5ff', floorLn: '#c4b5fd', peri: '#b45309' };
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

const D09_AREA = 12, D09_PERI = 16;
const D09_T = {
  uz: {
    eyebrow: 'Yuza va perimetr', setup: "Sabina 6 m × 2 m maydonchani chizdi. Ichi — yuza, qalin chegara — perimetr.",
    askA: 'Yuza (m²):', askP: 'Perimetr (m):',
    correct: "To'g'ri. Yuza: 6 × 2 = 12 m² (ichi). Perimetr: 2 × (6 + 2) = 16 m (chegara).",
    wrong: "Ichni to'ldirish bilan chegara bo'ylab yurish har xil amal talab qiladi — har biriga mos amalni tanlang.",
    rule: "Yuza — ichi (m²); perimetr — chegara (m).",
  },
  ru: {
    eyebrow: 'Площадь и периметр', setup: 'Сабина начертила площадку 6 м × 2 м. Внутри — площадь, жирная граница — периметр.',
    askA: 'Площадь (м²):', askP: 'Периметр (м):',
    correct: 'Верно. Площадь: 6 × 2 = 12 м² (внутри). Периметр: 2 × (6 + 2) = 16 м (граница).',
    wrong: 'Заполнить внутри и пройти по границе — разные действия; выбери подходящее для каждого.',
    rule: 'Площадь — внутри (м²); периметр — граница (м).',
  },
};

export default function D35_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [p, setP] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.area != null) setA(String(sa.area)); if (sa.peri != null) setP(String(sa.peri)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(a.trim()) && /^\d+$/.test(p.trim()) && !checked); }, [a, p, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D09_AREA && parseInt(p, 10) === D09_PERI;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.askA + ' / ' + t.askP, options: [], studentAnswer: { area: parseInt(a, 10), peri: parseInt(p, 10) }, correctAnswer: { area: D09_AREA, peri: D09_PERI }, correct, meta: { tag: 'area_vs_peri', level: '🔴' } });
  }, [a, p, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const cell = 34, cols = 6, rows = 2, w = cols * cell, h = rows * cell;
  const field = (label, val, setVal, color) => {
    const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : color;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color }}>{label}</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 84, height: 50, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
    );
  };
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, margin: '10px 0 6px' }}>
        <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>2 m</span>
        <div className={revealed ? 'd35-pop' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <svg width={w + 4} height={h + 4} viewBox={`0 0 ${w + 4} ${h + 4}`} style={{ display: 'block' }}>
            {revealed
              ? Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, c) => (
                  <rect key={r + '-' + c} className="d35-tile" style={{ animationDelay: (r * 0.14 + c * 0.05) + 's' }} x={2 + c * cell + 1.5} y={2 + r * cell + 1.5} width={cell - 3} height={cell - 3} rx="3" fill={C.tile} stroke={C.tileLn} strokeWidth="1.2" />
                )))
              : <rect x="2" y="2" width={w} height={h} rx="4" fill={C.floor} />}
            <rect x="2" y="2" width={w} height={h} rx="4" fill="none" stroke={C.peri} strokeWidth="3.4" />
          </svg>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>6 m</span>
        </div>
      </div>
      {revealed && <div className="d35-pop" style={{ ...S.mono, textAlign: 'center', fontSize: 13.5, fontWeight: 800, color: C.dark, margin: '2px 0 4px' }}>6 × 2 = 12   ·   2 × (6 + 2) = 16</div>}
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', margin: '10px 0 4px' }}>
        {field(t.askA, a, setA, C.dark)}
        {field(t.askP, p, setP, C.peri)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
