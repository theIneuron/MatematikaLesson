// Dars16 · Amaliyot 06 — Retsept stakani · 🟡 · tag: recipe_glass
// Sanjar 8/12 stakan = necha 1/3 stakan? 8/12 = 2/3. O'lchov stakani.
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
// ikki qatorli kasr (qoida bo'yicha yozuv)
const Frac = ({ num, den, size = 14, color = 'currentColor' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
// matn ichidagi kasrlarni ikki qatorli ko'rsatish (a/b, ?/b, ?/? tokenlari)
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// Stakan 6 ta bo'lakka bo'lingan (1/6..5/6). Savol: 8/12 bu necha 1/3? Javob 2.
// Suv BOSHIDA bo'sh; to'g'ri javob belgilangach 4/6 (= 8/12 = 2/3) gacha to'ladi.
const D06_ANS = 2;
const D06_T = {
  uz: {
    eyebrow: 'Retsept', setup: "Sanjar retseptda 8/12 stakan shakar ko'rdi. Uning stakani 1/6 larga bo'lingan.",
    ask: 'Bu necha 1/3 stakan? (8/12 = ?/3)', label: '1/3 lar soni:',
    correct: "To'g'ri. 8/12 = 4/6 = 2/3. Stakan 4/6 gacha to'ladi — bu 2 ta 1/3.",
    wrong: "Maslahat: 8/12 — bu o'sha miqdorning bir ko'rinishi, xolos. Xuddi shu miqdorni kamroq, yirikroq ulushlar bilan yozsangiz, maxraj qanday o'zgaradi?",
    rule: "Qisqartirilgan kasr — bir xil miqdorning soddaroq yozuvi. 8/12 = 4/6 = 2/3.",
  },
  ru: {
    eyebrow: 'Рецепт', setup: 'Санжар увидел в рецепте 8/12 стакана сахара. Его стакан размечен на 1/6.',
    ask: 'Сколько это 1/3 стакана? (8/12 = ?/3)', label: 'Число 1/3:',
    correct: 'Верно. 8/12 = 4/6 = 2/3. Стакан наполняется до 4/6 — это 2 трети.',
    wrong: 'Подсказка: 8/12 — лишь один вид этого количества. Если записать то же количество более крупными долями, как изменится знаменатель?',
    rule: 'Сокращённая дробь — простая запись того же количества. 8/12 = 4/6 = 2/3.',
  },
};
export default function D16_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(0); // suv sathi (oltidan); to'g'ri javobda 4/6 gacha to'ladi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setFill(4); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timers.current.push(setTimeout(() => setFill(4), 400));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'recipe_glass', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const GW = 96, GH = 150, topW = 96, botW = 70, pad = 12;
  const yFor = (u) => pad + (GH - 2 * pad) * (1 - u / 6); // oltidan
  const waterTopY = yFor(fill);
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <svg width={GW + 40} height={GH + 20} viewBox={`0 0 ${GW + 40} ${GH + 20}`}>
          <defs><clipPath id="d16glass"><path d={`M ${20 + (topW - botW) / 2} ${pad} L ${20 + topW - (topW - botW) / 2} ${pad} L ${20 + topW} ${GH - pad} L 20 ${GH - pad} Z`} /></clipPath></defs>
          <rect x="20" y={waterTopY} width={topW} height={GH} fill="#fcd9a8" clipPath="url(#d16glass)" style={{ transition: 'y .6s ease' }} />
          <path d={`M ${20 + (topW - botW) / 2} ${pad} L 20 ${GH - pad} L ${20 + topW} ${GH - pad} L ${20 + topW - (topW - botW) / 2} ${pad}`} fill="none" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
          {[1, 2, 3, 4, 5].map((u) => {
            const y = yFor(u), half = (topW - botW) / 2 * (u / 6), active = fill >= u;
            const third = u === 2 || u === 4; // 2/6 = 1/3, 4/6 = 2/3 — qalin chiziq
            const lx = 20 + topW - half + 12, col = active ? '#b45309' : '#94a3b8';
            return <g key={u}>
              <line x1={20 + half} y1={y} x2={20 + topW - half} y2={y} stroke={third ? (active ? '#f59e0b' : '#94a3b8') : (active ? '#fcd34d' : '#cbd5e1')} strokeWidth={third ? 2 : 1} strokeDasharray={third ? '4 3' : '2 3'} />
              {/* ikki qatorli yorliq: u / 6 */}
              <g fontFamily="'JetBrains Mono', monospace" fontWeight={third ? 800 : 700} fill={col} textAnchor="middle">
                <text x={lx} y={y - 2} fontSize="8.5">{u}</text>
                <line x1={lx - 5} y1={y + 0.5} x2={lx + 5} y2={y + 0.5} stroke={col} strokeWidth="1" />
                <text x={lx} y={y + 9} fontSize="8.5">6</text>
              </g>
            </g>;
          })}
        </svg>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 120, height: 54, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
