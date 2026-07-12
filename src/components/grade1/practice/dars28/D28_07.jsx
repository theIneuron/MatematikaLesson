// Dars28 · Amaliyot 07 — Masala tuzilishi «Olma bog'i» · To'g'ri-noto'g'ri · 🔴 · tag: sum_tf
// Bitta-tanlov (Ha / Yo'q): masala + tayyor yechim ko'rsatiladi. "34 olma, yana 25 terildi.
// Yechim: 34 + 25 = 59. To'g'rimi?" To'g'ri javob = "Ha" (jami topish -> qo'shamiz, 34 + 25 = 59).
// Yig'indiga masala: ikki guruh BIRLASHTIRILADI -> QO'SHISH (+). Sonlar QIYIN: ikki xonali +
// ikki xonali, razryad ustidan o'tmaydi (4 + 5 = 9 < 10, 30 + 20 = 50), yig'indi 59 <= 99.
// Sahna: 34 = 3 savat (o'nlik) + 4 yakka olma (birlik); 25 = 2 savat + 5 olma. Orada "+".
// G'alabada ikki guruh birlashadi, o'nliklar (savat) 1..5, birliklar (olma) 1..9 sanaladi,
// tenglama "34 + 25 = 59 ✓" + razryad izohi. VEDI-DO-VERNOGO: noto'g'ri "Yo'q" bosilsa qulf
// yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 34, B = 25, SUM = 59;               // 34 + 25 = 59 (razryad bo'yicha, o'tmaydi)
const AT = Math.floor(A / 10), AU = A % 10;   // 3 savat, 4 olma
const BT = Math.floor(B / 10), BU = B % 10;   // 2 savat, 5 olma
const TENS = AT + BT, UNITS = AU + BU;        // 5 o'nlik, 9 birlik
const DATA = { a: A, b: B, sum: SUM, isTrue: true, correct: 'ha', ptype: 'sum_tf', level: '🔴', tag: 'sum_tf' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · To'g'ri-noto'g'ri", title: "Bu to'g'rimi?",
    setup: "34 olma bor edi, yana 25 terildi.",
    ask: "Yechim: 34 + 25 = 59. To'g'rimi?",
    correct: "Barakalla! Jami — qo'shamiz. 34 + 25 = 59. Ha.",
    hint: "Jami — qo'shish. O'nliklar va birliklarni tekshiring.",
    yes: "Ha", no: "Yo'q",
    tens: "o'nlik", units: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Верно-неверно", title: "Это верно?",
    setup: "Было 34 яблока, собрали ещё 25.",
    ask: "Решение: 34 + 25 = 59. Верно?",
    correct: "Молодец! Всего — складываем. 34 + 25 = 59. Да.",
    hint: "Всего — сложить. Проверь десятки и единицы.",
    yes: "Да", no: "Нет",
    tens: "десятков", units: "единиц",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma, yashil «10» nishoni) — Dars21 kanoni. Bosilmaydigan dekor.
