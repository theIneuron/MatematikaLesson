// Dars30 · Amaliyot 03 — Tarkibli masala: jadval bilan · 🟡 · tag: table_rem
// Qoldiqqa masala (10 ichida): savatda 9 olma bor edi, 4 tasi ketdi — nechta qoldi? 9 − 4 = 5.
// Jadval (P24): Bor edi 9 / Ketdi − 4 / Qoldi ? — noma'lum katak «?» nafas oladi, tanlangach to'ladi.
// Variantlar [13, 5, 6]: 5 to'g'ri (birinchi EMAS), 13 = noto'g'ri amal (9+4), 6 = xato hisob.
// Bir xonali — yakka olmalar (birlik); savat = o'nlik kanoni. Barcha buyum — OLMA.
// G'alabada «Qoldi» katagi yashil bo'lib 5 chiqadi + olma pop; faqat shundan keyin tenglama ochiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 9, B = 4, DIFF = 5;                  // 9 − 4 = 5 (bir xonali)
const MINUS = "−";                             // U+2212, ASCII defis EMAS
const TARGET = DIFF;                           // qoldi = 5
const OPTIONS = [13, 5, 6];                    // 5 to'g'ri (birinchi emas); 13 = 9+4; 6 = xato
const DATA = { a: A, b: B, diff: DIFF, op: MINUS, options: OPTIONS, answer: TARGET, level: "🟡", tag: "table_rem" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala",
    title: "Nechta qoldi?",
    setup: "Savatda 9 olma bor edi, 4 tasi ketdi.",
    ask: "Nechta qoldi?",
    rowA: "Bor edi", rowB: "Ketdi", rowC: "Qoldi",
    correct: "Barakalla! Ketsa — ayiramiz. Qoldi: 5.",
    hint: "Ketsa — kamayadi, ayiring: 9 dan 4 ni oling.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача",
    title: "Сколько осталось?",
    setup: "В корзине было 9 яблок, ушло 4.",
    ask: "Сколько осталось?",
    rowA: "Было", rowB: "Ушло", rowC: "Осталось",
    correct: "Молодец! Ушло — вычитаем. Осталось: 5.",
    hint: "Ушло — стало меньше, вычитай: от 9 отними 4.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 24 }) => {
  const id = "pq3003a" + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
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

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (D15 etalon kanoni)
const Bird = ({ cls }) => (
  <svg className={"pq-bird " + cls} viewBox="0 0 22 9" width="20" height="8" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// OLMA DARAXTI (haqiqiy): po'stloq gradientli tana, uch pog'onali barg toji (radial soya, yorug' blik),
// shoxlarda bandi bilan osilgan olmalar sekin tebranadi; ostida yumshoq soya. (D15 etalon darajasi)
const AppleTree = ({ w = 58 }) => {
  const id = "pq3003t" + (__gid++);
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

export default function D30_03(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok; // g'alabagacha yengil tebranish (olmalar bezak — bosiladigan nishon EMAS)
  // «Qoldi» katagi: g'alabagacha «?» (nafas oladi); tanlangach picked ko'rinadi; g'alabada yashil 5.
  const resCell = ok ? DIFF : (picked !== null ? picked : "?");

  return (
    <div className={"pq pq3003" + (still ? " still" : "")}>
      <style>{`
        .pq3003.still *{animation:none !important;}
        .pq3003{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3003 *{box-sizing:border-box;}
        .pq3003 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3003 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3003 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3003 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3003 .pq-scene{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#e4f4d9 70%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;padding:14px 12px 66px;box-sizing:border-box;}
        .pq3003 .pq-sun{position:absolute;right:14px;top:11px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 20px 6px rgba(255,214,74,.55);z-index:1;pointer-events:none;animation:pq3003sun 3.6s ease-in-out infinite;}
        .pq3003 .pq-title{position:relative;z-index:6;display:inline-block;margin:0 auto 12px;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#d19b5c,#b67c3f);border:2.5px solid #93602c;color:#fdf3e3;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 0 #8a5926,0 5px 8px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);text-shadow:0 1px 1px rgba(0,0,0,.22);}
        /* ===== BOG' SAHNASI (D15 etalon darajasi): bulut, qush, maysa, daraxt, gul, kapalak ===== */
        .pq3003 .pq-cloud{position:absolute;height:14px;background:#fff;border-radius:20px;box-shadow:0 5px 0 -2px #fff;opacity:.95;z-index:1;pointer-events:none;}
        .pq3003 .pq-cloud::before,.pq3003 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3003 .pq-cloud::before{width:20px;height:20px;top:-8px;left:7px;}.pq3003 .pq-cloud::after{width:14px;height:14px;top:-5px;left:22px;}
        .pq3003 .pq-cloud.c1{top:12px;left:8%;width:42px;animation:pq3003drift 15s ease-in-out infinite;}
        .pq3003 .pq-cloud.c2{top:30px;left:66%;width:32px;transform:scale(.78);animation:pq3003drift 19s ease-in-out infinite reverse;}
        .pq3003 .pq-bird{position:absolute;z-index:1;opacity:.7;pointer-events:none;}
        .pq3003 .pq-bird.b1{top:34px;left:30%;animation:pq3003bird 8s ease-in-out infinite;}
        .pq3003 .pq-bird.b2{top:44px;left:10%;transform:scale(.75);animation:pq3003bird 10s ease-in-out infinite;}
        .pq3003 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:1;pointer-events:none;}
        .pq3003 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:9px;background:radial-gradient(circle at 5px 9px,#84c95f 5px,transparent 6px) repeat-x;background-size:14px 9px;}
        .pq3003 .pq-tree{position:absolute;left:6px;bottom:2px;z-index:2;line-height:0;pointer-events:none;}
        .pq3003 .pq-crown{transform-box:fill-box;transform-origin:50% 85%;animation:pq3003sway 5.6s ease-in-out infinite;}
        .pq3003 .pq-tapple{transform-box:fill-box;transform-origin:50% 0;animation:pq3003swing 3.6s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq3003 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:2;pointer-events:none;}
        .pq3003 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3003 .pq-flower.f1{left:26%;bottom:16px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3003 .pq-flower.f2{left:50%;bottom:8px;background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3003 .pq-flower.f3{right:9%;bottom:18px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3003 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;pointer-events:none;}
        .pq3003 .pq-bfly::before,.pq3003 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq3003 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3003wing .26s ease-in-out infinite alternate;}
        .pq3003 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3003wing .26s ease-in-out infinite alternate;}
        .pq3003 .pq-bfly.bf2::before,.pq3003 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3003 .pq-bfly.bf1{bottom:44px;left:14%;animation:pq3003flit 9s ease-in-out infinite;}
        .pq3003 .pq-bfly.bf2{bottom:60px;right:10%;animation:pq3003flit 11s ease-in-out infinite reverse;}
        /* g'alaba: daraxtdan olma yog'adi */
        .pq3003 .pq-drop{position:absolute;top:28px;z-index:6;line-height:0;pointer-events:none;animation:pq3003fall 1.6s ease-in both;animation-delay:var(--dd,0s);}
        .pq3003 .pq-titlewrap{text-align:center;}

        /* dekor olmalar — bir tekis (natijani sanab bo'lmaydi), bezak, bosilmaydi */
        .pq3003 .pq-decor{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:4px;max-width:300px;margin:0 auto 12px;position:relative;z-index:3;}
        .pq3003 .pq-obj{line-height:0;}
        .pq3003 .pq-obj.idle{animation:pq3003bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);transform-origin:50% 100%;}

        /* JADVAL (P24) — sahnaning markazi */
        .pq3003 .pq-tbl{position:relative;z-index:4;width:100%;max-width:320px;margin:0 auto;background:#fff;border:2px solid #bcd3ea;border-radius:14px;overflow:hidden;box-shadow:0 3px 8px rgba(31,54,80,.12);box-sizing:border-box;}
        .pq3003 .pq-tr{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;min-height:52px;}
        .pq3003 .pq-tr + .pq-tr{border-top:1px solid #e3ebf3;}
        .pq3003 .pq-lbl{font-size:16px;font-weight:600;color:#5c6672;}
        .pq3003 .pq-val{font-size:24px;font-weight:900;color:#1f2430;font-variant-numeric:tabular-nums;}
        .pq3003 .pq-tr.rB .pq-val{color:#c0623a;}
        .pq3003 .pq-tr.rC{background:#f6faff;}
        .pq3003 .pq-tr.rC .pq-lbl{font-weight:800;color:#2f6bab;}
        .pq3003 .pq-res{min-width:52px;height:40px;padding:0 12px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px dashed #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3003 .pq-res.wait{animation:pq3003breathe 1.8s ease-in-out infinite;}
        .pq3003 .pq-res.win{background:#e8f7ee;border:2px solid #1a7f43;border-style:solid;color:#1a7f43;animation:pq3003pop .42s ease both;}
        .pq3003 .pq-winapple{margin-left:7px;display:inline-flex;vertical-align:middle;animation:pq3003pop .5s .1s ease both;}

        .pq3003 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq3003in .3s ease both;}
        .pq3003 .pq-eq b{min-width:42px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3003 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3003 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq3003 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
        .pq3003 .pq-opt{min-width:84px;height:70px;padding:0 12px;font-size:34px;font-weight:800;line-height:1;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3003 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq3003 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq3003 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq3003 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3003cele .5s ease;}
        .pq3003 .pq-opt:disabled{cursor:default;}
        .pq3003 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3003in .22s ease both;}
        .pq3003 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3003 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3003bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3003sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3003breathe{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.07);opacity:1;}}
        @keyframes pq3003pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3003cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3003in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq3003drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3003bird{0%,100%{transform:translate(0,0);}50%{transform:translate(26px,-5px);}}
        @keyframes pq3003sway{0%,100%{transform:rotate(-1.2deg);}50%{transform:rotate(1.2deg);}}
        @keyframes pq3003swing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq3003wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3003flit{0%,100%{transform:translate(0,0);}25%{transform:translate(22px,-10px);}50%{transform:translate(40px,5px);}75%{transform:translate(16px,-5px);}}
        @keyframes pq3003fall{0%{opacity:0;transform:translateY(-14px) rotate(0);}12%{opacity:1;}100%{opacity:0;transform:translateY(150px) rotate(120deg);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" /><Bird cls="b2" />
        <div className="pq-grass" />
        <span className="pq-tree"><AppleTree /></span>
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-titlewrap"><div className="pq-title">{t.title}</div></div>

        {/* dekor: 9 olma bir tekis (natijani oldindan sanab bo'lmaydi) */}
        <div className="pq-decor" aria-hidden="true">
          {Array.from({ length: A }).map((_, i) => (
            <span key={"d" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.09}s` }}><Apple w={22} /></span>
          ))}
        </div>

        {/* JADVAL: Bor edi 9 / Ketdi − 4 / Qoldi ? */}
        <div className="pq-tbl">
          <div className="pq-tr rA">
            <span className="pq-lbl">{t.rowA}</span>
            <span className="pq-val">{A}</span>
          </div>
          <div className="pq-tr rB">
            <span className="pq-lbl">{t.rowB}</span>
            <span className="pq-val">{MINUS} {B}</span>
          </div>
          <div className="pq-tr rC">
            <span className="pq-lbl">{t.rowC}</span>
            <span className={"pq-res " + (ok ? "win" : (picked === null ? "wait" : ""))}>
              {resCell}
              {ok && <span className="pq-winapple"><Apple w={20} /></span>}
            </span>
          </div>
        </div>

        {ok && !still && (<>
          <span className="pq-drop" style={{ left: "18%", "--dd": ".05s" }}><Apple w={16} /></span>
          <span className="pq-drop" style={{ left: "52%", "--dd": ".3s" }}><Apple w={14} /></span>
          <span className="pq-drop" style={{ left: "80%", "--dd": ".55s" }}><Apple w={16} /></span>
        </>)}
      </div>

      {/* G'alaba: ketsa AYIRAMIZ — tenglama 9 − 4 = 5 (natija faqat shu yerda ochiladi) */}
      {ok && (
        <div className="pq-eq"><b>{A}</b><i>{MINUS}</i><b>{B}</b><i>=</i><b className="res">{DIFF}</b></div>
      )}

      <div className="pq-opts">
        {OPTIONS.map((op) => {
          const sel = picked === op; const right = ok && op === TARGET;
          return <button key={op} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => { setPicked(op); setFeedback(null); }}>{op}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
