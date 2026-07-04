// Amaliyot16 (1-sinf) — P25 Ikki qadamli masala: 4+3, keyin −2 · Blok 6 · daraja 🔴 · teg: two_step
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-bosqichlar (avval yig'indi, keyin qoldiq). Animatsiya: to'g'rida 2 olma chiqib ketadi → 5 qoladi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const ADD1 = 4, ADD2 = 3, TAKE = 2;
const SUM = ADD1 + ADD2;      // 7
const REST = SUM - TAKE;      // 5
const SUM_OPTS = [6, 7, 8];
const REST_OPTS = [4, 5, 6];
const DATA = { sum: SUM, rest: REST, tag: 'two_step', level: '🔴', block: 6, ptype: 'P25' };

const T = {
  uz: {
    title: 'Ikki qadamli masala',
    setup: 'Savatga 4 ta, keyin yana 3 ta olma solindi. So\'ng 2 tasi berib yuborildi.',
    ask: 'Oxirida nechta olma qoldi?',
    step1: '1-qadam. Avval nechta bo\'ldi? (4 + 3)',
    step2: '2-qadam. Keyin 2 tasi ketdi. Nechta qoldi? (7 − 2)',
    correct: 'Barakalla! Avval 4 + 3 = 7, keyin 7 − 2 = 5. 5 ta qoldi.',
    wrong1: 'Avval qo\'shamiz: 4 va 3 birga nechta? 5, 6, 7.',
    wrong2: '7 tadan 2 tasi ketdi. 7 − 2 ni sana.',
  },
  ru: {
    title: 'Двухшаговая задача',
    setup: 'В корзину положили 4, потом ещё 3 яблока. Затем 2 отдали.',
    ask: 'Сколько яблок осталось в конце?',
    step1: 'Шаг 1. Сколько стало сначала? (4 + 3)',
    step2: 'Шаг 2. Потом 2 забрали. Сколько осталось? (7 − 2)',
    correct: 'Молодец! Сначала 4 + 3 = 7, потом 7 − 2 = 5. Осталось 5.',
    wrong1: 'Сначала складываем: 4 и 3 вместе сколько? 5, 6, 7.',
    wrong2: 'Из 7 забрали 2. Посчитай 7 − 2.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot16(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [sum, setSum] = useState(null);
  const [rest, setRest] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.sum != null) setSum(sa.sum);
      if (sa.rest != null) setRest(sa.rest);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(sum !== null && rest !== null && !checked); }, [sum, rest, checked, onReady]);

  const check = useCallback(() => {
    if (sum === null || rest === null) return;
    const correct = sum === SUM && rest === REST;
    const msg = correct ? t.correct : (sum !== SUM ? t.wrong1 : t.wrong2);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: REST_OPTS.map(String),
      studentAnswer: { sum, rest }, correctAnswer: { sum: SUM, rest: REST },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [sum, rest, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const stage2 = sum !== null;

  return (
    <div className="aq aq16">
      <style>{`
        .aq16 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq16 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq16 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 12px; }
        .aq16 .aq-setup { color:#5c6672; font-weight:500; }
        .aq16 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq16 .aq-basket { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; padding:14px; background:#fbf7ef; border:2px solid #efe6d4; border-radius:16px; min-height:52px; margin-bottom:12px; }
        .aq16 .aq-basket.win { animation:aqCele .5s ease; }
        .aq16 .aq-apple { font-size:32px; line-height:1; animation:aqPop .3s ease both; }
        .aq16 .aq-apple.gone { opacity:.22; filter:grayscale(1); animation:aqLeave .5s ease both; }
        .aq16 .aq-step { padding:12px 14px; border-radius:16px; background:#f6f8fb; margin-bottom:10px; }
        .aq16 .aq-step.off { opacity:.4; }
        .aq16 .aq-q { font-size:15px; font-weight:600; color:#374151; margin-bottom:9px; }
        .aq16 .aq-opts { display:flex; gap:10px; }
        .aq16 .aq-opt { min-width:60px; height:58px; padding:0 8px; font-size:24px; font-weight:800; border-radius:14px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq16 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq16 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq16 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq16 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .aq16 .aq-opt:disabled { cursor:default; }
        .aq16 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq16 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq16 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqLeave { 0%{opacity:1; transform:translateY(0) scale(1);} 100%{opacity:.22; transform:translateY(-18px) scale(.7);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-basket' + (ok ? ' win' : '')}>
        {Array.from({ length: SUM }).map((_, i) => (
          <span key={i} className={'aq-apple' + (ok && i >= REST ? ' gone' : '')} style={{ animationDelay: `${i * 0.05}s` }}>🍎</span>
        ))}
      </div>

      <div className="aq-step">
        <div className="aq-q">{t.step1}</div>
        <div className="aq-opts">
          {SUM_OPTS.map((n) => (
            <button key={n} type="button" className={'aq-opt' + (ok && n === SUM ? ' right' : sum === n ? ' sel' : '')}
              disabled={lock} onClick={() => { setSum(n); setRest(null); setFeedback(null); }}>{n}</button>
          ))}
        </div>
      </div>

      <div className={'aq-step' + (stage2 ? '' : ' off')}>
        <div className="aq-q">{t.step2}</div>
        <div className="aq-opts">
          {REST_OPTS.map((n) => (
            <button key={n} type="button" className={'aq-opt' + (ok && n === REST ? ' right' : rest === n ? ' sel' : '')}
              disabled={lock || !stage2} onClick={() => { setRest(n); setFeedback(null); }}>{n}</button>
          ))}
        </div>
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
