// Dars02 · Amaliyot 10 — YANGI METOD: Raqam ovi (ko'p-tanlov) · 🟡 · tag: find_all
// Suzayotgan pufakchalar orasidan BARCHA kerakli raqamni topib bosish. P2/P3 dan farqli:
// bir emas — bir nechta to'g'ri javob; topib-tanlash (find & tap all).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 3;
const BUBBLES = [
  { id: 'b1', d: 3, x: 14, y: 18 }, { id: 'b2', d: 1, x: 50, y: 12 }, { id: 'b3', d: 3, x: 82, y: 26 },
  { id: 'b4', d: 4, x: 24, y: 56 }, { id: 'b5', d: 2, x: 58, y: 62 }, { id: 'b6', d: 3, x: 86, y: 68 },
  { id: 'b7', d: 5, x: 46, y: 38 },
];
const TARGET_IDS = BUBBLES.filter((b) => b.d === TARGET).map((b) => b.id);
const DATA = { ptype: 'P2', level: '🟡', tag: 'find_all' };
const T = {
  uz: {
    eyebrow: 'Ra\'no bilan', title: 'Raqam ovi',
    setup: 'Ko\'lda raqamli pufakchalar suzmoqda.',
    ask: 'Barcha uchtani (3) toping va bosing.',
    correct: 'Barakalla! Hamma uchtani topdingiz.', hint: 'Faqat 3 raqamli pufakchalarni bosing — hammasini.',
  },
  ru: {
    eyebrow: 'С Рано', title: 'Охота на цифру',
    setup: 'В пруду плавают пузырьки с цифрами.',
    ask: 'Найди и нажми все тройки (3).',
    correct: 'Молодец! Ты нашёл все тройки.', hint: 'Нажимай только пузырьки с цифрой 3 — все.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D02_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.sel) {
      setSel(initialAnswer.studentAnswer.sel);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  const selCount = Object.keys(sel).filter((k) => sel[k]).length;
  useEffect(() => { onReady?.(selCount >= 1 && !checked); }, [selCount, checked, onReady]);

  const lock = isReview || checked;
  const tap = (id) => { if (lock) return; setSel((p) => ({ ...p, [id]: !p[id] })); setFeedback(null); };

  const check = useCallback(() => {
    const ids = Object.keys(sel).filter((k) => sel[k]);
    const correct = ids.length === TARGET_IDS.length && TARGET_IDS.every((id) => sel[id]);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: BUBBLES.map((b) => String(b.d)), studentAnswer: { sel }, correctAnswer: { ids: TARGET_IDS }, correct, meta: { ...DATA } });
  }, [sel, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const cls = (b) => {
    if (!feedback) return sel[b.id] ? ' sel' : '';
    if (sel[b.id] && b.d === TARGET) return ' right';
    if (sel[b.id] && b.d !== TARGET) return ' wrong';
    if (!sel[b.id] && b.d === TARGET) return ' missed';
    return '';
  };

  return (
    <div className="pq pq0210">
      <style>{`
        .pq0210{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0210 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq0210 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq0210 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0210 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0210 .pq-pond{position:relative;height:250px;background:linear-gradient(#e6f5fd,#c9e9f8);border:2px solid #a9d6ee;border-radius:22px;overflow:hidden;}
        .pq0210 .pq-bub{position:absolute;width:58px;height:58px;transform:translate(-50%,-50%);border-radius:50%;border:3px solid #7fc0e6;background:radial-gradient(circle at 35% 30%,#ffffff,#dff1fb);font-size:28px;font-weight:800;color:#1f6ea6;display:flex;align-items:center;justify-content:center;cursor:pointer;font-variant-numeric:tabular-nums;box-shadow:0 3px 8px rgba(0,0,0,.12);animation:pqBob 3.4s ease-in-out infinite;transition:border-color .12s,background .12s,transform .1s;}
        .pq0210 .pq-bub:active{transform:translate(-50%,-50%) scale(.9);}
        .pq0210 .pq-bub.sel{border-color:#2563eb;background:radial-gradient(circle at 35% 30%,#eaf1ff,#c7d8fb);box-shadow:0 0 0 4px rgba(37,99,235,.18);}
        .pq0210 .pq-bub.right{border-color:#1a7f43;background:#e2f6ea;color:#1a7f43;}
        .pq0210 .pq-bub.wrong{border-color:#c0392b;background:#fdeceb;color:#c0392b;}
        .pq0210 .pq-bub.missed{border-style:dashed;border-color:#e0a94a;}
        .pq0210 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0210 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0210 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{transform:translate(-50%,-50%) translateY(0);}50%{transform:translate(-50%,-50%) translateY(-8px);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-pond">
        {BUBBLES.map((b, i) => (
          <button key={b.id} type="button" className={'pq-bub' + cls(b)} disabled={lock}
            style={{ left: b.x + '%', top: b.y + '%', animationDelay: `${i * 0.3}s` }} onClick={() => tap(b.id)}>{b.d}</button>
        ))}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
