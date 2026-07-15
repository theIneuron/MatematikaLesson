// Dars32 · Amaliyot 02 — Ip bo'lagi · 🟢 · tag: whole_half
// 50% = 15 → butun = 15 × 2 = 30. Vizual: gorizontal lenta ikkiga bo'lingan (reveal).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#be123c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D02_ANS = 30;
const D02_T = {
  uz: {
    eyebrow: 'Butunni top', setup: "Madina uyida bir g'altak ip topdi. U ipning 50% ini qaychida kesib o'lchadi — bu bo'lak 15 santimetr chiqdi.",
    ask: "Butun ip qanchalik uzun bo'lgan (sm)?", label: 'butun:',
    correct: "To'g'ri. 50% — yarmi. Ikkita yarmni qo'shsak butun: 15 × 2 = 30.",
    wrong: "50% — bu yarmi. Butun undan katta yoki kichik? Yarmidan butunga qaysi amal olib boradi?",
    rule: "50% = yarmi → butun = qism × 2.",
  },
  ru: {
    eyebrow: 'Найди целое', setup: 'Мадина нашла дома моток нити. Она отрезала ножницами 50% нити и измерила — этот кусок оказался 15 сантиметров.',
    ask: 'Какой длины была вся нить (см)?', label: 'целое:',
    correct: 'Верно. 50% — это половина. Две половины дают целое: 15 × 2 = 30.',
    wrong: '50% — это половина. Целое больше или меньше? Какое действие ведёт от половины к целому?',
    rule: '50% = половина → целое = часть × 2.',
  },
};

export default function D32_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'whole_half', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#be123c';
  const reveal = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d32-grow { transform-box: fill-box; transform-origin: left; animation: d32grow .55s ease both; }
        @keyframes d32grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .d32-pop, .d32-grow { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '8px 0 4px' }}>
        <div style={{ display: 'flex', width: 280, height: 40, borderRadius: 10, overflow: 'hidden', border: '2px solid #fecdd3', background: '#fff1f2' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fb7185', color: '#fff', ...S.mono, fontSize: 15, fontWeight: 800, borderRight: '2px dashed #fff' }}>15</div>
          <div className={reveal ? 'd32-grow' : ''} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: reveal ? '#fb7185' : 'transparent', color: reveal ? '#fff' : '#be123c', ...S.mono, fontSize: reveal ? 15 : 20, fontWeight: 800 }}>{reveal ? '15' : '?'}</div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#be123c' }}>
          {reveal ? (<span style={S.mono}>100% = 30 sm</span>) : (lang === 'uz' ? "kesilgan bo'lak · 50%" : 'отрезок · 50%')}
        </div>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
