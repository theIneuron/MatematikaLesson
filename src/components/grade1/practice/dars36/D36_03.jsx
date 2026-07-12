// Dars36 · Amaliyot 03 — «Qaysi meva ko'p?» · Piktogramma · Blok 7 ma'lumotlar · 🟡 · tag: which_most
// Piktogramma (1 rasm = 1 dona): Olma=4, Nok=6, Banan=3. Savol: qaysi meva ko'p?
// Variantlar (kartochka): Olma / Nok / Banan; TO'G'RI = Nok (eng uzun qator = 6, chapda emas — index 1).
// Distraktorlar: M2 «uzun qator = ko'p» teskari o'qish; noto'g'rida hint «Eng uzun qatorni toping».
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida. Javob-leak yo'q: eng uzun qator g'alabagacha belgilanmaydi.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); statik yakuniy holat ham beriladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Piktogramma ma'lumoti: har qatorda N ta bir xil rasm (1 rasm = 1 dona).
const ROWS = [
  { id: 'olma', n: 4, color: '#e5484d' },
  { id: 'nok', n: 6, color: '#b5cf3f' },
  { id: 'banan', n: 3, color: '#f2c94c' },
];
const CORRECT = 'nok'; // eng uzun qator = 6 (o'rtada, chapda emas)
const DATA = { rows: ROWS.map((r) => ({ id: r.id, n: r.n })), correct: CORRECT, level: '🟡', tag: 'which_most' };

