// Dars32 · Amaliyot 04 — 🟡 SARALASH 2 (P10) · tag: sort_2
// Konsept: har chiziqni turini aniqlash — TO'G'RI vs EGRI (fazo/chiziqlar, Блок 7).
// Figuralar: 2 to'g'ri chiziq (M14,32 L116,32) + 2 egri chiziq (S-egri) — aralash tartibda.
// Distraktorlar (misconception): egri chiziqni «to'g'ri» deb bilish, to'g'rini «biroz egilgan» deb bilish.
// SAHNA (Dars15 ruhida): tepada jonli osmon-lenta (quyosh, bulut, qush); qatorlar ketma-ket kirib keladi,
// chiziqlar o'zini chizadi (pathLength) va sekin suzadi; pastel ranglar.
// G'alaba: to'rtala qator to'g'ri tanlangach — kubok + yulduzlar + ko'tarilayotgan konfetti (review'da qayta o'ynalmaydi).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// kind: 'straight' | 'curved' — aralash tartib (to'g'ri chip indeksi qatordan qatorga o'zgaradi)
const ROWS = [
  { kind: 'curved' },   // egri  -> chip idx 1
  { kind: 'straight' }, // to'g'ri -> chip idx 0
  { kind: 'straight' }, // to'g'ri -> chip idx 0
  { kind: 'curved' },   // egri  -> chip idx 1
];
const DATA = { ptype: 'P10', level: '🟡', tag: 'sort_2' };
const want = (r) => (r.kind === 'straight' ? 'tog' : 'egri');
// Pastel chiziq ranglari (qator indeksiga ko'ra — javob-leak yo'q).
const INK = ['#e8a6b8', '#8fbcda', '#c4a8de', '#a9c88f'];

