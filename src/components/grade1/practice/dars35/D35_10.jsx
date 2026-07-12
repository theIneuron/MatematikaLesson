// Dars35 · Amaliyot 10 — «Tarozini muvozanatlang» · Blok 7 massa · Interaktiv tarozi · 🔴 · tag: balance_interactive
// Chap panda qat'iy 4 kg obyekt. O'ng pan bo'sh; [+1 kg] har bosishda 1 kg toshini qo'shadi, [−1 kg] oladi.
// Beam tilt joriy o'ng jamiga ergashadi: o'ng<4 → chap past (rotate −9); o'ng=4 → tekis (0); o'ng>4 → o'ng past (+9).
// G'alaba: o'ng pan = 4 kg (muvozanat). Ko'p qo'shilsa hint «Ko'p bo'lib ketdi — bittasini oling» (qulf/retry YO'Q).
// ANSWER-LEAK: tilt adolatli DATA (qaysi tomon og'irligini KO'RSATADI); o'ng jami bola o'z amali — leak emas.
// VEDI-DO-VERNOGO: setChecked FAQAT o'ng=4 da. Tilt STATE (statik transform), review'da to'g'ri qoladi (.still gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT = 4;      // chap pan qat'iy obyekt (kg)
const TARGET = 4;    // o'ng pan muvozanat uchun (kg)
const MAXR = 6;      // o'ng panga maksimal tosh
const DATA = { left: LEFT, answer: TARGET, unit: 'kg', level: '🔴', tag: 'balance_interactive' };

