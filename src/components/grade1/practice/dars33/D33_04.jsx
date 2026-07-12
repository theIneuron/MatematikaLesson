// Dars33 · Amaliyot 04 — «Nechta burchagi bor?» · Blok 7 geometriya · Burchaklar soni · 🟡 · tag: angle_count
// Bitta uchburchak figura; savol «Nechta burchagi bor?»; variantlar [4, 3, 0], to'g'ri = 3 (index 1, chapdan emas).
// Distraktorlar: 4 (M1 to'rtburchak bilan chalkashtirish), 0 (M3 burchaksiz doira sifatida) — burchakni noto'g'ri sanash.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint «Uchlarini sanang».
// G'alabada 3 burchak nuqta bilan yoritiladi + «3 burchak»; review'da .still gate anim qaytarmaydi, yakuniy holat statik.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Uchburchak uchlari (SVG kanon: viewBox 0 0 130 64). Burchak-nuqtalar shu uchlarga qo'yiladi.
const TRI = '65,8 106,55 24,55';
const CORNERS = [{ x: 65, y: 8 }, { x: 106, y: 55 }, { x: 24, y: 55 }];
const OPTS = [4, 3, 0];
const TARGET = 3; // index 1
const DATA = { target: TARGET, options: OPTS, level: '🟡', tag: 'angle_count' };

