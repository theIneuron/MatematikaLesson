// Dars12 · Amaliyot 05 — Bo'yab taqqosla · 🟡 · tag: shade_compare (interaktiv)
// O'quvchi pastdagi chiziqda 5/8 ni bo'yaydi, keyin belgini tanlaydi: 2/8 < 5/8.
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

const Bar = ({ n, k, color = '#2563eb', height = 40, onCell = null, disabled = false }) => (
  <div style={{ display: 'flex', width: '100%', border: '2px solid #1f2430', borderRadius: 8, overflow: 'hidden', height, background: '#fff' }}>
    {Array.from({ length: n }).map((_, i) => {
      const on = i < k;
      const base = {
        flex: 1, minWidth: 0, padding: 0, border: 'none',
        background: on ? color : '#fff',
        boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none',
        transition: 'background .18s',
      };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!on && !disabled && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#cbd2dc' }} />}
        </button>
      );
    })}
  </div>
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
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #2563eb; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;
/* ---------- /SHARED ---------- */

const D12_05_DATA = { shade: 5, sign: 0, tag: 'shade_compare', level: '🟡' }; // sign: 0='<'
const D12_05_T = {
  uz: {
    eyebrow: 'Amal', title: "Bo'yab taqqosla",
    setup: "Yuqoridagi chiziqda 2/8 allaqachon bo'yalgan. Pastdagi chiziqda 5/8 ni bo'yang.",
    ask: "Keyin belgini tanlang:",
    signs: ['<', '=', '>'],
    correct: "To'g'ri. Bo'yab ko'rgach shubha qolmaydi: 2/8 kichikroq.",
    wrongShade: "Maslahat: pastki chiziqda 5/8 ni bo'yash kerak. Bo'yalgan bo'laklaringizni qayta sanab ko'ring.",
    wrongSign: "Maslahat: ikki chiziqning bo'yalgan qismini solishtiring. Qaysi biri kalta?",
    hint: "Kataklarni bosib bo'yang",
  },
  ru: {
    eyebrow: 'Действие', title: 'Закрасьте и сравните',
    setup: 'На верхней полоске уже закрашено 2/8. Закрасьте 5/8 на нижней полоске.',
    ask: 'Затем выберите знак:',
    signs: ['<', '=', '>'],
    correct: 'Верно. После закрашивания сомнений нет: 2/8 меньше.',
    wrongShade: 'Подсказка: на нижней полоске нужно закрасить 5/8. Пересчитайте закрашенные клетки.',
    wrongSign: 'Подсказка: сравните закрашенные участки двух полосок. Какой короче?',
    hint: 'Нажимайте на клетки, чтобы закрасить',
  },
};

export default function D12_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_05_T[lang] || D12_05_T.uz;
  const isReview = mode === 'review';
  const [shade, setShade] = useState(0);
  const [sign, setSign] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa && sa.shade != null) {
      setShade(sa.shade); setSign(sa.sign ?? null);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(shade > 0 && sign != null && !checked); }, [shade, sign, checked, onReady]);

  const check = useCallback(() => {
    const okShade = shade === D12_05_DATA.shade;
    const okSign = sign === D12_05_DATA.sign;
    const correct = okShade && okSign;
    setFb({ correct, okShade }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.setup + ' ' + t.ask,
      options: t.signs.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { shade, sign, label: shade + '/8 ' + (sign != null ? t.signs[sign] : '?') },
      correctAnswer: { shade: 5, sign: 0, label: '5/8, <' },
      correct, meta: { tag: D12_05_DATA.tag, level: D12_05_DATA.level, partial: okShade && !okSign ? 'shade_ok' : null },
    });
  }, [shade, sign, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const signStyle = (i) => {
    const active = sign === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#1f2430';
    if (active) { bg = '#eaf0fe'; bd = '#2563eb'; }
    if (show) { const ok = i === D12_05_DATA.sign; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, minHeight: 56, fontSize: 24, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' };
  };

  const wrongText = fb && !fb.correct ? (fb.okShade ? t.wrongSign : t.wrongShade) : '';

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div className="pq-row"><Frac a={2} b={8} size={15} /><Bar n={8} k={2} /></div>
      <div className="pq-row"><Frac a={shade} b={8} size={15} tone="#7c3aed" /><Bar n={8} k={shade} color="#7c3aed" disabled={isReview || checked} onCell={(i) => setShade(shade === i + 1 ? i : i + 1)} /></div>
      <div style={{ fontSize: 12.5, color: '#9aa1ad', fontWeight: 600, margin: '2px 0 16px' }}>{t.hint}</div>
      <p className="pq-ask">{t.ask} <Frac a={2} b={8} size={15} /> ? <Frac a={5} b={8} size={15} /></p>
      <div style={{ display: 'flex', gap: 10 }}>
        {t.signs.map((o, i) => (
          <button key={i} type="button" style={signStyle(i)} disabled={isReview || checked} onClick={() => setSign(i)}>{o}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : wrongText} />}
    </div>
  );
}
