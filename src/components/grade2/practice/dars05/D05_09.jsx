// Dars 5 · Amaliyot 09 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d05-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 23.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d05-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d05-pop { animation: d05pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d05pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d05-star { opacity: .35; animation: d05tw 3.2s ease-in-out infinite; }
        @keyframes d05tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D09_TARGET_SEG = 4; // 4 x 10 = 40
const D09_T = {
  uz: {
    eyebrow: 'Quvvat ustuni', setup: 'Ustunda 10 segment, har biri 10 quvvat.',
    ask: 'Segmentlarni bosib, o‘nlab to‘ldiring. 40 quvvatga yeting.',
    correct: "To'g'ri. 10 + 10 + 10 + 10 = 40. To'rt segment.",
    wrong: "Maslahat: har segment 10 quvvat. 40 uchun nechta segment kerak?",
    rule: "O'nlab to'ldirish: 4 segment × 10 = 40.",
  },
  ru: {
    eyebrow: 'Столб заряда', setup: 'В столбе 10 сегментов, каждый по 10 заряда.',
    ask: 'Нажимай сегменты, заполняй десятками. Дойди до 40 заряда.',
    correct: 'Верно. 10 + 10 + 10 + 10 = 40. Четыре сегмента.',
    wrong: 'Подсказка: каждый сегмент — 10 заряда. Сколько сегментов для 40?',
    rule: 'Заполнение десятками: 4 сегмента × 10 = 40.',
  },
};
function D05_09Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [filled, setFilled] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.filled != null) { setFilled(sa.filled); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(filled > 0 && !checked); }, [filled, checked, onReady]);
  const locked = isReview || checked;
  const value = filled * 10;
  const check = useCallback(() => {
    const correct = filled === D09_TARGET_SEG;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { filled, value }, correctAnswer: { value: 40 }, correct, meta: { tag: 'segbar', level: '🔴' } });
  }, [filled, value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const valCol = checked ? (fb?.correct ? C.ok : C.no) : C.one;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4 }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const isFilled = i < filled;
              const isTarget = i < D09_TARGET_SEG;
              const bg = isFilled ? (checked ? (fb?.correct ? C.ok : C.no) : C.one) : C.stile;
              return <button key={i} type="button" disabled={locked} onClick={() => setFilled(i + 1)} style={{ width: 80, height: 20, borderRadius: 5, border: '1.5px solid ' + (isFilled ? bg : C.stageBd), background: bg, cursor: locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6, fontSize: 9, fontWeight: 800, color: isFilled ? '#08111f' : C.sink2 }}>{(i + 1) * 10}</button>;
            })}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, letterSpacing: '.06em' }}>{lang === 'uz' ? 'QUVVAT' : 'ЗАРЯД'}</div>
            <div style={{ ...S.mono, fontSize: 40, fontWeight: 800, color: valCol }}>{value}</div>
          </div>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_09(props) {
  return (<><style>{FX_CSS}</style><D05_09Impl {...props} /></>);
}
