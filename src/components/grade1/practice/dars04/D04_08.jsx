// Dars04 · Amaliyot 08 — P4 Teng qilish (yaratish) · 🔴 · Jasur · tag: make_equal
// Ayiqlarga olma: chapda 6, o'ngda 4. Bola O'NG tovoqni bosib olma qo'shadi (bosgan sari +1,
// qo'shilganini bossa olib tashlanadi) va ikkala tomonni TENG qiladi. Веди-до-верного.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT = 6, START = 4, MAX = 9;
const DATA = { ptype: 'P4', level: '🔴', tag: 'make_equal' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Jasur', title: 'Teng qil',
    setup: 'Ikki ayiqqa olma berildi, lekin biriga kam tegdi — u xafa!',
    ask: 'O\'ng tovoqni bosib olma qo\'shing va ikkala tomonni TENG qiling.',
    correct: 'Barakalla! Endi olti va olti — teng, ikkala ayiq ham xursand.',
    hintLess: 'Hali teng emas. Ikkala tovoqni sanang: qaysinisida kam?',
    hintMore: 'Oshib ketdi. Ikkala tovoqni sanang va ortiqchasini bosib olib tashlang.',
    tapHint: 'Tovoqni bosing',
  },
  ru: {
    eyebrow: 'Зоопарк · Джасур', title: 'Сделай поровну',
    setup: 'Двум мишкам дали яблоки, но одному досталось меньше — он грустит!',
    ask: 'Нажимай на правую миску, добавляй яблоки и сделай ПОРОВНУ.',
    correct: 'Молодец! Теперь шесть и шесть — поровну, оба мишки рады.',
    hintLess: 'Пока не поровну. Посчитай обе миски: где меньше?',
    hintMore: 'Стало больше. Посчитай обе миски и убери лишнее, нажав на яблоко.',
    tapHint: 'Нажимай на миску',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan ayiq (old ko'rinish): jigarrang 2-3 ton, dumaloq quloqlar, tumshuq dog'i,
// blikli ko'zlar. Yuz-holat CSS bilan almashadi: wrapper .sad klassida tushkun qosh va
// egilgan og'iz ko'rinadi, tabassum yashirinadi (o'ng ayiq ok bo'lgach xursand bo'ladi).
const Bear = () => (
  <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
    <g className="pq-ear">
      <circle cx="15" cy="15" r="9" fill="#8a5a33" stroke="#5f3d1e" strokeWidth="1.8" />
      <circle cx="15" cy="15.5" r="4.4" fill="#c68f5c" />
    </g>
    <g className="pq-ear e2">
      <circle cx="49" cy="15" r="9" fill="#8a5a33" stroke="#5f3d1e" strokeWidth="1.8" />
      <circle cx="49" cy="15.5" r="4.4" fill="#c68f5c" />
    </g>
    <circle cx="32" cy="36" r="23" fill="#8a5a33" stroke="#5f3d1e" strokeWidth="1.8" />
    <ellipse cx="32" cy="45" rx="11.5" ry="8.6" fill="#d9ab7a" />
    <ellipse cx="19.5" cy="40" rx="3.4" ry="2.2" fill="#c1794a" opacity=".55" />
    <ellipse cx="44.5" cy="40" rx="3.4" ry="2.2" fill="#c1794a" opacity=".55" />
    <ellipse cx="32" cy="41.5" rx="3.8" ry="3" fill="#3a2413" />
    <circle cx="33.1" cy="40.6" r="1" fill="#fff" opacity=".55" />
    <circle cx="23" cy="31" r="2.7" fill="#1f2430" />
    <circle cx="24" cy="30.1" r="0.9" fill="#fff" />
    <circle cx="41" cy="31" r="2.7" fill="#1f2430" />
    <circle cx="42" cy="30.1" r="0.9" fill="#fff" />
    <path className="pq-smile" d="M26.5 47 Q32 51.5 37.5 47" stroke="#3a2413" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path className="pq-frown" d="M27 50 Q32 45.5 37 50" stroke="#3a2413" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path className="pq-brow" d="M19.5 25.5 L26 28.3" stroke="#5f3d1e" strokeWidth="2" strokeLinecap="round" />
    <path className="pq-brow" d="M44.5 25.5 L38 28.3" stroke="#5f3d1e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function D04_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [right, setRight] = useState(START);
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.right != null) { setRight(initialAnswer.studentAnswer.right); setTouched(true); }
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const lock = isReview || checked;
  const addOne = () => { if (lock || right >= MAX) return; setRight((r) => r + 1); setTouched(true); setFeedback(null); };
  const removeAdded = (i) => {
    if (lock || i < START || right <= START) return; // faqat bola qo'shganlari olinadi
    setRight((r) => r - 1); setFeedback(null);
  };

  const check = useCallback(() => {
    if (!touched) return;
    const correct = right === LEFT;
    const msg = correct ? t.correct : (right < LEFT ? t.hintLess : t.hintMore);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [], studentAnswer: { right }, correctAnswer: { right: LEFT }, correct, meta: { ...DATA } });
  }, [right, touched, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0408">
      <style>{`
        .pq0408{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0408 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a1662f;text-transform:uppercase;}
        .pq0408 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0408 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0408 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0408 .pq-stage{position:relative;display:flex;gap:14px;justify-content:center;align-items:flex-end;}
        .pq0408 .pq-side{display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq0408 .pq-bear{width:56px;height:56px;line-height:0;animation:pqSway 2.8s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0408 .pq-bear svg{display:block;}
        .pq0408 .pq-bear.sad{filter:grayscale(.35) drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0408 .pq-frown,.pq0408 .pq-brow{display:none;}
        .pq0408 .pq-bear.sad .pq-frown,.pq0408 .pq-bear.sad .pq-brow{display:block;}
        .pq0408 .pq-bear.sad .pq-smile{display:none;}
        .pq0408 .pq-ear{transform-box:fill-box;transform-origin:50% 100%;animation:pqEar 4.2s ease-in-out infinite;}
        .pq0408 .pq-ear.e2{animation-delay:2.1s;}
        .pq0408 .pq-tray{position:relative;width:158px;min-height:118px;padding:12px 8px;border-radius:18px;border:3px solid #ecd9c3;background:linear-gradient(#fff,#fbf4ea);display:flex;flex-wrap:wrap;gap:5px;align-items:center;justify-content:center;transition:.15s;}
        .pq0408 .pq-tray.tap{cursor:pointer;border-style:dashed;border-color:#d9ae6e;}
        .pq0408 .pq-tray.tap:hover{border-color:#c2803a;transform:translateY(-2px);}
        .pq0408 .pq-tray.win{border-style:solid;border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0408 .pq-obj{position:relative;font-size:24px;line-height:1;animation:pqDrop .38s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0408 .pq-obj.added{cursor:pointer;}
        .pq0408 .pq-obj.added:hover{transform:scale(1.12);}
        .pq0408 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0408 .pq-chip{position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:2;white-space:nowrap;}
        .pq0408 .pq-taphint{font-size:12.5px;font-weight:700;color:#b98a4e;animation:pqBob 1.8s ease-in-out infinite;}
        .pq0408 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0408 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0408 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqEar{0%,84%,100%{transform:rotate(0);}90%{transform:rotate(-7deg);}95%{transform:rotate(4deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-24px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        {ok && <span className="pq-chip">{LEFT} = {right}</span>}
        <div className="pq-side">
          <span className="pq-bear"><Bear /></span>
          <div className={'pq-tray' + (ok ? ' win' : '')}>
            {Array.from({ length: LEFT }).map((_, i) => (
              <span key={i} className="pq-obj" style={{ animationDelay: `${i * 0.05}s` }}>🍎{ok && <b className="pq-cnt">{i + 1}</b>}</span>
            ))}
          </div>
        </div>
        <div className="pq-side">
          <span className={'pq-bear' + (ok ? '' : ' sad')} style={{ animationDelay: '1.2s' }}><Bear /></span>
          <div className={'pq-tray' + (lock ? '' : ' tap') + (ok ? ' win' : '')} onClick={addOne}>
            {Array.from({ length: right }).map((_, i) => (
              <span key={i} className={'pq-obj' + (i >= START && !lock ? ' added' : '')}
                onClick={(e) => { if (i >= START) { e.stopPropagation(); removeAdded(i); } }}>
                🍎{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
          </div>
          {!lock && <span className="pq-taphint">{t.tapHint}</span>}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
