// Dars35 · Amaliyot 09 — «Massa — kilogramm» · Blok 7 massa · Massa masalasi (ayirish) · 🔴 · tag: mass_word
// Qopda 8 kg un edi, 3 kg ishlatildi — necha kg qoldi? Sahna: un qopi (8 kg), 3 kg olib qo'yiladi. MATH 8−3=5.
// Matnli variantlar: '11 kg' (qo'shib yuborish — M «olib tashlash o'rniga qo'shdi»), '5 kg' TO'G'RI (chapda emas), '3 kg' (ishlatilganni javob deb olish).
// ANSWER-LEAK: 8 va 3 — masala shartidagi berilgan; ko'rsatish halol. Natija 5 g'alabagacha yashirin.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint ayirishni o'rgatadi. UNIT uL bilan RU'da 'кг'.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); g'alabada «8 kg − 3 kg = 5 kg» (U+2212) ochiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const HAD = 8, USED = 3, LEFT = 5;          // 8 − 3 = 5
const MINUS = "−";                          // U+2212, ASCII defis EMAS
const OPTIONS = ["11 kg", "5 kg", "3 kg"];  // TO'G'RI '5 kg' (index 1, chapda emas)
const CORRECT = "5 kg";
const DATA = { had: HAD, used: USED, left: LEFT, unit: "kg", options: OPTIONS, answer: CORRECT, level: "🔴", tag: "mass_word" };

const T = {
  uz: {
    eyebrow: "Massa · Kilogramm",
    title: "Necha kg qoldi?",
    setup: "Qopda 8 kg un edi, 3 kg ishlatildi.",
    ask: "Necha kg qoldi?",
    labelBag: "un",
    correct: "Barakalla! 8 kg − 3 kg = 5 kg.",
    hint: "Ishlatilsa — kamayadi, demak ayiramiz. 8 dan 3 ni ayiring.",
  },
  ru: {
    eyebrow: "Масса · Килограмм",
    title: "Сколько кг осталось?",
    setup: "В мешке было 8 кг муки, 3 кг израсходовали.",
    ask: "Сколько кг осталось?",
    labelBag: "мука",
    correct: "Молодец! 8 кг − 3 кг = 5 кг.",
    hint: "Израсходовали — стало меньше, значит вычитаем. От 8 отними 3.",
  },
};

// Birlik lokalizatsiyasi: variant yorlig'idagi 'kg' RU'da 'кг' ko'rsatiladi (ichki qiymat lotin qoladi).
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// UN QOPI: bog'langan bo'yin, to'q matoli tana, un changi; oldida massa nishoni. w — kenglik.
const FlourBag = ({ w = 96, label = "un", tag = "8 kg" }) => {
  const h = w * 118 / 96;
  return (
    <svg viewBox="0 0 96 118" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="pq3509bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3ead2" /><stop offset="55%" stopColor="#e4d3ab" /><stop offset="100%" stopColor="#cdb684" />
        </linearGradient>
      </defs>
      {/* soya */}
      <ellipse cx="48" cy="112" rx="34" ry="6" fill="#000" opacity=".1" />
      {/* qop tanasi */}
      <path d="M22,40 Q20,30 30,26 L66,26 Q76,30 74,40 L78,104 Q78,112 70,112 L26,112 Q18,112 18,104 Z"
        fill="url(#pq3509bag)" stroke="#b79c62" strokeWidth="2" strokeLinejoin="round" />
      {/* bog'langan bo'yin */}
      <path d="M30,26 Q34,14 48,14 Q62,14 66,26 Z" fill="#e8dbb8" stroke="#b79c62" strokeWidth="2" strokeLinejoin="round" />
      <rect x="30" y="24" width="36" height="6" rx="3" fill="#a9863f" />
      <path d="M32,20 Q48,10 64,20" fill="none" stroke="#8a6a2e" strokeWidth="2.4" strokeLinecap="round" />
      {/* buklamalar */}
      <path d="M30,44 Q30,74 32,104" fill="none" stroke="#c7ad74" strokeWidth="1.4" opacity=".6" />
      <path d="M66,44 Q66,74 64,104" fill="none" stroke="#c7ad74" strokeWidth="1.4" opacity=".6" />
      {/* un changi nuqtalari */}
      <g fill="#fffdf5" opacity=".8">
        <circle cx="40" cy="58" r="1.5" /><circle cx="54" cy="66" r="1.3" /><circle cx="46" cy="78" r="1.6" /><circle cx="58" cy="86" r="1.2" />
      </g>
      {/* yorliq */}
      <rect x="30" y="60" width="36" height="20" rx="4" fill="#fff" stroke="#c9b072" strokeWidth="1.4" />
      <text x="48" y="74" textAnchor="middle" fontSize="11" fontWeight="800" fill="#7a5f24" fontFamily="Manrope, sans-serif">{label}</text>
      {/* massa nishoni (berilgan shart — halol) */}
      <g>
        <rect x="30" y="88" width="36" height="16" rx="8" fill="#eef4fb" stroke="#3f7ac0" strokeWidth="1.6" />
        <text x="48" y="100" textAnchor="middle" fontSize="11" fontWeight="900" fill="#2f6bab" fontFamily="Manrope, sans-serif">{tag}</text>
      </g>
    </svg>
  );
};

