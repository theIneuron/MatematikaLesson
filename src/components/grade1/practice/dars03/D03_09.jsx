// Dars03 · Amaliyot 09 — P3 Juftlarni ulash (DRAG, elastik) · 🔴 · 4 juft, nol (bo'sh to'plam) ham bor · tag: connect_pairs_zero
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DIGITS = [0, 6, 8, 10];
const GROUPS = [{ id: 'g1', n: 8, em: '⭐' }, { id: 'g2', n: 0, em: '' }, { id: 'g3', n: 10, em: '🍏' }, { id: 'g4', n: 6, em: '🎈' }];
const DATA = { ptype: 'P3', level: '🔴', tag: 'connect_pairs_zero' };
const ROW = 70, CW = 330;
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Jasur', title: 'Juftlarni ula',
    setup: 'Jasur bayram sovg\'a qutilarini tekshirmoqda: yulduzchalar, olmalar, sharlar. Bitta quti esa bo\'shab qolgan!',
    ask: 'Har raqamni o\'z qutisiga ulang. Nol qayerga boradi?',
    correct: 'Barakalla! Bo\'sh quti — nol. Barcha qutilar sanaldi.', hint: 'Bo\'sh qutida nolta narsa bor. Qolganlarini sanang.',
    empty: 'bo\'sh',
  },
  ru: {
    eyebrow: 'Праздник урожая · Джасур', title: 'Соедини пары',
    setup: 'Джасур проверяет праздничные коробки с подарками: звёздочки, яблоки, шары. А одна коробка опустела!',
    ask: 'Соедини каждую цифру со своей коробкой. Куда пойдёт ноль?',
    correct: 'Молодец! Пустая коробка — ноль. Все коробки посчитаны.', hint: 'В пустой коробке ноль предметов. Остальные посчитай.',
    empty: 'пусто',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D03_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [links, setLinks] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [dragLine, setDragLine] = useState(null);
  const boxRef = useRef(null);
  const dragRef = useRef(null);
  const N = DIGITS.length;
  const H = N * ROW;
  const leftY = (i) => i * ROW + ROW / 2;
  const rightY = (j) => j * ROW + ROW / 2;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.links) {
      setLinks(initialAnswer.studentAnswer.links);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(links).length === N && !checked); }, [links, checked, onReady, N]);

  const lock = isReview || checked;
  const startDrag = (d, e) => {
    if (lock) return; e.preventDefault();
    dragRef.current = { d };
    const i = DIGITS.indexOf(d);
    setDragLine({ x1: 58, y1: leftY(i), x2: 58, y2: leftY(i) });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  };
  const moveDrag = (e) => {
    if (!dragRef.current || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const s = r.width / (boxRef.current.offsetWidth || 1); // zoom kompensatsiyasi (MOBLASH EDIT 7)
    const i = DIGITS.indexOf(dragRef.current.d);
    setDragLine({ x1: 58, y1: leftY(i), x2: (e.clientX - r.left) / s, y2: (e.clientY - r.top) / s });
  };
  const endDrag = (e) => {
    const dr = dragRef.current; dragRef.current = null; setDragLine(null);
    if (!dr || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const s = r.width / (boxRef.current.offsetWidth || 1); // zoom kompensatsiyasi (MOBLASH EDIT 7)
    const mx = (e.clientX - r.left) / s, my = (e.clientY - r.top) / s;
    const row = Math.floor(my / ROW);
    if (mx > 150 && row >= 0 && row < N) {
      const gid = GROUPS[row].id;
      setLinks((prev) => { const nl = {}; for (const k of Object.keys(prev)) if (prev[k] !== gid && Number(k) !== dr.d) nl[k] = prev[k]; nl[dr.d] = gid; return nl; });
      setFeedback(null);
    }
  };

  const isPairRight = (d) => { const g = GROUPS.find((x) => x.id === links[d]); return g && g.n === d; };
  const check = useCallback(() => {
    if (Object.keys(links).length !== N) return;
    const correct = DIGITS.every((d) => isPairRight(d));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: GROUPS.map((g) => `${g.n}`), studentAnswer: { links }, correctAnswer: { pairs: DIGITS.map((d) => ({ d, n: d })) }, correct, meta: { ...DATA } });
  }, [links, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const lineColor = (d) => (feedback ? (isPairRight(d) ? '#1a7f43' : '#c0392b') : '#2563eb');
  const curve = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; const sag = Math.min(36, Math.max(8, Math.hypot(x2 - x1, y2 - y1) * 0.16)); return `M ${x1} ${y1} Q ${mx} ${my + sag} ${x2} ${y2}`; };

  return (
    <div className="pq pq0309">
      <style>{`
        .pq0309{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0309 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a2b;text-transform:uppercase;}
        .pq0309 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0309 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0309 .pq-ask{display:block;margin-top:4px;font-size:18px;font-weight:800;}
        .pq0309 .pq-connect{position:relative;width:${CW}px;margin:6px auto 0;touch-action:none;}
        .pq0309 .pq-svg{position:absolute;inset:0;pointer-events:none;z-index:1;}
        .pq0309 .pq-dig{position:absolute;left:4px;width:52px;height:52px;transform:translateY(-50%);border-radius:14px;border:2.5px solid #d6dae3;background:#fff;font-size:24px;font-weight:800;color:#374151;display:flex;align-items:center;justify-content:center;cursor:grab;transition:border-color .12s,background .12s;font-variant-numeric:tabular-nums;z-index:2;touch-action:none;user-select:none;}
        .pq0309 .pq-dig.linked{border-color:#7aa7f0;}
        .pq0309 .pq-dot{position:absolute;right:-7px;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 0 3px rgba(37,99,235,.18);animation:pqPulse 1.6s ease-in-out infinite;}
        .pq0309 .pq-grp{position:absolute;right:4px;width:140px;min-height:54px;transform:translateY(-50%);border-radius:14px;border:2.5px solid #d6dae3;background:#fff;display:flex;flex-wrap:wrap;gap:2px;align-items:center;justify-content:center;padding:6px 5px;transition:.12s;z-index:2;}
        .pq0309 .pq-grp.linked{border-color:#7aa7f0;background:#f7faff;}
        .pq0309 .pq-grp.empty{border-style:dashed;background:#fbfbfd;}
        .pq0309 .pq-obj{font-size:13px;line-height:1;}
        .pq0309 .pq-emptytxt{font-size:12px;color:#9aa4b2;font-weight:700;}
        .pq0309 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0309 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0309 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqPulse{0%,100%{box-shadow:0 0 0 3px rgba(37,99,235,.18);}50%{box-shadow:0 0 0 6px rgba(37,99,235,.08);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-connect" ref={boxRef} style={{ height: H }}>
        <svg className="pq-svg" viewBox={`0 0 ${CW} ${H}`} width={CW} height={H}>
          {DIGITS.map((d) => {
            const gid = links[d]; if (!gid) return null;
            const j = GROUPS.findIndex((g) => g.id === gid);
            return <path key={d} d={curve(58, leftY(DIGITS.indexOf(d)), 186, rightY(j))} stroke={lineColor(d)} strokeWidth="4" fill="none" strokeLinecap="round" />;
          })}
          {dragLine && <path d={curve(dragLine.x1, dragLine.y1, dragLine.x2, dragLine.y2)} stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 8" />}
        </svg>

        {DIGITS.map((d, i) => (
          <div key={d} className={'pq-dig' + (links[d] ? ' linked' : '')} style={{ top: leftY(i) }}
            onPointerDown={(e) => startDrag(d, e)} onPointerMove={moveDrag} onPointerUp={endDrag}>
            {d}{!lock && <span className="pq-dot" />}
          </div>
        ))}
        {GROUPS.map((g, j) => {
          const linked = Object.values(links).includes(g.id);
          return (
            <div key={g.id} className={'pq-grp' + (g.n === 0 ? ' empty' : '') + (linked ? ' linked' : '')} style={{ top: rightY(j) }}>
              {g.n === 0
                ? <span className="pq-emptytxt">{t.empty}</span>
                : Array.from({ length: g.n }).map((_, k) => (<span key={k} className="pq-obj">{g.em}</span>))}
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
