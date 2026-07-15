// Dars24 · Amaliyot 06 — Mantiq «Bir xil javob» «Olma bog'i» · 🔴 · tag: logic_equal
// Bitta-tanlov (YANGI mantiq = bir xil natija): 30 + 20 = 50. Yana qaysi misol 50 beradi?
// Javob: 70 − 20 = 50. Chalg'ituvchilar: 40 + 20 = 60 (bir o'nlik ortiq), 90 − 50 = 40 (bir o'nlik kam).
// Model (Dars 21-23 kanoni): bir o'nlik = bitta olma SAVATI (10 olma, "10" nishoni). 30 + 20 —
// 3 savat va 2 savat BIRLASHADI = 5 savat = 50. Bola savatlarni o'nliklab sanaydi: 10, 20, 30, 40, 50.
// JAVOB OSHKOR EMAS: to'g'ri misol g'alabagacha belgilanmaydi; 70 − 20 = 50 faqat g'alabada ochiladi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
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

const MIN = "−";                 // ayirish belgisi — U+2212, ASCII defis EMAS
const A_TENS = 3, B_TENS = 2, RESULT = 50; // berilgan: 30 + 20 = 50 (5 savat)
const OPTS = [`70 ${MIN} 20`, "40 + 20", `90 ${MIN} 50`]; // misol-satrlar
const TARGET = OPTS[0];               // 70 − 20 = 50 — 30 + 20 bilan bir xil
const DATA = { given: "30 + 20 = 50", result: RESULT, options: OPTS, answer: TARGET, level: '🔴', tag: 'logic_equal' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Bir xil javob",
    setup: "30 + 20 = 50.",
    ask: "Qaysi misol ham 50 beradi?",
    correct: `Barakalla! 70 ${MIN} 20 = 50, xuddi 30 + 20 kabi.`,
    hint: "Har misolni o'nliklab sanang, javobi 50 bo'lganini toping.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Такой же ответ",
    setup: "30 + 20 = 50.",
    ask: "Какой пример тоже даёт 50?",
    correct: `Молодец! 70 ${MIN} 20 = 50, как и 30 + 20.`,
    hint: "Считай каждый пример десятками, найди тот, что равен 50.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT (bitta o'nlik = 10 olma bir birlikka bog'langan): to'qima savat, ustidan olmalar mo'ralaydi,
// oldida yashil «10» nishoni. Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta o'nlik.
// Dars 21 kanoni (D21_03) — o'zgarishsiz ko'chirilgan, id-lar pq2406b bilan namespace qilingan.
const Basket = ({ w = 38 }) => {
  const id = 'pq2406b' + (__gid++);
  const ap = id + 'ap';
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      {/* olmalar to'plami savat ustidan mo'ralaydi */}
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      {/* savat gardishi */}
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      {/* savat tanasi */}
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      {/* tik to'qima */}
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      {/* ko'ndalang to'qima */}
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      {/* «10» nishoni — bu savat bitta o'nlik ekanini bildiradi */}
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

export default function D24_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // "70 − 20" | "40 + 20" | "90 − 50"
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda ambient jonlanish saqlanadi, sahna yakuniy holatdan boshlanadi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha savatlar yengil tebranadi (savatlar bosiladigan nishon EMAS — dekor)

  const cratesA = Array.from({ length: A_TENS });
  const cratesB = Array.from({ length: B_TENS });
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq2406" ref={fitRef}>
      <style>{`
        .pq2406{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2406 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2406 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2406 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2406 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2406 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:214px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2406 .pq-fit{position:relative;margin:0 auto;}
        .pq2406 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2406sun 3.6s ease-in-out infinite;}
        .pq2406 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2406 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2406 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2406 .pq-leaf{position:absolute;top:-10px;width:9px;height:9px;background:#7cbf5f;border-radius:0 100% 0 100%;z-index:2;pointer-events:none;opacity:.85;}
        .pq2406 .pq-leaf.l1{left:22%;animation:pq2406leaf 6.5s linear infinite;}
        .pq2406 .pq-leaf.l2{left:72%;background:#e0a24a;animation:pq2406leaf 8s linear .8s infinite;}

        .pq2406 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:12px;display:flex;align-items:center;justify-content:center;gap:5px;z-index:3;}
        .pq2406 .pq-grp{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2406 .pq-crates{display:flex;justify-content:center;gap:2px;}
        .pq2406 .pq-obj{line-height:0;}
        .pq2406 .pq-obj.idle{animation:pq2406bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2406 .pq-obj.win{animation:pq2406win .5s ease;animation-delay:var(--bd,0s);}
        .pq2406 .pq-badge{padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq2406 .pq-op{font-size:22px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;padding-bottom:16px;}
        .pq2406 .pq-target{align-self:center;min-width:44px;height:46px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:13px;background:#eef7ee;border:2.5px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;margin-bottom:16px;transition:.2s;}
        .pq2406 .pq-target.hit{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;animation:pq2406cele .5s ease;}

        .pq2406 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2406tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2406 .pq-spark.s2{animation-delay:-.6s;} .pq2406 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2406 .pq-chain{display:flex;justify-content:center;align-items:center;gap:5px;margin-top:14px;flex-wrap:wrap;animation:pq2406in .3s ease both;}
        .pq2406 .pq-chain b{min-width:38px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2406 .pq-chain b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2406 .pq-chain i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq2406 .pq-opts{display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
        .pq2406 .pq-opt{min-width:104px;height:66px;padding:0 12px;font-size:24px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2406 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2406 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2406 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2406 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2406cele .5s ease;}
        .pq2406 .pq-opt:disabled{cursor:default;}
        .pq2406 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2406in .22s ease both;}
        .pq2406 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2406 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2406bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2406win{0%{transform:scale(1);}30%{transform:scale(1.06) translateY(-2px);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2406sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2406leaf{0%{transform:translateY(0) rotate(0);opacity:0;}12%{opacity:.85;}100%{transform:translateY(200px) rotate(320deg);opacity:0;}}
        @keyframes pq2406tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2406cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2406in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 380 * scale, height: 214 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <span className="pq-leaf l1" /><span className="pq-leaf l2" />
        <div className="pq-title">{t.title}</div>

        {/* Berilgan tenglama savatlarda: 3 savat + 2 savat = 5 savat = 50 (o'nliklab sanaladi). */}
        <div className="pq-arena">
          <div className="pq-grp">
            <div className="pq-crates">
              {cratesA.map((_, i) => (
                <span key={i} className={'pq-obj' + (idle ? ' idle' : '') + (ok && !still ? ' win' : '')} style={{ '--bd': `${i * 0.1}s` }}>
                  <Basket w={38} />
                </span>
              ))}
            </div>
            <span className="pq-badge">30</span>
          </div>

          <span className="pq-op">{'+'}</span>

          <div className="pq-grp">
            <div className="pq-crates">
              {cratesB.map((_, i) => (
                <span key={i} className={'pq-obj' + (idle ? ' idle' : '') + (ok && !still ? ' win' : '')} style={{ '--bd': `${(A_TENS + i) * 0.1}s` }}>
                  <Basket w={38} />
                </span>
              ))}
            </div>
            <span className="pq-badge">20</span>
          </div>

          <span className="pq-op eq">=</span>

          <div className={'pq-target' + (ok ? ' hit' : '')}>{RESULT}</div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {/* G'alaba: bir xil natija ochiladi — 30 + 20 = 50 = 70 − 20 */}
      {ok && (
        <div className="pq-chain"><b>30</b><i>{'+'}</i><b>20</b><i>=</i><b className="res">{RESULT}</b><i>=</i><b>70</b><i>{MIN}</i><b>20</b></div>
      )}

      <div className="pq-opts">
        {OPTS.map((expr) => {
          const sel = picked === expr; const right = ok && expr === TARGET;
          return <button key={expr} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(expr); setFeedback(null); }}>{expr}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
