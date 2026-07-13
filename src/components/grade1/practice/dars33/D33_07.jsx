// Dars33 · Amaliyot 07 — «Shakllarni saralang» · Blok 7 geometriya · Shaklni saralash (P10) · 🔴 · tag: sort_3
// Uch shakl-qator; har qatorda figura + uch chip [Doira | Uchburchak | To'rtburchak]. Har shakl turini tanlaysiz.
// Figuralar: to'rtburchak (chip idx2), doira (chip idx0), uchburchak (chip idx1) — to'g'ri indeks o'zgaradi, chapdan emas.
// Distraktorlar: kvadrat↔to'rtburchak chalkashligi (M1), burchak sanash xatosi (M2), doira burchakli (M3).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q; setChecked FAQAT hammasi to'g'rida. Hint farqni o'rgatadi.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri qator yashil holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Shakl-qatorlar. SVG kanon: viewBox 0 0 130 64, stroke-width 3, stroke #3f6b8c, pastel fill.
const ROWS = [
  { id: 'r1', kind: 'tortburchak' }, // to'rtburchak — 4 burchak, tomonlari teng emas (chip idx2)
  { id: 'r2', kind: 'doira' },       // doira — burchaksiz, yumaloq (chip idx0)
  { id: 'r3', kind: 'uchburchak' },  // uchburchak — 3 burchak (chip idx1)
];
const CHIPS = ['doira', 'uchburchak', 'tortburchak'];
const DATA = { chips: CHIPS, kinds: ROWS.map((r) => r.kind), level: '🔴', tag: 'sort_3' };

