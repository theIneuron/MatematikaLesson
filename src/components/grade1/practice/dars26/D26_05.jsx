// Dars26 · Amaliyot 05 — «Ikki xonali + ikki xonali (o'tishsiz)» zanjir «Olma bog'i» · 🔴 · tag: tt_chain
// 4 misol birdaniga: har biri ikki xonali + ikki xonali (o'tishsiz). Qoida: RAZRYAD bo'yicha —
// o'nlikka o'nlik, birlikka birlik qo'shiladi (24+13: 2+1=3 o'nlik, 4+3=7 birlik -> 37). O'nliklar
// yig'indisi ham, birliklar yig'indisi ham 10 dan kichik. FAQAT QO'SHISH — ayirish, minus YO'Q.
// Sahna: olma bog'i — 4 savat (har biri o'nlik = 10 olma) ambient bezak, quyosh/daraxt jonli.
// Chalg'ituvchilar: M1 barcha raqamlarni qo'shish (24+13 -> 2+4+1+3=10), M2 faqat o'nliklar (20+10=30),
// yaqin-adashuv (38). VEDI-DO-VERNOGO: noto'g'ri qator qulflanmaydi, retry yo'q; setChecked FAQAT to'g'rida.
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

// To'g'ri javob har qatorda TURLI o'rinда (idx 1,2,3,0) — chapdan-bosib-yutish yo'q (review D26_05).
const ROWS = [
  { expr: '24 + 13', ans: 37, opts: [10, 37, 30, 38] },
  { expr: '41 + 35', ans: 76, opts: [13, 70, 76, 75] },
  { expr: '52 + 27', ans: 79, opts: [16, 70, 78, 79] },
  { expr: '63 + 24', ans: 87, opts: [87, 15, 80, 86] },
];
const DATA = { ptype: 'P8tt', level: '🔴', tag: 'tt_chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir", title: "Misollar zanjiri",
    setup: "Kartochkalarda 4 ta misol bor.",
    ask: "Har misol uchun to'g'ri javobni tanlang.",
    correct: "Barakalla! Har misolni to'g'ri yechdingiz.",
    hint: "O'nlikka o'nlik, birlikka birlik qo'shing.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка", title: "Цепочка примеров",
    setup: "На карточках 4 примера.",
    ask: "Для каждого примера выбери верный ответ.",
    correct: "Молодец! Ты верно решил каждый пример.",
    hint: "Десятки к десяткам, единицы к единицам.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT (bitta o'nlik = 10 olma bir birlikka bog'langan): to'qima savat, ustidan olmalar mo'ralaydi,
// oldida yashil «10» nishoni. Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi.
// Dars 21 kanoni (D21_03) bo'yicha qayta ishlatilgan.
const Basket = ({ w = 46 }) => {
  const id = 'pq2605b' + (__gid++);
  const ap = id + 'ap';
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      {/* olmalar to'plami savat ustidan mo'ralaydi */}
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      {/* savat gardishi */}
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      {/* savat tanasi */}
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      {/* tik to'qima */}
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      {/* ko'ndalang to'qima */}
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      {/* «10» nishoni — bu savat bitta o'nlik ekanini bildiradi */}
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

export default function D26_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda ambient jonlanish saqlanadi, sahna yakuniy holatdan boshlanadi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.expr} = ${r.opts.join('/')}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (savat bosiladigan nishon EMAS — bezak)
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq2605">
      <style>{`
        .pq2605{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2605 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2605 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2605 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2605 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2605 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#f2f9ec,#e6f4d9);border:2px solid #cfe6bd;}
        .pq2605 .pq-fit{position:relative;margin:0 auto;}
        .pq2605 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:150px;border-radius:18px;background:linear-gradient(#cfeafc 0%,#e4f4d9 54%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2605 .pq-sun{position:absolute;right:16px;top:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2605sun 3.6s ease-in-out infinite;}
        .pq2605 .pq-cloud{position:absolute;width:48px;height:15px;background:#fff;border-radius:999px;opacity:.88;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -5px 0 -3px #fff;z-index:1;pointer-events:none;animation:pq2605cloud linear infinite;}
        .pq2605 .pq-cloud.c1{top:12px;left:-64px;animation-duration:30s;animation-delay:-8s;}
        .pq2605 .pq-cloud.c2{top:30px;left:-64px;width:34px;height:11px;opacity:.7;animation-duration:40s;animation-delay:-27s;}
        .pq2605 .pq-tree{position:absolute;bottom:40px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2605 .pq-tree.t1{left:6px;animation:pq2605sway 4.2s ease-in-out infinite;}
        .pq2605 .pq-tree.t2{right:8px;bottom:44px;animation:pq2605sway 4.8s ease-in-out .6s infinite;}
        .pq2605 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:7px;height:22px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2605 .pq-crown{width:48px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2605 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2605 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2605 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:36px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2605 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2605 .pq-arena{position:absolute;left:8px;right:8px;bottom:22px;display:flex;align-items:flex-end;justify-content:center;gap:8px;z-index:3;}
        .pq2605 .pq-basket{position:relative;flex:0 0 auto;line-height:0;}
        .pq2605 .pq-basket.idle{animation:pq2605bob 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq2605 .pq-basket.win{animation:pq2605win .5s ease;animation-delay:var(--d,0s);}
        .pq2605 .pq-cnt{position:absolute;top:-10px;left:50%;transform:translateX(-50%);min-width:19px;height:19px;padding:0 3px;border-radius:999px;background:#1a7f43;color:#fff;font-size:11.5px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);animation:pq2605pop .34s both;animation-delay:var(--bd,0s);font-variant-numeric:tabular-nums;}
        .pq2605 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2605tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2605 .pq-spark.s2{animation-delay:-.6s;} .pq2605 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2605 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq2605 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2605 .pq-rw{display:flex;flex-wrap:wrap;gap:7px;align-items:center;align-content:center;justify-content:center;padding:6px 9px;border-radius:14px;border:2.5px solid #d7e5cd;background:#fff;transition:.15s;}
        .pq2605 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2605 .pq-rw.good.win{animation:pq2605cele .5s ease;}
        .pq2605 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2605shake .35s ease;}
        .pq2605 .pq-ex{min-width:86px;height:42px;border-radius:10px;background:#f6f3ec;border:2px solid #e0d6c4;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq2605 .pq-op{margin:0 5px;color:#c9822f;}
        .pq2605 .pq-eq{font-size:21px;font-weight:900;color:#8a94a2;}
        .pq2605 .pq-slot{width:42px;height:42px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2605breath 2.4s ease-in-out infinite;}
        .pq2605 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2605 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2605 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2605 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2605 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2605 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2605 .pq-sgs{display:flex;flex-wrap:wrap;align-content:center;flex-basis:100%;gap:6px;margin-top:1px;justify-content:center;}
        .pq2605 .pq-sg{min-width:40px;height:40px;padding:0 4px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2605 .pq-sg:hover:not(:disabled){border-color:#94c47f;transform:translateY(-2px);}
        .pq2605 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2605 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2605 .pq-sg:disabled{cursor:default;}
        .pq2605 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2605in .22s ease both;}
        .pq2605 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2605 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2605sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2605cloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pq2605sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2605bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2605win{0%{transform:scale(1);}30%{transform:scale(1.05) translateY(-2px);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2605pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2605tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2605breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.06);border-color:#a9b5c8;}}
        @keyframes pq2605shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2605cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2605in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 150 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '12px', top: '14px' }} /><i style={{ left: '30px', top: '9px' }} /><i style={{ left: '22px', top: '25px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '10px', top: '11px' }} /><i style={{ left: '28px', top: '20px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-board">{t.title}</div>

          {/* 4 savat — 4 misolga mos ambient bezak (bosilmaydi); g'alabada badge 1..4 */}
          <div className="pq-arena">
            {ROWS.map((_, i) => (
              <div key={i} className={'pq-basket' + (idle ? ' idle' : '') + (ok && !still ? ' win' : '')} style={{ '--d': `${i * 0.12}s` }}>
                <Basket w={48} />
                {ok && <span className="pq-cnt" style={{ '--bd': `${still ? 0 : 0.2 + i * 0.22}s` }}>{i + 1}</span>}
              </div>
            ))}
          </div>

          <span className="pq-ground" />

          {ok && (<>
            <span className="pq-spark" style={{ left: '18%', top: '40px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '80%', top: '52px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>✦</span>
          </>)}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const [a, op, b] = r.expr.split(' ');
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">{a}<b className="pq-op">{op}</b>{b}</div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
