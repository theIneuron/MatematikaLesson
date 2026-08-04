// ============================================================================
// grade3/kit/mathviz.jsx — МАТЕМАТИЧЕСКИЕ ВИЗУАЛИЗАТОРЫ РАЗРЯДОВ
//
// Источник: src/components/grade3/Dars01.jsx, версия ИЗ КОММИТА (HEAD).
// Chiroq, Lenta, Panel, PlaceViz — байт-идентичны во всех 19 эталонных уроках,
// RazryadTable разошёлся на 2 версии (17 против 2) — взята доминирующая.
//
// Материальная модель разряда в 3 классе (SYUJET_3SINF.md, «Bit shahri»):
//     chiroq  = 1 единица       — один огонёк
//     lenta   = 10 chiroq       — лента из десяти огоньков
//     panel   = 10 lenta = 100  — панель 10×10
// Модель не абстрактная: ребёнок видит, что сотня СОБРАНА из десятков, а десяток
// из единиц. Именно это делает «10 десятков = 1 сотня» наблюдением, а не правилом.
//
// Цветовой код разрядов берётся из schema.js (ETALON v2 §7) и обязателен всюду,
// где разряд виден: сотни #C0392B, десятки #1F7A4D, единицы #019ACB.
// ============================================================================

// React не импортируется: в проекте новый JSX-трансформ (@vitejs/plugin-react).
import { PLACE_COLORS } from './schema.js';
import { AnsPop } from './fx.jsx';

export { PLACE_COLORS };

// ---------------------------------------------------------------------------
// ЕДИНИЦЫ РАЗРЯДА
// Свечение через url(#lmGlow) — градиент объявлен в <LumoDefs/> из fx.jsx.
// Без LumoDefs на экране огоньки станут чёрными: не забыть смонтировать его один
// раз в корне урока.
// ---------------------------------------------------------------------------

/** Единица — один огонёк. */
export const Chiroq = ({ className = '' }) => (
  <svg className={`lm-chiroq ${className}`} viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7.2" fill="#FF9A2E" opacity="0.42"/>
    <circle cx="8" cy="8" r="4.6" fill="url(#lmGlow)"/>
    <circle cx="6.4" cy="6.4" r="1.6" fill="rgba(255,255,255,0.9)"/>
  </svg>
);

/** Десяток — лента из десяти огоньков. Их РОВНО десять, это видно и можно пересчитать. */
export const Lenta = ({ className = '' }) => (
  <svg className={`lm-lenta ${className}`} viewBox="0 0 92 20" aria-hidden="true">
    <rect x="1" y="2" width="90" height="16" rx="6" fill="#1B2A4A" stroke="#3A4E78" strokeWidth="1"/>
    {Array.from({ length: 10 }).map((_, i) => (
      <circle key={i} cx={9.5 + i * 8.1} cy="10" r="3" fill="url(#lmGlow)"/>
    ))}
  </svg>
);

