// Amaliyot08 — Vizual: kasrni rasmdan o'qish + 1/2 bilan solishtirish · Blok 2 · daraja Б · teg: fraction_visual
// Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const PARTS = 8, SHADED = 5; // 5/8
const DATA = { num: 5, den: 8, cmp: '>', tag: 'fraction_visual', level: 'Б', format: '2.6' };

const T = {
  uz: {
    title: 'Vizual topshiriq',
    body: "Nigora tortni 8 ta teng bo'lakka kesdi va 5 bo'lagini oldi. Rasmda bo'yalgan qism kasrini yozing va uni 1/2 bilan solishtiring.",
    fracLabel: 'Bo\'yalgan qism kasri',
    cmpLabel: 'Bu kasrni 1/2 bilan solishtiring:',
    correct: "To'g'ri. Bo'yalgan qism 5/8. 5/8 va 4/8 → 5/8 > 1/2.",
    wrong: "Maslahat: bo'yalgan qismlar — surat, jami qismlar — maxraj. 1/2 — jamining yarmiga teng nechta qism?",
  },
  ru: {
    title: 'Визуальное задание',
    body: 'Нигора разрезала торт на 8 равных частей и взяла 5. Запишите дробь закрашенной части и сравните её с 1/2.',
    fracLabel: 'Дробь закрашенной части',
    cmpLabel: 'Сравни эту дробь с 1/2:',
    correct: 'Верно. Закрашено 5/8. 5/8 и 4/8 → 5/8 > 1/2.',
    wrong: 'Подсказка: закрашенные части — числитель, все части — знаменатель. Половина — это сколько таких частей?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [cmp, setCmp] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(false); // to'g'ri javobdan keyin ½ chizig'i

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const a = initialAnswer.studentAnswer;
      if (a.num != null) setNum(String(a.num));
      if (a.den != null) setDen(String(a.den));
      if (a.cmp != null) setCmp(a.cmp);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  const ready = num.trim() !== '' && den.trim() !== '' && cmp !== null;
  useEffect(() => { onReady?.(ready && !checked); }, [ready, checked, onReady]);

  const check = useCallback(() => {
    const n = parseInt(cleanInt(num) || '0', 10);
    const d = parseInt(cleanInt(den) || '0', 10);
    const fracOk = n === DATA.num && d === DATA.den;
    const cmpOk = cmp === DATA.cmp;
    const correct = fracOk && cmpOk;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: ['<', '=', '>'],
      studentAnswer: { num: n, den: d, cmp },
      correctAnswer: { num: DATA.num, den: DATA.den, cmp: DATA.cmp },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, partial: { fracOk, cmpOk } },
    });
  }, [num, den, cmp, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  // to'g'ri javobdan keyin ½ (4/8) chizig'i chiqadi — 5 ulush chiziqdan o'tadi
  useEffect(() => {
    if (feedback && feedback.correct) {
      const tm = setTimeout(() => setShown(true), 250);
      return () => clearTimeout(tm);
    }
    setShown(false);
  }, [feedback]);

  const lock = isReview || checked;
  const W = 320, H = 84, sw = W / PARTS, half = (PARTS / 2) * sw;

  return (
    <div className="aq aq08">
      <style>{`
        .aq08 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq08 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq08 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 14px; }
        .aq08 .aq-svg { width:100%; max-width:340px; height:auto; display:block; margin:0 auto 16px; }
        .aq08 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin:14px 0 6px; }
        .aq08 .aq-frac { display:flex; flex-direction:column; align-items:center; width:84px; }
        .aq08 .aq-frac input { width:72px; font-size:22px; font-weight:700; text-align:center; padding:9px 6px; border-radius:11px; border:2px solid #d6dae3; background:#f8fafc; outline:none; }
        .aq08 .aq-frac input:focus { border-color:#5b8def; background:#fff; }
        .aq08 .aq-bar { width:60px; height:2px; background:#1f2430; margin:4px 0; }
        .aq08 .aq-cmp { display:flex; gap:10px; }
        .aq08 .aq-cbtn { width:56px; height:52px; font-size:22px; font-weight:800; border-radius:13px; border:2px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; }
        .aq08 .aq-cbtn.sel { border-color:#2563eb; background:#2563eb; color:#fff; }
        .aq08 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq08 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq08 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <svg className="aq-svg" viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label="5/8">
        {Array.from({ length: PARTS }, (_, i) => (
          <rect key={i} x={i * sw} y="2" width={sw} height={H - 4}
            fill={i < SHADED ? '#5b8def' : '#fff'} stroke="#1f2430" strokeWidth="1.5" />
        ))}
        {/* ½ belgisi: 4/8 chegarasi — to'g'ri javobdan keyin chiqadi */}
        <g style={{ opacity: shown ? 1 : 0, transition: 'opacity .45s ease' }}>
          <line x1={half} y1="-1" x2={half} y2={H + 1} stroke="#1a7f43" strokeWidth="3" strokeDasharray="6 4" />
          <text x={half} y={H + 18} textAnchor="middle"
            style={{ fontFamily: "'Manrope',system-ui,sans-serif", fontSize: 15, fontWeight: 800, fill: '#1a7f43' }}>
            ½
          </text>
        </g>
      </svg>

      <label className="aq-label">{t.fracLabel}</label>
      <div className="aq-frac">
        <input value={num} onChange={(e) => setNum(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" placeholder="—" disabled={lock} aria-label="surat" />
        <span className="aq-bar" />
        <input value={den} onChange={(e) => setDen(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" placeholder="—" disabled={lock} aria-label="maxraj" />
      </div>

      <div className="aq-label">{t.cmpLabel}</div>
      <div className="aq-cmp">
        {['<', '=', '>'].map((c) => (
          <button key={c} type="button" disabled={lock}
            className={`aq-cbtn ${cmp === c ? 'sel' : ''}`} onClick={() => setCmp(c)}>{c}</button>
        ))}
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
