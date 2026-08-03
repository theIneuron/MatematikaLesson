// ============================================================================
// courses/grade3/lessons/Dars01.jsx — ТОЧКА СБОРКИ УРОКА 1
//
// Здесь и только здесь сходятся три вещи, которые в остальном не знают друг о друге:
//   данные урока   content/Dars01.data.js   — что говорим и спрашиваем
//   сцены урока    scenes/Dars01/           — визуалы, нужные только этому уроку
//   каркас         screens/, kit/           — как это работает и выглядит
//
// Файл намеренно крошечный. Если он начнёт расти — значит в него потекла либо
// логика (её место в screens/), либо контент (его место в content/). Именно так
// уроки 1–8 классов дошли до 10 000 строк: каждый начинался таким же файлом.
//
// Реестр сцен собирается на уровне МОДУЛЯ, а не в рендере: объект, созданный при
// каждом рендере, — новая ссылка, и предупреждения контракта в LessonShell начали
// бы печататься бесконечно.
// ============================================================================

import LESSON_DATA from '../content/Dars01.data.js';
import LumoCityScene from '../scenes/Dars01/LumoCityScene.jsx';
import { LessonShell, SCREENS_BY_ROLE } from '../screens/index.js';

const LESSON = { ...LESSON_DATA, scenes: { LumoCityScene } };

export default function Dars01(props) {
  return <LessonShell {...props} lesson={LESSON} components={SCREENS_BY_ROLE}/>;
}
