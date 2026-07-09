// Dars14 · Amaliyot 02 — P13 TEEN o'qish «Dasta va yakka» · 🟡 · tag: read_teen
// Peshtaxtada 1 DASTA (o'nlik, rezinkali) va 1 YAKKA qalam. Jami nechta? → 11.
// Dasta va yakka VIZUAL ajratilgan. G'alaba: dasta 1..10 sanaladi, yakka 11-badge, chip «10 + 1 = 11».
// Misconception qalqoni: 11 = O'N va BIR (dasta + yakka), «1 va 1» EMAS.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10, ONES = 1, TARGET = 11;
const DATA = { ten: TEN, ones: ONES, target: TARGET, options: [10, 11, 12], ptype: 'P13', level: '🟡', tag: 'read_teen' };

// Qalam tanasi rang palitrasi (sariq / qizil / ko'k / yashil — aylanma, sanashda ajralib tursin).
const PAL = [
  { body: '#f2b134', light: '#f8ce76' }, // sariq
  { body: '#e2635b', light: '#ef918b' }, // qizil
  { body: '#4a90d9', light: '#82b2dd' }, // ko'k
  { body: '#57a84f', light: '#86c47f' }, // yashil
];
const BUNDLE = Array.from({ length: TEN }).map((_, i) => PAL[i % PAL.length]);
const ONE = PAL[3]; // yakka qalam — yashil, dastadan ajralib tursin

