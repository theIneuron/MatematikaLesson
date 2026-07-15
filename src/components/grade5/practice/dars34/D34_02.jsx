// Dars34 · Amaliyot 02 — To'rtburchak perimetri · 🟢 · tag: peri_rect
// To'rtburchak 8 m va 5 m. P = 2 × (8 + 5) = 26 m.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#be123c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function RectWalk({ a, b, unit = 'm', accent = '#be123c', square = false }) {
  const RW = square ? 122 : 168, RH = square ? 122 : 104, px = 36, py = 28, fs = 15;
  return (
    <div style={{ margin: '8px auto 2px', width: RW + px * 2, maxWidth: '100%' }}>
      <style>{`
        .d34w-s{stroke-dasharray:1;stroke-dashoffset:1;animation:d34draw .8s ease forwards;}
        .d34w-s2{animation-delay:.8s}.d34w-s3{animation-delay:1.6s}.d34w-s4{animation-delay:2.4s}
        .d34w-l{opacity:0;animation:d34lab .5s ease forwards;}
        .d34w-l1{animation-delay:.6s}.d34w-l2{animation-delay:1.4s}.d34w-l3{animation-delay:2.2s}.d34w-l4{animation-delay:3s}
        .d34w-dot{animation:d34dotK 3.2s linear forwards;}
        @keyframes d34draw{to{stroke-dashoffset:0}}
        @keyframes d34lab{to{opacity:1}}
        @keyframes d34dotK{0%{transform:translate(0px,0px)}25%{transform:translate(${RW}px,0px)}50%{transform:translate(${RW}px,${RH}px)}75%{transform:translate(0px,${RH}px)}100%{transform:translate(0px,0px)}}
        @media (prefers-reduced-motion: reduce){
          .d34w-s{stroke-dashoffset:0!important;animation:none!important}
          .d34w-l{opacity:1!important;animation:none!important}
          .d34w-dot{animation:none!important}
        }
      `}</style>
      <svg width={RW + px * 2} height={RH + py * 2} viewBox={`0 0 ${RW + px * 2} ${RH + py * 2}`} style={{ display: 'block', maxWidth: '100%' }}>
        <rect x={px} y={py} width={RW} height={RH} fill="#fff1f2" />
        <rect x={px} y={py} width={RW} height={RH} fill="none" stroke="#d6dae3" strokeWidth="2" />
        <line className="d34w-s" pathLength="1" x1={px} y1={py} x2={px + RW} y2={py} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34w-s d34w-s2" pathLength="1" x1={px + RW} y1={py} x2={px + RW} y2={py + RH} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34w-s d34w-s3" pathLength="1" x1={px + RW} y1={py + RH} x2={px} y2={py + RH} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34w-s d34w-s4" pathLength="1" x1={px} y1={py + RH} x2={px} y2={py} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <text className="d34w-l d34w-l1" x={px + RW / 2} y={py - 9} textAnchor="middle" fontSize={fs} fontWeight="800" fill="#1f2430" fontFamily="'JetBrains Mono',monospace">{a}{unit ? ' ' + unit : ''}</text>
        <text className="d34w-l d34w-l2" x={px + RW + 9} y={py + RH / 2 + 5} textAnchor="start" fontSize={fs} fontWeight="800" fill="#1f2430" fontFamily="'JetBrains Mono',monospace">{b}{unit ? ' ' + unit : ''}</text>
        {!square && <text className="d34w-l d34w-l3" x={px + RW / 2} y={py + RH + 19} textAnchor="middle" fontSize={fs} fontWeight="800" fill="#9ca3af" fontFamily="'JetBrains Mono',monospace">{a}{unit ? ' ' + unit : ''}</text>}
        {!square && <text className="d34w-l d34w-l4" x={px - 9} y={py + RH / 2 + 5} textAnchor="end" fontSize={fs} fontWeight="800" fill="#9ca3af" fontFamily="'JetBrains Mono',monospace">{b}{unit ? ' ' + unit : ''}</text>}
        <circle className="d34w-dot" cx={px} cy={py} r="6.5" fill={accent} stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

const D02_ANS = 26;
const D02_T = {
  uz: {
    eyebrow: "To'rtburchak", setup: "Madina to'rtburchak bog'chaning tomonlarini o'lchadi: 8 m va 5 m.",
    ask: 'Perimetrni toping (m):', label: 'P =',
    correct: "To'g'ri. P = 2 × (8 + 5) = 26 m.",
    wrong: "Perimetr — chegara bo'ylab to'liq aylana. To'rtburchakda qarama-qarshi tomonlar teng — hamma tomon hisobga olindimi?",
    rule: "To'rtburchak: P = 2 × (a + b).",
  },
  ru: {
    eyebrow: 'Прямоугольник', setup: 'Мадина измерила стороны прямоугольного двора: 8 м и 5 м.',
    ask: 'Найди периметр (м):', label: 'P =',
    correct: 'Верно. P = 2 × (8 + 5) = 26 м.',
    wrong: 'Периметр — это полный обход по границе. У прямоугольника противоположные стороны равны — все ли стороны учтены?',
    rule: 'Прямоугольник: P = 2 × (a + b).',
  },
};

export default function D34_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const num = () => parseFloat(String(val).replace(',', '.'));
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val.trim() !== '' && !isNaN(num()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = Math.abs(num() - D02_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: num() }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'peri_rect', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#be123c';
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
      {revealed && <RectWalk a="8" b="5" />}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>{t.label}</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 92, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 700, color: '#6b7280' }}>m</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
