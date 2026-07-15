// Dars28 · Amaliyot 01 — Masala tuzilishi «Yig'indiga masala» · 🟢 · tag: sum
// QIYINROQ (ikki xonali, o'tkazmasdan): bog'da 23 olma, yana 14 terildi -> jami nechta? Javob 37.
// Ma'no: ikki to'plam BIRLASHTIRILSA — QO'SHAMIZ (+). Bola amalni ma'nodan tanlaydi.
// KANON (Dars 24-27): bitta o'nlik = bitta OLMA QUTISI (10 olma, "10" nishoni); bitta birlik = yakka olma.
//   23 = 2 quti + 3 olma; 14 = 1 quti + 4 olma. Birlashganda: quti qutiga, yakka olma yakka olmaga
//   (razryad bo'yicha, Dars 26). O'nlik: 2+1=3, birlik: 3+4=7 -> 23 + 14 = 37 (hech qayerda o'tkazma yo'q).
// Sahna: 23 va 14 birlashib 3 quti + 7 olma bo'ladi, so'ng tenglama 23 + 14 = 37.
// Distraktorlar: 9 (M1 — ayirib qo'ygan: 23 − 14), 47 (M3 — noto'g'ri son).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
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

const A_TENS = 2, A_UNITS = 3;                  // 23 = 2 quti + 3 olma
const B_TENS = 1, B_UNITS = 4;                  // 14 = 1 quti + 4 olma
const A = 23, B = 14, TARGET = 37;              // 23 + 14 = 37
const SUM_TENS = A_TENS + B_TENS;               // 3 quti
const SUM_UNITS = A_UNITS + B_UNITS;            // 7 olma
const DATA = { a: A, b: B, target: TARGET, options: [37, 9, 47], answer: TARGET, level: '🟢', tag: 'sum' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Jami nechta?",
    setup: "Bog'da 23 olma bor, yana 14 terildi.",
    ask: "Jami nechta olma?",
    correct: "Barakalla! Jami — qo'shamiz. O'nlik: 2+1=3, birlik: 3+4=7. 23 + 14 = 37.",
    hint: "Jami topish — qo'shing. O'nlikka o'nlik, birlikka birlik: 2+1 va 3+4.",
    tens: "o'nlik", units: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "Сколько всего?",
    setup: "В саду 23 яблока, собрали ещё 14.",
    ask: "Сколько всего яблок?",
    correct: "Молодец! Всего — складываем. Десятки: 2+1=3, единицы: 3+4=7. 23 + 14 = 37.",
    hint: "Найти всего — сложить. Десятки к десяткам, единицы к единицам.",
    tens: "десятки", units: "единицы",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik.
const Apple = ({ w = 26 }) => {
  const id = 'pq2801a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
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

// OLMA QUTISI (bitta o'nlik = 10 olma bir birlikka bog'langan): to'qima quti, ustidan olmalar mo'ralaydi,
// oldida yashil «10» nishoni. Bola qutidagi olmalarni QAYTA sanamaydi — quti = bitta razryad birligi.
const Crate = ({ w = 46 }) => {
  const id = 'pq2801c' + (__gid++);
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
      {/* olmalar to'plami quti ustidan mo'ralaydi */}
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      {/* quti gardishi */}
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      {/* quti tanasi */}
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      {/* tik to'qima */}
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      {/* ko'ndalang to'qima */}
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      {/* «10» nishoni — bu quti bitta o'nlik ekanini bildiradi */}
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

export default function D28_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda birlashish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
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

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (olma/quti bosiladigan nishon EMAS — dekor)

  const cratesA = Array.from({ length: A_TENS });
  const applesA = Array.from({ length: A_UNITS });
  const cratesB = Array.from({ length: B_TENS });
  const applesB = Array.from({ length: B_UNITS });
  const cratesSum = Array.from({ length: SUM_TENS });
  const applesSum = Array.from({ length: SUM_UNITS });
  const joinDelay = (i) => still ? 0 : 0.12 + i * 0.12; // ketma-ket birlashish
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq2801" ref={fitRef}>
      <style>{`
        .pq2801{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2801 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c14a3c;text-transform:uppercase;}
        .pq2801 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2801 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2801 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2801 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:236px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2801 .pq-fit{position:relative;margin:0 auto;}
        .pq2801 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2801sun 3.6s ease-in-out infinite;}
        .pq2801 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2801 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2801 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#c14a3c,#a2382c);border:2.5px solid #83271d;color:#fdeee9;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.22);pointer-events:none;}

        .pq2801 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq2801 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2801 .pq-crates{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:150px;}
        .pq2801 .pq-crates.sum{max-width:200px;}
        .pq2801 .pq-apples{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:140px;}
        .pq2801 .pq-apples.sum{max-width:200px;}
        .pq2801 .pq-obj{line-height:0;}
        .pq2801 .pq-obj.idle{animation:pq2801bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2801 .pq-obj.join{animation:pq2801join .42s ease both;animation-delay:var(--bd,0s);}
        .pq2801 .pq-gl{padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #b6743c;color:#a2582a;font-weight:900;font-size:12px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);animation:pq2801pop .36s ease both;}
        .pq2801 .pq-gl.u{border-color:#c0392b;color:#c0392b;}
        .pq2801 .pq-tag{padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #b6743c;color:#a2582a;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq2801 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        .pq2801 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2801tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2801 .pq-spark.s2{animation-delay:-.6s;} .pq2801 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2801 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2801in .3s ease both;}
        .pq2801 .pq-eq b{min-width:44px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fdeee9;border:2px solid #eab5aa;color:#c14a3c;font-variant-numeric:tabular-nums;}
        .pq2801 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2801 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2801 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2801in .3s .1s both;}

        .pq2801 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq2801 .pq-opt{min-width:78px;height:72px;padding:0 12px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2801 .pq-opt:hover:not(:disabled){border-color:#eab5aa;transform:translateY(-2px);}
        .pq2801 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2801 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2801 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2801cele .5s ease;}
        .pq2801 .pq-opt:disabled{cursor:default;}
        .pq2801 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2801in .22s ease both;}
        .pq2801 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2801 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2801bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2801join{from{opacity:0;transform:translateY(-8px) scale(.7);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2801sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2801pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2801tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2801cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2801in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 380 * scale, height: 236 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {ok ? (
            // G'alaba: ikki to'plam BIRLASHDI — quti qutiga (3 o'nlik), yakka olma yakka olmaga (7 birlik)
            <div className="pq-group">
              <div className="pq-crates sum">
                {cratesSum.map((_, i) => (
                  <span key={'c' + i} className={'pq-obj' + (still ? '' : ' join')} style={{ '--bd': `${joinDelay(i)}s` }}>
                    <Crate w={46} />
                  </span>
                ))}
              </div>
              <div className="pq-apples sum">
                {applesSum.map((_, i) => (
                  <span key={'a' + i} className={'pq-obj' + (still ? '' : ' join')} style={{ '--bd': `${joinDelay(SUM_TENS + i)}s` }}>
                    <Apple w={26} />
                  </span>
                ))}
              </div>
              <span className="pq-gl">{SUM_TENS} {t.tens} · {SUM_UNITS} {t.units}</span>
            </div>
          ) : (<>
            {/* 23 = 2 quti + 3 olma */}
            <div className="pq-group">
              <div className="pq-crates">
                {cratesA.map((_, i) => (
                  <span key={'ca' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                    <Crate w={44} />
                  </span>
                ))}
              </div>
              <div className="pq-apples">
                {applesA.map((_, i) => (
                  <span key={'aa' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(A_TENS + i) * 0.12}s` }}>
                    <Apple w={26} />
                  </span>
                ))}
              </div>
              <span className="pq-tag">{A}</span>
            </div>
            {/* birlashtirilsa QO'SHAMIZ — «+» boshidanoq ko'rinadi (javobni ochmaydi) */}
            <span className="pq-plus">{'+'}</span>
            {/* 14 = 1 quti + 4 olma */}
            <div className="pq-group">
              <div className="pq-crates">
                {cratesB.map((_, i) => (
                  <span key={'cb' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                    <Crate w={44} />
                  </span>
                ))}
              </div>
              <div className="pq-apples">
                {applesB.map((_, i) => (
                  <span key={'ab' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(B_TENS + i) * 0.12}s` }}>
                    <Apple w={26} />
                  </span>
                ))}
              </div>
              <span className="pq-tag">{B}</span>
            </div>
          </>)}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {/* G'alaba: birlashtirdik — QO'SHAMIZ, razryad bo'yicha (23 + 14 = 37) */}
      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'+'}</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A_TENS}+{B_TENS}={SUM_TENS} {t.tens} · {A_UNITS}+{B_UNITS}={SUM_UNITS} {t.units}</div>
      </>)}

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
