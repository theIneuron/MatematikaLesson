// Dars32 · Amaliyot 03 — «Siniq chiziqni top» · Chiziq turlari · Tanla (P11) · 🟡 · tag: find_broken
// Figuralar: 3 karta — egri (M1 tuzoq), to'g'ri, siniq (to'g'ri javob, birinchi emas).
// Distraktorlar: egri↔siniq chalkashligi (M1) + to'g'ri chiziq (burilishsiz).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint farqni o'rgatadi (javobni emas).
// SAHNA (Dars15 ruhida): pastel osmon-maysa doska; quyosh, bulut, qush, gullar. Kartalar ketma-ket kiradi,
// chiziqlar o'zini chizadi. G'alaba: siniq bo'ylab koptokcha burchakdan-burchakka sakraydi + burchak-nuqtalar
// birin-ketin yonadi + yulduzchalar; review'da qayta o'ynalmaydi (still-gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Pastel chiziq ranglari (karta indeksiga ko'ra — javob-leak yo'q).
const INK = ['#e8a6b8', '#8fbcda', '#c4a8de'];

// Uch chiziq-karta. To'g'ri javob = siniq (index 2 — chap-yutadi tuzog'idan qochish).
const CARDS = [
  { id: 'egri', kind: 'egri' },   // egri — M1 tuzoq (siniq bilan chalkashtiriladi)
  { id: 'togri', kind: 'togri' }, // to'g'ri — burilishsiz
  { id: 'siniq', kind: 'siniq' }, // siniq — TO'G'RI JAVOB
];
const TARGET = 'siniq';
const DATA = { target: TARGET, cards: CARDS.map((c) => c.kind), level: '🟡', tag: 'find_broken' };

const T = {
  uz: {
    eyebrow: 'Geometriya · Chiziqlar', title: 'Chiziq turi',
    ask: 'Siniq chiziqni bosing.',
    correct: 'Barakalla! Siniq chiziq — burchaklari bor.',
    hint: 'Siniq chiziq — burchaklari bor (sinadi).',
  },
  ru: {
    eyebrow: 'Геометрия · Линии', title: 'Тип линии',
    ask: 'Нажми на ломаную линию.',
    correct: 'Молодец! У ломаной линии есть углы.',
    hint: 'У ломаной линии есть углы (изломы).',
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

// Chiziq-figura (LINE-SVG kanon). active = tanlangan/to'g'ri; win = burchak-nuqtalar + sakraydigan koptokcha.
const LineFig = ({ kind, ink, active, win }) => {
  const col = win ? '#2f9e64' : active ? '#6f9fd8' : ink;
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <g fill="none" stroke={col} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'togri' && <path className="pq-line" pathLength="100" d="M14,32 L116,32" />}
        {kind === 'egri' && <path className="pq-line" pathLength="100" d="M14,40 C40,6 90,58 116,24" />}
        {kind === 'siniq' && <path className="pq-line" pathLength="100" d="M14,46 L40,16 L66,46 L92,16 L116,46" />}
      </g>
      {/* siniq g'alabada: burchaklar birin-ketin yonadi + koptokcha sakraydi */}
      {kind === 'siniq' && win && (<>
        <g fill="#5cb885" className="pq-corner">
          <circle cx="40" cy="16" r="5" />
          <circle cx="66" cy="46" r="5" />
          <circle cx="92" cy="16" r="5" />
        </g>
        <g className="pq-ball">
          <circle r="6" fill="#f6b56b" stroke="#df9a4e" strokeWidth="1.5" />
          <path d="M-6,0 A6,6 0 0 1 6,0" fill="none" stroke="#df9a4e" strokeWidth="1.2" />
        </g>
      </>)}
    </svg>
  );
};

