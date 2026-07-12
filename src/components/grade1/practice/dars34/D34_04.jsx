// Dars34 · Amaliyot 04 — «1 dm necha sm?» · Blok 7 o'lchash · Birlikni almashtir (convert) · 🟡 · tag: convert_dm
// Chizg'ich (ruler, shkalasi oxirigacha belgilangan 0..15) + «1 dm» yorliqli kesma 0..10 oralig'ida. Bola dm ni sm ga o'giradi.
// Variantlar (text): '1 sm' = M2 (1 dm=1 sm xato), '100 sm' = M1 (birlik chalkash), to'g'ri '10 sm' (index 1).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint: «1 dm — o'nta sm».
// ANSWER-LEAK: chizg'ich+kesma DATA (ko'rsatish halol); javob — bolaning o'qishi; g'alabagacha variant neytral.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); uchqun yakuniy holatini statik ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Kesma uzunligi = 10 sm (1 dm), 0..10 chizg'ichda. sm = 20px, 0-belgi x=16.
const LEN = 10; // sm
const OPTIONS = ['1 sm', '10 sm', '100 sm'];
const CORRECT = '10 sm'; // index 1
const DATA = { len_sm: LEN, unit: 'dm', options: OPTIONS, correct: CORRECT, level: '🟡', tag: 'convert_dm' };

