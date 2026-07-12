// Dars18 · Amaliyot 08 — Ko'p-tanlov «O'n to'rt qayerda?» · 🔴 · tag: cross_multi
// Olma bozori: 5 karta, har birida IKKI SAVAT olma (to'qilgan savatlar, olmalar 5 talik
// qatorda — sanash oson). Aynan O'N TO'RT (14) ga TENG bo'lganlarni BARCHASINI belgila.
// [0] "8 + 6" =14 ✓  [1] "9 + 5" =14 ✓  [2] "7 + 7" =14 ✓
// [3] "8 + 5" =13 ✗ tuzoq  [4] "9 + 6" =15 ✗ tuzoq. GOOD = {0,1,2}.
// G'ALABA SAHNASI (bosqichma-bosqich, sekin): to'g'ri kartalarda 2-savatdan olmalar
// BITTALAB 1-savatga uchib o'tadi (o'nlik to'ladi) → 1-savat ustida «10» yorlig'i →
// 2-savat ustida «+ N» yorlig'i → so'ng «= 14». Review'da animatsiya qayta o'ynamaydi.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry bor; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 14;
const TEN = 10;
// Har karta: a ta + b ta olma. a + b qiymati.
const CARDS = [
  { a: 8, b: 6 }, // 8 + 6 = 14 ✓
  { a: 9, b: 5 }, // 9 + 5 = 14 ✓
  { a: 7, b: 7 }, // 7 + 7 = 14 ✓
  { a: 8, b: 5 }, // 8 + 5 = 13 ✗ tuzoq
  { a: 9, b: 6 }, // 9 + 6 = 15 ✗ tuzoq
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} + ${c.b}`;

const DATA = { good: [0, 1, 2], target: TARGET, ptype: 'P13', level: '🔴', tag: 'cross_multi' };

// Olma rang palitrasi (2-ton: yorug' tana / to'q chet). Qizil va yashil aylanma.
const PAL = [
  { c: '#e2635b', d: '#c23f37' }, // qizil
  { c: '#6cbf5f', d: '#3d8038' }, // yashil
  { c: '#e2635b', d: '#c23f37' }, // qizil
  { c: '#6cbf5f', d: '#3d8038' }, // yashil
  { c: '#e88a4a', d: '#c26a29' }, // sarg'ish
];

const T = {
  uz: {
    eyebrow: "Olma bozori · O'n to'rt",
    title: "O'n to'rt qayerda?",
    setup: "Rastadagi har kartada ikki savat olma bor — qo'shsangiz turlicha son chiqadi.",
    ask: "Aynan O'N TO'RT bo'ladigan BARCHA kartani bosing.",
    correct: "Barakalla! Sakkiz va olti, to'qqiz va besh, yetti va yetti — hammasi o'n to'rt.",
    hint: "Har kartada avval birinchi savatni o'ngacha to'ldiring, keyin qolganini qo'shing. Qaysilarida o'n to'rt chiqadi — o'shalarni tanlang.",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Четырнадцать',
    title: 'Где четырнадцать?',
    setup: 'На каждой карточке на прилавке две корзины яблок — если сложить, получаются разные числа.',
    ask: 'Нажми на ВСЕ карточки, где получается ровно ЧЕТЫРНАДЦАТЬ.',
    correct: 'Молодец! Восемь и шесть, девять и пять, семь и семь — всюду четырнадцать.',
    hint: 'Сначала дополни первую корзину до десяти, потом прибавь остаток. Выбери те карточки, где выходит четырнадцать.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — 2-ton doira + oq blik + tepada jigarrang
// bandcha + yashil barg. Bitta olma = bitta birlik. Rang palitradan (qizil/yashil).
const Apple = ({ c = '#e2635b', d = '#c23f37', w = 13 }) => (
  <svg viewBox="0 0 24 26" width={w} height={(w * 26) / 24} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 6 Q12 3 10 1.5" fill="none" stroke="#7a4a22" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12.4 5.4 Q16 2.6 18.6 4.8 Q15.4 7 12.4 5.9 Z" fill="#57a84f" />
    <path d="M12 6 C7 6 4 9.5 4 14.5 C4 19.5 8 24 12 24 C16 24 20 19.5 20 14.5 C20 9.5 17 6 12 6 Z" fill={d} />
    <path d="M12 7.4 C8.2 7.4 6 10.4 6 14.4 C6 18.4 9 22.4 12 22.4 C13 22.4 13.6 21.8 13.2 20.6 C11 15 11.4 10 13.6 7.7 C13.2 7.5 12.6 7.4 12 7.4 Z" fill={c} />
    <ellipse cx="9.4" cy="11.4" rx="2.3" ry="1.5" fill="#ffffff" opacity="0.55" transform="rotate(-30 9.4 11.4)" />
  </svg>
);

// TO'QILGAN SAVAT (rasm so'zga mos: «savat» = korzina). body — orqa qatlam, Lip — old labi
// (olmalar savat ICHIDA turgani ko'rinsin uchun olmalar ustidan chiziladi).
const BasketBody = () => (
  <svg viewBox="0 0 66 30" width="66" height="30" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M5 7 L61 7 L55 26 Q33 30.5 11 26 Z" fill="#c98a4e" stroke="#8a5628" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M7 13 Q33 16.5 59 13" fill="none" stroke="#a5713a" strokeWidth="1.5" />
    <path d="M9 19 Q33 22.5 57 19" fill="none" stroke="#a5713a" strokeWidth="1.5" />
    <path d="M17 8 Q19 17 20 26.5" fill="none" stroke="#b07c42" strokeWidth="1.3" />
    <path d="M31 8 Q32 17 32.5 27.5" fill="none" stroke="#b07c42" strokeWidth="1.3" />
    <path d="M45 8 Q44 17 43.5 27" fill="none" stroke="#b07c42" strokeWidth="1.3" />
  </svg>
);
const BasketLip = () => (
  <svg viewBox="0 0 66 10" width="66" height="10" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="1.5" y="1.5" width="63" height="7" rx="3.5" fill="#b07c42" stroke="#8a5628" strokeWidth="1.6" />
    <path d="M8 1.8 L11 8.2 M18 1.8 L21 8.2 M28 1.8 L31 8.2 M38 1.8 L41 8.2 M48 1.8 L51 8.2 M56 1.8 L59 8.2" stroke="#8a5628" strokeWidth="1.1" opacity=".55" />
  </svg>
);

// «14» KALIT: oltin medalyon, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetKey = () => (
  <svg viewBox="0 0 66 46" width="60" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="60" height="34" rx="13" fill="#f2b134" stroke="#c08517" strokeWidth="2.4" />
    <rect x="9" y="10" width="26" height="9" rx="5" fill="#f8d47f" opacity="0.9" />
    <text x="33" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">14</text>
    <polygon className="pq-glint" points="51,10 52.4,14 56.4,15.4 52.4,16.8 51,20.8 49.6,16.8 45.6,15.4 49.6,14" fill="#fff" />
  </svg>
);

// Chodir-soyabon (bozor dekori): qizil-oq yo'l qalpoq; sekin tebranadi.
const Awning = () => (
  <svg viewBox="0 0 60 30" width="52" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M2 4 H58 V10 Q52 18 46 10 Q40 18 34 10 Q28 18 22 10 Q16 18 10 10 Q6 15 2 12 Z" fill="#d9534b" />
    <path d="M14 4 V10 Q11 15 8 12 V4 Z M26 4 V10 Q23 18 22 10 V4 Z M38 4 V10 Q35 18 34 10 V4 Z M50 4 V10 Q47 18 46 10 V4 Z" fill="#f6f3ea" />
    <rect x="2" y="2" width="56" height="3.5" rx="1.6" fill="#b8433b" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

// Karta-sahna geometriyasi (px): 2 savat, olmalar 5 talik qatorlarda savat og'zida.
const CW = 178, CH = 106;          // karta-kanvas
const BXA = 45, BXB = 133;         // savat markazlari
const BASKET_TOP = 70;             // savat tepasi (olmalar pastki qatori labga kirib turadi)
const APW = 13, APH = 14;          // olma o'lchami
const slotPos = (cx, i) => ({ x: cx - 31 + (i % 5) * 12.5, y: 62 - Math.floor(i / 5) * 12 });
// Animatsiya tezligi (sekin, bittalab): har ko'chish .7s oraliqda, .6s davom etadi.
const STEP = 0.7, MOVE = 0.6;

export default function D18_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review/qayta ochilishda ko'chish-animatsiyasi qayta o'ynamaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(cardLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  // Bitta karta-kanvas: 2 savat + olmalar. winGood=true bo'lsa bosqichli make-ten sahna.
  const canvas = (c, ci, winGood) => {
    const gap = TEN - c.a;            // 1-savatni o'ngacha to'ldirish uchun kerak
    const over = c.b - gap;           // 2-savatda qoladigan ortiqcha
    const dA = gap * STEP + MOVE + 0.2;   // «10» yorlig'i — ko'chishlar tugagach
    const dB = dA + 0.7;                  // «+ N» yorlig'i — undan keyin
    const apples = [];
    // 1-savat olmalari (statik).
    for (let i = 0; i < c.a; i++) {
      const p = slotPos(BXA, i);
      const pal = PAL[i % PAL.length];
      apples.push(<span key={`a${i}`} className="pq-apl" style={{ left: p.x, top: p.y }}><Apple c={pal.c} d={pal.d} /></span>);
    }
    // 2-savat olmalari: g'alabada eng tepadagilari BITTALAB 1-savatga ko'chadi.
    for (let i = 0; i < c.b; i++) {
      const pal = PAL[(c.a + i) % PAL.length];
      const moved = winGood && i >= over;           // ko'chadiganlar — pila tepasidagilar
      const k = moved ? (c.b - 1 - i) : 0;          // ko'chish tartibi: eng tepadagisi birinchi
      const p = moved ? slotPos(BXA, c.a + k) : slotPos(BXB, i);
      apples.push(
        <span key={`b${i}`} className={'pq-apl' + (moved && !still ? ' mv' : '')}
          style={{ left: p.x, top: p.y, transitionDelay: moved && !still ? `${k * STEP}s` : undefined }}>
          <Apple c={pal.c} d={pal.d} />
        </span>
      );
    }
    return (
      <div className="pq-canvas" style={{ width: CW, height: CH }}>
        <span className="pq-bskt" style={{ left: BXA - 33, top: BASKET_TOP }}><BasketBody /></span>
        <span className="pq-bskt" style={{ left: BXB - 33, top: BASKET_TOP }}><BasketBody /></span>
        {apples}
        <span className="pq-bskt lip" style={{ left: BXA - 33, top: BASKET_TOP }}><BasketLip /></span>
        <span className="pq-bskt lip" style={{ left: BXB - 33, top: BASKET_TOP }}><BasketLip /></span>
        <span className="pq-cplus">+</span>
        {winGood && (<>
          <span className="pq-badge ten" style={{ left: BXA - 16, animationDelay: still ? '0s' : `${dA}s` }}>{TEN}</span>
          <span className="pq-badge ovr" style={{ left: BXB - 18, animationDelay: still ? '0s' : `${dB}s` }}>+ {over}</span>
        </>)}
      </div>
    );
  };

  return (
    <div className="pq pq1808">
      <style>{`
        .pq1808{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1808 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1808 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1808 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1808 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq1808 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#eaf6e0,#dcecc9);border:2px solid #cadfb0;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq1808 .pq-shelf{position:relative;height:66px;background:linear-gradient(#d9b785,#c69c62 68%,#b88a50);border-bottom:3px solid #9a7440;box-shadow:inset 0 -2px 3px rgba(120,80,30,.25);}
        .pq1808 .pq-keyw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);line-height:0;z-index:3;}
        .pq1808 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(120,80,20,.32));}
        .pq1808 .pq-keybr.win{animation:pqCele .6s ease;}
        .pq1808 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.4s ease-in-out infinite;}
        .pq1808 .pq-awn{position:absolute;top:-2px;left:22px;transform-origin:top center;animation:pqSwing 4.2s ease-in-out infinite;z-index:2;}
        .pq1808 .pq-sun{position:absolute;right:22px;top:12px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}

        .pq1808 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 8px;}
        .pq1808 .pq-card{position:relative;min-width:190px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:11px 10px 11px;border-radius:16px;border:2.5px solid #d3e3b4;background:#fffdf8;color:#3a3320;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(110,140,50,.12);font-family:inherit;}
        .pq1808 .pq-card:hover:not(:disabled){border-color:#a8cc78;transform:translateY(-2px);box-shadow:0 5px 12px rgba(110,140,50,.2);}
        .pq1808 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq1808 .pq-card:disabled{cursor:default;}
        .pq1808 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq1808 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;}
        .pq1808 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        /* karta-kanvas: savatlar + olmalar (absolut pozitsiyalar, sanash oson 5 talik qator) */
        .pq1808 .pq-canvas{position:relative;flex:0 0 auto;}
        .pq1808 .pq-bskt{position:absolute;line-height:0;z-index:1;}
        .pq1808 .pq-bskt.lip{z-index:3;}
        .pq1808 .pq-apl{position:absolute;width:${APW}px;height:${APH}px;line-height:0;z-index:2;transition:left ${MOVE}s ease, top ${MOVE}s ease;}
        .pq1808 .pq-apl.mv{z-index:4;}
        .pq1808 .pq-cplus{position:absolute;left:82px;top:56px;font-size:22px;font-weight:900;color:#7fa054;z-index:2;}
        .pq1808 .pq-badge{position:absolute;top:16px;z-index:5;padding:1px 8px;border-radius:999px;font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;animation:pqPop .45s ease both;white-space:nowrap;}
        .pq1808 .pq-badge.ten{background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;}
        .pq1808 .pq-badge.ovr{background:#fff6e4;border:2px solid #c9822f;color:#a05a1f;}

        .pq1808 .pq-clabel{display:flex;align-items:center;gap:9px;font-size:22px;font-weight:900;color:#4a5a2c;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq1808 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq1808 .pq-eq{color:#1a7f43;font-size:18px;font-weight:900;animation:pqPop .4s ease both;}
        .pq1808 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq1808 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1808 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1808 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-shelf">
          <span className="pq-awn"><Awning /></span>
          <span className="pq-keyw"><span className={'pq-keybr' + (ok ? ' win' : '')}><TargetKey /></span></span>
          <span className="pq-sun" />
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            const gap = TEN - c.a;
            const dEq = still ? 0 : gap * STEP + MOVE + 1.6; // «= 14» — yorliqlardan keyin
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                {canvas(c, i, !!(ok && good))}
                <div className="pq-clabel">
                  <span>{cardLabel(c)}</span>
                  {ok && good && <b className="pq-eq" style={{ animationDelay: `${dEq}s` }}>= {TARGET}</b>}
                </div>
                {ok && good && <span className="pq-spark" style={{ animationDelay: still ? '0s' : `${dEq}s` }}><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
