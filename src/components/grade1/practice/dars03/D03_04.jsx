// Dars03 · Amaliyot 04 — P2 Nol (bo'sh to'plam) · 🟡 · Zuhra · tag: zero_empty
// Nol HARAKAT orqali hosil bo'ladi: daraxtda 4 ta CHIZILGAN qush (har xil tur), bola har
// birini bosadi — qush qanot qoqib uchib ketadi. Daraxt bo'shagach: «nechta qoldi?» → 0.
// Realistik sahna: qatlamli daraxt, shox-stublar, bulutlar, quyosh, o'tlar, gullar.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const N_BIRDS = 4;
// Qushlar joyi (sahna px) + uchish yo'nalishi + rang palitrasi (har xil qush turi).
const BIRDS = [
  { x: 52, y: 62, dir: 'L', c: { body: '#8a6543', breast: '#dcbb8e', head: '#7a5a3b', wing: '#5f4327' } },   // chumchuq
  { x: 108, y: 38, dir: 'R', c: { body: '#7d6a5a', breast: '#e2703a', head: '#6d5b4c', wing: '#57483c' } },  // zarg'aldoq ko'krak
  { x: 148, y: 66, dir: 'R', c: { body: '#4f8fc4', breast: '#f2d54f', head: '#3f7fb5', wing: '#33648f' } },  // ko'k chittak
  { x: 88, y: 88, dir: 'L', c: { body: '#96a04e', breast: '#e9e3a4', head: '#879144', wing: '#6d7635' } },   // sariq-yashil
];
const DATA = { target: 0, options: [0, 1, 4], ptype: 'P2', level: '🟡', tag: 'zero_empty' };
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Zuhra', title: 'Nolni top',
    setup: 'Zuhra bayram daraxtida to\'rtta qushni ko\'rdi. Har qushni bosing — u uchib ketadi!',
    ask: 'Hammasi uchib ketgach: daraxtda nechta qush qoldi?',
    correct: 'Barakalla! Daraxtda birorta ham qush qolmadi — nolta. Bu — nol.',
    hint: 'Daraxtga yana bir qarang: nechta qush ko\'rinmoqda? Sanab javob bering.',
    tapHint: 'Qushlarni bosing',
  },
  ru: {
    eyebrow: 'Праздник урожая · Зухра', title: 'Найди ноль',
    setup: 'Зухра увидела на праздничном дереве четырёх птиц. Нажимай на каждую — она улетит!',
    ask: 'Когда все улетят: сколько птиц осталось на дереве?',
    correct: 'Молодец! На дереве не осталось ни одной птицы — ноль. Это — ноль.',
    hint: 'Посмотри на дерево ещё раз: сколько птиц видно? Посчитай и ответь.',
    tapHint: 'Нажимай на птиц',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan qush (yon ko'rinish, o'ngga qaragan): tana, ko'krak, bosh, tumshuq,
// ko'z, qanot (uchishda qoqadi), dum patlari, oyoqlar.
const Bird = ({ c }) => (
  <svg viewBox="0 0 64 52" width="46" height="38" className="pq-birdsvg" aria-hidden="true">
    <path d="M6 22 L23 22 L23 31 L8 30 Z" fill={c.wing} />
    <path d="M6 22 L14 26 L6 30 Z" fill={c.body} opacity=".7" />
    <ellipse cx="34" cy="27" rx="16" ry="11" fill={c.body} />
    <ellipse cx="38" cy="31.5" rx="11.5" ry="7" fill={c.breast} />
    <circle cx="48" cy="17.5" r="8.6" fill={c.head} />
    <ellipse cx="50" cy="20" rx="5" ry="3.6" fill={c.breast} opacity=".85" />
    <polygon points="56,15.5 63.5,18.5 56,21.5" fill="#e8a33d" />
    <circle cx="50.6" cy="15.8" r="2" fill="#1f2430" />
    <circle cx="51.4" cy="15.1" r="0.7" fill="#fff" />
    <path className="pq-wing" d="M25 21 Q37 12 47 20 Q42 30 31 31 Q25 27 25 21 Z" fill={c.wing} />
    <path className="pq-wing" d="M28 22 Q37 17 44 21" stroke={c.breast} strokeWidth="1.4" fill="none" opacity=".6" />
    <line x1="31" y1="37.5" x2="29" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="38" y1="38" x2="38" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="29" y1="47" x2="25.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="47" x2="34.5" y2="48.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Qatlamli realistik daraxt: po'stloq chiziqli tana, yo'g'on shoxlar, uch tonlik
// barg-toji + yorug'lik dog'lari, qushlar qo'nadigan shox-stublar, mevalar, o't-gullar.
const Tree = () => (
  <svg viewBox="0 0 200 176" width="200" height="176" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="100" cy="167" rx="82" ry="8" fill="#b9dda8" />
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
    <circle cx="56" cy="54" r="6.5" fill="#d94f5c" />
    <circle cx="54.2" cy="52" r="2" fill="#fff" opacity=".5" />
    <circle cx="146" cy="46" r="6.5" fill="#d94f5c" />
    <circle cx="144.2" cy="44" r="2" fill="#fff" opacity=".5" />
    <circle cx="124" cy="100" r="6.5" fill="#d94f5c" />
    <circle cx="122.2" cy="98" r="2" fill="#fff" opacity=".5" />
    <path d="M41 59 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M97 35 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M137 63 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M77 85 q12 4 24 0" stroke="#7c4f24" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M18 166 q3 -9 5 -1 M28 167 q3 -10 6 -1 M168 166 q3 -9 5 -1 M178 167 q3 -10 6 -1" stroke="#7fb96e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <g><line x1="42" y1="166" x2="42" y2="156" stroke="#6da75c" strokeWidth="2" /><circle cx="42" cy="153" r="3.4" fill="#f2b134" /><circle cx="42" cy="153" r="1.4" fill="#b97c14" /></g>
    <g><line x1="160" y1="166" x2="160" y2="157" stroke="#6da75c" strokeWidth="2" /><circle cx="160" cy="154" r="3.4" fill="#e88bb1" /><circle cx="160" cy="154" r="1.4" fill="#b1487a" /></g>
  </svg>
);

export default function D03_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [flown, setFlown] = useState(() => Array(N_BIRDS).fill(false));
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const allFlown = flown.every(Boolean);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      setFlown(Array(N_BIRDS).fill(true));
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && allFlown && !checked); }, [picked, allFlown, checked, onReady]);

  const lock = isReview || checked;
  const flyAway = (i) => {
    if (lock || flown[i]) return;
    setFlown((prev) => { const nf = [...prev]; nf[i] = true; return nf; });
  };

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0304">
      <style>{`
        .pq0304{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0304 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a5bd6;text-transform:uppercase;}
        .pq0304 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0304 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0304 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0304 .pq-scene{position:relative;width:280px;height:200px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 55%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0304 .pq-sun{position:absolute;top:12px;right:16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.5s ease-in-out infinite;}
        .pq0304 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0304 .pq-cloud.c1{top:22px;left:-70px;animation-duration:30s;}
        .pq0304 .pq-cloud.c2{top:48px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:42s;animation-delay:-18s;}
        .pq0304 .pq-treewrap{position:absolute;left:50%;bottom:0;transform:translateX(-50%);}
        .pq0304 .pq-bird{position:absolute;line-height:0;cursor:pointer;user-select:none;background:none;border:none;padding:2px;z-index:2;animation:pqBob 1.9s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));transition:transform .12s;}
        .pq0304 .pq-bird:hover{transform:scale(1.1);}
        .pq0304 .pq-bird.mirror .pq-birdsvg{transform:scaleX(-1);}
        .pq0304 .pq-wing{transform-box:fill-box;transform-origin:30% 18%;}
        .pq0304 .pq-bird.flyR{animation:pqFlyR 1.05s ease-in forwards;pointer-events:none;}
        .pq0304 .pq-bird.flyL{animation:pqFlyL 1.05s ease-in forwards;pointer-events:none;}
        .pq0304 .pq-bird.flyR .pq-wing,.pq0304 .pq-bird.flyL .pq-wing{animation:pqFlap .18s ease-in-out infinite alternate;}
        .pq0304 .pq-zero{position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);font-size:54px;font-weight:900;color:#1a7f43;text-shadow:0 2px 10px rgba(255,255,255,.95);animation:pqPop .45s cubic-bezier(.3,1.5,.5,1) both;z-index:3;}
        .pq0304 .pq-taphint{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:700;color:#5c8aa8;background:rgba(255,255,255,.8);padding:3px 10px;border-radius:999px;animation:pqBob 1.8s ease-in-out infinite;z-index:2;white-space:nowrap;}
        .pq0304 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq0304 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pq0304 .pq-opt:disabled{opacity:.45;cursor:default;}
        .pq0304 .pq-opt:hover:not(:disabled){border-color:#b7d4ea;transform:translateY(-2px);}
        .pq0304 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0304 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;opacity:1;}
        .pq0304 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;opacity:1;animation:pqCele .5s ease;}
        .pq0304 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0304 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0304 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{margin-top:0;}50%{margin-top:-3px;}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(380px);}}
        @keyframes pqFlap{from{transform:rotate(8deg);}to{transform:rotate(-42deg);}}
        @keyframes pqFlyR{0%{opacity:1;transform:translate(0,0) rotate(0);}20%{transform:translate(14px,-22px) rotate(6deg);}100%{opacity:0;transform:translate(140px,-130px) rotate(12deg) scale(.5);}}
        @keyframes pqFlyL{0%{opacity:1;transform:translate(0,0) rotate(0);}20%{transform:translate(-14px,-22px) rotate(-6deg);}100%{opacity:0;transform:translate(-140px,-130px) rotate(-12deg) scale(.5);}}
        @keyframes pqPop{from{opacity:0;transform:translate(-50%,-50%) scale(.3);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-treewrap"><Tree /></div>
        {BIRDS.map((b, i) => (
          <button key={i} type="button"
            className={'pq-bird' + (b.dir === 'L' ? ' mirror' : '') + (flown[i] ? (b.dir === 'L' ? ' flyL' : ' flyR') : '')}
            style={{ left: b.x + 40 - 23, top: b.y - 14, animationDelay: flown[i] ? '0s' : `${i * 0.4}s` }}
            onClick={() => flyAway(i)} aria-label="qush">
            <Bird c={b.c} />
          </button>
        ))}
        {ok && <span className="pq-zero">0</span>}
        {!allFlown && !lock && <span className="pq-taphint">{t.tapHint}</span>}
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock || !allFlown} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
