// Amaliyot24 — Hajm: nechta kubik · Blok 5 · daraja С · teg: volume_cubes
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: 3×2 asosli quti, 4 qavat → hajm = 6·4 = 24 kubik. Qavatlarni slider bilan ko'rish
// mumkin ("predskaji → tekshir"). O'quvchi umumiy hajmni kiritadi. Yuza↔hajm chalkashligi qarshi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const W = 3, D = 2, H = 4;          // uzunlik × en × balandlik
const BASE = W * D;                  // 6
const ANS = BASE * H;                // 24

const DATA = { tag: 'volume_cubes', level: 'С', format: 'sandbox', block: 5 };

const T = {
  uz: {
    title: 'Hajm — nechta kubik',
    body: "Asosi 3×2, balandligi 4 qavat bo'lgan quti. Unga jami nechta birlik kubik sig'adi?",
    layers: (n) => `Ko'rsatilgan qavatlar: ${n} / ${H}`,
    formula: 'Hajm = asos yuzasi × balandlik = (3 · 2) · 4',
    label: 'Hajm (kubik):',
    hint: "Har qavatda 3·2 = 6 kubik. 4 qavat: 6 · 4 = 24.",
    correct: "To'g'ri. Har qavatda 6 kubik, 4 qavat: 6 · 4 = 24 kubik.",
    wrong: "Hali to'g'ri emas. 6 — bu faqat bitta qavat (yuza). Hajm uchun qavatlar soniga ko'paytiring: 6 · 4 = 24.",
  },
  ru: {
    title: 'Объём — сколько кубиков',
    body: 'Коробка с основанием 3×2 и высотой 4 слоя. Сколько всего единичных кубиков в неё поместится?',
    layers: (n) => `Показано слоёв: ${n} / ${H}`,
    formula: 'Объём = площадь основания × высота = (3 · 2) · 4',
    label: 'Объём (кубики):',
    hint: 'В каждом слое 3·2 = 6 кубиков. 4 слоя: 6 · 4 = 24.',
    correct: 'Верно. В каждом слое 6 кубиков, 4 слоя: 6 · 4 = 24 кубика.',
    wrong: 'Пока неверно. 6 — это только один слой (площадь). Для объёма умножьте на число слоёв: 6 · 4 = 24.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot24(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [shownLayers, setShownLayers] = useState(H);
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
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, w: W, d: D, h: H },
    });
  }, [val, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  // izometrik qavatlar: pastdan yuqoriga, har qavat 3×2 katak
  const cube = 26, dx = 11, dy = 6;    // katak o'lchami va izo-siljish
  const layerH = 16;                    // qavatlar orasidagi balandlik
  const svgW = W * cube + D * dx + 40;
  const svgH = H * layerH + D * dy + cube + 40;
  const layers = [];
  for (let L = 0; L < shownLayers; L++) {
    const yBase = svgH - 24 - L * layerH;
    for (let r = D - 1; r >= 0; r--) {
      for (let c = 0; c < W; c++) {
        const x = 20 + c * cube + r * dx;
        const y = yBase - r * dy;
        layers.push(
          <rect key={`${L}-${r}-${c}`} x={x} y={y - cube} width={cube - 2} height={cube - 2} rx="3"
            fill="#2563eb" fillOpacity={0.18 + L * 0.14} stroke="#2563eb" strokeWidth="1.5" />
        );
      }
    }
  }

  return (
    <div className="aq aq24">
      <style>{`
        .aq24 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq24 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq24 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 12px; }
        .aq24 .aq-figwrap { display:flex; justify-content:center; margin:6px 0 8px; }
        .aq24 .aq-slider { display:block; width:80%; max-width:280px; margin:4px auto 2px; }
        .aq24 .aq-layers { text-align:center; font-size:13px; color:#6b7280; font-weight:700; margin-bottom:12px; }
        .aq24 .aq-formula { text-align:center; font-size:16px; font-weight:800; color:#2563eb; margin:2px 0 16px; }
        .aq24 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .aq24 input.aq-input { width:100%; box-sizing:border-box; font-size:24px; font-weight:800; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq24 input.aq-input:focus { border-color:#5b8def; background:#fff; }
        .aq24 input.aq-input:disabled { opacity:.85; }
        .aq24 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:8px; }
        .aq24 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq24 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq24 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-figwrap">
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} role="img">{layers}</svg>
      </div>
      <input className="aq-slider" type="range" min="1" max={H} value={shownLayers}
        onChange={(e) => setShownLayers(parseInt(e.target.value, 10))} disabled={isReview} />
      <div className="aq-layers">{t.layers(shownLayers)}</div>
      <div className="aq-formula">{t.formula}</div>

      <label className="aq-label" htmlFor="aq24-in">{t.label}</label>
      <input id="aq24-in" className="aq-input" value={val} onChange={(e) => setVal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" disabled={isReview || checked} placeholder="0" />
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
