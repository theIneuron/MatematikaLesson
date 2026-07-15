// Dars11 · Amaliyot 08 — Perimetr tomoni · 🔴 · perimeter_side (kvadrat + kasr kiritish)
// Kvadrat perimetri 7 dm. Bir tomoni? 7:4 = 7/4 dm.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// ikki maydonli kasr kiritish (surat / maxraj)
function FracInput({ num, den, setNum, setDen, disabled, bd }) {
  const cell = { width: 78, height: 46, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' };
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <input value={num} onChange={(e) => setNum(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={disabled} inputMode="numeric" placeholder="?" style={cell} />
      <div style={{ width: 92, height: 3, background: '#1f2430', borderRadius: 2 }} />
      <input value={den} onChange={(e) => setDen(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={disabled} inputMode="numeric" placeholder="?" style={cell} />
    </div>
  );
}

const D08_NUM = 7, D08_DEN = 4;
const D08_T = {
  uz: {
    eyebrow: 'Perimetr tomoni', setup: "Kvadratning perimetri 7 dm.",
    ask: 'Uning bir tomoni necha dm? Kasr shaklida yozing:',
    correct: "To'g'ri. Perimetrni 4 ga bo'lamiz: 7 : 4 = 7/4 dm.",
    wrong: "Maslahat: kvadratning 4 ta teng tomoni bor. Perimetr shu tomonlarga qanday taqsimlanadi?",
    rule: "Kvadrat tomoni = perimetr : 4. 7 : 4 = 7/4.",
  },
  ru: {
    eyebrow: 'Сторона по периметру', setup: 'Периметр квадрата 7 дм.',
    ask: 'Чему равна его сторона в дм? Запишите дробью:',
    correct: 'Верно. Периметр делим на 4: 7 : 4 = 7/4 дм.',
    wrong: 'Подсказка: у квадрата 4 равные стороны. Как периметр распределяется по ним?',
    rule: 'Сторона квадрата = периметр : 4. 7 : 4 = 7/4.',
  },
};
export default function D11_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.num != null) setNum(String(sa.num)); if (sa.den != null) setDen(String(sa.den)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(num) && /^\d+$/.test(den);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(num, 10) === D08_NUM && parseInt(den, 10) === D08_DEN;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { num: parseInt(num, 10), den: parseInt(den, 10) }, correctAnswer: { num: 7, den: 4 }, correct, meta: { tag: 'perimeter_side', level: '🔴' } });
  }, [num, den, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d11-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* kvadrat, 4 tomonda "?" */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ position: 'relative', width: 110, height: 110 }}>
          <div style={{ width: '100%', height: '100%', border: '3px solid #0ea5e9', borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 13, fontWeight: 800, color: '#0369a1' }}>P = 7 dm</div>
          {['top', 'right', 'bottom', 'left'].map((side) => {
            const pos = { top: { top: -11, left: '50%', transform: 'translateX(-50%)' }, right: { right: -16, top: '50%', transform: 'translateY(-50%)' }, bottom: { bottom: -11, left: '50%', transform: 'translateX(-50%)' }, left: { left: -16, top: '50%', transform: 'translateY(-50%)' } }[side];
            return <span key={side} style={{ position: 'absolute', ...pos, background: '#fff', ...S.mono, fontSize: 14, fontWeight: 800, color: '#7c3aed', padding: '0 3px' }}>?</span>;
          })}
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <FracInput num={num} den={den} setNum={setNum} setDen={setDen} disabled={isReview || checked} bd={bd} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
