// Dars32 · Amaliyot 03 — Kitob betlari · 🟢 · tag: whole_ten
// 10% = 4 → butun = 4 × 10 = 40. Ha/yo'q. Vizual: son o'qi 0→40 (reveal).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function NumLine({ full }) {
  const L = 18, R = 282, y = 30;
  const ticks = full ? Array.from({ length: 11 }, (_, i) => i * 4) : [0, 4];
  const maxV = full ? 40 : 4;
  const x = (v) => L + (R - L) * (v / maxV);
  return (
    <svg viewBox="0 0 300 52" style={{ display: 'block', width: '100%', maxWidth: 320 }}>
      <line x1={L} y1={y} x2={R} y2={y} stroke="#d8d2ec" strokeWidth="3" strokeLinecap="round" />
      <line className={full ? 'd32-grow' : ''} x1={L} y1={y} x2={full ? R : x(4)} y2={y} stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={y - 6} x2={x(v)} y2={y + 6} stroke="#7c3aed" strokeWidth="2" />
          <text x={x(v)} y={y + 20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#6b7280" fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      ))}
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: "Ha yoki yo'q", setup: "Zaynab kitob o'qiyapti. Bugun u kitobning 10% ini o'qib chiqdi — bu 4 bet. Dugonasi Nigora unga: «Demak, butun kitob 40 bet» dedi.",
    ask: "Nigoraning gapi to'g'rimi? Butun 40 mi?", yes: 'Ha, 40', no: "Yo'q",
    correct: "Ha. 10% — o'ndan biri. O'nta bo'lakni qo'shsak butun: 4 × 10 = 40.",
    wrong: "10% — o'ndan biri. Qismni necha marta olsak 100% bo'ladi? Chiqqan sonni Nigoraniki bilan solishtiring.",
    rule: "10% = 1/10 → butun = qism × 10.",
  },
  ru: {
    eyebrow: 'Да или нет', setup: 'Зайнаб читает книгу. Сегодня она прочитала 10% книги — это 4 страницы. Подруга Нигора сказала ей: «Значит, вся книга 40 страниц».',
    ask: 'Права ли Нигора? Целое равно 40?', yes: 'Да, 40', no: 'Нет',
    correct: 'Да. 10% — это одна десятая. Сложив десять частей, получим целое: 4 × 10 = 40.',
    wrong: '10% — это одна десятая. Сколько раз взять часть, чтобы получить 100%? Сравни своё число с числом Нигоры.',
    rule: '10% = 1/10 → целое = часть × 10.',
  },
};

export default function D32_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'whole_ten', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const reveal = checked && fb?.correct;
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#7c3aed'; bg = '#faf5ff'; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d32-grow { animation: d32dash .6s ease both; }
        @keyframes d32dash { from { stroke-dasharray: 0 400; } to { stroke-dasharray: 400 0; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop, .d32-grow { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: '#faf5ff', border: '1.5px solid #ede9fe' }}>
        <NumLine full={reveal} />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#7c3aed' }}>
          {reveal ? (<span style={S.mono}>100% = 40 bet</span>) : (lang === 'uz' ? "o'qilgan · 10% = 4 bet" : 'прочитано · 10% = 4 стр')}
        </div>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
