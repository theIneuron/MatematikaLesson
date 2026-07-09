// Dars15 · Amaliyot 06 — P13 Zanjir «Dasta va yakka» · 🔴 · tag: teen_bundle_chain
// 4 qator: har birida 1 DASTA (o'nlik, 10 qalam + qizil rezinka) va N ta YAKKA qalam.
// "1 dasta + N = ?" — teen soni tanlanadi (16..19). O'n + birlik = teen (ikkinchi o'nlikning oxiri).
// 18 = "1 va 8" EMAS, balki 1 dasta (o'n) va 8 yakka (birlik). Dasta va yakkalar ALOHIDA ko'rinadi.
// Do'kon sahnasi: taxta «Dasta va yakka», javon, deraza + quyosh, osma chiroq nuri (uzluksiz ambient).
// G'alaba: yakka qalamlarda 11..ans sanoq-badge (o'ndan davom sanash) + yashil "10 + N = ans" chip.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10;
const ROWS = [
  { ones: 6, ans: 16, opts: [15, 16, 17] },
  { ones: 7, ans: 17, opts: [16, 17, 18] },
  { ones: 8, ans: 18, opts: [17, 18, 19] },
  { ones: 9, ans: 19, opts: [18, 19, 20] },
];
const DATA = { ptype: 'P13', level: '🔴', tag: 'teen_bundle_chain' };

// Qalam ranglari (palitradan, 2-ton): sariq / ko'k / yashil / qizil.
const PAL = [
  { main: '#f2b134', dark: '#d3941f' },
  { main: '#4f8fc4', dark: '#3a6f9e' },
  { main: '#57a84f', dark: '#43893c' },
  { main: '#d9534b', dark: '#b23e37' },
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Zanjir", title: "Dasta va yakka",
    setup: "Har qatorda bitta dasta (o'nta qalam) va bir nechta yakka qalam bor.",
    ask: "Har qatorda jami nechta qalamligini tanlang.",
    correct: "Barakalla! O'n va yakkalar — barcha teen sonlar to'g'ri yig'ildi!",
    hint: "Qizil qatorlarga qarang: o'nlikdan boshlab har bir yakka qalamni birma-bir sanang.",
    board: "Dasta va yakka",
  },
  ru: {
    eyebrow: 'Магазин карандашей · Цепочка', title: 'Пучок и штучные',
    setup: 'В каждой строке один пучок (десять карандашей) и несколько штучных карандашей.',
    ask: 'Выбери, сколько всего карандашей в каждой строке.',
    correct: 'Молодец! Десяток и штучные — все числа второго десятка собраны верно!',
    hint: 'Посмотри на красные строки: начни с десятка и посчитай каждый штучный карандаш по одному.',
    board: 'Пучок и штучные',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (birlik): tik yog'och qalam — 2-ton tana + blik, uchida yog'och konus + qora grafit
// uchi, orqasida metall halqa + pushti o'chirg'ich. Bitta qalam = bitta birlik. Rang palitradan.
const Pencil = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 16 60" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="8,1.5 5.7,8 10.3,8" fill="#2f2b28" />
    <polygon points="8,3.6 4,14 12,14" fill="#eed2a4" stroke="#c9ad7e" strokeWidth="0.7" strokeLinejoin="round" />
    <rect x="4" y="13.5" width="8" height="32" fill={c.main} />
    <rect x="4" y="13.5" width="2.7" height="32" fill={c.dark} />
    <rect x="9.5" y="13.5" width="1.5" height="32" fill="#ffffff" opacity="0.32" />
    <rect x="4" y="13.5" width="8" height="32" fill="none" stroke={c.dark} strokeWidth="0.6" opacity="0.5" />
    <rect x="3.6" y="45" width="8.8" height="6" fill="#cfd3d9" stroke="#a2a8b0" strokeWidth="0.6" />
    <line x1="3.6" y1="47.4" x2="12.4" y2="47.4" stroke="#a2a8b0" strokeWidth="0.6" />
    <line x1="3.6" y1="49" x2="12.4" y2="49" stroke="#a2a8b0" strokeWidth="0.6" />
    <rect x="4.3" y="50.2" width="7.4" height="7" rx="2.4" fill="#f2a9c0" stroke="#d97fa0" strokeWidth="0.7" />
    <rect x="5" y="51" width="2" height="4.6" rx="1" fill="#ffffff" opacity="0.4" />
  </svg>
);

