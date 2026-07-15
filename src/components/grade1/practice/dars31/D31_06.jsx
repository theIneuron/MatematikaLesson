// Dars31 · Amaliyot 06 — 🔴 CHAIN ikki qadamli (a op1 b op2 c = ?) · tag: chain
// 4 misol, har biri IKKI qadam: step1 = a op1 b → m, step2 = m op2 c → natija.
// SODDALASHTIRILDI (metodist talabi 2026-07-15): tabiat/quyoncha "frame" sahnasi olib tashlandi
// (o'quvchini chalg'itardi). O'rniga kichik STATIK banner; tanlov tugmalari kartochka enini to'ldiradi.
// To'g'ri indeks har qatorda o'zgaradi (1,2,3,0). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { a: 5, o1: '+', b: 2, o2: '−', c: 3, ans: 4, opts: [10, 4, 3, 7] },   // idx1
  { a: 8, o1: '−', b: 2, o2: '+', c: 1, ans: 7, opts: [11, 5, 7, 6] },   // idx2
  { a: 6, o1: '+', b: 3, o2: '−', c: 4, ans: 5, opts: [1, 9, 13, 5] },   // idx3
  { a: 9, o1: '−', b: 3, o2: '−', c: 2, ans: 4, opts: [4, 14, 6, 8] },   // idx0
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'chain' };
const rowLabel = (r) => `${r.a} ${r.o1} ${r.b} ${r.o2} ${r.c} = ?`;

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir", board: "Ikki qadamli zanjir",
    setup: "To'rt misol, har biri ikki qadam.",
    ask: "Har misolga to'g'ri javobni tanlang.",
    correct: "Barakalla! To'rtala javob to'g'ri!",
    hint: "Avval birinchi amal, chiqqan songa ikkinchi amalni qo'llang.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка", board: "Цепочка в два шага",
    setup: "Четыре примера, каждый в два шага.",
    ask: "Выбери верный ответ для каждого примера.",
    correct: "Молодец! Все четыре ответа верны!",
    hint: "Сначала первое действие, к результату примени второе.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D31_06(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${rowLabel(r)} [${r.opts.join('/')}]`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const slotCls = (i) => 'pq-slot' + (vals[i] != null ? ' has' : '');

  return (
    <div className="pq pq3106">
      <style>{`
        .pq3106{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3106 *,.pq3106 *::before,.pq3106 *::after{box-sizing:border-box;}
        .pq3106 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3106 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3106 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3106 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3106 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:22px;background:linear-gradient(#f2f9ec,#e6f4d9);border:2px solid #cfe6bd;}
        .pq3106 .pq-band{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:46px;border-radius:14px;background:linear-gradient(90deg,#e8f4ff,#eaf7dd);border:2px solid #cfe6bd;overflow:hidden;}
        .pq3106 .pq-band-title{font-size:14px;font-weight:800;letter-spacing:.02em;color:#3a7f42;}
        .pq3106 .pq-band-sun{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 10px 2px rgba(249,198,47,.4);}
        .pq3106 .pq-band-cloud{position:absolute;left:16px;top:12px;width:30px;height:9px;background:#fff;border-radius:999px;opacity:.75;box-shadow:10px 4px 0 -3px #fff;}
        .pq3106 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;}
        @media (min-width:480px){.pq3106 .pq-rows{grid-template-columns:1fr 1fr;max-width:560px;}}
        .pq3106 .pq-rw{display:flex;flex-wrap:wrap;gap:6px;align-items:center;align-content:center;justify-content:center;padding:10px 12px;border-radius:14px;border:2.5px solid #cfe3da;background:#fff;transition:.15s;}
        .pq3106 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq3106 .pq-rw.good.win{animation:pq3106Cele .5s ease;}
        .pq3106 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq3106Shake .35s ease;}
        .pq3106 .pq-ex{min-width:34px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;gap:2px;font-size:20px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq3106 .pq-op{font-size:20px;font-weight:900;} .pq3106 .pq-op.plus{color:#1a7f43;} .pq3106 .pq-op.minus{color:#c0392b;}
        .pq3106 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;margin:0 1px;}
        .pq3106 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq3106Breath 2.4s ease-in-out infinite;}
        .pq3106 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq3106 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq3106 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq3106 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq3106 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq3106 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq3106 .pq-sgs{display:flex;flex-wrap:nowrap;align-content:center;flex-basis:100%;gap:8px;margin-top:3px;justify-content:stretch;}
        .pq3106 .pq-sg{flex:1 1 0;min-width:0;height:50px;padding:0 2px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:19px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3106 .pq-sg:hover:not(:disabled){border-color:#94c47f;transform:translateY(-2px);}
        .pq3106 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq3106 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq3106 .pq-rw.good .pq-sg.sel{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;}
        .pq3106 .pq-sg:disabled{cursor:default;}
        .pq3106 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3106In .22s ease both;}
        .pq3106 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3106 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3106Breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pq3106Shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3106Cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3106In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-band">
          <span className="pq-band-cloud" />
          <span className="pq-band-title">{t.board}</span>
          <span className="pq-band-sun" />
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">
                  {r.a}
                  <b className={'pq-op ' + (r.o1 === '+' ? 'plus' : 'minus')}>{r.o1 === '+' ? '+' : '−'}</b>
                  {r.b}
                  <b className={'pq-op ' + (r.o2 === '+' ? 'plus' : 'minus')}>{r.o2 === '+' ? '+' : '−'}</b>
                  {r.c}
                </div>
                <span className="pq-eq">=</span>
                <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
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
