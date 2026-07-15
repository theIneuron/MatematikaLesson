// Dars20 · Amaliyot 06 — Orqaga sakrash · 🟡 · tag: sub_numberline
// 5/6 − 1/2 = 5/6 − 3/6 = 2/6. Belgi 5/6 dan 1/2 (= 3/6) ga ORQAGA sakraydi → 2/6.
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
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D06_START = 5, D06_ANS = 2; // 5/6 − 3/6 = 2/6
const D06_T = {
  uz: {
    eyebrow: "Son o'qida", setup: "O'q oltidan bo'lingan. Quyoncha 5/6 nuqtada turibdi. U 1/2 masofaga ORQAGA sakraydi.",
    ask: 'Quyoncha qayerga tushadi? Katakchani bosing:',
    correct: "To'g'ri. 1/2 = 3/6, so'ng 5/6 − 3/6 = 2/6. Orqaga sakrash — bu ayirish.",
    wrong: "Maslahat: 1/2 masofa bu o'qda qaysi ulushga to'g'ri keladi? Orqaga sakrash qaysi amalni bildiradi?",
    rule: "Ayirishdan oldin bir xil ulushga keltiring: 1/2 = 3/6, keyin orqaga sakra.",
  },
  ru: {
    eyebrow: 'На оси', setup: 'Ось поделена на шестые. Зайчик стоит на точке 5/6. Он прыгает на 1/2 НАЗАД.',
    ask: 'Куда попадёт зайчик? Нажми деление:',
    correct: 'Верно. 1/2 = 3/6, затем 5/6 − 3/6 = 2/6. Прыжок назад — это вычитание.',
    wrong: 'Подсказка: какой доле на этой оси равна 1/2? Какое действие означает прыжок назад?',
    rule: 'Перед вычитанием приведи к одинаковым долям: 1/2 = 3/6, затем прыгай назад.',
  },
};

export default function D20_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [pos, setPos] = useState(D06_START);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel != null) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPos(D06_ANS); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel != null && !checked); }, [sel, checked, onReady]);
  const check = useCallback(() => {
    const correct = sel === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setPos(D06_ANS), 450);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'sub_numberline', level: '🟡' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 320, mL = 24, mR = 296, base = 66, step = (mR - mL) / 6;
  const xAt = (i) => mL + i * step;
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } svg circle[style] { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <svg width={W} height="92" viewBox={`0 0 ${W} 92`}>
          <line x1={mL} y1={base} x2={mR} y2={base} stroke="#94a3b8" strokeWidth="2" />
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i}>
              <line x1={xAt(i)} y1={base - 6} x2={xAt(i)} y2={base + 6} stroke="#94a3b8" strokeWidth="2" />
              <text x={xAt(i)} y={base + 22} fontSize="9.5" textAnchor="middle" fill="#94a3b8" fontFamily="'JetBrains Mono', monospace">{i}/6</text>
            </g>
          ))}
          <line x1={xAt(D06_START)} y1={base - 14} x2={xAt(D06_START)} y2={base} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 2" />
          {checked && fb?.correct && pos === D06_ANS && <path d={`M ${xAt(D06_START)} ${base - 4} Q ${xAt(3.5)} ${base - 36} ${xAt(D06_ANS)} ${base - 4}`} fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 3" />}
          <circle cx={xAt(pos)} cy={base - 4} r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" style={{ transition: 'cx 0.9s cubic-bezier(.34,1.2,.64,1)' }} />
        </svg>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = sel === i;
          let bd = '#cbd5e1', bg = '#fff', col = '#334155';
          if (on) { bd = '#2563eb'; bg = '#eff6ff'; col = '#1e40af'; }
          if (checked && on) { const ok = i === D06_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={locked} onClick={() => setSel(i)} style={{ width: 52, height: 52, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}><Frac num={String(i)} den="6" size={16} color={col} /></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
