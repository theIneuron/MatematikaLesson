// Trenajyor (1-sinf) — «Tez hisoblash» beglost mashqi. Faza 1: engine + adaptivlik + progres.
// Model: 60 s sessiya → cheksiz oqim → rekord = ball. Taymer GILYOTINA emas.
// Adaptiv: har ko'nikma alohida daraja/mastery (engine/adaptive). Progres localStorage'da (engine/progress).
// Ozvuchka yo'q. Vizual: o'yin uslubi + hajmli/pastel SVG figuralar.

import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Link } from 'react-router-dom';
import { generate, availableSkillIds } from './engine/skills.js';
import { selectSkill, updateMastery, getSkill, strongestWeakest } from './engine/adaptive.js';
import { loadProfile, saveProfile, recordSession, evaluateBadges } from './engine/progress.js';

const SESSION = 60;
const BONUS_WINDOW = 6;
const BASE_POINTS = 10;
const FAST_SEC = 2.5;
const LANG_KEY = 'trenajyor:lang';

// ── I18N ──────────────────────────────────────────────────────────────────
const SK = {
  uz: { count: 'Shakllarni sanash', cmp: 'Taqqoslash', compose: 'Son tarkibi', seq: 'Ketma-ketlik',
    add10: '10 ichida qo\'shish', sub10: '10 ichida ayirish', missing: 'Yetishmagan qism',
    add20: '20 ichida qo\'shish', subcross: 'O\'tib ayirish', addcross: 'O\'tib qo\'shish',
    sub20: '20 ichida ayirish', tens100: 'O\'nliklar (100)', odd: 'Ortiqchani top' },
  ru: { count: 'Счёт фигур', cmp: 'Сравнение', compose: 'Состав числа', seq: 'Последовательность',
    add10: 'Сложение до 10', sub10: 'Вычитание до 10', missing: 'Пропущенное число',
    add20: 'Сложение до 20', subcross: 'Вычит. с переходом', addcross: 'Слож. с переходом',
    sub20: 'Вычитание до 20', tens100: 'Десятки (100)', odd: 'Найди лишнюю' },
};
const BADGE = {
  firstRecord: { icon: '🏅', uz: 'Birinchi rekord', ru: 'Первый рекорд' },
  streak3: { icon: '🔥', uz: '3 kun ketma-ket', ru: '3 дня подряд' },
  streak7: { icon: '🔥', uz: '7 kun ketma-ket', ru: '7 дней подряд' },
  sprint20: { icon: '⚡', uz: '20 to\'g\'ri', ru: '20 верных' },
  correct100: { icon: '💯', uz: '100 to\'g\'ri', ru: '100 верных' },
  sharp: { icon: '🎯', uz: 'Ustalik', ru: 'Мастерство' },
};
const T = {
  uz: {
    brand: 'Tez hisoblash', sub: '1-sinf · beglost mashqi',
    rules: ['60 soniyada imkon qadar ko\'p misolni yech.', 'Tez javob bersang — ko\'proq ball.', 'Xato bo\'lsa jarima yo\'q, keyingisiga o\'tasan.'],
    start: 'Boshlash', again: 'Yana bir bor', record: 'Rekord', noRecord: 'Hali rekord yo\'q',
    correct: 'to\'g\'ri', over: 'Vaqt tugadi!', newRecord: 'Yangi rekord!',
    yourScore: 'Ball', yourCorrect: 'To\'g\'ri javoblar', home: 'Chiqish', fast: 'Tez!',
    q_count: 'Nechta', q_odd: 'Ortiqchasini top', streak: 'kun strik', xp: 'XP',
    strong: 'Kuchli', practice: 'Mashq qil', newBadges: 'Yangi nishon', session: 'Bu sessiyada',
    triangle: 'uchburchak', circle: 'doira', square: 'kvadrat', rect: 'to\'rtburchak',
  },
  ru: {
    brand: 'Быстрый счёт', sub: '1 класс · тренажёр беглости',
    rules: ['Реши как можно больше примеров за 60 секунд.', 'Быстрый ответ — больше баллов.', 'За ошибку штрафа нет, идёшь дальше.'],
    start: 'Начать', again: 'Ещё раз', record: 'Рекорд', noRecord: 'Рекорда пока нет',
    correct: 'верно', over: 'Время вышло!', newRecord: 'Новый рекорд!',
    yourScore: 'Баллы', yourCorrect: 'Верных ответов', home: 'Выход', fast: 'Быстро!',
    q_count: 'Сколько', q_odd: 'Найди лишнюю', streak: 'дней подряд', xp: 'XP',
    strong: 'Силён', practice: 'Потренируй', newBadges: 'Новая награда', session: 'В этой сессии',
    triangle: 'треугольников', circle: 'кругов', square: 'квадратов', rect: 'прямоугольников',
  },
};

