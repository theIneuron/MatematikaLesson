// Dars13 · Amaliyot 05 — P13 Taqqoslash «Dasta yoki yakkalar» · 🔴 · tag: bundle_vs_loose
// Bir dasta (=10 qalam, rezinka bilan bog'langan) va to'qqizta yakka qalam — qaysi tomonda ko'p?
// G'alabada dasta ochiladi: 10 qalam sanaladi (1..10), yakkalar 1..9 — «10 > 9».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const BUNDLE = 10, LOOSE = 9;
const DATA = { bundle: BUNDLE, loose: LOOSE, target: 'dasta', options: ['dasta', 'yakkalar', 'teng'], ptype: 'P13', level: '🔴', tag: 'bundle_vs_loose' };
// Yakka qalamlar ranglari (palitradan): sariq / qizil / ko'k / yashil — takrorlanadi.
const PAL = [
  { c: '#f2b134', d: '#cf9420' }, // sariq
  { c: '#d9534b', d: '#b23e37' }, // qizil
  { c: '#4f8fc4', d: '#3a72a3' }, // ko'k
  { c: '#57a84f', d: '#43893c' }, // yashil
];
const OPTS = [
  { v: 'dasta', k: 'optBundle' },
  { v: 'yakkalar', k: 'optLoose' },
  { v: 'teng', k: 'optEqual' },
];
const T = {
  uz: {
    eyebrow: 'Qalam do\'koni · Taqqoslash', title: 'Qaysi ko\'p?',
    setup: 'Chapda bir dasta qalam, o\'ngda to\'qqizta yakka qalam.',
    ask: 'Qaysi tomonda qalam ko\'p?',
    correct: 'Barakalla! Bir dasta — o\'nta, u to\'qqizdan ko\'p!',
    hint: 'Dastada nechta qalam bor? Uni yakkalar soni bilan solishtiring.',
    optBundle: 'Dasta ko\'p', optLoose: 'Yakkalar ko\'p', optEqual: 'Teng',
    lblBundle: 'Dasta', lblLoose: 'Yakkalar',
  },
  ru: {
    eyebrow: 'Магазин карандашей · Сравнение', title: 'Где больше?',
    setup: 'Слева одна пачка карандашей, справа девять отдельных карандашей.',
    ask: 'На какой стороне карандашей больше?',
    correct: 'Молодец! Одна пачка — это десять, а десять больше девяти!',
    hint: 'Сколько карандашей в пачке? Сравни это с числом отдельных.',
    optBundle: 'Пачки больше', optLoose: 'Отдельных больше', optEqual: 'Поровну',
    lblBundle: 'Пачка', lblLoose: 'Отдельные',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — rangli tana (2-ton) + blik,
// tepada pushti o'chirg'ich + metall halqa, pastda yog'och konus + qora grafit uchi.
const Pencil = ({ c = '#f2b134', d = '#cf9420', w = 14 }) => (
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

export default function D13_05(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.optBundle, t.optLoose, t.optEqual], studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1305">
      <style>{`
        .pq1305{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1305 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1305 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1305 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1305 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1305 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        .pq1305 .pq-shop{position:relative;width:360px;max-width:100%;height:206px;border-radius:20px;background:linear-gradient(#f7ead2 0%,#f0dcbb 58%,#e6cba1 100%);border:2px solid #dcc59c;overflow:hidden;}
        .pq1305 .pq-win{position:absolute;top:0;left:0;width:130px;height:150px;background:linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,0) 62%);pointer-events:none;animation:pqShine 5s ease-in-out infinite;}
        .pq1305 .pq-sun{position:absolute;top:12px;right:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq1305 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c79a5f,#a9793f);border-top:3px solid #d9b784;box-shadow:inset 0 2px 0 rgba(255,255,255,.25);}
        .pq1305 .pq-shelf::before{content:'';position:absolute;left:0;right:0;bottom:0;height:8px;background:#8f6531;}
        .pq1305 .pq-tag{position:absolute;top:12px;padding:3px 11px;border-radius:8px;font-size:12px;font-weight:800;color:#7a4d17;background:#fff6e4;border:1.5px solid #e3c996;box-shadow:0 2px 4px rgba(0,0,0,.12);animation:pqTagBob 3s ease-in-out infinite;z-index:4;}
        .pq1305 .pq-tag::before{content:'';position:absolute;top:-7px;left:50%;width:2px;height:7px;background:#c7a668;transform:translateX(-50%);}
        .pq1305 .pq-tag.l{left:52px;} .pq1305 .pq-tag.r{right:44px;animation-delay:-1.4s;}
        .pq1305 .pq-zone{position:absolute;bottom:30px;display:flex;flex-direction:column;align-items:center;}
        .pq1305 .pq-zone.l{left:0;width:170px;} .pq1305 .pq-zone.r{right:0;width:170px;}
        /* DASTA: 10 qalam yonma-yon, qizil rezinka bilan bog'langan */
        .pq1305 .pq-bundle{position:relative;display:flex;align-items:flex-end;animation:pqSwayG 3.4s ease-in-out infinite;}
        .pq1305 .pq-bundle .pq-pen{margin-left:-6px;transition:margin-left .5s cubic-bezier(.3,1.05,.5,1);}
        .pq1305 .pq-bundle .pq-pen:first-child{margin-left:0;}
        .pq1305 .pq-bundle.open .pq-pen{margin-left:0;}
        .pq1305 .pq-band{position:absolute;left:-3px;right:-3px;top:22px;height:11px;border-radius:6px;background:linear-gradient(#e8564d,#c93b32);border:1.5px solid #a52f27;box-shadow:0 2px 3px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);z-index:3;transition:.5s ease;}
        .pq1305 .pq-bundle.open .pq-band{opacity:0;transform:translateY(-9px) rotate(-4deg);}
        .pq1305 .pq-blabel{position:absolute;top:-20px;left:50%;transform:translateX(-50%);min-width:24px;padding:1px 7px;border-radius:9px;background:#c93b32;color:#fff;font-size:13px;font-weight:900;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.2);z-index:4;font-variant-numeric:tabular-nums;}
        /* YAKKALAR: 9 alohida qalam */
        .pq1305 .pq-loose{position:relative;display:flex;align-items:flex-end;gap:2px;}
        .pq1305 .pq-loose .pq-pen{animation:pqSway 2.6s ease-in-out infinite;}
        .pq1305 .pq-pen{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1305 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:5;animation:pqPop .3s ease both;font-variant-numeric:tabular-nums;}
        .pq1305 .pq-vs{position:absolute;top:70px;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:#fff;border:3px solid #e3c996;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#c77d2e;z-index:6;box-shadow:0 3px 7px rgba(0,0,0,.16);animation:pqBreath 1.8s ease-in-out infinite;}
        .pq1305 .pq-vs.win{color:#1a7f43;border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq1305 .pq-chip{margin-top:2px;padding:6px 18px;border-radius:999px;background:#e8f7ee;color:#1a7f43;font-size:20px;font-weight:900;font-variant-numeric:tabular-nums;animation:pqPop .4s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1305 .pq-shop.still .pq-cnt{animation:none;}
        .pq1305 .pq-shop.still .pq-bundle .pq-pen{transition:none;}
        .pq1305 .pq-shop.still .pq-band{transition:none;}
        .pq1305 .pq-opts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px;}
        .pq1305 .pq-opt{padding:13px 20px;font-size:16px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq1305 .pq-opt:hover:not(:disabled){border-color:#e3b877;transform:translateY(-2px);}
        .pq1305 .pq-opt:active:not(:disabled){transform:scale(.95);}
        .pq1305 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1305 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1305 .pq-opt:disabled{cursor:default;}
        .pq1305 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1305 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1305 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.6deg);}}
        @keyframes pqSwayG{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-2px) rotate(1deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqShine{0%,100%{opacity:.5;}50%{opacity:.85;}}
        @keyframes pqTagBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.09);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-shop' + (still ? ' still' : '')}>
          <span className="pq-win" />
          <span className="pq-sun" />
          <span className="pq-tag l">{t.lblBundle}</span>
          <span className="pq-tag r">{t.lblLoose}</span>

          <div className="pq-zone l">
            <div className={'pq-bundle' + (ok ? ' open' : '')}>
              <span className="pq-blabel">{BUNDLE}</span>
              {Array.from({ length: BUNDLE }).map((_, i) => {
                const p = PAL[i % PAL.length];
                return (
                  <span key={i} className="pq-pen">
                    <Pencil c={p.c} d={p.d} w={14} />
                    {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.06}s` }}>{i + 1}</b>}
                  </span>
                );
              })}
            </div>
          </div>

          <div className={'pq-vs' + (ok ? ' win' : '')}>{ok ? '>' : '?'}</div>

          <div className="pq-zone r">
            <div className="pq-loose">
              {Array.from({ length: LOOSE }).map((_, i) => {
                const p = PAL[(i + 1) % PAL.length];
                return (
                  <span key={i} className="pq-pen" style={{ animationDelay: `${-i * 0.22}s` }}>
                    <Pencil c={p.c} d={p.d} w={14} />
                    {ok && <b className="pq-cnt" style={{ animationDelay: `${(BUNDLE + i) * 0.06}s` }}>{i + 1}</b>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {ok && <div className="pq-chip">{BUNDLE} &gt; {LOOSE}</div>}
      </div>

      <div className="pq-opts">
        {OPTS.map((o) => {
          const sel = picked === o.v; const right = ok && o.v === DATA.target;
          return <button key={o.v} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o.v); setFeedback(null); }}>{t[o.k]}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
