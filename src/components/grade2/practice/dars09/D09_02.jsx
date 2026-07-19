// Dars 9 · Amaliyot 02 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D02_CHIPS = [0, 1, 2], D02_CORRECT = 1;
const D02_T = {
  uz: {
    eyebrow: "Nechta o‘nlik ko‘chadi", setup: 'Birliklar ustuni: 8 + 6 = 14.',
    ask: '14 hosil bo‘ldi. O‘nliklar ustuniga nechta o‘nlik ko‘chadi?',
    correct: "To'g'ri. 14 = 1 o‘nlik va 4 birlik. Demak 1 o‘nlik ko‘chadi.",
    wrong: "Maslahat: 14 nechta to‘liq o‘nlikdan iborat? O‘shancha o‘nlik ko‘chadi.",
    rule: "Birlik yig‘indisidagi o‘nliklar soni ko‘chadi. 14 → 1 o‘nlik.",
  },
  ru: {
    eyebrow: 'Сколько десятков перейдёт', setup: 'Столбец единиц: 8 + 6 = 14.',
    ask: 'Получилось 14. Сколько десятков переходит к десяткам?',
    correct: 'Верно. 14 = 1 десяток и 4 единицы. Значит переходит 1 десяток.',
    wrong: 'Подсказка: сколько полных десятков в 14? Столько и переходит.',
    rule: 'Переходит столько десятков, сколько их в сумме единиц. 14 → 1 десяток.',
  },
};
function D09_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D02_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D02_CHIPS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { idx: picked, label: String(D02_CHIPS[picked]) }, correctAnswer: { idx: 1, label: '1' }, correct, meta: { tag: 'carrystep', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...S.mono, fontSize: 40, fontWeight: 800, color: C.sink }}><span style={{ color: C.one }}>8</span> + <span style={{ color: C.one }}>6</span> = <span style={{ color: C.acc }}>14</span></div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: C.sink2 }}>14 = <span style={{ color: C.ten }}>1 o‘nlik</span> + <span style={{ color: C.one }}>4 birlik</span></div>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D02_CHIPS.map((n, i) => { const on = picked === i; let tone = null; if (checked && on) tone = i === D02_CORRECT ? 'ok' : 'no'; return <Chip key={i} on={on && !checked} tone={tone} disabled={isReview || checked} onClick={() => setPicked(i)} w={64}>{n}</Chip>; })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D09_02(props) {
  return (<><style>{FX_CSS}</style><D09_02Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D09_02.audio = {
  uz: { intro: "Birliklar ustuni. 8 qo'shish 6 teng 14. 14 hosil bo'ldi. O'nliklar ustuniga nechta o'nlik ko'chadi?", on_correct: "To'g'ri. 14 teng 1 o'nlik va 4 birlik. Demak 1 o'nlik ko'chadi.", on_wrong: "Maslahat. 14 nechta to'liq o'nlikdan iborat? O'shancha o'nlik ko'chadi." },
  ru: { intro: "Столбец единиц. 8 плюс 6 равно 14. Получилось 14. Сколько десятков переходит к десяткам?", on_correct: "Верно. 14 равно 1 десяток и 4 единицы. Значит переходит 1 десяток.", on_wrong: "Подсказка. Сколько полных десятков в 14? Столько и переходит." },
};
