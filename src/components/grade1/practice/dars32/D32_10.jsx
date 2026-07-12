// Dars32 · Amaliyot 10 — 🔴 KESMA TUZISH (ikki nuqtani ulash) · tag: build_segment
// Konsept: kesma — ikki nuqta orasidagi to'g'ri yo'l. Bola A va B nuqtalarni bosadi,
// orasida to'g'ri chiziq CHIZILADI (stroke-dashoffset animatsiya; review'da .done statik).
// Figuralar: 3 nuqta A, B, C (LINE-SVG kanon: nuqta = to'ldirilgan doira; kesma = to'g'ri + 2 uch).
// Distraktor: noto'g'ri juftlik (A–C / B–C) — masalada A va B so'ralgan (har qanday 2 nuqta kesma beradi).
// SAHNA (Dars15 ruhi, geometriyaga moslab): yumshoq pastel shom osmoni — «yulduzlarni ula» o'yini.
// Oy, milt-milt yulduzchalar, suzuvchi bulut; nuqtalar yulduzday nur sochib turadi (idle halo).
// G'alaba: A–B orasida oltin kometa uchib o'tadi + osmonda uchar yulduz + yulduzchalar (review'da qayta o'ynalmaydi).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// viewBox 0 0 340 150 · nuqtalar koordinatasi (A chapda past, B o'ngda yuqori, C — distraktor)
const POINTS = [
  { id: 'A', x: 56, y: 112, lx: 40, ly: 108 },
  { id: 'B', x: 286, y: 48, lx: 300, ly: 46 },
  { id: 'C', x: 178, y: 36, lx: 178, ly: 20 },
];
const CORRECT = ['A', 'B'];
const DATA = { ptype: 'P24', level: '🔴', tag: 'build_segment', pair: CORRECT };
const P = (id) => POINTS.find((p) => p.id === id);
const samePair = (a, b) => a.length === 2 && b.length === 2 && [...a].sort().join() === [...b].sort().join();

