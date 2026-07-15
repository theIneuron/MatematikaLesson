// Dars20 · Amaliyot 09 — Xatoni top · 🟡 · tag: sub_find_error
// Daler: 5/8 − 1/2 = 4/6 (surat va maxrajni ayirib yuborgan). To'g'risi: 5/8 − 4/8 = 1/8.
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

const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Daler shunday yozibdi: 5/8 − 1/2 = 4/6. Ustoz bu yerda xato borligini aytdi, lekin qayerdaligini Dalerning o'ziga qoldirdi.",
    ask: 'Xato qayerda?',
    opts: ["Suratlar ham, maxrajlar ham ayirilgan. Avval umumiy maxrajga keltirish kerak edi.", "Suratlar noto'g'ri ayirilgan.", "Xato yo'q, javob to'g'ri."],
    correct: "To'g'ri. Har xil maxrajli kasrlarni shunchaki ayirib bo'lmaydi. 1/2 = 4/8, so'ng 5/8 − 4/8 = 1/8.",
    wrong: "Maslahat: maxrajlar har xil (8 va 2). Ularni to'g'ridan-to'g'ri ayirib bo'ladimi? Avval nima qilish kerak?",
    rule: "Har xil maxrajli kasrlarni ayirishdan oldin umumiy maxrajga keltiring. 5/8 − 1/2 = 1/8, 4/6 emas.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Далер написал: 5/8 − 1/2 = 4/6. Учитель сказал, что здесь есть ошибка, но найти её предложил самому Далеру.',
    ask: 'Где ошибка?',
    opts: ['Вычтены и числители, и знаменатели. Сначала нужно было привести к общему знаменателю.', 'Числители вычтены неверно.', 'Ошибки нет, ответ верный.'],
    correct: 'Верно. Дроби с разными знаменателями просто так не вычитают. 1/2 = 4/8, затем 5/8 − 4/8 = 1/8.',
    wrong: 'Подсказка: знаменатели разные (8 и 2). Можно ли вычитать их напрямую? Что нужно сделать сначала?',
    rule: 'Перед вычитанием дробей с разными знаменателями приведи к общему. 5/8 − 1/2 = 1/8, а не 4/6.',
  },
};

export default function D20_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D09_CORRECT }, correct, meta: { tag: 'sub_find_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-in { opacity: 0; animation: d20in .7s ease .12s forwards; }
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-in, .d20-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d20-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 4px', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <Frac num="5" den="8" size={26} /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <Frac num="1" den="2" size={26} /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <Frac num="4" den="6" size={26} color="#c0392b" />
      </div>
      {checked && fb?.correct && (
        <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0', flexWrap: 'wrap' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <Frac num="5" den="8" size={19} color="#1a7f43" /><span style={{ ...S.mono, fontWeight: 800, color: '#1a7f43' }}>−</span>
          <Frac num="4" den="8" size={19} color="#1a7f43" /><span style={{ ...S.mono, fontWeight: 800, color: '#1a7f43' }}>=</span>
          <Frac num="1" den="8" size={19} color="#1a7f43" />
        </div>
      )}
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D09_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{renderFr(o)}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
