// Dars07 · Amaliyot 02 — P7 Qo'shilish ma'nosi (guruhga chalg'ituvchi qo'shiladi) · 🟡 · tag: join_distractor
// Maydoncha: 2 bola arg'imchoq yonida (ko'k), 3 bola + bitta kuchukcha o'ng chetdan yugurib kiradi (sariq + jigarrang).
// Savol faqat BOLALAR haqida — kuchukcha chalg'ituvchi: sanalmaydi, badge chiqmaydi, davraga qo'shilmaydi; g'alabada chip «2 + 3 = 5».
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

const A = 2, B = 3;
const DATA = { a: 2, b: 3, target: 5, options: [4, 5, 6], ptype: 'P7', level: '🟡', tag: 'join_distractor' };
const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · Arg\'imchoq', title: 'Qo\'shilish',
    setup: 'Arg\'imchoq yonida ikki bola o\'ynab turibdi. Yana uchta bola yugurib keldi — ular bilan birga bitta kuchukcha ham kirib oldi!',
    ask: 'Endi maydonchada jami nechta BOLA bo\'ldi?',
    correct: 'Barakalla! Ikki va uch — besh bola. Kuchukcha esa mehmon!',
    hint: 'Diqqat: kuchukcha bola emas! Faqat bolalarni qo\'shib sanang.',
  },
  ru: {
    eyebrow: 'Детская площадка · Качели', title: 'Присоединение',
    setup: 'Возле качелей играют двое детей. Прибежали ещё трое — а вместе с ними на площадку забежал щенок!',
    ask: 'Сколько всего ДЕТЕЙ стало на площадке?',
    correct: 'Молодец! Два и три — пять детей. А щенок — просто гость!',
    hint: 'Внимание: щенок — не ребёнок! Считай только детей.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
const BLUE = { c: '#4f8fc4', line: '#34648c' };
const YELLOW = { c: '#f2b134', line: '#b97c14' };

// Bola kanoni: dumaloq teri-rang bosh + blikli pirpiratuvchi ko'zlar + tabassum +
// futbolka-tana (yumaloq to'rtburchak) + kalta oyoqchalar. Bitta bola = bitta figura.
const Kid = ({ shirt, d }) => (
  <svg viewBox="0 0 34 46" width="30" height="41" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.6)}s` }}>
    <line x1="13" y1="36" x2="13" y2="43" stroke="#6b5b4a" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="21" y1="36" x2="21" y2="43" stroke="#6b5b4a" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="8" y="21.5" width="18" height="15.5" rx="6" fill={shirt.c} stroke={shirt.line} strokeWidth="1.5" />
    <circle cx="17" cy="12" r="9" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5" />
    <circle cx="14" cy="11" r="1.35" fill="#1f2430" /><circle cx="14.5" cy="10.5" r="0.5" fill="#fff" />
    <circle cx="20" cy="11" r="1.35" fill="#1f2430" /><circle cx="20.5" cy="10.5" r="0.5" fill="#fff" />
    <g className="pq-blink"><rect x="12.2" y="9.4" width="3.6" height="3.2" rx="1.5" fill={SKIN} /><rect x="18.2" y="9.4" width="3.6" height="3.2" rx="1.5" fill={SKIN} /></g>
    <path d="M14 15.4 Q17 17.6 20 15.4" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

// Kuchukcha — CHALG'ITUVCHI (bola emas, sanalmaydi, badge chiqmaydi). Kanon-uslub:
// 2-ton jigarrang (och tana + to'q dog'/quloq), blikli pirpiratuvchi ko'z, tabassum,
// dumi likillaydi (pq-wag). Chapga qarab yugurib kiradi — bolalardan aniq farq qiladi.
const PUP = { c: '#d7a06b', dark: '#8a5a2e', line: '#a06a38' };
const Pup = () => (
  <svg viewBox="0 0 46 32" width="41" height="29" aria-hidden="true" style={{ display: 'block', '--bd': '-1.7s' }}>
    <g className="pq-wag"><path d="M35 15 Q41 10 40.5 4.5" stroke={PUP.dark} strokeWidth="3.4" fill="none" strokeLinecap="round" /></g>
    <line x1="31" y1="23" x2="31" y2="30" stroke={PUP.dark} strokeWidth="3" strokeLinecap="round" />
    <line x1="15" y1="23" x2="15" y2="30" stroke={PUP.dark} strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="25" cy="19" rx="11" ry="7.5" fill={PUP.c} stroke={PUP.line} strokeWidth="1.5" />
    <ellipse cx="29.5" cy="16.5" rx="5" ry="3.2" fill="#b97f4b" opacity=".85" />
    <line x1="27" y1="25" x2="27" y2="30" stroke={PUP.line} strokeWidth="3" strokeLinecap="round" />
    <line x1="19" y1="25" x2="19" y2="30" stroke={PUP.line} strokeWidth="3" strokeLinecap="round" />
    <circle cx="11" cy="11" r="7" fill={PUP.c} stroke={PUP.line} strokeWidth="1.5" />
    <path d="M14 4.6 Q19 5.4 17.6 12 Q17 14.8 14.2 13.6 Z" fill={PUP.dark} />
    <circle cx="6.8" cy="13" r="3.4" fill="#eec9a0" />
    <circle cx="4.8" cy="11.8" r="1.5" fill="#4a3220" />
    <circle cx="9.3" cy="9.8" r="1.3" fill="#1f2430" /><circle cx="9.7" cy="9.4" r="0.5" fill="#fff" />
    <g className="pq-blink"><rect x="7.6" y="8.2" width="3.4" height="3.2" rx="1.5" fill={PUP.c} /></g>
    <path d="M5.6 14.8 Q7.6 16.4 9.6 14.9" stroke="#8a5f3a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
  </svg>
);

// Arg'imchoq: A-ramka + tepa ustun + osilgan o'rindiq (sekin tebranadi — pq-swingseat).
const Swing = () => (
  <svg viewBox="0 0 112 118" width="104" height="110" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="10" y1="112" x2="30" y2="12" stroke="#b0793f" strokeWidth="6" strokeLinecap="round" />
    <line x1="50" y1="112" x2="30" y2="12" stroke="#96602c" strokeWidth="6" strokeLinecap="round" />
    <line x1="62" y1="112" x2="82" y2="12" stroke="#b0793f" strokeWidth="6" strokeLinecap="round" />
    <line x1="102" y1="112" x2="82" y2="12" stroke="#96602c" strokeWidth="6" strokeLinecap="round" />
    <line x1="26" y1="12" x2="86" y2="12" stroke="#c58a4a" strokeWidth="7" strokeLinecap="round" />
    <circle cx="30" cy="12" r="4" fill="#8a5424" /><circle cx="82" cy="12" r="4" fill="#8a5424" />
    <g className="pq-swingseat">
      <line x1="46" y1="14" x2="46" y2="74" stroke="#9aa0a8" strokeWidth="2.4" />
      <line x1="66" y1="14" x2="66" y2="74" stroke="#9aa0a8" strokeWidth="2.4" />
      <rect x="39" y="72" width="34" height="8" rx="3" fill="#d9534b" stroke="#a33630" strokeWidth="1.5" />
      <rect x="42" y="74" width="14" height="2.4" rx="1.2" fill="#ef8d86" />
    </g>
  </svg>
);

// Slayd-toboggan: ikki ustunli narvon + platforma + ko'k qiyalik (blik chizig'i bilan).
const Slide = () => (
  <svg viewBox="0 0 110 96" width="100" height="88" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="16" y1="92" x2="16" y2="26" stroke="#8a8f98" strokeWidth="5" strokeLinecap="round" />
    <line x1="36" y1="92" x2="36" y2="26" stroke="#767b84" strokeWidth="5" strokeLinecap="round" />
    <line x1="16" y1="40" x2="36" y2="40" stroke="#9aa0a8" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="54" x2="36" y2="54" stroke="#9aa0a8" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="68" x2="36" y2="68" stroke="#9aa0a8" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="82" x2="36" y2="82" stroke="#9aa0a8" strokeWidth="3" strokeLinecap="round" />
    <rect x="10" y="18" width="36" height="9" rx="3.5" fill="#57a84f" stroke="#3a7a35" strokeWidth="1.5" />
    <path d="M42 24 L52 24 L102 78 Q106 84 98 86 L90 86 Q85 84 82 80 L38 34 Z" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M46 30 L92 78" stroke="#dff1fb" strokeWidth="4" strokeLinecap="round" opacity=".55" />
  </svg>
);

const LEFT_POS = [120, 152];
const COME_POS = [206, 238, 270];

export default function D07_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-animatsiyasi qayta ijro etilmaydi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0702" ref={fitRef}>
      <style>{`
        .pq0702{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0702 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7fb5;text-transform:uppercase;}
        .pq0702 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0702 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0702 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0702 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:232px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0702 .pq-fit{position:relative;margin:0 auto;}
        .pq0702 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0702 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0702 .pq-cloud.c1{top:18px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0702 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-26s;}
        .pq0702 .pq-fence{position:absolute;left:0;right:0;bottom:54px;height:34px;background:repeating-linear-gradient(90deg,#e9dcc0 0 9px,#dbc9a3 9px 13px,transparent 13px 24px);opacity:.85;z-index:0;}
        .pq0702 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#d3bf96;border-radius:3px;}
        .pq0702 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0702 .pq-flora{position:absolute;left:0;bottom:3px;z-index:1;}
        .pq0702 .pq-swing{position:absolute;left:10px;bottom:26px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0702 .pq-swingseat{transform-box:view-box;transform-origin:56px 12px;animation:pqSwing 3.2s ease-in-out infinite alternate;}
        .pq0702 .pq-slide{position:absolute;right:2px;bottom:26px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));opacity:.95;}
        .pq0702 .pq-kidw{position:absolute;bottom:30px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));transition:transform .9s ease .1s;}
        .pq0702 .pq-pupw{position:absolute;bottom:24px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0702 .pq-wag{transform-box:view-box;transform-origin:35px 16px;animation:pqWag .45s ease-in-out infinite alternate;}
        .pq0702 .pq-scene.win .gL{transform:translateX(14px);}
        .pq0702 .pq-scene.win .gR{transform:translateX(-16px);}
        .pq0702 .pq-walkin{animation:pqWalkIn 1.35s cubic-bezier(.3,.75,.4,1) both;}
        .pq0702 .pq-kbob{animation:pqIdleK 2.8s ease-in-out infinite;}
        .pq0702 .pq-kbob.run{animation:pqStep .27s ease-in-out 5,pqIdleK 2.8s ease-in-out infinite;}
        .pq0702 .pq-scene.still .pq-walkin{animation:none;}
        .pq0702 .pq-scene.still .pq-kbob.run{animation:pqIdleK 2.8s ease-in-out infinite;}
        .pq0702 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0702 .pq-cnt{position:absolute;top:-10px;left:50%;margin-left:-9.5px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0702 .pq-q{position:absolute;left:184px;top:36px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#3f7fb5;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(63,127,181,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:3;}
        .pq0702 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0702 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0702 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0702 .pq-opt:hover:not(:disabled){border-color:#b7d4ea;transform:translateY(-2px);}
        .pq0702 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0702 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0702 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0702 .pq-opt:disabled{cursor:default;}
        .pq0702 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0702 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0702 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSwing{from{transform:rotate(6deg);}to{transform:rotate(-6deg);}}
        @keyframes pqWag{from{transform:rotate(16deg);}to{transform:rotate(-12deg);}}
        @keyframes pqWalkIn{from{transform:translateX(165px);}to{transform:translateX(0);}}
        @keyframes pqStep{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqIdleK{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 232 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '') + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" /><span className="pq-grass" />
        <svg className="pq-flora" viewBox="0 0 360 18" width="360" height="18" aria-hidden="true">
          <path d="M14 16 q3 -9 5 -1 M24 17 q3 -10 6 -1 M178 16 q3 -9 5 -1 M330 17 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="52" y1="17" x2="52" y2="8" stroke="#5ea44d" strokeWidth="2" /><circle cx="52" cy="6" r="3.2" fill="#e88bb1" /><circle cx="52" cy="6" r="1.3" fill="#b1487a" /></g>
          <g><line x1="306" y1="17" x2="306" y2="9" stroke="#5ea44d" strokeWidth="2" /><circle cx="306" cy="7" r="3.2" fill="#f2b134" /><circle cx="306" cy="7" r="1.3" fill="#b97c14" /></g>
        </svg>
        <span className="pq-swing"><Swing /></span>
        <span className="pq-slide"><Slide /></span>

        {LEFT_POS.map((x, i) => (
          <div key={'L' + i} className="pq-kidw gL" style={{ left: x }}>
            <div className="pq-kbob" style={{ animationDelay: `${-i * 0.9}s` }}><Kid shirt={BLUE} d={i} /></div>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
          </div>
        ))}
        {COME_POS.map((x, i) => (
          <div key={'R' + i} className="pq-kidw gR" style={{ left: x }}>
            <div className="pq-walkin" style={{ animationDelay: `${i * 0.22}s` }}>
              <div className="pq-kbob run" style={{ animationDelay: `${i * 0.22}s, ${1.35 + i * 0.22}s` }}><Kid shirt={YELLOW} d={A + i} /></div>
            </div>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${(A + i) * 0.12}s` }}>{A + i + 1}</b>}
          </div>
        ))}
        {/* Kuchukcha — chalg'ituvchi: bolalar ortidan yugurib kiradi, sanalmaydi, badge yo'q, davraga kirmaydi. */}
        <div className="pq-pupw" style={{ left: 300 }}>
          <div className="pq-walkin" style={{ animationDelay: '0.55s' }}>
            <div className="pq-kbob run" style={{ animationDelay: '0.55s, 1.9s' }}><Pup /></div>
          </div>
        </div>

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{A} + {B} = {DATA.target}</span>}
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
