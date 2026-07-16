// Amaliyot07 — Klassifikatsiya (o'lchov birliklari) · Blok 5 · daraja Б · teg: units_geom
// Kattalik ↔ birlik (см / см² / см³). Tap → korzinka. Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// bin: 0 = см (uzunlik/perimetr), 1 = см² (yuza), 2 = см³ (hajm)
const OBJECTS = [
  { uz: 'Devor uzunligi', ru: 'Длина стены', bin: 0 },
  { uz: 'Xona polining yuzasi', ru: 'Площадь пола', bin: 1 },
  { uz: 'Quticha hajmi', ru: 'Объём коробки', bin: 2 },
  { uz: 'Rasm romi perimetri', ru: 'Периметр рамки', bin: 0 },
  { uz: 'Stol yuzasi', ru: 'Площадь стола', bin: 1 },
  { uz: 'Akvarium hajmi', ru: 'Объём аквариума', bin: 2 },
];
const DATA = { tag: 'units_geom', level: 'Б', format: '2.5' };

const T = {
  uz: {
    title: 'Solishtirish va klassifikatsiya',
    body: "Har bir kattalikni mos o'lchov birligiga joylang.",
    bins: ['sm', 'sm²', 'sm³'],
    correct: "To'g'ri. Uzunlik va perimetr — sm; yuza — sm²; hajm — sm³.",
    wrong: (n) => `${n}/6 to'g'ri. Maslahat: uzunlik — sm, yuza — sm², hajm — sm³.`,
  },
  ru: {
    title: 'Сравнение и классификация',
    body: 'Сопоставьте каждую величину с её единицей измерения.',
    bins: ['см', 'см²', 'см³'],
    correct: 'Верно. Длина и периметр — см; площадь — см²; объём — см³.',
    wrong: (n) => `${n}/6 верно. Подсказка: длина — см, площадь — см², объём — см³.`,
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot07(props) {
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
      options: OBJECTS.map((o) => o[lang] || o.uz),
      studentAnswer: pick.slice(),
      correctAnswer: OBJECTS.map((o) => o.bin),
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, score },
    });
  }, [pick, lang, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq07">
      <style>{`
        .aq07 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq07 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq07 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq07 .aq-item { display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:10px 12px; margin:9px 0; border:1.5px solid #eef0f4; border-radius:14px; background:#f8fafc; }
        .aq07 .aq-obj { font-size:15px; font-weight:700; flex:1; min-width:120px; }
        .aq07 .aq-bins { display:flex; gap:8px; }
        .aq07 .aq-bin { min-width:54px; padding:9px 12px; border-radius:999px; border:2px solid #d6dae3; background:#fff; font-size:15px; font-weight:800; color:#374151; cursor:pointer; }
        .aq07 .aq-bin.sel { border-color:#fe5b1a; background:#fe5b1a; color:#fff; }
        .aq07 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq07 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq07 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>
      {OBJECTS.map((o, i) => (
        <div className="aq-item" key={i}>
          <span className="aq-obj">{o[lang] || o.uz}</span>
          <div className="aq-bins">
            {t.bins.map((b, bi) => (
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
