// Dars25 · Amaliyot 06 — Mantiq «Qaysi xona o'zgaradi?» · 🔴 · tag: logic_place
// Bitta-tanlov (so'z-tugmalar): 34 + 5 — qo'shganda qaysi xona o'zgaradi? To'g'ri javob: Birliklar.
// Sahna (Dars21 kanoni): 34 = 3 to'la savat (o'nlik, "10" nishoncha) + 4 yakka olma (birlik). Bir xonali
// son QO'SHILGANDA faqat BIRLIKLAR guruhiga yakka olma qo'shiladi — o'nlik savatlar O'ZGARMAYDI. Bu urokda
// AYIRISH YO'Q, minus belgisi YO'Q. G'alabada 5 yakka olma birliklarga qo'shilib 4 → 9 bo'ladi, o'nlik (3)
// joyida qoladi va 39 ochiladi (AnsPop). Chalg'ituvchi: "O'nliklar" (M1 — o'nlik o'zgarmaydi, qalqon).
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

const TENS = 3, UNITS = 4, ADD = 5;         // 34 + 5
const RESULT_UNITS = UNITS + ADD;           // 9 (birliklar yig'indisi < 10, o'tish yo'q)
const RESULT = TENS * 10 + RESULT_UNITS;    // 39
const KEY_RIGHT = "birliklar";              // to'g'ri: faqat birliklar o'zgaradi
const DATA = { a: 34, b: ADD, result: RESULT, options: ["birliklar", "onliklar"], answer: KEY_RIGHT, level: '🔴', tag: 'logic_place' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Qaysi xona o'zgaradi?",
    setup: "34 ga 5 ni qo'shamiz.",
    ask: "Qaysi xona o'zgaradi: birliklarmi yoki o'nliklarmi?",
    optU: "Birliklar", optT: "O'nliklar",
    correct: "Barakalla! Faqat birliklar o'zgaradi: 4 → 9. O'nlik (3) o'zgarmaydi.",
    hint: "5 — bu 5 ta yakka olma, ya'ni birliklar. Ular qaysi xonaga qo'shiladi?",
    lblT: "O'nliklar", lblU: "Birliklar",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Какой разряд меняется?",
    setup: "К 34 прибавляем 5.",
    ask: "Какой разряд изменится: единицы или десятки?",
    optU: "Единицы", optT: "Десятки",
    correct: "Молодец! Меняются только единицы: 4 → 9. Десяток (3) не меняется.",
    hint: "5 — это 5 отдельных яблок, то есть единицы. В какой разряд они попадут?",
    lblT: "Десятки", lblU: "Единицы",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars21 kanoni)
