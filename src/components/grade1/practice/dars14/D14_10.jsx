// Dars14 · Amaliyot 10 — NEW «O'n uchni yasab ol!» · 🔴 · tag: build_teen
// MEVA BOG'I SAHNASI. Chapda 10 UYALI TO'LA NOK YASHIGI («10» yorliq). O'ngda maysada sochilgan
// yakka noklar. Bola yakka noklarni birma-bir bosib yashik yonidagi uyalarga qo'shadi.
// Aynan uchta qo'shib — o'n uch. TEEN modeli: 11-15 = TO'LA YASHIK (o'n) + N YAKKA.
// To'la yashik alohida, yakkalar alohida ko'rinadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10, NEED = 3, TARGET = 13;
const DATA = { ten: 10, ones: 3, target: 13, ptype: 'NEW', level: '🔴', tag: 'build_teen' };

// Sochilgan 6 yakka nok — bola shulardan aynan uchtasini qo'shadi.
// Sahna px (kenglik 372), rot = qiyalik.
const LOOSE = [
  { x: 168, y: 196, r: -14 },
  { x: 212, y: 218, r: 12 },
  { x: 256, y: 192, r: -7 },
  { x: 300, y: 220, r: 18 },
  { x: 208, y: 158, r: -20 },
  { x: 300, y: 160, r: 9 },
];

