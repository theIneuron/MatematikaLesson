// ============================================================================
// informatika3/lessons/Dars01.jsx — ТОЧКА СБОРКИ УРОКА «ЧТО ТАКОЕ КОМПЬЮТЕР»
//
// Здесь и только здесь сходятся три вещи, которые в остальном друг о друге не знают:
//   данные урока  content/Dars01.data.js  — что говорим и спрашиваем
//   сцены урока   scenes/Dars01/          — визуалы, нужные только этому уроку
//   каркас        screens/, kit/          — как это работает и выглядит
//
// ПОЧЕМУ ДВЕ СЦЕНЫ ПРИВЯЗАНЫ К ДАННЫМ ЗДЕСЬ, А ОСТАЛЬНЫЕ НЕТ
//
// Обычная сцена получает всё из данных: в `visual: { type:'scene', props:{...} }`
// урок передаёт ей и подписи, и состояние. Но HookScreen и SummaryScreen
// устроены иначе: сцену-обрамление они подключают по ИМЕНИ и передают ей ровно
// один проп — gathered (ответил ребёнок или нет). Своих пропов сцене они не дают.
//
// Поэтому предметам первого экрана и командам двенадцатого некуда приехать из
// данных, кроме привязки на этом уровне. Альтернативы хуже: держать список
// предметов внутри сцены значит положить контент в код, а править под это
// HookScreen математики значит менять чужой работающий экран под свой случай.
// ============================================================================

import LESSON_DATA, { HOOK_ITEMS, THINK_ROWS, THINK_HEADERS, THINK_NOTE } from '../content/Dars01.data.js';
import Computer3D from '../scenes/Dars01/Computer3D.jsx';
import AroundUsScene from '../scenes/Dars01/AroundUsScene.jsx';
import ThinkTestScene from '../scenes/Dars01/ThinkTestScene.jsx';
import { IOChain, SignalFlow, DeviceRow } from '../kit/index.js';
import { LessonShell, SCREENS_BY_ROLE } from '../screens/index.js';

// Данные идут ПОСЛЕ распаковки props: gathered от HookScreen сохраняется,
// а список предметов подставить снаружи уже нельзя — и не должно быть можно.
const HookShelfScene = (props) => <AroundUsScene {...props} items={HOOK_ITEMS}/>;

const BoundThinkScene = (props) => (
  <ThinkTestScene {...props} rows={THINK_ROWS} headers={THINK_HEADERS} note={THINK_NOTE}/>
);

// Реестр сцен собирается на уровне МОДУЛЯ. Объект, созданный в рендере, — новая
// ссылка на каждый кадр, и предупреждения контракта в LessonShell печатались бы
// бесконечно (грабли из grade3/lessons/Dars01.jsx).
const LESSON = {
  ...LESSON_DATA,
  scenes: {
    // своё, только для этого урока
    Computer3D,
    AroundUsScene,
    HookShelfScene,
    ThinkTestScene: BoundThinkScene,
    // визуализаторы каркаса, подключённые как сцены: подписи и состояние им
    // передаёт сам урок через visual.props, поэтому обёртка не нужна
    ChainScene: IOChain,
    DeviceScene: DeviceRow,
    SignalScene: SignalFlow,
  },
};

export default function Dars01(props) {
  return <LessonShell {...props} lesson={LESSON} components={SCREENS_BY_ROLE}/>;
}
