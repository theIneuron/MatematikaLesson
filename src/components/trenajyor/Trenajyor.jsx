// Trenajyor (pilot: 1-sinf) — «Tez hisoblash» beglost mashqi.
// Model: global sessiya taymeri (60 s) → cheksiz oqim → rekord = ballar (tez javob = bonus).
// Taymer GILYOTINA emas: har misolga tezlik bonusi so'niydi, lekin javob berish har doim ochiq.
// Kirish: raqamli klaviatura (arifmetika/sanoq/ketma-ketlik) yoki tap (taqqoslash/ortiqcha).
// Scope: 100 gacha, + va − , geometrik shakllar, mantiq. Ozvuchka yo'q.
// Vizual: o'yin uslubi (yorqin, animatsiyali, konfetti) + hajmli/pastel figuralar.

import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Link } from 'react-router-dom';

const SESSION = 60;          // sessiya davomiyligi, soniya
const BONUS_WINDOW = 6;      // tezlik bonusi shu soniyada so'niydi
const BASE_POINTS = 10;      // har to'g'ri javob uchun asosiy ball
const BEST_KEY = 'trenajyor:1-sinf:best';
const LANG_KEY = 'trenajyor:lang';

// ── I18N ──────────────────────────────────────────────────────────────────
const T = {
  uz: {
    brand: 'Tez hisoblash',
    sub: '1-sinf · beglost mashqi',
    rules: [
      '60 soniyada imkon qadar ko\'p misolni yech.',
      'Tez javob bersang — ko\'proq ball.',
      'Xato bo\'lsa jarima yo\'q, keyingisiga o\'tasan.',
    ],
    start: 'Boshlash',
    again: 'Yana bir bor',
    record: 'Rekord',
    noRecord: 'Hali rekord yo\'q',
    score: 'ball',
    correct: 'to\'g\'ri',
    over: 'Vaqt tugadi!',
    newRecord: 'Yangi rekord!',
    yourScore: 'Ball',
    yourCorrect: 'To\'g\'ri javoblar',
    home: 'Chiqish',
    fast: 'Tez!',
    q_count: 'Nechta',
    q_odd: 'Ortiqchasini top',
    triangle: 'uchburchak', circle: 'doira', square: 'kvadrat', rect: 'to\'rtburchak',
  },
  ru: {
    brand: 'Быстрый счёт',
    sub: '1 класс · тренажёр беглости',
    rules: [
      'Реши как можно больше примеров за 60 секунд.',
      'Быстрый ответ — больше баллов.',
      'За ошибку штрафа нет, идёшь дальше.',
    ],
    start: 'Начать',
    again: 'Ещё раз',
    record: 'Рекорд',
    noRecord: 'Рекорда пока нет',
    score: 'балл',
    correct: 'верно',
    over: 'Время вышло!',
    newRecord: 'Новый рекорд!',
    yourScore: 'Баллы',
    yourCorrect: 'Верных ответов',
    home: 'Выход',
    fast: 'Быстро!',
    q_count: 'Сколько',
    q_odd: 'Найди лишнюю',
    triangle: 'треугольников', circle: 'кругов', square: 'квадратов', rect: 'прямоугольников',
  },
};

// ── Yordamchilar ────────────────────────────────────────────────────────────
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1)); // [a,b]
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Hajmli/pastel shakl glifi (gradient + soya + yorug'lik) ──────────────────
const KINDS = ['circle', 'triangle', 'square', 'rect'];
// Har figura o'z quvnoq rangida (yorug' → to'q gradient)
const SHAPE_GRAD = {
  circle:   ['#ffb0b0', '#ef5f66'],
  triangle: ['#ffd189', '#f5992a'],
  square:   ['#a9c8ff', '#4079ef'],
  rect:     ['#a3ecc2', '#2bbd6a'],
};
function Shape({ kind, size = 46 }) {
  const uid = useId().replace(/:/g, '');
  const gid = `g${uid}${kind}`;
  const [c0, c1] = SHAPE_GRAD[kind];
  const hl = 'rgba(255,255,255,.5)';
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" className="trz-shape">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="1" stopColor={c1} />
        </linearGradient>
      </defs>
      {kind === 'circle' && (
        <>
          <circle cx="23" cy="23" r="18" fill={`url(#${gid})`} />
          <ellipse cx="17" cy="15" rx="7" ry="4.2" fill={hl} />
        </>
      )}
      {kind === 'triangle' && (
        <>
          <polygon points="23,5 41,39 5,39" fill={`url(#${gid})`} />
          <polygon points="23,11 30,24 16,24" fill={hl} opacity=".55" />
        </>
      )}
      {kind === 'square' && (
        <>
          <rect x="6" y="6" width="34" height="34" rx="8" fill={`url(#${gid})`} />
          <rect x="11" y="11" width="13" height="7" rx="3.5" fill={hl} />
        </>
      )}
      {kind === 'rect' && (
        <>
          <rect x="3" y="14" width="40" height="18" rx="6" fill={`url(#${gid})`} />
          <rect x="8" y="17" width="15" height="5" rx="2.5" fill={hl} />
        </>
      )}
    </svg>
  );
}

