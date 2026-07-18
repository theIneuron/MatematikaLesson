// Dars 4 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d04-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d04-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const Chip = ({ children, on, tone, onClick, disabled, w = 62 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d04-pop { animation: d04pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d04pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d04-star { opacity: .35; animation: d04tw 3.2s ease-in-out infinite; }
        @keyframes d04tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d04-float { animation: d04float 3.4s ease-in-out infinite; }
        @keyframes d04float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D03_TILES = [7, 8, 9, 6];
const D03_T = {
  uz: {
    eyebrow: 'Yetishmagan raqam', setup: 'O‘nliklar teng. Birlik hal qiladi.',
    ask: '5⬜ > 58 to‘g‘ri bo‘lishi uchun bo‘sh katakka qaysi raqam mos?',
    correct: "To'g'ri. 59 > 58. O'nliklar teng (5), birlik 9 > 8.",
    wrong: "Maslahat: o'nliklar teng (5=5), birlik hal qiladi. Qaysi raqam 5⬜ ni 58 dan katta qiladi?",
    rule: "O'nliklar teng bo'lsa, birlik hal qiladi: 59 > 58.",
  },
  ru: {
    eyebrow: 'Недостающая цифра', setup: 'Десятки равны. Решают единицы.',
    ask: 'Какая цифра в пустой клетке сделает 5⬜ > 58 верным?',
    correct: 'Верно. 59 > 58. Десятки равны (5), единицы 9 > 8.',
    wrong: 'Подсказка: десятки равны (5=5), решают единицы. Какая цифра сделает 5⬜ больше 58?',
    rule: 'Если десятки равны, решают единицы: 59 > 58.',
  },
};
function D04_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const val = picked != null ? 50 + D03_TILES[picked] : 0;
    const correct = val > 58;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D03_TILES.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { idx: picked, digit: D03_TILES[picked] }, correctAnswer: { digit: 9 }, correct, meta: { tag: 'constraintdigit', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const boxCol = checked ? (fb?.correct ? C.ok : C.no) : (picked != null ? C.acc : C.sink2);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, ...S.mono, fontSize: 44, fontWeight: 800, color: C.sink }}>
          <span><span style={{ color: C.ten }}>5</span><span style={{ display: 'inline-flex', width: 46, height: 56, verticalAlign: 'middle', margin: '0 2px', border: '2px dashed ' + boxCol, borderRadius: 10, alignItems: 'center', justifyContent: 'center', color: boxCol, background: C.stile, fontSize: 32 }}>{picked != null ? D03_TILES[picked] : '?'}</span></span>
          <span style={{ color: C.sink2, fontSize: 34 }}>&gt;</span>
          <span style={{ color: C.one }}>58</span>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D03_TILES.map((n, i) => {
          const on = picked === i; let tone = null;
          if (checked && on) tone = fb?.correct ? 'ok' : 'no';
          return <Chip key={i} on={on && !checked} tone={tone} disabled={isReview || checked} onClick={() => setPicked(i)} w={60}>{n}</Chip>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_03(props) {
  return (<><style>{FX_CSS}</style><D04_03Impl {...props} /></>);
}
