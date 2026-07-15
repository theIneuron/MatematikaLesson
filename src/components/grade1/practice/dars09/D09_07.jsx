// Dars09 · Amaliyot 07 — LOGIC Analogiya (A:B :: C:?) · 🔴 · tag: logic_analogy
// Hovuz sahnasi: chapda namuna-juftlik (katta qurbaqa → kichik qurbaqa), o'ngda katta
// nilufar-barg → «?». Variantlar — 3 mini-rasm karta; g'alabada «?» o'rniga kichik barg.
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

const CORRECT = 0; // 'kichik barg'
const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_analogy' };
const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Mantiq', title: 'Juftlikni top',
    setup: 'Qarang: katta qurbaqaning juftligi — kichik qurbaqa. Endi katta bargning juftligini toping!',
    ask: 'Belgi o\'rniga nima keladi?',
    correct: 'Barakalla! Katta bargning juftligi — kichik barg. Xuddi qurbaqalardagidek!',
    hint: 'Chapdagi juftlikka qarang: katta narsaning juftligi qanday bo\'lgan? O\'ngda ham shunday bo\'lsin.',
    opts: ['kichik barg', 'katta barg', 'kichik qurbaqa'],
  },
  ru: {
    eyebrow: 'У пруда · Логика', title: 'Найди пару',
    setup: 'Смотри: пара большой лягушки — маленькая лягушка. Теперь найди пару большого листа!',
    ask: 'Что встанет вместо знака вопроса?',
    correct: 'Молодец! Пара большого листа — маленький лист. Совсем как у лягушек!',
    hint: 'Посмотри на пару слева: какой была пара большого? Пусть справа будет так же.',
    opts: ['маленький лист', 'большой лист', 'маленькая лягушка'],
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza, yashil 2-3 ton (tana #57a84f, qorin #a8d89e, kontur
// #2e6e28), tepada ikki bo'rtiq katta ko'z (pirpiratadi), keng tabassum, old panjalar
// oldda, orqa oyoq bukilgan. bd — pirpiratish fazasi (har nusxada har xil).
const Frog = ({ w = 96, bd = '0s' }) => (
  <svg viewBox="0 0 96 88" width={w} height={(w * 88) / 96} aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="18" cy="66" rx="15" ry="13" fill="#4c9a45" stroke="#2e6e28" strokeWidth="2" />
    <ellipse cx="78" cy="66" rx="15" ry="13" fill="#4c9a45" stroke="#2e6e28" strokeWidth="2" />
    <path d="M10 75 q-6 3 -9 2 M12 78 q-5 4 -8 4 M15 80 q-3 4 -6 6" stroke="#2e6e28" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M86 75 q6 3 9 2 M84 78 q5 4 8 4 M81 80 q3 4 6 6" stroke="#2e6e28" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="48" cy="56" rx="30" ry="26" fill="#57a84f" stroke="#2e6e28" strokeWidth="2.5" />
    <ellipse cx="48" cy="64" rx="20" ry="15" fill="#a8d89e" />
    <ellipse className="pq-throat" cx="48" cy="58" rx="11" ry="6.5" fill="#c4e6ba" />
    <circle cx="33" cy="18" r="12" fill="#57a84f" stroke="#2e6e28" strokeWidth="2.5" />
    <circle cx="63" cy="18" r="12" fill="#57a84f" stroke="#2e6e28" strokeWidth="2.5" />
    <circle cx="33" cy="18" r="8" fill="#fff" />
    <circle cx="63" cy="18" r="8" fill="#fff" />
    <circle cx="34" cy="19" r="3.6" fill="#1f2430" />
    <circle cx="62" cy="19" r="3.6" fill="#1f2430" />
    <circle cx="35.4" cy="17.4" r="1.3" fill="#fff" />
    <circle cx="63.4" cy="17.4" r="1.3" fill="#fff" />
    <g className="pq-blink" style={{ animationDelay: bd }}>
      <circle cx="33" cy="18" r="8.6" fill="#57a84f" />
      <circle cx="63" cy="18" r="8.6" fill="#57a84f" />
    </g>
    <circle cx="43" cy="36" r="1.4" fill="#2e6e28" />
    <circle cx="53" cy="36" r="1.4" fill="#2e6e28" />
    <path d="M28 44 Q48 56 68 44" stroke="#2e6e28" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M35 68 Q33 76 30 79" stroke="#3f8a38" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M61 68 Q63 76 66 79" stroke="#3f8a38" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M30 79 q-4 2 -7 1 M30 79 q-2 3 -5 4 M30 79 q1 3 0 5" stroke="#2e6e28" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M66 79 q4 2 7 1 M66 79 q2 3 5 4 M66 79 q-1 3 0 5" stroke="#2e6e28" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// Nilufar-barg: dumaloq yashil barg 2-ton + kontur, o'ng tomonda V-kesik, tomirlar.
const Leaf = ({ w = 84 }) => (
  <svg viewBox="0 0 100 72" width={w} height={(w * 72) / 100} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M50 36 L92 15 A46 32 0 1 0 92 57 Z" fill="#4f9a48" stroke="#2e6e28" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 36 L83 21 A34 23 0 1 0 83 51 Z" fill="#6cbb62" opacity=".55" />
    <path d="M50 36 L21 15 M50 36 L9 33 M50 36 L18 55 M50 36 L46 65 M50 36 L74 62" stroke="#3c8038" strokeWidth="1.7" opacity=".55" fill="none" strokeLinecap="round" />
    <ellipse cx="30" cy="20" rx="9" ry="4.5" fill="#8fd486" opacity=".5" transform="rotate(-24 30 20)" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 34 20" width="28" height="17" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
    <line x1="3" y1="10" x2="23" y2="10" stroke="#8a94a6" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M20 3 L30 10 L20 17" fill="none" stroke="#8a94a6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Ninachi: ingichka tana + 2 juft shaffof pirpiratuvchi qanot; sahnada suzib yuradi.
const Dragonfly = () => (
  <svg viewBox="0 0 46 26" width="40" height="23" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-dwing"><ellipse cx="23" cy="6.5" rx="10" ry="3.6" fill="#cfe6fb" opacity=".75" transform="rotate(-16 23 6.5)" /></g>
    <g className="pq-dwing w2"><ellipse cx="21" cy="17.5" rx="9" ry="3.2" fill="#dceefc" opacity=".7" transform="rotate(14 21 17.5)" /></g>
    <line x1="4" y1="14" x2="30" y2="12.4" stroke="#4177c2" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="34" cy="12" r="4" fill="#35619f" />
    <circle cx="36" cy="10.6" r="1.1" fill="#fff" opacity=".8" />
  </svg>
);

// Qamishlar (sway) — chap qirg'oqda; o'ngda scaleX(-1) bilan takror.
const Reeds = () => (
  <svg viewBox="0 0 60 96" width="52" height="83" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-reed">
      <path d="M14 96 Q12 60 16 34" stroke="#3e8e46" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="16.5" cy="26" rx="4.5" ry="12" fill="#7a5b3a" />
    </g>
    <g className="pq-reed" style={{ animationDelay: '-1.3s' }}>
      <path d="M32 96 Q34 52 30 18" stroke="#4f9a48" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="29.5" cy="11" rx="4" ry="10.5" fill="#8a6a43" />
    </g>
    <g className="pq-reed" style={{ animationDelay: '-2.4s' }}>
      <path d="M48 96 Q50 66 46 44" stroke="#3e8e46" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="45.5" cy="37" rx="3.6" ry="9.5" fill="#7a5b3a" />
    </g>
  </svg>
);

export default function D09_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: t.opts,
      studentAnswer: { value: picked, label: t.opts[picked] },
      correctAnswer: { value: CORRECT, label: t.opts[CORRECT] },
      correct, meta: { ...DATA },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq0907" ref={fitRef}>
      <style>{`
        .pq0907{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0907 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b8a8f;text-transform:uppercase;}
        .pq0907 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0907 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0907 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0907 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:244px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 24%,#8ed0d8 30%,#6fc0bd 62%,#57ab9d 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0907 .pq-fit{position:relative;margin:0 auto;}
        .pq0907 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0907 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0907 .pq-cloud.c1{top:14px;left:-70px;animation-duration:32s;animation-delay:-13s;}
        .pq0907 .pq-cloud.c2{top:38px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:44s;animation-delay:-28s;}
        .pq0907 .pq-shore{position:absolute;bottom:0;width:96px;height:24px;background:#7fb96e;border-radius:100% 100% 0 0/200% 200% 0 0;z-index:1;}
        .pq0907 .pq-shore.l{left:-18px;} .pq0907 .pq-shore.r{right:-18px;}
        .pq0907 .pq-reeds{position:absolute;left:2px;bottom:2px;z-index:2;}
        .pq0907 .pq-reeds.r{left:auto;right:2px;transform:scaleX(-1);}
        .pq0907 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSwayR 3.8s ease-in-out infinite;}
        .pq0907 .pq-ring{position:absolute;width:34px;height:12px;border:2px solid rgba(255,255,255,.75);border-radius:50%;animation:pqRing 4.2s ease-out infinite;z-index:1;}
        .pq0907 .pq-ring.r1{left:150px;top:206px;}
        .pq0907 .pq-ring.r2{left:296px;top:188px;animation-delay:-2.1s;}
        .pq0907 .pq-dfly{position:absolute;left:56px;top:34px;z-index:5;animation:pqDfly 14s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0907 .pq-dwing{transform-box:fill-box;transform-origin:center;animation:pqFlut .16s ease-in-out infinite alternate;}
        .pq0907 .pq-dwing.w2{animation-delay:-.08s;}
        .pq0907 .pq-throat{transform-box:fill-box;transform-origin:center;animation:pqThroat 2.3s ease-in-out infinite;}
        .pq0907 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;}
        .pq0907 .pq-pair{position:absolute;top:78px;left:10px;width:170px;height:114px;display:flex;align-items:center;justify-content:center;gap:5px;padding:6px;background:rgba(255,255,255,.8);border:3px solid rgba(206,226,236,.95);border-radius:16px;z-index:4;animation:pqFloat 4.6s ease-in-out infinite;}
        .pq0907 .pq-pair.q{left:auto;right:10px;animation-delay:-2.3s;}
        .pq0907 .pq-pair.win{animation:pqCele .5s ease;border-color:#1a7f43;background:rgba(232,247,238,.94);}
        .pq0907 .pq-rock{animation:pqRock 3.6s ease-in-out infinite;}
        .pq0907 .pq-pair.q .pq-rock{animation-delay:-1.6s;}
        .pq0907 .pq-qbox{width:52px;height:52px;flex:none;display:flex;align-items:center;justify-content:center;border:3px dashed #7d8aa0;border-radius:14px;background:rgba(255,255,255,.8);font-size:30px;font-weight:900;color:#5c6672;animation:pqQ 2.2s ease-in-out infinite;}
        .pq0907 .pq-dropin{animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0907 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0907 .pq-opt{width:96px;height:88px;display:flex;align-items:center;justify-content:center;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;transition:.12s;}
        .pq0907 .pq-opt:hover:not(:disabled){border-color:#9fd2cd;transform:translateY(-2px);}
        .pq0907 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0907 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0907 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0907 .pq-opt:disabled{cursor:default;}
        .pq0907 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0907 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0907 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSwayR{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqRing{0%{opacity:0;transform:scale(.25);}12%{opacity:.85;}55%{opacity:0;transform:scale(1.7);}100%{opacity:0;transform:scale(1.7);}}
        @keyframes pqDfly{0%{transform:translate(0,0) scaleX(1);}24%{transform:translate(128px,24px) scaleX(1);}48%{transform:translate(238px,52px) scaleX(1);}54%{transform:translate(230px,58px) scaleX(-1);}76%{transform:translate(96px,84px) scaleX(-1);}94%{transform:translate(4px,8px) scaleX(-1);}100%{transform:translate(0,0) scaleX(1);}}
        @keyframes pqFlut{from{transform:scaleY(1);}to{transform:scaleY(.5);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqFloat{0%,100%{margin-top:0;}50%{margin-top:-3px;}}
        @keyframes pqRock{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-32px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 244 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-shore l" /><span className="pq-shore r" />
        <span className="pq-reeds"><Reeds /></span>
        <span className="pq-reeds r"><Reeds /></span>
        <span className="pq-ring r1" /><span className="pq-ring r2" />
        <span className="pq-dfly"><Dragonfly /></span>

        {/* Namuna-juftlik: katta qurbaqa → kichik qurbaqa */}
        <div className={'pq-pair' + (ok ? ' win' : '')}>
          <Frog w={74} bd="-1.1s" /><Arrow /><Frog w={42} bd="-2.4s" />
        </div>
        {/* Savol-juftlik: katta barg → «?» (g'alabada kichik barg tushadi) */}
        <div className={'pq-pair q' + (ok ? ' win' : '')}>
          <span className="pq-rock"><Leaf w={70} /></span><Arrow />
          {ok
            ? <span className="pq-dropin"><Leaf w={42} /></span>
            : <span className="pq-qbox">?</span>}
        </div>
      </div>
      </div>

      <div className="pq-opts">
        {t.opts.map((label, i) => {
          const sel = picked === i; const right = ok && i === CORRECT;
          return (
            <button key={i} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')}
              disabled={lock} onClick={() => { setPicked(i); setFeedback(null); }} aria-label={label}>
              {i === 0 && <Leaf w={32} />}
              {i === 1 && <Leaf w={64} />}
              {i === 2 && <Frog w={36} bd="-0.6s" />}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
