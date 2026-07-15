// Dars20 · Amaliyot 07 — Masala + qisqartirish · 🔴 · tag: sub_story_reduce
// Nilufar: 5/6 − 1/3 = 5/6 − 2/6 = 3/6, eng sodda holda 1/2. Shisha suvi sekin pasayadi.
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
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

function Bottle({ level, w = 76, h = 148 }) {
  const pad = 10, xl = 15, xr = w - 15, yTop = pad, yBot = h - pad, usable = yBot - yTop;
  const yFor = (u) => yBot - usable * (u / 6);
  return (
    <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} aria-hidden="true">
      <defs><clipPath id="d20btl"><rect x={xl} y={yTop} width={xr - xl} height={usable} rx="10" /></clipPath></defs>
      <rect x={xl} y={yTop} width={xr - xl} height={usable} rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <rect x={xl} y={yFor(level)} width={xr - xl} height={usable} fill="#dbeafe" clipPath="url(#d20btl)" style={{ transition: 'y .85s ease' }} />
      {[1, 2, 3, 4, 5].map((u) => { const y = yFor(u), third = (u === 2 || u === 4); return <line key={u} x1={xl} y1={y} x2={xr} y2={y} stroke={third ? '#60a5fa' : '#cbd5e1'} strokeWidth={third ? 1.5 : 1} strokeDasharray="3 2" />; })}
      <rect x={xl} y={yTop} width={xr - xl} height={usable} rx="10" fill="none" stroke="#94a3b8" strokeWidth="2" />
    </svg>
  );
}

const D07 = { d: 3, a: 1, b: 2 }; // 3/6 = 1/2
const D07_T = {
  uz: {
    eyebrow: 'Sut', setup: "Nilufar idishida 5/6 litr sut bor edi. Bo'tqa pishirish uchun uning 1/3 litrini ishlatdi.",
    ask: 'Idishda qancha sut qoldi? Javobingizni eng sodda holda yozing.',
    l1: 'Ayirma:', l2: 'Eng sodda:',
    correct: "To'g'ri. 1/3 = 2/6, so'ng 5/6 − 2/6 = 3/6. Eng sodda holda: 3/6 = 1/2.",
    wrong: "Maslahat: olingan qismni ayirish uchun ikkala kasr qanday o'lchovda bo'lishi kerak? Javob eng sodda ko'rinishdami?",
    rule: "Umumiy maxrajga keltiring, ayiring, so'ng natijani eng sodda holga keltiring: 3/6 = 1/2.",
  },
  ru: {
    eyebrow: 'Молоко', setup: 'В сосуде у Нилуфар было 5/6 литра молока. Для каши она использовала 1/3 литра.',
    ask: 'Сколько молока осталось? Запиши ответ в простейшем виде.',
    l1: 'Разность:', l2: 'Простейший:',
    correct: 'Верно. 1/3 = 2/6, затем 5/6 − 2/6 = 3/6. В простейшем виде: 3/6 = 1/2.',
    wrong: 'Подсказка: в какой мерке должны быть обе дроби, чтобы вычесть использованную часть? А ответ уже в простейшем виде?',
    rule: 'Приведи к общему знаменателю, вычти, затем упрости результат: 3/6 = 1/2.',
  },
};

export default function D20_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [d, setD] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [level, setLevel] = useState(5);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.d != null) setD(String(s.d)); if (s.a != null) setA(String(s.a)); if (s.b != null) setB(String(s.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setLevel(3); } } }, [initialAnswer]);
  const full = /^\d+$/.test(d) && /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(d, 10) === D07.d && parseInt(a, 10) === D07.a && parseInt(b, 10) === D07.b;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setLevel(3), 350);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { d: parseInt(d, 10), a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: D07, correct, meta: { tag: 'sub_story_reduce', level: '🔴' } });
  }, [d, a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cellStyle = (border) => ({ width: 50, height: 42, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + border, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' });
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } svg rect[style] { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '6px 0' }}>
        <Bottle level={level} />
        {checked && fb?.correct && level === 3 && <span className="d20-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e' }}><Frac num="3" den="6" size={18} color="#0f766e" /><span>=</span><Frac num="1" den="2" size={18} color="#0f766e" /></span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 4 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={d} onChange={(e) => setD(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(d, D07.d))} />
            <div style={{ width: 52, height: 3, background: '#1f2430' }} />
            <div style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#64748b' }}>6</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={a} onChange={(e) => setA(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(a, D07.a))} />
            <div style={{ width: 52, height: 3, background: '#1f2430' }} />
            <input value={b} onChange={(e) => setB(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(b, D07.b))} />
          </div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
