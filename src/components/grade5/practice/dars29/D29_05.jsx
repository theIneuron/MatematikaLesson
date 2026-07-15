// Dars29 · Amaliyot 05 — Bo'luvchiga qarab · 🟡 · tag: div_match
// Har bo'lishni natijasiga ula: 8:0,5→16, 8:1→8, 8:2→4, 8:0,8→10.
// G'oya: bo'luvchi < 1 → kattalashadi; > 1 → kichiklashadi; = 1 → o'zi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d29-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_L = { a: '8 : 0,5', b: '8 : 1', c: '8 : 2', d: '8 : 0,8' };
const D05_PAIRS = { a: '16', b: '8', c: '4', d: '10' };
const D05_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Rustam har bir bo'lishni natijasiga ulamoqchi.",
    ask: "Chapdan bir bo'lishni tanlang, keyin uning natijasini o'ngdan bosing:",
    correct: "To'g'ri. Bo'luvchi 1 dan kichik → natija kattalashadi; 1 dan katta → kichiklashadi; 1 → o'zgarmaydi.",
    wrong: "Bo'luvchiga qarang: 1 dan kichik bo'lsa natija kattalashadi, 1 dan katta bo'lsa kichiklashadi.",
    rule: "Bo'luvchi < 1 → katta; > 1 → kichik; = 1 → o'zi.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Рустам хочет соединить каждое деление с его результатом.',
    ask: 'Выберите деление слева, затем нажмите его результат справа:',
    correct: 'Верно. Делитель меньше 1 → результат растёт; больше 1 → уменьшается; равен 1 → не меняется.',
    wrong: 'Смотри на делитель: меньше 1 — результат растёт, больше 1 — уменьшается.',
    rule: 'Делитель < 1 → больше; > 1 → меньше; = 1 → само.',
  },
};

export default function D29_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const left = ['a', 'b', 'c', 'd'];
  const right = ['4', '16', '8', '10'];
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 4;
  const correctOverall = left.every((l) => map[l] === D05_PAIRS[l]);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = left.every((l) => map[l] === D05_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D05_PAIRS, correct, meta: { tag: 'div_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d29-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
            if (done) { bd = '#93c5fd'; bg = '#f0f6ff'; }
            if (checked && done) { bd = correctOverall ? '#1a7f43' : '#c0392b'; bg = correctOverall ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ width: 118, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none', ...S.mono, fontSize: 19, fontWeight: 800, color: '#1f2430', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{D05_L[l]}{done ? <span style={{ fontSize: 15, color: '#94a3b8' }}>→</span> : null}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { bd = correctOverall ? '#1a7f43' : '#c0392b'; bg = correctOverall ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 64, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{r}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
