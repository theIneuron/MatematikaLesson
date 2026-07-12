// Dars19 · Amaliyot 07 — LOGIC: fact-family (qo'shish ↔ ayirish bog'lanishi) «Shar do'koni» · 🔴 · tag: logic_fact_family
// MA'LUM fakt: 8 + 5 = 13 (yashil banner + 13 shar: 8 ko'k + 5 qizil). Savol teskari amal: 13 − 5 = ? → 8.
// O'quvchi qo'shish faktidan ayirmani topadi. G'alaba SEKIN, bosqichma-bosqich: 5 qizil shar
// BITTALAB uchib ketadi, keyin 8 ko'k bittalab sanaladi; chip «8 + 5 = 13, demak 13 − 5 = 8».
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida. MINUS = U+2212 «−».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ADD = [8, 5], SUM = 13, SUB = 5, ANS = 8;
const DATA = { add: ADD, sum: SUM, sub: SUB, ans: ANS, options: [7, 8, 9], ptype: 'LOGIC', level: '🔴', tag: 'logic_fact_family' };

// Shar palitrasi: A-guruh (qoladigan 8 ta) — ko'k; B-guruh (uchib ketadigan 5 ta) — qizil.
const BLUE = { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' };
const RED = { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' };
// A-guruh: 8 ko'k (qoladi, badge 1..8). B-guruh: 5 qizil (uchib ketadi).
const GRP_A = Array.from({ length: ADD[0] }).map((_, i) => ({ i, c: BLUE }));
const GRP_B = Array.from({ length: ADD[1] }).map((_, i) => ({ i, c: RED }));

const T = {
  uz: {
    eyebrow: "Shar do'koni · Bog'lanish", title: "Qo'shishni bilsangiz, ayirishni ham bilasiz",
    setup: "Bu faktni bilamiz: 8 + 5 = 13. Sakkizta ko'k shar va yana beshta qizil — o'n uchta.",
    ask: "Unda 13 − 5 nechaga teng?",
    correct: "Barakalla! 8 + 5 = 13 bo'lsa, 13 − 5 = 8. Beshta qizil shar uchib ketdi, sakkiztasi qoldi.",
    hint: "Qo'shishni eslang: 8 + 5 = 13. Ayirish — uning teskarisi. O'n uchdan beshni olsak, qo'shilgan sakkiz qaytadi.",
    known: "Ma'lum fakt",
    demak: "demak",
  },
  ru: {
    eyebrow: 'Магазин шаров · Связь', title: 'Знаешь сложение — знаешь и вычитание',
    setup: 'Мы знаем факт: 8 + 5 = 13. Восемь синих шаров и ещё пять красных — тринадцать.',
    ask: 'Тогда сколько будет 13 − 5?',
    correct: 'Молодец! Если 8 + 5 = 13, то 13 − 5 = 8. Пять красных шаров улетели, восемь остались.',
    hint: 'Вспомни сложение: 8 + 5 = 13. Вычитание — обратное действие. Из тринадцати вычесть пять — вернутся прибавленные восемь.',
    known: 'Известный факт',
    demak: 'значит',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHAR KANONI (yakka birlik): rangli oval + oq blik + pastda tugun-uchburchak + ip-chizik. Bitta shar = bitta birlik.
let __gid = 0;
const Balloon = ({ c, size = 27 }) => {
  const id = 'b1907' + (__gid++);
  return (
    <svg viewBox="0 0 30 44" width={size} height={size * 44 / 30} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* ip */}
      <path d="M15 33 Q18 38 15 43" fill="none" stroke="#9aa3ad" strokeWidth="1" strokeLinecap="round" />
      {/* tana */}
      <ellipse cx="15" cy="16" rx="12.4" ry="16" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" />
      {/* tugun */}
      <polygon points="12,31 18,31 15,35" fill={c.dark} />
      {/* oq blik */}
      <ellipse cx="10.5" cy="10" rx="3" ry="4.4" fill="#fff" opacity=".5" transform="rotate(-24 10.5 10)" />
      <circle cx="19" cy="22" r="1.2" fill="#fff" opacity=".3" />
    </svg>
  );
};

export default function D19_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda shar-uchish qayta ijro etilmaydi — statik yakuniy holat (5 qizil yo'q, 8 ko'k qoladi).
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
    const correct = picked === ANS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: ANS }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  // still (restore/review) holatida: g'alaba bo'lsa qizil guruh umuman ko'rsatilmaydi.
  const bGone = ok && still;

  return (
    <div className="pq pq1907">
      <style>{`
        .pq1907{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1907 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7dc4;text-transform:uppercase;}
        .pq1907 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1907 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1907 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1907 .pq-scene{position:relative;width:392px;max-width:100%;height:266px;margin:0 auto;border-radius:20px;background:linear-gradient(#e4f1fb 0%,#eef6fc 52%,#f4ecdc 100%);border:2px solid #cfe0ee;overflow:hidden;}
        .pq1907 .pq-sun{position:absolute;right:18px;top:16px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1907 .pq-window{position:absolute;right:14px;top:52px;width:56px;height:44px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #a9c6dc;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1907 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#a9c6dc;transform:translateX(-1px);}
        .pq1907 .pq-awning{position:absolute;left:0;right:0;top:0;height:22px;z-index:2;background:repeating-linear-gradient(90deg,#4a90d9 0 24px,#eaf3fb 24px 48px);border-bottom:2px solid #2f6bab;}
        .pq1907 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1907 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:10px;height:2px;background:rgba(90,54,20,.35);}

        .pq1907 .pq-card{position:absolute;left:50%;top:30px;transform:translateX(-50%);width:340px;max-width:calc(100% - 20px);z-index:3;display:flex;flex-direction:column;align-items:center;gap:8px;}
        .pq1907 .pq-known{display:inline-flex;align-items:center;gap:8px;padding:4px 14px;border-radius:999px;background:#e8f7ee;border:2px solid #1a7f43;box-shadow:0 2px 5px rgba(26,127,67,.16);}
        .pq1907 .pq-known .lab{font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:#2f8f52;}
        .pq1907 .pq-known .eq{font-size:19px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;}
        .pq1907 .pq-balloons{display:flex;align-items:flex-end;justify-content:center;gap:8px;}
        .pq1907 .pq-grp{position:relative;display:flex;flex-wrap:wrap;gap:3px 4px;justify-content:center;max-width:132px;}
        .pq1907 .pq-plus{font-size:22px;font-weight:900;color:#7a8794;align-self:center;flex:0 0 auto;}
        .pq1907 .pq-bw{position:relative;line-height:0;animation:pqBob 3s ease-in-out infinite;}
        .pq1907 .pq-bw:nth-child(2){animation-delay:-.5s;} .pq1907 .pq-bw:nth-child(3){animation-delay:-1s;}
        .pq1907 .pq-bw:nth-child(4){animation-delay:-1.5s;} .pq1907 .pq-bw:nth-child(5){animation-delay:-2s;}
        .pq1907 .pq-bw:nth-child(6){animation-delay:-2.5s;} .pq1907 .pq-bw:nth-child(7){animation-delay:-.8s;} .pq1907 .pq-bw:nth-child(8){animation-delay:-1.8s;}
        .pq1907 .pq-bw.fly{animation:pqFly 1.1s ease-in both;}
        .pq1907 .pq-cnt{position:absolute;top:-6px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}

        .pq1907 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1907 .pq-spark.s2{animation-delay:-.6s;} .pq1907 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1907 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1907 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #a9c6dc;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq1907 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1907 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1907 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#3f7dc4;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq1907 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1907 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1907 .pq-opt:hover:not(:disabled){border-color:#9fc0e6;transform:translateY(-2px);}
        .pq1907 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1907 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1907 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1907 .pq-opt:disabled{cursor:default;}
        .pq1907 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1907 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1907 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqFly{0%{opacity:1;transform:translateY(0) rotate(0);}30%{opacity:1;}100%{opacity:0;transform:translateY(-150px) rotate(12deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-awning" />
        <span className="pq-sun" />
        <span className="pq-window" />

        <div className="pq-card">
          <div className="pq-known">
            <span className="lab">{t.known}</span>
            <span className="eq">{ADD[0]} + {ADD[1]} = {SUM}</span>
          </div>
          <div className="pq-balloons">
            {/* A-guruh: 8 ko'k shar — qoladi; g'alabada 1..8 badge */}
            <div className="pq-grp">
              {GRP_A.map((b) => (
                <span key={'a' + b.i} className="pq-bw">
                  <Balloon c={b.c} size={26} />
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${b.i * 0.06}s` }}>{b.i + 1}</b>}
                </span>
              ))}
            </div>
            {!bGone && <span className="pq-plus">+</span>}
            {/* B-guruh: 5 qizil shar — g'alabada uchib ketadi (still holatida umuman yo'q) */}
            {!bGone && (
              <div className="pq-grp">
                {GRP_B.map((b) => (
                  <span key={'b' + b.i} className={'pq-bw' + (ok && !still ? ' fly' : '')} style={{ animationDelay: ok && !still ? `${b.i * 0.12}s` : undefined }}>
                    <Balloon c={b.c} size={26} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '60px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '120px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '46px' }}>✦</span>
        </>)}

        <span className="pq-counter" />
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{SUM}</b><i>−</i><b>{SUB}</b><i>=</i><b className="res">{ANS}</b></div>
        <div className="pq-sub">{ADD[0]} + {ADD[1]} = {SUM}, {t.demak} {SUM} − {SUB} = {ANS}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === ANS;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
