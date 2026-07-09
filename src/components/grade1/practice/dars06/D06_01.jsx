// Dars06 · Amaliyot 01 — P6 Son uyi takrori (bekat uychasi) · 🟢 · tag: house_warmup
// Spiral: Dars05 son-uyi. Tomda 5, qavat [3|?]. G'alabada «?» yashil 2 bilan to'ladi,
// chip «3 + 2 = 5», chetdan kanon-avtobus kirib keladi (g'ildiraklar aylanadi).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { roof: 5, left: 3, target: 2, options: [1, 2, 3], ptype: 'P6', level: '🟢', tag: 'house_warmup' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Bekat', title: 'Son uyi takrori',
    setup: 'Bolalar sayohatga otlanishdi! Bekatda kutayotganda eski darsni eslaymiz: tomda besh.',
    ask: 'Bo\'sh xonachaga qaysi son yoziladi?',
    correct: 'Barakalla! Uch va ikki — besh. Avtobus ham keldi!',
    hint: 'Tomdagi son — besh. Uchga nechta qo\'shilsa besh bo\'ladi? Barmoqlarda sanang.',
  },
  ru: {
    eyebrow: 'Автобусное путешествие · Остановка', title: 'Повторение числового домика',
    setup: 'Ребята собрались в путешествие! Пока ждём на остановке, вспомним прошлый урок: на крыше пять.',
    ask: 'Какое число нужно вписать в пустое окошко?',
    correct: 'Молодец! Три и два — пять. И автобус уже приехал!',
    hint: 'Число на крыше — пять. Сколько нужно прибавить к трём, чтобы получилось пять? Посчитай на пальцах.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Qatlamli daraxtcha (kanon uslub): po'stloqli tana, uch tonlik toj (sekin sway), meva-bliklar.
const Tree = () => (
  <svg viewBox="0 0 92 112" width="72" height="88" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="46" cy="106" rx="30" ry="5" fill="#b9dda8" />
    <path d="M46 107 L46 58" stroke="#7c4f24" strokeWidth="10" strokeLinecap="round" />
    <path d="M44 100 L44 66" stroke="#5f3a17" strokeWidth="1.6" strokeLinecap="round" opacity=".5" />
    <g className="pq-crown">
      <circle cx="34" cy="48" r="21" fill="#4f9a48" />
      <circle cx="58" cy="42" r="19" fill="#5cae54" />
      <circle cx="46" cy="27" r="16" fill="#68bd60" />
      <circle cx="40" cy="21" r="7" fill="#83cf7a" opacity=".8" />
      <circle cx="63" cy="34" r="6" fill="#83cf7a" opacity=".7" />
      <circle cx="30" cy="42" r="5.4" fill="#d94f5c" />
      <circle cx="28.4" cy="40.4" r="1.7" fill="#fff" opacity=".5" />
      <circle cx="58" cy="52" r="5.4" fill="#d94f5c" />
      <circle cx="56.4" cy="50.4" r="1.7" fill="#fff" opacity=".5" />
    </g>
  </svg>
);

// Bekat ustunchasidagi avtobus-belgisi: ko'k taxtacha ichida mini sariq avtobus glifi.
const BusSign = () => (
  <svg viewBox="0 0 46 106" width="38" height="88" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="23" cy="101" rx="10" ry="3" fill="rgba(90,100,110,.3)" />
    <rect x="21" y="30" width="4" height="72" rx="2" fill="#8a93a0" stroke="#5f6873" strokeWidth="1" />
    <rect x="4" y="2" width="38" height="32" rx="6" fill="#4f8fc4" stroke="#35648c" strokeWidth="2" />
    <rect x="10" y="12" width="26" height="12" rx="3" fill="#f2b134" stroke="#a8721a" strokeWidth="1.3" />
    <rect x="13" y="14.5" width="5" height="4.5" rx="1" fill="#dff1fb" />
    <rect x="20" y="14.5" width="5" height="4.5" rx="1" fill="#dff1fb" />
    <rect x="27" y="14.5" width="5" height="4.5" rx="1" fill="#dff1fb" />
    <circle cx="16" cy="24.5" r="2.2" fill="#2b2f36" />
    <circle cx="30" cy="24.5" r="2.2" fill="#2b2f36" />
  </svg>
);

// Yo'lovchi-bola (kanon): teri-rang blikli bosh, rangli kepka + gardish, ko'z pirpiratadi.
const Kid = ({ cap, capLine, shirt, shirtLine, blinkDelay }) => (
  <svg viewBox="0 0 40 54" width="34" height="46" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 54 Q6 37 20 37 Q34 37 34 54 Z" fill={shirt} stroke={shirtLine} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="20" cy="21.5" r="11.5" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.5" />
    <path d="M8.6 19.6 Q8.6 8 20 8 Q31.4 8 31.4 19.6 Z" fill={cap} stroke={capLine} strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="26.5" cy="20" rx="8.6" ry="2.3" fill={cap} stroke={capLine} strokeWidth="1.1" />
    <circle cx="16" cy="24" r="1.7" fill="#1f2430" /><circle cx="16.6" cy="23.4" r="0.6" fill="#fff" />
    <circle cx="24" cy="24" r="1.7" fill="#1f2430" /><circle cx="24.6" cy="23.4" r="0.6" fill="#fff" />
    <g className="pq-blink" style={{ animationDelay: blinkDelay }}>
      <rect x="13.8" y="22" width="4.4" height="4" rx="2" fill="#f2c096" />
      <rect x="21.8" y="22" width="4.4" height="4" rx="2" fill="#f2c096" />
    </g>
    <path d="M17 29 Q20 31.3 23 29" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

// AVTOBUS KANONI: yon ko'rinish, tana 2 ton (#f2b134/#d99a1a, kontur #a8721a), tomi ochroq,
// oldida fara + eshik, oq-havorang derazalar, 2 g'ildirak (to'q doira + kulrang disk + 4 kegay).
const Bus = () => (
  <svg viewBox="0 0 150 68" width="146" height="66" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="8" width="144" height="42" rx="9" fill="#f2b134" />
    <path d="M3 37 L147 37 L147 41 Q147 50 138 50 L12 50 Q3 50 3 41 Z" fill="#d99a1a" />
    <rect x="8" y="11" width="134" height="6" rx="3" fill="#f8d67f" />
    <rect x="3" y="8" width="144" height="42" rx="9" fill="none" stroke="#a8721a" strokeWidth="2" />
    <rect x="12" y="17" width="22" height="14" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="40" y="17" width="22" height="14" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="68" y="17" width="22" height="14" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="97" y="15" width="17" height="33" rx="2.5" fill="#e8c25a" stroke="#a8721a" strokeWidth="1.4" />
    <rect x="99.5" y="18" width="12" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1" />
    <line x1="105.5" y1="15" x2="105.5" y2="48" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="124" y="15" width="17" height="16" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <circle cx="142" cy="42" r="3.4" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.2" />
    <g className="pq-wheel">
      <circle cx="34" cy="54" r="10.5" fill="#2b2f36" />
      <circle cx="34" cy="54" r="5.6" fill="#9aa3ad" stroke="#6a727c" strokeWidth="1" />
      <path d="M34 49.4 L34 58.6 M29.4 54 L38.6 54" stroke="#4b525c" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="34" cy="54" r="1.6" fill="#4b525c" />
    </g>
    <g className="pq-wheel">
      <circle cx="116" cy="54" r="10.5" fill="#2b2f36" />
      <circle cx="116" cy="54" r="5.6" fill="#9aa3ad" stroke="#6a727c" strokeWidth="1" />
      <path d="M116 49.4 L116 58.6 M111.4 54 L120.6 54" stroke="#4b525c" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="116" cy="54" r="1.6" fill="#4b525c" />
    </g>
  </svg>
);

export default function D06_01(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0601">
      <style>{`
        .pq0601{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0601 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a1a;text-transform:uppercase;}
        .pq0601 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0601 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0601 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0601 .pq-scene{position:relative;width:340px;height:242px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f6ff 46%,#dff0d8 72%,#cfe6c2 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0601 .pq-sun{position:absolute;top:12px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0601 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0601 .pq-cloud.c1{top:20px;left:-70px;animation-duration:28s;animation-delay:-7s;}
        .pq0601 .pq-cloud.c2{top:48px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-21s;}
        .pq0601 .pq-road{position:absolute;left:0;right:0;bottom:0;height:46px;background:linear-gradient(#9aa3ad,#7f8894);border-top:4px solid #cfd6de;}
        .pq0601 .pq-road::after{content:'';position:absolute;left:0;right:0;top:50%;height:4px;margin-top:1px;border-radius:2px;background:repeating-linear-gradient(90deg,#fff 0 18px,transparent 18px 34px);opacity:.8;}
        .pq0601 .pq-tree{position:absolute;left:6px;bottom:48px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0601 .pq-crown{transform-box:fill-box;transform-origin:50% 85%;animation:pqSway 4.4s ease-in-out infinite;}
        .pq0601 .pq-house{position:absolute;left:96px;bottom:52px;width:132px;display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));z-index:2;}
        .pq0601 .pq-floor{display:flex;gap:8px;padding:9px 12px;background:#fbf7ef;border:2px solid #d8c9a8;border-top:none;border-radius:0 0 12px 12px;}
        .pq0601 .pq-cell{width:42px;height:42px;background:#fff;border:2px solid #b9c1cf;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#1f2430;font-variant-numeric:tabular-nums;}
        .pq0601 .pq-cell.win{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0601 .pq-qm{display:inline-block;color:#b06e24;animation:pqBreath 1.9s ease-in-out infinite;}
        .pq0601 .pq-two{color:#1a7f43;animation:pqPop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0601 .pq-sign{position:absolute;left:266px;bottom:46px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));z-index:1;}
        .pq0601 .pq-kid{position:absolute;bottom:48px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));animation:pqBobK 2.5s ease-in-out infinite;z-index:2;}
        .pq0601 .pq-kid.k1{left:56px;animation-delay:-.6s;}
        .pq0601 .pq-kid.k2{left:232px;animation-delay:-1.7s;}
        .pq0601 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0601 .pq-bus{position:absolute;left:88px;bottom:2px;z-index:3;animation:pqBusIn 1.5s cubic-bezier(.25,.9,.35,1) both;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq0601 .pq-busidle{animation:pqIdleB 2.6s ease-in-out infinite;}
        .pq0601 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 4.5s linear infinite;}
        .pq0601 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0601 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq0601 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pq0601 .pq-opt:hover:not(:disabled){border-color:#e8c98e;transform:translateY(-2px);}
        .pq0601 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0601 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0601 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0601 .pq-opt:disabled{cursor:default;}
        .pq0601 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0601 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0601 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(440px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(1.6deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.72;}50%{transform:scale(1.16);opacity:1;}}
        @keyframes pqBobK{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqBusIn{from{transform:translateX(-340px);}to{transform:translateX(0);}}
        @keyframes pqIdleB{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-road" />
        <div className="pq-tree"><Tree /></div>

        {/* Bekat uychasi son-uyi ko'rinishida: tomda 5, qavat [3|?] */}
        <div className="pq-house">
          <svg viewBox="0 0 132 58" width="132" height="58" aria-hidden="true" style={{ display: 'block', marginBottom: -2 }}>
            <polygon points="66,4 4,55 128,55" fill="#d9534b" stroke="#a33630" strokeWidth="2.4" strokeLinejoin="round" />
            <polygon points="66,12 18,52 114,52" fill="#e2703a" opacity=".35" />
            <circle cx="66" cy="38" r="14" fill="#fff" stroke="#a33630" strokeWidth="2" />
            <text x="66" y="45" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1f2430">{DATA.roof}</text>
          </svg>
          <div className="pq-floor">
            <div className="pq-cell">{DATA.left}</div>
            <div className={'pq-cell' + (ok ? ' win' : '')}>
              {ok ? <span className="pq-two">{DATA.target}</span> : <span className="pq-qm">?</span>}
            </div>
          </div>
        </div>

        <div className="pq-sign"><BusSign /></div>
        <div className="pq-kid k1"><Kid cap="#d9534b" capLine="#a33630" shirt="#57a84f" shirtLine="#3a7a35" blinkDelay="-1.1s" /></div>
        <div className="pq-kid k2"><Kid cap="#4f8fc4" capLine="#34648c" shirt="#d9534b" shirtLine="#a33630" blinkDelay="-2.6s" /></div>

        {ok && <div className="pq-bus"><div className="pq-busidle"><Bus /></div></div>}
        {ok && <span className="pq-chip">{DATA.left} + {DATA.target} = {DATA.roof}</span>}
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
