// Dars15 · Amaliyot 04 — TEEN YASASH «Qalam do'koni» · 🟡 · tag: compose_teen
// Peshtaxtada 1 DASTA (o'nlik) turibdi. O'n yettini yasash uchun yoniga nechta YAKKA qalam qo'yiladi?
// Dasta ALOHIDA (rezinka + «10» yorlig'i), yakka joylar ALOHIDA (dashed slot + «?» puls) — misconception qalqoni.
// G'alaba: 7 yakka qalam pop bilan paydo bo'ladi, dasta 1..10 + yakkalar 11..17 sanoq-badge, chip «10 + 7 = 17».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { ten: 10, target: 17, need: 7, options: [6, 7, 8], level: '🟡', tag: 'compose_teen' };
const TEN = DATA.ten, NEED = DATA.need, TARGET = DATA.target;

// Qalam tanasi rang palitrasi (sariq / qizil / ko'k / yashil — 2-ton).
const PAL = [
  { body: '#f2b134', light: '#f9ce74', dark: '#cd9421' }, // sariq
  { body: '#d9534b', light: '#e88881', dark: '#b13a33' }, // qizil
  { body: '#4f8fc4', light: '#83b1d9', dark: '#396f9c' }, // ko'k
  { body: '#57a84f', light: '#87c580', dark: '#42813e' }, // yashil
];
// Dastadagi 10 qalam (aylanma rang — sanashda ajralib tursin).
const BUNDLE = Array.from({ length: TEN }).map((_, i) => PAL[i % PAL.length]);
// Yoniga qo'yiladigan yakka qalamlar (need dona).
const SINGLES = Array.from({ length: NEED }).map((_, i) => PAL[(i + 1) % PAL.length]);

