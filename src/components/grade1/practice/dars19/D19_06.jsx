// Dars19 · Amaliyot 06 — P13 Zanjir «Shar do'koni» · 🔴 · tag: cross_sub_chain
// 2×2 SAVOL-KARTA panjarasi, har kartada FAQAT sonli ifoda (toza, grafiksiz — metodist talabi)
// A − B = ? (A teen, natija bir xonali) + 4 sonli variant. Shar-dekor faqat yuqori sahna-lentada.
// Noto'g'ri karta: qizil + shake, hint javob sonini AYTMAYDI. Minus = U+2212 «−».
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT hammasi to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 matematik minus
const ROWS = [
  { a: 13, b: 4, ans: 9, opts: [7, 8, 9, 10] },
  { a: 12, b: 6, ans: 6, opts: [4, 5, 6, 7] },
  { a: 15, b: 8, ans: 7, opts: [5, 6, 7, 8] },
  { a: 14, b: 9, ans: 5, opts: [3, 4, 5, 6] },
];
const DATA = { ptype: 'P13', level: '🔴', tag: 'cross_sub_chain' };

// SHAR palitrasi (aylanma, 2-ton): qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { main: '#d9534b', dark: '#b23b34', light: '#ef8a83' },
  { main: '#4a90d9', dark: '#356fb0', light: '#84b4e8' },
  { main: '#f2b134', dark: '#cd8f16', light: '#f9ce74' },
  { main: '#57a84f', dark: '#3f8038', light: '#89c882' },
  { main: '#e879a6', dark: '#c85686', light: '#f4a9c7' },
];

