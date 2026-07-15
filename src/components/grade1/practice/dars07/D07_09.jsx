// Dars07 · Amaliyot 09 — P7 Mini-masala «Maydonchada bolalar» · 🔴 · tag: word_problem_2step
// IKKI BOSQICH: 6 bola o'ynab turibdi + avval 2 bola (darvoza oldida) + keyin yana 1 bola (yo'lakchada, kechikib kiradi);
// g'alabada hammasi guruhga qo'shiladi, badge 1..9, chip «6 + 2 + 1 = 9».
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

const DATA = { a: 6, b: 3, c: 1, target: 10, options: [7, 8, 9, 10], ptype: 'P7', level: '🔴', tag: 'word_problem_2step' };

const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · Masala', title: 'Mini-masala',
    setup: 'Maydonchada oltita bola o\'ynab turgan edi. Avval uchta bola, keyin yana bittasi kirib keldi.',
    ask: 'Endi maydonchada jami nechta bola bo\'ldi?',
    correct: 'Barakalla! Olti, uch va bir — o\'n bola.',
    hint: 'Bosqichma-bosqich qo\'shing: oltiga uchni, keyin yana birni.',
  },
  ru: {
    eyebrow: 'Игровая площадка · Задача', title: 'Мини-задача',
    setup: 'На площадке играли шестеро детей. Сначала вошли трое, потом ещё один.',
    ask: 'Сколько всего детей теперь на площадке?',
    correct: 'Молодец! Шесть, три и один — десять детей.',
    hint: 'Прибавляй по шагам: к шести три, потом ещё один.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
// Futbolka palitrasi (kanon): qizil, ko'k, sariq, yashil.
const SHIRTS = {
  red: { c: '#d9534b', line: '#a33630' },
  blue: { c: '#4f8fc4', line: '#34648c' },
  yellow: { c: '#f2b134', line: '#b97c14' },
  green: { c: '#57a84f', line: '#3a7a35' },
};

// Bola kanoni: dumaloq teri-rang bosh + blikli ko'zlar + tabassum + futbolka-tana + kalta oyoqchalar.
// Bitta bola = bitta figura. d — pirpiratish stagger indeksi.
const Kid = ({ shirt, hair, d }) => (
  <svg viewBox="0 0 40 58" width="38" height="55" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.55)}s` }}>
    <rect x="13.6" y="43" width="4.8" height="11" rx="2.4" fill="#4a5568" />
    <rect x="21.6" y="43" width="4.8" height="11" rx="2.4" fill="#4a5568" />
    <ellipse cx="15.6" cy="55" rx="3.6" ry="2" fill="#3a4350" />
    <ellipse cx="24.4" cy="55" rx="3.6" ry="2" fill="#3a4350" />
    <rect x="8" y="25" width="24" height="20" rx="8" fill={shirt.c} stroke={shirt.line} strokeWidth="1.5" />
    <path d="M8.5 31 Q3.5 35 5 40.5" stroke={shirt.c} strokeWidth="4.4" fill="none" strokeLinecap="round" />
    <path d="M31.5 31 Q36.5 35 35 40.5" stroke={shirt.c} strokeWidth="4.4" fill="none" strokeLinecap="round" />
    <circle cx="5" cy="41.5" r="2.3" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
    <circle cx="35" cy="41.5" r="2.3" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
    <circle cx="20" cy="14" r="11" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5" />
    <path d="M9.4 12.5 A10.8 10.8 0 0 1 30.6 12.5 Q26 6.2 20 6.2 Q14 6.2 9.4 12.5 Z" fill={hair} />
    <circle cx="16.2" cy="15" r="1.5" fill="#1f2430" /><circle cx="16.7" cy="14.4" r="0.55" fill="#fff" />
    <circle cx="23.8" cy="15" r="1.5" fill="#1f2430" /><circle cx="24.3" cy="14.4" r="0.55" fill="#fff" />
    <g className="pq-blink"><rect x="14.2" y="13.2" width="4" height="3.4" rx="1.6" fill={SKIN} /><rect x="21.8" y="13.2" width="4" height="3.4" rx="1.6" fill={SKIN} /></g>
    <path d="M16.5 19.4 Q20 22.2 23.5 19.4" stroke="#8a5f3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);

// Arg'imchoq: yog'och A-ramka + osilgan o'rindiq (pq-sw sekin tebranadi).
const Swing = () => (
  <svg viewBox="0 0 120 112" width="102" height="95" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="14" y1="106" x2="27" y2="15" stroke="#b07840" strokeWidth="5" strokeLinecap="round" />
    <line x1="40" y1="106" x2="27" y2="15" stroke="#b07840" strokeWidth="5" strokeLinecap="round" />
    <line x1="106" y1="106" x2="93" y2="15" stroke="#b07840" strokeWidth="5" strokeLinecap="round" />
    <line x1="80" y1="106" x2="93" y2="15" stroke="#b07840" strokeWidth="5" strokeLinecap="round" />
    <line x1="20" y1="15" x2="100" y2="15" stroke="#8a5a2b" strokeWidth="6" strokeLinecap="round" />
    <g className="pq-sw">
      <line x1="50" y1="17" x2="50" y2="75" stroke="#9a7b4f" strokeWidth="2.5" />
      <line x1="70" y1="17" x2="70" y2="75" stroke="#9a7b4f" strokeWidth="2.5" />
      <rect x="43" y="73" width="34" height="8" rx="4" fill="#d9534b" stroke="#a33630" strokeWidth="1.5" />
    </g>
  </svg>
);

// Slayd-toboggan: narvon + ko'k tushish yuzasi + tayanch.
const Slide = () => (
  <svg viewBox="0 0 116 92" width="100" height="79" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="92" y1="88" x2="92" y2="16" stroke="#98a0aa" strokeWidth="4" strokeLinecap="round" />
    <line x1="106" y1="88" x2="106" y2="16" stroke="#98a0aa" strokeWidth="4" strokeLinecap="round" />
    <line x1="92" y1="30" x2="106" y2="30" stroke="#98a0aa" strokeWidth="3" strokeLinecap="round" />
    <line x1="92" y1="46" x2="106" y2="46" stroke="#98a0aa" strokeWidth="3" strokeLinecap="round" />
    <line x1="92" y1="62" x2="106" y2="62" stroke="#98a0aa" strokeWidth="3" strokeLinecap="round" />
    <line x1="92" y1="78" x2="106" y2="78" stroke="#98a0aa" strokeWidth="3" strokeLinecap="round" />
    <rect x="82" y="9" width="30" height="8" rx="3.5" fill="#7f8994" />
    <path d="M86 16 L12 74 L22 86 L98 28 Z" fill="#4f8fc4" stroke="#34648c" strokeWidth="2" strokeLinejoin="round" />
    <path d="M88 24 L20 77" stroke="#dff1fb" strokeWidth="3" opacity=".7" strokeLinecap="round" />
    <line x1="52" y1="54" x2="52" y2="88" stroke="#98a0aa" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// O't-gullar dekori (pastki chekka).
const Decor = () => (
  <svg viewBox="0 0 392 22" width="392" height="22" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M14 20 q3 -10 5 -1 M24 21 q3 -11 6 -1 M330 20 q3 -10 5 -1 M342 21 q3 -11 6 -1 M198 21 q3 -9 5 -1" stroke="#5d9b4d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <g><line x1="60" y1="21" x2="60" y2="11" stroke="#5d9b4d" strokeWidth="2" /><circle cx="60" cy="8" r="3.4" fill="#f2b134" /><circle cx="60" cy="8" r="1.4" fill="#b97c14" /></g>
    <g><line x1="368" y1="21" x2="368" y2="12" stroke="#5d9b4d" strokeWidth="2" /><circle cx="368" cy="9" r="3.4" fill="#e88bb1" /><circle cx="368" cy="9" r="1.4" fill="#b1487a" /></g>
  </svg>
);

// O'ynab turgan 6 bola (har xil futbolka).
const PLAY = [
  { x: 140, y: 134, s: 'red', h: '#4a3626' },
  { x: 192, y: 128, s: 'blue', h: '#2d2620' },
  { x: 246, y: 138, s: 'yellow', h: '#6b4a2e' },
  { x: 158, y: 188, s: 'green', h: '#2d2620' },
  { x: 212, y: 194, s: 'blue', h: '#6b4a2e' },
  { x: 268, y: 188, s: 'red', h: '#4a3626' },
];
// Kirib kelganlar ikki to'lqinda: w=1 — avval kirgan 2 bola (darvoza oldida, sc .68),
// w=2 — keyin kelgan 1 bola (yo'lakchada uzoqroqda, sc .55, kechikkan kirish-animatsiyasi).
// G'alabada hammasi (jx,jy) ga o'tib guruhga qo'shiladi.
const GATE = [
  { x: 22, y: 126, jx: 102, jy: 156, s: 'yellow', h: '#2d2620', sc: 0.68, w: 1 },
  { x: 50, y: 140, jx: 124, jy: 202, s: 'green', h: '#4a3626', sc: 0.68, w: 1 },
  { x: 35, y: 108, jx: 96, jy: 178, s: 'red', h: '#4a3626', sc: 0.62, w: 1 },
  { x: 31, y: 110, jx: 80, jy: 200, s: 'blue', h: '#6b4a2e', sc: 0.55, w: 2 },
];

export default function D07_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') {
        const tt = T[lang] || T.uz;
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? tt.correct : tt.hint });
        setChecked(true);
      }
    }
  }, [initialAnswer, lang]);
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
  const [fitRef, scale] = useFitScale(392);

  return (
    <div className="pq pq0709" ref={fitRef}>
      <style>{`
        .pq0709{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0709 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a7a35;text-transform:uppercase;}
        .pq0709 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0709 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0709 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0709 .pq-scene{box-sizing:border-box;position:relative;width:392px;height:272px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f6ff 32%,#a3d48d 40%,#7fbf6b 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0709 .pq-fit{position:relative;margin:0 auto;}
        .pq0709 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0709 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0709 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-11s;}
        .pq0709 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-24s;}
        .pq0709 .pq-fence{position:absolute;top:98px;height:32px;background:repeating-linear-gradient(90deg,#e9ddc4 0 7px,rgba(0,0,0,0) 7px 16px);}
        .pq0709 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:7px;height:4px;background:#d9c9a8;box-shadow:0 13px 0 #d9c9a8;}
        .pq0709 .pq-fence.f1{left:0;width:16px;}
        .pq0709 .pq-fence.f2{left:64px;right:0;}
        .pq0709 .pq-gpost{position:absolute;top:92px;width:8px;height:42px;background:#c9a267;border:1.5px solid #a3793f;border-radius:4px 4px 0 0;z-index:1;}
        .pq0709 .pq-gpost.gp1{left:12px;} .pq0709 .pq-gpost.gp2{left:60px;}
        .pq0709 .pq-leaf{position:absolute;left:21px;top:100px;width:38px;height:28px;background:repeating-linear-gradient(90deg,#e2d2ae 0 6px,rgba(0,0,0,0) 6px 13px);transform:perspective(140px) rotateY(55deg);transform-origin:left center;opacity:.95;}
        .pq0709 .pq-path{position:absolute;left:2px;top:128px;width:88px;height:104px;background:linear-gradient(#eadfc6,#ddd0b2);clip-path:polygon(36% 0,62% 0,94% 100%,4% 100%);opacity:.9;}
        .pq0709 .pq-swing{position:absolute;left:288px;top:66px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0709 .pq-sw{transform-box:fill-box;transform-origin:50% 0%;animation:pqSway 3.4s ease-in-out infinite alternate;}
        .pq0709 .pq-slide{position:absolute;left:98px;top:72px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0709 .pq-decor{position:absolute;left:0;bottom:0;line-height:0;pointer-events:none;}
        .pq0709 .pq-kid{position:absolute;width:38px;line-height:0;z-index:2;transform-origin:50% 0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));animation:pqBob 2.4s ease-in-out infinite;}
        .pq0709 .pq-kid.g{z-index:1;transition:left 1s cubic-bezier(.45,.1,.4,1),top 1s cubic-bezier(.45,.1,.4,1),transform 1s cubic-bezier(.45,.1,.4,1);}
        .pq0709 .pq-in{display:block;line-height:0;}
        .pq0709 .pq-late{animation:pqLate 1.1s ease-out .8s both;}
        .pq0709 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0709 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0709 .pq-q{position:absolute;left:50%;top:66px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.88);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:#7a5bd6;box-shadow:0 3px 10px rgba(0,0,0,.14);animation:pqQ 1.8s ease-in-out infinite;z-index:4;}
        .pq0709 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0709 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .pq0709 .pq-opt{width:68px;height:68px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.13s;}
        .pq0709 .pq-opt:hover:not(:disabled){border-color:#a8d19c;transform:translateY(-2px);}
        .pq0709 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0709 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0709 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0709 .pq-opt:disabled{cursor:default;}
        .pq0709 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0709 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0709 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(490px);}}
        @keyframes pqSway{from{transform:rotate(-7deg);}to{transform:rotate(7deg);}}
        @keyframes pqBob{0%,100%{margin-top:0;}50%{margin-top:-3px;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqQ{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.12);}}
        @keyframes pqLate{from{opacity:0;transform:translateX(-26px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 392 * scale, height: 272 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence f1" /><span className="pq-fence f2" />
        <span className="pq-gpost gp1" /><span className="pq-gpost gp2" />
        <span className="pq-leaf" />
        <span className="pq-path" />
        <span className="pq-swing"><Swing /></span>
        <span className="pq-slide"><Slide /></span>
        <span className="pq-decor"><Decor /></span>

        {PLAY.map((k, i) => (
          <div key={'p' + i} className="pq-kid" style={{ left: k.x, top: k.y, animationDelay: `${-(i * 0.37)}s` }}>
            <Kid shirt={SHIRTS[k.s]} hair={k.h} d={i} />
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
          </div>
        ))}
        {GATE.map((k, i) => (
          <div key={'g' + i} className="pq-kid g" style={{ left: ok ? k.jx : k.x, top: ok ? k.jy : k.y, transform: `scale(${ok ? 1 : k.sc})`, animationDelay: `${-(2.1 + i * 0.5)}s` }}>
            <span className={'pq-in' + (k.w === 2 && !ok ? ' pq-late' : '')}>
              <Kid shirt={SHIRTS[k.s]} hair={k.h} d={PLAY.length + i} />
            </span>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${(PLAY.length + i) * 0.12}s` }}>{PLAY.length + i + 1}</b>}
          </div>
        ))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.a} + {DATA.b} + {DATA.c} = {DATA.target}</span>}
      </div>
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
