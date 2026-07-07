// Amaliyot01 (2-sinf) — Dars 1 «O'nliklar va birliklar»: kasseta va batareyalardan sonni top · Blok 1 · daraja 🟢 · teg: razryad_pick
// Syujet: «Yulduz porti» (kosmik yuk terminali) — nazariy Dars01 bilan bir dunyo.
// jsx-question kontrakti: onReady(true/false), registerCheck(fn), onSubmit(result). O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Vizual: 3 kasseta (o'nlik, 10 talik) + 6 batareya (birlik); to'g'ri javobda
// har kassetada "10" yorlig'i, batareyalarda 1..6 sanoq + bayram. Misconception-tuzoq: 63 (o'rin almashgan).

import React, { useState, useEffect, useRef, useCallback } from 'react';

const TENS = 3;
const UNITS = 6;
const TARGET = TENS * 10 + UNITS; // 36
const OPTIONS = [36, 63, 9, 30];
const DATA = { target: TARGET, tag: 'razryad_pick', level: '🟢', block: 1, ptype: 'P21' };

const T = {
  uz: {
    title: "O'nliklar va birliklar",
    setup: "Yuk kemasidan batareyalar keldi: kassetalarda o'ntadan, qolgani alohida.",
    ask: "Rasmda qaysi son ko'rsatilgan?",
    correct: "Barakalla! Uch o'nlik va olti birlik — o'ttiz olti.",
    swap: "Raqamlar o'rniga qarang: kassetalar — o'nliklar, ular chapda yoziladi.",
    add: "Qo'shmang: kassetalarda o'ntadan, ularni birlik bilan yonma-yon yozamiz.",
    tens: "Alohida batareyalarni ham sanang — ular birliklar.",
  },
  ru: {
    title: 'Десятки и единицы',
    setup: 'С грузового корабля привезли батарейки: в кассетах по десять, остальные отдельно.',
    ask: 'Какое число показано на рисунке?',
    correct: 'Молодец! Три десятка и шесть единиц — тридцать шесть.',
    swap: 'Посмотри на место цифр: кассеты — это десятки, их пишут слева.',
    add: 'Не складывай: в кассетах по десять, их пишут рядом с единицами.',
    tens: 'Посчитай и отдельные батарейки — это единицы.',
  },
};

// har noto'g'ri variantga alohida metod-hint (yakuniy sonsiz)
const HINT_BY_VALUE = { 63: 'swap', 9: 'add', 30: 'tens' };

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const SPARKS = [[-46, -34], [46, -34], [-58, 6], [58, 6], [0, -58], [-20, 40], [20, 40]];
const Sparks = ({ show }) => show ? (
  <div className="aq-sparks">{SPARKS.map((d, i) => (
    <span key={i} className="aq-spark" style={{ '--dx': d[0] + 'px', '--dy': d[1] + 'px', animationDelay: `${i * 0.03}s` }}>✨</span>
  ))}</div>
) : null;

// bitta kasseta — 10 batareyalik yopiq g'ilof (SVG); label=true bo'lsa "10" yorlig'i + yashil chiroq
const Cassette = ({ delay, label }) => (
  <span className="aq-cassette" style={{ animationDelay: `${delay}s` }}>
    <svg width="56" height="74" viewBox="0 0 56 74">
      <rect x="2" y="4" width="52" height="66" rx="9" fill="#2e3650" />
      <rect x="5" y="7" width="46" height="60" rx="6" fill="#3b4568" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={9 + (i % 5) * 8} y={i < 5 ? 13 : 41} width="5" height="20" rx="2.5" fill="#8fd0ff" />
      ))}
      <circle cx="28" cy="70" r="3" fill={label ? '#35d07f' : '#5a6488'} />
    </svg>
    {label && <b className="aq-cnt aq-cnt-b">10</b>}
  </span>
);

// bitta alohida batareya (silindr element)
const Battery = ({ delay, label }) => (
  <span className="aq-battery" style={{ animationDelay: `${delay}s` }}>
    <svg width="18" height="46" viewBox="0 0 18 46">
      <rect x="6" y="2" width="6" height="4" rx="1.5" fill="#9aa3c0" />
      <rect x="2" y="6" width="14" height="38" rx="4" fill="#4b567e" />
      <rect x="4" y="9" width="10" height="14" rx="2.5" fill="#8fd0ff" />
    </svg>
    {label != null && <b className="aq-cnt">{label}</b>}
  </span>
);

