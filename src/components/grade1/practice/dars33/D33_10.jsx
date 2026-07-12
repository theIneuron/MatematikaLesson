// Dars33 · Amaliyot 10 — 🔴 KO'ZGUNI TO'LDIR (simmetriya tuzish) · tag: symmetry_build
// Konsept: ko'zgu chizig'i (vertikal simmetriya o'qi) — o'ng yarim chap yarimning aynan aksi.
// Sahna: 5×4 panjara, markaziy ustunda uzuq-uzuq o'q; chap yarim (0,1-ustun) oldindan bo'yalgan.
// Bola o'ng yarim (3,4-ustun) katakchalarni bosib chap naqshni ko'zguga tushiradi.
// Distraktor (xato): ortiqcha yoki yetishmayotgan katak — ko'zgu buziladi (M4 asimmetriya).
// G'alaba: o'ng yarim aynan aks bo'lganda — yashil kataklar + yulduzlar (review'da statik).
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
        .pq3310 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f6d8f;text-transform:uppercase;}
        .pq3310 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3310 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3310 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq3310 .pq-stage{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:22px;background:linear-gradient(#eef4fb,#dfeaf5);border:2px solid #cfe0ef;overflow:hidden;padding:34px 10px 16px;}
        .pq3310 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:4;font-size:12.5px;font-weight:800;letter-spacing:.03em;color:#2f6d8f;white-space:nowrap;pointer-events:none;}
        .pq3310 .pq-svg{position:relative;z-index:2;display:block;width:100%;height:auto;}

        .pq3310 .pq-cellline{fill:#f4f9fe;stroke:#c6d9ea;stroke-width:1.5;}
        .pq3310 .pq-left{fill:#5f97c4;}
        .pq3310 .pq-hit{cursor:pointer;}
        .pq3310 .pq-hit.lock{cursor:default;}
        .pq3310 .pq-pick{fill:#2563eb;}
        .pq3310 .pq-pick.win{fill:#1a7f43;}
        .pq3310 .pq-empty{fill:transparent;}
        .pq3310 .pq-empty.idle{animation:pq3310Breathe 2.6s ease-in-out infinite;}
        .pq3310 .pq-empty.idle.d{animation-delay:-1.3s;}
        .pq3310 .pq-axis{stroke:#2f6d8f;stroke-width:3;stroke-dasharray:7 6;stroke-linecap:round;opacity:.8;}

        .pq3310 .pq-spark{position:absolute;z-index:5;color:#f2b134;opacity:0;line-height:0;pointer-events:none;animation:pq3310Sp 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3310.still .pq-spark{opacity:1;}
        .pq3310 .pq-spark.s2{animation-delay:-.6s;} .pq3310 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3310 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3310In .22s ease both;}
        .pq3310 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3310 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3310Breathe{0%,100%{fill:rgba(95,151,196,0);}50%{fill:rgba(95,151,196,.16);}}
        @keyframes pq3310Sp{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3310In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-board">{t.board}</div>
        <svg className="pq-svg" viewBox={`-4 -4 ${W + 8} ${H + 8}`} role="img" aria-label={t.ask}>
          {/* panjara katak-chegaralari */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => (
              <rect key={`g${r}-${c}`} className="pq-cellline" x={c * CELL} y={r * CELL} width={CELL} height={CELL} rx={4} />
            ))
          )}
          {/* chap yarim — oldindan bo'yalgan (statik rang, animatsiyasiz) */}
          {LEFT.map((p) => (
            <rect key={`l${p.r}-${p.c}`} className="pq-left" x={p.c * CELL + 4} y={p.r * CELL + 4} width={CELL - 8} height={CELL - 8} rx={5} />
          ))}
          {/* o'ng yarim — bosiladigan kataklar */}
          {RIGHT_CELLS.map((p, i) => {
            const k = key(p.r, p.c);
            const on = picked.includes(k);
            if (on) {
              return (
                <g key={`r${k}`} onClick={() => tap(p.r, p.c)}>
                  <rect className={'pq-pick' + (ok ? ' win' : '')} x={p.c * CELL + 4} y={p.r * CELL + 4} width={CELL - 8} height={CELL - 8} rx={5} />
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
          {/* ko'zgu chizig'i (o'q) — markazda, uzuq-uzuq, statik */}
          <line className="pq-axis" x1={AX} y1={-2} x2={AX} y2={H + 2} />
        </svg>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ right: '14%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', bottom: '16px' }}>{'✦'}</span>
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
