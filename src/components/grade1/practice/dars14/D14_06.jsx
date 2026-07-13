// Dars14 · Amaliyot 06 — P13 Zanjir «Olma bozori» · 🔴 · tag: teen_bundle_chain
// 2×2 panjara, 4 karta: har birida MINI 10 UYALI TO'LA OLMA YASHIGI («10» yorliq) va N ta YAKKA olma
// yashikning O'NG tomonida toza ustunda (5+ bo'lsa 2 ustun). "10 + N = ?" — teen soni tanlanadi (11..15).
// Bu darsning yuragi: o'n + birlik = teen. 14 = "1 va 4" EMAS, balki to'la yashik (o'n) va 4 yakka (birlik).
// Bozor sahnasi: taxta «Olma bozori», soyabon, deraza + quyosh (uzluksiz ambient).
// G'alaba: yakka olmalarda 11..ans sanoq-badge (o'ndan davom sanash) + yashil "10 + N = ans" chip.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10;
const ROWS = [
  { ones: 1, ans: 11, opts: [9, 10, 11, 12] },
  { ones: 3, ans: 13, opts: [11, 12, 13, 14] },
  { ones: 5, ans: 15, opts: [12, 13, 14, 15] },
  { ones: 2, ans: 12, opts: [10, 11, 12, 13] },
];
const DATA = { ptype: 'P13', level: '🔴', tag: 'teen_bundle_chain' };

