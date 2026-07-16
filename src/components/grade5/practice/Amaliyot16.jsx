// Amaliyot16 — Yaxlitlash: sonlar nurida yaqin razryadga · Blok 1 · daraja Б · teg: rounding
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: son mingga yaxlitlanadi; nurda ikki qo'shni (47000 va 48000) va o'rta belgi ko'rsatiladi,
// o'quvchi sonni qaysi qo'shniga yaxlitlashini tap bilan tanlaydi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUM = 47320;
const STEP = 1000;
const LO = Math.floor(NUM / STEP) * STEP;   // 47000
const HI = LO + STEP;                        // 48000
const ANS = (NUM - LO) < STEP / 2 ? LO : HI; // 47000

const DATA = { tag: 'rounding', level: 'Б', format: 'estimate', block: 1 };

const T = {
  uz: {
    title: 'Yaxlitlash',
    body: "47 320 sonini eng yaqin mingga yaxlitlang. Nurda qaysi belgiga yaqinroq?",
    hint: "O'rtadan (47 500) chapda bo'lsa — pastki mingga, o'ngda bo'lsa — yuqori mingga.",
    correct: "To'g'ri. 320 < 500, shuning uchun 47 320 ≈ 47 000.",
    wrong: "Hali to'g'ri emas. Son o'rtadan (47 500) chapda — demak pastki mingga tushadi.",
    mid: "o'rta",
  },
  ru: {
    title: 'Округление',
    body: 'Округлите 47 320 до ближайшей тысячи. К какой отметке ближе на прямой?',
    hint: 'Левее середины (47 500) — вниз к тысяче, правее — вверх к тысяче.',
    correct: 'Верно. 320 < 500, поэтому 47 320 ≈ 47 000.',
    wrong: 'Пока неверно. Число левее середины (47 500) — значит, вниз к тысяче.',
    mid: 'середина',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const groupSpaces = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function Amaliyot16(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.pick != null) {
      setPicked(initialAnswer.studentAnswer.pick);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const pick = (v) => { if (isReview || checked) return; setPicked(v); };

  const check = useCallback(() => {
    const correct = picked === ANS;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: [{ id: String(LO), label: groupSpaces(LO) }, { id: String(HI), label: groupSpaces(HI) }],
      studentAnswer: { pick: picked },
      correctAnswer: { value: ANS },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, num: NUM, step: STEP },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  // nurdagi nisbiy joylashuv
  const pos = ((NUM - LO) / STEP) * 100;
  const endBtn = (v) => {
    const active = picked === v;
    const showState = checked && active;
    let bg = '#fff', bd = '#cfd6e4', col = '#1f2430';
    if (active) { bg = '#fe5b1a'; bd = '#fe5b1a'; col = '#fff'; }
    if (showState) { const ok = v === ANS; bg = ok ? '#1a7f43' : '#c0392b'; bd = bg; col = '#fff'; }
    return { padding: '10px 14px', borderRadius: 12, fontSize: 18, fontWeight: 800, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit' };
  };

  return (
    <div className="aq aq16">
      <style>{`
        .aq16 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq16 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq16 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 22px; }
        .aq16 .aq-line { position:relative; height:4px; background:#cfd6e4; border-radius:4px; margin:34px 8px 8px; }
        .aq16 .aq-tick { position:absolute; top:-8px; width:2px; height:20px; background:#9aa1ad; }
        .aq16 .aq-mid { position:absolute; top:-8px; left:50%; width:2px; height:20px; background:#c9a23a; transform:translateX(-50%); }
        .aq16 .aq-midlbl { position:absolute; top:-30px; left:50%; transform:translateX(-50%); font-size:11px; color:#c9a23a; font-weight:700; white-space:nowrap; }
        .aq16 .aq-dot { position:absolute; top:50%; width:16px; height:16px; border-radius:50%; background:#fe5b1a; border:3px solid #fff; box-shadow:0 0 0 1px #fe5b1a; transform:translate(-50%,-50%); }
        .aq16 .aq-dotlbl { position:absolute; top:-30px; transform:translateX(-50%); font-size:13px; font-weight:800; color:#fe5b1a; white-space:nowrap; }
        .aq16 .aq-ends { display:flex; justify-content:space-between; margin-top:16px; }
        .aq16 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:14px; text-align:center; }
        .aq16 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq16 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq16 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-line">
        <div className="aq-tick" style={{ left: 0 }} />
        <div className="aq-tick" style={{ right: 0 }} />
        <div className="aq-mid" />
        <div className="aq-midlbl">{t.mid} · {groupSpaces((LO + HI) / 2)}</div>
        <div className="aq-dot" style={{ left: pos + '%' }} />
        <div className="aq-dotlbl" style={{ left: pos + '%' }}>{groupSpaces(NUM)}</div>
      </div>

      <div className="aq-ends">
        <button type="button" style={endBtn(LO)} onClick={() => pick(LO)} disabled={isReview || checked}>{groupSpaces(LO)}</button>
        <button type="button" style={endBtn(HI)} onClick={() => pick(HI)} disabled={isReview || checked}>{groupSpaces(HI)}</button>
      </div>
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
