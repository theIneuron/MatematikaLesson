// Dars34 · Amaliyot 09 — «Uzunliklarni qo'shish» · Blok 7 uzunlik · 🔴 · tag: length_add
// Lenta 8 sm edi, yana 5 sm qo'shildi → 8 + 5 = 13 sm. Birlik SAQLANADI (M3).
// Ma'lumot: ikki lenta-bo'lak (8 sm yashil, 5 sm ko'k), natija g'alabagacha «?» — javob yashirin.
// Variantlar (matn): '13' (M3: birliksiz), '13 sm' = TO'G'RI (index 1, birlik bilan), '3 sm' (ayirgan).
// G'alaba: chizg'ich 0..13, ikki bo'lak ulanadi + «8 sm + 5 sm = 13 sm». VEDI-DO-VERNOGO: xatoda qulf yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chizg'ich kanoni: 0-belgi x=16, har sm = 20px, mark N = 16 + N*20. dm belgilari (0,10) uzunroq/qalinroq.
const SM = 20;                 // 1 sm = 20px
const X0 = 16;                 // 0-belgi
const A = 8, B = 5;            // lenta 8 sm edi, +5 sm qo'shildi
const SUM = A + B;             // 13
const xAt = (n) => X0 + n * SM;

const OPTS = [
  { id: '13' },        // M3: birlik tushib qolgan
  { id: '13 sm' },     // TO'G'RI (index 1) — birlik saqlangan
  { id: '3 sm' },      // ayirgan (8 − 5)
];
const TARGET = '13 sm';
const DATA = { a: A, b: B, sum: SUM, options: OPTS.map((o) => o.id), correct: TARGET, level: '🔴', tag: 'length_add' };

