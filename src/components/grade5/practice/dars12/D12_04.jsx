// Dars12 · Amaliyot 04 — Sharbat · 🟢 · Malika/Farrux · tag: story_compare
// Bir xil maxrajda (10) faqat suratga qaraladi: 7/10 > 4/10.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- SHARED ---------- */
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #fe5b1a; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;
/* ---------- /SHARED ---------- */

const D12_04_DATA = { correct: 0, tag: 'story_compare', level: '🟢' };
const D12_04_T = {
  uz: {
    eyebrow: 'Masala', title: 'Sharbat',
    setup: "Bir xil ikki stakan sharbat. Malika stakanning 7/10 qismini ichdi, Farrux — 4/10 qismini.",
    ask: "Kim ko'proq sharbat ichdi?",
    opts: ['Malika', 'Farrux', 'Teng', "Aniqlab bo'lmaydi"],
    correct: "To'g'ri. Yetti ulush to'rt ulushdan ko'p.",
    wrongMsg: "Maslahat: bu yerda maxraj bir xil, 10. Faqat suratga qarang — ulushlar soniga.",
  },
  ru: {
    eyebrow: 'Задача', title: 'Сок',
    setup: 'Два одинаковых стакана сока. Малика выпила 7/10 стакана, Фаррух — 4/10.',
    ask: 'Кто выпил больше сока?',
    opts: ['Малика', 'Фаррух', 'Поровну', 'Определить нельзя'],
    correct: 'Верно. Семь долей больше, чем четыре.',
    wrongMsg: 'Подсказка: знаменатель здесь одинаковый — 10. Смотрите только на числитель, на количество долей.',
  },
};

export default function D12_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_04_T[lang] || D12_04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer?.studentAnswer?.idx != null) {
      setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D12_04_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: D12_04_DATA.correct, label: t.opts[D12_04_DATA.correct] },
      correct, meta: { tag: D12_04_DATA.tag, level: D12_04_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === D12_04_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 48 };
  };

  // Stakan: SVG konus shakli, 10 ta teng bo'lakka ajratilgan, pastdan to'ladi.
  const Glass = ({ k, color, uid }) => {
    const TOP = 16, BOT = 122, N = 10;               // suyuqlik zonasi
    const H = (BOT - TOP) / N;
    const xAt = (y) => {                              // konus: yuqorida keng, pastda tor
      const p = (y - TOP) / (BOT - TOP);
      return { l: 8 + 12 * p, r: 72 - 12 * p };
    };
    const lines = [];
    for (let i = 1; i < N; i++) {
      const y = BOT - i * H;
      const { l, r } = xAt(y);
      lines.push(<line key={i} x1={l} y1={y} x2={r} y2={y} stroke="#1f2430" strokeOpacity=".32" strokeWidth="1.2" />);
    }
    const fillTop = BOT - k * H;
    const ft = xAt(fillTop);
    return (
      <svg width="80" height="136" viewBox="0 0 80 136" aria-hidden="true">
        <defs>
          <clipPath id={'glass' + uid}>
            <path d="M8 16 L72 16 L60 122 Q40 130 20 122 Z" />
          </clipPath>
        </defs>
        <g clipPath={'url(#glass' + uid + ')'}>
          <rect x="0" y="0" width="80" height="136" fill="#f8fafc" />
          {k > 0 && <path d={`M${ft.l} ${fillTop} L${ft.r} ${fillTop} L60 122 Q40 130 20 122 Z`} fill={color} />}
          {lines}
        </g>
        <path d="M8 16 L72 16 L60 122 Q40 130 20 122 Z" fill="none" stroke="#1f2430" strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="40" cy="16" rx="32" ry="4.5" fill="#fff" stroke="#1f2430" strokeWidth="2.5" />
      </svg>
    );
  };

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div style={{ display: 'flex', gap: 30, justifyContent: 'center', margin: '14px 0 16px' }}>
        <div style={{ textAlign: 'center' }}><Glass k={7} color="#f59e0b" uid="a" /><div className="pq-tag" style={{ marginTop: 2 }}>{t.opts[0]}</div><Frac a={7} b={10} size={15} /></div>
        <div style={{ textAlign: 'center' }}><Glass k={4} color="#10b981" uid="b" /><div className="pq-tag" style={{ marginTop: 2 }}>{t.opts[1]}</div><Frac a={4} b={10} size={15} /></div>
      </div>
      <p className="pq-ask">{t.ask}</p>
      {t.opts.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
      ))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
