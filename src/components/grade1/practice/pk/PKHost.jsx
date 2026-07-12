// PKHost — 1-sinf ПК/ИК geyt-xosti. Bir nechta jsx-question topshiriqni KETMA-KET yuritadi,
// har birning BIRINCHI urinishini yozib boradi, oxirida BALL + o'tdi/qayt natija ekranini beradi.
// jsx-question kontraktidan foydalanadi: onReady/registerCheck/onSubmit (correct:boolean), playCorrect/playWrong.
// Reja: PK_IK_REJA_1SINF.md — ПК = intерактив+тест, ≥passPct → o'tdi (keyingi blok), aks holda → mavzuni takrorla.
import React, { useState, useEffect, useRef, useCallback } from 'react';

export function usePKZoom() {
  useEffect(() => {
    const el = document.documentElement;
    const apply = () => {
      const w = window.innerWidth;
      el.style.setProperty('--pkz', w < 640 ? String(+(w / 390).toFixed(3)) : '1');
    };
    apply(); window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);
}

const IconOk = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const Star = ({ fill = '#ffd13f' }) => (<svg width="30" height="30" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

const TT = {
  uz: {
    q: 'Savol', of: '/', check: 'Tekshirish', next: 'Keyingi', result: 'Natija',
    passTitle: 'Zo\'r! Blokni o\'tding', failTitle: 'Yana biroz mashq qilamiz',
    scoreOf: (c, n) => `${n} tadan ${c} to\'g\'ri`,
    passMsg: 'Endi keyingi blokka o\'tsa bo\'ladi.',
    failMsg: 'Quyidagi mavzularni yana takrorlaymiz:',
    retry: 'Qaytadan', pass: 'o\'tding', pct: '%',
  },
  ru: {
    q: 'Вопрос', of: '/', check: 'Проверить', next: 'Дальше', result: 'Итог',
    passTitle: 'Отлично! Блок пройден', failTitle: 'Ещё немного потренируемся',
    scoreOf: (c, n) => `${c} из ${n} верно`,
    passMsg: 'Можно переходить к следующему блоку.',
    failMsg: 'Повторим эти темы:',
    retry: 'Заново', pass: 'пройдено', pct: '%',
  },
};

export default function PKHost({ title, block, tasks = [], passPct = 80, lang: langProp }) {
  usePKZoom();
  const [lang, setLang] = useState(langProp || 'uz');
  const t = TT[lang] || TT.uz;
  const N = tasks.length;

  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]); // {correct} har topshiriq bo'yicha (birinchi urinish)
  const [answered, setAnswered] = useState(false);
  const [canCheck, setCanCheck] = useState(false);
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'result'

  const checkFnRef = useRef(null);
  const onReady = useCallback((ok) => setCanCheck(!!ok), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((payload) => {
    setAnswered((was) => {
      if (!was) setResults((prev) => [...prev, { correct: !!(payload && payload.correct), topic: tasks[idx] && tasks[idx].topic }]);
      return true;
    });
  }, [idx, tasks]);

  const doCheck = () => { if (canCheck && !answered && checkFnRef.current) checkFnRef.current(); };
  const goNext = () => {
    if (idx + 1 < N) { setIdx(idx + 1); setAnswered(false); setCanCheck(false); }
    else setPhase('result');
  };
  const restart = () => { setIdx(0); setResults([]); setAnswered(false); setCanCheck(false); setPhase('quiz'); };

  const Q = tasks[idx] && tasks[idx].C;
  const correctCount = results.filter((r) => r.correct).length;
  const pct = N ? Math.round((correctCount / N) * 100) : 0;
  const passed = pct >= passPct;
  const weakTopics = [...new Set(results.filter((r) => !r.correct && r.topic).map((r) => r.topic))];

  const chip = (active) => ({
    padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 800, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'), background: active ? '#2563eb' : '#fff',
    color: active ? '#fff' : '#374151', fontFamily: "'Manrope',system-ui,sans-serif",
  });

  return (
    <div className="pk-root">
      <style>{`
        .pk-root{position:fixed;inset:0;overflow:hidden;background:#f6f8fb;display:flex;flex-direction:column;zoom:var(--pkz,1);font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        @media (max-width:639.98px){.pk-root{width:390px;}}
        .pk-top{flex-shrink:0;padding:52px 14px 10px;background:#fff;border-bottom:1px solid #eef0f4;}
        .pk-titrow{display:flex;align-items:center;justify-content:space-between;gap:8px;}
        .pk-title{font-size:15px;font-weight:900;color:#1f2430;}
        .pk-title small{display:block;font-size:11.5px;font-weight:800;color:#4e9d54;letter-spacing:.03em;text-transform:uppercase;}
        .pk-langs{display:flex;gap:6px;}
        .pk-dots{display:flex;gap:5px;margin-top:11px;flex-wrap:wrap;}
        .pk-dot{width:22px;height:7px;border-radius:4px;background:#e2e6ee;transition:.2s;}
        .pk-dot.cur{background:#f0c561;}
        .pk-dot.ok{background:#3f9a4e;} .pk-dot.no{background:#e07a72;}
        .pk-body{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;}
        .pk-qwrap{flex:1;min-height:0;padding:8px 8px 4px;}
        .pk-foot{flex-shrink:0;padding:10px 14px calc(12px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #eef0f4;display:flex;justify-content:center;}
        .pk-btn{min-width:220px;max-width:100%;padding:15px 22px;border-radius:16px;border:none;font-size:18px;font-weight:900;font-family:inherit;cursor:pointer;transition:.12s;color:#fff;}
        .pk-btn.check{background:#2563eb;box-shadow:0 3px 0 #1c4fbf;} .pk-btn.check:disabled{background:#c7cdd8;box-shadow:0 3px 0 #b3bac6;cursor:default;}
        .pk-btn.next{background:#2f9e57;box-shadow:0 3px 0 #247842;}
        .pk-btn:active:not(:disabled){transform:translateY(2px);box-shadow:none;}
        /* natija */
        .pk-res{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px 18px;text-align:center;}
        .pk-badge{width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 8px 22px rgba(0,0,0,.12);}
        .pk-badge.ok{background:linear-gradient(#eafaef,#d7f2df);color:#1a7f43;border:4px solid #3f9a4e;}
        .pk-badge.no{background:linear-gradient(#fdeeee,#fbe0e0);color:#c0392b;border:4px solid #e07a72;}
        .pk-stars{display:flex;gap:4px;}
        .pk-rtitle{font-size:22px;font-weight:900;}
        .pk-rscore{font-size:17px;font-weight:800;color:#5c6672;}
        .pk-rmsg{font-size:15px;font-weight:600;color:#5c6672;max-width:320px;}
        .pk-weak{display:flex;flex-direction:column;gap:6px;margin-top:2px;}
        .pk-weak b{font-size:14px;font-weight:800;color:#b5641b;background:#fff4e2;border:1.5px solid #f0c877;border-radius:10px;padding:7px 14px;}
        .pk-marks{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:4px;}
        .pk-mark{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;}
        .pk-mark.ok{background:#3f9a4e;} .pk-mark.no{background:#e07a72;}
      `}</style>

      <div className="pk-top">
        <div className="pk-titrow">
          <div className="pk-title"><small>{block}</small>{title}</div>
          <div className="pk-langs">
            <button type="button" style={chip(lang === 'uz')} onClick={() => setLang('uz')}>UZ</button>
            <button type="button" style={chip(lang === 'ru')} onClick={() => setLang('ru')}>RU</button>
          </div>
        </div>
        <div className="pk-dots">
          {tasks.map((_, i) => {
            const r = results[i];
            const cls = i === idx && phase === 'quiz' ? ' cur' : r ? (r.correct ? ' ok' : ' no') : '';
            return <span key={i} className={'pk-dot' + cls} />;
          })}
        </div>
      </div>

      {phase === 'quiz' ? (
        <>
          <div className="pk-body">
            <div className="pk-qwrap">
              {Q && (
                <Q key={idx} lang={lang} mode="answer" onReady={onReady} registerCheck={registerCheck}
                  onSubmit={onSubmit} playCorrect={() => {}} playWrong={() => {}} />
              )}
            </div>
          </div>
          <div className="pk-foot">
            {!answered
              ? <button type="button" className="pk-btn check" disabled={!canCheck} onClick={doCheck}>{t.check}</button>
              : <button type="button" className="pk-btn next" onClick={goNext}>{idx + 1 < N ? t.next : t.result}</button>}
          </div>
        </>
      ) : (
        <div className="pk-body">
          <div className="pk-res">
            <div className={'pk-badge ' + (passed ? 'ok' : 'no')}>{pct}{t.pct}</div>
            {passed && <div className="pk-stars"><Star /><Star fill="#f2b134" /><Star /></div>}
            <div className="pk-rtitle">{passed ? t.passTitle : t.failTitle}</div>
            <div className="pk-rscore">{t.scoreOf(correctCount, N)}</div>
            <div className="pk-marks">
              {results.map((r, i) => (
                <span key={i} className={'pk-mark ' + (r.correct ? 'ok' : 'no')}>{r.correct ? <IconOk /> : <IconNo />}</span>
              ))}
            </div>
            <div className="pk-rmsg">{passed ? t.passMsg : t.failMsg}</div>
            {!passed && weakTopics.length > 0 && (
              <div className="pk-weak">{weakTopics.map((w, i) => <b key={i}>{w}</b>)}</div>
            )}
            <button type="button" className="pk-btn next" style={{ marginTop: 8 }} onClick={restart}>{t.retry}</button>
          </div>
        </div>
      )}
    </div>
  );
}
