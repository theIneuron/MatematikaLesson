// Dars07 · Amaliyot 10 — YANGI kreativ «Birlashtir!» (merge_action) · 🔴 · tag: merge_action
// 2 bosqich: (1) daraxtda 4 + panjarada 3 kaptar, katta «+» tugma bosiladi → 3 kaptar daraxtga
// birin-ketin UCHIB qo'shiladi (merge), «4 + 3 = ?» paydo; (2) variantlar [6,7,8] faollashadi, bola 7 ni tanlaydi.
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

const DATA = { a: 5, b: 4, target: 9, options: [8, 9, 10], ptype: 'NEW', level: '🔴', tag: 'merge_action' };

// Daraxtdagi 4 kaptar (sahna koordinatalari) + panjaradagi 3 kaptar (uchish deltalari CSS'da).
// FENCE_P tartibi: qo'nishdan keyin badge 5-6-7 chapdan o'ngga sanaladi (land1=11px, land2=44px, land3=95px).
const TREE_P = [
  { x: 18, y: 116, dir: 'R' },
  { x: 34, y: 80, dir: 'R' },
  { x: 72, y: 94, dir: 'L' },
  { x: 112, y: 120, dir: 'R' },
  { x: 94, y: 64, dir: 'L' },
];
const FENCE_P = [
  { x: 270, y: 93 },
  { x: 314, y: 97 },
  { x: 290, y: 114 },
  { x: 246, y: 104 },
];

