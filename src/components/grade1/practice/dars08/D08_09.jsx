// Dars08 · Amaliyot 09 — P9 Ikki bosqichli ayirish-masala (9 − 3 − 2 = 4) · 🔴 · tag: word_problem_2step_sub
// Panjarada 9 chumchuq (D03_04 kanoni). Sahna ochilganda avval 3 tasi birin-ketin yuqori-chapga,
// pauzadan keyin yana 2 tasi yuqori-o'ngga uchadi; 4 qoladi. G'alabada badge faqat qolganlarda, chip «9 − 3 − 2 = 4».
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

const DATA = { start: 9, g1: 3, g2: 2, target: 4, options: [3, 4, 5, 6], ptype: 'P9', level: '🔴', tag: 'word_problem_2step_sub' };

// 9 chumchuq panjara ustida. role: 'stay' | 'L' (1-to'lqin, yuqori-chapga) | 'R' (2-to'lqin, yuqori-o'ngga).
// fd — uchish kechikishi (s). Qoluvchilar (0,2,4,7) badge tartibi chapdan-o'ngga 1..4.
const BIRDS = [
  { x: 18,  role: 'stay', mirror: false },
  { x: 54,  role: 'L', fd: 0.9,  mirror: true },
  { x: 90,  role: 'stay', mirror: true },
  { x: 126, role: 'L', fd: 1.35, mirror: true },
  { x: 162, role: 'stay', mirror: false },
  { x: 198, role: 'L', fd: 1.8,  mirror: true },
  { x: 234, role: 'R', fd: 3.4,  mirror: false },
  { x: 270, role: 'stay', mirror: true },
  { x: 306, role: 'R', fd: 3.85, mirror: false },
];
const STAY_NO = {}; { let k = 0; BIRDS.forEach((b, i) => { if (b.role === 'stay') { k += 1; STAY_NO[i] = k; } }); }

