// Dars19 · Amaliyot 10 — YANGI «Sharlarni uchir!» (tap-to-remove, o'nlikdan o'tib ayirish) · 🔴 · tag: cross_sub_remove
// Shar do'koni: rakda 13 shar (bitta to'la o'nlik-rak = 10 + birliklar rakida 3). Bola sharni bosadi — shar
// uyadan chiqib uchib ketadi (yuqoriga suzib so'nadi, bir-martalik). AYNAN 5 shar uchsa — 8 qoladi.
// CAP=5: beshta uchgach qolganlari bosilmaydi (uchgan shar qaytmaydi). Make-ten-sub: avval 3 birlik — o'nta
// qoladi, keyin o'nlikdan yana 2. VEDI-DO-VERNOGO: kam uchirsa qulf yo'q, davom etadi; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MINUS = '−'; // minus sign U+2212
const A = 13, B = 5, TARGET = 8, TEN = 10, UNITS = A - TEN; // 3 birlik
const DATA = { a: A, b: B, target: TARGET, ptype: 'NEW', level: '🔴', tag: 'cross_sub_remove' };

// Rak A — to'la o'nlik (2×5 = 10 uya): indekslar 0..9. Rak B — birliklar (3 uya): 10,11,12.
const RACKA = Array.from({ length: TEN }, (_, i) => i);
const RACKB = Array.from({ length: UNITS }, (_, i) => TEN + i);
const ALL = [...RACKA, ...RACKB];
// Restore uchun kanonik uchirish tartibi: avval birliklar (make-ten-sub), keyin o'nlikdan.
const REMOVE_ORDER = [...RACKB, ...RACKA];

// Shar palitrasi (aylanma): qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' },
  { light: '#82b6ea', main: '#4a90d9', dark: '#2f6aa8' },
  { light: '#f7cf72', main: '#f2b134', dark: '#c8860f' },
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' },
  { light: '#f2a9cd', main: '#e879a6', dark: '#c04d7f' },
];

