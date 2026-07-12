// Dars09 · Amaliyot 05 — P10 Teskari fikrlash: holatdan harakatni topish (qurbaqa 5-toshdan 2-toshga) · 🔴 · tag: reverse_move
// Hovuz + son o'qi (6 nilufar-tosh 0-5): 5-toshda qurbaqaning xira-izi, 2-toshda o'zi; oradagi yo'l «?» ark.
// G'alabada 5→4→3→2 uch yashil ark chapga-strelka bilan chiziladi (badge 1..3), chip «5 − 3 = 2».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { from: 5, to: 2, ptype: 'P10', level: '🔴', tag: 'reverse_move' };
const STEPS = DATA.from - DATA.to; // 3
const CORRECT = 0;
const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Detektiv', title: 'Qurbaqa nima qilgan?',
    setup: 'Qurbaqa besh raqamli toshda turgan edi. Hozir esa ikki raqamli toshda o\'tiribdi!',
    ask: 'Qurbaqa nima qilgan?',
    correct: 'Barakalla! Beshdan ikkiga — uch qadam orqaga sakragan.',
    hint: 'Beshdan ikkigacha toshlarni sanang: nechta qadam? Qaysi tomonga?',
    opts: ['Uch qadam ORQAGA sakragan', 'Uch qadam OLDINGA sakragan', 'Ikki qadam ORQAGA sakragan'],
  },
  ru: {
    eyebrow: 'У пруда · Детектив', title: 'Что сделала лягушка?',
    setup: 'Лягушка сидела на камне с цифрой пять. А теперь она на камне с цифрой два!',
    ask: 'Что сделала лягушка?',
    correct: 'Молодец! От пяти до двух — прыгнула на три шага назад.',
    hint: 'Посчитай камни от пяти до двух: сколько шагов? В какую сторону?',
    opts: ['Прыгнула на три шага НАЗАД', 'Прыгнула на три шага ВПЕРЁД', 'Прыгнула на два шага НАЗАД'],
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Qurbaqa kanoni: o'tirgan poza, tana #57a84f, qorin #a8d89e, kontur #2e6e28, tepada
// ikki bo'rtiq blikli ko'z (pirpiratadi), keng tabassum, old panjalar oldda, orqa oyoq bukilgan.
// ghost=true — 5-toshdagi xira-iz: bir tonlik soya-siluet, ko'z detallarisiz, shaffof.
const Frog = ({ ghost }) => {
  const C = ghost
    ? { body: '#5f8271', belly: '#5f8271', line: '#44614f', throat: '#5f8271' }
    : { body: '#57a84f', belly: '#a8d89e', line: '#2e6e28', throat: '#c3e6b8' };
  return (
    <svg viewBox="0 0 64 56" width="48" height="42" aria-hidden="true" style={{ display: 'block' }} opacity={ghost ? 0.32 : 1}>
      <path d="M13 40 Q4 42 6 49 Q8 54 17 52 Q12 47 15 41 Z" fill={C.body} stroke={C.line} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M51 40 Q60 42 58 49 Q56 54 47 52 Q52 47 49 41 Z" fill={C.body} stroke={C.line} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 52 L2 54 M10 53 L5 56" stroke={C.line} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M56 52 L62 54 M54 53 L59 56" stroke={C.line} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="32" cy="37" rx="19" ry="15" fill={C.body} stroke={C.line} strokeWidth="2" />
      <ellipse cx="32" cy="43" rx="12.5" ry="8" fill={C.belly} />
      <ellipse className={ghost ? undefined : 'pq-throat'} cx="32" cy="39" rx="7.5" ry="4.6" fill={C.throat} />
      <circle cx="22" cy="13" r="8" fill={C.body} stroke={C.line} strokeWidth="2" />
      <circle cx="42" cy="13" r="8" fill={C.body} stroke={C.line} strokeWidth="2" />
      {!ghost && (<>
        <circle cx="22" cy="13" r="5.2" fill="#fff" />
        <circle cx="42" cy="13" r="5.2" fill="#fff" />
        <circle cx="22.8" cy="13.6" r="2.5" fill="#1f2430" />
        <circle cx="42.8" cy="13.6" r="2.5" fill="#1f2430" />
        <circle cx="23.7" cy="12.4" r="0.9" fill="#fff" />
        <circle cx="43.7" cy="12.4" r="0.9" fill="#fff" />
        <g className="pq-blink">
          <circle cx="22" cy="13" r="5.5" fill={C.body} />
          <circle cx="42" cy="13" r="5.5" fill={C.body} />
        </g>
      </>)}
      <circle cx="28.5" cy="26" r="1" fill={C.line} />
      <circle cx="35.5" cy="26" r="1" fill={C.line} />
      <path d="M22 30 Q32 38 42 30" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="50" rx="4.6" ry="2.6" fill={C.body} stroke={C.line} strokeWidth="1.6" />
      <ellipse cx="40" cy="50" rx="4.6" ry="2.6" fill={C.body} stroke={C.line} strokeWidth="1.6" />
      <path d="M21 51.5 L19 53 M24 52 L24 54 M27 51.5 L29 53" stroke={C.line} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M37 51.5 L35 53 M40 52 L40 54 M43 51.5 L45 53" stroke={C.line} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
};

// Ninachi: kichik tana + 2 juft shaffof pirpiragan qanot; sahna uzra aylanma-suzish.
const Dragonfly = () => (
  <svg viewBox="0 0 46 26" width="40" height="23" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-wingf">
      <ellipse cx="17" cy="6" rx="3.4" ry="6.5" fill="#eaf6ff" opacity=".75" stroke="#bcd9ec" strokeWidth=".8" transform="rotate(-24 17 6)" />
      <ellipse cx="24" cy="6" rx="3.2" ry="6" fill="#eaf6ff" opacity=".75" stroke="#bcd9ec" strokeWidth=".8" transform="rotate(18 24 6)" />
    </g>
    <g className="pq-wingf b">
      <ellipse cx="17" cy="18" rx="3.4" ry="6.5" fill="#def0fc" opacity=".7" stroke="#bcd9ec" strokeWidth=".8" transform="rotate(24 17 18)" />
      <ellipse cx="24" cy="18" rx="3.2" ry="6" fill="#def0fc" opacity=".7" stroke="#bcd9ec" strokeWidth=".8" transform="rotate(-18 24 18)" />
    </g>
    <circle cx="9" cy="12.5" r="3" fill="#2f6f9e" />
    <circle cx="8" cy="11.5" r="0.9" fill="#fff" opacity=".8" />
    <rect x="11" y="10.8" width="14" height="3.6" rx="1.8" fill="#3b86c4" />
    <rect x="25" y="11.4" width="17" height="2.4" rx="1.2" fill="#5aa0d6" />
    <path d="M28 12.6 h4 M34 12.6 h4" stroke="#2f6f9e" strokeWidth=".9" />
  </svg>
);

const PAD_X = (n) => 30 + n * 60; // toshlar oralari teng: 30..330
const ARC_ENDS = [270, 210, 150]; // g'alaba-arklar chap uchi (5→4, 4→3, 3→2)

export default function D09_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish/chizish-animatsiyalari qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: t.opts, studentAnswer: { value: picked, label: t.opts[picked] }, correctAnswer: { value: CORRECT, label: t.opts[CORRECT] }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0905">
      <style>{`
        .pq0905{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0905 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fa8;text-transform:uppercase;}
        .pq0905 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0905 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0905 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0905 .pq-scene{position:relative;width:360px;height:230px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e2f3fa 36%,#8fd0c5 40%,#57a8b5 72%,#3f8fa6 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0905 .pq-lake{position:absolute;left:0;top:0;z-index:1;}
        .pq0905 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:0;}
        .pq0905 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0905 .pq-cloud.c1{top:16px;left:-70px;animation-duration:32s;animation-delay:-12s;}
        .pq0905 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:44s;animation-delay:-28s;}
        .pq0905 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSwayR 3.8s ease-in-out infinite;}
        .pq0905 .pq-ring{position:absolute;width:44px;height:12px;border:2px solid rgba(255,255,255,.75);border-radius:50%;animation:pqRing 4.2s ease-out infinite;z-index:1;}
        .pq0905 .pq-ring.r1{left:52px;top:196px;}
        .pq0905 .pq-ring.r2{left:296px;top:186px;animation-delay:-1.4s;}
        .pq0905 .pq-ring.r3{left:132px;top:202px;animation-delay:-2.8s;}
        .pq0905 .pq-dfly{position:absolute;left:38px;top:44px;z-index:2;animation:pqDfly 11s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0905 .pq-wingf{transform-box:fill-box;transform-origin:center bottom;animation:pqFlut .16s ease-in-out infinite alternate;}
        .pq0905 .pq-wingf.b{transform-origin:center top;animation-delay:.08s;}
        .pq0905 .pq-throat{transform-box:fill-box;transform-origin:center;animation:pqThroat 1.7s ease-in-out infinite;}
        .pq0905 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;animation-delay:-1.3s;}
        .pq0905 .pq-ghost{position:absolute;left:306px;top:114px;z-index:3;}
        .pq0905 .pq-frogw{position:absolute;left:126px;top:114px;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));animation:pqLand .65s cubic-bezier(.3,1.3,.5,1) both;}
        .pq0905 .pq-scene.win .pq-frogw{animation:pqCele .55s ease both;}
        .pq0905 .pq-qarc{fill:none;stroke:#5c7f96;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:7 8;}
        .pq0905 .pq-q{position:absolute;left:223px;top:30px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#2b7fa8;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(43,127,168,.22);animation:pqQ 2.2s ease-in-out infinite;z-index:3;}
        .pq0905 .pq-warc{fill:none;stroke:#1a7f43;stroke-width:3.2;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;animation:pqDraw .5s ease-out forwards;}
        .pq0905 .pq-wtip{fill:#1a7f43;opacity:0;animation:pqTip .25s ease-out forwards;}
        .pq0905 .pq-cnt{position:absolute;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0905 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0905 .pq-opts{display:flex;flex-direction:column;gap:10px;margin:20px auto 0;max-width:430px;}
        .pq0905 .pq-card{padding:14px 18px;font-size:16px;font-weight:700;line-height:1.35;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;text-align:center;font-family:inherit;transition:.12s;}
        .pq0905 .pq-card:hover:not(:disabled){border-color:#a9cfe3;transform:translateY(-2px);}
        .pq0905 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq0905 .pq-card.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0905 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0905 .pq-card:disabled{cursor:default;}
        .pq0905 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0905 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0905 .pq-fb.no{background:#fdecec;color:#c0392b;}
        .pq0905 .pq-scene.still .pq-frogw{animation:none;}
        .pq0905 .pq-scene.still .pq-warc{animation:none;stroke-dashoffset:0;}
        .pq0905 .pq-scene.still .pq-wtip{animation:none;opacity:1;}
        .pq0905 .pq-scene.still .pq-cnt{animation:none;}
        .pq0905 .pq-scene.still .pq-chip{animation:none;transform:translateX(-50%);}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSwayR{0%,100%{transform:rotate(0deg);}50%{transform:rotate(3.5deg);}}
        @keyframes pqRing{0%{transform:scale(.25);opacity:.8;}100%{transform:scale(1.2);opacity:0;}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0);}22%{transform:translate(84px,-12px);}45%{transform:translate(168px,10px);}62%{transform:translate(212px,-6px);}80%{transform:translate(96px,20px);}}
        @keyframes pqFlut{from{transform:scaleY(1);}to{transform:scaleY(.6);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.16);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqLand{0%{transform:translateY(-42px);}62%{transform:translateY(0);}78%{transform:translateY(-7px);}100%{transform:translateY(0);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqDraw{to{stroke-dashoffset:0;}}
        @keyframes pqTip{to{opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (ok ? ' win' : '') + (still ? ' still' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />

        <svg className="pq-lake" viewBox="0 0 360 230" width="360" height="230" aria-hidden="true">
          {/* suv yaltirashi */}
          <path d="M40 118 q16 4 32 0 M240 128 q14 4 28 0 M96 208 q16 4 32 0" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".35" />
          {/* son o'qi: 6 nilufar-tosh, 0-5, oralari teng */}
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <g key={n}>
              <ellipse cx={PAD_X(n)} cy={174} rx={26} ry={10} fill="#4a5560" opacity=".3" />
              <ellipse cx={PAD_X(n)} cy={168} rx={25} ry={11} fill="#8d99a3" stroke="#5f6b75" strokeWidth="2" />
              <ellipse cx={PAD_X(n) - 4} cy={166} rx={16} ry={6.5} fill="#b6c0c9" opacity=".85" />
              <text x={PAD_X(n)} y={173} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="inherit">{n}</text>
            </g>
          ))}
          {/* qamishlar (sway) — chap qirg'oq */}
          <g className="pq-reed" style={{ animationDelay: '-.6s' }}>
            <path d="M18 230 Q15 178 20 126" stroke="#3f7d39" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="16" y="108" width="8" height="22" rx="4" fill="#7a4b22" />
            <path d="M20 108 L20 98" stroke="#3f7d39" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 204 Q4 178 9 154" stroke="#4f9a48" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </g>
          <g className="pq-reed" style={{ animationDelay: '-2.1s' }}>
            <path d="M34 230 Q32 192 36 152" stroke="#4f9a48" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="32.5" y="136" width="7" height="18" rx="3.5" fill="#8a5a2c" />
          </g>
          {/* qamish — o'ng qirg'oq */}
          <g className="pq-reed" style={{ animationDelay: '-1.3s' }}>
            <path d="M344 230 Q347 186 342 140" stroke="#3f7d39" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="338" y="122" width="8" height="21" rx="4" fill="#7a4b22" />
            <path d="M342 122 L342 112" stroke="#3f7d39" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* qirg'oq-o'tlari burchaklarda */}
          <path d="M6 228 q3 -9 5 -1 M48 229 q3 -10 6 -1 M312 229 q3 -9 5 -1 M354 228 q-3 -9 -5 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />

          {/* «?» ark — punktir, yo'nalishsiz: 5-toshdan 2-toshgacha */}
          {!ok && <path className="pq-qarc" d="M330 112 Q240 22 150 112" />}

          {/* G'alaba: 5→4→3→2 uch yashil ark, chapga-strelka, birin-ketin chiziladi */}
          {ok && ARC_ENDS.map((x, i) => (
            <g key={x} transform={`translate(${x},0)`}>
              <path className="pq-warc" d="M60 155 Q30 105 0 155" pathLength="100" style={{ animationDelay: `${i * 0.45}s` }} />
              <polygon className="pq-wtip" points="0,155 1.2,144.1 9,148.7" style={{ animationDelay: `${0.35 + i * 0.45}s` }} />
            </g>
          ))}
        </svg>

        <span className="pq-ring r1" /><span className="pq-ring r2" /><span className="pq-ring r3" />
        <span className="pq-dfly"><Dragonfly /></span>

        {/* 5-toshda xira-iz (u yerda edi), 2-toshda qurbaqaning o'zi */}
        <span className="pq-ghost"><Frog ghost /></span>
        <span className="pq-frogw"><Frog /></span>

        {!ok && <span className="pq-q">?</span>}
        {/* Sanoq-badge: sanaladigan qadam-arklarga 1..3 */}
        {ok && [0, 1, 2].map((i) => (
          <b key={i} className="pq-cnt" style={{ left: 291 - i * 60, top: 102, animationDelay: `${0.5 + i * 0.45}s` }}>{i + 1}</b>
        ))}
        {ok && <span className="pq-chip">{DATA.from} − {STEPS} = {DATA.to}</span>}
      </div>

      <div className="pq-opts">
        {t.opts.map((label, i) => {
          const sel = picked === i; const right = ok && i === CORRECT;
          return <button key={i} type="button" className={'pq-card' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(i); setFeedback(null); }}>{label}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