const T = {
  uz: {
    eyebrow: "Ma'lumot · Piktogramma", title: "Mevalar piktogrammasi",
    setup: "Har bir rasm — 1 dona meva.", ask: "Qaysi meva eng ko'p?",
    olma: 'Olma', nok: 'Nok', banan: 'Banan',
    correct: "Barakalla! Nok qatori eng uzun — nok eng ko'p, 6 ta.",
    hint: "Eng uzun qatorni toping. Qaysi qatorda rasm eng ko'p bo'lsa, o'sha meva eng ko'p.",
  },
  ru: {
    eyebrow: "Данные · Пиктограмма", title: "Пиктограмма фруктов",
    setup: "Одна картинка — один фрукт.", ask: "Каких фруктов больше всего?",
    olma: 'Яблоки', nok: 'Груши', banan: 'Бананы',
    correct: "Молодец! Ряд груш самый длинный — груш больше всего, 6.",
    hint: "Найди самый длинный ряд. Где больше всего картинок — того фрукта больше всего.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// ——— YAGONA MEVA PALITRASI (D36_01 kanoni): olma #e5484d, nok #b5cf3f, banan #f2c94c ———
// Yakka rasm-ikonalar: har biri BITTA sanaladigan meva; realistik: gradient soya, yaltirash, bandi va barg.
const PFX = 'g3603'; // gradient-id prefiksi (fayl-unikal; nusxa-deflar bir xil — xavfsiz)
const FruitDefs = () => (
  <defs>
    <radialGradient id={PFX + 'ap'} cx="35%" cy="30%" r="85%">
      <stop offset="0%" stopColor="#ff9a8f" /><stop offset="55%" stopColor="#e5484d" /><stop offset="100%" stopColor="#b7343c" />
    </radialGradient>
    <linearGradient id={PFX + 'lf'} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#7ed07f" /><stop offset="100%" stopColor="#4caf50" />
    </linearGradient>
    <radialGradient id={PFX + 'pe'} cx="38%" cy="60%" r="80%">
      <stop offset="0%" stopColor="#d3e46a" /><stop offset="60%" stopColor="#b5cf3f" /><stop offset="100%" stopColor="#93ab2c" />
    </radialGradient>
    <linearGradient id={PFX + 'ba'} x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stopColor="#ffe07a" /><stop offset="55%" stopColor="#f2c94c" /><stop offset="100%" stopColor="#e0ac2b" />
    </linearGradient>
  </defs>
);
const Olma = ({ s = 22 }) => (
  <svg viewBox="0 0 28 30" width={s} height={s * 30 / 28} aria-hidden="true" style={{ display: 'block' }}>
    <FruitDefs />
    <path d="M14 9 Q14.6 5 17.2 2.6" fill="none" stroke="#6b4a2b" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="19.6" cy="4.6" rx="4.2" ry="2.3" fill={`url(#${PFX}lf)`} stroke="#3d8c40" strokeWidth=".6" transform="rotate(28 19.6 4.6)" />
    <path d="M14 9.8 C 12.4 7.4 6 7 4.8 13 C 3.8 18.6 8.2 24.8 12.4 24.8 C 13.4 24 14.6 24 15.6 24.8 C 19.8 24.8 24.2 18.6 23.2 13 C 22 7 15.6 7.4 14 9.8 Z" fill={`url(#${PFX}ap)`} stroke="#b7343c" strokeWidth=".8" />
    <ellipse cx="10.6" cy="13.6" rx="2.2" ry="3.4" fill="#fff" opacity=".5" transform="rotate(-18 10.6 13.6)" />
  </svg>
);
const Nok = ({ s = 22 }) => (
  <svg viewBox="0 0 28 30" width={s} height={s * 30 / 28} aria-hidden="true" style={{ display: 'block' }}>
    <FruitDefs />
    <path d="M14 5 q1.4 -2.6 3.8 -3.2" fill="none" stroke="#6b4a2b" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 5.4 C 10.8 5.4 9.6 8.6 10.2 11.4 C 10.6 13.6 6.8 15.4 6.1 19.2 C 5.3 23.9 9.5 27 14 27 C 18.5 27 22.7 23.9 21.9 19.2 C 21.2 15.4 17.4 13.6 17.8 11.4 C 18.4 8.6 17.2 5.4 14 5.4 Z" fill={`url(#${PFX}pe)`} stroke="#93ab2c" strokeWidth=".8" />
    <ellipse cx="11" cy="20.4" rx="2" ry="3.1" fill="#fff" opacity=".45" transform="rotate(-14 11 20.4)" />
  </svg>
);
const Banan = ({ s = 22 }) => (
  <svg viewBox="0 0 28 30" width={s} height={s * 30 / 28} aria-hidden="true" style={{ display: 'block' }}>
    <FruitDefs />
    <path d="M4.6 10 C 4 18.4 9.8 24.6 20 22.8 C 22.2 22.4 23.8 21.2 24.2 19.4 C 19 21.2 11.6 19.2 8.4 14.4 C 7.1 12.4 6.6 11 6.5 9.7 Z" fill={`url(#${PFX}ba)`} stroke="#d9a827" strokeWidth=".9" strokeLinejoin="round" />
    <path d="M4.6 10 q-0.6 -1.6 0.4 -2.2 q1.2 -0.4 1.6 1.4 l-0.1 0.5 Z" fill="#8a6512" />
    <circle cx="24" cy="19.7" r="1.2" fill="#8a6512" />
    <path d="M6.2 13 C 6.6 18 11 22 17 22.6" stroke="#fff" strokeWidth="1" opacity=".35" fill="none" strokeLinecap="round" />
  </svg>
);
const FRUIT = { olma: Olma, nok: Nok, banan: Banan };

export default function D36_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => t[r.id]), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3603" + (still ? " still" : "")}>
      <style>{`
        .pq3603.still *{animation:none !important;}
        .pq3603{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3603 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3603 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3603 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3603 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3603 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:36px 14px 18px;border-radius:20px;background:linear-gradient(#eef6ff 0%,#e3eefb 100%);border:2px solid #cfe0f2;overflow:hidden;}
        .pq3603 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#3f7ac0,#2f61a4);border:2.5px solid #274f88;color:#eef6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        /* Piktogramma karta: qatorlar HTML-flex; 1 rasm = 1 dona */
        .pq3603 .pq-chart{box-sizing:border-box;position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #d6e0ee;overflow:hidden;box-shadow:0 4px 10px rgba(40,60,90,.12);}
        .pq3603 .pq-prow{box-sizing:border-box;display:flex;align-items:center;gap:8px;min-height:46px;padding:8px 10px;border-top:1px solid #e7edf5;}
        .pq3603 .pq-prow:first-child{border-top:0;}
        .pq3603 .pq-prow.win{background:#e8f7ee;box-shadow:inset 3px 0 0 #1a7f43;animation:pq3603cele .5s ease;}
        .pq3603 .pq-prow.dimr{opacity:.4;filter:saturate(.6);}
        .pq3603 .pq-plab{flex:0 0 52px;font-size:12.5px;font-weight:800;color:#5a6472;letter-spacing:.02em;}
        .pq3603 .pq-prow.win .pq-plab{color:#1a7f43;}
        .pq3603 .pq-icons{display:flex;align-items:center;gap:4px;flex-wrap:nowrap;}
        .pq3603 .pq-ic{flex:0 0 auto;}
        .pq3603 .pq-count{margin-left:6px;flex:0 0 auto;background:#1a7f43;color:#fff;font-weight:900;font-size:13px;padding:1px 9px;border-radius:999px;font-variant-numeric:tabular-nums;animation:pq3603pop .45s ease both;}
        .pq3603.still .pq-count{animation:none;opacity:1;}
        /* Variantlar: kartochka (rasm + nom); g'alabagacha yashil emas */
        .pq3603 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3603 .pq-opt{box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 10px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #d6e0ee;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(40,60,90,.1);font-size:15px;font-weight:800;color:#3a4658;}
        .pq3603 .pq-opt:hover:not(:disabled){background:#f5faff;border-color:#9cc2ea;}
        .pq3603 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3603 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3603 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3603cele .5s ease;}
        .pq3603 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3603 .pq-opt:disabled{cursor:default;}
        .pq3603 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3603pop .45s ease both;}
        .pq3603.still .pq-tick{animation:none;opacity:1;}
        .pq3603 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3603tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3603 .pq-spark.s2{animation-delay:-.6s;} .pq3603 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3603.still .pq-spark{opacity:1;}
        .pq3603 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3603in .22s ease both;}
        .pq3603 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3603 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3603pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3603tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3603cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3603in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Piktogramma = DATA (halol ko'rsatiladi): har qatorda N ta rasm; g'alabagacha eng uzun qator belgilanmaydi */}
        <div className="pq-chart">
          {ROWS.map((r) => {
            const Ic = FRUIT[r.id];
            const win = ok && r.id === CORRECT;
            const dimr = ok && r.id !== CORRECT;
            return (
              <div key={r.id} className={'pq-prow' + (win ? ' win' : '') + (dimr ? ' dimr' : '')}>
                <span className="pq-plab">{t[r.id]}</span>
                <span className="pq-icons">
                  {Array.from({ length: r.n }).map((_, i) => (
                    <span key={i} className="pq-ic"><Ic s={22} /></span>
                  ))}
                </span>
                {win && <span className="pq-count">{r.n}</span>}
              </div>
            );
          })}
        </div>

        {/* Variantlar: kartochka. To'g'ri = Nok (chapda emas); g'alabagacha yashil emas */}
        <div className="pq-opts">
          {ROWS.map((r) => {
            const Ic = FRUIT[r.id];
            const sel = picked === r.id;
            const right = ok && r.id === CORRECT;
            const dim = ok && r.id !== CORRECT;
            return (
              <button
                key={r.id}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(r.id); setFeedback(null); }}
              >
                <Ic s={26} />
                {t[r.id]}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '42px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '22px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
