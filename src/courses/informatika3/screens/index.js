// ============================================================================
// informatika3/screens/index.js — РЕЕСТР ЭКРАНОВ ИНФОРМАТИКИ ПО РОЛЯМ
//
// Единственное место во всём предмете, которое знает про оба дерева: каркас
// математики (`src/courses/grade3/`) и свой (`src/courses/informatika3/`).
// Ни урок, ни сцена, ни экран больше нигде через границу не ходят.
//
// ПОЧЕМУ ЭКРАНЫ БЕРУТСЯ ИЗ МАТЕМАТИКИ
//
// Роли урока педагогические, а не предметные. «Проблема и предсказание»,
// «правило после вопроса», «три раунда упражнения с разбором на каждый неверный
// вариант», «жизненная задача», «итог и мостик» — это устройство урока, и оно
// одинаково для сотен и для процессора. Предметное в уроке — визуал и слова,
// то есть сцены и данные, и именно они здесь свои.
//
// Своим сделан ровно ОДИН экран — SignalFlowScreen. Не потому, что он про
// информатику, а потому что он ведёт себя иначе: раскрытием управляет ребёнок,
// а не озвучка. Появится второй такой — появится второй файл; заводить экран на
// каждую роль значило бы вернуться к пятнадцати почти одинаковым Screen0..15.
// ============================================================================

import {
  LessonShell, HookScreen, ExplorationScreen, RuleScreen, TestScreen, CaseScreen, SummaryScreen,
} from '../engine/screens/index.js';
import SignalFlowScreen from './SignalFlowScreen.jsx';

export { LessonShell, SignalFlowScreen };

export const SCREENS_BY_ROLE = {
  // hook — предсказание до объяснения
  problem: HookScreen,

  // exploration — различаются данными, не поведением
  recall: ExplorationScreen,
  concrete_model: ExplorationScreen,
  second_model: ExplorationScreen,
  bridge: ExplorationScreen,

  // exploration с ведущей ролью ребёнка: он открывает признак касанием
  discovery: SignalFlowScreen,

  // РОЛЬ, КОТОРОЙ НЕТ В МАТЕМАТИКЕ.
  // «Компьютер не думает, он выполняет команды» — это не открытие признака и не
  // упражнение, а снятие ложной модели, которая у десятилетнего уже есть и мешает
  // всему курсу («компьютер умный, он сам догадается»). Механика — предсказание,
  // поэтому обслуживает HookScreen: ребёнок отвечает, и мир показывает следствие.
  myth_check: HookScreen,

  // rule — правило только после вопроса (§3.3)
  rule: RuleScreen,

  // test — правила раундов, подсказок и оценки общие
  guided_practice: TestScreen,
  independent_practice: TestScreen,
  error_find: TestScreen,
  reverse_task: TestScreen,
  final_diagnostic: TestScreen,

  // case и итог
  life_problem: CaseScreen,
  summary: SummaryScreen,

  // запасные ключи по техническому типу
  hook: HookScreen,
  exploration: ExplorationScreen,
  test: TestScreen,
  case: CaseScreen,
};
