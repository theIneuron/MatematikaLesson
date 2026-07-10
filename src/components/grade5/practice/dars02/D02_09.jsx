// Dars02 · Amaliyot 09 — To'g'ri yaxlitlash · 🔴 · Madina · tag: round_error_check
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { correct: 0, tag: 'round_error_check', level: '🔴' };
const T = {
  uz: {
    eyebrow: 'Xato top', title: "To'g'ri yaxlitlash",
    setup: "Madina to'rt xil yaxlitlash yozdi. Bittasi to'g'ri.",
    ask: "Qaysi yaxlitlash to'g'ri bajarilgan?",
    opts: [
      '45 849 ≈ 45 800 (yuzlargacha)',
      "238 ≈ 230 (o'nlargacha)",
      '1 206 845 ≈ 1 206 000 (minglargacha)',
      '5879 ≈ 5000 (minglargacha)',
    ],
    correct: "To'g'ri. 45 849 ≈ 45 800 to'g'ri (keyingi raqam 4). Qolganlari xato: 238 ≈ 240, 1 206 845 ≈ 1 207 000, 5879 ≈ 6000.",
    wrongMsg: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
  },
  ru: {
    eyebrow: 'Найди ошибку', title: 'Верное округление',
    setup: 'Мадина записала четыре округления. Одно верное.',
    ask: 'Какое округление выполнено верно?',
    opts: [
      '45 849 ≈ 45 800 (до сотен)',
      '238 ≈ 230 (до десятков)',
      '1 206 845 ≈ 1 206 000 (до тысяч)',
      '5879 ≈ 5000 (до тысяч)',
    ],
    correct: 'Верно. 45 849 ≈ 45 800 верно (следующая цифра 4). Остальные неверны: 238 ≈ 240, 1 206 845 ≈ 1 207 000, 5879 ≈ 6000.',
    wrongMsg: 'Пока неверно. Подумайте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D02_09(props) {
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
      correct, meta: { tag: DATA.tag, level: DATA.level },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const optStyle = (i) => {
    const active = picked === i; const show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    let anim;
    if (!checked) anim = `pqUp .45s cubic-bezier(.22,1,.36,1) ${(0.22 + i * 0.07).toFixed(2)}s both`;
    else if (i === DATA.correct) anim = 'pqPop .5s cubic-bezier(.34,1.56,.64,1) both';
    else if (active) anim = 'pqShake .4s both';
    else anim = 'none';
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', animation: anim, transition: 'background .3s, border-color .3s, color .3s' };
  };

  return (
    <div className="pq pq09">
      <style>{`
        .pq09 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq09 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq09 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 12px; color:#374151; }
        .pq09 .pq-ask { font-size:17px; font-weight:700; margin:0 0 12px; }
        .pq09 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq09 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq09 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq09 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq09 .a2 { animation-delay:.08s; }
        .pq09 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.06);} 100%{transform:scale(1);} }
        @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
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
