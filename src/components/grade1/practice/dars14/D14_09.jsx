// Dars14 · Amaliyot 09 — O'RIN QIYMATI «O'nlik va birlik» · 🔴 · tag: place_value
// Sinf partasi sahnasi. 14 modeli: 10 UYALI TO'LA QALAM QUTISI (2×5, har uyada 1 qalam) + 4 YAKKA qalam
// qutining O'NG tomonida. Ikkita slot: [O'nlik: ?] va [Birlik: ?]. To'g'ri: tens=1 (to'la quti), ones=4 (yakka).
// Misconception qalqoni: 14 ≠ «1 va 4» — o'nlik = 1 TO'LA QUTI (o'nta), birlik = 4 yakka. Slot to'lganda
// mos guruh yonadi (o'nlik → quti yonadi, birlik → yakkalar yonadi). G'alaba: 14 = 10 + 4.
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

const DATA = { num: 14, tens: 1, ones: 4, tensOptions: [1, 2, 4], onesOptions: [1, 4, 5], tag: 'place_value', level: '🔴' };
const TEN = 10; // to'la qutidagi qalamlar soni

// Qalam ranglari (palitradan, 2-ton): sariq / qizil / ko'k / yashil.
const PAL = [
  { c: '#f2b134', d: '#cf9420' }, // sariq
  { c: '#d9534b', d: '#b23e37' }, // qizil
  { c: '#4f8fc4', d: '#3a72a3' }, // ko'k
  { c: '#57a84f', d: '#43893c' }, // yashil
];

