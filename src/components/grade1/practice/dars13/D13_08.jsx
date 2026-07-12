// Dars13 · Amaliyot 08 — P13 Ko'p-tanlov «O'nlik kartalari» · 🔴 · tag: make_ten_multi
// Qalam do'koni: 5 karta (qalam-guruhlari yoki yozuv). Aynan O'N bo'lganini tanlash — ular
// bitta DASTA (10 qalam, qizil rezinka bilan bog'langan) bo'ladi. To'g'ri: 7+3, 1 dasta, 5+5,
// 8+2 → {0,1,2,4}. Tuzoq: 6+3=9 (idx3). Tepada «10» kalit breath. G'alabada dasta 1..10 sanaladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TEN = 10;
const CARDS = [
  { kind: 'sum', a: 7, b: 3 },  // 10 ✓
  { kind: 'sum', a: 6, b: 4 },  // 10 ✓
  { kind: 'sum', a: 5, b: 5 },  // 10 ✓
  { kind: 'sum', a: 6, b: 3 },  //  9 ✗ tuzoq
  { kind: 'sum', a: 8, b: 1 },  //  9 ✗ tuzoq
];
const cardVal = (c) => (c.kind === 'dasta' ? TEN : c.a + c.b);
const GOOD = CARDS.map((c, i) => (cardVal(c) === TEN ? i : -1)).filter((i) => i >= 0); // [0,1,2,4]
const exprLabel = (c) => (c.kind === 'dasta' ? '1 dasta' : `${c.a} + ${c.b}`);

// Qalam palitrasi (2-ton: tana / to'q chet).
const PC = [
  { c: '#f2b134', d: '#cf9016' }, // sariq
  { c: '#d9534b', d: '#b23a33' }, // qizil
  { c: '#4f8fc4', d: '#37699a' }, // ko'k
  { c: '#57a84f', d: '#3d8038' }, // yashil
];