const T = {
  uz: {
    eyebrow: "O'lchash · Detsimetr", title: "1 dm",
    setup: "Lentaning uzunligi — roppa-rosa 1 dm.",
    ask: "1 dm necha sm?",
    sub: "Chizg'ichdan o'qing: lenta 0 dan qaysi raqamgacha yetdi?",
    correct: "Barakalla! Lenta 0 dan 10 gacha — 1 dm = 10 sm.",
    hint: "Lenta 0 dan boshlanadi. Uchi qaysi raqamda tugaydi? 1 dm — o'nta sm.",
  },
  ru: {
    eyebrow: "Измерение · Дециметр", title: "1 дм",
    setup: "Длина ленты — ровно 1 дм.",
    ask: "1 дм — сколько см?",
    sub: "Прочитай по линейке: от 0 до какого числа дошла лента?",
    correct: "Молодец! Лента от 0 до 10 — 1 дм = 10 см.",
    hint: "Лента начинается от 0. У какого числа её конец? 1 дм — это десять см.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizg'ich kanoni: viewBox 0 0 330 96; 0-belgi x=16; har sm = 20px; dm-belgilar (0,10) uzunroq/qalinroq.
// SHKALA TO'LIQ: 0..15 — har sm raqamli, oraliqda 5 mm mayda tirqish; tana yog'och (gradient + yaltiroq qirra).
// Kesma (1 dm) chizg'ich ustida, chap uchi aynan 0-da, o'ng uchi 16+10*20 = 216; ustida «1 dm» yorlig'i.
const MARKS = 15; // shkala chizg'ich oxirigacha belgilangan (0..15)
const Ruler = ({ on, dmLabel, unit }) => {
  const X0 = 16, STEP = 20;
  const x = (n) => X0 + n * STEP;
  const seg = on ? '#1a7f43' : '#e2683f';
  const segTop = on ? '#3fbf72' : '#f2926f';
  const cap = on ? '#0f5c30' : '#b84a24';
  const ticks = [];
  for (let n = 0; n <= MARKS; n++) {
    const isDm = n % 10 === 0;
    ticks.push(
      <line key={'t' + n} x1={x(n)} y1={38} x2={x(n)} y2={isDm ? 58 : 52}
        stroke={isDm ? '#6b4a1f' : '#9a7434'} strokeWidth={isDm ? 2.4 : 1.3} strokeLinecap="round" />
    );
    if (n < MARKS) ticks.push(
      <line key={'m' + n} x1={x(n) + STEP / 2} y1={38} x2={x(n) + STEP / 2} y2={45}
        stroke="#b08d4a" strokeWidth="0.9" />
    );
    ticks.push(
      <text key={'n' + n} x={x(n)} y={72} textAnchor="middle"
        fontSize={isDm ? 10.5 : 9.5} fontWeight={isDm ? 800 : 600}
        fill={isDm ? '#5c3f1a' : '#7a5a2b'} fontFamily="'Manrope',sans-serif">{n}</text>
    );
  }
  return (
    <svg viewBox="0 0 330 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="pq3404wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7ecce" /><stop offset="1" stopColor="#e7cf9d" />
        </linearGradient>
      </defs>
      {/* O'lchanayotgan kesma (1 dm) — chizg'ich ustida, 0..10; uch chegaralari + «1 dm» yorlig'i */}
      <rect x={x(0)} y={10} width={LEN * STEP} height={18} rx={6} fill={seg} stroke={cap} strokeWidth="1.5" />
      <rect x={x(0)} y={12.5} width={LEN * STEP} height={5} rx={2.5} fill={segTop} opacity=".85" />
      <line x1={x(0)} y1={5} x2={x(0)} y2={33} stroke={cap} strokeWidth="2.2" strokeLinecap="round" />
      <line x1={x(LEN)} y1={5} x2={x(LEN)} y2={33} stroke={cap} strokeWidth="2.2" strokeLinecap="round" />
      <text x={x(LEN / 2)} y={23.5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="'Manrope',sans-serif">{dmLabel}</text>
      {/* G'alabada kesma yonida natija */}
      {on && <text className="pq-winlab" x={x(LEN) + 10} y={23.5} textAnchor="start" fontSize="13" fontWeight="800" fill="#1a7f43" fontFamily="'Manrope',sans-serif">= 10 {unit}</text>}
      {/* Chizg'ich tanasi (yog'och) — shkala tananing oxirigacha boradi */}
      <rect x={4} y={38} width={322} height={50} rx={7} fill="url(#pq3404wood)" stroke="#c9a95f" strokeWidth="1.6" />
      <rect x={4} y={38} width={322} height={7} rx={7} fill="#fff" opacity=".4" />
      {ticks}
    </svg>
  );
};

export default function D34_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => lang === 'ru' ? String(s).replace(/sm/g, 'см').replace(/dm/g, 'дм').replace(/m/g, 'м') : s;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS, studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3404" + (still ? " still" : "")}>
      <style>{`
        .pq3404.still *{animation:none !important;}
        .pq3404.still .pq-spark{opacity:1;}
        .pq3404{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3404 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c47a2b;text-transform:uppercase;}
        .pq3404 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3404 .pq-setup{display:block;color:#5c6672;font-weight:600;font-size:15px;}
        .pq3404 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3404 .pq-sub{display:block;font-size:14px;font-weight:600;color:#8a6a2e;margin-top:2px;}
        .pq3404 .pq-winlab{animation:pq3404pop .45s ease both;}
        .pq3404 .pq-board{box-sizing:border-box;position:relative;width:360px;max-width:100%;margin:0 auto;padding:38px 16px 18px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f4ead2 100%);border:2px solid #e6d3a6;overflow:hidden;}
        .pq3404 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d79a44,#b9772a);border:2.5px solid #9c5f1f;color:#fff8ec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3404 .pq-ruler{position:relative;z-index:3;width:100%;margin:2px auto 16px;}
        .pq3404 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;}
        .pq3404 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;min-height:52px;padding:10px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #e0cfa4;cursor:pointer;transition:.12s;font-size:19px;font-weight:800;color:#5c4a2a;box-shadow:0 3px 8px rgba(90,70,30,.12);}
        .pq3404 .pq-opt:hover:not(:disabled){background:#fffaf0;border-color:#d0b876;}
        .pq3404 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3404 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3404 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3404cele .5s ease;}
        .pq3404 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3404 .pq-opt:disabled{cursor:default;}
        .pq3404 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3404pop .45s ease both;}
        .pq3404 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3404tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3404 .pq-spark.s2{animation-delay:-.6s;} .pq3404 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3404 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3404in .22s ease both;}
        .pq3404 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3404 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3404pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3404tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3404cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3404in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b><span className="pq-sub">{t.sub}</span></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Chizg'ich (shkala oxirigacha belgilangan) + 1 dm kesma (0..10). Bu DATA — bolaning o'qishi javob. */}
        <div className="pq-ruler"><Ruler on={ok} dmLabel={lang === 'ru' ? '1 дм' : '1 dm'} unit={lang === 'ru' ? 'см' : 'sm'} /></div>

        {/* Text-variantlar: to'g'ri '10 sm' index 1 (chapdan emas). */}
        <div className="pq-opts">
          {OPTIONS.map((o) => {
            const sel = picked === o;
            const right = ok && o === CORRECT;
            const dim = ok && o !== CORRECT;
            return (
              <button
                key={o}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o); setFeedback(null); }}
              >
                {uL(o)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '44px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '88%', top: '52px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
