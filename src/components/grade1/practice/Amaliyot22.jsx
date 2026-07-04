// Amaliyot22 (1-sinf) — P12 To'g'ri / noto'g'ri: 6 + 2 = 9? · Blok 1/2 · daraja 🟢 · teg: true_false
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash (To'g'ri / Noto'g'ri). Animatsiya: to'g'rida haqiqiy yig'indi olmalar bilan ochiladi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 6, B = 2;
const SHOWN = 9;             // yozilgan (xato) javob
const REAL = A + B;         // 8
const IS_TRUE = SHOWN === REAL;   // false
const DATA = { a: A, b: B, shown: SHOWN, real: REAL, isTrue: IS_TRUE, tag: 'true_false', level: '🟢', block: 1, ptype: 'P12' };

const T = {
  uz: {
    title: 'To\'g\'ri yoki noto\'g\'ri?',
    setup: 'Bola shunday yozdi: 6 + 2 = 9.',
    ask: 'Bu yozuv to\'g\'rimi yoki noto\'g\'rimi?',
    yes: 'To\'g\'ri', no: 'Noto\'g\'ri',
    correct: 'Barakalla! 6 va 2 — sakkiz, to\'qqiz emas. Yozuv noto\'g\'ri: 6 + 2 = 8.',
    wrong: 'Yana sana: 6 ga 2 qo\'shsang, 8 chiqadi. Demak yozuv noto\'g\'ri.',
  },
  ru: {
    title: 'Верно или неверно?',
    setup: 'Мальчик записал так: 6 + 2 = 9.',
    ask: 'Эта запись верная или неверная?',
    yes: 'Верно', no: 'Неверно',
    correct: 'Молодец! 6 и 2 — восемь, а не девять. Запись неверная: 6 + 2 = 8.',
    wrong: 'Посчитай ещё: 6 плюс 2 — будет 8. Значит запись неверная.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot22(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);   // 'yes' | 'no'
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
    const said = picked === 'yes';
    const correct = said === IS_TRUE;
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: [t.yes, t.no],
      studentAnswer: { value: picked }, correctAnswer: { value: IS_TRUE ? 'yes' : 'no' },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq22">
      <style>{`
        .aq22 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq22 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq22 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq22 .aq-setup { color:#5c6672; font-weight:500; }
        .aq22 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq22 .aq-claim { text-align:center; font-size:38px; font-weight:800; font-variant-numeric:tabular-nums;
          background:#f6f8fb; border:2px solid #e4e7ec; border-radius:16px; padding:16px; }
        .aq22 .aq-claim .bad { position:relative; display:inline-block; color:#374151; }
        .aq22 .aq-claim.checked .bad { color:#c0392b; }
        .aq22 .aq-claim.checked .bad::after { content:''; position:absolute; left:-3px; right:-3px; top:52%; height:4px; background:#c0392b; border-radius:2px; transform:rotate(-8deg); animation:aqStrike .35s ease both; }
        .aq22 .aq-verify { display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap; margin-top:12px; font-size:26px; font-weight:800; color:#1a7f43; animation:aqPop .35s ease both; }
        .aq22 .aq-dots { display:inline-flex; gap:3px; }
        .aq22 .aq-d { width:16px; height:16px; border-radius:50%; background:#5b8def; display:inline-block; }
        .aq22 .aq-d.b2 { background:#3aa66b; }
        .aq22 .aq-opts { display:flex; gap:14px; justify-content:center; margin-top:20px; }
        .aq22 .aq-opt { min-width:130px; height:66px; font-size:20px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; transition:border-color .12s, background .12s, transform .1s; }
        .aq22 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq22 .aq-opt:active:not(:disabled) { transform:scale(.95); }
        .aq22 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq22 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq22 .aq-opt:disabled { cursor:default; }
        .aq22 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq22 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq22 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqStrike { from{ transform:rotate(-8deg) scaleX(0);} to{ transform:rotate(-8deg) scaleX(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-claim' + (checked && !IS_TRUE ? ' checked' : '')}>
        {A} + {B} = <span className="bad">{SHOWN}</span>
      </div>
      {ok && (
        <div className="aq-verify">
          <span className="aq-dots">{Array.from({ length: A }).map((_, i) => <span key={i} className="aq-d" />)}</span>
          <span>+</span>
          <span className="aq-dots">{Array.from({ length: B }).map((_, i) => <span key={i} className="aq-d b2" />)}</span>
          <span>= {REAL}</span>
        </div>
      )}

      <div className="aq-opts">
        <button type="button" className={'aq-opt' + (!IS_TRUE && ok ? '' : '') + (picked === 'yes' ? ' sel' : '') + (ok && IS_TRUE && picked === 'yes' ? ' right' : '')}
          disabled={lock} onClick={() => { setPicked('yes'); setFeedback(null); }}>{t.yes}</button>
        <button type="button" className={'aq-opt' + (picked === 'no' ? ' sel' : '') + (ok && !IS_TRUE ? ' right' : '')}
          disabled={lock} onClick={() => { setPicked('no'); setFeedback(null); }}>{t.no}</button>
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
