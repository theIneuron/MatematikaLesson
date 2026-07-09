// Dars15 · Amaliyot 08 — Ko'p-tanlov «O'n sakkiz qayerda?» · 🔴 · tag: teen_multi
// Qalam do'koni: 5 karta. Aynan 18 ga TENG bo'lganlarni BARCHASINI belgilang.
// [0] "1 dasta + 8" (rasm: dasta+8 yakka) =18 ✓  [1] "10 + 8" (matn) =18 ✓  [2] "18" (raqam) ✓
// [3] "1 dasta + 9" (rasm: dasta+9 yakka) =19 ✗ tuzoq  [4] "17" (raqam) ✗ tuzoq. GOOD = {0,1,2}.
// TEEN modeli: dasta (10, qizil rezinka) ALOHIDA, yakka qalamlar ALOHIDA — misconception qalqoni.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 18, TEN = 10;
// kind: 'unit' = 1 dasta + N yakka (rasm) · 'sum10' = "10 + N" matn · 'num' = raqam
const CARDS = [
  { kind: 'unit', ones: 8 },   // 1 dasta + 8 = 18 ✓
  { kind: 'sum10', ones: 8 },  // 10 + 8   = 18 ✓
  { kind: 'num',  n: 18 },     // 18       = 18 ✓
  { kind: 'unit', ones: 9 },   // 1 dasta + 9 = 19 ✗ tuzoq
  { kind: 'num',  n: 17 },     // 17       = 17 ✗ tuzoq
];
const cardVal = (c) => (c.kind === 'num' ? c.n : TEN + c.ones);
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) =>
  c.kind === 'num' ? String(c.n) : c.kind === 'sum10' ? `10 + ${c.ones}` : `1 dasta + ${c.ones}`;

// Qalam palitrasi (2-ton: tana / to'q chet).
const PC = [
  { c: '#f2b134', d: '#cf9016' }, // sariq
  { c: '#d9534b', d: '#b23a33' }, // qizil
  { c: '#4f8fc4', d: '#37699a' }, // ko'k
  { c: '#57a84f', d: '#3d8038' }, // yashil
];

