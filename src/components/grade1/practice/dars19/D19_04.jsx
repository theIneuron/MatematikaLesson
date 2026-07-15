// Dars19 · Amaliyot 04 — Make-ten-sub «Shar do'koni» · 🟡 · tag: cross_sub
// Bitta-tanlov: ikki quti (ten-frame). 1-quti to'la (10 ta shar), 2-qutida 4 ta shar → jami 14.
// "14 − 6 = ?" → 8. G'alaba SEKIN, bosqichma-bosqich (D15_01 sifat darajasi): avval 2-qutidagi
// 4 ta shar BITTALAB uchadi (14−4=10), «= 10» bekat-chipi yonadi, pauza, keyin 1-qutidan 2 tasi
// bittalab uchadi (10−2=8); qolgan 8 ta bittalab sanaladi. VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida.
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

const A = 14, B = 6, TARGET = 8, TEN = 10;
const UNITS = A - TEN;      // 4 — teen birliklari (2-rakda), avval shular ketadi
const SECOND = B - UNITS;   // 2 — o'nlikdan olinadigan qolgan qism
const STAY1 = TEN - SECOND; // 8 — g'alabada 1-rakda qoladigan sharlar
const DATA = { a: A, b: B, target: TARGET, options: [7, 8, 9], level: '🟡', tag: 'cross_sub' };

