// Amaliyot08 (1-sinf) — P13 Xatoni top: 53 + 4 = 93? · Blok 5 · daraja 🔴 · teg: find_error
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: xato javob titraydi va chiziladi, to'g'ri javob o'rniga siljib chiqadi. O'z-o'zini nazorat.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 53, B = 4;
const SHOWN = 93;             // xato javob (o'nlik/birlik chalkashgan)
const RIGHT = A + B;         // 57
const OPTIONS = [49, 57, 93];
const DATA = { a: A, b: B, shown: SHOWN, right: RIGHT, tag: 'find_error', level: '🔴', block: 5, ptype: 'P13' };

const T = {
  uz: {
    title: 'Xatoni top',
    setup: 'Kimdir 53 ga 4 ni qo\'shib, javobni 93 deb yozdi. Lekin bu yerda xato bor.',
    ask: 'To\'g\'ri javob qaysi?',
    correct: 'Barakalla! 4 ni faqat birliklarga qo\'shamiz: 3 + 4 = 7. 53 + 4 = 57.',
    wrongShown: 'Bu — xato javob. 4 ni o\'nliklarga qo\'shib bo\'lmaydi, faqat birliklarga: 3 + 4.',
    wrongOther: 'Yaqin emas. O\'nlik 5 joyida qoladi, birlik 3 + 4 = 7.',
  },
  ru: {
    title: 'Найди ошибку',
    setup: 'Кто-то прибавил к 53 число 4 и записал ответ 93. Но здесь ошибка.',
    ask: 'Какой ответ верный?',
    correct: 'Молодец! 4 прибавляем только к единицам: 3 + 4 = 7. 53 + 4 = 57.',
    wrongShown: 'Это ошибочный ответ. 4 нельзя прибавлять к десяткам, только к единицам: 3 + 4.',
    wrongOther: 'Не совсем. Десяток 5 остаётся, единицы 3 + 4 = 7.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot08(props) {
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
    const correct = picked === RIGHT;
    const msg = correct ? t.correct : (picked === SHOWN ? t.wrongShown : t.wrongOther);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A} + ${B} = ${SHOWN} — ?`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: RIGHT },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq08">
      <style>{`
        .aq08 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq08 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq08 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq08 .aq-setup { color:#5c6672; font-weight:500; }
        .aq08 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq08 .aq-eqbox { display:flex; align-items:center; justify-content:center; gap:14px; }
        .aq08 .aq-wrong { text-align:center; font-size:36px; font-weight:800; font-variant-numeric:tabular-nums;
          background:#fdf0f0; border:2px dashed #e6a6a6; border-radius:16px; padding:16px 22px; color:#374151; }
        .aq08 .aq-wrong.shake { animation:aqShake .5s ease; }
        .aq08 .aq-wrong .bad { color:#c0392b; position:relative; display:inline-block; }
        .aq08 .aq-wrong .bad.struck::after { content:''; position:absolute; left:-4px; right:-4px; top:52%; height:4px; background:#c0392b; border-radius:2px; transform:rotate(-8deg); animation:aqStrike .35s ease both; }
        .aq08 .aq-fix { display:flex; align-items:center; gap:8px; font-size:32px; font-weight:800; color:#1a7f43; animation:aqSlideIn .4s cubic-bezier(.3,1.3,.5,1) both; }
        .aq08 .aq-arrow { font-size:26px; color:#9aa1ad; }
        .aq08 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq08 .aq-opt { width:76px; height:70px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq08 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq08 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq08 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq08 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq08 .aq-opt:disabled { cursor:default; }
        .aq08 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq08 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq08 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqShake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-7px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(3px);} }
        @keyframes aqStrike { from{ transform:rotate(-8deg) scaleX(0);} to{ transform:rotate(-8deg) scaleX(1);} }
        @keyframes aqSlideIn { 0%{opacity:0; transform:translateX(-18px) scale(.7);} 100%{opacity:1; transform:translateX(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-eqbox">
        <div className={'aq-wrong' + (ok ? ' shake' : '')}>{A} + {B} = <span className={'bad' + (ok ? ' struck' : '')}>{SHOWN}</span></div>
        {ok && <><span className="aq-arrow">→</span><div className="aq-fix">{RIGHT}</div></>}
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === RIGHT;
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
