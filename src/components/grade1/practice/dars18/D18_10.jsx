// Dars18 · Amaliyot 10 — DRAG make-ten «Yashikka sur!» · 🔴 · tag: drag_make_ten
// Sahna: Olma bozori. 1-yashik(ten-frame)da sakkizta olma bor, ikki uya bo'sh; 2-yashik bo'sh.
// Pastda beshta yakka olma. Bola olmani BARMOQ bilan sudrab yashik ustiga tashlaydi → olma
// avtomatik keyingi bo'sh uyaga tushadi: AVVAL 1-yashik o'nga to'ladi (make-ten), keyin 2-yashikka.
// BILIM TEKSHIRUVI (trenajyor emas): jonli hisoblagich YO'Q. Beshtasi ham qo'yilgach yashiklarga
// QOPQOQ yopiladi (olmalarni sanab bo'lmaydi) va pastda 4 sonli variant chiqadi — bola yig'indini
// XAYOLAN hisoblab tanlaydi. To'g'ri → qopqoqlar ochiladi, «10» va «3» sanash-badge + bayram;
// noto'g'ri → hint, qulf yo'q, qayta tanlash mumkin. onReady faqat variant tanlanganda.
// DRAG: pointer + zoom kompensatsiyasi (s = rect.width/offsetWidth) + proximity-drop (D05_05 naqshi).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 8, B = 5, TARGET = 13, TEN = 10;
const GAP = TEN - A;   // 2 — 1-yashikni o'ngacha to'ldirish
const OVER = B - GAP;  // 3 — 2-yashikka o'tadigan ortiqcha
const OPTS = [11, 12, 13, 14];
const DATA = { a: A, b: B, target: TARGET, ptype: 'NEW', level: '🔴', tag: 'drag_make_ten' };
const IDS = Array.from({ length: B }).map((_, i) => i); // 5 yakka olma

// Sahna geometriyasi (piksel, zoomdan mustaqil).
const W = 344, H = 252, CS = 24, PITCH = 28, R = 15;
const OX1 = 20, OX2 = 190, OY = 64;
function cellCenter(box, i) {
  const ox = box === 1 ? OX1 : OX2;
  const col = i % 5, row = (i / 5) | 0;
  return { cx: ox + col * PITCH + CS / 2, cy: OY + row * PITCH + CS / 2 };
}
// pi-chi qo'yilgan olmaning uyasi: avval 1-yashik (A..9), keyin 2-yashik (0..OVER-1).
function placementCenter(pi) { return pi < GAP ? cellCenter(1, A + pi) : cellCenter(2, pi - GAP); }
const TRAY = [72, 122, 172, 222, 272].map((x) => ({ cx: x, cy: 208 }));
// Yashik-qopqoqlar (yopilganda olmalar ko'rinmaydi).
const LIDS = [{ left: 8, top: 44 }, { left: 178, top: 44 }];

