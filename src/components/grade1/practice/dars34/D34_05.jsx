// Dars34 · Amaliyot 05 — «2 dm necha sm?» · Blok 7 uzunlik · Birlikni almashtir (convert) · 🟡 · tag: convert_dm
// Chizg'ich (0..20 sm) ustida 2 dm-lenta: ikki dm-bo'lak (0–10, 10–20). Bola o'qiydi: 2 dm = 20 sm.
// Variantlar (matn): '2 sm' (M2: 1 dm=1 sm), '12 sm' (M1: birliklarni aralashtirish), '20 sm' = to'g'ri (index 2).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint g'oyani o'rgatadi («1 dm — o'nta sm»).
// ANSWER-LEAK: chizg'ich+lenta = DATA (ko'rsatish adolatli); javob bolaning o'qishi. Variant g'alabagacha yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri variant yakuniy yashil holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chizg'ich kanoni: 0-belgi x=16, har sm = 20px, mark N = 16 + N*20. dm belgilari (0,10,20) uzunroq/qalinroq.
const SM = 20;              // 1 sm = 20px
const X0 = 16;              // 0-belgi
const LEN = 20;             // lenta uzunligi: 2 dm = 20 sm
const xAt = (n) => X0 + n * SM;

const OPTS = [
  { id: '2 sm' },   // M2: 1 dm = 1 sm deb o'ylash
  { id: '12 sm' },  // M1: birliklarni aralashtirish
  { id: '20 sm' },  // TO'G'RI (index 2)
];
const TARGET = '20 sm';
const DATA = { object_dm: 2, object_sm: 20, options: OPTS.map((o) => o.id), correct: TARGET, level: '🟡', tag: 'convert_dm' };

const T = {
  uz: {
    eyebrow: "Uzunlik · dm va sm", title: "2 dm necha sm?",
    ask: "2 dm necha sm?",
    correct: "Barakalla! 2 dm — yigirma sm.",
    hint: "1 dm — o'nta sm. 2 dm — yigirma sm.",
  },
  ru: {
    eyebrow: "Длина · дм и см", title: "2 дм — сколько см?",
    ask: "2 дм — сколько см?",
    correct: "Молодец! 2 дм — двадцать см.",
    hint: "1 дм — десять см. 2 дм — двадцать см.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizg'ich + 2 dm-lenta. Lenta chap uchi 0-belgida, ikki dm-bo'lak (0–10 va 10–20).
const RulerScene = () => {
  const ticks = [];
  for (let n = 0; n <= LEN; n++) {
    const dm = n % 10 === 0;               // dm belgisi: 0, 10, 20
    const x = xAt(n);
    ticks.push(
      <line key={'t' + n} x1={x} y1={40} x2={x} y2={dm ? 60 : 52}
        stroke={dm ? '#6b4a1e' : '#9c7b45'} strokeWidth={dm ? 2.4 : 1.2} strokeLinecap="round" />
    );
    ticks.push(
      <text key={'n' + n} x={x} y={74} textAnchor="middle"
        fontSize={dm ? 11 : 9} fontWeight={dm ? 800 : 600} fill={dm ? '#5a3d17' : '#8a6d3e'}
        fontFamily="'Manrope',sans-serif">{n}</text>
    );
  }
  return (
    <svg viewBox="0 0 430 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* 2 dm-lenta chizg'ich ustida: chap uchi 0-belgida (x=16), o'ng uchi 20-belgida (x=416) */}
      <rect x={xAt(0)} y={12} width={SM * 10} height={16} rx={4} fill="#8fd0a6" stroke="#2f9e5e" strokeWidth="2" />
      <rect x={xAt(10)} y={12} width={SM * 10} height={16} rx={4} fill="#7fb8e6" stroke="#2f74b8" strokeWidth="2" />
      <text x={xAt(5)} y={24} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1c6b3e" fontFamily="'Manrope',sans-serif">1 dm</text>
      <text x={xAt(15)} y={24} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1c548f" fontFamily="'Manrope',sans-serif">1 dm</text>
      {/* Chizg'ich tanasi */}
      <rect x={4} y={34} width={422} height={34} rx={6} fill="#f2e2be" stroke="#c9a35e" strokeWidth="1.5" />
      {ticks}
    </svg>
  );
};

export default function D34_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => lang === 'ru' ? String(s).replace(/sm/g, 'см').replace(/dm/g, 'дм').replace(/m/g, 'м') : s;
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
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTS.map((o) => o.id), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3405" + (still ? " still" : "")}>
      <style>{`
        .pq3405.still *{animation:none !important;}
        .pq3405{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3405 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b5771f;text-transform:uppercase;}
        .pq3405 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3405 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3405 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:38px 14px 16px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ecdb 100%);border:2px solid #e5d3aa;overflow:hidden;}
        .pq3405 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d99a3c,#b5771f);border:2.5px solid #8a5a14;color:#fff8ec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3405 .pq-scene{position:relative;z-index:3;width:100%;}
        .pq3405 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:16px;}
        .pq3405 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;min-height:52px;padding:10px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #e0d3b4;cursor:pointer;transition:.12s;font-size:19px;font-weight:800;color:#5a4a2a;box-shadow:0 3px 8px rgba(90,70,30,.12);}
        .pq3405 .pq-opt:hover:not(:disabled){background:#fff9ec;border-color:#d9bd7e;}
        .pq3405 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3405 .pq-opt.sel{border-color:#c07d17;box-shadow:0 0 0 3px rgba(192,125,23,.18);}
        .pq3405 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3405cele .5s ease;}
        .pq3405 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3405 .pq-opt:disabled{cursor:default;}
        .pq3405 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3405pop .45s ease both;}
        .pq3405 .pq-spark{position:absolute;z-index:5;color:#ffc340;opacity:0;line-height:0;pointer-events:none;animation:pq3405tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,195,64,.6));}
        .pq3405.still .pq-spark{opacity:1;}
        .pq3405 .pq-spark.s2{animation-delay:-.6s;} .pq3405 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3405 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3405in .22s ease both;}
        .pq3405 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3405 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3405pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3405tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3405cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3405in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Chizg'ich ustidagi 2 dm-lenta = DATA. Javob — bolaning o'qishi (leak yo'q). */}
        <div className="pq-scene"><RulerScene /></div>

        <div className="pq-opts">
          {OPTS.map((o) => {
            const sel = picked === o.id;
            const right = ok && o.id === TARGET;
            const dim = ok && o.id !== TARGET;
            return (
              <button
                key={o.id}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.id); setFeedback(null); }}
              >
                {uL(o.id)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '22px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
