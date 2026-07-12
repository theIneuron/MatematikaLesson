// Dars21 · Amaliyot 02 — Razryad «Olma bog'i» · 🟡 · tag: tens_count
// Bitta-tanlov: bog'da 4 to'la savat (har savat = 1 o'nlik = 10 olma) = 40 olma.
// Savol: "40 da nechta o'nlik bor?" → 4. Bola savat ichidagi olmalarni qayta sanamaydi —
// savat bitta BUTUN o'nlik. G'alabada har savat ustida sanoq nishonchasi (1..2..3..4) paydo
// bo'ladi, so'ng tenglama: 10 + 10 + 10 + 10 = 40 (o'nliklar QO'SHILIB 40 beradi, ayirish YO'Q).
// Chalg'ituvchilar: 40 (o'nlik sonini qiymat bilan chalkashtirish), 14 (raqamlarni yopishtirish).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TENS = 4;                 // javob: nechta o'nlik
const TOTAL = 40;               // savatlardagi jami olma
const TARGET = TENS;
const DATA = { total: TOTAL, tens: TENS, options: [4, 40, 14], answer: TARGET, level: '🟡', tag: 'tens_count' };
const BASKETS = Array.from({ length: TENS }).map((_, i) => i);

const T = {
  uz: {
    eyebrow: "Olma bog'i · O'nliklar", title: "Nechta o'nlik?",
    setup: "Savatlarga jami 40 ta olma terildi, har savatda 10 tadan.",
    ask: "40 sonida nechta o'nlik bor?",
    correct: "Barakalla! 40 — bu 4 o'nlik. Har savat bitta o'nlik.",
    hint: "Savatlarni sanang — har biri bitta o'nlik.",
    tword: "o'nlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Десятки", title: "Сколько десятков?",
    setup: "В корзины собрали 40 яблок, по 10 в каждой.",
    ask: "Сколько десятков в числе 40?",
    correct: "Молодец! 40 — это 4 десятка. Каждая корзина — десяток.",
    hint: "Сосчитай корзины — каждая это десяток.",
    tword: "десятка",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KANON: bir o'nlik = bitta OLMA SAVATI (10 olmani jamlaydi, ustida "10" nishoncha). Bola savat
// ichini qayta sanamaydi. Bitta bo'sh olma = bitta birlik (bu topshiriqda birlik yo'q — 40 juft son).
// Olma: yumaloq tana (2-ton radial) + bandi + barg + oq blik. Savat: to'qilgan yoylar + olmalar.
let __gid = 0;
const Basket = ({ w = 60 }) => {
  const uid = 'pq2102b' + (__gid++);
  const h = w * 96 / 88;
  // savat ichidagi olma (bandi hidden by rim): translate + scale bilan joylashadi
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
          <stop offset="0%" stopColor="#ff8f7a" />
          <stop offset="45%" stopColor="#ec4d3d" />
          <stop offset="100%" stopColor="#b62a24" />
        </radialGradient>
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2a659" />
          <stop offset="100%" stopColor="#a2662a" />
        </linearGradient>
      </defs>
      {/* olmalar savatdan chiqib turibdi (pastki qismi jiyak ostida yashiringan) */}
      {ap(30, 42, 1)}
      {ap(60, 42, 1)}
      {ap(45, 34, 1.16)}
      {/* savat tanasi — trapetsiya */}
      <path d="M14,54 L74,54 L66,92 L22,92 Z" fill={`url(#${uid}w)`} stroke="#7c4f21" strokeWidth="1.6" strokeLinejoin="round" />
      {/* vertikal to'qima novdalari */}
      <line x1="30" y1="56" x2="33" y2="91" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <line x1="44" y1="56" x2="44" y2="92" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <line x1="58" y1="56" x2="55" y2="91" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      {/* gorizontal to'qima lentalari (pastga egilgan) */}
      <path d="M17,62 Q44,67 71,62" fill="none" stroke="#b9803c" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M18.5,72 Q44,77 69.5,72" fill="none" stroke="#cd9046" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M20,82 Q44,87 68,82" fill="none" stroke="#b9803c" strokeWidth="3.2" strokeLinecap="round" />
      {/* jiyak */}
      <ellipse cx="44" cy="54" rx="31" ry="7" fill="#d29a4e" stroke="#7c4f21" strokeWidth="1.6" />
      <ellipse cx="44" cy="54" rx="23" ry="4.2" fill="#8a5a26" opacity=".32" />
      {/* "10" nishoncha — bu savat bitta o'nlik */}
      <g>
        <circle cx="44" cy="74" r="11" fill="#2e7d46" stroke="#1f5e33" strokeWidth="1.4" />
        <text x="44" y="78.4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
      </g>
    </svg>
  );
};

export default function D21_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sanoq animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (savat bosiladigan nishon EMAS)
  const badgeDelay = (i) => still ? 0 : 0.2 + i * 0.24; // sanoq nishonchalari ketma-ket

  return (
    <div className="pq pq2102">
      <style>{`
        .pq2102{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2102 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2102 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2102 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2102 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2102 .pq-scene{position:relative;width:380px;max-width:100%;height:246px;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2102 .pq-sun{position:absolute;right:20px;top:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2102sun 3.6s ease-in-out infinite;}
        /* fon daraxtlari — tebranadigan shox-barg */
        .pq2102 .pq-tree{position:absolute;bottom:52px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2102 .pq-tree.t1{left:6px;animation:pq2102sway 4.2s ease-in-out infinite;}
        .pq2102 .pq-tree.t2{right:8px;bottom:56px;animation:pq2102sway 4.8s ease-in-out .6s infinite;}
        .pq2102 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:8px;height:26px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2102 .pq-crown{width:56px;height:46px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2102 .pq-crown i{position:absolute;width:9px;height:9px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* yog'och taxta — sarlavha */
        .pq2102 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#8a5a2c,#6d4420);border:2.5px solid #59340f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.22);pointer-events:none;}
        /* o't — pastki chiziq */
        .pq2102 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;}
        .pq2102 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        .pq2102 .pq-arena{position:absolute;left:8px;right:8px;bottom:26px;top:44px;display:flex;align-items:flex-end;justify-content:center;gap:7px;z-index:3;}
        .pq2102 .pq-basket{position:relative;flex:0 0 auto;}
        .pq2102 .pq-basket.idle{animation:pq2102bob 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq2102 .pq-basket.win{animation:pq2102win .5s ease;animation-delay:var(--d,0s);}
        /* sanoq nishonchasi — savat ustida (bezak, bosilmaydi) */
        .pq2102 .pq-cnt{position:absolute;top:-10px;left:50%;transform:translateX(-50%);min-width:20px;height:20px;padding:0 3px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);animation:pq2102pop .34s both;animation-delay:var(--bd,0s);font-variant-numeric:tabular-nums;}

        .pq2102 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2102tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2102 .pq-spark.s2{animation-delay:-.6s;} .pq2102 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2102 .pq-eq{display:flex;justify-content:center;align-items:center;gap:5px;margin-top:14px;flex-wrap:wrap;animation:pq2102in .3s ease both;}
        .pq2102 .pq-eq b{min-width:34px;height:38px;padding:0 4px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2102 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2102 .pq-eq i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}
        .pq2102 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2102in .3s .1s both;}

        .pq2102 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2102 .pq-opt{min-width:72px;height:72px;padding:0 8px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2102 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2102 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2102 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2102 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2102cele .5s ease;}
        .pq2102 .pq-opt:disabled{cursor:default;}
        .pq2102 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2102in .22s ease both;}
        .pq2102 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2102 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2102bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2102win{0%{transform:scale(1);}30%{transform:scale(1.05) translateY(-2px);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2102sun{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pq2102sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2102pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2102tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2102cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2102in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '14px', top: '16px' }} /><i style={{ left: '34px', top: '10px' }} /><i style={{ left: '26px', top: '28px' }} /></span><span className="pq-trunk" /></div>
        <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '12px', top: '12px' }} /><i style={{ left: '32px', top: '22px' }} /></span><span className="pq-trunk" /></div>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {BASKETS.map((i) => (
            <div key={i} className={'pq-basket' + (idle ? ' idle' : '') + (ok && !still ? ' win' : '')} style={{ '--d': `${i * 0.12}s` }}>
              <Basket w={60} />
              {ok && <span className="pq-cnt" style={{ '--bd': `${badgeDelay(i)}s` }}>{i + 1}</span>}
            </div>
          ))}
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '78%', top: '64px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: o'nliklar QO'SHILIB 40 beradi (ayirish YO'Q) */}
      {ok && (<>
        <div className="pq-eq"><b>10</b><i>+</i><b>10</b><i>+</i><b>10</b><i>+</i><b>10</b><i>=</i><b className="res">{TOTAL}</b></div>
        <div className="pq-sub">{TENS} {t.tword} = {TOTAL}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
