// Dars08 · Amaliyot 04 — P8 Rasmga mos yozuvni tanlash (ayirish) · 🟡 · tag: pick_expression_sub
// To'nkada 5 ta sabzi; kanon-quyon (D04_01) sakrab kirib 2 tasini chetga olib ketadi — 3 qoladi. «5 − 2» tanlanadi.
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

const EXPRS = ['5 − 2', '5 + 2', '5 − 3'];
const CORRECT_EXPR = '5 − 2';
const DATA = { start: 5, gone: 2, ptype: 'P8', level: '🟡', tag: 'pick_expression_sub' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Quyon', title: 'Yozuvni tanla',
    setup: "To'nkada beshta sabzi bor edi. Quyoncha kelib ikkitasini olib ketdi!",
    ask: 'Rasmga qaysi yozuv mos keladi?',
    correct: 'Barakalla! Besh ayiruv ikki — shu rasmning yozuvi.',
    hint: "Nechta bor edi? Nechtasi olib ketildi? Yozuvdagi sonlar shunga mos bo'lsin.",
  },
  ru: {
    eyebrow: 'Деревенский двор · Кролик', title: 'Выбери запись',
    setup: 'На пеньке лежало пять морковок. Прибежал кролик и унёс две!',
    ask: 'Какая запись подходит к картинке?',
    correct: 'Молодец! Пять минус два — вот запись к этой картинке.',
    hint: 'Сколько морковок было? Сколько унесли? Числа в записи должны совпадать с картинкой.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Kanon-quyon (D04_01 mini-quyon uslubi): oq-kulrang 2-3 ton, pushti ichlikli uzun
// quloqlar, dumcha-pufak, blikli pirpiratuvchi ko'zlar, mo'ylov chiziqlari.
const Rabbit = ({ w = 44 }) => (
  <svg viewBox="0 0 52 58" width={w} height={Math.round(w * 58 / 52)} aria-hidden="true" style={{ display: 'block', '--bd': '-1.2s' }}>
    <g transform="rotate(-8 20 12)">
      <ellipse cx="20" cy="12" rx="4.6" ry="11" fill="#d8cec2" stroke="#a89a8a" strokeWidth="1.4" />
      <ellipse cx="20" cy="13" rx="2.2" ry="7.4" fill="#f2c3cd" />
    </g>
    <g transform="rotate(8 31 12)">
      <ellipse cx="31" cy="12" rx="4.6" ry="11" fill="#d8cec2" stroke="#a89a8a" strokeWidth="1.4" />
      <ellipse cx="31" cy="13" rx="2.2" ry="7.4" fill="#f2c3cd" />
    </g>
    <circle cx="40" cy="47" r="4" fill="#f7f2ea" stroke="#a89a8a" strokeWidth="1.2" />
    <ellipse cx="25" cy="42" rx="15" ry="13" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.6" />
    <ellipse cx="24" cy="45" rx="8" ry="7" fill="#f7f2ea" />
    <circle cx="25" cy="25.5" r="11" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.6" />
    <circle cx="21" cy="23.6" r="1.8" fill="#1f2430" /><circle cx="21.6" cy="23" r="0.65" fill="#fff" />
    <circle cx="29" cy="23.6" r="1.8" fill="#1f2430" /><circle cx="29.6" cy="23" r="0.65" fill="#fff" />
    <g className="pq-blink">
      <rect x="18.9" y="21.7" width="4.2" height="3.6" rx="1.6" fill="#e9e0d4" />
      <rect x="26.9" y="21.7" width="4.2" height="3.6" rx="1.6" fill="#e9e0d4" />
    </g>
    <path d="M23.7 27.6 h2.6 l-1.3 1.9 Z" fill="#e58ba0" />
    <path d="M25 29.7 q0 2.1 -2.1 2.5 M25 29.7 q0 2.1 2.1 2.5" stroke="#a89a8a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d="M14 27 h4.6 M14.4 29.8 h4.2 M31.4 27 h4.6 M31.4 29.8 h4.2" stroke="#bcb0a1" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="17" cy="53.4" rx="5" ry="2.6" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.2" />
    <ellipse cx="31" cy="53.4" rx="5" ry="2.6" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.2" />
  </svg>
);

// Bobo-buvi uychasi: taxta-devor + qizg'ish tom + krest romli deraza + eshik.
const House = () => (
  <svg viewBox="0 0 96 92" width="88" height="84" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="12" y="36" width="72" height="52" rx="2" fill="#f2e6cf" stroke="#c8ab7e" strokeWidth="1.6" />
    <path d="M12 50 h72 M12 64 h72 M12 78 h72" stroke="#e0cda8" strokeWidth="1.2" />
    <polygon points="4,38 48,6 92,38" fill="#c96a52" stroke="#a34d3c" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M16 33 L48 11 L80 33" stroke="#e08a70" strokeWidth="2" fill="none" opacity=".7" />
    <rect x="28" y="46" width="24" height="20" rx="2" fill="#cfeaf7" stroke="#8a6a44" strokeWidth="2" />
    <path d="M40 46 v20 M28 56 h24" stroke="#8a6a44" strokeWidth="1.6" />
    <rect x="60" y="58" width="15" height="30" rx="2" fill="#9a6a3c" stroke="#7c5227" strokeWidth="1.5" />
    <circle cx="63.5" cy="73" r="1.4" fill="#5f3a17" />
  </svg>
);

// Hovli daraxti (D03_04 kanonining ixcham varianti): po'stloqli tana + 3 ton barg-toj + mevalar.
const Tree = () => (
  <svg viewBox="0 0 110 128" width="94" height="110" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M52 124 L52 84 Q52 74 44 66 M60 124 L60 82 Q60 74 68 64" stroke="#7c4f24" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M55 118 L55 90" stroke="#5f3a17" strokeWidth="1.8" strokeLinecap="round" opacity=".5" />
    <circle cx="38" cy="54" r="26" fill="#4f9a48" />
    <circle cx="72" cy="46" r="27" fill="#5cae54" />
    <circle cx="54" cy="30" r="21" fill="#68bd60" />
    <circle cx="48" cy="24" r="8" fill="#83cf7a" opacity=".8" />
    <circle cx="80" cy="36" r="8" fill="#83cf7a" opacity=".7" />
    <circle cx="42" cy="46" r="4.6" fill="#d94f5c" /><circle cx="40.8" cy="44.6" r="1.4" fill="#fff" opacity=".5" />
    <circle cx="72" cy="60" r="4.6" fill="#d94f5c" /><circle cx="70.8" cy="58.6" r="1.4" fill="#fff" opacity=".5" />
  </svg>
);

// To'nka: yillik halqali kesim-yuza + po'stloq chiziqli tana.
const Stump = () => (
  <svg viewBox="0 0 124 92" width="124" height="92" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 20 V70 Q6 84 24 86 H100 Q118 84 118 70 V20 Z" fill="#a5793f" stroke="#7c5227" strokeWidth="2" />
    <path d="M24 34 V80 M46 36 V84 M78 36 V84 M100 34 V80" stroke="#8a6230" strokeWidth="2.4" opacity=".65" strokeLinecap="round" />
    <ellipse cx="62" cy="20" rx="56" ry="15" fill="#dcb984" stroke="#7c5227" strokeWidth="2" />
    <ellipse cx="62" cy="20" rx="40" ry="10" fill="none" stroke="#c09a5e" strokeWidth="1.6" />
    <ellipse cx="62" cy="20" rx="25" ry="6.2" fill="none" stroke="#c09a5e" strokeWidth="1.4" />
    <ellipse cx="62" cy="20" rx="11" ry="3" fill="none" stroke="#b98d54" strokeWidth="1.3" />
    <circle cx="62" cy="20" r="1.6" fill="#a5793f" />
  </svg>
);

// To'nkada qoladigan 3 sabzi (sanaladigan obyektlar — statik, badge g'alabada 1..3).
const STAY = [
  { x: 128, y: 114, r: -12 },
  { x: 150, y: 116, r: 7 },
  { x: 172, y: 113, r: -4 },
];

export default function D08_04(props) {
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
    const correct = picked === CORRECT_EXPR;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: EXPRS.slice(), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT_EXPR }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0804" ref={fitRef}>
      <style>{`
        .pq0804{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0804 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a9440;text-transform:uppercase;}
        .pq0804 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0804 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0804 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0804 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:232px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0804 .pq-fit{position:relative;margin:0 auto;}
        .pq0804 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0804 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0804 .pq-cloud.c1{top:16px;left:-70px;animation-duration:28s;animation-delay:-12s;}
        .pq0804 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:36s;animation-delay:-24s;}
        .pq0804 .pq-fence{position:absolute;left:0;right:0;bottom:56px;height:34px;background:repeating-linear-gradient(90deg,#e9dcc0 0 9px,#dbc9a3 9px 13px,transparent 13px 24px);opacity:.85;z-index:0;}
        .pq0804 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#d3bf96;border-radius:3px;}
        .pq0804 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0804 .pq-house{position:absolute;left:6px;bottom:54px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0804 .pq-tree{position:absolute;right:-4px;bottom:50px;z-index:1;opacity:.97;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0804 .pq-flora{position:absolute;left:0;bottom:2px;z-index:1;}
        .pq0804 .pq-stumpw{position:absolute;left:120px;bottom:26px;z-index:2;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq0804 .pq-stumpw.win{animation:pqCele .5s ease;}
        .pq0804 .pq-car{position:absolute;font-size:22px;line-height:1;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0804 .pq-cnt{position:absolute;top:-11px;right:-7px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0804 .pq-take.a{left:258px;top:190px;animation:pqTakeA .85s cubic-bezier(.35,.8,.45,1) 2.8s both;}
        .pq0804 .pq-take.b{left:282px;top:194px;animation:pqTakeB .85s cubic-bezier(.35,.8,.45,1) 2.92s both;}
        .pq0804 .pq-scene.still .pq-take.a{animation:none;transform:rotate(36deg);}
        .pq0804 .pq-scene.still .pq-take.b{animation:none;transform:rotate(62deg);}
        .pq0804 .pq-rgo{position:absolute;left:304px;bottom:26px;z-index:4;animation:pqRGo 5.4s linear both;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0804 .pq-hopY{animation:pqHopY 5.4s linear both;transform-origin:50% 100%;}
        .pq0804 .pq-rbr{animation:pqBreath 3.4s ease-in-out infinite;}
        .pq0804 .pq-scene.still .pq-rgo{animation:none;}
        .pq0804 .pq-scene.still .pq-hopY{animation:none;}
        .pq0804 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0804 .pq-q{position:absolute;left:160px;top:52px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfe0c6;color:#5a9440;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(90,148,64,.22);animation:pqQ 2.2s ease-in-out infinite;z-index:5;}
        .pq0804 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0804 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .pq0804 .pq-opt{min-width:96px;height:70px;padding:0 14px;font-size:26px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;white-space:nowrap;}
        .pq0804 .pq-opt:hover:not(:disabled){border-color:#b9d6a8;transform:translateY(-2px);}
        .pq0804 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0804 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0804 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0804 .pq-opt:disabled{cursor:default;}
        .pq0804 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0804 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0804 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqRGo{
          0%{transform:translateX(70px);}6%{transform:translateX(51px);}12%{transform:translateX(33px);}
          19%{transform:translateX(14px);}25%{transform:translateX(-4px);}31%{transform:translateX(-24px);}
          37%{transform:translateX(-42px);}43%{transform:translateX(-61px);}49%{transform:translateX(-80px);}
          63%{transform:translateX(-80px);}69%{transform:translateX(-67px);}75%{transform:translateX(-53px);}
          81%{transform:translateX(-40px);}87%{transform:translateX(-27px);}93%{transform:translateX(-13px);}100%{transform:translateX(0);}
        }
        @keyframes pqHopY{
          0%{transform:translateY(0) scaleX(1.06) scaleY(.94);}6%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}
          12%{transform:translateY(0) scaleX(1.06) scaleY(.94);}19%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}
          25%{transform:translateY(0) scaleX(1.06) scaleY(.94);}31%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}
          37%{transform:translateY(0) scaleX(1.06) scaleY(.94);}43%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}
          49%{transform:translateY(0) scaleX(1.06) scaleY(.94);}57%{transform:translateY(0) scaleX(1) scaleY(1);}
          63%{transform:translateY(0) scaleX(1.06) scaleY(.94);}69%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}
          75%{transform:translateY(0) scaleX(1.06) scaleY(.94);}81%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}
          87%{transform:translateY(0) scaleX(1.06) scaleY(.94);}93%{transform:translateY(-15px) scaleX(.95) scaleY(1.06);}100%{transform:translateY(0) scaleX(1) scaleY(1);}
        }
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.025);}}
        @keyframes pqTakeA{0%{transform:translate(-64px,-74px) rotate(-8deg);}55%{transform:translate(-30px,-98px) rotate(18deg);}100%{transform:translate(0,0) rotate(36deg);}}
        @keyframes pqTakeB{0%{transform:translate(-66px,-78px) rotate(5deg);}55%{transform:translate(-32px,-102px) rotate(32deg);}100%{transform:translate(0,0) rotate(62deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
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
        <span className="pq-fence" /><span className="pq-grass" />
        <span className="pq-house"><House /></span>
        <span className="pq-tree"><Tree /></span>
        <svg className="pq-flora" viewBox="0 0 360 18" width="360" height="18" aria-hidden="true">
          <path d="M14 16 q3 -9 5 -1 M104 17 q3 -10 6 -1 M250 16 q3 -9 5 -1 M338 17 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="70" y1="17" x2="70" y2="8" stroke="#5ea44d" strokeWidth="2" /><circle cx="70" cy="6" r="3.2" fill="#e88bb1" /><circle cx="70" cy="6" r="1.3" fill="#b1487a" /></g>
          <g><line x1="322" y1="17" x2="322" y2="9" stroke="#5ea44d" strokeWidth="2" /><circle cx="322" cy="7" r="3.2" fill="#f2b134" /><circle cx="322" cy="7" r="1.3" fill="#b97c14" /></g>
          <g fill="#c9a15f"><circle cx="36" cy="13" r="1.5" /><circle cx="44" cy="16" r="1.3" /><circle cx="52" cy="12" r="1.4" /><circle cx="47" cy="9" r="1.2" /><circle cx="58" cy="15" r="1.3" /></g>
        </svg>

        <span className={'pq-stumpw' + (ok ? ' win' : '')}><Stump /></span>
        {/* To'nkada qolgan 3 sabzi — statik; g'alabada 1..3 badge faqat shularga. */}
        {STAY.map((c, i) => (
          <span key={i} className="pq-car" style={{ left: c.x, top: c.y }}>
            <span style={{ display: 'inline-block', transform: `rotate(${c.r}deg)` }}>🥕</span>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
          </span>
        ))}
        {/* Ketgan 2 sabzi — to'nkadan quyon yoniga uchib boradi, badge chiqmaydi. */}
        <span className="pq-car pq-take a">🥕</span>
        <span className="pq-car pq-take b">🥕</span>
        {/* Kanon-quyon: sakrab kiradi, sabzilarni olib chetga sakrab chiqadi, chetda qoladi. */}
        <span className="pq-rgo">
          <span className="pq-hopY" style={{ display: 'block' }}>
            <span className="pq-rbr" style={{ display: 'block' }}><Rabbit /></span>
          </span>
        </span>

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">5 − 2 = 3</span>}
      </div>
      </div>

      <div className="pq-opts">
        {EXPRS.map((e) => {
          const sel = picked === e; const right = ok && e === CORRECT_EXPR;
          return <button key={e} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(e); setFeedback(null); }}>{e}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
