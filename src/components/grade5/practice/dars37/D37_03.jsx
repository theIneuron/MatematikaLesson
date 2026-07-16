// Dars37 · Amaliyot 03 — Kub hajmi · 🟢 · tag: vol_cube
// Kub qirrasi 2 kubcha. Hajmi 2 × 2 × 2 = 8. Javob: Ha.
// Vizual: asos to'ri (2×2) + balandlik qavsi (× qatlam) — 3D kubdan farqli schema.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d37-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Asos to'ri (a×b) + balandlik qavsi (c qatlam) — hajm 3 o'lchamdan tuzilishini ko'rsatadi
function BaseHeight({ a, b, c, lang }) {
  const u = 26, gap = 3, pad = 8;
  const gw = a * u, gh = b * u;
  const brX = pad + gw + 26;
  const W = brX + 74, H = pad + gh + 26;
  const cells = [];
  for (let j = 0; j < b; j++) for (let i = 0; i < a; i++) cells.push({ i, j });
  const layerLabel = lang === 'uz' ? 'qatlam' : 'слой';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      {cells.map(({ i, j }, idx) => (
        <rect key={idx} className="d37-cell" style={{ animationDelay: (idx * 0.06).toFixed(2) + 's' }} x={pad + i * u + gap / 2} y={pad + j * u + gap / 2} width={u - gap} height={u - gap} rx="4" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.4" />
      ))}
      <text x={pad + gw / 2} y={pad + gh + 18} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#6d28d9" fontFamily="'JetBrains Mono', monospace">{`asos ${a}×${b}`}</text>
      {/* balandlik qavsi */}
      <line x1={brX} y1={pad + 2} x2={brX} y2={pad + gh - 2} stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <line x1={brX - 5} y1={pad + 2} x2={brX + 5} y2={pad + 2} stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <line x1={brX - 5} y1={pad + gh - 2} x2={brX + 5} y2={pad + gh - 2} stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <text x={brX + 12} y={pad + gh / 2 - 2} fontSize="16" fontWeight="800" fill="#6d28d9" fontFamily="'JetBrains Mono', monospace">{`× ${c}`}</text>
      <text x={brX + 12} y={pad + gh / 2 + 14} fontSize="11" fontWeight="700" fill="#8b5cf6">{layerLabel}</text>
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: 'Kub hajmi', setup: "Zaynab qirrasi 2 kubcha bo'lgan kubni yasadi.",
    ask: 'Kubning hajmi 8 kubchami?', yes: 'Ha', no: "Yo'q",
    correct: "Ha. Kub: 2 × 2 × 2 = 8 kubcha.",
    wrong: "Kubning uchala o'lchami teng. Hajm nechta o'lchamdan tuziladi — ikkitami yoki uchtami? Shunga qarab savoldagi son to'g'rimi, tekshiring.",
    rule: "Kub: V = qirra × qirra × qirra.",
  },
  ru: {
    eyebrow: 'Объём куба', setup: 'Зайнаб собрала куб с ребром 2 кубика.',
    ask: 'Объём куба равен 8 кубикам?', yes: 'Да', no: 'Нет',
    correct: 'Да. Куб: 2 × 2 × 2 = 8 кубиков.',
    wrong: 'У куба все три измерения равны. Из скольких измерений складывается объём — из двух или трёх? Проверьте, верно ли число из вопроса.',
    rule: 'Куб: V = ребро × ребро × ребро.',
  },
};

export default function D37_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'vol_cube', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d37-cell { animation: d37cell .45s ease both; transform-box: fill-box; transform-origin: center; }
        @keyframes d37cell { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop, .d37-cell { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 8px' }}>
        <BaseHeight a={2} b={2} c={2} lang={lang} />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
