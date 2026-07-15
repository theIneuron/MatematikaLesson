// Dars16 · Amaliyot 05 — Make-ten «Shirinlik do'koni» · 🔴 · tag: make_ten
// 10 uyali quti (5×2): 5 uyada shirinlik (yuqori qator to'la), 5 uya bo'sh (past qator).
// Teng juft: besh va yana besh — o'n. Chip «5 + 5 = 10».
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

const HAVE = 5, NEED = 5, TEN = 10;
const DATA = { have: HAVE, need: NEED, target: NEED, options: [4, 5, 6], ptype: 'P16', level: '🔴', tag: 'make_ten' };

// Shirinlik rang palitrasi (radial 2-ton doira + blik + o'ram burama).
const PAL = [
  { core: '#e2635b', edge: '#b83e37', twist: '#c94a43' }, // qizil
  { core: '#4a90d9', edge: '#2f6bb0', twist: '#3a79c2' }, // ko'k
  { core: '#f2b134', edge: '#cd8f1c', twist: '#dc9d24' }, // sariq
  { core: '#57a84f', edge: '#3f8038', twist: '#4a9142' }, // yashil
  { core: '#e879a6', edge: '#c25181', twist: '#d46293' }, // pushti
];
// 10 uya (5×2). Dastlab 0..4 to'la (yuqori qator), 5..9 bo'sh (past qator, shtrix).
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · To'ldirish", title: "O'nlikka nechta yetmaydi?",
    setup: "Qutida o'nta joy bor, beshtasida shirinlik turibdi. Quti to'lishi kerak!",
    ask: "O'nlikni to'ldirish uchun yana nechta shirinlik kerak?",
    correct: "Barakalla! Besh va yana besh — o'n. Quti to'ldi!",
    hint: "Bo'sh uyalarni sanang: nechta shirinlik qo'shsak, quti to'ladi?",
  },
  ru: {
    eyebrow: "Магазин сладостей · Дополни", title: "Сколько не хватает до десятка?",
    setup: "В коробке десять мест, в пяти лежат конфеты. Коробка должна заполниться!",
    ask: "Сколько конфет нужно добавить, чтобы получился десяток?",
    correct: "Молодец! Пять и ещё пять — десять. Коробка полная!",
    hint: "Сосчитай пустые ячейки: сколько конфет добавить, чтобы коробка заполнилась?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira,
// oq blik, ikki tomonda burama o'ram (fantik) detali.
const Candy = ({ c }) => (
  <svg viewBox="0 0 44 30" width="38" height="26" aria-hidden="true" style={{ display: 'block' }}>
    {/* chap o'ram burama */}
    <path d="M11 15 L3 7 Q1 15 3 23 Z" fill={c.twist} stroke={c.edge} strokeWidth=".8" strokeLinejoin="round" />
    <path d="M11 15 L3 7 L7 15 Z" fill={c.core} opacity=".55" />
    {/* o'ng o'ram burama */}
    <path d="M33 15 L41 7 Q43 15 41 23 Z" fill={c.twist} stroke={c.edge} strokeWidth=".8" strokeLinejoin="round" />
    <path d="M33 15 L41 7 L37 15 Z" fill={c.core} opacity=".55" />
    {/* asosiy konfet doirasi */}
    <circle cx="22" cy="15" r="11" fill={c.edge} />
    <circle cx="22" cy="15" r="9.6" fill={c.core} />
    <ellipse cx="18.4" cy="11.4" rx="4.4" ry="3" fill="#fff" opacity=".55" />
    <circle cx="25.5" cy="18.5" r="1.6" fill="#fff" opacity=".28" />
  </svg>
);

export default function D16_05(props) {
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
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq1605" ref={fitRef}>
      <style>{`
        .pq1605{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1605 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1605 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1605 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1605 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1605 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:238px;border-radius:20px;background:linear-gradient(#fbe7d0 0%,#f6d9b4 48%,#efc999 100%);border:2px solid #e2c493;overflow:hidden;}
        .pq1605 .pq-fit{position:relative;margin:0 auto;}
        .pq1605 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #c39457;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1605 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#c39457;transform:translateX(-1px);}
        .pq1605 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1605 .pq-lamp{position:absolute;left:36px;top:0;width:2px;height:20px;background:#8a5628;z-index:1;}
        .pq1605 .pq-lampshade{position:absolute;left:24px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1605 .pq-jar{position:absolute;left:14px;bottom:44px;width:34px;height:40px;z-index:3;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1605 .pq-jar .glass{position:absolute;left:0;bottom:0;width:34px;height:34px;border-radius:6px 6px 9px 9px;background:linear-gradient(160deg,rgba(223,240,251,.85),rgba(182,206,222,.85));border:1.6px solid #9fb6c6;}
        .pq1605 .pq-jar .lid{position:absolute;left:3px;top:0;width:28px;height:7px;border-radius:4px;background:linear-gradient(#d98a52,#b06a34);border:1.4px solid #8a5628;}
        .pq1605 .pq-jar i{position:absolute;bottom:5px;width:8px;height:8px;border-radius:50%;}
        .pq1605 .pq-jar i.a{left:5px;background:#e2635b;} .pq1605 .pq-jar i.b{left:14px;bottom:12px;background:#4a90d9;} .pq1605 .pq-jar i.c{left:22px;background:#f2b134;}
        .pq1605 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1605 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:12px;height:2px;background:rgba(90,54,20,.35);}

        .pq1605 .pq-tray{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);padding:12px 14px;border-radius:16px;background:linear-gradient(#e7b877,#d29a4d);border:2.5px solid #a9772f;box-shadow:0 7px 15px rgba(0,0,0,.24),inset 0 2px 0 rgba(255,255,255,.34);z-index:4;}
        .pq1605 .pq-tray.win{animation:pqTrayCele .55s ease;}
        .pq1605 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,44px);grid-auto-rows:34px;gap:6px;}
        .pq1605 .pq-cell{position:relative;border-radius:11px;background:rgba(255,248,235,.5);border:1.6px solid rgba(140,90,40,.42);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(120,74,32,.15);}
        .pq1605 .pq-cell.empty{background:rgba(255,255,255,.24);border-style:dashed;border-color:rgba(140,90,40,.6);animation:pqBreath 2.2s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1605 .pq-cndw{position:relative;line-height:0;}
        .pq1605 .pq-cndw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1605 .pq-cnd{display:block;position:relative;animation:pqFloat 3s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq1605 .pq-q{font-size:20px;font-weight:900;color:#a06a2e;opacity:.7;}
        .pq1605 .pq-cnt{position:absolute;top:-7px;right:-3px;min-width:17px;height:17px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1605 .pq-tenlbl{position:absolute;top:50%;right:-26px;transform:translateY(-50%);z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:13px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .18s both;}
        .pq1605 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1605 .pq-spark.s2{animation-delay:-.6s;} .pq1605 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1605 .pq-eq7{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1605 .pq-eq7 b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1605 .pq-eq7 b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1605 .pq-eq7 i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1605 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1605 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1605 .pq-opt:hover:not(:disabled){border-color:#e2c79a;transform:translateY(-2px);}
        .pq1605 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1605 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1605 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1605 .pq-opt:disabled{cursor:default;}
        .pq1605 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1605 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1605 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-64px) scale(.85);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{opacity:.75;transform:scale(1);}50%{opacity:1;transform:scale(1.03);}}
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

      <div className="pq-fit" style={{ width: 360 * scale, height: 238 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-jar"><span className="lid" /><i className="a" /><i className="b" /><i className="c" /><span className="glass" /></span>
        <span className="pq-counter" />

        <div className={'pq-tray' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')} style={{ '--bd': `${(s.i - HAVE) * 0.18}s` }}>
                  {show ? (
                    <span className={'pq-cndw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.16}s` }}>
                      <span className="pq-cnd" style={{ '--sd': `${(s.i * 0.14).toFixed(2)}s` }}><Candy c={s.c} /></span>
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
          <span className="pq-spark s3" style={{ left: '52%', top: '42px' }}>✦</span>
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
