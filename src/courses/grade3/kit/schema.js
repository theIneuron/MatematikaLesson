// ============================================================================
// grade3/kit/schema.js — КОНТРАКТ ДАННЫХ УРОКА 3 КЛАССА
//
// Машинное выражение src/books/grade3/ETALON_3SINF_v2.md.
// Точка входа в работу: START_GRADE3.md. Термины: GRADE3_SPRAVOCHNIK.md.
//
// Назначение: сделать неэталонный урок НЕВЫРАЗИМЫМ в схеме. Предыдущий каркас
// (Grade3LessonShell в Dars19.jsx) не имел поля audio вообще — поэтому 32 урока
// получили озвучку-склейку экранного текста. Схема существует, чтобы это стало
// ошибкой валидации, а не незамеченной нормой.
//
// Чистые данные и чистые предикаты. Без зависимостей, без React.
// Основа для scripts/validate-grade3.mjs (ещё не написан).
// ============================================================================

// ---------------------------------------------------------------------------
// 1. ТИПЫ ЭКРАНА (6) — то, что знает код.
// От типа зависят рамка, поведение при возврате и участие в оценке.
// ---------------------------------------------------------------------------
export const SCREEN_TYPES = ['hook', 'exploration', 'rule', 'test', 'case', 'summary'];

// Поведение при возврате назад — ETALON v2 §10.
export const RETURN_BEHAVIOUR = {
  hook: 'reset',        // сбрасывается полностью, можно предсказать заново
  exploration: 'final', // показывается финальное состояние
  rule: 'final',
  test: 'restore',      // восстанавливается из storedAnswer, балл не меняется
  case: 'restore',
  summary: 'final',
};

// ---------------------------------------------------------------------------
// 2. ПЕДАГОГИЧЕСКИЕ РОЛИ — ETALON v2 §1
//
// Роль обязательна в каждом экране. Без неё нельзя машинно спросить
// «есть ли в уроке обратная задача» — именно это расхождение между контрактом
// и практикой обнаружилось в 7 эталонных уроках 3 класса.
// ---------------------------------------------------------------------------
export const ROLES = [
  { key: 'problem',              type: 'hook',        required: true,  scored: false, interactive: true,  ru: 'Проблема и предсказание', uz: 'Muammo va taxmin' },
  { key: 'recall',               type: 'exploration', required: true,  scored: false, interactive: false, ru: 'Напоминание опоры',       uz: 'Eslatish' },
  { key: 'concrete_model',       type: 'exploration', required: true,  scored: false, interactive: false, ru: 'Конкретная модель',       uz: 'Konkret model' },
  { key: 'second_model',         type: 'exploration', required: true,  scored: false, interactive: false, ru: 'Вторая модель / способы', uz: 'Ikkinchi model' },
  { key: 'discovery',            type: 'exploration', required: true,  scored: false, interactive: true,  ru: 'Открытие признака',       uz: "O'quvchi kashfiyoti" },
  { key: 'discovery_line',       type: 'exploration', required: false, scored: false, interactive: true,  ru: 'Модель на прямой',        uz: "Son o'qida model" },
  { key: 'bridge',               type: 'exploration', required: false, scored: false, interactive: false, ru: 'Мостик вперёд',           uz: "Ko'prik" },
  { key: 'rule',                 type: 'rule',        required: true,  scored: false, interactive: true,  ru: 'Правило',                 uz: 'Qoida' },
  { key: 'guided_practice',      type: 'test',        required: true,  scored: true,  interactive: true,  ru: 'Совместное упражнение',   uz: 'Birgalikdagi mashq' },
  { key: 'independent_practice', type: 'test',        required: true,  scored: true,  interactive: true,  ru: 'Самостоятельное',         uz: 'Mustaqil mashq' },
  { key: 'error_find',           type: 'test',        required: true,  scored: true,  interactive: true,  ru: 'Найди ошибку',            uz: 'Xatoni topish' },
  { key: 'reverse_task',         type: 'test',        required: true,  scored: true,  interactive: true,  ru: 'Обратная задача',         uz: 'Teskari topshiriq' },
  { key: 'life_problem',         type: 'case',        required: true,  scored: true,  interactive: true,  ru: 'Жизненная задача',        uz: 'Hayotiy masala' },
  { key: 'final_diagnostic',     type: 'test',        required: true,  scored: true,  interactive: true,  ru: 'Итоговая диагностика',    uz: 'Yakuniy diagnostika' },
  { key: 'summary',              type: 'summary',     required: true,  scored: false, interactive: false, ru: 'Итог и мостик',           uz: "Yakun va ko'prik" },
];

