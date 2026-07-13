// Dars31 · Amaliyot 10 — «Yechimni tuzing» ikki qadamli masala «Olma bog'i» · 🔴 · tag: build_solution
// TABIAT SAHNASI (D15_01 etaloni): osmon, quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar, olmali daraxt. Yechim-strip YOG'OCH TAXTACHADA: «5 [op1] 3 [op2] 2 = ?».
// IKKI QADAM: op1 ∈ [+,−] (to'g'ri «+», keldi—qo'shamiz); op2 ∈ [+,−] (to'g'ri «−», ketdi—ayiramiz).
// Maysada 5 olma turadi (idle-bob). G'alaba FAQAT op1='+' VA op2='−' da: +3 olma UCHIB KELADI (arrive),
// so'ng 2 tasi ✕ bilan UCHIB KETADI (gone) -> 6 qoladi; taxtachada natija 6 ochiladi (5 + 3 − 2 = 6).
// Distraktorlar: noto'g'ri op1 -> «Keldi — qo'shamiz»; noto'g'ri op2 -> «Ketdi — ayiramiz».
// Belgi va natija g'alabagacha YASHIRIN. VEDI-DO-VERNOGO: xatoda qulf/retry yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PLUS = '+';
const MINUS = '−'; // U+2212 minus belgisi (ASCII defis EMAS)
const A = 5, B = 3, C = 2, STEP1 = 8, RESULT = 6;   // 5 + 3 = 8, 8 − 2 = 6
const DATA = { a: A, b: B, c: C, step1: STEP1, result: RESULT, op1: PLUS, op2: MINUS, level: '🔴', tag: 'build_solution' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Yechim",
    setup: "Savatda 5 olma bor edi, 3 keldi, 2 ketdi.",
    ask: "Yechimni tuzing.",
    cap1: "1-amal", cap2: "2-amal",
    correct: "Barakalla! 5 + 3 − 2 = 6.",
    hintOp1: "Keldi — ko'paydi, qo'shamiz.",
    hintOp2: "Ketdi — kamaydi, ayiramiz.",
    hint: "Yechimni tuzing.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Решение",
    setup: "В корзине было 5 яблок, пришло 3, ушло 2.",
    ask: "Составь решение.",
    cap1: "1-е действие", cap2: "2-е действие",
    correct: "Молодец! 5 + 3 − 2 = 6.",
    hintOp1: "Пришло — стало больше, складываем.",
    hintOp2: "Ушло — стало меньше, вычитаем.",
    hint: "Составь решение.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (D15_01 etalonidan)
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
// O't tutami (maysada). (D15_01 etalonidan)
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
// Qo'ziqorin (daraxt yonida). (D15_01 etalonidan)
const Mushroom = ({ cls }) => (
  <svg className={'pq-mush ' + cls} viewBox="0 0 18 17" width="16" height="15" aria-hidden="true">
    <rect x="6.4" y="8" width="5.2" height="8" rx="2.2" fill="#f4ecd8" stroke="#dccfa8" strokeWidth=".7" />
    <path d="M1.5 8.5 C1.5 3.5 5 1 9 1 C13 1 16.5 3.5 16.5 8.5 Z" fill="#e0584c" stroke="#bf4136" strokeWidth=".8" />
    <circle cx="5.5" cy="6" r="1.1" fill="#fff" /><circle cx="10.5" cy="4.6" r="1.3" fill="#fff" /><circle cx="12.6" cy="7" r="1" fill="#fff" />
  </svg>
);

// YAKKA OLMA (bitta birlik) — Dars21/29 kanoni: yumaloq tana (radial 2-ton), bandak, barg, oq blik.
const Apple = ({ w = 28 }) => {
  const id = 'pq3110a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

export default function D31_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [op1, setOp1] = useState(null);        // null | '+' | '−'
  const [op2, setOp2] = useState(null);        // null | '+' | '−'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kelish/ketish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { op1, op2 } dan holatni tiklaydi.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.op1 != null) setOp1(initialAnswer.studentAnswer.op1);
      if (initialAnswer.studentAnswer.op2 != null) setOp2(initialAnswer.studentAnswer.op2);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(op1 !== null && op2 !== null && !checked); }, [op1, op2, checked, onReady]);

  const check = useCallback(() => {
    if (op1 === null || op2 === null) return;
    const ok1 = op1 === PLUS;
    const ok2 = op2 === MINUS;
    const correct = ok1 && ok2;
    const msg = correct ? t.correct : (!ok1 ? t.hintOp1 : t.hintOp2);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [PLUS, MINUS], studentAnswer: { op1, op2 }, correctAnswer: { op1: PLUS, op2: MINUS, result: RESULT }, correct, meta: { ...DATA } });
  }, [op1, op2, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (olmalar bosiladigan nishon EMAS — dekor)

  const pick1 = (v) => { if (lock) return; setOp1(v); setFeedback(null); };
  const pick2 = (v) => { if (lock) return; setOp2(v); setFeedback(null); };

  return (
    <div className={"pq pq3110" + (still ? " still" : "")}>
      <style>{`
        .pq3110{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3110 *{box-sizing:border-box;}
        .pq3110.still *{animation:none !important;}
        .pq3110 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3110 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3110 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3110 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3110 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:14px;}
        /* ===== TABIAT SAHNASI (D15_01 etaloni) ===== */
        .pq3110 .pq-scene{position:relative;width:404px;max-width:100%;height:324px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3110 .pq-sun{position:absolute;top:18px;left:22px;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3110Sun 4s ease-in-out infinite;z-index:1;}
        .pq3110 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3110 .pq-cloud::before,.pq3110 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3110 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3110 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3110 .pq-cloud.c1{top:34px;left:58%;width:46px;animation:pq3110Drift 14s ease-in-out infinite;}
        .pq3110 .pq-cloud.c2{top:66px;left:30%;width:34px;transform:scale(.8);animation:pq3110Drift 18s ease-in-out infinite reverse;}
        .pq3110 .pq-cloud.c3{top:18px;left:38%;width:30px;transform:scale(.72);animation:pq3110Drift 16s ease-in-out infinite;}
        .pq3110 .pq-hills{position:absolute;left:0;right:0;bottom:104px;height:70px;z-index:1;}
        .pq3110 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3110 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3110 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq3110 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3110 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:112px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3110 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3110 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;box-shadow:6px 0 0 #fff,-6px 0 0 #fff,0 6px 0 #fff,0 -6px 0 #fff;}
        .pq3110 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3110 .pq-flower.f1{left:16%;bottom:96px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3110 .pq-flower.f2{right:28%;bottom:98px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3110 .pq-flower.f3{left:8%;bottom:88px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3110 .pq-flower.f4{left:90%;bottom:92px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3110 .pq-flower.f5{left:38%;bottom:100px;background:#ff7fa8;box-shadow:5px 0 0 #ff7fa8,-5px 0 0 #ff7fa8,0 5px 0 #ff7fa8,0 -5px 0 #ff7fa8;}
        .pq3110 .pq-flower.f6{left:64%;bottom:96px;transform:scale(.78);background:#8ec6ff;box-shadow:5px 0 0 #8ec6ff,-5px 0 0 #8ec6ff,0 5px 0 #8ec6ff,0 -5px 0 #8ec6ff;}
        .pq3110 .pq-tuft{position:absolute;z-index:3;}
        .pq3110 .pq-tuft.t1{left:24%;bottom:88px;} .pq3110 .pq-tuft.t2{left:70%;bottom:90px;transform:scale(.85);}
        .pq3110 .pq-mush{position:absolute;z-index:3;left:52px;bottom:86px;}
        .pq3110 .pq-tree{position:absolute;left:8px;bottom:96px;width:46px;height:56px;z-index:2;}
        .pq3110 .pq-tree i{position:absolute;}
        .pq3110 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3110 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3110 .pq-fruit{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff9b8a,#d84438);box-shadow:0 1px 1px rgba(0,0,0,.25);z-index:3;}
        .pq3110 .pq-fruit.fr1{left:10px;bottom:38px;} .pq3110 .pq-fruit.fr2{left:27px;bottom:46px;} .pq3110 .pq-fruit.fr3{left:33px;bottom:27px;}
        .pq3110 .pq-bush{position:absolute;right:12px;bottom:92px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3110 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3110 .pq-bfly::before,.pq3110 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3110 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3110Wing .26s ease-in-out infinite alternate;}
        .pq3110 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3110Wing .26s ease-in-out infinite alternate;}
        .pq3110 .pq-bfly.bf1::before,.pq3110 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3110 .pq-bfly.bf2::before,.pq3110 .pq-bfly.bf2::after{background:#a9e0ff;}
        .pq3110 .pq-bfly.bf1{top:110px;left:20%;animation:pq3110Flit1 8s ease-in-out infinite;}
        .pq3110 .pq-bfly.bf2{top:132px;right:18%;animation:pq3110Flit2 9s ease-in-out infinite;}
        .pq3110 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3110 .pq-bird.b1{top:30px;left:42%;animation:pq3110Fly 7s ease-in-out infinite;}
        .pq3110 .pq-bird.b2{top:46px;left:54%;transform:scale(.78);animation:pq3110Fly 9s ease-in-out infinite;}
        .pq3110 .pq-bird.b3{top:22px;left:66%;transform:scale(.9);animation:pq3110Fly 8s ease-in-out infinite;}
        /* YOG'OCH TAXTACHA — yechim-strip: 5 [op1] 3 [op2] 2 = ? */
        .pq3110 .pq-sign{position:absolute;top:60px;left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:5px;padding:10px 11px 13px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq3110 .pq-sign::before,.pq3110 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:28px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq3110 .pq-sign::before{left:26px;} .pq3110 .pq-sign::after{right:26px;}
        .pq3110 .pq-tile{min-width:36px;height:46px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;border-radius:11px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        .pq3110 .pq-tile.num{background:#eef4fb;border:2.5px solid #6b98c9;color:#2f6bab;}
        .pq3110 .pq-tile.hole{background:#fff;border:3px dashed #7a4e12;color:#a05a1f;animation:pq3110Breath 1.7s ease-in-out infinite;}
        .pq3110 .pq-tile.ans{background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;animation:pq3110Pop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3110 .pq-tile.opq{background:#fff;border:3px dashed #7a4e12;color:#a05a1f;min-width:34px;animation:pq3110Breath 1.7s ease-in-out infinite;}
        .pq3110 .pq-tile.opset{min-width:34px;background:#e8eefc;border:2.5px solid #2563eb;color:#2563eb;}
        .pq3110 .pq-tile.opplus{min-width:34px;background:#e8f7ee;border:2.5px solid #2f8f4e;color:#1a7f43;}
        .pq3110 .pq-tile.opminus{min-width:34px;background:#fdeee6;border:2.5px solid #cf6b3a;color:#b8501f;}
        .pq3110 .pq-opsign{font-size:20px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* ARENA — maysadagi olmalar (kelish/ketish sahnasi) */
        .pq3110 .pq-arena{position:absolute;left:16px;right:16px;bottom:20px;z-index:4;display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:6px 7px;min-height:78px;}
        .pq3110 .pq-obj{position:relative;line-height:0;transform-origin:50% 100%;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq3110 .pq-obj.idle{animation:pq3110Bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq3110 .pq-obj.arrive{animation:pq3110Arrive .5s ease both;animation-delay:var(--ad,0s);}
        .pq3110 .pq-obj.gone{animation:pq3110Gone .5s ease both;animation-delay:var(--gd,0s);opacity:0;}
        .pq3110 .pq-x{position:absolute;top:-8px;right:-6px;width:16px;height:16px;border-radius:50%;background:#c0392b;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 3px rgba(0,0,0,.3);}
        .pq3110 .pq-tag{position:absolute;right:14px;bottom:110px;z-index:5;padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #c9822f;color:#b46e1f;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq3110 .pq-gl{position:absolute;right:14px;bottom:110px;z-index:5;padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pq3110Pop .38s ease both;}
        .pq3110 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3110Tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3110 .pq-spark.s2{animation-delay:-.6s;} .pq3110 .pq-spark.s3{animation-delay:-1.15s;}
        /* Ikki amal-guruh: op1 va op2 tanlash */
        .pq3110 .pq-groups{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}
        .pq3110 .pq-grp{display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq3110 .pq-cap{font-size:12px;font-weight:800;letter-spacing:.04em;color:#8a94a2;text-transform:uppercase;}
        .pq3110 .pq-ops{display:flex;gap:12px;justify-content:center;}
        .pq3110 .pq-op{width:60px;height:60px;font-size:32px;font-weight:900;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq3110 .pq-op:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq3110 .pq-op:active:not(:disabled){transform:scale(.94);}
        .pq3110 .pq-op.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq3110 .pq-op.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3110Cele .5s ease;}
        .pq3110 .pq-op:disabled{cursor:default;}
        .pq3110 .pq-op.sel:disabled,.pq3110 .pq-op.right:disabled{opacity:1;}
        .pq3110 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3110In .22s ease both;}
        .pq3110 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3110 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3110Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3110Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3110Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3110Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3110Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3110Fly{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3110Breath{0%,100%{transform:scale(1);opacity:.9;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes pq3110Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3110Bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3110Arrive{0%{opacity:0;transform:translateY(-30px) scale(.5);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3110Gone{0%{opacity:1;transform:translateY(0) scale(1) rotate(0);}100%{opacity:0;transform:translateY(-28px) scale(.5) rotate(18deg);}}
        @keyframes pq3110Tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3110Cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3110In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <Bird cls="b1" /><Bird cls="b2" /><Bird cls="b3" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
          <div className="pq-hills"><span /><span /><span /></div>
          <div className="pq-grass" />
          <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /><i className="pq-fruit fr1" /><i className="pq-fruit fr2" /><i className="pq-fruit fr3" /></div>
          <Mushroom cls="m1" />
          <span className="pq-bush" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
          <span className="pq-flower f5" /><span className="pq-flower f6" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />

          {/* YECHIM-STRIP taxtachada: 5 [op1] 3 [op2] 2 = ? — belgilar va natija g'alabagacha yashirin */}
          <div className="pq-sign">
            <span className="pq-tile num">{A}</span>
            {op1
              ? <span className={"pq-tile " + (ok ? "opplus" : "opset")}>{op1}</span>
              : <span className="pq-tile opq">?</span>}
            <span className="pq-tile num">{B}</span>
            {op2
              ? <span className={"pq-tile " + (ok ? "opminus" : "opset")}>{op2}</span>
              : <span className="pq-tile opq">?</span>}
            <span className="pq-tile num">{C}</span>
            <span className="pq-opsign">=</span>
            {ok ? <span className="pq-tile ans">{RESULT}</span> : <span className="pq-tile hole">?</span>}
          </div>

          {/* ARENA: maysada 5 olma. G'alabada +3 keladi (arrive), so'ng 2 tasi ✕ bilan ketadi (gone) -> 6 qoladi. */}
          <div className="pq-arena">
            {(ok ? Array.from({ length: STEP1 }) : Array.from({ length: A })).map((_, i) => {
              const arrive = ok && i >= A;          // keldi (3)
              const gone = ok && i >= STEP1 - C;    // ketdi — oxirgi 2 uchib chiqadi
              const cls = 'pq-obj' + (idle ? ' idle' : '') + (gone ? ' gone' : arrive ? ' arrive' : '');
              const ad = still ? 0 : (i - A) * 0.14;
              const gd = still ? 0 : 0.55 + (i - (STEP1 - C)) * 0.16;
              return (
                <span key={'a' + i} className={cls} style={{ '--bd': `${i * 0.1}s`, '--ad': `${ad}s`, '--gd': `${gd}s` }}>
                  <Apple w={28} />
                  {gone && !still && <span className="pq-x">{'✕'}</span>}
                </span>
              );
            })}
          </div>
          {!ok && <span className="pq-tag">{A}</span>}
          {ok && <span className="pq-gl">{RESULT}</span>}

          {ok && (<>
            <span className="pq-spark" style={{ left: '10%', top: '160px' }}>{'✦'}</span>
            <span className="pq-spark s2" style={{ left: '86%', top: '176px' }}>{'✦'}</span>
            <span className="pq-spark s3" style={{ left: '50%', top: '150px' }}>{'✦'}</span>
          </>)}
        </div>

        {/* IKKI QADAM: 1-amal (op1: keldi -> +) va 2-amal (op2: ketdi -> −). To'g'ri = «+» va «−». */}
        <div className="pq-groups">
          <div className="pq-grp">
            <span className="pq-cap">{t.cap1}</span>
            <div className="pq-ops">
              {[MINUS, PLUS].map((v) => {
                const sel = op1 === v; const right = ok && v === PLUS;
                return <button key={'a' + v} type="button" className={'pq-op' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick1(v)}>{v}</button>;
              })}
            </div>
          </div>
          <div className="pq-grp">
            <span className="pq-cap">{t.cap2}</span>
            <div className="pq-ops">
              {[MINUS, PLUS].map((v) => {
                const sel = op2 === v; const right = ok && v === MINUS;
                return <button key={'b' + v} type="button" className={'pq-op' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick2(v)}>{v}</button>;
              })}
            </div>
          </div>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
