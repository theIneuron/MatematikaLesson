// Dars35 · Amaliyot 10 — «Tarozini muvozanatlang» · Blok 7 massa · Interaktiv tarozi · 🔴 · tag: balance_interactive
// TABIAT SAHNASI (Dars15 kanoni): osmon, quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar, kapalaklar.
// BRONZA TURAR TAROZI (Dars35_01 kanoni): asos + ustun + sharnir + nur; pallalar ipda TIK osiladi (counter-rotate).
// Chap pal+ qat'iy 4 kg gir. O'ng pal bo'sh; [+1 kg] har bosishda 1 kg toshini palaga TUSHIRADI, [−1 kg] oladi.
// FIZIK: beam tilt joriy o'ng jamiga ergashadi — o'ng<4 → chap past (rotate −9); o'ng=4 → tekis (0); o'ng>4 → o'ng past (+9).
// G'alaba: o'ng pal = 4 kg (muvozanat). Ko'p qo'shilsa hint «Ko'p bo'lib ketdi — bittasini oling» (qulf/retry YO'Q).
// ANSWER-LEAK: tilt adolatli DATA (qaysi tomon og'irligini KO'RSATADI); o'ng jami bola o'z amali — leak emas.
// VEDI-DO-VERNOGO: setChecked FAQAT o'ng=4 da. Tilt STATE (statik transform), review'da to'g'ri qoladi (.still gate).
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

const LEFT = 4;      // chap pal qat'iy gir (kg)
const TARGET = 4;    // o'ng pal muvozanat uchun (kg)
const MAXR = 6;      // o'ng palga maksimal tosh
const DATA = { left: LEFT, answer: TARGET, unit: 'kg', level: '🔴', tag: 'balance_interactive' };

