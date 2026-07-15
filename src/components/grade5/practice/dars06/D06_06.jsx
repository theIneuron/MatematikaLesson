// Dars06 · Amaliyot 06 — Lift · 🟡 · bank_negative (toggle musbat/manfiy)
// To'rt amal. Har biriga "+" yoki "−" belgisini qo'yish: yuqoriga = +, pastga = −.
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
const RuleChip = ({ text }) => (
  <div className="d6-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_ROWS = [
  { txt: { uz: '3-qavatga chiqdi', ru: 'поднялся на 3 этажа' }, sign: '+' },
  { txt: { uz: "yerto'laga 2 tushdi", ru: 'спустился на 2 в подвал' }, sign: '-' },
  { txt: { uz: '5-qavatga chiqdi', ru: 'поднялся на 5 этажей' }, sign: '+' },
  { txt: { uz: '1 qavat pastga tushdi', ru: 'спустился на 1 этаж' }, sign: '-' },
];
const D06_T = {
  uz: {
    eyebrow: 'Lift', setup: "Sardor liftda bir necha marta harakat qildi.",
    rule: "Yuqoriga chiqish — musbat (+), pastga tushish — manfiy (−).",
    ask: "Har bir harakatga belgi qo'ying:",
    correct: "To'g'ri. Yuqoriga — musbat, pastga — manfiy.",
    wrong: "Maslahat: har bir harakatning yo'nalishiga qarang — yuqoriga va pastga qaysi ishoraga mos keladi?",
  },
  ru: {
    eyebrow: 'Лифт', setup: 'Сардор несколько раз проехал на лифте.',
    rule: 'Вверх — плюс (+), вниз — минус (−).',
    ask: 'Поставьте знак каждому движению:',
    correct: 'Верно. Вверх — плюс, вниз — минус.',
    wrong: 'Подсказка: смотрите на направление каждого движения — какому знаку соответствует вверх, а какому вниз?',
  },
};
export default function D06_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [marks, setMarks] = useState([null, null, null, null]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.marks) { setMarks(sa.marks); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = marks.every((m) => m != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = marks.every((m, i) => m === D06_ROWS[i].sign);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { marks }, correctAnswer: { marks: D06_ROWS.map((r) => r.sign) }, correct, meta: { tag: 'bank_negative', level: '🟡' } });
  }, [marks, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // to'liq to'g'ri bo'lsagina hammasi yashil; qisman to'g'ri bo'lsa belgilangan HAMMA katak qizil
  const correctOverall = marks.every((m, i) => m === D06_ROWS[i].sign);
  const seg = (i, sign) => {
    const on = marks[i] === sign;
    const good = sign === '+' ? '#0f766e' : '#c2410c';
    let bd = '#d6dae3', bg = '#fff', col = '#64748b';
    if (on) { bd = good; bg = sign === '+' ? '#f0fdfa' : '#fff7ed'; col = good; }
    if (checked && on) { bd = correctOverall ? '#1a7f43' : '#c0392b'; bg = correctOverall ? '#e8f7ee' : '#fdecec'; col = correctOverall ? '#1a7f43' : '#c0392b'; }
    return { width: 48, height: 44, borderRadius: 10, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 24, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d6-pop { animation: d6pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d6pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d6-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div>
        {D06_ROWS.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '4px 0' }}>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#374151' }}>{r.txt[lang] || r.txt.uz}</div>
            <button type="button" style={seg(i, '+')} disabled={locked} onClick={() => setMarks((m) => { const n = m.slice(); n[i] = '+'; return n; })}>+</button>
            <button type="button" style={seg(i, '-')} disabled={locked} onClick={() => setMarks((m) => { const n = m.slice(); n[i] = '-'; return n; })}>−</button>
          </div>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
