// Dars29 · Amaliyot 09 — Qoldiqqa masala «Savatda 48 olma edi, 15 sotildi» · 🔴 · tag: remainder
// TABIAT SAHNASI (Dars15/27 etaloni): jonli quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar. Taxtachada hikoya sonlari (g'alabagacha amal belgisi YO'Q). Razryad modeli: SAVAT =
// o'nlik («10» nishonli), yakka OLMA = birlik; YECHISHGACHA barcha 48 bir xil (javob-sizish yo'q).
// G'alabada 15 tasi (1 savat + 5 olma) chiqib ketadi, taxtada «48 − 15 = 33» ochiladi va QUYONCHA
// son o'qida 48 dan ORQAGA sakraydi: avval O'NLIK (−10 → 38), keyin BIRLIKLAB (−1×5 → 33).
// Variantlar [63, 33, 30]: 63 = noto'g'ri amal (48+15), 30 = faqat o'nlik (birlik unutildi).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
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

const A = 48, S = 15, R = 33;                  // 48 − 15 = 33 (o'tishsiz, <= 99)
const TA = 4, UA = 8;                          // 48 razryadi: 4 o'nlik (savat) + 8 birlik (olma)
const TS = 1, US = 5;                          // sotilgan 15: 1 savat + 5 olma
const TR = 3, UR = 3;                          // qoldiq 33: 3 savat + 3 olma
const MINUS = "−";                             // U+2212, ASCII defis EMAS
const OPT = [63, R, 30];                       // 63 = 48+15 (M1 amal), 30 = faqat o'nlik (M2)
const TARGET = R;
const DATA = { a: A, sub: S, rem: R, options: OPT, answer: R, level: "🔴", tag: "remainder" };
const HOP_PATH = [48, 38, 37, 36, 35, 34, 33]; // avval o'nlik, keyin birliklar
const NL_FROM = 30, NL_TO = 50;
const TICKS = [30, 40, 50];

