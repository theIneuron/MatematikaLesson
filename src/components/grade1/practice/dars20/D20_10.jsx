// Dars20 · Amaliyot 10 — DRAG ayirish «Mashinalarni chiqar!» · 🔴 YANGI · tag: drag_sub
// Sahna: Garaj. Ten-frame garajda o'nta mashina + yo'lakchada uchta = o'n uchta. Bola mashinani
// BARMOQ bilan sudrab yo'lga (chiqish zonasi) tashlaydi → mashina g'ildiragi aylanib chiqib ketadi.
// AYNAN beshta mashina chiqarilsa — sakkizta qoladi. Hisoblagich "13 − N". CAP=5: beshta chiqqach qolmaydi.
// Make-ten-sub: 13 − 5 = 13 − 3 − 2 = 10 − 2 = 8 (avval yo'lakchadagi uch birlik, keyin o'nlikdan ikki).
// VEDI-DO-VERNOGO: kam chiqarsa qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// DRAG: pointer + zoom kompensatsiyasi (s = rect.width/offsetWidth) + zona-drop (D18_10 / D05_05 naqshi).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 13, B = 5, TARGET = 8, TEN = 10;
const UNITS = A - TEN;      // 3 — yo'lakchadagi birliklar (avval shular chiqadi)
const FROMTEN = B - UNITS;  // 2 — o'nlikdan chiqadigan qism
const CAP = B;              // 5 — ko'pi bilan shuncha mashina chiqariladi
const DATA = { a: A, b: B, target: TARGET, ptype: 'NEW', level: '🔴', tag: 'drag_sub' };
const IDS = Array.from({ length: A }).map((_, i) => i); // 13 mashina
// Restore uchun kanonik chiqarish tartibi: avval yo'lakcha (10,11,12), keyin o'nlikdan (9,8).
const ORDER = [10, 11, 12, 9, 8];

// Sahna geometriyasi (piksel, zoomdan mustaqil).
const W = 344, H = 262, CW = 34, R = 17, RY = 11;
function garageCenter(i) { const col = i % 5, row = (i / 5) | 0; return { cx: 28 + col * 36, cy: 70 + row * 36 }; }
function walkCenter(k) { return { cx: 230 + k * 34, cy: 90 }; }
function homeCenter(id) { return id < TEN ? garageCenter(id) : walkCenter(id - TEN); }
const DRIVE = { cx: 70, cy: 236 }; // yo'lda haydab ketish boshlanish nuqtasi

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];
const carColor = (id) => PAL[id % PAL.length];

