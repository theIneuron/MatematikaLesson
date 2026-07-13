// Dars35 · Amaliyot 09 — «Massa — kilogramm» · Blok 7 massa · Massa masalasi (ayirish) · 🔴 · tag: mass_word
// TABIAT SAHNASI (Dars15 kabi): un qopi maysada turadi, 3 kg li idish chetga olib qo'yiladi. MATH 8−3=5.
// Qopda 8 kg un edi, 3 kg ishlatildi — necha kg qoldi? Qop va idish HAQIQIY (gradient mato, bog'lam, un changi).
// Matnli variantlar: '11 kg' (qo'shib yuborish), '5 kg' TO'G'RI (chapda emas), '3 kg' (ishlatilganni javob deb olish).
// ANSWER-LEAK: 8 va 3 — masala shartidagi berilgan; ko'rsatish halol. Natija 5 g'alabagacha yashirin.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida. REVIEW/.still: yakuniy holat, animatsiyasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const HAD = 8, USED = 3, LEFT = 5;          // 8 − 3 = 5
const MINUS = "−";                          // U+2212, ASCII defis EMAS
const OPTIONS = ["11 kg", "5 kg", "3 kg"];  // TO'G'RI '5 kg' (index 1, chapda emas)
const CORRECT = "5 kg";
const DATA = { had: HAD, used: USED, left: LEFT, unit: "kg", options: OPTIONS, answer: CORRECT, level: "🔴", tag: "mass_word" };