const T = {
  uz: {
    eyebrow: "Massa · Tarozi", title: "Tarozi",
    ask: "Tarozini muvozanatlang.",
    add: "+1 kg", rem: "−1 kg",
    right: "O'ng pal",
    correct: "Barakalla! Ikki tomon 4 kg — tarozi tekis.",
    hintUnder: "Yengil — o'ng pal yuqori. Yana qo'shing.",
    hintOver: "Ko'p bo'lib ketdi — bittasini oling.",
    hint: "Tarozi tekis bo'lsin — ikki tomon teng.",
  },
  ru: {
    eyebrow: "Масса · Весы", title: "Весы",
    ask: "Уравновесь весы.",
    add: "+1 kg", rem: "−1 kg",
    right: "Правая чаша",
    correct: "Молодец! По 4 кг с двух сторон — весы ровные.",
    hintUnder: "Легко — правая чаша выше. Добавь ещё.",
    hintOver: "Стало много — убери одну.",
    hint: "Пусть весы будут ровными — стороны равны.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda).
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
// O't tutami (maysada).
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// 1 kg metall tosh — hajmli (gradient tana, tutqich halqa, yorug'lik yoyi, «1»).
const Weight1 = ({ cx, cy, on }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx="10" ry="2.2" fill="rgba(40,50,60,.18)" />
    <rect x={cx - 4} y={cy - 22} width="8" height="5" rx="2.5" fill="none" stroke={on ? '#1a7f43' : '#7f8b99'} strokeWidth="2" />
    <polygon points={`${cx - 9},${cy} ${cx + 9},${cy} ${cx + 6},${cy - 16} ${cx - 6},${cy - 16}`} fill={on ? 'url(#pq3510stOn)' : 'url(#pq3510st)'} stroke={on ? '#1a7f43' : '#8794a3'} strokeWidth="1.4" strokeLinejoin="round" />
    <path d={`M${cx - 5} ${cy - 15} L${cx - 7} ${cy - 1}`} stroke="rgba(255,255,255,.5)" strokeWidth="1.6" strokeLinecap="round" />
    <text x={cx} y={cy - 4} textAnchor="middle" fontSize="8" fontWeight="900" fill={on ? '#1a7f43' : '#4a5666'} fontFamily="'JetBrains Mono',monospace">1</text>
  </g>
);
// 4 kg gir — katta hajmli metall tosh (gradient, tutqich halqa, «4 kg»).
const Weight4 = ({ cx, cy, on, kg }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx="21" ry="4" fill="rgba(40,50,60,.2)" />
    <rect x={cx - 7} y={cy - 40} width="14" height="8" rx="4" fill="none" stroke={on ? '#1a7f43' : '#6f7c8b'} strokeWidth="3" />
    <polygon points={`${cx - 19},${cy} ${cx + 19},${cy} ${cx + 14},${cy - 32} ${cx - 14},${cy - 32}`} fill={on ? 'url(#pq3510stOn)' : 'url(#pq3510st4)'} stroke={on ? '#1a7f43' : '#78859a'} strokeWidth="2" strokeLinejoin="round" />
    <path d={`M${cx - 12} ${cy - 30} L${cx - 16} ${cy - 2}`} stroke="rgba(255,255,255,.45)" strokeWidth="2.4" strokeLinecap="round" />
    <text x={cx} y={cy - 12} textAnchor="middle" fontSize="12" fontWeight="900" fill={on ? '#1a7f43' : '#39434f'} fontFamily="'JetBrains Mono',monospace">4</text>
    <text x={cx} y={cy - 3} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={on ? '#1a7f43' : '#39434f'} fontFamily="'Manrope',sans-serif">{kg}</text>
  </g>
);

// BRONZA TAROZI (kanon). tilt — nur burchagi (STATE, silliq transition); pallalar counter-rotate bilan TIK qoladi.
// Chap palda 4 kg gir (qat'iy), o'ng palda joriy 1 kg toshlar (rightCount). O'ng toshlar 3 tadan qator ustma-ust.
const PIVOT_X = 170, PIVOT_Y = 56, ARM = 100, PAN_Y = 94;
const BrassBalance = ({ tilt, rightCount, ok, kg }) => {
  const ax = PIVOT_X - ARM, bx = PIVOT_X + ARM;
  const Cords = ({ x }) => (
    <g stroke="#9C7A38" strokeWidth="1.6" fill="none">
      <line x1={x} y1={PIVOT_Y + 3} x2={x - 27} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x + 27} y2={PAN_Y - 2} />
      <circle cx={x} cy={PIVOT_Y + 3} r="2.8" fill="#B8954E" stroke="none" />
    </g>
  );
  const Pan = ({ x }) => (
    <g>
      <path d={`M${x - 32} ${PAN_Y} Q${x} ${PAN_Y + 24} ${x + 32} ${PAN_Y} Z`} fill="url(#pq3510pan)" stroke="#9C7A38" strokeWidth="1.6" />
      <ellipse cx={x} cy={PAN_Y} rx="32" ry="5" fill="url(#pq3510rim)" stroke="#9C7A38" strokeWidth="1.4" />
    </g>
  );
  // o'ng toshlar joylashuvi: 3 tadan qator, past qator PAN_Y da, tepa qator 17px yuqori.
  const wpos = (i) => { const col = i % 3, row = Math.floor(i / 3); return { dx: (col - 1) * 17, dy: -row * 17 }; };
  return (
    <svg viewBox="0 0 340 240" width="100%" aria-hidden="false" role="img" aria-label="tarozi" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="pq3510brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0DCAE" /><stop offset=".5" stopColor="#D8B878" /><stop offset="1" stopColor="#A8843E" /></linearGradient>
        <linearGradient id="pq3510post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A8843E" /><stop offset=".42" stopColor="#E8C98A" /><stop offset=".58" stopColor="#D8B878" /><stop offset="1" stopColor="#9A7634" /></linearGradient>
        <linearGradient id="pq3510pan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8D2A0" /><stop offset=".55" stopColor="#D7B87A" /><stop offset="1" stopColor="#B5914E" /></linearGradient>
        <linearGradient id="pq3510rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBCF" /><stop offset="1" stopColor="#D7B87A" /></linearGradient>
        <radialGradient id="pq3510knob" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F3E5C2" /><stop offset="1" stopColor="#B8954E" /></radialGradient>
        <linearGradient id="pq3510st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef2f7" /><stop offset=".5" stopColor="#c7d0db" /><stop offset="1" stopColor="#9aa7b6" /></linearGradient>
        <linearGradient id="pq3510st4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6ebf2" /><stop offset=".5" stopColor="#bcc7d5" /><stop offset="1" stopColor="#8f9dad" /></linearGradient>
        <linearGradient id="pq3510stOn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6f2df" /><stop offset="1" stopColor="#8fd4a6" /></linearGradient>
      </defs>
      {/* yer soyasi + asos + ustun + sharnir */}
      <ellipse cx="170" cy="233" rx="80" ry="7" fill="rgba(40,60,30,.18)" />
      <rect x="118" y="218" width="104" height="13" rx="6.5" fill="url(#pq3510brass)" stroke="#9A7634" strokeWidth="1.2" />
      <rect x="146" y="209" width="48" height="10" rx="5" fill="url(#pq3510brass)" stroke="#9A7634" strokeWidth="1" />
      <rect x="163" y="70" width="14" height="142" rx="6" fill="url(#pq3510post)" stroke="#9A7634" strokeWidth="1" />
      <path d={`M${PIVOT_X} 44 L154 72 L186 72 Z`} fill="#B8954E" stroke="#9A7634" strokeWidth="1" />
      {/* NUR — sharnir atrofida aylanadi (silliq); pallalar counter-rotate bilan tik */}
      <g className="pq-beam" transform={`rotate(${tilt} ${PIVOT_X} ${PIVOT_Y})`}>
        <rect x={ax - 8} y={PIVOT_Y - 5} width={ARM * 2 + 16} height="10" rx="5" fill="url(#pq3510brass)" stroke="#9A7634" strokeWidth="1.2" />
        {/* CHAP yelka: 4 kg gir (qat'iy) */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${ax} ${PIVOT_Y})`}>
          <Cords x={ax} />
          <Pan x={ax} />
          <Weight4 cx={ax} cy={PAN_Y - 1} on={ok} kg={kg} />
        </g>
        {/* O'NG yelka: joriy 1 kg toshlar */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${bx} ${PIVOT_Y})`}>
          <Cords x={bx} />
          <Pan x={bx} />
          {Array.from({ length: rightCount }).map((_, i) => {
            const p = wpos(i);
            return <g key={i} className="pq-wdrop"><Weight1 cx={bx + p.dx} cy={PAN_Y - 1 + p.dy} on={ok} /></g>;
          })}
          {ok && <g transform={`translate(${bx + 26} ${PAN_Y - 40})`}><circle r="10" fill="#1a7f43" /><path d="M-4.5 0 l3.2 3.2 l6 -6.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>}
        </g>
      </g>
      {/* sharnir gardishi — nur ustidan */}
      <circle cx={PIVOT_X} cy={PIVOT_Y} r="9" fill="url(#pq3510knob)" stroke="#9A7634" strokeWidth="1.2" />
    </svg>
  );
};

export default function D35_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  // RU'da birlikni lokalizatsiya: option/label ichidagi 'kg' → 'кг' (ichki qiymat lotincha qoladi).
  const uL = (s) => lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s;

  const [right, setRight] = useState(0);   // o'ng paldagi kg
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const hintFor = (r) => (r > TARGET ? t.hintOver : r < TARGET ? t.hintUnder : t.hint);

  // RESTORE: studentAnswer = { value: right } dan holatni tiklaydi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const v = initialAnswer.studentAnswer.value;
      if (v != null) { setRight(v); setTouched(true); }
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : hintFor(v == null ? 0 : v) });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const check = useCallback(() => {
    const correct = right === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : hintFor(right) }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: null, studentAnswer: { value: right }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [right, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  const add = () => { if (lock || right >= MAXR) return; setTouched(true); setRight((r) => r + 1); setFeedback(null); };
  const sub = () => { if (lock || right <= 0) return; setTouched(true); setRight((r) => r - 1); setFeedback(null); };

  // Tarozi holati (STATE, statik transform): o'ng<4 → chap og'ir (chap past, −9); =4 → 0; >4 → o'ng past (+9).
  const TILT = right < TARGET ? -9 : right > TARGET ? 9 : 0;

  const [fitRef, scale] = useFitScale(404);

  return (
    <div className={"pq pq3510" + (still ? " still" : "")} ref={fitRef}>
      <style>{`
        .pq3510.still *{animation:none !important;transition:none !important;}
        .pq3510{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3510 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3510 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3510 .pq-ask{display:block;font-size:20px;font-weight:800;}
        /* ===== TABIAT SAHNASI (Dars15 kanoni) ===== */
        .pq3510 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:330px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3510 .pq-fit{position:relative;margin:0 auto;}
        .pq3510 .pq-sun{position:absolute;top:16px;left:20px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3510sun 4s ease-in-out infinite;z-index:1;}
        .pq3510 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3510 .pq-cloud::before,.pq3510 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3510 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3510 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3510 .pq-cloud.c1{top:30px;left:60%;width:46px;animation:pq3510drift 14s ease-in-out infinite;}
        .pq3510 .pq-cloud.c2{top:62px;left:30%;width:34px;transform:scale(.8);animation:pq3510drift 18s ease-in-out infinite reverse;}
        .pq3510 .pq-hills{position:absolute;left:0;right:0;bottom:80px;height:64px;z-index:1;}
        .pq3510 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3510 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3510 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq3510 .pq-hills span:nth-child(3){left:32%;width:40%;height:46px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3510 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:88px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3510 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3510 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3510 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3510 .pq-flower.f1{left:9%;bottom:62px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3510 .pq-flower.f2{right:8%;bottom:56px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3510 .pq-flower.f3{left:19%;bottom:26px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3510 .pq-flower.f4{right:18%;bottom:22px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3510 .pq-tuft{position:absolute;z-index:3;}
        .pq3510 .pq-tuft.t1{left:27%;bottom:58px;} .pq3510 .pq-tuft.t2{right:27%;bottom:64px;transform:scale(.85);}
        .pq3510 .pq-tree{position:absolute;left:8px;bottom:74px;width:46px;height:56px;z-index:2;}
        .pq3510 .pq-tree i{position:absolute;}
        .pq3510 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3510 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3510 .pq-bush{position:absolute;right:12px;bottom:70px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3510 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3510 .pq-bfly::before,.pq3510 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3510 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3510wing .26s ease-in-out infinite alternate;}
        .pq3510 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3510wing .26s ease-in-out infinite alternate;}
        .pq3510 .pq-bfly.bf1::before,.pq3510 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3510 .pq-bfly.bf2::before,.pq3510 .pq-bfly.bf2::after{background:#8ec6ff;}
        .pq3510 .pq-bfly.bf1{top:96px;left:14%;animation:pq3510flit1 8s ease-in-out infinite;}
        .pq3510 .pq-bfly.bf2{top:120px;right:12%;animation:pq3510flit2 9s ease-in-out infinite;}
        .pq3510 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3510 .pq-bird.b1{top:24px;left:42%;animation:pq3510bird 7s ease-in-out infinite;}
        .pq3510 .pq-bird.b2{top:44px;left:58%;transform:scale(.78);animation:pq3510bird 9s ease-in-out infinite;}
        /* yog'och taxtacha (sarlavha) */
        .pq3510 .pq-badge{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:11px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fff3df;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 9px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* tarozi — maysada */
        .pq3510 .pq-balwrap{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);width:330px;max-width:92%;z-index:4;}
        .pq3510 .pq-beam,.pq3510 .pq-arm{transition:transform .5s cubic-bezier(.34,1.2,.5,1);}
        .pq3510 .pq-wdrop{animation:pq3510drop .5s cubic-bezier(.34,1.35,.5,1) both;}
        .pq3510 .pq-spark{position:absolute;z-index:8;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3510tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3510 .pq-spark.s2{animation-delay:-.6s;} .pq3510 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3510.still .pq-spark{opacity:1;}
        /* joriy o'ng jami */
        .pq3510 .pq-chip{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px auto 0;font-size:14px;font-weight:800;color:#3f5a7a;font-variant-numeric:tabular-nums;}
        .pq3510 .pq-chip b{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #cbb07a;color:#7a5f24;box-shadow:0 1px 3px rgba(0,0,0,.1);}
        .pq3510 .pq-chip b.ok{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;}
        /* boshqaruv */
        .pq3510 .pq-ctrl{display:flex;gap:12px;justify-content:center;margin-top:12px;}
        .pq3510 .pq-btn{min-width:96px;height:52px;padding:0 14px;font-size:19px;font-weight:900;border-radius:14px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq3510 .pq-btn.add{border-color:#8fc16a;color:#3a8a2e;}
        .pq3510 .pq-btn.rem{border-color:#e0b4b4;color:#b4552f;}
        .pq3510 .pq-btn:hover:not(:disabled){transform:translateY(-2px);}
        .pq3510 .pq-btn:active:not(:disabled){transform:scale(.95);}
        .pq3510 .pq-btn:disabled{opacity:.4;cursor:default;}
        .pq3510 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3510in .22s ease both;}
        .pq3510 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3510 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3510sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3510drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3510wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3510flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3510flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3510bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3510drop{0%{opacity:0;transform:translateY(-70px);}62%{opacity:1;transform:translateY(4px);}82%{transform:translateY(-2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pq3510tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3510in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 404 * scale, height: 330 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <Bird cls="b1" /><Bird cls="b2" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-hills"><span /><span /><span /></div>
        <div className="pq-grass" />
        <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /></div>
        <span className="pq-bush" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-badge">{t.title}</div>

        {/* Bronza tarozi: chap = 4 kg gir, o'ng = joriy 1 kg toshlar. Nur joriy holatga qarab egiladi. */}
        <div className="pq-balwrap">
          <BrassBalance tilt={TILT} rightCount={right} ok={!!ok} kg={uL('kg')} />
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '150px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '78%', top: '150px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '96px' }}>{'✦'}</span>
        </>)}
        </div>
      </div>

      {/* Joriy o'ng jami — bola o'z amali (leak emas). */}
      <div className="pq-chip">
        <span>{t.right}:</span>
        <b className={ok ? 'ok' : ''}>{uL(right + ' kg')}</b>
      </div>

      {/* Boshqaruv: [+1 kg] palaga tosh tushiradi, [−1 kg] oladi. Ko'p qo'shilsa −1 bilan tuzatiladi (qulf yo'q). */}
      <div className="pq-ctrl">
        <button type="button" className="pq-btn rem" disabled={lock || right <= 0} onClick={sub}>{uL(t.rem)}</button>
        <button type="button" className="pq-btn add" disabled={lock || right >= MAXR} onClick={add}>{uL(t.add)}</button>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
