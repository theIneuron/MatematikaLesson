// Dars18 · Amaliyot 03 — To'g'ri-noto'g'ri «Olma bozori» · 🟡 · tag: true_false
// Ekranda tenglik: "9 + 6 = 15". Savol: "Bu to'g'rimi?" Ikki tugma: "Ha" / "Yo'q".
// To'g'ri javob = "Ha" (9 + 6 haqiqatan 15). Yashik(ten-frame) modeli 9 + 6 ni ko'rsatadi:
// 1-yashikda to'qqizta olma (bitta uya bo'sh), yonida oltita yakka olma ("+6").
// G'alaba: oltitadan bittasi 1-yashikni o'nga to'ldiradi, qolgan beshtasi 2-yashikka →
// 10 + 5 = 15. Chip "9 + 6 = 15 ✓". VEDI-DO-VERNOGO: noto'g'ri "Yo'q" bosilsa qulf yo'q,
// retry yo'q; setChecked FAQAT to'g'rida.
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

const A = 9, B = 6, SUM = 15, TEN = 10;
const GAP = TEN - A;      // 1 — 1-yashikni to'ldirish uchun kerakli olma
const OVER = B - GAP;     // 5 — 2-yashikka o'tadigan ortiqcha
const DATA = { a: A, b: B, sum: SUM, isTrue: true, correct: 'ha', ptype: 'P2', level: '🟡', tag: 'true_false' };

// 1-yashik: 10 uya (5×2). 0..8 to'la (A=9), 9-uya bo'sh (u oltitadan to'ladi).
const BOX1 = Array.from({ length: TEN }).map((_, i) => ({ i, preset: i < A, green: i % 2 === 1 }));
// 2-yashik: 10 uya. G'alabada 0..4 to'ladi (OVER=5), qolgani bo'sh.
const BOX2 = Array.from({ length: TEN }).map((_, i) => ({ i, over: i < OVER, green: (A + i) % 2 === 1 }));
// "+6" yakka olmalar (javobdan oldin): oltita.
const LOOSE = Array.from({ length: B }).map((_, i) => ({ i, green: (A + i) % 2 === 1 }));

const T = {
  uz: {
    eyebrow: "Olma bozori · To'g'ri-noto'g'ri", title: "Bu tenglik to'g'rimi?",
    setup: "Rastada to'qqizta olma bor, yana oltita olma qo'shildi.",
    ask: "9 + 6 = 15. Bu to'g'rimi?",
    correct: "Barakalla! To'qqizga bitta qo'shsak — o'nta, yana beshta — o'n beshta. 9 + 6 = 15. Ha, to'g'ri.",
    hint: "O'ngacha to'ldirib hisoblang: to'qqiz va yana bir — o'n. Oltitadan biri ketdi, qolgan beshtasini o'nga qo'shing.",
    yes: "Ha", no: "Yo'q",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Верно-неверно', title: 'Это равенство верное?',
    setup: 'На прилавке девять яблок, добавили ещё шесть яблок.',
    ask: '9 + 6 = 15. Это верно?',
    correct: 'Молодец! К девяти добавим одно — десять, и ещё пять — пятнадцать. 9 + 6 = 15. Да, верно.',
    hint: 'Дополни до десяти: девять и ещё одно — десять. Из шести ушло одно, а остаток пять прибавь к десяти.',
    yes: 'Да', no: 'Нет',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — ikki-pallali tana, radial 2-ton to'ldirish +
// oq blik, tepada jigarrang bandcha + yashil barg. Bitta olma = bitta birlik.
// Rang: qizil #d9534b / yashil #57a84f (aylanma).
let __gid = 0;
const Apple = ({ green, size = 22 }) => {
  const id = 'd1803a' + (__gid++);
  const main = green ? '#57a84f' : '#d9534b';
  const light = green ? '#9ad088' : '#f0908a';
  const dark = green ? '#3f8038' : '#b13f39';
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={light} />
          <stop offset="58%" stopColor={main} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      {/* bandcha */}
      <path d="M20 10 Q21 5 24 4" stroke="#7a4a24" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* barg */}
      <path d="M21 7 Q28 2.5 31 8.5 Q24.5 11 21 7 Z" fill="#67ad4c" stroke="#4d8a37" strokeWidth=".6" />
      <path d="M22 7.6 Q26 6.5 29.5 8.6" stroke="#4d8a37" strokeWidth=".7" fill="none" />
      {/* tana (ikki pallali olma) */}
      <path d="M20 11 C13 8.5 5.5 13 5.5 22 C5.5 31 12 37.5 20 33.5 C28 37.5 34.5 31 34.5 22 C34.5 13 27 8.5 20 11 Z" fill={`url(#${id})`} stroke={dark} strokeWidth=".9" />
      {/* oq blik */}
      <ellipse cx="14" cy="17.5" rx="4.2" ry="2.8" fill="#fff" opacity=".55" transform="rotate(-26 14 17.5)" />
      <circle cx="24.5" cy="26" r="1.4" fill="#fff" opacity=".3" />
    </svg>
  );
};