const T = {
  uz: {
    eyebrow: "Shar do'koni · Ayirish", title: "Sharlarni uchir!",
    setup: "Do'konda o'n uchta shar bor. Beshta sharni bosib uchiring.",
    ask: "Nechta shar qoladi?",
    tapHint: "Sharlarni bosib uchiring",
    left: "Qoldi", flew: "uchdi",
    correct: "Barakalla! O'n uchtadan beshta shar uchdi — sakkizta qoldi. 13 − 5 = 8.",
    hintFew: "Beshta shar uchishi kerak. Avval uchta birlikni uchiring — o'nta qoladi, keyin o'nlikdan yana ikkitasini uchiring.",
  },
  ru: {
    eyebrow: 'Магазин шаров · Вычитание', title: 'Отпусти шары!',
    setup: 'В магазине тринадцать шаров. Нажми и отпусти пять шаров.',
    ask: 'Сколько шаров останется?',
    tapHint: 'Нажимай на шары',
    left: 'Осталось', flew: 'улетело',
    correct: 'Молодец! Из тринадцати улетело пять шаров — осталось восемь. 13 − 5 = 8.',
    hintFew: 'Должно улететь пять шаров. Сначала отпусти три из отдельных — останется десять, потом из десятка ещё два.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHAR kanoni (bitta birlik): rangli oval + oq blik + pastda tugun-uchburchak + ip-chizik. Rang palitradan.
let __gid = 0;
const Balloon = ({ c, size = 22 }) => {
  const id = 'd1910b' + (__gid++);
  return (
    <svg viewBox="0 0 28 46" width={size} height={size * 46 / 28} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* ip */}
      <path d="M14 33 Q17 39 12 45" fill="none" stroke="#9aa2ad" strokeWidth="1" strokeLinecap="round" />
      {/* tugun */}
      <path d="M11 29 L17 29 L14 34 Z" fill={c.dark} />
      {/* tana */}
      <ellipse cx="14" cy="15.5" rx="11.5" ry="14.5" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="10" cy="10" rx="3.1" ry="4.2" fill="#fff" opacity=".6" transform="rotate(-20 10 10)" />
      <circle cx="18" cy="22" r="1.2" fill="#fff" opacity=".3" />
    </svg>
  );
};

export default function D19_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [gone, setGone] = useState(() => Array(A).fill(false));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda uchish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const removed = gone.filter(Boolean).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const n = typeof sa.removed === 'number' ? Math.max(0, Math.min(A, sa.removed)) : 0;
      const g = Array(A).fill(false);
      REMOVE_ORDER.slice(0, n).forEach((idx) => { g[idx] = true; });
      setGone(g);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hintFew });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(removed === B && !checked); }, [removed, checked, onReady]);

  const lock = isReview || checked;
  const tap = (i) => {
    if (lock || gone[i] || removed >= B) return;
    setFeedback(null);
    setGone((prev) => { const g = [...prev]; g[i] = true; return g; });
  };

  const check = useCallback(() => {
    const correct = removed === B;
    setFeedback({ correct, msg: correct ? t.correct : t.hintFew }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: ['8'],
      studentAnswer: { removed }, correctAnswer: { removed: B },
      correct, meta: { ...DATA },
    });
  }, [removed, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  // G'alabada qolgan sharlarga 1..8 badge (ko'rinish tartibida).
  let remN = 0;
  const badgeFor = {};
  ALL.forEach((i) => { if (!gone[i]) badgeFor[i] = ok ? ++remN : null; });

  const renderCell = (i, k) => {
    const isGone = gone[i];
    const badge = ok && !isGone ? badgeFor[i] : null;
    const showBalloon = !isGone || (isGone && !still);
    return (
      <div key={k} className={'pq-cell' + (isGone ? ' empty' : '')}>
        {showBalloon && (
          <button
            type="button"
            className={'pq-bwrap' + (isGone ? ' fly' : '')}
            disabled={lock || isGone || removed >= B}
            onClick={() => tap(i)}
            aria-label="shar"
          >
            <Balloon c={PAL[i % PAL.length]} size={22} />
            {badge != null && <b className="pq-cnt" style={{ animationDelay: `${(badge - 1) * 0.1}s` }}>{badge}</b>}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pq pq1910">
      <style>{`
        .pq1910{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1910 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0398f;text-transform:uppercase;}
        .pq1910 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1910 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1910 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1910 .pq-scene{position:relative;width:384px;max-width:100%;height:256px;margin:0 auto;border-radius:20px;background:linear-gradient(#e9f4fd 0%,#f3ecfb 55%,#fbeef4 100%);border:2px solid #e0d3ec;overflow:hidden;}
        .pq1910 .pq-sun{position:absolute;left:18px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1910 .pq-win{position:absolute;right:16px;top:34px;width:52px;height:40px;border-radius:6px;background:linear-gradient(#cdeaf6,#eaf7fc);border:2px solid #c3b3d6;z-index:1;box-shadow:inset 0 0 0 2px rgba(255,255,255,.4);}
        .pq1910 .pq-win::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:#c3b3d6;transform:translateX(-1px);}
        .pq1910 .pq-awning{position:absolute;left:0;right:0;top:0;height:24px;z-index:2;background:repeating-linear-gradient(90deg,#e879a6 0 24px,#fbe5ef 24px 48px);border-bottom:2px solid #c04d7f;}
        .pq1910 .pq-awning::after{content:'';position:absolute;left:0;right:0;top:24px;height:9px;background:repeating-linear-gradient(90deg,#e879a6 0 24px,#fbe5ef 24px 48px);-webkit-mask:radial-gradient(9px at 12px 0,transparent 98%,#000) repeat-x;mask:radial-gradient(9px at 12px 0,transparent 98%,#000) repeat-x;-webkit-mask-size:24px 9px;mask-size:24px 9px;}
        .pq1910 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#7a5aa8,#5f4488);border:2.5px solid #453163;color:#f6f0fb;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq1910 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#caa06a,#a5763f);border-top:3px solid #82562a;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1910 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}

        .pq1910 .pq-arena{position:absolute;left:8px;right:8px;top:46px;bottom:36px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq1910 .pq-box{position:relative;padding:8px 9px 12px;border-radius:14px;background:linear-gradient(#c98fca,#a86ba9);border:2.5px solid #7f4e80;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.28);flex:0 0 auto;}
        .pq1910 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1910 .pq-grid{display:grid;grid-template-columns:repeat(5,26px);grid-auto-rows:30px;gap:4px;}
        .pq1910 .pq-gridb{display:grid;grid-template-columns:repeat(1,26px);grid-auto-rows:30px;gap:4px;}
        .pq1910 .pq-cell{position:relative;border-radius:7px;background:rgba(255,250,255,.5);border:1.4px solid rgba(110,60,110,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,40,90,.16);}
        .pq1910 .pq-cell.empty{background:rgba(255,255,255,.16);border-style:dashed;border-color:rgba(110,60,110,.5);}
        .pq1910 .pq-bwrap{background:none;border:none;padding:0;margin:0;line-height:0;cursor:pointer;position:relative;transition:transform .12s;}
        .pq1910 .pq-bwrap:hover:not(:disabled){transform:scale(1.12);}
        .pq1910 .pq-bwrap:active:not(:disabled){transform:scale(.9);}
        .pq1910 .pq-bwrap:disabled{cursor:default;}
        .pq1910 .pq-bwrap.fly{animation:pqFly .9s ease-in forwards;pointer-events:none;}
        .pq1910 .pq-cnt{position:absolute;top:-10px;left:50%;margin-left:-9.5px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#1a7f43;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1910 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #a86ba9;color:#8a4e8b;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.16);font-variant-numeric:tabular-nums;}
        .pq1910 .pq-plus{font-size:22px;font-weight:900;color:#8a4e8b;flex:0 0 auto;}

        .pq1910 .pq-taphint{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:700;color:#7a3466;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:999px;animation:pqBob 1.8s ease-in-out infinite;z-index:5;white-space:nowrap;}
        .pq1910 .pq-chip{position:absolute;top:9px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:7;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq1910 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1910 .pq-spark.s2{animation-delay:-.6s;} .pq1910 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1910 .pq-count{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:14px;padding:9px 14px;border-radius:14px;background:#f6f0fb;border:2px solid #e2d3ee;animation:pqIn .3s ease both;}
        .pq1910 .pq-count.ready{background:#e8f7ee;border-color:#1a7f43;animation:pqReady 1.1s ease-in-out infinite;}
        .pq1910 .pq-count .lead{font-size:14px;font-weight:800;color:#7a3466;}
        .pq1910 .pq-count.ready .lead{color:#1a7f43;}
        .pq1910 .pq-count .big{font-size:30px;font-weight:900;color:#8a4e8b;font-variant-numeric:tabular-nums;min-width:30px;text-align:center;}
        .pq1910 .pq-count.ready .big{color:#1a7f43;}
        .pq1910 .pq-count .prog{font-size:13px;font-weight:700;color:#9a7aa8;font-variant-numeric:tabular-nums;}
        .pq1910 .pq-count.ready .prog{color:#2f8f54;}
        .pq1910 .pq-sub{text-align:center;margin-top:8px;font-size:14px;font-weight:800;color:#8a6a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1910 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1910 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1910 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqFly{0%{opacity:1;transform:translateY(0) scale(1);}30%{opacity:1;}100%{opacity:0;transform:translateY(-64px) translateX(6px) scale(.55) rotate(8deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqBob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pqReady{0%,100%{transform:scale(1);}50%{transform:scale(1.02);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-awning" />
        <span className="pq-sun" />
        <span className="pq-win" />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* Rak A — to'la o'nlik (10) */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {RACKA.map((i, k) => renderCell(i, 'a' + k))}
            </div>
            <span className="pq-lbl">{TEN}</span>
          </div>

          <span className="pq-plus">+</span>

          {/* Rak B — birliklar (3) */}
          <div className="pq-box">
            <div className="pq-gridb">
              {RACKB.map((i, k) => renderCell(i, 'b' + k))}
            </div>
            <span className="pq-lbl">{UNITS}</span>
          </div>
        </div>

        <span className="pq-shelf" />

        {!ok && removed === 0 && !lock && <span className="pq-taphint">{t.tapHint}</span>}
        {ok && <span className="pq-chip">{`${A} ${MINUS} ${B} = ${TARGET}`}</span>}
        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '70px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '44px' }}>✦</span>
        </>)}
      </div>

      {ok ? (
        <div className="pq-sub">{`${A} ${MINUS} ${UNITS} ${MINUS} ${B - UNITS} = ${TEN} ${MINUS} ${B - UNITS} = ${TARGET}`}</div>
      ) : (
        <div className={'pq-count' + (removed === B ? ' ready' : '')}>
          <span className="lead">{t.left}</span>
          <b className="big">{A - removed}</b>
          <span className="prog">{t.flew} {removed}/{B}</span>
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
