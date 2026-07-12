// Dars14 · Amaliyot 07 — LOGIC «Tartibda yetishmagan son» (ketma-ketlik) · 🔴 · tag: logic_sequence
// POYEZD SAHNASI: osmon, quyosh, bulutlar, tepaliklar, temir yo'l. Lokomotiv + raqamlangan vagonlar:
// 11, 12, ?, 14, 15 — bittasi yetishmaydi. Qaysi son yetishmagan? → 13.
// G'alaba: 13-vagon bo'sh joyga tushadi (pop), butun poyezd yashil yonadi, chip «11, 12, 13, 14, 15».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [11, 12, null, 14, 15];
const MISSING = 13;
const DATA = { seq: SEQ, missing: MISSING, options: [12, 13, 14], ptype: 'LOGIC', level: '🔴', tag: 'logic_sequence' };

// Vagon ranglari (palitradan) — har vagon o'z rangida.
const WAG = [
  { c: '#e2635b', d: '#b13a33' }, // qizil
  { c: '#f2b134', d: '#cd9421' }, // sariq
  { c: '#57a84f', d: '#42813e' }, // yashil
  { c: '#4f8fc4', d: '#396f9c' }, // ko'k
  { c: '#c07ac4', d: '#96559a' }, // binafsha
];

const T = {
  uz: {
    eyebrow: "Poyezd · Ketma-ketlik", title: "Tartibda yetishmagan son",
    setup: "Vagonlar tartib bilan raqamlangan, bittasi yetishmaydi.",
    ask: "Qatorda qaysi son yetishmagan?",
    correct: "Barakalla! O'n ikkidan keyin o'n uch keladi. Endi poyezd to'liq: o'n bir, o'n ikki, o'n uch, o'n to'rt, o'n besh!",
    hint: "Vagonlarni tartib bilan sanang: o'n bir, o'n ikki, keyin qaysi son keladi?",
    chip: "11, 12, 13, 14, 15",
  },
  ru: {
    eyebrow: "Поезд · Последовательность", title: "Пропущенное число по порядку",
    setup: "Вагоны пронумерованы по порядку, одного не хватает.",
    ask: "Какое число пропущено в ряду?",
    correct: "Молодец! После двенадцати идёт тринадцать. Теперь поезд полный: одиннадцать, двенадцать, тринадцать, четырнадцать, пятнадцать!",
    hint: "Считайте вагоны по порядку: одиннадцать, двенадцать, а какое число дальше?",
    chip: "11, 12, 13, 14, 15",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// LOKOMOTIV KANONI: kulrang-ko'k parovoz — kabina, qozon, truba (tutun alohida), 2 g'ildirak.
const Loco = () => (
  <svg viewBox="0 0 56 46" width="52" height="43" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2" y="10" width="18" height="26" rx="3" fill="#5b7a94" stroke="#3f5a70" strokeWidth="1.4" />
    <rect x="5" y="14" width="12" height="9" rx="2" fill="#cfe6f4" stroke="#3f5a70" strokeWidth="1" />
    <rect x="18" y="20" width="30" height="16" rx="4" fill="#7195ae" stroke="#3f5a70" strokeWidth="1.4" />
    <rect x="38" y="8" width="8" height="14" rx="2" fill="#4f6e86" stroke="#3f5a70" strokeWidth="1.2" />
    <rect x="36" y="6" width="12" height="4" rx="2" fill="#3f5a70" />
    <rect x="46" y="26" width="8" height="7" rx="2" fill="#c0392b" stroke="#8f2a20" strokeWidth="1" />
    <circle cx="14" cy="39" r="5.4" fill="#3a4652" stroke="#242c34" strokeWidth="1.2" />
    <circle cx="14" cy="39" r="2" fill="#8fa2b2" />
    <circle cx="34" cy="39" r="5.4" fill="#3a4652" stroke="#242c34" strokeWidth="1.2" />
    <circle cx="34" cy="39" r="2" fill="#8fa2b2" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda vagon-tushish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.missing;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.missing }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1407">
      <style>{`
        .pq1407{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1407 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f5a70;text-transform:uppercase;}
        .pq1407 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1407 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1407 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1407 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        /* TABIAT + TEMIR YO'L SAHNASI */
        .pq1407 .pq-scene{position:relative;width:404px;max-width:100%;height:216px;border-radius:20px;background:linear-gradient(#bfe6fb 0%,#d9f1fd 48%,#eaf8ff 64%);border:2px solid #b8d9e8;overflow:hidden;}
        .pq1407 .pq-sun{position:absolute;left:18px;top:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 18px 5px rgba(255,214,74,.55);animation:pqSun 3.8s ease-in-out infinite;z-index:1;}
        .pq1407 .pq-cloud{position:absolute;height:13px;background:#fff;border-radius:20px;opacity:.94;z-index:1;}
        .pq1407 .pq-cloud::before,.pq1407 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq1407 .pq-cloud::before{width:18px;height:18px;top:-8px;left:7px;} .pq1407 .pq-cloud::after{width:13px;height:13px;top:-5px;left:22px;}
        .pq1407 .pq-cloud.c1{top:20px;left:52%;width:38px;animation:pqDrift 14s ease-in-out infinite;}
        .pq1407 .pq-cloud.c2{top:44px;left:76%;width:30px;transform:scale(.8);animation:pqDrift 18s ease-in-out infinite reverse;}
        .pq1407 .pq-hills{position:absolute;left:0;right:0;bottom:52px;height:56px;z-index:1;}
        .pq1407 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq1407 .pq-hills span:nth-child(1){left:-8%;width:54%;height:48px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq1407 .pq-hills span:nth-child(2){right:-6%;width:50%;height:56px;}
        /* temir yo'l */
        .pq1407 .pq-track{position:absolute;left:0;right:0;bottom:0;height:54px;background:linear-gradient(#8ccb64 0%,#69b34c 100%);z-index:2;}
        .pq1407 .pq-rail{position:absolute;left:0;right:0;bottom:16px;height:5px;background:linear-gradient(#8a949e,#5f6a74);z-index:3;}
        .pq1407 .pq-rail::before{content:'';position:absolute;left:0;right:0;top:9px;height:4px;background:repeating-linear-gradient(90deg,#8a5a2c 0 14px,transparent 14px 26px);}
        /* poyezd */
        .pq1407 .pq-train{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);display:flex;align-items:flex-end;gap:5px;z-index:4;}
        .pq1407 .pq-locow{position:relative;animation:pqChug 2.6s ease-in-out infinite;}
        .pq1407 .pq-scene.still .pq-locow{animation:none;}
        .pq1407 .pq-smoke{position:absolute;top:-12px;right:4px;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.85);opacity:0;animation:pqSmoke 2.6s ease-out infinite;z-index:1;}
        .pq1407 .pq-smoke.k2{animation-delay:-1.3s;right:8px;}
        .pq1407 .pq-scene.still .pq-smoke{animation:none;}
        /* vagon */
        .pq1407 .pq-wag{position:relative;width:58px;padding:7px 4px 14px;border-radius:9px 9px 6px 6px;display:flex;flex-direction:column;align-items:center;box-sizing:border-box;animation:pqChug 2.6s ease-in-out infinite;}
        .pq1407 .pq-scene.still .pq-wag{animation:none;}
        .pq1407 .pq-wag::before{content:'';position:absolute;left:9px;bottom:-6px;width:12px;height:12px;border-radius:50%;background:#3a4652;border:2px solid #242c34;box-sizing:border-box;}
        .pq1407 .pq-wag::after{content:'';position:absolute;right:9px;bottom:-6px;width:12px;height:12px;border-radius:50%;background:#3a4652;border:2px solid #242c34;box-sizing:border-box;}
        .pq1407 .pq-wnum{min-width:34px;padding:3px 6px;border-radius:8px;background:#fffdf7;border:2px solid rgba(0,0,0,.18);font-size:19px;font-weight:900;color:#374151;text-align:center;font-variant-numeric:tabular-nums;line-height:1.1;}
        .pq1407 .pq-wag.win .pq-wnum{color:#1a7f43;border-color:#1a7f43;}
        /* bo'sh joy (yetishmagan vagon) */
        .pq1407 .pq-wag.gap{background:rgba(255,255,255,.45) !important;border:2.5px dashed #d0ab63;animation:none;}
        .pq1407 .pq-wag.gap::before,.pq1407 .pq-wag.gap::after{opacity:.35;}
        .pq1407 .pq-qmark{font-size:26px;font-weight:900;color:#c19a55;opacity:.9;animation:pqBreathQ 1.7s ease-in-out infinite;line-height:1.25;}
        .pq1407 .pq-wag.fill{animation:pqDrop .55s cubic-bezier(.3,1.25,.5,1) both;}
        .pq1407 .pq-scene.still .pq-wag.fill{animation:none;}
        /* uchqun + chip */
        .pq1407 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1407 .pq-star.s2{animation-delay:-.5s;} .pq1407 .pq-star.s3{animation-delay:-1s;}
        .pq1407 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:999px;background:#e8f7ee;border:2px solid #7cc99a;color:#1a7f43;font-size:18px;font-weight:900;letter-spacing:.03em;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        /* variantlar */
        .pq1407 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:2px;}
        .pq1407 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1407 .pq-opt:hover:not(:disabled){border-color:#8fb6de;transform:translateY(-2px);}
        .pq1407 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1407 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1407 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1407 .pq-opt:disabled{cursor:default;}
        .pq1407 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1407 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1407 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pqChug{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqSmoke{0%{opacity:0;transform:translate(0,0) scale(.5);}25%{opacity:.85;}100%{opacity:0;transform:translate(-10px,-26px) scale(1.5);}}
        @keyframes pqBreathQ{0%,100%{transform:scale(1);opacity:.75;}50%{transform:scale(1.16);opacity:1;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-46px) scale(.82);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-hills"><span /><span /></div>
          <span className="pq-track" />
          <span className="pq-rail" />

          <div className="pq-train">
            <span className="pq-locow">
              <span className="pq-smoke" /><span className="pq-smoke k2" />
              <Loco />
            </span>
            {SEQ.map((v, i) => {
              const isGap = v === null;
              const col = WAG[i % WAG.length];
              if (isGap && !ok) {
                return (
                  <div key={i} className="pq-wag gap">
                    <span className="pq-qmark">?</span>
                  </div>
                );
              }
              const n = isGap ? MISSING : v;
              return (
                <div key={i}
                  className={'pq-wag' + (ok ? ' win' : '') + (isGap && ok ? ' fill' : '')}
                  style={{ background: `linear-gradient(${col.c},${col.d})`, border: `2px solid ${col.d}`, animationDelay: isGap && ok ? undefined : `${-i * 0.3}s` }}>
                  <span className="pq-wnum">{n}</span>
                </div>
              );
            })}
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '18%', top: '46px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '52%', top: '34px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '82%', top: '48px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {ok && <span className="pq-chip">{t.chip}</span>}

        <div className="pq-opts">
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.missing;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
