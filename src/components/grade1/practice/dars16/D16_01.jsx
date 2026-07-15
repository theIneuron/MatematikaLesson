// Dars16 · Amaliyot 01 — P13 O'nlikka to'ldirish «Shirinlik do'koni» · 🟢 · tag: make_ten
// 10 uyali shirinlik qutisi (5×2): 9 uyada konfet, 1 uya bo'sh. To'qqiz va yana bir — o'nta.
// Bitta-tanlov: quti to'lishi (10) uchun yana nechta shirinlik kerak? → 1.
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

const HAVE = 9, NEED = 1, TEN = 10;
const DATA = { have: HAVE, need: NEED, target: TEN, options: [1, 2, 3], ptype: 'P13', level: '🟢', tag: 'make_ten' };

// Konfet rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { main: '#e2635b', light: '#f4a39d', dark: '#b83f39' }, // qizil
  { main: '#4a90d9', light: '#8fbdec', dark: '#2f6bab' }, // ko'k
  { main: '#f2b134', light: '#f9d17c', dark: '#cd9421' }, // sariq
  { main: '#57a84f', light: '#8fca88', dark: '#3f8038' }, // yashil
  { main: '#e879a6', light: '#f4aecb', dark: '#c14e7e' }, // pushti
];
// 10 uya (5×2). Dastlab 0..8 to'la, 9-uya bo'sh.
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · To'ldirish", title: "O'nlikka nechta yetmaydi?",
    setup: "Qutida o'nta uya bor, to'qqiztasida shirinlik turibdi. Bitta uya bo'sh qoldi.",
    ask: "Quti to'lishi (o'nta) uchun yana nechta shirinlik kerak?",
    correct: "Barakalla! To'qqiz va yana bir — o'nta. Quti to'ldi!",
    hint: "Bo'sh uyani sanang: nechta shirinlik qo'shsak, quti to'ladi?",
  },
  ru: {
    eyebrow: "Магазин сладостей · Дополни", title: "Сколько не хватает до десятка?",
    setup: "В коробке десять ячеек, в девяти лежат конфеты. Одна ячейка осталась пустой.",
    ask: "Сколько конфет нужно добавить, чтобы коробка заполнилась (десять)?",
    correct: "Молодец! Девять и ещё одна — десять. Коробка полная!",
    hint: "Сосчитай пустую ячейку: сколько конфет добавить, чтобы коробка заполнилась?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KONFET KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira +
// oq blik + ikki chetda yengil o'ram/burama (wrapper) detali. Bitta konfet = bitta birlik.
let __gid = 0;
const Candy = ({ c, size = 30 }) => {
  const id = 'cg' + (__gid++);
  return (
    <svg viewBox="0 0 40 30" width={size} height={size * 30 / 40} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="58%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* chap o'ram */}
      <path d="M8 15 L2 9 Q1 15 2 21 Z" fill={c.dark} />
      <path d="M8 15 L2 9 Q1 15 2 21 Z" fill="#fff" opacity=".12" />
      {/* o'ng o'ram */}
      <path d="M32 15 L38 9 Q39 15 38 21 Z" fill={c.dark} />
      <path d="M32 15 L38 9 Q39 15 38 21 Z" fill="#fff" opacity=".12" />
      {/* asosiy doira */}
      <circle cx="20" cy="15" r="12" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* burama chiziq */}
      <path d="M14 15 Q20 11 26 15 Q20 19 14 15 Z" fill="#fff" opacity=".14" />
      {/* oq blik */}
      <ellipse cx="15.5" cy="10.5" rx="4" ry="2.6" fill="#fff" opacity=".7" transform="rotate(-28 15.5 10.5)" />
      <circle cx="24" cy="19" r="1.4" fill="#fff" opacity=".4" />
    </svg>
  );
};

