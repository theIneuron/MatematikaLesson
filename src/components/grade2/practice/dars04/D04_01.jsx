// Dars 4 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d04-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d04-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d04-pop { animation: d04pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d04pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d04-star { opacity: .35; animation: d04tw 3.2s ease-in-out infinite; }
        @keyframes d04tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d04-float { animation: d04float 3.4s ease-in-out infinite; }
        @keyframes d04float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D01_SIGNS = ['>', '<', '='];
const D01_CORRECT = 1; // '<'
const D01_T = {
  uz: {
    eyebrow: 'Belgi qo‘ying', setup: 'Ikki kodni taqqoslaymiz: 45 va 54.',
    ask: 'Kodlar orasiga to‘g‘ri belgini qo‘ying.',
    correct: "To'g'ri. 45 < 54. O'nliklar: 4 < 5, shuning uchun 45 kichik.",
    wrong: "Maslahat: avval o'nlikka qarang. 45 da 4 o'nlik, 54 da 5 o'nlik. Belgi kattaga qaraydi.",
    rule: "Avval o'nlikni taqqoslang. Belgining ochiq tomoni katta songa qaraydi.",
  },
  ru: {
    eyebrow: 'Поставь знак', setup: 'Сравниваем два кода: 45 и 54.',
    ask: 'Поставь правильный знак между кодами.',
    correct: 'Верно. 45 < 54. Десятки: 4 < 5, значит 45 меньше.',
    wrong: 'Подсказка: сначала смотри на десятки. В 45 — 4 десятка, в 54 — 5. Знак смотрит на большее.',
    rule: 'Сначала сравни десятки. Открытая сторона знака — к большему числу.',
  },
};
function D04_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D01_SIGNS.map((s, i) => ({ id: String(i), label: s })), studentAnswer: { idx: picked, label: D01_SIGNS[picked] }, correctAnswer: { idx: 1, label: '<' }, correct, meta: { tag: 'signpick', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const signBtn = (i) => {
    const on = picked === i, show = checked && on;
    let bd = C.stageBd, bg = C.stile, col = C.sink;
    if (on) { bd = C.acc; bg = 'rgba(255,79,40,.16)'; col = '#fff'; }
    if (show) { const ok = i === D01_CORRECT; bd = ok ? C.ok : C.no; bg = ok ? 'rgba(31,122,77,.22)' : 'rgba(192,57,43,.22)'; col = ok ? '#8ff0bd' : '#ffb4a8'; }
    return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ width: 78, height: 78, borderRadius: 16, border: '3px solid ' + bd, background: bg, ...S.mono, fontSize: 40, fontWeight: 800, color: col, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{D01_SIGNS[i]}</button>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, ...S.mono, fontWeight: 800 }}>
          <span style={{ fontSize: 52, color: C.ten }}>45</span>
          <span style={{ width: 60, height: 60, borderRadius: 12, border: '2px dashed ' + (picked != null ? C.acc : C.sink2), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, color: picked != null ? C.sink : C.sink2, background: C.stile }}>{picked != null ? D01_SIGNS[picked] : '?'}</span>
          <span style={{ fontSize: 52, color: C.one }}>54</span>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>{D01_SIGNS.map((_, i) => signBtn(i))}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_01(props) {
  return (<><style>{FX_CSS}</style><D04_01Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D04_01.audio = {
  uz: { intro: "Ikki kodni taqqoslaymiz. 45 va 54. Kodlar orasiga to'g'ri belgini qo'ying.", on_correct: "To'g'ri. 45 kichik 54. O'nliklar. 4 kichik 5, shuning uchun 45 kichik.", on_wrong: "Maslahat. Avval o'nlikka qarang. 45 da 4 o'nlik, 54 da 5 o'nlik. Belgi kattaga qaraydi." },
  ru: { intro: "Сравниваем два кода. 45 и 54. Поставь правильный знак между кодами.", on_correct: "Верно. 45 меньше 54. Десятки. 4 меньше 5, значит 45 меньше.", on_wrong: "Подсказка. Сначала смотри на десятки. В 45, 4 десятка, в 54, 5. Знак смотрит на большее." },
};
