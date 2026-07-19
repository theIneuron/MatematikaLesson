// Dars 2 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d02-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d02-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d02-pop { animation: d02pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-star { opacity: .35; animation: d02tw 3.2s ease-in-out infinite; }
        @keyframes d02tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d02-drop { animation: d02drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-float { animation: d02float 3s ease-in-out infinite; }
        @keyframes d02float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d02-pulse { animation: d02pulse 1.5s ease-in-out infinite; }
        @keyframes d02pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 47 kodida qaysi raqam o'nliklarni ko'rsatadi? Chapdagi (4) — index 0.
const D03_DIGITS = ['4', '7'];
const D03_CORRECT = 0;
const D03_T = {
  uz: {
    eyebrow: 'Qaysi raqam', setup: 'Ekranda 47 kodi. Har raqam bosiladi.',
    ask: '47 kodida qaysi raqam O‘NLIKLARni ko‘rsatadi? Shu raqamni bosing.',
    correct: "To'g'ri. 47 da chapdagi 4 — o'nliklar (40). O'ng 7 — birliklar.",
    wrong: "Maslahat: o'nlik har doim CHAPDA turadi. 47 = 4 o'nlik 7 birlik.",
    rule: "Ikki xonali sonda chap raqam — o'nlik, o'ng raqam — birlik.",
  },
  ru: {
    eyebrow: 'Какая цифра', setup: 'На экране код 47. Каждая цифра нажимается.',
    ask: 'Какая цифра в коде 47 показывает ДЕСЯТКИ? Нажми её.',
    correct: 'Верно. В 47 левая цифра 4 — десятки (40). Правая 7 — единицы.',
    wrong: 'Подсказка: десятки всегда СЛЕВА. 47 = 4 десятка 7 единиц.',
    rule: 'В двузначном числе левая цифра — десятки, правая — единицы.',
  },
};
function D02_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D03_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D03_DIGITS.map((d, i) => ({ id: String(i), label: d })), studentAnswer: { idx: picked }, correctAnswer: { idx: 0, label: '4' }, correct, meta: { tag: 'tap_digit', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cell = (i) => {
    const on = picked === i, show = checked && on;
    let bd = C.stageBd, bg = C.stile, col = i === 0 ? C.ten : C.one;
    if (on) { bd = C.acc; bg = 'rgba(255,79,40,.18)'; }
    if (show) { const ok = i === D03_CORRECT; bd = ok ? C.ok : C.no; bg = ok ? 'rgba(31,122,77,.2)' : 'rgba(192,57,43,.2)'; col = ok ? '#8ff0bd' : '#ffb4a8'; }
    return (
      <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)}
        style={{ width: 74, height: 92, borderRadius: 14, border: '3px solid ' + bd, background: bg, ...S.mono, fontSize: 52, fontWeight: 800, color: col, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{D03_DIGITS[i]}</button>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>{cell(0)}{cell(1)}</div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_03(props) {
  return (<><style>{FX_CSS}</style><D02_03Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D02_03.audio = {
  uz: { intro: "Ekranda 47 kodi. Har raqam bosiladi. 47 kodida qaysi raqam O'NLIKLARni ko'rsatadi? Shu raqamni bosing.", on_correct: "To'g'ri. 47 da chapdagi 4, o'nliklar 40. O'ng 7, birliklar.", on_wrong: "Maslahat. O'nlik har doim CHAPDA turadi. 47 teng 4 o'nlik 7 birlik." },
  ru: { intro: "На экране код 47. Каждая цифра нажимается. Какая цифра в коде 47 показывает ДЕСЯТКИ? Нажми её.", on_correct: "Верно. В 47 левая цифра 4, десятки 40. Правая 7, единицы.", on_wrong: "Подсказка. Десятки всегда СЛЕВА. 47 равно 4 десятка 7 единиц." },
};