const T = {
  uz: {
    eyebrow: "Qalam do'koni · O'qish", title: 'Jami nechta qalam?',
    setup: 'Peshtaxtada bir dasta qalam va yana bitta yakka qalam turibdi.',
    ask: 'Jami nechta qalam bor?',
    correct: "Barakalla! Bir dasta — o'n, va yana bir yakka. O'n va bir — o'n bir!",
    hint: 'Dastada o\'nta qalam bor. Ustiga bitta yakka qalamni qo\'shsangiz, nechta bo\'ladi?',
    chip: '10 + 1 = 11',
    bundleLbl: '10', dastaCap: 'dasta', yakkaCap: 'yakka',
  },
  ru: {
    eyebrow: 'Магазин карандашей · Чтение', title: 'Сколько всего карандашей?',
    setup: 'На прилавке лежит один пучок карандашей и ещё один отдельный карандаш.',
    ask: 'Сколько всего карандашей?',
    correct: 'Молодец! Один пучок — десять, и ещё один отдельный. Десять и один — одиннадцать!',
    hint: 'В пучке десять карандашей. Добавь один отдельный — сколько получится?',
    chip: '10 + 1 = 11',
    bundleLbl: '10', dastaCap: 'пучок', yakkaCap: 'отдельный',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uch + yog'och konus, rangli tana (2-ton) +
// blik, metall halqa, pushti o'chirg'ich. Bitta qalam = bitta birlik.
const Pencil = ({ c, w = 20 }) => (
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

export default function D14_02(props) {
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

  return (
    <div className="pq pq1402">
      <style>{`
        .pq1402{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1402 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1402 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1402 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1402 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1402 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;}
        .pq1402 .pq-scene{position:relative;width:372px;max-width:100%;height:250px;border-radius:20px;background:linear-gradient(#fdf3db 0%,#f8e6ba 58%,#f2d79f 100%);border:2px solid #e6cf9a;overflow:hidden;}
        /* deraza + quyosh */
        .pq1402 .pq-win{position:absolute;right:16px;top:14px;width:60px;height:46px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d8b878;box-shadow:0 0 16px 3px rgba(255,239,178,.7);animation:pqGlow 3.6s ease-in-out infinite;}
        .pq1402 .pq-win::before,.pq1402 .pq-win::after{content:'';position:absolute;background:#d8b878;}
        .pq1402 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1402 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1402 .pq-sun{position:absolute;right:24px;top:20px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        /* osma chiroq nur */
        .pq1402 .pq-lamp{position:absolute;left:40px;top:0;width:2px;height:18px;background:#8a5628;}
        .pq1402 .pq-lampshade{position:absolute;left:28px;top:16px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;box-shadow:0 10px 22px 6px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        /* osilgan narx yorlig'i (raqamsiz, tebranadi) */
        .pq1402 .pq-tag{position:absolute;left:132px;top:0;width:2px;height:20px;background:#c9a463;}
        .pq1402 .pq-tag b{position:absolute;left:-15px;top:18px;width:32px;height:20px;border-radius:5px 5px 5px 0;background:#f4b64a;border:1.5px solid #d1912b;transform-origin:top center;animation:pqSwing 3.2s ease-in-out infinite;box-shadow:0 2px 3px rgba(120,80,30,.22);}
        .pq1402 .pq-tag b::after{content:'';position:absolute;left:5px;top:6px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #d1912b;}
        /* peshtaxta */
        .pq1402 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#c78f45,#a86f2c);border-top:3px solid #d9a961;}
        .pq1402 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:rgba(90,58,20,.35);}
        /* dasta + yakka joylashuvi */
        .pq1402 .pq-groups{position:absolute;left:0;right:0;bottom:26px;display:flex;align-items:flex-end;justify-content:center;gap:34px;}
        .pq1402 .pq-grp{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        /* dasta */
        .pq1402 .pq-bundlearea{position:relative;display:inline-block;filter:drop-shadow(0 4px 4px rgba(120,80,30,.28));}
        .pq1402 .pq-bundle{display:flex;align-items:flex-end;gap:1px;transition:gap .55s cubic-bezier(.3,1,.5,1);}
        .pq1402 .pq-bundle.spread{gap:6px;}
        .pq1402 .pq-pw{position:relative;transform-origin:bottom center;animation:pqSway 2.8s ease-in-out infinite alternate;}
        .pq1402 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:18px;height:18px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:4;}
        .pq1402 .pq-cnt.big{min-width:22px;height:22px;font-size:12.5px;background:#1a7f43;top:-13px;}
        /* rezinka band + 10 yorlig'i */
        .pq1402 .pq-band{position:absolute;left:-5px;right:-5px;top:46%;height:14px;border-radius:8px;background:linear-gradient(#e2685f,#c8362c 55%,#a82a22);border:1.5px solid #922019;box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 2px 3px rgba(0,0,0,.22);z-index:3;}
        .pq1402 .pq-band::after{content:'';position:absolute;left:44%;top:2px;width:9px;height:10px;border-radius:3px;background:linear-gradient(#e2685f,#b52f26);border:1.5px solid #922019;transform:rotate(8deg);}
        .pq1402 .pq-tenlbl{position:absolute;top:44%;left:50%;transform:translate(-50%,-1px);z-index:4;color:#fff;font-size:11px;font-weight:900;text-shadow:0 1px 2px rgba(0,0,0,.35);pointer-events:none;}
        /* guruh yozuvi (dasta / yakka) */
        .pq1402 .pq-cap{font-size:12px;font-weight:800;color:#8a5a12;letter-spacing:.02em;text-transform:uppercase;background:#fef3d8;border:1.5px solid #f0c877;border-radius:999px;padding:2px 10px;}
        .pq1402 .pq-cap.one{color:#3f7a38;background:#e9f6e7;border-color:#a9d3a2;}
        /* yakka joyi qimirlamasin — faqat shimmer */
        .pq1402 .pq-single{position:relative;transform-origin:bottom center;animation:pqShimmer 2.6s ease-in-out infinite;}
        /* savol belgisi */
        .pq1402 .pq-q{position:absolute;left:50%;top:-6px;transform:translateX(-50%);font-size:34px;font-weight:900;color:#c77d2e;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqBreath 1.8s ease-in-out infinite;z-index:5;}
        .pq1402 .pq-plus{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);font-size:26px;font-weight:900;color:#b06a1f;opacity:.55;z-index:4;}
        .pq1402 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1402 .pq-star.s2{animation-delay:-.5s;} .pq1402 .pq-star.s3{animation-delay:-1s;}
        /* chip + AnsPop */
        .pq1402 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:999px;background:#fef3d8;border:2px solid #f0c877;color:#8a5a12;font-size:16px;font-weight:900;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        .pq1402 .pq-anspop{position:absolute;left:50%;top:-4px;transform:translateX(-50%);background:#1a7f43;color:#fff;font-size:20px;font-weight:900;padding:4px 14px;border-radius:999px;box-shadow:0 4px 10px rgba(26,127,67,.35);font-variant-numeric:tabular-nums;animation:pqPop .4s ease both;z-index:7;}
        /* variantlar */
        .pq1402 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:4px;}
        .pq1402 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1402 .pq-opt:hover:not(:disabled){border-color:#f0c877;transform:translateY(-2px);}
        .pq1402 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1402 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1402 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1402 .pq-opt:disabled{cursor:default;}
        .pq1402 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1402 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1402 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 12px 2px rgba(255,239,178,.55);}50%{box-shadow:0 0 20px 5px rgba(255,239,178,.85);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqSway{0%{transform:rotate(-2deg);}100%{transform:rotate(2deg);}}
        @keyframes pqShimmer{0%,100%{filter:brightness(1);}50%{filter:brightness(1.12);}}
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
          <span className="pq-lamp" /><span className="pq-lampshade" />
          <span className="pq-win" /><span className="pq-sun" />
          <span className="pq-tag"><b /></span>
          <span className="pq-counter" />

          {ok && <span className="pq-anspop">{TARGET}</span>}
          {!ok && <span className="pq-q">?</span>}
          {!ok && <span className="pq-plus">+</span>}

          <div className="pq-groups">
            {/* DASTA — o'nlik, rezinkali guruh */}
            <div className="pq-grp">
              <div className="pq-bundlearea">
                <div className={'pq-bundle' + (ok ? ' spread' : '')}>
                  {BUNDLE.map((c, i) => (
                    <span key={i} className="pq-pw" style={{ animationDelay: `${-i * 0.22}s` }}>
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${0.12 + i * 0.08}s` }}>{i + 1}</b>}
                      <Pencil c={c} w={19} />
                    </span>
                  ))}
                </div>
                {!ok && <span className="pq-band" />}
                {!ok && <span className="pq-tenlbl">{t.bundleLbl}</span>}
              </div>
              <span className="pq-cap">{t.dastaCap}</span>
            </div>

            {/* YAKKA — bitta alohida qalam */}
            <div className="pq-grp">
              <span className="pq-single">
                {ok && <b className="pq-cnt big" style={{ animationDelay: '1s' }}>{TARGET}</b>}
                <Pencil c={ONE} w={22} />
              </span>
              <span className="pq-cap one">{t.yakkaCap}</span>
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '22%', top: '54px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '58%', top: '62px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '80%', top: '48px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {ok && <span className="pq-chip">{t.chip}</span>}

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
