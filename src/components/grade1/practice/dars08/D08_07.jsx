// Dars08 · Amaliyot 07 — LOGIC kamayuvchi naqsh (kubik minoralar 5-4-3-?) · 🔴 · tag: logic_shrinking
// Hovli burchagi: taxta-stol ustida kamayuvchi minoralar 5, 4, 3, [?]. To'g'ri = 2 kubik (D07_07 teskarisi).
// G'alabada 2-kubikli minora joyiga birin-ketin tushib quriladi, har ustun ostida soni (5,4,3,2) chiqadi.
// Dekor: panjara, qishloq uychasi (bayroqcha sway), daraxt, 2 tovuq don cho'qiydi (stagger), quyosh breath, 2 bulut.
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

const DATA = { target: 2, options: [2, 1, 3], ptype: 'LOGIC', level: '🔴', tag: 'logic_shrinking' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Kubiklar', title: 'Kamayuvchi naqsh',
    setup: 'Bolalar stol ustida kubik minoralar qurishdi: har keyingi minora bittaga pastroq.',
    ask: 'Keyingi minora qanday bo\'ladi?',
    correct: 'Barakalla! Besh, to\'rt, uch — keyingisi ikki kubikli minora!',
    hint: 'Minoralarni solishtiring: har keyingisi avvalgisidan nechtaga past?',
    opts: ['2 kubik', '1 kubik', '3 kubik'],
  },
  ru: {
    eyebrow: 'Сельский двор · Кубики', title: 'Убывающий узор',
    setup: 'Дети построили на столе башни из кубиков: каждая следующая башня на один кубик ниже.',
    ask: 'Какой будет следующая башня?',
    correct: 'Молодец! Пять, четыре, три — следующая башня из двух кубиков!',
    hint: 'Сравни башни: на сколько каждая следующая ниже предыдущей?',
    opts: ['2 кубика', '1 кубик', '3 кубика'],
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
// Yog'och kubik palitrasi (D07_07 kanoni): f=old yuz, t=usti (ochroq), s=yon (to'qroq), l=kontur.
const PAL = [
  { f: '#d9534b', t: '#e8837d', s: '#a83a33', l: '#8f2f29' }, // qizil
  { f: '#4f8fc4', t: '#7fb0d8', s: '#3a6f9c', l: '#2c567a' }, // ko'k
  { f: '#f2b134', t: '#f7cd74', s: '#cf8f1a', l: '#a8721a' }, // sariq
  { f: '#57a84f', t: '#84c47d', s: '#3f8a39', l: '#31682c' }, // yashil
];

// Kubik kanoni: 2-3 ton (old + ochroq ust + to'qroq yon) + yupqa kontur + blik.
const Cube = ({ c, w = 34 }) => (
  <svg viewBox="0 0 40 35" width={w} height={w * 35 / 40} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="3,9 11,2 37,2 29,9" fill={c.t} stroke={c.l} strokeWidth="1.5" strokeLinejoin="round" />
    <polygon points="29,9 37,2 37,27 29,34" fill={c.s} stroke={c.l} strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="3" y="9" width="26" height="25" rx="1.5" fill={c.f} stroke={c.l} strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="6" y="12" width="7.5" height="4.6" rx="2.2" fill="#fff" opacity=".38" />
  </svg>
);

// Minora = ustma-ust kubiklar (bitta kubik = bitta aniq dona).
// drop=true — g'alaba-qurilish: kubiklar birin-ketin balanddan tushadi (restore/review'da statik).
const CUBE_STEP = 25, CUBE_H = 35;
const Tower = ({ n, off = 0, w = 34, drop = false }) => {
  const k = w / 40, step = CUBE_STEP * k;
  return (
    <div className="pq-tower" style={{ width: w, height: (CUBE_STEP * (n - 1) + CUBE_H) * k }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className={'pq-cube' + (drop ? ' fall' : '')}
          style={{ bottom: i * step, animationDelay: drop ? `${0.15 + i * 0.3}s` : `${(off + i) * 0.07}s` }}>
          <Cube c={PAL[(off + i) % PAL.length]} w={w} />
        </span>
      ))}
    </div>
  );
};

