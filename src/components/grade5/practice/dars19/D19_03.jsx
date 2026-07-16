// Dars19 · Amaliyot 03 — O'ndanga keltir · 🔴 · tag: add_coprime_fill
// 2/5 + 1/2: umumiy maxraj 10. 2/5 = 4/10, 1/2 = 5/10 → 4/10 + 5/10 = 9/10. Uch bo'sh katak.
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
  <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D03 = { e1: 4, e2: 5, sum: 9 }; // 2/5=4/10, 1/2=5/10, 4/10+5/10=9/10
const D03_T = {
  uz: {
    eyebrow: 'Umumiy maxraj', setup: "Bekzod 2/5 va 1/2 ni qo'shmoqchi, biroq maxrajlar har xil.",
    ask: "Har kasrni bir xil bo'lakka keltiring, so'ng qo'shing:",
    r1: '2/5 =', r2: '1/2 =', r3: "Yig'indi:",
    correct: "To'g'ri. 2/5 = 4/10, 1/2 = 5/10. Endi 4/10 + 5/10 = 9/10.",
    wrong: "Maxrajlar 5 va 2 — ular har xil. Har ikkalasiga ham to'g'ri keladigan bir xil bo'lak bormi?",
    rule: "Umumiy maxrajga keltiring, so'ng suratlarni qo'shing, maxrajni o'zgartirma.",
  },
  ru: {
    eyebrow: 'Общий знаменатель', setup: 'Бекзод хочет сложить 2/5 и 1/2, но знаменатели разные.',
    ask: 'Приведи каждую дробь к одинаковым долям, затем сложи:',
    r1: '2/5 =', r2: '1/2 =', r3: 'Сумма:',
    correct: 'Верно. 2/5 = 4/10, 1/2 = 5/10. Теперь 4/10 + 5/10 = 9/10.',
    wrong: 'Знаменатели 5 и 2 — они разные. Есть ли доля, подходящая сразу обеим?',
    rule: 'Приведи к общему знаменателю, затем сложи числители, знаменатель не меняй.',
  },
};

export default function D19_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [e1, setE1] = useState('');
  const [e2, setE2] = useState('');
  const [sum, setSum] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.e1 != null) setE1(String(s.e1)); if (s.e2 != null) setE2(String(s.e2)); if (s.sum != null) setSum(String(s.sum)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(e1) && /^\d+$/.test(e2) && /^\d+$/.test(sum);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(e1, 10) === D03.e1 && parseInt(e2, 10) === D03.e2 && parseInt(sum, 10) === D03.sum;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { e1: parseInt(e1, 10), e2: parseInt(e2, 10), sum: parseInt(sum, 10) }, correctAnswer: D03, correct, meta: { tag: 'add_coprime_fill', level: '🔴' } });
  }, [e1, e2, sum, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const eqCell = (val, set, ok) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 44, height: 36, textAlign: 'center', fontSize: 20, fontWeight: 800, borderRadius: 9, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      <div style={{ width: 46, height: 2.5, background: '#1f2430' }} />
      <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>10</div>
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
        .d19-pop { animation: d19pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d19pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d19-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '6px 0' }}>
        {line(t.r1, eqCell(e1, setE1, D03.e1))}
        {line(t.r2, eqCell(e2, setE2, D03.e2))}
        <div style={{ height: 1, background: '#eef0f4', margin: '2px auto', width: 200 }} />
        {line(t.r3, eqCell(sum, setSum, D03.sum), '#0f766e')}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
