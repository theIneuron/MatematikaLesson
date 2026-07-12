// Dars21 · Amaliyot 10 — NEW «Sonni yasang» build «Olma bog'i» · 🔴 · tag: build_two_digit
// Bola 42 ni O'ZI yasaydi: [+ O'nlik savat] va [+ Yakka olma] tugmalari bilan. Savat = 10 olmani
// bog'lagan BITTA birlik ('10' nishoni bilan), yakka olma = 1 birlik. O'nliklar VA birliklar
// QO'SHILADI: 40 + 2 = 42 (savat-guruh bilan olma-guruh orasida minus YO'Q). Sahnadagi savat yoki
// olmani bosib olib tashlash mumkin (xatoni tuzatish uchun). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q,
// retry yo'q; setChecked FAQAT to'g'rida (tens===4 && ones===2). studentAnswer = { tens, ones }.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10, TENS_TARGET = 4, ONES_TARGET = 2, TARGET = 42;
const TENS_VAL = TENS_TARGET * TEN; // 40
const CAP = 9; // har guruh 0..9
const DATA = { target: TARGET, tens: TENS_TARGET, ones: ONES_TARGET, ptype: 'NEW', level: '🔴', tag: 'build_two_digit' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Yasang", title: "Sonni yasang",
    setup: "Bitta savat — 10 olmali o'nlik, bitta olma — 1 birlik.",
    ask: "Tugmalar bilan 42 sonini yasang.",
    correct: "Barakalla! 4 savat va 2 olma — qirq ikki. 42 ni yasadingiz!",
    hint: "42 — bu 4 o'nlik va 2 birlik. 4 savat, 2 olma qo'ying.",
    btnTen: "O'nlik savat", btnOne: "Yakka olma",
    tensLbl: "O'nliklar", onesLbl: "Birliklar",
    rmHint: "Ortiqchani bosib oling",
    emptyHint: "Tugmalar bilan yasang",
  },
  ru: {
    eyebrow: "Яблоневый сад · Собери", title: "Собери число",
    setup: "Корзина — это десяток из 10 яблок, яблоко — это единица.",
    ask: "Собери число 42 с помощью кнопок.",
    correct: "Молодец! 4 корзины и 2 яблока — сорок два. Ты собрал 42!",
    hint: "42 — это 4 десятка и 2 единицы. Поставь 4 корзины и 2 яблока.",
    btnTen: "Десяток", btnOne: "Единица",
    tensLbl: "Десятки", onesLbl: "Единицы",
    rmHint: "Лишнее — нажми, убери",
    emptyHint: "Собирай кнопками",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma tanasi (2-ton radial) + barg + band + oq blik.
// Bitta yakka olma = bitta birlik.
let __aid = 0;
const Apple = ({ w = 24 }) => {
  const id = 'pq2110a' + (__aid++);
  const h = w * 34 / 30;
  return (
    <svg viewBox="0 0 30 34" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (o'nlik): to'qilgan savat (to'qima yoylari) + jiyakdan mo'ralab turgan olmalar + '10'
// nishoni. Savat = 10 olmani bog'lagan BITTA birlik (ichi qayta sanalmaydi).
let __bid = 0;
const Basket = ({ w = 48 }) => {
  const id = 'pq2110b' + (__bid++);
  const h = w * 78 / 88;
  return (
    <svg viewBox="0 0 88 78" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0a45e" />
          <stop offset="100%" stopColor="#9c6329" />
        </linearGradient>
        <radialGradient id={id + 'ap'} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <g stroke="#a6291f" strokeWidth=".7">
        <circle cx="26" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="62" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="44" cy="25" r="11.5" fill={`url(#${id}ap)`} />
      </g>
      <path d="M46,15 Q52,12 53.5,16.5 Q48.5,18.5 46,15 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".6" />
      <rect x="8" y="33" width="72" height="9" rx="4.5" fill="#c98a45" stroke="#7a4a20" strokeWidth="1.4" />
      <path d="M12,42 L76,42 L67,72 Q66,75 62,75 L26,75 Q22,75 21,72 Z" fill={`url(#${id})`} stroke="#7a4a20" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke="#7a4a20" strokeWidth="1.1" opacity=".55" fill="none">
        <path d="M24,42 L27,74" /><path d="M34,42 L35.6,74" /><path d="M44,42 L44,75" />
        <path d="M54,42 L52.4,74" /><path d="M64,42 L61,74" />
      </g>
      <g stroke="#5f3b18" strokeWidth="1.2" opacity=".5" fill="none">
        <path d="M14,52 Q44,58 74,52" /><path d="M17,62 Q44,68 71,62" />
      </g>
    </svg>
  );
};

export default function D21_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [basketIds, setBasketIds] = useState([]); // qo'yilgan o'nlik savatlar (barqaror id-lar)
  const [appleIds, setAppleIds] = useState([]);   // qo'yilgan yakka olmalar (barqaror id-lar)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const seqRef = useRef(0); // yangi element uchun ketma-ket unikal id
  // Review yoki qayta ochilishda pop-animatsiya qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  const tens = basketIds.length, ones = appleIds.length;
  const total = tens * TEN + ones;

  // RESTORE: studentAnswer = { tens, ones } dan sahnani qayta tiklaydi (msg doim; setChecked faqat to'g'rida).
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const tN = Math.max(0, Math.min(Number(sa.tens) || 0, CAP));
      const oN = Math.max(0, Math.min(Number(sa.ones) || 0, CAP));
      setBasketIds(Array.from({ length: tN }, (_, k) => k));
      setAppleIds(Array.from({ length: oN }, (_, k) => k));
      seqRef.current = Math.max(tN, oN);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(total > 0 && !checked); }, [total, checked, onReady]);

  const lock = isReview || checked;
  const addTen = () => { if (lock || tens >= CAP) return; setBasketIds((p) => [...p, seqRef.current++]); setFeedback(null); };
  const addOne = () => { if (lock || ones >= CAP) return; setAppleIds((p) => [...p, seqRef.current++]); setFeedback(null); };
  const removeTen = (id) => { if (lock) return; setBasketIds((p) => p.filter((x) => x !== id)); setFeedback(null); };
  const removeOne = (id) => { if (lock) return; setAppleIds((p) => p.filter((x) => x !== id)); setFeedback(null); };

  const check = useCallback(() => {
    if (total <= 0) return;
    const correct = tens === TENS_TARGET && ones === ONES_TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(TARGET)], studentAnswer: { tens, ones }, correctAnswer: { tens: TENS_TARGET, ones: ONES_TARGET }, correct, meta: { ...DATA } });
  }, [tens, ones, total, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2110">
      <style>{`
        .pq2110{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2110 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2110 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2110 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2110 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2110 .pq-scene{position:relative;width:420px;max-width:100%;min-height:214px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 46%,#cdeeb6 72%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2110 .pq-sun{position:absolute;left:16px;top:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2110sun 3.6s ease-in-out infinite;}
        .pq2110 .pq-branch{position:absolute;z-index:1;pointer-events:none;color:#4fa845;transform-origin:top center;animation:pq2110sway 4.2s ease-in-out infinite;}
        .pq2110 .pq-branch.l{left:-6px;top:24px;} .pq2110 .pq-branch.r{right:-6px;top:18px;animation-delay:-1.6s;}
        .pq2110 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:38px;background:radial-gradient(120% 100% at 50% 100%,#a6d67c 0%,#8fca6b 60%,#7cbd5a 100%);z-index:1;pointer-events:none;}
        .pq2110 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2110 .pq-arena{position:relative;z-index:3;padding:40px 12px 16px;display:flex;flex-direction:column;align-items:center;gap:9px;}
        .pq2110 .pq-row{display:flex;align-items:stretch;justify-content:center;gap:8px;width:100%;}
        .pq2110 .pq-tray{position:relative;flex:1 1 0;min-width:0;min-height:74px;padding:20px 7px 8px;border-radius:14px;background:rgba(255,255,255,.34);border:2px solid rgba(120,150,120,.34);display:flex;flex-wrap:wrap;align-content:flex-end;align-items:flex-end;justify-content:center;gap:3px 3px;}
        .pq2110 .pq-tray.units{flex:0 0 34%;}
        .pq2110 .pq-tray.empty{border-style:dashed;background:rgba(255,255,255,.2);}
        .pq2110 .pq-cap{position:absolute;top:5px;left:9px;z-index:4;font-size:11px;font-weight:900;letter-spacing:.02em;color:#3c6b45;font-variant-numeric:tabular-nums;pointer-events:none;}
        .pq2110 .pq-cap b{color:#1a7f43;}
        .pq2110 .pq-plus{align-self:center;font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;}
        /* Bosiladigan (olib tashlanadigan) savat/olma — idle harakat YO'Q (tap aniq tegsin). */
        .pq2110 .pq-item{position:relative;padding:0;border:none;background:none;cursor:pointer;line-height:0;border-radius:9px;transition:transform .14s;}
        .pq2110 .pq-item:hover:not(:disabled){transform:translateY(-3px) scale(1.05);}
        .pq2110 .pq-item:active:not(:disabled){transform:scale(.93);}
        .pq2110 .pq-item:disabled{cursor:default;}
        .pq2110 .pq-item .pop{display:block;animation:pq2110pop .34s cubic-bezier(.3,1.4,.5,1) both;}
        /* '10' nishoni — bezak qatlam, taplarni ushlamaydi */
        .pq2110 .pq-badge{position:absolute;top:-5px;right:-3px;min-width:20px;height:18px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:5;pointer-events:none;font-variant-numeric:tabular-nums;box-shadow:0 1px 3px rgba(0,0,0,.28);border:1.5px solid #fff;}
        /* jonli jami pilyulasi */
        .pq2110 .pq-total{margin-top:1px;background:#fff;border:2.5px solid #b8d0ea;color:#2f6bab;font-weight:900;font-size:16px;padding:2px 16px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 3px 7px rgba(0,0,0,.16);transition:.15s;}
        .pq2110 .pq-total.win{border-color:#1a7f43;color:#1a7f43;animation:pq2110pop .45s ease both;}
        .pq2110 .pq-taphint{font-size:12px;font-weight:800;color:#3c6b45;background:rgba(255,255,255,.7);padding:3px 12px;border-radius:999px;pointer-events:none;}

        .pq2110 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2110tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2110 .pq-spark.s2{animation-delay:-.6s;} .pq2110 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2110 .pq-tools{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:14px;}
        .pq2110 .pq-add{display:inline-flex;align-items:center;gap:7px;padding:11px 18px;border-radius:16px;border:2.5px solid #cfa96a;background:linear-gradient(#fff5e6,#f6e4c6);color:#7a4a20;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #cfa96a;transition:.12s;}
        .pq2110 .pq-add.one{border-color:#d98077;background:linear-gradient(#ffeeec,#ffd9d4);color:#a6291f;box-shadow:0 3px 0 #d98077;}
        .pq2110 .pq-add:hover:not(:disabled){filter:brightness(1.04);transform:translateY(-1px);}
        .pq2110 .pq-add:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #cfa96a;}
        .pq2110 .pq-add.one:active:not(:disabled){box-shadow:0 1px 0 #d98077;}
        .pq2110 .pq-add:disabled{background:#eceae6;border-color:#c9c6c0;color:#9a968f;box-shadow:0 3px 0 #c9c6c0;cursor:default;}
        .pq2110 .pq-add .ic{width:26px;height:26px;flex:0 0 auto;}
        .pq2110 .pq-add .pl{font-size:19px;font-weight:900;line-height:1;}
        .pq2110 .pq-rm{text-align:center;margin-top:9px;font-size:12.5px;font-weight:700;color:#8a7a5a;}

        .pq2110 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pq2110in .3s ease both;}
        .pq2110 .pq-eq b{min-width:44px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2110 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2110 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2110 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2110in .22s ease both;}
        .pq2110 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2110 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2110sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2110sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2110pop{0%{opacity:0;transform:translateY(-10px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2110tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2110in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <svg className="pq-branch l" width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M0,6 Q26,2 40,14" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M20,4 Q26,0 27,5 Q22,7 20,4 Z" /><path d="M33,8 Q39,4 40,9 Q35,11 33,8 Z" /></g></svg>
        <svg className="pq-branch r" width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M54,6 Q28,2 14,14" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M34,4 Q28,0 27,5 Q32,7 34,4 Z" /><path d="M21,8 Q15,4 14,9 Q19,11 21,8 Z" /></g></svg>
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          <div className="pq-row">
            {/* O'nliklar tovoni — qo'yilgan savatlar (har biri '10' nishonli bitta birlik) */}
            <div className={'pq-tray' + (tens === 0 ? ' empty' : '')}>
              <span className="pq-cap">{t.tensLbl}: <b>{tens}</b></span>
              {basketIds.map((id) => (
                <button key={id} type="button" className="pq-item" disabled={lock} onClick={() => removeTen(id)} aria-label={t.tensLbl}>
                  <span className={still ? undefined : 'pop'}>
                    <Basket w={46} />
                    <b className="pq-badge">{TEN}</b>
                  </span>
                </button>
              ))}
            </div>

            {/* O'nliklar VA birliklar QO'SHILADI: 40 + 2 (minus EMAS) */}
            <span className="pq-plus">{'+'}</span>

            {/* Birliklar tovoni — qo'yilgan yakka olmalar */}
            <div className={'pq-tray units' + (ones === 0 ? ' empty' : '')}>
              <span className="pq-cap">{t.onesLbl}: <b>{ones}</b></span>
              {appleIds.map((id) => (
                <button key={id} type="button" className="pq-item" disabled={lock} onClick={() => removeOne(id)} aria-label={t.onesLbl}>
                  <span className={still ? undefined : 'pop'}><Apple w={24} /></span>
                </button>
              ))}
            </div>
          </div>

          {total > 0
            ? <span className={'pq-total' + (ok ? ' win' : '')}>{total}</span>
            : <span className="pq-taphint">{t.emptyHint}</span>}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {!lock && total > 0 && <div className="pq-rm">{t.rmHint}</div>}

      {ok && (
        <div className="pq-eq"><b>{TENS_VAL}</b><i>{'+'}</i><b>{ONES_TARGET}</b><i>=</i><b className="res">{TARGET}</b></div>
      )}

      <div className="pq-tools">
        <button type="button" className="pq-add" disabled={lock || tens >= CAP} onClick={addTen}>
          <span className="pl">{'+'}</span>
          <svg className="ic" viewBox="0 0 88 78" aria-hidden="true"><g stroke="#a6291f" strokeWidth=".7"><circle cx="26" cy="30" r="10" fill="#e8443a" /><circle cx="62" cy="30" r="10" fill="#e8443a" /><circle cx="44" cy="25" r="11.5" fill="#e8443a" /></g><rect x="8" y="33" width="72" height="9" rx="4.5" fill="#c98a45" stroke="#7a4a20" strokeWidth="1.4" /><path d="M12,42 L76,42 L67,72 Q66,75 62,75 L26,75 Q22,75 21,72 Z" fill="#c98243" stroke="#7a4a20" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          <span>{t.btnTen}</span>
        </button>
        <button type="button" className="pq-add one" disabled={lock || ones >= CAP} onClick={addOne}>
          <span className="pl">{'+'}</span>
          <svg className="ic" viewBox="0 0 30 34" aria-hidden="true"><path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" /><path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" /><path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill="#e8443a" stroke="#a6291f" strokeWidth=".8" /></svg>
          <span>{t.btnOne}</span>
        </button>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
