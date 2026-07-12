// Dars12 · Amaliyot 06 — P4 Belgilar zanjiri (taqqoslash) · 🔴 · tag: sign_chain
// 4 taqqoslash juftligi 2×2 panjarada (D08/D06 zanjir uslubi): har katak [son][?belgi][son] + 3 belgi-tugma.
// Qator rang-feedback (good/bad, pqShake), javob oshkor qilinmaydi. Belgilar U+003E/003C/003D.
// Yengil ko'l-header: taxta «Taqqoslash smenasi», quyosh breath, 2 bulut. Ozvuchkasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { a: 6, b: 4, ans: '>', opts: ['>', '<', '='] },
  { a: 3, b: 5, ans: '<', opts: ['>', '<', '='] },
  { a: 7, b: 7, ans: '=', opts: ['>', '<', '='] },
  { a: 8, b: 2, ans: '>', opts: ['>', '<', '='] },
];
const DATA = { ptype: 'P4', level: '🔴', tag: 'sign_chain' };
const T = {
  uz: {
    eyebrow: 'Timsohlar ko\'li · Zanjir', title: 'Belgilar zanjiri',
    setup: 'To\'rtta juftlikni taqqosla. Har juftga to\'g\'ri belgi kerak.',
    ask: 'Har juft songa to\'g\'ri belgini tanlang.',
    correct: 'Barakalla! To\'rtala belgi to\'g\'ri!',
    hint: 'Qizil qatorlarga qarang: qaysi son katta? Teng bo\'lsa — teng belgisi.',
    board: 'Taqqoslash smenasi',
  },
  ru: {
    eyebrow: 'Озеро крокодилов · Цепочка', title: 'Цепочка знаков',
    setup: 'Сравни четыре пары. Для каждой пары нужен верный знак.',
    ask: 'Выбери верный знак для каждой пары чисел.',
    correct: 'Молодец! Все четыре знака верны!',
    hint: 'Посмотри на красные строки: какое число больше? Если равны — знак равенства.',
    board: 'Смена сравнения',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Kichik dekorativ timsoh (header uchun): cho'zilgan yashil tana + ochiq jag' + blikli ko'z.
const CrocMini = () => (
  <svg viewBox="0 0 74 34" width="60" height="28" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M8 24 Q3 25 2 20 Q1 15 4 12 Q1 19 3 25 Q5 30 16 30 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.3" strokeLinejoin="round" />
    <ellipse cx="26" cy="24" rx="18" ry="8" fill="#3f9950" stroke="#256835" strokeWidth="1.3" />
    <path d="M14 20 l3.4 -5 3.4 5 Z M22 19 l3.4 -5 3.4 5 Z M30 19 l3.4 -5 3.4 5 Z" fill="#256835" />
    <ellipse cx="30" cy="28" rx="10" ry="2.6" fill="#d9e8a0" opacity=".8" />
    <path d="M40 22 Q52 18 68 25 Q72 26.5 70 30 Q60 31.5 40 30 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M42 22 L66 14 Q70 12 72 15 L50 24 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M46 24 l2 2.6 l2 -2.6 Z M54 24.5 l1.8 2.4 l1.8 -2.4 Z" fill="#fff" />
    <circle cx="40" cy="16" r="4.4" fill="#3f9950" stroke="#256835" strokeWidth="1.2" />
    <circle cx="40.4" cy="15.5" r="2.6" fill="#fff" />
    <circle cx="40.8" cy="15.5" r="1.3" fill="#1f2430" />
  </svg>
);

export default function D12_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: belgi}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => rowRight(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a}?${r.b}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1206">
      <style>{`
        .pq1206{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1206 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f8f6a;text-transform:uppercase;}
        .pq1206 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1206 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1206 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1206 .pq-stage{position:relative;padding:12px 10px 16px;border-radius:22px;background:linear-gradient(#cdeef2 0%,#a9dfe6 40%,#8fd2dc 100%);border:2px solid #a6d9e0;overflow:hidden;}
        .pq1206 .pq-sun{position:absolute;top:10px;right:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1206 .pq-cloud{position:absolute;width:46px;height:15px;background:#fff;border-radius:999px;opacity:.85;box-shadow:14px 5px 0 -4px #fff,-13px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq1206 .pq-cloud.c1{top:12px;left:-70px;animation-duration:30s;animation-delay:-8s;}
        .pq1206 .pq-cloud.c2{top:36px;left:-70px;width:34px;height:12px;opacity:.6;animation-duration:40s;animation-delay:-24s;}
        .pq1206 .pq-head{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;}
        .pq1206 .pq-board{padding:5px 16px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:13px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq1206 .pq-croc{filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));animation:pqFloat 3.6s ease-in-out infinite;}
        .pq1206 .pq-rows{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;gap:9px;}
        .pq1206 .pq-rw{display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:center;align-content:center;padding:8px 9px;border-radius:14px;border:2.5px solid #dbe2ea;background:#fff;transition:.15s;animation:pqFloat 4s ease-in-out infinite;}
        .pq1206 .pq-rw:nth-child(1){animation-delay:0s;} .pq1206 .pq-rw:nth-child(2){animation-delay:-1.3s;}
        .pq1206 .pq-rw:nth-child(3){animation-delay:-2.6s;} .pq1206 .pq-rw:nth-child(4){animation-delay:-3.7s;}
        .pq1206 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1206 .pq-rw.good.win{animation:pqFloat 4s ease-in-out infinite,pqCele .5s ease;}
        .pq1206 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqFloat 4s ease-in-out infinite,pqShake .35s ease;}
        .pq1206 .pq-n{width:42px;height:46px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;flex-shrink:0;}
        .pq1206 .pq-slot{width:42px;height:46px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#aab3c2;flex-shrink:0;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1206 .pq-slot.has{border-style:solid;color:#2f8f6a;border-color:#8fd0bd;background:#eefaf5;animation:none;}
        .pq1206 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq1206 .pq-sgs{display:flex;gap:5px;margin-left:2px;flex-basis:100%;justify-content:center;}
        .pq1206 .pq-sg{width:40px;height:40px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;transition:.12s;}
        .pq1206 .pq-sg:hover:not(:disabled){border-color:#7fc7b3;transform:translateY(-2px);}
        .pq1206 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1206 .pq-sg.sel{border-color:#2f8f6a;background:#e6f6f0;color:#2f8f6a;}
        .pq1206 .pq-sg:disabled{cursor:default;}
        .pq1206 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1206 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1206 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(720px);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.06);border-color:#a9b5c8;}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-head">
          <span className="pq-croc"><CrocMini /></span>
          <span className="pq-board">{t.board}</span>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-n">{r.a}</div>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-n">{r.b}</div>
                <div className="pq-sgs">
                  {r.opts.map((s) => (
                    <button key={s} type="button" className={'pq-sg' + (vals[i] === s ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: s })); setFeedback(null); }}>{s}</button>
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
