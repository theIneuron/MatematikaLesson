// Dars35 · Amaliyot 07 — «Massani qo'shish» · Blok 7 massa · Tarozi + kg toshlari · 🔴 · tag: add_kg
// TABIAT SAHNASI (Dars15 kabi) + BRONZA TURAR TAROZI (Dars12/Dars35 kanoni).
// FIZIK ANIMATSIYA: chap pallaga avval 2 ta MIS gir, keyin 3 ta PO'LAT gir BIRMA-BIR tushadi;
// har toshda nur chapga chuqurroq EGILADI (tarozi «ishlaydi»). Ranglar 2 va 3 guruhlarini ajratadi.
// Matnli variantlar: '1 kg' (ayirdi), '5 kg' TO'G'RI (index 1, chapda emas), '6 kg' (adashdi). uL kg→кг (ru).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida. REVIEW/.still: yakuniy holat, animatsiyasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// 2 kg + 3 kg = 5 kg. Variantlar kg bo'yicha; TO'G'RI 5 (index 1 — chapda emas).
const A = 2, B = 3, SUM = 5;
const OPTIONS = [{ kg: 1 }, { kg: 5 }, { kg: 6 }]; // TO'G'RI kg=5 (index 1)
const CORRECT = 5;
const DATA = { a: A, b: B, sum: SUM, unit: 'kg', options: OPTIONS.map((o) => o.kg), correct: CORRECT, level: '🔴', tag: 'add_kg' };

