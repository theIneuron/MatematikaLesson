// Dars06 · Amaliyot 02 — Manfiylarni tanla · 🟢 · pick_negative (multi-select)
// Bir nechta son kartasi. Bola HAMMA manfiy sonlarni tanlaydi (bittadan ko'p).
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

const D02_NUMS = [-15, 7, -3, 0, -21, 9, -8, 4];
const D02_NEG = new Set([0, 2, 4, 6]); // -15, -3, -21, -8 manfiy
const D02_T = {
  uz: {
    eyebrow: 'Manfiy sonlar', setup: "Quyidagi sonlarga diqqat bilan qarang.",
    rule: "Oldida '−' turgan sonlar manfiy. Nol — manfiy ham, musbat ham emas.",
    ask: 'Barcha manfiy sonlarni belgilang:',
    correct: "To'g'ri. -15, -3, -21, -8 manfiy. 0 — manfiy emas, 7, 9, 4 — musbat.",
    wrong: "Maslahat: sonning oldidagi ishoraga qarang. Nolning ishorasi bormi — u qaysi guruhga kiradi?",
  },
  ru: {
    eyebrow: 'Отрицательные', setup: 'Внимательно посмотрите на числа.',
    rule: "Числа со знаком '−' отрицательные. Ноль — ни то, ни другое.",
    ask: 'Отметьте все отрицательные числа:',
    correct: 'Верно. -15, -3, -21, -8 отрицательные. 0 — не отрицательный, 7, 9, 4 — положительные.',
    wrong: 'Подсказка: смотрите на знак перед числом. А есть ли знак у нуля — к какой группе он относится?',
  },
};
export default function D06_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(new Set());
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(new Set(sa.sel)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.size > 0 && !checked); }, [sel, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (i) => { if (locked) return; setSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; }); };
  const check = useCallback(() => {
    const correct = sel.size === D02_NEG.size && [...sel].every((i) => D02_NEG.has(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D02_NUMS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { sel: [...sel] }, correctAnswer: { sel: [...D02_NEG] }, correct, meta: { tag: 'pick_negative', level: '🟢' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // to'liq to'g'ri bo'lsagina hammasi yashil; qisman to'g'ri bo'lsa tanlangan HAMMA katak qizil
  const correctOverall = sel.size === D02_NEG.size && [...sel].every((i) => D02_NEG.has(i));
  const cardStyle = (i) => {
    const on = sel.has(i);
    let bg = '#fff', bd = '#d6dae3', col = '#1f2430';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1e40af'; }
    if (checked && on) {
      if (correctOverall) { bg = '#e8f7ee'; bd = '#1a7f43'; col = '#1a7f43'; }
      else { bg = '#fdecec'; bd = '#c0392b'; col = '#c0392b'; }
    }
    return { padding: '18px 0', borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 26, fontWeight: 800, cursor: locked ? 'default' : 'pointer', transition: 'all .15s' };
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 9 }}>
        {D02_NUMS.map((n, i) => <button key={i} type="button" style={cardStyle(i)} disabled={locked} onClick={() => toggle(i)}>{n}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
