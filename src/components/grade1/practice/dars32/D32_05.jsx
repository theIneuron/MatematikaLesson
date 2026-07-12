// Dars32 · Amaliyot 05 — «Kesmani bosing» · Fazo va chiziqlar · Kesmani top (P11) · 🟡 · tag: find_segment
// 3 karta: egri chiziq · kesma (to'g'ri + ikki uchli nuqta) · siniq chiziq. To'g'ri = kesma (birinchi emas).
// Distraktorlar: egri↔siniq / to'g'ri "biroz egilgan" chalkashligi. Kesma = ikki nuqta orasidagi to'g'ri yo'l.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint farqni o'rgatadi (javobni emas).
// SAHNA (Dars15 ruhida): pastel osmon-maysa doska; quyosh, bulut, qush, gullar. Kartalar ketma-ket kiradi,
// chiziqlar o'zini chizadi. G'alaba: kesma uchlari halqa-to'lqin bilan jonlanadi + uchlar orasida uchqun
// yugurib o'tadi + yashil ramka; review'da qayta o'ynamaydi (still-gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Uch karta — kesma index 1 (birinchi emas: chap-yutadi tuzog'idan qochish).
const CARDS = [
  { id: 'egri', kind: 'egri' },
  { id: 'kesma', kind: 'kesma' },
  { id: 'siniq', kind: 'siniq' },
];
const TARGET = 'kesma';
const DATA = { target: TARGET, options: CARDS.map((c) => c.id), level: '🟡', tag: 'find_segment' };
// Pastel chiziq ranglari (karta indeksiga ko'ra — javob-leak yo'q).
const INK = ['#e8a6b8', '#8fbcda', '#a9c88f'];

