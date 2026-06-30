// Amaliyot01 — Tekstli masala (bar-model) · Blok 1 · daraja С · teg: natural_addsub
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
//   - tayyorlikni onReady(true/false) bilan xabar qiladi,
//   - tekshiruvni registerCheck(fn) orqali ro'yxatdan o'tkazadi,
//   - natijani onSubmit(result) bilan bir marta yuboradi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = {
  step1: 4730, // 3450 + 1280
  final: 3770, // 4730 - 960
  tag: 'natural_addsub', level: 'С', format: '2.1',
};

const T = {
  uz: {
    title: 'Tekstli masala',
    body:
      "Bekzodning maktab kutubxonasida 3 450 ta kitob bor edi. Kitobxonlik marafoni " +
      "uchun yana 1 280 ta keltirildi, keyin 960 tasi boshqa maktabga berildi. " +
      "Hozir kutubxonada nechta kitob bor?",
    step1Label: "Qadam 1 — keltirilgandan keyin nechta kitob bo'ldi?",
    finalLabel: "Qadam 2 — hozir nechta kitob bor?",
    step1Hint: "Bor kitoblarga keltirilganini qo'shing.",
    finalHint: "Hosil bo'lgan songa berilganini ayiring.",
    correct: "To'g'ri. Hozir kutubxonada 3 770 ta kitob bor.",
    wrong: "Maslahat: avval keltirilganini qo'shing, keyin berilganini ayiring.",
  },
  ru: {
    title: 'Текстовая задача',
    body:
      'В школьной библиотеке Бекзода было 3 450 книг. Для марафона чтения привезли ещё 1 280, ' +
      'а потом 960 книг передали в другую школу. Сколько книг в библиотеке сейчас?',
    step1Label: 'Шаг 1 — сколько книг стало после привоза?',
    finalLabel: 'Шаг 2 — сколько книг сейчас?',
    step1Hint: 'Прибавьте привезённые к имеющимся.',
    finalHint: 'Из получившегося вычтите переданные.',
    correct: 'Верно. Сейчас в библиотеке 3 770 книг.',
    wrong: 'Подсказка: сначала прибавьте привезённые, потом вычтите переданные.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

export default function Amaliyot01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [step1, setStep1] = useState('');
  const [final, setFinal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.step1 != null) setStep1(String(sa.step1));
      if (sa.final != null) setFinal(String(sa.final));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(final.trim() !== '' && !checked); }, [final, checked, onReady]);

  const check = useCallback(() => {
    const s1 = parseInt(cleanInt(step1) || '0', 10);
    const fin = parseInt(cleanInt(final) || '0', 10);
    const correct = fin === DATA.final;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { step1: s1, final: fin },
      correctAnswer: { step1: DATA.step1, final: DATA.final },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, partial: { step1: s1 === DATA.step1 } },
    });
  }, [step1, final, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ip = { inputMode: 'numeric', pattern: '[0-9]*', disabled: isReview || checked, placeholder: '0' };

  return (
    <div className="aq aq01">
      <style>{`
        .aq01 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq01 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq01 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq01 .aq-field { margin:14px 0; }
        .aq01 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .aq01 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:4px; }
        .aq01 input.aq-input { width:100%; box-sizing:border-box; font-size:22px; font-weight:700; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq01 input.aq-input:focus { border-color:#5b8def; background:#fff; }
        .aq01 input.aq-input:disabled { opacity:.85; }
        .aq01 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq01 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq01 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-field">
        <label className="aq-label" htmlFor="aq01-s1">{t.step1Label}</label>
        <input id="aq01-s1" className="aq-input" value={step1} onChange={(e) => setStep1(cleanInt(e.target.value))} {...ip} />
        <div className="aq-hint">{t.step1Hint}</div>
      </div>

      <div className="aq-field">
        <label className="aq-label" htmlFor="aq01-fin">{t.finalLabel}</label>
        <input id="aq01-fin" className="aq-input" value={final} onChange={(e) => setFinal(cleanInt(e.target.value))} {...ip} />
        <div className="aq-hint">{t.finalHint}</div>
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
