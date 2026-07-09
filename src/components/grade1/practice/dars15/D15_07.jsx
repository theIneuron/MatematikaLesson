// Dars15 · Amaliyot 07 — LOGIC «Raqamni modeliga bog'lang» (juftlash · tap-pair) · 🔴 · tag: logic_match
// Chapda 3 RAQAM-karta (16, 18, 20), o'ngda 3 MODEL-karta (aralash tartibda).
// MODEL: 16 = 1 DASTA (o'nlik) + 6 YAKKA; 18 = 1 DASTA + 8 YAKKA; 20 = 2 DASTA (ikki o'nlik!).
// Mexanika: avval raqamni bosasiz (tanlanadi), keyin uning modelini bosasiz → juft hosil bo'ladi
// (ikkovi bitta rangli halqa + nuqta bilan bog'lanadi). Juftni qayta bosib bekor qilib to'g'rilash mumkin.
// correct = uchala juft to'g'ri (raqam == model soni). Misconception: 20 = ikki DASTA, «2 va 0» EMAS.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUMS = [16, 18, 20];
const MODELS = [20, 16, 18]; // aralash tartib — juftlash triviallashmasin
const PAIR_COLOR = { 16: '#7c3aed', 18: '#0d9488', 20: '#d6336c' }; // juft-rang (raqam bo'yicha)
const DATA = { nums: NUMS, models: MODELS, ptype: 'LOGIC', level: '🔴', tag: 'logic_match' };

