// Dars08 · Amaliyot 02 — P9 Ayirish ma'nosi: KAMAYADI (olmalar daraxtdan uzilib tushadi) · 🟡 · tag: take_away_intro
// Hovli: olma daraxtida 6 ta olma, sahna ochilganda 2 tasi birin-ketin tushadi (yiqilish + yerda dumalab
// to'xtaydi, xira EMAS). Savol daraxtdagilar haqida; g'alabada badge faqat daraxtdagi 4 tada, chip «6 − 2 = 4».
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

const DATA = { start: 6, gone: 2, target: 4, options: [3, 4, 5], ptype: 'P9', level: '🟡', tag: 'take_away_intro' };
// Daraxtda QOLADIGAN 4 olma (sahna px, span top-left) — g'alabada 1..4 badge shularda.
const STAY = [
  { x: 64, y: 88 },
  { x: 104, y: 60 },
  { x: 144, y: 72 },
  { x: 130, y: 114 },
];
// TUSHADIGAN 2 olma: dx/dy — yerdagi yakuniy siljish, rot — dumalash burchagi, delay — birin-ketin.
const FALL = [
  { x: 84, y: 124, dx: -30, dy: 74, rot: -170, delay: 0.65 },
  { x: 162, y: 98, dx: 40, dy: 100, rot: 200, delay: 1.6 },
];
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Olma daraxti', title: 'Nechta qoldi?',
    setup: 'Daraxt shoxlarida oltita olma bor edi. Shamol esdi — ikkitasi uzilib yerga tushdi!',
    ask: 'Daraxtda nechta olma QOLDI?',
    correct: 'Barakalla! Olti olmadan ikkitasi tushdi — to\'rttasi qoldi. Kamaydi!',
    hint: 'Daraxtdagi olmalarni sanang — yerga tushganlari endi daraxtda emas.',
  },
  ru: {
    eyebrow: 'Сельский двор · Яблоня', title: 'Сколько осталось?',
    setup: 'На ветках яблони было шесть яблок. Подул ветер — два сорвались и упали на землю!',
    ask: 'Сколько яблок ОСТАЛОСЬ на яблоне?',
    correct: 'Молодец! Из шести яблок два упали — осталось четыре. Стало меньше!',
    hint: 'Посчитай яблоки на дереве — упавшие уже не на ветках.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// D03_04 daraxt kanoni: po'stloq chiziqli tana, yo'g'on shoxlar, uch tonlik barg-toji, shox-stublar.
// Ichki qizil olma-doiralar OLIB TASHLANGAN — sanaladigan olmalar faqat 6 ta emoji (chalkashmasin).
const Tree = () => (
  <svg viewBox="0 0 200 172" width="204" height="176" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="100" cy="165" rx="58" ry="6" fill="#3f7d39" opacity=".18" />
    <path d="M92 165 L92 110 Q92 98 80 88 M108 165 L108 106 Q108 96 122 84 M100 126 Q100 114 100 104" stroke="#7c4f24" strokeWidth="14" strokeLinecap="round" fill="none" />
    <path d="M95 158 L95 120 M104 156 L104 118" stroke="#5f3a17" strokeWidth="2" strokeLinecap="round" opacity=".5" />
    <path d="M92 165 Q86 168 78 169 M108 165 Q114 168 122 169" stroke="#7c4f24" strokeWidth="9" strokeLinecap="round" fill="none" />
    <circle cx="64" cy="74" r="42" fill="#4f9a48" />
    <circle cx="126" cy="58" r="44" fill="#5cae54" />
    <circle cx="102" cy="94" r="36" fill="#478b41" />
    <circle cx="86" cy="42" r="31" fill="#68bd60" />
    <circle cx="76" cy="34" r="12" fill="#83cf7a" opacity=".8" />
    <circle cx="136" cy="44" r="13" fill="#83cf7a" opacity=".7" />
    <circle cx="54" cy="62" r="10" fill="#6fc267" opacity=".7" />
    <path d="M22 78 q14 6 26 2 M172 92 q-12 6 -24 2" stroke="#3f7d39" strokeWidth="3" fill="none" opacity=".5" />
    <path d="M41 59 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M97 35 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M137 63 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M77 85 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

// Bobo-buvi uychasi: devor + terrakota tom + krest-romli deraza + chordoq darchasi.
const House = () => (
  <svg viewBox="0 0 96 86" width="88" height="79" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="16" y="36" width="64" height="44" rx="2" fill="#f3e6c8" stroke="#cfb387" strokeWidth="1.6" />
    <line x1="17" y1="58" x2="79" y2="58" stroke="#e0cda3" strokeWidth="1.2" opacity=".8" />
    <line x1="17" y1="70" x2="79" y2="70" stroke="#e0cda3" strokeWidth="1.2" opacity=".8" />
    <path d="M8 38 L48 8 L88 38 Z" fill="#c0603f" stroke="#96432c" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M15 33 L48 8.5 L81 33" stroke="#d67a55" strokeWidth="3" fill="none" opacity=".55" />
    <circle cx="48" cy="27" r="4.4" fill="#f7ead0" stroke="#96432c" strokeWidth="1.4" />
    <rect x="38" y="47" width="20" height="17" fill="#cdeaf6" stroke="#8a6a3a" strokeWidth="1.8" />
    <line x1="48" y1="47" x2="48" y2="64" stroke="#8a6a3a" strokeWidth="1.4" />
    <line x1="38" y1="55.5" x2="58" y2="55.5" stroke="#8a6a3a" strokeWidth="1.4" />
    <rect x="35" y="64" width="26" height="3.2" rx="1.6" fill="#b98f5c" />
  </svg>
);

// Tovuq kanoni: yon ko'rinish (chapga qaragan), oq-krem tana 2-ton, qizil toj-soqolcha,
// sariq tumshuq/oyoqlar, blikli pirpiratuvchi ko'z, qanot-chizig'i; boshi don sari egiladi (pq-hd).
const HEN = { body: '#f6f1e4', under: '#e4dbc6', line: '#b9a67e', red: '#d9534b', yel: '#e8a33d' };
const Hen = () => (
  <svg viewBox="0 0 64 54" width="56" height="47" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M52 27 Q62 17 60 8 Q53 12 49 21 Z" fill={HEN.under} stroke={HEN.line} strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M50 29 Q60 25 62 16 Q54 18 48 25 Z" fill={HEN.body} stroke={HEN.line} strokeWidth="1.3" strokeLinejoin="round" />
    <line x1="30" y1="40" x2="30" y2="50" stroke={HEN.yel} strokeWidth="2.4" strokeLinecap="round" />
    <line x1="38" y1="40" x2="38" y2="50" stroke={HEN.yel} strokeWidth="2.4" strokeLinecap="round" />
    <line x1="30" y1="50" x2="26" y2="51.5" stroke={HEN.yel} strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="50" x2="34" y2="51.5" stroke={HEN.yel} strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="34" cy="29" rx="18" ry="12.5" fill={HEN.body} stroke={HEN.line} strokeWidth="1.5" />
    <path d="M20 33 Q34 42 50 32 Q44 40 33 40.5 Q24 40 20 33 Z" fill={HEN.under} />
    <path d="M30 24 Q40 22 45 28 Q39 33 31 31 Q28 27 30 24 Z" fill={HEN.under} stroke={HEN.line} strokeWidth="1.2" />
    <g className="pq-hd">
      <path d="M11 18 Q14 25 21 27 L19 30 Q12 27 9 20 Z" fill={HEN.body} stroke={HEN.line} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="13" cy="15" r="7.4" fill={HEN.body} stroke={HEN.line} strokeWidth="1.5" />
      <path d="M9 8.6 Q10 4.2 13 7.2 Q15 3.4 17.2 6.8 Q19.8 5 19 9 Q15.8 11 10.6 10 Z" fill={HEN.red} />
      <polygon points="5.8,13.8 0.5,16.2 6,18.2" fill={HEN.yel} />
      <path d="M7 18.6 Q8.6 22.6 10.8 19.2 Z" fill={HEN.red} />
      <circle cx="10.6" cy="13.4" r="1.5" fill="#1f2430" /><circle cx="11.1" cy="12.9" r="0.55" fill="#fff" />
      <g className="pq-blink"><rect x="8.8" y="11.6" width="3.6" height="3.4" rx="1.6" fill={HEN.body} /></g>
    </g>
  </svg>
);

export default function D08_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda tushish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq0802" ref={fitRef}>
      <style>{`
        .pq0802{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0802 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3e8e46;text-transform:uppercase;}
        .pq0802 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0802 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0802 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0802 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:236px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0802 .pq-fit{position:relative;margin:0 auto;}
        .pq0802 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0802 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0802 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0802 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-26s;}
        .pq0802 .pq-fence{position:absolute;left:0;right:0;bottom:54px;height:34px;background:repeating-linear-gradient(90deg,#e9dcc0 0 9px,#dbc9a3 9px 13px,transparent 13px 24px);opacity:.85;z-index:0;}
        .pq0802 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#d3bf96;border-radius:3px;}
        .pq0802 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0802 .pq-flora{position:absolute;left:0;bottom:3px;z-index:1;}
        .pq0802 .pq-house{position:absolute;right:4px;bottom:46px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0802 .pq-treewrap{position:absolute;left:12px;bottom:34px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0802 .pq-henw{position:absolute;left:248px;bottom:8px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0802 .pq-hd{transform-box:view-box;transform-origin:19px 25px;animation:pqPeck 2.7s ease-in-out infinite;}
        .pq0802 .pq-grain{position:absolute;left:216px;bottom:9px;z-index:1;}
        .pq0802 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;animation-delay:-1.3s;}
        .pq0802 .pq-apw{position:absolute;font-size:22px;line-height:1;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0802 .pq-sway{display:inline-block;animation:pqSwayA 3.4s ease-in-out infinite;}
        .pq0802 .pq-fallw{animation:pqFall 1.5s ease-in both;z-index:3;}
        .pq0802 .pq-scene.still .pq-fallw{animation:none;transform:translate(var(--dx),var(--dy)) rotate(var(--rot));}
        .pq0802 .pq-scene.still .pq-wind{display:none;}
        .pq0802 .pq-wind{position:absolute;left:148px;top:32px;z-index:3;animation:pqWind 1.7s ease-in-out .35s both;}
        .pq0802 .pq-cnt{position:absolute;top:-9px;right:-9px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0802 .pq-q{position:absolute;left:216px;top:52px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#3e8e46;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(62,142,70,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:3;}
        .pq0802 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0802 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0802 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0802 .pq-opt:hover:not(:disabled){border-color:#b3d9b7;transform:translateY(-2px);}
        .pq0802 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0802 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0802 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0802 .pq-opt:disabled{cursor:default;}
        .pq0802 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0802 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0802 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqPeck{0%,52%,100%{transform:rotate(0);}62%{transform:rotate(-24deg);}70%{transform:rotate(-5deg);}78%{transform:rotate(-20deg);}88%{transform:rotate(0);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqSwayA{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-2px) rotate(-3deg);}}
        @keyframes pqFall{0%{transform:translate(0,0) rotate(0deg);}48%{transform:translate(calc(var(--dx)*.15),var(--dy)) rotate(calc(var(--rot)*.35));}64%{transform:translate(calc(var(--dx)*.5),calc(var(--dy) - 12px)) rotate(calc(var(--rot)*.6));}80%{transform:translate(calc(var(--dx)*.82),var(--dy)) rotate(calc(var(--rot)*.85));}100%{transform:translate(var(--dx),var(--dy)) rotate(var(--rot));}}
        @keyframes pqWind{0%{opacity:0;transform:translateX(-26px);}25%{opacity:.9;}70%{opacity:.9;}100%{opacity:0;transform:translateX(36px);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 236 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '') + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" /><span className="pq-grass" />
        <svg className="pq-flora" viewBox="0 0 360 18" width="360" height="18" aria-hidden="true">
          <path d="M16 16 q3 -9 5 -1 M26 17 q3 -10 6 -1 M206 16 q3 -9 5 -1 M338 17 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="308" y1="17" x2="308" y2="9" stroke="#5ea44d" strokeWidth="2" /><circle cx="308" cy="7" r="3.2" fill="#e88bb1" /><circle cx="308" cy="7" r="1.3" fill="#b1487a" /></g>
        </svg>
        <span className="pq-house"><House /></span>
        <div className="pq-treewrap"><Tree /></div>

        {/* Don-dog' — tovuq cho'qiydigan donlar (dekor, sanalmaydi) */}
        <svg className="pq-grain" viewBox="0 0 36 10" width="36" height="10" aria-hidden="true">
          <circle cx="4" cy="6" r="1.6" fill="#d9a441" /><circle cx="11" cy="8" r="1.5" fill="#b97c14" />
          <circle cx="18" cy="5" r="1.6" fill="#d9a441" /><circle cx="25" cy="7.5" r="1.5" fill="#b97c14" />
          <circle cx="32" cy="5.5" r="1.6" fill="#d9a441" />
        </svg>
        {/* Tovuq — dekor-jonlantirish (kanon), savolga aloqasi yo'q, badge chiqmaydi */}
        <span className="pq-henw"><Hen /></span>

        {/* Shamol chiziqlari — sahna ochilganda bir marta (still holatida yo'q) */}
        <svg className="pq-wind" viewBox="0 0 92 42" width="92" height="42" aria-hidden="true">
          <path d="M4 12 Q30 3 56 11 Q70 15 64 22" stroke="#a8cfee" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M14 28 Q40 20 66 28 Q80 32 74 38" stroke="#bcd9f1" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".8" />
        </svg>

        {/* Daraxtda qoladigan 4 olma — g'alabada 1..4 badge faqat shularda */}
        {STAY.map((p, i) => (
          <span key={'s' + i} className="pq-apw" style={{ left: p.x, top: p.y }}>
            <span className="pq-sway" style={{ animationDelay: `${-i * 0.8}s` }}>🍎</span>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
          </span>
        ))}
        {/* Tushadigan 2 olma — birin-ketin uziladi, yerda dumalab to'xtaydi; xira EMAS, badge YO'Q */}
        {FALL.map((p, i) => (
          <span key={'f' + i} className="pq-apw pq-fallw"
            style={{ left: p.x, top: p.y, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg`, animationDelay: `${p.delay}s` }}>
            🍎
          </span>
        ))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.start} − {DATA.gone} = {DATA.target}</span>}
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
