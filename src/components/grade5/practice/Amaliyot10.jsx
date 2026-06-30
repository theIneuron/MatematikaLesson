// Amaliyot10 — Kombinatsiyalangan (mini-keys) "Oshxona" · Blok 3 · daraja П · teg: proportion
// Avto-qism: koeffitsient + 3 ta ingredient. Ochiq/ijodiy qism baholanmaydi (gate emas). Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// 4 porsiya → 6 porsiya, koeffitsient 1,5
const ROWS = [
  { uz: 'Un', ru: 'Мука', base: 200, unit: { uz: 'g', ru: 'г' }, ans: 300 },
  { uz: 'Shakar', ru: 'Сахар', base: 80, unit: { uz: 'g', ru: 'г' }, ans: 120 },
  { uz: 'Sut', ru: 'Молоко', base: 150, unit: { uz: 'ml', ru: 'мл' }, ans: 225 },
];
const K = 1.5;
const DATA = { tag: 'proportion', level: 'П', format: '2.7' };

const T = {
  uz: {
    title: 'Loyiha "Oshxona"',
    body: 'Sanjar 4 porsiyalik retseptni 6 porsiyaga qayta hisoblaydi. Unga yordam bering.',
    kLabel: 'Koeffitsient (6 ÷ 4)',
    kHint: "Yangi porsiyani eski porsiyaga bo'ling.",
    note: 'Ijodiy qism: taom kartochkasini bezang va nom bering. Bu qism baholanmaydi — u ota-onaga hisobotga ketadi.',
    nameLabel: 'Taom nomi (ixtiyoriy)',
    correct: "To'g'ri. Koeffitsient 1,5; un 300 g, shakar 120 g, sut 225 ml.",
    wrong: "Maslahat: avval koeffitsientni toping (6 ni 4 ga bo'ling), so'ng har ingredientni shu koeffitsientga ko'paytiring.",
  },
  ru: {
    title: 'Проект «Кухня»',
    body: 'Санжар пересчитывает рецепт с 4 порций на 6 порций. Помогите ему.',
    kLabel: 'Коэффициент (6 ÷ 4)',
    kHint: 'Разделите новые порции на старые.',
    note: 'Творческая часть: оформите карточку блюда и придумайте название. Эта часть не оценивается — идёт в родительский отчёт.',
    nameLabel: 'Название блюда (необязательно)',
    correct: 'Верно. Коэффициент 1,5; мука 300 г, сахар 120 г, молоко 225 мл.',
    wrong: 'Подсказка: сначала найдите коэффициент (6 разделить на 4), затем умножьте каждый ингредиент на него.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// o'nli son: vergul yoki nuqta, bitta ajratuvchi
const cleanDec = (raw) => String(raw).replace(/[^0-9.,]/g, '').replace(',', '.').replace(/(\..*)\./g, '$1');
const toNum = (s) => { const v = parseFloat(cleanDec(s)); return Number.isFinite(v) ? v : NaN; };
const eq = (a, b) => Math.abs(a - b) < 1e-6;

export default function Amaliyot10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [k, setK] = useState('');
  const [ings, setIngs] = useState(['', '', '']);
  const [name, setName] = useState(''); // ochiq qism — baholanmaydi
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false); // to'g'ri javobdan keyin ×1,5 o'sish bari

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const a = initialAnswer.studentAnswer;
      if (a.k != null) setK(String(a.k));
      if (Array.isArray(a.ings)) setIngs(a.ings.map(String));
      if (a.name != null) setName(String(a.name));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  const allFilled = k.trim() !== '' && ings.every((x) => x.trim() !== '');
  useEffect(() => { onReady?.(allFilled && !checked); }, [allFilled, checked, onReady]);

  const setIng = (i, raw) => setIngs((p) => p.map((x, j) => (j === i ? cleanDec(raw) : x)));

  const check = useCallback(() => {
    const kv = toNum(k);
    const iv = ings.map(toNum);
    const kOk = eq(kv, K);
    const ingsOk = ROWS.every((r, i) => eq(iv[i], r.ans));
    const correct = kOk && ingsOk;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { k: kv, ings: iv, name }, // name — ochiq qism
      correctAnswer: { k: K, ings: ROWS.map((r) => r.ans) },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, partial: { kOk }, openPart: name },
    });
  }, [k, ings, name, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  // to'g'ri javobdan keyin har ingredient bari base'dan natijagacha o'sadi (×1,5)
  useEffect(() => {
    if (feedback && feedback.correct) {
      const tm = setTimeout(() => setSolved(true), 60);
      return () => clearTimeout(tm);
    }
    setSolved(false);
  }, [feedback]);

  const lock = isReview || checked;

  return (
    <div className="aq aq10">
      <style>{`
        .aq10 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq10 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq10 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 14px; }
        .aq10 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin:14px 0 6px; }
        .aq10 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:4px; }
        .aq10 input.aq-k { width:100%; box-sizing:border-box; font-size:22px; font-weight:700; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; }
        .aq10 input.aq-k:focus { border-color:#5b8def; background:#fff; }
        .aq10 .aq-ing { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px 12px; padding:10px 12px; margin:8px 0; border:1.5px solid #eef0f4; border-radius:13px; background:#f8fafc; }
        .aq10 .scale { flex-basis:100%; position:relative; display:flex; align-items:center; height:14px; border-radius:7px; background:#eef2f7; overflow:hidden; }
        .aq10 .scale .seg { height:100%; }
        .aq10 .scale .seg.base { background:#5b8def; }
        .aq10 .scale .seg.grow { background:#36b37e; transition: width .6s ease; }
        .aq10 .scale .tag { position:absolute; right:8px; font-size:11px; font-weight:800; color:#1a7f43; transition: opacity .3s ease; }
        .aq10 .aq-ing .lab { font-size:15px; font-weight:700; }
        .aq10 .aq-ing .sub { font-size:13px; color:#9aa1ad; font-weight:500; }
        .aq10 .aq-ing .box { display:flex; align-items:center; gap:6px; }
        .aq10 .aq-ing input { width:84px; font-size:18px; font-weight:700; text-align:right; padding:9px 10px; border-radius:11px; border:2px solid #d6dae3; background:#fff; outline:none; }
        .aq10 .aq-ing input:focus { border-color:#5b8def; }
        .aq10 .aq-ing .unit { font-size:14px; font-weight:700; color:#6b7280; min-width:22px; }
        .aq10 .aq-note { display:flex; gap:8px; margin-top:14px; padding:11px 13px; border-radius:12px; background:#fff7e6; border:1px solid #ffe0a3; font-size:13px; line-height:1.45; color:#7a5a12; }
        .aq10 input.aq-name { width:100%; box-sizing:border-box; font-size:15px; padding:10px 12px; margin-top:8px; border-radius:11px; border:2px solid #eef0f4; background:#fff; outline:none; }
        .aq10 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq10 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq10 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <label className="aq-label" htmlFor="aq10-k">{t.kLabel}</label>
      <input id="aq10-k" className="aq-k" value={k}
        onChange={(e) => setK(cleanDec(e.target.value))}
        inputMode="decimal" placeholder="0" disabled={lock} />
      <div className="aq-hint">{t.kHint}</div>

      {ROWS.map((r, i) => (
        <div className="aq-ing" key={i}>
          <span>
            <span className="lab">{r[lang] || r.uz}</span>{' '}
            <span className="sub">({r.base} {r.unit[lang] || r.unit.uz} × {String(K).replace('.', ',')})</span>
          </span>
          <span className="box">
            <input value={ings[i]} onChange={(e) => setIng(i, e.target.value)} inputMode="decimal" placeholder="?" disabled={lock} />
            <span className="unit">{r.unit[lang] || r.unit.uz}</span>
          </span>
          {feedback && feedback.correct && (
            <div className="scale" aria-hidden="true">
              <div className="seg base" style={{ width: `${(r.base / r.ans) * 100}%` }} />
              <div className="seg grow" style={{ width: solved ? `${100 - (r.base / r.ans) * 100}%` : '0%', transitionDelay: `${i * 0.12}s` }} />
              <span className="tag" style={{ opacity: solved ? 1 : 0, transitionDelay: `${i * 0.12 + 0.35}s` }}>×1,5</span>
            </div>
          )}
        </div>
      ))}

      <div className="aq-note">{t.note}</div>
      <input className="aq-name" value={name} onChange={(e) => setName(e.target.value)}
        placeholder={t.nameLabel} disabled={isReview} maxLength={60} />

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
