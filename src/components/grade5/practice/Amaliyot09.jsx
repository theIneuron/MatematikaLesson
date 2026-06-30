// Amaliyot09 — Vizual: to'g'ri to'rtburchak yuzasi · Blok 5 · daraja Б · teg: area_rect
// Dars35 ga mos: yuza = ichidagi birlik kvadratlar soni = bo'y × en. Sostavnoy YO'Q.
// To'g'ri javobdan keyin kataklar to'lib, yuza (24) ko'rsatiladi. Yashirin javob yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const COLS = 6, ROWS = 4, ANSWER = 24; // 6 × 4
const DATA = { answer: ANSWER, tag: 'area_rect', level: 'Б', format: '2.6' };

const T = {
  uz: {
    title: 'Vizual: yuza',
    body: "Laylo devorni 1×1 sm plitkalar bilan qoplayapti. Devor 6 sm × 4 sm. Devor yuzasini (kerakli plitkalar sonini) toping.",
    label: 'Devor yuzasi (sm²)',
    hint: "Yuza = bo'y × en — ichidagi birlik kvadratlar soni.",
    correct: "To'g'ri. 6 × 4 = 24 sm² — 24 ta plitka kerak.",
    wrong: "Maslahat: bir qatorda nechta plitka borligini qatorlar soniga ko'paytiring (yoki barcha kvadratchalarni sanang).",
    unit: 'sm',
  },
  ru: {
    title: 'Визуально: площадь',
    body: 'Лайло выкладывает стену плитками 1×1 см. Стена 6 см × 4 см. Найдите площадь стены (сколько нужно плиток).',
    label: 'Площадь стены (см²)',
    hint: 'Площадь = длина × ширина — число единичных квадратов внутри.',
    correct: 'Верно. 6 × 4 = 24 см² — нужно 24 плитки.',
    wrong: 'Подсказка: умножьте число плиток в одном ряду на число рядов (или сосчитайте все квадратики).',
    unit: 'см',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [val, setVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(false); // to'g'ri javobdan keyin kataklarni to'ldirish

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.area != null) setVal(String(initialAnswer.studentAnswer.area));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(cleanInt(val) || '0', 10);
    const correct = v === DATA.answer;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { area: v }, correctAnswer: { area: DATA.answer },
      correct, meta: { tag: DATA.tag, level: DATA.level, format: DATA.format },
    });
  }, [val, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  // to'g'ri javobdan keyin: kataklar qatorlab to'ladi (yuza = kvadratlar soni)
  useEffect(() => {
    if (feedback && feedback.correct) {
      const tm = setTimeout(() => setFill(true), 60);
      return () => clearTimeout(tm);
    }
    setFill(false);
  }, [feedback]);

  const lock = isReview || checked;
  const u = 40, ox = 44, oy = 16, w = COLS * u, h = ROWS * u;
  const cells = [];
  for (let r = 0; r < ROWS; r += 1) for (let c = 0; c < COLS; c += 1) cells.push({ c, r, i: r * COLS + c });

  return (
    <div className="aq aq09">
      <style>{`
        .aq09 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq09 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq09 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 14px; }
        .aq09 .aq-svg { width:100%; max-width:300px; height:auto; display:block; margin:0 auto 16px; }
        .aq09 .aq-svg text { font-family:'Manrope',system-ui,sans-serif; font-size:13px; font-weight:700; fill:#374151; }
        .aq09 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin:14px 0 6px; }
        .aq09 input.aq-input { width:100%; box-sizing:border-box; font-size:22px; font-weight:700; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq09 input.aq-input:focus { border-color:#5b8def; background:#fff; }
        .aq09 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:6px; }
        .aq09 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq09 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq09 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <svg className="aq-svg" viewBox={`0 0 ${ox * 2 + w} ${oy * 2 + h}`} role="img" aria-label="6x4">
        <rect x={ox} y={oy} width={w} height={h} fill="#eef4ff" stroke="#1f2430" strokeWidth="2" />
        {/* birlik kataklar — to'g'ri javobdan keyin qatorlab to'ladi */}
        {cells.map((cell) => (
          <rect key={cell.i} x={ox + cell.c * u} y={oy + cell.r * u} width={u} height={u}
            fill="#5b8def" fillOpacity="0.55" stroke="#2f6fe0" strokeWidth="1"
            style={{ opacity: fill ? 1 : 0, transition: 'opacity .3s ease', transitionDelay: fill ? `${cell.i * 0.03}s` : '0s' }} />
        ))}
        {fill && (
          <text x={ox + w / 2} y={oy + h / 2 + 9} textAnchor="middle"
            style={{ fontSize: 30, fontWeight: 800, fill: '#1a7f43' }}>{ANSWER}</text>
        )}
        <text x={ox + w / 2} y={oy - 3} textAnchor="middle">6 {t.unit}</text>
        <text x={ox - 5} y={oy + h / 2} textAnchor="end">4 {t.unit}</text>
      </svg>

      <label className="aq-label" htmlFor="aq09-in">{t.label}</label>
      <input id="aq09-in" className="aq-input" value={val}
        onChange={(e) => setVal(cleanInt(e.target.value))}
        inputMode="numeric" pattern="[0-9]*" placeholder="0" disabled={lock} />
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
