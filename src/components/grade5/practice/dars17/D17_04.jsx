// Dars17 · Amaliyot 04 — Qaysi to'g'ri · 🟡 · tag: add_choice_trap
// 3/8 + 1/8 = 4/8, eng sodda holda 1/2. Tuzoqlar: 4/16 (maxraj qo'shish), 4/8 (qisqarmagan).
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
const FracStr = ({ s, size = 20, color }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} color={color} />; };

const D04_OPTS = ['4/16', '4/8', '1/2', '3/8'];
const D04_CORRECT = 2; // 1/2 (4/8 ni eng sodda holga keltirish)
const D04_T = {
  uz: {
    eyebrow: "Qaysi to'g'ri", setup: "Diqqat! Javoblarning ba'zilari ataylab chalg'itish uchun qo'yilgan. Har birini tekshirib, faqat to'g'risini tanlang.",
    ask: "Yig'indini eng sodda (qisqarmas) ko'rinishda belgilang:",
    correct: "To'g'ri. 3 + 1 = 4 → 4/8, uni oxirigacha qisqartiramiz: 4/8 = 1/2. 4/8 — hali qisqaradi, shuning uchun eng sodda emas.",
    wrong: "Maslahat: maxraj bir xil bo'lsa qo'shishda u o'zgarmaydi. Yana bir savol: javobni yana qisqartirib bo'ladimi?",
    rule: "Avval qo'shing, keyin eng sodda holga keltiring: 4/8 = 1/2. 4/16 esa maxrajni ham qo'shish xatosi.",
  },
  ru: {
    eyebrow: 'Что верно', setup: 'Внимание! Некоторые ответы поставлены, чтобы запутать. Проверь каждый и выбери только верный.',
    ask: 'Отметь сумму в простейшем (несократимом) виде:',
    correct: 'Верно. 3 + 1 = 4 → 4/8, сокращаем до конца: 4/8 = 1/2. А 4/8 ещё сокращается — значит не простейший.',
    wrong: 'Подсказка: при равном знаменателе он не меняется. И ещё вопрос: можно ли ответ сократить ещё?',
    rule: 'Сначала сложи, потом упрости: 4/8 = 1/2. А 4/16 — ошибка сложения знаменателей.',
  },
};

export default function D17_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: D04_OPTS[picked] }, correctAnswer: { idx: D04_CORRECT, label: '1/2' }, correct, meta: { tag: 'add_choice_trap', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === D04_CORRECT; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 42%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', minHeight: 56 };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d17-in { opacity: 0; animation: d17in .7s ease .12s forwards; }
        @keyframes d17in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop, .d17-in { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d17-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0 8px' }}>
        <Frac num="3" den="8" size={34} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>+</span>
        <Frac num="1" den="8" size={34} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: '#f97316' }}>?</span>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {D04_OPTS.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}><FracStr s={o} size={22} color={optStyle(i).color} /></button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
