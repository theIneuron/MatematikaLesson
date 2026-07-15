// Dars18 · Amaliyot 04 — Noma'lum qo'shiluvchi «Olma bozori» · 🟡 · tag: missing_addend
// 1-yashik (ten-frame) da sakkizta olma bor, ikki uya bo'sh. Yig'indi o'n to'rt bo'lishi
// uchun nechta olma qo'shiladi? → 6 (8 + 6 = 14). G'alaba: oltitadan ikkitasi 1-yashikni
// o'nga to'ldiradi, qolgan to'rttasi 2-yashikka tushadi → 10 + 4 = 14. Make-ten g'oyasi.
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

const A = 8, ANS = 6, TARGET = 14, TEN = 10;
const GAP = TEN - A;        // 2 — 1-yashikni o'ngacha to'ldirish uchun kerakli olma
const OVER = ANS - GAP;     // 4 — 2-yashikka o'tadigan ortiqcha
const DATA = { a: A, ans: ANS, target: TARGET, options: [5, 6, 7], ptype: 'P13', level: '🟡', tag: 'missing_addend' };

// Olma rang palitrasi (qizil / yashil — aylanma).
const PAL = [
  { light: '#eb8079', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#83c079', main: '#57a84f', dark: '#3d7a37' }, // yashil
];

// 1-yashik: 10 uya (5×2). 0..7 to'la (A=8), 8..9 bo'sh (ular oltitadan to'ladi).
const BOX1 = Array.from({ length: TEN }).map((_, i) => ({ i, preset: i < A, c: PAL[i % PAL.length] }));
// 2-yashik: 10 uya. G'alabada 0..3 to'ladi (OVER=4), qolgani bo'sh.
const BOX2 = Array.from({ length: TEN }).map((_, i) => ({ i, over: i < OVER, c: PAL[(A + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Olma bozori · Noma'lum qo'shiluvchi", title: "Nechta olma qo'shiladi?",
    setup: "Yashikda sakkizta olma bor. Yig'indi o'n to'rt bo'lishi kerak.",
    ask: "8 + ? = 14. Nechta olma qo'shiladi?",
    correct: "Barakalla! Sakkizga ikkita qo'shsak — o'nta, yana to'rtta — o'n to'rt. 8 + 6 = 14.",
    hint: "Avval sakkizni o'ngacha to'ldiring: sakkiz va yana ikki — o'n. So'ng o'ndan o'n to'rtgacha nechta yetmasligini sanang.",
    q1: "o'nta", q2: "to'rtta",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Неизвестное слагаемое', title: 'Сколько яблок добавят?',
    setup: 'В ящике восемь яблок. Сумма должна стать четырнадцать.',
    ask: '8 + ? = 14. Сколько яблок добавят?',
    correct: 'Молодец! К восьми добавим две — десять, и ещё четыре — четырнадцать. 8 + 6 = 14.',
    hint: 'Сначала дополни восемь до десяти: восемь и ещё две — десять. Потом сосчитай, сколько не хватает от десяти до четырнадцати.',
    q1: 'десять', q2: 'четыре',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — radial 2-ton doira + oq blik, tepada jigarrang
// bandcha + yashil barg. Bitta olma = bitta birlik. Rang palitradan (qizil / yashil).
let __gid = 0;
const Apple = ({ c, size = 22 }) => {
  const id = 'd1804a' + (__gid++);
  return (
    <svg viewBox="0 0 32 34" width={size} height={size * 34 / 32} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="58%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* bandcha */}
      <path d="M16 9 Q15 4 17 2" fill="none" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round" />
      {/* barg */}
      <path d="M17 6 Q23 3 24 8 Q19 10 17 6 Z" fill="#5aa04a" stroke="#3d7a37" strokeWidth=".6" />
      {/* asosiy tana */}
      <path d="M16 9 C10 8 5 12 5 20 C5 27 10 31 16 31 C22 31 27 27 27 20 C27 12 22 8 16 9 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* botiqcha */}
      <ellipse cx="16" cy="10.5" rx="3" ry="1.4" fill={c.dark} opacity=".35" />
      {/* oq blik */}
      <ellipse cx="11.5" cy="15" rx="3" ry="4.2" fill="#fff" opacity=".55" transform="rotate(-22 11.5 15)" />
    </svg>
  );
};

export default function D18_04(props) {
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
    const correct = picked === ANS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: ANS }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1804" ref={fitRef}>
      <style>{`
        .pq1804{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1804 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1804 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1804 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1804 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1804 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:250px;border-radius:20px;background:linear-gradient(#eaf6ff 0%,#dcefff 42%,#cfe7f7 100%);border:2px solid #b9d8ea;overflow:hidden;}
        .pq1804 .pq-fit{position:relative;margin:0 auto;}
        .pq1804 .pq-sun{position:absolute;left:20px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1804 .pq-cloud{position:absolute;z-index:1;width:44px;height:16px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:14px 3px 0 -3px rgba(255,255,255,.85),-12px 3px 0 -4px rgba(255,255,255,.85);}
        .pq1804 .pq-cloud.c1{right:40px;top:26px;animation:pqDrift 6s ease-in-out infinite;}
        .pq1804 .pq-cloud.c2{right:120px;top:14px;transform:scale(.7);animation:pqDrift 7.5s ease-in-out infinite reverse;}
        /* chodir-soyabon (qizil-oq yo'l) */
        .pq1804 .pq-awn{position:absolute;left:0;right:0;top:0;height:34px;z-index:2;background:repeating-linear-gradient(90deg,#d9534b 0 26px,#fbf3ef 26px 52px);border-bottom:3px solid #a63a33;}
        .pq1804 .pq-awn::after{content:'';position:absolute;left:0;right:0;top:34px;height:12px;background:repeating-linear-gradient(90deg,#d9534b 0 26px,#fbf3ef 26px 52px);-webkit-mask:radial-gradient(13px 12px at 13px 0,transparent 12px,#000 13px) repeat-x;mask:radial-gradient(13px 12px at 13px 0,transparent 12px,#000 13px) repeat-x;-webkit-mask-size:26px 12px;mask-size:26px 12px;}
        .pq1804 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:10px;background:linear-gradient(#5c8a3a,#437029);border:2.5px solid #33581e;color:#f4fbe9;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);}
        .pq1804 .pq-rasta{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1804 .pq-rasta::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1804 .pq-arena{position:absolute;left:8px;right:8px;top:52px;bottom:36px;display:flex;align-items:center;justify-content:center;gap:10px;z-index:3;}
        .pq1804 .pq-plus{font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;}
        .pq1804 .pq-box{position:relative;padding:8px 9px 10px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1804 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1804 .pq-grid{display:grid;grid-template-columns:repeat(5,24px);grid-auto-rows:26px;gap:4px;}
        .pq1804 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,54,20,.18);}
        .pq1804 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.55);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1804 .pq-cell.ask{background:rgba(217,83,75,.1);border-style:dashed;border-color:rgba(166,58,51,.6);}
        .pq1804 .pq-q{font-size:18px;font-weight:900;color:#a63a33;opacity:.7;}
        .pq1804 .pq-cw{line-height:0;}
        .pq1804 .pq-cw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1804 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .2s both;font-variant-numeric:tabular-nums;}
        .pq1804 .pq-lbl.g{border-color:#1a7f43;color:#1a7f43;}

        .pq1804 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1804 .pq-spark.s2{animation-delay:-.6s;} .pq1804 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1804 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1804 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1804 .pq-eq b.add{background:#fdeceb;border-color:#d9534b;color:#a63a33;}
        .pq1804 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1804 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1804 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#8a7a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1804 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1804 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1804 .pq-opt:hover:not(:disabled){border-color:#e2a3a0;transform:translateY(-2px);}
        .pq1804 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1804 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1804 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1804 .pq-opt:disabled{cursor:default;}
        .pq1804 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1804 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1804 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-48px) scale(.85);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.06);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-10px);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 250 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-awn" />
        <span className="pq-sun" /><span className="pq-cloud c1" /><span className="pq-cloud c2" />
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

          {/* Javobdan oldin: noma'lum (2-yashik so'roq bilan). G'alabada: 2-yashik (ortiqcha to'rt). */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {BOX2.map((s) => {
                if (ok) {
                  return (
                    <div key={s.i} className={'pq-cell' + (s.over ? '' : ' empty')}>
                      {s.over && (
                        <span className={'pq-cw' + (!still ? ' in' : '')} style={{ '--dd': `${0.32 + s.i * 0.16}s` }}>
                          <Apple c={s.c} size={20} />
                        </span>
                      )}
                    </div>
                  );
                }
                // Javobdan oldin: birinchi uya so'roq, qolganlari bo'sh.
                return (
                  <div key={s.i} className={'pq-cell' + (s.i === 0 ? ' ask' : ' empty')}>
                    {s.i === 0 && <span className="pq-q">?</span>}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-lbl">{OVER}</span>}
          </div>
        </div>

        <span className="pq-rasta" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '60px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '72px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '46px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>+</i><b className="add">{ANS}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} + {GAP} + {OVER} = {TEN} + {OVER}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === ANS;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
