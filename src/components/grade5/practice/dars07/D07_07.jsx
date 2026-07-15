// Dars07 · Amaliyot 07 — Tartibla · 🔴 · order_integers (kartalar)
// -8, 3, -15, 0, 6 ni kichikdan kattaga tartiblash (kartalar bilan).
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
  <div className="d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D07_NUMS = [-8, 3, -15, 0, 6];
const D07_SORTED = [-15, -8, 0, 3, 6];
const D07_T = {
  uz: {
    eyebrow: 'Tartiblash', setup: "Beshta butun sonni kichikdan kattaga joylang.",
    ask: "Kartani bosing, keyin bo'sh joyni bosing:",
    slots: 'kichik → katta',
    correct: "To'g'ri. -15 < -8 < 0 < 3 < 6. Manfiylar chapda, nol o'rtada, musbatlar o'ngda.",
    wrong: "Maslahat: eng katta minusli son eng kichik. Nol manfiy bilan musbat orasida.",
    rule: "Son o'qida chapdan o'ngga: kichikdan kattaga. Manfiy < 0 < musbat.",
  },
  ru: {
    eyebrow: 'Упорядочивание', setup: 'Расставьте пять целых чисел от меньшего к большему.',
    ask: 'Нажмите карточку, затем пустое место:',
    slots: 'меньше → больше',
    correct: 'Верно. -15 < -8 < 0 < 3 < 6. Отрицательные слева, ноль в центре, положительные справа.',
    wrong: 'Подсказка: число с большим минусом наименьшее. Ноль между отрицательными и положительными.',
    rule: 'На оси слева направо — от меньшего к большему. Отрицательные < 0 < положительные.',
  },
};
export default function D07_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D07_NUMS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D07_SORTED[i]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots, label: slots.map((x) => x && x.v).join(',') }, correctAnswer: { order: D07_SORTED }, correct, meta: { tag: 'order_integers', level: '🔴' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d7-pop { animation: d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d7-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', margin: '10px 0 4px', flexWrap: 'wrap' }}>
        {slots.map((cell, i) => {
          const v = cell ? cell.v : null;
          let bd = '#93c5fd', bg = '#eff6ff', col = '#1e40af';
          if (checked && v != null) { const okAll = fb?.correct; bd = okAll ? '#1a7f43' : '#c0392b'; bg = okAll ? '#e8f7ee' : '#fdecec'; col = okAll ? '#1a7f43' : '#c0392b'; }
          return (
            <React.Fragment key={i}>
              <div onClick={clickSlot(i)} style={{ width: 54, height: 54, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 19, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
              {i < 4 && <span style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: '#cbd5e1' }}>&lt;</span>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>{t.slots}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D07_NUMS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 58, height: 54, borderRadius: 12, border: '2px dashed #e5e7eb', background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 58, height: 54, borderRadius: 12, border: '2px solid ' + (on ? '#2563eb' : '#cbd5e1'), background: on ? '#eaf0fe' : '#fff', ...S.mono, fontSize: 20, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
