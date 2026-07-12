// Dars35 · Amaliyot 07 — «Massani qo'shish» · Blok 7 massa · Tarozi + kg toshlari · 🔴 · tag: add_kg
// Bir panga 2 kg (2 tosh) + yana 3 kg (3 tosh) qo'yildi; pan yuklangan tomon pastga egiladi (beam rotate).
// Toshlar = 1-kg trapetsiya bloklari ('1'), yuqori qatorda 2, pastki qatorda 3 = jami sanaladi (halol DATA).
// Matnli variantlar: '1 kg' (ayirdi), '5 kg' TO'G'RI (index 1, chapda emas), '6 kg' (adashdi). uL kg→кг (ru).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint sanashni o'rgatadi (2 va yana 3).
// G'alaba-anim review'da o'ynamaydi (.still gate); tilt = STATE (statik transform), review'da to'g'ri qoladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// 2 kg + 3 kg = 5 kg. Variantlar kg bo'yicha; TO'G'RI 5 (index 1 — chapda emas).
const A = 2, B = 3, SUM = 5;
const OPTIONS = [{ kg: 1 }, { kg: 5 }, { kg: 6 }]; // TO'G'RI kg=5 (index 1)
const CORRECT = 5;
const DATA = { a: A, b: B, sum: SUM, unit: 'kg', options: OPTIONS.map((o) => o.kg), correct: CORRECT, level: '🔴', tag: 'add_kg' };

const T = {
  uz: {
    eyebrow: "Massa · Qo'shish", title: "Tarozi · kg",
    ask: "2 kg va 3 kg. Jami necha kg?",
    correct: "Barakalla! 2 kg + 3 kg = 5 kg.",
    hint: "Tarozidagi toshlarni sanang: 2 va yana 3.",
  },
  ru: {
    eyebrow: "Масса · Сложение", title: "Весы · кг",
    ask: "2 кг и 3 кг. Сколько всего кг?",
    correct: "Молодец! 2 кг + 3 кг = 5 кг.",
    hint: "Посчитай гирьки на весах: 2 и ещё 3.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// 1-kg tosh: kichik trapetsiya metall blok, '1' yorlig'i bilan.
const Weight = ({ cx, ty }) => (
  <g>
    <path d={`M${cx - 5},${ty} L${cx + 5},${ty} L${cx + 8},${ty + 18} L${cx - 8},${ty + 18} Z`} fill="#b7c2cf" stroke="#7f8ea0" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x={cx - 3} y={ty - 4} width="6" height="5" rx="2" fill="#9aa8b8" stroke="#7f8ea0" strokeWidth="1.2" />
    <text x={cx} y={ty + 14} textAnchor="middle" fontSize="9" fontWeight="800" fill="#41505f" fontFamily="'JetBrains Mono',monospace">1</text>
  </g>
);

export default function D35_07(props) {
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

  // RU uchun birlik lokalizatsiyasi (id/mantiq lotin qoladi).
  const uL = (s) => (lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS.map((o) => `${o.kg} kg`), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  // Yuklangan pan (chap) pastga egiladi → beam chapga (soatga teskari) qiyshayadi. STATE, review'da statik.
  const TILT = -8; // gradus

  return (
    <div className={"pq pq3507" + (still ? " still" : "")}>
      <style>{`
        .pq3507.still *{animation:none !important;}
        .pq3507{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3507 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3507 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3507 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3507 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(#f2f6fb 0%,#e6eef7 100%);border:2px solid #cfe0f0;overflow:hidden;}
        .pq3507 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#4f86c6,#3567a3);border:2.5px solid #2b5486;color:#f0f6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3507 .pq-scale{position:relative;z-index:3;width:100%;}
        .pq3507 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3507 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #cddbea;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(40,70,110,.12);font-size:19px;font-weight:800;color:#33465c;letter-spacing:.02em;}
        .pq3507 .pq-opt:hover:not(:disabled){background:#f5faff;border-color:#7fb0e6;}
        .pq3507 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3507 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3507 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3507cele .5s ease;}
        .pq3507 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3507 .pq-opt:disabled{cursor:default;}
        .pq3507 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3507pop .45s ease both;}
        .pq3507.still .pq-tick{animation:none;opacity:1;}
        .pq3507 .pq-spark{position:absolute;z-index:8;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3507tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3507 .pq-spark.s2{animation-delay:-.6s;} .pq3507 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3507.still .pq-spark{opacity:1;}
        .pq3507 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3507in .22s ease both;}
        .pq3507 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3507 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3507pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3507tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3507cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3507in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Tarozi: chap pan 2+3 tosh bilan yuklangan → chap tomon pastga. Toshlar = DATA (halol sanaladi). */}
        <div className="pq-scale" style={{ position: 'relative', height: '236px' }}>
          <svg viewBox="0 0 340 236" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
            {/* Asos (poydevor + tik ustun) */}
            <ellipse cx="170" cy="222" rx="70" ry="10" fill="#c9d5e2" />
            <rect x="150" y="140" width="40" height="78" rx="6" fill="#9fb2c6" stroke="#7f95ad" strokeWidth="2" />
            <rect x="130" y="214" width="80" height="13" rx="6" fill="#8598ae" />
            {/* Pivot */}
            <circle cx="170" cy="140" r="9" fill="#6d8299" stroke="#54697f" strokeWidth="2" />
            {/* Beam + panlar — pivot atrofida aylanadi (chap yuklangan, pastga) */}
            <g transform={`rotate(${TILT} 170 140)`}>
              <rect x="46" y="135" width="248" height="10" rx="5" fill="#b7c6d6" stroke="#93a7bb" strokeWidth="2" />
              {/* Chap osma + pan (2+3 tosh, og'ir → pastga) */}
              <line x1="60" y1="140" x2="60" y2="170" stroke="#7f95ad" strokeWidth="2.5" />
              <path d="M30 170 h60 l-9 22 a24 10 0 0 1 -42 0 z" fill="#d7e2ee" stroke="#a8bccf" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Toshlar: yuqori qator 2 ta, pastki qator 3 ta = jami sanaladi */}
              <Weight cx={53} ty={150} />
              <Weight cx={67} ty={150} />
              <Weight cx={45} ty={170} />
              <Weight cx={60} ty={170} />
              <Weight cx={75} ty={170} />
              {/* O'ng osma + pan (bo'sh, yengil → yuqori) */}
              <line x1="280" y1="140" x2="280" y2="170" stroke="#7f95ad" strokeWidth="2.5" />
              <path d="M252 170 h56 l-8 20 a22 10 0 0 1 -40 0 z" fill="#d7e2ee" stroke="#a8bccf" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
          </svg>

          {ok && (<>
            <span className="pq-spark" style={{ left: '10%', top: '150px' }}>{'✦'}</span>
            <span className="pq-spark s2" style={{ left: '24%', top: '120px' }}>{'✦'}</span>
            <span className="pq-spark s3" style={{ left: '6%', top: '186px' }}>{'✦'}</span>
          </>)}
        </div>

        {/* Matnli variantlar: to'g'ri (5 kg) chapda emas; g'alabagacha yashil emas; kg RU'da lokalizatsiya (uL) */}
        <div className="pq-opts">
          {OPTIONS.map((o) => {
            const sel = picked === o.kg;
            const right = ok && o.kg === CORRECT;
            const dim = ok && o.kg !== CORRECT;
            return (
              <button
                key={o.kg}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.kg); setFeedback(null); }}
              >
                {uL(`${o.kg} kg`)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
