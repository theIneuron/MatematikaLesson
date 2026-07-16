// Dars29 · Amaliyot 04 — Vergulni yo'qot · 🟡 · tag: div_dec_dec
// 2,4 : 0,6 = ? → 4. Ikkala songa ×10: 24 : 6 = 4. Bo'luvchini butun qilish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0f766e', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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

const D04_ANS = 4;
const D04_T = {
  uz: {
    eyebrow: "Vergulni yo'qot", setup: "Alisher 2,4 : 0,6 ni hisoblamoqchi.",
    ask: '2,4 : 0,6 = ?',
    correct: "To'g'ri. Bo'luvchini butun qilsa oson bo'ladi: 2,4 : 0,6 = 24 : 6 = 4.",
    wrong: "Bo'lish — «necha marta sig'adi» degani. 0,6 litrli stakan 2,4 litr idishga necha marta sig'adi?",
    rule: "Bo'luvchini butun qil: har ikkala songa ×10 — bo'linma o'zgarmaydi.",
  },
  ru: {
    eyebrow: 'Убери запятую', setup: 'Алишер хочет вычислить 2,4 : 0,6.',
    ask: '2,4 : 0,6 = ?',
    correct: 'Верно. С целым делителем проще: 2,4 : 0,6 = 24 : 6 = 4.',
    wrong: 'Деление — это «сколько раз помещается». Сколько раз стакан 0,6 литра помещается в 2,4 литра?',
    rule: 'Сделай делитель целым: оба числа ×10 — частное не меняется.',
  },
};

export default function D29_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D04_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D04_ANS }, correct, meta: { tag: 'div_dec_dec', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const revealed = checked && fb?.correct;
  const Num = ({ children }) => <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{children}</span>;
  const Big = ({ children }) => <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#0f766e' }}>{children}</span>;
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d29-drop { animation: d29drop .5s ease both; }
        @keyframes d29drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d29-pop, .d29-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d29-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px 0 12px', padding: '14px 12px', borderRadius: 14, background: '#f0fdfa', border: '1.5px solid #99f6e4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Num>2,4</Num><Num>:</Num><Num>0,6</Num></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...S.mono, fontSize: 13, fontWeight: 800, color: '#0d9488' }}><span>↓ ×10</span><span>↓ ×10</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Big>24</Big><Big>:</Big><Big>6</Big><Big>=</Big><Big>4</Big></div>
        </div>
      )}
      <p className={revealed ? 'd29-drop' : ''} style={{ ...S.ask, fontSize: 16, textAlign: 'center' }}>{t.ask}</p>
      <div className={revealed ? 'd29-drop' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>2,4 : 0,6 =</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 62, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
