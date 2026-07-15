// Dars18 · Amaliyot 05 — Make-ten «Olma bozori» · 🔴 dubl · tag: cross_add
// Bitta-tanlov: 1-yashik (ten-frame) da sakkizta olma bor, ikki uya bo'sh. Yonida sakkizta
// yakka olma ("+8") turibdi. "8 + 8 = ?" → 16. G'alaba: sakkiztadan ikkitasi 1-yashikni
// o'nga to'ldiradi, qolgan oltitasi 2-yashikka tushadi → 10 + 6 = 16. Make-ten g'oyasi ko'rinadi.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
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

const A = 8, B = 8, TARGET = 16, TEN = 10;
const GAP = TEN - A;      // 2 — 1-yashikni to'ldirish uchun kerakli olma
const OVER = B - GAP;     // 6 — 2-yashikka o'tadigan ortiqcha
const DATA = { a: A, b: B, target: TARGET, options: [15, 16, 17], level: '🔴', tag: 'cross_add' };

// Olma rang palitrasi (qizil / yashil — aylanma).
const PAL = [
  { light: '#ef8079', main: '#d9534b', dark: '#a83c34' }, // qizil
  { light: '#7cc073', main: '#57a84f', dark: '#3f8038' }, // yashil
];

// 1-yashik: 10 uya (5×2). 0..7 to'la (A=8), 8..9 bo'sh (ular sakkiztadan to'ladi).
const BOX1 = Array.from({ length: TEN }).map((_, i) => ({ i, preset: i < A, c: PAL[i % PAL.length] }));
// 2-yashik: 10 uya. G'alabada 0..5 to'ladi (OVER=6), qolgani bo'sh.
const BOX2 = Array.from({ length: TEN }).map((_, i) => ({ i, over: i < OVER, c: PAL[(A + i) % PAL.length] }));
// "+8" yakka olmalar (javobdan oldin): sakkizta.
const LOOSE = Array.from({ length: B }).map((_, i) => ({ i, c: PAL[(A + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Olma bozori · Qo'shish", title: "Sakkizga sakkizta qo'shamiz",
    setup: "Yashikda sakkizta olma bor, yana sakkizta olma qo'shamiz.",
    ask: "8 + 8 nechaga teng?",
    correct: "Barakalla! Sakkizga ikkita qo'shsak — o'nta, yana oltita — o'n oltita. 8 + 8 = 16.",
    hint: "Avval sakkizni o'ngacha to'ldiring: sakkiz va yana ikki — o'n. Sakkiztadan ikkitasi ketdi, qolganini o'nga qo'shing.",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Сложение', title: 'К восьми добавляем восемь',
    setup: 'В ящике восемь яблок, добавляем ещё восемь яблок.',
    ask: 'Сколько будет 8 + 8?',
    correct: 'Молодец! К восьми добавим две — десять, и ещё шесть — шестнадцать. 8 + 8 = 16.',
    hint: 'Сначала дополни восемь до десяти: восемь и ещё две — десять. Из восьми ушли две, а остаток прибавь к десяти.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — radial 2-ton doira + oq blik +
// tepada jigarrang bandcha + yashil barg. Bitta olma = bitta birlik. Rang palitradan.
let __gid = 0;
const Apple = ({ c, size = 24 }) => {
  const id = 'd1805a' + (__gid++);
  return (
    <svg viewBox="0 0 34 36" width={size} height={size * 36 / 34} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* bandcha */}
      <path d="M17 9 Q16.4 5 17.6 3" fill="none" stroke="#8a5a2b" strokeWidth="2" strokeLinecap="round" />
      {/* barg */}
      <path d="M17.6 5 Q23 3 24.5 7.5 Q19 9 17.6 5 Z" fill="#5fa650" stroke="#3f8038" strokeWidth=".6" />
      {/* asosiy tana (ikki qavariq) */}
      <path d="M17 9 C11 8 5 12 5 21 C5 29 10 34 13.5 34 C15 34 16 33.2 17 33.2 C18 33.2 19 34 20.5 34 C24 34 29 29 29 21 C29 12 23 8 17 9 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="11.5" cy="16" rx="3.4" ry="4.6" fill="#fff" opacity=".55" transform="rotate(-22 11.5 16)" />
      <circle cx="21" cy="26" r="1.5" fill="#fff" opacity=".3" />
    </svg>
  );
};

export default function D18_05(props) {
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
  const [fitRef, scale] = useFitScale(388);

  return (
    <div className="pq pq1805" ref={fitRef}>
      <style>{`
        .pq1805{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1805 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1805 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1805 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1805 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1805 .pq-scene{box-sizing:border-box;position:relative;width:388px;height:256px;border-radius:20px;background:linear-gradient(#dff1fb 0%,#eaf6ec 52%,#e3efd7 100%);border:2px solid #cfe1c6;overflow:hidden;}
        .pq1805 .pq-fit{position:relative;margin:0 auto;}
        .pq1805 .pq-sun{position:absolute;left:20px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1805 .pq-cloud{position:absolute;top:22px;width:48px;height:15px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:0 0 0 6px rgba(255,255,255,.35);z-index:1;}
        .pq1805 .pq-cloud.c1{right:60px;animation:pqCloud 9s ease-in-out infinite;}
        .pq1805 .pq-cloud.c2{right:150px;top:40px;transform:scale(.7);animation:pqCloud 7.4s ease-in-out infinite reverse;}
        /* chodir-soyabon: qizil-oq yo'l */
        .pq1805 .pq-tent{position:absolute;left:50%;top:6px;transform:translateX(-50%);width:250px;height:30px;z-index:5;border-radius:8px 8px 0 0;background:repeating-linear-gradient(90deg,#d9534b 0 20px,#fbeceb 20px 40px);border:2px solid #a83c34;box-shadow:0 3px 6px rgba(0,0,0,.16);}
        .pq1805 .pq-tent::after{content:'';position:absolute;left:-2px;right:-2px;bottom:-9px;height:11px;background:repeating-linear-gradient(90deg,transparent 0 20px,#d9534b 20px 40px);-webkit-mask:radial-gradient(9px at 10px 0,transparent 96%,#000) repeat-x 0 -9px/20px 11px;mask:radial-gradient(9px at 10px 0,transparent 96%,#000) repeat-x 0 -9px/20px 11px;}
        .pq1805 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#57a84f,#3f8038);border:2.5px solid #2f6023;color:#f2fbee;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);}
        .pq1805 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1805 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1805 .pq-arena{position:absolute;left:8px;right:8px;top:48px;bottom:36px;display:flex;align-items:center;justify-content:center;gap:7px;z-index:3;}
        .pq1805 .pq-plus{font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;}
        .pq1805 .pq-box{position:relative;padding:8px 9px 10px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1805 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1805 .pq-grid{display:grid;grid-template-columns:repeat(5,24px);grid-auto-rows:26px;gap:4px;}
        .pq1805 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,54,20,.18);}
        .pq1805 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.55);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1805 .pq-cw{line-height:0;}
        .pq1805 .pq-cw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1805 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #d9534b;color:#d9534b;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .2s both;font-variant-numeric:tabular-nums;}
        .pq1805 .pq-lbl.g{border-color:#1a7f43;color:#1a7f43;}

        .pq1805 .pq-tray{display:flex;flex-direction:column;align-items:center;gap:4px;flex:0 0 auto;}
        .pq1805 .pq-tray .row{display:grid;grid-template-columns:repeat(4,22px);gap:4px 5px;justify-content:center;}
        .pq1805 .pq-tray .pq-cw{animation:pqFloat 2.4s ease-in-out infinite;}
        .pq1805 .pq-tray .pq-cw:nth-child(2n){animation-delay:-.6s;} .pq1805 .pq-tray .pq-cw:nth-child(3n){animation-delay:-1.1s;}
        .pq1805 .pq-tray .pq-cw:nth-child(4n){animation-delay:-1.6s;}
        .pq1805 .pq-tag{font-size:12px;font-weight:900;color:#a05a2e;background:rgba(255,255,255,.7);padding:1px 10px;border-radius:999px;}

        .pq1805 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1805 .pq-spark.s2{animation-delay:-.6s;} .pq1805 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1805 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1805 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1805 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1805 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1805 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#8a7a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1805 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1805 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1805 .pq-opt:hover:not(:disabled){border-color:#8fca88;transform:translateY(-2px);}
        .pq1805 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1805 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1805 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1805 .pq-opt:disabled{cursor:default;}
        .pq1805 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1805 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1805 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-48px) scale(.85);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.06);opacity:1;}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-10px);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 388 * scale, height: 256 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-tent" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 1-yashik: sakkiz to'la + ikki bo'sh (g'alabada to'ladi) */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {BOX1.map((s) => {
                const show = s.preset || ok;
                const isNew = !s.preset && ok;
                return (
                  <div key={s.i} className={'pq-cell' + (show ? '' : ' empty')}>
                    {show && (
                      <span className={'pq-cw' + (isNew && !still ? ' in' : '')} style={{ '--dd': `${(s.i - A) * 0.16}s` }}>
                        <Apple c={s.c} size={20} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-lbl g">{TEN}</span>}
          </div>

          <span className="pq-plus">+</span>

          {/* Javobdan oldin: sakkizta yakka olma ("+8"). G'alabada: 2-yashik (ortiqcha oltita). */}
          {ok ? (
            <div className="pq-box">
              <div className="pq-grid">
                {BOX2.map((s) => (
                  <div key={s.i} className={'pq-cell' + (s.over ? '' : ' empty')}>
                    {s.over && (
                      <span className={'pq-cw' + (!still ? ' in' : '')} style={{ '--dd': `${0.32 + s.i * 0.14}s` }}>
                        <Apple c={s.c} size={20} />
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
                  <span key={s.i} className="pq-cw"><Apple c={s.c} size={20} /></span>
                ))}
              </div>
              <span className="pq-tag">{B}</span>
            </div>
          )}
        </div>

        <span className="pq-counter" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '60px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '72px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '46px' }}>✦</span>
        </>)}
      </div>
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
