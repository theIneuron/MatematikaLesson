// Dars09 · Amaliyot 04 — P8 Yozuvni tanla (son o'qi, sakrash arklari) · 🟡 · tag: pick_expression_jump
// Hovuz: suv ustida 6 nilufar-tosh (0-5), qurbaqa 5-toshda o'tiribdi (yetib kelgan), 2-toshda boshlash
// bayroqchasi, 2→5 uchta punktir ark. Kuchli aldamchi «3 + 2» — natija bir xil, lekin rasm 2 dan boshlanadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { start: 2, jump: 3, options: ['2 + 3', '3 + 2', '5 − 3'], correct: '2 + 3', ptype: 'P8', level: '🟡', tag: 'pick_expression_jump' };
// Toshlar markazlari (sahna px) — 0..5, oralari teng.
const STONES_X = [27, 89, 151, 213, 275, 337];
// Uch sakrash arki: 2-tosh → 3 → 4 → 5.
const ARCS = [
  { a: 151, b: 213 },
  { a: 213, b: 275 },
  { a: 275, b: 337 },
];
const T = {
  uz: {
    eyebrow: "Hovuz bo'yida · Yozuv", title: "Yozuvni tanla",
    setup: "Qurbaqa ikki raqamli toshdan boshlab uch marta oldinga sakrab, beshga yetdi.",
    ask: "Rasmga qaysi yozuv mos keladi? Boshlanishiga e'tibor bering!",
    correct: "Barakalla! Ikkidan boshlab uch qadam — ikki qo'shuv uch.",
    hint: "Qurbaqa QAYSI toshdan boshladi? Yozuvdagi birinchi son shu bo'lishi kerak.",
  },
  ru: {
    eyebrow: "У пруда · Запись", title: "Выбери запись",
    setup: "Лягушка начала с камня с цифрой два, трижды прыгнула вперёд и добралась до пяти.",
    ask: "Какая запись подходит к рисунку? Обрати внимание на начало!",
    correct: "Молодец! Начали с двух и три шага вперёд — два плюс три.",
    hint: "С КАКОГО камня начала лягушка? Первое число в записи должно быть таким.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Qurbaqa kanoni (old ko'rinish, o'tirgan poza): tana #57a84f, qorin #a8d89e, kontur #2e6e28;
// tepada ikki bo'rtiq ko'z (oq + qorachiq + blik, pirpiratadi), keng tabassum, old panjalar oldda,
// orqa oyoq bukilgan; tomoq-puls (kichik nafas). Lokal quti: 48 x 44.
const Frog = () => (
  <g className="pq-frog">
    <ellipse cx="9" cy="33" rx="9" ry="8.5" fill="#4a9247" stroke="#2e6e28" strokeWidth="1.5" />
    <ellipse cx="39" cy="33" rx="9" ry="8.5" fill="#4a9247" stroke="#2e6e28" strokeWidth="1.5" />
    <ellipse cx="7" cy="41.2" rx="6" ry="2.5" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.2" />
    <ellipse cx="41" cy="41.2" rx="6" ry="2.5" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.2" />
    <ellipse cx="24" cy="27" rx="16.5" ry="15" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.8" />
    <ellipse cx="24" cy="33" rx="10.5" ry="8" fill="#a8d89e" />
    <ellipse className="pq-throat" cx="24" cy="29.5" rx="6.5" ry="4" fill="#bfe3b4" />
    <path d="M13 20.5 Q24 28 35 20.5" stroke="#2e6e28" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <circle cx="20.5" cy="16.5" r="0.9" fill="#2e6e28" />
    <circle cx="27.5" cy="16.5" r="0.9" fill="#2e6e28" />
    <circle cx="14.5" cy="9.5" r="7" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <circle cx="33.5" cy="9.5" r="7" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <circle cx="14.5" cy="9" r="4.8" fill="#fff" />
    <circle cx="33.5" cy="9" r="4.8" fill="#fff" />
    <circle cx="14.8" cy="9.8" r="2.3" fill="#1f2430" />
    <circle cx="33.2" cy="9.8" r="2.3" fill="#1f2430" />
    <circle cx="15.9" cy="8.3" r="0.9" fill="#fff" />
    <circle cx="34.3" cy="8.3" r="0.9" fill="#fff" />
    <g className="pq-blink">
      <rect x="9.5" y="3.8" width="10" height="10.4" rx="5" fill="#57a84f" />
      <rect x="28.5" y="3.8" width="10" height="10.4" rx="5" fill="#57a84f" />
    </g>
    <ellipse cx="16" cy="41" rx="4.6" ry="2.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.3" />
    <ellipse cx="32" cy="41" rx="4.6" ry="2.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.3" />
    <path d="M12.5 42.5 v-1.6 M16 43 v-1.8 M19.5 42.5 v-1.6 M28.5 42.5 v-1.6 M32 43 v-1.8 M35.5 42.5 v-1.6" stroke="#2e6e28" strokeWidth="1" strokeLinecap="round" />
  </g>
);

// Ninachi: kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish traektoriyasi.
const Dragonfly = () => (
  <g className="pq-dfly">
    <g className="pq-dwings">
      <ellipse cx="7" cy="-5" rx="8" ry="2.8" fill="#cdeaf6" opacity=".7" transform="rotate(-22 7 -5)" />
      <ellipse cx="7" cy="5" rx="8" ry="2.8" fill="#cdeaf6" opacity=".7" transform="rotate(22 7 5)" />
      <ellipse cx="11.5" cy="-4" rx="6.5" ry="2.3" fill="#e3f3fb" opacity=".65" transform="rotate(-30 11.5 -4)" />
      <ellipse cx="11.5" cy="4" rx="6.5" ry="2.3" fill="#e3f3fb" opacity=".65" transform="rotate(30 11.5 4)" />
    </g>
    <line x1="4" y1="0" x2="19" y2="0" stroke="#3a7fb0" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="2.5" cy="0" r="3" fill="#2c6a99" />
    <circle cx="1.4" cy="-1.2" r="0.8" fill="#fff" opacity=".8" />
  </g>
);

export default function D09_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-animatsiyalari (ark, qurbaqa qo'nishi) qayta ijro etilmaydi.
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
    const correct = picked === DATA.correct;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [...DATA.options], studentAnswer: { value: picked }, correctAnswer: { value: DATA.correct }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0904">
      <style>{`
        .pq0904{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0904 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b8aa8;text-transform:uppercase;}
        .pq0904 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0904 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0904 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0904 .pq-scene{position:relative;width:100%;max-width:372px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 46%,#dff2ef 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0904 .pq-pond{display:block;width:100%;height:auto;}
        .pq0904 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0904 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0904 .pq-cloud.c1{top:14px;left:-70px;animation-duration:32s;animation-delay:-11s;}
        .pq0904 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:44s;animation-delay:-27s;}
        .pq0904 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqReedSway 3.8s ease-in-out infinite;}
        .pq0904 .pq-rip{transform-box:fill-box;transform-origin:center;animation:pqRipple 4.4s ease-out infinite;}
        .pq0904 .pq-throat{transform-box:fill-box;transform-origin:center;animation:pqThroat 1.9s ease-in-out infinite;}
        .pq0904 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;animation-delay:-1.1s;}
        .pq0904 .pq-frog{animation:pqFrogLand .7s cubic-bezier(.3,1.35,.5,1) .15s both;}
        .pq0904 .pq-dfly{animation:pqDflyFly 9s ease-in-out infinite;}
        .pq0904 .pq-dwings{transform-box:fill-box;transform-origin:center;animation:pqDflyWing .16s linear infinite alternate;}
        .pq0904 .pq-arc{animation:pqArcIn .55s ease both;}
        .pq0904 .pq-scene.still .pq-arc{animation:none;opacity:1;}
        .pq0904 .pq-scene.still .pq-frog{animation:none;}
        .pq0904 .pq-scene.win .pq-arcp{stroke:#1a7f43;}
        .pq0904 .pq-scene.win .pq-arrow{fill:#1a7f43;}
        .pq0904 .pq-scene.win .pq-arc{animation:pqArcGlow 1.4s ease-in-out infinite;opacity:1;}
        .pq0904 .pq-cnt{animation:pqPop .3s ease both;transform-box:fill-box;transform-origin:center;}
        .pq0904 .pq-q{position:absolute;left:20px;top:52px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#2b8aa8;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(43,138,168,.22);animation:pqQ 2.2s ease-in-out infinite;}
        .pq0904 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;white-space:nowrap;z-index:2;}
        .pq0904 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .pq0904 .pq-opt{min-width:100px;height:64px;padding:0 14px;font-size:24px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;font-family:inherit;}
        .pq0904 .pq-opt:hover:not(:disabled){border-color:#9fd0dd;transform:translateY(-2px);}
        .pq0904 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0904 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0904 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0904 .pq-opt:disabled{cursor:default;}
        .pq0904 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0904 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0904 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqReedSway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pqRipple{0%{opacity:.7;transform:scale(.2);}70%{opacity:.25;}100%{opacity:0;transform:scale(1);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.14,1.22);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqFrogLand{0%{opacity:0;transform:translateY(-28px);}60%{opacity:1;transform:translateY(3px);}80%{transform:translateY(-2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqDflyFly{0%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(34px,-14px) rotate(-8deg);}50%{transform:translate(64px,6px) rotate(4deg);}75%{transform:translate(26px,16px) rotate(8deg);}100%{transform:translate(0,0) rotate(0deg);}}
        @keyframes pqDflyWing{from{transform:scaleY(1);}to{transform:scaleY(.55);}}
        @keyframes pqArcIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pqArcGlow{0%,100%{filter:drop-shadow(0 0 2px rgba(26,127,67,.45));}50%{filter:drop-shadow(0 0 8px rgba(26,127,67,.9));}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (ok ? ' win' : '') + (still ? ' still' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <svg className="pq-pond" viewBox="0 0 372 236" aria-hidden="true">
          <defs>
            <linearGradient id="pq0904water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8ed2d0" />
              <stop offset=".5" stopColor="#63b3bd" />
              <stop offset="1" stopColor="#4f9aae" />
            </linearGradient>
          </defs>
          {/* Suv */}
          <rect x="0" y="112" width="372" height="124" fill="url(#pq0904water)" />
          <path d="M0 112 H372" stroke="#d6f0f4" strokeWidth="2" opacity=".55" />
          {/* Qirg'oq-o'tlar chetlarda */}
          <path d="M4 112 q3 -10 5 -1 M11 113 q3 -11 6 -1 M18 112 q3 -9 5 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M354 112 q3 -10 5 -1 M361 113 q3 -11 6 -1 M347 112 q3 -9 5 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* Suv halqa-to'lqinlari (kengayib so'nadi) */}
          <ellipse className="pq-rip" cx="70" cy="207" rx="15" ry="4.5" fill="none" stroke="#e8f7fb" strokeWidth="2" />
          <ellipse className="pq-rip" cx="252" cy="216" rx="17" ry="5" fill="none" stroke="#e8f7fb" strokeWidth="2" style={{ animationDelay: '-2.2s' }} />
          <ellipse className="pq-rip" cx="160" cy="222" rx="13" ry="4" fill="none" stroke="#e8f7fb" strokeWidth="1.8" style={{ animationDelay: '-3.4s' }} />
          {/* Qamishlar (sway) — toshlar orqasida */}
          <g className="pq-reed">
            <line x1="16" y1="214" x2="16" y2="118" stroke="#3f7d39" strokeWidth="3" />
            <ellipse cx="16" cy="127" rx="4.5" ry="13" fill="#7a4a26" />
            <path d="M16 172 q-11 -13 -13 -32" stroke="#4f9a48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
          <g className="pq-reed" style={{ animationDelay: '-1.4s' }}>
            <line x1="30" y1="216" x2="30" y2="134" stroke="#3f7d39" strokeWidth="2.6" />
            <ellipse cx="30" cy="142" rx="3.8" ry="11" fill="#8a5a2e" />
          </g>
          <g className="pq-reed" style={{ animationDelay: '-2.6s' }}>
            <line x1="42" y1="218" x2="42" y2="148" stroke="#4f9a48" strokeWidth="2.4" />
            <path d="M42 178 q10 -12 11 -28" stroke="#4f9a48" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
          {/* Son o'qi: 6 nilufar-tosh, katta oq raqamlar 0-5 */}
          {STONES_X.map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy="179" rx="25" ry="12" fill="#2e6e28" opacity=".28" />
              <ellipse cx={x} cy="176" rx="25" ry="13" fill="#4f9a48" stroke="#2e6e28" strokeWidth="2" />
              <ellipse cx={x - 4} cy="172.5" rx="17" ry="7.5" fill="#5fb356" opacity=".8" />
              <text x={x} y="181.5" textAnchor="middle" fontSize="17" fontWeight="900" fill="#fff" fontFamily="'Manrope',system-ui,sans-serif">{i}</text>
            </g>
          ))}
          {/* Boshlash bayroqchasi — 2-toshda (boshlanish aniq belgilangan) */}
          <line x1="139" y1="158" x2="139" y2="130" stroke="#8a5a2b" strokeWidth="2.4" strokeLinecap="round" />
          <polygon points="139,130 156,135 139,140" fill="#e2574c" />
          <circle cx="139" cy="158" r="2.4" fill="#8a5a2b" />
          {/* Qurbaqa — 5-toshda o'tiribdi (yetib kelgan) */}
          <g transform="translate(313,120)"><Frog /></g>
          {/* Uch punktir sakrash arki: 2 → 3 → 4 → 5, uchida strelka */}
          {ARCS.map((c, i) => (
            <g key={'a' + i} className="pq-arc" style={still ? undefined : { animationDelay: `${0.5 + i * 0.5}s` }}>
              <path className="pq-arcp" d={`M ${c.a} 160 Q ${(c.a + c.b) / 2} 120 ${c.b} 160`} fill="none" stroke="#e08a2e" strokeWidth="3.2" strokeDasharray="7 6" strokeLinecap="round" />
              <polygon className="pq-arrow" points="0,0 -10,-4.5 -8,0 -10,4.5" transform={`translate(${c.b},160) rotate(52)`} fill="#e08a2e" />
            </g>
          ))}
          {/* G'alabada sakrashlar sanaladi — 1..3 ko'k badge ark cho'qqilarida */}
          {ok && ARCS.map((c, i) => (
            <g key={'b' + i} className="pq-cnt" style={{ animationDelay: `${0.15 + i * 0.16}s` }}>
              <circle cx={(c.a + c.b) / 2} cy="128" r="9.5" fill="#2563eb" />
              <text x={(c.a + c.b) / 2} y="132" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff" fontFamily="'Manrope',system-ui,sans-serif">{i + 1}</text>
            </g>
          ))}
          {/* Ninachi — aylanma-suzish */}
          <g transform="translate(96,62)"><Dragonfly /></g>
        </svg>
        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.start} + {DATA.jump} = {DATA.start + DATA.jump}</span>}
      </div>

      <div className="pq-opts">
        {DATA.options.map((expr) => {
          const sel = picked === expr; const right = ok && expr === DATA.correct;
          return <button key={expr} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(expr); setFeedback(null); }}>{expr}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
