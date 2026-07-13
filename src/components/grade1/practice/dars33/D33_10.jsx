// Dars33 · Amaliyot 10 — 🔴 KO'ZGUNI TO'LDIR (simmetriya tuzish) · tag: symmetry_build
// Konsept: ko'zgu chizig'i (vertikal simmetriya o'qi) — o'ng yarim chap yarimning aynan aksi.
// Sahna: 5×4 panjara, markaziy ustunda uzuq-uzuq o'q; chap yarim (0,1-ustun) oldindan bo'yalgan.
// Bola o'ng yarim (3,4-ustun) katakchalarni bosib chap naqshni ko'zguga tushiradi.
// Distraktor (xato): ortiqcha yoki yetishmayotgan katak — ko'zgu buziladi (M4 asimmetriya).
// DIZAYN (D33_01/09 uslubi): yumshoq pastel + harakat — kataklar bosqichma-bosqich kirib keladi,
//   bo'sh kataklar sekin nafas oladi (taklif), ambient mini-shakllar suzadi; g'alabada kataklar
//   sakraydi + konfetti + yulduzlar. Review'da (.still) barcha animatsiya o'chadi — yakuniy statik holat.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Panjara: 5 ustun (0..4) × 4 qator (0..3). Markaz = 2-ustun (o'q). Ko'zgu: c -> 4-c.
const COLS = 5, ROWS = 4, CELL = 58;
// Chap yarim oldindan bo'yalgan kataklar (ustun 0/1) — naqsh (o'q shakli).
const LEFT = [
  { r: 0, c: 1 },
  { r: 1, c: 0 }, { r: 1, c: 1 },
  { r: 2, c: 0 }, { r: 2, c: 1 },
  { r: 3, c: 1 },
];
const key = (r, c) => `${r},${c}`;
// To'g'ri javob = chapning ko'zgusi (o'ng yarim, ustun 3/4).
const TARGET = LEFT.map((p) => key(p.r, COLS - 1 - p.c));
const TARGET_SET = new Set(TARGET);
const LEFT_SET = new Set(LEFT.map((p) => key(p.r, p.c)));
const RIGHT_CELLS = []; // bosiladigan o'ng-yarim kataklar (ustun 3,4)
for (let r = 0; r < ROWS; r++) for (let c = 3; c < COLS; c++) RIGHT_CELLS.push({ r, c });
const DATA = { ptype: 'P33', level: '🔴', tag: 'symmetry_build', target: TARGET };
const sameSet = (arr, set) => arr.length === set.size && arr.every((k) => set.has(k));