// ── Misol generatori ─────────────────────────────────────────────────────────
// level 1: 10 gacha · level 2: 20 gacha · level 3: 100 gacha
function makeQuestion(level) {
  const pool =
    level <= 1 ? ['add', 'sub', 'count', 'cmp', 'seq', 'odd']
    : level === 2 ? ['add', 'sub', 'missing', 'count', 'cmp', 'seq', 'odd']
    : ['add', 'sub', 'missing', 'cmp', 'seq', 'count'];
  const kind = pick(pool);
  const cap = level <= 1 ? 10 : level === 2 ? 20 : 100;

  if (kind === 'add') {
    const a = ri(1, cap - 1);
    const b = ri(1, cap - a);
    return { mode: 'num', view: { type: 'expr', text: `${a} + ${b}` }, answer: a + b };
  }
  if (kind === 'sub') {
    const a = ri(2, cap);
    const b = ri(1, a - 1);
    return { mode: 'num', view: { type: 'expr', text: `${a} − ${b}` }, answer: a - b };
  }
  if (kind === 'missing') {
    const a = ri(1, cap - 1);
    const b = ri(1, cap - a);
    const hideA = Math.random() < 0.5;
    const text = hideA ? `? + ${b} = ${a + b}` : `${a} + ? = ${a + b}`;
    return { mode: 'num', view: { type: 'expr', text }, answer: hideA ? a : b };
  }
  if (kind === 'seq') {
    const stepPool = level <= 1 ? [1, 2] : level === 2 ? [2, 5, 10] : [10, 5, 2];
    const d = pick(stepPool);
    const start = ri(1, Math.max(1, cap - 4 * d));
    return { mode: 'num', view: { type: 'expr', text: `${start}, ${start + d}, ${start + 2 * d}, ?` }, answer: start + 3 * d };
  }
  if (kind === 'cmp') {
    const a = ri(1, cap), b = ri(1, cap);
    const answer = a > b ? '>' : a < b ? '<' : '=';
    return { mode: 'pick', view: { type: 'cmp', a, b }, answer, options: ['<', '=', '>'] };
  }
  if (kind === 'count') {
    const target = pick(KINDS);
    const total = ri(4, 8);
    const cnt = ri(1, Math.min(total, level <= 1 ? 6 : 9));
    const items = [];
    for (let i = 0; i < cnt; i++) items.push(target);
    for (let i = cnt; i < total; i++) items.push(pick(KINDS.filter((k) => k !== target)));
    return { mode: 'num', view: { type: 'count', items: shuffle(items), target }, answer: cnt };
  }
  // odd — 4 ta shakl, bittasi boshqa; ortiqchasini tap
  const common = pick(KINDS);
  const odd = pick(KINDS.filter((k) => k !== common));
  const oddIdx = ri(0, 3);
  const tiles = Array.from({ length: 4 }, (_, i) => (i === oddIdx ? odd : common));
  return { mode: 'pick', view: { type: 'odd', tiles }, answer: oddIdx, options: tiles };
}

// ── Konfetti portlashi (to'g'ri javobda) ─────────────────────────────────────
const CONFETTI = ['🎉', '✨', '⭐', '🎊', '💫', '🌟', '✨', '⭐'];
const BURST = [[-78, -46], [78, -46], [-96, 8], [96, 8], [0, -84], [-46, 54], [46, 54], [0, 66]];
function Burst({ k }) {
  if (!k) return null;
  return (
    <div className="trz-burst" key={k}>
      {BURST.map((d, i) => (
        <span key={i} className="trz-confetti"
          style={{ '--dx': d[0] + 'px', '--dy': d[1] + 'px', animationDelay: `${i * 0.02}s` }}>
          {CONFETTI[i % CONFETTI.length]}
        </span>
      ))}
    </div>
  );
}

