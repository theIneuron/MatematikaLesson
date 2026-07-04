// Amaliyot09 (1-sinf) — P24 Masala jadvali: bor edi / keldi / hammasi · Blok 6 · daraja 🟡 · teg: problem_table
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: 5 mashina turibdi, 3 tasi kirib keladi; to'g'ri javobda "hammasi" yonadi + bayram.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const WAS = 5, CAME = 3;
const TOTAL = WAS + CAME;    // 8
const OPTIONS = [7, 8, 9];
const DATA = { was: WAS, came: CAME, total: TOTAL, tag: 'problem_table', level: '🟡', block: 6, ptype: 'P24' };

const T = {
  uz: {
    title: 'Masala jadvali',
    setup: 'Garajda 5 ta mashina turgan edi. Yana 3 ta mashina keldi.',
    ask: 'Jadvalni to\'ldir: hammasi bo\'lib nechta mashina?',
    was: 'Bor edi', came: 'Keldi', total: 'Hammasi',
    correct: 'Barakalla! Keldi — demak qo\'shamiz: 5 + 3 = 8.',
    less: 'Kam. "Keldi" — sonlar ko\'payadi. 5 va 3 ni qo\'sh.',
    more: 'Ko\'p. Faqat 5 va 3 ni qo\'sh: 5 + 3.',
  },
  ru: {
    title: 'Таблица задачи',
    setup: 'В гараже стояло 5 машин. Приехали ещё 3.',
    ask: 'Заполни таблицу: сколько всего машин?',
    was: 'Было', came: 'Приехало', total: 'Всего',
    correct: 'Молодец! Приехало — значит прибавляем: 5 + 3 = 8.',
    less: 'Мало. «Приехало» — становится больше. Сложи 5 и 3.',
    more: 'Много. Сложи только 5 и 3: 5 + 3.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot09(props) {
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
    const correct = picked === TOTAL;
    const msg = correct ? t.correct : (picked < TOTAL ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: TOTAL },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq09">
      <style>{`
        .aq09 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq09 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq09 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 14px; }
        .aq09 .aq-setup { color:#5c6672; font-weight:500; }
        .aq09 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq09 .aq-scene { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:4px;
          background:#eef1f6; border-radius:14px; padding:12px 10px; margin-bottom:14px; min-height:56px; }
        .aq09 .aq-car { font-size:30px; line-height:1; }
        .aq09 .aq-car.was { animation:aqPop .3s ease both; }
        .aq09 .aq-car.came { animation:aqDriveIn .5s cubic-bezier(.3,1.2,.5,1) both; }
        .aq09 .aq-gate { font-size:22px; color:#b6bdc9; margin:0 4px; }
        .aq09 .aq-table { width:100%; max-width:380px; margin:0 auto; border-collapse:separate; border-spacing:0; border:2px solid #d6dae3; border-radius:14px; overflow:hidden; }
        .aq09 .aq-table tr + tr td { border-top:1.5px solid #e8ebf0; }
        .aq09 .aq-table td { padding:13px 16px; font-size:20px; }
        .aq09 .aq-table td.lab { color:#6b7280; font-weight:600; font-size:16px; }
        .aq09 .aq-table td.val { text-align:right; font-weight:800; font-variant-numeric:tabular-nums; }
        .aq09 .aq-table tr.tot { background:#f6f8fb; }
        .aq09 .aq-table tr.tot.win { background:#e8f7ee; }
        .aq09 .aq-cell { display:inline-flex; min-width:44px; height:44px; align-items:center; justify-content:center; padding:0 8px;
          border-radius:12px; border:3px dashed #b9c1cf; color:#2563eb; font-weight:800; transition:all .15s; }
        .aq09 .aq-cell.filled { border-style:solid; border-color:#2563eb; background:#e8eefc; }
        .aq09 .aq-cell.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq09 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:20px; }
        .aq09 .aq-opt { width:66px; height:66px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq09 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq09 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq09 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq09 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq09 .aq-opt:disabled { cursor:default; }
        .aq09 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq09 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq09 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqDriveIn { 0%{opacity:0; transform:translateX(60px);} 100%{opacity:1; transform:translateX(0);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-scene">
        {Array.from({ length: WAS }).map((_, i) => <span key={'w' + i} className="aq-car was" style={{ animationDelay: `${i * 0.07}s` }}>🚗</span>)}
        <span className="aq-gate">▏</span>
        {Array.from({ length: CAME }).map((_, i) => <span key={'c' + i} className="aq-car came" style={{ animationDelay: `${0.4 + i * 0.18}s` }}>🚙</span>)}
      </div>

      <table className="aq-table">
        <tbody>
          <tr><td className="lab">{t.was}</td><td className="val">{WAS}</td></tr>
          <tr><td className="lab">{t.came}</td><td className="val">+ {CAME}</td></tr>
          <tr className={'tot' + (ok ? ' win' : '')}><td className="lab">{t.total}</td><td className="val">
            <span className={'aq-cell' + (picked === null ? '' : ok ? ' right filled' : ' filled')}>{picked === null ? '?' : picked}</span>
          </td></tr>
        </tbody>
      </table>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === TOTAL;
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
