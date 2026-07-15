// Dars34 · Amaliyot 10 — «Detsimetr va metr» · Blok 7 · Interaktiv o'lchash (measure_interactive) · 🔴
// ETALON-USLUB (D15_01): tabiat sahnasi (osmon/quyosh/bulut/tepalik/maysa/gullar), yog'och taxtacha «? sm»,
// quyoncha maskot. SAHNA: quyoncha sabzisini o'lchayapti — sabzi TO'LIQ belgilangan chizg'ich (0..10, har sm
// raqamli, 5 mm mayda tirqishlar, yog'och tana) ustida 0 dan 7 gacha yotibdi.
// QO'LLAB ANIM: sabzi kirib keladi, ikkala uchidan shkalaga punktir tushadi, uchida sakrovchi strelka —
// NIMANI o'qish kerakligi ko'rinadi. Bola chizg'ich raqamini bosadi. To'g'ri = 7 (sabzi uchi).
// G'ALABA: «7 sm» yorlig'i sabzi uchida, taxtachada ? → 7, quyoncha sakraydi, uchqunlar.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida.
// ANSWER-LEAK: chizg'ich+sabzi — DATA (ko'rsatish adolatli), javob bola o'qishi; g'alabagacha 7-belgi yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); yakuniy holat statik ko'rinadi.
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

const LEN = 7;                 // sabzi uzunligi (sm) — uchi 7-belgida
const MARKS = 10;              // chizg'ich shkalasi 0..10 sm (bitta dm), oxirigacha belgilangan
const CORRECT = 7;
const DATA = { len: LEN, answer: CORRECT, level: '🔴', tag: 'measure_interactive' };