// Shar rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];
// 1-rak: 10 uya, hammasi to'la. G'alabada 8..9 (SECOND=2) uchib ketadi, 0..7 qoladi.
const RACK1 = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= STAY1, c: PAL[i % PAL.length] }));
// 2-rak: 10 uya, 0..3 (UNITS=4) to'la. G'alabada shular birinchi bo'lib uchib ketadi.
const RACK2 = Array.from({ length: TEN }).map((_, i) => ({ i, has: i < UNITS, c: PAL[(TEN + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shar do'koni · Ayirish", title: "Nechta shar qoldi?",
    setup: "Qutida 14 ta shar bor edi. 6 tasi uchib ketdi.",
    ask: "14 − 6 nechaga teng?",
    correct: "Barakalla! Avval 4 tasi uchdi — 10 ta qoldi. Yana 2 tasi uchdi — 8 ta. 14 − 6 = 8.",
    hint: "Avval 4 tasini ayiring — 10 ta qoladi. Keyin 10 dan yana 2 tasini ayiring.",
  },
  ru: {
    eyebrow: "Магазин шаров · Вычитание", title: "Сколько шаров осталось?",
    setup: "В коробке было 14 шаров. 6 улетели.",
    ask: "Сколько будет 14 − 6?",
    correct: "Молодец! Сначала улетели 4 — осталось 10. Ещё 2 — осталось 8. 14 − 6 = 8.",
    hint: "Сначала убери 4 — останется 10. Потом из 10 вычти ещё 2.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHAR KANONI (yakka birlik): rangli oval + oq blik + pastda tugun-uchburchak + ip-chizik.
// Bitta shar = bitta birlik. Rang palitradan.
let __gid = 0;
const Balloon = ({ c, size = 18 }) => {
  const id = 'b1904' + (__gid++);
  return (
    <svg viewBox="0 0 26 40" width={size} height={size * 40 / 26} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* ip */}
      <path d="M13 30 q3 4 -1 9" fill="none" stroke="#9aa3ad" strokeWidth="1" strokeLinecap="round" />
      {/* tugun */}
      <polygon points="13,29 10,33 16,33" fill={c.dark} />
      {/* tana */}
      <ellipse cx="13" cy="15" rx="11" ry="14" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="9" cy="10" rx="3" ry="4.6" fill="#fff" opacity=".55" transform="rotate(-20 9 10)" />
    </svg>
  );
};

export default function D19_04(props) {
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
  const [fitRef, scale] = useFitScale(392);

  return (
    <div className="pq pq1904" ref={fitRef}>
      <style>{`
        .pq1904{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1904 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f74c9;text-transform:uppercase;}
        .pq1904 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1904 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1904 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1904 .pq-fit{position:relative;margin:0 auto;}
        .pq1904 .pq-scene{box-sizing:border-box;position:relative;width:392px;height:256px;border-radius:20px;background:linear-gradient(#dbeffb 0%,#e9f4fc 52%,#f2ead6 100%);border:2px solid #c9def0;overflow:hidden;}
        .pq1904 .pq-sun{position:absolute;left:20px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1904 .pq-awning{position:absolute;left:0;right:0;top:0;height:26px;z-index:2;background:repeating-linear-gradient(90deg,#4a90d9 0 24px,#eaf3fc 24px 48px);border-bottom:2px solid #2f6bab;}
        .pq1904 .pq-awning::after{content:'';position:absolute;left:0;right:0;top:26px;height:9px;background:repeating-linear-gradient(90deg,#4a90d9 0 24px,#eaf3fc 24px 48px);-webkit-mask:radial-gradient(9px at 12px 0,transparent 98%,#000) repeat-x;mask:radial-gradient(9px at 12px 0,transparent 98%,#000) repeat-x;-webkit-mask-size:24px 9px;mask-size:24px 9px;}
        .pq1904 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4a90d9,#2f6bab);border:2.5px solid #24578c;color:#f2f8ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq1904 .pq-rasta{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1904 .pq-rasta::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1904 .pq-arena{position:absolute;left:8px;right:8px;top:46px;bottom:36px;display:flex;align-items:center;justify-content:center;gap:12px;z-index:3;}
        .pq1904 .pq-box{position:relative;padding:8px 9px 12px;border-radius:14px;background:linear-gradient(#e6eef6,#c9d7e6);border:2.5px solid #9db4cb;box-shadow:0 6px 13px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.5);flex:0 0 auto;}
        .pq1904 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1904 .pq-grid{display:grid;grid-template-columns:repeat(5,22px);grid-auto-rows:26px;gap:4px;}
        .pq1904 .pq-cell{position:relative;border-radius:7px;background:rgba(255,255,255,.55);border:1.4px solid rgba(90,120,150,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(60,90,120,.16);}
        .pq1904 .pq-cell.empty{background:rgba(255,255,255,.28);border-style:dashed;border-color:rgba(90,120,150,.55);}
        .pq1904 .pq-cw{line-height:0;position:relative;}
        .pq1904 .pq-cw.fly{animation:pqFly 1s ease-in both;animation-delay:var(--dd,0s);}
        .pq1904 .pq-mile{position:absolute;top:-16px;left:50%;z-index:7;background:#fff6e2;border:2px solid #cd9421;color:#a06a10;font-weight:900;font-size:13px;padding:2px 11px;border-radius:999px;box-shadow:0 2px 5px rgba(160,106,16,.25);white-space:nowrap;font-variant-numeric:tabular-nums;animation:pqMile 2.4s ease 4s both;}
        .pq1904 .pq-cnt{position:absolute;top:-7px;right:-6px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;}
        .pq1904 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #2f74c9;color:#2f74c9;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;}
        .pq1904 .pq-lbl.g{border-color:#1a7f43;color:#1a7f43;animation:pqPop .4s var(--ld,.2s) both;}

        .pq1904 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1904 .pq-spark.s2{animation-delay:-.6s;} .pq1904 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1904 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1904 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #a9c4e2;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq1904 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1904 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1904 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7ea6;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1904 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1904 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1904 .pq-opt:hover:not(:disabled){border-color:#9bc0ea;transform:translateY(-2px);}
        .pq1904 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1904 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1904 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1904 .pq-opt:disabled{cursor:default;}
        .pq1904 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1904 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1904 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqFly{0%{opacity:1;transform:translateY(0) scale(1) rotate(0);}60%{opacity:.85;}100%{opacity:0;transform:translateY(-64px) scale(.82) rotate(9deg);}}
        @keyframes pqMile{0%{opacity:0;transform:translateX(-50%) scale(.4);}12%{opacity:1;transform:translateX(-50%) scale(1);}78%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.8);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 392 * scale, height: 256 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-awning" />
        <span className="pq-sun" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* 1-quti: to'la o'nlik. G'alabada oxirgi 2 tasi bittalab uchadi, 8 tasi qoladi. */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            {ok && !still && <span className="pq-mile">= 10</span>}
            <div className="pq-grid">
              {RACK1.map((s) => {
                const flying = ok && s.gone;      // 8..9 — o'nlikdan uchadigan SECOND=2
                const stayN = !s.gone;            // 0..7 — qoladigan sakkizta
                let badgeN = 0;
                if (ok && stayN) badgeN = s.i + 1;
                return (
                  <div key={s.i} className={'pq-cell' + (ok && s.gone ? ' empty' : '')}>
                    {stayN && (
                      <span className="pq-cw"><Balloon c={s.c} />{ok && <b className="pq-cnt" style={{ animationDelay: still ? '0s' : `${7.4 + s.i * 0.15}s` }}>{badgeN}</b>}</span>
                    )}
                    {s.gone && !ok && (<span className="pq-cw"><Balloon c={s.c} /></span>)}
                    {flying && !still && (
                      <span className="pq-cw fly" style={{ '--dd': `${5.4 + (s.i - STAY1) * 0.85}s` }}><Balloon c={s.c} /></span>
                    )}
                  </div>
                );
              })}
            </div>
            <span className={'pq-lbl' + (ok ? ' g' : '')} style={ok ? { '--ld': still ? '0s' : '7.7s' } : undefined}>{ok ? TARGET : TEN}</span>
          </div>

          {/* 2-quti: teen birliklari (4 ta). G'alabada birinchi bo'lib, bittalab uchib ketadi → bo'shaydi. */}
          <div className="pq-box">
            <div className="pq-grid">
              {RACK2.map((s) => {
                const flying = ok && s.has;       // to'rtta birlik — avval uchadi (UNITS=4)
                return (
                  <div key={s.i} className={'pq-cell' + (!s.has || ok ? ' empty' : '')}>
                    {s.has && !ok && (<span className="pq-cw"><Balloon c={s.c} /></span>)}
                    {flying && !still && (
                      <span className="pq-cw fly" style={{ '--dd': `${0.3 + s.i * 0.85}s` }}><Balloon c={s.c} /></span>
                    )}
                  </div>
                );
              })}
            </div>
            {!ok && <span className="pq-lbl">{UNITS}</span>}
          </div>
        </div>

        <span className="pq-rasta" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '58px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '70px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '44px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>−</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} − {UNITS} − {SECOND} = {TEN} − {SECOND}</div>
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
