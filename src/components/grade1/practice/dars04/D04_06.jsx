// Dars04 · Amaliyot 06 — P4 Sonlarni taqqoslash · 🟢 · Anvar · tag: compare_digits
// Jirafalar bo'yi: predmetsiz, faqat SONLAR — 8 va 6, kattasini bos.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CARDS = [{ id: 'a', n: 8 }, { id: 'b', n: 6 }];
const CORRECT_ID = 'a';
const DATA = { ptype: 'P4', level: '🟢', tag: 'compare_digits' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Anvar', title: 'Qaysi son katta?',
    setup: 'Jirafalarning bo\'yini o\'lchashdi. Anvar kartalarga sonlarni yozdi.',
    ask: 'Qaysi son KATTA? Kartani bosing.',
    correct: 'Barakalla! Sakkiz oltidan katta — baland jirafa g\'olib.', hint: 'Sonlarni tartib bilan ayting: qaysinisi keyin keladi — o\'sha katta.',
  },
  ru: {
    eyebrow: 'Зоопарк · Анвар', title: 'Какое число больше?',
    setup: 'Жирафам измерили рост. Анвар записал числа на карточки.',
    ask: 'Какое число БОЛЬШЕ? Нажми на карточку.',
    correct: 'Молодец! Восемь больше шести — высокий жираф победил.', hint: 'Назови числа по порядку: какое идёт позже — то и больше.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan jirafa (yon ko'rinish, o'ngga qaragan): sariq tana + ochroq qorin,
// jigarrang dog'lar, uzun bo'yin + yol (mane), kichik shoxchalar (ossikon),
// quloq, blikli ko'z, tuyoqlar, qimirlaydigan dum. Chapga qarash — mirror (scaleX(-1)).
const Giraffe = ({ w = 59, h = 80, mirror }) => (
  <svg viewBox="0 0 74 100" width={w} height={h} className={'pq-girsvg' + (mirror ? ' mirror' : '')} aria-hidden="true">
    <g className="pq-tail">
      <path d="M16 56 Q9 66 10.5 76" stroke="#e0a93c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="10.5" cy="80" rx="3.2" ry="5" fill="#8a5a1a" />
    </g>
    <path d="M24 68 L23 88" stroke="#d9a139" strokeWidth="6" strokeLinecap="round" />
    <path d="M46 68 L47 88" stroke="#d9a139" strokeWidth="6" strokeLinecap="round" />
    <rect x="19.6" y="87" width="6.8" height="6" rx="2" fill="#5c3f18" />
    <rect x="43.6" y="87" width="6.8" height="6" rx="2" fill="#5c3f18" />
    <path d="M46 58 Q50 32 55 16 L64 19 Q59 40 58 60 Z" fill="#f2c14e" stroke="#a8641f" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M54.5 15 Q49.5 33 45.8 56" stroke="#a8641f" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M54 10.5 Q47.5 6.5 46.5 11.5 Q50 14.5 54.5 12.5 Z" fill="#f2c14e" stroke="#a8641f" strokeWidth="1.2" strokeLinejoin="round" />
    <ellipse cx="50.5" cy="10.5" rx="2.2" ry="1.3" fill="#d9a139" />
    <ellipse cx="61" cy="14" rx="8.4" ry="6.8" fill="#f2c14e" stroke="#a8641f" strokeWidth="1.5" />
    <ellipse cx="67" cy="16" rx="5.2" ry="4.2" fill="#f9dd8f" />
    <circle cx="68.6" cy="14.8" r="0.9" fill="#8a5a1a" />
    <path d="M64 19 Q67 20.6 70 19" stroke="#8a5a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
    <circle cx="59.5" cy="12" r="2" fill="#1f2430" />
    <circle cx="60.3" cy="11.3" r="0.7" fill="#fff" />
    <line x1="57.5" y1="8.5" x2="57" y2="5.2" stroke="#b5762a" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="62.5" y1="8" x2="63" y2="4.8" stroke="#b5762a" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="56.9" cy="4.2" r="1.8" fill="#8a5a1a" />
    <circle cx="63.1" cy="3.8" r="1.8" fill="#8a5a1a" />
    <ellipse cx="36" cy="60" rx="22" ry="13.5" fill="#f2c14e" stroke="#a8641f" strokeWidth="1.5" />
    <ellipse cx="38" cy="66" rx="15" ry="7" fill="#f9dd8f" />
    <ellipse cx="26" cy="56" rx="4" ry="3.2" fill="#b5762a" opacity=".9" />
    <ellipse cx="36" cy="53" rx="3.6" ry="3" fill="#b5762a" opacity=".9" />
    <ellipse cx="47" cy="60" rx="3.2" ry="2.7" fill="#b5762a" opacity=".9" />
    <ellipse cx="30" cy="64" rx="3" ry="2.5" fill="#b5762a" opacity=".9" />
    <circle cx="51" cy="30" r="2.2" fill="#b5762a" opacity=".9" />
    <circle cx="54" cy="22" r="1.8" fill="#b5762a" opacity=".9" />
    <circle cx="49.5" cy="42" r="2.4" fill="#b5762a" opacity=".9" />
    <circle cx="48" cy="52" r="2.6" fill="#b5762a" opacity=".9" />
    <path d="M28 68 L27 90" stroke="#f2c14e" strokeWidth="6.4" strokeLinecap="round" />
    <path d="M50 68 L51 90" stroke="#f2c14e" strokeWidth="6.4" strokeLinecap="round" />
    <rect x="23.2" y="89" width="7.6" height="6.6" rx="2" fill="#6b4a1e" />
    <rect x="47.2" y="89" width="7.6" height="6.6" rx="2" fill="#6b4a1e" />
  </svg>
);

export default function D04_06(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => String(c.n)), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0406">
      <style>{`
        .pq0406{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0406 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c2a13a;text-transform:uppercase;}
        .pq0406 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0406 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0406 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0406 .pq-stage{position:relative;display:flex;gap:26px;justify-content:center;align-items:flex-end;}
        .pq0406 .pq-col{display:flex;flex-direction:column;align-items:center;gap:8px;}
        .pq0406 .pq-gir{line-height:0;animation:pqSway 3s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0406 .pq-gir.short{animation-delay:1.2s;}
        .pq0406 .pq-girsvg{display:block;}
        .pq0406 .pq-girsvg.mirror{transform:scaleX(-1);}
        .pq0406 .pq-tail{transform-box:fill-box;transform-origin:60% 6%;animation:pqTail 2.6s ease-in-out infinite;}
        .pq0406 .pq-card{width:96px;height:110px;border-radius:18px;border:3px solid #ead9ae;background:linear-gradient(#fff,#fbf6e8);display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:900;color:#8a6d1f;cursor:pointer;transition:.14s;font-variant-numeric:tabular-nums;animation:pqFloat 4s ease-in-out infinite;}
        .pq0406 .pq-card.c2{animation-delay:.7s;}
        .pq0406 .pq-card:hover:not(.lock){border-color:#d9ba62;transform:translateY(-3px);}
        .pq0406 .pq-card.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0406 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0406 .pq-card.lock{cursor:default;}
        .pq0406 .pq-chip{position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:2;white-space:nowrap;}
        .pq0406 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0406 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0406 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqTail{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(7deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        {ok && <span className="pq-chip">8 &gt; 6</span>}
        <div className="pq-col">
          <span className="pq-gir tall"><Giraffe w={59} h={80} /></span>
          <div className={'pq-card c1' + (lock ? ' lock' : '') + (ok && CORRECT_ID === 'a' ? ' right' : picked === 'a' ? ' sel' : '')} onClick={() => { if (!lock) { setPicked('a'); setFeedback(null); } }}>{CARDS[0].n}</div>
        </div>
        <div className="pq-col">
          <span className="pq-gir short"><Giraffe w={41} h={56} mirror /></span>
          <div className={'pq-card c2' + (lock ? ' lock' : '') + (picked === 'b' && !ok ? ' sel' : '')} onClick={() => { if (!lock) { setPicked('b'); setFeedback(null); } }}>{CARDS[1].n}</div>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
