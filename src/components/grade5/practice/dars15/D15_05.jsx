// Dars15 · Amaliyot 05 — Doirani bo'lish · 🟡 · Sabina · tag: split_pie
// 3/4 doira. "Har bo'lakni ikkiga bo'l" → 8 bo'lak, bo'yalgan 6/8. Keyin surat kiritish.
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

/* =================== 05 · Doirani bo'lish · 🟡 · split_pie (interaktiv + doira) =================== */
// 3/4 doira. "Har bo'lakni ikkiga bo'l" → 8 bo'lak, bo'yalgan 6/8. Keyin surat kiritish.

const D05_ANS = 6;
const Pie5 = ({ den, shaded, size = 130, fill = '#ffb488', light = '#fff4ee' }) => {
  const R = size / 2, C = R;
  const seg = [];
  for (let k = 0; k < den; k++) {
    const a0 = (k / den) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((k + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x0 = C + R * Math.cos(a0), y0 = C + R * Math.sin(a0);
    const x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    seg.push({ d: `M${C},${C} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`, on: k < shaded });
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{seg.map((sg, k) => <path key={k} d={sg.d} fill={sg.on ? fill : light} stroke="#fff" strokeWidth="2.5" style={{ transition: 'fill .5s' }} />)}</svg>;
};
const D05_T = {
  uz: {
    eyebrow: "Doirani bo'ling", setup: "Sabina 3/4 bo'yalgan doirani mayda bo'laklarga bo'lmoqchi.",
    ask: "Har bo'lakni ikkiga bo'lish uchun tugmani bosing, keyin yangi suratni yozing:",
    btn: "Har bo'lakni 2 ga bo'l", label: 'Yangi surat (maxraj 8):',
    correct: "To'g'ri. Har bo'lak ikkiga bo'lindi: 4 bo'lak → 8 bo'lak, bo'yalgani 3 → 6. Demak 3/4 = 6/8.",
    wrong: "Maslahat: har bo'lakni ikkiga bo'lgach, bo'yalgan mayda bo'laklarni o'zingiz sanang. Nechta chiqadi?",
    rule: "Har bo'lakni bir xil bo'lsak — teng kasr: surat va maxraj birga ko'payadi (×2).",
  },
  ru: {
    eyebrow: 'Раздели круг', setup: 'Сабина хочет разделить круг 3/4 на мелкие части.',
    ask: 'Нажмите кнопку, чтобы разделить каждую часть надвое, затем впишите новый числитель:',
    btn: 'Раздели каждую часть на 2', label: 'Новый числитель (знаменатель 8):',
    correct: 'Верно. Каждая часть разделена надвое: 4 → 8, закрашено 3 → 6. Значит 3/4 = 6/8.',
    wrong: 'Подсказка: раздели каждую часть надвое и сам сосчитай закрашенные мелкие части. Сколько получится?',
    rule: 'Разделив каждую часть одинаково — равная дробь: числитель и знаменатель растут вместе (×2).',
  },
};
export default function D15_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [split, setSplit] = useState(false);
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.split) setSplit(true); if (sa.value != null) setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { split, value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'split_pie', level: '🟡' } });
  }, [split, val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const den = split ? 8 : 4, shaded = split ? 6 : 3;
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}><Pie5 den={den} shaded={shaded} size={140} /></div>
      <p style={{ ...S.ask, fontSize: 15.5, marginTop: 8 }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <button type="button" disabled={isReview || checked || split} onClick={() => setSplit(true)} style={{ padding: '11px 18px', borderRadius: 12, border: '2px solid ' + (split ? '#cbd5e1' : '#14b8a6'), background: split ? '#f8fafc' : '#f0fdfa', color: split ? '#cbd5e1' : '#0f766e', fontSize: 14, fontWeight: 800, cursor: (isReview || checked || split) ? 'default' : 'pointer', minHeight: 46 }}>✂ {t.btn}</button>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <Frac num="3" den="4" size={26} color="#fe5b1a" />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 58, height: 44, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 64, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>8</div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
