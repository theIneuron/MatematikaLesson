// Dars 3 · Amaliyot 08 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d03-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d03-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D08_TEN = 3, D08_ONE = 0;
const D08_T = {
  uz: {
    eyebrow: 'Abak', setup: 'Ikki sterjen: O‘NLIK va BIRLIK. Bosib donacha qo‘shiladi.',
    ask: 'Abakda 30 kodini yig‘ing.',
    ten: "O'NLIK", one: 'BIRLIK',
    correct: "To'g'ri. 30 = 3 o'nlik va 0 birlik. Birlik sterjeni bo'sh!",
    wrong: "Maslahat: 30 da 3 o'nlik bor, birlik esa YO'Q (0). Birlik sterjenini bo'sh qoldiring.",
    rule: "30 = 3 o'nlik 0 birlik. Nol — birlik yo'qligini bildiradi.",
  },
  ru: {
    eyebrow: 'Абак', setup: 'Два стержня: ДЕСЯТКИ и ЕДИНИЦЫ. Нажми — добавится бусина.',
    ask: 'Собери на абаке код 30.',
    ten: 'ДЕСЯТКИ', one: 'ЕДИНИЦЫ',
    correct: 'Верно. 30 = 3 десятка и 0 единиц. Стержень единиц пуст!',
    wrong: 'Подсказка: в 30 три десятка, а единиц НЕТ (0). Оставь стержень единиц пустым.',
    rule: '30 = 3 десятка 0 единиц. Ноль — значит единиц нет.',
  },
};
function D03_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.tens != null) { setTens(sa.tens); setOnes(sa.ones); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(!checked); }, [checked, onReady]);
  const num = tens * 10 + ones;
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = tens === D08_TEN && ones === D08_ONE;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { tens, ones, value: num }, correctAnswer: { value: 30 }, correct, meta: { tag: 'abacus', level: '🔴' } });
  }, [tens, ones, num, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rod = (count, set, color, label) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div onClick={() => { if (!locked && count < 9) set(count + 1); }}
        style={{ position: 'relative', width: 60, height: 170, cursor: locked || count >= 9 ? 'default' : 'pointer' }}>
        <div style={{ position: 'absolute', left: '50%', top: 6, bottom: 6, width: 4, transform: 'translateX(-50%)', background: C.stageBd, borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 6, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 3 }}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="d03-drop" style={{ width: 40, height: 15, borderRadius: 9, background: color, border: '1px solid rgba(0,0,0,.2)', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.18)' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button type="button" disabled={locked || count <= 0} onClick={() => set(Math.max(0, count - 1))} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: count <= 0 ? '#2a3a58' : C.stageBd, color: '#fff', fontSize: 16, fontWeight: 800, cursor: (locked || count <= 0) ? 'default' : 'pointer' }}>−</button>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: C.sink, minWidth: 18, textAlign: 'center' }}>{count}</span>
        <button type="button" disabled={locked || count >= 9} onClick={() => set(count + 1)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: count >= 9 ? '#2a3a58' : color, color: '#08111f', fontSize: 16, fontWeight: 800, cursor: (locked || count >= 9) ? 'default' : 'pointer' }}>+</button>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: '.06em' }}>{label}</div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
          {rod(tens, setTens, C.ten, t.ten)}
          {rod(ones, setOnes, C.one, t.one)}
        </div>
      </Stage>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_08(props) {
  return (<><style>{FX_CSS}</style><D03_08Impl {...props} /></>);
}
