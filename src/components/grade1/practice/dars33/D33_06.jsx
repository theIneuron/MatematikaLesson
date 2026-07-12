// Dars33 · Amaliyot 06 — «Simmetrik shaklni top» · Blok 7 geometriya · Simmetriya (ko'zgu o'qi) · 🟡 · tag: find_symmetric
// Uch karta: [bayroq, etik, yurak] — simmetrik = yurak (index 2, chapdan emas). Simmetrikni bosish = g'alaba (karta yashil).
// Distraktorlar: bayroq-tayoq va etik — nosimmetrik (M4 «har qanday chiroyli shakl simmetrik» tushunmovchiligiga qarshi).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint ikki yarmni solishtirishga yo'naltiradi.
// G'alabada simmetrik karta ustidan tik ko'zgu chizig'i chiziladi + «Simmetrik»; anim review'da statik (.still gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Shakl-kartalar: simmetrik NOT-first (index 2). SVG kanon: viewBox 0 0 130 64, stroke-width 3, stroke #3f6b8c, fill #dce9f7.
const CARDS = [
  { id: 'bayroq', kind: 'bayroq' }, // nosimmetrik — tayoq bir tomonda
  { id: 'etik', kind: 'etik' },     // nosimmetrik — etik uchi bir tomonda
  { id: 'yurak', kind: 'yurak' },   // SIMMETRIK — tik ko'zgu o'qi (index 2)
];
const TARGET = 'yurak';
const DATA = { target: TARGET, options: CARDS.map((c) => c.kind), level: '🟡', tag: 'find_symmetric' };

