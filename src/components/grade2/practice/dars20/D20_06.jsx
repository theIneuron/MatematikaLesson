// Dars 20 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const Crystal = ({ s = 15, delay = 0 }) => (
  <span className="d20-drop" style={{ width: s, height: s, background: 'linear-gradient(160deg,#FFE79E,#FFB524)', display: 'inline-block', transform: 'rotate(45deg)', borderRadius: 3, boxShadow: '0 0 7px rgba(255,194,60,.55)', animationDelay: delay + 's' }} />
);

function CrystalArray({ r, c, s = 15 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + c + ', ' + s + 'px)', gap: 7, justifyContent: 'center', padding: 6 }}>
      {Array.from({ length: r * c }).map((_, i) => <Crystal key={i} s={s} delay={i * 0.03} />)}
    </div>
  );
}

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

const D06_CARDS = ['3 × 4', '4 × 3', '12 ÷ 3', '12 ÷ 4', '12 ÷ 5', '3 × 5'];
const D06_RIGHT = [true, true, true, true, false, false];
const D06_T = {
  uz: {
    eyebrow: 'Oilani yig‘', setup: "3 va 4 dan 12 hosil bo'ldi. Shu oilaning 4 a'zosini yig'ing.",
    ask: 'Oilaga tegishli 4 kartani belgilang (bosib tanlang):',
    correct: "To'g'ri. Oila: 3 × 4, 4 × 3, 12 ÷ 3, 12 ÷ 4. Bir massiv — bitta oila.",
    wrong: "Maslahat: oila 3, 4 va 12 dan tuziladi. 12 ÷ 5 va 3 × 5 — boshqa oiladan.",
    rule: "Bir oila: 3×4, 4×3, 12÷3, 12÷4. Hammasi 3, 4, 12 dan.",
  },
  ru: {
    eyebrow: 'Собери семью', setup: 'Из 3 и 4 получилось 12. Собери 4 члена этой семьи.',
    ask: 'Отметь 4 карточки этой семьи (нажми, чтобы выбрать):',
    correct: 'Верно. Семья: 3 × 4, 4 × 3, 12 ÷ 3, 12 ÷ 4. Один массив — одна семья.',
    wrong: 'Подсказка: семья из 3, 4 и 12. 12 ÷ 5 и 3 × 5 — из другой семьи.',
    rule: 'Одна семья: 3×4, 4×3, 12÷3, 12÷4. Всё из 3, 4, 12.',
  },
};
function D20_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([false, false, false, false, false, false]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const count = sel.filter(Boolean).length;
  useEffect(() => { onReady?.(count === 4 && !checked); }, [count, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (i) => { if (locked) return; setSel((s) => { const n = s.slice(); n[i] = !n[i]; return n; }); };
  const check = useCallback(() => {
    const correct = sel.every((v, i) => v === D06_RIGHT[i]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D06_CARDS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { sel }, correctAnswer: { right: D06_RIGHT }, correct, meta: { tag: 'assemble_family', level: '🟡' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><CrystalArray r={3} c={4} s={14} /></Stage>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {D06_CARDS.map((cstr, i) => {
          const on = sel[i];
          let bg = C.paper, bd = C.line, col = C.ink;
          if (on) { bg = C.accSoft; bd = C.acc; }
          if (checked) { const good = D06_RIGHT[i]; if (on && good) { bg = C.okSoft; bd = C.ok; col = C.ok; } else if (on && !good) { bg = C.noSoft; bd = C.no; col = C.no; } else if (!on && good) { bd = C.ok; col = C.ok; } }
          return <button key={i} type="button" disabled={locked} onClick={() => toggle(i)} style={{ minHeight: 62, borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 21, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>{cstr}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D20_06(props) {
  return (<><style>{FX_CSS}</style><D20_06Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D20_06.audio = {
  uz: { intro: "3 va 4 dan 12 hosil bo'ldi. Shu oilaning 4 a'zosini yig'ing. Oilaga tegishli 4 kartani belgilang bosib tanlang.", on_correct: "To'g'ri. Oila. 3 ko'paytirish 4, 4 ko'paytirish 3, 12 bo'lish 3, 12 bo'lish 4. Bir massiv, bitta oila.", on_wrong: "Maslahat. Oila 3, 4 va 12 dan tuziladi. 12 bo'lish 5 va 3 ko'paytirish 5, boshqa oiladan." },
  ru: { intro: "Из 3 и 4 получилось 12. Собери 4 члена этой семьи. Отметь 4 карточки этой семьи нажми, чтобы выбрать.", on_correct: "Верно. Семья. 3 умножить на 4, 4 умножить на 3, 12 делить на 3, 12 делить на 4. Один массив, одна семья.", on_wrong: "Подсказка. Семья из 3, 4 и 12. 12 делить на 5 и 3 умножить на 5, из другой семьи." },
};