export default function Amaliyot01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    const msg = correct ? t.correct : t[HINT_BY_VALUE[picked] || 'tens'];
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: DATA.target },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq201">
      <style>{`
        .aq201 { max-width:660px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq201 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq201 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq201 .aq-setup { color:#5c6672; font-weight:500; }
        .aq201 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq201 .aq-stage { position:relative; }
        .aq201 .aq-field { display:flex; align-items:flex-end; gap:16px; justify-content:center; padding:20px; border-radius:20px; flex-wrap:wrap;
          background:linear-gradient(180deg,#141a2e,#1d2440); border:2px solid #2c3554;
          background-image:radial-gradient(1.5px 1.5px at 12% 20%, rgba(255,255,255,.7) 50%, transparent 51%),
            radial-gradient(1px 1px at 78% 14%, rgba(255,255,255,.55) 50%, transparent 51%),
            radial-gradient(1.5px 1.5px at 55% 8%, rgba(255,255,255,.4) 50%, transparent 51%),
            radial-gradient(1px 1px at 32% 12%, rgba(255,255,255,.5) 50%, transparent 51%),
            linear-gradient(180deg,#141a2e,#1d2440); }
        .aq201 .aq-field.win { animation:aqCele .5s ease; }
        .aq201 .aq-group { display:flex; gap:10px; align-items:flex-end; }
        .aq201 .aq-sep { width:2px; align-self:stretch; background:#39436a; border-radius:1px; }
        .aq201 .aq-cassette, .aq201 .aq-battery { position:relative; line-height:0; animation:aqDrop .45s cubic-bezier(.3,1.4,.5,1) both; }
        .aq201 .aq-cnt { position:absolute; top:-10px; right:-6px; min-width:22px; height:22px; padding:0 4px; border-radius:11px;
          background:#2563eb; color:#fff; font-size:13px; font-weight:800; display:flex; align-items:center; justify-content:center;
          font-variant-numeric:tabular-nums; animation:aqPop .3s ease both; }
        .aq201 .aq-cnt-b { background:#1a7f43; }
        .aq201 .aq-opts { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:20px; }
        .aq201 .aq-opt { width:76px; height:66px; font-size:26px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums;
          transition:background .12s, border-color .12s, transform .1s; }
        .aq201 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq201 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq201 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; color:#1f2430; }
        .aq201 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq201 .aq-opt:disabled { cursor:default; }
        .aq201 .aq-sparks { position:absolute; left:50%; top:44%; width:0; height:0; pointer-events:none; }
        .aq201 .aq-spark { position:absolute; font-size:20px; animation:aqSpark .7s ease-out forwards; }
        .aq201 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq201 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq201 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        /* mikrogravitatsiya: tushish emas — yon tomondan suzib kirib, ohista joylashadi */
        @keyframes aqDrop { 0% { opacity:0; transform:translate(-16px,-6px) rotate(-7deg) scale(.82);} 100% { opacity:1; transform:translate(0,0) rotate(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqSpark { 0%{opacity:0; transform:translate(0,0) scale(.4);} 20%{opacity:1;} 100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(1.1);} }
        @media (prefers-reduced-motion: reduce) {
          .aq201 .aq-cassette, .aq201 .aq-battery, .aq201 .aq-spark, .aq201 .aq-field.win, .aq201 .aq-opt.right { animation:none; }
        }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-stage">
        <div className={'aq-field' + (ok ? ' win' : '')}>
          <span className="aq-group">
            {Array.from({ length: TENS }).map((_, i) => (
              <Cassette key={i} delay={i * 0.12} label={ok} />
            ))}
          </span>
          <span className="aq-sep" aria-hidden="true" />
          <span className="aq-group">
            {Array.from({ length: UNITS }).map((_, i) => (
              <Battery key={i} delay={0.4 + i * 0.08} label={ok ? i + 1 : null} />
            ))}
          </span>
        </div>
        <Sparks show={ok} />
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const sel = picked === n;
          const right = ok && n === DATA.target;
          return (
            <button key={n} type="button" className={'aq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
          );
        })}
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
