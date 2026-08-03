// ============================================================================
// grade3/screens/index.js — РЕЕСТР ЭКРАНОВ ПО РОЛЯМ
//
// LessonShell выбирает компонент по роли экрана, а если роли нет в реестре —
// по техническому типу. Урок передаёт этот реестр целиком:
//
//     <LessonShell lesson={LESSON} components={SCREENS}/>
//
// Пять компонентов на пятнадцать экранов. Роли, которые различаются только
// содержанием, а не поведением (recall, concrete_model, second_model, discovery,
// discovery_line, bridge), обслуживает один ExplorationScreen: разница между ними
// в данных, а не в коде. Плодить по компоненту на роль значило бы вернуться к тому,
// с чего начинали — к пятнадцати почти одинаковым Screen0..Screen15.
// ============================================================================

import LessonShell from './LessonShell.jsx';
import HookScreen from './HookScreen.jsx';
import ExplorationScreen from './ExplorationScreen.jsx';
import NumberLineScreen from './NumberLineScreen.jsx';
import RuleScreen from './RuleScreen.jsx';
import TestScreen from './TestScreen.jsx';
import CaseScreen from './CaseScreen.jsx';
import SummaryScreen from './SummaryScreen.jsx';

export {
  LessonShell, HookScreen, ExplorationScreen, NumberLineScreen,
  RuleScreen, TestScreen, CaseScreen, SummaryScreen,
};
export { renderVisual, VISUAL_TYPES, UnitsRow } from './visuals.jsx';
export { screenMetaOf } from './LessonShell.jsx';

/**
 * Реестр по роли. Ключи — роли из ETALON_3SINF_v2 §1, плюс запасные ключи по
 * техническому типу на случай, если у экрана указан только тип.
 */
export const SCREENS_BY_ROLE = {
  // hook
  problem: HookScreen,

  // exploration — шесть роли, один компонент: различие в данных, не в поведении
  recall: ExplorationScreen,
  concrete_model: ExplorationScreen,
  second_model: ExplorationScreen,
  discovery: ExplorationScreen,
  // Отдельный компонент: здесь озвучка ЖДЁТ действия ребёнка, а не ведёт его (§3.4).
  discovery_line: NumberLineScreen,
  bridge: ExplorationScreen,

  // rule
  rule: RuleScreen,

  // test — пять роли, один компонент: правила раундов, подсказок и оценки общие
  guided_practice: TestScreen,
  independent_practice: TestScreen,
  error_find: TestScreen,
  reverse_task: TestScreen,
  final_diagnostic: TestScreen,

  // case
  life_problem: CaseScreen,

  // summary
  summary: SummaryScreen,

  // запасные ключи по техническому типу
  hook: HookScreen,
  exploration: ExplorationScreen,
  test: TestScreen,
  case: CaseScreen,
};
