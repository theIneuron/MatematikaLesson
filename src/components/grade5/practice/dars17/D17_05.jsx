// Dars17 · Amaliyot 05 — Butungacha to'ldi · 🔴 · tag: add_to_whole
// 3/5 + 2/5 = 5/5 = 1 butun. Ikki maydon: yig'indi surati (5) va necha butun (1).
// To'g'ri javobda tasma to'liq to'ladi va sekin porlab "1 butun" chiqadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

const D05_A = 5, D05_W = 1; // 5/5 = 1 butun
const D05_T = {
  uz: {
    eyebrow: "Tug'ilgan kun", setup: "Aziza tug'ilgan kun tortini 5 teng bo'lakka bo'ldi. Birinchi kuni 3 bo'lagini, ikkinchi kuni qolgan 2 bo'lagini yedi.",
    ask: "Aziza jami qancha tort yedi? Yig'indini (?/5) va bu necha butun ekanini yozing.",
    l1: 'Surat:', l2: 'Butun:',
    correct: "To'g'ri. 3 + 2 = 5, ya'ni 5/5 — barcha 5 bo'lak to'ldi, bu 1 butun.",
    wrong: "Maslahat: maxraj o'zgarmaydi, suratlar qo'shiladi. Agar barcha bo'laklar to'lsa — bu qismmi yoki butunmi?",
    rule: "Surati maxrajiga teng kasr (5/5) — bu 1 butun.",
  },
  ru: {
    eyebrow: 'День рождения', setup: 'Азиза разрезала праздничный торт на 5 равных частей. В первый день съела 3 части, во второй — оставшиеся 2.',
    ask: 'Сколько всего торта съела Азиза? Запиши сумму (?/5) и сколько это целых.',
    l1: 'Числитель:', l2: 'Целых:',
    correct: 'Верно. 3 + 2 = 5, то есть 5/5 — все 5 частей заполнены, это 1 целое.',
    wrong: 'Подсказка: знаменатель не меняется, числители складываются. Если заполнены все части — это часть или целое?',
    rule: 'Дробь, у которой числитель равен знаменателю (5/5), — это 1 целое.',
  },
};

export default function D17_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [w, setW] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(3); // boshida 3/5 ko'rinadi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.a != null) setA(String(sa.a)); if (sa.w != null) setW(String(sa.w)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setFill(5); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(w);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D05_A && parseInt(w, 10) === D05_W;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [4, 5].forEach((k, i) => timers.current.push(setTimeout(() => setFill(k), 400 + i * 550)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), w: parseInt(w, 10) }, correctAnswer: { a: D05_A, w: D05_W }, correct, meta: { tag: 'add_to_whole', level: '🔴' } });
  }, [a, w, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const done = checked && fb?.correct && fill >= 5;
  const cw = 300 / 5;
  const bdCol = (v, ok) => checked ? (v === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cell = (val, set, ok, max) => (
    <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, max))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 54, height: 44, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bdCol(parseInt(val, 10), ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .7s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d17-glow { animation: d17glow 1.1s ease .2s both; }
        @keyframes d17glow { 0% { filter: none; } 45% { filter: drop-shadow(0 0 7px #fcd34d); } 100% { filter: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop, .d17-glow { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
        <svg width="300" height="40" viewBox="0 0 300 40" className={done ? 'd17-glow' : undefined}>
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={i * cw + 1.5} y="2" width={cw - 3} height="36" rx="4"
              fill={i < fill ? (done ? '#fcd34d' : '#93c5fd') : '#eef2f7'} stroke="#cbd5e1" strokeWidth="1"
              style={{ transition: 'fill .6s ease' }} />
          ))}
        </svg>
      </div>
      {done && <div className="d17-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 17, fontWeight: 800, color: '#b45309', marginBottom: 4 }}>= 1 {lang === 'uz' ? 'butun' : 'целое'}</div>}
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'flex-start', marginTop: 4 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {cell(a, setA, D05_A, 1)}
            <div style={{ width: 58, height: 3, background: '#1f2430' }} />
            <div style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#64748b' }}>5</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>
          {cell(w, setW, D05_W, 1)}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
