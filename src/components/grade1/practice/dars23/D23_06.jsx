// Dars23 · Amaliyot 06 — Mantiq «Olma bog'i» · qadamni aniqlash · 🔴 · tag: logic_step
// Bitta-tanlov (YANGI mantiq = qadamni aniqlash): 20, 30, 40, 50 ketma-ketligida sanoq qadami qancha? -> 10.
// Distraktorlar: 5 (M2 noto'g'ri qadam — bittalab/yarim qadam), 20 (ikki sakrashni bitta deb hisoblash).
// VIZUAL MODEL: diskret son TAYLLARI bir qatorda (tayl-yo'lak) + sakrayotgan QUYON. Quyon bir tayldan
// ikkinchisiga bir xil qadam bilan sakraydi; har sakrash ustida punktir yoy va qadam nishoni turadi.
// JAVOB OSHKOR EMAS: qadam nishonlari yechilmaguncha "?" ko'rsatadi; "+10" faqat g'alabada ochiladi.
// Taylardagi 20,30,40,50 — bu SHARTDA berilgan sonlar (savol matni ham shu), leak emas.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [20, 30, 40, 50];   // shartda berilgan ketma-ketlik (tayl-yo'lak)
const STEP = 10;                // to'g'ri javob: sanoq qadami
const DATA = { seq: SEQ, target: STEP, options: [10, 5, 20], ptype: 'LOGIC', level: '🔴', tag: 'logic_step' };

// Tayl-yo'lak geometriyasi (SVG user birliklari): 4 tayl, markazlari CX, oraliq 75.
const CX = [40, 115, 190, 265];
const HOME = CX[0];             // quyonning boshlang'ich (chap) ustuni
const SPAN = CX[CX.length - 1] - CX[0]; // 225 — chapdan o'ngga to'liq yo'l

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

let __uid = 0;

