// Dars05 · Amaliyot 01 — Teng ulash · 🟢 · Nilufar · tag: simple_div
// 96 : 4. Chap tomonda 4 rangli savat. To'g'ri javobdan keyin 96 predmet
// to'rt savatga teng tarqaladi (24 tadan), javob kiritish.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D01_TOTAL = 96, D01_GROUPS = 4, D01_ANS = 24;
const D01_T = {
  uz: {
    eyebrow: "Bo'lish", setup: "Nilufar 96 ta stikerni 4 ta do'stiga teng ulashmoqchi.",
    ask: 'Har biriga nechtadan stiker tegadi?', label: 'Javobni yozing:',
    correct: "To'g'ri. 96 : 4 = 24. Har bir do'stga 24 tadan.",
    wrong: "Maslahat: teng ulashish — bu bo'lish. 96 ni 4 ta teng qismga ajratsang, har qismda qancha bo'ladi?",
  },
  ru: {
    eyebrow: 'Деление', setup: 'Нилуфар делит 96 наклеек поровну между 4 друзьями.',
    ask: 'Сколько наклеек достанется каждому?', label: 'Запишите ответ:',
    correct: 'Верно. 96 : 4 = 24. Каждому по 24.',
    wrong: 'Подсказка: поделить поровну — это деление. Раздели 96 на 4 равные части — сколько в каждой?',
  },
};
export default function D05_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(0); // nechta stiker joylandi (0..96)
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setFill(D01_ANS); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D01_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) Array.from({ length: D01_ANS }).forEach((_, k) => timers.current.push(setTimeout(() => setFill(k + 1), 300 + k * 70)));
    onSubmit?.({ questionText: '96 : 4', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'simple_div', level: '🟢' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const tints = ['#2563eb', '#7c3aed', '#0f766e', '#c2410c'];
  const softs = ['#eff6ff', '#faf5ff', '#f0fdfa', '#fff7ed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d5-pop { animation: d5pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d5pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d5-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '14px 0 10px' }}>
        {Array.from({ length: D01_GROUPS }).map((_, g) => {
          const got = Math.max(0, Math.min(D01_ANS, fill - 0)); // har savatga bir xilda tushadi
          const perThis = Math.floor(fill); // sodda: fill = har savatdagi son (0..24)
          return (
            <div key={g} style={{ flex: 1, minHeight: 92, padding: 8, borderRadius: 14, border: '2px solid ' + (perThis > 0 ? tints[g] : '#e5e7eb'), background: perThis > 0 ? softs[g] : '#fafafa', transition: 'all .45s' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', minHeight: 54 }}>
                {Array.from({ length: perThis }).map((_, k) => <span key={k} className="d5-pop" style={{ width: 9, height: 9, borderRadius: 999, background: tints[g] }} />)}
              </div>
              {perThis > 0 && <div style={{ textAlign: 'center', ...S.mono, fontSize: 15, fontWeight: 800, color: tints[g], marginTop: 4 }}>{perThis}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', ...S.mono, fontSize: 30, fontWeight: 800, margin: '8px 0 2px' }}>96 : 4</div>
      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700, textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 150, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
