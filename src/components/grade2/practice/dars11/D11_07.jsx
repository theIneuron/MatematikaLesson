// Dars 11 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const DUST = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DUST.map((s, i) => <span key={i} className="d11-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
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
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
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

// ustun yordamchilari (tuzish)
const ColHeader = ({ w = 46 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `28px ${w}px ${w}px`, marginBottom: 4 }}>
    <span /><div style={{ fontSize: 10, fontWeight: 800, color: C.ten, textAlign: 'center', letterSpacing: '.04em' }}>O‘N</div><div style={{ fontSize: 10, fontWeight: 800, color: C.one, textAlign: 'center', letterSpacing: '.04em' }}>BIR</div>
  </div>
);

const Colon = ({ children }) => (
  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '12px 18px' }}>{children}</div>
);

const Fixed = ({ ch, c, w = 46, dim }) => <div style={{ width: w, height: 50, ...S.mono, fontSize: 32, fontWeight: 800, color: c, opacity: dim ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</div>;

const slotColors = (tone) => {
  if (tone === 'sel') return { bd: C.acc, bg: 'rgba(255,79,40,.2)', col: '#fff', dash: 'solid' };
  if (tone === 'ok') return { bd: C.ok, bg: 'rgba(31,122,77,.3)', col: '#9df0bd', dash: 'solid' };
  if (tone === 'no') return { bd: C.no, bg: 'rgba(192,57,43,.32)', col: '#ffb4a8', dash: 'solid' };
  return { bd: C.boxBd, bg: 'rgba(255,255,255,0.03)', col: C.sink2, dash: 'dashed' };
};

const Slot = ({ ch, tone, onClick, disabled, w = 46 }) => {
  const s = slotColors(tone);
  const st = { width: w, height: 50, borderRadius: 10, border: '2.5px ' + s.dash + ' ' + s.bd, background: s.bg, ...S.mono, fontSize: 32, fontWeight: 800, color: s.col, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onClick && !disabled ? 'pointer' : 'default' };
  return onClick ? <button type="button" disabled={disabled} onClick={onClick} style={st}>{ch}</button> : <div style={st}>{ch}</div>;
};

const RowG = ({ sign, ten, one, w = 46 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `28px ${w}px ${w}px`, alignItems: 'center', margin: '3px 0' }}>
    <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: C.sink2, textAlign: 'center' }}>{sign || ''}</span>{ten}{one}
  </div>
);

const HR = ({ w = 46 }) => <div style={{ height: 3, background: C.sink2, borderRadius: 2, margin: '5px 0', marginLeft: 28, width: w * 2 }} />;

