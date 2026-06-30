// Amaliyot05 — Jadval bilan ishlash (chek + foiz) · Blok 4 · daraja С · teg: table_calc
// Summa ustuni + jami + 10% chegirma bilan to'lov. Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { uz: 'Daftar', ru: 'Тетрадь', price: 1500, qty: 4, sum: 6000 },
  { uz: 'Ruchka', ru: 'Ручка', price: 2000, qty: 3, sum: 6000 },
  { uz: "O'chirg'ich", ru: 'Ластик', price: 800, qty: 5, sum: 4000 },
];
const TOTAL = 16000; // 6000+6000+4000
const PAID = 14400;  // 16000*0.9
const DATA = { tag: 'table_calc', level: 'С', format: '2.4' };

const T = {
  uz: {
    title: 'Jadval bilan ishlash',
    body: "Feruza do'kondan xarid qildi. \"Summa\" ustunini to'ldiring, chek jamini toping, so'ng 10% chegirma bilan to'lovni hisoblang.",
    hTovar: 'Tovar', hPrice: 'Narx', hQty: 'Soni', hSum: 'Summa',
    total: 'Chek jami', paid: "10% chegirma bilan to'lov",
    correct: "To'g'ri. Chek jami 16 000, 10% chegirma bilan to'lov 14 400 so'm.",
    wrong: "Maslahat: har qatorda narx × soni; jamini qo'shing; keyin jamining 90% ini oling.",
  },
  ru: {
    title: 'Работа с таблицей',
    body: 'Феруза сделала покупки. Заполните столбец «Сумма», найдите итог по чеку, затем посчитайте оплату со скидкой 10%.',
    hTovar: 'Товар', hPrice: 'Цена', hQty: 'Кол-во', hSum: 'Сумма',
    total: 'Итог по чеку', paid: 'Оплата со скидкой 10%',
    correct: 'Верно. Итог 16 000, оплата со скидкой 10% — 14 400 сум.',
    wrong: 'Подсказка: в каждой строке цена × количество; сложите; потом возьмите 90% от итога.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');
const fmt = (n) => n.toLocaleString('ru-RU');

export default function Amaliyot05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [sums, setSums] = useState(['', '', '']);
  const [total, setTotal] = useState('');
  const [paid, setPaid] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [cellRes, setCellRes] = useState(null); // [sum0,sum1,sum2,total,paid] to'g'ri/noto'g'ri

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const a = initialAnswer.studentAnswer;
      if (Array.isArray(a.sums)) setSums(a.sums.map(String));
      if (a.total != null) setTotal(String(a.total));
      if (a.paid != null) setPaid(String(a.paid));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  const allFilled = sums.every((s) => s.trim() !== '') && total.trim() !== '' && paid.trim() !== '';
  useEffect(() => { onReady?.(allFilled && !checked); }, [allFilled, checked, onReady]);

  const setSum = (i, raw) => setSums((p) => p.map((s, j) => (j === i ? cleanInt(raw) : s)));

  const check = useCallback(() => {
    const sv = sums.map((s) => parseInt(cleanInt(s) || '0', 10));
    const tv = parseInt(cleanInt(total) || '0', 10);
    const pv = parseInt(cleanInt(paid) || '0', 10);
    const sumOk = ROWS.map((r, i) => sv[i] === r.sum);
    const sumsOk = sumOk.every(Boolean);
    const totalOk = tv === TOTAL;
    const paidOk = pv === PAID;
    const correct = sumsOk && totalOk && paidOk;
    setCellRes([...sumOk, totalOk, paidOk]); // animatsiya: [sum0,sum1,sum2,total,paid]
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: [],
      studentAnswer: { sums: sv, total: tv, paid: pv },
      correctAnswer: { sums: ROWS.map((r) => r.sum), total: TOTAL, paid: PAID },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, partial: { sumsOk, totalOk, paidOk } },
    });
  }, [sums, total, paid, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq05">
      <style>{`
        .aq05 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq05 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq05 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq05 table { width:100%; border-collapse:collapse; font-variant-numeric:tabular-nums; }
        .aq05 th, .aq05 td { padding:9px 8px; text-align:right; border-bottom:1px solid #eef0f4; font-size:15px; }
        .aq05 th { color:#6b7280; font-weight:700; font-size:13px; }
        .aq05 th:first-child, .aq05 td:first-child { text-align:left; font-weight:600; }
        .aq05 td input { width:90px; font-size:16px; font-weight:700; text-align:right; padding:8px 10px; border-radius:10px; border:2px solid #d6dae3; background:#fff; outline:none; }
        .aq05 td input:focus { border-color:#5b8def; }
        .aq05 input.ok { border-color:#36b37e; animation: okPulse .55s ease both; }
        .aq05 input.no { border-color:#ef9a9a; }
        @keyframes okPulse { 0%{ background:#fff; } 45%{ background:#d6f5e3; } 100%{ background:#eafaf1; } }
        .aq05 .aq-final { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:12px; }
        .aq05 .aq-final label { font-size:14px; font-weight:600; color:#374151; }
        .aq05 .aq-final input { width:120px; font-size:18px; font-weight:700; text-align:right; padding:11px 12px; border-radius:12px; border:2px solid #d6dae3; background:#f8fafc; outline:none; }
        .aq05 .aq-final input:focus { border-color:#5b8def; background:#fff; }
        .aq05 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq05 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq05 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>
      <table>
        <thead>
          <tr><th>{t.hTovar}</th><th>{t.hPrice}</th><th>{t.hQty}</th><th>{t.hSum}</th></tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i}>
              <td>{r[lang] || r.uz}</td>
              <td>{fmt(r.price)}</td>
              <td>{r.qty}</td>
              <td><input value={sums[i]} onChange={(e) => setSum(i, e.target.value)} inputMode="numeric" pattern="[0-9]*" placeholder="?" disabled={lock}
                className={cellRes ? (cellRes[i] ? 'ok' : 'no') : ''} style={cellRes && cellRes[i] ? { animationDelay: `${i * 0.08}s` } : undefined} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="aq-final">
        <label htmlFor="aq05-total">{t.total}</label>
        <input id="aq05-total" value={total} onChange={(e) => setTotal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" placeholder="?" disabled={lock}
          className={cellRes ? (cellRes[3] ? 'ok' : 'no') : ''} style={cellRes && cellRes[3] ? { animationDelay: '0.24s' } : undefined} />
      </div>
      <div className="aq-final">
        <label htmlFor="aq05-paid">{t.paid}</label>
        <input id="aq05-paid" value={paid} onChange={(e) => setPaid(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" placeholder="?" disabled={lock}
          className={cellRes ? (cellRes[4] ? 'ok' : 'no') : ''} style={cellRes && cellRes[4] ? { animationDelay: '0.32s' } : undefined} />
      </div>
      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
