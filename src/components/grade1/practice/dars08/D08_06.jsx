// Dars08 · Amaliyot 06 — P8 Zanjir «Misollar musobaqasi» · 🔴 · tag: sub_chain
// 4 ayirish misoli birdaniga: [misol] [=] [? slot] + 3 son-tugma. Qator-rang feedback (good/bad,
// shake), to'g'ri javob hech qachon oshkor qilinmaydi. G'alabada to'rtala qator yashil, kubok +
// yulduzlar, 4 kanon-tuxum 1..4 badge bilan sanaladi. Hovli: panjara, qishloq uychasi (bayroqcha
// sway), daraxt, don-dog', 2 tovuq don cho'qiydi (bosh egiladi, stagger), quyosh breath, 2 bulut.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { expr: '6 − 2', ans: 4, opts: [3, 4, 5] },
  { expr: '5 − 3', ans: 2, opts: [1, 2, 3] },
  { expr: '7 − 4', ans: 3, opts: [2, 3, 4] },
  { expr: '9 − 5', ans: 4, opts: [3, 4, 5] },
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'sub_chain' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Musobaqa', title: 'Ayirish zanjiri',
    setup: 'Hovlida misollar musobaqasi! To\'rtta ayirish misolining har biriga javob kerak.',
    ask: 'Har misol uchun to\'g\'ri javobni tanlang.',
    correct: 'Barakalla! To\'rtala misol to\'g\'ri — g\'olib sizsiz!',
    hint: 'Qizil qatorlarga qarang: katta sondan kichigini barmoqda ayirib sanang.',
    board: 'Misollar musobaqasi',
  },
  ru: {
    eyebrow: 'Сельский двор · Соревнование', title: 'Цепочка вычитания',
    setup: 'Во дворе соревнование примеров! Каждому из четырёх примеров на вычитание нужен ответ.',
    ask: 'Выбери верный ответ для каждого примера.',
    correct: 'Молодец! Все четыре примера верны — победитель это ты!',
    hint: 'Посмотри на красные строки: от большего числа отними меньшее, считая на пальцах.',
    board: 'Соревнование примеров',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TOVUQ KANONI: yon ko'rinish, oq-krem tana 2-ton (#f6f1e4/#e4dbc6, kontur #b9a67e),
// qizil toj-soqolcha (#d9534b), sariq tumshuq/oyoqlar (#e8a33d), blikli pirpiratuvchi ko'z,
// kichik qanot-chizig'i. Bosh-guruh (pq-hd) cho'qish uchun oldinga-orqaga egiladi.
const HEN = { body: '#f6f1e4', shade: '#e4dbc6', line: '#b9a67e', comb: '#d9534b', beak: '#e8a33d' };
const Hen = () => (
  <svg viewBox="0 0 66 58" width="56" height="49" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M16 31 Q4 27 5 15 Q13 23 19 26 Z" fill={HEN.shade} stroke={HEN.line} strokeWidth="1.2" />
    <path d="M18 28 Q9 18 13 9 Q17 20 23 24 Z" fill={HEN.body} stroke={HEN.line} strokeWidth="1.2" />
    <line x1="28" y1="47" x2="28" y2="54" stroke={HEN.beak} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="37" y1="47" x2="37" y2="54" stroke={HEN.beak} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M28 54 L24.5 55.5 M28 54 L31 55.5 M37 54 L33.5 55.5 M37 54 L40 55.5" stroke={HEN.beak} strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="32" cy="36" rx="17" ry="12.5" fill={HEN.body} stroke={HEN.line} strokeWidth="1.6" />
    <ellipse cx="35" cy="41" rx="11" ry="6.5" fill={HEN.shade} />
    <path d="M25 32 Q34 28 42 33 Q37 39 29 38 Q25 36 25 32 Z" fill={HEN.shade} stroke={HEN.line} strokeWidth="1.2" opacity=".9" />
    <g className="pq-hd">
      <path d="M42 32 Q45 22 51 18 L55 22 Q49 26 47 34 Z" fill={HEN.body} stroke={HEN.line} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="52" cy="19" r="6.8" fill={HEN.body} stroke={HEN.line} strokeWidth="1.4" />
      <path d="M47 14 Q47 9 50 12 Q50 7 53 10.5 Q54 6.5 56 11 Q58 12 56.5 14 Z" fill={HEN.comb} stroke="#b23f38" strokeWidth="1" strokeLinejoin="round" />
      <polygon points="58.5,17.5 65,19.5 58.5,21.5" fill={HEN.beak} />
      <path d="M56 23 q2.5 5 -1.5 5 q-2.5 0 -1 -5 Z" fill={HEN.comb} />
      <circle cx="54" cy="17.5" r="1.5" fill="#1f2430" /><circle cx="54.5" cy="17" r="0.55" fill="#fff" />
      <g className="pq-blink"><rect x="52.2" y="15.8" width="3.6" height="3.4" rx="1.5" fill={HEN.body} /></g>
    </g>
  </svg>
);

// TUXUM KANONI: oq-krem oval 2-ton + blik (har biri aniq bitta dona).
const Egg = () => (
  <svg viewBox="0 0 24 30" width="23" height="29" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 2 C18 2 21.5 12 21.5 18.5 A9.5 9.8 0 0 1 2.5 18.5 C2.5 12 6 2 12 2 Z" fill={HEN.body} stroke={HEN.line} strokeWidth="1.4" />
    <path d="M4 20 A8.2 7.4 0 0 0 20 20 A9.5 9 0 0 1 4 20 Z" fill={HEN.shade} opacity=".8" />
    <ellipse cx="8.6" cy="9.4" rx="2.6" ry="3.6" fill="#fff" opacity=".8" transform="rotate(-18 8.6 9.4)" />
  </svg>
);

// Qishloq uychasi: devor + tom + deraza; tom uchida bayroqcha (sway).
const House = () => (
  <svg viewBox="0 0 96 94" width="86" height="84" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-flag"><line x1="48" y1="16" x2="48" y2="3" stroke="#8a6234" strokeWidth="2" strokeLinecap="round" /><polygon points="48,3 62,6.5 48,10" fill="#d9534b" stroke="#a33630" strokeWidth="1" /></g>
    <rect x="14" y="38" width="68" height="46" rx="2.5" fill="#f0e6cf" stroke="#c9b48c" strokeWidth="2" />
    <rect x="14" y="74" width="68" height="10" fill="#e2d2ac" />
    <path d="M6 40 L48 12 L90 40 Z" fill="#c0704d" stroke="#93513a" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 34 L48 13.6 L80 34" stroke="#d98a66" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="34" y="48" width="28" height="24" rx="2" fill="#bfe0f2" stroke="#8a6a3a" strokeWidth="2.4" />
    <line x1="48" y1="48" x2="48" y2="72" stroke="#8a6a3a" strokeWidth="2" />
    <line x1="34" y1="60" x2="62" y2="60" stroke="#8a6a3a" strokeWidth="2" />
    <rect x="31" y="72" width="34" height="4" rx="2" fill="#b08d56" />
  </svg>
);

// Daraxt: D03_04 kanonining ixchami — po'stloq tana, uch tonlik toj, yorug'lik dog'lari, mevalar.
const Tree = () => (
  <svg viewBox="0 0 110 108" width="94" height="92" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M52 104 L52 66 Q52 58 44 52 M60 104 L60 64 Q60 56 68 48" stroke="#7c4f24" strokeWidth="9" strokeLinecap="round" fill="none" />
    <circle cx="38" cy="44" r="24" fill="#4f9a48" />
    <circle cx="72" cy="36" r="26" fill="#5cae54" />
    <circle cx="55" cy="56" r="21" fill="#478b41" />
    <circle cx="52" cy="24" r="18" fill="#68bd60" />
    <circle cx="46" cy="18" r="7.5" fill="#83cf7a" opacity=".8" />
    <circle cx="80" cy="28" r="7.5" fill="#83cf7a" opacity=".7" />
    <circle cx="34" cy="36" r="4" fill="#d94f5c" /><circle cx="33" cy="34.8" r="1.2" fill="#fff" opacity=".5" />
    <circle cx="82" cy="44" r="4" fill="#d94f5c" /><circle cx="81" cy="42.8" r="1.2" fill="#fff" opacity=".5" />
  </svg>
);

// G'alaba kubogi: oltin 2-ton, dastalar, poya + asos, blik (D07_06 kanoni).
const Trophy = () => (
  <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true" style={{ display: 'block' }}>
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

const Grain = () => (
  <svg viewBox="0 0 30 10" width="30" height="10" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="4" cy="7" rx="2" ry="1.3" fill="#d9a94e" /><ellipse cx="11" cy="5" rx="2" ry="1.3" fill="#c9952f" />
    <ellipse cx="17" cy="8" rx="2" ry="1.3" fill="#d9a94e" /><ellipse cx="23" cy="5.5" rx="2" ry="1.3" fill="#c9952f" />
    <ellipse cx="27" cy="8" rx="1.8" ry="1.2" fill="#d9a94e" />
  </svg>
);

export default function D08_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

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
    <div className="pq pq0806">
      <style>{`
        .pq0806{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0806 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a3701f;text-transform:uppercase;}
        .pq0806 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq0806 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0806 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0806 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#faf4e4,#f3ead2);border:2px solid #e8dcbc;}
        .pq0806 .pq-scene{position:relative;width:372px;max-width:100%;height:216px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#f2f0dd 70%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0806 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0806 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0806 .pq-cloud.c1{top:16px;left:-70px;animation-duration:28s;animation-delay:-11s;}
        .pq0806 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-25s;}
        .pq0806 .pq-house{position:absolute;left:4px;bottom:58px;line-height:0;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0806 .pq-tree{position:absolute;right:2px;bottom:62px;line-height:0;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0806 .pq-flag{transform-box:view-box;transform-origin:48px 16px;animation:pqSway 2.8s ease-in-out infinite alternate;}
        .pq0806 .pq-fence{position:absolute;left:0;right:0;bottom:56px;height:32px;background:repeating-linear-gradient(90deg,#e8d9bd 0 9px,transparent 9px 22px);z-index:1;}
        .pq0806 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#dcc9a3;border-radius:3px;}
        .pq0806 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(#cbb98a,#bda872);border-top:2px solid #ac9a68;z-index:1;}
        .pq0806 .pq-tuft{position:absolute;bottom:8px;font-size:0;line-height:0;opacity:.8;z-index:1;}
        .pq0806 .pq-grain{position:absolute;line-height:0;z-index:2;}
        .pq0806 .pq-hen{position:absolute;bottom:4px;line-height:0;z-index:2;animation:pqHenBob 2.8s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0806 .pq-hen.flip svg{transform:scaleX(-1);}
        .pq0806 .pq-hd{transform-box:view-box;transform-origin:45px 32px;animation:pqPeck 2.8s ease-in-out infinite;animation-delay:var(--pd,0s);}
        .pq0806 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0806 .pq-board{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:3;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq0806 .pq-board::before,.pq0806 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq0806 .pq-board::before{left:16px;} .pq0806 .pq-board::after{right:16px;}
        .pq0806 .pq-eggs{position:absolute;top:62px;left:50%;transform:translateX(-50%);display:flex;gap:11px;z-index:3;}
        .pq0806 .pq-egg{position:relative;line-height:0;animation:pqEggBob 2.5s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0806 .pq-egg.win{animation:pqEggBob 2.5s ease-in-out infinite,pqCele .55s ease;}
        .pq0806 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0806 .pq-trophy{position:absolute;top:96px;left:50%;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 6px rgba(201,138,18,.4));animation:pqAns .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0806 .pq-wstar{position:absolute;z-index:4;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq0806 .pq-wstar.w2{animation-delay:-.5s;} .pq0806 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq0806 .pq-rows{position:relative;display:flex;flex-direction:column;gap:6px;}
        .pq0806 .pq-rw{display:flex;gap:8px;align-items:center;padding:5px 9px;border-radius:14px;border:2.5px solid #e3d9bc;background:#fff;transition:.15s;animation:pqFloat 4s ease-in-out infinite;}
        .pq0806 .pq-rw:nth-child(1){animation-delay:0s;}
        .pq0806 .pq-rw:nth-child(2){animation-delay:-1.4s;}
        .pq0806 .pq-rw:nth-child(3){animation-delay:-2.7s;}
        .pq0806 .pq-rw:nth-child(4){animation-delay:-3.3s;}
        .pq0806 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq0806 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq0806 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq0806 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq0806 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq0806 .pq-rw.good.win{animation:pqFloat 4s ease-in-out infinite,pqCele .5s ease;}
        .pq0806 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqFloat 4s ease-in-out infinite,pqShake .35s ease;}
        .pq0806 .pq-ex{min-width:78px;height:44px;border-radius:10px;background:#f8f5ec;border:2px solid #e0d8c2;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq0806 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq0806 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0806 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq0806 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq0806 .pq-sgs{display:flex;gap:5px;margin-left:4px;}
        .pq0806 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0806 .pq-sg:hover:not(:disabled){border-color:#d3b878;transform:translateY(-2px);}
        .pq0806 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq0806 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0806 .pq-sg:disabled{cursor:default;}
        .pq0806 .pq-spark{position:absolute;pointer-events:none;opacity:0;animation:pqTwinkleSlow 4.6s ease-in-out infinite;filter:drop-shadow(0 0 2px rgba(242,177,52,.55));}
        .pq0806 .pq-spark.s2{animation-duration:5.4s;animation-delay:-2.6s;}
        .pq0806 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0806 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0806 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{from{transform:rotate(-6deg);}to{transform:rotate(7deg);}}
        @keyframes pqHenBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqPeck{0%,52%,100%{transform:rotate(0deg);}62%,72%{transform:rotate(24deg);}82%{transform:rotate(5deg);}}
        @keyframes pqEggBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqTwinkleSlow{0%,58%,100%{opacity:0;transform:scale(.3) rotate(0deg);}66%{opacity:1;transform:scale(1) rotate(45deg);}74%{opacity:0;transform:scale(.3) rotate(90deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-house"><House /></span>
          <span className="pq-tree"><Tree /></span>
          <span className="pq-fence" />
          <span className="pq-grass" />
          <span className="pq-tuft" style={{ left: '16px' }}><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M2 12 q2 -8 4 -1 M8 12 q2 -10 4 -1 M13 12 q2 -7 4 -1" stroke="#9a8a52" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
          <span className="pq-tuft" style={{ left: '346px' }}><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M2 12 q2 -8 4 -1 M8 12 q2 -10 4 -1 M13 12 q2 -7 4 -1" stroke="#9a8a52" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
          {/* Don-dog': har tovuqning tumshug'i oldida */}
          <span className="pq-grain" style={{ left: '110px', bottom: '6px' }}><Grain /></span>
          <span className="pq-grain" style={{ left: '232px', bottom: '6px' }}><Grain /></span>
          {/* 2 tovuq — dekor, sanalmaydi: don cho'qiydi (bosh-guruh egiladi, stagger) */}
          <span className="pq-hen" style={{ left: '54px', '--pd': '0s', '--bd': '-1.2s' }}><Hen /></span>
          <span className="pq-hen flip" style={{ left: '288px', animationDelay: '-1.4s', '--pd': '-1.4s', '--bd': '-2.9s' }}><Hen /></span>
          <div className="pq-board">{t.board}</div>
          <div className="pq-eggs">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className={'pq-egg' + (ok ? ' win' : '')} style={{ animationDelay: ok ? `${i * 0.1}s` : `-${(i * 0.4).toFixed(1)}s` }}>
                <Egg />{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
          </div>
          {ok && (
            <>
              <span className="pq-trophy"><Trophy /></span>
              <span className="pq-wstar" style={{ left: '36%', top: '86px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '62%', top: '98px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '152px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">{r.expr}</div>
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
          <svg className="pq-spark" style={{ left: '-17px', top: '31%' }} width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#f2b134" /></svg>
          <svg className="pq-spark s2" style={{ right: '-18px', top: '63%' }} width="11" height="11" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#e59a2f" /></svg>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
