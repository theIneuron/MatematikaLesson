// Dars26 · Amaliyot 07 — To'g'ri-noto'g'ri «Olma bog'i» · tt_tf · 🔴
// Ekranda tenglik: "53 + 24 = 77". Savol: "Bu to'g'rimi?" Ikki tugma: "Ha" / "Yo'q".
// To'g'ri javob = "Ha" (53 + 24 haqiqatan 77). Model — razryad bo'yicha QO'SHISH (o'tishsiz):
// 53 = 5 savat (o'nlik) + 3 yakka olma (birlik); 24 = 2 savat + 4 olma. Savatlar savatlarga,
// olmalar olmalarga qo'shiladi: 5+2=7 o'nlik, 3+4=7 birlik -> 70 + 7 = 77. Ayirish YO'Q, ustun-usul YO'Q.
// Chalg'ituvchi tenglik shu ekranda EMAS — bu tekshirish; bola tenglikni razryad bo'yicha sanab
// tasdiqlaydi. VEDI-DO-VERNOGO: noto'g'ri "Yo'q" bosilsa qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 53, B = 24, SUM = 77;
const A_T = 5, A_U = 3;      // 53 = 5 o'nlik + 3 birlik
const B_T = 2, B_U = 4;      // 24 = 2 o'nlik + 4 birlik
const SUM_T = A_T + B_T;     // 7 o'nlik (o'tishsiz: 5+2<10)
const SUM_U = A_U + B_U;     // 7 birlik (o'tishsiz: 3+4<10)
const DATA = { a: A, b: B, sum: SUM, isTrue: true, correct: 'ha', ptype: 'tt_tf', level: '🔴', tag: 'tt_tf' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · To'g'ri-noto'g'ri", title: "Bu to'g'rimi?",
    setup: "Ekranda tenglik yozilgan: 53 + 24 = 77.",
    ask: "Bu tenglik to'g'rimi?",
    correct: "Barakalla! O'nliklar: 5+2=7, birliklar: 3+4=7. 53 + 24 = 77. Ha, to'g'ri.",
    hint: "O'nliklarni alohida (5+2), birliklarni alohida (3+4) qo'shing.",
    yes: "Ha", no: "Yo'q",
    tens: "o'nlik", units: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Верно-неверно", title: "Это верно?",
    setup: "На экране равенство: 53 + 24 = 77.",
    ask: "Это равенство верно?",
    correct: "Молодец! Десятки: 5+2=7, единицы: 3+4=7. 53 + 24 = 77. Да, верно.",
    hint: "Сложи отдельно десятки (5+2) и отдельно единицы (3+4).",
    yes: "Да", no: "Нет",
    tens: "десятков", units: "единиц",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik.
const Apple = ({ w = 26 }) => {
  const id = 'pq2607a' + (__gid++);
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
// Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi (o'nlik).
const Basket = ({ w = 42 }) => {
  const id = 'pq2607b' + (__gid++);
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

// Bitta razryad guruhi: savatlar (o'nliklar) qatori + yakka olmalar (birliklar) qatori + son yorlig'i.
const Addend = ({ tens, units, value, still }) => {
  const idleClass = (i) => still ? '' : ' idle';
  return (
    <div className="pq-add">
      <div className="pq-crates">
        {Array.from({ length: tens }).map((_, i) => (
          <span key={'c' + i} className={'pq-obj' + idleClass(i)} style={{ '--bd': `${i * 0.1}s` }}><Basket w={40} /></span>
        ))}
      </div>
      <div className="pq-loose">
        {Array.from({ length: units }).map((_, i) => (
          <span key={'u' + i} className={'pq-obj' + idleClass(tens + i)} style={{ '--bd': `${(tens + i) * 0.1}s` }}><Apple w={24} /></span>
        ))}
      </div>
      <span className="pq-num">{value}</span>
    </div>
  );
};

export default function D26_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);      // 'ha' | 'yo'q'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda ambient jonlanish saqlanadi, sahna statik yakuniy holatdan boshlanadi.
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
    const correct = picked === DATA.correct;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.yes, t.no], studentAnswer: { value: picked }, correctAnswer: { value: DATA.correct }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2607">
      <style>{`
        .pq2607{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2607 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2607 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2607 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2607 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2607 .pq-scene{position:relative;width:392px;max-width:100%;min-height:238px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;padding:44px 6px 20px;box-sizing:border-box;}
        .pq2607 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2607sun 3.6s ease-in-out infinite;}
        .pq2607 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2607 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2607 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2607 .pq-arena{position:relative;z-index:3;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:nowrap;}
        .pq2607 .pq-add{display:flex;flex-direction:column;align-items:center;gap:5px;background:rgba(255,255,255,.42);border:2px solid rgba(140,180,120,.5);border-radius:14px;padding:8px 8px 6px;}
        .pq2607 .pq-crates{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:150px;}
        .pq2607 .pq-loose{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;max-width:150px;min-height:26px;}
        .pq2607 .pq-obj{line-height:0;}
        .pq2607 .pq-obj.idle{animation:pq2607bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2607 .pq-num{margin-top:2px;padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #c9822f;color:#a45f19;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq2607 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        .pq2607 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2607tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2607 .pq-spark.s2{animation-delay:-.6s;} .pq2607 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2607 .pq-eq{display:flex;justify-content:center;align-items:center;gap:5px;margin-top:14px;flex-wrap:wrap;animation:pq2607in .3s ease both;}
        .pq2607 .pq-eq b{min-width:34px;height:36px;padding:0 5px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;border-radius:10px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2607 .pq-eq b.u{background:#f3ecfb;border-color:#c9b8ea;color:#7a4fb0;}
        .pq2607 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2607 .pq-eq i{font-style:normal;font-size:18px;font-weight:900;color:#8a94a2;}
        .pq2607 .pq-eq .tag{font-size:12px;font-weight:800;color:#6b7686;margin-left:2px;}
        .pq2607 .pq-sub{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:8px;animation:pq2607in .3s .1s both;}
        .pq2607 .pq-sub b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2607 .pq-sub b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2607 .pq-sub i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2607 .pq-sub .ok{color:#1a7f43;font-size:22px;}

        .pq2607 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq2607 .pq-opt{min-width:118px;height:62px;padding:0 18px;font-size:22px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2607 .pq-opt:hover:not(:disabled){border-color:#8fc487;transform:translateY(-2px);}
        .pq2607 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq2607 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2607 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2607cele .5s ease;}
        .pq2607 .pq-opt:disabled{cursor:default;}
        .pq2607 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2607in .22s ease both;}
        .pq2607 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2607 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2607bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2607sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2607tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2607cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2607in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          <Addend tens={A_T} units={A_U} value={A} still={still} />
          <span className="pq-plus">{'+'}</span>
          <Addend tens={B_T} units={B_U} value={B} still={still} />
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: razryad bo'yicha QO'SHISH ochib beriladi (o'nliklar + o'nliklar, birliklar + birliklar) */}
      {ok && (<>
        <div className="pq-eq">
          <b>{A_T}</b><i>+</i><b>{B_T}</b><i>=</i><b className="res">{SUM_T}</b><span className="tag">{t.tens}</span>
          <b className="u">{A_U}</b><i>+</i><b className="u">{B_U}</b><i>=</i><b className="res">{SUM_U}</b><span className="tag">{t.units}</span>
        </div>
        <div className="pq-sub"><b>{A}</b><i>+</i><b>{B}</b><i>=</i><b className="res">{SUM}</b><span className="ok">✓</span></div>
      </>)}

      <div className="pq-opts">
        {[{ k: 'ha', lbl: t.yes }, { k: "yo'q", lbl: t.no }].map((o) => {
          const sel = picked === o.k; const right = ok && o.k === DATA.correct;
          return <button key={o.k} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o.k); setFeedback(null); }}>{o.lbl}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
