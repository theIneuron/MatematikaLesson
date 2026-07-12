// Dars14 · Amaliyot 02 — P13 TEEN o'qish «Yashik va yakka olma» · 🟡 · tag: read_teen
// BOG' SAHNASI: osmon, quyosh, bulut, daraxt. Tokchada 10 UYALI OLMA YASHIGI (2×5, to'la) va
// YONIDA (o'ngda) 1 YAKKA olma. Jami nechta? → 11. G'alaba: yashik 1..10, yakka 11-badge, chip «10 + 1 = 11».
// Misconception qalqoni: 11 = O'N va BIR (to'la yashik + yakka), «1 va 1» EMAS.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10, ONES = 1, TARGET = 11;
const DATA = { ten: TEN, ones: ONES, target: TARGET, options: [10, 11, 12], ptype: 'P13', level: '🟡', tag: 'read_teen' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · O'qish", title: "Jami nechta olma?",
    setup: "To'la yashik va yonida 1 yakka olma bor.",
    ask: "Jami nechta olma bor?",
    correct: "Barakalla! To'la yashik — o'n, va yana bir yakka. O'n va bir — o'n bir!",
    hint: "To'la yashikda o'nta olma bor. Yoniga bitta yakka olmani qo'shsangiz, nechta bo'ladi?",
    chip: "10 + 1 = 11",
    boxCap: "to'la yashik", yakkaCap: "yakka", boxLbl: "10",
  },
  ru: {
    eyebrow: "Яблоневый сад · Чтение", title: "Сколько всего яблок?",
    setup: "Полный ящик и рядом 1 отдельное яблоко.",
    ask: "Сколько всего яблок?",
    correct: "Молодец! Полный ящик — десять, и ещё одно отдельное. Десять и один — одиннадцать!",
    hint: "В полном ящике десять яблок. Добавьте одно отдельное — сколько получится?",
    chip: "10 + 1 = 11",
    boxCap: "полный ящик", yakkaCap: "отдельное", boxLbl: "10",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): qizil olma — bandi + yashil barg + blik. Bitta olma = bitta birlik.
