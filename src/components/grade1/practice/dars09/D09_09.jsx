// Dars09 · Amaliyot 09 — P9 Ikki bosqichli aralash masala (3 + 2 − 1 = 4) · 🔴 · tag: word_mixed_2step
// Katta nilufar bargida 3 qurbaqa (D09_06 kanoni). Ochilishda AVVAL 2 tasi suvdan sakrab CHIQIB bargga
// qo'shiladi (kirish-arklar), pauzadan KEYIN 1 tasi suvga sho'ng'ib ketadi (dive + halqa). Bargda 4 qoladi.
// G'alabada badge faqat qolgan 4 tada, chip «3 + 2 − 1 = 4» (U+2212). Qamishlar sway, ninachi suzadi,
// suv-halqalar, quyosh breath, 2 bulut. Review/qayta ochilishda ketish-kirish qayta ijro etilmaydi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { start: 3, plus: 2, minus: 1, target: 4, options: [3, 4, 5, 2], ptype: 'P9', level: '🔴', tag: 'word_mixed_2step' };

// Katta bargdagi 5 qurbaqa. role: 'stay' (boshdan o'tiradi) | 'in' (1-to'lqin, suvdan sakrab chiqadi) |
// 'out' (2-to'lqin, suvga sho'ng'ib ketadi). fd — to'lqin kechikishi (s).
const FROGS = [
  { x: 88,  y: 94,  role: 'stay' },
  { x: 150, y: 84,  role: 'stay' },
  { x: 208, y: 92,  role: 'out', fd: 2.5 },
  { x: 116, y: 122, role: 'in',  fd: 0.55 },
  { x: 180, y: 124, role: 'in',  fd: 1.0 },
];
// Qoluvchilar (role !== 'out') chapdan-o'ngga 1..4 badge oladi.
const BADGE = {}; { const rem = FROGS.map((f, i) => ({ i, x: f.x })).filter((o) => FROGS[o.i].role !== 'out').sort((a, b) => a.x - b.x); rem.forEach((o, k) => { BADGE[o.i] = k + 1; }); }
const SPLASH_DELAY = FROGS.find((f) => f.role === 'out').fd + 0.5; // dive suvga tekkanda

