// Dars18 · Amaliyot 07 — Tenglik-balans «Olma bozori» · 🔴 · tag: logic_balance
// YANGI mantiq turi: tenglik-kompensatsiya. Ikki lagan (tarozi) teng bo'lsin.
// Chap lagan: sakkiz + besh olma = o'n uch. O'ng lagan: to'qqiz olma + bo'sh joy.
// "8 + 5 = 9 + ?" → o'ng tomon ham o'n uch bo'lishi uchun yana nechta olma kerak? → 4.
// G'alaba: o'ngga to'rt olma tushadi (13), ikki lagan tenglashadi, tarozi tekislanadi.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT_A = 8, LEFT_B = 5, RIGHT_BASE = 9, ANS = 4, TARGET = 13;
const DATA = { left: [LEFT_A, LEFT_B], right: RIGHT_BASE, ans: ANS, target: TARGET, options: [3, 4, 5], ptype: 'LOGIC', level: '🔴', tag: 'logic_balance' };

// Olma palitrasi — qizil / yashil (kanon: qizil #d9534b, yashil #57a84f).
const RED = { main: '#d9534b', light: '#f0908a', dark: '#a83c35' };
const GREEN = { main: '#57a84f', light: '#8fca88', dark: '#3f8038' };

// Chap lagan: sakkiz qizil + besh yashil (8 + 5 bo'linishi ko'rinadi).
const LEFT = Array.from({ length: LEFT_A + LEFT_B }).map((_, i) => ({ i, c: i < LEFT_A ? RED : GREEN }));
// O'ng lagan: to'qqiz qizil (doim) + to'rt yashil (faqat g'alabada tushadi).
const RIGHT_BASE_ARR = Array.from({ length: RIGHT_BASE }).map((_, i) => ({ i, c: RED }));
const RIGHT_ADD = Array.from({ length: ANS }).map((_, i) => ({ i, c: GREEN }));

const T = {
  uz: {
    eyebrow: "Olma bozori · Tenglik", title: "Ikki lagan teng bo'lsin",
    setup: "Chap laganda sakkizta va yana beshta olma bor — hammasi o'n uchta. O'ng laganda to'qqizta olma turibdi.",
    ask: "Ikki tomon teng bo'lsin: 8 + 5 = 9 + ?",
    correct: "Barakalla! Chap tomon o'n uchta, o'ng tomonga to'rtta qo'shsak — to'qqiz va to'rt — o'n uchta. Ikki lagan teng!",
    hint: "Chap tomon nechta? O'ng tomon ham shuncha bo'lsin — to'qqizga yana nechta qo'shsangiz teng bo'ladi?",
    leftTag: "8 + 5", rightTagQ: "9 + ?",
  },
  ru: {
    eyebrow: "Яблочный рынок · Равенство", title: "Пусть чаши будут равны",
    setup: "На левой чаше восемь и ещё пять яблок — всего тринадцать. На правой чаше лежат девять яблок.",
    ask: "Пусть стороны будут равны: 8 + 5 = 9 + ?",
    correct: "Молодец! Слева тринадцать, а справа добавим четыре — девять и четыре — тринадцать. Чаши равны!",
    hint: "Сколько слева? Пусть справа будет столько же — сколько добавить к девяти, чтобы стало поровну?",
    leftTag: "8 + 5", rightTagQ: "9 + ?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — radial 2-ton doira + oq blik,
// tepada jigarrang bandcha + yashil barg. Bitta olma = bitta birlik.
let __gid = 0;
const Apple = ({ c, size = 24 }) => {
  const id = 'ap1807' + (__gid++);
  return (
    <svg viewBox="0 0 32 34" width={size} height={size * 34 / 32} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* bandcha */}
      <path d="M16 8 Q15 3 17 1" stroke="#7a4a24" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* barg */}
      <path d="M17 6 Q23 2 24.5 8 Q18.5 9.5 17 6 Z" fill="#5ba84f" stroke="#3f8038" strokeWidth=".5" />
      {/* tana (ikki bo'lak) */}
      <path d="M16 9 C10 9 6 13 6 19.5 C6 27.5 11 32.5 16 32.5 C21 32.5 26 27.5 26 19.5 C26 13 22 9 16 9 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="12" cy="15" rx="3.1" ry="2.1" fill="#fff" opacity=".55" transform="rotate(-26 12 15)" />
    </svg>
  );
};

