// Dars13 · Amaliyot 08 — Xatoni top · 🟡 · find_error (2 ta xato)
// Malika 3/7 va 3/4 ni taqqoslab xato yuritdi. Ikki qadam noto'g'ri (2 va 4).
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

const Bar = ({ n, k, color = '#fe5b1a', height = 40, onCell = null, disabled = false }) => (
  <div style={{ display: 'flex', width: '100%', border: '2px solid #1f2430', borderRadius: 8, overflow: 'hidden', height, background: '#fff' }}>
    {Array.from({ length: n }).map((_, i) => {
      const on = i < k;
      const base = { flex: 1, minWidth: 0, padding: 0, border: 'none', background: on ? color : '#fff', boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none', transition: 'background .18s' };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer' }} />
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
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #fe5b1a; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_08_DATA = { wrong: [1, 3], tag: 'find_error', level: '🟡' };
const D13_08_T = {
  uz: {
    eyebrow: 'Tahlil', setup: "Malika 3/7 va 3/4 ni taqqosladi va shunday fikr yuritdi.",
    steps: [
      "Suratlar bir xil: 3 va 3. Demak bo'laklar sonini emas, bo'lak kattaligini solishtirish kerak.",
      "7 soni 4 dan katta. Demak 3/7 kattaroq.",
      "Butun 7 ta bo'lakka bo'linsa, har bir bo'lak 4 ta bo'lakka bo'lingandagidan kichikroq.",
      "Uchta kichik bo'lak uchta katta bo'lakdan ko'proq joy egallaydi.",
    ],
    ask: "Qaysi qadam noto'g'ri? Ikkita qadam noto'g'ri — ikkalasini ham tanlang.",
    correct: "To'g'ri. 2-qadamda maxraj kasr bilan chalkashtirilgan. 4-qadam esa 3-qadamning teskarisi: mayda bo'laklar kamroq joy egallaydi.",
    wrongPartial: "Maslahat: bittasini topdingiz, yana bittasi qoldi. 3-qadam to'g'ri — undan qanday xulosa kelib chiqishi kerak edi?",
    wrongMsg: "Maslahat: bitta qadamda maxrajning kattaligi kasrning kattaligi deb olingan. Boshqasida to'g'ri gapdan teskari xulosa chiqarilgan.",
  },
  ru: {
    eyebrow: 'Разбор', setup: 'Малика сравнила 3/7 и 3/4 и рассуждала так.',
    steps: [
      'Числители одинаковые: 3 и 3. Значит сравнивать надо не количество долей, а размер доли.',
      'Число 7 больше 4. Значит 3/7 больше.',
      'Если целое делят на 7 частей, каждая часть меньше, чем при делении на 4 части.',
      'Три мелкие доли занимают больше места, чем три крупные.',
    ],
    ask: 'Какой шаг неверный? Неверных шага два — отметьте оба.',
    correct: 'Верно. На шаге 2 знаменатель спутан с величиной дроби. Шаг 4 противоречит шагу 3: мелкие доли занимают меньше места.',
    wrongPartial: 'Подсказка: один нашли, остался ещё один. Шаг 3 верный — какой вывод должен был из него следовать?',
    wrongMsg: 'Подсказка: в одном шаге величину знаменателя приняли за величину дроби. В другом из верного утверждения сделан обратный вывод.',
  },
};

export default function D13_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_08_T[lang] || D13_08_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx) {
      setSel(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);

  const toggle = (i) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const check = useCallback(() => {
    const want = D13_08_DATA.wrong;
    const got = sel.slice().sort();
    const correct = got.length === want.length && got.every((v, i) => v === want[i]);
    const partial = !correct && got.length > 0 && got.every((v) => want.includes(v));
    setFb({ correct, partial }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: got, label: got.map((i) => i + 1).join(', ') },
      correctAnswer: { idx: want, label: '2, 4' },
      correct, meta: { tag: D13_08_DATA.tag, level: D13_08_DATA.level, partial: partial ? 'one_of_two' : null },
    });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // Tekshirilgandan keyin: javob to'g'ri bo'lsa — tanlanganlar yashil.
  // Javob xato bo'lsa — faqat tanlanganlar qizil. To'g'ri javob OCHIB BERILMAYDI.
  const stepStyle = (i) => {
    const on = sel.includes(i);
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (checked) {
      const ok = fb?.correct;
      if (on) {
        if (ok) { bg = '#e8f7ee'; bd = '#1a7f43'; col = '#1a7f43'; }
        else { bg = '#fdecec'; bd = '#c0392b'; col = '#c0392b'; }
      } else { bg = '#fff'; bd = '#e5e7eb'; col = '#9aa1ad'; }
    }
    return { display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left', padding: '14px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, lineHeight: 1.42, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 52 };
  };

  const fbText = !fb ? '' : fb.correct ? t.correct : fb.partial ? t.wrongPartial : t.wrongMsg;

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div className="pq-row"><Frac a={3} b={7} size={14} /><Bar n={7} k={3} height={26} /></div>
      <div className="pq-row"><Frac a={3} b={4} size={14} /><Bar n={4} k={3} height={26} color="#7c3aed" /></div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ margin: '4px 0 10px' }}>
        {t.steps.map((st, i) => (
          <button key={i} type="button" style={stepStyle(i)} disabled={isReview || checked} onClick={() => toggle(i)}>
            <span style={{ minWidth: 26, height: 26, borderRadius: 8, background: sel.includes(i) && !checked ? '#fe5b1a' : '#eef1f6', color: sel.includes(i) && !checked ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{i + 1}</span>
            <span>{st}</span>
          </button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fbText} />}
    </div>
  );
}
