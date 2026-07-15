// Dars23 · Amaliyot 02 — Amalni natijaga ula · 🟡 · tag: mixed_match
// 5 ta aralash amal (maxraj 5, zaymsiz) ↔ natijasi. Butunlar+butunlar, kasrlar+kasrlar.
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
  <div className="d23-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 16, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 2px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 1.6, background: color }} />
    <span style={{ fontSize: size, padding: '1px 2px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const Mixed = ({ w, n, d = 5, size = 15, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 5, color }}>{w}</span><Frac num={n} den={d} size={size} color={color} />
  </span>
);

const D02_E = {
  e1: { a: [2, 4], op: '+', b: [1, 3] }, e2: { a: [4, 4], op: '−', b: [2, 1] },
  e3: { a: [3, 1], op: '−', b: [1, 4] }, e4: { a: [3, 3], op: '+', b: [2, 1] }, e5: { a: [1, 3], op: '+', b: [1, 3] },
};
const D02_PAIRS = { e1: '4-2', e2: '2-3', e3: '1-2', e4: '5-4', e5: '3-1' };
const D02_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Nilufar aralash sonlar bilan besh amal bajardi (hammasining maxraji 5). Har bir amalni uning to'g'ri natijasiga ulang.",
    ask: "Chapdan amalni tanlang, so'ng uning natijasini o'ngdan bosing:",
    correct: "To'g'ri. Har amalda butun va kasr qismlarini alohida hisoblab, kasr bir butundan oshsa yoki yetmasa, butunga o'tkazdingiz.",
    wrong: "Har bir amalni oxirigacha hisoblab, natijasiga qarab moslang. Ba'zilari alohida diqqat talab qiladi.",
    rule: "Aralash amallarda butun va kasr qismlari alohida hisoblanadi; kasr bir butundan oshsa yoki yetmasa, butunga o'tkaziladi.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Нилуфар выполнила пять действий со смешанными числами (все со знаменателем 5). Соедини каждое с верным результатом.',
    ask: 'Выбери действие слева, затем нажми его результат справа:',
    correct: 'Верно. В каждом действии целую и дробную части считали отдельно, а если дробь превышала целое или не хватало — переносили к целым.',
    wrong: 'Досчитай каждое действие до конца и соотнеси по результату. Некоторые требуют особого внимания.',
    rule: 'В смешанных действиях целая и дробная части считаются отдельно; если дробь превышает целое или не хватает — перенос к целым.',
  },
};

export default function D23_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const left = ['e1', 'e2', 'e3', 'e4', 'e5'];
  const right = ['2-3', '4-2', '5-4', '1-2', '3-1']; // aralash
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 5;
  const correctOverall = left.every((l) => map[l] === D02_PAIRS[l]);
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D02_PAIRS, correct, meta: { tag: 'mixed_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const Expr = ({ e }) => (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mixed w={e.a[0]} n={e.a[1]} /><span style={{ ...S.mono, fontWeight: 800, color: '#64748b' }}>{e.op}</span><Mixed w={e.b[0]} n={e.b[1]} /></span>);
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-pop { animation: d23pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d23pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
            if (done) { bd = '#93c5fd'; bg = '#f0f6ff'; }
            if (checked && done) { bd = correctOverall ? '#1a7f43' : '#c0392b'; bg = correctOverall ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ minWidth: 128, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none', padding: '0 8px' }}><Expr e={D02_E[l]} />{done ? <span style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', marginLeft: 4 }}>→</span> : null}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {right.map((r) => {
            const used = usedR.has(r); const [rw, rn] = r.split('-');
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { bd = correctOverall ? '#1a7f43' : '#c0392b'; bg = correctOverall ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 66, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}><Mixed w={rw} n={rn} size={16} /></button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
