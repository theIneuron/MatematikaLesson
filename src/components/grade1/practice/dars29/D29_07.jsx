// Dars29 · Amaliyot 07 — «Xato qaysi?» · Olma bog' · Mantiq (o'z-o'zini nazorat) · 🔴 · tag: find_error
// TABIAT SAHNASI (Dars15 etaloni): jonli quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar. Uch ayirish-karta, bittasining JAVOBI xato — bola XATO kartani bosadi (P13 find-error).
// Kartalar: 7 − 3 = 4 (to'g'ri), 9 − 4 = 4 (XATO — aslida 5), 8 − 2 = 6 (to'g'ri).
// JAVOB-LEAK YO'Q: to'g'ri javob (5) faqat g'alabada ochiladi. G'alabada QUYONCHA son o'qida 9 dan
// ORQAGA 4 marta sakrab tekshiradi: 9→8→7→6→5 — «mana, 5 chiqdi, 4 emas!».
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 minus

// Karta tartibi: xato karta index 1 (o'rtada, chap-yutadi tuzog'idan qochish).
const CARDS = [
  { id: 'a73', a: 7, b: 3, shown: 4, bad: false }, // 7 − 3 = 4 to'g'ri
  { id: 'b94', a: 9, b: 4, shown: 4, bad: true },  // 9 − 4 = 4 XATO (aslida 5) — index 1
  { id: 'c82', a: 8, b: 2, shown: 6, bad: false }, // 8 − 2 = 6 to'g'ri
];
const TARGET = 'b94';                 // bosish kerak bo'lgan xato karta
const REAL = 9 - 4;                   // 5 — to'g'ri javob (faqat g'alabada ochiladi)
const DATA = { target: TARGET, real: REAL, options: CARDS.map((c) => c.id), level: '🔴', tag: 'find_error' };
const HOP_PATH = [9, 8, 7, 6, 5];     // g'alabada tekshiruv-sakrash
const NL_FROM = 0, NL_TO = 10;
const TICKS = Array.from({ length: 11 }, (_, i) => i);

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Xato qaysi?",
    setup: "Uchta yechim yozilgan, bittasi xato.",
    ask: "Qaysi yechim xato? Uni bosing.",
    correct: "Barakalla! 9 " + M + " 4 = 5, 4 emas.",
    hint: "Har bir yechimni o'zingiz hisoblab tekshiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Где ошибка?",
    setup: "Записаны три решения, одно из них неверное.",
    ask: "Какое решение неверное? Нажми на него.",
    correct: "Молодец! 9 " + M + " 4 = 5, а не 4.",
    hint: "Проверь каждое решение: посчитай сам.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

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
      <linearGradient id="bfur2907" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" /></linearGradient>
      <linearGradient id="bhead2907" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" /></linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur2907)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead2907)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead2907)" stroke="#a8977f" strokeWidth="1" />
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