const T = {
  uz: {
    eyebrow: 'Garaj · Ayirish', title: 'Beshta mashinani chiqaring',
    setup: '13 mashinadan 5 tasi chiqib ketadi.',
    ask: '13 − 5 nechaga teng?',
    correct: 'Barakalla! O\'n uchdan uchtasi chiqib o\'nta qoldi, yana ikkitasi chiqdi — sakkizta. 13 − 5 = 8.',
    hint: 'Avval yo\'lakchadagi uchta mashinani chiqaring — o\'nta qoladi. Beshdan uchtasi ketdi, o\'nlikdan yana ikkitasini chiqaring.',
    drag: 'Mashinani yo\'lga suring',
    exit: 'Chiqish',
  },
  ru: {
    eyebrow: 'Гараж · Вычитание', title: 'Выведи пять машин',
    setup: 'Из 13 машин выезжают 5.',
    ask: 'Сколько будет 13 − 5?',
    correct: 'Молодец! Из тринадцати выехали три — осталось десять, ещё две выехали — восемь. 13 − 5 = 8.',
    hint: 'Сначала выведи три машины с дорожки — останется десять. Из пяти выехали три, ещё две выведи из десятка.',
    drag: 'Перетащи машину на дорогу',
    exit: 'Выезд',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (radial 2-ton) + oyna + tom-tirqish +
// 2 g'ildirak (aylanadi) + fara. Bitta mashina = bitta birlik. Rang palitradan.
let __gid = 0;
const Car = ({ c, size = CW }) => {
  const id = 'd2010c' + (__gid++);
  return (
    <svg viewBox="0 0 46 28" width={size} height={size * 28 / 46} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="100%" stopColor={c.main} />
        </linearGradient>
      </defs>
      {/* tana */}
      <path d="M5 22 L5 16 Q5 14 8 13.5 L14 13.5 L18 7.5 Q19.2 6 22 6 L28 6 Q31 6 32.2 9 L34.5 13.5 L39 14.5 Q41.5 15 41.5 17.5 L41.5 22 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth="1.2" strokeLinejoin="round" />
      {/* oynalar */}
      <path d="M19.4 9 Q20.3 7.5 22 7.5 L27.6 7.5 Q29.6 7.5 30.6 10 L32 13 L19.4 13 Z" fill="#cfe8fb" stroke={c.dark} strokeWidth=".6" />
      <line x1="25.6" y1="7.7" x2="25.6" y2="13" stroke={c.dark} strokeWidth="1" />
      {/* pastki 2-ton yo'lak */}
      <path d="M5 22 L5 19.4 L41.5 19.4 L41.5 22 Z" fill={c.dark} opacity=".45" />
      {/* fara */}
      <circle cx="41" cy="17.4" r="1.5" fill="#fff2b0" stroke={c.dark} strokeWidth=".4" />
      {/* g'ildiraklar (harakatda aylanadi) */}
      <g className="pqw"><circle cx="13" cy="22" r="4.6" fill="#2b3038" /><circle cx="13" cy="22" r="1.9" fill="#c2c9d3" /><line x1="13" y1="17.8" x2="13" y2="26.2" stroke="#8b93a0" strokeWidth=".8" /><line x1="8.8" y1="22" x2="17.2" y2="22" stroke="#8b93a0" strokeWidth=".8" /></g>
      <g className="pqw"><circle cx="33" cy="22" r="4.6" fill="#2b3038" /><circle cx="33" cy="22" r="1.9" fill="#c2c9d3" /><line x1="33" y1="17.8" x2="33" y2="26.2" stroke="#8b93a0" strokeWidth=".8" /><line x1="28.8" y1="22" x2="37.2" y2="22" stroke="#8b93a0" strokeWidth=".8" /></g>
    </svg>
  );
};

export default function D20_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [removedIds, setRemovedIds] = useState([]); // chiqarilgan mashina id'lari (tartibda)
  const [drag, setDrag] = useState(null);           // { id, x, y } — sudralayotgan mashina (sahna-lokal koord.)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  // Review yoki qayta ochilishda haydash-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const removed = removedIds.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const r = initialAnswer.studentAnswer.removed;
      if (typeof r === 'number') setRemovedIds(ORDER.slice(0, Math.min(Math.max(r, 0), CAP)));
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(removed === CAP && !checked); }, [removed, checked, onReady]);

  const lock = isReview || checked;

  // Sudrash — pointer + zoom kompensatsiyasi (s = rect.width/offsetWidth).
  const pt = (e) => {
    const el = stageRef.current; const r = el.getBoundingClientRect();
    const s = r.width / (el.offsetWidth || 1);
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };
  const putDrag = (v) => { dragRef.current = v; setDrag(v); };
  const onDown = (id, e) => {
    if (lock || removed >= CAP || removedIds.includes(id)) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = pt(e); putDrag({ id, x: p.x, y: p.y }); setFeedback(null);
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const p = pt(e); putDrag({ ...dragRef.current, x: p.x, y: p.y });
  };
  // Drop = yo'l (chiqish zonasi)ga tashlansa → mashina chiqib ketadi; aks holda o'z joyiga qaytadi.
  const inRoad = (x, y) => y >= 204 && x >= 4 && x <= W - 4;
  const onUp = (e) => {
    const d = dragRef.current; if (!d) return;
    const p = pt(e);
    if (inRoad(p.x, p.y)) setRemovedIds((prev) => (prev.includes(d.id) || prev.length >= CAP ? prev : [...prev, d.id]));
    putDrag(null);
  };

  const check = useCallback(() => {
    const correct = removedIds.length === CAP; // aynan beshtasi chiqarilsa → sakkizta qoladi
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ['8'], studentAnswer: { removed: removedIds.length }, correctAnswer: { removed: CAP }, correct, meta: { ...DATA } });
  }, [removedIds, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // G'alabada qolgan mashinalarga 1..8 sanoq raqami.
  const winNo = {};
  if (ok) { let n = 0; IDS.forEach((id) => { if (!removedIds.includes(id)) winNo[id] = ++n; }); }

  return (
    <div className="pq pq2010">
      <style>{`
        .pq2010{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2010 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a6193;text-transform:uppercase;}
        .pq2010 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2010 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2010 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2010 .pq-stage{position:relative;width:${W}px;max-width:100%;height:${H}px;margin:0 auto;border-radius:20px;background:linear-gradient(#dbeefb 0%,#e8f0f8 54%,#eef1f4 100%);border:2px solid #cdd9e6;overflow:hidden;touch-action:none;}
        .pq2010 .pq-sun{position:absolute;top:14px;right:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2010 .pq-board{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:7;padding:3px 15px 4px;border-radius:9px;background:linear-gradient(#4f7fb2,#3a6193);border:2.5px solid #2c4c74;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2010 .pq-count{position:absolute;top:34px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2px solid #b8cbe2;color:#2f6bab;font-weight:900;font-size:15px;padding:2px 14px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(0,0,0,.12);white-space:nowrap;}
        .pq2010 .pq-chip{position:absolute;top:30px;left:50%;transform:translateX(-50%);z-index:9;font-size:20px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both,pqFloat 3s ease-in-out .6s infinite;white-space:nowrap;}
        .pq2010 .pq-garage{position:absolute;left:8px;top:50px;width:196px;height:74px;border-radius:10px 10px 6px 6px;background:linear-gradient(#e7eaef,#d3d9e2);border:2.5px solid #9aa6b6;box-shadow:inset 0 2px 0 rgba(255,255,255,.5);z-index:2;}
        .pq2010 .pq-garage::before{content:'';position:absolute;left:-8px;right:-8px;top:-13px;height:15px;background:linear-gradient(#c0553f,#9c3f2c);border-radius:6px 6px 0 0;border:2px solid #7d3121;box-shadow:0 2px 3px rgba(0,0,0,.18);}
        .pq2010 .pq-cell{position:absolute;width:30px;height:22px;border-radius:5px;background:rgba(255,255,255,.34);border:1.4px dashed rgba(90,110,140,.5);box-shadow:inset 0 1px 2px rgba(60,80,110,.14);z-index:3;}
        .pq2010 .pq-cell.full{border-style:solid;border-color:rgba(90,110,140,.28);background:rgba(255,255,255,.16);}
        .pq2010 .pq-walk{position:absolute;left:212px;top:70px;width:128px;height:40px;border-radius:9px;background:repeating-linear-gradient(90deg,#c9d2dd 0 12px,#dbe2ea 12px 24px);border:2px solid #a9b4c2;z-index:2;box-shadow:inset 0 1px 0 rgba(255,255,255,.4);}
        .pq2010 .pq-walk-lbl{position:absolute;left:212px;top:56px;z-index:3;font-size:10px;font-weight:800;color:#6b7787;letter-spacing:.02em;}
        .pq2010 .pq-road{position:absolute;left:0;right:0;bottom:0;height:48px;background:linear-gradient(#5b6472,#454d59);border-top:3px solid #2f3540;z-index:1;}
        .pq2010 .pq-road::after{content:'';position:absolute;left:0;right:0;top:22px;height:3px;background:repeating-linear-gradient(90deg,#f4d24a 0 16px,transparent 16px 34px);}
        .pq2010 .pq-exit{position:absolute;right:8px;bottom:26px;z-index:4;font-size:11px;font-weight:900;color:#0f2340;background:#f4d24a;border:2px solid #caa620;padding:1px 8px 2px;border-radius:6px;letter-spacing:.02em;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.2);}
        .pq2010 .pq-light{position:absolute;right:14px;top:132px;width:15px;height:34px;border-radius:5px;background:#20252e;border:2px solid #12151b;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;box-shadow:0 2px 4px rgba(0,0,0,.25);}
        .pq2010 .pq-light span{width:8px;height:8px;border-radius:50%;background:#3a3f49;}
        .pq2010 .pq-light .r{background:#e0493c;} .pq2010 .pq-light .g{background:#3fbf5b;box-shadow:0 0 6px 1px rgba(63,191,91,.7);animation:pqBlink 1.4s steps(1,end) infinite;}
        .pq2010 .pq-car{position:absolute;width:${CW}px;height:${CW * 28 / 46}px;z-index:5;touch-action:none;user-select:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.22));transition:left .16s ease,top .16s ease;}
        .pq2010 .pq-car.grab{cursor:grab;}
        .pq2010 .pq-car.drag{transition:none;z-index:12;cursor:grabbing;filter:drop-shadow(0 6px 7px rgba(0,0,0,.3));}
        .pq2010 .pq-car.drive{transition:none;z-index:6;pointer-events:none;animation:pqDrive .95s ease-in forwards;}
        .pq2010 .pq-car.win{animation:pqCele .55s ease both;}
        .pq2010 .pqw{transform-box:fill-box;transform-origin:center;}
        .pq2010 .pq-car.moving .pqw{animation:pqSpin .45s linear infinite;}
        .pq2010 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:16px;height:16px;padding:0 3px;border-radius:999px;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:8;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq2010 .pq-hint{position:absolute;top:60px;left:50%;transform:translateX(-50%);z-index:9;font-size:12.5px;font-weight:700;color:#274063;background:rgba(255,255,255,.92);padding:3px 12px;border-radius:999px;animation:pqBob 1.8s ease-in-out infinite;white-space:nowrap;}
        .pq2010 .pq-spark{position:absolute;z-index:10;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2010 .pq-spark.s2{animation-delay:-.6s;} .pq2010 .pq-spark.s3{animation-delay:-1.15s;}
        .pq2010 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq2010 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2010 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2010 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2010 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}
        .pq2010 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2010 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2010 .pq-fb.no{background:#fdecec;color:#c0392b;}
        .pq2010 .pq-board,.pq2010 .pq-count,.pq2010 .pq-chip,.pq2010 .pq-hint,.pq2010 .pq-walk-lbl,.pq2010 .pq-exit,.pq2010 .pq-spark,.pq2010 .pq-cnt,.pq2010 .pq-light{pointer-events:none;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqDrive{0%{transform:translateX(0);opacity:1;}55%{opacity:1;}100%{transform:translateX(300px);opacity:0;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqFloat{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pqBob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.12);}60%{transform:scale(.95);}100%{transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBlink{0%,60%{opacity:1;}61%,100%{opacity:.25;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={stageRef}>
        <div className="pq-sun" />
        <div className="pq-board">{t.title}</div>

        {ok
          ? <span className="pq-chip">{A} {'−'} {B} = {TARGET}</span>
          : <span className="pq-count">{A} {'−'} {removed}</span>}

        {/* Garaj + yo'lakcha (fon) */}
        <div className="pq-garage" />
        <span className="pq-walk-lbl">{t.exit === 'Chiqish' ? 'Yo\'lakcha' : 'Дорожка'}</span>
        <div className="pq-walk" />

        {/* Garaj uyalari (ten-frame) */}
        {IDS.filter((id) => id < TEN).map((id) => {
          const c = garageCenter(id); const full = !removedIds.includes(id);
          return <div key={`cell${id}`} className={'pq-cell' + (full ? ' full' : '')} style={{ left: c.cx - 15, top: c.cy - RY }} />;
        })}

        {/* Svetofor + chiqish belgisi */}
        <div className="pq-light"><span className="r" /><span /><span className="g" /></div>
        <div className="pq-road" />
        <span className="pq-exit">{t.exit} →</span>

        {/* Mashinalar */}
        {IDS.map((id) => {
          const isGone = removedIds.includes(id);
          if (isGone) {
            if (still) return null; // qayta ochishda chiqib ketganlar ko'rinmaydi
            return (
              <div key={id} className="pq-car drive moving" style={{ left: DRIVE.cx - R, top: DRIVE.cy - RY }} aria-hidden="true">
                <Car c={carColor(id)} />
              </div>
            );
          }
          const dragging = drag && drag.id === id;
          const c = dragging ? { cx: drag.x, cy: drag.y } : homeCenter(id);
          const cls = 'pq-car' + (dragging ? ' drag moving' : ' grab') + (ok ? ' win' : '');
          return (
            <div key={id} className={cls} style={{ left: c.cx - R, top: c.cy - RY }}
              onPointerDown={(e) => onDown(id, e)} onPointerMove={onMove} onPointerUp={onUp}
              role="img" aria-label="mashina">
              <Car c={carColor(id)} />
              {ok && <b className="pq-cnt">{winNo[id]}</b>}
            </div>
          );
        })}

        {!lock && removed < CAP && <span className="pq-hint">{t.drag}</span>}

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '58px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '54%', top: '48px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '40%', top: '96px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'−'}</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} {'−'} {UNITS} {'−'} {FROMTEN} = {TEN} {'−'} {FROMTEN}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
