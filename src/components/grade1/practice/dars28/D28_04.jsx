// Dars28 · Amaliyot 04 — Qaysi amal? (10 ichida) · 🟡 · tag: choose_op
// SODDA (metodist talabi 2026-07-15): bir xonali, 10 ichida, o'nlik/razryad YO'Q.
// 4 ta olma va 3 ta olma BIRLASHTIRILDI -> qaysi amal? Javob: «+» (qo'shish).
// Ma'no: to'plamlar birlashtirilsa — qo'shamiz. Chalg'ituvchi «−» (ayirish).
import React, { useState, useEffect, useRef, useCallback } from 'react';

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

const A = 4, B = 3, SUM = 7, PLUS = '+', MINUS = '−';
const DATA = { a: A, b: B, target: PLUS, options: [PLUS, MINUS], answer: PLUS, level: '🟡', tag: 'choose_op' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Qaysi amal?",
    setup: "4 ta olma va 3 ta olma birlashtirildi.",
    ask: "Qaysi amal kerak?",
    correct: "Barakalla! Birlashtirdik — qo'shamiz. 4 + 3 = 7.",
    hint: "Birlashtirish — qo'shish. Belgisi «+».",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "Какое действие?",
    setup: "4 яблока и 3 яблока объединили.",
    ask: "Какое действие нужно?",
    correct: "Молодец! Объединили — складываем. 4 + 3 = 7.",
    hint: "Объединить — сложить. Знак «+».",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;
const Apple = ({ w = 30 }) => {
  const id = 'pq2804a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

export default function D28_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === PLUS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { value: picked }, correctAnswer: { value: PLUS }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok;
  const [fitRef, scale] = useFitScale(340);

  const applesA = Array.from({ length: A });
  const applesB = Array.from({ length: B });

  return (
    <div className="pq pq2804" ref={fitRef}>
      <style>{`
        .pq2804{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2804 *,.pq2804 *::before,.pq2804 *::after{box-sizing:border-box;}
        .pq2804 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c14a3c;text-transform:uppercase;}
        .pq2804 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2804 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2804 .pq-ask{display:block;margin-top:4px;font-size:21px;font-weight:800;}
        .pq2804 .pq-scene{position:relative;width:340px;height:200px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 54%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2804 .pq-fit{position:relative;margin:0 auto;}
        .pq2804 .pq-sun{position:absolute;right:18px;top:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;animation:pq2804sun 3.6s ease-in-out infinite;}
        .pq2804 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:48px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;}
        .pq2804 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#c14a3c,#a2382c);border:2.5px solid #83271d;color:#fdeee9;font-size:12px;font-weight:800;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16);}
        .pq2804 .pq-arena{position:absolute;left:8px;right:8px;top:40px;bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        .pq2804 .pq-group{display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2804 .pq-apples{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;max-width:120px;}
        .pq2804 .pq-obj{line-height:0;}
        .pq2804 .pq-obj.idle{animation:pq2804bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2804 .pq-tag{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #b6743c;color:#a2582a;font-weight:900;font-size:15px;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq2804 .pq-op{font-size:34px;font-weight:900;align-self:center;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;border:2.5px dashed #b6743c;color:#a2582a;}
        .pq2804 .pq-op.solved{border-style:solid;border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;}
        .pq2804 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2804in .3s ease both;}
        .pq2804 .pq-eq b{min-width:44px;height:40px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#fdeee9;border:2px solid #eab5aa;color:#c14a3c;font-variant-numeric:tabular-nums;}
        .pq2804 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2804 .pq-eq i{font-style:normal;font-size:22px;font-weight:900;color:#8a94a2;}
        .pq2804 .pq-opts{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-top:18px;}
        .pq2804 .pq-opt{width:92px;height:82px;font-size:42px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;line-height:1;}
        .pq2804 .pq-opt:hover:not(:disabled){border-color:#eab5aa;transform:translateY(-2px);}
        .pq2804 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2804 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2804 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2804cele .5s ease;}
        .pq2804 .pq-opt:disabled{cursor:default;}
        .pq2804 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2804in .22s ease both;}
        .pq2804 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2804 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2804bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2804sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2804cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2804in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 340 * scale, height: 200 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>
        <div className="pq-arena">
          <div className="pq-group">
            <div className="pq-apples">
              {applesA.map((_, i) => (
                <span key={'a' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}><Apple w={30} /></span>
              ))}
            </div>
            <span className="pq-tag">{A}</span>
          </div>
          <span className={'pq-op' + (ok ? ' solved' : '')}>{ok ? PLUS : '?'}</span>
          <div className="pq-group">
            <div className="pq-apples">
              {applesB.map((_, i) => (
                <span key={'b' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}><Apple w={30} /></span>
              ))}
            </div>
            <span className="pq-tag">{B}</span>
          </div>
        </div>
      </div>
      </div>

      {ok && (
        <div className="pq-eq"><b>{A}</b><i>{PLUS}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b></div>
      )}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === PLUS;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
