// Dars09 · Amaliyot 06 — P8 Zanjir aralash «Sakrash musobaqasi» · 🔴 · tag: mixed_chain
// 4 ARALASH misol birdaniga (qo'shish + ayirish, belgi rangli). Hovuz-sahna: taxta «Sakrash
// musobaqasi», 4 kanon-qurbaqa nilufar bargida (mount'da birin-ketin sakrab kiradi, keyin bob,
// ko'z pirpiratadi + tomoq-puls; g'alabada badge 1..4 + kubok + yulduzlar). Qamishlar sway,
// ninachi aylanma-suzadi, suv-halqalar, baliq lip etib sakraydi, quyosh breath, 2 bulut.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { expr: '2 + 3', ans: 5, opts: [2, 3, 4, 5] },
  { expr: '5 − 4', ans: 1, opts: [0, 1, 2, 3] },
  { expr: '1 + 2', ans: 3, opts: [1, 2, 3, 4] },
  { expr: '4 − 2', ans: 2, opts: [0, 1, 2, 3] },
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'mixed_chain' };
const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Musobaqa', title: 'Aralash zanjir',
    setup: 'Qurbaqalar sakrash musobaqasi o\'tkazmoqda! To\'rtta misol — qo\'shish ham, ayirish ham bor.',
    ask: 'Har misol uchun to\'g\'ri javobni tanlang. Belgiga diqqat!',
    correct: 'Barakalla! To\'rtala misol to\'g\'ri — musobaqa g\'olibi sizsiz!',
    hint: 'Qizil qatorlarga qarang: avval belgini aniqlang — qo\'shuvmi, ayiruvmi? Keyin barmoqda sanang.',
    board: 'Sakrash musobaqasi',
  },
  ru: {
    eyebrow: 'У пруда · Соревнование', title: 'Смешанная цепочка',
    setup: 'Лягушки устроили соревнование по прыжкам! Четыре примера — есть и сложение, и вычитание.',
    ask: 'Выбери верный ответ для каждого примера. Внимание на знак!',
    correct: 'Молодец! Все четыре примера верны — победитель соревнования это ты!',
    hint: 'Посмотри на красные строки: сначала определи знак — плюс или минус? Потом посчитай на пальцах.',
    board: 'Соревнование по прыжкам',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza, yashil 2-3 ton (tana #57a84f, qorin #a8d89e, kontur #2e6e28),
// TEPADA ikki bo'rtiq katta ko'z (oq + qorachiq + blik, pirpiratadi), keng tabassum,
// old panjalar oldda, orqa oyoq bukilgan; ostida nilufar bargi.
const Frog = () => (
  <svg viewBox="0 0 64 60" width="52" height="49" aria-hidden="true" style={{ display: 'block' }}>
    {/* tosh — qurbaqa o'tirgan (soya + kulrang tosh + yorug'lik) */}
    <ellipse cx="32" cy="57.5" rx="25" ry="3.6" fill="#3f4a56" opacity=".3" />
    <path d="M8 51.5 Q6.5 46 15 45 L49 45 Q57.5 46 56 51.5 Q55 57 46 57.5 L18 57.5 Q9 57 8 51.5 Z" fill="#8d99a3" stroke="#5f6b75" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="28" cy="48.5" rx="16" ry="3.2" fill="#b6c0c9" opacity=".65" />
    <ellipse cx="45" cy="52" rx="4" ry="1.6" fill="#77828c" opacity=".5" />
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

// NINACHI: kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish traektoriyasi CSS'da.
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

// QAMISH: 2 poya + qo'ng'ir boshoq, pastdan sway; yonida o't-tuflar.
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

// Baliq — lip etib sakrash (dekor, sanalmaydi).
const Fish = () => (
  <svg viewBox="0 0 34 20" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

// G'alaba kuboki (D07_06 kanoni, ixchamroq).
const Trophy = () => (
  <svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M17 13 Q5 14 9 24 Q12 32 21 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M47 13 Q59 14 55 24 Q52 32 43 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 8 H46 V22 a14 14 0 0 1 -28 0 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 12 Q22 24 27 30" stroke="#f8d47a" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".9" />
    <rect x="28" y="36" width="8" height="8" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="20" y="44" width="24" height="6" rx="2" fill="#f2b134" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="15" y="50" width="34" height="7" rx="2.5" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.8" />
    <path d="M32 12.5 L33.6 16 L37.4 16.4 L34.6 18.9 L35.4 22.6 L32 20.7 L28.6 22.6 L29.4 18.9 L26.6 16.4 L30.4 16 Z" fill="#fff" opacity=".9" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Qurbaqalar joyi (sahna px, wrapper top-left).
const FROGS = [
  { x: 20, y: 122 },
  { x: 110, y: 122 },
  { x: 200, y: 122 },
  { x: 290, y: 122 },
];

export default function D09_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda sakrab-kirish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => rowRight(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.expr} = ${r.opts.join('/')}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0906">
      <style>{`
        .pq0906{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0906 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq0906 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq0906 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0906 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0906 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq0906 .pq-scene{position:relative;width:372px;max-width:100%;height:212px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 46%,#d6eef5 60%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq0906 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0906 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0906 .pq-cloud.c1{top:14px;left:-70px;animation-duration:29s;animation-delay:-11s;}
        .pq0906 .pq-cloud.c2{top:38px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-25s;}
        .pq0906 .pq-water{position:absolute;left:0;right:0;bottom:0;height:128px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq0906 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq0906 .pq-shore{position:absolute;bottom:0;width:74px;height:26px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq0906 .pq-shore.l{left:0;border-radius:0 26px 0 0;}
        .pq0906 .pq-shore.r{right:0;border-radius:26px 0 0 0;}
        .pq0906 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0906 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq0906 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:3;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq0906 .pq-board::before,.pq0906 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq0906 .pq-board::before{left:16px;} .pq0906 .pq-board::after{right:16px;}
        .pq0906 .pq-dflyw{position:absolute;left:88px;top:44px;line-height:0;z-index:3;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq0906 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq0906 .pq-dwing.w2{animation-delay:-.08s;} .pq0906 .pq-dwing.w3{animation-delay:-.14s;} .pq0906 .pq-dwing.w4{animation-delay:-.05s;}
        .pq0906 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq0906 .pq-ring.r2{animation-delay:-1.9s;}
        .pq0906 .pq-fishw{position:absolute;right:64px;bottom:40px;line-height:0;z-index:2;opacity:0;animation:pqFish 9.5s ease-in-out infinite;}
        .pq0906 .pq-frog{position:absolute;line-height:0;z-index:2;animation:pqHopIn .8s cubic-bezier(.4,1.2,.6,1) both;animation-delay:var(--hd,0s);filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0906 .pq-scene.still .pq-frog{animation:none;}
        .pq0906 .pq-bobf{display:block;position:relative;animation:pqBobF 2.6s ease-in-out infinite;animation-delay:var(--fd,0s);}
        .pq0906 .pq-bobf.win{animation:pqBobF 2.6s ease-in-out infinite,pqCele .55s ease;}
        .pq0906 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0906 .pq-throat{transform-box:fill-box;transform-origin:50% 55%;animation:pqThroat 1.7s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq0906 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0906 .pq-trophy{position:absolute;top:70px;left:50%;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 6px rgba(201,138,18,.4));animation:pqAns .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0906 .pq-wstar{position:absolute;z-index:4;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq0906 .pq-wstar.w2{animation-delay:-.5s;} .pq0906 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq0906 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;}
        .pq0906 .pq-rw{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center;justify-content:center;padding:5px 9px;border-radius:14px;border:2.5px solid #cfe3da;background:#fff;transition:.15s;}
        .pq0906 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq0906 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq0906 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}
        .pq0906 .pq-ex{min-width:82px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq0906 .pq-op{margin:0 5px;} .pq0906 .pq-op.plus{color:#1a7f43;} .pq0906 .pq-op.minus{color:#c0392b;}
        .pq0906 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq0906 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0906 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq0906 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq0906 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq0906 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq0906 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq0906 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq0906 .pq-sgs{display:flex;align-content:center;flex-basis:100%;gap:5px;margin-left:4px;justify-content:center;}
        .pq0906 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0906 .pq-sg:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq0906 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq0906 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0906 .pq-sg:disabled{cursor:default;}
        .pq0906 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0906 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0906 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(72px,-14px) rotate(6deg);}50%{transform:translate(126px,14px) rotate(-4deg);}75%{transform:translate(52px,30px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(44px,18px) rotate(56deg);}}
        @keyframes pqHopIn{0%{opacity:0;transform:translate(-52px,-4px);}35%{opacity:1;transform:translate(-30px,-28px);}65%{transform:translate(-10px,-6px);}82%{transform:translate(-3px,-12px);}100%{transform:translate(0,0);}}
        @keyframes pqBobF{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-water" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-reedw" style={{ left: 5, bottom: 96 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 5, bottom: 88 }}><Reeds flip /></span>
          <div className="pq-board">{t.board}</div>
          <span className="pq-ring" style={{ left: 66, bottom: 30 }} />
          <span className="pq-ring r2" style={{ left: 248, bottom: 48 }} />
          <span className="pq-fishw"><Fish /></span>
          <span className="pq-dflyw"><Dragonfly /></span>

          {/* 4 kanon-qurbaqa — mount'da birin-ketin sakrab kiradi, keyin bob; g'alabada badge 1..4 */}
          {FROGS.map((p, i) => (
            <span key={i} className="pq-frog" style={{ left: p.x, top: p.y, '--hd': `${i * 0.22}s` }}>
              <span className={'pq-bobf' + (ok ? ' win' : '')} style={{ '--fd': `-${i * 0.65}s`, '--bd': `-${i * 0.9}s` }}>
                <Frog />
                {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
              </span>
            </span>
          ))}

          {ok && (
            <>
              <span className="pq-trophy"><Trophy /></span>
              <span className="pq-wstar" style={{ left: '36%', top: '62px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '61%', top: '76px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '128px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const [a, op, b] = r.expr.split(' ');
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">{a}<b className={'pq-op ' + (op === '+' ? 'plus' : 'minus')}>{op}</b>{b}</div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