const T = {
  uz: {
    eyebrow: "Hovuz bo'yida · Masala", title: "Aralash masala",
    setup: "Bargda uchta qurbaqa o'tirgan edi. Avval yana ikkitasi suvdan chiqib qo'shildi, keyin bittasi suvga sakrab ketdi.",
    ask: "Endi bargda nechta qurbaqa bor?",
    correct: "Barakalla! Uchga ikki qo'shildi, bittasi ketdi — to'rtta qoldi.",
    hint: "Bosqichma-bosqich: avval uchga ikkini qo'shing, keyin chiqqan sondan birni ayiring.",
  },
  ru: {
    eyebrow: "У пруда · Задача", title: "Смешанная задача",
    setup: "На листе сидели три лягушки. Сначала ещё две выбрались из воды и присоединились, потом одна прыгнула в воду и уплыла.",
    ask: "Сколько лягушек теперь на листе?",
    correct: "Молодец! К трём прибавили две, одна ушла — осталось четыре.",
    hint: "По шагам: сначала к трём прибавь две, потом от полученного числа отними одну.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI (D09_06): o'tirgan poza, yashil 2-3 ton (tana #57a84f, qorin #a8d89e, kontur #2e6e28),
// TEPADA ikki bo'rtiq blikli ko'z (pirpiratadi), keng tabassum, tomoq-puls; bitta figura = bitta qurbaqa.
const Frog = () => (
  <svg viewBox="0 0 64 60" width="46" height="43" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="32" cy="53" rx="26" ry="6.5" fill="#4f9a48" stroke="#3c7d36" strokeWidth="1.4" />
    <path d="M32 53 L54 49.5" stroke="#3c7d36" strokeWidth="1.2" opacity=".6" />
    <ellipse cx="25" cy="51.5" rx="12" ry="2.8" fill="#68bd60" opacity=".55" />
    <path d="M12 46 Q6 38 11 31 Q16 26 19 33 Q21 41 16 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M52 46 Q58 38 53 31 Q48 26 45 33 Q43 41 48 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 47 L7 49.5 M14.5 48 L10.5 51" stroke="#2e6e28" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M52 47 L57 49.5 M49.5 48 L53.5 51" stroke="#2e6e28" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="32" cy="34" rx="18" ry="14.5" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <ellipse className="pq-throat" cx="32" cy="40" rx="11.5" ry="7.5" fill="#a8d89e" />
    <circle cx="23" cy="15" r="7.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.5" />
    <circle cx="41" cy="15" r="7.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.5" />
    <circle cx="23" cy="15" r="5" fill="#fff" />
    <circle cx="41" cy="15" r="5" fill="#fff" />
    <circle cx="24" cy="16" r="2.2" fill="#1f2430" /><circle cx="24.9" cy="15.2" r="0.8" fill="#fff" />
    <circle cx="40" cy="16" r="2.2" fill="#1f2430" /><circle cx="40.9" cy="15.2" r="0.8" fill="#fff" />
    <g className="pq-blink"><circle cx="23" cy="15" r="5.3" fill="#57a84f" /><circle cx="41" cy="15" r="5.3" fill="#57a84f" /></g>
    <path d="M22 29 Q32 36 42 29" stroke="#2e6e28" strokeWidth="1.9" fill="none" strokeLinecap="round" />
    <path d="M25 45.5 L25 51 M39 45.5 L39 51" stroke="#3f8a39" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M25 51 L21 53 M25 51 L28.5 53.4 M39 51 L35.5 53.4 M39 51 L43 53" stroke="#2e6e28" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// Katta nilufar bargi: to'q ostki soya + yashil yuza + tomirlar + o'ng tomonda V-o'yiq (suv ko'rinadi).
const LilyPad = () => (
  <svg viewBox="0 0 244 130" width="244" height="130" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="122" cy="80" rx="118" ry="46" fill="#2f6f2c" opacity=".45" />
    <ellipse cx="122" cy="72" rx="118" ry="48" fill="#57a84f" stroke="#2e6e28" strokeWidth="2.4" />
    <ellipse cx="118" cy="64" rx="104" ry="37" fill="#66b85c" opacity=".5" />
    <g stroke="#3f8a39" strokeWidth="2" strokeLinecap="round" opacity=".65">
      <line x1="122" y1="72" x2="18" y2="66" />
      <line x1="122" y1="72" x2="42" y2="40" />
      <line x1="122" y1="72" x2="120" y2="28" />
      <line x1="122" y1="72" x2="200" y2="40" />
      <line x1="122" y1="72" x2="204" y2="104" />
      <line x1="122" y1="72" x2="40" y2="104" />
      <line x1="122" y1="72" x2="120" y2="116" />
    </g>
    <path d="M122 72 L240 60 Q244 72 240 84 Z" fill="#7fc7d6" opacity=".92" />
  </svg>
);

// Kichik bo'sh barg + nilufar guli (dekor, sanalmaydi).
const Lotus = () => (
  <svg viewBox="0 0 70 46" width="70" height="46" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="35" cy="34" rx="33" ry="11" fill="#3f8a39" opacity=".9" />
    <ellipse cx="33" cy="31" rx="29" ry="9" fill="#57a84f" />
    <path d="M33 30 L58 26 Q60 31 58 35 Z" fill="#7fc7d6" opacity=".8" />
    <g>
      <ellipse cx="26" cy="22" rx="5" ry="10" fill="#f4a7c6" transform="rotate(-24 26 22)" />
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="#f4a7c6" transform="rotate(24 40 22)" />
      <ellipse cx="33" cy="18" rx="5" ry="11" fill="#f8bcd6" />
      <ellipse cx="33" cy="21" rx="4" ry="7" fill="#fbd7e6" />
      <circle cx="33" cy="20" r="2.6" fill="#f6c453" />
    </g>
  </svg>
);

// NINACHI (D09_06): kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="38" height="24" aria-hidden="true" style={{ display: 'block' }}>
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

// QAMISH (D09_06): 2 poya + qo'ng'ir boshoq, pastdan sway; yonida o't-tuflar.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="34" height="63" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
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

export default function D09_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish/ketish qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq0909">
      <style>{`
        .pq0909{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0909 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq0909 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq0909 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0909 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0909 .pq-scene{position:relative;width:372px;max-width:100%;height:224px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 40%,#d6eef5 56%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq0909 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0909 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0909 .pq-cloud.c1{top:14px;left:-70px;animation-duration:29s;animation-delay:-11s;}
        .pq0909 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-25s;}
        .pq0909 .pq-water{position:absolute;left:0;right:0;bottom:0;height:132px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq0909 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.6);}
        .pq0909 .pq-shore{position:absolute;bottom:0;width:60px;height:22px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq0909 .pq-shore.l{left:0;border-radius:0 22px 0 0;}
        .pq0909 .pq-shore.r{right:0;border-radius:22px 0 0 0;}
        .pq0909 .pq-reedw{position:absolute;line-height:0;z-index:4;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0909 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq0909 .pq-lotus{position:absolute;left:8px;bottom:18px;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));animation:pqFloat 5.2s ease-in-out infinite;}
        .pq0909 .pq-dflyw{position:absolute;left:250px;top:40px;line-height:0;z-index:4;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq0909 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq0909 .pq-dwing.w2{animation-delay:-.08s;} .pq0909 .pq-dwing.w3{animation-delay:-.14s;} .pq0909 .pq-dwing.w4{animation-delay:-.05s;}
        .pq0909 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq0909 .pq-ring.r2{animation-delay:-1.9s;}
        .pq0909 .pq-pad{position:absolute;left:64px;top:58px;line-height:0;z-index:2;filter:drop-shadow(0 3px 4px rgba(0,0,0,.16));}
        .pq0909 .pq-splash{position:absolute;left:210px;top:150px;width:30px;height:11px;margin-left:-15px;border:2.5px solid rgba(255,255,255,.85);border-radius:50%;z-index:3;opacity:0;animation:pqSplash 1s ease-out both;animation-delay:${SPLASH_DELAY}s;}
        .pq0909 .pq-splash.s2{width:44px;height:15px;margin-left:-22px;animation-duration:1.2s;border-color:rgba(255,255,255,.55);}
        .pq0909 .pq-frog{position:absolute;line-height:0;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0909 .pq-frog.arrive{animation:pqInArc .95s cubic-bezier(.4,1.1,.6,1) both;animation-delay:var(--fd,0s);}
        .pq0909 .pq-frog.leave{animation:pqDiveOut .85s ease-in both;animation-delay:var(--fd,0s);}
        .pq0909 .pq-scene.still .pq-frog.arrive{animation:none;}
        .pq0909 .pq-scene.still .pq-frog.leave{animation:none;opacity:0;pointer-events:none;}
        .pq0909 .pq-scene.still .pq-splash{animation:none;opacity:0;}
        .pq0909 .pq-bobf{display:block;position:relative;animation:pqBobF 2.6s ease-in-out infinite;animation-delay:var(--bf,0s);}
        .pq0909 .pq-bobf.win{animation:pqBobF 2.6s ease-in-out infinite,pqCele .55s ease;}
        .pq0909 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0909 .pq-throat{transform-box:fill-box;transform-origin:50% 55%;animation:pqThroat 1.7s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq0909 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq0909 .pq-q{position:absolute;left:50%;top:22px;margin-left:-17px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#3f7fb5;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(63,127,181,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:5;}
        .pq0909 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0909 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0909 .pq-opt{width:66px;height:66px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0909 .pq-opt:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq0909 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0909 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0909 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0909 .pq-opt:disabled{cursor:default;}
        .pq0909 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0909 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0909 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(-70px,-10px) rotate(-6deg);}50%{transform:translate(-128px,16px) rotate(5deg);}75%{transform:translate(-54px,30px) rotate(-4deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqInArc{0%{opacity:0;transform:translate(-4px,66px) scale(.55);}18%{opacity:1;}55%{transform:translate(2px,-26px) scale(1.07);}80%{transform:translate(0,7px) scale(.97);}100%{opacity:1;transform:translate(0,0) scale(1);}}
        @keyframes pqDiveOut{0%{opacity:1;transform:translate(0,0) scale(1);}22%{transform:translate(0,-24px) scale(1.07);}60%{opacity:1;}100%{opacity:0;transform:translate(6px,62px) scale(.5);}}
        @keyframes pqSplash{0%{opacity:0;transform:scale(.2);}25%{opacity:.85;}100%{opacity:0;transform:scale(2.6);}}
        @keyframes pqBobF{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-water" />
        <span className="pq-shore l" /><span className="pq-shore r" />
        <span className="pq-ring" style={{ left: 60, bottom: 26 }} />
        <span className="pq-ring r2" style={{ left: 300, bottom: 40 }} />
        <span className="pq-lotus"><Lotus /></span>
        <span className="pq-pad"><LilyPad /></span>
        <span className="pq-reedw" style={{ left: 3, bottom: 92 }}><Reeds /></span>
        <span className="pq-reedw" style={{ right: 3, bottom: 84 }}><Reeds flip /></span>
        <span className="pq-dflyw"><Dragonfly /></span>

        {/* 5 kanon-qurbaqa: 3 boshdan o'tiradi, 2 sakrab kiradi (1-to'lqin), 1 sho'ng'ib ketadi (2-to'lqin) */}
        {FROGS.map((f, i) => (
          <span key={i}
            className={'pq-frog' + (f.role === 'in' ? ' arrive' : f.role === 'out' ? ' leave' : '')}
            style={f.role === 'stay' ? { left: f.x, top: f.y } : { left: f.x, top: f.y, animationDelay: `${f.fd}s`, '--fd': `${f.fd}s` }}>
            <span className={'pq-bobf' + (ok ? ' win' : '')} style={{ '--bf': `-${i * 0.6}s`, '--bd': `-${i * 0.85}s` }}>
              <Frog />
              {ok && f.role !== 'out' && <b className="pq-cnt" style={{ animationDelay: `${(BADGE[i] - 1) * 0.12}s` }}>{BADGE[i]}</b>}
            </span>
          </span>
        ))}

        {/* Sho'ng'ish halqasi (dive suvga tekkanda) */}
        <span className="pq-splash" />
        <span className="pq-splash s2" />

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.start} + {DATA.plus} − {DATA.minus} = {DATA.target}</span>}
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
