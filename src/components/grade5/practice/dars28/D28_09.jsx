// Dars28 · Amaliyot 09 — Natijani son o'qiga qo'y · 🔴 · tag: mul_numberline
// 0,4 × 4 = 1,6. Son o'qida (0..3, o'ndan bo'linmali) markerni 1,6 ga qo'yish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0e7490', background: '#ecfeff', border: '1px solid #a5f3fc', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d28-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_ANS = 1.6;
const D09_T = {
  uz: {
    eyebrow: "Son o'qiga qo'y", setup: "Sabina 0,4 metrdan 4 ta bo'lakni ulab lenta yasadi. Uning uzunligini son o'qida belgilang.",
    ask: "0,4 × 4 natijasini son o'qida bosing:",
    correct: "To'g'ri. 0,4 to'rt marta = 1,6. Marker 1,6 da.",
    wrong: "0,4 ni 4 marta olsangiz, marker 0 dan qay tomonga va qancha siljiydi?",
    rule: "0,4 × 4 = 16 o'ndan = 1,6.",
  },
  ru: {
    eyebrow: 'Отметь на оси', setup: 'Сабина соединила 4 кусочка по 0,4 метра в ленту. Отметь её длину на числовой оси.',
    ask: 'Нажми результат 0,4 × 4 на числовой оси:',
    correct: 'Верно. 0,4 четыре раза = 1,6. Маркер на 1,6.',
    wrong: 'Если взять 0,4 четыре раза, в какую сторону и насколько сдвинется маркер от 0?',
    rule: '0,4 × 4 = 16 десятых = 1,6.',
  },
};

export default function D28_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [mark, setMark] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const svgRef = useRef(null);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setMark(sa.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(mark != null && !checked); }, [mark, checked, onReady]);
  const W = 360, H = 96, x0 = 28, x1 = W - 28, y = 52;
  const xAt = (v) => x0 + (x1 - x0) * (v / 3);
  const onClick = (e) => {
    if (isReview || checked) return;
    const rect = svgRef.current.getBoundingClientRect();
    const ratio = W / rect.width;
    const px = (e.clientX - rect.left) * ratio;
    let v = ((px - x0) / (x1 - x0)) * 3;
    v = Math.round(v / 0.1) * 0.1;
    v = Math.max(0, Math.min(3, Math.round(v * 10) / 10));
    setMark(v);
  };
  const check = useCallback(() => {
    const correct = mark != null && Math.abs(mark - D09_ANS) < 0.001;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: mark }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'mul_numberline', level: '🔴' } });
  }, [mark, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const markColor = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#0e7490';
  const fmt = (v) => v.toFixed(1).replace('.', ',');
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} onClick={onClick} style={{ maxWidth: '100%', height: 'auto', cursor: (isReview || checked) ? 'default' : 'pointer', touchAction: 'manipulation' }}>
          <line x1={x0} y1={y} x2={x1} y2={y} stroke="#334155" strokeWidth="2.5" />
          {Array.from({ length: 31 }).map((_, i) => { const v = i / 10; const big = i % 10 === 0; return <line key={i} x1={xAt(v)} y1={y - (big ? 11 : 6)} x2={xAt(v)} y2={y + (big ? 11 : 6)} stroke="#334155" strokeWidth={big ? 2 : 1.1} />; })}
          {[0, 1, 2, 3].map((n) => <text key={n} x={xAt(n)} y={y + 30} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="800" fill="#475569">{n}</text>)}
          {mark != null && (
            <g>
              <line x1={xAt(mark)} y1={y - 22} x2={xAt(mark)} y2={y} stroke={markColor} strokeWidth="2" />
              <circle cx={xAt(mark)} cy={y} r="7.5" fill={markColor} />
              <text x={xAt(mark)} y={y - 28} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="800" fill={markColor}>{fmt(mark)}</text>
            </g>
          )}
        </svg>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
