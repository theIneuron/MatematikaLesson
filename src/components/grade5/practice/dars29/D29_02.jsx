// Dars29 · Amaliyot 02 — Necha stakan · 🟢 · tag: div_half
// 3 : 0,5 = ? → 6. 3 litr ichiga 0,5 li stakan 6 marta sig'adi (har butunda 2 ta yarim).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#be123c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
function Glass({ i, animate }) {
  const w = 30, h = 46;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="3" y="2" width={w - 6} height={h - 4} rx="5" fill="#fff" stroke="#d6dae3" strokeWidth="1.5" />
      <rect className={animate ? 'd29-fill' : ''} style={animate ? { animationDelay: (i * 0.3) + 's' } : undefined} x="4.6" y="3.6" width={w - 9.2} height={h - 7.2} rx="4" fill="#ef4444" />
    </svg>
  );
}

const D02_ANS = 6;
const D02_T = {
  uz: {
    eyebrow: 'Necha stakan', setup: "Zaynab 3 litr sharbatni 0,5 litrli stakanlarga quymoqchi. Har butun litrga 2 ta yarim stakan sig'adi.",
    ask: '3 : 0,5 = ?  (nechta stakan chiqadi?)', label: 'stakanlar soni:',
    correct: "To'g'ri. 3 litrga 0,5 litrli stakan 6 marta sig'adi: 3 : 0,5 = 6.",
    wrong: "Har butun litrda 2 ta yarim stakan bor — nechta butun litr borligini sanang.",
    rule: ":0,5 — ikkiga ko'paytirish bilan bir xil.",
  },
  ru: {
    eyebrow: 'Сколько стаканов', setup: 'Зайнаб хочет разлить 3 литра сока по стаканам 0,5 литра. В каждый целый литр входит 2 половинки.',
    ask: '3 : 0,5 = ?  (сколько стаканов получится?)', label: 'число стаканов:',
    correct: 'Верно. В 3 литра стакан 0,5 литра помещается 6 раз: 3 : 0,5 = 6.',
    wrong: 'В каждом целом литре 2 половинки — посчитай, сколько целых литров.',
    rule: ':0,5 — это то же самое, что умножить на два.',
  },
};

export default function D29_02(props) {
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'div_half', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d29-drop { animation: d29drop .5s ease both; }
        @keyframes d29drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .d29-fill { transform-box: fill-box; transform-origin: bottom; animation: d29fill .5s ease both; }
        @keyframes d29fill { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { .d29-pop, .d29-drop, .d29-fill { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d29-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '6px 0 12px', padding: '12px', borderRadius: 14, background: '#fff1f2', border: '1.5px solid #fecdd3' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {Array.from({ length: 6 }).map((_, i) => <Glass key={i} i={i} animate />)}
          </div>
          <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#be123c' }}>3 : 0,5 = 6</div>
        </div>
      )}
      <p className={revealed ? 'd29-drop' : ''} style={{ ...S.ask, fontSize: revealed ? 14 : 15.5, textAlign: 'center', color: revealed ? '#6b7280' : '#1f2430', margin: revealed ? '4px 0 8px' : '14px 0 12px' }}>{t.ask}</p>
      {!revealed && <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>}
      <div className={revealed ? 'd29-drop' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>3 : 0,5 =</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 62, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
