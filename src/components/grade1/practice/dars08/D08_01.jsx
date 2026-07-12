// Dars08 · Amaliyot 01 — P7 Qo'shilish takrori (spiral: Dars07) · 🟢 · tag: join_warmup
// Qishloq hovlisi: 3 tovuq don cho'qib turibdi, panjara ortidan 2 malla tovuq yurib kirib qo'shiladi. G'alabada badge 1..5, chip «3 + 2 = 5».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 3, B = 2;
const DATA = { a: 3, b: 2, target: 5, options: [4, 5, 6], ptype: 'P7', level: '🟢', tag: 'join_warmup' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Tovuqlar', title: 'Qo\'shilish takrori',
    setup: 'Bolalar buvisining hovlisiga kirishdi. Hovlida uchta tovuq don cho\'qiyapti. Yana ikkita tovuq yugurib kelib qo\'shildi.',
    ask: 'Endi hovlida jami nechta tovuq bo\'ldi?',
    correct: 'Barakalla! Uch va ikki — besh tovuq.',
    hint: 'Avval turganlarni, keyin kelganlarni qo\'shib sanang.',
  },
  ru: {
    eyebrow: 'Деревенский двор · Куры', title: 'Повторение сложения',
    setup: 'Дети зашли во двор к бабушке. Во дворе три курицы клюют зёрна. Ещё две курицы прибежали и присоединились.',
    ask: 'Сколько всего кур стало во дворе?',
    correct: 'Молодец! Три и две — пять кур.',
    hint: 'Сначала посчитай тех, кто стоял, потом прибавь тех, кто прибежал.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Tovuq kanoni: yon ko'rinish (chapga qaragan), oq-krem tana 2-ton, qizil toj-soqolcha,
// sariq tumshuq/oyoqlar, blikli pirpiratuvchi ko'z, qanot-chizig'i. Bosh — cho'qish guruhi (.pq-hd).
const CREAM = { body: '#f6f1e4', shade: '#e4dbc6', line: '#b9a67e', g: 'cream' };
const MALLA = { body: '#e8d5b0', shade: '#d8c092', line: '#b9a67e', g: 'malla' };

// Tana hajmi uchun radial gradient (qorin yorug', orqa to'q) — har tonda bir marta.
const GradDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="pq0801-cream" cx="58%" cy="32%" r="74%">
        <stop offset="0%" stopColor="#fffdf7" /><stop offset="55%" stopColor="#f6f1e4" /><stop offset="100%" stopColor="#e2d8c1" />
      </radialGradient>
      <radialGradient id="pq0801-malla" cx="58%" cy="32%" r="74%">
        <stop offset="0%" stopColor="#f4e8cd" /><stop offset="55%" stopColor="#e8d5b0" /><stop offset="100%" stopColor="#d0b585" />
      </radialGradient>
    </defs>
  </svg>
);

