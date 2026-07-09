// Dars14 · Amaliyot 05 — P13 TEEN ajratish «14 = 10 + ?» · 🔴 · tag: decompose_teen
// 14 qalam = 1 DASTA (10, rezinka bilan) + 4 YAKKA qalam. Dasta alohida, yakka qalamlar alohida.
// Savol: 14 = 10 + [?] → 4. G'alaba: "?" o'rniga yashil 4, chip «14 = 10 + 4», yakka qalamlar 1..4 badge.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUM = 14, TEN = 10, ONES = 4;
const DATA = { num: NUM, ten: TEN, ans: ONES, options: [3, 4, 5], ptype: 'P13', level: '🔴', tag: 'decompose_teen' };

// Qalam tanasi rang palitrasi (sariq / qizil / ko'k / yashil — 2 ton).
const PAL = [
  { body: '#f2b134', light: '#f9ce74' }, // sariq
  { body: '#e2635b', light: '#ef938c' }, // qizil
  { body: '#4a90d9', light: '#82b2e5' }, // ko'k
  { body: '#57a84f', light: '#88c581' }, // yashil
];
// Dastadagi 10 qalam rangi (aylanma).
const BUNDLE = Array.from({ length: TEN }).map((_, i) => PAL[i % PAL.length]);
// Yakka 4 qalam rangi (aylanma).
const SINGLES = Array.from({ length: ONES }).map((_, i) => PAL[i % PAL.length]);

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Ajratish", title: "14 = 10 + ?",
    setup: "Peshtaxtada bir dasta qalam va yonida yakka qalamlar turibdi. Dasta — o'nlik, rezinka bilan bog'langan.",
    ask: "O'n va yana nechta? 14 = 10 + ?",
    correct: "Barakalla! Bir dasta — o'nta, yonida to'rtta yakka qalam. 14 — bu 10 va 4!",
    hint: "Dastani sanamang — u o'nlik. Faqat yonidagi yakka qalamlarni sanang.",
    chip: `${NUM} = ${TEN} + ${ONES}`,
    ten10: "10", tenlbl: "dasta",
  },
  ru: {
    eyebrow: "Магазин карандашей · Разбей", title: "14 = 10 + ?",
    setup: "На прилавке пучок карандашей и рядом отдельные карандаши. Пучок — десяток, связан резинкой.",
    ask: "Десять и ещё сколько? 14 = 10 + ?",
    correct: "Молодец! Пучок — десять, рядом четыре отдельных карандаша. 14 — это 10 и 4!",
    hint: "Пучок не считай — это десяток. Сосчитай только отдельные карандаши рядом.",
    chip: `${NUM} = ${TEN} + ${ONES}`,
    ten10: "10", tenlbl: "пучок",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uch + yog'och konus,
// rangli tana (2-ton, chap yorug'lik strip), metall halqa, pushti o'chirg'ich.
const Pencil = ({ c, w = 18 }) => (
  <svg viewBox="0 0 22 92" width={w} height={w * 92 / 22} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="11,2.5 8.6,11 13.4,11" fill="#2f2f33" />
    <polygon points="8.6,11 13.4,11 16.4,23 5.6,23" fill="#e8c187" stroke="#c69a58" strokeWidth=".8" strokeLinejoin="round" />
    <polygon points="8.6,11 10.9,11 8.5,23 5.6,23" fill="#f2d6a4" />
    <rect x="5.6" y="22.5" width="10.8" height="50.5" rx=".6" fill={c.body} />
    <rect x="5.6" y="22.5" width="3.6" height="50.5" rx=".6" fill={c.light} />
    <rect x="5.6" y="22.5" width="10.8" height="50.5" rx=".6" fill="none" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <rect x="5.1" y="72.5" width="11.8" height="7" rx="1" fill="#cfd3da" stroke="#a7adb8" strokeWidth=".8" />
    <line x1="5.4" y1="75" x2="16.6" y2="75" stroke="#a7adb8" strokeWidth=".7" />
    <line x1="5.4" y1="77.4" x2="16.6" y2="77.4" stroke="#a7adb8" strokeWidth=".7" />
    <rect x="5.8" y="79" width="10.4" height="9.6" rx="2.6" fill="#f4a9bb" stroke="#db8398" strokeWidth=".8" />
    <rect x="5.8" y="79" width="3.6" height="9.6" rx="2.6" fill="#f8c6d1" />
    <circle cx="8" cy="34" r="1.3" fill="#fff" opacity=".5" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.ans;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.ans }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1405">
      <style>{`
        .pq1405{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1405 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1405 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1405 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1405 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1405 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        .pq1405 .pq-scene{position:relative;width:392px;max-width:100%;height:250px;border-radius:20px;background:linear-gradient(#fdf3db 0%,#f8e6ba 58%,#f2d79f 100%);border:2px solid #e6cf9a;overflow:hidden;}
        /* dekor: deraza + quyosh + osma chiroq */
        .pq1405 .pq-win{position:absolute;right:16px;top:14px;width:58px;height:44px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d8b878;box-shadow:0 0 16px 3px rgba(255,239,178,.7);animation:pqGlow 3.6s ease-in-out infinite;}
        .pq1405 .pq-win::before,.pq1405 .pq-win::after{content:'';position:absolute;background:#d8b878;}
        .pq1405 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1405 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1405 .pq-sun{position:absolute;right:24px;top:20px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq1405 .pq-lamp{position:absolute;left:40px;top:0;width:2px;height:18px;background:#8a5628;}
        .pq1405 .pq-lampsh{position:absolute;left:28px;top:16px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;box-shadow:0 10px 22px 6px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        /* osilgan narx yorlig'i (raqamsiz) */
        .pq1405 .pq-tag{position:absolute;left:150px;top:0;width:2px;height:18px;background:#c9a463;}
        .pq1405 .pq-tag b{position:absolute;left:-15px;top:16px;width:30px;height:18px;border-radius:5px 5px 5px 0;background:#f4b64a;border:1.5px solid #d1912b;transform-origin:top center;animation:pqSwing 3.2s ease-in-out infinite;box-shadow:0 2px 3px rgba(120,80,30,.22);}
        .pq1405 .pq-tag b::after{content:'';position:absolute;left:5px;top:6px;right:5px;height:2px;background:#d1912b;border-radius:2px;box-shadow:0 4px 0 #d1912b;}
        /* peshtaxta */
        .pq1405 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#c78f45,#a86f2c);border-top:3px solid #d9a961;}
        .pq1405 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:rgba(90,58,20,.35);}
        /* model qatori: dasta | + | yakka qalamlar */
        .pq1405 .pq-model{position:absolute;left:0;right:0;bottom:30px;display:flex;justify-content:center;align-items:flex-end;gap:14px;}
        /* dasta (o'nlik) */
        .pq1405 .pq-bundle{position:relative;display:inline-flex;align-items:flex-end;gap:1px;padding:0 2px;filter:drop-shadow(0 4px 4px rgba(120,80,30,.28));}
        .pq1405 .pq-bp{position:relative;transform-origin:bottom center;animation:pqSway 2.8s ease-in-out infinite alternate;}
        .pq1405 .pq-band{position:absolute;left:-5px;right:-5px;top:44%;height:14px;border-radius:8px;background:linear-gradient(#e2685f,#c8362c 55%,#a82a22);border:1.5px solid #922019;box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 2px 3px rgba(0,0,0,.22);z-index:3;}
        .pq1405 .pq-band::after{content:'';position:absolute;left:44%;top:2px;width:8px;height:10px;border-radius:3px;background:linear-gradient(#e2685f,#b52f26);border:1.5px solid #922019;transform:rotate(8deg);}
        .pq1405 .pq-tenlbl{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.16);z-index:4;font-variant-numeric:tabular-nums;}
        /* plus belgisi model ichida */
        .pq1405 .pq-plus{font-size:26px;font-weight:900;color:#a06a2e;padding-bottom:22px;}
        /* yakka qalamlar guruhi */
        .pq1405 .pq-singles{position:relative;display:inline-flex;align-items:flex-end;gap:6px;padding:0 4px;}
        .pq1405 .pq-sp{position:relative;transform-origin:bottom center;animation:pqSway 3s ease-in-out infinite alternate;}
        .pq1405 .pq-cnt{position:absolute;top:-13px;left:50%;transform:translateX(-50%);min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:5;}
        .pq1405 .pq-q{position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:34px;font-weight:900;color:#c77d2e;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqBreath 1.8s ease-in-out infinite;z-index:5;}
        .pq1405 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1405 .pq-star.s2{animation-delay:-.5s;} .pq1405 .pq-star.s3{animation-delay:-1s;}
        /* tenglama satri */
        .pq1405 .pq-eq{display:flex;justify-content:center;align-items:center;gap:7px;}
        .pq1405 .pq-eq b{min-width:40px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1405 .pq-eq b.num{background:#eef3fd;border-color:#c3d4ee;color:#2f5ca8;}
        .pq1405 .pq-eq b.hole{background:#fff;border:2.5px dashed #c9a463;color:#c77d2e;}
        .pq1405 .pq-eq b.ans{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1405 .pq-eq i{font-style:normal;font-size:22px;font-weight:900;color:#8a94a2;}
        /* chip */
        .pq1405 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:999px;background:#fef3d8;border:2px solid #f0c877;color:#8a5a12;font-size:16px;font-weight:800;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        /* variantlar */
        .pq1405 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:2px;}
        .pq1405 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1405 .pq-opt:hover:not(:disabled){border-color:#f0c877;transform:translateY(-2px);}
        .pq1405 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1405 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1405 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1405 .pq-opt:disabled{cursor:default;}
        .pq1405 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1405 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1405 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 12px 2px rgba(255,239,178,.55);}50%{box-shadow:0 0 20px 5px rgba(255,239,178,.85);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqSway{0%{transform:rotate(-2deg);}100%{transform:rotate(2deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);opacity:.9;}50%{transform:translateX(-50%) scale(1.14);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-lamp" /><span className="pq-lampsh" />
          <span className="pq-win" /><span className="pq-sun" />
          <span className="pq-tag"><b /></span>
          <span className="pq-counter" />

          <div className="pq-model">
            {/* DASTA — o'nlik, rezinka bilan bog'langan, "10" yorlig'i */}
            <div className="pq-bundle">
              <span className="pq-tenlbl">{t.ten10}</span>
              {BUNDLE.map((c, i) => (
                <span key={i} className="pq-bp" style={{ animationDelay: `${-i * 0.2}s` }}>
                  <Pencil c={c} w={15} />
                </span>
              ))}
              <span className="pq-band" />
            </div>

            <span className="pq-plus">+</span>

            {/* YAKKA qalamlar — birliklar, alohida turadi */}
            <div className="pq-singles">
              {!ok && <span className="pq-q">?</span>}
              {SINGLES.map((c, i) => (
                <span key={i} className="pq-sp" style={{ animationDelay: `${-i * 0.24}s` }}>
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>{i + 1}</b>}
                  <Pencil c={c} w={20} />
                </span>
              ))}
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '20%', top: '44px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '58%', top: '52px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '82%', top: '38px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {/* tenglama: 14 = 10 + [?] */}
        <div className="pq-eq">
          <b className="num">{NUM}</b>
          <i>=</i>
          <b>{TEN}</b>
          <i>+</i>
          {ok ? <b className="ans">{ONES}</b> : <b className="hole">?</b>}
        </div>

        {ok && <span className="pq-chip">{t.chip}</span>}

        <div className="pq-opts">
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.ans;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
