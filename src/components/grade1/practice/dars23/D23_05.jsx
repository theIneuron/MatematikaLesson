// Dars23 · Amaliyot 05 — Zanjir «Olma bog'i» · sanoq ketma-ketligi (5 lab / 10 lab, oldinga va orqaga) · 🔴 · tag: skip_chain
// 4 qator zanjir, bittalab to'ldiriladi (ref: D20_06 zanjir). Har qatorda TILE-YO'LAK: 4 tayl, bittasi tushib qolgan ('?').
// Bola yetishmagan sonni 3 variantdan tanlaydi. Quyon taylma-tayl sakraydi (dekorativ — bosiladigan nishon EMAS).
// QADAM BIR XIL KANONI: har qatorda qadam o'zgarmaydi — 10 lab yoki 5 lab, oldinga (o'sish) yoki orqaga (kamayish).
// Distraktorlar: M1 birlab sanash (18/28/22), M2 noto'g'ri qadam (25/35), yaqin-adashish. To'g'ri qatorlar ketma-ketligi
// va javoblar 5/10 ga karrali (5..100 doirasida). ANSWER-LEAK yo'q: tushib qolgan tayl g'alabagacha '?' ko'rsatadi,
// qiymat FAQAT g'alabada ochiladi (AnsPop). VEDI-DO-VERNOGO: noto'g'ri qatorda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Har qator: to'liq ketma-ketlik (miss indeksda '?'), 3 variant (o'sish tartibida — pozitsiya-adashishni kamaytiradi).
const ROWS = [
  { seq: [10, 20, null, 40], miss: 2, ans: 30, opts: [25, 30, 35, 45], step: 10, dir: "fwd" },  // 10 lab oldinga
  { seq: [5, 10, 15, null],  miss: 3, ans: 20, opts: [18, 20, 22, 25], step: 5,  dir: "fwd" },  // 5 lab oldinga
  { seq: [50, 40, null, 20], miss: 2, ans: 30, opts: [15, 25, 30, 35], step: 10, dir: "back" }, // 10 lab orqaga
  { seq: [35, 30, null, 20], miss: 2, ans: 25, opts: [22, 23, 25, 28], step: 5,  dir: "back" }, // 5 lab orqaga
];
const DATA = { ptype: "chain", level: "🔴", tag: "skip_chain" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir",
    title: "Sanoq zanjiri",
    setup: "Har qatorni to'ldiring.",
    ask: "Yetishmagan sonni tanlang.",
    correct: "Barakalla! Har qatorni to'g'ri to'ldirdingiz.",
    hint: "Qadam bir xil: 10 lab yoki 5 lab, oldinga yoki orqaga.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка",
    title: "Цепочка счёта",
    setup: "Заполни каждую строку.",
    ask: "Выбери пропущенное число.",
    correct: "Молодец! Ты верно заполнил каждую строку.",
    hint: "Шаг одинаковый: по 10 или по 5, вперёд или назад.",
  },
};

// G'alabada har qator ostidagi qadam-yorlig'i (faqat g'alabada ko'rinadi — leak emas).
const stepLabel = (r, lang) => (lang === "ru"
  ? `по ${r.step} ${r.dir === "fwd" ? "вперёд" : "назад"}`
  : `${r.step} lab ${r.dir === "fwd" ? "oldinga" : "orqaga"}`);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __id = 0;

