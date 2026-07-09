// Dars13 · Amaliyot 07 — LOGIC «O'nlik va birlik» (guruhlash) · 🔴 · tag: logic_classify
// Aralash obyektlar: dastalar (=o'nlik, rezinka bilan bog'langan 10 qalam) va yakka qalamlar (=birlik).
// Bola har birini ikki savatdan biriga bosib yuboradi. To'g'ri: dasta→o'nliklar, yakka→birliklar.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_classify' };
// Qalam palitrasi (sariq / qizil / ko'k / yashil) — sanashda ajralib tursin.
const PAL = [
  { c: '#f2b134', d: '#cf9420' }, // sariq
  { c: '#d9534b', d: '#b23e37' }, // qizil
  { c: '#4f8fc4', d: '#3a72a3' }, // ko'k
  { c: '#57a84f', d: '#43893c' }, // yashil
];
// Aralash 5 obyekt: 2 dasta (o'nlik) + 3 yakka (birlik), tartibi aralash.
const ITEMS = [
  { id: 0, type: 'dasta' },
  { id: 1, type: 'yakka', pal: PAL[1] },
  { id: 2, type: 'dasta' },
  { id: 3, type: 'yakka', pal: PAL[2] },
  { id: 4, type: 'yakka', pal: PAL[3] },
];
const catFor = (it) => (it.type === 'dasta' ? 'onlik' : 'birlik');
const CORRECT_MAP = {};
ITEMS.forEach((it) => { CORRECT_MAP[it.id] = catFor(it); });

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Guruhlash", title: "O'nlik va birlik",
    setup: "Peshtaxtada dastalar va yakka qalamlar aralashib ketgan. Ularni ajratamiz!",
    ask: "Har birini to'g'ri savatga joylang: dasta — o'nlik, yakka qalam — birlik.",
    correct: "Barakalla! Dastalar — o'nliklar, yakka qalamlar — birliklar. To'g'ri ajratdingiz!",
    hint: "Rezinka bilan bog'langani — dasta (o'nlik). Yolg'iz qalam — birlik.",
    basketOnlik: "O'NLIKLAR", basketBirlik: "BIRLIKLAR",
    btnOnlik: "O'nlik", btnBirlik: "Birlik",
    taphint: "Har birini o'z savatiga joylang",
  },
  ru: {
    eyebrow: "Магазин карандашей · Группировка", title: "Десятки и единицы",
    setup: "На прилавке перемешались пучки и отдельные карандаши. Разберём их!",
    ask: "Помести каждый в свою корзину: пучок — десяток, отдельный карандаш — единица.",
    correct: "Молодец! Пучки — это десятки, отдельные карандаши — единицы. Ты верно рассортировал!",
    hint: "Связанный резинкой — пучок (десяток). Одинокий карандаш — единица.",
    basketOnlik: "ДЕСЯТКИ", basketBirlik: "ЕДИНИЦЫ",
    btnOnlik: "Десяток", btnBirlik: "Единица",
    taphint: "Помести каждый в свою корзину",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — rangli tana (2-ton) + blik, tepada pushti
// o'chirg'ich + metall halqa, pastda yog'och konus + qora grafit uchi. Bitta qalam = bitta birlik.
const Pencil = ({ c = '#f2b134', d = '#cf9420', w = 15 }) => (
  <svg viewBox="0 0 20 64" width={w} height={w * 64 / 20} aria-hidden="true" style={{ display: 'block' }}>
    <rect x="5" y="1.5" width="10" height="7" rx="3" fill="#f2a6ba" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <rect x="6.4" y="2.4" width="1.8" height="5" rx="1" fill="#fff" opacity=".4" />
    <rect x="5" y="7.6" width="10" height="6" fill="#cfd4dc" stroke="rgba(0,0,0,.13)" strokeWidth=".8" />
    <line x1="5" y1="9.6" x2="15" y2="9.6" stroke="#a9b0bb" strokeWidth="1" />
    <line x1="5" y1="11.6" x2="15" y2="11.6" stroke="#a9b0bb" strokeWidth="1" />
    <rect x="5" y="13" width="10" height="37" fill={c} stroke="rgba(0,0,0,.14)" strokeWidth=".8" />
    <rect x="5" y="13" width="3.4" height="37" fill={d} />
    <rect x="11.3" y="13" width="1.8" height="37" fill="#fff" opacity=".35" />
    <polygon points="5,50 15,50 10,61" fill="#e8c99a" stroke="rgba(0,0,0,.14)" strokeWidth=".8" strokeLinejoin="round" />
    <polygon points="5,50 10,50 10,61" fill="#d6ba85" />
    <polygon points="8.4,56.6 11.6,56.6 10,61" fill="#2c2c2c" />
  </svg>
);

// DASTA KANONI (o'nlik): 10 qalam yonma-yon tik turgan, o'rtasidan qizil rezinka bilan bog'langan,
// ustida «10» yorlig'i. Dasta = bitta o'nlik. Dastadagi qalamlar aniq 10 ta.
const Dasta = ({ penW = 11 }) => (
  <span className="pq-dasta">
    <span className="pq-dlabel">10</span>
    <span className="pq-drow">
      {Array.from({ length: 10 }).map((_, i) => {
        const p = PAL[i % PAL.length];
        return <span key={i} className="pq-dpen"><Pencil c={p.c} d={p.d} w={penW} /></span>;
      })}
    </span>
    <span className="pq-dband" />
  </span>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const CATS = ['onlik', 'birlik'];

export default function D13_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [placement, setPlacement] = useState({}); // { id: 'onlik' | 'birlik' }
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda joylash animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.placement) setPlacement(initialAnswer.studentAnswer.placement);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);

  const allPlaced = ITEMS.every((it) => placement[it.id] != null);
  useEffect(() => { onReady?.(allPlaced && !checked); }, [allPlaced, checked, onReady]);

  const lock = isReview || checked;
  const assign = (id, cat) => { if (lock) return; setPlacement((p) => ({ ...p, [id]: cat })); setFeedback(null); };
  const unplace = (id) => { if (lock) return; setPlacement((p) => { const n = { ...p }; delete n[id]; return n; }); setFeedback(null); };

  const check = useCallback(() => {
    if (!ITEMS.every((it) => placement[it.id] != null)) return;
    const correct = ITEMS.every((it) => placement[it.id] === catFor(it));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ITEMS.map((it, i) => `${i + 1}:${it.type}`), studentAnswer: { placement }, correctAnswer: { placement: CORRECT_MAP }, correct, meta: { ...DATA } });
  }, [placement, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const basketItems = (cat) => ITEMS.filter((it) => placement[it.id] === cat);
  const trayItems = ITEMS.filter((it) => placement[it.id] == null);

  return (
    <div className="pq pq1307">
      <style>{`
        .pq1307{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1307 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1307 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1307 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1307 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1307 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        /* SAHNA */
        .pq1307 .pq-scene{position:relative;width:372px;max-width:100%;height:238px;border-radius:20px;background:linear-gradient(#fdf3db 0%,#f8e6ba 58%,#f2d79f 100%);border:2px solid #e6cf9a;overflow:hidden;}
        .pq1307 .pq-win{position:absolute;right:14px;top:12px;width:54px;height:40px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d8b878;box-shadow:0 0 15px 3px rgba(255,239,178,.65);animation:pqGlow 3.6s ease-in-out infinite;z-index:1;}
        .pq1307 .pq-win::before,.pq1307 .pq-win::after{content:'';position:absolute;background:#d8b878;}
        .pq1307 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1307 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1307 .pq-sun{position:absolute;top:14px;left:16px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 13px 3px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1307 .pq-mote{position:absolute;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.7);z-index:1;animation:pqMote linear infinite;}
        .pq1307 .pq-mote.m1{left:30%;top:20px;animation-duration:7s;}
        .pq1307 .pq-mote.m2{left:64%;top:40px;width:4px;height:4px;animation-duration:9s;animation-delay:-3s;}
        .pq1307 .pq-mote.m3{left:48%;top:14px;width:5px;height:5px;animation-duration:8s;animation-delay:-5s;}
        .pq1307 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:22px;background:linear-gradient(#c79a5f,#a9793f);border-top:3px solid #d9b784;box-shadow:inset 0 2px 0 rgba(255,255,255,.22);z-index:1;}
        .pq1307 .pq-shelf::before{content:'';position:absolute;left:0;right:0;bottom:0;height:7px;background:#8f6531;}
        /* SAVATLAR */
        .pq1307 .pq-baskets{position:absolute;left:0;right:0;bottom:22px;display:flex;justify-content:center;gap:16px;padding:0 12px;z-index:3;}
        .pq1307 .pq-basket{position:relative;width:158px;max-width:46%;display:flex;flex-direction:column;align-items:center;}
        .pq1307 .pq-blabel{position:relative;z-index:2;padding:3px 12px;border-radius:9px;font-size:12px;font-weight:900;letter-spacing:.03em;color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.2);white-space:nowrap;}
        .pq1307 .pq-basket.onlik .pq-blabel{background:linear-gradient(#5a97cb,#4f8fc4);border:1.5px solid #3a72a3;}
        .pq1307 .pq-basket.birlik .pq-blabel{background:linear-gradient(#f2b134,#e0a021);border:1.5px solid #c98a16;color:#5c3c04;}
        .pq1307 .pq-bin{margin-top:-3px;width:100%;min-height:104px;display:flex;align-items:flex-end;justify-content:center;gap:6px;padding:8px 8px 9px;border-radius:4px 4px 14px 14px;background:repeating-linear-gradient(90deg,#d7a35d 0 15px,#cf9a52 15px 18px);border:2px solid #9a6a2f;border-top:3px solid #c79055;box-shadow:inset 0 -7px 0 rgba(90,58,20,.12),inset 0 2px 5px rgba(255,255,255,.2),0 4px 6px rgba(120,80,30,.2);}
        .pq1307 .pq-basket.onlik .pq-bin{border-color:#3a72a3;box-shadow:inset 0 -7px 0 rgba(30,60,90,.1),inset 0 2px 5px rgba(255,255,255,.2),0 4px 6px rgba(120,80,30,.2);}
        .pq1307 .pq-basket.win .pq-bin{border-color:#1a7f43;background:repeating-linear-gradient(90deg,#c7ecd2 0 15px,#bde6c9 15px 18px);animation:pqCele .5s ease;}
        .pq1307 .pq-qhint{font-size:40px;font-weight:900;color:#c19a55;opacity:.85;text-shadow:0 2px 5px rgba(255,255,255,.8);animation:pqBreath 1.8s ease-in-out infinite;}
        /* savatdagi obyekt */
        .pq1307 .pq-slot{position:relative;line-height:0;background:none;border:none;padding:2px;cursor:pointer;transition:transform .12s;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));animation:pqDrop .45s cubic-bezier(.3,1.2,.5,1) both;}
        .pq1307 .pq-scene.still .pq-slot{animation:none;}
        .pq1307 .pq-slot:hover:not(:disabled){transform:translateY(-2px);}
        .pq1307 .pq-slot:active:not(:disabled){transform:scale(.94);}
        .pq1307 .pq-slot:disabled{cursor:default;}
        .pq1307 .pq-basket.win .pq-slot{animation:pqSlotWin .5s ease both,pqSway 2.8s ease-in-out infinite;}
        .pq1307 .pq-scene.still .pq-basket.win .pq-slot{animation:none;}
        .pq1307 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);z-index:6;animation:pqPop .3s ease both;font-variant-numeric:tabular-nums;}
        .pq1307 .pq-scene.still .pq-cnt{animation:none;}
        .pq1307 .pq-star{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1307 .pq-star.s2{animation-delay:-.5s;} .pq1307 .pq-star.s3{animation-delay:-1s;}
        /* DASTA figurasi */
        .pq1307 .pq-dasta{position:relative;display:inline-flex;flex-direction:column;align-items:center;}
        .pq1307 .pq-dlabel{position:absolute;top:-13px;left:50%;transform:translateX(-50%);z-index:5;min-width:20px;padding:1px 6px;border-radius:8px;background:#c93b32;color:#fff;font-size:11px;font-weight:900;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.22);font-variant-numeric:tabular-nums;}
        .pq1307 .pq-drow{display:flex;align-items:flex-end;}
        .pq1307 .pq-dpen{margin-left:-6px;} .pq1307 .pq-dpen:first-child{margin-left:0;}
        .pq1307 .pq-dband{position:absolute;left:-3px;right:-3px;top:42%;height:9px;border-radius:6px;background:linear-gradient(#e8564d,#c93b32);border:1.5px solid #a52f27;box-shadow:0 2px 3px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);z-index:3;}
        /* TAROQ (tray) */
        .pq1307 .pq-taphint{font-size:13px;font-weight:700;color:#a06a1f;background:#fdf1d6;padding:4px 14px;border-radius:999px;}
        .pq1307 .pq-tray{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;width:100%;}
        .pq1307 .pq-card{display:flex;flex-direction:column;align-items:center;gap:7px;padding:10px 9px 9px;border-radius:16px;background:#fffdf7;border:2px solid #ecdcb8;box-shadow:0 3px 6px rgba(120,80,30,.1);}
        .pq1307 .pq-obj{display:flex;align-items:flex-end;justify-content:center;min-height:56px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq1307 .pq-cbtns{display:flex;gap:6px;}
        .pq1307 .pq-cbtn{padding:7px 11px;font-size:13px;font-weight:800;border-radius:11px;border:2px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq1307 .pq-cbtn.onlik{border-color:#a9cbe6;color:#3a72a3;}
        .pq1307 .pq-cbtn.birlik{border-color:#eecf8e;color:#a06a1f;}
        .pq1307 .pq-cbtn:hover{transform:translateY(-2px);}
        .pq1307 .pq-cbtn.onlik:hover{background:#eaf3fb;border-color:#4f8fc4;}
        .pq1307 .pq-cbtn.birlik:hover{background:#fdf3db;border-color:#e0a021;}
        .pq1307 .pq-cbtn:active{transform:scale(.93);}
        .pq1307 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1307 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1307 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 11px 2px rgba(255,239,178,.5);}50%{box-shadow:0 0 19px 5px rgba(255,239,178,.8);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqMote{0%{transform:translate(0,0);opacity:0;}20%{opacity:.75;}80%{opacity:.6;}100%{transform:translate(18px,26px);opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.12);opacity:1;}}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(-1.4deg);}50%{transform:translateY(-3px) rotate(1.4deg);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-30px) scale(.8);}70%{opacity:1;transform:translateY(3px);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqSlotWin{0%{transform:scale(1);}35%{transform:scale(1.1);}100%{transform:scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
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
          <span className="pq-mote m1" /><span className="pq-mote m2" /><span className="pq-mote m3" />
          <span className="pq-shelf" />

          <div className="pq-baskets">
            {CATS.map((cat) => {
              const items = basketItems(cat);
              const winHere = ok;
              return (
                <div key={cat} className={'pq-basket ' + cat + (winHere ? ' win' : '')}>
                  <span className="pq-blabel">{cat === 'onlik' ? t.basketOnlik : t.basketBirlik}</span>
                  <div className="pq-bin">
                    {items.length === 0 && !ok && <span className="pq-qhint">?</span>}
                    {items.map((it, idx) => (
                      <button key={it.id} type="button" className="pq-slot" disabled={lock} onClick={() => unplace(it.id)} aria-label={cat}>
                        {ok && <b className="pq-cnt" style={{ animationDelay: `${idx * 0.1}s` }}>{idx + 1}</b>}
                        {it.type === 'dasta' ? <Dasta penW={11} /> : <Pencil c={it.pal.c} d={it.pal.d} w={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '20%', top: '30px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '52%', top: '22px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '82%', top: '36px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {!ok && trayItems.length > 0 && <span className="pq-taphint">{t.taphint}</span>}

        {!ok && (
          <div className="pq-tray">
            {trayItems.map((it) => (
              <div key={it.id} className="pq-card">
                <div className="pq-obj">
                  {it.type === 'dasta' ? <Dasta penW={9} /> : <Pencil c={it.pal.c} d={it.pal.d} w={17} />}
                </div>
                <div className="pq-cbtns">
                  <button type="button" className="pq-cbtn onlik" disabled={lock} onClick={() => assign(it.id, 'onlik')}>{t.btnOnlik}</button>
                  <button type="button" className="pq-cbtn birlik" disabled={lock} onClick={() => assign(it.id, 'birlik')}>{t.btnBirlik}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
