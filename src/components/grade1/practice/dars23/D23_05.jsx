// Dars23 · Amaliyot 05 — Zanjir «Olma bog'i» · sanoq ketma-ketligi (5 lab / 10 lab, oldinga va orqaga) · 🔴 · tag: skip_chain
// 4 ta SAVOL-karta 2×2 panjara. Kartalar TOZA: faqat sonli ketma-ketlik (bitta tayl '?') + 4 sonli variant —
// kartada rasm/animatsiya YO'Q (metodist talabi). Kartalar ostida BITTA UMUMIY SON O'QI (0..50, 5 lab,
// D15_01 kanoni: tabiat-yo'lka + quyoncha). Tekshirishda quyon TO'G'RI yechilgan har bir kartaning
// javobiga JUDA SEKIN, nuqtadan-nuqtaga sakrab boradi (qator tartibida: 30 → 20 → 30 → 25), yetgan
// javob-nuqtasi yonadi (✦) va yonib qoladi. QADAM BIR XIL KANONI: har qatorda qadam o'zgarmaydi —
// 10 lab yoki 5 lab, oldinga yoki orqaga. ANSWER-LEAK yo'q: '?' tayl qiymati faqat g'alabada ochiladi.
// VEDI-DO-VERNOGO: noto'g'ri qatorda qulf yo'q, retry mumkin; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Har qator: to'liq ketma-ketlik (miss indeksda '?'), 4 variant (o'sish tartibida).
const ROWS = [
  { seq: [10, 20, null, 40], miss: 2, ans: 30, opts: [25, 30, 35, 45], step: 10, dir: "fwd" },  // 10 lab oldinga
  { seq: [5, 10, 15, null],  miss: 3, ans: 20, opts: [18, 20, 22, 25], step: 5,  dir: "fwd" },  // 5 lab oldinga
  { seq: [50, 40, null, 20], miss: 2, ans: 30, opts: [15, 25, 30, 35], step: 10, dir: "back" }, // 10 lab orqaga
  { seq: [35, 30, null, 20], miss: 2, ans: 25, opts: [22, 23, 25, 28], step: 5,  dir: "back" }, // 5 lab orqaga
];
const DATA = { ptype: "chain", level: "🔴", tag: "skip_chain" };

// Umumiy son o'qi: 0..50, 5 lab nuqtalar (barcha javoblar 5 ga karrali).
const NODES = Array.from({ length: 11 }, (_, i) => i * 5); // [0,5,...,50]

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir",
    title: "Sanoq zanjiri",
    setup: "Har qatorni to'ldiring.",
    ask: "Yetishmagan sonni tanlang.",
    correct: "Barakalla! Har qatorni to'g'ri to'ldirdingiz.",
    hint: "Qadam bir xil: 10 lab yoki 5 lab, oldinga yoki orqaga.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка",
    title: "Цепочка счёта",
    setup: "Заполни каждую строку.",
    ask: "Выбери пропущенное число.",
    correct: "Молодец! Ты верно заполнил каждую строку.",
    hint: "Шаг одинаковый: по 10 или по 5, вперёд или назад.",
  },
};

// G'alabada har qator ostidagi qadam-yorlig'i (faqat g'alabada ko'rinadi — leak emas).
const stepLabel = (r, lang) => (lang === "ru"
  ? `по ${r.step} ${r.dir === "fwd" ? "вперёд" : "назад"}`
  : `${r.step} lab ${r.dir === "fwd" ? "oldinga" : "orqaga"}`);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// O't tutami (maysada).
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// QUYONCHA (D15_01 kanoni, yon ko'rinish, o'ngga qarab) — kurs maskoti.
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="pq2305bf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="pq2305bh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#pq2305bf)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#pq2305bh)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#pq2305bh)" stroke="#a8977f" strokeWidth="1" />
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

// Tekshiruv natijasidan quyon yo'lini quradi: to'g'ri yechilgan qatorlar javoblariga (qator tartibida)
// nuqtadan-nuqtaga boradigan yo'l + har javob-nuqtaning yo'ldagi yetish-vaqti (dests).
const buildRun = (valsObj) => {
  const path = [0];
  const dests = [];
  let cur = 0;
  ROWS.forEach((r, i) => {
    if (valsObj[i] === r.ans) {
      const target = r.ans / 5;
      while (cur !== target) { cur += cur < target ? 1 : -1; path.push(cur); }
      dests.push({ i: target, k: path.length - 1 });
    }
  });
  return { path, dests };
};

