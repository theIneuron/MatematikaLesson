// Amaliyot17 (1-sinf) — P11 Topib bos: barcha doiralarni top · Blok 7 · daraja 🟢 · teg: find_tap
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash (bir nechta). Animatsiya: to'g'rida doiralar sakraydi, xato belgilangan xatolar qizil.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// 3×3: doira/kvadrat/uchburchak aralash. Doiralar — javob.
const SHAPES = [
  { id: 0, kind: 'circle', e: '🔵' }, { id: 1, kind: 'square', e: '🟦' }, { id: 2, kind: 'triangle', e: '🔺' },
  { id: 3, kind: 'circle', e: '🔵' }, { id: 4, kind: 'triangle', e: '🔺' }, { id: 5, kind: 'circle', e: '🔵' },
  { id: 6, kind: 'square', e: '🟦' }, { id: 7, kind: 'circle', e: '🔵' }, { id: 8, kind: 'square', e: '🟦' },
];
const CIRCLES = SHAPES.filter((s) => s.kind === 'circle').map((s) => s.id);
const DATA = { count: CIRCLES.length, tag: 'find_tap', level: '🟢', block: 7, ptype: 'P11' };

const T = {
  uz: {
    title: 'Topib bos',
    setup: 'Bu yerda doira, kvadrat va uchburchaklar aralashib turibdi.',
    ask: 'Barcha doiralarni topib bos.',
    correct: 'Barakalla! Barcha doiralarni topding.',
    wrong: 'Hammasi emas. Faqat dumaloq shakllarni — doiralarni bos.',
  },
  ru: {
    title: 'Найди и нажми',
    setup: 'Здесь перемешаны круги, квадраты и треугольники.',
    ask: 'Найди и нажми все круги.',
    correct: 'Молодец! Ты нашёл все круги.',
    wrong: 'Не все. Нажимай только круглые фигуры — круги.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot17(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [sel, setSel] = useState({});   // { id: true }
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const selCount = Object.keys(sel).filter((k) => sel[k]).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.sel) {
      setSel(initialAnswer.studentAnswer.sel);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(selCount > 0 && !checked); }, [selCount, checked, onReady]);

  const toggle = (id) => {
    if (isReview || checked) return;
    setFeedback(null);
    setSel((m) => ({ ...m, [id]: !m[id] }));
  };

  const check = useCallback(() => {
    const chosen = SHAPES.filter((s) => sel[s.id]).map((s) => s.id).sort();
    const correct = chosen.length === CIRCLES.length && CIRCLES.every((id) => sel[id]);
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: ['🔵', '🟦', '🔺'],
      studentAnswer: { sel, chosen }, correctAnswer: { circles: CIRCLES },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [sel, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq17">
      <style>{`
        .aq17 { max-width:560px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq17 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq17 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq17 .aq-setup { color:#5c6672; font-weight:500; }
        .aq17 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq17 .aq-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; max-width:320px; margin:0 auto; }
        .aq17 .aq-cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:46px;
          border-radius:16px; border:2.5px solid #e4e7ec; background:#fff; cursor:pointer; transition:border-color .12s, background .12s, transform .1s; }
        .aq17 .aq-cell:hover:not(.lock) { border-color:#9bb6f0; }
        .aq17 .aq-cell:active:not(.lock) { transform:scale(.93); }
        .aq17 .aq-cell.sel { border-color:#2563eb; background:#e8eefc; }
        .aq17 .aq-cell.lock { cursor:default; }
        .aq17 .aq-cell.good { border-color:#1a7f43; background:#e8f7ee; animation:aqBounce .5s ease; }
        .aq17 .aq-cell.miss { border-color:#f0b046; background:#fdf5e6; }
        .aq17 .aq-cell.bad { border-color:#e6a6a6; background:#fdecec; }
        .aq17 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq17 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq17 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqBounce { 0%,100%{ transform:translateY(0);} 30%{ transform:translateY(-9px);} 60%{ transform:translateY(-4px);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-grid">
        {SHAPES.map((s, i) => {
          const isSel = !!sel[s.id];
          const isCircle = s.kind === 'circle';
          let cls = 'aq-cell' + (lock ? ' lock' : '');
          if (checked) {
            if (isCircle && isSel) cls += ' good';
            else if (isCircle && !isSel) cls += ' miss';    // topilmagan doira
            else if (!isCircle && isSel) cls += ' bad';       // xato tanlangan
          } else if (isSel) cls += ' sel';
          return (
            <div key={s.id} className={cls} style={{ animationDelay: `${i * 0.04}s` }} onClick={() => toggle(s.id)}>{s.e}</div>
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