const T = {
  uz: {
    eyebrow: "Qishloq hovlisi · Chumchuqlar", title: "Ikki bosqichli masala",
    setup: "Panjarada to'qqizta chumchuq o'tirgan edi. Avval uchtasi, keyin yana ikkitasi uchib ketdi.",
    ask: "Panjarada nechta chumchuq QOLDI?",
    correct: "Barakalla! To'qqizdan uch va yana ikki uchdi — to'rttasi qoldi.",
    hint: "Bosqichma-bosqich ayiring: avval to'qqizdan uchni, keyin chiqqan sondan yana ikkini.",
  },
  ru: {
    eyebrow: "Сельский двор · Воробьи", title: "Задача в два шага",
    setup: "На заборе сидело девять воробьёв. Сначала улетели три, потом ещё два.",
    ask: "Сколько воробьёв ОСТАЛОСЬ на заборе?",
    correct: "Молодец! Из девяти улетели три и ещё два — осталось четыре.",
    hint: "Вычитай по шагам: сначала из девяти три, потом из полученного числа ещё два.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chumchuq — D03_04 kanoni (yon ko'rinish, o'ngga qaragan): tana #8a6543, ko'krak #dcbb8e,
// blikli pirpiratuvchi ko'z, qanot (uchishda qoqadi), dum patlari, oyoqlar. Bitta figura = bitta chumchuq.
const Bird = ({ bd }) => (
  <svg viewBox="0 0 64 52" width="36" height="30" className="pq-birdsvg" aria-hidden="true" style={{ display: 'block', '--bd': bd }}>
    <path d="M6 22 L23 22 L23 31 L8 30 Z" fill="#5f4327" />
    <path d="M6 22 L14 26 L6 30 Z" fill="#8a6543" opacity=".7" />
    <ellipse cx="34" cy="27" rx="16" ry="11" fill="#8a6543" />
    <ellipse cx="38" cy="31.5" rx="11.5" ry="7" fill="#dcbb8e" />
    <circle cx="48" cy="17.5" r="8.6" fill="#7a5a3b" />
    <ellipse cx="50" cy="20" rx="5" ry="3.6" fill="#dcbb8e" opacity=".85" />
    <polygon points="56,15.5 63.5,18.5 56,21.5" fill="#e8a33d" />
    <circle cx="50.6" cy="15.8" r="2" fill="#1f2430" />
    <circle cx="51.4" cy="15.1" r="0.7" fill="#fff" />
    <g className="pq-blink"><rect x="48" y="13.2" width="5.4" height="5" rx="2.4" fill="#7a5a3b" /></g>
    <path className="pq-wing" d="M25 21 Q37 12 47 20 Q42 30 31 31 Q25 27 25 21 Z" fill="#5f4327" />
    <path className="pq-wing" d="M28 22 Q37 17 44 21" stroke="#dcbb8e" strokeWidth="1.4" fill="none" opacity=".6" />
    <line x1="31" y1="37.5" x2="29" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="38" y1="38" x2="38" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="29" y1="47" x2="25.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="47" x2="34.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Bobo-buvi uychasi: devor + tom + krest-romli deraza + eshik; tom uchida tebranadigan bayroqcha.
const House = () => (
  <svg viewBox="0 0 96 104" width="92" height="100" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-flag">
      <line x1="48" y1="18" x2="48" y2="3" stroke="#8a5c2c" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M48 4 L61 7.5 L48 11 Z" fill="#d9534b" />
    </g>
    <rect x="13" y="46" width="70" height="54" rx="3" fill="#f0e3c8" stroke="#cbb07f" strokeWidth="2" />
    <path d="M5 50 L48 18 L91 50 Z" fill="#c1614f" stroke="#a34e3f" strokeWidth="2" strokeLinejoin="round" />
    <rect x="23" y="60" width="20" height="19" rx="2" fill="#cfe4ef" stroke="#8a6a3a" strokeWidth="2.2" />
    <line x1="33" y1="60" x2="33" y2="79" stroke="#8a6a3a" strokeWidth="1.8" />
    <line x1="23" y1="69.5" x2="43" y2="69.5" stroke="#8a6a3a" strokeWidth="1.8" />
    <rect x="55" y="66" width="17" height="34" rx="2" fill="#a9743c" stroke="#8a5c2c" strokeWidth="2" />
    <circle cx="68.5" cy="84" r="1.6" fill="#5c3d1c" />
  </svg>
);

// Qatlamli daraxt (D03_04 kanonining kichik varianti).
const Tree = () => (
  <svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M58 118 L58 74 Q58 64 48 56 M66 118 L66 70 Q66 62 76 54" stroke="#7c4f24" strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="42" cy="46" r="26" fill="#4f9a48" />
    <circle cx="78" cy="38" r="28" fill="#5cae54" />
    <circle cx="60" cy="62" r="24" fill="#478b41" />
    <circle cx="56" cy="24" r="19" fill="#68bd60" />
    <circle cx="48" cy="18" r="8" fill="#83cf7a" opacity=".8" />
    <circle cx="88" cy="28" r="8" fill="#83cf7a" opacity=".7" />
  </svg>
);

// Yog'och panjara: uchli taxtalar + ikki ko'ndalang rels. Chumchuqlar taxta uchlarida o'tiradi.
const Fence = () => (
  <svg viewBox="0 0 360 78" width="360" height="78" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="0" y="28" width="360" height="7" rx="3.5" fill="#c8a568" />
    <rect x="0" y="54" width="360" height="7" rx="3.5" fill="#bd9a58" />
    {Array.from({ length: 15 }).map((_, i) => {
      const x = 2 + i * 24.5;
      return <path key={i} d={`M${x} 17 L${x + 7} 6 L${x + 14} 17 L${x + 14} 78 L${x} 78 Z`} fill={i % 2 ? '#d9b97e' : '#d2b072'} stroke="#b9975c" strokeWidth="1.5" strokeLinejoin="round" />;
    })}
  </svg>
);

export default function D08_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda ketish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0809" ref={fitRef}>
      <style>{`
        .pq0809{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0809 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b0793f;text-transform:uppercase;}
        .pq0809 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0809 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0809 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0809 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:232px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0809 .pq-fit{position:relative;margin:0 auto;}
        .pq0809 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0809 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0809 .pq-cloud.c1{top:18px;left:-70px;animation-duration:28s;animation-delay:-12s;}
        .pq0809 .pq-cloud.c2{top:46px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:36s;animation-delay:-24s;}
        .pq0809 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:46px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0809 .pq-house{position:absolute;left:4px;bottom:36px;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0809 .pq-tree{position:absolute;right:2px;bottom:36px;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0809 .pq-flag{transform-box:fill-box;transform-origin:0% 100%;animation:pqSway 2.6s ease-in-out infinite alternate;}
        .pq0809 .pq-fence{position:absolute;left:0;bottom:24px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0809 .pq-flora{position:absolute;left:0;bottom:2px;z-index:2;}
        .pq0809 .pq-bird{position:absolute;width:36px;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0809 .pq-bird.mirror .pq-birdsvg{transform:scaleX(-1);}
        .pq0809 .pq-bbob{display:block;animation:pqBob 2.1s ease-in-out infinite;}
        .pq0809 .pq-wing{transform-box:fill-box;transform-origin:30% 18%;}
        .pq0809 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0809 .pq-bird.flyL{animation:pqFlyL 1.15s ease-in forwards;}
        .pq0809 .pq-bird.flyR{animation:pqFlyR 1.15s ease-in forwards;}
        .pq0809 .pq-bird.fly .pq-wing{animation:pqFlap .18s ease-in-out infinite alternate;animation-delay:var(--fd,0s);}
        .pq0809 .pq-scene.still .pq-bird.fly{animation:none;opacity:0;pointer-events:none;}
        .pq0809 .pq-scene.still .pq-bird.fly .pq-wing{animation:none;}
        .pq0809 .pq-cnt{position:absolute;top:-12px;left:50%;margin-left:-9.5px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0809 .pq-q{position:absolute;left:50%;top:38px;margin-left:-17px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#3f7fb5;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(63,127,181,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:3;}
        .pq0809 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0809 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0809 .pq-opt{width:66px;height:66px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0809 .pq-opt:hover:not(:disabled){border-color:#d9b97e;transform:translateY(-2px);}
        .pq0809 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0809 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0809 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0809 .pq-opt:disabled{cursor:default;}
        .pq0809 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0809 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0809 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqSway{from{transform:rotate(3deg);}to{transform:rotate(-3deg);}}
        @keyframes pqFlap{from{transform:rotate(8deg);}to{transform:rotate(-42deg);}}
        @keyframes pqFlyL{0%{opacity:1;transform:translate(0,0) rotate(0);}18%{transform:translate(-12px,-22px) rotate(-6deg);}100%{opacity:0;transform:translate(-180px,-150px) rotate(-12deg) scale(.5);}}
        @keyframes pqFlyR{0%{opacity:1;transform:translate(0,0) rotate(0);}18%{transform:translate(12px,-22px) rotate(6deg);}100%{opacity:0;transform:translate(180px,-150px) rotate(12deg) scale(.5);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 232 * scale }}>
      <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-grass" />
        <span className="pq-house"><House /></span>
        <span className="pq-tree"><Tree /></span>
        <span className="pq-fence"><Fence /></span>
        {/* O't-gullar + don-dog' (panjara oldida, sanalmaydi). */}
        <svg className="pq-flora" viewBox="0 0 360 22" width="360" height="22" aria-hidden="true">
          <path d="M14 20 q3 -9 5 -1 M24 21 q3 -10 6 -1 M118 20 q3 -9 5 -1 M336 21 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="48" y1="21" x2="48" y2="12" stroke="#5ea44d" strokeWidth="2" /><circle cx="48" cy="10" r="3.2" fill="#e88bb1" /><circle cx="48" cy="10" r="1.3" fill="#b1487a" /></g>
          <circle cx="152" cy="16" r="1.7" fill="#a2793e" /><circle cx="160" cy="19" r="1.5" fill="#b98a4e" />
          <circle cx="169" cy="15" r="1.6" fill="#a2793e" /><circle cx="178" cy="18" r="1.5" fill="#b98a4e" />
          <circle cx="187" cy="15.5" r="1.7" fill="#a2793e" /><circle cx="196" cy="19" r="1.5" fill="#b98a4e" />
          <circle cx="205" cy="16" r="1.6" fill="#a2793e" />
        </svg>

        {BIRDS.map((b, i) => (
          <span key={i}
            className={'pq-bird' + (b.mirror ? ' mirror' : '') + (b.role === 'L' ? ' fly flyL' : b.role === 'R' ? ' fly flyR' : '')}
            style={b.role === 'stay'
              ? { left: b.x, top: 108 }
              : { left: b.x, top: 108, animationDelay: `${b.fd}s`, '--fd': `${b.fd}s` }}>
            <span className="pq-bbob" style={{ animationDelay: `${-i * 0.55}s` }}><Bird bd={`${-i * 0.45}s`} /></span>
            {ok && b.role === 'stay' && <b className="pq-cnt" style={{ animationDelay: `${(STAY_NO[i] - 1) * 0.12}s` }}>{STAY_NO[i]}</b>}
          </span>
        ))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.start} − {DATA.g1} − {DATA.g2} = {DATA.target}</span>}
      </div>
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
