// Dars32 · Amaliyot 08 — Ko'p-tanlov «Barcha to'g'ri chiziqlar» · Blok 7 geometriya · 🔴 · tag: multi_straight
// To'rt chiziq-karta: 2 to'g'ri (to'g'ri = GOOD), 1 egri, 1 siniq. GOOD = {1,3} (chapdan emas, aralash).
// Distraktorlar: egri (silliq burilish) va siniq (o'tkir zigzag) — «to'g'ri = biroz egilgan» + egri/siniq chalkashligiga qarshi.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'liq to'g'rida; hint farqni o'rgatadi.
// SAHNA (Dars15 ruhida): pastel osmon-maysa doska; quyosh, bulutlar, qush, kapalak. Kartalar ketma-ket kiradi,
// chiziqlar o'zini chizadi; G'ALABADA: ikkala to'g'ri chiziq bo'ylab qog'oz samolyotchalar uchadi + yulduzchalar.
// Review'da qayta o'ynamaydi (.still gate); to'g'ri kartalar yakuniy yashil holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chiziq-kartalar. SVG kanon: viewBox 0 0 130 64, stroke-width 4.5. to'g'ri NOT-first (index 1 va 3).
const CARDS = [
  { id: 'c0', kind: 'siniq', d: 'M14,46 L40,16 L66,46 L92,16 L116,46' },   // siniq — o'tkir zigzag
  { id: 'c1', kind: 'togri', d: 'M14,32 L116,32', p0: [14, 32], p1: [110, 32] },  // TO'G'RI (index 1)
  { id: 'c2', kind: 'egri', d: 'M14,40 C40,6 90,58 116,24' },              // egri — silliq burilish
  { id: 'c3', kind: 'togri', d: 'M20,24 L110,44', p0: [20, 24], p1: [106, 43] },  // TO'G'RI (index 3, qiya)
];
const GOOD = CARDS.map((c, i) => (c.kind === 'togri' ? i : -1)).filter((i) => i >= 0); // [1,3]
const DATA = { good: GOOD, options: CARDS.map((c) => c.kind), level: '🔴', tag: 'multi_straight' };
// Pastel chiziq ranglari (karta indeksiga ko'ra — javob-leak yo'q).
const INK = ['#c4a8de', '#8fbcda', '#e8a6b8', '#a9c88f'];

