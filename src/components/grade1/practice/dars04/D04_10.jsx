// Dars04 · Amaliyot 10 — YANGI kreativ: «Timsohni ovqatlantir» · 🔴 · timsoh · tag: croc_feed
// Ikki baliq to'plami (8 va 5). Bola TOMONNI bosadi — timsoh o'sha tomonga buriladi va
// og'zini ochadi (og'iz = < > belgisi!). To'g'ri: timsoh KO'P tomonga qaraydi, baliqlarni yeydi.
// Nazariy Dars04 dagi timsoh-syujet bilan bog'lanadi. Веди-до-верного, ozvuchkasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT_N = 8, RIGHT_N = 5;
const CORRECT_DIR = 'L'; // ko'p tomon — chap
const DATA = { ptype: 'NEW', level: '🔴', tag: 'croc_feed' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Timsoh', title: 'Timsohni ovqatlantir',
    setup: 'Och timsoh keldi! U doim baliq KO\'P tomonga og\'iz ochadi.',
    ask: 'Baliq ko\'p tomonni bosing — timsoh o\'sha yoqqa qarasin.',
    correct: 'Barakalla! Sakkiz beshdan ko\'p — timsoh to\'yguncha yedi!',
    hint: 'Ikkala tomondagi baliqlarni sanang: timsoh KO\'P tomonga og\'iz ochadi.',
    left: 'Chap tomon', right: 'O\'ng tomon',
  },
  ru: {
    eyebrow: 'Зоопарк · Крокодил', title: 'Накорми крокодила',
    setup: 'Пришёл голодный крокодил! Он всегда открывает пасть туда, где рыбы БОЛЬШЕ.',
    ask: 'Нажми на сторону, где рыбы больше — пусть крокодил повернётся туда.',
    correct: 'Молодец! Восемь больше пяти — крокодил наелся досыта!',
    hint: 'Посчитай рыбок с обеих сторон: крокодил открывает пасть к БОЛЬШЕМУ.',
    left: 'Левая сторона', right: 'Правая сторона',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan timsoh (o'ngga qaragan holat; chap uchun wrapper scaleX(-1)).
// Yon ko'rinish: cho'zilgan tana, kuchli egilgan dum, orqada ikki qator scute-tikan,
// 4 kalta panjali oyoq, ko'z do'ngligi ustida tik-qorachiqli ko'z, burun teshigi.
// Og'zi OCHIQ — jag'lar < > belgisini eslatadi (metafora!). Uch ton yashil:
// orqa #2e7a3e, tana #3f9950/#4aa35b, qorin-tomog'i #d9e8a0/#b8d488.
// .pq-jaws — yuqori jag' guruhi, pqChomp jag' bo'g'imida aylanadi. chomp=true: qisilib-ochiladi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="132" height="72" aria-hidden="true" style={{ display: 'block' }}>
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
    {/* qorin — och-sariq-yashil, ko'ndalang chiziqli */}
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* orqadagi scute-tikan qatorlari (katta + kichik) */}
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
    {/* og'iz ichi — och-pushti */}
    <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
    {/* pastki jag' — och tomog' toni, zigzag tishlar yuqoriga */}
    <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
    {/* yuqori jag' — ko'tarilgan, pqChomp shu guruhda; tishlar pastga, burun teshigi uchida */}
    <g className={chomp ? 'pq-jaws chomping' : 'pq-jaws'}>
      <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
      <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
      <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
    </g>
    {/* ko'z do'ngligi + tik qorachiqli ko'z (blik bilan) */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
  </svg>
);

// Kanon baliq (uslub-qo'llanma): yon ko'rinish, tomchi-shakl tana (#e8883a, qorni
// #f6c07a), uchburchak dum + kichik suzgichlar (#c96a24), blikli ko'z, og'iz chizig'i.
// O'ngga qaragan holat asos; chapga — .pq-fish.flip (scaleX(-1)). Dumi sekin qimirlaydi.
const Fish = () => (
  <svg viewBox="0 0 40 24" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-ftail" d="M10 12 L2 5 L4.5 12 L2 19 Z" fill="#c96a24" stroke="#a8531a" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 12 Q13 4.5 23 4 Q36 4.5 37.5 12 Q36 19.5 23 20 Q13 19.5 8 12 Z" fill="#e8883a" stroke="#a8531a" strokeWidth="1.3" />
    <path d="M11 14.5 Q22 20.5 34 14 Q30 18.5 22 18.8 Q15 18.5 11 14.5 Z" fill="#f6c07a" />
    <path d="M17 5.8 Q22 2.6 26.5 6 Q21.5 7.6 17 5.8 Z" fill="#c96a24" />
    <path d="M20 12.5 Q24 14.5 22.5 17.5" fill="none" stroke="#c96a24" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="30.5" cy="9.6" r="2.1" fill="#1f2430" />
    <circle cx="31.3" cy="8.9" r="0.7" fill="#fff" />
    <path d="M34.8 13.6 q1.6 1.1 3 .5" fill="none" stroke="#a8531a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export default function D04_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [dir, setDir] = useState(null); // 'L' | 'R'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.dir != null) setDir(initialAnswer.studentAnswer.dir);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(dir !== null && !checked); }, [dir, checked, onReady]);

  const lock = isReview || checked;
  const pick = (d) => { if (lock) return; setDir(d); setFeedback(null); };

  const check = useCallback(() => {
    if (dir === null) return;
    const correct = dir === CORRECT_DIR;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.left, t.right], studentAnswer: { dir }, correctAnswer: { dir: CORRECT_DIR }, correct, meta: { ...DATA } });
  }, [dir, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0410">
      <style>{`
        .pq0410{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0410 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq0410 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0410 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0410 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0410 .pq-river{position:relative;display:flex;gap:8px;justify-content:center;align-items:center;padding:16px 10px;border-radius:22px;background:linear-gradient(#cfe9f5,#9fd0e8);border:3px solid #b9dcee;}
        .pq0410 .pq-shoal{position:relative;width:150px;min-height:112px;padding:10px 6px;border-radius:16px;border:2.5px dashed rgba(46,122,62,.35);display:flex;flex-wrap:wrap;gap:4px;align-items:center;justify-content:center;cursor:pointer;transition:.14s;}
        .pq0410 .pq-shoal:hover:not(.lock){border-color:#2e7a3e;transform:translateY(-2px);}
        .pq0410 .pq-shoal.sel{border-style:solid;border-color:#2563eb;background:rgba(232,238,252,.55);}
        .pq0410 .pq-shoal.win{border-style:solid;border-color:#1a7f43;background:rgba(232,247,238,.6);animation:pqCele .5s ease;}
        .pq0410 .pq-shoal.lock{cursor:default;}
        .pq0410 .pq-fish{position:relative;line-height:0;animation:pqBob 2.2s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18));}
        .pq0410 .pq-fish.gone{animation:pqEaten .6s ease forwards;}
        .pq0410 .pq-fish span{display:inline-block;line-height:0;}
        .pq0410 .pq-fish.flip span{transform:scaleX(-1);}
        .pq0410 .pq-ftail{transform-box:fill-box;transform-origin:100% 50%;animation:pqTail 1.5s ease-in-out infinite;}
        .pq0410 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#1d4ed8;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0410 .pq-crocbox{flex-shrink:0;transition:transform .45s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0410 .pq-crocbox.faceL{transform:scaleX(-1);}
        .pq0410 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq0410 .pq-jaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq0410 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqSway 3.4s ease-in-out infinite;}
        .pq0410 .pq-chip{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:3;white-space:nowrap;}
        .pq0410 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0410 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0410 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqEaten{0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(26px,10px) scale(.3);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pqSway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pqTail{0%,100%{transform:rotate(7deg);}50%{transform:rotate(-7deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-river">
        {ok && <span className="pq-chip">{LEFT_N} &gt; {RIGHT_N}</span>}
        <div className={'pq-shoal' + (lock ? ' lock' : '') + (ok && CORRECT_DIR === 'L' ? ' win' : dir === 'L' && !ok ? ' sel' : '')} onClick={() => pick('L')}>
          {Array.from({ length: LEFT_N }).map((_, i) => (
            <span key={i} className={'pq-fish' + (ok ? ' gone' : '')} style={{ animationDelay: ok ? `${i * 0.12}s` : `${(i % 4) * 0.4}s` }}>
              <span><Fish /></span>{ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          ))}
        </div>

        <div className={'pq-crocbox' + (dir === 'L' ? ' faceL' : '')}>
          <Croc chomp={!!ok} />
        </div>

        <div className={'pq-shoal' + (lock ? ' lock' : '') + (dir === 'R' && !ok ? ' sel' : '')} onClick={() => pick('R')}>
          {Array.from({ length: RIGHT_N }).map((_, i) => (
            <span key={i} className="pq-fish flip" style={{ animationDelay: `${(i % 3) * 0.5}s` }}>
              <span><Fish /></span>{ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          ))}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
