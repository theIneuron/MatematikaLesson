// Dars01 · Amaliyot 04 — Sonlar konstruktori · 🟡 · Nilufar · tag: place_value_build
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react importi.
// Mexanika: 7 razryad-katak, +/− stepper; son jonli sinflar bo'yicha yig'iladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 6072000; // 6 ta million, 7 ta o'n ming, 2 ta ming
const CELLS = 7;
const DATA = { tag: 'place_value_build', level: '🟡' };
const T = {
  uz: {
    eyebrow: 'Atrofimizda', title: "Sonni yig'ish",
    setup: "Nilufar sonni xona birliklaridan yig'moqchi. Kataklarni +/− bilan sozlang:",
    words: "6 ta million · 7 ta o'n ming · 2 ta ming",
    live: "Yig'ilgan son:",
    correct: "To'g'ri. 6 ta million, 7 ta o'n ming, 2 ta ming — 6 072 000.",
    wrong: "Maslahat: yig'ilgan soningizni ovoz chiqarib o'qing. U berilgan so'zlarga to'g'ri kelyaptimi? Har sinf — uchta katak.",
  },
  ru: {
    eyebrow: 'Вокруг нас', title: 'Собери число',
    setup: 'Нилуфар собирает число из разрядных единиц. Настройте клетки кнопками +/−:',
    words: '6 миллионов · 7 десятков тысяч · 2 тысячи',
    live: 'Собранное число:',
    correct: 'Верно. 6 миллионов, 7 десятков тысяч, 2 тысячи — 6 072 000.',
    wrong: 'Подсказка: прочитайте собранное число вслух. Совпадает ли оно с заданными словами? В каждом классе — три клетки.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconUp = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>);
const IconDown = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
const digitsToNum = (d) => d.reduce((acc, x) => acc * 10 + x, 0);
const groupSpaces = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function D01_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [digits, setDigits] = useState(() => Array(CELLS).fill(0));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.digits)) {
      setDigits(initialAnswer.studentAnswer.digits.slice(0, CELLS)); setTouched(true);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const bump = (i, delta) => { if (isReview || checked) return; setTouched(true); setDigits((p) => { const n = p.slice(); n[i] = (n[i] + delta + 10) % 10; return n; }); };

  const check = useCallback(() => {
    const val = digitsToNum(digits);
    const correct = val === TARGET;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.setup + ' ' + t.words, options: [],
      studentAnswer: { digits: digits.slice(), value: val }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level },
    });
  }, [digits, playCorrect, playWrong, onSubmit, t.setup, t.words]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const val = digitsToNum(digits);
  return (
    <div className="pq pq04">
      <style>{`
        .pq04 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq04 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#fe5b1a; text-transform:uppercase; }
        .pq04 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 4px; color:#374151; }
        .pq04 .pq-words { font-size:19px; font-weight:800; color:#fe5b1a; margin:2px 0 16px; }
        .pq04 .pq-cells { display:flex; justify-content:center; gap:6px; flex-wrap:nowrap; }
        .pq04 .pq-clsgap { width:14px; }
        .pq04 .pq-cell { display:flex; flex-direction:column; align-items:center; gap:5px; }
        .pq04 .pq-step { width:44px; height:34px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:1.5px solid #d6dae3; background:#f8fafc; color:#fe5b1a; cursor:pointer; }
        .pq04 .pq-step:disabled { opacity:.5; cursor:default; }
        .pq04 .pq-digit { width:44px; height:52px; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:800; border-radius:12px; border:2px solid #d6dae3; background:#fff; font-variant-numeric:tabular-nums; }
        .pq04 .pq-live { text-align:center; margin:18px 0 4px; }
        .pq04 .pq-live-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
        .pq04 .pq-live-num { font-size:34px; font-weight:800; letter-spacing:.02em; font-variant-numeric:tabular-nums; }
        .pq04 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .45s ease both; }
        .pq04 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq04 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq04 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq04 .a2 { animation-delay:.08s; }
        .pq04 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.1);} 100%{transform:scale(1);} }
        .pq04 .pq-live-num.on { animation:pqPop .5s cubic-bezier(.34,1.56,.64,1); }
        @media (max-width:400px){ .pq04 .pq-cell,.pq04 .pq-step,.pq04 .pq-digit{width:38px;} .pq04 .pq-digit{font-size:26px;} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <p className="pq-words a a3">{t.words}</p>
      <div className="pq-cells">
        {digits.map((d, i) => {
          const fromRight = CELLS - 1 - i;
          const gapBefore = i > 0 && fromRight % 3 === 2;
          return (
            <React.Fragment key={i}>
              {gapBefore && <div className="pq-clsgap" />}
              <div className="pq-cell" style={{ animation: `pqUp .4s cubic-bezier(.22,1,.36,1) ${(0.18 + i * 0.05).toFixed(2)}s both` }}>
                <button type="button" className="pq-step" onClick={() => bump(i, +1)} disabled={isReview || checked}><IconUp /></button>
                <div className="pq-digit">{d}</div>
                <button type="button" className="pq-step" onClick={() => bump(i, -1)} disabled={isReview || checked}><IconDown /></button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="pq-live">
        <div className="pq-live-lbl">{t.live}</div>
        <div className={`pq-live-num ${checked && feedback?.correct ? 'on' : ''}`} style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{groupSpaces(val)}</div>
      </div>
      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