const T = {
  uz: {
    eyebrow: "Massa · Tarozi", title: "Tarozi",
    ask: "Tarozini muvozanatlang.",
    add: "+1 kg", rem: "−1 kg",
    right: "O'ng pan",
    correct: "Barakalla! Ikki tomon 4 kg — tarozi tekis.",
    hintUnder: "Yengil — o'ng pan yuqori. Yana qo'shing.",
    hintOver: "Ko'p bo'lib ketdi — bittasini oling.",
    hint: "Tarozi tekis bo'lsin — ikki tomon teng.",
  },
  ru: {
    eyebrow: "Масса · Весы", title: "Весы",
    ask: "Уравновесь весы.",
    add: "+1 kg", rem: "−1 kg",
    right: "Правая чаша",
    correct: "Молодец! По 4 кг с двух сторон — весы ровные.",
    hintUnder: "Легко — правая чаша выше. Добавь ещё.",
    hintOver: "Стало много — убери одну.",
    hint: "Пусть весы будут ровными — стороны равны.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// 1 kg toshi — kichik trapetsiya metall blok, «1» yozuvli.
const Weight = ({ cx, cy, on }) => {
  const fill = on ? '#bfe8cd' : '#c3ccd6';
  const stroke = on ? '#1a7f43' : '#8a97a6';
  return (
    <g>
      <polygon points={`${cx - 10},${cy} ${cx + 10},${cy} ${cx + 6.5},${cy - 14} ${cx - 6.5},${cy - 14}`} fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      <rect x={cx - 4} y={cy - 18} width="8" height="4" rx="2" fill="none" stroke={stroke} strokeWidth="1.6" />
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fontWeight="800" fill={on ? '#1a7f43' : '#59657a'} fontFamily="'JetBrains Mono',monospace">1</text>
    </g>
  );
};

export default function D35_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  // RU'da birlikni lokalizatsiya: option/label ichidagi 'kg' → 'кг' (ichki qiymat lotincha qoladi).
  const uL = (s) => lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s;

  const [right, setRight] = useState(0);   // o'ng pandagi kg
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const hintFor = (r) => (r > TARGET ? t.hintOver : r < TARGET ? t.hintUnder : t.hint);

  // RESTORE: studentAnswer = { value: right } dan holatni tiklaydi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const v = initialAnswer.studentAnswer.value;
      if (v != null) { setRight(v); setTouched(true); }
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : hintFor(v == null ? 0 : v) });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const check = useCallback(() => {
    const correct = right === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : hintFor(right) }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: null, studentAnswer: { value: right }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [right, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  const add = () => { if (lock || right >= MAXR) return; setTouched(true); setRight((r) => r + 1); setFeedback(null); };
  const sub = () => { if (lock || right <= 0) return; setTouched(true); setRight((r) => r - 1); setFeedback(null); };

  // Tarozi holati (STATE, statik transform): o'ng<4 → chap og'ir (chap past, −9); =4 → 0; >4 → o'ng past (+9).
  const TILT = right < TARGET ? -9 : right > TARGET ? 9 : 0;

  // O'ng toshlar joylashuvi: 3 tadan qator, past qator y=190, tepa qator y=172.
  const wpos = (i) => {
    const col = i % 3, row = Math.floor(i / 3);
    return { cx: 280 + (col - 1) * 22, cy: 190 - row * 18 };
  };

  return (
    <div className={"pq pq3510" + (still ? " still" : "")}>
      <style>{`
        .pq3510.still *{animation:none !important;}
        .pq3510.still .pq-spark{opacity:1;}
        .pq3510{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3510 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3510 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3510 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3510 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 16px;border-radius:20px;background:linear-gradient(#f2f6fb 0%,#e6eef7 100%);border:2px solid #cfe0f0;overflow:hidden;}
        .pq3510 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#4f86c6,#3567a3);border:2.5px solid #2b5486;color:#f0f6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3510 .pq-scale{position:relative;z-index:3;width:100%;height:250px;}
        .pq3510 .pq-beam{transition:transform .45s cubic-bezier(.34,1.2,.5,1);}
        .pq3510 .pq-chip{display:flex;align-items:center;justify-content:center;gap:6px;margin:4px auto 0;font-size:14px;font-weight:800;color:#3f5a7a;font-variant-numeric:tabular-nums;}
        .pq3510 .pq-chip b{padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #b8cde6;color:#2b5486;box-shadow:0 1px 3px rgba(0,0,0,.1);}
        .pq3510 .pq-chip b.ok{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;}
        .pq3510 .pq-ctrl{display:flex;gap:12px;justify-content:center;margin-top:12px;}
        .pq3510 .pq-btn{min-width:96px;height:52px;padding:0 14px;font-size:19px;font-weight:900;border-radius:14px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq3510 .pq-btn.add{border-color:#8fb4e6;color:#2563eb;}
        .pq3510 .pq-btn.rem{border-color:#e0b4b4;color:#b4552f;}
        .pq3510 .pq-btn:hover:not(:disabled){transform:translateY(-2px);}
        .pq3510 .pq-btn:active:not(:disabled){transform:scale(.95);}
        .pq3510 .pq-btn:disabled{opacity:.4;cursor:default;}
        .pq3510 .pq-spark{position:absolute;z-index:8;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3510tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3510 .pq-spark.s2{animation-delay:-.6s;} .pq3510 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3510 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3510in .22s ease both;}
        .pq3510 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3510 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3510tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3510in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Tarozi: beam pivotda aylanadi. Chap = 4 kg obyekt, o'ng = joriy toshlar. Tilt joriy holatga ergashadi. */}
        <div className="pq-scale">
          <svg viewBox="0 0 340 250" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', position: 'absolute', inset: 0 }}>
            {/* Asos (poydevor + tik ustun) */}
            <ellipse cx="170" cy="236" rx="70" ry="11" fill="#c9d5e2" />
            <rect x="150" y="150" width="40" height="82" rx="6" fill="#9fb2c6" stroke="#7f95ad" strokeWidth="2" />
            <rect x="130" y="228" width="80" height="14" rx="7" fill="#8598ae" />
            <circle cx="170" cy="150" r="9" fill="#6d8299" stroke="#54697f" strokeWidth="2" />

            {/* Beam + panlar + toshlar — pivot atrofida aylanadi (STATE transform). */}
            <g className="pq-beam" transform={`rotate(${TILT} 170 150)`}>
              <rect x="46" y="145" width="248" height="10" rx="5" fill="#b7c6d6" stroke="#93a7bb" strokeWidth="2" />

              {/* Chap osma + pan + 4 kg obyekt */}
              <line x1="60" y1="150" x2="60" y2="190" stroke="#7f95ad" strokeWidth="2.5" />
              <path d="M32 190 h56 l-8 20 a22 10 0 0 1 -40 0 z" fill={ok ? '#dcf3e5' : '#d7e2ee'} stroke={ok ? '#8fd4a2' : '#a8bccf'} strokeWidth="2.5" strokeLinejoin="round" />
              <g>
                <rect x="42" y="156" width="36" height="34" rx="5" fill={ok ? '#bfe8cd' : '#e0b877'} stroke={ok ? '#1a7f43' : '#b98a3e'} strokeWidth="2" />
                <text x="60" y="176" textAnchor="middle" fontSize="14" fontWeight="900" fill={ok ? '#1a7f43' : '#6b4d1c'} fontFamily="'JetBrains Mono',monospace">4</text>
                <text x="60" y="186" textAnchor="middle" fontSize="8" fontWeight="800" fill={ok ? '#1a7f43' : '#6b4d1c'} fontFamily="'Manrope',sans-serif">{uL('kg')}</text>
              </g>

              {/* O'ng osma + pan + joriy toshlar */}
              <line x1="280" y1="150" x2="280" y2="190" stroke="#7f95ad" strokeWidth="2.5" />
              <path d="M252 190 h56 l-8 20 a22 10 0 0 1 -40 0 z" fill={ok ? '#dcf3e5' : '#d7e2ee'} stroke={ok ? '#8fd4a2' : '#a8bccf'} strokeWidth="2.5" strokeLinejoin="round" />
              {Array.from({ length: right }).map((_, i) => {
                const p = wpos(i);
                return <Weight key={'w' + i} cx={p.cx} cy={p.cy} on={ok} />;
              })}
            </g>
          </svg>

          {ok && (<>
            <span className="pq-spark" style={{ left: '18%', top: '150px' }}>{'✦'}</span>
            <span className="pq-spark s2" style={{ left: '78%', top: '150px' }}>{'✦'}</span>
            <span className="pq-spark s3" style={{ left: '48%', top: '30px' }}>{'✦'}</span>
          </>)}
        </div>

        {/* Joriy o'ng jami — bola o'z amali (leak emas). */}
        <div className="pq-chip">
          <span>{t.right}:</span>
          <b className={ok ? 'ok' : ''}>{uL(right + ' kg')}</b>
        </div>
      </div>

      {/* Boshqaruv: [+1 kg] qo'shadi, [−1 kg] oladi. Ko'p qo'shilsa −1 bilan tuzatiladi (qulf yo'q). */}
      <div className="pq-ctrl">
        <button type="button" className="pq-btn rem" disabled={lock || right <= 0} onClick={sub}>{uL(t.rem)}</button>
        <button type="button" className="pq-btn add" disabled={lock || right >= MAXR} onClick={add}>{uL(t.add)}</button>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
