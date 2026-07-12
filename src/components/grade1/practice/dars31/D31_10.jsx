// Dars31 · Amaliyot 10 — «Yechimni tuzing» ikki qadamli masala «Olma bog'i» · 🔴 · tag: build_solution
// Masala (10 ichida): Bor edi 5, keldi 3, ketdi 2. Yechim-strip «5 [op1] 3 [op2] 2 = ?».
// IKKI QADAM: op1 ∈ [+,−] (to'g'ri «+», keldi—qo'shamiz); op2 ∈ [+,−] (to'g'ri «−», ketdi—ayiramiz).
// G'alaba FAQAT op1='+' VA op2='−' bo'lganda — natija 6 ochiladi (5 + 3 − 2 = 6).
// Distraktorlar: noto'g'ri op1 -> «Keldi — qo'shamiz»; noto'g'ri op2 -> «Ketdi — ayiramiz».
// Belgi va natija g'alabagacha YASHIRIN (strip «?», arena 5 olma); g'alabada +3 keladi, −2 ketadi -> 6.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PLUS = '+';
const MINUS = '−'; // U+2212 minus belgisi (ASCII defis EMAS)
const A = 5, B = 3, C = 2, STEP1 = 8, RESULT = 6;   // 5 + 3 = 8, 8 − 2 = 6
const DATA = { a: A, b: B, c: C, step1: STEP1, result: RESULT, op1: PLUS, op2: MINUS, level: '🔴', tag: 'build_solution' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Yechim",
    title: "Yechimni tuzing",
    setup: "Savatda 5 olma bor edi, 3 keldi, 2 ketdi.",
    ask: "Yechimni tuzing.",
    cap1: "1-amal", cap2: "2-amal",
    correct: "Barakalla! 5 + 3 − 2 = 6.",
    hintOp1: "Keldi — ko'paydi, qo'shamiz.",
    hintOp2: "Ketdi — kamaydi, ayiramiz.",
    hint: "Yechimni tuzing.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Решение",
    title: "Составь решение",
    setup: "В корзине было 5 яблок, пришло 3, ушло 2.",
    ask: "Составь решение.",
    cap1: "1-е действие", cap2: "2-е действие",
    correct: "Молодец! 5 + 3 − 2 = 6.",
    hintOp1: "Пришло — стало больше, складываем.",
    hintOp2: "Ушло — стало меньше, вычитаем.",
    hint: "Составь решение.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — Dars21/29 kanoni: yumaloq tana (radial 2-ton), bandak, barg, oq blik.
const Apple = ({ w = 28 }) => {
  const id = 'pq3110a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
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

export default function D31_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [op1, setOp1] = useState(null);        // null | '+' | '−'
  const [op2, setOp2] = useState(null);        // null | '+' | '−'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kelish/ketish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { op1, op2 } dan holatni tiklaydi.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.op1 != null) setOp1(initialAnswer.studentAnswer.op1);
      if (initialAnswer.studentAnswer.op2 != null) setOp2(initialAnswer.studentAnswer.op2);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(op1 !== null && op2 !== null && !checked); }, [op1, op2, checked, onReady]);

  const check = useCallback(() => {
    if (op1 === null || op2 === null) return;
    const ok1 = op1 === PLUS;
    const ok2 = op2 === MINUS;
    const correct = ok1 && ok2;
    const msg = correct ? t.correct : (!ok1 ? t.hintOp1 : t.hintOp2);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [PLUS, MINUS], studentAnswer: { op1, op2 }, correctAnswer: { op1: PLUS, op2: MINUS, result: RESULT }, correct, meta: { ...DATA } });
  }, [op1, op2, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (olmalar bosiladigan nishon EMAS — dekor)

  const pick1 = (v) => { if (lock) return; setOp1(v); setFeedback(null); };
  const pick2 = (v) => { if (lock) return; setOp2(v); setFeedback(null); };

  return (
    <div className={"pq pq3110" + (still ? " still" : "")}>
      <style>{`
        .pq3110.still *{animation:none !important;}
        .pq3110{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3110 *{box-sizing:border-box;}
        .pq3110 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3110 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3110 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3110 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}

        .pq3110 .pq-scene{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 58%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-sizing:border-box;padding:40px 12px 16px;}
        .pq3110 .pq-sun{position:absolute;right:18px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq3110sun 3.6s ease-in-out infinite;}
        .pq3110 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq3110 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}

        /* Arena — olmalar (kelish/ketish sahnasi) */
        .pq3110 .pq-arena{position:relative;z-index:3;display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:6px 7px;min-height:74px;max-width:320px;margin:0 auto;}
        .pq3110 .pq-obj{position:relative;line-height:0;transform-origin:50% 100%;}
        .pq3110 .pq-obj.idle{animation:pq3110bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq3110 .pq-obj.arrive{animation:pq3110arrive .5s ease both;animation-delay:var(--ad,0s);}
        .pq3110 .pq-obj.gone{animation:pq3110gone .5s ease both;animation-delay:var(--gd,0s);opacity:0;}
        .pq3110 .pq-x{position:absolute;top:-8px;right:-6px;width:16px;height:16px;border-radius:50%;background:#c0392b;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 3px rgba(0,0,0,.3);}
        .pq3110 .pq-tag{position:absolute;z-index:5;right:8px;top:2px;padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #c9822f;color:#b46e1f;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}

        /* Yechim-strip: 5 [op1] 3 [op2] 2 = ? */
        .pq3110 .pq-strip{position:relative;z-index:3;display:flex;justify-content:center;align-items:center;gap:5px;flex-wrap:nowrap;margin:14px auto 0;background:#fff;border:2px solid #cbb58e;border-radius:14px;padding:8px 10px;box-shadow:0 3px 8px rgba(0,0,0,.10);width:max-content;max-width:100%;}
        .pq3110 .pq-num{min-width:34px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:10px;background:#f4faf0;border:2px solid #cfe3bd;color:#3a3320;font-variant-numeric:tabular-nums;}
        .pq3110 .pq-slot{display:inline-flex;align-items:center;justify-content:center;width:32px;height:40px;border-radius:10px;background:#eef2f7;border:2px solid #c3cddb;color:#5a6b82;font-size:22px;font-weight:900;animation:pq3110breathe 2.4s ease-in-out infinite;}
        .pq3110 .pq-sign{display:inline-flex;align-items:center;justify-content:center;width:32px;height:40px;border-radius:10px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-size:22px;font-weight:900;}
        .pq3110 .pq-eqs{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq3110 .pq-res{min-width:38px;height:40px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:10px;font-variant-numeric:tabular-nums;}
        .pq3110 .pq-res.q{background:#eef2f7;border:2px solid #c3cddb;color:#5a6b82;animation:pq3110breathe 2.4s ease-in-out infinite;}
        .pq3110 .pq-res.win{background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;animation:pq3110pop .4s ease both;}

        .pq3110 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3110tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3110 .pq-spark.s2{animation-delay:-.6s;} .pq3110 .pq-spark.s3{animation-delay:-1.15s;}

        /* Ikki amal-guruh: op1 va op2 tanlash */
        .pq3110 .pq-groups{display:flex;gap:16px;justify-content:center;margin-top:16px;flex-wrap:wrap;}
        .pq3110 .pq-grp{display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq3110 .pq-cap{font-size:12px;font-weight:800;letter-spacing:.04em;color:#8a94a2;text-transform:uppercase;}
        .pq3110 .pq-ops{display:flex;gap:12px;justify-content:center;}
        .pq3110 .pq-op{width:60px;height:60px;font-size:32px;font-weight:900;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq3110 .pq-op:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq3110 .pq-op:active:not(:disabled){transform:scale(.94);}
        .pq3110 .pq-op.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq3110 .pq-op.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3110cele .5s ease;}
        .pq3110 .pq-op:disabled{cursor:default;}
        .pq3110 .pq-op.sel:disabled,.pq3110 .pq-op.right:disabled{opacity:1;}

        .pq3110 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3110in .22s ease both;}
        .pq3110 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3110 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3110bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3110sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3110breathe{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.08);opacity:1;}}
        @keyframes pq3110pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3110arrive{0%{opacity:0;transform:translateY(-26px) scale(.5);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3110gone{0%{opacity:1;transform:translateY(0) scale(1) rotate(0);}100%{opacity:0;transform:translateY(-26px) scale(.5) rotate(18deg);}}
        @keyframes pq3110tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3110cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3110in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <div className="pq-board">{t.title}</div>

        {/* ARENA: bor edi 5. G'alabada +3 keladi (arrive), so'ng −2 ketadi (gone) -> 6 qoladi. */}
        <div className="pq-arena">
          {(ok ? Array.from({ length: STEP1 }) : Array.from({ length: A })).map((_, i) => {
            const arrive = ok && i >= A;          // keldi (3)
            const gone = ok && i >= STEP1 - C;    // ketdi — oxirgi 2 uchib chiqadi
            const cls = 'pq-obj' + (idle ? ' idle' : '') + (gone ? ' gone' : arrive ? ' arrive' : '');
            const ad = still ? 0 : (i - A) * 0.14;
            const gd = still ? 0 : 0.55 + (i - (STEP1 - C)) * 0.16;
            return (
              <span key={'a' + i} className={cls} style={{ '--bd': `${i * 0.1}s`, '--ad': `${ad}s`, '--gd': `${gd}s` }}>
                <Apple w={28} />
                {gone && !still && <span className="pq-x">{'✕'}</span>}
              </span>
            );
          })}
          {!ok && <span className="pq-tag">{A}</span>}
        </div>

        {/* YECHIM-STRIP: 5 [op1] 3 [op2] 2 = ? — belgilar va natija g'alabagacha yashirin */}
        <div className="pq-strip">
          <span className="pq-num">{A}</span>
          {op1 ? <span className="pq-sign">{op1}</span> : <span className="pq-slot">?</span>}
          <span className="pq-num">{B}</span>
          {op2 ? <span className="pq-sign">{op2}</span> : <span className="pq-slot">?</span>}
          <span className="pq-num">{C}</span>
          <span className="pq-eqs">=</span>
          {ok ? <span className="pq-res win">{RESULT}</span> : <span className="pq-res q">?</span>}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '44px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '34px' }}>{'✦'}</span>
        </>)}
      </div>

      {/* IKKI QADAM: 1-amal (op1: keldi -> +) va 2-amal (op2: ketdi -> −). To'g'ri = «+» va «−». */}
      <div className="pq-groups">
        <div className="pq-grp">
          <span className="pq-cap">{t.cap1}</span>
          <div className="pq-ops">
            {[MINUS, PLUS].map((v) => {
              const sel = op1 === v; const right = ok && v === PLUS;
              return <button key={'a' + v} type="button" className={'pq-op' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick1(v)}>{v}</button>;
            })}
          </div>
        </div>
        <div className="pq-grp">
          <span className="pq-cap">{t.cap2}</span>
          <div className="pq-ops">
            {[MINUS, PLUS].map((v) => {
              const sel = op2 === v; const right = ok && v === MINUS;
              return <button key={'b' + v} type="button" className={'pq-op' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick2(v)}>{v}</button>;
            })}
          </div>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
