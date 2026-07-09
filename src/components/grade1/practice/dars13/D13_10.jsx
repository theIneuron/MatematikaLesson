// Dars13 · Amaliyot 10 — NEW «O'nlikni yasab ol» · 🔴 · tag: make_bundle
// Bola sochilgan yakka qalamlarni birma-bir bosib yig'adi (10 katakli tokchaga), aynan 10 ta
// yig'ilganda «Bog'la» faollashadi — bosilganda qizil rezinka o'raladi va DASTA (o'nlik) hosil
// bo'ladi. 10 birlik = 1 o'nlik. Do'kon sahnasi: javon, quyosh-nur, sochilgan qalamlar tebranadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10;
const DATA = { target: 10, ptype: 'NEW', level: '🔴', tag: 'make_bundle' };

// Qalam ranglari (palitradan, 2-ton): sariq / ko'k / yashil / qizil.
const PAL = [
  { main: '#f2b134', dark: '#d3941f' },
  { main: '#4f8fc4', dark: '#3a6f9e' },
  { main: '#57a84f', dark: '#43893c' },
  { main: '#d9534b', dark: '#b23e37' },
];

// 13 sochilgan yakka qalam — 10 tadan bir oz ko'p (bola aynan 10 tasini yig'adi).
// Sahna px (kenglik 372), rot = qiyalik (turgan qalam), c = rang.
const LOOSE = [
  { x: 22,  y: 150, r: -20, c: PAL[0] },
  { x: 56,  y: 168, r: 14,  c: PAL[1] },
  { x: 92,  y: 146, r: -8,  c: PAL[2] },
  { x: 128, y: 170, r: 22,  c: PAL[3] },
  { x: 164, y: 148, r: -16, c: PAL[0] },
  { x: 200, y: 172, r: 10,  c: PAL[1] },
  { x: 236, y: 146, r: -22, c: PAL[2] },
  { x: 272, y: 168, r: 18,  c: PAL[3] },
  { x: 306, y: 150, r: -6,  c: PAL[0] },
  { x: 74,  y: 190, r: 26,  c: PAL[2] },
  { x: 150, y: 194, r: -12, c: PAL[3] },
  { x: 226, y: 192, r: 16,  c: PAL[1] },
  { x: 300, y: 188, r: -24, c: PAL[0] },
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Yasab ol", title: "O'nlikni yasab ol",
    setup: "Peshtaxtada yakka qalamlar sochilgan. O'nta qalamni yig'ib, bir dasta (o'nlik) yasang!",
    ask: "Qalamlarni bosib o'nta yig'ing, keyin dastani bog'lang.",
    correct: "Barakalla! O'nta qalam — bir dasta. O'nlikni o'zingiz yasadingiz!",
    hint: "Aynan o'nta qalam kerak. Yig'ilganlarni sanang.",
    board: "O'nlikni yasab ol",
    tapHint: "Qalamlarni bosing",
    chip: "10 qalam = 1 dasta",
    btnBind: "Bog'la",
  },
  ru: {
    eyebrow: 'Магазин карандашей · Собери', title: 'Сделай десяток',
    setup: 'На прилавке рассыпаны отдельные карандаши. Собери десять карандашей и сделай пучок (десяток)!',
    ask: 'Нажимай на карандаши — собери десять, потом свяжи пучок.',
    correct: 'Молодец! Десять карандашей — один пучок. Десяток ты сделал сам!',
    hint: 'Нужно ровно десять карандашей. Пересчитай собранные.',
    board: 'Сделай десяток',
    tapHint: 'Нажимай на карандаши',
    chip: '10 каранд. = 1 пучок',
    btnBind: 'Свяжи',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (birlik): tik yog'och qalam — 2-ton tana + blik, uchida yog'och konus + qora grafit
// uchi, orqasida metall halqa + pushti o'chirg'ich. Bitta qalam = bitta birlik. Rang palitradan.
const Pencil = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 16 60" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ display: 'block' }}>
    {/* grafit uchi */}
    <polygon points="8,1.5 5.7,8 10.3,8" fill="#2f2b28" />
    {/* yog'och konus (yo'nilgan) */}
    <polygon points="8,3.6 4,14 12,14" fill="#eed2a4" stroke="#c9ad7e" strokeWidth="0.7" strokeLinejoin="round" />
    {/* tana — 2-ton + blik */}
    <rect x="4" y="13.5" width="8" height="32" fill={c.main} />
    <rect x="4" y="13.5" width="2.7" height="32" fill={c.dark} />
    <rect x="9.5" y="13.5" width="1.5" height="32" fill="#ffffff" opacity="0.32" />
    <rect x="4" y="13.5" width="8" height="32" fill="none" stroke={c.dark} strokeWidth="0.6" opacity="0.5" />
    {/* metall halqa */}
    <rect x="3.6" y="45" width="8.8" height="6" fill="#cfd3d9" stroke="#a2a8b0" strokeWidth="0.6" />
    <line x1="3.6" y1="47.4" x2="12.4" y2="47.4" stroke="#a2a8b0" strokeWidth="0.6" />
    <line x1="3.6" y1="49" x2="12.4" y2="49" stroke="#a2a8b0" strokeWidth="0.6" />
    {/* pushti o'chirg'ich */}
    <rect x="4.3" y="50.2" width="7.4" height="7" rx="2.4" fill="#f2a9c0" stroke="#d97fa0" strokeWidth="0.7" />
    <rect x="5" y="51" width="2" height="4.6" rx="1" fill="#ffffff" opacity="0.4" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D13_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [order, setOrder] = useState([]); // yig'ilgan yakka-qalam indekslari (tartib bilan)
  const [bound, setBound] = useState(false); // rezinka o'raldimi (dasta hosil bo'ldimi)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda yig'ish/bog'lash qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const collected = order.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const c = initialAnswer.studentAnswer.collected;
      const n = typeof c === 'number' ? Math.max(0, Math.min(c, TEN)) : TEN;
      setOrder(Array.from({ length: n }, (_, k) => k));
      setBound(true);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(bound && !checked); }, [bound, checked, onReady]);

  const lock = isReview || checked;
  const take = (i) => {
    if (lock || bound || order.length >= TEN || order.includes(i)) return;
    setOrder((prev) => [...prev, i]);
  };
  const bind = () => {
    if (lock || bound || order.length !== TEN) return;
    setBound(true);
  };

  const check = useCallback(() => {
    if (!bound) return;
    const c = order.length;
    const correct = c === TEN;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(TEN)], studentAnswer: { collected: c }, correctAnswer: { collected: TEN }, correct, meta: { ...DATA } });
  }, [order, bound, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1310">
      <style>{`
        .pq1310{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1310 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a1e;text-transform:uppercase;}
        .pq1310 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1310 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1310 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1310 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#fbe9cf,#f4dcb4);border:2px solid #e9d3a6;}
        .pq1310 .pq-scene{position:relative;width:372px;max-width:100%;height:250px;border-radius:18px;background:linear-gradient(#fdf1d8 0%,#f7e2be 55%,#efd2a4 100%);border:2px solid #e6cfa0;overflow:hidden;}
        .pq1310 .pq-beam{position:absolute;top:-20px;right:44px;width:78px;height:210px;background:linear-gradient(180deg,rgba(255,241,196,.7),rgba(255,241,196,0));transform:rotate(15deg);transform-origin:top center;z-index:1;animation:pqBeam 4.5s ease-in-out infinite;pointer-events:none;}
        .pq1310 .pq-window{position:absolute;top:11px;right:13px;width:54px;height:42px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #b58a4e;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1310 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b58a4e;transform:translateX(-1px);}
        .pq1310 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#b58a4e;transform:translateY(-1px);}
        .pq1310 .pq-sun{position:absolute;top:18px;left:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1310 .pq-board{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:6px 15px 7px;border-radius:10px;background:linear-gradient(#c98a4e,#a86c34);border:2.5px solid #7f5326;color:#fdf3e2;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1310 .pq-board::before,.pq1310 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#7f5326;}
        .pq1310 .pq-board::before{left:18px;} .pq1310 .pq-board::after{right:18px;}
        /* yig'ilish zonasi — 10 katakli yog'och tokcha */
        .pq1310 .pq-rackw{position:absolute;top:44px;left:50%;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq1310 .pq-rackw.win{animation:pqCele .6s ease;}
        .pq1310 .pq-rtag{padding:1px 12px;border-radius:9px;background:#fff;color:#c07a1e;font-size:12px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(0,0,0,.14);letter-spacing:.02em;transition:.15s;}
        .pq1310 .pq-rtag.full{background:#2f6f3a;color:#fff;}
        .pq1310 .pq-rack{position:relative;display:flex;gap:3px;padding:7px 9px 8px;border-radius:11px;background:linear-gradient(#f4e2c1,#e9cfa0);border:2px solid #cfa96a;box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 3px 5px rgba(0,0,0,.12);}
        .pq1310 .pq-cell{position:relative;width:15px;height:56px;border-radius:3px;display:flex;align-items:flex-end;justify-content:center;box-sizing:border-box;}
        .pq1310 .pq-cell.empty{border:1.5px dashed #cdb488;background:rgba(255,253,246,.55);animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1310 .pq-cell:nth-child(2).empty{animation-delay:-.4s;} .pq1310 .pq-cell:nth-child(4).empty{animation-delay:-.9s;}
        .pq1310 .pq-cell:nth-child(6).empty{animation-delay:-1.4s;} .pq1310 .pq-cell:nth-child(8).empty{animation-delay:-1.9s;}
        .pq1310 .pq-rpen{position:relative;width:15px;height:54px;display:block;}
        .pq1310 .pq-rpen.pop{animation:pqFill .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1310 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:14px;height:14px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:7;}
        /* qizil rezinka — dasta bog'langanda o'raladi */
        .pq1310 .pq-band{position:absolute;left:5px;right:5px;top:29px;height:11px;border-radius:3px;background:linear-gradient(#e2635b,#c8443c);border:1.5px solid #a5352e;box-shadow:0 1px 2px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.35);z-index:5;transform-origin:center;animation:pqBandIn .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1310 .pq-scene.still .pq-band{animation:none;}
        .pq1310 .pq-chip{position:absolute;top:32px;left:50%;transform:translateX(-50%);z-index:8;font-size:15px;font-weight:900;color:#1a7f43;background:#fff;padding:4px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.24);white-space:nowrap;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        /* javon (peshtaxta) */
        .pq1310 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c98a4e,#a86c34 60%,#8f5a2a);border-top:3px solid #d9a463;z-index:1;}
        .pq1310 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.22);}
        /* sochilgan yakka qalamlar */
        .pq1310 .pq-loose{position:absolute;width:20px;height:56px;padding:0;border:none;background:none;cursor:pointer;line-height:0;z-index:3;transition:transform .16s,opacity .35s;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1310 .pq-loose:hover:not(:disabled){transform:translateY(-4px) scale(1.07);}
        .pq1310 .pq-loose:disabled{cursor:default;}
        .pq1310 .pq-loose.gone{opacity:0;transform:scale(.3) translateY(-26px);pointer-events:none;}
        .pq1310 .pq-scene.still .pq-loose.gone{display:none;}
        /* Bosiladigan qalam — quti joyi qimirlamaydi (tap aniq tegsin); jonlilik uchun yumshoq yorug'lik pulsi. */
        .pq1310 .pq-lbob{display:block;width:100%;height:100%;animation:pqShimmer 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq1310 .pq-scene.still .pq-lbob{animation:none;}
        .pq1310 .pq-lpen{display:block;width:100%;height:100%;transform:rotate(var(--r,0deg));transform-origin:50% 100%;}
        .pq1310 .pq-taphint{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);z-index:5;font-size:12px;font-weight:800;color:#8a5a1e;background:rgba(255,255,255,.82);padding:3px 12px;border-radius:999px;white-space:nowrap;animation:pqBreathHint 2s ease-in-out infinite;}
        .pq1310 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1310 .pq-wstar.w2{animation-delay:-.5s;} .pq1310 .pq-wstar.w3{animation-delay:-1.05s;}
        /* Bog'la tugmasi */
        .pq1310 .pq-bind{padding:9px 28px;border-radius:14px;border:2.5px solid #2f6f3a;background:linear-gradient(#3f9a4e,#2f7d3c);color:#fff;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #235c2c;transition:.12s;font-family:inherit;letter-spacing:.02em;}
        .pq1310 .pq-bind:hover:not(:disabled){transform:translateY(-2px);}
        .pq1310 .pq-bind:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #235c2c;}
        .pq1310 .pq-bind:disabled{background:#ded8ca;border-color:#c3bdb0;color:#8f8a7f;box-shadow:0 3px 0 #c3bdb0;cursor:default;}
        .pq1310 .pq-bind.ready{animation:pqPulseBtn 1.4s ease-in-out infinite;}
        .pq1310 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1310 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1310 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBeam{0%,100%{opacity:.55;}50%{opacity:.85;}}
        @keyframes pqShimmer{0%,100%{filter:brightness(1);}50%{filter:brightness(1.1);}}
        @keyframes pqFill{0%{opacity:0;transform:translateY(-14px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#cdb488;}50%{transform:scale(1.06);border-color:#c09a58;}}
        @keyframes pqBandIn{0%{opacity:0;transform:scaleX(.08);}100%{opacity:1;transform:scaleX(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqBreathHint{0%,100%{transform:translateX(-50%) scale(1);opacity:.9;}50%{transform:translateX(-50%) scale(1.05);opacity:1;}}
        @keyframes pqPulseBtn{0%,100%{transform:translateY(0);box-shadow:0 3px 0 #235c2c;}50%{transform:translateY(-2px);box-shadow:0 5px 13px rgba(47,125,60,.42);}}
        @keyframes pqCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.05);}60%{transform:translateX(-50%) scale(.97);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-beam" />
          <span className="pq-window" />
          <span className="pq-sun" />
          <div className="pq-board">{t.board}</div>

          {/* yig'ilish zonasi — 10 katakli tokcha; g'alabada 1..10 sanoq-badge */}
          <div className={'pq-rackw' + (ok ? ' win' : '')}>
            {!ok && <span className={'pq-rtag' + (collected === TEN ? ' full' : '')}>{collected} / {TEN}</span>}
            {ok && <span className="pq-chip">{t.chip}</span>}
            <div className="pq-rack">
              {Array.from({ length: TEN }).map((_, k) => {
                const filled = k < collected;
                const col = filled ? LOOSE[order[k]].c : PAL[0];
                return (
                  <span key={k} className={'pq-cell' + (filled ? '' : ' empty')}>
                    {filled && (
                      <span className={'pq-rpen' + (still ? '' : ' pop')} style={still ? undefined : { animationDelay: '0s' }}>
                        <Pencil c={col} />
                        {ok && <b className="pq-cnt">{k + 1}</b>}
                      </span>
                    )}
                  </span>
                );
              })}
              {bound && <span className="pq-band" />}
            </div>
          </div>

          <span className="pq-shelf" />

          {/* sochilgan yakka qalamlar — bosilganda tokchaga o'tadi */}
          {LOOSE.map((p, i) => {
            const taken = order.includes(i);
            return (
              <button key={i} type="button"
                className={'pq-loose' + (taken ? ' gone' : '')}
                style={{ left: p.x, top: p.y }}
                disabled={lock || bound || taken || collected >= TEN}
                onClick={() => take(i)} aria-label="qalam">
                <span className="pq-lbob" style={{ '--d': `${-i * 0.24}s` }}>
                  <span className="pq-lpen" style={{ '--r': `${p.r}deg` }}><Pencil c={p.c} /></span>
                </span>
              </button>
            );
          })}

          {!lock && !bound && collected < TEN && <span className="pq-taphint">{t.tapHint}</span>}

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '30%', top: '40px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '64%', top: '46px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '30px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>

        {!bound && (
          <button type="button" className={'pq-bind' + (collected === TEN ? ' ready' : '')} disabled={collected !== TEN || lock} onClick={bind}>{t.btnBind}</button>
        )}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
