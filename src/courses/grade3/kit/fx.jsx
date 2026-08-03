/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// grade3/kit/fx.jsx — ЭФФЕКТЫ И НАГРАДА
//
// Источник: src/components/grade3/Dars01.jsx, версия ИЗ КОММИТА (HEAD).
// Все компоненты здесь чисто визуальные и aria-hidden: они ничего не сообщают
// ученику словами, поэтому при выключенной анимации урок не теряет смысла
// (ETALON v2 §8 — prefers-reduced-motion гасит всё).
//
// Что НЕ перенесено и почему:
//   • Obj / ObjSvg / Pips — счётные предметы 1 класса (яблоко, звезда, рыбка).
//     В 3 классе счёт идёт разрядными единицами (chiroq / lenta / panel), поэтому
//     набор иконок 1 класса здесь не нужен. Понадобится — переносить отдельно.
// ============================================================================

// React не импортируется: в проекте новый JSX-трансформ (@vitejs/plugin-react).

// ---------------------------------------------------------------------------
// ГРАДИЕНТЫ LUMO — один раз на урок, на них ссылаются все визуалы через url(#id).
// Без этого блока chiroq/lenta/panel потеряют свечение.
// ---------------------------------------------------------------------------
export const LumoDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="lmGlow" cx="42%" cy="36%" r="72%">
        <stop offset="0%" stopColor="#FFF6D0"/>
        <stop offset="50%" stopColor="#FFD86E"/>
        <stop offset="100%" stopColor="#FBA83C"/>
      </radialGradient>
      <linearGradient id="lmSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#AAD0EE"/>
        <stop offset="50%" stopColor="#FBDCB0"/>
        <stop offset="100%" stopColor="#FFEECE"/>
      </linearGradient>
      <radialGradient id="lmSun" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#FFF8E2"/>
        <stop offset="55%" stopColor="#FFDF9A"/>
        <stop offset="100%" stopColor="#FFC468"/>
      </radialGradient>
      <linearGradient id="lmGround" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ECD8AE"/>
        <stop offset="100%" stopColor="#DAC090"/>
      </linearGradient>
      <linearGradient id="lmTree" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7ECB8C"/>
        <stop offset="100%" stopColor="#4E9E62"/>
      </linearGradient>
    </defs>
  </svg>
);

/** Пылинки света в воздухе — среда Lumo. Чистая декорация. */
export const AmbientMotes = ({ count = 8 }) => (
  <div className="lm-motes" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <i key={i} className="lm-mote" style={{ animationDelay: `${i * 1.6}s` }}/>
    ))}
  </div>
);

/** Искры по краю рамки вопроса — подсказывает, где сейчас действие. */
export const FrameFx = () => (
  <span className="lm-fx" aria-hidden="true"><i/><i/><i/><i/><i/></span>
);

// ---------------------------------------------------------------------------
// НАГРАДА
// ---------------------------------------------------------------------------
export const Confetti = () => (
  <>
    <span className="g1-conf g1-conf1"/>
    <span className="g1-conf g1-conf2"/>
    <span className="g1-conf g1-conf3"/>
    <span className="g1-conf g1-conf4"/>
    <span className="g1-conf g1-conf5"/>
    <span className="g1-conf g1-conf6"/>
  </>
);

const SPARKS = [
  { dx: '0px', dy: '-30px', s: 8, d: '0s' },
  { dx: '24px', dy: '-20px', s: 6, d: '0.05s' },
  { dx: '-24px', dy: '-20px', s: 6, d: '0.09s' },
  { dx: '30px', dy: '2px', s: 5, d: '0.13s' },
  { dx: '-30px', dy: '2px', s: 5, d: '0.07s' },
  { dx: '14px', dy: '-28px', s: 4, d: '0.11s' },
];

export const SparkBurst = () => (
  <>
    {SPARKS.map((p, i) => (
      <span
        key={i}
        className="g1-csp"
        style={{ width: `${p.s}px`, height: `${p.s}px`, '--dx': p.dx, '--dy': p.dy, animationDelay: p.d }}
      />
    ))}
  </>
);

/**
 * AnsPop — верный ответ всплывает ЧИСЛОМ В САМОМ ВИЗУАЛЕ, а не только в тексте.
 * Смысл: ребёнок видит ответ там, где считал, и связывает число с картинкой.
 */
export const AnsPop = ({ n }) => (
  <span className="g1-anspop g1-pop-in" aria-hidden="true">
    <i className="g1-anspop-eq">=</i>
    <b className="g1-anspop-num">{n}</b>
  </span>
);

// ---------------------------------------------------------------------------
// ПОЛЕЗНОЕ / ВОПРОС — рамки-подписи
// ---------------------------------------------------------------------------
export const InfoNote = ({ badge, text }) => (
  <div className="d2-infonote fade-up">
    <span className="d2-infonote-badge mono">{badge}</span>
    <p className="d2-infonote-txt">{text}</p>
  </div>
);

export const QTitle = ({ title, q }) => (
  <div>
    {title && <p className="d2-qlead">{title}</p>}
    <h2 className="title h-sub" style={{ textAlign: 'center' }}>{q}</h2>
  </div>
);

/**
 * ReadinessMeter — путь по планете: сколько районов Lumo пройдено.
 *
 * В 19 эталонных уроках нашлось 15 РАЗНЫХ версий этого компонента, доминирующей
 * нет — каждый урок правил его под себя. Здесь одна версия, параметризованная:
 * зоны и подпись приходят пропами, поэтому больше не нужно плодить варианты.
 * Значения по умолчанию — 6 районов Lumo = 6 блоков программы (SYUJET_3SINF.md).
 */
export const LUMO_ZONES = ['#F2A65A', '#7FD69B', '#C6A0F0', '#F0C24A', '#7FC4D6', '#5A8FD6'];
const READY_LABEL = { uz: 'Lumo sayyorasi', ru: 'Планета Лумо', en: 'Planet Lumo' };

export const ReadinessMeter = ({ screen, total, lang = 'ru', zones = LUMO_ZONES, label }) => {
  const pct = total > 1 ? screen / (total - 1) : 0;
  const text = label || READY_LABEL[lang] || READY_LABEL.ru;
  const current = zones.length > 1
    ? Math.min(zones.length - 1, Math.round(pct * (zones.length - 1)))
    : 0;
  return (
    <div className="lm-meter" aria-hidden="true">
      <div className="lm-meter-label mono">{text}</div>
      <div className="lm-meter-track">
        <div className="lm-meter-fill" style={{ height: `${Math.round(pct * 100)}%` }}/>
        {zones.map((col, i) => (
          <span
            key={i}
            className={`lm-meter-dot ${i === current ? 'lm-meter-dot-cur' : ''}`}
            style={{ bottom: `${(i / (zones.length - 1)) * 100}%`, background: col }}
          />
        ))}
      </div>
    </div>
  );
};