const T = {
  uz: {
    eyebrow: "Uzunlik · Qo'shish", title: "Uzunligi qancha?",
    setup: "Lenta 8 sm edi, yana 5 sm qo'shildi.",
    ask: "Uzunligi qancha?",
    correct: "Barakalla! 8 sm + 5 sm = 13 sm.",
    hint: "Birlikni saqlang: 8 sm + 5 sm — bu 13 sm.",
  },
  ru: {
    eyebrow: "Длина · Сложение", title: "Какая длина?",
    setup: "Лента была 8 см, добавили 5 см.",
    ask: "Какая длина?",
    correct: "Молодец! 8 см + 5 см = 13 см.",
    hint: "Сохрани единицу: 8 см + 5 см — это 13 см.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MA'LUMOT (g'alabagacha): ikki alohida lenta-bo'lak, natija yashirin («?»). Sof rang-bar, chizg'ichsiz — leak yo'q.
const PiecesScene = () => (
  <div className="pq-pieces" aria-hidden="true">
    <div className="pq-prow">
      <svg viewBox={`0 0 ${A * SM} 22`} width={A * SM} height={22} style={{ display: 'block' }}>
        <rect x={0} y={2} width={A * SM} height={18} rx={5} fill="#8fd0a6" stroke="#2f9e5e" strokeWidth="2" />
      </svg>
      <span className="pq-plabel green">8 sm</span>
    </div>
    <div className="pq-prow">
      <svg viewBox={`0 0 ${B * SM} 22`} width={B * SM} height={22} style={{ display: 'block' }}>
        <rect x={0} y={2} width={B * SM} height={18} rx={5} fill="#7fb8e6" stroke="#2f74b8" strokeWidth="2" />
      </svg>
      <span className="pq-plabel blue">+5 sm</span>
    </div>
    <div className="pq-prow res"><span className="pq-eq">8 + 5 =</span><span className="pq-q">?</span></div>
  </div>
);

// G'ALABA: chizg'ich 0..13, ikki bo'lak ulangan (0–8 yashil, 8–13 ko'k). Natija = 13 sm.
const RulerWin = () => {
  const ticks = [];
  for (let n = 0; n <= SUM; n++) {
    const dm = n % 10 === 0;              // dm belgisi: 0, 10
    const x = xAt(n);
    ticks.push(
      <line key={'t' + n} x1={x} y1={42} x2={x} y2={dm ? 62 : 54}
        stroke={dm ? '#6b4a1e' : '#9c7b45'} strokeWidth={dm ? 2.4 : 1.2} strokeLinecap="round" />
    );
    ticks.push(
      <text key={'n' + n} x={x} y={76} textAnchor="middle"
        fontSize={dm ? 11 : 9} fontWeight={dm ? 800 : 600} fill={dm ? '#5a3d17' : '#8a6d3e'}
        fontFamily="'Manrope',sans-serif">{n}</text>
    );
  }
  return (
    <svg viewBox="0 0 296 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* Ulangan lenta: 8 sm (0–8) + 5 sm (8–13). Chap uch 0-belgida (x=16). */}
      <rect x={xAt(0)} y={14} width={SM * A} height={16} rx={4} fill="#8fd0a6" stroke="#2f9e5e" strokeWidth="2" />
      <rect x={xAt(A)} y={14} width={SM * B} height={16} rx={4} fill="#7fb8e6" stroke="#2f74b8" strokeWidth="2" />
      <text x={xAt(A / 2)} y={26} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1c6b3e" fontFamily="'Manrope',sans-serif">8 sm</text>
      <text x={xAt(A + B / 2)} y={26} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1c548f" fontFamily="'Manrope',sans-serif">5 sm</text>
      {/* Chizg'ich tanasi — oxirgi belgi (13) tananing oxirigacha: belgilanmagan quyruq yo'q */}
      <rect x={4} y={36} width={280} height={34} rx={6} fill="#f2e2be" stroke="#c9a35e" strokeWidth="1.5" />
      {ticks}
    </svg>
  );
};

export default function D34_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => lang === 'ru' ? String(s).replace(/sm/g, 'см').replace(/dm/g, 'дм').replace(/m/g, 'м') : s;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map((o) => o.id), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3409" + (still ? " still" : "")}>
      <style>{`
        .pq3409.still *{animation:none !important;}
        .pq3409{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3409 *{box-sizing:border-box;}
        .pq3409 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b5771f;text-transform:uppercase;}
        .pq3409 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3409 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3409 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3409 .pq-board{position:relative;width:390px;max-width:100%;margin:0 auto;padding:38px 14px 16px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ecdb 100%);border:2px solid #e5d3aa;overflow:hidden;}
        .pq3409 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d99a3c,#b5771f);border:2.5px solid #8a5a14;color:#fff8ec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3409 .pq-scene{position:relative;z-index:3;width:100%;min-height:96px;display:flex;align-items:center;justify-content:center;}

        .pq3409 .pq-pieces{display:flex;flex-direction:column;gap:9px;align-items:center;width:100%;}
        .pq3409 .pq-prow{display:flex;align-items:center;gap:10px;}
        .pq3409 .pq-prow.res{margin-top:2px;gap:8px;}
        .pq3409 .pq-plabel{font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;}
        .pq3409 .pq-plabel.green{color:#1c6b3e;} .pq3409 .pq-plabel.blue{color:#1c548f;}
        .pq3409 .pq-eq{font-size:19px;font-weight:800;color:#5a4a2a;font-variant-numeric:tabular-nums;}
        .pq3409 .pq-q{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9px;background:#fff;border:2.5px solid #c9a35e;color:#b5771f;font-size:21px;font-weight:900;animation:pq3409bob 2.4s ease-in-out infinite;}
        .pq3409 .pq-prow svg rect{animation:pq3409grow .5s ease both;transform-origin:left center;}
        .pq3409 .pq-prow:nth-child(2) svg rect{animation-delay:.14s;}

        .pq3409 .pq-eqline{display:flex;justify-content:center;align-items:center;gap:5px;flex-wrap:wrap;margin-top:14px;animation:pq3409in .3s ease both;}
        .pq3409 .pq-eqline b{min-width:56px;height:38px;padding:0 9px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;border-radius:10px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;white-space:nowrap;}
        .pq3409 .pq-eqline b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3409 .pq-eqline i{font-style:normal;font-size:18px;font-weight:900;color:#8a94a2;}

        .pq3409 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:16px;}
        .pq3409 .pq-opt{position:relative;display:flex;align-items:center;justify-content:center;min-height:52px;padding:10px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #e0d3b4;cursor:pointer;transition:.12s;font-size:19px;font-weight:800;color:#5a4a2a;box-shadow:0 3px 8px rgba(90,70,30,.12);}
        .pq3409 .pq-opt:hover:not(:disabled){background:#fff9ec;border-color:#d9bd7e;}
        .pq3409 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3409 .pq-opt.sel{border-color:#c07d17;box-shadow:0 0 0 3px rgba(192,125,23,.18);}
        .pq3409 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3409cele .5s ease;}
        .pq3409 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3409 .pq-opt:disabled{cursor:default;}
        .pq3409 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3409pop .45s ease both;}

        .pq3409 .pq-spark{position:absolute;z-index:5;color:#ffc340;opacity:0;line-height:0;pointer-events:none;animation:pq3409tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,195,64,.6));}
        .pq3409.still .pq-spark{opacity:1;}
        .pq3409 .pq-spark.s2{animation-delay:-.6s;} .pq3409 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3409 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3409in .22s ease both;}
        .pq3409 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3409 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3409bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3409grow{from{transform:scaleX(0);opacity:.3;}to{transform:scaleX(1);opacity:1;}}
        @keyframes pq3409pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3409tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3409cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3409in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Ma'lumot: g'alabagacha ikki bo'lak (8 sm + 5 sm), natija yashirin. G'alabada — ulangan chizg'ich 0..13. */}
        <div className="pq-scene">{ok ? <RulerWin /> : <PiecesScene />}</div>

        {/* G'alaba: birlikni saqlagan tenglik — 8 sm + 5 sm = 13 sm */}
        {ok && (
          <div className="pq-eqline">
            <b>8 sm</b><i>{"+"}</i><b>5 sm</b><i>=</i><b className="res">13 sm</b>
          </div>
        )}

        <div className="pq-opts">
          {OPTS.map((o) => {
            const sel = picked === o.id;
            const right = ok && o.id === TARGET;
            const dim = ok && o.id !== TARGET;
            return (
              <button
                key={o.id}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.id); setFeedback(null); }}
              >
                {uL(o.id)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '22px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
