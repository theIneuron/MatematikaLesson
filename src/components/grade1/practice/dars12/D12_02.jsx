// Dars12 · Amaliyot 02 — P4 Belgini tanla «7 ▢ 5» · 🟡 · timsoh · tag: pick_sign
// Timsoh og'zi kattaroq son tomonga ochiladi: 7 > 5 (chapga). Веди-до-верного, ozvuchkasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { a: 7, b: 5, target: '>', options: ['>', '<', '='], ptype: 'P4', level: '🟡', tag: 'pick_sign' };
const T = {
  uz: {
    eyebrow: 'Timsohlar ko\'li · Belgi', title: 'Belgini tanla',
    setup: 'Timsoh yana taqqoslamoqchi: chapda yetti, o\'ngda besh.',
    ask: 'Bo\'sh joyga qaysi belgi qo\'yiladi?',
    correct: 'Barakalla! Yetti beshdan katta — timsoh chapga og\'iz ochdi.',
    hint: 'Kattaroq sonni toping. Timsoh og\'zi shu tomonga ochiladi.',
  },
  ru: {
    eyebrow: 'Озеро крокодилов · Знак', title: 'Выбери знак',
    setup: 'Крокодил снова хочет сравнить: слева семь, справа пять.',
    ask: 'Какой знак поставить в пустое окошко?',
    correct: 'Молодец! Семь больше пяти — крокодил открыл пасть влево.',
    hint: 'Найди большее число. Крокодил открывает пасть в эту сторону.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan timsoh (D04_10 kanoni): cho'zilgan yashil tana (uch ton), tikanli scute-orqa,
// panjali oyoq, ochiq jag' (zigzag oq tishlar, pushti og'iz ichi), blikli ko'z.
// open=true — yuqori jag' ko'tarilgan (og'iz «<» / «>» shaklida ochiq). open=false — jag' yopiq/tinch.
// chomp — g'alabada baliq chaynash animatsiyasi. Wrapper faceL bilan chapga (kattaroq son tomon) buriladi.
const Croc = ({ open, chomp }) => (
  <svg viewBox="0 0 132 72" width="122" height="66" aria-hidden="true" style={{ display: 'block' }}>
    {/* dum — kuchli egilgan, uchi yuqoriga qayrilgan; sekin tebranadi */}
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    {/* uzoq tomondagi oyoqlar (to'qroq) */}
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    {/* cho'zilgan tana */}
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    {/* orqa — to'q ton */}
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    {/* yon osteoderm-dog'lar */}
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    {/* qorin — och-sariq-yashil, ko'ndalang chiziqli; sekin nafas oladi */}
    <ellipse className="pq-crocbelly" cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* orqadagi scute-tikan qatorlari */}
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    {/* yaqin tomondagi oyoqlar — panjali */}
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    {/* bosh suyagi — tana bilan jag' bo'g'imi orasi */}
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />
    {open ? (
      <>
        {/* og'iz OCHIQ — jag'lar «<»/«>» belgisini eslatadi (katta son tomonga) */}
        <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
        {/* pastki jag' — och tomog' toni, zigzag tishlar yuqoriga */}
        <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
        {/* yuqori jag' — ochiq holatda ko'tarilgan */}
        <g className={'pq-jaws' + (chomp ? ' chomping' : '')}>
          <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
          <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
          <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
        </g>
      </>
    ) : (
      <>
        {/* og'iz TINCH/YOPIQ — teng poza (D12_01 idle snout): ikki parallel jag' chizig'i «=» metaforasi */}
        <path d="M66 35 Q92 31 116 40 Q124 42.5 123 47 Q121 51.5 114 50.5 Q92 52.5 66 50.5 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M66 36 Q92 32.5 114 41" stroke="#2e7a3e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M70 45.5 Q92 47.5 118 46" stroke="#256835" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M82 46 l2 3.2 l2 -3.2 Z M95 46.5 l2 3.2 l2 -3.2 Z M107 46.5 l1.8 3 l1.8 -3 Z" fill="#fff" stroke="#256835" strokeWidth=".5" strokeLinejoin="round" />
        <circle cx="118" cy="42.5" r="1.3" fill="#1f2430" opacity=".7" />
      </>
    )}
    {/* ko'z do'ngligi + tik qorachiqli ko'z (blik bilan) */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    {/* qovoq — vaqti-vaqti bilan pirpiratadi */}
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
  </svg>
);

// QAMISH: 2 poya + qo'ng'ir boshoq, pastdan sway; yonida o't-tuflar.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="30" height="56" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <g className="pq-reed" style={{ '--rd': '0s' }}>
      <path d="M10 74 Q9 40 12 18" stroke="#3c7d36" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="12.5" cy="13" rx="3.4" ry="8" fill="#8a5f3a" stroke="#6d4526" strokeWidth="1" />
    </g>
    <g className="pq-reed" style={{ '--rd': '-1.3s' }}>
      <path d="M25 74 Q25 46 21 27" stroke="#4f9a48" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="20.5" cy="22.5" rx="3" ry="7" fill="#9a6b40" stroke="#6d4526" strokeWidth="1" />
    </g>
    <path d="M2 74 q3 -12 6 -1 M32 74 q3 -14 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
);

// NINACHI: kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish traektoriyasi CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="34" height="21" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse className="pq-dwing" cx="18" cy="8" rx="12" ry="4" fill="#cfe9fb" transform="rotate(-18 18 8)" />
    <ellipse className="pq-dwing w2" cx="26" cy="8" rx="12" ry="4" fill="#dff1fd" transform="rotate(14 26 8)" />
    <ellipse className="pq-dwing w3" cx="18" cy="19" rx="11" ry="3.6" fill="#cfe9fb" transform="rotate(16 18 19)" />
    <ellipse className="pq-dwing w4" cx="26" cy="19" rx="11" ry="3.6" fill="#dff1fd" transform="rotate(-12 26 19)" />
    <path d="M33 13.5 L9 13.5" stroke="#4f8fc4" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 13.5 L13 13.5" stroke="#33648f" strokeWidth="1" opacity=".5" />
    <circle cx="36" cy="13.5" r="3.6" fill="#4f8fc4" stroke="#33648f" strokeWidth="1.2" />
    <circle cx="37.6" cy="12.2" r="1" fill="#1f2430" />
  </svg>
);

