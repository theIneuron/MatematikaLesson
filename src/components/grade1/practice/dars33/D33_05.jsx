// Dars33 · Amaliyot 05 — 🟡 BURCHAKKA QARAB SARALASH (P10) · Blok 7 geometriya · tag: sort_corners
// Konsept: shaklni burchaklari soniga qarab ajratish — uchburchak=3, kvadrat/to'rtburchak=4.
// Figuralar (aralash tartib): uchburchak(3) · to'rtburchak(4) · kvadrat(4) · uchburchak(3). Har qatorda [3 | 4] chip.
// Distraktorlar (misconception): M2 burchakni noto'g'ri sanash; kvadrat↔to'rtburchak farqidan qat'i nazar ikkalasi ham 4.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT hammasi to'g'rida. Hint farqni o'rgatadi.
// G'alaba-anim (kubok+yulduz) review'da qayta o'ynamaydi (.still gate); yashil qator holati statik ham beriladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// kind: shakl turi; corners: to'g'ri javob ('3' | '4'). To'g'ri chip indeksi qatordan qatorga o'zgaradi.
const ROWS = [
  { id: 'r1', kind: 'triangle', corners: '3' }, // uchburchak -> chip idx 0
  { id: 'r2', kind: 'rect', corners: '4' },      // to'rtburchak -> chip idx 1
  { id: 'r3', kind: 'square', corners: '4' },     // kvadrat -> chip idx 1
  { id: 'r4', kind: 'triangle', corners: '3' },  // uchburchak -> chip idx 0
];
const CHIPS = ['3', '4'];
const DATA = { ptype: 'P10', level: '🟡', tag: 'sort_corners', kinds: ROWS.map((r) => r.kind), corners: ROWS.map((r) => r.corners) };

const T = {
  uz: {
    eyebrow: 'Geometriya doskasi · Saralash',
    setup: 'Doskada to\'rtta shakl bor.',
    ask: 'Har bir shaklni burchaklari soniga qarab ajrating.',
    board: 'Geometriya doskasi',
    c3: '3 burchak', c4: '4 burchak',
    correct: 'Barakalla! To\'rtala shakl to\'g\'ri ajratildi.',
    hint: 'Uchburchakning 3 ta, kvadrat va to\'rtburchakning 4 ta burchagi bor.',
  },
  ru: {
    eyebrow: 'Гео-доска · Сортировка',
    setup: 'На доске четыре фигуры.',
    ask: 'Раздели фигуры по числу углов.',
    board: 'Гео-доска',
    c3: '3 угла', c4: '4 угла',
    correct: 'Молодец! Все четыре фигуры разделены верно.',
    hint: 'У треугольника 3 угла, у квадрата и прямоугольника — 4.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const Trophy = () => (
  <svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M17 13 Q5 14 9 24 Q12 32 21 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M47 13 Q59 14 55 24 Q52 32 43 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 8 H46 V22 a14 14 0 0 1 -28 0 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="36" width="8" height="8" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="20" y="44" width="24" height="6" rx="2" fill="#f2b134" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="15" y="50" width="34" height="7" rx="2.5" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.8" />
    <path d="M32 12.5 L33.6 16 L37.4 16.4 L34.6 18.9 L35.4 22.6 L32 20.7 L28.6 22.6 L29.4 18.9 L26.6 16.4 L30.4 16 Z" fill="#fff" opacity=".9" />
  </svg>
);

// SHAPE-SVG KANON: viewBox 0 0 130 64, stroke-width 3; har tur o'z yumshoq pastel rangida.
// (burchaklarni sanash uchun burchak nuqtalari kichik doiralar bilan ajratilgan)
const SHAPE_C = {
  triangle: { fill: '#d9f2e2', stroke: '#63a97f' },
  square: { fill: '#e9e2f8', stroke: '#9b8ccf' },
  rect: { fill: '#d9eafa', stroke: '#7aa5cd' },
};
const Fig = ({ kind, on }) => {
  const c = SHAPE_C[kind] || { fill: '#dce9f7', stroke: '#3f6b8c' };
  const stroke = on ? '#2e9e63' : c.stroke;
  const fill = on ? '#dff5e8' : c.fill;
  const dot = on ? '#2e9e63' : c.stroke;
  return (
    <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'triangle' && (<>
        <polygon points="65,8 106,55 24,55" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="65" cy="8" r="3" fill={dot} /><circle cx="106" cy="55" r="3" fill={dot} /><circle cx="24" cy="55" r="3" fill={dot} />
      </>)}
      {kind === 'square' && (<>
        <rect x="42" y="9" width="46" height="46" rx="3" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="42" cy="9" r="3" fill={dot} /><circle cx="88" cy="9" r="3" fill={dot} /><circle cx="42" cy="55" r="3" fill={dot} /><circle cx="88" cy="55" r="3" fill={dot} />
      </>)}
      {kind === 'rect' && (<>
        <rect x="22" y="15" width="86" height="34" rx="3" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="22" cy="15" r="3" fill={dot} /><circle cx="108" cy="15" r="3" fill={dot} /><circle cx="22" cy="49" r="3" fill={dot} /><circle cx="108" cy="49" r="3" fill={dot} />
      </>)}
    </svg>
  );
};