const T = {
  uz: {
    eyebrow: "Geometriya · Chiziqlar", title: "To'g'ri chiziqlar",
    ask: "Barcha to'g'ri chiziqlarni belgilang.",
    correct: "Barakalla! Ikki to'g'ri chiziq — burilishsiz.",
    hint: "To'g'ri chiziq — burilishsiz, tekis. Egri va siniqni qo'shmang.",
    l_egri: "egri", l_togri: "to'g'ri", l_siniq: "siniq",
  },
  ru: {
    eyebrow: "Геометрия · Линии", title: "Прямые линии",
    ask: "Отметь все прямые линии.",
    correct: "Молодец! Две прямые линии — без изгибов.",
    hint: "Прямая линия — без изгибов, ровная. Кривую и ломаную не бери.",
    l_egri: "кривая", l_togri: "прямая", l_siniq: "ломаная",
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

// Bitta chiziq-figura: pastel rang, o'zini chizadi; g'alabada to'g'ri chiziq bo'ylab samolyotcha uchadi.
const LineFig = ({ d, ink, on, plane, p0, p1 }) => (
  <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <path className="pq-line" d={d} pathLength="100" fill="none" stroke={on ? '#2f9e64' : ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    {plane && p0 && p1 && (
      <g className="pq-plane" style={{ '--x0': p0[0] + 'px', '--y0': p0[1] + 'px', '--x1': p1[0] + 'px', '--y1': p1[1] + 'px' }}>
        <path d="M0,-5 L12,0 L0,5 L3,0 Z" fill="#7fb1d8" stroke="#5b8fc0" strokeWidth="1" strokeLinejoin="round" />
      </g>
    )}
  </svg>
);

export default function D32_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlangan kartalar + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => GOOD.includes(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: CARDS.map((c) => c.kind), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3208" + (still ? " still" : "")}>
      <style>{`
        .pq3208.still *{animation:none !important;}
        .pq3208{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3208 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3208 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3208 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3208 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:44px 14px 32px;border-radius:22px;background:linear-gradient(#d9edfa 0%,#eaf6fd 52%,#eef8ec 100%);border:2px solid #cfe3ef;overflow:hidden;box-shadow:inset 0 2px 8px rgba(120,160,190,.12);}
        .pq3208 .pq-badge{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:999px;background:linear-gradient(#ffffff,#f0f7ff);border:2px solid #c4d9ee;color:#5b7ea6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(90,130,170,.14);}
        /* ===== AMBIENT ===== */
        .pq3208 .pq-sun{position:absolute;top:10px;left:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 15px 5px rgba(255,222,120,.5);animation:pq3208sun 4s ease-in-out infinite;z-index:1;}
        .pq3208 .pq-cloud{position:absolute;height:11px;background:#fff;border-radius:12px;opacity:.92;z-index:1;}
        .pq3208 .pq-cloud::before{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background:#fff;top:-7px;left:7px;}
        .pq3208 .pq-cloud.c1{top:15px;right:18%;width:36px;animation:pq3208drift 14s ease-in-out infinite;}
        .pq3208 .pq-cloud.c2{top:30px;right:6%;width:24px;transform:scale(.8);animation:pq3208drift 18s ease-in-out infinite reverse;}
        .pq3208 .pq-bird{position:absolute;opacity:.7;z-index:1;top:20px;left:38%;animation:pq3208bird 8s ease-in-out infinite;}
        .pq3208 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#cfeab8 0%,#b4dc99 100%);z-index:1;}
        .pq3208 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:8px;background:radial-gradient(circle at 5px 8px,#cfeab8 5px,transparent 6px) repeat-x;background-size:13px 8px;}
        .pq3208 .pq-flw{position:absolute;width:5px;height:5px;border-radius:50%;z-index:2;}
        .pq3208 .pq-flw::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffe08a;}
        .pq3208 .pq-flw.f1{left:12%;bottom:9px;background:#f6b8c8;box-shadow:4px 0 0 #f6b8c8,-4px 0 0 #f6b8c8,0 4px 0 #f6b8c8,0 -4px 0 #f6b8c8;}
        .pq3208 .pq-flw.f2{right:14%;bottom:11px;background:#c9b3e8;box-shadow:4px 0 0 #c9b3e8,-4px 0 0 #c9b3e8,0 4px 0 #c9b3e8,0 -4px 0 #c9b3e8;}
        .pq3208 .pq-bfly{position:absolute;width:7px;height:7px;z-index:5;top:56px;left:14%;animation:pq3208flit 10s ease-in-out infinite;}
        .pq3208 .pq-bfly::before,.pq3208 .pq-bfly::after{content:'';position:absolute;top:0;width:5px;height:8px;border-radius:60%;background:#f6b8c8;}
        .pq3208 .pq-bfly::before{left:-2.5px;transform-origin:right center;animation:pq3208wing .26s ease-in-out infinite alternate;}
        .pq3208 .pq-bfly::after{right:-2.5px;transform-origin:left center;animation:pq3208wing .26s ease-in-out infinite alternate;}
        /* ===== KARTALAR ===== */
        .pq3208 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
        .pq3208 .pq-card{box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 9px;border-radius:16px;background:rgba(255,255,255,.94);border:3px solid #e3ebf3;cursor:pointer;transition:.15s;box-shadow:0 3px 8px rgba(110,140,170,.12);animation:pq3208enter .55s cubic-bezier(.3,1.3,.5,1) both;}
        .pq3208 .pq-card:nth-child(2){animation-delay:.1s;} .pq3208 .pq-card:nth-child(3){animation-delay:.2s;} .pq3208 .pq-card:nth-child(4){animation-delay:.3s;}
        .pq3208 .pq-card:hover:not(:disabled){background:#fdfeff;border-color:#bcd6ee;transform:translateY(-3px);}
        .pq3208 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3208 .pq-card.sel{border-color:#8fb5e6;background:#f0f6fe;box-shadow:0 0 0 3px rgba(143,181,230,.25);}
        .pq3208 .pq-card.right{border-color:#8ecfa8;background:#ecf9f1;box-shadow:0 0 0 3px rgba(142,207,168,.3);animation:pq3208cele .55s ease;}
        .pq3208 .pq-card.dim{opacity:.45;filter:saturate(.5);}
        .pq3208 .pq-card:disabled{cursor:default;}
        .pq3208 .pq-fig{width:100%;height:52px;animation:pq3208float 4s ease-in-out infinite;}
        .pq3208 .pq-card:nth-child(2) .pq-fig{animation-delay:-1s;} .pq3208 .pq-card:nth-child(3) .pq-fig{animation-delay:-2s;} .pq3208 .pq-card:nth-child(4) .pq-fig{animation-delay:-3s;}
        .pq3208 .pq-line{stroke-dasharray:100;animation:pq3208draw .9s ease-out .25s both;}
        .pq3208 .pq-card:nth-child(2) .pq-line{animation-delay:.4s;} .pq3208 .pq-card:nth-child(3) .pq-line{animation-delay:.55s;} .pq3208 .pq-card:nth-child(4) .pq-line{animation-delay:.7s;}
        .pq3208 .pq-plane{animation:pq3208glide 1.6s ease-in-out .35s both;filter:drop-shadow(0 2px 2px rgba(90,130,170,.3));}
        .pq3208 .pq-card:nth-child(4) .pq-plane{animation-delay:.7s;}
        .pq3208 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#8494a6;}
        .pq3208 .pq-card.right .pq-lab{color:#2f9e64;}
        .pq3208 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#5cb885;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(60,120,90,.3);animation:pq3208pop .45s ease both;}
        .pq3208 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3208tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3208 .pq-spark.s2{animation-delay:-.6s;} .pq3208 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3208 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3208in .22s ease both;}
        .pq3208 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3208 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3208sun{0%,100%{transform:scale(1);box-shadow:0 0 13px 4px rgba(255,222,120,.45);}50%{transform:scale(1.07);box-shadow:0 0 19px 7px rgba(255,222,120,.6);}}
        @keyframes pq3208drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3208bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-24px,-5px);}}
        @keyframes pq3208wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3208flit{0%,100%{transform:translate(0,0);}25%{transform:translate(70px,-14px);}50%{transform:translate(170px,10px);}75%{transform:translate(80px,-8px);}}
        @keyframes pq3208enter{from{opacity:0;transform:translateY(18px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3208draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3208float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3208glide{0%{transform:translate(var(--x0),var(--y0)) scale(.7);opacity:0;}15%{opacity:1;}100%{transform:translate(var(--x1),var(--y1)) scale(1);opacity:1;}}
        @keyframes pq3208pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3208tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3208cele{0%{transform:scale(1);}30%{transform:scale(1.05) rotate(-1deg);}60%{transform:scale(.98) rotate(1deg);}100%{transform:scale(1);}}
        @keyframes pq3208in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
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

        {/* To'rt chiziq-karta: to'g'ri NOT-first. G'alabagacha to'g'ri kartalar belgilanmaydi (javob-leak yo'q). */}
        <div className="pq-grid">
          {CARDS.map((c, i) => {
            const sel = pickedSet.has(i);
            const right = ok && GOOD.includes(i);
            const dim = ok && !GOOD.includes(i);
            const lab = c.kind === 'egri' ? t.l_egri : c.kind === 'togri' ? t.l_togri : t.l_siniq;
            return (
              <button
                key={c.id}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => toggle(i)}
                aria-label={lab}
              >
                <span className="pq-fig"><LineFig d={c.d} ink={INK[i]} on={right} plane={right && !still} p0={c.p0} p1={c.p1} /></span>
                {ok && <span className="pq-lab">{lab}</span>}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '48px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '60px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '36px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
