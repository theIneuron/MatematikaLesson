// Dars33 · Amaliyot 08 — Ko'p-tanlov «Barcha to'rtburchaklarni belgilang» · Blok 7 geometriya · 🔴 · tag: multi_quad
// To'rt shakl-karta: kvadrat (to'rtburchak — GOOD, M1), to'rtburchak (GOOD), doira, uchburchak. GOOD = {1,3} (chapdan emas, aralash).
// Distraktorlar: doira (burchaksiz) va uchburchak (uch burchak) — «faqat cho'ziq to'rtburchak» + kvadratni chetlab qoldirish (M1) xatosiga qarshi.
// ANSWER-LEAK yo'q: g'alabagacha shakl-turi nomi (kvadrat/to'rtburchak…) yozilmaydi va to'g'ri kartalar yashil bo'lmaydi — hammasi bir xil neytral.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'liq to'g'rida; hint farqni o'rgatadi.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri kartalar yakuniy yashil holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Shakl-kartalar (SVG kanon: viewBox 0 0 130 64, stroke-width 3). to'rtburchaklar NOT-first (index 1 va 3).
const CARDS = [
  { id: 'c0', kind: 'doira' },        // doira — 0 burchak, to'rtburchak EMAS
  { id: 'c1', kind: 'kvadrat' },      // kvadrat — 4 teng tomon, TO'RTBURCHAK (GOOD, index 1)
  { id: 'c2', kind: 'uchburchak' },   // uchburchak — 3 burchak, to'rtburchak EMAS
  { id: 'c3', kind: 'tortburchak' },  // to'rtburchak — cho'ziq (GOOD, index 3)
];
const QUADS = ['kvadrat', 'tortburchak'];
const GOOD = CARDS.map((c, i) => (QUADS.includes(c.kind) ? i : -1)).filter((i) => i >= 0); // [1,3]
const DATA = { good: GOOD, options: CARDS.map((c) => c.kind), level: '🔴', tag: 'multi_quad' };

