// Dars05 · Amaliyot 07 — LOGIC ABB-naqsh «Sirk paradi» · 🔴 · tag: logic_pattern2
// Qator: sher, koptok, koptok, sher, koptok, koptok, «?» — keyingisi SHER. Chizilgan SVG'lar, веди-до-верного.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PATTERN = ['sher', 'koptok', 'koptok', 'sher', 'koptok', 'koptok'];
const OPTS = ['sher', 'koptok', 'quyon'];
const CORRECT_ID = 'sher';
const OPT_NAMES = {
  uz: { sher: 'sher', koptok: 'koptok', quyon: 'quyon' },
  ru: { sher: 'лев', koptok: 'мяч', quyon: 'кролик' },
};
const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_pattern2' };
const T = {
  uz: {
    eyebrow: 'Sirk · Parad', title: 'Paradni davom ettir',
    setup: 'Sirk paradida sher va koptoklar takrorlanib keladi.',
    ask: 'Qatorda keyingi kim keladi?',
    correct: 'Barakalla! Naqsh: sher, koptok, koptok — yana sher keladi!',
    hint: 'Qatorni boshidan ayting: sher, koptok, koptok... Keyin nima keladi?',
  },
  ru: {
    eyebrow: 'Цирк · Парад', title: 'Продолжи парад',
    setup: 'В параде повторяются лев и мячи.',
    ask: 'Кто идёт в ряду следующим?',
    correct: 'Молодец! Узор: лев, мяч, мяч — снова идёт лев!',
    hint: 'Назови ряд с начала: лев, мяч, мяч... Кто дальше?',
  },
};