// TOVUQ KANONI (D08_06): yon ko'rinish, oq-krem tana 2-ton, qizil toj-soqolcha, sariq
// tumshuq/oyoqlar, blikli pirpiratuvchi ko'z, qanot-chizig'i. Bosh-guruh (pq-hd) cho'qishda egiladi.
const HEN = { body: '#f6f1e4', shade: '#e4dbc6', line: '#b9a67e', comb: '#d9534b', beak: '#e8a33d' };
const Hen = () => (
  <svg viewBox="0 0 66 58" width="52" height="46" aria-hidden="true" style={{ display: 'block' }}>
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

// Qishloq uychasi (bobo-buvi uyi): devor + tom + deraza; tom uchida bayroqcha (sway).
const House = () => (
  <svg viewBox="0 0 96 94" width="82" height="80" aria-hidden="true" style={{ display: 'block' }}>
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
  <svg viewBox="0 0 110 108" width="90" height="88" aria-hidden="true" style={{ display: 'block' }}>
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

// Bola kanoni (D07_02): teri-rang bosh + blikli pirpiratuvchi ko'z + futbolka-tana + oyoqchalar.
const Kid = ({ shirt, d }) => (
  <svg viewBox="0 0 34 46" width="30" height="41" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.6)}s` }}>
    <line x1="13" y1="36" x2="13" y2="43" stroke="#6b5b4a" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="21" y1="36" x2="21" y2="43" stroke="#6b5b4a" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="8" y="21.5" width="18" height="15.5" rx="6" fill={shirt.c} stroke={shirt.line} strokeWidth="1.5" />
    <circle cx="17" cy="12" r="9" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5" />
    <circle cx="14" cy="11" r="1.35" fill="#1f2430" /><circle cx="14.5" cy="10.5" r="0.5" fill="#fff" />
    <circle cx="20" cy="11" r="1.35" fill="#1f2430" /><circle cx="20.5" cy="10.5" r="0.5" fill="#fff" />
    <g className="pq-blink"><rect x="12.2" y="9.4" width="3.6" height="3.2" rx="1.5" fill={SKIN} /><rect x="18.2" y="9.4" width="3.6" height="3.2" rx="1.5" fill={SKIN} /></g>
    <path d="M14 15.4 Q17 17.6 20 15.4" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

const Grain = () => (
  <svg viewBox="0 0 30 10" width="30" height="10" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="4" cy="7" rx="2" ry="1.3" fill="#d9a94e" /><ellipse cx="11" cy="5" rx="2" ry="1.3" fill="#c9952f" />
    <ellipse cx="17" cy="8" rx="2" ry="1.3" fill="#d9a94e" /><ellipse cx="23" cy="5.5" rx="2" ry="1.3" fill="#c9952f" />
    <ellipse cx="27" cy="8" rx="1.8" ry="1.2" fill="#d9a94e" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Minoralar qatori: 5, 4, 3, [?]. off — palitra/stagger siljishi (kubiklar ketma-ket kiradi).
const ROW = [
  { n: 5, off: 0 },
  { n: 4, off: 5 },
  { n: 3, off: 9 },
];

export default function D08_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Restore/review'da g'alaba-qurilish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: t.opts, studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const badgeDelay = (i) => (still ? '0s' : `${1.5 + i * 0.12}s`);
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq0807" ref={fitRef}>
      <style>{`
        .pq0807{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0807 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a3701f;text-transform:uppercase;}
        .pq0807 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0807 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0807 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0807 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:252px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#f2f0dd 70%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0807 .pq-fit{position:relative;margin:0 auto;}
        .pq0807 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0807 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0807 .pq-cloud.c1{top:14px;left:-70px;animation-duration:29s;animation-delay:-12s;}
        .pq0807 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-25s;}
        .pq0807 .pq-house{position:absolute;left:3px;bottom:60px;line-height:0;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0807 .pq-tree{position:absolute;right:1px;bottom:64px;line-height:0;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0807 .pq-flag{transform-box:view-box;transform-origin:48px 16px;animation:pqSway 2.8s ease-in-out infinite alternate;}
        .pq0807 .pq-fence{position:absolute;left:0;right:0;bottom:58px;height:32px;background:repeating-linear-gradient(90deg,#e8d9bd 0 9px,transparent 9px 22px);z-index:1;}
        .pq0807 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#dcc9a3;border-radius:3px;}
        .pq0807 .pq-yard{position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(#cbb98a,#bda872);border-top:2px solid #ac9a68;z-index:1;}
        .pq0807 .pq-tuft{position:absolute;bottom:8px;font-size:0;line-height:0;opacity:.8;z-index:1;}
        .pq0807 .pq-grain{position:absolute;line-height:0;z-index:2;}
        .pq0807 .pq-hen{position:absolute;bottom:4px;line-height:0;z-index:2;animation:pqHenBob 2.8s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0807 .pq-hen.flip svg{transform:scaleX(-1);}
        .pq0807 .pq-hd{transform-box:view-box;transform-origin:45px 32px;animation:pqPeck 2.8s ease-in-out infinite;animation-delay:var(--pd,0s);}
        .pq0807 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0807 .pq-kid{position:absolute;left:24px;bottom:24px;z-index:3;animation:pqKidBob 3.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0807 .pq-tleg{position:absolute;bottom:16px;width:11px;height:52px;border-radius:4px;background:linear-gradient(90deg,#b08d56,#8f6b38);border:2px solid #7c5a2c;z-index:2;}
        .pq0807 .pq-tleg.l1{left:60px;} .pq0807 .pq-tleg.l2{right:60px;}
        .pq0807 .pq-ttop{position:absolute;left:36px;right:36px;bottom:66px;height:14px;border-radius:7px;background:linear-gradient(#c99e63,#aa7d44);border:2px solid #8a6234;box-shadow:0 3px 5px rgba(0,0,0,.16);z-index:3;}
        .pq0807 .pq-ttop::after{content:'';position:absolute;left:8px;right:8px;top:3px;height:2.5px;border-radius:2px;background:#dcb37c;opacity:.8;}
        .pq0807 .pq-trow{position:absolute;left:54px;right:54px;bottom:82px;display:flex;justify-content:space-between;align-items:flex-end;z-index:4;}
        .pq0807 .pq-tslot{position:relative;display:flex;justify-content:center;align-items:flex-end;min-width:34px;}
        .pq0807 .pq-tslot.win{animation:pqCele .55s ease both;animation-delay:var(--cd,1.5s);}
        .pq0807 .pq-scene.still .pq-tslot.win{animation:none;}
        .pq0807 .pq-tower{position:relative;}
        .pq0807 .pq-cube{position:absolute;left:0;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));animation:pqDrop .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0807 .pq-cube.fall{animation:pqFall .6s cubic-bezier(.34,1.2,.5,1) both;}
        .pq0807 .pq-qbox{width:36px;height:62px;border:2.5px dashed #b9915f;border-radius:10px;background:rgba(255,255,255,.32);display:flex;align-items:center;justify-content:center;animation:pqPulse 2s ease-in-out infinite;}
        .pq0807 .pq-q{font-size:26px;font-weight:900;color:#a97b3e;}
        .pq0807 .pq-cnt{position:absolute;left:50%;bottom:-25px;transform:translate(-50%,0);min-width:20px;height:20px;padding:0 4px;border-radius:50%;background:#2563eb;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPopC .35s ease both;z-index:5;}
        .pq0807 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq0807 .pq-wstar.w2{animation-delay:-.5s;} .pq0807 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq0807 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:20px;}
        .pq0807 .pq-opt{width:86px;height:96px;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding:0 0 12px;transition:.13s;}
        .pq0807 .pq-opt:hover:not(:disabled){border-color:#dab88a;transform:translateY(-2px);}
        .pq0807 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0807 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0807 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0807 .pq-opt:disabled{cursor:default;}
        .pq0807 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0807 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0807 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{from{transform:rotate(-6deg);}to{transform:rotate(7deg);}}
        @keyframes pqHenBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqPeck{0%,52%,100%{transform:rotate(0deg);}62%,72%{transform:rotate(24deg);}82%{transform:rotate(5deg);}}
        @keyframes pqKidBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.07);opacity:1;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-32px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqFall{0%{opacity:0;transform:translateY(-72px);}60%{opacity:1;transform:translateY(4px);}80%{transform:translateY(-3px);}100%{transform:translateY(0);}}
        @keyframes pqPopC{from{opacity:0;transform:translate(-50%,6px) scale(.4);}to{opacity:1;transform:translate(-50%,0) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 252 * scale }}>
      <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-house"><House /></span>
        <span className="pq-tree"><Tree /></span>
        <span className="pq-fence" />
        <span className="pq-yard" />
        <span className="pq-tuft" style={{ left: '14px' }}><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M2 12 q2 -8 4 -1 M8 12 q2 -10 4 -1 M13 12 q2 -7 4 -1" stroke="#9a8a52" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
        <span className="pq-tuft" style={{ left: '346px' }}><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M2 12 q2 -8 4 -1 M8 12 q2 -10 4 -1 M13 12 q2 -7 4 -1" stroke="#9a8a52" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
        {/* Don-dog': stol ostida, har tovuqning tumshug'i oldida */}
        <span className="pq-grain" style={{ left: '162px', bottom: '6px' }}><Grain /></span>
        <span className="pq-grain" style={{ left: '196px', bottom: '6px' }}><Grain /></span>
        {/* 2 tovuq — dekor, sanalmaydi: stol ostida don cho'qiydi (bosh-guruh egiladi, stagger) */}
        <span className="pq-hen" style={{ left: '104px', '--pd': '0s', '--bd': '-1.2s' }}><Hen /></span>
        <span className="pq-hen flip" style={{ left: '216px', animationDelay: '-1.4s', '--pd': '-1.4s', '--bd': '-2.9s' }}><Hen /></span>
        {/* Bola — dekor (nomsiz), minoralarini tomosha qilib turibdi */}
        <span className="pq-kid"><Kid shirt={{ c: '#4f8fc4', line: '#34648c' }} d={1} /></span>
        {/* Taxta-stol: ustida minoralar qatori */}
        <span className="pq-tleg l1" /><span className="pq-tleg l2" />
        <span className="pq-ttop" />
        <div className="pq-trow">
          {ROW.map((tw, i) => (
            <div key={i} className={'pq-tslot' + (ok ? ' win' : '')} style={{ '--cd': `${1.45 + i * 0.12}s` }}>
              <Tower n={tw.n} off={tw.off} />
              {ok && <b className="pq-cnt" style={{ animationDelay: badgeDelay(i) }}>{tw.n}</b>}
            </div>
          ))}
          <div className={'pq-tslot' + (ok ? ' win' : '')} style={{ '--cd': `${1.45 + 3 * 0.12}s` }}>
            {ok
              ? <Tower n={DATA.target} off={12} drop={!still} />
              : <span className="pq-qbox"><span className="pq-q">?</span></span>}
            {ok && <b className="pq-cnt" style={{ animationDelay: badgeDelay(3) }}>{DATA.target}</b>}
          </div>
        </div>
        {ok && (
          <>
            <span className="pq-wstar" style={{ right: '38px', top: '92px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ right: '84px', top: '72px' }}><Star fill="#e59a2f" /></span>
            <span className="pq-wstar w3" style={{ right: '58px', top: '126px' }}><Star fill="#f2b134" /></span>
          </>
        )}
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n, i) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return (
            <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')}
              disabled={lock} aria-label={t.opts[i]}
              onClick={() => { setPicked(n); setFeedback(null); }}>
              <Tower n={n} off={i + 1} w={24} />
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