const T = {
  uz: {
    eyebrow: "Sinf partasi · O'rin qiymati", title: "O'nlik va birlik",
    setup: "Partada o'n to'rtta qalam: to'la quti va bir nechta yakka qalam.",
    ask: "14 nechta O'NLIK va nechta BIRLIKdan iborat? Ikkala slotni to'ldiring.",
    correct: "Barakalla! 14 — bitta o'nlik va to'rtta birlik. To'la qutida o'nta qalam, yakkalar to'rtta!",
    hint: "O'nlik — nechta TO'LA QUTI borligini sanang. Birlik — nechta YAKKA qalam borligini sanang.",
    sTens: "O'nlik", sOnes: "Birlik",
    lblBox: "to'la quti",
    res: "14 = 1 o'nlik + 4 birlik = 10 + 4",
  },
  ru: {
    eyebrow: "Школьная парта · Разряды", title: "Десятки и единицы",
    setup: "На парте четырнадцать карандашей: полная коробка и несколько отдельных.",
    ask: "Из скольких ДЕСЯТКОВ и скольких ЕДИНИЦ состоит 14? Заполните оба слота.",
    correct: "Молодец! 14 — это один десяток и четыре единицы. В полной коробке десять карандашей, отдельных — четыре!",
    hint: "Десятки — посчитайте, сколько ПОЛНЫХ коробок. Единицы — посчитайте, сколько ОТДЕЛЬНЫХ карандашей.",
    sTens: "Десятки", sOnes: "Единицы",
    lblBox: "полная коробка",
    res: "14 = 1 десяток + 4 единицы = 10 + 4",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — pushti o'chirg'ich + metall halqa (tepa),
// rangli tana (2-ton + blik), yog'och konus + qora grafit uch (past). Bitta qalam = bitta birlik.
const Pencil = ({ c = '#f2b134', d = '#cf9420', w = 13 }) => (
  <svg viewBox="0 0 20 64" width={w} height={(w * 64) / 20} aria-hidden="true" style={{ display: 'block' }}>
    <rect x="5" y="1.5" width="10" height="7" rx="3" fill="#f2a6ba" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <rect x="6.4" y="2.4" width="1.8" height="5" rx="1" fill="#fff" opacity=".4" />
    <rect x="5" y="7.6" width="10" height="6" fill="#cfd4dc" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <line x1="5" y1="9.6" x2="15" y2="9.6" stroke="#a9b0bb" strokeWidth="1" />
    <line x1="5" y1="11.6" x2="15" y2="11.6" stroke="#a9b0bb" strokeWidth="1" />
    <rect x="5" y="13" width="10" height="37" fill={c} stroke="rgba(0,0,0,.14)" strokeWidth=".8" />
    <rect x="5" y="13" width="3.4" height="37" fill={d} />
    <rect x="11.3" y="13" width="1.8" height="37" fill="#fff" opacity=".35" />
    <polygon points="5,50 15,50 10,61" fill="#e8c99a" stroke="rgba(0,0,0,.14)" strokeWidth=".8" strokeLinejoin="round" />
    <polygon points="5,50 10,50 10,61" fill="#d6ba85" />
    <polygon points="8.4,56.6 11.6,56.6 10,61" fill="#2c2c2c" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [tens, setTens] = useState(null);
  const [ones, setOnes] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda yonish/uchqun qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.tens != null) setTens(sa.tens);
      if (sa.ones != null) setOnes(sa.ones);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(tens !== null && ones !== null && !checked); }, [tens, ones, checked, onReady]);

  const lock = isReview || checked;

  const check = useCallback(() => {
    if (tens === null || ones === null) return;
    const correct = tens === DATA.tens && ones === DATA.ones;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: [...DATA.tensOptions.map((n) => `${t.sTens}:${n}`), ...DATA.onesOptions.map((n) => `${t.sOnes}:${n}`)],
      studentAnswer: { tens, ones }, correctAnswer: { tens: DATA.tens, ones: DATA.ones },
      correct, meta: { ...DATA },
    });
  }, [tens, ones, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const tensLit = tens !== null; // o'nlik slot to'ldi → to'la quti yonadi
  const onesLit = ones !== null; // birlik slot to'ldi → yakkalar yonadi
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq1409">
      <style>{`
        .pq1409{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1409 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1409 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1409 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1409 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1409 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;}
        /* SINF PARTASI SAHNASI */
        .pq1409 .pq-shop{box-sizing:border-box;position:relative;width:380px;height:236px;border-radius:20px;background:linear-gradient(#f7f1e2 0%,#f0e6cd 58%,#e6d6b3 100%);border:2px solid #dcc9a0;overflow:hidden;}
        .pq1409 .pq-fit{position:relative;margin:0 auto;}
        .pq1409 .pq-win{position:absolute;top:0;left:0;width:140px;height:150px;background:linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,0) 62%);pointer-events:none;animation:pqShine 5s ease-in-out infinite;z-index:1;}
        .pq1409 .pq-sun{position:absolute;top:12px;right:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        /* sinf doskasi (dekor, raqamsiz) */
        .pq1409 .pq-boardd{position:absolute;left:24px;top:14px;width:96px;height:52px;border-radius:7px;background:linear-gradient(#3f7a5c,#2f6248);border:4px solid #a9743f;box-shadow:0 3px 6px rgba(0,0,0,.16);z-index:1;}
        .pq1409 .pq-boardd::before{content:'';position:absolute;left:10px;top:12px;width:44px;height:3px;border-radius:2px;background:rgba(255,255,255,.55);}
        .pq1409 .pq-boardd::after{content:'';position:absolute;left:10px;top:22px;width:60px;height:3px;border-radius:2px;background:rgba(255,255,255,.35);}
        .pq1409 .pq-chalk{position:absolute;left:34px;top:70px;width:18px;height:5px;border-radius:3px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);z-index:1;}
        /* soat (dekor) */
        .pq1409 .pq-clock{position:absolute;right:60px;top:18px;width:26px;height:26px;border-radius:50%;background:#fff;border:2.5px solid #b98f52;z-index:1;box-shadow:0 2px 4px rgba(0,0,0,.12);}
        .pq1409 .pq-clock::before{content:'';position:absolute;left:50%;top:50%;width:2px;height:8px;background:#5a4a2c;transform-origin:bottom center;transform:translate(-1px,-8px) rotate(40deg);animation:pqTick 6s linear infinite;}
        .pq1409 .pq-clock::after{content:'';position:absolute;left:50%;top:50%;width:2px;height:6px;background:#8a7a55;transform:translate(-1px,-6px) rotate(-70deg);}
        /* parta */
        .pq1409 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a9743f 60%,#8f5f30);border-top:3px solid #dcae74;z-index:2;}
        .pq1409 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:8px;height:2px;background:rgba(255,255,255,.14);}

        /* 14 modeli: [to'la quti]  +  [4 yakka] — ikki alohida guruh */
        .pq1409 .pq-model{position:absolute;left:0;right:0;top:78px;display:flex;justify-content:center;align-items:flex-end;gap:12px;z-index:4;}
        .pq1409 .pq-grp{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:9px 10px 8px;border-radius:16px;border:2.5px solid transparent;background:rgba(255,255,255,0);transition:background .2s,border-color .2s,box-shadow .2s;}
        .pq1409 .pq-grp.lit{background:rgba(37,99,235,.10);border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.14);}
        .pq1409 .pq-grp.litok{background:rgba(26,127,67,.12);border-color:#1a7f43;box-shadow:0 0 0 4px rgba(26,127,67,.16);}
        .pq1409 .pq-glabel{font-size:12.5px;font-weight:800;color:#8a5a1e;letter-spacing:.02em;}
        .pq1409 .pq-grp.lit .pq-glabel{color:#2563eb;} .pq1409 .pq-grp.litok .pq-glabel{color:#1a7f43;}

        /* TO'LA QUTI: 10 uya (2×5), har uyada tik qalam */
        .pq1409 .pq-boxx{position:relative;padding:6px 7px 8px;border-radius:10px;background:linear-gradient(#d9a561,#c08a45);border:2.5px solid #96662b;box-shadow:0 3px 0 #7d5423,0 5px 8px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.25);animation:pqSway 3.8s ease-in-out infinite;}
        .pq1409 .pq-shop.still .pq-boxx{animation:none;}
        .pq1409 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:3px;}
        .pq1409 .pq-cell{width:20px;height:44px;border-radius:5px;background:rgba(70,40,10,.22);box-shadow:inset 0 2px 3px rgba(0,0,0,.26);display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;}
        .pq1409 .pq-dcap{position:absolute;top:-19px;left:50%;transform:translateX(-50%);padding:2px 10px;border-radius:9px;background:#c93b32;color:#fff;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,.2);z-index:4;}

        .pq1409 .pq-singles{display:flex;align-items:flex-end;gap:5px;}
        .pq1409 .pq-single{position:relative;animation:pqBob 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1409 .pq-shop.still .pq-single{animation:none;}
        .pq1409 .pq-single:nth-child(2){animation-delay:-.7s;} .pq1409 .pq-single:nth-child(3){animation-delay:-1.4s;} .pq1409 .pq-single:nth-child(4){animation-delay:-2.1s;}

        .pq1409 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.2);animation:pqPop .3s ease both;font-variant-numeric:tabular-nums;}
        .pq1409 .pq-shop.still .pq-cnt{animation:none;}
        .pq1409 .pq-bcnt{top:-11px;min-width:22px;height:18px;font-size:12px;background:#1a7f43;}

        .pq1409 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1409 .pq-wstar.w2{animation-delay:-.5s;} .pq1409 .pq-wstar.w3{animation-delay:-1.05s;}

        .pq1409 .pq-res{min-height:2px;}
        .pq1409 .pq-chip{display:inline-flex;align-items:center;padding:7px 18px;border-radius:999px;background:#e8f7ee;color:#1a7f43;font-size:16px;font-weight:900;animation:pqPop2 .4s cubic-bezier(.3,1.5,.5,1) both;}

        /* ikkita slot — har biriga son tanlanadi */
        .pq1409 .pq-slots{display:flex;flex-direction:column;gap:12px;width:100%;max-width:420px;margin-top:6px;}
        .pq1409 .pq-slot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;}
        .pq1409 .pq-sname{min-width:64px;font-size:15px;font-weight:800;color:#5c6672;text-align:right;}
        .pq1409 .pq-sval{width:46px;height:46px;border-radius:12px;background:#fff;border:3px solid #e3c996;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#c77d2e;font-variant-numeric:tabular-nums;box-shadow:0 3px 6px rgba(0,0,0,.12);transition:.15s;}
        .pq1409 .pq-sval.on{border-color:#2563eb;color:#2563eb;background:#eef3fd;}
        .pq1409 .pq-sval.win{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;animation:pqPop2 .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1409 .pq-opts{display:flex;flex-wrap:wrap;gap:9px;}
        .pq1409 .pq-opt{width:52px;height:52px;font-size:24px;font-weight:800;border-radius:14px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;font-family:inherit;}
        .pq1409 .pq-opt:hover:not(:disabled){border-color:#e3b877;transform:translateY(-2px);}
        .pq1409 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1409 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1409 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1409 .pq-opt:disabled{cursor:default;}

        .pq1409 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1409 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1409 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(-.6deg);}50%{transform:translateY(-2px) rotate(.6deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-2px) rotate(1deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqShine{0%,100%{opacity:.5;}50%{opacity:.85;}}
        @keyframes pqTick{from{transform:translate(-1px,-8px) rotate(40deg);}to{transform:translate(-1px,-8px) rotate(400deg);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop2{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 380 * scale, height: 236 * scale }}>
        <div className={'pq-shop' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-win" />
          <span className="pq-sun" />
          <span className="pq-boardd" /><span className="pq-chalk" />
          <span className="pq-clock" />
          <span className="pq-counter" />

          <div className="pq-model">
            {/* O'NLIK guruhi — bitta TO'LA QUTI (10 qalam, 10 uya) */}
            <div className={'pq-grp pq-gtens' + (ok ? ' litok' : tensLit ? ' lit' : '')}>
              <div className="pq-boxx">
                <span className="pq-dcap">{t.lblBox}</span>
                <div className="pq-grid">
                  {Array.from({ length: TEN }).map((_, i) => {
                    const p = PAL[i % PAL.length];
                    return <span key={i} className="pq-cell"><Pencil c={p.c} d={p.d} w={12} /></span>;
                  })}
                </div>
                {ok && <b className="pq-cnt pq-bcnt">{TEN}</b>}
              </div>
              <span className="pq-glabel">{t.sTens}</span>
            </div>

            {/* BIRLIK guruhi — 4 yakka qalam (qutining O'NG tomonida) */}
            <div className={'pq-grp pq-gones' + (ok ? ' litok' : onesLit ? ' lit' : '')}>
              <div className="pq-singles">
                {Array.from({ length: DATA.ones }).map((_, i) => {
                  const p = PAL[i % PAL.length];
                  return (
                    <span key={i} className="pq-single">
                      <Pencil c={p.c} d={p.d} w={14} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.07}s` }}>{i + 1}</b>}
                    </span>
                  );
                })}
              </div>
              <span className="pq-glabel">{t.sOnes}</span>
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '26%', top: '40px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '70%', top: '46px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '50%', top: '30px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
        </div>

        <div className="pq-res">{ok && <span className="pq-chip">{t.res}</span>}</div>

        <div className="pq-slots">
          {/* O'nlik slot */}
          <div className="pq-slot">
            <span className="pq-sname">{t.sTens}</span>
            <span className={'pq-sval' + (ok ? ' win' : tensLit ? ' on' : '')}>{tens !== null ? tens : '?'}</span>
            <div className="pq-opts">
              {DATA.tensOptions.map((n) => {
                const sel = tens === n; const right = ok && n === DATA.tens;
                return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setTens(n); setFeedback(null); }}>{n}</button>;
              })}
            </div>
          </div>
          {/* Birlik slot */}
          <div className="pq-slot">
            <span className="pq-sname">{t.sOnes}</span>
            <span className={'pq-sval' + (ok ? ' win' : onesLit ? ' on' : '')}>{ones !== null ? ones : '?'}</span>
            <div className="pq-opts">
              {DATA.onesOptions.map((n) => {
                const sel = ones === n; const right = ok && n === DATA.ones;
                return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setOnes(n); setFeedback(null); }}>{n}</button>;
              })}
            </div>
          </div>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
