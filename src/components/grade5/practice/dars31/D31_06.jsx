// Dars31 · Amaliyot 06 — Chegirma tasmasi (slider) · 🟡 · tag: of_slider
// "Tasmani suring: 200 ning 35% ini toping." Slider 0..100%; 35% da miqdor 70 ga to'ladi.
// Imzo-mexanika: foiz surilganda qism sekin to'ladi, son jonli sanaladi. Rang: red pill.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#dc2626', light: '#fef2f2', mid: '#fecaca', fill: '#ef4444', faint: '#fff5f5', soft: '#fca5a5', muted: '#a85a5a', track: '#fbd5d5' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_TOTAL = 200, D06_TARGET = 35, D06_ANS = 70;
const D06_T = {
  uz: {
    eyebrow: 'Chegirma tasmasi', setup: "Bu tasma 200 ta shakarni ko'rsatadi. Tasmani suring va ulushni toping.",
    ask: "200 ning 35% ini toping — tasmani 35% ga qo'ying:",
    live: 'olingan miqdor', pctLabel: 'foiz',
    correct: "To'g'ri. 35% — bu 200 : 100 = 2, 2 × 35 = 70.",
    wrong: "200 ning 1% i qancha? Undan kerakli foizni qanday hosil qilasiz?",
    rule: "Ixtiyoriy foiz ham: (A : 100) × N.",
  },
  ru: {
    eyebrow: 'Полоса скидки', setup: 'Эта полоса показывает 200 конфет. Двигай полосу и найди долю.',
    ask: 'Найди 35% от 200 — поставь полосу на 35%:',
    live: 'взятое количество', pctLabel: 'процент',
    correct: 'Верно. 35% — это 200 : 100 = 2, 2 × 35 = 70.',
    wrong: 'Сколько 1% от 200? Как из него получить нужный процент?',
    rule: 'Любой процент так же: (A : 100) × N.',
  },
};

export default function D31_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [pct, setPct] = useState(0);
  const [touched, setTouched] = useState(false);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pct != null) { setPct(sa.pct); setTouched(true); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);
  const check = useCallback(() => {
    const correct = pct === D06_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { pct, amount: Math.round(D06_TOTAL * pct / 100) }, correctAnswer: { pct: D06_TARGET, amount: D06_ANS }, correct, meta: { tag: 'of_slider', level: '🟡' } });
  }, [pct, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const amount = Math.round(D06_TOTAL * pct / 100);
  const w = 300, h = 44;
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d31-fill { transition: width .7s ease; }
        .d31-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 999px; background: ${C.track}; outline: none; }
        .d31-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: ${C.fill}; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); cursor: pointer; }
        .d31-slider::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: ${C.fill}; border: 3px solid #fff; cursor: pointer; }
        .d31-slider:disabled::-webkit-slider-thumb { cursor: default; }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } .d31-fill { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>

      <div style={{ margin: '10px auto 6px', maxWidth: w }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...S.mono, fontSize: 12.5, fontWeight: 700, color: C.muted, marginBottom: 3 }}>
          <span>0</span><span>50%</span><span>100% ({D06_TOTAL})</span>
        </div>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%' }}>
          <rect x="1" y="1" width={w - 2} height={h - 2} rx="7" fill={C.faint} stroke={C.soft} strokeWidth="1.5" />
          <rect className="d31-fill" x="2" y="2" width={(w - 4) * pct / 100} height={h - 4} rx="6" fill={C.fill} />
          {[25, 50, 75].map((p) => <line key={p} x1={2 + (w - 4) * p / 100} y1="2" x2={2 + (w - 4) * p / 100} y2={h - 2} stroke={C.mid} strokeWidth="1" />)}
        </svg>
      </div>

      <div style={{ maxWidth: w, margin: '4px auto 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ ...S.mono, fontSize: 13, fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>{t.pctLabel}</span>
        <input type="range" className="d31-slider" min="0" max="100" step="5" value={pct} disabled={isReview || checked}
          onChange={(e) => { setPct(parseInt(e.target.value, 10)); setTouched(true); }} />
        <span style={{ ...S.mono, fontSize: 19, fontWeight: 800, color: C.dark, width: 52, textAlign: 'right' }}>{pct}%</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.muted }}>{t.live}</span>
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: C.dark }}>{amount}</span>
      </div>

      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
