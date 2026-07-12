// Dars19 · Amaliyot 08 — Ko'p-tanlov «Ayirmasi sakkiz» · 🔴 · tag: sub_multi
// Shar do'koni: 5 ifoda-karta. Ayirmasi aynan SAKKIZ (8) bo'lganlarni BARCHASINI belgila.
// [0] "13 − 5" =8 ✓  [1] "14 − 6" =8 ✓  [2] "12 − 4" =8 ✓
// [3] "15 − 8" =7 ✗ tuzoq  [4] "11 − 4" =7 ✗ tuzoq. GOOD = {0,1,2}.
// Make-ten-sub modeli: har karta = 1 to'la rak (10 shar) + birliklar. G'alabada birliklar avval,
// keyin rakdan qolgani UCHIB ketadi (bir-martalik reveal), qolgan sharlar sanaladi → "= 8".
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MINUS = '−'; // U+2212, defis emas
const TARGET = 8;
// Har karta: m − s. m — teen (11..15), s — bir xonali. Natija bir xonali.
const CARDS = [
  { m: 13, s: 5 }, // 13 − 5 = 8 ✓
  { m: 14, s: 6 }, // 14 − 6 = 8 ✓
  { m: 12, s: 4 }, // 12 − 4 = 8 ✓
  { m: 15, s: 8 }, // 15 − 8 = 7 ✗ tuzoq
  { m: 11, s: 4 }, // 11 − 4 = 7 ✗ tuzoq
];
const cardVal = (c) => c.m - c.s;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.m} ${MINUS} ${c.s}`;

const DATA = { good: [0, 1, 2], target: TARGET, ptype: 'P13', level: '🔴', tag: 'sub_multi' };

// Shar rang palitrasi (2-ton: yorug' tana / to'q chet). Aylanma.
const PAL = [
  { c: '#d9534b', d: '#a63a33' }, // qizil
  { c: '#4a90d9', d: '#2f6fb3' }, // ko'k
  { c: '#f2b134', d: '#c98a16' }, // sariq
  { c: '#57a84f', d: '#3f8038' }, // yashil
  { c: '#e879a6', d: '#c85585' }, // pushti
];

const T = {
  uz: {
    eyebrow: "Shar do'koni · Sakkiz",
    title: "Ayirmasi sakkiz",
    setup: "Peshtaxtadagi har kartada bitta ayirish yozilgan — javoblari turlicha chiqadi.",
    ask: "Ayirmasi aynan SAKKIZ bo'ladigan BARCHA kartani bosing.",
    correct: `Barakalla! 13 ${MINUS} 5, 14 ${MINUS} 6, 12 ${MINUS} 4 — ayirmasi hammasida sakkiz.`,
    hint: "Har kartada avval o'ngacha tushiring — birliklarni ayiring, keyin o'nlikdan qolganini oling. Qaysi kartada sakkiz qoladi — o'shalarni tanlang.",
  },
  ru: {
    eyebrow: 'Магазин шаров · Восемь',
    title: 'Разность — восемь',
    setup: 'На каждой карточке на прилавке записано одно вычитание — ответы получаются разные.',
    ask: 'Нажми на ВСЕ карточки, где разность ровно ВОСЕМЬ.',
    correct: `Молодец! 13 ${MINUS} 5, 14 ${MINUS} 6, 12 ${MINUS} 4 — везде разность восемь.`,
    hint: 'Сначала спусти до десяти — вычти единицы, потом убери остаток из десятка. Выбери те, где остаётся восемь.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHAR KANONI (yakka birlik): rangli oval tana (2-ton chet) + oq blik + pastda tugun-uchburchak +
// ingichka ip-chizig'i. Bitta shar = bitta birlik. Rang palitradan.
const Balloon = ({ c = '#d9534b', d = '#a63a33', w = 13 }) => (
  <svg viewBox="0 0 24 34" width={w} height={(w * 34) / 24} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 21 Q13.4 27 12 33" fill="none" stroke={d} strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
    <path d="M12 20.5 L9.9 24 L14.1 24 Z" fill={d} />
    <ellipse cx="12" cy="11" rx="9" ry="10.5" fill={c} stroke={d} strokeWidth="1" />
    <ellipse cx="8.6" cy="7" rx="2.3" ry="3.3" fill="#ffffff" opacity="0.5" transform="rotate(-20 8.6 7)" />
  </svg>
);

// «8» KALIT: oltin medalyon, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetKey = () => (
  <svg viewBox="0 0 54 46" width="50" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="48" height="34" rx="13" fill="#f2b134" stroke="#c08517" strokeWidth="2.4" />
    <rect x="9" y="10" width="20" height="9" rx="5" fill="#f8d47f" opacity="0.9" />
    <text x="27" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">8</text>
    <polygon className="pq-glint" points="41,10 42.4,14 46.4,15.4 42.4,16.8 41,20.8 39.6,16.8 35.6,15.4 39.6,14" fill="#fff" />
  </svg>
);

// Osma chiroq (dekor): shisha qalpoq + yorug'lik; sekin tebranadi.
const Lamp = () => (
  <svg viewBox="0 0 40 46" width="32" height="37" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="20" y1="0" x2="20" y2="15" stroke="#7a6a52" strokeWidth="2" />
    <path d="M8 32 L32 32 L27 17 L13 17 Z" fill="#e0a93f" stroke="#b9832a" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 17 L27 17 L25.5 21 L14.5 21 Z" fill="#f6d488" opacity="0.85" />
    <ellipse cx="20" cy="32" rx="12" ry="3.2" fill="#f6d488" />
    <circle cx="20" cy="35" r="4.4" fill="#fff3c0" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D19_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda uchib-ketish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
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

  // Bitta shar (rak yoki yakka) — uchib ketish (away) g'alabada, bir-martalik.
  const Shar = ({ pi, away, delay }) => {
    const p = PAL[pi % PAL.length];
    if (away && still) return null; // yakuniy holat: uchib ketgan shar yo'q
    return (
      <span className={'pq-sh' + (away ? ' away' : '')} style={away ? { '--awd': `${delay}s` } : undefined}>
        <Balloon c={p.c} d={p.d} />
      </span>
    );
  };

  return (
    <div className="pq pq1908">
      <style>{`
        .pq1908{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1908 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1908 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1908 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1908 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq1908 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#fbf3e4,#f3e5cf);border:2px solid #e6d4b4;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq1908 .pq-shelf{position:relative;height:62px;background:linear-gradient(#d9b785,#c69c62 68%,#b88a50);border-bottom:3px solid #9a7440;box-shadow:inset 0 -2px 3px rgba(120,80,30,.25);}
        .pq1908 .pq-keyw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);line-height:0;z-index:3;}
        .pq1908 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(120,80,20,.32));}
        .pq1908 .pq-keybr.win{animation:pqCele .6s ease;}
        .pq1908 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.4s ease-in-out infinite;}
        .pq1908 .pq-lamp{position:absolute;top:-1px;left:26px;transform-origin:top center;animation:pqSwing 4.2s ease-in-out infinite;z-index:2;}
        .pq1908 .pq-lamp::before{content:'';position:absolute;left:50%;top:24px;width:44px;height:44px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,236,160,.75),rgba(255,236,160,0) 66%);animation:pqGlow 3s ease-in-out infinite;pointer-events:none;}
        .pq1908 .pq-win{position:absolute;right:16px;top:11px;width:52px;height:40px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #b98f52;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1908 .pq-win::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b98f52;transform:translateX(-1px);}
        .pq1908 .pq-sun{position:absolute;right:22px;top:15px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}

        .pq1908 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 10px;}
        .pq1908 .pq-card{position:relative;min-width:150px;display:flex;flex-direction:column;align-items:center;gap:7px;padding:12px 12px 11px;border-radius:16px;border:2.5px solid #e3d3b4;background:#fffdf8;color:#3a3320;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(150,110,50,.12);font-family:inherit;}
        .pq1908 .pq-card:hover:not(:disabled){border-color:#e0b878;transform:translateY(-2px);box-shadow:0 5px 12px rgba(150,110,50,.2);}
        .pq1908 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq1908 .pq-card:disabled{cursor:default;}
        .pq1908 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq1908 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pqCele .55s ease;}
        .pq1908 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq1908 .pq-loose{display:flex;gap:3px;justify-content:center;align-items:flex-end;min-height:20px;flex-wrap:wrap;max-width:110px;}
        .pq1908 .pq-rack{display:grid;grid-template-columns:repeat(5,18px);grid-auto-rows:21px;gap:3px;padding:5px;border-radius:9px;background:#fff6e6;border:1.6px solid #e2c79a;box-shadow:inset 0 1px 2px rgba(150,110,50,.18);}
        .pq1908 .pq-cell{position:relative;border-radius:6px;background:rgba(255,255,255,.5);border:1.2px solid rgba(180,140,80,.35);display:flex;align-items:flex-end;justify-content:center;}
        .pq1908 .pq-sh{line-height:0;}
        .pq1908 .pq-sh.away{animation:pqAway .7s ease-in forwards;animation-delay:var(--awd,0s);}

        .pq1908 .pq-clabel{display:flex;align-items:center;gap:8px;font-size:21px;font-weight:900;color:#5a4a2c;font-variant-numeric:tabular-nums;letter-spacing:.01em;margin-top:2px;}
        .pq1908 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq1908 .pq-eq{color:#1a7f43;font-size:18px;font-weight:900;animation:pqPop .4s .5s both;}
        .pq1908 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq1908 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1908 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1908 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqGlow{0%,100%{opacity:.55;transform:translateX(-50%) scale(.94);}50%{opacity:.9;transform:translateX(-50%) scale(1.06);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqAway{0%{opacity:1;transform:translateY(0) scale(1);}30%{opacity:1;transform:translateY(-4px) scale(1.05);}100%{opacity:0;transform:translateY(-40px) scale(.65);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-shelf">
          <span className="pq-lamp"><Lamp /></span>
          <span className="pq-keyw"><span className={'pq-keybr' + (ok ? ' win' : '')}><TargetKey /></span></span>
          <span className="pq-win" /><span className="pq-sun" />
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            const loose = c.m - 10;          // birliklar (11..15 → 1..5)
            const remRack = c.s - loose;     // rakdan uchib ketadigan sharlar soni
            const reveal = ok && good;       // faqat to'g'rilarda make-ten-sub reveal
            const rackStart = 10 - remRack;  // shu indeksdan boshlab uchib ketadi
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                {/* Birliklar (loose) — g'alabada avval uchadi */}
                <div className="pq-loose">
                  {Array.from({ length: loose }).map((_, j) => (
                    <Shar key={'l' + j} pi={j} away={reveal} delay={0.1 * j} />
                  ))}
                </div>
                {/* Rak — bir to'la o'nlik (10 uya); qolgan remRack shar keyin uchadi */}
                <div className="pq-rack">
                  {Array.from({ length: 10 }).map((_, k) => {
                    const gone = reveal && k >= rackStart;
                    return (
                      <span key={'r' + k} className="pq-cell">
                        <Shar pi={k} away={gone} delay={0.35 + (k - rackStart) * 0.1} />
                      </span>
                    );
                  })}
                </div>
                <div className="pq-clabel">
                  <span>{cardLabel(c)}</span>
                  {reveal && <b className="pq-eq">= {TARGET}</b>}
                </div>
                {reveal && <span className="pq-spark"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
