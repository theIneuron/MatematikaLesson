// Dars10 · Amaliyot 01 — P10 Son o'qida OLDINGA (robot-arava, fabrika 0-10) · 🟢 · tag: numline_warmup
// Spiral: Dars09 son o'qi takrori, endi 0-10. Fabrika: 11 raqamli metall katak-platforma qatorda;
// kichik robot-arava 4-katakda; ochilishda 3 katak OLDINGA g'ildiraklab yuradi (4→7, punktir iz + strelka),
// 7-katak «?» yopiq. G'alabada «?»→7, chip «4 + 3 = 7», qadam-sanoq 1..3 (5,6,7 kataklarida).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { start: 4, jump: 3, target: 7, options: [6, 7, 8], ptype: 'P10', level: '🟢', tag: 'numline_warmup' };
// Katak markazlari (sahna px, 380 kenglik) — indeks = katak raqami 0..10.
const XS = Array.from({ length: 11 }, (_, i) => 24 + i * 33.2);

const T = {
  uz: {
    eyebrow: "Fabrika · Yo'l", title: "Oldinga yur",
    setup: "Fabrika roboti raqamli yo'lda ishlaydi. U to'rtinchi katakda turgan edi va uch katak oldinga yurdi.",
    ask: "Robot qaysi katakka yetib bordi?",
    correct: "Barakalla! To'rtdan uch oldinga — yetti. Qo'shganda oldinga yuramiz!",
    hint: "Kataklarni sanang: to'rtdan boshlab oldinga uch qadam.",
  },
  ru: {
    eyebrow: "Фабрика · Путь", title: "Иди вперёд",
    setup: "Заводской робот работает на числовой дорожке. Он стоял на четвёртой клетке и проехал три клетки вперёд.",
    ask: "На какую клетку доехал робот?",
    correct: "Молодец! От четырёх три вперёд — семь. Когда прибавляем — едем вперёд!",
    hint: "Посчитай клетки: от четырёх три шага вперёд.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// ROBOT-ARAVA KANONI: to'rtburchak-yumaloq metall tana (kulrang-ko'k 2-3 ton), kontur #4a5568;
// old panelda ekran-yuz (ikki dumaloq ko'z + LED-tabassum, ko'zlar pirpiraydi), tepada antenna
// (uchida pulslanuvchi doira), pastda ikki g'ildirak (spitsalar — yurganda aylanadi). Do'stona.
const RobotCart = () => (
  <svg viewBox="0 0 60 60" width="52" height="52" aria-hidden="true" style={{ display: 'block' }}>
    {/* antenna */}
    <line x1="30" y1="15" x2="30" y2="5" stroke="#67728a" strokeWidth="2.4" strokeLinecap="round" />
    <circle className="pq-ant" cx="30" cy="4.5" r="3.2" fill="#f2b134" stroke="#c9891a" strokeWidth="1" />
    {/* tana */}
    <rect x="11" y="14" width="38" height="27" rx="9" fill="#aeb9c9" stroke="#4a5568" strokeWidth="2" />
    <rect x="11" y="14" width="38" height="10" rx="9" fill="#c6cfdc" opacity=".75" />
    <circle cx="14.5" cy="37" r="1.3" fill="#8794a8" /><circle cx="45.5" cy="37" r="1.3" fill="#8794a8" />
    {/* ekran-yuz paneli */}
    <rect x="16" y="19" width="28" height="17" rx="5" fill="#37424f" stroke="#242c36" strokeWidth="1.4" />
    {/* ko'zlar */}
    <circle cx="24.5" cy="26.5" r="3.3" fill="#63e0ff" />
    <circle cx="35.5" cy="26.5" r="3.3" fill="#63e0ff" />
    <circle cx="25.4" cy="25.6" r="1" fill="#fff" /><circle cx="36.4" cy="25.6" r="1" fill="#fff" />
    <g className="pq-rblink"><rect x="20.6" y="22.6" width="8" height="8" rx="3" fill="#37424f" /><rect x="31.6" y="22.6" width="8" height="8" rx="3" fill="#37424f" /></g>
    {/* LED-tabassum */}
    <path d="M23.5 31.5 Q30 34.5 36.5 31.5" stroke="#63e0ff" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* qo'llar (bo'g'in-to'garaklar) */}
    <path d="M11 27 Q6 27 5.5 32" stroke="#8794a8" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M49 27 Q54 27 54.5 32" stroke="#8794a8" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="5.5" cy="32.5" r="2.4" fill="#67728a" stroke="#4a5568" strokeWidth="1" />
    <circle cx="54.5" cy="32.5" r="2.4" fill="#67728a" stroke="#4a5568" strokeWidth="1" />
    {/* shassi + g'ildiraklar */}
    <rect x="16" y="40" width="28" height="4" rx="2" fill="#67728a" />
    <g className="pq-wheel">
      <circle cx="22" cy="46" r="6.2" fill="#5b6675" stroke="#3a4351" strokeWidth="1.6" />
      <circle cx="22" cy="46" r="2.2" fill="#aeb9c9" />
      <g stroke="#9aa6b6" strokeWidth="1.3"><line x1="22" y1="41" x2="22" y2="51" /><line x1="17.2" y1="46" x2="26.8" y2="46" /></g>
    </g>
    <g className="pq-wheel">
      <circle cx="38" cy="46" r="6.2" fill="#5b6675" stroke="#3a4351" strokeWidth="1.6" />
      <circle cx="38" cy="46" r="2.2" fill="#aeb9c9" />
      <g stroke="#9aa6b6" strokeWidth="1.3"><line x1="38" y1="41" x2="38" y2="51" /><line x1="33.2" y1="46" x2="42.8" y2="46" /></g>
    </g>
  </svg>
);

