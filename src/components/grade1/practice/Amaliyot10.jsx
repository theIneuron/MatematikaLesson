// Amaliyot10 (1-sinf) — P26 Kattaliklar: 1 dm = ? sm (birlik o'girish) · Blok 7 · daraja 🟡 · teg: units_convert
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'ri javobda chizg'ich bo'linmalari 1..10 birma-bir yonadi + bayram.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 10;   // 1 dm = 10 sm
const OPTIONS = [1, 10, 100];
const DATA = { target: TARGET, tag: 'units_convert', level: '🟡', block: 7, ptype: 'P26' };

const T = {
  uz: {
    title: 'Kattaliklar',
    setup: 'Uzunlikni sm va dm da o\'lchaymiz. Desimetr — kattaroq o\'lchov.',
    ask: '1 desimetrda nechta santimetr bor?',
    correct: 'Barakalla! 1 dm = 10 sm. Chizg\'ichda o\'nta bo\'linma.',
    small: 'Kam. Chizg\'ichdagi bo\'linmalarni sana — bittadan ko\'p.',
    big: 'Ko\'p. Bu bir metr emas. Bir desimetrda o\'nta santimetr.',
  },
  ru: {
    title: 'Величины',
    setup: 'Длину измеряют в см и дм. Дециметр — крупная мерка.',
    ask: 'Сколько сантиметров в одном дециметре?',
    correct: 'Молодец! 1 дм = 10 см. На линейке десять делений.',
    small: 'Мало. Посчитай деления на линейке — их больше одного.',
    big: 'Много. Это не один метр. В одном дециметре десять сантиметров.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot10(props) {
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
    const correct = picked === TARGET;
    const msg = correct ? t.correct : (picked < TARGET ? t.small : t.big);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: '1 dm = ? sm', options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq10">
      <style>{`
        .aq10 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq10 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq10 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq10 .aq-setup { color:#5c6672; font-weight:500; }
        .aq10 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq10 .aq-eq { text-align:center; font-size:34px; font-weight:800; font-variant-numeric:tabular-nums; margin-bottom:14px; }
        .aq10 .aq-eq b { color:#2563eb; }
        .aq10 .aq-eq.win b { color:#1a7f43; }
        .aq10 .aq-eq.win { animation:aqCele .5s ease; }
        .aq10 .aq-ruler { display:flex; height:60px; border:2px solid #cdb47e; border-radius:10px; overflow:hidden; background:#faf3df; }
        .aq10 .aq-seg { flex:1; position:relative; border-right:2px solid #cdb47e; transition:background .2s; }
        .aq10 .aq-seg:last-child { border-right:none; }
        .aq10 .aq-seg::after { content:attr(data-n); position:absolute; bottom:3px; left:3px; font-size:11px; color:#a98f57; font-weight:700; }
        .aq10 .aq-seg.on { background:#eddca8; animation:aqLight .3s ease both; }
        .aq10 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq10 .aq-opt { min-width:76px; height:66px; padding:0 10px; font-size:27px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq10 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq10 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq10 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq10 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq10 .aq-opt:disabled { cursor:default; }
        .aq10 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq10 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq10 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqLight { from { opacity:.3; } to { opacity:1; } }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-eq' + (ok ? ' win' : '')}>1 dm = <b>{ok ? TARGET : '?'}</b> sm</div>

      <div className="aq-ruler">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={'aq-seg' + (ok ? ' on' : '')} data-n={i + 1} style={ok ? { animationDelay: `${i * 0.08}s` } : undefined} />
        ))}
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === TARGET;
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