const T = {
  uz: {
    eyebrow: "Geometriya · Simmetriya", title: "Ko'zgu o'qi",
    ask: "Simmetrik shaklni bosing.",
    correct: "Barakalla! Ikki yarmi bir xil — simmetrik.",
    hint: "Ikki yarmi bir xilmi? Ko'zgu chizig'ini tasavvur qiling.",
    sym: "Simmetrik",
  },
  ru: {
    eyebrow: "Геометрия · Симметрия", title: "Ось зеркала",
    ask: "Нажми на симметричную фигуру.",
    correct: "Молодец! Две половины одинаковы — симметрично.",
    hint: "Две половины одинаковы? Представь линию зеркала.",
    sym: "Симметрично",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bitta shakl-figura — har biri o'z yumshoq pastel rangida. on=true — yashil (g'alaba). showMirror — tik ko'zgu chizig'i.
const SHAPE_C = {
  yurak: { fill: '#ffdfe7', stroke: '#e08ba3' },
  bayroq: { fill: '#d9eafa', stroke: '#7aa5cd' },
  etik: { fill: '#f3e7d3', stroke: '#c2a171' },
};
const ShapeFig = ({ kind, on, showMirror }) => {
  const c = SHAPE_C[kind] || { fill: '#dce9f7', stroke: '#3f6b8c' };
  const stroke = on ? '#2e9e63' : c.stroke;
  const fill = on ? '#dff5e8' : c.fill;
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'yurak' && (
        <path d="M65,55 C40,38 30,20 46,13 C56,9 62,17 65,23 C68,17 74,9 84,13 C100,20 90,38 65,55 Z"
          fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      )}
      {kind === 'bayroq' && (<>
        <line x1="33" y1="6" x2="33" y2="58" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        <path d="M33,10 Q53,4 73,10 L73,31 Q53,37 33,31 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      </>)}
      {kind === 'etik' && (
        <path d="M47,8 L63,8 L63,42 L90,42 L90,56 L47,56 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      )}
      {showMirror && (
        <line className="pq-mirror" x1="65" y1="4" x2="65" y2="60" stroke="#2e9e63" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" />
      )}
    </svg>
  );
};

export default function D33_06(props) {
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
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: CARDS.map((c) => c.kind), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3306" + (still ? " still" : "")}>
      <style>{`
        .pq3306.still *{animation:none !important;}
        .pq3306{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3306 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7d94c9;text-transform:uppercase;}
        .pq3306 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3306 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3306 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(180deg,#f3f6fd 0%,#fdf2f4 100%);border:2px solid #e6e7f0;overflow:hidden;}
        .pq3306 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c6d9ef,#aec8e6);border:2.5px solid #9cb9dc;color:#33517a;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(90,120,160,.16),inset 0 1px 0 rgba(255,255,255,.5);}
        /* ambient — suzuvchi mini-shakllar + yulduzchalar */
        .pq3306 .pq-amb{position:absolute;z-index:1;pointer-events:none;opacity:.55;}
        .pq3306 .pq-amb.a1{width:12px;height:12px;border-radius:50%;border:2.5px solid #f3bfd0;left:16px;top:46px;animation:pq3306drift 9s ease-in-out infinite;}
        .pq3306 .pq-amb.a2{width:11px;height:11px;border-radius:3px;border:2.5px solid #c3b7ea;right:18px;top:54px;animation:pq3306drift 12s ease-in-out infinite reverse;}
        .pq3306 .pq-amb.a3{width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:13px solid #bfe4cf;left:44%;bottom:10px;animation:pq3306drift 11s ease-in-out infinite;}
        .pq3306 .pq-twk{position:absolute;z-index:1;color:#f4cf85;font-size:12px;line-height:0;pointer-events:none;animation:pq3306tws 3.4s ease-in-out infinite;}
        .pq3306 .pq-twk.w2{animation-delay:-1.2s;color:#c9d8f2;} .pq3306 .pq-twk.w3{animation-delay:-2.3s;color:#f3bfd0;}
        .pq3306 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}
        /* kartalar bosqichma-bosqich kirib keladi, ichidagi shakl sekin suzadi */
        .pq3306 .pq-card{box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 9px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e3e6ee;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(90,110,140,.12);animation:pq3306enter .55s cubic-bezier(.25,1.4,.45,1) both;}
        .pq3306 .pq-card:nth-child(1){animation-delay:.05s;}
        .pq3306 .pq-card:nth-child(2){animation-delay:.2s;}
        .pq3306 .pq-card:nth-child(3){animation-delay:.35s;}
        .pq3306 .pq-card:hover:not(:disabled){background:#fbfdff;border-color:#bcd2ea;transform:translateY(-2px);}
        .pq3306 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3306 .pq-card.sel{border-color:#7fa8e0;background:#eef4fd;box-shadow:0 0 0 3px rgba(127,168,224,.25);}
        .pq3306 .pq-card.right{border-color:#7fc9a1;background:#eafaf1;box-shadow:0 0 0 3px rgba(127,201,161,.3);animation:pq3306cele .7s cubic-bezier(.3,1.6,.5,1);}
        .pq3306 .pq-card.dim{opacity:.4;filter:saturate(.6);}
        .pq3306 .pq-card:disabled{cursor:default;}
        .pq3306 .pq-fig{width:100%;height:56px;animation:pq3306float 3.8s ease-in-out infinite;}
        .pq3306 .pq-card:nth-child(2) .pq-fig{animation-delay:-1.3s;}
        .pq3306 .pq-card:nth-child(3) .pq-fig{animation-delay:-2.6s;}
        .pq3306 .pq-card.right .pq-fig{animation:pq3306beat 1s ease,pq3306float 3.8s ease-in-out 1s infinite;}
        .pq3306 .pq-mirror{transform-origin:65px 32px;animation:pq3306draw .55s ease .15s both;}
        .pq3306 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#1a7f43;}
        .pq3306 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#4caf7d;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.18);animation:pq3306pop .45s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3306 .pq-spark{position:absolute;z-index:5;color:#f4cd79;opacity:0;line-height:0;pointer-events:none;animation:pq3306tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(244,205,121,.6));}
        .pq3306 .pq-spark.s2{animation-delay:-.6s;} .pq3306 .pq-spark.s3{animation-delay:-1.15s;}
        /* g'alaba-konfetti: pastel bo'lakchalar yuqoriga uchadi */
        .pq3306 .pq-conf{position:absolute;z-index:6;width:8px;height:8px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3306conf 1.5s ease-out both;}
        .pq3306 .pq-conf.k1{left:20%;bottom:40px;background:#f3bfd0;animation-delay:.05s;}
        .pq3306 .pq-conf.k2{left:36%;bottom:34px;background:#c3b7ea;border-radius:50%;animation-delay:.2s;}
        .pq3306 .pq-conf.k3{left:52%;bottom:42px;background:#9fd8ba;animation-delay:.1s;}
        .pq3306 .pq-conf.k4{left:68%;bottom:36px;background:#f6c9a4;border-radius:50%;animation-delay:.28s;}
        .pq3306 .pq-conf.k5{left:82%;bottom:44px;background:#a9cdf0;animation-delay:.16s;}
        .pq3306 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3306in .22s ease both;}
        .pq3306 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3306 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3306enter{from{opacity:0;transform:translateY(16px) scale(.82);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3306float{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pq3306drift{0%,100%{transform:translate(0,0) rotate(0);}50%{transform:translate(9px,-11px) rotate(24deg);}}
        @keyframes pq3306tws{0%,100%{opacity:.25;transform:scale(.7);}50%{opacity:.9;transform:scale(1.15);}}
        @keyframes pq3306pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3306draw{from{opacity:0;transform:scaleY(0);}to{opacity:1;transform:scaleY(1);}}
        @keyframes pq3306tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3306cele{0%{transform:scale(1);}35%{transform:scale(1.08) rotate(1.2deg);}65%{transform:scale(.96) rotate(-.8deg);}100%{transform:scale(1);}}
        @keyframes pq3306beat{0%,100%{transform:scale(1);}20%{transform:scale(1.18);}40%{transform:scale(1);}60%{transform:scale(1.12);}80%{transform:scale(1);}}
        @keyframes pq3306conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-70px) rotate(230deg);}}
        @keyframes pq3306in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* ambient hayot: suzuvchi mini-shakllar + yulduzchalar */}
        <span className="pq-amb a1" /><span className="pq-amb a2" /><span className="pq-amb a3" />
        <span className="pq-twk" style={{ left: '9%', top: '30px' }}>{'✦'}</span>
        <span className="pq-twk w2" style={{ right: '9%', top: '34px' }}>{'✦'}</span>
        <span className="pq-twk w3" style={{ left: '58%', bottom: '10px' }}>{'✦'}</span>

        {/* Uch shakl-karta: simmetrik NOT-first. G'alabagacha hech biri belgilanmaydi (javob-leak yo'q). */}
        <div className="pq-grid">
          {CARDS.map((c) => {
            const sel = picked === c.id;
            const right = ok && c.id === TARGET;
            const dim = ok && c.id !== TARGET;
            return (
              <button
                key={c.id}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(c.id); setFeedback(null); }}
              >
                <span className="pq-fig"><ShapeFig kind={c.kind} on={right} showMirror={right} /></span>
                {right && <span className="pq-lab">{t.sym}</span>}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '46px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '34px' }}>{'✦'}</span>
          <span className="pq-conf k1" /><span className="pq-conf k2" /><span className="pq-conf k3" /><span className="pq-conf k4" /><span className="pq-conf k5" />
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
