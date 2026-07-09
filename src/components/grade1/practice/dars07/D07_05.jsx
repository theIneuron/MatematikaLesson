// Dars07 · Amaliyot 05 — P7 Yashirin qism (uychadagi bolalar) · 🟡 · tag: hidden_part
// Maydonchada jami 9 bola (taxtachada «9»); 5 tasi ko'rinadi, 4 tasi o'yin uychasida.
// G'alabada eshik ochiladi, 4 bola pop chiqadi, badge 1..9, chip «5 + 4 = 9».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { total: 9, shown: 5, target: 4, options: [3, 4, 5], ptype: 'P7', level: '🟡', tag: 'hidden_part' };

const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · Uycha', title: 'Yashiringan bolalar',
    setup: 'Maydonchada jami to\'qqizta bola o\'ynamoqda: beshtasi ko\'rinib turibdi, qolganlari o\'yin uychasiga kirib ketgan.',
    ask: 'Uychada nechta bola yashiringan?',
    correct: 'Barakalla! Besh va yana to\'rt — to\'qqiz. Uycha eshigi ochildi!',
    hint: 'Jami to\'qqizta. Ko\'rinib turganlarni sanang va to\'qqizgacha nechta yetmasligini o\'ylang.',
    signLabel: 'Jami',
  },
  ru: {
    eyebrow: 'Игровая площадка · Домик', title: 'Спрятавшиеся дети',
    setup: 'На площадке играют всего девять детей: пятеро видны, остальные зашли в игровой домик.',
    ask: 'Сколько детей спряталось в домике?',
    correct: 'Молодец! Пять и ещё четыре — девять. Дверь домика открылась!',
    hint: 'Всего девять. Посчитай тех, кто виден, и подумай, скольких не хватает до девяти.',
    signLabel: 'Всего',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
const SHIRTS = {
  red: { fill: '#d9534b', line: '#a33630' },
  blue: { fill: '#4f8fc4', line: '#34648c' },
  yellow: { fill: '#f2b134', line: '#a8721a' },
  green: { fill: '#57a84f', line: '#3a7a35' },
};

// Ko'rinadigan bolalar — sahna tartibida chapdan o'ngga (badge 1..5).
const VIS = [
  { x: 22, y: 8, c: 'red' },
  { x: 96, y: 26, c: 'blue' },
  { x: 138, y: 10, c: 'yellow' },
  { x: 178, y: 30, c: 'green' },
  { x: 214, y: 8, c: 'red' },
];
// Uychadan chiqadigan bolalar (badge 6..9).
const HID = [
  { x: 240, y: 6, c: 'blue' },
  { x: 272, y: 4, c: 'yellow' },
  { x: 304, y: 8, c: 'green' },
  { x: 334, y: 5, c: 'red' },
];

// BOLA KANONI: dumaloq teri-rang bosh + blikli pirpiratuvchi ko'zlar + tabassum +
// futbolka-tana (yumaloq to'rtburchak) + qo'lchalar + kalta oyoqchalar. Bitta bola = bitta figura.
const Kid = ({ c, d }) => (
  <svg viewBox="0 0 36 56" width="34" height="53" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.55)}s` }}>
    <line x1="14" y1="46" x2="14" y2="53.5" stroke="#5c6672" strokeWidth="4.2" strokeLinecap="round" />
    <line x1="22" y1="46" x2="22" y2="53.5" stroke="#5c6672" strokeWidth="4.2" strokeLinecap="round" />
    <path d="M8.5 32 Q4.5 36 4 40.5" stroke={c.fill} strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M27.5 32 Q31.5 36 32 40.5" stroke={c.fill} strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="4" cy="42" r="2.2" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
    <circle cx="32" cy="42" r="2.2" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
    <rect x="8" y="26" width="20" height="21" rx="9" fill={c.fill} stroke={c.line} strokeWidth="1.5" />
    <circle cx="18" cy="14" r="10.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5" />
    <circle cx="14.2" cy="13" r="1.5" fill="#1f2430" /><circle cx="14.7" cy="12.5" r="0.55" fill="#fff" />
    <circle cx="21.8" cy="13" r="1.5" fill="#1f2430" /><circle cx="22.3" cy="12.5" r="0.55" fill="#fff" />
    <g className="pq-blink"><rect x="12.2" y="11.2" width="4" height="3.6" rx="1.6" fill={SKIN} /><rect x="19.8" y="11.2" width="4" height="3.6" rx="1.6" fill={SKIN} /></g>
    <path d="M14.6 17.6 Q18 20.4 21.4 17.6" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

// Arg'imchoq: ko'k A-ramka + osilgan o'rindiq (sekin tebranadi — pq-rock).
const Swing = () => (
  <svg viewBox="0 0 124 112" width="118" height="106" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="62" cy="106" rx="52" ry="5" fill="#7fb96e" opacity=".55" />
    <path d="M14 106 L30 16 M46 106 L30 16" stroke="#4f8fc4" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M78 106 L94 16 M110 106 L94 16" stroke="#4f8fc4" strokeWidth="5" strokeLinecap="round" fill="none" />
    <line x1="22" y1="16" x2="102" y2="16" stroke="#34648c" strokeWidth="6" strokeLinecap="round" />
    <g className="pq-rock">
      <line x1="54" y1="18" x2="54" y2="72" stroke="#8a6a3a" strokeWidth="2.4" />
      <line x1="70" y1="18" x2="70" y2="72" stroke="#8a6a3a" strokeWidth="2.4" />
      <rect x="47" y="71" width="30" height="7" rx="3.5" fill="#d9534b" stroke="#a33630" strokeWidth="1.5" />
    </g>
  </svg>
);

// Slayd-toboggan: narvon + supacha + sariq qiyalik.
const Slide = () => (
  <svg viewBox="0 0 112 92" width="104" height="86" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="58" cy="87" rx="46" ry="5" fill="#7fb96e" opacity=".5" />
    <line x1="16" y1="86" x2="16" y2="22" stroke="#8a95a3" strokeWidth="4" strokeLinecap="round" />
    <line x1="30" y1="86" x2="30" y2="22" stroke="#8a95a3" strokeWidth="4" strokeLinecap="round" />
    <line x1="16" y1="34" x2="30" y2="34" stroke="#aab1ba" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="48" x2="30" y2="48" stroke="#aab1ba" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="62" x2="30" y2="62" stroke="#aab1ba" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="76" x2="30" y2="76" stroke="#aab1ba" strokeWidth="3" strokeLinecap="round" />
    <rect x="11" y="15" width="36" height="9" rx="4.5" fill="#4f8fc4" stroke="#34648c" strokeWidth="1.5" />
    <path d="M42 20 L101 76 L89 86 L33 31 Z" fill="#f2b134" stroke="#a8721a" strokeWidth="2" strokeLinejoin="round" />
    <path d="M43 28 L91 74" stroke="#f8d67f" strokeWidth="4.5" strokeLinecap="round" opacity=".85" />
  </svg>
);

export default function D07_05(props) {
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
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0705">
      <style>{`
        .pq0705{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0705 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a7a35;text-transform:uppercase;}
        .pq0705 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0705 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0705 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0705 .pq-scene{position:relative;width:372px;height:256px;margin:0 auto;border-radius:20px;background:linear-gradient(180deg,#cfe9fb 0%,#e9f6ff 40%,#b9e0a0 41%,#a3d68c 66%,#8fca77 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0705 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0705 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0705 .pq-cloud.c1{top:14px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0705 .pq-cloud.c2{top:38px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-25s;}
        .pq0705 .pq-fence{position:absolute;left:0;right:0;top:88px;height:34px;background:repeating-linear-gradient(90deg,#ecd9ac 0 9px,rgba(0,0,0,0) 9px 17px);opacity:.95;z-index:0;}
        .pq0705 .pq-fence::before,.pq0705 .pq-fence::after{content:'';position:absolute;left:0;right:0;height:5px;border-radius:3px;background:#dcc691;}
        .pq0705 .pq-fence::before{top:6px;} .pq0705 .pq-fence::after{bottom:8px;}
        .pq0705 .pq-bush{position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 30%,#8cc47a,#6da75c);z-index:0;}
        .pq0705 .pq-bush.b1{left:-10px;top:104px;width:52px;height:28px;}
        .pq0705 .pq-bush.b2{left:216px;top:110px;width:40px;height:22px;opacity:.9;}
        .pq0705 .pq-sign{position:absolute;top:8px;left:10px;z-index:3;animation:pqBreath 2.7s ease-in-out infinite;}
        .pq0705 .pq-signb{width:58px;background:#fffdf5;border:2.5px solid #a8721a;border-radius:12px;text-align:center;padding:3px 0 4px;box-shadow:0 3px 6px rgba(0,0,0,.12);}
        .pq0705 .pq-signlab{display:block;font-size:10px;font-weight:800;letter-spacing:.05em;color:#8a6a3a;text-transform:uppercase;}
        .pq0705 .pq-signnum{display:block;font-size:24px;font-weight:900;line-height:1;color:#1f2430;font-variant-numeric:tabular-nums;}
        .pq0705 .pq-swing{position:absolute;left:6px;bottom:34px;z-index:1;line-height:0;}
        .pq0705 .pq-rock{transform-origin:62px 17px;animation:pqSwing 3.3s ease-in-out infinite alternate;}
        .pq0705 .pq-slide{position:absolute;left:138px;bottom:46px;z-index:1;line-height:0;}
        .pq0705 .pq-kid{position:absolute;z-index:3;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0705 .pq-kid.out{z-index:4;animation:pqPopIn .55s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0705 .pq-kbob{animation:pqKidBob 2.8s ease-in-out infinite;}
        .pq0705 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0705 .pq-cnt{position:absolute;top:-10px;right:-9px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq0705 .pq-house{position:absolute;right:10px;bottom:28px;width:118px;height:112px;z-index:2;}
        .pq0705 .pq-roof{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:63px solid transparent;border-right:63px solid transparent;border-bottom:38px solid #d9534b;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0705 .pq-wall{position:absolute;top:36px;left:7px;right:7px;bottom:0;background:linear-gradient(#f7c85e,#f2b134);border:2.5px solid #a8721a;border-radius:3px 3px 9px 9px;}
        .pq0705 .pq-house.win .pq-wall{animation:pqCele .5s ease;}
        .pq0705 .pq-win{position:absolute;top:11px;left:10px;width:36px;height:31px;border-radius:8px;background:#dff1fb;border:2px solid #a8721a;overflow:hidden;}
        .pq0705 .pq-cur{position:absolute;top:0;bottom:0;width:12px;background:#e88bb1;border-bottom:2px solid #c86a94;}
        .pq0705 .pq-cur.l{left:0;border-radius:0 0 14px 0;} .pq0705 .pq-cur.r{right:0;border-radius:0 0 0 14px;}
        .pq0705 .pq-q{position:absolute;left:50%;top:50%;font-size:17px;font-weight:900;color:#7a5bd6;animation:pqQBreath 1.8s ease-in-out infinite;}
        .pq0705 .pq-doorway{position:absolute;bottom:0;right:12px;width:34px;height:50px;border-radius:11px 11px 0 0;background:#42290f;border:2px solid #a8721a;border-bottom:none;perspective:340px;}
        .pq0705 .pq-doorleaf{position:absolute;top:-2px;left:-2px;right:-2px;bottom:0;border-radius:11px 11px 0 0;background:linear-gradient(#cd9350,#b9773a);border:2px solid #7c4f24;border-bottom:none;transform-origin:left center;transition:transform .7s cubic-bezier(.5,.6,.4,1) .08s;}
        .pq0705 .pq-doorleaf::before{content:'';position:absolute;left:4px;right:4px;top:5px;bottom:4px;border-radius:8px 8px 0 0;border:1.5px solid rgba(124,79,36,.55);}
        .pq0705 .pq-doorleaf::after{content:'';position:absolute;right:4.5px;top:24px;width:5px;height:5px;border-radius:50%;background:#5f3a17;}
        .pq0705 .pq-house.open .pq-doorleaf{transform:rotateY(-98deg);}
        .pq0705 .pq-chip{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0705 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq0705 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.13s;}
        .pq0705 .pq-opt:hover:not(:disabled){border-color:#a9cfa4;transform:translateY(-2px);}
        .pq0705 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0705 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0705 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0705 .pq-opt:disabled{cursor:default;}
        .pq0705 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0705 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0705 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqQBreath{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.28);}}
        @keyframes pqSwing{from{transform:rotate(-9deg);}to{transform:rotate(9deg);}}
        @keyframes pqKidBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqPopIn{0%{opacity:0;transform:translateY(12px) scale(.3);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" />
        <span className="pq-bush b1" /><span className="pq-bush b2" />

        <div className="pq-sign"><div className="pq-signb"><span className="pq-signlab">{t.signLabel}</span><span className="pq-signnum">{DATA.total}</span></div></div>
        {ok && <span className="pq-chip">{DATA.shown} + {DATA.target} = {DATA.total}</span>}

        <span className="pq-swing"><Swing /></span>
        <span className="pq-slide"><Slide /></span>

        {VIS.map((k, i) => (
          <span key={'v' + i} className="pq-kid" style={{ left: k.x, bottom: k.y }}>
            <span className="pq-kbob" style={{ animationDelay: `${-(i * 0.7)}s` }}><Kid c={SHIRTS[k.c]} d={i} /></span>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.08}s` }}>{i + 1}</b>}
          </span>
        ))}

        <div className={'pq-house' + (ok ? ' open win' : '')}>
          <span className="pq-roof" />
          <div className="pq-wall">
            <span className="pq-win"><span className="pq-cur l" /><span className="pq-cur r" />{!ok && <span className="pq-q">?</span>}</span>
            <span className="pq-doorway"><span className="pq-doorleaf" /></span>
          </div>
        </div>

        {ok && HID.map((k, i) => (
          <span key={'h' + i} className="pq-kid out" style={{ left: k.x, bottom: k.y, animationDelay: `${0.25 + i * 0.16}s` }}>
            <span className="pq-kbob" style={{ animationDelay: `${-(i * 0.9)}s` }}><Kid c={SHIRTS[k.c]} d={DATA.shown + i} /></span>
            <b className="pq-cnt" style={{ animationDelay: `${0.55 + i * 0.16}s` }}>{DATA.shown + i + 1}</b>
          </span>
        ))}
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