const T = {
  uz: {
    eyebrow: "Shar do'koni · Zanjir", title: "Zanjir",
    setup: "Mana 4 ta misol.",
    ask: "Har misol uchun javobni tanlang.",
    correct: "Barakalla! Hamma javob to'g'ri!",
    hint: "Qizil kartalarga qarang. Avval 10 gacha ayiring, keyin qolganini 10 dan ayiring.",
    board: "Shar do'koni",
  },
  ru: {
    eyebrow: 'Магазин шаров · Цепочка', title: 'Цепочка',
    setup: 'Вот 4 примера.',
    ask: 'Выбери ответ для каждого примера.',
    correct: 'Молодец! Все ответы верные!',
    hint: 'Посмотри на красные карточки. Сначала вычти до 10, потом остаток из 10.',
    board: 'Магазин шаров',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHAR KANONI (yakka birlik): rangli oval + oq blik + pastda tugun-uchburchak + ip-chizik.
// Bitta shar = bitta birlik. Rang palitradan.
const Balloon = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 24 36" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 23 Q12 30 15 35" fill="none" stroke="#9aa3ad" strokeWidth="1" strokeLinecap="round" />
    <polygon points="12,22 9.4,26 14.6,26" fill={c.dark} />
    <ellipse cx="12" cy="12" rx="9" ry="11" fill={c.dark} />
    <ellipse cx="12" cy="12" rx="7.7" ry="9.7" fill={c.main} />
    <ellipse cx="9" cy="8.4" rx="3" ry="4" fill={c.light} opacity=".6" />
    <ellipse cx="8.4" cy="7.4" rx="1.7" ry="2.4" fill="#ffffff" opacity=".78" />
  </svg>
);

export default function D19_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda animatsiyalar qayta ijro etilmaydi — statik yakun (stillRef naqshi).
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current; // eslint-disable-line no-unused-vars — kartalar endi grafiksiz

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint });
    if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: ROWS.map((r) => `${r.a} ${M} ${r.b} = ?`),
      studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) },
      correctAnswer: { vals: ROWS.map((r) => r.ans) },
      correct, meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1906">
      <style>{`
        .pq1906{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1906 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0537a;text-transform:uppercase;}
        .pq1906 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1906 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1906 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1906 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:10px 8px 13px;border-radius:22px;background:linear-gradient(#eaf1fb,#e2ebf7);border:2px solid #cdddf0;}
        .pq1906 .pq-scene{position:relative;width:372px;max-width:100%;height:74px;border-radius:18px;background:linear-gradient(#eef5fd 0%,#dfeaf7 60%,#d0def0 100%);border:2px solid #cbdaee;overflow:hidden;}
        .pq1906 .pq-beam{position:absolute;top:-20px;right:52px;width:70px;height:130px;background:linear-gradient(180deg,rgba(255,241,196,.7),rgba(255,241,196,0));transform:rotate(16deg);transform-origin:top center;z-index:1;animation:pqBeam 4.5s ease-in-out infinite;pointer-events:none;}
        .pq1906 .pq-window{position:absolute;top:10px;right:14px;width:52px;height:38px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #9db4c6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1906 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#9db4c6;transform:translateX(-1px);}
        .pq1906 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#9db4c6;transform:translateY(-1px);}
        .pq1906 .pq-sun{position:absolute;top:16px;right:22px;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 12px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1906 .pq-board{position:absolute;top:11px;left:50%;transform:translateX(-50%);z-index:5;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#4a90d9,#356fb0);border:2.5px solid #2a578c;color:#f0f6fd;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.3);}
        .pq1906 .pq-board::before,.pq1906 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:7px;background:#2a578c;}
        .pq1906 .pq-board::before{left:18px;} .pq1906 .pq-board::after{right:18px;}
        .pq1906 .pq-deco{position:absolute;bottom:6px;width:12px;height:15px;z-index:2;animation:pqSway 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1906 .pq-deco.d1{left:16px;} .pq1906 .pq-deco.d2{left:34px;bottom:4px;animation-delay:-1.1s;}

        /* qatorlar */
        .pq1906 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;width:100%;}
        .pq1906 .pq-rw{display:flex;gap:8px;align-items:center;align-content:center;justify-content:center;flex-wrap:wrap;padding:7px 8px;border-radius:14px;border:2.5px solid #cfdcee;background:#fbfdff;transition:.15s;}
        .pq1906 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1906 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1906 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}

        /* karta ichi: FAQAT toza sonli ifoda (grafiksiz — metodist talabi) */
        .pq1906 .pq-eq{display:flex;align-items:center;justify-content:center;gap:7px;font-size:24px;font-weight:900;color:#41597a;font-variant-numeric:tabular-nums;flex-basis:100%;padding:2px 0 1px;}
        .pq1906 .pq-eq .a{color:#2a578c;}
        .pq1906 .pq-eq .b{color:#c0537a;}
        .pq1906 .pq-slot{width:38px;height:40px;border-radius:10px;border:2.5px dashed #b9cbe4;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#8ba6cd;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1906 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1906 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1906 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1906 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1906 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}

        .pq1906 .pq-chip{flex-basis:100%;text-align:center;margin-left:2px;padding:5px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pqPop .35s ease both;}
        .pq1906 .pq-sgs{display:flex;gap:6px;margin-left:2px;flex-basis:100%;justify-content:center;align-content:center;}
        .pq1906 .pq-sg{width:40px;height:42px;border-radius:11px;border:2.5px solid #cdddf0;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1906 .pq-sg:hover:not(:disabled){border-color:#8ab0e0;transform:translateY(-2px);}
        .pq1906 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1906 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1906 .pq-sg:disabled{cursor:default;}

        .pq1906 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:14px;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1906 .pq-spark.s2{animation-delay:-.6s;} .pq1906 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1906 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1906 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1906 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBeam{0%,100%{opacity:.55;}50%{opacity:.85;}}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-3deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
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
          <span className="pq-window" />
          <span className="pq-sun" />
          <div className="pq-board">{t.board}</div>
          <span className="pq-deco d1"><Balloon c={PAL[0]} /></span>
          <span className="pq-deco d2"><Balloon c={PAL[3]} /></span>
          {ok && (<>
            <span className="pq-spark" style={{ left: '12%', top: '16px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '46%', bottom: '8px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '30%', top: '10px' }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-eq">
                  <span className="a">{r.a}</span>
                  <span>{M}</span>
                  <span className="b">{r.b}</span>
                  <span>=</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>

                {ok ? (
                  <span className="pq-chip">{r.a} {M} {r.b} = {r.ans}</span>
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