const T = {
  uz: {
    eyebrow: "Geometriya · Shakllar", title: "To'rtburchaklar",
    ask: "Barcha to'rtburchaklarni belgilang.",
    correct: "Barakalla! Kvadrat ham to'rtburchak — to'rt tomoni bor.",
    hint: "To'rtburchakning to'rt tomoni bor. Kvadratni ham qo'shing.",
    l_doira: "doira", l_kvadrat: "kvadrat", l_uchburchak: "uchburchak", l_tortburchak: "to'g'ri to'rtburchak",
  },
  ru: {
    eyebrow: "Геометрия · Фигуры", title: "Четырёхугольники",
    ask: "Отметь все четырёхугольники.",
    correct: "Молодец! Квадрат тоже четырёхугольник — у него четыре стороны.",
    hint: "У четырёхугольника четыре стороны. Возьми и квадрат.",
    l_doira: "круг", l_kvadrat: "квадрат", l_uchburchak: "треугольник", l_tortburchak: "прямоугольник",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bitta shakl-figura — har tur o'z yumshoq pastel rangida; on=true bo'lsa yashil (g'alaba).
const SHAPE_C = {
  doira: { fill: '#ffe9d6', stroke: '#e08e5e' },
  kvadrat: { fill: '#e9e2f8', stroke: '#9b8ccf' },
  uchburchak: { fill: '#d9f2e2', stroke: '#63a97f' },
  tortburchak: { fill: '#d9eafa', stroke: '#7aa5cd' },
};
const ShapeFig = ({ kind, on }) => {
  const c = SHAPE_C[kind] || { fill: '#dce9f7', stroke: '#3f6b8c' };
  const st = on ? '#2e9e63' : c.stroke;
  const fl = on ? '#dff5e8' : c.fill;
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'doira' && <circle cx="65" cy="32" r="23" fill={fl} stroke={st} strokeWidth="3" />}
      {kind === 'kvadrat' && <rect x="42" y="9" width="46" height="46" rx="3" fill={fl} stroke={st} strokeWidth="3" strokeLinejoin="round" />}
      {kind === 'tortburchak' && <rect x="22" y="15" width="86" height="34" rx="3" fill={fl} stroke={st} strokeWidth="3" strokeLinejoin="round" />}
      {kind === 'uchburchak' && <polygon points="65,8 106,55 24,55" fill={fl} stroke={st} strokeWidth="3" strokeLinejoin="round" />}
    </svg>
  );
};

export default function D33_08(props) {
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
    <div className={"pq pq3308" + (still ? " still" : "")}>
      <style>{`
        .pq3308.still *{animation:none !important;}
        .pq3308{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3308 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7d94c9;text-transform:uppercase;}
        .pq3308 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3308 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3308 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(180deg,#f2f7fd 0%,#f6f2fb 100%);border:2px solid #e5e6f0;overflow:hidden;}
        .pq3308 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c6d9ef,#aec8e6);border:2.5px solid #9cb9dc;color:#33517a;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(90,120,160,.16),inset 0 1px 0 rgba(255,255,255,.5);}
        /* ambient — suzuvchi mini-shakllar + yulduzchalar */
        .pq3308 .pq-amb{position:absolute;z-index:1;pointer-events:none;opacity:.55;}
        .pq3308 .pq-amb.a1{width:13px;height:13px;border-radius:50%;border:2.5px solid #f6c9a4;left:16px;top:46px;animation:pq3308drift 9s ease-in-out infinite;}
        .pq3308 .pq-amb.a2{width:11px;height:11px;border-radius:3px;border:2.5px solid #c3b7ea;right:18px;top:54px;animation:pq3308drift 12s ease-in-out infinite reverse;}
        .pq3308 .pq-amb.a3{width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:13px solid #bfe4cf;left:44%;bottom:10px;animation:pq3308drift 11s ease-in-out infinite;}
        .pq3308 .pq-twk{position:absolute;z-index:1;color:#f4cf85;font-size:12px;line-height:0;pointer-events:none;animation:pq3308tws 3.4s ease-in-out infinite;}
        .pq3308 .pq-twk.w2{animation-delay:-1.2s;color:#c9d8f2;} .pq3308 .pq-twk.w3{animation-delay:-2.3s;color:#f3bfd0;}
        .pq3308 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
        /* kartalar bosqichma-bosqich kirib keladi, ichidagi shakl sekin suzadi */
        .pq3308 .pq-card{box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 9px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e3e6ee;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(90,110,140,.12);animation:pq3308enter .55s cubic-bezier(.25,1.4,.45,1) both;}
        .pq3308 .pq-card:nth-child(1){animation-delay:.05s;}
        .pq3308 .pq-card:nth-child(2){animation-delay:.18s;}
        .pq3308 .pq-card:nth-child(3){animation-delay:.31s;}
        .pq3308 .pq-card:nth-child(4){animation-delay:.44s;}
        .pq3308 .pq-card:hover:not(:disabled){background:#fbfdff;border-color:#bcd2ea;transform:translateY(-2px);}
        .pq3308 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3308 .pq-card.sel{border-color:#7fa8e0;background:#eef4fd;box-shadow:0 0 0 3px rgba(127,168,224,.25);}
        .pq3308 .pq-card.right{border-color:#7fc9a1;background:#eafaf1;box-shadow:0 0 0 3px rgba(127,201,161,.3);animation:pq3308cele .7s cubic-bezier(.3,1.6,.5,1);}
        .pq3308 .pq-card.dim{opacity:.4;filter:saturate(.6);}
        .pq3308 .pq-card:disabled{cursor:default;}
        .pq3308 .pq-fig{width:100%;height:56px;animation:pq3308float 3.8s ease-in-out infinite;}
        .pq3308 .pq-card:nth-child(2) .pq-fig{animation-delay:-1s;}
        .pq3308 .pq-card:nth-child(3) .pq-fig{animation-delay:-2s;}
        .pq3308 .pq-card:nth-child(4) .pq-fig{animation-delay:-3s;}
        .pq3308 .pq-card.right .pq-fig{animation:pq3308dance .9s ease,pq3308float 3.8s ease-in-out .9s infinite;}
        .pq3308 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#1a7f43;}
        .pq3308 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#4caf7d;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.18);animation:pq3308pop .45s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3308 .pq-spark{position:absolute;z-index:5;color:#f4cd79;opacity:0;line-height:0;pointer-events:none;animation:pq3308tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(244,205,121,.6));}
        .pq3308 .pq-spark.s2{animation-delay:-.6s;} .pq3308 .pq-spark.s3{animation-delay:-1.15s;}
        /* g'alaba-konfetti: pastel bo'lakchalar yuqoriga uchadi */
        .pq3308 .pq-conf{position:absolute;z-index:6;width:8px;height:8px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3308conf 1.5s ease-out both;}
        .pq3308 .pq-conf.k1{left:20%;bottom:60px;background:#f6c9a4;animation-delay:.05s;}
        .pq3308 .pq-conf.k2{left:36%;bottom:54px;background:#c3b7ea;border-radius:50%;animation-delay:.2s;}
        .pq3308 .pq-conf.k3{left:52%;bottom:62px;background:#9fd8ba;animation-delay:.1s;}
        .pq3308 .pq-conf.k4{left:68%;bottom:56px;background:#f3bfd0;border-radius:50%;animation-delay:.28s;}
        .pq3308 .pq-conf.k5{left:82%;bottom:64px;background:#a9cdf0;animation-delay:.16s;}
        .pq3308 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3308in .22s ease both;}
        .pq3308 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3308 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3308enter{from{opacity:0;transform:translateY(16px) scale(.82);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq3308float{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pq3308drift{0%,100%{transform:translate(0,0) rotate(0);}50%{transform:translate(9px,-11px) rotate(24deg);}}
        @keyframes pq3308tws{0%,100%{opacity:.25;transform:scale(.7);}50%{opacity:.9;transform:scale(1.15);}}
        @keyframes pq3308pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3308tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3308cele{0%{transform:scale(1);}35%{transform:scale(1.08) rotate(1.2deg);}65%{transform:scale(.96) rotate(-.8deg);}100%{transform:scale(1);}}
        @keyframes pq3308dance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(-8deg) scale(1.14);}55%{transform:rotate(7deg) scale(1.06);}80%{transform:rotate(-3deg) scale(1.02);}}
        @keyframes pq3308conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-70px) rotate(230deg);}}
        @keyframes pq3308in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
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

        {/* To'rt shakl-karta: to'rtburchaklar NOT-first. G'alabagacha tur-nomi yozilmaydi (javob-leak yo'q). */}
        <div className="pq-grid">
          {CARDS.map((c, i) => {
            const sel = pickedSet.has(i);
            const right = ok && GOOD.includes(i);
            const dim = ok && !GOOD.includes(i);
            const lab = t['l_' + c.kind];
            return (
              <button
                key={c.id}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => toggle(i)}
                aria-label={lab}
              >
                <span className="pq-fig"><ShapeFig kind={c.kind} on={right} /></span>
                {ok && <span className="pq-lab">{lab}</span>}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '48px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '60px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '34px' }}>{'✦'}</span>
          <span className="pq-conf k1" /><span className="pq-conf k2" /><span className="pq-conf k3" /><span className="pq-conf k4" /><span className="pq-conf k5" />
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
