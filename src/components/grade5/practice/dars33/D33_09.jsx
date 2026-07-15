// Dars33 · Amaliyot 09 — Nechta to'g'ri burchak · 🔴 · tag: geo_count_angles
// To'g'ri to'rtburchak SVG. "Nechta to'g'ri burchak bor?" → 4. Har burchakda kvadrat belgi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const CY = '#0891b2';
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: CY, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
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

// To'g'ri to'rtburchak, 4 burchakda kvadrat belgi, sekin chiziladi
function Rect() {
  const x = 24, y = 20, w = 148, h = 96, m = 16;
  return (
    <svg width="196" height="136" viewBox="0 0 196 136" style={{ display: 'block' }}>
      <rect className="d33-draw" x={x} y={y} width={w} height={h} rx="2" fill="#ecfeff" stroke={CY} strokeWidth="4" />
      <path d={`M ${x + m} ${y} L ${x + m} ${y + m} L ${x} ${y + m}`} fill="none" stroke="#0e7490" strokeWidth="2" />
      <path d={`M ${x + w - m} ${y} L ${x + w - m} ${y + m} L ${x + w} ${y + m}`} fill="none" stroke="#0e7490" strokeWidth="2" />
      <path d={`M ${x + m} ${y + h} L ${x + m} ${y + h - m} L ${x} ${y + h - m}`} fill="none" stroke="#0e7490" strokeWidth="2" />
      <path d={`M ${x + w - m} ${y + h} L ${x + w - m} ${y + h - m} L ${x + w} ${y + h - m}`} fill="none" stroke="#0e7490" strokeWidth="2" />
    </svg>
  );
}

const D09_ANS = 4;
const D09_T = {
  uz: {
    eyebrow: 'Sanab toping', setup: "Rustam to'g'ri to'rtburchak chizdi. Har burchakda kichik kvadrat belgi bor.",
    ask: "Bu shaklda nechta to'g'ri burchak bor?", label: 'soni:',
    correct: "To'g'ri. To'g'ri to'rtburchakda 4 ta to'g'ri burchak bor.",
    wrong: "Shaklning burchaklarini birma-bir sanang — qaysilarida kvadrat belgi (90°) bor?",
    rule: "To'g'ri to'rtburchak — 4 ta to'g'ri burchak.",
  },
  ru: {
    eyebrow: 'Сосчитай', setup: 'Рустам начертил прямоугольник. В каждой вершине маленький квадратик.',
    ask: 'Сколько прямых углов в этой фигуре?', label: 'количество:',
    correct: 'Верно. В прямоугольнике 4 прямых угла.',
    wrong: 'Сосчитай вершины фигуры одну за другой — в каких стоит квадратик (90°)?',
    rule: 'Прямоугольник — 4 прямых угла.',
  },
};

export default function D33_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'geo_count_angles', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : CY;
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d33-draw { stroke-dasharray: 500; stroke-dashoffset: 500; animation: d33draw 1s ease both; }
        @keyframes d33draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .d33-pop { animation: none !important; } .d33-draw { animation: none !important; stroke-dashoffset: 0; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 8px' }}><Rect /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 64, height: 52, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
