// Dars 3 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D01_OPTS = [
  { uz: '50 + 6', ru: '50 + 6', ok: true },
  { uz: "5 o'nlik 6 birlik", ru: '5 десятков 6 единиц', ok: true },
  { uz: '60 + 5', ru: '60 + 5', ok: false },
  { uz: '5 + 6', ru: '5 + 6', ok: false },
  { uz: '65', ru: '65', ok: false },
];
const D01_T = {
  uz: {
    eyebrow: 'Ko‘p tanlov', setup: 'Bir necha yozuv bir xil kodni bildirishi mumkin.',
    ask: "Qaysi yozuvlar 56 ga teng? 2 tasini belgilang.",
    correct: "To'g'ri. 56 = 50 + 6 = 5 o'nlik 6 birlik. Ikkalasi ham to'g'ri.",
    wrong: "Maslahat: 56 = 5 o'nlik va 6 birlik. 60+5 va 65 — o'rin almashgan, 5+6 — qo'shish.",
    rule: "56 = 50 + 6 = 5 o'nlik 6 birlik. Bir son — bir necha razryad yozuvi.",
  },
  ru: {
    eyebrow: 'Мультивыбор', setup: 'Несколько записей могут означать один код.',
    ask: 'Какие записи равны 56? Отметьте 2.',
    correct: 'Верно. 56 = 50 + 6 = 5 десятков 6 единиц. Обе верны.',
    wrong: 'Подсказка: 56 = 5 десятков и 6 единиц. 60+5 и 65 — перестановка, 5+6 — сложение.',
    rule: '56 = 50 + 6 = 5 десятков 6 единиц. Одно число — разные записи разрядов.',
  },
};
function D03_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);
  const toggle = (i) => { if (isReview || checked) return; setSel((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]); };
  const check = useCallback(() => {
    const want = D01_OPTS.map((o, i) => o.ok ? i : -1).filter((x) => x >= 0);
    const correct = sel.length === want.length && want.every((i) => sel.includes(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D01_OPTS.map((o, i) => ({ id: String(i), label: o.uz })), studentAnswer: { sel }, correctAnswer: { sel: want }, correct, meta: { tag: 'multiselect', level: '🟢' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const box = (i) => {
    const on = sel.includes(i), o = D01_OPTS[i];
    let bd = C.line, bg = C.paper, col = C.ink;
    if (on) { bd = C.acc; bg = C.accSoft; }
    if (checked && on) { bd = o.ok ? C.ok : C.no; bg = o.ok ? C.okSoft : C.noSoft; col = o.ok ? C.ok : C.no; }
    return (
      <button key={i} type="button" disabled={isReview || checked} onClick={() => toggle(i)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 20, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9 }}>
        <span style={{ width: 24, height: 24, borderRadius: 7, border: '2px solid ' + (on ? bd : C.ink3), background: on ? bd : '#fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{on ? '✓' : ''}</span>
        {lang === 'uz' ? o.uz : o.ru}
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><div style={{ textAlign: 'center', ...S.mono, fontSize: 46, fontWeight: 800, color: C.ten }}>56</div></Stage>
      <p style={S.ask}>{t.ask}</p>
      {D01_OPTS.map((_, i) => box(i))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_01(props) {
  return (<><style>{FX_CSS}</style><D03_01Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D03_01.audio = {
  uz: { intro: "Bir necha yozuv bir xil kodni bildirishi mumkin. Qaysi yozuvlar 56 ga teng? 2 tasini belgilang.", on_correct: "To'g'ri. 56 teng 50 qo'shish 6 teng 5 o'nlik 6 birlik. Ikkalasi ham to'g'ri.", on_wrong: "Maslahat. 56 teng 5 o'nlik va 6 birlik. 60 qo'shish 5 va 65, o'rin almashgan, 5 qo'shish 6, qo'shish." },
  ru: { intro: "Несколько записей могут означать один код. Какие записи равны 56? Отметьте 2.", on_correct: "Верно. 56 равно 50 плюс 6 равно 5 десятков 6 единиц. Обе верны.", on_wrong: "Подсказка. 56 равно 5 десятков и 6 единиц. 60 плюс 5 и 65, перестановка, 5 плюс 6, сложение." },
};
