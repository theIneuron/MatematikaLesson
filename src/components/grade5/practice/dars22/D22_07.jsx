// Dars22 · Amaliyot 07 — Masala · 🔴 · tag: to_mixed_story
// 19/4 pizza → 4 butun va 3/4 = 4¾ (19 : 4 = 4, qoldiq 3).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

// pizza doira (choraklar), shaded/4 bo'yalgan
function Pie({ shaded, size = 52 }) {
  const R = size / 2, C = R;
  const sec = (k) => { const a0 = (k / 4) * 2 * Math.PI - Math.PI / 2, a1 = ((k + 1) / 4) * 2 * Math.PI - Math.PI / 2; return `M${C},${C} L${C + R * Math.cos(a0)},${C + R * Math.sin(a0)} A${R},${R} 0 0 1 ${C + R * Math.cos(a1)},${C + R * Math.sin(a1)} Z`; };
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">{[0, 1, 2, 3].map((k) => <path key={k} d={sec(k)} fill={k < shaded ? '#fbbf24' : '#fef3c7'} stroke="#e0a96d" strokeWidth="1.5" />)}</svg>;
}

const D07 = { w: 4, n: 3, d: 4 }; // 19/4 = 4¾
const D07_T = {
  uz: {
    eyebrow: 'Oshxona', setup: "Anvarning oshxonasida bazmdan so'ng 19/4 pitssa qoldi — har biri choraklarga kesilgan. Buni butun pitssalar va choraklar bilan aytish kerak.",
    ask: 'Bu necha butun pitssa va nechta chorak? Aralash son yozing.',
    l1: 'Butun:', l2: 'Chorak:',
    correct: "To'g'ri. 19 : 4 = 4, qoldiq 3. Ya'ni 4 ta to'liq pitssa va 3/4: 19/4 = 4¾.",
    wrong: "Maslahat: to'rt chorak bitta butunni to'ldiradi. 19 ta chorakda nechta to'liq pitssa bor va nechta chorak ortadi?",
    rule: "Noto'g'ri → aralash: suratni maxrajga bo'ling. Butun = bo'linma, qoldiq = yangi surat.",
  },
  ru: {
    eyebrow: 'Кухня', setup: 'На кухне у Анвара после праздника осталось 19/4 пиццы — каждая нарезана на четверти. Нужно сказать это целыми пиццами и четвертями.',
    ask: 'Сколько это целых пицц и сколько четвертей? Запиши смешанным числом.',
    l1: 'Целых:', l2: 'Четвертей:',
    correct: 'Верно. 19 : 4 = 4, остаток 3. То есть 4 целых пиццы и 3/4: 19/4 = 4¾.',
    wrong: 'Подсказка: четыре четверти — одно целое. Сколько целых пицц в 19 четвертях и сколько четвертей останется?',
    rule: 'Неправильная → смешанное: раздели числитель на знаменатель. Целое = частное, остаток = новый числитель.',
  },
};

export default function D22_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.n != null) setN(String(s.n)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(n);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D07.w && parseInt(n, 10) === D07.n;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), n: parseInt(n, 10) }, correctAnswer: D07, correct, meta: { tag: 'to_mixed_story', level: '🔴' } });
  }, [w, n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 50, height: 44, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0 4px' }}>
        <Frac num="19" den="4" size={26} color="#7c3aed" /><span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>=</span>
        {reveal ? <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}><Pie shaded={4} /><Pie shaded={4} /><Pie shaded={4} /><Pie shaded={4} /><Pie shaded={3} /></div> : <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>{lang === 'uz' ? '? butun ? chorak' : '? целых ? четвертей'}</span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>{box(w, setW, D07.w)}</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>{box(n, setN, D07.n)}</div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
