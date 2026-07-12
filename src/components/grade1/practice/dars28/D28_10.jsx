// Dars28 · Amaliyot 10 — «Yechimni tuzing» amalni tanlash «Olma bog'i» · 🔴 · tag: build_solution
// Interaktiv qaror: masala «34 olma, yana 25.» Sahna ikki guruh: 34 (3 savat + 4 yakka olma) va 25
// (2 savat + 5 yakka olma). Bola AMALNI MA'NODAN tanlaydi: ikki plitka [+] va [−]. «Birlashtirilsa —
// qo'shamiz», demak to'g'ri amal «+». «+» tanlab tekshirilsa: ikki guruh razryad bo'yicha birlashadi
// (o'nlik savatlar birga: 3 + 2 = 5 savat; yakka olmalar birga: 4 + 5 = 9 olma), o'nliklab sanaladi
// va 59 chiqadi — g'alaba (34 + 25 = 59). «−» tanlansa: yumshoq izoh («birlashtirilsa qo'shamiz»),
// QULF YO'Q, retry yo'q. MODEL: razryad bo'yicha, razryaddan o'tish YO'Q (4 + 5 = 9 < 10, 3 + 2 = 5).
// Sonlar 1-sinf sbornikdan (metodist talabi): 34 + 25 = 59. JAVOB SIZDIRISH YO'Q — 59 faqat g'alabada
// ochiladi; «−» plitka funksional qoladi (M1 xato amal). VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida
// (op === '+'). studentAnswer = { op }.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PLUS = '+';
const MINUS = '−'; // U+2212 minus belgisi (ASCII defis EMAS)

const A_TENS = 3, A_UNITS = 4, A_VAL = 34;   // 34 = 3 savat + 4 olma
const B_TENS = 2, B_UNITS = 5, B_VAL = 25;   // 25 = 2 savat + 5 olma
const M_TENS = A_TENS + B_TENS;              // 5 savat (razryad bo'yicha, o'tish yo'q)
const M_UNITS = A_UNITS + B_UNITS;           // 9 yakka olma (4 + 5 = 9 < 10)
const TARGET = 59;                           // 34 + 25 = 59
const DATA = { a: A_VAL, b: B_VAL, target: TARGET, correctOp: PLUS, ptype: 'NEW', level: '🔴', tag: 'build_solution' };

const GA_T = Array.from({ length: A_TENS }).map((_, i) => i);
const GA_U = Array.from({ length: A_UNITS }).map((_, i) => i);
const GB_T = Array.from({ length: B_TENS }).map((_, i) => i);
const GB_U = Array.from({ length: B_UNITS }).map((_, i) => i);
const MERGED_T = Array.from({ length: M_TENS }).map((_, i) => i);
const MERGED_U = Array.from({ length: M_UNITS }).map((_, i) => i);

