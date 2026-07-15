// Dars16 · Amaliyot 09 — og'zaki masala (yopiq quti, xayolan hisob) «Shirinlik do'koni» · 🔴 · tag: make_ten_word
// Quti QOPQOQ bilan yopiq — uyalarni sanab bo'lmaydi. Ichida 3 ta shirinlik, sig'imi 10.
// Bola 10 gacha nechta yetishmasligini XAYOLAN hisoblaydi. 4 variant: 6/8 (bittaga adashish),
// 13 (3 + 10 — «qo'shib yuboradi» misconception). G'alaba: qopqoq ochiladi, bo'sh uyalar
// to'ladi, sanash-badge'lar, chip «3 + 7 = 10».
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const HAVE = 3, NEED = 7, TEN = 10;
const DATA = { have: HAVE, need: NEED, target: NEED, options: [6, 7, 8, 13], ptype: 'P16', level: '🔴', tag: 'make_ten_word' };

// Shirinlik palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma, 2-ton).
const PAL = [
  { body: '#e2635b', light: '#f3a19b', dark: '#b63f38' }, // qizil
  { body: '#4a90d9', light: '#8fbdea', dark: '#316aa8' }, // ko'k
  { body: '#f2b134', light: '#f9d484', dark: '#cd9421' }, // sariq
  { body: '#57a84f', light: '#8fca88', dark: '#42813e' }, // yashil
  { body: '#e879a6', light: '#f4aecb', dark: '#c1547f' }, // pushti
];
// 10 uyacha (5×2). Dastlab 0..2 to'la, 3..9 bo'sh (shtrix).
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · Og'zaki masala", title: "O'nlikni to'ldiring",
    setup: "Yopiq qutida 3 ta shirinlik bor. Qutiga jami 10 ta sig'adi.",
    ask: "Quti to'lishi uchun yana nechta shirinlik kerak?",
    correct: "Barakalla! 3 + 7 = 10. Quti to'ldi!",
    hint: "Xayolan sanang: 3 dan 10 gacha nechta qadam bor?",
    lidCap: "10 o'rinli quti",
    lidIn: "Ichida: 3",
  },
  ru: {
    eyebrow: "Магазин сладостей · Задача", title: "Дополни до десятка",
    setup: "В закрытой коробке 3 конфеты. Всего в неё помещается 10.",
    ask: "Сколько конфет ещё нужно, чтобы коробка стала полной?",
    correct: "Молодец! 3 + 7 = 10. Коробка полная!",
    hint: "Посчитай в уме: сколько шагов от 3 до 10?",
    lidCap: "Коробка на 10",
    lidIn: "Внутри: 3",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira +
// oq blik + ikki tomonda yengil o'ram (burama) uchlari. Bitta konfet = bitta birlik.
const Candy = ({ c, gid }) => (
  <svg viewBox="0 0 40 28" width="34" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={gid} cx="38%" cy="34%" r="72%">
        <stop offset="0%" stopColor={c.light} />
        <stop offset="52%" stopColor={c.body} />
        <stop offset="100%" stopColor={c.dark} />
      </radialGradient>
    </defs>
    <path d="M7 14 L1.5 8 Q0.5 14 1.5 20 Z" fill={c.body} />
    <path d="M7 14 L1.5 8 Q0.5 14 1.5 20 Z" fill={c.dark} opacity=".35" />
    <path d="M33 14 L38.5 8 Q39.5 14 38.5 20 Z" fill={c.body} />
    <path d="M33 14 L38.5 8 Q39.5 14 38.5 20 Z" fill={c.dark} opacity=".35" />
    <circle cx="20" cy="14" r="11" fill={`url(#${gid})`} stroke={c.dark} strokeWidth=".8" />
    <path d="M14 18.5 Q20 14 26 18.5" stroke="#fff" strokeWidth="1" fill="none" opacity=".28" />
    <ellipse cx="16" cy="10" rx="3.4" ry="2.2" fill="#fff" opacity=".72" />
  </svg>
);

export default function D16_09(props) {
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
  const [fitRef, scale] = useFitScale(344);

  return (
    <div className="pq pq1609" ref={fitRef}>
      <style>{`
        .pq1609{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1609 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c25d8a;text-transform:uppercase;}
        .pq1609 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1609 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1609 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1609 .pq-scene{box-sizing:border-box;position:relative;width:344px;height:222px;border-radius:20px;background:linear-gradient(#fbe6ef 0%,#f7d3e2 48%,#f2c0d3 100%);border:2px solid #e6b6cc;overflow:hidden;}
        .pq1609 .pq-fit{position:relative;margin:0 auto;}
        .pq1609 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #c98fa8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1609 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#c98fa8;transform:translateX(-1px);}
        .pq1609 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1609 .pq-lamp{position:absolute;left:36px;top:0;width:2px;height:20px;background:#9a5c78;z-index:1;}
        .pq1609 .pq-lampshade{position:absolute;left:24px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1609 .pq-jar{position:absolute;left:13px;bottom:22px;width:30px;height:36px;z-index:3;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1609 .pq-jar .cup{position:absolute;left:0;bottom:0;width:30px;height:24px;border-radius:6px 6px 9px 9px;background:linear-gradient(#eef6fb,#cfe1ed);border:1.6px solid #a9c2d2;}
        .pq1609 .pq-jar .d{position:absolute;bottom:6px;width:8px;height:8px;border-radius:50%;}
        .pq1609 .pq-jar .d.a{left:4px;background:radial-gradient(circle at 35% 35%,#f4aecb,#c1547f);} .pq1609 .pq-jar .d.b{left:12px;bottom:12px;background:radial-gradient(circle at 35% 35%,#8fbdea,#316aa8);} .pq1609 .pq-jar .d.c{left:18px;background:radial-gradient(circle at 35% 35%,#f9d484,#cd9421);}
        .pq1609 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(#cf98b1,#b06e8b);border-top:3px solid #955876;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1609 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,40,64,.3);}

        .pq1609 .pq-box{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);padding:10px 12px 12px;border-radius:16px;background:linear-gradient(#d98fb0,#bf6b90);border:2.5px solid #8f4d6c;box-shadow:0 7px 15px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.3);z-index:4;}
        .pq1609 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1609 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,37px);grid-auto-rows:32px;gap:5px;}
        .pq1609 .pq-cell{position:relative;border-radius:9px;background:rgba(255,250,252,.4);border:1.6px solid rgba(120,50,80,.34);display:flex;align-items:center;justify-content:center;}
        .pq1609 .pq-cell.empty{background:rgba(255,255,255,.18);border-style:dashed;border-color:rgba(120,50,80,.55);animation:pqBreath 2s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1609 .pq-cw{position:relative;line-height:0;}
        .pq1609 .pq-cw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1609 .pq-cd{display:block;position:relative;animation:pqFloat 3s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq1609 .pq-q{font-size:19px;font-weight:900;color:#a8517b;opacity:.65;}
        .pq1609 .pq-cnt{position:absolute;top:-8px;right:-6px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#c25d8a;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1609 .pq-band{position:absolute;left:-15px;right:-15px;top:calc(50% - 7px);height:15px;border-radius:4px;background:linear-gradient(#e8635b,#cf3f38);box-shadow:0 2px 5px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.3);z-index:5;transform-origin:center;animation:pqBand .5s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1609 .pq-tenlbl{position:absolute;top:calc(50% - 12px);right:-24px;z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:13px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .18s both;}
        .pq1609 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1609 .pq-spark.s2{animation-delay:-.6s;} .pq1609 .pq-spark.s3{animation-delay:-1.15s;}
        /* QOPQOQ — quti yopiq, uyalarni sanab bo'lmaydi; to'g'ri javobda ochilib ketadi */
        .pq1609 .pq-lid{position:absolute;inset:-2.5px;z-index:7;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:linear-gradient(#e39ab8,#c56d92);border:2.5px solid #8f4d6c;box-shadow:0 4px 9px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.35);transition:transform .6s cubic-bezier(.4,0,.3,1),opacity .5s ease .1s;}
        .pq1609 .pq-lid.open{transform:translateY(-84px) rotate(-7deg);opacity:0;pointer-events:none;}
        .pq1609 .pq-lidcap{font-size:12px;font-weight:900;color:#fff2f7;letter-spacing:.02em;text-shadow:0 1px 1px rgba(0,0,0,.2);}
        .pq1609 .pq-lidq{font-size:21px;line-height:1;font-weight:900;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqQm 1.8s ease-in-out infinite;}
        .pq1609 .pq-lidin{font-size:11px;font-weight:800;color:#ffe3ee;background:rgba(120,45,80,.45);padding:1px 9px;border-radius:999px;}
        @keyframes pqQm{0%,100%{transform:scale(1);}50%{transform:scale(1.16);}}

        .pq1609 .pq-eq7{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1609 .pq-eq7 b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fdeaf2;border:2px solid #e6b6cc;color:#b34a78;font-variant-numeric:tabular-nums;}
        .pq1609 .pq-eq7 b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1609 .pq-eq7 i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1609 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1609 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1609 .pq-opt:hover:not(:disabled){border-color:#eeb4d0;transform:translateY(-2px);}
        .pq1609 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1609 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1609 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1609 .pq-opt:disabled{cursor:default;}
        .pq1609 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1609 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1609 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-64px) scale(.85);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{opacity:1;}50%{opacity:.62;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqBand{0%{opacity:0;transform:scaleX(.1);}60%{opacity:1;transform:scaleX(1.04);}100%{transform:scaleX(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 344 * scale, height: 222 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-counter" />
        <span className="pq-jar"><span className="d a" /><span className="d b" /><span className="d c" /><span className="cup" /></span>

        <div className={'pq-box' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')} style={{ '--bd': `${(s.i - HAVE) * 0.14}s` }}>
                  {show ? (
                    <span className={'pq-cw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.12}s` }}>
                      <span className="pq-cd" style={{ '--sd': `${(s.i * 0.14).toFixed(2)}s` }}><Candy c={s.c} gid={`pq1609g${s.i}`} /></span>
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${s.i * 0.05}s` }}>{s.i + 1}</b>}
                    </span>
                  ) : (
                    <span className="pq-q">?</span>
                  )}
                </div>
              );
            })}
            {ok && <span className="pq-band" />}
            {ok && <span className="pq-tenlbl">{TEN}</span>}
          </div>
          <div className={'pq-lid' + (ok ? ' open' : '')} aria-hidden="true">
            <b className="pq-lidcap">{t.lidCap}</b>
            <span className="pq-lidq">?</span>
            <span className="pq-lidin">{t.lidIn}</span>
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '50px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '68px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '38px' }}>✦</span>
        </>)}
      </div>
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
