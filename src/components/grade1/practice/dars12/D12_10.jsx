// Dars12 · Amaliyot 10 — YANGI kreativ «Qavs qutisi» · 🔴 · timsoh · tag: parens_box
// IKKI BOSQICHLI: (1) bola «Hisobla» tugmasini bosadi → yog'och qavs-qutisi yopiladi, 4+2
// tushib «6» chiqadi (computed). (2) belgi-tugmalar [> < =] faollashadi — bola «>» ni tanlaydi.
// G'alabada: timsoh chapga (kattaga=6) og'iz ochib chomp qiladi, «(4 + 2) > 5».
// Timsoh-kanon (D04_10) + ko'l-sahna (D09_06). Веди-до-верного, ozvuchkasiz. Belgilar U+003E/3C/3D.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 4, B = 2, C = 5;
const SUM = A + B; // 6
const SIGNS = ['>', '<', '='];
const TARGET = '>';
const faceDir = TARGET === '>' ? 'L' : TARGET === '<' ? 'R' : 'E'; // timsoh og'zi kattaga qaraydi
const DATA = { a: A, b: B, sum: SUM, c: C, target: TARGET, options: SIGNS, ptype: 'NEW', level: '🔴', tag: 'parens_box' };
const T = {
  uz: {
    eyebrow: "Timsohlar ko'li · Qavs qutisi", title: "Qavs qutisi",
    setup: "Yozuvda qavs bor: «(to'rt qo'shuv ikki) va besh». Avval qavs qutisini hisoblang!",
    ask: "«Hisobla» tugmasini bosing, keyin to'g'ri belgini tanlang.",
    correct: "Barakalla! Qavs ichi — olti. Olti beshdan katta, timsoh chapga og'iz ochdi!",
    hint: "Qavs qutisi olti chiqardi. Endi olti va beshni solishtiring: qaysi katta?",
    btnCompute: "Hisobla",
  },
  ru: {
    eyebrow: "Озеро крокодилов · Коробка со скобками", title: "Коробка со скобками",
    setup: "В записи есть скобки: «(четыре плюс два) и пять». Сначала вычисли коробку со скобками!",
    ask: "Нажми кнопку «Вычисли», потом выбери верный знак.",
    correct: "Молодец! В скобках — шесть. Шесть больше пяти, крокодил открыл пасть влево!",
    hint: "Коробка со скобками дала шесть. Теперь сравни шесть и пять: какое больше?",
    btnCompute: "Вычисли",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TIMSOH KANONI (D04_10): cho'zilgan yashil tana (3 ton), tikanli scute-orqa, panjali oyoq,
// ochiq jag' (zigzag oq tishlar, pushti og'iz ichi), blikli ko'z (pirpiratadi), dum sway.
// Og'zi = taqqoslash belgisi metaforasi. chomp=false: og'iz tinch-ochiq (kutish); chomp=true: kattani yeydi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="104" height="57" aria-hidden="true" style={{ display: 'block' }}>
    {/* dum — kuchli egilgan, sekin tebranadi */}
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
    {/* qorin — ko'ndalang chiziqli, yengil puls */}
    <ellipse className="pq-cthroat" cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
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
    {/* bosh suyagi */}
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />
    {/* og'iz ichi — och-pushti */}
    <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
    {/* pastki jag' — zigzag tishlar yuqoriga */}
    <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
    {/* yuqori jag' — pqChomp shu guruhda */}
    <g className={chomp ? 'pq-jaws chomping' : 'pq-jaws'}>
      <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
      <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
      <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
    </g>
    {/* ko'z do'ngligi + tik qorachiqli ko'z + blik; pirpiratish uchun ustidan yashil qopqoq */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-cblink" cx="63" cy="28.5" r="6.2" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
  </svg>
);

// QAMISH (D09_06 kanoni): 2 poya + qo'ng'ir boshoq, pastdan sway.
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

// NINACHI (D09_06 kanoni): tana + 2 juft shaffof qanot (pirillaydi).
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

// NILUFAR BARGI (D12_05 kanoni): V-o'yiqli yumaloq barg + tomirlar; pink=true bo'lsa ustida gul.
const Lily = ({ pink }) => (
  <svg viewBox="0 0 52 32" width="46" height="28" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M26 3 Q47 4 48 17 Q47 29 26 29 Q18 29 14 24 L24 16.5 L14 9 Q18 3.5 26 3 Z" fill="#4f9a48" stroke="#3c7d36" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M40 10 Q44 17 40 24 M33 8 Q36 17 33 26 M27 6.5 Q29 17 27 27.5" stroke="#3c7d36" strokeWidth="1" fill="none" opacity=".5" />
    <path d="M30 8 Q40 8 42 15 Q35 12 30 13 Z" fill="#68bd60" opacity=".5" />
    {pink && (
      <g>
        <path d="M30 10.5 Q32 14 30 16 Q28 14 30 10.5 M35.5 16 Q32 18 30 16 Q32 14 35.5 16 M30 21.5 Q28 18 30 16 Q32 18 30 21.5 M24.5 16 Q28 14 30 16 Q28 18 24.5 16" fill="#f6c9dc" />
        <circle cx="30" cy="16" r="2" fill="#f2d24a" />
      </g>
    )}
  </svg>
);

export default function D12_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [computed, setComputed] = useState(false); // 1-bosqich: qavs qutisi hisoblandi
  const [picked, setPicked] = useState(null);      // 2-bosqich: belgi tanlandi
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda quti-yopilish/«6» pop qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.computed) setComputed(true);
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(computed && picked !== null && !checked); }, [computed, picked, checked, onReady]);

  const lock = isReview || checked;
  const doCompute = () => { if (computed || lock) return; setComputed(true); setFeedback(null); };
  const pick = (s) => { if (!computed || lock) return; setPicked(s); setFeedback(null); };

  const check = useCallback(() => {
    if (!computed || picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: SIGNS, studentAnswer: { value: picked, computed: true }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [computed, picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1210">
      <style>{`
        .pq1210{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1210 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1210 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1210 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1210 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        /* KO'L SAHNASI */
        .pq1210 .pq-lake{position:relative;height:212px;max-width:544px;margin:0 auto;border-radius:24px;overflow:hidden;border:3px solid #b6dcd0;background:linear-gradient(#cfeee6 0%,#a6dcd8 48%,#7cc4c6 100%);box-shadow:inset 0 2px 10px rgba(0,0,0,.06);}
        .pq1210 .pq-sun{position:absolute;top:12px;right:16px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1210 .pq-cloud{position:absolute;width:50px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1210 .pq-cloud.c1{top:16px;left:-70px;animation-duration:31s;animation-delay:-8s;}
        .pq1210 .pq-cloud.c2{top:40px;left:-70px;width:36px;height:11px;opacity:.7;animation-duration:41s;animation-delay:-26s;}
        .pq1210 .pq-reedw{position:absolute;bottom:0;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1210 .pq-reedw.l{left:4px;} .pq1210 .pq-reedw.r{right:4px;}
        .pq1210 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1210 .pq-lily{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.1));animation:pqFloat 5.5s ease-in-out infinite;}
        .pq1210 .pq-lily.y1{left:40px;bottom:14px;} .pq1210 .pq-lily.y2{right:70px;bottom:9px;animation-delay:-2.4s;transform:scaleX(-1);}
        .pq1210 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pqRing 4s ease-out infinite;}
        .pq1210 .pq-ring.a{left:118px;bottom:32px;} .pq1210 .pq-ring.b{right:118px;bottom:50px;animation-delay:-2s;}
        .pq1210 .pq-dflyw{position:absolute;left:66px;top:18px;line-height:0;z-index:3;animation:pqDfly 14s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1210 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1210 .pq-dwing.w2{animation-delay:-.08s;} .pq1210 .pq-dwing.w3{animation-delay:-.14s;} .pq1210 .pq-dwing.w4{animation-delay:-.05s;}
        /* Taqqoslash qatori */
        .pq1210 .pq-cmp{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 12px;z-index:4;}
        /* Qavs qutisi (yog'och) */
        .pq1210 .pq-box{position:relative;flex-shrink:0;}
        .pq1210 .pq-boxlid{position:absolute;top:-3px;left:5px;right:5px;height:12px;border-radius:7px 7px 3px 3px;background:linear-gradient(#e9bd8d,#cf975f);border:2.5px solid #9c6b3a;transform-origin:50% 100%;transform:rotate(-52deg);transition:transform .45s cubic-bezier(.34,1.35,.5,1);z-index:3;}
        .pq1210 .pq-box.sealed .pq-boxlid{transform:rotate(0deg);}
        .pq1210 .pq-boxbody{position:relative;display:flex;align-items:center;gap:1px;padding:11px 9px 12px;border-radius:13px;background:linear-gradient(#e9bd8d,#d19a63);border:3px solid #9c6b3a;box-shadow:inset 0 -6px 10px rgba(120,70,30,.28),inset 0 3px 6px rgba(255,240,215,.5),0 4px 8px rgba(0,0,0,.16);}
        .pq1210 .pq-boxbody::before{content:'';position:absolute;left:6px;right:6px;top:50%;height:2px;transform:translateY(-50%);background:repeating-linear-gradient(90deg,transparent 0 7px,rgba(120,70,30,.16) 7px 8px);pointer-events:none;}
        .pq1210 .pq-box.sealed:not(.still) .pq-boxbody{animation:pqBoxSeal .5s ease;}
        .pq1210 .pq-nail{position:absolute;width:4px;height:4px;border-radius:50%;background:#8a5a2c;box-shadow:inset 0 1px 1px rgba(255,240,215,.5);}
        .pq1210 .pq-nail.n1{top:6px;left:6px;} .pq1210 .pq-nail.n2{top:6px;right:6px;}
        .pq1210 .pq-nail.n3{bottom:6px;left:6px;} .pq1210 .pq-nail.n4{bottom:6px;right:6px;}
        .pq1210 .pq-clasp{position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);width:15px;height:9px;border-radius:0 0 4px 4px;background:#9c6b3a;border:1.5px solid #7a5027;transition:.3s;z-index:4;}
        .pq1210 .pq-box.sealed .pq-clasp{background:#f2b134;border-color:#c98a12;box-shadow:0 0 7px rgba(242,177,52,.65);}
        .pq1210 .pq-brk{font-size:44px;font-weight:800;line-height:1;color:#7a4f26;font-family:Georgia,'Times New Roman',serif;}
        .pq1210 .pq-inner{position:relative;display:flex;align-items:center;justify-content:center;min-width:60px;height:44px;}
        .pq1210 .pq-expr{display:flex;align-items:center;gap:4px;}
        .pq1210 .pq-expr.falling{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);animation:pqFall .42s ease-in forwards;}
        .pq1210 .pq-tile{min-width:24px;height:34px;padding:0 5px;border-radius:8px;background:#fff;border:2px solid #e0b98f;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;box-shadow:0 2px 3px rgba(0,0,0,.1);}
        .pq1210 .pq-op{font-size:22px;font-weight:900;color:#a4682f;}
        .pq1210 .pq-six{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:40px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;text-shadow:0 2px 3px rgba(26,127,67,.2);}
        .pq1210 .pq-six.rise{animation:pqRise .52s .16s cubic-bezier(.3,1.5,.5,1) both;}
        /* timsoh + son karta */
        .pq1210 .pq-crocbox{flex-shrink:0;transition:transform .5s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq1210 .pq-crocbox.faceL{transform:scaleX(-1);}
        .pq1210 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;transform:rotate(15deg);animation:pqCalm 2.6s ease-in-out infinite;}
        .pq1210 .pq-jaws.chomping{transform:rotate(0deg);animation:pqChomp .5s ease-in-out 3;}
        .pq1210 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqSway2 3.4s ease-in-out infinite;}
        .pq1210 .pq-cthroat{transform-box:fill-box;transform-origin:50% 40%;animation:pqThroat 1.9s ease-in-out infinite;}
        .pq1210 .pq-cblink{opacity:0;animation:pqBlink 4s linear infinite;}
        .pq1210 .pq-num{width:64px;height:86px;border-radius:18px;border:3px solid #cbd2dc;background:linear-gradient(#fff,#f4f6fa);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;box-shadow:0 3px 8px rgba(0,0,0,.1);}
        .pq1210 .pq-q{position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:30px;font-weight:900;color:#fff;text-shadow:0 2px 5px rgba(0,0,0,.3);z-index:5;animation:pqQ 1.7s ease-in-out infinite;}
        .pq1210 .pq-chip{position:absolute;top:12px;left:50%;transform:translateX(-50%);font-size:21px;font-weight:900;color:#1a7f43;background:#fff;padding:4px 18px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.24);white-space:nowrap;z-index:5;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;font-variant-numeric:tabular-nums;}
        .pq1210 .pq-chip .op{color:#d0568a;margin:0 5px;}
        /* Boshqaruv: hisobla + belgilar */
        .pq1210 .pq-tools{display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:18px;}
        .pq1210 .pq-compute{display:inline-flex;align-items:center;gap:7px;padding:11px 28px;border-radius:14px;border:none;background:linear-gradient(#5ab85f,#3f9d47);color:#fff;font-size:17px;font-weight:800;cursor:pointer;box-shadow:0 4px 0 #2e7a3e,0 6px 12px rgba(46,122,62,.3);animation:pqBtnPulse 1.8s ease-in-out infinite;transition:transform .1s;font-family:inherit;}
        .pq1210 .pq-compute:hover:not(:disabled){transform:translateY(-1px);}
        .pq1210 .pq-compute:active:not(:disabled){transform:translateY(2px);box-shadow:0 2px 0 #2e7a3e;}
        .pq1210 .pq-compute.done{background:linear-gradient(#cdd5de,#b6c0cc);color:#5c6672;box-shadow:0 3px 0 #97a2af;animation:none;cursor:default;}
        .pq1210 .pq-chk{font-size:16px;line-height:1;}
        .pq1210 .pq-opts{display:flex;gap:12px;justify-content:center;}
        .pq1210 .pq-opt{width:66px;height:66px;font-size:32px;font-weight:900;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;line-height:1;transition:.12s;font-family:inherit;}
        .pq1210 .pq-opt:hover:not(:disabled){border-color:#8fc9ae;transform:translateY(-2px);}
        .pq1210 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1210 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1210 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1210 .pq-opt:disabled{opacity:.4;cursor:not-allowed;}
        .pq1210 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1210 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1210 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(640px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqSway2{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(84px,20px) rotate(6deg);}50%{transform:translate(150px,-8px) rotate(-4deg);}75%{transform:translate(60px,-24px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqCalm{0%,100%{transform:rotate(15deg);}50%{transform:rotate(18deg);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0deg);}50%{transform:rotate(16deg);}}
        @keyframes pqBlink{0%,90%{opacity:0;}93%,96%{opacity:1;}99%,100%{opacity:0;}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pqQ{0%,100%{transform:translateX(-50%) scale(1);opacity:.85;}50%{transform:translateX(-50%) scale(1.18);opacity:1;}}
        @keyframes pqBoxSeal{0%{transform:translateY(0) scale(1,1);}28%{transform:translateY(2px) scale(1.05,.92);}58%{transform:translateY(0) scale(.97,1.04);}100%{transform:translateY(0) scale(1,1);}}
        @keyframes pqFall{0%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,10%) scale(.5);}}
        @keyframes pqRise{0%{opacity:0;transform:translate(-50%,-8%) scale(.3);}100%{opacity:1;transform:translate(-50%,-50%) scale(1);}}
        @keyframes pqBtnPulse{0%,100%{box-shadow:0 4px 0 #2e7a3e,0 6px 12px rgba(46,122,62,.3);}50%{box-shadow:0 4px 0 #2e7a3e,0 6px 18px rgba(46,122,62,.55);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-lake">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-lily y1"><Lily pink /></span>
        <span className="pq-lily y2"><Lily /></span>
        <span className="pq-ring a" /><span className="pq-ring b" />
        <span className="pq-reedw l"><Reeds /></span>
        <span className="pq-reedw r"><Reeds flip /></span>
        <span className="pq-dflyw"><Dragonfly /></span>

        {ok
          ? <span className="pq-chip">({A} + {B}) <b className="op">{TARGET}</b> {C}</span>
          : <span className="pq-q">?</span>}

        <div className="pq-cmp">
          {/* 1-bosqich: yog'och qavs qutisi — «Hisobla» bosilganda yopiladi, «6» chiqadi */}
          <div className={'pq-box' + (computed ? ' sealed' : '') + (still ? ' still' : '')}>
            <span className="pq-boxlid" />
            <div className="pq-boxbody">
              <span className="pq-nail n1" /><span className="pq-nail n2" /><span className="pq-nail n3" /><span className="pq-nail n4" />
              <span className="pq-brk">(</span>
              <span className="pq-inner">
                {!computed && (
                  <span className="pq-expr"><span className="pq-tile">{A}</span><span className="pq-op">+</span><span className="pq-tile">{B}</span></span>
                )}
                {computed && !still && (
                  <span className="pq-expr falling" aria-hidden="true"><span className="pq-tile">{A}</span><span className="pq-op">+</span><span className="pq-tile">{B}</span></span>
                )}
                {computed && <span className={'pq-six' + (still ? '' : ' rise')}>{SUM}</span>}
              </span>
              <span className="pq-brk">)</span>
            </div>
            <span className="pq-clasp" />
          </div>

          {/* 2-bosqich: timsoh — g'alabada kattaga (chapga=6) og'iz ochib chomp */}
          <div className={'pq-crocbox' + (ok && faceDir === 'L' ? ' faceL' : '')}>
            <Croc chomp={ok && faceDir !== 'E'} />
          </div>

          <div className="pq-num">{C}</div>
        </div>
      </div>

      <div className="pq-tools">
        <button type="button" className={'pq-compute' + (computed ? ' done' : '')} disabled={computed || lock} onClick={doCompute}>
          {computed && <span className="pq-chk">✓</span>}{t.btnCompute}
        </button>
        <div className="pq-opts">
          {SIGNS.map((s) => {
            const sel = picked === s; const right = ok && s === TARGET;
            return <button key={s} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={!computed || lock} onClick={() => pick(s)}>{s}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
