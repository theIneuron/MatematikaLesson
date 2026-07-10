// Dars02 · Amaliyot 07 — Yirik sonlarni taqqoslash · 🔴 · Sardor · tag: compare_big
// Darslik §5 / Mashq 102g: 6 877 500 600 va 6 876 999 999. jsx-question kontrakti.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT = 6877500600, RIGHT = 6876999999;
const REL = LEFT > RIGHT ? '>' : (LEFT < RIGHT ? '<' : '=');
const DATA = { tag: 'compare_big', level: '🔴' };
const T = {
  uz: {
    eyebrow: 'Taqqoslash', title: 'Yirik sonlar',
    setup: 'Sardor ikki yirik sonni taqqoslamoqchi. Belgini tanlang:',
    correct: "To'g'ri. Chapdan boshlab teng: 6, 8, 7. Keyingi xonada 7 > 6, demak 6 877 500 600 > 6 876 999 999.",
    wrong: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
    pick: 'Belgini tanlang',
  },
  ru: {
    eyebrow: 'Сравнение', title: 'Большие числа',
    setup: 'Сардор сравнивает два больших числа. Выберите знак:',
    correct: 'Верно. Слева равны: 6, 8, 7. В следующем разряде 7 > 6, значит 6 877 500 600 > 6 876 999 999.',
    wrong: 'Пока неверно. Подумайте ещё раз.',
    pick: 'Выберите знак',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const groupSpaces = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function D02_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.rel) {
      setPicked(initialAnswer.studentAnswer.rel);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === REL;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${LEFT} ? ${RIGHT}`, options: [{ id: '>', label: '>' }, { id: '=', label: '=' }, { id: '<', label: '<' }],
      studentAnswer: { rel: picked }, correctAnswer: { rel: REL },
      correct, meta: { tag: DATA.tag, level: DATA.level, left: LEFT, right: RIGHT },
    });
  }, [picked, playCorrect, playWrong, onSubmit]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const relBtn = (r) => {
    const active = picked === r; const show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#2563eb'; bd = '#2563eb'; col = '#fff'; }
    if (show) { const ok = r === REL; bg = ok ? '#1a7f43' : '#c0392b'; bd = bg; col = '#fff'; }
    return { width: 64, height: 64, borderRadius: 16, fontSize: 30, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', border: '2px solid ' + bd, background: bg, color: col, fontFamily: 'inherit' };
  };

  return (
    <div className="pq pq07">
      <style>{`
        .pq07 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq07 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq07 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 16px; color:#374151; }
        .pq07 .pq-nums { display:flex; flex-direction:column; align-items:center; gap:8px; margin:6px 0 8px; }
        .pq07 .pq-n { font-size:26px; font-weight:800; color:#2563eb; font-variant-numeric:tabular-nums; }
        .pq07 .pq-q { font-size:28px; font-weight:800; color:#9aa1ad; min-width:28px; text-align:center; }
        .pq07 .pq-pick { text-align:center; font-size:13px; color:#9aa1ad; font-weight:600; margin-top:14px; }
        .pq07 .pq-rels { display:flex; justify-content:center; gap:14px; margin:8px 0 4px; }
        .pq07 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq07 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq07 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq07 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq07 .a2 { animation-delay:.1s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.12);} 100%{transform:scale(1);} }
        @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
        .pq07 .pq-n.L { animation:pqSlideL .5s cubic-bezier(.22,1,.36,1) both; }
        .pq07 .pq-n.R { animation:pqSlideR .5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes pqSlideL { from { opacity:0; transform:translateX(-24px);} to { opacity:1; transform:translateX(0);} }
        @keyframes pqSlideR { from { opacity:0; transform:translateX(24px);} to { opacity:1; transform:translateX(0);} }
        .pq07 .pq-q.on { animation:pqPop .4s cubic-bezier(.34,1.56,.64,1); }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <div className="pq-nums">
        <span className="pq-n L">{groupSpaces(LEFT)}</span>
        <span className={`pq-q ${picked ? 'on' : ''}`}>{picked || '?'}</span>
        <span className="pq-n R">{groupSpaces(RIGHT)}</span>
      </div>
      <div className="pq-pick a">{t.pick}</div>
      <div className="pq-rels">
        {['>', '=', '<'].map((r, ri) => {
          let a = `pqUp .4s cubic-bezier(.22,1,.36,1) ${(0.2 + ri * 0.08).toFixed(2)}s both`;
          if (checked && picked === r) a = r === REL ? 'pqPop .5s cubic-bezier(.34,1.56,.64,1) both' : 'pqShake .4s both';
          return (<button key={r} type="button" style={{ ...relBtn(r), animation: a }} onClick={() => { if (!isReview && !checked) setPicked(r); }} disabled={isReview || checked}>{r}</button>);
        })}
      </div>
      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
