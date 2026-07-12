// Dars19 · Amaliyot 09 — Og'zaki masala «Shar do'koni» · 🔴 · tag: cross_word
// Og'zaki masala: qutida 13 ta shar (1-quti to'la 10 + 2-qutida 3 birlik). Bola matndan
// modelni o'zi tuzadi: "13 ta shar bor edi, 5 tasi uchib ketdi — nechta qoldi?" → 8.
// G'alaba SEKIN, bosqichma-bosqich (D15_01 sifat darajasi): avval 3 birlik BITTALAB uchadi
// (13−3=10), «= 10» bekat-chipi yonadi, pauza, keyin o'nlikdan 2 tasi bittalab uchadi (10−2=8);
// qolgan 8 ta bittalab sanaladi. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 matematik minus
const A = 13, B = 5, TARGET = 8, TEN = 10;
const UNITS = A - TEN;        // 3 — teen birliklari (2-rak); avval shular ketadi
const FROMTEN = B - UNITS;    // 2 — o'nlikdan olinadigan qolgan qism
const DATA = { a: A, b: B, target: TARGET, options: [7, 8, 9], level: '🔴', tag: 'cross_word' };

// Shar rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// 1-rak: 10 uya, hammasi to'la. G'alabada oxirgi FROMTEN(2) shar uchadi → sakkizta qoladi.
const RAK1 = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= TEN - FROMTEN, c: PAL[i % PAL.length] }));
// 2-rak: 10 uya, 0..UNITS-1 (3) to'la — birliklar. G'alabada uchtasi ham uchadi.
const RAK2 = Array.from({ length: TEN }).map((_, i) => ({ i, has: i < UNITS, c: PAL[(TEN + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shar do'koni · Og'zaki masala", title: "Nechta shar qoldi?",
    setup: "Do'konda 13 ta shar bor edi. 5 tasi uchib ketdi.",
    ask: "Nechta shar qoldi?",
    correct: "Barakalla! Avval 3 tasi uchdi — 10 ta qoldi. Yana 2 tasi uchdi — 8 ta. 13 − 5 = 8.",
    hint: "Avval 3 tasini ayiring — 10 ta qoladi. Keyin 10 dan yana 2 tasini ayiring.",
  },
  ru: {
    eyebrow: "Магазин шаров · Задача", title: "Сколько шаров осталось?",
    setup: "В магазине было 13 шаров. 5 улетели.",
    ask: "Сколько шаров осталось?",
    correct: "Молодец! Сначала улетели 3 — осталось 10. Ещё 2 — осталось 8. 13 − 5 = 8.",
    hint: "Сначала убери 3 — останется 10. Потом из 10 вычти ещё 2.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHAR KANONI (yakka birlik): rangli oval — radial 2-ton + oq blik + pastda tugun-uchburchak +
// ip-chizik. Bitta shar = bitta birlik. Rang palitradan.
let __gid = 0;
const Balloon = ({ c, size = 18 }) => {
  const id = 'd1909b' + (__gid++);
  return (
    <svg viewBox="0 0 28 40" width={size} height={size * 40 / 28} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* ip */}
      <path d="M14 29 Q17 34 14 40" fill="none" stroke="#9aa3af" strokeWidth="1" strokeLinecap="round" />
      {/* asosiy oval */}
      <ellipse cx="14" cy="15" rx="11" ry="14" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* tugun uchburchak */}
      <path d="M12 27.5 L16 27.5 L14 31 Z" fill={c.dark} />
      {/* oq blik */}
      <ellipse cx="10" cy="10" rx="3" ry="4.4" fill="#fff" opacity=".55" transform="rotate(-18 10 10)" />
      <circle cx="18" cy="20" r="1.3" fill="#fff" opacity=".35" />
    </svg>
  );
};

export default function D19_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda uchish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil suzish (bosiladigan nishon EMAS)

  // Uchib ketish tartibi (SEKIN, bittalab): avval 2-quti birliklari (3), «= 10» bekati, keyin 1-qutidan (2).
  const flyDelay2 = (i) => 0.3 + i * 0.85;                       // birliklar: .3, 1.15, 2.0
  const flyDelay1 = (i) => 4.6 + (i - (TEN - FROMTEN)) * 0.85;   // o'nlikdan: 4.6, 5.45

  return (
    <div className="pq pq1909">
      <style>{`
        .pq1909{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1909 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0537a;text-transform:uppercase;}
        .pq1909 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1909 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1909 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1909 .pq-scene{position:relative;width:380px;max-width:100%;height:252px;margin:0 auto;border-radius:20px;background:linear-gradient(#fbeaf1 0%,#f3ecf7 50%,#eaf2fb 100%);border:2px solid #e6c6d6;overflow:hidden;}
        .pq1909 .pq-sun{position:absolute;left:20px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1909 .pq-awning{position:absolute;left:0;right:0;top:0;height:26px;z-index:2;background:repeating-linear-gradient(90deg,#e879a6 0 24px,#fbeef4 24px 48px);border-bottom:2px solid #c14e7e;}
        .pq1909 .pq-awning::after{content:'';position:absolute;left:0;right:0;top:26px;height:9px;background:repeating-linear-gradient(90deg,#e879a6 0 24px,#fbeef4 24px 48px);-webkit-mask:radial-gradient(9px at 12px 0,transparent 98%,#000) repeat-x;mask:radial-gradient(9px at 12px 0,transparent 98%,#000) repeat-x;-webkit-mask-size:24px 9px;mask-size:24px 9px;}
        .pq1909 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#c14e7e,#a03c66);border:2.5px solid #822f52;color:#fdeef5;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq1909 .pq-rasta{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1909 .pq-rasta::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1909 .pq-arena{position:absolute;left:8px;right:8px;top:46px;bottom:38px;display:flex;align-items:center;justify-content:center;gap:12px;z-index:3;}
        .pq1909 .pq-box{position:relative;padding:8px 9px 10px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1909 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1909 .pq-grid{display:grid;grid-template-columns:repeat(5,22px);grid-auto-rows:28px;gap:3px;}
        .pq1909 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);display:flex;align-items:flex-end;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,54,20,.18);}
        .pq1909 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.5);}
        .pq1909 .pq-cw{line-height:0;}
        .pq1909 .pq-cw.idle{animation:pqBob 2.6s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1909 .pq-cw.fly{animation:pqFly 1s ease-in forwards;animation-delay:var(--fd,0s);}
        .pq1909 .pq-mile{position:absolute;top:-16px;left:50%;z-index:7;background:#fff6e2;border:2px solid #cd9421;color:#a06a10;font-weight:900;font-size:13px;padding:2px 11px;border-radius:999px;box-shadow:0 2px 5px rgba(160,106,16,.25);white-space:nowrap;font-variant-numeric:tabular-nums;animation:pqMile 2.4s ease 3.2s both;}
        .pq1909 .pq-cnt{position:absolute;top:-7px;right:-5px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1909 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s var(--ld,.9s) both;font-variant-numeric:tabular-nums;}
        .pq1909 .pq-minus{font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;}

        .pq1909 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1909 .pq-spark.s2{animation-delay:-.6s;} .pq1909 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1909 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1909 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fbeef4;border:2px solid #e6b6cd;color:#a03c66;font-variant-numeric:tabular-nums;}
        .pq1909 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1909 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1909 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#a05a7f;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1909 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1909 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1909 .pq-opt:hover:not(:disabled){border-color:#e2a3c0;transform:translateY(-2px);}
        .pq1909 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1909 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1909 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1909 .pq-opt:disabled{cursor:default;}
        .pq1909 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1909 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1909 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqMile{0%{opacity:0;transform:translateX(-50%) scale(.4);}12%{opacity:1;transform:translateX(-50%) scale(1);}78%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.8);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqFly{0%{opacity:1;transform:translateY(0) rotate(0);}25%{opacity:1;transform:translateY(-8px) rotate(6deg);}100%{opacity:0;transform:translateY(-96px) rotate(-10deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-awning" />
        <span className="pq-sun" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 1-quti: o'nta shar. G'alabada oxirgi ikkitasi bittalab uchadi → 8 tasi qoladi (badge 1..8) */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            {ok && !still && <span className="pq-mile">= 10</span>}
            <div className="pq-grid">
              {RAK1.map((s) => {
                const flew = ok && s.gone;              // g'alabada uchib ketgan
                const stayShow = !s.gone;               // qoladigan sharlar
                return (
                  <div key={s.i} className={'pq-cell' + (flew ? ' empty' : '')}>
                    {stayShow && (
                      <span className={'pq-cw' + (idle ? ' idle' : '')} style={{ '--bd': `${s.i * 0.12}s` }}>
                        <Balloon c={s.c} size={17} />
                        {ok && <b className="pq-cnt" style={{ animationDelay: still ? '0s' : `${6.6 + s.i * 0.15}s` }}>{s.i + 1}</b>}
                      </span>
                    )}
                    {s.gone && !ok && (
                      <span className={'pq-cw' + (idle ? ' idle' : '')} style={{ '--bd': `${s.i * 0.12}s` }}>
                        <Balloon c={s.c} size={17} />
                      </span>
                    )}
                    {s.gone && ok && !still && (
                      <span className="pq-cw fly" style={{ '--fd': `${flyDelay1(s.i)}s` }}>
                        <Balloon c={s.c} size={17} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-lbl" style={{ '--ld': still ? '0s' : '6.9s' }}>{TARGET}</span>}
          </div>

          <span className="pq-minus">{M}</span>

          {/* 2-quti: uchta birlik. G'alabada uchtasi ham bittalab uchib ketadi (avval shular) */}
          <div className="pq-box">
            <div className="pq-grid">
              {RAK2.map((s) => (
                <div key={s.i} className={'pq-cell' + (s.has && !ok ? '' : ' empty')}>
                  {s.has && !ok && (
                    <span className={'pq-cw' + (idle ? ' idle' : '')} style={{ '--bd': `${(TEN + s.i) * 0.12}s` }}>
                      <Balloon c={s.c} size={17} />
                    </span>
                  )}
                  {s.has && ok && !still && (
                    <span className="pq-cw fly" style={{ '--fd': `${flyDelay2(s.i)}s` }}>
                      <Balloon c={s.c} size={17} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className="pq-rasta" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '58px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '70px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '44px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{M}</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} {M} {UNITS} {M} {FROMTEN} = {TEN} {M} {FROMTEN}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
