// Amaliyot22 — Foiz-setka: 100 katakdan foizni bo'yash · Blok 4 · daraja Б · teg: percent_grid
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: 10×10 setka; katakni bosganda birinchi k katak to'ldiriladi (kumulyativ).
// O'quvchi 35% ni bo'yashi kerak; jonli hisoblagich N% · N/100 · 0,N ko'rsatadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 35; // %

const DATA = { tag: 'percent_grid', level: 'Б', format: 'constructor', block: 4 };

const T = {
  uz: {
    title: 'Foiz — yuzdan ulush',
    body: "Setkada 35% ni bo'yang. Bir katak — bu 1%. Kerakli katakni bossangiz, o'shangacha to'ladi.",
    live: (n) => `${n}%  ·  ${n}/100  ·  ${String(n / 100).replace('.', ',')}`,
    hint: "35% — bu yuz katakdan 35 tasi. Uch to'liq qator (30) va yana 5 katak.",
    correct: "To'g'ri. 35% = 35/100 = 0,35 — yuz katakdan 35 tasi bo'yaldi.",
    wrong: "Hali to'g'ri emas. Aynan 35 katak kerak: uch qator (30) va yana 5 ta.",
    clear: 'Tozalash',
  },
  ru: {
    title: 'Процент — сотая доля',
    body: 'Закрасьте 35% на сетке. Одна клетка — это 1%. Нажмите нужную клетку — закрасится до неё.',
    live: (n) => `${n}%  ·  ${n}/100  ·  ${String(n / 100).replace('.', ',')}`,
    hint: '35% — это 35 клеток из ста. Три полных строки (30) и ещё 5 клеток.',
    correct: 'Верно. 35% = 35/100 = 0,35 — закрашено 35 клеток из ста.',
    wrong: 'Пока неверно. Нужно ровно 35 клеток: три строки (30) и ещё 5.',
    clear: 'Очистить',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot22(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [filled, setFilled] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.filled != null) {
      setFilled(initialAnswer.studentAnswer.filled); setTouched(true);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const setTo = (k) => { if (isReview || checked) return; setTouched(true); setFilled(k); };

  const check = useCallback(() => {
    const correct = filled === TARGET;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { filled }, correctAnswer: { filled: TARGET },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, target: TARGET },
    });
  }, [filled, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const okColor = checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';

  return (
    <div className="aq aq22">
      <style>{`
        .aq22 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq22 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq22 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq22 .aq-grid { width:260px; height:260px; margin:0 auto; display:grid; grid-template-columns:repeat(10,1fr); grid-template-rows:repeat(10,1fr); gap:2px; background:#cfd6e4; padding:2px; border-radius:8px; }
        .aq22 .aq-c { border:none; padding:0; cursor:pointer; border-radius:2px; }
        .aq22 .aq-c:disabled { cursor:default; }
        .aq22 .aq-live { text-align:center; margin:16px 0 4px; font-size:22px; font-weight:800; font-variant-numeric:tabular-nums; }
        .aq22 .aq-tools { display:flex; justify-content:center; margin-top:8px; }
        .aq22 .aq-clear { font-size:13px; font-weight:700; color:#6b7280; background:#f3f4f6; border:1.5px solid #e5e7eb; border-radius:10px; padding:7px 14px; cursor:pointer; }
        .aq22 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:10px; text-align:center; }
        .aq22 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq22 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq22 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-grid">
        {Array.from({ length: 100 }).map((_, i) => (
          <button key={i} type="button" className="aq-c"
            style={{ background: i < filled ? okColor : '#fff' }}
            onClick={() => setTo(i + 1)} disabled={isReview || checked} aria-label={`${i + 1}%`} />
        ))}
      </div>

      <div className="aq-live" style={{ color: okColor }}>{t.live(filled)}</div>
      {!checked && (
        <div className="aq-tools">
          <button type="button" className="aq-clear" onClick={() => setTo(0)} disabled={isReview}>{t.clear}</button>
        </div>
      )}
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
