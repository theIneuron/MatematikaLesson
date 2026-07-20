// Dars 2 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d02-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d02-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d02-pop { animation: d02pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-star { opacity: .35; animation: d02tw 3.2s ease-in-out infinite; }
        @keyframes d02tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d02-drop { animation: d02drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-float { animation: d02float 3s ease-in-out infinite; }
        @keyframes d02float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d02-pulse { animation: d02pulse 1.5s ease-in-out infinite; }
        @keyframes d02pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_CORRECT = 1;
const D10_T = {
  uz: {
    eyebrow: 'To‘g‘rimi?', setup: 'Dispetcher 54 kodini «qirq besh» deb o‘qidi.',
    ask: 'Dispetcher to‘g‘ri o‘qidimi? 54 — «qirq besh»mi?',
    yes: 'Ha, to‘g‘ri', no: "Yo'q, xato",
    correct: "To'g'ri! 54 = «ellik to'rt», «qirq besh» emas. «Qirq besh» = 45.",
    wrong: "Maslahat: 54 da o'nlik 5 (ellik), birlik 4 (to'rt). Demak «ellik to'rt».",
    rule: "54 = ellik to'rt, 45 = qirq besh. O'rin almashsa — boshqa son.",
  },
  ru: {
    eyebrow: 'Верно ли?', setup: 'Диспетчер прочитал код 54 как «сорок пять».',
    ask: 'Диспетчер прочитал верно? 54 — это «сорок пять»?',
    yes: 'Да, верно', no: 'Нет, ошибка',
    correct: 'Верно! 54 = «пятьдесят четыре», а не «сорок пять». «Сорок пять» = 45.',
    wrong: 'Подсказка: в 54 десятки 5 (пятьдесят), единицы 4 (четыре). Значит «пятьдесят четыре».',
    rule: '54 = пятьдесят четыре, 45 = сорок пять. Поменял местами — другое число.',
  },
};
function D02_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: '0', label: t.yes }, { id: '1', label: t.no }], studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'read_tf', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (i, label) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = C.ink;
    if (on) { bg = C.accSoft; bd = C.acc; }
    if (show) { const ok = i === D10_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: 1, minHeight: 66, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 800, fontFamily: 'inherit', cursor: (isReview || checked) ? 'default' : 'pointer' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, letterSpacing: '.1em' }}>KOD</div>
            <div className="d02-float" style={{ ...S.mono, fontSize: 50, fontWeight: 800, color: C.ten }}>54</div>
          </div>
          <span style={{ fontSize: 28, color: C.sink2 }}>→</span>
          <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#FF9A82', border: '2px solid #FF9A82', borderRadius: 10, padding: '6px 12px' }}>{lang === 'uz' ? '«qirq besh»?' : '«сорок пять»?'}</div>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>{btn(0, t.yes)}{btn(1, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_10(props) {
  return (<><style>{FX_CSS}</style><D02_10Impl {...props} /></>);
}
