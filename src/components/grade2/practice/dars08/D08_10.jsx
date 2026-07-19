// Dars 8 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // MARS sahna (to'q qizg'ish)
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 23.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d08-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d08-pop { animation: d08pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d08pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d08-star { opacity: .4; animation: d08tw 3.4s ease-in-out infinite; }
        @keyframes d08tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_OPTS = ['58 − 23', '43 − 27', '62 − 35', '71 − 48'], D10_CORRECT = 0;
const D10_T = {
  uz: {
    eyebrow: 'Qarzsizni tanlang', setup: 'O‘tishsiz (qarzsiz) ayirishda har yuqori raqam pastdan katta yoki teng.',
    ask: 'Qaysi ayirishni QARZSIZ (o‘tishsiz) yechish mumkin?',
    correct: "To'g'ri. 58 − 23: 8 ≥ 3 va 5 ≥ 2 — qarz kerak emas.",
    wrong: "Maslahat: har ustunda yuqori raqam pastdan kichik bo‘lmasin. Birlik raqamlarini solishtiring.",
    rule: "Qarzsiz ayirish: har ustunda yuqori ≥ past. 58 − 23.",
  },
  ru: {
    eyebrow: 'Выбери без займа', setup: 'В вычитании без перехода каждая верхняя цифра больше нижней или равна.',
    ask: 'Какое вычитание можно решить БЕЗ ЗАЙМА (без перехода)?',
    correct: 'Верно. 58 − 23: 8 ≥ 3 и 5 ≥ 2 — заём не нужен.',
    wrong: 'Подсказка: в каждом столбце верхняя цифра не меньше нижней. Сравни цифры единиц.',
    rule: 'Без займа: в каждом столбце верхняя ≥ нижней. 58 − 23.',
  },
};
function D08_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: D10_OPTS[picked] }, correctAnswer: { idx: 0, label: '58 − 23' }, correct, meta: { tag: 'noborrow', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {D10_OPTS.map((o, i) => {
          const on = picked === i, show = checked && on;
          let bd = C.line, bg = C.paper, col = C.ink;
          if (on && !checked) { bd = C.acc; bg = C.accSoft; }
          if (show) { const okv = i === D10_CORRECT; bd = okv ? C.ok : C.no; bg = okv ? C.okSoft : C.noSoft; col = okv ? C.ok : C.no; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 45%', minHeight: 62, borderRadius: 13, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D08_10(props) {
  return (<><style>{FX_CSS}</style><D08_10Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D08_10.audio = {
  uz: { intro: "O'tishsiz qarzsiz ayirishda har yuqori raqam pastdan katta yoki teng. Qaysi ayirishni QARZSIZ o'tishsiz yechish mumkin?", on_correct: "To'g'ri. 58 ayirish 23. 8 katta yoki teng 3 va 5 katta yoki teng 2, qarz kerak emas.", on_wrong: "Maslahat. Har ustunda yuqori raqam pastdan kichik bo'lmasin. Birlik raqamlarini solishtiring." },
  ru: { intro: "В вычитании без перехода каждая верхняя цифра больше нижней или равна. Какое вычитание можно решить БЕЗ ЗАЙМА без перехода?", on_correct: "Верно. 58 минус 23. 8 больше или равно 3 и 5 больше или равно 2, заём не нужен.", on_wrong: "Подсказка. В каждом столбце верхняя цифра не меньше нижней. Сравни цифры единиц." },
};
