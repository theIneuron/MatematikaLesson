// Amaliyot17 — Daraja: kub va kvadratni hisoblash · Blok 1 · daraja С · teg: power
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: 4³ ni hisoblash; ko'paytuvchilar (4·4·4) vizual ko'rsatiladi, o'quvchi natijani kiritadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const BASE = 4, EXP = 3;
const ANS = Math.pow(BASE, EXP); // 64

const DATA = { tag: 'power', level: 'С', format: 'input', block: 1 };

const T = {
  uz: {
    title: 'Sonning darajasi',
    body: "4 ni kub darajaga ko'taring: 4³ ni hisoblang.",
    expand: "4³ = 4 · 4 · 4",
    label: "Natija:",
    hint: "Daraja — bir xil ko'paytuvchilar ko'paytmasi. 4·4 = 16, keyin 16·4.",
    correct: "To'g'ri. 4³ = 4·4·4 = 64.",
    wrong: "Hali to'g'ri emas. Bu 4·3 = 12 emas — daraja qo'shish emas, ko'paytirish: 4·4·4.",
  },
  ru: {
    title: 'Степень числа',
    body: 'Возведите 4 в куб: вычислите 4³.',
    expand: '4³ = 4 · 4 · 4',
    label: 'Результат:',
    hint: 'Степень — произведение одинаковых множителей. 4·4 = 16, затем 16·4.',
    correct: 'Верно. 4³ = 4·4·4 = 64.',
    wrong: 'Пока неверно. Это не 4·3 = 12 — степень это не сложение, а умножение: 4·4·4.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot17(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [val, setVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.value != null) {
      setVal(String(initialAnswer.studentAnswer.value));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(cleanInt(val) || '-1', 10);
    const correct = v === ANS;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { value: v }, correctAnswer: { value: ANS },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, base: BASE, exp: EXP },
    });
  }, [val, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  return (
    <div className="aq aq17">
      <style>{`
        .aq17 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq17 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq17 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq17 .aq-expand { text-align:center; font-size:30px; font-weight:800; color:#fe5b1a; letter-spacing:.03em; margin:8px 0 6px; font-variant-numeric:tabular-nums; }
        .aq17 .aq-cubes { display:flex; justify-content:center; gap:10px; margin:10px 0 20px; }
        .aq17 .aq-cube { width:52px; height:52px; border-radius:12px; background:#fff0e8; border:2px solid #bcd0fb; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; color:#fe5b1a; }
        .aq17 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .aq17 input.aq-input { width:100%; box-sizing:border-box; font-size:24px; font-weight:800; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq17 input.aq-input:focus { border-color:#fb7a45; background:#fff; }
        .aq17 input.aq-input:disabled { opacity:.85; }
        .aq17 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:8px; }
        .aq17 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq17 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq17 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>
      <div className="aq-expand">{t.expand}</div>
      <div className="aq-cubes">
        {Array.from({ length: EXP }).map((_, i) => (<div key={i} className="aq-cube">{BASE}</div>))}
      </div>

      <label className="aq-label" htmlFor="aq17-in">{t.label}</label>
      <input id="aq17-in" className="aq-input" value={val} onChange={(e) => setVal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" disabled={isReview || checked} placeholder="0" />
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
