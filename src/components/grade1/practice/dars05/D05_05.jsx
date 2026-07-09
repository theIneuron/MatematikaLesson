// Dars05 · Amaliyot 05 — P5 INTERAKTIV «Teng bo'l»: 4 koptokni ikki kaftga teng bo'lish · 🟡 · tag: split_equal
// Koptok bosilganda zonasi aylanadi C→L→R→C; onReady = markazda 0 koptok; to'g'ri = 2 va 2.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { total: 4, ptype: 'P5', level: '🟡', tag: 'split_equal' };
const HALF = DATA.total / 2; // 2
const T = {
  uz: {
    eyebrow: 'Sirk · Jonglyor', title: 'Teng bo\'l',
    setup: 'Jonglyor sizga to\'rtta koptok berdi.',
    ask: 'Koptoklarni qo\'lga torting. Ikkala qo\'lda TENG bo\'lsin!',
    correct: 'Barakalla! Ikki va ikki — to\'rt. Ikkala qo\'lda teng!',
    hintCenter: 'Avval barcha koptoklarni qo\'llarga torting.',
    hintUneven: 'Har qo\'ldagini sanang: ikkala qo\'lda TENG bo\'lishi kerak.',
    tapHint: 'Koptokni qo\'lga torting',
  },
  ru: {
    eyebrow: 'Цирк · Жонглёр', title: 'Раздели поровну',
    setup: 'Жонглёр дал тебе четыре мяча.',
    ask: 'Перетащи мячи в руки. Пусть в обеих руках будет ПОРОВНУ!',
    correct: 'Молодец! Два и два — четыре. В обеих руках поровну!',
    hintCenter: 'Сначала перетащи все мячи в руки.',
    hintUneven: 'Посчитай в каждой ладони: в обеих руках должно быть ПОРОВНУ.',
    tapHint: 'Перетащи мяч в руку',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KOPTOK KANONI: r~10 doira, radial 2-ton (asos + ochroq tepa-chap), yupqa quyuq
// kontur, tepa-chapda oq blik-ellipse. Palitra ketma-ket: qizil, ko'k, sariq, yashil.
const BALL_C = [
  { top: '#eb8b84', base: '#d9534b', edge: '#9e352f' },
  { top: '#8fbede', base: '#4f8fc4', edge: '#33648f' },
  { top: '#f8d47e', base: '#f2b134', edge: '#b97c14' },
  { top: '#8fcb88', base: '#57a84f', edge: '#3a7a34' },
];
const Ball = ({ i }) => {
  const c = BALL_C[i % BALL_C.length];
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`pq0505b${i}`} cx="36%" cy="32%" r="78%">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="100%" stopColor={c.base} />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={`url(#pq0505b${i})`} stroke={c.edge} strokeWidth="1.6" />
      <ellipse cx="8.6" cy="7.6" rx="3" ry="1.9" fill="#fff" opacity=".75" transform="rotate(-28 8.6 7.6)" />
    </svg>
  );
};

// Qo'l — 🖐️ emoji (Dars01 pilot konvensiyasi: qo'l=emoji, robot/personaj=SVG). Ochiq kaft
// koptoklarni ushlaydi; o'ng qo'l .flip bilan ko'zguga aylanadi. Sway animatsiyasi CSS'da.

// Sirk stolchasi (tumba): qizil baraban, oq-krem tik yo'llar, ustki ellips 2 ton.
const Podium = () => (
  <svg viewBox="0 0 130 70" width="118" height="64" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="65" cy="64" rx="52" ry="5" fill="rgba(31,36,48,.10)" />
    <path d="M13 18 L13 50 Q13 62 65 62 Q117 62 117 50 L117 18 Z" fill="#c8473f" stroke="#8f2f29" strokeWidth="1.8" strokeLinejoin="round" />
    <path className="pq-strp" d="M32 24 L32 59 L50 60.5 L50 25 Z" fill="#f6e7d4" opacity=".9" />
    <path className="pq-strp" d="M80 25 L80 60.5 L98 59 L98 24 Z" fill="#f6e7d4" opacity=".9" />
    <ellipse cx="65" cy="18" rx="52" ry="10" fill="#e2665e" stroke="#8f2f29" strokeWidth="1.8" />
    <ellipse cx="65" cy="17" rx="40" ry="6.5" fill="#f0857d" opacity=".8" />
  </svg>
);

