// Amaliyot20 (1-sinf) — P14 Amal tanlash: qo'shish (+) yoki ayirish (−)? · Blok 6 · daraja 🟡 · teg: choose_op
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash (belgi). Animatsiya: to'g'rida 2 olma yeb ketiladi → 4 qoladi, 6 − 2 = 4.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const HAD = 6, GONE = 2;
const REST = HAD - GONE;      // 4
const ANSWER = '−';           // yeyish — ayirish
const OPTIONS = ['+', '−'];
const DATA = { answer: ANSWER, tag: 'choose_op', level: '🟡', block: 6, ptype: 'P14' };

const T = {
  uz: {
    title: 'Qaysi amal?',
    setup: 'Savatda 6 ta olma bor edi. Bola 2 tasini yeb qo\'ydi.',
    ask: 'Bu qo\'shish (+) mi, ayirish (−) mi?',
    correct: 'Barakalla! Yeb qo\'ydi — olma kamaydi. Bu ayirish: 6 − 2 = 4.',
    wrong: 'Olma kamaydi, ko\'paymadi. Yeyish — ayirish (−), qo\'shish emas.',
  },
  ru: {
    title: 'Какое действие?',
    setup: 'В корзине было 6 яблок. Мальчик съел 2 из них.',
    ask: 'Это сложение (+) или вычитание (−)?',
    correct: 'Молодец! Съел — яблок стало меньше. Это вычитание: 6 − 2 = 4.',
    wrong: 'Яблок стало меньше, а не больше. Съесть — это вычитание (−).',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot20(props) {
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
    <div className="aq aq20">
      <style>{`
        .aq20 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq20 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq20 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq20 .aq-setup { color:#5c6672; font-weight:500; }
        .aq20 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq20 .aq-basket { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; padding:16px; background:#fbf7ef; border:2px solid #efe6d4; border-radius:16px; min-height:54px; }
        .aq20 .aq-basket.win { animation:aqCele .5s ease; }
        .aq20 .aq-apple { font-size:36px; line-height:1; animation:aqPop .3s ease both; }
        .aq20 .aq-apple.gone { opacity:.2; filter:grayscale(1); animation:aqLeave .5s ease both; }
        .aq20 .aq-eq { text-align:center; font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; margin-top:12px; color:#1a7f43; animation:aqPop .35s ease both; }
        .aq20 .aq-signs { display:flex; gap:16px; justify-content:center; margin-top:20px; }
        .aq20 .aq-sign { width:88px; height:76px; font-size:40px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; transition:border-color .12s, background .12s, transform .1s; }
        .aq20 .aq-sign:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq20 .aq-sign:active:not(:disabled) { transform:scale(.94); }
        .aq20 .aq-sign.sel { border-color:#2563eb; background:#e8eefc; }
        .aq20 .aq-sign.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq20 .aq-sign:disabled { cursor:default; }
        .aq20 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq20 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq20 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqLeave { 0%{opacity:1; transform:translateY(0) scale(1);} 100%{opacity:.2; transform:translateY(-20px) scale(.7);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-basket' + (ok ? ' win' : '')}>
        {Array.from({ length: HAD }).map((_, i) => (
          <span key={i} className={'aq-apple' + (ok && i >= REST ? ' gone' : '')} style={{ animationDelay: `${i * 0.05}s` }}>🍎</span>
        ))}
      </div>
      {ok && <div className="aq-eq">{HAD} − {GONE} = {REST}</div>}

      <div className="aq-signs">
        {OPTIONS.map((s) => {
          const right = ok && s === ANSWER;
          return (
            <button key={s} type="button" className={'aq-sign' + (right ? ' right' : picked === s ? ' sel' : '')} disabled={lock}
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
