// Dars 9 (3-sinf) · Amaliyot 09 — mustaqil topshiriq fayli (grade5 dars04 formati).
// Manba: darslik 12-bet 2-mashq — 2 · 9 · 3 (guruhlash o'zi ko'rinmaydigan holat).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import LessonNumPad from '../../LessonNumPad';

/* ============================== SHARED (Lumo — Bit shahri) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'linear-gradient(145deg, #F7FBFF 0%, #EEF6FF 55%, #FFF8E8 100%)',
  stageBd: '#C7DDF2', sink: '#243447', sink2: '#557087', stile: '#E3F0FB',
  glow: '#145A86', glowDk: '#0E4A70', ribbon: '#FFFFFF', ribbonBd: '#B9D0E3',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="g3d3-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const Neon = ({ text, size = 32 }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ padding: '10px 22px', borderRadius: 14, background: '#FFFFFF', border: '1.5px solid ' + C.ribbonBd, boxShadow: 'inset 0 0 18px rgba(20,90,134,.12)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: size, fontWeight: 800, letterSpacing: 3, color: C.glow, textShadow: '0 0 12px rgba(20,90,134,.18)' }}>{text}</span>
    </div>
  </div>
);
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 17, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 18.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="g3d3-pop g3-custom-feedback" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const NumPad = LessonNumPad;

const FX_CSS = `.g3d3-pop { animation: g3d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d3-star { opacity: .3; animation: g3d3tw 3.4s ease-in-out infinite; }
@keyframes g3d3tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 09 · Qulay usul (2 × 9 × 3) · 🔴 · qulay_mul2 =================== */
const D02_ANS = '54';
const D02_T = {
  uz: {
    eyebrow: "O'zing tanla", setup: "Yana uchta ko'paytuvchi. Bu safar qulay juftlikni o'zingiz tanlang.",
    ask: "2 × 9 × 3 = ? Hisoblab tering.",
    expr: '2 × 9 × 3',
    correct: "To'g'ri! Masalan: 2 × 3 = 6, keyin 9 × 6 = 54. Yoki 2 × 9 = 18, 18 × 3 = 54 — natija bir xil.",
    wrong: "Maslahat: kichik juftlikdan boshlang: 2 × 3 = 6. Endi 9 × 6 — jadvaldagi fakt!",
    rule: "Qanday guruhlasak ham natija bir: 2 × 9 × 3 = 9 × (2 × 3) = 54.",
  },
  ru: {
    eyebrow: 'Выбери сам', setup: 'Снова три множителя. На этот раз удобную пару выбери сам.',
    ask: '2 × 9 × 3 = ? Сосчитай и набери.',
    expr: '2 × 9 × 3',
    correct: 'Верно! Например: 2 × 3 = 6, потом 9 × 6 = 54. Или 2 × 9 = 18, 18 × 3 = 54 — итог одинаковый.',
    wrong: 'Подсказка: начни с маленькой пары: 2 × 3 = 6. Теперь 9 × 6 — факт из таблицы!',
    rule: 'Как ни группируй, итог один: 2 × 9 × 3 = 9 × (2 × 3) = 54.',
  },
};
function D10_09Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [value, setValue] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setValue(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(value.length > 0 && !checked); }, [value, checked, onReady]);
  const check = useCallback(() => {
    const correct = value === D02_ANS;
    setFb({ correct }); setChecked(false); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value }, correctAnswer: { value: D02_ANS }, correct, feedbackText: correct ? t.correct : t.wrong, explanationText: correct ? t.correct : t.wrong, ruleText: t.rule || '', meta: { tag: 'qulay_mul2', level: '🔴' } });
  }, [value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><Neon text={t.expr} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <NumPad value={value} setValue={setValue} disabled={locked} max={2} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D10_09(props) {
  return (<><style>{FX_CSS}</style><D10_09Impl {...props} /></>);
}
