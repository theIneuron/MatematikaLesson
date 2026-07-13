// Dars22 · Amaliyot 06 — Mantiq «Oraliqdagi son» «Olma bog'i» · 🔴 · tag: logic_between
// Bitta-tanlov (YANGI mantiq = oraliqda bo'lish): 40 va 50 orasidagi son qaysi? → 45.
// Distraktorlar: 38 (40 dan kichik — juda kichik), 52 (50 dan katta — juda katta).
// Sahna: son o'qi 40..50, uchlari 40 va 50 belgilangan; oraliqda "?" olma osilib turadi.
// JAVOB OSHKOR EMAS: olma to'g'ri javobgacha "?" ko'rsatadi; 45 faqat g'alabada tushib joylashadi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Savol matni ANIQ: "Ikkita son bor: 40 va 50" + oradagi sonni tanlash-buyruq.
// Ambient boyitish: bulutlar + hilpiragan gullar (dekor, pointer-events YO'Q).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 40, B = 50, ANSWER = 45;
const DATA = { a: A, b: B, target: ANSWER, options: [45, 38, 52], level: '🔴', tag: 'logic_between' };
// Son o'qi geometriyasi (SVG user birliklari): xAt(n) = X0 + (n-40)*DX, n = 40..50.
const X0 = 30, DX = 26, RAILY = 78;
const xAt = (n) => X0 + (n - A) * DX; // 40->30, 45->160, 50->290 (viewBox markazi 160)

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Oraliqdagi son",
    setup: "Ikkita son bor: 40 va 50.",
    ask: "Ular orasidagi sonni tanlang.",
    correct: "Barakalla! Qirq besh — qirq bilan ellik orasida. 40 < 45 < 50.",
    hint: "Son 40 dan katta VA 50 dan kichik bo'lsin.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Число между",
    setup: "Есть два числа: 40 и 50.",
    ask: "Выбери число между ними.",
    correct: "Молодец! Сорок пять — между сорока и пятьюдесятью. 40 < 45 < 50.",
    hint: "Число должно быть больше 40 И меньше 50.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Gul (ambient) — bog' chetida hilpiragan mayda gul. Dekor, pointer-events YO'Q.
const Flower = ({ c = '#e8739e' }) => (
  <svg viewBox="0 0 16 22" width="13" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M8 11 L8 20" stroke="#4f9a3f" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 16 Q4.4 15 4 12.4 Q7.2 12.8 8 16 Z" fill="#5aa84f" />
    <g fill={c}>
      <circle cx="8" cy="3.6" r="2.6" /><circle cx="4.3" cy="6.2" r="2.6" /><circle cx="11.7" cy="6.2" r="2.6" />
      <circle cx="5.5" cy="10" r="2.6" /><circle cx="10.5" cy="10" r="2.6" />
    </g>
    <circle cx="8" cy="6.9" r="2.3" fill="#ffd76a" stroke="#e8b53a" strokeWidth=".6" />
  </svg>
);

let __uid = 0;

