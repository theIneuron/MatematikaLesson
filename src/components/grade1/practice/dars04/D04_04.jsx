// Dars04 · Amaliyot 04 — P4 Taqqoslash: teng · 🟢 · Jasur · tag: compare_equal
// Pandalarga bambuk: 5 va 5 — «teng» tushunchasi (uch tugma: chapda ko'p / teng / o'ngda ko'p).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT = 5, RIGHT = 5;
const DATA = { ptype: 'P4', level: '🟢', tag: 'compare_equal' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Jasur', title: 'Teng yoki teng emas?',
    setup: 'Jasur ikkala pandaga bambuk tarqatdi.',
    ask: 'Solishtiring: qaysi javob to\'g\'ri?',
    optL: 'Chapda ko\'p', optE: 'Teng', optR: 'O\'ngda ko\'p',
    correct: 'Barakalla! Besh va besh — teng, hech kim xafa bo\'lmaydi.', hint: 'Ikkala tomonni sanang va solishtiring.',
  },
  ru: {
    eyebrow: 'Зоопарк · Джасур', title: 'Поровну или нет?',
    setup: 'Джасур раздал бамбук обеим пандам.',
    ask: 'Сравни: какой ответ верный?',
    optL: 'Слева больше', optE: 'Поровну', optR: 'Справа больше',
    correct: 'Молодец! Пять и пять — поровну, никто не обижен.', hint: 'Посчитай обе стороны и сравни.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan panda (o'tirgan poza): oq tana + ochroq qorin-soya, qora quloq /