const T = {
  uz: {
    eyebrow: "Olma bozori · Qo'shish", title: "Sakkizga beshta qo'shamiz",
    setup: "Yashikda sakkizta olma bor, yana beshta olma qo'shamiz.",
    ask: "8 + 5 nechaga teng?",
    correct: "Barakalla! Sakkizga ikkita qo'shsak — o'nta, yana uchta — o'n uchta. 8 + 5 = 13.",
    hint: "Esingizdami? Avval birinchi yashik o'ngacha to'ldi, qolgani ikkinchi yashikka tushdi. O'nga qolganini qo'shing.",
    drag: "Olmani yashikka suring",
    pick: "Yashiklar yopildi! Hammasi nechta olma? Javobni tanlang.",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Сложение', title: 'К восьми добавляем пять',
    setup: 'В ящике восемь яблок, добавляем ещё пять яблок.',
    ask: 'Сколько будет 8 + 5?',
    correct: 'Молодец! К восьми добавим две — десять, и ещё три — тринадцать. 8 + 5 = 13.',
    hint: 'Вспомни: сначала первый ящик заполнился до десяти, остальные яблоки упали во второй. Прибавь к десяти остаток.',
    drag: 'Перетащи яблоко в ящик',
    pick: 'Ящики закрылись! Сколько всего яблок? Выбери ответ.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI: yumaloq olma — radial 2-ton doira + oq blik, tepada jigarrang bandcha + yashil barg.
// Bitta olma = bitta birlik. Palitra: qizil #d9534b / yashil #57a84f (aylanma).
let __gid = 0;
const Apple = ({ green, size = 22 }) => {
  const id = 'pq1810a' + (__gid++);
  const c = green
    ? { top: '#8fcf83', base: '#57a84f', edge: '#3a7a34' }
    : { top: '#ef9089', base: '#d9534b', edge: '#a5362f' };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="36%" cy="32%" r="80%">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="100%" stopColor={c.base} />
        </radialGradient>
      </defs>
      <path d="M12 6 Q12.3 3.4 13.4 2.6" stroke="#7a4a22" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M13.2 3.8 Q16.6 2.2 17.6 5 Q14.6 6.1 13.2 3.8 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <circle cx="12" cy="14" r="8.4" fill={`url(#${id})`} stroke={c.edge} strokeWidth="1.4" />
      <ellipse cx="9" cy="10.4" rx="2.7" ry="1.7" fill="#fff" opacity=".7" transform="rotate(-28 9 10.4)" />
    </svg>
  );
};

export default function D18_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [placedIds, setPlacedIds] = useState([]); // qo'yilgan olma id'lari, qo'yilish tartibida
  const [drag, setDrag] = useState(null);         // { id, x, y } — sudralayotgan olma (sahna-lokal koord.)
  const [picked, setPicked] = useState(null);     // tanlangan yig'indi-variant
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const placed = placedIds.length;
  const allPlaced = placed === B;
  // Review/qayta ochilishda qopqoq-animatsiyalari qayta o'ynamaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const p = initialAnswer.studentAnswer.placed;
      if (typeof p === 'number') setPlacedIds(Array.from({ length: Math.min(Math.max(p, 0), B) }).map((_, i) => i));
      if (typeof initialAnswer.studentAnswer.picked === 'number') setPicked(initialAnswer.studentAnswer.picked);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]); // eslint-disable-line
  // onReady FAQAT variant tanlanganda (sudrash tugagani yetarli emas — bu bilim tekshiruvi).
  useEffect(() => { onReady?.(allPlaced && picked != null && !checked); }, [allPlaced, picked, checked, onReady]);

  const lock = isReview || checked;

  // Sudrash — pointer + zoom kompensatsiyasi (s = rect.width/offsetWidth).
  const pt = (e) => {
    const el = stageRef.current; const r = el.getBoundingClientRect();
    const s = r.width / (el.offsetWidth || 1);
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };
  const putDrag = (v) => { dragRef.current = v; setDrag(v); };
  const onDown = (id, e) => {
    if (lock || allPlaced || placedIds.includes(id)) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = pt(e); putDrag({ id, x: p.x, y: p.y }); setFeedback(null);
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const p = pt(e); putDrag({ ...dragRef.current, x: p.x, y: p.y });
  };
  // Drop = yashik zonasiga yaqin qo'yilsa → keyingi bo'sh uyaga tushadi; aks holda rastaga qaytadi.
  const inBox = (x, y) => x >= 10 && x <= 336 && y >= 46 && y <= 128;
  const onUp = (e) => {
    const d = dragRef.current; if (!d) return;
    const p = pt(e);
    if (inBox(p.x, p.y)) setPlacedIds((prev) => (prev.includes(d.id) ? prev : [...prev, d.id]));
    putDrag(null);
  };

  const check = useCallback(() => {
    if (placedIds.length !== B || picked == null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map(String), studentAnswer: { placed: placedIds.length, picked }, correctAnswer: { placed: B, picked: TARGET }, correct, meta: { ...DATA } });
  }, [placedIds, picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // Qopqoqlar: hammasi qo'yilgach yopiladi; to'g'ri javobda ochilib ketadi (review'da chizilmaydi).
  const lidsOn = allPlaced && (!ok || !still);
  const homeOf = (id) => { const pi = placedIds.indexOf(id); return pi >= 0 ? placementCenter(pi) : TRAY[id]; };

  return (
    <div className="pq pq1810">
      <style>{`
        .pq1810{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1810 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c8473f;text-transform:uppercase;}
        .pq1810 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1810 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1810 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1810 .pq-stage{position:relative;width:${W}px;max-width:100%;height:${H}px;margin:0 auto;border-radius:20px;background:linear-gradient(#fff7ec 0%,#fdeef0 100%);border:2px solid #f0d9c4;overflow:hidden;touch-action:none;}
        .pq1810 .pq-awn{position:absolute;top:0;left:0;right:0;height:18px;background:repeating-linear-gradient(90deg,#d9534b 0 22px,#fbeee6 22px 44px);border-bottom:2px solid #b8403a;z-index:1;}
        .pq1810 .pq-sun{position:absolute;top:24px;right:16px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1810 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(#c8935a,#a5723f);border-top:3px solid #8a5628;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.2);}
        .pq1810 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:12px;height:2px;background:rgba(90,54,20,.35);}
        .pq1810 .pq-chip{position:absolute;top:22px;left:50%;transform:translateX(-50%);z-index:8;font-size:20px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;animation-delay:var(--chipd,0s);white-space:nowrap;}
        .pq1810 .pq-box{position:absolute;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.28);z-index:2;}
        .pq1810 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1810 .pq-cell{position:absolute;width:${CS}px;height:${CS}px;border-radius:7px;background:rgba(255,250,239,.5);border:1.4px solid rgba(120,74,32,.4);box-shadow:inset 0 1px 2px rgba(90,54,20,.18);z-index:3;}
        .pq1810 .pq-cell.empty{background:rgba(255,255,255,.22);border-style:dashed;border-color:rgba(120,74,32,.55);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1810 .pq-plus{position:absolute;z-index:4;font-size:22px;font-weight:900;color:#a05a2e;}
        .pq1810 .pq-apple{position:absolute;width:30px;height:30px;display:flex;align-items:center;justify-content:center;z-index:5;touch-action:none;user-select:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.22));transition:left .18s ease,top .18s ease;}
        .pq1810 .pq-apple.pre{animation:pqPop .3s ease both;pointer-events:none;}
        .pq1810 .pq-apple.grab{cursor:grab;}
        .pq1810 .pq-apple.set{z-index:6;pointer-events:none;}
        .pq1810 .pq-apple.drag{transition:none;z-index:12;cursor:grabbing;filter:drop-shadow(0 6px 7px rgba(0,0,0,.3));}
        .pq1810 .pq-apple.win{animation:pqCele .55s ease both;}
        /* Qopqoq: yog'och taxta — yopilganda olmalarni to'liq berkitadi (sanab bo'lmaydi). */
        .pq1810 .pq-lid{position:absolute;width:160px;height:92px;z-index:7;border-radius:14px;background:repeating-linear-gradient(180deg,#d9a468 0 21px,#c08b4e 21px 23px);border:2.5px solid #86531f;box-shadow:0 5px 11px rgba(0,0,0,.24),inset 0 2px 0 rgba(255,255,255,.3);animation:pqLidClose .5s ease both;animation-delay:.45s;}
        .pq1810 .pq-lid::after{content:'';position:absolute;left:50%;top:8px;transform:translateX(-50%);width:34px;height:9px;border-radius:999px;background:#7a4a22;box-shadow:inset 0 -1.5px 0 rgba(0,0,0,.25);}
        .pq1810 .pq-lid.open{animation:pqLidOpen .8s ease both;animation-delay:.15s;}
        .pq1810 .pq-lid.still{animation:none;opacity:1;transform:none;}
        /* Sanash-badge: qopqoq ochilgach yashik ustida «10» va «3». */
        .pq1810 .pq-cnt{position:absolute;top:38px;z-index:9;padding:1px 11px;border-radius:999px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:16px;font-weight:900;font-variant-numeric:tabular-nums;animation:pqPop .45s ease both;animation-delay:var(--cntd,0s);}
        .pq1810 .pq-hint{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);z-index:9;font-size:12.5px;font-weight:700;color:#5a3a1c;background:rgba(255,255,255,.9);padding:3px 12px;border-radius:999px;animation:pqBob 1.8s ease-in-out infinite;white-space:nowrap;}
        .pq1810 .pq-spark{position:absolute;z-index:10;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1810 .pq-spark.s2{animation-delay:-.6s;} .pq1810 .pq-spark.s3{animation-delay:-1.15s;}
        /* Variantlar: yig'indini XAYOLAN hisoblab tanlash. */
        .pq1810 .pq-pick{text-align:center;margin-top:12px;font-size:15px;font-weight:800;color:#7a5a2e;animation:pqIn .3s ease both;}
        .pq1810 .pq-sgs{display:flex;justify-content:center;gap:8px;margin-top:8px;animation:pqIn .3s .1s ease both;}
        .pq1810 .pq-sg{width:52px;height:48px;border-radius:13px;border:2.5px solid #e2c79a;background:#fff;font-size:22px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;font-family:inherit;transition:.12s;}
        .pq1810 .pq-sg:hover:not(:disabled){border-color:#c9a05e;transform:translateY(-2px);}
        .pq1810 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1810 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1810 .pq-sg.winner{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .55s ease;}
        .pq1810 .pq-sg:disabled{cursor:default;}
        .pq1810 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1810 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1810 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1810 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1810 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#8a7a56;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}
        .pq1810 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1810 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1810 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqBreath{0%,100%{opacity:.8;}50%{opacity:1;}}
        @keyframes pqBob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.14);}60%{transform:scale(.94);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.985);}100%{transform:scale(1);}}
        @keyframes pqLidClose{from{opacity:0;transform:translateY(-90px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqLidOpen{0%{opacity:1;transform:translateY(0) rotate(0);}100%{opacity:0;transform:translateY(-96px) rotate(-7deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={stageRef}>
        <div className="pq-awn" />
        <div className="pq-sun" />
        <div className="pq-shelf" />

        {/* Jonli hisoblagich YO'Q — yig'indi checkdan oldin sizib chiqmaydi. */}
        {ok && <span className="pq-chip" style={{ '--chipd': still ? '0s' : '1.05s' }}>{A} + {B} = {TARGET}</span>}

        {/* Yashiklar (fon) */}
        <div className={'pq-box' + (ok ? ' win' : '')} style={{ left: 12, top: 52, width: 152, height: 76 }} />
        <div className={'pq-box' + (ok ? ' win' : '')} style={{ left: 182, top: 52, width: 152, height: 76 }} />
        <span className="pq-plus" style={{ left: 165, top: 78 }}>+</span>

        {/* Uyalar */}
        {[1, 2].map((box) => Array.from({ length: TEN }).map((_, i) => {
          const c = cellCenter(box, i);
          const filled = box === 1 ? (i < A ? true : placed > i - A) : (i < OVER ? placed > GAP + i : false);
          return <div key={`c${box}-${i}`} className={'pq-cell' + (filled ? '' : ' empty')} style={{ left: c.cx - CS / 2, top: c.cy - CS / 2 }} />;
        }))}

        {/* Oldindan turgan sakkizta olma (1-yashik, statik) */}
        {Array.from({ length: A }).map((_, i) => {
          const c = cellCenter(1, i);
          return <div key={`pre${i}`} className={'pq-apple pre' + (ok ? ' win' : '')} style={{ left: c.cx - R, top: c.cy - R }}><Apple green={i % 2 === 1} /></div>;
        })}

        {/* Beshta yakka olma — sudraladi */}
        {IDS.map((id) => {
          const dragging = drag && drag.id === id;
          const isSet = placedIds.includes(id);
          const c = dragging ? { cx: drag.x, cy: drag.y } : homeOf(id);
          return (
            <div key={id}
              className={'pq-apple' + (dragging ? ' drag' : isSet ? ' set' : ' grab') + (ok ? ' win' : '')}
              style={{ left: c.cx - R, top: c.cy - R }}
              onPointerDown={(e) => onDown(id, e)} onPointerMove={onMove} onPointerUp={onUp}
              role="img" aria-label="olma">
              <Apple green={id % 2 === 0} />
            </div>
          );
        })}

        {/* Qopqoqlar: hammasi qo'yilgach yopiladi; to'g'ri javobda ochilib uchib ketadi. */}
        {lidsOn && LIDS.map((l, i) => (
          <div key={`lid${i}`} className={'pq-lid' + (ok ? ' open' : '') + (still && !ok ? ' still' : '')} style={{ left: l.left, top: l.top }} />
        ))}

        {/* Sanash-badge'lar: qopqoq ochilgach — 1-yashikda 10, 2-yashikda 3. */}
        {ok && (<>
          <span className="pq-cnt" style={{ left: 88 - 16, '--cntd': still ? '0s' : '1.15s' }}>{TEN}</span>
          <span className="pq-cnt" style={{ left: 258 - 14, '--cntd': still ? '0s' : '1.45s' }}>{OVER}</span>
        </>)}

        {!lock && !allPlaced && <span className="pq-hint">{t.drag}</span>}

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '44px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '52px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>

      {/* Variantlar: yashiklar yopilgach — yig'indini xayolan hisoblab tanlash. */}
      {allPlaced && !ok && (<>
        {!lock && <div className="pq-pick">{t.pick}</div>}
        <div className="pq-sgs">
          {OPTS.map((n) => (
            <button key={n} type="button" className={'pq-sg' + (picked === n ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
          ))}
        </div>
      </>)}
      {ok && (
        <div className="pq-sgs">
          {OPTS.map((n) => (
            <button key={n} type="button" className={'pq-sg' + (n === TARGET ? ' winner' : '')} disabled>{n}</button>
          ))}
        </div>
      )}

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>+</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} + {GAP} + {OVER} = {TEN} + {OVER}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
