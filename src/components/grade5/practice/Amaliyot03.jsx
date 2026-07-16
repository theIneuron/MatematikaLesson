// Amaliyot03 — Mantiqiy masala (qonuniyat) · daraja П · teg: pattern_logic
// Javob (son) VA sabab (tanlov) ikkalasi to'g'ri bo'lsa hisoblanadi. Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { answer: 36, reason: 0, tag: 'square_pattern', level: 'П', format: '2.2' };

const T = {
  uz: {
    title: 'Qonuniyat (kvadrat sonlar)',
    body: 'Nilufar logotipidagi kvadratlar qatori: 1, 4, 9, 16, 25, ? Qatorni davom ettiring va qoidani tanlang.',
    ansLabel: 'Keyingi son',
    reasonLabel: 'Qoidani tanlang:',
    options: ["Kvadrat sonlar: 1², 2², 3², 4², 5² …", "Har son oldingisiga 7 qo'shiladi", "Har son 2 ga ko'paytiriladi"],
    correct: "To'g'ri. Keyingi son 36 = 6². Bu kvadrat sonlar ketma-ketligi: 1, 4, 9, 16, 25, 36.",
    wrong: "Maslahat: har sonni biror sonning kvadrati sifatida ko'ring (1 = 1², 4 = 2² …).",
  },
  ru: {
    title: 'Закономерность (квадраты)',
    body: 'Ряд квадратов на логотипе Нилуфар: 1, 4, 9, 16, 25, ? Продолжите ряд и выберите правило.',
    ansLabel: 'Следующее число',
    reasonLabel: 'Выберите правило:',
    options: ['Квадраты чисел: 1², 2², 3², 4², 5² …', 'К каждому прибавляется 7', 'Каждое умножается на 2'],
    correct: 'Верно. Следующее число 36 = 6². Это ряд квадратов: 1, 4, 9, 16, 25, 36.',
    wrong: 'Подсказка: посмотрите на каждое число как на квадрат (1 = 1², 4 = 2² …).',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [ans, setAns] = useState('');
  const [reason, setReason] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const a = initialAnswer.studentAnswer;
      if (a.answer != null) setAns(String(a.answer));
      if (a.reason != null) setReason(a.reason);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(ans.trim() !== '' && reason !== null && !checked); }, [ans, reason, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(cleanInt(ans) || '0', 10);
    const correct = v === DATA.answer && reason === DATA.reason;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: t.options.map((label, id) => ({ id, label })),
      studentAnswer: { answer: v, reason },
      correctAnswer: { answer: DATA.answer, reason: DATA.reason },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, partial: { answer: v === DATA.answer, reason: reason === DATA.reason } },
    });
  }, [ans, reason, playCorrect, playWrong, onSubmit, t.body, t.options]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq03">
      <style>{`
        .aq03 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq03 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq03 .aq-body { font-size:20px; font-weight:700; line-height:1.5; margin:6px 0 16px; font-variant-numeric:tabular-nums; }
        .aq03 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin:14px 0 6px; }
        .aq03 input.aq-input { width:100%; box-sizing:border-box; font-size:22px; font-weight:700; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq03 input.aq-input:focus { border-color:#fb7a45; background:#fff; }
        .aq03 .aq-opt { display:flex; align-items:center; gap:10px; width:100%; text-align:left; box-sizing:border-box; padding:13px 15px; margin:8px 0; border-radius:14px; border:2px solid #d6dae3; background:#fff; font-size:15px; font-weight:600; color:#374151; cursor:pointer; }
        .aq03 .aq-opt.sel { border-color:#fe5b1a; background:#eef4ff; color:#b83d0e; }
        .aq03 .aq-dot { width:18px; height:18px; border-radius:50%; border:2px solid #c2c8d2; flex:0 0 auto; }
        .aq03 .aq-opt.sel .aq-dot { border-color:#fe5b1a; background:#fe5b1a; box-shadow:inset 0 0 0 3px #fff; }
        .aq03 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq03 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq03 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <label className="aq-label" htmlFor="aq03-ans">{t.ansLabel}</label>
      <input id="aq03-ans" className="aq-input" value={ans}
        onChange={(e) => setAns(cleanInt(e.target.value))}
        inputMode="numeric" pattern="[0-9]*" placeholder="0" disabled={lock} />

      <div className="aq-label">{t.reasonLabel}</div>
      {t.options.map((opt, i) => (
        <button key={i} type="button" disabled={lock}
          className={`aq-opt ${reason === i ? 'sel' : ''}`}
          onClick={() => setReason(i)}>
          <span className="aq-dot" />{opt}
        </button>
      ))}

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
