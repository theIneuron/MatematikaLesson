// Dars23 · Amaliyot 09 — Sanoq «Olma bog'i» · masala: 10 lab 3 marta sakrash · 🔴 · tag: skip_word
// Masala (bitta-tanlov): quyon 10 lab 3 marta sakradi — qayerga yetdi? To'g'ri = 30.
// MODEL: quyon yo'lakcha boshidagi inidan turadi, oldinda uchta tayl. Har tayl javobgacha '?' (leak yo'q).
// G'alabada uchta tayl 10, 20, 30 bo'lib ochiladi, ikki oraliq taylda «+10» sakrash yoyi, quyon oxirgi
// taylga (30) sakrab qo'nadi, chip «10 + 10 + 10 = 30». Distraktorlar: 13 (M1 birma-bir/raqam yopishtirish),
// 40 (M4 ortiqcha bitta sakrash, +10). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const STEP = 10, HOPS = 3;
const SEQ = [10, 20, 30];   // uchta sakrash qo'ngan tayllar (barchasi javobgacha '?')
const TARGET = 30;          // oxirgi tayl = quyon yetgan son
const DATA = { seq: SEQ, step: STEP, hops: HOPS, target: TARGET, options: [30, 13, 40], ptype: 'WORD', level: '🔴', tag: 'skip_word' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Quyon sakraydi",
    setup: "Quyon 10 lab 3 marta sakradi.",
    ask: "Qayerga yetdi?",
    correct: "Barakalla! 10, 20, 30 — uch sakrash, o'ttizga yetdi.",
    hint: "Har sakrash 10 ga. Uch marta sanang: 10, 20, 30.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "Зайчик прыгает",
    setup: "Зайчик прыгнул по 10 три раза.",
    ask: "Куда он попал?",
    correct: "Молодец! 10, 20, 30 — три прыжка, попал на тридцать.",
    hint: "Каждый прыжок по 10. Сосчитай трижды: 10, 20, 30.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __rid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma) — Dars21 dan uzviy. Bog' bezagi sifatida (bosilmaydi).
const Basket = ({ w = 30 }) => {
  const id = 'pq2309b' + (__rid++);
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

// QUYON — 2-ton tana + quloqlar + dumcha, o'ngga (oldinga) qaragan. Yo'lakchada sakraydi.
const Rabbit = ({ w = 46 }) => {
  const id = 'pq2309r' + (__rid++);
  const h = w * 46 / 52;
  return (
    <svg viewBox="0 0 52 46" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="40%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="62%" stopColor="#eef1f6" /><stop offset="100%" stopColor="#cdd4e0" />
        </radialGradient>
      </defs>
      {/* dumcha */}
      <circle cx="7" cy="30" r="5.4" fill="#ffffff" stroke="#c3cad7" strokeWidth="1" />
      {/* orqa son */}
      <ellipse cx="17" cy="31" rx="11" ry="9" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1.2" />
      {/* tana */}
      <ellipse cx="27" cy="28" rx="13" ry="10" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1.2" />
      {/* oldingi oyoq */}
      <ellipse cx="34" cy="37" rx="4" ry="3" fill="#eef1f6" stroke="#c3cad7" strokeWidth="1" />
      {/* bosh */}
      <circle cx="39" cy="20" r="8.4" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1.2" />
      {/* quloqlar */}
      <ellipse cx="36.5" cy="8" rx="2.8" ry="8" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1" transform="rotate(-12 36.5 8)" />
      <ellipse cx="42.5" cy="8" rx="2.8" ry="8" fill={`url(#${id})`} stroke="#c3cad7" strokeWidth="1" transform="rotate(6 42.5 8)" />
      <ellipse cx="36.5" cy="9" rx="1.2" ry="5" fill="#f6b8c4" transform="rotate(-12 36.5 9)" />
      <ellipse cx="42.5" cy="9" rx="1.2" ry="5" fill="#f6b8c4" transform="rotate(6 42.5 9)" />
      {/* ko'z va burun */}
      <circle cx="42" cy="19" r="1.5" fill="#31384a" />
      <circle cx="46.4" cy="22" r="1.5" fill="#f28ea2" />
      <path d="M46.4 23.4 L46.4 25" stroke="#b9758a" strokeWidth=".8" strokeLinecap="round" />
    </svg>
  );
};

// QUYON INI (start belgisi) — yo'lakcha boshidagi in. Dekorativ, bosilmaydi.
const Burrow = ({ w = 40 }) => (
  <svg viewBox="0 0 40 34" width={w} height={w * 34 / 40} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <ellipse cx="20" cy="30" rx="18" ry="4" fill="#86ad5c" opacity=".7" />
    <path d="M4 30 Q4 10 20 10 Q36 10 36 30 Z" fill="#6b4a2a" stroke="#553a20" strokeWidth="1.4" />
    <path d="M9 30 Q9 16 20 16 Q31 16 31 30 Z" fill="#3a2716" />
    <path d="M2 30 Q10 24 20 25 Q30 24 38 30" fill="none" stroke="#5f9a3e" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

// SAKRASH YOYI (+10) — g'alabada oraliq tayllar ustida. Dekorativ, bosilmaydi.
const HopArc = () => (
  <span className="pq-hop" aria-hidden="true">
    <svg viewBox="0 0 42 24" width="42" height="24" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M4 22 Q21 -3 38 22" fill="none" stroke="#c9822f" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 4" />
      <path d="M38 22 l-6 -0.6 l3.4 4.8 z" fill="#c9822f" />
    </svg>
    <b>+10</b>
  </span>
);

export default function D23_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2309">
      <style>{`
        .pq2309{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2309 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2309 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2309 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2309 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2309 .pq-scene{position:relative;width:360px;max-width:100%;height:238px;margin:0 auto;border-radius:20px;background:linear-gradient(#d6efff 0%,#e6f4ea 56%,#d8eecb 100%);border:2px solid #cfe0cd;overflow:hidden;}
        .pq2309 .pq-sun{position:absolute;left:16px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2309sun 3.6s ease-in-out infinite;}
        .pq2309 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.85;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2309sway 4.4s ease-in-out infinite;}
        .pq2309 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2309 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2309 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(#b9d98f,#9cc26e);border-top:3px solid #86ad5c;z-index:1;pointer-events:none;}
        .pq2309 .pq-deco{position:absolute;bottom:20px;z-index:2;line-height:0;pointer-events:none;opacity:.9;}

        .pq2309 .pq-arena{position:absolute;left:8px;right:8px;bottom:30px;display:flex;align-items:flex-end;justify-content:center;gap:6px;z-index:4;}
        .pq2309 .pq-col{position:relative;display:flex;flex-direction:column;align-items:center;flex:0 0 auto;}
        .pq2309 .pq-lane{height:58px;display:flex;align-items:flex-end;justify-content:center;}
        .pq2309 .pq-rabbit{line-height:0;filter:drop-shadow(0 3px 3px rgba(50,60,80,.22));}
        .pq2309 .pq-rabbit.hop{animation:pq2309hop .5s cubic-bezier(.4,1.5,.5,1) both;}
        .pq2309 .pq-rabbit.bob{animation:pq2309bob 2.6s ease-in-out infinite;}
        .pq2309 .pq-hop{display:flex;flex-direction:column;align-items:center;gap:1px;line-height:1;animation:pq2309in .3s ease both;}
        .pq2309 .pq-hop b{font-size:12px;font-weight:900;color:#c9822f;font-variant-numeric:tabular-nums;}
        .pq2309 .pq-pad{line-height:0;}
        .pq2309 .pq-tile{min-width:46px;height:34px;padding:0 7px;border-radius:9px;background:#fff;border:2px solid #cbd6c2;color:#374151;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;box-shadow:0 2px 3px rgba(60,80,50,.12);}
        .pq2309 .pq-tile.q{border-style:dashed;border-color:#9ab6d6;background:#eef4fb;color:#7a97b8;}
        .pq2309 .pq-tile.win{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2309cele .5s ease;}

        .pq2309 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2309twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2309 .pq-spark.s2{animation-delay:-.6s;} .pq2309 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2309 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2309in .3s ease both;}
        .pq2309 .pq-eq b{min-width:38px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2309 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2309 .pq-eq i{font-style:normal;font-size:21px;font-weight:900;color:#8a94a2;}
        .pq2309 .pq-seq{text-align:center;margin-top:7px;font-size:16px;font-weight:800;color:#5c7fa6;letter-spacing:.04em;font-variant-numeric:tabular-nums;animation:pq2309in .3s .1s both;}
        .pq2309 .pq-seq b{color:#1a7f43;}

        .pq2309 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2309 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2309 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2309 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2309 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2309 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2309cele .5s ease;}
        .pq2309 .pq-opt:disabled{cursor:default;}
        .pq2309 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2309in .22s ease both;}
        .pq2309 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2309 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2309hop{0%{transform:translate(-46px,0);}45%{transform:translate(-20px,-30px);}100%{transform:translate(0,0);}}
        @keyframes pq2309bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2309sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2309sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2309twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2309cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2309in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ right: '18px', top: '28px' }}>❧</span>
        <span className="pq-leaf l2" style={{ left: '18px', bottom: '44px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <span className="pq-deco" style={{ right: '8px' }} aria-hidden="true"><Basket w={28} /></span>

        <div className="pq-arena">
          {/* start: quyon ini — g'alabagacha quyon shu yerda kutadi */}
          <div className="pq-col">
            <div className="pq-lane">
              {!ok && (
                <span className={'pq-rabbit ' + (still ? '' : 'bob')} aria-hidden="true"><Rabbit w={46} /></span>
              )}
            </div>
            <div className="pq-pad"><Burrow w={40} /></div>
          </div>

          {/* uchta sakrash tayli — javobgacha barchasi '?' (leak yo'q) */}
          {SEQ.map((val, i) => {
            const isLast = i === SEQ.length - 1;
            return (
              <div className="pq-col" key={i}>
                <div className="pq-lane">
                  {ok && (isLast
                    ? <span className={'pq-rabbit ' + (still ? '' : 'hop')} aria-hidden="true"><Rabbit w={46} /></span>
                    : <HopArc />)}
                </div>
                <div className={'pq-tile' + (ok ? (isLast ? ' win' : '') : ' q')}>{ok ? val : '?'}</div>
              </div>
            );
          })}
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '42px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq"><b>10</b><i>+</i><b>10</b><i>+</i><b>10</b><i>=</i><b className="res">30</b></div>
        <div className="pq-seq">10 · 20 · <b>30</b></div>
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