/** Сотня — панель 10×10. Ровно сто огоньков: десять лент, каждая по десять. */
export const Panel = ({ className = '' }) => (
  <svg className={`lm-panel ${className}`} viewBox="0 0 96 96" aria-hidden="true">
    <rect x="1" y="1" width="94" height="94" rx="9" fill="#152342" stroke="#3A4E78" strokeWidth="1.4"/>
    {Array.from({ length: 100 }).map((_, i) => {
      const col = i % 10;
      const row = Math.floor(i / 10);
      return <circle key={i} cx={9.5 + col * 8.5} cy={9.5 + row * 8.5} r="2.6" fill="url(#lmGlow)"/>;
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// СБОРКА ЧИСЛА ИЗ РАЗРЯДОВ
// ---------------------------------------------------------------------------

/**
 * PlaceViz — число как набор панелей, лент и огоньков.
 * Каскад появления через animationDelay по индексу: сначала сотни, потом десятки,
 * потом единицы — порядок чтения разрядов совпадает с порядком появления.
 * ans !== null — верный ответ всплывает числом прямо в визуале (AnsPop).
 */
export const PlaceViz = ({ hundreds = 0, tens = 0, ones = 0, ans = null, small = false }) => (
  <div className={`lm-pv ${small ? 'lm-pv-sm' : ''}`}>
    {hundreds > 0 && (
      <span className="lm-pv-grp">
        {Array.from({ length: hundreds }).map((_, i) => (
          <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${i * 0.08}s` }}><Panel/></span>
        ))}
      </span>
    )}
    {tens > 0 && (
      <span className="lm-pv-grp">
        {Array.from({ length: tens }).map((_, i) => (
          <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${(hundreds + i) * 0.06}s` }}><Lenta/></span>
        ))}
      </span>
    )}
    {ones > 0 && (
      <span className="lm-pv-grp lm-pv-ones">
        {Array.from({ length: ones }).map((_, i) => (
          <span key={i} className="lm-pv-item g1-pop-in" style={{ animationDelay: `${(hundreds + tens + i) * 0.05}s` }}><Chiroq/></span>
        ))}
      </span>
    )}
    {hundreds === 0 && tens === 0 && ones === 0 && <span className="lm-pv-empty mono">?</span>}
    {ans != null && <AnsPop n={ans}/>}
  </div>
);

/**
 * TapCollect — СБОРКА РАЗРЯДА РУКАМИ РЕБЁНКА.
 *
 * Перенос механики из урока 1 второго класса (`Dars01.jsx`, Screen2, tap-to-cassette):
 * по полю разбросаны десять единиц младшего разряда, ребёнок собирает их по одной
 * в приёмник, счётчик показывает «N / 10», и только когда собраны все десять —
 * они превращаются в одну единицу старшего разряда.
 *
 * Зачем это вместо картинки, которая меняется сама. В пассивном показе ребёнок
 * видит «десять лент стали сотней» как факт, который ему сообщили. Собрав десять
 * лент сам, он видит то же как следствие своего действия — и «десять десятков =
 * сотня» перестаёт быть правилом на слух. Во 2 классе так устроены все ключевые
 * экраны открытия, и это решение методиста, а не оформление.
 *
 * Положения единиц заданы кольцом вокруг приёмника: центр свободен, поэтому
 * приёмник виден сразу и понятно, куда собирать.
 *
 * @param from  'tens' | 'hundreds' — что собираем (по десять штук)
 * @param taken сколько уже собрано (состоянием владеет экран)
 * @param done  все десять собраны: показываем единицу старшего разряда
 * @param onTap (index) — нажатие по единице; без него поле не активно
 */
const RING = [
  { x: 8, y: 10 }, { x: 38, y: 5 }, { x: 66, y: 7 }, { x: 87, y: 14 },
  { x: 3, y: 42 }, { x: 89, y: 44 },
  { x: 7, y: 76 }, { x: 38, y: 85 }, { x: 67, y: 82 }, { x: 87, y: 73 },
];

export const TapCollect = ({ from = 'tens', taken = 0, done = false, onTap = null, label }) => {
  const Unit = from === 'hundreds' ? Panel : Lenta;
  const Big = from === 'hundreds' ? null : Panel;   // из сотен собирается тысяча — у неё нет плитки
  const unitCls = from === 'hundreds' ? 'lm-tc-unit-h' : 'lm-tc-unit-t';
  return (
    <div className="lm-tc">
      <div className="lm-tc-field">
        {RING.map((p, i) => i >= taken && (
          <button
            key={i}
            type="button"
            className={`lm-tc-item ${unitCls}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${0.08 + i * 0.06}s` }}
            disabled={!onTap || done}
            onClick={() => onTap && onTap(i)}
            aria-label={`${i + 1}`}
          >
            <Unit/>
          </button>
        ))}

        <div className={`lm-tc-dock ${done ? 'lm-tc-dock-done' : ''}`}>
          {done ? (
            <span className="g1-pop-in lm-tc-big">
              {Big ? <Big className="lm-tc-bigfig"/> : <span className="mono lm-tc-ming">1000</span>}
            </span>
          ) : (
            <span className="lm-tc-slots">
              {Array.from({ length: 10 }).map((_, k) => (
                <span key={k} className={`lm-tc-slot ${k < taken ? 'lm-tc-slot-full' : ''}`}>
                  {k < taken && <span className="g1-pop-in lm-tc-slotfig"><Unit/></span>}
                </span>
              ))}
            </span>
          )}
          <span className={`mono lm-tc-count ${done ? 'lm-tc-count-ok' : ''}`}>
            {done && label ? label : `${taken} / 10`}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * RazryadTable — таблица разрядов в три столбца.
 *
 * concrete — в столбцах материальные единицы (панели/ленты/огоньки);
 * digits   — в столбцах цифры;
 * onCell   — столбцы становятся кнопками (используется в «вопросе до правила»:
 *            подписи скрыты как «?», ребёнок тапает нужный разряд, и только после
 *            верного ответа открываются подписи и правило — ETALON v2 §3.3);
 * emph     — подсветить один столбец;
 * cellSel  — какой столбец отмечен верным.
 *
 * Ноль показывается ЦИФРОЙ 0, а не пустотой: пустая клетка читается как «здесь
 * ничего нет», а ноль в разряде — это «здесь ровно ноль», и именно на этом
 * держится misconception «502 → 52».
 */
export const RazryadTable = ({
  h = 0, t = 0, o = 0, labels, emph = null,
  concrete = false, digits = false, onCell = null, cellSel = null, places = 'hto',
}) => {
  // places — какие разряды показывать. По умолчанию все три, но для двузначного
  // числа столбец сотен показывать НЕЛЬЗЯ: пустая клетка с нулём там, где сотен
  // в задаче нет, читается как часть числа. В уроке 1 второго класса таблица
  // двузначного числа состоит из двух столбцов, и это правильно.
  const all = [['h', h], ['t', t], ['o', o]];
  const cols = all.filter(([k]) => places.includes(k));
  return (
    <div className="lm-mat">
      {cols.map(([k, n]) => (
        <div key={k} className={`lm-mat-col ${emph === k ? 'lm-mat-emph' : ''}`}>
          <div className="lm-mat-head mono">{labels[k]}</div>
          <div className="lm-mat-cell">
            {concrete && (
              <div className="lm-mat-stack">
                {n === 0
                  ? <span className="lm-mat-zero mono">0</span>
                  : Array.from({ length: n }).map((_, i) => (
                    <span key={i} className="lm-dock" style={{ animationDelay: `${i * 0.08}s` }}>
                      {k === 'h' ? <Panel className="lm-mat-panel"/>
                        : k === 't' ? <Lenta className="lm-mat-lenta"/>
                          : <Chiroq className="lm-mat-chiroq"/>}
                    </span>
                  ))}
              </div>
            )}
            {digits && (
              onCell
                ? (
                  <button
                    className={`lm-mat-digit lm-mat-digit-btn mono ${cellSel === k ? 'lm-mat-digit-ok' : ''}`}
                    onClick={() => onCell(k)}
                  >
                    {n}
                  </button>
                )
                : <div className="lm-mat-digit mono">{n}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// РАЗРЯДНАЯ КОНСОЛЬ — сборка числа степперами.
// Выбор методиста: вместо укладывания блоков по одному — консоль, где у каждого
// разряда один знак, множитель ×N и вычисленное значение. Логика base-10
// сохраняется: панель ×N = N·100, лента ×N = N·10.
// ---------------------------------------------------------------------------
const CONS_META = [
  { k: 'h', pv: 100, Ico: Panel, cls: 'lm-cons-ico-h' },
  { k: 't', pv: 10, Ico: Lenta, cls: 'lm-cons-ico-t' },
  { k: 'o', pv: 1, Ico: Chiroq, cls: 'lm-cons-ico-o' },
];

export const RazryadConsole = ({ vals, labels, onStep = null, disabled = false, maxPerPlace = 9 }) => (
  <div className="lm-console">
    {CONS_META.map(({ k, pv, Ico, cls }) => {
      const n = vals[k];
      return (
        <div key={k} className={`lm-cons ${n > 0 ? 'lm-cons-lit' : ''}`}>
          <div className="lm-cons-head mono">{labels[k]}</div>
          <div className="lm-cons-screen">
            <Ico className={`lm-cons-ico ${cls}`}/>
            <span key={n} className={`lm-cons-x mono ${n > 0 ? '' : 'lm-cons-x-dim'}`}>×{n}</span>
          </div>
          <div className="lm-cons-val mono">{n * pv}</div>
          {onStep && (
            <div className="lm-cons-steps">
              <button className="lm-cons-btn" disabled={disabled || n <= 0} onClick={() => onStep(k, -1)} aria-label={`${labels[k]}: kamaytirish`}>−</button>
              <button className="lm-cons-btn lm-cons-btn-up" disabled={disabled || n >= maxPerPlace} onClick={() => onStep(k, 1)} aria-label={`${labels[k]}: ko'paytirish`}>+</button>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

/** Крупное число — итог сборки. accent — когда собрано верно. */
export const BigNum = ({ v, accent = false }) => (
  <span className={`lm-bignum ${accent ? 'lm-bignum-accent' : ''}`}>{v}</span>
);