export default function D32_03(props) {
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
    <div className={"pq pq3203" + (still ? " still" : "")}>
      <style>{`
        .pq3203.still *{animation:none !important;}
        .pq3203{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3203 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3203 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3203 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3203 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:46px 12px 30px;border-radius:22px;background:linear-gradient(#dbecfa 0%,#ebf6fd 52%,#f1f9ec 100%);border:2px solid #d2e3ef;overflow:hidden;box-shadow:inset 0 2px 8px rgba(120,160,190,.12);}
        .pq3203 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:4;padding:3px 14px 4px;border-radius:999px;background:linear-gradient(#ffffff,#f0f7ff);border:2px solid #c4d9ee;color:#5b7ea6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(90,130,170,.14);}
        /* ===== AMBIENT ===== */
        .pq3203 .pq-sun{position:absolute;top:10px;left:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 15px 5px rgba(255,222,120,.5);animation:pq3203sun 4s ease-in-out infinite;z-index:1;}
        .pq3203 .pq-cloud{position:absolute;height:11px;background:#fff;border-radius:12px;opacity:.92;z-index:1;}
        .pq3203 .pq-cloud::before{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#fff;top:-7px;left:7px;}
        .pq3203 .pq-cloud.c1{top:16px;right:16%;width:36px;animation:pq3203drift 14s ease-in-out infinite;}
        .pq3203 .pq-cloud.c2{top:32px;right:5%;width:24px;transform:scale(.78);animation:pq3203drift 18s ease-in-out infinite reverse;}
        .pq3203 .pq-bird{position:absolute;opacity:.7;z-index:1;}
        .pq3203 .pq-bird.b1{top:22px;left:42%;animation:pq3203bird 9s ease-in-out infinite;}
        .pq3203 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:24px;background:linear-gradient(#d0ebbb 0%,#b6dd9c 100%);z-index:1;}
        .pq3203 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:8px;background:radial-gradient(circle at 5px 8px,#d0ebbb 5px,transparent 6px) repeat-x;background-size:13px 8px;}
        .pq3203 .pq-flw{position:absolute;width:5px;height:5px;border-radius:50%;z-index:2;}
        .pq3203 .pq-flw::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffe08a;}
        .pq3203 .pq-flw.f1{left:14%;bottom:8px;background:#f6b8c8;box-shadow:4px 0 0 #f6b8c8,-4px 0 0 #f6b8c8,0 4px 0 #f6b8c8,0 -4px 0 #f6b8c8;}
        .pq3203 .pq-flw.f2{right:16%;bottom:10px;background:#c9b3e8;box-shadow:4px 0 0 #c9b3e8,-4px 0 0 #c9b3e8,0 4px 0 #c9b3e8,0 -4px 0 #c9b3e8;}
        /* ===== KARTALAR ===== */
        .pq3203 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;}
        .pq3203 .pq-card{box-sizing:border-box;position:relative;width:100%;aspect-ratio:1/.82;display:flex;align-items:center;justify-content:center;padding:9px;border-radius:16px;background:rgba(255,255,255,.94);border:3px solid #e3ebf3;cursor:pointer;transition:.15s;box-shadow:0 3px 8px rgba(110,140,170,.12);animation:pq3203enter .55s cubic-bezier(.3,1.3,.5,1) both;}
        .pq3203 .pq-card:nth-child(2){animation-delay:.12s;} .pq3203 .pq-card:nth-child(3){animation-delay:.24s;}
        .pq3203 .pq-card:hover:not(:disabled){border-color:#bcd6ee;background:#fdfeff;transform:translateY(-3px);}
        .pq3203 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3203 .pq-card.sel{border-color:#8fb5e6;background:#f0f6fe;box-shadow:0 0 0 3px rgba(143,181,230,.25);}
        .pq3203 .pq-card.right{border-color:#8ecfa8;background:#ecf9f1;box-shadow:0 0 0 3px rgba(142,207,168,.3);animation:pq3203cele .55s ease;}
        .pq3203 .pq-card.dim{opacity:.45;filter:saturate(.5);}
        .pq3203 .pq-card:disabled{cursor:default;}
        .pq3203 .pq-card svg{animation:pq3203float 4s ease-in-out infinite;}
        .pq3203 .pq-card:nth-child(2) svg{animation-delay:-1.3s;} .pq3203 .pq-card:nth-child(3) svg{animation-delay:-2.6s;}
        .pq3203 .pq-line{stroke-dasharray:100;animation:pq3203draw .9s ease-out .25s both;}
        .pq3203 .pq-card:nth-child(2) .pq-line{animation-delay:.4s;} .pq3203 .pq-card:nth-child(3) .pq-line{animation-delay:.55s;}
        .pq3203 .pq-corner circle{animation:pq3203pop .4s ease both;}
        .pq3203 .pq-card.right .pq-corner circle:nth-child(2){animation-delay:.35s;}
        .pq3203 .pq-card.right .pq-corner circle:nth-child(3){animation-delay:.7s;}
        .pq3203 .pq-ball{animation:pq3203hop 1.7s ease-in-out .3s both;filter:drop-shadow(0 2px 2px rgba(160,120,60,.35));}
        .pq3203 .pq-tick{position:absolute;top:-9px;right:-9px;z-index:5;width:26px;height:26px;border-radius:50%;background:#5cb885;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(60,120,90,.3);animation:pq3203pop .45s ease both;}
        .pq3203 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3203tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3203 .pq-spark.s2{animation-delay:-.6s;} .pq3203 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3203 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3203in .22s ease both;}
        .pq3203 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3203 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3203sun{0%,100%{transform:scale(1);box-shadow:0 0 13px 4px rgba(255,222,120,.45);}50%{transform:scale(1.07);box-shadow:0 0 19px 7px rgba(255,222,120,.6);}}
        @keyframes pq3203drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3203bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-24px,-5px);}}
        @keyframes pq3203enter{from{opacity:0;transform:translateY(18px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3203draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3203float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3203hop{0%{transform:translate(14px,38px);opacity:0;}8%{opacity:1;}25%{transform:translate(40px,8px);}50%{transform:translate(66px,38px);}75%{transform:translate(92px,8px);}100%{transform:translate(116px,38px);opacity:1;}}
        @keyframes pq3203pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3203tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3203cele{0%{transform:scale(1);}30%{transform:scale(1.05) rotate(-1deg);}60%{transform:scale(.98) rotate(1deg);}100%{transform:scale(1);}}
        @keyframes pq3203in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-title">{t.title}</div>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" />
        <span className="pq-grass" />
        <span className="pq-flw f1" /><span className="pq-flw f2" />

        {/* Uch chiziq-karta: bosiladigan nishonlar; to'g'ri javob = siniq */}
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
                <LineFig kind={c.kind} ink={INK[i]} active={sel} win={right} />
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '48px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '62px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '38px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
