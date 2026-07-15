// Dars29 · Amaliyot 06 — 🔴 CHAIN aralash (qoldiq + noma'lum qo'shiluvchi) · tag: chain
// 4 misol: 2 ta ayirish (qoldiq: bor − oldi), 2 ta yo'q qo'shiluvchi (a + ? = jami → jami − a).
// SODDALASHTIRILDI (metodist talabi 2026-07-15): hovuz/qurbaqa "frame" sahnasi olib tashlandi
// (o'quvchini chalg'itardi). O'rniga kichik STATIK banner; tanlov tugmalari kartochka enini to'ldiradi.
// To'g'ri indeks har qatorda o'zgaradi (1,2,3,0). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { kind: 'sub', a: 7, b: 3, ans: 4, opts: [10, 4, 3, 5] },       // idx1
  { kind: 'add', a: 5, sum: 8, ans: 3, opts: [13, 8, 3, 2] },     // idx2
  { kind: 'sub', a: 9, b: 4, ans: 5, opts: [13, 4, 6, 5] },       // idx3
  { kind: 'add', a: 6, sum: 10, ans: 4, opts: [4, 16, 5, 3] },    // idx0
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'chain' };
const rowLabel = (r) => (r.kind === 'sub' ? `${r.a} − ${r.b} = ?` : `${r.a} + ? = ${r.sum}`);

const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Zanjir', board: 'Aralash zanjir',
    setup: 'To\'rtta misol bor: ba\'zisi ayirish, ba\'zisida qo\'shiluvchi yashiringan.',
    ask: 'Har bir misolga to\'g\'ri javobni tanlang.',
    correct: 'Barakalla! To\'rtala javob to\'g\'ri!',
    hint: 'Ayirishda son kamayadi. Yashiringan qo\'shiluvchini jamidan toping: jami − ma\'lum son.',
  },
  ru: {
    eyebrow: 'У пруда · Цепочка', board: 'Смешанная цепочка',
    setup: 'Четыре примера: где-то вычитание, а где-то спряталось слагаемое.',
    ask: 'Выбери верный ответ для каждого примера.',
    correct: 'Молодец! Все четыре ответа верны!',
    hint: 'При вычитании число уменьшается. Спрятанное слагаемое найди из суммы: сумма − известное число.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D29_06(props) {
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
    <div className="pq pq2906">
      <style>{`
        .pq2906{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2906 *,.pq2906 *::before,.pq2906 *::after{box-sizing:border-box;}
        .pq2906 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq2906 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2906 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2906 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2906 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq2906 .pq-band{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:46px;border-radius:14px;background:linear-gradient(90deg,#e4f5fb,#e6f5ea);border:2px solid #c9e3d4;overflow:hidden;}
        .pq2906 .pq-band-title{font-size:14px;font-weight:800;letter-spacing:.02em;color:#1f7a7a;}
        .pq2906 .pq-band-sun{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 10px 2px rgba(249,198,47,.4);}
        .pq2906 .pq-band-cloud{position:absolute;left:16px;top:12px;width:30px;height:9px;background:#fff;border-radius:999px;opacity:.75;box-shadow:10px 4px 0 -3px #fff;}
        .pq2906 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;}
        @media (min-width:480px){.pq2906 .pq-rows{grid-template-columns:1fr 1fr;max-width:560px;}}
        .pq2906 .pq-rw{display:flex;flex-wrap:wrap;gap:6px;align-items:center;align-content:center;justify-content:center;padding:10px 12px;border-radius:14px;border:2.5px solid #cfe3da;background:#fff;transition:.15s;}
        .pq2906 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2906 .pq-rw.good.win{animation:pq2906Cele .5s ease;}
        .pq2906 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2906Shake .35s ease;}
        .pq2906 .pq-ex{min-width:38px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq2906 .pq-op{margin:0 3px;font-size:21px;font-weight:900;} .pq2906 .pq-op.plus{color:#1a7f43;} .pq2906 .pq-op.minus{color:#c0392b;}
        .pq2906 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq2906 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2906Breath 2.4s ease-in-out infinite;}
        .pq2906 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2906 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2906 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2906 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2906 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2906 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2906 .pq-sgs{display:flex;flex-wrap:nowrap;align-content:center;flex-basis:100%;gap:8px;margin-top:3px;justify-content:stretch;}
        .pq2906 .pq-sg{flex:1 1 0;min-width:0;height:50px;padding:0 2px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:19px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2906 .pq-sg:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq2906 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2906 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2906 .pq-rw.good .pq-sg.sel{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;}
        .pq2906 .pq-sg:disabled{cursor:default;}
        .pq2906 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2906In .22s ease both;}
        .pq2906 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2906 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2906Breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pq2906Shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2906Cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2906In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
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
                {r.kind === 'sub' ? (
                  <>
                    <div className="pq-ex">{r.a}<b className="pq-op minus">{'−'}</b>{r.b}</div>
                    <span className="pq-eq">=</span>
                    <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
                  </>
                ) : (
                  <>
                    <div className="pq-ex">{r.a}</div>
                    <b className="pq-op plus">{'+'}</b>
                    <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
                    <span className="pq-eq">=</span>
                    <div className="pq-ex">{r.sum}</div>
                  </>
                )}
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
