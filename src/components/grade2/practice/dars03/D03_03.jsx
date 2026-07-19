// Dars 3 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

// 47: pos0=4 (o'nlik), pos1=7 (birlik). Yorliqlar: 'ten' / 'one'.
const D03_T = {
  uz: {
    eyebrow: 'Yorliq joylash', setup: 'Kod 47. Ikki yorliq: «o‘nlik» va «birlik».',
    ask: 'Yorliqni bosing, keyin uni to‘g‘ri raqam ostiga qo‘ying.',
    ten: "o'nlik", one: 'birlik',
    correct: "To'g'ri. 47 da chapdagi 4 — o'nlik, o'ngdagi 7 — birlik.",
    wrong: "Maslahat: o'nlik har doim CHAPDA (4), birlik O'NGDA (7).",
    rule: "Chap raqam — o'nlik, o'ng raqam — birlik.",
  },
  ru: {
    eyebrow: 'Поставь метку', setup: 'Код 47. Две метки: «десятки» и «единицы».',
    ask: 'Нажми метку, затем поставь её под нужную цифру.',
    ten: 'десятки', one: 'единицы',
    correct: 'Верно. В 47 левая 4 — десятки, правая 7 — единицы.',
    wrong: 'Подсказка: десятки всегда СЛЕВА (4), единицы СПРАВА (7).',
    rule: 'Левая цифра — десятки, правая — единицы.',
  },
};
function D03_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]); // pos0, pos1 -> 'ten'|'one'
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedTen = slots.includes('ten'), usedOne = slots.includes('one');
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.map((v) => v === pick ? null : v); n[i] = pick; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots[0] === 'ten' && slots[1] === 'one';
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { slots: ['ten', 'one'] }, correct, meta: { tag: 'labelplace', level: '🟢' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const digit = (i, d, col) => {
    const lbl = slots[i];
    let bd = C.stageBd;
    if (lbl != null) bd = C.acc;
    if (checked) { const ok = (i === 0 && lbl === 'ten') || (i === 1 && lbl === 'one'); bd = ok ? C.ok : C.no; }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 70, height: 88, borderRadius: 14, border: '3px solid ' + C.stageBd, background: C.stile, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 50, fontWeight: 800, color: col }}>{d}</div>
        <div onClick={clickSlot(i)} style={{ width: 78, height: 40, borderRadius: 10, border: '2px ' + (lbl ? 'solid' : 'dashed') + ' ' + bd, background: lbl ? C.stile : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: lbl === 'ten' ? C.ten : lbl === 'one' ? C.one : C.sink2, cursor: locked ? 'default' : 'pointer' }}>{lbl ? (lbl === 'ten' ? t.ten : t.one) : '⬇'}</div>
      </div>
    );
  };
  const labelBtn = (key, txt, used, col) => {
    if (used) return null;
    const on = pick === key;
    return <button type="button" disabled={locked} onClick={() => setPick(on ? null : key)} style={{ padding: '10px 18px', borderRadius: 999, border: '2px solid ' + (on ? C.acc : col), background: on ? C.accSoft : '#fff', color: on ? C.ink : col, fontSize: 15, fontWeight: 800, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{txt}</button>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>{digit(0, '4', C.ten)}{digit(1, '7', C.one)}</div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {labelBtn('ten', t.ten, usedTen, '#B4770A')}
        {labelBtn('one', t.one, usedOne, C.oneDk)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_03(props) {
  return (<><style>{FX_CSS}</style><D03_03Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D03_03.audio = {
  uz: { intro: "Kod 47. Ikki yorliq. O'nlik va birlik. Yorliqni bosing, keyin uni to'g'ri raqam ostiga qo'ying.", on_correct: "To'g'ri. 47 da chapdagi 4, o'nlik, o'ngdagi 7, birlik.", on_wrong: "Maslahat. O'nlik har doim CHAPDA 4, birlik O'NGDA 7." },
  ru: { intro: "Код 47. Две метки. Десятки и единицы. Нажми метку, затем поставь её под нужную цифру.", on_correct: "Верно. В 47 левая 4, десятки, правая 7, единицы.", on_wrong: "Подсказка. Десятки всегда СЛЕВА 4, единицы СПРАВА 7." },
};
