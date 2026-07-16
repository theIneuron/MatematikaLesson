// Dars11 · Amaliyot 10 — Yig'indini bo'lish · 🔴 · sum_div_rule (kiritish + qadam + vau)
// (15 + 9 + 6) : 3 = 5 + 3 + 2 = 10. Bosqichli.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D10_ANS = 10;
const D10_T = {
  uz: {
    eyebrow: "Yig'indi bo'lish", setup: "Aziza (15 + 9 + 6) : 3 ni hisoblamoqchi.",
    ask: '(15 + 9 + 6) : 3 nechaga teng?', label: 'Javobni yozing:',
    correct: "To'g'ri. 15:3 + 9:3 + 6:3 = 5 + 3 + 2 = 10.",
    wrong: "Maslahat: yig'indini songa bo'lganda har bir qo'shiluvchi bilan nima qilsa bo'ladi? Qavs ichini alohida ko'rib chiq.",
    rule: "Yig'indini songa bo'lish: har qo'shiluvchini bo'lib, natijalarni qo'shing.",
  },
  ru: {
    eyebrow: 'Деление суммы', setup: 'Азиза хочет вычислить (15 + 9 + 6) : 3.',
    ask: 'Чему равно (15 + 9 + 6) : 3?', label: 'Запишите ответ:',
    correct: 'Верно. 15:3 + 9:3 + 6:3 = 5 + 3 + 2 = 10.',
    wrong: 'Подсказка: при делении суммы на число что можно сделать с каждым слагаемым? Рассмотри скобку по частям.',
    rule: 'Деление суммы на число: раздели каждое слагаемое, результаты сложи.',
  },
};
export default function D11_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0); // 1: 5+3+2  2: =10 salyut
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 500], [2, 1500]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setStep(v), ms)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'sum_div_rule', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const conf = ['#f59e0b', '#fe5b1a', '#10b981', '#ec4899', '#7c3aed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-confetti { animation: d11conf .9s ease-out both; }
        @keyframes d11conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d11-pop, .d11-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ textAlign: 'center', margin: '12px 0 4px', ...S.mono, fontSize: 24, fontWeight: 800, color: '#fe5b1a' }}>(15 + 9 + 6) : 3</div>
      {/* bosqichli yechim */}
      <div style={{ position: 'relative', minHeight: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {step >= 1 && <div className="d11-pop" style={{ display: 'flex', gap: 8, ...S.mono, fontSize: 14, fontWeight: 800 }}>
          <span style={{ color: '#0ea5e9', background: '#f0f9ff', padding: '4px 8px', borderRadius: 8 }}>15:3=5</span>
          <span style={{ color: '#8b5cf6', background: '#faf5ff', padding: '4px 8px', borderRadius: 8 }}>9:3=3</span>
          <span style={{ color: '#f97316', background: '#fff7ed', padding: '4px 8px', borderRadius: 8 }}>6:3=2</span>
        </div>}
        {step >= 2 && <div className="d11-pop" style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#1a7f43', position: 'relative' }}>5 + 3 + 2 = 10
          <div style={{ position: 'absolute', right: -14, top: -6 }}>{Array.from({ length: 10 }).map((_, i) => { const ang = (i / 10) * Math.PI * 2; return <span key={i} className="d11-confetti" style={{ position: 'absolute', width: 6, height: 6, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 34 + 'px', '--dy': Math.sin(ang) * 26 + 'px', animationDelay: (i * 0.02) + 's' }} />; })}</div>
        </div>}
      </div>
      <p style={{ ...S.ask, fontSize: 16, margin: '10px 0 6px' }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
