// Dars 3 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

// razryad chip (kod/plitka)
const Chip = ({ children, on, tone, onClick, disabled, w = 62 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 52, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 21, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D07_PARTS = [80, 3, 8, 40, 20];
const D07_TARGET = 83;
const D07_T = {
  uz: {
    eyebrow: 'Kerakli qismlar', setup: 'Nishon kod — 83. Kerakli razryad qismlarini tanlang.',
    ask: 'Qaysi qismlarni birga olsak, 83 hosil bo‘ladi? Tanlang.',
    correct: "To'g'ri. 80 + 3 = 83. O'nliklar 80, birliklar 3.",
    wrong: "Maslahat: 83 = 80 (o'nliklar) + 3 (birliklar). Yig'indini 83 ga yetkazing.",
    rule: "83 = 80 + 3. Razryad qismlaridan son yig'iladi.",
  },
  ru: {
    eyebrow: 'Нужные части', setup: 'Целевой код — 83. Выбери нужные разрядные части.',
    ask: 'Какие части вместе дают 83? Отметь их.',
    correct: 'Верно. 80 + 3 = 83. Десятки 80, единицы 3.',
    wrong: 'Подсказка: 83 = 80 (десятки) + 3 (единицы). Доведи сумму до 83.',
    rule: '83 = 80 + 3. Число собирается из разрядных частей.',
  },
};
function D03_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const sum = sel.reduce((s, i) => s + D07_PARTS[i], 0);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);
  const toggle = (i) => { if (isReview || checked) return; setSel((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]); };
  const check = useCallback(() => {
    const correct = sum === D07_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_PARTS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { sel, sum }, correctAnswer: { value: D07_TARGET }, correct, meta: { tag: 'subsetsum', level: '🟡' } });
  }, [sum, sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const sumCol = checked ? (fb?.correct ? C.ok : C.no) : (sum === D07_TARGET ? C.ok : C.sink);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, letterSpacing: '.1em' }}>{lang === 'uz' ? 'NISHON' : 'ЦЕЛЬ'}</div>
            <div style={{ ...S.mono, fontSize: 40, fontWeight: 800, color: C.ten }}>83</div>
          </div>
          <div style={{ ...S.mono, fontSize: 22, color: C.sink2 }}>=</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, letterSpacing: '.1em' }}>{lang === 'uz' ? 'YIG‘INDI' : 'СУММА'}</div>
            <div style={{ ...S.mono, fontSize: 40, fontWeight: 800, color: sumCol }}>{sum}</div>
          </div>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D07_PARTS.map((n, i) => {
          const on = sel.includes(i);
          let tone = null;
          if (checked && on) tone = fb?.correct ? 'ok' : 'no';
          return <Chip key={i} on={on && !checked} tone={tone} disabled={isReview || checked} onClick={() => toggle(i)} w={64}>{n}</Chip>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_07(props) {
  return (<><style>{FX_CSS}</style><D03_07Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D03_07.audio = {
  uz: { intro: "Nishon kod, 83. Kerakli razryad qismlarini tanlang. Qaysi qismlarni birga olsak, 83 hosil bo'ladi? Tanlang.", on_correct: "To'g'ri. 80 qo'shish 3 teng 83. O'nliklar 80, birliklar 3.", on_wrong: "Maslahat. 83 teng 80 o'nliklar qo'shish 3 birliklar. Yig'indini 83 ga yetkazing." },
  ru: { intro: "Целевой код, 83. Выбери нужные разрядные части. Какие части вместе дают 83? Отметь их.", on_correct: "Верно. 80 плюс 3 равно 83. Десятки 80, единицы 3.", on_wrong: "Подсказка. 83 равно 80 десятки плюс 3 единицы. Доведи сумму до 83." },
};
