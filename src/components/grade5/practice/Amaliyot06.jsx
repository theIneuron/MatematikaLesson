// Amaliyot06 — Klassifikatsiya (to'g'ri/noto'g'ri/aralash) · Blok 3 · daraja Б · teg: fraction_types
// Tap → korzinka (drag emas). Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// bin: 0 = to'g'ri, 1 = noto'g'ri, 2 = aralash
const OBJECTS = [
  { n: 3, d: 4, bin: 0, label: '3/4' },
  { n: 7, d: 5, bin: 1, label: '7/5' },
  { whole: 2, n: 1, d: 3, bin: 2, label: '2 1/3' },
  { n: 9, d: 9, bin: 1, label: '9/9' },
  { n: 1, d: 8, bin: 0, label: '1/8' },
  { n: 11, d: 4, bin: 1, label: '11/4' },
];
const DATA = { tag: 'fraction_types', level: 'Б', format: '2.5' };

const T = {
  uz: {
    title: 'Solishtirish va klassifikatsiya',
    body: 'Madina kasrlarni turkumladi. Har bir kasrni mos turkumga joylang.',
    bins: ["To'g'ri kasr", "Noto'g'ri kasr", 'Aralash son'],
    short: ["To'g'ri", "Noto'g'ri", 'Aralash'],
    correct: "To'g'ri. Surat < maxraj — to'g'ri kasr; surat ≥ maxraj — noto'g'ri; butun bilan — aralash.",
    wrong: (n) => `${n}/6 to'g'ri. Maslahat: suratni maxraj bilan solishtiring.`,
  },
  ru: {
    title: 'Сравнение и классификация',
    body: 'Мадина разбирает дроби. Разместите каждую дробь в нужную корзину.',
    bins: ['Правильная дробь', 'Неправильная дробь', 'Смешанное число'],
    short: ['Правильная', 'Неправильная', 'Смешанное'],
    correct: 'Верно. Числитель < знаменателя — правильная; ≥ — неправильная; с целым — смешанное.',
    wrong: (n) => `${n}/6 верно. Подсказка: сравните числитель со знаменателем.`,
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// haqiqiy kasr chizig'i: surat tepada, maxraj pastda (aralash uchun butun chapda)
const Frac = ({ whole, n, d }) => (
  <span className="aq-fr">
    {whole != null && <span className="aq-whole">{whole}</span>}
    <span className="aq-stack">
      <span className="aq-num">{n}</span>
      <span className="aq-fbar" />
      <span className="aq-den">{d}</span>
    </span>
  </span>
);

export default function Amaliyot06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [pick, setPick] = useState(() => OBJECTS.map(() => null));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && Array.isArray(initialAnswer.studentAnswer)) {
      setPick(initialAnswer.studentAnswer.map((x) => (x == null ? null : x)));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, n: initialAnswer.meta?.score ?? 0 }); setChecked(true); }
    }
  }, [initialAnswer]);

  const allSet = pick.every((p) => p !== null);
  useEffect(() => { onReady?.(allSet && !checked); }, [allSet, checked, onReady]);

  const assign = (i, bin) => setPick((prev) => prev.map((p, j) => (j === i ? bin : p)));

  const check = useCallback(() => {
    let score = 0;
    OBJECTS.forEach((o, i) => { if (pick[i] === o.bin) score += 1; });
    const correct = score === OBJECTS.length;
    setFeedback({ correct, n: score }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: OBJECTS.map((o) => o.label),
      studentAnswer: pick.slice(),
      correctAnswer: OBJECTS.map((o) => o.bin),
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, score },
    });
  }, [pick, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq06">
      <style>{`
        .aq06 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq06 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq06 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq06 .aq-item { display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:10px 12px; margin:9px 0; border:1.5px solid #eef0f4; border-radius:14px; background:#f8fafc; }
        .aq06 .aq-fr { display:inline-flex; align-items:center; gap:5px; min-width:58px; }
        .aq06 .aq-whole { font-size:24px; font-weight:800; }
        .aq06 .aq-stack { display:inline-flex; flex-direction:column; align-items:center; line-height:1; }
        .aq06 .aq-num, .aq06 .aq-den { font-size:18px; font-weight:800; padding:0 5px; }
        .aq06 .aq-fbar { align-self:stretch; height:2px; background:#1f2430; margin:2px 0; }
        .aq06 .aq-bins { display:flex; gap:8px; flex-wrap:wrap; flex:1; justify-content:flex-end; }
        .aq06 .aq-bin { padding:9px 13px; border-radius:999px; border:2px solid #d6dae3; background:#fff; font-size:13px; font-weight:700; color:#374151; cursor:pointer; }
        .aq06 .aq-bin.sel { border-color:#fe5b1a; background:#fe5b1a; color:#fff; }
        .aq06 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq06 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq06 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>
      {OBJECTS.map((o, i) => (
        <div className="aq-item" key={i}>
          <Frac whole={o.whole} n={o.n} d={o.d} />
          <div className="aq-bins">
            {t.short.map((b, bi) => (
              <button key={bi} type="button" disabled={lock}
                className={`aq-bin ${pick[i] === bi ? 'sel' : ''}`}
                onClick={() => assign(i, bi)}>{b}</button>
            ))}
          </div>
        </div>
      ))}
      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.correct ? t.correct : t.wrong(feedback.n)}</span>
        </div>
      )}
    </div>
  );
}
