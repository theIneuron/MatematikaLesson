// Amaliyot11 (1-sinf) — P26 Massa: qaysi og'irroq? (tarozi) · Blok 7 · daraja 🟡 · teg: mass_compare
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: tekshirilganda tarozi og'ir tomonga egiladi (haqiqiy palla harakati) — massa ko'rinadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// chap palla — tarvuz (og'ir), o'ng — olma (yengil)
const HEAVY = 'left';
const ITEMS = { left: { emoji: '🍉', uz: 'tarvuz', ru: 'арбуз' }, right: { emoji: '🍎', uz: 'olma', ru: 'яблоко' } };
const DATA = { heavy: HEAVY, tag: 'mass_compare', level: '🟡', block: 7, ptype: 'P26' };

const T = {
  uz: {
    title: 'Massa — qaysi og\'ir?',
    setup: 'Tarozining ikki pallasiga meva qo\'yildi. Og\'ir narsa pallani pastga bosadi.',
    ask: 'Qaysi meva og\'irroq? Uni tanla.',
    correct: 'Barakalla! Tarvuz og\'irroq — u pallani pastga bosdi.',
    wrong: 'Olma yengil. Tarvuz kattaroq va og\'irroq — tarozi buni ko\'rsatdi.',
  },
  ru: {
    title: 'Масса — что тяжелее?',
    setup: 'На две чаши весов положили фрукты. Тяжёлое тянет чашу вниз.',
    ask: 'Какой фрукт тяжелее? Выбери его.',
    correct: 'Молодец! Арбуз тяжелее — он перевесил чашу вниз.',
    wrong: 'Яблоко лёгкое. Арбуз крупнее и тяжелее — весы это показали.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot11(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);   // 'left' | 'right'
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.side) setPicked(initialAnswer.studentAnswer.side);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (!picked) return;
    const correct = picked === HEAVY;
    setFeedback({ correct, msg: correct ? t.correct : t.wrong }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: [ITEMS.left[lang], ITEMS.right[lang]],
      studentAnswer: { side: picked, item: ITEMS[picked][lang] },
      correctAnswer: { side: HEAVY, item: ITEMS[HEAVY][lang] },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, lang, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const revealed = checked; // tekshirilgach tarozi haqiqatni ko'rsatadi

  return (
    <div className="aq aq11">
      <style>{`
        .aq11 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq11 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq11 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq11 .aq-setup { color:#5c6672; font-weight:500; }
        .aq11 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq11 .aq-scale { position:relative; height:210px; margin:0 auto 6px; max-width:360px; }
        .aq11 .aq-beam { position:absolute; left:50%; top:34px; width:280px; height:12px; margin-left:-140px;
          background:linear-gradient(#c79a5b,#a9793d); border-radius:8px; transform-origin:50% 50%;
          transition:transform .8s cubic-bezier(.4,1.3,.5,1); }
        .aq11 .aq-beam.tipL { transform:rotate(-11deg); }
        .aq11 .aq-knob { position:absolute; left:50%; top:-8px; width:18px; height:18px; margin-left:-9px; border-radius:50%; background:#8a5f2c; }
        .aq11 .aq-pan { position:absolute; top:12px; width:112px; display:flex; flex-direction:column; align-items:center; }
        .aq11 .aq-pan.left { left:-56px; }
        .aq11 .aq-pan.right { right:-56px; }
        .aq11 .aq-str { width:2px; height:30px; background:#9a9a9a; }
        .aq11 .aq-tray { width:104px; height:60px; border:3px solid #b9a06a; border-top:none;
          border-radius:0 0 60px 60px; background:#f6efe0; display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:box-shadow .12s, border-color .12s; }
        .aq11 .aq-tray:hover:not(.lock) { border-color:#9bb6f0; }
        .aq11 .aq-tray.sel { border-color:#2563eb; box-shadow:0 0 0 3px #dbe6ff; }
        .aq11 .aq-tray.win { border-color:#1a7f43; box-shadow:0 0 0 3px #cdeed7; }
        .aq11 .aq-tray.lock { cursor:default; }
        .aq11 .aq-fruit { font-size:44px; line-height:1; }
        .aq11 .aq-name { margin-top:6px; font-size:14px; font-weight:700; color:#5c6672; }
        .aq11 .aq-name.heavy { color:#1a7f43; }
        .aq11 .aq-post { position:absolute; left:50%; top:44px; width:12px; height:120px; margin-left:-6px; background:linear-gradient(#b98c4e,#8a5f2c); }
        .aq11 .aq-base { position:absolute; left:50%; bottom:6px; width:150px; height:14px; margin-left:-75px; background:#8a5f2c; border-radius:7px; }
        /* egilishda pallalar tik qoladi (counter-rotate) */
        .aq11 .aq-scale.tipL .aq-pan.left { transform:translateY(26px); }
        .aq11 .aq-scale.tipL .aq-pan.right { transform:translateY(-26px); }
        .aq11 .aq-pan { transition:transform .8s cubic-bezier(.4,1.3,.5,1); }
        .aq11 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq11 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq11 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className={'aq-scale' + (revealed ? ' tipL' : '')}>
        <div className="aq-post" />
        <div className="aq-base" />
        <div className={'aq-beam' + (revealed ? ' tipL' : '')}>
          <div className="aq-knob" />
        </div>

        <div className="aq-pan left">
          <div className="aq-str" />
          <div className={'aq-tray' + (lock ? ' lock' : '') + (picked === 'left' && !revealed ? ' sel' : '') + (revealed && HEAVY === 'left' ? ' win' : '')}
            onClick={() => { if (!lock) { setPicked('left'); setFeedback(null); } }}>
            <span className="aq-fruit">{ITEMS.left.emoji}</span>
          </div>
          <div className={'aq-name' + (revealed && HEAVY === 'left' ? ' heavy' : '')}>{ITEMS.left[lang]}</div>
        </div>

        <div className="aq-pan right">
          <div className="aq-str" />
          <div className={'aq-tray' + (lock ? ' lock' : '') + (picked === 'right' && !revealed ? ' sel' : '') + (revealed && HEAVY === 'right' ? ' win' : '')}
            onClick={() => { if (!lock) { setPicked('right'); setFeedback(null); } }}>
            <span className="aq-fruit">{ITEMS.right.emoji}</span>
          </div>
          <div className={'aq-name' + (revealed && HEAVY === 'right' ? ' heavy' : '')}>{ITEMS.right[lang]}</div>
        </div>
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
