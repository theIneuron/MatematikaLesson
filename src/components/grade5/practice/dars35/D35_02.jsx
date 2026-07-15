// Dars35 · Amaliyot 02 — Xona poli · 🟢 · tag: area_rect
// Rasm-masala: xona 5 m × 3 m. Boshda faqat xona konturi + o'lchamlar; to'g'ri javobdan keyin plitka to'ri ochiladi.
// Yuza = 5 × 3 = 15 m². Distraktorlar: 8 (=5+3), 16 (perimetr). jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: blue
const C = { dark: '#1d4ed8', lt: '#eff6ff', mid: '#bfdbfe', tile: '#93c5fd', tileLn: '#3b82f6', floor: '#f8fbff', floorLn: '#93c5fd' };
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
const COLS = 5, ROWS = 3, CELL = 32;
// Kontur (javobdan oldin): faqat xona chegarasi, plitka yo'q
function RoomOutline() {
  const w = COLS * CELL, h = ROWS * CELL;
  return (
    <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w} height={h} rx="6" fill={C.floor} stroke={C.dark} strokeWidth="2.4" />
    </svg>
  );
}
// Plitka to'ri (javobdan keyin ochiladi)
function TileGrid() {
  const w = COLS * CELL, h = ROWS * CELL;
  return (
    <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w} height={h} rx="4" fill={C.floor} stroke={C.floorLn} strokeWidth="1.5" />
      {Array.from({ length: ROWS }).map((_, r) => Array.from({ length: COLS }).map((_, c) => (
        <rect key={r + '-' + c} className="d35-tile" style={{ animationDelay: (r * 0.12 + c * 0.04) + 's' }}
          x={1 + c * CELL + 1.5} y={1 + r * CELL + 1.5} width={CELL - 3} height={CELL - 3} rx="3" fill={C.tile} stroke={C.tileLn} strokeWidth="1.4" />
      )))}
    </svg>
  );
}

const D02_CORRECT = 1; // opts[1] = 15
const D02_T = {
  uz: {
    eyebrow: 'Xona poli', setup: "Madina xonasining bo'yi 5 m, eni 3 m. Xonani 1×1 metrli plitkalar bilan qoplamoqchi.",
    ask: 'Nechta plitka kerak (m²)?',
    opts: ['8 m²', '15 m²', '16 m²'],
    correct: "To'g'ri. 5 × 3 = 15 ta plitka = 15 m².",
    wrong: "Bir qatorga qancha plitka joylashadi va nechta qator bor — shu ikkisi orqali o'ylang; tomonlarni qo'shish yuza bermaydi.",
    rule: "To'rtburchak: S = a × b.",
  },
  ru: {
    eyebrow: 'Пол комнаты', setup: 'Длина комнаты Мадины 5 м, ширина 3 м. Она хочет покрыть пол плитками 1×1 метр.',
    ask: 'Сколько плиток нужно (м²)?',
    opts: ['8 м²', '15 м²', '16 м²'],
    correct: 'Верно. 5 × 3 = 15 плиток = 15 м².',
    wrong: 'Подумай, сколько плиток в одном ряду и сколько рядов; сложение сторон площадь не даёт.',
    rule: 'Прямоугольник: S = a × b.',
  },
};

export default function D35_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D02_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D02_CORRECT }, correct, meta: { tag: 'area_rect', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, margin: '10px 0 12px' }}>
        <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>3 m</span>
        <div className={revealed ? 'd35-pop' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {revealed ? <TileGrid /> : <RoomOutline />}
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>5 m</span>
        </div>
      </div>
      {revealed && <div className="d35-drop" style={{ ...S.mono, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>5 × 3 = 15</div>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = C.dark; bg = C.lt; col = '#1f2430'; }
          if (checked && on) { const ok = i === D02_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: 1, textAlign: 'center', padding: '15px 8px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: "'JetBrains Mono', monospace", minHeight: 54 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
