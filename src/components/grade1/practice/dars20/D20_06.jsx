// Dars20 · Amaliyot 06 — P13 Zanjir «Garaj» · 🔴 · tag: make_ten_chain_sub
// 4 qator: har birida garaj (2×5 = 10 joy to'la) + yo'lakchada birliklar. "A − B = ?" — o'tib ayirish.
// G'alaba: mashinalar garajdan chiqib yo'lga qarab siljiydi (avval birliklar, so'ng o'nlikdan) —
// ikki qadamli, sekin, bir-martalik; g'ildirak aylanadi. Qolgan mashinalar sanaladi.
// Chip «A − B = N», ost-satr make-ten «A − x − y = 10 − y». VEDI-DO-VERNOGO: noto'g'rida qulf yo'q,
// retry yo'q; setChecked FAQAT to'g'rida. Minus = U+2212 «−».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−';        // U+2212 — display minus (defis EMAS)
const TEN = 10;
// Har qator: teen − bir xonali, o'tib ayirish (musbat natija). units = A−10, fromten = B−units.
const ROWS = [
  { a: 14, b: 5, ans: 9, opts: [7, 8, 9, 10] },
  { a: 13, b: 6, ans: 7, opts: [5, 6, 7, 8] },
  { a: 15, b: 7, ans: 8, opts: [6, 7, 8, 9] },
  { a: 12, b: 8, ans: 4, opts: [2, 3, 4, 5] },
].map((r) => ({ ...r, units: r.a - TEN, fromten: r.b - (r.a - TEN) }));
const DATA = { ptype: 'P13', level: '🔴', tag: 'make_ten_chain_sub' };

// MASHINA palitrasi (aylanma, 2-ton): qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { main: '#e2635b', dark: '#bf443d', light: '#f0938c' }, // qizil
  { main: '#4a90d9', dark: '#3570b3', light: '#82b4e8' }, // ko'k
  { main: '#f2b134', dark: '#cd9018', light: '#f9ce74' }, // sariq
  { main: '#57a84f', dark: '#41863c', light: '#89c882' }, // yashil
  { main: '#e879a6', dark: '#c9578a', light: '#f4a9c7' }, // pushti
];

