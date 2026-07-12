// Dars07 · Amaliyot 06 — P8 Zanjir «Misollar musobaqasi» · 🔴 · tag: sum_chain
// 4 misol birdaniga: [misol] [=] [? slot] + 3 son-tugma. Qator-rang feedback (good/bad, shake),
// to'g'ri javob hech qachon oshkor qilinmaydi. G'alabada to'rtala qator yashil, kubok + yulduzlar,
// 4 kanon-koptok 1..4 badge bilan sanaladi. Maydoncha: arg'imchoq (tebranadi, ustida bola),
// slayd, panjara, quyosh breath, 2 bulut suzadi, bolalarda ko'z pirpiratish + idle-bob.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { expr: '5 + 3', ans: 8, opts: [6, 7, 8, 9] },
  { expr: '6 + 3', ans: 9, opts: [7, 8, 9, 10] },
  { expr: '4 + 4', ans: 8, opts: [6, 7, 8, 9] },
  { expr: '7 + 3', ans: 10, opts: [7, 8, 9, 10] },
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'sum_chain' };
const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · Musobaqa', title: 'Misollar zanjiri',
    setup: 'Maydonchada misollar musobaqasi! To\'rtta misolning har biriga javob kerak.',
    ask: 'Har misol uchun to\'g\'ri javobni tanlang.',
    correct: 'Barakalla! To\'rtala misol to\'g\'ri — g\'olib sizsiz!',
    hint: 'Qizil qatorlarga qarang: misoldagi ikki sonni barmoqda qo\'shib sanang.',
    board: 'Misollar musobaqasi',
  },
  ru: {
    eyebrow: 'Игровая площадка · Соревнование', title: 'Цепочка примеров',
    setup: 'На площадке соревнование примеров! Каждому из четырёх примеров нужен ответ.',
    ask: 'Выбери верный ответ для каждого примера.',
    correct: 'Молодец! Все четыре примера верны — победитель это ты!',
    hint: 'Посмотри на красные строки: сложи два числа примера, считая на пальцах.',
    board: 'Соревнование примеров',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';

// KOPTOK KANONI (D05_06): r~10 doira, radial 2-ton, yupqa kontur, oq blik-ellipse.
const BALLS = [
  { base: '#d9534b', lite: '#f0918a', line: '#a93a33' },
  { base: '#4f8fc4', lite: '#a8cbe8', line: '#33648f' },
  { base: '#f2b134', lite: '#f8d47a', line: '#c98a12' },
  { base: '#5cad57', lite: '#a9d9a0', line: '#3c7d36' },
];
const Ball = ({ c, gid }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={gid} cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor={c.lite} />
        <stop offset="70%" stopColor={c.base} />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill={`url(#${gid})`} stroke={c.line} strokeWidth="1.6" />
    <ellipse cx="8.4" cy="7.6" rx="2.6" ry="1.7" fill="#fff" opacity=".85" transform="rotate(-28 8.4 7.6)" />
  </svg>
);

// ARG'IMCHOQ: A-ramka + tebranadigan guruh (arqonlar + o'rindiq + o'tirgan bola).
// Bola kanoni: teri-rang bosh, blikli ko'zlar, tabassum, qizil futbolka, kalta oyoqchalar.
const Swing = () => (
  <svg viewBox="0 0 112 122" width="106" height="116" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M14 116 L30 14 M46 116 L30 14" stroke="#8a6a3a" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M66 116 L82 14 M98 116 L82 14" stroke="#8a6a3a" strokeWidth="5" strokeLinecap="round" fill="none" />
    <line x1="24" y1="12" x2="88" y2="12" stroke="#7c5a2e" strokeWidth="6" strokeLinecap="round" />
    <g className="pq-swy" style={{ '--bd': '-1.2s' }}>
      <line x1="48" y1="14" x2="48" y2="82" stroke="#9a7b4f" strokeWidth="2.5" />
      <line x1="64" y1="14" x2="64" y2="82" stroke="#9a7b4f" strokeWidth="2.5" />
      <rect x="41" y="82" width="30" height="6" rx="3" fill="#c98a12" stroke="#8a6234" strokeWidth="1.5" />
      <path d="M51 78 Q56 84 55 92 M59 78 Q64 84 63 92" stroke="#3f6f9f" strokeWidth="4.6" strokeLinecap="round" fill="none" />
      <ellipse cx="55" cy="94" rx="3.4" ry="2.2" fill="#2b2f36" />
      <ellipse cx="63" cy="94" rx="3.4" ry="2.2" fill="#2b2f36" />
      <rect x="46" y="62" width="20" height="18" rx="7" fill="#d9534b" stroke="#a33630" strokeWidth="1.6" />
      <path d="M49 65 L48 56 M63 65 L64 56" stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="48" cy="55" r="2.4" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
      <circle cx="64" cy="55" r="2.4" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
      <circle cx="56" cy="49" r="9" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      <circle cx="53" cy="48" r="1.3" fill="#1f2430" /><circle cx="53.4" cy="47.6" r="0.5" fill="#fff" />
      <circle cx="59" cy="48" r="1.3" fill="#1f2430" /><circle cx="59.4" cy="47.6" r="0.5" fill="#fff" />
      <g className="pq-blink"><rect x="51.4" y="46.5" width="3.4" height="3" rx="1.4" fill={SKIN} /><rect x="57.4" y="46.5" width="3.4" height="3" rx="1.4" fill={SKIN} /></g>
      <path d="M53.5 52.4 Q56 54.4 58.5 52.4" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// SLAYD-toboggan: ko'k slayd-yotoq (2 ton), platforma, narvon. 2-3 ton, yupqa kontur.
const Slide = () => (
  <svg viewBox="0 0 130 104" width="122" height="98" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M84 34 L16 90 L28 98 L96 44 Z" fill="#4f8fc4" stroke="#33648f" strokeWidth="2" strokeLinejoin="round" />
    <path d="M84 39 L24 89" stroke="#a8cbe8" strokeWidth="5" strokeLinecap="round" opacity=".85" />
    <rect x="80" y="26" width="46" height="9" rx="3.5" fill="#6b7686" stroke="#4a525e" strokeWidth="1.6" />
    <path d="M96 100 L96 32 M118 100 L118 32" stroke="#8a94a2" strokeWidth="4" strokeLinecap="round" />
    <path d="M96 46 L118 46 M96 60 L118 60 M96 74 L118 74 M96 88 L118 88" stroke="#8a94a2" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Turgan bola (nomsiz): sariq futbolka, kalta oyoqchalar, blikli ko'zlar, tabassum.
const Kid = () => (
  <svg viewBox="0 0 44 66" width="38" height="57" aria-hidden="true" style={{ display: 'block', '--bd': '-2.6s' }}>
    <path d="M17 48 L17 59 M27 48 L27 59" stroke="#3f6f9f" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="16" cy="61.5" rx="3.6" ry="2.3" fill="#2b2f36" />
    <ellipse cx="28" cy="61.5" rx="3.6" ry="2.3" fill="#2b2f36" />
    <rect x="10" y="26" width="24" height="24" rx="8" fill="#f2b134" stroke="#c98a12" strokeWidth="1.6" />
    <path d="M12 32 L6 43 M32 32 L38 43" stroke="#f2b134" strokeWidth="4.6" strokeLinecap="round" />
    <circle cx="5.6" cy="44.6" r="2.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
    <circle cx="38.4" cy="44.6" r="2.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
    <circle cx="22" cy="14" r="10" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
    <circle cx="18.5" cy="13" r="1.5" fill="#1f2430" /><circle cx="19" cy="12.5" r="0.55" fill="#fff" />
    <circle cx="25.5" cy="13" r="1.5" fill="#1f2430" /><circle cx="26" cy="12.5" r="0.55" fill="#fff" />
    <g className="pq-blink"><rect x="16.6" y="11.3" width="3.8" height="3.3" rx="1.5" fill={SKIN} /><rect x="23.6" y="11.3" width="3.8" height="3.3" rx="1.5" fill={SKIN} /></g>
    <path d="M18.5 17.6 Q22 20 25.5 17.6" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

// G'alaba kubogi: oltin 2-ton, dastalar, poya + asos, blik.
const Trophy = () => (
  <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true" style={{ display: 'block' }}>
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

export default function D07_06(props) {
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
    <div className="pq pq0706">
      <style>{`
        .pq0706{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0706 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3c7d36;text-transform:uppercase;}
        .pq0706 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq0706 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0706 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0706 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#f0f8ea,#e6f2dc);border:2px solid #d5e6c6;}
        .pq0706 .pq-scene{position:relative;width:372px;max-width:100%;height:216px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 70%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0706 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0706 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0706 .pq-cloud.c1{top:16px;left:-70px;animation-duration:28s;animation-delay:-10s;}
        .pq0706 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-24s;}
        .pq0706 .pq-fence{position:absolute;left:0;right:0;bottom:56px;height:32px;background:repeating-linear-gradient(90deg,#e8d9bd 0 9px,transparent 9px 22px);}
        .pq0706 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#dcc9a3;border-radius:3px;}
        .pq0706 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(#a8d977,#8cc55e);border-top:2px solid #7fb96e;}
        .pq0706 .pq-tuft{position:absolute;bottom:6px;font-size:0;line-height:0;opacity:.8;}
        .pq0706 .pq-board{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:3;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq0706 .pq-board::before,.pq0706 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq0706 .pq-board::before{left:16px;} .pq0706 .pq-board::after{right:16px;}
        .pq0706 .pq-balls{position:absolute;top:62px;left:50%;transform:translateX(-50%);display:flex;gap:9px;z-index:3;}
        .pq0706 .pq-ball{position:relative;line-height:0;animation:pqBob 2.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0706 .pq-ball.win{animation:pqBob 2.4s ease-in-out infinite,pqCele .55s ease;}
        .pq0706 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0706 .pq-swingwrap{position:absolute;left:8px;bottom:8px;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0706 .pq-swy{transform-box:fill-box;transform-origin:50% 0%;animation:pqSwing 3.2s ease-in-out infinite;}
        .pq0706 .pq-slidewrap{position:absolute;right:6px;bottom:8px;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0706 .pq-kid{position:absolute;left:168px;bottom:8px;line-height:0;z-index:2;animation:pqKidBob 2.8s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0706 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0706 .pq-trophy{position:absolute;top:92px;left:50%;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 6px rgba(201,138,18,.4));animation:pqAns .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0706 .pq-wstar{position:absolute;z-index:4;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq0706 .pq-wstar.w2{animation-delay:-.5s;} .pq0706 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq0706 .pq-rows{position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:6px;}
        .pq0706 .pq-rw{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;align-content:center;padding:5px 9px;border-radius:14px;border:2.5px solid #d8e3ca;background:#fff;transition:.15s;animation:pqFloat 4s ease-in-out infinite;}
        .pq0706 .pq-rw:nth-child(1){animation-delay:0s;}
        .pq0706 .pq-rw:nth-child(2){animation-delay:-1.4s;}
        .pq0706 .pq-rw:nth-child(3){animation-delay:-2.7s;}
        .pq0706 .pq-rw:nth-child(4){animation-delay:-3.3s;}
        .pq0706 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq0706 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq0706 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq0706 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq0706 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq0706 .pq-rw.good.win{animation:pqFloat 4s ease-in-out infinite,pqCele .5s ease;}
        .pq0706 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqFloat 4s ease-in-out infinite,pqShake .35s ease;}
        .pq0706 .pq-ex{min-width:78px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq0706 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq0706 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0706 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq0706 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq0706 .pq-sgs{display:flex;gap:5px;margin-left:4px;flex-basis:100%;justify-content:center;}
        .pq0706 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0706 .pq-sg:hover:not(:disabled){border-color:#9cc48f;transform:translateY(-2px);}
        .pq0706 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq0706 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0706 .pq-sg:disabled{cursor:default;}
        .pq0706 .pq-spark{position:absolute;pointer-events:none;opacity:0;animation:pqTwinkleSlow 4.6s ease-in-out infinite;filter:drop-shadow(0 0 2px rgba(242,177,52,.55));}
        .pq0706 .pq-spark.s2{animation-duration:5.4s;animation-delay:-2.6s;}
        .pq0706 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0706 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0706 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqKidBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
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
          <span className="pq-fence" />
          <span className="pq-grass" />
          <span className="pq-tuft" style={{ left: '140px' }}><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M2 12 q2 -8 4 -1 M8 12 q2 -10 4 -1 M13 12 q2 -7 4 -1" stroke="#6da75c" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
          <span className="pq-tuft" style={{ left: '236px' }}><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M2 12 q2 -8 4 -1 M8 12 q2 -10 4 -1 M13 12 q2 -7 4 -1" stroke="#6da75c" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
          <div className="pq-board">{t.board}</div>
          <div className="pq-balls">
            {BALLS.map((c, i) => (
              <span key={i} className={'pq-ball' + (ok ? ' win' : '')} style={{ animationDelay: ok ? `${i * 0.1}s` : `-${(i * 0.4).toFixed(1)}s` }}>
                <Ball c={c} gid={`pq0706b${i}`} />{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
          </div>
          <div className="pq-swingwrap"><Swing /></div>
          <div className="pq-slidewrap"><Slide /></div>
          <div className="pq-kid"><Kid /></div>
          {ok && (
            <>
              <span className="pq-trophy"><Trophy /></span>
              <span className="pq-wstar" style={{ left: '38%', top: '82px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '60%', top: '96px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '150px' }}><Star fill="#f2b134" /></span>
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
