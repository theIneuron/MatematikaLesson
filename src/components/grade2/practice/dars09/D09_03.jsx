// Dars 9 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const Chip = ({ children, on, tone, onClick, disabled, w = 66 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d09-pop { animation: d09pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d09pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d09-star { opacity: .4; animation: d09tw 3.4s ease-in-out infinite; }
        @keyframes d09tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 9 + 4 = 13 -> yoziladi 3, ko'chadi 1. Chiplarni ikki qutiga joyla.
const D03_POOL = [3, 1, 4, 13];
const D03_T = {
  uz: {
    eyebrow: 'Ajrating', setup: 'Birliklar yig‘indisi: 9 + 4 = 13.',
    ask: 'Raqamni bosing, keyin to‘g‘ri quti ostiga qo‘ying.',
    boxWrite: 'Birlikka yoziladi', boxCarry: "O‘nlikka ko‘chadi",
    correct: "To'g'ri. 13 = 1 o‘nlik + 3 birlik. Birlikka 3 yoziladi, 1 o‘nlik ko‘chadi.",
    wrong: "Maslahat: 13 ni o‘nlik va birlikka ajrating. Birlik xonasiga faqat bitta raqam sig‘adi.",
    rule: "13 → birlikka 3 yozamiz, 1 o‘nlik ko‘chadi. «13» ni butun yozib bo‘lmaydi.",
  },
  ru: {
    eyebrow: 'Раздели', setup: 'Сумма единиц: 9 + 4 = 13.',
    ask: 'Нажми число, затем поставь под нужную коробку.',
    boxWrite: 'Пишем в единицы', boxCarry: 'Переходит в десятки',
    correct: 'Верно. 13 = 1 десяток + 3 единицы. В единицы пишем 3, 1 десяток переходит.',
    wrong: 'Подсказка: раздели 13 на десятки и единицы. В разряд единиц влезает только одна цифра.',
    rule: '13 → в единицы 3, 1 десяток переходит. «13» целиком писать нельзя.',
  },
};
function D09_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]); // [write, carry] -> pool idx
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
    const wv = slots[0] != null ? D03_POOL[slots[0]] : null;
    const cv = slots[1] != null ? D03_POOL[slots[1]] : null;
    const correct = wv === 3 && cv === 1;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D03_POOL.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { slots, write: wv, carry: cv }, correctAnswer: { write: 3, carry: 1 }, correct, meta: { tag: 'splitunit', level: '🟢' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slotBox = (k, label, want) => {
    const v = slots[k];
    let bd = v != null ? C.acc : C.stageBd, colr = C.sink, bg = v != null ? C.stile : 'transparent';
    if (checked) { const okv = v != null && D03_POOL[v] === want; bd = okv ? C.ok : C.no; colr = okv ? '#9df0bd' : '#ffb4a8'; bg = okv ? 'rgba(31,122,77,.25)' : 'rgba(192,57,43,.28)'; }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sink2, textAlign: 'center' }}>{label}</div>
        <div onClick={() => clickSlot(k)} style={{ width: 76, height: 60, borderRadius: 12, border: '2.5px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: colr, cursor: locked ? 'default' : 'pointer' }}>{v != null ? D03_POOL[v] : '⬇'}</div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center', ...S.mono, fontSize: 34, fontWeight: 800, color: C.sink, marginBottom: 12 }}><span style={{ color: C.one }}>9</span> + <span style={{ color: C.one }}>4</span> = <span style={{ color: C.acc }}>13</span></div>
        <div style={{ display: 'flex', gap: 22, justifyContent: 'center' }}>{slotBox(0, t.boxWrite, 3)}{slotBox(1, t.boxCarry, 1)}</div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D03_POOL.map((n, i) => used.has(i)
          ? <span key={i} style={{ minWidth: 60, height: 54, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa', display: 'inline-block' }} />
          : <Chip key={i} on={pick === i} disabled={locked} onClick={() => setPick(pick === i ? null : i)} w={56}>{n}</Chip>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D09_03(props) {
  return (<><style>{FX_CSS}</style><D09_03Impl {...props} /></>);
}
