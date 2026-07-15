// Dars35 · Amaliyot 03 — Kvadrat maydoncha · 🟢 · tag: area_square
// Rasm-masala: kvadrat maydoncha tomoni 4 m. Boshda o'tloq konturi; to'g'ri javobdan keyin 4×4 to'r ochiladi.
// S = 4 × 4 = 16 m². "16 m² to'g'rimi?" → Ha. jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: green
const C = { dark: '#15803d', lt: '#f0fdf4', mid: '#bbf7d0', tile: '#86efac', tileLn: '#22c55e', floor: '#f0fdf4', floorLn: '#86efac' };
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
const N = 4, CELL = 32;
function LawnOutline() {
  const s = N * CELL;
  return (
    <svg width={s + 2} height={s + 2} viewBox={`0 0 ${s + 2} ${s + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={s} height={s} rx="8" fill="#dcfce7" stroke={C.dark} strokeWidth="2.4" />
    </svg>
  );
}
function TileGrid() {
  const s = N * CELL;
  return (
    <svg width={s + 2} height={s + 2} viewBox={`0 0 ${s + 2} ${s + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={s} height={s} rx="4" fill={C.floor} stroke={C.floorLn} strokeWidth="1.5" />
      {Array.from({ length: N }).map((_, r) => Array.from({ length: N }).map((_, c) => (
        <rect key={r + '-' + c} className="d35-tile" style={{ animationDelay: (r * 0.12 + c * 0.04) + 's' }}
          x={1 + c * CELL + 1.5} y={1 + r * CELL + 1.5} width={CELL - 3} height={CELL - 3} rx="3" fill={C.tile} stroke={C.tileLn} strokeWidth="1.4" />
      )))}
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: 'Kvadrat maydoncha', setup: "Alisher kvadrat maydonchaning tomonini o'lchadi: 4 m. U yuzasi 16 m² dedi.",
    ask: "S = 16 m² — to'g'rimi?", yes: 'Ha', no: "Yo'q",
    correct: "Ha. Kvadrat: 4 × 4 = 16 ta birlik kvadrat = 16 m².",
    wrong: "Kvadratning ikkala tomoni teng — yuzani topishda tomon o'ziga necha marta olinishini o'ylang.",
    rule: "Kvadrat: S = a × a.",
  },
  ru: {
    eyebrow: 'Квадратная площадка', setup: 'Алишер измерил сторону квадратной площадки: 4 м. Он сказал, площадь 16 м².',
    ask: 'S = 16 м² — верно?', yes: 'Да', no: 'Нет',
    correct: 'Да. Квадрат: 4 × 4 = 16 единичных квадратов = 16 м².',
    wrong: 'У квадрата обе стороны равны — подумай, сколько раз сторона берётся при поиске площади.',
    rule: 'Квадрат: S = a × a.',
  },
};

export default function D35_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'area_square', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = C.dark; bg = C.lt; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d35-pop { animation: d35pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d35pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d35-drop { animation: d35drop .5s ease both; }
        @keyframes d35drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .d35-tile { animation: d35til .45s ease both; }
        @keyframes d35til { 0% { opacity: 0; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .d35-pop, .d35-drop, .d35-tile { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
        <div className={revealed ? 'd35-pop' : ''} style={{ display: 'inline-flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>4 m</span>
            {revealed ? <TileGrid /> : <LawnOutline />}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
            <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, visibility: 'hidden' }}>4 m</span>
            <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark, width: 130, textAlign: 'center' }}>4 m</span>
          </div>
        </div>
      </div>
      {revealed && <div className="d35-drop" style={{ ...S.mono, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.dark, margin: '2px 0 4px' }}>4 × 4 = 16</div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
