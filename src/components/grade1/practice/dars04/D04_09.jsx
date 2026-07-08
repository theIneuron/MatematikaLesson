// Dars04 · Amaliyot 09 — P4 Ko'p-tanlov: 5 < ▢ · 🔴 · Ra'no · tag: inequality_multi
// Sirli qafas: 5 dan katta BARCHA sonlarni top (6 va 9). Bir emas, bir nechta to'g'ri javob.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const BASE = 5;
const CARDS = [3, 6, 5, 9];
const GOOD = CARDS.filter((n) => n > BASE); // [6, 9]
const DATA = { ptype: 'P4', level: '🔴', tag: 'inequality_multi' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Ra\'no', title: 'Sirli qafas',
    setup: 'Sirli qafas eshigida yozuv bor: 5 < ▢. Uni faqat mos sonlar ochadi.',
    ask: 'Katakka mos keladigan BARCHA sonlarni bosing.',
    correct: 'Barakalla! Eshik ochildi — ichida tovuslar bor ekan!',
    hint: 'Beshdan katta sonlarnigina tanlang — va bittasini ham qoldirmang.',
  },
  ru: {
    eyebrow: 'Зоопарк · Рано', title: 'Загадочная клетка',
    setup: 'На двери загадочной клетки надпись: 5 < ▢. Её открывают только подходящие числа.',
    ask: 'Нажми на ВСЕ числа, которые подходят в окошко.',
    correct: 'Молодец! Дверь открылась — а там павлины!',
    hint: 'Выбирай только числа больше пяти — и не пропусти ни одного.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan tovus (old ko'rinish): ko'k tana-bo'yin, toj-patlar, yoyilgan yelpig'ich
// dum — yashil-ko'k patlar halqasi, har patda blikli "ko'z" dog'i. Patlar paydo
// bo'lganda asosidan ketma-ket ochiladi (pqFan), so'ng yelpig'ich sekin tebranadi (pqSway).
const FAN = [-66, -44, -22, 0, 22, 44, 66];
const Peacock = ({ d = 0 }) => (
  <svg viewBox="0 0 96 84" width="66" height="58" aria-hidden="true" style={{ display: 'block' }}>
    <g transform="translate(48 62)">
      <g className="pq-fansway">
        {FAN.map((a, i) => (
          <g key={a} transform={`rotate(${a})`}>
            <g className="pq-feather" style={{ animationDelay: `${(d + 0.2 + i * 0.09).toFixed(2)}s` }}>
              <path d="M0 0 Q-7.5 -24 0 -46 Q7.5 -24 0 0 Z" fill="#2fa273" stroke="#1d7d57" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M0 -7 Q-4.2 -22 0 -39 Q4.2 -22 0 -7 Z" fill="#45c08d" />
              <circle cx="0" cy="-32" r="5" fill="#7fd0a8" />
              <circle cx="0" cy="-32" r="3.4" fill="#1b6f9e" />
              <circle cx="0" cy="-32" r="1.7" fill="#123c76" />
              <circle cx="0.7" cy="-32.7" r="0.7" fill="#fff" />
            </g>
          </g>
        ))}
      </g>
    </g>
    <line x1="44.5" y1="72" x2="43.5" y2="80" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="51.5" y1="72" x2="52.5" y2="80" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="43.5" y1="80" x2="40.5" y2="81.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <line x1="52.5" y1="80" x2="55.5" y2="81.5" stroke="#8a6a3a" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 36 Q46.6 47 48 58" stroke="#2f63d1" strokeWidth="7.5" strokeLinecap="round" fill="none" />
    <ellipse cx="48" cy="64" rx="12.5" ry="10" fill="#2f63d1" />
    <ellipse cx="48" cy="67.5" rx="8" ry="5.6" fill="#5f8ce8" />
    <path d="M38.5 59.5 Q35.5 65.5 38.8 70.8" stroke="#2554b8" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
    <path d="M57.5 59.5 Q60.5 65.5 57.2 70.8" stroke="#2554b8" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
    <line x1="45" y1="29" x2="43" y2="22.5" stroke="#2554b8" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="48" y1="28" x2="48" y2="21" stroke="#2554b8" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="51" y1="29" x2="53" y2="22.5" stroke="#2554b8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="43" cy="21.5" r="2" fill="#2fa273" />
    <circle cx="48" cy="19.8" r="2" fill="#2fa273" />
    <circle cx="53" cy="21.5" r="2" fill="#2fa273" />
    <circle cx="48" cy="33" r="6.2" fill="#2554b8" />
    <circle cx="46" cy="30.8" r="2" fill="#5f8ce8" opacity=".55" />
    <polygon points="45.7,35.2 50.3,35.2 48,39" fill="#e8a33d" />
    <circle cx="45.9" cy="31.9" r="1.35" fill="#1f2430" />
    <circle cx="46.4" cy="31.4" r="0.5" fill="#fff" />
    <circle cx="50.1" cy="31.9" r="1.35" fill="#1f2430" />
    <circle cx="50.5" cy="31.4" r="0.5" fill="#fff" />
  </svg>
);

