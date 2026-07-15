// Dars29 · Amaliyot 08 — Masala: bo'laklarni yig' · 🔴 · tag: div_build
// Akmalda 4,5 m lenta, har bant 0,5 m. Slayder bilan bo'laklarni 4,5 metrga to'ldir → 9 ta.
// Konstruktor (slayder), bo'sh katak emas. jsx-question kontrakti: onReady/registerCheck/onSubmit. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d29-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_ANS = 9;      // 4,5 : 0,5 = 9 ta bant
const D08_MAX = 12;     // slayder chegarasi
const UNIT = 24;        // 1 bo'lak (0,5 m) piksel kengligi
const fmt = (n) => (n * 0.5).toFixed(1).replace('.', ',');

const D08_T = {
  uz: {
    eyebrow: 'Masala', setup: "Akmalda 4,5 metr lenta bor. Har bir bant uchun 0,5 metr kerak.",
    ask: "Slayderni suring: 0,5 metrli bo'laklar 4,5 metrga yetguncha to'ldiring.",
    target: 'Nishon: 4,5 m', label: 'bant soni',
    correct: "To'g'ri: 4,5 : 0,5 = 9 ta bant. To'qqizta 0,5 metrli bo'lak aynan 4,5 metrni beradi.",
    wrong: "0,5 m li bo'laklar 4,5 metrga necha marta joylashadi? Slayderni o'sha songa keltiring.",
    rule: "Necha bo'lak — bo'lish: 4,5 : 0,5.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'У Акмаля 4,5 метра ленты. На каждый бантик нужно 0,5 метра.',
    ask: 'Двигай ползунок: заполни кусками по 0,5 метра, пока не наберётся 4,5 метра.',
    target: 'Цель: 4,5 м', label: 'число бантиков',
    correct: 'Верно: 4,5 : 0,5 = 9 бантиков. Девять кусков по 0,5 метра дают ровно 4,5 метра.',
    wrong: 'Сколько раз куски по 0,5 м укладываются в 4,5 метра? Доведи ползунок до этого числа.',
    rule: 'Сколько частей — это деление: 4,5 : 0,5.',
  },
};

export default function D29_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [n, setN] = useState(1);
  const [touched, setTouched] = useState(false);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setN(sa.value); setTouched(true); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);
  const check = useCallback(() => {
    const correct = n === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: n }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'div_build', level: '🔴' } });
  }, [n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const trackW = D08_MAX * UNIT;      // to'liq shkala
  const targetX = D08_ANS * UNIT;     // 4,5 m belgisi
  const barW = n * UNIT;
  const barCol = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#22c55e';
  const totCol = checked && n === D08_ANS ? '#1a7f43' : '#15803d';
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d29-bar { transition: width .18s ease; }
        input[type=range].d29-range { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 999px; background: #bbf7d0; outline: none; }
        input[type=range].d29-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: #16a34a; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); cursor: pointer; }
        input[type=range].d29-range::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: #16a34a; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); cursor: pointer; }
        input[type=range].d29-range:disabled::-webkit-slider-thumb { background: #9ca3af; }
        input[type=range].d29-range:disabled::-moz-range-thumb { background: #9ca3af; }
        @media (prefers-reduced-motion: reduce) { .d29-pop { animation: none !important; } .d29-bar { transition: none; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '8px 0 12px', padding: '14px 12px', borderRadius: 14, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
        <div style={{ position: 'relative', width: trackW, maxWidth: '100%', height: 30 }}>
          {/* to'liq yo'lak (nishongacha) */}
          <div style={{ position: 'absolute', left: 0, top: 2, width: targetX, height: 26, borderRadius: 5, border: '1.5px dashed #86efac', background: '#fff' }} />
          {/* o'quvchi yig'gan bo'laklar */}
          <div className="d29-bar" style={{ position: 'absolute', left: 0, top: 2, width: barW, height: 26, borderRadius: 5, background: barCol, backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent ' + (UNIT - 1.5) + 'px, rgba(255,255,255,.7) ' + (UNIT - 1.5) + 'px, rgba(255,255,255,.7) ' + UNIT + 'px)' }} />
          {/* nishon chizig'i */}
          <div style={{ position: 'absolute', left: targetX, top: -4, width: 2, height: 40, background: '#15803d' }} />
          <div style={{ position: 'absolute', left: targetX - 26, top: -18, ...S.mono, fontSize: 11, fontWeight: 800, color: '#15803d', whiteSpace: 'nowrap' }}>{t.target}</div>
        </div>
        <div style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: totCol }}>{n} × 0,5 = {fmt(n)} m</div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '4px 0' }}>
        <input type="range" className="d29-range" min={1} max={D08_MAX} step={1} value={n} disabled={locked}
          onChange={(e) => { setN(parseInt(e.target.value, 10)); setTouched(true); }}
          style={{ width: trackW, maxWidth: '100%' }} />
        <div style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#94a3b8' }}>{t.label}: <span style={{ color: '#1f2430', fontSize: 16 }}>{n}</span></div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
