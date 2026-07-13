// Dars23 · Amaliyot 06 — Mantiq «Olma bog'i» · qadamni aniqlash · 🔴 · tag: logic_step
// Bitta-tanlov (mantiq = qadamni aniqlash): 20, 30, 40, 50 ketma-ketligida sanoq qadami qancha? -> 10.
// Distraktorlar: 5 (M2 noto'g'ri qadam — yarim qadam), 20 (ikki sakrashni bitta deb hisoblash).
// TABIAT SAHNASI (D15_01 kanoni): quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar, olma daraxti.
// SON O'QI maysadagi yo'lka: nuqtalar 20,30,40,50 (shartda berilgan — leak emas). Oraliqlar ustida
// qadam-nishonlari: yechilmaguncha '?', g'alabada '+10' ochiladi. QUYON 20 da turadi (idle);
// to'g'ri javobda JUDA SEKIN, nuqtadan-nuqtaga sakraydi (20→30→40→50) — har sakrash bir xil qadam;
// oxirgi nuqta yonadi (✦). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [20, 30, 40, 50];   // shartda berilgan ketma-ketlik (son o'qi nuqtalari)
const STEP = 10;                // to'g'ri javob: sanoq qadami
const HOP_PATH = [0, 1, 2, 3];  // quyon yo'li (nuqta indekslari)
const DATA = { seq: SEQ, target: STEP, options: [10, 5, 20], ptype: 'LOGIC', level: '🔴', tag: 'logic_step' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Qadam necha?",
    setup: "20, 30, 40, 50.",
    ask: "Sanoq qadami necha?",
    correct: "Barakalla! Har son 10 ga ortadi. Qadam — 10.",
    hint: "Ikki qo'shni sonni solishtiring: 20 dan 30 gacha qancha?",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Какой шаг?",
    setup: "20, 30, 40, 50.",
    ask: "Какой шаг счёта?",
    correct: "Молодец! Каждое число больше на 10. Шаг — 10.",
    hint: "Сравни два соседних числа: от 20 до 30 сколько?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda) — oddiy "m" shakli (D15_01 kanoni).
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

// QUYONCHA (D15_01 kanoni, yon ko'rinish, o'ngga qarab) — kurs maskoti.
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="pq2306bf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="pq2306bh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#pq2306bf)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#pq2306bh)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#pq2306bh)" stroke="#a8977f" strokeWidth="1" />
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

// SON O'QI (D15_01 kanoni) + ORALIQ QADAM-NISHONLARI: yechilmaguncha '?', g'alabada '+10'.
// Quyon path[0] da turadi; `active` bo'lsa juda sekin, nuqtadan-nuqtaga sakraydi.
const NumberLine = ({ values = [], path = [], lit = [], active = false, still = false, midLabel = null }) => {
  const span = Math.max(1, values.length - 1);
  const pct = (i) => (i / span) * 100;
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(path.length - 1); return; }
    const timers = path.map((_, k) => setTimeout(() => setIdx(k), 600 + k * 850));
    return () => timers.forEach(clearTimeout);
  }, [active, still]); // eslint-disable-line

  const started = idx >= 0;
  const bunnyI = started ? path[idx] : (path[0] ?? 0);
  const fillI = active && started ? bunnyI : (path[0] ?? 0);
  const nodeOn = (i) => active && lit.includes(i) && (still || idx >= (path.includes(i) ? path.indexOf(i) : path.length - 1));

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        <div className="pq-nl-fill" style={{ width: `${pct(fillI)}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyI)}%` }}>
        <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))}><Bunny /></span>
      </div>
      <div className="pq-nl-nodes">
        {values.map((n, i) => {
          const on = nodeOn(i);
          return (
            <div key={i} className={'pq-nl-node' + (on ? ' on' : '')} style={{ left: `${pct(i)}%` }}>
              <span className="pq-nl-dot" />
              <span className="pq-nl-lbl">{n}</span>
              {on && <span className="pq-nl-spark">✦</span>}
            </div>
          );
        })}
        {midLabel && values.slice(0, -1).map((_, i) => (
          <div key={'m' + i} className={'pq-nl-mid' + (active ? ' on' : '')} style={{ left: `${((i + 0.5) / span) * 100}%` }}>{midLabel}</div>
        ))}
      </div>
    </div>
  );
};

