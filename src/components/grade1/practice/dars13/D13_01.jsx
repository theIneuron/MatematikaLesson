// Dars13 · Amaliyot 01 — P1 Sanash «Qalam do'koni» · 🟢 · tag: count_warmup
// Spiral: 10 ichida sanash. Peshtaxtada 7 yakka qalam turibdi — bola sanaydi;
// g'alabada har qalamda ko'k badge 1..7 va chip «7 qalam».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 7, options: [6, 7, 8], ptype: 'P1', level: '🟢', tag: 'count_warmup' };
// 7 yakka qalam — rang aralash, peshtaxtada tik turadi.
const PENCILS = ['yellow', 'blue', 'red', 'green', 'yellow', 'blue', 'red'];
const COLS = {
  yellow: { body: '#f2b134', dark: '#d0912a' },
  red:    { body: '#d9534b', dark: '#b23f38' },
  blue:   { body: '#4f8fc4', dark: '#3a6f9f' },
  green:  { body: '#57a84f', dark: '#438a3d' },
};
// Qalamlarning peshtaxtadagi joyi (sahna px, 344 kenglik).
const XS = [52, 86, 120, 154, 188, 222, 256];

const T = {
  uz: {
    eyebrow: 'Qalam do\'koni · Sanash', title: 'Nechta qalam?',
    setup: 'Bolalar qalam do\'koniga kelishdi! Peshtaxtada qalamlar turibdi.',
    ask: 'Peshtaxtada nechta qalam bor?',
    correct: 'Barakalla! Yettita qalam.',
    hint: 'Har qalamni bir marta sanang.',
    unit: 'qalam',
  },
  ru: {
    eyebrow: 'Магазин карандашей · Счёт', title: 'Сколько карандашей?',
    setup: 'Дети пришли в магазин карандашей! На прилавке стоят карандаши.',
    ask: 'Сколько карандашей на прилавке?',
    correct: 'Молодец! Семь карандашей.',
    hint: 'Считай каждый карандаш один раз.',
    unit: 'каранд.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — rangli tana (2-ton, blik + soya),
// uchida yog'och konus + qora grafit uchi, orqasida metall halqa + pushti o'chirg'ich.
const Pencil = ({ c }) => (
  <svg viewBox="0 0 26 90" width="22" height="76" className="pq-pencilsvg" aria-hidden="true" style={{ display: 'block' }}>
    {/* yog'och konus uchi */}
    <polygon points="13,3 21,27 5,27" fill="#e8c58a" />
    <polygon points="13,3 13,27 21,27" fill="#d4a862" opacity=".55" />
    {/* qora grafit uchi */}
    <polygon points="13,3 16.5,13 9.5,13" fill="#3b3b3b" />
    {/* rangli tana */}
    <rect x="5" y="27" width="16" height="41" fill={c.body} />
    <rect x="6.5" y="27" width="4.5" height="41" fill="#fff" opacity=".22" />
    <rect x="16" y="27" width="5" height="41" fill={c.dark} opacity=".55" />
    {/* metall halqa */}
    <rect x="5" y="68" width="16" height="9" fill="#cdd2d9" />
    <rect x="5" y="70.4" width="16" height="1.6" fill="#a4abb6" />
    <rect x="5" y="73.6" width="16" height="1.6" fill="#a4abb6" />
    {/* pushti o'chirg'ich */}
    <rect x="5" y="77" width="16" height="10" rx="3" fill="#f2a9c0" />
    <rect x="6.5" y="77" width="4.5" height="10" rx="3" fill="#fff" opacity=".28" />
    {/* nozik kontur */}
    <path d="M13 3 L21 27 L21 84 Q21 87 18 87 L8 87 Q5 87 5 84 L5 27 Z" fill="none" stroke="#7a6238" strokeWidth="1" opacity=".3" />
  </svg>
);

// DO'KON SAHNASI (fon): deraza + quyosh, osma lampa, yog'och javon + qalam qutilari +
// narx-yorliq, yog'och peshtaxta (ustki yuza + old taxta + tola chiziqlari).
const ShopBg = () => (
  <svg viewBox="0 0 344 210" width="344" height="210" aria-hidden="true" style={{ display: 'block' }}>
    {/* deraza + quyosh */}
    <rect x="14" y="18" width="64" height="52" rx="4" fill="#c6e6f2" stroke="#b07f4c" strokeWidth="4" />
    <rect x="16" y="20" width="60" height="24" fill="#dcf1f9" opacity=".65" />
    <circle cx="64" cy="34" r="8.5" fill="#ffe08a" />
    <circle cx="64" cy="34" r="8.5" fill="none" stroke="#ffcf5c" strokeWidth="1.6" opacity=".7" />
    <path d="M26 60 q7 -6 14 0 q7 -6 14 0" stroke="#fff" strokeWidth="4" fill="none" opacity=".8" strokeLinecap="round" />
    <line x1="46" y1="18" x2="46" y2="70" stroke="#b07f4c" strokeWidth="3" />
    <line x1="14" y1="44" x2="78" y2="44" stroke="#b07f4c" strokeWidth="3" />
    {/* osma lampa */}
    <line x1="172" y1="0" x2="172" y2="13" stroke="#8a7a5a" strokeWidth="2" />
    <path d="M159 13 L185 13 L179 29 L165 29 Z" fill="#e0b04e" stroke="#b98a2e" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="172" cy="29" rx="8" ry="3.2" fill="#fff3c0" />
    {/* yog'och javon + qalam qutilari */}
    <rect x="176" y="62" width="156" height="10" rx="2" fill="#c99a5c" stroke="#9c7440" strokeWidth="2" />
    <rect x="176" y="62" width="156" height="4" fill="#e0be8c" opacity=".7" />
    {/* quti 1 (qalam tiqilgan) */}
    {[0, 1, 2, 3].map((k) => (
      <rect key={'a' + k} x={200 + k * 6.5} y="44" width="4" height="12" rx="1" fill={['#d9534b', '#4f8fc4', '#f2b134', '#57a84f'][k]} />
    ))}
    <rect x="196" y="50" width="32" height="12" rx="2" fill="#e08a4e" stroke="#b5652f" strokeWidth="1.6" />
    <rect x="196" y="50" width="32" height="4" fill="#f2a86e" opacity=".7" />
    {/* quti 2 */}
    {[0, 1, 2, 3].map((k) => (
      <rect key={'b' + k} x={258 + k * 6.5} y="46" width="4" height="10" rx="1" fill={['#57a84f', '#f2b134', '#4f8fc4', '#d9534b'][k]} />
    ))}
    <rect x="254" y="50" width="32" height="12" rx="2" fill="#6fa8c9" stroke="#457a9c" strokeWidth="1.6" />
    <rect x="254" y="50" width="32" height="4" fill="#9cc7de" opacity=".7" />
    {/* narx-yorliq (raqamsiz) */}
    <line x1="316" y1="62" x2="316" y2="72" stroke="#9c7440" strokeWidth="1.4" />
    <path d="M310 72 L322 72 L325 79 L316 85 L307 79 Z" fill="#fff" stroke="#d0a24e" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="316" cy="76" r="1.6" fill="#d0a24e" />
    {/* peshtaxta */}
    <rect x="0" y="152" width="344" height="58" fill="#c99a5c" />
    <rect x="0" y="146" width="344" height="8" fill="#e6c690" />
    <rect x="0" y="154" width="344" height="3" fill="#a9793f" opacity=".55" />
    {[40, 96, 152, 208, 264, 312].map((x, i) => (
      <line key={i} x1={x} y1="158" x2={x} y2="206" stroke="#a9793f" strokeWidth="1.4" opacity=".4" />
    ))}
    <rect x="0" y="204" width="344" height="6" fill="#a9793f" />
  </svg>
);

// Nomsiz bola — peshtaxta oldida turib qalamlarni sanaydi (o'ng qo'li ko'rsatadi).
const Boy = () => (
  <svg viewBox="0 0 62 80" width="52" height="67" aria-hidden="true" style={{ display: 'block' }}>
    {/* oyoqlar + poyabzal */}
    <rect x="21" y="60" width="7" height="15" rx="3" fill="#3f5b8a" />
    <rect x="34" y="60" width="7" height="15" rx="3" fill="#3f5b8a" />
    <rect x="18" y="73" width="12" height="5" rx="2.5" fill="#5a4634" />
    <rect x="32" y="73" width="12" height="5" rx="2.5" fill="#5a4634" />
    {/* ko'ylak */}
    <path d="M18 42 Q31 38 44 42 L46 62 Q31 65 16 62 Z" fill="#e0703a" />
    <path d="M18 42 Q31 38 44 42 L45 49 Q31 52 17 49 Z" fill="#f28a4e" opacity=".7" />
    {/* chap qo'l (pastda) */}
    <path d="M18 44 Q11 51 13 60" stroke="#e0703a" strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="13.5" cy="61" r="3.4" fill="#f0c199" />
    {/* o'ng qo'l (qalamlarni ko'rsatadi) */}
    <path className="pq-arm" d="M44 44 Q54 40 59 32" stroke="#e0703a" strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="59.5" cy="31" r="3.6" fill="#f0c199" />
    {/* bosh */}
    <circle cx="31" cy="25" r="14" fill="#f0c199" />
    <path d="M17 23 Q18 9 31 9 Q44 9 45 23 Q41 16 31 16 Q21 16 17 23 Z" fill="#4a3826" />
    <circle className="pq-beye" cx="26" cy="25" r="1.9" fill="#2a2a2a" />
    <circle className="pq-beye" cx="36" cy="25" r="1.9" fill="#2a2a2a" />
    <path d="M26 31 Q31 35 36 31" stroke="#c06a4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="22" cy="29" r="2.3" fill="#f3a98a" opacity=".6" />
    <circle cx="40" cy="29" r="2.3" fill="#f3a98a" opacity=".6" />
  </svg>
);

export default function D13_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1301">
      <style>{`
        .pq1301{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1301 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c67f2e;text-transform:uppercase;}
        .pq1301 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1301 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1301 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1301 .pq-scene{position:relative;width:344px;max-width:100%;height:210px;margin:0 auto;border-radius:20px;background:linear-gradient(#fdf3e2 0%,#fae8d0 60%,#f6ddc0 100%);border:2px solid #ecd3b0;overflow:hidden;}
        .pq1301 .pq-bg{position:absolute;inset:0;z-index:0;}
        .pq1301 .pq-glow{position:absolute;top:34px;left:50%;transform:translateX(-50%);width:230px;height:130px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,236,178,.75),rgba(255,236,178,0) 70%);z-index:1;pointer-events:none;animation:pqGlow 4s ease-in-out infinite;}
        .pq1301 .pq-boyw{position:absolute;left:2px;bottom:2px;z-index:2;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));animation:pqBob 2.9s ease-in-out infinite;}
        .pq1301 .pq-arm{transform-box:fill-box;transform-origin:0% 60%;animation:pqPoint 2.4s ease-in-out infinite;}
        .pq1301 .pq-beye{animation:pqBlink 4.2s linear infinite;}
        .pq1301 .pq-pencilw{position:absolute;top:76px;z-index:3;line-height:0;transform-origin:bottom center;filter:drop-shadow(0 2px 1.5px rgba(0,0,0,.16));animation:pqSway 3.1s ease-in-out infinite;}
        .pq1301 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1301 .pq-q{position:absolute;top:32px;left:50%;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:#fff;color:#d6577a;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.14);z-index:5;animation:pqBreath 2.2s ease-in-out infinite;}
        .pq1301 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:20px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);z-index:6;white-space:nowrap;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1301 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq1301 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1301 .pq-opt:hover:not(:disabled){border-color:#f0c98a;transform:translateY(-2px);}
        .pq1301 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1301 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1301 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1301 .pq-opt:disabled{cursor:default;}
        .pq1301 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1301 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1301 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-2deg) translateY(0);}50%{transform:rotate(2.4deg) translateY(-2px);}}
        @keyframes pqGlow{0%,100%{opacity:.6;}50%{opacity:.92;}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqPoint{0%,100%{transform:rotate(0deg);}50%{transform:rotate(-7deg);}}
        @keyframes pqBlink{0%,93%,100%{transform:scaleY(1);}96%{transform:scaleY(.15);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-bg"><ShopBg /></span>
        <span className="pq-glow" />
        <span className="pq-boyw"><Boy /></span>

        {PENCILS.map((col, i) => (
          <span key={i} className="pq-pencilw" style={{ left: XS[i], animationDelay: `${-i * 0.31}s` }}>
            <Pencil c={COLS[col]} />
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.11}s` }}>{i + 1}</b>}
          </span>
        ))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.target} {t.unit}</span>}
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
