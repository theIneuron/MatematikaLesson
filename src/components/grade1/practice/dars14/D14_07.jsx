// Dars14 · Amaliyot 07 — LOGIC «Tartibda yetishmagan son» (ketma-ketlik) · 🔴 · tag: logic_sequence
// Raqam-kartalar qatori tokchada: 11, 12, ?, 14, 15. Qaysi son yetishmagan? → 13.
// Har karta ostida kichik model: 1 dasta (o'nlik) + N yakka qalam — sanoq o'sishini his qilsin.
// G'alaba: 13 kartasi bo'sh joyga uchib tushadi (pop), butun qator yashil yonadi, chip «11, 12, 13, 14, 15».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [11, 12, null, 14, 15];
const MISSING = 13;
const DATA = { seq: SEQ, missing: MISSING, options: [12, 13, 14], ptype: 'LOGIC', level: '🔴', tag: 'logic_sequence' };

// Qalam tanasi rang palitrasi (sariq / qizil / ko'k / yashil) — yakka qalamlar ajralib tursin.
const PAL = [
  { c: '#f2b134', d: '#cf9420' }, // sariq
  { c: '#d9534b', d: '#b23e37' }, // qizil
  { c: '#4f8fc4', d: '#3a72a3' }, // ko'k
  { c: '#57a84f', d: '#43893c' }, // yashil
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Ketma-ketlik", title: "Tartibda yetishmagan son",
    setup: "Tokchada raqam-kartalar tartib bilan terilgan, biri tushib qolgan.",
    ask: "Qatorda qaysi son yetishmagan?",
    correct: "Barakalla! O'n ikkidan keyin o'n uch keladi. Endi qator to'liq: o'n bir, o'n ikki, o'n uch, o'n to'rt, o'n besh!",
    hint: "Kartalarni tartib bilan sanang: o'n bir, o'n ikki, keyin qaysi son keladi?",
    chip: "11, 12, 13, 14, 15",
  },
  ru: {
    eyebrow: "Магазин карандашей · Последовательность", title: "Пропущенное число по порядку",
    setup: "На полке карточки с числами стоят по порядку, одна выпала.",
    ask: "Какое число пропущено в ряду?",
    correct: "Молодец! После двенадцати идёт тринадцать. Теперь ряд полный: одиннадцать, двенадцать, тринадцать, четырнадцать, пятнадцать!",
    hint: "Считай карточки по порядку: одиннадцать, двенадцать, а какое число дальше?",
    chip: "11, 12, 13, 14, 15",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (mini yakka birlik): tik yog'och qalam — grafit uch + yog'och konus, rangli tana (2-ton),
// metall halqa, pushti o'chirg'ich. Bitta qalam = bitta birlik.
const MiniPencil = ({ c = '#f2b134', d = '#cf9420', w = 8 }) => (
  <svg viewBox="0 0 10 36" width={w} height={w * 36 / 10} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="5,1 3.4,5 6.6,5" fill="#2f2f33" />
    <polygon points="3.4,5 6.6,5 7.4,10.5 2.6,10.5" fill="#e8c187" stroke="rgba(0,0,0,.12)" strokeWidth=".5" strokeLinejoin="round" />
    <polygon points="3.4,5 5,5 4.2,10.5 2.6,10.5" fill="#f2d6a4" />
    <rect x="2.6" y="10" width="4.8" height="18.5" fill={c} stroke="rgba(0,0,0,.13)" strokeWidth=".5" />
    <rect x="2.6" y="10" width="1.7" height="18.5" fill={d} />
    <rect x="5.9" y="10" width=".9" height="18.5" fill="#fff" opacity=".35" />
    <rect x="2.4" y="28" width="5.2" height="3.2" rx=".7" fill="#cfd3da" stroke="#a7adb8" strokeWidth=".5" />
    <rect x="2.7" y="30.8" width="4.6" height="4.2" rx="1.4" fill="#f2a6ba" stroke="#db8398" strokeWidth=".5" />
  </svg>
);

// DASTA KANONI (mini o'nlik): 10 qalam yonma-yon tik turgan, qizil rezinka bilan bog'langan, «10» yorlig'i.
const MiniDasta = ({ penW = 5 }) => (
  <span className="pq-dasta">
    <span className="pq-dlabel">10</span>
    <span className="pq-drow">
      {Array.from({ length: 10 }).map((_, i) => {
        const p = PAL[i % PAL.length];
        return <span key={i} className="pq-dpen"><MiniPencil c={p.c} d={p.d} w={penW} /></span>;
      })}
    </span>
    <span className="pq-dband" />
  </span>
);

// Karta ostidagi kichik model: 1 dasta (o'nlik) + N yakka qalam (birlik). Dasta ALOHIDA, yakka ALOHIDA.
const CardModel = ({ n }) => {
  const units = n - 10; // 11..15 → 1..5 yakka
  return (
    <span className="pq-model">
      <MiniDasta penW={5} />
      <span className="pq-gap" />
      <span className="pq-units">
        {Array.from({ length: units }).map((_, i) => {
          const p = PAL[i % PAL.length];
          return <span key={i} className="pq-upen"><MiniPencil c={p.c} d={p.d} w={9} /></span>;
        })}
      </span>
    </span>
  );
};

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D14_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda karta-tushish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.missing;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.missing }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1407">
      <style>{`
        .pq1407{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1407 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1407 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1407 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1407 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1407 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        /* SAHNA */
        .pq1407 .pq-scene{position:relative;width:396px;max-width:100%;min-height:236px;border-radius:20px;background:linear-gradient(#fdf3db 0%,#f8e6ba 58%,#f2d79f 100%);border:2px solid #e6cf9a;overflow:hidden;padding:14px 10px 26px;}
        .pq1407 .pq-win{position:absolute;right:14px;top:12px;width:52px;height:38px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d8b878;box-shadow:0 0 15px 3px rgba(255,239,178,.65);animation:pqGlow 3.6s ease-in-out infinite;z-index:1;}
        .pq1407 .pq-win::before,.pq1407 .pq-win::after{content:'';position:absolute;background:#d8b878;}
        .pq1407 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1407 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1407 .pq-sun{position:absolute;top:14px;left:16px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 13px 3px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1407 .pq-lamp{position:absolute;left:50%;top:0;width:2px;height:16px;background:#8a5628;transform:translateX(-1px);z-index:1;}
        .pq1407 .pq-shade{position:absolute;left:50%;top:14px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;transform:translateX(-13px);box-shadow:0 10px 22px 6px rgba(255,213,110,.4);animation:pqLamp 3.2s ease-in-out infinite;z-index:1;}
        .pq1407 .pq-mote{position:absolute;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.7);z-index:1;animation:pqMote linear infinite;}
        .pq1407 .pq-mote.m1{left:28%;top:26px;animation-duration:7s;}
        .pq1407 .pq-mote.m2{left:70%;top:44px;width:4px;height:4px;animation-duration:9s;animation-delay:-3s;}
        /* KARTALAR QATORI */
        .pq1407 .pq-row{position:relative;z-index:3;display:flex;justify-content:center;align-items:flex-end;gap:6px;margin-top:30px;}
        .pq1407 .pq-card{position:relative;width:66px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px 9px;border-radius:14px;background:#fffdf7;border:2px solid #ecdcb8;box-shadow:0 3px 6px rgba(120,80,30,.14);}
        .pq1407 .pq-card.win{border-color:#1a7f43;background:#eef9f0;animation:pqCele .5s ease;}
        .pq1407 .pq-num{font-size:26px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;line-height:1;}
        .pq1407 .pq-card.win .pq-num{color:#1a7f43;}
        /* bo'sh joy (yetishmagan karta) */
        .pq1407 .pq-card.gap{background:rgba(255,255,255,.4);border-style:dashed;border-color:#d0ab63;}
        .pq1407 .pq-qmark{font-size:30px;font-weight:900;color:#c19a55;opacity:.85;animation:pqBreath 1.7s ease-in-out infinite;line-height:1;}
        .pq1407 .pq-card.fill{animation:pqDrop .5s cubic-bezier(.3,1.25,.5,1) both;}
        .pq1407 .pq-scene.still .pq-card.fill{animation:none;}
        /* karta modeli */
        .pq1407 .pq-model{display:flex;align-items:flex-end;justify-content:center;gap:3px;min-height:26px;}
        .pq1407 .pq-gap{width:2px;}
        .pq1407 .pq-units{display:flex;align-items:flex-end;gap:1px;}
        .pq1407 .pq-upen{line-height:0;}
        .pq1407 .pq-mlabel{font-size:10px;}
        /* DASTA (mini o'nlik) */
        .pq1407 .pq-dasta{position:relative;display:inline-flex;flex-direction:column;align-items:center;}
        .pq1407 .pq-dlabel{position:absolute;top:-9px;left:50%;transform:translateX(-50%);z-index:5;min-width:15px;padding:0 4px;border-radius:6px;background:#c93b32;color:#fff;font-size:9px;font-weight:900;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.22);font-variant-numeric:tabular-nums;line-height:1.4;}
        .pq1407 .pq-drow{display:flex;align-items:flex-end;}
        .pq1407 .pq-dpen{margin-left:-2.5px;} .pq1407 .pq-dpen:first-child{margin-left:0;}
        .pq1407 .pq-dband{position:absolute;left:-1.5px;right:-1.5px;top:44%;height:5px;border-radius:3px;background:linear-gradient(#e8564d,#c93b32);border:1px solid #a52f27;box-shadow:0 1px 2px rgba(0,0,0,.2);z-index:3;}
        /* taphint */
        .pq1407 .pq-taphint{font-size:13px;font-weight:700;color:#a06a1f;background:#fdf1d6;padding:4px 14px;border-radius:999px;}
        /* uchqun + chip */
        .pq1407 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1407 .pq-star.s2{animation-delay:-.5s;} .pq1407 .pq-star.s3{animation-delay:-1s;}
        .pq1407 .pq-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:999px;background:#e8f7ee;border:2px solid #7cc99a;color:#1a7f43;font-size:18px;font-weight:900;letter-spacing:.03em;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;}
        /* variantlar */
        .pq1407 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:2px;}
        .pq1407 .pq-opt{min-width:74px;height:72px;padding:0 6px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1407 .pq-opt:hover:not(:disabled){border-color:#f0c877;transform:translateY(-2px);}
        .pq1407 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1407 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1407 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1407 .pq-opt:disabled{cursor:default;}
        .pq1407 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1407 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1407 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 11px 2px rgba(255,239,178,.5);}50%{box-shadow:0 0 19px 5px rgba(255,239,178,.8);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqMote{0%{transform:translate(0,0);opacity:0;}20%{opacity:.7;}80%{opacity:.55;}100%{transform:translate(16px,24px);opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.14);opacity:1;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-46px) scale(.82);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-win" />
          <span className="pq-sun" />
          <span className="pq-lamp" /><span className="pq-shade" />
          <span className="pq-mote m1" /><span className="pq-mote m2" />

          <div className="pq-row">
            {SEQ.map((v, i) => {
              const isGap = v === null;
              if (isGap && !ok) {
                return (
                  <div key={i} className="pq-card gap">
                    <span className="pq-qmark">?</span>
                    <span className="pq-model" style={{ opacity: 0 }} />
                  </div>
                );
              }
              const n = isGap ? MISSING : v;
              const winHere = ok;
              return (
                <div key={i} className={'pq-card' + (winHere ? ' win' : '') + (isGap && ok ? ' fill' : '')}>
                  <span className="pq-num">{n}</span>
                  <CardModel n={n} />
                </div>
              );
            })}
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '18%', top: '30px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '52%', top: '22px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '82%', top: '34px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {ok && <span className="pq-chip">{t.chip}</span>}

        <div className="pq-opts">
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.missing;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
