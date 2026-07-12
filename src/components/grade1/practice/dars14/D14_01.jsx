// Dars14 · Amaliyot 01 — P13 «To'la kartonda nechta tuxum?» · 🟢 spiral (Dars13 takrori) · tag: count_dasta
// OSHXONA SAHNASI: deraza + quyosh, javon, tovuqcha. Stolda 10 UYALI TUXUM KARTONI (2 qator × 5) — to'la.
// Savol: kartonda nechta tuxum? G'alaba: har tuxumda 1..10 ko'k badge, chip «To'la karton = 10 tuxum».
// Kontsept: TO'LA KARTON — BU O'NLIK.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const N = 10; // kartondagi tuxumlar (bitta o'nlik)
const DATA = { target: 10, options: [9, 10, 11], ptype: 'P13', level: '🟢', tag: 'count_dasta' };

const T = {
  uz: {
    eyebrow: "Tuxum kartoni · O'nlik", title: "Kartonda nechta tuxum?",
    setup: "Stolda to'la tuxum kartoni turibdi.",
    ask: "Kartonda nechta tuxum bor?",
    correct: "Barakalla! To'la karton — bu o'nlik. Kartonda o'nta tuxum bor!",
    hint: "Har uyada bitta tuxum. Tuxumlarni birma-bir sanang.",
    lblBox: "to'la karton", qword: "tuxum", res: "To'la karton = 10 tuxum",
  },
  ru: {
    eyebrow: "Коробка яиц · Десяток", title: "Сколько яиц в коробке?",
    setup: "На столе стоит полная коробка яиц.",
    ask: "Сколько яиц в коробке?",
    correct: "Молодец! Полная коробка — это десяток. В коробке десять яиц!",
    hint: "В каждой ячейке одно яйцо. Сосчитайте яйца по одному.",
    lblBox: "полная коробка", qword: "яиц", res: "Полная коробка = 10 яиц",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TUXUM KANONI (yakka birlik): oq-krem tuxum, yumshoq soya + blik. Bitta tuxum = bitta birlik.
const Egg = ({ w = 26 }) => (
  <svg viewBox="0 0 24 30" width={w} height={(w * 30) / 24} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 1.5 C18 1.5 22 10 22 17.5 C22 24.5 17.5 28.5 12 28.5 C6.5 28.5 2 24.5 2 17.5 C2 10 6 1.5 12 1.5 Z" fill="#fdf6e8" stroke="#dcc9a4" strokeWidth="1.2" />
    <path d="M12 3 C16.8 3 20.4 10.6 20.4 17.4" fill="none" stroke="#efe2c6" strokeWidth="1.4" strokeLinecap="round" />
    <ellipse cx="8.6" cy="10" rx="3" ry="4.6" fill="#fff" opacity=".75" />
  </svg>
);

// Tovuqcha (dekor, javonda o'tiradi) — ambient bosh qimirlashi.
const Hen = () => (
  <svg viewBox="0 0 40 34" width="38" height="32" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="18" cy="22" rx="14" ry="10" fill="#f4ead6" stroke="#d9c5a0" strokeWidth="1.1" />
    <path d="M6 20 Q1 22 4 26 Q8 26 9 23 Z" fill="#e8d8ba" />
    <circle cx="29" cy="12" r="7" fill="#f7efdd" stroke="#d9c5a0" strokeWidth="1.1" />
    <path d="M26 5.5 Q27 2.5 29 5 Q30.4 2.2 32 5 Q33.6 3 34 6 L31 8 Z" fill="#d9534b" />
    <polygon points="35.6,11 40,12.6 35.6,14.4" fill="#e8a13c" />
    <circle cx="30.6" cy="10.6" r="1.3" fill="#3a322c" />
    <path d="M12 30 L12 33 M22 30 L22 33" stroke="#c98f3e" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function D14_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sanash-badge animatsiyasi qayta ijro etilmaydi — statik.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1401">
      <style>{`
        .pq1401{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1401 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1401 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1401 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1401 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1401 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;}
        /* OSHXONA SAHNASI */
        .pq1401 .pq-scene{position:relative;width:352px;max-width:100%;height:232px;border-radius:20px;background:linear-gradient(#fdf3de 0%,#f6e6c4 58%,#eed6ab 100%);border:2px solid #e2cda0;overflow:hidden;}
        .pq1401 .pq-win{position:absolute;left:16px;top:14px;width:62px;height:48px;border-radius:7px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d3b176;box-shadow:0 0 16px 3px rgba(255,239,178,.7);animation:pqGlow 3.8s ease-in-out infinite;z-index:1;}
        .pq1401 .pq-win::before,.pq1401 .pq-win::after{content:'';position:absolute;background:#d3b176;}
        .pq1401 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1401 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1401 .pq-sun{position:absolute;left:24px;top:20px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1401 .pq-shelf{position:absolute;right:14px;top:56px;width:86px;height:8px;border-radius:3px;background:linear-gradient(#c8935a,#a9743f);box-shadow:0 2px 3px rgba(0,0,0,.15);z-index:1;}
        .pq1401 .pq-hen{position:absolute;right:34px;top:26px;z-index:2;animation:pqHen 3.4s ease-in-out infinite;transform-origin:bottom center;}
        .pq1401 .pq-table{position:absolute;left:0;right:0;bottom:0;height:38px;background:linear-gradient(#c8935a,#a9743f 60%,#8f5f30);border-top:3px solid #dcae74;z-index:2;}
        .pq1401 .pq-table::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:rgba(255,255,255,.14);}
        /* TUXUM KARTONI — 10 uya (2 qator × 5), to'la */
        .pq1401 .pq-boxwrap{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);z-index:4;animation:pqBob 4s ease-in-out infinite;}
        .pq1401 .pq-scene.still .pq-boxwrap{animation:none;}
        .pq1401 .pq-carton{position:relative;padding:9px 10px 11px;border-radius:12px;background:linear-gradient(#cbb497,#b39a78);border:2.5px solid #92795a;box-shadow:0 4px 0 #7d654a,0 7px 10px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq1401 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:5px;}
        .pq1401 .pq-cell{position:relative;width:34px;height:36px;border-radius:50% 50% 44% 44%;background:rgba(60,42,20,.24);box-shadow:inset 0 3px 5px rgba(0,0,0,.3);display:flex;align-items:flex-end;justify-content:center;padding-bottom:1px;}
        .pq1401 .pq-bcap{position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:1px 11px;border-radius:999px;background:#c93b32;color:#fff;font-size:11.5px;font-weight:800;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,.2);z-index:5;}
        .pq1401 .pq-cnt{position:absolute;top:-7px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.2);animation:pqPop .3s ease both;font-variant-numeric:tabular-nums;}
        .pq1401 .pq-scene.still .pq-cnt{animation:none;}
        /* tenglama qatori sahna ostida */
        .pq1401 .pq-eqrow{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:2px;min-height:48px;}
        .pq1401 .pq-eqlabel{padding:6px 14px;border-radius:12px;background:#fff6e4;border:2px solid #e3c996;color:#9a5f1c;font-size:16px;font-weight:900;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,.1);}
        .pq1401 .pq-eqs{font-size:30px;font-weight:900;color:#a86412;}
        .pq1401 .pq-ans{min-width:40px;height:44px;padding:0 6px;border-radius:12px;background:#fff;border:3px solid #e3c996;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#c77d2e;font-variant-numeric:tabular-nums;box-shadow:0 3px 6px rgba(0,0,0,.14);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1401 .pq-ans.win{color:#1a7f43;border-color:#1a7f43;background:#e8f7ee;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1401 .pq-qword{font-size:17px;font-weight:800;color:#7a4d17;}
        .pq1401 .pq-res{margin-top:2px;min-height:2px;}
        .pq1401 .pq-chip{display:inline-flex;align-items:center;padding:7px 18px;border-radius:999px;background:#e8f7ee;color:#1a7f43;font-size:16px;font-weight:900;animation:pqPop2 .4s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1401 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:10px;}
        .pq1401 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1401 .pq-opt:hover:not(:disabled){border-color:#e3b877;transform:translateY(-2px);}
        .pq1401 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1401 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1401 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1401 .pq-opt:disabled{cursor:default;}
        .pq1401 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1401 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1401 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 12px 2px rgba(255,239,178,.55);}50%{box-shadow:0 0 20px 5px rgba(255,239,178,.85);}}
        @keyframes pqHen{0%,100%{transform:rotate(0);}50%{transform:rotate(-3deg);}}
        @keyframes pqBob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-2px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqAns{0%{opacity:0;transform:scale(.3);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop2{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-win" />
          <span className="pq-sun" />
          <span className="pq-shelf" />
          <span className="pq-hen"><Hen /></span>
          <span className="pq-table" />

          <div className="pq-boxwrap">
            <div className="pq-carton">
              <span className="pq-bcap">{t.lblBox}</span>
              <div className="pq-grid">
                {Array.from({ length: N }).map((_, i) => (
                  <span key={i} className="pq-cell">
                    <Egg w={25} />
                    {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.06}s` }}>{i + 1}</b>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pq-eqrow">
          <span className="pq-eqlabel">{t.lblBox}</span>
          <span className="pq-eqs">=</span>
          <span className={'pq-ans' + (ok ? ' win' : '')}>{ok ? DATA.target : '?'}</span>
          <span className="pq-qword">{t.qword}</span>
        </div>

        <div className="pq-res">{ok && <span className="pq-chip">{t.res}</span>}</div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
