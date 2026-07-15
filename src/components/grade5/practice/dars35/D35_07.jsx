// Dars35 · Amaliyot 07 — Yetishmagan tomon · 🔴 · tag: area_inverse
// Teskari masala: S = 24 m², bir tomoni 6 m. Ikkinchi tomon = 24 : 6 = 4 m.
// To'g'ri javobdan keyin to'r ochilib yetishgan tomon ko'rinadi. jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: indigo
const C = { dark: '#4338ca', lt: '#eef2ff', mid: '#c7d2fe', fill: '#e0e7ff', stroke: '#6366f1', tile: '#a5b4fc', tileLn: '#6366f1', floor: '#f5f6ff', floorLn: '#a5b4fc' };
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
const COLS = 6, ROWS = 4, CELL = 26;
function TileGrid() {
  const w = COLS * CELL, h = ROWS * CELL;
  return (
    <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w} height={h} rx="4" fill={C.floor} stroke={C.floorLn} strokeWidth="1.5" />
      {Array.from({ length: ROWS }).map((_, r) => Array.from({ length: COLS }).map((_, c) => (
        <rect key={r + '-' + c} className="d35-tile" style={{ animationDelay: (r * 0.12 + c * 0.04) + 's' }}
          x={1 + c * CELL + 1.5} y={1 + r * CELL + 1.5} width={CELL - 3} height={CELL - 3} rx="3" fill={C.tile} stroke={C.tileLn} strokeWidth="1.2" />
      )))}
    </svg>
  );
}

const D07_ANS = 4;
const D07_T = {
  uz: {
    eyebrow: 'Yetishmagan tomon', setup: "To'rtburchak yuzasi 24 m². Bir tomoni 6 m, ikkinchisi noma'lum.",
    ask: 'Ikkinchi tomon qancha (m)?', unit: 'm',
    correct: "To'g'ri. 24 : 6 = 4 m.",
    wrong: "Yuza ikki tomondan hosil bo'lgan. Ma'lum tomon va yuza berilgan bo'lsa, yetishmaganini qanday amal bilan topasiz?",
    rule: "Yetishmagan tomon = yuza : ma'lum tomon.",
  },
  ru: {
    eyebrow: 'Недостающая сторона', setup: 'Площадь прямоугольника 24 м². Одна сторона 6 м, другая неизвестна.',
    ask: 'Чему равна вторая сторона (м)?', unit: 'м',
    correct: 'Верно. 24 : 6 = 4 м.',
    wrong: 'Площадь получена из двух сторон. Если известны площадь и одна сторона, каким действием найти вторую?',
    rule: 'Недостающая сторона = площадь : известная сторона.',
  },
};

export default function D35_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D07_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D07_ANS }, correct, meta: { tag: 'area_inverse', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.dark;
  const revealed = checked && fb?.correct;
  const w = 156, h = 100;
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
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: revealed ? '#1a7f43' : C.dark }}>{revealed ? '4 m' : '? m'}</span>
        <div className={revealed ? 'd35-pop' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {revealed ? <TileGrid /> : (
            <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
              <rect x="1" y="1" width={w} height={h} rx="6" fill={C.fill} stroke={C.stroke} strokeWidth="2" />
              <text x={1 + w / 2} y={1 + h / 2 + 8} textAnchor="middle" fontSize="22" fontWeight="800" fill={C.dark} fontFamily="'JetBrains Mono', monospace">S = 24</text>
            </svg>
          )}
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>6 m</span>
        </div>
      </div>
      {revealed && <div className="d35-drop" style={{ ...S.mono, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.dark, margin: '2px 0 4px' }}>24 : 6 = 4</div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 84, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#475569' }}>{t.unit}</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
