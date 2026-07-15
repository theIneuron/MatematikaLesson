// Dars34 · Amaliyot 10 — Kvadrat tomoni · 🔴 · tag: peri_square_inverse_mcq
// Vizual-MCQ: kvadrat perimetri 36 m, tomoni = 36:4 = 9 m. Distraktorlar: 18 (36:2), 6 (yuza-tomon chalkashligi).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#a21caf', background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#fdf4ff', border: '1.5px solid #f5d0fe', color: '#a21caf' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function SquareFig({ accent = '#a21caf', sideLabel }) {
  const side = 118, px = 20, py = 16;
  return (
    <div style={{ margin: '8px auto 2px', width: side + px * 2, maxWidth: '100%' }}>
      <style>{`
        .d34q-s{stroke-dasharray:1;stroke-dashoffset:1;animation:d34qdraw .8s ease forwards;}
        .d34q-s2{animation-delay:.8s}.d34q-s3{animation-delay:1.6s}.d34q-s4{animation-delay:2.4s}
        @keyframes d34qdraw{to{stroke-dashoffset:0}}
        @media (prefers-reduced-motion: reduce){ .d34q-s{stroke-dashoffset:0!important;animation:none!important} }
      `}</style>
      <svg width={side + px * 2} height={side + py * 2} viewBox={`0 0 ${side + px * 2} ${side + py * 2}`} style={{ display: 'block', maxWidth: '100%' }}>
        <rect x={px} y={py} width={side} height={side} fill="#fdf4ff" />
        <line className="d34q-s" pathLength="1" x1={px} y1={py} x2={px + side} y2={py} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34q-s d34q-s2" pathLength="1" x1={px + side} y1={py} x2={px + side} y2={py + side} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34q-s d34q-s3" pathLength="1" x1={px + side} y1={py + side} x2={px} y2={py + side} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34q-s d34q-s4" pathLength="1" x1={px} y1={py + side} x2={px} y2={py} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <text x={px + side / 2} y={py + side / 2 + 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#a21caf" fontFamily="'JetBrains Mono',monospace">P = 36 m</text>
        {sideLabel && <text x={px + side / 2} y={py - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="#1f2430" fontFamily="'JetBrains Mono',monospace">{sideLabel}</text>}
      </svg>
    </div>
  );
}

const D10_OPTS = ['18', '9', '6'];
const D10_CORRECT = 1;
const D10_T = {
  uz: {
    eyebrow: 'Kvadrat tomoni', setup: "Kamol kvadrat gilamning chekkasini o'lchadi: butun perimetri 36 m. Uning 4 tomoni teng.",
    ask: 'Bir tomoni qaysi biriga teng?',
    correct: "To'g'ri. Kvadratda 4 teng tomon: 36 : 4 = 9 m.",
    wrong: "Kvadratning 4 tomoni teng. Bir tomonni topish uchun qanday amal kerakligini o'ylang.",
    rule: "Kvadrat tomoni = P : 4.",
  },
  ru: {
    eyebrow: 'Сторона квадрата', setup: 'Камол измерил край квадратного ковра: весь периметр 36 м. У него 4 равные стороны.',
    ask: 'Чему равна одна сторона?',
    correct: 'Верно. У квадрата 4 равные стороны: 36 : 4 = 9 м.',
    wrong: 'У квадрата 4 равные стороны. Подумай, какое действие найдёт одну сторону.',
    rule: 'Сторона квадрата = P : 4.',
  },
};

export default function D34_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((o, i) => ({ id: String(i), label: o + ' m' })), studentAnswer: { idx: pick }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'peri_square_inverse_mcq', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d34-pop { animation: d34pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d34pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d34-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && <SquareFig sideLabel="9 m" />}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
        {D10_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#a21caf'; bg = '#fdf4ff'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}>
              <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{o} m</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