const T = {
  uz: {
    eyebrow: 'Geometriya doskasi · Shakllar', title: 'Shakllarni saralang',
    setup: 'Uchta shakl bor.',
    ask: 'Har bir shaklning turini tanlang.',
    correct: 'Barakalla! Hamma shakl to\'g\'ri saralandi.',
    hint: 'Doira — yumaloq, uchburchak — 3 burchak, to\'g\'ri to\'rtburchak — 4 burchak.',
    c_doira: 'Doira', c_uchburchak: 'Uchburchak', c_tortburchak: 'To\'g\'ri to\'rtburchak',
  },
  ru: {
    eyebrow: 'Доска геометрии · Фигуры', title: 'Разбери фигуры',
    setup: 'Здесь три фигуры.',
    ask: 'Определи тип каждой фигуры.',
    correct: 'Молодец! Все фигуры разобраны верно.',
    hint: 'Круг — круглый, треугольник — 3 угла, прямоугольник — 4 угла.',
    c_doira: 'Круг', c_uchburchak: 'Треугольник', c_tortburchak: 'Прямоугольник',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bitta shakl-figura — har tur o'z yumshoq pastel rangida; on=true bo'lsa yashil (g'alaba).
const SHAPE_C = {
  doira: { fill: '#ffe9d6', stroke: '#e08e5e' },
  tortburchak: { fill: '#d9eafa', stroke: '#7aa5cd' },
  uchburchak: { fill: '#d9f2e2', stroke: '#63a97f' },
};
const ShapeFig = ({ kind, on }) => {
  const c = SHAPE_C[kind] || { fill: '#dce9f7', stroke: '#3f6b8c' };
  const stroke = on ? '#2e9e63' : c.stroke;
  const fill = on ? '#dff5e8' : c.fill;
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'doira' && <circle cx="65" cy="32" r="23" fill={fill} stroke={stroke} strokeWidth="3" />}
      {kind === 'tortburchak' && <rect x="22" y="15" width="86" height="34" rx="3" fill={fill} stroke={stroke} strokeWidth="3" />}
      {kind === 'uchburchak' && <polygon points="65,8 106,55 24,55" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />}
    </svg>
  );
};

export default function D33_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [vals, setVals] = useState({}); // {rowIdx: kind}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  // RESTORE: tanlovlar + feedback (DOIM msg) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.vals) setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].kind;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].kind);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CHIPS, studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.kind) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const chipLab = (k) => (k === 'doira' ? t.c_doira : k === 'uchburchak' ? t.c_uchburchak : t.c_tortburchak);

  return (
    <div className={"pq pq3307" + (still ? " still" : "")}>
      <style>{`
        .pq3307.still *{animation:none !important;}
        .pq3307{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3307 *{box-sizing:border-box;}
        .pq3307 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7d94c9;text-transform:uppercase;}
        .pq3307 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3307 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3307 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3307 .pq-board{position:relative;width:390px;max-width:100%;margin:0 auto;padding:38px 12px 16px;border-radius:20px;background:linear-gradient(180deg,#f2f7fd 0%,#fdf7ee 100%);border:2px solid #e2e9f2;overflow:hidden;}
        .pq3307 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c6d9ef,#aec8e6);border:2.5px solid #9cb9dc;color:#33517a;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(90,120,160,.16),inset 0 1px 0 rgba(255,255,255,.5);}
        /* ambient — suzuvchi mini-shakllar + yulduzchalar */
        .pq3307 .pq-amb{position:absolute;z-index:1;pointer-events:none;opacity:.55;}
        .pq3307 .pq-amb.a1{width:12px;height:12px;border-radius:50%;border:2.5px solid #f6c9a4;left:14px;top:44px;animation:pq3307drift 9s ease-in-out infinite;}
        .pq3307 .pq-amb.a2{width:10px;height:10px;border-radius:3px;border:2.5px solid #c3b7ea;right:16px;top:42px;animation:pq3307drift 12s ease-in-out infinite reverse;}
        .pq3307 .pq-amb.a3{width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:11px solid #bfe4cf;right:42px;bottom:12px;animation:pq3307drift 11s ease-in-out infinite;}
        .pq3307 .pq-twk{position:absolute;z-index:1;color:#f4cf85;font-size:11px;line-height:0;pointer-events:none;animation:pq3307tws 3.4s ease-in-out infinite;}
        .pq3307 .pq-twk.w2{animation-delay:-1.6s;color:#c9d8f2;}
        .pq3307 .pq-rows{position:relative;z-index:3;display:flex;flex-direction:column;gap:9px;}
        /* qatorlar bosqichma-bosqich kirib keladi; g'alabada birin-ketin sakraydi */
        .pq3307 .pq-row{display:flex;align-items:center;gap:9px;padding:8px 9px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e3e6ee;transition:.15s;box-shadow:0 2px 6px rgba(90,110,140,.1);animation:pq3307enter .5s cubic-bezier(.25,1.4,.45,1) both;}
        .pq3307 .pq-row:nth-child(1){animation-delay:.05s;}
        .pq3307 .pq-row:nth-child(2){animation-delay:.18s;}
        .pq3307 .pq-row:nth-child(3){animation-delay:.31s;}
        .pq3307 .pq-row.good{border-color:#7fc9a1;background:#eafaf1;}
        .pq3307 .pq-row.good.win{animation:pq3307cele .6s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3307 .pq-row.good.win:nth-child(1){animation-delay:0s;}
        .pq3307 .pq-row.good.win:nth-child(2){animation-delay:.12s;}
        .pq3307 .pq-row.good.win:nth-child(3){animation-delay:.24s;}
        .pq3307 .pq-row.bad{border-color:#eebcbc;background:#fdf3f3;animation:pq3307shake .35s ease;}
        .pq3307 .pq-figbox{flex:0 0 72px;width:72px;height:48px;border-radius:10px;background:#f7fafd;border:2px solid #e4ebf3;padding:3px 4px;line-height:0;}
        .pq3307 .pq-row.good .pq-figbox{border-color:#a9dcbf;background:#f1fbf5;}
        .pq3307 .pq-fig{display:block;width:100%;height:100%;animation:pq3307float 4s ease-in-out infinite;}
        .pq3307 .pq-row:nth-child(2) .pq-fig{animation-delay:-1.4s;}
        .pq3307 .pq-row:nth-child(3) .pq-fig{animation-delay:-2.8s;}
        .pq3307 .pq-row.good.win .pq-fig{animation:pq3307dance .9s ease,pq3307float 4s ease-in-out .9s infinite;}
        .pq3307 .pq-chips{flex:1 1 0;min-width:0;display:flex;flex-wrap:wrap;gap:6px;}
        .pq3307 .pq-chip{flex:1 1 auto;min-width:0;height:36px;padding:0 8px;border-radius:10px;border:2.5px solid #e3e6ee;background:#fff;font-size:12.5px;font-weight:800;letter-spacing:.01em;color:#5c6672;cursor:pointer;white-space:nowrap;transition:.12s;}
        .pq3307 .pq-chip:hover:not(:disabled){border-color:#bcd2ea;background:#fbfdff;transform:translateY(-1px);}
        .pq3307 .pq-chip:active:not(:disabled){transform:scale(.94);}
        .pq3307 .pq-chip.sel{border-color:#7fa8e0;background:#eef4fd;color:#3f66a8;}
        .pq3307 .pq-row.good .pq-chip.sel{border-color:#7fc9a1;background:#e0f5e8;color:#1a7f43;}
        .pq3307 .pq-chip:disabled{cursor:default;}
        .pq3307 .pq-spark{position:absolute;z-index:5;color:#f4cd79;opacity:0;line-height:0;pointer-events:none;animation:pq3307tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(244,205,121,.6));}
        .pq3307 .pq-spark.s2{animation-delay:-.6s;} .pq3307 .pq-spark.s3{animation-delay:-1.15s;}
        /* g'alaba-konfetti: pastel bo'lakchalar yuqoriga uchadi */
        .pq3307 .pq-conf{position:absolute;z-index:6;width:8px;height:8px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3307conf 1.5s ease-out both;}
        .pq3307 .pq-conf.k1{left:20%;bottom:52px;background:#f6c9a4;animation-delay:.05s;}
        .pq3307 .pq-conf.k2{left:38%;bottom:46px;background:#c3b7ea;border-radius:50%;animation-delay:.2s;}
        .pq3307 .pq-conf.k3{left:56%;bottom:54px;background:#9fd8ba;animation-delay:.1s;}
        .pq3307 .pq-conf.k4{left:74%;bottom:48px;background:#f3bfd0;border-radius:50%;animation-delay:.28s;}
        .pq3307 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3307in .22s ease both;}
        .pq3307 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3307 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3307enter{from{opacity:0;transform:translateX(-16px) scale(.94);}to{opacity:1;transform:translateX(0) scale(1);}}
        @keyframes pq3307drift{0%,100%{transform:translate(0,0) rotate(0);}50%{transform:translate(8px,-9px) rotate(22deg);}}
        @keyframes pq3307tws{0%,100%{opacity:.25;transform:scale(.7);}50%{opacity:.9;transform:scale(1.15);}}
        @keyframes pq3307float{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.2deg);}}
        @keyframes pq3307cele{0%{transform:scale(1);}35%{transform:scale(1.04) rotate(.6deg);}65%{transform:scale(.98) rotate(-.4deg);}100%{transform:scale(1);}}
        @keyframes pq3307dance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(-7deg) scale(1.12);}55%{transform:rotate(6deg) scale(1.05);}80%{transform:rotate(-3deg) scale(1.02);}}
        @keyframes pq3307shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3307tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3307conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-70px) rotate(230deg);}}
        @keyframes pq3307in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* ambient hayot: suzuvchi mini-shakllar + yulduzchalar */}
        <span className="pq-amb a1" /><span className="pq-amb a2" /><span className="pq-amb a3" />
        <span className="pq-twk" style={{ left: '8%', top: '54px' }}>{'✦'}</span>
        <span className="pq-twk w2" style={{ right: '8%', bottom: '16px' }}>{'✦'}</span>

        {/* Uch shakl-qator: figura + [Doira | Uchburchak | To'rtburchak]. To'g'ri chip indeksi qatordan qatorga o'zgaradi. */}
        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const shown = !!feedback;
            const good = shown && rowRight(i);
            const bad = shown && !rowRight(i);
            const cls = 'pq-row' + (good ? ' good' + (ok ? ' win' : '') : bad ? ' bad' : '');
            return (
              <div key={r.id} className={cls}>
                <span className="pq-figbox"><span className="pq-fig"><ShapeFig kind={r.kind} on={good} /></span></span>
                <div className="pq-chips">
                  {CHIPS.map((k) => (
                    <button key={k} type="button" className={'pq-chip' + (vals[i] === k ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: k })); setFeedback(null); }}>{chipLab(k)}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '46px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '24px' }}>{'✦'}</span>
          <span className="pq-conf k1" /><span className="pq-conf k2" /><span className="pq-conf k3" /><span className="pq-conf k4" />
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
