// Dars06 · Amaliyot 03 — P6 Son uyi (7 = 3 + ?) · 🟡 · tag: number_house
// Bekat-uycha: tomda «7», qavatda [3|?]. Svetofor chiroqlari navbat bilan sekin almashadi;
// g'alabada gap 4 bilan to'ladi, chip «3 + 4 = 7», svetofor yashilga o'tadi — avtobus yo'lga tushadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { roof: 7, left: 3, target: 4, options: [3, 4, 5], ptype: 'P6', level: '🟡', tag: 'number_house' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Bekat', title: 'Son uyi',
    setup: 'Keyingi bekat uychasining tomida yetti soni bor: qavatdagi ikki son birga YETTINI beradi.',
    ask: 'Bo\'sh xonachaga qaysi son yoziladi?',
    correct: 'Barakalla! Uch va to\'rt — yetti. Svetofor yashil — yo\'lga!',
    hint: 'Tomda yetti: uchga nechta qo\'shilsa yetti bo\'ladi? Barmoqlarda sanang.',
  },
  ru: {
    eyebrow: 'Автобусное путешествие · Остановка', title: 'Числовой домик',
    setup: 'На крыше домика следующей остановки — число семь: два числа на этаже вместе дают СЕМЬ.',
    ask: 'Какое число пишется в пустой комнатке?',
    correct: 'Молодец! Три и четыре — семь. Светофор зелёный — в путь!',
    hint: 'На крыше семь: сколько прибавить к трём, чтобы получилось семь? Посчитай на пальцах.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bekat-uycha tomi: ikki tonlik qizil cherepitsa (quyuq asos + ochroq ichki qatlam),
// markazda oq doira-belgi «7» — sekin breath bilan nafas oladi.
const Roof = () => (
  <svg viewBox="0 0 170 64" width="170" height="64" aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="85,4 6,60 164,60" fill="#c0453e" stroke="#a33630" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points="85,12 26,54 144,54" fill="#d9534b" />
    <g className="pq-badge">
      <circle cx="85" cy="41" r="15" fill="#fffdf6" stroke="#a33630" strokeWidth="2.4" />
      <text x="85" y="48.5" textAnchor="middle" fontSize="21" fontWeight="900" fill="#a33630">{DATA.roof}</text>
    </g>
  </svg>
);

// Osmon buluti: 3 ellipsdan yumshoq bulut, sekin chapdan o'ngga suzadi.
const Cloud = ({ w = 46 }) => (
  <svg viewBox="0 0 60 26" width={w} aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="19" cy="17" rx="14" ry="8" fill="#ffffff" />
    <ellipse cx="33" cy="12" rx="12" ry="9" fill="#ffffff" />
    <ellipse cx="45" cy="17" rx="11" ry="7" fill="#ffffff" />
  </svg>
);

// Zamin o'ti: 3 poya, har biri o'z fazasida asosidan tebranadi.
const Grass = () => (
  <svg viewBox="0 0 26 20" width="22" height="17" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-blade b1" d="M5 19 C4 13 6 9 8 5" stroke="#4a9a44" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path className="pq-blade b2" d="M13 19 C13 11 13 8 13 3" stroke="#3e8f3e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path className="pq-blade b3" d="M21 19 C22 13 20 9 18 6" stroke="#57a84f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
);

// AVTOBUS KANONI: yon ko'rinish sariq shahar avtobusi — tana 2 ton (#f2b134/#d99a1a,
// kontur #a8721a), tomi ochroq, oldida fara + eshik, oq-havorang derazalar (#dff1fb),
// 2 g'ildirak: to'q doira + kulrang disk + 4 kegay (pq-wheel sekin aylanadi).
const Bus = () => (
  <svg viewBox="0 0 120 62" width="112" height="58" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="4" y="12" width="110" height="34" rx="7" fill="#f2b134" stroke="#a8721a" strokeWidth="2" />
    <path d="M6 34 H112 V39 Q112 44 107 44 H11 Q6 44 6 39 Z" fill="#d99a1a" />
    <rect x="10" y="8" width="98" height="7" rx="3.5" fill="#f8d67f" stroke="#a8721a" strokeWidth="1.5" />
    <rect x="12" y="18" width="17" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="33" y="18" width="17" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="54" y="18" width="17" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="88" y="17" width="18" height="27" rx="2.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.4" />
    <line x1="97" y1="18" x2="97" y2="43" stroke="#a8721a" strokeWidth="1.2" />
    <circle cx="112" cy="38" r="3.2" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.3" />
    <g>
      <circle cx="30" cy="48" r="9.5" fill="#2c3038" stroke="#171a1f" strokeWidth="1.6" />
      <g className="pq-wheel">
        <circle cx="30" cy="48" r="4.6" fill="#b9bec7" />
        <line x1="30" y1="41.4" x2="30" y2="54.6" stroke="#d7dce3" strokeWidth="1.6" />
        <line x1="23.4" y1="48" x2="36.6" y2="48" stroke="#d7dce3" strokeWidth="1.6" />
      </g>
    </g>
    <g>
      <circle cx="88" cy="48" r="9.5" fill="#2c3038" stroke="#171a1f" strokeWidth="1.6" />
      <g className="pq-wheel">
        <circle cx="88" cy="48" r="4.6" fill="#b9bec7" />
        <line x1="88" y1="41.4" x2="88" y2="54.6" stroke="#d7dce3" strokeWidth="1.6" />
        <line x1="81.4" y1="48" x2="94.6" y2="48" stroke="#d7dce3" strokeWidth="1.6" />
      </g>
    </g>
  </svg>
);

export default function D06_03(props) {
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
    <div className="pq pq0603">
      <style>{`
        .pq0603{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0603 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06e24;text-transform:uppercase;}
        .pq0603 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0603 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0603 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0603 .pq-scene{position:relative;width:340px;height:256px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f5ff 52%,#dff0d2 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0603 .pq-sun{position:absolute;top:12px;left:14px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0603 .pq-cloud{position:absolute;left:-64px;line-height:0;opacity:.92;animation:pqDrift 28s linear infinite;pointer-events:none;}
        .pq0603 .pq-cloud.c1{top:14px;animation-delay:-9s;}
        .pq0603 .pq-cloud.c2{top:44px;animation-duration:38s;animation-delay:-22s;}
        .pq0603 .pq-grassband{position:absolute;left:0;right:0;bottom:44px;height:26px;background:linear-gradient(#cfe8b0,#a9d489);}
        .pq0603 .pq-road{position:absolute;left:0;right:0;bottom:0;height:44px;background:linear-gradient(#9aa3ad,#78828c);border-top:3px solid #6b747e;}
        .pq0603 .pq-road::after{content:'';position:absolute;left:0;right:0;top:19px;height:3px;background:repeating-linear-gradient(90deg,#f4f6f8 0 16px,rgba(0,0,0,0) 16px 32px);opacity:.8;}
        .pq0603 .pq-grass{position:absolute;line-height:0;pointer-events:none;z-index:1;}
        .pq0603 .pq-grass.g1{left:200px;bottom:52px;}
        .pq0603 .pq-grass.g2{right:90px;bottom:57px;}
        .pq0603 .pq-blade{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3s ease-in-out infinite;}
        .pq0603 .pq-blade.b2{animation-duration:2.6s;animation-delay:-.9s;}
        .pq0603 .pq-blade.b3{animation-duration:3.4s;animation-delay:-1.7s;}
        .pq0603 .pq-grass.g2 .pq-blade{animation-delay:-1.3s;}
        .pq0603 .pq-house{position:absolute;left:22px;bottom:58px;display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));z-index:1;}
        .pq0603 .pq-house.win{animation:pqCele .55s ease;}
        .pq0603 .pq-badge{transform-box:fill-box;transform-origin:center;animation:pqBreath 3.2s ease-in-out infinite;}
        .pq0603 .pq-hbody{display:flex;gap:9px;justify-content:center;padding:10px 12px 12px;background:#fdf3e0;border:2.5px solid #b98a4e;border-top:none;border-radius:0 0 12px 12px;margin-top:-2px;}
        .pq0603 .pq-room{width:46px;height:48px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;font-variant-numeric:tabular-nums;}
        .pq0603 .pq-room.known{background:#fff;border:2.5px solid #c98c3a;color:#1f2430;}
        .pq0603 .pq-room.gap{background:#fff8f4;border:2.5px dashed #d9534b;color:#d9534b;}
        .pq0603 .pq-room.gap.win{background:#e8f7ee;border:2.5px solid #1a7f43;animation:pqCele .5s ease;}
        .pq0603 .pq-q{display:inline-block;animation:pqPulse 1.3s ease-in-out infinite;}
        .pq0603 .pq-fill{color:#1a7f43;animation:pqFillIn .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0603 .pq-tl{position:absolute;right:30px;bottom:46px;display:flex;flex-direction:column;align-items:center;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0603 .pq-tlbox{display:flex;flex-direction:column;gap:4px;padding:5px;background:linear-gradient(#4a5364,#343b48);border:2px solid #232936;border-radius:8px;}
        .pq0603 .pq-lamp{width:14px;height:14px;border-radius:50%;}
        .pq0603 .pq-lamp.r{background:#5a2f2b;animation:pqTlR 6s linear infinite;}
        .pq0603 .pq-lamp.y{background:#5c4a22;animation:pqTlY 6s linear infinite;}
        .pq0603 .pq-lamp.g{background:#2c4a2b;transition:background .3s;}
        .pq0603 .pq-tl.win .pq-lamp.r{animation:none;background:#5a2f2b;box-shadow:none;}
        .pq0603 .pq-tl.win .pq-lamp.y{animation:none;background:#5c4a22;box-shadow:none;}
        .pq0603 .pq-tl.win .pq-lamp.g{background:#57d457;animation:pqGlow 1.4s ease-in-out infinite;}
        .pq0603 .pq-tlpole{width:5px;height:42px;background:linear-gradient(90deg,#8a93a1,#5c6472);border-radius:2px;}
        .pq0603 .pq-bus{position:absolute;left:118px;bottom:3px;line-height:0;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25));animation:pqIdle 2.6s ease-in-out infinite;}
        .pq0603 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0603 .pq-bus.go{animation:pqGo 2.2s .5s cubic-bezier(.45,.05,.75,1) forwards;}
        .pq0603 .pq-bus.go .pq-wheel{animation-duration:.8s;}
        .pq0603 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 14px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0603 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0603 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0603 .pq-opt:hover:not(:disabled){border-color:#e4c08c;transform:translateY(-2px);}
        .pq0603 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0603 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0603 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0603 .pq-opt:disabled{cursor:default;}
        .pq0603 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0603 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0603 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqDrift{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        @keyframes pqPulse{0%,100%{transform:scale(1) rotate(-3deg);opacity:.65;}50%{transform:scale(1.22) rotate(3deg);opacity:1;}}
        @keyframes pqFillIn{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTlR{0%,52%{background:#e2564d;box-shadow:0 0 9px 2px rgba(226,86,77,.65);}56%,100%{background:#5a2f2b;box-shadow:none;}}
        @keyframes pqTlY{0%,56%{background:#5c4a22;box-shadow:none;}60%,94%{background:#f5c445;box-shadow:0 0 9px 2px rgba(245,196,69,.6);}98%,100%{background:#5c4a22;box-shadow:none;}}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 8px 2px rgba(87,212,87,.55);}50%{box-shadow:0 0 14px 4px rgba(87,212,87,.9);}}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqGo{from{transform:translateX(0);}to{transform:translateX(300px);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (ok ? ' win' : '')}>
        {ok && <span className="pq-chip">{DATA.left} + {DATA.target} = {DATA.roof}</span>}
        <span className="pq-sun" />
        <span className="pq-cloud c1"><Cloud w={48} /></span>
        <span className="pq-cloud c2"><Cloud w={34} /></span>
        <span className="pq-grassband" />
        <span className="pq-road" />
        <span className="pq-grass g1"><Grass /></span>
        <span className="pq-grass g2"><Grass /></span>

        {/* Bekat-uycha son-uyi: tomda 7, qavatda [3 | ?] */}
        <div className={'pq-house' + (ok ? ' win' : '')}>
          <Roof />
          <div className="pq-hbody">
            <div className="pq-room known">{DATA.left}</div>
            <div className={'pq-room gap' + (ok ? ' win' : '')}>{ok ? <b className="pq-fill">{DATA.target}</b> : <span className="pq-q">?</span>}</div>
          </div>
        </div>

        {/* Svetofor: qizil-sariq navbat bilan; g'alabada yashil yonadi */}
        <div className={'pq-tl' + (ok ? ' win' : '')}>
          <div className="pq-tlbox"><span className="pq-lamp r" /><span className="pq-lamp y" /><span className="pq-lamp g" /></div>
          <span className="pq-tlpole" />
        </div>

        {/* Avtobus svetofor oldida kutmoqda; yashilda yo'lga tushadi */}
        <div className={'pq-bus' + (ok ? ' go' : '')}><Bus /></div>
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