// Tovuq kanoni (yon ko'rinish, chapga qaragan): hajmli gradient tana, quyruq guruhi (cho'qishda
// qarshi ko'tariladi), navbatli ikki oyoq (yurishda), qizil toj-soqolcha, 2-ton tumshuq, cho'qish
// boshi guruhi (.pq-hd — bosh+bo'yin plunge), blikli pirpiratuvchi ko'z.
const Hen = ({ tone, pd = '0s', wd = '0s', bd = '0s' }) => (
  <svg viewBox="0 0 64 54" width="52" height="44" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-tail">
      <path d="M48 26 Q61 21 60 8 Q54 17 46 20 Z" fill={tone.shade} stroke={tone.line} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M50 24 Q58 19 58 12" stroke={tone.line} strokeWidth="1" fill="none" opacity=".5" />
    </g>
    <g className="pq-leg lg2"><line x1="39" y1="41" x2="40" y2="50" stroke="#c9852a" strokeWidth="2.2" strokeLinecap="round" /><line x1="40" y1="50" x2="35.5" y2="51.5" stroke="#c9852a" strokeWidth="2" strokeLinecap="round" /></g>
    <g className="pq-leg lg1"><line x1="32" y1="41" x2="31" y2="50" stroke="#e8a33d" strokeWidth="2.2" strokeLinecap="round" /><line x1="31" y1="50" x2="26.5" y2="51.5" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" /></g>
    <ellipse cx="36" cy="32" rx="16" ry="11" fill={`url(#pq0801-${tone.g})`} stroke={tone.line} strokeWidth="1.5" />
    <ellipse cx="38" cy="37" rx="11" ry="5.5" fill={tone.shade} opacity=".5" />
    <path d="M30 27 Q42 24 46 31 Q40 38 31 36 Q27 31 30 27 Z" fill={tone.shade} stroke={tone.line} strokeWidth="1" opacity=".9" />
    <path d="M33 29 Q40 27.5 43.5 31" stroke={tone.line} strokeWidth="1" fill="none" opacity=".55" />
    <g className="pq-hd">
      <path d="M17.5 13 Q18.5 6 21.5 10.5 Q23 5 26 9.5 Q28.5 6 29.5 12.5 Z" fill="#d9534b" />
      <path d="M21.5 10.5 Q22.5 8.5 24 9" stroke="#b8443b" strokeWidth="0.8" fill="none" opacity=".6" />
      <ellipse cx="17.5" cy="26.5" rx="2.1" ry="3" fill="#d9534b" />
      <circle cx="23" cy="18" r="8" fill={tone.body} stroke={tone.line} strokeWidth="1.5" />
      <ellipse cx="26" cy="21.5" rx="4" ry="2.6" fill={tone.shade} opacity=".7" />
      <polygon points="16,16.5 7.5,19.2 16,21.8" fill="#f0b24a" />
      <polygon points="16,19 8.4,19.15 16,21.8" fill="#d8922f" />
      <line x1="15.5" y1="19" x2="9.5" y2="19.2" stroke="#c07f1e" strokeWidth="0.9" />
      <circle cx="21" cy="16" r="1.6" fill="#1f2430" />
      <circle cx="21.6" cy="15.4" r="0.6" fill="#fff" />
      <g className="pq-blink" style={{ '--bd': bd }}>
        <rect x="19" y="14.2" width="4.2" height="3.6" rx="1.6" fill={tone.body} />
      </g>
    </g>
  </svg>
);

// Bobo-buvi uychasi: devor + qizil tom + mo'ri + deraza (rom-krest) + eshik + tomda bayroqcha (sway).
const House = () => (
  <svg viewBox="0 0 96 96" width="88" height="88" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="66" y="24" width="9" height="18" fill="#9c4230" />
    <line x1="48" y1="18" x2="48" y2="7" stroke="#8a5a2e" strokeWidth="2" strokeLinecap="round" />
    <g className="pq-flag"><polygon points="48,7 63,10.5 48,14" fill="#d9534b" /></g>
    <rect x="10" y="44" width="76" height="48" rx="3" fill="#efdcb4" stroke="#cbb188" strokeWidth="2" />
    <path d="M4 48 L48 18 L92 48 Z" fill="#c0563f" stroke="#9c4230" strokeWidth="2" strokeLinejoin="round" />
    <rect x="58" y="56" width="20" height="36" rx="2" fill="#a9713d" stroke="#8a5a2e" strokeWidth="1.6" />
    <circle cx="62.5" cy="74" r="1.6" fill="#6d4623" />
    <rect x="19" y="56" width="24" height="20" rx="2" fill="#bfe3f5" stroke="#8fb6cf" strokeWidth="2" />
    <line x1="31" y1="56" x2="31" y2="76" stroke="#8fb6cf" strokeWidth="2" />
    <line x1="19" y1="66" x2="43" y2="66" stroke="#8fb6cf" strokeWidth="2" />
  </svg>
);

// Hovli daraxti: uch tonlik barg-toji + mevalar (D03_04 palitrasi, ixcham).
const Tree = () => (
  <svg viewBox="0 0 96 120" width="86" height="108" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M46 118 L46 74 Q46 64 38 56 M52 118 L52 72 Q52 62 60 54" stroke="#7c4f24" strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="46" r="24" fill="#4f9a48" />
    <circle cx="62" cy="38" r="26" fill="#5cae54" />
    <circle cx="48" cy="60" r="20" fill="#478b41" />
    <circle cx="48" cy="26" r="17" fill="#68bd60" />
    <circle cx="42" cy="20" r="7" fill="#83cf7a" opacity=".8" />
    <circle cx="70" cy="30" r="7" fill="#83cf7a" opacity=".7" />
    <circle cx="36" cy="34" r="4" fill="#d94f5c" />
    <circle cx="34.8" cy="32.8" r="1.3" fill="#fff" opacity=".5" />
    <circle cx="60" cy="52" r="4" fill="#d94f5c" />
    <circle cx="58.8" cy="50.8" r="1.3" fill="#fff" opacity=".5" />
  </svg>
);

