// Amaliyot11 — Interaktiv: sonlar nurida nuqta (batiskaf chuqurligi) · Blok 1 · daraja Б · teg: integer_numberline
// Manba: MathPraktikums «Экспедиция по прямой». jsx-question kontraktiga keltirilgan, Amaliyot dizayni. Audio yo'q.
//   - tayyorlikni onReady(true/false) bilan xabar qiladi (nuqta tanlanganda),
//   - tekshiruvni registerCheck(fn) orqali ro'yxatdan o'tkazadi (o'z tugmasi yo'q),
//   - natijani onSubmit(result) bilan bir marta yuboradi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const MIN = -5, MAX = 5, TARGET = -3;
const DATA = { target: TARGET, tag: 'integer_numberline', level: 'Б', format: '2.8' };

const T = {
  uz: {
    title: 'Sonlar nuri',
    body:
      "Alisher batiskafda dengiz tubiga sho'ng'imoqda. Batiskafni −3 metr chuqurlikka " +
      "qo'ying: sonlar nurida shu nuqtani belgilang.",
    depth: 'Chuqurlik',
    hintStart: 'Noldan boshlab nuqta tanlang.',
    correct: "To'g'ri. −3 metr — noldan uchta bo'linma past.",
    hintPos: "Maslahat: chuqurlik noldan past bo'ladi. 0 dan chapdan qidiring.",
    hintNeg: "Yaqin. Noldan chapga aniq uchta bo'linma sanang.",
    unit: 'm',
  },
  ru: {
    title: 'Числовая прямая',
    body:
      'Алишер погружается на батискафе. Поставьте батискаф на глубину −3 метра: ' +
      'отметьте эту точку на числовой прямой.',
    depth: 'Глубина',
    hintStart: 'Выберите точку на прямой.',
    correct: 'Верно. −3 метра — три деления ниже нуля.',
    hintPos: 'Подсказка: глубина ниже нуля. Ищите слева от 0.',
    hintNeg: 'Близко. Отсчитайте ровно три деления влево от нуля.',
    unit: 'м',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const TICKS = [];
for (let i = MIN; i <= MAX; i += 1) TICKS.push(i);

export default function Amaliyot11(props) {
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
    const correct = picked === DATA.target;
    const msg = correct ? null : (picked > 0 ? t.hintPos : t.hintNeg);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: TICKS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: DATA.target },
      correct, meta: { tag: DATA.tag, level: DATA.level, format: DATA.format },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq11">
      <style>{`
        .aq11 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq11 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq11 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 18px; }
        .aq11 .aq-nl { padding:2px 6px; }
        .aq11 .aq-marks { display:flex; margin-bottom:2px; }
        .aq11 .aq-mark { flex:1; text-align:center; height:20px; color:#fe5b1a; font-size:15px; }
        .aq11 .aq-axis { position:relative; height:2px; background:#cdd4df; margin:0 4px; }
        .aq11 .aq-zero { position:absolute; left:50%; top:-5px; width:2px; height:12px; background:#9aa1ad; transform:translateX(-50%); }
        .aq11 .aq-ticks { display:flex; margin-top:6px; gap:3px; }
        .aq11 .aq-tick { flex:1; padding:9px 0; font-size:15px; font-weight:600; border-radius:9px;
          border:2px solid transparent; background:#f4f6f9; color:#5c6b78; cursor:pointer; font-variant-numeric:tabular-nums;
          transition:background .12s, border-color .12s; }
        .aq11 .aq-tick:hover:not(:disabled) { background:#e8eefc; }
        .aq11 .aq-tick.sel { border-color:#fe5b1a; background:#e8eefc; color:#1f2430; }
        .aq11 .aq-tick.zero { color:#1f2430; font-weight:800; }
        .aq11 .aq-tick.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .aq11 .aq-tick:disabled { cursor:default; }
        .aq11 .aq-depth { margin-top:14px; font-size:14px; color:#6b7280; }
        .aq11 .aq-depth b { color:#1f2430; font-variant-numeric:tabular-nums; }
        .aq11 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq11 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq11 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-nl">
        <div className="aq-marks">
          {TICKS.map((n) => (
            <div key={n} className="aq-mark">{picked === n ? '▼' : ''}</div>
          ))}
        </div>
        <div className="aq-axis"><span className="aq-zero" /></div>
        <div className="aq-ticks">
          {TICKS.map((n) => {
            const sel = picked === n;
            const right = ok && n === DATA.target;
            const cls = 'aq-tick' + (n === 0 ? ' zero' : '') + (right ? ' right' : sel ? ' sel' : '');
            return (
              <button key={n} type="button" className={cls} disabled={lock}
                onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
            );
          })}
        </div>
      </div>

      <div className="aq-depth">{t.depth}: <b>{picked === null ? '—' : `${picked} ${t.unit}`}</b></div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.correct ? t.correct : (feedback.msg || t.hintNeg)}</span>
        </div>
      )}
    </div>
  );
}