// Bayroqcha-gulchambar (sirk kayfiyati uchun, dekorativ).
const Bunting = () => (
  <svg className="pq-bunt" viewBox="0 0 320 24" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 4 Q160 16 320 4" stroke="#c8a06a" strokeWidth="1.6" fill="none" />
    <path className="pq-flag" d="M22 5.5 L38 5.5 L30 19 Z" fill="#d9534b" opacity=".85" />
    <path className="pq-flag" d="M72 7.5 L88 7.5 L80 21 Z" fill="#4f8fc4" opacity=".85" />
    <path className="pq-flag" d="M122 9 L138 9 L130 22.5 Z" fill="#f2b134" opacity=".85" />
    <path className="pq-flag" d="M182 9 L198 9 L190 22.5 Z" fill="#57a84f" opacity=".85" />
    <path className="pq-flag" d="M232 7.5 L248 7.5 L240 21 Z" fill="#d9534b" opacity=".85" />
    <path className="pq-flag" d="M282 5.5 L298 5.5 L290 19 Z" fill="#4f8fc4" opacity=".85" />
  </svg>
);

// Sahna o'lchamlari va koptok uy-joylari (piksel, zoomdan mustaqil).
const W = 344, H = 214, R = 17;                 // sahna kengligi/balandligi, koptok radiusi
const HAND = { L: { x: 66, y: 168 }, R: { x: 278, y: 168 } }; // qo'l markazlari (drop nishoni)
// Koptokning zona bo'yicha uy-markazi (drag paytida kursorga ergashadi).
function homeCenter(i, zone, pos) {
  if (zone === 'C') { const col = i % 2, row = (i / 2) | 0; return { cx: 156 + col * 32, cy: 96 + row * 30 }; } // baraban ustida 2x2 to'da
  return { cx: HAND[zone].x - 16 + pos * 32, cy: 118 }; // qo'l uchida yonma-yon
}