const T = {
  uz: {
    eyebrow: "Qalam do'koni · O'nlik va birlik", title: "O'n yettini yasang",
    setup: "Peshtaxtada bir dasta qalam turibdi — bu o'nlik.",
    ask: "O'n yettini (17) yasash uchun yoniga nechta yakka qalam qo'yiladi?",
    correct: "Barakalla! Bir dasta (o'n) va yetti yakka — o'n yetti. 10 va 7 — 17!",
    hint: "Dastada o'nta qalam bor. O'ndan keyin yakkalarni birma-bir sanang: o'n yettiga yetguncha nechta yakka kerak?",
  },
  ru: {
    eyebrow: 'Магазин карандашей · Десяток и единицы', title: 'Собери семнадцать',
    setup: 'На прилавке стоит один пучок карандашей — это десяток.',
    ask: 'Сколько отдельных карандашей положить рядом, чтобы получилось семнадцать (17)?',
    correct: 'Молодец! Один пучок (десять) и семь отдельных — семнадцать. Десять и семь — 17!',
    hint: 'В пучке десять карандашей. Считай отдельные после десяти по одному: сколько единиц нужно до семнадцати?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uch + yog'och konus, rangli tana (2-ton) +
// blik, metall halqa, pushti o'chirg'ich. Bitta qalam = bitta birlik. w bilan o'lchamlanadi.
const Pencil = ({ c, w = 20 }) => (
  <svg viewBox="0 0 22 76" width={w} height={w * 76 / 22} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="11,2 8.2,10 13.8,10" fill="#3b3b42" />
    <polygon points="11,2 4.5,17 17.5,17" fill="#edc689" />
    <polygon points="11,2 11,17 4.5,17" fill="#d6a765" opacity=".7" />
    <rect x="4.5" y="16.5" width="13" height="44" rx="1" fill={c.body} />
    <rect x="4.5" y="16.5" width="3.8" height="44" fill={c.light} opacity=".6" />
    <rect x="14" y="16.5" width="3.5" height="44" fill={c.dark} opacity=".55" />
    <rect x="4.5" y="60" width="13" height="7" rx="1" fill="#ced1d7" />
    <rect x="4.5" y="62" width="13" height="1.4" fill="#a6aab2" />
    <rect x="4.5" y="64.6" width="13" height="1.4" fill="#b8bbc2" />
    <rect x="5" y="66.5" width="12" height="8.6" rx="2.6" fill="#ea90b5" />
    <rect x="6" y="67.6" width="3" height="6.4" rx="1.5" fill="#f6bdd6" opacity=".7" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D15_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda yakka-qalam pop qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.need;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.need }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1504">
      <style>{`
        .pq1504{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1504 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1504 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1504 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1504 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1504 .pq-scene{position:relative;width:360px;max-width:100%;height:250px;margin:0 auto;border-radius:20px;background:linear-gradient(#f3e2c6 0%,#eed7b2 46%,#e7c99b 100%);border:2px solid #d9be92;overflow:hidden;}
        /* dekor: chiroq, deraza + quyosh, narx-yorlig'i, peshtaxta */
        .pq1504 .pq-lamp{position:absolute;left:34px;top:0;width:2px;height:20px;background:#8a5628;z-index:1;}
        .pq1504 .pq-lampshade{position:absolute;left:22px;top:18px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.45);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1504 .pq-window{position:absolute;right:14px;top:14px;width:60px;height:46px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #b98f52;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1504 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b98f52;transform:translateX(-1px);}
        .pq1504 .pq-sun{position:absolute;right:22px;top:20px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1504 .pq-tag{position:absolute;left:16px;top:52px;width:2px;height:18px;background:#c9a463;z-index:1;}
        .pq1504 .pq-tag b{position:absolute;left:-15px;top:16px;width:32px;padding:3px 0;border-radius:5px 5px 5px 0;background:#f4b64a;border:1.5px solid #d1912b;color:#7a4d10;font-size:11px;font-weight:900;text-align:center;transform-origin:top center;animation:pqSwing 3.2s ease-in-out infinite;box-shadow:0 2px 3px rgba(120,80,30,.22);}
        .pq1504 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1504 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:12px;height:2px;background:rgba(90,54,20,.35);}

        /* markaziy sahna: DASTA + «plus» + yakka joylar */
        .pq1504 .pq-row{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);display:flex;align-items:flex-end;gap:9px;z-index:4;}

        /* DASTA (o'nlik): 10 qalam zich + qizil rezinka + «10» yorlig'i */
        .pq1504 .pq-bundle{position:relative;filter:drop-shadow(0 4px 4px rgba(120,80,30,.26));}
        .pq1504 .pq-bpens{display:flex;align-items:flex-end;gap:1px;}
        .pq1504 .pq-bp{position:relative;transform-origin:bottom center;animation:pqSway 2.9s ease-in-out infinite alternate;}
        .pq1504 .pq-band{position:absolute;left:-4px;right:-4px;top:44%;height:14px;border-radius:8px;background:linear-gradient(#e2685f,#c8362c 55%,#a82a22);border:1.5px solid #922019;box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 2px 3px rgba(0,0,0,.22);z-index:3;}
        .pq1504 .pq-band::after{content:'';position:absolute;left:46%;top:2px;width:8px;height:10px;border-radius:3px;background:linear-gradient(#e2685f,#b52f26);border:1.5px solid #922019;transform:rotate(8deg);}
        .pq1504 .pq-tenlbl{position:absolute;left:50%;top:-15px;transform:translateX(-50%);z-index:4;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);}
        .pq1504 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1504 .pq-cnt.hi{background:#e0872a;} /* yakka badge — dastadan farqli rang */

        /* plus */
        .pq1504 .pq-plus{align-self:center;margin-bottom:8px;font-size:22px;font-weight:900;color:#a06a2e;opacity:.72;}

        /* yakka qalam joylari — dashed slot + «?» puls; g'alabada qalam pop */
        .pq1504 .pq-singles{display:flex;align-items:flex-end;gap:3px;}
        .pq1504 .pq-slot{position:relative;width:20px;height:60px;border-radius:7px;display:flex;align-items:flex-end;justify-content:center;box-sizing:border-box;}
        .pq1504 .pq-slot.empty{border:2px dashed rgba(120,74,32,.6);background:rgba(255,255,255,.22);animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1504 .pq-slot.empty:nth-child(2n){animation-delay:-.5s;} .pq1504 .pq-slot.empty:nth-child(3n){animation-delay:-1s;}
        .pq1504 .pq-q{font-size:15px;font-weight:900;color:#a06a2e;opacity:.7;margin-bottom:18px;animation:pqQ 1.9s ease-in-out infinite;}
        .pq1504 .pq-slot:nth-child(2n) .pq-q{animation-delay:-.5s;} .pq1504 .pq-slot:nth-child(3n) .pq-q{animation-delay:-1s;}
        .pq1504 .pq-single{position:relative;line-height:0;}
        .pq1504 .pq-single.in{animation:pqPopIn .5s cubic-bezier(.3,1.3,.5,1) both;}

        /* g'alaba uchqunlari */
        .pq1504 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1504 .pq-spark.s2{animation-delay:-.6s;} .pq1504 .pq-spark.s3{animation-delay:-1.15s;}

        /* natija tenglamasi chip: 10 + 7 = 17 */
        .pq1504 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1504 .pq-eq b{min-width:38px;height:40px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1504 .pq-eq b.ten{background:#fdecec;border-color:#cf3f38;color:#cf3f38;}
        .pq1504 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1504 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq1504 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1504 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1504 .pq-opt:hover:not(:disabled){border-color:#e2c79a;transform:translateY(-2px);}
        .pq1504 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1504 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1504 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1504 .pq-opt:disabled{cursor:default;}
        .pq1504 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1504 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1504 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%{transform:rotate(-1.6deg);}100%{transform:rotate(1.6deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:rgba(120,74,32,.6);}50%{transform:scale(1.05);border-color:rgba(160,106,46,.85);}}
        @keyframes pqQ{0%,100%{transform:scale(1);opacity:.55;}50%{transform:scale(1.18);opacity:.9;}}
        @keyframes pqPopIn{0%{opacity:0;transform:translateY(-16px) scale(.7);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-tag"><b>?</b></span>
        <span className="pq-counter" />

        <div className="pq-row">
          {/* DASTA — o'nlik, aynan 10 qalam + rezinka + «10» */}
          <div className="pq-bundle">
            <span className="pq-tenlbl">{TEN}</span>
            <div className="pq-bpens">
              {BUNDLE.map((c, i) => (
                <span key={i} className="pq-bp" style={{ animationDelay: `${-i * 0.2}s` }}>
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>{i + 1}</b>}
                  <Pencil c={c} w={11} />
                </span>
              ))}
            </div>
            <span className="pq-band" />
          </div>

          <span className="pq-plus">+</span>

          {/* YAKKA joylar — dashed slot + «?»; g'alabada qalam pop, badge 11..17 */}
          <div className="pq-singles">
            {SINGLES.map((c, j) => (
              <div key={j} className={'pq-slot' + (ok ? ' full' : ' empty')}>
                {ok ? (
                  <span className={'pq-single' + (still ? '' : ' in')} style={still ? undefined : { animationDelay: `${0.55 + j * 0.12}s` }}>
                    <b className="pq-cnt hi" style={{ animationDelay: `${0.7 + j * 0.12}s` }}>{TEN + j + 1}</b>
                    <Pencil c={c} w={16} />
                  </span>
                ) : (
                  <span className="pq-q">?</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '22%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '78%', top: '70px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {ok && (<div className="pq-eq"><b className="ten">{TEN}</b><i>+</i><b>{NEED}</b><i>=</i><b className="res">{TARGET}</b></div>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.need;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
