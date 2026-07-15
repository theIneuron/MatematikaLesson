// Dars22 · Amaliyot 05 — Zanjir: to'rt juft son, har juftga belgi (>, <, =) · compare_chain · 🔴
// 2×2 TOZA kartalar (metodist talabi: bog' sahnasi TO'LIQ olib tashlandi, timsoh/savat dekorlarsiz):
// har kartada "A ? B" ifoda + 3 belgi-variant (>, <, =). Qatorlar: 23<32, 50=50, 61>59, 47>43.
// Savol matni ANIQ: har kartada ikkita son bor — bola solishtirib belgini tanlaydi.
// Qoida: AVVAL o'nliklar, teng bo'lsa BIRLIKLAR. G'alabada har karta ostida qisqa o'nlik-birlik izohi.
// ANSWER-LEAK yo'q: slotda '?' yoki bolaning tanlagan belgisi; to'g'ri belgi FAQAT g'alabada tasdiqlanadi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry cheklanmagan; setChecked FAQAT hammasi to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SIGNS = ['>', '<', '=']; // belgi variantlari — matn ko'rinishidagi qiymatlar (literal < > EMAS)

// Har karta: taqqoslash arifmetik jihatdan to'g'ri. bigger: 'L' chap, 'R' o'ng, 'E' teng.
const ROWS = [
  { a: 23, b: 32, target: '<' },
  { a: 50, b: 50, target: '=' },
  { a: 61, b: 59, target: '>' },
  { a: 47, b: 43, target: '>' },
].map((r) => ({
  ...r,
  tensA: Math.floor(r.a / 10), unitsA: r.a % 10,
  tensB: Math.floor(r.b / 10), unitsB: r.b % 10,
  bigger: r.a > r.b ? 'L' : (r.a < r.b ? 'R' : 'E'),
}));
const N = ROWS.length;
const DATA = { level: '🔴', tag: 'compare_chain' };

const T = {
  uz: {
    eyebrow: "Taqqoslash · Zanjir",
    setup: "Har kartada ikkita son bor.",
    ask: "Sonlarni solishtiring va belgini tanlang.",
    correct: "Barakalla! Har juftni to'g'ri solishtirdingiz.",
    hint: "Avval o'nliklar, teng bo'lsa birliklar.",
    tensLbl: "o'nliklar", tensEq: "o'nliklar teng", unitLbl: "birliklar",
  },
  ru: {
    eyebrow: "Сравнение · Цепочка",
    setup: "На каждой карточке два числа.",
    ask: "Сравни числа и выбери знак.",
    correct: "Молодец! Ты верно сравнил каждую пару.",
    hint: "Сначала десятки, если равны — единицы.",
    tensLbl: "десятки", tensEq: "десятки равны", unitLbl: "единицы",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D22_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // { rowIdx: belgi-satri }
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda g'alaba-animatsiya (cele/izoh-pop) qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady]);

  const rowRight = (i) => vals[i] === ROWS[i].target;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.target);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: ROWS.map((r) => `${r.a} _ ${r.b}`),
      studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) },
      correctAnswer: { vals: ROWS.map((r) => r.target) },
      correct, meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  // Tens-first izoh (g'alabada har karta ostida): o'nliklar birinchi, teng bo'lsa birliklar.
  const stepText = (r) => {
    if (r.bigger === 'E') return `${r.a} ${r.target} ${r.b}`;
    if (r.tensA === r.tensB) return `${t.tensEq}, ${t.unitLbl}: ${r.unitsA} ${r.target} ${r.unitsB}`;
    return `${t.tensLbl}: ${r.tensA} ${r.target} ${r.tensB}`;
  };

  return (
    <div className="pq pq2205">
      <style>{`
        .pq2205{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2205 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2205 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq2205 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2205 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        /* 2x2 toza kartalar panjarasi — sahna/dekor YO'Q, diqqat faqat sonlarda */
        .pq2205 .pq-grid{display:grid;grid-template-columns:1fr;gap:10px;width:100%;max-width:360px;margin:0 auto;}
        @media (min-width:480px){.pq2205 .pq-grid{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2205 .pq-card{display:flex;flex-direction:column;align-items:center;gap:9px;padding:12px 6px 11px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;box-shadow:0 2px 6px rgba(60,80,110,.08);transition:.15s;}
        .pq2205 .pq-card.good{border-color:#1a7f43;background:#f2fbf5;}
        .pq2205 .pq-card.good.win{animation:pq2205cele .5s ease;}
        .pq2205 .pq-card.bad{border-color:#e0a86a;background:#fdf4e8;animation:pq2205shake .35s ease;}

        .pq2205 .pq-pair{display:flex;align-items:center;justify-content:center;gap:7px;font-variant-numeric:tabular-nums;}
        .pq2205 .pq-pair b{min-width:48px;height:42px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:900;color:#2b3550;background:#f4f6fa;border:2px solid #dbe2ec;border-radius:11px;}
        .pq2205 .pq-pair b.win{color:#1a7f43;border-color:#1a7f43;background:#e8f7ee;}
        .pq2205 .pq-slot{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:2.5px dashed #b9c4d4;background:#fff;font-size:20px;font-weight:900;color:#8a94a2;line-height:1;}
        .pq2205 .pq-slot.set{border-style:solid;border-color:#2563eb;color:#2563eb;}
        .pq2205 .pq-slot.done{border-style:solid;border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;}

        .pq2205 .pq-pick{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;}
        .pq2205 .pq-sg{width:46px;height:40px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:22px;font-weight:900;color:#374151;cursor:pointer;line-height:1;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq2205 .pq-sg:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2205 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2205 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2205 .pq-sg:disabled{cursor:default;}
        .pq2205 .pq-step{text-align:center;font-size:12px;font-weight:800;color:#5c7a4a;font-variant-numeric:tabular-nums;padding:3px 9px;border-radius:9px;background:#eefaf1;animation:pq2205in .3s .1s both;}

        .pq2205 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2205in .22s ease both;}
        .pq2205 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2205 .pq-fb.no{background:#fdecec;color:#c0392b;}

        /* review/qayta ochilishda g'alaba-animatsiyalar to'xtaydi */
        .pq2205 .pq-grid.still .pq-card.good.win,.pq2205 .pq-grid.still .pq-card.bad,.pq2205 .pq-grid.still .pq-step{animation:none;}

        @keyframes pq2205cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2205shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2205in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-grid' + (still ? ' still' : '')}>
        {ROWS.map((r, i) => {
          const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
          const winL = ok && (r.bigger === 'L' || r.bigger === 'E');
          const winR = ok && (r.bigger === 'R' || r.bigger === 'E');
          return (
            <div key={i} className={'pq-card' + cls}>
              <div className="pq-pair">
                <b className={winL ? 'win' : ''}>{r.a}</b>
                <span className={'pq-slot' + (ok ? ' done' : vals[i] != null ? ' set' : '')}>{ok ? r.target : (vals[i] != null ? vals[i] : '?')}</span>
                <b className={winR ? 'win' : ''}>{r.b}</b>
              </div>

              {ok ? (
                <div className="pq-step">{stepText(r)}</div>
              ) : (
                <div className="pq-pick">
                  {SIGNS.map((s) => (
                    <button key={s} type="button" className={'pq-sg' + (vals[i] === s ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: s })); setFeedback(null); }}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
