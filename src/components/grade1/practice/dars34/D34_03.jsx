// Dars34 · Amaliyot 03 — «Uzunligini o'lchang» · Blok 7 uzunlik · O'lcha (sm) · 🟡 · tag: measure_cm
// Chizg'ich (0..15 sm, dm-belgilari uzunroq) ustida rangli cho'p: chap uchi 0-belgida, o'ng uchi 9-belgida (9 sm).
// Variantlar-matn: ['10 sm','9 sm','8 sm'] — 9 NOT-first. Distraktorlar: 10 va 8 (bir belgiga adashish, M1/chegara).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint o'qishni o'rgatadi (0'dan o'ng uchgacha sanang).
// ANSWER-LEAK: chizg'ich+cho'p — DATA (ko'rsatish halol); javob — bolaning o'qishi; to'g'ri variant g'alabagacha yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); belgi/uchqun yakuniy holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// O'lchov: cho'p uzunligi = 9 sm (0..9 belgi). Chizg'ich 0..15 sm; sm = 20px; 0-belgi x=16.
const LEN = 9;
const X0 = 16, PX = 20, MARKS = 15;
const xAt = (n) => X0 + n * PX;
const OPTIONS = ['10 sm', '9 sm', '8 sm']; // 9 sm — NOT-first (index 1)
const CORRECT = '9 sm';
const DATA = { len: LEN, unit: 'sm', options: OPTIONS, correct: CORRECT, level: '🟡', tag: 'measure_cm' };

const T = {
  uz: {
    eyebrow: "Uzunlik · O'lchash", title: "Uzunligini o'lchang",
    ask: "Uzunligi necha sm?",
    correct: "Barakalla! Cho'p 9 sm.",
    hint: "0'dan o'ng uchgacha belgilarni sanang.",
  },
  ru: {
    eyebrow: "Длина · Измерение", title: "Измерь длину",
    ask: "Какая длина в см?",
    correct: "Молодец! Полоска 9 см.",
    hint: "Считай деления от 0 до правого конца.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizg'ich (yog'och) + rangli cho'p. dm-belgilari (0 va 10) uzunroq/qalinroq. on=g'alabada cho'p uchida belgi.
const RulerFig = ({ on }) => {
  const ticks = [];
  for (let n = 0; n <= MARKS; n++) {
    const x = xAt(n);
    const isDm = n % 10 === 0;         // 0 va 10 — dm belgisi (uzunroq/qalinroq)
    const tickH = isDm ? 20 : 11;
    ticks.push(<line key={'t' + n} x1={x} y1={54} x2={x} y2={54 + tickH} stroke="#7a5a2e" strokeWidth={isDm ? 2.2 : 1.2} />);
    ticks.push(<text key={'n' + n} x={x} y={88} textAnchor="middle" fontSize="9" fontWeight={isDm ? 800 : 600} fill="#6b4f28" fontFamily="'JetBrains Mono',monospace">{n}</text>);
  }
  const xEnd = xAt(LEN);
  return (
    <svg viewBox="0 0 330 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* O'lchanadigan cho'p (ustida): chap uchi 0-belgida, o'ng uchi 9-belgida */}
      <g>
        <rect x={X0} y={18} width={xEnd - X0} height={16} rx={7} fill={on ? '#cdefd8' : '#f6c4d2'} stroke={on ? '#1a7f43' : '#d05f7d'} strokeWidth="2" />
        <rect x={X0} y={18} width={xEnd - X0} height={16} rx={7} fill="url(#pq3403gl)" opacity="0.35" />
        {/* uch chegaralari — o'ng uch g'alabada belgilanadi */}
        <line x1={X0} y1={14} x2={X0} y2={38} stroke={on ? '#1a7f43' : '#b84c68'} strokeWidth="2.4" strokeLinecap="round" />
        <line x1={xEnd} y1={14} x2={xEnd} y2={38} stroke={on ? '#1a7f43' : '#b84c68'} strokeWidth="2.4" strokeLinecap="round" />
        {on && <circle className="pq-endmark" cx={xEnd} cy={26} r="7" fill="#1a7f43" stroke="#fff" strokeWidth="2" />}
      </g>
      {/* Chizg'ich tanasi (yog'och) */}
      <rect x={4} y={44} width={322} height={12} rx={3} fill="#e8c98a" stroke="#b6924e" strokeWidth="1.4" />
      <defs>
        <linearGradient id="pq3403gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      {ticks}
    </svg>
  );
};

export default function D34_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => lang === 'ru' ? String(s).replace(/sm/g, 'см').replace(/dm/g, 'дм').replace(/m/g, 'м') : s;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS, studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3403" + (still ? " still" : "")}>
      <style>{`
        .pq3403.still *{animation:none !important;}
        .pq3403.still .pq-endmark{opacity:1;}
        .pq3403.still .pq-spark{opacity:1;}
        .pq3403{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3403 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a2b;text-transform:uppercase;}
        .pq3403 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3403 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3403 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(#fbf6ee 0%,#f4e9d6 100%);border:2px solid #e6d3af;overflow:hidden;}
        .pq3403 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d29a4e,#b67c33);border:2.5px solid #9a6526;color:#fff8ee;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3403 .pq-scene{box-sizing:border-box;position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto 16px;padding:6px 4px;border-radius:14px;background:rgba(255,255,255,.85);border:2px solid #ead9b8;}
        .pq3403 .pq-ruler{width:100%;height:auto;}
        .pq3403 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}
        .pq3403 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;min-height:54px;padding:10px 6px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e0d3b8;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(90,70,40,.12);font-size:19px;font-weight:800;color:#5a4a2e;font-family:'JetBrains Mono',monospace;}
        .pq3403 .pq-opt:hover:not(:disabled){background:#fff8ea;border-color:#e3c98a;}
        .pq3403 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3403 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3403 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3403cele .5s ease;}
        .pq3403 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3403 .pq-opt:disabled{cursor:default;}
        .pq3403 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3403pop .45s ease both;}
        .pq3403 .pq-endmark{animation:pq3403pop .45s ease both;}
        .pq3403 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3403tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3403 .pq-spark.s2{animation-delay:-.6s;} .pq3403 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3403 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3403in .22s ease both;}
        .pq3403 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3403 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3403pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3403tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3403cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3403in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Chizg'ich + cho'p — DATA (halol ko'rsatiladi); javob bolaning o'qishi */}
        <div className="pq-scene"><div className="pq-ruler"><RulerFig on={ok} /></div></div>

        {/* Matn-variantlar: 9 sm NOT-first. G'alabagacha barchasi neytral (yashil emas). */}
        <div className="pq-opts">
          {OPTIONS.map((o) => {
            const sel = picked === o;
            const right = ok && o === CORRECT;
            const dim = ok && o !== CORRECT;
            return (
              <button
                key={o}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o); setFeedback(null); }}
              >
                {uL(o)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '52px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '64px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '40px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
