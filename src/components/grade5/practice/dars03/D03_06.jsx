// Do'kondagi xarid (matnli ayirish). To'g'ri javobdan keyin ustun ayirish
// ko'rsatiladi: 125500 - 25950, natija o'ngdan chapga chiqadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_M = '125500', D06_S = ['', '2', '5', '9', '5', '0'], D06_R = '099550';
const D06_T = {
  uz: {
    eyebrow: 'Xarid',
    setup: "Plastik kartada pul bor edi. Do'kondan xarid qilindi. Kartada necha so'm qoldi?",
    had: 'Kartada bor edi', spent: 'Xarid', unit: "so'm",
    label: "Qolgan pulni yozing (so'm):",
    correct: "To'g'ri. 125 500 - 25 950 = 99 550 so'm.",
    wrong: "Maslahat: xariddan keyin kartadagi pul ko'payadimi yoki kamayadimi? Qaysi amal shu o'zgarishni beradi?",
  },
  ru: {
    eyebrow: 'Покупка',
    setup: 'На карте были деньги. Сделали покупку. Сколько сум осталось?',
    had: 'Было на карте', spent: 'Покупка', unit: 'сум',
    label: 'Запишите остаток (сум):',
    correct: 'Верно. 125 500 - 25 950 = 99 550 сум.',
    wrong: 'Подсказка: после покупки денег на карте станет больше или меньше? Какое действие даёт это изменение?',
  },
};

export default function D03_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setShown(6); } }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(String(val).replace(/[^0-9]/g, '') || '-1', 10);
    const correct = v === 99550;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) [0, 1, 2, 3, 4, 5].forEach((k) => timers.current.push(setTimeout(() => setShown(k + 1), 500 + k * 420)));
    onSubmit?.({ questionText: t.setup, options: [], studentAnswer: { value: v }, correctAnswer: { value: 99550 }, correct, meta: { tag: 'word_sub', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const cw = 30;
  const monoCell = { width: cw, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800 };

  return (
    <div style={S.wrap}>
      <style>{`
        .d3-pop { animation: d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d3-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0 8px' }}>
        <div style={{ flex: '1 1 150px', padding: '12px 14px', borderRadius: 14, background: '#fff0e8', border: '2px solid #bfd4fb' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fe5b1a', letterSpacing: '.03em', marginBottom: 4 }}>{t.had.toUpperCase()}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: '#b83d0e' }}>125 500 <span style={{ fontSize: 14, fontWeight: 700, color: '#ff8a52' }}>{t.unit}</span></div>
        </div>
        <div style={{ flex: '1 1 150px', padding: '12px 14px', borderRadius: 14, background: '#fdecec', border: '2px solid #f5c2c2' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#c0392b', letterSpacing: '.03em', marginBottom: 4 }}>{t.spent.toUpperCase()}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: '#a1231b' }}>− 25 950 <span style={{ fontSize: 14, fontWeight: 700, color: '#e08b84' }}>{t.unit}</span></div>
        </div>
      </div>

      <div style={{ maxHeight: shown >= 1 ? 150 : 0, opacity: shown >= 1 ? 1 : 0, overflow: 'hidden', transition: 'max-height .6s ease, opacity .5s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>{D06_M.split('').map((c, i) => <span key={i} style={monoCell}>{c}</span>)}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
              <span style={{ ...monoCell, color: '#6b7280', width: 'auto', marginRight: 'auto' }}>-</span>
              {D06_S.map((c, i) => <span key={i} style={{ ...monoCell, color: '#64748b' }}>{c}</span>)}
            </div>
            <div style={{ height: 3, background: '#1f2430', borderRadius: 2, margin: '5px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {D06_R.split('').map((c, i) => {
                const fromRight = 6 - i;
                const vis = shown >= fromRight;
                const lead = i === 0;
                return <span key={i} className={vis && !lead ? 'd3-pop' : undefined} style={{ ...monoCell, color: '#1a7f43', opacity: (vis && !lead) ? 1 : 0 }}>{c}</span>;
              })}
            </div>
          </div>
        </div>
      </div>

      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700 }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
          disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 180, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
