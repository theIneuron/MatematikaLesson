// Dars13 · Amaliyot 02 — Belgi qo'y · 🟢 · sign_choice
// 3/5 ? 3/8 uchun to'g'ri belgini tanlash. To'g'ri javobdan keyin ikki qatorli
// chiziq animatsiyasi ochiladi va '?' o'rniga to'g'ri belgi qo'yiladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #2563eb; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
  .d2-div { transform: scaleY(0); transform-origin: top; animation: d13div .26s cubic-bezier(.22,1,.36,1) both; }
  .d2-fill { opacity: 0; transform: scaleX(.3); transform-origin: left; animation: d2fill .3s cubic-bezier(.22,1,.36,1) both; }
  @keyframes d2fill { to { opacity: 1; transform: scaleX(1); } }
  .d2-sign { animation: d2sign .45s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes d2sign { 0% { opacity: 0; transform: scale(.4) rotate(-12deg); } 100% { opacity: 1; transform: none; } }
  @keyframes d13div { to { transform: scaleY(1); } }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } .d2-div { transform: scaleY(1); } .d2-fill { opacity: 1; transform: none; } }
`;

const D13_02_DATA = { correct: 2, tag: 'sign_choice', level: '🟢' }; // '>'
const D13_02_T = {
  uz: {
    eyebrow: 'Belgi', setup: "Suratlar bir xil: uchtadan. Maxrajlar boshqa.",
    ask: "Qaysi belgi to'g'ri?",
    opts: ['<', '=', '>'],
    correct: "To'g'ri. Beshdan bir bo'lak sakkizdan bir bo'lakdan yirikroq. Uchta yirik bo'lak uchta maydadan ko'p.",
    wrongMsg: "Maslahat: 8 > 5, lekin maxraj katta bo'lsa bo'lak mayda bo'ladi. Chiziqlarga qarang.",
  },
  ru: {
    eyebrow: 'Знак', setup: 'Числители одинаковые: по три. Знаменатели разные.',
    ask: 'Какой знак верный?',
    opts: ['<', '=', '>'],
    correct: 'Верно. Одна пятая крупнее одной восьмой. Три крупные доли больше, чем три мелкие.',
    wrongMsg: 'Подсказка: 8 > 5, но чем больше знаменатель, тем мельче доля. Посмотрите на полоски.',
  },
};

// Ikki qator bir vaqtda: avval bo'laklarga bo'linadi (chapdan o'ngga), keyin ichi
// bo'yaladi. SPLIT_END ikkala qator uchun umumiy — bo'yash sinxron boshlanadi.
// MUHIM: bu komponent modul darajasida. Agar u D13_02 ichida e'lon qilinsa,
// har setState da React uni yangi tip deb mount qiladi va animatsiya qaytadan ketadi.
const D2_SPLIT_STEP = 70, D2_SPLIT_END = 7 * D2_SPLIT_STEP + 300, D2_FILL_STEP = 170;
function D13_02_Strip({ n, k, color, run }) {
  return (
    <div style={{ position: 'relative', flex: 1, height: 34, borderRadius: 8, overflow: 'hidden', border: '2px solid #1f2430', background: '#fff' }}>
      {run && Array.from({ length: k }).map((_, j) => (
        <div key={'f' + j} className="d2-fill"
          style={{ position: 'absolute', top: 0, bottom: 0, left: (j / n * 100) + '%', width: (100 / n) + '%', background: color, animationDelay: (D2_SPLIT_END + j * D2_FILL_STEP) + 'ms' }} />
      ))}
      {run && Array.from({ length: n - 1 }).map((_, i) => (
        <div key={'d' + i} className="d2-div"
          style={{ position: 'absolute', top: 0, bottom: 0, left: ((i + 1) / n * 100) + '%', width: 2, background: '#1f2430', animationDelay: (i * D2_SPLIT_STEP) + 'ms' }} />
      ))}
    </div>
  );
}

export default function D13_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_02_T[lang] || D13_02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);   // bo'sh joy ochiladi (savol va variantlar pastga tushadi)
  const [run, setRun] = useState(false);     // chiziqlar animatsiyasi boshlanadi
  const [sign, setSign] = useState(false);   // '?' o'rniga to'g'ri belgi qo'yiladi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (initialAnswer?.studentAnswer?.idx != null) {
      setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') {
        setFb({ correct: initialAnswer.correct }); setChecked(true);
        if (initialAnswer.correct) { setOpen(true); setRun(true); setSign(true); }
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D13_02_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setOpen(true), 300));   // joy ochiladi
      timers.current.push(setTimeout(() => setRun(true), 1350));   // chiziqlar tushadi
      timers.current.push(setTimeout(() => setSign(true), 2850));  // bo'yash tugagach belgi qo'yiladi
    }
    onSubmit?.({
      questionText: '3/5 ? 3/8', options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 2, label: '>' },
      correct, meta: { tag: D13_02_DATA.tag, level: D13_02_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const signStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#1f2430';
    if (active) { bg = '#eaf0fe'; bd = '#2563eb'; }
    if (show) { const ok = i === D13_02_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, minHeight: 60, fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' };
  };

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>

      {/* bo'sh joy: to'g'ri javobdan keyin ochiladi va quyidagilarni pastga suradi */}
      <div style={{ maxHeight: open ? 130 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .95s cubic-bezier(.33,1,.42,1), opacity .7s ease .2s' }}>
        <div className="pq-row" style={{ marginTop: 4 }}><Frac a={3} b={5} size={15} /><D13_02_Strip n={5} k={3} color="#2563eb" run={run} /></div>
        <div className="pq-row"><Frac a={3} b={8} size={15} /><D13_02_Strip n={8} k={3} color="#7c3aed" run={run} /></div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, margin: '12px 0' }}>
        <Frac a={3} b={5} size={24} />
        <span key={sign ? 'sign' : 'q'} className={sign ? 'd2-sign' : undefined}
          style={{ fontSize: 26, fontWeight: 800, color: sign ? '#1a7f43' : '#9aa1ad', minWidth: 26, textAlign: 'center' }}>
          {sign ? t.opts[D13_02_DATA.correct] : '?'}
        </span>
        <Frac a={3} b={8} size={24} />
      </div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={signStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
