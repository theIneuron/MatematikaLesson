// Amaliyot23 (1-sinf) — P15 Yechimni tuz: syujet → yozuv (fishkalardan) · Blok 6 · daraja 🟡 · teg: build_equation
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-fishka → bo'sh katakka joylash. Animatsiya: to'g'rida yozuv yashil, qushlar sahnasi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = ['4', '+', '2', '6'];   // 4 + 2 = 6
const CHIPS = [
  { id: 'c1', v: '2' }, { id: 'c2', v: '+' }, { id: 'c3', v: '4' },
  { id: 'c4', v: '−' }, { id: 'c5', v: '6' }, { id: 'c6', v: '5' },
];
const BIRDS_A = 4, BIRDS_B = 2;
const DATA = { target: TARGET.join(' '), tag: 'build_equation', level: '🟡', block: 6, ptype: 'P15' };

const T = {
  uz: {
    title: 'Yechimni tuz',
    setup: 'Shoxda 4 qush bor edi, yana 2 tasi uchib keldi.',
    ask: 'Yechim yozuvini fishkalardan tuz.',
    correct: 'Barakalla! 4 + 2 = 6. Shoxda 6 ta qush bo\'ldi.',
    wrong: 'Yozuv to\'g\'ri emas. Qushlar ko\'paydi — qo\'shamiz: 4 + 2 = 6. Fishkalarni tartib bilan joyla.',
    hint: 'Fishkani bosib, katakka qo\'y',
  },
  ru: {
    title: 'Собери решение',
    setup: 'На ветке было 4 птицы, прилетели ещё 2.',
    ask: 'Собери запись решения из фишек.',
    correct: 'Молодец! 4 + 2 = 6. На ветке стало 6 птиц.',
    wrong: 'Запись неверная. Птиц стало больше — складываем: 4 + 2 = 6. Расставь фишки по порядку.',
    hint: 'Нажми фишку, чтобы поставить в клетку',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot23(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [slots, setSlots] = useState([null, null, null, null]);   // chip id yoki null
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const filled = slots.filter((s) => s != null).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.slots) {
      setSlots(initialAnswer.studentAnswer.slots);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(filled === 4 && !checked); }, [filled, checked, onReady]);

  const valOf = (id) => { const c = CHIPS.find((x) => x.id === id); return c ? c.v : ''; };
  const usedIds = slots.filter(Boolean);

  const placeChip = (id) => {
    if (isReview || checked || usedIds.includes(id)) return;
    setFeedback(null);
    setSlots((s) => { const n = [...s]; const idx = n.indexOf(null); if (idx >= 0) n[idx] = id; return n; });
  };
  const clearSlot = (idx) => {
    if (isReview || checked || slots[idx] == null) return;
    setFeedback(null);
    setSlots((s) => { const n = [...s]; n[idx] = null; return n; });
  };

  const check = useCallback(() => {
    const got = slots.map(valOf);
    const correct = got.length === 4 && got.every((v, i) => v === TARGET[i]);
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: CHIPS.map((c) => c.v),
      studentAnswer: { slots, record: got.join(' ') }, correctAnswer: { record: TARGET.join(' ') },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [slots, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq23">
      <style>{`
        .aq23 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq23 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq23 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 14px; }
        .aq23 .aq-setup { color:#5c6672; font-weight:500; }
        .aq23 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq23 .aq-scene { display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap; padding:12px; background:#eef4fb; border-radius:14px; margin-bottom:14px; min-height:48px; }
        .aq23 .aq-bird { font-size:28px; }
        .aq23 .aq-bird.came { animation:aqFly .5s cubic-bezier(.3,1.2,.5,1) both; }
        .aq23 .aq-plus { color:#8aa0c0; font-weight:800; font-size:20px; }
        .aq23 .aq-record { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:4px; }
        .aq23 .aq-slot { width:58px; height:64px; border-radius:14px; border:3px dashed #b9c1cf; background:#fff;
          display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; color:#1f2430; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s; }
        .aq23 .aq-slot.full { border-style:solid; border-color:#2563eb; background:#e8eefc; }
        .aq23 .aq-slot.win { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq23 .aq-eq { font-size:28px; font-weight:800; color:#6b7280; }
        .aq23 .aq-hint { text-align:center; font-size:13px; color:#9aa1ad; margin:8px 0 0; }
        .aq23 .aq-bank { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:16px; }
        .aq23 .aq-chip { min-width:54px; height:54px; padding:0 8px; font-size:24px; font-weight:800; border-radius:14px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq23 .aq-chip:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq23 .aq-chip:active:not(:disabled) { transform:scale(.92); }
        .aq23 .aq-chip.used { opacity:.28; cursor:default; }
        .aq23 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq23 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq23 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqFly { 0%{opacity:0; transform:translateX(40px);} 100%{opacity:1; transform:translateX(0);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-scene">
        {Array.from({ length: BIRDS_A }).map((_, i) => <span key={'a' + i} className="aq-bird">🐦</span>)}
        <span className="aq-plus">+</span>
        {Array.from({ length: BIRDS_B }).map((_, i) => <span key={'b' + i} className="aq-bird came" style={{ animationDelay: `${i * 0.15}s` }}>🐦</span>)}
      </div>

      <div className="aq-record">
        <div className={'aq-slot' + (slots[0] ? (ok ? ' win' : ' full') : '')} onClick={() => clearSlot(0)}>{valOf(slots[0])}</div>
        <div className={'aq-slot' + (slots[1] ? (ok ? ' win' : ' full') : '')} onClick={() => clearSlot(1)}>{valOf(slots[1])}</div>
        <div className={'aq-slot' + (slots[2] ? (ok ? ' win' : ' full') : '')} onClick={() => clearSlot(2)}>{valOf(slots[2])}</div>
        <span className="aq-eq">=</span>
        <div className={'aq-slot' + (slots[3] ? (ok ? ' win' : ' full') : '')} onClick={() => clearSlot(3)}>{valOf(slots[3])}</div>
      </div>
      {!lock && <div className="aq-hint">{t.hint}</div>}

      <div className="aq-bank">
        {CHIPS.map((c) => {
          const used = usedIds.includes(c.id);
          return (
            <button key={c.id} type="button" className={'aq-chip' + (used ? ' used' : '')} disabled={lock || used}
              onClick={() => placeChip(c.id)}>{c.v}</button>
          );
        })}
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