const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · Birlashtirish', title: 'Birlashtir!',
    setup: 'Daraxtda beshta kaptar, panjarada to\'rttasi o\'tiribdi. Ularni birlashtiramiz!',
    ask: 'Avval katta QO\'SHUV tugmasini bosing, keyin jami nechta bo\'lganini tanlang.',
    correct: 'Barakalla! Besh va to\'rt birlashdi — to\'qqiz kaptar. Qo\'shish — bu birlashtirish!',
    hint: 'Kaptarlar endi bitta daraxtda. Hammasini boshidan sanang.',
    tapHint: 'Qo\'shuv tugmasini bosing',
  },
  ru: {
    eyebrow: 'Игровая площадка · Объединение', title: 'Объедини!',
    setup: 'На дереве пять голубей, а на заборе сидят четыре. Давай их объединим!',
    ask: 'Сначала нажми большую кнопку «плюс», потом выбери, сколько стало всего.',
    correct: 'Молодец! Пять и четыре объединились — девять голубей. Сложение — это объединение!',
    hint: 'Голуби теперь на одном дереве. Посчитай их все с начала.',
    tapHint: 'Нажми кнопку «плюс»',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KAPTAR KANONI (D03_04 qush uslubi): kulrang 2-ton tana, to'q bosh, bo'yin-sheni,
// qanot (uchishda qoqadi), blikli ko'z, tumshuq, pushti-qizil oyoqlar.
const Pigeon = () => (
  <svg viewBox="0 0 64 52" width="44" height="36" className="pq-pigsvg" aria-hidden="true">
    <path d="M6 22 L23 22 L23 31 L8 30 Z" fill="#77828f" />
    <path d="M6 22 L14 26 L6 30 Z" fill="#9aa4b2" opacity=".7" />
    <ellipse cx="34" cy="27" rx="16" ry="11" fill="#9aa4b2" />
    <ellipse cx="38" cy="31.5" rx="11.5" ry="7" fill="#c6ccd6" />
    <ellipse cx="44" cy="21.5" rx="4.5" ry="6" fill="#8fae9c" opacity=".55" />
    <circle cx="48" cy="17.5" r="8.2" fill="#727d8c" />
    <ellipse cx="50" cy="20" rx="4.8" ry="3.4" fill="#c6ccd6" opacity=".7" />
    <polygon points="55.5,15.5 62.5,18 55.5,20.5" fill="#e8a33d" />
    <circle cx="50.4" cy="15.6" r="1.9" fill="#1f2430" />
    <circle cx="51.2" cy="14.9" r="0.65" fill="#fff" />
    <path className="pq-wing" d="M25 21 Q37 12 47 20 Q42 30 31 31 Q25 27 25 21 Z" fill="#6b7684" />
    <path className="pq-wing" d="M28 22 Q37 17 44 21" stroke="#c6ccd6" strokeWidth="1.4" fill="none" opacity=".6" />
    <line x1="31" y1="37.5" x2="29" y2="47" stroke="#c0705c" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="38" y1="38" x2="38" y2="47" stroke="#c0705c" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="29" y1="47" x2="25.5" y2="48.5" stroke="#c0705c" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="47" x2="34.5" y2="48.5" stroke="#c0705c" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Qatlamli daraxt (D03_04 kanoni): po'stloq-tana, 3-ton barg-toji, 7 ta qo'nish shox-stubi, 2 olma.
const Tree = () => (
  <svg viewBox="0 0 200 176" width="176" height="155" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="100" cy="167" rx="82" ry="8" fill="#9fce8c" />
    <path d="M92 167 L92 110 Q92 98 80 88 M108 167 L108 106 Q108 96 122 84 M100 126 Q100 114 100 104" stroke="#7c4f24" strokeWidth="14" strokeLinecap="round" fill="none" />
    <path d="M95 160 L95 120 M104 158 L104 118" stroke="#5f3a17" strokeWidth="2" strokeLinecap="round" opacity=".5" />
    <path d="M92 167 Q86 170 78 171 M108 167 Q114 170 122 171" stroke="#7c4f24" strokeWidth="9" strokeLinecap="round" fill="none" />
    <circle cx="64" cy="74" r="42" fill="#4f9a48" />
    <circle cx="126" cy="58" r="44" fill="#5cae54" />
    <circle cx="102" cy="94" r="36" fill="#478b41" />
    <circle cx="86" cy="42" r="31" fill="#68bd60" />
    <circle cx="76" cy="34" r="12" fill="#83cf7a" opacity=".8" />
    <circle cx="136" cy="44" r="13" fill="#83cf7a" opacity=".7" />
    <circle cx="54" cy="62" r="10" fill="#6fc267" opacity=".7" />
    <path d="M22 78 q14 6 26 2 M172 92 q-12 6 -24 2" stroke="#3f7d39" strokeWidth="3" fill="none" opacity=".5" />
    <circle cx="56" cy="54" r="6" fill="#d94f5c" />
    <circle cx="54.4" cy="52.2" r="1.8" fill="#fff" opacity=".5" />
    <circle cx="146" cy="46" r="6" fill="#d94f5c" />
    <circle cx="144.4" cy="44.2" r="1.8" fill="#fff" opacity=".5" />
    <path d="M38 56 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M99 31 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M145 60 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M68 90 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M126 96 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M56 18 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M30 102 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
// ARG'IMCHOQ: A-ramka + tebranadigan o'rindiq; o'rindiqda BOLA KANONI bo'yicha nomsiz bola
// (teri-rang bosh, blikli pirpiratuvchi ko'zlar, tabassum, ko'k futbolka) — dekor, sanalmaydi.
const Swing = () => (
  <svg viewBox="0 0 92 108" width="92" height="108" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="12" y1="10" x2="2" y2="104" stroke="#b06a3f" strokeWidth="5" strokeLinecap="round" />
    <line x1="12" y1="10" x2="22" y2="104" stroke="#b06a3f" strokeWidth="5" strokeLinecap="round" />
    <line x1="80" y1="10" x2="70" y2="104" stroke="#b06a3f" strokeWidth="5" strokeLinecap="round" />
    <line x1="80" y1="10" x2="90" y2="104" stroke="#b06a3f" strokeWidth="5" strokeLinecap="round" />
    <line x1="6" y1="10" x2="86" y2="10" stroke="#9c5a33" strokeWidth="5.5" strokeLinecap="round" />
    <circle cx="12" cy="10" r="3.4" fill="#8a4f2b" />
    <circle cx="80" cy="10" r="3.4" fill="#8a4f2b" />
    <g className="pq-swingarm">
      <line x1="34" y1="12" x2="34" y2="64" stroke="#8a6a3a" strokeWidth="2.5" />
      <line x1="58" y1="12" x2="58" y2="64" stroke="#8a6a3a" strokeWidth="2.5" />
      <rect x="30" y="63" width="32" height="6.5" rx="3" fill="#d9534b" stroke="#a33630" strokeWidth="1.2" />
      <line x1="42" y1="66" x2="40" y2="79" stroke="#5b6d86" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="66" x2="52" y2="79" stroke="#5b6d86" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="39.4" cy="80.5" r="2.1" fill="#7c4f24" />
      <circle cx="52.6" cy="80.5" r="2.1" fill="#7c4f24" />
      <rect x="37" y="48" width="18" height="18" rx="7" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.4" />
      <path d="M39 52 Q36 49 34 45.5" stroke="#4f8fc4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M53 52 Q56 49 58 45.5" stroke="#4f8fc4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="44.5" r="2.2" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
      <circle cx="58" cy="44.5" r="2.2" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
      <circle cx="46" cy="38" r="8.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.3" />
      <path d="M37.5 38 A8.5 8.5 0 0 1 54.5 38 Q50 33.8 46 33.8 Q42 33.8 37.5 38 Z" fill="#4a3524" />
      <circle cx="43" cy="40" r="1.2" fill="#1f2430" /><circle cx="43.45" cy="39.55" r="0.45" fill="#fff" />
      <circle cx="49" cy="40" r="1.2" fill="#1f2430" /><circle cx="49.45" cy="39.55" r="0.45" fill="#fff" />
      <g className="pq-blink" style={{ '--bd': '-1.2s' }}><rect x="41.4" y="38.6" width="3.2" height="2.8" rx="1.3" fill={SKIN} /><rect x="47.4" y="38.6" width="3.2" height="2.8" rx="1.3" fill={SKIN} /></g>
      <path d="M43.5 43.4 Q46 45 48.5 43.4" stroke="#8a5f3a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// O't-gul dekor tufti.
const Tuft = ({ flower, core }) => (
  <svg viewBox="0 0 46 28" width="46" height="28" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M4 26 q3 -10 5 -1 M12 27 q3 -11 6 -1 M20 26 q3 -9 5 -1" stroke="#7fb96e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <line x1="34" y1="26" x2="34" y2="13" stroke="#6da75c" strokeWidth="2" />
    <circle cx="34" cy="10" r="3.6" fill={flower} />
    <circle cx="34" cy="10" r="1.5" fill={core} />
  </svg>
);

export default function D07_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [merged, setMerged] = useState(false);
  const [instant, setInstant] = useState(false); // restore: parvozsiz, kaptarlar darrov daraxtda
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      setMerged(true); setInstant(true);
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') {
        const tt = T[lang] || T.uz;
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? tt.correct : tt.hint });
        setChecked(true);
      }
    }
  }, [initialAnswer, lang]);
  useEffect(() => { onReady?.(merged && picked !== null && !checked); }, [merged, picked, checked, onReady]);

  const lock = isReview || checked;

  const check = useCallback(() => {
    if (!merged || picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked, merged: true }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [merged, picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq0710" ref={fitRef}>
      <style>{`
        .pq0710{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0710 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e8b57;text-transform:uppercase;}
        .pq0710 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0710 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0710 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0710 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:260px;border-radius:20px;background:linear-gradient(180deg,#cfe9fb 0%,#e8f6ff 44%,#cdeab4 56%,#a9d78e 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0710 .pq-fit{position:relative;margin:0 auto;}
        .pq0710 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0710 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0710 .pq-cloud.c1{top:14px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0710 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-24s;}
        .pq0710 .pq-fence{position:absolute;left:0;right:0;top:118px;height:54px;z-index:0;}
        .pq0710 .pq-fence::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,#cbb389 0 9px,rgba(0,0,0,0) 9px 40px);}
        .pq0710 .pq-rail{position:absolute;left:0;right:0;height:7px;border-radius:3px;background:#d9c49a;border:1.5px solid #b99b6b;}
        .pq0710 .pq-rail.r1{top:8px;} .pq0710 .pq-rail.r2{top:30px;}
        .pq0710 .pq-treewrap{position:absolute;left:-4px;top:100px;z-index:1;}
        .pq0710 .pq-swing{position:absolute;left:182px;top:50px;z-index:1;}
        .pq0710 .pq-swingarm{transform-box:fill-box;transform-origin:50% 0;animation:pqSwing 3.2s ease-in-out infinite alternate;}
        .pq0710 .pq-tuft{position:absolute;bottom:3px;z-index:1;} .pq0710 .pq-tuft.t1{left:150px;} .pq0710 .pq-tuft.t2{right:6px;}
        .pq0710 .pq-pig{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0710 .pq-pig.fp{z-index:3;}
        .pq0710 .pq-pigin{position:relative;display:inline-block;line-height:0;animation:pqBob 2.3s ease-in-out infinite;animation-delay:var(--pd,0s);}
        .pq0710 .pq-scene.win .pq-pigin{animation:pqHop .5s ease-in-out infinite alternate;animation-delay:var(--hd,0s);}
        .pq0710 .pq-pig.mir .pq-pigsvg{transform:scaleX(-1);}
        .pq0710 .pq-wing{transform-box:fill-box;transform-origin:30% 18%;}
        .pq0710 .pq-pig.fly1{animation:pqFly1 1.3s cubic-bezier(.4,.1,.5,1) both;}
        .pq0710 .pq-pig.fly2{animation:pqFly2 1.3s cubic-bezier(.4,.1,.5,1) 1.05s both;}
        .pq0710 .pq-pig.fly3{animation:pqFly3 1.3s cubic-bezier(.4,.1,.5,1) 2.1s both;}
        .pq0710 .pq-pig.fly4{animation:pqFly4 1.3s cubic-bezier(.4,.1,.5,1) 3.15s both;}
        .pq0710 .pq-pig.fly1 .pq-wing{animation:pqFlap .15s ease-in-out 9 alternate;}
        .pq0710 .pq-pig.fly2 .pq-wing{animation:pqFlap .15s ease-in-out 1.05s 9 alternate;}
        .pq0710 .pq-pig.fly3 .pq-wing{animation:pqFlap .15s ease-in-out 2.1s 9 alternate;}
        .pq0710 .pq-pig.fly4 .pq-wing{animation:pqFlap .15s ease-in-out 3.15s 9 alternate;}
        .pq0710 .pq-pig.land1{transform:translate(-259px,61px);}
        .pq0710 .pq-pig.land2{transform:translate(-270px,49px);}
        .pq0710 .pq-pig.land3{transform:translate(-195px,38px);}
        .pq0710 .pq-pig.land4{transform:translate(-180px,48px);}
        .pq0710 .pq-glab{position:absolute;width:34px;height:34px;border-radius:50%;background:#fff;border:2.5px solid #8fa3c0;color:#33415c;font-size:19px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(51,65,92,.18);z-index:4;transition:opacity .55s,transform .55s;}
        .pq0710 .pq-glab.g1{left:66px;top:44px;} .pq0710 .pq-glab.g2{left:298px;top:56px;}
        .pq0710 .pq-glab.off{opacity:0;transform:scale(.5);}
        .pq0710 .pq-plusbtn{position:absolute;left:194px;top:148px;width:58px;height:58px;border-radius:50%;background:radial-gradient(circle at 35% 32%,#ef8d86,#d9534b 62%,#b8423a);border:3px solid #a33630;color:#fff;font-size:36px;font-weight:900;line-height:1;cursor:pointer;z-index:6;display:flex;align-items:center;justify-content:center;padding:0 0 3px;box-shadow:0 4px 10px rgba(163,54,48,.35);animation:pqPulse 1.6s ease-in-out infinite;transition:transform .12s;}
        .pq0710 .pq-plusbtn:active:not(.gone){transform:scale(.92);}
        .pq0710 .pq-plusbtn.gone{animation:pqPlusOut .5s ease forwards;pointer-events:none;}
        .pq0710 .pq-eq{position:absolute;left:12px;top:222px;background:#fff;padding:3px 12px;border-radius:12px;font-size:21px;font-weight:900;color:#1f2430;box-shadow:0 3px 10px rgba(31,36,48,.18);z-index:5;white-space:nowrap;animation:pqEqIn .45s cubic-bezier(.3,1.5,.5,1) 3.7s both;}
        .pq0710 .pq-eq.now{animation-delay:0s;}
        .pq0710 .pq-eq .q{display:inline-block;color:#d9534b;animation:pqQ 1.4s ease-in-out infinite;}
        .pq0710 .pq-eq .ans{color:#1a7f43;display:inline-block;animation:pqPop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0710 .pq-eq.win{color:#1a7f43;animation:pqCele .5s ease both;}
        .pq0710 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0710 .pq-taphint{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:700;color:#5c6672;background:rgba(255,255,255,.88);padding:3px 10px;border-radius:999px;animation:pqBobY 1.8s ease-in-out infinite;z-index:5;white-space:nowrap;}
        .pq0710 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0710 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0710 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pq0710 .pq-opt:disabled{opacity:.45;cursor:default;}
        .pq0710 .pq-opt:hover:not(:disabled){border-color:#a9cba0;transform:translateY(-2px);}
        .pq0710 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0710 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;opacity:1;}
        .pq0710 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;opacity:1;animation:pqCele .5s ease;}
        .pq0710 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0710 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0710 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSwing{from{transform:rotate(-7deg);}to{transform:rotate(7deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqBobY{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,-3px);}}
        @keyframes pqHop{from{transform:translateY(0);}to{transform:translateY(-6px);}}
        @keyframes pqFlap{from{transform:rotate(8deg);}to{transform:rotate(-42deg);}}
        @keyframes pqFly1{0%{transform:translate(0,0);}28%{transform:translate(-64px,-46px) rotate(-8deg);}62%{transform:translate(-172px,-38px) rotate(-4deg);}100%{transform:translate(-259px,61px) rotate(0deg);}}
        @keyframes pqFly2{0%{transform:translate(0,0);}30%{transform:translate(-62px,-52px) rotate(-8deg);}64%{transform:translate(-180px,-42px) rotate(-3deg);}100%{transform:translate(-270px,49px) rotate(0deg);}}
        @keyframes pqFly3{0%{transform:translate(0,0);}28%{transform:translate(-46px,-50px) rotate(-9deg);}62%{transform:translate(-130px,-40px) rotate(-4deg);}100%{transform:translate(-195px,38px) rotate(0deg);}}
        @keyframes pqFly4{0%{transform:translate(0,0);}28%{transform:translate(-52px,-50px) rotate(-8deg);}62%{transform:translate(-140px,-40px) rotate(-4deg);}100%{transform:translate(-180px,48px) rotate(0deg);}}
        @keyframes pqPulse{0%{box-shadow:0 4px 10px rgba(163,54,48,.35),0 0 0 0 rgba(217,83,75,.45);transform:scale(1);}70%{box-shadow:0 4px 10px rgba(163,54,48,.35),0 0 0 14px rgba(217,83,75,0);transform:scale(1.06);}100%{box-shadow:0 4px 10px rgba(163,54,48,.35),0 0 0 0 rgba(217,83,75,0);transform:scale(1);}}
        @keyframes pqPlusOut{0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(1.6);}}
        @keyframes pqEqIn{0%{opacity:0;transform:translateY(10px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.25);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 260 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-fence"><span className="pq-rail r1" /><span className="pq-rail r2" /></div>
        <div className="pq-treewrap"><Tree /></div>
        <div className="pq-swing"><Swing /></div>
        <span className="pq-tuft t1"><Tuft flower="#f2b134" core="#b97c14" /></span>
        <span className="pq-tuft t2"><Tuft flower="#e88bb1" core="#b1487a" /></span>

        {TREE_P.map((p, i) => (
          <span key={'t' + i} className={'pq-pig' + (p.dir === 'L' ? ' mir' : '')} style={{ left: p.x, top: p.y }}>
            <span className="pq-pigin" style={{ '--pd': `${-i * 0.7}s`, '--hd': `${i * 0.1}s` }}>
              <Pigeon />
              {ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          </span>
        ))}
        {FENCE_P.map((p, i) => (
          <span key={'f' + i}
            className={'pq-pig fp mir' + (merged ? (instant ? ` land${i + 1}` : ` fly${i + 1}`) : '')}
            style={{ left: p.x, top: p.y }}>
            <span className="pq-pigin" style={{ '--pd': `${-1.1 - i * 0.6}s`, '--hd': `${(4 + i) * 0.1}s` }}>
              <Pigeon />
              {ok && <b className="pq-cnt">{TREE_P.length + i + 1}</b>}
            </span>
          </span>
        ))}

        <span className={'pq-glab g1' + (merged ? ' off' : '')}>{DATA.a}</span>
        <span className={'pq-glab g2' + (merged ? ' off' : '')}>{DATA.b}</span>

        <button type="button" className={'pq-plusbtn' + (merged ? ' gone' : '')} disabled={lock || merged}
          onClick={() => { if (lock || merged) return; setMerged(true); }} aria-label="qo'shuv">+</button>

        {merged && (
          <div className={'pq-eq' + (instant ? ' now' : '') + (ok ? ' win' : '')}>
            {DATA.a} + {DATA.b} = {ok ? <b className="ans">{DATA.target}</b> : <span className="q">?</span>}
          </div>
        )}

        {!merged && !lock && <span className="pq-taphint">{t.tapHint}</span>}
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock || !merged} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