const T = {
  uz: {
    eyebrow: "Olma bozori · Zanjir", title: "Yashik va yakka",
    setup: "Har kartada to'la yashik (o'nta olma) va bir nechta yakka olma bor.",
    ask: "Har kartada jami nechta olmaligini tanlang.",
    correct: "Barakalla! O'n va yakkalar — barcha teen sonlar to'g'ri yig'ildi!",
    hint: "Qizil kartalarga qarang: o'nlikdan boshlab har bir yakka olmani birma-bir sanang.",
    board: "Olma bozori",
  },
  ru: {
    eyebrow: "Яблочный базар · Цепочка", title: "Ящик и штучные",
    setup: "На каждой карточке полный ящик (десять яблок) и несколько отдельных яблок.",
    ask: "Выберите, сколько всего яблок на каждой карточке.",
    correct: "Молодец! Десяток и штучные — все числа второго десятка собраны верно!",
    hint: "Посмотрите на красные карточки: начните с десятка и посчитайте каждое отдельное яблоко по одному.",
    board: "Яблочный базар",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (birlik): qizil olma — bandi + yashil barg + blik. Bitta olma = bitta birlik.
const Apple = ({ w = 14 }) => (
  <svg viewBox="0 0 26 26" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M13 5.5 Q13 2 15.5 1" fill="none" stroke="#7a4b1e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 4.6 Q18.5 1.6 20 5 Q16.5 6.4 14 4.6 Z" fill="#57a84f" />
    <path d="M13 6 C7 3.6 2.5 8 3.2 14 C3.8 19.8 8 24 13 24 C18 24 22.2 19.8 22.8 14 C23.5 8 19 3.6 13 6 Z" fill="#d9463c" stroke="#a92f27" strokeWidth="1.1" />
    <ellipse cx="8.6" cy="11" rx="2.6" ry="3.6" fill="#fff" opacity=".3" />
  </svg>
);

// MINI TO'LA YASHIK (o'nlik): 10 uyali (2×5), hammasi band, «10» yorlig'i.
const MiniBox = () => (
  <span className="pq-mbox">
    <span className="pq-mtag">10</span>
    <span className="pq-mgrid">
      {Array.from({ length: TEN }).map((_, k) => (
        <span key={k} className="pq-mcell"><Apple w={12} /></span>
      ))}
    </span>
  </span>
);

export default function D14_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${TEN} + ${r.ones} = ?`), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1406">
      <style>{`
        .pq1406{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1406 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0501e;text-transform:uppercase;}
        .pq1406 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1406 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1406 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1406 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#fbe9cf,#f4dcb4);border:2px solid #e9d3a6;}
        /* BOZOR SAHNASI (tepa lentasi) */
        .pq1406 .pq-scene{position:relative;width:372px;max-width:100%;height:96px;border-radius:18px;background:linear-gradient(#c9e9fb 0%,#e2f3fd 62%,#f4e6c8 100%);border:2px solid #d8c99c;overflow:hidden;}
        .pq1406 .pq-sun{position:absolute;top:12px;left:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1406 .pq-cloud{position:absolute;height:12px;background:#fff;border-radius:20px;opacity:.94;z-index:1;}
        .pq1406 .pq-cloud::before{content:'';position:absolute;background:#fff;border-radius:50%;width:16px;height:16px;top:-7px;left:7px;}
        .pq1406 .pq-cloud.c1{top:14px;right:74px;width:34px;animation:pqDrift 15s ease-in-out infinite;}
        /* soyabon (bozor peshtoqi) */
        .pq1406 .pq-awning{position:absolute;left:0;right:0;bottom:0;height:34px;background:repeating-linear-gradient(90deg,#e2635b 0 26px,#fdf3e2 26px 52px);border-top:3px solid #b6473f;z-index:2;}
        .pq1406 .pq-awning::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:10px;background:radial-gradient(circle at 13px -2px,transparent 11px,#e2635b 12px) repeat-x;background-size:52px 12px;opacity:.9;}
        .pq1406 .pq-board{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:5;padding:6px 15px 7px;border-radius:10px;background:linear-gradient(#c98a4e,#a86c34);border:2.5px solid #7f5326;color:#fdf3e2;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1406 .pq-board::before,.pq1406 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#7f5326;}
        .pq1406 .pq-board::before{left:18px;} .pq1406 .pq-board::after{right:18px;}
        .pq1406 .pq-dapple{position:absolute;right:24px;top:14px;z-index:1;animation:pqBobA 3.4s ease-in-out infinite;}

        /* SAVOL-KARTALAR — 2×2 panjara */
        .pq1406 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;width:100%;}
        .pq1406 .pq-rw{display:flex;gap:7px;align-items:center;align-content:center;justify-content:center;flex-wrap:wrap;padding:7px 8px;border-radius:14px;border:2.5px solid #ecdcbf;background:#fffaf0;transition:.15s;}
        .pq1406 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1406 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1406 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}

        /* MINI TO'LA YASHIK (o'nlik) */
        .pq1406 .pq-mbox{position:relative;display:inline-block;padding:4px 5px 5px;border-radius:8px;background:linear-gradient(#d9a561,#c08a45);border:2px solid #96662b;box-shadow:0 2px 0 #7d5423,0 3px 5px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.25);filter:drop-shadow(0 1px 1px rgba(0,0,0,.08));}
        .pq1406 .pq-mgrid{display:grid;grid-template-columns:repeat(5,auto);gap:2px;}
        .pq1406 .pq-mcell{width:14px;height:14px;border-radius:4px;background:rgba(70,40,10,.22);box-shadow:inset 0 1px 2px rgba(0,0,0,.26);display:flex;align-items:center;justify-content:center;}
        .pq1406 .pq-mtag{position:absolute;top:-10px;left:50%;transform:translateX(-50%);z-index:4;padding:0 7px;border-radius:8px;background:#2f6f3a;color:#fff;font-size:11px;font-weight:900;line-height:15px;box-shadow:0 2px 3px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;}

        /* YAKKA olmalar (birlik) — toza ustun, 5+ bo'lsa 2 ustun */
        .pq1406 .pq-singles{display:grid;grid-auto-flow:column;gap:2px 3px;align-items:end;padding:0 2px;}
        .pq1406 .pq-single{position:relative;width:16px;height:16px;flex:0 0 auto;}
        /* sanoq-badge yakka olmaning O'NG yonida (ustun tartibida ustma-ust tushmasin) */
        .pq1406 .pq-cnt{position:absolute;top:50%;left:100%;transform:translate(2px,-50%);min-width:15px;height:15px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPopR .3s ease both;z-index:5;font-variant-numeric:tabular-nums;}

        .pq1406 .pq-op{font-size:20px;font-weight:900;color:#c0501e;}
        .pq1406 .pq-eq{font-size:20px;font-weight:900;color:#8a7a55;}
        .pq1406 .pq-slot{width:40px;height:42px;border-radius:10px;border:2.5px dashed #d8c59c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#c2a25e;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1406 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq1406 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1406 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1406 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1406 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1406 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq1406 .pq-chip{flex-basis:100%;text-align:center;margin-left:2px;padding:5px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pqPop2 .35s ease both;}
        .pq1406 .pq-sgs{display:flex;align-content:center;flex-basis:100%;justify-content:center;gap:5px;margin-left:2px;}
        .pq1406 .pq-sg{width:38px;height:42px;border-radius:10px;border:2.5px solid #e0d3b6;background:#fff;font-size:19px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1406 .pq-sg:hover:not(:disabled){border-color:#e0a94e;transform:translateY(-2px);}
        .pq1406 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1406 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1406 .pq-sg:disabled{cursor:default;}

        .pq1406 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1406 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1406 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pqBobA{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#d8c59c;}50%{transform:scale(1.06);border-color:#c9ad7e;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop2{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-cloud c1" />
          <span className="pq-dapple"><Apple w={16} /></span>
          <div className="pq-board">{t.board}</div>
          <span className="pq-awning" />
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const cols = r.ones >= 5 ? 2 : 1; // 5+ yakka → 2 ustun
            const perCol = Math.ceil(r.ones / cols);
            return (
              <div key={i} className={'pq-rw' + cls}>
                {/* MINI TO'LA YASHIK (o'nlik) — 10 olma, «10» yorlig'i */}
                <MiniBox />
                <b className="pq-op">+</b>
                {/* N ta YAKKA olma — toza ustun (o'ng tomonda); g'alabada 11..ans badge */}
                <div className="pq-singles" style={{ gridTemplateRows: `repeat(${perCol}, auto)` }}>
                  {Array.from({ length: r.ones }).map((_, k) => (
                    <span key={k} className="pq-single">
                      <Apple w={16} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${k * 0.08}s` }}>{TEN + k + 1}</b>}
                    </span>
                  ))}
                </div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                {ok ? (
                  <span className="pq-chip">{TEN} + {r.ones} = {r.ans}</span>
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
