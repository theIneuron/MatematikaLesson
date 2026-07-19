// Dars 7 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const Chip = ({ children, on, tone, onClick, disabled, w = 66 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

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

// 34 (yuqori). 25 ning raqamlari: 2->o'nlik, 5->birlik.
const D01_TILES = [2, 5];
const D01_T = {
  uz: {
    eyebrow: 'Ustunga joylang', setup: 'Yuqorida 34 turibdi. 25 ni ostiga to‘g‘ri joylang.',
    ask: 'Raqamni bosing, keyin ustunga qo‘ying: birlik ostiga birlik, o‘nlik ostiga o‘nlik.',
    correct: "To'g'ri. 2 — o‘nlik ustuniga, 5 — birlik ustuniga. Ustunlar to‘g‘ri.",
    wrong: "Maslahat: birlik ostiga birlik, o‘nlik ostiga o‘nlik. 25 da qaysi raqam birlik?",
    rule: "Stolbikda birlik ostiga birlik, o‘nlik ostiga o‘nlik yoziladi.",
  },
  ru: {
    eyebrow: 'Поставь в столбик', setup: 'Сверху стоит 34. Поставь 25 под ним правильно.',
    ask: 'Нажми цифру, затем поставь в столбик: единицы под единицы, десятки под десятки.',
    correct: 'Верно. 2 — в столбец десятков, 5 — в столбец единиц. Столбцы верны.',
    wrong: 'Подсказка: единицы под единицы, десятки под десятки. Какая цифра в 25 — единицы?',
    rule: 'В столбике единицы пишут под единицами, десятки под десятками.',
  },
};
function D07_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]); // [tenSlot, oneSlot] -> tile idx
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const used = new Set(slots.filter((x) => x != null));
  const clickSlot = (k) => { if (locked) return; if (pick != null) { setSlots((s) => { const n = s.map((v) => v === pick ? null : v); n[k] = pick; return n; }); setPick(null); } else if (slots[k] != null) { setSlots((s) => { const n = s.slice(); n[k] = null; return n; }); } };
  const check = useCallback(() => {
    const correct = slots[0] === 0 && slots[1] === 1; // 2->ten, 5->one
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { ten: 2, one: 5 }, correct, meta: { tag: 'align', level: '🟢' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slotNode = (k) => {
    const ti = slots[k]; const v = ti == null ? null : D01_TILES[ti];
    let tone = null; if (checked) tone = fb?.correct ? 'ok' : 'no'; else if (v != null) tone = 'sel';
    return <div onClick={() => clickSlot(k)}><BoxCell ch={v != null ? v : ''} tone={tone} /></div>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Colon>
            <ColHeader />
            <Row sign="" tenNode={<DC ch="3" c={C.ten} />} oneNode={<DC ch="4" c={C.one} />} />
            <Row sign="+" tenNode={slotNode(0)} oneNode={slotNode(1)} />
            <HR />
            <Row sign="" tenNode={<DC ch="5" c={C.ten} />} oneNode={<DC ch="9" c={C.one} />} />
          </Colon>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 18 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
        {D01_TILES.map((n, i) => used.has(i)
          ? <span key={i} style={{ minWidth: 60, height: 54, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />
          : <Chip key={i} on={pick === i} disabled={locked} onClick={() => setPick(pick === i ? null : i)} w={60}>{n}</Chip>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_01(props) {
  return (<><style>{FX_CSS}</style><D07_01Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D07_01.audio = {
  uz: { intro: "Yuqorida 34 turibdi. 25 ni ostiga to'g'ri joylang. Raqamni bosing, keyin ustunga qo'ying. Birlik ostiga birlik, o'nlik ostiga o'nlik.", on_correct: "To'g'ri. 2, o'nlik ustuniga, 5, birlik ustuniga. Ustunlar to'g'ri.", on_wrong: "Maslahat. Birlik ostiga birlik, o'nlik ostiga o'nlik. 25 da qaysi raqam birlik?" },
  ru: { intro: "Сверху стоит 34. Поставь 25 под ним правильно. Нажми цифру, затем поставь в столбик. Единицы под единицы, десятки под десятки.", on_correct: "Верно. 2, в столбец десятков, 5, в столбец единиц. Столбцы верны.", on_wrong: "Подсказка. Единицы под единицы, десятки под десятки. Какая цифра в 25, единицы?" },
};
