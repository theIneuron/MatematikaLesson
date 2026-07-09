// Dars06 · Amaliyot 10 — YANGI kreativ «Avtobusni to'ldir»: IKKI RANGLI o'nlik-ramka · 🔴 · tag: two_color_build
// 2×5 o'rindiq avtobus ichida. 1-qator (0-4) DOIM QIZIL yo'lovchi, 2-qator (5-9) DOIM YASHIL.
// Bola kataklarni bosib 8 ni o'zi hosil qiladi; g'alabada avtobus jo'naydi (tez g'ildirak, tutun, haydovchi qo'l silkitadi).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 8, COLS = 5, CELLS = 10;
const DATA = { target: 8, ptype: 'NEW', level: '🔴', tag: 'two_color_build' };

const NUMW = {
  uz: ['nol', 'bitta', 'ikkita', 'uchta', "to'rtta", 'beshta', 'oltita', 'yettita', 'sakkizta'],
  ru: ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь'],
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Jo\'nash', title: 'Avtobusni to\'ldir',
    setup: 'Avtobus jo\'nashga tayyor — tabloda sakkiz! Sakkizta yo\'lovchini chiqaring.',
    ask: 'O\'rindiqlarni bosing: avval birinchi qator qizillar bilan to\'lsin, keyin yashillar.',
    correct: (a, b) => `Barakalla! ${cap(NUMW.uz[a])} qizil va ${NUMW.uz[b]} yashil — sakkiz. Avtobus jo'nadi!`,
    hintLess: 'Hali kam. O\'tirganlarni sanang va yana yo\'lovchi chiqaring.',
    hintMore: 'Ko\'p bo\'lib ketdi. Ortiqcha yo\'lovchini bosib tushiring.',
    tapHint: 'O\'rindiqlarni bosing',
  },
  ru: {
    eyebrow: 'Путешествие на автобусе · Отправление', title: 'Заполни автобус',
    setup: 'Автобус готов к отправлению — на табло восемь! Посади восемь пассажиров.',
    ask: 'Нажимай на сиденья: сначала пусть первый ряд заполнится красными, потом зелёные.',
    correct: (a, b) => `Молодец! ${cap(NUMW.ru[a])} красных и ${NUMW.ru[b]} зелёных — восемь. Автобус поехал!`,
    hintLess: 'Пока мало. Посчитай сидящих и посади ещё пассажиров.',
    hintMore: 'Слишком много. Нажми на лишнего пассажира — он выйдет.',
    tapHint: 'Нажимай на сиденья',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
// Yo'lovchi kanoni: dumaloq bosh + blikli ko'zlar + kepka (yarim-doira + gardish) + yelka-ko'ylak yoyi.
const RED = { cap: '#d9534b', line: '#a33630', shirt: '#ef8d86' };
const GREEN = { cap: '#57a84f', line: '#3a7a35', shirt: '#93cf8c' };

// Bitta yo'lovchi = bitta bosh (sanash uchun). d — pirpiratish stagger indeksi.
const Passenger = ({ c, d }) => (
  <svg viewBox="0 0 36 40" width="32" height="36" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.65)}s` }}>
    <path d="M4 40 Q18 26 32 40 Z" fill={c.shirt} stroke={c.line} strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="18" cy="19" r="10" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.3" />
    <path d="M8 16.5 A10 10 0 0 1 28 16.5 Z" fill={c.cap} stroke={c.line} strokeWidth="1.1" />
    <rect x="6.6" y="15.2" width="22.8" height="3.2" rx="1.6" fill={c.cap} stroke={c.line} strokeWidth="0.9" />
    <circle cx="14.4" cy="22" r="1.4" fill="#1f2430" /><circle cx="14.9" cy="21.5" r="0.5" fill="#fff" />
    <circle cx="21.6" cy="22" r="1.4" fill="#1f2430" /><circle cx="22.1" cy="21.5" r="0.5" fill="#fff" />
    <g className="pq-blink"><rect x="12.6" y="20.3" width="3.7" height="3.2" rx="1.5" fill={SKIN} /><rect x="19.8" y="20.3" width="3.7" height="3.2" rx="1.5" fill={SKIN} /></g>
    <path d="M15.4 25.6 Q18 27.6 20.6 25.6" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

// Haydovchi: ko'k kepka, blikli pirpiratuvchi ko'zlar, rul; g'alabada qo'l silkitadi.
const Driver = ({ wave }) => (
  <svg viewBox="0 0 56 54" width="52" height="50" aria-hidden="true" style={{ display: 'block', '--bd': '-2.1s' }}>
    <path d="M6 54 Q20 38 34 54 Z" fill="#7fb3d9" stroke="#34648c" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="20" cy="23" r="10.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.3" />
    <path d="M9.5 20.5 A10.5 10.5 0 0 1 30.5 20.5 Z" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.2" />
    <rect x="17" y="18.6" width="16" height="3.4" rx="1.7" fill="#4f8fc4" stroke="#34648c" strokeWidth="0.9" />
    <circle cx="17.5" cy="26" r="1.5" fill="#1f2430" /><circle cx="18" cy="25.5" r="0.55" fill="#fff" />
    <circle cx="24.5" cy="26" r="1.5" fill="#1f2430" /><circle cx="25" cy="25.5" r="0.55" fill="#fff" />
    <g className="pq-blink"><rect x="15.6" y="24.2" width="3.9" height="3.4" rx="1.6" fill={SKIN} /><rect x="22.6" y="24.2" width="3.9" height="3.4" rx="1.6" fill={SKIN} /></g>
    <path d="M18.5 30 Q21.5 32.2 24.5 30" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <circle cx="46" cy="42" r="7.5" fill="none" stroke="#2b2f36" strokeWidth="3" />
    <circle cx="46" cy="42" r="2" fill="#2b2f36" />
    <path d="M46 35.5 L46 39 M40.5 45 L44 43.2 M51.5 45 L48 43.2" stroke="#2b2f36" strokeWidth="1.6" strokeLinecap="round" />
    {wave
      ? <g className="pq-wavearm"><path d="M30 46 Q34 32 38 24" stroke="#4f8fc4" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="38.5" cy="22.5" r="2.9" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" /></g>
      : <g><path d="M30 46 Q37 44 41.5 42.5" stroke="#4f8fc4" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="42.5" cy="42.2" r="2.7" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" /></g>}
  </svg>
);

// Avtobus g'ildiragi: to'q doira + kulrang disk + 4 kegay (spokes aylanadi).
const Wheel = () => (
  <svg viewBox="0 0 44 44" width="42" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="22" cy="22" r="20" fill="#2b2f36" stroke="#14171c" strokeWidth="2" />
    <circle cx="22" cy="22" r="10.5" fill="#aab1ba" stroke="#6d747d" strokeWidth="1.6" />
    <g className="pq-spokes"><path d="M22 13 L22 31 M13 22 L31 22" stroke="#5a616b" strokeWidth="2.8" strokeLinecap="round" /></g>
    <circle cx="22" cy="22" r="3" fill="#5a616b" />
  </svg>
);

export default function D06_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [cells, setCells] = useState(() => Array(CELLS).fill(false));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const filled = cells.filter(Boolean).length;
  const topFilled = cells.slice(0, COLS).filter(Boolean).length;
  const botFilled = filled - topFilled;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const top = typeof sa.top === 'number' ? Math.min(sa.top, COLS) : 0;
      const bottom = typeof sa.bottom === 'number' ? Math.min(sa.bottom, COLS) : 0;
      const nc = Array(CELLS).fill(false);
      for (let i = 0; i < top; i++) nc[i] = true;
      for (let i = 0; i < bottom; i++) nc[COLS + i] = true;
      setCells(nc);
      if (typeof initialAnswer.correct === 'boolean') {
        const tt = T[lang] || T.uz;
        const msg = initialAnswer.correct ? tt.correct(top, bottom) : (top + bottom < TARGET ? tt.hintLess : tt.hintMore);
        setFeedback({ correct: initialAnswer.correct, msg }); setChecked(true);
      }
    }
  }, [initialAnswer, lang]);
  useEffect(() => { onReady?.(filled > 0 && !checked); }, [filled, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setCells((prev) => { const nc = [...prev]; nc[i] = !nc[i]; return nc; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (filled === 0) return;
    const correct = filled === TARGET;
    const msg = correct ? t.correct(topFilled, botFilled) : (filled < TARGET ? t.hintLess : t.hintMore);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [], studentAnswer: { filled, top: topFilled, bottom: botFilled }, correctAnswer: { filled: TARGET }, correct, meta: { ...DATA } });
  }, [cells, filled, topFilled, botFilled, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  let badge = 0;

  const renderRow = (rowIdx) => {
    const base = rowIdx * COLS;
    const color = rowIdx === 0 ? RED : GREEN;
    return (
      <div className={'pq-row ' + (rowIdx === 0 ? 'r1' : 'r2')}>
        {cells.slice(base, base + COLS).map((on, k) => {
          if (on) badge += 1; const b = badge;
          return (
            <button key={k} type="button" className={'pq-seat' + (on ? ' on' : '')} disabled={lock} onClick={() => toggle(base + k)} aria-label="o'rindiq">
              <span className="pq-seatback" />
              {on && <span className="pq-psg"><Passenger c={color} d={base + k} /></span>}
              {ok && on && <b className="pq-cnt">{b}</b>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pq pq0610">
      <style>{`
        .pq0610{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0610 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b97c14;text-transform:uppercase;}
        .pq0610 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0610 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0610 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0610 .pq-scene{position:relative;width:372px;height:264px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 48%,#eef4e6 72%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0610 .pq-sun{position:absolute;top:8px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0610 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0610 .pq-cloud.c1{top:14px;left:-70px;animation-duration:28s;animation-delay:-9s;}
        .pq0610 .pq-cloud.c2{top:36px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-22s;}
        .pq0610 .pq-walk{position:absolute;left:0;right:0;bottom:40px;height:9px;background:#d9d2c4;border-top:2px solid #bfb7a6;}
        .pq0610 .pq-road{position:absolute;left:0;right:0;bottom:0;height:40px;background:#6f7680;border-top:3px solid #565c66;}
        .pq0610 .pq-road::after{content:'';position:absolute;left:0;right:0;top:17px;height:3px;background:repeating-linear-gradient(90deg,#e8e4d8 0 18px,transparent 18px 34px);opacity:.8;}
        /* G'alabada YER HARAKATLANADI (metodist): yo'l shtrixlari chapga oqadi — avtobus
           kadrda qoladi (natija-badge'lar ko'rinib turadi), lekin yurayotgani aniq seziladi. */
        .pq0610 .pq-scene.drive .pq-road::after{animation:pqRoadMove .55s linear infinite;}
        @keyframes pqRoadMove{from{background-position:0 0;}to{background-position:-34px 0;}}
        .pq0610 .pq-bus{position:absolute;left:16px;bottom:14px;width:326px;z-index:2;}
        .pq0610 .pq-bus.go{animation:pqGo 1.25s cubic-bezier(.45,.1,.45,1) forwards;}
        /* Idle-bob YO'Q: o'rindiqlar bosiladigan nishonlar — doimiy siljish bosishni
           beqaror qiladi. Jonlilik g'ildirak/haydovchi/bulutlarda; tana faqat g'alabada (.fast). */
        .pq0610 .pq-busbob{position:relative;}
        .pq0610 .pq-busbob.fast{animation:pqVibe .3s linear infinite;}
        .pq0610 .pq-tablo{width:52px;height:34px;margin:0 auto 4px;border-radius:10px;background:#101827;border:3px solid #33415c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#ffd75e;font-variant-numeric:tabular-nums;animation:pqTablo 2.4s ease-in-out infinite;}
        .pq0610 .pq-tablo.win{color:#4ade80;}
        .pq0610 .pq-busbody{position:relative;width:326px;height:150px;border-radius:18px 22px 12px 12px;background:linear-gradient(#f2b134 62%,#d99a1a);border:3px solid #a8721a;box-shadow:0 3px 6px rgba(0,0,0,.18);z-index:1;}
        .pq0610 .pq-roofline{position:absolute;top:4px;left:10px;right:10px;height:9px;border-radius:6px;background:#f8d67f;opacity:.85;}
        .pq0610 .pq-band{position:absolute;left:10px;top:18px;width:214px;height:92px;border-radius:10px;background:#dff1fb;border:2px solid #a8721a;display:flex;flex-direction:column;gap:4px;justify-content:center;align-items:center;}
        .pq0610 .pq-band.win{animation:pqCele .5s ease;}
        .pq0610 .pq-row{display:flex;gap:4px;}
        .pq0610 .pq-seat{position:relative;width:38px;height:39px;border-radius:9px;border:2px dashed #b9c1cf;background:#fff;cursor:pointer;padding:0;transition:.13s;}
        .pq0610 .pq-seat:hover:not(:disabled){transform:translateY(-2px);border-color:#8fa3c0;}
        .pq0610 .pq-seat:active:not(:disabled){transform:scale(.93);}
        .pq0610 .pq-seat.on{border-style:solid;}
        .pq0610 .pq-row.r1 .pq-seat.on{border-color:#e0968f;background:#fdf3f2;}
        .pq0610 .pq-row.r2 .pq-seat.on{border-color:#8fc489;background:#f3faf1;}
        .pq0610 .pq-seat:disabled{cursor:default;}
        .pq0610 .pq-seatback{position:absolute;left:5px;right:5px;bottom:3px;height:9px;border-radius:4px;}
        .pq0610 .pq-row.r1 .pq-seatback{background:#f3d0cd;}
        .pq0610 .pq-row.r2 .pq-seatback{background:#d4ead1;}
        .pq0610 .pq-psg{position:absolute;left:50%;bottom:2px;line-height:0;animation:pqSit .35s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0610 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0610 .pq-door{position:absolute;left:228px;top:18px;width:26px;height:116px;border-radius:8px;background:#e6a92c;border:2px solid #a8721a;}
        .pq0610 .pq-door::before{content:'';position:absolute;left:3px;right:3px;top:4px;height:44px;border-radius:6px;background:#dff1fb;border:1.5px solid #a8721a;}
        .pq0610 .pq-door::after{content:'';position:absolute;left:50%;top:4px;bottom:4px;width:2px;background:#a8721a;opacity:.65;}
        .pq0610 .pq-cabwin{position:absolute;left:258px;top:18px;width:56px;height:74px;border-radius:10px 14px 6px 6px;background:#dff1fb;border:2px solid #a8721a;overflow:hidden;}
        .pq0610 .pq-driver{position:absolute;left:1px;bottom:0;line-height:0;}
        .pq0610 .pq-light{position:absolute;right:2px;bottom:22px;width:13px;height:9px;border-radius:5px;background:#fff4c2;border:2px solid #a8721a;}
        .pq0610 .pq-light.lit{box-shadow:0 0 10px 3px rgba(255,236,150,.85);}
        .pq0610 .pq-wheel{position:absolute;bottom:-17px;width:42px;height:42px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.25));z-index:2;}
        .pq0610 .pq-wheel.w1{left:40px;} .pq0610 .pq-wheel.w2{left:236px;}
        .pq0610 .pq-spokes{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0610 .pq-busbob.fast .pq-spokes{animation-duration:.5s;}
        .pq0610 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;animation-delay:var(--bd,0s);}
        .pq0610 .pq-wavearm{transform-box:fill-box;transform-origin:20% 90%;animation:pqWave .6s ease-in-out infinite alternate;}
        .pq0610 .pq-puff{position:absolute;left:-6px;bottom:16px;width:16px;height:16px;border-radius:50%;background:#cfd4da;opacity:0;animation:pqPuff 1.5s ease-out infinite;z-index:0;}
        .pq0610 .pq-puff.p2{width:12px;height:12px;bottom:26px;animation-delay:.5s;}
        .pq0610 .pq-puff.p3{width:10px;height:10px;bottom:10px;animation-delay:1s;}
        .pq0610 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0610 .pq-taphint{position:absolute;bottom:8px;right:10px;font-size:12.5px;font-weight:700;color:#5c6672;background:rgba(255,255,255,.88);padding:3px 10px;border-radius:999px;animation:pqBobY 1.8s ease-in-out infinite;z-index:5;white-space:nowrap;}
        .pq0610 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0610 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0610 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqTablo{0%,100%{box-shadow:0 0 8px rgba(255,215,94,.35);transform:scale(1);}50%{box-shadow:0 0 16px rgba(255,215,94,.6);transform:scale(1.04);}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqVibe{0%,100%{transform:translateY(0);}25%{transform:translateY(-1px);}75%{transform:translateY(.8px);}}
        @keyframes pqGo{0%{transform:translateX(0);}14%{transform:translateX(-4px);}100%{transform:translateX(10px);}}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqWave{from{transform:rotate(-8deg);}to{transform:rotate(14deg);}}
        @keyframes pqPuff{0%{opacity:0;transform:translate(0,0) scale(.5);}15%{opacity:.8;}100%{opacity:0;transform:translate(-30px,-16px) scale(1.5);}}
        @keyframes pqSit{0%{opacity:0;transform:translate(-50%,-16px) scale(.6);}100%{opacity:1;transform:translate(-50%,0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (ok ? ' drive' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-walk" /><span className="pq-road" />
        {ok && <span className="pq-chip">{topFilled} + {botFilled} = {TARGET}</span>}

        <div className={'pq-bus' + (ok ? ' go' : '')}>
          <div className={'pq-busbob' + (ok ? ' fast' : '')}>
            {ok && (<><span className="pq-puff p1" /><span className="pq-puff p2" /><span className="pq-puff p3" /></>)}
            <div className={'pq-tablo' + (ok ? ' win' : '')}>{TARGET}</div>
            <div className="pq-busbody">
              <span className="pq-roofline" />
              <div className={'pq-band' + (ok ? ' win' : '')}>
                {renderRow(0)}
                {renderRow(1)}
              </div>
              <div className="pq-door" />
              <div className="pq-cabwin"><div className="pq-driver"><Driver wave={!!ok} /></div></div>
              <span className={'pq-light' + (ok ? ' lit' : '')} />
              <span className="pq-wheel w1"><Wheel /></span>
              <span className="pq-wheel w2"><Wheel /></span>
            </div>
          </div>
        </div>

        {!lock && <span className="pq-taphint">{t.tapHint}</span>}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