const T = {
  uz: {
    eyebrow: "Olma bog'i · Yechim", title: "Yechimni tuzing",
    setup: "34 olma, yana 25 olma. Jami nechta?",
    ask: "Qaysi amal kerak?",
    correct: "Barakalla! Birlashtirilsa qo'shamiz: 34 + 25 = 59.",
    hint: `Birlashtirilsa qo'shamiz. Qaysi amal — «${PLUS}» yoki «${MINUS}»?`,
    tword: "o'nlik", uword: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Решение", title: "Составь решение",
    setup: "34 яблока, ещё 25. Сколько всего?",
    ask: "Какое действие нужно?",
    correct: "Молодец! Объединили — складываем: 34 + 25 = 59.",
    hint: `Объединили — складываем. Какое действие — «${PLUS}» или «${MINUS}»?`,
    tword: "десятков", uword: "единиц",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma bir birlikka bog'langan) — Dars21/24 dan uzviy. To'qilgan savat,
// ustidan olmalar mo'ralaydi, oldida yashil "10" nishoni. Bola savatdagi olmalarni QAYTA sanamaydi —
// savat bitta BUTUN o'nlik. Bosiladigan nishon EMAS (amal plitkalarida tanlanadi).
const Crate = ({ w = 38 }) => {
  const uid = 'pq2810c' + (__gid++);
  const h = w * 96 / 88;
  const ap = (x, y, s) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,-9 Q0.6,-13 3,-14.5" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1,-10 Q6.5,-14.5 10.5,-10 Q5.5,-6.8 1,-10 Z" fill="#57ad55" stroke="#3f8a41" strokeWidth=".6" />
      <path d="M0,-8 C-6,-8 -11,-4 -11,3 C-11,10.4 -6,14 -3,14 C-1,14 -0.5,12.5 0,12.5 C0.5,12.5 1,14 3,14 C6,14 11,10.4 11,3 C11,-4 6,-8 0,-8 Z" fill={`url(#${uid}a)`} stroke="#a3241f" strokeWidth=".8" />
      <ellipse cx="-4.6" cy="-1.4" rx="2.6" ry="3.6" fill="#fff" opacity=".4" />
    </g>
  );
  return (
    <svg viewBox="0 0 88 96" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={uid + 'a'} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ff8f7a" /><stop offset="45%" stopColor="#ec4d3d" /><stop offset="100%" stopColor="#b62a24" />
        </radialGradient>
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2a659" /><stop offset="100%" stopColor="#a2662a" />
        </linearGradient>
      </defs>
      {ap(30, 42, 1)}
      {ap(60, 42, 1)}
      {ap(45, 34, 1.16)}
      <path d="M14,54 L74,54 L66,92 L22,92 Z" fill={`url(#${uid}w)`} stroke="#7c4f21" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="30" y1="56" x2="33" y2="91" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <line x1="44" y1="56" x2="44" y2="92" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <line x1="58" y1="56" x2="55" y2="91" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <path d="M17,62 Q44,67 71,62" fill="none" stroke="#b9803c" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M18.5,72 Q44,77 69.5,72" fill="none" stroke="#cd9046" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M20,82 Q44,87 68,82" fill="none" stroke="#b9803c" strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="44" cy="54" rx="31" ry="7" fill="#d29a4e" stroke="#7c4f21" strokeWidth="1.6" />
      <ellipse cx="44" cy="54" rx="23" ry="4.2" fill="#8a5a26" opacity=".32" />
      <g>
        <circle cx="44" cy="74" r="11" fill="#2e7d46" stroke="#1f5e33" strokeWidth="1.4" />
        <text x="44" y="78.4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
      </g>
    </svg>
  );
};

// YAKKA OLMA (bitta birlik) — Dars21 dan uzviy: yumaloq tana, bandak, barg, oq blik.
const Apple = ({ w = 22 }) => {
  const id = 'pq2810a' + (__gid++);
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

// Bir guruh: o'nlik savatlar + yakka olmalar + son yorlig'i. Bosiladigan nishon EMAS (dekor model).
const Group = ({ tens, units, val, idle }) => (
  <div className="pq-group">
    <div className="pq-stack">
      <div className="pq-crates">
        {tens.map((i) => (
          <span key={'c' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.1}s` }}><Crate w={38} /></span>
        ))}
      </div>
      <div className="pq-apples">
        {units.map((i) => (
          <span key={'u' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(tens.length + i) * 0.1}s` }}><Apple w={22} /></span>
        ))}
      </div>
    </div>
    <span className="pq-pill">{val}</span>
  </div>
);

