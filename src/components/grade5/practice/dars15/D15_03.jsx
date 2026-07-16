// Dars15 · Amaliyot 03 — Lentani bo'lish · 🟢 · Umid · tag: split_bar
// 2/3 lenta. "Har ulushni ikkiga bo'l" → 6 ulush, bo'yalgan 4/6. Keyin surat kiritish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d15-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

/* =================== 03 · Lentani bo'lish · 🟢 · split_bar (interaktiv bo'lish) =================== */
// 2/3 lenta. "Har ulushni ikkiga bo'l" → 6 ulush, bo'yalgan 4/6. Keyin surat kiritish.

const D03_ANS = 4;
const D03_T = {
  uz: {
    eyebrow: "Lentani bo'ling", setup: "Umid 2/3 bo'yalgan lentani mayda ulushlarga bo'lmoqchi.",
    ask: "Har ulushni ikkiga bo'lish uchun tugmani bosing, keyin yangi suratni yozing:",
    btn: "Har ulushni 2 ga bo'l", label: 'Yangi surat (maxraj 6):',
    correct: "To'g'ri. Har ulush ikkiga bo'lindi: 3 ulush → 6 ulush, bo'yalgani 2 → 4. Demak 2/3 = 4/6.",
    wrong: "Maslahat: har yirik ulushni ikkiga bo'lgach, bo'yalgan mayda ulushlarni o'zingiz sanang. Nechta chiqadi?",
    rule: "Har ulushni bir xil bo'lakka bo'lsak — teng kasr chiqadi: surat va maxraj birga ko'payadi.",
  },
  ru: {
    eyebrow: 'Раздели ленту', setup: 'Умид хочет разделить ленту 2/3 на мелкие доли.',
    ask: 'Нажмите кнопку, чтобы разделить каждую долю надвое, затем впишите новый числитель:',
    btn: 'Раздели каждую долю на 2', label: 'Новый числитель (знаменатель 6):',
    correct: 'Верно. Каждая доля разделена надвое: 3 доли → 6 долей, закрашено 2 → 4. Значит 2/3 = 4/6.',
    wrong: 'Подсказка: раздели каждую крупную долю надвое и сам сосчитай закрашенные мелкие доли. Сколько получится?',
    rule: 'Разделив каждую долю одинаково — получаем равную дробь: числитель и знаменатель растут вместе.',
  },
};
export default function D15_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [split, setSplit] = useState(false);
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.split) setSplit(true); if (sa.value != null) setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { split, value: parseInt(val, 10) }, correctAnswer: { value: D03_ANS }, correct, meta: { tag: 'split_bar', level: '🟢' } });
  }, [split, val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const den = split ? 6 : 3, shaded = split ? 4 : 2;
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* lenta: bo'lishdan oldin 3 ulush, keyin 6 */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 8px' }}>
        <div style={{ display: 'flex', width: 300, height: 46, border: '2px solid #fe5b1a', borderRadius: 8, overflow: 'hidden' }}>
          {Array.from({ length: den }).map((_, i) => (
            <div key={i} style={{ flex: 1, borderRight: i < den - 1 ? '1.5px solid #fe5b1a' : 'none', background: i < shaded ? '#ffb488' : '#fff4ee', transition: 'background .5s ease, flex .5s ease' }} />
          ))}
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, marginTop: 8 }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <button type="button" disabled={isReview || checked || split} onClick={() => setSplit(true)} style={{ padding: '11px 18px', borderRadius: 12, border: '2px solid ' + (split ? '#cbd5e1' : '#14b8a6'), background: split ? '#f8fafc' : '#f0fdfa', color: split ? '#cbd5e1' : '#0f766e', fontSize: 14, fontWeight: 800, cursor: (isReview || checked || split) ? 'default' : 'pointer', minHeight: 46 }}>✂ {t.btn}</button>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <Frac num="2" den="3" size={26} color="#fe5b1a" />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 58, height: 44, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 64, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>6</div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