// Baliq — lip etib sakrash (dekor, sanalmaydi).
const Fish = () => (
  <svg viewBox="0 0 34 20" width="28" height="16" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D12_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // '>' | '<' | '='
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.sign != null) setPicked(initialAnswer.studentAnswer.sign);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const lock = isReview || checked;
  const pick = (s) => { if (lock) return; setPicked(s); setFeedback(null); };

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { sign: picked }, correctAnswer: { sign: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // Timsoh og'zi KATTAROQ son tomonga ochiladi: '>' — chapga (faceL), '<' — o'ngga (asos).
  const faceL = picked === '>';
  const open = picked === '>' || picked === '<';
  const bigLeft = DATA.a > DATA.b; // 7 > 5 — chap karta kattaroq
  const winExpr = `${DATA.a} ${DATA.target} ${DATA.b}`;

  return (
    <div className="pq pq1202">
      <style>{`
        .pq1202{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1202 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1202 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1202 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1202 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1202 .pq-stage{display:flex;justify-content:center;padding:10px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq1202 .pq-scene{position:relative;width:372px;max-width:100%;height:210px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 44%,#d6eef5 58%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq1202 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1202 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1202 .pq-cloud.c1{top:14px;left:-70px;animation-duration:31s;animation-delay:-12s;}
        .pq1202 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:41s;animation-delay:-27s;}
        .pq1202 .pq-water{position:absolute;left:0;right:0;bottom:0;height:118px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq1202 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq1202 .pq-shore{position:absolute;bottom:0;width:74px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq1202 .pq-shore.l{left:0;border-radius:0 24px 0 0;}
        .pq1202 .pq-shore.r{right:0;border-radius:24px 0 0 0;}
        .pq1202 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1202 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1202 .pq-dflyw{position:absolute;left:30px;top:34px;line-height:0;z-index:3;animation:pqDfly 14s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1202 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;transform-box:fill-box;}
        .pq1202 .pq-dwing.w2{animation-delay:-.08s;} .pq1202 .pq-dwing.w3{animation-delay:-.14s;} .pq1202 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1202 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq1202 .pq-ring.r2{animation-delay:-1.9s;}
        .pq1202 .pq-fishw{position:absolute;right:52px;bottom:38px;line-height:0;z-index:2;opacity:0;animation:pqFish 10s ease-in-out infinite;}

        .pq1202 .pq-compare{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;gap:12px;justify-content:center;align-items:center;z-index:4;}
        .pq1202 .pq-scene:not(.still) .pq-compare{animation:pqIn .5s ease both;}
        .pq1202 .pq-num{position:relative;width:62px;height:76px;border-radius:16px;background:linear-gradient(#ffffff,#eef4fc);border:3px solid #cdd8ea;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:900;color:#2b3550;font-variant-numeric:tabular-nums;box-shadow:0 5px 12px rgba(31,54,86,.18);animation:pqCardBob 3s ease-in-out infinite;}
        .pq1202 .pq-num.r{animation-delay:-1.5s;}
        .pq1202 .pq-num.win{border-color:#1a7f43;background:linear-gradient(#eafaf0,#d3f1e0);color:#1a7f43;animation:pqCardBob 3s ease-in-out infinite,pqCele .6s ease;}
        .pq1202 .pq-slotwrap{position:relative;display:flex;flex-direction:column;align-items:center;}
        .pq1202 .pq-slot{width:58px;height:72px;border-radius:16px;border:3px dashed #b3c4dd;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;color:#93a6c1;background:rgba(255,255,255,.55);animation:pqBreath 2.3s ease-in-out infinite;line-height:1;}
        .pq1202 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#fff;animation:pqSlotIn .35s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1202 .pq-slot.win{border-color:#1a7f43;color:#1a7f43;background:#eafaf0;}
        .pq1202 .pq-crocbox{position:absolute;bottom:-4px;left:50%;transform:translateX(-50%) translateY(58px);z-index:3;transition:transform .5s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));pointer-events:none;}
        .pq1202 .pq-crocbox.faceL{transform:translateX(-50%) translateY(58px) scaleX(-1);}
        .pq1202 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqSway 3.4s ease-in-out infinite;}
        .pq1202 .pq-crocbelly{transform-box:fill-box;transform-origin:50% 50%;animation:pqBelly 3s ease-in-out infinite;}
        .pq1202 .pq-crocblink{transform-box:fill-box;transform-origin:50% 20%;opacity:0;animation:pqCBlink 4.2s ease-in-out infinite;}
        .pq1202 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;transition:transform .45s cubic-bezier(.4,1.3,.5,1);}
        .pq1202 .pq-jaws.closed{transform:rotate(38deg);}
        .pq1202 .pq-jaws.chomping{animation:pqChomp .5s ease-in-out 2;}
        .pq1202 .pq-scene.still .pq-crocbox,.pq1202 .pq-scene.still .pq-jaws{transition:none;}
        .pq1202 .pq-scene.still .pq-jaws.chomping{animation:none;}
        .pq1202 .pq-scene.still .pq-slot.has{animation:none;}
        .pq1202 .pq-scene.still .pq-num.win{animation:pqCardBob 3s ease-in-out infinite;}

        .pq1202 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1202 .pq-star.s2{animation-delay:-.5s;} .pq1202 .pq-star.s3{animation-delay:-1.05s;}

        .pq1202 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:16px;}
        .pq1202 .pq-opt{width:76px;height:70px;font-size:38px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;line-height:1;transition:.12s;}
        .pq1202 .pq-opt:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq1202 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1202 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1202 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1202 .pq-opt:disabled{cursor:default;}

        .pq1202 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1202 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1202 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(60px,-12px) rotate(6deg);}50%{transform:translate(120px,16px) rotate(-4deg);}75%{transform:translate(46px,28px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(44px,18px) rotate(56deg);}}
        @keyframes pqCardBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#b3c4dd;}50%{transform:scale(1.06);border-color:#98abc8;}}
        @keyframes pqSlotIn{0%{transform:scale(.55);}100%{transform:scale(1);}}
        @keyframes pqBelly{0%,100%{transform:scaleY(1);}50%{transform:scaleY(1.07);}}
        @keyframes pqCBlink{0%,90%{opacity:0;transform:scaleY(0);}93%,96%{opacity:1;transform:scaleY(1);}100%{opacity:0;transform:scaleY(0);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(15deg);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-water" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-reedw" style={{ left: 4, bottom: 90 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 4, bottom: 84 }}><Reeds flip /></span>
          <span className="pq-ring" style={{ left: 70, bottom: 26 }} />
          <span className="pq-ring r2" style={{ left: 250, bottom: 44 }} />
          <span className="pq-fishw"><Fish /></span>
          <span className="pq-dflyw"><Dragonfly /></span>

          <div className="pq-compare">
            <div className={'pq-num' + (ok && bigLeft ? ' win' : '')}>{DATA.a}</div>

            <div className="pq-slotwrap">
              <div className={'pq-slot' + (picked ? ' has' : '') + (ok ? ' win' : '')}>{picked || '?'}</div>
              <div className={'pq-crocbox' + (faceL ? ' faceL' : '')}>
                <Croc open={open} chomp={!!ok} />
              </div>
            </div>

            <div className={'pq-num r' + (ok && !bigLeft ? ' win' : '')}>{DATA.b}</div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '34%', top: '30px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s2" style={{ left: '60%', top: '44px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-star s3" style={{ left: '48%', top: '18px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((s) => {
          const sel = picked === s; const right = ok && s === DATA.target;
          return <button key={s} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick(s)}>{s}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}{ok ? ` (${winExpr})` : ''}</span></div>)}
    </div>
  );
}