export const ROLE_KEYS = ROLES.map((r) => r.key);
export const REQUIRED_ROLE_KEYS = ROLES.filter((r) => r.required).map((r) => r.key);

// Экран может нести несколько роли (простые темы объединяют смежные задачи).
export const rolesOf = (screen) => (Array.isArray(screen?.role) ? screen.role : [screen?.role].filter(Boolean));
export const roleDef = (key) => ROLES.find((r) => r.key === key);
export const isInteractiveScreen = (screen) => rolesOf(screen).some((k) => roleDef(k)?.interactive);
export const isScoredScreen = (screen) => rolesOf(screen).some((k) => roleDef(k)?.scored);

// ---------------------------------------------------------------------------
// 3. ТИПЫ ВЗАИМОДЕЙСТВИЯ — каталог ETALON v2 §2.
// Норма: минимум 3 разных типа на урок.
// ---------------------------------------------------------------------------
export const INTERACTIONS = {
  choice:     ['mc', 'mc_rounds', 'pick_expr', 'op_choice', 'pick_object'],
  missing:    ['missing_box', 'missing_factor', 'missing_op', 'mid_input'],
  error_find: ['error_spot', 'seq_error_spot', 'mid_error'],
  reverse:    ['family_find', 'array_reverse', 'numline_back', 'div_table_fill'],
  matching:   ['match', 'sort', 'continue_pattern'],
  classify:   ['classify', 'odd_one', 'place_digits'],
  build:      ['build_number', 'gather_tens', 'rect_build', 'deal_groups'],
  column:     ['drop_column', 'align_places', 'carry_step', 'borrow_step', 'mul_column', 'div_column'],
  measure:    ['numline_point', 'length', 'perimeter', 'unit_convert'],
  input_data: ['numpad', 'table_fill', 'data_chart', 'equation', 'two_step', 'word_problem', 'commute'],
};
export const INTERACTION_KEYS = Object.values(INTERACTIONS).flat();

// Откуда переносится код механики — ETALON v2 §2.8. Проверено в коде.
export const SOURCE_COMPONENTS = {
  mul_column: {
    ready: true,
    from: ['grade5/Dars04.jsx:MulColumnSolver', 'grade5/Dars04.jsx:InteractiveMulColumn',
      'grade5/Dars04.jsx:MulColumnStepwise', 'grade5/Dars04.jsx:DigitBox'],
    note: 'полностью интерактивна: ребёнок вписывает переносы над чертой и цифры результата',
  },
  div_column: {
    ready: false,
    from: ['grade5/Dars05.jsx:DivBoard', 'grade5/Dars05.jsx:DivSolutionPlayer',
      'grade5/Dars05.jsx:ShareBoard'],
    note: 'отрисовка и озвученный разбор готовы, нуль в частном подсвечен; ВВОДА ЦИФР НЕТ — '
      + 'нужен DivColumnSolver по образцу MulColumnSolver',
  },
};

// Механики без готовой реализации: валидатор предупреждает, что нужен новый компонент.
export const NOT_IMPLEMENTED = Object.entries(SOURCE_COMPONENTS)
  .filter(([, v]) => !v.ready)
  .map(([k]) => k);

// Механики с самостоятельным вводом числа — только у них работает эскалация подсказки (§6.2).
export const NUMERIC_INPUT_INTERACTIONS = ['numpad', 'mid_input', 'missing_box', 'missing_factor',
  'drop_column', 'carry_step', 'borrow_step', 'mul_column', 'div_column', 'table_fill'];

// Роли, у которых механика обязана быть из своей группы.
export const ROLE_INTERACTION_HINT = {
  error_find: INTERACTIONS.error_find,
  reverse_task: INTERACTIONS.reverse,
};