const T = {
  uz: {
    eyebrow: "Geometriya doskasi · Simmetriya",
    setup: "Chap yarim bo'yalgan.",
    ask: "Ko'zgu chizig'idan simmetrik to'ldiring.",
    board: "Ko'zgu",
    correct: "Barakalla! O'ng yarim chapning aynan aksi.",
    hint: "Chap tomonning ko'zgusi bo'lsin.",
  },
  ru: {
    eyebrow: "Гео-доска · Симметрия",
    setup: "Левая половина закрашена.",
    ask: "Дополни симметрично относительно оси.",
    board: "Зеркало",
    correct: "Молодец! Правая половина — точное отражение левой.",
    hint: "Пусть будет зеркалом левой стороны.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D33_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState([]);        // o'ng-yarim tanlangan kataklar: ['0,3', ...]
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { cells:['0,3',...] } dan tiklaydi.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.cells)) {
      setPicked(initialAnswer.studentAnswer.cells);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(picked.length > 0 && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked.length === 0) return;
    const correct = sameSet(picked, TARGET_SET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint });
    if (correct) { setChecked(true); playCorrect?.(); } else { playWrong?.(); }
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: RIGHT_CELLS.map((p) => key(p.r, p.c)),
      studentAnswer: { cells: [...picked] },
      correctAnswer: { cells: TARGET },
      correct,
      meta: { ...DATA },
    });
    if (!correct) setPicked([]); // vedi-do-vernogo: qulflamaydi, ko'zgu tozalanadi, qayta urinish
  }, [picked, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;

  const tap = (r, c) => {
    if (lock) return;
    setFeedback(null);
    const k = key(r, c);
    setPicked((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  const W = COLS * CELL, H = ROWS * CELL, AX = 2.5 * CELL; // o'q markaziy ustun o'rtasi

  return (
    <div className={"pq pq3310" + (still ? " still" : "")}>
      <style>{`
        .pq3310.still *{animation:none !important;}
        .pq3310{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3310 *{box-sizing:border-box;}
        .pq3310 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7d94c9;text-transform:uppercase;}
        .pq3310 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3310 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3310 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq3310 .pq-stage{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:22px;background:linear-gradient(180deg,#f4f2fc 0%,#eef5fb 55%,#f0f6f3 100%);border:2px solid #e2e9f2;overflow:hidden;padding:40px 10px 18px;}
        .pq3310 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 15px 4px;border-radius:9px;background:linear-gradient(#cdd9f2,#b3c6ea);border:2.5px solid #a0b6dd;color:#3a4f7a;font-size:12px;font-weight:800;letter-spacing:.03em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(90,120,160,.16),inset 0 1px 0 rgba(255,255,255,.55);}

        /* ambient — suzuvchi mini-shakllar + yulduzchalar (geometrik "hayot") */
        .pq3310 .pq-amb{position:absolute;z-index:1;pointer-events:none;opacity:.5;}
        .pq3310 .pq-amb.a1{width:12px;height:12px;border-radius:50%;border:2.5px solid #c3b7ea;left:12px;top:52px;animation:pq3310drift 9s ease-in-out infinite;}
        .pq3310 .pq-amb.a2{width:10px;height:10px;border-radius:3px;border:2.5px solid #a9cdf0;right:14px;top:60px;animation:pq3310drift 12s ease-in-out infinite reverse;}
        .pq3310 .pq-amb.a3{width:8px;height:8px;border-radius:50%;background:#cfe2f6;left:6%;bottom:16px;animation:pq3310drift 11s ease-in-out infinite reverse;}
        .pq3310 .pq-twk{position:absolute;z-index:1;color:#c9d8f2;font-size:11px;line-height:0;pointer-events:none;animation:pq3310tws 3.4s ease-in-out infinite;}
        .pq3310 .pq-twk.w2{animation-delay:-1.2s;color:#d8ccf0;} .pq3310 .pq-twk.w3{animation-delay:-2.3s;color:#bcd6f2;}

        .pq3310 .pq-svg{position:relative;z-index:2;display:block;width:100%;height:auto;}
        .pq3310 .pq-svg rect{transform-box:fill-box;transform-origin:center;}

        .pq3310 .pq-cellline{fill:#f6f9fe;stroke:#cdddef;stroke-width:1.5;}
        /* chap naqsh — yumshoq pastel siyohrang, bosqichma-bosqich "bo'yaladi" */
        .pq3310 .pq-left{fill:url(#pq3310lg);animation:pq3310paint .5s cubic-bezier(.25,1.4,.45,1) both;}
        .pq3310 .pq-hit{cursor:pointer;}
        .pq3310 .pq-hit.lock{cursor:default;}
        /* tanlangan (bosilgan) — yumshoq havorang */
        .pq3310 .pq-pick{fill:url(#pq3310pk);animation:pq3310pop .38s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3310 .pq-pick.win{fill:url(#pq3310wn);animation:pq3310cele .9s ease both;}
        .pq3310 .pq-pick.win.d2{animation-delay:.09s;} .pq3310 .pq-pick.win.d3{animation-delay:.18s;}
        .pq3310 .pq-empty{fill:transparent;}
        .pq3310 .pq-empty.idle{animation:pq3310Breathe 2.6s ease-in-out infinite;}
        .pq3310 .pq-empty.idle.d{animation-delay:-1.3s;}
        .pq3310 .pq-axis{stroke:#8a79c9;stroke-width:3;stroke-dasharray:7 6;stroke-linecap:round;opacity:.85;animation:pq3310axis 2.8s ease-in-out infinite;}

        .pq3310 .pq-spark{position:absolute;z-index:5;color:#f2b134;opacity:0;line-height:0;pointer-events:none;animation:pq3310Sp 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3310.still .pq-spark{opacity:1;}
        .pq3310 .pq-spark.s2{animation-delay:-.6s;} .pq3310 .pq-spark.s3{animation-delay:-1.15s;}

        /* g'alaba-konfetti: pastel bo'lakchalar yuqoriga uchadi (review'da ko'rinmaydi) */
        .pq3310 .pq-conf{position:absolute;z-index:6;width:8px;height:8px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3310conf 1.5s ease-out both;}
        .pq3310 .pq-conf.k1{left:20%;bottom:44px;background:#c3b7ea;animation-delay:.05s;}
        .pq3310 .pq-conf.k2{left:38%;bottom:36px;background:#a9cdf0;border-radius:50%;animation-delay:.2s;}
        .pq3310 .pq-conf.k3{left:54%;bottom:46px;background:#9fd8ba;animation-delay:.1s;}
        .pq3310 .pq-conf.k4{left:70%;bottom:38px;background:#f3bfd0;border-radius:50%;animation-delay:.28s;}
        .pq3310 .pq-conf.k5{left:84%;bottom:46px;background:#f6c9a4;animation-delay:.16s;}

        .pq3310 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3310In .22s ease both;}
        .pq3310 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3310 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3310paint{from{opacity:0;transform:scale(.35);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3310pop{from{opacity:0;transform:scale(.35);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3310cele{0%{transform:scale(1);}30%{transform:scale(1.16);}55%{transform:scale(.94);}78%{transform:scale(1.06);}100%{transform:scale(1);}}
        @keyframes pq3310Breathe{0%,100%{fill:rgba(138,121,201,0);}50%{fill:rgba(138,121,201,.16);}}
        @keyframes pq3310axis{0%,100%{opacity:.5;}50%{opacity:.95;}}
        @keyframes pq3310drift{0%,100%{transform:translate(0,0) rotate(0);}50%{transform:translate(9px,-11px) rotate(24deg);}}
        @keyframes pq3310tws{0%,100%{opacity:.2;transform:scale(.7);}50%{opacity:.9;transform:scale(1.15);}}
        @keyframes pq3310Sp{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3310conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-70px) rotate(230deg);}}
        @keyframes pq3310In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-badge">{t.board}</div>

        {/* ambient hayot: suzuvchi mini-shakllar + yulduzchalar */}
        <span className="pq-amb a1" /><span className="pq-amb a2" /><span className="pq-amb a3" />
        <span className="pq-twk" style={{ left: '8%', top: '32px' }}>{'✦'}</span>
        <span className="pq-twk w2" style={{ right: '8%', top: '36px' }}>{'✦'}</span>
        <span className="pq-twk w3" style={{ left: '46%', bottom: '12px' }}>{'✦'}</span>

        <svg className="pq-svg" viewBox={`-4 -4 ${W + 8} ${H + 8}`} role="img" aria-label={t.ask}>
          <defs>
            <linearGradient id="pq3310lg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a99fe0" /><stop offset="1" stopColor="#8f83cf" />
            </linearGradient>
            <linearGradient id="pq3310pk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fbcf0" /><stop offset="1" stopColor="#5f97d8" />
            </linearGradient>
            <linearGradient id="pq3310wn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7fd3a4" /><stop offset="1" stopColor="#2e9e63" />
            </linearGradient>
          </defs>
          {/* panjara katak-chegaralari */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => (
              <rect key={`g${r}-${c}`} className="pq-cellline" x={c * CELL} y={r * CELL} width={CELL} height={CELL} rx={4} />
            ))
          )}
          {/* chap yarim — oldindan bo'yalgan (bosqichma-bosqich "bo'yaladi") */}
          {LEFT.map((p, i) => (
            <rect key={`l${p.r}-${p.c}`} className="pq-left" style={{ animationDelay: `${0.08 + i * 0.08}s` }} x={p.c * CELL + 4} y={p.r * CELL + 4} width={CELL - 8} height={CELL - 8} rx={5} />
          ))}
          {/* o'ng yarim — bosiladigan kataklar */}
          {RIGHT_CELLS.map((p, i) => {
            const k = key(p.r, p.c);
            const on = picked.includes(k);
            if (on) {
              return (
                <g key={`r${k}`} onClick={() => tap(p.r, p.c)}>
                  <rect className={'pq-pick' + (ok ? ' win' + (i % 3 ? (i % 3 === 2 ? ' d3' : ' d2') : '') : '')} x={p.c * CELL + 4} y={p.r * CELL + 4} width={CELL - 8} height={CELL - 8} rx={5} />
                  <rect className={'pq-hit' + (lock ? ' lock' : '')} x={p.c * CELL} y={p.r * CELL} width={CELL} height={CELL} fill="transparent" />
                </g>
              );
            }
            return (
              <g key={`r${k}`} onClick={() => tap(p.r, p.c)}>
                <rect className={'pq-empty' + (idle ? (i % 2 ? ' idle d' : ' idle') : '')} x={p.c * CELL + 4} y={p.r * CELL + 4} width={CELL - 8} height={CELL - 8} rx={5} />
                <rect className={'pq-hit' + (lock ? ' lock' : '')} x={p.c * CELL} y={p.r * CELL} width={CELL} height={CELL} fill="transparent" />
              </g>
            );
          })}
          {/* ko'zgu chizig'i (o'q) — markazda, uzuq-uzuq, sekin miltillaydi */}
          <line className="pq-axis" x1={AX} y1={-2} x2={AX} y2={H + 2} />
        </svg>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '46px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ right: '14%', top: '62px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', bottom: '18px' }}>{'✦'}</span>
          <span className="pq-conf k1" /><span className="pq-conf k2" /><span className="pq-conf k3" /><span className="pq-conf k4" /><span className="pq-conf k5" />
        </>)}
      </div>

      {ok && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          <Star fill="#f2b134" /><Star fill="#e59a2f" /><Star fill="#f2b134" />
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
