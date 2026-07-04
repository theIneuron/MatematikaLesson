// Amaliyot03 (1-sinf) — P4 Taqqoslash: belgini joyiga qo'y (> < =) · Blok 1 · daraja 🟡 · teg: compare_sign
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-qo'yish. Animatsiya: olmalar birma-bir chiqadi; to'g'ri javobda belgi "og'zi" katta tomonga ochiladi + katta guruh yonadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 6, B = 8;
const SIGNS = ['>', '<', '='];
const TARGET = A < B ? '<' : A > B ? '>' : '=';
const BIGGER = A > B ? 'a' : B > A ? 'b' : null;
const DATA = { a: A, b: B, target: TARGET, tag: 'compare_sign', level: '🟡', block: 1, ptype: 'P4' };

const T = {
  uz: {
    title: 'Taqqoslash',
    setup: 'Bir savatda 6 ta, ikkinchisida 8 ta olma bor.',
    ask: 'Qaysi son katta? Ular orasiga to\'g\'ri belgini qo\'y.',
    correct: 'To\'g\'ri! 6 sakkizdan kichik: 6 < 8.',
    wrongGt: 'Belgi teskari. Uchi kichik songa qaraydi, og\'zi kattaga. Katta son — sakkiz.',
    wrongEq: 'Bular teng emas: olti va sakkiz har xil.',
    hint: 'Belgini tanla',
  },
  ru: {
    title: 'Сравнение',
    setup: 'В одной корзине 6 яблок, в другой — 8.',
    ask: 'Какое число больше? Поставь между ними верный знак.',
    correct: 'Верно! Шесть меньше восьми: 6 < 8.',
    wrongGt: 'Знак наоборот. Остриё смотрит на меньшее, раскрытие — на большее. Большее число — восемь.',
    wrongEq: 'Они не равны: шесть и восемь — разные.',
    hint: 'Выбери знак',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Dots = ({ n }) => (
  <span className="aq-dots">{Array.from({ length: n }).map((_, i) => (
    <span key={i} className="aq-dot" style={{ animationDelay: `${i * 0.06}s` }}>🍎</span>
  ))}</span>
);

export default function Amaliyot03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (!picked) return;
    const correct = picked === TARGET;
    const msg = correct ? t.correct : (picked === '=' ? t.wrongEq : t.wrongGt);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A} __ ${B}`, options: SIGNS,
      studentAnswer: { value: picked }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq03">
      <style>{`
        .aq03 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq03 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq03 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 20px; }
        .aq03 .aq-setup { color:#5c6672; font-weight:500; }
        .aq03 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq03 .aq-row { display:flex; align-items:center; justify-content:center; gap:14px; margin:6px 0 8px; }
        .aq03 .aq-num { width:108px; min-height:110px; border-radius:20px; background:#fbf7ef; border:2px solid #efe6d4;
          display:flex; flex-direction:column; align-items:center; justify-content:center; padding:8px; transition:box-shadow .2s, border-color .2s; }
        .aq03 .aq-num.big { border-color:#f0b046; box-shadow:0 0 0 4px #fdf0d6; animation:aqCele .5s ease; }
        .aq03 .aq-num b { font-size:38px; font-weight:800; font-variant-numeric:tabular-nums; line-height:1; }
        .aq03 .aq-dots { display:flex; flex-wrap:wrap; gap:2px; justify-content:center; max-width:96px; margin-top:6px; }
        .aq03 .aq-dot { font-size:15px; animation:aqPop .3s ease both; }
        .aq03 .aq-slot { width:78px; height:78px; border-radius:18px; border:3px dashed #b9c1cf; background:#fff;
          display:flex; align-items:center; justify-content:center; font-size:46px; font-weight:800; color:#2563eb; transition:all .15s; }
        .aq03 .aq-slot.filled { border-style:solid; border-color:#2563eb; background:#e8eefc; }
        .aq03 .aq-slot.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq03 .aq-signs { display:flex; gap:12px; justify-content:center; margin-top:20px; }
        .aq03 .aq-sign { width:74px; height:74px; font-size:40px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; transition:border-color .12s, background .12s, transform .1s; }
        .aq03 .aq-sign:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq03 .aq-sign:active:not(:disabled) { transform:scale(.94); }
        .aq03 .aq-sign.sel { border-color:#2563eb; background:#e8eefc; }
        .aq03 .aq-sign:disabled { cursor:default; }
        .aq03 .aq-hint { text-align:center; font-size:13px; color:#9aa1ad; margin-top:8px; }
        .aq03 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq03 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq03 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-row">
        <div className={'aq-num' + (ok && BIGGER === 'a' ? ' big' : '')}><b>{A}</b><Dots n={A} /></div>
        <div className={'aq-slot' + (picked ? (ok ? ' right' : ' filled') : '')}>{picked || '?'}</div>
        <div className={'aq-num' + (ok && BIGGER === 'b' ? ' big' : '')}><b>{B}</b><Dots n={B} /></div>
      </div>

      <div className="aq-signs">
        {SIGNS.map((s) => (
          <button key={s} type="button" className={'aq-sign' + (picked === s ? ' sel' : '')} disabled={lock}
            onClick={() => { setPicked(s); setFeedback(null); }}>{s}</button>
        ))}
      </div>
      {!picked && !lock && <div className="aq-hint">{t.hint}</div>}

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
