// Dars20 · Amaliyot 08 — Ko'p-tanlov «Yettita garaj» · 🔴 · tag: sub_multi
// Garaj do'koni: 5 ifoda-karta. Ayirmasi aynan YETTI (7) bo'lganlarni BARCHASINI belgila.
// [0] "13 − 6" =7 ✓  [1] "15 − 8" =7 ✓  [2] "12 − 5" =7 ✓
// [3] "14 − 6" =8 ✗ tuzoq  [4] "11 − 3" =8 ✗ tuzoq. GOOD = {0,1,2}.
// Barcha son 0-20. MINUS = U+2212. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 7;
// Har karta: a − b ayirma.
const CARDS = [
  { a: 13, b: 6 }, // 13 − 6 = 7 ✓
  { a: 15, b: 8 }, // 15 − 8 = 7 ✓
  { a: 12, b: 5 }, // 12 − 5 = 7 ✓
  { a: 14, b: 6 }, // 14 − 6 = 8 ✗ tuzoq
  { a: 11, b: 3 }, // 11 − 3 = 8 ✗ tuzoq
];
const cardVal = (c) => c.a - c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} − ${c.b}`;

const DATA = { good: [0, 1, 2], target: 7, ptype: 'P13', level: '🔴', tag: 'sub_multi' };

// Mashina rang palitrasi (2-ton tana). Aylanma: qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { c: '#e2635b', d: '#c23f37' }, // qizil
  { c: '#4a90d9', d: '#2f6fb3' }, // ko'k
  { c: '#f2b134', d: '#cf9016' }, // sariq
  { c: '#57a84f', d: '#3d8038' }, // yashil
  { c: '#e879a6', d: '#c85585' }, // pushti
];

const T = {
  uz: {
    eyebrow: "Garaj · Ayirish",
    title: "Yettita qayerda?",
    setup: "Har kartada bitta ayirish bor.",
    ask: "Ayirmasi aynan 7 bo'lgan BARCHA kartani bosing.",
    correct: "Barakalla! O'n uchdan olti, o'n beshdan sakkiz, o'n ikkidan besh — hammasida yetti qoladi.",
    hint: "Har kartani sanang: avval birliklarni oling, o'nta qoldiring, keyin qolganini o'ndan oling. Qaysilarida yetti chiqadi — o'shalarni tanlang.",
  },
  ru: {
    eyebrow: 'Гараж · Вычитание',
    title: 'Где семь?',
    setup: 'На каждой карточке — вычитание.',
    ask: 'Нажмите ВСЕ карточки, где разность 7.',
    correct: 'Молодец! Из тринадцати шесть, из пятнадцати восемь, из двенадцати пять — всюду семь.',
    hint: 'Посчитайте каждую: сначала уберите единицы до десятка, потом остаток из десятка. Где выходит семь — те и выберите.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — 2-ton tana + tom + oyna + 2 g'ildirak + fara.
const Car = ({ c = '#e2635b', d = '#c23f37', w = 30, spin = false }) => (
  <svg viewBox="0 0 40 24" width={w} height={(w * 24) / 40} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M11 8 Q13 3 20 3 L27 3 Q30 3 31 8 Z" fill={d} />
    <path d="M13 7.5 Q14.5 4.6 20 4.6 L25.5 4.6 Q28 4.6 28.6 7.5 Z" fill="#dff0fb" opacity="0.9" />
    <path d="M3 15 Q3 9 9 8 L32 8 Q36 9 37 13 L37 15 Q37 17 35 17 L5 17 Q3 17 3 15 Z" fill={c} stroke={d} strokeWidth="0.8" />
    <circle cx="35.5" cy="13" r="1.6" fill="#fff3c0" stroke="#e0b53a" strokeWidth="0.5" />
    <g className={spin ? 'pq-wheel' : undefined} style={{ transformOrigin: '12px 17.5px' }}>
      <circle cx="12" cy="17.5" r="4" fill="#2b2f36" /><circle cx="12" cy="17.5" r="1.7" fill="#c7ccd4" />
    </g>
    <g className={spin ? 'pq-wheel' : undefined} style={{ transformOrigin: '28px 17.5px' }}>
      <circle cx="28" cy="17.5" r="4" fill="#2b2f36" /><circle cx="28" cy="17.5" r="1.7" fill="#c7ccd4" />
    </g>
  </svg>
);

// «7» KALIT: oltin lavha, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetKey = () => (
  <svg viewBox="0 0 60 46" width="54" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="54" height="34" rx="13" fill="#f2b134" stroke="#c08517" strokeWidth="2.4" />
    <rect x="9" y="10" width="24" height="9" rx="5" fill="#f8d47f" opacity="0.9" />
    <text x="30" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">7</text>
    <polygon className="pq-glint" points="46,10 47.4,14 51.4,15.4 47.4,16.8 46,20.8 44.6,16.8 40.6,15.4 44.6,14" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D20_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
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
    <div className="pq pq2008">
      <style>{`
        .pq2008{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2008 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2008 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2008 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2008 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2008 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#dff1fb 0%,#eaf2fb 55%,#f3ecf7 100%);border:2px solid #d3ddec;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq2008 .pq-sky{position:relative;height:74px;}
        .pq2008 .pq-sun{position:absolute;left:20px;top:14px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2008 .pq-garage{position:absolute;right:18px;bottom:0;width:64px;height:52px;z-index:1;}
        .pq2008 .pq-keyw{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);line-height:0;z-index:3;}
        .pq2008 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(120,80,20,.32));}
        .pq2008 .pq-keybr.win{animation:pqCele .6s ease;}
        .pq2008 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.4s ease-in-out infinite;}
        .pq2008 .pq-light{position:absolute;left:98px;bottom:0;width:12px;z-index:2;}
        .pq2008 .pq-road{position:relative;height:26px;background:linear-gradient(#59606b,#454b55);border-top:3px solid #333941;z-index:1;overflow:hidden;}
        .pq2008 .pq-road::after{content:'';position:absolute;left:0;right:0;top:11px;height:3px;background:repeating-linear-gradient(90deg,#f0c94a 0 16px,transparent 16px 30px);}
        .pq2008 .pq-drive{position:absolute;left:0;bottom:4px;z-index:2;animation:pqDrive 5.2s linear infinite;}
        .pq2008 .pq-wheel{animation:pqSpin .5s linear infinite;}

        .pq2008 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 10px;}
        .pq2008 .pq-card{position:relative;min-width:150px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 14px 13px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,110,150,.12);font-family:inherit;}
        .pq2008 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,110,150,.2);}
        .pq2008 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2008 .pq-card:disabled{cursor:default;}
        .pq2008 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2008 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pqCele .55s ease;}
        .pq2008 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq2008 .pq-carrow{display:flex;align-items:center;justify-content:center;min-height:22px;}
        .pq2008 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2008 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2008 .pq-eq{color:#1a7f43;font-size:20px;font-weight:900;animation:pqPop .4s ease both;}
        .pq2008 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2008 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2008 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2008 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrive{0%{transform:translateX(-46px);}100%{transform:translateX(660px);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          <svg className="pq-garage" viewBox="0 0 64 52" aria-hidden="true">
            <rect x="4" y="14" width="56" height="38" rx="3" fill="#c9d2de" stroke="#9aa6b6" strokeWidth="2" />
            <path d="M2 15 L32 2 L62 15 Z" fill="#b45b45" stroke="#8f4432" strokeWidth="2" strokeLinejoin="round" />
            <rect x="14" y="24" width="36" height="28" rx="2" fill="#eef3fa" stroke="#9aa6b6" strokeWidth="1.6" />
            <line x1="14" y1="31" x2="50" y2="31" stroke="#b7c1cf" strokeWidth="1.4" />
            <line x1="14" y1="38" x2="50" y2="38" stroke="#b7c1cf" strokeWidth="1.4" />
            <line x1="14" y1="45" x2="50" y2="45" stroke="#b7c1cf" strokeWidth="1.4" />
          </svg>
          <svg className="pq-light" viewBox="0 0 12 34" aria-hidden="true">
            <rect x="3" y="26" width="6" height="8" fill="#5a616c" />
            <rect x="1" y="2" width="10" height="26" rx="4" fill="#2f343c" stroke="#20242a" strokeWidth="1" />
            <circle cx="6" cy="8" r="3" fill="#e2635b" />
            <circle cx="6" cy="15" r="3" fill="#f2b134" />
            <circle cx="6" cy="22" r="3" fill="#57a84f" />
          </svg>
          <span className="pq-keyw"><span className={'pq-keybr' + (ok ? ' win' : '')}><TargetKey /></span></span>
        </div>
        <div className="pq-road">
          <span className="pq-drive"><Car c="#4a90d9" d="#2f6fb3" w={40} spin /></span>
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            const p = PAL[i % PAL.length];
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                <div className="pq-carrow"><Car c={p.c} d={p.d} w={34} /></div>
                <div className="pq-clabel">
                  <span>{cardLabel(c)}</span>
                  {ok && good && <b className="pq-eq">= {TARGET}</b>}
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
