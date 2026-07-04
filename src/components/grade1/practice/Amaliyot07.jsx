// Amaliyot07 (1-sinf) — P21 Razryad kartochkalari: 47 = 4 o'nlik + 7 birlik · Blok 5 · daraja 🟡 · teg: place_value
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'ri javobda 47 razryadlarga bo'linadi — 4 tayoq o'nlik chiqadi, 7 kub birlik tushadi → 40 va 7. Столбик O'RNIGA.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUM = 47;
const TENS = Math.floor(NUM / 10);   // 4
const ONES = NUM % 10;               // 7
const TENS_OPTS = [3, 4, 5];
const ONES_OPTS = [6, 7, 8];
const DATA = { num: NUM, tens: TENS, ones: ONES, tag: 'place_value', level: '🟡', block: 5, ptype: 'P21' };

const T = {
  uz: {
    title: 'Razryad kartochkalari',
    setup: 'Ikki xonali sonda ikki razryad bor: o\'nliklar va birliklar.',
    ask: '47 ni razryadlarga ajrat: nechta o\'nlik va nechta birlik?',
    tens: "o'nlik", ones: 'birlik',
    qTens: 'Nechta o\'nlik?', qOnes: 'Nechta birlik?',
    correct: 'Barakalla! 47 — bu 4 o\'nlik va 7 birlik. 40 va 7.',
    wrong: 'Hali to\'g\'ri emas. Chapdagi raqam — o\'nliklar (4), o\'ngdagisi — birliklar (7).',
  },
  ru: {
    title: 'Разрядные карточки',
    setup: 'В двузначном числе два разряда: десятки и единицы.',
    ask: 'Разложи 47 на разряды: сколько десятков и сколько единиц?',
    tens: 'дес.', ones: 'ед.',
    qTens: 'Сколько десятков?', qOnes: 'Сколько единиц?',
    correct: 'Молодец! 47 — это 4 десятка и 7 единиц. 40 и 7.',
    wrong: 'Пока неверно. Левая цифра — десятки (4), правая — единицы (7).',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [d, setD] = useState(null);
  const [e, setE] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.tens != null) setD(sa.tens);
      if (sa.ones != null) setE(sa.ones);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(d !== null && e !== null && !checked); }, [d, e, checked, onReady]);

  const check = useCallback(() => {
    if (d === null || e === null) return;
    const correct = d === TENS && e === ONES;
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${NUM} = __ ${t.tens} + __ ${t.ones}`, options: { tens: TENS_OPTS, ones: ONES_OPTS },
      studentAnswer: { tens: d, ones: e }, correctAnswer: { tens: TENS, ones: ONES },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [d, e, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq07">
      <style>{`
        .aq07 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq07 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq07 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 12px; }
        .aq07 .aq-setup { color:#5c6672; font-weight:500; }
        .aq07 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq07 .aq-num { text-align:center; font-size:54px; font-weight:800; font-variant-numeric:tabular-nums; letter-spacing:4px; }
        .aq07 .aq-num.win { animation:aqCele .5s ease; color:#1a7f43; }
        .aq07 .aq-split { display:flex; gap:26px; justify-content:center; align-items:flex-end; margin:6px 0 4px; min-height:74px; }
        .aq07 .aq-col { display:flex; flex-direction:column; align-items:center; gap:6px; }
        .aq07 .aq-rods { display:flex; gap:5px; align-items:flex-end; height:56px; }
        .aq07 .aq-rod { width:12px; height:56px; background:#5b8def; border-radius:3px; animation:aqSlide .4s cubic-bezier(.3,1.3,.5,1) both; }
        .aq07 .aq-units { display:grid; grid-template-columns:repeat(4, 16px); gap:5px; align-content:end; }
        .aq07 .aq-unit { width:16px; height:16px; background:#e0803a; border-radius:4px; animation:aqDrop .4s cubic-bezier(.3,1.3,.5,1) both; }
        .aq07 .aq-cap { font-size:15px; font-weight:800; color:#374151; font-variant-numeric:tabular-nums; }
        .aq07 .aq-group { padding:12px 14px; border-radius:16px; background:#f6f8fb; margin-top:10px; }
        .aq07 .aq-q { font-size:14px; font-weight:600; color:#374151; margin-bottom:9px; }
        .aq07 .aq-opts { display:flex; gap:10px; align-items:center; }
        .aq07 .aq-opt { width:58px; height:58px; font-size:24px; font-weight:800; border-radius:14px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq07 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq07 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq07 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq07 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .aq07 .aq-opt:disabled { cursor:default; }
        .aq07 .aq-unitlab { color:#6b7280; font-weight:700; margin-left:4px; }
        .aq07 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq07 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq07 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqSlide { 0%{opacity:0; transform:translateX(-26px) scaleY(.4);} 100%{opacity:1; transform:translateX(0) scaleY(1);} }
        @keyframes aqDrop { 0%{opacity:0; transform:translateY(-22px) scale(.5);} 100%{opacity:1; transform:translateY(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-num' + (ok ? ' win' : '')}>{NUM}</div>
      {ok && (
        <div className="aq-split">
          <div className="aq-col">
            <div className="aq-rods">{Array.from({ length: TENS }).map((_, i) => <span key={i} className="aq-rod" style={{ animationDelay: `${i * 0.08}s` }} />)}</div>
            <span className="aq-cap">{TENS * 10}</span>
          </div>
          <div className="aq-col">
            <div className="aq-units">{Array.from({ length: ONES }).map((_, i) => <span key={i} className="aq-unit" style={{ animationDelay: `${0.28 + i * 0.05}s` }} />)}</div>
            <span className="aq-cap">{ONES}</span>
          </div>
        </div>
      )}

      <div className="aq-group">
        <div className="aq-q">{t.qTens}</div>
        <div className="aq-opts">
          {TENS_OPTS.map((n) => (
            <button key={n} type="button" className={'aq-opt' + (ok && n === TENS ? ' right' : d === n ? ' sel' : '')}
              disabled={lock} onClick={() => { setD(n); setFeedback(null); }}>{n}</button>
          ))}
          <span className="aq-unitlab">{t.tens}</span>
        </div>
      </div>

      <div className="aq-group">
        <div className="aq-q">{t.qOnes}</div>
        <div className="aq-opts">
          {ONES_OPTS.map((n) => (
            <button key={n} type="button" className={'aq-opt' + (ok && n === ONES ? ' right' : e === n ? ' sel' : '')}
              disabled={lock} onClick={() => { setE(n); setFeedback(null); }}>{n}</button>
          ))}
          <span className="aq-unitlab">{t.ones}</span>
        </div>
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
