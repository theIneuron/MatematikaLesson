// Dars21 · Amaliyot 06 — Mantiq «Olma bog'i» · skip-count by tens · 🔴 · tag: logic_skip10
// Bitta-tanlov (ketma-ketlik): 10, 20, 30, ?, 50 — qaysi son tushib qoldi? To'g'ri = 40.
// PLACE-VALUE KANONI: bitta o'nlik = bitta olma SAVATI (10 olmani bog'laydi, '10' nishoni bilan;
// bola savatdagi olmalarni qayta sanamaydi). Ketma-ketlik pog'ona bo'lib o'sadi: 1 savat, 2 savat,
// 3 savat, ? , 5 savat — har qadam yana bitta savat (o'nta) qo'shiladi. Tushib qolgan ustun bo'sh
// (dashed '?'), 30 va 50 orasida turadi. G'alabada bo'shliqqa 4 savat o'sib chiqadi, tayl «40» ochiladi,
// chip «30 + 10 = 40». Distraktorlar: 35 (+5 xato qadam), 45 (noto'g'ri qadam).
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
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

const SEQ = [10, 20, 30, 40, 50];   // pog'ona: har biri (i+1) savat
const MISS = 3;                     // tushib qolgan ustun indeksi (qiymati 40)
const TARGET = 40;
const DATA = { seq: SEQ, missIndex: MISS, target: TARGET, options: [40, 35, 45], ptype: 'LOGIC', level: '🔴', tag: 'logic_skip10' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "O'nlab sanash",
    setup: "O'nlab sanaymiz: 10, 20, 30, ?, 50.",
    ask: "«?» o'rnida qaysi son tushib qoldi?",
    correct: "Barakalla! O'nlab: o'ttizdan keyin qirq. 30, 40, 50.",
    hint: "Har qadam 10 ga ortadi. O'ttizga 10 qo'shing.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Счёт десятками",
    setup: "Считаем десятками: 10, 20, 30, ?, 50.",
    ask: "Какое число пропущено на месте «?»?",
    correct: "Молодец! Десятками: после тридцати — сорок. 30, 40, 50.",
    hint: "Каждый шаг больше на 10. Прибавь к тридцати 10.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SAVAT KANONI (bitta o'nlik): to'qilgan savat + tepasidan ko'rinib turgan olmalar + '10' nishoni.
// Bola savatni bir BUTUN o'nlik deb qabul qiladi (ichidagi olmalarni qayta sanamaydi).
let __bid = 0;
const Basket = ({ w = 27 }) => {
  const id = 'pq2106b' + (__bid++);
  return (
    <svg viewBox="0 0 40 40" width={w} height={w} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id + 'ap'} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ff9384" />
          <stop offset="52%" stopColor="#e2483b" />
          <stop offset="100%" stopColor="#a82c21" />
        </radialGradient>
        <linearGradient id={id + 'wk'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2a458" />
          <stop offset="100%" stopColor="#ac6c2a" />
        </linearGradient>
      </defs>
      {/* rimdan ko'rinib turgan olmalar (2-ton radial + blik + barg-band) */}
      <g>
        <circle cx="12" cy="17" r="6.2" fill={`url(#${id}ap)`} stroke="#8f2519" strokeWidth=".5" />
        <circle cx="27.2" cy="17" r="6.2" fill={`url(#${id}ap)`} stroke="#8f2519" strokeWidth=".5" />
        <circle cx="19.6" cy="12.8" r="6.9" fill={`url(#${id}ap)`} stroke="#8f2519" strokeWidth=".5" />
        <ellipse cx="10" cy="14.6" rx="1.7" ry="1" fill="#fff" opacity=".5" />
        <ellipse cx="17.3" cy="10.2" rx="2" ry="1.2" fill="#fff" opacity=".5" />
        <ellipse cx="25.2" cy="14.6" rx="1.7" ry="1" fill="#fff" opacity=".5" />
        <path d="M19.6 6.6 Q23.2 4.4 24.7 6.6 Q22.6 8.3 19.9 7.7 Z" fill="#5fb15a" stroke="#3f8038" strokeWidth=".4" />
        <path d="M19.6 7.6 L19.6 5.1" stroke="#7a4a24" strokeWidth="1" strokeLinecap="round" />
      </g>
      {/* savat tanasi (to'qima) */}
      <path d="M6 19 L34 19 L30.4 36 Q20 39.4 9.6 36 Z" fill={`url(#${id}wk)`} stroke="#8a561f" strokeWidth="1" strokeLinejoin="round" />
      <path d="M8 25 Q20 27.6 32 25 M8.8 30 Q20 32.6 31.2 30" fill="none" stroke="#8a561f" strokeWidth=".9" opacity=".55" />
      <path d="M13 20 L12 36 M20 20 L20 37.6 M27 20 L28 36" fill="none" stroke="#8a561f" strokeWidth=".8" opacity=".4" />
      {/* rim (og'iz) */}
      <rect x="5" y="16.6" width="30" height="4.6" rx="2.3" fill="#d1934a" stroke="#8a561f" strokeWidth="1" />
      {/* '10' nishoni — dekorativ, pointer-events yo'q */}
      <g style={{ pointerEvents: 'none' }}>
        <circle cx="32" cy="33" r="6.4" fill="#1f7a3d" stroke="#fff" strokeWidth="1.2" />
        <text x="32" y="35.5" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff" fontFamily="Manrope,sans-serif">10</text>
      </g>
    </svg>
  );
};

export default function D21_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda o'sish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(326);

  return (
    <div className="pq pq2106" ref={fitRef}>
      <style>{`
        .pq2106{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2106 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2106 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2106 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2106 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2106 .pq-scene{box-sizing:border-box;position:relative;width:326px;height:274px;border-radius:20px;background:linear-gradient(#d6efff 0%,#e6f4ea 58%,#d8eecb 100%);border:2px solid #cfe0cd;overflow:hidden;}
        .pq2106 .pq-fit{position:relative;margin:0 auto;}
        .pq2106 .pq-sun{position:absolute;left:16px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2106sun 3.6s ease-in-out infinite;}
        .pq2106 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.85;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2106sway 4.4s ease-in-out infinite;}
        .pq2106 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2106 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2106 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#b9d98f,#9cc26e);border-top:3px solid #86ad5c;z-index:1;}

        .pq2106 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:30px;display:flex;align-items:flex-end;justify-content:center;gap:7px;z-index:3;}
        .pq2106 .pq-col{display:flex;flex-direction:column;align-items:center;gap:5px;flex:0 0 auto;}
        .pq2106 .pq-stack{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;}
        .pq2106 .pq-bk{line-height:0;}
        .pq2106 .pq-bk.grow{animation:pq2106grow .42s cubic-bezier(.34,1.4,.5,1) both;animation-delay:var(--gd,0s);}
        .pq2106 .pq-ph{width:34px;height:116px;border-radius:9px;border:2.5px dashed #9ab6d6;background:rgba(255,255,255,.34);display:flex;align-items:center;justify-content:center;}
        .pq2106 .pq-q{font-size:34px;font-weight:900;color:#7a97b8;}
        .pq2106 .pq-tile{min-width:42px;height:30px;padding:0 6px;border-radius:9px;background:#fff;border:2px solid #cbd6c2;color:#374151;font-size:19px;font-weight:900;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;box-shadow:0 2px 3px rgba(60,80,50,.1);}
        .pq2106 .pq-tile.miss{border-style:dashed;border-color:#9ab6d6;background:#eef4fb;color:#7a97b8;}
        .pq2106 .pq-tile.win{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2106cele .5s ease;}

        .pq2106 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2106twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2106 .pq-spark.s2{animation-delay:-.6s;} .pq2106 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2106 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pq2106in .3s ease both;}
        .pq2106 .pq-eq b{min-width:38px;height:40px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2106 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2106 .pq-eq i{font-style:normal;font-size:21px;font-weight:900;color:#8a94a2;}
        .pq2106 .pq-seq{text-align:center;margin-top:7px;font-size:16px;font-weight:800;color:#5c7fa6;letter-spacing:.04em;font-variant-numeric:tabular-nums;animation:pq2106in .3s .1s both;}
        .pq2106 .pq-seq b{color:#1a7f43;}

        .pq2106 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq2106 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2106 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2106 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2106 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2106 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2106cele .5s ease;}
        .pq2106 .pq-opt:disabled{cursor:default;}
        .pq2106 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2106in .22s ease both;}
        .pq2106 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2106 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2106grow{0%{opacity:0;transform:translateY(10px) scale(.55);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2106sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2106sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2106twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2106cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2106in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 326 * scale, height: 274 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ right: '20px', top: '30px' }}>❧</span>
        <span className="pq-leaf l2" style={{ left: '20px', bottom: '34px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {SEQ.map((val, i) => {
            const tens = i + 1;               // ustundagi savatlar soni (o'nliklar)
            const isMiss = i === MISS;
            const reveal = isMiss && ok;      // g'alabada bo'shliq to'ladi
            return (
              <div className="pq-col" key={i}>
                <div className="pq-stack">
                  {isMiss && !ok ? (
                    <div className="pq-ph"><span className="pq-q">?</span></div>
                  ) : (
                    Array.from({ length: tens }).map((_, k) => (
                      <span key={k} className={'pq-bk' + (reveal && !still ? ' grow' : '')} style={reveal && !still ? { '--gd': `${0.1 + k * 0.14}s` } : undefined}>
                        <Basket w={27} />
                      </span>
                    ))
                  )}
                </div>
                <div className={'pq-tile' + (isMiss ? (reveal ? ' win' : ' miss') : '')}>{isMiss && !ok ? '?' : val}</div>
              </div>
            );
          })}
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '64px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-eq"><b>30</b><i>+</i><b>10</b><i>=</i><b className="res">40</b></div>
        <div className="pq-seq">10 · 20 · 30 · <b>40</b> · 50</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
