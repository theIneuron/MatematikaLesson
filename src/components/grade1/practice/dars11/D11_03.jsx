// Dars11 · Amaliyot 03 — P11 O'rin almashtirish «Poyezd bekati» · 🟡 · tag: swap_known
// Ma'lum: 6 + 2 = 8 (yuqori poyezd: 6 qizil + 2 ko'k vagon). Almashgan: 2 + 6 = ? (pastki poyezd,
// 2 ko'k + 6 qizil). Bola bilishi kerak — o'rin almashsa ham jami o'zgarmaydi: yana sakkiz.
// Jonli bekat: g'ildiraklar aylanadi, mo'ridan bug', semafor chiroqlari, bulutlar suzadi, quyosh breath.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { a: 6, b: 2, target: 8, options: [7, 8, 9], ptype: 'P11', level: '🟡', tag: 'swap_known' };
const RED = { body: '#d9534b', line: '#a33630', roof: '#e8827b' };
const BLUE = { body: '#4f8fc4', line: '#34648c', roof: '#83b4d9' };
// Yuqori poyezd (ma'lum): a ta qizil + b ta ko'k = "6 + 2".
const TOP = [...Array(DATA.a).fill(RED), ...Array(DATA.b).fill(BLUE)];
// Pastki poyezd (almashgan): b ta ko'k + a ta qizil = "2 + 6". g=guruh (swap-animatsiya uchun).
const BOT = [
  ...Array(DATA.b).fill({ ...BLUE, g: 'b' }),
  ...Array(DATA.a).fill({ ...RED, g: 'a' }),
];

