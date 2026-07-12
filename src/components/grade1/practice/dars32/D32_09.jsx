// Dars32 · Amaliyot 09 — «Ortiqchani toping» · Blok 7 geometriya · Odd-one-out mantiq · P·logic · 🔴 · tag: odd_one_out
// To'rt chiziq-karta 2×2: uchta egri (bir xil tur) + bitta to'g'ri (ORTIQCHA). Ortiqcha = index 2 (chapdan/birinchidan emas).
// Distraktorlar: uch egri karta — «to'g'ri = biroz egilgan» va egri↔siniq chalkashligiga qarshi; ortiqcha faqat tur bo'yicha farq qiladi.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint mantiqni o'rgatadi («Uchtasi bir xil — boshqasini toping»).
// SAHNA (Dars15 ruhida): pastel osmon-maysa doska; quyosh, bulut, qush, kapalak. Kartalar ketma-ket kiradi,
// chiziqlar o'zini chizadi; egri chiziqlar sekin «nafas oladi» (to'lqinlanadi) — turni his qilishga yordam.
// G'ALABADA: to'g'ri chiziq bo'ylab uchqun sirpanadi + tick + yulduzchalar. Review'da qayta o'ynamaydi (.still gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// To'rt karta: uch egri + bir to'g'ri. Ortiqcha (to'g'ri) NOT-first — index 2.
// SVG kanon: viewBox 0 0 130 64, stroke-width 4.5, fill:none.
const CARDS = [
  { id: 'e1', kind: 'egri', d: 'M14,40 C40,6 90,58 116,24' },   // egri
  { id: 'e2', kind: 'egri', d: 'M14,24 C40,58 90,6 116,40' },   // egri (aylantirilgan)
  { id: 'tg', kind: 'togri', d: 'M14,32 L116,32' },             // TO'G'RI — ORTIQCHA (index 2)
  { id: 'e3', kind: 'egri', d: 'M14,44 C46,10 84,54 116,20' },  // egri
];
const TARGET = 'tg';
const DATA = { target: TARGET, options: CARDS.map((c) => c.kind), level: '🔴', tag: 'odd_one_out' };
// Pastel chiziq ranglari (karta indeksiga ko'ra — javob-leak yo'q).
const INK = ['#e8a6b8', '#8fbcda', '#c4a8de', '#a9c88f'];