// KOPTOK KANONI: radial 2-ton (asos + ochroq tepa-chap), yupqa quyuq kontur, oq blik;
// palitra ketma-ket aylanadi: qizil, ko'k, sariq, yashil.
const BALL_COLORS = [
  { base: '#d9534b', light: '#ef8d86', dark: '#a83a34' }, // qizil
  { base: '#4f8fc4', light: '#8dbde0', dark: '#38678f' }, // ko'k
  { base: '#f2b134', light: '#f8d47e', dark: '#b97c14' }, // sariq
  { base: '#57a84f', light: '#8cc986', dark: '#3d7a38' }, // yashil
];
// Qator elementlari (koptok rangi palitra bo'yicha ketma-ket).
let _b = 0;
const ROW = PATTERN.map((p) => (p === 'koptok' ? { kind: 'koptok', c: _b++ % BALL_COLORS.length } : { kind: 'sher' }));

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan SHER: sariq-jigarrang yuz, atrofida quyuqroq yol-halqa (sekin chayqaladigan
// tolalar bilan), quloqlar, blikli ko'zlar (vaqti-vaqti bilan pirpiratadi), tumshuq,
// burun-uchburchak, mo'ylov; orqadan dum uchi chiqib turadi va flick qiladi.
// `blink` — qovoq-animatsiya fazasi (manfiy delay), har nusxa turlicha pirpiratsin.
const Lion = ({ w = 48, blink = '0s' }) => (
  <svg viewBox="0 0 64 64" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-tail">
      <path d="M49.5 50.5 q9 .5 9.2 -9" stroke="#8a5518" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="58.8" cy="41" r="3.1" fill="#7d4715" />
    </g>
    <circle cx="32" cy="32" r="26" fill="#a86224" stroke="#7d4715" strokeWidth="1.8" />
    <circle cx="32" cy="32" r="21.5" fill="#c07c33" />
    <g className="pq-mane">
      <path d="M32 7.5 L32 12.5 M14.5 14.5 l3.6 3.6 M49.5 14.5 l-3.6 3.6 M7.5 32 h5 M51.5 32 h5 M14.5 49.5 l3.6 -3.6 M49.5 49.5 l-3.6 -3.6 M32 51.5 v5" stroke="#7d4715" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M21 10.5 l2.4 4 M43 10.5 l-2.4 4 M10.5 21 l4 2.4 M53.5 21 l-4 2.4 M10.5 43 l4 -2.4 M53.5 43 l-4 -2.4" stroke="#8a5518" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
    </g>
    <circle cx="18.5" cy="17.5" r="5.2" fill="#e3a94f" stroke="#7d4715" strokeWidth="1.5" />
    <circle cx="18.5" cy="17.5" r="2.4" fill="#f6d38f" />
    <circle cx="45.5" cy="17.5" r="5.2" fill="#e3a94f" stroke="#7d4715" strokeWidth="1.5" />
    <circle cx="45.5" cy="17.5" r="2.4" fill="#f6d38f" />
    <circle cx="32" cy="33" r="16.5" fill="#eebb61" stroke="#a5762c" strokeWidth="1.6" />
    <path d="M27 20.5 q2.5 3 5 .3 q2.5 2.7 5 -.3" stroke="#c99544" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <circle cx="26" cy="30" r="2.2" fill="#1f2430" /><circle cx="26.8" cy="29.3" r="0.8" fill="#fff" />
    <circle cx="38" cy="30" r="2.2" fill="#1f2430" /><circle cx="38.8" cy="29.3" r="0.8" fill="#fff" />
    <g className="pq-blink" style={{ animationDelay: blink }}>
      <circle cx="26" cy="30" r="2.7" fill="#eebb61" />
      <circle cx="38" cy="30" r="2.7" fill="#eebb61" />
    </g>
    <ellipse cx="32" cy="39.5" rx="8.6" ry="6.4" fill="#f8dfa8" />
    <path d="M29.6 37 h4.8 l-2.4 3.1 Z" fill="#7d4715" />
    <path d="M32 40 q0 2.6 -2.6 3.1 M32 40 q0 2.6 2.6 3.1" stroke="#7d4715" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M20.5 37.5 h5 M20.8 40.6 h4.6 M38.5 37.5 h5 M38.6 40.6 h4.6" stroke="#b98d4a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// Kanon-KOPTOK: doira r=10, 2-ton radial taassurot (qatlamli ochroq doiralar tepa-chapda),
// yupqa quyuq kontur, oq blik-ellipse; choklar (pq-seam) sekin aylanadi — dumalash effekti.
// `spin` — chok-aylanish fazasi (manfiy delay), har koptok o'z fazasida dumalasin.
const Ball = ({ c, w = 38, spin = '0s' }) => (
  <svg viewBox="0 0 24 24" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill={c.base} stroke={c.dark} strokeWidth="1.5" />
    <g className="pq-seam" style={{ animationDelay: spin }}>
      <path d="M12 2.4 q-4.8 9.6 0 19.2 M2.4 12 q9.6 -4.8 19.2 0" stroke={c.dark} strokeWidth="1.1" fill="none" opacity=".35" />
    </g>
    <circle cx="9" cy="9" r="6.2" fill={c.light} opacity=".45" />
    <circle cx="7.8" cy="7.8" r="3.4" fill={c.light} opacity=".7" />
    <ellipse cx="7.8" cy="7.2" rx="2.2" ry="1.3" fill="#fff" opacity=".85" transform="rotate(-25 7.8 7.2)" />
  </svg>
);

// Mini-quyon (variant kartasi, D04_01 uslubi): oq-kulrang 2-3 ton, pushti ichlikli uzun
// quloqlar, dumcha-pufak, blikli ko'zlar, mo'ylov chiziqlari.
const Rabbit = ({ w = 40 }) => (
  <svg viewBox="0 0 52 58" width={w} height={Math.round(w * 58 / 52)} aria-hidden="true">
    <g transform="rotate(-8 20 12)">
      <ellipse cx="20" cy="12" rx="4.6" ry="11" fill="#d8cec2" stroke="#a89a8a" strokeWidth="1.4" />
      <ellipse cx="20" cy="13" rx="2.2" ry="7.4" fill="#f2c3cd" />
    </g>
    <g transform="rotate(8 31 12)">
      <ellipse cx="31" cy="12" rx="4.6" ry="11" fill="#d8cec2" stroke="#a89a8a" strokeWidth="1.4" />
      <ellipse cx="31" cy="13" rx="2.2" ry="7.4" fill="#f2c3cd" />
    </g>
    <circle cx="40" cy="47" r="4" fill="#f7f2ea" stroke="#a89a8a" strokeWidth="1.2" />
    <ellipse cx="25" cy="42" rx="15" ry="13" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.6" />
    <ellipse cx="24" cy="45" rx="8" ry="7" fill="#f7f2ea" />
    <circle cx="25" cy="25.5" r="11" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.6" />
    <circle cx="21" cy="23.6" r="1.8" fill="#1f2430" /><circle cx="21.6" cy="23" r="0.65" fill="#fff" />
    <circle cx="29" cy="23.6" r="1.8" fill="#1f2430" /><circle cx="29.6" cy="23" r="0.65" fill="#fff" />
    <g className="pq-blink" style={{ animationDelay: '-1.6s' }}>
      <circle cx="21" cy="23.6" r="2.2" fill="#e9e0d4" />
      <circle cx="29" cy="23.6" r="2.2" fill="#e9e0d4" />
    </g>
    <path d="M23.7 27.6 h2.6 l-1.3 1.9 Z" fill="#e58ba0" />
    <path d="M25 29.7 q0 2.1 -2.1 2.5 M25 29.7 q0 2.1 2.1 2.5" stroke="#a89a8a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d="M14 27 h4.6 M14.4 29.8 h4.2 M31.4 27 h4.6 M31.4 29.8 h4.2" stroke="#bcb0a1" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="17" cy="53.4" rx="5" ry="2.6" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.2" />
    <ellipse cx="31" cy="53.4" rx="5" ry="2.6" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.2" />
  </svg>
);

// Sirk tenti-ayvoni: qizil-oq yo'l-yo'l, pastki cheti fistonli (scallop).
// Har fiston o'z fazasida yengil to'lqinlanadi (pq-flag) — mato shabadada hilpiragandek.
// Rect balandligi 14.5: fiston pastga siljiganda ochiladigan joyni o'z rangi yopib turadi.
const Awning = () => (
  <svg viewBox="0 0 360 24" width="100%" height="24" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: 9 }).map((_, i) => {
      const fill = i % 2 ? '#f9f0e1' : '#e05a4e';
      return (
        <g key={i}>
          <rect x={i * 40} y="0" width="40" height="14.5" fill={fill} />
          <path className="pq-flag" style={{ animationDelay: `${-i * 0.35}s` }} d={`M${i * 40} 13 a20 10 0 0 0 40 0 Z`} fill={fill} />
        </g>
      );
    })}
    <rect x="0" y="0" width="360" height="2.5" fill="#c94a3f" opacity=".55" />
  </svg>
);

