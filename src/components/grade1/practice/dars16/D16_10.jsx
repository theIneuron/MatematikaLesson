// Dars16 · Amaliyot 10 — BILIM TEKSHIRUVI «O'nni to'ldir!» · 🔴 · tag: make_ten_fill
// Shirinlik do'koni. Ten-frame qutida (5×2 = 10 uya) 6 ta shirinlik, 4 uya bo'sh pulslaydi.
// 1-bosqich (harakat): bola bo'sh uyalarni bosib to'ldiradi — jonli hisoblagich YO'Q.
// 2-bosqich (bilim): quti to'lgach QOPQOQ YOPILADI (sanab bo'lmaydi) va 4 variant chiqadi —
// jami XAYOLAN hisoblanadi (6 + 4). Check: to'g'ri → qopqoq ochiladi, sanash-badge'lar,
// chip «6 + 4 = 10», yulduzlar; noto'g'ri → hint, qulf yo'q. onReady faqat variant tanlanganda.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const START = 6, NEED = 4, TARGET = 10, TEN = 10;
const OPTIONS = [8, 9, 10, 11]; // 9/11 — bittaga adashish, 8 — ikki marta adashish
const DATA = { start: START, need: NEED, target: TARGET, options: OPTIONS, ptype: 'NEW', level: '🔴', tag: 'make_ten_fill' };

// Shirinlik ranglari (palitradan, aylanma): qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { light: '#f28e88', main: '#e2635b', dark: '#c0433c' }, // qizil
  { light: '#7fb2e6', main: '#4a90d9', dark: '#2f6fb5' }, // ko'k
  { light: '#f8cd6c', main: '#f2b134', dark: '#cf9421' }, // sariq
  { light: '#84c47c', main: '#57a84f', dark: '#42843b' }, // yashil
  { light: '#f0a3c6', main: '#e879a6', dark: '#c85787' }, // pushti
];

