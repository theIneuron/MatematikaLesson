// Dars27 · Amaliyot 07 — To'g'ri-noto'g'ri «Olma bog'i» · 🔴 · tag: ts_tf
// Ekranda tenglik: "57 − 24 = 33". Savol: "Bu to'g'rimi?" Ikki tugma: "Ha" / "Yo'q".
// To'g'ri javob = "Ha" (57 − 24 haqiqatan 33). Model razryad bo'yicha ayirish: 57 = 5 savat
// (o'nlik) + 7 yakka olma (birlik). −24 → 2 savat va 4 olma olib tashlanadi (o'nlikdan o'nlik,
// birlikdan birlik). Qoladi: 3 savat + 3 olma = 33. G'alabada 2 savat va 4 olma chiqib ketadi,
// so'ng razryad tenglamalari: 5−2=3 o'nlik, 7−4=3 birlik. VEDI-DO-VERNOGO: noto'g'ri "Yo'q"
// bosilsa qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida. Minus — U+2212.
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

const M = '−';
const A = 57, B = 24, DIFF = 33;
const A_T = 5, A_U = 7;        // kamayuvchining o'nligi / birligi
const B_T = 2, B_U = 4;        // ayriluvchining o'nligi / birligi
const STAY_T = A_T - B_T;      // 3 — qoladigan savat (o'nlik)
const STAY_U = A_U - B_U;      // 3 — qoladigan yakka olma (birlik)
// meta: to'g'ri tenglik; qiyoslash uchun noto'g'ri modellar — M1 qo'shib yuborish (57+24=81),
// M2 bir razryadni tashlab ketish (faqat o'nlik 37), M3 chalkash (bu topshiriqda emas).
const DATA = { a: A, b: B, diff: DIFF, isTrue: true, correct: 'ha', level: '🔴', tag: 'ts_tf' };

// Savatlar (o'nliklar): 5 ta. G'alabada oxirgi 2 tasi chiqib ketadi → 3 qoladi.
const CRATES = Array.from({ length: A_T }).map((_, i) => ({ i, gone: i >= STAY_T }));
// Yakka olmalar (birliklar): 7 ta. G'alabada oxirgi 4 tasi chiqib ketadi → 3 qoladi.
const LOOSE = Array.from({ length: A_U }).map((_, i) => ({ i, gone: i >= STAY_U }));

