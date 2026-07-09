// Dars05 · Amaliyot 03 — P5 «Yopiq likopcha» (yopiq qismni top) · 🟢 · tag: compose_covered
// Jami 4 suyak: 1 tasi ochiq likopchada, 3 tasi kumush qopqoq ostida. G'alabada qopqoq ko'tariladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { total: 4, shown: 1, target: 3, options: [2, 3, 4], ptype: 'P5', level: '🟢', tag: 'compose_covered' };
const T = {
  uz: {
    eyebrow: 'Sirk · Kuchikcha', title: 'Yopiq likopcha',
    setup: 'Kuchikchaga 4 ta suyak berildi. Bittasi ochiq likopchada, qolgani yopiq likopcha ostida.',
    ask: 'Yopiq likopcha ostida nechta suyak bor?',
    correct: 'Barakalla! Bir va yana uch — to\'rtta. Kuchikcha xursand!',
    hint: 'Jami 4 ta suyak. Ochiqda 1 ta bor — yopiq ostida nechta qolganini o\'ylang.',
  },
  ru: {
    eyebrow: 'Цирк · Щенок', title: 'Накрытая тарелка',
    setup: 'Щенку дали 4 косточки. Одна на открытой тарелке, остальные — под накрытой.',
    ask: 'Сколько косточек под накрытой тарелкой?',
    correct: 'Молодец! Одна и ещё три — четыре. Щенок рад!',
    hint: 'Всего 4 косточки. На открытой лежит 1 — подумай, сколько осталось под накрытой.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Likopcha: kulrang-oq «gradient» taassuroti qatlamli ellipslar bilan (defs/id yo'q — ikki nusxada xavfsiz).
const Plate = () => (
  <svg viewBox="0 0 132 40" width="132" height="40" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="66" cy="20" rx="63" ry="17" fill="#c9d0d8" stroke="#98a2ad" strokeWidth="1.6" />
    <ellipse cx="66" cy="18.6" rx="61" ry="15.4" fill="#edf0f3" />
    <ellipse cx="66" cy="20.5" rx="43" ry="10.4" fill="#d7dde3" />
    <ellipse cx="66" cy="19.6" rx="40.5" ry="9" fill="#f8fafb" />
    <ellipse cx="40" cy="12.5" rx="15" ry="3.4" fill="#fff" opacity=".75" />
  </svg>
);

// Suyak: oq-krem, ikki uchida dumaloq bo'rtiq. Ikki qatlam usuli: pastda yo'g'on-shtrixli
// kontur-qatlam, ustida fill-qatlam (ichki kesishma chiziqlari ko'rinmaydi), tepa-chapda blik.
const Bone = () => (
  <svg viewBox="0 0 46 20" width="36" height="16" aria-hidden="true" style={{ display: 'block' }}>
    <g fill="#f6efdd" stroke="#b9a878" strokeWidth="3" strokeLinejoin="round">
      <circle cx="7" cy="6.4" r="4.7" />
      <circle cx="7" cy="13.6" r="4.7" />
      <circle cx="39" cy="6.4" r="4.7" />
      <circle cx="39" cy="13.6" r="4.7" />
      <rect x="7" y="6.2" width="32" height="7.6" rx="3.8" />
    </g>
    <g fill="#f6efdd">
      <circle cx="7" cy="6.4" r="4.7" />
      <circle cx="7" cy="13.6" r="4.7" />
      <circle cx="39" cy="6.4" r="4.7" />
      <circle cx="39" cy="13.6" r="4.7" />
      <rect x="7" y="6.2" width="32" height="7.6" rx="3.8" />
    </g>
    <path d="M12 13.8 Q23 15.8 34 13.8" stroke="#e4d7b4" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <ellipse cx="6" cy="4.8" rx="1.9" ry="1.1" fill="#fff" opacity=".85" />
  </svg>
);

// Kumush qopqoq: gumbaz + tutqich + katta blik; g'alabagacha sekin pulslanadi.
const Lid = () => (
  <svg viewBox="0 0 124 66" width="116" height="62" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="59" y="8" width="6" height="9" rx="2" fill="#9aa4b0" stroke="#7d8894" strokeWidth="1.4" />
    <path d="M12 58 Q12 20 62 17 Q112 20 112 58 Z" fill="#c3cad3" stroke="#7d8894" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M20 54 Q23 27 52 20 Q32 28 28 54 Z" fill="#eef1f5" opacity=".95" />
    <path d="M96 52 Q94 30 78 22 Q98 27 102 52 Z" fill="#aab3be" opacity=".8" />
    {/* shine-sweep: qopqoq bo'ylab bir o'tadigan och chiziqlar (dekorativ) */}
    <g className="pq-shine">
      <path d="M8 52 L20 22 L26 22 L14 52 Z" fill="#fff" opacity=".8" />
      <path d="M18 52 L30 22 L33 22 L21 52 Z" fill="#fff" opacity=".5" />
    </g>
    <ellipse cx="62" cy="58" rx="54" ry="5.6" fill="#aeb7c1" stroke="#7d8894" strokeWidth="1.6" />
    <ellipse cx="62" cy="7.5" rx="9.5" ry="5" fill="#d6dce3" stroke="#7d8894" strokeWidth="1.6" />
    <ellipse cx="59" cy="6" rx="3.6" ry="1.7" fill="#fff" opacity=".85" />
  </svg>
);

// Quvnoq sirk iti (chapga, likopchalarga qaraydi): jigarrang 2 ton, osilgan quloq,
// chiqarilgan til, qizil bo'yinbog' + oltin nishon; dumi .pq-dtail likillaydi.
const Dog = () => (
  <svg viewBox="0 0 96 86" width="68" height="61" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-dtail">
      <path d="M73 54 Q86 48 87 34 Q94 46 83 60 Q77 65 72 60 Z" fill="#8a5a2b" stroke="#5f3f1e" strokeWidth="1.5" strokeLinejoin="round" />
    </g>
    <ellipse cx="58" cy="62" rx="21" ry="17.5" fill="#a9743f" stroke="#5f3f1e" strokeWidth="1.7" />
    <ellipse cx="55" cy="66" rx="12" ry="9.6" fill="#c08a4e" />
    <ellipse cx="64" cy="78" rx="9.5" ry="4" fill="#8a5a2b" stroke="#5f3f1e" strokeWidth="1.4" />
    <path d="M31 44 Q26 60 27.5 73 Q27.5 78.5 32.5 78.5 L39 78.5 Q42 78.5 42 74.5 L42 52 Z" fill="#a9743f" stroke="#5f3f1e" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="36" cy="77.5" rx="7.2" ry="3.4" fill="#c08a4e" stroke="#5f3f1e" strokeWidth="1.3" />
    <ellipse cx="40" cy="57" rx="6.6" ry="10" fill="#e8cfa4" />
    <path d="M28 45 Q37 50 46 46" fill="none" stroke="#d9534b" strokeWidth="4.6" strokeLinecap="round" />
    <circle cx="37" cy="50.5" r="2.2" fill="#f2b134" stroke="#b97c14" strokeWidth="1" />
    <circle cx="33" cy="27" r="16.5" fill="#a9743f" stroke="#5f3f1e" strokeWidth="1.7" />
    <ellipse cx="20.5" cy="34" rx="9.6" ry="7" fill="#e8cfa4" stroke="#5f3f1e" strokeWidth="1.4" />
    <ellipse cx="14" cy="31" rx="3.2" ry="2.7" fill="#3a2a18" />
    <ellipse cx="13" cy="30" rx="1" ry=".8" fill="#fff" opacity=".8" />
    <path d="M15 37.5 Q19.5 40.5 24.5 39" fill="none" stroke="#5f3f1e" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M19.5 40.5 Q20 46.5 24.5 45.8 Q27 45 25.5 40.2 Z" fill="#e8798a" stroke="#c05568" strokeWidth="1" strokeLinejoin="round" />
    <circle cx="29" cy="22.5" r="2.9" fill="#1f2430" />
    <circle cx="30" cy="21.6" r="1" fill="#fff" />
    {/* qovoq: tana-rang, pirpiratishda opacity 0→1 */}
    <rect className="pq-dblink" x="25.4" y="18.9" width="7.2" height="7.2" rx="3.6" fill="#a9743f" />
    <circle cx="29.5" cy="16.8" r="1.5" fill="#8a5a2b" />
    <g className="pq-dear">
      <path d="M42 12 Q52 15 51.5 29 Q51 39 44 39.5 Q39.5 39 40.5 28 Q41 18 42 12 Z" fill="#8a5a2b" stroke="#5f3f1e" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M44 17 Q48.5 20 48 30" stroke="#5f3f1e" strokeWidth="1" fill="none" opacity=".4" />
    </g>
  </svg>
);

export default function D05_03(props) {
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
    <div className="pq pq0503">
      <style>{`
        .pq0503{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0503 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c8452e;text-transform:uppercase;}
        .pq0503 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0503 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0503 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0503 .pq-stage{position:relative;width:min(430px,100%);margin:0 auto;padding:64px 12px 14px;border-radius:20px;background:linear-gradient(#fdf3e2 0%,#fbe9d2 70%,#f6ddc0 100%);border:2px solid #eed6b4;overflow:hidden;}
        .pq0503 .pq-awn{position:absolute;top:0;left:0;right:0;height:13px;background:repeating-linear-gradient(90deg,#d9534b 0 26px,#fdf6ec 26px 52px);border-bottom:2px solid #c8452e;opacity:.92;}
        .pq0503 .pq-awn::after{content:'';position:absolute;top:100%;left:0;right:0;height:9px;background:radial-gradient(circle at 13px -2px,#d9534b 0 10px,rgba(0,0,0,0) 10.6px) 0 0/52px 9px repeat-x,radial-gradient(circle at 13px -2px,#fdf6ec 0 10px,rgba(0,0,0,0) 10.6px) 26px 0/52px 9px repeat-x;filter:drop-shadow(0 1px 0 rgba(200,69,46,.3));transform-origin:50% 0;animation:pqBreath 4.5s ease-in-out infinite;}
        .pq0503 .pq-inner{display:flex;align-items:flex-end;justify-content:center;gap:6px;}
        .pq0503 .pq-plate{position:relative;width:132px;height:40px;flex-shrink:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0503 .pq-plate.win{animation:pqCele .5s .9s ease;}
        .pq0503 .pq-bones{position:absolute;left:0;right:0;bottom:17px;display:flex;justify-content:center;gap:3px;z-index:1;}
        .pq0503 .pq-bone{position:relative;line-height:0;}
        .pq0503 .pq-bone svg{animation:pqBoneW 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 60%;}
        .pq0503 .pq-bone:nth-child(2) svg{animation-delay:-1.2s;}
        .pq0503 .pq-bone:nth-child(3) svg{animation-delay:-2.1s;}
        .pq0503 .pq-bone.pop{animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0503 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0503 .pq-lid{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:2;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));}
        .pq0503 .pq-lid svg{animation:pqPulse 1.7s ease-in-out infinite;transform-origin:50% 100%;}
        .pq0503 .pq-shine{opacity:0;animation:pqShine 3.5s ease-in-out infinite;}
        .pq0503 .pq-lid.up{animation:pqLidUp 1s cubic-bezier(.35,1.2,.5,1) both;z-index:3;}
        .pq0503 .pq-lid.up svg{animation:none;}
        .pq0503 .pq-lid.up .pq-shine{animation:none;opacity:0;}
        .pq0503 .pq-dog{flex-shrink:0;animation:pqBob 2.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0503 .pq-dog.joy{animation:pqJoy .55s ease 2;}
        .pq0503 .pq-dtail{transform-box:fill-box;transform-origin:8% 85%;animation:pqWag .8s ease-in-out infinite;}
        .pq0503 .pq-dog.joy .pq-dtail{animation-duration:.35s;}
        .pq0503 .pq-dear{transform-box:fill-box;transform-origin:50% 8%;animation:pqEar 4.2s ease-in-out infinite;}
        .pq0503 .pq-dblink{opacity:0;animation:pqBlink 3.4s linear infinite;}
        .pq0503 .pq-chip{position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s .9s cubic-bezier(.3,1.5,.5,1) both;z-index:4;white-space:nowrap;}
        .pq0503 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0503 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0503 .pq-opt:hover:not(:disabled){border-color:#eec6a8;transform:translateY(-2px);}
        .pq0503 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0503 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0503 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0503 .pq-opt:disabled{cursor:default;}
        .pq0503 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0503 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0503 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
        @keyframes pqLidUp{0%{transform:translateX(-50%) translateY(0) rotate(0);opacity:1;}55%{transform:translateX(-34%) translateY(-58px) rotate(13deg);opacity:1;}100%{transform:translateX(-26%) translateY(-50px) rotate(17deg);opacity:.35;}}
        @keyframes pqWag{0%,100%{transform:rotate(-12deg);}50%{transform:rotate(20deg);}}
        @keyframes pqEar{0%,86%,100%{transform:rotate(0);}89%{transform:rotate(-9deg);}93%{transform:rotate(7deg);}96%{transform:rotate(-3deg);}}
        @keyframes pqBlink{0%,87%,99%,100%{opacity:0;}90%,96%{opacity:1;}}
        @keyframes pqShine{0%{transform:translateX(-4px);opacity:0;}7%{opacity:.65;}24%{transform:translateX(78px);opacity:0;}100%{transform:translateX(78px);opacity:0;}}
        @keyframes pqBoneW{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}}
        @keyframes pqBreath{0%,100%{transform:scaleY(1);}50%{transform:scaleY(1.18);}}
        @keyframes pqJoy{0%,100%{transform:translateY(0);}40%{transform:translateY(-10px);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-awn" />
        {ok && <span className="pq-chip">{DATA.shown} + {DATA.target} = {DATA.total}</span>}
        <div className="pq-inner">
          {/* chap — ochiq likopcha: 1 suyak (badge 1) */}
          <div className="pq-plate">
            <div className="pq-bones">
              <span className="pq-bone"><Bone />{ok && <b className="pq-cnt" style={{ animationDelay: '.25s' }}>1</b>}</span>
            </div>
            <Plate />
          </div>
          {/* o'ng — yopiq likopcha: qopqoq ko'tarilgach 3 suyak (badge 2..4) */}
          <div className={'pq-plate' + (ok ? ' win' : '')}>
            <div className="pq-bones">
              {ok && Array.from({ length: DATA.target }).map((_, i) => (
                <span key={i} className="pq-bone pop" style={{ animationDelay: `${0.5 + i * 0.16}s` }}>
                  <Bone /><b className="pq-cnt" style={{ animationDelay: `${0.75 + i * 0.16}s` }}>{DATA.shown + i + 1}</b>
                </span>
              ))}
            </div>
            <Plate />
            <div className={'pq-lid' + (ok ? ' up' : '')}><Lid /></div>
          </div>
          <div className={'pq-dog' + (ok ? ' joy' : '')}><Dog /></div>
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