// ── Hajmli/pastel shakl glifi ────────────────────────────────────────────────
const SHAPE_GRAD = {
  circle: ['#ffb0b0', '#ef5f66'], triangle: ['#ffd189', '#f5992a'],
  square: ['#a9c8ff', '#4079ef'], rect: ['#a3ecc2', '#2bbd6a'],
};
function Shape({ kind, size = 46 }) {
  const uid = useId().replace(/:/g, '');
  const gid = `g${uid}${kind}`;
  const [c0, c1] = SHAPE_GRAD[kind];
  const hl = 'rgba(255,255,255,.5)';
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" className="trz-shape">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c0} /><stop offset="1" stopColor={c1} /></linearGradient></defs>
      {kind === 'circle' && (<><circle cx="23" cy="23" r="18" fill={`url(#${gid})`} /><ellipse cx="17" cy="15" rx="7" ry="4.2" fill={hl} /></>)}
      {kind === 'triangle' && (<><polygon points="23,5 41,39 5,39" fill={`url(#${gid})`} /><polygon points="23,11 30,24 16,24" fill={hl} opacity=".55" /></>)}
      {kind === 'square' && (<><rect x="6" y="6" width="34" height="34" rx="8" fill={`url(#${gid})`} /><rect x="11" y="11" width="13" height="7" rx="3.5" fill={hl} /></>)}
      {kind === 'rect' && (<><rect x="3" y="14" width="40" height="18" rx="6" fill={`url(#${gid})`} /><rect x="8" y="17" width="15" height="5" rx="2.5" fill={hl} /></>)}
    </svg>
  );
}

