// Dars30 · Amaliyot 08 — Ko'p-tanlov «Jadval natijasi 10» · 🔴 · tag: multi
// Ko'p-tanlov: 4 mini-jadval karta (yuqori qator = ifoda, past qator = natija). Natijasi 10 bo'lgan BARCHA jadvalni belgilang.
// [0] "6 + 4" =10 to'g'ri  [1] "7 + 3" =10 to'g'ri  [2] "5 + 5" =10 to'g'ri  [3] "8 − 2" =6 tuzoq. GOOD = {0,1,2}. TARGET = 10.
// Jadval strukturasi: har karta 2 qator (ifoda / natija), natija katagi g'alabagacha «?» (yumshoq nafas); g'alabada yashil 10 + olma pop.
// NO-LEAK: natija katagi g'alabagacha yashirin «?»; tuzoq (8−2) g'alabada xiralashadi. VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 10;
// Har karta: a op b. op: '+' qo'shish, '-' ayirish (qoldiq).
const CARDS = [
  { a: 6, op: '+', b: 4 }, // 6 + 4 = 10 to'g'ri
  { a: 7, op: '+', b: 3 }, // 7 + 3 = 10 to'g'ri
  { a: 5, op: '+', b: 5 }, // 5 + 5 = 10 to'g'ri
  { a: 8, op: '-', b: 2 }, // 8 − 2 = 6 tuzoq
];
const SIGN = { '-': '−', '+': '+' };
const cardVal = (c) => (c.op === '+' ? c.a + c.b : c.a - c.b);
const cardRes = (c) => (c.op === '+' ? c.a + c.b : c.a - c.b);
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} ${SIGN[c.op]} ${c.b}`;

const DATA = { cards: CARDS.map(cardLabel), good: GOOD, target: TARGET, ptype: 'multi', level: '🔴', tag: 'multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Jadval",
    title: "Natija 10",
    setup: "Jadvallarga qarang.",
    ask: "Natijasi 10 bo'lgan barcha jadvallarni belgilang.",
    rRes: "Natija",
    correct: "Barakalla! Uch jadvalning natijasi 10.",
    hint: "Har jadvalni hisoblang: natija 10 mi?",
  },
  ru: {
    eyebrow: "Яблоневый сад · Таблица",
    title: "Результат 10",
    setup: "Посмотри на таблицы.",
    ask: "Отметь все таблицы с результатом 10.",
    rRes: "Итог",
    correct: "Молодец! У трёх таблиц результат 10.",
    hint: "Посчитай каждую таблицу: результат равен 10?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 22 }) => {
  const id = "pq3008a" + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D30_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
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
    <div className={"pq pq3008" + (still ? " still" : "")}>
      <style>{`
        .pq3008.still *{animation:none !important;}
        .pq3008{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3008 *{box-sizing:border-box;}
        .pq3008 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3008 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3008 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3008 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq3008 .pq-scene{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 60%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-sizing:border-box;padding:40px 12px 16px;}
        .pq3008 .pq-sun{position:absolute;right:16px;top:12px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq3008sun 3.6s ease-in-out infinite;}
        .pq3008 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq3008 .pq-cards{position:relative;z-index:3;display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .pq3008 .pq-card{position:relative;background:#fff;border:2.5px solid #cbb58e;border-radius:14px;box-shadow:0 3px 8px rgba(0,0,0,.10);overflow:hidden;cursor:pointer;transition:.14s;font-family:inherit;padding:0;}
        .pq3008 .pq-card:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 14px rgba(80,130,90,.22);}
        .pq3008 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3008 .pq-card:disabled{cursor:default;}
        .pq3008 .pq-card.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.16),0 3px 8px rgba(37,99,235,.2);}
        .pq3008 .pq-card.won{border-color:#1a7f43;animation:pq3008cele .55s ease;}
        .pq3008 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq3008 .pq-tr{display:flex;align-items:center;justify-content:center;min-height:46px;padding:6px 10px;}
        .pq3008 .pq-tr.expr{font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.02em;}
        .pq3008 .pq-tr.res{border-top:1px solid #e8dfca;background:#f4faf0;}
        .pq3008 .pq-card.won .pq-tr.res{background:#e8f7ee;}
        .pq3008 .pq-reslab{flex:1 1 auto;text-align:left;font-size:13px;font-weight:700;color:#7a6f57;}
        .pq3008 .pq-card.won .pq-reslab{color:#2c6633;}
        .pq3008 .pq-resval{flex:0 0 auto;display:flex;align-items:center;gap:5px;}
        .pq3008 .pq-q{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:34px;padding:0 8px;border-radius:9px;background:#eef2f7;border:2px solid #c3cddb;color:#5a6b82;font-size:20px;font-weight:900;animation:pq3008breathe 2.4s ease-in-out infinite;}
        .pq3008 .pq-fill{display:inline-flex;align-items:center;gap:5px;padding:0 9px;height:36px;border-radius:9px;background:#1a7f43;border:2px solid #15693a;color:#fff;font-size:20px;font-weight:900;font-variant-numeric:tabular-nums;animation:pq3008pop .4s ease both;}
        .pq3008 .pq-fill .pq-obj{line-height:0;}
        .pq3008 .pq-spark{position:absolute;top:6px;right:8px;line-height:0;animation:pq3008tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq3008 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3008in .22s ease both;}
        .pq3008 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3008 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3008sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3008breathe{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.08);opacity:1;}}
        @keyframes pq3008pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3008tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3008cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3008in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <div className="pq-title">{t.title}</div>

        {/* 4 mini-jadval: yuqori qator ifoda, past qator NATIJA (g'alabagacha «?») */}
        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                <div className="pq-tr expr">{c.a} {c.op === '+' ? '+' : '−'} {c.b}</div>
                <div className="pq-tr res">
                  <span className="pq-reslab">{t.rRes}</span>
                  <span className="pq-resval">
                    {!ok || !good
                      ? <span className="pq-q">?</span>
                      : <span className="pq-fill"><Apple w={20} />{cardRes(c)}</span>}
                  </span>
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
