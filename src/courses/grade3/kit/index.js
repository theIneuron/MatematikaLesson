// ============================================================================
// grade3/kit/index.js — ЕДИНСТВЕННЫЙ ПУБЛИЧНЫЙ ВХОД В КАРКАС
//
// Уроки и сцены импортируют ТОЛЬКО отсюда:
//     import { Stage, useAudio, RazryadTable } from '../kit/index.js';
//
// Прямой импорт kit/infra.js или kit/ui.jsx из урока запрещён, и тем более импорт
// чего-либо из src/components/gradeN/DarsNN.jsx. Именно так возникла нынешняя
// ситуация в проекте: раннер 32 уроков живёт внутри файла урока Dars19.jsx, а тот
// тянет сцены из Dars01, Dars02, Dars09 и Dars18 — правка одного урока способна
// сломать тридцать других. Единая точка входа делает такую связь невозможной.
//
// Состав каркаса и происхождение каждого модуля — в kit/README.md.
// Контракт, который каркас обслуживает — src/books/grade3/ETALON_3SINF_v2.md.
// ============================================================================

// --- КОНТРАКТ ДАННЫХ: типы экрана, роли, механики, правила, дизайн-токены -----
export {
  SCREEN_TYPES, RETURN_BEHAVIOUR,
  ROLES, ROLE_KEYS, REQUIRED_ROLE_KEYS, rolesOf, roleDef, isInteractiveScreen, isScoredScreen,
  INTERACTIONS, INTERACTION_KEYS, ROLE_INTERACTION_HINT, SOURCE_COMPONENTS, NOT_IMPLEMENTED,
  NUMERIC_INPUT_INTERACTIONS, MECHANICS,
  ANSWER_RULES, correctPositions, findRepeatedCorrectPositions,
  AUDIO_CONTRACT, FORBIDDEN_IN_SPEECH, UZ_TEXT_RULES, REGISTER, CAST, TERM_SOURCES,
  FEEDBACK_FLOW, HINT_ESCALATION, needsHintEscalation, BOOKEND_SCENE, SCROLL_AND_LAYOUT,
  PALETTE, PLACE_COLORS, LAYOUT, FONTS, RADII, BORDERS, BUTTON_SPEC, FRAME_SPEC,
  TIMING, estimateLessonSeconds, longSegments, LESSON_RULES,
  speechTokens, isAudioDerivedFromScreen, findForbiddenInSpeech, findUzTextIssues,
  missingRoles, missingLocales, interactionKinds, activeScreensShare,
  badOptionCounts, roleInteractionMismatch,
} from './schema.js';

// --- РЕЧЬ: запрещённое в озвучке — ошибка контента, а не автозамена -----------
export {
  SPEECH_WORDS, suggestWord, checkSpeech, isSpeakable, toSpeech, checkAllSpeech,
} from './verbalize.js';

// --- ЛОКАЛИЗАЦИЯ: без тихой подмены языка ------------------------------------
export {
  LOCALES, stripAudioTags, isLocalizedNode, missingLocalesIn,
  localize, makeT, collectMissingLocales,
} from './i18n.js';

// --- ДВИЖОК И ХУКИ ----------------------------------------------------------
export {
  T, configureLesson, getTtsConfig, isPreview, FREE_NAV,
  LANG_TAG, END_TAG, buildTtsUrl,
  playChime, useSfx, gradeAnswer,
  LangContext, useLang, ProgressContext, useProgress, NavUnlockContext, useT,
  useIsMobile, useMobileZoom, MOBILE_DESIGN_W,
  getAudioEngine, useAudio, makeAutoSegments, makeStepSegments,
  useCanAnswer, useAdvanceGate, autoScrollTo, useRevealScroll,
} from './infra.js';

// --- РАСКЛАДКА ВАРИАНТОВ ОТВЕТА ---------------------------------------------
export {
  planAnswerPositions, remapToPosition, collectAnswerSlots,
  makeAnswerLayout, findRepeatedPositions,
} from './answers.js';

// --- ОБОЛОЧКА ЭКРАНА, КНОПКИ, ОБРАТНАЯ СВЯЗЬ --------------------------------
export {
  Op, Frac, mt,
  Progress, ScreenTypeBadge, AudioIndicator, Stage,
  NavBack, NavNext, OptionButton, useCorrectRevealThenFade,
  FeedbackBlock, NumPad, Slider,
} from './ui.jsx';

// --- ВИЗУАЛИЗАТОРЫ РАЗРЯДОВ -------------------------------------------------
export {
  Chiroq, Lenta, Panel, PlaceViz, RazryadTable, RazryadConsole, BigNum,
} from './mathviz.jsx';

// --- ЭФФЕКТЫ И НАГРАДА -----------------------------------------------------
// LumoDefs монтируется ОДИН РАЗ в корне урока: без него градиент lmGlow не
// объявлен и все огоньки, ленты и панели станут чёрными.
export {
  LumoDefs, AmbientMotes, FrameFx, Confetti, SparkBurst, AnsPop,
  InfoNote, QTitle, ReadinessMeter, LUMO_ZONES,
} from './fx.jsx';

// --- ПЕРСОНАЖИ (канон-5, новых не добавлять) --------------------------------
export {
  PRAISE, ENCOURAGE, nextPraise, nextEncourage,
  BitSVG, RanoSVG, AnvarSVG, JasurSVG, ZuhraSVG,
  HeroContext, useHero, StageHero, Reaction,
} from './cast.jsx';

// --- СРЕДА LUMO И СЦЕНА-ОБРАМЛЕНИЕ -----------------------------------------
// HookScene — одна сцена на первом и последнем экране, состояние переключает
// флаг gathered (ETALON v2 §1.3).
export {
  Cloud, AlienBloom, AlienShroom, AlienLantern, AlienCrystal,
  Lamp, LandingPod, FloatCrystal, FlyCreature,
  LumoCityBg, MiniCity, HookScene,
} from './world.jsx';
