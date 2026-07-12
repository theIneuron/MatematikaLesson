// Dars29 · Amaliyot 10 — «Yechimni tuzing» qoldiq masalasi «Olma bog'i» · 🔴 · tag: build_solution
// Interaktiv qaror: masala «8 olma bor edi, 3 tasini oldilar». Sahna: 8 yakka olma (BOR EDI). Bola AMALNI
// MA'NODAN tanlaydi — ikki plitka [+] va [−] (U+2212). «Oldilar — kamaydi», demak to'g'ri amal «−».
// «−» tanlab tekshirilsa: 3 olma sahnadan uchib chiqadi (olib qo'yish anim.), 5 olma qoladi va tenglama
// «8 − 3 = 5» quriladi — g'alaba (natija 5 FAQAT shu yerda ochiladi). «+» tanlansa: yumshoq izoh
// («Oldilar — kamaydi, ayiramiz»), QULF YO'Q, retry YO'Q, javob ochilmaydi (M1: birlashtirish xatosi).
// VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida (op === '−'). studentAnswer = { op }. Belgi-sizdirish yo'q:
// operandlar orasida belgi g'alabagacha ko'rsatilmaydi (tanlov plitkalarda), «?» slot neytral.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PLUS = '+';
const MINUS = '−'; // U+2212 minus belgisi (ASCII defis EMAS)