export default function D22_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 45 | 38 | 52
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const uid = useRef('pq2206_' + (__uid++)).current;
  // Review yoki qayta ochilishda tushish animatsiyasi qayta ijro etilmaydi — olma statik 45 ustida.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === ANSWER;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: ANSWER }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  // Olma marker: g'alabagacha oraliq ustida tebranadi (bosiladigan nishon EMAS — dekor);
  // to'g'ri javobda 45 belgisiga tushadi (still bo'lsa darhol tushgan holatda).
  const markerCls = 'pq-mark' + (ok ? (still ? ' landed' : ' drop') : ' bob');
  const gid = uid + 'g';

  return (
    <div className="pq pq2206">
      <style>{`
        .pq2206{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2206 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2206 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2206 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2206 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2206 .pq-scene{position:relative;width:380px;max-width:100%;height:214px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2206 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2206sun 3.6s ease-in-out infinite;}
        .pq2206 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2206 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2206 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2206 .pq-leaf{position:absolute;top:-10px;width:9px;height:9px;background:#7cbf5f;border-radius:0 100% 0 100%;z-index:2;pointer-events:none;opacity:.85;}
        .pq2206 .pq-leaf.l1{left:24%;animation:pq2206leaf 6.5s linear infinite;}
        .pq2206 .pq-leaf.l2{left:70%;background:#e0a24a;animation:pq2206leaf 8s linear .8s infinite;}
        .pq2206 .pq-cloud{position:absolute;z-index:1;pointer-events:none;width:42px;height:13px;border-radius:999px;background:rgba(255,255,255,.88);animation:pq2206drift 12s ease-in-out infinite;}
        .pq2206 .pq-cloud::before{content:'';position:absolute;left:7px;top:-7px;width:16px;height:12px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2206 .pq-cloud::after{content:'';position:absolute;left:21px;top:-5px;width:12px;height:9px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2206 .pq-cloud.c1{left:7%;top:15px;}
        .pq2206 .pq-cloud.c2{left:64%;top:30px;width:28px;animation-delay:-6s;}
        .pq2206 .pq-flw{position:absolute;bottom:5px;z-index:2;line-height:0;pointer-events:none;transform-origin:50% 100%;animation:pq2206flsway 4s ease-in-out infinite;}
        .pq2206 .pq-flw.f1{left:9px;}
        .pq2206 .pq-flw.f2{left:30px;bottom:9px;animation-delay:-1.4s;}
        .pq2206 .pq-flw.f3{right:11px;animation-delay:-2.2s;}

        .pq2206 .pq-nlwrap{position:absolute;left:10px;right:10px;top:44px;bottom:14px;display:flex;align-items:center;justify-content:center;z-index:3;}
        .pq2206 .pq-nl{display:block;width:100%;height:auto;}
        .pq2206 .pq-mark{transform-box:fill-box;transform-origin:center;}
        .pq2206 .pq-mark.bob{animation:pq2206bob 2.6s ease-in-out infinite;}
        .pq2206 .pq-mark.drop{animation:pq2206drop .72s cubic-bezier(.3,1.3,.5,1) both;}
        .pq2206 .pq-mark.landed{transform:translateY(22px);}
        .pq2206 .pq-slot{animation:pq2206slot 1.8s ease-in-out infinite;}
        .pq2206 .pq-win{animation:pq2206pop .4s cubic-bezier(.3,1.4,.5,1) .55s both;transform-box:fill-box;transform-origin:center;}

        .pq2206 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2206tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2206 .pq-spark.s2{animation-delay:-.6s;} .pq2206 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2206 .pq-chain{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:14px;animation:pq2206in .3s ease both;}
        .pq2206 .pq-chain b{min-width:52px;height:44px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2206 .pq-chain b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2206 .pq-chain i{font-style:normal;font-size:22px;font-weight:900;color:#8a94a2;}

        .pq2206 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2206 .pq-opt{min-width:78px;height:72px;padding:0 12px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2206 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2206 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2206 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2206 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2206cele .5s ease;}
        .pq2206 .pq-opt:disabled{cursor:default;}
        .pq2206 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2206in .22s ease both;}
        .pq2206 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2206 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2206bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2206drop{0%{transform:translateY(-2px);}60%{transform:translateY(26px);}100%{transform:translateY(22px);}}
        @keyframes pq2206slot{0%,100%{opacity:.5;}50%{opacity:1;}}
        @keyframes pq2206sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2206drift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq2206flsway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2206leaf{0%{transform:translateY(0) rotate(0);opacity:0;}12%{opacity:.85;}100%{transform:translateY(210px) rotate(320deg);opacity:0;}}
        @keyframes pq2206pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2206tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2206cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2206in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-hill" />
        <span className="pq-cloud c1" />
        <span className="pq-cloud c2" />
        <span className="pq-leaf l1" /><span className="pq-leaf l2" />
        <span className="pq-flw f1"><Flower /></span>
        <span className="pq-flw f2"><Flower c="#8f7ae0" /></span>
        <span className="pq-flw f3"><Flower c="#f2a13c" /></span>
        <div className="pq-title">{t.title}</div>

        <div className="pq-nlwrap">
          <svg className="pq-nl" viewBox="0 0 320 118" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <radialGradient id={gid} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
              </radialGradient>
            </defs>

            {/* oraliq bandi: 40 va 50 ORASI (uchlari kirmaydi) — «orasidagi» tushunchasini ko'rsatadi */}
            <rect x={xAt(A)} y={RAILY - 9} width={xAt(B) - xAt(A)} height="18" rx="9"
              fill={ok ? 'rgba(26,127,67,.16)' : 'rgba(63,127,181,.10)'} />

            {/* asosiy chiziq + ikki uchida strelka */}
            <line x1="20" y1={RAILY} x2="300" y2={RAILY} stroke="#9aa6b6" strokeWidth="3" strokeLinecap="round" />
            <path d={`M12 ${RAILY} L22 ${RAILY - 5} L22 ${RAILY + 5} Z`} fill="#9aa6b6" />
            <path d={`M308 ${RAILY} L298 ${RAILY - 5} L298 ${RAILY + 5} Z`} fill="#9aa6b6" />

            {/* shtrixlar 40..50; 40 va 50 — yirik, belgilangan; 45 — javob uyasi (alohida) */}
            {Array.from({ length: 11 }).map((_, k) => {
              const n = A + k;
              if (n === ANSWER) return <g key={n} />;
              const x = xAt(n);
              const major = n === A || n === B;
              return (
                <g key={n}>
                  <line x1={x} y1={RAILY - (major ? 9 : 6)} x2={x} y2={RAILY + (major ? 9 : 6)} stroke={major ? '#3a4250' : '#8a94a6'} strokeWidth={major ? 2.6 : 1.6} strokeLinecap="round" />
                  {major && <text x={x} y={RAILY + 27} textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="Manrope, system-ui, sans-serif" fill="#3a4250">{n}</text>}
                </g>
              );
            })}

            {/* 45 uyasi: g'alabagacha punktir «?» halqa; g'alabada yashil belgi */}
            {!ok && <circle className="pq-slot" cx={xAt(ANSWER)} cy={RAILY} r="11" fill="none" stroke="#3f7fb5" strokeWidth="2" strokeDasharray="3 4" />}
            {ok && <circle className="pq-win" cx={xAt(ANSWER)} cy={RAILY} r="11.5" fill="rgba(26,127,67,.18)" stroke="#1a7f43" strokeWidth="2.6" />}

            {/* olma marker: oraliq ustida osilib turadi, «?» ko'rsatadi; to'g'ri javobda 45 belgisiga tushadi */}
            <g transform={`translate(${xAt(ANSWER)} 34)`}>
              <g className={markerCls}>
                {/* bandak */}
                <path d="M0 -12 Q1 -17 3 -18" fill="none" stroke="#7a4a28" strokeWidth="2" strokeLinecap="round" />
                {/* barg */}
                <path d="M1 -15 Q7 -19 10 -14 Q5 -11 1 -15 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".6" />
                {/* tana (ikki bo'lakli olma silueti) */}
                <path d="M0 -10 C-5 -15 -14 -12 -14 -1 C-14 9 -7 17 0 17 C7 17 14 9 14 -1 C14 -12 5 -15 0 -10 Z" fill={`url(#${gid})`} stroke="#a5342c" strokeWidth="1.4" strokeLinejoin="round" />
                {/* oq blik */}
                <ellipse cx="-6" cy="-2" rx="3" ry="2" fill="#fff" opacity=".5" transform="rotate(-30 -6 -2)" />
                {/* nishon: «?» (yechilmaguncha) → 45 (g'alabada) */}
                <circle cx="0" cy="2" r="8.6" fill="#fff" stroke={ok ? '#1a7f43' : '#e0b96a'} strokeWidth="1.7" />
                <text x="0" y={ok ? 5.4 : 6} textAnchor="middle" fontSize={ok ? 11 : 13} fontWeight="900" fontFamily="Manrope, system-ui, sans-serif" fill={ok ? '#1a7f43' : '#c9822f'}>{ok ? ANSWER : '?'}</text>
              </g>
            </g>
          </svg>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '80%', top: '64px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '38px' }}>✦</span>
        </>)}
      </div>

      {ok && (
        <div className="pq-chain"><b>{A}</b><i>{'<'}</i><b className="res">{ANSWER}</b><i>{'<'}</i><b>{B}</b></div>
      )}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === ANSWER;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
