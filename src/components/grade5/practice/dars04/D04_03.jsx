// Dars04 · Amaliyot 03 — O'rin almashtirish · 🟡 · Nilufar · tag: commutative
// Ko'paytirish o'rin almashtirish qonuni: a × b = b × a. Nuqtalar to'ri (6 qator × 8 ustun).
// Bola to'rni "gorizontal sanash" yoki "vertikal sanash" tugmasi bilan aylantiradi va
// ikki holatda ham 48 chiqishini ko'radi. Savol: 6 × 8 nechaga teng.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

/* =================== 03 · O'rin almashtirish · 🟡 · array_area (interaktiv) =================== */

const D03_ROWS = 6, D03_COLS = 8, D03_ANS = 48;
const D03_DATA = { correct: 2, tag: 'commutative', level: '🟡' };
const D03_T = {
  uz: {
    eyebrow: "O'rin almashtirish",
    setup: "Nilufar nuqtalarni to'r shaklida terdi: 6 qator, har qatorda 8 ta.",
    flipH: 'Qatorlab sanash', flipV: 'Ustunlab sanash',
    byRow: '6 qator × 8 = 48', byCol: '8 ustun × 6 = 48',
    ask: 'Jami nechta nuqta bor?',
    opts: ['14', '42', '48', '68'],
    correct: "To'g'ri. 6 × 8 = 48. Qatorlab ham, ustunlab ham sanasa — natija bir xil.",
    wrong: "Maslahat: qatorlar soni va bir qatordagi nuqtalar — qaysi amal ularni jami nuqtaga bog'laydi? Ikki tugma bir xil natija beradimi?",
  },
  ru: {
    eyebrow: 'Перестановка',
    setup: 'Нилуфар выложила точки сеткой: 6 рядов, в каждом по 8.',
    flipH: 'Считать по рядам', flipV: 'Считать по столбцам',
    byRow: '6 рядов × 8 = 48', byCol: '8 столбцов × 6 = 48',
    ask: 'Сколько всего точек?',
    opts: ['14', '42', '48', '68'],
    correct: 'Верно. 6 × 8 = 48. Хоть по рядам, хоть по столбцам — результат один.',
    wrong: 'Подсказка: число рядов и число точек в ряду — какое действие связывает их в общее число? Дают ли обе кнопки один результат?',
  },
};

export default function D04_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [mode2, setMode2] = useState('row'); // 'row' | 'col' — sanash yo'nalishi
  const [lit, setLit] = useState(-1);        // yoritilgan qator/ustun indeksi (animatsiya)
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (initialAnswer?.studentAnswer?.idx != null) {
      setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  // sanash animatsiyasi: mode o'zgarganda ketma-ket yoritadi
  const runCount = useCallback((m) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setLit(-1);
    const n = m === 'row' ? D03_ROWS : D03_COLS;
    for (let k = 0; k < n; k++) timers.current.push(setTimeout(() => setLit(k), 120 + k * 260));
    timers.current.push(setTimeout(() => setLit(-1), 120 + n * 260 + 400));
  }, []);

  const flip = (m) => { if (checked) return; setMode2(m); runCount(m); };

  const check = useCallback(() => {
    const correct = picked === D03_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 2, label: '48' }, correct, meta: { tag: D03_DATA.tag, level: D03_DATA.level } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);

  const dot = (r, c) => {
    const active = mode2 === 'row' ? (lit === r) : (lit === c);
    const anyLit = lit >= 0;
    return (
      <span key={r + '-' + c} style={{
        width: 15, height: 15, borderRadius: 999,
        background: active ? '#fe5b1a' : (anyLit ? '#c7d2e8' : '#fb7233'),
        transform: active ? 'scale(1.25)' : 'none',
        transition: 'all .45s ease',
      }} />
    );
  };

  const btnStyle = (on) => ({ flex: 1, padding: '10px 8px', borderRadius: 12, border: '2px solid ' + (on ? '#fe5b1a' : '#d6dae3'), background: on ? '#fff0e8' : '#fff', color: on ? '#b83d0e' : '#374151', fontSize: 13.5, fontWeight: 800, cursor: checked ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 44 });

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${D03_COLS}, 15px)`, gap: 9, padding: 14, borderRadius: 16, background: '#f8fafc', border: '1.5px solid #e5e7eb' }}>
          {Array.from({ length: D03_ROWS }).map((_, r) => Array.from({ length: D03_COLS }).map((_, c) => dot(r, c)))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '4px 0 8px' }}>
        <button type="button" style={btnStyle(mode2 === 'row')} disabled={checked} onClick={() => flip('row')}>{t.flipH}</button>
        <button type="button" style={btnStyle(mode2 === 'col')} disabled={checked} onClick={() => flip('col')}>{t.flipV}</button>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 2, checked, isReview, { half: true, center: true, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
