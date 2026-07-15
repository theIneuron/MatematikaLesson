// Dars29 · Amaliyot 09 — Son o'qiga joyla · 🔴 · tag: div_numberline
// 2 : 0,4 = ? → 5. ×10/×10: 20 : 4 = 5. Son o'qida (0…8) markerni 5 ga qo'y.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0e7490', background: '#ecfeff', border: '1px solid #a5f3fc', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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

const D09_ANS = 5;
const D09_T = {
  uz: {
    eyebrow: "Son o'qiga joyla", setup: "Nodira 2 : 0,4 ni hisoblab, son o'qiga belgilamoqchi.",
    ask: "2 : 0,4 = ?  Markerni to'g'ri songa qo'ying:",
    correct: "To'g'ri. 0,4 li bo'lak 2 ga 5 marta sig'adi: 20 : 4 = 5.",
    wrong: "Bo'lish — «necha marta sig'adi» degani. 0,4 litrli bo'lak 2 litrga necha marta sig'adi? Keyin o'qda belgilang.",
    rule: "×10/×10: 2 : 0,4 = 20 : 4 = 5.",
  },
  ru: {
    eyebrow: 'Отметь на оси', setup: 'Нодира вычисляет 2 : 0,4 и хочет отметить на оси.',
    ask: '2 : 0,4 = ?  Поставь маркер на верное число:',
    correct: 'Верно. Часть 0,4 входит в 2 пять раз: 20 : 4 = 5.',
    wrong: 'Деление — это «сколько раз помещается». Сколько раз часть 0,4 литра входит в 2 литра? Потом отметь на оси.',
    rule: '×10/×10: 2 : 0,4 = 20 : 4 = 5.',
  },
};

export default function D29_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setPick(sa.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: pick }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'div_numberline', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 340, H = 96, x0 = 24, x1 = W - 24, y = 54;
  const xAt = (v) => x0 + (x1 - x0) * (v / 8);
  const locked = isReview || checked;
  const markCol = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#0891b2';
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d29-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }}>
          <line x1={x0} y1={y} x2={x1} y2={y} stroke="#334155" strokeWidth="2.5" />
          {Array.from({ length: 9 }).map((_, v) => (
            <g key={v} onClick={locked ? undefined : () => setPick(v)} style={{ cursor: locked ? 'default' : 'pointer' }}>
              <line x1={xAt(v)} y1={y - 9} x2={xAt(v)} y2={y + 9} stroke="#334155" strokeWidth="1.6" />
              <text x={xAt(v)} y={y + 26} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="800" fill={pick === v ? markCol : '#475569'}>{v}</text>
              <circle cx={xAt(v)} cy={y} r="13" fill="transparent" />
            </g>
          ))}
          {pick != null && (
            <g className="d29-pop">
              <circle cx={xAt(pick)} cy={y} r="8" fill={markCol} />
              <polygon points={`${xAt(pick)},${y - 15} ${xAt(pick) - 6},${y - 25} ${xAt(pick) + 6},${y - 25}`} fill={markCol} />
            </g>
          )}
        </svg>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