// YAKKA OLMA (dekor, «Olma bog'i» kanoni — D21_03 dan): yumaloq 2-ton tana + bandak + barg + oq blik.
const Apple = ({ w = 20 }) => {
  const id = "pq2305a" + (__id++);
  return (
    <svg viewBox="0 0 24 26" width={w} height={w * 26 / 24} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// QUYON (dekorativ mascot): sodda 2-ton tana + uzun quloqlar + dumaloq dum + oyoqlar. Taylma-tayl sakraydi.
const Rabbit = ({ w = 30 }) => {
  const id = "pq2305r" + (__id++);
  return (
    <svg viewBox="0 0 40 46" width={w} height={w * 46 / 40} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#f3efe8" /><stop offset="60%" stopColor="#d9d3c8" /><stop offset="100%" stopColor="#bcb3a4" />
        </radialGradient>
      </defs>
      {/* dum */}
      <circle cx="8.5" cy="33" r="3.4" fill="#fff" stroke="#c7bfb0" strokeWidth=".6" />
      {/* quloqlar */}
      <ellipse cx="15.5" cy="10" rx="3.2" ry="8.6" fill={`url(#${id})`} stroke="#b0a795" strokeWidth=".7" transform="rotate(-11 15.5 10)" />
      <ellipse cx="24.5" cy="10" rx="3.2" ry="8.6" fill={`url(#${id})`} stroke="#b0a795" strokeWidth=".7" transform="rotate(11 24.5 10)" />
      <ellipse cx="15.5" cy="11" rx="1.4" ry="5.6" fill="#f6ccd4" transform="rotate(-11 15.5 11)" />
      <ellipse cx="24.5" cy="11" rx="1.4" ry="5.6" fill="#f6ccd4" transform="rotate(11 24.5 11)" />
      {/* tana */}
      <ellipse cx="20" cy="31" rx="12" ry="11.2" fill={`url(#${id})`} stroke="#b0a795" strokeWidth=".8" />
      <ellipse cx="20" cy="34" rx="7" ry="7.4" fill="#fff" opacity=".6" />
      {/* oyoqlar */}
      <ellipse cx="14.5" cy="42.5" rx="4.2" ry="2.4" fill={`url(#${id})`} stroke="#b0a795" strokeWidth=".6" />
      <ellipse cx="25.5" cy="42.5" rx="4.2" ry="2.4" fill={`url(#${id})`} stroke="#b0a795" strokeWidth=".6" />
      {/* bosh */}
      <circle cx="20" cy="20.5" r="8.2" fill={`url(#${id})`} stroke="#b0a795" strokeWidth=".8" />
      <circle cx="17.4" cy="19.6" r="1.5" fill="#3a2f2a" />
      <circle cx="22.6" cy="19.6" r="1.5" fill="#3a2f2a" />
      <circle cx="17" cy="19.1" r=".5" fill="#fff" />
      <circle cx="22.2" cy="19.1" r=".5" fill="#fff" />
      <path d="M18.4 22.4 L21.6 22.4 L20 24 Z" fill="#e6899a" />
    </svg>
  );
};

export default function D23_05(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [vals, setVals] = useState({}); // {rowIdx: tanlangan son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda sakrash/ochilish animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === "boolean") { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => r.seq.map((v) => (v == null ? "?" : v)).join(", ")), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2305">
      <style>{`
        .pq2305{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2305 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2305 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2305 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2305 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2305 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#e8f4de,#dceccf);border:2px solid #c9e0b6;}

        /* orchard bosh-lavha (ambient: quyosh, barglar, olmalar) */
        .pq2305 .pq-scene{position:relative;width:372px;max-width:100%;height:60px;border-radius:16px;background:linear-gradient(#d6efff 0%,#e6f4ea 60%,#d8eecb 100%);border:2px solid #cfe0cd;overflow:hidden;}
        .pq2305 .pq-sun{position:absolute;top:11px;left:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2305sun 3.6s ease-in-out infinite;}
        .pq2305 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.85;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2305sway 4.4s ease-in-out infinite;}
        .pq2305 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2305 .pq-appl{position:absolute;z-index:1;line-height:0;pointer-events:none;animation:pq2305bob 3s ease-in-out infinite;}
        .pq2305 .pq-appl.a2{animation-delay:-1.4s;}
        .pq2305 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:5;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2305 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:13px;pointer-events:none;animation:pq2305tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2305 .pq-spark.s2{animation-delay:-.6s;} .pq2305 .pq-spark.s3{animation-delay:-1.15s;}

        /* qatorlar */
        .pq2305 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;width:100%;}
        .pq2305 .pq-rw{display:flex;gap:11px;align-items:center;justify-content:center;align-content:center;flex-wrap:wrap;min-width:0;padding:7px 10px;border-radius:14px;border:2.5px solid #cfe0cd;background:#fbfdf8;transition:.15s;}
        .pq2305 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2305 .pq-rw.good.win{animation:pq2305cele .5s ease;}
        .pq2305 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2305shake .35s ease;}

        /* tayl-yo'lak + quyon (dekorativ, tayllar ustida sakraydi) */
        .pq2305 .pq-track{position:relative;padding-top:30px;flex:0 0 auto;min-width:0;}
        .pq2305 .pq-tiles{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;}
        .pq2305 .pq-tile{min-width:44px;height:34px;padding:0 7px;border-radius:9px;background:#fff;border:2px solid #cbd6c2;color:#374151;font-size:19px;font-weight:900;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;box-shadow:0 2px 3px rgba(60,80,50,.1);}
        .pq2305 .pq-tile.miss{border-style:dashed;border-color:#9ab6d6;background:#eef4fb;color:#7a97b8;}
        .pq2305 .pq-tile.win{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2305pop .45s ease both;}
        .pq2305 .pq-rabbit{position:absolute;left:6px;top:0;width:30px;line-height:0;z-index:4;pointer-events:none;}
        .pq2305 .pq-rabbit.bob{animation:pq2305hop 2.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq2305 .pq-rabbit.cross{animation:pq2305cross 1.4s ease-in-out both;}

        /* variantlar (bittalab) — bosiladigan nishon, animatsiyasiz */
        .pq2305 .pq-right{display:flex;align-items:center;flex:0 0 auto;flex-basis:100%;justify-content:center;}
        .pq2305 .pq-sgs{display:flex;gap:7px;align-content:center;}
        .pq2305 .pq-sg{min-width:44px;height:46px;padding:0 8px;border-radius:11px;border:2.5px solid #cdd9ea;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2305 .pq-sg:hover:not(:disabled){border-color:#8ab0e0;transform:translateY(-2px);}
        .pq2305 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2305 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2305 .pq-sg:disabled{cursor:default;}
        .pq2305 .pq-chip{display:inline-flex;align-items:center;gap:4px;padding:6px 13px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pq2305pop .35s ease both;}

        .pq2305 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2305in .22s ease both;}
        .pq2305 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2305 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2305sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2305sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2305bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2305hop{0%,100%{transform:translateY(0);}45%{transform:translateY(-5px);}55%{transform:translateY(-5px);}}
        @keyframes pq2305cross{0%{transform:translate(0,0);}12%{transform:translate(6px,-14px);}25%{transform:translate(50px,0);}37%{transform:translate(56px,-14px);}50%{transform:translate(100px,0);}62%{transform:translate(106px,-14px);}75%{transform:translate(150px,0);}100%{transform:translate(150px,0);}}
        @keyframes pq2305pop{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2305tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2305cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2305shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2305in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-leaf" style={{ right: "22px", top: "14px" }}>❧</span>
          <span className="pq-leaf l2" style={{ left: "20px", bottom: "8px" }}>❧</span>
          <span className="pq-appl" style={{ right: "48px", bottom: "8px" }}><Apple w={18} /></span>
          <span className="pq-appl a2" style={{ left: "52px", top: "10px" }}><Apple w={16} /></span>
          <div className="pq-board">{t.title}</div>
          {ok && (<>
            <span className="pq-spark" style={{ left: "14%", top: "12px" }}>✦</span>
            <span className="pq-spark s2" style={{ left: "50%", bottom: "8px" }}>✦</span>
            <span className="pq-spark s3" style={{ left: "80%", top: "10px" }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? " good" + (ok ? " win" : "") : " bad") : "";
            const rabbitCls = still ? "" : (ok ? " cross" : " bob");
            return (
              <div key={i} className={"pq-rw" + cls}>
                <div className="pq-track">
                  <span className={"pq-rabbit" + rabbitCls} style={{ "--rd": `${i * 0.3}s` }}><Rabbit w={30} /></span>
                  <div className="pq-tiles">
                    {r.seq.map((v, ti) => {
                      const isMiss = ti === r.miss;
                      const reveal = isMiss && ok;
                      return (
                        <div key={ti} className={"pq-tile" + (isMiss ? (reveal ? " win" : " miss") : "")}>
                          {isMiss ? (reveal ? r.ans : "?") : v}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pq-right">
                  {ok ? (
                    <span className="pq-chip">{stepLabel(r, lang)}</span>
                  ) : (
                    <div className="pq-sgs">
                      {r.opts.map((n) => (
                        <button key={n} type="button" className={"pq-sg" + (vals[i] === n ? " sel" : "")} disabled={lock}
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