const DATA = { good: [0, 1, 2], target: TARGET, ptype: 'P08', level: '🔴', tag: 'teen_multi' };
const T = {
  uz: {
    eyebrow: "Qalam do'koni · O'n sakkiz",
    title: "O'n sakkiz qayerda?",
    setup: "Kartalarda o'n sakkizni turlicha ko'rsatishgan — dasta bilan, qo'shish bilan, raqam bilan.",
    ask: "Aynan O'N SAKKIZ bo'ladigan BARCHA kartalarni bosing.",
    correct: "Barakalla! Uch xil o'n sakkiz — dasta va sakkiz, o'n qo'shuv sakkiz, hamda o'n sakkiz raqami.",
    hint: "Har kartada nechta bor? Bir dasta o'nta — o'ndan boshlab yakkalarni birma-bir sanang. Kerakli songa mos kelganini belgilang.",
    dasta: "dasta",
  },
  ru: {
    eyebrow: 'Магазин карандашей · Восемнадцать',
    title: 'Где восемнадцать?',
    setup: 'На карточках восемнадцать показано по-разному — связкой, сложением, числом.',
    ask: 'Нажмите на ВСЕ карточки, где получается ровно ВОСЕМНАДЦАТЬ.',
    correct: 'Молодец! Три вида восемнадцати — связка и восемь, десять плюс восемь и число восемнадцать.',
    hint: 'Сколько на каждой карточке? Связка — это десять, дальше досчитывай отдельные по одному. Отметь те, что совпали.',
    dasta: 'связка',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (yakka birlik): tik yog'och qalam — grafit uch + yog'och konus (tepa),
// rangli tana (2-ton + blik), metall halqa + pushti o'chirg'ich (past). Bitta qalam = bitta birlik.
const Pencil = ({ w = 10, c = '#f2b134', dark = '#cf9016' }) => (
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

// «18» KALIT: oltin medalyon, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetKey = () => (
  <svg viewBox="0 0 66 46" width="62" height="43" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="60" height="34" rx="13" fill="#f2b134" stroke="#c08517" strokeWidth="2.4" />
    <rect x="9" y="10" width="26" height="9" rx="5" fill="#f8d47f" opacity="0.9" />
    <text x="33" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">18</text>
    <polygon className="pq-glint" points="51,10 52.4,14 56.4,15.4 52.4,16.8 51,20.8 49.6,16.8 45.6,15.4 49.6,14" fill="#fff" />
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

export default function D15_08(props) {
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(cardLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  // Yakka guruh qalamlari — rang tsikli o'nlikdan keyin davom etadi (dasta 0..9, yakka 10+).
  const units = (n, start) => Array.from({ length: n }).map((_, k) => {
    const pc = PC[(start + k) % PC.length];
    return <span key={k} className="pq-pk"><Pencil c={pc.c} dark={pc.d} /></span>;
  });

  return (
    <div className="pq pq1508">
      <style>{`
        .pq1508{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1508 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a1e;text-transform:uppercase;}
        .pq1508 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1508 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1508 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq1508 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#fbf3e4,#f3e5cf);border:2px solid #e6d4b4;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq1508 .pq-shelf{position:relative;height:66px;background:linear-gradient(#d9b785,#c69c62 68%,#b88a50);border-bottom:3px solid #9a7440;box-shadow:inset 0 -2px 3px rgba(120,80,30,.25);}
        .pq1508 .pq-keyw{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);line-height:0;z-index:3;}
        .pq1508 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(120,80,20,.32));}
        .pq1508 .pq-keybr.win{animation:pqCele .6s ease;}
        .pq1508 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.4s ease-in-out infinite;}
        .pq1508 .pq-lamp{position:absolute;top:-1px;left:26px;transform-origin:top center;animation:pqSwing 4.2s ease-in-out infinite;z-index:2;}
        .pq1508 .pq-lamp::before{content:'';position:absolute;left:50%;top:24px;width:46px;height:46px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,236,160,.75),rgba(255,236,160,0) 66%);animation:pqGlow 3s ease-in-out infinite;pointer-events:none;}
        .pq1508 .pq-win{position:absolute;right:16px;top:12px;width:52px;height:40px;border-radius:7px;background:linear-gradient(135deg,#dff0fb 0 46%,#c2ddf0 46% 54%,#e9f6ff 54%);border:2.5px solid #b98f52;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:1;}
        .pq1508 .pq-win::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b98f52;transform:translateX(-1px);}
        .pq1508 .pq-sun{position:absolute;right:22px;top:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 14px 3px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}

        .pq1508 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 6px;}
        .pq1508 .pq-card{position:relative;min-width:150px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 10px 11px;border-radius:16px;border:2.5px solid #e3d3b4;background:#fffdf8;color:#3a3320;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(150,110,50,.12);font-family:inherit;}
        .pq1508 .pq-card:hover:not(:disabled){border-color:#e0b878;transform:translateY(-2px);box-shadow:0 5px 12px rgba(150,110,50,.2);}
        .pq1508 .pq-card:active:not(:disabled){transform:scale(.96);}
        .pq1508 .pq-card:disabled{cursor:default;}
        .pq1508 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq1508 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pqCele .55s ease;}
        .pq1508 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq1508 .pq-cardv{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:9px;height:56px;}
        .pq1508 .pq-dasta{position:relative;display:flex;align-items:flex-end;padding-top:8px;}
        .pq1508 .pq-drow{display:flex;align-items:flex-end;gap:1px;}
        .pq1508 .pq-units{display:flex;align-items:flex-end;gap:2px;}
        .pq1508 .pq-pk{position:relative;line-height:0;}
        .pq1508 .pq-band{position:absolute;left:-3px;right:-3px;top:9px;height:8px;border-radius:4px;background:linear-gradient(#e26a5f,#c8382f);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 1px 2px rgba(120,20,10,.3);z-index:2;}
        .pq1508 .pq-band::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:#d84a3f;box-shadow:inset 0 1px 1px rgba(255,255,255,.4);}
        .pq1508 .pq-bandlbl{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#fff;border:1.6px solid #cf3f38;color:#cf3f38;font-weight:900;font-size:10px;line-height:1;padding:1.5px 5px;border-radius:999px;z-index:3;}
        .pq1508 .pq-plus{font-size:20px;font-weight:900;color:#b58a4e;align-self:center;}

        .pq1508 .pq-txt{display:flex;align-items:center;justify-content:center;height:56px;font-size:30px;font-weight:900;color:#5a4a2c;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq1508 .pq-txt.big{font-size:38px;color:#3a3320;}

        .pq1508 .pq-clabel{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800;color:#6a6152;font-variant-numeric:tabular-nums;}
        .pq1508 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq1508 .pq-eq{color:#1a7f43;font-size:16px;font-weight:900;animation:pqPop .4s ease both;}
        .pq1508 .pq-spark{position:absolute;top:6px;right:9px;line-height:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq1508 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1508 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1508 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqSwing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqGlow{0%,100%{opacity:.55;transform:translateX(-50%) scale(.94);}50%{opacity:.9;transform:translateX(-50%) scale(1.06);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
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
          <span className="pq-keyw"><span className={'pq-keybr' + (ok ? ' win' : '')}><TargetKey /></span></span>
          <span className="pq-win" /><span className="pq-sun" />
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                {c.kind === 'unit' ? (
                  <div className="pq-cardv">
                    <span className="pq-dasta">
                      <span className="pq-drow">
                        {Array.from({ length: TEN }).map((_, k) => {
                          const pc = PC[k % PC.length];
                          return <span key={k} className="pq-pk"><Pencil w={9} c={pc.c} dark={pc.d} /></span>;
                        })}
                      </span>
                      <span className="pq-band" />
                      <span className="pq-bandlbl">10</span>
                    </span>
                    <span className="pq-plus">+</span>
                    <span className="pq-units">{units(c.ones, 0)}</span>
                  </div>
                ) : c.kind === 'sum10' ? (
                  <div className="pq-txt">10 + {c.ones}</div>
                ) : (
                  <div className="pq-txt big">{c.n}</div>
                )}

                <div className="pq-clabel">
                  <span>{cardLabel(c)}</span>
                  {ok && good && <b className="pq-eq">= {TARGET}</b>}
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
