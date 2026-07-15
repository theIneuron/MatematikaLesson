// Dars14 · Amaliyot 03 — P13 TEEN o'qish «Konfet qutisi» · 🟡 · tag: read_teen
// SHIRINLIK DO'KONI: deraza + quyosh, osma chiroq, peshtaxta. 10 UYALI KONFET QUTISI (2×5, to'la)
// va O'NG tomonida 4 YAKKA konfet toza ustunda. Nechta konfet? → 14.
// Misconception qalqoni: 14 = O'N va TO'RT (to'la quti + yakkalar), "1 va 4" EMAS.
// G'alaba: badge 1..14 (quti 1..10, yakka 11..14), chip «10 + 4 = 14».
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const TEN = 10, ONES = 4, TARGET = 14;
const DATA = { ten: TEN, ones: ONES, target: TARGET, options: [13, 14, 15], ptype: 'P13', level: '🟡', tag: 'read_teen' };

// Konfet o'rami ranglari (palitradan, 2-ton) — sanashda ajralib tursin.
const PAL = [
  { c: '#f2b134', d: '#cd9421' }, // sariq
  { c: '#e2635b', d: '#b13a33' }, // qizil
  { c: '#4f8fc4', d: '#396f9c' }, // ko'k
  { c: '#57a84f', d: '#42813e' }, // yashil
];
const BOXC = Array.from({ length: TEN }).map((_, i) => PAL[i % PAL.length]);
const SINGLES = Array.from({ length: ONES }).map((_, i) => PAL[i % PAL.length]);

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · Teen o'qish", title: "Nechta konfet?",
    setup: "To'la quti — o'nlik. Yonida yakka konfetlar bor.",
    ask: "Hammasi bo'lib nechta konfet bor?",
    correct: "Barakalla! To'la quti o'nta va yana to'rt yakka — o'n to'rt. O'n va to'rt!",
    hint: "Avval to'la qutini o'nlik deb oling, keyin yakkalarni ustiga sanang: o'n, o'n bir, o'n ikki...",
    chip: "10 + 4 = 14",
    ten: "to'la quti", ones: "yakka",
  },
  ru: {
    eyebrow: "Магазин сладостей · Чтение", title: "Сколько конфет?",
    setup: "Полная коробка — это десяток. Рядом отдельные конфеты.",
    ask: "Сколько всего конфет?",
    correct: "Молодец! Полная коробка десять и ещё четыре отдельных — четырнадцать. Десять и четыре!",
    hint: "Сначала возьмите полную коробку как десяток, потом досчитайте отдельные: десять, одиннадцать, двенадцать...",
    chip: "10 + 4 = 14",
    ten: "полная коробка", ones: "отдельные",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KONFET KANONI (yakka birlik): o'ralgan konfet — rangli o'ram, ikki buralgan uchi, oq chiziq + blik.
const Candy = ({ c = PAL[0], w = 28 }) => (
  <svg viewBox="0 0 34 20" width={w} height={(w * 20) / 34} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="7,10 1.5,3.5 3.5,10 1.5,16.5" fill={c.c} stroke={c.d} strokeWidth=".8" strokeLinejoin="round" />
    <polygon points="27,10 32.5,3.5 30.5,10 32.5,16.5" fill={c.c} stroke={c.d} strokeWidth=".8" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="8" fill={c.c} stroke={c.d} strokeWidth="1" />
    <path d="M11.5 4.5 Q9.5 10 11.5 15.5 M22.5 4.5 Q24.5 10 22.5 15.5" fill="none" stroke="#fff" strokeWidth="1.4" opacity=".55" />
    <ellipse cx="14" cy="7.2" rx="3" ry="1.7" fill="#fff" opacity=".4" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_03(props) {
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
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1403">
      <style>{`
        .pq1403{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1403 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c05f8a;text-transform:uppercase;}
        .pq1403 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1403 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1403 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1403 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;}
        /* SHIRINLIK DO'KONI SAHNASI (pushti-krem) */
        .pq1403 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:252px;border-radius:20px;background:linear-gradient(#fdeef4 0%,#fbdde9 58%,#f6cbdb 100%);border:2px solid #eec3d3;overflow:hidden;}
        .pq1403 .pq-fit{position:relative;margin:0 auto;}
        .pq1403 .pq-win{position:absolute;right:16px;top:12px;width:56px;height:44px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #dba7bc;box-shadow:0 0 16px 3px rgba(255,222,236,.8);animation:pqGlow 3.6s ease-in-out infinite;z-index:1;}
        .pq1403 .pq-win::before,.pq1403 .pq-win::after{content:'';position:absolute;background:#dba7bc;}
        .pq1403 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1403 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1403 .pq-sun{position:absolute;right:24px;top:18px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1403 .pq-lamp{position:absolute;left:40px;top:0;width:2px;height:18px;background:#a06078;z-index:1;}
        .pq1403 .pq-lampshade{position:absolute;left:28px;top:16px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        /* osilgan lolipop dekor */
        .pq1403 .pq-lolli{position:absolute;left:120px;top:0;width:2px;height:20px;background:#d29ab0;z-index:1;}
        .pq1403 .pq-lolli b{position:absolute;left:-9px;top:18px;width:20px;height:20px;border-radius:50%;background:repeating-conic-gradient(#e2635b 0 25deg,#fff 25deg 50deg);border:1.5px solid #c8443c;transform-origin:top center;animation:pqSwing 3.2s ease-in-out infinite;box-shadow:0 2px 3px rgba(120,40,70,.22);}
        .pq1403 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:38px;background:linear-gradient(#c78f45,#a86f2c);border-top:3px solid #d9a961;z-index:2;}
        .pq1403 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:rgba(90,58,20,.35);}
        /* KONFET QUTISI (10 uya, to'la) + YAKKA ustun o'ngda */
        .pq1403 .pq-field{position:absolute;left:0;right:0;bottom:28px;display:flex;justify-content:center;align-items:flex-end;gap:24px;z-index:3;}
        .pq1403 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq1403 .pq-box{position:relative;padding:8px 9px 10px;border-radius:12px;background:linear-gradient(#e88aa8,#d16a8c);border:2.5px solid #ad4b6e;box-shadow:0 4px 0 #92395a,0 6px 9px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.3);}
        .pq1403 .pq-grid{display:grid;grid-template-columns:repeat(5,auto);gap:4px;}
        .pq1403 .pq-cell{position:relative;width:34px;height:24px;border-radius:7px;background:rgba(90,25,50,.22);box-shadow:inset 0 2px 4px rgba(0,0,0,.26);display:flex;align-items:center;justify-content:center;}
        .pq1403 .pq-blbl{position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-size:12px;font-weight:900;z-index:5;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq1403 .pq-singles{display:flex;flex-direction:column;gap:5px;align-items:center;}
        .pq1403 .pq-sp{position:relative;animation:pqShimmer 2.8s ease-in-out infinite;}
        .pq1403 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:5;font-variant-numeric:tabular-nums;}
        .pq1403 .pq-cnt.hi{background:#e0872a;}
        .pq1403 .pq-glbl{margin-top:2px;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:900;white-space:nowrap;}
        .pq1403 .pq-glbl.ten{background:#fff;border:2px solid #cf3f38;color:#cf3f38;}
        .pq1403 .pq-glbl.one{background:#fff;border:2px solid #d1912b;color:#b16b12;}
        .pq1403 .pq-q{position:absolute;left:50%;top:-30px;transform:translateX(-50%);font-size:34px;font-weight:900;color:#c05f8a;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqBreath 1.8s ease-in-out infinite;z-index:5;}
        .pq1403 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1403 .pq-star.s2{animation-delay:-.5s;} .pq1403 .pq-star.s3{animation-delay:-1s;}
        /* chip: 10 + 4 = 14 */
        .pq1403 .pq-eqchip{display:flex;justify-content:center;align-items:center;gap:6px;}
        .pq1403 .pq-eqchip b{min-width:36px;height:40px;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;border-radius:12px;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        .pq1403 .pq-eqchip b.ten{background:#fdecec;border:2px solid #cf3f38;color:#cf3f38;}
        .pq1403 .pq-eqchip b.one{background:#fff4e2;border:2px solid #d1912b;color:#b16b12;}
        .pq1403 .pq-eqchip b.sum{background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;}
        .pq1403 .pq-eqchip i{font-style:normal;font-size:21px;font-weight:900;color:#8a94a2;}
        /* variantlar */
        .pq1403 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:4px;}
        .pq1403 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1403 .pq-opt:hover:not(:disabled){border-color:#e88aa8;transform:translateY(-2px);}
        .pq1403 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1403 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1403 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1403 .pq-opt:disabled{cursor:default;}
        .pq1403 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1403 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1403 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 12px 2px rgba(255,222,236,.6);}50%{box-shadow:0 0 20px 5px rgba(255,222,236,.9);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqShimmer{0%,100%{filter:brightness(1);}50%{filter:brightness(1.12);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);opacity:.9;}50%{transform:translateX(-50%) scale(1.14);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 252 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-win" /><span className="pq-sun" />
          <span className="pq-lamp" /><span className="pq-lampshade" />
          <span className="pq-lolli"><b /></span>
          <span className="pq-counter" />

          <div className="pq-field">
            {/* TO'LA QUTI = o'nlik (10 uya, hammasi band) */}
            <div className="pq-group">
              <div className="pq-box">
                {!ok && <span className="pq-blbl">10</span>}
                <div className="pq-grid">
                  {BOXC.map((c, i) => (
                    <span key={i} className="pq-cell">
                      <Candy c={c} w={28} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>{i + 1}</b>}
                    </span>
                  ))}
                </div>
              </div>
              <span className="pq-glbl ten">{ok ? TEN : t.ten}</span>
            </div>

            {/* YAKKA konfetlar — quti O'NG tomonida toza ustun */}
            <div className="pq-group">
              {!ok && <span className="pq-q">?</span>}
              <div className="pq-singles">
                {SINGLES.map((c, i) => (
                  <span key={i} className="pq-sp" style={{ animationDelay: `${-i * 0.5}s` }}>
                    {ok && <b className="pq-cnt hi" style={{ animationDelay: `${0.15 + (TEN + i) * 0.08}s` }}>{TEN + i + 1}</b>}
                    <Candy c={c} w={30} />
                  </span>
                ))}
              </div>
              <span className="pq-glbl one">{ok ? ONES : t.ones}</span>
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '22%', top: '40px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '58%', top: '48px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '80%', top: '36px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>
        </div>

        {ok && (
          <div className="pq-eqchip">
            <b className="ten">{TEN}</b><i>+</i><b className="one">{ONES}</b><i>=</i><b className="sum">{TARGET}</b>
          </div>
        )}

        <div className="pq-opts">
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.target;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
