// Dars15 · Amaliyot 09 — Qisqartirish · 🔴 · tag: reduce_fill
// 6/8 = ?/4. Surat/maxrajni ÷2: 6:2=3, 8:2=4. To'g'ri javobdan keyin ÷2 ko'rsatiladi.
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

/* =================== 09 · Qisqartirish · 🔴 · reduce_fill (bo'sh katak + teskari) =================== */
// 6/8 = ?/4. Surat/maxrajni ÷2: 6:2=3, 8:2=4. To'g'ri javobdan keyin ÷2 ko'rsatiladi.

const D09_ANS = 3;
const D09_T = {
  uz: {
    eyebrow: 'Kichraytiring', setup: "6/8 ni kichikroq sonli teng kasrga keltiramiz. Maxraj 8 dan 4 ga tushdi.",
    ask: 'Suratni toping: 6/8 = ?/4', label: 'Suratni yozing:',
    correct: "To'g'ri. Maxraj 8 dan 4 bo'ldi (÷2), surat ham ÷2: 6:2 = 3. Demak 6/8 = 3/4.",
    wrong: "Maslahat: maxraj 8 dan 4 ga qanday amal bilan o'tdi? Suratga ham aynan o'sha amalni qo'llasangiz, qiymat saqlanadi.",
    rule: "Teng kasrni kichraytirish: surat va maxrajni bir xil songa BO'LING.",
  },
  ru: {
    eyebrow: 'Уменьшите', setup: 'Приведём 6/8 к равной дроби с меньшими числами. Знаменатель стал 4 из 8.',
    ask: 'Найдите числитель: 6/8 = ?/4', label: 'Впишите числитель:',
    correct: 'Верно. Знаменатель стал 4 из 8 (÷2), числитель тоже ÷2: 6:2 = 3. Значит 6/8 = 3/4.',
    wrong: 'Подсказка: каким действием знаменатель стал 4 из 8? Примени то же действие к числителю — тогда значение сохранится.',
    rule: 'Уменьшение равной дроби: раздели числитель и знаменатель на одно число.',
  },
};
export default function D15_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShow(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShow(true), 700);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'reduce_fill', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '16px 0 6px' }}>
        <Frac num="6" den="8" size={38} color="#7c3aed" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 64, height: 46, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 70, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#64748b' }}>4</div>
        </div>
      </div>
      <div style={{ height: show ? 30 : 0, opacity: show ? 1 : 0, overflow: 'hidden', transition: 'height .5s ease, opacity .5s ease', display: 'flex', gap: 30, justifyContent: 'center', alignItems: 'center' }}>
        {show && <span className="d15-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#7c3aed', background: '#faf5ff', padding: '4px 10px', borderRadius: 9 }}>surat :2</span>}
        {show && <span className="d15-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#7c3aed', background: '#faf5ff', padding: '4px 10px', borderRadius: 9 }}>maxraj :2</span>}
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '6px 0 4px', textAlign: 'center' }}>{t.label}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
