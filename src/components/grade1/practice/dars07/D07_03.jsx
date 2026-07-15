// Dars07 · Amaliyot 03 — P7 Qo'shilish «Uchib kelganlar» · 🟡 · tag: join_selective
// 4 kaptar yerda don cho'qimoqda (bosh egilib cho'qish animatsiyasi), osmondan 2 kaptar
// PANJARA ustiga qo'nadi; ular bilan birga bitta CHUMCHUQ ham qo'nadi (kichik, jigarrang —
// D03_04 chumchuq palitrasi). Savol faqat KAPTARLAR haqida: chumchuq chalg'ituvchi,
// unga sanoq-badge chiqmaydi. G'alabada badge 1..6 (faqat kaptarlar) va chip «4 + 2 = 6».
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

const DATA = { a: 4, b: 2, target: 6, options: [5, 6, 7], ptype: 'P7', level: '🟡', tag: 'join_selective' };
const T = {
  uz: {
    eyebrow: "O'yin maydonchasi · Kaptarlar", title: 'Uchib kelganlar',
    setup: "Maydonchada to'rtta kaptar don cho'qib turibdi. Osmondan yana ikkita kaptar va bitta chumchuq uchib kelib qo'shildi!",
    ask: "Endi jami nechta KAPTAR bo'ldi?",
    correct: "Barakalla! To'rt va ikki — olti kaptar. Chumchuq esa mehmon!",
    hint: "Diqqat: chumchuq kaptar emas! Faqat kaptarlarni qo'shib sanang.",
  },
  ru: {
    eyebrow: 'Игровая площадка · Голуби', title: 'Прилетевшие',
    setup: 'На площадке четыре голубя клюют зёрна. С неба прилетели ещё два голубя и один воробей!',
    ask: 'Сколько всего ГОЛУБЕЙ стало?',
    correct: 'Молодец! Четыре и два — шесть голубей. А воробей — гость!',
    hint: 'Внимание: воробей — не голубь! Складывай и считай только голубей.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KAPTAR KANONI (D03_04 qush uslubi): kulrang tana #9aa4b2 (2-3 ton), boshi to'q,
// qanot, blikli ko'z, tumshuq, yupqa kontur. peckDelay berilsa — bosh cho'qish-animatsiyada.
const Pigeon = ({ peckDelay }) => (
  <svg viewBox="0 0 64 54" width="44" height="37" className="pq-pigsvg" aria-hidden="true">
    <path d="M4 24 L22 22 L22 32 L6 31 Z" fill="#6f7888" stroke="#525a68" strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="33" cy="28" rx="15.5" ry="10.5" fill="#9aa4b2" stroke="#6b7482" strokeWidth="1.6" />
    <ellipse cx="37" cy="32" rx="10.5" ry="6.5" fill="#c3cbd6" />
    <g className={'pq-head' + (peckDelay ? ' peck' : '')} style={peckDelay ? { animationDelay: peckDelay } : undefined}>
      <circle cx="46.5" cy="16.5" r="8" fill="#7c8596" stroke="#565e6c" strokeWidth="1.5" />
      <ellipse cx="43.5" cy="21.5" rx="4.6" ry="3" fill="#8fd0b2" opacity=".5" />
      <polygon points="54,14.5 62,17 54,19.5" fill="#e8a33d" stroke="#b97c14" strokeWidth="0.8" strokeLinejoin="round" />
      <circle cx="49" cy="14.5" r="1.9" fill="#1f2430" />
      <circle cx="49.7" cy="13.8" r="0.65" fill="#fff" />
    </g>
    <path className="pq-wingmain" d="M24 22 Q36 13 47 21 Q42 30 31 31 Q25 27 24 22 Z" fill="#7c8596" stroke="#565e6c" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M28 23 Q36 18.5 43 22" stroke="#c3cbd6" strokeWidth="1.3" fill="none" opacity=".8" />
    <line x1="30" y1="38" x2="28.5" y2="49" stroke="#c96a5f" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="37" y1="38.5" x2="37" y2="49" stroke="#c96a5f" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="28.5" y1="49" x2="24.5" y2="50.5" stroke="#c96a5f" strokeWidth="2" strokeLinecap="round" />
    <line x1="37" y1="49" x2="33" y2="50.5" stroke="#c96a5f" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// CHUMCHUQ (D03_04 chumchuq kanoni): jigarrang tana #8a6543, och ko'krak #dcbb8e,
// kaptardan ANIQ KICHIK (34px) — savolga kirmaydigan mehmon-qush, badge chiqmaydi.
const SPAR = { body: '#8a6543', breast: '#dcbb8e', head: '#7a5a3b', wing: '#5f4327' };
const Sparrow = () => (
  <svg viewBox="0 0 64 52" width="34" height="28" className="pq-pigsvg" aria-hidden="true">
    <path d="M6 22 L23 22 L23 31 L8 30 Z" fill={SPAR.wing} />
    <path d="M6 22 L14 26 L6 30 Z" fill={SPAR.body} opacity=".7" />
    <ellipse cx="34" cy="27" rx="16" ry="11" fill={SPAR.body} />
    <ellipse cx="38" cy="31.5" rx="11.5" ry="7" fill={SPAR.breast} />
    <g className="pq-sphead">
      <circle cx="48" cy="17.5" r="8.6" fill={SPAR.head} />
      <ellipse cx="50" cy="20" rx="5" ry="3.6" fill={SPAR.breast} opacity=".85" />
      <polygon points="56,15.5 63.5,18.5 56,21.5" fill="#e8a33d" />
      <circle cx="50.6" cy="15.8" r="2" fill="#1f2430" />
      <circle cx="51.4" cy="15.1" r="0.7" fill="#fff" />
    </g>
    <path className="pq-wingmain" d="M25 21 Q37 12 47 20 Q42 30 31 31 Q25 27 25 21 Z" fill={SPAR.wing} />
    <path d="M28 22 Q37 17 44 21" stroke={SPAR.breast} strokeWidth="1.4" fill="none" opacity=".6" />
    <line x1="31" y1="37.5" x2="29" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="38" y1="38" x2="38" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="29" y1="47" x2="25.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="47" x2="34.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Arg'imchoq: yog'och A-ramka + tepa ustun, osilgan o'rindiq SEKIN TEBRANADI.
const Swing = () => (
  <svg viewBox="0 0 96 118" width="82" height="101" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="16" y1="112" x2="26" y2="15" stroke="#a8783f" strokeWidth="5" strokeLinecap="round" />
    <line x1="36" y1="112" x2="26" y2="15" stroke="#c9a36a" strokeWidth="5" strokeLinecap="round" />
    <line x1="80" y1="112" x2="70" y2="15" stroke="#a8783f" strokeWidth="5" strokeLinecap="round" />
    <line x1="60" y1="112" x2="70" y2="15" stroke="#c9a36a" strokeWidth="5" strokeLinecap="round" />
    <rect x="20" y="10" width="56" height="7" rx="3.5" fill="#c9a36a" stroke="#a8783f" strokeWidth="1.5" />
    <g className="pq-pend">
      <line x1="41" y1="16" x2="41" y2="74" stroke="#8a8f98" strokeWidth="2.2" />
      <line x1="55" y1="16" x2="55" y2="74" stroke="#8a8f98" strokeWidth="2.2" />
      <rect x="34" y="73" width="28" height="7.5" rx="3.5" fill="#d9534b" stroke="#a33630" strokeWidth="1.5" />
    </g>
  </svg>
);

// Slayd-toboggan: yog'och narvon + ko'k tekis tushish yo'lagi (blik-chiziq bilan).
const Slide = () => (
  <svg viewBox="0 0 110 96" width="90" height="79" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="16" y1="90" x2="16" y2="20" stroke="#a8783f" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="32" y1="90" x2="32" y2="20" stroke="#a8783f" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="16" y1="36" x2="32" y2="36" stroke="#c9a36a" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="16" y1="52" x2="32" y2="52" stroke="#c9a36a" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="16" y1="68" x2="32" y2="68" stroke="#c9a36a" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="10" y="14" width="32" height="8" rx="3.5" fill="#c9a36a" stroke="#a8783f" strokeWidth="1.5" />
    <path d="M40 20 Q76 44 98 82 L82 90 Q62 56 36 34 Z" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M42 26 Q72 48 90 80" stroke="#7fb3d9" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".85" />
  </svg>
);

// Don sepilgan joy: yerdagi och dog' + ikki tonli don-uvoqlar.
const Grain = () => (
  <svg viewBox="0 0 130 34" width="126" height="33" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="65" cy="20" rx="60" ry="11" fill="#e8dcb2" opacity=".75" />
    <ellipse cx="34" cy="17" rx="2.4" ry="1.7" fill="#d9ae4e" /><ellipse cx="47" cy="23" rx="2.4" ry="1.7" fill="#b97c14" />
    <ellipse cx="58" cy="15" rx="2.4" ry="1.7" fill="#b97c14" /><ellipse cx="66" cy="24" rx="2.4" ry="1.7" fill="#d9ae4e" />
    <ellipse cx="78" cy="16" rx="2.4" ry="1.7" fill="#d9ae4e" /><ellipse cx="88" cy="22" rx="2.4" ry="1.7" fill="#b97c14" />
    <ellipse cx="99" cy="17" rx="2.4" ry="1.7" fill="#d9ae4e" /><ellipse cx="53" cy="19" rx="2" ry="1.4" fill="#d9ae4e" />
    <ellipse cx="72" cy="19" rx="2" ry="1.4" fill="#b97c14" /><ellipse cx="92" cy="18" rx="2" ry="1.4" fill="#d9ae4e" />
  </svg>
);

// Yerdagi 4 kaptar (chapdan o'ngga badge 1..4): donga qarab turishadi.
const GROUND = [
  { x: 88, b: 16, mir: false, dly: '-0.6s' },
  { x: 134, b: 5, mir: false, dly: '-1.7s' },
  { x: 196, b: 17, mir: true, dly: '-2.9s' },
  { x: 240, b: 6, mir: true, dly: '-1.1s' },
];
// Panjaraga qo'nuvchi 2 kaptar (badge 5..6): har biri o'z parvoz-yo'li bilan.
// Ular ortidan bitta chumchuq ham qo'nadi (flyC) — savolga kirmaydi, badge yo'q.
const FLYIN = [
  { x: 148, cls: 'flyA', mir: false },
  { x: 210, cls: 'flyB', mir: true },
];

export default function D07_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') {
        const tt = T[lang] || T.uz;
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? tt.correct : tt.hint });
        setChecked(true);
      }
    }
  }, [initialAnswer, lang]);
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
  const [fitRef, scale] = useFitScale(356);

  return (
    <div className="pq pq0703" ref={fitRef}>
      <style>{`
        .pq0703{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0703 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4a8fbf;text-transform:uppercase;}
        .pq0703 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0703 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0703 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0703 .pq-scene{box-sizing:border-box;position:relative;width:356px;height:252px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 40%,#bfe3a8 56%,#9fd484 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0703 .pq-fit{position:relative;margin:0 auto;}
        .pq0703 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.5s ease-in-out infinite;z-index:1;}
        .pq0703 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0703 .pq-cloud.c1{top:18px;left:-70px;animation-duration:30s;animation-delay:-11s;}
        .pq0703 .pq-cloud.c2{top:46px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-24s;}
        /* PANJARA: tepa g'ov (rail) + yog'och taxtachalar. Kelgan kaptarlar railga qo'nadi. */
        .pq0703 .pq-fence{position:absolute;left:0;right:0;top:88px;height:50px;z-index:2;}
        .pq0703 .pq-rail{position:absolute;left:0;right:0;top:0;height:8px;background:#c9a36a;border-top:2px solid #a8783f;border-bottom:2px solid #a8783f;}
        .pq0703 .pq-picks{position:absolute;left:0;right:0;top:10px;bottom:0;background:repeating-linear-gradient(90deg,#d9b57e 0 11px,#c9a36a 11px 13px,transparent 13px 28px);opacity:.95;}
        .pq0703 .pq-swing{position:absolute;left:6px;bottom:64px;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0703 .pq-pend{transform-box:view-box;transform-origin:48px 14px;animation:pqSwing 3.6s ease-in-out infinite alternate;}
        .pq0703 .pq-slide{position:absolute;right:6px;bottom:70px;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0703 .pq-grain{position:absolute;left:50%;transform:translateX(-50%);bottom:6px;z-index:3;}
        .pq0703 .pq-dove{position:absolute;line-height:0;z-index:4;}
        .pq0703 .pq-pigsvg{display:block;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0703 .pq-dove.mir .pq-pigsvg{transform:scaleX(-1);}
        /* Cho'qish: bosh bo'yin atrofida pastga egiladi (qisqa, ikki marta), stagger. */
        .pq0703 .pq-head.peck{transform-box:fill-box;transform-origin:8% 92%;animation:pqPeck 3.8s ease-in-out infinite;}
        /* Uchib kelish: yuqoridan suzib qo'nish (forwards), qanot parvoz payti qoqiladi. */
        .pq0703 .pq-wingmain{transform-box:fill-box;transform-origin:28% 22%;}
        .pq0703 .pq-dove.flyA{animation:pqLandA 1.5s cubic-bezier(.4,.1,.4,1) .45s both;}
        .pq0703 .pq-dove.flyB{animation:pqLandB 1.5s cubic-bezier(.4,.1,.4,1) 1.15s both;}
        .pq0703 .pq-dove.flyA .pq-wingmain{animation:pqFlap .15s ease-in-out .45s 10 alternate;}
        .pq0703 .pq-dove.flyB .pq-wingmain{animation:pqFlap .15s ease-in-out 1.15s 10 alternate;}
        /* Chumchuq: kaptarlardan keyin (flyC) o'ngdan uchib kelib qo'nadi; qo'ngach
           vaqti-vaqti bilan boshini burib atrofga qaraydi (dekorativ, bosilmaydi). */
        .pq0703 .pq-dove.flyC{animation:pqLandC 1.4s cubic-bezier(.4,.1,.4,1) 1.9s both;}
        .pq0703 .pq-dove.flyC .pq-wingmain{animation:pqFlap .13s ease-in-out 1.9s 10 alternate;}
        .pq0703 .pq-sphead{transform-box:fill-box;transform-origin:30% 85%;animation:pqLook 4.6s ease-in-out 3.6s infinite;}
        .pq0703 .pq-cnt{position:absolute;top:-9px;right:-6px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq0703 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0703 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0703 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0703 .pq-opt:hover:not(:disabled){border-color:#b7d4ea;transform:translateY(-2px);}
        .pq0703 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0703 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0703 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0703 .pq-opt:disabled{cursor:default;}
        .pq0703 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0703 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0703 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSwing{from{transform:rotate(7deg);}to{transform:rotate(-7deg);}}
        @keyframes pqPeck{0%,56%,100%{transform:rotate(0);}62%{transform:rotate(11deg);}67%{transform:rotate(4deg);}72%{transform:rotate(11deg);}78%{transform:rotate(0);}}
        @keyframes pqFlap{from{transform:rotate(6deg);}to{transform:rotate(-38deg);}}
        @keyframes pqLandA{0%{opacity:0;transform:translate(-120px,-150px) rotate(-12deg) scale(.9);}8%{opacity:1;}55%{transform:translate(-30px,-46px) rotate(-6deg) scale(.96);}82%{transform:translate(6px,-8px) rotate(3deg) scale(1);}100%{opacity:1;transform:translate(0,0) rotate(0) scale(1);}}
        @keyframes pqLandB{0%{opacity:0;transform:translate(120px,-150px) rotate(12deg) scale(.9);}8%{opacity:1;}55%{transform:translate(30px,-46px) rotate(6deg) scale(.96);}82%{transform:translate(-6px,-8px) rotate(-3deg) scale(1);}100%{opacity:1;transform:translate(0,0) rotate(0) scale(1);}}
        @keyframes pqLandC{0%{opacity:0;transform:translate(85px,-130px) rotate(14deg) scale(.85);}10%{opacity:1;}55%{transform:translate(22px,-40px) rotate(7deg) scale(.94);}82%{transform:translate(-5px,-7px) rotate(-3deg) scale(1);}100%{opacity:1;transform:translate(0,0) rotate(0) scale(1);}}
        @keyframes pqLook{0%,54%,100%{transform:rotate(0);}60%{transform:rotate(-9deg);}70%{transform:rotate(-9deg);}76%{transform:rotate(3deg);}84%{transform:rotate(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 356 * scale, height: 252 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-fence"><span className="pq-rail" /><span className="pq-picks" /></div>
        <div className="pq-swing"><Swing /></div>
        <div className="pq-slide"><Slide /></div>
        <div className="pq-grain"><Grain /></div>

        {ok && <span className="pq-chip">{DATA.a} + {DATA.b} = {DATA.target}</span>}

        {GROUND.map((g, i) => (
          <span key={'g' + i} className={'pq-dove' + (g.mir ? ' mir' : '')} style={{ left: g.x, bottom: g.b }}>
            <Pigeon peckDelay={g.dly} />
            {ok && <b className="pq-cnt">{i + 1}</b>}
          </span>
        ))}
        {FLYIN.map((f, i) => (
          <span key={'f' + i} className={'pq-dove ' + f.cls + (f.mir ? ' mir' : '')} style={{ left: f.x, top: 55 }}>
            <Pigeon />
            {ok && <b className="pq-cnt">{DATA.a + i + 1}</b>}
          </span>
        ))}
        {/* Chumchuq-mehmon: railga qo'nadi, lekin KAPTAR emas — badge yo'q, sanalmaydi. */}
        <span className="pq-dove flyC mir" style={{ left: 262, top: 64 }}>
          <Sparrow />
        </span>
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
