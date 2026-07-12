// Dars16 · Amaliyot 04 — P16 O'nlikka to'ldirish «Shirinlik do'koni» · 🟡 · tag: make_ten
// 10 uyali laganda: 6 uyada konfet, 4 uya bo'sh. O'nlikni to'ldirish uchun yana nechta? → 4.
// G'alaba: bo'sh uyalarga konfet tushadi, chip «6 + 4 = 10».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const HAVE = 6, NEED = 4, TEN = 10;
const DATA = { have: HAVE, need: NEED, target: 10, options: [3, 4, 5], ptype: 'P16', level: '🟡', tag: 'make_ten' };

// Konfet rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma, 2-ton radial).
const PAL = [
  { a: '#ef8a84', b: '#e2635b', d: '#c04a43' }, // qizil
  { a: '#77aee6', b: '#4a90d9', d: '#3573b5' }, // ko'k
  { a: '#f7cb63', b: '#f2b134', d: '#cf9421' }, // sariq
  { a: '#7dc074', b: '#57a84f', d: '#42833c' }, // yashil
  { a: '#f09ec2', b: '#e879a6', d: '#c85f89' }, // pushti
];
// 10 uya (5×2). Dastlab 0..5 to'la (konfet), 6..9 bo'sh (shtrix, "?").
const SLOTS = Array.from({ length: TEN }).map((_, i) => ({ i, filled: i < HAVE, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · To'ldirish", title: "O'nlikka nechta yetmaydi?",
    setup: "Laganda o'nta joy bor, oltitasida konfet turibdi. Lagan to'lishi kerak!",
    ask: "O'nlikni to'ldirish uchun yana nechta konfet kerak?",
    correct: "Barakalla! Olti va yana to'rt — o'nta. Lagan to'ldi!",
    hint: "Bo'sh uyalarni sanang: nechta konfet qo'shsak, lagan to'ladi?",
  },
  ru: {
    eyebrow: "Магазин сладостей · Дополни", title: "Сколько не хватает до десятка?",
    setup: "На подносе десять мест, в шести лежат конфеты. Поднос должен заполниться!",
    ask: "Сколько конфет нужно добавить, чтобы получился десяток?",
    correct: "Молодец! Шесть и ещё четыре — десять. Поднос полный!",
    hint: "Сосчитай пустые ячейки: сколько конфет добавить, чтобы поднос заполнился?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KONFET KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira + oq blik +
// ikki yon o'ram (burama uchli). Bitta konfet = bitta birlik.
const Candy = ({ c }) => {
  const id = 'cg' + c.b.slice(1);
  return (
    <svg viewBox="0 0 44 30" width="34" height="23" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="40%" cy="34%" r="68%">
          <stop offset="0%" stopColor={c.a} />
          <stop offset="60%" stopColor={c.b} />
          <stop offset="100%" stopColor={c.d} />
        </radialGradient>
      </defs>
      {/* chap o'ram */}
      <polygon points="10,15 2,7 4,15 2,23" fill={c.b} />
      <polygon points="10,15 2,7 4,15 2,23" fill="none" stroke={c.d} strokeWidth=".7" strokeLinejoin="round" />
      {/* o'ng o'ram */}
      <polygon points="34,15 42,7 40,15 42,23" fill={c.b} />
      <polygon points="34,15 42,7 40,15 42,23" fill="none" stroke={c.d} strokeWidth=".7" strokeLinejoin="round" />
      {/* markaziy doira */}
      <circle cx="22" cy="15" r="10.5" fill={`url(#${id})`} stroke={c.d} strokeWidth=".8" />
      {/* burama chiziqlari */}
      <path d="M12.4 12 Q10.6 15 12.4 18" fill="none" stroke={c.d} strokeWidth=".7" opacity=".7" />
      <path d="M31.6 12 Q33.4 15 31.6 18" fill="none" stroke={c.d} strokeWidth=".7" opacity=".7" />
      {/* oq blik */}
      <ellipse cx="18" cy="11" rx="3.4" ry="2.2" fill="#fff" opacity=".55" />
      <circle cx="24.5" cy="18.5" r="1.2" fill="#fff" opacity=".3" />
    </svg>
  );
};

export default function D16_04(props) {
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

  return (
    <div className="pq pq1604">
      <style>{`
        .pq1604{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1604 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c2557f;text-transform:uppercase;}
        .pq1604 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1604 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1604 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1604 .pq-scene{position:relative;width:352px;max-width:100%;height:250px;margin:0 auto;border-radius:20px;background:linear-gradient(#fbe6ef 0%,#f6d3e2 46%,#f0c3d6 100%);border:2px solid #e6b7cd;overflow:hidden;}
        .pq1604 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #cf94a9;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1604 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#cf94a9;transform:translateX(-1px);}
        .pq1604 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1604 .pq-lamp{position:absolute;left:36px;top:0;width:2px;height:20px;background:#a35c78;z-index:1;}
        .pq1604 .pq-lampshade{position:absolute;left:24px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1604 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#d98fb0,#bd6a8d);border-top:3px solid #a3557a;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1604 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(120,40,74,.32);}
        .pq1604 .pq-jar{position:absolute;left:12px;bottom:26px;width:32px;height:38px;z-index:3;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1604 .pq-jar .cup{position:absolute;left:0;bottom:0;width:32px;height:26px;border-radius:5px 5px 9px 9px;background:linear-gradient(#f3dce8,#e6c2d6);border:1.6px solid #c78faa;}
        .pq1604 .pq-jar .lid{position:absolute;left:3px;top:0;width:26px;height:7px;border-radius:4px;background:#c2557f;border:1.5px solid #a3406a;}
        .pq1604 .pq-jar .d{position:absolute;bottom:6px;width:7px;height:7px;border-radius:50%;}
        .pq1604 .pq-jar .d.a{left:5px;background:#e2635b;} .pq1604 .pq-jar .d.b{left:13px;bottom:13px;background:#4a90d9;} .pq1604 .pq-jar .d.c{left:19px;background:#f2b134;}
        .pq1604 .pq-tag{position:absolute;right:16px;bottom:116px;width:26px;height:16px;background:#f6a5c4;border:1.6px solid #d3739a;border-radius:3px 8px 8px 3px;z-index:3;transform:rotate(-8deg);transform-origin:left center;animation:pqTag 3s ease-in-out infinite;box-shadow:0 2px 3px rgba(0,0,0,.14);}
        .pq1604 .pq-tag::before{content:'';position:absolute;left:3px;top:5px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #d3739a;}
        .pq1604 .pq-tag::after{content:'';position:absolute;left:9px;top:6px;right:4px;height:2px;background:#d3739a;border-radius:2px;box-shadow:0 4px 0 #d3739a;}

        .pq1604 .pq-box{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);padding:11px 12px 13px;border-radius:16px;background:linear-gradient(#e9d3bf,#d3b193);border:2.5px solid #a97f56;box-shadow:0 7px 15px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.4);z-index:4;}
        .pq1604 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1604 .pq-grid{position:relative;display:grid;grid-template-columns:repeat(5,42px);grid-auto-rows:34px;gap:5px;}
        .pq1604 .pq-cell{position:relative;border-radius:9px;background:rgba(255,250,244,.55);border:1.6px solid rgba(150,100,60,.42);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(120,80,40,.15);}
        .pq1604 .pq-cell.empty{background:rgba(255,255,255,.28);border-style:dashed;border-color:rgba(150,100,60,.6);animation:pqBreath 2s ease-in-out infinite;}
        .pq1604 .pq-canw{position:relative;line-height:0;}
        .pq1604 .pq-canw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1604 .pq-q{font-size:20px;font-weight:900;color:#b06a2e;opacity:.65;}
        .pq1604 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#c2557f;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1604 .pq-tenlbl{position:absolute;top:-13px;right:-18px;z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:13px;padding:2px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .28s both;}
        .pq1604 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1604 .pq-spark.s2{animation-delay:-.6s;} .pq1604 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1604 .pq-eq7{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1604 .pq-eq7 b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fdeaf1;border:2px solid #e6b0c8;color:#b0396a;font-variant-numeric:tabular-nums;}
        .pq1604 .pq-eq7 b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1604 .pq-eq7 i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1604 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1604 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1604 .pq-opt:hover:not(:disabled){border-color:#e6b0c8;transform:translateY(-2px);}
        .pq1604 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1604 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1604 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1604 .pq-opt:disabled{cursor:default;}
        .pq1604 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1604 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1604 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-64px) scale(.82);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{opacity:.7;}50%{opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
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
        <span className="pq-jar"><span className="d a" /><span className="d b" /><span className="d c" /><span className="lid" /><span className="cup" /></span>

        <div className={'pq-box' + (ok ? ' win' : '')}>
          <div className="pq-grid">
            {SLOTS.map((s) => {
              const show = s.filled || ok;
              const isAdd = !s.filled;
              return (
                <div key={s.i} className={'pq-cell' + (show ? ' full' : ' empty')}>
                  {show ? (
                    <span className={'pq-canw' + (isAdd && ok && !still ? ' in' : '')} style={{ '--dd': `${(s.i - HAVE) * 0.16}s` }}>
                      <Candy c={s.c} />
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
          <span className="pq-spark" style={{ left: '20%', top: '58px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '78px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '44px' }}>✦</span>
        </>)}
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