const T = {
  uz: {
    eyebrow: 'Geometriya · Chiziqlar', title: 'Kesma qaysi?',
    ask: 'Kesmani bosing.',
    correct: "Barakalla! Kesma — ikki nuqta orasidagi to'g'ri yo'l.",
    hint: "Kesma — tekis va ikki uchli.",
  },
  ru: {
    eyebrow: 'Геометрия · Линии', title: 'Где отрезок?',
    ask: 'Нажми на отрезок.',
    correct: 'Молодец! Отрезок — прямой путь между двумя точками.',
    hint: 'Отрезок — прямой и с двумя концами.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda).
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="18" height="8" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#93a9bd" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Chiziq figurasi (LINE-SVG kanoni). Pastel rang; g'alabada kesma uchlari to'lqinlanadi + uchqun yuguradi.
const LineFig = ({ kind, ink, sel, right }) => {
  const stroke = right ? '#2f9e64' : sel ? '#6f9fd8' : ink;
  return (
    <svg viewBox="0 0 130 64" width="100%" height="64" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke={stroke} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'egri' && <path className="pq-line" pathLength="100" d="M14,40 C40,6 90,58 116,24" />}
        {kind === 'siniq' && <path className="pq-line" pathLength="100" d="M14,46 L40,16 L66,46 L92,16 L116,46" />}
        {kind === 'kesma' && <path className="pq-line" pathLength="100" d="M20,32 L110,32" />}
      </g>
      {kind === 'kesma' && (
        <g className="pq-ends">
          {right && (<>
            <circle className="pq-rip r1" cx="20" cy="32" r="8" fill="none" stroke="#7cc7a0" strokeWidth="2" />
            <circle className="pq-rip r2" cx="110" cy="32" r="8" fill="none" stroke="#7cc7a0" strokeWidth="2" />
            <circle className="pq-runner" cy="32" r="4" fill="#ffd98a" stroke="#eebd63" strokeWidth="1" />
          </>)}
          <circle className="pq-end e1" cx="20" cy="32" r="6" fill={right ? '#2f9e64' : '#5b7d99'} />
          <circle className="pq-end e2" cx="110" cy="32" r="6" fill={right ? '#2f9e64' : '#5b7d99'} />
        </g>
      )}
    </svg>
  );
};

export default function D32_05(props) {
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
    <div className={"pq pq3205" + (still ? " still" : "")}>
      <style>{`
        .pq3205.still *{animation:none !important;}
        .pq3205{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3205 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3205 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3205 .pq-ask{display:block;margin-top:2px;font-size:20px;font-weight:800;}
        .pq3205 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:42px 12px 30px;border-radius:22px;background:linear-gradient(#daecfa 0%,#ebf6fd 52%,#f1f9ec 100%);border:2px solid #d2e2ef;overflow:hidden;box-shadow:inset 0 2px 8px rgba(120,160,190,.12);}
        .pq3205 .pq-cap{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:4;padding:3px 14px 4px;border-radius:999px;background:linear-gradient(#ffffff,#f0f7ff);border:2px solid #c4d9ee;color:#5b7ea6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(90,130,170,.14);}
        /* ===== AMBIENT ===== */
        .pq3205 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 15px 5px rgba(255,222,120,.5);animation:pq3205sun 4s ease-in-out infinite;z-index:1;}
        .pq3205 .pq-cloud{position:absolute;height:11px;background:#fff;border-radius:12px;opacity:.92;z-index:1;}
        .pq3205 .pq-cloud::before{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#fff;top:-7px;left:7px;}
        .pq3205 .pq-cloud.c1{top:16px;left:12%;width:36px;animation:pq3205drift 15s ease-in-out infinite;}
        .pq3205 .pq-cloud.c2{top:30px;left:30%;width:24px;transform:scale(.78);animation:pq3205drift 19s ease-in-out infinite reverse;}
        .pq3205 .pq-bird{position:absolute;opacity:.7;z-index:1;}
        .pq3205 .pq-bird.b1{top:22px;left:54%;animation:pq3205bird 8s ease-in-out infinite;}
        .pq3205 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:24px;background:linear-gradient(#d2ecbc 0%,#b7dd9e 100%);z-index:1;}
        .pq3205 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:8px;background:radial-gradient(circle at 5px 8px,#d2ecbc 5px,transparent 6px) repeat-x;background-size:13px 8px;}
        .pq3205 .pq-flw{position:absolute;width:5px;height:5px;border-radius:50%;z-index:2;}
        .pq3205 .pq-flw::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffe08a;}
        .pq3205 .pq-flw.f1{left:14%;bottom:9px;background:#f6b8c8;box-shadow:4px 0 0 #f6b8c8,-4px 0 0 #f6b8c8,0 4px 0 #f6b8c8,0 -4px 0 #f6b8c8;}
        .pq3205 .pq-flw.f2{right:12%;bottom:7px;background:#a9cef2;box-shadow:4px 0 0 #a9cef2,-4px 0 0 #a9cef2,0 4px 0 #a9cef2,0 -4px 0 #a9cef2;}
        /* ===== KARTALAR ===== */
        .pq3205 .pq-grid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:9px;}
        .pq3205 .pq-card{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;min-height:78px;padding:8px 6px;border-radius:16px;background:rgba(255,255,255,.94);border:3px solid #e3ebf3;cursor:pointer;transition:.15s;box-shadow:0 3px 8px rgba(110,140,170,.12);animation:pq3205enter .55s cubic-bezier(.3,1.3,.5,1) both;}
        .pq3205 .pq-card:nth-child(2){animation-delay:.12s;} .pq3205 .pq-card:nth-child(3){animation-delay:.24s;}
        .pq3205 .pq-card:hover:not(:disabled){background:#fdfeff;border-color:#bcd6ee;transform:translateY(-3px);}
        .pq3205 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3205 .pq-card.sel{border-color:#8fb5e6;background:#f0f6fe;box-shadow:0 0 0 3px rgba(143,181,230,.25);}
        .pq3205 .pq-card.right{border-color:#8ecfa8;background:#ecf9f1;box-shadow:0 0 0 3px rgba(142,207,168,.3);animation:pq3205cele .55s ease;}
        .pq3205 .pq-card.dim{opacity:.45;filter:saturate(.5);}
        .pq3205 .pq-card:disabled{cursor:default;}
        .pq3205 .pq-card svg{animation:pq3205float 4s ease-in-out infinite;}
        .pq3205 .pq-card:nth-child(2) svg{animation-delay:-1.3s;} .pq3205 .pq-card:nth-child(3) svg{animation-delay:-2.6s;}
        .pq3205 .pq-line{stroke-dasharray:100;animation:pq3205draw .9s ease-out .25s both;}
        .pq3205 .pq-card:nth-child(2) .pq-line{animation-delay:.4s;} .pq3205 .pq-card:nth-child(3) .pq-line{animation-delay:.55s;}
        .pq3205 .pq-card.right .pq-end{animation:pq3205ends .5s ease both;}
        .pq3205 .pq-card.right .pq-end.e2{animation-delay:.15s;}
        .pq3205 .pq-rip{opacity:0;transform-box:fill-box;transform-origin:center;animation:pq3205rip 1.6s ease-out .3s infinite;}
        .pq3205 .pq-rip.r2{animation-delay:.7s;}
        .pq3205 .pq-runner{animation:pq3205run 1.4s ease-in-out .4s both;filter:drop-shadow(0 0 3px rgba(255,217,138,.8));}
        .pq3205 .pq-mark{position:absolute;top:-9px;left:50%;transform:translateX(-50%);z-index:6;background:#fff;border:2.5px solid #8ecfa8;color:#2f9e64;font-weight:900;font-size:12px;padding:2px 10px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(60,120,90,.18);white-space:nowrap;animation:pq3205pop .45s ease both;}
        .pq3205 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3205tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3205 .pq-spark.s2{animation-delay:-.6s;} .pq3205 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3205 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3205in .22s ease both;}
        .pq3205 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3205 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3205sun{0%,100%{transform:scale(1);box-shadow:0 0 13px 4px rgba(255,222,120,.45);}50%{transform:scale(1.07);box-shadow:0 0 19px 7px rgba(255,222,120,.6);}}
        @keyframes pq3205drift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq3205bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-24px,-5px);}}
        @keyframes pq3205enter{from{opacity:0;transform:translateY(18px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3205draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3205float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3205cele{0%{transform:scale(1);}30%{transform:scale(1.05) rotate(-1deg);}60%{transform:scale(.98) rotate(1deg);}100%{transform:scale(1);}}
        @keyframes pq3205ends{0%{opacity:0;transform:scale(.2);}60%{transform:scale(1.35);}100%{opacity:1;transform:scale(1);}}
        @keyframes pq3205rip{0%{opacity:.8;transform:scale(.5);}100%{opacity:0;transform:scale(2.2);}}
        @keyframes pq3205run{0%{cx:20;opacity:0;}15%{opacity:1;}85%{opacity:1;}100%{cx:110;opacity:0;}}
        @keyframes pq3205pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq3205tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3205in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-cap">{t.title}</div>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" />
        <span className="pq-grass" />
        <span className="pq-flw f1" /><span className="pq-flw f2" />

        <div className="pq-grid">
          {CARDS.map((c, i) => {
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
                <LineFig kind={c.kind} ink={INK[i]} sel={sel} right={right} />
                {right && <span className="pq-mark">{lang === 'ru' ? 'Отрезок' : 'Kesma'}</span>}
              </button>
            );
          })}
        </div>
        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '34px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '48px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '28px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