const T = {
  uz: {
    eyebrow: "Olma bog'i · To'g'ri-noto'g'ri", title: "Bu to'g'rimi?",
    setup: "57 − 24 = 33.",
    ask: "Bu to'g'rimi?",
    correct: "Barakalla! 5−2=3 o'nlik, 7−4=3 birlik. 57 − 24 = 33. Ha, to'g'ri.",
    hint: "O'nlikdan o'nlik, birlikdan birlik ayiring.",
    yes: "Ha", no: "Yo'q",
    tens: "o'nlik", units: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Верно-неверно", title: "Это верно?",
    setup: "57 − 24 = 33.",
    ask: "Это верно?",
    correct: "Молодец! 5−2=3 десятка, 7−4=3 единицы. 57 − 24 = 33. Да, верно.",
    hint: "Десятки из десятков, единицы из единиц.",
    yes: "Да", no: "Нет",
    tens: "дес.", units: "ед.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars21 kanoni)
const Apple = ({ w = 28 }) => {
  const id = 'pq2707a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10».
// Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi. (Dars21 kanoni)
const Basket = ({ w = 46 }) => {
  const id = 'pq2707b' + (__gid++);
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

export default function D27_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);      // 'ha' | 'yo'q'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const [fitRef, scale] = useFitScale(384);
  const anim = ok && !still;   // jonli g'alaba animatsiyasi (restore/review'da statik)
  const idle = !ok && !still;  // g'alabagacha yengil tebranish (dekor — bosiladigan nishon EMAS)

  // Chiqish tartibi (razryad ayirish): 1) savat-o'nliklar (2), 2) yakka birliklar (4).
  const crateDelay = (i) => 0.15 + (i - STAY_T) * 0.22;         // o'nliklar: .15, .37
  const looseDelay = (i) => 0.9 + (i - STAY_U) * 0.16;          // birliklar: .9 …

  return (
    <div className="pq pq2707">
      <style>{`
        .pq2707{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2707 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2707 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2707 .pq-setup{color:#374151;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2707 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2707 .pq-scene{box-sizing:border-box;position:relative;width:384px;height:266px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2707 .pq-fit{position:relative;margin:0 auto;}
        .pq2707 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2707sun 3.6s ease-in-out infinite;}
        .pq2707 .pq-cloud{position:absolute;top:24px;left:26px;width:46px;height:14px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:12px 4px 0 -3px rgba(255,255,255,.8),-12px 3px 0 -4px rgba(255,255,255,.75);z-index:1;pointer-events:none;animation:pq2707cloud 6s ease-in-out infinite;}
        .pq2707 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2707 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2707 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2707 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:14px;display:flex;align-items:center;justify-content:center;gap:10px;z-index:3;}
        .pq2707 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;}
        .pq2707 .pq-glab{font-size:11px;font-weight:900;letter-spacing:.02em;color:#6b7686;text-transform:uppercase;}
        .pq2707 .pq-crates{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;max-width:186px;}
        .pq2707 .pq-loose{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;max-width:120px;}
        .pq2707 .pq-obj{position:relative;line-height:0;}
        .pq2707 .pq-obj.idle{animation:pq2707bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2707 .pq-obj.leave{animation:pq2707leave .7s ease-in forwards;animation-delay:var(--dd,0s);}
        .pq2707 .pq-plus{font-size:24px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}
        .pq2707 .pq-gl{margin-top:1px;padding:1px 11px;border-radius:999px;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pq2707pop .38s ease both;animation-delay:.7s;}
        .pq2707 .pq-gl.u{border-color:#1a7f43;color:#1a7f43;animation-delay:1.6s;}

        .pq2707 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2707tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2707 .pq-spark.s2{animation-delay:-.6s;} .pq2707 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2707 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2707in .3s ease both;}
        .pq2707 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2707 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2707 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2707 .pq-eq .ok{color:#1a7f43;font-size:22px;}
        .pq2707 .pq-sub{display:flex;justify-content:center;gap:16px;margin-top:8px;animation:pq2707in .3s .1s both;}
        .pq2707 .pq-sub span{font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;}
        .pq2707 .pq-sub .tn{color:#2f6bab;}

        .pq2707 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:18px;}
        .pq2707 .pq-opt{min-width:118px;height:62px;padding:0 18px;font-size:22px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2707 .pq-opt:hover:not(:disabled){border-color:#8fc487;transform:translateY(-2px);}
        .pq2707 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq2707 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2707 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2707cele .5s ease;}
        .pq2707 .pq-opt:disabled{cursor:default;}
        .pq2707 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2707in .22s ease both;}
        .pq2707 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2707 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2707bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2707leave{0%{opacity:1;transform:translateY(0) scale(1);}30%{transform:translateY(-6px) scale(1.04);}100%{opacity:0;transform:translateY(-30px) scale(.7);}}
        @keyframes pq2707sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2707cloud{0%,100%{transform:translateX(0);}50%{transform:translateX(8px);}}
        @keyframes pq2707pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2707tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2707cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2707in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{A} {M} {B} = {DIFF}.</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 384 * scale, height: 266 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" /><span className="pq-cloud" />
        <span className="pq-hill" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 5 savat = 5 o'nlik. G'alabada oxirgi 2 tasi chiqib ketadi → 3 qoladi */}
          <div className="pq-group">
            <span className="pq-glab">{t.tens}</span>
            <div className="pq-crates">
              {CRATES.map((s) => {
                if (s.gone && ok && !anim) return null;                    // restore: statik yakun (2 savat yo'q)
                const leaving = s.gone && anim;
                return (
                  <span key={s.i} className={'pq-obj' + (idle ? ' idle' : '') + (leaving ? ' leave' : '')} style={{ '--bd': `${s.i * 0.1}s`, '--dd': `${crateDelay(s.i)}s` }}>
                    <Basket w={44} />
                  </span>
                );
              })}
            </div>
            {ok && <span className="pq-gl">{STAY_T}</span>}
          </div>

          <span className="pq-plus">{'+'}</span>

          {/* 7 yakka olma = 7 birlik. G'alabada oxirgi 4 tasi chiqib ketadi → 3 qoladi */}
          <div className="pq-group">
            <span className="pq-glab">{t.units}</span>
            <div className="pq-loose">
              {LOOSE.map((s) => {
                if (s.gone && ok && !anim) return null;                    // restore: statik yakun (4 olma yo'q)
                const leaving = s.gone && anim;
                return (
                  <span key={s.i} className={'pq-obj' + (idle ? ' idle' : '') + (leaving ? ' leave' : '')} style={{ '--bd': `${(A_T + s.i) * 0.1}s`, '--dd': `${looseDelay(s.i)}s` }}>
                    <Apple w={28} />
                  </span>
                );
              })}
            </div>
            {ok && <span className="pq-gl u">{STAY_U}</span>}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{M}</i><b>{B}</b><i>=</i><b className="res">{DIFF}</b><span className="ok">✓</span></div>
        <div className="pq-sub">
          <span className="tn">{A_T} {M} {B_T} = {STAY_T} {t.tens}</span>
          <span>{A_U} {M} {B_U} = {STAY_U} {t.units}</span>
        </div>
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
