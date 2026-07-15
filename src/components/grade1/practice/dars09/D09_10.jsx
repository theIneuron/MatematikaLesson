// Dars09 · Amaliyot 10 — YANGI «Qurbaqani sakrat!» (bola son o'qida qo'shishni O'ZI bajaradi) · 🔴 · tag: perform_jump
// Tabloda «2 + 3»; son o'qida 6 nilufar-tosh (0..5), qurbaqa 2-toshda. Ikki yo'nalish tugmasi bilan
// bola qurbaqani sakratadi (parabolik ark iz qoladi), 5-toshga yetsa to'g'ri. Noto'g'rida qurbaqa
// boshiga qaytadi va arklar tozalanadi (веди-до-верного, qulf yo'q). Javob — qurbaqaning joyi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const START = 2, ADD = 3, TARGET = 5, MAXP = 5;
const DATA = { start: START, add: ADD, target: TARGET, options: [], ptype: 'NEW', level: '🔴', tag: 'perform_jump' };

// Son o'qi geometriyasi (sahna px koordinatalari).
const X0 = 34, GAP = 60, PAD_CY = 168, ARC_Y0 = 148, ARC_APEX = 96, FROG_TOP = 116;
const xAt = (i) => X0 + i * GAP;

const T = {
  uz: {
    eyebrow: "Hovuz bo'yida · Sakrat!", title: "Qurbaqani sakrat",
    setup: "Tabloda misol: ikki qo'shuv uch. Qurbaqa ikki raqamli toshda turibdi.",
    ask: "Tugmalar bilan qurbaqani misol bo'yicha sakrating, so'ng Tekshirish tugmasini bosing.",
    correct: "Barakalla! Ikkidan uch qadam oldinga — besh. Qo'shishni o'q ustida o'zingiz bajardingiz!",
    hint: "Tabloga qarang: ikkidan boshlab NECHA qadam va QAYSI tomonga? Qurbaqa boshiga qaytdi.",
    btnFwd: "Oldinga", btnBack: "Orqaga", tapHint: "Tugmalar bilan sakrating",
  },
  ru: {
    eyebrow: "У пруда · Прыгай!", title: "Заставь лягушку прыгать",
    setup: "На табло пример: два плюс три. Лягушка сидит на камне с числом два.",
    ask: "Кнопками заставь лягушку прыгать по примеру, потом нажми «Проверить».",
    correct: "Молодец! От двух три шага вперёд — пять. Сложение на прямой ты выполнил сам!",
    hint: "Посмотри на табло: сколько шагов и в какую сторону от двух? Лягушка вернулась в начало.",
    btnFwd: "Вперёд", btnBack: "Назад", tapHint: "Прыгай кнопками",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI (D09_06): o'tirgan poza, yashil 2-3 ton (tana #57a84f, qorin #a8d89e, kontur
// #2e6e28), tepada bo'rtiq blikli pirpiratuvchi ko'zlar, keng tabassum. Bu yerda O'ZINING nilufari
// yo'q — u alohida toshlar ustida turadi. Sakraganda orqa oyoqlar cho'ziladi (.pq-legs).
const Frog = () => (
  <svg viewBox="0 0 64 56" width="52" height="45.5" aria-hidden="true" style={{ display: 'block' }}>
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
    <g className="pq-legs">
      <path d="M25 45.5 L25 51 M39 45.5 L39 51" stroke="#3f8a39" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M25 51 L21 53 M25 51 L28.5 53.4 M39 51 L35.5 53.4 M39 51 L43 53" stroke="#2e6e28" strokeWidth="1.7" strokeLinecap="round" />
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

// QAMISH (D09_06): 2 poya + qo'ng'ir boshoq, pastdan sway.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="30" height="55" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
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
  <svg viewBox="0 0 34 20" width="28" height="16.5" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const ArrowL = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="6" y2="12" /><polyline points="12 5 5 12 12 19" /></svg>);
const ArrowR = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="18" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);

export default function D09_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pos, setPos] = useState(START);       // qurbaqa qaysi toshda
  const [arcs, setArcs] = useState([]);         // [{id, from, to}] — sakrash izlari
  const [hopKey, setHopKey] = useState(0);      // sakrash animatsiyasini qayta uchirish
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const arcIdRef = useRef(0);
  // Review yoki qayta ochilishda sakrash animatsiyasi ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const rpos = typeof sa.pos === 'number' ? Math.max(0, Math.min(MAXP, sa.pos)) : TARGET;
      const built = [];
      const step = rpos >= START ? 1 : -1;
      let p = START;
      while (p !== rpos) { built.push({ id: arcIdRef.current++, from: p, to: p + step }); p += step; }
      setPos(rpos); setArcs(built);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); }
      setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(arcs.length > 0 && !checked); }, [arcs, checked, onReady]);

  const lock = isReview || checked;

  const jump = (dir) => {
    if (lock) return;
    const np = pos + dir;
    if (np < 0 || np > MAXP) return;
    setFeedback(null);
    setArcs((a) => [...a, { id: arcIdRef.current++, from: pos, to: np }]);
    setPos(np);
    setHopKey((k) => k + 1);
  };

  const check = useCallback(() => {
    if (isReview || checked || arcs.length === 0) return;
    const correct = pos === TARGET;
    if (correct) {
      setFeedback({ correct: true, msg: t.correct }); setChecked(true); playCorrect?.();
    } else {
      // Noto'g'ri joy: qurbaqa boshiga qaytadi, arklar tozalanadi, sahna qayta boshlanadi (qulf yo'q).
      setFeedback({ correct: false, msg: t.hint }); playWrong?.();
      setPos(START); setArcs([]); setHopKey((k) => k + 1);
    }
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String),
      studentAnswer: { pos, jumps: arcs.length },
      correctAnswer: { pos: TARGET, jumps: ADD },
      correct, meta: { ...DATA },
    });
  }, [pos, arcs, checked, isReview, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const animate = hopKey > 0 && !still;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq0910">
      <style>{`
        .pq0910{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0910 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq0910 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq0910 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0910 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0910 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq0910 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:232px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 42%,#c6e8ef 54%,#a6dae2 100%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq0910 .pq-fit{position:relative;margin:0 auto;}
        .pq0910 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0910 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0910 .pq-cloud.c1{top:16px;left:-70px;animation-duration:31s;animation-delay:-12s;}
        .pq0910 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:39s;animation-delay:-26s;}
        .pq0910 .pq-water{position:absolute;left:0;right:0;bottom:0;height:128px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq0910 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq0910 .pq-shore{position:absolute;bottom:0;width:60px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq0910 .pq-shore.l{left:0;border-radius:0 24px 0 0;}
        .pq0910 .pq-shore.r{right:0;border-radius:24px 0 0 0;}
        .pq0910 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0910 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq0910 .pq-dflyw{position:absolute;left:82px;top:40px;line-height:0;z-index:2;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq0910 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq0910 .pq-dwing.w2{animation-delay:-.08s;} .pq0910 .pq-dwing.w3{animation-delay:-.14s;} .pq0910 .pq-dwing.w4{animation-delay:-.05s;}
        .pq0910 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.9s ease-out infinite;}
        .pq0910 .pq-ring.r2{animation-delay:-2s;}
        .pq0910 .pq-fishw{position:absolute;right:40px;bottom:34px;line-height:0;z-index:2;opacity:0;animation:pqFish 10s ease-in-out infinite;}
        .pq0910 .pq-tablo{position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:9px;padding:6px 18px;border-radius:12px;background:#33302b;border:2px solid #57503f;color:#ffd76a;font-size:25px;font-weight:900;font-variant-numeric:tabular-nums;text-shadow:0 0 9px rgba(255,196,64,.85);animation:pqTablo 2.6s ease-in-out infinite;z-index:6;}
        .pq0910 .pq-tablo .p{color:#7fe07f;}
        .pq0910 .pq-line{position:absolute;left:0;top:0;z-index:3;}
        .pq0910 .pq-pad{transform-box:fill-box;transform-origin:center;animation:pqPadIn .4s ease both;}
        .pq0910 .pq-line.still .pq-pad{animation:none;}
        .pq0910 .pq-padnum{font-family:'Manrope',system-ui,sans-serif;font-weight:900;}
        .pq0910 .pq-padnum.glow{animation:pqNumGlow 1.1s ease-in-out infinite;filter:drop-shadow(0 0 5px #ffe38a);}
        .pq0910 .pq-arc path{fill:none;stroke:#2f7fae;transition:stroke .35s ease;}
        .pq0910 .pq-arc.win path{stroke:#1a7f43;}
        .pq0910 .pq-arc{animation:pqArcIn .35s ease both;}
        .pq0910 .pq-line.still .pq-arc{animation:none;}
        .pq0910 .pq-frogpos{position:absolute;z-index:5;transition:left .5s cubic-bezier(.34,1.05,.5,1);filter:drop-shadow(0 3px 2px rgba(0,0,0,.2));}
        .pq0910 .pq-hop.anim{animation:pqJump .5s ease-in-out;}
        .pq0910 .pq-hop.anim .pq-legs{animation:pqLegs .5s ease;}
        .pq0910 .pq-legs{transform-box:fill-box;transform-origin:50% 0%;}
        .pq0910 .pq-bob{animation:pqBob 2.5s ease-in-out infinite;}
        .pq0910 .pq-bob.win{animation:pqBob 2.5s ease-in-out infinite,pqCele .6s ease;}
        .pq0910 .pq-bob.still{animation:none;}
        .pq0910 .pq-blink{opacity:0;animation:pqBlink 3.9s linear infinite;}
        .pq0910 .pq-throat{transform-box:fill-box;transform-origin:50% 55%;animation:pqThroat 1.8s ease-in-out infinite;}
        .pq0910 .pq-chip{position:absolute;top:46px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:4px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:7;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0910 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq0910 .pq-wstar.w2{animation-delay:-.5s;} .pq0910 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq0910 .pq-taphint{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:700;color:#256b6b;background:rgba(255,255,255,.85);padding:3px 12px;border-radius:999px;animation:pqBob2 1.9s ease-in-out infinite;z-index:4;white-space:nowrap;}
        .pq0910 .pq-ctrls{display:flex;gap:14px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
        .pq0910 .pq-dir{display:inline-flex;align-items:center;gap:9px;min-width:138px;justify-content:center;padding:14px 20px;font-size:18px;font-weight:800;border-radius:16px;border:2.5px solid #cfe3da;background:#fff;color:#2f7d5b;cursor:pointer;transition:transform .12s,border-color .12s,background .12s;}
        .pq0910 .pq-dir:hover:not(:disabled){border-color:#4f9a48;background:#f0faf2;transform:translateY(-2px);}
        .pq0910 .pq-dir:active:not(:disabled){transform:scale(.96);}
        .pq0910 .pq-dir:disabled{opacity:.4;cursor:default;}
        .pq0910 .pq-dir svg{color:#4f9a48;}
        .pq0910 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0910 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0910 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(80px,-12px) rotate(6deg);}50%{transform:translate(150px,16px) rotate(-4deg);}75%{transform:translate(60px,32px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(44px,18px) rotate(56deg);}}
        @keyframes pqTablo{0%,100%{box-shadow:0 0 10px rgba(255,196,64,.25);}50%{box-shadow:0 0 20px rgba(255,196,64,.6);}}
        @keyframes pqPadIn{from{opacity:0;transform:translateY(-8px) scale(.8);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqArcIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pqJump{0%{transform:translateY(0);}50%{transform:translateY(-42px);}100%{transform:translateY(0);}}
        @keyframes pqLegs{0%,100%{transform:scaleY(1) translateY(0);}45%{transform:scaleY(1.5) translateY(4px);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqNumGlow{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqBob2{0%,100%{margin-top:0;}50%{margin-top:-3px;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 232 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-water" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-reedw" style={{ left: 3, bottom: 92 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 3, bottom: 96 }}><Reeds flip /></span>
          <span className="pq-ring" style={{ left: 120, bottom: 26 }} />
          <span className="pq-ring r2" style={{ left: 236, bottom: 40 }} />
          <span className="pq-fishw"><Fish /></span>
          <span className="pq-dflyw"><Dragonfly /></span>

          {/* Son o'qi: 6 nilufar-tosh (0..5) + sakrash arklari — bitta SVG */}
          <svg className={'pq-line' + (still ? ' still' : '')} viewBox="0 0 372 232" width="372" height="232" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const cx = xAt(i);
              return (
                <g key={i} className="pq-pad" style={{ animationDelay: `${i * 0.06}s` }}>
                  <ellipse cx={cx} cy={PAD_CY + 4} rx="27" ry="8" fill="#4a5560" opacity=".35" />
                  <ellipse cx={cx} cy={PAD_CY} rx="26" ry="15" fill="#8d99a3" stroke="#5f6b75" strokeWidth="2" />
                  <ellipse cx={cx - 5} cy={PAD_CY - 4} rx="15" ry="6" fill="#b6c0c9" opacity=".7" />
                  <path d={`M ${cx - 12} ${PAD_CY + 3} q 6 3 12 0 M ${cx + 4} ${PAD_CY - 2} q 4 2 8 1`} stroke="#6f7b85" strokeWidth="1.1" fill="none" opacity=".5" strokeLinecap="round" />
                  <ellipse cx={cx} cy={PAD_CY - 1} rx="13" ry="9.5" fill="#7d909b" stroke="#5a6b74" strokeWidth="1.4" />
                  <ellipse cx={cx} cy={PAD_CY - 3} rx="9" ry="4.5" fill="#a2b2bc" opacity=".7" />
                  <text className={'pq-padnum' + (ok && i === TARGET ? ' glow' : '')} x={cx} y={PAD_CY + 6} textAnchor="middle" fontSize="22" fill="#fff">{i}</text>
                </g>
              );
            })}
            {arcs.map((a) => {
              const x0 = xAt(a.from), x1 = xAt(a.to), midX = (x0 + x1) / 2;
              const d = `M ${x0} ${ARC_Y0} Q ${midX} ${ARC_APEX} ${x1} ${ARC_Y0}`;
              return (
                <g key={a.id} className={'pq-arc' + (ok ? ' win' : '')}>
                  <path d={d} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1 7" />
                  <path d={`M ${x1 - 5} ${ARC_Y0 - 7} L ${x1} ${ARC_Y0} L ${x1 + 5} ${ARC_Y0 - 7}`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
          </svg>

          {/* Qurbaqa — HTML qatlam, toshdan toshga parabolik sakraydi */}
          <div className="pq-frogpos" style={{ left: xAt(pos) - 26, top: FROG_TOP }}>
            <div key={hopKey} className={'pq-hop' + (animate ? ' anim' : '')}>
              <div className={'pq-bob' + (ok ? ' win' : '') + (still ? ' still' : '')}>
                <Frog />
              </div>
            </div>
          </div>

          <div className="pq-tablo" aria-hidden="true"><span>{DATA.start}</span><span className="p">+</span><span>{DATA.add}</span></div>
          {ok && <span className="pq-chip">{`${DATA.start} + ${DATA.add} = ${DATA.target}`}</span>}
          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '38%', top: '66px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '62%', top: '80px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '50%', top: '118px' }}><Star fill="#f2b134" /></span>
            </>
          )}
          {arcs.length === 0 && !lock && <span className="pq-taphint">{t.tapHint}</span>}
        </div>
        </div>

        <div className="pq-ctrls">
          <button type="button" className="pq-dir back" disabled={lock || pos === 0} onClick={() => jump(-1)}>
            <ArrowL /><span>{t.btnBack}</span>
          </button>
          <button type="button" className="pq-dir fwd" disabled={lock || pos === MAXP} onClick={() => jump(1)}>
            <span>{t.btnFwd}</span><ArrowR />
          </button>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
