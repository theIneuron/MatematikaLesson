// Dars18 · Amaliyot 01 — Make-ten «Olma bozori» · 🟢 spiral · tag: cross_add
// Bitta-tanlov: 1-yashik (ten-frame) da yettita olma, uchta uya bo'sh. Yonida to'rtta yakka
// olma ("+4") turibdi. "7 + 4 = ?" → 11. G'alaba: to'rttadan uchtasi 1-yashikni o'nga to'ldiradi,
// qolgan bittasi 2-yashikka tushadi → 10 + 1 = 11. Make-ten g'oyasi ko'rinadi.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 7, B = 4, TARGET = 11, TEN = 10;
const GAP = TEN - A;      // 3 — 1-yashikni o'nga to'ldirish uchun kerakli olma
const OVER = B - GAP;     // 1 — 2-yashikka o'tadigan ortiqcha
const DATA = { a: A, b: B, target: TARGET, options: [10, 11, 12], ptype: 'P13', level: '🟢', tag: 'cross_add' };

// Olma rang palitrasi (qizil / yashil — aylanma).
const PAL = [
  { light: '#e88a82', main: '#d9534b', dark: '#a83a33' }, // qizil
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
];
// 1-yashik: 10 uya (5×2). 0..6 to'la (A=7), 7..9 bo'sh (ular to'rttadan to'ladi).
const BOX1 = Array.from({ length: TEN }).map((_, i) => ({ i, preset: i < A, c: PAL[i % PAL.length] }));
// 2-yashik: 10 uya. G'alabada 0..0 to'ladi (OVER=1), qolgani bo'sh.
const BOX2 = Array.from({ length: TEN }).map((_, i) => ({ i, over: i < OVER, c: PAL[(A + i) % PAL.length] }));
// "+4" yakka olmalar (javobdan oldin): to'rtta.
const LOOSE = Array.from({ length: B }).map((_, i) => ({ i, c: PAL[(A + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Olma bozori · Qo'shish", title: "Yettiga to'rtta qo'shamiz",
    setup: "Yashikda yettita olma bor, yana to'rtta olma qo'shamiz.",
    ask: "7 + 4 nechaga teng?",
    correct: "Barakalla! Yettiga uchta qo'shsak — o'nta, yana bitta — o'n bir. 7 + 4 = 11.",
    hint: "Avval yettini o'ngacha to'ldiring: yetti va yana uch — o'n. To'rttadan uchtasi ketdi, qolganini o'nga qo'shing.",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Сложение', title: 'К семи добавляем четыре',
    setup: 'В ящике семь яблок, добавляем ещё четыре яблока.',
    ask: 'Сколько будет 7 + 4?',
    correct: 'Молодец! К семи добавим три — десять, и ещё одно — одиннадцать. 7 + 4 = 11.',
    hint: 'Сначала дополни семь до десяти: семь и ещё три — десять. Из четырёх ушли три, а остаток прибавь к десяти.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq yaltiroq olma — radial 2-ton doira + oq blik,
// tepada jigarrang bandcha + yashil barg. Bitta olma = bitta birlik. Rang palitradan.
let __gid = 0;
const Apple = ({ c, size = 24 }) => {
  const id = 'd1801a' + (__gid++);
  return (
    <svg viewBox="0 0 34 34" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="36%" r="68%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="58%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* bandcha */}
      <path d="M17 9 Q16.5 5 18 3.5" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      {/* barg */}
      <path d="M18 5.5 Q23 3 24.5 7 Q20 8.5 18 5.5 Z" fill="#57a84f" stroke="#3f8038" strokeWidth=".6" />
      <path d="M18.6 6 Q21 5.5 23.5 6.6" fill="none" stroke="#3f8038" strokeWidth=".5" />
      {/* olma tanasi (ikki loblik yumaloq) */}
      <path d="M17 10 C11 10 8 14 8 19 C8 25 12 30 17 30 C22 30 26 25 26 19 C26 14 23 10 17 10 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" />
      <path d="M17 11.5 Q15.5 9.5 17 10 Q18.5 9.5 17 11.5 Z" fill={c.dark} opacity=".5" />
      {/* oq blik */}
      <ellipse cx="13" cy="16" rx="3.4" ry="4.6" fill="#fff" opacity=".55" transform="rotate(-22 13 16)" />
      <circle cx="21" cy="23" r="1.3" fill="#fff" opacity=".35" />
    </svg>
  );
};

export default function D18_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda olma-tushish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1801">
      <style>{`
        .pq1801{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1801 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#8a5a24;text-transform:uppercase;}
        .pq1801 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1801 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1801 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1801 .pq-scene{position:relative;width:372px;max-width:100%;height:250px;margin:0 auto;border-radius:20px;background:linear-gradient(#dff0f7 0%,#eaf6ec 52%,#f3ecd8 100%);border:2px solid #d3c9a8;overflow:hidden;}
        .pq1801 .pq-sun{position:absolute;left:22px;top:18px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1801 .pq-cloud{position:absolute;top:26px;width:40px;height:13px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:14px 3px 0 -2px rgba(255,255,255,.85),-12px 4px 0 -3px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        .pq1801 .pq-cloud.c1{right:70px;} .pq1801 .pq-cloud.c2{right:20px;top:44px;transform:scale(.8);animation-delay:-2.5s;}
        /* chodir-soyabon: qizil-oq yo'l-yo'l */
        .pq1801 .pq-awn{position:absolute;left:0;right:0;top:0;height:30px;z-index:2;background:repeating-linear-gradient(90deg,#d9534b 0 24px,#fbeceb 24px 48px);border-bottom:3px solid #a83a33;box-shadow:0 3px 5px rgba(0,0,0,.12);}
        .pq1801 .pq-awn::after{content:'';position:absolute;left:0;right:0;top:30px;height:9px;background:repeating-linear-gradient(90deg,#d9534b 0 24px,#fbeceb 24px 48px);-webkit-clip-path:polygon(0 0,8.3% 100%,16.6% 0,25% 100%,33.3% 0,41.6% 100%,50% 0,58.3% 100%,66.6% 0,75% 100%,83.3% 0,91.6% 100%,100% 0);clip-path:polygon(0 0,8.3% 100%,16.6% 0,25% 100%,33.3% 0,41.6% 100%,50% 0,58.3% 100%,66.6% 0,75% 100%,83.3% 0,91.6% 100%,100% 0);}
        .pq1801 .pq-board{position:absolute;top:46px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#6b4a24,#513716);border:2.5px solid #3a2710;color:#fdf3e2;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.2);}
        /* yog'och rasta */
        .pq1801 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1801 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}
        .pq1801 .pq-crate{position:absolute;left:12px;bottom:26px;width:40px;height:30px;z-index:3;border-radius:4px 4px 6px 6px;background:linear-gradient(#cd8f52,#a5703a);border:1.6px solid #7c4e20;box-shadow:inset 0 2px 0 rgba(255,255,255,.22);}
        .pq1801 .pq-crate::before{content:'';position:absolute;left:3px;right:3px;top:9px;height:1.5px;background:rgba(90,54,20,.4);}
        .pq1801 .pq-crate .ap{position:absolute;top:-6px;width:12px;height:12px;border-radius:50%;}
        .pq1801 .pq-crate .ap.a{left:4px;background:radial-gradient(circle at 36% 34%,#e88a82,#d9534b);}
        .pq1801 .pq-crate .ap.b{left:15px;top:-9px;background:radial-gradient(circle at 36% 34%,#8fca88,#57a84f);}
        .pq1801 .pq-crate .ap.c{left:25px;background:radial-gradient(circle at 36% 34%,#e88a82,#d9534b);}

        .pq1801 .pq-arena{position:absolute;left:8px;right:8px;top:82px;bottom:34px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq1801 .pq-plus{font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;}
        .pq1801 .pq-box{position:relative;padding:8px 9px 10px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1801 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1801 .pq-grid{display:grid;grid-template-columns:repeat(5,24px);grid-auto-rows:24px;gap:4px;}
        .pq1801 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,54,20,.18);}
        .pq1801 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.55);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1801 .pq-cw{line-height:0;}
        .pq1801 .pq-cw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1801 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .2s both;font-variant-numeric:tabular-nums;}
        .pq1801 .pq-lbl.g{border-color:#1a7f43;color:#1a7f43;}

        .pq1801 .pq-tray{display:flex;flex-direction:column;align-items:center;gap:4px;flex:0 0 auto;}
        .pq1801 .pq-tray .row{display:grid;grid-template-columns:repeat(2,24px);gap:4px;justify-content:center;}
        .pq1801 .pq-tray .pq-cw{animation:pqFloat 2.4s ease-in-out infinite;}
        .pq1801 .pq-tray .pq-cw:nth-child(2){animation-delay:-.5s;} .pq1801 .pq-tray .pq-cw:nth-child(3){animation-delay:-1s;}
        .pq1801 .pq-tray .pq-cw:nth-child(4){animation-delay:-1.5s;}
        .pq1801 .pq-tag{font-size:12px;font-weight:900;color:#a05a2e;background:rgba(255,255,255,.7);padding:1px 10px;border-radius:999px;}

        .pq1801 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1801 .pq-spark.s2{animation-delay:-.6s;} .pq1801 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1801 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1801 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1801 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1801 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1801 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#8a7a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1801 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1801 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1801 .pq-opt:hover:not(:disabled){border-color:#c9a15a;transform:translateY(-2px);}
        .pq1801 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1801 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1801 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1801 .pq-opt:disabled{cursor:default;}
        .pq1801 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1801 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1801 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-48px) scale(.85);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.06);opacity:1;}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-awn" />
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 1-yashik: yetti to'la + uch bo'sh (g'alabada to'ladi) */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {BOX1.map((s) => {
                const show = s.preset || ok;
                const isNew = !s.preset && ok;
                return (
                  <div key={s.i} className={'pq-cell' + (show ? '' : ' empty')}>
                    {show && (
                      <span className={'pq-cw' + (isNew && !still ? ' in' : '')} style={{ '--dd': `${(s.i - A) * 0.16}s` }}>
                        <Apple c={s.c} size={22} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-lbl g">{TEN}</span>}
          </div>

          <span className="pq-plus">+</span>

          {/* Javobdan oldin: to'rtta yakka olma ("+4"). G'alabada: 2-yashik (ortiqcha bitta). */}
          {ok ? (
            <div className="pq-box">
              <div className="pq-grid">
                {BOX2.map((s) => (
                  <div key={s.i} className={'pq-cell' + (s.over ? '' : ' empty')}>
                    {s.over && (
                      <span className={'pq-cw' + (!still ? ' in' : '')} style={{ '--dd': `${0.48 + s.i * 0.16}s` }}>
                        <Apple c={s.c} size={22} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <span className="pq-lbl">{OVER}</span>
            </div>
          ) : (
            <div className="pq-tray">
              <div className="row">
                {LOOSE.map((s) => (
                  <span key={s.i} className="pq-cw"><Apple c={s.c} size={22} /></span>
                ))}
              </div>
              <span className="pq-tag">{B}</span>
            </div>
          )}
        </div>

        <span className="pq-counter" />
        <span className="pq-crate"><span className="ap a" /><span className="ap b" /><span className="ap c" /></span>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '92px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '104px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '80px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>+</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} + {GAP} + {OVER} = {TEN} + {OVER}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
