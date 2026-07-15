// Dars08 · Amaliyot 03 — Darajani qur · 🟡 · Sardor · tag: build_power
// "3 ni necha marta ko'paytirsak 81 bo'ladi?" Bola "× 3" bosib ko'paytmani quradi: 3→9→27→81.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d8-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D03_BASE = 3, D03_TARGET = 81, D03_EXP = 4;
const D03_T = {
  uz: {
    eyebrow: 'Darajani qur', setup: "Sardor 3 dan boshlab, uni qayta-qayta 3 ga ko'paytiryapti.",
    ask: "3 ni necha marta ko'paytiruvchi qilib olsak, 81 hosil bo'ladi? «× 3» tugmasini bosib quring.",
    mult: '× 3', undo: 'Qaytar', hint: "Hozir:",
    correct: "To'g'ri. 3 × 3 × 3 × 3 = 81. To'rtta 3 ko'paytuvchi bor — bu 3⁴.",
    wrong: "Maslahat: har bosish ko'paytmani 3 barobar oshiradi. Nechanchi bosishda 81 ga yetishini o'zingiz kuzating.",
    rule: "Ko'rsatkich — ko'paytuvchilar soni. 3⁴ — to'rtta 3 ko'paytiriladi.",
  },
  ru: {
    eyebrow: 'Собери степень', setup: 'Сардор начинает с 3 и снова и снова умножает на 3.',
    ask: 'Сколько раз взять 3 множителем, чтобы получить 81? Нажимайте «× 3».',
    mult: '× 3', undo: 'Назад', hint: 'Сейчас:',
    correct: 'Верно. 3 × 3 × 3 × 3 = 81. Четыре множителя 3 — это 3⁴.',
    wrong: 'Подсказка: каждое нажатие увеличивает произведение в 3 раза. Проследи сам, на каком нажатии выходит 81.',
    rule: 'Показатель — число множителей. 3⁴ — умножаем четыре тройки.',
  },
};
export default function D08_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [count, setCount] = useState(1); // nechta 3 ko'paytuvchi (kamida 1)
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.count != null) { setCount(sa.count); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const value = Math.pow(D03_BASE, count);
  // "Tekshirish" faqat konstruksiya to'liq (81 hosil bo'lgan) va hali tekshirilmagan bo'lsa faol
  useEffect(() => { onReady?.(value === D03_TARGET && !checked); }, [value, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = value === D03_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { count, value }, correctAnswer: { count: D03_EXP, value: D03_TARGET }, correct, meta: { tag: 'build_power', level: '🟡' } });
  }, [count, value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d8-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      {/* quruvchi minora: har ko'paytuvchi — bitta blok */}
      <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 6, margin: '10px 0', minHeight: 120, justifyContent: 'flex-start' }}>
        {Array.from({ length: count }).map((_, k) => (
          <div key={k} className="d8-pop" style={{ width: 90 + k * 8, height: 26, borderRadius: 8, background: ['#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#e11d48'][k % 5], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', ...S.mono, fontSize: 14, fontWeight: 800, boxShadow: '0 2px 0 rgba(0,0,0,.12)' }}>3</div>
        ))}
      </div>
      {/* ifoda (javob ko'rsatilmaydi — bola o'zi hisoblaydi) */}
      <div style={{ textAlign: 'center', margin: '4px 0 10px', ...S.mono, fontSize: 18, fontWeight: 800, color: '#1f2430' }}>
        {Array.from({ length: count }).map(() => '3').join(' × ')}
        {checked && fb?.correct && <span style={{ color: '#1a7f43' }}> = {value}</span>}
      </div>
      {/* tugmalar */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button type="button" disabled={locked} onClick={() => setCount((c) => Math.min(c + 1, 6))} style={{ padding: '12px 22px', borderRadius: 13, border: '2px solid #2563eb', background: '#2563eb', color: '#fff', ...S.mono, fontSize: 18, fontWeight: 800, cursor: locked ? 'default' : 'pointer', minHeight: 50 }}>{t.mult}</button>
        <button type="button" disabled={locked || count <= 1} onClick={() => setCount((c) => Math.max(1, c - 1))} style={{ padding: '12px 18px', borderRadius: 13, border: '2px solid #d6dae3', background: '#fff', color: count <= 1 ? '#cbd5e1' : '#374151', fontSize: 14, fontWeight: 800, cursor: (locked || count <= 1) ? 'default' : 'pointer', minHeight: 50 }}>{t.undo}</button>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
