// Dars27 · Amaliyot 10 — «25 ni oling» razryad bo'yicha ayirish «Olma bog'i» · 🔴 · tag: remove_place
// TABIAT SAHNASI (Dars15 etaloni): osmon, quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar. Ifoda «68 − 25 = ?» — yog'och taxtachada. MASHQ (trenajyor emas): bola 25 ni O'ZI
// o'nlik-birlikka ajratadi — sahnada 68 = 6 savat (o'nlik, «10» nishoni) + 8 yakka olma (birlik).
// Savat/olma BOSILADI: bosilgani xira ko'lanka bo'ladi, qayta bosilsa joyiga qaytadi (o'zini o'zi
// to'g'rilash — cap YO'Q, xato qilish mumkin). To'g'ri FAQAT rc===2 (savat) VA ra===5 (olma):
// 25 = 2 o'nlik + 5 birlik. SON O'QI maysadagi yo'lka (43…68): quyoncha 68 da turadi; g'alabada
// ORQAGA sakraydi — 2 ta UZUN sakrash (68→58→48, o'nliklar) + 5 ta KICHIK (48→…→43, birliklar).
// VEDI-DO-VERNOGO: noto'g'rida izoh, qulf YO'Q, retry ochiq; setChecked FAQAT to'g'rida.
// KONTRAKT o'zgarmagan: studentAnswer = { rc, ra }. Javob (43) g'alabagacha ko'rinmaydi (AnsPop).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−';                // ayirish belgisi U+2212 (ASCII '-' EMAS)
const START = 68;             // kamayuvchi: 6 o'nlik + 8 birlik
const SUB = 25;               // ayriluvchi: 2 o'nlik + 5 birlik
const TENS0 = 6, UNITS0 = 8;  // boshlang'ich savatlar va yakka olmalar
const RC_TARGET = 2;          // olinishi kerak: 2 savat (2 o'nlik)
const RA_TARGET = 5;          // olinishi kerak: 5 olma (5 birlik)
const RESULT = 43;            // 68 − 25 = 43 (4 savat + 3 olma qoladi)
const DATA = { start: START, sub: SUB, result: RESULT, rcTarget: RC_TARGET, raTarget: RA_TARGET, ptype: "NEW", level: "🔴", tag: "remove_place" };
// Quyoncha ORQAGA sakrash yo'li: 2 uzun (o'nlik) + 5 kichik (birlik) sakrash.
const HOP_PATH = [68, 58, 48, 47, 46, 45, 44, 43];
const NL_FROM = 43, NL_TO = 68;
const NL_NODES = [43, 44, 45, 46, 47, 48, 58, 68]; // 44–47 — mayda nuqtalar