const T = {
  uz: {
    eyebrow: 'Geometriya doskasi · Saralash',
    setup: 'Chiziqlar doskada turibdi.',
    ask: 'Har bir chiziqning turini tanlang.',
    board: 'Geometriya doskasi',
    tog: 'To\'g\'ri', egri: 'Egri',
    correct: 'Barakalla! To\'rtala chiziq to\'g\'ri saralandi.',
    hint: 'To\'g\'ri chiziq — burilishsiz; egri chiziq — silliq egiladi.',
  },
  ru: {
    eyebrow: 'Гео-доска · Сортировка',
    setup: 'Линии стоят на доске.',
    ask: 'Определи тип каждой линии.',
    board: 'Гео-доска',
    tog: 'Прямая', egri: 'Кривая',
    correct: 'Молодец! Все четыре линии рассортированы верно.',
    hint: 'Прямая — без изгибов; кривая — плавно изгибается.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const Trophy = () => (
  <svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M17 13 Q5 14 9 24 Q12 32 21 31" fill="none" stroke="#d9a851" strokeWidth="4" strokeLinecap="round" />
    <path d="M47 13 Q59 14 55 24 Q52 32 43 31" fill="none" stroke="#d9a851" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 8 H46 V22 a14 14 0 0 1 -28 0 Z" fill="#f6cd7a" stroke="#d9a851" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="36" width="8" height="8" fill="#eebd63" stroke="#d9a851" strokeWidth="1.6" />
    <rect x="20" y="44" width="24" height="6" rx="2" fill="#f6cd7a" stroke="#d9a851" strokeWidth="1.6" />
    <rect x="15" y="50" width="34" height="7" rx="2.5" fill="#eebd63" stroke="#d9a851" strokeWidth="1.8" />
    <path d="M32 12.5 L33.6 16 L37.4 16.4 L34.6 18.9 L35.4 22.6 L32 20.7 L28.6 22.6 L29.4 18.9 L26.6 16.4 L30.4 16 Z" fill="#fff" opacity=".9" />
  </svg>
);

// Uzoqdagi qush (osmon-lentada).
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="16" height="7" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#93a9bd" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// LINE-SVG KANON: viewBox 0 0 130 64, stroke-width 4.5, fill:none, round caps. Pastel rang; o'zini chizadi.
const FigLine = ({ kind, tone, ink }) => {
  const col = tone === 'good' ? '#2f9e64' : ink;
  return (
    <svg viewBox="0 0 130 64" width="126" height="62" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'straight'
        ? <path className="pq-line" pathLength="100" d="M14,32 L116,32" fill="none" stroke={col} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path className="pq-line" pathLength="100" d="M14,40 C40,6 90,58 116,24" fill="none" stroke={col} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

export default function D32_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: 'tog' | 'egri'}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === want(ROWS[i]);
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === want(r));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: [t.tog, t.egri],
      studentAnswer: { vals },
      correctAnswer: { vals: ROWS.map((r) => want(r)) },
      correct,
      meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;

  return (
    <div className={"pq pq3204" + (still ? " still" : "")}>
      <style>{`
        .pq3204.still *{animation:none !important;}
        .pq3204{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3204 *{box-sizing:border-box;}
        .pq3204 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#6b8fb5;text-transform:uppercase;}
        .pq3204 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3204 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3204 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3204 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px 10px 16px;border-radius:22px;background:linear-gradient(#e3f1fb 0%,#f0f8fd 60%,#f2f9ee 100%);border:2px solid #d4e4ef;box-shadow:inset 0 2px 8px rgba(120,160,190,.1);}
        /* ===== OSMON-LENTA (jonli mini-sahna) ===== */
        .pq3204 .pq-scene{position:relative;width:372px;max-width:100%;height:58px;border-radius:16px;background:linear-gradient(#cfe8f9 0%,#e8f5fd 70%,#dff0d8 100%);border:2px solid #c8def0;overflow:hidden;display:flex;align-items:center;justify-content:center;}
        .pq3204 .pq-sun{position:absolute;top:7px;left:10px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff8d8,#ffe38a 70%,#ffd257);box-shadow:0 0 12px 4px rgba(255,222,120,.5);animation:pq3204Sun 4s ease-in-out infinite;z-index:1;}
        .pq3204 .pq-cloud{position:absolute;height:9px;background:#fff;border-radius:10px;opacity:.92;z-index:1;}
        .pq3204 .pq-cloud::before{content:'';position:absolute;width:12px;height:12px;border-radius:50%;background:#fff;top:-6px;left:6px;}
        .pq3204 .pq-cloud.c1{top:10px;right:14%;width:30px;animation:pq3204Drift 14s ease-in-out infinite;}
        .pq3204 .pq-cloud.c2{bottom:10px;right:32%;width:20px;transform:scale(.75);animation:pq3204Drift 18s ease-in-out infinite reverse;}
        .pq3204 .pq-bird{position:absolute;opacity:.7;z-index:1;top:12px;left:28%;animation:pq3204Bird 9s ease-in-out infinite;}
        .pq3204 .pq-board{font-size:12.5px;font-weight:800;letter-spacing:.03em;color:#4a7396;z-index:2;background:rgba(255,255,255,.82);padding:2px 12px 3px;border-radius:999px;border:1.5px solid #cfe1f0;}
        /* ===== QATORLAR ===== */
        .pq3204 .pq-rows{width:372px;max-width:100%;display:flex;flex-direction:column;gap:8px;}
        .pq3204 .pq-rw{display:grid;grid-template-columns:minmax(0,140px) minmax(0,1fr);gap:8px;align-items:center;border-radius:16px;border:2.5px solid #e0e9f2;background:rgba(255,255,255,.95);padding:8px;transition:.15s;animation:pq3204Enter .5s cubic-bezier(.3,1.3,.5,1) both;}
        .pq3204 .pq-rw:nth-child(2){animation-delay:.1s;} .pq3204 .pq-rw:nth-child(3){animation-delay:.2s;} .pq3204 .pq-rw:nth-child(4){animation-delay:.3s;}
        .pq3204 .pq-rw.good{border-color:#8ecfa8;background:#ecf9f1;}
        .pq3204 .pq-rw.good.win{animation:pq3204Cele .55s ease;}
        .pq3204 .pq-rw.bad{border-color:#eab6b6;background:#fdf3f3;animation:pq3204Shake .35s ease;}
        .pq3204 .pq-figbox{height:62px;border-radius:12px;background:linear-gradient(#f2f8fd,#e9f2fa);border:2px solid #e0eaf4;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .pq3204 .pq-rw.good .pq-figbox{background:#effaf3;border-color:#c5e8d2;}
        .pq3204 .pq-fig{line-height:0;animation:pq3204Float 4s ease-in-out infinite;}
        .pq3204 .pq-line{stroke-dasharray:100;animation:pq3204Draw .9s ease-out .3s both;}
        .pq3204 .pq-rw:nth-child(2) .pq-line{animation-delay:.45s;} .pq3204 .pq-rw:nth-child(3) .pq-line{animation-delay:.6s;} .pq3204 .pq-rw:nth-child(4) .pq-line{animation-delay:.75s;}
        .pq3204 .pq-chips{display:flex;flex-wrap:wrap;gap:8px;}
        .pq3204 .pq-chip{flex:1;min-width:0;height:42px;border-radius:12px;border:2.5px solid #dfe5ee;background:#fff;font-size:15px;font-weight:800;color:#4a5568;cursor:pointer;transition:.12s;font-family:inherit;padding:0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .pq3204 .pq-chip:hover:not(:disabled){border-color:#a9c8e4;transform:translateY(-2px);}
        .pq3204 .pq-chip:active:not(:disabled){transform:scale(.94);}
        .pq3204 .pq-chip.sel{border-color:#8fb5e6;background:#eef5fe;color:#4576b8;}
        .pq3204 .pq-rw.good .pq-chip.sel{border-color:#8ecfa8;background:#e2f5e9;color:#2f9e64;}
        .pq3204 .pq-chip:disabled{cursor:default;}
        /* ===== G'ALABA ===== */
        .pq3204 .pq-win{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;line-height:0;margin-top:2px;animation:pq3204Ans .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3204 .pq-wstars{position:absolute;inset:-8px -30px;pointer-events:none;}
        .pq3204 .pq-wstar{position:absolute;line-height:0;opacity:0;animation:pq3204Twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(246,205,122,.7));}
        .pq3204.still .pq-wstar{opacity:1;}
        .pq3204 .pq-wstar.w2{animation-delay:-.5s;} .pq3204 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq3204 .pq-conf{position:absolute;width:6px;height:6px;border-radius:2px;opacity:0;pointer-events:none;animation:pq3204Conf 1.6s ease-out infinite;}
        .pq3204.still .pq-conf{display:none;}
        .pq3204 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3204In .22s ease both;}
        .pq3204 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3204 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3204Sun{0%,100%{transform:scale(1);box-shadow:0 0 10px 3px rgba(255,222,120,.45);}50%{transform:scale(1.08);box-shadow:0 0 15px 5px rgba(255,222,120,.6);}}
        @keyframes pq3204Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-12px);}}
        @keyframes pq3204Bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-20px,-4px);}}
        @keyframes pq3204Enter{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pq3204Draw{from{stroke-dashoffset:100;}to{stroke-dashoffset:0;}}
        @keyframes pq3204Float{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pq3204Shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3204Cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3204Ans{0%{opacity:0;transform:scale(.3);}100%{opacity:1;transform:scale(1);}}
        @keyframes pq3204Twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3204Conf{0%{opacity:0;transform:translateY(0) rotate(0);}15%{opacity:1;}100%{opacity:0;transform:translateY(-46px) rotate(200deg);}}
        @keyframes pq3204In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <Bird cls="b1" />
          <span className="pq-board">{t.board}</span>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const tone = feedback && rowRight(i) ? 'good' : 'idle';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-figbox">
                  <span className="pq-fig" style={idle ? { animationDelay: `${-i * 0.7}s` } : undefined}>
                    <FigLine kind={r.kind} tone={tone} ink={INK[i]} />
                  </span>
                </div>
                <div className="pq-chips">
                  {['tog', 'egri'].map((k) => (
                    <button key={k} type="button" className={'pq-chip' + (vals[i] === k ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: k })); setFeedback(null); }}>
                      {k === 'tog' ? t.tog : t.egri}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {ok && (
          <div className="pq-win">
            <div className="pq-wstars">
              <span className="pq-wstar" style={{ left: '4%', top: '2px' }}><Star fill="#f6cd7a" /></span>
              <span className="pq-wstar w2" style={{ right: '6%', top: '10px' }}><Star fill="#eebd63" /></span>
              <span className="pq-wstar w3" style={{ left: '46%', bottom: '-2px' }}><Star fill="#f6cd7a" /></span>
              <span className="pq-conf" style={{ left: '-6px', bottom: '4px', background: '#f6b8c8' }} />
              <span className="pq-conf" style={{ right: '-4px', bottom: '8px', background: '#a9cef2', animationDelay: '.4s' }} />
              <span className="pq-conf" style={{ left: '30%', bottom: '0', background: '#c9b3e8', animationDelay: '.8s' }} />
            </div>
            <Trophy />
          </div>
        )}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
