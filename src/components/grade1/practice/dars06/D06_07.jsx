// Dars06 · Amaliyot 07 — LOGIC AABB naqsh «Bekatdagi navbat» · 🔴 · tag: logic_pattern_aabb
// Navbat: qizil, qizil, yashil, yashil, qizil, qizil, [?] → yashil. Yo'lovchi-kanon boshlar
// (kepka, blikli ko'z, pirpiratish), avtobus-kanon (aylanadigan g'ildirak, idle-tebranish).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const QUEUE = ['qizil', 'qizil', 'yashil', 'yashil', 'qizil', 'qizil'];
const OPTS = ['yashil', 'qizil', 'kok'];
const CORRECT_ID = 'yashil';
// Yo'lovchi-kanon ranglari: QIZIL #d9534b, YASHIL #57a84f, KO'K #4f8fc4.
const C = {
  qizil: { cap: '#d9534b', line: '#a33630', hi: '#ef8d86' },
  yashil: { cap: '#57a84f', line: '#3a7a35', hi: '#93cf8c' },
  kok: { cap: '#4f8fc4', line: '#34648c', hi: '#8fc0e2' },
};
const OPT_NAMES = {
  uz: { yashil: 'yashil', qizil: 'qizil', kok: "ko'k" },
  ru: { yashil: 'зелёный', qizil: 'красный', kok: 'синий' },
};
const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_pattern_aabb' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Navbat', title: 'Navbatni davom ettir',
    setup: "Bekatda navbat turibdi: yo'lovchilar kepka rangi bo'yicha takrorlanib turishibdi.",
    ask: 'Navbatda keyingi kim turadi?',
    correct: 'Barakalla! Naqsh: ikki qizil, ikki yashil — endi yashil keladi!',
    hint: 'Navbatni boshidan ayting: qizil, qizil, yashil, yashil... Nima takrorlanmoqda?',
  },
  ru: {
    eyebrow: 'Путешествие на автобусе · Очередь', title: 'Продолжи очередь',
    setup: 'На остановке стоит очередь: пассажиры чередуются по цвету кепок.',
    ask: 'Кто стоит в очереди следующим?',
    correct: 'Молодец! Узор: два красных, два зелёных — теперь зелёный!',
    hint: 'Назови очередь с начала: красный, красный, зелёный, зелёный... Что повторяется?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Yo'lovchi-kanon: dumaloq teri-rang bosh (#f2c096, kontur #c98d5f), blikli ikki ko'z,
// pirpiratish-qovoqlar, tabassum, rangli kepka (yarim-doira + gardish) + yelka-ko'ylak yoyi.
// Bitta yo'lovchi = QAT'IY bitta bosh (sanash uchun). bd — pirpiratish stagger-delay.
const Passenger = ({ c, w = 38, bd = '0s' }) => (
  <svg viewBox="0 0 44 58" width={w} height={Math.round(w * 58 / 44)} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M7 58 Q7 43 22 43 Q37 43 37 58 Z" fill={c.cap} stroke={c.line} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M13 50 Q22 46.5 31 50" stroke={c.hi} strokeWidth="1.6" fill="none" opacity=".7" strokeLinecap="round" />
    <circle cx="22" cy="25" r="13.5" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.6" />
    <circle cx="17" cy="24.8" r="1.9" fill="#1f2430" /><circle cx="17.7" cy="24.1" r="0.7" fill="#fff" />
    <circle cx="27" cy="24.8" r="1.9" fill="#1f2430" /><circle cx="27.7" cy="24.1" r="0.7" fill="#fff" />
    <g className="pq-blink" style={{ animationDelay: bd }}>
      <rect x="14.6" y="22.4" width="4.8" height="4.6" rx="2" fill="#f2c096" />
      <rect x="24.6" y="22.4" width="4.8" height="4.6" rx="2" fill="#f2c096" />
    </g>
    <path d="M18.5 30.8 Q22 33.6 25.5 30.8" stroke="#a8724a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M9.5 20 Q9.5 7.5 22 7.5 Q34.5 7.5 34.5 20 Z" fill={c.cap} stroke={c.line} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M13 14 Q22 9.5 31 14" stroke={c.hi} strokeWidth="1.6" fill="none" opacity=".75" strokeLinecap="round" />
    <rect x="7" y="18.6" width="30" height="4.4" rx="2.2" fill={c.cap} stroke={c.line} strokeWidth="1.4" />
  </svg>
);

// Avtobus-kanon g'ildiragi: to'q doira + kulrang disk + 4 kegay (pq-wheel sekin aylanadi).
const Wheel = ({ cx }) => (
  <g>
    <circle cx={cx} cy="64" r="11.5" fill="#2b3138" stroke="#14181d" strokeWidth="1.6" />
    <g className="pq-wheel">
      <circle cx={cx} cy="64" r="6.4" fill="#aab3bd" stroke="#7c8791" strokeWidth="1.3" />
      <path d={`M${cx - 5.2} 64 H${cx + 5.2} M${cx} 58.8 V69.2`} stroke="#5d6771" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <circle cx={cx} cy="64" r="1.6" fill="#39424c" />
  </g>
);

// Avtobus-kanon: yon ko'rinish sariq shahar avtobusi — tana 2 ton (#f2b134 / #d99a1a,
// kontur #a8721a), tomi ochroq, oldida fara + eshik, derazalar oq-havorang (#dff1fb).
const Bus = () => (
  <svg viewBox="0 0 152 78" width="152" height="78" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="12" y="3" width="128" height="10" rx="5" fill="#f8d67f" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="4" y="10" width="144" height="50" rx="9" fill="#f2b134" />
    <rect x="5.5" y="42" width="141" height="16" rx="7" fill="#d99a1a" />
    <rect x="4" y="10" width="144" height="50" rx="9" fill="none" stroke="#a8721a" strokeWidth="2" />
    <rect x="14" y="17" width="22" height="17" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.3" />
    <rect x="42" y="17" width="22" height="17" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.3" />
    <rect x="70" y="17" width="22" height="17" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.3" />
    <path d="M17 19.5 L25 31.5 M23 19.5 L31 31.5" stroke="#fff" strokeWidth="2" opacity=".55" strokeLinecap="round" />
    <rect x="106" y="16" width="30" height="41" rx="4" fill="#e8a92c" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="109.5" y="19.5" width="23" height="16" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <line x1="121" y1="16" x2="121" y2="57" stroke="#a8721a" strokeWidth="1.4" />
    <circle cx="143" cy="49" r="4" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.4" />
    <Wheel cx={36} />
    <Wheel cx={110} />
  </svg>
);

// Bekat belgisi: ustun, tepasida sway-bayroqcha, ko'k tabela ichida mini avtobus-piktogramma.
const StopSign = () => (
  <svg viewBox="0 0 46 96" width="40" height="84" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="20" y="12" width="5" height="80" rx="2.5" fill="#8a94a0" stroke="#5d6771" strokeWidth="1.2" />
    <path className="pq-flag" d="M25 13 L41 17.5 L25 22 Z" fill="#d9534b" stroke="#a33630" strokeWidth="1" strokeLinejoin="round" />
    <rect x="6" y="27" width="33" height="24" rx="5" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.6" />
    <rect x="11" y="32" width="23" height="10" rx="3" fill="#dff1fb" stroke="#34648c" strokeWidth="1.2" />
    <circle cx="16.5" cy="44.5" r="2.4" fill="#2b3138" />
    <circle cx="28.5" cy="44.5" r="2.4" fill="#2b3138" />
  </svg>
);

export default function D06_07(props) {
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
    <div className="pq pq0607">
      <style>{`
        .pq0607{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0607 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b8721f;text-transform:uppercase;}
        .pq0607 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0607 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0607 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0607 .pq-scene{position:relative;width:100%;max-width:440px;height:264px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e9f6ff 50%,#dfeacf 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0607 .pq-sun{position:absolute;top:14px;right:18px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.5s ease-in-out infinite;}
        .pq0607 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0607 .pq-cloud.c1{top:20px;left:-70px;animation-duration:28s;animation-delay:-10s;}
        .pq0607 .pq-cloud.c2{top:46px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:36s;animation-delay:-22s;}
        .pq0607 .pq-road{position:absolute;left:0;right:0;top:112px;height:32px;background:linear-gradient(#8f99a4,#7c8791);}
        .pq0607 .pq-road::after{content:'';position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:repeating-linear-gradient(90deg,#f5f2e8 0 14px,transparent 14px 28px);opacity:.8;}
        .pq0607 .pq-curb{position:absolute;left:0;right:0;top:144px;height:9px;background:#cfc7b6;border-top:2px solid #b8ae9a;border-bottom:2px solid #bdb3a0;}
        .pq0607 .pq-buswrap{position:absolute;left:14px;top:69px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.22));animation:pqIdle 2.2s ease-in-out infinite;z-index:1;}
        .pq0607 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0607 .pq-sign{position:absolute;right:22px;top:62px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));z-index:1;}
        .pq0607 .pq-flag{transform-box:fill-box;transform-origin:0% 50%;animation:pqFlag 3s ease-in-out infinite;}
        .pq0607 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;}
        .pq0607 .pq-row{position:absolute;left:0;right:0;bottom:7px;display:flex;align-items:flex-end;justify-content:center;gap:4px;z-index:2;}
        .pq0607 .pq-anim{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqQBob 2.4s ease-in-out infinite;}
        .pq0607 .pq-row.cele .pq-anim{animation:pqHop .55s ease-in-out infinite;}
        .pq0607 .pq-cell{position:relative;width:46px;height:56px;margin-left:4px;border:3px dashed #c9a15f;border-radius:14px;display:flex;align-items:flex-end;justify-content:center;background:rgba(255,255,255,.55);animation:pqPulse 1.5s ease-in-out infinite;flex:0 0 auto;}
        .pq0607 .pq-cell.right{border:3px solid #1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0607 .pq-q{font-size:26px;font-weight:900;color:#b8721f;align-self:center;}
        .pq0607 .pq-dropin{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0607 .pq-cnt{position:absolute;top:-8px;right:-7px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0607 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq0607 .pq-opt{position:relative;width:84px;height:86px;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:6px;transition:.14s;}
        .pq0607 .pq-opt svg{filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0607 .pq-opt:disabled{cursor:default;}
        .pq0607 .pq-opt:hover:not(:disabled){border-color:#dcae64;transform:translateY(-3px);}
        .pq0607 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0607 .pq-opt.sel{border-color:#2563eb;background:#eef3fe;}
        .pq0607 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0607 .pq-tick{position:absolute;top:6px;right:6px;color:#1a7f43;}
        .pq0607 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0607 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0607 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(560px);}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqWheel{to{transform:rotate(360deg);}}
        @keyframes pqFlag{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqQBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqHop{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes pqPulse{0%,100%{transform:scale(1);border-color:#c9a15f;}50%{transform:scale(1.06);border-color:#e2a33d;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-26px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-road" />
        <div className="pq-curb" />
        <div className="pq-buswrap"><Bus /></div>
        <div className="pq-sign"><StopSign /></div>

        {/* Navbat SAHNA TARTIBIDA: qizil, qizil, yashil, yashil, qizil, qizil, [?] */}
        <div className={'pq-row' + (ok ? ' cele' : '')}>
          {QUEUE.map((q, i) => (
            <span key={i} className="pq-anim" style={{ animationDelay: ok ? `${i * 0.07}s` : `${-(i * 0.4)}s` }}>
              <Passenger c={C[q]} bd={`${-(i * 0.6)}s`} />
              {ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          ))}
          <span className={'pq-cell' + (ok ? ' right' : '')}>
            {ok
              ? <span className="pq-dropin"><Passenger c={C.yashil} w={34} bd="-.2s" /><b className="pq-cnt">{QUEUE.length + 1}</b></span>
              : <span className="pq-q">?</span>}
          </span>
        </div>
      </div>

      <div className="pq-opts">
        {OPTS.map((o, idx) => {
          const sel = picked === o; const right = ok && o === CORRECT_ID;
          return (
            <button key={o} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(o); setFeedback(null); }} aria-label={names[o]}>
              {right && <span className="pq-tick"><IconOk /></span>}
              <Passenger c={C[o]} w={40} bd={`${-(idx * 1.3)}s`} />
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
