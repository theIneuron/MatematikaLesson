// Dars22 · Amaliyot 10 — YANGI kreativ: interaktiv timsoh «Olma bog'i» · timsoh · tag: compare_croc
// Ikki son: chapda 38, o'ngda 53, orasida timsoh. Bola KATTA sonni bosadi. To'g'ri (53) da timsoh
// og'zini o'sha (53, o'ng) tomonga OCHADI — jag'lar taqqoslash belgisini yasaydi, chip "38 < 53" chiqadi.
// Kichikni (38) bossa — timsoh biroz silkinadi, og'iz YOPIQ qoladi (yumshoq izoh), qulf YO'Q.
// Qoida: AVVAL o'nliklarni solishtiring (3 savat vs 5 savat), teng bo'lsa birliklar. SAVAT = bitta
// o'nlik (10 olma bir joyda, "10" nishoni); yakka olma = bitta birlik. ANSWER-LEAK yo'q: yechilgunga
// qadar markazda "?" turadi, belgi FAQAT to'g'ri javobda ochiladi. VEDI-DO-VERNOGO: noto'g'rida qulf
// yo'q, retry yo'q; setChecked FAQAT to'g'rida (picked === 53). studentAnswer = { picked }.
// Savol matni ANIQ: "Ikkita son bor: 38 va 53" + katta sonni bosish-buyruq.
// Ambient boyitish: bulutlar + hilpiragan gullar + tushayotgan barglar (dekor, pointer-events YO'Q).
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