// Yer qatlami: don-dog' (tovuqlar cho'qiydigan donlar) + o't-tuplar + gullar.
const Ground = () => (
  <svg viewBox="0 0 340 20" width="340" height="20" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M10 18 q3 -9 5 -1 M20 19 q3 -10 6 -1 M186 18 q3 -9 5 -1 M318 19 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <g><line x1="300" y1="19" x2="300" y2="10" stroke="#5ea44d" strokeWidth="2" /><circle cx="300" cy="8" r="3.2" fill="#e88bb1" /><circle cx="300" cy="8" r="1.3" fill="#b1487a" /></g>
    {[[38, 15], [46, 18], [56, 14], [66, 17], [88, 15], [98, 18], [108, 14], [130, 16], [140, 13], [150, 17], [166, 15], [206, 16], [216, 13], [252, 16], [262, 14]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="2" ry="1.3" fill="#d9a441" stroke="#b97c14" strokeWidth=".5" transform={`rotate(${(i % 3) * 30 - 30} ${x} ${y})`} />
    ))}
  </svg>
);

// Sahna joylashuvi (chap→o'ng tartib = sanash tartibi): 3 cho'quvchi + 2 kiruvchi.
const PECK = [{ x: 56, b: 24 }, { x: 106, b: 19 }, { x: 154, b: 26 }];
const ARRIVE = [{ x: 210, b: 22 }, { x: 258, b: 27 }];

