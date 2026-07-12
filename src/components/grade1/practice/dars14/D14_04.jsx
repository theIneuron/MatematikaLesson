// Dars14 · Amaliyot 04 — P13 TEEN YASASH «O'yinchoq do'koni» · 🟡 · tag: compose_teen
// O'YINCHOQ DO'KONI: javon, deraza + quyosh, osma chiroq. Tokchada 10 UYALI AYIQCHA YASHIGI (2×5, to'la).
// O'n uchni yasash uchun yoniga nechta YAKKA ayiqcha qo'yiladi? To'la yashik ALOHIDA («10» yorlig'i),
// yakka joy ALOHIDA (dashed slot + «?» puls) — misconception qalqoni.
// G'alaba: 3 yakka ayiqcha pop bilan paydo bo'ladi, yashik 1..10 + yakkalar 11..13 sanoq-badge, chip «10 + 3 = 13».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { ten: 10, target: 13, need: 3, options: [2, 3, 4], ptype: 'P13', level: '🟡', tag: 'compose_teen' };
const TEN = DATA.ten, NEED = DATA.need, TARGET = DATA.target;

const T = {
  uz: {
    eyebrow: "O'yinchoq do'koni · O'nlik va birlik", title: "O'n uchni yasang",
    setup: "Tokchada to'la ayiqcha yashigi turibdi — bu o'nlik.",
    ask: "O'n uchni (13) yasash uchun yoniga nechta yakka ayiqcha qo'yiladi?",
    correct: "Barakalla! To'la yashik (o'n) va uch yakka — o'n uch. 10 va 3 — 13!",
    hint: "To'la yashikda o'nta ayiqcha bor. O'ndan keyin yakkalarni sanang: o'n uchga nechta yakka yetadi?",
  },
  ru: {
    eyebrow: "Магазин игрушек · Десяток и единицы", title: "Собери тринадцать",
    setup: "На полке стоит полный ящик мишек — это десяток.",
    ask: "Сколько отдельных мишек поставить рядом, чтобы получилось тринадцать (13)?",
    correct: "Молодец! Полный ящик (десять) и три отдельных — тринадцать. Десять и три — 13!",
    hint: "В полном ящике десять мишек. Считайте отдельных после десяти: сколько единиц нужно до тринадцати?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// AYIQCHA KANONI (yakka birlik): o'tirgan o'yinchoq ayiq — quloqlar, tumshuq, ko'zlar, qorincha.
// Bitta ayiqcha = bitta birlik.
const Bear = ({ w = 30 }) => (
  <svg viewBox="0 0 30 32" width={w} height={(w * 32) / 30} aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="8" cy="7" r="4.4" fill="#c98f4e" /><circle cx="22" cy="7" r="4.4" fill="#c98f4e" />
    <circle cx="8" cy="7" r="2" fill="#e8bd85" /><circle cx="22" cy="7" r="2" fill="#e8bd85" />
    <ellipse cx="15" cy="26" rx="8.4" ry="5.6" fill="#d9a05b" stroke="#a9743a" strokeWidth="1" />
    <ellipse cx="15" cy="27" rx="4" ry="3.2" fill="#f2d9ae" />
    <circle cx="15" cy="12" r="9" fill="#d9a05b" stroke="#a9743a" strokeWidth="1" />
    <ellipse cx="15" cy="15.5" rx="4.4" ry="3.4" fill="#f2d9ae" />
    <circle cx="11.8" cy="10.4" r="1.3" fill="#3a2c1c" /><circle cx="18.2" cy="10.4" r="1.3" fill="#3a2c1c" />
    <ellipse cx="15" cy="14.2" rx="1.6" ry="1.2" fill="#5a3d22" />
    <path d="M15 15.4 Q15 16.8 16.6 17" fill="none" stroke="#5a3d22" strokeWidth=".9" strokeLinecap="round" />
  </svg>
);

export default function D14_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda yakka-ayiqcha pop qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.need;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.need }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1404">
      <style>{`
        .pq1404{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1404 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7c62b8;text-transform:uppercase;}
        .pq1404 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1404 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1404 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        /* O'YINCHOQ DO'KONI (binafsha-krem) */
        .pq1404 .pq-scene{position:relative;width:372px;max-width:100%;height:256px;margin:0 auto;border-radius:20px;background:linear-gradient(#f1ecfb 0%,#e6ddf6 46%,#d9cdee 100%);border:2px solid #cfc0e8;overflow:hidden;}
        .pq1404 .pq-lamp{position:absolute;left:34px;top:0;width:2px;height:20px;background:#7c62b8;z-index:1;}
        .pq1404 .pq-lampshade{position:absolute;left:22px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1404 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #a68cc9;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1404 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#a68cc9;transform:translateX(-1px);}
        .pq1404 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        /* osilgan sharcha dekor */
        .pq1404 .pq-balloon{position:absolute;left:120px;top:0;width:2px;height:22px;background:#b39ad6;z-index:1;}
        .pq1404 .pq-balloon b{position:absolute;left:-9px;top:20px;width:19px;height:23px;border-radius:50% 50% 48% 48%;background:radial-gradient(circle at 38% 32%,#8fd0f2,#4f8fc4);transform-origin:top center;animation:pqSwing 3.4s ease-in-out infinite;box-shadow:0 2px 3px rgba(60,60,120,.22);}
        .pq1404 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1404 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:12px;height:2px;background:rgba(90,54,20,.35);}
        /* markaziy sahna: TO'LA YASHIK + «plus» + yakka joy */
        .pq1404 .pq-row{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);display:flex;align-items:flex-end;gap:11px;z-index:4;}
        /* TO'LA YASHIK (o'nlik): 10 uya × ayiqcha + «10» yorlig'i */
        .pq1404 .pq-boxx{position:relative;padding:7px 8px 9px;border-radius:11px;background:linear-gradient(#b39ad6,#9b7cc4);border:2.5px solid #7a5aa5;box-shadow:0 4px 0 #64478c,0 6px 9px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.3);}
        .pq1404 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:4px;}
        .pq1404 .pq-cell{position:relative;width:30px;height:32px;border-radius:8px;background:rgba(45,25,80,.22);box-shadow:inset 0 2px 4px rgba(0,0,0,.26);display:flex;align-items:flex-end;justify-content:center;padding-bottom:1px;}
        .pq1404 .pq-tenlbl{position:absolute;left:50%;top:-14px;transform:translateX(-50%);z-index:5;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;}
        .pq1404 .pq-cnt{position:absolute;top:-8px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;}
        /* plus */
        .pq1404 .pq-plus{align-self:center;margin-bottom:10px;font-size:24px;font-weight:900;color:#7c62b8;opacity:.75;}
        /* yakka joy — dashed slot + «?» puls; g'alabada ayiqchalar pop (yashik O'NG tomonida, toza ustuncha) */
        .pq1404 .pq-singles{display:flex;align-items:flex-end;gap:6px;}
        .pq1404 .pq-slot{position:relative;width:36px;height:40px;border-radius:9px;display:flex;align-items:flex-end;justify-content:center;box-sizing:border-box;}
        .pq1404 .pq-slot.empty{border:2px dashed rgba(100,71,140,.55);background:rgba(255,255,255,.28);animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1404 .pq-q{font-size:22px;font-weight:900;color:#7c62b8;opacity:.75;margin-bottom:8px;animation:pqQ 1.9s ease-in-out infinite;}
        .pq1404 .pq-single{position:relative;line-height:0;}
        .pq1404 .pq-single.in{animation:pqPopIn .5s cubic-bezier(.3,1.3,.5,1) both;}
        /* g'alaba uchqunlari */
        .pq1404 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1404 .pq-spark.s2{animation-delay:-.6s;} .pq1404 .pq-spark.s3{animation-delay:-1.15s;}
        /* natija tenglamasi chip: 10 + 3 = 13 */
        .pq1404 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1404 .pq-eq b{min-width:38px;height:40px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#f3effb;border:2px solid #cfc0e8;color:#64478c;font-variant-numeric:tabular-nums;}
        .pq1404 .pq-eq b.ten{background:#fdecec;border-color:#cf3f38;color:#cf3f38;}
        .pq1404 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1404 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1404 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1404 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1404 .pq-opt:hover:not(:disabled){border-color:#b39ad6;transform:translateY(-2px);}
        .pq1404 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1404 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1404 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1404 .pq-opt:disabled{cursor:default;}
        .pq1404 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1404 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1404 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSwing{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:rgba(100,71,140,.55);}50%{transform:scale(1.05);border-color:rgba(124,98,184,.85);}}
        @keyframes pqQ{0%,100%{transform:scale(1);opacity:.55;}50%{transform:scale(1.18);opacity:.9;}}
        @keyframes pqPopIn{0%{opacity:0;transform:translateY(-16px) scale(.7);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-balloon"><b /></span>
        <span className="pq-counter" />

        <div className="pq-row">
          {/* TO'LA YASHIK — o'nlik, aynan 10 ayiqcha + «10» */}
          <div className="pq-boxx">
            <span className="pq-tenlbl">{TEN}</span>
            <div className="pq-grid">
              {Array.from({ length: TEN }).map((_, i) => (
                <span key={i} className="pq-cell">
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>{i + 1}</b>}
                  <Bear w={26} />
                </span>
              ))}
            </div>
          </div>

          <span className="pq-plus">+</span>

          {/* YAKKA joy — javobdan OLDIN bitta «?» maydon (slot soni javobni bermasin);
              g'alabada NEED ta ayiqcha birma-bir pop, badge 11..13 */}
          <div className="pq-singles">
            {ok ? Array.from({ length: NEED }).map((_, j) => (
              <div key={j} className="pq-slot full">
                <span className={'pq-single' + (still ? '' : ' in')} style={still ? undefined : { animationDelay: `${0.55 + j * 0.16}s` }}>
                  <b className="pq-cnt" style={{ animationDelay: `${0.7 + j * 0.16}s` }}>{TEN + j + 1}</b>
                  <Bear w={32} />
                </span>
              </div>
            )) : (
              <div className="pq-slot empty"><span className="pq-q">?</span></div>
            )}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '22%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '78%', top: '70px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {ok && (<div className="pq-eq"><b className="ten">{TEN}</b><i>+</i><b>{NEED}</b><i>=</i><b className="res">{TARGET}</b></div>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.need;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
