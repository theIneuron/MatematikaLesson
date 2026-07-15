// Dars08 · Amaliyot 10 — YANGI «Ayirishni bajar» (ikki bosqich: bola o'zi uchiradi, keyin qolganini tanlaydi) · 🔴 · tag: perform_subtraction
// Tabloda «7 − 3»; panjarada 7 chumchuq. Xato uchirilsa BARCHA qushlar qaytib qo'nadi (to'liq qayta boshlash), qulf yo'q.
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

const MINUS = '−'; // − (minus sign U+2212)
const DATA = { start: 7, remove: 3, target: 4, options: [3, 4, 5], ptype: 'NEW', level: '🔴', tag: 'perform_subtraction' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Ayirishni bajaring', title: 'Ayirishni bajaring',
    setup: 'Tabloda misol yonmoqda: yetti ayiruv uch. Panjarada yettita chumchuq o\'tiribdi.',
    ask: 'Misol bo\'yicha kerakli sondagi chumchuqni bosib uchiring, keyin nechta qolganini tanlang.',
    correct: 'Barakalla! Yetti ayiruv uch — to\'rt. Ayirishni o\'zingiz bajardingiz!',
    hintFlown: 'Tabloga qarang: nechta chumchuq uchishi kerak edi? Qushlar qaytib qo\'nishdi — qaytadan urinib ko\'ring.',
    hintPick: 'Panjarada qolganlarni sanang.',
    tapHint: 'Chumchuqlarni bosing',
  },
  ru: {
    eyebrow: 'Сельский двор · Выполни вычитание', title: 'Выполни вычитание',
    setup: 'На табло горит пример: семь минус три. На заборе сидят семь воробьёв.',
    ask: 'Нажимая на воробьёв, отпусти в небо столько, сколько нужно по примеру, потом выбери, сколько осталось.',
    correct: 'Молодец! Семь минус три — четыре. Ты сам выполнил вычитание!',
    hintFlown: 'Посмотри на табло: сколько воробьёв должно улететь? Птицы вернулись на забор — попробуй ещё раз.',
    hintPick: 'Посчитай, сколько воробьёв осталось на заборе.',
    tapHint: 'Нажимай на воробьёв',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chumchuq kanoni (D03_04 palitrasi #8a6543/#dcbb8e): yon ko'rinish, blikli pirpiratuvchi ko'z.
const SP = { body: '#8a6543', breast: '#dcbb8e', head: '#7a5a3b', wing: '#5f4327' };
const Sparrow = ({ d }) => (
  <svg viewBox="0 0 64 52" width="40" height="33" className="pq-birdsvg" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.55)}s` }}>
    <path d="M6 22 L23 22 L23 31 L8 30 Z" fill={SP.wing} />
    <path d="M6 22 L14 26 L6 30 Z" fill={SP.body} opacity=".7" />
    <ellipse cx="34" cy="27" rx="16" ry="11" fill={SP.body} />
    <ellipse cx="38" cy="31.5" rx="11.5" ry="7" fill={SP.breast} />
    <circle cx="48" cy="17.5" r="8.6" fill={SP.head} />
    <ellipse cx="50" cy="20" rx="5" ry="3.6" fill={SP.breast} opacity=".85" />
    <polygon points="56,15.5 63.5,18.5 56,21.5" fill="#e8a33d" />
    <circle cx="50.6" cy="15.8" r="2" fill="#1f2430" />
    <circle cx="51.4" cy="15.1" r="0.7" fill="#fff" />
    <g className="pq-blink"><rect x="48" y="13.2" width="5.4" height="5.2" rx="2.4" fill={SP.head} /></g>
    <path className="pq-wing" d="M25 21 Q37 12 47 20 Q42 30 31 31 Q25 27 25 21 Z" fill={SP.wing} />
    <path className="pq-wing" d="M28 22 Q37 17 44 21" stroke={SP.breast} strokeWidth="1.4" fill="none" opacity=".6" />
    <line x1="31" y1="37.5" x2="29" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="38" y1="38" x2="38" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="29" y1="47" x2="25.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="47" x2="34.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Bobo-buvi uychasi: devor + tom + deraza + eshik; tom uchida bayroqcha sway.
const House = () => (
  <svg viewBox="0 0 120 118" width="112" height="110" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="60" y1="24" x2="60" y2="6" stroke="#8a6a3a" strokeWidth="2.6" strokeLinecap="round" />
    <g className="pq-flag"><polygon points="60,7.5 79,12 60,16.5" fill="#d9534b" /></g>
    <path d="M8 58 L60 24 L112 58 Z" fill="#c0644a" stroke="#94452f" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M22 50 L60 27" stroke="#d98a70" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    <rect x="16" y="58" width="88" height="56" fill="#efe0bd" stroke="#c9b183" strokeWidth="2" />
    <path d="M16 76 H104 M16 94 H104" stroke="#ddcba0" strokeWidth="1.6" />
    <rect x="30" y="68" width="24" height="20" rx="2" fill="#cdeaf6" stroke="#8a6a3a" strokeWidth="2.4" />
    <path d="M42 68 V88 M30 78 H54" stroke="#8a6a3a" strokeWidth="1.8" />
    <path d="M33 84 L40 72" stroke="#fff" strokeWidth="2" opacity=".55" strokeLinecap="round" />
    <rect x="68" y="72" width="22" height="42" rx="2" fill="#b0793f" stroke="#7c5730" strokeWidth="2" />
    <path d="M73 76 V110 M79.5 76 V110 M86 76 V110" stroke="#96602c" strokeWidth="1.3" opacity=".7" />
    <circle cx="85" cy="94" r="2" fill="#5d3f22" />
  </svg>
);

// Hovli daraxti (D03_04 uslubi, soddalashtirilgan): tana + uch tonlik toj + mevalar.
const Tree = () => (
  <svg viewBox="0 0 120 130" width="96" height="104" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M58 128 L58 84 Q58 74 48 66 M66 128 L66 82 Q66 72 76 62" stroke="#7c4f24" strokeWidth="11" strokeLinecap="round" fill="none" />
    <circle cx="42" cy="52" r="28" fill="#4f9a48" />
    <circle cx="80" cy="42" r="30" fill="#5cae54" />
    <circle cx="62" cy="66" r="24" fill="#478b41" />
    <circle cx="58" cy="28" r="21" fill="#68bd60" />
    <circle cx="50" cy="22" r="8" fill="#83cf7a" opacity=".8" />
    <circle cx="90" cy="30" r="8" fill="#83cf7a" opacity=".7" />
    <circle cx="38" cy="40" r="4.6" fill="#d94f5c" />
    <circle cx="36.6" cy="38.6" r="1.4" fill="#fff" opacity=".5" />
    <circle cx="86" cy="52" r="4.6" fill="#d94f5c" />
    <circle cx="84.6" cy="50.6" r="1.4" fill="#fff" opacity=".5" />
  </svg>
);

const BIRD_X = [24, 69, 114, 159, 204, 249, 294];
const DIRS = ['L', 'L', 'L', 'R', 'R', 'R', 'R'];

export default function D08_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [flown, setFlown] = useState(() => Array(DATA.start).fill(false));
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [wave, setWave] = useState(0); // xato-flown'dan keyingi qayta-qo'nish to'lqini
  // Review yoki qayta ochilishda uchish-animatsiyasi ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const flownCount = flown.filter(Boolean).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const n = typeof sa.flown === 'number' ? Math.max(0, Math.min(DATA.start, sa.flown)) : 0;
      setFlown(Array.from({ length: DATA.start }, (_, i) => i < n));
      if (sa.value != null) setPicked(sa.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(flownCount > 0 && picked !== null && !checked); }, [flownCount, picked, checked, onReady]);

  const lock = isReview || checked;
  const flyAway = (i) => {
    if (lock || flown[i]) return;
    setFeedback(null);
    setFlown((prev) => { const nf = [...prev]; nf[i] = true; return nf; });
  };

  const check = useCallback(() => {
    if (picked === null || flownCount === 0) return;
    const correct = flownCount === DATA.remove && picked === DATA.target;
    if (correct) {
      setFeedback({ correct: true, msg: t.correct }); setChecked(true); playCorrect?.();
    } else if (flownCount !== DATA.remove) {
      // Noto'g'ri sonda uchirilgan: barcha qushlar qaytib qo'nadi, sahna qayta boshlanadi (qulf yo'q).
      setFeedback({ correct: false, msg: t.hintFlown }); playWrong?.();
      setFlown(Array(DATA.start).fill(false)); setPicked(null); setWave((w) => w + 1);
    } else {
      setFeedback({ correct: false, msg: t.hintPick }); playWrong?.();
    }
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String),
      studentAnswer: { flown: flownCount, value: picked },
      correctAnswer: { flown: DATA.remove, value: DATA.target },
      correct, meta: { ...DATA },
    });
  }, [picked, flownCount, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(360);

  let remN = 0;
  const birds = BIRD_X.map((x, i) => {
    const isFlown = flown[i];
    const badge = ok && !isFlown ? ++remN : null;
    const cls = 'pq-bird' + (DIRS[i] === 'L' ? ' mirror' : '')
      + (isFlown ? (still ? ' gone' : (DIRS[i] === 'L' ? ' flyL' : ' flyR')) : '')
      + (!isFlown && wave > 0 ? ' pq-land' : '')
      + (!isFlown && ok ? ' hop' : '');
    const delay = isFlown ? '0s' : ok ? `${(badge - 1) * 0.14}s` : wave > 0 ? `${i * 0.07}s` : '0s';
    return (
      <button key={`${wave}-${i}`} type="button" className={cls} style={{ left: x, animationDelay: delay }}
        disabled={lock || isFlown} onClick={() => flyAway(i)} aria-label="chumchuq">
        <Sparrow d={i} />
        {badge != null && <b className="pq-cnt" style={{ animationDelay: `${(badge - 1) * 0.12}s` }}>{badge}</b>}
      </button>
    );
  });

  return (
    <div className="pq pq0810" ref={fitRef}>
      <style>{`
        .pq0810{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0810 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a3662e;text-transform:uppercase;}
        .pq0810 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0810 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0810 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0810 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:240px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0810 .pq-fit{position:relative;margin:0 auto;}
        .pq0810 .pq-sun{position:absolute;top:12px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0810 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0810 .pq-cloud.c1{top:20px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0810 .pq-cloud.c2{top:48px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:36s;animation-delay:-26s;}
        .pq0810 .pq-housew{position:absolute;left:6px;bottom:24px;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0810 .pq-flag{transform-box:view-box;transform-origin:60px 8px;animation:pqSway 2.9s ease-in-out infinite alternate;}
        .pq0810 .pq-treew{position:absolute;right:4px;bottom:30px;z-index:0;}
        .pq0810 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:44px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0810 .pq-fence{position:absolute;left:0;right:0;bottom:40px;height:52px;background:repeating-linear-gradient(90deg,#d9b078 0 15px,#c69a5e 15px 20px,transparent 20px 30px);z-index:1;}
        .pq0810 .pq-fence::before{content:'';position:absolute;left:0;right:0;top:0;height:7px;background:#b98a52;border-radius:4px;box-shadow:0 2px 0 rgba(0,0,0,.08);}
        .pq0810 .pq-fence::after{content:'';position:absolute;left:0;right:0;bottom:9px;height:6px;background:#c8995e;border-radius:3px;opacity:.9;}
        .pq0810 .pq-flora{position:absolute;left:0;bottom:2px;z-index:1;}
        .pq0810 .pq-grain{position:absolute;left:50%;transform:translateX(-50%);bottom:7px;z-index:1;}
        .pq0810 .pq-tablo{position:absolute;top:8px;left:12px;display:flex;align-items:center;gap:7px;padding:7px 14px;border-radius:12px;background:#33302b;border:2px solid #57503f;color:#ffd76a;font-size:24px;font-weight:900;font-variant-numeric:tabular-nums;text-shadow:0 0 9px rgba(255,196,64,.85);animation:pqTablo 2.6s ease-in-out infinite;z-index:4;}
        .pq0810 .pq-tablo .m{color:#ffb84d;}
        .pq0810 .pq-bird{position:absolute;bottom:88px;line-height:0;background:none;border:none;padding:2px;cursor:pointer;user-select:none;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));transition:transform .12s;}
        .pq0810 .pq-bird:hover:not(:disabled){transform:scale(1.08);}
        .pq0810 .pq-bird:active:not(:disabled){transform:scale(.94);}
        .pq0810 .pq-bird:disabled{cursor:default;}
        .pq0810 .pq-bird.mirror .pq-birdsvg{transform:scaleX(-1);}
        .pq0810 .pq-bird.gone{opacity:0;pointer-events:none;}
        .pq0810 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;animation-delay:var(--bd,0s);}
        .pq0810 .pq-wing{transform-box:fill-box;transform-origin:30% 18%;}
        .pq0810 .pq-bird.pq-land{animation:pqLand .85s cubic-bezier(.3,1.2,.5,1) both;}
        .pq0810 .pq-bird.pq-land .pq-wing{animation:pqFlap .16s ease-in-out 6 alternate;}
        .pq0810 .pq-bird.flyR{animation:pqFlyR 1.05s ease-in forwards;pointer-events:none;}
        .pq0810 .pq-bird.flyL{animation:pqFlyL 1.05s ease-in forwards;pointer-events:none;}
        .pq0810 .pq-bird.flyR .pq-wing,.pq0810 .pq-bird.flyL .pq-wing{animation:pqFlap .18s ease-in-out infinite alternate;}
        .pq0810 .pq-bird.hop{animation:pqHop .5s ease-in-out infinite alternate;}
        .pq0810 .pq-cnt{position:absolute;top:-12px;left:50%;margin-left:-9.5px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0810 .pq-chip{position:absolute;top:10px;left:57%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 14px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0810 .pq-taphint{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:700;color:#7a6234;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:999px;animation:pqBob 1.8s ease-in-out infinite;z-index:2;white-space:nowrap;}
        .pq0810 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0810 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pq0810 .pq-opt:disabled{opacity:.45;cursor:default;}
        .pq0810 .pq-opt:hover:not(:disabled){border-color:#d9b078;transform:translateY(-2px);}
        .pq0810 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0810 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;opacity:1;}
        .pq0810 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;opacity:1;animation:pqCele .5s ease;}
        .pq0810 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0810 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0810 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSway{from{transform:rotate(5deg);}to{transform:rotate(-6deg);}}
        @keyframes pqTablo{0%,100%{transform:scale(1);box-shadow:0 0 10px rgba(255,196,64,.3);}50%{transform:scale(1.045);box-shadow:0 0 20px rgba(255,196,64,.6);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqFlap{from{transform:rotate(8deg);}to{transform:rotate(-42deg);}}
        @keyframes pqFlyR{0%{opacity:1;transform:translate(0,0) rotate(0);}20%{transform:translate(14px,-22px) rotate(6deg);}100%{opacity:0;transform:translate(150px,-150px) rotate(12deg) scale(.5);}}
        @keyframes pqFlyL{0%{opacity:1;transform:translate(0,0) rotate(0);}20%{transform:translate(-14px,-22px) rotate(-6deg);}100%{opacity:0;transform:translate(-150px,-150px) rotate(-12deg) scale(.5);}}
        @keyframes pqLand{0%{opacity:0;transform:translateY(-72px) scale(.75);}55%{opacity:1;transform:translateY(2px) scale(1);}75%{transform:translateY(-3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqHop{from{transform:translateY(0);}to{transform:translateY(-4px);}}
        @keyframes pqBob{0%,100%{margin-top:0;}50%{margin-top:-3px;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 240 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-housew"><House /></span>
        <span className="pq-treew"><Tree /></span>
        <span className="pq-grass" />
        <span className="pq-fence" />
        <svg className="pq-flora" viewBox="0 0 360 18" width="360" height="18" aria-hidden="true">
          <path d="M16 16 q3 -9 5 -1 M26 17 q3 -10 6 -1 M150 16 q3 -9 5 -1 M332 17 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="60" y1="17" x2="60" y2="8" stroke="#5ea44d" strokeWidth="2" /><circle cx="60" cy="6" r="3.2" fill="#e88bb1" /><circle cx="60" cy="6" r="1.3" fill="#b1487a" /></g>
          <g><line x1="300" y1="17" x2="300" y2="9" stroke="#5ea44d" strokeWidth="2" /><circle cx="300" cy="7" r="3.2" fill="#f2b134" /><circle cx="300" cy="7" r="1.3" fill="#b97c14" /></g>
        </svg>
        <svg className="pq-grain" viewBox="0 0 130 14" width="130" height="14" aria-hidden="true">
          <ellipse cx="10" cy="8" rx="2.6" ry="1.8" fill="#e6b565" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="24" cy="11" rx="2.6" ry="1.8" fill="#e6b565" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="38" cy="7" rx="2.6" ry="1.8" fill="#dfa958" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="54" cy="10" rx="2.6" ry="1.8" fill="#e6b565" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="70" cy="8" rx="2.6" ry="1.8" fill="#dfa958" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="86" cy="11" rx="2.6" ry="1.8" fill="#e6b565" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="102" cy="7" rx="2.6" ry="1.8" fill="#dfa958" stroke="#c98d3f" strokeWidth=".8" />
          <ellipse cx="118" cy="10" rx="2.6" ry="1.8" fill="#e6b565" stroke="#c98d3f" strokeWidth=".8" />
        </svg>

        <div className="pq-tablo" aria-hidden="true"><span>{DATA.start}</span><span className="m">{MINUS}</span><span>{DATA.remove}</span></div>
        {birds}
        {ok && <span className="pq-chip">{`${DATA.start} ${MINUS} ${DATA.remove} = ${DATA.target}`}</span>}
        {flownCount === 0 && !lock && <span className="pq-taphint">{t.tapHint}</span>}
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock || flownCount === 0} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
