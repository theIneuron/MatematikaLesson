// Dars25 · Amaliyot 05 — «Ikki xonali + bir xonali (o'tishsiz)» zanjir · Olma bog' · 🔴 · tag: td_chain
// CHAIN: 4 misol birdaniga, 2x2 katak (D09_06 tartibi). Har katak = qutili ifoda + '=' + shtrix-uya,
// pastida bitta qatorda 4 variant. Birma-bir to'ldiriladi, noto'g'ri qator qulflamaydi, oxirida o'zi Tekshirish.
// QOIDA: birlikni birlikka qo'shamiz, o'nliklar (savatlar) o'zgarmaydi. 34 + 5: 4+5=9 birlik, 3 o'nlik -> 39.
// FAQAT QO'SHISH — minus YO'Q. Sonlar sbornikdan: 24+5=29, 31+6=37, 52+3=55, 43+4=47.
// Distraktorlar: M1 o'nlikka qo'shish (24+5->74), M2 birlikni almashtirish (24+5->25), near-miss (bittaga xato).
// KANON: o'nlik = bitta olma savati ('10' nishoni), birlik = yakka olma (Dars21). Ambient bezak — bosilmaydi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { expr: '24 + 5', ans: 29, opts: [29, 74, 25, 28] },
  { expr: '31 + 6', ans: 37, opts: [37, 91, 36, 38] },
  { expr: '52 + 3', ans: 55, opts: [55, 82, 53, 56] },
  { expr: '43 + 4', ans: 47, opts: [47, 83, 44, 48] },
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'td_chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir", title: "Misollar zanjiri",
    setup: "Kartochkalarda 4 ta misol bor.",
    ask: "Har misol uchun to'g'ri javobni tanlang.",
    correct: "Barakalla! Har misolni to'g'ri yechdingiz.",
    hint: "Birlikni birlikka qo'shing, o'nlik o'zgarmaydi.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка", title: "Цепочка примеров",
    setup: "На карточках 4 примера.",
    ask: "Для каждого примера выбери верный ответ.",
    correct: "Молодец! Ты верно решил каждый пример.",
    hint: "Прибавляй единицы к единицам, десяток не меняется.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — Dars21 kanoni: yumaloq tana (radial 2-ton), bandak, barg, oq blik.
const Apple = ({ w = 22 }) => {
  const id = 'pq2505a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
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

// SAVAT (bitta o'nlik = 10 olma) — Dars21 kanoni: to'qima savat, ustidan olmalar mo'ralaydi, yashil '10' nishoni.
const Basket = ({ w = 40 }) => {
  const id = 'pq2505b' + (__gid++);
  const ap = id + 'ap';
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D25_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda ambient jonlanish saqlanadi, sahna yakuniy holatdan boshlanadi.
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

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.expr} = ${r.opts.join('/')}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bosiladigan nishon EMAS — dekor)

  return (
    <div className="pq pq2505">
      <style>{`
        .pq2505{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2505 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2505 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2505 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2505 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2505 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px 10px 14px;border-radius:22px;background:linear-gradient(#f3f9ec,#e7f3d9);border:2px solid #d3e6bf;}

        .pq2505 .pq-scene{position:relative;width:380px;max-width:100%;height:150px;border-radius:18px;background:linear-gradient(#cfeafc 0%,#e4f4d9 54%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2505 .pq-sun{position:absolute;right:18px;top:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2505sun 3.6s ease-in-out infinite;}
        .pq2505 .pq-tree{position:absolute;bottom:34px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2505 .pq-tree.t1{left:8px;animation:pq2505sway 4.2s ease-in-out infinite;}
        .pq2505 .pq-tree.t2{right:10px;bottom:38px;animation:pq2505sway 4.8s ease-in-out .6s infinite;}
        .pq2505 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:7px;height:22px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2505 .pq-crown{width:50px;height:42px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2505 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2505 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:44px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2505 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2505 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2505 .pq-crop{position:absolute;left:0;right:0;bottom:8px;display:flex;align-items:flex-end;justify-content:center;gap:8px;z-index:3;pointer-events:none;}
        .pq2505 .pq-obj{line-height:0;}
        .pq2505 .pq-obj.idle{animation:pq2505bob 3s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2505 .pq-loose{display:flex;gap:4px;align-items:flex-end;}
        .pq2505 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2505tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2505 .pq-spark.s2{animation-delay:-.6s;} .pq2505 .pq-spark.s3{animation-delay:-1.15s;}
        .pq2505 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;pointer-events:none;animation:pq2505tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq2505 .pq-wstar.w2{animation-delay:-.5s;} .pq2505 .pq-wstar.w3{animation-delay:-1.05s;}

        .pq2505 .pq-rows{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:9px;width:100%;}
        .pq2505 .pq-rw{display:flex;flex-direction:column;gap:8px;align-items:center;padding:8px 9px 9px;border-radius:14px;border:2.5px solid #dbe6cf;background:#fff;transition:.15s;}
        .pq2505 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2505 .pq-rw.good.win{animation:pq2505cele .5s ease;}
        .pq2505 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2505shake .35s ease;}
        .pq2505 .pq-line{display:flex;align-items:center;justify-content:center;gap:6px;}
        .pq2505 .pq-ex{min-width:78px;height:42px;border-radius:10px;background:#f4f8ef;border:2px solid #cfe0bd;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq2505 .pq-op{margin:0 4px;color:#1a7f43;}
        .pq2505 .pq-eq{font-size:21px;font-weight:900;color:#8a94a2;}
        .pq2505 .pq-slot{width:44px;height:42px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2505breath 2.4s ease-in-out infinite;}
        .pq2505 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2505 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2505 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2505 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2505 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2505 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2505 .pq-sgs{display:flex;gap:6px;justify-content:center;flex-wrap:nowrap;}
        .pq2505 .pq-sg{width:44px;height:44px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:18px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2505 .pq-sg:hover:not(:disabled){border-color:#8fc083;transform:translateY(-2px);}
        .pq2505 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2505 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2505 .pq-sg:disabled{cursor:default;}
        .pq2505 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2505in .22s ease both;}
        .pq2505 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2505 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2505sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2505sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2505bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2505tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2505breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.06);border-color:#a9b5c8;}}
        @keyframes pq2505shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2505cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2505in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '12px', top: '14px' }} /><i style={{ left: '30px', top: '9px' }} /><i style={{ left: '22px', top: '25px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '10px', top: '11px' }} /><i style={{ left: '28px', top: '20px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-board">{t.title}</div>

          {/* Ambient hosil: savatlar (o'nliklar) + yakka olmalar (birliklar) — bezak, bosilmaydi */}
          <div className="pq-crop">
            <span className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': '0s' }}><Basket w={40} /></span>
            <span className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': '.18s' }}><Basket w={40} /></span>
            <span className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': '.36s' }}><Basket w={40} /></span>
            <span className="pq-loose">
              <span className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': '.5s' }}><Apple w={22} /></span>
              <span className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': '.62s' }}><Apple w={22} /></span>
              <span className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': '.74s' }}><Apple w={22} /></span>
            </span>
          </div>
          <span className="pq-hill" />

          {ok && (<>
            <span className="pq-spark" style={{ left: '18%', top: '40px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '80%', top: '52px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>✦</span>
            <span className="pq-wstar" style={{ left: '34%', top: '58px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '62%', top: '34px' }}><Star fill="#e59a2f" /></span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const [a, , b] = r.expr.split(' ');
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-line">
                  <div className="pq-ex">{a}<b className="pq-op">+</b>{b}</div>
                  <span className="pq-eq">=</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
