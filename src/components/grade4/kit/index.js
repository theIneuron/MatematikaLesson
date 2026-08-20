// 11-20-darslarning umumiy qobig'i.
//
// Dars fayli faqat LESSON_META, SCREEN_META, CONTENT va o'z chizmalarini
// beradi. Ish qatlami (til, ovoz v5.2, javob gate'i, natija payloadi) —
// `theoryShell/runtime.js` va `theoryShell/LessonRoot.jsx` dan o'zgarishsiz
// olinadi; ko'rinish qatlami shu papkada.
export { T } from '../theoryShell/palette.js';
export { TheoryLessonRoot } from '../theoryShell/LessonRoot.jsx';
export { assertScreenTypeLabels } from '../theoryShell/screenTypes.js';
export {
  LangContext,
  LessonContext,
  useLang,
  useLesson,
  useNarration,
  usePrefersReducedMotion,
  useT,
} from '../theoryShell/runtime.js';

export { KIT_STYLES } from './styles.js';
export {
  AudioIndicator,
  BitSVG,
  FeedbackBlock,
  FitSvg,
  ModelCard,
  Options,
  Stage,
} from './ui.jsx';
export {
  BuildScreen,
  ChoiceScreen,
  RevealScreen,
  SlotScreen,
} from './mechanics.jsx';
export { SummaryScreen } from './summary.jsx';
export { BarModel, Caption, Plate, RecordRow, RuleRows, StepList, StepRows } from './blocks.jsx';
export { NumPadScreen, SpanSelect, TableFill } from './inputs.jsx';
export { FormulaBuild, LevelPick, ScaleRead } from './pickers.jsx';
export { CellFill, FractionEntry, OrderStrip } from './fractions.jsx';
export {
  FractionBar, FractionCircle, FractionGlyph, FractionRay,
} from './fractionFigures.jsx';
export {
  DivisionColumn, LevelFigure, QuotientLengthFigure, ScaleFigure,
} from './mathFigures.jsx';