const T = {
  uz: {
    eyebrow: "Meva bog'i · Yasab ol", title: "O'n uchni yasab ol",
    setup: "Chapda to'la yashik — o'nta nok. Maysada yakka noklar sochilgan.",
    ask: "O'n uch bo'lishi uchun yashik yoniga uchta yakka nok qo'shing.",
    correct: "Barakalla! To'la yashik va uch yakka — o'n uch. O'zingiz yasadingiz!",
    hint: "To'la yashik o'nta. Yana uchta yakka qo'shsangiz — o'n uch bo'ladi.",
    board: "O'n uchni yasab ol",
    tapHint: "Yakka noklarni bosing",
    tenTag: "to'la yashik · 10",
    chip: "10 + 3 = 13",
  },
  ru: {
    eyebrow: "Фруктовый сад · Собери", title: "Сделай тринадцать",
    setup: "Слева полный ящик — десять груш. На траве рассыпаны отдельные груши.",
    ask: "Чтобы получилось тринадцать, добавьте к ящику три отдельные груши.",
    correct: "Молодец! Полный ящик и три отдельных — тринадцать. Вы сделали сами!",
    hint: "В полном ящике десять. Добавьте ещё три отдельных — будет тринадцать.",
    board: "Сделай тринадцать",
    tapHint: "Нажимайте на груши",
    tenTag: "полный ящик · 10",
    chip: "10 + 3 = 13",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// NOK KANONI (yakka birlik): sarg'ish-yashil nok — bandi + barg + blik. Bitta nok = bitta birlik.
const Pear = ({ w = 24 }) => (
  <svg viewBox="0 0 24 30" width={w} height={(w * 30) / 24} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 6 Q12 2.4 14 1" fill="none" stroke="#7a4b1e" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M12.6 5 Q16.6 2.4 18 5.4 Q14.8 6.8 12.6 5 Z" fill="#57a84f" />
    <path d="M12 6.5 C14.5 6.5 15 9.5 15.8 12.5 C17.5 15 19 17.5 19 20.5 C19 25 16 28.5 12 28.5 C8 28.5 5 25 5 20.5 C5 17.5 6.5 15 8.2 12.5 C9 9.5 9.5 6.5 12 6.5 Z" fill="#c9d34a" stroke="#9aa32e" strokeWidth="1.1" />
    <ellipse cx="9.4" cy="19" rx="2.4" ry="3.4" fill="#fff" opacity=".32" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [order, setOrder] = useState([]); // qo'shilgan yakka-nok indekslari (tartib bilan)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda qo'shish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const units = order.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const u = initialAnswer.studentAnswer.units;
      const n = typeof u === 'number' ? Math.max(0, Math.min(u, NEED)) : NEED;
      setOrder(Array.from({ length: n }, (_, k) => k));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(units === NEED && !checked); }, [units, checked, onReady]);

  const lock = isReview || checked;
  const take = (i) => {
    if (lock || units >= NEED || order.includes(i)) return;
    setOrder((prev) => [...prev, i]);
  };

  const check = useCallback(() => {
    const u = order.length;
    const correct = TEN + u === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(TARGET)], studentAnswer: { units: u }, correctAnswer: { units: NEED }, correct, meta: { ...DATA } });
  }, [order, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1410">
      <style>{`
        .pq1410{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1410 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e8d2e;text-transform:uppercase;}
        .pq1410 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1410 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1410 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1410 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#e8f4d9,#d6e9c2);border:2px solid #c4dba8;}
        /* MEVA BOG'I SAHNASI */
        .pq1410 .pq-scene{position:relative;width:372px;max-width:100%;height:290px;border-radius:18px;background:linear-gradient(#c3e7fb 0%,#daf1fd 40%,#eaf8ff 52%);border:2px solid #b8d9c8;overflow:hidden;}
        .pq1410 .pq-sun{position:absolute;top:16px;left:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#ffd84a 72%,#f6b81f);box-shadow:0 0 16px 4px rgba(255,214,74,.55);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1410 .pq-cloud{position:absolute;height:13px;background:#fff;border-radius:20px;opacity:.94;z-index:1;}
        .pq1410 .pq-cloud::before{content:'';position:absolute;background:#fff;border-radius:50%;width:17px;height:17px;top:-7px;left:7px;}
        .pq1410 .pq-cloud.c1{top:22px;left:54%;width:36px;animation:pqDrift 15s ease-in-out infinite;}
        .pq1410 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:160px;background:linear-gradient(#8ccb64 0%,#69b34c 60%,#5aa53f 100%);z-index:1;}
        .pq1410 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#8ccb64 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        /* nok daraxti (o'ngda) */
        .pq1410 .pq-tree{position:absolute;right:6px;bottom:140px;width:64px;height:76px;z-index:2;}
        .pq1410 .pq-trunk{position:absolute;left:27px;bottom:0;width:10px;height:26px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:3px;}
        .pq1410 .pq-leaves{position:absolute;left:2px;bottom:18px;width:60px;height:56px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:15px 10px 0 -10px #6fb552;animation:pqSwayT 5s ease-in-out infinite;transform-origin:bottom center;}
        .pq1410 .pq-tpear{position:absolute;z-index:3;animation:pqBobA 3.6s ease-in-out infinite;}
        .pq1410 .pq-board{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:6px 15px 7px;border-radius:10px;background:linear-gradient(#c98a4e,#a86c34);border:2.5px solid #7f5326;color:#fdf3e2;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1410 .pq-board::before,.pq1410 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#7f5326;}
        .pq1410 .pq-board::before{left:18px;} .pq1410 .pq-board::after{right:18px;}
        /* sanoq tagi — "10 + N" yoki g'alaba chip */
        .pq1410 .pq-tot{position:absolute;top:44px;left:50%;transform:translateX(-50%);z-index:8;padding:3px 15px;border-radius:12px;background:#fff;color:#374151;font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 3px 8px rgba(0,0,0,.16);white-space:nowrap;transition:.15s;}
        .pq1410 .pq-tot.chip{color:#1a7f43;box-shadow:0 4px 12px rgba(26,127,67,.24);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        /* ish zonasi: [TO'LA YASHIK] + [qo'shish uyalari] */
        .pq1410 .pq-work{position:absolute;top:76px;left:14px;z-index:4;display:flex;align-items:flex-end;gap:8px;}
        .pq1410 .pq-work.win{animation:pqCele .6s ease;}
        /* TO'LA YASHIK — 10 uya (2×5), har uyada nok */
        .pq1410 .pq-bundle{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq1410 .pq-boxx{position:relative;padding:6px 7px 8px;border-radius:10px;background:linear-gradient(#d9a561,#c08a45);border:2.5px solid #96662b;box-shadow:0 3px 0 #7d5423,0 5px 8px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.25);}
        .pq1410 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:3px;}
        .pq1410 .pq-cell{position:relative;width:24px;height:26px;border-radius:6px;background:rgba(70,40,10,.22);box-shadow:inset 0 2px 3px rgba(0,0,0,.26);display:flex;align-items:flex-end;justify-content:center;padding-bottom:1px;}
        .pq1410 .pq-btag{padding:1px 11px;border-radius:9px;background:#2f6f3a;color:#fff;font-size:11.5px;font-weight:900;letter-spacing:.02em;box-shadow:0 2px 5px rgba(0,0,0,.14);white-space:nowrap;}
        /* plyus belgisi */
        .pq1410 .pq-plus{font-size:24px;font-weight:900;color:#4e8d2e;padding-bottom:26px;opacity:.85;}
        /* qo'shish uyalari — 3 ta bo'sh joy, yakka nok kelib tushadi (yashikning O'NG tomonida) */
        .pq1410 .pq-add{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq1410 .pq-arow{position:relative;display:flex;gap:4px;padding:6px 6px 7px;border-radius:11px;background:rgba(255,253,246,.4);border:2px dashed #96b06a;}
        .pq1410 .pq-slot{position:relative;width:26px;height:32px;border-radius:6px;display:flex;align-items:flex-end;justify-content:center;box-sizing:border-box;}
        .pq1410 .pq-slot.empty{border:1.5px dashed #9cb478;background:rgba(255,253,246,.55);animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1410 .pq-slot:nth-child(2).empty{animation-delay:-.6s;} .pq1410 .pq-slot:nth-child(3).empty{animation-delay:-1.2s;}
        .pq1410 .pq-apen{position:relative;display:block;}
        .pq1410 .pq-apen.pop{animation:pqFill .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1410 .pq-atag{padding:1px 10px;border-radius:9px;background:#fff;color:#4e8d2e;font-size:11.5px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(0,0,0,.14);white-space:nowrap;}
        .pq1410 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:7;font-variant-numeric:tabular-nums;}
        .pq1410 .pq-cnt.hi{background:#a83b8a;}
        /* sochilgan yakka noklar — bosilganda qo'shish uyasiga o'tadi */
        .pq1410 .pq-loose{position:absolute;width:30px;height:36px;padding:0;border:none;background:none;cursor:pointer;line-height:0;z-index:3;transition:transform .16s,opacity .35s;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1410 .pq-loose:hover:not(:disabled){transform:translateY(-4px) scale(1.08);}
        .pq1410 .pq-loose:disabled{cursor:default;}
        .pq1410 .pq-loose.gone{opacity:0;transform:scale(.3) translateY(-26px);pointer-events:none;}
        .pq1410 .pq-scene.still .pq-loose.gone{display:none;}
        /* Bosiladigan nok — joyi qimirlamaydi (tap aniq tegsin); jonlilik yumshoq yorug'lik pulsi. */
        .pq1410 .pq-lbob{display:block;width:100%;height:100%;animation:pqShimmer 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq1410 .pq-scene.still .pq-lbob{animation:none;}
        .pq1410 .pq-lpen{display:block;width:100%;height:100%;transform:rotate(var(--r,0deg));transform-origin:50% 100%;}
        .pq1410 .pq-taphint{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);z-index:5;font-size:12px;font-weight:800;color:#3f6d22;background:rgba(255,255,255,.85);padding:3px 12px;border-radius:999px;white-space:nowrap;animation:pqBreathHint 2s ease-in-out infinite;}
        .pq1410 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1410 .pq-wstar.w2{animation-delay:-.5s;} .pq1410 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq1410 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1410 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1410 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pqSwayT{0%,100%{transform:rotate(-1.2deg);}50%{transform:rotate(1.2deg);}}
        @keyframes pqBobA{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqShimmer{0%,100%{filter:brightness(1);}50%{filter:brightness(1.12);}}
        @keyframes pqFill{0%{opacity:0;transform:translateY(-14px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#9cb478;}50%{transform:scale(1.06);border-color:#7d9a55;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqBreathHint{0%,100%{transform:translateX(-50%) scale(1);opacity:.9;}50%{transform:translateX(-50%) scale(1.05);opacity:1;}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" />
          <span className="pq-grass" />
          <div className="pq-tree">
            <i className="pq-trunk" />
            <i className="pq-leaves" />
            <span className="pq-tpear" style={{ left: 12, bottom: 40 }}><Pear w={12} /></span>
            <span className="pq-tpear" style={{ left: 36, bottom: 48, animationDelay: '-1.4s' }}><Pear w={12} /></span>
          </div>
          <div className="pq-board">{t.board}</div>

          {/* sanoq tagi: "10 + N" yoki g'alaba chip "10 + 3 = 13" */}
          {ok ? (
            <span className="pq-tot chip">{t.chip}</span>
          ) : (
            <span className="pq-tot">{TEN} + {units}</span>
          )}

          <div className={'pq-work' + (ok ? ' win' : '')}>
            {/* TO'LA YASHIK — 10 nok, 10 uya, doim to'la */}
            <div className="pq-bundle">
              <div className="pq-boxx">
                <div className="pq-grid">
                  {Array.from({ length: TEN }).map((_, k) => (
                    <span key={k} className="pq-cell">
                      <Pear w={19} />
                      {ok && <b className="pq-cnt">{k + 1}</b>}
                    </span>
                  ))}
                </div>
              </div>
              <span className="pq-btag">{t.tenTag}</span>
            </div>

            <span className="pq-plus">+</span>

            {/* QO'SHISH uyalari — aynan 3 ta (yashikning O'NG tomonida) */}
            <div className="pq-add">
              <div className="pq-arow">
                {Array.from({ length: NEED }).map((_, k) => {
                  const filled = k < units;
                  return (
                    <span key={k} className={'pq-slot' + (filled ? '' : ' empty')}>
                      {filled && (
                        <span className={'pq-apen' + (still ? '' : ' pop')}>
                          <Pear w={21} />
                          {ok && <b className="pq-cnt hi">{TEN + k + 1}</b>}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <span className="pq-atag">{units} / {NEED}</span>
            </div>
          </div>

          {/* sochilgan yakka noklar — bosilganda uyaga o'tadi */}
          {LOOSE.map((p, i) => {
            const taken = order.includes(i);
            return (
              <button key={i} type="button"
                className={'pq-loose' + (taken ? ' gone' : '')}
                style={{ left: p.x, top: p.y }}
                disabled={lock || taken || units >= NEED}
                onClick={() => take(i)} aria-label="nok">
                <span className="pq-lbob" style={{ '--d': `${-i * 0.28}s` }}>
                  <span className="pq-lpen" style={{ '--r': `${p.r}deg` }}><Pear w={28} /></span>
                </span>
              </button>
            );
          })}

          {!lock && units < NEED && <span className="pq-taphint">{t.tapHint}</span>}

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '30%', top: '40px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '66%', top: '46px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '30px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
