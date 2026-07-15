// Dars17 · Amaliyot 02 — Yig'indini natijaga ula · 🟡 · tag: add_match
// Moslash: 5 ta yig'indi (maxraj 8) ↔ natijasi. Chap ustun — qo'shish ifodasi, o'ng — natija.
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
const FracStr = ({ s, size = 18, color }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} color={color} />; };

// maxraj 8. Yig'indi ↔ natija (eng sodda holda): 4/8=1/2, 6/8=3/4. 5 juft.
const D02_SUMS = { s1: ['1', '2'], s2: ['2', '2'], s3: ['1', '4'], s4: ['3', '3'], s5: ['2', '5'] };
const D02_PAIRS = { s1: '3/8', s2: '1/2', s3: '5/8', s4: '3/4', s5: '7/8' };
const D02_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Nilufar amaliyot daftariga beshta yig'indi yozib qo'ydi-yu, ularni chalkashtirib yubordi. Har birini o'z natijasiga qaytadan tutashtiring.",
    ask: "Chapdagi yig'indini tanlang, keyin uning natijasini o'ngdan bosing:",
    correct: "To'g'ri. Suratlarni qo'shdik va kerak bo'lganda eng sodda holga keltirdik: 4/8 = 1/2, 6/8 = 3/4.",
    wrong: "Maslahat: har yig'indida maxraj o'zgarmaydi. Ba'zi natijalar sodda ko'rinishda yozilgan — moslashda shu adashtirmasin.",
    rule: "Suratlarni qo'shing, maxrajni o'zgartirma.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Нилуфар записала в тетрадь пять сумм и перепутала их. Соедини каждую с её результатом заново.',
    ask: 'Выберите сумму слева, затем нажмите её результат справа:',
    correct: 'Верно. Сложили числители и, где нужно, привели к простейшему виду: 4/8 = 1/2, 6/8 = 3/4.',
    wrong: 'Подсказка: в каждой сумме знаменатель не меняется. Некоторые результаты записаны в простейшем виде — не перепутай из-за этого.',
    rule: 'Складывай числители, знаменатель не меняй.',
  },
};

export default function D17_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const left = ['s1', 's2', 's3', 's4', 's5'];
  const right = ['1/2', '5/8', '3/8', '7/8', '3/4']; // aralash
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D02_PAIRS, correct, meta: { tag: 'add_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l], [a, b] = D02_SUMS[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
            if (done) { bd = '#93c5fd'; bg = '#f0f6ff'; }
            if (checked && done) { const ok = !!fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ minWidth: 118, height: 58, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><FracStr s={a + '/8'} size={17} /><span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#64748b' }}>+</span><FracStr s={b + '/8'} size={17} />{done ? <span style={{ fontSize: 17, fontWeight: 800, color: '#94a3b8' }}>→</span> : null}</span></button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { const ok = !!fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 74, height: 58, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}><FracStr s={r} size={19} /></button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