// ---------------------------------------------------------------------------
// 4. ОБЯЗАТЕЛЬНЫЕ МЕХАНИКИ ОБЪЯСНЕНИЯ — ETALON v2 §3
// ---------------------------------------------------------------------------
export const MECHANICS = [
  { key: 'audio_staged_reveal', scope: 'every_exploration', ru: 'Поэтапный reveal под аудио',
    check: 'число стадий визуала = число сегментов аудио; финальная картинка не показывается до того, как о ней сказали' },
  { key: 'worked_examples', scope: 'min_1_per_lesson', ru: 'Примеры с решениями',
    check: '3 разобранных примера, минимум один граничный или нулевой случай под misconception урока' },
  { key: 'question_before_rule', scope: 'exactly_1_on_rule', ru: 'Вопрос до правила',
    check: 'сегменты правила стоят на on_event и молчат до ответа; подписи скрыты до верного ответа' },
  { key: 'predict_before_anim', scope: 'min_2_screens', ru: 'Предсказание до анимации',
    check: 'hook обязательно + минимум один другой экран; порядок «анимация → вопрос» запрещён' },
];

// ---------------------------------------------------------------------------
// 5. ВАРИАНТЫ ОТВЕТА — ETALON v2 §4
// ---------------------------------------------------------------------------
export const ANSWER_RULES = {
  optionsMin: 3,
  optionsMax: 4,
  wrongPerOption: true,        // каждый неверный вариант = misconception со своим разбором
  // Позиция верного ответа НЕ повторяется в соседних вопросах — требование
  // методиста 2026-08-03. Прежний shuffleArr перемешивал каждый вопрос
  // независимо и случайно, поэтому позиция могла повториться подряд.
  noRepeatCorrectPosition: true,
  // Фиксированная последовательность (а, с, b, d) ЗАПРЕЩЕНА: урок проходят
  // повторно, и такой порядок запоминается — ребёнок начнёт отвечать по
  // позиции, не читая. Поэтому случайно, но с запретом повтора.
  fixedSequenceForbidden: true,
  neutralPlaceholder: true,    // в поле ввода 0 или 0,0 — никогда правильный ответ
};

/**
 * Позиции верного ответа для серии вопросов: случайно, соседние не совпадают.
 * Порядок вариантов строится так, чтобы верный встал на out[i].
 * Подсказки hints переставляются ВМЕСТЕ с вариантами.
 */
export const correctPositions = (count, nOpts, rnd = Math.random) => {
  const out = [];
  let prev = -1;
  for (let i = 0; i < count; i += 1) {
    const pool = Array.from({ length: nOpts }, (_, k) => k).filter((p) => p !== prev);
    const p = pool[Math.floor(rnd() * pool.length)];
    out.push(p);
    prev = p;
  }
  return out;
};

/** Где позиция верного ответа повторилась подряд. */
export const findRepeatedCorrectPositions = (positions) => {
  const bad = [];
  for (let i = 1; i < (positions || []).length; i += 1) {
    if (positions[i] === positions[i - 1]) bad.push({ at: i, position: positions[i] });
  }
  return bad;
};

