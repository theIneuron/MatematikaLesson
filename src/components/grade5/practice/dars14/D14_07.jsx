// Dars14 · Amaliyot 07 — O'sish tartibida joylash · 🔴 · order_asc (ketma-ket tanlash)
// 1/2, 2/3, 3/5 ni kichikdan kattaga: 1/2 < 3/5 < 2/3.
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

const D07_ORDER = ['1/2', '3/5', '2/3']; // to'g'ri (kichikdan kattaga)
const D07_T = {
  uz: {
    eyebrow: 'Tartibga soling', setup: "Uch kasr berilgan: 1/2, 2/3, 3/5.",
    ask: 'Kichikdan kattaga qarab, kasrlarni ketma-ket bosing:',
    correct: "To'g'ri. Umumiy maxraj 30: 1/2=15/30, 3/5=18/30, 2/3=20/30. 15 < 18 < 20, demak 1/2 < 3/5 < 2/3.",
    wrong: "Maslahat: avval qaysi biri yarimdan katta, qaysi biri kichik? Qolganini solishtirish uchun nimani tenglashtirasiz?",
    rule: "Avval 1/2 bilan ajrating, keyin qolganini bir xil ulushga keltirib solishtiring.",
  },
  ru: {
    eyebrow: 'Упорядочите', setup: 'Даны три дроби: 1/2, 2/3, 3/5.',
    ask: 'Нажимайте дроби по порядку от меньшей к большей:',
    correct: 'Верно. Общий знаменатель 30: 1/2=15/30, 3/5=18/30, 2/3=20/30. 15 < 18 < 20, значит 1/2 < 3/5 < 2/3.',
    wrong: 'Подсказка: сначала какая больше половины, а какая меньше? Что нужно уравнять, чтобы сравнить остальные?',
    rule: 'Сначала отдели по 1/2, потом приведи остальные к одинаковым долям.',
  },
};
export default function D14_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const fracs = ['2/3', '1/2', '3/5'];
  const [seq, setSeq] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.seq) { setSeq(sa.seq); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(seq.length === 3 && !checked); }, [seq, checked, onReady]);
  const locked = isReview || checked;
  const tap = (f) => { if (locked) return; setSeq((s) => s.includes(f) ? s : [...s, f]); };
  const clear = () => { if (locked) return; setSeq([]); };
  const check = useCallback(() => {
    const correct = seq.join(',') === D07_ORDER.join(',');
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { seq }, correctAnswer: { order: D07_ORDER }, correct, meta: { tag: 'order_asc', level: '🔴' } });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
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
      {/* tanlanadigan kasrlar */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '10px 0' }}>
        {fracs.map((f) => {
          const pos = seq.indexOf(f);
          const used = pos >= 0;
          return (
            <button key={f} type="button" disabled={locked || used} onClick={() => tap(f)} style={{ position: 'relative', ...S.mono, fontSize: 20, fontWeight: 800, width: 74, height: 58, borderRadius: 12, border: '2px solid ' + (used ? '#e5e7eb' : '#93c5fd'), background: used ? '#fafafa' : '#eff6ff', color: used ? '#cbd5e1' : '#1e40af', cursor: (locked || used) ? 'default' : 'pointer' }}>
              {f}
              {used && <span style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: 999, background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pos + 1}</span>}
            </button>
          );
        })}
      </div>
      {/* ketma-ketlik ko'rinishi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, margin: '4px 0' }}>
        {seq.length === 0 ? <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>{lang === 'uz' ? 'kichik → katta' : 'меньше → больше'}</span> :
          seq.map((f, i) => {
            const c = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
            return <React.Fragment key={f}><span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: c }}>{f}</span>{i < seq.length - 1 && <span style={{ color: '#cbd5e1', fontWeight: 800 }}>&lt;</span>}</React.Fragment>;
          })}
      </div>
      {!locked && seq.length > 0 && <div style={{ textAlign: 'center' }}><button type="button" onClick={clear} style={{ fontSize: 12.5, fontWeight: 700, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{lang === 'uz' ? 'tozalash' : 'сбросить'}</button></div>}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
