// Amaliyot14 (1-sinf) — P16 Chizg'ich bilan o'lchash: qalam necha sm? · Blok 7 · daraja 🟡 · teg: measure_ruler
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'ri javobda 0 dan qalam oxirigacha bo'linmalar yonadi + "5 sm".

import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEN = 5;        // qalam uzunligi (sm)
const RULER = 10;     // chizg'ich uzunligi
const OPTIONS = [4, 5, 6];
const DATA = { len: LEN, tag: 'measure_ruler', level: '🟡', block: 7, ptype: 'P16' };

const T = {
  uz: {
    title: 'Chizg\'ich bilan o\'lchash',
    setup: 'Qalam chizg\'ich ustida yotibdi, boshi 0 belgisida.',
    ask: 'Qalam necha santimetr uzunlikda?',
    correct: 'Barakalla! Qalam 0 dan 5 gacha — 5 santimetr.',
    less: 'O\'lchashni 0 dan boshla, 1 dan emas. Qalam oxiri qaysi songa yetdi?',
    more: 'Qalam oxiri 5 belgisida tugadi, undan uzun emas.',
  },
  ru: {
    title: 'Измерь линейкой',
    setup: 'Карандаш лежит на линейке, его начало у отметки 0.',
    ask: 'Какой длины карандаш в сантиметрах?',
    correct: 'Молодец! Карандаш от 0 до 5 — 5 сантиметров.',
    less: 'Начинай измерять от 0, а не от 1. До какой цифры дошёл конец карандаша?',
    more: 'Конец карандаша на отметке 5, он не длиннее.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot14(props) {
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
    const correct = picked === LEN;
    const msg = correct ? t.correct : (picked < LEN ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: LEN },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq14">
      <style>{`
        .aq14 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq14 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq14 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq14 .aq-setup { color:#5c6672; font-weight:500; }
        .aq14 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq14 .aq-measure { position:relative; padding-top:26px; }
        .aq14 .aq-pencil { position:absolute; top:6px; left:0; height:22px; border-radius:5px 8px 8px 5px;
          background:linear-gradient(#f6c65b,#e6a92f); display:flex; align-items:center; justify-content:flex-end; }
        .aq14 .aq-pencil::after { content:''; position:absolute; right:-13px; top:0; border-top:11px solid transparent; border-bottom:11px solid transparent; border-left:13px solid #c98b1f; }
        .aq14 .aq-pencil::before { content:''; position:absolute; left:0; top:0; bottom:0; width:9px; background:#f4a3ad; border-radius:5px 0 0 5px; }
        .aq14 .aq-badge { position:absolute; top:-24px; font-size:15px; font-weight:800; color:#1a7f43; transform:translateX(-50%); animation:aqPop .35s ease both; }
        .aq14 .aq-ruler { display:flex; height:52px; border:2px solid #cdb47e; border-radius:8px; overflow:hidden; background:#faf3df; }
        .aq14 .aq-seg { flex:1; position:relative; border-right:2px solid #cdb47e; }
        .aq14 .aq-seg:last-child { border-right:none; }
        .aq14 .aq-seg.on { background:#eddca8; animation:aqLight .3s ease both; }
        .aq14 .aq-seg .n { position:absolute; bottom:2px; left:2px; font-size:11px; color:#a98f57; font-weight:700; }
        .aq14 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq14 .aq-opt { min-width:70px; height:66px; padding:0 8px; font-size:27px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq14 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq14 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq14 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq14 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq14 .aq-opt:disabled { cursor:default; }
        .aq14 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq14 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq14 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:translateX(-50%) scale(.4);} to { opacity:1; transform:translateX(-50%) scale(1);} }
        @keyframes aqLight { from { opacity:.3; } to { opacity:1; } }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-measure">
        <div className="aq-pencil" style={{ width: `${(LEN / RULER) * 100}%` }} />
        {ok && <span className="aq-badge" style={{ left: `${(LEN / RULER) * 100}%` }}>{LEN} sm</span>}
        <div className="aq-ruler">
          {Array.from({ length: RULER }).map((_, i) => (
            <div key={i} className={'aq-seg' + (ok && i < LEN ? ' on' : '')} style={ok && i < LEN ? { animationDelay: `${i * 0.09}s` } : undefined}>
              <span className="n">{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === LEN;
          return (
            <button key={n} type="button" className={'aq-opt' + (right ? ' right' : picked === n ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
          );
        })}
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
