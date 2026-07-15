// Dars30 · Amaliyot 04 — Foizni kasrga · 🟡 · tag: pct_frac_match
// 4 juft: 50%→1/2 ; 25%→1/4 ; 10%→1/10 ; 100%→1 (butun). Moslash — all-or-nothing.
// Eyebrow pill: teal. jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#0f766e', l: '#f0fdfa', m: '#99f6e4', fill: '#2dd4bf' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.d, background: C.l, border: '1px solid ' + C.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 15, color = '#1f2430' }) => (
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

// chap = foiz, o'ng = kasr (id → ko'rinishi)
const D04_LEFT = [{ id: 'p50', pct: '50%' }, { id: 'p25', pct: '25%' }, { id: 'p10', pct: '10%' }, { id: 'p100', pct: '100%' }];
const D04_PAIRS = { p50: 'half', p25: 'quarter', p10: 'tenth', p100: 'whole' };
const D04_RIGHT = ['tenth', 'whole', 'half', 'quarter']; // aralash tartib
const D04_RVIEW = { half: { num: '1', den: '2' }, quarter: { num: '1', den: '4' }, tenth: { num: '1', den: '10' }, whole: { whole: '1' } };
const D04_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Oybek har bir foizni qisqargan kasrga aylantirmoqchi. Har foizni to'g'ri kasriga ulang.",
    ask: "Chapdagi foizni tanlang, keyin o'ngdan mos kasrni bosing:",
    correct: "To'g'ri. Har foiz — yuzdan ulush: qisqartirilgan kasr.",
    wrong: "Foiz — nimaning ulushi? Har foizni maxraji 100 bo'lgan kasr qilib yozsangiz, keyin nima qilsa bo'ladi?",
    rule: "Foizni kasrga: N/100, keyin qisqartiring.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Ойбек хочет перевести каждый процент в сокращённую дробь. Соедини каждый процент с верной дробью.',
    ask: 'Выберите процент слева, затем нажмите его дробь справа:',
    correct: 'Верно. Каждый процент — доля от ста: сокращённая дробь.',
    wrong: 'Процент — доля от чего? Запиши каждый как дробь со знаменателем 100 — что можно сделать потом?',
    rule: 'Процент в дробь: N/100, затем сократи.',
  },
};

export default function D30_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
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
    const correct = D04_LEFT.every((it) => map[it.id] === D04_PAIRS[it.id]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D04_PAIRS, correct, meta: { tag: 'pct_frac_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rView = (r) => { const v = D04_RVIEW[r]; return v.whole ? <span style={{ ...S.mono, fontSize: 22, fontWeight: 800 }}>1</span> : <Frac num={v.num} den={v.den} size={20} />; };
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {D04_LEFT.map((it) => {
            const on = pickL === it.id, done = map[it.id];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = C.d; bg = C.l; }
            if (done) { bd = C.fill; bg = C.l; }
            if (checked && done) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={it.id} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : it.id)} style={{ width: 96, height: 52, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px ' + C.m : 'none', ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{it.pct}{done ? <span style={{ fontSize: 15, color: '#94a3b8' }}>→</span> : null}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {D04_RIGHT.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = C.fill; bg = C.l; }
            if (checked && used) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 66, height: 52, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{rView(r)}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
