// Dars33 · Amaliyot 09 — «Sharni bosing» · Blok 7 geometriya · Hajmli vs tekis (M5) · 🔴 · tag: solid_flat
// Uch karta: [doira (TEKIS doira), shar (3D shar = radial soya, TO'G'RI, index 1), kub (3D kub)].
// M5 tuzoq: tekis doira sharga o'xshaydi, lekin hajmi yo'q. Distraktorlar: doira (tekis), kub (boshqa jism).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint farqni o'rgatadi («Doira tekis, shar hajmli»).
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); karta yakuniy yashil holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Kartalar: shar NOT-first (index 1). Har biri o'z inline-SVG figurasiga ega (kind orqali tanlanadi).
const CARDS = [
  { id: 'doira', kind: 'doira' }, // TEKIS doira — soyasiz (M5 tuzoq)
  { id: 'shar', kind: 'shar' },   // 3D SHAR — radial soya (TO'G'RI, index 1)
  { id: 'kub', kind: 'kub' },     // 3D KUB — boshqa hajmli jism
];
const TARGET = 'shar';
const DATA = { target: TARGET, options: CARDS.map((c) => c.kind), level: '🔴', tag: 'solid_flat' };

const T = {
  uz: {
    eyebrow: "Geometriya · Hajmli shakllar", title: "Tekis va hajmli",
    ask: "Sharni bosing.",
    correct: "Barakalla! Shar — hajmli (yumaloq jism).",
    hint: "Doira tekis, shar hajmli.",
    l_doira: "doira", l_shar: "shar", l_kub: "kub",
  },
  ru: {
    eyebrow: "Геометрия · Объёмные фигуры", title: "Плоское и объёмное",
    ask: "Нажми на шар.",
    correct: "Молодец! Шар — объёмный (круглое тело).",
    hint: "Круг плоский, шар объёмный.",
    l_doira: "круг", l_shar: "шар", l_kub: "куб",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Figura-kartalar (kanon viewBox 0 0 130 64). on=true => yashil (faqat g'alabadan keyin).
const ShapeFig = ({ kind, on, uid }) => {
  const line = on ? '#1a7f43' : '#3f6b8c';
  if (kind === 'doira') {
    // TEKIS doira — bir tekis pastel to'ldirish, soyasiz.
    return (
      <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
        <circle cx="65" cy="32" r="23" fill="#dce9f7" stroke={line} strokeWidth="3" />
      </svg>
    );
  }
  if (kind === 'shar') {
    // 3D SHAR — radial gradient soya (yorug'lik yuqori-chapda) => hajm.
    const gid = 'shar' + uid, gh = 'sharh' + uid;
    return (
      <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
        <defs>
          <radialGradient id={gid} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#f4f9ff" />
            <stop offset="42%" stopColor="#bcd6f2" />
            <stop offset="100%" stopColor="#5b86b3" />
          </radialGradient>
          <radialGradient id={gh} cx="36%" cy="28%" r="26%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="66" cy="55" rx="20" ry="4" fill="#243a52" opacity="0.14" />
        <circle cx="65" cy="30" r="23" fill={`url(#${gid})`} stroke={line} strokeWidth="3" />
        <circle cx="65" cy="30" r="23" fill={`url(#${gh})`} />
      </svg>
    );
  }
  // 3D KUB — old kvadrat + yon va ustki qirralar (offset), yengil soya.
  const top = on ? '#bfe6cd' : '#cfe0f2', side = on ? '#a4d8b6' : '#b6cbe4', face = on ? '#e2f6ea' : '#e7f0fb';
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* ustki yuza */}
      <polygon points="49,20 78,20 92,10 63,10" fill={top} stroke={line} strokeWidth="3" strokeLinejoin="round" />
      {/* yon yuza */}
      <polygon points="78,20 78,50 92,40 92,10" fill={side} stroke={line} strokeWidth="3" strokeLinejoin="round" />
      {/* old yuza */}
      <rect x="49" y="20" width="29" height="30" fill={face} stroke={line} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
};

export default function D33_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
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
    onSubmit?.({ questionText: t.ask, options: CARDS.map((c) => c.kind), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3309" + (still ? " still" : "")}>
      <style>{`
        .pq3309.still *{animation:none !important;}
        .pq3309{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3309 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3309 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3309 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3309 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(#eef4fb 0%,#dfeaf5 100%);border:2px solid #cfe0f0;overflow:hidden;}
        .pq3309 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#4f86c6,#3567a3);border:2.5px solid #2b5486;color:#f0f6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3309 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}
        .pq3309 .pq-card{box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 9px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #d6dae3;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(40,60,80,.12);}
        .pq3309 .pq-card:hover:not(:disabled){background:#f3f8ff;border-color:#b8d0ea;}
        .pq3309 .pq-card:active:not(:disabled){transform:scale(.98);}
        .pq3309 .pq-card.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3309 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3309cele .5s ease;}
        .pq3309 .pq-card.dim{opacity:.4;filter:saturate(.6);}
        .pq3309 .pq-card:disabled{cursor:default;}
        .pq3309 .pq-fig{width:100%;height:56px;}
        .pq3309 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#7c8797;}
        .pq3309 .pq-card.right .pq-lab{color:#1a7f43;}
        .pq3309 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3309pop .45s ease both;}
        .pq3309 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3309tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3309 .pq-spark.s2{animation-delay:-.6s;} .pq3309 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3309 .still .pq-tick{opacity:1;}
        .pq3309 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3309in .22s ease both;}
        .pq3309 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3309 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3309pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3309tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3309cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3309in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Uch karta: shar NOT-first. G'alabagacha tur-nomlari yozilmaydi (javob-leak yo'q). */}
        <div className="pq-grid">
          {CARDS.map((c) => {
            const sel = picked === c.id;
            const right = ok && c.id === TARGET;
            const dim = ok && c.id !== TARGET;
            const lab = c.kind === 'doira' ? t.l_doira : c.kind === 'shar' ? t.l_shar : t.l_kub;
            return (
              <button
                key={c.id}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(c.id); setFeedback(null); }}
              >
                <span className="pq-fig"><ShapeFig kind={c.kind} on={right} uid={c.id} /></span>
                {ok && <span className="pq-lab">{lab}</span>}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '46px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '58px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '34px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
