// Dars06 · Amaliyot 08 — Chuqurlik · 🔴 · depth_diff (vertikal shkala + kiritish)
// Burgut +9 m, suvosti kemasi -15 m. Orasidagi masofa. Vertikal dengiz sathi vizual.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_BIRD = 9, D08_FISH = -15, D08_ANS = 24;
const D08_T = {
  uz: {
    eyebrow: 'Chuqurlik', setup: "Burgut suv sathidan 9 m tepada (+9), suvosti kemasi 15 m pastda (−15).",
    ask: 'Qush bilan baliq orasidagi masofa necha metr?', label: 'Masofani yozing (m):',
    correct: "To'g'ri. Sathdan tepaga 9, pastga 15. Jami 9 + 15 = 24 metr.",
    wrong: "Maslahat: suv sathi (0) ikkalasini ajratib turadi. Har biri sathdan qancha uzoqda? Bu ikki masofa qanday birlashadi?",
    bird: 'Burgut +9', fish: 'Suvosti −15', sea: 'Suv sathi 0',
  },
  ru: {
    eyebrow: 'Глубина', setup: 'Орёл на 9 м выше уровня воды (+9), подлодка на 15 м ниже (−15).',
    ask: 'Какое расстояние между птицей и рыбой (м)?', label: 'Запишите расстояние (м):',
    correct: 'Верно. От уровня вверх 9, вниз 15. Всего 9 + 15 = 24 метра.',
    wrong: 'Подсказка: уровень воды (0) разделяет их. Как далеко каждый от уровня? Как объединяются эти два расстояния?',
    bird: 'Орёл +9', fish: 'Подлодка −15', sea: 'Уровень 0',
  },
};
export default function D06_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
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
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShow(true), 350);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'depth_diff', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d6-pop { animation: d6pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d6pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d6-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* vertikal shkala: qush tepada, suv sathi o'rtada, baliq pastda */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <div style={{ width: 180, borderRadius: 16, overflow: 'hidden', border: '2px solid #e5e7eb' }}>
          {/* havo */}
          <div style={{ background: '#fff4ee', padding: '12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 24 }}>🦅</span>
            <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#fe5b1a' }}>{t.bird}</span>
          </div>
          {/* sath */}
          <div style={{ background: '#ffe7d8', borderTop: '2px dashed #ff8a52', borderBottom: '2px dashed #ff8a52', padding: '4px 10px', textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#b83d0e' }}>~ {t.sea} ~</div>
          {/* suv */}
          <div style={{ background: '#cffafe', padding: '12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 24 }}>🚢</span>
            <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#0e7490' }}>{t.fish}</span>
          </div>
          {/* natija */}
          <div style={{ maxHeight: show ? 40 : 0, opacity: show ? 1 : 0, overflow: 'hidden', transition: 'all .5s ease', background: '#f0fdf4', textAlign: 'center' }}>
            <div className="d6-pop" style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#166534', padding: '9px 0' }}>9 + 15 = 24 m</div>
          </div>
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