// UMUMIY SON O'QI (D15_01 kanoni) — kartalar ostidagi maysa-yo'lka. Quyon 0 da turadi (idle);
// tekshirishda run.path bo'ylab JUDA SEKIN sakraydi; yetilgan javob-nuqtalari yonib qoladi.
const ChainLine = ({ run, still }) => {
  const span = NODES.length - 1;
  const pct = (i) => (i / span) * 100;
  const [idx, setIdx] = useState(-1);
  const active = !!(run && run.dests.length > 0);
  const path = run ? run.path : [0];
  const dests = run ? run.dests : [];

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(path.length - 1); return; }
    const timers = path.map((_, k) => setTimeout(() => setIdx(k), 500 + k * 700));
    return () => timers.forEach(clearTimeout);
  }, [active, still, run]); // eslint-disable-line

  const started = idx >= 0;
  const bunnyI = started ? path[idx] : 0;
  const nodeOn = (i) => active && dests.some((d) => d.i === i && (still || idx >= d.k));

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        <div className="pq-nl-fill" style={{ width: `${pct(bunnyI)}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyI)}%` }}>
        <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))}><Bunny /></span>
      </div>
      <div className="pq-nl-nodes">
        {NODES.map((n, i) => {
          const on = nodeOn(i);
          return (
            <div key={i} className={'pq-nl-node' + (on ? ' on' : '')} style={{ left: `${pct(i)}%` }}>
              <span className="pq-nl-dot" />
              <span className="pq-nl-lbl">{n}</span>
              {on && <span className="pq-nl-spark">✦</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function D23_05(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [vals, setVals] = useState({}); // {rowIdx: tanlangan son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [run, setRun] = useState(null); // quyon yo'li (tekshirishda quriladi)
  const N = ROWS.length;
  // Review yoki qayta ochilishda sakrash/ochilish animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      setRun(buildRun(obj));
      if (typeof initialAnswer.correct === "boolean") { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    setRun(buildRun(vals)); // quyon to'g'ri yechilgan javoblarga sakraydi
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => r.seq.map((v) => (v == null ? "?" : v)).join(", ")), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2305">
      <style>{`
        .pq2305{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2305 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2305 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2305 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2305 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2305 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;}

        /* SAVOL-KARTALAR 2×2 — toza: faqat sonli ifoda + variantlar (rasm/animatsiya yo'q) */
        .pq2305 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq2305 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2305 .pq-rw{display:flex;flex-direction:column;gap:9px;align-items:center;min-width:0;padding:10px 8px;border-radius:14px;border:2.5px solid #cfe0cd;background:#fbfdf8;transition:.15s;}
        .pq2305 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2305 .pq-rw.good.win{animation:pq2305cele .5s ease;}
        .pq2305 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2305shake .35s ease;}
        .pq2305 .pq-tiles{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;}
        .pq2305 .pq-tile{min-width:44px;height:34px;padding:0 7px;border-radius:9px;background:#fff;border:2px solid #cbd6c2;color:#374151;font-size:19px;font-weight:900;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;box-shadow:0 2px 3px rgba(60,80,50,.1);}
        .pq2305 .pq-tile.miss{border-style:dashed;border-color:#9ab6d6;background:#eef4fb;color:#7a97b8;}
        .pq2305 .pq-tile.win{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2305pop .45s ease both;}
        .pq2305 .pq-sgs{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;}
        .pq2305 .pq-sg{min-width:44px;height:46px;padding:0 8px;border-radius:11px;border:2.5px solid #cdd9ea;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2305 .pq-sg:hover:not(:disabled){border-color:#8ab0e0;transform:translateY(-2px);}
        .pq2305 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2305 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2305 .pq-sg:disabled{cursor:default;}
        .pq2305 .pq-chip{display:inline-flex;align-items:center;gap:4px;padding:6px 13px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pq2305pop .35s ease both;}

        /* UMUMIY SON O'QI — tabiat-yo'lka (D15_01 kanoni), kartalar ostida */
        .pq2305 .pq-scene{position:relative;width:100%;max-width:560px;height:158px;border-radius:20px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 40%,#eaf8ff 58%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq2305 .pq-sun{position:absolute;top:10px;left:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 16px 5px rgba(255,214,74,.6);animation:pq2305sun 4s ease-in-out infinite;z-index:1;}
        .pq2305 .pq-cloud{position:absolute;height:13px;background:#fff;border-radius:20px;box-shadow:0 5px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq2305 .pq-cloud::before,.pq2305 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2305 .pq-cloud::before{width:18px;height:18px;top:-8px;left:7px;} .pq2305 .pq-cloud::after{width:13px;height:13px;top:-5px;left:22px;}
        .pq2305 .pq-cloud.c1{top:16px;left:60%;width:38px;animation:pq2305drift 14s ease-in-out infinite;}
        .pq2305 .pq-cloud.c2{top:34px;left:34%;width:28px;transform:scale(.8);animation:pq2305drift 18s ease-in-out infinite reverse;}
        .pq2305 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:66px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq2305 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2305 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:3;}
        .pq2305 .pq-flower.f1{left:10%;bottom:48px;background:#ffd94a;box-shadow:4px 0 0 #ffd94a,-4px 0 0 #ffd94a,0 4px 0 #ffd94a,0 -4px 0 #ffd94a;}
        .pq2305 .pq-flower.f2{right:12%;bottom:44px;background:#ff9ec4;box-shadow:4px 0 0 #ff9ec4,-4px 0 0 #ff9ec4,0 4px 0 #ff9ec4,0 -4px 0 #ff9ec4;}
        .pq2305 .pq-tuft{position:absolute;z-index:3;}
        .pq2305 .pq-tuft.t1{left:24%;bottom:44px;transform:scale(.8);} .pq2305 .pq-tuft.t2{right:26%;bottom:48px;transform:scale(.7);}
        .pq2305 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq2305 .pq-bfly::before,.pq2305 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq2305 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2305wing .26s ease-in-out infinite alternate;}
        .pq2305 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2305wing .26s ease-in-out infinite alternate;}
        .pq2305 .pq-bfly.bf1{top:44px;left:20%;animation:pq2305flit 9s ease-in-out infinite;}
        .pq2305 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 13px 4px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:11.5px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2305 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:13px;pointer-events:none;animation:pq2305tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2305 .pq-spark.s2{animation-delay:-.6s;} .pq2305 .pq-spark.s3{animation-delay:-1.15s;}
        /* son o'qi (D15_01 kanoni, 11 nuqta) */
        .pq2305 .pq-nl{position:absolute;left:8px;right:8px;bottom:8px;z-index:4;padding:46px 8px 20px;}
        .pq2305 .pq-nl-track{position:relative;height:12px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 8px;}
        .pq2305 .pq-nl-fill{position:absolute;left:0;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#f6c760,#3f9a4e);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:width .58s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq2305 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq2305 .pq-nl-bunny{position:absolute;top:0;transform:translateX(-50%);transition:left .58s cubic-bezier(.4,0,.35,1);z-index:6;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq2305 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq2305 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq2305 .pq-nl-hop.idle{animation:pq2305idle 2.8s ease-in-out infinite;}
        .pq2305 .pq-nl-hop.go{animation:pq2305hop .56s ease;}
        .pq2305 .pq-nl-nodes{position:relative;height:0;margin:0 8px;}
        .pq2305 .pq-nl-node{position:absolute;top:-12px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq2305 .pq-nl-dot{width:12px;height:12px;border-radius:50%;background:#fff;border:2.5px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);transition:.25s;}
        .pq2305 .pq-nl-lbl{margin-top:5px;font-size:11.5px;font-weight:900;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        .pq2305 .pq-nl-node.on .pq-nl-dot{background:#3f9a4e;border-color:#2f7d3c;transform:scale(1.55);box-shadow:0 0 12px 4px rgba(63,154,78,.7);}
        .pq2305 .pq-nl-node.on .pq-nl-lbl{color:#166a34;font-size:13px;}
        .pq2305 .pq-nl-spark{position:absolute;top:-20px;font-size:14px;color:#fff2b0;animation:pq2305tw 1.4s ease-in-out infinite;}

        .pq2305 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2305in .22s ease both;}
        .pq2305 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2305 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2305sun{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pq2305drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq2305wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2305flit{0%,100%{transform:translate(0,0);}25%{transform:translate(30px,-10px);}50%{transform:translate(56px,4px);}75%{transform:translate(24px,-6px);}}
        @keyframes pq2305idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2305hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-24px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2305pop{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2305tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2305cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2305shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2305in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? " good" + (ok ? " win" : "") : " bad") : "";
            return (
              <div key={i} className={"pq-rw" + cls}>
                <div className="pq-tiles">
                  {r.seq.map((v, ti) => {
                    const isMiss = ti === r.miss;
                    const reveal = isMiss && ok;
                    return (
                      <div key={ti} className={"pq-tile" + (isMiss ? (reveal ? " win" : " miss") : "")}>
                        {isMiss ? (reveal ? r.ans : "?") : v}
                      </div>
                    );
                  })}
                </div>

                {ok ? (
                  <span className="pq-chip">{stepLabel(r, lang)}</span>
                ) : (
                  <div className="pq-sgs">
                    {r.opts.map((n) => (
                      <button key={n} type="button" className={"pq-sg" + (vals[i] === n ? " sel" : "")} disabled={lock}
                        onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); setRun(null); }}>{n}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* umumiy son o'qi: quyon to'g'ri yechilgan kartalar javoblariga sekin sakrab boradi */}
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-grass" />
          <span className="pq-flower f1" /><span className="pq-flower f2" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-bfly bf1" />
          <div className="pq-board">{t.title}</div>

          <ChainLine run={run} still={still} />

          {ok && (<>
            <span className="pq-spark" style={{ left: "14%", top: "18px" }}>✦</span>
            <span className="pq-spark s2" style={{ left: "50%", top: "30px" }}>✦</span>
            <span className="pq-spark s3" style={{ left: "82%", top: "16px" }}>✦</span>
          </>)}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
