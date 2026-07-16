// Dars24 · Amaliyot 06 — Son o'qida o'nli · 🟡 · tag: decimal_numberline
// 0 dan 1 gacha 10 ga bo'lingan o'q. 0,7 qayerda? (7-belgi). Har bo'linma — o'ndan.
// Setup usulni oshkor qilmaydi; wrong = turtki; qoida faqat to'g'ridan keyin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
  <div className="d24-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D06_ANS = 7; // 0,7
const D06_T = {
  uz: {
    eyebrow: "Son o'qi", setup: "Anvar 0 dan 1 gacha bo'lgan son o'qini 10 ta teng bo'lakka ajratdi.",
    ask: "0,7 sonini son o'qida belgilang — kerakli nuqtani bosing:",
    correct: "To'g'ri. 0 dan o'ngga qarab 7-belgi — bu 0,7, ya'ni 7/10.",
    wrong: "O'q 10 ta teng bo'lakka bo'lingan — har bir bo'linma qanday ulushni bildiradi? 0,5 o'rtada turadi.",
    rule: "Har bo'linma — bitta o'ndan (0,1). 0,7 — 7-belgi = 7/10.",
  },
  ru: {
    eyebrow: 'Ось чисел', setup: 'Анвар разделил ось от 0 до 1 на 10 равных частей.',
    ask: 'Отметьте число 0,7 на оси — нажмите нужную точку:',
    correct: 'Верно. Седьмая метка вправо от 0 — это 0,7, то есть 7/10.',
    wrong: 'Ось разделена на 10 равных частей — какую долю даёт одно деление? 0,5 стоит посередине.',
    rule: 'Каждое деление — одна десятая (0,1). 0,7 — 7-я метка = 7/10.',
  },
};

export default function D24_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pick != null) { setPick(sa.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { pick }, correctAnswer: { pick: D06_ANS }, correct, meta: { tag: 'decimal_numberline', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 320, H = 92, x0 = 22, x1 = W - 22, y = 44;
  const xAt = (i) => x0 + (x1 - x0) * (i / 10);
  return (
    <div style={S.wrap}>
      <style>{`
        .d24-pop { animation: d24pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d24pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d24-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }}>
          <line x1={x0} y1={y} x2={x1} y2={y} stroke="#334155" strokeWidth="2.5" />
          {Array.from({ length: 11 }).map((_, i) => {
            const big = i === 0 || i === 5 || i === 10;
            return <line key={i} x1={xAt(i)} y1={y - (big ? 11 : 7)} x2={xAt(i)} y2={y + (big ? 11 : 7)} stroke="#334155" strokeWidth={big ? 2.2 : 1.4} />;
          })}
          {[0, 5, 10].map((i) => <text key={i} x={xAt(i)} y={y + 30} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="800" fill="#475569">{i === 0 ? '0' : i === 5 ? '0,5' : '1'}</text>)}
          {checked && fb?.correct && <circle cx={xAt(D06_ANS)} cy={y} r="9" fill="#1a7f43" className="d24-pop" />}
          {Array.from({ length: 11 }).map((_, i) => {
            const on = pick === i;
            const stroke = checked ? (on ? (i === D06_ANS ? '#1a7f43' : '#c0392b') : 'transparent') : (on ? '#fe5b1a' : 'transparent');
            const fill = on ? (checked ? (i === D06_ANS ? '#1a7f43' : '#c0392b') : '#fe5b1a') : '#fff';
            return <circle key={i} cx={xAt(i)} cy={y} r="11" fill={fill} fillOpacity={on ? 1 : 0.001} stroke={stroke} strokeWidth="2.5" style={{ cursor: isReview || checked ? 'default' : 'pointer' }} onClick={() => { if (!isReview && !checked) setPick(i); }} />;
          })}
        </svg>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