export default function D08_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq0801">
      <style>{`
        .pq0801{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0801 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a06a2c;text-transform:uppercase;}
        .pq0801 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0801 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0801 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0801 .pq-scene{position:relative;width:360px;height:232px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0801 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0801 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0801 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-13s;}
        .pq0801 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-27s;}
        .pq0801 .pq-fence{position:absolute;left:0;right:0;bottom:56px;height:38px;background:repeating-linear-gradient(90deg,#d8b98a 0 10px,#c9a674 10px 14px,transparent 14px 26px);opacity:.9;z-index:0;}
        .pq0801 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:10px;height:5px;background:#c9a674;border-radius:3px;}
        .pq0801 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0801 .pq-house{position:absolute;left:4px;bottom:52px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0801 .pq-flag{transform-box:fill-box;transform-origin:0% 60%;animation:pqSway 2.6s ease-in-out infinite alternate;}
        .pq0801 .pq-tree{position:absolute;right:0;bottom:48px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0801 .pq-ground{position:absolute;left:10px;bottom:6px;z-index:1;}
        .pq0801 .pq-henw{position:absolute;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0801 .pq-hd{transform-box:fill-box;transform-origin:86% 90%;}
        .pq0801 .pq-henP .pq-hd{animation:pqPeck 1.7s ease-in-out infinite;animation-delay:var(--pk,0s);}
        .pq0801 .pq-henA .pq-hd{animation:pqHeadWalk .34s ease-in-out 5 alternate,pqPeck 1.7s ease-in-out infinite;animation-delay:0s,var(--pk,0s);}
        .pq0801 .pq-tail{transform-box:fill-box;transform-origin:14% 86%;}
        .pq0801 .pq-henP .pq-tail,.pq0801 .pq-henA .pq-tail{animation:pqTail 1.7s ease-in-out infinite;animation-delay:var(--pk,0s);}
        .pq0801 .pq-leg{transform-box:fill-box;transform-origin:50% 6%;}
        .pq0801 .pq-henA .pq-leg.lg1{animation:pqLegA .34s ease-in-out 5;animation-delay:var(--wk,0s);}
        .pq0801 .pq-henA .pq-leg.lg2{animation:pqLegB .34s ease-in-out 5;animation-delay:var(--wk,0s);}
        .pq0801 .pq-breathe{transform-box:fill-box;transform-origin:50% 100%;animation:pqBreathe 3.1s ease-in-out infinite;animation-delay:var(--pk,0s);}
        .pq0801 .pq-lean{transform-box:fill-box;transform-origin:50% 100%;animation:pqPeckTip 1.7s ease-in-out infinite;animation-delay:var(--pk,0s);}
        .pq0801 .pq-shadow{position:absolute;left:50%;bottom:-2px;width:44px;height:9px;margin-left:-22px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(60,48,28,.32),rgba(60,48,28,0) 68%);z-index:-1;animation:pqShadow 3.1s ease-in-out infinite;animation-delay:var(--pk,0s);}
        .pq0801 .pq-walkin{position:relative;animation:pqWalkIn 1.6s cubic-bezier(.32,.7,.35,1) both;animation-delay:var(--wk,0s);}
        .pq0801 .pq-step{animation:pqStep .34s ease-in-out 5;animation-delay:var(--wk,0s);}
        .pq0801 .pq-scene.still .pq-walkin{animation:none;transform:translateX(0) scale(1);}
        .pq0801 .pq-scene.still .pq-step{animation:none;}
        .pq0801 .pq-scene.still .pq-leg{animation:none;}
        .pq0801 .pq-scene.still .pq-henA .pq-hd{animation:pqPeck 1.7s ease-in-out infinite;animation-delay:var(--pk,0s);}
        .pq0801 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0801 .pq-cnt{position:absolute;top:-11px;left:50%;margin-left:-9.5px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0801 .pq-q{position:absolute;left:172px;top:44px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #e3d3b6;color:#a06a2c;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(160,106,44,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:3;}
        .pq0801 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0801 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0801 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0801 .pq-opt:hover:not(:disabled){border-color:#e3c99a;transform:translateY(-2px);}
        .pq0801 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0801 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0801 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0801 .pq-opt:disabled{cursor:default;}
        .pq0801 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0801 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0801 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSway{from{transform:rotate(-4deg);}to{transform:rotate(7deg);}}
        @keyframes pqPeck{0%,38%{transform:rotate(0) translateY(0);}46%{transform:rotate(-34deg) translateY(3.5px);}53%{transform:rotate(-13deg) translateY(1px);}60%{transform:rotate(-31deg) translateY(3px);}70%,100%{transform:rotate(0) translateY(0);}}
        @keyframes pqPeckTip{0%,38%,70%,100%{transform:rotate(0);}46%,60%{transform:rotate(-5deg);}53%{transform:rotate(-3deg);}}
        @keyframes pqTail{0%,38%,70%,100%{transform:rotate(0);}46%,60%{transform:rotate(10deg);}53%{transform:rotate(5deg);}}
        @keyframes pqBreathe{0%,100%{transform:scaleY(1);}50%{transform:scaleY(1.035);}}
        @keyframes pqShadow{0%,100%{transform:scaleX(1);opacity:1;}50%{transform:scaleX(.93);opacity:.82;}}
        @keyframes pqLegA{0%,100%{transform:rotate(14deg);}50%{transform:rotate(-14deg);}}
        @keyframes pqLegB{0%,100%{transform:rotate(-14deg);}50%{transform:rotate(14deg);}}
        @keyframes pqHeadWalk{from{transform:translateX(0);}to{transform:translateX(-2.5px);}}
        @keyframes pqWalkIn{0%{transform:translateX(196px) scale(.86);}82%{transform:translateX(-5px) scale(1.01);}100%{transform:translateX(0) scale(1);}}
        @keyframes pqStep{0%,100%{transform:translateY(0);}50%{transform:translateY(-3.5px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        <GradDefs />
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" /><span className="pq-grass" />
        <span className="pq-house"><House /></span>
        <span className="pq-tree"><Tree /></span>
        <span className="pq-ground"><Ground /></span>

        {/* Hovlidagi 3 tovuq — don cho'qiydi (--pk fazasi bilan desinxron). Sanash tartibi: 1..3 */}
        {PECK.map((p, i) => (
          <div key={'P' + i} className="pq-henw pq-henP" style={{ left: p.x, bottom: p.b, '--pk': `${i * 0.55}s` }}>
            <span className="pq-shadow" />
            <div className="pq-breathe"><div className="pq-lean"><Hen tone={CREAM} bd={`${-i * 0.9}s`} /></div></div>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
          </div>
        ))}
        {/* Panjara ortidan kiruvchi 2 malla tovuq — qadam-bob + navbatli oyoq bilan yugurib kiradi,
            oxirida yengil 'settle', keyin cho'qishga qo'shiladi. Soya birga siljiydi. Sanash: 4..5 */}
        {ARRIVE.map((p, i) => (
          <div key={'A' + i} className="pq-henw pq-henA" style={{ left: p.x, bottom: p.b, '--pk': `${1.8 + i * 0.45}s`, '--wk': `${i * 0.25}s` }}>
            <div className="pq-walkin">
              <span className="pq-shadow" />
              <div className="pq-step"><div className="pq-breathe"><div className="pq-lean"><Hen tone={MALLA} bd={`${-(A + i) * 0.9}s`} /></div></div></div>
            </div>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${(A + i) * 0.12}s` }}>{A + i + 1}</b>}
          </div>
        ))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{A} + {B} = {DATA.target}</span>}
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
