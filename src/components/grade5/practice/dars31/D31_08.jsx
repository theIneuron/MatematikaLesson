// Dars31 · Amaliyot 08 — Yakuniy narx · 🔴 · tag: of_final_price
// "Krossovka 240000 so'm. 20% chegirma. Xaridor qancha to'laydi?" → 192000.
// NAQSH A: ishlangan yechim chizmasi FAQAT to'g'ri javobdan keyin yuqorida ochiladi, savol pastga suriladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#15803d', light: '#f0fdf4', mid: '#bbf7d0', fill: '#22c55e', muted: '#4b8f68' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_ANS = 192000;
const D08_T = {
  uz: {
    eyebrow: 'Yakuniy narx', setup: "Krossovka narxi 240000 so'm. Do'kon 20% chegirma berdi.",
    ask: "Xaridor QANCHA to'laydi?", label: "so'm:",
    correct: "To'g'ri. Chegirma 240000 : 100 × 20 = 48000. To'lov 240000 − 48000 = 192000.",
    wrong: "Chegirma — narxning bir qismi. Uni topgach, yakuniy narxni qaysi amal beradi?",
    rule: "Yakuniy narx = narx − chegirma miqdori.",
  },
  ru: {
    eyebrow: 'Итоговая цена', setup: 'Цена кроссовок 240000 сум. Магазин дал скидку 20%.',
    ask: 'Сколько ЗАПЛАТИТ покупатель?', label: 'сум:',
    correct: 'Верно. Скидка 240000 : 100 × 20 = 48000. Оплата 240000 − 48000 = 192000.',
    wrong: 'Скидка — часть цены. Найдя её, каким действием получить итоговую цену?',
    rule: 'Итоговая цена = цена − величина скидки.',
  },
};

export default function D31_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'of_final_price', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.fill;
  const revealed = checked && fb?.correct;
  const Num = ({ children, strike }) => <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: strike ? '#9ca3af' : '#1f2430', textDecoration: strike ? 'line-through' : 'none' }}>{children}</span>;
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d31-drop { animation: d31drop .5s ease both; }
        @keyframes d31drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d31-pop, .d31-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d31-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px 0 12px', padding: '14px 12px', borderRadius: 14, background: C.light, border: '1.5px solid ' + C.mid }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Num strike>240000</Num>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.dark, background: '#fff', border: '1px solid ' + C.mid, borderRadius: 8, padding: '3px 8px' }}>−20%</span>
          </div>
          <div style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: C.muted }}>chegirma 48000</div>
          <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: C.dark }}>240000 − 48000 = 192000</div>
        </div>
      )}
      <p className={revealed ? 'd31-drop' : ''} style={{ ...S.ask, fontSize: revealed ? 14 : 15.5, textAlign: 'center', color: revealed ? '#6b7280' : '#1f2430', margin: revealed ? '4px 0 8px' : '14px 0 12px' }}>{t.ask}</p>
      {!revealed && <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>}
      <div className={revealed ? 'd31-drop' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 7))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 150, height: 52, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
