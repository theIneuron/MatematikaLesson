// Dars17 · Amaliyot 07 — LOGIC (make-ten SPLIT tanlash) «8 + 5» · 🔴 · tag: logic_maketen_split
// TABIAT SAHNASI (Dars15 dizayn tili): quyoncha son o'qida 8 da turadi, jami 5 qadam sakraydi.
// Bola 5 ni qaysi bo'lish 8 ni AYNAN 10 qilishini tanlaydi: "2 va 3" | "1 va 4" | "3 va 2".
// To'g'ri = "2 va 3" (8+2=10). G'alaba: quyoncha juda sekin sakraydi 8→…→13; 10-nuqta (o'nlik)
// va 13 yonadi; chip "8 + 2 + 3 = 13". Distraktor 1+4 (8+1=9, kam), 3+2 (8+3=11, oshib ketadi).
// VEDI-DO-VERNOGO: noto'g'ri javob qulflamaydi, retry mumkin; setChecked FAQAT to'g'rida.
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

const A = 8, B = 5, NEED = 2, REST = 3, SUM = A + B, TEN = 10;
const DATA = { a: A, b: B, need: NEED, rest: REST, options: [[2, 3], [1, 4], [3, 2]], correctIdx: 0, ptype: 'LOGIC', level: '🔴', tag: 'logic_maketen_split' };
// Quyoncha sakrash yo'li: 8 dan 13 gacha (besh qadam).
const HOP_PATH = Array.from({ length: SUM - A + 1 }, (_, i) => A + i); // [8,9,10,11,12,13]
const NL_FROM = 5, NL_TO = 15;

const T = {
  uz: {
    eyebrow: "Make-ten · Bo'lish",
    setup: "Quyoncha 8 da turibdi, jami 5 qadam sakraydi.",
    ask: "Beshni qanday bo'lamiz: avval o'ngacha nechta qadam, keyin nechta?",
    correct: "Barakalla! Avval ikki qadam — o'n, keyin uch qadam — o'n uch. 8 + 2 + 3 = 13!",
    hint: "Son o'qiga qarang: sakkizdan o'ngacha nechta qadam yetmaydi? Beshni avval o'shancha bo'ling.",
    va: "va",
  },
  ru: {
    eyebrow: 'Make-ten · Раздели',
    setup: 'Зайчик стоит на 8 и прыгнет всего 5 шагов.',
    ask: 'Как разделить пять: сколько шагов сначала до десяти, а сколько потом?',
    correct: 'Молодец! Сначала два шага — десять, потом три шага — тринадцать. 8 + 2 + 3 = 13!',
    hint: 'Посмотри на числовую прямую: сколько шагов не хватает восьми до десяти? На столько сначала и раздели пять.',
    va: 'и',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda) — oddiy "m" shakli.
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
// Qo'ziqorin (daraxt yonida).
const Mushroom = ({ cls }) => (
  <svg className={'pq-mush ' + cls} viewBox="0 0 18 17" width="16" height="15" aria-hidden="true">
    <rect x="6.4" y="8" width="5.2" height="8" rx="2.2" fill="#f4ecd8" stroke="#dccfa8" strokeWidth=".7" />
    <path d="M1.5 8.5 C1.5 3.5 5 1 9 1 C13 1 16.5 3.5 16.5 8.5 Z" fill="#e0584c" stroke="#bf4136" strokeWidth=".8" />
    <circle cx="5.5" cy="6" r="1.1" fill="#fff" /><circle cx="10.5" cy="4.6" r="1.3" fill="#fff" /><circle cx="12.6" cy="7" r="1" fill="#fff" />
  </svg>
);

// Quyoncha (yon ko'rinish, o'ngga qarab) — kurs maskoti (Dars15 kanoni).
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="bfur1707" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="bhead1707" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur1707)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead1707)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead1707)" stroke="#a8977f" strokeWidth="1" />
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