export default function D18_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda olma-tushish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
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

  return (
    <div className="pq pq1807">
      <style>{`
        .pq1807{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1807 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1807 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1807 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1807 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq1807 .pq-scene{position:relative;width:396px;max-width:100%;height:262px;margin:0 auto;border-radius:20px;background:linear-gradient(#eaf6ff 0%,#dcefff 52%,#cfe8fb 100%);border:2px solid #bcdcf2;overflow:hidden;}
        .pq1807 .pq-sun{position:absolute;left:16px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1807 .pq-awning{position:absolute;left:0;right:0;top:0;height:26px;background:repeating-linear-gradient(90deg,#d9534b 0 22px,#fff5f2 22px 44px);border-bottom:3px solid #a83c35;z-index:2;box-shadow:0 3px 5px rgba(0,0,0,.14);}
        .pq1807 .pq-awning::after{content:'';position:absolute;left:0;right:0;top:26px;height:9px;background:repeating-linear-gradient(90deg,#d9534b 0 22px,#fff5f2 22px 44px);clip-path:polygon(0 0,100% 0,100% 0,91% 100%,82% 0,73% 100%,64% 0,55% 100%,46% 0,37% 100%,28% 0,19% 100%,10% 0,0 100%);opacity:.96;}
        .pq1807 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1807 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:11px;height:2px;background:rgba(90,54,20,.35);}
        .pq1807 .pq-board{position:absolute;top:40px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 14px 5px;border-radius:10px;background:linear-gradient(#57a84f,#3f8038);border:2.5px solid #2f6b2a;color:#f2fff0;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);}

        /* Tarozi indikatori (dekorativ) — chap og'ir, g'alabada tekislanadi */
        .pq1807 .pq-scale{position:absolute;top:68px;left:50%;transform:translateX(-50%);width:86px;height:34px;z-index:5;}
        .pq1807 .pq-scale .beam{position:absolute;left:8px;right:8px;top:6px;height:5px;border-radius:3px;background:linear-gradient(#e7b45a,#c98a2f);border:1px solid #a06a1f;transform-origin:50% 50%;transform:rotate(-9deg);transition:transform .55s cubic-bezier(.34,1.3,.5,1);}
        .pq1807 .pq-scale.lvl .beam{transform:rotate(0deg);}
        .pq1807 .pq-scale .beam::before,.pq1807 .pq-scale .beam::after{content:'';position:absolute;top:2px;width:8px;height:8px;border-radius:50%;background:#c98a2f;border:1px solid #a06a1f;}
        .pq1807 .pq-scale .beam::before{left:-3px;} .pq1807 .pq-scale .beam::after{right:-3px;}
        .pq1807 .pq-scale .post{position:absolute;left:50%;top:6px;width:4px;height:24px;background:linear-gradient(#b98235,#8a5628);transform:translateX(-2px);border-radius:2px;}
        .pq1807 .pq-scale .base{position:absolute;left:50%;bottom:0;width:34px;height:6px;border-radius:3px;background:#8a5628;transform:translateX(-50%);}
        .pq1807 .pq-scale .cmp{position:absolute;left:50%;top:-15px;transform:translateX(-50%);font-size:15px;font-weight:900;color:#c0392b;font-variant-numeric:tabular-nums;}
        .pq1807 .pq-scale.lvl .cmp{color:#1a7f43;}

        .pq1807 .pq-arena{position:absolute;left:6px;right:6px;top:104px;bottom:34px;display:flex;align-items:flex-start;justify-content:center;gap:6px;z-index:3;}
        .pq1807 .pq-side{display:flex;flex-direction:column;align-items:center;gap:4px;flex:0 0 auto;}
        .pq1807 .pq-lagan{position:relative;width:150px;min-height:92px;padding:8px 8px 12px;border-radius:12px 12px 46% 46%/12px 12px 30% 30%;background:linear-gradient(#f2ddb8,#dcbf88);border:2.5px solid #b98f52;box-shadow:0 6px 12px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.4);}
        .pq1807 .pq-lagan.win{animation:pqBoxCele .55s ease;}
        .pq1807 .pq-apples{display:flex;flex-wrap:wrap;align-content:flex-start;justify-content:center;gap:2px;}
        .pq1807 .pq-aw{line-height:0;}
        .pq1807 .pq-aw.in{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;animation-delay:var(--dd,0s);}
        .pq1807 .pq-plus{align-self:center;font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;padding-top:30px;}
        .pq1807 .pq-tag{font-size:13px;font-weight:900;color:#7a5320;background:rgba(255,255,255,.78);padding:2px 12px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 1px 2px rgba(0,0,0,.12);}
        .pq1807 .pq-tag.q{color:#c0392b;}
        .pq1807 .pq-tag.g{color:#1a7f43;}

        .pq1807 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1807 .pq-spark.s2{animation-delay:-.6s;} .pq1807 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1807 .pq-eq{display:flex;justify-content:center;align-items:center;gap:5px;margin-top:14px;flex-wrap:wrap;animation:pqIn .3s ease both;}
        .pq1807 .pq-eq b{min-width:32px;height:38px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1807 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1807 .pq-eq i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}

        .pq1807 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq1807 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1807 .pq-opt:hover:not(:disabled){border-color:#8fca88;transform:translateY(-2px);}
        .pq1807 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1807 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1807 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1807 .pq-opt:disabled{cursor:default;}
        .pq1807 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1807 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1807 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-46px) scale(.85);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-awning" />
        <div className="pq-board">{t.title}</div>

        <div className={'pq-scale' + (ok ? ' lvl' : '')}>
          <span className="cmp">{ok ? '=' : '?'}</span>
          <span className="beam" />
          <span className="post" />
          <span className="base" />
        </div>

        <div className="pq-arena">
          {/* Chap lagan: 8 qizil + 5 yashil = 13 */}
          <div className="pq-side">
            <div className={'pq-lagan' + (ok ? ' win' : '')}>
              <div className="pq-apples">
                {LEFT.map((s) => (
                  <span key={s.i} className="pq-aw"><Apple c={s.c} size={24} /></span>
                ))}
              </div>
            </div>
            <span className="pq-tag">{t.leftTag}</span>
          </div>

          <span className="pq-plus">=</span>

          {/* O'ng lagan: 9 qizil doim; g'alabada 4 yashil tushadi */}
          <div className="pq-side">
            <div className={'pq-lagan' + (ok ? ' win' : '')}>
              <div className="pq-apples">
                {RIGHT_BASE_ARR.map((s) => (
                  <span key={'b' + s.i} className="pq-aw"><Apple c={s.c} size={24} /></span>
                ))}
                {ok && RIGHT_ADD.map((s) => (
                  <span key={'a' + s.i} className={'pq-aw' + (!still ? ' in' : '')} style={{ '--dd': `${s.i * 0.15}s` }}>
                    <Apple c={s.c} size={24} />
                  </span>
                ))}
              </div>
            </div>
            <span className={'pq-tag ' + (ok ? 'g' : 'q')}>{ok ? `9 + ${ANS}` : t.rightTagQ}</span>
          </div>
        </div>

        <span className="pq-counter" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '120px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '132px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '96px' }}>✦</span>
        </>)}
      </div>

      {ok && (
        <div className="pq-eq"><b>{LEFT_A}</b><i>+</i><b>{LEFT_B}</b><i>=</i><b>{RIGHT_BASE}</b><i>+</i><b>{ANS}</b><i>=</i><b className="res">{TARGET}</b></div>
      )}

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
