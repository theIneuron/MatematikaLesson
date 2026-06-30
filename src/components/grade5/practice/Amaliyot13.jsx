// Amaliyot13 — Interaktiv: xona dizayneri (yuza 24, perimetr 20) · Blok 5 · daraja С · teg: area_perim_design
// Manba: MathPraktikums «Дизайнер комнаты». jsx-question kontraktiga keltirilgan, Amaliyot dizayni. Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const MINS = 1, MAXS = 8;
const NEED_AREA = 24, NEED_PERIM = 20; // 6 × 4
const DATA = { area: NEED_AREA, perim: NEED_PERIM, tag: 'area_perim_design', level: 'С', format: '2.8' };

const T = {
  uz: {
    title: 'Xona dizayneri',
    body: "Zaynab xona loyihasini chizmoqda. Shunday xona tuzing: yuzasi 24 m², perimetri 20 m. Hisob avtomatik tekshiriladi.",
    width: 'Eni',
    height: "Bo'yi",
    area: 'Yuza',
    perim: 'Perimetr',
    unit: 'm',
    correct: "Tayyor! Yuza 24 m², perimetr 20 m — xona 6 × 4.",
    wrongPre: 'Hozircha mos emas:',
    needArea: 'yuza',
    needPerim: 'perimetr',
    needWord: 'kerak',
    hintTail: "Tomonlarni o'zgartiring — tizim o'zi qayta hisoblaydi.",
  },
  ru: {
    title: 'Дизайнер комнаты',
    body: 'Зайнаб проектирует комнату. Спроектируйте комнату: площадь 24 м², периметр 20 м. Расчёт проверяется автоматически.',
    width: 'Ширина',
    height: 'Высота',
    area: 'Площадь',
    perim: 'Периметр',
    unit: 'м',
    correct: 'Готово! Площадь 24 м², периметр 20 м — комната 6 × 4.',
    wrongPre: 'Пока не то:',
    needArea: 'площадь',
    needPerim: 'периметр',
    needWord: 'нужно',
    hintTail: 'Меняйте стороны — система пересчитывает сама.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot13(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [w, setW] = useState(4);
  const [h, setH] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const area = w * h;
  const perim = 2 * (w + h);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.w != null) setW(sa.w);
      if (sa.h != null) setH(sa.h);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(!checked && !isReview); }, [checked, isReview, onReady]);

  const setWv = (v) => { if (checked || isReview) return; setW(v); setFeedback(null); };
  const setHv = (v) => { if (checked || isReview) return; setH(v); setFeedback(null); };

  const check = useCallback(() => {
    const correct = area === DATA.area && perim === DATA.perim;
    let msg = t.correct;
    if (!correct) {
      const parts = [];
      if (area !== DATA.area) parts.push(`${t.needArea} ${area} (${t.needWord} ${DATA.area})`);
      if (perim !== DATA.perim) parts.push(`${t.needPerim} ${perim} (${t.needWord} ${DATA.perim})`);
      msg = `${t.wrongPre} ${parts.join(', ')}. ${t.hintTail}`;
    }
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { w, h, area, perim }, correctAnswer: { area: DATA.area, perim: DATA.perim },
      correct, meta: { tag: DATA.tag, level: DATA.level, format: DATA.format },
    });
  }, [w, h, area, perim, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const cell = 24;
  const areaOk = area === DATA.area;
  const perimOk = perim === DATA.perim;

  const Stepper = ({ label, value, set }) => (
    <div className="aq-step">
      <span className="aq-step-l">{label}</span>
      <div className="aq-step-c">
        <button type="button" className="aq-step-b" disabled={lock || value <= MINS} onClick={() => set(Math.max(MINS, value - 1))} aria-label="-">−</button>
        <span className="aq-step-v">{value} {t.unit}</span>
        <button type="button" className="aq-step-b" disabled={lock || value >= MAXS} onClick={() => set(Math.min(MAXS, value + 1))} aria-label="+">+</button>
      </div>
    </div>
  );

  return (
    <div className="aq aq13">
      <style>{`
        .aq13 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq13 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq13 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq13 .aq-room { display:flex; gap:22px; flex-wrap:wrap; align-items:flex-start; }
        .aq13 .aq-grid { display:grid; gap:2px; background:#cdd4df; padding:2px; border-radius:8px; }
        .aq13 .aq-gc { background:#e8eefc; border-radius:2px; }
        .aq13 .aq-panel { flex:1; min-width:210px; }
        .aq13 .aq-step { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:12px; }
        .aq13 .aq-step-l { font-size:14px; font-weight:600; color:#374151; }
        .aq13 .aq-step-c { display:flex; align-items:center; gap:8px; }
        .aq13 .aq-step-b { width:34px; height:34px; border-radius:9px; border:2px solid #d6dae3; background:#fff; color:#1f2430; font-size:18px; cursor:pointer; line-height:1; }
        .aq13 .aq-step-b:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq13 .aq-step-b:disabled { opacity:.45; cursor:default; }
        .aq13 .aq-step-v { min-width:58px; text-align:center; font-size:16px; font-weight:700; font-variant-numeric:tabular-nums; }
        .aq13 .aq-out { display:flex; gap:10px; margin-top:4px; }
        .aq13 .aq-card { flex:1; background:#f4f6f9; border-radius:12px; padding:10px 12px; border:2px solid transparent; }
        .aq13 .aq-card.ok { border-color:#1a7f43; background:#e8f7ee; }
        .aq13 .aq-card .k { font-size:12px; color:#8a97a2; }
        .aq13 .aq-card .v { font-size:21px; font-weight:700; font-variant-numeric:tabular-nums; }
        .aq13 .aq-card.ok .v { color:#1a7f43; }
        .aq13 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq13 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq13 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-room">
        <div className="aq-grid" style={{ gridTemplateColumns: `repeat(${w}, ${cell}px)`, gridAutoRows: `${cell}px` }}>
          {Array.from({ length: w * h }).map((_, i) => (<div key={i} className="aq-gc" />))}
        </div>

        <div className="aq-panel">
          <Stepper label={t.width} value={w} set={setWv} />
          <Stepper label={t.height} value={h} set={setHv} />
          <div className="aq-out">
            <div className={`aq-card ${areaOk ? 'ok' : ''}`}>
              <div className="k">{t.area}</div>
              <div className="v">{area} {t.unit}²</div>
            </div>
            <div className={`aq-card ${perimOk ? 'ok' : ''}`}>
              <div className="k">{t.perim}</div>
              <div className="v">{perim} {t.unit}</div>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg || (feedback.correct ? t.correct : '')}</span>
        </div>
      )}
    </div>
  );
}
