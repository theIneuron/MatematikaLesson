// Dars13 · Amaliyot 04 — Tort · 🟢 · story_compare
// Syujetli taqqoslash: Nodira 2/5, Daler 2/9. Suratlar teng, kim ko'proq yedi?
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_04_DATA = { correct: 0, tag: 'story_compare', level: '🟢' };
const D13_04_T = {
  uz: {
    eyebrow: 'Masala', setup: "Ikki bir xil tort. Nodira o'z tortining 2/5 qismini yedi. Daler o'z tortining 2/9 qismini yedi.",
    ask: "Kim ko'proq tort yedi?",
    opts: ['Nodira', 'Daler', 'Teng', "Aniqlab bo'lmaydi"],
    correct: "To'g'ri. Ikkalasi ham ikkitadan bo'lak yedi. Lekin Nodiraning bo'laklari yirikroq.",
    wrongMsg: "Maslahat: bo'laklar soni bir xil — ikkitadan. Demak bo'lak kattaligini solishtiring: 1/5 mi, 1/9 mi yirik?",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Два одинаковых торта. Нодира съела 2/5 своего торта. Далер съел 2/9 своего торта.',
    ask: 'Кто съел больше торта?',
    opts: ['Нодира', 'Далер', 'Поровну', 'Определить нельзя'],
    correct: 'Верно. Оба съели по два куска. Но у Нодиры куски крупнее.',
    wrongMsg: 'Подсказка: кусков поровну — по два. Значит сравните размер куска: что крупнее, 1/5 или 1/9?',
  },
};

export default function D13_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_04_T[lang] || D13_04_T.uz;
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
    const correct = picked === D13_04_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: t.opts[0] },
      correct, meta: { tag: D13_04_DATA.tag, level: D13_04_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // Tort — ustidan ko'rinish: tarelka, po'stloq halqasi, krem yuzasi,
  // har bo'lak ustida krem gulchasi, markazda gilos. Yeyilgan bo'laklar
  // bo'yalmaydi — radius bo'ylab tortdan chetga chiqarib qo'yiladi.
  const Cake = ({ n, eaten }) => {
    const C = 64, R = 46, OUT = 13, S = 0.82;
    const pt = (ang, r) => [C + r * Math.cos(ang), C + r * Math.sin(ang)];
    const sliceD = (i, r) => {
      const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
      const large = (a1 - a0) > Math.PI ? 1 : 0;
      return `M${C} ${C} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
    };
    const mid = (i) => ((i + 0.5) / n) * 2 * Math.PI - Math.PI / 2;
    const shift = (i) => {
      const m = mid(i);
      return `translate(${(OUT * Math.cos(m)).toFixed(2)}, ${(OUT * Math.sin(m)).toFixed(2)})`;
    };
    return (
      <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
        {/* tarelka */}
        <ellipse cx={C} cy={C + 3} rx={R + 15} ry={R + 13} fill="#f7f5f1" stroke="#e3ded4" strokeWidth="1.5" />
        <ellipse cx={C} cy={C + 3} rx={R + 8} ry={R + 7} fill="none" stroke="#ece7dd" strokeWidth="1" />

        {Array.from({ length: n }).map((_, i) => {
          const out = i < eaten;
          const m = mid(i);
          const [dx, dy] = pt(m, R * 0.86);
          return (
            <g key={i} transform={out ? shift(i) : undefined}>
              {/* po'stloq (biskvit) */}
              <path d={sliceD(i, R)} fill={out ? '#fbf8f2' : '#e3c493'}
                stroke="#9a7440" strokeWidth="1.5" strokeLinejoin="round"
                strokeDasharray={out ? '3 3' : undefined} />
              {/* krem yuzasi */}
              <path d={sliceD(i, R * S)} fill={out ? '#fdfcf9' : '#fbf1dc'} stroke="#c9a86f" strokeWidth="1" strokeLinejoin="round" />
              {/* krem gulchasi + rezavor */}
              {!out && <>
                <circle cx={dx} cy={dy} r="4.6" fill="#fff8e7" stroke="#c9a86f" strokeWidth="1" />
                <circle cx={dx} cy={dy} r="2.1" fill="#a8474a" opacity=".85" />
                <circle cx={C + (R * 0.52) * Math.cos(m)} cy={C + (R * 0.52) * Math.sin(m)} r="1.5" fill="#c9a86f" opacity=".7" />
                <circle cx={C + (R * 0.68) * Math.cos(m + 0.16)} cy={C + (R * 0.68) * Math.sin(m + 0.16)} r="1.1" fill="#8a6a3b" opacity=".45" />
                <circle cx={C + (R * 0.68) * Math.cos(m - 0.16)} cy={C + (R * 0.68) * Math.sin(m - 0.16)} r="1.1" fill="#8a6a3b" opacity=".45" />
              </>}
            </g>
          );
        })}

        {/* markaz: krem gul va gilos */}
        <circle cx={C} cy={C} r="9" fill="#fff8e7" stroke="#c9a86f" strokeWidth="1.2" />
        <circle cx={C} cy={C} r="5.4" fill="#fdf3df" stroke="#c9a86f" strokeWidth=".8" />
        <circle cx={C} cy={C - 0.5} r="3.4" fill="#a8474a" />
        <path d={`M${C} ${C - 3.6} q 2 -4 5 -4.6`} fill="none" stroke="#4d7c3a" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  };

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === D13_04_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '14px 0 16px' }}>
        <div style={{ textAlign: 'center' }}><Cake n={5} eaten={2} /><div className="pq-tag" style={{ marginTop: 2 }}>{t.opts[0]}</div><Frac a={2} b={5} size={14} /></div>
        <div style={{ textAlign: 'center' }}><Cake n={9} eaten={2} /><div className="pq-tag" style={{ marginTop: 2 }}>{t.opts[1]}</div><Frac a={2} b={9} size={14} /></div>
      </div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
