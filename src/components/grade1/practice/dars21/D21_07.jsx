// Dars21 · Amaliyot 07 — Tens-digit ko'p-tanlov «Olma bog'i» · 🔴 · tag: tens_multi
// Ko'p-tanlov: 5 son-karta (42, 24, 45, 54, 40). O'nligi aynan 4 bo'lgan BARCHA sonni belgilash.
// O'nlik = sonning BIRINCHI raqami. To'g'ri to'plam = {42, 45, 40}. Tuzoqlar: 24 (2 o'nlik, M1
// o'rin almashish) va 54 (5 o'nlik, M1). Savat = 10 olmani bog'lagan BITTA birlik ('10' nishoni),
// yakka olma = 1 birlik — kanon bezak sahnasida. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q;
// setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET_TENS = 4;
// Har karta: ikki xonali son. O'nlik = Math.floor(n/10), birlik = n%10.
const NUMS = [42, 24, 45, 54, 40];
const tensOf = (n) => Math.floor(n / 10);
const unitsOf = (n) => n % 10;
const GOOD = NUMS.map((n, i) => (tensOf(n) === TARGET_TENS ? i : -1)).filter((i) => i >= 0); // [0,2,4]
const DATA = { nums: NUMS, targetTens: TARGET_TENS, good: GOOD, level: '🔴', tag: 'tens_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Razryad", title: "O'nligi 4",
    setup: "Kartochkalarda 5 ta son yozilgan: 42, 24, 45, 54 va 40.",
    ask: "O'nliklar xonasida 4 turgan BARCHA sonlarni bosing.",
    correct: "Barakalla! 42, 45, 40 — hammasida 4 o'nlik.",
    hint: "O'nliklar — birinchi raqam. Qaysida 4 turibdi?",
  },
  ru: {
    eyebrow: "Яблоневый сад · Разряд", title: "Десяток — 4",
    setup: "На карточках 5 чисел: 42, 24, 45, 54 и 40.",
    ask: "Нажми ВСЕ числа, где в разряде десятков стоит 4.",
    correct: "Молодец! 42, 45, 40 — везде 4 десятка.",
    hint: "Десятки — первая цифра. Где стоит 4?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma tanasi (2-ton radial) + barg + band + oq blik.
let __aid = 0;
const Apple = ({ w = 24 }) => {
  const id = 'pq2107a' + (__aid++);
  const h = w * 34 / 30;
  return (
    <svg viewBox="0 0 30 34" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (o'nlik): to'qilgan savat + jiyakdan mo'ralab turgan olmalar + '10' nishoni.
// Savat = 10 olmani bog'lagan BITTA birlik (ichi qayta sanalmaydi). Bezak sahnasida ko'rsatiladi.
let __bid = 0;
const Basket = ({ w = 68 }) => {
  const id = 'pq2107b' + (__bid++);
  const h = w * 78 / 88;
  return (
    <svg viewBox="0 0 88 78" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0a45e" />
          <stop offset="100%" stopColor="#9c6329" />
        </linearGradient>
        <radialGradient id={id + 'ap'} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <g stroke="#a6291f" strokeWidth=".7">
        <circle cx="26" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="62" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="44" cy="25" r="11.5" fill={`url(#${id}ap)`} />
      </g>
      <path d="M46,15 Q52,12 53.5,16.5 Q48.5,18.5 46,15 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".6" />
      <rect x="8" y="33" width="72" height="9" rx="4.5" fill="#c98a45" stroke="#7a4a20" strokeWidth="1.4" />
      <path d="M12,42 L76,42 L67,72 Q66,75 62,75 L26,75 Q22,75 21,72 Z" fill={`url(#${id})`} stroke="#7a4a20" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke="#7a4a20" strokeWidth="1.1" opacity=".55" fill="none">
        <path d="M24,42 L27,74" /><path d="M34,42 L35.6,74" /><path d="M44,42 L44,75" />
        <path d="M54,42 L52.4,74" /><path d="M64,42 L61,74" />
      </g>
      <g stroke="#5f3b18" strokeWidth="1.2" opacity=".5" fill="none">
        <path d="M14,52 Q44,58 74,52" /><path d="M17,62 Q44,68 71,62" />
      </g>
    </svg>
  );
};

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D21_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlangan kartalarni va fikr-bildirishni tiklaydi
  // (msg DOIM; setChecked FAQAT to'g'rida).
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => tensOf(NUMS[i]) === TARGET_TENS);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: NUMS.map(String), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2107">
      <style>{`
        .pq2107{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2107 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2107 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2107 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2107 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2107 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#dff1fb 0%,#eaf6ec 52%,#e5f3d6 100%);border:2px solid #cfe6cf;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        /* orchard bezak strip — bosiladigan nishon EMAS */
        .pq2107 .pq-sky{position:relative;height:88px;}
        .pq2107 .pq-sun{position:absolute;left:20px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 3px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2107sun 3.6s ease-in-out infinite;}
        .pq2107 .pq-branch{position:absolute;z-index:1;pointer-events:none;transform-origin:top center;animation:pq2107sway 4.2s ease-in-out infinite;}
        .pq2107 .pq-branch.l{left:-8px;top:8px;} .pq2107 .pq-branch.r{right:64px;top:2px;animation-delay:-1.6s;}
        .pq2107 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:34px;background:radial-gradient(120% 100% at 50% 100%,#a6d67c 0%,#8fca6b 62%,#7cbd5a 100%);z-index:1;pointer-events:none;}
        .pq2107 .pq-basketw{position:absolute;right:16px;bottom:2px;z-index:2;line-height:0;pointer-events:none;}
        .pq2107 .pq-badge{position:absolute;top:-4px;right:-6px;min-width:22px;height:20px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:3;pointer-events:none;font-variant-numeric:tabular-nums;box-shadow:0 1px 3px rgba(0,0,0,.28);border:1.5px solid #fff;}
        .pq2107 .pq-loose{position:absolute;bottom:4px;z-index:2;line-height:0;pointer-events:none;}
        .pq2107 .pq-loose.a{right:96px;} .pq2107 .pq-loose.b{right:120px;bottom:0;}
        .pq2107 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2107 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 14px;}
        .pq2107 .pq-card{position:relative;min-width:104px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 16px 12px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,110,150,.12);font-family:inherit;}
        .pq2107 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,110,150,.2);}
        .pq2107 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2107 .pq-card:disabled{cursor:default;}
        .pq2107 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2107 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2107cele .55s ease;}
        .pq2107 .pq-card.dim{opacity:.42;filter:grayscale(.32);}
        .pq2107 .pq-appdeco{line-height:0;pointer-events:none;opacity:.9;}
        .pq2107 .pq-num{display:flex;align-items:baseline;font-size:38px;font-weight:900;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:.02em;}
        .pq2107 .pq-td,.pq2107 .pq-ud{display:inline-block;}
        .pq2107 .pq-card.won .pq-td{color:#1a7f43;}
        .pq2107 .pq-card.won .pq-ud{color:#5b7d63;}
        .pq2107 .pq-eq{color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;animation:pq2107pop .4s ease both;pointer-events:none;}
        .pq2107 .pq-spark{position:absolute;top:6px;right:9px;line-height:0;pointer-events:none;animation:pq2107tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2107 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2107in .22s ease both;}
        .pq2107 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2107 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2107sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2107sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2107pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2107tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2107cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2107in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          <svg className="pq-branch l" width="60" height="42" viewBox="0 0 60 42" aria-hidden="true"><path d="M0,8 Q28,3 44,16" fill="none" stroke="#8a5a2c" strokeWidth="3.4" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M22,5 Q28,1 29,6 Q24,8 22,5 Z" /><path d="M36,10 Q42,6 43,11 Q38,13 36,10 Z" /></g></svg>
          <svg className="pq-branch r" width="60" height="42" viewBox="0 0 60 42" aria-hidden="true"><path d="M60,8 Q32,3 16,16" fill="none" stroke="#8a5a2c" strokeWidth="3.4" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M38,5 Q32,1 31,6 Q36,8 38,5 Z" /><path d="M24,10 Q18,6 17,11 Q22,13 24,10 Z" /></g></svg>
          <span className="pq-hill" />
          {/* Kanon bezak: savat = 10 olmani bog'lagan bitta birlik ('10' nishoni) + 2 yakka olma */}
          <span className="pq-basketw"><Basket w={66} /><b className="pq-badge">10</b></span>
          <span className="pq-loose a"><Apple w={22} /></span>
          <span className="pq-loose b"><Apple w={19} /></span>
          <div className="pq-title">{t.title}</div>
        </div>

        <div className="pq-cards">
          {NUMS.map((n, i) => {
            const good = tensOf(n) === TARGET_TENS;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={String(n)}>
                <span className="pq-appdeco"><Apple w={20} /></span>
                <span className="pq-num"><span className="pq-td">{tensOf(n)}</span><span className="pq-ud">{unitsOf(n)}</span></span>
                {ok && good && <b className="pq-eq">{tensOf(n) * 10} + {unitsOf(n)}</b>}
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
