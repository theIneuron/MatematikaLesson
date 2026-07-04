// Amaliyot15 (1-sinf) — P10 Savatlarga saralash: doira / kvadrat · Blok 7 · daraja 🟡 · teg: sort_baskets
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash + tap-savat (shaklni tanlab, savatga joylash). Animatsiya: shakl savatga uchib kiradi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// aralash shakllar (id tartibi qat'iy)
const ITEMS = [
  { id: 0, shape: 'circle', e: '🔵' },
  { id: 1, shape: 'square', e: '🟦' },
  { id: 2, shape: 'square', e: '🟦' },
  { id: 3, shape: 'circle', e: '🔵' },
  { id: 4, shape: 'square', e: '🟦' },
  { id: 5, shape: 'circle', e: '🔵' },
];
const DATA = { tag: 'sort_baskets', level: '🟡', block: 7, ptype: 'P10' };

const T = {
  uz: {
    title: 'Savatlarga saralash',
    setup: 'Savatchada doira va kvadrat shakllar aralashib ketgan.',
    ask: 'Har shaklni o\'z savatiga ajrat: avval shaklni, keyin savatni bos.',
    circle: 'Doiralar', square: 'Kvadratlar', tray: 'Shakllar',
    correct: 'Barakalla! Barcha shakllar o\'z savatiga to\'g\'ri joylandi.',
    wrong: 'Ba\'zilari adashgan. Doira — doiralar savatiga, kvadrat — kvadratlar savatiga.',
  },
  ru: {
    title: 'Сортировка по корзинам',
    setup: 'В корзинке перемешались круги и квадраты.',
    ask: 'Разложи каждую фигуру: сначала фигуру, потом корзину.',
    circle: 'Круги', square: 'Квадраты', tray: 'Фигуры',
    correct: 'Молодец! Все фигуры разложены по своим корзинам.',
    wrong: 'Некоторые не там. Круг — в корзину кругов, квадрат — в корзину квадратов.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot15(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [assign, setAssign] = useState({});   // { id: 'circle'|'square' }
  const [selId, setSelId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const doneCount = Object.keys(assign).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.assign) {
      setAssign(initialAnswer.studentAnswer.assign);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(doneCount === ITEMS.length && !checked); }, [doneCount, checked, onReady]);

  const lock = isReview || checked;

  const tapItem = (id) => {
    if (lock) return;
    setFeedback(null);
    if (assign[id] != null) {       // savatdan qaytar
      setAssign((m) => { const n = { ...m }; delete n[id]; return n; });
      setSelId(null); return;
    }
    setSelId((s) => (s === id ? null : id));
  };
  const tapBasket = (basket) => {
    if (lock || selId == null) return;
    setFeedback(null);
    setAssign((m) => ({ ...m, [selId]: basket }));
    setSelId(null);
  };

  const check = useCallback(() => {
    const correct = ITEMS.every((it) => assign[it.id] === it.shape);
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: [t.circle, t.square],
      studentAnswer: { assign },
      correctAnswer: { assign: Object.fromEntries(ITEMS.map((it) => [it.id, it.shape])) },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [assign, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const inTray = ITEMS.filter((it) => assign[it.id] == null);
  const inBasket = (b) => ITEMS.filter((it) => assign[it.id] === b);
  const basketWrong = (b) => checked && !ok && inBasket(b).some((it) => it.shape !== b);

  const Basket = ({ b }) => (
    <button type="button" className={'aq-basket' + (selId != null && !lock ? ' arm' : '') + (ok ? ' win' : '') + (basketWrong(b) ? ' bad' : '')}
      onClick={() => tapBasket(b)} disabled={lock}>
      <div className="aq-blabel">{t[b]}</div>
      <div className="aq-bitems">
        {inBasket(b).map((it) => (
          <span key={it.id} className={'aq-shape in' + (checked && it.shape !== b ? ' err' : '')}
            onClick={(e) => { e.stopPropagation(); tapItem(it.id); }}>{it.e}</span>
        ))}
      </div>
    </button>
  );

  return (
    <div className="aq aq15">
      <style>{`
        .aq15 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq15 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq15 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq15 .aq-setup { color:#5c6672; font-weight:500; }
        .aq15 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq15 .aq-tray { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; min-height:56px; padding:12px; background:#f6f8fb; border-radius:14px; }
        .aq15 .aq-traylab { font-size:12px; color:#9aa1ad; font-weight:700; width:100%; text-align:center; margin-bottom:2px; }
        .aq15 .aq-shape { font-size:40px; line-height:1; cursor:pointer; border-radius:12px; padding:2px; transition:transform .1s, box-shadow .12s; }
        .aq15 .aq-shape:active { transform:scale(.9); }
        .aq15 .aq-shape.sel { box-shadow:0 0 0 3px #2563eb; }
        .aq15 .aq-shape.in { font-size:32px; animation:aqEnter .35s cubic-bezier(.3,1.3,.5,1) both; }
        .aq15 .aq-shape.err { box-shadow:0 0 0 3px #e6a6a6; }
        .aq15 .aq-baskets { display:flex; gap:14px; margin-top:16px; }
        .aq15 .aq-basket { flex:1; min-height:110px; border:3px dashed #c4b48a; border-radius:16px; background:#fbf7ef;
          cursor:default; padding:8px; display:flex; flex-direction:column; align-items:center; transition:border-color .12s, background .12s; }
        .aq15 .aq-basket.arm { border-color:#2563eb; background:#eef3ff; cursor:pointer; }
        .aq15 .aq-basket.win { border-style:solid; border-color:#1a7f43; background:#e8f7ee; }
        .aq15 .aq-basket.bad { border-color:#e6a6a6; }
        .aq15 .aq-blabel { font-size:14px; font-weight:800; color:#7a6535; margin-bottom:6px; }
        .aq15 .aq-bitems { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
        .aq15 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq15 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq15 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqEnter { 0%{opacity:0; transform:translateY(-20px) scale(.5);} 100%{opacity:1; transform:translateY(0) scale(1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-tray">
        <div className="aq-traylab">{t.tray}</div>
        {inTray.length === 0 && <span style={{ color: '#c2c8d2', fontSize: 14 }}>—</span>}
        {inTray.map((it) => (
          <span key={it.id} className={'aq-shape' + (selId === it.id ? ' sel' : '')} onClick={() => tapItem(it.id)}>{it.e}</span>
        ))}
      </div>

      <div className="aq-baskets">
        <Basket b="circle" />
        <Basket b="square" />
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