const Basket = ({ w = 42 }) => {
  const id = 'pq2807b' + (__gid++);
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
      {/* savat gardishi + tanasi */}
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      {/* «10» nishoni — bu savat bitta o'nlik */}
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// YAKKA OLMA (bitta birlik) — Dars21 kanoni. Bosilmaydigan dekor.
const Apple = ({ w = 24 }) => {
  const id = 'pq2807a' + (__gid++);
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

export default function D28_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);        // 'ha' | 'yo'q'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda birlashish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const idle = !ok && !still;       // g'alabagacha yengil tebranish (dekor — bosilmaydi)
  const anim = ok && !still;        // jonli birlashish (restore/review'da statik)
  // Sanoq nishonchalari: avval o'nliklar (savat) 1..5, keyin birliklar (olma) 1..9.
  const tenDelay = (n) => still ? 0 : 0.5 + (n - 1) * 0.13;              // savatlar
  const unitDelay = (n) => still ? 0 : 0.5 + (TENS + n - 1) * 0.13;     // olmalar

  return (
    <div className="pq pq2807">
      <style>{`
        .pq2807{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2807 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2807 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2807 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2807 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2807 .pq-scene{position:relative;width:384px;max-width:100%;height:244px;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2807 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2807sun 3.6s ease-in-out infinite;}
        .pq2807 .pq-tree{position:absolute;bottom:48px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2807 .pq-tree.t1{left:6px;animation:pq2807sway 4.2s ease-in-out infinite;}
        .pq2807 .pq-tree.t2{right:8px;bottom:52px;animation:pq2807sway 4.8s ease-in-out .6s infinite;}
        .pq2807 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:8px;height:24px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2807 .pq-crown{width:52px;height:44px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2807 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.22);}
        .pq2807 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#8a5a2c,#6d4420);border:2.5px solid #59340f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.22);pointer-events:none;}
        .pq2807 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:38px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2807 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        .pq2807 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:20px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2807 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .6s ease;}
        .pq2807 .pq-group.right.merge{transform:translateX(-12px);}
        /* laganda: savatlar qatori + olmalar qatori */
        .pq2807 .pq-tray{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;max-width:150px;padding:6px 8px 5px;border-radius:12px 12px 14px 14px;background:linear-gradient(#e6c893,#c79a58);border:2px solid #a2743a;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq2807 .pq-crates{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:2px;}
        .pq2807 .pq-apples{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:3px;}
        .pq2807 .pq-obj{position:relative;line-height:0;}
        .pq2807 .pq-obj.idle{animation:pq2807bob 3s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2807 .pq-cnt{position:absolute;top:-8px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:999px;background:#1a7f43;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);animation:pq2807pop .3s both;animation-delay:var(--cd,0s);font-variant-numeric:tabular-nums;}
        .pq2807 .pq-cnt.u{background:#c9822f;}
        .pq2807 .pq-num{font-size:15px;font-weight:900;color:#5c3a12;background:#fff2dc;border:2px solid #b98a44;padding:0 9px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 1px 2px rgba(0,0,0,.14);}
        .pq2807 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;transition:opacity .4s ease;}
        .pq2807 .pq-plus.hide{opacity:0;}

        .pq2807 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2807tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2807 .pq-spark.s2{animation-delay:-.6s;} .pq2807 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2807 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pq2807in .3s ease both;}
        .pq2807 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2807 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2807 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2807 .pq-eq .ok{color:#1a7f43;font-size:22px;}
        .pq2807 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2807in .3s .1s both;}

        .pq2807 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq2807 .pq-opt{min-width:118px;height:62px;padding:0 18px;font-size:22px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2807 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2807 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq2807 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2807 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2807cele .5s ease;}
        .pq2807 .pq-opt:disabled{cursor:default;}
        .pq2807 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2807in .22s ease both;}
        .pq2807 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2807 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2807bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2807sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2807sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2807pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2807tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2807cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2807in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '14px', top: '16px' }} /><i style={{ left: '32px', top: '10px' }} /><i style={{ left: '24px', top: '28px' }} /></span><span className="pq-trunk" /></div>
        <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '12px', top: '12px' }} /><i style={{ left: '30px', top: '22px' }} /></span><span className="pq-trunk" /></div>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* Birinchi guruh: 34 = 3 savat + 4 olma */}
          <div className="pq-group left">
            <div className="pq-tray">
              <div className="pq-crates">
                {Array.from({ length: AT }).map((_, i) => (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                    <Basket w={42} />
                    {ok && <span className="pq-cnt" style={{ '--cd': `${tenDelay(i + 1)}s` }}>{i + 1}</span>}
                  </span>
                ))}
              </div>
              <div className="pq-apples">
                {Array.from({ length: AU }).map((_, i) => (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(AT + i) * 0.12}s` }}>
                    <Apple w={24} />
                    {ok && <span className="pq-cnt u" style={{ '--cd': `${unitDelay(i + 1)}s` }}>{i + 1}</span>}
                  </span>
                ))}
              </div>
            </div>
            <span className="pq-num">{A}</span>
          </div>

          {/* Birlashtirilsa QO'SHAMIZ (ayirish EMAS) */}
          <span className={'pq-plus' + (anim ? ' hide' : '')}>{'+'}</span>

          {/* Qo'shilgan guruh: 25 = 2 savat + 5 olma */}
          <div className={'pq-group right' + (anim ? ' merge' : '')}>
            <div className="pq-tray">
              <div className="pq-crates">
                {Array.from({ length: BT }).map((_, i) => (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                    <Basket w={42} />
                    {ok && <span className="pq-cnt" style={{ '--cd': `${tenDelay(AT + i + 1)}s` }}>{AT + i + 1}</span>}
                  </span>
                ))}
              </div>
              <div className="pq-apples">
                {Array.from({ length: BU }).map((_, i) => (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(BT + i) * 0.12}s` }}>
                    <Apple w={24} />
                    {ok && <span className="pq-cnt u" style={{ '--cd': `${unitDelay(AU + i + 1)}s` }}>{AU + i + 1}</span>}
                  </span>
                ))}
              </div>
            </div>
            <span className="pq-num">{B}</span>
          </div>
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '80%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: jami topish — qo'shamiz. 34 + 25 = 59 (ayirish YO'Q) */}
      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'+'}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b><span className="ok">✓</span></div>
        <div className="pq-sub">{TENS} {t.tens} · {UNITS} {t.units}</div>
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