// Olib qo'yilgan ulush: kichik idish + 3 kg nishoni (kamayish yo'nalishi strelka bilan)
const Scoop = ({ w = 58, tag = "3 kg" }) => {
  const h = w * 60 / 58;
  return (
    <svg viewBox="0 0 58 60" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <ellipse cx="29" cy="55" rx="18" ry="3.6" fill="#000" opacity=".08" />
      <path d="M10,26 L48,26 L44,50 Q44,54 40,54 L18,54 Q14,54 14,50 Z" fill="#dfe6ee" stroke="#9fb0c2" strokeWidth="1.6" strokeLinejoin="round" />
      <ellipse cx="29" cy="26" rx="19" ry="5" fill="#f6efdd" stroke="#c9b072" strokeWidth="1.4" />
      <g fill="#fffdf5" opacity=".9"><circle cx="24" cy="24" r="1.4" /><circle cx="34" cy="25" r="1.2" /><circle cx="29" cy="22" r="1.3" /></g>
      <g>
        <rect x="9" y="34" width="40" height="16" rx="8" fill="#fdf0e3" stroke="#c9822f" strokeWidth="1.6" />
        <text x="29" y="46" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b46e1f" fontFamily="Manrope, sans-serif">{tag}</text>
      </g>
    </svg>
  );
};

export default function D35_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const uL = (s) => lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s;

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
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
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bezak — bosiladigan nishon EMAS)

  return (
    <div className={"pq pq3509" + (still ? " still" : "")}>
      <style>{`
        .pq3509.still *{animation:none !important;}
        .pq3509{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3509 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3509 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3509 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3509 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3509 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:34px 14px 20px;border-radius:20px;background:linear-gradient(#f6f1e6 0%,#efe6d0 100%);border:2px solid #e2d1a6;overflow:hidden;}
        .pq3509 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79338,#a6772a);border:2.5px solid #8a621f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3509 .pq-arena{position:relative;z-index:3;display:flex;align-items:center;justify-content:center;gap:8px;min-height:132px;}
        .pq3509 .pq-bag{transform-origin:50% 100%;}
        .pq3509 .pq-bag.idle{animation:pq3509bob 3s ease-in-out infinite;}
        .pq3509 .pq-mid{display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:none;flex:0 0 auto;width:26px;}
        .pq3509 .pq-arw{font-size:20px;font-weight:900;color:#c0623a;line-height:1;}
        .pq3509 .pq-arw.a2{animation-delay:.35s;}
        .pq3509 .pq-arw.mv{animation:pq3509arw 1.4s ease-in-out infinite;}
        .pq3509 .pq-scoop.idle{animation:pq3509leave 2.6s ease-in-out infinite;transform-origin:50% 50%;}
        .pq3509 .pq-eq{position:relative;z-index:3;display:flex;justify-content:center;align-items:center;gap:6px;margin-top:12px;flex-wrap:wrap;animation:pq3509in .3s ease both;}
        .pq3509 .pq-eq b{min-width:56px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;white-space:nowrap;}
        .pq3509 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3509 .pq-eq i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}
        .pq3509 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3509 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:16px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #dccfa8;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(80,60,20,.12);font-size:19px;font-weight:800;color:#5a4a22;letter-spacing:.02em;font-variant-numeric:tabular-nums;}
        .pq3509 .pq-opt:hover:not(:disabled){background:#fffaf0;border-color:#e6c976;}
        .pq3509 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3509 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3509 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3509cele .5s ease;}
        .pq3509 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3509 .pq-opt:disabled{cursor:default;}
        .pq3509 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3509pop .45s ease both;}
        .pq3509.still .pq-tick{animation:none;opacity:1;}
        .pq3509 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3509tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3509 .pq-spark.s2{animation-delay:-.6s;} .pq3509 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3509.still .pq-spark{opacity:1;}
        .pq3509 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3509in .22s ease both;}
        .pq3509 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3509 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3509bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3509leave{0%{transform:translateX(0) translateY(0);opacity:.95;}50%{transform:translateX(8px) translateY(-5px);opacity:.55;}100%{transform:translateX(0) translateY(0);opacity:.95;}}
        @keyframes pq3509arw{0%,100%{transform:translateX(0);opacity:.5;}50%{transform:translateX(4px);opacity:1;}}
        @keyframes pq3509pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3509tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3509cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3509in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Un qopi (8 kg — berilgan) → 3 kg olib qo'yiladi (kamayish). Natija 5 g'alabagacha yashirin. */}
        <div className="pq-arena">
          <span className={"pq-bag" + (idle ? " idle" : "")}><FlourBag w={98} label={t.labelBag} tag={uL(HAD + " kg")} /></span>
          <div className="pq-mid" aria-hidden="true">
            <span className={"pq-arw" + (idle ? " mv" : "")}>{"→"}</span>
            <span className={"pq-arw a2" + (idle ? " mv" : "")}>{"→"}</span>
          </div>
          <span className={"pq-scoop" + (idle ? " idle" : "")}><Scoop w={60} tag={uL(USED + " kg")} /></span>
        </div>

        {/* G'alaba: ishlatilsa AYIRAMIZ — «8 kg − 3 kg = 5 kg» (natija faqat shu yerda ochiladi) */}
        {ok && (
          <div className="pq-eq"><b>{uL(HAD + " kg")}</b><i>{MINUS}</i><b>{uL(USED + " kg")}</b><i>=</i><b className="res">{uL(LEFT + " kg")}</b></div>
        )}

        {/* Matnli variantlar: to'g'ri (5 kg) chapda emas; g'alabagacha yashil emas; kg RU'da uL bilan */}
        <div className="pq-opts">
          {OPTIONS.map((op) => {
            const sel = picked === op;
            const right = ok && op === CORRECT;
            const dim = ok && op !== CORRECT;
            return (
              <button
                key={op}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(op); setFeedback(null); }}
              >
                {uL(op)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '28px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '85%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '18px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
