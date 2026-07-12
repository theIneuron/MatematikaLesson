// Dars14 · Amaliyot 05 — P13 TEEN ajratish «14 = 10 + ?» · 🔴 · tag: decompose_teen
// SPORT ZALI SAHNASI: deraza + quyosh, bayroqchalar, pol. 14 koptok = 10 UYALI TO'LA YASHIK («10» yorliq)
// + 4 YAKKA koptok yashikning O'NG tomonida toza panjarada. Savol: 14 = 10 + [?] → 4.
// G'alaba: "?" o'rniga yashil 4, chip «14 = 10 + 4», yakka koptoklar 1..4 badge.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUM = 14, TEN = 10, ONES = 4;
const DATA = { num: NUM, ten: TEN, ans: ONES, options: [3, 4, 5], ptype: 'P13', level: '🔴', tag: 'decompose_teen' };

// Koptok ranglari (palitradan) — sanashda ajralib tursin.
const PAL = ['#e2635b', '#4f8fc4', '#f2b134', '#57a84f'];
const BOXB = Array.from({ length: TEN }).map((_, i) => PAL[i % PAL.length]);
const SINGLES = Array.from({ length: ONES }).map((_, i) => PAL[i % PAL.length]);

const T = {
  uz: {
    eyebrow: "Sport zali · Ajratish", title: "14 = 10 + ?",
    setup: "To'la yashik — o'nlik. Yonida yakka koptoklar bor.",
    ask: "O'n va yana nechta? 14 = 10 + ?",
    correct: "Barakalla! To'la yashik — o'nta, yonida to'rtta yakka koptok. 14 — bu 10 va 4!",
    hint: "To'la yashikni sanamang — u o'nlik. Faqat yonidagi yakka koptoklarni sanang.",
    chip: `${NUM} = ${TEN} + ${ONES}`,
    ten10: "10",
  },
  ru: {
    eyebrow: "Спортзал · Разбей", title: "14 = 10 + ?",
    setup: "Полный ящик — это десяток. Рядом отдельные мячи.",
    ask: "Десять и ещё сколько? 14 = 10 + ?",
    correct: "Молодец! Полный ящик — десять, рядом четыре отдельных мяча. 14 — это 10 и 4!",
    hint: "Полный ящик не считайте — это десяток. Сосчитайте только отдельные мячи рядом.",
    chip: `${NUM} = ${TEN} + ${ONES}`,
    ten10: "10",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KOPTOK KANONI (yakka birlik): rangli koptok — oq egri chiziqlar + blik. Bitta koptok = bitta birlik.
const Ball = ({ c = '#e2635b', w = 26 }) => (
  <svg viewBox="0 0 26 26" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="13" cy="13" r="11.5" fill={c} stroke="rgba(0,0,0,.2)" strokeWidth="1" />
    <path d="M2.2 10 Q13 15 23.8 10 M2.2 16 Q13 11 23.8 16" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".75" />
    <ellipse cx="8.6" cy="7.6" rx="3" ry="2" fill="#fff" opacity=".45" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_05(props) {
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
    const correct = picked === DATA.ans;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.ans }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1405">
      <style>{`
        .pq1405{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1405 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a7ec2;text-transform:uppercase;}
        .pq1405 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1405 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1405 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1405 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        /* SPORT ZALI SAHNASI */
        .pq1405 .pq-scene{position:relative;width:392px;max-width:100%;height:252px;border-radius:20px;background:linear-gradient(#eaf4fd 0%,#dcebf8 58%,#cfe1f2 100%);border:2px solid #bcd6ee;overflow:hidden;}
        .pq1405 .pq-win{position:absolute;right:16px;top:14px;width:58px;height:42px;border-radius:6px;background:linear-gradient(135deg,#f4fbff 0 46%,#d4ecfd 46% 54%,#f4fbff 54%);border:3px solid #9dbcda;box-shadow:0 0 16px 3px rgba(200,228,255,.8);animation:pqGlow 3.6s ease-in-out infinite;}
        .pq1405 .pq-win::before,.pq1405 .pq-win::after{content:'';position:absolute;background:#9dbcda;}
        .pq1405 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1405 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1405 .pq-sun{position:absolute;right:24px;top:20px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        /* bayroqchalar ipi */
        .pq1405 .pq-bunting{position:absolute;left:14px;right:110px;top:16px;height:16px;z-index:1;}
        .pq1405 .pq-bunting::before{content:'';position:absolute;left:0;right:0;top:0;height:2px;background:#9dbcda;border-radius:2px;}
        .pq1405 .pq-flag{position:absolute;top:2px;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;transform-origin:top center;animation:pqFlag 3.4s ease-in-out infinite;}
        .pq1405 .pq-flag.f1{left:8%;border-top:12px solid #e2635b;}
        .pq1405 .pq-flag.f2{left:30%;border-top:12px solid #f2b134;animation-delay:-.8s;}
        .pq1405 .pq-flag.f3{left:52%;border-top:12px solid #57a84f;animation-delay:-1.6s;}
        .pq1405 .pq-flag.f4{left:74%;border-top:12px solid #4f8fc4;animation-delay:-2.4s;}
        /* pol */
        .pq1405 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#e0b871,#c99a4e);border-top:3px solid #eecf94;}
        .pq1405 .pq-floor::before{content:'';position:absolute;left:0;right:0;top:12px;height:2px;background:rgba(120,80,20,.28);}
        /* model qatori: to'la yashik | + | yakka koptoklar */
        .pq1405 .pq-model{position:absolute;left:0;right:0;bottom:32px;display:flex;justify-content:center;align-items:flex-end;gap:16px;z-index:3;}
        .pq1405 .pq-boxx{position:relative;padding:8px 9px 10px;border-radius:11px;background:linear-gradient(#d9a561,#c08a45);border:2.5px solid #96662b;box-shadow:0 4px 0 #7d5423,0 6px 9px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.25);}
        .pq1405 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:4px;}
        .pq1405 .pq-cell{position:relative;width:28px;height:28px;border-radius:8px;background:rgba(70,40,10,.22);box-shadow:inset 0 2px 4px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;}
        .pq1405 .pq-tenlbl{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.16);z-index:4;font-variant-numeric:tabular-nums;}
        .pq1405 .pq-plus{font-size:26px;font-weight:900;color:#3a7ec2;padding-bottom:24px;opacity:.8;}
        /* yakka koptoklar — toza 2×2 panjara (yashik O'NG tomonida) */
        .pq1405 .pq-singles{position:relative;display:grid;grid-template-columns:repeat(2,auto);gap:6px;padding:0 2px;}
        .pq1405 .pq-sp{position:relative;animation:pqBob 3s ease-in-out infinite;}
        .pq1405 .pq-sp:nth-child(2){animation-delay:-.7s;} .pq1405 .pq-sp:nth-child(3){animation-delay:-1.4s;} .pq1405 .pq-sp:nth-child(4){animation-delay:-2.1s;}
        .pq1405 .pq-cnt{position:absolute;top:-10px;left:50%;transform:translateX(-50%);min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:5;font-variant-numeric:tabular-nums;}
        .pq1405 .pq-q{position:absolute;top:-26px;left:50%;transform:translateX(-50%);font-size:34px;font-weight:900;color:#3a7ec2;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqBreath 1.8s ease-in-out infinite;z-index:5;}
        .pq1405 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1405 .pq-star.s2{animation-delay:-.5s;} .pq1405 .pq-star.s3{animation-delay:-1s;}
        /* tenglama satri */
        .pq1405 .pq-eq{display:flex;justify-content:center;align-items:center;gap:7px;}
        .pq1405 .pq-eq b{min-width:40px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#f0f6fd;border:2px solid #bcd6ee;color:#2f5ca8;font-variant-numeric:tabular-nums;}
        .pq1405 .pq-eq b.num{background:#eef3fd;border-color:#c3d4ee;color:#2f5ca8;}
        .pq1405 .pq-eq b.hole{background:#fff;border:2.5px dashed #9dbcda;color:#3a7ec2;}
        .pq1405 .pq-eq b.ans{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1405 .pq-eq i{font-style:normal;font-size:22px;font-weight:900;color:#8a94a2;}
        /* chip */
        .pq1405 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:999px;background:#e8f0fb;border:2px solid #b7cfec;color:#2f5ca8;font-size:16px;font-weight:800;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        /* variantlar */
        .pq1405 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:2px;}
        .pq1405 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1405 .pq-opt:hover:not(:disabled){border-color:#8fb6de;transform:translateY(-2px);}
        .pq1405 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1405 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1405 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1405 .pq-opt:disabled{cursor:default;}
        .pq1405 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1405 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1405 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 12px 2px rgba(200,228,255,.6);}50%{box-shadow:0 0 20px 5px rgba(200,228,255,.9);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqFlag{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
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
          <span className="pq-win" /><span className="pq-sun" />
          <div className="pq-bunting">
            <span className="pq-flag f1" /><span className="pq-flag f2" /><span className="pq-flag f3" /><span className="pq-flag f4" />
          </div>
          <span className="pq-floor" />

          <div className="pq-model">
            {/* TO'LA YASHIK — o'nlik, "10" yorlig'i */}
            <div className="pq-boxx">
              <span className="pq-tenlbl">{t.ten10}</span>
              <div className="pq-grid">
                {BOXB.map((c, i) => (
                  <span key={i} className="pq-cell"><Ball c={c} w={22} /></span>
                ))}
              </div>
            </div>

            <span className="pq-plus">+</span>

            {/* YAKKA koptoklar — birliklar, alohida toza panjarada */}
            <div className="pq-singles">
              {!ok && <span className="pq-q">?</span>}
              {SINGLES.map((c, i) => (
                <span key={i} className="pq-sp">
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>{i + 1}</b>}
                  <Ball c={c} w={30} />
                </span>
              ))}
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '20%', top: '44px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '58%', top: '52px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '82%', top: '38px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {/* tenglama: 14 = 10 + [?] */}
        <div className="pq-eq">
          <b className="num">{NUM}</b>
          <i>=</i>
          <b>{TEN}</b>
          <i>+</i>
          {ok ? <b className="ans">{ONES}</b> : <b className="hole">?</b>}
        </div>

        {ok && <span className="pq-chip">{t.chip}</span>}

        <div className="pq-opts">
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.ans;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
