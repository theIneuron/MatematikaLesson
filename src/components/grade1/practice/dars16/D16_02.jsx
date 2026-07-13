// Dars16 · Amaliyot 02 — P16 O'nlikka to'ldirish «Shirinlik do'koni» · 🟡 · tag: make_ten
// 10 uyali shirinlik qutisi (5×2): 8 uyada konfet, 2 uya bo'sh. Sakkiz va yana ikki — o'nta.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const HAVE = 8, NEED = 2, TEN = 10;
const DATA = { have: HAVE, need: NEED, target: NEED, options: [1, 2, 3], ptype: 'P16', level: '🟡', tag: 'make_ten' };

// Konfet rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma, 2-ton radial).
const PAL = [
  { core: '#e2635b', edge: '#b83c34' }, // qizil
  { core: '#4a90d9', edge: '#2c66a8' }, // ko'k
  { core: '#f2b134', edge: '#cd8f1c' }, // sariq
  { core: '#57a84f', edge: '#3c7d36' }, // yashil
  { core: '#e879a6', edge: '#c14e7f' }, // pushti
];
// 10 uya (5×2). Dastlab 0..7 to'la (8 dona), 8..9 bo'sh.
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · To'ldirish", title: "O'nlikka nechta yetmaydi?",
    setup: "Qutida o'nta uya bor, sakkiztasida shirinlik turibdi. Quti to'lishi kerak!",
    ask: "O'nlikni to'ldirish uchun yana nechta shirinlik kerak?",
    correct: "Barakalla! Sakkiz va yana ikki — o'nta. Quti to'ldi!",
    hint: "Bo'sh uyalarni sanang: nechta shirinlik qo'ysak, quti to'ladi?",
  },
  ru: {
    eyebrow: "Магазин сладостей · Дополни", title: "Сколько не хватает до десятка?",
    setup: "В коробке десять ячеек, в восьми лежат конфеты. Коробка должна заполниться!",
    ask: "Сколько конфет нужно добавить, чтобы получился десяток?",
    correct: "Молодец! Восемь и ещё две — десять. Коробка полная!",
    hint: "Сосчитай пустые ячейки: сколько конфет положить, чтобы коробка заполнилась?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KONFET KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira +
// oq blik + ikki chetdan burama o'ram detali. Bitta konfet = bitta birlik.
const Candy = ({ c, id }) => (
  <svg viewBox="0 0 40 30" width="34" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={`cg${id}`} cx="38%" cy="34%" r="72%">
        <stop offset="0%" stopColor={c.core} />
        <stop offset="70%" stopColor={c.core} />
        <stop offset="100%" stopColor={c.edge} />
      </radialGradient>
    </defs>
    {/* chap o'ram */}
    <polygon points="8,15 1,8 3,15 1,22" fill={c.edge} />
    <polygon points="8,15 3,10 4,15 3,20" fill={c.core} opacity=".85" />
    {/* o'ng o'ram */}
    <polygon points="32,15 39,8 37,15 39,22" fill={c.edge} />
    <polygon points="32,15 37,10 36,15 37,20" fill={c.core} opacity=".85" />
    {/* asosiy doira */}
    <circle cx="20" cy="15" r="11" fill={`url(#cg${id})`} stroke={c.edge} strokeWidth="1" />
    {/* burama tikuv chiziqlari */}
    <path d="M9.5 12 Q11 15 9.5 18" fill="none" stroke={c.edge} strokeWidth=".9" opacity=".6" />
    <path d="M30.5 12 Q29 15 30.5 18" fill="none" stroke={c.edge} strokeWidth=".9" opacity=".6" />
    {/* oq blik */}
    <ellipse cx="16" cy="11" rx="3.6" ry="2.4" fill="#fff" opacity=".55" />
    <circle cx="23" cy="18" r="1.3" fill="#fff" opacity=".4" />
  </svg>
);

export default function D16_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda konfet-tushish qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq1602">
      <style>{`
        .pq1602{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1602 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c94f7f;text-transform:uppercase;}
        .pq1602 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1602 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1602 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1602 .pq-scene{position:relative;width:352px;max-width:100%;height:250px;margin:0 auto;border-radius:20px;background:linear-gradient(#fce7f0 0%,#f8d6e4 46%,#f2c3d5 100%);border:2px solid #e6b4cb;overflow:hidden;}
        .pq1602 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #d38fae;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1602 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#d38fae;transform:translateX(-1px);}
        .pq1602 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1602 .pq-lamp{position:absolute;left:36px;top:0;width:2px;height:20px;background:#a35478;z-index:1;}
        .pq1602 .pq-lampshade{position:absolute;left:24px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1602 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#d98aab,#bd6088);border-top:3px solid #a24d72;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.22);}
        .pq1602 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,30,54,.3);}
        .pq1602 .pq-jar{position:absolute;left:12px;bottom:26px;width:32px;height:38px;z-index:3;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1602 .pq-jar .glass{position:absolute;left:0;bottom:0;width:32px;height:34px;border-radius:6px 6px 9px 9px;background:linear-gradient(rgba(223,240,251,.75),rgba(182,206,222,.75));border:1.6px solid #9bb4c6;}
        .pq1602 .pq-jar .lid{position:absolute;left:4px;top:-4px;width:24px;height:7px;border-radius:4px;background:#c96;border:1.5px solid #a4763f;}
        .pq1602 .pq-jar .d{position:absolute;width:8px;height:8px;border-radius:50%;}
        .pq1602 .pq-jar .d1{left:5px;bottom:8px;background:radial-gradient(circle at 38% 34%,#f18f88,#c1443b);}
        .pq1602 .pq-jar .d2{left:15px;bottom:6px;background:radial-gradient(circle at 38% 34%,#7fb0e0,#376fa8);}
        .pq1602 .pq-jar .d3{left:11px;bottom:16px;background:radial-gradient(circle at 38% 34%,#f6cb62,#cd8f1c);}
        .pq1602 .pq-tag{position:absolute;right:16px;bottom:118px;width:26px;height:16px;background:#f6c651;border:1.6px solid #cf9a2a;border-radius:3px 8px 8px 3px;z-index:3;transform:rotate(-8deg);transform-origin:left center;animation:pqTag 3s ease-in-out infinite;box-shadow:0 2px 3px rgba(0,0,0,.14);}
        .pq1602 .pq-tag::before{content:'';position:absolute;left:3px;top:5px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #cf9a2a;}
        .pq1602 .pq-tag::after{content:'';position:absolute;left:9px;top:6px;right:4px;height:2px;background:#cf9a2a;border-radius:2px;box-shadow:0 4px 0 #cf9a2a;}

        .pq1602 .pq-tray{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);padding:11px 12px 13px;border-radius:16px;background:linear-gradient(#f4ede2,#e5d7c2);border:2.5px solid #cbb693;box-shadow:0 7px 15px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.5);z-index:4;}
        .pq1602 .pq-tray.win{animation:pqTrayCele .55s ease;}
        .pq1602 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,44px);grid-auto-rows:40px;gap:6px;}
        .pq1602 .pq-cell{position:relative;border-radius:10px;background:rgba(255,250,244,.6);border:1.6px solid rgba(150,110,60,.32);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 3px rgba(120,80,40,.12);}
        .pq1602 .pq-cell.empty{background:rgba(255,255,255,.28);border-style:dashed;border-color:rgba(150,110,60,.55);animation:pqBreath 1.9s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq1602 .pq-canw{position:relative;line-height:0;}
        .pq1602 .pq-canw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1602 .pq-can{display:block;position:relative;}
        .pq1602 .pq-q{font-size:22px;font-weight:900;color:#c07a34;opacity:.7;}
        .pq1602 .pq-cnt{position:absolute;top:-7px;right:-4px;min-width:17px;height:17px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1602 .pq-fulllbl{position:absolute;top:-14px;right:-20px;z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:13px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .18s both;}
        .pq1602 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1602 .pq-spark.s2{animation-delay:-.6s;} .pq1602 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1602 .pq-eq7{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1602 .pq-eq7 b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fdeef4;border:2px solid #e8b4cc;color:#b3416f;font-variant-numeric:tabular-nums;}
        .pq1602 .pq-eq7 b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1602 .pq-eq7 i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1602 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1602 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1602 .pq-opt:hover:not(:disabled){border-color:#e8b4cc;transform:translateY(-2px);}
        .pq1602 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1602 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1602 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1602 .pq-opt:disabled{cursor:default;}
        .pq1602 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1602 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1602 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-64px) scale(.85);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.04);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqTag{0%,100%{transform:rotate(-8deg);}50%{transform:rotate(-3deg);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqTrayCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-tag" />
        <span className="pq-counter" />
        <span className="pq-jar"><span className="lid" /><span className="d d1" /><span className="d d2" /><span className="d d3" /><span className="glass" /></span>

        <div className={'pq-tray' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')} style={!show ? { '--sd': `${(s.i - HAVE) * 0.3}s` } : undefined}>
                  {show ? (
                    <span className={'pq-canw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.16}s` }}>
                      <span className="pq-can"><Candy c={s.c} id={s.i} /></span>
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${s.i * 0.05}s` }}>{s.i + 1}</b>}
                    </span>
                  ) : (
                    <span className="pq-q">?</span>
                  )}
                </div>
              );
            })}
            {ok && <span className="pq-fulllbl">{TEN}</span>}
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
