// Dars20 · Amaliyot 10 — Masala · 🔴 · tag: sub_coprime_story
// 3/4 − 1/3: umumiy maxraj 12. 9/12 − 4/12 = 5/12. Ikki maydon: surat (5) va maxraj (12).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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

const D10_A = 5, D10_D = 12; // 9/12 − 4/12 = 5/12
const D10_T = {
  uz: {
    eyebrow: 'Yugurish', setup: "Aziza 3/4 km yugurishni rejalashtirgan edi. Hozirgacha 1/3 km yugurdi.",
    ask: 'Azizaga yana qancha yugurish qoldi? 3/4 − 1/3 = ?/?',
    l1: 'Surat:', l2: 'Maxraj:',
    correct: "To'g'ri. Umumiy maxraj 12: 3/4 = 9/12, 1/3 = 4/12 → 9/12 − 4/12 = 5/12.",
    wrong: "Maslahat: 4 va 3 maxrajlarni bir xil qiladigan umumiy o'lchov nima bilan bog'liq? Suratlarni qachon ayirsa bo'ladi?",
    rule: "Umumiy maxrajni top (4 va 3 uchun 12), ekvivalentlarga keltiring, so'ng suratlarni ayiring.",
  },
  ru: {
    eyebrow: 'Пробежка', setup: 'Азиза планировала пробежать 3/4 км. Пока пробежала 1/3 км.',
    ask: 'Сколько Азизе осталось пробежать? 3/4 − 1/3 = ?/?',
    l1: 'Числитель:', l2: 'Знаменатель:',
    correct: 'Верно. Общий знаменатель 12: 3/4 = 9/12, 1/3 = 4/12 → 9/12 − 4/12 = 5/12.',
    wrong: 'Подсказка: с чем связана общая мерка, делающая знаменатели 4 и 3 одинаковыми? Когда можно вычитать числители?',
    rule: 'Найди общий знаменатель (для 4 и 3 это 12), приведи к нему, затем вычти числители.',
  },
};

export default function D20_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [d, setD] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.a != null) setA(String(s.a)); if (s.d != null) setD(String(s.d)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(d);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D10_A && parseInt(d, 10) === D10_D;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), d: parseInt(d, 10) }, correctAnswer: { a: D10_A, d: D10_D }, correct, meta: { tag: 'sub_coprime_story', level: '🔴' } });
  }, [a, d, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cellStyle = (border) => ({ width: 54, height: 44, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 10, border: '2px solid ' + border, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' });
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0 8px' }}>
        <Frac num="3" den="4" size={32} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <Frac num="1" den="3" size={32} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={a} onChange={(e) => setA(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(a, D10_A))} />
          <div style={{ width: 58, height: 3, background: '#1f2430' }} />
          <input value={d} onChange={(e) => setD(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(d, D10_D))} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 34, justifyContent: 'center', fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>
        <span>{t.l1}</span><span>{t.l2}</span>
      </div>
      <p style={{ ...S.ask, fontSize: 15, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      {reveal && <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...S.mono, fontSize: 15, fontWeight: 800, color: '#0f766e' }}><Frac num="9" den="12" size={17} color="#0f766e" /><span>−</span><Frac num="4" den="12" size={17} color="#0f766e" /><span>=</span><Frac num="5" den="12" size={17} color="#0f766e" /></div>}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
