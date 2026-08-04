// Dars 2 (3-sinf) · Amaliyot 05 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 15-bet kombinatorika mashqidagi 904 soni (9, 0, 4 raqamlari).
// Tuzoq: «to'qqiz yuz to'rt» da o'nlik aytilmaydi — 0 ni tushirib 94 deb yozish xatosi.
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
      {STARS.map((s, i) => <span key={i} className="g3d2-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const WordCard = ({ text }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ padding: '14px 24px', borderRadius: 14, background: '#FFFFFF', border: '1.5px solid ' + C.ribbonBd, boxShadow: 'inset 0 0 18px rgba(20,90,134,.12)', maxWidth: 420, textAlign: 'center' }}>
      <span style={{ fontSize: 24, fontWeight: 800, color: C.glow, textShadow: '0 0 12px rgba(20,90,134,.16)', letterSpacing: '.02em' }}>{text}</span>
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
  <div className="g3d2-pop g3-custom-feedback" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d2-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const NumPad = LessonNumPad;

const FX_CSS = `.g3d2-pop { animation: g3d2pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d2pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d2-star { opacity: .3; animation: g3d2tw 3.4s ease-in-out infinite; }
@keyframes g3d2tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 05 · Nol bilan yozing (904) · 🟡 · write_zero =================== */
const D05_ANS = '904';
const D05_T = {
  uz: {
    eyebrow: 'Nol bilan yozing', setup: "Displey sonni so'z bilan ko'rsatdi. Diqqat: o'nliklar aytilmagan!",
    ask: "«To'qqiz yuz to'rt» sonini raqam-plitada tering.",
    word: "to'qqiz yuz to'rt",
    correct: "To'g'ri! To'qqiz yuz to'rt = 904: 9 yuzlik, 0 o'nlik, 4 birlik.",
    wrong: "Maslahat: to'qqiz yuz — bu 9 yuzlik, to'rt — 4 birlik. O'nlik aytilmadi — o'sha razryadga nima yozilishini o'ylang.",
    rule: "Aytilmagan razryad o'rniga 0 yoziladi: to'qqiz yuz to'rt = 904, 94 emas.",
  },
  ru: {
    eyebrow: 'Запиши с нулём', setup: 'Дисплей показал число словами. Внимание: десятки не названы!',
    ask: 'Набери число «девятьсот четыре» на панели.',
    word: 'девятьсот четыре',
    correct: 'Верно! Девятьсот четыре = 904: 9 сотен, 0 десятков, 4 единицы.',
    wrong: 'Подсказка: девятьсот — это 9 сотен, четыре — 4 единицы. Десятки не названы — подумай, что пишется в этом разряде.',
    rule: 'Вместо неназванного разряда пишется 0: девятьсот четыре = 904, а не 94.',
  },
};
function D02_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [value, setValue] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setValue(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(value.length > 0 && !checked); }, [value, checked, onReady]);
  const check = useCallback(() => {
    const correct = value === D05_ANS;
    setFb({ correct }); setChecked(false); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value }, correctAnswer: { value: D05_ANS }, correct, feedbackText: correct ? t.correct : t.wrong, explanationText: correct ? t.correct : t.wrong, ruleText: t.rule || '', meta: { tag: 'write_zero', level: '🟡' } });
  }, [value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><WordCard text={t.word} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <NumPad value={value} setValue={setValue} disabled={locked} max={3} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_05(props) {
  return (<><style>{FX_CSS}</style><D02_05Impl {...props} /></>);
}