const T = {
  uz: {
    eyebrow: "Massa · Qo'shish", title: "Tarozi · kg",
    ask: "2 kg va 3 kg. Jami necha kg?",
    correct: "Barakalla! 2 kg + 3 kg = 5 kg.",
    hint: "Tarozidagi toshlarni sanang: 2 va yana 3.",
  },
  ru: {
    eyebrow: "Масса · Сложение", title: "Весы · кг",
    ask: "2 кг и 3 кг. Сколько всего кг?",
    correct: "Молодец! 2 кг + 3 кг = 5 кг.",
    hint: "Посчитай гирьки на весах: 2 и ещё 3.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// 1-kg GIR — metall tarozi toshi (gradient, dastali, '1' yozuvli). tone: 'a' = mis (2 kg guruhi), 'b' = po'lat (3 kg guruhi).
const Gir = ({ x, y, s = 1, tone = 'b' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-7 -24 a7 7 0 0 1 14 0" fill="none" stroke={tone === 'a' ? '#8A6A38' : '#6A7078'} strokeWidth="3.4" />
    <path d="M-11 -24 h22 l3 20 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4Z" fill={tone === 'a' ? 'url(#b07girA)' : 'url(#b07girB)'} stroke={tone === 'a' ? '#7A5A28' : '#565B62'} strokeWidth="1" />
    <path d="M-9 -23 h5 l-2 26 h-1 a3 3 0 0 1 -3 -3Z" fill="rgba(255,255,255,.26)" />
    <text x="0" y="-7" fontSize="11" textAnchor="middle" fill="#fff" fontWeight="800" fontFamily="'JetBrains Mono',monospace">1</text>
  </g>
);

// Chap palladagi joylashuv: chapda 2 ta MIS gir (birinchi guruh), o'ngda 3 ta PO'LAT gir (ikkinchi guruh) — sanaladi.
const STACK = [
  { dx: -26, dy: -1, tone: 'a' }, { dx: -12, dy: -1, tone: 'a' },
  { dx: 4, dy: -1, tone: 'b' }, { dx: 18, dy: -1, tone: 'b' }, { dx: 11, dy: -19, tone: 'b' },
];

// BRONZA TAROZI: nur sharnirda aylanadi (STATE + transition), pallalar counter-rotate bilan TIK.
const PIVOT_X = 170, PIVOT_Y = 56, ARM = 100, PAN_Y = 96;
const BrassBalance = ({ tilt, shown, won, uL }) => {
  const ax = PIVOT_X - ARM, bx = PIVOT_X + ARM;
  const Cords = ({ x }) => (
    <g stroke="#9C7A38" strokeWidth="1.6" fill="none">
      <line x1={x} y1={PIVOT_Y + 3} x2={x - 28} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x + 28} y2={PAN_Y - 2} />
      <circle cx={x} cy={PIVOT_Y + 3} r="2.8" fill="#B8954E" stroke="none" />
    </g>
  );
  const Pan = ({ x, w }) => (
    <g>
      <path d={`M${x - 34} ${PAN_Y} Q${x} ${PAN_Y + 24} ${x + 34} ${PAN_Y} Z`} fill="url(#b07pan)" stroke={w ? '#1a7f43' : '#9C7A38'} strokeWidth="1.6" />
      <ellipse cx={x} cy={PAN_Y} rx="34" ry="5" fill="url(#b07rim)" stroke={w ? '#1a7f43' : '#9C7A38'} strokeWidth="1.4" />
    </g>
  );
  return (
    <svg viewBox="0 0 340 240" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="b07brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0DCAE" /><stop offset=".5" stopColor="#D8B878" /><stop offset="1" stopColor="#A8843E" /></linearGradient>
        <linearGradient id="b07post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A8843E" /><stop offset=".42" stopColor="#E8C98A" /><stop offset=".58" stopColor="#D8B878" /><stop offset="1" stopColor="#9A7634" /></linearGradient>
        <linearGradient id="b07pan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8D2A0" /><stop offset=".55" stopColor="#D7B87A" /><stop offset="1" stopColor="#B5914E" /></linearGradient>
        <linearGradient id="b07rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBCF" /><stop offset="1" stopColor="#D7B87A" /></linearGradient>
        <radialGradient id="b07knob" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F3E5C2" /><stop offset="1" stopColor="#B8954E" /></radialGradient>
        <linearGradient id="b07girA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EBC9A2" /><stop offset=".45" stopColor="#C08A4E" /><stop offset="1" stopColor="#8A5A28" /></linearGradient>
        <linearGradient id="b07girB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFD4DA" /><stop offset=".45" stopColor="#8A9099" /><stop offset="1" stopColor="#565B63" /></linearGradient>
      </defs>
      <ellipse cx="170" cy="233" rx="80" ry="7" fill="rgba(40,60,30,.18)" />
      <rect x="118" y="218" width="104" height="13" rx="6.5" fill="url(#b07brass)" stroke="#9A7634" strokeWidth="1.2" />
      <rect x="146" y="209" width="48" height="10" rx="5" fill="url(#b07brass)" stroke="#9A7634" strokeWidth="1" />
      <rect x="163" y="70" width="14" height="142" rx="6" fill="url(#b07post)" stroke="#9A7634" strokeWidth="1" />
      <path d={`M${PIVOT_X} 44 L154 72 L186 72 Z`} fill="#B8954E" stroke="#9A7634" strokeWidth="1" />
      <g className="pq-beam" transform={`rotate(${tilt} ${PIVOT_X} ${PIVOT_Y})`}>
        <rect x={ax - 8} y={PIVOT_Y - 5} width={ARM * 2 + 16} height="10" rx="5" fill="url(#b07brass)" stroke="#9A7634" strokeWidth="1.2" />
        {/* CHAP palla: 2 mis + 3 po'lat gir (og'ir → pastga) */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${ax} ${PIVOT_Y})`}>
          <Cords x={ax} />
          <Pan x={ax} w={won} />
          {STACK.slice(0, shown).map((p, i) => (
            <g key={i} className="pq-drop"><Gir x={ax + p.dx} y={PAN_Y + p.dy} s={0.66} tone={p.tone} /></g>
          ))}
          {won && <text x={ax} y={PAN_Y + 40} textAnchor="middle" fontSize="14" fontWeight="800" fill="#1a7f43" fontFamily="Manrope,sans-serif">{uL(SUM + ' kg')}</text>}
        </g>
        {/* O'NG palla — bo'sh (yengil → yuqorida) */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${bx} ${PIVOT_Y})`}>
          <Cords x={bx} />
          <Pan x={bx} w={false} />
        </g>
      </g>
      <circle cx={PIVOT_X} cy={PIVOT_Y} r="9" fill="url(#b07knob)" stroke="#9A7634" strokeWidth="1.2" />
    </svg>
  );
};

export default function D35_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Kirish xronikasi: 2 mis gir, so'ng 3 po'lat gir birma-bir tushadi (0..5). still → darrov 5.
  const [shown, setShown] = useState(still ? A + B : 0);

  useEffect(() => {
    if (still) { setShown(A + B); return; }
    const timers = [];
    for (let i = 0; i < A; i++) timers.push(setTimeout(() => setShown(i + 1), 350 + i * 420));
    for (let i = 0; i < B; i++) timers.push(setTimeout(() => setShown(A + i + 1), 350 + A * 420 + 400 + i * 420));
    return () => timers.forEach(clearTimeout);
  }, [still]);

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  // RU uchun birlik lokalizatsiyasi (id/mantiq lotin qoladi).
  const uL = (s) => (lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS.map((o) => `${o.kg} kg`), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  // Har tushgan tosh nurni chapga chuqurroq egadi (tarozi «ishlaydi»). Yakuniy −9°.
  const tilt = -Math.min(9, shown * 1.8);

  return (
    <div className={"pq pq3507" + (still ? " still" : "")}>
      <style>{`
        .pq3507.still *{animation:none !important;transition:none !important;}
        .pq3507{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3507 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3507 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3507 .pq-ask{display:block;font-size:20px;font-weight:800;}
        /* ===== TABIAT SAHNASI (Dars15 kanoni) ===== */
        .pq3507 .pq-scene{position:relative;width:404px;max-width:100%;height:330px;margin:0 auto;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3507 .pq-sun{position:absolute;top:16px;left:20px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3507sun 4s ease-in-out infinite;z-index:1;}
        .pq3507 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3507 .pq-cloud::before,.pq3507 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3507 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3507 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3507 .pq-cloud.c1{top:30px;left:60%;width:46px;animation:pq3507drift 14s ease-in-out infinite;}
        .pq3507 .pq-cloud.c2{top:62px;left:30%;width:34px;transform:scale(.8);animation:pq3507drift 18s ease-in-out infinite reverse;}
        .pq3507 .pq-hills{position:absolute;left:0;right:0;bottom:80px;height:64px;z-index:1;}
        .pq3507 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3507 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3507 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq3507 .pq-hills span:nth-child(3){left:32%;width:40%;height:46px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3507 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:88px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3507 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3507 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3507 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3507 .pq-flower.f1{left:9%;bottom:62px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3507 .pq-flower.f2{right:8%;bottom:56px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3507 .pq-flower.f3{left:19%;bottom:26px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3507 .pq-flower.f4{right:18%;bottom:22px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3507 .pq-tuft{position:absolute;z-index:3;}
        .pq3507 .pq-tuft.t1{left:27%;bottom:58px;} .pq3507 .pq-tuft.t2{right:27%;bottom:64px;transform:scale(.85);}
        .pq3507 .pq-tree{position:absolute;left:8px;bottom:74px;width:46px;height:56px;z-index:2;}
        .pq3507 .pq-tree i{position:absolute;}
        .pq3507 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3507 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3507 .pq-bush{position:absolute;right:12px;bottom:70px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3507 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3507 .pq-bfly::before,.pq3507 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3507 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3507wing .26s ease-in-out infinite alternate;}
        .pq3507 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3507wing .26s ease-in-out infinite alternate;}
        .pq3507 .pq-bfly.bf1::before,.pq3507 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3507 .pq-bfly.bf2::before,.pq3507 .pq-bfly.bf2::after{background:#8ec6ff;}
        .pq3507 .pq-bfly.bf1{top:96px;left:14%;animation:pq3507flit1 8s ease-in-out infinite;}
        .pq3507 .pq-bfly.bf2{top:120px;right:12%;animation:pq3507flit2 9s ease-in-out infinite;}
        .pq3507 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3507 .pq-bird.b1{top:24px;left:42%;animation:pq3507bird 7s ease-in-out infinite;}
        .pq3507 .pq-bird.b2{top:44px;left:58%;transform:scale(.78);animation:pq3507bird 9s ease-in-out infinite;}
        .pq3507 .pq-badge{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:11px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fff3df;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 9px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3507 .pq-balwrap{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);width:330px;max-width:92%;z-index:4;}
        .pq3507 .pq-beam,.pq3507 .pq-arm{transition:transform .8s cubic-bezier(.34,1.25,.45,1);}
        .pq3507 .pq-drop{animation:pq3507drop .5s cubic-bezier(.34,1.35,.5,1) both;}
        /* variantlar + feedback */
        .pq3507 .pq-opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px;max-width:404px;margin-left:auto;margin-right:auto;}
        .pq3507 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:14px;background:#fff;border:3px solid #d6dae3;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(60,90,50,.1);font-size:19px;font-weight:800;color:#374151;letter-spacing:.02em;}
        .pq3507 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq3507 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3507 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3507 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3507cele .5s ease;}
        .pq3507 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3507 .pq-opt:disabled{cursor:default;}
        .pq3507 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3507pop .45s ease both;}
        .pq3507.still .pq-tick{animation:none;opacity:1;}
        .pq3507 .pq-spark{position:absolute;z-index:8;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3507tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3507 .pq-spark.s2{animation-delay:-.6s;} .pq3507 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3507.still .pq-spark{opacity:1;}
        .pq3507 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3507in .22s ease both;}
        .pq3507 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3507 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3507sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3507drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3507wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3507flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3507flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3507bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3507drop{0%{opacity:0;transform:translateY(-96px);}60%{opacity:1;transform:translateY(4px);}80%{transform:translateY(-2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pq3507pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3507tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3507cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3507in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <Bird cls="b1" /><Bird cls="b2" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-hills"><span /><span /><span /></div>
        <div className="pq-grass" />
        <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /></div>
        <span className="pq-bush" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-badge">{uL(t.title)}</div>

        {/* 2 mis + 3 po'lat gir birma-bir tushadi, nur har toshda egiladi = DATA halol sanaladi */}
        <div className="pq-balwrap"><BrassBalance tilt={tilt} shown={shown} won={!!ok} uL={uL} /></div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '120px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '28%', top: '160px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '8%', top: '184px' }}>{'✦'}</span>
        </>)}
      </div>

      {/* Matnli variantlar: to'g'ri (5 kg) chapda emas; g'alabagacha yashil emas; kg RU'da lokalizatsiya (uL) */}
      <div className="pq-opts">
        {OPTIONS.map((o) => {
          const sel = picked === o.kg;
          const right = ok && o.kg === CORRECT;
          const dim = ok && o.kg !== CORRECT;
          return (
            <button
              key={o.kg}
              type="button"
              className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
              disabled={lock}
              onClick={() => { setPicked(o.kg); setFeedback(null); }}
            >
              {uL(`${o.kg} kg`)}
              {right && <span className="pq-tick"><IconOk /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
