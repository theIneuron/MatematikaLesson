// Dars29 · Amaliyot 08 — Ko'p-tanlov «Olma bog'i» · 🔴 · tag: multi
// Ko'p-tanlov: 4 ifoda-karta (faqat matn). Javobi aynan 5 bo'lgan BARCHA kartani belgilang.
// Qoldiq (−) va qo'shish (+) misollari aralash; amal BERILGAN, bola javobi 5 bo'lgan barcha kartalarni topadi. TARGET = 5.
// [0] "8 − 3" =5 to'g'ri  [1] "2 + 3" =5 to'g'ri  [2] "9 − 4" =5 to'g'ri  [3] "6 − 2" =4 tuzoq.
// GOOD = {0,1,2}. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Win-reveal: g'alabada har to'g'ri kartada "= 5" chiqadi, tuzoq xiralashadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 5;
// Har karta: a op b. op: '-' ayirish (qoldiq), '+' qo'shish (noma'lum qo'shiluvchi).
const CARDS = [
  { a: 8, op: '-', b: 3 }, // 8 − 3 = 5 to'g'ri
  { a: 2, op: '+', b: 3 }, // 2 + 3 = 5 to'g'ri
  { a: 9, op: '-', b: 4 }, // 9 − 4 = 5 to'g'ri
  { a: 6, op: '-', b: 2 }, // 6 − 2 = 4 tuzoq
];
const SIGN = { '-': '−', '+': '+' };
const cardVal = (c) => (c.op === '+' ? c.a + c.b : c.a - c.b);
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} ${SIGN[c.op]} ${c.b}`;

const DATA = { good: GOOD, target: TARGET, ptype: 'multi', level: '🔴', tag: 'multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala",
    title: "Javobi 5",
    setup: "Kartalarga qarang.",
    ask: "Javobi 5 bo'lgan BARCHA kartani belgilang.",
    correct: "Barakalla! Uch kartaning javobi 5.",
    hint: "Har kartani hisoblang: javobi 5 mi?",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача",
    title: "Ответ 5",
    setup: "Посмотри на карточки.",
    ask: "Отметь все карточки с ответом 5.",
    correct: "Молодец! У трёх карточек ответ 5.",
    hint: "Посчитай каждую карточку: ответ равен 5?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// «5» NISHON: yashil bog' lavhasi, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetBadge = () => (
  <svg viewBox="0 0 62 46" width="56" height="41" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="56" height="34" rx="13" fill="#2e7d46" stroke="#1f5e33" strokeWidth="2.4" />
    <rect x="9" y="10" width="26" height="9" rx="5" fill="#5aa86a" opacity="0.7" />
    <text x="31" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff" fontFamily="inherit">5</text>
    <polygon className="pq-glint" points="49,10 50.4,14 54.4,15.4 50.4,16.8 49,20.8 47.6,16.8 43.6,15.4 47.6,14" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D29_08(props) {
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
    <div className="pq pq2908">
      <style>{`
        .pq2908{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2908 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2908 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2908 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2908 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2908 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#cfeafc 0%,#e4f4d9 54%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq2908 .pq-sky{position:relative;height:86px;}
        .pq2908 .pq-sun{position:absolute;left:20px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pq2908sun 3.6s ease-in-out infinite;}
        .pq2908 .pq-tree{position:absolute;bottom:0;z-index:1;transform-origin:50% 100%;}
        .pq2908 .pq-tree.t1{left:8px;animation:pq2908sway 4.2s ease-in-out infinite;}
        .pq2908 .pq-tree.t2{right:96px;bottom:4px;animation:pq2908sway 4.8s ease-in-out .6s infinite;}
        .pq2908 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:8px;height:22px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2908 .pq-crown{width:48px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2908 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.22);}
        .pq2908 .pq-badge{position:absolute;right:16px;top:50%;transform:translateY(-52%);line-height:0;z-index:3;}
        .pq2908 .pq-badgebr{display:inline-block;line-height:0;animation:pq2908breath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(30,90,50,.32));}
        .pq2908 .pq-badgebr.win{animation:pq2908cele .6s ease;}
        .pq2908 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pq2908glint 3.4s ease-in-out infinite;}
        .pq2908 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:16px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;}

        .pq2908 .pq-cards{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:16px 12px 14px;}
        .pq2908 .pq-card{position:relative;min-width:120px;display:flex;align-items:center;justify-content:center;padding:16px 16px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,130,90,.14);font-family:inherit;}
        .pq2908 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,130,90,.22);}
        .pq2908 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2908 .pq-card:disabled{cursor:default;}
        .pq2908 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2908 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2908cele .55s ease;}
        .pq2908 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq2908 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2908 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2908 .pq-eq{color:#1a7f43;font-size:20px;font-weight:900;animation:pq2908pop .4s ease both;}
        .pq2908 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pq2908tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2908 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2908in .22s ease both;}
        .pq2908 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2908 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2908breath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pq2908glint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pq2908sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2908sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2908pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2908tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2908cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2908in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '12px', top: '14px' }} /><i style={{ left: '30px', top: '9px' }} /><i style={{ left: '22px', top: '26px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '11px', top: '11px' }} /><i style={{ left: '28px', top: '20px' }} /></span><span className="pq-trunk" /></div>
          <span className="pq-badge"><span className={'pq-badgebr' + (ok ? ' win' : '')}><TargetBadge /></span></span>
          <span className="pq-ground" />
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                <div className="pq-clabel">
                  <span>{c.a} {c.op === '+' ? '+' : '−'} {c.b}</span>
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
