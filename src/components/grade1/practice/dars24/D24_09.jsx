// Dars24 · Amaliyot 09 — Masala «Yumaloq o'nliklarni qo'shish» «Olma bog'i» · 🔴 · tag: round_word
// Bitta-tanlov (matnli masala): bog'da 30 olma va yana 20 olma bor — jami nechta olma? 30 + 20 = 50.
// Metodist 2026-07-12: eski matn («30 olma va 20 nok daraxti») animatsiyaga mos emas edi — sahnada
// daraxt ham, nok ham yo'q, OLMA SAVATLARI bor. Matn sahnaga moslab qayta yozildi (bitta aniq gap),
// savat guruhlari ostiga «30» / «20» yorliqlari qo'shildi.
// Sahna: 3 savat (30 olma) + 2 savat (20 olma). Har savat = 10 olma = bitta o'nlik (Dars 21-23 kanoni).
// MODEL: o'nliklarni SANAYMIZ — 3 o'nlik va 2 o'nlik birlashib 5 o'nlik (= 50) beradi; ustun/o'tkazish YO'Q.
// Sonlar 1-sinf sbornik zadach/primerlaridan (metodist talabi): 30 + 20. G'alabada savatlar 10 lab
// sanaladi (10, 20, 30, 40, 50) va tenglama 30 + 20 = 50 ochiladi (javob faqat to'g'ri javobda).
// Distraktorlar: 5 (M1 o'nlikni birlik deb sanash 3+2), 60 (M4 o'nliklarni bittaga adashib sanash).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 3, B = 2;             // savatlar soni: 3 o'nlik (30 olma) + 2 o'nlik (20 olma)
const ADD_A = 30, ADD_B = 20, TARGET = 50;
const DATA = { a: ADD_A, b: ADD_B, target: TARGET, options: [50, 5, 60], answer: TARGET, level: '🔴', tag: 'round_word' };
const GROUP_A = Array.from({ length: A }).map((_, i) => i);
const GROUP_B = Array.from({ length: B }).map((_, i) => i);

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Bog'da",
    setup: "Bog'da 30 olma va yana 20 olma bor.",
    ask: "Jami nechta olma bor?",
    correct: "Barakalla! 30 va 20 — ellik. 30 + 20 = 50.",
    hint: "O'nliklarni qo'shing: 3 o'nlik + 2 o'nlik = 5 o'nlik.",
    tword: "o'nlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "В саду",
    setup: "В саду 30 яблок и ещё 20 яблок.",
    ask: "Сколько всего яблок?",
    correct: "Молодец! 30 и 20 — пятьдесят. 30 + 20 = 50.",
    hint: "Сложи десятки: 3 десятка + 2 десятка = 5 десятков.",
    tword: "десятков",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma bir birlikka bog'langan) — Dars21 dan uzviy. To'qima savat,
// ustidan olmalar mo'ralaydi, oldida yashil «10» nishoni. Bola savatdagi olmalarni QAYTA sanamaydi —
// savat bitta BUTUN o'nlik. Bog' bezagi/model sifatida ko'rsatiladi (bosilmaydi — javob tugmalarda).
const Basket = ({ w = 40 }) => {
  const id = 'pq2409b' + (__gid++);
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

export default function D24_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sanoq animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const idle = !ok && !still; // g'alabagacha yengil tebranish (savat bosiladigan nishon EMAS — dekor)
  // 10 lab sanoq nishonchasi: gi = umumiy savat indeksi (0..4) → qiymat (gi+1)*10 (10,20,30,40,50)
  const badgeDelay = (gi) => still ? 0 : 0.25 + gi * 0.24;

  return (
    <div className="pq pq2409">
      <style>{`
        .pq2409{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2409 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2409 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2409 .pq-setup{color:#5c6672;font-weight:700;font-variant-numeric:tabular-nums;}
        .pq2409 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2409 .pq-scene{position:relative;width:360px;max-width:100%;height:212px;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2409 .pq-sun{position:absolute;right:18px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2409sun 3.6s ease-in-out infinite;}
        .pq2409 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.8;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2409sway 4.4s ease-in-out infinite;}
        .pq2409 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2409 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2409 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2409 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        .pq2409 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:30px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2409 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq2409 .pq-baskets{display:flex;justify-content:center;gap:4px;}
        .pq2409 .pq-obj{position:relative;line-height:0;}
        .pq2409 .pq-obj.idle{animation:pq2409bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        /* 10 lab sanoq nishonchasi — savat ustida (bezak, bosilmaydi) */
        .pq2409 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:22px;height:20px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;animation:pq2409pop .32s both;animation-delay:var(--cd,0s);}
        .pq2409 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}
        /* guruh yorlig'i — matndagi 30 va 20 sonlarini savat-guruhlariga bog'laydi (berilgan sonlar, javob emas) */
        .pq2409 .pq-pill{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #b6dcb6;color:#3f8a41;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.12);}

        .pq2409 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2409tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2409 .pq-spark.s2{animation-delay:-.6s;} .pq2409 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2409 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2409in .3s ease both;}
        .pq2409 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2409 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2409 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2409 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2409in .3s .1s both;}

        .pq2409 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2409 .pq-opt{min-width:72px;height:72px;padding:0 8px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2409 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2409 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2409 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2409 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2409cele .5s ease;}
        .pq2409 .pq-opt:disabled{cursor:default;}
        .pq2409 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2409in .22s ease both;}
        .pq2409 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2409 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2409bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2409sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2409sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2409pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2409tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2409cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2409in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ left: '16px', top: '30px' }}>❧</span>
        <span className="pq-leaf l2" style={{ right: '18px', bottom: '44px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 3 savat = 3 o'nlik = 30 olma */}
          <div className="pq-group">
            <div className="pq-baskets">
              {GROUP_A.map((i) => (
                <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                  <Basket w={40} />
                  {ok && <span className="pq-cnt" style={{ '--cd': `${badgeDelay(i)}s` }}>{(i + 1) * 10}</span>}
                </span>
              ))}
            </div>
            <span className="pq-pill">{ADD_A}</span>
          </div>

          {/* O'nliklar QO'SHILADI: savatlarni birlashtiramiz (ayirish EMAS) */}
          <span className="pq-plus">{'+'}</span>

          {/* 2 savat = 2 o'nlik = 20 olma */}
          <div className="pq-group">
            <div className="pq-baskets">
              {GROUP_B.map((i) => {
                const gi = A + i; // umumiy savat indeksi (3,4) → nishoncha 40,50
                return (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${gi * 0.12}s` }}>
                    <Basket w={40} />
                    {ok && <span className="pq-cnt" style={{ '--cd': `${badgeDelay(gi)}s` }}>{(gi + 1) * 10}</span>}
                  </span>
                );
              })}
            </div>
            <span className="pq-pill">{ADD_B}</span>
          </div>
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: o'nliklar QO'SHILIB 50 beradi (javob faqat shu yerda ochiladi) */}
      {ok && (<>
        <div className="pq-eq"><b>{ADD_A}</b><i>{'+'}</i><b>{ADD_B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A + B} {t.tword} = {TARGET}</div>
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
