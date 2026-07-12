// Dars26 · Amaliyot 09 — Ikki xonali + ikki xonali (o'tishsiz) «Olma bog'i» · masala · tag: tt_word
// Bitta-tanlov masala: bog'da 32 olma, yana 24 ta terildi. Nechta olma? -> 32 + 24 = 56.
// KANON (Dars21-25): bitta o'nlik = OLMA SAVATI (10 olma, "10" nishoni); bitta birlik = yakka olma.
// 32 = 3 savat + 2 olma; 24 = 2 savat + 4 olma. Razryad bo'yicha QO'SHILADI (ayirish YO'Q):
// savatlar savatlarga (3+2=5 o'nlik), yakka olmalar yakka olmalarga (2+4=6 birlik) -> 56.
// Chalg'ituvchilar: 11 (M1 barcha raqamlarni qo'shish 3+2+2+4), 50 (M2 faqat o'nliklar 30+20).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Javob g'alabagacha ekranda ko'rinmaydi (answer-leak yo'q) — faqat yutuqda paydo bo'ladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A_TENS = 3, A_UNITS = 2;   // 32
const B_TENS = 2, B_UNITS = 4;   // 24
const SUM_TENS = A_TENS + B_TENS;    // 5
const SUM_UNITS = A_UNITS + B_UNITS; // 6
const TARGET = 56;
const DATA = { a: 32, b: 24, target: TARGET, options: [56, 11, 50], answer: TARGET, level: '🔴', tag: 'tt_word' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Bog'da",
    setup: "Bog'da 32 olma bor edi, yana 24 olma terildi.",
    ask: "Endi jami nechta olma bo'ldi?",
    correct: "Barakalla! O'nliklar: 3 + 2 = 5, birliklar: 2 + 4 = 6. 32 + 24 = 56.",
    hint: "O'nliklarni alohida (3+2), birliklarni alohida (2+4) qo'shing.",
    tens: "o'nlik", units: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "В саду",
    setup: "В саду было 32 яблока, собрали ещё 24.",
    ask: "Сколько всего яблок стало?",
    correct: "Молодец! Десятки: 3 + 2 = 5, единицы: 2 + 4 = 6. 32 + 24 = 56.",
    hint: "Сложи отдельно десятки (3+2) и отдельно единицы (2+4).",
    tens: "дес.", units: "ед.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars21 kanoni)
const Apple = ({ w = 26 }) => {
  const id = 'pq2609a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, yashil «10» nishoni.
// Bola savat ichini QAYTA sanamaydi — savat bitta razryad birligi. (Dars21 kanoni)
const Basket = ({ w = 40 }) => {
  const id = 'pq2609b' + (__gid++);
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

// Bitta son guruhi: savatlar (o'nliklar) + yakka olmalar (birliklar). Faqat bezak jonlanish.
const NumGroup = ({ tens, units, idle, offset = 0 }) => {
  const baskets = Array.from({ length: tens });
  const apples = Array.from({ length: units });
  return (
    <div className="pq-group">
      <div className="pq-baskets">
        {baskets.map((_, i) => (
          <span key={'b' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(offset + i) * 0.1}s` }}>
            <Basket w={40} />
          </span>
        ))}
      </div>
      <div className="pq-apples">
        {apples.map((_, i) => (
          <span key={'a' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(offset + tens + i) * 0.1}s` }}>
            <Apple w={24} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default function D26_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bosiladigan nishon EMAS — dekor)

  return (
    <div className="pq pq2609">
      <style>{`
        .pq2609{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2609 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2609 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2609 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2609 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2609 .pq-scene{position:relative;width:380px;max-width:100%;height:224px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2609 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2609sun 3.6s ease-in-out infinite;}
        .pq2609 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2609 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2609 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2609 .pq-arena{position:absolute;left:8px;right:8px;top:40px;bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2609 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2609 .pq-baskets{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:150px;}
        .pq2609 .pq-apples{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:150px;}
        .pq2609 .pq-obj{line-height:0;}
        .pq2609 .pq-obj.idle{animation:pq2609bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2609 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        .pq2609 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2609tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2609 .pq-spark.s2{animation-delay:-.6s;} .pq2609 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2609 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2609in .3s ease both;}
        .pq2609 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2609 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2609 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2609 .pq-sub{display:flex;justify-content:center;gap:14px;margin-top:8px;flex-wrap:wrap;animation:pq2609in .3s .1s both;}
        .pq2609 .pq-sub span{font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;background:#eef7ee;border:1.5px solid #b6dcb6;border-radius:9px;padding:3px 10px;}

        .pq2609 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2609 .pq-opt{min-width:78px;height:72px;padding:0 12px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2609 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2609 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2609 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2609 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2609cele .5s ease;}
        .pq2609 .pq-opt:disabled{cursor:default;}
        .pq2609 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2609in .22s ease both;}
        .pq2609 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2609 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2609bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2609sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2609tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2609cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2609in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {/* 32 = 3 savat (o'nlik) + 2 yakka olma (birlik) */}
          <NumGroup tens={A_TENS} units={A_UNITS} idle={idle} offset={0} />
          {/* Ikki son razryad bo'yicha QO'SHILADI (ayirish EMAS) */}
          <span className="pq-plus">{'+'}</span>
          {/* 24 = 2 savat (o'nlik) + 4 yakka olma (birlik) */}
          <NumGroup tens={B_TENS} units={B_UNITS} idle={idle} offset={A_TENS + A_UNITS} />
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '38px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: razryad bo'yicha qo'shiladi — o'nliklar o'nliklarga, birliklar birliklarga (ayirish YO'Q) */}
      {ok && (<>
        <div className="pq-eq"><b>{DATA.a}</b><i>{'+'}</i><b>{DATA.b}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">
          <span>{A_TENS} + {B_TENS} = {SUM_TENS} {t.tens}</span>
          <span>{A_UNITS} + {B_UNITS} = {SUM_UNITS} {t.units}</span>
        </div>
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
