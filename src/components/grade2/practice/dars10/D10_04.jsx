// Dars 10 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d10-star { opacity: .4; animation: d10tw 3.4s ease-in-out infinite; }
        @keyframes d10tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D04_ITEMS = [
  { e: '52 − 27', borrow: true }, { e: '61 − 36', borrow: true },
  { e: '58 − 23', borrow: false }, { e: '47 − 15', borrow: false },
];
const D04_T = {
  uz: {
    eyebrow: 'Qarz kerakmi', setup: 'Har ayirishda birliklarga qarang: yuqori birlik pastdan kichik bo‘lsa — qarz kerak.',
    ask: 'Har ayirishni to‘g‘ri ustunga belgilang.',
    yes: 'Qarz kerak', no: 'Qarz kerak emas',
    correct: "To'g'ri. Yuqori birlik pastdan kichik bo‘lsa — qarz kerak.",
    wrong: "Maslahat: faqat birlik raqamlarini solishtiring. Yuqoridagi kichikmi?",
    rule: "Qarz birlik xonasiga bog‘liq: yuqori < past bo‘lsa — qarz kerak.",
  },
  ru: {
    eyebrow: 'Нужен ли заём', setup: 'Смотри на единицы: если верхняя единица меньше нижней — нужен заём.',
    ask: 'Отметь каждое вычитание в нужный столбец.',
    yes: 'Нужен заём', no: 'Заём не нужен',
    correct: 'Верно. Если верхняя единица меньше нижней — нужен заём.',
    wrong: 'Подсказка: сравни только цифры единиц. Верхняя меньше?',
    rule: 'Заём зависит от единиц: верхняя < нижней — нужен заём.',
  },
};
function D10_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [asg, setAsg] = useState([null, null, null, null]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.asg) { setAsg(sa.asg); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = asg.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const set = (i, v) => { if (locked) return; setAsg((a) => { const n = a.slice(); n[i] = v; return n; }); };
  const check = useCallback(() => {
    const correct = D04_ITEMS.every((it, i) => (asg[i] === 0) === it.borrow);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_ITEMS.map((it, i) => ({ id: String(i), label: it.e })), studentAnswer: { asg }, correctAnswer: { asg: D04_ITEMS.map((it) => it.borrow ? 0 : 1) }, correct, meta: { tag: 'needborrow', level: '🟡' } });
  }, [asg, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const seg = (i, v, label) => {
    const on = asg[i] === v;
    let bd = C.line, bg = C.paper, col = C.ink2;
    if (on && !checked) { bd = C.acc; bg = C.accSoft; col = C.acc; }
    if (checked && on) { const okv = (v === 0) === D04_ITEMS[i].borrow; bd = okv ? C.ok : C.no; bg = okv ? C.okSoft : C.noSoft; col = okv ? C.ok : C.no; }
    return <button type="button" disabled={locked} onClick={() => set(i, v)} style={{ flex: 1, height: 42, borderRadius: 9, border: '2px solid ' + bd, background: bg, color: col, fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: locked ? 'default' : 'pointer' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {D04_ITEMS.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 13, background: C.card, border: '1.5px solid ' + C.line }}>
            <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.ink, minWidth: 104 }}>{it.e}</span>
            <div style={{ display: 'flex', gap: 7, flex: 1 }}>{seg(i, 0, t.yes)}{seg(i, 1, t.no)}</div>
          </div>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D10_04(props) {
  return (<><style>{FX_CSS}</style><D10_04Impl {...props} /></>);
}
