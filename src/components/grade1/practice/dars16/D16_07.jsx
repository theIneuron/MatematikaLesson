// Dars16 · Amaliyot 07 — LOGIC make-ten JADVAL «Shirinlik do'koni» · 🔴 · tag: logic_maketen_table
// 2 qatorli jadval, 4 ustun. To'la ustunlar [2/8] [4/6] [7/3] — har ustunda ikki son birga 10 ("=10" YOZILMAYDI).
// 4-ustun [5/?] past katak bo'sh. options=[4,5,6], to'g'ri=5. O'quvchi qoidani (ustun = 10) o'zi topadi.
// G'alaba: 4-ustun to'ladi + har ustunda "10" belgisi, chip «Har ustun = 10».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ANSWER = 5;
// Ustunlar: [yuqori, past]. null = bo'sh katak (o'quvchi topadi).
const COLS = [
  { top: 2, bot: 8 },
  { top: 4, bot: 6 },
  { top: 7, bot: 3 },
  { top: 5, bot: null },
];
const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_maketen_table', options: [4, 5, 6], answer: ANSWER };

// Shirinlik palitrasi (aylanma): qizil / ko'k / sariq / yashil / pushti
const PAL = ['#e2635b', '#4a90d9', '#f2b134', '#57a84f', '#e879a6'];

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · Qoidani top",
    setup: "Har ustunni yaxshi qarang.",
    ask: "Har ustundagi ikki son bir xil qoidaga bo'ysunadi. Bo'sh katakka qaysi son?",
    correct: "Barakalla! Beshga besh qo'shsak, o'nta bo'ladi. Har ustun — o'nlik!",
    hint: "To'la ustunlarga qarang — ikki son birga nechta bo'ladi? Xuddi shu qoidani bo'sh ustunga qo'llang.",
    chip: "Har ustun = 10",
  },
  ru: {
    eyebrow: "Магазин сладостей · Найди правило",
    setup: "Посмотрите внимательно на каждый столбик.",
    ask: "В каждом столбике два числа подчиняются одному правилу. Какое число в пустую клетку?",
    correct: "Молодец! Пять и ещё пять — десять. Каждый столбик — десяток!",
    hint: "Посмотри на полные столбики — сколько два числа вместе? Примени то же правило к пустому столбику.",
    chip: "Каждый столбик = 10",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira +
// oq blik + yengil o'ram burama detali. Bitta konfet = bitta dona.
const Candy = ({ c, w = 22 }) => (
  <svg viewBox="0 0 40 40" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={`cg${c.slice(1)}`} cx="38%" cy="34%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
        <stop offset="34%" stopColor={c} stopOpacity="0.95" />
        <stop offset="100%" stopColor={c} />
      </radialGradient>
    </defs>
    <path d="M8 20 L2 14 Q1 20 2 26 Z" fill={c} opacity="0.85" />
    <path d="M32 20 L38 14 Q39 20 38 26 Z" fill={c} opacity="0.85" />
    <circle cx="20" cy="20" r="12" fill={`url(#cg${c.slice(1)})`} stroke="rgba(0,0,0,.12)" strokeWidth="0.8" />
    <path d="M14 15 Q20 12 26 15" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
    <ellipse cx="16" cy="15.5" rx="3.4" ry="2.2" fill="#fff" opacity="0.7" transform="rotate(-24 16 15.5)" />
  </svg>
);

export default function D16_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda to'lish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.answer;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.answer }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  // Bir katakdagi shirinliklarni chizish (n dona, aylanma rang)
  const renderCandies = (n, ci, part) => {
    const arr = [];
    for (let k = 0; k < n; k++) {
      arr.push(<span key={k} className="pq-cd" style={{ '--cd': `${(ci * 0.09 + k * 0.05).toFixed(2)}s` }}><Candy c={PAL[(ci * 2 + (part === 'bot' ? 1 : 0) + k) % PAL.length]} w={18} /></span>);
    }
    return arr;
  };

  return (
    <div className="pq pq1607">
      <style>{`
        .pq1607{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1607 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1607 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1607 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1607 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1607 .pq-scene{position:relative;width:396px;max-width:100%;margin:0 auto;padding:20px 16px 22px;border-radius:20px;background:linear-gradient(#fbe6cf 0%,#f5d9ab 56%,#eec98f 100%);border:2px solid #e2c592;overflow:hidden;}
        .pq1607 .pq-window{position:absolute;right:14px;top:12px;width:56px;height:44px;border-radius:7px;background:linear-gradient(135deg,#e3f3fd 0 46%,#c4dff2 46% 54%,#eef8ff 54%);border:2.5px solid #c79a58;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1607 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#c79a58;transform:translateX(-1px);}
        .pq1607 .pq-sun{position:absolute;right:22px;top:18px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1607 .pq-lamp{position:absolute;left:34px;top:0;width:2px;height:18px;background:#8a5628;z-index:1;}
        .pq1607 .pq-lampshade{position:absolute;left:22px;top:16px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;z-index:1;box-shadow:0 10px 22px 6px rgba(255,213,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1607 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.18);}

        .pq1607 .pq-tblwrap{position:relative;z-index:2;display:flex;justify-content:center;margin-top:6px;}
        .pq1607 .pq-tbl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;border-radius:14px;background:rgba(255,252,244,.72);border:2px solid #d9be92;box-shadow:0 5px 12px rgba(120,80,30,.16);}
        .pq1607 .pq-col{position:relative;display:flex;flex-direction:column;gap:7px;padding:6px 5px 8px;border-radius:11px;background:rgba(255,255,255,.5);border:1.5px solid rgba(150,110,60,.28);}
        .pq1607 .pq-col.win{animation:pqColWin .5s ease;}
        .pq1607 .pq-cell{position:relative;min-height:58px;border-radius:9px;background:rgba(255,247,232,.7);border:1.6px solid rgba(150,110,60,.34);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:5px 3px;}
        .pq1607 .pq-cell.empty{background:rgba(255,255,255,.34);border-style:dashed;border-color:rgba(150,110,60,.6);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1607 .pq-cds{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:74px;}
        .pq1607 .pq-cd{line-height:0;animation:pqPuff .32s ease both;animation-delay:var(--cd,0s);}
        .pq1607 .pq-num{font-size:19px;font-weight:900;color:#8a5a22;font-variant-numeric:tabular-nums;line-height:1;}
        .pq1607 .pq-qm{font-size:30px;font-weight:900;color:#c07f2c;opacity:.75;animation:pqBreath 1.7s ease-in-out infinite;}
        .pq1607 .pq-tenlbl{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:4;background:#fff;border:2px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:12px;padding:1px 8px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pqPop .4s both;white-space:nowrap;}
        .pq1607 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1607 .pq-spark.s2{animation-delay:-.6s;} .pq1607 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1607 .pq-chip{display:flex;justify-content:center;align-items:center;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1607 .pq-chip b{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;font-size:19px;font-weight:900;border-radius:12px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-variant-numeric:tabular-nums;}

        .pq1607 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1607 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1607 .pq-opt:hover:not(:disabled){border-color:#e2c79a;transform:translateY(-2px);}
        .pq1607 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1607 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1607 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1607 .pq-opt:disabled{cursor:default;}
        .pq1607 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1607 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1607 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes pqPuff{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqColWin{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-lamp" /><span className="pq-lampshade" />
        <span className="pq-window" /><span className="pq-sun" />
        <span className="pq-shelf" />

        <div className="pq-tblwrap">
          <div className="pq-tbl">
            {COLS.map((col, ci) => {
              const isBlank = col.bot === null;
              const botVal = isBlank ? ANSWER : col.bot;
              const showBot = !isBlank || ok; // bo'sh ustun faqat g'alabada to'ladi
              return (
                <div key={ci} className={'pq-col' + (ok ? ' win' : '')}>
                  {ok && <span className="pq-tenlbl">10</span>}
                  {/* yuqori katak */}
                  <div className="pq-cell">
                    <span className="pq-cds">{renderCandies(col.top, ci, 'top')}</span>
                    <span className="pq-num">{col.top}</span>
                  </div>
                  {/* past katak */}
                  <div className={'pq-cell' + (isBlank && !ok ? ' empty' : '')}>
                    {showBot ? (<>
                      <span className="pq-cds">{renderCandies(botVal, ci, 'bot')}</span>
                      <span className="pq-num">{botVal}</span>
                    </>) : (
                      <span className="pq-qm">?</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {ok && !still && (<>
          <span className="pq-spark" style={{ left: '18%', top: '30px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '54px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '20px' }}>✦</span>
        </>)}
      </div>

      {ok && (<div className="pq-chip"><b>{t.chip}</b></div>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.answer;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
