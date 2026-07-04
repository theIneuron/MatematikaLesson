// Amaliyot13 (1-sinf) — P17 Qonuniyat: qatorni davom ettir · Blok 6 / ИК · daraja 🟡 · teg: pattern
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'ri javobda bo'sh katak to'ladi + butun qator pulslaydi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// takrorlanuvchi tartib: ko'k, qizil, ko'k, qizil, ko'k, __ → qizil
const SEQ = ['🟦', '🔴', '🟦', '🔴', '🟦'];
const ANSWER = '🔴';
const OPTIONS = ['🔴', '🟦', '🟡'];
const DATA = { answer: ANSWER, tag: 'pattern', level: '🟡', block: 6, ptype: 'P17' };

const T = {
  uz: {
    title: 'Qonuniyat',
    setup: 'Shakllar ma\'lum tartibda takrorlanadi: ko\'k, qizil, ko\'k, qizil...',
    ask: 'Qatorni davom ettir — keyingi shakl qaysi?',
    correct: 'Barakalla! Tartib takrorlanadi: keyin qizil keladi.',
    wrong: 'Tartibga qara: ko\'k, qizil, ko\'k, qizil... Oxirgi ko\'kdan keyin nima keladi?',
  },
  ru: {
    title: 'Закономерность',
    setup: 'Фигуры повторяются по порядку: синий, красный, синий, красный...',
    ask: 'Продолжи ряд — какая фигура следующая?',
    correct: 'Молодец! Порядок повторяется: дальше идёт красный.',
    wrong: 'Посмотри на порядок: синий, красный, синий, красный... Что после синего?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot13(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (!picked) return;
    const correct = picked === ANSWER;
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS,
      studentAnswer: { value: picked }, correctAnswer: { value: ANSWER },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq13">
      <style>{`
        .aq13 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq13 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq13 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq13 .aq-setup { color:#5c6672; font-weight:500; }
        .aq13 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq13 .aq-seq { display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:wrap; padding:16px; background:#f6f8fb; border-radius:16px; }
        .aq13 .aq-seq.win { animation:aqCele .5s ease; }
        .aq13 .aq-item { font-size:40px; line-height:1; animation:aqPop .3s ease both; }
        .aq13 .aq-blank { width:52px; height:52px; border-radius:14px; border:3px dashed #b9c1cf; display:flex; align-items:center; justify-content:center; font-size:38px; animation:aqPulse 1.1s ease-in-out infinite; }
        .aq13 .aq-blank.filled { border-style:solid; border-color:#1a7f43; background:#e8f7ee; animation:aqPop .35s ease both; }
        .aq13 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq13 .aq-opt { width:70px; height:70px; font-size:36px; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; cursor:pointer; transition:border-color .12s, background .12s, transform .1s; display:flex; align-items:center; justify-content:center; }
        .aq13 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq13 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq13 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq13 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; animation:aqCele .5s ease; }
        .aq13 .aq-opt:disabled { cursor:default; }
        .aq13 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq13 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq13 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.04);} 60%{transform:scale(.98);} 100%{transform:scale(1);} }
        @keyframes aqPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(240,176,70,.5);} 50%{ box-shadow:0 0 0 5px rgba(240,176,70,0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-seq' + (ok ? ' win' : '')}>
        {SEQ.map((s, i) => <span key={i} className="aq-item" style={{ animationDelay: `${i * 0.07}s` }}>{s}</span>)}
        <span className={'aq-blank' + (ok ? ' filled' : '')}>{ok ? ANSWER : '?'}</span>
      </div>

      <div className="aq-opts">
        {OPTIONS.map((s) => {
          const right = ok && s === ANSWER;
          return (
            <button key={s} type="button" className={'aq-opt' + (right ? ' right' : picked === s ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(s); setFeedback(null); }}>{s}</button>
          );
        })}
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
