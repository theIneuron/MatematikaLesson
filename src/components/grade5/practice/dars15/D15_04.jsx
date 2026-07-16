// Dars15 · Amaliyot 04 — Teng kasrlarni moslash · 🟡 · tag: match_equal
// 1/2↔3/6, 2/3↔4/6, 3/4↔6/8.
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
  <div className="d15-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

/* =================== 04 · Teng kasrlarni moslash · 🟡 · match_equal (moslash) =================== */
// 1/2↔3/6, 2/3↔4/6, 3/4↔6/8.

const D04_PAIRS = { '1/2': '3/6', '2/3': '4/6', '3/4': '6/8' };
const D04_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Har bir kasrning teng jufti bor.",
    ask: "Chap kasrni tanlang, keyin unga teng bo'lganini o'ngdan bosing:",
    correct: "To'g'ri. 1/2=3/6, 2/3=4/6, 3/4=6/8. Har juftda surat va maxraj bir xil songa ko'paytirilgan.",
    wrong: "Maslahat: teng juftni topish uchun surat va maxrajni bir xil songa ko'paytirib ko'ring. Qaysi qiymatda mos keladi?",
    rule: "Teng kasrlar: surat va maxraj bir xil songa ko'paytirilgan (yoki bo'lingan).",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'У каждой дроби есть равная пара.',
    ask: 'Выберите дробь слева, затем нажмите равную ей справа:',
    correct: 'Верно. 1/2=3/6, 2/3=4/6, 3/4=6/8. В каждой паре числитель и знаменатель умножены на одно число.',
    wrong: 'Подсказка: чтобы найти равную пару, умножь числитель и знаменатель на одно число. При каком значении они совпадут?',
    rule: 'Равные дроби: числитель и знаменатель умножены (или поделены) на одно число.',
  },
};
export default function D15_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const left = ['1/2', '2/3', '3/4'];
  const right = ['4/6', '6/8', '3/6']; // aralash tartib
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({}); // left -> right
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 3;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = left.every((l) => map[l] === D04_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D04_PAIRS, correct, meta: { tag: 'match_equal', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '10px 0' }}>
        {/* chap ustun */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {left.map((l) => {
            const on = pickL === l;
            const done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#fe5b1a'; bg = '#fff4ee'; }
            if (done) { bd = '#ffb488'; bg = '#fff5ef'; }
            if (checked && done) { bd = fb?.correct ? '#1a7f43' : '#c0392b'; bg = fb?.correct ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ ...S.mono, fontSize: 20, fontWeight: 800, width: 88, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, color: '#1f2430', cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #ffe7d8' : 'none' }}>{l}{done ? ' →' : ''}</button>;
          })}
        </div>
        {/* o'ng ustun */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { bd = fb?.correct ? '#1a7f43' : '#c0392b'; bg = fb?.correct ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ ...S.mono, fontSize: 20, fontWeight: 800, width: 88, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, color: '#1f2430', cursor: locked ? 'default' : 'pointer' }}>{r}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
