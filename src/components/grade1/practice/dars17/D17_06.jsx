// Dars17 · Amaliyot 06 — Zanjir «Shirinlik do'koni» · 🔴 · tag: make_ten_add_chain
// 4 qator: har birida IKKI mini ten-frame (2×5). 1-qutida A ta shirinlik, 2-qutida B ta —
// IKKALA quti ham ifodadagi songa mos to'ldirilgan. "A + B = ?" — jamini tanlang.
// G'alabada make-ten ko'chishi: 2-qutidan (10-A) ta shirinlik 1-qutini o'ngacha to'ldiradi,
// 2-qutida faqat ortig'i (A+B-10) qoladi.
// Do'kon sahnasi: yog'och peshtaxta, deraza + quyosh, osma chiroq nuri (uzluksiz ambient).
// VEDI-DO-VERNOGO: noto'g'ri qator qizil + silkinadi, qulf yo'q; faqat hammasi to'g'ri bo'lsa qulf.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10;
const ROWS = [
  { a: 9, b: 3, ans: 12, opts: [10, 11, 12, 13] },
  { a: 8, b: 5, ans: 13, opts: [11, 12, 13, 14] },
  { a: 9, b: 6, ans: 15, opts: [13, 14, 15, 16] },
  { a: 7, b: 7, ans: 14, opts: [12, 13, 14, 15] },
];
const DATA = { ptype: 'P13', level: '🔴', tag: 'make_ten_add_chain' };

