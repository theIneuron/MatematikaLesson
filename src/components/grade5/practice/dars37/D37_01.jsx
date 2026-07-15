// Dars37 · Amaliyot 01 — Hajm nima · 🟢 · tag: vol_concept
// Hajm = jism ichiga sig'adigan birlik kublar soni. Yuza (bir yog') va chegara bilan chalkashtirmaslik.
// Vizual: bo'sh quti + yonida bir necha birlik kubcha (rasm-masala, javobni oshkor qilmaydi).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#b45309', background: '#fff7ed', border: '1px solid #fed7aa', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d37-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Bo'sh quti (wireframe) + yonida birlik kubchalar — nima to'ldirishini ko'rsatadi, javobni bermaydi.
// To'g'ri javobdan keyin (filled) quti birlik kublar bilan to'lgan to'la kubga aylanadi.
function BoxScene({ animate = true, filled = false }) {
  const dp = 0.46;
  const pts = (arr) => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  // wireframe cube (bo'sh quti): faqat chiziq, ichi ochiq
  const wire = (ox, oy, s, lo) => {
    const dx = s * dp, dy = -s * dp;
    const bl = [ox, oy], br = [ox + s, oy], tr = [ox + s, oy - s], tl = [ox, oy - s];
    const tlb = [ox + dx, oy - s + dy], trb = [ox + s + dx, oy - s + dy], brb = [ox + s + dx, oy + dy];
    return (
      <g stroke={lo} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <polygon points={pts([bl, br, tr, tl])} fill="#fffdf7" />
        <polyline points={pts([tl, tlb, trb, tr])} />
        <polyline points={pts([tr, trb, brb, br])} />
      </g>
    );
  };
  // to'liq kubcha (loose)
  const cube = (ox, oy, s, i) => {
    const dx = s * dp, dy = -s * dp;
    const bl = [ox, oy], br = [ox + s, oy], tr = [ox + s, oy - s], tl = [ox, oy - s];
    const tlb = [ox + dx, oy - s + dy], trb = [ox + s + dx, oy - s + dy], brb = [ox + s + dx, oy + dy];
    return (
      <g key={i} className={animate ? 'd37-rise' : undefined} style={animate ? { animationDelay: (0.15 + i * 0.18) + 's' } : undefined}>
        <polygon points={pts([tl, tlb, trb, tr])} fill="#fed7aa" stroke="#b45309" strokeWidth="1.1" strokeLinejoin="round" />
        <polygon points={pts([tr, trb, brb, br])} fill="#f59e0b" stroke="#b45309" strokeWidth="1.1" strokeLinejoin="round" />
        <polygon points={pts([bl, br, tr, tl])} fill="#fdba74" stroke="#b45309" strokeWidth="1.1" strokeLinejoin="round" />
      </g>
    );
  };
  // Bitta birlik kubcha (uch yog') — berilgan pastki-old-chap burchakdan chiziladi
  const unitCube = (x, y, u) => {
    const dx = u * dp, dy = -u * dp;
    const bl = [x, y], br = [x + u, y], tr = [x + u, y - u], tl = [x, y - u];
    const tlb = [x + dx, y - u + dy], trb = [x + u + dx, y - u + dy], brb = [x + u + dx, y + dy];
    return (
      <>
        <polygon points={pts([tl, tlb, trb, tr])} fill="#fed7aa" stroke="#b45309" strokeWidth="1" strokeLinejoin="round" />
        <polygon points={pts([br, brb, trb, tr])} fill="#f59e0b" stroke="#b45309" strokeWidth="1" strokeLinejoin="round" />
        <polygon points={pts([bl, br, tr, tl])} fill="#fdba74" stroke="#b45309" strokeWidth="1" strokeLinejoin="round" />
      </>
    );
  };
  // To'la kub: n×n×n birlik kubchalar bittalab yuqoridan tushib to'ladi.
  // Tushish tartibi: pastdan-yuqoriga, orqadan-oldinga, chapdan-o'ngga.
  // Chizish (ustma-ust) tartibi: orqadan-oldinga (j↓), pastdan-yuqoriga (k↑), chapdan (i↑).
  const solid = (ox, oy, s, n) => {
    const u = s / n;
    const delay = {};
    let seq = 0;
    for (let k = 0; k < n; k++) for (let j = n - 1; j >= 0; j--) for (let i = 0; i < n; i++) delay[`${i},${k},${j}`] = seq++;
    const cubes = [];
    for (let j = n - 1; j >= 0; j--) for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) cubes.push({ i, k, j });
    return (
      <g>
        {cubes.map(({ i, k, j }) => {
          const x = ox + i * u + j * u * dp;
          const y = oy - k * u - j * u * dp;
          return (
            <g key={`${i}-${k}-${j}`} className={animate ? 'd37-drop' : undefined} style={animate ? { animationDelay: (delay[`${i},${k},${j}`] * 0.1).toFixed(2) + 's' } : undefined}>
              {unitCube(x, y, u)}
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <svg width="240" height="130" viewBox="0 0 240 130" style={{ display: 'block', maxWidth: '100%' }}>
      {filled ? solid(16, 108, 78, 3) : wire(16, 108, 78, '#c2762a')}
      {!filled && cube(150, 104, 22, 0)}
      {!filled && cube(182, 96, 22, 1)}
      {!filled && cube(166, 74, 22, 2)}
    </svg>
  );
}

const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Hajm nima', setup: "Madina bo'sh qutini birlik kubchalar bilan to'ldirmoqchi.",
    ask: 'Jismning HAJMI — bu nima?',
    opts: ["Ichiga sig'adigan birlik kublar soni", "Bir yog'ining yuzasi", "Chetlarining uzunligi"],
    correct: "To'g'ri. Hajm — jism ichiga nechta birlik kub sig'ishi.",
    wrong: "Hajm — jismning ichi haqidami, bir yog'i haqidami yoki chetlari haqidami? Qutini nima to'ldirishini o'ylang.",
    rule: "Hajm — ichidagi birlik kublar soni.",
  },
  ru: {
    eyebrow: 'Что такое объём', setup: 'Мадина хочет заполнить пустую коробку единичными кубиками.',
    ask: 'ОБЪЁМ тела — это что?',
    opts: ['Сколько единичных кубиков помещается внутри', 'Площадь одной грани', 'Длина краёв'],
    correct: 'Верно. Объём — сколько единичных кубиков помещается внутри тела.',
    wrong: 'Объём — это про внутренность тела, про одну грань или про края? Подумай, чем заполняют коробку.',
    rule: 'Объём — число единичных кубиков внутри.',
  },
};

export default function D37_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'vol_concept', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d37-rise { animation: d37rise .5s ease both; transform-box: fill-box; }
        @keyframes d37rise { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
        .d37-drop { animation: d37drop .42s cubic-bezier(.34,1.25,.64,1) both; transform-box: fill-box; }
        @keyframes d37drop { 0% { opacity: 0; transform: translateY(-18px); } 60% { opacity: 1; } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop, .d37-rise, .d37-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 6px' }}>
        <BoxScene animate={!isReview} filled={checked && fb?.correct} />
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