export default function D15_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${TEN} + ${r.ones} = ?`), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1506">
      <style>{`
        .pq1506{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1506 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a1e;text-transform:uppercase;}
        .pq1506 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1506 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1506 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1506 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#fbe9cf,#f4dcb4);border:2px solid #e9d3a6;}
        .pq1506 .pq-scene{position:relative;width:372px;max-width:100%;height:96px;border-radius:18px;background:linear-gradient(#fdf1d8 0%,#f7e2be 55%,#efd2a4 100%);border:2px solid #e6cfa0;overflow:hidden;}
        .pq1506 .pq-beam{position:absolute;top:-20px;right:52px;width:70px;height:150px;background:linear-gradient(180deg,rgba(255,241,196,.7),rgba(255,241,196,0));transform:rotate(16deg);transform-origin:top center;z-index:1;animation:pqBeam 4.5s ease-in-out infinite;pointer-events:none;}
        .pq1506 .pq-window{position:absolute;top:12px;right:14px;width:56px;height:40px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #b58a4e;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1506 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b58a4e;transform:translateX(-1px);}
        .pq1506 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#b58a4e;transform:translateY(-1px);}
        .pq1506 .pq-sun{position:absolute;top:18px;right:22px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1506 .pq-lamp{position:absolute;left:44px;top:0;width:2px;height:16px;background:#8a5628;z-index:1;}
        .pq1506 .pq-lampshade{position:absolute;left:32px;top:14px;width:26px;height:12px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 9px 20px 5px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1506 .pq-board{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:5;padding:6px 15px 7px;border-radius:10px;background:linear-gradient(#c98a4e,#a86c34);border:2.5px solid #7f5326;color:#fdf3e2;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1506 .pq-board::before,.pq1506 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#7f5326;}
        .pq1506 .pq-board::before{left:18px;} .pq1506 .pq-board::after{right:18px;}
        .pq1506 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#c98a4e,#a86c34 60%,#8f5a2a);border-top:3px solid #d9a463;z-index:2;}
        .pq1506 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.22);}
        .pq1506 .pq-pricetag{position:absolute;right:20px;bottom:32px;width:26px;height:16px;background:#f6c651;border:1.6px solid #cf9a2a;border-radius:3px 8px 8px 3px;z-index:3;transform:rotate(-8deg);transform-origin:left center;animation:pqTag 3s ease-in-out infinite;box-shadow:0 2px 3px rgba(0,0,0,.14);}
        .pq1506 .pq-pricetag::before{content:'';position:absolute;left:3px;top:5px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #cf9a2a;}
        .pq1506 .pq-pricetag::after{content:'';position:absolute;left:9px;top:6px;right:4px;height:2px;background:#cf9a2a;border-radius:2px;box-shadow:0 4px 0 #cf9a2a;}

        /* qatorlar */
        .pq1506 .pq-rows{display:flex;flex-direction:column;gap:7px;width:100%;}
        .pq1506 .pq-rw{display:flex;gap:7px;align-items:center;justify-content:center;flex-wrap:wrap;padding:7px 8px;border-radius:14px;border:2.5px solid #ecdcbf;background:#fffaf0;transition:.15s;}
        .pq1506 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1506 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1506 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}

        /* DASTA (o'nlik) — 10 mini qalam + qizil rezinka + "10" yorlig'i */
        .pq1506 .pq-dasta{position:relative;display:flex;gap:1px;padding:2px 3px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1506 .pq-dpen{position:relative;width:7px;height:34px;flex:0 0 auto;}
        .pq1506 .pq-band{position:absolute;left:0;right:0;top:14px;height:8px;border-radius:3px;background:linear-gradient(#e2635b,#c8443c);border:1.4px solid #a5352e;box-shadow:0 1px 2px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.32);z-index:3;}
        .pq1506 .pq-dtag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:4;padding:0 7px;border-radius:8px;background:#2f6f3a;color:#fff;font-size:11px;font-weight:900;line-height:15px;box-shadow:0 2px 3px rgba(0,0,0,.2);}

        /* YAKKA qalamlar (birlik) */
        .pq1506 .pq-singles{display:flex;gap:3px;align-items:flex-end;padding:0 2px;}
        .pq1506 .pq-single{position:relative;width:13px;height:44px;flex:0 0 auto;}
        .pq1506 .pq-cnt{position:absolute;top:-10px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:5;font-variant-numeric:tabular-nums;}

        .pq1506 .pq-op{font-size:20px;font-weight:900;color:#c07a1e;}
        .pq1506 .pq-eq{font-size:20px;font-weight:900;color:#8a7a55;}
        .pq1506 .pq-slot{width:40px;height:42px;border-radius:10px;border:2.5px dashed #d8c59c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#c2a25e;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1506 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq1506 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1506 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1506 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1506 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1506 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq1506 .pq-chip{margin-left:2px;padding:5px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pqPop2 .35s ease both;}
        .pq1506 .pq-sgs{display:flex;gap:5px;margin-left:2px;}
        .pq1506 .pq-sg{width:38px;height:42px;border-radius:10px;border:2.5px solid #e0d3b6;background:#fff;font-size:19px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1506 .pq-sg:hover:not(:disabled){border-color:#e0a94e;transform:translateY(-2px);}
        .pq1506 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1506 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1506 .pq-sg:disabled{cursor:default;}

        .pq1506 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1506 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1506 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBeam{0%,100%{opacity:.55;}50%{opacity:.85;}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqTag{0%,100%{transform:rotate(-8deg);}50%{transform:rotate(-3deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#d8c59c;}50%{transform:scale(1.06);border-color:#c9ad7e;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop2{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-beam" />
          <span className="pq-lamp" /><span className="pq-lampshade" />
          <span className="pq-window" />
          <span className="pq-sun" />
          <div className="pq-board">{t.board}</div>
          <span className="pq-pricetag" />
          <span className="pq-shelf" />
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                {/* 1 DASTA (o'nlik) — 10 qalam qizil rezinka bilan */}
                <div className="pq-dasta">
                  <span className="pq-dtag">10</span>
                  {Array.from({ length: TEN }).map((_, k) => (
                    <span key={k} className="pq-dpen"><Pencil c={PAL[k % PAL.length]} /></span>
                  ))}
                  <span className="pq-band" />
                </div>
                <b className="pq-op">+</b>
                {/* N ta YAKKA qalam — g'alabada o'ndan davom sanoq-badge (11..ans) */}
                <div className="pq-singles">
                  {Array.from({ length: r.ones }).map((_, k) => (
                    <span key={k} className="pq-single">
                      <Pencil c={PAL[(i + k) % PAL.length]} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: `${k * 0.08}s` }}>{TEN + k + 1}</b>}
                    </span>
                  ))}
                </div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                {ok ? (
                  <span className="pq-chip">{TEN} + {r.ones} = {r.ans}</span>
                ) : (
                  <div className="pq-sgs">
                    {r.opts.map((n) => (
                      <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                        onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
