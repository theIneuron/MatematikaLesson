// Dars09 · Amaliyot 08 — Qolgan olma · 🔴 · remaining_quymoq (kiritish + vau)
// 20 olma. 3/10 + 4/10 + 1/10 olindi. Necha qoldi? 6+8+2=16, 20-16=4.
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
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_TOTAL = 20, D08_ANS = 4;
const D08_T = {
  uz: {
    eyebrow: 'Qolgan olma', setup: "Bog'da 20 ta olma terildi. Aziza 3/10, Nargiza 4/10, Dilnoza 1/10 qismini oldi.",
    ask: 'Necha olma qoldi?', label: 'Javobni yozing:',
    correct: "To'g'ri. Aziza 6, Nargiza 8, Dilnoza 2 ta oldi: 6+8+2=16. Qolgan: 20−16 = 4.",
    wrong: "Maslahat: bitta ulush nechta olmaga teng? Olinganlar jami qancha bo'lishini toping va uni butun bilan solishtiring.",
    rule: "Har ulushni alohida hisoblang, yig'indini butundan ayiring.",
  },
  ru: {
    eyebrow: 'Осталось яблок', setup: 'В саду собрали 20 яблок. Азиза взяла 3/10, Наргиза 4/10, Дилноза 1/10.',
    ask: 'Сколько яблок осталось?', label: 'Запишите ответ:',
    correct: 'Верно. Азиза 6, Наргиза 8, Дилноза 2: 6+8+2=16. Осталось: 20−16 = 4.',
    wrong: 'Подсказка: сколько яблок в одной доле? Найди, сколько взяли всего, и сравни с общим числом.',
    rule: 'Каждую долю считай отдельно, сумму вычти из целого.',
  },
};
export default function D09_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [eaten, setEaten] = useState(0); // yeyilgan quymoqlar (animatsiya)
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setEaten(16); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) Array.from({ length: 16 }).forEach((_, k) => timers.current.push(setTimeout(() => setEaten(k + 1), 400 + k * 90)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'remaining_quymoq', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* 20 quymoq, yeyilganlari xira/tushib qoladi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5, margin: '10px 0', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const gone = i < eaten;
          return <span key={i} style={{ fontSize: 22, textAlign: 'center', opacity: gone ? 0.18 : 1, transform: gone ? 'scale(.7)' : 'none', transition: 'all .45s ease', filter: gone ? 'grayscale(1)' : 'none' }}>🍎</span>;
        })}
      </div>
      {eaten >= 16 && <div className="d9-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43', marginBottom: 4 }}>20 − 16 = 4</div>}
      <p style={{ ...S.ask, fontSize: 16, margin: '6px 0' }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 140, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
