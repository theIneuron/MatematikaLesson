// Dars20 · Amaliyot 03 — O'n ikkidanga keltir · 🔴 · tag: sub_coprime_fill
// 3/4 − 2/3: umumiy maxraj 12. 3/4 = 9/12, 2/3 = 8/12 → 9/12 − 8/12 = 1/12. Uch bo'sh katak.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

const D03 = { e1: 9, e2: 8, diff: 1 }; // 3/4=9/12, 2/3=8/12, 9/12−8/12=1/12
const D03_T = {
  uz: {
    eyebrow: 'Umumiy maxraj', setup: "Bekzod 3/4 va 2/3 ning ayirmasini topmoqchi, lekin maxrajlari har xil.",
    ask: "Bosqichma-bosqich to'ldiring:",
    r1: '3/4 =', r2: '2/3 =', r3: 'Ayirma:',
    correct: "To'g'ri. 3/4 = 9/12, 2/3 = 8/12. Endi 9/12 − 8/12 = 1/12.",
    wrong: "Maslahat: maxrajlar har xil bo'lsa, suratlarni to'g'ridan-to'g'ri ayirib bo'ladimi? Nima ularni bir xil bo'lakka bog'laydi?",
    rule: "Umumiy maxrajga keltiring, so'ng suratlarni ayiring, maxrajni o'zgartirma.",
  },
  ru: {
    eyebrow: 'Общий знаменатель', setup: 'Бекзод хочет найти разность 3/4 и 2/3, но знаменатели у них разные.',
    ask: 'Заполни шаг за шагом:',
    r1: '3/4 =', r2: '2/3 =', r3: 'Разность:',
    correct: 'Верно. 3/4 = 9/12, 2/3 = 8/12. Теперь 9/12 − 8/12 = 1/12.',
    wrong: 'Подсказка: если знаменатели разные, можно ли сразу вычитать числители? Что связывает их с одной долей?',
    rule: 'Приведи к общему знаменателю, затем вычти числители, знаменатель не меняй.',
  },
};

export default function D20_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [e1, setE1] = useState('');
  const [e2, setE2] = useState('');
  const [diff, setDiff] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.e1 != null) setE1(String(s.e1)); if (s.e2 != null) setE2(String(s.e2)); if (s.diff != null) setDiff(String(s.diff)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(e1) && /^\d+$/.test(e2) && /^\d+$/.test(diff);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(e1, 10) === D03.e1 && parseInt(e2, 10) === D03.e2 && parseInt(diff, 10) === D03.diff;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { e1: parseInt(e1, 10), e2: parseInt(e2, 10), diff: parseInt(diff, 10) }, correctAnswer: D03, correct, meta: { tag: 'sub_coprime_fill', level: '🔴' } });
  }, [e1, e2, diff, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const eqCell = (val, set, ok) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 48, height: 36, textAlign: 'center', fontSize: 20, fontWeight: 800, borderRadius: 9, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      <div style={{ width: 50, height: 2.5, background: '#1f2430' }} />
      <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>12</div>
    </div>
  );
  const line = (label, node, color = '#374151') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', minHeight: 56 }}>
      <span style={{ minWidth: 88, textAlign: 'right', ...S.mono, fontWeight: 800, color, fontSize: 16 }}>{renderFr(label)}</span>{node}
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '6px 0' }}>
        {line(t.r1, eqCell(e1, setE1, D03.e1))}
        {line(t.r2, eqCell(e2, setE2, D03.e2))}
        <div style={{ height: 1, background: '#eef0f4', margin: '2px auto', width: 200 }} />
        {line(t.r3, eqCell(diff, setDiff, D03.diff), '#0f766e')}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
