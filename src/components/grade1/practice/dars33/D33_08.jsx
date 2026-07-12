// Dars33 · Amaliyot 08 — Ko'p-tanlov «Barcha to'rtburchaklarni belgilang» · Blok 7 geometriya · 🔴 · tag: multi_quad
// To'rt shakl-karta: kvadrat (to'rtburchak — GOOD, M1), to'rtburchak (GOOD), doira, uchburchak. GOOD = {1,3} (chapdan emas, aralash).
// Distraktorlar: doira (burchaksiz) va uchburchak (uch burchak) — «faqat cho'ziq to'rtburchak» + kvadratni chetlab qoldirish (M1) xatosiga qarshi.
// ANSWER-LEAK yo'q: g'alabagacha shakl-turi nomi (kvadrat/to'rtburchak…) yozilmaydi va to'g'ri kartalar yashil bo'lmaydi — hammasi bir xil neytral.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'liq to'g'rida; hint farqni o'rgatadi.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri kartalar yakuniy yashil holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Shakl-kartalar (SVG kanon: viewBox 0 0 130 64, stroke-width 3). to'rtburchaklar NOT-first (index 1 va 3).
const CARDS = [
  { id: 'c0', kind: 'doira' },        // doira — 0 burchak, to'rtburchak EMAS
  { id: 'c1', kind: 'kvadrat' },      // kvadrat — 4 teng tomon, TO'RTBURCHAK (GOOD, index 1)
  { id: 'c2', kind: 'uchburchak' },   // uchburchak — 3 burchak, to'rtburchak EMAS
  { id: 'c3', kind: 'tortburchak' },  // to'rtburchak — cho'ziq (GOOD, index 3)
];
const QUADS = ['kvadrat', 'tortburchak'];
const GOOD = CARDS.map((c, i) => (QUADS.includes(c.kind) ? i : -1)).filter((i) => i >= 0); // [1,3]
const DATA = { good: GOOD, options: CARDS.map((c) => c.kind), level: '🔴', tag: 'multi_quad' };

const T = {
  uz: {
    eyebrow: "Geometriya · Shakllar", title: "To'rtburchaklar",
    ask: "Barcha to'rtburchaklarni belgilang.",
    correct: "Barakalla! Kvadrat ham to'rtburchak — to'rt tomoni bor.",
    hint: "To'rtburchakning to'rt tomoni bor. Kvadratni ham qo'shing.",
    l_doira: "doira", l_kvadrat: "kvadrat", l_uchburchak: "uchburchak", l_tortburchak: "to'g'ri to'rtburchak",
  },
  ru: {
    eyebrow: "Геометрия · Фигуры", title: "Четырёхугольники",
    ask: "Отметь все четырёхугольники.",
    correct: "Молодец! Квадрат тоже четырёхугольник — у него четыре стороны.",
    hint: "У четырёхугольника четыре стороны. Возьми и квадрат.",
    l_doira: "круг", l_kvadrat: "квадрат", l_uchburchak: "треугольник", l_tortburchak: "прямоугольник",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bitta shakl-figura (kanon: soft pastel fill, stroke tanlovga qarab; g'alabada yashil).
const ShapeFig = ({ kind, on }) => {
  const st = on ? '#1a7f43' : '#3f6b8c';
  const fl = on ? '#dcf3e5' : '#dce9f7';
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'doira' && <circle cx="65" cy="32" r="23" fill={fl} stroke={st} strokeWidth="3" />}
      {kind === 'kvadrat' && <rect x="42" y="9" width="46" height="46" rx="3" fill={fl} stroke={st} strokeWidth="3" strokeLinejoin="round" />}
      {kind === 'tortburchak' && <rect x="22" y="15" width="86" height="34" rx="3" fill={fl} stroke={st} strokeWidth="3" strokeLinejoin="round" />}
      {kind === 'uchburchak' && <polygon points="65,8 106,55 24,55" fill={fl} stroke={st} strokeWidth="3" strokeLinejoin="round" />}
    </svg>
  );
};

export default function D33_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlangan kartalar + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => GOOD.includes(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: CARDS.map((c) => c.kind), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3308" + (still ? " still" : "")}>
      <style>{`
        .pq3308.still *{animation:none !important;}
        .pq3308{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3308 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3308 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3308 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3308 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(#eef4fb 0%,#dfeaf5 100%);border:2px solid #cfe0f0;overflow:hidden;}
        .pq3308 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#4f86c6,#3567a3);border:2.5px solid #2b5486;color:#f0f6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3308 .pq-grid{position:relative;z-index:3;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
        .pq3308 .pq-card{box-sizing:border-box;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px 9px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #d6dae3;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(40,60,80,.12);}
        .pq3308 .pq-card:hover:not(:disabled){background:#f3f8ff;border-color:#b8d0ea;}
        .pq3308 .pq-card:active:not(:disabled){transform:scale(.98);}
        .pq3308 .pq-card.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3308 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3308cele .5s ease;}
        .pq3308 .pq-card.dim{opacity:.4;filter:saturate(.6);}
        .pq3308 .pq-card:disabled{cursor:default;}
        .pq3308 .pq-fig{width:100%;height:56px;}
        .pq3308 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#1a7f43;}
        .pq3308 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3308pop .45s ease both;}
        .pq3308 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3308tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3308 .pq-spark.s2{animation-delay:-.6s;} .pq3308 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3308 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3308in .22s ease both;}
        .pq3308 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3308 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3308pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3308tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3308cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3308in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* To'rt shakl-karta: to'rtburchaklar NOT-first. G'alabagacha tur-nomi yozilmaydi (javob-leak yo'q). */}
        <div className="pq-grid">
          {CARDS.map((c, i) => {
            const sel = pickedSet.has(i);
            const right = ok && GOOD.includes(i);
            const dim = ok && !GOOD.includes(i);
            const lab = t['l_' + c.kind];
            return (
              <button
                key={c.id}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => toggle(i)}
                aria-label={lab}
              >
                <span className="pq-fig"><ShapeFig kind={c.kind} on={right} /></span>
                {ok && <span className="pq-lab">{lab}</span>}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '48px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '60px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '34px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
