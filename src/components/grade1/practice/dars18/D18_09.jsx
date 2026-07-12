// Dars18 · Amaliyot 09 — Og'zaki masala «Olma bozori» · 🔴 · tag: cross_word
// Bir yashikda sakkizta olma bor edi, sotuvchi yana oltita olma keltirdi. Jami nechta? → 14.
// Ikki-yashik make-ten modeli: 1-yashik sakkizta to'la (ikki uya bo'sh). Yonida oltita yakka
// olma ("+6"). G'alaba: oltitadan ikkitasi 1-yashikni o'nga to'ldiradi, qolgan to'rttasi
// 2-yashikka tushadi → 10 + 4 = 14. Make-ten g'oyasi ko'rinadi.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 8, B = 6, TARGET = 14, TEN = 10;
const GAP = TEN - A;      // 2 — 1-yashikni o'nga to'ldirish uchun kerakli olma
const OVER = B - GAP;     // 4 — 2-yashikka o'tadigan ortiqcha
const DATA = { a: A, b: B, target: TARGET, options: [13, 14, 15], level: '🔴', tag: 'cross_word' };

// Olma rang palitrasi — qizil / yashil aylanma (bozor kanoni).
const PAL = [
  { light: '#f0938c', main: '#d9534b', dark: '#a83732' }, // qizil
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
];

