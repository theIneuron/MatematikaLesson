// Dars30 · Amaliyot 10 — «Jadvalni to'ldiring» (P15 + P24, ikki qadamli) · 🔴 · tag: build_table
// Jadval-masala (10 ichida): Bor edi 5 / Keldi [amal?] 3 / Jami [?]. MATH 5 + 3 = 8.
// IKKI QADAM: (1) B qatori uchun amal plitkasi [−,+] — to'g'ri «+»; (2) natija plitkasi [2,8,9] — to'g'ri 8.
// G'alaba FAQAT amal='+' VA natija=8 bo'lganda. Distraktorlar: 2 = noto'g'ri amal (5−3), 9 = bir birlik xato.
// Belgi va natija g'alabagacha YASHIRIN (amal «?», Jami «?»); g'alabada jadval «5 / + 3 / 8» yashil + tenglama.
// VEDI-DO-VERNOGO: noto'g'ri amal -> «qo'shamiz» izohi; noto'g'ri natija -> «o'nlik va birlik» izohi; qulf yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PLUS = '+';
const MINUS = '−'; // U+2212 minus belgisi (ASCII defis EMAS)
const A = 5, B = 3, SUM = 8;                    // 5 + 3 = 8 (10 ichida)
const OPTIONS = [2, SUM, 9];                     // natija variantlari — 8 birinchi EMAS
const DATA = { a: A, b: B, sum: SUM, op: PLUS, ops: [MINUS, PLUS], options: OPTIONS, answer: SUM, level: '🔴', tag: 'build_table' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Jadval",
    title: "Jadvalni to'ldiring",
    setup: "Savatda 5 olma bor edi, 3 ta keldi.",
    ask: "Jadvalni to'ldiring.",
    rBor: "Bor edi", rKel: "Keldi", rJam: "Jami",
    capOp: "Amal", capRes: "Natija",
    correct: "Barakalla! Keldi — qo'shamiz. 5 + 3 = 8.",
    hintOp: "Keldi — ko'paydi, qo'shamiz.",
    hintRes: "O'nlik va birlikni qo'shing.",
    hint: "Jadvalni to'ldiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Таблица",
    title: "Заполни таблицу",
    setup: "В корзине было 5 яблок, пришло 3.",
    ask: "Заполни таблицу.",
    rBor: "Было", rKel: "Пришло", rJam: "Всего",
    capOp: "Действие", capRes: "Результат",
    correct: "Молодец! Пришло — складываем. 5 + 3 = 8.",
    hintOp: "Пришло — стало больше, складываем.",
    hintRes: "Сложи десяток и единицы.",
    hint: "Заполни таблицу.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 24 }) => {
  const id = "pq3010a" + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// Olmalar qatori (birliklar). Bezak tebranish idle bilan (bosiladigan nishon EMAS).
const AppleRow = ({ n, idle, base = 0 }) => (
  <div className="pq-units">
    {Array.from({ length: n }).map((_, i) => (
      <span key={"u" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(base + i) * 0.1}s` }}>
        <Apple w={22} />
      </span>
    ))}
  </div>
);

export default function D30_10(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [op, setOp] = useState(null);          // null | '+' | '−'
  const [res, setRes] = useState(null);        // null | son
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { op, res } dan holatni tiklaydi.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.op != null) setOp(initialAnswer.studentAnswer.op);
      if (initialAnswer.studentAnswer.res != null) setRes(initialAnswer.studentAnswer.res);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(op !== null && res !== null && !checked); }, [op, res, checked, onReady]);

  const check = useCallback(() => {
    if (op === null || res === null) return;
    const okOp = op === PLUS;
    const correct = okOp && res === SUM;
    const msg = correct ? t.correct : (!okOp ? t.hintOp : t.hintRes);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String), studentAnswer: { op, res }, correctAnswer: { op: PLUS, res: SUM }, correct, meta: { ...DATA } });
  }, [op, res, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;

  const pickOp = (v) => { if (lock) return; setOp(v); setFeedback(null); };
  const pickRes = (v) => { if (lock) return; setRes(v); setFeedback(null); };

  return (
    <div className={"pq pq3010" + (still ? " still" : "")}>
      <style>{`
        .pq3010.still *{animation:none !important;}
        .pq3010{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3010 *{box-sizing:border-box;}
        .pq3010 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3010 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3010 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3010 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}

        .pq3010 .pq-scene{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 60%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-sizing:border-box;padding:40px 14px 16px;}
        .pq3010 .pq-sun{position:absolute;right:18px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq3010sun 3.6s ease-in-out infinite;}
        .pq3010 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        /* Jadval — sahna markazi (3 qator, hairline separatorlar) */
        .pq3010 .pq-table{position:relative;z-index:3;width:100%;max-width:320px;margin:0 auto;background:#fff;border:2px solid #cbb58e;border-radius:14px;box-shadow:0 3px 8px rgba(0,0,0,.10);overflow:hidden;box-sizing:border-box;}
        .pq3010 .pq-tr{display:flex;align-items:center;min-height:52px;padding:6px 12px;gap:10px;}
        .pq3010 .pq-tr + .pq-tr{border-top:1px solid #e8dfca;}
        .pq3010 .pq-lab{flex:1 1 auto;font-size:15px;font-weight:700;color:#7a6f57;}
        .pq3010 .pq-val{flex:0 0 auto;display:flex;align-items:center;gap:6px;font-size:22px;font-weight:900;color:#3a3320;font-variant-numeric:tabular-nums;}
        .pq3010 .pq-val .pq-units{display:flex;gap:3px;}
        .pq3010 .pq-tr.res .pq-lab{color:#2c6633;}
        .pq3010 .pq-tr.res{background:#f4faf0;}
        .pq3010 .pq-tr.res.win{background:#e8f7ee;}
        .pq3010 .pq-q{display:inline-flex;align-items:center;justify-content:center;min-width:40px;height:40px;padding:0 10px;border-radius:11px;background:#eef2f7;border:2px solid #c3cddb;color:#5a6b82;font-size:24px;font-weight:900;animation:pq3010breathe 2.4s ease-in-out infinite;}
        .pq3010 .pq-qs{display:inline-flex;align-items:center;justify-content:center;width:30px;height:34px;border-radius:9px;background:#eef2f7;border:2px solid #c3cddb;color:#5a6b82;font-size:20px;font-weight:900;animation:pq3010breathe 2.4s ease-in-out infinite;}
        .pq3010 .pq-fill{display:inline-flex;align-items:center;gap:8px;padding:0 12px;height:42px;border-radius:11px;background:#1a7f43;border:2px solid #15693a;color:#fff;font-size:24px;font-weight:900;font-variant-numeric:tabular-nums;animation:pq3010pop .4s ease both;}
        .pq3010 .pq-fill .pq-obj{line-height:0;}

        .pq3010 .pq-obj{line-height:0;}
        .pq3010 .pq-obj.idle{animation:pq3010bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);transform-origin:50% 100%;}
        .pq3010 .pq-sign{font-size:22px;font-weight:900;color:#2f6bab;}

        .pq3010 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3010tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3010 .pq-spark.s2{animation-delay:-.6s;} .pq3010 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3010 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq3010in .3s ease both;}
        .pq3010 .pq-eq b{min-width:42px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3010 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3010 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq3010 .pq-groups{display:flex;flex-direction:column;gap:12px;margin-top:16px;}
        .pq3010 .pq-grp{display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq3010 .pq-cap{font-size:12px;font-weight:800;letter-spacing:.04em;color:#8a94a2;text-transform:uppercase;}

        .pq3010 .pq-ops{display:flex;gap:14px;justify-content:center;}
        .pq3010 .pq-op{width:64px;height:64px;font-size:34px;font-weight:900;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq3010 .pq-op:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq3010 .pq-op:active:not(:disabled){transform:scale(.94);}
        .pq3010 .pq-op.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq3010 .pq-op.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3010cele .5s ease;}
        .pq3010 .pq-op:disabled{cursor:default;}
        .pq3010 .pq-op.sel:disabled,.pq3010 .pq-op.right:disabled{opacity:1;}

        .pq3010 .pq-opts{display:flex;gap:12px;justify-content:center;}
        .pq3010 .pq-opt{min-width:70px;height:66px;padding:0 10px;font-size:30px;font-weight:800;line-height:1;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3010 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq3010 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq3010 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq3010 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3010cele .5s ease;}
        .pq3010 .pq-opt:disabled{cursor:default;}

        .pq3010 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3010in .22s ease both;}
        .pq3010 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3010 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3010bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3010sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3010breathe{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.08);opacity:1;}}
        @keyframes pq3010pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3010tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3010cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3010in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <div className="pq-title">{t.title}</div>

        {/* JADVAL: Bor edi 5 / Keldi [amal?] 3 / Jami [?] — amal va natija g'alabagacha yashirin */}
        <div className="pq-table">
          <div className="pq-tr">
            <span className="pq-lab">{t.rBor}</span>
            <span className="pq-val"><AppleRow n={A} idle={idle} base={0} /><span>{A}</span></span>
          </div>
          <div className="pq-tr">
            <span className="pq-lab">{t.rKel}</span>
            <span className="pq-val">
              {op ? <span className="pq-sign">{op}</span> : <span className="pq-qs">?</span>}
              <AppleRow n={B} idle={idle} base={A} /><span>{B}</span>
            </span>
          </div>
          <div className={"pq-tr res" + (ok ? " win" : "")}>
            <span className="pq-lab">{t.rJam}</span>
            <span className="pq-val">
              {!ok
                ? <span className="pq-q">?</span>
                : <span className="pq-fill"><Apple w={22} />{SUM}</span>}
            </span>
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "12%", top: "44px" }}>{"✦"}</span>
          <span className="pq-spark s2" style={{ left: "84%", top: "60px" }}>{"✦"}</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "34px" }}>{"✦"}</span>
        </>)}
      </div>

      {/* G'alaba: keldi -> QO'SHAMIZ — tenglama 5 + 3 = 8 (javob faqat shu yerda ochiladi) */}
      {ok && (
        <div className="pq-eq"><b>{A}</b><i>{PLUS}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b></div>
      )}

      {/* IKKI QADAM: amal plitkalari [−,+] (to'g'ri +, birinchi EMAS) + natija plitkalari [2,8,9] */}
      <div className="pq-groups">
        <div className="pq-grp">
          <span className="pq-cap">{t.capOp}</span>
          <div className="pq-ops">
            {[MINUS, PLUS].map((v) => {
              const sel = op === v; const right = ok && v === PLUS;
              return <button key={v} type="button" className={"pq-op" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => pickOp(v)}>{v}</button>;
            })}
          </div>
        </div>
        <div className="pq-grp">
          <span className="pq-cap">{t.capRes}</span>
          <div className="pq-opts">
            {OPTIONS.map((n) => {
              const sel = res === n; const right = ok && n === SUM;
              return <button key={n} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => pickRes(n)}>{n}</button>;
            })}
          </div>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
