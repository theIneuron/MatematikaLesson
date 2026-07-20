// Dars 9 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {DUST.map((s, i) => <span key={i} className="d09-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
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
  <div className="d09-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d09-pop { animation: d09pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d09pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d09-star { opacity: .4; animation: d09tw 3.4s ease-in-out infinite; }
        @keyframes d09tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 37 + 25: A -> 52 (ko'chgan unutilgan), B -> 62 (to'g'ri). B ni tanla.
const D06_SOL = [
  { res: ['5', '2'], ok: false }, // 52
  { res: ['6', '2'], ok: true },  // 62
];
const D06_CORRECT = 1;
const D06_T = {
  uz: {
    eyebrow: "To‘g‘ri yechimni tanlang", setup: '37 + 25 uchun ikki tayyor yechim.',
    ask: 'Qaysi yechim TO‘G‘RI? Ko‘chgan o‘nlik hisobga olinganmi?',
    correct: "To'g'ri. 7 + 5 = 12 → 2 yozamiz, 1 ko‘chadi; 3 + 2 + 1 = 6. Javob 62.",
    wrong: "Maslahat: birliklar 7 + 5 o‘ndan oshadi. Ko‘chgan «1» o‘nliklarga qo‘shilganini tekshiring.",
    rule: "Ko‘chgan o‘nlik qo‘shilmasa, javob kam chiqadi. To‘g‘risi 62.",
  },
  ru: {
    eyebrow: 'Выбери верное решение', setup: 'Два готовых решения для 37 + 25.',
    ask: 'Какое решение ВЕРНО? Учтён ли перенесённый десяток?',
    correct: 'Верно. 7 + 5 = 12 → пишем 2, 1 переносим; 3 + 2 + 1 = 6. Ответ 62.',
    wrong: 'Подсказка: единицы 7 + 5 больше десяти. Проверь, прибавлена ли «1» к десяткам.',
    rule: 'Без перенесённого десятка ответ меньше. Верно — 62.',
  },
};
function D09_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D06_SOL.map((s, i) => ({ id: String(i), label: s.res.join('') })), studentAnswer: { idx: picked, label: picked != null ? D06_SOL[picked].res.join('') : null }, correctAnswer: { idx: 1, label: '62' }, correct, meta: { tag: 'pickright', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const card = (i) => {
    const on = picked === i, show = checked && on;
    let bd = C.stageBd, glow = 'none';
    if (on && !checked) { bd = C.acc; glow = '0 0 0 4px rgba(255,79,40,.25)'; }
    if (show) { const okv = i === D06_CORRECT; bd = okv ? C.ok : C.no; glow = '0 0 0 4px ' + (okv ? 'rgba(31,122,77,.3)' : 'rgba(192,57,43,.3)'); }
    const s = D06_SOL[i];
    return (
      <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ border: '2.5px solid ' + bd, borderRadius: 14, background: 'rgba(255,255,255,0.04)', padding: '12px 14px', cursor: (isReview || checked) ? 'default' : 'pointer', boxShadow: glow }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, marginBottom: 4, letterSpacing: '.06em' }}>{String.fromCharCode(65 + i)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '22px 30px 30px' }}>
          <span /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.ten, textAlign: 'center' }}>3</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.one, textAlign: 'center' }}>7</span>
          <span style={{ ...S.mono, fontSize: 20, color: C.sink2, textAlign: 'center' }}>+</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.ten, textAlign: 'center' }}>2</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.one, textAlign: 'center' }}>5</span>
        </div>
        <div style={{ height: 2, background: C.sink2, margin: '3px 0 3px 22px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '22px 30px 30px' }}>
          <span /><span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: C.sink, textAlign: 'center' }}>{s.res[0]}</span><span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: C.sink, textAlign: 'center' }}>{s.res[1]}</span>
        </div>
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>{card(0)}{card(1)}</div></Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D09_06(props) {
  return (<><style>{FX_CSS}</style><D09_06Impl {...props} /></>);
}
