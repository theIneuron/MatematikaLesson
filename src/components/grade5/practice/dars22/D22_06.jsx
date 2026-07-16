// Dars22 · Amaliyot 06 — Slayder · 🟡 · tag: convert_slider
// Slayderni 11/3 ga qo'yish. Har holatda ikkala ko'rinish ko'rinadi (noto'g'ri va aralash). 11/3 = 3⅔.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

const D06_ANS = 11, D06_DEN = 3, D06_MAX = 12; // 11/3 = 3⅔
const D06_T = {
  uz: {
    eyebrow: 'Slayder', setup: "Slayder uchdan (1/3) qadam bilan siljiydi. Uni surganda son ikki ko'rinishda ko'rinadi: noto'g'ri kasr va aralash son.",
    ask: "Slayderni 11/3 ga qo'ying:",
    correct: "To'g'ri. 11/3 — bu o'n bir uchdan. To'qqizta uchdan = 3 butun, yana 2 uchdan: 11/3 = 3⅔.",
    wrong: "Maslahat: 11/3 — o'n bir uchdan bo'lak. Slayderni yuqoridagi noto'g'ri kasr 11/3 ni ko'rsatgunicha suring.",
    rule: "Bir xil son ikki ko'rinishda: 11/3 = 3⅔ (noto'g'ri kasr va aralash son — bir joyda).",
  },
  ru: {
    eyebrow: 'Ползунок', setup: 'Ползунок двигается шагом в треть (1/3). При движении число показывается в двух видах: неправильная дробь и смешанное число.',
    ask: 'Поставь ползунок на 11/3:',
    correct: 'Верно. 11/3 — это одиннадцать третей. Девять третей = 3 целых, ещё 2 трети: 11/3 = 3⅔.',
    wrong: 'Подсказка: 11/3 — одиннадцать третей. Двигай ползунок, пока сверху неправильная дробь не покажет 11/3.',
    rule: 'Одно число в двух видах: 11/3 = 3⅔ (неправильная дробь и смешанное — в одном месте).',
  },
};

export default function D22_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [pos, setPos] = useState(0);
  const [moved, setMoved] = useState(false);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pos != null) { setPos(sa.pos); setMoved(true); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(moved && !checked); }, [moved, checked, onReady]);
  const check = useCallback(() => {
    const correct = pos === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { pos }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'convert_slider', level: '🟡' } });
  }, [pos, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const whole = Math.floor(pos / D06_DEN), rem = pos % D06_DEN;
  const bcol = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d22rng { -webkit-appearance: none; appearance: none; height: 10px; border-radius: 6px; outline: none; }
        .d22rng::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: #fe5b1a; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); cursor: pointer; }
        .d22rng::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: #fe5b1a; border: 3px solid #fff; cursor: pointer; }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      {/* ikki ko'rinish */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '10px 0 8px', minHeight: 54 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>{lang === 'uz' ? "noto'g'ri" : 'неправильная'}</div>
          <Frac num={String(pos)} den={String(D06_DEN)} size={24} color={bcol} />
        </div>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#cbd5e1' }}>=</span>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>{lang === 'uz' ? 'aralash' : 'смешанное'}</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{whole > 0 && <span style={{ ...S.mono, fontWeight: 800, fontSize: 26, color: bcol }}>{whole}</span>}{rem > 0 ? <Frac num={String(rem)} den={String(D06_DEN)} size={18} color={bcol} /> : (whole === 0 ? <span style={{ ...S.mono, fontWeight: 800, fontSize: 26, color: bcol }}>0</span> : null)}</span>
        </div>
      </div>
      <div style={{ padding: '0 14px' }}>
        <input className="d22rng" type="range" min={0} max={D06_MAX} step={1} value={pos} disabled={isReview || checked} onChange={(e) => { setPos(parseInt(e.target.value, 10)); setMoved(true); }} style={{ width: '100%', background: `linear-gradient(#ffb488,#ffb488) 0/${(pos / D06_MAX) * 100}% 100% no-repeat #e5e9f0` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', ...S.mono, fontSize: 11, fontWeight: 800, color: '#94a3b8', marginTop: 2 }}><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