// 10 uya (5×2). Dastlab 0..5 to'la, 6..9 bo'sh (bola shularni to'ldiradi).
const CELLS = Array.from({ length: TEN }).map((_, i) => ({ i, preset: i < START, c: PAL[i % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · To'ldir", title: "O'nni to'ldir!",
    setup: "Qutida 6 ta shirinlik bor, 4 ta joy bo'sh.",
    ask: "Bo'sh uyalarni bosib, qutini to'ldiring.",
    ask2: "Quti yopildi. Ichida jami nechta shirinlik bor?",
    correct: "Barakalla! 6 + 4 = 10. Qutida 10 ta shirinlik!",
    hint: "Xayolan sanang: 6 ta bor edi, siz 4 ta qo'shdingiz.",
    tapHint: "Bo'sh uyalarni bosing",
    chip: "6 + 4 = 10",
  },
  ru: {
    eyebrow: 'Магазин сладостей · Дополни', title: 'Заполни десяток!',
    setup: 'В коробке 6 конфет, 4 места пустые.',
    ask: 'Нажимай на пустые ячейки — заполни коробку.',
    ask2: 'Коробка закрылась. Сколько всего конфет внутри?',
    correct: 'Молодец! 6 + 4 = 10. В коробке 10 конфет!',
    hint: 'Посчитай в уме: было 6, ты добавил 4.',
    tapHint: 'Нажимай на пустые ячейки',
    chip: '6 + 4 = 10',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira + oq blik +
// ikki tomonda burama o'ram (yengil detal). Bitta konfet = bitta birlik. Rang palitradan.
const Candy = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 44 30" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
    {/* chap o'ram burami */}
    <path d="M11 15 L3 8 Q1 15 3 22 Z" fill={c.dark} />
    <path d="M11 15 L4.5 10 Q3.6 15 4.5 20 Z" fill={c.main} opacity="0.8" />
    {/* o'ng o'ram burami */}
    <path d="M33 15 L41 8 Q43 15 41 22 Z" fill={c.dark} />
    <path d="M33 15 L39.5 10 Q40.4 15 39.5 20 Z" fill={c.main} opacity="0.8" />
    {/* asosiy doira */}
    <circle cx="22" cy="15" r="12" fill={c.main} />
    <circle cx="22" cy="15" r="12" fill="none" stroke={c.dark} strokeWidth="1.1" opacity="0.55" />
    <path d="M22 3 A12 12 0 0 1 34 15 A12 12 0 0 1 22 3 Z" fill={c.light} opacity="0.55" />
    {/* oq blik */}
    <ellipse cx="17.5" cy="10.5" rx="4.2" ry="2.8" fill="#ffffff" opacity="0.72" transform="rotate(-28 17.5 10.5)" />
    <circle cx="26" cy="19" r="1.5" fill="#ffffff" opacity="0.4" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D16_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [added, setAdded] = useState([]); // to'ldirilgan bo'sh uya indekslari (6..9)
  const [covered, setCovered] = useState(false); // qopqoq yopiq — variantlar bosqichi
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda pop-anim qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      setAdded(Array.from({ length: NEED }, (_, k) => START + k));
      setCovered(true);
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  // Quti to'lgach — kichik pauza (pop-anim tugashi) va qopqoq yopiladi.
  useEffect(() => {
    if (covered || added.length < NEED) return;
    if (still) { setCovered(true); return; }
    const tm = setTimeout(() => setCovered(true), 750);
    return () => clearTimeout(tm);
  }, [added, covered, still]);
  useEffect(() => { onReady?.(covered && picked !== null && !checked); }, [covered, picked, checked, onReady]);

  const lock = isReview || checked;
  const fill = (i) => {
    if (lock || covered || added.includes(i) || added.length >= NEED) return;
    setAdded((prev) => [...prev, i]);
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint });
    if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask2}`, options: OPTIONS.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1610">
      <style>{`
        .pq1610{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1610 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d1567f;text-transform:uppercase;}
        .pq1610 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1610 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1610 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1610 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:11px 10px 14px;border-radius:22px;background:linear-gradient(#fdeaf2,#f7dbe6);border:2px solid #f0cad9;}
        .pq1610 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:264px;border-radius:18px;background:linear-gradient(#fff2dc 0%,#fbe6c2 55%,#f4d6a6 100%);border:2px solid #ecd4a8;overflow:hidden;}
        .pq1610 .pq-fit{position:relative;margin:0 auto;}
        .pq1610 .pq-window{position:absolute;top:12px;right:14px;width:56px;height:44px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #c69a5a;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1610 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#c69a5a;transform:translateX(-1px);}
        .pq1610 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#c69a5a;transform:translateY(-1px);}
        .pq1610 .pq-sun{position:absolute;top:19px;right:24px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1610 .pq-lamp{position:absolute;left:44px;top:0;width:2px;height:22px;background:#9c6a2e;z-index:1;}
        .pq1610 .pq-lampshade{position:absolute;left:31px;top:20px;width:28px;height:14px;border-radius:0 0 42% 42%/0 0 100% 100%;background:linear-gradient(#f9dd8e,#e6ae42);border:1.5px solid #c08a34;z-index:1;box-shadow:0 11px 24px 6px rgba(255,216,110,.42);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1610 .pq-board{position:absolute;top:11px;left:50%;transform:translateX(-50%);z-index:6;padding:6px 16px 7px;border-radius:10px;background:linear-gradient(#e6799f,#cf5680);border:2.5px solid #a83c63;color:#fff3f7;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1610 .pq-board::before,.pq1610 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#a83c63;}
        .pq1610 .pq-board::before{left:20px;} .pq1610 .pq-board::after{right:20px;}
        /* hisoblagich: "6 + N" yoki g'alaba chip "6 + 4 = 10" */
        .pq1610 .pq-tot{position:absolute;top:48px;left:50%;transform:translateX(-50%);z-index:8;padding:3px 16px;border-radius:12px;background:#fff;color:#374151;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 3px 8px rgba(0,0,0,.16);white-space:nowrap;transition:.15s;}
        .pq1610 .pq-tot.chip{color:#1a7f43;box-shadow:0 4px 12px rgba(26,127,67,.24);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        /* peshtaxta */
        .pq1610 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#d29a5e,#b1783e 60%,#966032);border-top:3px solid #e0ab68;z-index:1;}
        .pq1610 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.22);}
        /* ten-frame quti (5×2), quti/karton */
        .pq1610 .pq-box{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);padding:11px 12px 13px;border-radius:16px;background:linear-gradient(#f0d9b6,#e2be8c);border:2.5px solid #c79a5c;box-shadow:0 7px 15px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.4);z-index:4;}
        .pq1610 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1610 .pq-grid{display:grid;grid-template-columns:repeat(5,44px);grid-auto-rows:38px;gap:6px;}
        .pq1610 .pq-cell{position:relative;border-radius:11px;background:rgba(255,248,235,.5);border:1.6px solid rgba(150,96,50,.35);box-sizing:border-box;padding:0;font:inherit;}
        .pq1610 .pq-cell.candy{background:rgba(255,250,240,.6);}
        button.pq-cell.empt{border-style:dashed;border-color:rgba(150,96,50,.65);background:rgba(255,255,255,.28);cursor:pointer;animation:pqBreath 2.2s ease-in-out infinite;transition:transform .12s;}
        .pq1610 .pq-cell.empt:nth-child(2){animation-delay:-.4s;} .pq1610 .pq-cell.empt:nth-child(4){animation-delay:-.9s;}
        .pq1610 .pq-cell.empt:nth-child(6){animation-delay:-1.3s;} .pq1610 .pq-cell.empt:nth-child(8){animation-delay:-1.7s;}
        .pq1610 .pq-cell.empt:hover:not(:disabled){transform:scale(1.08);border-color:#c07a34;}
        .pq1610 .pq-cell.empt:active:not(:disabled){transform:scale(.94);}
        .pq1610 .pq-cell.empt:disabled{cursor:default;}
        .pq1610 .pq-cw{position:absolute;inset:4px 5px;line-height:0;}
        .pq1610 .pq-cw.pop{animation:pqFill .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1610 .pq-plus{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:19px;font-weight:900;color:#b07a34;opacity:.55;animation:pqQ 1.9s ease-in-out infinite;}
        .pq1610 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:7;}
        /* tap ko'rsatkichi */
        .pq1610 .pq-taphint{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);z-index:5;font-size:12px;font-weight:800;color:#a5476b;background:rgba(255,255,255,.85);padding:3px 12px;border-radius:999px;white-space:nowrap;animation:pqBreathHint 2s ease-in-out infinite;}
        .pq1610 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1610 .pq-wstar.w2{animation-delay:-.5s;} .pq1610 .pq-wstar.w3{animation-delay:-1.05s;}
        /* QOPQOQ — quti to'lgach yopiladi (sanab bo'lmaydi); to'g'rida ochilib ketadi */
        .pq1610 .pq-lid{position:absolute;inset:-2.5px;z-index:7;border-radius:16px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#eccf9f,#d3a866);border:2.5px solid #a97e42;box-shadow:0 4px 9px rgba(0,0,0,.22),inset 0 2px 0 rgba(255,255,255,.4);animation:pqLidClose .45s ease;transition:transform .6s cubic-bezier(.4,0,.3,1),opacity .5s ease .1s;}
        .pq1610 .pq-lid.open{transform:translateY(-96px) rotate(6deg);opacity:0;pointer-events:none;}
        .pq1610 .pq-lid.stillm{animation:none;}
        .pq1610 .pq-lidq{font-size:26px;line-height:1;font-weight:900;color:#7d5626;text-shadow:0 1px 0 rgba(255,255,255,.4);animation:pqQm 1.8s ease-in-out infinite;}
        /* variantlar (xayolan hisoblab tanlash) */
        .pq1610 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;animation:pqIn .3s ease both;}
        .pq1610 .pq-opt{width:68px;height:68px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;font-family:inherit;}
        .pq1610 .pq-opt:hover:not(:disabled){border-color:#dfb271;transform:translateY(-2px);}
        .pq1610 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1610 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1610 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1610 .pq-opt:disabled{cursor:default;}
        @keyframes pqLidClose{from{opacity:0;transform:translateY(-56px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqQm{0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        .pq1610 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1610 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1610 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqFill{0%{opacity:0;transform:translateY(-12px) scale(.55);}60%{opacity:1;transform:translateY(2px) scale(1.08);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqBreath{0%,100%{border-color:rgba(150,96,50,.6);background:rgba(255,255,255,.26);}50%{border-color:#c07a34;background:rgba(255,246,225,.5);}}
        @keyframes pqQ{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5;}50%{transform:translate(-50%,-50%) scale(1.18);opacity:.85;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqBreathHint{0%,100%{transform:translateX(-50%) scale(1);opacity:.9;}50%{transform:translateX(-50%) scale(1.05);opacity:1;}}
        @keyframes pqBoxCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{covered ? t.ask2 : t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 264 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-lamp" /><span className="pq-lampshade" />
          <span className="pq-window" /><span className="pq-sun" />
          <div className="pq-board">{t.title}</div>

          {/* jonli hisoblagich YO'Q (javob sizib chiqmasin); faqat g'alaba chipi */}
          {ok && <span className="pq-tot chip">{t.chip}</span>}

          <div className={'pq-box' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {CELLS.map((s) => {
                const isAdded = added.includes(s.i);
                const show = s.preset || isAdded || ok;
                if (show) {
                  const isNew = isAdded || (ok && !s.preset);
                  return (
                    <div key={s.i} className="pq-cell candy">
                      <span className={'pq-cw' + (isNew && !still ? ' pop' : '')}>
                        <Candy c={s.c} />
                        {ok && <b className="pq-cnt">{s.i + 1}</b>}
                      </span>
                    </div>
                  );
                }
                return (
                  <button key={s.i} type="button" className="pq-cell empt"
                    disabled={lock || covered || added.length >= NEED}
                    onClick={() => fill(s.i)} aria-label="bo'sh uya">
                    <span className="pq-plus">+</span>
                  </button>
                );
              })}
            </div>
            {/* QOPQOQ: quti to'lgach yopiladi — jami xayolan hisoblanadi */}
            {covered && (
              <div className={'pq-lid' + (ok ? ' open' : '') + (still ? ' stillm' : '')} aria-hidden="true">
                <span className="pq-lidq">?</span>
              </div>
            )}
          </div>

          {!lock && !covered && added.length < NEED && <span className="pq-taphint">{t.tapHint}</span>}

          <span className="pq-counter" />

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '26%', top: '90px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '70%', top: '96px' }}><Star fill="#e879a6" /></span>
              <span className="pq-wstar w3" style={{ left: '50%', top: '78px' }}><Star fill="#4a90d9" /></span>
            </>
          )}
        </div>
        </div>

        {covered && (
          <div className="pq-opts">
            {OPTIONS.map((n) => {
              const sel = picked === n; const right = ok && n === TARGET;
              return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
            })}
          </div>
        )}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
