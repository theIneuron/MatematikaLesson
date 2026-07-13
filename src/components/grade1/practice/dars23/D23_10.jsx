// Dars23 · Amaliyot 10 — Bilim tekshiruvi «Olma bog'i» · 5 lab sakrash · 🔴 · tag: perform_skip
// YANGI NAQSH (10-amaliyot bilim tekshiruvi): bola quyonni O'ZI sakratadi (qiziqarli qism) — [Sakrash +5]
// tugmasi bilan quyon 5 lab yo'lakda oldinga o'tadi: 5, 10, 15, 20, 25. Har sakrash QADAMI DOIM 5.
// LEKIN sanoq YASHIRIN: yo'lak tayllarida son ko'rinmaydi ('?'), jonli hisoblagich YO'Q — bola
// yig'indini o'zi sanamaydi, XAYOLAN hisoblaydi. Quyon oxiriga yetgach (5 sakrash) 4 sonli variant
// chiqadi: bola quyon qayerga yetganini tanlaydi. Check: to'g'ri → tayllar 5,10,15,20,25 bo'lib ochiladi,
// bayram-animatsiya; noto'g'ri → hint, qulf YO'Q, qayta tanlash mumkin. Distraktorlar: 20 (bitta kam
// sakrash), 30 (bitta ortiqcha), 15 (ikki kam). ANSWER-LEAK yo'q: 25 g'alabagacha hech qayerda yozilmaydi.
// onReady FAQAT variant tanlanganda true. VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida. studentAnswer={pos,value}.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const STEP = 5, TARGET = 25;
const TILES = [5, 10, 15, 20, 25];     // 5 lab tayl-yo'lak (qadam doim 5); sanoq javobgacha yashirin
const COLS = TILES.length + 1;         // 6 ustun: boshlash + 5 tayl
const OPTIONS = [15, 20, 25, 30];      // 25 to'g'ri; 20/30/15 — kam/ortiq sakrash
const DATA = { tiles: TILES, step: STEP, target: TARGET, options: OPTIONS, ptype: 'NEW', level: '🔴', tag: 'perform_skip' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Sakrash", title: "Quyonni sakrating",
    setup: "Quyon 5 lab sakraydi.",
    ask: "Quyonni oxirigacha sakrating.",
    ask2: "Quyon qayerga yetdi?",
    correct: "Barakalla! 5, 10, 15, 20, 25 — quyon yetib keldi!",
    hint: "Har sakrash 5 ga. Sanang: 5, 10, 15, 20, 25.",
    btn: "Sakrash",
  },
  ru: {
    eyebrow: "Яблоневый сад · Прыжки", title: "Пусть зайчик прыгает",
    setup: "Зайчик прыгает по 5.",
    ask: "Пусть зайчик допрыгает до конца.",
    ask2: "Куда попал зайчик?",
    correct: "Молодец! 5, 10, 15, 20, 25 — зайчик добрался!",
    hint: "Каждый прыжок по 5. Считай: 5, 10, 15, 20, 25.",
    btn: "Прыжок",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QUYONCHA (D15_01 kanoni, yon ko'rinish, o'ngga qarab) — kurs maskoti. Tugma bilan boshqariladi.
let __rid = 0;
const Bunny = ({ w = 46 }) => {
  const id = 'pq2310b' + (__rid++);
  const bf = id + 'f', bh = id + 'h';
  return (
    <svg viewBox="0 0 52 48" width={w} height={w * 48 / 52} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={bf} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" /></linearGradient>
        <linearGradient id={bh} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" /></linearGradient>
      </defs>
      <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
      <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
      <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
      <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill={`url(#${bf})`} stroke="#b09a7e" strokeWidth="1" />
      <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
      <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
      <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
      <circle cx="39" cy="25" r="10" fill={`url(#${bh})`} stroke="#b09a7e" strokeWidth="1" />
      <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill={`url(#${bh})`} stroke="#a8977f" strokeWidth="1" />
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
};

export default function D23_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pos, setPos] = useState(0);       // 0,5,10,15,20,25 — quyon holati
  const [picked, setPicked] = useState(null); // tanlangan variant
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash arki qayta o'ynatilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  const hop = Math.round(pos / STEP);          // 0..5 (quyon nechinchi ustunda)
  const leftPct = ((hop + 0.5) / COLS) * 100;  // ustun markaziga to'g'rilangan
  const finished = pos >= TARGET;              // 5 sakrash tugadi — variantlar chiqadi

  // RESTORE: studentAnswer = { pos, value } dan tiklaydi (msg doim; setChecked faqat to'g'rida).
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      let p = Math.max(0, Math.min(Number(sa.pos) || 0, TARGET));
      p = Math.round(p / STEP) * STEP;
      setPos(p);
      if (sa.value != null) setPicked(sa.value);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const lock = isReview || checked;
  const doHop = () => {
    if (lock || pos >= TARGET) return; // 25 da to'xtaydi
    setPos((p) => Math.min(p + STEP, TARGET));
  };

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask2}`, options: OPTIONS.map(String), studentAnswer: { pos, value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, pos, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2310">
      <style>{`
        .pq2310{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2310 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2310 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2310 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2310 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2310 .pq-scene{position:relative;width:440px;max-width:100%;height:216px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 44%,#cdeeb6 70%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2310 .pq-sun{position:absolute;left:14px;top:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2310sun 3.6s ease-in-out infinite;}
        .pq2310 .pq-cloud{position:absolute;height:14px;background:#fff;border-radius:20px;box-shadow:0 5px 0 -2px #fff;opacity:.94;z-index:1;pointer-events:none;}
        .pq2310 .pq-cloud::before,.pq2310 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2310 .pq-cloud::before{width:20px;height:20px;top:-8px;left:7px;} .pq2310 .pq-cloud::after{width:14px;height:14px;top:-5px;left:23px;}
        .pq2310 .pq-cloud.c1{top:22px;left:52%;width:40px;animation:pq2310drift 15s ease-in-out infinite;}
        .pq2310 .pq-cloud.c2{top:44px;left:30%;width:30px;transform:scale(.82);animation:pq2310drift 19s ease-in-out infinite reverse;}
        .pq2310 .pq-branch{position:absolute;z-index:1;pointer-events:none;transform-origin:top center;animation:pq2310sway 4.2s ease-in-out infinite;}
        .pq2310 .pq-branch.r{right:-6px;top:16px;animation-delay:-1.6s;}
        .pq2310 .pq-bfly{position:absolute;width:8px;height:8px;z-index:4;pointer-events:none;}
        .pq2310 .pq-bfly::before,.pq2310 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq2310 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2310wing .26s ease-in-out infinite alternate;}
        .pq2310 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2310wing .26s ease-in-out infinite alternate;}
        .pq2310 .pq-bfly.bf1{top:70px;left:30%;animation:pq2310flit 9s ease-in-out infinite;}
        .pq2310 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:40px;background:radial-gradient(120% 100% at 50% 100%,#a6d67c 0%,#8fca6b 60%,#7cbd5a 100%);z-index:1;pointer-events:none;}
        .pq2310 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2310 .pq-lane{position:absolute;left:12px;right:12px;bottom:14px;height:130px;z-index:3;}
        .pq2310 .pq-track{position:absolute;left:0;right:0;bottom:0;display:flex;gap:5px;}
        .pq2310 .pq-cell{flex:1 1 0;min-width:0;}
        .pq2310 .pq-start{height:48px;border-radius:11px;display:flex;align-items:flex-end;justify-content:center;}
        .pq2310 .pq-tile{height:48px;border-radius:11px;border:2.5px dashed #a9c4a0;background:rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#8aab7b;font-variant-numeric:tabular-nums;transition:border-color .2s,background .2s,color .2s;}
        .pq2310 .pq-tile.step{border-style:solid;border-color:#7cbd5a;background:rgba(255,255,255,.8);color:#6a9a52;}
        .pq2310 .pq-tile.lit{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 3px 6px rgba(26,127,67,.18);}
        .pq2310 .pq-tile.win{animation:pq2310cele .5s ease;}
        /* Quyon — tugma bilan siljiydi (gorizontal transition + ark) */
        .pq2310 .pq-rabbit{position:absolute;bottom:56px;transform:translateX(-50%);transition:left .42s cubic-bezier(.34,1.3,.5,1);z-index:5;pointer-events:none;}
        .pq2310 .pq-rabbit.still{transition:none;}
        .pq2310 .pq-hopwrap{animation:pq2310hop .42s cubic-bezier(.34,1.2,.5,1) both;}
        .pq2310 .pq-hopwrap.still{animation:none;}

        .pq2310 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2310tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2310 .pq-spark.s2{animation-delay:-.6s;} .pq2310 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2310 .pq-seq{text-align:center;margin-top:14px;font-size:18px;font-weight:800;color:#5c7fa6;letter-spacing:.05em;font-variant-numeric:tabular-nums;animation:pq2310in .3s .05s both;}
        .pq2310 .pq-seq b{color:#1a7f43;}

        .pq2310 .pq-tools{display:flex;justify-content:center;margin-top:16px;}
        .pq2310 .pq-hopbtn{display:inline-flex;align-items:center;gap:9px;padding:11px 20px 11px 14px;border-radius:16px;border:2.5px solid #9ab7c9;background:linear-gradient(#eef7fd,#d6ebf7);color:#2f6bab;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #9ab7c9;transition:.12s;}
        .pq2310 .pq-hopbtn:hover:not(:disabled){filter:brightness(1.04);transform:translateY(-1px);}
        .pq2310 .pq-hopbtn:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #9ab7c9;}
        .pq2310 .pq-hopbtn:disabled{background:#eceae6;border-color:#c9c6c0;color:#9a968f;box-shadow:0 3px 0 #c9c6c0;cursor:default;}
        .pq2310 .pq-hopbtn .ic{width:30px;height:28px;flex:0 0 auto;}
        .pq2310 .pq-hopbtn .amt{font-size:19px;font-weight:900;line-height:1;padding:2px 8px;border-radius:999px;background:#2f6bab;color:#fff;font-variant-numeric:tabular-nums;}
        .pq2310 .pq-hopbtn:disabled .amt{background:#b3b0aa;}

        .pq2310 .pq-q2{text-align:center;margin-top:16px;font-size:19px;font-weight:800;color:#1f2430;font-variant-numeric:tabular-nums;animation:pq2310in .3s ease both;}
        .pq2310 .pq-opts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:12px;animation:pq2310in .3s .05s both;}
        .pq2310 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2310 .pq-opt:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq2310 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2310 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2310 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2310cele .5s ease;}
        .pq2310 .pq-opt:disabled{cursor:default;}

        .pq2310 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2310in .22s ease both;}
        .pq2310 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2310 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2310hop{0%{transform:translateY(0);}42%{transform:translateY(-20px);}72%{transform:translateY(-4px);}100%{transform:translateY(0);}}
        @keyframes pq2310sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2310drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq2310sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2310wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2310flit{0%,100%{transform:translate(0,0);}25%{transform:translate(30px,-12px);}50%{transform:translate(56px,8px);}75%{transform:translate(24px,-6px);}}
        @keyframes pq2310tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2310cele{0%{transform:scale(1);}30%{transform:scale(1.07);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2310in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{finished ? t.ask2 : t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <svg className="pq-branch r" width="60" height="42" viewBox="0 0 60 42" aria-hidden="true"><path d="M60,6 Q32,3 16,15" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g stroke="#a6291f" strokeWidth=".6"><circle cx="24" cy="17" r="5" fill="#e8443a" /><circle cx="36" cy="12" r="4.4" fill="#e8443a" /></g><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M40,5 Q34,1 33,6 Q38,8 40,5 Z" /><path d="M27,9 Q21,5 20,10 Q25,12 27,9 Z" /></g></svg>
        <span className="pq-bfly bf1" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-lane">
          <div className={'pq-rabbit' + (still ? ' still' : '')} style={{ left: leftPct + '%' }}>
            <div className={'pq-hopwrap' + (still ? ' still' : '')} key={still ? 'static' : hop}>
              <Bunny w={46} />
            </div>
          </div>
          <div className="pq-track">
            <div className="pq-cell">
              <div className="pq-start" aria-hidden="true">
                <svg width="34" height="30" viewBox="0 0 34 30"><ellipse cx="17" cy="27" rx="16" ry="4" fill="#6fae4e" opacity=".5" /><path d="M4,26 Q6,15 9,26 M9,26 Q11,13 14,26 M20,26 Q22,14 25,26 M25,26 Q27,16 30,26" fill="none" stroke="#4f9440" strokeWidth="2" strokeLinecap="round" /><ellipse cx="17" cy="24" rx="7" ry="4.4" fill="#5a3a22" /></svg>
              </div>
            </div>
            {TILES.map((val) => {
              const reached = pos >= val;               // qo'ngan tayl (soni hali yashirin)
              const winTile = reached && val === TARGET && ok;
              const cls = ok && reached ? ' lit' : (reached ? ' step' : '');
              return (
                <div className="pq-cell" key={val}>
                  <div className={'pq-tile' + cls + (winTile ? ' win' : '')}>{ok && reached ? val : '?'}</div>
                </div>
              );
            })}
          </div>
        </div>

        <span className="pq-hill" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '48px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '60px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '38px' }}>✦</span>
        </>)}
      </div>

      {ok && (<div className="pq-seq">5 · 10 · 15 · 20 · <b>25</b></div>)}

      {!finished ? (
        <div className="pq-tools">
          <button type="button" className="pq-hopbtn" disabled={lock || pos >= TARGET} onClick={doHop}>
            <svg className="ic" viewBox="0 0 52 48" aria-hidden="true"><ellipse cx="24" cy="34" rx="15" ry="9" fill="#d7c8b7" stroke="#b09a7e" strokeWidth="1" /><circle cx="9" cy="30" r="5" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" /><circle cx="39" cy="25" r="9" fill="#ddcfbf" stroke="#b09a7e" strokeWidth="1" /><path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="#ddcfbf" stroke="#a8977f" strokeWidth="1" /><ellipse cx="41.6" cy="23.4" rx="2" ry="2.3" fill="#3a322c" /></svg>
            <span>{t.btn}</span>
            <span className="amt">+5</span>
          </button>
        </div>
      ) : (
        <>
          <div className="pq-q2">{t.ask2}</div>
          <div className="pq-opts">
            {OPTIONS.map((n) => {
              const sel = picked === n; const right = ok && n === TARGET;
              return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
            })}
          </div>
        </>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