const T = {
  uz: {
    eyebrow: "Olma bog'i · Ayirish",
    setup: "Bog'da 68 olma: 6 savat va 8 dona.",
    ask: `25 olmani oling. 68 ${M} 25 = ?`,
    correct: `Barakalla! 2 savat va 5 olma — bu 25. 68 ${M} 25 = 43.`,
    hint: "25 bu 2 o'nlik va 5 birlik: 2 savat va 5 dona olma oling.",
    tensLbl: "O'nliklar", unitsLbl: "Birliklar",
    takenLbl: "Olindi", startHint: "Savat yoki olmani bosing",
    aTen: "Savat, 10 olma", aUnit: "Bitta olma",
  },
  ru: {
    eyebrow: "Яблоневый сад · Вычитание",
    setup: "В саду 68 яблок: 6 корзин и 8 штук.",
    ask: `Убери 25 яблок. 68 ${M} 25 = ?`,
    correct: `Молодец! 2 корзины и 5 яблок — это 25. 68 ${M} 25 = 43.`,
    hint: "25 — это 2 десятка и 5 единиц: убери 2 корзины и 5 яблок.",
    tensLbl: "Десятки", unitsLbl: "Единицы",
    takenLbl: "Убрано", startHint: "Нажми корзину или яблоко",
    aTen: "Корзина, 10 яблок", aUnit: "Одно яблоко",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (Dars15 kanoni)
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

// OLMA KANONI (yakka birlik): yumaloq olma tanasi (2-ton radial) + barg + band + oq blik.
// Bitta yakka olma = bitta birlik. (Dars 21/25 kanoni bilan bir xil.)
let __aid = 0;
const Apple = ({ w = 26 }) => {
  const id = "pq2710a" + (__aid++);
  const h = w * 34 / 30;
  return (
    <svg viewBox="0 0 30 34" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (o'nlik): to'qilgan savat + jiyakdan mo'ralab turgan olmalar. Savat = 10 olmani
// bog'lagan BITTA o'nlik (ichi qayta sanalmaydi). '10' nishoni markupda qo'shiladi.
let __bid = 0;
const Basket = ({ w = 48 }) => {
  const id = "pq2710b" + (__bid++);
  const h = w * 78 / 88;
  return (
    <svg viewBox="0 0 88 78" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0a45e" />
          <stop offset="100%" stopColor="#9c6329" />
        </linearGradient>
        <radialGradient id={id + "ap"} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <g stroke="#a6291f" strokeWidth=".7">
        <circle cx="26" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="62" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="44" cy="25" r="11.5" fill={`url(#${id}ap)`} />
      </g>
      <path d="M46,15 Q52,12 53.5,16.5 Q48.5,18.5 46,15 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".6" />
      <rect x="8" y="33" width="72" height="9" rx="4.5" fill="#c98a45" stroke="#7a4a20" strokeWidth="1.4" />
      <path d="M12,42 L76,42 L67,72 Q66,75 62,75 L26,75 Q22,75 21,72 Z" fill={`url(#${id})`} stroke="#7a4a20" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke="#7a4a20" strokeWidth="1.1" opacity=".55" fill="none">
        <path d="M24,42 L27,74" /><path d="M34,42 L35.6,74" /><path d="M44,42 L44,75" />
        <path d="M54,42 L52.4,74" /><path d="M64,42 L61,74" />
      </g>
      <g stroke="#5f3b18" strokeWidth="1.2" opacity=".5" fill="none">
        <path d="M14,52 Q44,58 74,52" /><path d="M17,62 Q44,68 71,62" />
      </g>
    </svg>
  );
};

// Quyoncha (kurs maskoti, Dars15 kanoni) — mo'yna soyasi, uzun quloq, ko'z, mo'ylov, momiq dum.
// Bu yerda CHAPGA qaraydi (ayirish = orqaga sakrash) — .pq-nl-flip scaleX(-1) o'giradi.
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="pq2710bf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="pq2710bh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#pq2710bf)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#pq2710bh)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#pq2710bh)" stroke="#a8977f" strokeWidth="1" />
    <path d="M36.4 17 C34 7.5 36.2 3.6 37.6 3.8 C39 4 39.4 9.5 38.8 17 Z" fill="#f3bccb" />
    <ellipse cx="41" cy="29" rx="4.5" ry="3" fill="#d3c0a6" opacity=".55" />
    <ellipse cx="41.6" cy="23.4" rx="2.1" ry="2.4" fill="#3a322c" />
    <circle cx="42.4" cy="22.5" r="0.8" fill="#fff" />
    <path d="M47.6 26.4 L45.4 25.3 L45.4 27.5 Z" fill="#e08aa0" />
    <path d="M46.4 27.3 Q46.4 29 45 29" fill="none" stroke="#a8977f" strokeWidth="0.8" strokeLinecap="round" />
    <g stroke="#c9b79c" strokeWidth="0.7" strokeLinecap="round">
      <line x1="46" y1="26" x2="52" y2="24.5" /><line x1="46" y1="27" x2="52" y2="27" /><line x1="46" y1="28" x2="51.5" y2="29.5" />
    </g>
    <ellipse cx="34.5" cy="42" rx="5" ry="3" fill="#d3c0a6" stroke="#ac9678" strokeWidth="1" />
  </svg>
);

// SON O'QI (43..68) — maysadagi yo'lka. Quyoncha 68 da turadi (idle); `active` bo'lsa ORQAGA,
// nuqtadan-nuqtaga sekin sakraydi (68→58→48→…→43); 43 nuqtasi yonadi. `still` — statik yakun.
const NumberLine = ({ active = false, still = false }) => {
  const span = NL_TO - NL_FROM;
  const pct = (n) => ((n - NL_FROM) / span) * 100;
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (!active) { setIdx(-1); return; }
    if (still) { setIdx(HOP_PATH.length - 1); return; }
    const timers = HOP_PATH.map((_, k) => setTimeout(() => setIdx(k), 600 + k * 850));
    return () => timers.forEach(clearTimeout);
  }, [active, still]); // eslint-disable-line

  const started = idx >= 0;
  const bunnyN = started ? HOP_PATH[idx] : NL_TO;
  const litFinal = active && (still || idx >= HOP_PATH.length - 1);

  return (
    <div className={'pq-nl' + (still ? ' still' : '')}>
      <div className="pq-nl-track">
        {/* bosib o'tilgan yo'l — quyonchadan O'NGGA (68 tomonga) yonadi */}
        <div className="pq-nl-fill" style={{ left: `${pct(bunnyN)}%`, width: `${100 - pct(bunnyN)}%`, opacity: active && started ? 1 : 0 }} />
      </div>
      <div className="pq-nl-bunny" style={{ left: `${pct(bunnyN)}%` }}>
        <span key={idx} className={'pq-nl-hop' + (started && !still ? ' go' : (!active ? ' idle' : ''))}>
          <span className="pq-nl-flip"><Bunny /></span>
        </span>
      </div>
      <div className="pq-nl-nodes">
        {NL_NODES.map((n) => {
          const minor = n > 43 && n < 48;
          const on = n === NL_FROM && litFinal;
          return (
            <div key={n} className={'pq-nl-node' + (minor ? ' mn' : '') + (on ? ' on' : '')} style={{ left: `${pct(n)}%` }}>
              <span className="pq-nl-dot" />
              <span className="pq-nl-lbl">{n}</span>
              {on && <span className="pq-nl-spark">✦</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function D27_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [rcSet, setRcSet] = useState(() => new Set()); // olingan savat indekslari (o'nlik)
  const [raSet, setRaSet] = useState(() => new Set()); // olingan yakka olma indekslari (birlik)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  const rc = rcSet.size, ra = raSet.size;
  const removed = rc + ra;          // nechta element olindi (tekshirish yoqilishi uchun)
  const taken = rc * 10 + ra;       // nechta OLMA olindi (chip: nishon 25)

  // RESTORE: studentAnswer = { rc, ra } dan sahnani qayta tiklaydi — o'ngdagilari xira
  // ko'lanka bo'ladi (msg DOIM; setChecked faqat to'g'rida).
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const rc0 = Math.max(0, Math.min(Number(sa.rc) || 0, TENS0));
      const ra0 = Math.max(0, Math.min(Number(sa.ra) || 0, UNITS0));
      setRcSet(new Set(Array.from({ length: rc0 }, (_, k) => TENS0 - 1 - k)));
      setRaSet(new Set(Array.from({ length: ra0 }, (_, k) => UNITS0 - 1 - k)));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(removed > 0 && !checked); }, [removed, checked, onReady]);

  const lock = isReview || checked;
  // Bosish = olish; qayta bosish = joyiga qaytarish. Cap YO'Q — bola xato qilib, o'zi to'g'rilaydi.
  const toggleCrate = (i) => {
    if (lock) return;
    setRcSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };
  const toggleApple = (i) => {
    if (lock) return;
    setRaSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (removed <= 0) return;
    const correct = rc === RC_TARGET && ra === RA_TARGET; // aynan 2 o'nlik va 5 birlik olingan
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(RESULT)], studentAnswer: { rc, ra }, correctAnswer: { rc: RC_TARGET, ra: RA_TARGET }, correct, meta: { ...DATA } });
  }, [removed, rc, ra, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const cratesArr = Array.from({ length: TENS0 });   // 6 savat (o'nliklar)
  const applesArr = Array.from({ length: UNITS0 });  // 8 yakka olma (birliklar)

  return (
    <div className="pq pq2710">
      <style>{`
        .pq2710{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2710 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2710 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2710 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2710 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        /* ===== TABIAT SAHNASI (Dars15 etaloni) ===== */
        .pq2710 .pq-scene{position:relative;width:464px;max-width:100%;margin:0 auto;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 40%,#eaf8ff 58%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq2710 .pq-sun{position:absolute;top:14px;left:18px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 20px 6px rgba(255,214,74,.6);animation:pq2710sun 4s ease-in-out infinite;z-index:1;pointer-events:none;}
        .pq2710 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;pointer-events:none;}
        .pq2710 .pq-cloud::before,.pq2710 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2710 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq2710 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq2710 .pq-cloud.c1{top:26px;left:64%;width:46px;animation:pq2710drift 14s ease-in-out infinite;}
        .pq2710 .pq-cloud.c2{top:58px;left:16%;width:34px;transform:scale(.8);animation:pq2710drift 18s ease-in-out infinite reverse;}
        .pq2710 .pq-cloud.c3{top:14px;left:38%;width:30px;transform:scale(.72);animation:pq2710drift 16s ease-in-out infinite;}
        .pq2710 .pq-bird{position:absolute;z-index:1;opacity:.7;pointer-events:none;}
        .pq2710 .pq-bird.b1{top:26px;left:46%;animation:pq2710bird 7s ease-in-out infinite;}
        .pq2710 .pq-bird.b2{top:44px;left:78%;transform:scale(.78);animation:pq2710bird 9s ease-in-out infinite;}
        .pq2710 .pq-hills{position:absolute;left:0;right:0;bottom:130px;height:64px;z-index:1;pointer-events:none;}
        .pq2710 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2710 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2710 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq2710 .pq-hills span:nth-child(3){left:32%;width:40%;height:46px;background:linear-gradient(#a2da7c,#86c663);}
        .pq2710 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:130px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;pointer-events:none;}
        .pq2710 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2710 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;pointer-events:none;}
        .pq2710 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq2710 .pq-flower.f1{left:7%;bottom:112px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq2710 .pq-flower.f2{right:8%;bottom:116px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq2710 .pq-flower.f3{left:30%;bottom:106px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq2710 .pq-flower.f4{left:66%;bottom:110px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq2710 .pq-flower.f5{left:48%;bottom:114px;transform:scale(.9);background:#8ec6ff;box-shadow:5px 0 0 #8ec6ff,-5px 0 0 #8ec6ff,0 5px 0 #8ec6ff,0 -5px 0 #8ec6ff;}
        .pq2710 .pq-tuft{position:absolute;z-index:3;pointer-events:none;}
        .pq2710 .pq-tuft.t1{left:18%;bottom:104px;} .pq2710 .pq-tuft.t2{right:20%;bottom:108px;transform:scale(.85);}
        .pq2710 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;pointer-events:none;}
        .pq2710 .pq-bfly::before,.pq2710 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2710 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2710wing .26s ease-in-out infinite alternate;}
        .pq2710 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2710wing .26s ease-in-out infinite alternate;}
        .pq2710 .pq-bfly.bf1::before,.pq2710 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2710 .pq-bfly.bf2::before,.pq2710 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq2710 .pq-bfly.bf1{top:96px;left:10%;animation:pq2710flit1 8s ease-in-out infinite;}
        .pq2710 .pq-bfly.bf2{top:118px;right:9%;animation:pq2710flit2 9s ease-in-out infinite;}
        /* yog'och taxtacha (ifoda) — Dars15 kanoni */
        .pq2710 .pq-sign{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:7px;padding:10px 13px 12px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq2710 .pq-sign::before,.pq2710 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:26px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq2710 .pq-sign::before{left:24px;} .pq2710 .pq-sign::after{right:24px;}
        .pq2710 .pq-tile{min-width:44px;height:50px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:900;border-radius:12px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        .pq2710 .pq-tile.num{background:#fdecec;border:2.5px solid #cf3f38;color:#cf3f38;}
        .pq2710 .pq-tile.sub{background:#fff4e2;border:2.5px solid #d1912b;color:#b16b12;}
        .pq2710 .pq-tile.hole{background:#fff;border:3px dashed #7a4e12;color:#a05a1f;animation:pq2710breath 1.7s ease-in-out infinite;}
        .pq2710 .pq-tile.ans{background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;animation:pq2710pop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2710 .pq-op{font-size:22px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* ===== ARENA: savatlar (o'nlik) + yakka olmalar (birlik) ===== */
        .pq2710 .pq-arena{position:relative;z-index:4;padding:104px 12px 118px;display:flex;flex-direction:column;align-items:center;gap:9px;}
        .pq2710 .pq-row{display:flex;align-items:stretch;justify-content:center;gap:7px;width:100%;}
        .pq2710 .pq-tray{position:relative;min-height:78px;padding:21px 7px 7px;border-radius:14px;background:rgba(255,255,255,.5);border:2px solid rgba(110,150,110,.38);display:flex;flex-wrap:wrap;align-content:flex-end;align-items:flex-end;justify-content:center;gap:5px;}
        .pq2710 .pq-tray.tens{flex:0 0 57%;}
        .pq2710 .pq-tray.units{flex:1 1 0;min-width:0;}
        .pq2710 .pq-cap{position:absolute;top:4px;left:9px;z-index:4;font-size:11px;font-weight:900;letter-spacing:.02em;color:#3c6b45;font-variant-numeric:tabular-nums;pointer-events:none;}
        .pq2710 .pq-cap b{color:#1a7f43;}
        .pq2710 .pq-plus{align-self:center;font-size:24px;font-weight:900;color:#4c6a52;flex:0 0 auto;}
        /* bosiladigan savat / olma; olingani xira ko'lanka bo'lib QOLADI (nima olingani ko'rinadi) */
        .pq2710 .pq-item{position:relative;line-height:0;flex:0 0 auto;background:none;border:0;padding:0;margin:0;cursor:pointer;transition:opacity .25s ease,filter .25s ease,transform .25s ease;-webkit-tap-highlight-color:transparent;}
        .pq2710 .pq-item:hover:not(:disabled){transform:translateY(-2px);}
        .pq2710 .pq-item:active:not(:disabled){transform:scale(.92);}
        .pq2710 .pq-item:disabled{cursor:default;}
        .pq2710 .pq-item.gone{opacity:.28;filter:grayscale(.75);transform:scale(.88);}
        .pq2710 .pq-badge{position:absolute;top:-5px;right:-3px;min-width:20px;height:18px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:5;pointer-events:none;font-variant-numeric:tabular-nums;box-shadow:0 1px 3px rgba(0,0,0,.28);border:1.5px solid #fff;}
        .pq2710 .pq-item.gone .pq-badge{background:#9aa0a6;border-color:#eceae6;}
        .pq2710 .pq-chip{background:#fff;border:2.5px solid #b8d0ea;color:#2f6bab;font-weight:900;font-size:14px;padding:3px 14px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 2px 6px rgba(0,0,0,.14);}
        .pq2710 .pq-chip b{font-size:17px;margin-left:4px;}
        .pq2710 .pq-chip.win{border-color:#1a7f43;color:#1a7f43;animation:pq2710pop .45s ease both;}
        .pq2710 .pq-taphint{font-size:12px;font-weight:800;color:#3c6b45;background:rgba(255,255,255,.72);padding:3px 12px;border-radius:999px;}
        /* ===== SON O'QI — maysadagi yo'lka (43..68) ===== */
        .pq2710 .pq-nl{position:absolute;left:10px;right:10px;bottom:16px;z-index:4;padding:46px 10px 20px;pointer-events:none;}
        .pq2710 .pq-nl-track{position:relative;height:13px;border-radius:7px;background:linear-gradient(#efe0bd,#e2cd9f);border:1.5px solid #cbb07a;box-shadow:inset 0 1px 2px rgba(120,90,40,.2);margin:0 8px;}
        .pq2710 .pq-nl-fill{position:absolute;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#3f9a4e,#f6c760);box-shadow:0 0 12px 2px rgba(63,154,78,.5);transition:left .7s cubic-bezier(.4,0,.3,1),width .7s cubic-bezier(.4,0,.3,1),opacity .3s;}
        .pq2710 .pq-nl.still .pq-nl-fill{transition:none;}
        .pq2710 .pq-nl-bunny{position:absolute;top:0;transform:translateX(-50%);transition:left .7s cubic-bezier(.4,0,.35,1);z-index:6;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq2710 .pq-nl.still .pq-nl-bunny{transition:none;}
        .pq2710 .pq-nl-hop{display:block;transform-origin:bottom center;}
        .pq2710 .pq-nl-hop.idle{animation:pq2710idle 2.8s ease-in-out infinite;}
        .pq2710 .pq-nl-hop.go{animation:pq2710hop .68s ease;}
        .pq2710 .pq-nl-flip{display:block;transform:scaleX(-1);}
        .pq2710 .pq-nl-nodes{position:relative;height:0;margin:0 8px;}
        .pq2710 .pq-nl-node{position:absolute;top:-13px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;}
        .pq2710 .pq-nl-dot{width:15px;height:15px;border-radius:50%;background:#fff;border:3px solid #c9a35f;box-sizing:border-box;box-shadow:0 1px 2px rgba(90,60,20,.3);transition:.25s;}
        .pq2710 .pq-nl-lbl{margin-top:6px;font-size:13px;font-weight:900;color:#38612a;font-variant-numeric:tabular-nums;text-shadow:0 1px 0 rgba(255,255,255,.4);}
        .pq2710 .pq-nl-node.mn{top:-10px;}
        .pq2710 .pq-nl-node.mn .pq-nl-dot{width:9px;height:9px;border-width:2px;}
        .pq2710 .pq-nl-node.mn .pq-nl-lbl{margin-top:5px;font-size:9px;font-weight:800;color:#4e7a3e;}
        .pq2710 .pq-nl-node.on .pq-nl-dot{background:#3f9a4e;border-color:#2f7d3c;transform:scale(1.6);box-shadow:0 0 14px 4px rgba(63,154,78,.7);}
        .pq2710 .pq-nl-node.on .pq-nl-lbl{color:#166a34;font-size:15px;}
        .pq2710 .pq-nl-spark{position:absolute;top:-22px;font-size:16px;color:#fff2b0;animation:pq2710tw 1.4s ease-in-out infinite;}
        /* g'alaba izohi + feedback */
        .pq2710 .pq-subline{text-align:center;margin-top:12px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2710in .3s .1s both;}
        .pq2710 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2710in .22s ease both;}
        .pq2710 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2710 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2710sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2710drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2710bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq2710wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2710flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq2710flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq2710breath{0%,100%{transform:scale(1);opacity:.9;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes pq2710pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2710idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2710hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-30px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2710tw{0%,100%{opacity:0;transform:scale(.4) rotate(0);}50%{opacity:1;transform:scale(1) rotate(30deg);}}
        @keyframes pq2710in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <Bird cls="b1" /><Bird cls="b2" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
        <div className="pq-hills"><span /><span /><span /></div>
        <div className="pq-grass" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" /><span className="pq-flower f5" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />

        {/* Ifoda yog'och taxtachada; javob (43) faqat g'alabada paydo bo'ladi (AnsPop) */}
        <div className="pq-sign">
          <span className="pq-tile num">{START}</span>
          <span className="pq-op">{M}</span>
          <span className="pq-tile sub">{SUB}</span>
          <span className="pq-op">=</span>
          {ok ? <span className="pq-tile ans">{RESULT}</span> : <span className="pq-tile hole">?</span>}
        </div>

        <div className="pq-arena">
          <div className="pq-row">
            {/* O'nliklar — 6 savat; bosilgani olinadi (xira), qayta bosilsa qaytadi */}
            <div className="pq-tray tens">
              <span className="pq-cap">{t.tensLbl}: <b>{TENS0 - rc}</b></span>
              {cratesArr.map((_, i) => (
                <button key={i} type="button" className={"pq-item" + (rcSet.has(i) ? " gone" : "")}
                  disabled={lock} onClick={() => toggleCrate(i)} aria-label={t.aTen}>
                  <Basket w={40} />
                  <b className="pq-badge">10</b>
                </button>
              ))}
            </div>

            {/* 68 = 6 o'nlik VA 8 birlik — sonning tarkibi QO'SHISH (60+8), ayirish EMAS. */}
            <span className="pq-plus">{'+'}</span>

            {/* Birliklar — 8 yakka olma */}
            <div className="pq-tray units">
              <span className="pq-cap">{t.unitsLbl}: <b>{UNITS0 - ra}</b></span>
              {applesArr.map((_, i) => (
                <button key={i} type="button" className={"pq-item" + (raSet.has(i) ? " gone" : "")}
                  disabled={lock} onClick={() => toggleApple(i)} aria-label={t.aUnit}>
                  <Apple w={24} />
                </button>
              ))}
            </div>
          </div>

          {/* Chip: nechta olma olindi (nishon — 25); boshida bosish yo'rig'i */}
          {removed > 0
            ? <span className={"pq-chip" + (ok ? " win" : "")}>{t.takenLbl}:<b>{taken}</b></span>
            : <span className="pq-taphint">{t.startHint}</span>}
        </div>

        {/* Quyoncha 68 da; g'alabada orqaga: 2 uzun sakrash (o'nliklar) + 5 kichik (birliklar) → 43 */}
        <NumberLine active={!!ok} still={still} />
      </div>

      {/* G'alaba izohi: o'nlik o'nlikdan (6−2=4), birlik birlikdan (8−5=3) */}
      {ok && (<div className="pq-subline">6 {M} 2 = 4 {t.tensLbl.toLowerCase()} · 8 {M} 5 = 3 {t.unitsLbl.toLowerCase()}</div>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
