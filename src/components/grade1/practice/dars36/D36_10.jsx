// Dars36 · Amaliyot 10 — «Piktogramma va jadval» · Blok 7 ma'lumot · Interaktiv piktogramma qurish · 🔴 · tag: build_picto
// Olma qatori 2 ta rasmdan boshlanadi; nishon = 5. [+ olma] har bosishda 1 ta rasm qo'shadi, [− olma] oladi (1 rasm = 1 dona).
// G'alaba: qatorda ROSA 5 ta rasm. Ortiq → hint «Ko'p — bittasini oling»; kam → «Yana qo'shing» (qulf/retry YO'Q).
// ANSWER-LEAK: qator = bola quradigan DATA; javob = bolaning sanashi. To'g'ri javob (5) alohida bosib chiqarilmaydi.
// VEDI-DO-VERNOGO: setChecked FAQAT son=5 da. Chip STATE (statik son), review'da to'g'ri qoladi (.still gate).
// OLMA: D36_01 kanon palitrasi + realistik render (gradient soya, yaltirash, bandi va barg); to'g'rida yashil gradient.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const START = 2;     // boshlang'ich olma soni
const TARGET = 5;    // nishon
const MAXR = 7;      // qatorga maksimal rasm (ortiq qo'shishga joy bor)
const DATA = { start: START, answer: TARGET, unit: 'olma', level: '🔴', tag: 'build_picto' };

