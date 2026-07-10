// Dars11 · Amaliyot 04 — Kunlik non (kasr) · 🟡 · Nilufar · tag: per_day
// Darslik §31, Mashq 676: natijani kasr ko'rinishida (surat/maxraj). jsx-question kontrakti. Animatsiyali.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const N = 18, D = 7; // 18 non / 7 kun = 18/7
const DATA = { tag: 'per_day', level: '🟡' };
const T = {
  uz: {
    eyebrow: 'Hayotda', title: 'Kunlik ulush',
    setup: "Bir haftada (7 kun) oila 18 ta non yedi. Bir kunda o'rtacha qancha non yeyilgan? Javobni kasr ko'rinishida yozing.",
    numL: 'Surat', denL: 'Maxraj',
    correct: "To'g'ri. 18 non 7 kunga: 18 : 7 = 18/7.",
    wrong: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
  },
  ru: {
    eyebrow: 'В жизни', title: 'Доля за день',
    setup: 'За неделю (7 дней) семья съела 18 лепёшек. Сколько в среднем за один день? Запишите ответ дробью.',
    numL: 'Числитель', denL: 'Знаменатель',
    correct: 'Верно. 18 лепёшек на 7 дней: 18 : 7 = 18/7.',
    wrong: 'Пока неверно. Подумайте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function D11_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.n != null) setNum(String(sa.n));
      if (sa.d != null) setDen(String(sa.d));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(num.trim() !== '' && den.trim() !== '' && !checked); }, [num, den, checked, onReady]);

  const check = useCallback(() => {
    const n = parseInt(cleanInt(num) || '-1', 10);
    const d = parseInt(cleanInt(den) || '-1', 10);
    const correct = n === N && d === D;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.setup, options: [],
      studentAnswer: { n, d }, correctAnswer: { n: N, d: D },
      correct, meta: { tag: DATA.tag, level: DATA.level },
    });
  }, [num, den, playCorrect, playWrong, onSubmit, t.setup]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ip = { inputMode: 'numeric', pattern: '[0-9]*', disabled: isReview || checked, placeholder: '0' };

  return (
    <div className="pq pq04">
      <style>{`
        .pq04 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq04 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq04 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 20px; color:#374151; }
        .pq04 .pq-frac { display:flex; flex-direction:column; align-items:center; gap:6px; width:110px; margin:0 auto; }
        .pq04 .pq-fin { width:96px; box-sizing:border-box; font-size:26px; font-weight:800; text-align:center; padding:10px; border-radius:12px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .pq04 .pq-fin:focus { border-color:#5b8def; background:#fff; }
        .pq04 .pq-fin:disabled { opacity:.85; }
        .pq04 .pq-fline { width:104px; height:3px; background:#1f2430; border-radius:2px; }
        .pq04 .pq-flbl { display:flex; justify-content:center; gap:44px; margin-top:8px; font-size:11px; color:#9aa1ad; font-weight:700; text-transform:uppercase; }
        .pq04 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:20px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq04 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq04 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq04 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq04 .a2 { animation-delay:.08s; }
        .pq04 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.1);} 100%{transform:scale(1);} }
        .pq04 .pq-frac.on { animation:pqPop .5s cubic-bezier(.34,1.56,.64,1); }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <div className={`pq-frac a a3 ${checked && feedback?.correct ? 'on' : ''}`}>
        <input className="pq-fin" value={num} onChange={(e) => setNum(cleanInt(e.target.value))} aria-label={t.numL} {...ip} />
        <div className="pq-fline" />
        <input className="pq-fin" value={den} onChange={(e) => setDen(cleanInt(e.target.value))} aria-label={t.denL} {...ip} />
      </div>
      <div className="pq-flbl"><span>{t.numL}</span><span>{t.denL}</span></div>
      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
