// Dars16 · Amaliyot 08 — Ko'p-tanlov «O'nta qayerda?» · 🔴 · tag: make_ten_multi
// Shirinlik do'koni: 5 ifoda-karta. Aynan O'N (10) ga TENG bo'lganlarni BARCHASINI belgila.
// [0] "8 + 2" =10 ✓  [1] "6 + 4" =10 ✓  [2] "5 + 5" =10 ✓
// [3] "7 + 2" =9 ✗ tuzoq  [4] "6 + 3" =9 ✗ tuzoq. GOOD = {0,1,2}.
// make-ten modeli: har kartada birinchi guruh + ikkinchi guruh shirinlik; ikkisi o'nta bo'lsa — o'sha.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 10;
// Har karta: a ta + b ta shirinlik. a + b qiymati.
const CARDS = [
  { a: 8, b: 2 }, // 8 + 2 = 10 ✓
  { a: 6, b: 4 }, // 6 + 4 = 10 ✓
  { a: 5, b: 5 }, // 5 + 5 = 10 ✓
  { a: 7, b: 2 }, // 7 + 2 = 9  ✗ tuzoq
  { a: 6, b: 3 }, // 6 + 3 = 9  ✗ tuzoq
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} + ${c.b}`;

const DATA = { good: [0, 1, 2], target: TARGET, ptype: 'P13', level: '🔴', tag: 'make_ten_multi' };

// Shirinlik rang palitrasi (2-ton: yorug' tana / to'q chet). Aylanma.
const PAL = [
  { c: '#e2635b', d: '#c23f37' }, // qizil
  { c: '#4a90d9', d: '#2f6fb3' }, // ko'k
  { c: '#f2b134', d: '#cf9016' }, // sariq
  { c: '#57a84f', d: '#3d8038' }, // yashil
  { c: '#e879a6', d: '#c85585' }, // pushti
];

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · O'nta",
    title: "O'nta qayerda?",
    setup: "Peshtaxtadagi har kartada ikki guruh shirinlik bor — qo'shsangiz turlicha son chiqadi.",
    ask: "Aynan O'NTA bo'ladigan BARCHA kartani bosing.",
    correct: "Barakalla! Sakkiz va ikki, olti va to'rt, besh va besh — hammasi o'nta.",
    hint: "Har kartadagi ikki guruhni birga sanang. Qaysilarida o'nta chiqadi — o'shalarni tanlang.",
  },
  ru: {
    eyebrow: 'Магазин сладостей · Десяток',
    title: 'Где десяток?',
    setup: 'На каждой карточке на прилавке две группы конфет — если сложить, получаются разные числа.',
    ask: 'Нажми на ВСЕ карточки, где получается ровно ДЕСЯТЬ.',
    correct: 'Молодец! Восемь и два, шесть и четыре, пять и пять — всюду десять.',
    hint: 'Сосчитай обе группы вместе на каждой карточке. Выбери те, где выходит десять.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — 2-ton doira + oq blik +
// yengil burama swirl detali + ikki chekka o'ram qanoti. Bitta konfet = bitta dona.
const Candy = ({ c = '#e2635b', d = '#c23f37', w = 15 }) => (
  <svg viewBox="0 0 30 18" width={w} height={(w * 18) / 30} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M7 9 L1.5 4 L3 9 L1.5 14 Z" fill={d} />
    <path d="M23 9 L28.5 4 L27 9 L28.5 14 Z" fill={d} />
    <circle cx="15" cy="9" r="7" fill={d} />
    <circle cx="15" cy="9" r="5.6" fill={c} />
    <path d="M10.4 9 Q15 4.6 19.6 9 Q15 13.4 10.4 9" fill="none" stroke={d} strokeWidth="0.9" opacity="0.55" />
    <ellipse cx="12.4" cy="6.3" rx="2.3" ry="1.5" fill="#ffffff" opacity="0.62" />
  </svg>
);

// «10» KALIT: oltin medalyon, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetKey = () => (
  <svg viewBox="0 0 66 46" width="60" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="60" height="34" rx="13" fill="#f2b134" stroke="#c08517" strokeWidth="2.4" />
    <rect x="9" y="10" width="26" height="9" rx="5" fill="#f8d47f" opacity="0.9" />
    <text x="33" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">10</text>
    <polygon className="pq-glint" points="51,10 52.4,14 56.4,15.4 52.4,16.8 51,20.8 49.6,16.8 45.6,15.4 49.6,14" fill="#fff" />
  </svg>
);

// Osma chiroq (dekor): shisha qalpoq + yorug'lik; sekin tebranadi.
const Lamp = () => (
  <svg viewBox="0 0 40 46" width="34" height="40" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="20" y1="0" x2="20" y2="15" stroke="#7a6a52" strokeWidth="2" />
    <path d="M8 32 L32 32 L27 17 L13 17 Z" fill="#e0a93f" stroke="#b9832a" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 17 L27 17 L25.5 21 L14.5 21 Z" fill="#f6d488" opacity="0.85" />
    <ellipse cx="20" cy="32" rx="12" ry="3.2" fill="#f6d488" />
    <circle cx="20" cy="35" r="4.4" fill="#fff3c0" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D16_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
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

  // Bir guruh shirinliklari — rang aylanma; guruh-b rangni davomidan boshlaydi.
  const group = (n, start) => Array.from({ length: n }).map((_, k) => {
    const p = PAL[(start + k) % PAL.length];
    return <span key={k} className="pq-ck"><Candy c={p.c} d={p.d} /></span>;
  });

  return (
    <div className="pq pq1608">
      <style>{`
        .pq1608{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1608 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1608 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1608 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1608 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq1608 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#fbf3e4,#f3e5cf);border:2px solid #e6d4b4;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq1608 .pq-shelf{position:relative;height:66px;background:linear-gradient(#d9b785,#c69c62 68%,#b88a50);border-bottom:3px solid #9a7440;box-shadow:inset 0 -2px 3px rgba(120,80,30,.25);}
        .pq1608 .pq-keyw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);line-height:0;z-index:3;}
        .pq1608 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(120,80,20,.32));}
        .pq1608 .pq-keybr.win{animation:pqCele .6s ease;}
        .pq1608 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.4s ease-in-out infinite;}
        .pq1608 .pq-lamp{position:absolute;top:-1px;left:26px;transform-origin:top center;animation:pqSwing 4.2s ease-in-out infinite;z-index:2;}
        .pq1608 .pq-lamp::before{content:'';position:absolute;left:50%;top:24px;width:46px;height:46px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,236,160,.75),rgba(255,236,160,0) 66%);animation:pqGlow 3s ease-in-out infinite;pointer-events:none;}
        .pq1608 .pq-win{position:absolute;right:16px;top:12px;width:52px;height:40px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #b98f52;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1608 .pq-win::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b98f52;transform:translateX(-1px);}
        .pq1608 .pq-sun{position:absolute;right:22px;top:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}

        .pq1608 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 8px;}
        .pq1608 .pq-card{position:relative;min-width:186px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:13px 12px 12px;border-radius:16px;border:2.5px solid #e3d3b4;background:#fffdf8;color:#3a3320;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(150,110,50,.12);font-family:inherit;}
        .pq1608 .pq-card:hover:not(:disabled){border-color:#e0b878;transform:translateY(-2px);box-shadow:0 5px 12px rgba(150,110,50,.2);}
        .pq1608 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq1608 .pq-card:disabled{cursor:default;}
        .pq1608 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq1608 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pqCele .55s ease;}
        .pq1608 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq1608 .pq-cardv{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;}
        .pq1608 .pq-grp{display:flex;flex-wrap:wrap;gap:3px 4px;justify-content:center;align-items:center;max-width:80px;}
        .pq1608 .pq-ck{line-height:0;}
        .pq1608 .pq-plus{font-size:22px;font-weight:900;color:#c99a4e;}

        .pq1608 .pq-clabel{display:flex;align-items:center;gap:9px;font-size:22px;font-weight:900;color:#5a4a2c;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq1608 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq1608 .pq-eq{color:#1a7f43;font-size:18px;font-weight:900;animation:pqPop .4s ease both;}
        .pq1608 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq1608 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1608 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1608 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqGlow{0%,100%{opacity:.55;transform:translateX(-50%) scale(.94);}50%{opacity:.9;transform:translateX(-50%) scale(1.06);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
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
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                <div className="pq-cardv">
                  <span className="pq-grp">{group(c.a, 0)}</span>
                  <span className="pq-plus">+</span>
                  <span className="pq-grp">{group(c.b, c.a)}</span>
                </div>
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
