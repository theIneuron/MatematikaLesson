// Dars35 · Amaliyot 05 — «Qaysi og'irroq?» · Blok 7 massa · Massa — kilogramm · 🟡 · tag: size_not_mass
// TABIAT SAHNASI (Dars15 kabi) + BRONZA TURAR TAROZI (Dars12/Dars35 kanoni).
// FIZIK ANIMATSIYA: KATTA plyaj to'pi chap pallaga, KICHIK metall gir o'ng pallaga TUSHADI; nur og'ir (gir) tomonga EGILADI.
// Distraktor: katta to'p — «katta = og'ir» (M1) tushunmovchiligiga qarshi; hajm emas, tarozi og'irlikni ko'rsatadi.
// Ikkala narsa bosiladi (SVG ichida); to'g'ri = kichik metall gir (past palla). VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida.
// REVIEW/.still: yakuniy holat (narsalar joyida, nur egilgan), animatsiyasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 'weight'; // kichik metall gir — og'irroq (past palla)
const DATA = { target: TARGET, options: ['ball', 'weight'], level: '🟡', tag: 'size_not_mass' };

const T = {
  uz: {
    eyebrow: "Massa · Kilogramm", title: "Tarozi",
    ask: "Qaysi og'irroq?",
    correct: "Katta narsa yengil bo'lishi mumkin — tarozi ko'rsatadi.",
    hint: "Hajm emas — tarozi og'irlikni ko'rsatadi.",
    l_ball: "to'p", l_weight: "tosh",
  },
  ru: {
    eyebrow: "Масса · Килограмм", title: "Весы",
    ask: "Что тяжелее?",
    correct: "Большой предмет может быть лёгким — весы показывают.",
    hint: "Не размер — весы показывают вес.",
    l_ball: "мяч", l_weight: "гиря",
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

// Plyaj to'pi segmentlari (rangli bo'laklar) — markaz (0,0), radius R.
const ballWedges = (R) => {
  const cols = ['#ff5d5d', '#ffffff', '#37a9ff', '#ffffff', '#ffd23f', '#ffffff'];
  const segs = [];
  for (let i = 0; i < 6; i++) {
    const a0 = (-90 + i * 60) * Math.PI / 180, a1 = (-90 + (i + 1) * 60) * Math.PI / 180;
    const x0 = R * Math.cos(a0), y0 = R * Math.sin(a0);
    const x1 = R * Math.cos(a1), y1 = R * Math.sin(a1);
    segs.push({ d: `M0 0 L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`, c: cols[i] });
  }
  return segs;
};

// KATTA plyaj to'pi — hajmli (segmentlar + radial yorug'lik qatlami + soya). (0,0) = to'p TAGI.
const BALL_R = 25;
const BeachBall = () => {
  const wedges = ballWedges(BALL_R);
  return (
    <g>
      <ellipse cx="0" cy="0" rx="18" ry="3" fill="rgba(58,53,48,.15)" />
      <g transform={`translate(0 ${-BALL_R})`}>
        <circle r={BALL_R} fill="#fff" />
        {wedges.map((w, i) => (<path key={i} d={w.d} fill={w.c} />))}
        <circle r={BALL_R} fill="url(#b05shine)" />
        <circle r={BALL_R} fill="none" stroke="#c9d2db" strokeWidth="1.6" />
        <ellipse cx="-9" cy="-10" rx="7" ry="4.4" fill="rgba(255,255,255,.6)" />
      </g>
    </g>
  );
};

// KICHIK metall GIR — haqiqiy tarozi toshi (gradient, dastali, yaltiroq qirra). (0,0) = tosh TAGI.
const SmallGir = () => (
  <g>
    <ellipse cx="0" cy="0" rx="13" ry="2.4" fill="rgba(58,53,48,.18)" />
    <path d="M-7 -24 a7 7 0 0 1 14 0" fill="none" stroke="#6A7078" strokeWidth="3.4" />
    <path d="M-11 -24 h22 l3 20 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4Z" fill="url(#b05gir)" stroke="#565B62" strokeWidth="1" />
    <path d="M-9 -23 h5 l-2 26 h-1 a3 3 0 0 1 -3 -3Z" fill="rgba(255,255,255,.26)" />
    <text x="0" y="-8" fontSize="11" textAnchor="middle" fill="#fff" fontWeight="800" fontFamily="'JetBrains Mono',monospace">1</text>
    <text x="0" y="-1.5" fontSize="5.5" textAnchor="middle" fill="rgba(255,255,255,.92)" fontFamily="'JetBrains Mono',monospace">kg</text>
  </g>
);

// BRONZA TAROZI: nur sharnirda aylanadi (STATE + transition), pallalar counter-rotate bilan TIK.
// dropN — nechta narsa tushgan; narsalar bosiladi (onPick), tanlov/g'alaba halqalari SVG ichida.
const PIVOT_X = 170, PIVOT_Y = 56, ARM = 100, PAN_Y = 96;
const BrassBalance = ({ tilt, dropN, picked, ok, lock, onPick, t }) => {
  const ax = PIVOT_X - ARM, bx = PIVOT_X + ARM;
  const Cords = ({ x }) => (
    <g stroke="#9C7A38" strokeWidth="1.6" fill="none">
      <line x1={x} y1={PIVOT_Y + 3} x2={x - 28} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x + 28} y2={PAN_Y - 2} />
      <circle cx={x} cy={PIVOT_Y + 3} r="2.8" fill="#B8954E" stroke="none" />
    </g>
  );
  const Pan = ({ x }) => (
    <g>
      <path d={`M${x - 33} ${PAN_Y} Q${x} ${PAN_Y + 24} ${x + 33} ${PAN_Y} Z`} fill="url(#b05pan)" stroke="#9C7A38" strokeWidth="1.6" />
      <ellipse cx={x} cy={PAN_Y} rx="33" ry="5" fill="url(#b05rim)" stroke="#9C7A38" strokeWidth="1.4" />
    </g>
  );
  const selBall = picked === 'ball' && !ok, selW = picked === 'weight' && !ok;
  return (
    <svg viewBox="0 0 340 240" width="100%" role="img" aria-label="tarozi" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="b05brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0DCAE" /><stop offset=".5" stopColor="#D8B878" /><stop offset="1" stopColor="#A8843E" /></linearGradient>
        <linearGradient id="b05post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A8843E" /><stop offset=".42" stopColor="#E8C98A" /><stop offset=".58" stopColor="#D8B878" /><stop offset="1" stopColor="#9A7634" /></linearGradient>
        <linearGradient id="b05pan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8D2A0" /><stop offset=".55" stopColor="#D7B87A" /><stop offset="1" stopColor="#B5914E" /></linearGradient>
        <linearGradient id="b05rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBCF" /><stop offset="1" stopColor="#D7B87A" /></linearGradient>
        <radialGradient id="b05knob" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F3E5C2" /><stop offset="1" stopColor="#B8954E" /></radialGradient>
        <linearGradient id="b05gir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFD4DA" /><stop offset=".45" stopColor="#8A9099" /><stop offset="1" stopColor="#565B63" /></linearGradient>
        <radialGradient id="b05shine" cx="34%" cy="28%" r="80%"><stop offset="0" stopColor="rgba(255,255,255,.55)" /><stop offset=".45" stopColor="rgba(255,255,255,0)" /><stop offset="1" stopColor="rgba(40,40,60,.18)" /></radialGradient>
      </defs>
      <ellipse cx="170" cy="233" rx="80" ry="7" fill="rgba(40,60,30,.18)" />
      <rect x="118" y="218" width="104" height="13" rx="6.5" fill="url(#b05brass)" stroke="#9A7634" strokeWidth="1.2" />
      <rect x="146" y="209" width="48" height="10" rx="5" fill="url(#b05brass)" stroke="#9A7634" strokeWidth="1" />
      <rect x="163" y="70" width="14" height="142" rx="6" fill="url(#b05post)" stroke="#9A7634" strokeWidth="1" />
      <path d={`M${PIVOT_X} 44 L154 72 L186 72 Z`} fill="#B8954E" stroke="#9A7634" strokeWidth="1" />
      <g className="pq-beam" transform={`rotate(${tilt} ${PIVOT_X} ${PIVOT_Y})`}>
        <rect x={ax - 8} y={PIVOT_Y - 5} width={ARM * 2 + 16} height="10" rx="5" fill="url(#b05brass)" stroke="#9A7634" strokeWidth="1.2" />
        {/* CHAP: KATTA to'p (yengil → yuqorida) — bosiladi */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${ax} ${PIVOT_Y})`}>
          <Cords x={ax} />
          <Pan x={ax} />
          {dropN >= 1 && (
            <g className={'pq-objbtn pq-drop' + (lock ? ' lk' : '') + (ok ? ' dm' : '')} onClick={lock ? undefined : () => onPick('ball')}>
              {selBall && <circle cx={ax} cy={PAN_Y - 26} r="31" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 5" />}
              <g transform={`translate(${ax} ${PAN_Y - 1})`}><BeachBall /></g>
            </g>
          )}
          {ok && <text x={ax} y={PAN_Y + 40} textAnchor="middle" fontSize="13" fontWeight="800" fill="#5c6672" fontFamily="Manrope,sans-serif">{t.l_ball}</text>}
        </g>
        {/* O'NG: KICHIK metall gir (og'ir → pastda) — bosiladi = TO'G'RI */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${bx} ${PIVOT_Y})`}>
          <Cords x={bx} />
          <Pan x={bx} />
          {dropN >= 2 && (
            <g className={'pq-objbtn pq-drop' + (lock ? ' lk' : '')} onClick={lock ? undefined : () => onPick('weight')}>
              {selW && <circle cx={bx} cy={PAN_Y - 15} r="22" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 5" />}
              {ok && <circle cx={bx} cy={PAN_Y - 15} r="22" fill="none" stroke="#1a7f43" strokeWidth="3" />}
              <g transform={`translate(${bx} ${PAN_Y - 1})`}><SmallGir /></g>
              {ok && <g transform={`translate(${bx + 22} ${PAN_Y - 34})`}><circle r="10" fill="#1a7f43" /><path d="M-4.5 0 l3.2 3.2 l6 -6.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>}
            </g>
          )}
          {ok && <text x={bx} y={PAN_Y + 40} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1a7f43" fontFamily="Manrope,sans-serif">{t.l_weight}</text>}
        </g>
      </g>
      <circle cx={PIVOT_X} cy={PIVOT_Y} r="9" fill="url(#b05knob)" stroke="#9A7634" strokeWidth="1.2" />
    </svg>
  );
};

export default function D35_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Kirish xronikasi: 1 — to'p tushdi, 2 — gir tushdi, 3 — nur egildi. still → darrov yakuniy.
  const [stage, setStage] = useState(still ? 3 : 0);

  useEffect(() => {
    if (still) { setStage(3); return; }
    const t1 = setTimeout(() => setStage(1), 350);
    const t2 = setTimeout(() => setStage(2), 900);
    const t3 = setTimeout(() => setStage(3), 1650);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: ['ball', 'weight'], studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  // Gir (o'ng) og'ir → nur o'ngga egiladi. STATE + transition = silliq fizik harakat.
  const tilt = stage >= 3 ? 9 : 0;

  return (
    <div className={"pq pq3505" + (still ? " still" : "")}>
      <style>{`
        .pq3505.still *{animation:none !important;transition:none !important;}
        .pq3505{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3505 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3505 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3505 .pq-ask{display:block;font-size:20px;font-weight:800;}
        /* ===== TABIAT SAHNASI (Dars15 kanoni) ===== */
        .pq3505 .pq-scene{position:relative;width:404px;max-width:100%;height:330px;margin:0 auto;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3505 .pq-sun{position:absolute;top:16px;left:20px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3505sun 4s ease-in-out infinite;z-index:1;}
        .pq3505 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3505 .pq-cloud::before,.pq3505 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3505 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3505 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3505 .pq-cloud.c1{top:30px;left:60%;width:46px;animation:pq3505drift 14s ease-in-out infinite;}
        .pq3505 .pq-cloud.c2{top:62px;left:30%;width:34px;transform:scale(.8);animation:pq3505drift 18s ease-in-out infinite reverse;}
        .pq3505 .pq-hills{position:absolute;left:0;right:0;bottom:80px;height:64px;z-index:1;}
        .pq3505 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3505 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3505 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq3505 .pq-hills span:nth-child(3){left:32%;width:40%;height:46px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3505 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:88px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3505 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3505 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3505 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3505 .pq-flower.f1{left:9%;bottom:62px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3505 .pq-flower.f2{right:8%;bottom:56px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3505 .pq-flower.f3{left:19%;bottom:26px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3505 .pq-flower.f4{right:18%;bottom:22px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3505 .pq-tuft{position:absolute;z-index:3;}
        .pq3505 .pq-tuft.t1{left:27%;bottom:58px;} .pq3505 .pq-tuft.t2{right:27%;bottom:64px;transform:scale(.85);}
        .pq3505 .pq-tree{position:absolute;left:8px;bottom:74px;width:46px;height:56px;z-index:2;}
        .pq3505 .pq-tree i{position:absolute;}
        .pq3505 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3505 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3505 .pq-bush{position:absolute;right:12px;bottom:70px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3505 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3505 .pq-bfly::before,.pq3505 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3505 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3505wing .26s ease-in-out infinite alternate;}
        .pq3505 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3505wing .26s ease-in-out infinite alternate;}
        .pq3505 .pq-bfly.bf1::before,.pq3505 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3505 .pq-bfly.bf2::before,.pq3505 .pq-bfly.bf2::after{background:#8ec6ff;}
        .pq3505 .pq-bfly.bf1{top:96px;left:14%;animation:pq3505flit1 8s ease-in-out infinite;}
        .pq3505 .pq-bfly.bf2{top:120px;right:12%;animation:pq3505flit2 9s ease-in-out infinite;}
        .pq3505 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3505 .pq-bird.b1{top:24px;left:42%;animation:pq3505bird 7s ease-in-out infinite;}
        .pq3505 .pq-bird.b2{top:44px;left:58%;transform:scale(.78);animation:pq3505bird 9s ease-in-out infinite;}
        .pq3505 .pq-badge{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:11px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fff3df;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 9px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3505 .pq-balwrap{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);width:330px;max-width:92%;z-index:4;}
        .pq3505 .pq-beam,.pq3505 .pq-arm{transition:transform .9s cubic-bezier(.34,1.25,.45,1);}
        .pq3505 .pq-drop{animation:pq3505drop .55s cubic-bezier(.34,1.35,.5,1) both;}
        .pq3505 .pq-objbtn{cursor:pointer;}
        .pq3505 .pq-objbtn.lk{cursor:default;pointer-events:none;}
        .pq3505 .pq-objbtn.dm{opacity:.45;filter:saturate(.6);}
        .pq3505 .pq-spark{position:absolute;z-index:8;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3505tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3505 .pq-spark.s2{animation-delay:-.6s;} .pq3505 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3505.still .pq-spark{opacity:1;}
        .pq3505 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3505in .22s ease both;}
        .pq3505 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3505 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3505sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3505drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3505wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3505flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3505flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3505bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3505drop{0%{opacity:0;transform:translateY(-96px);}60%{opacity:1;transform:translateY(4px);}80%{transform:translateY(-2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pq3505tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3505in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
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
        <div className="pq-badge">{t.title}</div>

        {/* Katta to'p (yengil) vs kichik gir (og'ir): tushadi → nur gir tomonga egiladi. Ikkala narsa bosiladi. */}
        <div className="pq-balwrap">
          <BrassBalance tilt={tilt} dropN={stage >= 2 ? 2 : stage} picked={picked} ok={!!ok} lock={lock} t={t}
            onPick={(id) => { setPicked(id); setFeedback(null); }} />
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '78%', top: '124px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '64%', top: '162px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '88%', top: '186px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
