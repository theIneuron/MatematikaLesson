// Dars05 · Amaliyot 09 — Bo'linuvchini top · 🔴 · tag: clue_dividend
// Sonni 32 ga bo'lganda 24 va qoldiq 13. Bo'linuvchi = 24 × 32 + 13 = 781.
// Formula quruvchi: bola natijani kiritadi; to'g'ri javobdan keyin formula chiziladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_Q = 24, D09_DIV = 32, D09_REM = 13, D09_ANS = 781;
const D09_T = {
  uz: {
    eyebrow: "Bo'linuvchi", setup: "Noma'lum sonni 32 ga bo'lganda to'liqsiz bo'linma 24, qoldiq esa 13 chiqdi.",
    ask: "O'sha sonni (bo'linuvchini) toping.", label: "Bo'linuvchini yozing:",
    rule: "bo'linuvchi = bo'linma × bo'luvchi + qoldiq",
    correct: "To'g'ri. 24 × 32 + 13 = 768 + 13 = 781.",
    wrong: "Maslahat: bo'lishning teskarisi qaysi amal? Qoldiq bo'lmaganda son bo'linma va bo'luvchidan qanday tiklanardi — qoldiq borligi bunga nima qo'shadi?",
  },
  ru: {
    eyebrow: 'Делимое', setup: 'При делении неизвестного числа на 32 неполное частное 24, остаток 13.',
    ask: 'Найдите это число (делимое).', label: 'Запишите делимое:',
    rule: 'делимое = частное × делитель + остаток',
    correct: 'Верно. 24 × 32 + 13 = 768 + 13 = 781.',
    wrong: 'Подсказка: какое действие обратно делению? Если бы остатка не было, как восстановить число из частного и делителя — и что добавляет наличие остатка?',
  },
};
export default function D05_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [rev, setRev] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setRev(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 500], [2, 1400]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setRev(v), ms)));
    onSubmit?.({ questionText: '? : 32 = 24 (rem 13)', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'clue_dividend', level: '🔴' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d5-pop { animation: d5pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d5pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d5-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* qoida eslatmasi — faqat to'g'ri javobdan keyin */}
      {rev >= 1 && <div className="d5-pop" style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#7c3aed', background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: 10, padding: '8px 10px', margin: '4px 0 12px' }}>{t.rule}</div>}
      {/* formula ochilishi to'g'ri javobdan keyin */}
      <div style={{ textAlign: 'center', minHeight: 40, ...S.mono, fontSize: 22, fontWeight: 800 }}>
        {rev >= 1 && <span className="d5-pop" style={{ color: '#2563eb' }}>24 × 32 + 13</span>}
        {rev >= 2 && <span className="d5-pop" style={{ color: '#1a7f43', marginLeft: 8 }}>= 781</span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700, textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 160, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