const LEFT = 38, RIGHT = 53, BIG = RIGHT;   // katta son = 53 (o'ngda). Bola shuni bosishi kerak.
const SIGN = "<";                            // 38 < 53 (belgi matn ko'rinishida; JSX ichida literal belgi YO'Q)
const SIGN_STR = LEFT + " " + SIGN + " " + RIGHT;   // "38 < 53"
const L_TENS = Math.floor(LEFT / 10), L_UNITS = LEFT % 10;   // 3 savat, 8 olma
const R_TENS = Math.floor(RIGHT / 10), R_UNITS = RIGHT % 10; // 5 savat, 3 olma
const DATA = { a: LEFT, b: RIGHT, big: BIG, target: SIGN, options: [LEFT, RIGHT], level: '🔴', tag: 'compare_croc' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Timsoh", title: "Timsoh qaysi tomonga?",
    setup: "Ikkita son bor: 38 va 53.",
    ask: "Katta sonni bosing.",
    correct: "Barakalla! Timsoh kattasini tanladi: 53. 38 < 53.",
    hint: "Timsohning og'zi katta songa qarab ochiladi. Qaysi son katta?",
    sub: "5 o'nlik 3 o'nlikdan katta.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Крокодил", title: "Куда смотрит крокодил?",
    setup: "Есть два числа: 38 и 53.",
    ask: "Нажми большее число.",
    correct: "Молодец! Крокодил выбрал большее: 53. 38 < 53.",
    hint: "Рот крокодила открывается к большему числу. Какое больше?",
    sub: "5 десятков больше 3 десятков.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — Dars21 kanoni: yumaloq tana (radial 2-ton), bandak, barg, oq blik.
const Apple = ({ w = 11 }) => {
  const id = 'pq2210a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// SAVAT (bitta o'nlik = 10 olma bir birlikka bog'langan) — Dars21 kanoni: to'qima savat, olmalar
// mo'ralaydi, yashil "10" nishoni. Bola savat ichini qayta sanamaydi — savat = bitta o'nlik.
const Basket = ({ w = 30 }) => {
  const id = 'pq2210b' + (__gid++);
  const ap = id + 'ap';
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// Barg (ambient) — bog' havosida sekin uchadigan yashil barg. Dekor, pointer-events YO'Q.
const Leaf = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M4 16 Q4 4 16 4 Q16 16 4 16 Z" fill="#7cc85e" stroke="#4f9a3f" strokeWidth="1" />
    <path d="M6 14 Q11 9 14 6" stroke="#3f8038" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

// TIMSOH (Dars04/Dars12 kanoni): cho'zilgan yashil tana, tikanli scute-orqa, panjali oyoq, blikli
// ko'z + pirpiratish qopqog'i. chomp=false → og'iz TINCH/yopiq; chomp=true → og'iz OCHIQ (jag'lar
// taqqoslash belgisini eslatadi). Asos o'ngga qaragan — katta son (53) o'ngda, shu tomonga og'iz ochadi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="102" height="56" aria-hidden="true" style={{ display: 'block' }}>
    {/* dum */}
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    {/* uzoq tomondagi oyoqlar */}
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    {/* cho'zilgan tana */}
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    {/* qorin */}
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* orqa scute-tikanlar */}
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    {/* yaqin oyoqlar — panjali */}
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    {/* bosh suyagi */}
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />

    {chomp ? (
      <>
        {/* og'iz OCHIQ — jag'lar katta son (53, o'ng) tomonga qarab ochiladi */}
        <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
        <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
        <g className="pq-jaws chomping">
          <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
          <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
          <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
        </g>
      </>
    ) : (
      <>
        {/* og'iz TINCH/yopiq — cho'zilgan snout (yechilgunga qadar belgi ko'rinmaydi) */}
        <path d="M66 35 Q92 31 116 40 Q124 42.5 123 47 Q121 51.5 114 50.5 Q92 52.5 66 50.5 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M66 36 Q92 32.5 114 41" stroke="#2e7a3e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M70 45.5 Q92 47.5 118 46" stroke="#256835" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M82 46 l2 3.2 l2 -3.2 Z M95 46.5 l2 3.2 l2 -3.2 Z M107 46.5 l1.8 3 l1.8 -3 Z" fill="#fff" stroke="#256835" strokeWidth=".5" strokeLinejoin="round" />
        <circle cx="118" cy="42.5" r="1.3" fill="#1f2430" opacity=".7" />
      </>
    )}

    {/* ko'z do'ngligi + tik qorachiqli ko'z + pirpiratish qopqog'i */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" />
  </svg>
);

// Bir son tomoni — bosiladigan tugma: katta raqam + razryad-strip (savatlar = o'nliklar, olmalar = birliklar).
// AVVAL o'nliklarni solishtiramiz: 3 savat vs 5 savat -> 5 ko'p. Idle harakat YO'Q (bosiladigan nishon).
const NumSide = ({ n, tens, units, sel, win, disabled, onPick, ariaLabel }) => (
  <button type="button" className={'pq-num' + (win ? ' win' : sel ? ' sel' : '')} disabled={disabled} onClick={onPick} aria-label={ariaLabel}>
    <span className="pq-nnum">{n}</span>
    <div className="pq-pv">
      <span className="pq-tens" aria-hidden="true">
        {Array.from({ length: tens }).map((_, k) => (<span key={k} className="pq-mini"><Basket w={17} /></span>))}
      </span>
      {units !== 0 && (
        <span className="pq-units" aria-hidden="true">
          {Array.from({ length: units }).map((_, k) => (<span key={k} className="pq-mini"><Apple w={11} /></span>))}
        </span>
      )}
    </div>
  </button>
);

export default function D22_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 38 | 53
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda g'alaba-reveal (og'iz ochilishi, chip, uchqun) qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.picked != null) setPicked(initialAnswer.studentAnswer.picked);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === BIG;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(LEFT), String(RIGHT)], studentAnswer: { picked }, correctAnswer: { picked: BIG }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const wrong = !!(feedback && !feedback.correct);
  const pick = (n) => { if (lock) return; setPicked(n); setFeedback(null); };
  // Timsoh harakati: yechilmagan holatda yengil suzish; noto'g'ridan keyin silkinish; still -> tinch.
  const crocMotion = still ? '' : (wrong ? ' shake' : ' float');
  const [fitRef, scale] = useFitScale(404);

  return (
    <div className="pq pq2210" ref={fitRef}>
      <style>{`
        .pq2210{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2210 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq2210 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq2210 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2210 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2210 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:266px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2210 .pq-fit{position:relative;margin:0 auto;}
        .pq2210 .pq-sun{position:absolute;right:18px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2210sun 3.6s ease-in-out infinite;}
        .pq2210 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:50px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2210 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2210 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2210 .pq-leaf{position:absolute;z-index:2;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq2210 .pq-leaf.l1{left:22%;top:-14px;animation:pq2210leaf 9s linear infinite;}
        .pq2210 .pq-leaf.l2{left:70%;top:-16px;animation:pq2210leaf 12s linear infinite;animation-delay:-5s;}

        .pq2210 .pq-arena{position:absolute;left:6px;right:6px;top:44px;bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:2px;padding:0 4px;z-index:3;}

        /* Bosiladigan son tugmasi — raqam + razryad-strip. Idle harakat YO'Q (tap aniq tegsin). */
        .pq2210 .pq-num{width:126px;padding:8px 6px 10px;border-radius:16px;border:3px solid #c7ddd0;background:linear-gradient(#ffffff,#eef6f1);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:.14s;font-family:inherit;box-shadow:0 4px 8px rgba(0,0,0,.1);}
        .pq2210 .pq-num:hover:not(:disabled){border-color:#8fc4a6;transform:translateY(-2px);}
        .pq2210 .pq-num:active:not(:disabled){transform:scale(.97);}
        .pq2210 .pq-num.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2210 .pq-num.win{border-color:#1a7f43;background:linear-gradient(#eefaf1,#dff3e7);box-shadow:0 0 0 3px rgba(26,127,67,.18),0 4px 8px rgba(0,0,0,.1);animation:pq2210cele .5s ease;}
        .pq2210 .pq-num:disabled{cursor:default;}
        .pq2210 .pq-nnum{font-size:34px;font-weight:900;color:#2e7a3e;font-variant-numeric:tabular-nums;line-height:1;}
        .pq2210 .pq-num.sel .pq-nnum{color:#2563eb;}
        .pq2210 .pq-num.win .pq-nnum{color:#1a7f43;}
        .pq2210 .pq-pv{display:flex;flex-direction:column;align-items:center;gap:3px;}
        .pq2210 .pq-tens{display:flex;flex-wrap:wrap;gap:2px;justify-content:center;max-width:114px;}
        .pq2210 .pq-units{display:flex;flex-wrap:wrap;gap:1px;justify-content:center;max-width:114px;padding-top:3px;border-top:2px dotted #cfe0cf;}
        .pq2210 .pq-mini{line-height:0;}

        .pq2210 .pq-croc-slot{position:relative;flex:0 0 auto;width:104px;display:flex;align-items:center;justify-content:center;}
        .pq2210 .pq-crocbox{filter:drop-shadow(0 3px 3px rgba(0,0,0,.24));}
        .pq2210 .pq-crocmotion.float{animation:pq2210float 3.6s ease-in-out infinite;}
        .pq2210 .pq-crocmotion.shake{animation:pq2210shake .42s ease-in-out 2;}
        .pq2210 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pq2210sway 3.4s ease-in-out infinite;}
        .pq2210 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq2210 .pq-jaws.chomping{animation:pq2210chomp .5s ease-in-out 3;}
        .pq2210 .pq-crocblink{opacity:0;animation:pq2210blink 4s linear infinite;}
        .pq2210 .pq-q{position:absolute;top:2px;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;background:#fff;border:2.5px solid #2e7a3e;color:#2e7a3e;font-size:19px;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 3px 6px rgba(0,0,0,.16);pointer-events:none;animation:pq2210q 1.8s ease-in-out infinite;}
        .pq2210 .pq-chip{position:absolute;top:-6px;left:50%;transform:translateX(-50%);font-size:19px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 13px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.24);z-index:6;white-space:nowrap;pointer-events:none;font-variant-numeric:tabular-nums;animation:pq2210chip .5s cubic-bezier(.3,1.5,.5,1) both;}

        .pq2210 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2210tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2210 .pq-spark.s2{animation-delay:-.6s;} .pq2210 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2210 .pq-scene.still .pq-chip,.pq2210 .pq-scene.still .pq-jaws.chomping,.pq2210 .pq-scene.still .pq-num.win,.pq2210 .pq-scene.still .pq-spark{animation:none;}
        .pq2210 .pq-scene.still .pq-spark{opacity:.9;}

        .pq2210 .pq-cmp{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:14px;animation:pq2210in .3s ease both;font-variant-numeric:tabular-nums;}
        .pq2210 .pq-cmp .pill{min-width:72px;height:46px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;}
        .pq2210 .pq-cmp .pill.win{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2210 .pq-gt{font-size:30px;font-weight:900;color:#1a7f43;}
        .pq2210 .pq-sub{text-align:center;margin-top:6px;font-size:13px;font-weight:800;color:#5c7a4a;font-variant-numeric:tabular-nums;animation:pq2210in .3s .1s both;}

        .pq2210 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2210in .22s ease both;}
        .pq2210 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2210 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2210sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2210leaf{0%{transform:translate(0,-14px) rotate(0);opacity:0;}12%{opacity:.85;}88%{opacity:.85;}100%{transform:translate(-26px,168px) rotate(210deg);opacity:0;}}
        @keyframes pq2210float{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pq2210shake{0%,100%{transform:translateX(0) rotate(0);}25%{transform:translateX(-5px) rotate(-3deg);}75%{transform:translateX(5px) rotate(3deg);}}
        @keyframes pq2210sway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2210chomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pq2210blink{0%,90%{opacity:0;}92%,95%{opacity:1;}97%,100%{opacity:0;}}
        @keyframes pq2210q{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.14);}}
        @keyframes pq2210chip{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2210tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2210cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2210in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 404 * scale, height: 266 * scale }}>
      <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>
        <span className="pq-leaf l1"><Leaf /></span>
        <span className="pq-leaf l2"><Leaf /></span>

        <div className="pq-arena">
          {/* CHAP — 38 = 3 savat (o'nlik) + 8 olma (birlik) */}
          <NumSide n={LEFT} tens={L_TENS} units={L_UNITS} sel={picked === LEFT && !ok} win={false}
            disabled={lock} onPick={() => pick(LEFT)} ariaLabel={String(LEFT)} />

          {/* MARKAZ — timsoh: yechilgunga qadar "?"; g'alabada og'iz KATTA son (53, o'ng) tomonga ochiladi */}
          <div className="pq-croc-slot">
            {ok ? <span className="pq-chip">{SIGN_STR}</span> : <span className="pq-q">?</span>}
            <div className="pq-crocbox">
              <div className={'pq-crocmotion' + crocMotion}><Croc chomp={!!ok} /></div>
            </div>
          </div>

          {/* O'NG — 53 = 5 savat (o'nlik) + 3 olma (birlik); katta son */}
          <NumSide n={RIGHT} tens={R_TENS} units={R_UNITS} sel={picked === RIGHT && !ok} win={!!ok}
            disabled={lock} onPick={() => pick(RIGHT)} ariaLabel={String(RIGHT)} />
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-cmp">
          <span className="pill">{LEFT}</span>
          <span className="pq-gt">{SIGN}</span>
          <span className="pill win">{RIGHT}</span>
        </div>
        <div className="pq-sub">{t.sub}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
