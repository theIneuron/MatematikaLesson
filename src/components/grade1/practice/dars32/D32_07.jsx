// Dars32 · Amaliyot 07 — «Chiziqlarni ajrating» · Blok 7 geometriya · Chiziqni saralash (P10) · 🔴 · tag: sort_3
// To'rt chiziq-qator; har qatorda figura + uch chip [To'g'ri | Egri | Siniq]. Har chiziq turini tanlaysiz.
// Figuralar: egri (S), siniq (zigzag), to'g'ri (qiya), egri (yoy). To'g'ri indeks o'zgaradi (1,2,0,1) — chapdan emas.
// Distraktorlar: egri↔siniq chalkashligi (burilish silliqmi/o'tkirmi), to'g'ri = «biroz egilgan» tushunmovchiligi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q; setChecked FAQAT hammasi to'g'rida. Hint farqni o'rgatadi.
// SAHNA (Dars15 ruhida): pastel doska, tepada quyosh-bulut-qush; qatorlar ketma-ket kiradi, chiziqlar o'zini
// chizadi (pathLength) va suzadi; g'alabada qatorlar to'lqin bo'lib bayramlaydi + yulduzchalar (.still gate).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chiziq-qatorlar. Kanon: viewBox 0 0 130 64, stroke-width 4.5, linecap/linejoin round.
const ROWS = [
  { id: 'r1', kind: 'egri', d: 'M14,40 C40,6 90,58 116,24' },          // egri — silliq S (chip idx1)
  { id: 'r2', kind: 'siniq', d: 'M14,46 L40,16 L66,46 L92,16 L116,46' }, // siniq — o'tkir zigzag (chip idx2)
  { id: 'r3', kind: 'togri', d: 'M14,50 L116,14' },                     // to'g'ri — qiya, burilishsiz (chip idx0)
  { id: 'r4', kind: 'egri', d: 'M14,24 C40,58 90,6 116,40' },           // egri — yoy (chip idx1)
];
const CHIPS = ['togri', 'egri', 'siniq'];
const DATA = { chips: CHIPS, kinds: ROWS.map((r) => r.kind), level: '🔴', tag: 'sort_3' };
// Pastel chiziq ranglari (qator indeksiga ko'ra — javob-leak yo'q).
const INK = ['#e8a6b8', '#8fbcda', '#c4a8de', '#a9c88f'];

