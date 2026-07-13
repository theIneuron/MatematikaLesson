// Dars30 · Amaliyot 07 — «Qaysi qator xato?» · Jadval qatorlari · Mantiq (P13 find-error) · 🔴 · tag: find_error
// Uch jadval-qator (bor → o'zgarish → natija=R), bittasining natijasi xato. Bola XATO qatorni bosadi.
// A: 6 + 2 = 8 (to'g'ri) · B: 9 − 3 = 5 (XATO — aslida 6, index 1) · C: 7 + 1 = 8 (to'g'ri).
// Minus U+2212 «−». JADVAL: bordered qatorlar, hairline ajratgich; label chapda (muted), qiymat o'ngda (tabular-nums).
// JAVOB-LEAK YO'Q: qaysi qator xato ekani g'alabagacha belgilanmaydi; tuzatish (6) FAQAT g'alabada ochiladi.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 minus

// Qator tartibi: xato qator index 1 (o'rtada — chap-yutadi tuzog'idan qochish).
const ROWS = [
  { id: 'a62', a: 6, op: '+', b: 2, shown: 8, bad: false }, // 6 + 2 = 8 to'g'ri
  { id: 'b93', a: 9, op: M, b: 3, shown: 5, bad: true },     // 9 − 3 = 5 XATO (aslida 6) — index 1
  { id: 'c71', a: 7, op: '+', b: 1, shown: 8, bad: false },  // 7 + 1 = 8 to'g'ri
];
const TARGET = 'b93';                 // bosish kerak bo'lgan xato qator
const REAL = 9 - 3;                   // 6 — to'g'ri natija (faqat g'alabada ochiladi)
const DATA = { target: TARGET, real: REAL, options: ROWS.map((r) => r.id), level: '🔴', tag: 'find_error' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Jadval", title: "Xato qaysi?",
    setup: "Jadval qatorlariga qarang.",
    ask: "Qaysi qator xato?",
    correct: "Barakalla! 9 " + M + " 3 = 6, 5 emas.",
    hint: "Har bir qatorni tekshiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Таблица", title: "Где ошибка?",
    setup: "Посмотри на строки таблицы.",
    ask: "В какой строке ошибка?",
    correct: "Молодец! 9 " + M + " 3 = 6, а не 5.",
    hint: "Проверь каждую строку.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// Bog' bargligi (dekorativ, taplarni ushlamaydi).
const Leaf = ({ flip }) => (
  <svg width="52" height="40" viewBox="0 0 52 40" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M0,8 Q26,2 40,16" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" />
    <g fill="#4fa845" stroke="#3c8536" strokeWidth=".6">
      <path d="M18,6 Q24,2 25,7 Q20,9 18,6 Z" />
      <path d="M31,10 Q37,6 38,11 Q33,13 31,10 Z" />
    </g>
    <circle cx="41" cy="18" r="4.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth=".8" />
  </svg>
);

// Yakka olma (dekor, bosilmaydi) — bog' hissi. (Dars 21 kanoni)
const Apple = ({ w = 20 }) => {
  const id = 'pq3007a' + (__gid++);
  return (
    <svg viewBox="0 0 30 34" width={w} height={w * 34 / 30} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" /><stop offset="46%" stopColor="#e8443a" /><stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (D15 etalon kanoni)
const Bird = ({ cls }) => (
  <svg className={"pq-bird " + cls} viewBox="0 0 22 9" width="20" height="8" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// OLMA DARAXTI (haqiqiy): po'stloq gradientli tana, uch pog'onali barg toji (radial soya, yorug' blik),
// shoxlarda bandi bilan osilgan olmalar sekin tebranadi; ostida yumshoq soya. (D15 etalon darajasi)
const AppleTree = ({ w = 56 }) => {
  const id = "pq3007t" + (__gid++);
  return (
    <svg viewBox="0 0 92 102" width={w} height={w * 102 / 92} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id + "k"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7d4f24" /><stop offset="45%" stopColor="#a9743e" /><stop offset="100%" stopColor="#6d4526" />
        </linearGradient>
        <radialGradient id={id + "f"} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#a3dc7e" /><stop offset="55%" stopColor="#6cb84f" /><stop offset="100%" stopColor="#4a8f3d" />
        </radialGradient>
        <radialGradient id={id + "a"} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <ellipse cx="46" cy="98" rx="27" ry="4" fill="rgba(50,80,35,.18)" />
      <path d="M42 98 C44 80 43 68 40 54 L52 54 C49 70 49 82 50 98 Z" fill={`url(#${id}k)`} stroke="#5f3c1e" strokeWidth="1.1" />
      <path d="M43 68 Q33 60 29 52 M49 66 Q58 58 62 51" fill="none" stroke="#7d4f24" strokeWidth="3.2" strokeLinecap="round" />
      <g className="pq-crown">
        <circle cx="24" cy="44" r="18" fill={`url(#${id}f)`} stroke="#3f7c33" strokeWidth="1.1" />
        <circle cx="68" cy="43" r="17" fill={`url(#${id}f)`} stroke="#3f7c33" strokeWidth="1.1" />
        <circle cx="46" cy="27" r="21" fill={`url(#${id}f)`} stroke="#3f7c33" strokeWidth="1.1" />
        <ellipse cx="38" cy="19" rx="9" ry="5.5" fill="#cdeeaa" opacity=".5" />
        <g className="pq-tapple" style={{ "--sd": "0s" }}>
          <path d="M30 33 l0 4" stroke="#6d4526" strokeWidth="1.1" />
          <circle cx="30" cy="41" r="4.6" fill={`url(#${id}a)`} stroke="#a5342c" strokeWidth=".7" />
          <circle cx="28.6" cy="39.4" r="1.3" fill="#fff" opacity=".6" />
        </g>
        <g className="pq-tapple" style={{ "--sd": "-1.2s" }}>
          <path d="M54 24 l0 4" stroke="#6d4526" strokeWidth="1.1" />
          <circle cx="54" cy="32" r="4.2" fill={`url(#${id}a)`} stroke="#a5342c" strokeWidth=".7" />
          <circle cx="52.8" cy="30.6" r="1.2" fill="#fff" opacity=".6" />
        </g>
        <g className="pq-tapple" style={{ "--sd": "-2.1s" }}>
          <path d="M67 37 l0 4" stroke="#6d4526" strokeWidth="1.1" />
          <circle cx="67" cy="45" r="4.4" fill={`url(#${id}a)`} stroke="#a5342c" strokeWidth=".7" />
          <circle cx="65.7" cy="43.5" r="1.2" fill="#fff" opacity=".6" />
        </g>
      </g>
    </svg>
  );
};

export default function D30_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a} ${r.op} ${r.b} = ${r.shown}`), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3007" + (still ? " still" : "")}>
      <style>{`
        .pq3007.still *{animation:none !important;}
        .pq3007{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3007 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3007 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3007 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3007 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3007 .pq-orchard{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 12px 64px;border-radius:20px;background:linear-gradient(#bfe6fb 0%,#dff1fb 40%,#cfeccb 74%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq3007 .pq-sun{position:absolute;left:16px;top:11px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 20px 6px rgba(255,214,74,.55);z-index:2;pointer-events:none;animation:pq3007sun 3.6s ease-in-out infinite;}
        /* ===== BOG' SAHNASI (D15 etalon darajasi): bulut, qush, maysa, daraxt, gul, kapalak ===== */
        .pq3007 .pq-cloud{position:absolute;height:14px;background:#fff;border-radius:20px;box-shadow:0 5px 0 -2px #fff;opacity:.95;z-index:1;pointer-events:none;}
        .pq3007 .pq-cloud::before,.pq3007 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3007 .pq-cloud::before{width:20px;height:20px;top:-8px;left:7px;}.pq3007 .pq-cloud::after{width:14px;height:14px;top:-5px;left:22px;}
        .pq3007 .pq-cloud.c1{top:12px;left:24%;width:42px;animation:pq3007drift 15s ease-in-out infinite;}
        .pq3007 .pq-cloud.c2{top:26px;left:60%;width:32px;transform:scale(.78);animation:pq3007drift 19s ease-in-out infinite reverse;}
        .pq3007 .pq-bird{position:absolute;z-index:1;opacity:.7;pointer-events:none;}
        .pq3007 .pq-bird.b1{top:18px;left:44%;animation:pq3007birdfly 8s ease-in-out infinite;}
        .pq3007 .pq-bird.b2{top:30px;left:70%;transform:scale(.75);animation:pq3007birdfly 10s ease-in-out infinite;}
        .pq3007 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:1;pointer-events:none;}
        .pq3007 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:9px;background:radial-gradient(circle at 5px 9px,#84c95f 5px,transparent 6px) repeat-x;background-size:14px 9px;}
        .pq3007 .pq-tree{position:absolute;right:8px;bottom:2px;z-index:2;line-height:0;pointer-events:none;}
        .pq3007 .pq-crown{transform-box:fill-box;transform-origin:50% 85%;animation:pq3007sway 5.6s ease-in-out infinite;}
        .pq3007 .pq-tapple{transform-box:fill-box;transform-origin:50% 0;animation:pq3007swing 3.6s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq3007 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:2;pointer-events:none;}
        .pq3007 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3007 .pq-flower.f1{left:30%;bottom:16px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3007 .pq-flower.f2{left:52%;bottom:8px;background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3007 .pq-flower.f3{left:68%;bottom:18px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3007 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;pointer-events:none;}
        .pq3007 .pq-bfly::before,.pq3007 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq3007 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3007wing .26s ease-in-out infinite alternate;}
        .pq3007 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3007wing .26s ease-in-out infinite alternate;}
        .pq3007 .pq-bfly.bf2::before,.pq3007 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3007 .pq-bfly.bf1{bottom:42px;left:16%;animation:pq3007flit 9s ease-in-out infinite;}
        .pq3007 .pq-bfly.bf2{bottom:58px;right:14%;animation:pq3007flit 11s ease-in-out infinite reverse;}
        /* g'alaba: daraxtdan olma yog'adi */
        .pq3007 .pq-drop{position:absolute;top:28px;z-index:6;line-height:0;pointer-events:none;animation:pq3007fall 1.6s ease-in both;animation-delay:var(--dd,0s);}
        .pq3007 .pq-leaf{position:absolute;z-index:2;pointer-events:none;transform-origin:top center;}
        .pq3007 .pq-leaf.l{left:-4px;top:2px;animation:pq3007sway 4.2s ease-in-out infinite;}
        .pq3007 .pq-leaf.r{right:-4px;top:-2px;animation:pq3007sway 4.6s ease-in-out .8s infinite;}
        .pq3007 .pq-apple{position:absolute;z-index:2;pointer-events:none;}
        .pq3007 .pq-apple.a1{right:18px;bottom:10px;animation:pq3007bob 3s ease-in-out infinite;}
        .pq3007 .pq-apple.a2{left:20px;bottom:14px;animation:pq3007bob 3.4s ease-in-out .5s infinite;}
        .pq3007 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d19b5c,#b67c3f);border:2.5px solid #93602c;color:#fdf3e3;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 8px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);text-shadow:0 1px 1px rgba(0,0,0,.22);}

        /* Jadval: bordered qatorlar, hairline ajratgich */
        .pq3007 .pq-table{box-sizing:border-box;position:relative;z-index:3;width:100%;border-radius:15px;overflow:hidden;border:3px solid #d6dae3;background:rgba(255,255,255,.97);box-shadow:0 4px 10px rgba(40,60,40,.14);}
        .pq3007 .pq-row{box-sizing:border-box;position:relative;width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:56px;padding:10px 14px;background:transparent;border:0;border-top:1px solid #e6e9ef;cursor:pointer;transition:.12s;text-align:left;}
        .pq3007 .pq-row:first-child{border-top:0;}
        .pq3007 .pq-row:hover:not(:disabled){background:#f3f7ff;}
        .pq3007 .pq-row:active:not(:disabled){transform:scale(.99);}
        .pq3007 .pq-row.sel{background:#eef3fe;box-shadow:inset 3px 0 0 #2563eb;}
        .pq3007 .pq-row.right{background:#e8f7ee;box-shadow:inset 3px 0 0 #1a7f43;animation:pq3007cele .5s ease;}
        .pq3007 .pq-row.dim{opacity:.42;filter:saturate(.65);}
        .pq3007 .pq-row:disabled{cursor:default;}
        .pq3007 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.03em;color:#9aa3b0;flex:0 0 auto;}
        .pq3007 .pq-eqtxt{display:flex;align-items:center;gap:4px;font-size:19px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;line-height:1;flex:0 0 auto;}
        .pq3007 .pq-eqtxt i{font-style:normal;color:#8a94a2;font-weight:800;}
        .pq3007 .pq-eqtxt s{color:#c0392b;text-decoration-thickness:2.5px;}
        .pq3007 .pq-eqtxt em{font-style:normal;color:#1a7f43;font-weight:900;}
        /* g'alaba: xato qatordagi to'g'ri natija pilyulasi (AnsPop) — faqat g'alabada */
        .pq3007 .pq-mark{position:absolute;top:-9px;right:12px;z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:14px;padding:2px 12px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq3007pop .45s ease both;}

        .pq3007 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3007tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3007 .pq-spark.s2{animation-delay:-.6s;} .pq3007 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3007 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq3007in .3s ease both;}
        .pq3007 .pq-eq b{min-width:42px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3007 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3007 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq3007 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3007in .22s ease both;}
        .pq3007 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3007 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3007sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3007sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq3007bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pq3007pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3007tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3007cele{0%{transform:scale(1);}30%{transform:scale(1.02);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3007in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq3007drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3007birdfly{0%,100%{transform:translate(0,0);}50%{transform:translate(26px,-5px);}}
        @keyframes pq3007swing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq3007wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3007flit{0%,100%{transform:translate(0,0);}25%{transform:translate(22px,-10px);}50%{transform:translate(40px,5px);}75%{transform:translate(16px,-5px);}}
        @keyframes pq3007fall{0%{opacity:0;transform:translateY(-14px) rotate(0);}12%{opacity:1;}100%{opacity:0;transform:translateY(150px) rotate(120deg);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-orchard">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" /><Bird cls="b2" />
        <div className="pq-grass" />
        <span className="pq-tree"><AppleTree /></span>
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <span className="pq-leaf l"><Leaf /></span>
        <span className="pq-leaf r"><Leaf flip /></span>
        <span className="pq-apple a1"><Apple w={20} /></span>
        <span className="pq-apple a2"><Apple w={16} /></span>
        <div className="pq-board">{t.title}</div>

        {/* Jadval: uch tenglama-qator. Har qator bosiladigan nishon;
            g'alabagacha qaysi biri xato ekani belgilanmaydi (javob-leak yo'q). */}
        <div className="pq-table">
          {ROWS.map((r, i) => {
            const sel = picked === r.id;
            const right = ok && r.id === TARGET;
            const dim = ok && r.id !== TARGET;
            return (
              <button
                key={r.id}
                type="button"
                className={'pq-row' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(r.id); setFeedback(null); }}
              >
                <span className="pq-lab">{i + 1}</span>
                <span className="pq-eqtxt">
                  <b>{r.a}</b><i>{r.op}</i><b>{r.b}</b><i>=</i>
                  {right
                    ? (<><s>{r.shown}</s> <em>{REAL}</em></>)
                    : (<b>{r.shown}</b>)}
                </span>
                {right && <span className="pq-mark">{REAL}</span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '42px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '56px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>{'✦'}</span>
        </>)}
        {ok && !still && (<>
          <span className="pq-drop" style={{ left: '18%', '--dd': '.05s' }}><Apple w={16} /></span>
          <span className="pq-drop" style={{ left: '52%', '--dd': '.3s' }}><Apple w={14} /></span>
          <span className="pq-drop" style={{ left: '80%', '--dd': '.55s' }}><Apple w={16} /></span>
        </>)}
      </div>

      {/* G'alabada: xato qatorning to'g'ri ko'rinishi — 9 − 3 = 6 */}
      {ok && (<div className="pq-eq"><b>9</b><i>{M}</i><b>3</b><i>=</i><b className="res">{REAL}</b></div>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