const T = {
  uz: {
    eyebrow: "Olma savati · Masala",
    setup: "Savatda 48 ta olma bor edi. 15 tasi sotildi.",
    ask: "Nechta olma qoldi?",
    was: "bor edi", sold: "sotildi",
    correct: "Barakalla! Sotildi — ayiramiz. 48 − 15 = 33.",
    hint: "Sotildi — kamaydi. 48 dan 15 ni ayiring: avval o'nlik, keyin birliklar.",
    tw: "o'nlik", uw: "birlik",
  },
  ru: {
    eyebrow: "Корзина яблок · Задача",
    setup: "В корзине было 48 яблок. 15 яблок продали.",
    ask: "Сколько яблок осталось?",
    was: "было", sold: "продали",
    correct: "Молодец! Продали — вычитаем. 48 − 15 = 33.",
    hint: "Продали — стало меньше. Из 48 вычтите 15: сначала десяток, потом единицы.",
    tw: "дес.", uw: "ед.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// Uzoqdagi qush (osmonda) — Dars15 etaloni.
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
// O't tutami (maysada).
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
// Qo'ziqorin.
const Mushroom = ({ cls }) => (
  <svg className={'pq-mush ' + cls} viewBox="0 0 18 17" width="16" height="15" aria-hidden="true">
    <rect x="6.4" y="8" width="5.2" height="8" rx="2.2" fill="#f4ecd8" stroke="#dccfa8" strokeWidth=".7" />
    <path d="M1.5 8.5 C1.5 3.5 5 1 9 1 C13 1 16.5 3.5 16.5 8.5 Z" fill="#e0584c" stroke="#bf4136" strokeWidth=".8" />
    <circle cx="5.5" cy="6" r="1.1" fill="#fff" /><circle cx="10.5" cy="4.6" r="1.3" fill="#fff" /><circle cx="12.6" cy="7" r="1" fill="#fff" />
  </svg>
);

// QUYONCHA (kurs maskoti, Dars15 etaloni).
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="44" height="40.6" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="bfur2909" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" /></linearGradient>
      <linearGradient id="bhead2909" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" /></linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur2909)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead2909)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead2909)" stroke="#a8977f" strokeWidth="1" />
    <path d="M36.4 17 C34 7.5 36.2 3.6 37.6 3.8 C39 4 39.4 9.5 38.8 17 Z" fill="#f3bccb" />
    <ellipse cx="41" cy="29" rx="4.5" ry="3" fill="#d3c0a6" opacity=".55" />
    <ellipse cx="41.6" cy="23.4" rx="2.1" ry="2.4" fill="#3a322c" />
    <circle cx="42.4" cy="22.5" r="0.8" fill="#fff" />
    <path d="M47.6 26.4 L45.4 25.3 L45.4 27.5 Z" fill="#e08aa0" />
    <path d="M46.4 27.3 Q46.4 29 45 29" fill="none" stroke="#a8977f" strokeWidth="0.8" strokeLinecap="round" />
    <g stroke="#c9b79c" strokeWidth="0.7" strokeLinecap="round">
      <line x1="46" y1="26" x2="52" y2="24.5" /><line x1="46" y1="27" x2="52" y2="27" /><line x1="46" y1="28" x2="51.5" y2="29.5" />
    </g>
    <ellipse cx="34.5" cy="42" rx="5" ry="3" fill="#d3c0a6" stroke="#ac9678" strokeWidth="1" />
  </svg>
);

// YAKKA OLMA (bitta birlik). (Dars 21 kanoni)
const Apple = ({ w = 24 }) => {
  const id = "pq2909a" + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10»
// nishoni. Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi. (Dars 21 kanoni)
const Basket = ({ w = 38 }) => {
  const id = "pq2909b" + (__gid++);
  const ap = id + "ap";
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// Razryad to'plami: qoldiq (keep) + sotilgan (leave) qism. YECHISHGACHA barcha 48 bir xil ko'rinadi
// (javob-sizish yo'q); FAQAT g'alabada 15 tasi "out" bilan chiqib ketadi.
const Pile = ({ phase }) => {
  // phase: "before" (48 — hammasi bir xil) | "out" (15 chiqmoqda) | "still" (faqat 33)
  const idle = phase === "before";
  const leaveCls = phase === "out" ? "pq-obj leave out" : phase === "still" ? "pq-obj leave hidden" : ("pq-obj" + (idle ? " idle" : ""));
  return (
    <div className="pq-num">
      <div className="pq-tens">
        {Array.from({ length: TR }).map((_, i) => (
          <span key={"kt" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.1}s` }}><Basket w={31} /></span>
        ))}
        {Array.from({ length: TS }).map((_, i) => (
          <span key={"lt" + i} className={leaveCls} style={{ "--bd": `${(TR + i) * 0.1}s` }}><Basket w={31} /></span>
        ))}
      </div>
      <div className="pq-units">
        {Array.from({ length: UR }).map((_, i) => (
          <span key={"ku" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(TA + i) * 0.1}s` }}><Apple w={19} /></span>
        ))}
        {Array.from({ length: US }).map((_, i) => (
          <span key={"lu" + i} className={leaveCls} style={{ "--bd": `${(TA + UR + i) * 0.1}s` }}><Apple w={19} /></span>
        ))}
      </div>
    </div>
  );
};

// SON O'QI (Dars27 etaloni): razryad bo'yicha orqaga sakrash — o'nlik katta yoy, birlik kichik.
const NumberLineHop = ({ from = 0, to = 100, ticks = [], path = [], active = false, still = false, dir = 1 }) => {
  const span = to - from;
  const pct = (n) => ((n - from) / span) * 100;
  const [idx, setIdx] = useState(-1);
  const startN = path[0]; const finalN = path[path.length - 1];

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(path.length - 1); return; }
    const timers = []; let acc = 450;
    path.forEach((_, k) => {
      if (k > 0) acc += (Math.abs(path[k] - path[k - 1]) >= 10 ? 1150 : 950);
      timers.push(setTimeout(() => setIdx(k), acc));
    });
    return () => timers.forEach(clearTimeout);
  }, [active, still]); // eslint-disable-line

  const started = idx >= 0;
  const bunnyN = started ? path[idx] : startN;
  const arrived = still || idx >= path.length - 1;
  const arc = (started && idx > 0 && Math.abs(path[idx] - path[idx - 1]) >= 10) ? '-46px' : '-18px';
  const fillLeft = dir > 0 ? pct(startN) : pct(bunnyN);
  const fillWidth = dir > 0 ? (pct(bunnyN) - pct(startN)) : (pct(startN) - pct(bunnyN));

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        <div className="pq-nl-fill" style={{ left: `${fillLeft}%`, width: `${active && started ? fillWidth : 0}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      <div className="pq-startmk" style={{ left: `${pct(startN)}%` }}><span className="pq-startdot" /><span className="pq-startlbl">{startN}</span></div>
      {path.slice(1, -1).map((n, k) => ((active && (still || idx >= k + 1)) ? <span key={n} className="pq-trail" style={{ left: `${pct(n)}%` }} /> : null))}
      {active && arrived && (
        <div className="pq-endmk" style={{ left: `${pct(finalN)}%` }}>
          <span className="pq-enddot" /><span className="pq-endlbl">{finalN}</span><span className="pq-endspark">✦</span>
        </div>
      )}
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyN)}%` }}>
        <span className="pq-val">{bunnyN}</span>
        <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))} style={{ '--arc': arc }}>
          <span className={dir < 0 ? 'pq-bflip' : ''}><Bunny /></span>
        </span>
      </div>
      <div className="pq-nl-nodes">
        {ticks.map((n) => (
          <div key={n} className="pq-nl-node" style={{ left: `${pct(n)}%` }}>
            <span className="pq-nl-dot" /><span className="pq-nl-lbl">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function D29_09(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqib-ketish/sakrash qayta ijro etilmaydi — statik 33.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer && initialAnswer.correct));
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPT.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const phase = ok ? (still ? "still" : "out") : "before";
  const [fitRef, scale] = useFitScale(420);

  return (
    <div className="pq pq2909">
      <style>{`
        .pq2909{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2909 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq2909 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2909 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:14px;}
        /* ===== TABIAT SAHNASI (Dars15 etaloni) ===== */
        .pq2909 .pq-scene{box-sizing:border-box;position:relative;width:420px;height:356px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq2909 .pq-fit{position:relative;margin:0 auto;}
        .pq2909 .pq-sun{position:absolute;top:16px;left:20px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq2909Sun 4s ease-in-out infinite;z-index:1;}
        .pq2909 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq2909 .pq-cloud::before,.pq2909 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2909 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq2909 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq2909 .pq-cloud.c1{top:32px;left:60%;width:46px;animation:pq2909Drift 14s ease-in-out infinite;}
        .pq2909 .pq-cloud.c2{top:64px;left:32%;width:34px;transform:scale(.8);animation:pq2909Drift 18s ease-in-out infinite reverse;}
        .pq2909 .pq-cloud.c3{top:16px;left:40%;width:30px;transform:scale(.72);animation:pq2909Drift 16s ease-in-out infinite;}
        .pq2909 .pq-hills{position:absolute;left:0;right:0;bottom:110px;height:70px;z-index:1;}
        .pq2909 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2909 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2909 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq2909 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq2909 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:118px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq2909 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2909 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq2909 .pq-flower.f1{left:16%;bottom:92px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq2909 .pq-flower.f2{right:22%;bottom:84px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq2909 .pq-flower.f3{left:7%;bottom:86px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq2909 .pq-flower.f4{left:90%;bottom:88px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq2909 .pq-tuft{position:absolute;z-index:3;}
        .pq2909 .pq-tuft.t1{left:24%;bottom:80px;} .pq2909 .pq-tuft.t2{left:60%;bottom:84px;transform:scale(.85);}
        .pq2909 .pq-mush{position:absolute;z-index:3;left:54px;bottom:80px;}
        .pq2909 .pq-tree{position:absolute;left:8px;bottom:102px;width:46px;height:56px;z-index:2;}
        .pq2909 .pq-tree i{position:absolute;}
        .pq2909 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq2909 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq2909 .pq-bush{position:absolute;right:12px;bottom:98px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq2909 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq2909 .pq-bfly::before,.pq2909 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2909 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2909Wing .26s ease-in-out infinite alternate;}
        .pq2909 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2909Wing .26s ease-in-out infinite alternate;}
        .pq2909 .pq-bfly.bf1::before,.pq2909 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2909 .pq-bfly.bf2::before,.pq2909 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq2909 .pq-bfly.bf1{top:112px;left:12%;animation:pq2909Flit1 8s ease-in-out infinite;}
        .pq2909 .pq-bfly.bf2{top:140px;right:12%;animation:pq2909Flit2 9s ease-in-out infinite;}
        .pq2909 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq2909 .pq-bird.b1{top:28px;left:44%;animation:pq2909Bird 7s ease-in-out infinite;}
        .pq2909 .pq-bird.b2{top:44px;left:56%;transform:scale(.78);animation:pq2909Bird 9s ease-in-out infinite;}
        .pq2909 .pq-bird.b3{top:20px;left:68%;transform:scale(.9);animation:pq2909Bird 8s ease-in-out infinite;}
        /* yog'och taxtacha (hikoya sonlari; g'alabada tenglama) */
        .pq2909 .pq-sign{position:absolute;top:176px;left:50%;transform:translateX(-50%);z-index:6;display:flex;align-items:center;gap:8px;padding:9px 13px 11px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq2909 .pq-sign::before,.pq2909 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:22px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq2909 .pq-sign::before{left:24px;} .pq2909 .pq-sign::after{right:24px;}
        .pq2909 .pq-cell{display:flex;flex-direction:column;align-items:center;gap:3px;}
        .pq2909 .pq-cell i{font-style:normal;font-size:10.5px;font-weight:800;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);white-space:nowrap;}
        .pq2909 .pq-tile{min-width:44px;height:48px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:11px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);padding:0 6px;}
        .pq2909 .pq-tile.num{background:#eef3fd;border:2.5px solid #c3d4ee;color:#2f5ca8;}
        .pq2909 .pq-tile.take{background:#fdecec;border:2.5px solid #cf3f38;color:#cf3f38;}
        .pq2909 .pq-tile.ans{background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;animation:pq2909Pop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2909 .pq-op{font-size:22px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* razryad to'plami (markaz) */
        .pq2909 .pq-arena{position:absolute;display:none;left:0;right:0;top:145px;z-index:4;}
        .pq2909 .pq-num{display:flex;flex-direction:column;align-items:center;gap:4px;}
        .pq2909 .pq-tens{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:3px;max-width:150px;}
        .pq2909 .pq-units{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:3px;max-width:190px;}
        .pq2909 .pq-obj{line-height:0;}
        .pq2909 .pq-obj.idle{animation:pq2909Bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);transform-origin:50% 100%;}
        .pq2909 .pq-obj.leave{opacity:.42;filter:grayscale(.35);}
        .pq2909 .pq-obj.leave.out{animation:pq2909Out .6s ease forwards;animation-delay:var(--bd,0s);}
        .pq2909 .pq-obj.leave.hidden{display:none;}
        /* SON O'QI — maysadagi yo'lka (Dars27 etaloni) */
        .pq2909 .pq-nl{position:absolute;left:12px;right:12px;bottom:16px;z-index:5;padding:54px 14px 22px;}
        .pq2909 .pq-nl-track{position:relative;height:12px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 6px;}
        .pq2909 .pq-nl-fill{position:absolute;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#f6c760,#3f9a4e);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:left .62s cubic-bezier(.4,0,.3,1),width .62s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq2909 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq2909 .pq-nl-bunny{position:absolute;top:0;transform:translateX(-50%);transition:left .62s cubic-bezier(.35,0,.35,1);z-index:7;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));display:flex;flex-direction:column;align-items:center;}
        .pq2909 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq2909 .pq-val{margin-bottom:1px;padding:1px 8px;border-radius:999px;background:#2f7d3c;color:#fff;font-size:13px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.2);white-space:nowrap;}
        .pq2909 .pq-bflip{display:block;transform:scaleX(-1);}
        .pq2909 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq2909 .pq-nl-hop.idle{animation:pq2909Idle 2.8s ease-in-out infinite;}
        .pq2909 .pq-nl-hop.go{animation:pq2909Hop2 .6s ease;}
        .pq2909 .pq-startmk{position:absolute;top:42px;transform:translateX(-50%);z-index:5;display:flex;flex-direction:column;align-items:center;}
        .pq2909 .pq-startdot{width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid #2f5ca8;box-sizing:border-box;}
        .pq2909 .pq-startlbl{margin-top:3px;font-size:12px;font-weight:900;color:#2f5ca8;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-trail{position:absolute;top:48px;transform:translate(-50%,-50%);width:8px;height:8px;border-radius:50%;background:#66bd6f;box-shadow:0 0 6px 1px rgba(63,154,78,.5);z-index:5;animation:pq2909Pop .3s ease both;}
        .pq2909 .pq-endmk{position:absolute;top:38px;transform:translateX(-50%);z-index:6;display:flex;flex-direction:column;align-items:center;}
        .pq2909 .pq-enddot{width:17px;height:17px;border-radius:50%;background:#3f9a4e;border:3px solid #2f7d3c;box-sizing:border-box;box-shadow:0 0 14px 4px rgba(63,154,78,.7);animation:pq2909Pop .4s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2909 .pq-endlbl{margin-top:3px;font-size:16px;font-weight:900;color:#166a34;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-endspark{position:absolute;top:-16px;font-size:16px;color:#fff2b0;animation:pq2909Tw 1.4s ease-in-out infinite;}
        .pq2909 .pq-nl-nodes{position:relative;height:0;margin:0 6px;}
        .pq2909 .pq-nl-node{position:absolute;top:-11px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq2909 .pq-nl-dot{width:11px;height:11px;border-radius:50%;background:#fff;border:2.5px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);}
        .pq2909 .pq-nl-lbl{margin-top:6px;font-size:12px;font-weight:800;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        /* razryad izohi (g'alabada) + variantlar + feedback */
        .pq2909 .pq-sub{text-align:center;margin-top:0;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2909In .3s .1s both;}
        .pq2909 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:4px;}
        .pq2909 .pq-opt{min-width:88px;height:74px;padding:0 12px;font-size:30px;font-weight:800;line-height:1;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2909 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq2909 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2909 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2909 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2909Cele .5s ease;}
        .pq2909 .pq-opt:disabled{cursor:default;}
        .pq2909 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2909In .22s ease both;}
        .pq2909 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2909 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2909Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2909Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2909Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2909Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq2909Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq2909Bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq2909Bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2909Out{0%{opacity:.42;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(28px,-16px) scale(.6);}}
        @keyframes pq2909Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2909Idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2909Hop2{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}48%{transform:translateY(var(--arc,-18px)) scaleY(1.08);}82%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2909Tw{0%,100%{opacity:0;transform:scale(.4) rotate(0);}50%{opacity:1;transform:scale(1) rotate(30deg);}}
        @keyframes pq2909Cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2909In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 420 * scale, height: 356 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <Bird cls="b1" /><Bird cls="b2" /><Bird cls="b3" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
          <div className="pq-hills"><span /><span /><span /></div>
          <div className="pq-grass" />
          <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /></div>
          <Mushroom cls="m1" />
          <span className="pq-bush" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />

          {/* Taxtacha: g'alabagacha faqat hikoya sonlari (amal belgisi YO'Q); g'alabada 48 − 15 = 33 */}
          <div className="pq-sign">
            {ok ? (<>
              <span className="pq-tile num">{A}</span>
              <span className="pq-op">{MINUS}</span>
              <span className="pq-tile num">{S}</span>
              <span className="pq-op">=</span>
              <span className="pq-tile ans">{R}</span>
            </>) : (<>
              <span className="pq-cell"><span className="pq-tile num">{A}</span><i>{t.was}</i></span>
              <span className="pq-cell"><span className="pq-tile take">{S}</span><i>{t.sold}</i></span>
            </>)}
          </div>

          {/* Razryad to'plami: 48 = 4 savat + 8 olma; g'alabada 15 tasi chiqib ketadi */}
          <div className="pq-arena">
            <Pile phase={phase} />
          </div>

          {/* Son o'qi: quyoncha 48 da idle; g'alabada −10, keyin −1×5 bilan 33 gacha orqaga sakraydi */}
          <NumberLineHop from={NL_FROM} to={NL_TO} ticks={TICKS} path={HOP_PATH} active={!!ok} still={still} dir={-1} />
        </div>
        </div>

        {/* G'alaba: razryad izohi */}
        {ok && (<div className="pq-sub">{TA}{MINUS}{TS}={TR} {t.tw} · {UA}{MINUS}{US}={UR} {t.uw}</div>)}

        <div className="pq-opts">
          {OPT.map((op) => {
            const sel = picked === op; const right = ok && op === TARGET;
            return <button key={op} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => { setPicked(op); setFeedback(null); }}>{op}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
