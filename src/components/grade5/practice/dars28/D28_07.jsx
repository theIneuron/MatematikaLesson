// Dars28 · Amaliyot 07 — Vergulni joyla · 🔴 · tag: mul_place_comma
// 1,2 × 0,4 → raqamlar 48. Kasr xonalar 1+1=2 → vergul 2 xona: 0,48.
// Mexanika: raqamlar orasidagi slotni bosib vergul qo'yiladi. jsx-question kontrakti. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#4338ca', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d28-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const DIGITS = ['4', '8'];
const D07_CORRECT = 0; // vergul 4 dan oldin → 0,48 (2 kasr xona)
const D07_T = {
  uz: {
    eyebrow: 'Vergulni joyla', setup: "Rustam 1,2 × 0,4 ni hisoblab, 48 raqamlarini oldi. Endi vergulni to'g'ri joyga qo'yish kerak.",
    ask: "Raqamlar orasidagi slotni bosib vergul qo'ying:",
    correct: "To'g'ri. 12 × 4 = 48, kasr xonalar 1 + 1 = 2 → 0,48.",
    wrong: "Ko'paytuvchilardagi kasr xonalar yig'indisini sanang — natijada vergul shuncha xonani ajratadi.",
    rule: "Verguldan keyingi xonalar soni = ikki ko'paytuvchidagi jami xona.",
  },
  ru: {
    eyebrow: 'Поставь запятую', setup: 'Рустам посчитал 1,2 × 0,4 и получил цифры 48. Теперь надо поставить запятую в верное место.',
    ask: 'Нажми слот между цифрами, чтобы поставить запятую:',
    correct: 'Верно. 12 × 4 = 48, дробных разрядов 1 + 1 = 2 → 0,48.',
    wrong: 'Сложи число дробных разрядов множителей — запятая в результате отделит столько же разрядов.',
    rule: 'Число разрядов после запятой = сумма разрядов обоих множителей.',
  },
};
// slot s bo'yicha ko'rinish: 0→"0,48", 1→"4,8", 2→"48"
const shown = (s) => s === 0 ? '0,48' : s === 1 ? '4,8' : '48';

export default function D28_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [slot, setSlot] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.slot != null) { setSlot(initialAnswer.studentAnswer.slot); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(slot != null && !checked); }, [slot, checked, onReady]);
  const check = useCallback(() => {
    const correct = slot === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slot, shown: slot != null ? shown(slot) : null }, correctAnswer: { slot: D07_CORRECT, value: '0,48' }, correct, meta: { tag: 'mul_place_comma', level: '🔴' } });
  }, [slot, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slotBtn = (s) => {
    const on = slot === s;
    let bd = '#cbd5e1', bg = '#f8fafc', col = '#94a3b8';
    if (on) { bd = '#4338ca'; bg = '#eef2ff'; col = '#4338ca'; }
    if (checked && on) { const ok = s === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button key={s} type="button" disabled={isReview || checked} onClick={() => setSlot(s)} style={{ width: 26, height: 52, borderRadius: 8, border: '2px dashed ' + bd, background: bg, color: col, ...S.mono, fontSize: 26, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>{on ? ',' : '·'}</button>;
  };
  const digit = (d) => <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#1f2430', width: 34, textAlign: 'center' }}>{d}</span>;
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, margin: '8px 0' }}>
        {slotBtn(0)}{digit(DIGITS[0])}{slotBtn(1)}{digit(DIGITS[1])}{slotBtn(2)}
      </div>
      {slot != null && (
        <div style={{ textAlign: 'center', margin: '2px 0' }}>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 700 }}>{lang === 'uz' ? "Hosil bo'ldi: " : 'Получилось: '}</span>
          <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#1f2430' }}>{shown(slot)}</span>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
