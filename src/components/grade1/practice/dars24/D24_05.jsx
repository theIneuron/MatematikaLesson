// Dars24 · Amaliyot 05 — P13 Zanjir «Olma bog'i» · 🔴 · tag: round_chain
// 4 misol, bittalab to'ldiriladi (ref: D09_06 zanjir naqshi). Metodist 2026-07-09 ([[zanjir-practice-options-2x2]]):
// SAVOL-bloklari 2×2 panjara (1+2 yuqori, 3+4 past) VA har savolда 4 javob varianti BIR QATORDA (2×2 emas —
// «javoblarini bir qator qilib chiq», Dars9 zanjiriga o'xshab). Sahna eniga cho'zilgan.
// Model — YUMALOQ O'NLIKLAR savat bilan (Dars21 kanoni): bir savat = bitta o'nlik = 10 olma.
// Qo'shishda savatlar BIRLASHADI (40 + 30 -> 4 savat va 3 savat = 7 savat = 70); ayirishda savatlar
// OLINADI (60 − 20 -> 6 savatdan 2 tasi ketadi = 4 savat = 40). Bola savatlarni O'NLAB sanaydi.
// Qatorlar (sbornik, Karta 1): 40 + 30 = 70 (70/7/60) · 60 − 20 = 40 (40/4/80) ·
// 50 + 50 = 100 (100/10/90) · 90 − 60 = 30 (30/3/40). Distraktorlar: M1 o'nlikni birlik deb
// (4+3=7), M2 raqamlarni yopishtirish (5+5=10), M4 bitta o'nlikka adashish (60/90/40).
// G'alaba (butun zanjir to'g'ri): savatlar sanaladi / ortiqchasi bog'dan ketadi, chip «A ± B = N»,
// ost-satr «t o'nlik = N». VEDI-DO-VERNOGO: noto'g'ri qator qulflamaydi, retry yo'q; setChecked
// FAQAT butun zanjir to'g'rida. Ayirish belgisi = U+2212 «−».
// Metodist 2026-07-12: karta ichidagi vizuallar juda MAYDA edi (o'qib bo'lmasdi) — savatlar
// kattalashtirildi (w16→w36, guruhda 3 tadan qatorga o'raladi), «10» nishoni yiriklashtirildi,
// sanoq-nishon/ifoda/variant o'lchamlari oshirildi. 2×2 panjara va 4 variant saqlangan.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = "−"; // U+2212 — ayirish belgisi (defis EMAS)
// Har qator: add=true qo'shish, add=false ayirish. ta/tb/tans = o'nliklar soni (son/10).
// 2×2 panjara (metodist 2026-07-09, [[zanjir-practice-options-2x2]]): SAVOL-bloklari 2 tadan
// ikki qatorda (1+2 yuqori, 3+4 past) VA har savolда javob variantlari HAM 2×2 (sonli=4 variant).
// 4-chi DRAFT distraktor (yumaloq o'nlik, javob±10) — metodist validatsiyasini kutadi.
const ROWS = [
  { a: 40, add: true, b: 30, ans: 70, opts: [70, 7, 60, 80] },
  { a: 60, add: false, b: 20, ans: 40, opts: [40, 4, 80, 30] },
  { a: 50, add: true, b: 50, ans: 100, opts: [100, 10, 90, 80] },
  { a: 90, add: false, b: 60, ans: 30, opts: [30, 3, 40, 20] },
].map((r) => ({ ...r, ta: r.a / 10, tb: r.b / 10, tans: r.ans / 10 }));
const DATA = { ptype: "P13", level: "🔴", tag: "round_chain" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir",
    title: "Misollar zanjiri",
    setup: "Har misolni yeching.",
    ask: "To'g'ri javobni tanlang.",
    correct: "Barakalla! Har misolni to'g'ri yechdingiz.",
    hint: "O'nliklarni sanang.",
    tword: "o'nlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка",
    title: "Цепочка примеров",
    setup: "Реши каждый пример.",
    ask: "Выбери верный ответ.",
    correct: "Молодец! Ты верно решил каждый пример.",
    hint: "Считай десятками.",
    tword: "дес.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;
// SAVAT KANONI (bitta o'nlik = 10 olma bir birlikka jamlangan, oldida yashil «10» nishoni).
// Dars21 dan uzviy. Bola savat ichini QAYTA sanamaydi — savat = bitta o'nlik.
const Basket = ({ w = 22 }) => {
  const id = "pq2405b" + (__gid++);
  const ap = id + "ap";
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      {/* olmalar savat ustidan mo'ralaydi */}
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
      </g>
      {/* savat gardishi */}
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      {/* savat tanasi */}
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      {/* ko'ndalang to'qima */}
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      {/* «10» nishoni — yirik, kichik kartada ham o'qiladi (bu savat bitta o'nlik) */}
      <g>
        <circle cx="28" cy="40" r="12" fill="#1a7f43" stroke="#fff" strokeWidth="2" />
        <text x="28" y="45" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

export default function D24_05(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda sanoq/chiqib-ketish animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: ROWS.map((r) => `${r.a} ${r.add ? "+" : M} ${r.b} = ?`),
      studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) },
      correctAnswer: { vals: ROWS.map((r) => r.ans) },
      correct, meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  // Bitta savat katagi (bog' bezagi — bosilmaydi). Qo'shishda hammasi qoladi + sanoq nishoni;
  // ayirishda oxirgi tb savat g'alabada bog'dan chiqib ketadi.
  const crate = ({ key, pos, badge, gone, leaveSeq }) => {
    if (gone) {
      if (ok) {
        if (still) return null; // review: allaqachon ketgan
        return (
          <span key={key} className="pq-crate leave" style={{ "--ld": `${leaveSeq * 0.16}s` }} aria-hidden="true">
            <Basket w={36} />
          </span>
        );
      }
      return (
        <span key={key} className={"pq-crate" + (!still ? " bob" : "")} style={{ "--bb": `${pos * 0.1}s` }} aria-hidden="true">
          <Basket w={36} />
        </span>
      );
    }
    return (
      <span key={key} className={"pq-crate" + (!ok && !still ? " bob" : "")} style={{ "--bb": `${pos * 0.1}s` }} aria-hidden="true">
        <Basket w={36} />
        {ok && <b className="pq-cnt" style={{ "--bd": still ? "0s" : `${0.3 + badge * 0.15}s` }}>{badge + 1}</b>}
      </span>
    );
  };

  return (
    <div className="pq pq2405">
      <style>{`
        .pq2405{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2405 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2405 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2405 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2405 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2405 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#eef8e6,#e6f3d9);border:2px solid #d3e6be;}

        /* ambient bog' lentasi (bezak — bosilmaydi) */
        .pq2405 .pq-scene{position:relative;width:100%;height:66px;border-radius:16px;background:linear-gradient(#d6efff 0%,#e6f4ea 60%,#d8eecb 100%);border:2px solid #cfe0cd;overflow:hidden;}
        .pq2405 .pq-sun{position:absolute;left:16px;top:11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2405sun 3.6s ease-in-out infinite;}
        .pq2405 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.85;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2405sway 4.4s ease-in-out infinite;}
        .pq2405 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2405 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2405 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(#b9d98f,#9cc26e);border-top:3px solid #86ad5c;z-index:1;pointer-events:none;}
        .pq2405 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2405twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2405 .pq-spark.s2{animation-delay:-.6s;} .pq2405 .pq-spark.s3{animation-delay:-1.15s;}

        /* savol-bloklari 2×2 panjara (metodist 2026-07-09): 1+2 yuqori qator, 3+4 past qator */
        .pq2405 .pq-rows{display:grid;grid-template-columns:1fr;gap:9px;width:100%;max-width:360px;align-items:start;}
        @media (min-width:480px){.pq2405 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2405 .pq-rw{display:flex;flex-direction:column;align-items:center;gap:7px;padding:9px 8px;border-radius:16px;border:2.5px solid #cfe0cd;background:#fbfdf9;transition:.15s;}
        .pq2405 .pq-rw.good{border-color:#1a7f43;background:#eef9f1;}
        .pq2405 .pq-rw.good.win{animation:pq2405cele .5s ease;}
        .pq2405 .pq-rw.bad{border-color:#e08a8a;background:#fdf3f3;animation:pq2405shake .35s ease;}

        /* savat sahnasi */
        .pq2405 .pq-cscene{display:flex;align-items:flex-end;justify-content:center;gap:10px;flex-wrap:wrap;min-height:46px;}
        .pq2405 .pq-grp{display:flex;align-items:flex-end;justify-content:center;gap:5px 4px;flex-wrap:wrap;max-width:124px;}
        .pq2405 .pq-crate{position:relative;line-height:0;}
        .pq2405 .pq-crate.bob{animation:pq2405bob 2.8s ease-in-out infinite;animation-delay:var(--bb,0s);}
        .pq2405 .pq-crate.leave{animation:pq2405leave .7s ease-in forwards;animation-delay:var(--ld,0s);}
        .pq2405 .pq-op{font-size:28px;font-weight:900;color:#5c8a3f;align-self:center;flex:0 0 auto;}
        .pq2405 .pq-cnt{position:absolute;top:-12px;left:50%;transform:translateX(-50%);min-width:22px;height:22px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,.25);opacity:0;font-variant-numeric:tabular-nums;animation:pq2405pop .3s both;animation-delay:var(--bd,0s);}

        /* yechim: ifoda ustida, 2×2 variant ostida */
        .pq2405 .pq-solve{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;}
        .pq2405 .pq-eq{display:flex;align-items:center;gap:4px;font-size:20px;font-weight:900;color:#3f5d80;font-variant-numeric:tabular-nums;}
        .pq2405 .pq-eq .a{color:#3f7a52;}
        .pq2405 .pq-eq .mn{color:#a05a2e;}
        .pq2405 .pq-eq .mn.pl{color:#3f8a41;}
        .pq2405 .pq-eq .eqs{color:#8a94a2;}
        .pq2405 .pq-slot{min-width:44px;height:42px;padding:0 6px;border-radius:11px;border:2.5px dashed #bccdb2;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#8aa88f;font-variant-numeric:tabular-nums;}
        .pq2405 .pq-slot.has{border-style:solid;border-color:#8fbfa0;color:#2f7a4f;background:#f2fbf5;}
        .pq2405 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}

        /* variant-tugmalari BIR QATORDA (metodist 2026-07-09, Dars9 zanjiriga o'xshab); ifoda ostida markazlashgan qator */
        .pq2405 .pq-opts{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-content:center;flex-basis:100%;}
        .pq2405 .pq-opt{min-width:46px;height:44px;padding:0 8px;font-size:21px;font-weight:800;border-radius:11px;border:2.5px solid #d3ddca;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2405 .pq-opt:hover:not(:disabled){border-color:#9cc77f;transform:translateY(-2px);}
        .pq2405 .pq-opt:active:not(:disabled){transform:scale(.93);}
        .pq2405 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2405 .pq-opt:disabled{cursor:default;}

        .pq2405 .pq-win{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .pq2405 .pq-chip{padding:5px 14px;border-radius:12px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:19px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pq2405pop2 .35s ease both;}
        .pq2405 .pq-step{font-size:13.5px;font-weight:800;color:#5c8a4f;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pq2405in .3s .12s both;}

        .pq2405 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2405in .22s ease both;}
        .pq2405 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2405 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2405sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2405sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2405bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2405leave{0%{opacity:1;transform:translateY(0) scale(1);}100%{opacity:0;transform:translateY(16px) scale(.68);}}
        @keyframes pq2405pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2405pop2{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2405twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2405cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2405shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2405in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-leaf" style={{ right: "16px", top: "16px" }}>❧</span>
          <span className="pq-leaf l2" style={{ left: "70px", bottom: "16px" }}>❧</span>
          <div className="pq-board">{t.title}</div>
          <span className="pq-ground" />
          {ok && (<>
            <span className="pq-spark" style={{ left: "24%", top: "12px" }}>✦</span>
            <span className="pq-spark s2" style={{ left: "78%", bottom: "14px" }}>✦</span>
            <span className="pq-spark s3" style={{ left: "52%", top: "8px" }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const sign = r.add ? "+" : M;
            const cls = feedback ? (rowRight(i) ? " good" + (ok ? " win" : "") : " bad") : "";
            return (
              <div key={i} className={"pq-rw" + cls}>
                {/* SAVAT MODELI: qo'shishda birlashtiramiz, ayirishda olamiz — o'nlab sanaymiz */}
                <div className="pq-cscene">
                  {r.add ? (<>
                    <div className="pq-grp">
                      {Array.from({ length: r.ta }).map((_, k) => crate({ key: "a" + k, pos: k, badge: k, gone: false }))}
                    </div>
                    <span className="pq-op">+</span>
                    <div className="pq-grp">
                      {Array.from({ length: r.tb }).map((_, k) => crate({ key: "b" + k, pos: r.ta + k, badge: r.ta + k, gone: false }))}
                    </div>
                  </>) : (
                    <div className="pq-grp">
                      {Array.from({ length: r.ta }).map((_, k) => crate({ key: k, pos: k, badge: k, gone: k >= r.tans, leaveSeq: k - r.tans }))}
                    </div>
                  )}
                </div>

                <div className="pq-solve">
                  <div className="pq-eq">
                    <span className="a">{r.a}</span>
                    <span className={"mn" + (r.add ? " pl" : "")}>{sign}</span>
                    <span className="a">{r.b}</span>
                    <span className="eqs">=</span>
                    <div className={"pq-slot" + (vals[i] != null ? " has" : "")}>{vals[i] != null ? vals[i] : "?"}</div>
                  </div>

                  {ok ? (
                    <div className="pq-win">
                      <span className="pq-chip">{r.a} {sign} {r.b} = {r.ans}</span>
                      <span className="pq-step">{r.ta} {sign} {r.tb} = {r.tans} {t.tword} = {r.ans}</span>
                    </div>
                  ) : (
                    <div className="pq-opts">
                      {r.opts.map((n) => (
                        <button key={n} type="button" className={"pq-opt" + (vals[i] === n ? " sel" : "")} disabled={lock}
                          onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