export default function D18_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);      // 'ha' | 'yo'q'
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
    const correct = picked === DATA.correct;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.yes, t.no], studentAnswer: { value: picked }, correctAnswer: { value: DATA.correct }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1803" ref={fitRef}>
      <style>{`
        .pq1803{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1803 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1803 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1803 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1803 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq1803 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:252px;border-radius:20px;background:linear-gradient(#eaf6ff 0%,#dcefff 44%,#cfe6f6 100%);border:2px solid #b9d6ea;overflow:hidden;}
        .pq1803 .pq-fit{position:relative;margin:0 auto;}
        .pq1803 .pq-sun{position:absolute;left:20px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 5px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1803 .pq-cloud{position:absolute;top:26px;right:24px;width:52px;height:16px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:14px 4px 0 -3px rgba(255,255,255,.8),-14px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* chodir-soyabon: qizil-oq yo'lli */
        .pq1803 .pq-canopy{position:absolute;left:0;right:0;top:0;height:38px;z-index:2;background:repeating-linear-gradient(90deg,#d9534b 0 22px,#fbeae3 22px 44px);border-bottom:3px solid #b13f39;box-shadow:0 3px 6px rgba(0,0,0,.15);}
        .pq1803 .pq-canopy::after{content:'';position:absolute;left:0;right:0;bottom:-11px;height:12px;background:repeating-linear-gradient(90deg,transparent 0 11px,#d9534b 11px 22px,transparent 22px 33px);-webkit-mask:radial-gradient(circle at 11px 0,transparent 10px,#000 11px) 0 0/22px 12px;mask:radial-gradient(circle at 11px 0,transparent 10px,#000 11px) 0 0/22px 12px;}
        .pq1803 .pq-post{position:absolute;bottom:0;width:6px;background:linear-gradient(#b9895a,#8a5f34);z-index:1;}
        .pq1803 .pq-post.l{left:8px;height:210px;} .pq1803 .pq-post.r{right:8px;height:210px;}
        .pq1803 .pq-board{position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#5aa54f,#3f8038);border:2.5px solid #2f6a2a;color:#f3fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.3);}
        .pq1803 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1803 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1803 .pq-arena{position:absolute;left:20px;right:20px;top:50px;bottom:34px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq1803 .pq-plus{font-size:22px;font-weight:900;color:#8a5628;flex:0 0 auto;}
        .pq1803 .pq-box{position:relative;padding:8px 9px 10px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1803 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1803 .pq-grid{display:grid;grid-template-columns:repeat(5,24px);grid-auto-rows:24px;gap:4px;}
        .pq1803 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,54,20,.18);}
        .pq1803 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.55);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1803 .pq-aw{line-height:0;}
        .pq1803 .pq-aw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1803 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s .2s both;font-variant-numeric:tabular-nums;}
        .pq1803 .pq-lbl.g{border-color:#1a7f43;color:#1a7f43;}

        .pq1803 .pq-tray{display:flex;flex-direction:column;align-items:center;gap:4px;flex:0 0 auto;}
        .pq1803 .pq-tray .row{display:grid;grid-template-columns:repeat(3,24px);gap:4px;justify-content:center;}
        .pq1803 .pq-tray .pq-aw{animation:pqFloat 2.4s ease-in-out infinite;}
        .pq1803 .pq-tray .pq-aw:nth-child(2){animation-delay:-.5s;} .pq1803 .pq-tray .pq-aw:nth-child(3){animation-delay:-1s;}
        .pq1803 .pq-tray .pq-aw:nth-child(4){animation-delay:-1.4s;} .pq1803 .pq-tray .pq-aw:nth-child(5){animation-delay:-1.9s;} .pq1803 .pq-tray .pq-aw:nth-child(6){animation-delay:-2.2s;}
        .pq1803 .pq-tag{font-size:12px;font-weight:900;color:#8a5628;background:rgba(255,255,255,.72);padding:1px 10px;border-radius:999px;font-variant-numeric:tabular-nums;}

        .pq1803 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1803 .pq-spark.s2{animation-delay:-.6s;} .pq1803 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1803 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1803 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1803 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1803 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1803 .pq-eq .ok{color:#1a7f43;font-size:22px;}
        .pq1803 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#8a7a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1803 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:18px;}
        .pq1803 .pq-opt{min-width:118px;height:62px;padding:0 18px;font-size:22px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq1803 .pq-opt:hover:not(:disabled){border-color:#8fc487;transform:translateY(-2px);}
        .pq1803 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq1803 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1803 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1803 .pq-opt:disabled{cursor:default;}
        .pq1803 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1803 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1803 .pq-fb.no{background:#fdecec;color:#c0392b;}
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

      <div className="pq-fit" style={{ width: 372 * scale, height: 252 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" /><span className="pq-cloud" />
        <span className="pq-post l" /><span className="pq-post r" />
        <span className="pq-canopy" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 1-yashik: to'qqiz to'la + bir bo'sh (g'alabada to'ladi) */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {BOX1.map((s) => {
                const show = s.preset || ok;
                const isNew = !s.preset && ok;
                return (
                  <div key={s.i} className={'pq-cell' + (show ? '' : ' empty')}>
                    {show && (
                      <span className={'pq-aw' + (isNew && !still ? ' in' : '')} style={{ '--dd': `${(s.i - A) * 0.16}s` }}>
                        <Apple green={s.green} size={22} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-lbl g">{TEN}</span>}
          </div>

          <span className="pq-plus">+</span>

          {/* Javobdan oldin: oltita yakka olma ("+6"). G'alabada: 2-yashik (ortiqcha beshta). */}
          {ok ? (
            <div className="pq-box">
              <div className="pq-grid">
                {BOX2.map((s) => (
                  <div key={s.i} className={'pq-cell' + (s.over ? '' : ' empty')}>
                    {s.over && (
                      <span className={'pq-aw' + (!still ? ' in' : '')} style={{ '--dd': `${0.32 + s.i * 0.16}s` }}>
                        <Apple green={s.green} size={22} />
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
                  <span key={s.i} className="pq-aw"><Apple green={s.green} size={22} /></span>
                ))}
              </div>
              <span className="pq-tag">{B}</span>
            </div>
          )}
        </div>

        <span className="pq-counter" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '58px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '70px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '46px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>+</i><b>{B}</b><i>=</i><b className="res">{SUM}</b><span className="ok">✓</span></div>
        <div className="pq-sub">{A} + {GAP} + {OVER} = {TEN} + {OVER}</div>
      </>)}

      <div className="pq-opts">
        {[{ k: 'ha', lbl: t.yes }, { k: "yo'q", lbl: t.no }].map((o) => {
          const sel = picked === o.k; const right = ok && o.k === DATA.correct;
          return <button key={o.k} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o.k); setFeedback(null); }}>{o.lbl}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
