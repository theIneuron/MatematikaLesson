// Dars32 · Amaliyot 06 — «Orasida» · Fazoviy munosabat · 🟡 · tag: between
// Sahna: bitta gorizontal kesma + UCH nuqta — chapdagi (marjon-qizg'ish, chetda), o'rtadagi (sariq, orasida), o'ngdagi (ko'k, chetda).
// Uchala nuqta bosiladi; TO'G'RI = o'rtadagi (orasida). NOTO'G'RI (chetdagi) -> hint «Chetdagi emas — o'rtadagini toping».
// SAHNA (Dars15 ruhida): pastel osmon-maysa doska; quyosh, bulut, qush. Nuqtalar kesmaga sakrab tushadi (enter),
// sekin nafas oladi (idle); G'ALABADA: o'rtadagi nuqta yorishadi (halqa-to'lqin) + tepasida yulduzcha-toj + yorliqlar.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q; setChecked FAQAT to'g'rida. Review'da qayta o'ynamaydi (.still gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Uch nuqta: ikki chetda (marjon/ko'k) + bitta o'rtada (sariq). To'g'ri = o'rta ('mid'). Pastel ranglar.
const DOTS = [
  { id: 'left', cx: 44, cy: 66, fill: '#ef9d9d', role: 'chetda' },
  { id: 'mid', cx: 156, cy: 66, fill: '#f2c063', role: 'orasida' },
  { id: 'right', cx: 268, cy: 66, fill: '#8fb5de', role: 'chetda' },
];
const TARGET = 'mid';
const DATA = { target: TARGET, dots: DOTS.map((d) => d.id), level: '🟡', tag: 'between' };

