// Dars35 · Amaliyot 06 — Xatoni top · 🟡 · tag: area_error
// Kontekst: atirgul maydoni. Kamola 5×3 maydonni atirgul bilan to'ldiradi, lekin tomonlarni QO'SHIB (5+3+5+3=16) perimetrni hisoblaydi. Kataklar = 5×3 = 15.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: red
const C = { dark: '#dc2626', lt: '#fef2f2', mid: '#fecaca', tile: '#fca5a5', tileLn: '#ef4444', floor: '#fff7f7', floorLn: '#fca5a5' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.lt, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d35-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.lt, border: '1.5px solid ' + C.mid, color: C.dark }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Atirgul maydoni: yashil kataklar + har birida qizil atirgul nuqtasi
function GardenGrid({ cols, rows, cell = 26 }) {
  const w = cols * cell, h = rows * cell;
  const cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ r, c });
  return (
    <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w} height={h} rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
      {cells.map(({ r, c }) => {
        const cx = 1 + c * cell + cell / 2, cy = 1 + r * cell + cell / 2;
        return (
          <g key={r + '-' + c}>
            <rect x={1 + c * cell + 1.5} y={1 + r * cell + 1.5} width={cell - 3} height={cell - 3} rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
            <circle cx={cx} cy={cy} r="4.2" fill={C.tileLn} />
            <circle cx={cx} cy={cy} r="1.5" fill="#fff7ed" />
          </g>
        );
      })}
    </svg>
  );
}

const D06_CORRECT = 1; // 2-qadam xato: tomonlarni qo'shdi
const D06_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Kamola atirgul maydonini o'lchadi: 5 m × 3 m. Maydonni to'liq to'ldirish uchun nechta 1×1 m atirgul katagi kerakligini hisobladi. Bir qadamda xato bor.",
    ask: 'Qaysi qadam xato? Xato qadamni bosing:',
    steps: ['Tomonlari: 5 m va 3 m', '5 + 3 + 5 + 3 = 16', 'Kerak: 16 katak'],
    correct: "To'g'ri. Kataklar soni = 5 × 3 = 15. Tomonlarni qo'shish maydon chetini (perimetrni) beradi, ichini emas.",
    wrong: "Kataklar sonini topish uchun qaysi amal kerak — qo'shishmi yoki ko'paytirishmi? Har bir qadamni shu savol bilan tekshiring.",
    rule: "Ichini to'ldirish — ko'paytirish; chetini o'lchash — qo'shish.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Камола измерила клумбу роз: 5 м × 3 м. Она посчитала, сколько нужно грядок 1×1 м, чтобы заполнить всю клумбу. В одном шаге ошибка.',
    ask: 'Какой шаг ошибочный? Нажми на ошибочный шаг:',
    steps: ['Стороны: 5 м и 3 м', '5 + 3 + 5 + 3 = 16', 'Нужно: 16 грядок'],
    correct: 'Верно. Число грядок = 5 × 3 = 15. Сложение сторон даёт край (периметр), а не внутренность.',
    wrong: 'Каким действием находят число грядок — сложением или умножением? Проверь каждый шаг этим вопросом.',
    rule: 'Заполнить внутри — умножение; измерить край — сложение.',
  },
};

export default function D35_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.steps[picked] }, correctAnswer: { idx: D06_CORRECT }, correct, meta: { tag: 'area_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d35-pop { animation: d35pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d35pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d35-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
        <GardenGrid cols={5} rows={3} />
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = C.dark; bg = C.lt; col = '#1f2430'; }
          if (checked && on) { const ok = i === D06_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>
              <span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#94a3b8', minWidth: 20 }}>{i + 1}.</span>
              <span style={{ ...S.mono }}>{o}</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
