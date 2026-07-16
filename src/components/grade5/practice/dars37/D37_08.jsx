// Dars37 · Amaliyot 08 — Masala (o'nli o'lcham) · 🔴 · tag: vol_word
// Quti 4 sm × 3 sm × 1,5 sm. Hajmi: 4 × 3 = 12; 12 × 1,5 = 18 sm³.
// NAQSH A: chizma/yechim faqat to'g'ri javobdan keyin ochiladi (dars29 uslubi), savol tepada.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
// Reveal chizmasi: 4×3 asos to'ri + "× 1,5" balandlik qavsi (o'nli o'lcham)
function BaseCard() {
  const a = 4, b = 3, u = 22, gap = 3, pad = 8;
  const gw = a * u, gh = b * u;
  const brX = pad + gw + 22;
  const W = brX + 70, H = pad + gh + 10;
  const cells = [];
  for (let j = 0; j < b; j++) for (let i = 0; i < a; i++) cells.push({ i, j });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      {cells.map(({ i, j }, idx) => (
        <rect key={idx} className="d37-cell" style={{ animationDelay: (idx * 0.04).toFixed(2) + 's' }} x={pad + i * u + gap / 2} y={pad + j * u + gap / 2} width={u - gap} height={u - gap} rx="4" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.4" />
      ))}
      <line x1={brX} y1={pad + 2} x2={brX} y2={pad + gh - 2} stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <line x1={brX - 5} y1={pad + 2} x2={brX + 5} y2={pad + 2} stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <line x1={brX - 5} y1={pad + gh - 2} x2={brX + 5} y2={pad + gh - 2} stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <text x={brX + 10} y={pad + gh / 2 + 5} fontSize="16" fontWeight="800" fill="#15803d" fontFamily="'JetBrains Mono', monospace">× 1,5</text>
    </svg>
  );
}

const D08_ANS = 18;
const D08_T = {
  uz: {
    eyebrow: 'Masala', setup: "Rustam qutini o'lchadi: uzunligi 4 sm, eni 3 sm, balandligi 1,5 sm.",
    ask: 'Qutining hajmi qancha (sm³)?', unit: 'sm³',
    correct: "To'g'ri. 4 × 3 = 12; 12 × 1,5 = 18 sm³.",
    wrong: "Hajm uchala o'lchamga bog'liq. Balandlik o'nli son bo'lsa ham uni tashlab ketib bo'lmaydi — u hajmga qanday ta'sir qiladi?",
    rule: "V = a × b × c (o'nli o'lcham ham).",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Рустам измерил коробку: длина 4 см, ширина 3 см, высота 1,5 см.',
    ask: 'Каков объём коробки (см³)?', unit: 'см³',
    correct: 'Верно. 4 × 3 = 12; 12 × 1,5 = 18 см³.',
    wrong: 'Объём зависит от всех трёх измерений. Даже если высота — десятичное число, её нельзя отбросить: как она влияет на объём?',
    rule: 'V = a × b × c (в том числе с десятичным измерением).',
  },
};

export default function D37_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.raw != null) { setVal(String(sa.raw)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const parse = (s) => parseFloat(String(s).replace(',', '.'));
  const valid = /^\d+([.,]\d+)?$/.test(val.trim());
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);
  const check = useCallback(() => {
    const correct = Math.abs(parse(val) - D08_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { raw: val.trim(), value: parse(val) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'vol_word', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d37-drop { animation: d37drop .5s ease both; }
        @keyframes d37drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .d37-cell { animation: d37cell .45s ease both; transform-box: fill-box; transform-origin: center; }
        @keyframes d37cell { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop, .d37-drop, .d37-cell { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d37-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '8px 0 12px', padding: '14px 12px', borderRadius: 14, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
          <BaseCard />
          <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#15803d' }}>4 × 3 = 12; 12 × 1,5 = 18 sm³</div>
        </div>
      )}
      <p className={revealed ? 'd37-drop' : ''} style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div className={revealed ? 'd37-drop' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 6))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 92, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#6b7280' }}>{t.unit}</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
