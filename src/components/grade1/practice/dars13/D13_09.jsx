// Dars13 · Amaliyot 09 — P13 «Bir o'nlik nechta?» · 🔴 · tag: tens_count
// Bir DASTA (=1 o'nlik) peshtaxtada. Savol vizual: «1 dasta = ? qalam». G'alabada dasta ochilib
// 10 yakka qalam sanaladi (1..10): 1 o'nlik = 10 birlik.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const N = 10; // dastadagi qalamlar (bitta o'nlik)
const DATA = { bundles: 1, target: 10, options: [1, 10, 11], ptype: 'P13', level: '🔴', tag: 'tens_count' };

// Qalam ranglari (palitradan): sariq / qizil / ko'k / yashil — aylanadi.
const PAL = [
  { c: '#f2b134', d: '#cf9420' }, // sariq
  { c: '#d9534b', d: '#b23e37' }, // qizil
  { c: '#4f8fc4', d: '#3a72a3' }, // ko'k
  { c: '#57a84f', d: '#43893c' }, // yashil
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · O'nlik", title: "Bir o'nlik nechta?",
    setup: "Bir dasta — bu bitta o'nlik. Uni yakka qalamlarga aylantiramiz.",
    ask: "Bir o'nlikda nechta birlik (qalam) bor?",
    correct: "Barakalla! Bir o'nlik — o'nta birlik. Dasta ichida o'nta qalam!",
    hint: "Dastani oching: ichida nechta yakka qalam bor?",
    lblDasta: "1 dasta", qword: "qalam", res: "1 o'nlik = 10 birlik",
  },
  ru: {
    eyebrow: "Магазин карандашей · Десяток", title: "Сколько в десятке?",
    setup: "Одна пачка — это один десяток. Разложим её на отдельные карандаши.",
    ask: "Сколько единиц (карандашей) в одном десятке?",
    correct: "Молодец! Один десяток — десять единиц. В пачке десять карандашей!",
    hint: "Раскрой пачку: сколько в ней отдельных карандашей?",
    lblDasta: "1 пачка", qword: "карандашей", res: "1 десяток = 10 единиц",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — rangli tana (2-ton) + blik,
// tepada pushti o'chirg'ich + metall halqa, pastda yog'och konus + qora grafit uchi.
const Pencil = ({ c = '#f2b134', d = '#cf9420', w = 13 }) => (
  <svg viewBox="0 0 20 64" width={w} height={w * 64 / 20} aria-hidden="true" style={{ display: 'block' }}>
    {/* o'chirg'ich */}
    <rect x="5" y="1.5" width="10" height="7" rx="3" fill="#f2a6ba" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <rect x="6.4" y="2.4" width="1.8" height="5" rx="1" fill="#fff" opacity=".4" />
    {/* metall halqa */}
    <rect x="5" y="7.6" width="10" height="6" fill="#cfd4dc" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <line x1="5" y1="9.6" x2="15" y2="9.6" stroke="#a9b0bb" strokeWidth="1" />
    <line x1="5" y1="11.6" x2="15" y2="11.6" stroke="#a9b0bb" strokeWidth="1" />
    {/* tana */}
    <rect x="5" y="13" width="10" height="37" fill={c} stroke="rgba(0,0,0,.14)" strokeWidth=".8" />
    <rect x="5" y="13" width="3.4" height="37" fill={d} />
    <rect x="11.3" y="13" width="1.8" height="37" fill="#fff" opacity=".35" />
    {/* yog'och konus */}
    <polygon points="5,50 15,50 10,61" fill="#e8c99a" stroke="rgba(0,0,0,.14)" strokeWidth=".8" strokeLinejoin="round" />
    <polygon points="5,50 10,50 10,61" fill="#d6ba85" />
    {/* grafit uchi */}
    <polygon points="8.4,56.6 11.6,56.6 10,61" fill="#2c2c2c" />
  </svg>
);

export default function D13_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda dastani ochish animatsiyasi qayta ijro etilmaydi — statik.
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
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1309">
      <style>{`
        .pq1309{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1309 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1309 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1309 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1309 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1309 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;}
        .pq1309 .pq-shop{position:relative;width:344px;max-width:100%;height:210px;border-radius:20px;background:linear-gradient(#f7ead2 0%,#f0dcbb 58%,#e6cba1 100%);border:2px solid #dcc59c;overflow:hidden;}
        .pq1309 .pq-win{position:absolute;top:0;left:0;width:130px;height:150px;background:linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,0) 62%);pointer-events:none;animation:pqShine 5s ease-in-out infinite;z-index:1;}
        .pq1309 .pq-sun{position:absolute;top:12px;right:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1309 .pq-cord{position:absolute;left:80px;top:0;width:2px;height:22px;background:#7a6a52;z-index:1;}
        .pq1309 .pq-bulb{position:absolute;left:73px;top:20px;width:18px;height:15px;border-radius:0 0 12px 12px/0 0 16px 16px;background:radial-gradient(circle at 50% 30%,#fff3b0,#ffd23f 70%,#e0a41e);box-shadow:0 0 14px 5px rgba(255,210,63,.45);z-index:1;animation:pqLamp 2.7s ease-in-out infinite;}
        .pq1309 .pq-shelf{position:absolute;left:20px;right:20px;top:58px;height:9px;border-radius:3px;background:linear-gradient(#c8935a,#a9743f);box-shadow:0 2px 3px rgba(0,0,0,.15);z-index:1;}
        .pq1309 .pq-shbox{position:absolute;top:34px;width:34px;height:24px;border-radius:4px 4px 2px 2px;z-index:1;box-shadow:0 2px 2px rgba(0,0,0,.14);animation:pqBoxBob 3.4s ease-in-out infinite;}
        .pq1309 .pq-shbox::before{content:'';position:absolute;left:0;right:0;top:0;height:7px;border-radius:4px 4px 0 0;background:rgba(255,255,255,.28);}
        .pq1309 .pq-shbox::after{content:'';position:absolute;right:4px;bottom:4px;width:10px;height:7px;border-radius:2px;background:#fff;opacity:.85;}
        .pq1309 .pq-shbox.b1{left:30px;background:linear-gradient(#e08a9a,#cf5f74);}
        .pq1309 .pq-shbox.b2{right:30px;background:linear-gradient(#7fb0d8,#4f8fc4);animation-delay:-1.7s;}
        .pq1309 .pq-tag{position:absolute;top:80px;padding:3px 11px;border-radius:8px;font-size:12px;font-weight:800;color:#7a4d17;background:#fff6e4;border:1.5px solid #e3c996;box-shadow:0 2px 4px rgba(0,0,0,.12);animation:pqTagBob 3s ease-in-out infinite;z-index:2;}
        .pq1309 .pq-tag::before{content:'';position:absolute;top:-7px;left:14px;width:2px;height:7px;background:#c7a668;}
        .pq1309 .pq-tag.l{left:24px;} .pq1309 .pq-tag.r{right:24px;animation-delay:-1.4s;}
        .pq1309 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#c8935a,#a9743f 60%,#8f5f30);border-top:3px solid #dcae74;z-index:2;}
        .pq1309 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:8px;height:2px;background:rgba(255,255,255,.14);}

        /* markaziy tenglama: [dasta] = [? / 10] qalam */
        .pq1309 .pq-eq{position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:9px;z-index:4;}
        .pq1309 .pq-dbox{width:172px;display:flex;justify-content:center;align-items:flex-end;}
        .pq1309 .pq-bundle{position:relative;display:flex;align-items:flex-end;animation:pqSway 3.6s ease-in-out infinite;}
        .pq1309 .pq-shop.still .pq-bundle{animation:none;}
        .pq1309 .pq-bundle .pq-pen{margin-left:-6px;transition:margin-left .5s cubic-bezier(.3,1.05,.5,1);}
        .pq1309 .pq-bundle .pq-pen:first-child{margin-left:0;}
        .pq1309 .pq-bundle.open .pq-pen{margin-left:4px;}
        .pq1309 .pq-bundle.open .pq-pen:first-child{margin-left:0;}
        .pq1309 .pq-shop.still .pq-bundle .pq-pen{transition:none;}
        .pq1309 .pq-pen{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1309 .pq-band{position:absolute;left:-4px;right:-4px;top:17px;height:10px;border-radius:6px;background:linear-gradient(#e8564d,#c93b32);border:1.5px solid #a52f27;box-shadow:0 2px 3px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);z-index:3;transition:.5s ease;}
        .pq1309 .pq-bundle.open .pq-band{opacity:0;transform:translateY(-10px) rotate(-5deg);}
        .pq1309 .pq-shop.still .pq-band{transition:none;}
        .pq1309 .pq-dcap{position:absolute;top:-22px;left:50%;transform:translateX(-50%);padding:2px 10px;border-radius:9px;background:#c93b32;color:#fff;font-size:12px;font-weight:800;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,.2);z-index:4;}
        .pq1309 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:5;box-shadow:0 1px 2px rgba(0,0,0,.2);animation:pqPop .3s ease both;font-variant-numeric:tabular-nums;}
        .pq1309 .pq-shop.still .pq-cnt{animation:none;}
        .pq1309 .pq-eqs{font-size:30px;font-weight:900;color:#a86412;}
        .pq1309 .pq-ans{min-width:40px;height:44px;padding:0 6px;border-radius:12px;background:#fff;border:3px solid #e3c996;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#c77d2e;font-variant-numeric:tabular-nums;box-shadow:0 3px 6px rgba(0,0,0,.14);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1309 .pq-ans.win{color:#1a7f43;border-color:#1a7f43;background:#e8f7ee;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1309 .pq-qword{font-size:17px;font-weight:800;color:#7a4d17;}

        .pq1309 .pq-res{margin-top:2px;min-height:2px;}
        .pq1309 .pq-chip{display:inline-flex;align-items:center;padding:7px 18px;border-radius:999px;background:#e8f7ee;color:#1a7f43;font-size:16px;font-weight:900;animation:pqPop2 .4s cubic-bezier(.3,1.5,.5,1) both;}

        .pq1309 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:10px;}
        .pq1309 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1309 .pq-opt:hover:not(:disabled){border-color:#e3b877;transform:translateY(-2px);}
        .pq1309 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1309 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1309 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1309 .pq-opt:disabled{cursor:default;}
        .pq1309 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1309 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1309 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-2px) rotate(1deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqShine{0%,100%{opacity:.5;}50%{opacity:.85;}}
        @keyframes pqLamp{0%,100%{opacity:.9;box-shadow:0 0 12px 4px rgba(255,210,63,.4);}50%{opacity:1;box-shadow:0 0 18px 6px rgba(255,210,63,.6);}}
        @keyframes pqTagBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBoxBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqAns{0%{opacity:0;transform:scale(.3);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop2{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-shop' + (still ? ' still' : '')}>
          <span className="pq-win" />
          <span className="pq-sun" />
          <span className="pq-cord" /><span className="pq-bulb" />
          <span className="pq-shelf" />
          <span className="pq-shbox b1" /><span className="pq-shbox b2" />
          <span className="pq-tag l">{t.lblDasta}</span>
          <span className="pq-tag r">{t.qword}</span>
          <span className="pq-counter" />

          <div className="pq-eq">
            <div className="pq-dbox">
              <div className={'pq-bundle' + (ok ? ' open' : '')}>
                <span className="pq-dcap">{t.lblDasta}</span>
                {Array.from({ length: N }).map((_, i) => {
                  const p = PAL[i % PAL.length];
                  return (
                    <span key={i} className="pq-pen">
                      <Pencil c={p.c} d={p.d} w={13} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.06}s` }}>{i + 1}</b>}
                    </span>
                  );
                })}
                <span className="pq-band" />
              </div>
            </div>
            <span className="pq-eqs">=</span>
            <span className={'pq-ans' + (ok ? ' win' : '')}>{ok ? DATA.target : '?'}</span>
            <span className="pq-qword">{t.qword}</span>
          </div>
        </div>

        <div className="pq-res">{ok && <span className="pq-chip">{t.res}</span>}</div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