const T = {
  uz: {
    eyebrow: "O'lchash · Uzunlik",
    setup: "Quyoncha sabzisini chizg'ich bilan o'lchayapti.",
    ask: "Sabzi necha sm?",
    sub: "Sabzi uchi turgan raqamni bosing.",
    correct: "Barakalla! Sabzi uchi 7 raqamida — sabzi 7 sm.",
    hint: "Sabzi 0 dan boshlanadi. Uchi qaysi raqamda? O'sha raqamni bosing.",
  },
  ru: {
    eyebrow: "Измерение · Длина",
    setup: "Зайчик измеряет морковку линейкой.",
    ask: "Морковка — сколько см?",
    sub: "Нажми число у кончика морковки.",
    correct: "Молодец! Кончик у числа 7 — морковка 7 см.",
    hint: "Морковка начинается от 0. У какого числа её кончик? Нажми это число.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Quyoncha (yon ko'rinish, o'ngga — sabziga qaraydi) — kurs maskoti (D15_01 dan, gradient id'lari lokal).
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="pq3410bf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="pq3410bh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#pq3410bf)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#pq3410bh)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#pq3410bh)" stroke="#a8977f" strokeWidth="1" />
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

// RULER-SVG kanon: 0-belgi x=16, har sm = 20px, N-belgi x=16+N*20. Shkala 0..10 — tananing OXIRIGACHA
// belgilangan (belgilanmagan quyruq yo'q), har sm raqamli, oraliqda 5 mm tirqish. Sabzi chizg'ich USTIDA,
// yo'g'on uchi 0-belgida, uchi 16+LEN*20=156 da. Bola raqamni bosadi (ko'rinmas hit-rectlar).
const X0 = 16, STEP = 20;
const xAt = (n) => X0 + n * STEP;
const TIP = xAt(LEN);

const MeasureScene = ({ picked, ok, lock, onPick, unit }) => {
  const parts = [];
  for (let n = 0; n <= MARKS; n++) {
    const x = xAt(n);
    const isDm = n % 10 === 0;                 // dm belgisi (0, 10)
    const win = ok && n === CORRECT;
    const sel = !ok && picked === n;
    parts.push(<line key={'t' + n} x1={x} y1={64} x2={x} y2={isDm ? 82 : 77} stroke={win ? '#1a7f43' : '#6b4a1f'} strokeWidth={win ? 2.6 : isDm ? 2.4 : 1.3} strokeLinecap="round" />);
    if (n < MARKS) parts.push(<line key={'m' + n} x1={x + STEP / 2} y1={64} x2={x + STEP / 2} y2={70} stroke="#b08d4a" strokeWidth="0.9" />);
    parts.push(<text key={'n' + n} x={x} y={98} textAnchor="middle" fontSize={isDm ? 11 : 10} fontWeight={win || isDm ? 800 : 600} fill={win ? '#1a7f43' : sel ? '#2563eb' : isDm ? '#5c3f1a' : '#7a5a2b'} fontFamily="'Manrope',sans-serif">{n}</text>);
  }
  return (
    <svg viewBox="0 0 250 112" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="pq3410wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7ecce" /><stop offset="1" stopColor="#e6cd9a" />
        </linearGradient>
        <linearGradient id="pq3410car" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a3d" /><stop offset="1" stopColor="#ef7616" />
        </linearGradient>
      </defs>

      {/* Sabzi: yo'g'on uchi 0-belgida (x=16), uchi 7-belgida (x=156). Kirib kelish animatsiyasi. */}
      <g className="pq-carrot">
        <path d={`M18,26 C10,28 10,42 18,44 C60,49 118,42 ${TIP},35 C118,28 60,21 18,26 Z`} fill="url(#pq3410car)" stroke="#c2611e" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M36,25 Q39,35 36,45 M58,24.5 Q61,35 58,45.5 M82,25.5 Q85,35 82,44.5" fill="none" stroke="#d9691f" strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
        <path d="M18,24 C13,15 14,8 20,6 C21,13 20,19 18,24 Z M20,24 C22,13 27,8 33,10 C30,17 25,22 20,24 Z" fill="#4e9d44" stroke="#3c7f35" strokeWidth="1" strokeLinejoin="round" />
      </g>

      {/* Ikkala uchdan shkalaga punktir: sabzi 0 da boshlanadi, uchi — o'qiladigan joy */}
      <line x1={X0} y1={46} x2={X0} y2={64} stroke="#8a6a34" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={TIP} y1={38} x2={TIP} y2={64} stroke={ok ? '#1a7f43' : '#e2683f'} strokeWidth="1.6" strokeDasharray="3 3" />

      {/* Sakrovchi strelka — «shu yerdan o'qing». Birinchi bosishgacha turadi. */}
      {!ok && picked == null && (
        <polygon className="pq-tiparrow" points={`${TIP - 6},44 ${TIP + 6},44 ${TIP},55`} fill="#e2683f" />
      )}

      {/* Chizg'ich tanasi (yog'och) — shkala oxirigacha belgilangan */}
      <rect x="4" y="64" width="222" height="44" rx="6" fill="url(#pq3410wood)" stroke="#b98a3e" strokeWidth="1.4" />
      <rect x="4" y="64" width="222" height="7" rx="6" fill="#fff" opacity=".38" />
      {parts}

      {/* Tanlangan belgi ustidagi ko'rsatkich (bola bosgan). To'g'rida yashil, boshqada ko'k. */}
      {picked != null && (
        <polygon
          points={`${xAt(picked) - 6},55 ${xAt(picked) + 6},55 ${xAt(picked)},63`}
          fill={ok && picked === CORRECT ? '#1a7f43' : '#2563eb'}
        />
      )}

      {/* G'alabada: sabzi uchi tepasida «7 sm» yorlig'i */}
      {ok && (
        <g className="pq-winlab">
          <rect x={TIP - 22} y={6} width={44} height={17} rx={8.5} fill="#1a7f43" />
          <text x={TIP} y={18.5} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="'Manrope',sans-serif">7 {unit}</text>
        </g>
      )}

      {/* Ko'rinmas tap-nishonlar: har sm-belgi ustida. lock bo'lsa bosilmaydi. */}
      {!lock && Array.from({ length: MARKS + 1 }, (_, n) => (
        <rect
          key={'hit' + n}
          className="pq-hit"
          x={xAt(n) - 10} y={52} width={20} height={60}
          onClick={() => onPick(n)}
          role="button"
          aria-label={n + ' ' + unit}
        />
      ))}
    </svg>
  );
};

export default function D34_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const unit = lang === 'ru' ? 'см' : 'sm';
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
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: null, studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(404);

  return (
    <div className={"pq pq3410" + (still ? " still" : "")} ref={fitRef}>
      <style>{`
        .pq3410.still *{animation:none !important;}
        .pq3410.still .pq-spark{opacity:1;}
        .pq3410{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3410 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3410 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3410 .pq-setup{display:block;color:#5c6672;font-weight:600;font-size:15px;}
        .pq3410 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3410 .pq-sub{display:block;font-size:14px;font-weight:600;color:#8a6a2e;margin-top:2px;}
        /* ===== TABIAT SAHNASI ===== */
        .pq3410 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:330px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 44%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3410 .pq-fit{position:relative;margin:0 auto;}
        .pq3410 .pq-sun{position:absolute;top:16px;left:20px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3410sun 4s ease-in-out infinite;z-index:1;}
        .pq3410 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3410 .pq-cloud::before,.pq3410 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3410 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3410 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3410 .pq-cloud.c1{top:30px;left:62%;width:46px;animation:pq3410drift 14s ease-in-out infinite;}
        .pq3410 .pq-cloud.c2{top:58px;left:34%;width:32px;transform:scale(.8);animation:pq3410drift 18s ease-in-out infinite reverse;}
        .pq3410 .pq-hills{position:absolute;left:0;right:0;bottom:142px;height:64px;z-index:1;}
        .pq3410 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3410 .pq-hills span:nth-child(1){left:-8%;width:54%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3410 .pq-hills span:nth-child(2){right:-6%;width:50%;height:64px;}
        .pq3410 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3410 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3410 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3410 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3410 .pq-flower.f1{left:8%;bottom:132px;background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3410 .pq-flower.f2{right:7%;bottom:138px;background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3410 .pq-flower.f3{right:16%;bottom:128px;transform:scale(.8);background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3410 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;top:110px;left:26%;animation:pq3410flit 9s ease-in-out infinite;}
        .pq3410 .pq-bfly::before,.pq3410 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq3410 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3410wing .26s ease-in-out infinite alternate;}
        .pq3410 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3410wing .26s ease-in-out infinite alternate;}
        /* yog'och taxtacha (savol: ? sm -> 7 sm) */
        .pq3410 .pq-sign{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:8px;padding:9px 14px 11px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq3410 .pq-sign::before,.pq3410 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:24px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq3410 .pq-sign::before{left:20px;} .pq3410 .pq-sign::after{right:20px;}
        .pq3410 .pq-tile{min-width:42px;height:50px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;border-radius:11px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        .pq3410 .pq-tile.hole{background:#fff;border:3px dashed #7a4e12;color:#a05a1f;animation:pq3410breath 1.7s ease-in-out infinite;}
        .pq3410 .pq-tile.ans{background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;animation:pq3410pop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3410 .pq-unit{font-size:18px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* quyoncha maskot */
        .pq3410 .pq-bunny{position:absolute;left:14px;bottom:152px;z-index:3;filter:drop-shadow(0 3px 3px rgba(0,0,0,.16));}
        .pq3410 .pq-bunny>span{display:block;transform-origin:bottom center;animation:pq3410idle 2.8s ease-in-out infinite;}
        .pq3410 .pq-bunny.joy>span{animation:pq3410joy .75s ease-in-out 3;}
        /* o'lchash sahnasi (chizg'ich+sabzi) */
        .pq3410 .pq-measure{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:352px;max-width:calc(100% - 12px);z-index:4;}
        .pq3410 .pq-carrot{animation:pq3410lay .6s ease both;}
        .pq3410 .pq-tiparrow{animation:pq3410arr 1s ease-in-out infinite;}
        .pq3410 .pq-hit{fill:transparent;cursor:pointer;transition:fill .1s;}
        .pq3410 .pq-hit:hover{fill:rgba(37,99,235,.12);}
        .pq3410 .pq-hit:active{fill:rgba(37,99,235,.22);}
        .pq3410 .pq-winlab{animation:pq3410pop .45s ease both;}
        .pq3410 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3410tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3410 .pq-spark.s2{animation-delay:-.6s;} .pq3410 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3410 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3410in .22s ease both;}
        .pq3410 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3410 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3410sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3410drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3410wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3410flit{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3410breath{0%,100%{transform:scale(1);opacity:.9;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes pq3410idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq3410joy{0%{transform:translateY(0) scaleY(.9);}40%{transform:translateY(-16px) scaleY(1.06);}80%{transform:translateY(0) scaleY(.88);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq3410lay{from{opacity:0;transform:translateX(-22px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pq3410arr{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes pq3410pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3410tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3410in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b><span className="pq-sub">{t.sub}</span></p>

      <div className="pq-fit" style={{ width: 404 * scale, height: 330 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-hills"><span /><span /></div>
        <div className="pq-grass" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
        <span className="pq-bfly" />

        {/* Taxtacha: savol «? sm» — g'alabada «7 sm» */}
        <div className="pq-sign">
          <span className={'pq-tile' + (ok ? ' ans' : ' hole')}>{ok ? CORRECT : '?'}</span>
          <span className="pq-unit">{unit}</span>
        </div>

        {/* Quyoncha sabzisiga qarab turadi; g'alabada sakraydi */}
        <div className={'pq-bunny' + (ok ? ' joy' : '')}><span><Bunny /></span></div>

        {/* Chizg'ich (to'liq belgilangan) + sabzi (DATA). Bola sm-belgini bosadi; sabzi uchi 7-belgida. */}
        <div className="pq-measure">
          <MeasureScene
            picked={picked}
            ok={ok}
            lock={lock}
            onPick={(n) => { setPicked(n); setFeedback(null); }}
            unit={unit}
          />
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '30%', top: '96px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '70%', top: '110px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '84px' }}>{'✦'}</span>
        </>)}
      </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
