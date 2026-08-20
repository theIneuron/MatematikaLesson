// Dars01 · Amaliyot 01 — Amallar tartibini o'qish · 🟢 · tag: read_order
// 5-sinf amaliyotidan KO'CHIRILGAN fayl, matematikasi 7-sinfga o'tkazildi
// (metodist topshirigi 2026-08-20). Tuzilma, uslub, animatsiya va
// jsx-question kontrakti O'ZGARMADI: onReady/registerCheck/onSubmit,
// o'z «Tekshirish» tugmasi yo'q -- uni PracticeHost beradi.
//
// 1500 − 24 · (85 − 3 · 25). Misolning DARAJASI ko'tarildi (metodist qarori
// 2026-08-20: oldingi misollarni boshlang'ich sinf ham yechardi). Endi
// yozuvda ichma-ich tartib bor: avval qavs ICHIDAGI ikkinchi bosqich,
// keyin qavs ichidagi ayirish, so'ng tashqi ko'paytirish, oxirida ayirish.
// 3 · 25 = 75, 85 − 75 = 10, 24 · 10 = 240, 1500 − 240 = 1260.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { expr: '1500 − 24 · (85 − 3 · 25)', correct: 0, tag: 'read_order', level: '🟢' };
const T = {
  uz: {
    eyebrow: 'Amallar tartibi', title: "Yozuvni o'qish",
    setup: "Yozuvda qavs bor va to'rtta amal. Ular qanday tartibda bajariladi?",
    ask: "Qaysi o'qish to'g'ri?",
    opts: [
      "avval qavs ichida: 3 · 25, keyin 85 − 75; so'ng 24 · 10, oxirida ayirish",
      "avval 1500 − 24, keyin qavs",
      "avval qavs ichidagi 85 − 3, keyin ko'paytirishlar",
    ],
    correct: "To'g'ri. Qavs ichida ham o'sha qoida: 3 · 25 = 75, 85 − 75 = 10. So'ng 24 · 10 = 240 va 1500 − 240 = 1260.",
    wrongMsg: "Maslahat: qavs ichidagisi HAMMASIDAN oldin hisoblanadi, va qavs ichida ham o'sha tartib ishlaydi: avval ikkinchi bosqich.",
  },
  ru: {
    eyebrow: 'Порядок действий', title: 'Чтение записи',
    setup: 'В записи есть скобка и четыре действия. В каком порядке они выполняются?',
    ask: 'Какое чтение верное?',
    opts: [
      'сначала в скобке: 3 · 25, потом 85 − 75; затем 24 · 10, в конце вычитание',
      'сначала 1500 − 24, потом скобка',
      'сначала 85 − 3 в скобке, потом умножения',
    ],
    correct: 'Верно. Внутри скобки то же правило: 3 · 25 = 75, 85 − 75 = 10. Затем 24 · 10 = 240 и 1500 − 240 = 1260.',
    wrongMsg: 'Подсказка: то, что в скобке, считается РАНЬШЕ всего, и внутри скобки работает тот же порядок: сначала вторая ступень.',
  },
  en: {
    eyebrow: 'Order of operations', title: 'Reading a record',
    setup: 'The record has a bracket and four operations. In what order do they run?',
    ask: 'Which reading is right?',
    opts: [
      'inside the bracket first: 3 · 25, then 85 − 75; then 24 · 10, subtraction last',
      'first 1500 − 24, then the bracket',
      'first 85 − 3 inside the bracket, then the multiplications',
    ],
    correct: 'Correct. The same rule holds inside the bracket: 3 · 25 = 75, 85 − 75 = 10. Then 24 · 10 = 240 and 1500 − 240 = 1260.',
    wrongMsg: 'Hint: what is inside the bracket is worked out FIRST of all, and inside the bracket the same order applies: second stage first.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.idx != null) {
      setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === DATA.correct;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: DATA.correct, label: t.opts[DATA.correct] },
      correct, meta: { tag: DATA.tag, level: DATA.level, expr: DATA.expr },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const optStyle = (i) => {
    const active = picked === i; const show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    let anim;
    if (!checked) anim = `pqUp .45s cubic-bezier(.22,1,.36,1) ${(0.22 + i * 0.07).toFixed(2)}s both`;
    else if (i === DATA.correct) anim = 'pqPop .5s cubic-bezier(.34,1.56,.64,1) both';
    else if (active) anim = 'pqShake .4s both';
    else anim = 'none';
    return { display: 'block', width: '100%', textAlign: 'left', padding: '11px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 7, fontFamily: 'inherit', animation: anim, transition: 'background .3s, border-color .3s, color .3s' };
  };

  return (
    <div className="pq pq01">
      <style>{`
        .pq01 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq01 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#fe5b1a; text-transform:uppercase; }
        .pq01 .pq-setup { font-size:16px; line-height:1.45; margin:5px 0 8px; color:#374151; }
        .pq01 .pq-num { text-align:center; font-size:33px; font-weight:800; color:#fe5b1a; letter-spacing:0; font-variant-numeric:tabular-nums; margin:4px 0 12px; font-family:'JetBrains Mono','SFMono-Regular',Consolas,monospace; white-space:nowrap; overflow-x:auto; }
        .pq01 .pq-ask { font-size:17px; font-weight:700; margin:0 0 12px; }
        .pq01 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:10px; padding:10px 13px; border-radius:12px; font-size:14.5px; line-height:1.4; font-weight:600; animation:pqIn .45s ease both; }
        .pq01 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq01 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq01 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq01 .a2 { animation-delay:.08s; }
        .pq01 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        .pq01 .pq-num { animation:pqReveal .6s cubic-bezier(.22,1,.36,1) both; animation-delay:.1s; }
        @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
        @media (max-width:700px){ .pq01 .pq-num { font-size:21px; } }
        @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <div className="pq-num">{DATA.expr}</div>
      <p className="pq-ask a a3">{t.ask}</p>
      {t.opts.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} onClick={() => { if (!isReview && !checked) setPicked(i); }} disabled={isReview || checked}>{o}</button>
      ))}
      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrongMsg}</span>
        </div>
      )}
    </div>
  );
}