const Apple = ({ w = 26 }) => (
  <svg viewBox="0 0 26 26" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M13 5.5 Q13 2 15.5 1" fill="none" stroke="#7a4b1e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 4.6 Q18.5 1.6 20 5 Q16.5 6.4 14 4.6 Z" fill="#57a84f" />
    <path d="M13 6 C7 3.6 2.5 8 3.2 14 C3.8 19.8 8 24 13 24 C18 24 22.2 19.8 22.8 14 C23.5 8 19 3.6 13 6 Z" fill="#d9463c" stroke="#a92f27" strokeWidth="1.1" />
    <ellipse cx="8.6" cy="11" rx="2.6" ry="3.6" fill="#fff" opacity=".3" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
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
    <div className="pq pq1402">
      <style>{`
        .pq1402{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1402 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq1402 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1402 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1402 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1402 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;}
        /* BOG' SAHNASI */
        .pq1402 .pq-scene{position:relative;width:372px;max-width:100%;height:252px;border-radius:20px;background:linear-gradient(#c3e7fb 0%,#e0f3fd 46%,#eef9ff 60%);border:2px solid #bfe0d0;overflow:hidden;}
        .pq1402 .pq-sun{position:absolute;left:18px;top:14px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 18px 5px rgba(255,214,74,.55);animation:pqSun 3.8s ease-in-out infinite;z-index:1;}
        .pq1402 .pq-cloud{position:absolute;height:14px;background:#fff;border-radius:20px;opacity:.94;z-index:1;}
        .pq1402 .pq-cloud::before,.pq1402 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq1402 .pq-cloud::before{width:20px;height:20px;top:-8px;left:8px;} .pq1402 .pq-cloud::after{width:14px;height:14px;top:-5px;left:24px;}
        .pq1402 .pq-cloud.c1{top:24px;left:56%;width:42px;animation:pqDrift 14s ease-in-out infinite;}
        .pq1402 .pq-cloud.c2{top:52px;left:32%;width:32px;transform:scale(.8);animation:pqDrift 18s ease-in-out infinite reverse;}
        .pq1402 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:96px;background:linear-gradient(#8ccb64 0%,#69b34c 60%,#5aa53f 100%);z-index:1;}
        .pq1402 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#8ccb64 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq1402 .pq-tree{position:absolute;right:8px;bottom:80px;width:66px;height:78px;z-index:2;}
        .pq1402 .pq-trunk{position:absolute;left:28px;bottom:0;width:10px;height:28px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:3px;}
        .pq1402 .pq-leaves{position:absolute;left:2px;bottom:20px;width:62px;height:56px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:16px 10px 0 -10px #6fb552;animation:pqSwayT 5s ease-in-out infinite;transform-origin:bottom center;}
        .pq1402 .pq-tapple{position:absolute;z-index:3;animation:pqBobA 3.6s ease-in-out infinite;}
        /* YASHIK (10 uyali, to'la) + YAKKA olma o'ng tomonda */
        .pq1402 .pq-groups{position:absolute;left:0;right:0;bottom:20px;display:flex;align-items:flex-end;justify-content:center;gap:26px;z-index:4;}
        .pq1402 .pq-grp{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq1402 .pq-box{position:relative;padding:8px 9px 10px;border-radius:11px;background:linear-gradient(#d9a561,#c08a45);border:2.5px solid #96662b;box-shadow:0 4px 0 #7d5423,0 6px 9px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.25);}
        .pq1402 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:4px;}
        .pq1402 .pq-cell{position:relative;width:30px;height:30px;border-radius:8px;background:rgba(70,40,10,.22);box-shadow:inset 0 2px 4px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;}
        .pq1402 .pq-blbl{position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-size:12px;font-weight:900;z-index:5;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq1402 .pq-cnt{position:absolute;top:-8px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:6;font-variant-numeric:tabular-nums;}
        .pq1402 .pq-cnt.big{min-width:20px;height:20px;font-size:11.5px;background:#1a7f43;top:-10px;}
        .pq1402 .pq-cap{font-size:12px;font-weight:800;color:#8a5a12;letter-spacing:.02em;text-transform:uppercase;background:#fef3d8;border:1.5px solid #f0c877;border-radius:999px;padding:2px 10px;white-space:nowrap;}
        .pq1402 .pq-cap.one{color:#3f7a38;background:#e9f6e7;border-color:#a9d3a2;}
        .pq1402 .pq-single{position:relative;padding-bottom:2px;animation:pqShimmer 2.6s ease-in-out infinite;}
        /* savol belgisi + plyus */
        .pq1402 .pq-q{position:absolute;left:50%;top:6px;transform:translateX(-50%);font-size:34px;font-weight:900;color:#3f7a38;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqBreath 1.8s ease-in-out infinite;z-index:5;}
        .pq1402 .pq-plus{position:absolute;left:50%;bottom:52px;transform:translateX(-50%);font-size:26px;font-weight:900;color:#3f7a38;opacity:.6;z-index:4;}
        .pq1402 .pq-anspop{position:absolute;left:50%;top:4px;transform:translateX(-50%);background:#1a7f43;color:#fff;font-size:20px;font-weight:900;padding:4px 14px;border-radius:999px;box-shadow:0 4px 10px rgba(26,127,67,.35);font-variant-numeric:tabular-nums;animation:pqPop .4s ease both;z-index:7;}
        .pq1402 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1402 .pq-star.s2{animation-delay:-.5s;} .pq1402 .pq-star.s3{animation-delay:-1s;}
        /* chip + variantlar */
        .pq1402 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:999px;background:#e9f6e7;border:2px solid #a9d3a2;color:#2f6f3a;font-size:16px;font-weight:900;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        .pq1402 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:4px;}
        .pq1402 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1402 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq1402 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1402 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1402 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1402 .pq-opt:disabled{cursor:default;}
        .pq1402 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1402 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1402 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pqSwayT{0%,100%{transform:rotate(-1.2deg);}50%{transform:rotate(1.2deg);}}
        @keyframes pqBobA{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqShimmer{0%,100%{filter:brightness(1);}50%{filter:brightness(1.12);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);opacity:.9;}50%{transform:translateX(-50%) scale(1.14);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-grass" />
          <div className="pq-tree">
            <i className="pq-trunk" />
            <i className="pq-leaves" />
            <span className="pq-tapple" style={{ left: 12, bottom: 44 }}><Apple w={13} /></span>
            <span className="pq-tapple" style={{ left: 38, bottom: 52, animationDelay: '-1.4s' }}><Apple w={13} /></span>
          </div>

          {ok && <span className="pq-anspop">{TARGET}</span>}
          {!ok && <span className="pq-q">?</span>}
          {!ok && <span className="pq-plus">+</span>}

          <div className="pq-groups">
            {/* TO'LA YASHIK — o'nlik: 10 uya, hammasi band */}
            <div className="pq-grp">
              <div className="pq-box">
                {!ok && <span className="pq-blbl">{t.boxLbl}</span>}
                <div className="pq-grid">
                  {Array.from({ length: TEN }).map((_, i) => (
                    <span key={i} className="pq-cell">
                      <Apple w={23} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${0.12 + i * 0.08}s` }}>{i + 1}</b>}
                    </span>
                  ))}
                </div>
              </div>
              <span className="pq-cap">{t.boxCap}</span>
            </div>

            {/* YAKKA — bitta alohida olma, yashikning O'NG tomonida */}
            <div className="pq-grp">
              <span className="pq-single">
                {ok && <b className="pq-cnt big" style={{ animationDelay: '1s' }}>{TARGET}</b>}
                <Apple w={32} />
              </span>
              <span className="pq-cap one">{t.yakkaCap}</span>
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '22%', top: '54px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '58%', top: '62px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '80%', top: '48px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {ok && <span className="pq-chip">{t.chip}</span>}

        <div className="pq-opts">
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.target;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
