// Dars35 · Amaliyot 06 — «Muvozanat» · Blok 7 massa · Ikki pallali tarozi (kg) · 🟡 · tag: balance_equal
// TABIAT SAHNASI (Dars15 kabi) + BRONZA TURAR TAROZI (Dars12/Dars35 kanoni).
// FIZIK ANIMATSIYA: chap pallaga 3 ta 1-kg gir BIRMA-BIR tushadi — nur har toshda chapga EGILADI; o'ng bo'sh.
// G'ALABADA: o'ng pallaga 3 gir TUSHADI va nur silliq TEKISLANADI (muvozanat) + banner.
// Savol: muvozanat uchun o'ngga necha kg? Variantlar '1 kg'/'2 kg'/'3 kg' (TO'G'RI '3 kg', chapda emas).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida. REVIEW/.still: yakuniy holat, animatsiyasiz.
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

const LEFT_KG = 3;
const OPTIONS = [{ id: '1 kg', n: 1 }, { id: '2 kg', n: 2 }, { id: '3 kg', n: 3 }]; // TO'G'RI '3 kg' (index 2, chapda emas)
const CORRECT = '3 kg';
const DATA = { left: LEFT_KG, unit: 'kg', options: OPTIONS.map((o) => o.id), correct: CORRECT, level: '🟡', tag: 'balance_equal' };

const T = {
  uz: {
    eyebrow: 'Massa · Muvozanat', title: 'Muvozanat tarozi',
    ask: "O'ngga necha kg qo'ysak muvozanat bo'ladi?",
    banner: 'Teng — muvozanat',
    correct: 'Teng — muvozanat! Har ikki tomonda 3 kg.',
    hint: "Muvozanat uchun ikki tomon teng bo'lsin. Chapdagi kg ni sanang.",
  },
  ru: {
    eyebrow: 'Масса · Равновесие', title: 'Весы',
    ask: 'Сколько кг нужно справа для равновесия?',
    banner: 'Равно — равновесие',
    correct: 'Равно — равновесие! По 3 кг с каждой стороны.',
    hint: 'Для равновесия обе стороны равны. Сосчитайте, сколько кг слева.',
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

// 1-kg GIR — metall tarozi toshi (gradient, dastali, '1' yozuvli). (x,y) = tosh TAGI markazi.
const Gir = ({ x, y, s = 1, on }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-7 -24 a7 7 0 0 1 14 0" fill="none" stroke={on ? '#1a7f43' : '#6A7078'} strokeWidth="3.4" />
    <path d="M-11 -24 h22 l3 20 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4Z" fill="url(#b06gir)" stroke={on ? '#1a7f43' : '#565B62'} strokeWidth="1.2" />
    <path d="M-9 -23 h5 l-2 26 h-1 a3 3 0 0 1 -3 -3Z" fill="rgba(255,255,255,.26)" />
    <text x="0" y="-7" fontSize="11" textAnchor="middle" fill="#fff" fontWeight="800" fontFamily="'JetBrains Mono',monospace">1</text>
  </g>
);

const STACK3 = [{ dx: -17, dy: -1 }, { dx: 17, dy: -1 }, { dx: 0, dy: -19 }];

// BRONZA TAROZI: nur sharnirda aylanadi (STATE + transition), pallalar counter-rotate bilan TIK.
const PIVOT_X = 170, PIVOT_Y = 56, ARM = 100, PAN_Y = 96;
const BrassBalance = ({ tilt, lShown, rShown, won }) => {
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
      <path d={`M${x - 33} ${PAN_Y} Q${x} ${PAN_Y + 24} ${x + 33} ${PAN_Y} Z`} fill="url(#b06pan)" stroke={w ? '#1a7f43' : '#9C7A38'} strokeWidth="1.6" />
      <ellipse cx={x} cy={PAN_Y} rx="33" ry="5" fill="url(#b06rim)" stroke={w ? '#1a7f43' : '#9C7A38'} strokeWidth="1.4" />
    </g>
  );
  return (
    <svg viewBox="0 0 340 240" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="b06brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0DCAE" /><stop offset=".5" stopColor="#D8B878" /><stop offset="1" stopColor="#A8843E" /></linearGradient>
        <linearGradient id="b06post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A8843E" /><stop offset=".42" stopColor="#E8C98A" /><stop offset=".58" stopColor="#D8B878" /><stop offset="1" stopColor="#9A7634" /></linearGradient>
        <linearGradient id="b06pan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8D2A0" /><stop offset=".55" stopColor="#D7B87A" /><stop offset="1" stopColor="#B5914E" /></linearGradient>
        <linearGradient id="b06rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBCF" /><stop offset="1" stopColor="#D7B87A" /></linearGradient>
        <radialGradient id="b06knob" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F3E5C2" /><stop offset="1" stopColor="#B8954E" /></radialGradient>
        <linearGradient id="b06gir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFD4DA" /><stop offset=".45" stopColor="#8A9099" /><stop offset="1" stopColor="#565B63" /></linearGradient>
      </defs>
      <ellipse cx="170" cy="233" rx="80" ry="7" fill="rgba(40,60,30,.18)" />
      <rect x="118" y="218" width="104" height="13" rx="6.5" fill="url(#b06brass)" stroke="#9A7634" strokeWidth="1.2" />
      <rect x="146" y="209" width="48" height="10" rx="5" fill="url(#b06brass)" stroke="#9A7634" strokeWidth="1" />
      <rect x="163" y="70" width="14" height="142" rx="6" fill="url(#b06post)" stroke="#9A7634" strokeWidth="1" />
      <path d={`M${PIVOT_X} 44 L154 72 L186 72 Z`} fill="#B8954E" stroke="#9A7634" strokeWidth="1" />
      <g className="pq-beam" transform={`rotate(${tilt} ${PIVOT_X} ${PIVOT_Y})`}>
        <rect x={ax - 8} y={PIVOT_Y - 5} width={ARM * 2 + 16} height="10" rx="5" fill="url(#b06brass)" stroke="#9A7634" strokeWidth="1.2" />
        {/* CHAP palla: 3 kg (halol DATA) */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${ax} ${PIVOT_Y})`}>
          <Cords x={ax} />
          <Pan x={ax} w={won} />
          {STACK3.slice(0, lShown).map((p, i) => (
            <g key={i} className="pq-drop"><Gir x={ax + p.dx} y={PAN_Y + p.dy} s={0.72} on={won} /></g>
          ))}
        </g>
        {/* O'NG palla: g'alabagacha bo'sh, so'ng 3 gir tushadi — muvozanat */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${bx} ${PIVOT_Y})`}>
          <Cords x={bx} />
          <Pan x={bx} w={won} />
          {STACK3.slice(0, rShown).map((p, i) => (
            <g key={i} className="pq-drop" style={{ animationDelay: `${i * 0.16}s` }}><Gir x={bx + p.dx} y={PAN_Y + p.dy} s={0.72} on={won} /></g>
          ))}
        </g>
      </g>
      <circle cx={PIVOT_X} cy={PIVOT_Y} r="9" fill="url(#b06knob)" stroke="#9A7634" strokeWidth="1.2" />
    </svg>
  );
};

