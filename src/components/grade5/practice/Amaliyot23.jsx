// Amaliyot23 — Uchburchak yuzasi · Blok 5 · daraja С · teg: triangle_area
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: asos 6, balandlik 4 → yuza = ½·6·4 = 12. Vizual: uchburchak o'z to'rtburchagi ichida
// (yarmi). O'quvchi yuzani kiritadi. "÷2 ni unutish" xatosi qarshi olinadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const BASE = 6, HEIGHT = 4;
const ANS = (BASE * HEIGHT) / 2; // 12

const DATA = { tag: 'triangle_area', level: 'С', format: 'input', block: 5 };

const T = {
  uz: {
    title: 'Uchburchak yuzasi',
    body: "Asosi 6 sm, balandligi 4 sm bo'lgan uchburchakning yuzasini toping (sm²).",
    formula: 'S = ½ · asos · balandlik',
    label: 'Yuza (sm²):',
    hint: "Uchburchak — o'z to'rtburchagining yarmi. 6 · 4 = 24, yarmi — 12.",
    correct: "To'g'ri. S = ½ · 6 · 4 = 12 sm².",
    wrong: "Hali to'g'ri emas. 24 — bu to'rtburchakning yuzasi. Uchburchak uning yarmi: 24 : 2 = 12.",
    base: 'asos 6', height: 'balandlik 4',
  },
  ru: {
    title: 'Площадь треугольника',
    body: 'Найдите площадь треугольника с основанием 6 см и высотой 4 см (см²).',
    formula: 'S = ½ · основание · высота',
    label: 'Площадь (см²):',
    hint: 'Треугольник — половина своего прямоугольника. 6 · 4 = 24, половина — 12.',
    correct: 'Верно. S = ½ · 6 · 4 = 12 см².',
    wrong: 'Пока неверно. 24 — это площадь прямоугольника. Треугольник — его половина: 24 : 2 = 12.',
    base: 'основание 6', height: 'высота 4',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot23(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [val, setVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.value != null) {
      setVal(String(initialAnswer.studentAnswer.value));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(cleanInt(val) || '-1', 10);
    const correct = v === ANS;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { value: v }, correctAnswer: { value: ANS },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, base: BASE, height: HEIGHT },
    });
  }, [val, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  return (
    <div className="aq aq23">
      <style>{`
        .aq23 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq23 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq23 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 12px; }
        .aq23 .aq-figwrap { display:flex; justify-content:center; margin:8px 0 14px; }
        .aq23 .aq-formula { text-align:center; font-size:18px; font-weight:800; color:#fe5b1a; margin:2px 0 16px; }
        .aq23 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .aq23 input.aq-input { width:100%; box-sizing:border-box; font-size:24px; font-weight:800; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq23 input.aq-input:focus { border-color:#fb7a45; background:#fff; }
        .aq23 input.aq-input:disabled { opacity:.85; }
        .aq23 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:8px; }
        .aq23 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq23 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq23 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-figwrap">
        <svg width="220" height="150" viewBox="0 0 220 150" role="img">
          {/* to'rtburchak (uchburchakning ikki barobari) — punktir */}
          <rect x="20" y="18" width="180" height="104" fill="#eef2f8" stroke="#cfd6e4" strokeWidth="2" strokeDasharray="5 5" />
          {/* uchburchak — yarmi to'ldirilgan */}
          <polygon points="20,122 200,122 20,18" fill="#fe5b1a" fillOpacity="0.18" stroke="#fe5b1a" strokeWidth="2.5" />
          {/* balandlik */}
          <line x1="20" y1="18" x2="20" y2="122" stroke="#c9a23a" strokeWidth="3" />
          <text x="8" y="74" fill="#c9a23a" fontSize="12" fontWeight="700" transform="rotate(-90 8 74)" textAnchor="middle">{t.height}</text>
          {/* asos */}
          <text x="110" y="140" fill="#fe5b1a" fontSize="12" fontWeight="700" textAnchor="middle">{t.base}</text>
        </svg>
      </div>
      <div className="aq-formula">{t.formula}</div>

      <label className="aq-label" htmlFor="aq23-in">{t.label}</label>
      <input id="aq23-in" className="aq-input" value={val} onChange={(e) => setVal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" disabled={isReview || checked} placeholder="0" />
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
