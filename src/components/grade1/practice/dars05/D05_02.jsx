// Dars05 · Amaliyot 02 — P2 Belgini tanla: 5 ▢ 7 (spiral: Dars04 taqqoslash takrori) · 🟢 · masxaraboz · tag: sign_warmup
// Sirk: masxaraboz ikki dasta shar ko'tardi (chapda 5, o'ngda 7). Sonlar orasiga >, =, < dan birini qo'yish.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { a: 5, b: 7, target: '<', options: ['>', '=', '<'], ptype: 'P2', level: '🟢', tag: 'sign_warmup' };
const T = {
  uz: {
    eyebrow: 'Sirk · Masxaraboz', title: 'Belgini tanla',
    setup: 'Masxarabozning chap qo\'lida 5 ta shar, o\'ng qo\'lida 7 ta shar bor.',
    ask: 'Sonlar orasiga qaysi belgi qo\'yiladi?',
    correct: 'Barakalla! Besh yettidan kichik — belgi katta songa qarab ochiladi.',
    hint: 'Har tomondagi sharlarni sanang. Belgi katta songa qarab ochiladi.',
  },
  ru: {
    eyebrow: 'Цирк · Клоун', title: 'Выбери знак',
    setup: 'В левой руке клоуна 5 шаров, в правой — 7 шаров.',
    ask: 'Какой знак поставить между числами?',
    correct: 'Молодец! Пять меньше семи — знак открыт в сторону большего.',
    hint: 'Посчитай шары с каждой стороны. Знак открыт в сторону большего числа.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Shar palitrasi (koptok kanoni ranglari): asos + ochroq ton + quyuq kontur.
const PAL = [
  { base: '#d9534b', lite: '#e88a80', line: '#a83a34' }, // qizil
  { base: '#4f8fc4', lite: '#85b5da', line: '#35688f' }, // ko'k
  { base: '#f2b134', lite: '#f7cd75', line: '#b97c14' }, // sariq
  { base: '#57a84f', lite: '#85c47e', line: '#3c7a37' }, // yashil
];

// Chizilgan ballon: ellipse 2-ton (asos + ochroq tepa-chap), oq blik, tugun-uchburchak,
// pastda egilgan ip chizig'i. Yupqa quyuq kontur — kanon uslub.
// Ip (.pq-str) ballon bilan bir fazada sekin tebranadi — transform-origin tepada (tugun nuqtasi).
const Balloon = ({ c }) => (
  <svg viewBox="0 0 40 64" width="30" height="48" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-str" d="M20 49 Q16 55 20 60 Q22.5 62.6 20.5 64" stroke="#9aa1ab" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <ellipse cx="20" cy="25" rx="14.5" ry="18.5" fill={c.base} stroke={c.line} strokeWidth="1.6" />
    <ellipse cx="15.5" cy="19" rx="8" ry="10.5" fill={c.lite} opacity=".55" />
    <ellipse cx="13.8" cy="14.5" rx="3.2" ry="4.6" fill="#fff" opacity=".8" transform="rotate(-20 13.8 14.5)" />
    <path d="M16.8 43 L20 48.6 L23.2 43 Z" fill={c.line} />
  </svg>
);

// Chizilgan masxaraboz yuzi: rangli soch-puflar ikki yonda, konus qalpoq + pompon,
// blikli ko'zlar, qizil burun-doira (sekin puls), keng bo'yalgan tabassum, yonoq-dog'lar.
const Clown = () => (
  <svg viewBox="0 0 120 100" width="78" height="65" aria-hidden="true" style={{ display: 'block' }}>
    {/* soch — rangli puflar ikki yonda, har yon mustaqil wiggle + har puf o'z nafasida */}
    <g className="pq-puffL">
      <circle cx="24" cy="50" r="13" fill="#e8883a" stroke="#b95f1a" strokeWidth="1.5" />
      <circle cx="17" cy="63" r="10" fill="#d9534b" stroke="#a83a34" strokeWidth="1.5" />
      <circle cx="30" cy="38" r="10" fill="#f2b134" stroke="#b97c14" strokeWidth="1.5" />
    </g>
    <g className="pq-puffR">
      <circle cx="96" cy="50" r="13" fill="#e8883a" stroke="#b95f1a" strokeWidth="1.5" />
      <circle cx="103" cy="63" r="10" fill="#d9534b" stroke="#a83a34" strokeWidth="1.5" />
      <circle cx="90" cy="38" r="10" fill="#f2b134" stroke="#b97c14" strokeWidth="1.5" />
    </g>
    {/* qalpoq + pompon (bounce) */}
    <path d="M50 22 L60 5 L70 22 Z" fill="#4f8fc4" stroke="#35688f" strokeWidth="1.6" strokeLinejoin="round" />
    <g className="pq-pom">
      <circle cx="60" cy="5.5" r="3.6" fill="#f2b134" stroke="#b97c14" strokeWidth="1.2" />
    </g>
    {/* yuz */}
    <circle cx="60" cy="56" r="36" fill="#ffe3c2" stroke="#d9a86e" strokeWidth="1.8" />
    <ellipse cx="52" cy="45" rx="16" ry="12" fill="#fff0dd" opacity=".7" />
    {/* qoshlar */}
    <path d="M40 40 q6 -4.5 12 -1.5" stroke="#b97c14" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path d="M68 38.5 q6 -3 12 1.5" stroke="#b97c14" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    {/* ko'zlar — quyuq doira + oq blik */}
    <circle cx="47" cy="49" r="4.2" fill="#1f2430" />
    <circle cx="48.6" cy="47.6" r="1.4" fill="#fff" />
    <circle cx="73" cy="49" r="4.2" fill="#1f2430" />
    <circle cx="74.6" cy="47.6" r="1.4" fill="#fff" />
    {/* qovoqlar — teri-rang, pirpiratish (opacity 0→1 qisqa, har ~3.7s) */}
    <rect className="pq-lid" x="42.4" y="44.4" width="9.4" height="9.4" rx="4.7" fill="#ffe3c2" />
    <rect className="pq-lid" x="68.4" y="44.4" width="9.4" height="9.4" rx="4.7" fill="#ffe3c2" />
    {/* yonoqlar */}
    <circle cx="37" cy="62" r="5" fill="#f4a6a0" opacity=".7" />
    <circle cx="83" cy="62" r="5" fill="#f4a6a0" opacity=".7" />
    {/* qizil burun — sekin puls */}
    <g className="pq-nose">
      <circle cx="60" cy="59" r="8.5" fill="#d9534b" stroke="#a83a34" strokeWidth="1.6" />
      <circle cx="57" cy="56" r="2.6" fill="#fff" opacity=".75" />
    </g>
    {/* tabassum */}
    <path d="M42 70 Q60 86 78 70" stroke="#a83a34" strokeWidth="3.4" fill="none" strokeLinecap="round" />
    <path d="M46 73 Q60 82 74 73" stroke="#e88a80" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".8" />
  </svg>
);

export default function D05_02(props) {
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
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0502">
      <style>{`
        .pq0502{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0502 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c2483f;text-transform:uppercase;}
        .pq0502 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0502 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0502 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0502 .pq-stage{position:relative;padding:28px 8px 14px;border-radius:20px;background:linear-gradient(#fdf6ec,#fdeef2 70%,#fbe8ee);border:2px solid #f2ddc9;overflow:hidden;margin-bottom:14px;}
        .pq0502 .pq-bunt{position:absolute;top:0;left:0;width:100%;height:20px;}
        .pq0502 .pq-scenerow{display:flex;gap:10px;justify-content:center;align-items:flex-start;}
        .pq0502 .pq-clown{flex-shrink:0;margin-top:2px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqSway 3.6s ease-in-out infinite;transform-origin:50% 90%;}
        .pq0502 .pq-nose{transform-box:fill-box;transform-origin:center;animation:pqNose 2.6s ease-in-out infinite;}
        .pq0502 .pq-bunch{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:104px;padding:8px 6px 4px;border-radius:14px;background:rgba(255,255,255,.45);border:1.5px solid rgba(217,168,110,.35);}
        .pq0502 .pq-bunch.b7{max-width:138px;}
        .pq0502 .pq-bunch.win{animation:pqCele .5s ease;background:rgba(232,247,238,.7);border-color:#8fce9f;}
        .pq0502 .pq-bal{position:relative;line-height:0;animation:pqFloat var(--dur,2.6s) ease-in-out infinite;animation-delay:var(--d,0s);filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0502 .pq-str{transform-box:fill-box;transform-origin:50% 0;animation:pqString var(--dur,2.6s) ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq0502 .pq-flag{transform-box:fill-box;transform-origin:50% 0;animation:pqFlag 2.8s ease-in-out infinite;}
        .pq0502 .pq-puffL{transform-box:fill-box;transform-origin:82% 50%;animation:pqPuff 2.9s ease-in-out infinite;animation-delay:-1.1s;}
        .pq0502 .pq-puffR{transform-box:fill-box;transform-origin:18% 50%;animation:pqPuff 3.4s ease-in-out infinite reverse;animation-delay:-0.4s;}
        .pq0502 .pq-puffL circle,.pq0502 .pq-puffR circle{transform-box:fill-box;transform-origin:center;animation:pqPuffB 2.3s ease-in-out infinite;}
        .pq0502 .pq-puffL circle:nth-of-type(2),.pq0502 .pq-puffR circle:nth-of-type(3){animation-delay:-0.8s;}
        .pq0502 .pq-puffL circle:nth-of-type(3),.pq0502 .pq-puffR circle:nth-of-type(2){animation-delay:-1.6s;}
        .pq0502 .pq-pom{transform-box:fill-box;transform-origin:50% 100%;animation:pqPom 1.9s ease-in-out infinite;animation-delay:-0.6s;}
        .pq0502 .pq-lid{opacity:0;animation:pqBlink 3.7s ease-in-out infinite;animation-delay:1.3s;}
        .pq0502 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0502 .pq-row{display:flex;gap:12px;justify-content:center;align-items:center;}
        .pq0502 .pq-num{width:72px;height:84px;border-radius:16px;border:3px solid #d9dde5;background:linear-gradient(#fff,#f4f6fa);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;}
        .pq0502 .pq-gap{width:62px;height:62px;border-radius:14px;border:2.5px dashed #b9c1cf;background:#fbfcfe;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#b9c1cf;animation:pqBreath 2s ease-in-out infinite;}
        .pq0502 .pq-gap.filled{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0502 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq0502 .pq-opt{width:72px;height:72px;font-size:34px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq0502 .pq-opt:hover:not(:disabled){border-color:#e3b1ab;transform:translateY(-2px);}
        .pq0502 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0502 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0502 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0502 .pq-opt:disabled{cursor:default;}
        .pq0502 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0502 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0502 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqNose{0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0) rotate(-2.4deg);}50%{transform:translateY(-4px) rotate(2.4deg);}}
        @keyframes pqString{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}
        @keyframes pqFlag{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqPuff{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}}
        @keyframes pqPuffB{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        @keyframes pqPom{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-1.8px) scale(1.08,.94);}}
        @keyframes pqBlink{0%,91%,100%{opacity:0;}93%,96.5%{opacity:1;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @media (prefers-reduced-motion:reduce){.pq0502 *{animation-duration:.01s!important;animation-iteration-count:1!important;}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <svg className="pq-bunt" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 3 Q150 9 300 3" stroke="#c9b8a4" strokeWidth="1.4" fill="none" />
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} className="pq-flag" style={{ animationDelay: `${-(i * 0.37 + (i % 3) * 0.11)}s` }} d={`M${8 + i * 30} 4.5 L${15 + i * 30} 17 L${22 + i * 30} 4.5 Z`} fill={PAL[i % 4].base} opacity=".85" />
          ))}
        </svg>
        <div className="pq-scenerow">
          <div className={'pq-bunch b5' + (ok ? ' win' : '')}>
            {Array.from({ length: DATA.a }).map((_, i) => (
              <span key={i} className="pq-bal" style={{ '--d': `${-(i * 0.73 + (i % 3) * 0.17)}s`, '--dur': `${2.4 + (i % 3) * 0.45}s` }}>
                <Balloon c={PAL[i % 4]} />{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
          </div>
          <div className="pq-clown"><Clown /></div>
          <div className={'pq-bunch b7' + (ok ? ' win' : '')}>
            {Array.from({ length: DATA.b }).map((_, i) => (
              <span key={i} className="pq-bal" style={{ '--d': `${-(i * 0.58 + (i % 4) * 0.21 + 0.3)}s`, '--dur': `${2.55 + (i % 4) * 0.4}s` }}>
                <Balloon c={PAL[(i + 2) % 4]} />{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pq-row">
        <div className="pq-num">{DATA.a}</div>
        <div className={'pq-gap' + (ok ? ' filled' : '')}>{ok ? DATA.target : '?'}</div>
        <div className="pq-num">{DATA.b}</div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((s) => {
          const sel = picked === s; const right = ok && s === DATA.target;
          return <button key={s} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(s); setFeedback(null); }}>{s}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
