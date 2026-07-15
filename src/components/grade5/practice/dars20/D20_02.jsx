// Dars20 · Amaliyot 02 — Ayirmani natijaga ula · 🟡 · tag: sub_diff_match
// Har xil maxrajli ayirmalar ↔ natija (eng sodda). 3/4−1/2=1/4, 5/6−2/3=1/6, 7/8−1/2=3/8, 2/3−1/6=1/2, 5/6−1/2=1/3.
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
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
const FracStr = ({ s, size = 17, color }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} color={color} />; };

const D02_SUBS = { e1: ['3/4', '1/2'], e2: ['5/6', '2/3'], e3: ['7/8', '1/2'], e4: ['2/3', '1/6'], e5: ['5/6', '1/2'] };
const D02_PAIRS = { e1: '1/4', e2: '1/6', e3: '3/8', e4: '1/2', e5: '1/3' };
const D02_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Aziza bir nechta ayirmani yechdi. Har bir ayirmani uning eng sodda natijasiga ulang.",
    ask: "Chapdagi ayirmani tanlang, keyin uning natijasini o'ngdan bosing:",
    correct: "To'g'ri. Har birini umumiy maxrajga keltirib ayirdik va eng sodda holga keltirdik.",
    wrong: "Maslahat: ayirmalarning maxrajlari har xil. Ularni solishtirishdan oldin nima qilish kerak? Natija eng sodda ko'rinishdami?",
    rule: "Umumiy maxrajga keltiring, ayiring, so'ng natijani eng sodda holga keltiring.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Азиза решила несколько разностей. Соедини каждую с её простейшим результатом.',
    ask: 'Выберите разность слева, затем нажмите её результат справа:',
    correct: 'Верно. Каждую привели к общему знаменателю, вычли и упростили.',
    wrong: 'Подсказка: у разностей разные знаменатели. Что нужно сделать перед сравнением? И упрощён ли результат до конца?',
    rule: 'Приведи к общему знаменателю, вычти, затем упрости результат.',
  },
};

export default function D20_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const left = ['e1', 'e2', 'e3', 'e4', 'e5'];
  const right = ['1/2', '1/4', '3/8', '1/3', '1/6']; // aralash
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 5;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = left.every((l) => map[l] === D02_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D02_PAIRS, correct, meta: { tag: 'sub_diff_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l], [a, b] = D02_SUBS[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
            if (done) { bd = '#93c5fd'; bg = '#f0f6ff'; }
            if (checked && done) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ minWidth: 118, height: 58, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><FracStr s={a} size={17} /><span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#64748b' }}>−</span><FracStr s={b} size={17} />{done ? <span style={{ fontSize: 17, fontWeight: 800, color: '#94a3b8' }}>→</span> : null}</span></button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 74, height: 58, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}><FracStr s={r} size={19} /></button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
