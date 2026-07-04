// Amaliyot18 (1-sinf) — P5 Qatordagi bo'sh joy: 2 3 4 _ 6 7 · Blok 1/3 · daraja 🟡 · teg: sequence_gap
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'rida bo'sh katak to'ladi + qo'shnilar pulslaydi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [2, 3, 4, null, 6, 7];   // null — bo'sh joy
const GAP_IDX = SEQ.indexOf(null);
const ANSWER = 5;
const OPTIONS = [4, 5, 6];
const DATA = { answer: ANSWER, tag: 'sequence_gap', level: '🟡', block: 1, ptype: 'P5' };

const T = {
  uz: {
    title: 'Qatordagi bo\'sh joy',
    setup: 'Sonlar tartib bilan ketyapti, lekin bittasi tushib qolgan.',
    ask: 'Bo\'sh katakka qaysi son keladi?',
    correct: 'Barakalla! 4 dan keyin 5 keladi: 4, 5, 6.',
    less: 'Kam. 4 dan keyingi son — undan bitta katta.',
    more: 'Ko\'p. 6 dan oldingi son — undan bitta kichik.',
  },
  ru: {
    title: 'Пропуск в ряду',
    setup: 'Числа идут по порядку, но одно потерялось.',
    ask: 'Какое число подходит в пустую клетку?',
    correct: 'Молодец! После 4 идёт 5: 4, 5, 6.',
    less: 'Мало. Число после 4 — на одно больше.',
    more: 'Много. Число перед 6 — на одно меньше.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot18(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === ANSWER;
    const msg = correct ? t.correct : (picked < ANSWER ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: ANSWER },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq18">
      <style>{`
        .aq18 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq18 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq18 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq18 .aq-setup { color:#5c6672; font-weight:500; }
        .aq18 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq18 .aq-row { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
        .aq18 .aq-num { width:56px; height:64px; border-radius:14px; background:#f6f8fb; border:2px solid #e4e7ec;
          display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; color:#374151; font-variant-numeric:tabular-nums; }
        .aq18 .aq-gap { border-style:dashed; border-color:#b9c1cf; color:#2563eb; animation:aqPulse 1.1s ease-in-out infinite; }
        .aq18 .aq-gap.filled { border-style:solid; border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqPop .35s ease both; }
        .aq18 .aq-num.near { border-color:#9bb6f0; }
        .aq18 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq18 .aq-opt { width:66px; height:66px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq18 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq18 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq18 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq18 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq18 .aq-opt:disabled { cursor:default; }
        .aq18 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq18 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq18 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(37,99,235,.4);} 50%{ box-shadow:0 0 0 5px rgba(37,99,235,0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-row">
        {SEQ.map((n, i) => {
          if (n === null) {
            return <div key={i} className={'aq-num aq-gap' + (ok ? ' filled' : '')}>{ok ? ANSWER : '?'}</div>;
          }
          const near = Math.abs(i - GAP_IDX) === 1;
          return <div key={i} className={'aq-num' + (near ? ' near' : '')}>{n}</div>;
        })}
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === ANSWER;
          return (
            <button key={n} type="button" className={'aq-opt' + (right ? ' right' : picked === n ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
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