const T = {
  uz: {
    eyebrow: "Geometriya · Burchaklar", title: "Burchaklar soni",
    ask: "Nechta burchagi bor?",
    correct: "Barakalla! Uchburchakning uchta burchagi bor.",
    hint: "Uchlarini sanang.",
    reveal: "3 burchak",
  },
  ru: {
    eyebrow: "Геометрия · Углы", title: "Число углов",
    ask: "Сколько у него углов?",
    correct: "Молодец! У треугольника три угла.",
    hint: "Посчитай его вершины.",
    reveal: "3 угла",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D33_04(props) {
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
    onSubmit?.({ questionText: t.ask, options: OPTS, studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3304" + (still ? " still" : "")}>
      <style>{`
        .pq3304.still *{animation:none !important;}
        .pq3304{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3304 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7d94c9;text-transform:uppercase;}
        .pq3304 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3304 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3304 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(180deg,#f2f7fd 0%,#f2f9f0 100%);border:2px solid #e2e9f2;overflow:hidden;}
        .pq3304 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c6d9ef,#aec8e6);border:2.5px solid #9cb9dc;color:#33517a;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(90,120,160,.16),inset 0 1px 0 rgba(255,255,255,.5);}
        /* ambient — suzuvchi mini-shakllar + yulduzchalar */
        .pq3304 .pq-amb{position:absolute;z-index:1;pointer-events:none;opacity:.55;}
        .pq3304 .pq-amb.a1{width:13px;height:13px;border-radius:50%;border:2.5px solid #f6c9a4;left:16px;top:48px;animation:pq3304drift 9s ease-in-out infinite;}
        .pq3304 .pq-amb.a2{width:11px;height:11px;border-radius:3px;border:2.5px solid #c3b7ea;right:18px;top:56px;animation:pq3304drift 12s ease-in-out infinite reverse;}
        .pq3304 .pq-amb.a3{width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:13px solid #bfe4cf;left:8%;bottom:16px;animation:pq3304drift 11s ease-in-out infinite;}
        .pq3304 .pq-twk{position:absolute;z-index:1;color:#f4cf85;font-size:12px;line-height:0;pointer-events:none;animation:pq3304tws 3.4s ease-in-out infinite;}
        .pq3304 .pq-twk.w2{animation-delay:-1.2s;color:#c9d8f2;}
        .pq3304 .pq-stage{position:relative;z-index:3;display:flex;justify-content:center;align-items:center;padding:6px 0 12px;animation:pq3304enter .6s cubic-bezier(.25,1.4,.45,1) both;}
        /* uchburchak tinch holatda sekin suzadi-tebranadi; g'alabada raqsga tushadi */
        .pq3304 .pq-tri{width:220px;max-width:78%;height:auto;overflow:visible;animation:pq3304float 4s ease-in-out infinite;}
        .pq3304 .pq-tri.win{animation:pq3304dance .9s ease,pq3304float 4s ease-in-out .9s infinite;}
        .pq3304 .pq-dot{opacity:0;transform-box:fill-box;transform-origin:center;}
        .pq3304 .pq-dot.d1{animation:pq3304dot .38s cubic-bezier(.3,1.6,.5,1) .05s forwards;}
        .pq3304 .pq-dot.d2{animation:pq3304dot .38s cubic-bezier(.3,1.6,.5,1) .35s forwards;}
        .pq3304 .pq-dot.d3{animation:pq3304dot .38s cubic-bezier(.3,1.6,.5,1) .65s forwards;}
        .pq3304.still .pq-dot{opacity:1;}
        .pq3304 .pq-reveal{position:relative;z-index:3;display:flex;justify-content:center;margin-top:2px;}
        .pq3304 .pq-reveal b{padding:4px 16px;border-radius:11px;background:#e8f7ee;color:#1a7f43;font-size:16px;font-weight:800;border:2px solid #a6e0bd;animation:pq3304pop .45s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3304 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px;}
        /* variantlar bosqichma-bosqich kirib keladi */
        .pq3304 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;height:58px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e3e6ee;cursor:pointer;font-size:26px;font-weight:800;color:#2b3a4d;transition:.12s;box-shadow:0 3px 8px rgba(90,110,140,.12);animation:pq3304enter .5s cubic-bezier(.25,1.4,.45,1) both;}
        .pq3304 .pq-opt:nth-child(1){animation-delay:.25s;}
        .pq3304 .pq-opt:nth-child(2){animation-delay:.38s;}
        .pq3304 .pq-opt:nth-child(3){animation-delay:.51s;}
        .pq3304 .pq-opt:hover:not(:disabled){background:#fbfdff;border-color:#bcd2ea;transform:translateY(-2px);}
        .pq3304 .pq-opt:active:not(:disabled){transform:scale(.97);}
        .pq3304 .pq-opt.sel{border-color:#7fa8e0;background:#eef4fd;box-shadow:0 0 0 3px rgba(127,168,224,.25);}
        .pq3304 .pq-opt.right{border-color:#7fc9a1;background:#eafaf1;color:#1a7f43;box-shadow:0 0 0 3px rgba(127,201,161,.3);animation:pq3304cele .7s cubic-bezier(.3,1.6,.5,1);}
        .pq3304 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3304 .pq-opt:disabled{cursor:default;}
        .pq3304 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#4caf7d;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.18);animation:pq3304pop .45s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3304 .pq-spark{position:absolute;z-index:5;color:#f4cd79;opacity:0;line-height:0;pointer-events:none;animation:pq3304tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(244,205,121,.6));}
        .pq3304 .pq-spark.s2{animation-delay:-.6s;} .pq3304 .pq-spark.s3{animation-delay:-1.15s;}
        /* g'alaba-konfetti: pastel bo'lakchalar yuqoriga uchadi */
        .pq3304 .pq-conf{position:absolute;z-index:6;width:8px;height:8px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3304conf 1.5s ease-out both;}
        .pq3304 .pq-conf.k1{left:20%;bottom:80px;background:#f6c9a4;animation-delay:.05s;}
        .pq3304 .pq-conf.k2{left:36%;bottom:74px;background:#c3b7ea;border-radius:50%;animation-delay:.2s;}
        .pq3304 .pq-conf.k3{left:52%;bottom:82px;background:#9fd8ba;animation-delay:.1s;}
        .pq3304 .pq-conf.k4{left:68%;bottom:76px;background:#f3bfd0;border-radius:50%;animation-delay:.28s;}
        .pq3304 .pq-conf.k5{left:82%;bottom:84px;background:#a9cdf0;animation-delay:.16s;}
        .pq3304 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3304in .22s ease both;}
        .pq3304 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3304 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3304enter{from{opacity:0;transform:translateY(16px) scale(.82);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3304float{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-4px) rotate(-1.2deg);}}
        @keyframes pq3304drift{0%,100%{transform:translate(0,0) rotate(0);}50%{transform:translate(9px,-11px) rotate(24deg);}}
        @keyframes pq3304tws{0%,100%{opacity:.25;transform:scale(.7);}50%{opacity:.9;transform:scale(1.15);}}
        @keyframes pq3304dot{from{opacity:0;transform:scale(.2);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3304pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3304tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3304cele{0%{transform:scale(1);}35%{transform:scale(1.08) rotate(1.2deg);}65%{transform:scale(.96) rotate(-.8deg);}100%{transform:scale(1);}}
        @keyframes pq3304dance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(-6deg) scale(1.1);}55%{transform:rotate(5deg) scale(1.05);}80%{transform:rotate(-2deg) scale(1.02);}}
        @keyframes pq3304conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-70px) rotate(230deg);}}
        @keyframes pq3304in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* ambient hayot: suzuvchi mini-shakllar + yulduzchalar */}
        <span className="pq-amb a1" /><span className="pq-amb a2" /><span className="pq-amb a3" />
        <span className="pq-twk" style={{ left: '10%', top: '32px' }}>{'✦'}</span>
        <span className="pq-twk w2" style={{ right: '10%', top: '36px' }}>{'✦'}</span>

        {/* Bitta uchburchak (pastel yashil-mint; sekin suzadi). G'alabada uch burchak-nuqta yonadi + raqs. */}
        <div className="pq-stage">
          <svg className={'pq-tri' + (ok ? ' win' : '')} viewBox="0 0 130 64" aria-hidden="true">
            <polygon points={TRI} fill={ok ? '#dff5e8' : '#d9f2e2'} stroke={ok ? '#2e9e63' : '#63a97f'} strokeWidth="3" strokeLinejoin="round" />
            {ok && CORNERS.map((c, i) => (
              <circle key={i} className={`pq-dot d${i + 1}`} cx={c.x} cy={c.y} r="6" fill="#2e9e63" stroke="#fff" strokeWidth="2" />
            ))}
          </svg>
        </div>

        {ok && (<div className="pq-reveal"><b>{t.reveal}</b></div>)}

        {/* Variantlar: 3 chapdan emas (index 1). */}
        <div className="pq-opts">
          {OPTS.map((n) => {
            const sel = picked === n;
            const right = ok && n === TARGET;
            const dim = ok && n !== TARGET;
            return (
              <button
                key={n}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(n); setFeedback(null); }}
              >
                {n}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '46px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>{'✦'}</span>
          <span className="pq-conf k1" /><span className="pq-conf k2" /><span className="pq-conf k3" /><span className="pq-conf k4" /><span className="pq-conf k5" />
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