export default function D23_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 10 | 5 | 20
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash animatsiyasi qayta ijro etilmaydi — quyon statik holatda.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === STEP;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: STEP }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2306">
      <style>{`
        .pq2306{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2306 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2306 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2306 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2306 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        /* ===== TABIAT SAHNASI (D15_01 kanoni) ===== */
        .pq2306 .pq-scene{position:relative;width:404px;max-width:100%;height:300px;margin:0 auto;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq2306 .pq-sun{position:absolute;top:16px;left:20px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq2306sun 4s ease-in-out infinite;z-index:1;}
        .pq2306 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq2306 .pq-cloud::before,.pq2306 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2306 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq2306 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq2306 .pq-cloud.c1{top:34px;left:58%;width:46px;animation:pq2306drift 14s ease-in-out infinite;}
        .pq2306 .pq-cloud.c2{top:62px;left:30%;width:34px;transform:scale(.8);animation:pq2306drift 18s ease-in-out infinite reverse;}
        .pq2306 .pq-cloud.c3{top:18px;left:40%;width:30px;transform:scale(.72);animation:pq2306drift 16s ease-in-out infinite;}
        .pq2306 .pq-hills{position:absolute;left:0;right:0;bottom:100px;height:70px;z-index:1;}
        .pq2306 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2306 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2306 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq2306 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq2306 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:108px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq2306 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2306 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq2306 .pq-flower.f1{left:16%;bottom:84px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq2306 .pq-flower.f2{right:28%;bottom:76px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq2306 .pq-flower.f3{left:8%;bottom:78px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq2306 .pq-flower.f4{left:88%;bottom:80px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq2306 .pq-flower.f5{left:36%;bottom:78px;background:#ff7fa8;box-shadow:5px 0 0 #ff7fa8,-5px 0 0 #ff7fa8,0 5px 0 #ff7fa8,0 -5px 0 #ff7fa8;}
        .pq2306 .pq-flower.f6{left:64%;bottom:82px;transform:scale(.82);background:#8ec6ff;box-shadow:5px 0 0 #8ec6ff,-5px 0 0 #8ec6ff,0 5px 0 #8ec6ff,0 -5px 0 #8ec6ff;}
        .pq2306 .pq-tuft{position:absolute;z-index:3;}
        .pq2306 .pq-tuft.t1{left:26%;bottom:72px;} .pq2306 .pq-tuft.t2{left:60%;bottom:76px;transform:scale(.85);}
        /* olma daraxti (chapda) + olmalar — «Olma bog'i» belgisi */
        .pq2306 .pq-tree{position:absolute;left:8px;bottom:92px;width:46px;height:56px;z-index:2;}
        .pq2306 .pq-tree i{position:absolute;}
        .pq2306 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq2306 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq2306 .pq-tapple{position:absolute;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2a49c,#df5b52 60%,#b83b33);z-index:3;}
        .pq2306 .pq-tapple.a1{left:18px;bottom:124px;} .pq2306 .pq-tapple.a2{left:36px;bottom:114px;} .pq2306 .pq-tapple.a3{left:10px;bottom:110px;}
        /* buta (o'ngda) */
        .pq2306 .pq-bush{position:absolute;right:12px;bottom:88px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        /* kapalaklar */
        .pq2306 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq2306 .pq-bfly::before,.pq2306 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2306 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2306wing .26s ease-in-out infinite alternate;}
        .pq2306 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2306wing .26s ease-in-out infinite alternate;}
        .pq2306 .pq-bfly.bf1::before,.pq2306 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2306 .pq-bfly.bf2::before,.pq2306 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq2306 .pq-bfly.bf1{top:100px;left:24%;animation:pq2306flit1 8s ease-in-out infinite;}
        .pq2306 .pq-bfly.bf2{top:122px;right:22%;animation:pq2306flit2 9s ease-in-out infinite;}
        /* qushlar */
        .pq2306 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq2306 .pq-bird.b1{top:30px;left:44%;animation:pq2306bird 7s ease-in-out infinite;}
        .pq2306 .pq-bird.b2{top:46px;left:56%;transform:scale(.78);animation:pq2306bird 9s ease-in-out infinite;}
        /* yashil lavha (sarlavha) */
        .pq2306 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* SON O'QI — maysadagi yo'lka (D15_01 kanoni) + qadam-nishonlari */
        .pq2306 .pq-nl{position:absolute;left:10px;right:10px;bottom:22px;z-index:4;padding:50px 10px 22px;}
        .pq2306 .pq-nl-track{position:relative;height:13px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 8px;}
        .pq2306 .pq-nl-fill{position:absolute;left:0;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#f6c760,#3f9a4e);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:width .7s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq2306 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq2306 .pq-nl-bunny{position:absolute;top:2px;transform:translateX(-50%);transition:left .7s cubic-bezier(.4,0,.35,1);z-index:6;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq2306 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq2306 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq2306 .pq-nl-hop.idle{animation:pq2306idle 2.8s ease-in-out infinite;}
        .pq2306 .pq-nl-hop.go{animation:pq2306hop .68s ease;}
        .pq2306 .pq-nl-nodes{position:relative;height:0;margin:0 8px;}
        .pq2306 .pq-nl-node{position:absolute;top:-13px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq2306 .pq-nl-dot{width:15px;height:15px;border-radius:50%;background:#fff;border:3px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);transition:.25s;}
        .pq2306 .pq-nl-lbl{margin-top:6px;font-size:14px;font-weight:900;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        .pq2306 .pq-nl-node.on .pq-nl-dot{background:#3f9a4e;border-color:#2f7d3c;transform:scale(1.6);box-shadow:0 0 14px 4px rgba(63,154,78,.7);}
        .pq2306 .pq-nl-node.on .pq-nl-lbl{color:#166a34;font-size:16px;}
        .pq2306 .pq-nl-spark{position:absolute;top:-22px;font-size:16px;color:#fff2b0;animation:pq2306tw 1.4s ease-in-out infinite;}
        /* qadam-nishonlari (oraliqlar ustida): '?' → '+10' */
        .pq2306 .pq-nl-mid{position:absolute;top:-58px;transform:translateX(-50%);min-width:26px;padding:2px 8px;border-radius:999px;background:#fff;border:2px solid #e0b96a;color:#c9822f;font-size:13px;font-weight:900;text-align:center;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(90,60,20,.18);animation:pq2306breath 1.8s ease-in-out infinite;}
        .pq2306 .pq-nl-mid.on{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;animation:pq2306pop .4s ease both;}
        /* yakuniy porlashlar */
        .pq2306 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2306tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2306 .pq-spark.s2{animation-delay:-.6s;} .pq2306 .pq-spark.s3{animation-delay:-1.15s;}
        /* zanjir + variantlar + feedback */
        .pq2306 .pq-chain{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2306in .3s ease both;}
        .pq2306 .pq-chain b{min-width:46px;height:42px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2306 .pq-chain i{font-style:normal;min-width:38px;height:26px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;border-radius:999px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-variant-numeric:tabular-nums;}
        .pq2306 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:16px;}
        .pq2306 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2306 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq2306 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2306 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2306 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2306cele .5s ease;}
        .pq2306 .pq-opt:disabled{cursor:default;}
        .pq2306 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2306in .22s ease both;}
        .pq2306 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2306 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2306sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2306drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2306wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2306flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq2306flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq2306bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq2306idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2306hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-30px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2306tw{0%,100%{opacity:0;transform:scale(.4) rotate(0);}50%{opacity:1;transform:scale(1) rotate(30deg);}}
        @keyframes pq2306breath{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.07);}}
        @keyframes pq2306pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2306cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2306in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
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
        <span className="pq-tapple a1" /><span className="pq-tapple a2" /><span className="pq-tapple a3" />
        <span className="pq-bush" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
        <span className="pq-flower f4" /><span className="pq-flower f5" /><span className="pq-flower f6" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-board">{t.title}</div>

        <NumberLine
          values={SEQ}
          path={HOP_PATH}
          lit={[SEQ.length - 1]}
          active={!!ok}
          still={still}
          midLabel={ok ? `+${STEP}` : '?'}
        />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '64px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '78px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '52px' }}>✦</span>
        </>)}
      </div>

      {ok && (
        <div className="pq-chain"><b>20</b><i>+10</i><b>30</b><i>+10</i><b>40</b><i>+10</i><b>50</b></div>
      )}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === STEP;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