const T = {
  uz: {
    eyebrow: "Poyezd bekati · Almashtirish", title: "Almashsa ham teng",
    setup: "Ma'lum: olti qo'shuv ikki — sakkiz. Endi vagonlar o'rin almashdi.",
    ask: "Ikki qo'shuv olti — nechaga teng?",
    correct: "Barakalla! O'rin almashsa ham — sakkiz! Sanamasdan ham bildik.",
    hint: "Yuqoridagi javobga qarang. O'rin almashsa, jami o'zgaradimi?",
    same: "Ikkala poyezd — bir xil uzunlik",
  },
  ru: {
    eyebrow: "Железнодорожная станция · Перестановка", title: "Поменяли местами — та же сумма",
    setup: "Известно: шесть плюс два — восемь. Теперь вагоны поменялись местами.",
    ask: "Сколько будет два плюс шесть?",
    correct: "Молодец! От перестановки — снова восемь! Мы узнали это даже без счёта.",
    hint: "Посмотри на ответ сверху. Если поменять местами, сумма изменится?",
    same: "Оба поезда — одинаковой длины",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// VAGON KANONI: to'rtburchak-yumaloq rangli tana, tomda ochroq blik, deraza (bo'lingan),
// pastda rama, 2 spitsali g'ildirak (sekin aylanadi), chapda qo'shqich (сцепка) uchi.
const Wagon = ({ c }) => (
  <svg viewBox="0 0 44 46" width="30" height="31" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="0" y1="33" x2="7" y2="33" stroke={c.line} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="2" cy="33" r="2" fill={c.line} />
    <rect x="6" y="9" width="33" height="24" rx="7" fill={c.body} stroke={c.line} strokeWidth="2" />
    <rect x="10" y="10.5" width="25" height="6" rx="3" fill={c.roof} />
    <rect x="14" y="17" width="17" height="10" rx="2.4" fill="#e7f3fb" stroke={c.line} strokeWidth="1.3" />
    <line x1="22.5" y1="17" x2="22.5" y2="27" stroke={c.line} strokeWidth="1" opacity=".55" />
    <rect x="7" y="33" width="31" height="4" rx="1.5" fill={c.line} />
    <g className="pq-wheel"><circle cx="15" cy="40" r="5.4" fill="#2c3038" stroke="#171a1f" strokeWidth="1.2" /><circle cx="15" cy="40" r="2.4" fill="#b9bec7" /><line x1="15" y1="34.6" x2="15" y2="45.4" stroke="#d7dce3" strokeWidth="1.1" /><line x1="9.6" y1="40" x2="20.4" y2="40" stroke="#d7dce3" strokeWidth="1.1" /></g>
    <g className="pq-wheel"><circle cx="30" cy="40" r="5.4" fill="#2c3038" stroke="#171a1f" strokeWidth="1.2" /><circle cx="30" cy="40" r="2.4" fill="#b9bec7" /><line x1="30" y1="34.6" x2="30" y2="45.4" stroke="#d7dce3" strokeWidth="1.1" /><line x1="24.6" y1="40" x2="35.4" y2="40" stroke="#d7dce3" strokeWidth="1.1" /></g>
  </svg>
);

// LOKOMOTIV KANONI: old (chap) tomonda dumaloq old chiroq, mo'ri (funnel — bug' chiqadi),
// qozon (boiler) + gumbaz, orqada kabina (deraza + mashinist boshi, ko'z pirpiratadi),
// 2 katta + 1 kichik spitsali g'ildirak (sekin aylanadi), o'ngda qo'shqich uchi.
const Loco = () => (
  <svg viewBox="0 0 76 48" width="55" height="35" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="4" y="35" width="66" height="4.5" rx="2" fill="#2f3949" />
    <rect x="2" y="29" width="5" height="8" rx="2" fill="#3c4863" />
    <rect x="6" y="17" width="40" height="18" rx="9" fill="#5b6b86" stroke="#3c4863" strokeWidth="2" />
    <rect x="6.5" y="19" width="39" height="5" rx="2.5" fill="#7c8aa6" opacity=".9" />
    <line x1="18" y1="17" x2="18" y2="35" stroke="#3c4863" strokeWidth="1.2" opacity=".5" />
    <line x1="30" y1="17" x2="30" y2="35" stroke="#3c4863" strokeWidth="1.2" opacity=".5" />
    <circle cx="9" cy="26" r="3.6" fill="#fff3c0" stroke="#3c4863" strokeWidth="1.4" />
    <path d="M24 17 q4 -6 8 0 Z" fill="#7c8aa6" stroke="#3c4863" strokeWidth="1.2" />
    <path d="M12 17 L11 8 L21 8 L20 17 Z" fill="#3c4863" />
    <rect x="10" y="5" width="12" height="4" rx="1.5" fill="#4a5772" />
    <rect x="44" y="8" width="24" height="27" rx="4" fill="#5b6b86" stroke="#3c4863" strokeWidth="2" />
    <rect x="41" y="6" width="30" height="5" rx="2.5" fill="#7c8aa6" stroke="#3c4863" strokeWidth="1.2" />
    <rect x="48" y="13" width="16" height="13" rx="2.5" fill="#dceffb" stroke="#3c4863" strokeWidth="1.5" />
    <circle cx="56" cy="20" r="4.4" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.2" />
    <path d="M51.8 18.4 A4.4 4.4 0 0 1 60.2 18.4 Z" fill="#6b4a2f" />
    <circle cx="54.4" cy="20.4" r="1" fill="#1f2430" />
    <circle cx="57.6" cy="20.4" r="1" fill="#1f2430" />
    <g className="pq-blink"><rect x="53" y="19.1" width="2.8" height="2.6" rx="1.2" fill="#f2c096" /><rect x="56.2" y="19.1" width="2.8" height="2.6" rx="1.2" fill="#f2c096" /></g>
    <line x1="68" y1="33" x2="74" y2="33" stroke="#2f3949" strokeWidth="2.4" strokeLinecap="round" />
    <g className="pq-wheel"><circle cx="20" cy="39" r="7" fill="#2c3038" stroke="#171a1f" strokeWidth="1.4" /><circle cx="20" cy="39" r="3" fill="#b9bec7" /><line x1="20" y1="32" x2="20" y2="46" stroke="#d7dce3" strokeWidth="1.3" /><line x1="13" y1="39" x2="27" y2="39" stroke="#d7dce3" strokeWidth="1.3" /></g>
    <g className="pq-wheel"><circle cx="40" cy="39" r="7" fill="#2c3038" stroke="#171a1f" strokeWidth="1.4" /><circle cx="40" cy="39" r="3" fill="#b9bec7" /><line x1="40" y1="32" x2="40" y2="46" stroke="#d7dce3" strokeWidth="1.3" /><line x1="33" y1="39" x2="47" y2="39" stroke="#d7dce3" strokeWidth="1.3" /></g>
    <g className="pq-wheel"><circle cx="55" cy="41" r="4.4" fill="#2c3038" stroke="#171a1f" strokeWidth="1.2" /><circle cx="55" cy="41" r="1.8" fill="#b9bec7" /></g>
  </svg>
);

export default function D11_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda swap-entrance qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

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
    <div className="pq pq1103">
      <style>{`
        .pq1103{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1103 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f7d8a;text-transform:uppercase;}
        .pq1103 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1103 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1103 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1103 .pq-scene{position:relative;width:380px;max-width:100%;height:258px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 46%,#eaf3ec 74%,#e3ecdf 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq1103 .pq-sun{position:absolute;top:11px;right:15px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1103 .pq-cloud{position:absolute;width:50px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq1103 .pq-cloud.c1{top:16px;left:-70px;animation-duration:32s;animation-delay:-6s;}
        .pq1103 .pq-cloud.c2{top:120px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:44s;animation-delay:-22s;}
        .pq1103 .pq-bird{position:absolute;z-index:0;color:#7c869a;opacity:.7;line-height:0;animation:pq1103Bird linear infinite;}
        .pq1103 .pq-bird svg{display:block;}
        .pq1103 .pq-bird.bd1{top:30px;left:-24px;animation-duration:26s;animation-delay:-4s;}
        .pq1103 .pq-bird.bd2{top:52px;left:-24px;animation-duration:35s;animation-delay:-18s;}
        .pq1103 .pq-bird.bd2 svg{width:12px;height:6px;}
        .pq1103 .pq-fly{position:absolute;z-index:0;left:28px;top:40px;line-height:0;animation:pq1103Fly 4s ease-in-out infinite;}
        @keyframes pq1103Bird{from{transform:translateX(0);}to{transform:translateX(440px);}}
        @keyframes pq1103Fly{0%,100%{transform:translateY(0) rotate(-5deg);}50%{transform:translateY(-8px) rotate(5deg);}}
        .pq1103 .pq-peron{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#d3c6ac,#bfae8d);border-top:3px solid #c9b892;z-index:1;}
        .pq1103 .pq-peron::after{content:'';position:absolute;left:0;right:0;top:5px;height:3px;background:repeating-linear-gradient(90deg,#a8966f 0 12px,rgba(0,0,0,0) 12px 24px);opacity:.6;}
        .pq1103 .pq-sem{position:absolute;right:14px;bottom:30px;display:flex;flex-direction:column;align-items:center;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq1103 .pq-sembox{display:flex;flex-direction:column;gap:3px;padding:4px;background:linear-gradient(#3f4756,#2b323f);border:2px solid #20252f;border-radius:6px;}
        .pq1103 .pq-lamp{width:11px;height:11px;border-radius:50%;}
        .pq1103 .pq-lamp.r{background:#5a2f2b;animation:pqSemR 4.4s linear infinite;}
        .pq1103 .pq-lamp.g{background:#2c4a2b;animation:pqSemG 4.4s linear infinite;}
        .pq1103 .pq-sempole{width:4px;height:20px;background:linear-gradient(90deg,#8a93a1,#5c6472);border-radius:2px;}
        .pq1103 .pq-sem.win .pq-lamp.r{background:#5a2f2b;animation:none;box-shadow:none;}
        .pq1103 .pq-sem.win .pq-lamp.g{background:#57d457;animation:pqGlow 1.4s ease-in-out infinite;}

        .pq1103 .pq-eq{position:absolute;left:50%;transform:translateX(-50%);z-index:4;font-size:16px;font-weight:900;padding:3px 13px;border-radius:11px;font-variant-numeric:tabular-nums;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,.12);}
        .pq1103 .pq-eq.known{top:60px;background:#eef4f6;color:#3a4c55;border:1.5px solid #cddde2;}
        .pq1103 .pq-eq.solve{top:143px;background:#fff8f2;color:#b45f2b;border:1.5px solid #f0cfa8;}
        .pq1103 .pq-eq.solve.win{background:#e8f7ee;color:#1a7f43;border-color:#8ed3a6;animation:pqChip .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1103 .pq-q{display:inline-block;color:#d9803a;animation:pqPulse 1.3s ease-in-out infinite;}
        .pq1103 .pq-fill{display:inline-block;color:#1a7f43;animation:pqFillIn .45s cubic-bezier(.3,1.5,.5,1) both;}

        .pq1103 .pq-train{position:absolute;left:14px;z-index:3;}
        .pq1103 .pq-train.top{top:98px;}
        .pq1103 .pq-train.bottom{top:162px;}
        .pq1103 .pq-cars{position:relative;display:flex;align-items:flex-end;gap:2px;z-index:2;animation:pqIdle 3.4s ease-in-out infinite;}
        .pq1103 .pq-train.bottom .pq-cars{animation-delay:-1.5s;}
        .pq1103 .pq-car{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1103 .pq-loco{line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq1103 .pq-wheel{transform-box:fill-box;transform-origin:center;animation:pqWheel 6s linear infinite;}
        .pq1103 .pq-blink{opacity:0;animation:pqBlink 4s linear infinite;}
        .pq1103 .pq-ground{position:absolute;left:0;right:0;top:118px;bottom:0;z-index:0;background:linear-gradient(#cbbda3 0%,#bcab8d 45%,#b0a081 100%);}
        .pq1103 .pq-ground::before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:#b8a67e;}
        .pq1103 .pq-rail{position:absolute;left:-20px;right:-220px;bottom:2px;height:8px;z-index:1;background:repeating-linear-gradient(90deg,#7d6a4c 0 4px,rgba(0,0,0,0) 4px 15px);animation:pqRailMove 1.15s linear infinite;}
        .pq1103 .pq-rail::before,.pq1103 .pq-rail::after{content:'';position:absolute;left:0;right:0;height:2.4px;border-radius:1px;background:linear-gradient(#e0e6ee,#9aa4b4);}
        .pq1103 .pq-rail::before{top:0;} .pq1103 .pq-rail::after{bottom:0;}
        .pq1103 .pq-steam{position:absolute;left:11px;top:-3px;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.85);z-index:4;opacity:0;animation:pqSteam 4s ease-in-out infinite;}
        .pq1103 .pq-steam.s2{left:16px;top:-1px;width:8px;height:8px;animation-delay:-2s;}
        .pq1103 .pq-cnt{position:absolute;top:-8px;right:-3px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq1103 .pq-lenbar{position:absolute;left:0;right:0;bottom:-11px;height:4px;border-radius:3px;background:#57a84f;z-index:4;animation:pqGrow .5s ease both;}
        .pq1103 .pq-lenbar::before,.pq1103 .pq-lenbar::after{content:'';position:absolute;top:-3px;width:4px;height:10px;border-radius:2px;background:#57a84f;}
        .pq1103 .pq-lenbar::before{left:0;} .pq1103 .pq-lenbar::after{right:0;}
        .pq1103 .pq-samenote{position:absolute;left:50%;bottom:5px;transform:translateX(-50%);z-index:6;font-size:12px;font-weight:800;color:#1a7f43;background:rgba(255,255,255,.9);padding:3px 12px;border-radius:999px;white-space:nowrap;animation:pqIn .3s ease both;}

        .pq1103 .pq-train.bottom:not(.still) .pq-car.g-b{animation:pqSwapR .55s cubic-bezier(.32,1.1,.42,1) both;}
        .pq1103 .pq-train.bottom:not(.still) .pq-car.g-a{animation:pqSwapL .55s cubic-bezier(.32,1.1,.42,1) both;}

        .pq1103 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq1103 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1103 .pq-opt:hover:not(:disabled){border-color:#9fd0d9;transform:translateY(-2px);}
        .pq1103 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1103 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1103 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1103 .pq-opt:disabled{cursor:default;}
        .pq1103 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1103 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1103 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqWheel{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqRailMove{from{background-position:0 0;}to{background-position:11px 0;}}
        @keyframes pqBallast{from{background-position:0 0;}to{background-position:18px 0;}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqSteam{0%,60%,100%{opacity:0;transform:translateY(0) scale(.6);}68%{opacity:.85;transform:translateY(-9px) scale(1);}86%{opacity:0;transform:translateY(-20px) scale(1.4);}}
        @keyframes pqBlink{0%,90%{opacity:0;}92%,96%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqSemR{0%,44%{background:#e2564d;box-shadow:0 0 8px 2px rgba(226,86,77,.6);}48%,100%{background:#5a2f2b;box-shadow:none;}}
        @keyframes pqSemG{0%,48%{background:#2c4a2b;box-shadow:none;}52%,96%{background:#57d457;box-shadow:0 0 8px 2px rgba(87,212,87,.6);}100%{background:#2c4a2b;box-shadow:none;}}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 8px 2px rgba(87,212,87,.55);}50%{box-shadow:0 0 13px 4px rgba(87,212,87,.9);}}
        @keyframes pqSwapR{0%{opacity:0;transform:translateX(96px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes pqSwapL{0%{opacity:0;transform:translateX(-96px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes pqPulse{0%,100%{transform:scale(1) rotate(-3deg);opacity:.7;}50%{transform:scale(1.2) rotate(3deg);opacity:1;}}
        @keyframes pqFillIn{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqChip{0%{opacity:0;transform:translateX(-50%) scale(.4);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqGrow{from{opacity:0;transform:scaleX(.2);}to{opacity:1;transform:scaleX(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-bird bd1" aria-hidden="true"><svg viewBox="0 0 24 10" width="15" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-bird bd2" aria-hidden="true"><svg viewBox="0 0 24 10" width="15" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-fly" aria-hidden="true"><svg viewBox="0 0 20 16" width="14" height="11"><ellipse cx="7" cy="6" rx="5" ry="4" fill="#f2b134" opacity=".72" /><ellipse cx="13" cy="6" rx="5" ry="4" fill="#e88078" opacity=".72" /><ellipse cx="7" cy="11" rx="4" ry="3" fill="#f2b134" opacity=".62" /><ellipse cx="13" cy="11" rx="4" ry="3" fill="#e88078" opacity=".62" /><rect x="9.4" y="3" width="1.2" height="10" rx="0.6" fill="#5a4632" /></svg></span>
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-ground" />
        <span className="pq-peron" />

        {/* Yuqori poyezd — ma'lum: 6 + 2 = 8 */}
        <div className="pq-eq known">{DATA.a} + {DATA.b} = {DATA.target}</div>
        <div className="pq-train top">
          <div className="pq-cars">
            <span className="pq-loco"><Loco /></span>
            {TOP.map((c, i) => (<span key={i} className="pq-car"><Wagon c={c} /></span>))}
          </div>
          <span className="pq-rail" />
          <span className="pq-steam" /><span className="pq-steam s2" />
        </div>

        {/* Pastki poyezd — almashgan: 2 + 6 = ? → g'alabada 8 + sanoq 1..8 */}
        <div className={'pq-eq solve' + (ok ? ' win' : '')}>
          {DATA.b} + {DATA.a} = {ok ? <b className="pq-fill">{DATA.target}</b> : <span className="pq-q">?</span>}
        </div>
        <div className={'pq-train bottom' + (still ? ' still' : '')}>
          <div className="pq-cars">
            <span className="pq-loco"><Loco /></span>
            {BOT.map((c, i) => (
              <span key={i} className={'pq-car g-' + c.g} style={{ animationDelay: `${i * 0.08}s` }}>
                <Wagon c={c} />
                {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.1}s` }}>{i + 1}</b>}
              </span>
            ))}
            {ok && <span className="pq-lenbar" />}
          </div>
          <span className="pq-rail" />
          <span className="pq-steam" /><span className="pq-steam s2" />
        </div>

        <div className={'pq-sem' + (ok ? ' win' : '')}>
          <div className="pq-sembox"><span className="pq-lamp r" /><span className="pq-lamp g" /></div>
          <span className="pq-sempole" />
        </div>

        {ok && <span className="pq-samenote">{t.same}</span>}
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
