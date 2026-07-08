// Dars01 · Amaliyot 10 — P2 Raqamga mos to'plam · 🔴 · robotga quvvat · tag: match_reverse
// Chizilgan animatsion robot (nomsiz); har qutida ⚡ quvvat. Beshtalisini top — robot yonadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CARDS = [{ id: 'a', n: 3 }, { id: 'b', n: 5 }, { id: 'c', n: 2 }, { id: 'd', n: 4 }];
const CORRECT_ID = 'b';
const DATA = { target: CORRECT_ID, ptype: 'P2', level: '🔴', tag: 'match_reverse' };
const T = {
  uz: {
    eyebrow: 'Robot', title: 'Beshta quvvatni top',
    setup: 'Robotga beshta quvvat kerak.',
    ask: 'Qaysi qutida beshta ⚡ bor?',
    correct: 'Barakalla! Beshta quvvat. Robot yondi.', hint: 'Har qutidagi ⚡ ni sanang.',
  },
  ru: {
    eyebrow: 'Робот', title: 'Найди пять зарядов',
    setup: 'Роботу нужно пять зарядов.',
    ask: 'В какой коробке пять ⚡?',
    correct: 'Молодец! Пять зарядов. Робот зажёгся.', hint: 'Посчитай ⚡ в каждой коробке.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// chizilgan robot "Robi" — bo'sh holatда kulrang ko'zlar, quvvatlanganда (on) yashil yonadi
const Robi = ({ on }) => (
  <svg className={'pq-robi' + (on ? ' on' : '')} viewBox="0 0 110 128" width="104" height="120" role="img" aria-label="robot">
    <defs>
      <linearGradient id="d10metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef2f7" /><stop offset="1" stopColor="#c6d0dc" /></linearGradient>
    </defs>
    {/* antenna */}
    <line x1="55" y1="20" x2="55" y2="8" stroke="#9aa6b4" strokeWidth="3" strokeLinecap="round" />
    <circle className="pq-ant" cx="55" cy="6" r="5" />
    {/* bosh */}
    <rect x="26" y="18" width="58" height="44" rx="14" fill="url(#d10metal)" stroke="#9aa6b4" strokeWidth="2.5" />
    {/* ko'zlar */}
    <circle className="pq-r-eye" cx="43" cy="40" r="7" />
    <circle className="pq-r-eye" cx="67" cy="40" r="7" />
    {/* og'iz */}
    <rect x="44" y="52" width="22" height="5" rx="2.5" fill="#9aa6b4" />
    {/* tana */}
    <rect x="30" y="66" width="50" height="46" rx="12" fill="url(#d10metal)" stroke="#9aa6b4" strokeWidth="2.5" />
    {/* quvvat shkalasi */}
    <rect x="40" y="82" width="30" height="12" rx="6" fill="#dfe6ee" stroke="#b6c1cf" strokeWidth="1.5" />
    <rect className="pq-gauge" x="42" y="84" width="26" height="8" rx="4" fill="#2fd07a" />
    {/* oyoqlar */}
    <rect x="38" y="112" width="12" height="12" rx="4" fill="#b6c1cf" />
    <rect x="60" y="112" width="12" height="12" rx="4" fill="#b6c1cf" />
  </svg>
);

export default function D01_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.id != null) setPicked(initialAnswer.studentAnswer.id);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT_ID;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => `${c.n} ta`), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq10">
      <style>{`
        .pq10{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq10 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2aa39a;text-transform:uppercase;}
        .pq10 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq10 .pq-setup{color:#5c6672;font-weight:500;}
        .pq10 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq10 .pq-robowrap{display:flex;justify-content:center;margin-bottom:8px;}
        .pq10 .pq-robi{animation:pqBob 3s ease-in-out infinite;}
        .pq10 .pq-robi .pq-ant{fill:#c7ccd4;}
        .pq10 .pq-robi.on .pq-ant{fill:#ffd23f;animation:pqBlink .8s ease-in-out infinite;}
        .pq10 .pq-robi .pq-r-eye{fill:#8b98a8;}
        .pq10 .pq-robi.on{animation:pqBoot .6s ease;}
        .pq10 .pq-robi.on .pq-r-eye{fill:#2fd07a;filter:drop-shadow(0 0 4px #2fd07a);animation:pqEye 1.4s ease-in-out infinite;}
        .pq10 .pq-robi .pq-gauge{width:0;transition:width .1s;}
        .pq10 .pq-robi.on .pq-gauge{animation:pqFill .8s ease-out forwards;}
        .pq10 .pq-cards{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .pq10 .pq-card{position:relative;width:150px;min-height:150px;padding:30px 10px 14px;border-radius:20px;border:3px solid #cfe9e6;background:linear-gradient(#fff,#eefaf8);cursor:pointer;transition:.14s;display:flex;align-items:center;justify-content:center;}
        .pq10 .pq-card:hover:not(.lock){border-color:#8ed6cd;transform:translateY(-3px);}
        .pq10 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq10 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq10 .pq-card.lock{cursor:default;}
        .pq10 .pq-lamp{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;filter:grayscale(1) opacity(.45);transition:.3s;}
        .pq10 .pq-card.right .pq-lamp{filter:none;animation:pqGlow 1s ease-in-out infinite;}
        .pq10 .pq-cells{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:120px;}
        .pq10 .pq-cell{position:relative;width:32px;height:32px;border-radius:9px;background:radial-gradient(circle at 50% 35%,#fff6cc,#ffe27a);border:2px solid #f0c24a;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 0 rgba(255,210,63,.6);animation:pqSpark 1.6s ease-in-out infinite;}
        .pq10 .pq-tick{position:absolute;bottom:8px;right:8px;color:#1a7f43;}
        .pq10 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq10 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq10 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpark{0%,100%{transform:translateY(0) scale(1);box-shadow:0 0 3px rgba(255,190,40,.4);}50%{transform:translateY(-2px) scale(1.08);box-shadow:0 0 12px rgba(255,190,40,.85);}}
        @keyframes pqGlow{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.25);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
        @keyframes pqBoot{0%{transform:scale(.9);}55%{transform:scale(1.08);}100%{transform:scale(1);}}
        @keyframes pqBlink{0%,100%{opacity:1;}50%{opacity:.4;}}
        @keyframes pqEye{0%,100%{opacity:1;}50%{opacity:.65;}}
        @keyframes pqFill{from{width:0;}to{width:26px;}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-robowrap"><Robi on={ok} /></div>

      <div className="pq-cards">
        {CARDS.map((c) => {
          const sel = picked === c.id; const right = ok && c.id === CORRECT_ID;
          return (
            <div key={c.id} className={'pq-card' + (lock ? ' lock' : '') + (right ? ' right' : sel ? ' sel' : '')} onClick={() => { if (!lock) { setPicked(c.id); setFeedback(null); } }}>
              <span className="pq-lamp">💡</span>
              {right && <span className="pq-tick"><IconOk /></span>}
              <div className="pq-cells">
                {Array.from({ length: c.n }).map((_, i) => (<span key={i} className="pq-cell" style={{ animationDelay: `${i * 0.16}s` }}>⚡</span>))}
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
