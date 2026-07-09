// Dars07 · Amaliyot 04 — P8 rasmga mos misolni tuzish (savat + koptoklar) · 🔴 · tag: build_expression
// Maydoncha: chap savatda 3, o'ng savatda 2 koptok, o'rtada pulslanuvchi «+».
// Pastda misol-panel [▢] + [▢] va raqam-kartalar [2][3][5]; bola kartani bosib misolni o'zi tuzadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 5, B = 4, SUM = A + B; // 5 + 4 = 9 (rasm tartibi: chap savat birinchi)
const CARDS = [4, 5, 6, 9]; // aralash tartib — soxta: 6 (yaqin), 9 (yig'indi)
const DATA = { a: A, b: B, cards: CARDS, ptype: 'P8', level: '🔴', tag: 'build_expression' };

const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · To\'plar', title: 'Misolni tuz',
    setup: 'Ikki savatdagi koptoklarni birlashtirmoqchimiz.',
    ask: 'Raqam kartalarini bosib rasmga mos misolni tuzing.',
    correct: 'Barakalla! Besh qo\'shuv to\'rt — misol tayyor!',
    hintSwap: 'Rasm tartibida tuzing: avval CHAP savatdagi sonni, keyin o\'ngdagini qo\'ying.',
    hint: 'Chap savatda nechta koptok? O\'ngda-chi? Shu sonlarni tartib bilan qo\'ying.',
  },
  ru: {
    eyebrow: 'Игровая площадка · Мячи', title: 'Составь пример',
    setup: 'Мы хотим объединить мячи из двух корзин.',
    ask: 'Нажимайте на карточки с числами и составьте пример по рисунку.',
    correct: 'Молодец! Пять плюс четыре — пример готов!',
    hintSwap: 'Составляйте по порядку рисунка: сначала число из ЛЕВОЙ корзины, потом из правой.',
    hint: 'Сколько мячей в левой корзине? А в правой? Поставьте эти числа по порядку.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';

// Kanon-koptok: sfera + oq belbog'-chiziq + pastki soya + blik, yupqa kontur.
const Ball = ({ c }) => (
  <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="20" cy="20" r="17.6" fill={c.main} stroke={c.line} strokeWidth="1.8" />
    <path d="M2.7 16.4 Q20 24.5 37.3 16.4 Q37.4 21.8 35.6 25.6 Q20 33 4.4 25.6 Q2.6 21.8 2.7 16.4 Z" fill={c.band} stroke={c.line} strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M7.1 29.8 Q20 37 32.9 29.8 Q27.4 36.2 20 36.4 Q12.6 36.2 7.1 29.8 Z" fill={c.line} opacity=".28" />
    <ellipse cx="12.6" cy="10.2" rx="4.6" ry="3" fill="#fff" opacity=".6" transform="rotate(-24 12.6 10.2)" />
  </svg>
);

// To'qilgan savat (old devor) — 2-3 ton jigarrang, to'quv chiziqlari, gardish.
const Basket = () => (
  <svg viewBox="0 0 110 58" width="110" height="58" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M9 10 L101 10 L92 50 Q55 58 18 50 Z" fill="#d8a25e" stroke="#8a5a28" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 20 Q55 27 98 20 M14.5 30 Q55 37 95.5 30 M17 40 Q55 46 93 40" stroke="#b97c3c" strokeWidth="2.4" fill="none" opacity=".85" />
    <path d="M30 12 L26 51 M55 12 L55 53 M80 12 L84 51" stroke="#8a5a28" strokeWidth="1.4" opacity=".38" />
    <rect x="4" y="3" width="102" height="11" rx="5.5" fill="#b97c3c" stroke="#8a5a28" strokeWidth="1.8" />
    <path d="M10 8.5 L100 8.5" stroke="#8a5a28" strokeWidth="1" opacity=".4" strokeDasharray="7 5" />
  </svg>
);

// Arg'imchoq: ramka + tebranuvchi guruh (arqonlar, o'rindiq, kanon-bola: teri-rang bosh,
// blikli pirpiratuvchi ko'zlar, tabassum, ko'k futbolka, kalta oyoqchalar).
const Swing = () => (
  <svg viewBox="0 0 124 150" width="106" height="128" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M24 14 L10 146 M24 14 L38 146 M100 14 L86 146 M100 14 L114 146" stroke="#c0653e" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M20 12 L104 12" stroke="#a34e2c" strokeWidth="6" strokeLinecap="round" />
    <g className="pq-swingarm">
      <line x1="46" y1="14" x2="46" y2="96" stroke="#a8956e" strokeWidth="2.6" />
      <line x1="78" y1="14" x2="78" y2="96" stroke="#a8956e" strokeWidth="2.6" />
      <path d="M53 95 L50 114 M71 95 L68 114" stroke="#3f6f9f" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="49" cy="117" rx="4.2" ry="2.6" fill="#8a5a28" />
      <ellipse cx="67" cy="117" rx="4.2" ry="2.6" fill="#8a5a28" />
      <rect x="50" y="66" width="24" height="31" rx="9" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.6" />
      <path d="M53 72 Q46.5 66 46.5 61" stroke="#4f8fc4" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M71 72 Q77.5 66 77.5 61" stroke="#4f8fc4" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="46.5" cy="60" r="2.7" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
      <circle cx="77.5" cy="60" r="2.7" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
      <circle cx="62" cy="56" r="10.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
      <path d="M51.7 54.2 A10.5 10.5 0 0 1 72.3 54.2 Z" fill="#6b4a2f" />
      <circle cx="58" cy="58" r="1.5" fill="#1f2430" /><circle cx="58.5" cy="57.5" r="0.55" fill="#fff" />
      <circle cx="66" cy="58" r="1.5" fill="#1f2430" /><circle cx="66.5" cy="57.5" r="0.55" fill="#fff" />
      <g className="pq-blink"><rect x="56.2" y="56.3" width="3.6" height="3.1" rx="1.4" fill={SKIN} /><rect x="64.2" y="56.3" width="3.6" height="3.1" rx="1.4" fill={SKIN} /></g>
      <path d="M59 62.5 Q62 65 65 62.5" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <rect x="40" y="96" width="44" height="7" rx="3.5" fill="#b97c3c" stroke="#8a5a28" strokeWidth="1.6" />
    </g>
  </svg>
);

// Slayd-toboggan: narvon + ko'k tushish yo'lagi + tayanch.
const Slide = () => (
  <svg viewBox="0 0 112 120" width="96" height="103" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M20 114 L30 26 M42 114 L34 26" stroke="#c0653e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M25.5 96 L39.5 96 M27 78 L38.5 78 M28.5 60 L37 60 M30 44 L35.5 44" stroke="#c0653e" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M28 24 L52 24" stroke="#8a5a28" strokeWidth="6" strokeLinecap="round" />
    <path d="M48 26 Q74 46 102 106" stroke="#3f7fb5" strokeWidth="15" fill="none" strokeLinecap="round" />
    <path d="M47 22.5 Q75 42 103.5 102" stroke="#7fb3d9" strokeWidth="6.5" fill="none" strokeLinecap="round" />
    <path d="M74 62 L74 114" stroke="#34648c" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

// Koptoklar: rang + savat ichidagi joy (px). Sanash tartibi — chap savat 1..3, o'ng 4..5.
const BALLS_L = [
  { c: { main: '#d9534b', band: '#f6e7d8', line: '#a33630' }, x: 6, y: 38 },
  { c: { main: '#4f8fc4', band: '#eaf4fb', line: '#34648c' }, x: 40, y: 38 },
  { c: { main: '#f2b134', band: '#fdf3dc', line: '#b97c14' }, x: 74, y: 38 },
  { c: { main: '#57a84f', band: '#ecf7ea', line: '#3a7a35' }, x: 23, y: 8 },
  { c: { main: '#d9534b', band: '#f6e7d8', line: '#a33630' }, x: 57, y: 8 },
];
const BALLS_R = [
  { c: { main: '#57a84f', band: '#ecf7ea', line: '#3a7a35' }, x: 20, y: 38 },
  { c: { main: '#d9534b', band: '#f6e7d8', line: '#a33630' }, x: 54, y: 38 },
  { c: { main: '#4f8fc4', band: '#eaf4fb', line: '#34648c' }, x: 20, y: 8 },
  { c: { main: '#f2b134', band: '#fdf3dc', line: '#b97c14' }, x: 54, y: 8 },
];

export default function D07_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]); // [slot1, slot2] — karta qiymatlari
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.slot1 != null || sa.slot2 != null) setSlots([sa.slot1 != null ? sa.slot1 : null, sa.slot2 != null ? sa.slot2 : null]);
      if (typeof initialAnswer.correct === 'boolean') {
        const tt = T[lang] || T.uz;
        const msg = initialAnswer.correct ? tt.correct : (sa.slot1 === B && sa.slot2 === A ? tt.hintSwap : tt.hint);
        setFeedback({ correct: initialAnswer.correct, msg });
        setChecked(true);
      }
    }
  }, [initialAnswer, lang]);
  useEffect(() => { onReady?.(slots[0] != null && slots[1] != null && !checked); }, [slots, checked, onReady]);

  const check = useCallback(() => {
    if (slots[0] == null || slots[1] == null) return;
    const correct = slots[0] === A && slots[1] === B; // rasm tartibi: chap savat birinchi
    const msg = correct ? t.correct : (slots[0] === B && slots[1] === A ? t.hintSwap : t.hint);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS, studentAnswer: { slot1: slots[0], slot2: slots[1] }, correctAnswer: { slot1: A, slot2: B }, correct, meta: { ...DATA } });
  }, [slots, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  const placeCard = (v) => {
    if (lock) return;
    setSlots((prev) => {
      if (prev.includes(v)) return prev;
      const idx = prev[0] == null ? 0 : prev[1] == null ? 1 : -1;
      if (idx === -1) return prev;
      const next = [...prev]; next[idx] = v; return next;
    });
    setFeedback(null);
  };
  const clearSlot = (i) => {
    if (lock || slots[i] == null) return;
    setSlots((prev) => { const next = [...prev]; next[i] = null; return next; });
    setFeedback(null);
  };

  const renderBasket = (balls, startIdx, side) => (
    <div className={'pq-bsk ' + side}>
      {balls.map((b, i) => (
        <span key={i} className="pq-ballw" style={{ left: b.x, top: b.y }}>
          <Ball c={b.c} />
          {ok && <b className="pq-cnt" style={{ animationDelay: `${(startIdx + i) * 0.12}s` }}>{startIdx + i + 1}</b>}
        </span>
      ))}
      <span className="pq-bskfront"><Basket /></span>
    </div>
  );

  const renderSlot = (i) => {
    const v = slots[i];
    return (
      <button
        type="button"
        className={'pq-slot' + (v != null ? ' filled' : '') + (ok ? ' win' : '')}
        disabled={lock || v == null}
        onClick={() => clearSlot(i)}
      >
        {v != null && <span key={'v' + i + '-' + v} className="pq-slotval">{v}</span>}
      </button>
    );
  };

  return (
    <div className="pq pq0704">
      <style>{`
        .pq0704{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0704 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#379a5b;text-transform:uppercase;}
        .pq0704 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0704 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0704 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0704 .pq-scene{position:relative;width:372px;height:252px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#ddf0d3 78%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0704 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0704 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0704 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0704 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-24s;}
        .pq0704 .pq-fence{position:absolute;left:0;right:0;bottom:54px;height:36px;background:repeating-linear-gradient(90deg,#e7d9ba 0 9px,rgba(231,217,186,0) 9px 17px);}
        .pq0704 .pq-fence::before{content:'';position:absolute;left:0;right:0;top:7px;height:5px;background:#dbcaa2;}
        .pq0704 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:22px;height:5px;background:#dbcaa2;}
        .pq0704 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#a5d18f,#7db968);}
        .pq0704 .pq-grass::after{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:#8fc47a;}
        .pq0704 .pq-swing{position:absolute;left:3px;bottom:48px;z-index:1;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0704 .pq-swingarm{transform-box:fill-box;transform-origin:50% 0;animation:pqSwing 3s ease-in-out infinite alternate;}
        .pq0704 .pq-slide{position:absolute;right:3px;bottom:52px;z-index:1;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0704 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:-1.2s;}
        .pq0704 .pq-stagegrp{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);display:flex;align-items:flex-end;gap:6px;z-index:3;}
        .pq0704 .pq-bsk{position:relative;width:116px;height:112px;transition:transform .9s cubic-bezier(.35,1.2,.4,1);}
        .pq0704 .pq-stagegrp.merge .pq-bsk.l{transform:translateX(27px);}
        .pq0704 .pq-stagegrp.merge .pq-bsk.r{transform:translateX(-27px);}
        .pq0704 .pq-ballw{position:absolute;width:34px;height:34px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0704 .pq-bskfront{position:absolute;left:3px;bottom:0;z-index:2;line-height:0;filter:drop-shadow(0 3px 4px rgba(0,0,0,.16));}
        .pq0704 .pq-plusbig{align-self:flex-end;margin:0 2px 34px;font-size:44px;font-weight:900;line-height:1;color:#2563eb;text-shadow:0 2px 0 rgba(255,255,255,.7);animation:pqPulse 1.5s ease-in-out infinite;transition:opacity .5s ease,transform .5s ease;}
        .pq0704 .pq-stagegrp.merge .pq-plusbig{animation:none;opacity:0;transform:scale(.35);}
        .pq0704 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0704 .pq-chip{position:absolute;top:10px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0704 .pq-exp{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:18px;}
        .pq0704 .pq-slot{width:64px;height:64px;padding:0;border-radius:16px;border:2.5px dashed #9aa3b2;background:#f6f8fb;color:#1d4ed8;font-size:28px;font-weight:800;font-family:inherit;font-variant-numeric:tabular-nums;display:flex;align-items:center;justify-content:center;cursor:default;transition:.13s;}
        .pq0704 .pq-slot.filled{border-style:solid;border-color:#2563eb;background:#e8eefc;cursor:pointer;}
        .pq0704 .pq-slot.filled:hover:not(:disabled){transform:translateY(-2px);}
        .pq0704 .pq-slot.filled:active:not(:disabled){transform:scale(.94);}
        .pq0704 .pq-slot:disabled{cursor:default;}
        .pq0704 .pq-slot.win{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0704 .pq-expplus{font-size:34px;font-weight:900;line-height:1;color:#374151;transition:color .3s ease;}
        .pq0704 .pq-expplus.win{color:#1a7f43;}
        .pq0704 .pq-slotval{display:block;animation:pqDrop .3s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0704 .pq-cards{display:flex;gap:12px;justify-content:center;margin-top:14px;flex-wrap:wrap;}
        .pq0704 .pq-card{min-width:64px;height:64px;padding:0 14px;font-size:26px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;white-space:nowrap;transition:.13s;font-family:inherit;}
        .pq0704 .pq-card:hover:not(:disabled){border-color:#9fd0ac;transform:translateY(-2px);}
        .pq0704 .pq-card:active:not(:disabled){transform:scale(.94);}
        .pq0704 .pq-card.used{opacity:.28;transform:none;}
        .pq0704 .pq-card:disabled{cursor:default;}
        .pq0704 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0704 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0704 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSwing{from{transform:rotate(6.5deg);}to{transform:rotate(-6.5deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqDrop{from{opacity:0;transform:translateY(-16px) scale(.45);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" />
        <span className="pq-grass" />
        <div className="pq-swing"><Swing /></div>
        <div className="pq-slide"><Slide /></div>
        {ok && <span className="pq-chip">{A} + {B} = {SUM}</span>}
        <div className={'pq-stagegrp' + (ok ? ' merge' : '')}>
          {renderBasket(BALLS_L, 0, 'l')}
          <span className="pq-plusbig">+</span>
          {renderBasket(BALLS_R, A, 'r')}
        </div>
      </div>

      <div className="pq-exp">
        {renderSlot(0)}
        <span className={'pq-expplus' + (ok ? ' win' : '')}>+</span>
        {renderSlot(1)}
      </div>

      <div className="pq-cards">
        {CARDS.map((v) => {
          const used = slots.includes(v);
          return <button key={v} type="button" className={'pq-card' + (used ? ' used' : '')} disabled={lock || used} onClick={() => placeCard(v)}>{v}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
