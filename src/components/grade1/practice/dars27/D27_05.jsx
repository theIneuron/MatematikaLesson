// Dars27 · Amaliyot 05 — Zanjir «Olma bog'i» · ayirish razryad bo'yicha · 🔴 · tag: ts_chain
// To'rt AYIRISH misoli: har katakda ifoda + '=' + uzuk-uyacha, ostida 4 tanlov (butun enni to'ldiradi).
// Razryad bo'yicha ayirish: o'nlikdan o'nlik, birlikdan birlik (68-25: 6-2=4, 8-5=3 -> 43).
// SODDALASHTIRILDI (metodist talabi 2026-07-15): savat/olma/kapalak "frame" sahnasi olib tashlandi
// (o'quvchini chalg'itardi). O'rniga kichik STATIK banner; tanlov tugmalari kartochka enini to'ldiradi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // ayirish belgisi (U+2212, ASCII defis EMAS)

// To'g'ri javob o'rni HAR QATORDA farqli: idx 1, 2, 3, 0
const ROWS = [
  { a: 47, b: 13, ans: 34, opts: [60, 34, 44, 33] },
  { a: 68, b: 25, ans: 43, opts: [93, 48, 43, 42] },
  { a: 59, b: 36, ans: 23, opts: [95, 29, 24, 23] },
  { a: 64, b: 31, ans: 33, opts: [33, 95, 34, 32] },
];
const DATA = { ptype: 'P_chain', level: '🔴', tag: 'ts_chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir", title: "Misollar zanjiri",
    setup: "Har misolni yeching.",
    ask: "To'g'ri javobni tanlang.",
    correct: "Barakalla! Har misolni to'g'ri yechdingiz.",
    hint: "O'nlikdan o'nlik, birlikdan birlik ayiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка", title: "Цепочка примеров",
    setup: "Реши каждый пример.",
    ask: "Выбери верный ответ.",
    correct: "Молодец! Ты верно решил каждый пример.",
    hint: "Десятки из десятков, единицы из единиц.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D27_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a} ${M} ${r.b} = ${r.opts.join('/')}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2705">
      <style>{`
        .pq2705{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2705 *,.pq2705 *::before,.pq2705 *::after{box-sizing:border-box;}
        .pq2705 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2705 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2705 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2705 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2705 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:22px;background:linear-gradient(#eef7e6,#e2f0d6);border:2px solid #cfe3bd;}
        .pq2705 .pq-band{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:46px;border-radius:14px;background:linear-gradient(90deg,#e8f4ff,#eaf7dd);border:2px solid #cfe3bd;overflow:hidden;}
        .pq2705 .pq-band-title{font-size:14px;font-weight:800;letter-spacing:.02em;color:#3a7f42;}
        .pq2705 .pq-band-sun{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 10px 2px rgba(249,198,47,.4);}
        .pq2705 .pq-band-cloud{position:absolute;left:16px;top:12px;width:30px;height:9px;background:#fff;border-radius:999px;opacity:.75;box-shadow:10px 4px 0 -3px #fff;}
        .pq2705 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;}
        @media (min-width:480px){.pq2705 .pq-rows{grid-template-columns:1fr 1fr;max-width:560px;}}
        .pq2705 .pq-rw{display:flex;flex-wrap:wrap;gap:7px;align-items:center;align-content:center;justify-content:center;padding:10px 12px;border-radius:14px;border:2.5px solid #d7e5cd;background:#fff;transition:.15s;}
        .pq2705 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2705 .pq-rw.good.win{animation:pq2705cele .5s ease;}
        .pq2705 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2705shake .35s ease;}
        .pq2705 .pq-ex{min-width:96px;height:44px;border-radius:10px;background:#f5f7f2;border:2px solid #dde3d5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq2705 .pq-op{color:#c0392b;margin:0 5px;font-weight:900;}
        .pq2705 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq2705 .pq-slot{width:46px;height:44px;border-radius:10px;border:2.5px dashed #c8cfba;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2705breath 2.4s ease-in-out infinite;}
        .pq2705 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2705 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2705 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2705 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2705 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2705 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2705 .pq-sgs{display:flex;flex-wrap:nowrap;align-content:center;flex-basis:100%;gap:8px;margin-top:3px;justify-content:stretch;}
        .pq2705 .pq-sg{flex:1 1 0;min-width:0;height:50px;padding:0 2px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:19px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2705 .pq-sg:hover:not(:disabled){border-color:#8fc283;transform:translateY(-2px);}
        .pq2705 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2705 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2705 .pq-rw.good .pq-sg.sel{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;}
        .pq2705 .pq-sg:disabled{cursor:default;}
        .pq2705 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2705in .22s ease both;}
        .pq2705 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2705 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2705shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2705cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2705breath{0%,100%{transform:scale(1);border-color:#c8cfba;}50%{transform:scale(1.06);border-color:#aebf9c;}}
        @keyframes pq2705in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-band">
          <span className="pq-band-cloud" />
          <span className="pq-band-title">{t.title}</span>
          <span className="pq-band-sun" />
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">{r.a}<b className="pq-op">{M}</b>{r.b}</div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
