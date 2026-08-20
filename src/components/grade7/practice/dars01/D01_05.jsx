// Dars01 · Amaliyot 05 — Qiymatni yozish · 🟡 · tag: write_value
// 5-sinf faylining nusxasi, matematikasi 7-sinfga o'tkazildi. MEXANIKA
// O'ZGARMADI: javob klaviaturadan kiritiladi (raqamli klaviatura, sistema
// klaviaturasi ko'tarilmaydi). 5-sinfda so'z bilan aytilgan son yozilardi,
// bu yerda esa YOZUVNING QIYMATI.
//
// Kiritilgan sonning JONLI ko'rinishi olib tashlandi: 5-sinfda kiritilgan
// raqamlar pastda bo'shliqlar bilan qayta ko'rsatilardi, bu yerda esa u
// javobni ikki marta yozish bo'lardi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react importi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 700; // 12,5 · 40 − 1800 : (−9) = 500 − (−200) = 700
const DATA = { tag: 'write_value', level: '🟡', expr: '12,5 · 40 − 1800 : (−9)' };
const T = {
  uz: {
    eyebrow: 'Qiymatni topish', title: 'Qiymatni yozish',
    setup: 'Yozuvning qiymatini hisoblab, javobni raqam bilan kiriting:',
    words: '12,5 · 40 − 1800 : (−9)',
    label: 'Qiymatni yozing:',
    live: 'Sizning javobingiz:',
    correct: "To'g'ri. Avval ikkinchi bosqich: 12,5 · 40 = 500 va 1800 : (−9) = −200. So'ng 500 − (−200) = 700.",
    wrong: "Maslahat: avval ko'paytirish va bo'lishni hisoblang. Manfiy sonni ayirish -- uni qo'shish bilan bir xil: 500 − (−200) = 500 + 200.",
  },
  ru: {
    eyebrow: 'Найти значение', title: 'Записать значение',
    setup: 'Посчитай значение записи и введи ответ цифрами:',
    words: '40 : 5 + 3 · 2',
    label: 'Запиши значение:',
    live: 'Твой ответ:',
    correct: 'Верно. Сначала вторая ступень: 12,5 · 40 = 500 и 1800 : (−9) = −200. Затем 500 − (−200) = 700.',
    wrong: 'Подсказка: сначала посчитай умножение и деление. Вычесть отрицательное — то же, что прибавить: 500 − (−200) = 500 + 200.',
  },
  en: {
    eyebrow: 'Find the value', title: 'Write the value',
    setup: 'Work out the value of the record and type the answer in digits:',
    words: '40 : 5 + 3 · 2',
    label: 'Write the value:',
    live: 'Your answer:',
    correct: 'Correct. Second stage first: 12,5 · 40 = 500 and 1800 : (−9) = −200. Then 500 − (−200) = 700.',
    wrong: 'Hint: work out the multiplication and the division first. Subtracting a negative is the same as adding: 500 − (−200) = 500 + 200.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');
const groupSpaces = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function D01_05(props) {
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
    const correct = v === TARGET;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.setup + ' ' + t.words, options: [],
      studentAnswer: { value: v }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level },
    });
  }, [val, playCorrect, playWrong, onSubmit, t.setup, t.words]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const preview = cleanInt(val) ? groupSpaces(cleanInt(val)) : '—';
  return (
    <div className="pq pq05">
      <style>{`
        .pq05 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq05 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#fe5b1a; text-transform:uppercase; }
        .pq05 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 6px; color:#374151; }
        .pq05 .pq-words { font-size:22px; font-weight:800; color:#fe5b1a; margin:2px 0 18px; }
        .pq05 .pq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .pq05 input.pq-input { width:100%; box-sizing:border-box; font-size:24px; font-weight:800; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .pq05 input.pq-input:focus { border-color:#fb7a45; background:#fff; }
        .pq05 input.pq-input:disabled { opacity:.85; }
        .pq05 .pq-live { text-align:center; margin:12px 0 2px; }
        .pq05 .pq-live-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
        .pq05 .pq-live-num { font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; letter-spacing:.02em; }
        .pq05 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:10px; padding:10px 13px; border-radius:12px; font-size:14.5px; line-height:1.4; font-weight:600; animation:pqIn .45s ease both; }
        .pq05 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq05 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq05 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq05 .a2 { animation-delay:.08s; }
        .pq05 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
        @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <p className="pq-words a a3">{t.words}</p>
      <label className="pq-label" htmlFor="pq05-in">{t.label}</label>
      <input id="pq05-in" className="pq-input" value={val} onChange={(e) => setVal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" disabled={isReview || checked} placeholder="0" />
      {/* Kiritilgan sonni pastda QAYTA ko'rsatish takror bo'lardi: u
          maydonning o'zida turadi. Shuning uchun bu blok faqat
          tekshirishdan keyin, va u javobni EMAS, natijani bildiradi. */}
      <div className="pq-live">
        {checked ? (
          <>
            <div className="pq-live-lbl">{t.live}</div>
            <div className="pq-live-num" style={{ color: feedback?.correct ? '#1a7f43' : '#c0392b' }}>{preview}</div>
          </>
        ) : null}
      </div>
      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
