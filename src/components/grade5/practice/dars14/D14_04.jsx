// Dars14 · Amaliyot 04 — 1/2 benchmark · 🟡 · half_benchmark (ikki ustunga ajratish)
// Kasrlarni "1/2 dan katta" / "1/2 dan kichik" ga ajrating. 3/5,5/8 katta; 1/3,2/5 kichik.
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
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D04_ITEMS = [
  { f: '3/5', big: true }, { f: '1/3', big: false }, { f: '5/8', big: true }, { f: '2/5', big: false },
];
const D04_T = {
  uz: {
    eyebrow: '1/2 bilan', setup: "Har bir kasrni 1/2 bilan solishtiramiz.",
    ask: "Har bir kasrni to'g'ri ustunga bosing:",
    big: "1/2 dan KATTA", small: "1/2 dan KICHIK", pool: 'Kasrlar:',
    correct: "To'g'ri. 3/5 va 5/8 — yarimdan katta; 1/3 va 2/5 — yarimdan kichik.",
    wrong: "Maslahat: har bir kasrda surat maxrajning yarmidan kattami yoki kichikmi — shu ustunni belgilaydi.",
    rule: "1/2 dan kattami: surat maxrajning yarmidan katta bo'lsa — ha.",
  },
  ru: {
    eyebrow: 'С 1/2', setup: 'Каждую дробь сравниваем с 1/2.',
    ask: 'Нажмите на каждую дробь, чтобы отправить в верный столбец:',
    big: 'БОЛЬШЕ 1/2', small: 'МЕНЬШЕ 1/2', pool: 'Дроби:',
    correct: 'Верно. 3/5 и 5/8 — больше половины; 1/3 и 2/5 — меньше половины.',
    wrong: 'Подсказка: в каждой дроби числитель больше или меньше половины знаменателя — это и задаёт столбец.',
    rule: 'Больше ли 1/2: если числитель больше половины знаменателя — да.',
  },
};
export default function D14_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [place, setPlace] = useState({}); // f -> 'big'|'small'
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = D04_ITEMS.every((it) => place[it.f]);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const send = (f, col) => { if (locked) return; setPlace((p) => ({ ...p, [f]: col })); };
  const back = (f) => { if (locked) return; setPlace((p) => { const n = { ...p }; delete n[f]; return n; }); };
  const check = useCallback(() => {
    const correct = D04_ITEMS.every((it) => place[it.f] === (it.big ? 'big' : 'small'));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: { big: ['3/5', '5/8'], small: ['1/3', '2/5'] }, correct, meta: { tag: 'half_benchmark', level: '🟡' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const pool = D04_ITEMS.filter((it) => !place[it.f]);
  const col = (key, title, color, bg) => (
    <div style={{ flex: 1, minHeight: 96, border: '2px dashed ' + color, borderRadius: 12, background: bg, padding: '8px 6px' }}>
      <div style={{ fontSize: 12, fontWeight: 800, color, textAlign: 'center', marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {D04_ITEMS.filter((it) => place[it.f] === key).map((it) => {
          const bc = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : color;
          return <button key={it.f} type="button" onClick={() => back(it.f)} disabled={locked} style={{ ...S.mono, fontSize: 16, fontWeight: 800, padding: '6px 10px', borderRadius: 9, border: '2px solid ' + bc, background: '#fff', color: bc, cursor: locked ? 'default' : 'pointer' }}>{it.f}</button>;
        })}
      </div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, margin: '10px 0 12px' }}>
        {col('big', t.big, '#fe5b1a', '#fff5ef')}
        {col('small', t.small, '#14b8a6', '#f0fdfa')}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#94a3b8', marginBottom: 6 }}>{t.pool}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', minHeight: 44 }}>
        {pool.map((it) => (
          <div key={it.f} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#1f2430', padding: '6px 8px', background: '#f8fafc', borderRadius: 8, border: '1.5px solid #e5e7eb' }}>{it.f}</span>
            <button type="button" onClick={() => send(it.f, 'big')} disabled={locked} style={{ width: 26, height: 30, borderRadius: 7, border: '1.5px solid #ffb488', background: '#fff4ee', color: '#fe5b1a', fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>↑</button>
            <button type="button" onClick={() => send(it.f, 'small')} disabled={locked} style={{ width: 26, height: 30, borderRadius: 7, border: '1.5px solid #5eead4', background: '#f0fdfa', color: '#14b8a6', fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>↓</button>
          </div>
        ))}
        {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
