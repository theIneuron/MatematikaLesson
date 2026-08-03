// ============================================================================
// scenes/Dars01/LumoCityScene.jsx — СЦЕНА-ОБРАМЛЕНИЕ УРОКА 1
//
// ETALON v2 §1.3: одна сцена на первом и последнем экране, ДВА состояния одного
// мира, а не два разных рисунка. Переключает единственный флаг gathered.
//
//   gathered = false  экран 1. Над городом висят россыпью огоньки. Порядка нет,
//                     считать их по одному бессмысленно — это и есть препятствие,
//                     с которого начинается урок.
//   gathered = true   экран 15. Те же огни собраны: три панели, четыре ленты и
//                     шесть огоньков. Ровно тот район, который ребёнок сосчитал на
//                     экране 13 (346). Число НЕ подписано: ребёнок его уже знает,
//                     а подпись превратила бы финал в ответ на вопрос, которого нет.
//
// Почему сцена лежит здесь, а не в kit/. Каркас обслуживает любой урок 3 класса;
// «россыпь огней превращается в панели» — смысл ПЕРВОГО урока и ничей больше.
// Если такую сцену положить в kit, каркас начнёт расти на каждый урок, а это ровно
// то, от чего мы ушли (kit/index.js, шапка файла).
//
// Сцена НЕ анимирует полёт огоньков в панели: перелёт между двумя разными
// деревьями (SVG-россыпь и блочная раскладка) сделать нельзя без общей системы
// координат. Вместо этого россыпь гаснет, а собранный район поднимается — глаз
// читает это как «собрали», и обе части остаются простыми.
// ============================================================================

import { LumoCityBg, LumoSceneCast, Panel, Lenta, Chiroq } from '../../kit/index.js';

// Россыпь: координаты в процентах сцены. Не случайные числа — намеренно
// неровные, без строк и столбцов: любая замеченная регулярность подсказала бы
// способ счёта раньше времени.
const SCATTER = [
  [7, 20], [15, 9], [23, 26], [31, 13], [38, 30], [45, 7], [52, 22], [59, 11],
  [66, 28], [73, 15], [81, 24], [88, 10], [12, 35], [27, 40], [43, 38], [57, 43],
  [70, 36], [84, 41], [19, 17], [35, 21], [50, 33], [64, 19], [77, 31], [92, 20],
];

// Собранный район: 3 панели, 4 ленты, 6 огоньков — состав из экрана 13.
const DISTRICT = { panels: 3, ribbons: 4, lights: 6 };

const layer = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: '38%',      // ниже начинается экипаж: перекрывать его нельзя
  zIndex: 1,
  pointerEvents: 'none',
};

export default function LumoCityScene({ gathered = false }) {
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>

      {!gathered && (
        <div style={layer} aria-hidden="true">
          {SCATTER.map(([x, y], i) => (
            <span
              key={i}
              className="lm-float"
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: 'clamp(9px, 1.9vw, 15px)',
                animationDelay: `${(i % 7) * 0.45}s`,
              }}
            >
              <Chiroq/>
            </span>
          ))}
        </div>
      )}

      {gathered && (
        <div
          style={{
            ...layer,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(6px, 1.6vw, 14px)', padding: '0 4%',
          }}
          aria-hidden="true"
        >
          {Array.from({ length: DISTRICT.panels }).map((_, i) => (
            <span
              key={`p${i}`}
              className="g1-pop-in"
              style={{ width: 'clamp(46px, 9vw, 86px)', animationDelay: `${i * 0.12}s` }}
            >
              <Panel/>
            </span>
          ))}

          {/* Ленты стоят столбиком: так видно, что их четыре, а не «сколько-то». */}
          <span style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3px, 0.8vw, 6px)' }}>
            {Array.from({ length: DISTRICT.ribbons }).map((_, i) => (
              <span
                key={`r${i}`}
                className="g1-pop-in"
                style={{ width: 'clamp(52px, 10vw, 96px)', animationDelay: `${0.36 + i * 0.09}s` }}
              >
                <Lenta/>
              </span>
            ))}
          </span>

          <span style={{ display: 'flex', gap: 'clamp(2px, 0.6vw, 5px)', flexWrap: 'wrap', width: 'clamp(30px, 6vw, 54px)' }}>
            {Array.from({ length: DISTRICT.lights }).map((_, i) => (
              <span
                key={`o${i}`}
                className="g1-pop-in"
                style={{ width: 'clamp(9px, 1.8vw, 15px)', animationDelay: `${0.72 + i * 0.07}s` }}
              >
                <Chiroq/>
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Экипаж и Bit — из каркаса: канон-5 и порядок фигур общие для всех уроков.
          Ряд идёт последним, поэтому фигуры перекрывают слой огней, а не наоборот. */}
      <LumoSceneCast gathered={gathered}/>
    </div>
  );
}
