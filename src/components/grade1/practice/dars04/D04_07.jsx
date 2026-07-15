// Dars04 · Amaliyot 07 — P4 Belgilar zanjiri · 🔴 · Zuhra · tag: sign_chain
// Uch juftga birdaniga belgi qo'yish (5_8, 9_6, 7_7). Tekshiruvda har qator rangi bilan
// (yashil/qizil) ko'rsatiladi — qaysi qator xato, lekin to'g'ri belgi AYTILMAYDI.
// Vizual: uchta chizilgan SVG to'ti (qizil/ko'k/yashil), shoxchada, pqSway + dum-tebranish.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PAIRS = [[5, 8], [9, 6], [7, 7]];
const SIGNS = ['>', '=', '<'];
const signFor = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
const DATA = { ptype: 'P4', level: '🔴', tag: 'sign_chain' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Zuhra', title: 'Belgilar zanjiri',
    setup: 'To\'tilar uchta savol tayyorlashdi — uchalasiga ham belgi kerak.',
    ask: 'Har juft songa to\'g\'ri belgini qo\'ying.',
    correct: 'Barakalla! Uchala belgi to\'g\'ri — to\'tilar qiyqirib maqtadi.',
    hint: 'Qizil qatorlarni yana ko\'ring: avval qaysi son katta — shuni ayting.',
  },
  ru: {
    eyebrow: 'Зоопарк · Зухра', title: 'Цепочка знаков',
    setup: 'Попугаи приготовили три вопроса — всем трём нужен знак.',
    ask: 'Поставь верный знак в каждой паре чисел.',
    correct: 'Молодец! Все три знака верны — попугаи кричат от радости.',
    hint: 'Посмотри на красные строки ещё раз: сначала скажи, какое число больше.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uch to'tining rang palitralari: tana / qorin (ochroq) / qanot (quyuqroq) / pat-chiziq (och ton).
const PARROTS = [
  { body: '#d9534b', belly: '#f0918a', wing: '#a93a33', feather: '#f3b3ad' }, // qizil
  { body: '#4f8fc4', belly: '#a8cbe8', wing: '#33648f', feather: '#9ec9ec' }, // ko'k
  { body: '#57a84f', belly: '#a9d8a0', wing: '#3c7d36', feather: '#a5d99c' }, // yashil
];

// Chizilgan to'ti (yon ko'rinish, o'ngga qaragan): shoxchada o'tiradi — dum (sekin
// tebranadi), tana, qorin, qanot (2 ton pat), bosh, oq yuz-dog', sariq ilmoq tumshuq,
// blikli ko'z, shoxni ushlagan oyoqlar.
const Parrot = ({ c }) => (
  <svg viewBox="0 0 60 68" width="46" height="52" className="pq-parrotsvg" aria-hidden="true">
    <path d="M6 59 Q30 56 54 59" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M9 56 q-4 -6 -8 -6 q1.5 6.5 8 6 Z" fill="#5cae54" />
    <g className="pq-ptail">
      <path d="M19 38 Q12 50 10 63 L15 62 Q18 50 24 42 Z" fill={c.wing} />
      <path d="M23 40 Q18 51 17 62 L21 61 Q23 51 27 44 Z" fill={c.feather} opacity=".9" />
    </g>
    <ellipse cx="30" cy="34" rx="13" ry="15" fill={c.body} />
    <ellipse cx="33" cy="39" rx="9" ry="10.5" fill={c.belly} />
    <line x1="27" y1="47" x2="26" y2="56" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="34" y1="47.5" x2="34" y2="56" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="26" y1="56" x2="22.5" y2="58" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="56" x2="37.5" y2="58" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 7 q1.5 -4.5 5 -5 q-.5 4.5 -2.4 5.8 Z" fill={c.feather} />
    <circle cx="36" cy="15" r="10" fill={c.body} />
    <circle cx="40" cy="14" r="4.6" fill="#f6efe2" />
    <path d="M44 10 Q52 11 51 16 Q49 21 44 19 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M44 18.5 Q48 20 46 22.5 Q43 21.5 43.2 19.3 Z" fill="#d99a1a" />
    <circle cx="40.5" cy="13" r="2" fill="#1f2430" />
    <circle cx="41.2" cy="12.3" r="0.7" fill="#fff" />
    <path d="M24 24 Q17 34 21 45 Q28 47 32 41 Q31 30 28 24 Z" fill={c.wing} />
    <path d="M23 30 Q27 29 30 32 M22 36 Q26 35 29 38 M22.5 41 Q26 40 29 42" stroke={c.feather} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".85" />
  </svg>
);

export default function D04_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [signs, setSigns] = useState({}); // {rowIdx: '>'|'='|'<'}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = PAIRS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.signs) {
      setSigns(initialAnswer.studentAnswer.signs);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(signs).length === N && !checked); }, [signs, checked, onReady, N]);

  const rowRight = (i) => signs[i] === signFor(PAIRS[i][0], PAIRS[i][1]);
  const check = useCallback(() => {
    if (Object.keys(signs).length !== N) return;
    const correct = PAIRS.every((_, i) => rowRight(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: SIGNS, studentAnswer: { signs }, correctAnswer: { signs: PAIRS.map((p) => signFor(p[0], p[1])) }, correct, meta: { ...DATA } });
  }, [signs, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0407">
      <style>{`
        .pq0407{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0407 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3fae72;text-transform:uppercase;}
        .pq0407 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0407 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0407 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0407 .pq-parrots{display:flex;gap:26px;justify-content:center;margin-bottom:8px;}
        .pq0407 .pq-parrot{display:inline-block;line-height:0;transform-origin:50% 88%;animation:pqSway 2.2s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0407 .pq-ptail{transform-box:fill-box;transform-origin:85% 5%;animation:pqTail 3.4s ease-in-out infinite;}
        .pq0407 .pq-rows{display:flex;flex-direction:column;gap:10px;align-items:center;}
        .pq0407 .pq-rw{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:8px 12px;border-radius:16px;border:2.5px solid #e3e7ee;background:#fff;transition:.15s;}
        .pq0407 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq0407 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}
        .pq0407 .pq-n{width:52px;height:60px;border-radius:12px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;}
        .pq0407 .pq-sgs{display:flex;flex-wrap:wrap;gap:6px;margin-left:6px;}
        .pq0407 .pq-sg{width:46px;height:46px;border-radius:12px;border:2.5px solid #d6dae3;background:#fff;font-size:22px;font-weight:900;color:#374151;cursor:pointer;transition:.12s;}
        .pq0407 .pq-sg:hover:not(:disabled){border-color:#9fc7ab;transform:translateY(-2px);}
        .pq0407 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq0407 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0407 .pq-sg:disabled{cursor:default;}
        .pq0407 .pq-slot{width:46px;height:46px;border-radius:12px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#aab3c2;}
        .pq0407 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;}
        .pq0407 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq0407 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0407 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0407 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pqTail{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(5deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-parrots">
        <span className="pq-parrot"><Parrot c={PARROTS[0]} /></span>
        <span className="pq-parrot" style={{ animationDelay: '.7s' }}><Parrot c={PARROTS[1]} /></span>
        <span className="pq-parrot" style={{ animationDelay: '1.4s' }}><Parrot c={PARROTS[2]} /></span>
      </div>

      <div className="pq-rows">
        {PAIRS.map(([a, b], i) => {
          const cls = feedback ? (rowRight(i) ? ' good' : ' bad') : '';
          return (
            <div key={i} className={'pq-rw' + cls}>
              <div className="pq-n">{a}</div>
              <div className={'pq-slot' + (signs[i] ? ' has' : '')}>{signs[i] || '?'}</div>
              <div className="pq-n">{b}</div>
              <div className="pq-sgs">
                {SIGNS.map((s) => (
                  <button key={s} type="button" className={'pq-sg' + (signs[i] === s ? ' sel' : '')} disabled={lock}
                    onClick={() => { setSigns((prev) => ({ ...prev, [i]: s })); setFeedback(null); }}>{s}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
