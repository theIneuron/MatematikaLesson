// Dars12 · Amaliyot 04 — P4 To'g'rimi? «besh katta sakkizdan» · 🟡 · timsoh · tag: compare_true_false
// Timsoh og'zi (belgi) 5 tomonga ochilgan — «5 > 8», bu YOLG'ON (8 katta). G'alabada og'iz 8 tomonga buriladi, «5 < 8».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 5, B = 8;                 // yozuv: A ? B  =>  «besh katta sakkizdan»
const IS_TRUE = false;             // 5 > 8 — noto'g'ri (8 katta)
const CORRECT = IS_TRUE ? 'T' : 'F'; // 'F' = Noto'g'ri
const DATA = { statement: '5 > 8', isTrue: false, ptype: 'P4', level: '🟡', tag: 'compare_true_false' };
const T = {
  uz: {
    eyebrow: "Timsohlar ko'li · To'g'rimi?", title: "Yozuv to'g'rimi?",
    setup: "Timsoh yozuvni ko'rsatdi: «besh katta sakkizdan». Lekin bu to'g'rimi?",
    ask: "Bu yozuv to'g'ri yoki noto'g'ri?",
    correct: "Barakalla! Bu noto'g'ri — besh sakkizdan KICHIK. Timsoh adashibdi!",
    hint: "Qaysi son katta — besh yoki sakkiz? Belgi to'g'ri turibdimi?",
    optTrue: "To'g'ri", optFalse: "Noto'g'ri",
    fix: "To'g'risi: besh sakkizdan kichik",
  },
  ru: {
    eyebrow: "Озеро крокодилов · Верно ли?", title: "Верна ли запись?",
    setup: "Крокодил показал запись: «пять больше восьми». Но верно ли это?",
    ask: "Эта запись верна или неверна?",
    correct: "Молодец! Это неверно — пять МЕНЬШЕ восьми. Крокодил ошибся!",
    hint: "Какое число больше — пять или восемь? Правильно ли стоит знак?",
    optTrue: "Верно", optFalse: "Неверно",
    fix: "Верно: пять меньше восьми",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Check = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const Cross = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);

// Chizilgan timsoh (D04_10 kanoni; o'ngga qaragan holat, chap uchun wrapper scaleX(-1)).
// Og'zi OCHIQ — jag'lar taqqoslash belgisini (< >) eslatadi: KATTA son tomonga ochiladi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="120" height="65" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />
    <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
    <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
    <g className={chomp ? 'pq-jaws chomping' : 'pq-jaws'}>
      <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
      <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
      <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
    </g>
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-blink" cx="63" cy="28.5" r="6.4" fill="#3f9950" />
  </svg>
);

// Kanon baliq (D04_10): tomchi-tana #e8883a, qorni #f6c07a, dum #c96a24, blikli ko'z. Dumi qimirlaydi.
const Fish = () => (
  <svg viewBox="0 0 40 24" width="26" height="16" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-ftail" d="M10 12 L2 5 L4.5 12 L2 19 Z" fill="#c96a24" stroke="#a8531a" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 12 Q13 4.5 23 4 Q36 4.5 37.5 12 Q36 19.5 23 20 Q13 19.5 8 12 Z" fill="#e8883a" stroke="#a8531a" strokeWidth="1.3" />
    <path d="M11 14.5 Q22 20.5 34 14 Q30 18.5 22 18.8 Q15 18.5 11 14.5 Z" fill="#f6c07a" />
    <path d="M17 5.8 Q22 2.6 26.5 6 Q21.5 7.6 17 5.8 Z" fill="#c96a24" />
    <path d="M20 12.5 Q24 14.5 22.5 17.5" fill="none" stroke="#c96a24" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="30.5" cy="9.6" r="2.1" fill="#1f2430" />
    <circle cx="31.3" cy="8.9" r="0.7" fill="#fff" />
    <path d="M34.8 13.6 q1.6 1.1 3 .5" fill="none" stroke="#a8531a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// NINACHI (D09_06): tana + 2 juft shaffof qanot (pirillaydi).
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse className="pq-dwing" cx="18" cy="8" rx="12" ry="4" fill="#cfe9fb" transform="rotate(-18 18 8)" />
    <ellipse className="pq-dwing w2" cx="26" cy="8" rx="12" ry="4" fill="#dff1fd" transform="rotate(14 26 8)" />
    <ellipse className="pq-dwing w3" cx="18" cy="19" rx="11" ry="3.6" fill="#cfe9fb" transform="rotate(16 18 19)" />
    <ellipse className="pq-dwing w4" cx="26" cy="19" rx="11" ry="3.6" fill="#dff1fd" transform="rotate(-12 26 19)" />
    <path d="M33 13.5 L9 13.5" stroke="#4f8fc4" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 13.5 L13 13.5" stroke="#33648f" strokeWidth="1" opacity=".5" />
    <circle cx="36" cy="13.5" r="3.6" fill="#4f8fc4" stroke="#33648f" strokeWidth="1.2" />
    <circle cx="37.6" cy="12.2" r="1" fill="#1f2430" />
  </svg>
);

