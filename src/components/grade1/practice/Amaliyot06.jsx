// Amaliyot06 (1-sinf) — P8 O'nlikdan o'tib qo'shish: 8 + 5 bosqichma-bosqich · Blok 4 · daraja 🔴 · teg: bridge_ten
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-bosqichlar. Animatsiya: ikki o'nlik ramka — 8+2 birinchi ramkani to'ldiradi, qolgan 3 ikkinchida → 13. Ko'prik ko'rinadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 8, B = 5;
const NEED = 10 - A;          // 2
const REST = B - NEED;        // 3
const SUM = A + B;            // 13
const ADD_OPTS = [1, 2, 3];
const SUM_OPTS = [12, 13, 14];
const DATA = { a: A, b: B, need: NEED, rest: REST, sum: SUM, tag: 'bridge_ten', level: '🔴', block: 4, ptype: 'P8' };

const T = {
  uz: {
    title: "O'nlikdan o'tish",
    setup: '8 ga 5 ni birdan qo\'shish qiyin. O\'nlikdan o\'tib hisoblaymiz.',
    ask: 'Ikki qadamda 8 + 5 ni hisobla.',
    step1: '1-qadam. 8 ni 10 gacha to\'ldir. Yana nechta?',
    step2: '2-qadam. 10 ga qolganini qo\'sh. Nechta bo\'ldi?',
    restNote: `5 ni ${NEED} va ${REST} ga ajratdik. 8 + ${NEED} = 10.`,
    correct: 'Barakalla! 8 + 2 = 10, keyin 10 + 3 = 13.',
    wrong1: '8 ni 10 gacha to\'ldirishga yana 2 kerak. 8 dan 10 gacha sana.',
    wrong2: 'Yig\'indi 13. 10 ga qolgan 3 ni qo\'sh: 10 + 3.',
  },
  ru: {
    title: 'Переход через десяток',
    setup: 'Сразу прибавить 5 к 8 трудно. Посчитаем через десяток.',
    ask: 'Посчитай 8 + 5 в два шага.',
    step1: 'Шаг 1. Дополни 8 до 10. Сколько ещё?',
    step2: 'Шаг 2. Прибавь к 10 остаток. Сколько получилось?',
    restNote: `Разбили 5 на ${NEED} и ${REST}. 8 + ${NEED} = 10.`,
    correct: 'Молодец! 8 + 2 = 10, потом 10 + 3 = 13.',
    wrong1: 'Чтобы дополнить 8 до 10, нужно ещё 2. Досчитай от 8 до 10.',
    wrong2: 'Сумма 13. Прибавь остаток 3: 10 + 3.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// bir o'nlik ramka (2×5): blue = boshlang'ich, green = qo'shilgan, target = pulslaydigan bo'sh
const Frame = ({ blue, green, targetFrom }) => (
  <div className="aq-frame">
    {Array.from({ length: 10 }).map((_, i) => {
      const isBlue = i < blue;
      const isGreen = i >= blue && i < blue + green;
      const isTarget = targetFrom != null && i >= targetFrom && i < 10;
      return (
        <div key={i} className={'aq-cell' + (isTarget ? ' target' : '')}>
          {isBlue && <span className="aq-dot" />}
          {isGreen && <span className="aq-dot add" style={{ animationDelay: `${(i - blue) * 0.13}s` }} />}
        </div>
      );
    })}
  </div>
);

export default function Amaliyot06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [add, setAdd] = useState(null);
  const [sum, setSum] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.add != null) setAdd(sa.add);
      if (sa.sum != null) setSum(sa.sum);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(add !== null && sum !== null && !checked); }, [add, sum, checked, onReady]);

  const check = useCallback(() => {
    if (add === null || sum === null) return;
    const correct = add === NEED && sum === SUM;
    const msg = correct ? t.correct : (add !== NEED ? t.wrong1 : t.wrong2);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A} + ${B} = ?`, options: SUM_OPTS.map(String),
      studentAnswer: { add, sum }, correctAnswer: { add: NEED, sum: SUM },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [add, sum, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const stage2 = add !== null;
  // vizual holat: step1 to'g'ri tanlansa 1-ramka to'ladi; ok bo'lsa 2-ramkada REST
  const bridged = add === NEED;

  return (
    <div className="aq aq06">
      <style>{`
        .aq06 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq06 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq06 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 12px; }
        .aq06 .aq-setup { color:#5c6672; font-weight:500; }
        .aq06 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq06 .aq-frames { display:flex; gap:14px; align-items:center; justify-content:center; flex-wrap:wrap; margin-bottom:6px; }
        .aq06 .aq-frame { display:grid; grid-template-columns:repeat(5, 26px); grid-auto-rows:26px; gap:4px; padding:8px; background:#f6f8fb; border-radius:12px; }
        .aq06 .aq-cell { border-radius:7px; border:2px solid #d6dae3; }
        .aq06 .aq-cell.target { border-color:#f0b046; border-style:dashed; animation:aqPulse 1.1s ease-in-out infinite; }
        .aq06 .aq-dot { width:100%; height:100%; border-radius:50%; background:#5b8def; display:block; animation:aqPop .25s ease both; }
        .aq06 .aq-dot.add { background:#3aa66b; animation:aqEnter .38s cubic-bezier(.3,1.4,.5,1) both; }
        .aq06 .aq-plus { font-size:24px; font-weight:800; color:#9aa1ad; }
        .aq06 .aq-res { text-align:center; font-size:30px; font-weight:800; font-variant-numeric:tabular-nums; margin:2px 0 12px; }
        .aq06 .aq-res b { color:#1a7f43; }
        .aq06 .aq-res.win { animation:aqCele .5s ease; }
        .aq06 .aq-step { padding:12px 14px; border-radius:16px; background:#f6f8fb; margin-bottom:10px; }
        .aq06 .aq-step.off { opacity:.4; }
        .aq06 .aq-q { font-size:15px; font-weight:600; color:#374151; margin-bottom:9px; }
        .aq06 .aq-opts { display:flex; gap:10px; }
        .aq06 .aq-opt { min-width:60px; height:58px; padding:0 8px; font-size:24px; font-weight:800; border-radius:14px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq06 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq06 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq06 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq06 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .aq06 .aq-opt:disabled { cursor:default; }
        .aq06 .aq-note { margin-top:10px; font-size:13.5px; color:#2563eb; font-weight:600; }
        .aq06 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq06 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq06 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqEnter { 0%{opacity:0; transform:translateY(-20px) scale(.5);} 100%{opacity:1; transform:translateY(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(240,176,70,.5);} 50%{ box-shadow:0 0 0 4px rgba(240,176,70,0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-frames">
        <Frame blue={A} green={bridged ? NEED : 0} targetFrom={bridged ? null : A} />
        <span className="aq-plus">+</span>
        <Frame blue={0} green={ok ? REST : 0} targetFrom={null} />
      </div>
      <div className={'aq-res' + (ok ? ' win' : '')}>{A} + {B} = <b>{ok ? SUM : '?'}</b></div>

      <div className="aq-step">
        <div className="aq-q">{t.step1}</div>
        <div className="aq-opts">
          {ADD_OPTS.map((n) => (
            <button key={n} type="button"
              className={'aq-opt' + (ok && n === NEED ? ' right' : add === n ? ' sel' : '')}
              disabled={lock} onClick={() => { setAdd(n); setSum(null); setFeedback(null); }}>{n}</button>
          ))}
        </div>
        {add !== null && <div className="aq-note">{t.restNote}</div>}
      </div>

      <div className={'aq-step' + (stage2 ? '' : ' off')}>
        <div className="aq-q">{t.step2}</div>
        <div className="aq-opts">
          {SUM_OPTS.map((n) => (
            <button key={n} type="button"
              className={'aq-opt' + (ok && n === SUM ? ' right' : sum === n ? ' sel' : '')}
              disabled={lock || !stage2} onClick={() => { setSum(n); setFeedback(null); }}>{n}</button>
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
