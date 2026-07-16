// Dars19 · Amaliyot 09 — Xatoni top · 🟡 · tag: add_find_error
// Sanjar: 1/2 + 1/3 = 2/5 (etalon misconception — maxrajlarni ham qo'shgan). To'g'risi 5/6.
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

const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Sanjar shunday yozibdi: 1/2 + 1/3 = 2/5. Ustoz bu yerda xato borligini aytdi, lekin qayerdaligini Sanjarning o'ziga qoldirdi.",
    ask: 'Xato qayerda?',
    opts: ["Suratlar ham, maxrajlar ham qo'shib yuborilgan. Avval umumiy maxrajga keltirish kerak edi.", "Suratlar noto'g'ri qo'shilgan.", "Xato yo'q, javob to'g'ri."],
    correct: "To'g'ri. Har xil maxrajli kasrlarni shunchaki qo'shib bo'lmaydi. Umumiy maxraj (6): 1/2 = 3/6, 1/3 = 2/6 → 3/6 + 2/6 = 5/6.",
    wrong: "Maxrajlar har xil (2 va 3). Bunday kasrlarni surat va maxrajni alohida qo'shib yechib bo'ladimi? Yaxshilab o'ylang.",
    rule: "Har xil maxrajli kasrlarni qo'shishdan oldin umumiy maxrajga keltiring. 1/2 + 1/3 = 5/6, 2/5 emas.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Санжар написал: 1/2 + 1/3 = 2/5. Учитель сказал, что здесь есть ошибка, но найти её предложил самому Санжару.',
    ask: 'Где ошибка?',
    opts: ['Сложены и числители, и знаменатели. Сначала нужно было привести к общему знаменателю.', 'Числители сложены неверно.', 'Ошибки нет, ответ верный.'],
    correct: 'Верно. Дроби с разными знаменателями просто так не складывают. Общий знаменатель (6): 1/2 = 3/6, 1/3 = 2/6 → 3/6 + 2/6 = 5/6.',
    wrong: 'Знаменатели разные (2 и 3). Можно ли решить, складывая числители и знаменатели по отдельности? Подумай внимательно.',
    rule: 'Перед сложением дробей с разными знаменателями приведи к общему. 1/2 + 1/3 = 5/6, а не 2/5.',
  },
};

export default function D19_09(props) {
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
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D09_CORRECT }, correct, meta: { tag: 'add_find_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d19-in { opacity: 0; animation: d19in .7s ease .12s forwards; }
        .d19-pop { animation: d19pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d19in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes d19pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d19-in, .d19-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d19-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 4px', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <Frac num="1" den="2" size={26} /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>+</span>
        <Frac num="1" den="3" size={26} /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <Frac num="2" den="5" size={26} color="#c0392b" />
      </div>
      {checked && fb?.correct && (
        <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0', flexWrap: 'wrap' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <Frac num="3" den="6" size={19} color="#1a7f43" /><span style={{ ...S.mono, fontWeight: 800, color: '#1a7f43' }}>+</span>
          <Frac num="2" den="6" size={19} color="#1a7f43" /><span style={{ ...S.mono, fontWeight: 800, color: '#1a7f43' }}>=</span>
          <Frac num="5" den="6" size={19} color="#1a7f43" />
        </div>
      )}
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D09_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{renderFr(o)}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
