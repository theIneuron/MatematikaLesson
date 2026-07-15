// Dars32 · Amaliyot 05 — Bir xil qism · 🟡 · tag: whole_match
// Qism doim 8, foiz har xil → butun har xil: 20%→40, 50%→16, 10%→80, 25%→32.
// G'oya: bir xil qism har xil butunga tegishli bo'lishi mumkin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_L = { e1: '20% = 8', e2: '50% = 8', e3: '10% = 8', e4: '25% = 8' };
const D05_PAIRS = { e1: '40', e2: '16', e3: '80', e4: '32' };
const D05_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Bahrom to'rtta savatdan bir xil miqdorda — 8 tadan olma oldi. Ammo har savatda bu 8 dona boshqa foizni bildiradi, shuning uchun har savatdagi butun ham har xil.",
    ask: "Chapdagi shartni tanlang, keyin uning butunini o'ngdan bosing:",
    correct: "To'g'ri. Bir xil qism (8) — lekin foiz har xil, shuning uchun butun ham har xil.",
    wrong: "Har juftda butunni topish uchun qismdan foizga teskari yo'lni o'ylang: qaysi amallar kerak?",
    rule: "Bir xil qism har xil butunga tegishli bo'lishi mumkin.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Бахром взял из четырёх корзин одинаковое количество яблок — по 8 штук. Но в каждой корзине эти 8 штук — это разный процент, поэтому и целое в каждой корзине разное.',
    ask: 'Выберите условие слева, затем нажмите его целое справа:',
    correct: 'Верно. Часть одна и та же (8), но процент разный, поэтому целое тоже разное.',
    wrong: 'Чтобы найти целое в каждой паре, подумай об обратном пути от части к проценту: какие действия нужны?',
    rule: 'Одна и та же часть может относиться к разным целым.',
  },
};

export default function D32_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const left = ['e1', 'e2', 'e3', 'e4'];
  const right = ['16', '80', '40', '32'];
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 4;
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D05_PAIRS, correct, meta: { tag: 'whole_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#1d4ed8'; bg = '#eff6ff'; }
            if (done) { bd = '#bfdbfe'; bg = '#f0f6ff'; }
            if (checked && done) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ width: 118, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none', ...S.mono, fontSize: 18, fontWeight: 800, color: '#1f2430', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{D05_L[l]}{done ? <span style={{ fontSize: 15, color: '#94a3b8' }}>→</span> : null}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#60a5fa'; bg = '#eaf2ff'; }
            if (checked && used) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 66, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{r}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