export default function D35_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const uL = (s) => (lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Kirish xronikasi: chap girlar birma-bir tushadi (0..3). still → darrov 3.
  const [lShown, setLShown] = useState(still ? LEFT_KG : 0);

  useEffect(() => {
    if (still) { setLShown(LEFT_KG); return; }
    const timers = Array.from({ length: LEFT_KG }, (_, i) => setTimeout(() => setLShown(i + 1), 400 + i * 480));
    return () => timers.forEach(clearTimeout);
  }, [still]);

  // RESTORE: tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS.map((o) => uL(o.id)), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t, lang]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;
  // Nur: chap og'ir (har gir bilan chuqurroq); g'alabada 0 (muvozanat, silliq transition).
  const tilt = ok ? 0 : -Math.min(9, lShown * 3);

  const [fitRef, scale] = useFitScale(404);

  return (
    <div className={'pq pq3506' + (still ? ' still' : '')} ref={fitRef}>
      <style>{`
        .pq3506.still *{animation:none !important;transition:none !important;}
        .pq3506{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3506 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3506 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3506 .pq-ask{display:block;font-size:20px;font-weight:800;}
        /* ===== TABIAT SAHNASI (Dars15 kanoni) ===== */
        .pq3506 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:330px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3506 .pq-fit{position:relative;margin:0 auto;}
        .pq3506 .pq-sun{position:absolute;top:16px;left:20px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3506sun 4s ease-in-out infinite;z-index:1;}
        .pq3506 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3506 .pq-cloud::before,.pq3506 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3506 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3506 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3506 .pq-cloud.c1{top:30px;left:60%;width:46px;animation:pq3506drift 14s ease-in-out infinite;}
        .pq3506 .pq-cloud.c2{top:62px;left:30%;width:34px;transform:scale(.8);animation:pq3506drift 18s ease-in-out infinite reverse;}
        .pq3506 .pq-hills{position:absolute;left:0;right:0;bottom:80px;height:64px;z-index:1;}
        .pq3506 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3506 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3506 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq3506 .pq-hills span:nth-child(3){left:32%;width:40%;height:46px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3506 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:88px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3506 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3506 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3506 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3506 .pq-flower.f1{left:9%;bottom:62px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3506 .pq-flower.f2{right:8%;bottom:56px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3506 .pq-flower.f3{left:19%;bottom:26px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3506 .pq-flower.f4{right:18%;bottom:22px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3506 .pq-tuft{position:absolute;z-index:3;}
        .pq3506 .pq-tuft.t1{left:27%;bottom:58px;} .pq3506 .pq-tuft.t2{right:27%;bottom:64px;transform:scale(.85);}
        .pq3506 .pq-tree{position:absolute;left:8px;bottom:74px;width:46px;height:56px;z-index:2;}
        .pq3506 .pq-tree i{position:absolute;}
        .pq3506 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3506 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3506 .pq-bush{position:absolute;right:12px;bottom:70px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3506 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3506 .pq-bfly::before,.pq3506 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3506 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3506wing .26s ease-in-out infinite alternate;}
        .pq3506 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3506wing .26s ease-in-out infinite alternate;}
        .pq3506 .pq-bfly.bf1::before,.pq3506 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3506 .pq-bfly.bf2::before,.pq3506 .pq-bfly.bf2::after{background:#8ec6ff;}
        .pq3506 .pq-bfly.bf1{top:96px;left:14%;animation:pq3506flit1 8s ease-in-out infinite;}
        .pq3506 .pq-bfly.bf2{top:120px;right:12%;animation:pq3506flit2 9s ease-in-out infinite;}
        .pq3506 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3506 .pq-bird.b1{top:24px;left:42%;animation:pq3506bird 7s ease-in-out infinite;}
        .pq3506 .pq-bird.b2{top:44px;left:58%;transform:scale(.78);animation:pq3506bird 9s ease-in-out infinite;}
        .pq3506 .pq-badge{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:11px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fff3df;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 9px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3506 .pq-balwrap{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);width:330px;max-width:92%;z-index:4;}
        .pq3506 .pq-beam,.pq3506 .pq-arm{transition:transform .8s cubic-bezier(.34,1.25,.45,1);}
        .pq3506 .pq-drop{animation:pq3506drop .5s cubic-bezier(.34,1.35,.5,1) both;}
        .pq3506 .pq-win{position:absolute;left:50%;top:44px;transform:translateX(-50%);z-index:6;padding:4px 14px;border-radius:999px;background:#1a7f43;color:#fff;font-size:13px;font-weight:800;white-space:nowrap;box-shadow:0 3px 7px rgba(0,0,0,.2);animation:pq3506popc .45s ease both;}
        .pq3506.still .pq-win{animation:none;opacity:1;}
        .pq3506 .pq-q{position:absolute;left:73%;top:110px;z-index:5;font-size:28px;font-weight:900;color:#2f6bab;text-shadow:0 1px 0 rgba(255,255,255,.6);animation:pq3506bob 1.6s ease-in-out infinite;pointer-events:none;}
        /* variantlar + feedback */
        .pq3506 .pq-opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px;max-width:404px;margin-left:auto;margin-right:auto;}
        .pq3506 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:14px;background:#fff;border:3px solid #d6dae3;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(60,90,50,.1);font-size:19px;font-weight:800;color:#374151;letter-spacing:.02em;}
        .pq3506 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq3506 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3506 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3506 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3506cele .5s ease;}
        .pq3506 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3506 .pq-opt:disabled{cursor:default;}
        .pq3506 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3506pop .45s ease both;}
        .pq3506.still .pq-tick{animation:none;opacity:1;}
        .pq3506 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3506tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3506 .pq-spark.s2{animation-delay:-.6s;} .pq3506 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3506.still .pq-spark{opacity:1;}
        .pq3506 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3506in .22s ease both;}
        .pq3506 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3506 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3506sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3506drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3506wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3506flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3506flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3506bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3506drop{0%{opacity:0;transform:translateY(-96px);}60%{opacity:1;transform:translateY(4px);}80%{transform:translateY(-2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pq3506bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
        @keyframes pq3506pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3506popc{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq3506tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3506cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3506in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{uL(t.ask)}</b></p>

      <div className="pq-fit" style={{ width: 404 * scale, height: 330 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
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
        <div className="pq-badge">{t.title}</div>
        {ok && <div className="pq-win">{t.banner}</div>}

        {/* Chap girlar tushadi (nur egiladi) = DATA; g'alabada o'ngga 3 gir tushadi va nur tekislanadi */}
        <div className="pq-balwrap">
          <BrassBalance tilt={tilt} lShown={lShown} rShown={ok ? LEFT_KG : 0} won={!!ok} />
        </div>
        {idle && <span className="pq-q">?</span>}

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '120px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '130px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '80px' }}>{'✦'}</span>
        </>)}
        </div>
      </div>

      {/* Matnli variantlar (kg RU'da lokal): to'g'ri '3 kg' chapda emas; g'alabagacha yashil emas */}
      <div className="pq-opts">
        {OPTIONS.map((o) => {
          const sel = picked === o.id;
          const right = ok && o.id === CORRECT;
          const dim = ok && o.id !== CORRECT;
          return (
            <button
              key={o.id}
              type="button"
              className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
              disabled={lock}
              onClick={() => { setPicked(o.id); setFeedback(null); }}
            >
              {uL(o.id)}
              {right && <span className="pq-tick"><IconOk /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
