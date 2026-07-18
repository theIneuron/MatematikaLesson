// Dars 2 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D07_ROWS = [
  { code: 32, name_uz: "«o'ttiz ikki»", name_ru: '«тридцать два»', ok: true },
  { code: 45, name_uz: '«besh qirq»', name_ru: '«пять сорок»', ok: false, fix_uz: 'qirq besh', fix_ru: 'сорок пять' },
  { code: 50, name_uz: '«ellik»', name_ru: '«пятьдесят»', ok: true },
  { code: 26, name_uz: '«yigirma olti»', name_ru: '«двадцать шесть»', ok: true },
];
const D07_CORRECT = 1;
const D07_T = {
  uz: {
    eyebrow: 'Xatoni toping', setup: "To'rt yozuvda kod va uning nomi. Bittasi noto'g'ri o'qilgan.",
    ask: 'Qaysi yozuvda kod NOTO‘G‘RI o‘qilgan?',
    correct: "To'g'ri. 45 = «qirq besh», «besh qirq» emas. O'nlik oldinda o'qiladi.",
    wrong: "Maslahat: har kodni o'qing — avval o'nlik, keyin birlik. Qaysi nom mos kelmaydi?",
    rule: "O'nlik oldinda o'qiladi: 45 = qirq besh.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Четыре записи: код и его название. Одно прочитано неверно.',
    ask: 'В какой записи код прочитан НЕВЕРНО?',
    correct: 'Верно. 45 = «сорок пять», а не «пять сорок». Десятки читаются впереди.',
    wrong: 'Подсказка: прочитай каждый код — сначала десятки, потом единицы. Какое название не совпадает?',
    rule: 'Десятки читаются впереди: 45 = сорок пять.',
  },
};
function D02_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: D07_ROWS.map((r, i) => ({ id: String(i), label: r.code + ' ' + r.name_uz })), studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'read_findwrong', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rowStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = '#374151';
    if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
    if (show) { const ok = i === D07_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '15px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, minHeight: 56 };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      {D07_ROWS.map((r, i) => (
        <button key={i} type="button" style={rowStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
          <span><span style={{ ...S.mono, marginRight: 10 }}>{r.code}</span>= {lang === 'uz' ? r.name_uz : r.name_ru}</span>
          {reveal && !r.ok && <span className="d02-pop" style={{ fontSize: 13, fontWeight: 800, color: C.no, background: C.noSoft, padding: '4px 9px', borderRadius: 8 }}>= {lang === 'uz' ? r.fix_uz : r.fix_ru}</span>}
          {reveal && r.ok && <span className="d02-pop" style={{ fontSize: 16, color: C.ok }}>✓</span>}
        </button>
      ))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_07(props) {
  return (<><style>{FX_CSS}</style><D02_07Impl {...props} /></>);
}
