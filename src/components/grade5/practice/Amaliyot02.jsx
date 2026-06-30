// Amaliyot02 — Tekstli masala (foiz) · Blok 4 · daraja С · teg: percent_of
// BOSQICHLI (interaktiv): har qadam host "Tekshirish" tugmasi bilan alohida tekshiriladi.
// To'g'ri → keyingi qadam ochiladi; xato → Maslahat (javob bermaydi) + qayta; oxirgi → onSubmit.
// Yashirin javob yo'q: hint faqat usulni aytadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const ANS = [48000, 192000, 197000]; // 1) 240000×20% 2) 240000−48000 3) +5000
const DATA = { tag: 'percent_of', level: 'С', format: '2.1' };

const T = {
  uz: {
    title: 'Tekstli masala',
    body: "Kamol 240 000 so'mlik krossovka ko'rdi. Unga 20% chegirma bor. Ustiga 5 000 so'm " +
      "yetkazib berish qo'shiladi. Kamol jami qancha to'laydi? Qadam-baqadam yeching.",
    labels: [
      "Qadam 1 — chegirma necha so'm?",
      'Qadam 2 — chegirmadan keyingi narx?',
      'Qadam 3 — yetkazib berish bilan jami?',
    ],
    hints: [
      "20% — narxning yuzdan yigirma ulushi.",
      "Narxdan chegirmani ayiring.",
      "Chegirmadan keyingi narxga yetkazib berishni qo'shing.",
    ],
    advance: ["To'g'ri! Endi chegirmadan keyingi narxni toping.", "To'g'ri! Endi yetkazib berish bilan jamini toping."],
    finalMsg: "To'g'ri! Kamol jami 197 000 so'm to'laydi.",
    step: 'Qadam',
  },
  ru: {
    title: 'Текстовая задача',
    body: 'Камол увидел кроссовки за 240 000 сум. На них скидка 20%. Сверху добавляется доставка ' +
      '5 000 сум. Сколько всего заплатит Камол? Решайте по шагам.',
    labels: [
      'Шаг 1 — сколько сум скидка?',
      'Шаг 2 — цена после скидки?',
      'Шаг 3 — итог с доставкой?',
    ],
    hints: [
      'Скидка 20% — это двадцать сотых цены.',
      'Из цены вычтите скидку.',
      'К цене после скидки прибавьте доставку.',
    ],
    advance: ['Верно! Теперь найдите цену после скидки.', 'Верно! Теперь найдите итог с доставкой.'],
    finalMsg: 'Верно! Камол заплатит 197 000 сум.',
    step: 'Шаг',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [stage, setStage] = useState(0); // 0,1,2 — joriy qadam
  const [vals, setVals] = useState(['', '', '']);
  const [msg, setMsg] = useState(null); // { ok, text }
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const a = initialAnswer.studentAnswer;
      if (Array.isArray(a.steps)) setVals(a.steps.map(String));
      if (initialAnswer.correct) { setStage(2); setDone(true); setMsg({ ok: true, text: t.finalMsg }); }
    }
  }, [initialAnswer]);

  // tayyorlik: joriy qadam maydoni to'ldirilganda host tugmasi yonadi
  useEffect(() => { onReady?.((vals[stage] || '').trim() !== '' && !done); }, [vals, stage, done, onReady]);

  const setVal = (i, raw) => setVals((p) => p.map((v, j) => (j === i ? cleanInt(raw) : v)));

  const check = useCallback(() => {
    const i = stage;
    const v = parseInt(cleanInt(vals[i]) || '0', 10);
    const ok = v === ANS[i];
    setAttempts((a) => a + 1);
    if (!ok) {
      setMsg({ ok: false, text: 'Maslahat: ' + t.hints[i] });
      playWrong?.();
      return; // submit yo'q — qayta urinadi
    }
    playCorrect?.();
    if (i < 2) {
      setStage(i + 1);
      setMsg({ ok: true, text: t.advance[i] });
    } else {
      setMsg({ ok: true, text: t.finalMsg });
      setDone(true);
      onSubmit?.({
        questionText: t.body, options: [],
        studentAnswer: { steps: vals.map((x) => parseInt(cleanInt(x) || '0', 10)) },
        correctAnswer: { steps: ANS },
        correct: true,
        meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, staged: true, attempts: attempts + 1 },
      });
    }
  }, [stage, vals, attempts, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  return (
    <div className="aq aq02">
      <style>{`
        .aq02 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,sans-serif; color:#1f2430; }
        .aq02 .aq-tag { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; }
        .aq02 .aq-prog { font-size:12px; font-weight:700; color:#2563eb; }
        .aq02 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq02 .aq-field { margin:12px 0; animation:aqIn .28s ease both; }
        .aq02 .aq-label { display:flex; align-items:center; gap:7px; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .aq02 .aq-ok { color:#1a7f43; }
        .aq02 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:4px; }
        .aq02 input.aq-input { width:100%; box-sizing:border-box; font-size:22px; font-weight:700; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq02 input.aq-input:focus { border-color:#5b8def; background:#fff; }
        .aq02 input.aq-input.done { border-color:#36b37e; background:#eafaf1; color:#1a7f43; }
        .aq02 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq02 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq02 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="aq-tag">{t.title}</span>
        <span className="aq-prog">{t.step} {Math.min(stage + 1, 3)}/3</span>
      </div>
      <p className="aq-body">{t.body}</p>

      {[0, 1, 2].map((i) => {
        if (i > stage) return null; // hali ochilmagan
        const completed = i < stage || done;
        return (
          <div className="aq-field" key={i}>
            <label className="aq-label">
              {completed && <span className="aq-ok"><IconOk /></span>}
              {t.labels[i]}
            </label>
            <input
              className={`aq-input ${completed ? 'done' : ''}`}
              value={vals[i]}
              onChange={(e) => setVal(i, e.target.value)}
              inputMode="numeric" pattern="[0-9]*" placeholder="0"
              disabled={isReview || completed}
            />
            {i === stage && !done && <div className="aq-hint">{t.hints[i]}</div>}
          </div>
        );
      })}

      {msg && (
        <div className={`aq-fb ${msg.ok ? 'ok' : 'no'}`}>
          {msg.ok ? <IconOk /> : <IconNo />}<span>{msg.text}</span>
        </div>
      )}
    </div>
  );
}
