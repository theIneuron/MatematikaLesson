// Dars24 · Amaliyot 08 — Ha yoki yo'q · 🟢 · tag: decimal_truth
// "0,3 va 3/10 — bir xil sonmi?" Ha. Lenta 3/10 bo'yalgan = 0,3.
// Setup usulni oshkor qilmaydi; wrong = turtki; qoida faqat to'g'ridan keyin.
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
  <div className="d24-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 18, color = '#1f2430' }) => (
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
function TenStrip({ k, color = '#ff8a52' }) {
  const w = 260, h = 40, cw = w / 10;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="6" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1.5" />
      {Array.from({ length: 10 }).map((_, i) => i < k && <rect key={i} x={i * cw + 2} y="3" width={cw - 4} height={h - 6} rx="3" fill={color} />)}
      {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="2" x2={(i + 1) * cw} y2={h - 2} stroke="#fff" strokeWidth="2" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="6" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

const D08_ANS = true; // Ha — bir xil
const D08_T = {
  uz: {
    eyebrow: "Bir xilmi?", setup: "Karim: «0,3 va 3/10 — bu bir xil son» dedi. Lentada 10 ta bo'lakdan 3 tasi bo'yalgan.",
    ask: 'Karim haqmi? 0,3 va 3/10 bir xil sonmi?', yes: 'Ha, bir xil', no: "Yo'q, boshqacha",
    correct: "To'g'ri. Bir xil miqdorning ikki xil yozuvi: 0,3 = 3/10.",
    wrong: "Lentaga qarang: 0,3 ham, 3/10 ham xuddi shu bo'yalgan qismni bildiradimi?",
    rule: "0,3 = 3/10. O'nli kasr — oddiy kasrning boshqa yozuvi.",
  },
  ru: {
    eyebrow: 'Одно и то же?', setup: 'Карим сказал: «0,3 и 3/10 — это одно и то же число». На ленте из 10 частей закрашены 3.',
    ask: 'Прав ли Карим? 0,3 и 3/10 — одно и то же число?', yes: 'Да, одинаковые', no: 'Нет, разные',
    correct: 'Верно. Это две записи одной величины: 0,3 = 3/10.',
    wrong: 'Посмотрите на ленту: и 0,3, и 3/10 обозначают одну и ту же закрашенную часть?',
    rule: '0,3 = 3/10. Десятичная дробь — другая запись обыкновенной дроби.',
  },
};

export default function D24_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pick != null) { setPick(sa.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D08_ANS }, correct, meta: { tag: 'decimal_truth', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
    if (checked && on) { const ok = val === D08_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d24-pop { animation: d24pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d24pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d24-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '8px 0' }}>
        <TenStrip k={3} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...S.mono, fontSize: 20, fontWeight: 800, color: '#fe5b1a' }}><span>0,3</span><span style={{ color: '#94a3b8' }}>?</span><Frac num={3} den={10} size={17} color="#fe5b1a" /></div>
      </div>
      <p style={{ ...S.ask, fontSize: 16, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
