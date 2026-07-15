// Dars33 · Amaliyot 01 — Chiziqni ta'rifga ula · 🟢 · tag: geo_line_match
// Kesma/Nur/To'g'ri chiziq/Burchak ni ta'rifiga moslash. Farq — uchlar soni.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const CY = '#0891b2';
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: CY, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d33-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// Chiziq figuralari
const Seg = () => (<svg width="118" height="34" viewBox="0 0 118 34"><line x1="14" y1="17" x2="104" y2="17" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><circle cx="14" cy="17" r="5.5" fill={CY} /><circle cx="104" cy="17" r="5.5" fill={CY} /></svg>);
const Ray = () => (<svg width="118" height="34" viewBox="0 0 118 34"><line x1="14" y1="17" x2="100" y2="17" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><circle cx="14" cy="17" r="5.5" fill={CY} /><polyline points="94,11 104,17 94,23" fill="none" stroke={CY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Lin = () => (<svg width="118" height="34" viewBox="0 0 118 34"><line x1="16" y1="17" x2="102" y2="17" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><polyline points="24,11 14,17 24,23" fill="none" stroke={CY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="94,11 104,17 94,23" fill="none" stroke={CY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Ang = () => (<svg width="118" height="34" viewBox="0 0 118 34"><line x1="14" y1="30" x2="104" y2="30" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><line x1="14" y1="30" x2="86" y2="4" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><circle cx="14" cy="30" r="5" fill={CY} /></svg>);
const SHAPES = { seg: Seg, ray: Ray, line: Lin, ang: Ang };

const D01_PAIRS = { seg: 'd2', ray: 'd1', line: 'd0', ang: 'dr' };
const LEFT = ['seg', 'ray', 'line', 'ang'];
const RIGHT = ['d1', 'dr', 'd0', 'd2'];
const D01_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Madina to'rt figurani ta'rifi bilan juftlamoqchi. Ular uchlari soni bilan farq qiladi.",
    ask: "Chapdagi figurani tanlang, keyin uning ta'rifini o'ngdan bosing:",
    names: { seg: 'Kesma', ray: 'Nur', line: "To'g'ri chiziq", ang: 'Burchak' },
    defs: { d2: '2 ta uchi bor', d1: '1 ta uchi bor', d0: "uchi yo'q, cheksiz", dr: 'bir uchdan 2 nur' },
    correct: "To'g'ri. Chiziqlar uchlari bilan farq qiladi.",
    wrong: "Har chiziqning nechta uchi (chekkasi) borligini qaytadan sanang.",
    rule: "Kesma — 2 uchi, nur — 1 uchi, to'g'ri chiziq — uchsiz.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Мадина хочет соединить четыре фигуры с их определениями. Они различаются числом концов.',
    ask: 'Выберите фигуру слева, затем нажмите её определение справа:',
    names: { seg: 'Отрезок', ray: 'Луч', line: 'Прямая', ang: 'Угол' },
    defs: { d2: 'есть 2 конца', d1: 'есть 1 конец', d0: 'нет концов, бесконечна', dr: 'два луча из одной точки' },
    correct: 'Верно. Линии различаются числом концов.',
    wrong: 'Посчитай заново, сколько концов у каждой линии.',
    rule: 'Отрезок — 2 конца, луч — 1 конец, прямая — без концов.',
  },
};

export default function D33_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 4;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = LEFT.every((l) => map[l] === D01_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D01_PAIRS, correct, meta: { tag: 'geo_line_match', level: '🟢' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d33-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {LEFT.map((l) => {
            const Fig = SHAPES[l]; const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = CY; bg = '#ecfeff'; }
            if (done) { bd = '#67e8f9'; bg = '#f0fdff'; }
            if (checked && done) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return (
              <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ width: 148, padding: '6px 8px', borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #cffafe' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Fig />
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#1f2430', fontFamily: 'inherit' }}>{t.names[l]}{done ? ' →' : ''}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {RIGHT.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff', col = '#374151';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; col = '#1f2430'; }
            if (checked && used) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 158, minHeight: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', fontSize: 13.5, fontWeight: 700, color: col, fontFamily: 'inherit', padding: '6px 10px', lineHeight: 1.3 }}>{t.defs[r]}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