const T = {
  uz: {
    eyebrow: "Geometriya doskasi · Kesma",
    setup: "Osmonda uch yulduz-nuqta bor.",
    ask: "A va B nuqtalarni to'g'ri chiziq bilan ulang.",
    board: "Yulduzlarni ulang",
    correct: "Kesma — ikki nuqta orasidagi to'g'ri yo'l.",
    hint: "A va B ni ulang.",
    pick: "Ikki nuqtani tanlang.",
  },
  ru: {
    eyebrow: "Гео-доска · Отрезок",
    setup: "На небе три точки-звезды.",
    ask: "Соедини точки A и B прямой.",
    board: "Соедини звёзды",
    correct: "Отрезок — прямой путь между двумя точками.",
    hint: "Соедини A и B.",
    pick: "Выбери две точки.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D32_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState([]);          // ['A'] | ['A','B']
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { pair:['A','B'] } dan tiklaydi.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.pair)) {
      setPicked(initialAnswer.studentAnswer.pair);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(picked.length === 2 && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked.length !== 2) return;
    const correct = samePair(picked, CORRECT);
    setFeedback({ correct, msg: correct ? t.correct : t.hint });
    if (correct) { setChecked(true); playCorrect?.(); } else { playWrong?.(); }
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: POINTS.map((p) => p.id),
      studentAnswer: { pair: [...picked] },
      correctAnswer: { pair: CORRECT },
      correct,
      meta: { ...DATA },
    });
    if (!correct) setPicked([]); // vedi-do-vernogo: qulflamaydi, kesma tarqaydi, qayta urinish
  }, [picked, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;

  const tap = (id) => {
    if (lock) return;
    setFeedback(null);
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // Kesma chizig'i (2 nuqta tanlangach) — uzunlik = uch-nuqtalar orasidagi masofa.
  const seg = picked.length === 2 ? (() => {
    const a = P(picked[0]), b = P(picked[1]);
    const len = Math.hypot(b.x - a.x, b.y - a.y) + 2;
    return { a, b, len };
  })() : null;

  return (
    <div className={"pq pq3210" + (still ? " still" : "")}>
      <style>{`
        .pq3210.still *{animation:none !important;}
        .pq3210{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3210 *{box-sizing:border-box;}
        .pq3210 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#8a7fb8;text-transform:uppercase;}
        .pq3210 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3210 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3210 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        /* ===== SHOM OSMONI (yulduzlarni ula) ===== */
        .pq3210 .pq-stage{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:22px;background:linear-gradient(#d8d4f0 0%,#e9def2 48%,#fbe9dc 100%);border:2px solid #d6cfe9;overflow:hidden;padding:36px 10px 16px;box-shadow:inset 0 2px 10px rgba(120,110,170,.14);}
        .pq3210 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:4;font-size:12.5px;font-weight:800;letter-spacing:.03em;color:#6d6299;white-space:nowrap;pointer-events:none;background:rgba(255,255,255,.72);padding:2px 13px 3px;border-radius:999px;border:1.5px solid #d9d0ec;}
        .pq3210 .pq-moon{position:absolute;top:12px;left:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 60% 40%,#fff9e6,#ffeebe 70%,#f7dd96);box-shadow:0 0 14px 4px rgba(255,236,178,.55);z-index:1;animation:pq3210Moon 5s ease-in-out infinite;}
        .pq3210 .pq-moon::after{content:'';position:absolute;top:2px;left:-4px;width:20px;height:20px;border-radius:50%;background:#dcd6f0;opacity:.85;}
        .pq3210 .pq-cloudn{position:absolute;height:10px;background:rgba(255,255,255,.8);border-radius:11px;z-index:1;}
        .pq3210 .pq-cloudn::before{content:'';position:absolute;width:13px;height:13px;border-radius:50%;background:rgba(255,255,255,.8);top:-6px;left:6px;}
        .pq3210 .pq-cloudn.c1{top:16px;right:14%;width:32px;animation:pq3210Drift 16s ease-in-out infinite;}
        .pq3210 .pq-cloudn.c2{top:34px;right:32%;width:22px;transform:scale(.75);animation:pq3210Drift 20s ease-in-out infinite reverse;}
        .pq3210 .pq-tstar{position:absolute;color:#fff;opacity:0;line-height:0;font-size:9px;z-index:1;pointer-events:none;animation:pq3210Tw 3.2s ease-in-out infinite;text-shadow:0 0 4px rgba(255,255,255,.9);}
        .pq3210 .pq-tstar.a{animation-delay:-1.1s;} .pq3210 .pq-tstar.b{animation-delay:-2.2s;}
        .pq3210 .pq-shoot{position:absolute;top:22px;left:-10px;width:34px;height:2.5px;border-radius:2px;background:linear-gradient(90deg,transparent,#fff);z-index:1;opacity:0;animation:pq3210Shoot 2.2s ease-out .3s both;}
        .pq3210.still .pq-shoot{display:none;}
        .pq3210 .pq-svg{position:relative;z-index:2;display:block;width:100%;height:auto;overflow:visible;}

        .pq3210 .pq-seg{stroke:#8a7fb8;stroke-width:5;fill:none;stroke-linecap:round;stroke-dashoffset:var(--len);}
        .pq3210 .pq-seg.done{stroke-dashoffset:0;}
        .pq3210 .pq-seg.draw{animation:pq3210Draw .5s ease forwards;}
        .pq3210 .pq-seg.win{stroke:#2f9e64;filter:drop-shadow(0 0 4px rgba(47,158,100,.45));}
        @keyframes pq3210Draw{from{stroke-dashoffset:var(--len);}to{stroke-dashoffset:0;}}

        .pq3210 .pq-hit{fill:transparent;cursor:pointer;}
        .pq3210 .pq-hit.lock{cursor:default;}
        .pq3210 .pq-pt{stroke:#fff;stroke-width:3;transition:fill .15s;}
        .pq3210 .pq-ray{transform-box:fill-box;transform-origin:center;animation:pq3210Ray 3s ease-in-out infinite;pointer-events:none;}
        .pq3210 .pq-lbl{font-family:'Manrope',system-ui,sans-serif;font-size:17px;font-weight:900;fill:#5f5488;}
        .pq3210 .pq-lbl.on{fill:#4a3f78;}
        .pq3210 .pq-lbl.win{fill:#2f9e64;}
        .pq3210 .pq-halo{fill:none;stroke:#bcaede;stroke-width:2.5;opacity:.55;animation:pq3210Pulse 2.4s ease-in-out infinite;}
        .pq3210 .pq-comet{animation:pq3210Comet 1.1s ease-in-out .45s both;filter:drop-shadow(0 0 5px rgba(255,217,138,.9));}
        .pq3210.still .pq-comet{display:none;}

        .pq3210 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3210Sp 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3210 .pq-spark.s2{animation-delay:-.6s;} .pq3210 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3210 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3210In .22s ease both;}
        .pq3210 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3210 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3210Moon{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3210Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3210Tw{0%,100%{opacity:.15;transform:scale(.6);}50%{opacity:1;transform:scale(1.15);}}
        @keyframes pq3210Shoot{0%{opacity:0;transform:translate(0,0) rotate(14deg);}12%{opacity:1;}100%{opacity:0;transform:translate(150px,38px) rotate(14deg);}}
        @keyframes pq3210Ray{0%,100%{opacity:.35;transform:scale(.9) rotate(0deg);}50%{opacity:.9;transform:scale(1.15) rotate(45deg);}}
        @keyframes pq3210Pulse{0%,100%{transform:scale(1);opacity:.5;}50%{transform:scale(1.35);opacity:.15;}}
        @keyframes pq3210Comet{0%{transform:translate(var(--x0),var(--y0)) scale(.6);opacity:0;}15%{opacity:1;}100%{transform:translate(var(--x1),var(--y1)) scale(1);opacity:0;}}
        @keyframes pq3210Sp{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3210In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-board">{t.board}</div>
        <span className="pq-moon" />
        <span className="pq-cloudn c1" /><span className="pq-cloudn c2" />
        {/* milt-milt dekor yulduzchalar (bosiladigan nishon EMAS) */}
        <span className="pq-tstar" style={{ left: 30, top: 50 }}>{'✦'}</span>
        <span className="pq-tstar a" style={{ right: 34, bottom: 44 }}>{'✦'}</span>
        <span className="pq-tstar b" style={{ left: 128, bottom: 32 }}>{'✦'}</span>
        <span className="pq-tstar a" style={{ right: 100, top: 56 }}>{'✦'}</span>
        {ok && <span className="pq-shoot" />}

        <svg className="pq-svg" viewBox="0 0 340 150" role="img" aria-label={t.ask}>
          {/* KESMA: 2 nuqta tanlangach chiziladi (stroke-dashoffset -> 0) */}
          {seg && (
            <line className={'pq-seg' + (still ? ' done' : ' draw') + (ok ? ' win' : '')}
              x1={seg.a.x} y1={seg.a.y} x2={seg.b.x} y2={seg.b.y}
              style={{ strokeDasharray: seg.len, '--len': seg.len }} />
          )}
          {/* G'alabada: A dan B ga oltin kometa uchadi */}
          {ok && seg && (
            <circle className="pq-comet" r="5" fill="#ffd98a" stroke="#eebd63" strokeWidth="1"
              style={{ '--x0': seg.a.x + 'px', '--y0': seg.a.y + 'px', '--x1': seg.b.x + 'px', '--y1': seg.b.y + 'px' }} />
          )}
          {/* NUQTALAR: yulduz-nuqtalar (nur + doira) + yorliq. Tanlanganlari kesma UCHLARI. */}
          {POINTS.map((p) => {
            const on = picked.includes(p.id);
            const endpoint = on && picked.length === 2;
            const fill = ok && endpoint ? '#2f9e64' : endpoint ? '#6d6299' : on ? '#8fa8dd' : '#eec97e';
            const lblCls = 'pq-lbl' + (ok && endpoint ? ' win' : on ? ' on' : '');
            return (
              <g key={p.id} onClick={() => tap(p.id)}>
                {idle && !on && <circle className="pq-halo" cx={p.x} cy={p.y} r={13} />}
                {/* yulduz nurlari (idle jimirlaydi) */}
                {!on && (
                  <g className="pq-ray" stroke="#f3d9a0" strokeWidth="2" strokeLinecap="round">
                    <line x1={p.x - 15} y1={p.y} x2={p.x - 11} y2={p.y} /><line x1={p.x + 11} y1={p.y} x2={p.x + 15} y2={p.y} />
                    <line x1={p.x} y1={p.y - 15} x2={p.x} y2={p.y - 11} /><line x1={p.x} y1={p.y + 11} x2={p.x} y2={p.y + 15} />
                  </g>
                )}
                <circle className="pq-pt" cx={p.x} cy={p.y} r={on ? 11 : 9} fill={fill} />
                <text className={lblCls} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle">{p.id}</text>
                <circle className={'pq-hit' + (lock ? ' lock' : '')} cx={p.x} cy={p.y} r={22} />
              </g>
            );
          })}
        </svg>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '42px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ right: '14%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', bottom: '18px' }}>{'✦'}</span>
        </>)}
      </div>

      {ok && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          <Star fill="#f2c063" /><Star fill="#e6ae52" /><Star fill="#f2c063" />
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
