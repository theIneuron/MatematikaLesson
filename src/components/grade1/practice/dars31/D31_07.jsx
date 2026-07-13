// Dars31 · Amaliyot 07 — «Qaysi qadam xato?» · Ikki qadamli masala · Xatoni top (P13) · 🔴 · tag: find_error
// TABIAT SAHNASI (D15_01 etaloni): osmon, quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar, olmali daraxt. Taxtachada masala: «5 + 3 − 2 = ?». Yechim ikki qadam-qator (sahna ostida):
//   1-qadam: 5 + 3 = 8 (to'g'ri) · 2-qadam: 8 − 2 = 5 (XATO — aslida 6). Bola XATO qadamni bosadi.
// G'alabada QUYONCHA son o'qida TO'G'RI yo'lni ko'rsatadi: 5→8 (+3, 8 sariq, pauza), orqaga 8→6 (−2, 6 yashil)
// — nega «5» xato ekani ko'rinadi. Tuzatish (6) FAQAT g'alabada ochiladi (javob-leak yo'q).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint yo'lni ko'rsatadi (javobni emas).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 minus

// Ikki qadam-qator. Xato qadam index 1 (2-qadam) — chap-yutadi tuzog'idan qochish.
const STEPS = [
  { id: 's1', a: 5, op: '+', b: 3, shown: 8, bad: false }, // 1-qadam: 5 + 3 = 8 to'g'ri
  { id: 's2', a: 8, op: M, b: 2, shown: 5, bad: true },    // 2-qadam: 8 − 2 = 5 XATO (aslida 6) — index 1
];
const TARGET = 's2';                  // bosish kerak bo'lgan xato qadam
const REAL = 8 - 2;                   // 6 — to'g'ri natija (faqat g'alabada ochiladi)
const DATA = { story: { bor: 5, keldi: 3, ketdi: 2 }, target: TARGET, real: REAL, options: STEPS.map((s) => s.id), level: '🔴', tag: 'find_error' };
// Quyoncha to'g'ri yo'li: 5 dan 8 gacha (+3), so'ng orqaga 6 gacha (−2).
const HOP_PATH = [5, 6, 7, 8, 7, 6];

const T = {
  uz: {
    eyebrow: "Olma bog'i · Ikki qadam",
    setup: "Bor edi 5, keldi 3, ketdi 2.",
    ask: "Qaysi qadam xato?",
    st1: "1-qadam", st2: "2-qadam",
    correct: "Barakalla! 8 " + M + " 2 = 6, 5 emas.",
    hint: "Har bir qadamni tekshiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Два шага",
    setup: "Было 5, пришло 3, ушло 2.",
    ask: "В каком шаге ошибка?",
    st1: "Шаг 1", st2: "Шаг 2",
    correct: "Молодец! 8 " + M + " 2 = 6, а не 5.",
    hint: "Проверь каждый шаг.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (D15_01 etalonidan)
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
// O't tutami (maysada). (D15_01 etalonidan)
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
// Qo'ziqorin (daraxt yonida). (D15_01 etalonidan)
const Mushroom = ({ cls }) => (
  <svg className={'pq-mush ' + cls} viewBox="0 0 18 17" width="16" height="15" aria-hidden="true">
    <rect x="6.4" y="8" width="5.2" height="8" rx="2.2" fill="#f4ecd8" stroke="#dccfa8" strokeWidth=".7" />
    <path d="M1.5 8.5 C1.5 3.5 5 1 9 1 C13 1 16.5 3.5 16.5 8.5 Z" fill="#e0584c" stroke="#bf4136" strokeWidth=".8" />
    <circle cx="5.5" cy="6" r="1.1" fill="#fff" /><circle cx="10.5" cy="4.6" r="1.3" fill="#fff" /><circle cx="12.6" cy="7" r="1" fill="#fff" />
  </svg>
);

// Quyoncha (yon ko'rinish, o'ngga qarab) — kurs maskoti. (D15_01 etalonidan, gradient id'lari lokal)
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="bfur3107" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="bhead3107" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur3107)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead3107)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead3107)" stroke="#a8977f" strokeWidth="1" />
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