// KATAK-PLATFORMA KANONI: metall plita (2-ton kulrang-ko'k + kontur), ustida katta oq raqam.
// hidden=true (7-katak): raqam «?» bilan yopiq, g'alabada pop bilan ochiladi.
const Cell = ({ n, hidden, ok }) => (
  <svg viewBox="0 0 34 30" width="30" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2" y="3" width="30" height="24" rx="6" fill="#9aa6b6" stroke="#4a5568" strokeWidth="1.6" />
    <rect x="2" y="3" width="30" height="9" rx="6" fill="#b7c1d0" opacity=".85" />
    <circle cx="6" cy="7" r="1" fill="#7a8698" /><circle cx="28" cy="7" r="1" fill="#7a8698" />
    <circle cx="6" cy="23" r="1" fill="#7a8698" /><circle cx="28" cy="23" r="1" fill="#7a8698" />
    {hidden && !ok
      ? <text className="pq-qm" x="17" y="21.5" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff">?</text>
      : <text className={hidden && ok ? 'pq-rev' : undefined} x="17" y="21" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">{n}</text>}
  </svg>
);

// TISHLI-G'ILDIRAK (dekor): sekin aylanadi. Teeth JS bilan generatsiya.
const Cog = ({ teeth = 9, size = 54, fill = '#8794a8', line = '#4a5568' }) => (
  <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: teeth }).map((_, i) => (
      <rect key={i} x="27" y="1.5" width="6" height="11" rx="1.5" fill={fill} stroke={line} strokeWidth="1" transform={`rotate(${(360 / teeth) * i} 30 30)`} />
    ))}
    <circle cx="30" cy="30" r="19" fill={fill} stroke={line} strokeWidth="1.6" />
    <circle cx="30" cy="30" r="11" fill="none" stroke={line} strokeWidth="2" opacity=".45" />
    <circle cx="30" cy="30" r="5" fill={line} opacity=".4" />
  </svg>
);

// KONVEYER-ROLIK (dekor): kichik g'ildirak, spitsalari aylanadi.
const Roller = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="10" cy="10" r="8.5" fill="#8794a8" stroke="#4a5568" strokeWidth="1.4" />
    <circle cx="10" cy="10" r="3" fill="#67728a" />
    <g stroke="#5b6675" strokeWidth="1.4"><line x1="10" y1="2" x2="10" y2="18" /><line x1="2" y1="10" x2="18" y2="10" /></g>
  </svg>
);

