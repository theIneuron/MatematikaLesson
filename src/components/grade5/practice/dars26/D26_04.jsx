// Dars26 · Amaliyot 04 — Xonalarni tekisla · 🟡 · tag: dec_add_carry
// 3,45 + 2,7. 2,7 = 2,70 deb tekislanadi. 45+70=115 → 1 butun o'tadi → 6,15. Bitta o'nli input.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px', textAlign: 'center' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d26-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D04_ANS = 6.15;
const decNum = (s) => parseFloat(String(s).replace(',', '.').trim());
const decValid = (s) => /^\d+([.,]\d+)?$/.test(String(s).trim());
const D04_T = {
  uz: {
    eyebrow: 'Xonalarni tekisla', setup: "Nodira 3,45 kg unga 2,7 kg qo'shdi. 2,7 ni 2,70 deb yozib, ustunni tekisladi.",
    ask: '3,45 + 2,7 = ?', hint: '2,7 = 2,70',
    correct: "To'g'ri. 45 yuzdan + 70 yuzdan = 115 → 1 butun o'tadi. Javob 6,15.",
    wrong: "Ikki sonda verguldan keyin bir xil miqdorda raqam bormi? Bo'lmasa, tenglashtirish uchun nima yozasiz?",
    rule: "Xonalar teng bo'lsin: 2,7 → 2,70. Keyin qo'shing.",
  },
  ru: {
    eyebrow: 'Выровняй разряды', setup: 'Нодира добавила к 3,45 кг муки ещё 2,7 кг. Записала 2,7 как 2,70 и выровняла столбик.',
    ask: '3,45 + 2,7 = ?', hint: '2,7 = 2,70',
    correct: 'Верно. 45 сотых + 70 сотых = 115 → 1 целое переходит. Ответ 6,15.',
    wrong: 'Одинаково ли число цифр после запятой у двух чисел? Если нет — что дописать, чтобы уравнять?',
    rule: 'Уравняй разряды: 2,7 → 2,70. Затем складывай.',
  },
};

export default function D26_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(decValid(val) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = Math.abs(decNum(val) - D04_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: val.replace('.', ',') }, correctAnswer: { value: '6,15' }, correct, meta: { tag: 'dec_add_carry', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  // Ustun: 3,45 ustida 2,70 (nol och-ko'k), vergul ustma-ust
  const cw = 22, fs = 30, opW = 24, commaW = 10, intW = cw, fracW = 2 * cw, bodyW = intW + commaW + fracW;
  const row = (op, iVal, fArr) => (
    <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
      <div style={{ width: opW, textAlign: 'center', fontFamily: MONO, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>{op}</div>
      <div style={{ width: intW, textAlign: 'right', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: '#1f2430' }}>{iVal}</div>
      <div style={{ width: commaW, textAlign: 'center', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: '#2563eb' }}>,</div>
      <div style={{ width: fracW, textAlign: 'left', fontFamily: MONO, fontSize: fs, fontWeight: 800 }}>{fArr}</div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        .d26-zero { animation: d26zero .8s ease both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d26zero { 0% { opacity: 0; transform: translateX(-6px); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop, .d26-zero { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {row('', '3', <span style={{ color: '#1f2430' }}>45</span>)}
          {row('+', '2', <span><span style={{ color: '#1f2430' }}>7</span><span className="d26-zero" style={{ color: '#38bdf8' }}>0</span></span>)}
          <div style={{ height: 3, background: '#1f2430', marginLeft: opW, width: bodyW, borderRadius: 2, marginTop: 2 }} />
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#0284c7', fontWeight: 800, textAlign: 'center', margin: '2px 0 6px', fontFamily: MONO }}>{t.hint}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 6))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 110, height: 50, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: MONO, background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
