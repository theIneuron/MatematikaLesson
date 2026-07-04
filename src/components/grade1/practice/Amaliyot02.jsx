// Amaliyot02 (1-sinf) — P3 Juftlarni ulash: misol ↔ javob · Blok 2 · daraja 🟢 · teg: connect_pairs
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: HAQIQIY elastik chiziq — chapdagi nuqtadan barmoq bilan tortib, o'ngdagi javobga ulash (SVG rezina chiziq).

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';

const LEFT = [
  { id: 0, expr: '2 + 3', ans: 5 },
  { id: 1, expr: '4 + 2', ans: 6 },
  { id: 2, expr: '3 + 4', ans: 7 },
];
const RIGHT = [   // aralashtirilgan javoblar (chap qatorga mos kelmaydi)
  { id: 'a', val: 6 },
  { id: 'b', val: 5 },
  { id: 'c', val: 7 },
];
const COLORS = ['#5b8def', '#e0803a', '#3aa66b'];
const DATA = { tag: 'connect_pairs', level: '🟢', block: 2, ptype: 'P3' };

const T = {
  uz: {
    title: 'Juftlarni ula',
    setup: 'Uchta misol va uchta javob berilgan. Har bir misolni hisobla.',
    ask: 'Chapdagi nuqtadan tortib, misolni o\'z javobiga ulang.',
    correct: 'Barakalla! Barcha juftlar to\'g\'ri ulandi.',
    wrong: 'Hammasi to\'g\'ri emas. Har misolni sanab, chiziqni qaytadan torting.',
  },
  ru: {
    title: 'Соедини пары',
    setup: 'Даны три примера и три ответа. Реши каждый пример.',
    ask: 'Потяни от точки слева и соедини пример с ответом.',
    correct: 'Молодец! Все пары соединены верно.',
    wrong: 'Не все пары верны. Посчитай пример и протяни линию заново.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// elastik egri: masofaga qarab pastga osiladi (rezina his)
function bow(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const sag = Math.min(46, dist * 0.16);
  return `M ${x1} ${y1} Q ${mx} ${my + sag} ${x2} ${y2}`;
}

export default function Amaliyot02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [links, setLinks] = useState({});       // { leftId: rightId }
  const [drag, setDrag] = useState(null);       // { fromId, x, y } — joriy tortilayotgan chiziq
  const [hoverRid, setHoverRid] = useState(null);
  const [pos, setPos] = useState({ left: [], right: [] });
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const contRef = useRef(null);
  const leftDots = useRef([]);
  const rightDots = useRef([]);

  const linkedCount = Object.keys(links).length;

  // ulash nuqtalari koordinatalarini (konteynerga nisbatan) o'lchash
  const measure = useCallback(() => {
    const c = contRef.current; if (!c) return;
    const cr = c.getBoundingClientRect();
    const pt = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top }; };
    setPos({
      left: leftDots.current.filter(Boolean).map(pt),
      right: rightDots.current.filter(Boolean).map(pt),
    });
  }, []);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    const h = () => measure();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [measure]);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.links) {
      setLinks(initialAnswer.studentAnswer.links);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(linkedCount === LEFT.length && !checked); }, [linkedCount, checked, onReady]);

  const rightOwner = {};
  Object.keys(links).forEach((lid) => { rightOwner[links[lid]] = Number(lid); });
  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  const localXY = (e) => {
    const cr = contRef.current.getBoundingClientRect();
    return { x: e.clientX - cr.left, y: e.clientY - cr.top };
  };
  const ridAtPoint = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const card = el && el.closest ? el.closest('[data-rid]') : null;
    return card ? card.getAttribute('data-rid') : null;
  };

  const onDotDown = (lid, e) => {
    if (lock) return;
    e.preventDefault();
    setFeedback(null);
    // agar ulangan bo'lsa — uzib, yangidan tortamiz
    setLinks((m) => { if (m[lid] == null) return m; const n = { ...m }; delete n[lid]; return n; });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    const p = localXY(e);
    setDrag({ fromId: lid, x: p.x, y: p.y });
  };
  const onDotMove = (e) => {
    if (!drag) return;
    const p = localXY(e);
    setDrag((d) => (d ? { ...d, x: p.x, y: p.y } : d));
    const rid = ridAtPoint(e);
    setHoverRid(rid && rightOwner[rid] == null ? rid : null);
  };
  const onDotUp = (e) => {
    if (!drag) return;
    const rid = ridAtPoint(e);
    if (rid && rightOwner[rid] == null) {
      const from = drag.fromId;
      setLinks((m) => ({ ...m, [from]: rid }));
    }
    setDrag(null); setHoverRid(null);
  };

  const check = useCallback(() => {
    const correct = LEFT.every((l) => {
      const r = RIGHT.find((x) => x.id === links[l.id]);
      return r && r.val === l.ans;
    });
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: RIGHT.map((r) => String(r.val)),
      studentAnswer: { links },
      correctAnswer: { pairs: LEFT.map((l) => ({ expr: l.expr, ans: l.ans })) },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [links, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const rightIndexById = (rid) => RIGHT.findIndex((r) => r.id === rid);

  return (
    <div className="aq aq02">
      <style>{`
        .aq02 { max-width:560px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq02 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq02 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq02 .aq-setup { color:#5c6672; font-weight:500; }
        .aq02 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq02 .aq-cont { position:relative; touch-action:none; }
        .aq02 .aq-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:2; overflow:visible; }
        .aq02 .aq-line { fill:none; stroke-width:5; stroke-linecap:round; }
        .aq02 .aq-line.snap { animation:aqSnap .32s ease; }
        .aq02 .aq-drag { fill:none; stroke-width:5; stroke-linecap:round; stroke-dasharray:2 9; opacity:.85; }
        .aq02 .aq-grid { display:grid; grid-template-columns:1fr 64px 1fr; gap:14px 0; align-items:center; position:relative; z-index:1; }
        .aq02 .aq-card { height:64px; display:flex; align-items:center; justify-content:center;
          font-size:25px; font-weight:800; border-radius:14px; border:2.5px solid #d6dae3; background:#fff;
          color:#374151; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, box-shadow .12s; position:relative; }
        .aq02 .aq-card.lcard { margin-right:9px; }
        .aq02 .aq-card.rcard { margin-left:9px; }
        .aq02 .aq-card.linked { border-color:var(--c); }
        .aq02 .aq-card.hover { border-color:#2563eb; box-shadow:0 0 0 3px #dbe6ff; }
        .aq02 .aq-card.win { animation:aqPulse2 .6s ease; }
        .aq02 .aq-dot { position:absolute; width:22px; height:22px; border-radius:50%; background:#fff;
          border:3px solid var(--c); top:50%; transform:translateY(-50%); cursor:grab; touch-action:none; z-index:3; }
        .aq02 .aq-dot.l { right:-11px; transform:translateY(-50%); }
        .aq02 .aq-dot.r { left:-11px; transform:translateY(-50%); background:var(--c); }
        .aq02 .aq-dot.l:active { cursor:grabbing; }
        .aq02 .aq-dot.filled { background:var(--c); }
        .aq02 .aq-mid { text-align:center; }
        .aq02 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq02 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq02 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqSnap { 0%{ stroke-width:2;} 50%{ stroke-width:7;} 100%{ stroke-width:5;} }
        @keyframes aqPulse2 { 0%,100%{ box-shadow:0 0 0 0 rgba(26,127,67,0);} 50%{ box-shadow:0 0 0 4px rgba(26,127,67,.35);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-cont" ref={contRef}>
        <svg className="aq-svg">
          {/* ulangan chiziqlar */}
          {LEFT.map((l) => {
            const rid = links[l.id];
            if (rid == null) return null;
            const ri = rightIndexById(rid);
            const a = pos.left[l.id]; const b = pos.right[ri];
            if (!a || !b) return null;
            return <path key={l.id} className="aq-line snap" d={bow(a.x, a.y, b.x, b.y)} stroke={COLORS[l.id]} />;
          })}
          {/* tortilayotgan elastik chiziq */}
          {drag && pos.left[drag.fromId] && (
            <path className="aq-drag" d={bow(pos.left[drag.fromId].x, pos.left[drag.fromId].y, drag.x, drag.y)} stroke={COLORS[drag.fromId]} />
          )}
        </svg>

        <div className={'aq-grid' + (ok ? ' win-wrap' : '')}>
          {LEFT.map((l, i) => {
            const linked = links[l.id] != null;
            const r = RIGHT[i];
            const owner = rightOwner[r.id];
            const rLinked = owner != null;
            const isHover = hoverRid === r.id;
            return (
              <React.Fragment key={l.id}>
                <div className={'aq-card lcard' + (linked ? ' linked' : '') + (ok ? ' win' : '')} style={{ '--c': COLORS[i] }}>
                  {l.expr}
                  <div className={'aq-dot l' + (linked ? ' filled' : '')} style={{ '--c': COLORS[i] }}
                    ref={(el) => { leftDots.current[l.id] = el; }}
                    onPointerDown={(e) => onDotDown(l.id, e)}
                    onPointerMove={onDotMove}
                    onPointerUp={onDotUp}
                    onPointerCancel={onDotUp} />
                </div>
                <div className="aq-mid" />
                <div className={'aq-card rcard' + (rLinked ? ' linked' : '') + (isHover ? ' hover' : '') + (ok ? ' win' : '')}
                  data-rid={r.id} style={{ '--c': rLinked ? COLORS[owner] : '#c9cfd8' }}>
                  <div className="aq-dot r" style={{ '--c': rLinked ? COLORS[owner] : '#c9cfd8' }}
                    ref={(el) => { rightDots.current[i] = el; }} />
                  {r.val}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
