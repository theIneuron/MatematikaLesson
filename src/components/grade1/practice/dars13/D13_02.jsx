// Dars13 · Amaliyot 02 — P13 «Dasta nechta?» · 🟡 · tag: ten_is_bundle
// O'nta yakka qalam (birlik) rezinka bilan bog'lanib bitta DASTA (o'nlik) bo'ladi: dastada 10 qalam.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const N = 10; // dastadagi qalamlar
const DATA = { target: 10, options: [9, 10, 11], ptype: 'P13', level: '🟡', tag: 'ten_is_bundle' };

// Qalam ranglari (palitradan): sariq / qizil / ko'k / yashil — aylanadi.
const PAL = [
  { body: '#f2b134', dark: '#cf8f1c' },
  { body: '#d9534b', dark: '#b23a33' },
  { body: '#4f8fc4', dark: '#3a6f9e' },
  { body: '#57a84f', dark: '#43863c' },
];
const PENCILS = Array.from({ length: N }, (_, i) => PAL[i % PAL.length]);

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Dasta", title: "Dasta nechta?",
    setup: "O'nta yakka qalamni rezinka bilan bog'lab, bitta DASTA qilamiz. Dasta — bu o'nlik!",
    ask: "Bir dastada nechta qalam bor?",
    correct: "Barakalla! Bir dasta — o'nta qalam. O'n birlik bitta o'nlik bo'ldi!",
    hint: "Dastadagi qalamlarni sanang: nechta bo'lsa, dasta shuncha.",
    chip: "1 dasta = 10 qalam",
  },
  ru: {
    eyebrow: "Магазин карандашей · Пучок", title: "Сколько в пучке?",
    setup: "Десять отдельных карандашей свяжем резинкой в один ПУЧОК. Пучок — это десяток!",
    ask: "Сколько карандашей в одном пучке?",
    correct: "Молодец! Один пучок — десять карандашей. Десять единиц стали одним десятком!",
    hint: "Посчитай карандаши в пучке: сколько их — столько и в пучке.",
    chip: "1 пучок = 10 карандашей",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uch + yog'och konus, rangli tana (2-ton) + blik,
// metall halqa + pushti o'chirg'ich. Bitta qalam = bitta birlik.
const Pencil = ({ c }) => (
  <svg viewBox="0 0 18 80" width="18" height="80" aria-hidden="true" style={{ display: 'block' }}>
    {/* grafit uch */}
    <polygon points="9,2 12.4,13 5.6,13" fill="#3a3a3a" />
    <polygon points="9,2 9,13 5.6,13" fill="#1f1f1f" opacity=".45" />
    {/* yog'och konus */}
    <polygon points="9,7.5 15,19 3,19" fill="#e7c99c" />
    <polygon points="9,7.5 9,19 3,19" fill="#d3ac77" opacity=".7" />
    {/* tana (2-ton) */}
    <rect x="3" y="18" width="12" height="46" fill={c.body} />
    <rect x="3" y="18" width="3.6" height="46" fill="#ffffff" opacity=".22" />
    <rect x="11.4" y="18" width="3.6" height="46" fill={c.dark} />
    <rect className="pq-glint" x="7.3" y="18" width="1.5" height="46" fill="#ffffff" opacity=".38" />
    {/* metall halqa */}
    <rect x="3" y="63" width="12" height="9" fill="#c9ced6" />
    <rect x="3" y="65.4" width="12" height="1.3" fill="#9aa0aa" />
    <rect x="3" y="68.4" width="12" height="1.3" fill="#9aa0aa" />
    {/* o'chirg'ich */}
    <rect x="3.6" y="71" width="10.8" height="8.4" rx="3" fill="#f2a6c0" />
    <rect x="3.6" y="71" width="3.8" height="8.4" rx="3" fill="#ffffff" opacity=".3" />
  </svg>
);

export default function D13_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda bog'lash animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq1302">
      <style>{`
        .pq1302{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1302 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9861f;text-transform:uppercase;}
        .pq1302 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1302 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1302 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1302 .pq-scene{position:relative;width:340px;max-width:100%;height:232px;margin:0 auto;border-radius:20px;background:linear-gradient(#f6e7c9 0%,#efd6ad 60%,#e6c79a 100%);border:2px solid #d9bd8e;overflow:hidden;}
        .pq1302 .pq-win{position:absolute;left:14px;top:12px;width:56px;height:44px;border-radius:5px;background:linear-gradient(135deg,#dff0fb 0 45%,#bfe0f4 45% 55%,#dff0fb 55%);border:3px solid #b98b52;z-index:0;overflow:hidden;}
        .pq1302 .pq-win::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:3px;background:#b98b52;transform:translateX(-1.5px);}
        .pq1302 .pq-win::after{content:'';position:absolute;top:50%;left:0;right:0;height:3px;background:#b98b52;transform:translateY(-1.5px);}
        .pq1302 .pq-sun{position:absolute;left:20px;top:16px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff6cf,#ffd85e 70%,#f5b52e);box-shadow:0 0 12px 3px rgba(255,216,94,.6);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1302 .pq-cord{position:absolute;left:50%;top:0;width:2px;height:20px;background:#7a6a52;transform:translateX(-1px);z-index:1;}
        .pq1302 .pq-bulb{position:absolute;left:50%;top:18px;transform:translateX(-50%);width:20px;height:16px;border-radius:0 0 12px 12px/0 0 16px 16px;background:radial-gradient(circle at 50% 30%,#fff3b0,#ffd23f 70%,#e0a41e);box-shadow:0 0 15px 5px rgba(255,210,63,.5);z-index:1;animation:pqLamp 2.7s ease-in-out infinite;}
        .pq1302 .pq-shelf{position:absolute;left:16px;right:16px;top:76px;height:9px;border-radius:3px;background:linear-gradient(#c8935a,#a9743f);box-shadow:0 2px 3px rgba(0,0,0,.15);z-index:1;}
        .pq1302 .pq-shbox{position:absolute;top:52px;width:34px;height:24px;border-radius:4px 4px 2px 2px;z-index:1;box-shadow:0 2px 2px rgba(0,0,0,.14);animation:pqBoxBob 3.4s ease-in-out infinite;}
        .pq1302 .pq-shbox::before{content:'';position:absolute;left:0;right:0;top:0;height:7px;border-radius:4px 4px 0 0;background:rgba(255,255,255,.28);}
        .pq1302 .pq-shbox::after{content:'';position:absolute;right:3px;bottom:4px;width:10px;height:7px;border-radius:2px;background:#fff;opacity:.85;}
        .pq1302 .pq-shbox.b1{left:24px;background:linear-gradient(#e08a9a,#cf5f74);}
        .pq1302 .pq-shbox.b2{right:24px;background:linear-gradient(#7fb0d8,#4f8fc4);animation-delay:-1.6s;}
        .pq1302 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:38px;background:linear-gradient(#c8935a,#a9743f 60%,#8f5f30);border-top:3px solid #dcae74;z-index:2;}
        .pq1302 .pq-counter::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:rgba(255,255,255,.14);}
        .pq1302 .pq-bundlepos{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);z-index:4;}
        .pq1302 .pq-bundle{position:relative;transform-origin:bottom center;animation:pqSway 3.8s ease-in-out infinite;}
        .pq1302 .pq-scene.still .pq-bundle{animation:none;}
        .pq1302 .pq-pencils{position:relative;display:flex;gap:5px;align-items:flex-end;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq1302 .pq-pencil{position:relative;animation:pqGather .7s cubic-bezier(.3,1.15,.5,1) both;transform:translateX(var(--dx,0));}
        .pq1302 .pq-scene.still .pq-pencil{animation:none;transform:none;}
        .pq1302 .pq-glint{animation:pqGlint 2.9s ease-in-out infinite;}
        .pq1302 .pq-band{position:absolute;left:-4px;right:-4px;top:43px;height:15px;border-radius:5px;background:linear-gradient(#e8635b,#d9534b 45%,#b23a33);border:1px solid #a5342d;box-shadow:0 2px 3px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.35);z-index:5;transform-origin:center;animation:pqBind .5s cubic-bezier(.3,1.4,.5,1) .72s both;}
        .pq1302 .pq-scene.still .pq-band{animation:none;opacity:1;transform:scaleX(1);}
        .pq1302 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.2);animation:pqPop .3s ease both;}
        .pq1302 .pq-q,.pq1302 .pq-ans{position:absolute;left:50%;bottom:100%;margin-bottom:8px;font-weight:900;z-index:6;white-space:nowrap;}
        .pq1302 .pq-q{font-size:32px;color:#c9861f;text-shadow:0 2px 6px rgba(255,255,255,.8);animation:pqBreath 1.8s ease-in-out infinite;}
        .pq1302 .pq-ans{font-size:40px;color:#1a7f43;text-shadow:0 2px 8px rgba(255,255,255,.9);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;transform:translateX(-50%);}
        .pq1302 .pq-chipwrap{text-align:center;margin-top:10px;min-height:2px;}
        .pq1302 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:999px;background:#fff3e0;border:2px solid #f0c98a;color:#a86412;font-size:15px;font-weight:800;animation:pqIn .3s ease both;}
        .pq1302 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:14px;}
        .pq1302 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1302 .pq-opt:hover:not(:disabled){border-color:#f0c98a;transform:translateY(-2px);}
        .pq1302 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1302 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1302 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1302 .pq-opt:disabled{cursor:default;}
        .pq1302 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1302 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1302 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGather{from{transform:translateX(var(--dx,0));}to{transform:translateX(0);}}
        @keyframes pqBind{0%{opacity:0;transform:scaleX(0);}60%{opacity:1;transform:scaleX(1.06);}100%{opacity:1;transform:scaleX(1);}}
        @keyframes pqSway{0%,100%{transform:rotate(-1.1deg);}50%{transform:rotate(1.1deg);}}
        @keyframes pqGlint{0%,100%{opacity:.18;}50%{opacity:.5;}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.9;box-shadow:0 0 12px 4px rgba(255,210,63,.4);}50%{opacity:1;box-shadow:0 0 18px 6px rgba(255,210,63,.6);}}
        @keyframes pqBoxBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);opacity:.85;}50%{transform:translateX(-50%) scale(1.12);opacity:1;}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        <div className="pq-win" />
        <span className="pq-sun" />
        <span className="pq-cord" /><span className="pq-bulb" />
        <span className="pq-shelf" />
        <span className="pq-shbox b1" /><span className="pq-shbox b2" />
        <span className="pq-counter" />

        <div className="pq-bundlepos">
          {!ok && <span className="pq-q">?</span>}
          {ok && <span className="pq-ans">{DATA.target}</span>}
          <div className="pq-bundle">
            <div className="pq-pencils">
              {PENCILS.map((c, i) => (
                <span key={i} className="pq-pencil" style={{ '--dx': `${(i - (N - 1) / 2) * 12}px` }}>
                  <Pencil c={c} />
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.05}s` }}>{i + 1}</b>}
                </span>
              ))}
              <span className="pq-band" />
            </div>
          </div>
        </div>
      </div>

      <div className="pq-chipwrap">{ok && <span className="pq-chip">{t.chip}</span>}</div>

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
