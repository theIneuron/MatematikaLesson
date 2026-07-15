// Dars22 · Amaliyot 05 — To'g'rilarini tanla · 🔴 · tag: verify_convert
// 5 ta o'tkazish, ikki yo'nalishda (aralash→noto'g'ri va teskari), uchtasi to'g'ri.
// To'g'ri: 3⅖=17/5, 19/4=4¾, 23/6=3⅚. Xato: 2⅚=15/6 (17/6), 4⅔=12/3 (14/3).
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
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
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
const Mixed = ({ w, n, d, size = 19, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, verticalAlign: 'middle' }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 5, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);

// dir: 'toimp' = aralash chapda, noto'g'ri o'ngda | 'tomix' = noto'g'ri chapda, aralash o'ngda
const D05_ROWS = [
  { mix: [3, 2, 5], imp: [17, 5], dir: 'toimp', ok: true },   // 3⅖ = 17/5 to'g'ri (3×5+2)
  { mix: [4, 3, 4], imp: [19, 4], dir: 'tomix', ok: true },   // 19/4 = 4¾ to'g'ri
  { mix: [2, 5, 6], imp: [15, 6], dir: 'toimp', ok: false },  // 2⅚ = 17/6, 15/6 xato
  { mix: [3, 5, 6], imp: [23, 6], dir: 'tomix', ok: true },   // 23/6 = 3⅚ to'g'ri
  { mix: [4, 2, 3], imp: [12, 3], dir: 'toimp', ok: false },  // 4⅔ = 14/3, 12/3 xato
];
const D05_CORRECT = new Set(D05_ROWS.map((r, i) => (r.ok ? i : -1)).filter((i) => i >= 0));
const D05_T = {
  uz: {
    eyebrow: "To'g'rilarini top", setup: "Quyida beshta o'tkazish berilgan — ba'zilari aralashdan noto'g'riga, ba'zilari teskari yo'nalishda. Faqat to'g'ri yozilganlarini tanlang.",
    ask: "Barcha to'g'ri o'tkazishlarni tanlang:",
    correct: "To'g'ri. 3⅖=17/5, 19/4=4¾, 23/6=3⅚ — to'g'ri. 2⅚ = 17/6 (15/6 emas), 4⅔ = 14/3 (12/3 emas) — noto'g'ri.",
    wrong: "Har bir yozuvni alohida tekshiring: aralash son bilan noto'g'ri kasr haqiqatan bir xil miqdorni bildiryaptimi? Butun qism qancha bo'lak beradi?",
    rule: "Aralash → noto'g'ri: butun × maxraj + surat. Noto'g'ri → aralash: suratni maxrajga bo'ling.",
  },
  ru: {
    eyebrow: 'Найди верные', setup: 'Ниже пять переводов — некоторые из смешанного в неправильную, некоторые наоборот. Выбери только те, что записаны верно.',
    ask: 'Выбери все верные переводы:',
    correct: 'Верно. 3⅖=17/5, 19/4=4¾, 23/6=3⅚ — верные. 2⅚ = 17/6 (не 15/6), 4⅔ = 14/3 (не 12/3) — неверные.',
    wrong: 'Проверь каждую запись отдельно: действительно ли смешанное число и дробь означают одно количество? Сколько частей даёт целая часть?',
    rule: 'Смешанное → неправильная: целое × знаменатель + числитель. Неправильная → смешанное: раздели числитель на знаменатель.',
  },
};

export default function D22_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (i) => { if (locked) return; setSel((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]); };
  const check = useCallback(() => {
    const correct = sel.length === D05_CORRECT.size && sel.every((i) => D05_CORRECT.has(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D05_ROWS.map((r, i) => ({ id: String(i), label: r.dir === 'toimp' ? (r.mix.join(' ') + '=' + r.imp.join('/')) : (r.imp.join('/') + '=' + r.mix.join(' ')) })), studentAnswer: { sel }, correctAnswer: { set: [...D05_CORRECT] }, correct, meta: { tag: 'verify_convert', level: '🔴' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const correctOverall = checked && sel.length === D05_CORRECT.size && sel.every((i) => D05_CORRECT.has(i));
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {D05_ROWS.map((r, i) => {
          const on = sel.includes(i);
          let bd = '#cbd5e1', bg = '#fff';
          if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
          if (checked && on) { bd = correctOverall ? '#1a7f43' : '#c0392b'; bg = correctOverall ? '#e8f7ee' : '#fdecec'; }
          const mixEl = <Mixed w={r.mix[0]} n={r.mix[1]} d={r.mix[2]} size={19} />;
          const impEl = <Frac num={String(r.imp[0])} den={String(r.imp[1])} size={20} />;
          return <button key={i} type="button" disabled={locked} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', minHeight: 52 }}>
            {r.dir === 'toimp' ? mixEl : impEl}<span style={{ ...S.mono, fontSize: 19, fontWeight: 800, color: '#94a3b8' }}>=</span>{r.dir === 'toimp' ? impEl : mixEl}
            {checked && on && (correctOverall ? <IconOk /> : <IconNo />)}
          </button>;
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', fontWeight: 700, marginTop: 6 }}>{sel.length} {lang === 'uz' ? 'tanlandi' : 'выбрано'}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