// SON O'QI (5..15) — maysadagi yo'lka. Quyoncha 8 da turadi; to'g'ri javobda sekin sakraydi;
// `lit` — yashil qoladigan nuqtalar (10-o'nlik va 13). 10-nuqta oltin rangda ajratilgan.
const NumberLine = ({ from = NL_FROM, to = NL_TO, path = [], lit = [], active = false, still = false }) => {
  const span = to - from;
  const pct = (n) => ((n - from) / span) * 100;
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(path.length - 1); return; }
    const timers = path.map((_, k) => setTimeout(() => setIdx(k), 600 + k * 850));
    return () => timers.forEach(clearTimeout);
  }, [active, still]); // eslint-disable-line

  const started = idx >= 0;
  const bunnyN = started ? path[idx] : (path[0] ?? from);
  const fillN = active && started ? bunnyN : (path[0] ?? from);
  const nodeOn = (n) => active && lit.includes(n) && (still || (path.includes(n) && idx >= path.indexOf(n)));

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        <div className="pq-nl-fill" style={{ left: `${pct(path[0] ?? from)}%`, width: `${pct(fillN) - pct(path[0] ?? from)}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyN)}%` }}>
        <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))}><Bunny /></span>
      </div>
      <div className="pq-nl-nodes">
        {Array.from({ length: span + 1 }).map((_, i) => {
          const n = from + i; const on = nodeOn(n);
          return (
            <div key={n} className={'pq-nl-node' + (on ? ' on' : '') + (n === TEN ? ' ten' : '')} style={{ left: `${(i / span) * 100}%` }}>
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

export default function D17_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // tanlangan variant indeksi (0..2)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash-anim qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = picked === DATA.correctIdx;
    setFeedback({ correct, msg: correct ? t.correct : t.hint });
    if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: DATA.options.map((p) => `${p[0]} ${t.va} ${p[1]}`),
      studentAnswer: { value: picked },
      correctAnswer: { value: DATA.correctIdx },
      correct, meta: { ...DATA },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(404);

  return (
    <div className="pq pq1707">
      <style>{`
        .pq1707{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1707 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq1707 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1707 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1707 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1707 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:14px;}
        /* ===== TABIAT SAHNASI ===== */
        .pq1707 .pq-fit{position:relative;margin:0 auto;}
        .pq1707 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:324px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq1707 .pq-sun{position:absolute;top:18px;left:22px;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pqSun 4s ease-in-out infinite;z-index:1;}
        .pq1707 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq1707 .pq-cloud::before,.pq1707 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq1707 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq1707 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq1707 .pq-cloud.c1{top:34px;left:58%;width:46px;animation:pqDrift 14s ease-in-out infinite;}
        .pq1707 .pq-cloud.c2{top:66px;left:30%;width:34px;transform:scale(.8);animation:pqDrift 18s ease-in-out infinite reverse;}
        .pq1707 .pq-cloud.c3{top:18px;left:38%;width:30px;transform:scale(.72);animation:pqDrift 16s ease-in-out infinite;}
        .pq1707 .pq-hills{position:absolute;left:0;right:0;bottom:104px;height:70px;z-index:1;}
        .pq1707 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq1707 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq1707 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq1707 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq1707 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:112px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq1707 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq1707 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq1707 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq1707 .pq-flower.f1{left:18%;bottom:86px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq1707 .pq-flower.f2{right:30%;bottom:78px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq1707 .pq-flower.f3{left:8%;bottom:80px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq1707 .pq-flower.f4{left:90%;bottom:82px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq1707 .pq-flower.f5{left:34%;bottom:80px;background:#ff7fa8;box-shadow:5px 0 0 #ff7fa8,-5px 0 0 #ff7fa8,0 5px 0 #ff7fa8,0 -5px 0 #ff7fa8;}
        .pq1707 .pq-flower.f6{left:76%;bottom:84px;background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq1707 .pq-tuft{position:absolute;z-index:3;}
        .pq1707 .pq-tuft.t1{left:26%;bottom:74px;} .pq1707 .pq-tuft.t2{left:62%;bottom:78px;transform:scale(.85);}
        .pq1707 .pq-mush{position:absolute;z-index:3;left:52px;bottom:74px;}
        .pq1707 .pq-tree{position:absolute;left:8px;bottom:96px;width:46px;height:56px;z-index:2;}
        .pq1707 .pq-tree i{position:absolute;}
        .pq1707 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq1707 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq1707 .pq-bush{position:absolute;right:12px;bottom:92px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq1707 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq1707 .pq-bfly::before,.pq1707 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq1707 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pqWing .26s ease-in-out infinite alternate;}
        .pq1707 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pqWing .26s ease-in-out infinite alternate;}
        .pq1707 .pq-bfly.bf1::before,.pq1707 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq1707 .pq-bfly.bf2::before,.pq1707 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq1707 .pq-bfly.bf1{top:104px;left:24%;animation:pqFlit1 8s ease-in-out infinite;}
        .pq1707 .pq-bfly.bf2{top:128px;right:22%;animation:pqFlit2 9s ease-in-out infinite;}
        .pq1707 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq1707 .pq-bird.b1{top:30px;left:42%;animation:pqBird 7s ease-in-out infinite;}
        .pq1707 .pq-bird.b2{top:46px;left:54%;transform:scale(.78);animation:pqBird 9s ease-in-out infinite;}
        /* yog'och taxtacha (ifoda) */
        .pq1707 .pq-sign{position:absolute;top:74px;left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:8px;padding:11px 14px 14px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq1707 .pq-sign::before,.pq1707 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:30px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq1707 .pq-sign::before{left:26px;} .pq1707 .pq-sign::after{right:26px;}
        .pq1707 .pq-tile{min-width:50px;height:60px;display:flex;align-items:center;justify-content:center;font-size:31px;font-weight:900;border-radius:13px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        .pq1707 .pq-tile.ten{background:#fdecec;border:2.5px solid #cf3f38;color:#cf3f38;}
        .pq1707 .pq-tile.one{background:#fff4e2;border:2.5px solid #d1912b;color:#b16b12;}
        .pq1707 .pq-tile.hole{background:#fff;border:3px dashed #7a4e12;color:#a05a1f;animation:pqBreath 1.7s ease-in-out infinite;}
        .pq1707 .pq-tile.ans{background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;animation:pqPop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1707 .pq-op{font-size:24px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* SON O'QI — maysadagi yo'lka */
        .pq1707 .pq-nl{position:absolute;left:10px;right:10px;bottom:24px;z-index:4;padding:50px 10px 22px;}
        .pq1707 .pq-nl-track{position:relative;height:13px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 8px;}
        .pq1707 .pq-nl-fill{position:absolute;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#f6c760,#3f9a4e);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:width .7s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq1707 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq1707 .pq-nl-bunny{position:absolute;top:2px;transform:translateX(-50%);transition:left .7s cubic-bezier(.4,0,.35,1);z-index:6;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq1707 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq1707 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq1707 .pq-nl-hop.idle{animation:pqIdle 2.8s ease-in-out infinite;}
        .pq1707 .pq-nl-hop.go{animation:pqHop .68s ease;}
        .pq1707 .pq-nl-nodes{position:relative;height:0;margin:0 8px;}
        .pq1707 .pq-nl-node{position:absolute;top:-13px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq1707 .pq-nl-dot{width:15px;height:15px;border-radius:50%;background:#fff;border:3px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);transition:.25s;}
        .pq1707 .pq-nl-lbl{margin-top:6px;font-size:13px;font-weight:900;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        .pq1707 .pq-nl-node.ten .pq-nl-dot{border-color:#e0a83f;background:#fff7e0;}
        .pq1707 .pq-nl-node.ten .pq-nl-lbl{color:#a06a1f;}
        .pq1707 .pq-nl-node.on .pq-nl-dot{background:#3f9a4e;border-color:#2f7d3c;transform:scale(1.6);box-shadow:0 0 14px 4px rgba(63,154,78,.7);}
        .pq1707 .pq-nl-node.on .pq-nl-lbl{color:#166a34;font-size:15px;}
        .pq1707 .pq-nl-spark{position:absolute;top:-22px;font-size:16px;color:#fff2b0;animation:pqTwinkle 1.4s ease-in-out infinite;}
        /* g'alaba tenglamasi "8 + 2 + 3 = 13" */
        .pq1707 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;animation:pqIn .3s ease both;}
        .pq1707 .pq-eq b{min-width:32px;height:38px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1707 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1707 .pq-eq i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}
        /* bo'linish-kartalar */
        .pq1707 .pq-opts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .pq1707 .pq-opt{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;font-family:inherit;}
        .pq1707 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq1707 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq1707 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1707 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1707 .pq-opt:disabled{cursor:default;}
        .pq1707 .pq-opt s{text-decoration:none;font-size:26px;font-weight:900;font-variant-numeric:tabular-nums;min-width:22px;text-align:center;}
        .pq1707 .pq-opt em{font-style:normal;font-size:14px;font-weight:700;color:#98a2b0;}
        .pq1707 .pq-opt.right em{color:#4c9b6d;}
        .pq1707 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:6px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1707 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1707 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pqWing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pqFlit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pqFlit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pqBird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.9;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqIdle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pqHop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-30px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0);}50%{opacity:1;transform:scale(1) rotate(30deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 404 * scale, height: 324 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
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
          <span className="pq-flower f5" /><span className="pq-flower f6" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />

          <div className="pq-sign">
            <span className="pq-tile ten">{A}</span>
            <span className="pq-op">+</span>
            <span className="pq-tile one">{B}</span>
            <span className="pq-op">=</span>
            {ok ? <span className="pq-tile ans">{SUM}</span> : <span className="pq-tile hole">?</span>}
          </div>

          <NumberLine path={HOP_PATH} lit={[TEN, SUM]} active={ok} still={still} />
        </div>
        </div>

        {ok && (
          <div className="pq-eq">
            <b>{A}</b><i>+</i><b>{NEED}</b><i>+</i><b>{REST}</b><i>=</i><b className="res">{SUM}</b>
          </div>
        )}

        <div className="pq-opts">
          {DATA.options.map((p, idx) => {
            const sel = picked === idx; const right = ok && idx === DATA.correctIdx;
            return (
              <button key={idx} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(idx); setFeedback(null); }}>
                <s>{p[0]}</s><em>{t.va}</em><s>{p[1]}</s>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
