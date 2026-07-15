// Dars34 · Amaliyot 07 — «Metrdan detsimetrga» · Blok 7 uzunlik · Birlik konversiyasi · 🔴 · tag: convert_m_dm
// Eshik rasmi (balandligi 2 m — o'lchov qavsi bilan) + uch son-karta: [2, 20, 12] — to'g'ri = 20 (index 1). 2 m = 20 dm.
// Distraktorlar: 2 (birlikni o'zgartirmagan) · 12 (10 va 2 ni qo'shgan). Aniq berilgan o'lchov — bir ma'noli javob.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint («Har metrda 10 dm»).
// ANSWER-LEAK: to'g'ri javob g'alabagacha yashil emas; g'alaba-anim review'da qayta o'ynamaydi (.still gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Son-kartalar: 20 NOT-first (index 1). Eshik 2 m = 20 dm (har metr — 10 dm).
const OPTS = [2, 20, 12];
const TARGET = 20;
const DATA = { target: TARGET, options: OPTS, level: '🔴', tag: 'convert_m_dm' };

const T = {
  uz: {
    eyebrow: "Uzunlik · Birlik", title: "Necha detsimetr?",
    ask: "Eshik balandligi 2 metr. Bu necha detsimetr?",
    correct: "Barakalla! 2 metr — bu 20 detsimetr.",
    hint: "Har metrda 10 detsimetr. Ikki metr — 20 detsimetr.",
  },
  ru: {
    eyebrow: "Длина · Единица", title: "Сколько дециметров?",
    ask: "Высота двери 2 метра. Сколько это дециметров?",
    correct: "Молодец! 2 метра — это 20 дециметров.",
    hint: "В каждом метре 10 дециметров. Два метра — 20 дециметров.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Eshik-figura (DATA — berilgan o'lchov: balandligi 2 m, o'lchov qavsi bilan). G'alabada yashil ramka.
const DoorFig = ({ on, hLabel }) => {
  const frame = on ? '#1a7f43' : '#8a6a3e';
  const panel = on ? '#dcf3e5' : '#f0dcae';
  return (
    <svg viewBox="0 0 120 150" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* pol chizig'i */}
      <line x1="8" y1="142" x2="112" y2="142" stroke="#c9b28a" strokeWidth="3" strokeLinecap="round" />
      {/* balandlik o'lchovi — berilgan: 2 m (qavs + yorliq) */}
      <g stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round">
        <line x1="20" y1="15" x2="20" y2="141" />
        <line x1="16" y1="15" x2="24" y2="15" />
        <line x1="16" y1="141" x2="24" y2="141" />
      </g>
      <text x="11" y="78" fontSize="12" fontWeight="800" fill="#c0392b" fontFamily="'Manrope',system-ui,sans-serif" transform="rotate(-90 11 78)" textAnchor="middle">{hLabel}</text>
      {/* eshik ramkasi */}
      <rect x="30" y="14" width="60" height="128" rx="4" fill={frame} />
      {/* eshik yuzasi */}
      <rect x="36" y="20" width="48" height="122" rx="3" fill={panel} stroke={frame} strokeWidth="2" />
      {/* panel chiziqlari */}
      <rect x="43" y="30" width="34" height="42" rx="3" fill="none" stroke={frame} strokeWidth="2" opacity="0.55" />
      <rect x="43" y="82" width="34" height="46" rx="3" fill="none" stroke={frame} strokeWidth="2" opacity="0.55" />
      {/* tutqich */}
      <circle cx="72" cy="88" r="3.4" fill={frame} />
    </svg>
  );
};

export default function D34_07(props) {
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
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTS, studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3407" + (still ? " still" : "")}>
      <style>{`
        .pq3407.still *{animation:none !important;}
        .pq3407.still .pq-spark{opacity:1;}
        .pq3407{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3407 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3407 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3407 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3407 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(#f2f6fb 0%,#e6eef7 100%);border:2px solid #cfe0f0;overflow:hidden;}
        .pq3407 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#4f86c6,#3567a3);border:2.5px solid #2b5486;color:#f0f6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3407 .pq-door{position:relative;z-index:3;width:96px;height:120px;margin:2px auto 14px;}
        .pq3407 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}
        .pq3407 .pq-card{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:16px 6px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #d6dae3;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(40,60,80,.12);}
        .pq3407 .pq-card:hover:not(:disabled){background:#f3f8ff;border-color:#b8d0ea;}
        .pq3407 .pq-card:active:not(:disabled){transform:scale(.98);}
        .pq3407 .pq-card.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3407 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3407cele .5s ease;}
        .pq3407 .pq-card.dim{opacity:.4;filter:saturate(.6);}
        .pq3407 .pq-card:disabled{cursor:default;}
        .pq3407 .pq-unit{font-size:24px;font-weight:800;letter-spacing:.02em;color:#334;}
        .pq3407 .pq-card.right .pq-unit{color:#1a7f43;}
        .pq3407 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3407pop .45s ease both;}
        .pq3407 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3407tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3407 .pq-spark.s2{animation-delay:-.6s;} .pq3407 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3407 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3407in .22s ease both;}
        .pq3407 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3407 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3407pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3407tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3407cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3407in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Eshik — berilgan o'lchov (2 m, DATA; ko'rsatish adolatli). */}
        <div className="pq-door"><DoorFig on={ok} hLabel={lang === 'ru' ? '2 м' : '2 m'} /></div>

        {/* Uch son-karta: 20 NOT-first. G'alabagacha hech biri yashil emas (javob-leak yo'q). */}
        <div className="pq-grid">
          {OPTS.map((u) => {
            const sel = picked === u;
            const right = ok && u === TARGET;
            const dim = ok && u !== TARGET;
            return (
              <button
                key={u}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(u); setFeedback(null); }}
              >
                <span className="pq-unit">{uL(u)}</span>
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '44px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '20px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
