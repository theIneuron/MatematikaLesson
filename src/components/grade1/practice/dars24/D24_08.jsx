// Dars24 · Amaliyot 08 — Ko'p-tanlov «Javobi 50» · 🔴 · tag: round_multi
// Olma bog'i: 5 ifoda-karta. Javobi aynan 50 bo'lganlarni BARCHASINI belgilang.
// [0] "20 + 30" = 50 ✓   [1] "40 + 30" = 70 ✗ tuzoq   [2] "90 − 40" = 50 ✓
// [3] "80 − 20" = 60 ✗ tuzoq   [4] "10 + 40" = 50 ✓ . GOOD = {0,2,4}.
// KANON: bir o'nlik = bitta olma SAVATI (10 olma, "10" nishoncha). Yumaloq o'nliklarni
// o'nliklab sanaymiz: 2 o'nlik + 3 o'nlik = 5 o'nlik = 50. Ustun YO'Q, razryaddan o'tish YO'Q.
// Barcha son yumaloq o'nlik, 0-100. AYIRISH belgisi = U+2212 «−». VEDI-DO-VERNOGO: noto'g'rida
// qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida. Javob (50) faqat g'alabada ochiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const TARGET = 50;
// Har karta: a op b ifoda (op = "+" yoki U+2212 minus).
const CARDS = [
  { a: 20, op: "+", b: 30 }, // 20 + 30 = 50 ✓
  { a: 40, op: "+", b: 30 }, // 40 + 30 = 70 ✗ tuzoq
  { a: 90, op: "−", b: 40 }, // 90 − 40 = 50 ✓
  { a: 80, op: "−", b: 20 }, // 80 − 20 = 60 ✗ tuzoq
  { a: 10, op: "+", b: 40 }, // 10 + 40 = 50 ✓
];
const cardVal = (c) => (c.op === "+" ? c.a + c.b : c.a - c.b);
const cardLabel = (c) => `${c.a} ${c.op} ${c.b}`;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,2,4]
const DATA = { good: GOOD, target: TARGET, level: "🔴", tag: "round_multi" };

// Olma navlari — kartalarga xilma-xillik uchun (bezak, bosiladigan nishon EMAS).
const APAL = [
  ["#f2a49c", "#df5b52", "#b83b33"], // qizil
  ["#ffd98a", "#f4b942", "#d18f1c"], // sariq
  ["#a8d88a", "#6fb04a", "#4d8a34"], // yashil
  ["#f4a9c4", "#e06a9a", "#c0477a"], // pushti
  ["#f2a49c", "#df5b52", "#b83b33"], // qizil
];

