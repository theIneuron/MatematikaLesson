// Amaliyot04 — Mini-o'yin "Kasr chaqmog'i" (qisqartirish) · Blok 2 · daraja Б · teg: fraction_reduce
// 10 ta kasrni qisqarmas ko'rinishgacha qisqartirish. Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// [surat, maxraj] — boshlang'ich kasrlar
const FRACTIONS = [[4, 8], [6, 9], [10, 15], [8, 12], [9, 12], [6, 8], [14, 21], [5, 10], [12, 18], [20, 25]];

const DATA = { tag: 'fraction_reduce', level: 'Б', format: '2.3' };

const T = {
  uz: {
    title: "Kasr chaqmog'i",
    body: "Sanjar retseptdagi miqdorlarni soddalashtiryapti. Har bir kasrni qisqarmas ko'rinishgacha qisqartiring.",
    correct: (n) => `Ajoyib! 10 tadan ${n} tasi to'g'ri qisqartirildi.`,
    wrong: (n) => `${n}/10 to'g'ri. Maslahat: surat va maxrajni umumiy bo'luvchiga bo'lib, oxirigacha qisqartiring.`,
  },
  ru: {
    title: 'Молния дробей',
    body: 'Санжар упрощает количества в рецепте. Сократите каждую дробь до несократимого вида.',
    correct: (n) => `Отлично! Из 10 верно сокращено ${n}.`,
    wrong: (n) => `${n}/10 верно. Подсказка: делите числитель и знаменатель на общий делитель до конца.`,
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export default function Amaliyot04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [vals, setVals] = useState(() => FRACTIONS.map(() => ({ n: '', d: '' })));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [res, setRes] = useState(null); // har qator: to'g'ri/noto'g'ri (animatsiya uchun)

  useEffect(() => {
    if (initialAnswer && Array.isArray(initialAnswer.studentAnswer)) {
      setVals(initialAnswer.studentAnswer.map((p) => ({ n: String(p.n ?? ''), d: String(p.d ?? '') })));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, n: initialAnswer.meta?.score ?? 0 }); setChecked(true); }
    }
  }, [initialAnswer]);

  const allFilled = vals.every((v) => v.n.trim() !== '' && v.d.trim() !== '');
  useEffect(() => { onReady?.(allFilled && !checked); }, [allFilled, checked, onReady]);

  const setCell = (i, key, raw) => setVals((prev) => prev.map((v, j) => (j === i ? { ...v, [key]: cleanInt(raw) } : v)));

  const check = useCallback(() => {
    let score = 0;
    const detail = FRACTIONS.map(([on, od], i) => {
      const n = parseInt(cleanInt(vals[i].n) || '0', 10);
      const d = parseInt(cleanInt(vals[i].d) || '0', 10);
      const equal = d !== 0 && n * od === d * on; // qiymati teng
      const reduced = d !== 0 && gcd(n, d) === 1; // qisqarmas
      const ok = equal && reduced;
      if (ok) score += 1;
      return { n, d, ok };
    });
    const correct = score === FRACTIONS.length;
    setRes(detail.map((x) => x.ok));
    setFeedback({ correct, n: score }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: FRACTIONS.map(([n, d]) => `${n}/${d}`),
      studentAnswer: detail.map((x) => ({ n: x.n, d: x.d })),
      correctAnswer: FRACTIONS.map(([on, od]) => { const g = gcd(on, od); return { n: on / g, d: od / g }; }),
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, score },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq04">
      <style>{`
        .aq04 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq04 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq04 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq04 .aq-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px 14px; }
        @media (max-width:430px){ .aq04 .aq-grid { grid-template-columns:1fr; } }
        .aq04 .aq-row { display:flex; align-items:center; gap:8px; background:#f8fafc; border:1.5px solid #eef0f4; border-radius:12px; padding:8px 10px; }
        .aq04 .aq-row.ok { border-color:#36b37e; animation: okPulse .55s ease both; }
        .aq04 .aq-row.no { border-color:#ef9a9a; }
        @keyframes okPulse { 0%{ background:#f8fafc; } 45%{ background:#d6f5e3; } 100%{ background:#eafaf1; } }
        .aq04 .aq-src { display:inline-flex; flex-direction:column; align-items:center; line-height:1; min-width:42px; }
        .aq04 .aq-src span { font-size:18px; font-weight:800; }
        .aq04 .aq-src .sbar { align-self:stretch; height:2px; background:#1f2430; margin:2px 0; }
        .aq04 .aq-eq { font-size:18px; font-weight:800; color:#9aa1ad; }
        .aq04 .aq-frac { display:flex; flex-direction:column; align-items:center; }
        .aq04 .aq-frac input { width:48px; font-size:18px; font-weight:700; text-align:center; padding:6px 4px; border-radius:9px; border:2px solid #d6dae3; background:#fff; outline:none; }
        .aq04 .aq-frac input:focus { border-color:#fb7a45; }
        .aq04 .aq-bar { width:40px; height:2px; background:#1f2430; margin:3px 0; }
        .aq04 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq04 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq04 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>
      <div className="aq-grid">
        {FRACTIONS.map(([n, d], i) => (
          <div className={`aq-row ${res ? (res[i] ? 'ok' : 'no') : ''}`} key={i}
            style={res && res[i] ? { animationDelay: `${i * 0.06}s` } : undefined}>
            <span className="aq-src"><span>{n}</span><span className="sbar" /><span>{d}</span></span>
            <span className="aq-eq">=</span>
            <span className="aq-frac">
              <input value={vals[i].n} onChange={(e) => setCell(i, 'n', e.target.value)} inputMode="numeric" pattern="[0-9]*" placeholder="—" disabled={lock} aria-label="surat" />
              <span className="aq-bar" />
              <input value={vals[i].d} onChange={(e) => setCell(i, 'd', e.target.value)} inputMode="numeric" pattern="[0-9]*" placeholder="—" disabled={lock} aria-label="maxraj" />
            </span>
          </div>
        ))}
      </div>
      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.correct ? t.correct(feedback.n) : t.wrong(feedback.n)}</span>
        </div>
      )}
    </div>
  );
}