const T = {
  uz: {
    eyebrow: "Garaj · Zanjir",
    title: "Garaj",
    setup: "Har qatordan mashinalar chiqadi.",
    ask: "Har qatorda nechta qoladi?",
    correct: "Barakalla! Har bir garaj to'g'ri bo'shatildi.",
    hint: "Qizil qatorlarga qarang: avval yo'lakchadagi birliklarni chiqaring — o'nta qoladi, so'ng o'nlikdan qolganini oling.",
  },
  ru: {
    eyebrow: "Гараж · Цепочка",
    title: "Гараж",
    setup: "Из каждой строки уезжают машины.",
    ask: "Сколько останется в каждой строке?",
    correct: "Молодец! Каждый гараж освобождён верно.",
    hint: "Посмотри на красные строки: сначала выведи машины с дорожки — станет десять, потом убери остальные из десятка.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (2-ton) + tom/oynalar +
// 2 g'ildirak + fara. Bitta mashina = bitta birlik. spin=true bo'lsa g'ildiraklar aylanadi.
const Car = ({ c = PAL[0], spin = false }) => (
  <svg viewBox="0 0 44 28" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
    {/* tom / kabina */}
    <path d="M12 12 Q14 4.5 20 4.5 L27 4.5 Q32.5 4.5 34.5 12 Z" fill={c.dark} />
    <path d="M15 11 Q16.4 7 20 7 L22.4 7 L22.4 11 Z" fill="#e4f2fb" opacity=".92" />
    <path d="M24.6 7 L26.8 7 Q30.6 7 32 11 L24.6 11 Z" fill="#e4f2fb" opacity=".92" />
    {/* tana */}
    <rect x="4.5" y="11" width="35" height="10.5" rx="5.2" fill={c.main} stroke={c.dark} strokeWidth="1" />
    <rect x="7" y="13" width="30" height="3" rx="1.5" fill={c.light} opacity=".55" />
    {/* fara */}
    <circle cx="37.5" cy="15.4" r="1.7" fill="#fff3c0" stroke={c.dark} strokeWidth=".4" />
    {/* g'ildiraklar */}
    <g className={'whl' + (spin ? ' sp' : '')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx="14" cy="21.5" r="4.4" fill="#2b2f36" />
      <circle cx="14" cy="21.5" r="1.7" fill="#c7ccd4" />
      <rect x="13.4" y="17.6" width="1.2" height="7.8" fill="#565c66" />
      <rect x="10.1" y="20.9" width="7.8" height="1.2" fill="#565c66" />
    </g>
    <g className={'whl' + (spin ? ' sp' : '')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx="30" cy="21.5" r="4.4" fill="#2b2f36" />
      <circle cx="30" cy="21.5" r="1.7" fill="#c7ccd4" />
      <rect x="29.4" y="17.6" width="1.2" height="7.8" fill="#565c66" />
      <rect x="26.1" y="20.9" width="7.8" height="1.2" fill="#565c66" />
    </g>
  </svg>
);

export default function D20_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda chiqib-ketish animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a} ${M} ${r.b} = ?`), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2006">
      <style>{`
        .pq2006{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2006 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f6ea5;text-transform:uppercase;}
        .pq2006 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2006 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2006 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2006 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#e4eefb,#dbe7f6);border:2px solid #cad9ee;}

        /* sahna: garaj binosi, yo'l, svetofor, quyosh (ambient) */
        .pq2006 .pq-scene{position:relative;width:372px;max-width:100%;height:88px;border-radius:18px;background:linear-gradient(#dff0fb 0%,#e9f0fb 55%,#eef3f8 100%);border:2px solid #cad9ee;overflow:hidden;}
        .pq2006 .pq-sun{position:absolute;top:14px;left:18px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2006 .pq-garage{position:absolute;right:20px;bottom:20px;width:78px;height:50px;z-index:1;}
        .pq2006 .pq-garage .wall{position:absolute;left:0;bottom:0;width:78px;height:44px;border-radius:5px 5px 0 0;background:linear-gradient(#cfe0f0,#b7cbe2);border:2px solid #8ea9c6;}
        .pq2006 .pq-garage .roof{position:absolute;left:-4px;top:0;width:86px;height:14px;border-radius:5px;background:linear-gradient(#5a7fa8,#3f6089);border:2px solid #2f4b6d;}
        .pq2006 .pq-garage .door{position:absolute;left:12px;bottom:0;width:54px;height:32px;border-radius:4px 4px 0 0;background:repeating-linear-gradient(#eaf1f8 0 5px,#cdddec 5px 6px);border:2px solid #8ea9c6;box-shadow:inset 0 2px 3px rgba(0,0,0,.08);}
        .pq2006 .pq-road{position:absolute;left:0;right:0;bottom:0;height:16px;background:linear-gradient(#5b6470,#454d57);z-index:2;}
        .pq2006 .pq-road::after{content:'';position:absolute;left:0;right:0;top:7px;height:2px;background:repeating-linear-gradient(90deg,#f4d55e 0 14px,transparent 14px 26px);}
        .pq2006 .pq-tl{position:absolute;left:20px;bottom:16px;width:12px;height:30px;z-index:3;}
        .pq2006 .pq-tl .pole{position:absolute;left:5px;bottom:0;width:2px;height:14px;background:#4a545f;}
        .pq2006 .pq-tl .box{position:absolute;left:0;top:0;width:12px;height:22px;border-radius:3px;background:#2b3038;border:1.5px solid #171b21;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;}
        .pq2006 .pq-tl .lt{width:5px;height:5px;border-radius:50%;background:#3a424c;}
        .pq2006 .pq-tl .lt.r{background:#e2635b;box-shadow:0 0 5px 1px rgba(226,99,91,.7);animation:pqTl 3s steps(1) infinite;}
        .pq2006 .pq-tl .lt.y{background:#3a424c;}
        .pq2006 .pq-tl .lt.g{background:#3a424c;animation:pqTlg 3s steps(1) infinite;}
        .pq2006 .pq-board{position:absolute;top:11px;left:50%;transform:translateX(-50%);z-index:5;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#4f7fb2,#3a6193);border:2.5px solid #2c4c74;color:#eff6ff;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2006 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:14px;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2006 .pq-spark.s2{animation-delay:-.6s;} .pq2006 .pq-spark.s3{animation-delay:-1.15s;}

        /* qatorlar */
        .pq2006 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;width:100%;}
        .pq2006 .pq-rw{display:flex;gap:9px;align-items:center;justify-content:center;align-content:center;flex-wrap:wrap;padding:8px 9px;border-radius:14px;border:2.5px solid #cdd9ea;background:#fbfdff;transition:.15s;}
        .pq2006 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2006 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq2006 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}

        /* garaj (2×5 = 10 joy) + yo'lakcha (birliklar) */
        .pq2006 .pq-gz{display:flex;align-items:flex-end;gap:6px;flex:0 0 auto;}
        .pq2006 .pq-frame{display:grid;grid-template-columns:repeat(5,29px);grid-auto-rows:20px;gap:3px;padding:5px;border-radius:11px;background:linear-gradient(#e7edf4,#d6e0ec);border:2px solid #a9c0da;box-shadow:inset 0 1px 0 rgba(255,255,255,.5);}
        .pq2006 .pq-lane{display:flex;flex-direction:column;justify-content:flex-end;gap:3px;padding:5px 4px;border-radius:9px;background:linear-gradient(#eef1f5,#e0e6ee);border:2px dashed #b7c3d3;}
        .pq2006 .pq-lane.none{display:none;}
        .pq2006 .pq-slot2{position:relative;border-radius:6px;background:rgba(255,255,255,.5);border:1.4px solid rgba(120,150,185,.4);display:flex;align-items:center;justify-content:center;}
        .pq2006 .pq-slot2.gone{background:rgba(255,255,255,.28);border-style:dashed;border-color:rgba(120,150,185,.55);}
        .pq2006 .pq-lane .pq-slot2{width:29px;height:20px;}
        .pq2006 .pq-car{width:27px;height:18px;line-height:0;}
        .pq2006 .pq-car.idle{animation:pqBob 2.6s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2006 .pq-car.drive{animation:pqDrive .7s ease-in forwards;animation-delay:var(--dd,0s);}
        .pq2006 .whl.sp{animation:pqWheel .7s linear forwards;animation-delay:var(--dd,0s);}
        .pq2006 .pq-cnt{position:absolute;top:-7px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s both;animation-delay:var(--cd,1.1s);opacity:0;}

        .pq2006 .pq-eq{display:flex;align-items:center;gap:5px;font-size:19px;font-weight:900;color:#3f5d80;font-variant-numeric:tabular-nums;}
        .pq2006 .pq-eq .a{color:#3f6ea5;}
        .pq2006 .pq-eq .mn{color:#a05a2e;}
        .pq2006 .pq-slot{width:38px;height:40px;border-radius:10px;border:2.5px dashed #bcccdf;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#8aa3c4;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq2006 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2006 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2006 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2006 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2006 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}

        .pq2006 .pq-win{display:flex;flex-direction:column;gap:2px;margin-left:2px;flex-basis:100%;align-items:center;justify-content:center;}
        .pq2006 .pq-chip{padding:4px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pqPop .35s ease both;}
        .pq2006 .pq-step{font-size:12px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;white-space:nowrap;padding-left:2px;animation:pqIn .3s .12s both;}
        .pq2006 .pq-sgs{display:flex;align-content:center;gap:6px;margin-left:2px;flex-basis:100%;justify-content:center;}
        .pq2006 .pq-sg{width:40px;height:42px;border-radius:11px;border:2.5px solid #cdd9ea;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2006 .pq-sg:hover:not(:disabled){border-color:#8ab0e0;transform:translateY(-2px);}
        .pq2006 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2006 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2006 .pq-sg:disabled{cursor:default;}

        .pq2006 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2006 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2006 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTl{0%,55%{background:#e2635b;box-shadow:0 0 5px 1px rgba(226,99,91,.7);}56%,100%{background:#3a424c;box-shadow:none;}}
        @keyframes pqTlg{0%,55%{background:#3a424c;box-shadow:none;}56%,100%{background:#57a84f;box-shadow:0 0 5px 1px rgba(87,168,79,.7);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqDrive{0%{opacity:1;transform:translateX(0);}18%{transform:translateX(3px);}100%{opacity:0;transform:translateX(64px) translateY(-2px);}}
        @keyframes pqWheel{from{transform:rotate(0);}to{transform:rotate(340deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <div className="pq-board">{t.title}</div>
          <span className="pq-tl"><span className="box"><span className="lt r" /><span className="lt y" /><span className="lt g" /></span><span className="pole" /></span>
          <span className="pq-garage"><span className="roof" /><span className="wall" /><span className="door" /></span>
          <span className="pq-road" />
          {ok && (<>
            <span className="pq-spark" style={{ left: '12%', top: '16px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '48%', bottom: '20px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '30%', top: '10px' }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            // Chiqib ketish tartibi (2 qadam): avval yo'lakcha birliklari, keyin garajning oxirgi 'fromten' joyi.
            const laneDelay = (k) => k * 0.16;                                  // 1-qadam: birliklar
            const step2Start = r.units * 0.16 + 0.4;                            // pauza
            const garageDelay = (k) => step2Start + (k - (TEN - r.fromten)) * 0.16; // 2-qadam: o'nlikdan
            const cntStart = step2Start + r.fromten * 0.16 + 0.55;              // sanoq animatsiya-kechikishi
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-gz">
                  {/* garaj: 10 joy. G'alabada oxirgi 'fromten' mashina chiqib ketadi. */}
                  <div className="pq-frame">
                    {Array.from({ length: TEN }).map((_, k) => {
                      const gone = k >= TEN - r.fromten;    // g'alabada chiqadigan garaj mashinasi
                      const stays = !gone;                  // qoladigan
                      const c = PAL[(i + k) % PAL.length];
                      return (
                        <div key={k} className={'pq-slot2' + (ok && gone ? ' gone' : '')}>
                          {stays && (
                            <span className={'pq-car' + (!ok && !still ? ' idle' : '')} style={{ '--bd': `${k * 0.11}s` }}>
                              <Car c={c} />
                              {ok && <b className="pq-cnt" style={{ '--cd': `${cntStart + (k) * 0.09}s` }}>{k + 1}</b>}
                            </span>
                          )}
                          {gone && !ok && (
                            <span className={'pq-car' + (!still ? ' idle' : '')} style={{ '--bd': `${k * 0.11}s` }}>
                              <Car c={c} />
                            </span>
                          )}
                          {gone && ok && !still && (
                            <span className="pq-car drive" style={{ '--dd': `${garageDelay(k)}s` }}>
                              <Car c={c} spin />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* yo'lakcha: birliklar (A−10). G'alabada birinchi bo'lib chiqadi. */}
                  <div className={'pq-lane' + (r.units ? '' : ' none')}>
                    {Array.from({ length: r.units }).map((_, k) => {
                      const c = PAL[(i + TEN + k) % PAL.length];
                      return (
                        <div key={k} className={'pq-slot2' + (ok ? ' gone' : '')}>
                          {!ok && (
                            <span className={'pq-car' + (!still ? ' idle' : '')} style={{ '--bd': `${(TEN + k) * 0.11}s` }}>
                              <Car c={c} />
                            </span>
                          )}
                          {ok && !still && (
                            <span className="pq-car drive" style={{ '--dd': `${laneDelay(k)}s` }}>
                              <Car c={c} spin />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pq-eq">
                  <span className="a">{r.a}</span>
                  <span className="mn">{M}</span>
                  <span className="a">{r.b}</span>
                  <span>=</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>

                {ok ? (
                  <div className="pq-win">
                    <span className="pq-chip">{r.a} {M} {r.b} = {r.ans}</span>
                    <span className="pq-step">{r.a} {M} {r.units} {M} {r.fromten} = {TEN} {M} {r.fromten}</span>
                  </div>
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