export default function D28_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [op, setOp] = useState(null);          // null | '+' | '−'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda birlashish/sanoq animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = op === PLUS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [PLUS, MINUS], studentAnswer: { op }, correctAnswer: { op: PLUS, value: TARGET }, correct, meta: { ...DATA } });
  }, [op, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (savat/olma bosiladigan nishon EMAS — dekor)
  const enDelay = (i) => still ? 0 : i * 0.22;         // savatlar/olmalar ketma-ket "yonadi"
  const cnDelay = (i) => still ? 0 : 0.25 + i * 0.28;  // o'nlik sanoq nishonchalari ketma-ket

  const pick = (v) => { if (lock) return; setOp(v); setFeedback(null); };

  return (
    <div className="pq pq2810">
      <style>{`
        .pq2810{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2810 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0392b;text-transform:uppercase;}
        .pq2810 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2810 .pq-setup{color:#5c6672;font-weight:700;font-variant-numeric:tabular-nums;}
        .pq2810 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2810 .pq-scene{position:relative;width:380px;max-width:100%;height:230px;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2810 .pq-sun{position:absolute;right:18px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2810sun 3.6s ease-in-out infinite;}
        .pq2810 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.8;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2810sway 4.4s ease-in-out infinite;}
        .pq2810 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2810 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2810 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2810 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        .pq2810 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:28px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2810 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq2810 .pq-stack{display:flex;flex-direction:column;align-items:center;gap:4px;}
        .pq2810 .pq-crates{display:flex;justify-content:center;flex-wrap:wrap;gap:3px;max-width:150px;}
        .pq2810 .pq-apples{display:flex;justify-content:center;flex-wrap:wrap;gap:3px;max-width:150px;}
        .pq2810 .pq-obj{position:relative;line-height:0;}
        .pq2810 .pq-obj.idle{animation:pq2810bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2810 .pq-pill{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #e0b3ad;color:#c0392b;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.12);}
        /* tanlangan amal — sahna o'rtasidagi slot (bosiladigan nishon EMAS, tanlov plitkalarda) */
        .pq2810 .pq-slot{flex:0 0 auto;align-self:center;min-width:38px;height:44px;padding:0 6px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:2.5px dashed #b7d8bd;background:rgba(255,255,255,.72);color:#5c6672;font-size:26px;font-weight:900;pointer-events:none;}
        .pq2810 .pq-slot.set{border-style:solid;border-color:#2563eb;color:#2563eb;background:#eaf0fd;}
        .pq2810 .pq-slot .qm{color:#9aa5b1;font-size:22px;}

        /* birlashgan qator — savatlar bir joyda, o'nliklab sanaladi; keyin yakka olmalar */
        .pq2810 .pq-merged{display:flex;align-items:flex-end;justify-content:center;gap:8px;flex-wrap:wrap;animation:pq2810in .3s ease both;}
        .pq2810 .pq-mrow{display:flex;align-items:flex-end;gap:3px;}
        .pq2810 .pq-mobj{position:relative;line-height:0;animation:pq2810flow .4s ease both;animation-delay:var(--en,0s);}
        .pq2810 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:22px;height:20px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;animation:pq2810pop .32s both;animation-delay:var(--cd,0s);}
        .pq2810 .pq-cnt.fin{animation:pq2810fin .5s ease both;}

        .pq2810 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2810tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2810 .pq-spark.s2{animation-delay:-.6s;} .pq2810 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2810 .pq-ops{display:flex;gap:14px;justify-content:center;margin-top:16px;}
        .pq2810 .pq-op{width:78px;height:78px;font-size:38px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq2810 .pq-op:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2810 .pq-op:active:not(:disabled){transform:scale(.94);}
        .pq2810 .pq-op.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2810 .pq-op.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2810cele .5s ease;}
        .pq2810 .pq-op:disabled{cursor:default;opacity:.55;}
        .pq2810 .pq-op.sel:disabled,.pq2810 .pq-op.right:disabled{opacity:1;}

        .pq2810 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2810in .3s ease both;}
        .pq2810 .pq-eq b{min-width:44px;height:40px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2810 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2810 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2810 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2810in .3s .1s both;}

        .pq2810 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2810in .22s ease both;}
        .pq2810 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2810 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2810bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2810sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2810sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2810flow{from{opacity:0;transform:translateY(6px) scale(.82);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2810pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2810fin{0%{transform:translateX(-50%) scale(.4);}55%{transform:translateX(-50%) scale(1.25);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pq2810tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2810cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2810in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ left: '16px', top: '30px' }}>❧</span>
        <span className="pq-leaf l2" style={{ right: '18px', bottom: '40px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {!ok ? (<>
            {/* 34 = 3 savat + 4 yakka olma */}
            <Group tens={GA_T} units={GA_U} val={A_VAL} idle={idle} />
            {/* o'rtadagi amal sloti — tanlangan amal ko'rinadi (natija ochilmaydi) */}
            <div className={'pq-slot' + (op !== null ? ' set' : '')}>{op !== null ? op : <span className="qm">?</span>}</div>
            {/* 25 = 2 savat + 5 yakka olma */}
            <Group tens={GB_T} units={GB_U} val={B_VAL} idle={idle} />
          </>) : (
            /* G'alaba: razryad bo'yicha birlashadi — 5 savat (o'nliklab 10..50), so'ng 9 yakka olma */
            <div className="pq-merged">
              <div className="pq-mrow">
                {MERGED_T.map((i) => (
                  <span key={'mt' + i} className="pq-mobj" style={{ '--en': `${enDelay(i)}s` }}>
                    <Crate w={38} />
                    <span className={'pq-cnt' + (i === M_TENS - 1 ? ' fin' : '')} style={{ '--cd': `${cnDelay(i)}s` }}>{(i + 1) * 10}</span>
                  </span>
                ))}
              </div>
              <div className="pq-mrow">
                {MERGED_U.map((i) => (
                  <span key={'mu' + i} className="pq-mobj" style={{ '--en': `${enDelay(M_TENS + i)}s` }}><Apple w={22} /></span>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* Amal plitkalari: «+» birlashtirish (to'g'ri), «−» ayirish (M1 xato amal — funksional qoladi) */}
      <div className="pq-ops">
        {[PLUS, MINUS].map((v) => {
          const sel = op === v; const right = ok && v === PLUS;
          return <button key={v} type="button" className={'pq-op' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick(v)}>{v}</button>;
        })}
      </div>

      {/* G'alaba: razryad bo'yicha qo'shildi — 34 + 25 = 59 (javob faqat shu yerda ochiladi) */}
      {ok && (<>
        <div className="pq-eq"><b>{A_VAL}</b><i>{PLUS}</i><b>{B_VAL}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{M_TENS} {t.tword} {PLUS} {M_UNITS} {t.uword} = {TARGET}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
