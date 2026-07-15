// Dars21 · Amaliyot 09 — Og'zaki masala «Olma bog'i» · 🔴 · tag: place_word
// Bitta-tanlov (og'zaki masala): Anvar 3 savat (har birida 10 tadan) va 6 dona olma terdi. Jami? → 36.
// Savat = 10 olmani bog'lagan BITTA birlik ('10' nishoni bilan) — bola savat ichini qayta
// sanamaydi. Yakka olma = 1 birlik. O'nliklar VA birliklar QO'SHILADI: 30 + 6 = 36 (savat-guruh
// bilan olma-guruh orasida minus YO'Q). Chalg'ituvchilar: 63 (M1 o'rin almashish), 9 (M2 raqamlarni
// qo'shish 3+6). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const TENS = 3, UNITS = 6, TEN = 10, TARGET = 36;
const TENS_VAL = TENS * TEN; // 30
const DATA = { tens: TENS, units: UNITS, target: TARGET, options: [36, 63, 9], level: '🔴', tag: 'place_word' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Bog'da",
    setup: "Anvar har birida 10 tadan olma bo'lgan 3 savat va yana 6 dona olma terdi.",
    ask: "Anvar hammasi bo'lib nechta olma terdi?",
    correct: "Barakalla! 3 o'nlik va 6 birlik — o'ttiz olti. 30 + 6 = 36.",
    hint: "3 savat — o'ttiz. Yana 6 olma qo'shing.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "В саду",
    setup: "Анвар собрал 3 корзины по 10 яблок и ещё 6 яблок.",
    ask: "Сколько всего яблок собрал Анвар?",
    correct: "Молодец! 3 десятка и 6 единиц — тридцать шесть. 30 + 6 = 36.",
    hint: "3 корзины — тридцать. Прибавь ещё 6 яблок.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma tanasi (2-ton radial) + barg + band + oq blik.
// Bitta yakka olma = bitta birlik.
let __aid = 0;
const Apple = ({ w = 26 }) => {
  const id = 'pq2109a' + (__aid++);
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
      {/* band */}
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      {/* barg */}
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      {/* tana (yuqorida yengil o'yiq) */}
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (o'nlik): to'qilgan savat (gorizontal+vertikal to'qima yoylari) + jiyakdan mo'ralab
// turgan olmalar + '10' nishoni. Savat = 10 olmani bog'lagan BITTA birlik (ichi qayta sanalmaydi).
let __bid = 0;
const Basket = ({ w = 78 }) => {
  const id = 'pq2109b' + (__bid++);
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
      {/* jiyakdan mo'ralagan olmalar to'plami (savat to'la) */}
      <g stroke="#a6291f" strokeWidth=".7">
        <circle cx="26" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="62" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="44" cy="25" r="11.5" fill={`url(#${id}ap)`} />
      </g>
      {/* barglar */}
      <path d="M46,15 Q52,12 53.5,16.5 Q48.5,18.5 46,15 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".6" />
      {/* jiyak (yuqori halqa) */}
      <rect x="8" y="33" width="72" height="9" rx="4.5" fill="#c98a45" stroke="#7a4a20" strokeWidth="1.4" />
      {/* savat tanasi — pastga toraygan trapetsiya */}
      <path d="M12,42 L76,42 L67,72 Q66,75 62,75 L26,75 Q22,75 21,72 Z" fill={`url(#${id})`} stroke="#7a4a20" strokeWidth="1.5" strokeLinejoin="round" />
      {/* vertikal to'qima chiziqlari */}
      <g stroke="#7a4a20" strokeWidth="1.1" opacity=".55" fill="none">
        <path d="M24,42 L27,74" /><path d="M34,42 L35.6,74" /><path d="M44,42 L44,75" />
        <path d="M54,42 L52.4,74" /><path d="M64,42 L61,74" />
      </g>
      {/* gorizontal to'qima yoylari */}
      <g stroke="#5f3b18" strokeWidth="1.2" opacity=".5" fill="none">
        <path d="M14,52 Q44,58 74,52" /><path d="M17,62 Q44,68 71,62" />
      </g>
    </svg>
  );
};

export default function D21_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlovni va fikr-bildirishni tiklaydi (msg DOIM; setChecked FAQAT to'g'rida).
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const idle = !ok; // g'alabagacha yengil tebranish (yakka olma bosiladigan nishon EMAS)
  const [fitRef, scale] = useFitScale(400);

  return (
    <div className="pq pq2109" ref={fitRef}>
      <style>{`
        .pq2109{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2109 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2109 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2109 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2109 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2109 .pq-scene{box-sizing:border-box;position:relative;width:400px;height:238px;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 46%,#cdeeb6 72%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2109 .pq-fit{position:relative;margin:0 auto;}
        .pq2109 .pq-sun{position:absolute;left:18px;top:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2109sun 3.6s ease-in-out infinite;}
        /* ambient bargli shoxlar (bezak) */
        .pq2109 .pq-branch{position:absolute;z-index:1;pointer-events:none;color:#4fa845;transform-origin:top center;animation:pq2109sway 4.2s ease-in-out infinite;}
        .pq2109 .pq-branch.l{left:-6px;top:26px;} .pq2109 .pq-branch.r{right:-6px;top:20px;animation-delay:-1.6s;}
        .pq2109 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:44px;background:radial-gradient(120% 100% at 50% 100%,#a6d67c 0%,#8fca6b 60%,#7cbd5a 100%);z-index:1;pointer-events:none;}
        .pq2109 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2109 .pq-arena{position:absolute;left:10px;right:10px;top:40px;bottom:26px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq2109 .pq-tens{display:flex;align-items:flex-end;gap:2px;flex:0 0 auto;}
        .pq2109 .pq-units{display:grid;grid-template-columns:repeat(3,auto);gap:5px 7px;flex:0 0 auto;align-content:center;}
        .pq2109 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;margin:0 2px;}
        .pq2109 .pq-basket{position:relative;line-height:0;}
        .pq2109 .pq-basket.idle{animation:pq2109bob 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        /* '10' nishoni — bezak qatlam, taplarni ushlamaydi */
        .pq2109 .pq-badge{position:absolute;top:-6px;right:-4px;min-width:22px;height:20px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:5;pointer-events:none;font-variant-numeric:tabular-nums;box-shadow:0 1px 3px rgba(0,0,0,.28);border:1.5px solid #fff;}
        .pq2109 .pq-apple{line-height:0;}
        .pq2109 .pq-apple.idle{animation:pq2109bob 2.7s ease-in-out infinite;animation-delay:var(--d,0s);}
        /* g'alaba: yakuniy jami pilyulasi (AnsPop) — sahnaning bosh vizualida javob */
        .pq2109 .pq-total{position:absolute;top:34px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:17px;padding:2px 14px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq2109pop .45s ease both;}

        .pq2109 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2109tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2109 .pq-spark.s2{animation-delay:-.6s;} .pq2109 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2109 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pq2109in .3s ease both;}
        .pq2109 .pq-eq b{min-width:44px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2109 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2109 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq2109 .pq-opts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px;}
        .pq2109 .pq-opt{min-width:82px;height:72px;padding:0 10px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2109 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2109 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2109 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2109 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2109cele .5s ease;}
        .pq2109 .pq-opt:disabled{cursor:default;}
        .pq2109 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2109in .22s ease both;}
        .pq2109 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2109 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2109bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2109sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2109sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2109pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2109tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2109cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2109in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 400 * scale, height: 238 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <svg className="pq-branch l" width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M0,6 Q26,2 40,14" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M20,4 Q26,0 27,5 Q22,7 20,4 Z" /><path d="M33,8 Q39,4 40,9 Q35,11 33,8 Z" /></g></svg>
        <svg className="pq-branch r" width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M54,6 Q28,2 14,14" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M34,4 Q28,0 27,5 Q32,7 34,4 Z" /><path d="M21,8 Q15,4 14,9 Q19,11 21,8 Z" /></g></svg>
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {/* O'nliklar: 3 savat (har biri 10 olmani bog'lagan bitta birlik, '10' nishoni bilan) */}
          <div className="pq-tens">
            {Array.from({ length: TENS }).map((_, i) => (
              <span key={i} className={'pq-basket' + (idle ? ' idle' : '')} style={{ '--d': `${i * 0.22}s` }}>
                <Basket w={78} />
                <b className="pq-badge">{TEN}</b>
              </span>
            ))}
          </div>

          {/* O'nliklar VA birliklar QO'SHILADI: 30 + 6 (minus EMAS) */}
          <span className="pq-plus">{'+'}</span>

          {/* Birliklar: 6 yakka olma */}
          <div className="pq-units">
            {Array.from({ length: UNITS }).map((_, i) => (
              <span key={i} className={'pq-apple' + (idle ? ' idle' : '')} style={{ '--d': `${0.15 + i * 0.16}s` }}>
                <Apple w={24} />
              </span>
            ))}
          </div>
        </div>

        {ok && <span className="pq-total">{TARGET}</span>}
        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '64px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '38px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (
        <div className="pq-eq"><b>{TENS_VAL}</b><i>{'+'}</i><b>{UNITS}</b><i>=</i><b className="res">{TARGET}</b></div>
      )}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