export default function D05_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [balls, setBalls] = useState(() => Array(DATA.total).fill('C')); // 'C' | 'L' | 'R'
  const [drag, setDrag] = useState(null); // { i, x, y } — sudralayotgan koptok (sahna-lokal koord.)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const leftCount = balls.filter((z) => z === 'L').length;
  const rightCount = balls.filter((z) => z === 'R').length;
  const centerCount = DATA.total - leftCount - rightCount;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (typeof sa.left === 'number' && typeof sa.right === 'number') {
        const arr = Array(DATA.total).fill('C');
        let k = 0;
        for (let i = 0; i < sa.left && k < DATA.total; i++) arr[k++] = 'L';
        for (let i = 0; i < sa.right && k < DATA.total; i++) arr[k++] = 'R';
        setBalls(arr);
      }
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hintUneven }); setChecked(true); }
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(centerCount === 0 && !checked); }, [centerCount, checked, onReady]);

  const lock = isReview || checked;

  // Sudrash — pointer + zoom kompensatsiyasi (s = rect.width/offsetWidth; MOBLASH EDIT 7 naqshi).
  const pt = (e) => {
    const el = stageRef.current; const r = el.getBoundingClientRect();
    const s = r.width / (el.offsetWidth || 1);
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };
  const putDrag = (v) => { dragRef.current = v; setDrag(v); };
  const onDown = (i, e) => {
    if (lock) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = pt(e); putDrag({ i, x: p.x, y: p.y }); setFeedback(null);
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const p = pt(e); putDrag({ ...dragRef.current, x: p.x, y: p.y });
  };
  // Drop zonasi — koptok qaysi qo'lga yaqin qo'yildi (100px radius); aks holda markazga qaytadi.
  const zoneAt = (x, y) => {
    const dL = Math.hypot(x - HAND.L.x, y - HAND.L.y);
    const dR = Math.hypot(x - HAND.R.x, y - HAND.R.y);
    if (dL <= dR && dL < 86) return 'L';
    if (dR < dL && dR < 86) return 'R';
    return 'C';
  };
  const onUp = (e) => {
    const d = dragRef.current; if (!d) return;
    const p = pt(e); const zone = zoneAt(p.x, p.y);
    setBalls((prev) => { const nb = [...prev]; nb[d.i] = zone; return nb; });
    putDrag(null);
  };

  const check = useCallback(() => {
    const left = balls.filter((z) => z === 'L').length;
    const right = balls.filter((z) => z === 'R').length;
    if (left + right < DATA.total) { setFeedback({ correct: false, msg: t.hintCenter }); playWrong?.(); return; }
    const correct = left === HALF && right === HALF;
    setFeedback({ correct, msg: correct ? t.correct : t.hintUneven }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [], studentAnswer: { left, right }, correctAnswer: { left: HALF, right: HALF }, correct, meta: { ...DATA } });
  }, [balls, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // Har zonadagi koptoklar tartibi (badge va yonma-yon joylashuv uchun).
  const order = { C: [], L: [], R: [] };
  balls.forEach((z, i) => order[z].push(i));
  const overZone = drag ? zoneAt(drag.x, drag.y) : null; // sudrash paytida qaysi qo'l ustida — highlight uchun

  return (
    <div className="pq pq0505">
      <style>{`
        .pq0505{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0505 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c8473f;text-transform:uppercase;}
        .pq0505 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0505 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0505 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0505 .pq-stage{position:relative;width:${W}px;height:${H}px;margin:0 auto;border-radius:22px;background:linear-gradient(#fff7ec 0%,#fdeff0 100%);border:2px solid #f3dcc8;overflow:hidden;touch-action:none;}
        .pq0505 .pq-bunt{position:absolute;top:5px;left:10px;right:10px;width:calc(100% - 20px);height:24px;pointer-events:none;z-index:1;}
        /* qo'llar — pastda chap/o'ng, drag paytida ustidagi qo'l yorishadi */
        .pq0505 .pq-palm{position:absolute;bottom:8px;font-size:60px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqSway 3.2s ease-in-out infinite;transform-origin:50% 92%;z-index:2;}
        .pq0505 .pq-palm.l{left:34px;} .pq0505 .pq-palm.r{right:34px;}
        .pq0505 .pq-hemoji{display:inline-block;transition:filter .15s,transform .15s;}
        .pq0505 .pq-palm.r .pq-hemoji{transform:scaleX(-1);}
        .pq0505 .pq-palm.over .pq-hemoji{filter:drop-shadow(0 0 6px rgba(242,177,52,.9)) brightness(1.06);transform:translateY(-4px);}
        .pq0505 .pq-palm.r.over .pq-hemoji{transform:scaleX(-1) translateY(-4px);}
        .pq0505 .pq-palm.win{animation:pqHandCele .7s ease 2,pqSway 3.2s ease-in-out 1.4s infinite;}
        .pq0505 .pq-palm.flip{animation-delay:-1.6s;}
        /* baraban (tumba) markazda pastda */
        .pq0505 .pq-pod{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));z-index:2;}
        /* koptoklar — absolyut, drag bilan ko'chadi; bosiladigan/sudraladigan nishonga doimiy siljish yo'q */
        .pq0505 .pq-ball{position:absolute;width:34px;height:34px;line-height:0;cursor:grab;touch-action:none;user-select:none;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.22));transition:left .16s ease,top .16s ease;animation:pqDrop .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0505 .pq-ball.drag{transition:none;z-index:9;cursor:grabbing;filter:drop-shadow(0 6px 6px rgba(0,0,0,.28));}
        .pq0505 .pq-ball.win{animation:pqCele .55s ease both;}
        .pq0505 .pq-ball:disabled{cursor:default;}
        .pq0505 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0505 .pq-flag{transform-box:fill-box;transform-origin:50% 4%;animation:pqFlag 3.4s ease-in-out infinite;}
        .pq0505 .pq-bunt path:nth-child(3){animation-delay:-1.3s;}
        .pq0505 .pq-bunt path:nth-child(4){animation-delay:-2.5s;}
        .pq0505 .pq-bunt path:nth-child(5){animation-delay:-.7s;}
        .pq0505 .pq-bunt path:nth-child(6){animation-delay:-1.9s;}
        .pq0505 .pq-bunt path:nth-child(7){animation-delay:-3.1s;}
        .pq0505 .pq-strp{animation:pqShimr 3.6s ease-in-out infinite;}
        .pq0505 .pq-strp + .pq-strp{animation-delay:-1.8s;}
        .pq0505 .pq-chip{position:absolute;top:34px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both,pqChipFloat 3s ease-in-out .6s infinite;z-index:6;white-space:nowrap;}
        .pq0505 .pq-taphint{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:700;color:#b0693c;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:999px;animation:pqBob 1.8s ease-in-out infinite;z-index:5;white-space:nowrap;}
        .pq0505 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0505 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0505 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-24px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.14);}60%{transform:scale(.94);}100%{transform:scale(1);}}
        @keyframes pqHandCele{0%{transform:rotate(0);}25%{transform:rotate(-6deg) translateY(-4px);}50%{transform:rotate(5deg);}75%{transform:rotate(-3deg);}100%{transform:rotate(0);}}
        @keyframes pqSway{0%,100%{transform:rotate(-1.4deg) scale(1);}50%{transform:rotate(1.4deg) scale(1.045);}}
        @keyframes pqBob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqFlag{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqShimr{0%,100%{opacity:.6;}50%{opacity:1;}}
        @keyframes pqChipFloat{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={stageRef}>
        <div className="pq-bunt"><Bunting /></div>
        {ok && <span className="pq-chip">{leftCount} + {rightCount} = {DATA.total}</span>}

        <div className={'pq-palm l' + (ok ? ' win' : '') + (overZone === 'L' ? ' over' : '')}>
          <span className="pq-hemoji" role="img" aria-label="qo'l">🖐️</span>
        </div>
        <div className={'pq-palm r flip' + (ok ? ' win' : '') + (overZone === 'R' ? ' over' : '')}>
          <span className="pq-hemoji" role="img" aria-label="qo'l">🖐️</span>
        </div>
        <div className="pq-pod"><Podium /></div>

        {balls.map((zone, i) => {
          const dragging = drag && drag.i === i;
          const pos = order[zone].indexOf(i);
          const c = dragging ? { cx: drag.x, cy: drag.y } : homeCenter(i, zone, pos);
          const badge = ok && zone !== 'C' ? (zone === 'L' ? pos + 1 : leftCount + pos + 1) : null;
          return (
            <div key={i} className={'pq-ball' + (dragging ? ' drag' : '') + (ok ? ' win' : '')}
              style={{ left: c.cx - R, top: c.cy - R, animationDelay: `${i * 0.06}s` }}
              onPointerDown={(e) => onDown(i, e)} onPointerMove={onMove} onPointerUp={onUp}
              role="img" aria-label="koptok">
              <Ball i={i} />
              {badge != null && <b className="pq-cnt">{badge}</b>}
            </div>
          );
        })}

        {centerCount > 0 && !lock && <span className="pq-taphint">{t.tapHint}</span>}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
