// Dars 8 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // MARS sahna (to'q qizg'ish)
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const DUST = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DUST.map((s, i) => <span key={i} className="d08-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
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
  <div className="d08-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d08-pop { animation: d08pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d08pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d08-star { opacity: .4; animation: d08tw 3.4s ease-in-out infinite; }
        @keyframes d08tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D07_OPTS = [
  { uz: '59 − 24 = 35', ru: '59 − 24 = 35', ok: true },
  { uz: '35 + 24 = 59', ru: '35 + 24 = 59', ok: true },
  { uz: '59 + 24 = 35', ru: '59 + 24 = 35', ok: false },
  { uz: '24 − 35 = 59', ru: '24 − 35 = 59', ok: false },
];
const D07_T = {
  uz: {
    eyebrow: 'Fakt oilasi', setup: 'Uch son bir oila: 59, 24, 35.',
    ask: 'Qaysi tengliklar TO‘G‘RI? Hammasini belgilang.',
    correct: "To'g'ri. 59 − 24 = 35 va 35 + 24 = 59 — bir oila.",
    wrong: "Maslahat: kattadan kichikni ayiramiz; ikki qismni qo‘shsak butun chiqadi. Har tenglikni tekshiring.",
    rule: "Bir oila: 59 − 24 = 35, 35 + 24 = 59, 59 − 35 = 24.",
  },
  ru: {
    eyebrow: 'Семья фактов', setup: 'Три числа — одна семья: 59, 24, 35.',
    ask: 'Какие равенства ВЕРНЫ? Отметь все.',
    correct: 'Верно. 59 − 24 = 35 и 35 + 24 = 59 — одна семья.',
    wrong: 'Подсказка: из большего вычитают меньшее; две части в сумме дают целое. Проверь каждое.',
    rule: 'Одна семья: 59 − 24 = 35, 35 + 24 = 59, 59 − 35 = 24.',
  },
};
function D08_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);
  const toggle = (i) => { if (isReview || checked) return; setSel((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]); };
  const check = useCallback(() => {
    const want = D07_OPTS.map((o, i) => o.ok ? i : -1).filter((x) => x >= 0);
    const correct = sel.length === want.length && want.every((i) => sel.includes(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_OPTS.map((o, i) => ({ id: String(i), label: o.uz })), studentAnswer: { sel }, correctAnswer: { sel: want }, correct, meta: { tag: 'factfamily', level: '🟡' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const box = (i) => {
    const on = sel.includes(i), o = D07_OPTS[i];
    let bd = C.line, bg = C.paper, col = C.ink;
    if (on) { bd = C.acc; bg = C.accSoft; }
    if (checked && on) { bd = o.ok ? C.ok : C.no; bg = o.ok ? C.okSoft : C.noSoft; col = o.ok ? C.ok : C.no; }
    return (
      <button key={i} type="button" disabled={isReview || checked} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 21, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9 }}>
        <span style={{ width: 24, height: 24, borderRadius: 7, border: '2px solid ' + (on ? bd : C.ink3), background: on ? bd : '#fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{on ? '✓' : ''}</span>
        {lang === 'uz' ? o.uz : o.ru}
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><div style={{ textAlign: 'center', ...S.mono, fontSize: 30, fontWeight: 800 }}><span style={{ color: C.mars }}>59</span> · <span style={{ color: C.one }}>24</span> · <span style={{ color: C.ten }}>35</span></div></Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      {D07_OPTS.map((_, i) => box(i))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D08_07(props) {
  return (<><style>{FX_CSS}</style><D08_07Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D08_07.audio = {
  uz: { intro: "Uch son bir oila. 59, 24, 35. Qaysi tengliklar TO'G'RI? Hammasini belgilang.", on_correct: "To'g'ri. 59 ayirish 24 teng 35 va 35 qo'shish 24 teng 59, bir oila.", on_wrong: "Maslahat. Kattadan kichikni ayiramiz; ikki qismni qo'shsak butun chiqadi. Har tenglikni tekshiring." },
  ru: { intro: "Три числа, одна семья. 59, 24, 35. Какие равенства ВЕРНЫ? Отметь все.", on_correct: "Верно. 59 минус 24 равно 35 и 35 плюс 24 равно 59, одна семья.", on_wrong: "Подсказка. Из большего вычитают меньшее; две части в сумме дают целое. Проверь каждое." },
};
