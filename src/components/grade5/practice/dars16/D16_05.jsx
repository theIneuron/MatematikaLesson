// Dars16 · Amaliyot 05 — Moslash · 🟡 · tag: match_reduce
// 6/8↔3/4, 8/12↔2/3, 4/10↔2/5. Uch xil natija.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// matn ichidagi kasrlarni ikki qatorli ko'rsatish (a/b, ?/b, ?/? tokenlari)
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// ikki qatorli kasr (qoida bo'yicha yozuv)
const Frac = ({ num, den, size = 18, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const FracStr = ({ s, size = 18 }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} />; };

// 6/8↔3/4, 8/12↔2/3, 4/10↔2/5, 9/15↔3/5. To'rt xil natija.
const D05_PAIRS = { '6/8': '3/4', '8/12': '2/3', '4/10': '2/5', '9/15': '3/5' };
const D05_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Laylo har kasrni sodda shakliga ulamoqchi.",
    ask: "Chapdagi kasrni tanlang, keyin uning sodda shaklini o'ngdan bosing:",
    correct: "To'g'ri. 6/8=3/4 (÷2), 8/12=2/3 (÷4), 4/10=2/5 (÷2).",
    wrong: "Maslahat: chapdagi kasr va uning jufti aslida bir xil miqdor — faqat boshqa ko'rinishda. Qaysi sodda kasr o'sha miqdorni bildiradi?",
    rule: "Har kasrni umumiy bo'luvchiga bo'lib sodda shaklini toping.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Лайло хочет соединить каждую дробь с её простым видом.',
    ask: 'Выберите дробь слева, затем нажмите её простой вид справа:',
    correct: 'Верно. 6/8=3/4 (÷2), 8/12=2/3 (÷4), 4/10=2/5 (÷2).',
    wrong: 'Подсказка: дробь слева и её пара — это одно и то же количество, только в другом виде. Какая простая дробь выражает то же количество?',
    rule: 'Раздели каждую дробь на общий делитель и найди простой вид.',
  },
};
export default function D16_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const left = ['6/8', '8/12', '4/10', '9/15'];
  const right = ['2/3', '3/5', '2/5', '3/4']; // aralash
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 4;
  // all-or-nothing: to'liq to'g'ri bo'lmasa moslangan HAMMA katak qizil (per-juft yashil emas)
  const allOk = checked && left.every((l) => map[l] === D05_PAIRS[l]);
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D05_PAIRS, correct, meta: { tag: 'match_reduce', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
            if (done) { bd = '#93c5fd'; bg = '#f0f6ff'; }
            if (checked && done) { bd = allOk ? '#1a7f43' : '#c0392b'; bg = allOk ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ ...S.mono, width: 92, height: 56, borderRadius: 12, border: '2px solid ' + bd, background: bg, color: '#1f2430', cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><FracStr s={l} size={18} />{done ? <span style={{ fontSize: 18, fontWeight: 800 }}>→</span> : null}</span></button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { bd = allOk ? '#1a7f43' : '#c0392b'; bg = allOk ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ ...S.mono, width: 92, height: 56, borderRadius: 12, border: '2px solid ' + bd, background: bg, color: '#1f2430', cursor: locked ? 'default' : 'pointer' }}><FracStr s={r} size={18} /></button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