const DATA = { ptype: 'P13', level: '🔴', tag: 'make_ten_multi' };
const T = {
  uz: {
    eyebrow: "Qalam do'koni · O'nta", title: "O'nta kartalari",
    setup: "Kartalarda qalam-guruhlari bor. Ba'zilarida jami o'nta, ba'zilarida yo'q.",
    ask: "Aynan O'N bo'ladigan BARCHA kartalarni bosing.",
    correct: "Barakalla! Jami o'n bo'lgan barcha kartalar topildi!",
    hint: "Har kartani hisoblang: ikki son qo'shilib o'n bo'lsa — o'sha karta to'g'ri.",
    dasta: "o'nta",
  },
  ru: {
    eyebrow: 'Магазин карандашей · Десять', title: 'Карточки: где десять?',
    setup: 'На карточках — группы карандашей. На одних всего десять, на других — нет.',
    ask: 'Нажми на ВСЕ карточки, где получается ровно ДЕСЯТЬ.',
    correct: 'Молодец! Найдены все карточки, где ровно десять!',
    hint: 'Посчитай каждую карточку: если два числа дают десять — карточка верная.',
    dasta: 'десять',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uch + yog'och konus (tepa),
// rangli tana (2-ton + blik), metall halqa + pushti o'chirg'ich (past). Bitta qalam = bitta birlik.
const Pencil = ({ w = 11, c = '#f2b134', dark = '#cf9016' }) => (
  <svg viewBox="0 0 16 62" width={w} height={(w * 62) / 16} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="8,3 10.7,11.5 5.3,11.5" fill="#3b3f49" />
    <polygon points="8,3 8,11.5 5.3,11.5" fill="#5b616e" />
    <polygon points="5.3,11.5 10.7,11.5 12,22 4,22" fill="#eccf9f" />
    <polygon points="8,11.5 10.7,11.5 12,22 8,22" fill="#dcb886" />
    <rect x="4" y="22" width="8" height="26" fill={c} />
    <rect x="4.4" y="22" width="2.2" height="26" fill="#ffffff" opacity="0.28" />
    <rect x="9.7" y="22" width="2.3" height="26" fill={dark} opacity="0.9" />
    <rect x="3.6" y="48" width="8.8" height="6.2" fill="#cfd3da" stroke="#a3a9b2" strokeWidth="0.6" />
    <rect x="3.6" y="49.8" width="8.8" height="1.5" fill="#a3a9b2" opacity="0.55" />
    <rect x="4.3" y="54" width="7.4" height="5.6" rx="2.3" fill="#f3a9c2" stroke="#e087a8" strokeWidth="0.5" />
  </svg>
);

// «10» KALIT: oltin medalyon, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TenKey = () => (
  <svg viewBox="0 0 62 46" width="60" height="45" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="56" height="34" rx="13" fill="#f2b134" stroke="#c08517" strokeWidth="2.4" />
    <rect x="9" y="10" width="24" height="9" rx="5" fill="#f8d47f" opacity="0.9" />
    <text x="31" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">10</text>
    <polygon className="pq-glint" points="48,10 49.4,14 53.4,15.4 49.4,16.8 48,20.8 46.6,16.8 42.6,15.4 46.6,14" fill="#fff" />
  </svg>
);

// Osma chiroq (dekor): shisha qalpoq + yorug'lik; sekin tebranadi.
const Lamp = () => (
  <svg viewBox="0 0 40 46" width="34" height="40" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="20" y1="0" x2="20" y2="15" stroke="#7a6a52" strokeWidth="2" />
    <path d="M8 32 L32 32 L27 17 L13 17 Z" fill="#e0a93f" stroke="#b9832a" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 17 L27 17 L25.5 21 L14.5 21 Z" fill="#f6d488" opacity="0.85" />
    <ellipse cx="20" cy="32" rx="12" ry="3.2" fill="#f6d488" />
    <circle cx="20" cy="35" r="4.4" fill="#fff3c0" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D13_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TEN);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(exprLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  // Yakka guruh qalamlari — rang tsikli butun o'nlik bo'ylab davom etadi.
  const grp = (n, start) => Array.from({ length: n }).map((_, k) => {
    const pc = PC[(start + k) % PC.length];
    return <span key={k} className="pq-pk"><Pencil c={pc.c} dark={pc.d} /></span>;
  });

  return (
    <div className="pq pq1308">
      <style>{`
        .pq1308{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1308 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a1e;text-transform:uppercase;}
        .pq1308 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1308 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1308 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq1308 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#fbf3e4,#f3e5cf);border:2px solid #e6d4b4;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq1308 .pq-shelf{position:relative;height:68px;background:linear-gradient(#d9b785,#c69c62 68%,#b88a50);border-bottom:3px solid #9a7440;box-shadow:inset 0 -2px 3px rgba(120,80,30,.25);}

        .pq1308 .pq-keyw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);line-height:0;z-index:3;}
        .pq1308 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(120,80,20,.32));}
        .pq1308 .pq-keybr.win{animation:pqCele .6s ease;}
        .pq1308 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.4s ease-in-out infinite;}

        .pq1308 .pq-lamp{position:absolute;top:-1px;left:26px;transform-origin:top center;animation:pqSwing 4.2s ease-in-out infinite;z-index:2;}
        .pq1308 .pq-lamp::before{content:'';position:absolute;left:50%;top:24px;width:46px;height:46px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,236,160,.75),rgba(255,236,160,0) 66%);animation:pqGlow 3s ease-in-out infinite;pointer-events:none;}

        .pq1308 .pq-cup{position:absolute;right:16px;bottom:3px;width:38px;height:44px;z-index:2;}
        .pq1308 .pq-cupbody{position:absolute;bottom:0;left:2px;width:34px;height:19px;background:linear-gradient(#e2825a,#c25c37);border-radius:3px 3px 8px 8px;border:1.5px solid #a44a2b;box-shadow:inset 0 2px 2px rgba(255,255,255,.22);}
        .pq1308 .pq-cuprim{position:absolute;bottom:16px;left:0;width:38px;height:6px;background:#ea9068;border-radius:3px;border:1.5px solid #a44a2b;}
        .pq1308 .pq-cp{position:absolute;bottom:15px;transform-origin:bottom center;line-height:0;animation:pqSway 3.2s ease-in-out infinite;}
        .pq1308 .pq-cp.p1{left:3px;animation-delay:0s;} .pq1308 .pq-cp.p2{left:13px;bottom:18px;animation-delay:-1.1s;} .pq1308 .pq-cp.p3{left:23px;animation-delay:-2.2s;}

        .pq1308 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 4px;}
        .pq1308 .pq-card{position:relative;width:156px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px 11px;border-radius:16px;border:2.5px solid #e3d3b4;background:#fffdf8;color:#3a3320;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(150,110,50,.12);font-family:inherit;}
        .pq1308 .pq-card:hover:not(:disabled){border-color:#e0b878;transform:translateY(-2px);box-shadow:0 5px 12px rgba(150,110,50,.2);}
        .pq1308 .pq-card:active:not(:disabled){transform:scale(.96);}
        .pq1308 .pq-card:disabled{cursor:default;}
        .pq1308 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq1308 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pqCele .55s ease;}
        .pq1308 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq1308 .pq-cardv{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:6px;height:46px;}
        .pq1308 .pq-cardv.dasta{gap:0;}
        .pq1308 .pq-grp{display:flex;align-items:flex-end;gap:1px;}
        .pq1308 .pq-drow{display:flex;align-items:flex-end;gap:3px;}
        .pq1308 .pq-pk{position:relative;line-height:0;}
        .pq1308 .pq-plus{font-size:18px;font-weight:900;color:#b58a4e;align-self:center;margin:0 1px;transition:opacity .3s;}
        .pq1308 .pq-card.won .pq-plus{opacity:0;}
        .pq1308 .pq-cnt{position:absolute;top:-8px;left:50%;transform:translateX(-50%);min-width:12px;height:12px;padding:0 1.5px;border-radius:7px;background:#2563eb;color:#fff;font-size:8px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}

        .pq1308 .pq-band,.pq1308 .pq-cband{position:absolute;left:5%;right:5%;top:16px;height:9px;border-radius:4px;background:linear-gradient(#e26a5f,#c8382f);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 1px 2px rgba(120,20,10,.3);z-index:2;}
        .pq1308 .pq-band::after,.pq1308 .pq-cband::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:11px;height:11px;border-radius:50%;background:#d84a3f;box-shadow:inset 0 1px 1px rgba(255,255,255,.4);}
        .pq1308 .pq-cband{animation:pqWrap .55s cubic-bezier(.3,1.3,.5,1) both;}

        .pq1308 .pq-clabel{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:900;color:#3a3320;font-variant-numeric:tabular-nums;}
        .pq1308 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq1308 .pq-eq{color:#1a7f43;font-size:16px;animation:pqPop .4s ease both;}
        .pq1308 .pq-spark{position:absolute;top:6px;right:9px;line-height:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq1308 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1308 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1308 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqGlow{0%,100%{opacity:.55;transform:translateX(-50%) scale(.94);}50%{opacity:.9;transform:translateX(-50%) scale(1.06);}}
        @keyframes pqSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqWrap{from{opacity:0;transform:scaleX(.1);}to{opacity:1;transform:scaleX(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-shelf">
          <span className="pq-lamp"><Lamp /></span>
          <span className="pq-keyw"><span className={'pq-keybr' + (ok ? ' win' : '')}><TenKey /></span></span>
          <span className="pq-cup">
            <span className="pq-cp p1"><Pencil w={12} c="#4f8fc4" dark="#37699a" /></span>
            <span className="pq-cp p2"><Pencil w={12} c="#57a84f" dark="#3d8038" /></span>
            <span className="pq-cp p3"><Pencil w={12} c="#d9534b" dark="#b23a33" /></span>
            <span className="pq-cuprim" />
            <span className="pq-cupbody" />
          </span>
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TEN;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={exprLabel(c)}>
                {c.kind === 'dasta' ? (
                  <div className="pq-cardv dasta">
                    <div className="pq-drow">
                      {Array.from({ length: TEN }).map((_, k) => {
                        const pc = PC[k % PC.length];
                        return (
                          <span key={k} className="pq-pk">
                            <Pencil c={pc.c} dark={pc.d} />
                            {ok && <b className="pq-cnt">{k + 1}</b>}
                          </span>
                        );
                      })}
                    </div>
                    <span className="pq-band" />
                  </div>
                ) : (
                  <div className="pq-cardv">
                    <span className="pq-grp">{grp(c.a, 0)}</span>
                    <span className="pq-plus">+</span>
                    <span className="pq-grp">{grp(c.b, c.a)}</span>
                    {ok && good && <span className="pq-cband" />}
                  </div>
                )}

                <div className="pq-clabel">
                  <span>{c.kind === 'dasta' ? t.dasta : `${c.a} + ${c.b}`}</span>
                  {ok && good && <b className="pq-eq">= {TEN}</b>}
                </div>

                {ok && good && <span className="pq-spark"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
