// Dars 20 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', ring: '#3A4A63',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d20-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d20-pop { animation: d20pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d20-star { opacity: .35; animation: d20tw 3.2s ease-in-out infinite; }
        @keyframes d20tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d20-drop { animation: d20drop .5s cubic-bezier(.34,1.56,.64,1) both, d20shine 3.4s ease-in-out infinite; }
        @keyframes d20drop { 0% { opacity: 0; transform: rotate(45deg) translateY(-6px) scale(.4); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d20shine { 0%, 100% { box-shadow: 0 0 5px rgba(255,194,60,.45); } 50% { box-shadow: 0 0 11px rgba(255,214,115,.95); } }
        .d20-float { animation: d20float 3s ease-in-out infinite; }
        @keyframes d20float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d20-pulse { animation: d20pulse 1.5s ease-in-out infinite; }
        @keyframes d20pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D03_CORRECT = 0;
const D03_T = {
  uz: {
    eyebrow: 'To‘g‘rimi?', setup: "Zuhra shunday dedi:", expr: '12 ÷ 3 = 4, chunki 3 × 4 = 12',
    ask: 'Zuhra to‘g‘ri aytdimi?',
    yes: 'Ha, to‘g‘ri', no: 'Yo‘q, xato',
    correct: "To'g'ri! 3 × 4 = 12 bo'lgani uchun 12 ÷ 3 = 4. Ular bir oila.",
    wrong: "Maslahat: ko'paytirish va bo'lish bir-birini tekshiradi. 3 × 4 = 12 → 12 ÷ 3 = 4.",
    rule: "Ko'paytmani bilsang, bo'lishni topasan: 3 × 4 = 12 → 12 ÷ 3 = 4.",
  },
  ru: {
    eyebrow: 'Верно ли?', setup: 'Зухра сказала так:', expr: '12 ÷ 3 = 4, потому что 3 × 4 = 12',
    ask: 'Зухра права?',
    yes: 'Да, верно', no: 'Нет, ошибка',
    correct: 'Верно! Так как 3 × 4 = 12, то 12 ÷ 3 = 4. Они одна семья.',
    wrong: 'Подсказка: умножение и деление проверяют друг друга. 3 × 4 = 12 → 12 ÷ 3 = 4.',
    rule: 'Знаешь произведение — найдёшь деление: 3 × 4 = 12 → 12 ÷ 3 = 4.',
  },
};
function D20_03Impl(props) {
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
    onSubmit?.({ questionText: t.expr + ' — ' + t.ask, options: [{ id: '0', label: t.yes }, { id: '1', label: t.no }], studentAnswer: { idx: picked }, correctAnswer: { idx: 0 }, correct, meta: { tag: 'family_tf', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (i, label) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = C.ink;
    if (on) { bg = C.accSoft; bd = C.acc; }
    if (show) { const ok = i === D03_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: 1, minHeight: 66, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 800, fontFamily: 'inherit', cursor: (isReview || checked) ? 'default' : 'pointer' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div className="d20-float" style={{ textAlign: 'center', ...S.mono, fontSize: 22, fontWeight: 800, color: C.gold, lineHeight: 1.5 }}>{t.expr}</div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>{btn(0, t.yes)}{btn(1, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D20_03(props) {
  return (<><style>{FX_CSS}</style><D20_03Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D20_03.audio = {
  uz: { intro: "Zuhra shunday dedi. Zuhra to'g'ri aytdimi?", on_correct: "To'g'ri! 3 ko'paytirish 4 teng 12 bo'lgani uchun 12 bo'lish 3 teng 4. Ular bir oila.", on_wrong: "Maslahat. Ko'paytirish va bo'lish bir-birini tekshiradi. 3 ko'paytirish 4 teng 12, 12 bo'lish 3 teng 4." },
  ru: { intro: "Зухра сказала так. Зухра права?", on_correct: "Верно! Так как 3 умножить на 4 равно 12, то 12 делить на 3 равно 4. Они одна семья.", on_wrong: "Подсказка. Умножение и деление проверяют друг друга. 3 умножить на 4 равно 12, 12 делить на 3 равно 4." },
};
