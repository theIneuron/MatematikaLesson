// Dars35 · Amaliyot 08 — «Massa · kilogramm» · Blok 7 · 🔴 · tag: multi_5kg
// KONSEPT: jami 5 kg. Ko'p-tanlov: 4 juft-karta, jami 5 kg bo'lganlarini BARCHASINI belgilang.
// TAROZI (kanon): markaziy stend + muvozanatli richag (rotate 0), o'ng pallada 5 kg toshi = nishon (5 kg).
// Kartalar: [0] 2+3=5 to'g'ri  [1] 4+1=5 to'g'ri  [2] 1+4=5 to'g'ri  [3] 2+2=4 tuzoq (M3 kg-yig'indi xato).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint yig'indini o'rgatadi.
// Win-reveal: har to'g'ri kartada «= 5 kg» + uchqun; tuzoq xiralashadi. uL — RU'da kg→кг.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 5;
const CARDS = [
  { a: 2, b: 3 }, // 5 to'g'ri
  { a: 4, b: 1 }, // 5 to'g'ri
  { a: 1, b: 4 }, // 5 to'g'ri
  { a: 2, b: 2 }, // 4 tuzoq
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} kg + ${c.b} kg`;

const DATA = { good: GOOD, target: TARGET, unit: 'kg', ptype: 'multi', level: '🔴', tag: 'multi_5kg' };

const T = {
  uz: {
    eyebrow: "Massa · Kilogramm",
    title: "Nishon: 5 kg",
    setup: "Tarozida nishon — 5 kg.",
    ask: "Jami 5 kg bo'lgan barcha juftlarni belgilang.",
    correct: "Barakalla! Uch juftning jami 5 kg.",
    hint: "Har juftni qo'shing: jami 5 kg mi?",
  },
  ru: {
    eyebrow: "Масса · Килограмм",
    title: "Цель: 5 кг",
    setup: "На весах цель — 5 кг.",
    ask: "Отметь все пары, дающие 5 кг.",
    correct: "Молодец! У трёх пар всего 5 кг.",
    hint: "Сложи каждую пару: получается 5 кг?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

// TAROZI kanon: muvozanatli (rotate 0). O'ng palla toshi = nishon 5 kg. Tilt STATE emas — bu yerda doim balans.
const Balance = ({ celebrate }) => (
  <svg viewBox="0 0 176 116" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
    {/* asos + post */}
    <rect x="66" y="98" width="44" height="9" rx="4" fill="#8a6a34" />
    <rect x="83" y="30" width="10" height="70" rx="4" fill="#a9843f" stroke="#875f24" strokeWidth="1" />
    <circle cx="88" cy="29" r="5.5" fill="#c79b52" stroke="#875f24" strokeWidth="1.4" />
    {/* richag — muvozanat (rotate 0) */}
    <g style={{ transform: 'rotate(7deg)', transformOrigin: '88px 29px' }}>
      <rect x="20" y="26.5" width="136" height="5.5" rx="2.7" fill="#c79b52" stroke="#875f24" strokeWidth="1" />
      {/* chap palla */}
      <line x1="30" y1="30" x2="30" y2="52" stroke="#9a7b3a" strokeWidth="1.6" />
      <path d="M14 52 h32 l-6 15 h-20 z" fill="#e3ba6b" stroke="#b98f3e" strokeWidth="1.4" />
      {/* o'ng palla + 5 kg tosh (nishon) */}
      <line x1="146" y1="30" x2="146" y2="52" stroke="#9a7b3a" strokeWidth="1.6" />
      <path d="M130 52 h32 l-6 15 h-20 z" fill="#e3ba6b" stroke="#b98f3e" strokeWidth="1.4" />
      <g className={'pq-weight' + (celebrate ? ' win' : '')}>
        <path d="M137 34 h18 l4 16 h-26 z" fill="#8f9aa6" stroke="#5f6a76" strokeWidth="1.4" />
        <rect x="141.5" y="30" width="9" height="6" rx="3" fill="none" stroke="#5f6a76" strokeWidth="1.6" />
        <text x="146" y="47" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="inherit">5</text>
      </g>
    </g>
  </svg>
);

export default function D35_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => (lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s);
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(cardLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3508" + (still ? " still" : "")}>
      <style>{`
        .pq3508.still *{animation:none !important;}
        .pq3508{box-sizing:border-box;max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3508 *{box-sizing:border-box;}
        .pq3508 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06a1e;text-transform:uppercase;}
        .pq3508 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3508 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3508 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq3508 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#fdf3e0 0%,#f6e8cd 60%,#efd9b0 100%);border:2px solid #e6d3a8;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);padding:14px 12px 12px;}
        .pq3508 .pq-tarozi{position:relative;width:200px;max-width:70%;margin:0 auto 2px;}
        .pq3508 .pq-tbadge{position:relative;z-index:2;display:block;text-align:center;margin-top:2px;font-size:13px;font-weight:800;color:#8a621f;letter-spacing:.02em;}
        .pq3508 .pq-weight{transform-box:fill-box;transform-origin:50% 100%;animation:pq3508breath 2.6s ease-in-out infinite;}
        .pq3508 .pq-weight.win{animation:pq3508cele .6s ease;}

        .pq3508 .pq-cards{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:14px 6px 4px;}
        .pq3508 .pq-card{position:relative;min-width:130px;flex:1 1 130px;max-width:190px;display:flex;align-items:center;justify-content:center;padding:15px 12px;border-radius:16px;border:2.5px solid #dccfa8;background:#ffffff;color:#3a3324;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(120,90,30,.14);font-family:inherit;}
        .pq3508 .pq-card:hover:not(:disabled){border-color:#e6b556;transform:translateY(-2px);box-shadow:0 5px 12px rgba(120,90,30,.2);}
        .pq3508 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3508 .pq-card:disabled{cursor:default;}
        .pq3508 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq3508 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq3508cele .55s ease;}
        .pq3508 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq3508 .pq-clabel{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;justify-content:center;font-size:21px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq3508 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq3508 .pq-eq{color:#1a7f43;font-size:17px;font-weight:900;white-space:nowrap;animation:pq3508pop .4s ease both;}
        .pq3508 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pq3508tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq3508 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3508in .22s ease both;}
        .pq3508 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3508 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3508breath{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-1.5px) scale(1.04);}}
        @keyframes pq3508pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3508tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3508cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3508in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-tarozi"><Balance celebrate={ok} /></div>
        <span className="pq-tbadge">{t.title}</span>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={uL(cardLabel(c))}>
                <div className="pq-clabel">
                  <span>{uL(cardLabel(c))}</span>
                  {ok && good && <b className="pq-eq">{uL('= 5 kg')}</b>}
                </div>
                {ok && good && <span className="pq-spark"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
