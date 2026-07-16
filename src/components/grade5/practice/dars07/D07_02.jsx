// Dars07 · Amaliyot 02 — Ishorani almashtir · 🟢 · opposite_sign (toggle)
// To'rt son. Har biriga qarama-qarshisini toppish uchun "musbat/manfiy/nol" belgilash.
// Aslida: har son berilgan, uning qarshisi qanday ishorada bo'lishini tanlaydi.
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
const RuleChip = ({ text }) => (
  <div className="d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D02_ROWS = [
  { n: 6, opp: '-' },
  { n: -9, opp: '+' },
  { n: 0, opp: '0' },
  { n: -3, opp: '+' },
];
const D02_T = {
  uz: {
    eyebrow: 'Ishora', setup: "Har bir sonning qarama-qarshisi qaysi ishorada bo'ladi — belgilang.",
    pos: 'musbat', neg: 'manfiy', zero: 'nol',
    correct: "To'g'ri. Musbatning aksi manfiy, manfiyning aksi musbat, nolning aksi — nol.",
    wrong: "Maslahat: qarama-qarshi son noldan teng masofada, lekin qaysi tomonda turadi? Har sonning ishorasi bilan nima sodir bo'ladi?",
    rule: "Qarama-qarshi son — ishorani almashtirish natijasi. Nolning aksi — nolning o'zi.",
  },
  ru: {
    eyebrow: 'Знак', setup: 'Какой знак будет у противоположного числа — отметьте.',
    pos: 'плюс', neg: 'минус', zero: 'ноль',
    correct: 'Верно. Противоположное плюсу — минус, минусу — плюс, нулю — ноль.',
    wrong: 'Подсказка: противоположное число на том же расстоянии от нуля, но с какой стороны? Что происходит со знаком каждого числа?',
    rule: 'Противоположное число — смена знака. Противоположное нулю — сам ноль.',
  },
};
export default function D07_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [marks, setMarks] = useState([null, null, null, null]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.marks) { setMarks(sa.marks); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = marks.every((m) => m != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = marks.every((m, i) => m === D02_ROWS[i].opp);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.setup, options: [], studentAnswer: { marks }, correctAnswer: { marks: D02_ROWS.map((r) => r.opp) }, correct, meta: { tag: 'opposite_sign', level: '🟢' } });
  }, [marks, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const OPTS = [{ k: '+', lbl: 'pos', c: '#0f766e', bg: '#f0fdfa' }, { k: '-', lbl: 'neg', c: '#c2410c', bg: '#fff7ed' }, { k: '0', lbl: 'zero', c: '#64748b', bg: '#f8fafc' }];
  const seg = (i, o) => {
    const on = marks[i] === o.k;
    let bd = '#d6dae3', bg = '#fff', col = '#64748b';
    if (on) { bd = o.c; bg = o.bg; col = o.c; }
    if (checked && on) { const okAll = fb?.correct; bd = okAll ? '#1a7f43' : '#c0392b'; bg = okAll ? '#e8f7ee' : '#fdecec'; col = okAll ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, padding: '8px 4px', borderRadius: 10, border: '2px solid ' + bd, background: bg, color: col, fontSize: 12.5, fontWeight: 800, cursor: locked ? 'default' : 'pointer', minHeight: 40 };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d7-pop { animation: d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d7-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ margin: '10px 0 4px' }}>
        {D02_ROWS.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 90, ...S.mono, fontSize: 20, fontWeight: 800 }}>{r.n} <span style={{ color: '#cbd5e1' }}>→</span></div>
            {OPTS.map((o) => <button key={o.k} type="button" style={seg(i, o)} disabled={locked} onClick={() => setMarks((m) => { const n = m.slice(); n[i] = o.k; return n; })}>{t[o.lbl]}</button>)}
          </div>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