const T = {
  uz: {
    eyebrow: "Olma bog'i · O'nliklar",
    title: "Javobi 50",
    setup: "Misollarga qarang.",
    ask: "Javobi 50 bo'lgan BARCHA misolni bosing.",
    correct: "Barakalla! 20+30, 90−40, 10+40 — hammasi 50.",
    hint: "Har misolni o'nliklab sanang.",
    goal: "Maqsad",
  },
  ru: {
    eyebrow: "Яблоневый сад · Десятки",
    title: "Ответ 50",
    setup: "Посмотри на примеры.",
    ask: "Нажми ВСЕ примеры с ответом 50.",
    correct: "Молодец! 20+30, 90−40, 10+40 — все дают 50.",
    hint: "Считай каждый пример десятками.",
    goal: "Цель",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

let __gid = 0;

// YAKKA OLMA (karta bezagi): yumaloq tana — radial 2-ton, bandak, barg, oq blik.
const Apple = ({ g = APAL[0], w = 28 }) => {
  const id = "pq2408a" + (__gid++);
  const h = (w * 26) / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={g[0]} /><stop offset="55%" stopColor={g[1]} /><stop offset="100%" stopColor={g[2]} />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// SAVAT (bitta o'nlik = 10 olma bir birlikka jamlangan): to'qilgan savat, ustidan olmalar mo'ralaydi,
// oldida yashil "10" nishoni. Bola savat ichini QAYTA sanamaydi — savat = bitta o'nlik.
const Crate = ({ w = 34 }) => {
  const uid = "pq2408c" + (__gid++);
  const h = (w * 96) / 88;
  const ap = (x, y, s) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,-9 Q0.6,-13 3,-14.5" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1,-10 Q6.5,-14.5 10.5,-10 Q5.5,-6.8 1,-10 Z" fill="#57ad55" stroke="#3f8a41" strokeWidth=".6" />
      <path d="M0,-8 C-6,-8 -11,-4 -11,3 C-11,10.4 -6,14 -3,14 C-1,14 -0.5,12.5 0,12.5 C0.5,12.5 1,14 3,14 C6,14 11,10.4 11,3 C11,-4 6,-8 0,-8 Z" fill={`url(#${uid}a)`} stroke="#a3241f" strokeWidth=".8" />
      <ellipse cx="-4.6" cy="-1.4" rx="2.6" ry="3.6" fill="#fff" opacity=".4" />
    </g>
  );
  return (
    <svg viewBox="0 0 88 96" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={uid + "a"} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ff8f7a" /><stop offset="45%" stopColor="#ec4d3d" /><stop offset="100%" stopColor="#b62a24" />
        </radialGradient>
        <linearGradient id={uid + "w"} x1="0" y1="0" x2="0" y2="1">
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

const TARGET_CRATES = Array.from({ length: TARGET / 10 }).map((_, i) => i); // 5 savat = 50

export default function D24_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda ambient jonlanish saqlanadi, sahna yakuniy holatdan boshlanadi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(cardLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // sahna savatlari yengil tebranadi (bosiladigan nishon EMAS — dekor)
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq2408" ref={fitRef}>
      <style>{`
        .pq2408{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2408 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2408 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2408 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2408 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2408 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:176px;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2408 .pq-fit{position:relative;margin:0 auto;}
        .pq2408 .pq-sun{position:absolute;right:20px;top:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2408sun 3.6s ease-in-out infinite;}
        .pq2408 .pq-tree{position:absolute;bottom:44px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2408 .pq-tree.t1{left:6px;animation:pq2408sway 4.2s ease-in-out infinite;}
        .pq2408 .pq-tree.t2{right:8px;bottom:48px;animation:pq2408sway 4.8s ease-in-out .6s infinite;}
        .pq2408 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:8px;height:24px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2408 .pq-crown{width:52px;height:42px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2408 .pq-crown i{position:absolute;width:9px;height:9px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2408 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#8a5a2c,#6d4420);border:2.5px solid #59340f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.22);pointer-events:none;font-variant-numeric:tabular-nums;}
        .pq2408 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2408 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        /* Maqsad: 5 savat = 50 (o'nliklar modeli — bu javob EMAS, bu qidiruv nishoni) */
        .pq2408 .pq-target{position:absolute;left:0;right:0;bottom:26px;z-index:3;display:flex;align-items:flex-end;justify-content:center;gap:2px;}
        .pq2408 .pq-tcrate{position:relative;flex:0 0 auto;}
        .pq2408 .pq-tcrate.idle{animation:pq2408bob 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq2408 .pq-tsum{align-self:center;margin-left:6px;display:flex;align-items:center;gap:5px;}
        .pq2408 .pq-tsum i{font-style:normal;font-size:20px;font-weight:900;color:#5c6672;}
        .pq2408 .pq-tval{min-width:40px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(0,0,0,.14);}

        .pq2408 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2408tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2408 .pq-spark.s2{animation-delay:-.6s;} .pq2408 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2408 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;margin-top:16px;}
        .pq2408 .pq-card{position:relative;min-width:132px;display:flex;flex-direction:column;align-items:center;gap:7px;padding:13px 14px 12px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,120,90,.12);font-family:inherit;}
        .pq2408 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,120,90,.2);}
        .pq2408 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2408 .pq-card:disabled{cursor:default;}
        .pq2408 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2408 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2408cele .55s ease;}
        .pq2408 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq2408 .pq-carow{display:flex;align-items:center;justify-content:center;min-height:30px;}
        .pq2408 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2408 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2408 .pq-eq{color:#1a7f43;font-size:20px;font-weight:900;animation:pq2408pop .4s ease both;}
        .pq2408 .pq-cspark{position:absolute;top:7px;right:9px;line-height:0;animation:pq2408tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2408 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2408in .22s ease both;}
        .pq2408 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2408 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2408bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2408sun{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pq2408sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2408pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2408tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2408cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2408in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 380 * scale, height: 176 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '14px', top: '15px' }} /><i style={{ left: '32px', top: '9px' }} /><i style={{ left: '24px', top: '26px' }} /></span><span className="pq-trunk" /></div>
        <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '11px', top: '11px' }} /><i style={{ left: '30px', top: '20px' }} /></span><span className="pq-trunk" /></div>
        <div className="pq-board">{t.goal}: {TARGET}</div>

        {/* Maqsad: 5 to'la savat = 50. Bu qidirilayotgan son (javob emas — nishon). */}
        <div className="pq-target">
          {TARGET_CRATES.map((i) => (
            <span key={i} className={'pq-tcrate' + (idle ? ' idle' : '')} style={{ '--d': `${i * 0.12}s` }}>
              <Crate w={34} />
            </span>
          ))}
          <span className="pq-tsum"><i>=</i><span className="pq-tval">{TARGET}</span></span>
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '30px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '44px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '24px' }}>✦</span>
        </>)}
      </div>
      </div>

      <div className="pq-cards">
        {CARDS.map((c, i) => {
          const good = cardVal(c) === TARGET;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
          const g = APAL[i % APAL.length];
          return (
            <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
              onClick={() => toggle(i)} aria-label={cardLabel(c)}>
              <div className="pq-carow"><Apple g={g} w={30} /></div>
              <div className="pq-clabel">
                <span>{cardLabel(c)}</span>
                {ok && good && <b className="pq-eq">= {TARGET}</b>}
              </div>
              {ok && good && <span className="pq-cspark"><Star fill="#f2b134" /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