// ── Komponent ────────────────────────────────────────────────────────────────
export default function Trenajyor({ lang: propLang = 'uz' }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || propLang; } catch { return propLang; }
  });
  const t = T[lang] || T.uz;

  const [phase, setPhase] = useState('idle'); // idle | play | over
  const [timeLeft, setTimeLeft] = useState(SESSION);
  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [level, setLevel] = useState(1);
  const [q, setQ] = useState(null);
  const [qKey, setQKey] = useState(0);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(null);   // 'ok' | 'no' | null
  const [reveal, setReveal] = useState(null);
  const [floatBonus, setFloatBonus] = useState(null);
  const [burstKey, setBurstKey] = useState(0);
  const [best, setBest] = useState(null);
  const [beat, setBeat] = useState(false);

  const streakRef = useRef(0);
  const shownAtRef = useRef(0);
  const lockRef = useRef(false);

  const setLangSave = (l) => {
    setLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* mayli */ }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (raw) setBest(JSON.parse(raw));
    } catch { /* localStorage yo'q — mayli */ }
  }, []);

  const nextQuestion = useCallback((lvl) => {
    setQ(makeQuestion(lvl));
    setQKey((k) => k + 1);
    setInput('');
    setReveal(null);
    lockRef.current = false;
    shownAtRef.current = Date.now();
  }, []);

  const startGame = useCallback(() => {
    setPoints(0); setCorrect(0); setLevel(1); setBeat(false);
    setTimeLeft(SESSION); setFlash(null); setFloatBonus(null); setBurstKey(0);
    streakRef.current = 0;
    setPhase('play');
    nextQuestion(1);
  }, [nextQuestion]);

  // Global taymer
  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => {
      setTimeLeft((tl) => {
        if (tl <= 0.1) { clearInterval(id); return 0; }
        return Math.round((tl - 0.1) * 10) / 10;
      });
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  // Vaqt tugashi
  useEffect(() => {
    if (phase === 'play' && timeLeft <= 0) {
      setPhase('over');
      const result = { points, correct };
      setBest((prev) => {
        const isBeat = !prev || points > prev.points;
        if (isBeat) {
          setBeat(true);
          try { localStorage.setItem(BEST_KEY, JSON.stringify(result)); } catch { /* mayli */ }
          return result;
        }
        return prev;
      });
    }
  }, [timeLeft, phase, points, correct]);

  // Javobni baholash
  const submit = useCallback((valueRaw) => {
    if (phase !== 'play' || !q || lockRef.current) return;
    let ok;
    if (q.mode === 'num') {
      if (valueRaw === '' || valueRaw == null) return;
      ok = parseInt(valueRaw, 10) === q.answer;
    } else {
      ok = valueRaw === q.answer;
    }

    if (ok) {
      const elapsed = (Date.now() - shownAtRef.current) / 1000;
      const bonus = Math.max(0, Math.round(BASE_POINTS * (1 - elapsed / BONUS_WINDOW)));
      const gained = BASE_POINTS + bonus;
      streakRef.current += 1;
      setPoints((p) => p + gained);
      setCorrect((c) => c + 1);
      setFlash('ok');
      setBurstKey((b) => b + 1);
      setFloatBonus(bonus >= BASE_POINTS * 0.6 ? `+${gained} · ${t.fast}` : `+${gained}`);
      const nextLvl = streakRef.current % 3 === 0 && level < 3 ? level + 1 : level;
      if (nextLvl !== level) setLevel(nextLvl);
      setTimeout(() => { setFlash(null); setFloatBonus(null); nextQuestion(nextLvl); }, 300);
    } else {
      lockRef.current = true;
      streakRef.current = 0;
      setFlash('no');
      setReveal(q.answer);
      const nextLvl = Math.max(1, level - 1);
      if (nextLvl !== level) setLevel(nextLvl);
      setTimeout(() => { setFlash(null); nextQuestion(nextLvl); }, 850);
    }
  }, [phase, q, level, t, nextQuestion]);

  const inputRef = useRef(input);
  inputRef.current = input;

  // Fizik klaviatura (desktop) — raqamli rejim uchun
  useEffect(() => {
    if (phase !== 'play' || !q || q.mode !== 'num') return;
    const onKey = (e) => {
      if (e.key >= '0' && e.key <= '9') setInput((s) => (s.length < 3 ? s + e.key : s));
      else if (e.key === 'Backspace') setInput((s) => s.slice(0, -1));
      else if (e.key === 'Enter') submit(inputRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, q, submit]);

  const tapKey = (d) => setInput((s) => (s.length < 3 ? s + d : s));
  const tapDel = () => setInput((s) => s.slice(0, -1));

  const timePct = Math.max(0, (timeLeft / SESSION) * 100);
  const low = timeLeft <= 10;

  const LangToggle = (
    <div className="trz-lang">
      {['uz', 'ru'].map((l) => (
        <button key={l} className={'trz-lang__b' + (lang === l ? ' on' : '')}
          onClick={() => setLangSave(l)}>{l.toUpperCase()}</button>
      ))}
    </div>
  );

  return (
    <div className="trz">
      <style>{CSS}</style>

      <div className="trz-top">
        <Link to="/" className="trz-exit">← {t.home}</Link>
        {phase === 'play' ? (
          <div className="trz-stats">
            <span className="trz-stat"><b>{correct}</b> {t.correct}</span>
            <span className="trz-stat trz-stat--pts">🏆 <b>{points}</b></span>
          </div>
        ) : LangToggle}
      </div>

      {phase === 'play' && (
        <div className="trz-timebar">
          <span style={{ width: `${timePct}%` }} className={low ? 'low' : ''} />
          <em className={'trz-clock' + (low ? ' low' : '')}>{Math.ceil(timeLeft)}</em>
        </div>
      )}

      {/* ── Boshlash ekrani ── */}
      {phase === 'idle' && (
        <div className="trz-card trz-intro">
          <div className="trz-logo">⚡</div>
          <h1 className="trz-h1">{t.brand}</h1>
          <p className="trz-p">{t.sub}</p>
          <ul className="trz-rules">
            {t.rules.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div className="trz-record">
            {best ? <><span>🏆 {t.record}:</span> <b>{best.points}</b></> : <span className="dim">{t.noRecord}</span>}
          </div>
          <button className="trz-btn trz-btn--go" onClick={startGame}>{t.start}</button>
        </div>
      )}

      {/* ── O'yin ekrani ── */}
      {phase === 'play' && q && (
        <div className={'trz-card trz-play' + (flash ? ' fx-' + flash : '')}>
          <Burst k={burstKey} />
          {floatBonus && <div className="trz-float" key={burstKey}>{floatBonus}</div>}

          <div className="trz-qbox" key={qKey}>
            <QuestionView q={q} reveal={reveal} t={t} />
          </div>

          {q.mode === 'num' ? (
            <>
              <div className={'trz-answer' + (input ? ' filled' : '') + (reveal != null ? ' bad' : '')}>
                {reveal != null ? <span className="trz-reveal">{reveal}</span> : (input || <span className="trz-ph">0</span>)}
              </div>
              <div className="trz-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <button key={d} className="trz-key" onClick={() => tapKey(String(d))}>{d}</button>
                ))}
                <button className="trz-key trz-key--sub" onClick={tapDel} aria-label="o'chirish">⌫</button>
                <button className="trz-key" onClick={() => tapKey('0')}>0</button>
                <button className="trz-key trz-key--ok" onClick={() => submit(input)} aria-label="tekshirish">✓</button>
              </div>
            </>
          ) : (
            <div className={q.view.type === 'odd' ? 'trz-tiles' : 'trz-signs'}>
              {q.view.type === 'odd'
                ? q.view.tiles.map((k, i) => (
                    <button key={i} className="trz-tile" onClick={() => submit(i)}>
                      <Shape kind={k} size={52} />
                    </button>
                  ))
                : q.options.map((o) => (
                    <button key={o} className="trz-sign" onClick={() => submit(o)}>{o}</button>
                  ))}
            </div>
          )}
        </div>
      )}

      {/* ── Yakun ekrani ── */}
      {phase === 'over' && (
        <div className="trz-card trz-over">
          {beat && <Burst k={1} />}
          {beat && <div className="trz-badge">🏆 {t.newRecord}</div>}
          <h2 className="trz-h2">{t.over}</h2>
          <div className="trz-final">
            <div className="trz-final__box trz-final__box--main">
              <b>{points}</b><span>{t.yourScore}</span>
            </div>
            <div className="trz-final__box">
              <b>{correct}</b><span>{t.yourCorrect}</span>
            </div>
          </div>
          {best && !beat && <p className="trz-p">🏆 {t.record}: <b>{best.points}</b></p>}
          <div className="trz-over__actions">
            <button className="trz-btn trz-btn--go" onClick={startGame}>{t.again}</button>
            <Link to="/" className="trz-btn trz-btn--ghost">{t.home}</Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Savol vizuali
function QuestionView({ q, reveal, t }) {
  const v = q.view;
  if (v.type === 'expr')
    return <div className="trz-expr">{v.text}</div>;
  if (v.type === 'cmp')
    return (
      <div className="trz-expr trz-cmp">
        <span>{v.a}</span>
        <span className={'trz-slot' + (reveal ? ' rev' : '')}>{reveal || '?'}</span>
        <span>{v.b}</span>
      </div>
    );
  if (v.type === 'count')
    return (
      <>
        <div className="trz-qlabel">{t.q_count} {t[v.target]}?</div>
        <div className="trz-scene">
          {v.items.map((k, i) => (
            <span key={i} className="trz-scene__it" style={{ animationDelay: `${i * 0.05}s` }}>
              <Shape kind={k} size={46} />
            </span>
          ))}
        </div>
      </>
    );
  // odd
  return <div className="trz-qlabel">{t.q_odd}</div>;
}

const CSS = `
.trz { min-height:100dvh; display:flex; flex-direction:column; align-items:center;
  background:radial-gradient(120% 80% at 50% -10%, #fff6ea 0%, #f5efe2 55%, #efe7d6 100%);
  font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  color:#1f2430; padding:14px 14px 30px; }

.trz-top { width:100%; max-width:520px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.trz-exit { font-size:14px; font-weight:700; color:#8a8578; text-decoration:none; }
.trz-exit:hover { color:#1f2430; }
.trz-lang { display:flex; gap:4px; background:#efe6d4; padding:3px; border-radius:99px; }
.trz-lang__b { border:none; background:transparent; font-family:inherit; font-size:12.5px; font-weight:800; color:#8a8578;
  padding:5px 12px; border-radius:99px; cursor:pointer; transition:background .15s, color .15s; }
.trz-lang__b.on { background:#fff; color:#2563eb; box-shadow:0 1px 4px rgba(0,0,0,.08); }
.trz-stats { display:flex; gap:8px; }
.trz-stat { display:flex; align-items:center; gap:5px; background:#fff; border:1.5px solid #efe6d4; border-radius:99px;
  padding:5px 13px; font-size:13px; color:#8a8578; font-weight:700; }
.trz-stat b { font-size:17px; color:#1f2430; font-variant-numeric:tabular-nums; }
.trz-stat--pts b { color:#2563eb; }

.trz-timebar { position:relative; width:100%; max-width:520px; height:14px; background:#eaddc6; border-radius:99px;
  overflow:hidden; margin-bottom:18px; box-shadow:inset 0 1px 3px rgba(0,0,0,.08); }
.trz-timebar span { display:block; height:100%; border-radius:99px; transition:width .1s linear;
  background:linear-gradient(90deg, #4d8bff, #2563eb); }
.trz-timebar span.low { background:linear-gradient(90deg, #ff9d4d, #e6631e); animation:trzPulse .7s ease-in-out infinite; }
.trz-clock { position:absolute; right:9px; top:50%; transform:translateY(-50%); font-size:10px; font-weight:800; font-style:normal;
  color:#7a6f58; font-variant-numeric:tabular-nums; }
.trz-clock.low { color:#fff; }
@keyframes trzPulse { 0%,100%{opacity:1;} 50%{opacity:.72;} }

.trz-card { position:relative; width:100%; max-width:520px; background:#fff; border-radius:28px;
  padding:28px 24px; box-shadow:0 12px 40px rgba(31,36,48,.10); overflow:hidden; }

/* Intro */
.trz-intro { text-align:center; }
.trz-logo { font-size:58px; line-height:1; margin-bottom:4px; animation:trzBob 1.6s ease-in-out infinite; }
@keyframes trzBob { 0%,100%{transform:translateY(0) rotate(-4deg);} 50%{transform:translateY(-7px) rotate(4deg);} }
.trz-h1 { font-size:32px; font-weight:800; margin:0;
  background:linear-gradient(90deg,#2563eb,#7c3aed); -webkit-background-clip:text; background-clip:text; color:transparent; }
.trz-p { font-size:15px; color:#7a6f58; margin:6px 0 0; }
.trz-rules { text-align:left; max-width:350px; margin:22px auto; padding:0; list-style:none; display:grid; gap:10px; }
.trz-rules li { position:relative; padding:10px 12px 10px 40px; font-size:14.5px; line-height:1.4; color:#374151;
  background:#f6f8fc; border-radius:14px; }
.trz-rules li::before { content:'✦'; position:absolute; left:14px; top:10px; color:#2563eb; font-size:15px; }
.trz-record { font-size:16px; margin:6px 0 22px; color:#374151; }
.trz-record b { font-size:24px; color:#2563eb; font-variant-numeric:tabular-nums; }
.trz-record .dim { color:#b3ac9c; }

.trz-btn { border:none; font-family:inherit; font-size:18px; font-weight:800; padding:15px 44px; border-radius:18px;
  cursor:pointer; transition:transform .1s, box-shadow .15s, background .15s; background:#2563eb; color:#fff; }
.trz-btn--go { background:linear-gradient(180deg,#3b82f6,#2563eb); box-shadow:0 8px 20px rgba(37,99,235,.4); }
.trz-btn--go:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(37,99,235,.5); }
.trz-btn:active { transform:scale(.96); }
.trz-btn--ghost { background:#fff; color:#374151; border:2px solid #d6dae3; text-decoration:none; display:inline-block; box-shadow:none; }
.trz-btn--ghost:hover { background:#f4f6fb; transform:none; }

/* Play */
.trz-play { text-align:center; transition:background .15s; }
.trz-play.fx-ok { background:#f2fbf5; }
.trz-play.fx-no { background:#fdf3f2; animation:trzShake .32s; }
@keyframes trzShake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(7px);}
  60%{transform:translateX(-5px);} 80%{transform:translateX(3px);} }

.trz-float { position:absolute; top:12px; right:18px; font-size:18px; font-weight:800; color:#1a7f43; z-index:6;
  animation:trzFloat .85s ease-out forwards; }
@keyframes trzFloat { 0%{opacity:0; transform:translateY(8px) scale(.8);} 20%{opacity:1; transform:scale(1.1);}
  100%{opacity:0; transform:translateY(-26px);} }

.trz-burst { position:absolute; left:50%; top:42%; width:0; height:0; pointer-events:none; z-index:5; }
.trz-confetti { position:absolute; font-size:22px; animation:trzBurst .75s ease-out forwards; }
@keyframes trzBurst { 0%{opacity:0; transform:translate(0,0) scale(.3);} 20%{opacity:1;}
  100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(1.15) rotate(35deg);} }

.trz-qbox { animation:trzQIn .32s cubic-bezier(.3,1.4,.5,1) both; }
@keyframes trzQIn { 0%{opacity:0; transform:translateY(10px) scale(.94);} 100%{opacity:1; transform:translateY(0) scale(1);} }

.trz-expr { font-size:48px; font-weight:800; letter-spacing:.01em; font-variant-numeric:tabular-nums;
  margin:16px 0 22px; font-family:'JetBrains Mono','Manrope',monospace; color:#1f2430; }
.trz-cmp { display:flex; justify-content:center; align-items:center; gap:22px; }
.trz-slot { display:inline-flex; align-items:center; justify-content:center; min-width:60px; height:60px;
  border:3px dashed #b9c2d4; border-radius:16px; color:#a7aebd; background:#f7f9fc; }
.trz-slot.rev { border-style:solid; border-color:#c0392b; color:#c0392b; background:#fdeeee; }
.trz-qlabel { font-size:23px; font-weight:800; margin:8px 0 18px; }
.trz-scene { display:flex; flex-wrap:wrap; gap:14px; justify-content:center; align-items:center;
  padding:20px; background:#f6f8fc; border-radius:20px; margin-bottom:22px; }
.trz-scene__it { display:inline-flex; animation:trzShapePop .38s cubic-bezier(.3,1.5,.5,1) both; }
@keyframes trzShapePop { 0%{opacity:0; transform:scale(.3) translateY(-8px);} 100%{opacity:1; transform:scale(1) translateY(0);} }
.trz-shape { filter:drop-shadow(0 3px 3px rgba(31,36,48,.2)); }

/* Raqamli javob + klaviatura */
.trz-answer { min-height:64px; display:flex; align-items:center; justify-content:center; font-size:42px; font-weight:800;
  font-variant-numeric:tabular-nums; border:3px solid #e2e6ee; border-radius:18px; margin-bottom:16px; background:#fbfcfe;
  font-family:'JetBrains Mono','Manrope',monospace; transition:border-color .12s; }
.trz-answer.filled { border-color:#2563eb; background:#fff; }
.trz-answer.bad { border-color:#c0392b; background:#fdeeee; }
.trz-ph { color:#cdd3de; }
.trz-reveal { color:#c0392b; }
.trz-pad { display:grid; grid-template-columns:repeat(3,1fr); gap:11px; }
.trz-key { height:62px; font-size:27px; font-weight:800; border-radius:16px; border:none; background:#f1f3f8;
  color:#1f2430; cursor:pointer; font-family:inherit; box-shadow:0 3px 0 #d7dbe4; transition:transform .07s, box-shadow .07s, background .12s;
  font-variant-numeric:tabular-nums; }
.trz-key:hover { background:#e8ecf5; }
.trz-key:active { transform:translateY(3px); box-shadow:0 0 0 #d7dbe4; }
.trz-key--ok { background:linear-gradient(180deg,#34d17a,#1fae63); color:#fff; box-shadow:0 3px 0 #16924f; }
.trz-key--ok:hover { background:linear-gradient(180deg,#2fc972,#1ba25c); }
.trz-key--ok:active { box-shadow:0 0 0 #16924f; }
.trz-key--sub { color:#8a8f9c; }

/* Tap javoblar (taqqoslash / ortiqcha) */
.trz-signs { display:flex; gap:14px; justify-content:center; }
.trz-sign { width:88px; height:88px; font-size:42px; font-weight:800; border-radius:20px; border:none; background:#f1f3f8;
  color:#1f2430; cursor:pointer; box-shadow:0 4px 0 #d7dbe4; transition:transform .07s, box-shadow .07s, background .12s; }
.trz-sign:hover { background:#e8ecf5; }
.trz-sign:active { transform:translateY(4px); box-shadow:0 0 0 #d7dbe4; }
.trz-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.trz-tile { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:18px;
  border:none; background:#f6f8fc; cursor:pointer; box-shadow:0 4px 0 #dde2ec; transition:transform .07s, box-shadow .07s, background .12s; }
.trz-tile:hover { background:#eef2fa; }
.trz-tile:active { transform:translateY(4px); box-shadow:0 0 0 #dde2ec; }

/* Over */
.trz-over { text-align:center; }
.trz-badge { display:inline-block; background:linear-gradient(180deg,#ffe9a8,#ffd766); color:#8a5b00; font-weight:800; font-size:15px;
  padding:9px 20px; border-radius:99px; margin-bottom:12px; box-shadow:0 4px 12px rgba(255,193,64,.4); animation:trzPop .45s ease; }
@keyframes trzPop { 0%{transform:scale(.5); opacity:0;} 60%{transform:scale(1.12);} 100%{transform:scale(1); opacity:1;} }
.trz-h2 { font-size:27px; font-weight:800; margin:0 0 20px; }
.trz-final { display:flex; gap:14px; justify-content:center; margin-bottom:18px; }
.trz-final__box { flex:1; max-width:175px; background:#f6f8fc; border-radius:20px; padding:18px 8px; }
.trz-final__box b { display:block; font-size:40px; font-weight:800; color:#1f2430; font-variant-numeric:tabular-nums; }
.trz-final__box span { font-size:13px; color:#8a8578; font-weight:700; }
.trz-final__box--main { background:linear-gradient(180deg,#e8eefc,#dbe6fb); }
.trz-final__box--main b { color:#2563eb; }
.trz-over__actions { display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap; }

@media (max-width:420px) {
  .trz-expr { font-size:40px; }
  .trz-key, .trz-answer { height:56px; }
  .trz-sign { width:76px; height:76px; font-size:36px; }
  .trz-card { padding:22px 16px; }
}
`;