const T = {
  uz: {
    eyebrow: 'Geometriya doskasi · Chiziqlar', title: 'Chiziqlarni ajrating',
    setup: 'To\'rtta chiziq bor.',
    ask: 'Har bir chiziqning turini tanlang.',
    correct: 'Barakalla! Hamma chiziq to\'g\'ri ajratildi.',
    hint: 'To\'g\'ri — burilishsiz, egri — silliq buriladi, siniq — o\'tkir.',
    c_togri: 'To\'g\'ri', c_egri: 'Egri', c_siniq: 'Siniq',
  },
  ru: {
    eyebrow: 'Доска геометрии · Линии', title: 'Раздели линии',
    setup: 'Здесь четыре линии.',
    ask: 'Определи тип каждой линии.',
    correct: 'Молодец! Все линии определены верно.',
    hint: 'Прямая — без изгибов, кривая — плавно гнётся, ломаная — с углами.',
    c_togri: 'Прямая', c_egri: 'Кривая', c_siniq: 'Ломаная',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda).
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="16" height="7" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#93a9bd" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Bitta chiziq-figura (pastel rang; o'zini chizadi; to'g'ri holatda yashilga o'zgaradi).
const LineFig = ({ d, ink, on }) => (
  <svg viewBox="0 0 130 64" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-line" pathLength="100" d={d} fill="none" stroke={on ? '#2f9e64' : ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function D32_07(props) {
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
  const chipLab = (k) => (k === 'togri' ? t.c_togri : k === 'egri' ? t.c_egri : t.c_siniq);

  return (
    <div className={"pq pq3207" + (still ? " still" : "")}>
      <style>{`
        .pq3207.still *{animation:none !important;}
        .pq3207{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3207 *{box-sizing:border-box;}
        .pq3207 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3207 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3207 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3207 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3207 .pq-board{position:relative;width:390px;max-width:100%;margin:0 auto;padding:42px 12px 16px;border-radius:22px;background:linear-gradient(#ddeefa 0%,#eef7fd 55%,#f2f9ee 100%);border:2px solid #d3e3ef;overflow:hidden;box-shadow:inset 0 2px 8px rgba(120,160,190,.1);}
        .pq3207 .pq-badge{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:999px;background:linear-gradient(#ffffff,#f0f7ff);border:2px solid #c4d9ee;color:#5b7ea6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(90,130,170,.14);}
        /* ===== AMBIENT (tepa burchaklar) ===== */
        .pq3207 .pq-sun{position:absolute;top:8px;left:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 13px 4px rgba(255,222,120,.5);animation:pq3207sun 4s ease-in-out infinite;z-index:1;}
        .pq3207 .pq-cloud{position:absolute;height:10px;background:#fff;border-radius:11px;opacity:.9;z-index:1;}
        .pq3207 .pq-cloud::before{content:'';position:absolute;width:13px;height:13px;border-radius:50%;background:#fff;top:-6px;left:6px;}
        .pq3207 .pq-cloud.c1{top:12px;right:10%;width:30px;animation:pq3207drift 15s ease-in-out infinite;}
        .pq3207 .pq-bird{position:absolute;opacity:.7;z-index:1;top:16px;right:28%;animation:pq3207bird 9s ease-in-out infinite;}
        /* ===== QATORLAR ===== */
        .pq3207 .pq-rows{position:relative;z-index:3;display:flex;flex-direction:column;gap:8px;}
        .pq3207 .pq-row{display:flex;align-items:center;gap:9px;padding:8px 9px;border-radius:15px;background:rgba(255,255,255,.95);border:3px solid #e3ebf3;transition:.15s;box-shadow:0 2px 6px rgba(110,140,170,.1);animation:pq3207enter .5s cubic-bezier(.3,1.3,.5,1) both;}
        .pq3207 .pq-row:nth-child(2){animation-delay:.1s;} .pq3207 .pq-row:nth-child(3){animation-delay:.2s;} .pq3207 .pq-row:nth-child(4){animation-delay:.3s;}
        .pq3207 .pq-row.good{border-color:#8ecfa8;background:#ecf9f1;}
        .pq3207 .pq-row.good.win{animation:pq3207cele .55s ease both;}
        .pq3207 .pq-row.good.win:nth-child(2){animation-delay:.12s;} .pq3207 .pq-row.good.win:nth-child(3){animation-delay:.24s;} .pq3207 .pq-row.good.win:nth-child(4){animation-delay:.36s;}
        .pq3207 .pq-row.bad{border-color:#eab6b6;background:#fdf3f3;animation:pq3207shake .35s ease;}
        .pq3207 .pq-figbox{flex:0 0 88px;width:88px;height:48px;border-radius:10px;background:linear-gradient(#f2f8fd,#eaf3fa);border:2px solid #e0eaf4;padding:3px 4px;}
        .pq3207 .pq-figbox svg{animation:pq3207float 4s ease-in-out infinite;}
        .pq3207 .pq-row:nth-child(2) .pq-figbox svg{animation-delay:-1s;} .pq3207 .pq-row:nth-child(3) .pq-figbox svg{animation-delay:-2s;} .pq3207 .pq-row:nth-child(4) .pq-figbox svg{animation-delay:-3s;}
        .pq3207 .pq-row.good .pq-figbox{border-color:#c5e8d2;background:#effaf3;}
        .pq3207 .pq-line{stroke-dasharray:100;animation:pq3207draw .9s ease-out .3s both;}
        .pq3207 .pq-row:nth-child(2) .pq-line{animation-delay:.45s;} .pq3207 .pq-row:nth-child(3) .pq-line{animation-delay:.6s;} .pq3207 .pq-row:nth-child(4) .pq-line{animation-delay:.75s;}
        .pq3207 .pq-chips{flex:1 1 0;min-width:0;display:flex;flex-wrap:wrap;gap:6px;}
        .pq3207 .pq-chip{flex:1 1 auto;min-width:0;height:38px;padding:0 6px;border-radius:10px;border:2.5px solid #dfe5ee;background:#fff;font-size:13px;font-weight:800;letter-spacing:.01em;color:#5c6672;cursor:pointer;white-space:nowrap;transition:.12s;}
        .pq3207 .pq-chip:hover:not(:disabled){border-color:#a9c8e4;background:#f6faff;transform:translateY(-1px);}
        .pq3207 .pq-chip:active:not(:disabled){transform:scale(.94);}
        .pq3207 .pq-chip.sel{border-color:#8fb5e6;background:#eef5fe;color:#4576b8;}
        .pq3207 .pq-row.good .pq-chip.sel{border-color:#8ecfa8;background:#e0f5e8;color:#2f9e64;}
        .pq3207 .pq-chip:disabled{cursor:default;}
        .pq3207 .pq-spark{position:absolute;z-index:5;color:#ffd98a;opacity:0;line-height:0;pointer-events:none;animation:pq3207tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,217,138,.7));}
        .pq3207 .pq-spark.s2{animation-delay:-.6s;} .pq3207 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3207 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3207in .22s ease both;}
        .pq3207 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3207 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3207sun{0%,100%{transform:scale(1);box-shadow:0 0 11px 3px rgba(255,222,120,.45);}50%{transform:scale(1.08);box-shadow:0 0 16px 5px rgba(255,222,120,.6);}}
        @keyframes pq3207drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-12px);}}
        @keyframes pq3207bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-18px,-4px);}}
        @keyframes pq3207enter{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pq3207draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3207float{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3207cele{0%{transform:scale(1);}35%{transform:scale(1.03) translateY(-3px);}70%{transform:scale(.99) translateY(0);}100%{transform:scale(1);}}
        @keyframes pq3207shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3207tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3207in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>
        <span className="pq-sun" />
        <span className="pq-cloud c1" />
        <Bird cls="b1" />

        {/* To'rt chiziq-qator: figura + [To'g'ri | Egri | Siniq]. To'g'ri chip indeksi qatordan qatorga o'zgaradi. */}
        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const shown = !!feedback;
            const good = shown && rowRight(i);
            const bad = shown && !rowRight(i);
            const cls = 'pq-row' + (good ? ' good' + (ok ? ' win' : '') : bad ? ' bad' : '');
            return (
              <div key={r.id} className={cls}>
                <span className="pq-figbox"><LineFig d={r.d} ink={INK[i]} on={good} /></span>
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
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