/* ============================== PLACE TASK (joylash) ============================== */
// cfg: { top:[tenCh,oneCh], sign, chips:[digits], want:{ten,bir}, tag, level, T }
function PlaceTask(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit, cfg } = props || {};
  const t = cfg.T[lang] || cfg.T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState({ ten: null, bir: null }); // hold placed digit values
  const [pick, setPick] = useState(null); // selected chip index
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const placedVals = [slots.ten, slots.bir].filter((v) => v != null);
  const allPlaced = placedVals.length === cfg.chips.length;
  useEffect(() => { onReady?.(allPlaced && !checked); }, [allPlaced, checked, onReady]);
  const locked = isReview || checked;
  const poolLeft = cfg.chips.filter((v, i) => !( (slots.ten === v && cfg.chips.indexOf(v) === i) || (slots.bir === v && cfg.chips.indexOf(v) === i) ));
  // simpler pool: remove one instance per placed value
  const usedCount = {};
  [slots.ten, slots.bir].forEach((v) => { if (v != null) usedCount[v] = (usedCount[v] || 0) + 1; });
  const remaining = [];
  const seen = {};
  cfg.chips.forEach((v) => { seen[v] = (seen[v] || 0) + 1; if (seen[v] > (usedCount[v] || 0)) remaining.push(v); });
  const clickSlot = (col) => {
    if (locked) return;
    if (pick != null) { const v = cfg.chips[pick]; setSlots((s) => { const n = { ...s }; if (n.ten === v && col !== 'ten') { } n[col] = v; return n; }); setPick(null); }
    else if (slots[col] != null) { setSlots((s) => ({ ...s, [col]: null })); }
  };
  const check = useCallback(() => {
    const okTen = cfg.want.ten == null ? slots.ten == null : slots.ten === cfg.want.ten;
    const okBir = cfg.want.bir == null ? slots.bir == null : slots.bir === cfg.want.bir;
    const correct = okTen && okBir;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: cfg.want, correct, meta: { tag: cfg.tag, level: cfg.level } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slotTone = (col) => {
    if (checked) { const want = cfg.want[col]; const okv = want == null ? slots[col] == null : slots[col] === want; if (slots[col] == null && want == null) return null; return okv ? 'ok' : 'no'; }
    return slots[col] != null ? 'sel' : null;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Colon>
            <ColHeader />
            <RowG sign="" ten={<Fixed ch={cfg.top[0]} c={C.ten} />} one={<Fixed ch={cfg.top[1]} c={C.one} />} />
            <RowG sign={cfg.sign} ten={<Slot ch={slots.ten != null ? slots.ten : '⬇'} tone={slotTone('ten')} onClick={() => clickSlot('ten')} disabled={locked} />} one={<Slot ch={slots.bir != null ? slots.bir : '⬇'} tone={slotTone('bir')} onClick={() => clickSlot('bir')} disabled={locked} />} />
            <HR />
          </Colon>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', minHeight: 56 }}>
        {remaining.length === 0 ? <span style={{ color: C.ink3, fontSize: 14, alignSelf: 'center' }}>{t.placed || '✓ joylandi'}</span>
          : remaining.map((v, i) => <Chip key={i} on={pick != null && cfg.chips[pick] === v} disabled={locked} onClick={() => setPick(pick != null && cfg.chips[pick] === v ? null : cfg.chips.indexOf(v))} w={58}>{v}</Chip>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

const FX_CSS = `.d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-star { opacity: .4; animation: d11tw 3.4s ease-in-out infinite; }
        @keyframes d11tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const CFG_07 = {
  top: ['5', '8'], sign: '−', chips: [2, 4], want: { ten: 2, bir: 4 }, tag: 'subsetup', level: '🟡',
  T: {
    uz: { eyebrow: 'Ayirishni tuzing', setup: 'Yuqorida 58. 58 − 24 ni ustunlab tuzamiz.', ask: '24 ni to‘g‘ri joylang: 2 va 4 ni mos ustunga qo‘ying.', placed: '✓ joylandi', correct: "To'g'ri. 2 → o‘nlik ustuni, 4 → birlik ustuni.", wrong: "Maslahat: ayirishda ham birlik ostiga birlik, o‘nlik ostiga o‘nlik. 24 sonida qaysi raqam birlik, qaysi biri o‘nlik ekanini aniqlang.", rule: "Ayirishni ham xonalab tuzamiz: birlik ostiga birlik, o‘nlik ostiga o‘nlik." },
    ru: { eyebrow: 'Составь вычитание', setup: 'Сверху 58. Записываем 58 − 24 столбиком.', ask: 'Размести 24: 2 и 4 в нужный столбец.', placed: '✓ размещено', correct: 'Верно. 2 → десятки, 4 → единицы.', wrong: 'Подсказка: в вычитании тоже единицы под единицы, десятки под десятки. Определи, какая цифра в 24 — единицы, какая — десятки.', rule: 'Вычитание тоже по разрядам: единицы под единицы, десятки под десятки.' },
  },
};
const D11_07Impl = (props) => <PlaceTask {...props} cfg={CFG_07} />;

export default function D11_07(props) {
  return (<><style>{FX_CSS}</style><D11_07Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D11_07.audio = {
  uz: { intro: "Yuqorida 58. 58 ayirish 24 ni ustunlab tuzamiz. 24 ni to'g'ri joylang. 2 va 4 ni mos ustunga qo'ying.", on_correct: "To'g'ri. 2, o'nlik ustuni, 4, birlik ustuni.", on_wrong: "Maslahat. Ayirishda ham birlik ostiga birlik, o'nlik ostiga o'nlik. 24 sonida qaysi raqam birlik, qaysi biri o'nlik ekanini aniqlang." },
  ru: { intro: "Сверху 58. Записываем 58 минус 24 столбиком. Размести 24. 2 и 4 в нужный столбец.", on_correct: "Верно. 2, десятки, 4, единицы.", on_wrong: "Подсказка. В вычитании тоже единицы под единицы, десятки под десятки. Определи, какая цифра в 24, единицы, какая, десятки." },
};