const T = {
  uz: {
    eyebrow: 'Geometriya doskasi · Fazo', title: 'Orasida',
    setup: 'Kesmada uchta nuqta bor.',
    ask: 'Ikki chetdagi nuqta orasidagi nuqtani bosing.',
    correct: 'Barakalla! O\'rtadagi nuqta — ikki chetning orasida.',
    hint: 'Chetdagi emas — o\'rtadagini toping.',
    edge: 'chetda', midLab: 'orasida',
  },
  ru: {
    eyebrow: 'Доска геометрии · Пространство', title: 'Между',
    setup: 'На отрезке три точки.',
    ask: 'Нажми на точку между двумя крайними.',
    correct: 'Молодец! Средняя точка — между двумя крайними.',
    hint: 'Не крайнюю — найди среднюю.',
    edge: 'с краю', midLab: 'между',
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

export default function D32_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: tanlov + feedback (DOIM msg) tiklanadi; setChecked FAQAT to'g'rida.
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DOTS.map((d) => d.role), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3206" + (still ? " still" : "")}>
      <style>{`
        .pq3206.still *{animation:none !important;}
        .pq3206{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3206 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3206 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3206 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3206 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3206 .pq-board{box-sizing:border-box;position:relative;width:372px;max-width:100%;margin:0 auto;padding:36px 12px 22px;border-radius:22px;background:linear-gradient(#daecfa 0%,#ecf6fd 55%,#f0f9ec 100%);border:2px solid #d0e1ef;overflow:hidden;box-shadow:inset 0 2px 8px rgba(120,160,190,.12);}
        .pq3206 .pq-tag{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:4;padding:3px 14px 4px;border-radius:999px;background:linear-gradient(#ffffff,#f0f7ff);border:2px solid #c4d9ee;color:#5b7ea6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(90,130,170,.14);}
        /* ===== AMBIENT ===== */
        .pq3206 .pq-sun{position:absolute;top:10px;left:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 14px 4px rgba(255,222,120,.5);animation:pq3206sun 4s ease-in-out infinite;z-index:1;}
        .pq3206 .pq-cloud{position:absolute;height:10px;background:#fff;border-radius:11px;opacity:.92;z-index:1;}
        .pq3206 .pq-cloud::before{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:-7px;left:6px;}
        .pq3206 .pq-cloud.c1{top:14px;right:16%;width:32px;animation:pq3206drift 15s ease-in-out infinite;}
        .pq3206 .pq-cloud.c2{top:30px;right:5%;width:22px;transform:scale(.78);animation:pq3206drift 19s ease-in-out infinite reverse;}
        .pq3206 .pq-bird{position:absolute;opacity:.7;z-index:1;top:20px;left:40%;animation:pq3206bird 9s ease-in-out infinite;}
        .pq3206 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(#d2ecbc 0%,#b8de9e 100%);z-index:1;}
        .pq3206 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:8px;background:radial-gradient(circle at 5px 8px,#d2ecbc 5px,transparent 6px) repeat-x;background-size:13px 8px;}
        .pq3206 .pq-flw{position:absolute;width:5px;height:5px;border-radius:50%;z-index:2;}
        .pq3206 .pq-flw::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffe08a;}
        .pq3206 .pq-flw.f1{left:10%;bottom:6px;background:#f6b8c8;box-shadow:4px 0 0 #f6b8c8,-4px 0 0 #f6b8c8,0 4px 0 #f6b8c8,0 -4px 0 #f6b8c8;}
        .pq3206 .pq-flw.f2{right:12%;bottom:8px;background:#c9b3e8;box-shadow:4px 0 0 #c9b3e8,-4px 0 0 #c9b3e8,0 4px 0 #c9b3e8,0 -4px 0 #c9b3e8;}
        /* ===== KESMA + NUQTALAR ===== */
        .pq3206 .pq-svg{display:block;width:100%;height:auto;position:relative;z-index:2;overflow:visible;}
        .pq3206 .pq-seg{stroke-dasharray:100;animation:pq3206draw .8s ease-out .15s both;}
        .pq3206 .pq-drop{transform-box:fill-box;transform-origin:center bottom;animation:pq3206dropIn .6s cubic-bezier(.3,1.4,.5,1) both;}
        .pq3206 .pq-drop.d2{animation-delay:.18s;} .pq3206 .pq-drop.d3{animation-delay:.36s;}
        .pq3206 .pq-bob{transform-box:fill-box;transform-origin:center;animation:pq3206bob 3.4s ease-in-out infinite;}
        .pq3206 .pq-drop.d2 .pq-bob{animation-delay:-1.1s;} .pq3206 .pq-drop.d3 .pq-bob{animation-delay:-2.2s;}
        .pq3206 .pq-dot{cursor:pointer;transition:.12s;}
        .pq3206 .pq-dot:hover .hit{opacity:.12;}
        .pq3206 .pq-dot.lock{cursor:default;}
        .pq3206 .pq-dot.sel .ring{stroke:#8fb5e6;stroke-width:3;opacity:1;}
        .pq3206 .pq-dot.right .ring{stroke:#5cb885;stroke-width:4;opacity:1;}
        .pq3206 .pq-dot.right .body{filter:drop-shadow(0 0 6px rgba(92,184,133,.7));}
        .pq3206 .pq-dot.dim{opacity:.45;}
        .pq3206 .pq-halo{opacity:0;transform-box:fill-box;transform-origin:center;}
        .pq3206 .pq-dot.right .pq-halo{opacity:.5;animation:pq3206pulse 1.5s ease-in-out infinite;}
        .pq3206.still .pq-dot.right .pq-halo{opacity:.4;}
        .pq3206 .pq-crown{opacity:0;transform-box:fill-box;transform-origin:center;}
        .pq3206 .pq-dot.right .pq-crown{animation:pq3206crown 1.8s ease-in-out .2s infinite;}
        .pq3206.still .pq-dot.right .pq-crown{opacity:1;}
        .pq3206 .pq-lab{font-size:11px;font-weight:800;text-anchor:middle;fill:#5c6672;}
        .pq3206 .pq-lab.on{fill:#2f9e64;}
        .pq3206 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3206tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3206 .pq-spark.s2{animation-delay:-.6s;} .pq3206 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3206 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3206in .22s ease both;}
        .pq3206 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3206 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3206sun{0%,100%{transform:scale(1);box-shadow:0 0 12px 3px rgba(255,222,120,.45);}50%{transform:scale(1.08);box-shadow:0 0 18px 6px rgba(255,222,120,.6);}}
        @keyframes pq3206drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-13px);}}
        @keyframes pq3206bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-22px,-5px);}}
        @keyframes pq3206draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3206dropIn{from{opacity:0;transform:translateY(-30px);}60%{opacity:1;transform:translateY(3px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq3206bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pq3206pulse{0%,100%{transform:scale(1);opacity:.5;}50%{transform:scale(1.5);opacity:.12;}}
        @keyframes pq3206crown{0%,100%{opacity:.5;transform:translateY(0) scale(.9) rotate(0);}50%{opacity:1;transform:translateY(-4px) scale(1.1) rotate(20deg);}}
        @keyframes pq3206tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3206in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-tag">{t.title}</div>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" />
        <span className="pq-grass" />
        <span className="pq-flw f1" /><span className="pq-flw f2" />

        {/* Kesma (to'g'ri chiziq + ikki chet nuqta) + o'rtadagi nuqta. Uchala nuqta bosiladi. */}
        <svg className="pq-svg" viewBox="0 0 312 128" role="img" aria-label={t.ask}>
          {/* kesma chizig'i — o'zini chizadi */}
          <path className="pq-seg" pathLength="100" d="M44,66 L268,66" fill="none" stroke="#7fa3c2" strokeWidth="4" strokeLinecap="round" />
          {DOTS.map((d, di) => {
            const sel = picked === d.id;
            const right = ok && d.id === TARGET;
            const dim = ok && d.id !== TARGET;
            const cls = 'pq-dot' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '') + (lock ? ' lock' : '');
            const isMid = d.id === TARGET;
            return (
              <g key={d.id} className={'pq-drop d' + (di + 1)}>
                <g className="pq-bob">
                  <g className={cls} onClick={() => { if (lock) return; setPicked(d.id); setFeedback(null); }}>
                    {/* halo (faqat g'alabada o'rtada) */}
                    <circle className="pq-halo" cx={d.cx} cy={d.cy} r="18" fill="#7cc7a0" />
                    {/* bosish maydoni */}
                    <circle className="hit" cx={d.cx} cy={d.cy} r="26" fill="#7fa3c2" opacity="0" />
                    {/* tanlov/g'alaba halqasi */}
                    <circle className="ring" cx={d.cx} cy={d.cy} r="17" fill="none" stroke="#8fb5e6" strokeWidth="3" opacity="0" />
                    {/* nuqta tanasi */}
                    <circle className="body" cx={d.cx} cy={d.cy} r="11" fill={d.fill} stroke="#fff" strokeWidth="2.5" />
                    {/* yulduzcha-toj (faqat g'alabada, o'rtada) */}
                    {isMid && (
                      <path className="pq-crown" d={`M${d.cx} ${d.cy - 30} l2.4 6.1 6.1 2.4 -6.1 2.4 -2.4 6.1 -2.4 -6.1 -6.1 -2.4 6.1 -2.4 Z`} fill="#ffd98a" stroke="#eebd63" strokeWidth="1" />
                    )}
                    {/* yorliq: g'alabada faqat o'rta = orasida, chetlar = chetda */}
                    {right && <text className="pq-lab on" x={d.cx} y={d.cy + 32}>{t.midLab}</text>}
                    {ok && !isMid && <text className="pq-lab" x={d.cx} y={d.cy + 32}>{t.edge}</text>}
                  </g>
                </g>
              </g>
            );
          })}
        </svg>

        {ok && (<>
          <span className="pq-spark" style={{ left: '50%', top: '26px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '34%', top: '78px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '66%', top: '80px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