// ── Konfetti portlashi ───────────────────────────────────────────────────────
const CONFETTI = ['🎉', '✨', '⭐', '🎊', '💫', '🌟', '✨', '⭐'];
const BURST = [[-78, -46], [78, -46], [-96, 8], [96, 8], [0, -84], [-46, 54], [46, 54], [0, 66]];
function Burst({ k }) {
  if (!k) return null;
  return (
    <div className="trz-burst" key={k}>
      {BURST.map((d, i) => (
        <span key={i} className="trz-confetti" style={{ '--dx': d[0] + 'px', '--dy': d[1] + 'px', animationDelay: `${i * 0.02}s` }}>{CONFETTI[i % CONFETTI.length]}</span>
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
  const [q, setQ] = useState(null);
  const [qKey, setQKey] = useState(0);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(null);
  const [reveal, setReveal] = useState(null);
  const [floatBonus, setFloatBonus] = useState(null);
  const [burstKey, setBurstKey] = useState(0);
  const [profile, setProfile] = useState(null);   // faqat intro/over ko'rsatish uchun
  const [summary, setSummary] = useState(null);

  const profileRef = useRef(null);
  const stepRef = useRef(0);
  const lastSkillRef = useRef(null);
  const curSkillRef = useRef(null);
  const sessionRef = useRef({ skills: {} });
  const shownAtRef = useRef(0);
  const lockRef = useRef(false);

  const setLangSave = (l) => { setLang(l); try { localStorage.setItem(LANG_KEY, l); } catch { /* mayli */ } };

  // Profilni o'qish
  useEffect(() => {
    const p = loadProfile();
    profileRef.current = p;
    setProfile(p);
  }, []);

  const nextQuestion = useCallback(() => {
    const p = profileRef.current;
    const step = (stepRef.current += 1);
    const avail = availableSkillIds(null); // backendsiz: hammasi ochiq
    const skillId = selectSkill(p, avail, step, lastSkillRef.current);
    lastSkillRef.current = skillId;
    curSkillRef.current = skillId;
    const level = getSkill(p, skillId).level;
    setQ(generate(skillId, level));
    setQKey((k) => k + 1);
    setInput('');
    setReveal(null);
    lockRef.current = false;
    shownAtRef.current = Date.now();
  }, []);

  const startGame = useCallback(() => {
    setPoints(0); setCorrect(0); setFlash(null); setFloatBonus(null); setBurstKey(0); setSummary(null);
    setTimeLeft(SESSION);
    stepRef.current = 0; lastSkillRef.current = null; sessionRef.current = { skills: {} };
    setPhase('play');
    nextQuestion();
  }, [nextQuestion]);

  // Global taymer
  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => {
      setTimeLeft((tl) => (tl <= 0.1 ? (clearInterval(id), 0) : Math.round((tl - 0.1) * 10) / 10));
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  // Vaqt tugashi → sessiyani yozish, xulosa
  useEffect(() => {
    if (phase !== 'play' || timeLeft > 0) return;
    const p = profileRef.current;
    const meta = recordSession(p, { points, correct, mode: 'timeAttack' });
    const fresh = evaluateBadges(p, { isRecord: meta.isRecord, sessionCorrect: correct });
    const sessSkillIds = Object.keys(sessionRef.current.skills);
    const { strong, weak } = strongestWeakest(p, sessSkillIds);
    const skillStats = sessSkillIds.map((id) => ({
      id, seen: sessionRef.current.skills[id].seen, correct: sessionRef.current.skills[id].correct,
      mastery: (p.skills[id] && p.skills[id].mastery) || 0,
    })).sort((a, b) => b.seen - a.seen);
    saveProfile(p);
    setProfile({ ...p });
    setSummary({ points, correct, xpTotal: p.xp, streak: meta.streak, isRecord: meta.isRecord, badges: fresh, strong, weak, skillStats });
    setPhase('over');
  }, [timeLeft, phase, points, correct]);

  // Javobni baholash
  const submit = useCallback((valueRaw) => {
    if (phase !== 'play' || !q || lockRef.current) return;
    const ok = q.mode === 'num'
      ? (valueRaw !== '' && valueRaw != null && parseInt(valueRaw, 10) === q.answer)
      : valueRaw === q.answer;
    if (q.mode === 'num' && (valueRaw === '' || valueRaw == null)) return;

    const skillId = curSkillRef.current;
    const elapsed = (Date.now() - shownAtRef.current) / 1000;
    const fast = elapsed <= FAST_SEC;
    updateMastery(profileRef.current, skillId, ok, fast, stepRef.current);
    const st = sessionRef.current.skills[skillId] || { seen: 0, correct: 0 };
    st.seen += 1; if (ok) st.correct += 1;
    sessionRef.current.skills[skillId] = st;

    if (ok) {
      const bonus = Math.max(0, Math.round(BASE_POINTS * (1 - elapsed / BONUS_WINDOW)));
      const gained = BASE_POINTS + bonus;
      setPoints((v) => v + gained);
      setCorrect((v) => v + 1);
      setFlash('ok');
      setBurstKey((b) => b + 1);
      setFloatBonus(bonus >= BASE_POINTS * 0.6 ? `+${gained} · ${t.fast}` : `+${gained}`);
      setTimeout(() => { setFlash(null); setFloatBonus(null); nextQuestion(); }, 300);
    } else {
      lockRef.current = true;
      setFlash('no');
      setReveal(q.answer);
      setTimeout(() => { setFlash(null); nextQuestion(); }, 850);
    }
  }, [phase, q, t, nextQuestion]);

  const inputRef = useRef(input);
  inputRef.current = input;

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
  const best = profile && profile.best && profile.best.points ? profile.best.points : 0;
  const curStreak = profile && profile.streak ? profile.streak.count : 0;

  const LangToggle = (
    <div className="trz-lang">
      {['uz', 'ru'].map((l) => (
        <button key={l} className={'trz-lang__b' + (lang === l ? ' on' : '')} onClick={() => setLangSave(l)}>{l.toUpperCase()}</button>
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

      {/* ── Boshlash ── */}
      {phase === 'idle' && (
        <div className="trz-card trz-intro">
          <div className="trz-logo">⚡</div>
          <h1 className="trz-h1">{t.brand}</h1>
          <p className="trz-p">{t.sub}</p>
          <ul className="trz-rules">{t.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <div className="trz-introstats">
            <span className="trz-chip">🏆 {best ? best : '—'}</span>
            <span className="trz-chip">🔥 {curStreak} {t.streak}</span>
          </div>
          <button className="trz-btn trz-btn--go" onClick={startGame}>{t.start}</button>
        </div>
      )}

      {/* ── O'yin ── */}
      {phase === 'play' && q && (
        <div className={'trz-card trz-play' + (flash ? ' fx-' + flash : '')}>
          <Burst k={burstKey} />
          {floatBonus && <div className="trz-float" key={burstKey}>{floatBonus}</div>}
          <div className="trz-qbox" key={qKey}><QuestionView q={q} reveal={reveal} t={t} /></div>

          {q.mode === 'num' ? (
            <>
              <div className={'trz-answer' + (input ? ' filled' : '') + (reveal != null ? ' bad' : '')}>
                {reveal != null ? <span className="trz-reveal">{reveal}</span> : (input || <span className="trz-ph">0</span>)}
              </div>
              <div className="trz-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} className="trz-key" onClick={() => tapKey(String(d))}>{d}</button>))}
                <button className="trz-key trz-key--sub" onClick={tapDel} aria-label="o'chirish">⌫</button>
                <button className="trz-key" onClick={() => tapKey('0')}>0</button>
                <button className="trz-key trz-key--ok" onClick={() => submit(input)} aria-label="tekshirish">✓</button>
              </div>
            </>
          ) : (
            <div className={q.view.type === 'odd' ? 'trz-tiles' : 'trz-signs'}>
              {q.view.type === 'odd'
                ? q.view.tiles.map((k, i) => (<button key={i} className="trz-tile" onClick={() => submit(i)}><Shape kind={k} size={52} /></button>))
                : q.options.map((o) => (<button key={o} className="trz-sign" onClick={() => submit(o)}>{o}</button>))}
            </div>
          )}
        </div>
      )}

      {/* ── Yakun + xulosa ── */}
      {phase === 'over' && summary && (
        <div className="trz-card trz-over">
          {summary.isRecord && <Burst k={1} />}
          {summary.isRecord && <div className="trz-badge">🏆 {t.newRecord}</div>}
          <h2 className="trz-h2">{t.over}</h2>

          <div className="trz-final">
            <div className="trz-final__box trz-final__box--main"><b>{summary.points}</b><span>{t.yourScore}</span></div>
            <div className="trz-final__box"><b>{summary.correct}</b><span>{t.yourCorrect}</span></div>
          </div>

          <div className="trz-meta">
            <span className="trz-chip">🔥 {summary.streak} {t.streak}</span>
            <span className="trz-chip">✨ {summary.xpTotal} {t.xp}</span>
          </div>

          {summary.badges.length > 0 && (
            <div className="trz-newbadges">
              <div className="trz-newbadges__t">{t.newBadges}</div>
              <div className="trz-newbadges__row">
                {summary.badges.map((id) => (
                  <span key={id} className="trz-badgechip">{BADGE[id].icon} {BADGE[id][lang] || BADGE[id].uz}</span>
                ))}
              </div>
            </div>
          )}

          {(summary.strong || summary.weak) && (
            <div className="trz-advice">
              {summary.strong && <span className="trz-advice__s">💪 {t.strong}: <b>{SK[lang][summary.strong]}</b></span>}
              {summary.weak && summary.weak !== summary.strong && <span className="trz-advice__w">🎯 {t.practice}: <b>{SK[lang][summary.weak]}</b></span>}
            </div>
          )}

          {summary.skillStats.length > 0 && (
            <div className="trz-skills">
              <div className="trz-skills__t">{t.session}</div>
              {summary.skillStats.map((s) => (
                <div key={s.id} className="trz-skillrow">
                  <span className="trz-skillrow__n">{SK[lang][s.id]}</span>
                  <span className="trz-skillbar"><i style={{ width: `${Math.round(s.mastery * 100)}%` }} /></span>
                  <span className="trz-skillrow__c">{s.correct}/{s.seen}</span>
                </div>
              ))}
            </div>
          )}

          <div className="trz-over__actions">
            <button className="trz-btn trz-btn--go" onClick={startGame}>{t.again}</button>
            <Link to="/" className="trz-btn trz-btn--ghost">{t.home}</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionView({ q, reveal, t }) {
  const v = q.view;
  if (v.type === 'expr') return <div className="trz-expr">{v.text}</div>;
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
          {v.items.map((k, i) => (<span key={i} className="trz-scene__it" style={{ animationDelay: `${i * 0.05}s` }}><Shape kind={k} size={46} /></span>))}
        </div>
      </>
    );
  return <div className="trz-qlabel">{t.q_odd}</div>;
}

const CSS = `
.trz { min-height:100dvh; display:flex; flex-direction:column; align-items:center;
  background:radial-gradient(120% 80% at 50% -10%, #fff6ea 0%, #f5efe2 55%, #efe7d6 100%);
  font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; padding:14px 14px 30px; }
.trz-top { width:100%; max-width:520px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.trz-exit { font-size:14px; font-weight:700; color:#8a8578; text-decoration:none; }
.trz-exit:hover { color:#1f2430; }
.trz-lang { display:flex; gap:4px; background:#efe6d4; padding:3px; border-radius:99px; }
.trz-lang__b { border:none; background:transparent; font-family:inherit; font-size:12.5px; font-weight:800; color:#8a8578; padding:5px 12px; border-radius:99px; cursor:pointer; transition:background .15s, color .15s; }
.trz-lang__b.on { background:#fff; color:#2563eb; box-shadow:0 1px 4px rgba(0,0,0,.08); }
.trz-stats { display:flex; gap:8px; }
.trz-stat { display:flex; align-items:center; gap:5px; background:#fff; border:1.5px solid #efe6d4; border-radius:99px; padding:5px 13px; font-size:13px; color:#8a8578; font-weight:700; }
.trz-stat b { font-size:17px; color:#1f2430; font-variant-numeric:tabular-nums; }
.trz-stat--pts b { color:#2563eb; }

.trz-timebar { position:relative; width:100%; max-width:520px; height:14px; background:#eaddc6; border-radius:99px; overflow:hidden; margin-bottom:18px; box-shadow:inset 0 1px 3px rgba(0,0,0,.08); }
.trz-timebar span { display:block; height:100%; border-radius:99px; transition:width .1s linear; background:linear-gradient(90deg, #4d8bff, #2563eb); }
.trz-timebar span.low { background:linear-gradient(90deg, #ff9d4d, #e6631e); animation:trzPulse .7s ease-in-out infinite; }
.trz-clock { position:absolute; right:9px; top:50%; transform:translateY(-50%); font-size:10px; font-weight:800; font-style:normal; color:#7a6f58; font-variant-numeric:tabular-nums; }
.trz-clock.low { color:#fff; }
@keyframes trzPulse { 0%,100%{opacity:1;} 50%{opacity:.72;} }

.trz-card { position:relative; width:100%; max-width:520px; background:#fff; border-radius:28px; padding:28px 24px; box-shadow:0 12px 40px rgba(31,36,48,.10); overflow:hidden; }

.trz-intro { text-align:center; }
.trz-logo { font-size:58px; line-height:1; margin-bottom:4px; animation:trzBob 1.6s ease-in-out infinite; }
@keyframes trzBob { 0%,100%{transform:translateY(0) rotate(-4deg);} 50%{transform:translateY(-7px) rotate(4deg);} }
.trz-h1 { font-size:32px; font-weight:800; margin:0; background:linear-gradient(90deg,#2563eb,#7c3aed); -webkit-background-clip:text; background-clip:text; color:transparent; }
.trz-p { font-size:15px; color:#7a6f58; margin:6px 0 0; }
.trz-rules { text-align:left; max-width:350px; margin:22px auto; padding:0; list-style:none; display:grid; gap:10px; }
.trz-rules li { position:relative; padding:10px 12px 10px 40px; font-size:14.5px; line-height:1.4; color:#374151; background:#f6f8fc; border-radius:14px; }
.trz-rules li::before { content:'✦'; position:absolute; left:14px; top:10px; color:#2563eb; font-size:15px; }
.trz-introstats { display:flex; gap:10px; justify-content:center; margin:6px 0 22px; }
.trz-chip { display:inline-flex; align-items:center; gap:5px; background:#f4f6fb; border-radius:99px; padding:7px 15px; font-size:14px; font-weight:800; color:#374151; font-variant-numeric:tabular-nums; }

.trz-btn { border:none; font-family:inherit; font-size:18px; font-weight:800; padding:15px 44px; border-radius:18px; cursor:pointer; transition:transform .1s, box-shadow .15s, background .15s; background:#2563eb; color:#fff; }
.trz-btn--go { background:linear-gradient(180deg,#3b82f6,#2563eb); box-shadow:0 8px 20px rgba(37,99,235,.4); }
.trz-btn--go:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(37,99,235,.5); }
.trz-btn:active { transform:scale(.96); }
.trz-btn--ghost { background:#fff; color:#374151; border:2px solid #d6dae3; text-decoration:none; display:inline-block; box-shadow:none; }
.trz-btn--ghost:hover { background:#f4f6fb; transform:none; }

.trz-play { text-align:center; transition:background .15s; }
.trz-play.fx-ok { background:#f2fbf5; }
.trz-play.fx-no { background:#fdf3f2; animation:trzShake .32s; }
@keyframes trzShake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(7px);} 60%{transform:translateX(-5px);} 80%{transform:translateX(3px);} }
.trz-float { position:absolute; top:12px; right:18px; font-size:18px; font-weight:800; color:#1a7f43; z-index:6; animation:trzFloat .85s ease-out forwards; }
@keyframes trzFloat { 0%{opacity:0; transform:translateY(8px) scale(.8);} 20%{opacity:1; transform:scale(1.1);} 100%{opacity:0; transform:translateY(-26px);} }
.trz-burst { position:absolute; left:50%; top:42%; width:0; height:0; pointer-events:none; z-index:5; }
.trz-confetti { position:absolute; font-size:22px; animation:trzBurst .75s ease-out forwards; }
@keyframes trzBurst { 0%{opacity:0; transform:translate(0,0) scale(.3);} 20%{opacity:1;} 100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(1.15) rotate(35deg);} }
.trz-qbox { animation:trzQIn .32s cubic-bezier(.3,1.4,.5,1) both; }
@keyframes trzQIn { 0%{opacity:0; transform:translateY(10px) scale(.94);} 100%{opacity:1; transform:translateY(0) scale(1);} }

.trz-expr { font-size:48px; font-weight:800; letter-spacing:.01em; font-variant-numeric:tabular-nums; margin:16px 0 22px; font-family:'JetBrains Mono','Manrope',monospace; color:#1f2430; }
.trz-cmp { display:flex; justify-content:center; align-items:center; gap:22px; }
.trz-slot { display:inline-flex; align-items:center; justify-content:center; min-width:60px; height:60px; border:3px dashed #b9c2d4; border-radius:16px; color:#a7aebd; background:#f7f9fc; }
.trz-slot.rev { border-style:solid; border-color:#c0392b; color:#c0392b; background:#fdeeee; }
.trz-qlabel { font-size:23px; font-weight:800; margin:8px 0 18px; }
.trz-scene { display:flex; flex-wrap:wrap; gap:14px; justify-content:center; align-items:center; padding:20px; background:#f6f8fc; border-radius:20px; margin-bottom:22px; }
.trz-scene__it { display:inline-flex; animation:trzShapePop .38s cubic-bezier(.3,1.5,.5,1) both; }
@keyframes trzShapePop { 0%{opacity:0; transform:scale(.3) translateY(-8px);} 100%{opacity:1; transform:scale(1) translateY(0);} }
.trz-shape { filter:drop-shadow(0 3px 3px rgba(31,36,48,.2)); }

.trz-answer { min-height:64px; display:flex; align-items:center; justify-content:center; font-size:42px; font-weight:800; font-variant-numeric:tabular-nums; border:3px solid #e2e6ee; border-radius:18px; margin-bottom:16px; background:#fbfcfe; font-family:'JetBrains Mono','Manrope',monospace; transition:border-color .12s; }
.trz-answer.filled { border-color:#2563eb; background:#fff; }
.trz-answer.bad { border-color:#c0392b; background:#fdeeee; }
.trz-ph { color:#cdd3de; } .trz-reveal { color:#c0392b; }
.trz-pad { display:grid; grid-template-columns:repeat(3,1fr); gap:11px; }
.trz-key { height:62px; font-size:27px; font-weight:800; border-radius:16px; border:none; background:#f1f3f8; color:#1f2430; cursor:pointer; font-family:inherit; box-shadow:0 3px 0 #d7dbe4; transition:transform .07s, box-shadow .07s, background .12s; font-variant-numeric:tabular-nums; }
.trz-key:hover { background:#e8ecf5; }
.trz-key:active { transform:translateY(3px); box-shadow:0 0 0 #d7dbe4; }
.trz-key--ok { background:linear-gradient(180deg,#34d17a,#1fae63); color:#fff; box-shadow:0 3px 0 #16924f; }
.trz-key--ok:hover { background:linear-gradient(180deg,#2fc972,#1ba25c); }
.trz-key--ok:active { box-shadow:0 0 0 #16924f; }
.trz-key--sub { color:#8a8f9c; }
.trz-signs { display:flex; gap:14px; justify-content:center; }
.trz-sign { width:88px; height:88px; font-size:42px; font-weight:800; border-radius:20px; border:none; background:#f1f3f8; color:#1f2430; cursor:pointer; box-shadow:0 4px 0 #d7dbe4; transition:transform .07s, box-shadow .07s, background .12s; }
.trz-sign:hover { background:#e8ecf5; } .trz-sign:active { transform:translateY(4px); box-shadow:0 0 0 #d7dbe4; }
.trz-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.trz-tile { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:18px; border:none; background:#f6f8fc; cursor:pointer; box-shadow:0 4px 0 #dde2ec; transition:transform .07s, box-shadow .07s, background .12s; }
.trz-tile:hover { background:#eef2fa; } .trz-tile:active { transform:translateY(4px); box-shadow:0 0 0 #dde2ec; }

.trz-over { text-align:center; }
.trz-badge { display:inline-block; background:linear-gradient(180deg,#ffe9a8,#ffd766); color:#8a5b00; font-weight:800; font-size:15px; padding:9px 20px; border-radius:99px; margin-bottom:12px; box-shadow:0 4px 12px rgba(255,193,64,.4); animation:trzPop .45s ease; }
@keyframes trzPop { 0%{transform:scale(.5); opacity:0;} 60%{transform:scale(1.12);} 100%{transform:scale(1); opacity:1;} }
.trz-h2 { font-size:27px; font-weight:800; margin:0 0 20px; }
.trz-final { display:flex; gap:14px; justify-content:center; margin-bottom:14px; }
.trz-final__box { flex:1; max-width:175px; background:#f6f8fc; border-radius:20px; padding:18px 8px; }
.trz-final__box b { display:block; font-size:40px; font-weight:800; color:#1f2430; font-variant-numeric:tabular-nums; }
.trz-final__box span { font-size:13px; color:#8a8578; font-weight:700; }
.trz-final__box--main { background:linear-gradient(180deg,#e8eefc,#dbe6fb); } .trz-final__box--main b { color:#2563eb; }
.trz-meta { display:flex; gap:10px; justify-content:center; margin-bottom:14px; }
.trz-newbadges { background:#fffaf0; border:1.5px solid #ffe4a8; border-radius:16px; padding:12px; margin-bottom:14px; }
.trz-newbadges__t { font-size:12px; font-weight:800; color:#b7791f; text-transform:uppercase; letter-spacing:.03em; margin-bottom:8px; }
.trz-newbadges__row { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
.trz-badgechip { background:#fff; border:1.5px solid #ffe4a8; border-radius:99px; padding:6px 12px; font-size:13px; font-weight:800; color:#8a5b00; }
.trz-advice { display:flex; flex-wrap:wrap; gap:8px 16px; justify-content:center; margin-bottom:16px; font-size:14.5px; color:#374151; }
.trz-advice b { color:#1f2430; }
.trz-skills { text-align:left; background:#f8f9fc; border-radius:16px; padding:14px 16px; margin-bottom:18px; }
.trz-skills__t { font-size:12px; font-weight:800; color:#8a8578; text-transform:uppercase; letter-spacing:.03em; margin-bottom:10px; }
.trz-skillrow { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.trz-skillrow__n { flex:0 0 40%; font-size:13.5px; font-weight:700; color:#374151; }
.trz-skillbar { flex:1; height:8px; background:#e6e9f0; border-radius:99px; overflow:hidden; }
.trz-skillbar i { display:block; height:100%; background:linear-gradient(90deg,#34d17a,#1fae63); border-radius:99px; }
.trz-skillrow__c { flex:0 0 auto; font-size:13px; font-weight:800; color:#6b7280; font-variant-numeric:tabular-nums; }
.trz-over__actions { display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap; }

@media (max-width:420px) {
  .trz-expr { font-size:40px; } .trz-key, .trz-answer { height:56px; }
  .trz-sign { width:76px; height:76px; font-size:36px; } .trz-card { padding:22px 16px; }
  .trz-skillrow__n { flex-basis:46%; }
}
`;
