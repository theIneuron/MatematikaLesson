// Dars09 · Amaliyot 01 — P9 Ayirish takrori (spiral: Dars08, «5 ichida») · 🟢 · tag: sub_warmup
// Hovuz: katta nilufar bargida 5 kanon-qurbaqa; ochilishda 2 tasi birin-ketin ark bilan SUVGA
// sakrab sho'ng'iydi (suv-halqa chayqalishi, ketganlar ko'rinmaydi). Bargda 3 qoladi.
// G'alabada badge faqat qolgan 3 tada, chip «5 − 2 = 3». Restore/review — statik yakuniy holat.
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

const DATA = { start: 5, gone: 2, target: 3, options: [2, 3, 4], ptype: 'P9', level: '🟢', tag: 'sub_warmup' };
// Bargda QOLADIGAN 3 qurbaqa (sahna px, span top-left) — g'alabada 1..3 badge shularda.
const STAY = [
  { x: 78, y: 130 },
  { x: 158, y: 124 },
  { x: 238, y: 130 },
];
// SAKRAB KETADIGAN 2 qurbaqa: jx/jy — suvga tushish siljishi, jr — burilish, sx/sy — suv-halqa o'rni.
const JUMP = [
  { x: 118, y: 136, jx: -92, jy: 52, jr: -36, sx: 32, sy: 196 },
  { x: 198, y: 136, jx: 96, jy: 56, jr: 36, sx: 300, sy: 200 },
];
const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Qurbaqalar', title: 'Nechta qoldi?',
    setup: 'Katta bargda beshta qurbaqa o\'tirgan edi. Ikkitasi shaloplatib suvga sakrab tushdi!',
    ask: 'Bargda nechta qurbaqa QOLDI?',
    correct: 'Barakalla! Beshdan ikkitasi ketdi — uchtasi qoldi.',
    hint: 'Bargda qolgan qurbaqalarni sanang — suvga sakraganlar endi bargda emas.',
  },
  ru: {
    eyebrow: 'У пруда · Лягушки', title: 'Сколько осталось?',
    setup: 'На большом листе сидели пять лягушек. Две с плеском прыгнули в воду!',
    ask: 'Сколько лягушек ОСТАЛОСЬ на листе?',
    correct: 'Молодец! Из пяти две ушли — осталось три.',
    hint: 'Посчитай лягушек, оставшихся на листе — прыгнувшие в воду уже не на листе.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza — yashil 3 ton (tana #57a84f, qorin #a8d89e, kontur #2e6e28),
// tepada ikki bo'rtiq katta ko'z (oq + qorachiq + blik, pirpiratadi), keng tabassum, old panjalar
// oldda, orqa oyoq bukilgan; pose='jump' — oyoqlar cho'zilgan sakrash-poza.
const Frog = ({ pose = 'sit', blink = '0s', throat = '0s' }) => (
  <svg viewBox="0 0 60 52" width="44" height="38" aria-hidden="true" style={{ display: 'block' }}>
    {pose === 'jump' ? (
      <g>
        <path d="M17 40 Q8 45 4 51" stroke="#3f8c39" strokeWidth="4.6" fill="none" strokeLinecap="round" />
        <path d="M43 40 Q52 45 56 51" stroke="#3f8c39" strokeWidth="4.6" fill="none" strokeLinecap="round" />
        <path d="M24 44 Q22 49 18 51" stroke="#3f8c39" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M36 44 Q38 49 42 51" stroke="#3f8c39" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>
    ) : (
      <g>
        <ellipse cx="13" cy="40" rx="8" ry="6" fill="#3f8c39" stroke="#2e6e28" strokeWidth="1.4" />
        <ellipse cx="47" cy="40" rx="8" ry="6" fill="#3f8c39" stroke="#2e6e28" strokeWidth="1.4" />
      </g>
    )}
    <path d="M12 31 Q12 14 30 13 Q48 14 48 31 Q48 45 30 46 Q12 45 12 31 Z" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <ellipse cx="30" cy="38" rx="11.5" ry="7" fill="#a8d89e" />
    <ellipse className="pq-throat" cx="30" cy="29.5" rx="6.5" ry="3.8" fill="#a8d89e" style={{ animationDelay: throat }} />
    <path d="M20 22.5 Q30 29 40 22.5" stroke="#2e6e28" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    <circle cx="26.5" cy="18" r="0.9" fill="#2e6e28" />
    <circle cx="33.5" cy="18" r="0.9" fill="#2e6e28" />
    {pose === 'sit' && (
      <g>
        <path d="M23 44 q-2.5 3 -5.5 3.6 M23 44 q-.4 3.6 -1.6 4.8 M23 44 q1.8 3 1 4.8" stroke="#3f8c39" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M37 44 q2.5 3 5.5 3.6 M37 44 q.4 3.6 1.6 4.8 M37 44 q-1.8 3 -1 4.8" stroke="#3f8c39" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    )}
    <circle cx="19.5" cy="10" r="7" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <circle cx="19.5" cy="10" r="4.9" fill="#fff" />
    <circle cx="20.2" cy="10.6" r="2.3" fill="#1f2430" />
    <circle cx="21.2" cy="9.5" r="0.9" fill="#fff" />
    <circle className="pq-blink" cx="19.5" cy="10" r="5.1" fill="#57a84f" style={{ animationDelay: blink }} />
    <circle cx="40.5" cy="10" r="7" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <circle cx="40.5" cy="10" r="4.9" fill="#fff" />
    <circle cx="41.2" cy="10.6" r="2.3" fill="#1f2430" />
    <circle cx="42.2" cy="9.5" r="0.9" fill="#fff" />
    <circle className="pq-blink" cx="40.5" cy="10" r="5.1" fill="#57a84f" style={{ animationDelay: blink }} />
  </svg>
);

// Katta nilufar bargi: 2-ton yashil + kontur, o'yiq-kesik (suv rangi), tomir chiziqlar, suv-soyasi.
const Pad = () => (
  <svg viewBox="0 0 260 78" width="252" height="76" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="130" cy="46" rx="126" ry="29" fill="#2e6e28" opacity=".22" />
    <ellipse cx="130" cy="38" rx="124" ry="30" fill="#4f9a48" stroke="#2e6e28" strokeWidth="2" />
    <ellipse cx="130" cy="34" rx="110" ry="23" fill="#5cae54" />
    <path d="M130 36 L236 10 L254 30 Z" fill="#63b7bc" stroke="#2e6e28" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M130 36 L40 22 M130 36 L26 40 M130 36 L70 54 M130 36 L150 58 M130 36 L216 50" stroke="#3f8c39" strokeWidth="1.6" opacity=".5" fill="none" />
  </svg>
);

// Qamish: poya + qo'ng'ir boshoq + yon barg (sway wrapperda).
const Reed = ({ w = 16, h = 56 }) => (
  <svg viewBox="0 0 16 56" width={w} height={h} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M8 56 Q7.2 34 8 12" stroke="#3e7d3a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <ellipse cx="8" cy="10" rx="2.8" ry="8" fill="#7a512b" />
    <ellipse cx="8" cy="4.4" rx="1" ry="2.6" fill="#5f3a17" />
    <path d="M8 38 Q13 30 12.4 20" stroke="#4f9a48" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

// Ninachi: ingichka tana + bosh + 2 juft shaffof qanot (pirpiraydi); aylanma-suzish wrapperda.
const Dragonfly = () => (
  <svg viewBox="0 0 46 26" width="38" height="21" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-dwing"><ellipse cx="16" cy="7" rx="9" ry="3.2" fill="#cfeafd" opacity=".8" transform="rotate(-24 16 7)" /><ellipse cx="24" cy="6" rx="9" ry="3.2" fill="#e4f4ff" opacity=".75" transform="rotate(-8 24 6)" /></g>
    <g className="pq-dwing2"><ellipse cx="16" cy="16" rx="9" ry="3.2" fill="#cfeafd" opacity=".8" transform="rotate(24 16 16)" /><ellipse cx="24" cy="17" rx="9" ry="3.2" fill="#e4f4ff" opacity=".75" transform="rotate(8 24 17)" /></g>
    <rect x="10" y="10" width="26" height="3.4" rx="1.7" fill="#3f7fb5" />
    <circle cx="38" cy="11.7" r="3.4" fill="#33648f" />
    <circle cx="39.1" cy="10.7" r="1" fill="#fff" opacity=".85" />
  </svg>
);

// Baliq: ora-sira lip etib sakraydi (dekor, sanalmaydi).
const Fish = () => (
  <svg viewBox="0 0 34 20" width="28" height="17" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="14" cy="10" rx="10" ry="6" fill="#e8964f" />
    <polygon points="22,10 32,4 32,16" fill="#d97f35" />
    <circle cx="8.6" cy="8" r="1.4" fill="#1f2430" />
    <path d="M11 13.5 q3 1.6 6 0" stroke="#c96e28" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

export default function D09_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const [gone, setGone] = useState(() => (stillRef.current ? [true, true] : [false, false]));

  // Ochilishda 2 qurbaqa birin-ketin suvga sakraydi (faqat jonli mountda).
  useEffect(() => {
    if (still) return;
    const t1 = setTimeout(() => setGone((g) => [true, g[1]]), 750);
    const t2 = setTimeout(() => setGone((g) => [g[0], true]), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [still]);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0901" ref={fitRef}>
      <style>{`
        .pq0901{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0901 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b8a94;text-transform:uppercase;}
        .pq0901 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0901 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0901 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0901 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:240px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 34%,#8fd0d0 38%,#5cb3b6 68%,#429aa6 100%);border:2px solid #bfe0e2;overflow:hidden;}
        .pq0901 .pq-fit{position:relative;margin:0 auto;}
        .pq0901 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0901 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0901 .pq-cloud.c1{top:14px;left:-70px;animation-duration:32s;animation-delay:-13s;}
        .pq0901 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:40s;animation-delay:-27s;}
        .pq0901 .pq-shore{position:absolute;left:0;right:0;top:80px;height:13px;background:linear-gradient(#93cd7c,#6da75c);z-index:0;}
        .pq0901 .pq-flora{position:absolute;left:0;top:66px;z-index:1;}
        .pq0901 .pq-reed{position:absolute;z-index:1;transform-origin:50% 100%;animation:pqSwayR 3.8s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq0901 .pq-ring{position:absolute;border:2px solid rgba(255,255,255,.55);border-radius:50%;opacity:0;animation:pqRingAmb ease-out infinite;z-index:1;}
        .pq0901 .pq-fish{position:absolute;left:60px;top:112px;z-index:1;opacity:0;animation:pqFish 9s ease-in-out infinite;}
        .pq0901 .pq-dfly{position:absolute;left:28px;top:56px;z-index:4;animation:pqDfly 11s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq0901 .pq-dwing,.pq0901 .pq-dwing2{transform-box:fill-box;transform-origin:center;}
        .pq0901 .pq-dwing{animation:pqFlut .14s linear infinite alternate;}
        .pq0901 .pq-dwing2{animation:pqFlut2 .14s linear infinite alternate;}
        .pq0901 .pq-raft{position:absolute;inset:0;animation:pqRaft 5.5s ease-in-out infinite;z-index:2;}
        .pq0901 .pq-padw{position:absolute;left:54px;top:140px;}
        .pq0901 .pq-frogw{position:absolute;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));animation:pqBobF 3.4s ease-in-out infinite;}
        .pq0901 .pq-throat{transform-box:fill-box;transform-origin:center;animation:pqThroat 2.6s ease-in-out infinite;}
        .pq0901 .pq-blink{opacity:0;animation:pqBlink 4.2s linear infinite;}
        .pq0901 .pq-jumpw.leap{animation:pqLeap 1.15s cubic-bezier(.45,.1,.7,1) forwards;pointer-events:none;}
        .pq0901 .pq-splash{position:absolute;width:44px;height:16px;z-index:3;pointer-events:none;}
        .pq0901 .pq-splash i{position:absolute;left:50%;top:50%;width:18px;height:7px;margin:-3.5px 0 0 -9px;border:2.5px solid rgba(255,255,255,.9);border-radius:50%;opacity:0;animation:pqRingOnce 1s ease-out both;}
        .pq0901 .pq-cnt{position:absolute;top:-8px;right:-6px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0901 .pq-q{position:absolute;left:166px;top:50px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfe4e6;color:#2b8a94;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(43,138,148,.25);animation:pqQ 2.2s ease-in-out infinite;z-index:5;}
        .pq0901 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0901 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0901 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0901 .pq-opt:hover:not(:disabled){border-color:#a9d3d6;transform:translateY(-2px);}
        .pq0901 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0901 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0901 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0901 .pq-opt:disabled{cursor:default;}
        .pq0901 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0901 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0901 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSwayR{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(3deg);}}
        @keyframes pqRingAmb{0%{opacity:0;transform:scale(.3);}12%{opacity:.7;}55%{opacity:0;transform:scale(2.2);}100%{opacity:0;transform:scale(2.2);}}
        @keyframes pqFish{0%,80%,100%{transform:translateY(24px) rotate(0deg);opacity:0;}84%{transform:translateY(-8px) rotate(-22deg);opacity:1;}88%{transform:translateY(-14px) rotate(2deg);opacity:1;}92%{transform:translateY(24px) rotate(38deg);opacity:0;}}
        @keyframes pqDfly{0%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(120px,-16px) rotate(7deg);}50%{transform:translate(230px,10px) rotate(-5deg);}75%{transform:translate(110px,26px) rotate(5deg);}100%{transform:translate(0,0) rotate(0deg);}}
        @keyframes pqFlut{from{transform:scaleY(1);}to{transform:scaleY(.55);}}
        @keyframes pqFlut2{from{transform:scaleY(.55);}to{transform:scaleY(1);}}
        @keyframes pqRaft{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqBobF{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.18);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqLeap{0%{transform:translate(0,0) rotate(0deg);opacity:1;}32%{transform:translate(calc(var(--jx)*.42),calc(var(--jy)*.18 - 52px)) rotate(calc(var(--jr)*.6));opacity:1;}62%{transform:translate(calc(var(--jx)*.8),calc(var(--jy)*.62)) rotate(var(--jr));opacity:1;}84%{transform:translate(var(--jx),var(--jy)) rotate(var(--jr)) scale(.92);opacity:1;}100%{transform:translate(var(--jx),calc(var(--jy) + 16px)) rotate(var(--jr)) scale(.8);opacity:0;}}
        @keyframes pqRingOnce{0%{opacity:0;transform:scale(.3);}18%{opacity:.95;}100%{opacity:0;transform:scale(2.6);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 240 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-shore" />
        {/* Qirg'oq o'tlari va gul (dekor) */}
        <svg className="pq-flora" viewBox="0 0 360 16" width="360" height="16" aria-hidden="true">
          <path d="M12 15 q3 -9 5 -1 M40 16 q3 -10 6 -1 M96 15 q3 -8 5 -1 M232 15 q3 -9 5 -1 M262 16 q3 -10 6 -1 M330 15 q3 -8 5 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="300" y1="16" x2="300" y2="8" stroke="#5ea44d" strokeWidth="2" /><circle cx="300" cy="6" r="3" fill="#e88bb1" /><circle cx="300" cy="6" r="1.2" fill="#b1487a" /></g>
        </svg>
        {/* Qamishlar — sway */}
        <span className="pq-reed" style={{ left: 14, top: 40 }}><Reed /></span>
        <span className="pq-reed" style={{ left: 30, top: 52, animationDelay: '-1.4s' }}><Reed w={13} h={44} /></span>
        <span className="pq-reed" style={{ left: 326, top: 46, animationDelay: '-2.3s' }}><Reed w={14} h={48} /></span>
        {/* Suvda ora-sira halqa-to'lqin (dekor) */}
        <span className="pq-ring" style={{ left: 96, top: 108, width: 26, height: 9, animationDuration: '5.2s' }} />
        <span className="pq-ring" style={{ left: 268, top: 122, width: 30, height: 10, animationDuration: '6.6s', animationDelay: '-2.8s' }} />
        {/* Baliq — lip etib sakraydi (dekor, sanalmaydi) */}
        <span className="pq-fish"><Fish /></span>
        {/* Ninachi — aylanma-suzish */}
        <span className="pq-dfly"><Dragonfly /></span>

        {/* Barg + qurbaqalar birga ohista suzadi */}
        <div className="pq-raft">
          <span className="pq-padw"><Pad /></span>
          {/* Bargda QOLADIGAN 3 qurbaqa — g'alabada 1..3 badge shularda */}
          {STAY.map((p, i) => (
            <span key={'s' + i} className="pq-frogw" style={{ left: p.x, top: p.y, animationDelay: `${-i * 1.1}s` }}>
              <Frog blink={`${-i * 1.5}s`} throat={`${-i * 0.8}s`} />
              {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
            </span>
          ))}
          {/* SAKRAB KETADIGAN 2 qurbaqa — birin-ketin ark bilan suvga (still holatida yo'q) */}
          {!still && JUMP.map((f, i) => (
            <span key={'j' + i}
              className={'pq-frogw pq-jumpw' + (gone[i] ? ' leap' : '')}
              style={{ left: f.x, top: f.y, '--jx': `${f.jx}px`, '--jy': `${f.jy}px`, '--jr': `${f.jr}deg` }}>
              <Frog pose={gone[i] ? 'jump' : 'sit'} blink={`${-2.1 - i * 1.3}s`} throat={`${-1.2 - i * 0.6}s`} />
            </span>
          ))}
        </div>

        {/* Sho'ng'ish joyidagi suv-halqa chayqalishi — sakrash yakuniga moslangan */}
        {!still && gone.map((g, i) => (g ? (
          <span key={'sp' + i} className="pq-splash" style={{ left: JUMP[i].sx, top: JUMP[i].sy }}>
            <i style={{ animationDelay: '0.85s' }} /><i style={{ animationDelay: '1.05s' }} />
          </span>
        ) : null))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.start} − {DATA.gone} = {DATA.target}</span>}
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