const Apple = ({ w = 28 }) => {
  const id = 'pq2506a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10» nishoni.
// Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi (o'nlik). (Dars21 kanoni)
const Basket = ({ w = 46 }) => {
  const id = 'pq2506b' + (__gid++);
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
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
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

export default function D25_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda qo'shilish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = picked === KEY_RIGHT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.optU, t.optT], studentAnswer: { value: picked }, correctAnswer: { value: KEY_RIGHT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bosiladigan nishon EMAS — dekor)

  const baskets = Array.from({ length: TENS });      // 3 o'nlik savati
  const startUnits = Array.from({ length: UNITS });  // boshlang'ich 4 birlik
  const joinUnits = Array.from({ length: ADD });     // qo'shiluvchi 5 birlik (faqat g'alabada)

  // So'z-tugmalar (raqam emas): birliklar / o'nliklar
  const OPTS = [
    { key: "birliklar", label: t.optU },
    { key: "onliklar", label: t.optT },
  ];
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq2506" ref={fitRef}>
      <style>{`
        .pq2506{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2506 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2506 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2506 .pq-setup{color:#5c6672;font-weight:700;font-variant-numeric:tabular-nums;}
        .pq2506 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2506 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:232px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2506 .pq-fit{position:relative;margin:0 auto;}
        .pq2506 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2506sun 3.6s ease-in-out infinite;}
        .pq2506 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2506 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2506 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2506 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:12px;display:flex;align-items:flex-end;justify-content:center;gap:10px;z-index:3;}
        .pq2506 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2506 .pq-baskets{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:170px;}
        .pq2506 .pq-apples{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;max-width:140px;}
        .pq2506 .pq-obj{line-height:0;}
        .pq2506 .pq-obj.idle{animation:pq2506bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2506 .pq-obj.join{animation:pq2506join .42s ease both;animation-delay:var(--jd,0s);}
        /* razryad yorlig'i (bezak, bosilmaydi) */
        .pq2506 .pq-tag{padding:2px 10px;border-radius:999px;font-weight:900;font-size:12px;letter-spacing:.02em;pointer-events:none;}
        .pq2506 .pq-tag.t{background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;}
        .pq2506 .pq-tag.u{background:#e8f7ee;border:2px solid #7fc79b;color:#1a7f43;}
        /* razryad qiymati nishonchasi — faqat g'alabada */
        .pq2506 .pq-gl{padding:1px 11px;border-radius:999px;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pq2506pop .38s ease both;}
        .pq2506 .pq-gl.same{border-color:#8a94a2;color:#5c6672;}
        .pq2506 .pq-gl.chg{border-color:#1a7f43;color:#1a7f43;}
        .pq2506 .pq-plus{font-size:22px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;pointer-events:none;}

        .pq2506 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2506tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2506 .pq-spark.s2{animation-delay:-.6s;} .pq2506 .pq-spark.s3{animation-delay:-1.15s;}

        /* AnsPop: 34 + 5 = 39, birlik raqami 4 → 9, o'nlik (3) o'zgarmaydi */
        .pq2506 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2506in .3s ease both;}
        .pq2506 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2506 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2506 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2506 .pq-sub{text-align:center;margin-top:6px;font-size:13.5px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2506in .3s .1s both;}
        .pq2506 .pq-sub .same{color:#5c6672;} .pq2506 .pq-sub .chg{color:#1a7f43;}

        .pq2506 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
        .pq2506 .pq-opt{min-width:150px;height:60px;padding:0 16px;font-size:20px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2506 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2506 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq2506 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2506 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2506cele .5s ease;}
        .pq2506 .pq-opt:disabled{cursor:default;}
        .pq2506 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2506in .22s ease both;}
        .pq2506 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2506 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2506bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2506join{from{opacity:0;transform:translateY(-14px) scale(.6);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2506sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2506pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2506tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2506cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2506in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 380 * scale, height: 232 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {/* 3 o'nlik savati — QO'SHGANDA O'ZGARMAYDI */}
          <div className="pq-group">
            <div className="pq-baskets">
              {baskets.map((_, i) => (
                <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                  <Basket w={44} />
                </span>
              ))}
            </div>
            {ok ? <span className="pq-gl same">{TENS} · {t.lblT}</span> : <span className="pq-tag t">{t.lblT}</span>}
          </div>

          <span className="pq-plus">{'+'}</span>

          {/* birliklar guruhi — bu yerga 5 yakka olma qo'shiladi (4 → 9) */}
          <div className="pq-group">
            <div className="pq-apples">
              {startUnits.map((_, i) => (
                <span key={'s' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(TENS + i) * 0.12}s` }}>
                  <Apple w={26} />
                </span>
              ))}
              {ok && joinUnits.map((_, i) => (
                <span key={'j' + i} className="pq-obj join" style={{ '--jd': `${0.15 + i * 0.14}s` }}>
                  <Apple w={26} />
                </span>
              ))}
            </div>
            {ok ? <span className="pq-gl chg">{UNITS} → {RESULT_UNITS} · {t.lblU}</span> : <span className="pq-tag u">{t.lblU}</span>}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {/* AnsPop: yig'indi FAQAT g'alabada ochiladi (oldindan ko'rsatilmaydi) */}
      {ok && (<>
        <div className="pq-eq"><b>34</b><i>{'+'}</i><b>{ADD}</b><i>=</i><b className="res">{RESULT}</b></div>
        <div className="pq-sub"><span className="same">{TENS} {t.lblT.toLowerCase()} — {TENS}</span> · <span className="chg">{t.lblU.toLowerCase()}: {UNITS} → {RESULT_UNITS}</span></div>
      </>)}

      <div className="pq-opts">
        {OPTS.map((o) => {
          const sel = picked === o.key; const right = ok && o.key === KEY_RIGHT;
          return <button key={o.key} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o.key); setFeedback(null); }}>{o.label}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
