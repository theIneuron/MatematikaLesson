// Dars17 · Amaliyot 10 — NEW «O'tkazib qo'sh!» · 🔴 · tag: cross_ten_fill
// Shirinlik do'koni. IKKI ten-frame quti. 1-quti (5×2=10): sakkizta shirinlik, ikki uya bo'sh.
// 2-quti (5×2=10): bo'sh. Pastda beshta yakka shirinlik. Bola yakka shirinlikni bosadi →
// u AVTOMATIK keyingi bo'sh uyaga tushadi: avval 1-qutining ikki bo'sh uyasini to'ldiradi (→10),
// keyin 2-qutiga o'tadi (uch dona). Make-ten VIZUAL: 1-quti AVVAL to'ladi, keyin 2-quti — bola
// strategiyani ko'radi. Hisoblagich "8 + N". Beshtasi qo'yilganda jami 13 → «Tekshir».
// VEDI-DO-VERNOGO: kam qo'ysa qulf yo'q, davom etadi; check jami<13 bo'lsa yo'l ko'rsatiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const START = 8, ADD = 5, TARGET = 13, TEN = 10;
// To'ldirish tartibi (global uya indekslari): avval 1-quti (8,9), keyin 2-quti (10,11,12).
const FILL_ORDER = [8, 9, 10, 11, 12];
const DATA = { a: START, b: ADD, target: TARGET, ptype: 'NEW', level: '🔴', tag: 'cross_ten_fill' };

// Shirinlik ranglari (palitradan, aylanma): qizil / ko'k / sariq / yashil / pushti.
const PAL = [
  { light: '#f28e88', main: '#e2635b', dark: '#c0433c' }, // qizil
  { light: '#7fb2e6', main: '#4a90d9', dark: '#2f6fb5' }, // ko'k
  { light: '#f8cd6c', main: '#f2b134', dark: '#cf9421' }, // sariq
  { light: '#84c47c', main: '#57a84f', dark: '#42843b' }, // yashil
  { light: '#f0a3c6', main: '#e879a6', dark: '#c85787' }, // pushti
];
// Beshta yakka shirinlik ranglari (palitradan davomi).
const LOOSE = Array.from({ length: ADD }).map((_, k) => ({ k, c: PAL[(START + k) % PAL.length] }));

// Uyaning holati: preset (1-qutida boshdanoq), yoki qo'yilgan (added > tartib), yoki bo'sh.
function slotState(gi, added) {
  if (gi < START) return { filled: true, preset: true, c: PAL[gi % PAL.length], j: -1 };
  const j = FILL_ORDER.indexOf(gi);
  if (j >= 0 && added > j) return { filled: true, preset: false, c: LOOSE[j].c, j };
  return { filled: false, j };
}