// Qalam tanasi rang palitrasi (sariq / qizil / ko'k / yashil) — yakka qalamlar ajralib tursin.
const PAL = [
  { c: '#f2b134', d: '#cf9420' }, // sariq
  { c: '#e2635b', d: '#b23e37' }, // qizil
  { c: '#4a90d9', d: '#3a72a3' }, // ko'k
  { c: '#57a84f', d: '#43893c' }, // yashil
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Juftlash", title: "Raqamni modeliga bog'lang",
    setup: "Chapda raqamlar, o'ngda ularning modellari — dasta va yakka qalamlar.",
    ask: "Har raqamni o'z modeli bilan bog'lang: avval raqamni, keyin uning modelini bosing.",
    hintNum: "Raqamni tanlang, keyin unga mos modelni bosing.",
    hintModel: "Endi shu raqamning modelini toping va bosing.",
    correct: "Barakalla! O'n olti — bir dasta va olti yakka. O'n sakkiz — bir dasta va sakkiz yakka. Yigirma esa ikki dasta — ikki o'nlik!",
    hint: "Modelda nechta DASTA borligini o'nlik deb, nechta YAKKA qalam borligini birlik deb sanang; shu songa mos raqamni toping.",
    colNum: "Raqam", colModel: "Model",
    chip: "16 = 10 + 6 · 18 = 10 + 8 · 20 = 10 + 10",
  },
  ru: {
    eyebrow: "Магазин карандашей · Соответствие", title: "Соедини число с моделью",
    setup: "Слева числа, справа их модели — пачки и отдельные карандаши.",
    ask: "Соедини каждое число с его моделью: сначала число, потом его модель.",
    hintNum: "Выбери число, потом нажми подходящую модель.",
    hintModel: "Теперь найди и нажми модель этого числа.",
    correct: "Молодец! Шестнадцать — одна пачка и шесть отдельных. Восемнадцать — одна пачка и восемь. А двадцать — две пачки, два десятка!",
    hint: "Посчитай, сколько ПАЧЕК (десятки) и сколько ОТДЕЛЬНЫХ карандашей (единицы); найди подходящее число.",
    colNum: "Число", colModel: "Модель",
    chip: "16 = 10 + 6 · 18 = 10 + 8 · 20 = 10 + 10",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (mini yakka birlik): tik yog'och qalam — grafit uch + yog'och konus, rangli tana (2-ton),
// metall halqa, pushti o'chirg'ich. Bitta qalam = bitta birlik.
const MiniPencil = ({ c = '#f2b134', d = '#cf9420', w = 8 }) => (
  <svg viewBox="0 0 10 36" width={w} height={w * 36 / 10} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="5,1 3.4,5 6.6,5" fill="#2f2f33" />
    <polygon points="3.4,5 6.6,5 7.4,10.5 2.6,10.5" fill="#e8c187" stroke="rgba(0,0,0,.12)" strokeWidth=".5" strokeLinejoin="round" />
    <polygon points="3.4,5 5,5 4.2,10.5 2.6,10.5" fill="#f2d6a4" />
    <rect x="2.6" y="10" width="4.8" height="18.5" fill={c} stroke="rgba(0,0,0,.13)" strokeWidth=".5" />
    <rect x="2.6" y="10" width="1.7" height="18.5" fill={d} />
    <rect x="5.9" y="10" width=".9" height="18.5" fill="#fff" opacity=".35" />
    <rect x="2.4" y="28" width="5.2" height="3.2" rx=".7" fill="#cfd3da" stroke="#a7adb8" strokeWidth=".5" />
    <rect x="2.7" y="30.8" width="4.6" height="4.2" rx="1.4" fill="#f2a6ba" stroke="#db8398" strokeWidth=".5" />
  </svg>
);

// DASTA KANONI (mini o'nlik): 10 qalam yonma-yon tik turgan, qizil rezinka bilan bog'langan, «10» yorlig'i.
const MiniDasta = ({ penW = 4 }) => (
  <span className="pq-dasta">
    <span className="pq-dlabel">10</span>
    <span className="pq-drow">
      {Array.from({ length: 10 }).map((_, i) => {
        const p = PAL[i % PAL.length];
        return <span key={i} className="pq-dpen"><MiniPencil c={p.c} d={p.d} w={penW} /></span>;
      })}
    </span>
    <span className="pq-dband" />
  </span>
);

// MODEL: tens DASTA (o'nlik) + units YAKKA qalam. 16→1+6, 18→1+8, 20→2 dasta (0 yakka).
const ModelViz = ({ n }) => {
  const tens = Math.floor(n / 10);
  const units = n % 10;
  return (
    <span className="pq-mv">
      <span className="pq-mdastas">
        {Array.from({ length: tens }).map((_, i) => <MiniDasta key={i} penW={4} />)}
      </span>
      {units > 0 && (
        <span className="pq-munits">
          {Array.from({ length: units }).map((_, i) => {
            const p = PAL[i % PAL.length];
            return <span key={i} className="pq-upen"><MiniPencil c={p.c} d={p.d} w={9} /></span>;
          })}
        </span>
      )}
    </span>
  );
};

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D15_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null);          // { kind:'num'|'model', val } yoki null
  const [pairs, setPairs] = useState({});        // { [num]: modelSoni }
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda uchqun/yonish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.pairs) {
      setPairs({ ...initialAnswer.studentAnswer.pairs });
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);

  const pairCount = Object.keys(pairs).length;
  useEffect(() => { onReady?.(pairCount === NUMS.length && !checked); }, [pairCount, checked, onReady]);

  const lock = isReview || checked;

  // model → uni tanlagan raqam (owner) yoki null
  const ownerOfModel = useCallback((mv) => {
    const found = Object.keys(pairs).find((k) => pairs[k] === mv);
    return found == null ? null : Number(found);
  }, [pairs]);

  const clickNum = useCallback((nv) => {
    if (lock) return;
    setFeedback(null);
    if (pairs[nv] != null) { // juftni bekor qilish (to'g'rilash)
      setPairs((p) => { const np = { ...p }; delete np[nv]; return np; });
      setSel(null); return;
    }
    if (sel && sel.kind === 'model') { // model tanlangan edi → juft hosil qilish
      const mv = sel.val;
      setPairs((p) => ({ ...p, [nv]: mv }));
      setSel(null); return;
    }
    setSel((s) => (s && s.kind === 'num' && s.val === nv ? null : { kind: 'num', val: nv }));
  }, [lock, pairs, sel]);

  const clickModel = useCallback((mv) => {
    if (lock) return;
    setFeedback(null);
    const owner = ownerOfModel(mv);
    if (owner != null) { // juftni bekor qilish (to'g'rilash)
      setPairs((p) => { const np = { ...p }; delete np[owner]; return np; });
      setSel(null); return;
    }
    if (sel && sel.kind === 'num') { // raqam tanlangan edi → juft hosil qilish
      const nv = sel.val;
      setPairs((p) => ({ ...p, [nv]: mv }));
      setSel(null); return;
    }
    setSel((s) => (s && s.kind === 'model' && s.val === mv ? null : { kind: 'model', val: mv }));
  }, [lock, ownerOfModel, sel]);

  const check = useCallback(() => {
    if (Object.keys(pairs).length !== NUMS.length) return;
    const correct = NUMS.every((n) => pairs[n] === n);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: NUMS.map(String),
      studentAnswer: { pairs: { ...pairs } },
      correctAnswer: { pairs: { 16: 16, 18: 18, 20: 20 } },
      correct, meta: { ...DATA },
    });
  }, [pairs, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1507">
      <style>{`
        .pq1507{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1507 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c77d2e;text-transform:uppercase;}
        .pq1507 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1507 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1507 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1507 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;}
        /* SAHNA — Qalam do'koni */
        .pq1507 .pq-scene{position:relative;width:436px;max-width:100%;border-radius:20px;background:linear-gradient(#fdf3db 0%,#f8e6ba 58%,#f2d79f 100%);border:2px solid #e6cf9a;overflow:hidden;padding:38px 12px 16px;}
        .pq1507 .pq-win{position:absolute;right:14px;top:10px;width:50px;height:36px;border-radius:6px;background:linear-gradient(135deg,#eaf6ff 0 46%,#c9e6fb 46% 54%,#eaf6ff 54%);border:3px solid #d8b878;box-shadow:0 0 15px 3px rgba(255,239,178,.65);animation:pqGlow 3.6s ease-in-out infinite;z-index:1;}
        .pq1507 .pq-win::before,.pq1507 .pq-win::after{content:'';position:absolute;background:#d8b878;}
        .pq1507 .pq-win::before{left:50%;top:2px;bottom:2px;width:3px;transform:translateX(-1.5px);}
        .pq1507 .pq-win::after{top:50%;left:2px;right:2px;height:3px;transform:translateY(-1.5px);}
        .pq1507 .pq-sun{position:absolute;top:12px;left:16px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 13px 3px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1507 .pq-lamp{position:absolute;left:50%;top:0;width:2px;height:14px;background:#8a5628;transform:translateX(-1px);z-index:1;}
        .pq1507 .pq-shade{position:absolute;left:50%;top:12px;width:26px;height:13px;border-radius:0 0 40% 40%/0 0 100% 100%;background:linear-gradient(#f7d98a,#e0a83f);border:1.5px solid #b98235;transform:translateX(-13px);box-shadow:0 10px 22px 6px rgba(255,213,110,.4);animation:pqLamp 3.2s ease-in-out infinite;z-index:1;}
        .pq1507 .pq-mote{position:absolute;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.7);z-index:1;animation:pqMote linear infinite;}
        .pq1507 .pq-mote.m1{left:24%;top:26px;animation-duration:7s;}
        .pq1507 .pq-mote.m2{left:74%;top:60px;width:4px;height:4px;animation-duration:9s;animation-delay:-3s;}
        .pq1507 .pq-scene.still .pq-mote{animation:none;opacity:.4;}
        /* ikki ustun */
        .pq1507 .pq-board{position:relative;z-index:3;display:flex;justify-content:center;align-items:flex-start;gap:14px;}
        .pq1507 .pq-col{display:flex;flex-direction:column;gap:10px;}
        .pq1507 .pq-colhd{text-align:center;font-size:12px;font-weight:800;letter-spacing:.03em;color:#8a5a1e;text-transform:uppercase;margin-bottom:1px;}
        /* raqam-karta */
        .pq1507 .pq-ncard{position:relative;width:82px;height:70px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:#fffdf7;border:3px solid #e2d3af;color:#374151;font-size:32px;font-weight:900;font-variant-numeric:tabular-nums;cursor:pointer;transition:transform .12s,border-color .15s,box-shadow .15s;box-shadow:0 3px 6px rgba(120,80,30,.14);font-family:inherit;}
        .pq1507 .pq-ncard:hover:not(:disabled){transform:translateY(-2px);}
        .pq1507 .pq-ncard:active:not(:disabled){transform:scale(.95);}
        .pq1507 .pq-ncard:disabled{cursor:default;}
        .pq1507 .pq-ncard.sel{border-color:#2563eb;background:#eef3fd;box-shadow:0 0 0 4px rgba(37,99,235,.16);}
        .pq1507 .pq-ncard.win{border-color:#1a7f43;background:#eef9f0;color:#1a7f43;}
        /* model-karta */
        .pq1507 .pq-mcard{position:relative;min-width:172px;min-height:70px;display:flex;align-items:center;justify-content:center;padding:8px 10px;border-radius:16px;background:#fffdf7;border:3px solid #e2d3af;cursor:pointer;transition:transform .12s,border-color .15s,box-shadow .15s;box-shadow:0 3px 6px rgba(120,80,30,.14);}
        .pq1507 .pq-mcard:hover:not(.lock){transform:translateY(-2px);}
        .pq1507 .pq-mcard:active:not(.lock){transform:scale(.97);}
        .pq1507 .pq-mcard.lock{cursor:default;}
        .pq1507 .pq-mcard.sel{border-color:#2563eb;background:#eef3fd;box-shadow:0 0 0 4px rgba(37,99,235,.16);}
        .pq1507 .pq-mcard.win{border-color:#1a7f43;background:#eef9f0;}
        /* juft-nuqta (bog'langanini ko'rsatadi) */
        .pq1507 .pq-dot{position:absolute;top:6px;right:8px;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.28);animation:pqDot .3s ease both;}
        .pq1507 .pq-ncard .pq-dot{left:8px;right:auto;}
        /* MODEL vizual */
        .pq1507 .pq-mv{display:flex;align-items:flex-end;justify-content:center;gap:10px;flex-wrap:wrap;}
        .pq1507 .pq-mdastas{display:flex;align-items:flex-end;gap:8px;}
        .pq1507 .pq-munits{display:flex;align-items:flex-end;flex-wrap:wrap;gap:2px;max-width:78px;}
        .pq1507 .pq-upen{line-height:0;}
        /* DASTA (mini o'nlik) */
        .pq1507 .pq-dasta{position:relative;display:inline-flex;flex-direction:column;align-items:center;}
        .pq1507 .pq-dlabel{position:absolute;top:-9px;left:50%;transform:translateX(-50%);z-index:5;min-width:15px;padding:0 4px;border-radius:6px;background:#c93b32;color:#fff;font-size:9px;font-weight:900;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.22);font-variant-numeric:tabular-nums;line-height:1.4;}
        .pq1507 .pq-drow{display:flex;align-items:flex-end;}
        .pq1507 .pq-dpen{margin-left:-2px;} .pq1507 .pq-dpen:first-child{margin-left:0;}
        .pq1507 .pq-dband{position:absolute;left:-1.5px;right:-1.5px;top:44%;height:5px;border-radius:3px;background:linear-gradient(#e8564d,#c93b32);border:1px solid #a52f27;box-shadow:0 1px 2px rgba(0,0,0,.2);z-index:3;}
        /* taphint */
        .pq1507 .pq-taphint{font-size:13px;font-weight:700;color:#a06a1f;background:#fdf1d6;padding:5px 16px;border-radius:999px;min-height:14px;}
        /* uchqun + chip */
        .pq1507 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.5s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1507 .pq-star.s2{animation-delay:-.5s;} .pq1507 .pq-star.s3{animation-delay:-1s;}
        .pq1507 .pq-scene.still .pq-star{animation:none;opacity:1;}
        .pq1507 .pq-chip{display:inline-flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:2px 8px;text-align:center;padding:9px 18px;border-radius:18px;background:#e8f7ee;border:2px solid #7cc99a;color:#1a7f43;font-size:15px;font-weight:900;letter-spacing:.01em;font-variant-numeric:tabular-nums;animation:pqIn .3s ease both;max-width:100%;}
        .pq1507 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1507 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1507 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 11px 2px rgba(255,239,178,.5);}50%{box-shadow:0 0 19px 5px rgba(255,239,178,.8);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqLamp{0%,100%{opacity:.85;}50%{opacity:1;}}
        @keyframes pqMote{0%{transform:translate(0,0);opacity:0;}20%{opacity:.7;}80%{opacity:.55;}100%{transform:translate(16px,24px);opacity:0;}}
        @keyframes pqDot{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-win" />
          <span className="pq-sun" />
          <span className="pq-lamp" /><span className="pq-shade" />
          <span className="pq-mote m1" /><span className="pq-mote m2" />

          <div className="pq-board">
            {/* RAQAM ustuni */}
            <div className="pq-col">
              <span className="pq-colhd">{t.colNum}</span>
              {NUMS.map((n) => {
                const paired = pairs[n] != null;
                const isSel = sel && sel.kind === 'num' && sel.val === n;
                const cls = ok ? ' win' : isSel ? ' sel' : '';
                const bColor = ok ? '#1a7f43' : (paired ? PAIR_COLOR[n] : undefined);
                return (
                  <button
                    key={n} type="button"
                    className={'pq-ncard' + cls}
                    style={paired && !ok ? { borderColor: bColor, boxShadow: `0 0 0 4px ${bColor}22` } : undefined}
                    disabled={lock}
                    onClick={() => clickNum(n)}
                  >
                    {n}
                    {paired && <span className="pq-dot" style={{ background: ok ? '#1a7f43' : PAIR_COLOR[n] }} />}
                  </button>
                );
              })}
            </div>

            {/* MODEL ustuni */}
            <div className="pq-col">
              <span className="pq-colhd">{t.colModel}</span>
              {MODELS.map((mv) => {
                const owner = ownerOfModel(mv);
                const paired = owner != null;
                const isSel = sel && sel.kind === 'model' && sel.val === mv;
                const cls = ok ? ' win' : isSel ? ' sel' : '';
                const dotColor = ok ? '#1a7f43' : (paired ? PAIR_COLOR[owner] : undefined);
                return (
                  <div
                    key={mv}
                    className={'pq-mcard' + cls + (lock ? ' lock' : '')}
                    style={paired && !ok ? { borderColor: PAIR_COLOR[owner], boxShadow: `0 0 0 4px ${PAIR_COLOR[owner]}22` } : undefined}
                    onClick={() => clickModel(mv)}
                    role="button"
                  >
                    <ModelViz n={mv} />
                    {paired && <span className="pq-dot" style={{ background: dotColor }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {ok && (
            <>
              <span className="pq-star" style={{ left: '16%', top: '30px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-star s2" style={{ left: '50%', top: '22px' }}><Star fill="#f2b134" /></span>
              <span className="pq-star s3" style={{ left: '84%', top: '34px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        {ok ? <span className="pq-chip">{t.chip}</span>
          : <span className="pq-taphint">{sel && sel.kind === 'num' ? t.hintModel : t.hintNum}</span>}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
