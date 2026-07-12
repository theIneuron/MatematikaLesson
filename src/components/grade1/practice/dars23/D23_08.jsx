// Dars23 · Amaliyot 08 — Sanoq «Olma bog'i» · skip-count by tens (ko'p-tanlov) · 🔴 · tag: skip_multi
// Ko'p-tanlov: 5 son-tayl — 20, 25, 40, 35, 60. 10 lab sanoqda UCHRAYDIGAN barcha sonni belgilash.
// TO'G'RI to'plam = {20, 40, 60} (oxiri 0). Tuzoqlar: 25, 35 (oxiri 5 — 5 lab sanoqda, 10 lab EMAS).
// MODEL: son TAYLLARI (kartalar), quyon 10 lab yo'lakchada sakraydi. G'alabada to'g'ri tayllar
// yashil bo'ladi, ustiga savat (bitta o'nlik) chiqadi, pastda 10 lab yo'lakcha ochiladi:
// 10 · 20 · 30 · 40 · 50 · 60 (uchraganlari yashil). Qadam doim bir xil: har safar 10 ga ortadi.
// LEAK yo'q: g'alabagacha barcha kartalar bir xil (oddiy son-tayl), to'g'ri javob ko'rinmaydi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const STEP = 10;
const CARDS = [20, 25, 40, 35, 60];         // ko'rsatiladigan son-tayllar (variantlar)
const isTen = (n) => n % 10 === 0;          // 10 lab sanoqda uchraydimi (oxiri 0)
const GOOD = CARDS.map((n, i) => (isTen(n) ? i : -1)).filter((i) => i >= 0); // [0, 2, 4] -> 20, 40, 60
const TRACK = [10, 20, 30, 40, 50, 60];     // g'alabada ochiladigan 10 lab yo'lakcha
const GOODVALS = CARDS.filter(isTen);       // [20, 40, 60]
const DATA = { cards: CARDS, good: GOOD, target: GOODVALS, step: STEP, options: CARDS, ptype: 'P08', level: '🔴', tag: 'skip_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Sanoq",
    title: "10 lab sonlar",
    setup: "Sonlarga qarang.",
    ask: "10 lab sanoqda uchraydigan BARCHA sonni bosing.",
    correct: "Barakalla! 20, 40, 60 — hammasi 10 lab sanoqda.",
    hint: "10 lab: 10, 20, 30... Oxiri 0 bo'lgan sonlar.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Счёт",
    title: "Числа по 10",
    setup: "Посмотри на числа.",
    ask: "Нажми ВСЕ числа из счёта по 10.",
    correct: "Молодец! 20, 40, 60 — все из счёта по 10.",
    hint: "По 10: 10, 20, 30... Числа, которые кончаются на 0.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

let __rid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma) — Dars21 dan uzviy. G'alabada to'g'ri tayl ustida ko'rinadi.
const Basket = ({ w = 30 }) => {
  const id = 'pq2308b' + (__rid++);
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
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// QUYON — 2-ton tana + quloqlar + dumcha, o'ngga qaragan. Yo'lakchada 10 lab sakraydi.
const Rabbit = ({ w = 46 }) => {
  const id = 'pq2308r' + (__rid++);
  const h = w * 46 / 52;
  return (
    <svg viewBox="0 0 52 46" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="40%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="62%" stopColor="#eef1f6" /><stop offset="100%" stopColor="#cdd4e0" />
        </radialGradient>
      </defs>
      <circle cx="7" cy="30" r="5.4" fill="#ffffff" stroke="#c3cad7" strokeWidth="1" />
      <ellipse cx="17" cy="31" rx="11" ry="9" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1.2" />
      <ellipse cx="27" cy="28" rx="13" ry="10" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1.2" />
      <ellipse cx="34" cy="37" rx="4" ry="3" fill="#eef1f6" stroke="#c3cad7" strokeWidth="1" />
      <circle cx="39" cy="20" r="8.4" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1.2" />
      <ellipse cx="36.5" cy="8" rx="2.8" ry="8" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1" transform="rotate(-12 36.5 8)" />
      <ellipse cx="42.5" cy="8" rx="2.8" ry="8" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1" transform="rotate(6 42.5 8)" />
      <ellipse cx="36.5" cy="9" rx="1.2" ry="5" fill="#f6b8c4" transform="rotate(-12 36.5 9)" />
      <ellipse cx="42.5" cy="9" rx="1.2" ry="5" fill="#f6b8c4" transform="rotate(6 42.5 9)" />
      <circle cx="42" cy="19" r="1.5" fill="#31384a" />
      <circle cx="46.4" cy="22" r="1.5" fill="#f28ea2" />
      <path d="M46.4 23.4 L46.4 25" stroke="#b9758a" strokeWidth=".8" strokeLinecap="round" />
    </svg>
  );
};

export default function D23_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => isTen(CARDS[i]));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(String), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2308">
      <style>{`
        .pq2308{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2308 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2308 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2308 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2308 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2308 .pq-scene{position:relative;width:360px;max-width:100%;height:150px;margin:0 auto;border-radius:20px;background:linear-gradient(#d6efff 0%,#e6f4ea 56%,#d8eecb 100%);border:2px solid #cfe0cd;overflow:hidden;}
        .pq2308 .pq-sun{position:absolute;left:16px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2308sun 3.6s ease-in-out infinite;}
        .pq2308 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.85;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2308sway 4.4s ease-in-out infinite;}
        .pq2308 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2308 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2308 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#b9d98f,#9cc26e);border-top:3px solid #86ad5c;z-index:1;pointer-events:none;}
        .pq2308 .pq-deco{position:absolute;bottom:18px;z-index:2;line-height:0;pointer-events:none;opacity:.92;}
        .pq2308 .pq-rabbit{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 3px rgba(50,60,80,.22));}
        .pq2308 .pq-rabbit.bob{animation:pq2308bob 2.6s ease-in-out infinite;}
        .pq2308 .pq-rabbit.hop{animation:pq2308hop .55s cubic-bezier(.4,1.5,.5,1) both;}

        .pq2308 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2308twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2308 .pq-spark.s2{animation-delay:-.6s;} .pq2308 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2308 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;margin-top:16px;}
        .pq2308 .pq-card{position:relative;width:88px;min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:8px 6px 12px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.13s;box-shadow:0 2px 5px rgba(80,110,80,.12);font-family:inherit;}
        .pq2308 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,110,80,.2);}
        .pq2308 .pq-card:active:not(:disabled){transform:scale(.96);}
        .pq2308 .pq-card:disabled{cursor:default;}
        .pq2308 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2308 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2308cele .55s ease;}
        .pq2308 .pq-card.dim{opacity:.44;filter:grayscale(.32);}
        .pq2308 .pq-cbk{height:40px;display:flex;align-items:flex-end;justify-content:center;line-height:0;pointer-events:none;}
        .pq2308 .pq-cbk .pop{animation:pq2308pop .4s ease both;}
        .pq2308 .pq-cnum{font-size:30px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;}
        .pq2308 .pq-card.won .pq-cnum{color:#1a7f43;}
        .pq2308 .pq-cspark{position:absolute;top:6px;right:9px;line-height:0;pointer-events:none;animation:pq2308twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2308 .pq-track{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;margin-top:16px;animation:pq2308in .3s ease both;}
        .pq2308 .pq-track b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #cbd6c2;color:#7a8ba0;font-variant-numeric:tabular-nums;}
        .pq2308 .pq-track b.hit{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2308 .pq-track i{font-style:normal;font-size:16px;font-weight:900;color:#b3bccb;}

        .pq2308 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2308in .22s ease both;}
        .pq2308 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2308 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2308bob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pq2308hop{0%{transform:translateX(-50%) translateY(0);}45%{transform:translateX(-50%) translateY(-24px);}100%{transform:translateX(-50%) translateY(0);}}
        @keyframes pq2308sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2308sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2308twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2308cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2308pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2308in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ right: '18px', top: '26px' }}>❧</span>
        <span className="pq-leaf l2" style={{ left: '20px', bottom: '40px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <span className="pq-deco" style={{ left: '10px' }} aria-hidden="true"><Basket w={28} /></span>
        <span className="pq-deco" style={{ right: '10px' }} aria-hidden="true"><Basket w={24} /></span>

        <span className={'pq-rabbit ' + (ok && !still ? 'hop' : still ? '' : 'bob')} aria-hidden="true"><Rabbit w={46} /></span>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '30px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '78%', top: '40px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '20px' }}>✦</span>
        </>)}
      </div>

      <div className="pq-cards">
        {CARDS.map((n, i) => {
          const good = isTen(n);
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
          return (
            <button key={i} type="button" className={'pq-card' + cls} disabled={lock} onClick={() => toggle(i)} aria-label={String(n)}>
              <div className="pq-cbk">{ok && good && <span className="pop"><Basket w={30} /></span>}</div>
              <div className="pq-cnum">{n}</div>
              {ok && good && <span className="pq-cspark"><Star fill="#f2b134" /></span>}
            </button>
          );
        })}
      </div>

      {ok && (
        <div className="pq-track">
          {TRACK.map((v, k) => (
            <React.Fragment key={v}>
              <b className={GOODVALS.includes(v) ? 'hit' : ''}>{v}</b>
              {k < TRACK.length - 1 && <i>·</i>}
            </React.Fragment>
          ))}
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
