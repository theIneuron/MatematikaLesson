// Amaliyot24 (1-sinf) — P19 Kvest-stansiya: sandiqni och (kod = misol javobi) · СК-1/ИК · daraja 🔴 · teg: quest_station
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'rida qulf ochiladi, sandiq porlaydi, mukofot chiqadi + uchqun.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 8, B = 6;
const CODE = A + B;          // 14
const OPTIONS = [13, 14, 15];
const DATA = { a: A, b: B, code: CODE, tag: 'quest_station', level: '🔴', block: 4, ptype: 'P19' };

const T = {
  uz: {
    title: 'Kvest: sehrli sandiq',
    setup: 'Xazina sandig\'i qulflangan. Qulf kodi — misolning javobi.',
    ask: 'Sandiqni och: 8 + 6 nechchi?',
    correct: 'Barakalla! 8 + 6 = 14. Sandiq ochildi — xazina seniki!',
    less: 'Kod to\'g\'ri kelmadi. 8 ni 10 gacha to\'ldir: 8 + 2 = 10, keyin 4 qo\'sh — 14.',
    more: 'Ko\'p. 8 + 6 = 14. O\'nlikdan o\'tib sana: 8 + 2 = 10, 10 + 4 = 14.',
    locked: 'Qulflangan', opened: 'Ochildi!',
  },
  ru: {
    title: 'Квест: волшебный сундук',
    setup: 'Сундук с сокровищами заперт. Код замка — ответ примера.',
    ask: 'Открой сундук: сколько будет 8 + 6?',
    correct: 'Молодец! 8 + 6 = 14. Сундук открылся — сокровище твоё!',
    less: 'Код не подошёл. Дополни 8 до 10: 8 + 2 = 10, потом прибавь 4 — 14.',
    more: 'Много. 8 + 6 = 14. Считай через десяток: 8 + 2 = 10, 10 + 4 = 14.',
    locked: 'Заперт', opened: 'Открыт!',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const SPARKS = [[-52, -30], [52, -30], [-64, 8], [64, 8], [0, -60], [-24, 42], [24, 42]];
const Sparks = ({ show }) => show ? (
  <div className="aq-sparks">{SPARKS.map((d, i) => (
    <span key={i} className="aq-spark" style={{ '--dx': d[0] + 'px', '--dy': d[1] + 'px', animationDelay: `${i * 0.03}s` }}>✨</span>
  ))}</div>
) : null;

export default function Amaliyot24(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CODE;
    const msg = correct ? t.correct : (picked < CODE ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: CODE },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq24">
      <style>{`
        .aq24 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq24 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq24 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq24 .aq-setup { color:#5c6672; font-weight:500; }
        .aq24 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq24 .aq-stage { position:relative; display:flex; justify-content:center; }
        .aq24 .aq-chest { width:220px; padding:18px; border-radius:20px; text-align:center;
          background:#f3ede0; border:3px solid #d8c69a; transition:background .3s, border-color .3s; }
        .aq24 .aq-chest.win { background:#e8f7ee; border-color:#1a7f43; animation:aqCele .5s ease; }
        .aq24 .aq-icon { font-size:66px; line-height:1; }
        .aq24 .aq-reward { font-size:40px; margin-top:2px; animation:aqRise .5s cubic-bezier(.3,1.4,.5,1) both; }
        .aq24 .aq-state { margin-top:6px; font-size:14px; font-weight:800; color:#a9843d; letter-spacing:.02em; }
        .aq24 .aq-chest.win .aq-state { color:#1a7f43; }
        .aq24 .aq-sparks { position:absolute; left:50%; top:42%; width:0; height:0; pointer-events:none; }
        .aq24 .aq-spark { position:absolute; font-size:22px; animation:aqSpark .8s ease-out forwards; }
        .aq24 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq24 .aq-opt { min-width:74px; height:66px; padding:0 8px; font-size:27px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq24 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq24 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq24 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq24 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq24 .aq-opt:disabled { cursor:default; }
        .aq24 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq24 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq24 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqRise { 0%{opacity:0; transform:translateY(16px) scale(.4);} 100%{opacity:1; transform:translateY(0) scale(1);} }
        @keyframes aqSpark { 0%{opacity:0; transform:translate(0,0) scale(.4);} 20%{opacity:1;} 100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(1.1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-stage">
        <div className={'aq-chest' + (ok ? ' win' : '')}>
          <div className="aq-icon">{ok ? '🧰' : '🔒'}</div>
          {ok ? <div className="aq-reward">🏆</div> : <div className="aq-state">{t.locked} · 8 + 6 = ?</div>}
          {ok && <div className="aq-state">{t.opened} 8 + 6 = {CODE}</div>}
        </div>
        <Sparks show={ok} />
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === CODE;
          return (
            <button key={n} type="button" className={'aq-opt' + (right ? ' right' : picked === n ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
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
