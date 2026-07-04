// Amaliyot21 (1-sinf) — P18 Ortiqchani top · razogrev/ИК · daraja 🟡 · teg: odd_one_out
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'rida ortiqcha narsa ajralib chiqadi, mevalar yashil.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// uchtasi meva, bittasi ortiqcha (to'p)
const ITEMS = [
  { id: 0, e: '🍎', group: 'fruit' },
  { id: 1, e: '⚽', group: 'toy' },
  { id: 2, e: '🍌', group: 'fruit' },
  { id: 3, e: '🍐', group: 'fruit' },
];
const ODD = ITEMS.find((it) => it.group === 'toy').id;
const DATA = { odd: ODD, tag: 'odd_one_out', level: '🟡', block: 0, ptype: 'P18' };

const T = {
  uz: {
    title: 'Ortiqchani top',
    setup: 'To\'rtta narsa bor: uchtasi bir turkumga kiradi, bittasi ortiqcha.',
    ask: 'Ortiqcha narsani topib bos.',
    correct: 'Barakalla! Olma, banan, nok — mevalar. To\'p meva emas — u ortiqcha.',
    wrong: 'Bu meva. Mevalarni qoldirib, meva bo\'lmagan narsani top.',
  },
  ru: {
    title: 'Что лишнее',
    setup: 'Четыре предмета: три из одной группы, один лишний.',
    ask: 'Найди и нажми лишний предмет.',
    correct: 'Молодец! Яблоко, банан, груша — фрукты. Мяч — не фрукт, он лишний.',
    wrong: 'Это фрукт. Оставь фрукты и найди предмет, который не фрукт.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot21(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.id != null) setPicked(initialAnswer.studentAnswer.id);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === ODD;
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: ITEMS.map((it) => it.e),
      studentAnswer: { id: picked, e: ITEMS[picked].e }, correctAnswer: { id: ODD, e: ITEMS[ODD].e },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq21">
      <style>{`
        .aq21 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq21 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq21 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq21 .aq-setup { color:#5c6672; font-weight:500; }
        .aq21 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq21 .aq-row { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .aq21 .aq-item { width:88px; height:88px; display:flex; align-items:center; justify-content:center; font-size:48px;
          border-radius:18px; border:2.5px solid #e4e7ec; background:#fff; cursor:pointer; transition:border-color .12s, background .12s, transform .15s; }
        .aq21 .aq-item:hover:not(.lock) { border-color:#9bb6f0; }
        .aq21 .aq-item:active:not(.lock) { transform:scale(.93); }
        .aq21 .aq-item.sel { border-color:#2563eb; background:#e8eefc; }
        .aq21 .aq-item.lock { cursor:default; }
        .aq21 .aq-item.odd { border-color:#1a7f43; background:#e8f7ee; transform:translateY(-8px) scale(1.06); box-shadow:0 6px 16px rgba(26,127,67,.2); }
        .aq21 .aq-item.dim { opacity:.5; }
        .aq21 .aq-item.badpick { border-color:#e6a6a6; background:#fdecec; }
        .aq21 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq21 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq21 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-row">
        {ITEMS.map((it) => {
          let cls = 'aq-item' + (lock ? ' lock' : '');
          if (checked) {
            if (it.id === ODD) cls += ' odd';
            else cls += ' dim';
            if (picked === it.id && it.id !== ODD) cls += ' badpick';
          } else if (picked === it.id) cls += ' sel';
          return (
            <div key={it.id} className={cls} onClick={() => { if (!lock) { setPicked(it.id); setFeedback(null); } }}>{it.e}</div>
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