const T = {
  uz: {
    eyebrow: "Ma'lumot · Piktogramma", title: 'Piktogramma quring',
    setup: "Har bir rasm — 1 dona olma.",
    ask: "Olma qatorini 5 taga to'ldiring.",
    add: '+ olma', rem: '− olma',
    row: 'Olma',
    correct: 'Barakalla! Qatorda 5 ta olma.',
    hintUnder: "Kam — yana qo'shing.",
    hintOver: "Ko'p — bittasini oling.",
    hint: "Qatorda rosa 5 ta rasm bo'lsin.",
  },
  ru: {
    eyebrow: 'Данные · Пиктограмма', title: 'Построй пиктограмму',
    setup: 'Одна картинка — одно яблоко.',
    ask: 'Дополни ряд яблок до 5.',
    add: '+ яблоко', rem: '− яблоко',
    row: 'Яблоки',
    correct: 'Молодец! В ряду 5 яблок.',
    hintUnder: 'Мало — добавь ещё.',
    hintOver: 'Много — убери одно.',
    hint: 'Пусть в ряду будет ровно 5 картинок.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// ——— YAGONA MEVA PALITRASI (D36_01 — kanon, barcha D36-fayllar shundan oladi) ———
// olma #e5484d (och #ff9a8f / to'q #b7343c), bandi #6b4a2b, barg #4caf50 (och #7ed07f, kontur #3d8c40).
// «on» (son=5, to'g'ri) da olma yashil gradientga o'tadi (och #7ed07f / #1fa155 / to'q #147a3e).
// Har ikonka = BITTA sanaladigan dona; realistik: gradient soya, yaltirash, bandi va barg.
const PFX = 'g3610'; // gradient-id prefiksi (fayl-unikal)
const FruitDefs = () => (
  <defs>
    <radialGradient id={PFX + 'ap'} cx="35%" cy="30%" r="85%">
      <stop offset="0%" stopColor="#ff9a8f" /><stop offset="55%" stopColor="#e5484d" /><stop offset="100%" stopColor="#b7343c" />
    </radialGradient>
    <radialGradient id={PFX + 'apok'} cx="35%" cy="30%" r="85%">
      <stop offset="0%" stopColor="#7ed07f" /><stop offset="55%" stopColor="#1fa155" /><stop offset="100%" stopColor="#147a3e" />
    </radialGradient>
    <linearGradient id={PFX + 'lf'} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#7ed07f" /><stop offset="100%" stopColor="#4caf50" />
    </linearGradient>
  </defs>
);
// Bitta sanaladigan olma (1 rasm = 1 dona). Koordinatalar SON (arifmetika string-concat bermasin).
// «on» — qatorda rosa 5 ta bo'lganda (to'g'ri): olma yashil gradientga o'tadi.
function Apple({ cx, cy, on }) {
  const fill = on ? `url(#${PFX}apok)` : `url(#${PFX}ap)`;
  const edge = on ? '#147a3e' : '#b7343c';
  return (
    <g>
      <path d={`M${cx} ${cy - 7} Q${cx + 0.6} ${cy - 11} ${cx + 3.2} ${cy - 13.4}`} stroke="#6b4a2b" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <ellipse cx={cx + 5.6} cy={cy - 11.4} rx={4.2} ry={2.3} fill={`url(#${PFX}lf)`} stroke="#3d8c40" strokeWidth={0.6} transform={`rotate(28 ${cx + 5.6} ${cy - 11.4})`} />
      <path d={`M${cx} ${cy - 6.2} C ${cx - 1.6} ${cy - 8.6} ${cx - 8} ${cy - 9} ${cx - 9.2} ${cy - 3} C ${cx - 10.2} ${cy + 2.6} ${cx - 5.8} ${cy + 8.8} ${cx - 1.6} ${cy + 8.8} C ${cx - 0.6} ${cy + 8} ${cx + 0.6} ${cy + 8} ${cx + 1.6} ${cy + 8.8} C ${cx + 5.8} ${cy + 8.8} ${cx + 10.2} ${cy + 2.6} ${cx + 9.2} ${cy - 3} C ${cx + 8} ${cy - 9} ${cx + 1.6} ${cy - 8.6} ${cx} ${cy - 6.2} Z`} fill={fill} stroke={edge} strokeWidth={0.8} />
      <ellipse cx={cx - 3.4} cy={cy - 2.4} rx={2.2} ry={3.4} fill="#fff" opacity={0.5} transform={`rotate(-18 ${cx - 3.4} ${cy - 2.4})`} />
    </g>
  );
}

// Piktogramma qatori: chapda «Olma» yorlig'i + o'ngda joriy N ta olma. Chapga tekislangan (uzunroq = ko'proq).
const IX0 = 100;     // birinchi olma x (SON)
const ISTEP = 33;    // olmalar orasidagi qadam (SON)
const RCY = 44;      // qator markazi y (SON)
function PictoRow({ n, ok, label }) {
  const icons = [];
  for (let i = 0; i < n; i++) {
    icons.push(<Apple key={i} cx={IX0 + i * ISTEP} cy={RCY} on={ok} />);
  }
  return (
    <svg viewBox="0 0 340 88" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <FruitDefs />
      {/* Nishon uyachalari: 5 ta xira ramka — bola qatorni shu yergacha to'ldiradi */}
      {Array.from({ length: TARGET }).map((_, i) => (
        <rect key={'slot' + i} x={IX0 + i * ISTEP - 13} y={RCY - 15} width={26} height={30} rx={6} fill="none" stroke="#e0d0a2" strokeWidth={1.4} strokeDasharray="3 4" />
      ))}
      <line x1={8} y1={RCY + 22} x2={332} y2={RCY + 22} stroke="#ecdfbd" strokeWidth={1} />
      <text x={8} y={RCY + 4} fontSize={14} fontWeight={800} fill="#6b5220" fontFamily="'Manrope',sans-serif">{label}</text>
      {icons}
    </svg>
  );
}

export default function D36_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  // RU'da sanoq birligi: 'ta' → 'шт' (label matni). Ichki qiymat o'zgarmaydi.
  const unit = lang === 'ru' ? 'шт' : 'ta';

  const [count, setCount] = useState(START);
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const hintFor = (c) => (c > TARGET ? t.hintOver : c < TARGET ? t.hintUnder : t.hint);

  // RESTORE: studentAnswer = { value: count } dan holatni tiklaydi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const v = initialAnswer.studentAnswer.value;
      if (v != null) { setCount(v); setTouched(true); }
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : hintFor(v == null ? START : v) });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const check = useCallback(() => {
    const correct = count === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : hintFor(count) }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: null, studentAnswer: { value: count }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [count, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  const add = () => { if (lock || count >= MAXR) return; setTouched(true); setCount((c) => c + 1); setFeedback(null); };
  const sub = () => { if (lock || count <= 0) return; setTouched(true); setCount((c) => c - 1); setFeedback(null); };

  return (
    <div className={"pq pq3610" + (still ? " still" : "")}>
      <style>{`
        .pq3610.still *{animation:none !important;}
        .pq3610.still .pq-spark{opacity:1;}
        .pq3610{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3610 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3610 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3610 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3610 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3610 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:38px 15px 18px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ead6 100%);border:2px solid #e6d3a8;overflow:hidden;}
        .pq3610 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79338,#a6772a);border:2.5px solid #8a621f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3610 .pq-card{box-sizing:border-box;position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto;padding:8px 10px 4px;border-radius:14px;background:rgba(255,255,255,.92);border:1.5px solid #e6d3a8;}
        .pq3610 .pq-row{width:100%;height:92px;}
        .pq3610 .pq-chip{display:flex;align-items:center;justify-content:center;gap:6px;margin:10px auto 0;font-size:14px;font-weight:800;color:#6b5220;font-variant-numeric:tabular-nums;}
        .pq3610 .pq-chip b{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #e0cf9a;color:#8a621f;box-shadow:0 1px 3px rgba(80,60,20,.12);}
        .pq3610 .pq-chip b.ok{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;}
        .pq3610 .pq-ctrl{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:12px;}
        .pq3610 .pq-btn{min-width:118px;height:52px;padding:0 12px;font-size:17px;font-weight:900;border-radius:14px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq3610 .pq-btn.add{border-color:#8bc79a;color:#1a7f43;}
        .pq3610 .pq-btn.rem{border-color:#e0b4b4;color:#b4552f;}
        .pq3610 .pq-btn:hover:not(:disabled){transform:translateY(-2px);}
        .pq3610 .pq-btn:active:not(:disabled){transform:scale(.95);}
        .pq3610 .pq-btn:disabled{opacity:.4;cursor:default;}
        .pq3610 .pq-spark{position:absolute;z-index:8;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3610tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3610 .pq-spark.s2{animation-delay:-.6s;} .pq3610 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3610 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3610in .22s ease both;}
        .pq3610 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3610 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3610tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3610in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Piktogramma qatori (DATA): bola [+ olma]/[− olma] bilan quradi; nishon uyachalari 5 ta */}
        <div className="pq-card">
          <div className="pq-row"><PictoRow n={count} ok={ok} label={t.row} /></div>
        </div>

        {/* Joriy son — bola o'z amali (leak emas) */}
        <div className="pq-chip">
          <span>{t.row}:</span>
          <b className={ok ? 'ok' : ''}>{count + ' ' + unit}</b>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '20px' }}>{'✦'}</span>
        </>)}
      </div>

      {/* Boshqaruv: [+ olma] qo'shadi, [− olma] oladi. Ko'p qo'shilsa − bilan tuzatiladi (qulf yo'q) */}
      <div className="pq-ctrl">
        <button type="button" className="pq-btn rem" disabled={lock || count <= 0} onClick={sub}>{t.rem}</button>
        <button type="button" className="pq-btn add" disabled={lock || count >= MAXR} onClick={add}>{t.add}</button>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
