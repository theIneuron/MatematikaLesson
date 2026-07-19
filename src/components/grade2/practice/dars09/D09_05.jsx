// Dars 9 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

function NumPad({ value, setValue, disabled, max = 2, tone = 'idle' }) {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  const keyStyle = { width: 58, height: 52, borderRadius: 12, border: '2px solid ' + C.line, background: C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: C.ink, cursor: disabled ? 'default' : 'pointer' };
  const dispBd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.acc;
  const dispBg = tone === 'ok' ? C.okSoft : tone === 'no' ? C.noSoft : C.paper;
  const dispCol = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.ink;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ minWidth: 120, height: 58, padding: '0 14px', borderRadius: 14, border: '2px solid ' + dispBd, background: dispBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: dispCol, letterSpacing: 3 }}>{value || '–'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 58px)', gap: 7 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={keyStyle}>{d}</button>))}
        <span />
        <button type="button" disabled={disabled} onClick={() => push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize: 20, color: C.no }}>⌫</button>
      </div>
    </div>
  );
}

// stolbik yordamchilari
const DC = ({ ch, c, dim }) => <div style={{ width: 44, height: 50, ...S.mono, fontSize: 32, fontWeight: 800, color: c, opacity: dim ? 0.45 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</div>;

const boxTone = (tone) => {
  if (tone === 'sel') return { bd: C.acc, bg: 'rgba(255,79,40,.2)', col: '#fff' };
  if (tone === 'ok') return { bd: C.ok, bg: 'rgba(31,122,77,.3)', col: '#9df0bd' };
  if (tone === 'no') return { bd: C.no, bg: 'rgba(192,57,43,.32)', col: '#ffb4a8' };
  return { bd: C.boxBd, bg: C.stile, col: C.sink };
};

const BoxCell = ({ ch, tone, onClick, disabled }) => {
  const s = boxTone(tone);
  const st = { width: 44, height: 50, borderRadius: 10, border: '2.5px solid ' + s.bd, background: s.bg, ...S.mono, fontSize: 32, fontWeight: 800, color: s.col, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onClick && !disabled ? 'pointer' : 'default' };
  return onClick ? <button type="button" disabled={disabled} onClick={onClick} style={st}>{ch}</button> : <div style={st}>{ch}</div>;
};

const ColHeader = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', marginBottom: 4 }}>
    <span /><div style={{ fontSize: 10, fontWeight: 800, color: C.ten, textAlign: 'center', letterSpacing: '.04em' }}>O‘N</div><div style={{ fontSize: 10, fontWeight: 800, color: C.one, textAlign: 'center', letterSpacing: '.04em' }}>BIR</div>
  </div>
);

const Colon = ({ children }) => (
  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '10px 16px' }}>{children}</div>
);

const Row = ({ sign, tenNode, oneNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', alignItems: 'center' }}>
    <span style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: C.sink2, textAlign: 'center' }}>{sign || ''}</span>
    {tenNode}{oneNode}
  </div>
);

const HR = () => <div style={{ height: 3, background: C.sink2, borderRadius: 2, margin: '5px 0', marginLeft: 30 }} />;

// ko'chuvchi «1» slot (carry) — o'nliklar ustuni tepasida
const CarryRow = ({ show }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', alignItems: 'center', height: 24 }}>
    <span /><div style={{ display: 'flex', justifyContent: 'center' }}>{show ? <span className="d09-pop" style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: C.acc, background: 'rgba(255,79,40,.16)', border: '1.5px solid ' + C.acc, borderRadius: 7, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span> : null}</div><span />
  </div>
);

const FX_CSS = `.d09-pop { animation: d09pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d09pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d09-star { opacity: .4; animation: d09tw 3.4s ease-in-out infinite; }
        @keyframes d09tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_ANS = 64;
const D05_T = {
  uz: {
    eyebrow: "Ko‘chuvchi bilan yeching", setup: 'Stolbik 48 + 16. Tepada ko‘chuvchi «1» ko‘rinadi.',
    ask: 'Birliklar 8 + 6, ko‘chgan o‘nlikni unutmang. Javobni tering.',
    correct: "To'g'ri. 8 + 6 = 14 → 4 yozamiz, 1 ko‘chadi. 4 + 1 + 1 = 6. Javob 64.",
    wrong: "Maslahat: birliklardan boshlang. So‘ng o‘nliklarga ko‘chgan «1» ni ham qo‘shing.",
    rule: "Ko‘chgan o‘nlikni o‘nliklar ustuniga qo‘shing. 48 + 16 = 64.",
  },
  ru: {
    eyebrow: 'Реши с переносом', setup: 'Столбик 48 + 16. Сверху виден перенос «1».',
    ask: 'Единицы 8 + 6, не забудь перенесённый десяток. Набери ответ.',
    correct: 'Верно. 8 + 6 = 14 → пишем 4, 1 переносим. 4 + 1 + 1 = 6. Ответ 64.',
    wrong: 'Подсказка: начни с единиц. Потом прибавь к десяткам перенесённую «1».',
    rule: 'Перенесённый десяток прибавляем к столбцу десятков. 48 + 16 = 64.',
  },
};
function D09_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val.length === 2 && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'carryslot', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rt = checked ? (fb?.correct ? 'ok' : 'no') : (val ? 'sel' : null);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <Colon>
            <ColHeader />
            <CarryRow show />
            <Row sign="" tenNode={<DC ch="4" c={C.ten} />} oneNode={<DC ch="8" c={C.one} />} />
            <Row sign="+" tenNode={<DC ch="1" c={C.ten} />} oneNode={<DC ch="6" c={C.one} />} />
            <HR />
            <Row sign="" tenNode={<BoxCell ch={val[0] || ''} tone={rt} />} oneNode={<BoxCell ch={val[1] || ''} tone={rt} />} />
          </Colon>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NumPad value={val} setValue={setVal} disabled={isReview || checked} max={2} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 18, textAlign: 'center' }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D09_05(props) {
  return (<><style>{FX_CSS}</style><D09_05Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D09_05.audio = {
  uz: { intro: "Stolbik 48 qo'shish 16. Tepada ko'chuvchi 1 ko'rinadi. Birliklar 8 qo'shish 6, ko'chgan o'nlikni unutmang. Javobni tering.", on_correct: "To'g'ri. 8 qo'shish 6 teng 14, 4 yozamiz, 1 ko'chadi. 4 qo'shish 1 qo'shish 1 teng 6. Javob 64.", on_wrong: "Maslahat. Birliklardan boshlang. So'ng o'nliklarga ko'chgan 1 ni ham qo'shing." },
  ru: { intro: "Столбик 48 плюс 16. Сверху виден перенос 1. Единицы 8 плюс 6, не забудь перенесённый десяток. Набери ответ.", on_correct: "Верно. 8 плюс 6 равно 14, пишем 4, 1 переносим. 4 плюс 1 плюс 1 равно 6. Ответ 64.", on_wrong: "Подсказка. Начни с единиц. Потом прибавь к десяткам перенесённую 1." },
};