const T = {
  uz: {
    eyebrow: "Massa · Kilogramm",
    title: "Necha kg qoldi?",
    setup: "Qopda 8 kg un edi, 3 kg ishlatildi.",
    ask: "Necha kg qoldi?",
    labelBag: "un",
    correct: "Barakalla! 8 kg − 3 kg = 5 kg.",
    hint: "Ishlatilsa — kamayadi, demak ayiramiz. 8 dan 3 ni ayiring.",
  },
  ru: {
    eyebrow: "Масса · Килограмм",
    title: "Сколько кг осталось?",
    setup: "В мешке было 8 кг муки, 3 кг израсходовали.",
    ask: "Сколько кг осталось?",
    labelBag: "мука",
    correct: "Молодец! 8 кг − 3 кг = 5 кг.",
    hint: "Израсходовали — стало меньше, значит вычитаем. От 8 отними 3.",
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

// UN QOPI: bog'langan bo'yin, gradient matoli tana, buklamalar, un changi, yorliq + massa nishoni. w — kenglik.
const FlourBag = ({ w = 96, label = "un", tag = "8 kg" }) => {
  const h = w * 118 / 96;
  return (
    <svg viewBox="0 0 96 118" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="pq3509bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f0dc" /><stop offset="55%" stopColor="#e4d3ab" /><stop offset="100%" stopColor="#c3ab78" />
        </linearGradient>
        <radialGradient id="pq3509bagHi" cx="34%" cy="26%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,.5)" /><stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {/* soya */}
      <ellipse cx="48" cy="112" rx="34" ry="6" fill="#000" opacity=".12" />
      {/* qop tanasi */}
      <path d="M22,40 Q20,30 30,26 L66,26 Q76,30 74,40 L78,104 Q78,112 70,112 L26,112 Q18,112 18,104 Z"
        fill="url(#pq3509bag)" stroke="#b79c62" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22,40 Q20,30 30,26 L66,26 Q76,30 74,40 L78,104 Q78,112 70,112 L26,112 Q18,112 18,104 Z" fill="url(#pq3509bagHi)" />
      {/* bog'langan bo'yin */}
      <path d="M30,26 Q34,14 48,14 Q62,14 66,26 Z" fill="#eee0bd" stroke="#b79c62" strokeWidth="2" strokeLinejoin="round" />
      <rect x="30" y="24" width="36" height="6" rx="3" fill="#a9863f" />
      <path d="M32,20 Q48,10 64,20" fill="none" stroke="#8a6a2e" strokeWidth="2.4" strokeLinecap="round" />
      {/* buklamalar */}
      <path d="M30,44 Q30,74 32,104" fill="none" stroke="#c7ad74" strokeWidth="1.4" opacity=".6" />
      <path d="M66,44 Q66,74 64,104" fill="none" stroke="#c7ad74" strokeWidth="1.4" opacity=".6" />
      {/* un changi nuqtalari */}
      <g fill="#fffdf5" opacity=".85">
        <circle cx="40" cy="58" r="1.5" /><circle cx="54" cy="66" r="1.3" /><circle cx="46" cy="78" r="1.6" /><circle cx="58" cy="86" r="1.2" />
      </g>
      {/* yorliq */}
      <rect x="30" y="60" width="36" height="20" rx="4" fill="#fff" stroke="#c9b072" strokeWidth="1.4" />
      <text x="48" y="74" textAnchor="middle" fontSize="11" fontWeight="800" fill="#7a5f24" fontFamily="Manrope, sans-serif">{label}</text>
      {/* massa nishoni (berilgan shart — halol) */}
      <g>
        <rect x="30" y="88" width="36" height="16" rx="8" fill="#eef4fb" stroke="#3f7ac0" strokeWidth="1.6" />
        <text x="48" y="100" textAnchor="middle" fontSize="11" fontWeight="900" fill="#2f6bab" fontFamily="Manrope, sans-serif">{tag}</text>
      </g>
    </svg>
  );
};

// Olib qo'yilgan ulush: metall idish (gradient) + un + 3 kg nishoni.
const Scoop = ({ w = 58, tag = "3 kg" }) => {
  const h = w * 60 / 58;
  return (
    <svg viewBox="0 0 58 60" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="pq3509sc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2f7" /><stop offset="55%" stopColor="#d4dde8" /><stop offset="100%" stopColor="#a9b8c8" />
        </linearGradient>
      </defs>
      <ellipse cx="29" cy="55" rx="18" ry="3.6" fill="#000" opacity=".1" />
      <path d="M10,26 L48,26 L44,50 Q44,54 40,54 L18,54 Q14,54 14,50 Z" fill="url(#pq3509sc)" stroke="#9fb0c2" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12,27 L18,27 L16,52 Q14,52 14,49 Z" fill="rgba(255,255,255,.5)" />
      <ellipse cx="29" cy="26" rx="19" ry="5" fill="#f6efdd" stroke="#c9b072" strokeWidth="1.4" />
      <g fill="#fffdf5" opacity=".9"><circle cx="24" cy="24" r="1.4" /><circle cx="34" cy="25" r="1.2" /><circle cx="29" cy="22" r="1.3" /></g>
      <g>
        <rect x="9" y="34" width="40" height="16" rx="8" fill="#fdf0e3" stroke="#c9822f" strokeWidth="1.6" />
        <text x="29" y="46" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b46e1f" fontFamily="Manrope, sans-serif">{tag}</text>
      </g>
    </svg>
  );
};

export default function D35_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const uL = (s) => lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s;

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
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bezak — bosiladigan nishon EMAS)

  return (
    <div className={"pq pq3509" + (still ? " still" : "")}>
      <style>{`
        .pq3509.still *{animation:none !important;transition:none !important;}
        .pq3509{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3509 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3509 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3509 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3509 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        /* ===== TABIAT SAHNASI (Dars15 kanoni) ===== */
        .pq3509 .pq-scene{position:relative;width:404px;max-width:100%;height:300px;margin:0 auto;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3509 .pq-sun{position:absolute;top:16px;left:20px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3509sun 4s ease-in-out infinite;z-index:1;}
        .pq3509 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3509 .pq-cloud::before,.pq3509 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3509 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3509 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3509 .pq-cloud.c1{top:30px;left:60%;width:46px;animation:pq3509drift 14s ease-in-out infinite;}
        .pq3509 .pq-cloud.c2{top:60px;left:30%;width:34px;transform:scale(.8);animation:pq3509drift 18s ease-in-out infinite reverse;}
        .pq3509 .pq-hills{position:absolute;left:0;right:0;bottom:74px;height:62px;z-index:1;}
        .pq3509 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3509 .pq-hills span:nth-child(1){left:-8%;width:52%;height:54px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3509 .pq-hills span:nth-child(2){right:-6%;width:48%;height:62px;}
        .pq3509 .pq-hills span:nth-child(3){left:32%;width:40%;height:44px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3509 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:82px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3509 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3509 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3509 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3509 .pq-flower.f1{left:9%;bottom:58px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3509 .pq-flower.f2{right:8%;bottom:52px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3509 .pq-flower.f3{left:19%;bottom:24px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3509 .pq-flower.f4{right:18%;bottom:20px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3509 .pq-tuft{position:absolute;z-index:3;}
        .pq3509 .pq-tuft.t1{left:27%;bottom:54px;} .pq3509 .pq-tuft.t2{right:27%;bottom:60px;transform:scale(.85);}
        .pq3509 .pq-tree{position:absolute;left:8px;bottom:68px;width:46px;height:56px;z-index:2;}
        .pq3509 .pq-tree i{position:absolute;}
        .pq3509 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3509 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3509 .pq-bush{position:absolute;right:12px;bottom:64px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3509 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3509 .pq-bfly::before,.pq3509 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3509 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3509wing .26s ease-in-out infinite alternate;}
        .pq3509 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3509wing .26s ease-in-out infinite alternate;}
        .pq3509 .pq-bfly.bf1::before,.pq3509 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3509 .pq-bfly.bf2::before,.pq3509 .pq-bfly.bf2::after{background:#8ec6ff;}
        .pq3509 .pq-bfly.bf1{top:92px;left:14%;animation:pq3509flit1 8s ease-in-out infinite;}
        .pq3509 .pq-bfly.bf2{top:114px;right:12%;animation:pq3509flit2 9s ease-in-out infinite;}
        .pq3509 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3509 .pq-bird.b1{top:24px;left:42%;animation:pq3509bird 7s ease-in-out infinite;}
        .pq3509 .pq-bird.b2{top:44px;left:58%;transform:scale(.78);animation:pq3509bird 9s ease-in-out infinite;}
        .pq3509 .pq-badge{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:11px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fff3df;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 9px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* sahna ichidagi masala-arena: qop maysada, idish chetga olib qo'yiladi */
        .pq3509 .pq-arena{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);z-index:4;display:flex;align-items:flex-end;justify-content:center;gap:10px;}
        .pq3509 .pq-bag{transform-origin:50% 100%;}
        .pq3509 .pq-bag.idle{animation:pq3509bob 3s ease-in-out infinite;}
        .pq3509 .pq-mid{display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:none;flex:0 0 auto;width:26px;padding-bottom:34px;}
        .pq3509 .pq-arw{font-size:20px;font-weight:900;color:#c0623a;line-height:1;text-shadow:0 1px 0 rgba(255,255,255,.5);}
        .pq3509 .pq-arw.a2{animation-delay:.35s;}
        .pq3509 .pq-arw.mv{animation:pq3509arw 1.4s ease-in-out infinite;}
        .pq3509 .pq-scoop{padding-bottom:2px;}
        .pq3509 .pq-scoop.idle{animation:pq3509leave 2.6s ease-in-out infinite;transform-origin:50% 50%;}
        /* g'alaba tenglamasi */
        .pq3509 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:12px;flex-wrap:wrap;animation:pq3509in .3s ease both;}
        .pq3509 .pq-eq b{min-width:56px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;white-space:nowrap;}
        .pq3509 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3509 .pq-eq i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}
        /* variantlar + feedback */
        .pq3509 .pq-opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px;max-width:404px;margin-left:auto;margin-right:auto;}
        .pq3509 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:16px 6px;border-radius:14px;background:#fff;border:3px solid #d6dae3;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(60,90,50,.1);font-size:19px;font-weight:800;color:#374151;letter-spacing:.02em;font-variant-numeric:tabular-nums;}
        .pq3509 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq3509 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3509 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3509 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3509cele .5s ease;}
        .pq3509 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3509 .pq-opt:disabled{cursor:default;}
        .pq3509 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3509pop .45s ease both;}
        .pq3509.still .pq-tick{animation:none;opacity:1;}
        .pq3509 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3509tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3509 .pq-spark.s2{animation-delay:-.6s;} .pq3509 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3509.still .pq-spark{opacity:1;}
        .pq3509 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3509in .22s ease both;}
        .pq3509 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3509 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3509sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3509drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3509wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3509flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3509flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3509bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3509bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3509leave{0%{transform:translateX(0) translateY(0);opacity:.95;}50%{transform:translateX(8px) translateY(-5px);opacity:.55;}100%{transform:translateX(0) translateY(0);opacity:.95;}}
        @keyframes pq3509arw{0%,100%{transform:translateX(0);opacity:.5;}50%{transform:translateX(4px);opacity:1;}}
        @keyframes pq3509pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3509tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3509cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3509in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

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

        {/* Un qopi (8 kg — berilgan) maysada → 3 kg olib qo'yiladi (kamayish). Natija 5 g'alabagacha yashirin. */}
        <div className="pq-arena">
          <span className={"pq-bag" + (idle ? " idle" : "")}><FlourBag w={98} label={t.labelBag} tag={uL(HAD + " kg")} /></span>
          <div className="pq-mid" aria-hidden="true">
            <span className={"pq-arw" + (idle ? " mv" : "")}>{"→"}</span>
            <span className={"pq-arw a2" + (idle ? " mv" : "")}>{"→"}</span>
          </div>
          <span className={"pq-scoop" + (idle ? " idle" : "")}><Scoop w={60} tag={uL(USED + " kg")} /></span>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '104px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '120px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '84px' }}>{'✦'}</span>
        </>)}
      </div>

      {/* G'alaba: ishlatilsa AYIRAMIZ — «8 kg − 3 kg = 5 kg» (natija faqat shu yerda ochiladi) */}
      {ok && (
        <div className="pq-eq"><b>{uL(HAD + " kg")}</b><i>{MINUS}</i><b>{uL(USED + " kg")}</b><i>=</i><b className="res">{uL(LEFT + " kg")}</b></div>
      )}

      {/* Matnli variantlar: to'g'ri (5 kg) chapda emas; g'alabagacha yashil emas; kg RU'da uL bilan */}
      <div className="pq-opts">
        {OPTIONS.map((op) => {
          const sel = picked === op;
          const right = ok && op === CORRECT;
          const dim = ok && op !== CORRECT;
          return (
            <button
              key={op}
              type="button"
              className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
              disabled={lock}
              onClick={() => { setPicked(op); setFeedback(null); }}
            >
              {uL(op)}
              {right && <span className="pq-tick"><IconOk /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