export default function D23_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 10 | 5 | 20
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const uid = useRef('pq2306_' + (__uid++)).current;
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
  const rid = uid + 'rb';
  const aid = uid + 'ap';
  // Quyon: yechilmaguncha bir tayldan ikkinchisiga sakraydi (bosiladigan nishon EMAS — dekor);
  // to'g'rida oxirgi taylga qo'nadi. Review/qayta ochilishda darhol qo'ngan holatda.
  const hopperCls = 'pq-hopper' + (ok ? (still ? ' landed' : ' land') : (still ? '' : ' hop'));

  return (
    <div className="pq pq2306">
      <style>{`
        .pq2306{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2306 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2306 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2306 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2306 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2306 .pq-scene{position:relative;width:360px;max-width:100%;height:214px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2306 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2306sun 3.6s ease-in-out infinite;}
        .pq2306 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:48px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2306 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2306 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2306 .pq-leaf{position:absolute;top:-10px;width:9px;height:9px;background:#7cbf5f;border-radius:0 100% 0 100%;z-index:2;pointer-events:none;opacity:.85;}
        .pq2306 .pq-leaf.l1{left:22%;animation:pq2306leaf 6.5s linear infinite;}
        .pq2306 .pq-leaf.l2{left:66%;background:#e0a24a;animation:pq2306leaf 8s linear .8s infinite;}

        .pq2306 .pq-trwrap{position:absolute;left:8px;right:8px;top:44px;bottom:12px;display:flex;align-items:center;justify-content:center;z-index:3;}
        .pq2306 .pq-tr{display:block;width:100%;height:auto;}
        .pq2306 .pq-hopper{transform-box:fill-box;transform-origin:center;}
        .pq2306 .pq-hopper.hop{animation:pq2306hop 3.8s ease-in-out infinite;}
        .pq2306 .pq-hopper.land{animation:pq2306land .82s cubic-bezier(.3,1.3,.5,1) both;}
        .pq2306 .pq-hopper.landed{transform:translate(${SPAN}px,0);}
        .pq2306 .pq-arc{animation:pq2306arc 1.9s ease-in-out infinite;}

        .pq2306 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2306tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2306 .pq-spark.s2{animation-delay:-.6s;} .pq2306 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2306 .pq-chain{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2306in .3s ease both;}
        .pq2306 .pq-chain b{min-width:46px;height:42px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2306 .pq-chain i{font-style:normal;min-width:38px;height:26px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;border-radius:999px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-variant-numeric:tabular-nums;}

        .pq2306 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2306 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2306 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2306 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2306 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2306 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2306cele .5s ease;}
        .pq2306 .pq-opt:disabled{cursor:default;}
        .pq2306 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2306in .22s ease both;}
        .pq2306 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2306 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2306hop{
          0%{transform:translate(0,0);opacity:1;}
          10%{transform:translate(37px,-20px);}
          20%{transform:translate(75px,0);}
          30%{transform:translate(112px,-20px);}
          40%{transform:translate(150px,0);}
          50%{transform:translate(187px,-20px);}
          60%{transform:translate(${SPAN}px,0);}
          78%{transform:translate(${SPAN}px,0);opacity:1;}
          84%{opacity:0;}
          85%{transform:translate(0,0);opacity:0;}
          92%{opacity:1;}
          100%{transform:translate(0,0);opacity:1;}
        }
        @keyframes pq2306land{0%{transform:translate(0,0);}55%{transform:translate(${SPAN}px,-22px);}100%{transform:translate(${SPAN}px,0);}}
        @keyframes pq2306arc{0%,100%{opacity:.45;}50%{opacity:1;}}
        @keyframes pq2306sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2306leaf{0%{transform:translateY(0) rotate(0);opacity:0;}12%{opacity:.85;}100%{transform:translateY(200px) rotate(320deg);opacity:0;}}
        @keyframes pq2306tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2306cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2306in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-hill" />
        <span className="pq-leaf l1" /><span className="pq-leaf l2" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-trwrap">
          <svg className="pq-tr" viewBox="0 0 320 132" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <radialGradient id={rid} cx="40%" cy="30%" r="78%">
                <stop offset="0%" stopColor="#ffffff" /><stop offset="58%" stopColor="#e2e6ee" /><stop offset="100%" stopColor="#c4c9d4" />
              </radialGradient>
              <radialGradient id={aid} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
              </radialGradient>
            </defs>

            {/* bog' bezaklari: hilol tepasida ikkita kichik olma (dekor, bosilmaydi) */}
            <g opacity=".9">
              <circle cx="18" cy="120" r="5" fill={`url(#${aid})`} stroke="#a5342c" strokeWidth=".8" />
              <path d="M18 115 Q20 112 22 113" fill="none" stroke="#7a4a28" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="303" cy="122" r="4.4" fill={`url(#${aid})`} stroke="#a5342c" strokeWidth=".8" />
              <path d="M303 117.6 Q305 115 307 116" fill="none" stroke="#7a4a28" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* sakrash yoylari + qadam nishonlari: har oraliq ustida punktir yoy, cho'qqisida nishon.
                Yechilmaguncha "?" (qadam yashirin); g'alabada "+10" ochiladi. */}
            {CX.slice(0, -1).map((x1, i) => {
              const x2 = CX[i + 1];
              const midX = (x1 + x2) / 2;
              return (
                <g key={'arc' + i}>
                  <path className={ok ? '' : 'pq-arc'} d={`M${x1} 68 Q${midX} 34 ${x2} 68`} fill="none"
                    stroke={ok ? '#1a7f43' : '#c9822f'} strokeWidth="2.4" strokeDasharray="3 4" strokeLinecap="round" opacity={ok ? .9 : .8} />
                  {ok ? (
                    <g>
                      <rect x={midX - 17} y="30" width="34" height="19" rx="9.5" fill="#e8f7ee" stroke="#1a7f43" strokeWidth="2" />
                      <text x={midX} y="43.4" textAnchor="middle" fontSize="12" fontWeight="900" fontFamily="Manrope, system-ui, sans-serif" fill="#1a7f43">+10</text>
                    </g>
                  ) : (
                    <g>
                      <circle cx={midX} cy="39" r="10" fill="#fff" stroke="#e0b96a" strokeWidth="2" />
                      <text x={midX} y="43.6" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="Manrope, system-ui, sans-serif" fill="#c9822f">?</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* tayl-yo'lak: 4 ta diskret son tayli (shartda berilgan sonlar) */}
            {SEQ.map((n, i) => {
              const x = CX[i];
              return (
                <g key={'tile' + i}>
                  <rect x={x - 26} y="76" width="52" height="40" rx="10"
                    fill={ok ? '#e8f7ee' : '#ffffff'} stroke={ok ? '#1a7f43' : '#cbd6c2'} strokeWidth="2.4"
                    style={ok ? { filter: 'drop-shadow(0 2px 3px rgba(26,127,67,.18))' } : { filter: 'drop-shadow(0 2px 3px rgba(60,80,50,.12))' }} />
                  <text x={x} y="102.5" textAnchor="middle" fontSize="21" fontWeight="900" fontFamily="Manrope, system-ui, sans-serif"
                    fill={ok ? '#1a7f43' : '#374151'} style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</text>
                </g>
              );
            })}

            {/* QUYON: chap tayldan boshlab bir xil qadam bilan sakraydi (dekor — pointer-events yo'q).
                translate(HOME, ...) uy holati; ichki .pq-hopper harakati oraliq (px = user birligi). */}
            <g transform={`translate(${HOME} 60)`} style={{ pointerEvents: 'none' }}>
              <g className={hopperCls}>
                {/* soya */}
                <ellipse cx="-2" cy="16" rx="12" ry="2.6" fill="rgba(60,90,40,.18)" />
                {/* dumaloq oq dum */}
                <circle cx="-13" cy="6" r="4.6" fill="#ffffff" stroke="#c4c9d4" strokeWidth="1" />
                {/* tana (o'tirgan) */}
                <ellipse cx="-4" cy="6" rx="11" ry="9" fill={`url(#${rid})`} stroke="#b3b9c6" strokeWidth="1.1" />
                {/* orqa panja */}
                <ellipse cx="-3" cy="14.5" rx="7.5" ry="3" fill="#eef0f4" stroke="#c4c9d4" strokeWidth=".9" />
                {/* bosh */}
                <circle cx="8" cy="-1" r="7.6" fill={`url(#${rid})`} stroke="#b3b9c6" strokeWidth="1.1" />
                {/* quloqlar (ikki-ton: tashqi kulrang + ichki pushti) */}
                <path d="M4 -6 C1 -16 2.5 -27 5.5 -28 C8.2 -27 8 -16 7 -6 Z" fill={`url(#${rid})`} stroke="#b3b9c6" strokeWidth="1" />
                <path d="M5.4 -8 C3.6 -15 4.6 -24 5.8 -25 C7 -24 6.7 -15 6.4 -8 Z" fill="#f6b6c6" opacity=".9" />
                <path d="M10 -6 C9 -16 12 -25 15 -25 C17.4 -23.4 16 -14 13.4 -6 Z" fill={`url(#${rid})`} stroke="#b3b9c6" strokeWidth="1" />
                <path d="M11.2 -8 C10.6 -15 12.6 -22 14.2 -22.4 C15.4 -21 14.4 -14 12.9 -8 Z" fill="#f6b6c6" opacity=".9" />
                {/* ko'z + burun */}
                <circle cx="10.4" cy="-2.2" r="1.7" fill="#2f3440" />
                <circle cx="10.9" cy="-2.8" r=".5" fill="#fff" />
                <ellipse cx="15" cy="1" rx="1.7" ry="1.3" fill="#e77b93" />
                {/* old panja */}
                <ellipse cx="9" cy="13" rx="4.2" ry="2.6" fill="#eef0f4" stroke="#c4c9d4" strokeWidth=".9" />
              </g>
            </g>
          </svg>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '80%', top: '64px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
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
