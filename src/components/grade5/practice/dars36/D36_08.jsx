// Dars36 · Amaliyot 08 — Bayroq masalasi · 🔴 · tag: tri_word
// Uchburchak bayroq: asos 3 m, balandlik 2,5 m. 3 × 2,5 = 7,5; 7,5 : 2 = 3,75 m². Ishlangan yechim reveal.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: green
const HUE = { d: '#15803d', l: '#f0fdf4', m: '#bbf7d0', deep: '#166534', fill: '#22c55e' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d36-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_ANS = 3.75;
const D08_T = {
  uz: {
    eyebrow: 'Masala', setup: "Aziza uchburchak shaklidagi bayroq tikadi: asosi 3 m, balandligi 2,5 m.",
    ask: 'Bayroq yuzasi qancha (m²)?',
    correct: "To'g'ri. 3 × 2,5 = 7,5; keyin 7,5 : 2 = 3,75 m².",
    wrong: "Bayroq — to'rtburchakning yarmi. Butun to'rtburchak yuzasidan yarmini olish uchun qaysi amal kerak? O'nli kasrda vergulga e'tibor bering.",
    rule: "S = (asos × balandlik) : 2.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Азиза шьёт флаг в форме треугольника: основание 3 м, высота 2,5 м.',
    ask: 'Чему равна площадь флага (м²)?',
    correct: 'Верно. 3 × 2,5 = 7,5; затем 7,5 : 2 = 3,75 м².',
    wrong: 'Флаг — половина прямоугольника. Какое действие нужно, чтобы получить половину площади прямоугольника? Следи за запятой в десятичной дроби.',
    rule: 'S = (основание × высота) : 2.',
  },
};

export default function D36_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value).replace('.', ',')); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+([.,]\d+)?$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.replace(',', '.'));
    const correct = Math.abs(num - D08_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: num }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'tri_word', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : HUE.d;
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d36-wave { transform-origin: 20px 20px; animation: d36wave 2.4s ease-in-out infinite; }
        @keyframes d36wave { 0%,100% { transform: skewY(0deg); } 50% { transform: skewY(-2.5deg); } }
        @media (prefers-reduced-motion: reduce) { .d36-pop,.d36-wave { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}>
        <svg width="220" height="150" viewBox="0 0 220 150" style={{ maxWidth: '100%' }}>
          <line x1="24" y1="14" x2="24" y2="140" stroke="#8b5e34" strokeWidth="5" strokeLinecap="round" />
          <g className="d36-wave">
            <polygon points="26,20 190,20 26,96" fill={HUE.fill} fillOpacity="0.6" stroke={HUE.d} strokeWidth="2" strokeLinejoin="round" />
            <path d="M 40 20 L 40 34 L 26 34" fill="none" stroke={HUE.deep} strokeWidth="1.4" />
          </g>
          <text x="108" y="14" textAnchor="middle" fontSize="13" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>3 m</text>
          <text x="18" y="62" textAnchor="middle" fontSize="13" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }} transform="rotate(-90 18 62)">2,5 m</text>
        </svg>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151' }}>S =</span>
        <input value={val} onChange={(e) => { const p = e.target.value.replace(/[^\d.,]/g, '').replace(/\./g, ',').split(','); setVal((p.length > 1 ? p[0] + ',' + p.slice(1).join('') : p[0]).slice(0, 6)); }} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 110, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151' }}>m²</span>
      </div>
      {revealed && (
        <div className="d36-pop" style={{ ...S.mono, textAlign: 'center', marginTop: 12, padding: '10px', borderRadius: 12, fontSize: 15, fontWeight: 800, color: HUE.d, background: HUE.l, border: '1.5px solid ' + HUE.m }}>3 × 2,5 = 7,5 → 7,5 : 2 = 3,75</div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
