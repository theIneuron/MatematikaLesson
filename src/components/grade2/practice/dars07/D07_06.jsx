// Dars 7 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const boxTone = (tone) => {
  if (tone === 'sel') return { bd: C.acc, bg: 'rgba(255,79,40,.18)', col: '#fff' };
  if (tone === 'ok') return { bd: C.ok, bg: 'rgba(31,122,77,.28)', col: '#8ff0bd' };
  if (tone === 'no') return { bd: C.no, bg: 'rgba(192,57,43,.28)', col: '#ffb4a8' };
  return { bd: C.boxBd, bg: C.stile, col: C.sink };
};

const BoxCell = ({ ch, tone, onClick, disabled }) => {
  const s = boxTone(tone);
  const st = { width: 44, height: 50, borderRadius: 10, border: '2.5px solid ' + s.bd, background: s.bg, ...S.mono, fontSize: 32, fontWeight: 800, color: s.col, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onClick && !disabled ? 'pointer' : 'default' };
  return onClick ? <button type="button" disabled={disabled} onClick={onClick} style={st}>{ch}</button> : <div style={st}>{ch}</div>;
};

// stolbik ramkasi: gridTemplateColumns: belgi | o'nlik | birlik
const ColHeader = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', columnGap: 0, marginBottom: 4 }}>
    <span /><div style={{ fontSize: 10, fontWeight: 800, color: C.ten, textAlign: 'center', letterSpacing: '.04em' }}>O‘N</div><div style={{ fontSize: 10, fontWeight: 800, color: C.one, textAlign: 'center', letterSpacing: '.04em' }}>BIR</div>
  </div>
);

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

// 45 + 32 = 78 (noto'g'ri). To'g'ri: 77. Birlik katagi (8) xato. correct = tap 'ones' box.
const D06_T = {
  uz: {
    eyebrow: 'Xato ustun', setup: 'Tayyor stolbik: 45 + 32 = 78. Bitta ustun natijasi noto‘g‘ri.',
    ask: 'Yechimda xato bor. Noto‘g‘ri javob katagini bosing.',
    correct: "To'g'ri. Birliklar ustuni xato: 5 + 2 = 7, 8 emas. To‘g‘ri javob — 77.",
    wrong: "Maslahat: har ustunni alohida tekshiring. 5 + 2 nechchi? 4 + 3 nechchi?",
    rule: "Har ustunni tekshiring: 5 + 2 = 7 (8 emas). To‘g‘ri javob 77.",
  },
  ru: {
    eyebrow: 'Ошибочный столбец', setup: 'Готовый столбик: 45 + 32 = 78. Один столбец неверный.',
    ask: 'В решении ошибка. Нажми на неверную клетку ответа.',
    correct: 'Верно. Столбец единиц неверный: 5 + 2 = 7, а не 8. Верный ответ — 77.',
    wrong: 'Подсказка: проверь каждый столбец отдельно. Сколько 5 + 2? Сколько 4 + 3?',
    rule: 'Проверь каждый столбец: 5 + 2 = 7 (не 8). Верный ответ 77.',
  },
};
function D07_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 'ten' | 'one'
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.col) { setPicked(initialAnswer.studentAnswer.col); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === 'one';
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'ten', label: 'o‘nlik' }, { id: 'one', label: 'birlik' }], studentAnswer: { col: picked }, correctAnswer: { col: 'one' }, correct, meta: { tag: 'finderror', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const tone = (col) => { const on = picked === col; if (checked && on) return col === 'one' ? 'ok' : 'no'; if (on) return 'sel'; return null; };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Colon>
            <ColHeader />
            <Row sign="" tenNode={<DC ch="4" c={C.ten} />} oneNode={<DC ch="5" c={C.one} />} />
            <Row sign="+" tenNode={<DC ch="3" c={C.ten} />} oneNode={<DC ch="2" c={C.one} />} />
            <HR />
            <Row sign="" tenNode={<BoxCell ch="7" tone={tone('ten')} onClick={() => !(isReview || checked) && setPicked('ten')} disabled={isReview || checked} />} oneNode={<BoxCell ch="8" tone={tone('one')} onClick={() => !(isReview || checked) && setPicked('one')} disabled={isReview || checked} />} />
          </Colon>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.sink2 }}>{lang === 'uz' ? 'Javob katagini bosing' : 'Нажми клетку ответа'}</div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_06(props) {
  return (<><style>{FX_CSS}</style><D07_06Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D07_06.audio = {
  uz: { intro: "Tayyor stolbik. 45 qo'shish 32 teng 78. Bitta ustun natijasi noto'g'ri. Yechimda xato bor. Noto'g'ri javob katagini bosing.", on_correct: "To'g'ri. Birliklar ustuni xato. 5 qo'shish 2 teng 7, 8 emas. To'g'ri javob, 77.", on_wrong: "Maslahat. Har ustunni alohida tekshiring. 5 qo'shish 2 nechchi? 4 qo'shish 3 nechchi?" },
  ru: { intro: "Готовый столбик. 45 плюс 32 равно 78. Один столбец неверный. В решении ошибка. Нажми на неверную клетку ответа.", on_correct: "Верно. Столбец единиц неверный. 5 плюс 2 равно 7, а не 8. Верный ответ, 77.", on_wrong: "Подсказка. Проверь каждый столбец отдельно. Сколько 5 плюс 2? Сколько 4 плюс 3?" },
};