// 1-yashik: 10 uya (5×2). 0..7 to'la (A=8), 8..9 bo'sh (ular oltitadan to'ladi).
const BOX1 = Array.from({ length: TEN }).map((_, i) => ({ i, preset: i < A, c: PAL[i % PAL.length] }));
// 2-yashik: 10 uya. G'alabada 0..3 to'ladi (OVER=4), qolgani bo'sh.
const BOX2 = Array.from({ length: TEN }).map((_, i) => ({ i, over: i < OVER, c: PAL[(A + i) % PAL.length] }));
// "+6" yakka olmalar (javobdan oldin): oltita.
const LOOSE = Array.from({ length: B }).map((_, i) => ({ i, c: PAL[(A + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Olma bozori · Og'zaki masala", title: "Sakkizta va oltita olma",
    setup: "Bir yashikda sakkizta olma bor edi, sotuvchi yana oltita olma keltirdi.",
    ask: "Hammasi bo'lib nechta olma bo'ldi?",
    correct: "Barakalla! Sakkizga ikkita qo'shsak — o'nta, yana to'rtta — o'n to'rtta. 8 + 6 = 14.",
    hint: "Avval sakkizni o'ngacha to'ldiring: sakkiz va yana ikki — o'n. Oltitadan ikkitasi ketdi, qolganini o'nga qo'shing.",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Задача', title: 'Восемь и шесть яблок',
    setup: 'В одном ящике было восемь яблок, продавец принёс ещё шесть яблок.',
    ask: 'Сколько всего стало яблок?',
    correct: 'Молодец! К восьми добавим две — десять, и ещё четыре — четырнадцать. 8 + 6 = 14.',
    hint: 'Сначала дополни восемь до десяти: восемь и ещё две — десять. Из шести ушли две, а остаток прибавь к десяти.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — ikki pallali gavda, radial 2-ton doira +
// oq blik, tepada jigarrang bandcha + yashil barg. Bitta olma = bitta birlik.
let __gid = 0;
const Apple = ({ c, size = 22 }) => {
  const id = 'd1809a' + (__gid++);
  return (
    <svg viewBox="0 0 32 34" width={size} height={size * 34 / 32} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="36%" cy="32%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* bandcha */}
      <path d="M16 9 Q16 4 18 2.5" stroke="#7a4a22" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* barg */}
      <path d="M17 7 Q23 3.5 24.5 8.5 Q19 11 17 7 Z" fill="#57a84f" />
      <path d="M18 8.5 Q21 7.5 23.5 8.4" stroke="#3f8038" strokeWidth=".7" fill="none" />
      {/* gavda — ikki palla */}
      <path d="M16 10 C10 7.5 4 11.5 4 19.5 C4 27.5 9 32 12 32 C14 32 15 31 16 31 C17 31 18 32 20 32 C23 32 28 27.5 28 19.5 C28 11.5 22 7.5 16 10 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="11" cy="16" rx="3" ry="4.6" fill="#fff" opacity=".5" transform="rotate(-20 11 16)" />
    </svg>
  );
};

export default function D18_09(props) {
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
    <div className="pq pq1809">
      <style>{`
        .pq1809{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1809 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1809 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1809 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1809 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1809 .pq-scene{position:relative;width:392px;max-width:100%;height:258px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafc 0%,#e6f5e2 62%,#d8ecc9 100%);border:2px solid #b7d6ae;overflow:hidden;}
        .pq1809 .pq-awning{position:absolute;left:-2px;right:-2px;top:0;height:26px;z-index:2;background:repeating-linear-gradient(90deg,#d9534b 0 20px,#fbf3ef 20px 40px);border-bottom:2px solid #b8433c;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq1809 .pq-awning::after{content:'';position:absolute;left:0;right:0;top:24px;height:9px;background:radial-gradient(circle at 10px -1px,#d9534b 8px,transparent 9px) repeat-x;background-size:20px 10px;}
        .pq1809 .pq-sun{position:absolute;right:20px;top:34px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1809 .pq-cloud{position:absolute;top:40px;left:26px;width:44px;height:14px;border-radius:999px;background:rgba(255,255,255,.85);z-index:1;box-shadow:14px 4px 0 -3px rgba(255,255,255,.8),-12px 3px 0 -4px rgba(255,255,255,.7);animation:pqCloud 6s ease-in-out infinite;}
        .pq1809 .pq-board{position:absolute;top:32px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#7fae55,#5f8f3c);border:2.5px solid #4a7530;color:#f4fbe8;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);}
        .pq1809 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1809 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1809 .pq-arena{position:absolute;left:8px;right:8px;top:66px;bottom:36px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq1809 .pq-plus{font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;}
        .pq1809 .pq-box{position:relative;padding:7px 8px 9px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1809 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1809 .pq-grid{display:grid;grid-template-columns:repeat(5,22px);grid-auto-rows:22px;gap:4px;}
        .pq1809 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,54,20,.18);}
        .pq1809 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.55);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1809 .pq-cw{line-height:0;}
        .pq1809 .pq-cw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1809 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .2s both;font-variant-numeric:tabular-nums;}
        .pq1809 .pq-lbl.g{border-color:#1a7f43;color:#1a7f43;}

        .pq1809 .pq-tray{display:flex;flex-direction:column;align-items:center;gap:4px;flex:0 0 auto;}
        .pq1809 .pq-tray .row{display:grid;grid-template-columns:repeat(3,22px);gap:4px;justify-content:center;}
        .pq1809 .pq-tray .pq-cw{animation:pqFloat 2.4s ease-in-out infinite;}
        .pq1809 .pq-tray .pq-cw:nth-child(2){animation-delay:-.5s;} .pq1809 .pq-tray .pq-cw:nth-child(3){animation-delay:-1s;}
        .pq1809 .pq-tray .pq-cw:nth-child(4){animation-delay:-1.4s;} .pq1809 .pq-tray .pq-cw:nth-child(5){animation-delay:-1.9s;} .pq1809 .pq-tray .pq-cw:nth-child(6){animation-delay:-2.2s;}
        .pq1809 .pq-tag{font-size:12px;font-weight:900;color:#a05a2e;background:rgba(255,255,255,.7);padding:1px 10px;border-radius:999px;}

        .pq1809 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1809 .pq-spark.s2{animation-delay:-.6s;} .pq1809 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1809 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1809 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1809 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1809 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1809 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#8a7a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1809 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1809 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1809 .pq-opt:hover:not(:disabled){border-color:#9cc98f;transform:translateY(-2px);}
        .pq1809 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1809 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1809 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1809 .pq-opt:disabled{cursor:default;}
        .pq1809 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1809 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1809 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-48px) scale(.85);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.06);opacity:1;}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(10px);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup} </span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-awning" />
        <span className="pq-cloud" /><span className="pq-sun" />
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

          {/* Javobdan oldin: oltita yakka olma ("+6"). G'alabada: 2-yashik (ortiqcha to'rtta). */}
          {ok ? (
            <div className="pq-box">
              <div className="pq-grid">
                {BOX2.map((s) => (
                  <div key={s.i} className={'pq-cell' + (s.over ? '' : ' empty')}>
                    {s.over && (
                      <span className={'pq-cw' + (!still ? ' in' : '')} style={{ '--dd': `${0.32 + s.i * 0.16}s` }}>
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
          <span className="pq-spark" style={{ left: '16%', top: '78px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '92px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '64px' }}>✦</span>
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
