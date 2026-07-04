// Amaliyot12 (1-sinf) — P7 Sonlar nuri: chigirtka sakraydi · Blok 2/5 · daraja 🟡 · teg: number_ray
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash (tushadigan son). Animatsiya: to'g'ri javobda chigirtka boshdan oldinga sakrab boradi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const MAX = 10;
const START = 4, JUMPS = 3;
const TARGET = START + JUMPS;   // 7
const OPTIONS = [6, 7, 8];
const DATA = { start: START, jumps: JUMPS, target: TARGET, tag: 'number_ray', level: '🟡', block: 2, ptype: 'P7' };

const posPct = (n) => ((n + 0.5) / (MAX + 1)) * 100;

const T = {
  uz: {
    title: 'Sonlar nuri',
    setup: 'Chigirtka sonlar nurida 4 raqamida turibdi. Har sakrashda bitta oldinga o\'tadi.',
    ask: '3 marta oldinga sakrasa, qaysi songa tushadi?',
    correct: 'Barakalla! 4 dan sakraydi: 5, 6, 7. Chigirtka 7 ga tushdi.',
    less: 'Kam. 4 dan boshlab uchta oldinga sana: 5, 6, 7.',
    more: 'Ko\'p. Faqat 3 marta sakraydi. 4 dan sana: 5, 6, 7.',
  },
  ru: {
    title: 'Числовой луч',
    setup: 'Кузнечик стоит на числовом луче на цифре 4. Каждый прыжок — на одно вперёд.',
    ask: 'Если он прыгнет 3 раза вперёд, на какое число попадёт?',
    correct: 'Молодец! От 4 прыгает: 5, 6, 7. Кузнечик попал на 7.',
    less: 'Мало. Отсчитай от 4 три вперёд: 5, 6, 7.',
    more: 'Много. Прыжков только 3. Считай от 4: 5, 6, 7.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot12(props) {
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
    const msg = correct ? t.correct : (picked < TARGET ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const hopperAt = ok ? TARGET : START;

  return (
    <div className="aq aq12">
      <style>{`
        .aq12 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq12 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq12 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 22px; }
        .aq12 .aq-setup { color:#5c6672; font-weight:500; }
        .aq12 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq12 .aq-ray { position:relative; padding:34px 0 6px; }
        .aq12 .aq-hop { position:absolute; top:0; font-size:26px; transform:translateX(-50%); transition:left .9s cubic-bezier(.4,1.4,.5,1); z-index:2; }
        .aq12 .aq-hop.win { animation:aqHop .9s ease; }
        .aq12 .aq-axis { position:relative; height:4px; background:#cdd4df; border-radius:2px; }
        .aq12 .aq-ticks { display:flex; }
        .aq12 .aq-tickcell { flex:1; display:flex; flex-direction:column; align-items:center; }
        .aq12 .aq-tickmark { width:2px; height:12px; background:#aab1bd; margin-top:-8px; }
        .aq12 .aq-ticknum { font-size:14px; font-weight:700; color:#6b7280; margin-top:3px; font-variant-numeric:tabular-nums; }
        .aq12 .aq-tickcell.start .aq-ticknum { color:#e0803a; }
        .aq12 .aq-tickcell.land .aq-ticknum { color:#1a7f43; }
        .aq12 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:20px; }
        .aq12 .aq-opt { width:66px; height:66px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq12 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq12 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq12 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq12 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq12 .aq-opt:disabled { cursor:default; }
        .aq12 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq12 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq12 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqHop { 0%,100%{ transform:translateX(-50%) translateY(0);} 25%{ transform:translateX(-50%) translateY(-16px);} 55%{ transform:translateX(-50%) translateY(-12px);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-ray">
        <span className={'aq-hop' + (ok ? ' win' : '')} style={{ left: `${posPct(hopperAt)}%` }}>🦗</span>
        <div className="aq-axis" />
        <div className="aq-ticks">
          {Array.from({ length: MAX + 1 }).map((_, n) => (
            <div key={n} className={'aq-tickcell' + (n === START ? ' start' : '') + (ok && n === TARGET ? ' land' : '')}>
              <div className="aq-tickmark" />
              <div className="aq-ticknum">{n}</div>
            </div>
          ))}
        </div>
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