export default function D04_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (n) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(n)) ns.delete(n); else ns.add(n); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((n) => pickedSet.has(n)) && [...pickedSet].every((n) => n > BASE);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(String), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0409">
      <style>{`
        .pq0409{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0409 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#8a5bd6;text-transform:uppercase;}
        .pq0409 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0409 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0409 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0409 .pq-cage{position:relative;width:250px;margin:0 auto 16px;padding:16px 12px 14px;border-radius:20px;background:linear-gradient(#f3effc,#e9e2f8);border:3px solid #cfc0ee;text-align:center;}
        .pq0409 .pq-bars{position:absolute;inset:8px 10px;display:flex;justify-content:space-around;pointer-events:none;}
        .pq0409 .pq-bars i{width:4px;border-radius:2px;background:rgba(122,91,214,.16);}
        .pq0409 .pq-rule{font-size:40px;font-weight:900;color:#5b46b0;font-variant-numeric:tabular-nums;letter-spacing:2px;}
        .pq0409 .pq-rule .pq-hole{display:inline-flex;width:56px;height:56px;border-radius:12px;border:2.5px dashed #a68ce0;background:#faf8ff;color:#a68ce0;align-items:center;justify-content:center;vertical-align:middle;margin-left:6px;animation:pqBreath 2s ease-in-out infinite;}
        .pq0409 .pq-peacock{display:inline-block;line-height:0;margin:0 5px;vertical-align:bottom;animation:pqPop .5s ease both;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0409 .pq-fansway{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 4.6s ease-in-out 1.5s infinite;}
        .pq0409 .pq-feather{transform-box:fill-box;transform-origin:50% 100%;animation:pqFan .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0409 .pq-opts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .pq0409 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0409 .pq-opt:hover:not(:disabled){border-color:#b7a6ef;transform:translateY(-2px);}
        .pq0409 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0409 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0409 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0409 .pq-opt:disabled{cursor:default;}
        .pq0409 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0409 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0409 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        @keyframes pqFan{from{opacity:0;transform:scale(.08);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSway{0%,100%{transform:rotate(-1.5deg);}50%{transform:rotate(1.5deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-cage">
        {!ok && (
          <div className="pq-bars" aria-hidden="true">{Array.from({ length: 6 }).map((_, i) => <i key={i} />)}</div>
        )}
        {ok
          ? <div><span className="pq-peacock"><Peacock /></span><span className="pq-peacock" style={{ animationDelay: '.15s' }}><Peacock d={0.15} /></span></div>
          : <div className="pq-rule">{BASE} &lt;<span className="pq-hole">?</span></div>}
      </div>

      <div className="pq-opts">
        {CARDS.map((n, i) => {
          const sel = pickedSet.has(n);
          const right = ok && n > BASE;
          return <button key={i} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => toggle(n)}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
