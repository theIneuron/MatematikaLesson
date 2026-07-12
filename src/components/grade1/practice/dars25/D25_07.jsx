// Dars25 · Amaliyot 07 — To'g'ri-noto'g'ri «Olma bog'i» · 🔴 · tag: td_tf
// Ekranda tenglik: "53 + 4 = 57". Savol: "Bu to'g'rimi?" Ikki tugma: "Ha" / "Yo'q".
// To'g'ri javob = "Ha" (53 + 4 haqiqatan 57). Model: 53 = 5 savat (o'nlik) + 3 yakka olma
// (birlik). Qo'shiladigan 4 olma FAQAT birliklar guruhiga qo'shiladi: 3 + 4 = 7. O'nlik
// savatlar O'ZGARMAYDI (5 o'nlik = 50), natija 57. Bu darsda AYIRISH yo'q — faqat qo'shish.
// G'alabada 4 olma birliklarga qo'shilib, 3 + 4 = 7 chiqadi, so'ng 53 + 4 = 57 ✓.
// Distraktor "Yo'q" ham ishlaydi (qulf yo'q). VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 53, B = 4, SUM = 57;
const TENS = 5;          // savatlar soni = o'nliklar (o'zgarmaydi)
const U1 = 3;            // 53 ning birliklari
const U2 = B;            // qo'shiladigan birliklar (4)
const UTOTAL = U1 + U2;  // 7 — birliklar yig'indisi (< 10, o'tish yo'q)
const DATA = { a: A, b: B, sum: SUM, isTrue: true, correct: 'ha', ptype: 'td_tf', level: '🔴', tag: 'td_tf' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · To'g'ri-noto'g'ri", title: "Bu to'g'rimi?",
    setup: "Ekranda tenglik yozilgan: 53 + 4 = 57.",
    ask: "Bu tenglik to'g'rimi?",
    correct: "Barakalla! Birliklar: 3 + 4 = 7, o'nlik o'zgarmaydi. 53 + 4 = 57. Ha, to'g'ri.",
    hint: "Birliklarni sanang: 3 + 4 = ? O'nlik o'zgarmaydi.",
    yes: "Ha", no: "Yo'q",
  },
  ru: {
    eyebrow: "Яблоневый сад · Верно-неверно", title: "Это верно?",
    setup: "На экране равенство: 53 + 4 = 57.",
    ask: "Это равенство верно?",
    correct: "Молодец! Единицы: 3 + 4 = 7, десяток не меняется. 53 + 4 = 57. Да, верно.",
    hint: "Сосчитай единицы: 3 + 4 = ? Десяток не меняется.",
    yes: "Да", no: "Нет",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik (Dars21 kanoni).
const Apple = ({ w = 28 }) => {
  const id = 'pq2507a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat + olmalar mo'ralaydi + yashil «10» nishoni.
// Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi (Dars21 kanoni).
const Basket = ({ w = 44 }) => {
  const id = 'pq2507b' + (__gid++);
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

export default function D25_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);      // 'ha' | 'yo'q'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda qo'shilish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const anim = ok && !still;   // jonli g'alaba animatsiyasi (restore/review'da statik)

  const crates = Array.from({ length: TENS });
  const base = Array.from({ length: U1 });   // mavjud birliklar (3)
  const add = Array.from({ length: U2 });    // qo'shiladigan birliklar (4)

  return (
    <div className="pq pq2507">
      <style>{`
        .pq2507{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2507 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2507 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2507 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2507 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2507 .pq-scene{position:relative;width:384px;max-width:100%;height:236px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2507 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2507sun 3.6s ease-in-out infinite;}
        .pq2507 .pq-leaf{position:absolute;left:20px;top:20px;width:9px;height:9px;border-radius:0 60% 0 60%;background:#7cc86a;z-index:1;pointer-events:none;opacity:.85;animation:pq2507leaf 5.2s ease-in-out infinite;}
        .pq2507 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2507 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2507 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2507 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2507 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq2507 .pq-crates{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:172px;}
        .pq2507 .pq-units{display:flex;align-items:center;gap:4px;padding:5px 8px;border-radius:12px;background:rgba(255,255,255,.5);border:1.5px dashed #cdb98a;}
        .pq2507 .pq-uset{display:flex;gap:3px;}
        .pq2507 .pq-obj{line-height:0;}
        .pq2507 .pq-obj.join{animation:pq2507join .5s ease both;animation-delay:var(--jd,0s);}
        .pq2507 .pq-uplus{font-size:17px;font-weight:900;color:#c9822f;}
        .pq2507 .pq-gl{padding:1px 11px;border-radius:999px;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:13px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pq2507pop .38s ease both;}
        .pq2507 .pq-gl.tw{border-color:#2f6bab;color:#2f6bab;}
        .pq2507 .pq-plus{font-size:24px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        .pq2507 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2507tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2507 .pq-spark.s2{animation-delay:-.6s;} .pq2507 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2507 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pq2507in .3s ease both;}
        .pq2507 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2507 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2507 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2507 .pq-eq .ok{color:#1a7f43;font-size:22px;font-weight:900;}
        .pq2507 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2507in .3s .1s both;}

        .pq2507 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq2507 .pq-opt{min-width:118px;height:62px;padding:0 18px;font-size:22px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2507 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2507 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq2507 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2507 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2507cele .5s ease;}
        .pq2507 .pq-opt:disabled{cursor:default;}
        .pq2507 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2507in .22s ease both;}
        .pq2507 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2507 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2507sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2507leaf{0%{transform:translate(0,0) rotate(0);opacity:.85;}50%{transform:translate(10px,26px) rotate(120deg);opacity:.6;}100%{transform:translate(2px,54px) rotate(220deg);opacity:0;}}
        @keyframes pq2507join{from{opacity:0;transform:translateX(14px) scale(.6);}to{opacity:1;transform:translateX(0) scale(1);}}
        @keyframes pq2507pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2507tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2507cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2507in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {/* 5 savat = 5 o'nlik = 50 (o'zgarmaydi) */}
          <div className="pq-group">
            <div className="pq-crates">
              {crates.map((_, i) => (
                <span key={i} className="pq-obj"><Basket w={42} /></span>
              ))}
            </div>
            {ok && <span className="pq-gl tw">{TENS * 10}</span>}
          </div>

          {/* Birliklarga birliklar QO'SHILADI (ayirish EMAS) */}
          <span className="pq-plus">{'+'}</span>

          {/* birliklar: 3 mavjud + 4 qo'shiladi = 7 */}
          <div className="pq-group">
            <div className="pq-units">
              <div className="pq-uset">
                {base.map((_, i) => (<span key={'b' + i} className="pq-obj"><Apple w={26} /></span>))}
              </div>
              <span className="pq-uplus">{'+'}</span>
              <div className="pq-uset">
                {add.map((_, i) => (
                  <span key={'a' + i} className={'pq-obj' + (anim ? ' join' : '')} style={{ '--jd': `${0.15 + i * 0.16}s` }}><Apple w={26} /></span>
                ))}
              </div>
            </div>
            {ok && <span className="pq-gl">{UTOTAL}</span>}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: birliklar qo'shiladi (3 + 4 = 7), o'nlik o'zgarmaydi, 53 + 4 = 57 ✓ */}
      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'+'}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b><span className="ok">✓</span></div>
        <div className="pq-sub">{U1} {'+'} {U2} = {UTOTAL}</div>
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