const BOR = 8, OLDI = 3, QOLDI = 5;   // 8 bor edi − 3 oldilar = 5 qoldi
const DATA = { a: BOR, b: OLDI, target: QOLDI, correctOp: MINUS, ptype: 'NEW', level: '🔴', tag: 'build_solution' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Yechim", title: "Yechimni tuzing",
    setup: "8 olma bor edi, 3 tasini oldilar.",
    ask: "Amalni tanlang.",
    correct: "Barakalla! Oldilar — kamaydi: 8 − 3 = 5.",
    hint: `Oldilar — kamaydi, ayiramiz. Qaysi amal — «${PLUS}» yoki «${MINUS}»?`,
    rem: "Qoldi: 5",
  },
  ru: {
    eyebrow: "Яблоневый сад · Решение", title: "Составь решение",
    setup: "Было 8 яблок, 3 взяли.",
    ask: "Выбери действие.",
    correct: "Молодец! Взяли — стало меньше: 8 − 3 = 5.",
    hint: `Взяли — стало меньше, вычитаем. Какое действие — «${PLUS}» или «${MINUS}»?`,
    rem: "Осталось: 5",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — Dars21/29 kanoni: yumaloq tana (radial 2-ton), bandak, barg, oq blik.
const Apple = ({ w = 30 }) => {
  const id = 'pq2910a' + (__gid++);
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

export default function D29_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [op, setOp] = useState(null);          // null | '+' | '−'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda olib-qo'yish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { op } dan holatni tiklaydi.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.op != null) setOp(initialAnswer.studentAnswer.op);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(op !== null && !checked); }, [op, checked, onReady]);

  const check = useCallback(() => {
    if (op === null) return;
    const correct = op === MINUS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [PLUS, MINUS], studentAnswer: { op }, correctAnswer: { op: MINUS, value: QOLDI }, correct, meta: { ...DATA } });
  }, [op, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (olmalar bosiladigan nishon EMAS — dekor)
  const gDelay = (i) => still ? 0 : (i - QOLDI) * 0.2; // olib-qo'yiladigan 3 olma ketma-ket uchadi

  const pick = (v) => { if (lock) return; setOp(v); setFeedback(null); };

  return (
    <div className="pq pq2910">
      <style>{`
        .pq2910{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2910 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2910 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2910 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2910 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2910 .pq-scene{position:relative;width:380px;max-width:100%;height:216px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2910 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2910sun 3.6s ease-in-out infinite;}
        .pq2910 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.8;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2910sway 4.4s ease-in-out infinite;}
        .pq2910 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2910 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2910 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:44px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2910 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}

        .pq2910 .pq-arena{position:absolute;left:10px;right:10px;top:46px;bottom:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq2910 .pq-apples{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:6px 8px;max-width:300px;}
        .pq2910 .pq-obj{position:relative;line-height:0;transform-origin:50% 100%;}
        .pq2910 .pq-obj.idle{animation:pq2910bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2910 .pq-obj.keep{animation:pq2910keep .5s ease both;}
        .pq2910 .pq-obj.gone{animation:pq2910gone .5s ease both;animation-delay:var(--gd,0s);}
        .pq2910 .pq-x{position:absolute;top:-8px;right:-6px;width:16px;height:16px;border-radius:50%;background:#c0392b;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 3px rgba(0,0,0,.3);}
        .pq2910 .pq-tag{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #c9822f;color:#b46e1f;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}

        .pq2910 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2910tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2910 .pq-spark.s2{animation-delay:-.6s;} .pq2910 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2910 .pq-ops{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq2910 .pq-op{width:78px;height:78px;font-size:38px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq2910 .pq-op:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2910 .pq-op:active:not(:disabled){transform:scale(.94);}
        .pq2910 .pq-op.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2910 .pq-op.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2910cele .5s ease;}
        .pq2910 .pq-op:disabled{cursor:default;opacity:.55;}
        .pq2910 .pq-op.sel:disabled,.pq2910 .pq-op.right:disabled{opacity:1;}

        .pq2910 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2910in .3s ease both;}
        .pq2910 .pq-eq b{min-width:44px;height:40px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2910 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2910 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2910 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2910in .3s .1s both;}

        .pq2910 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2910in .22s ease both;}
        .pq2910 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2910 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2910bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2910sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2910sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2910keep{0%{transform:scale(1);}40%{transform:scale(1.14);}100%{transform:scale(1);}}
        @keyframes pq2910gone{0%{opacity:1;transform:translateY(0) scale(1) rotate(0);}100%{opacity:0;transform:translateY(-26px) scale(.5) rotate(18deg);}}
        @keyframes pq2910tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2910cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2910in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ left: '16px', top: '30px' }}>❧</span>
        <span className="pq-leaf l2" style={{ right: '18px', bottom: '36px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* BOR EDI = 8 yakka olma. G'alabada oxirgi 3 olma uchib chiqadi (OLDILAR), 5 qoladi. */}
          <div className="pq-apples">
            {Array.from({ length: BOR }).map((_, i) => {
              const gone = ok && i >= QOLDI;   // oxirgi 3 = olib qo'yilganlar
              const keep = ok && i < QOLDI;     // qolgan 5
              const cls = 'pq-obj' + (idle ? ' idle' : '') + (gone ? ' gone' : keep ? ' keep' : '');
              return (
                <span key={'a' + i} className={cls} style={{ '--bd': `${i * 0.1}s`, '--gd': `${gDelay(i)}s` }}>
                  <Apple w={30} />
                  {gone && !still && <span className="pq-x">{'✕'}</span>}
                </span>
              );
            })}
          </div>
          {!ok && <span className="pq-tag">{BOR}</span>}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>{'✦'}</span>
        </>)}
      </div>

      {/* Amal plitkalari: «+» birlashtirish (M1 xato amal), «−» ayirish (to'g'ri). Belgi natijani sizdirmaydi. */}
      <div className="pq-ops">
        {[PLUS, MINUS].map((v) => {
          const sel = op === v; const right = ok && v === MINUS;
          return <button key={v} type="button" className={'pq-op' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick(v)}>{v}</button>;
        })}
      </div>

      {/* G'alaba: yechim tuzildi — 8 − 3 = 5 (natija faqat shu yerda ochiladi) */}
      {ok && (<>
        <div className="pq-eq"><b>{BOR}</b><i>{MINUS}</i><b>{OLDI}</b><i>=</i><b className="res">{QOLDI}</b></div>
        <div className="pq-sub">{t.rem}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
