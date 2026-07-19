// Dars 11 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const FX_CSS = `.d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-star { opacity: .4; animation: d11tw 3.4s ease-in-out infinite; }
        @keyframes d11tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D03_OPTS = { uz: ['Birlik ustuniga', "O‘nlik ustuniga"], ru: ['В столбец единиц', 'В столбец десятков'] };
const D03_CORRECT = 0;
const D03_T = {
  uz: { eyebrow: 'Qaysi ustun', setup: '52 + 3 ni ustunlab tuzamiz.', ask: '3 raqami qaysi ustunga yoziladi?', correct: "To'g'ri. 3 — bir xonali son (birlik), u birlik ustuniga yoziladi.", wrong: "Maslahat: 3 nechta xonali son? Bir xonali — bu birlik.", rule: "Bir xonali son birlik ustuniga yoziladi." },
  ru: { eyebrow: 'Какой столбец', setup: 'Записываем 52 + 3 столбиком.', ask: 'В какой столбец пишется цифра 3?', correct: 'Верно. 3 — однозначное число (единицы), пишется в столбец единиц.', wrong: 'Подсказка: сколько цифр в 3? Однозначное — это единицы.', rule: 'Однозначное число пишется в столбец единиц.' },
};
function D11_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz; const opts = D03_OPTS[lang] || D03_OPTS.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); const [fb, setFb] = useState(null); const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D03_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: opts[picked] }, correctAnswer: { idx: 0, label: opts[0] }, correct, meta: { tag: 'whichcol', level: '🟢' } });
  }, [picked, opts, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><div style={{ textAlign: 'center', ...S.mono, fontSize: 44, fontWeight: 800, color: C.sink }}><span style={{ color: C.mars }}>52</span> + <span style={{ color: C.acc }}>3</span></div></Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {opts.map((o, i) => {
          const on = picked === i, show = checked && on; let bd = C.line, bg = C.paper, col = C.ink;
          if (on && !checked) { bd = C.acc; bg = C.accSoft; }
          if (show) { const okv = i === D03_CORRECT; bd = okv ? C.ok : C.no; bg = okv ? C.okSoft : C.noSoft; col = okv ? C.ok : C.no; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 45%', minHeight: 62, borderRadius: 13, border: '2px solid ' + bd, background: bg, fontSize: 17, fontWeight: 800, fontFamily: 'inherit', color: col, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D11_03(props) {
  return (<><style>{FX_CSS}</style><D11_03Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D11_03.audio = {
  uz: { intro: "52 qo'shish 3 ni ustunlab tuzamiz. 3 raqami qaysi ustunga yoziladi?", on_correct: "To'g'ri. 3, bir xonali son birlik, u birlik ustuniga yoziladi.", on_wrong: "Maslahat. 3 nechta xonali son? Bir xonali, bu birlik." },
  ru: { intro: "Записываем 52 плюс 3 столбиком. В какой столбец пишется цифра 3?", on_correct: "Верно. 3, однозначное число единицы, пишется в столбец единиц.", on_wrong: "Подсказка. Сколько цифр в 3? Однозначное, это единицы." },
};
