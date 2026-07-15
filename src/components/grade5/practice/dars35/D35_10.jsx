// Dars35 · Amaliyot 10 — Kvadrat tomoni · 🔴 · tag: area_square_inverse_mcq
// Vizual-MCQ: kvadrat yuzasi 49 m², tomoni = 7 m (7×7=49). Distraktorlar: 6 (6×6=36), 8 (8×8=64).
// To'g'ri javobdan keyin 7×7 to'r ochiladi. jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: cyan
const C = { dark: '#0e7490', lt: '#ecfeff', mid: '#a5f3fc', fill: '#cffafe', stroke: '#06b6d4', tile: '#67e8f9', tileLn: '#06b6d4', floor: '#f2feff', floorLn: '#67e8f9' };
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
const N = 7, CELL = 15;
function TileGrid() {
  const s = N * CELL;
  return (
    <svg width={s + 2} height={s + 2} viewBox={`0 0 ${s + 2} ${s + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={s} height={s} rx="4" fill={C.floor} stroke={C.floorLn} strokeWidth="1.5" />
      {Array.from({ length: N }).map((_, r) => Array.from({ length: N }).map((_, c) => (
        <rect key={r + '-' + c} className="d35-tile" style={{ animationDelay: (r * 0.06 + c * 0.02) + 's' }}
          x={1 + c * CELL + 1} y={1 + r * CELL + 1} width={CELL - 2} height={CELL - 2} rx="2" fill={C.tile} stroke={C.tileLn} strokeWidth="1" />
      )))}
    </svg>
  );
}

const D10_OPTS = ['6', '7', '8'];
const D10_CORRECT = 1;
const D10_T = {
  uz: {
    eyebrow: 'Kvadrat tomoni', setup: "Rustam kvadrat maydonchaning yuzasini 49 m² deb topdi. Tomoni noma'lum.",
    ask: 'Kvadratning bir tomoni qaysi biriga teng?',
    correct: "To'g'ri. Qaysi son o'ziga ko'paytirilsa 49 bo'ladi? 7 × 7 = 49 → tomon 7 m.",
    wrong: "Kvadratning ikkala tomoni teng. Qaysi son o'ziga ko'paytirilganda berilgan yuza chiqadi?",
    rule: "Kvadrat tomoni — yuzasidan teskari: 7 × 7 = 49.",
  },
  ru: {
    eyebrow: 'Сторона квадрата', setup: 'Рустам нашёл площадь квадратной площадки: 49 м². Сторона неизвестна.',
    ask: 'Чему равна сторона квадрата?',
    correct: 'Верно. Какое число при умножении на себя даёт 49? 7 × 7 = 49 → сторона 7 м.',
    wrong: 'У квадрата обе стороны равны. Какое число при умножении на себя даёт данную площадь?',
    rule: 'Сторона квадрата — обратно из площади: 7 × 7 = 49.',
  },
};

export default function D35_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((o, i) => ({ id: String(i), label: o + ' m' })), studentAnswer: { idx: pick }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'area_square_inverse_mcq', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const side = 110;
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '10px 0 6px' }}>
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: revealed ? '#1a7f43' : C.dark }}>{revealed ? '7 m' : '? m'}</span>
        <div className={revealed ? 'd35-pop' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {revealed ? <TileGrid /> : (
            <svg width={side + 2} height={side + 2} viewBox={`0 0 ${side + 2} ${side + 2}`} style={{ display: 'block' }}>
              <rect x="1" y="1" width={side} height={side} rx="6" fill={C.fill} stroke={C.stroke} strokeWidth="2" />
              <text x={1 + side / 2} y={1 + side / 2 + 8} textAnchor="middle" fontSize="22" fontWeight="800" fill={C.dark} fontFamily="'JetBrains Mono', monospace">S = 49</text>
            </svg>
          )}
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: revealed ? '#1a7f43' : C.dark }}>{revealed ? '7 m' : '? m'}</span>
        </div>
      </div>
      {revealed && <div className="d35-drop" style={{ ...S.mono, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.dark, margin: '2px 0 4px' }}>7 × 7 = 49</div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
        {D10_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = C.dark; bg = C.lt; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}>
              <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{o} m</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