// SON O'QI (Dars27 etaloni): g'alabada quyoncha 9 dan orqaga sakrab yechimni TEKSHIRADI.
const NumberLineHop = ({ from = 0, to = 10, ticks = [], path = [], active = false, still = false, dir = 1 }) => {
  const span = to - from;
  const pct = (n) => ((n - from) / span) * 100;
  const [idx, setIdx] = useState(-1);
  const startN = path[0]; const finalN = path[path.length - 1];

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(path.length - 1); return; }
    const timers = path.map((_, k) => setTimeout(() => setIdx(k), 500 + k * 900));
    return () => timers.forEach(clearTimeout);
  }, [active, still]); // eslint-disable-line

  const started = idx >= 0;
  const bunnyN = started ? path[idx] : startN;
  const arrived = still || idx >= path.length - 1;
  const fillLeft = dir > 0 ? pct(startN) : pct(bunnyN);
  const fillWidth = dir > 0 ? (pct(bunnyN) - pct(startN)) : (pct(startN) - pct(bunnyN));

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        <div className="pq-nl-fill" style={{ left: `${fillLeft}%`, width: `${active && started ? fillWidth : 0}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      {path.slice(1, -1).map((n, k) => ((active && (still || idx >= k + 1)) ? <span key={n} className="pq-trail" style={{ left: `${pct(n)}%` }} /> : null))}
      {active && arrived && (
        <div className="pq-endmk" style={{ left: `${pct(finalN)}%` }}>
          <span className="pq-enddot" /><span className="pq-endspark">✦</span>
        </div>
      )}
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyN)}%` }}>
        <span className="pq-val">{bunnyN}</span>
        <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))}>
          <span className={dir < 0 ? 'pq-bflip' : ''}><Bunny /></span>
        </span>
      </div>
      <div className="pq-nl-nodes">
        {ticks.map((n) => {
          const on = active && arrived && n === finalN;
          return (
            <div key={n} className={'pq-nl-node' + (on ? ' on' : '')} style={{ left: `${pct(n)}%` }}>
              <span className="pq-nl-dot" /><span className="pq-nl-lbl">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function D29_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda tekshiruv-sakrash qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => `${c.a} ${M} ${c.b} = ${c.shown}`), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2907">
      <style>{`
        .pq2907{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2907 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq2907 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2907 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2907 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        /* ===== TABIAT SAHNASI (Dars15 etaloni) ===== */
        .pq2907 .pq-scene{box-sizing:border-box;position:relative;width:404px;max-width:100%;margin:0 auto;padding:52px 12px 148px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq2907 .pq-sun{position:absolute;top:14px;left:18px;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq2907Sun 4s ease-in-out infinite;z-index:1;}
        .pq2907 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq2907 .pq-cloud::before,.pq2907 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2907 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq2907 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq2907 .pq-cloud.c1{top:26px;left:58%;width:46px;animation:pq2907Drift 14s ease-in-out infinite;}
        .pq2907 .pq-cloud.c2{top:52px;left:30%;width:34px;transform:scale(.8);animation:pq2907Drift 18s ease-in-out infinite reverse;}
        .pq2907 .pq-cloud.c3{top:12px;left:40%;width:30px;transform:scale(.72);animation:pq2907Drift 16s ease-in-out infinite;}
        .pq2907 .pq-hills{position:absolute;left:0;right:0;bottom:108px;height:70px;z-index:1;}
        .pq2907 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2907 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2907 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq2907 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq2907 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:116px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq2907 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2907 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq2907 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq2907 .pq-flower.f1{left:16%;bottom:90px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq2907 .pq-flower.f2{right:22%;bottom:82px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq2907 .pq-flower.f3{left:7%;bottom:84px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq2907 .pq-flower.f4{left:90%;bottom:86px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq2907 .pq-tuft{position:absolute;z-index:3;}
        .pq2907 .pq-tuft.t1{left:24%;bottom:78px;} .pq2907 .pq-tuft.t2{left:60%;bottom:82px;transform:scale(.85);}
        .pq2907 .pq-mush{position:absolute;z-index:3;left:54px;bottom:78px;}
        .pq2907 .pq-tree{position:absolute;left:8px;bottom:100px;width:46px;height:56px;z-index:2;}
        .pq2907 .pq-tree i{position:absolute;}
        .pq2907 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq2907 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq2907 .pq-bush{position:absolute;right:12px;bottom:96px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq2907 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq2907 .pq-bfly::before,.pq2907 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2907 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2907Wing .26s ease-in-out infinite alternate;}
        .pq2907 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2907Wing .26s ease-in-out infinite alternate;}
        .pq2907 .pq-bfly.bf1::before,.pq2907 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2907 .pq-bfly.bf2::before,.pq2907 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq2907 .pq-bfly.bf1{top:132px;left:8%;animation:pq2907Flit1 8s ease-in-out infinite;}
        .pq2907 .pq-bfly.bf2{top:150px;right:10%;animation:pq2907Flit2 9s ease-in-out infinite;}
        .pq2907 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq2907 .pq-bird.b1{top:22px;left:44%;animation:pq2907Bird 7s ease-in-out infinite;}
        .pq2907 .pq-bird.b2{top:38px;left:58%;transform:scale(.78);animation:pq2907Bird 9s ease-in-out infinite;}
        /* yog'och lavha (sarlavha) */
        .pq2907 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 16px 6px;border-radius:10px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fdf6e8;font-size:13px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 4px 0 #8a5926,0 6px 10px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2907 .pq-board::before,.pq2907 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:13px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;}
        .pq2907 .pq-board::before{left:16px;} .pq2907 .pq-board::after{right:16px;}
        /* tenglama-kartalar */
        .pq2907 .pq-cards{position:relative;z-index:6;display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;}
        .pq2907 .pq-card{box-sizing:border-box;position:relative;min-height:70px;display:flex;align-items:center;justify-content:center;padding:11px 2px;border-radius:15px;border:3px solid #d6dae3;background:rgba(255,255,255,.96);cursor:pointer;box-shadow:0 4px 10px rgba(40,60,40,.14);transition:.12s;}
        .pq2907 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2907 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2907 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq2907 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pq2907Cele .5s ease;}
        .pq2907 .pq-card.dim{opacity:.44;filter:saturate(.65);}
        .pq2907 .pq-card:disabled{cursor:default;}
        .pq2907 .pq-eqtxt{display:flex;align-items:center;gap:2px;font-size:17px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;line-height:1;}
        .pq2907 .pq-eqtxt i{font-style:normal;color:#8a94a2;font-weight:800;}
        .pq2907 .pq-eqtxt s{color:#c0392b;text-decoration-thickness:2.5px;}
        .pq2907 .pq-eqtxt em{font-style:normal;color:#1a7f43;font-weight:900;}
        .pq2907 .pq-mark{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:14px;padding:2px 12px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq2907PopC .45s ease both;}
        /* SON O'QI — maysadagi yo'lka (Dars27 etaloni), g'alabada tekshiruv-sakrash */
        .pq2907 .pq-nl{position:absolute;left:12px;right:12px;bottom:14px;z-index:5;padding:48px 14px 20px;}
        .pq2907 .pq-nl-track{position:relative;height:12px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 6px;}
        .pq2907 .pq-nl-fill{position:absolute;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#f6c760,#3f9a4e);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:left .62s cubic-bezier(.4,0,.3,1),width .62s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq2907 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq2907 .pq-nl-bunny{position:absolute;top:0;transform:translateX(-50%);transition:left .62s cubic-bezier(.35,0,.35,1);z-index:7;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));display:flex;flex-direction:column;align-items:center;}
        .pq2907 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq2907 .pq-val{margin-bottom:1px;padding:1px 8px;border-radius:999px;background:#2f7d3c;color:#fff;font-size:13px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.2);white-space:nowrap;}
        .pq2907 .pq-bflip{display:block;transform:scaleX(-1);}
        .pq2907 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq2907 .pq-nl-hop.idle{animation:pq2907Idle 2.8s ease-in-out infinite;}
        .pq2907 .pq-nl-hop.go{animation:pq2907Hop .6s ease;}
        .pq2907 .pq-trail{position:absolute;top:52px;transform:translate(-50%,-50%);width:8px;height:8px;border-radius:50%;background:#66bd6f;box-shadow:0 0 6px 1px rgba(63,154,78,.5);z-index:5;animation:pq2907Pop .3s ease both;}
        .pq2907 .pq-endmk{position:absolute;top:42px;transform:translateX(-50%);z-index:6;display:flex;flex-direction:column;align-items:center;}
        .pq2907 .pq-enddot{width:16px;height:16px;border-radius:50%;background:#3f9a4e;border:3px solid #2f7d3c;box-sizing:border-box;box-shadow:0 0 14px 4px rgba(63,154,78,.7);animation:pq2907Pop .4s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2907 .pq-endspark{position:absolute;top:-16px;font-size:16px;color:#fff2b0;animation:pq2907Tw 1.4s ease-in-out infinite;}
        .pq2907 .pq-nl-nodes{position:relative;height:0;margin:0 6px;}
        .pq2907 .pq-nl-node{position:absolute;top:-11px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq2907 .pq-nl-dot{width:11px;height:11px;border-radius:50%;background:#fff;border:2.5px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);transition:.25s;}
        .pq2907 .pq-nl-lbl{margin-top:5px;font-size:11.5px;font-weight:800;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        .pq2907 .pq-nl-node.on .pq-nl-dot{background:#3f9a4e;border-color:#2f7d3c;transform:scale(1.5);box-shadow:0 0 14px 4px rgba(63,154,78,.7);}
        .pq2907 .pq-nl-node.on .pq-nl-lbl{color:#166a34;font-size:13.5px;}
        .pq2907 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2907In .22s ease both;}
        .pq2907 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2907 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2907Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2907Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2907Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2907Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq2907Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq2907Bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq2907Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2907PopC{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2907Idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2907Hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-24px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2907Tw{0%,100%{opacity:0;transform:scale(.4) rotate(0);}50%{opacity:1;transform:scale(1) rotate(30deg);}}
        @keyframes pq2907Cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2907In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <Bird cls="b1" /><Bird cls="b2" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
        <div className="pq-hills"><span /><span /><span /></div>
        <div className="pq-grass" />
        <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /></div>
        <Mushroom cls="m1" />
        <span className="pq-bush" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-board">{t.title}</div>

        {/* Uch tenglama-karta: karta bosiladigan nishon; g'alabagacha xato belgilanmaydi (javob-leak yo'q). */}
        <div className="pq-cards">
          {CARDS.map((c) => {
            const sel = picked === c.id;
            const right = ok && c.id === TARGET;
            const dim = ok && c.id !== TARGET;
            return (
              <button
                key={c.id}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(c.id); setFeedback(null); }}
              >
                <span className="pq-eqtxt">
                  <b>{c.a}</b><i>{M}</i><b>{c.b}</b><i>=</i>
                  {right
                    ? (<><s>{c.shown}</s> <em>{REAL}</em></>)
                    : (<b>{c.shown}</b>)}
                </span>
                {right && <span className="pq-mark">{REAL}</span>}
              </button>
            );
          })}
        </div>

        {/* Son o'qi: quyoncha 9 da idle; g'alabada 9→8→7→6→5 sakrab yechimni tekshiradi */}
        <NumberLineHop from={NL_FROM} to={NL_TO} ticks={TICKS} path={HOP_PATH} active={!!ok} still={still} dir={-1} />
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
