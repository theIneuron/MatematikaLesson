// Dars11 · Amaliyot 05 — P11 Kommutativ tenglamani to'ldir «4 + 5 = 5 + ▢» · 🔴 · tag: fill_commutative
// Poyezd bekati: tablo-panelda tenglama (shtrix-slot breath). Ikki mini-poyezd yordamchi ko'rgazma:
// chap = loko + 4 qizil + 5 ko'k; o'ng = loko + 5 ko'k + ? qizil. O'rin almashtirish → bo'sh joy 4.
// G'alabada: slot yashil «4», o'ng poyezd tovushi 4 qizil vagon (badge 1..4), ikki poyezd teng uzunlik.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { a: 4, b: 5, target: 4, options: [3, 4, 5], ptype: 'P11', level: '🔴', tag: 'fill_commutative' };
const RED = '#d9534b', RED_D = '#b23c34', BLUE = '#4f8fc4', BLUE_D = '#356a92';

const T = {
  uz: {
    eyebrow: "Poyezd bekati · Tenglama", title: "Bo'sh joyni to'ldir",
    setup: "Poyezd tablosida tenglama: «4 + 5 = 5 + ▢». O'rin almashtirish qonunini eslang!",
    ask: "Bo'sh joyga qaysi son yoziladi?",
    correct: "Barakalla! To'rt qo'shuv besh — besh qo'shuv to'rt. O'rin almashdi, javob — to'rt!",
    hint: "Chap tomonda qaysi sonlar? O'ng tomonda beshdan keyin qaysi son kelishi kerak — tenglik saqlansin.",
  },
  ru: {
    eyebrow: "Вокзал · Уравнение", title: "Заполни пропуск",
    setup: "На табло поезда уравнение: «4 + 5 = 5 + ▢». Вспомни закон перестановки!",
    ask: "Какое число впишется в пустое место?",
    correct: "Молодец! Четыре плюс пять — это пять плюс четыре. Слагаемые поменялись местами, ответ — четыре!",
    hint: "Слева какие числа? Справа после пяти какое число должно стоять — чтобы равенство сохранилось.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// LOKOMOTIV (old tomon chapda): kabina o'ngda (deraza + mashinist boshi, ko'z pirpiratadi),
// old chiroq va cowcatcher chapda, mo'ri tepada (bug' chiqadi), 3 spitsali g'ildirak (aylanadi).
const Loco = () => (
  <svg className="pq-loco" viewBox="0 0 62 40" width="52" height="34" aria-hidden="true" style={{ display: 'block' }}>
    {/* footplate */}
    <rect x="8" y="27" width="47" height="4" rx="2" fill="#2b4157" />
    {/* wheels — spitsali, aylanadi */}
    <g className="pq-wh"><circle cx="17" cy="31" r="6" fill="#39414f" stroke="#232a36" strokeWidth="1.6" /><circle cx="17" cy="31" r="1.7" fill="#c3ccd9" /><line x1="17" y1="25" x2="17" y2="37" stroke="#8b95a6" strokeWidth="0.9" /><line x1="11" y1="31" x2="23" y2="31" stroke="#8b95a6" strokeWidth="0.9" /></g>
    <g className="pq-wh"><circle cx="34" cy="32.5" r="4.5" fill="#39414f" stroke="#232a36" strokeWidth="1.4" /><circle cx="34" cy="32.5" r="1.3" fill="#c3ccd9" /><line x1="34" y1="28" x2="34" y2="37" stroke="#8b95a6" strokeWidth="0.8" /><line x1="29.5" y1="32.5" x2="38.5" y2="32.5" stroke="#8b95a6" strokeWidth="0.8" /></g>
    <g className="pq-wh"><circle cx="46" cy="32.5" r="4.5" fill="#39414f" stroke="#232a36" strokeWidth="1.4" /><circle cx="46" cy="32.5" r="1.3" fill="#c3ccd9" /><line x1="46" y1="28" x2="46" y2="37" stroke="#8b95a6" strokeWidth="0.8" /><line x1="41.5" y1="32.5" x2="50.5" y2="32.5" stroke="#8b95a6" strokeWidth="0.8" /></g>
    {/* cowcatcher */}
    <path d="M2 30 L10 30 L6 25 Z" fill="#5a6577" stroke="#3d4653" strokeWidth="1" />
    {/* boiler */}
    <rect x="8" y="15" width="33" height="13" rx="6" fill="#4b6b8a" stroke="#33506b" strokeWidth="1.8" />
    <rect x="10" y="16.5" width="27" height="3" rx="1.5" fill="#fff" opacity=".18" />
    {/* smokebox + headlight (old chiroq) */}
    <rect x="5" y="13.5" width="8" height="15" rx="3" fill="#3a566f" stroke="#2b4157" strokeWidth="1.4" />
    <circle cx="9" cy="20" r="2.8" fill="#ffe08a" stroke="#d9a441" strokeWidth="1.1" />
    <circle cx="9" cy="20" r="1" fill="#fff7d6" />
    {/* chimney (mo'ri) */}
    <rect x="14" y="7" width="6" height="9" rx="1.6" fill="#33506b" />
    <rect x="12" y="5.5" width="10" height="3.2" rx="1.6" fill="#3a566f" />
    {/* dome */}
    <path d="M26 15 q3.5 -6 7 0 Z" fill="#33506b" />
    {/* cab */}
    <rect x="36" y="6" width="21" height="5" rx="2" fill="#33506b" />
    <rect x="38" y="8" width="19" height="20" rx="4" fill="#3f5f7d" stroke="#2b4157" strokeWidth="1.8" />
    {/* cab window + mashinist */}
    <rect x="41" y="12" width="13" height="9.5" rx="2.5" fill="#d7ecf7" stroke="#2b4157" strokeWidth="1.2" />
    <circle cx="47.5" cy="16.5" r="3.3" fill="#f0c9a5" />
    <path d="M44 15 Q47.5 11.6 51 15 Z" fill="#4a3a2a" />
    <g className="pq-blink2"><circle cx="46.4" cy="16.6" r="0.8" fill="#2b2320" /><circle cx="48.6" cy="16.6" r="0.8" fill="#2b2320" /></g>
    {/* back coupling */}
    <rect x="56" y="20" width="6" height="3" rx="1.5" fill="#6b7280" />
  </svg>
);

// VAGON: yumaloq-to'rtburchak tana, rangli, deraza, 2 spitsali g'ildirak, chap qo'shqich.
const Wagon = ({ c, d }) => (
  <svg className="pq-wagon" viewBox="0 0 30 34" width="24" height="27" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="0" y="18" width="6" height="3" rx="1.5" fill="#6b7280" />
    <rect x="4" y="6" width="22" height="16" rx="4.5" fill={c} stroke={d} strokeWidth="1.7" />
    <rect x="6" y="7.4" width="18" height="3" rx="1.5" fill="#fff" opacity=".26" />
    <rect x="8" y="10.5" width="14" height="6.5" rx="2" fill="#eaf4fb" stroke={d} strokeWidth="1" opacity=".92" />
    <line x1="15" y1="10.5" x2="15" y2="17" stroke={d} strokeWidth="0.9" opacity=".5" />
    <g className="pq-wh"><circle cx="11" cy="27" r="3.9" fill="#39414f" stroke="#232a36" strokeWidth="1.3" /><circle cx="11" cy="27" r="1.2" fill="#c3ccd9" /><line x1="11" y1="23.1" x2="11" y2="30.9" stroke="#8b95a6" strokeWidth="0.8" /><line x1="7.1" y1="27" x2="14.9" y2="27" stroke="#8b95a6" strokeWidth="0.8" /></g>
    <g className="pq-wh"><circle cx="20" cy="27" r="3.9" fill="#39414f" stroke="#232a36" strokeWidth="1.3" /><circle cx="20" cy="27" r="1.2" fill="#c3ccd9" /><line x1="20" y1="23.1" x2="20" y2="30.9" stroke="#8b95a6" strokeWidth="0.8" /><line x1="16.1" y1="27" x2="23.9" y2="27" stroke="#8b95a6" strokeWidth="0.8" /></g>
  </svg>
);

const Steam = () => (<><span className="pq-steam" /><span className="pq-steam s2" /><span className="pq-steam s3" /></>);

// SEMAFOR: ustun + ikki chiroq (qizil/yashil), navbatma-navbat yonadi.
const Semaphore = () => (
  <svg viewBox="0 0 24 84" width="22" height="77" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="10" y="18" width="4" height="62" fill="#5a6577" />
    <rect x="5" y="77" width="14" height="5" rx="2" fill="#48505e" />
    <rect x="4" y="3" width="16" height="27" rx="5" fill="#333b48" stroke="#20262f" strokeWidth="1.5" />
    <circle className="pq-lamp lred" cx="12" cy="10.5" r="4.4" fill="#e0483d" />
    <circle className="pq-lamp lgrn" cx="12" cy="22" r="4.4" fill="#3ddc84" />
  </svg>
);

export default function D11_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda vagon-tovlanish qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq1105">
      <style>{`
        .pq1105{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1105 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7fb5;text-transform:uppercase;}
        .pq1105 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1105 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1105 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1105 .pq-scene{position:relative;width:372px;max-width:100%;height:268px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 46%,#eaf3ff 62%);border:2px solid #c4dff0;overflow:hidden;}
        .pq1105 .pq-sun{position:absolute;top:12px;left:16px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1105 .pq-cloud{position:absolute;width:48px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1105 .pq-cloud.c1{top:22px;left:-70px;animation-duration:30s;animation-delay:-6s;}
        .pq1105 .pq-cloud.c2{top:60px;left:-70px;width:36px;height:11px;opacity:.7;animation-duration:44s;animation-delay:-26s;}
        .pq1105 .pq-ground{position:absolute;left:0;right:0;top:132px;bottom:0;z-index:0;background:linear-gradient(#cbbda3 0%,#bcab8d 42%,#b0a081 100%);}
        .pq1105 .pq-platform{position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(#c2ac82,#a98f63);border-top:3px solid #8a7048;z-index:1;}
        .pq1105 .pq-platform::before{content:'';position:absolute;left:0;right:0;top:3px;height:3px;background:repeating-linear-gradient(90deg,#f2c14e 0 14px,#4a4030 14px 28px);opacity:.8;}
        .pq1105 .pq-sema{position:absolute;right:12px;bottom:20px;z-index:2;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1105 .pq-lamp{transform-box:fill-box;transform-origin:center;}
        .pq1105 .pq-lamp.lred{animation:pqSig 3.2s ease-in-out infinite;}
        .pq1105 .pq-lamp.lgrn{animation:pqSig 3.2s ease-in-out infinite;animation-delay:-1.6s;}

        .pq1105 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:4;display:flex;align-items:center;gap:5px;padding:9px 16px 10px;border-radius:11px;background:linear-gradient(#22314a,#152238);border:3px solid #0e1826;box-shadow:0 5px 12px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.14);}
        .pq1105 .pq-board::before{content:'';position:absolute;left:-7px;right:-7px;top:-10px;height:10px;border-radius:6px 6px 0 0;background:linear-gradient(#3a4d6b,#243550);}
        .pq1105 .pq-board::after{content:'';position:absolute;left:22%;right:22%;top:100%;height:7px;border-radius:0 0 5px 5px;background:linear-gradient(#243550,rgba(36,53,80,0));}
        .pq1105 .pq-term{font-size:29px;font-weight:900;color:#ffd24a;font-variant-numeric:tabular-nums;text-shadow:0 0 7px rgba(255,210,74,.5);}
        .pq1105 .pq-op2{font-size:24px;font-weight:900;color:#7fe0ff;}
        .pq1105 .pq-eqs{font-size:27px;font-weight:900;color:#9fb3c8;margin:0 3px;}
        .pq1105 .pq-slot{width:38px;height:44px;border-radius:9px;border:3px dashed #6b7f9c;display:flex;align-items:center;justify-content:center;font-size:27px;font-weight:900;color:#8ea3bd;background:rgba(255,255,255,.04);animation:pqBreath 2s ease-in-out infinite;}
        .pq1105 .pq-slot.win{border-style:solid;border-color:#3ddc84;color:#8ff5bd;background:rgba(61,220,132,.16);text-shadow:0 0 8px rgba(61,220,132,.6);animation:pqPop .42s cubic-bezier(.3,1.5,.5,1) both;}

        .pq1105 .pq-rail{position:absolute;height:9px;z-index:2;background:repeating-linear-gradient(90deg,#7d6a4c 0 4px,rgba(0,0,0,0) 4px 15px);}
        .pq1105 .pq-rail::before,.pq1105 .pq-rail::after{content:'';position:absolute;left:-4px;right:-4px;height:2.5px;border-radius:2px;background:linear-gradient(#cfd6e0,#9aa3b0);}
        .pq1105 .pq-rail::before{top:0;} .pq1105 .pq-rail::after{bottom:0;}
        .pq1105 .pq-railA{top:148px;left:22px;width:322px;}
        .pq1105 .pq-railB{top:212px;left:22px;width:322px;}

        .pq1105 .pq-train{position:absolute;left:30px;display:flex;align-items:flex-end;gap:2px;z-index:3;animation:pqTrainBob 3.6s ease-in-out infinite;}
        .pq1105 .pq-trainA{top:116px;}
        .pq1105 .pq-trainB{top:180px;animation-delay:-1.8s;}
        .pq1105 .pq-loco-w{position:relative;line-height:0;margin-right:1px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq1105 .pq-wg{position:relative;line-height:0;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1105 .pq-wh{transform-box:fill-box;transform-origin:center;animation:pqSpin 1.5s linear infinite;}
        .pq1105 .pq-loco .pq-wh:nth-of-type(2){animation-duration:1.15s;}
        .pq1105 .pq-blink2{opacity:1;animation:pqBlink 3.7s linear infinite;}
        .pq1105 .pq-steam{position:absolute;left:12px;top:-3px;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.9);z-index:4;opacity:0;animation:pqSteam 2.8s ease-in-out infinite;}
        .pq1105 .pq-steam.s2{left:9px;animation-delay:-.9s;} .pq1105 .pq-steam.s3{left:14px;animation-delay:-1.8s;}
        .pq1105 .pq-cnt{position:absolute;top:-13px;left:50%;transform:translateX(-50%);min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:6;}
        .pq1105 .pq-rev{animation:pqWagIn .5s cubic-bezier(.3,1.3,.5,1) both;animation-delay:var(--rd,0s);}
        .pq1105 .pq-rev.still{animation:none;}
        .pq1105 .pq-ph{width:98px;height:22px;margin-bottom:6px;align-self:center;border-radius:7px;border:2.5px dashed #93a2b8;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;color:#7d8da2;background:rgba(255,255,255,.4);animation:pqBreath 2s ease-in-out infinite;}

        .pq1105 .pq-chip{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);z-index:6;display:flex;align-items:center;gap:6px;font-size:18px;font-weight:900;color:#1a7f43;background:#fff;padding:4px 15px;border-radius:12px;box-shadow:0 4px 12px rgba(26,127,67,.24);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq1105 .pq-chip svg{width:16px;height:16px;}

        .pq1105 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq1105 .pq-opt{width:70px;height:70px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1105 .pq-opt:hover:not(:disabled){border-color:#9fc4e4;transform:translateY(-2px);}
        .pq1105 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1105 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1105 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1105 .pq-opt:disabled{cursor:default;}
        .pq1105 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1105 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1105 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqTrainBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqBlink{0%,90%{opacity:1;}92%,96%{opacity:0;}98%,100%{opacity:1;}}
        @keyframes pqSteam{0%,60%,100%{opacity:0;transform:translateY(0) scale(.6);}68%{opacity:.85;transform:translateY(-9px) scale(1);}86%{opacity:0;transform:translateY(-20px) scale(1.4);}}
        @keyframes pqSig{0%,42%{opacity:1;}50%,100%{opacity:.24;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pqWagIn{0%{opacity:0;transform:translateY(-22px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-ground" />
        <span className="pq-platform" />
        <span className="pq-sema"><Semaphore /></span>

        {/* Poyezd tablosi — tenglama, shtrix-slot */}
        <div className="pq-board">
          <span className="pq-term">{DATA.a}</span><span className="pq-op2">+</span><span className="pq-term">{DATA.b}</span>
          <span className="pq-eqs">=</span>
          <span className="pq-term">{DATA.b}</span><span className="pq-op2">+</span>
          <span className={'pq-slot' + (ok ? ' win' : '')}>{ok ? DATA.target : '?'}</span>
        </div>

        <span className="pq-rail pq-railA" />
        <span className="pq-rail pq-railB" />

        {/* Chap poyezd: loko + 4 qizil + 5 ko'k (= 4 + 5) */}
        <div className="pq-train pq-trainA">
          <span className="pq-loco-w"><Loco /><Steam /></span>
          {Array.from({ length: DATA.a }).map((_, i) => (<span className="pq-wg" key={'ar' + i}><Wagon c={RED} d={RED_D} /></span>))}
          {Array.from({ length: DATA.b }).map((_, i) => (<span className="pq-wg" key={'ab' + i}><Wagon c={BLUE} d={BLUE_D} /></span>))}
        </div>

        {/* O'ng poyezd: loko + 5 ko'k + ? qizil (= 5 + ▢) */}
        <div className="pq-train pq-trainB">
          <span className="pq-loco-w"><Loco /><Steam /></span>
          {Array.from({ length: DATA.b }).map((_, i) => (<span className="pq-wg" key={'bb' + i}><Wagon c={BLUE} d={BLUE_D} /></span>))}
          {ok
            ? Array.from({ length: DATA.target }).map((_, i) => (
                <span className={'pq-wg pq-rev' + (still ? ' still' : '')} key={'br' + i} style={{ '--rd': `${i * 0.12}s` }}>
                  <Wagon c={RED} d={RED_D} />
                  <b className="pq-cnt" style={{ animationDelay: `${i * 0.1}s` }}>{i + 1}</b>
                </span>
              ))
            : <span className="pq-ph">?</span>}
        </div>

        {ok && <span className="pq-chip"><IconOk />{DATA.a} + {DATA.b} = {DATA.b} + {DATA.target}</span>}
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
