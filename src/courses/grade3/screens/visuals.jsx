/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// grade3/screens/visuals.jsx — ВИЗУАЛ ИЗ ДАННЫХ
//
// Экран получает visual как СТРУКТУРУ, а не как строку для показа:
//     visual: { type: 'razryad', h: 3, t: 4, o: 5 }
//
// Почему структура, а не строка. В уроках Dars19–51 визуал задан строкой вида
//     visual: '  24\n× 13\n────\n  72\n 240'
// и та же строка уходила в озвучку — ребёнок слышал «24 ko'paytirish 13 ────».
// Структуру озвучить нельзя по определению: она не текст. Это архитектурный
// запрет на ошибку, а не правило, которое надо помнить (ETALON v2 §4.2).
//
// Типы визуала для 3 класса перечислены в VISUAL_TYPES. Если темe нужен свой
// визуал — он объявляется СЦЕНОЙ в scenes/DarsNN/ и подключается по имени,
// а не добавляется сюда: каркас не должен разрастаться под каждый урок.
// ============================================================================

import {
  Chiroq, Lenta, Panel, PlaceViz, RazryadTable, RazryadConsole, BigNum,
} from '../kit/index.js';

export const VISUAL_TYPES = [
  'place',      // число панелями, лентами и огоньками
  'razryad',    // таблица разрядов (concrete | digits)
  'console',    // разрядная консоль со степперами
  'bignum',     // крупное число-итог
  'units',      // ряд одинаковых единиц разряда
  'scene',      // именованная сцена урока из scenes/DarsNN/
];

const UNIT_BY_PLACE = { hundreds: Panel, tens: Lenta, ones: Chiroq };

/**
 * Ряд однотипных единиц разряда с каскадом появления.
 * Каскад по индексу — не украшение: ребёнок видит, что предметы появляются
 * по одному, и может их пересчитать вместе с голосом.
 */
export const UnitsRow = ({ place = 'tens', count = 0, columns }) => {
  const Unit = UNIT_BY_PLACE[place] || Chiroq;
  const style = columns
    ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, auto)`, gap: 'clamp(4px, 1vw, 7px)', justifyItems: 'center' }
    : { display: 'flex', flexDirection: place === 'tens' ? 'column' : 'row', gap: place === 'tens' ? 3 : 4, alignItems: 'center' };
  return (
    <div style={style}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="lm-drop" style={{ animationDelay: `${i * 0.06}s`, display: 'inline-flex' }}>
          <Unit className={place === 'tens' ? 'lm-mat-lenta' : place === 'hundreds' ? 'lm-panel-big' : ''}/>
        </span>
      ))}
    </div>
  );
};

/**
 * Единая точка отрисовки визуала по данным.
 *
 * @param visual структура { type, ... }
 * @param scenes реестр сцен урока { ИмяСцены: Компонент }
 * @param labels подписи разрядов { h, t, o } на текущем языке
 * @param extra  проброс обработчиков конкретного экрана (onStep, onCell)
 */
export const renderVisual = (visual, { scenes = {}, labels, extra = {} } = {}) => {
  if (!visual || !visual.type) return null;

  switch (visual.type) {
    case 'place':
      return (
        <PlaceViz
          hundreds={visual.h || 0}
          tens={visual.t || 0}
          ones={visual.o || 0}
          ans={visual.ans ?? null}
          small={!!visual.small}
        />
      );

    case 'razryad':
      return (
        <RazryadTable
          h={visual.h || 0}
          t={visual.t || 0}
          o={visual.o || 0}
          labels={visual.labels || labels}
          concrete={visual.mode !== 'digits'}
          digits={visual.mode === 'digits'}
          emph={visual.emph || null}
          onCell={extra.onCell || null}
          cellSel={extra.cellSel ?? null}
        />
      );

    case 'console':
      return (
        <RazryadConsole
          vals={visual.vals || { h: 0, t: 0, o: 0 }}
          labels={visual.labels || labels}
          onStep={extra.onStep || null}
          disabled={!!extra.disabled}
        />
      );

    case 'bignum':
      return <BigNum v={visual.value} accent={!!visual.accent}/>;

    case 'units':
      return <UnitsRow place={visual.place} count={visual.count} columns={visual.columns}/>;

    case 'scene': {
      const Scene = scenes[visual.name];
      if (!Scene) {
        // Молча ничего не показать — худший вариант: урок выглядит рабочим, а экран
        // пустой. Поэтому пропуск сцены виден и в интерфейсе, и в консоли.
        console.error(`[visuals] сцена «${visual.name}» не найдена в реестре урока`);
        return <span className="mono" style={{ color: '#C0392B' }}>⟨сцена {visual.name}?⟩</span>;
      }
      return <Scene {...(visual.props || {})} {...extra}/>;
    }

    default:
      console.error(`[visuals] неизвестный тип визуала: «${visual.type}». Допустимые: ${VISUAL_TYPES.join(', ')}`);
      return <span className="mono" style={{ color: '#C0392B' }}>⟨тип {visual.type}?⟩</span>;
  }
};
