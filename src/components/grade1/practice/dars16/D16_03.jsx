// Dars16 · Amaliyot 03 — Make-ten (tenglama urg'usi) «Shirinlik do'koni» · 🟡 · tag: make_ten
// 10 uyali qutida: 7 uyada shirinlik, 3 uya bo'sh (shtrix «?»). Tenglama doim ko'rinadi: «7 + [?] = 10».
// Tanlangan variant tenglama slotiga jonli tushadi. To'g'ri javob → 3, chip «7 + 3 = 10», bo'sh uyalar to'ladi.
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

const HAVE = 7, NEED = 3, TEN = 10;
const DATA = { have: HAVE, need: NEED, target: TEN, options: [2, 3, 4], level: '🟡', tag: 'make_ten' };

// SHIRINLIK palitrasi (aylanma): qizil / ko'k / sariq / yashil / pushti — asosiy + och + to'q ton.
const PAL = [
  { main: '#e2635b', light: '#f2a49e', dark: '#b8433c' }, // qizil
  { main: '#4a90d9', light: '#8fbdec', dark: '#356fac' }, // ko'k
  { main: '#f2b134', light: '#f9d27b', dark: '#c98d1c' }, // sariq
  { main: '#57a84f', light: '#93cc8c', dark: '#3f8138' }, // yashil
  { main: '#e879a6', light: '#f3b0cb', dark: '#c1567f' }, // pushti
];
// 10 uya (5×2). Dastlab 0..6 to'la, 7..9 bo'sh.
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · O'nlikka to'ldirish", title: "O'nlikka nechta yetmaydi?",
    setup: "Qutida o'nta joy bor, yettitasida shirinlik turibdi. Quti to'lishi kerak.",
    ask: "O'nlikni to'ldirish uchun yana nechta shirinlik kerak?",
    correct: "Barakalla! Yetti va yana uch — o'nta. Quti to'ldi!",
    hint: "Tenglamaga qarang: yetti bor, o'ngacha nechta bo'sh uya qoldi — o'shancha kerak.",
  },
  ru: {
    eyebrow: "Магазин сладостей · Дополни до десятка", title: "Сколько не хватает до десятка?",
    setup: "В коробке десять мест, в семи лежат сладости. Коробка должна заполниться.",
    ask: "Сколько сладостей нужно добавить, чтобы получился десяток?",
    correct: "Молодец! Семь и ещё три — десять. Коробка полная!",
    hint: "Посмотри на равенство: семь есть, сколько пустых мест до десяти — столько и нужно.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira + oq blik +
// yon o'ram burama detali. Bitta konfet = bitta birlik.
const Candy = ({ c, id }) => (
  <svg viewBox="0 0 46 28" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={`cg${id}`} cx="38%" cy="34%" r="72%">
        <stop offset="0" stopColor={c.light} />
        <stop offset="1" stopColor={c.main} />
      </radialGradient>
    </defs>
    <path d="M12,14 L1.5,5 Q4,14 1.5,23 Z" fill={c.main} opacity=".85" />
    <path d="M12,14 L4,10 Q7,14 4,18 Z" fill={c.dark} opacity=".5" />
    <path d="M34,14 L44.5,5 Q42,14 44.5,23 Z" fill={c.main} opacity=".85" />
    <path d="M34,14 L42,10 Q39,14 42,18 Z" fill={c.dark} opacity=".5" />
    <circle cx="23" cy="14" r="11.5" fill={`url(#cg${id})`} stroke={c.dark} strokeWidth=".8" />
    <path d="M17,10.5 Q23,14.5 29,10.5" stroke={c.light} strokeWidth="1.4" fill="none" opacity=".55" strokeLinecap="round" />
    <ellipse cx="18.6" cy="9.6" rx="3.4" ry="2.1" fill="#fff" opacity=".72" transform="rotate(-24 18.6 9.6)" />
  </svg>
);

export default function D16_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda shirinlik-tushish qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = picked === DATA.target - DATA.have;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: NEED }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const slotVal = ok ? NEED : (picked !== null ? picked : '?');
  const [fitRef, scale] = useFitScale(344);

  return (
    <div className="pq pq1603" ref={fitRef}>
      <style>{`
        .pq1603{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1603 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9558a;text-transform:uppercase;}
        .pq1603 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1603 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1603 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1603 .pq-scene{box-sizing:border-box;position:relative;width:344px;height:236px;border-radius:20px;background:linear-gradient(#ffeef5 0%,#fbdcea 48%,#f6cbe0 100%);border:2px solid #eab9d2;overflow:hidden;}
        .pq1603 .pq-fit{position:relative;margin:0 auto;}
        .pq1603 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #d59ab8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1603 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#d59ab8;transform:translateX(-1px);}
        .pq1603 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1603 .pq-lamp{position:absolute;left:38px;top:0;width:2px;height:20px;background:#a55c86;z-index:1;}
        .pq1603 .pq-lampshade{position:absolute;left:26px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#ffd7ea,#e879a6);border:1.5px solid #cf6592;z-index:1;box-shadow:0 10px 22px 6px rgba(232,121,166,.4);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1603 .pq-jar{position:absolute;left:13px;bottom:32px;width:32px;height:40px;z-index:3;}
        .pq1603 .pq-jar .glass{position:absolute;left:0;bottom:0;width:32px;height:32px;border-radius:8px 8px 10px 10px;background:linear-gradient(120deg,rgba(255,255,255,.5),rgba(210,232,244,.55));border:1.8px solid #b8d2e2;overflow:hidden;}
        .pq1603 .pq-jar .lid{position:absolute;left:4px;bottom:31px;width:24px;height:8px;border-radius:4px 4px 2px 2px;background:linear-gradient(#e879a6,#c1567f);border:1.5px solid #a84670;}
        .pq1603 .pq-jar .cd{position:absolute;width:9px;height:9px;border-radius:50%;}
        .pq1603 .pq-jar .cd.a{left:4px;bottom:4px;background:radial-gradient(circle at 36% 34%,#f9d27b,#f2b134);}
        .pq1603 .pq-jar .cd.b{left:14px;bottom:6px;background:radial-gradient(circle at 36% 34%,#8fbdec,#4a90d9);}
        .pq1603 .pq-jar .cd.c{left:9px;bottom:13px;background:radial-gradient(circle at 36% 34%,#93cc8c,#57a84f);}
        .pq1603 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#d79a5f,#b5793f);border-top:3px solid #97612e;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1603 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1603 .pq-tray{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);padding:11px 13px 13px;border-radius:16px;background:linear-gradient(#f6d9a0,#e3b978);border:2.5px solid #c99a4f;box-shadow:0 7px 15px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.4);z-index:4;}
        .pq1603 .pq-tray.win{animation:pqTrayCele .55s ease;}
        .pq1603 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,38px);grid-auto-rows:34px;gap:5px;}
        .pq1603 .pq-cell{position:relative;border-radius:9px;background:rgba(255,255,255,.5);border:1.6px solid rgba(150,100,50,.35);display:flex;align-items:center;justify-content:center;}
        .pq1603 .pq-cell.empty{background:rgba(255,255,255,.28);border-style:dashed;border-color:rgba(180,90,140,.65);animation:pqBreath 1.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1603 .pq-cw{position:relative;line-height:0;}
        .pq1603 .pq-cw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1603 .pq-q{font-size:20px;font-weight:900;color:#c85a95;opacity:.7;}
        .pq1603 .pq-cnt{position:absolute;top:-8px;right:-6px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1603 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1603 .pq-spark.s2{animation-delay:-.6s;} .pq1603 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1603 .pq-eq{display:flex;justify-content:center;align-items:center;gap:7px;margin-top:15px;}
        .pq1603 .pq-eq b{min-width:38px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#fff4fa;border:2px solid #edbdd6;color:#b23a78;font-variant-numeric:tabular-nums;}
        .pq1603 .pq-eq b.slot{border-style:dashed;border-color:#c85a95;color:#c85a95;background:#fff;transition:.15s;}
        .pq1603 .pq-eq b.slot.on{border-style:solid;background:#fbe4f0;}
        .pq1603 .pq-eq b.slot.win{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;animation:pqPop .35s ease both;}
        .pq1603 .pq-eq b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1603 .pq-eq i{font-style:normal;font-size:21px;font-weight:900;color:#8a94a2;}

        .pq1603 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1603 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1603 .pq-opt:hover:not(:disabled){border-color:#edbdd6;transform:translateY(-2px);}
        .pq1603 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1603 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1603 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1603 .pq-opt:disabled{cursor:default;}
        .pq1603 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1603 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1603 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-64px) scale(.85);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{opacity:.65;transform:scale(1);}50%{opacity:1;transform:scale(1.05);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqTrayCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 344 * scale, height: 236 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-counter" />
        <span className="pq-jar"><span className="lid" /><span className="glass"><span className="cd a" /><span className="cd b" /><span className="cd c" /></span></span>

        <div className={'pq-tray' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')} style={{ '--bd': `${(s.i - HAVE) * 0.3}s` }}>
                  {show ? (
                    <span className={'pq-cw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.16}s` }}>
                      <Candy c={s.c} id={s.i} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${s.i * 0.05}s` }}>{s.i + 1}</b>}
                    </span>
                  ) : (
                    <span className="pq-q">?</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '74px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      <div className="pq-eq">
        <b>{HAVE}</b><i>+</i>
        <b className={'slot' + (ok ? ' win' : picked !== null ? ' on' : '')}>{slotVal}</b>
        <i>=</i><b className="ten">{TEN}</b>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === NEED;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
