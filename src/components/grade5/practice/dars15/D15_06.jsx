// Dars15 · Amaliyot 06 — Retsept stakani · 🟡 · Laylo · tag: recipe_glass
// 2/3 stakan un = necha 1/6 stakan? 2/3 = 4/6. Realistik o'lchov stakani.
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

/* =================== 06 · Retsept stakani · 🟡 · recipe_glass (bo'sh katak + rasm) =================== */
// 2/3 stakan un = necha 1/6 stakan? 2/3 = 4/6. Realistik o'lchov stakani.

const D06_ANS = 4;
const D06_T = {
  uz: {
    eyebrow: 'Retsept', setup: "Laylo retsept bo'yicha 2/3 stakan un solishi kerak. Uning stakani 1/6 larga bo'lingan.",
    ask: "Laylo un darajasini qaysi 1/6 chizig'igacha to'ldiradi? (2/3 = ?/6)", label: '1/6 lar soni:',
    correct: "To'g'ri. 2/3 = 4/6 (surat va maxraj ×2). Laylo 4-chi 1/6 chizig'igacha to'ldiradi.",
    wrong: "Maslahat: surat va maxrajni bir xil songa ko'paytiring. Maxraj qaysi songa ko'paydi? Suratni ham o'sha songa ko'paytirib, o'zingiz hisoblang.",
    rule: "Bir xil miqdorni mayda ulushlarda: surat va maxrajni bir xil songa ko'paytiring.",
  },
  ru: {
    eyebrow: 'Рецепт', setup: 'Лайло по рецепту нужно 2/3 стакана муки. Её стакан размечен на 1/6.',
    ask: 'До какой отметки 1/6 Лайло наполнит муку? (2/3 = ?/6)', label: 'Число 1/6:',
    correct: 'Верно. 2/3 = 4/6 (числитель и знаменатель ×2). Лайло наполнит до 4-й отметки 1/6.',
    wrong: 'Подсказка: умножь числитель и знаменатель на одно число. На какое число вырос знаменатель? Умножь на него и числитель — посчитай сам.',
    rule: 'То же количество в мелких долях: умножь числитель и знаменатель на одно число.',
  },
};
export default function D15_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(0); // to'g'ri javobdan keyin 0→4 to'ladi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setFill(4); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [1, 2, 3, 4].forEach((k) => timers.current.push(setTimeout(() => setFill(k), 500 + (k - 1) * 550)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'recipe_glass', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  // o'lchov stakani: trapetsiya (yuqori keng, past tor), 6 chiziq, pastdan fill*1/6 suv
  const GW = 96, GH = 150, topW = 96, botW = 70, pad = 12;
  const yFor = (u) => pad + (GH - 2 * pad) * (1 - u / 6); // u-chi 1/6 chizig'i y
  const waterTopY = yFor(fill);
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <svg width={GW + 40} height={GH + 20} viewBox={`0 0 ${GW + 40} ${GH + 20}`}>
          <defs>
            <clipPath id="d15glass"><path d={`M ${20 + (topW - botW) / 2} ${pad} L ${20 + topW - (topW - botW) / 2} ${pad} L ${20 + topW} ${GH - pad} L 20 ${GH - pad} Z`} /></clipPath>
          </defs>
          {/* suv (pastdan) */}
          <rect x="20" y={waterTopY} width={topW} height={GH} fill="#bae6fd" clipPath="url(#d15glass)" style={{ transition: 'y .5s ease' }} />
          {/* stakan konturi (trapetsiya, tepasi ochiq) */}
          <path d={`M ${20 + (topW - botW) / 2} ${pad} L 20 ${GH - pad} L ${20 + topW} ${GH - pad} L ${20 + topW - (topW - botW) / 2} ${pad}`} fill="none" stroke="#0369a1" strokeWidth="3" strokeLinejoin="round" />
          {/* 1/6 chiziqlari + yorliqlar */}
          {[1, 2, 3, 4, 5].map((u) => {
            const y = yFor(u);
            const half = (topW - botW) / 2 * (u / 6);
            const active = fill >= u;
            return (
              <g key={u}>
                <line x1={20 + half} y1={y} x2={20 + topW - half} y2={y} stroke={active ? '#0ea5e9' : '#cbd5e1'} strokeWidth="1.5" strokeDasharray="4 3" />
                <text x={20 + topW - half + 6} y={y + 4} fontSize="10" fontWeight="800" fill={active ? '#0369a1' : '#94a3b8'} fontFamily="'JetBrains Mono', monospace">{u}/6</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 120, height: 54, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
