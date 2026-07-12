// Dars28 · Amaliyot 03 — Masala tuzilishi «Yig'indiga masala» · 🟡 · tag: sum
// Bitta-tanlov (sbornik: olmalar, ikki xonali qo'shish): bog'da 42 olma, yana 13 olma QO'SHILADI -> jami 55.
// Bola amalni MA'NODAN tanlaydi: ikki to'plam BIRLASHSA — qo'shamiz (+). Sonlar razryad bo'yicha
// modellanadi: bir SAVAT = bitta o'nlik (10 olma, "10" nishoni), bitta YAKKA OLMA = bitta birlik.
// 42 = 4 savat + 2 olma; 13 = 1 savat + 3 olma. Birlashganda o'nlik o'nlikka, birlik birlikka
// qo'shiladi (o'tkazishsiz): 4+1=5 o'nlik, 2+3=5 birlik -> 55. G'alabada tenglama chiqadi.
// Chalg'ituvchilar: 29 (M1 amal xato — ayirgan 42 − 13), 50 (M2 faqat o'nlik 40 + 10).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 42, B = 13, TARGET = 55;                 // 42 olma + 13 olma = 55
const TA = 4, UA = 2, TB = 1, UB = 3;              // razryad: o'nliklar va birliklar
const DATA = { a: A, b: B, target: TARGET, options: [55, 29, 50], answer: TARGET, level: '🟡', tag: 'sum' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Jami nechta?",
    setup: "Bog'da 42 olma bor, yana 13 terildi.",
    ask: "Jami nechta olma?",
    correct: "Barakalla! Jami — qo'shamiz. 4+1=5 o'nlik, 2+3=5 birlik. 42 + 13 = 55.",
    hint: "Jami topish — qo'shing: o'nlikka o'nlik, birlikka birlik.",
    tw: "o'nlik", uw: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "Сколько всего?",
    setup: "В саду 42 яблока, собрали ещё 13.",
    ask: "Сколько всего яблок?",
    correct: "Молодец! Всего — складываем. 4+1=5 десятков, 2+3=5 единиц. 42 + 13 = 55.",
    hint: "Найти всего — сложить.",
    tw: "дес.", uw: "ед.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 26 }) => {
  const id = 'pq2803a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10»
// nishoni. Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi. (Dars 21 kanoni)
const Basket = ({ w = 40 }) => {
  const id = 'pq2803b' + (__gid++);
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

// Bir sonni razryad bo'yicha ko'rsatuvchi to'plam: o'nliklar (savatlar) + birliklar (yakka olmalar).
const NumGroup = ({ tens, units, idle, base }) => (
  <div className="pq-num">
    <div className="pq-tens">
      {Array.from({ length: tens }).map((_, i) => (
        <span key={'t' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(base + i) * 0.1}s` }}>
          <Basket w={38} />
        </span>
      ))}
    </div>
    <div className="pq-units">
      {Array.from({ length: units }).map((_, i) => (
        <span key={'u' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(base + tens + i) * 0.1}s` }}>
          <Apple w={24} />
        </span>
      ))}
    </div>
  </div>
);

export default function D28_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda birlashish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bosiladigan nishon EMAS — dekor)

  return (
    <div className="pq pq2803">
      <style>{`
        .pq2803{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2803 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2803 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2803 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2803 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2803 .pq-scene{position:relative;width:380px;max-width:100%;height:236px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2803 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2803sun 3.6s ease-in-out infinite;}
        .pq2803 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2803 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2803 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2803 .pq-arena{position:absolute;left:8px;right:8px;top:40px;bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2803 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2803 .pq-num{display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2803 .pq-tens{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:3px;max-width:140px;}
        .pq2803 .pq-units{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:4px;max-width:120px;}
        .pq2803 .pq-obj{line-height:0;}
        .pq2803 .pq-obj.idle{animation:pq2803bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);transform-origin:50% 100%;}
        .pq2803 .pq-gl{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #d1568a;color:#c33d75;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pq2803pop .38s ease both;}
        .pq2803 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        .pq2803 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2803tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2803 .pq-spark.s2{animation-delay:-.6s;} .pq2803 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2803 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2803in .3s ease both;}
        .pq2803 .pq-eq b{min-width:42px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fdeef4;border:2px solid #edbcd2;color:#c33d75;font-variant-numeric:tabular-nums;}
        .pq2803 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2803 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2803 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2803in .3s .1s both;}

        .pq2803 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2803 .pq-opt{min-width:78px;height:72px;padding:0 12px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2803 .pq-opt:hover:not(:disabled){border-color:#e79ab8;transform:translateY(-2px);}
        .pq2803 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2803 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2803 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2803cele .5s ease;}
        .pq2803 .pq-opt:disabled{cursor:default;}
        .pq2803 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2803in .22s ease both;}
        .pq2803 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2803 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2803bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2803sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2803pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2803tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2803cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2803in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {/* 42 = 4 savat (o'nlik) + 2 olma (birlik). Son yorlig'i boshidanoq ko'rinadi. */}
          <div className="pq-group">
            <NumGroup tens={TA} units={UA} idle={idle} base={0} />
            <span className="pq-gl">{A}</span>
          </div>

          {/* Ikki to'plam BIRLASHADI — qo'shamiz («+» boshidanoq, javobni ochmaydi) */}
          <span className="pq-plus">{'+'}</span>

          {/* 13 = 1 savat (o'nlik) + 3 olma (birlik). Son yorlig'i boshidanoq ko'rinadi. */}
          <div className="pq-group">
            <NumGroup tens={TB} units={UB} idle={idle} base={TA + UA} />
            <span className="pq-gl">{B}</span>
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: ikki to'plam qo'shilib jami beradi — razryad bo'yicha (AnsPop) */}
      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'+'}</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{TA}+{TB}={TA + TB} {t.tw} · {UA}+{UB}={UA + UB} {t.uw}</div>
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