export default function D33_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [vals, setVals] = useState({}); // {rowIdx: '3' | '4'}
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

  const rowRight = (i) => vals[i] === ROWS[i].corners;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.corners);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: [t.c3, t.c4],
      studentAnswer: { vals },
      correctAnswer: { vals: ROWS.map((r) => r.corners) },
      correct,
      meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;
  const chipLab = (k) => (k === '3' ? t.c3 : t.c4);

  return (
    <div className={"pq pq3305" + (still ? " still" : "")}>
      <style>{`
        .pq3305.still *{animation:none !important;}
        .pq3305{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3305 *{box-sizing:border-box;}
        .pq3305 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7d94c9;text-transform:uppercase;}
        .pq3305 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3305 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3305 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3305 .pq-board{position:relative;width:390px;max-width:100%;margin:0 auto;padding:36px 12px 16px;border-radius:20px;background:linear-gradient(180deg,#f2f7fd 0%,#fdf7ee 100%);border:2px solid #e2e9f2;overflow:hidden;}
        .pq3305 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c6d9ef,#aec8e6);border:2.5px solid #9cb9dc;color:#33517a;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(90,120,160,.16),inset 0 1px 0 rgba(255,255,255,.5);}
        /* ambient — suzuvchi mini-shakllar + yulduzchalar */
        .pq3305 .pq-amb{position:absolute;z-index:1;pointer-events:none;opacity:.55;}
        .pq3305 .pq-amb.a1{width:12px;height:12px;border-radius:50%;border:2.5px solid #f6c9a4;left:14px;top:42px;animation:pq3305drift 9s ease-in-out infinite;}
        .pq3305 .pq-amb.a2{width:10px;height:10px;border-radius:3px;border:2.5px solid #c3b7ea;right:16px;top:40px;animation:pq3305drift 12s ease-in-out infinite reverse;}
        .pq3305 .pq-amb.a3{width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:11px solid #bfe4cf;right:40px;bottom:12px;animation:pq3305drift 11s ease-in-out infinite;}
        .pq3305 .pq-twk{position:absolute;z-index:1;color:#f4cf85;font-size:11px;line-height:0;pointer-events:none;animation:pq3305tw 3.4s ease-in-out infinite;}
        .pq3305 .pq-twk.w2{animation-delay:-1.6s;color:#c9d8f2;}
        .pq3305 .pq-rows{position:relative;z-index:3;display:flex;flex-direction:column;gap:8px;}
        /* qatorlar bosqichma-bosqich kirib keladi; g'alabada birin-ketin sakraydi */
        .pq3305 .pq-row{display:grid;grid-template-columns:minmax(0,92px) minmax(0,1fr);gap:9px;align-items:center;padding:8px 9px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e3e6ee;transition:.15s;box-shadow:0 2px 6px rgba(90,110,140,.1);animation:pq3305enter .5s cubic-bezier(.25,1.4,.45,1) both;}
        .pq3305 .pq-row:nth-child(1){animation-delay:.05s;}
        .pq3305 .pq-row:nth-child(2){animation-delay:.17s;}
        .pq3305 .pq-row:nth-child(3){animation-delay:.29s;}
        .pq3305 .pq-row:nth-child(4){animation-delay:.41s;}
        .pq3305 .pq-row.good{border-color:#7fc9a1;background:#eafaf1;}
        .pq3305 .pq-row.good.win{animation:pq3305cele .6s cubic-bezier(.3,1.6,.5,1) both;}
        .pq3305 .pq-row.good.win:nth-child(1){animation-delay:0s;}
        .pq3305 .pq-row.good.win:nth-child(2){animation-delay:.12s;}
        .pq3305 .pq-row.good.win:nth-child(3){animation-delay:.24s;}
        .pq3305 .pq-row.good.win:nth-child(4){animation-delay:.36s;}
        .pq3305 .pq-row.bad{border-color:#eebcbc;background:#fdf3f3;animation:pq3305shake .35s ease;}
        .pq3305 .pq-figbox{width:88px;height:50px;border-radius:10px;background:#f7fafd;border:2px solid #e4ebf3;padding:3px 4px;}
        .pq3305 .pq-row.good .pq-figbox{border-color:#a9dcbf;background:#f1fbf5;}
        .pq3305 .pq-fig{width:100%;height:100%;line-height:0;animation:pq3305float 4s ease-in-out infinite;}
        .pq3305 .pq-row.good.win .pq-fig{animation:pq3305dance .9s ease,pq3305float 4s ease-in-out .9s infinite;}
        .pq3305 .pq-chips{display:flex;gap:8px;min-width:0;}
        .pq3305 .pq-chip{flex:1;min-width:0;height:42px;padding:0 6px;border-radius:11px;border:2.5px solid #e3e6ee;background:#fff;font-size:14px;font-weight:800;color:#374151;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:.12s;font-family:inherit;}
        .pq3305 .pq-chip:hover:not(:disabled){border-color:#bcd2ea;transform:translateY(-2px);}
        .pq3305 .pq-chip:active:not(:disabled){transform:scale(.94);}
        .pq3305 .pq-chip.sel{border-color:#7fa8e0;background:#eef4fd;color:#3f66a8;}
        .pq3305 .pq-row.good .pq-chip.sel{border-color:#7fc9a1;background:#e0f5e8;color:#1a7f43;}
        .pq3305 .pq-chip:disabled{cursor:default;}
        .pq3305 .pq-spark{position:absolute;z-index:5;line-height:0;opacity:0;pointer-events:none;filter:drop-shadow(0 0 3px rgba(242,177,52,.5));animation:pq3305twk 1.7s ease-in-out infinite;}
        .pq3305.still .pq-spark{opacity:1;}
        .pq3305 .pq-spark.s2{animation-delay:-.6s;} .pq3305 .pq-spark.s3{animation-delay:-1.15s;}
        /* g'alaba-konfetti: pastel bo'lakchalar yuqoriga uchadi */
        .pq3305 .pq-conf{position:absolute;z-index:6;width:8px;height:8px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3305conf 1.5s ease-out both;}
        .pq3305 .pq-conf.k1{left:20%;bottom:60px;background:#f6c9a4;animation-delay:.05s;}
        .pq3305 .pq-conf.k2{left:38%;bottom:54px;background:#c3b7ea;border-radius:50%;animation-delay:.2s;}
        .pq3305 .pq-conf.k3{left:56%;bottom:62px;background:#9fd8ba;animation-delay:.1s;}
        .pq3305 .pq-conf.k4{left:74%;bottom:56px;background:#f3bfd0;border-radius:50%;animation-delay:.28s;}
        .pq3305 .pq-win{position:relative;display:flex;justify-content:center;margin-top:10px;line-height:0;animation:pq3305ans .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3305 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3305in .22s ease both;}
        .pq3305 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3305 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3305enter{from{opacity:0;transform:translateX(-16px) scale(.94);}to{opacity:1;transform:translateX(0) scale(1);}}
        @keyframes pq3305tw{0%,100%{opacity:.25;transform:scale(.7);}50%{opacity:.9;transform:scale(1.15);}}
        @keyframes pq3305drift{0%,100%{transform:translate(0,0) rotate(0);}50%{transform:translate(8px,-9px) rotate(22deg);}}
        @keyframes pq3305float{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.2deg);}}
        @keyframes pq3305cele{0%{transform:scale(1);}35%{transform:scale(1.04) rotate(.6deg);}65%{transform:scale(.98) rotate(-.4deg);}100%{transform:scale(1);}}
        @keyframes pq3305dance{0%,100%{transform:rotate(0) scale(1);}25%{transform:rotate(-7deg) scale(1.12);}55%{transform:rotate(6deg) scale(1.05);}80%{transform:rotate(-3deg) scale(1.02);}}
        @keyframes pq3305shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3305twk{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3305conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-70px) rotate(230deg);}}
        @keyframes pq3305ans{0%{opacity:0;transform:scale(.3);}100%{opacity:1;transform:scale(1);}}
        @keyframes pq3305in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.board}</div>

        {/* ambient hayot: suzuvchi mini-shakllar + yulduzchalar */}
        <span className="pq-amb a1" /><span className="pq-amb a2" /><span className="pq-amb a3" />
        <span className="pq-twk" style={{ left: '8%', top: '52px' }}>{'✦'}</span>
        <span className="pq-twk w2" style={{ right: '8%', bottom: '16px' }}>{'✦'}</span>

        {/* To'rt shakl-qator: figura + [3 burchak | 4 burchak]. To'g'ri chip indeksi qatordan qatorga o'zgaradi. */}
        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const shown = !!feedback;
            const good = shown && rowRight(i);
            const bad = shown && !rowRight(i);
            const cls = 'pq-row' + (good ? ' good' + (ok ? ' win' : '') : bad ? ' bad' : '');
            return (
              <div key={r.id} className={cls}>
                <div className="pq-figbox">
                  <span className="pq-fig" style={idle ? { animationDelay: `${-i * 0.7}s` } : undefined}>
                    <Fig kind={r.kind} on={good} />
                  </span>
                </div>
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
          <span className="pq-spark" style={{ left: '10%', top: '30px' }}><Star fill="#f2c46b" /></span>
          <span className="pq-spark s2" style={{ left: '86%', top: '48px' }}><Star fill="#e8ae5c" /></span>
          <span className="pq-spark s3" style={{ left: '50%', top: '24px' }}><Star fill="#f2c46b" /></span>
          <span className="pq-conf k1" /><span className="pq-conf k2" /><span className="pq-conf k3" /><span className="pq-conf k4" />
        </>)}

        {ok && (<div className="pq-win"><Trophy /></div>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
