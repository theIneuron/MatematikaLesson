// Dars21 · Amaliyot 05 — Zanjir «Olma bog'i» · place_chain · tag: place_chain · level 🔴
// 4 mini-savol 2×2 panjarada: har kartada TOZA sonli ifoda (son → ? slot) + 4 variant-chip.
// Karta ICHIDA grafika/animatsiya YO'Q (metodist talabi) — savat/olma vizuallari olib tashlangan;
// ambient sahna (quyosh, daraxtlar, taxta) faqat panjara TEPASIDA qoladi.
// Har sonning O'NLIKLAR xonasidagi raqami tanlanadi: 23→2, 45→4, 60→6, 38→3.
// G'alabada har kartada chip «20 + 3 = 23» (o'nlik va birlik QO'SHILADI, minus yo'q).
// Distraktorlar: M1 pozitsiya-almashinuv (birliklar raqamini tanlash), M2 raqamlarni qo'shish.
// VEDI-DO-VERNOGO: noto'g'ri qator qulflamaydi, retry tugmasi yo'q; setChecked FAQAT hammasi to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Har qator: son, o'nliklar raqami (javob = tens), birliklar, uch variant.
// opts pozitsiyalari almashtirilgan (to'g'ri javob doim bir joyda emas).
const ROWS = [
  { num: 23, tens: 2, units: 3, opts: [1, 2, 3, 5] },   // to'g'ri 2-pozitsiyada; 3=M1, 5=M2 (2+3)
  { num: 45, tens: 4, units: 5, opts: [3, 4, 5, 9] },   // to'g'ri 1-pozitsiyada; 5=M1, 9=M2 (4+5)
  { num: 60, tens: 6, units: 0, opts: [0, 6, 7, 8] },   // to'g'ri 3-pozitsiyada; 0=M1, 7=yaqin xato
  { num: 38, tens: 3, units: 8, opts: [2, 3, 4, 8] },   // to'g'ri 2-pozitsiyada; 8=M1, 4=yaqin xato
];
const N = ROWS.length;
const DATA = { level: '🔴', tag: 'place_chain', ptype: 'P-chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir",
    title: "O'nliklar zanjiri",
    setup: "Kartochkalarda 4 ta son yozilgan: 23, 45, 60 va 38.",
    ask: "Har bir sonning o'nliklar xonasidagi raqamini tanlang.",
    correct: "Barakalla! Har sonning o'nliklar xonasini topdingiz.",
    hint: "O'nliklar — sonning birinchi raqami.",
    tensL: "o'nlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка",
    title: "Цепочка десятков",
    setup: "На карточках написаны 4 числа: 23, 45, 60 и 38.",
    ask: "Для каждого числа выбери цифру в разряде десятков.",
    correct: "Молодец! Ты нашёл разряд десятков в каждом числе.",
    hint: "Десятки — первая цифра числа.",
    tensL: "дес.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Dekorativ olma daraxti (sahna bezagi, bosiladigan EMAS).
const Tree = ({ size = 46 }) => (
  <svg viewBox="0 0 40 46" width={size} height={size * 46 / 40} aria-hidden="true" style={{ display: 'block' }}>
    <rect x="17.5" y="28" width="5" height="16" rx="2" fill="#8a5a2c" />
    <circle cx="20" cy="18" r="14" fill="#6fae4e" />
    <circle cx="11" cy="22" r="9" fill="#7db85a" />
    <circle cx="29" cy="22" r="9" fill="#7db85a" />
    <circle cx="14" cy="15" r="2.2" fill="#d9534b" />
    <circle cx="25" cy="13" r="2.2" fill="#d9534b" />
    <circle cx="22" cy="23" r="2.2" fill="#e08a2e" />
    <circle cx="12" cy="24" r="2" fill="#d9534b" />
  </svg>
);

export default function D21_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: tanlangan o'nliklar soni}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady]);

  const rowRight = (i) => vals[i] === ROWS[i].tens;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.tens);
    setFeedback({ correct, msg: correct ? t.correct : t.hint });
    if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: ROWS.map((r) => String(r.num)),
      studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) },
      correctAnswer: { vals: ROWS.map((r) => r.tens) },
      correct,
      meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2105">
      <style>{`
        .pq2105{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2105 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a8a2e;text-transform:uppercase;}
        .pq2105 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2105 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2105 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2105 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#eef7e4,#e4f1d8);border:2px solid #d3e6bf;}

        /* sahna: olma bog'i — quyosh, daraxtlar, taxta, o't (ambient) */
        .pq2105 .pq-scene{position:relative;width:372px;max-width:100%;height:82px;border-radius:18px;background:linear-gradient(#dff0fb 0%,#eaf6dd 58%,#dcefc7 100%);border:2px solid #d3e6bf;overflow:hidden;}
        .pq2105 .pq-sun{position:absolute;top:12px;left:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2105sun 3.6s ease-in-out infinite;}
        .pq2105 .pq-tree{position:absolute;bottom:8px;z-index:1;pointer-events:none;transform-origin:50% 100%;animation:pq2105sway 4.4s ease-in-out infinite;}
        .pq2105 .pq-tree.t1{left:12px;} .pq2105 .pq-tree.t2{right:12px;animation-delay:-2.2s;}
        .pq2105 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:12px;background:linear-gradient(#8fc45f,#6fa845);border-top:2px solid #5a8a34;z-index:1;}
        .pq2105 .pq-board{position:absolute;top:11px;left:50%;transform:translateX(-50%);z-index:5;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#7aa93f,#5a8a2e);border:2.5px solid #46701f;color:#f4fbe9;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2105 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:14px;pointer-events:none;animation:pq2105twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2105 .pq-spark.s2{animation-delay:-.6s;} .pq2105 .pq-spark.s3{animation-delay:-1.15s;}

        /* qatorlar */
        .pq2105 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;width:100%;}
        .pq2105 .pq-rw{display:flex;gap:10px;align-items:center;justify-content:center;align-content:center;flex-wrap:wrap;padding:8px 9px;border-radius:14px;border:2.5px solid #d7e6c6;background:#fbfdf7;transition:.15s;}
        .pq2105 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2105 .pq-rw.good.win{animation:pq2105cele .5s ease;}
        .pq2105 .pq-rw.bad{border-color:#e0b06a;background:#fdf6ec;animation:pq2105shake .35s ease;}

        /* son + o'nlik slot */
        .pq2105 .pq-eq{display:flex;align-items:center;gap:7px;font-variant-numeric:tabular-nums;}
        .pq2105 .pq-num{font-size:26px;font-weight:900;color:#3f5d80;min-width:38px;text-align:center;}
        .pq2105 .pq-num .t{color:#5a8a2e;}
        .pq2105 .pq-arr{font-size:16px;font-weight:900;color:#9aa7b6;}
        .pq2105 .pq-slot{width:40px;height:42px;border-radius:10px;border:2.5px dashed #c3d6ad;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#8fa87a;font-variant-numeric:tabular-nums;animation:pq2105breath 2.4s ease-in-out infinite;}
        .pq2105 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2105 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2105 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2105 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2105 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}

        /* g'alaba: chip (qo'shib birlashtirish) + o'nlik yorlig'i */
        .pq2105 .pq-win{display:flex;flex-direction:column;gap:2px;margin-left:2px;flex-basis:100%;align-items:center;}
        .pq2105 .pq-chip{padding:4px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pq2105pop .35s ease both;}
        .pq2105 .pq-step{font-size:12px;font-weight:800;color:#5a8a2e;white-space:nowrap;padding-left:2px;animation:pq2105in .3s .12s both;}

        /* variantlar (bosiladigan — loop-animatsiya YO'Q) */
        .pq2105 .pq-sgs{display:flex;gap:6px;margin-left:2px;flex-basis:100%;justify-content:center;align-content:center;}
        .pq2105 .pq-sg{width:42px;height:44px;border-radius:11px;border:2.5px solid #d7e6c6;background:#fff;font-size:21px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2105 .pq-sg:hover:not(:disabled){border-color:#8fbf5e;transform:translateY(-2px);}
        .pq2105 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2105 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2105 .pq-sg:disabled{cursor:default;}

        .pq2105 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2105in .22s ease both;}
        .pq2105 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2105 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2105sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2105sway{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}}
        @keyframes pq2105breath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pq2105shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2105cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2105pop{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2105twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2105in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <div className="pq-board">{t.title}</div>
          <span className="pq-tree t1"><Tree size={44} /></span>
          <span className="pq-tree t2"><Tree size={44} /></span>
          <span className="pq-ground" />
          {ok && (<>
            <span className="pq-spark" style={{ left: '30%', top: '14px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '52%', top: '30px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '68%', top: '12px' }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const has = vals[i] != null;
            const tensStr = String(r.num)[0];   // o'nliklar raqami (birinchi raqam)
            const unitStr = String(r.num)[1];   // birliklar raqami
            return (
              <div key={i} className={'pq-rw' + cls}>
                {/* karta ichida faqat TOZA sonli ifoda: son → ? slot (grafika yo'q) */}
                {/* son + o'nlik slot */}
                <div className="pq-eq">
                  <span className="pq-num"><span className="t">{tensStr}</span>{unitStr}</span>
                  <span className="pq-arr">{'→'}</span>
                  <div className={'pq-slot' + (has ? ' has' : '')}>{has ? vals[i] : '?'}</div>
                </div>

                {ok ? (
                  <div className="pq-win">
                    <span className="pq-chip">{r.tens * 10} + {r.units} = {r.num}</span>
                    <span className="pq-step">{r.tens} {t.tensL}</span>
                  </div>
                ) : (
                  <div className="pq-sgs">
                    {r.opts.map((n) => (
                      <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                        onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
