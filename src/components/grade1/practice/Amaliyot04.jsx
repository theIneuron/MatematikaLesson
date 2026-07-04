// Amaliyot04 (1-sinf) — P6 Sonning uyi (tarkibi): 7 = 4 va __ · Blok 1 · daraja 🟡 · teg: number_house
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-qo'yish. Animatsiya: 2-xonaga yetishmagan doiralar birma-bir kirib to'ladi + bayram. Несущий узел — состав.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const WHOLE = 7, KNOWN = 4;
const TARGET = WHOLE - KNOWN;        // 3
const PARTS = [2, 3, 4, 5];
const DATA = { whole: WHOLE, known: KNOWN, target: TARGET, tag: 'number_house', level: '🟡', block: 1, ptype: 'P6' };

const T = {
  uz: {
    title: 'Sonning uyi',
    setup: 'Uydagi 7 ta doira ikki xonaga bo\'linadi. 1-xonaga 4 tasi joylashdi.',
    ask: '2-xonada nechta doira bo\'ladi?',
    correct: 'Barakalla! 4 va 3 — birga yettita. 7 = 4 va 3.',
    wrong: 'Yetti chiqmadi. 4 va tanlagan son birga 7 bo\'lsin. 4 dan yettigacha sana.',
    roomA: '1-xona', roomB: '2-xona',
  },
  ru: {
    title: 'Домик числа',
    setup: 'Семь кружков делят на две комнаты. В первую попали 4.',
    ask: 'Сколько кружков во второй комнате?',
    correct: 'Молодец! 4 и 3 — вместе семь. 7 = 4 и 3.',
    wrong: 'Семь не вышло. Вместе с 4 должно быть 7. Досчитай от 4 до семи.',
    roomA: 'Комната 1', roomB: 'Комната 2',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot04(props) {
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
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${WHOLE} = ${KNOWN} va __`, options: PARTS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const roomBCount = ok ? TARGET : 0;

  return (
    <div className="aq aq04">
      <style>{`
        .aq04 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq04 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq04 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq04 .aq-setup { color:#5c6672; font-weight:500; }
        .aq04 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq04 .aq-house { max-width:320px; margin:0 auto; }
        .aq04 .aq-house.win { animation:aqCele .5s ease; }
        .aq04 .aq-roof { width:0; height:0; margin:0 auto; border-left:160px solid transparent; border-right:160px solid transparent; border-bottom:56px solid #e0803a; }
        .aq04 .aq-whole { text-align:center; margin-top:-44px; font-size:30px; font-weight:800; color:#fff; position:relative; }
        .aq04 .aq-rooms { display:flex; border:3px solid #e0803a; border-top:none; border-radius:0 0 14px 14px; overflow:hidden; }
        .aq04 .aq-room { flex:1; min-height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; background:#fff; padding:10px; }
        .aq04 .aq-room + .aq-room { border-left:2px solid #f0d9c4; }
        .aq04 .aq-room small { font-size:12px; color:#9aa1ad; }
        .aq04 .aq-chips { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; max-width:120px; min-height:38px; }
        .aq04 .aq-chip { width:20px; height:20px; border-radius:50%; background:#5b8def; animation:aqPop .3s ease both; }
        .aq04 .aq-chip.new { background:#3aa66b; animation:aqEnter .4s cubic-bezier(.3,1.4,.5,1) both; }
        .aq04 .aq-cap { font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; }
        .aq04 .aq-cap.ph { color:#c2c8d2; }
        .aq04 .aq-cap.right { color:#1a7f43; }
        .aq04 .aq-parts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq04 .aq-part { width:66px; height:66px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq04 .aq-part:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq04 .aq-part:active:not(:disabled) { transform:scale(.94); }
        .aq04 .aq-part.sel { border-color:#2563eb; background:#e8eefc; }
        .aq04 .aq-part:disabled { cursor:default; }
        .aq04 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq04 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq04 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqEnter { 0%{opacity:0; transform:translateX(-40px) scale(.6);} 100%{opacity:1; transform:translateX(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.04);} 60%{transform:scale(.98);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-house' + (ok ? ' win' : '')}>
        <div className="aq-roof" />
        <div className="aq-whole">{WHOLE}</div>
        <div className="aq-rooms">
          <div className="aq-room"><small>{t.roomA}</small>
            <div className="aq-chips">{Array.from({ length: KNOWN }).map((_, i) => <span key={i} className="aq-chip" style={{ animationDelay: `${i * 0.06}s` }} />)}</div>
            <span className="aq-cap">{KNOWN}</span>
          </div>
          <div className="aq-room"><small>{t.roomB}</small>
            <div className="aq-chips">{Array.from({ length: roomBCount }).map((_, i) => <span key={i} className="aq-chip new" style={{ animationDelay: `${i * 0.12}s` }} />)}</div>
            <span className={'aq-cap' + (picked === null ? ' ph' : ok ? ' right' : '')}>{picked === null ? '?' : picked}</span>
          </div>
        </div>
      </div>

      <div className="aq-parts">
        {PARTS.map((n) => (
          <button key={n} type="button" className={'aq-part' + (picked === n ? ' sel' : '')} disabled={lock}
            onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
        ))}
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
