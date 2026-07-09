// Dars09 · Amaliyot 02 — P10 Son o'qida OLDINGA sakrash (qurbaqa, nilufar-toshlar 0-5) · 🟡 · tag: numline_forward
// Hovuz: 6 tosh qatorda (0-5), qurbaqa 1-toshda; ochilishda 1→2→3 ikki sakrash (punktir ark qoladi),
// 3-tosh raqami «?» bilan yopiq. G'alabada «?»→3, chip «1 + 2 = 3», ark cho'qqilarida 1..2 sanoq-badge.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { start: 1, jump: 2, target: 3, options: [2, 3, 4], ptype: 'P10', level: '🟡', tag: 'numline_forward' };
// Toshlar markazi (sahna px, 380 kenglik) — indeks = tosh raqami 0..5.
const XS = [35, 95, 155, 215, 275, 335];
const STONE_TOP = 172; // tosh-svg top
const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Son o\'qi', title: 'Oldinga sakrash',
    setup: 'Qurbaqa bir raqamli toshda turgan edi. U OLDINGA ikki marta sakradi!',
    ask: 'Qurbaqa qaysi raqamli toshga yetib keldi?',
    correct: 'Barakalla! Birdan ikki qadam oldinga — uch. Qo\'shganda oldinga sakraymiz!',
    hint: 'Toshlarni sanang: birdan boshlab oldinga ikki qadam.',
  },
  ru: {
    eyebrow: 'У пруда · Числовая дорожка', title: 'Прыжок вперёд',
    setup: 'Лягушка сидела на камне с цифрой один. Она прыгнула ВПЕРЁД два раза!',
    ask: 'На камень с какой цифрой прискакала лягушка?',
    correct: 'Молодец! От одного два шага вперёд — три. Когда прибавляем — прыгаем вперёд!',
    hint: 'Посчитай камни: от одного два шага вперёд.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza — tana #57a84f, qorin #a8d89e, kontur #2e6e28; tepada ikki
// bo'rtiq katta ko'z (pirpiraydi), keng tabassum, old panjalar oldda, orqa oyoq bukilgan.
// Sakrash pozasi (.hop): bukilgan oyoqlar yashirilib, cho'zilgan oyoqlar ko'rinadi.
const Frog = () => (
  <svg viewBox="0 0 64 56" width="58" height="51" aria-hidden="true" style={{ display: 'block' }}>
    {/* orqa oyoq — bukilgan (o'tirish) */}
    <g className="pq-legF">
      <ellipse cx="13.5" cy="38" rx="8" ry="10" fill="#4a9a44" stroke="#2e6e28" strokeWidth="1.6" />
      <ellipse cx="50.5" cy="38" rx="8" ry="10" fill="#4a9a44" stroke="#2e6e28" strokeWidth="1.6" />
    </g>
    {/* sakrash — oyoqlar cho'zilgan (orqada qoladi) */}
    <g className="pq-legS" stroke="#3c8a36" strokeLinecap="round" fill="none">
      <path d="M17 41 Q8 47 3 53" strokeWidth="3.6" />
      <path d="M23 45 Q16 51 12 55" strokeWidth="3.4" />
      <path d="M3 53 L1 50 M3 53 L5.6 55 M12 55 L9.6 52.6 M12 55 L15 55.4" strokeWidth="2.2" />
      <path d="M41 44 Q47 48 51 52" strokeWidth="3.4" />
      <path d="M51 52 L53.8 50.6 M51 52 L52.6 55" strokeWidth="2.2" />
    </g>
    <ellipse cx="32" cy="33" rx="17.5" ry="15.5" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.8" />
    <ellipse cx="32" cy="39.5" rx="11.5" ry="8" fill="#a8d89e" />
    {/* tomoq — puls (g'alabada tezlashadi: qurr-qurr) */}
    <ellipse className="pq-thr" cx="32" cy="34.5" rx="6.5" ry="4.2" fill="#a8d89e" stroke="#6fae67" strokeWidth="1" />
    {/* ikki bo'rtiq ko'z tepada */}
    <circle cx="23" cy="13" r="8" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.8" />
    <circle cx="41" cy="13" r="8" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.8" />
    <circle cx="23" cy="12.6" r="5.2" fill="#fff" />
    <circle cx="41" cy="12.6" r="5.2" fill="#fff" />
    <circle cx="24" cy="13" r="2.5" fill="#1f2430" />
    <circle cx="42" cy="13" r="2.5" fill="#1f2430" />
    <circle cx="25" cy="11.6" r="0.9" fill="#fff" />
    <circle cx="43" cy="11.6" r="0.9" fill="#fff" />
    <g className="pq-blink">
      <circle cx="23" cy="12.6" r="5.5" fill="#57a84f" />
      <circle cx="41" cy="12.6" r="5.5" fill="#57a84f" />
    </g>
    {/* burun teshiklari + keng tabassum */}
    <circle cx="29.4" cy="21.5" r="0.9" fill="#2e6e28" />
    <circle cx="34.6" cy="21.5" r="0.9" fill="#2e6e28" />
    <path d="M21 26.5 Q32 34 43 26.5" stroke="#2e6e28" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* old panjalar oldda (o'tirish) */}
    <g className="pq-legF" stroke="#3c8a36" strokeLinecap="round" fill="none">
      <path d="M24 46 L24 51" strokeWidth="3.4" />
      <path d="M40 46 L40 51" strokeWidth="3.4" />
      <path d="M24 51 L20.8 53 M24 51 L24.2 53.6 M24 51 L27 53" strokeWidth="2.2" />
      <path d="M40 51 L36.8 53 M40 51 L40.2 53.6 M40 51 L43 53" strokeWidth="2.2" />
      <path d="M9 46 q3.4 2.4 7 1 M48 47 q3.6 1.4 7 -1" strokeWidth="2.4" />
    </g>
  </svg>
);

// SON O'QI KANONI: kulrang tosh (2-ton + kontur), ustida katta oq raqam.
// hidden=true (3-tosh): raqam «?» bilan yopiq, g'alabada pop bilan ochiladi.
const Stone = ({ n, hidden, ok }) => (
  <svg viewBox="0 0 56 34" width="56" height="34" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="28" cy="18" rx="26" ry="13" fill="#8d99a3" stroke="#5f6b75" strokeWidth="2" />
    <ellipse cx="28" cy="14.5" rx="21" ry="8.5" fill="#aab6c0" opacity=".9" />
    <ellipse cx="28" cy="19" rx="14" ry="8" fill="#77828c" opacity=".55" />
    <circle cx="12" cy="14" r="1.3" fill="#77828c" opacity=".8" />
    <circle cx="45" cy="16" r="1.1" fill="#77828c" opacity=".8" />
    {hidden && !ok
      ? <text className="pq-qm" x="28" y="24.5" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff">?</text>
      : <text className={hidden && ok ? 'pq-rev' : undefined} x="28" y="24.5" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">{n}</text>}
  </svg>
);

// NINACHI: kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish traektoriyasi.
const Dragonfly = () => (
  <svg viewBox="0 0 40 22" width="40" height="22" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-wing">
      <ellipse cx="16" cy="5" rx="7" ry="3" fill="rgba(255,255,255,.65)" stroke="rgba(130,170,210,.6)" strokeWidth="0.8" transform="rotate(-18 16 5)" />
      <ellipse cx="24" cy="5" rx="7" ry="3" fill="rgba(255,255,255,.65)" stroke="rgba(130,170,210,.6)" strokeWidth="0.8" transform="rotate(18 24 5)" />
    </g>
    <g className="pq-wing pq-w2">
      <ellipse cx="15" cy="13" rx="6" ry="2.6" fill="rgba(255,255,255,.55)" stroke="rgba(130,170,210,.5)" strokeWidth="0.8" transform="rotate(16 15 13)" />
      <ellipse cx="25" cy="13" rx="6" ry="2.6" fill="rgba(255,255,255,.55)" stroke="rgba(130,170,210,.5)" strokeWidth="0.8" transform="rotate(-16 25 13)" />
    </g>
    <line x1="6" y1="10" x2="30" y2="9.4" stroke="#4c86c6" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="32.5" cy="9" r="3" fill="#2e5f96" />
    <circle cx="33.6" cy="8.2" r="0.8" fill="#fff" opacity=".8" />
  </svg>
);

// Qamishlar (sway) — suv chetida 3 dona, brown boshli.
const Reeds = () => (
  <svg viewBox="0 0 46 84" width="46" height="84" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-reed">
      <line x1="10" y1="84" x2="10" y2="24" stroke="#3f7d39" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="7" y="9" width="6" height="17" rx="3" fill="#8a5a2b" />
      <line x1="10" y1="9" x2="10" y2="3" stroke="#3f7d39" strokeWidth="1.6" strokeLinecap="round" />
    </g>
    <g className="pq-reed pq-r2">
      <line x1="25" y1="84" x2="25" y2="38" stroke="#4c8c45" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="22.4" y="24" width="5.4" height="15" rx="2.7" fill="#96652f" />
      <line x1="25" y1="24" x2="25" y2="19" stroke="#4c8c45" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <g className="pq-reed pq-r3">
      <line x1="38" y1="84" x2="38" y2="50" stroke="#3f7d39" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M38 50 q-6 -8 -2 -14" stroke="#3f7d39" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

export default function D09_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash-animatsiya qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  // Sakrash bosqichi: 0=1-toshda o'tiribdi, 1=2-toshga sakramoqda, 2=2-toshda, 3=3-toshga sakramoqda, 4=3-toshda.
  const [stage, setStage] = useState(still ? 4 : 0);

  useEffect(() => {
    if (still) return;
    const ts = [
      setTimeout(() => setStage(1), 700),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2150),
      setTimeout(() => setStage(4), 2950),
    ];
    return () => ts.forEach(clearTimeout);
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
  const frogStone = stage === 0 ? 1 : stage <= 2 ? 2 : 3;
  const hop = stage === 1 || stage === 3;

  return (
    <div className="pq pq0902">
      <style>{`
        .pq0902{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0902 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2c8aa0;text-transform:uppercase;}
        .pq0902 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0902 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0902 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0902 .pq-scene{position:relative;width:380px;height:232px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f7fb 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0902 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0902 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0902 .pq-cloud.c1{top:16px;left:-70px;animation-duration:32s;animation-delay:-13s;}
        .pq0902 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:44s;animation-delay:-30s;}
        .pq0902 .pq-water{position:absolute;left:0;right:0;bottom:0;height:142px;background:linear-gradient(#9fdbe0 0%,#6cc0c9 36%,#4aa5b6 100%);z-index:0;}
        .pq0902 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.55);border-radius:2px;}
        .pq0902 .pq-rip{position:absolute;width:64px;height:16px;border:2px solid rgba(255,255,255,.6);border-radius:50%;z-index:1;animation:pqRip 3.8s ease-out infinite;}
        .pq0902 .pq-reedsw{position:absolute;left:4px;bottom:2px;z-index:2;}
        .pq0902 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqReed 3.6s ease-in-out infinite alternate;}
        .pq0902 .pq-reed.pq-r2{animation-delay:-1.4s;} .pq0902 .pq-reed.pq-r3{animation-delay:-2.5s;}
        .pq0902 .pq-shore{position:absolute;top:78px;z-index:1;}
        .pq0902 .pq-dflyw{position:absolute;left:206px;top:24px;z-index:5;animation:pqDfly 11s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq0902 .pq-wing{transform-box:fill-box;transform-origin:center;animation:pqFlut .16s linear infinite alternate;}
        .pq0902 .pq-wing.pq-w2{animation-delay:-.08s;}
        .pq0902 .pq-stone{position:absolute;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0902 .pq-qm{transform-box:fill-box;transform-origin:center;animation:pqQm 1.7s ease-in-out infinite;}
        .pq0902 .pq-rev{transform-box:fill-box;transform-origin:center;animation:pqPopT .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0902 .pq-arcs{position:absolute;inset:0;z-index:3;pointer-events:none;}
        .pq0902 .pq-arc{animation:pqArcIn .45s ease both;}
        .pq0902 .pq-scene.still .pq-arc{animation:none;}
        .pq0902 .pq-frogw{position:absolute;z-index:4;transition:left .72s cubic-bezier(.45,.05,.55,.95);filter:drop-shadow(0 3px 3px rgba(0,0,0,.2));}
        .pq0902 .pq-scene.still .pq-frogw{transition:none;}
        .pq0902 .pq-frogw.hop{animation:pqHop .72s both;}
        .pq0902 .pq-frogw.winf{animation:pqCele .55s ease;}
        .pq0902 .pq-legS{display:none;}
        .pq0902 .pq-frogw.hop .pq-legS{display:block;}
        .pq0902 .pq-frogw.hop .pq-legF{display:none;}
        .pq0902 .pq-thr{transform-box:fill-box;transform-origin:center;animation:pqThr 2.1s ease-in-out infinite;}
        .pq0902 .pq-frogw.winf .pq-thr{animation-duration:.45s;}
        .pq0902 .pq-blink{opacity:0;animation:pqBlink 3.9s linear infinite;animation-delay:-1.1s;}
        .pq0902 .pq-cnt{position:absolute;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq0902 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0902 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0902 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0902 .pq-opt:hover:not(:disabled){border-color:#a8d4dd;transform:translateY(-2px);}
        .pq0902 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0902 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0902 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0902 .pq-opt:disabled{cursor:default;}
        .pq0902 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0902 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0902 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(480px);}}
        @keyframes pqRip{0%{transform:scale(.25);opacity:.75;}70%{opacity:.25;}100%{transform:scale(1.55);opacity:0;}}
        @keyframes pqReed{from{transform:rotate(-2.5deg);}to{transform:rotate(2.5deg);}}
        @keyframes pqDfly{0%{transform:translate(0,0);}25%{transform:translate(66px,16px);}50%{transform:translate(118px,-4px);}75%{transform:translate(50px,-16px);}100%{transform:translate(0,0);}}
        @keyframes pqFlut{from{transform:scaleY(1);}to{transform:scaleY(.5);}}
        @keyframes pqQm{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.18);opacity:.85;}}
        @keyframes pqPopT{0%{opacity:0;transform:scale(.2);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqArcIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pqHop{0%{transform:translateY(0) rotate(-4deg);animation-timing-function:ease-out;}50%{transform:translateY(-46px) rotate(-10deg);animation-timing-function:ease-in;}88%{transform:translateY(2px) rotate(3deg);}100%{transform:translateY(0) rotate(0deg);}}
        @keyframes pqThr{0%,100%{transform:scale(1);}50%{transform:scale(1.28);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
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
        {/* suv-halqalar — kengayib so'nadi */}
        <span className="pq-rip" style={{ left: 44, top: 196 }} />
        <span className="pq-rip" style={{ left: 288, top: 206, animationDelay: '-1.9s' }} />
        {/* qirg'oq-o't chetlarda */}
        <svg className="pq-shore" style={{ left: 2 }} viewBox="0 0 54 16" width="54" height="16" aria-hidden="true">
          <path d="M4 15 q3 -10 5 -1 M12 16 q3 -11 6 -1 M22 15 q3 -9 5 -1 M32 16 q3 -10 6 -1 M44 15 q3 -9 5 -1" stroke="#5ea44d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
        <svg className="pq-shore" style={{ right: 2 }} viewBox="0 0 54 16" width="54" height="16" aria-hidden="true">
          <path d="M5 16 q3 -10 6 -1 M15 15 q3 -9 5 -1 M25 16 q3 -11 6 -1 M37 15 q3 -9 5 -1 M46 16 q3 -10 6 -1" stroke="#6db35c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
        <span className="pq-reedsw"><Reeds /></span>
        <span className="pq-dflyw"><Dragonfly /></span>

        {/* Son o'qi: toshlar 0-5, 3-tosh raqami «?» bilan yopiq */}
        {XS.map((x, i) => (
          <span key={i} className="pq-stone" style={{ left: x - 28, top: STONE_TOP }}>
            <Stone n={i} hidden={i === DATA.target} ok={!!ok} />
          </span>
        ))}

        {/* Sakrash arklari — punktir egri, uchida strelka; chizilgach qoladi */}
        <svg className="pq-arcs" viewBox="0 0 380 232" width="380" height="232" aria-hidden="true">
          {stage >= 1 && (
            <g className="pq-arc">
              <path d="M95 164 Q125 106 155 164" stroke="#f6fbff" strokeWidth="3" strokeDasharray="0.5 8" strokeLinecap="round" fill="none" />
              <polygon points="155,164 156.5,154 147.5,158" fill="#f6fbff" />
            </g>
          )}
          {stage >= 3 && (
            <g className="pq-arc">
              <path d="M155 164 Q185 106 215 164" stroke="#f6fbff" strokeWidth="3" strokeDasharray="0.5 8" strokeLinecap="round" fill="none" />
              <polygon points="215,164 216.5,154 207.5,158" fill="#f6fbff" />
            </g>
          )}
        </svg>

        {/* Qurbaqa — 1-toshdan ikki parabolik sakrash bilan 3-toshga */}
        <span className={'pq-frogw' + (hop ? ' hop' : '') + (ok ? ' winf' : '')} style={{ left: XS[frogStone] - 29, top: 134 }}>
          <Frog />
        </span>

        {/* G'alabada: qadamlar sanog'i ark cho'qqilarida (1..2) + chip */}
        {ok && <b className="pq-cnt" style={{ left: 115, top: 94 }}>1</b>}
        {ok && <b className="pq-cnt" style={{ left: 175, top: 94, animationDelay: '.14s' }}>2</b>}
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