export default function D05_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const names = OPT_NAMES[lang] || OPT_NAMES.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.id != null) setPicked(initialAnswer.studentAnswer.id);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT_ID;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    const nm = OPT_NAMES[lang] || OPT_NAMES.uz;
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map((o) => nm[o]), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t, lang]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0507">
      <style>{`
        .pq0507{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0507 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9463a;text-transform:uppercase;}
        .pq0507 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0507 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0507 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0507 .pq-scene{position:relative;max-width:440px;margin:0 auto;padding:36px 8px 16px;border-radius:20px;border:2px solid #f0cfae;background:linear-gradient(#fdf1e3 0%,#fbe7cd 62%,#f3d9b4 100%);overflow:hidden;}
        .pq0507 .pq-awning{position:absolute;top:0;left:0;right:0;}
        .pq0507 .pq-row{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:6px;z-index:1;}
        /* sirk manejining qumli poli — parad shu yerda yuradi */
        .pq0507 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:22px;background:linear-gradient(#eccfa4,#dcb885);border-top:2.5px solid #c99f6a;z-index:0;}
        .pq0507 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.3);}
        .pq0507 .pq-anim{position:relative;line-height:0;}
        /* yurish — tik sakrama-qadam (yon chayqalish yo'q); balllar dumalaydi, sherlar qadamlaydi */
        .pq0507 .pq-mover{display:block;line-height:0;filter:drop-shadow(0 3px 2px rgba(0,0,0,.22));animation:pqMarch .82s ease-in-out infinite;}
        .pq0507 .pq-anim.koptok .pq-mover{animation-duration:.62s;}
        .pq0507 .pq-row.cele .pq-mover{animation:pqHop .55s ease-in-out infinite;}
        /* oyoq ostidagi kontakt-soya — qadam bosganda kattalashadi, ko'tarilganda kichrayadi */
        .pq0507 .pq-shadow{position:absolute;left:50%;bottom:-7px;width:32px;height:8px;border-radius:50%;background:rgba(90,50,20,.3);animation:pqShadow .82s ease-in-out infinite;z-index:-1;}
        .pq0507 .pq-anim.koptok .pq-shadow{animation-duration:.62s;width:26px;}
        .pq0507 .pq-mane{transform-box:fill-box;transform-origin:center;animation:pqMane 3.1s ease-in-out infinite;}
        .pq0507 .pq-seam{transform-box:fill-box;transform-origin:center;animation:pqSeam 1.4s linear infinite;}
        .pq0507 .pq-tail{transform-box:fill-box;transform-origin:15% 92%;animation:pqTail 3.4s ease-in-out infinite;}
        .pq0507 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;}
        .pq0507 .pq-flag{animation:pqFlag 2.6s ease-in-out infinite;}
        .pq0507 .pq-conf{position:absolute;width:6px;height:6px;border-radius:2px;opacity:.65;pointer-events:none;animation:pqConf 6s ease-in-out infinite;}
        .pq0507 .pq-conf.c1{left:7%;top:30px;background:#e05a4e;}
        .pq0507 .pq-conf.c2{left:50%;top:27px;background:#4f8fc4;animation-delay:-2.3s;animation-duration:7.2s;}
        .pq0507 .pq-conf.c3{right:7%;top:32px;background:#f2b134;animation-delay:-4.1s;animation-duration:6.6s;}
        .pq0507 .pq-cell{position:relative;width:50px;height:50px;margin-left:4px;border:3px dashed #c9a15f;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.55);animation:pqPulse 1.5s ease-in-out infinite;flex:0 0 auto;}
        .pq0507 .pq-cell.right{border:3px solid #1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0507 .pq-q{display:inline-block;font-size:26px;font-weight:900;color:#c2803a;animation:pqQ 1.5s ease-in-out infinite;}
        .pq0507 .pq-dropin{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0507 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0507 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq0507 .pq-opt{position:relative;width:86px;height:84px;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:6px;transition:.14s;}
        .pq0507 .pq-opt svg{filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0507 .pq-opt > svg{animation:pqIdle 3s ease-in-out infinite;}
        .pq0507 .pq-opt:nth-child(2) > svg{animation-delay:-1s;}
        .pq0507 .pq-opt:nth-child(3) > svg{animation-delay:-2s;}
        .pq0507 .pq-opt:disabled{cursor:default;}
        .pq0507 .pq-opt:hover:not(:disabled){border-color:#e0a15c;transform:translateY(-3px);}
        .pq0507 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0507 .pq-opt.sel{border-color:#2563eb;background:#eef3fe;}
        .pq0507 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0507 .pq-tick{position:absolute;top:6px;right:6px;color:#1a7f43;}
        .pq0507 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0507 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0507 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqMarch{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes pqShadow{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.3;}50%{transform:translateX(-50%) scaleX(.6);opacity:.13;}}
        @keyframes pqHop{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
        @keyframes pqMane{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqSeam{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqTail{0%,60%,100%{transform:rotate(0);}70%{transform:rotate(-13deg);}80%{transform:rotate(8deg);}88%{transform:rotate(-4deg);}}
        @keyframes pqBlink{0%,86%,97%,100%{opacity:0;}89%,94%{opacity:1;}}
        @keyframes pqFlag{0%,100%{transform:translateY(0);}50%{transform:translateY(1.5px);}}
        @keyframes pqConf{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(7px) rotate(150deg);}}
        @keyframes pqQ{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-2px) scale(1.12);}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqPulse{0%,100%{transform:scale(1);border-color:#c9a15f;}50%{transform:scale(1.07);border-color:#e2a33d;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-24px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <div className="pq-awning"><Awning /></div>
        <span className="pq-conf c1" /><span className="pq-conf c2" /><span className="pq-conf c3" />
        <span className="pq-ground" />
        <div className={'pq-row' + (ok ? ' cele' : '')}>
          {ROW.map((el, i) => {
            const d = `${-i * 0.16}s`;
            return (
              <span key={i} className={'pq-anim ' + el.kind}>
                <span className="pq-mover" style={{ animationDelay: d }}>
                  {el.kind === 'sher'
                    ? <Lion w={48} blink={`${-i * 1.1 - 0.4}s`} />
                    : <Ball c={BALL_COLORS[el.c]} w={36} spin={`${-el.c * 1.4}s`} />}
                </span>
                <span className="pq-shadow" style={{ animationDelay: d }} />
                {ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            );
          })}
          <span className={'pq-cell' + (ok ? ' right' : '')}>
            {ok
              ? <span className="pq-dropin"><Lion w={42} blink="-2.2s" /><b className="pq-cnt">{ROW.length + 1}</b></span>
              : <span className="pq-q">?</span>}
          </span>
        </div>
      </div>

      <div className="pq-opts">
        {OPTS.map((o) => {
          const sel = picked === o; const right = ok && o === CORRECT_ID;
          return (
            <button key={o} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(o); setFeedback(null); }} aria-label={names[o]}>
              {right && <span className="pq-tick"><IconOk /></span>}
              {o === 'sher' ? <Lion w={46} blink="-1.3s" /> : o === 'koptok' ? <Ball c={BALL_COLORS[0]} w={40} spin="-2.7s" /> : <Rabbit w={40} />}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