const T = {
  uz: {
    eyebrow: "Geometriya · Mantiq", title: "Ortiqcha",
    ask: "Ortiqchani toping.",
    correct: "Barakalla! Uchtasi egri, bittasi to'g'ri.",
    hint: "Uchtasi bir xil — boshqasini toping.",
  },
  ru: {
    eyebrow: "Геометрия · Логика", title: "Лишняя",
    ask: "Найди лишнюю.",
    correct: "Молодец! Три кривые, одна прямая.",
    hint: "Три одинаковые — найди другую.",
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

// Bitta chiziq-figura: pastel rang, o'zini chizadi; egri turlari «nafas oladi»; g'alabada uchqun sirpanadi.
const LineFig = ({ d, ink, kind, on, win }) => (
  <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <g className={kind === 'egri' ? 'pq-wave' : undefined}>
      <path className="pq-line" d={d} pathLength="100" fill="none" stroke={on ? '#2f9e64' : ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    {win && <circle className="pq-slide" cy="32" r="4.5" fill="#ffd98a" stroke="#eebd63" strokeWidth="1" />}
  </svg>
);

export default function D32_09(props) {
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
    <div className={"pq pq3209" + (still ? " still" : "")}>
      <style>{`
        .pq3209.still *{animation:none !important;}
        .pq3209{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3209 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3209 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3209 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3209 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:44px 14px 32px;border-radius:22px;background:linear-gradient(#daecfa 0%,#ebf6fd 52%,#f0f9ec 100%);border:2px solid #d1e2ef;overflow:hidden;box-shadow:inset 0 2px 8px rgba(120,160,190,.12);}
        .pq3209 .pq-badge{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:999px;background:linear-gradient(#ffffff,#f0f7ff);border:2px solid #c4d9ee;color:#5b7ea6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(90,130,170,.14);}
        /* ===== AMBIENT ===== */
        .pq3209 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 15px 5px rgba(255,222,120,.5);animation:pq3209sun 4s ease-in-out infinite;z-index:1;}
        .pq3209 .pq-cloud{position:absolute;height:11px;background:#fff;border-radius:12px;opacity:.92;z-index:1;}
        .pq3209 .pq-cloud::before{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#fff;top:-7px;left:7px;}
        .pq3209 .pq-cloud.c1{top:16px;left:12%;width:36px;animation:pq3209drift 15s ease-in-out infinite;}
        .pq3209 .pq-cloud.c2{top:32px;left:32%;width:24px;transform:scale(.78);animation:pq3209drift 19s ease-in-out infinite reverse;}
        .pq3209 .pq-bird{position:absolute;opacity:.7;z-index:1;top:22px;left:54%;animation:pq3209bird 8s ease-in-out infinite;}
        .pq3209 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#d0ebbb 0%,#b6dd9c 100%);z-index:1;}
        .pq3209 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:8px;background:radial-gradient(circle at 5px 8px,#d0ebbb 5px,transparent 6px) repeat-x;background-size:13px 8px;}
        .pq3209 .pq-flw{position:absolute;width:5px;height:5px;border-radius:50%;z-index:2;}
        .pq3209 .pq-flw::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffe08a;}
        .pq3209 .pq-flw.f1{left:14%;bottom:9px;background:#f6b8c8;box-shadow:4px 0 0 #f6b8c8,-4px 0 0 #f6b8c8,0 4px 0 #f6b8c8,0 -4px 0 #f6b8c8;}
        .pq3209 .pq-flw.f2{right:12%;bottom:11px;background:#a9cef2;box-shadow:4px 0 0 #a9cef2,-4px 0 0 #a9cef2,0 4px 0 #a9cef2,0 -4px 0 #a9cef2;}
        .pq3209 .pq-bfly{position:absolute;width:7px;height:7px;z-index:5;top:60px;right:12%;animation:pq3209flit 10s ease-in-out infinite;}
        .pq3209 .pq-bfly::before,.pq3209 .pq-bfly::after{content:'';position:absolute;top:0;width:5px;height:8px;border-radius:60%;background:#c9b3e8;}
        .pq3209 .pq-bfly::before{left:-2.5px;transform-origin:right center;animation:pq3209wing .26s ease-in-out infinite alternate;}
        .pq3209 .pq-bfly::after{right:-2.5px;transform-origin:left center;animation:pq3209wing .26s ease-in-out infinite alternate;}
        /* ===== KARTALAR ===== */
        .pq3209 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
        .pq3209 .pq-card{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 8px;border-radius:16px;background:rgba(255,255,255,.94);border:3px solid #e3ebf3;cursor:pointer;transition:.15s;box-shadow:0 3px 8px rgba(110,140,170,.12);animation:pq3209enter .55s cubic-bezier(.3,1.3,.5,1) both;}
        .pq3209 .pq-card:nth-child(2){animation-delay:.1s;} .pq3209 .pq-card:nth-child(3){animation-delay:.2s;} .pq3209 .pq-card:nth-child(4){animation-delay:.3s;}
        .pq3209 .pq-card:hover:not(:disabled){background:#fdfeff;border-color:#bcd6ee;transform:translateY(-3px);}
        .pq3209 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3209 .pq-card.sel{border-color:#8fb5e6;background:#f0f6fe;box-shadow:0 0 0 3px rgba(143,181,230,.25);}
        .pq3209 .pq-card.right{border-color:#8ecfa8;background:#ecf9f1;box-shadow:0 0 0 3px rgba(142,207,168,.3);animation:pq3209cele .55s ease;}
        .pq3209 .pq-card.dim{opacity:.45;filter:saturate(.5);}
        .pq3209 .pq-card:disabled{cursor:default;}
        .pq3209 .pq-fig{width:100%;height:54px;animation:pq3209float 4s ease-in-out infinite;}
        .pq3209 .pq-card:nth-child(2) .pq-fig{animation-delay:-1s;} .pq3209 .pq-card:nth-child(3) .pq-fig{animation-delay:-2s;} .pq3209 .pq-card:nth-child(4) .pq-fig{animation-delay:-3s;}
        .pq3209 .pq-line{stroke-dasharray:100;animation:pq3209draw .9s ease-out .25s both;}
        .pq3209 .pq-card:nth-child(2) .pq-line{animation-delay:.4s;} .pq3209 .pq-card:nth-child(3) .pq-line{animation-delay:.55s;} .pq3209 .pq-card:nth-child(4) .pq-line{animation-delay:.7s;}
        .pq3209 .pq-wave{transform-box:fill-box;transform-origin:center;animation:pq3209breathe 3.6s ease-in-out infinite;}
        .pq3209 .pq-card:nth-child(2) .pq-wave{animation-delay:-1.2s;} .pq3209 .pq-card:nth-child(4) .pq-wave{animation-delay:-2.4s;}
        .pq3209 .pq-slide{animation:pq3209slide 1.4s ease-in-out .4s both;filter:drop-shadow(0 0 3px rgba(255,217,138,.8));}
        .pq3209 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#5cb885;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(60,120,90,.3);animation:pq3209pop .45s ease both;}
        .pq3209 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3209tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3209 .pq-spark.s2{animation-delay:-.6s;} .pq3209 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3209 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3209in .22s ease both;}
        .pq3209 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3209 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3209sun{0%,100%{transform:scale(1);box-shadow:0 0 13px 4px rgba(255,222,120,.45);}50%{transform:scale(1.07);box-shadow:0 0 19px 7px rgba(255,222,120,.6);}}
        @keyframes pq3209drift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq3209bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-24px,-5px);}}
        @keyframes pq3209wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3209flit{0%,100%{transform:translate(0,0);}25%{transform:translate(-60px,-12px);}50%{transform:translate(-150px,8px);}75%{transform:translate(-70px,-8px);}}
        @keyframes pq3209enter{from{opacity:0;transform:translateY(18px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3209draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3209float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3209breathe{0%,100%{transform:scaleY(1);}50%{transform:scaleY(1.12);}}
        @keyframes pq3209slide{0%{cx:14;opacity:0;}15%{opacity:1;}85%{opacity:1;}100%{cx:116;opacity:0;}}
        @keyframes pq3209pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3209tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3209cele{0%{transform:scale(1);}30%{transform:scale(1.05) rotate(-1deg);}60%{transform:scale(.98) rotate(1deg);}100%{transform:scale(1);}}
        @keyframes pq3209in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" />
        <span className="pq-grass" />
        <span className="pq-flw f1" /><span className="pq-flw f2" />
        <span className="pq-bfly" />

        {/* To'rt karta 2×2: ortiqcha (to'g'ri) NOT-first. G'alabagacha ortiqcha belgilanmaydi (javob-leak yo'q). */}
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
                <span className="pq-fig"><LineFig d={c.d} ink={INK[i]} kind={c.kind} on={right} win={right && !still} /></span>
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '46px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '32px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