// ko'z-dog' / qo'l-oyoq (ikki ton qora), blikli ko'z, tumshuqcha va tabassum.
// Boshi sekin chayqaladi (pq-phead), bir panjasi bambukka intiladi (pq-ppaw).
// flip — ikkinchi panda idishga qarab o'tirishi uchun oynali holat.
const Panda = ({ flip }) => (
  <svg viewBox="0 0 64 66" width="52" height="54" className="pq-pandasvg" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    {/* tana */}
    <ellipse cx="32" cy="44" rx="19" ry="17" fill="#fbfbf7" stroke="#2b2d33" strokeWidth="1.6" />
    <ellipse cx="32" cy="49" rx="11.5" ry="8.5" fill="#eef0ea" />
    {/* orqa oyoq-panjalar (oldinda o'tiradi) */}
    <ellipse cx="17" cy="56" rx="8.5" ry="6.5" fill="#2b2d33" />
    <ellipse cx="47" cy="56" rx="8.5" ry="6.5" fill="#2b2d33" />
    <ellipse cx="17" cy="55" rx="4" ry="3" fill="#4a4d55" />
    <ellipse cx="47" cy="55" rx="4" ry="3" fill="#4a4d55" />
    {/* chap qo'l (tinch), o'ng qo'l bambukka intiladi */}
    <path d="M15 35 Q7.5 41 12 49 Q17 53.5 21 48 Q17 41 19 35 Z" fill="#2b2d33" />
    <path d="M16.5 39 Q14 43 16 47" stroke="#4a4d55" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <g className="pq-ppaw">
      <path d="M45 34 Q56 29 60 37 Q61 45 50 47 Q44 41 45 34 Z" fill="#2b2d33" />
      <path d="M49 38 Q53 36 56 39" stroke="#4a4d55" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
    {/* bosh (sekin chayqaladi) */}
    <g className="pq-phead">
      <circle cx="15.5" cy="8" r="6.8" fill="#2b2d33" />
      <circle cx="48.5" cy="8" r="6.8" fill="#2b2d33" />
      <circle cx="15.5" cy="8" r="3" fill="#4a4d55" />
      <circle cx="48.5" cy="8" r="3" fill="#4a4d55" />
      <ellipse cx="32" cy="18" rx="18.5" ry="15.5" fill="#fbfbf7" stroke="#2b2d33" strokeWidth="1.6" />
      {/* ko'z-dog'lari + blikli ko'zlar */}
      <ellipse cx="24" cy="18" rx="5.8" ry="7.2" fill="#2b2d33" transform="rotate(-14 24 18)" />
      <ellipse cx="40" cy="18" rx="5.8" ry="7.2" fill="#2b2d33" transform="rotate(14 40 18)" />
      <circle cx="25.2" cy="17.6" r="2.5" fill="#fff" />
      <circle cx="38.8" cy="17.6" r="2.5" fill="#fff" />
      <circle cx="25.6" cy="17.9" r="1.5" fill="#1f2430" />
      <circle cx="38.4" cy="17.9" r="1.5" fill="#1f2430" />
      <circle cx="26.2" cy="17.2" r="0.6" fill="#fff" />
      <circle cx="39" cy="17.2" r="0.6" fill="#fff" />
      {/* tumshuqcha va tabassum */}
      <ellipse cx="32" cy="24.5" rx="3" ry="2.2" fill="#1f2430" />
      <path d="M32 26.5 q-0.5 2.6 -3.2 3.2 M32 26.5 q0.5 2.6 3.2 3.2" stroke="#1f2430" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

export default function D04_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 'L' | 'E' | 'R'
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
    const correct = picked === 'E';
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.optL, t.optE, t.optR], studentAnswer: { value: picked }, correctAnswer: { value: 'E' }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const OPTS = [{ id: 'L', label: t.optL }, { id: 'E', label: t.optE }, { id: 'R', label: t.optR }];

  return (
    <div className="pq pq0404">
      <style>{`
        .pq0404{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0404 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a8f4d;text-transform:uppercase;}
        .pq0404 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0404 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0404 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0404 .pq-stage{position:relative;display:flex;gap:10px;justify-content:center;align-items:center;}
        .pq0404 .pq-panda{display:inline-flex;animation:pqSway 3s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0404 .pq-phead{animation:pqPHead 4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 85%;}
        .pq0404 .pq-ppaw{animation:pqPPaw 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:15% 85%;}
        .pq0404 .pq-plate{position:relative;width:140px;min-height:110px;padding:12px 8px;border-radius:18px;border:3px solid #cfe6cf;background:linear-gradient(#fff,#f2faf0);display:flex;flex-wrap:wrap;gap:5px;align-items:center;justify-content:center;}
        .pq0404 .pq-plate.win{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0404 .pq-obj{position:relative;font-size:24px;line-height:1;animation:pqDrop .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0404 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0404 .pq-chip{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:2;white-space:nowrap;}
        .pq0404 .pq-opts{display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .pq0404 .pq-opt{padding:14px 18px;font-size:16.5px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq0404 .pq-opt:hover:not(:disabled){border-color:#a9d4ae;transform:translateY(-2px);}
        .pq0404 .pq-opt:active:not(:disabled){transform:scale(.95);}
        .pq0404 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0404 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0404 .pq-opt:disabled{cursor:default;}
        .pq0404 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0404 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0404 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqPHead{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqPPaw{0%,100%{transform:rotate(0deg);}50%{transform:rotate(-9deg);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-22px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        {ok && <span className="pq-chip">5 = 5</span>}
        <span className="pq-panda"><Panda /></span>
        <div className={'pq-plate' + (ok ? ' win' : '')}>
          {Array.from({ length: LEFT }).map((_, i) => (
            <span key={i} className="pq-obj" style={{ animationDelay: `${i * 0.06}s` }}>🎋{ok && <b className="pq-cnt">{i + 1}</b>}</span>
          ))}
        </div>
        <div className={'pq-plate' + (ok ? ' win' : '')}>
          {Array.from({ length: RIGHT }).map((_, i) => (
            <span key={i} className="pq-obj" style={{ animationDelay: `${(LEFT + i) * 0.06}s` }}>🎋{ok && <b className="pq-cnt">{i + 1}</b>}</span>
          ))}
        </div>
        <span className="pq-panda" style={{ animationDelay: '1.4s' }}><Panda flip /></span>
      </div>

      <div className="pq-opts">
        {OPTS.map((o) => {
          const sel = picked === o.id; const right = ok && o.id === 'E';
          return <button key={o.id} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o.id); setFeedback(null); }}>{o.label}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