// FABRIKA OYNALARI (dekor).
const Windows = () => (
  <svg viewBox="0 0 150 44" width="150" height="44" aria-hidden="true" style={{ display: 'block' }}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 50},0)`}>
        <rect x="5" y="4" width="40" height="36" rx="4" fill="#bfe0ef" stroke="#7f97a8" strokeWidth="2" />
        <rect x="5" y="4" width="40" height="13" rx="4" fill="#daeff8" opacity=".85" />
        <line x1="25" y1="6" x2="25" y2="38" stroke="#7f97a8" strokeWidth="1.6" />
        <line x1="7" y1="22" x2="43" y2="22" stroke="#7f97a8" strokeWidth="1.6" />
      </g>
    ))}
  </svg>
);

// Roliklar joyi (beam ostida).
const ROLLERS = [40, 108, 176, 244, 312];
// Qadam-sanoq badge markazlari — 4→7 uch qadamning o'rtalari (izning ustida sanaladi).
const STEP_MID = [0, 1, 2].map((i) => (XS[DATA.start + i] + XS[DATA.start + i + 1]) / 2);
// G'alaba badge'lari joylashadigan kataklar (qadam tushadigan: start+1 … start+jump)
const STEP_CELLS = Array.from({ length: DATA.jump }, (_, i) => DATA.start + i + 1);

export default function D10_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda yurish-animatsiya qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const [robotCell, setRobotCell] = useState(still ? DATA.target : DATA.start);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (still) return;
    const t1 = setTimeout(() => { setRolling(true); setRobotCell(DATA.target); }, 750);
    const t2 = setTimeout(() => setRolling(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [still]);

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
  const moved = still || robotCell === DATA.target;

  return (
    <div className="pq pq1001">
      <style>{`
        .pq1001{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1001 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4a7fb0;text-transform:uppercase;}
        .pq1001 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1001 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1001 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1001 .pq-scene{position:relative;width:380px;max-width:100%;height:208px;margin:0 auto;border-radius:20px;background:linear-gradient(#dbe4ee 0%,#c7d3e0 58%,#b7c3d2 100%);border:2px solid #a6b4c4;overflow:hidden;}
        .pq1001 .pq-winw{position:absolute;left:14px;top:14px;z-index:1;opacity:.9;filter:drop-shadow(0 1px 1px rgba(0,0,0,.08));}
        .pq1001 .pq-cogw{position:absolute;z-index:0;line-height:0;filter:drop-shadow(0 1px 2px rgba(0,0,0,.12));}
        .pq1001 .pq-cogw.g1{right:14px;top:8px;animation:pqGear 9s linear infinite;}
        .pq1001 .pq-cogw.g2{right:52px;top:44px;animation:pqGear2 7s linear infinite;}
        .pq1001 .pq-pipe{position:absolute;right:8px;top:0;width:15px;height:120px;border-radius:0 0 7px 7px;background:linear-gradient(90deg,#9aa6b6,#c2ccd8 45%,#8794a8);border:2px solid #6c7889;border-top:none;z-index:1;}
        .pq1001 .pq-pipe::after{content:'';position:absolute;left:-3px;right:-3px;top:70px;height:9px;border-radius:3px;background:linear-gradient(90deg,#7f8b9c,#aab5c3 45%,#6c7889);}
        .pq1001 .pq-steam{position:absolute;right:11px;top:-6px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.85);z-index:1;opacity:0;animation:pqSteam 5.5s ease-out infinite;}
        .pq1001 .pq-steam.s2{right:15px;animation-duration:6.4s;animation-delay:-3.1s;}
        .pq1001 .pq-panel{position:absolute;left:16px;top:70px;display:flex;gap:6px;padding:5px 7px;border-radius:8px;background:#6c7889;border:1.6px solid #505c6c;z-index:1;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq1001 .pq-led{width:8px;height:8px;border-radius:50%;animation:pqLed 1.5s ease-in-out infinite;}
        .pq1001 .pq-led.a{background:#54d68a;box-shadow:0 0 5px #54d68a;}
        .pq1001 .pq-led.b{background:#f2b134;box-shadow:0 0 5px #f2b134;animation-delay:-.5s;}
        .pq1001 .pq-led.c{background:#ff6b6b;box-shadow:0 0 5px #ff6b6b;animation-delay:-1s;}
        .pq1001 .pq-beam{position:absolute;left:6px;right:6px;top:180px;height:9px;border-radius:5px;background:linear-gradient(#c6cfdc,#8794a8 55%,#6c7889);border:1.5px solid #5b6675;z-index:1;}
        .pq1001 .pq-rollw{position:absolute;top:190px;z-index:1;line-height:0;animation:pqRoller 1.6s linear infinite;}
        .pq1001 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:12px;background:linear-gradient(#9aa6b6,#828f9f);z-index:0;}
        .pq1001 .pq-cellw{position:absolute;top:150px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq1001 .pq-qm{transform-box:fill-box;transform-origin:center;animation:pqQm 1.7s ease-in-out infinite;}
        .pq1001 .pq-rev{transform-box:fill-box;transform-origin:center;animation:pqPopT .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1001 .pq-trailw{position:absolute;inset:0;z-index:3;pointer-events:none;}
        .pq1001 .pq-trail{animation:pqTrailIn .5s ease both;}
        .pq1001 .pq-scene.still .pq-trail{animation:none;}
        .pq1001 .pq-robot{position:absolute;top:106px;z-index:5;transition:left 1.4s cubic-bezier(.4,.08,.4,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.24));}
        .pq1001 .pq-scene.still .pq-robot{transition:none;}
        .pq1001 .pq-rbody{display:block;animation:pqBobR 2.7s ease-in-out infinite;}
        .pq1001 .pq-robot.win .pq-rbody{animation:pqBobR 2.7s ease-in-out infinite,pqCele .55s ease;}
        .pq1001 .pq-wheel{transform-box:fill-box;transform-origin:center;}
        .pq1001 .pq-robot.rolling .pq-wheel{animation:pqSpin .5s linear infinite;}
        .pq1001 .pq-ant{transform-box:fill-box;transform-origin:center;animation:pqAnt 1.4s ease-in-out infinite;}
        .pq1001 .pq-rblink{opacity:0;animation:pqBlinkR 4s linear infinite;}
        .pq1001 .pq-cnt{position:absolute;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1001 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq1001 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq1001 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1001 .pq-opt:hover:not(:disabled){border-color:#a8c2df;transform:translateY(-2px);}
        .pq1001 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1001 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1001 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1001 .pq-opt:disabled{cursor:default;}
        .pq1001 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1001 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1001 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGear{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqGear2{from{transform:rotate(0);}to{transform:rotate(-360deg);}}
        @keyframes pqRoller{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqAnt{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.25);opacity:.7;}}
        @keyframes pqBlinkR{0%,92%{opacity:0;}94%,97%{opacity:1;}99%,100%{opacity:0;}}
        @keyframes pqBobR{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqLed{0%,100%{opacity:1;}50%{opacity:.28;}}
        @keyframes pqSteam{0%{opacity:0;transform:translateY(0) scale(.5);}12%{opacity:.7;}40%{opacity:.35;}60%{opacity:0;transform:translateY(-34px) scale(1.4);}100%{opacity:0;}}
        @keyframes pqQm{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.16);opacity:.85;}}
        @keyframes pqPopT{0%{opacity:0;transform:scale(.2);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqTrailIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* Ambient: sekin suzuvchi mayda uchqunlar (fon dekori) */
        .pq1001 .pq-mote{position:absolute;z-index:0;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,rgba(242,177,52,.55) 55%,rgba(242,177,52,0) 72%);pointer-events:none;opacity:0;animation:pq1001Mote 9s ease-in-out infinite;}
        .pq1001 .pq-mote.m2{width:4px;height:4px;animation-duration:11.5s;animation-delay:-4s;}
        .pq1001 .pq-mote.m3{width:6px;height:6px;animation-duration:13s;animation-delay:-7.5s;}
        @keyframes pq1001Mote{0%{opacity:0;transform:translate(0,8px) scale(.7);}22%{opacity:.55;}50%{opacity:.6;transform:translate(5px,-8px) scale(1);}80%{opacity:.35;}100%{opacity:0;transform:translate(0,-20px) scale(.7);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '') + (rolling ? ' rolling' : '')}>
        {/* Ambient uchqunlar (fon, dekor) */}
        <span className="pq-mote m1" aria-hidden="true" style={{ left: 150, top: 34 }} />
        <span className="pq-mote m2" aria-hidden="true" style={{ left: 206, top: 22 }} />
        <span className="pq-mote m3" aria-hidden="true" style={{ left: 250, top: 52 }} />
        {/* Fabrika foni: oynalar, tishli-g'ildiraklar, quvur+bug', chiroq-panel */}
        <span className="pq-winw"><Windows /></span>
        <span className="pq-cogw g1"><Cog teeth={10} size={56} fill="#8794a8" line="#4a5568" /></span>
        <span className="pq-cogw g2"><Cog teeth={8} size={34} fill="#9aa6b6" line="#5b6675" /></span>
        <span className="pq-pipe" />
        <span className="pq-steam" /><span className="pq-steam s2" />
        <div className="pq-panel"><span className="pq-led a" /><span className="pq-led b" /><span className="pq-led c" /></div>
        <span className="pq-floor" />

        {/* Konveyer: rail-beam + aylanuvchi roliklar */}
        <span className="pq-beam" />
        {ROLLERS.map((x, i) => (<span key={i} className="pq-rollw" style={{ left: x, animationDelay: `${-i * 0.3}s` }}><Roller /></span>))}

        {/* Son o'qi: 0-10 raqamli metall kataklar; 7-katak «?» bilan yopiq */}
        {XS.map((x, i) => (
          <span key={i} className="pq-cellw" style={{ left: x - 15 }}>
            <Cell n={i} hidden={i === DATA.target} ok={!!ok} />
          </span>
        ))}

        {/* Punktir iz + strelka (4→7), robot yurganda paydo bo'ladi va qoladi */}
        <svg className="pq-trailw" viewBox="0 0 380 208" width="380" height="208" aria-hidden="true">
          {moved && (
            <g className="pq-trail">
              <path d={`M${XS[DATA.start]} 146 L${XS[DATA.target] - 6} 146`} stroke="#f2b134" strokeWidth="3.4" strokeDasharray="1 8" strokeLinecap="round" fill="none" />
              <polygon points={`${XS[DATA.target] + 2},146 ${XS[DATA.target] - 9},141 ${XS[DATA.target] - 9},151`} fill="#f2b134" stroke="#c9891a" strokeWidth="0.8" strokeLinejoin="round" />
            </g>
          )}
        </svg>

        {/* Robot-arava — 4-katakdan 3 katak oldinga g'ildiraklab yuradi */}
        <span className={'pq-robot' + (rolling ? ' rolling' : '') + (ok ? ' win' : '')} style={{ left: XS[robotCell] - 26 }}>
          <span className="pq-rbody"><RobotCart /></span>
        </span>

        {/* G'alabada: qadam-sanoq 1..3 (5,6,7 kataklari ustida) + chip */}
        {ok && STEP_CELLS.map((c, i) => (
          <b key={c} className="pq-cnt" style={{ left: XS[c] - 9.5, top: 126, animationDelay: `${i * 0.14}s` }}>{i + 1}</b>
        ))}
        {ok && <span className="pq-chip">{DATA.start} + {DATA.jump} = {DATA.target}</span>}
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
