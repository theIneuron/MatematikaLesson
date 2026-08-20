// 4-sinf nazariy darslarining umumiy qobig'i.
//
// Dars fayli faqat quyidagilarni beradi: LESSON_META, SCREEN_META, CONTENT,
// ekran komponentlari va mavzuga xos chizmalar. Infrastruktura shu moduldan
// keladi — CLAUDE.md §5 («umumiy kod ko'chirilmaydi, import qilinadi»).
export { T } from './palette.js';
export { buildTheoryStyles } from './styles.js';
export { BitSVG } from './Bit.jsx';
export { TheoryLessonRoot } from './LessonRoot.jsx';
export {
  ActivityContext,
  LangContext,
  LessonContext,
  SPEECH_LOCALES,
  SUPPORTED_LANGS,
  buildOptionOrder,
  configureTheoryRuntime,
  getAudioEngine,
  normalizeLang,
  playSfx,
  useAudio,
  useCanAnswer,
  useIsMobile,
  useLang,
  useLesson,
  useNarration,
  usePrefersReducedMotion,
  useT,
} from './runtime.js';
export {
  AudioIndicator,
  ExploreStage,
  FeedbackBlock,
  Heading,
  Options,
  ScreenTypeLabel,
  Stage,
} from './ui.jsx';
export { SCREEN_TYPE_LABELS, assertScreenTypeLabels } from './screenTypes.js';
export {
  ChoiceExercise,
  MatchExercise,
  MultiExercise,
  OrderExercise,
} from './mechanics.jsx';
