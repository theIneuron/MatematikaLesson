// Dars13 · Amaliyot 03 — P13 «Dastada nechta?» (teskari o'qish) · 🟡 · tag: read_bundle
// Dasta = o'nlik: 10 qalam qizil rezinka bilan bog'langan. Berilgan dastada nechta qalam?
// G'alabada dasta yechiladi (rezinka ochiladi), 10 qalam yoyilib 1..10 sanaladi; chip «1 dasta = 10 qalam».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 10, options: [8, 9, 10], ptype: 'P13', level: '🟡', tag: 'read_bundle' };
const N = 10;
// 10 qalamning rang palitrasi (sariq/qizil/ko'k/yashil aylanma) — sanashda ajralib tursin.
const PAL = [
  { body: '#f2b134', light: '#f8ce76' }, // sariq
  { body: '#d9534b', light: '#e88079' }, // qizil
  { body: '#4f8fc4', light: '#82b2dd' }, // ko'k
  { body: '#57a84f', light: '#86c47f' }, // yashil
];
const PENCILS = Array.from({ length: N }).map((_, i) => PAL[i % PAL.length]);

const T = {
  uz: {
    eyebrow: 'Qalam do\'koni · Dasta', title: 'Dastada nechta?',
    setup: 'Sotuvchi bir dasta qalam ko\'rsatdi. Dasta — o\'nlik, rezinka bilan bog\'langan.',
    ask: 'Bu dastada nechta qalam bor?',
    correct: 'Barakalla! Bir dasta doim o\'nta qalam. Dasta — bu o\'nlik!',
    hint: 'Dastani ochsak, ichida nechta qalam bo\'lishi kerak? Dasta — o\'nlik.',
    chip: '1 dasta = 10 qalam',
  },
  ru: {
    eyebrow: 'Магазин карандашей · Пучок', title: 'Сколько в пучке?',
    setup: 'Продавец показал один пучок карандашей. Пучок — это десяток, связанный резинкой.',
    ask: 'Сколько карандашей в этом пучке?',
    correct: 'Молодец! В одном пучке всегда десять карандашей. Пучок — это десяток!',
    hint: 'Если развязать пучок, сколько карандашей должно быть внутри? Пучок — десяток.',
    chip: '1 пучок = 10 карандашей',
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

export default function D13_03(props) {
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
    <div className="pq pq1303">
      <style>{`
        .pq1303{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1303 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1303 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1303 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1303 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1303 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;}
        .pq1303 .pq-scene{position:relative;width:372px;max-width:100%;height:236px;border-radius:20px;background:linear-gradient(#fdf3db 0%,#f8e6ba 58%,#f2d79f 100%);border:2px solid #e6cf9a;overflow:hidden;}
        /* deraza yorug'i */
        .pq1303 .pq-win{position:absolute;right:16px;top:14px;width:60px;height:46px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d8b878;box-shadow:0 0 16px 3px rgba(255,239,178,.7);animation:pqGlow 3.6s ease-in-out infinite;}
        .pq1303 .pq-win::before,.pq1303 .pq-win::after{content:'';position:absolute;background:#d8b878;}
        .pq1303 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1303 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        /* peshtaxta ustidagi javon + qalam kosasi (dekor) */
        .pq1303 .pq-shelf{position:absolute;left:14px;top:40px;width:96px;height:8px;border-radius:3px;background:linear-gradient(#b9843f,#9a6a2f);box-shadow:0 3px 5px rgba(120,80,30,.2);}
        .pq1303 .pq-cup{position:absolute;left:34px;top:16px;width:44px;height:26px;}
        .pq1303 .pq-cupbody{position:absolute;bottom:0;left:4px;width:36px;height:22px;border-radius:0 0 9px 9px;background:linear-gradient(#e2eaf2,#c3d0de);border:1.5px solid #a9b7c7;}
        .pq1303 .pq-cupp{position:absolute;bottom:14px;line-height:0;transform-origin:bottom center;animation:pqSway 3s ease-in-out infinite alternate;}
        /* osilgan narx yorlig'i (tebranadi) */
        .pq1303 .pq-tag{position:absolute;left:128px;top:0;width:2px;height:20px;background:#c9a463;}
        .pq1303 .pq-tag b{position:absolute;left:-16px;top:18px;width:34px;padding:3px 0;border-radius:5px 5px 5px 0;background:#f4b64a;border:1.5px solid #d1912b;color:#7a4d10;font-size:11px;font-weight:900;text-align:center;transform-origin:top center;animation:pqSwing 3.2s ease-in-out infinite;box-shadow:0 2px 3px rgba(120,80,30,.22);}
        /* peshtaxta */
        .pq1303 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:42px;background:linear-gradient(#c78f45,#a86f2c);border-top:3px solid #d9a961;}
        .pq1303 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:rgba(90,58,20,.35);}
        /* dasta */
        .pq1303 .pq-bundlepos{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);}
        .pq1303 .pq-bundlearea{position:relative;display:inline-block;}
        .pq1303 .pq-bundle{display:flex;align-items:flex-end;gap:1px;transition:gap .55s cubic-bezier(.3,1,.5,1);filter:drop-shadow(0 4px 4px rgba(120,80,30,.28));}
        .pq1303 .pq-bundle.spread{gap:9px;}
        .pq1303 .pq-pw{position:relative;transform-origin:bottom center;animation:pqSway 2.8s ease-in-out infinite alternate;}
        .pq1303 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:4;}
        /* rezinka band */
        .pq1303 .pq-band{position:absolute;left:-5px;right:-5px;top:46%;height:15px;border-radius:8px;background:linear-gradient(#e2685f,#c8362c 55%,#a82a22);border:1.5px solid #922019;box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 2px 3px rgba(0,0,0,.22);z-index:3;transition:opacity .5s ease,transform .5s ease;}
        .pq1303 .pq-band::after{content:'';position:absolute;left:44%;top:2px;width:9px;height:11px;border-radius:3px;background:linear-gradient(#e2685f,#b52f26);border:1.5px solid #922019;transform:rotate(8deg);}
        .pq1303 .pq-band.gone{opacity:0;transform:translateY(-34px) rotate(-9deg);}
        /* savol belgisi */
        .pq1303 .pq-q{position:absolute;left:50%;top:-40px;transform:translateX(-50%);font-size:36px;font-weight:900;color:#c77d2e;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqBreath 1.8s ease-in-out infinite;z-index:5;}
        .pq1303 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1303 .pq-star.s2{animation-delay:-.5s;} .pq1303 .pq-star.s3{animation-delay:-1s;}
        /* chip */
        .pq1303 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:999px;background:#fef3d8;border:2px solid #f0c877;color:#8a5a12;font-size:15px;font-weight:800;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        /* variantlar */
        .pq1303 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:4px;}
        .pq1303 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1303 .pq-opt:hover:not(:disabled){border-color:#f0c877;transform:translateY(-2px);}
        .pq1303 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1303 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1303 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1303 .pq-opt:disabled{cursor:default;}
        .pq1303 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1303 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1303 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 12px 2px rgba(255,239,178,.55);}50%{box-shadow:0 0 20px 5px rgba(255,239,178,.85);}}
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
          <span className="pq-win" />
          <span className="pq-shelf" />
          <div className="pq-cup">
            <span className="pq-cupp" style={{ left: 6, animationDelay: '-.4s' }}><Pencil c={PAL[0]} w={11} /></span>
            <span className="pq-cupp" style={{ left: 18, animationDelay: '-1.6s' }}><Pencil c={PAL[2]} w={11} /></span>
            <span className="pq-cupp" style={{ left: 30, animationDelay: '-2.4s' }}><Pencil c={PAL[3]} w={11} /></span>
            <span className="pq-cupbody" />
          </div>
          <span className="pq-tag"><b>?</b></span>
          <span className="pq-counter" />

          <div className="pq-bundlepos">
            <div className="pq-bundlearea">
              {!ok && <span className="pq-q">?</span>}
              <div className={'pq-bundle' + (ok ? ' spread' : '')}>
                {PENCILS.map((c, i) => (
                  <span key={i} className="pq-pw" style={{ animationDelay: `${-i * 0.22}s` }}>
                    {ok && <b className="pq-cnt" style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{i + 1}</b>}
                    <Pencil c={c} w={20} />
                  </span>
                ))}
              </div>
              <span className={'pq-band' + (ok ? ' gone' : '')} />
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '24%', top: '46px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '60%', top: '54px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '80%', top: '40px' }}><Star fill="#ffd13f" /></span>
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