// ---------------------------------------------------------------------------
// 6. АУДИО — ETALON v2 §9
//
// «ekrandagi ko'rsatmadan KENGROQ» — аудио ШИРЕ экранной инструкции.
// Измеренная норма: триптих intro + on_correct + on_wrong на 132 экранах
// в 7 эталонных уроках 3 класса.
// ---------------------------------------------------------------------------
export const AUDIO_CONTRACT = {
  always: ['intro'],
  onInteractive: ['intro', 'on_correct', 'on_wrong'],
  wrongPerOption: true,
  // Три локали — решение методиста 2026-08-03 (ETALON v2 §9.1).
  // ВАЖНО: useT при отсутствии en молча отдаёт ru. Валидатор ОБЯЗАН ронять урок
  // при пропущенном en, иначе ребёнок читает русский вместо английского и никто
  // не узнает. Инфраструктура озвучки к en готова, контента — нет ни в одном уроке.
  locales: ['uz', 'ru', 'en'],
  localeVoice: { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' },
  triggers: ['on_mount', 'after_previous', 'on_event'],
  oneThoughtPerSegment: true,
  passableWhenMuted: true,
  voiceGender: 'f',
};

// ---------------------------------------------------------------------------
// 6.1. ПОРЯДОК ОБРАТНОЙ СВЯЗИ — ETALON v2 §6.1
// ---------------------------------------------------------------------------
export const FEEDBACK_FLOW = {
  // При верном ответе: подсветить → дать увидеть → медленно убрать варианты.
  correctHighlightMs: 1100,   // пауза, за которую ребёнок успевает увидеть верный вариант
  optionsFadeOutMs: 600,      // затем все варианты плавно исчезают
  optionsFadeEasing: 'ease',
  // При неверном: ничего не исчезает, кнопки снова активны.
  keepOptionsOnWrong: true,
  // Bit выходит и на верном, и на неверном (решение методиста 2026-08-03).
  // Осознанное отличие от правила 1 класса (personaj.md: только на неверном).
  bitOnCorrect: true,
  bitOnWrong: true,
  bitEnterAnim: 'lm-riseup',
  bitExitMs: 500,
  // Красный в состоянии ответа запрещён: неверный — янтарный.
  redForbiddenOnAnswer: true,
};

// ---------------------------------------------------------------------------
// 6.2. ЭСКАЛАЦИЯ ПОДСКАЗКИ — ETALON v2 §6.2
// Только для заданий с самостоятельным вводом числа.
// ---------------------------------------------------------------------------
export const HINT_ESCALATION = {
  appliesTo: NUMERIC_INPUT_INTERACTIONS,
  steps: [
    { attempt: 1, kind: 'concept',    ru: 'на какой признак смотреть' },
    { attempt: 2, kind: 'first_step', ru: 'назвать первый шаг решения' },
    { attempt: 3, kind: 'strong',     ru: 'разобранный первый шаг с числом; завершение оставлено ребёнку' },
  ],
  // Готовый ответ не даётся ни на каком шаге.
  neverRevealAnswer: true,
  // После подсказок балл не начисляется, но пройти дальше можно — застрять нельзя.
  scoreAfterHint: false,
  blocksProgress: false,
};

/** Нужна ли эскалация подсказки для этой механики. */
export const needsHintEscalation = (interaction) => NUMERIC_INPUT_INTERACTIONS.includes(interaction);

// ---------------------------------------------------------------------------
// 6.3. СЦЕНА-ОБРАМЛЕНИЕ — ETALON v2 §1.2
// ---------------------------------------------------------------------------
export const BOOKEND_SCENE = {
  required: true,
  screens: ['hook', 'summary'],   // одна и та же сцена в двух состояниях
  states: ['is-start', 'is-finished'],
  singleScenePerLesson: true,     // не две разных, иначе финал не читается как решённое начало
  toggledByFlag: true,            // состояние — один флаг, а не отдельный компонент
  mustBeExported: true,           // export function Grade3XxxEtalonScene — для переиспользования
  maxHeightPx: 240,
  radiusPx: 22,
  radiusMobilePx: 16,
};

// ---------------------------------------------------------------------------
// 6.4. АВТОСКРОЛЛ И АДАПТИВНОСТЬ — ETALON v2 §6.3
// ---------------------------------------------------------------------------
export const SCROLL_AND_LAYOUT = {
  autoscrollRequiredOnReveal: true,
  autoscrollDelayMs: [400, 600],
  autoscrollBlock: 'nearest',
  reducedMotionBehavior: 'auto',       // без плавности при prefers-reduced-motion
  rootPositioning: 'fixed; inset: 0',  // высота не считается в JS
  verticalLayout: 'flex + 100dvh',
  mobileZoomWidthPx: 390,
  isMobileBreakpointPx: 640,
  mediaQueryPx: 520,
  sizing: 'clamp()',
  navAndOptionsAlwaysVisible: true,
};

// ВАЖНО — почему над каждым правилом выписан состав символов.
// Первая версия файла содержала класс /[«»""'']/, где кавычки оказались обычными
// ASCII. Правило начало ловить апостроф в o'nlik, то есть помечало ошибкой каждую
// узбекскую строку. Глазами такая подмена неотличима, поэтому состав каждого класса
// продублирован в комментарии — при правке сверяй символы с комментарием.
// ASCII-апостроф ' РАЗРЕШЁН (нужен узбекскому) и ни в один класс не входит.
export const FORBIDDEN_IN_SPEECH = [
  // U+2014 —  U+2013 –
  { name: 'em/en dash', re: /[—–]/, why: 'TTS читает как паузу или молчит; напиши словами' },
  // « » “ ” „ ‟ ‘ ’ — без ASCII " и '
  { name: 'typographic quotes', re: /[«»“”„‟‘’]/, why: 'TTS произносит или спотыкается' },
  // ─ ━ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ — графика столбика, попадала в речь в Dars22
  { name: 'box drawing', re: /[─━│┌┐└┘├┤┬┴┼]/, why: 'графика столбика попала в речь' },
  // ✓ ✔ ✗ ✘ — только галочки и крестики-отметки
  { name: 'check/cross marks', re: /[✓✔✗✘]/, why: 'отметка вместо слова' },
  // = < > ≥ ≤ × ÷ ± — знак умножения × (U+00D7) здесь, а не среди отметок:
  // иначе сообщение об ошибке называет его «крестиком» и сбивает автора с толку.
  { name: 'math operators', re: /[=<>≥≤×÷±]/, why: 'напиши словами: teng / katta / kichik / ko\'paytirish' },
  // ASCII + и U+2212 − как отдельные знаки между словами
  { name: 'plus/minus as symbol', re: /\s\+\s|\s−\s/, why: "напиши словами: qo'shuv / minus" },
  // % $ €
  { name: 'percent/currency', re: /[%$€]/, why: 'напиши словами' },
  // □ △ ◇ ▭ ▦ ■ ● ∥ ⟂ °
  { name: 'geometry glyphs', re: /[□△◇▭▦■●∥⟂°]/, why: 'напиши словами' },
  { name: 'digit fraction a/b', re: /\d+\s*\/\s*\d+/, why: 'дроби только словами: bir ikkidan' },
  { name: 'colon before list', re: /:\s*$/, why: 'двоеточие перед перечислением ломает интонацию' },
];

// ---------------------------------------------------------------------------
// 7. ЯЗЫК — ETALON v2 §9, v1 §4
// ---------------------------------------------------------------------------
export const UZ_TEXT_RULES = [
  { name: 'modifier apostrophe U+02BB', re: /ʻ/, why: "только ASCII ': o'nlik" },
  { name: 'left single quote U+2018',   re: /‘/, why: "только ASCII ': o'nlik" },
  { name: 'right single quote U+2019',  re: /’/, why: "только ASCII ': o'nlik" },
  { name: 'cyrillic in uz',             re: /[Ѐ-ӿ]/, why: 'узбекский — латиница' },
];

// Регистр обращения по локалям. EN — нейтрально-дружелюбное you, без сленга (v2 §9.1).
export const REGISTER = { uz: 'siz', ru: 'ты', en: 'you (neutral-friendly)' };
export const CAST = ['Bit', "Ra'no", 'Anvar', 'Zuhra', 'Jasur'];

// Источник терминов — учебник СВОЕГО класса (решение методиста 2026-08-03, v2 §9.2).
// PDF лежат локально, в git не хранятся (см. src/books/BOOKS.md).
export const TERM_SOURCES = [
  'src/books/grade3/matematika_3_uzb.pdf',
  'src/books/grade3/matematika_3-daftar_uzb_2022.pdf',
  'src/books/grade3/matematika_3-metodika_uzb_2022.pdf',
  'src/books/grade3/matematika_3-metodika_rus_2022.pdf',
  'src/books/grade3/3 матем сжат.pdf',
];
// При расхождении с другим классом правее учебник 3 класса; расхождение
// фиксируется в 3sinf_metodologiya.md, а не решается на ходу.

/** Каких локалей не хватает в текстовом поле. Пропуск en — ОШИБКА, не предупреждение. */
export const missingLocales = (field) => {
  if (!field || typeof field !== 'object') return AUDIO_CONTRACT.locales.slice();
  return AUDIO_CONTRACT.locales.filter((l) => !field[l] || String(field[l]).trim() === '');
};

// ---------------------------------------------------------------------------
// 8. ДИЗАЙН — ETALON v2 §7
// ---------------------------------------------------------------------------
export const PALETTE = {
  bg: '#F6F4EF', paper: '#FFFFFF',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  accent: '#FF4F28', accentSoft: '#FFE8E1',
  success: '#1F7A4D', successSoft: '#E3F0E8',
  blue: '#019ACB', shadowBase: '58, 53, 48',
};

// Цветовой код разрядов — обязателен всюду, где виден разряд.
export const PLACE_COLORS = { hundreds: '#C0392B', tens: '#1F7A4D', ones: '#019ACB' };

export const LAYOUT = { maxWidth: 936, stickyVia: 'flex + 100dvh', sizing: 'clamp()' };
export const FONTS = ['Manrope', 'JetBrains Mono', 'Source Serif 4', 'Fraunces'];

// Точные значения кнопок и рамок — ETALON v2 §5.1, §5.2.
//
// ВАЖНО: это ЭФФЕКТИВНЫЕ значения, то есть результат склейки ДВУХ слоёв CSS.
// Dars01.jsx вставляет их так: <style>{STYLES}</style> затем
// <style>{GRADE3_ETALON_STYLES}</style> — второй перебивает первый, почти всё через
// !important. Первая редакция этого блока содержала значения только из STYLES,
// то есть из проигрывающего слоя: там плоские цвета, border: none и радиус 16px,
// а на экране видны градиенты, рамки 1px и радиус 22px. Исправлено.
export const RADII = { option: 14, frame: 22, card: 14, button: 12, pill: 99 };
export const BORDERS = {
  option: '1px solid rgba(167,166,162,.17)',
  frame: '1px solid rgba(1,154,203,.13)',
  accentLeft: '5px',   // цветная полоса слева у frame-tip / frame-success
  navTop: '1px',
};

export const BUTTON_SPEC = {
  option: {
    bg: 'linear-gradient(145deg, #FFFFFF 0%, #FCFBF8 100%)',
    border: '1px solid rgba(167,166,162,.17)', radius: 14,
    color: '#0E0E10', align: 'left', font: 'Manrope 500',
    shadow: '0 6px 16px -6px rgba(58,53,48,.14)',
    transition: 'transform .18s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease',
  },
  optionCorrect: { bg: 'linear-gradient(145deg,#F0F9F3,#DDF1E5)', borderColor: 'rgba(31,122,77,.28)', color: '#1F7A4D' },
  // Неверный — ЯНТАРНЫЙ, не красный. Правило «тон мягкий» реализовано цветом.
  optionPickedWrong: { bg: 'linear-gradient(145deg,#FFF9E8,#FBF0C8)', borderColor: 'rgba(216,169,58,.3)', color: '#C99A2E' },
  btnWhiteAccent: { bg: '#FFFFFF', color: '#FF4F28', font: 'Manrope 700', fontSize: 'clamp(16px, 2.7vw, 19px)', padding: 'clamp(11px,2.4vw,15px) clamp(24px,5.5vw,36px)', minHeight: 'clamp(48px, 8.5vw, 56px)', radius: 12 },
  btnGhost: { bg: 'transparent', color: '#0E0E10', font: 'Manrope 600', radius: 12, minHeight: 46 },
  btnDark: { bg: '#0E0E10', color: '#F6F4EF', radius: 12, shadow: '0 6px 18px -4px rgba(58,53,48,.32)' },
  disabled: { opacity: 0.42, cursor: 'not-allowed' },
  mcOption: { minHeight: 'clamp(46px, 6.5vw, 56px)', padding: 'clamp(10px,1.6vw,13px)', fontSize: 'clamp(15px, 2.2vw, 19px)' },
  hookOption: { minHeight: 'clamp(48px, 7vw, 58px)', fontSize: 'clamp(13px, 1.7vw, 15px)' },
};

export const FRAME_SPEC = {
  frame: {
    radius: 22, border: '1px solid rgba(1,154,203,.13)',
    bg: 'linear-gradient(145deg, rgba(255,255,255,.98), rgba(249,251,251,.96))',
    shadow: '0 22px 48px -32px rgba(23,46,69,.42), inset 0 1px rgba(255,255,255,.9)',
    padding: 'clamp(20px, 4.2vw, 24px)',
  },
  frameTip: { bg: 'linear-gradient(135deg,#FFF9E8,#F9EFCB)', border: '1px solid rgba(216,169,58,.22)', borderLeft: '5px solid #D8A93A', shadow: '0 14px 30px -24px rgba(180,138,30,.5)' },
  frameSuccess: { bg: 'linear-gradient(135deg,#E8F6ED,#DCEFE3)', border: '1px solid rgba(31,122,77,.2)', borderLeft: '5px solid #1F7A4D', shadow: '0 14px 30px -24px rgba(31,122,77,.55)' },
  frameSoft: { bg: '#FFE8E1', borderLeft: '4px solid #FF4F28', radius: 12 },
  ruleCard: { bg: '#FFF3E9', radius: 16, padding: 'clamp(12px,2.4vw,18px)', shadow: '0 6px 20px -10px rgba(255,79,40,.4)' },
  factCard: { bg: '#FFF3EC', borderLeft: '4px solid #FF4F28', radius: 14 },
  infoNote: { bg: '#EAF6FB', radius: 14, shadow: 'inset 3px 0 0 #019ACB' },
  questionAccent: { bg: '#FFF3E9', color: '#C0392B', border: '1.5px solid rgba(255,79,40,.4)', radius: 14, font: 'Fraunces 700 clamp(16px,2.6vw,20px)' },
  // Панели полупрозрачные с размытием; навигация учитывает жестовую полосу телефона.
  stageHeader: { bg: 'rgba(248,247,243,.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(167,166,162,.12)' },
  stageNav: { bg: 'rgba(248,247,243,.9)', backdropFilter: 'blur(14px)', shadow: '0 -12px 30px -28px rgba(23,46,69,.5)', paddingBottom: 'max(clamp(11px,2vw,14px), env(safe-area-inset-bottom))' },
  progressTrack: { height: 7, radius: 99, bg: 'rgba(167,166,162,.22)', shadow: 'inset 0 1px 2px rgba(58,53,48,.08)' },
  progressBar: { bg: 'linear-gradient(90deg,#FF6A3D,#FF4F28)', shadow: '0 0 10px rgba(255,79,40,.5)', transition: 'width .5s cubic-bezier(.4,0,.2,1)' },
  screenTypeBadge: { radius: 99, border: '1px solid rgba(1,154,203,.15)', bg: 'rgba(234,246,251,.76)', color: '#017BA3', font: '800 10px Manrope', minHeight: 28 },
  title: { font: 'Source Serif 4 600', lineHeight: 1.1, letterSpacing: '-.005em', opsz: 60 },
  hSub: { fontSize: 'clamp(20px, 3.2vw, 23px)' },
};

// ---------------------------------------------------------------------------
// 8.1. ХРОНОМЕТРАЖ — ETALON v2 §1.2. Решение методиста: урок 15 минут.
// ---------------------------------------------------------------------------
// Числа ИЗМЕРЕНЫ по 19 эталонным урокам 3 класса, а не выведены из арифметики.
// Первая редакция содержала расчётные wordsPerSegment: [16, 30] — измерение дало
// медиану 12 слов, то есть реальные сегменты вдвое короче расчётных. Практика
// эталона правее расчёта, поэтому здесь измеренные значения.
// Секунды на сегмент НЕ задаются: скорость TTS в проекте не измерена, гадать нельзя.
export const TIMING = {
  lessonSeconds: 900,                 // 15 минут — решение методиста
  perScreenSeconds: { hook: 40, exploration: 50, rule: 50, test: 66, case: 60, summary: 50 },
  // измерено: среднее 641 слово на урок, у Dars01 923
  wordsPerLessonRu: [600, 950],
  // измерено: среднее 45, у Dars01 62
  wordsPerScreenRu: [40, 65],
  // измерено: среднее 3.8, у Dars01 4.5
  segmentsPerScreen: [3, 5],
  // измерено: медиана 11, 75% <= 14, 90% <= 17, 95% <= 20, длиннее 30 только 2%
  wordsPerSegment: [8, 18],
  wordsPerSegmentHardCap: 25,
};

/** Сегменты, длина которых выходит за измеренную норму. Одна мысль — один сегмент. */
export const longSegments = (texts) =>
  (texts || [])
    .map((t, i) => ({ at: i, words: String(t || '').split(/\s+/).filter(Boolean).length }))
    .filter((x) => x.words > TIMING.wordsPerSegment[1]);

/** Расчётная длительность урока по составу экранов — для проверки «влезает в 15 минут». */
export const estimateLessonSeconds = (screens) =>
  (screens || []).reduce((sum, s) => sum + (TIMING.perScreenSeconds[s?.type] || 50), 0);

// ---------------------------------------------------------------------------
// 9. ПРАВИЛА УРОВНЯ УРОКА — ETALON v2 §1, §12
// ---------------------------------------------------------------------------
export const LESSON_RULES = {
  screensMin: 15,
  screensMax: 16,
  lessonSeconds: TIMING.lessonSeconds,
  requireAllRequiredRoles: true,
  interactionKindsMin: 3,
  activeScreensShareMin: 0.6,
  freeNavAllowed: false,
  finalDiagnosticMustUseNewNumbers: true,
  numbersWithinProgramScope: true,   // числа в пределах текущего и предыдущих уроков
  passThreshold: 0.6,                // 60% экранов scope:'final'
  scoreOnFirstTryOnly: true,         // балл только за ответ с первой попытки
  roundsPerTest: 3,                  // каждый test = 3 раунда, веди-до-верного
};

// ---------------------------------------------------------------------------
// 10. ПРЕДИКАТЫ ДЛЯ ВАЛИДАТОРА
// ---------------------------------------------------------------------------

/** Нормализация для сравнения: только слова в нижнем регистре. */
export const speechTokens = (value) =>
  String(value || '')
    .toLowerCase()
    .split(/[^0-9a-zà-ÿЀ-ӿ']+/)
    .filter((t) => t.length > 1);

/**
 * ГЛАВНАЯ ПРОВЕРКА СХЕМЫ.
 * true, если audio.intro — пересказ экранного текста, а не отдельная реплика.
 * Именно эту ошибку допустил предыдущий каркас: он собирал озвучку как
 * `title + text + visual + ask`, из-за чего голос стал дублем текста.
 */
export const isAudioDerivedFromScreen = (audioText, screenTexts) => {
  const audio = speechTokens(audioText);
  if (audio.length === 0) return false;
  const screen = new Set(speechTokens(Array.isArray(screenTexts) ? screenTexts.join(' ') : screenTexts));
  if (screen.size === 0) return false;
  const shared = audio.filter((t) => screen.has(t)).length;
  return shared / audio.length >= 0.85 && audio.length <= screen.size * 1.25;
};

export const findForbiddenInSpeech = (text) =>
  FORBIDDEN_IN_SPEECH.filter(({ re }) => re.test(String(text || ''))).map(({ name, why }) => ({ name, why }));

export const findUzTextIssues = (text) =>
  UZ_TEXT_RULES.filter(({ re }) => re.test(String(text || ''))).map(({ name, why }) => ({ name, why }));

/** Какие ОБЯЗАТЕЛЬНЫЕ роли не покрыты уроком. */
export const missingRoles = (screens) => {
  const covered = new Set((screens || []).flatMap(rolesOf));
  return REQUIRED_ROLE_KEYS.filter((k) => !covered.has(k));
};

export const interactionKinds = (screens) =>
  [...new Set((screens || []).map((s) => s?.interaction).filter(Boolean))];

export const activeScreensShare = (screens) => {
  const list = screens || [];
  if (list.length === 0) return 0;
  return list.filter(isInteractiveScreen).length / list.length;
};

/** Экраны, где число вариантов вне допустимого диапазона. */
export const badOptionCounts = (screens) =>
  (screens || [])
    .map((s, i) => ({ at: i, n: (s?.options || []).length }))
    .filter((x) => x.n > 0 && (x.n < ANSWER_RULES.optionsMin || x.n > ANSWER_RULES.optionsMax));

/** Роль требует механику из своей группы, а стоит другая. */
export const roleInteractionMismatch = (screens) =>
  (screens || [])
    .map((s, i) => {
      const allowed = rolesOf(s).flatMap((r) => ROLE_INTERACTION_HINT[r] || []);
      if (allowed.length === 0 || !s?.interaction) return null;
      return allowed.includes(s.interaction) ? null : { at: i, role: rolesOf(s), interaction: s.interaction, allowed };
    })
    .filter(Boolean);

// ---------------------------------------------------------------------------
// 11. ФОРМА ЭКРАНА — справочно для авторов контента
//
// {
//   type: 'test',                     // одно из SCREEN_TYPES
//   role: 'error_find',               // одна из ROLE_KEYS или массив
//   interaction: 'error_spot',        // одно из INTERACTION_KEYS
//   eyebrow: { uz, ru },
//   lead:    { uz, ru },
//   visual:  { type: 'column', a: 24, b: 13 },   // СТРУКТУРА, не строка для показа.
//                                                 // Строка '24\n× 13\n────' попадает
//                                                 // и на экран, и в озвучку — запрещено.
//   scene:   'ColumnCalc',            // необязательно: сцена из ../scenes/DarsNN/
//   rounds: [                         // test = 3 раунда, веди-до-верного
//     { options: [{uz,ru}, …], correct: 2,
//       audio: { intro:{uz,ru}, on_correct:{uz,ru}, on_wrong:[{uz,ru}, …] } },
//   ],
// }
// ---------------------------------------------------------------------------
