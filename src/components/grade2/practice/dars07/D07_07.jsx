// Dars 7 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c', boxBd: '#8ba0c8',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d07-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d07-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// --- stolbik yordamchilari (to'q fonda OCHIQ ko'rinadi) ---
const DC = ({ ch, c, dim }) => <div style={{ width: 44, height: 50, ...S.mono, fontSize: 32, fontWeight: 800, color: c, opacity: dim ? 0.45 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</div>;

const Colon = ({ children }) => (
  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.03)', border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '10px 16px' }}>{children}</div>
);

const Row = ({ sign, tenNode, oneNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', alignItems: 'center' }}>
    <span style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: C.sink2, textAlign: 'center' }}>{sign || ''}</span>
    {tenNode}{oneNode}
  </div>
);

const HR = () => <div style={{ height: 3, background: C.sink2, borderRadius: 2, margin: '5px 0', marginLeft: 30 }} />;

const FX_CSS = `.d07-pop { animation: d07pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d07pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d07-star { opacity: .35; animation: d07tw 3.2s ease-in-out infinite; }
        @keyframes d07tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 43 + 5: to'g'ri — 5 birlik ustunida. Variantlar A/B/C.
const D07_CORRECT = 0;
const D07_T = {
  uz: {
    eyebrow: 'To‘g‘ri tuzilma', setup: '43 + 5 ni stolbik qilamiz. 5 — bir xonali son.',
    ask: 'Qaysi stolbik TO‘G‘RI tuzilgan? (birlik ostiga birlik)',
    correct: "To'g'ri. 5 — birlik, shuning uchun 3 ning ostiga (birlik ustuniga) yoziladi.",
    wrong: "Maslahat: 5 — birlik raqami. U birlik ustuniga, ya'ni 3 ning ostiga tushishi kerak.",
    rule: "Bir xonali son birlik ustuniga yoziladi: 43 + 5, 5 birlik ostida.",
  },
  ru: {
    eyebrow: 'Верная запись', setup: '43 + 5 записываем столбиком. 5 — однозначное число.',
    ask: 'Какой столбик записан ВЕРНО? (единицы под единицы)',
    correct: 'Верно. 5 — единицы, поэтому пишется под 3 (в столбец единиц).',
    wrong: 'Подсказка: 5 — цифра единиц. Она должна попасть в столбец единиц, под 3.',
    rule: 'Однозначное число пишут в столбец единиц: 43 + 5, 5 под единицами.',
  },
};
function D07_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: ['A', 'B'].map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: 0 }, correct, meta: { tag: 'alignpick', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // variant A: 5 birlik ustunida (to'g'ri). variant B: 5 o'nlik ustunida (xato).
  const mini = (fiveInOnes) => (
    <Colon>
      <Row sign="" tenNode={<DC ch="4" c={C.ten} />} oneNode={<DC ch="3" c={C.one} />} />
      <Row sign="+" tenNode={fiveInOnes ? <DC ch="" c={C.ten} /> : <DC ch="5" c={C.ten} />} oneNode={fiveInOnes ? <DC ch="5" c={C.one} /> : <DC ch="" c={C.one} />} />
      <HR />
      <Row sign="" tenNode={<DC ch="?" c={C.sink2} />} oneNode={<DC ch="?" c={C.sink2} />} />
    </Colon>
  );
  const opt = (i, node, labelTxt) => {
    const on = picked === i, show = checked && on;
    let bd = C.stageBd, bg = C.stile;
    if (on && !checked) bd = C.acc;
    if (show) { const okv = i === D07_CORRECT; bd = okv ? C.ok : C.no; bg = okv ? 'rgba(31,122,77,.15)' : 'rgba(192,57,43,.15)'; }
    return (
      <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: '3px solid ' + bd, background: bg, borderRadius: 14, padding: '10px 8px', cursor: (isReview || checked) ? 'default' : 'pointer' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: C.sink2 }}>{labelTxt}</span>{node}
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {opt(0, mini(true), 'A')}
          {opt(1, mini(false), 'B')}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_07(props) {
  return (<><style>{FX_CSS}</style><D07_07Impl {...props} /></>);
}