// SON O'QI — maysadagi yo'lka (D15_01 etalonidan, IKKI QADAMga moslangan):
// path oldinga va ORQAGA yura oladi; mid — oraliq natija (sariq, pauza bilan); lit — yakuniy (yashil).
const NumberLine = ({ from = 0, to = 10, path = [], mid = [], lit = [], active = false, still = false, stepMs = 850 }) => {
  const span = to - from;
  const pct = (n) => ((n - from) / span) * 100;
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(path.length - 1); return; }
    let delay = 600;
    const timers = path.map((n, k) => {
      const tm = setTimeout(() => setIdx(k), delay);
      delay += stepMs + (mid.includes(n) && k > 0 ? 700 : 0); // oraliq natijada pauza
      return tm;
    });
    return () => timers.forEach(clearTimeout);
  }, [active, still]); // eslint-disable-line

  const started = idx >= 0;
  const start = path[0] ?? from;
  const bunnyN = started ? path[idx] : start;
  const dir = started && idx > 0 && path[idx] < path[idx - 1] ? -1 : 1;
  const lo = Math.min(bunnyN, start), hi = Math.max(bunnyN, start);
  const reached = (n) => { const k = path.lastIndexOf(n); return k >= 0 && (still || idx >= k); };
  const nodeCls = (n) => !active ? '' : (lit.includes(n) && reached(n) ? ' on' : (mid.includes(n) && reached(n) ? ' mid' : ''));

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        <div className="pq-nl-fill" style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyN)}%` }}>
        <span className="pq-nl-flip" style={{ transform: dir < 0 ? 'scaleX(-1)' : 'none' }}>
          <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))}><Bunny /></span>
        </span>
      </div>
      <div className="pq-nl-nodes">
        {Array.from({ length: span + 1 }).map((_, i) => {
          const n = from + i; const cls = nodeCls(n);
          return (
            <div key={n} className={'pq-nl-node' + cls} style={{ left: `${(i / span) * 100}%` }}>
              <span className="pq-nl-dot" />
              <span className="pq-nl-lbl">{n}</span>
              {cls === ' on' && <span className="pq-nl-spark">✦</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function D31_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: STEPS.map((s) => `${s.a} ${s.op} ${s.b} = ${s.shown}`), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3107" + (still ? " still" : "")}>
      <style>{`
        .pq3107{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3107 *{box-sizing:border-box;}
        .pq3107.still *{animation:none !important;}
        .pq3107 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3107 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3107 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3107 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3107 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:14px;}
        /* ===== TABIAT SAHNASI (D15_01 etaloni) ===== */
        .pq3107 .pq-scene{position:relative;width:404px;max-width:100%;height:324px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3107 .pq-sun{position:absolute;top:18px;left:22px;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3107Sun 4s ease-in-out infinite;z-index:1;}
        .pq3107 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3107 .pq-cloud::before,.pq3107 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3107 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3107 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3107 .pq-cloud.c1{top:34px;left:58%;width:46px;animation:pq3107Drift 14s ease-in-out infinite;}
        .pq3107 .pq-cloud.c2{top:66px;left:30%;width:34px;transform:scale(.8);animation:pq3107Drift 18s ease-in-out infinite reverse;}
        .pq3107 .pq-cloud.c3{top:18px;left:38%;width:30px;transform:scale(.72);animation:pq3107Drift 16s ease-in-out infinite;}
        .pq3107 .pq-hills{position:absolute;left:0;right:0;bottom:104px;height:70px;z-index:1;}
        .pq3107 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3107 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3107 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq3107 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3107 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:112px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3107 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3107 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;box-shadow:6px 0 0 #fff,-6px 0 0 #fff,0 6px 0 #fff,0 -6px 0 #fff;}
        .pq3107 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3107 .pq-flower.f1{left:18%;bottom:86px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3107 .pq-flower.f2{right:30%;bottom:78px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3107 .pq-flower.f3{left:8%;bottom:80px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3107 .pq-flower.f4{left:90%;bottom:82px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3107 .pq-flower.f5{left:34%;bottom:80px;background:#ff7fa8;box-shadow:5px 0 0 #ff7fa8,-5px 0 0 #ff7fa8,0 5px 0 #ff7fa8,0 -5px 0 #ff7fa8;}
        .pq3107 .pq-flower.f6{left:39%;bottom:72px;transform:scale(.78);background:#8ec6ff;box-shadow:5px 0 0 #8ec6ff,-5px 0 0 #8ec6ff,0 5px 0 #8ec6ff,0 -5px 0 #8ec6ff;}
        .pq3107 .pq-flower.f7{left:76%;bottom:84px;background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3107 .pq-flower.f8{left:80%;bottom:74px;transform:scale(.78);background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3107 .pq-tuft{position:absolute;z-index:3;}
        .pq3107 .pq-tuft.t1{left:26%;bottom:74px;} .pq3107 .pq-tuft.t2{left:62%;bottom:78px;transform:scale(.85);}
        .pq3107 .pq-mush{position:absolute;z-index:3;left:52px;bottom:74px;}
        .pq3107 .pq-tree{position:absolute;left:8px;bottom:96px;width:46px;height:56px;z-index:2;}
        .pq3107 .pq-tree i{position:absolute;}
        .pq3107 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3107 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3107 .pq-fruit{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff9b8a,#d84438);box-shadow:0 1px 1px rgba(0,0,0,.25);z-index:3;}
        .pq3107 .pq-fruit.fr1{left:10px;bottom:38px;} .pq3107 .pq-fruit.fr2{left:27px;bottom:46px;} .pq3107 .pq-fruit.fr3{left:33px;bottom:27px;}
        .pq3107 .pq-bush{position:absolute;right:12px;bottom:92px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3107 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3107 .pq-bfly::before,.pq3107 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3107 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3107Wing .26s ease-in-out infinite alternate;}
        .pq3107 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3107Wing .26s ease-in-out infinite alternate;}
        .pq3107 .pq-bfly.bf1::before,.pq3107 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3107 .pq-bfly.bf2::before,.pq3107 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3107 .pq-bfly.bf3::before,.pq3107 .pq-bfly.bf3::after{background:#a9e0ff;}
        .pq3107 .pq-bfly.bf1{top:104px;left:24%;animation:pq3107Flit1 8s ease-in-out infinite;}
        .pq3107 .pq-bfly.bf2{top:128px;right:22%;animation:pq3107Flit2 9s ease-in-out infinite;}
        .pq3107 .pq-bfly.bf3{top:150px;left:52%;animation:pq3107Flit1 10s ease-in-out infinite;}
        .pq3107 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3107 .pq-bird.b1{top:30px;left:42%;animation:pq3107Fly 7s ease-in-out infinite;}
        .pq3107 .pq-bird.b2{top:46px;left:54%;transform:scale(.78);animation:pq3107Fly 9s ease-in-out infinite;}
        .pq3107 .pq-bird.b3{top:22px;left:66%;transform:scale(.9);animation:pq3107Fly 8s ease-in-out infinite;}
        /* yog'och taxtacha (masala ifodasi) */
        .pq3107 .pq-sign{position:absolute;top:66px;left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:6px;padding:10px 12px 13px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq3107 .pq-sign::before,.pq3107 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:30px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq3107 .pq-sign::before{left:26px;} .pq3107 .pq-sign::after{right:26px;}
        .pq3107 .pq-tile{min-width:38px;height:48px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:11px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        .pq3107 .pq-tile.start{background:#eef4fb;border:2.5px solid #6b98c9;color:#2f6bab;}
        .pq3107 .pq-tile.plus{background:#e8f7ee;border:2.5px solid #2f8f4e;color:#1a7f43;}
        .pq3107 .pq-tile.minus{background:#fdeee6;border:2.5px solid #cf6b3a;color:#b8501f;}
        .pq3107 .pq-tile.hole{background:#fff;border:3px dashed #7a4e12;color:#a05a1f;animation:pq3107Breath 1.7s ease-in-out infinite;}
        .pq3107 .pq-tile.ans{background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;animation:pq3107Pop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3107 .pq-opsign{font-size:20px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* SON O'QI — maysadagi yo'lka */
        .pq3107 .pq-nl{position:absolute;left:10px;right:10px;bottom:24px;z-index:4;padding:50px 10px 22px;}
        .pq3107 .pq-nl-track{position:relative;height:13px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 8px;}
        .pq3107 .pq-nl-fill{position:absolute;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#f6c760,#3f9a4e);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:left .7s cubic-bezier(.4,0,.3,1),width .7s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq3107 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq3107 .pq-nl-bunny{position:absolute;top:2px;transform:translateX(-50%);transition:left .7s cubic-bezier(.4,0,.35,1);z-index:6;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq3107 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq3107 .pq-nl-flip{display:block;}
        .pq3107 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq3107 .pq-nl-hop.idle{animation:pq3107Idle 2.8s ease-in-out infinite;}
        .pq3107 .pq-nl-hop.go{animation:pq3107Hop .68s ease;}
        .pq3107 .pq-nl-nodes{position:relative;height:0;margin:0 8px;}
        .pq3107 .pq-nl-node{position:absolute;top:-13px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq3107 .pq-nl-dot{width:15px;height:15px;border-radius:50%;background:#fff;border:3px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);transition:.25s;}
        .pq3107 .pq-nl-lbl{margin-top:6px;font-size:13px;font-weight:900;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        .pq3107 .pq-nl-node.on .pq-nl-dot{background:#3f9a4e;border-color:#2f7d3c;transform:scale(1.6);box-shadow:0 0 14px 4px rgba(63,154,78,.7);}
        .pq3107 .pq-nl-node.on .pq-nl-lbl{color:#166a34;font-size:15px;}
        .pq3107 .pq-nl-node.mid .pq-nl-dot{background:#f2a63c;border-color:#c07f1f;transform:scale(1.35);box-shadow:0 0 10px 3px rgba(242,166,60,.55);}
        .pq3107 .pq-nl-node.mid .pq-nl-lbl{color:#a86a15;font-size:14px;}
        .pq3107 .pq-nl-spark{position:absolute;top:-22px;font-size:16px;color:#fff2b0;animation:pq3107Twinkle 1.4s ease-in-out infinite;}
        /* Qadam-jadval: ikki bosiladigan qator, hairline ajratgich */
        .pq3107 .pq-table{position:relative;width:404px;max-width:100%;border-radius:15px;overflow:hidden;border:3px solid #d6dae3;background:rgba(255,255,255,.97);box-shadow:0 4px 10px rgba(40,60,40,.14);}
        .pq3107 .pq-row{position:relative;width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:60px;padding:10px 14px;background:transparent;border:0;border-top:1px solid #e6e9ef;cursor:pointer;transition:.12s;text-align:left;font-family:inherit;}
        .pq3107 .pq-row:first-child{border-top:0;}
        .pq3107 .pq-row:hover:not(:disabled){background:#f3f7ff;}
        .pq3107 .pq-row:active:not(:disabled){transform:scale(.99);}
        .pq3107 .pq-row.sel{background:#eef3fe;box-shadow:inset 3px 0 0 #2563eb;}
        .pq3107 .pq-row.right{background:#e8f7ee;box-shadow:inset 3px 0 0 #1a7f43;animation:pq3107Cele .5s ease;}
        .pq3107 .pq-row.dim{opacity:.42;filter:saturate(.65);}
        .pq3107 .pq-row:disabled{cursor:default;}
        .pq3107 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#9aa3b0;flex:0 0 auto;white-space:nowrap;}
        .pq3107 .pq-eqtxt{display:flex;align-items:center;gap:4px;font-size:19px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;line-height:1;flex:0 0 auto;}
        .pq3107 .pq-eqtxt i{font-style:normal;color:#8a94a2;font-weight:800;}
        .pq3107 .pq-eqtxt s{color:#c0392b;text-decoration-thickness:2.5px;}
        .pq3107 .pq-eqtxt em{font-style:normal;color:#1a7f43;font-weight:900;}
        /* g'alaba: xato qadamdagi to'g'ri natija pilyulasi (AnsPop) — faqat g'alabada */
        .pq3107 .pq-mark{position:absolute;top:-9px;right:12px;z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:14px;padding:2px 12px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq3107Pop .45s ease both;}
        /* g'alabada tuzatilgan tenglama */
        .pq3107 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;flex-wrap:wrap;animation:pq3107In .3s ease both;}
        .pq3107 .pq-eq b{min-width:42px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3107 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3107 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq3107 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3107In .22s ease both;}
        .pq3107 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3107 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3107Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3107Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3107Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3107Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3107Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3107Fly{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3107Breath{0%,100%{transform:scale(1);opacity:.9;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes pq3107Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3107Idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq3107Hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-30px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq3107Twinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0);}50%{opacity:1;transform:scale(1) rotate(30deg);}}
        @keyframes pq3107Cele{0%{transform:scale(1);}30%{transform:scale(1.02);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3107In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <Bird cls="b1" /><Bird cls="b2" /><Bird cls="b3" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
          <div className="pq-hills"><span /><span /><span /></div>
          <div className="pq-grass" />
          <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /><i className="pq-fruit fr1" /><i className="pq-fruit fr2" /><i className="pq-fruit fr3" /></div>
          <Mushroom cls="m1" />
          <span className="pq-bush" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
          <span className="pq-flower f5" /><span className="pq-flower f6" /><span className="pq-flower f7" /><span className="pq-flower f8" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" /><span className="pq-bfly bf3" />

          {/* Masala taxtachada: 5 + 3 − 2 = ? — to'g'ri natija (6) FAQAT g'alabada ochiladi */}
          <div className="pq-sign">
            <span className="pq-tile start">5</span>
            <span className="pq-opsign">{"+"}</span>
            <span className="pq-tile plus">3</span>
            <span className="pq-opsign">{M}</span>
            <span className="pq-tile minus">2</span>
            <span className="pq-opsign">=</span>
            {ok ? <span className="pq-tile ans">{REAL}</span> : <span className="pq-tile hole">?</span>}
          </div>

          {/* G'alabada quyoncha TO'G'RI yo'lni bosib o'tadi: 5→8 (sariq pauza), orqaga 8→6 (yashil) */}
          <NumberLine from={0} to={10} path={HOP_PATH} mid={[8]} lit={[REAL]} active={ok} still={still} stepMs={800} />
        </div>

        {/* Ikki qadam-qator: har qadam bosiladigan nishon;
            g'alabagacha qaysi biri xato ekani belgilanmaydi (javob-leak yo'q). */}
        <div className="pq-table">
          {STEPS.map((s, i) => {
            const sel = picked === s.id;
            const right = ok && s.id === TARGET;
            const dim = ok && s.id !== TARGET;
            return (
              <button
                key={s.id}
                type="button"
                className={'pq-row' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(s.id); setFeedback(null); }}
              >
                <span className="pq-lab">{i === 0 ? t.st1 : t.st2}</span>
                <span className="pq-eqtxt">
                  <b>{s.a}</b><i>{s.op}</i><b>{s.b}</b><i>=</i>
                  {right
                    ? (<><s>{s.shown}</s> <em>{REAL}</em></>)
                    : (<b>{s.shown}</b>)}
                </span>
                {right && <span className="pq-mark">{REAL}</span>}
              </button>
            );
          })}
        </div>

        {/* G'alabada: xato qadamning to'g'ri ko'rinishi — 8 − 2 = 6 */}
        {ok && (<div className="pq-eq"><b>8</b><i>{M}</i><b>2</b><i>=</i><b className="res">{REAL}</b></div>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
