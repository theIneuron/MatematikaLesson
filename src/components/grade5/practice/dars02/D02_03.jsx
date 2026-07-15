// Dars02 · Amaliyot 03 — Bir xil xonali sonlarni taqqoslash · 🟡 · Madina · tag: compare_same
// Farq YUZLAR xonasida: 36 0 99 va 36 1 06. To'g'ri javobdan keyin: ? → belgi;
// variantlar pastga suriladi; hal qiluvchi raqamlar (0 va 1) pastga tushadi,
// o'rni kulrang bo'ladi, orasiga belgi qo'yiladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
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
const SIGNS = ['<', '=', '>'];

const D03_L = '36099', D03_R = '36106', D03_POS = 2, D03_SIGN = 0; // '<' · yuzlar xonasi
const D03_T = {
  uz: {
    eyebrow: 'Taqqoslash',
    setup: 'Madina bir xil xonali ikki sonni taqqoslamoqchi. Belgini tanlang:',
    hint: 'yuzlar xonasi',
    correct: "To'g'ri. O'n minglar va minglar teng. Yuzlar xonasida 0 < 1 — shu yerda hal bo'ladi.",
    wrong: "Maslahat: xonalari teng. Chapdan boshlab bir xil nomli xonalarni solishtiring, birinchi farq qayerda?",
  },
  ru: {
    eyebrow: 'Сравнение',
    setup: 'Мадина сравнивает два числа с одинаковым числом разрядов. Выберите знак:',
    hint: 'разряд сотен',
    correct: 'Верно. Десятки тысяч и тысячи равны. В разряде сотен 0 < 1 — здесь всё и решается.',
    wrong: 'Подсказка: разрядов поровну. Сравнивайте одноимённые разряды слева, где первое различие?',
  },
};

function D03_Num({ text, phase }) {
  return (
    <span style={{ display: 'inline-flex', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 700 }}>
      {text.split('').map((c, i) => {
        const key = i === D03_POS;
        return (
          <span key={i} style={{ width: 20, textAlign: 'center', color: (phase >= 2 && key) ? '#c3c9d3' : '#1f2430', transition: 'color .6s ease' }}>{c}</span>
        );
      })}
    </span>
  );
}

export default function D02_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1 belgi · 2 joy ochiladi + kulrang · 3 raqamlar tushadi · 4 belgi orasida
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(4); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D03_SIGN;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      [[1, 350], [2, 1200], [3, 2100], [4, 3100]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    }
    onSubmit?.({
      questionText: '36099 ? 36106', options: SIGNS.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: SIGNS[picked] },
      correctAnswer: { idx: D03_SIGN, label: '<' },
      correct, meta: { tag: 'compare_same', level: '🟡' },
    });
  }, [picked, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const btn = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#1f2430';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; }
    if (show) { const ok = i === D03_SIGN; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, minHeight: 60, fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' };
  };

  const big = { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 30, fontWeight: 800, color: '#1a7f43' };

  return (
    <div style={S.wrap}>
      <style>{`
        .d-pop { animation: dpop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes dpop { 0% { opacity: 0; transform: scale(.4) rotate(-10deg); } 100% { opacity: 1; transform: none; } }
        .d-drop { animation: ddrop .6s cubic-bezier(.22,1,.36,1) both; }
        @keyframes ddrop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d-pop, .d-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '20px 0 6px' }}>
        <D03_Num text={D03_L} phase={ph} />
        <span key={ph >= 1 ? 's' : 'q'} className={ph >= 1 ? 'd-pop' : undefined}
          style={{ fontSize: 28, fontWeight: 800, color: ph >= 1 ? '#1a7f43' : '#9aa1ad', minWidth: 28, textAlign: 'center' }}>
          {ph >= 1 ? '<' : '?'}
        </span>
        <D03_Num text={D03_R} phase={ph} />
      </div>

      {/* tushgan raqamlar — variantlar shu qadar pastga suriladi */}
      <div style={{ maxHeight: ph >= 2 ? 92 : 0, opacity: ph >= 2 ? 1 : 0, overflow: 'hidden', transition: 'max-height .8s cubic-bezier(.33,1,.42,1), opacity .6s ease .1s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, paddingTop: 14 }}>
          <span className={ph >= 3 ? 'd-drop' : undefined} style={{ ...big, opacity: ph >= 3 ? 1 : 0 }}>0</span>
          <span className={ph >= 4 ? 'd-pop' : undefined} style={{ ...big, opacity: ph >= 4 ? 1 : 0 }}>&lt;</span>
          <span className={ph >= 3 ? 'd-drop' : undefined} style={{ ...big, opacity: ph >= 3 ? 1 : 0, animationDelay: '.12s' }}>1</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 800, color: '#7c3aed', marginTop: 6, opacity: ph >= 4 ? 1 : 0, transition: 'opacity .6s ease' }}>{t.hint}</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {SIGNS.map((o, i) => <button key={i} type="button" style={btn(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