const T = {
  uz: {
    eyebrow: "Shirinlik do'koni · O'tkazib qo'sh", title: "O'tkazib qo'sh!",
    setup: "1-qutida sakkizta shirinlik bor, ikki uya bo'sh. 2-quti butunlay bo'sh. Pastda yana beshta shirinlik turibdi.",
    ask: "Shirinliklarni bosing — avval 1-quti o'nga to'lsin, keyin ortig'i 2-qutiga o'tsin.",
    correct: "Barakalla! Sakkizga ikki qo'shsangiz — o'n, yana uch — o'n uch. Jami sakkiz qo'shuv besh — o'n uch!",
    hintFew: "Hali hammasi qo'yilmadi, davom eting. Qolgan shirinliklarni birma-bir bosing.",
    hint: "Avval 1-qutini o'nga to'ldiring, keyin ortig'ini 2-qutiga qo'ying.",
    tapHint: "Shirinlikni bosing",
    box1: "1-quti", box2: "2-quti",
    chip: "8 + 5 = 13",
    btn: "Tekshir",
  },
  ru: {
    eyebrow: 'Магазин сладостей · Перенеси', title: 'Перенеси через десяток!',
    setup: 'В первой коробке восемь конфет, две ячейки пустые. Вторая коробка совсем пустая. Внизу лежат ещё пять конфет.',
    ask: 'Нажимай на конфеты — сначала заполни первую коробку до десяти, потом остаток перейдёт во вторую.',
    correct: 'Молодец! Восемь плюс два — десять, ещё три — тринадцать. Всего восемь плюс пять — тринадцать!',
    hintFew: 'Ещё не все выложены, продолжай. Нажимай оставшиеся конфеты по одной.',
    hint: 'Сначала заполни первую коробку до десяти, потом клади остаток во вторую.',
    tapHint: 'Нажимай на конфету',
    box1: 'Коробка 1', box2: 'Коробка 2',
    chip: '8 + 5 = 13',
    btn: 'Проверить',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// SHIRINLIK KANONI (yakka birlik): yumaloq yaltiroq konfet — radial 2-ton doira + oq blik +
// ikki tomonda burama o'ram (yengil detal). Bitta konfet = bitta birlik. Rang palitradan.
const Candy = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 44 30" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M11 15 L3 8 Q1 15 3 22 Z" fill={c.dark} />
    <path d="M11 15 L4.5 10 Q3.6 15 4.5 20 Z" fill={c.main} opacity="0.8" />
    <path d="M33 15 L41 8 Q43 15 41 22 Z" fill={c.dark} />
    <path d="M33 15 L39.5 10 Q40.4 15 39.5 20 Z" fill={c.main} opacity="0.8" />
    <circle cx="22" cy="15" r="12" fill={c.main} />
    <circle cx="22" cy="15" r="12" fill="none" stroke={c.dark} strokeWidth="1.1" opacity="0.55" />
    <path d="M22 3 A12 12 0 0 1 34 15 A12 12 0 0 1 22 3 Z" fill={c.light} opacity="0.55" />
    <ellipse cx="17.5" cy="10.5" rx="4.2" ry="2.8" fill="#ffffff" opacity="0.72" transform="rotate(-28 17.5 10.5)" />
    <circle cx="26" cy="19" r="1.5" fill="#ffffff" opacity="0.4" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const BOX1 = Array.from({ length: TEN }).map((_, i) => i);        // global 0..9
const BOX2 = Array.from({ length: TEN }).map((_, i) => TEN + i);  // global 10..19

export default function D17_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [added, setAdded] = useState(0); // qo'yilgan yakka shirinliklar soni 0..5
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda pop-anim qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const total = START + added;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const p = initialAnswer.studentAnswer.placed;
      if (typeof p === 'number') setAdded(Math.max(0, Math.min(p, ADD)));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(added === ADD && !checked); }, [added, checked, onReady]);

  const lock = isReview || checked;
  const place = () => {
    if (lock || added >= ADD) return;
    setAdded((prev) => Math.min(prev + 1, ADD));
    setFeedback(null);
  };

  const check = useCallback(() => {
    const sum = START + added;
    const correct = sum === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : (sum < TARGET ? t.hintFew : t.hint) });
    if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(TARGET)], studentAnswer: { placed: added }, correctAnswer: { placed: ADD }, correct, meta: { ...DATA } });
  }, [added, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const box1Full = added >= 2; // 1-quti o'nga to'ldi

  return (
    <div className="pq pq1710">
      <style>{`
        .pq1710{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1710 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d1567f;text-transform:uppercase;}
        .pq1710 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1710 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1710 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1710 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:11px 10px 14px;border-radius:22px;background:linear-gradient(#fdeaf2,#f7dbe6);border:2px solid #f0cad9;}
        .pq1710 .pq-scene{position:relative;width:372px;max-width:100%;height:328px;border-radius:18px;background:linear-gradient(#fff2dc 0%,#fbe6c2 55%,#f4d6a6 100%);border:2px solid #ecd4a8;overflow:hidden;}
        .pq1710 .pq-window{position:absolute;top:12px;right:14px;width:52px;height:40px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #c69a5a;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1710 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#c69a5a;transform:translateX(-1px);}
        .pq1710 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#c69a5a;transform:translateY(-1px);}
        .pq1710 .pq-sun{position:absolute;top:18px;right:22px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 15px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1710 .pq-lamp{position:absolute;left:40px;top:0;width:2px;height:20px;background:#9c6a2e;z-index:1;}
        .pq1710 .pq-lampshade{position:absolute;left:27px;top:18px;width:28px;height:14px;border-radius:0 0 42% 42%/0 0 100% 100%;background:linear-gradient(#f9dd8e,#e6ae42);border:1.5px solid #c08a34;z-index:1;box-shadow:0 11px 24px 6px rgba(255,216,110,.4);animation:pqLamp 3.2s ease-in-out infinite;}
        .pq1710 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#e6799f,#cf5680);border:2.5px solid #a83c63;color:#fff3f7;font-size:12px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1710 .pq-board::before,.pq1710 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:7px;background:#a83c63;}
        .pq1710 .pq-board::before{left:18px;} .pq1710 .pq-board::after{right:18px;}
        /* hisoblagich: "8 + N" yoki g'alaba chip "8 + 5 = 13" */
        .pq1710 .pq-tot{position:absolute;top:40px;left:50%;transform:translateX(-50%);z-index:8;padding:3px 16px;border-radius:12px;background:#fff;color:#374151;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 3px 8px rgba(0,0,0,.16);white-space:nowrap;transition:.15s;}
        .pq1710 .pq-tot.chip{color:#1a7f43;box-shadow:0 4px 12px rgba(26,127,67,.24);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        /* peshtaxta */
        .pq1710 .pq-counter{position:absolute;left:0;right:0;bottom:0;height:24px;background:linear-gradient(#d29a5e,#b1783e 60%,#966032);border-top:3px solid #e0ab68;z-index:1;}
        .pq1710 .pq-counter::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.22);}
        /* ten-frame qutilar */
        .pq1710 .pq-box{position:absolute;left:50%;transform:translateX(-50%);padding:8px 9px 9px;border-radius:14px;z-index:4;}
        .pq1710 .pq-box.b1{top:74px;background:linear-gradient(#f0d9b6,#e2be8c);border:2.5px solid #c79a5c;box-shadow:0 6px 13px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.4);}
        .pq1710 .pq-box.b1.full{border-color:#1a7f43;box-shadow:0 6px 16px rgba(26,127,67,.28),inset 0 2px 0 rgba(255,255,255,.4);}
        .pq1710 .pq-box.b2{top:196px;background:linear-gradient(#f3e3cb,#e7d0aa);border:2.5px dashed #c79a5c;box-shadow:0 6px 13px rgba(0,0,0,.14),inset 0 2px 0 rgba(255,255,255,.35);}
        .pq1710 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq1710 .pq-blabel{position:absolute;top:-1px;left:-2px;transform:translateY(-100%);font-size:10.5px;font-weight:800;color:#9a6a2e;background:rgba(255,255,255,.7);padding:1px 7px;border-radius:7px;letter-spacing:.02em;}
        .pq1710 .pq-box.b1.full .pq-blabel{color:#1a7f43;}
        .pq1710 .pq-grid{display:grid;grid-template-columns:repeat(5,28px);grid-auto-rows:26px;gap:5px;}
        .pq1710 .pq-cell{position:relative;border-radius:8px;box-sizing:border-box;}
        .pq1710 .pq-cell.candy{background:rgba(255,250,240,.55);border:1.5px solid rgba(150,96,50,.3);}
        .pq1710 .pq-cell.empt{border:1.5px dashed rgba(150,96,50,.5);background:rgba(255,255,255,.24);}
        .pq1710 .pq-cw{position:absolute;inset:3px 4px;line-height:0;}
        .pq1710 .pq-cw.pop{animation:pqFill .42s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1710 .pq-plus{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:15px;font-weight:900;color:#b07a34;opacity:.4;}
        .pq1710 .pq-cnt{position:absolute;top:-7px;right:-5px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:7;}
        .pq1710 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1710 .pq-wstar.w2{animation-delay:-.5s;} .pq1710 .pq-wstar.w3{animation-delay:-1.05s;}
        /* yakka shirinliklar laganchasi */
        .pq1710 .pq-tray{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:16px;background:linear-gradient(#fbe6c2,#f2d3a2);border:2px solid #e6c592;box-shadow:inset 0 2px 4px rgba(120,74,32,.12);min-height:52px;}
        .pq1710 .pq-loose{width:38px;height:28px;border:none;background:none;padding:0;cursor:pointer;line-height:0;position:relative;transition:transform .12s,filter .2s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18));animation:pqShimmer 2.4s ease-in-out infinite;}
        .pq1710 .pq-loose:nth-child(2){animation-delay:-.5s;} .pq1710 .pq-loose:nth-child(3){animation-delay:-1s;}
        .pq1710 .pq-loose:nth-child(4){animation-delay:-1.5s;} .pq1710 .pq-loose:nth-child(5){animation-delay:-2s;}
        .pq1710 .pq-loose:hover:not(:disabled){transform:translateY(-3px) scale(1.08);}
        .pq1710 .pq-loose:active:not(:disabled){transform:scale(.9);}
        .pq1710 .pq-loose:disabled{cursor:default;}
        .pq1710 .pq-trayempty{font-size:13px;font-weight:800;color:#a5773e;}
        .pq1710 .pq-taphint{font-size:12.5px;font-weight:800;color:#a5476b;}
        /* Tekshir tugmasi */
        .pq1710 .pq-check{padding:9px 30px;border-radius:14px;border:2.5px solid #2f6f3a;background:linear-gradient(#3f9a4e,#2f7d3c);color:#fff;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #235c2c;transition:.12s;font-family:inherit;letter-spacing:.02em;}
        .pq1710 .pq-check:hover:not(:disabled){transform:translateY(-2px);}
        .pq1710 .pq-check:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #235c2c;}
        .pq1710 .pq-check:disabled{background:#ded8ca;border-color:#c3bdb0;color:#8f8a7f;box-shadow:0 3px 0 #c3bdb0;cursor:default;}
        .pq1710 .pq-check.ready{animation:pqPulseBtn 1.4s ease-in-out infinite;}
        .pq1710 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1710 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1710 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqFill{0%{opacity:0;transform:translateY(-14px) scale(.5);}60%{opacity:1;transform:translateY(2px) scale(1.08);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqShimmer{0%,100%{filter:drop-shadow(0 2px 3px rgba(0,0,0,.18)) brightness(1);}50%{filter:drop-shadow(0 3px 5px rgba(0,0,0,.22)) brightness(1.09);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqPulseBtn{0%,100%{transform:translateY(0);box-shadow:0 3px 0 #235c2c;}50%{transform:translateY(-2px);box-shadow:0 5px 13px rgba(47,125,60,.42);}}
        @keyframes pqBoxCele{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.04);}60%{transform:translateX(-50%) scale(.98);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-lamp" /><span className="pq-lampshade" />
          <span className="pq-window" /><span className="pq-sun" />
          <div className="pq-board">{t.title}</div>

          {/* hisoblagich: "8 + N" yoki g'alaba chip "8 + 5 = 13" */}
          {ok ? (
            <span className="pq-tot chip">{t.chip}</span>
          ) : (
            <span className="pq-tot">{START} + {added}</span>
          )}

          {/* 1-quti (avval o'nga to'ladi) */}
          <div className={'pq-box b1' + (ok ? ' win' : '') + (box1Full ? ' full' : '')}>
            <span className="pq-blabel">{t.box1}</span>
            <div className="pq-grid">
              {BOX1.map((gi) => {
                const s = slotState(gi, added);
                if (s.filled) {
                  const isNew = !s.preset;
                  return (
                    <div key={gi} className="pq-cell candy">
                      <span className={'pq-cw' + (isNew && !still ? ' pop' : '')}>
                        <Candy c={s.c} />
                        {ok && <b className="pq-cnt">{gi + 1}</b>}
                      </span>
                    </div>
                  );
                }
                return <div key={gi} className="pq-cell empt" aria-hidden="true"><span className="pq-plus">+</span></div>;
              })}
            </div>
          </div>

          {/* 2-quti (ortig'i o'tadi) */}
          <div className={'pq-box b2' + (ok ? ' win' : '')}>
            <span className="pq-blabel">{t.box2}</span>
            <div className="pq-grid">
              {BOX2.map((gi) => {
                const s = slotState(gi, added);
                if (s.filled) {
                  return (
                    <div key={gi} className="pq-cell candy">
                      <span className={'pq-cw' + (!still ? ' pop' : '')}>
                        <Candy c={s.c} />
                        {ok && <b className="pq-cnt">{gi + 1}</b>}
                      </span>
                    </div>
                  );
                }
                return <div key={gi} className="pq-cell empt" aria-hidden="true"><span className="pq-plus">+</span></div>;
              })}
            </div>
          </div>

          <span className="pq-counter" />

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '18%', top: '150px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '80%', top: '160px' }}><Star fill="#e879a6" /></span>
              <span className="pq-wstar w3" style={{ left: '50%', top: '116px' }}><Star fill="#4a90d9" /></span>
            </>
          )}
        </div>

        {/* yakka shirinliklar laganchasi — bosilsa keyingi bo'sh uyaga tushadi */}
        {!ok && (
          <div className="pq-tray">
            {added < ADD
              ? LOOSE.slice(added).map((L) => (
                  <button key={L.k} type="button" className="pq-loose" disabled={lock} onClick={place} aria-label={t.tapHint}>
                    <Candy c={L.c} />
                  </button>
                ))
              : <span className="pq-trayempty">✓</span>}
            {!lock && added < ADD && <span className="pq-taphint">{t.tapHint}</span>}
          </div>
        )}

        {!ok && (
          <button type="button" className={'pq-check' + (added === ADD ? ' ready' : '')} disabled={lock} onClick={() => checkRef.current()}>{t.btn}</button>
        )}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
