// Amaliyot25 (1-sinf) — P20 Piktogramma: diagrammadan ma'lumot o'qish · ИК/Blok 8 · daraja 🟡 · teg: pictogram
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'rida olma qatori sanaladi va yashil pulslaydi + "5".

import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { key: 'apple', e: '🍎', n: 5 },
  { key: 'banana', e: '🍌', n: 3 },
  { key: 'grape', e: '🍇', n: 4 },
];
const TARGET_KEY = 'apple';
const TARGET = ROWS.find((r) => r.key === TARGET_KEY).n;   // 5
const OPTIONS = [4, 5, 6];
const DATA = { target: TARGET, tag: 'pictogram', level: '🟡', block: 8, ptype: 'P20' };

const T = {
  uz: {
    title: 'Diagrammani o\'qish',
    setup: 'Diagrammada har xil mevalar rasmlar bilan ko\'rsatilgan.',
    ask: 'Diagrammada nechta olma bor?',
    rows: { apple: 'Olma', banana: 'Banan', grape: 'Uzum' },
    correct: 'Barakalla! Olmalarni sana — beshta olma bor.',
    less: 'Kam. Faqat olma qatorini sana — har rasm bitta olma.',
    more: 'Ko\'p. Faqat olma qatoridagi rasmlarni sana.',
  },
  ru: {
    title: 'Чтение диаграммы',
    setup: 'На диаграмме разные фрукты показаны картинками.',
    ask: 'Сколько яблок на диаграмме?',
    rows: { apple: 'Яблоки', banana: 'Бананы', grape: 'Виноград' },
    correct: 'Молодец! Посчитай яблоки — их пять.',
    less: 'Мало. Считай только строку с яблоками — каждая картинка это одно яблоко.',
    more: 'Много. Считай только картинки в строке яблок.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot25(props) {
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

  return (
    <div className="aq aq25">
      <style>{`
        .aq25 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq25 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq25 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq25 .aq-setup { color:#5c6672; font-weight:500; }
        .aq25 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq25 .aq-chart { background:#f6f8fb; border-radius:16px; padding:12px 14px; }
        .aq25 .aq-prow { display:flex; align-items:center; gap:6px; padding:8px 0; }
        .aq25 .aq-prow + .aq-prow { border-top:1px solid #e4e7ec; }
        .aq25 .aq-plabel { width:78px; flex:0 0 auto; font-size:14px; font-weight:700; color:#5c6672; }
        .aq25 .aq-punits { display:flex; gap:4px; flex-wrap:wrap; }
        .aq25 .aq-u { font-size:28px; line-height:1; }
        .aq25 .aq-prow.hit { background:#e8f7ee; border-radius:10px; margin:0 -6px; padding-left:6px; padding-right:6px; animation:aqCele .5s ease; }
        .aq25 .aq-prow.hit .aq-plabel { color:#1a7f43; }
        .aq25 .aq-count { margin-left:auto; flex:0 0 auto; min-width:30px; height:30px; border-radius:50%; background:#1a7f43; color:#fff;
          display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; font-variant-numeric:tabular-nums; animation:aqPop .35s ease both; }
        .aq25 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:20px; }
        .aq25 .aq-opt { width:66px; height:66px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq25 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq25 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq25 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq25 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq25 .aq-opt:disabled { cursor:default; }
        .aq25 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq25 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq25 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.03);} 60%{transform:scale(.99);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-chart">
        {ROWS.map((r) => {
          const hit = ok && r.key === TARGET_KEY;
          return (
            <div key={r.key} className={'aq-prow' + (hit ? ' hit' : '')}>
              <span className="aq-plabel">{t.rows[r.key]}</span>
              <span className="aq-punits">
                {Array.from({ length: r.n }).map((_, i) => <span key={i} className="aq-u">{r.e}</span>)}
              </span>
              {hit && <span className="aq-count">{r.n}</span>}
            </div>
          );
        })}
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
