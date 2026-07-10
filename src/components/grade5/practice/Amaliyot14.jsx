// Amaliyot14 — Konstruktor: sonni razryad va sinflardan yig' · Blok 1 · daraja Б · teg: place_value
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
//   - tayyorlikni onReady(true/false) bilan xabar qiladi,
//   - tekshiruvni registerCheck(fn) orqali ro'yxatdan o'tkazadi,
//   - natijani onSubmit(result) bilan bir marta yuboradi.
// Mexanika: 7 ta razryad-katak; har birini tap-stepper (+/−) bilan 0..9 ga o'rnatadi.
// Jonli tarzda son sinflar bo'yicha (bo'sh joy bilan) yig'iladi. Target — so'z bilan berilgan.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Target son: 3 045 720 — "uch million qirq besh ming yetti yuz yigirma"
const TARGET = 3045720;
const CELLS = 7; // eng katta razryad chapda (yuz millionlargacha joy bor, bu sonda 7 xona)

const DATA = { tag: 'place_value', level: 'Б', format: 'constructor', block: 1 };

const T = {
  uz: {
    title: 'Sonlar konstruktori',
    body: "Bu sonni razryadlardan yig'ing:",
    words: 'uch million · qirq besh ming · yetti yuz yigirma',
    live: "Yig'ilgan son:",
    hintClasses: "Sinflar o'ngdan chapga: birliklar · minglar · millionlar.",
    correct: "To'g'ri. 3 million 45 ming 720 — bu 3 045 720.",
    wrong: "Hali to'g'ri emas. Har sinf uch xonadan: 3 | 045 | 720.",
    up: 'Orttirish', down: 'Kamaytirish',
  },
  ru: {
    title: 'Конструктор чисел',
    body: 'Соберите это число из разрядов:',
    words: 'три миллиона · сорок пять тысяч · семьсот двадцать',
    live: 'Собранное число:',
    hintClasses: 'Классы справа налево: единицы · тысячи · миллионы.',
    correct: 'Верно. 3 миллиона 45 тысяч 720 — это 3 045 720.',
    wrong: 'Пока неверно. В каждом классе три разряда: 3 | 045 | 720.',
    up: 'Увеличить', down: 'Уменьшить',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconUp = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>);
const IconDown = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);

// razryadlardan songa: digits[0] — eng katta razryad
const digitsToNum = (d) => d.reduce((acc, x) => acc * 10 + x, 0);
// bo'sh joy bilan formatlash: 3 045 720
const groupSpaces = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function Amaliyot14(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [digits, setDigits] = useState(() => Array(CELLS).fill(0));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.digits)) {
      setDigits(initialAnswer.studentAnswer.digits.slice(0, CELLS));
      setTouched(true);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  // tayyorlik: kamida bitta razryad o'zgartirilgan bo'lsa (0 dan farqli emas — harakat qilingan bo'lsa)
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const bump = (i, delta) => {
    if (isReview || checked) return;
    setTouched(true);
    setDigits((prev) => {
      const nx = prev.slice();
      nx[i] = (nx[i] + delta + 10) % 10;
      return nx;
    });
  };

  const check = useCallback(() => {
    const val = digitsToNum(digits);
    const correct = val === TARGET;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body + ' ' + t.words,
      options: [],
      studentAnswer: { digits: digits.slice(), value: val },
      correctAnswer: { value: TARGET },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block },
    });
  }, [digits, playCorrect, playWrong, onSubmit, t.body, t.words]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const val = digitsToNum(digits);

  return (
    <div className="aq aq14">
      <style>{`
        .aq14 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq14 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq14 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 4px; }
        .aq14 .aq-words { font-size:19px; font-weight:800; color:#2563eb; margin:2px 0 16px; line-height:1.4; }
        .aq14 .aq-cells { display:flex; justify-content:center; gap:6px; flex-wrap:nowrap; }
        .aq14 .aq-cls-gap { width:14px; }
        .aq14 .aq-cell { display:flex; flex-direction:column; align-items:center; gap:5px; }
        .aq14 .aq-step { width:44px; height:34px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:1.5px solid #d6dae3; background:#f8fafc; color:#2563eb; cursor:pointer; }
        .aq14 .aq-step:active { background:#e8eefc; }
        .aq14 .aq-step:disabled { opacity:.5; cursor:default; }
        .aq14 .aq-digit { width:44px; height:52px; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:800; border-radius:12px; border:2px solid #d6dae3; background:#fff; font-variant-numeric:tabular-nums; }
        .aq14 .aq-live { text-align:center; margin:18px 0 4px; }
        .aq14 .aq-live-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
        .aq14 .aq-live-num { font-size:34px; font-weight:800; letter-spacing:.02em; font-variant-numeric:tabular-nums; }
        .aq14 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:8px; text-align:center; }
        .aq14 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq14 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq14 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @media (max-width:400px){ .aq14 .aq-cell,.aq14 .aq-step,.aq14 .aq-digit{width:38px;} .aq14 .aq-digit{font-size:26px;} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>
      <p className="aq-words">{t.words}</p>

      <div className="aq-cells">
        {digits.map((d, i) => {
          // o'ngdan hisoblab har 3 xonadan keyin sinf oralig'i
          const fromRight = CELLS - 1 - i;
          const gapBefore = i > 0 && fromRight % 3 === 2;
          return (
            <React.Fragment key={i}>
              {gapBefore && <div className="aq-cls-gap" />}
              <div className="aq-cell">
                <button type="button" className="aq-step" onClick={() => bump(i, +1)} disabled={isReview || checked} aria-label={t.up}><IconUp /></button>
                <div className="aq-digit">{d}</div>
                <button type="button" className="aq-step" onClick={() => bump(i, -1)} disabled={isReview || checked} aria-label={t.down}><IconDown /></button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="aq-live">
        <div className="aq-live-lbl">{t.live}</div>
        <div className="aq-live-num" style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{groupSpaces(val)}</div>
      </div>
      <div className="aq-hint">{t.hintClasses}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
