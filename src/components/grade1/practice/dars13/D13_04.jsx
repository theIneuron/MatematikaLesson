// Dars13 · Amaliyot 04 — P13 O'nlikka to'ldirish «Qalam do'koni» · 🟡 · tag: complete_ten
// 10 katakli qalam-quti: 7 joyda qalam, 3 bo'sh. Yetti va yana uch — o'nta, dasta to'ladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const HAVE = 7, NEED = 3, TEN = 10;
const DATA = { have: HAVE, target: NEED, options: [2, 3, 4], ptype: 'P13', level: '🟡', tag: 'complete_ten' };

// Qalam tanasi rang palitrasi (sariq / qizil / ko'k / yashil — 2-3 ton).
const PAL = [
  { body: '#f2b134', light: '#f9ce74', dark: '#cd9421' }, // sariq
  { body: '#d9534b', light: '#e88881', dark: '#b13a33' }, // qizil
  { body: '#4f8fc4', light: '#83b1d9', dark: '#396f9c' }, // ko'k
  { body: '#57a84f', light: '#87c580', dark: '#42813e' }, // yashil
];
// 10 katak (5×2). Dastlab 0..6 to'la, 7..9 bo'sh (shtrix).
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Qalam do'koni · To'ldirish", title: "O'nlikka nechta yetmaydi?",
    setup: "Qutida o'nta joy bor, yettitasida qalam turibdi. Dasta to'lishi kerak!",
    ask: "O'nlikni to'ldirish uchun yana nechta qalam kerak?",
    correct: "Barakalla! Yetti va yana uch — o'nta. Dasta to'ldi!",
    hint: "Bo'sh joylarni sanang: nechta qalam qo'shsak, quti to'ladi?",
  },
  ru: {
    eyebrow: "Магазин карандашей · Дополни", title: "Сколько не хватает до десятка?",
    setup: "В коробке десять мест, в семи стоят карандаши. Пачка должна заполниться!",
    ask: "Сколько карандашей нужно добавить, чтобы получился десяток?",
    correct: "Молодец! Семь и ещё три — десять. Пачка полная!",
    hint: "Сосчитай пустые места: сколько карандашей добавить, чтобы коробка заполнилась?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uchi + yog'och konus,
// rangli tana (2-3 ton, chap yorug'lik strip / o'ng soya), metall halqa, pushti o'chirg'ich.
const Pencil = ({ c }) => (
  <svg viewBox="0 0 22 76" width="20" height="66" aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="11,2 8.2,10 13.8,10" fill="#3b3b42" />
    <polygon points="11,2 4.5,17 17.5,17" fill="#edc689" />
    <polygon points="11,2 11,17 4.5,17" fill="#d6a765" opacity=".7" />
    <rect x="4.5" y="16.5" width="13" height="44" rx="1" fill={c.body} />
    <rect x="4.5" y="16.5" width="3.8" height="44" fill={c.light} opacity=".6" />
    <rect x="14" y="16.5" width="3.5" height="44" fill={c.dark} opacity=".55" />
    <rect x="4.5" y="60" width="13" height="7" rx="1" fill="#ced1d7" />
    <rect x="4.5" y="62" width="13" height="1.4" fill="#a6aab2" />
    <rect x="4.5" y="64.6" width="13" height="1.4" fill="#b8bbc2" />
    <rect x="5" y="66.5" width="12" height="8.6" rx="2.6" fill="#ea90b5" />
    <rect x="6" y="67.6" width="3" height="6.4" rx="1.5" fill="#f6bdd6" opacity=".7" />
  </svg>
);

export default function D13_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda qalam-tushish qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1304">
      <style>{`
        .pq1304{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1304 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1304 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1304 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1304 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1304 .pq-scene{position:relative;width:340px;max-width:100%;height:252px;margin:0 auto;border-radius:20px;background:linear-gradient(#f3e2c6 0%,#eed7b2 46%,#e7c99b 100%);border:2px solid #d9be92;overflow:hidden;}
        .pq1304 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #b98f52;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1304 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b98f52;transform:translateX(-1px);}
        .pq1304 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1304 .pq-lamp{position:absolute;left:36px;top:0;width:2px;height:20px;background:#8a5628;z-index:1;}
        .pq1304 .pq-lampshade{position:absolute;left:24px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1304 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1304 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}
        .pq1304 .pq-jar{position:absolute;left:12px;bottom:26px;width:30px;height:34px;z-index:3;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1304 .pq-jar .cup{position:absolute;left:0;bottom:0;width:30px;height:22px;border-radius:5px 5px 8px 8px;background:linear-gradient(#d7e6ef,#b6cede);border:1.6px solid #8fa9bc;}
        .pq1304 .pq-jar .p{position:absolute;bottom:16px;width:4px;height:16px;border-radius:2px;}
        .pq1304 .pq-jar .p.a{left:6px;background:#f2b134;} .pq1304 .pq-jar .p.b{left:13px;height:19px;background:#4f8fc4;} .pq1304 .pq-jar .p.c{left:20px;background:#d9534b;}
        .pq1304 .pq-tag{position:absolute;right:16px;bottom:118px;width:26px;height:16px;background:#f6c651;border:1.6px solid #cf9a2a;border-radius:3px 8px 8px 3px;z-index:3;transform:rotate(-8deg);transform-origin:left center;animation:pqTag 3s ease-in-out infinite;box-shadow:0 2px 3px rgba(0,0,0,.14);}
        .pq1304 .pq-tag::before{content:'';position:absolute;left:3px;top:5px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #cf9a2a;}
        .pq1304 .pq-tag::after{content:'';position:absolute;left:9px;top:6px;right:4px;height:2px;background:#cf9a2a;border-radius:2px;box-shadow:0 4px 0 #cf9a2a;}

        .pq1304 .pq-box{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);padding:11px 12px 13px;border-radius:16px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 7px 15px rgba(0,0,0,.24),inset 0 2px 0 rgba(255,255,255,.28);z-index:4;}
        .pq1304 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1304 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,33px);grid-auto-rows:74px;gap:5px;}
        .pq1304 .pq-cell{position:relative;border-radius:9px;background:rgba(255,250,239,.42);border:1.6px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;}
        .pq1304 .pq-cell.empty{background:rgba(255,255,255,.2);border-style:dashed;border-color:rgba(120,74,32,.62);}
        .pq1304 .pq-penw{position:relative;line-height:0;}
        .pq1304 .pq-penw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1304 .pq-pen{display:block;position:relative;animation:pqSway 2.9s ease-in-out infinite;animation-delay:var(--sd,0s);transform-origin:bottom center;}
        .pq1304 .pq-q{font-size:23px;font-weight:900;color:#a06a2e;opacity:.7;animation:pqQ 1.9s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq1304 .pq-cnt{position:absolute;top:-7px;right:-5px;min-width:17px;height:17px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1304 .pq-band{position:absolute;left:-15px;right:-15px;top:64px;height:15px;border-radius:4px;background:linear-gradient(#e8635b,#cf3f38);box-shadow:0 2px 5px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.32);z-index:5;transform-origin:center;animation:pqBand .5s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1304 .pq-tenlbl{position:absolute;top:60px;right:-24px;z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:13px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .18s both;}
        .pq1304 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1304 .pq-spark.s2{animation-delay:-.6s;} .pq1304 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1304 .pq-eq7{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1304 .pq-eq7 b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1304 .pq-eq7 b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1304 .pq-eq7 i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1304 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1304 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1304 .pq-opt:hover:not(:disabled){border-color:#e2c79a;transform:translateY(-2px);}
        .pq1304 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1304 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1304 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1304 .pq-opt:disabled{cursor:default;}
        .pq1304 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1304 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1304 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-72px) scale(.85);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqQ{0%,100%{transform:scale(1);opacity:.55;}50%{transform:scale(1.18);opacity:.9;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqBand{0%{opacity:0;transform:scaleX(.1);}60%{opacity:1;transform:scaleX(1.04);}100%{transform:scaleX(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqTag{0%,100%{transform:rotate(-8deg);}50%{transform:rotate(-3deg);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-tag" />
        <span className="pq-counter" />
        <span className="pq-jar"><span className="p a" /><span className="p b" /><span className="p c" /><span className="cup" /></span>

        <div className={'pq-box' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')}>
                  {show ? (
                    <span className={'pq-penw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.16}s` }}>
                      <span className="pq-pen" style={{ '--sd': `${(s.i * 0.16).toFixed(2)}s` }}><Pencil c={s.c} /></span>
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${s.i * 0.05}s` }}>{s.i + 1}</b>}
                    </span>
                  ) : (
                    <span className="pq-q" style={{ '--sd': `${(s.i - HAVE) * 0.3}s` }}>?</span>
                  )}
                </div>
              );
            })}
            {ok && <span className="pq-band" />}
            {ok && <span className="pq-tenlbl">{TEN}</span>}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '58px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '78px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '44px' }}>✦</span>
        </>)}
      </div>

      {ok && (<div className="pq-eq7"><b>{HAVE}</b><i>+</i><b>{NEED}</b><i>=</i><b className="ten">{TEN}</b></div>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