// SHIRINLIK palitrasi (aylanma, 2-ton): qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { main: '#e2635b', dark: '#bf443d', light: '#f0938c' },
  { main: '#4a90d9', dark: '#3570b3', light: '#82b4e8' },
  { main: '#f2b134', dark: '#cd9018', light: '#f9ce74' },
  { main: '#57a84f', dark: '#41863c', light: '#89c882' },
  { main: '#e879a6', dark: '#c9578a', light: '#f4a9c7' },
];

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · Zanjir", title: "O'nlikdan o'tib qo'shing",
    setup: "Har qatorda ikki qutida shirinliklar bor.",
    ask: "Har qatorda jami nechta shirinlik bo'lishini tanlang.",
    correct: "Barakalla! Har qatorda birinchi quti o'ngacha to'ldi, ikkinchi qutida ortig'i qoldi!",
    hint: "Qizil qatorlarga qarang: ikkinchi qutidan birinchi qutini avval o'ngacha to'ldiring, keyin qolganini qo'shing.",
    board: "Shirinlik do'koni",
  },
  ru: {
    eyebrow: 'Магазин сладостей · Цепочка', title: 'Сложи с переходом через десяток',
    setup: 'В каждой строке сладости лежат в двух коробках.',
    ask: 'Выбери, сколько сладостей всего в каждой строке.',
    correct: 'Молодец! В каждой строке первая коробка заполнилась до десяти, во второй остался излишек!',
    hint: 'Посмотри на красные строки: из второй коробки сначала дополни первую до десяти, потом прибавь остаток.',
    board: 'Магазин сладостей',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — 2-ton radial doira (tashqi soya +
// ichki asosiy rang) + oq blik, ikki chetida o'ram/burama (uchburchak). Bitta konfet = bitta dona.
const Candy = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 40 28" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M7 14 L1.5 8 L1.5 20 Z" fill={c.dark} />
    <path d="M7 14 L3 11 L3 17 Z" fill={c.main} opacity=".85" />
    <path d="M33 14 L38.5 8 L38.5 20 Z" fill={c.dark} />
    <path d="M33 14 L37 11 L37 17 Z" fill={c.main} opacity=".85" />
    <circle cx="20" cy="14" r="10" fill={c.dark} />
    <circle cx="20" cy="14" r="8.6" fill={c.main} />
    <circle cx="17" cy="11" r="4.6" fill={c.light} opacity=".55" />
    <ellipse cx="15.6" cy="9.6" rx="3" ry="2" fill="#ffffff" opacity=".72" />
    <path d="M13 17 Q20 21 27 16" fill="none" stroke={c.dark} strokeWidth="1.1" opacity=".45" strokeLinecap="round" />
  </svg>
);

export default function D17_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda to'ldirish-animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a} + ${r.b} = ?`), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1706">
      <style>{`
        .pq1706{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1706 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0537a;text-transform:uppercase;}
        .pq1706 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1706 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1706 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1706 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#fbe6ef,#f6dbe4);border:2px solid #ecc9d6;}
        .pq1706 .pq-scene{position:relative;width:372px;max-width:100%;height:92px;border-radius:18px;background:linear-gradient(#fdf0f5 0%,#f8dfe8 55%,#f0cdd9 100%);border:2px solid #e9cad7;overflow:hidden;}
        .pq1706 .pq-beam{position:absolute;top:-20px;right:52px;width:70px;height:150px;background:linear-gradient(180deg,rgba(255,241,196,.7),rgba(255,241,196,0));transform:rotate(16deg);transform-origin:top center;z-index:1;animation:pqBeam 4.5s ease-in-out infinite;pointer-events:none;}
        .pq1706 .pq-window{position:absolute;top:12px;right:14px;width:56px;height:40px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #b58a4e;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1706 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b58a4e;transform:translateX(-1px);}
        .pq1706 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#b58a4e;transform:translateY(-1px);}
        .pq1706 .pq-sun{position:absolute;top:18px;right:22px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1706 .pq-lamp{position:absolute;left:44px;top:0;width:2px;height:16px;background:#8a5628;z-index:1;}
        .pq1706 .pq-lampshade{position:absolute;left:32px;top:14px;width:26px;height:12px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 9px 20px 5px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1706 .pq-board{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:5;padding:6px 15px 7px;border-radius:10px;background:linear-gradient(#d9749b,#bf5480);border:2.5px solid #97365c;color:#fff3f7;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1706 .pq-board::before,.pq1706 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#97365c;}
        .pq1706 .pq-board::before{left:18px;} .pq1706 .pq-board::after{right:18px;}
        .pq1706 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#c98a4e,#a86c34 60%,#8f5a2a);border-top:3px solid #d9a463;z-index:2;}
        .pq1706 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.22);}
        .pq1706 .pq-jar{position:absolute;right:20px;bottom:26px;width:30px;height:34px;z-index:3;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1706 .pq-jar .cup{position:absolute;left:0;bottom:0;width:30px;height:24px;border-radius:6px 6px 8px 8px;background:linear-gradient(#e9f0f6,#c8d9e6);border:1.6px solid #9db4c6;}
        .pq1706 .pq-jar .cap{position:absolute;left:3px;bottom:22px;width:24px;height:6px;border-radius:4px;background:#d9749b;border:1.4px solid #bf5480;}
        .pq1706 .pq-jar .d{position:absolute;bottom:5px;width:9px;height:9px;border-radius:50%;}
        .pq1706 .pq-jar .d.a{left:4px;background:#e2635b;} .pq1706 .pq-jar .d.b{left:14px;bottom:12px;background:#f2b134;} .pq1706 .pq-jar .d.c{left:18px;background:#57a84f;}

        /* qatorlar */
        .pq1706 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;width:100%;}
        .pq1706 .pq-rw{display:flex;gap:8px;align-items:center;align-content:center;justify-content:center;flex-wrap:wrap;padding:8px 9px;border-radius:14px;border:2.5px solid #eccfdb;background:#fffafc;transition:.15s;}
        .pq1706 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1706 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1706 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}

        /* ikki quti (mini ten-frame 2×5) + orasidagi + */
        .pq1706 .pq-boxes{display:flex;align-items:center;gap:5px;flex:0 0 auto;}
        .pq1706 .pq-frame{display:grid;grid-template-columns:repeat(5,21px);grid-auto-rows:17px;gap:3px;padding:5px;border-radius:11px;background:linear-gradient(#f6e7d2,#efd9bb);border:2px solid #d9be92;box-shadow:inset 0 1px 0 rgba(255,255,255,.4);}
        .pq1706 .pq-frame.two{background:linear-gradient(#f2ecf6,#e6dcee);border-color:#cdbcdc;}
        .pq1706 .pq-cell{position:relative;border-radius:5px;background:rgba(255,252,246,.5);border:1.4px solid rgba(150,110,70,.32);display:flex;align-items:center;justify-content:center;}
        .pq1706 .pq-cell.empty{background:rgba(255,255,255,.28);border-style:dashed;border-color:rgba(150,110,70,.5);}
        .pq1706 .pq-frame.two .pq-cell.empty{border-color:rgba(120,96,150,.5);}
        .pq1706 .pq-cell.gap{animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1706 .pq-rw:nth-child(2) .pq-cell.gap{animation-delay:-.7s;}
        .pq1706 .pq-rw:nth-child(3) .pq-cell.gap{animation-delay:-1.4s;}
        .pq1706 .pq-rw:nth-child(4) .pq-cell.gap{animation-delay:-2.1s;}
        .pq1706 .pq-candy{width:18px;height:13px;line-height:0;}
        .pq1706 .pq-candy.drop{animation:pqDrop .5s cubic-bezier(.3,1.2,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1706 .pq-plus{font-size:16px;font-weight:900;color:#a86c34;}

        .pq1706 .pq-eq{display:flex;align-items:center;gap:5px;font-size:19px;font-weight:900;color:#8a6a55;font-variant-numeric:tabular-nums;}
        .pq1706 .pq-eq .a{color:#c0537a;} .pq1706 .pq-eq .b{color:#7a5aa8;}
        .pq1706 .pq-slot{width:38px;height:40px;border-radius:10px;border:2.5px dashed #dcb9cb;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#c98aa8;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1706 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1706 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1706 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1706 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1706 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}

        .pq1706 .pq-chip{flex-basis:100%;text-align:center;margin-left:2px;padding:5px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pqPop .35s ease both;}
        .pq1706 .pq-sgs{flex-basis:100%;display:flex;gap:6px;margin-left:2px;justify-content:center;align-content:center;}
        .pq1706 .pq-sg{width:40px;height:42px;border-radius:11px;border:2.5px solid #e6ccd8;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1706 .pq-sg:hover:not(:disabled){border-color:#e08ab0;transform:translateY(-2px);}
        .pq1706 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1706 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1706 .pq-sg:disabled{cursor:default;}

        .pq1706 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:14px;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1706 .pq-spark.s2{animation-delay:-.6s;} .pq1706 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1706 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1706 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1706 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBeam{0%,100%{opacity:.55;}50%{opacity:.85;}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.6deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-30px) scale(.8);}70%{opacity:1;transform:translateY(2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-beam" />
          <span className="pq-lamp" /><span className="pq-lampshade" />
          <span className="pq-window" />
          <span className="pq-sun" />
          <div className="pq-board">{t.board}</div>
          <span className="pq-jar"><span className="cup" /><span className="cap" /><span className="d a" /><span className="d b" /><span className="d c" /></span>
          <span className="pq-shelf" />
          {ok && (<>
            <span className="pq-spark" style={{ left: '10%', top: '20px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '46%', bottom: '10px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '30%', top: '12px' }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const overflow = r.a + r.b - TEN; // g'alabada 2-qutiga o'tadigan shirinliklar
            return (
              <div key={i} className={'pq-rw' + cls}>
                {/* IKKI QUTI: 1-quti A ta (g'alabada o'ngacha to'ladi), 2-quti B ta (g'alabada ortig'i qoladi) */}
                <div className="pq-boxes">
                  <div className="pq-frame">
                    {Array.from({ length: TEN }).map((_, k) => {
                      const preset = k < r.a;             // dastlab to'la
                      const fillNow = ok && k >= r.a;     // g'alabada o'ngacha to'lish
                      const show = preset || fillNow;
                      return (
                        <div key={k} className={'pq-cell' + (show ? ' full' : ' empty gap')}>
                          {show && (
                            <span className={'pq-candy' + (fillNow && !still ? ' drop' : '')} style={{ '--dd': `${(k - r.a) * 0.1}s` }}>
                              <Candy c={PAL[(i + k) % PAL.length]} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="pq-plus">+</span>
                  <div className="pq-frame two">
                    {Array.from({ length: TEN }).map((_, k) => {
                      const preFill = !ok && k < r.b;  // dastlab: ikkinchi qo'shiluvchi (B ta) ko'rinadi
                      const fillNow = ok && k < overflow; // g'alabada: faqat ortig'i qoladi (qolgani 1-qutiga o'tdi)
                      const show = preFill || fillNow;
                      return (
                        <div key={k} className={'pq-cell' + (show ? ' full' : ' empty')}>
                          {show && (
                            <span className={'pq-candy' + (fillNow && !still ? ' drop' : '')} style={{ '--dd': `${(TEN - r.a + k) * 0.1}s` }}>
                              <Candy c={PAL[(i + k + 2) % PAL.length]} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pq-eq">
                  <span className="a">{r.a}</span>
                  <span>+</span>
                  <span className="b">{r.b}</span>
                  <span>=</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>

                {ok ? (
                  <span className="pq-chip">{r.a} + {r.b} = {r.ans}</span>
                ) : (
                  <div className="pq-sgs">
                    {r.opts.map((n) => (
                      <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                        onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