export default function D16_01(props) {
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
    const correct = picked === DATA.need;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.need }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(344);

  return (
    <div className="pq pq1601" ref={fitRef}>
      <style>{`
        .pq1601{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1601 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1601 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1601 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1601 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1601 .pq-scene{box-sizing:border-box;position:relative;width:344px;height:236px;border-radius:20px;background:linear-gradient(#fbe6ee 0%,#f6d3e0 46%,#f0c0d2 100%);border:2px solid #e6b6c9;overflow:hidden;}
        .pq1601 .pq-fit{position:relative;margin:0 auto;}
        .pq1601 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #c98aa4;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1601 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#c98aa4;transform:translateX(-1px);}
        .pq1601 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1601 .pq-lamp{position:absolute;left:36px;top:0;width:2px;height:20px;background:#a05a7a;z-index:1;}
        .pq1601 .pq-lampshade{position:absolute;left:24px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1601 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1601 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}
        .pq1601 .pq-jar{position:absolute;left:12px;bottom:26px;width:34px;height:38px;z-index:3;}
        .pq1601 .pq-jar .glass{position:absolute;left:0;bottom:0;width:34px;height:30px;border-radius:6px 6px 9px 9px;background:linear-gradient(160deg,rgba(223,240,251,.85),rgba(182,206,222,.85));border:1.6px solid #9db6c8;box-shadow:inset 0 2px 0 rgba(255,255,255,.4);}
        .pq1601 .pq-jar .lid{position:absolute;left:4px;bottom:28px;width:26px;height:6px;border-radius:3px;background:#c98aa4;}
        .pq1601 .pq-jar .d{position:absolute;bottom:5px;width:9px;height:9px;border-radius:50%;}
        .pq1601 .pq-jar .d.a{left:5px;background:radial-gradient(circle at 36% 34%,#f4a39d,#e2635b);}
        .pq1601 .pq-jar .d.b{left:14px;background:radial-gradient(circle at 36% 34%,#f9d17c,#f2b134);bottom:9px;}
        .pq1601 .pq-jar .d.c{left:20px;background:radial-gradient(circle at 36% 34%,#8fbdec,#4a90d9);}

        .pq1601 .pq-box{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);padding:11px 12px 13px;border-radius:16px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 7px 15px rgba(0,0,0,.24),inset 0 2px 0 rgba(255,255,255,.28);z-index:4;}
        .pq1601 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1601 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,34px);grid-auto-rows:34px;gap:6px;}
        .pq1601 .pq-cell{position:relative;border-radius:9px;background:rgba(255,250,239,.5);border:1.6px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 3px rgba(90,54,20,.18);}
        .pq1601 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.6);animation:pqBreath 1.8s ease-in-out infinite;}
        .pq1601 .pq-candyw{position:relative;line-height:0;}
        .pq1601 .pq-candyw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1601 .pq-q{font-size:20px;font-weight:900;color:#a06a2e;opacity:.65;}
        .pq1601 .pq-cnt{position:absolute;top:-7px;right:-5px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1601 .pq-tenlbl{position:absolute;top:50%;right:-26px;transform:translateY(-50%);z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:13px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .22s both;}
        .pq1601 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1601 .pq-spark.s2{animation-delay:-.6s;} .pq1601 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1601 .pq-eq7{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1601 .pq-eq7 b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1601 .pq-eq7 b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1601 .pq-eq7 i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1601 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1601 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1601 .pq-opt:hover:not(:disabled){border-color:#e2a3c0;transform:translateY(-2px);}
        .pq1601 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1601 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1601 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1601 .pq-opt:disabled{cursor:default;}
        .pq1601 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1601 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1601 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-58px) scale(.85);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.06);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 344 * scale, height: 236 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-counter" />
        <span className="pq-jar"><span className="lid" /><span className="glass" /><span className="d a" /><span className="d b" /><span className="d c" /></span>

        <div className={'pq-box' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')}>
                  {show ? (
                    <span className={'pq-candyw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.16}s` }}>
                      <Candy c={s.c} size={30} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${s.i * 0.05}s` }}>{s.i + 1}</b>}
                    </span>
                  ) : (
                    <span className="pq-q">?</span>
                  )}
                </div>
              );
            })}
            {ok && <span className="pq-tenlbl">{TEN}</span>}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '74px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<div className="pq-eq7"><b>{HAVE}</b><i>+</i><b>{NEED}</b><i>=</i><b className="ten">{TEN}</b></div>)}

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