// QAMISH (D09_06): 2 poya + qo'ng'ir boshoq, pastdan sway.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="30" height="56" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <g className="pq-reed" style={{ '--rd': '0s' }}>
      <path d="M10 74 Q9 40 12 18" stroke="#3c7d36" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="12.5" cy="13" rx="3.4" ry="8" fill="#8a5f3a" stroke="#6d4526" strokeWidth="1" />
    </g>
    <g className="pq-reed" style={{ '--rd': '-1.3s' }}>
      <path d="M25 74 Q25 46 21 27" stroke="#4f9a48" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="20.5" cy="22.5" rx="3" ry="7" fill="#9a6b40" stroke="#6d4526" strokeWidth="1" />
    </g>
    <path d="M2 74 q3 -12 6 -1 M32 74 q3 -14 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
);

export default function D12_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 'T' | 'F'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const v = initialAnswer.studentAnswer.value;
      if (v != null) setPicked(v === T.uz.optTrue || v === T.ru.optTrue ? 'T' : 'F');
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const lock = isReview || checked;
  const pick = (p) => { if (lock) return; setPicked(p); setFeedback(null); };

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: [t.optTrue, t.optFalse],
      studentAnswer: { value: picked === 'T' ? t.optTrue : t.optFalse },
      correctAnswer: { value: IS_TRUE ? t.optTrue : t.optFalse },
      correct, meta: { ...DATA },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // Yozuvdagi belgi: boshida «>» (og'iz 5 tomonga = chapga); to'g'irlangach «<» (og'iz 8 tomonga = o'ngga).
  const facingLeft = !ok; // «>» => og'iz chapga (kattani chap deydi — noto'g'ri)

  return (
    <div className="pq pq1204">
      <style>{`
        .pq1204{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1204 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1204 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1204 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1204 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1204 .pq-scene{position:relative;width:100%;max-width:432px;margin:0 auto;min-height:258px;border-radius:22px;overflow:hidden;background:linear-gradient(#cfe9fb 0%,#bfe6f0 34%,#89cee0 56%,#5fb2cb 100%);border:2px solid #b9dcee;}
        .pq1204 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1204 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1204 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-8s;}
        .pq1204 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:40s;animation-delay:-26s;}
        .pq1204 .pq-reedw{position:absolute;bottom:0;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1204 .pq-reedw.l{left:4px;} .pq1204 .pq-reedw.r{right:4px;}
        .pq1204 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1204 .pq-dflyw{position:absolute;left:70px;top:172px;line-height:0;z-index:2;animation:pqDfly 14s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1204 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1204 .pq-dwing.w2{animation-delay:-.08s;} .pq1204 .pq-dwing.w3{animation-delay:-.14s;} .pq1204 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1204 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:1;opacity:0;animation:pqRing 4s ease-out infinite;}
        .pq1204 .pq-ring.r2{animation-delay:-2s;}
        .pq1204 .pq-content{position:relative;z-index:3;padding:16px 10px 18px;}
        .pq1204 .pq-compare{position:relative;display:flex;align-items:center;justify-content:center;gap:6px;}
        .pq1204 .pq-q{position:absolute;top:-8px;left:50%;transform:translateX(-50%);z-index:5;font-size:30px;font-weight:900;color:#fff;text-shadow:0 2px 5px rgba(0,0,0,.3);animation:pqQ 1.7s ease-in-out infinite;pointer-events:none;}
        .pq1204 .pq-side{display:flex;flex-direction:column;align-items:center;gap:9px;width:146px;}
        .pq1204 .pq-num{width:62px;height:66px;border-radius:16px;background:linear-gradient(#fffdf7,#fdf3df);border:3px solid #e6c88a;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;color:#8a5a1f;box-shadow:0 3px 0 #d9b877,0 5px 10px rgba(0,0,0,.12);font-variant-numeric:tabular-nums;transition:.3s;}
        .pq1204 .pq-num.big{border-color:#1a7f43;color:#1a7f43;background:linear-gradient(#f0fbf4,#dff5e8);box-shadow:0 3px 0 #9bd3af,0 6px 14px rgba(26,127,67,.25);transform:scale(1.08);}
        .pq1204 .pq-shoal{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;align-items:center;width:150px;min-height:66px;}
        .pq1204 .pq-fish{position:relative;line-height:0;animation:pqBob 2.4s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18));}
        .pq1204 .pq-fish span{display:inline-block;line-height:0;}
        .pq1204 .pq-fish.flip span{transform:scaleX(-1);}
        .pq1204 .pq-ftail{transform-box:fill-box;transform-origin:100% 50%;animation:pqTail 1.5s ease-in-out infinite;}
        .pq1204 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq1204 .pq-crocwrap{flex-shrink:0;line-height:0;transition:transform .55s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 2px 2px rgba(0,0,0,.22));}
        .pq1204 .pq-crocwrap.faceL{transform:scaleX(-1);}
        .pq1204 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq1204 .pq-jaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq1204 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqSway 3.4s ease-in-out infinite;}
        .pq1204 .pq-blink{opacity:0;animation:pqBlink 4.2s linear infinite;}
        .pq1204 .pq-fix{margin:14px auto 0;max-width:300px;text-align:center;background:#fff;color:#1a7f43;font-size:15px;font-weight:800;padding:8px 14px;border-radius:12px;box-shadow:0 5px 14px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1204 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq1204 .pq-opt{flex:1;max-width:196px;display:flex;align-items:center;justify-content:center;gap:9px;padding:16px 12px;border-radius:16px;border:3px solid #d6dae3;background:#fff;color:#374151;font-size:19px;font-weight:800;cursor:pointer;transition:.13s;}
        .pq1204 .pq-opt .ic{display:flex;}
        .pq1204 .pq-opt.t .ic{color:#1a7f43;} .pq1204 .pq-opt.f .ic{color:#c0392b;}
        .pq1204 .pq-opt:hover:not(:disabled){transform:translateY(-2px);border-color:#b9c2cf;}
        .pq1204 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq1204 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#1f3f9e;}
        .pq1204 .pq-opt.miss{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}
        .pq1204 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1204 .pq-opt:disabled{cursor:default;}
        .pq1204 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1204 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1204 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(520px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(84px,-16px) rotate(6deg);}50%{transform:translate(150px,10px) rotate(-4deg);}75%{transform:translate(60px,24px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.8;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqQ{0%,100%{transform:translateX(-50%) scale(1);opacity:.82;}50%{transform:translateX(-50%) scale(1.16);opacity:1;}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqTail{0%,100%{transform:rotate(7deg);}50%{transform:rotate(-7deg);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pqBlink{0%,90%{opacity:0;}93%,96%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:scale(.5);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-reedw l" style={{ bottom: 2 }}><Reeds /></span>
        <span className="pq-reedw r" style={{ bottom: 2 }}><Reeds flip /></span>
        <span className="pq-ring" style={{ left: 96, bottom: 26 }} />
        <span className="pq-ring r2" style={{ right: 104, bottom: 40 }} />
        <span className="pq-dflyw"><Dragonfly /></span>

        <div className="pq-content">
          <div className="pq-compare">
            {!ok && <span className="pq-q">?</span>}

            <div className="pq-side">
              <div className="pq-num">{A}</div>
              <div className="pq-shoal">
                {Array.from({ length: A }).map((_, i) => (
                  <span key={i} className="pq-fish" style={{ animationDelay: `${(i % 3) * 0.4}s` }}>
                    <span><Fish /></span>{ok && <b className="pq-cnt">{i + 1}</b>}
                  </span>
                ))}
              </div>
            </div>

            <div className={'pq-crocwrap' + (facingLeft ? ' faceL' : '')}>
              <Croc chomp={!!ok} />
            </div>

            <div className="pq-side">
              <div className={'pq-num' + (ok ? ' big' : '')}>{B}</div>
              <div className="pq-shoal">
                {Array.from({ length: B }).map((_, i) => (
                  <span key={i} className="pq-fish flip" style={{ animationDelay: `${(i % 4) * 0.35}s` }}>
                    <span><Fish /></span>{ok && <b className="pq-cnt">{i + 1}</b>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {ok && <div className="pq-fix">{t.fix}</div>}
        </div>
      </div>

      <div className="pq-opts">
        <button type="button" className={'pq-opt t' + (ok && CORRECT === 'T' ? ' right' : picked === 'T' ? (feedback && !ok ? ' miss' : ' sel') : '')} disabled={lock} onClick={() => pick('T')}>
          <span className="ic"><Check /></span>{t.optTrue}
        </button>
        <button type="button" className={'pq-opt f' + (ok && CORRECT === 'F' ? ' right' : picked === 'F' ? (feedback && !ok ? ' miss' : ' sel') : '')} disabled={lock} onClick={() => pick('F')}>
          <span className="ic"><Cross /></span>{t.optFalse}
        </button>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
