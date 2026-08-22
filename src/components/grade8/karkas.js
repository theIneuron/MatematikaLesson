// ============================================================================
// 8 КЛАСС — КАРКАС УРОКА. То, что одинаково во ВСЕХ уроках класса.
//
// Решение методиста 2026-08-21: образец класса — урок 1, и урок отличается от
// него не больше чем на десять процентов. Значит композиция экранов больше не
// подбирается под тему: она одна на класс, а тема меняет математику и текст.
// Отсюда этот файл.
//
// ЧТО ЗДЕСЬ: пятнадцать позиций (роль, прибор, вид), сборка массива экранов и
// подписи интерфейса, которые в каждом уроке были одинаковыми.
// ЧЕГО ЗДЕСЬ НЕТ: математики, заблуждений, сцен, озвучки. Всё это — урок.
//
// ПОЧЕМУ ЧИСТЫЙ JS, БЕЗ JSX И БЕЗ ИМПОРТОВ. `check-grade8.mjs` исполняет
// данные урока в песочнице `node:vm` и вырезает импорты: если каркас
// подключить обычным импортом, приёмка перестанет видеть роли и приборы и
// начнёт молчать вместо проверки. Поэтому файл импортируется САМОЙ приёмкой и
// кладётся в песочницу — тогда она видит настоящие позиции.
// ============================================================================

// Трёхъязычная строка. Это ровно то, что делает `L` из ядра, но без импорта:
// каркас обязан оставаться исполнимым в node.
export const T3 = (uz, ru, en) => ({ uz, ru, en })

// ============================================================
// ОБСТАНОВКА УРОКА 1. Пятнадцать позиций в порядке `ROLE_ORDER`.
// Менять этот список — значит менять образец класса, то есть решение
// методиста. Отдельный урок вместо смены списка ставит МЕХАНИКУ БЛОКА на
// одну позицию (см. `mechanic` ниже).
// ============================================================
export const ETALON = [
  { role: 'hook', tool: 'pick' },
  { role: 'support', tool: 'pick', kind: 'records' },
  { role: 'explain', tool: 'steppers', kind: 'dial' },
  { role: 'explain', tool: 'pick', kind: 'place' },
  { role: 'explain', tool: 'movechain', kind: 'move' },
  { role: 'explain', tool: 'twoways', kind: 'ways' },
  { role: 'explain', tool: 'parts', kind: 'roles' },
  { role: 'rule', tool: 'rulebuild' },
  { role: 'practice', tool: 'drill', kind: 'drill' },
  { role: 'practice', tool: 'drill', kind: 'guided' },
  { role: 'practice', tool: 'drill', kind: 'solo' },
  { role: 'practice', tool: 'drill', kind: 'audit' },
  { role: 'transfer', tool: 'fill' },
  { role: 'blitz', tool: 'blitz' },
  { role: 'summary', tool: 'takeaway' },
]

// ============================================================
// СБОРКА ЭКРАНОВ.
//   screens  — пятнадцать объектов данных урока (S1..S15);
//   tags     — коды заблуждений по позициям (обязательны на 3–13);
//   mechanic — механика блока: { at, tool, kind }, где `at` это НОМЕР ЭКРАНА
//              с единицы, как его называет методист;
//   hook, final — сцены урока.
//
// Механика блока разрешена НА ОДНОМ экране: пятнадцатая часть это шесть
// процентов, две — тринадцать, и правило десяти процентов уже нарушено.
// Поэтому `mechanic` — один объект, а не список.
// ============================================================
export function buildScreens({ screens, tags, mechanic, hook, final }) {
  const list = screens || []
  return ETALON.map((slot, i) => {
    const swap = mechanic && mechanic.at === i + 1 ? mechanic : null
    const kind = swap ? swap.kind : slot.kind
    const out = { role: slot.role, tool: swap ? swap.tool : slot.tool }
    if (kind) out.kind = kind
    if (tags && tags[i]) out.tag = tags[i]
    if (i === 0 && hook) out.scene = hook
    if (i === ETALON.length - 1 && final) out.scene = final
    return Object.assign(out, list[i] || {})
  })
}

// ============================================================
// ПОДПИСИ ИНТЕРФЕЙСА. Они не про тему урока, а про устройство приборов, и в
// каждом уроке были одни и те же. Тема их не меняет — значит им место здесь.
// ============================================================
export const UI = {
  // «Показ, потом сам» у прибора заполнения записи
  showLabel: T3('Qarang — misolda ko\'rsataman', 'Смотри — покажу на примере', 'Watch: I will show you on an example'),
  againLabel: T3('Yana bir bor', 'Ещё раз', 'Again'),
  selfLabel: T3("Endi o'zim", 'Теперь я сам', 'Now myself'),
  repeatLabel: T3('Qaytarish', 'Повторить', 'Repeat'),
  // Блиц
  blitzLead: T3('Har savolga bitta javob', 'На каждый вопрос один ответ', 'One answer to each question'),
  scoreLabel: T3('birinchi urinishdan', 'с первой попытки', 'on the first try'),
  taskLabel: T3('Topshiriq', 'Задание', 'Task'),
  questionLabel: T3('Savol', 'Вопрос', 'Question'),
  builtLabel: T3("yig'ildi", 'собрано', 'assembled'),
  // Счётчики и цели
  goalLabel: T3('Maqsad', 'Цель', 'Target'),
  // Правило
  lockedLabel: T3(
    "Qoida to'g'ri yig'ilgandan keyin ochiladi",
    'Правило откроется после верной сборки',
    'The rule opens once assembled correctly',
  ),
  ruleTitle: T3('QOIDA', 'ПРАВИЛО', 'RULE'),
  // Общие шапки экранов
  practiceEyebrow: T3('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  trapEyebrow: T3('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  summaryEyebrow: T3('YAKUN', 'ИТОГ', 'SUMMARY'),
  blitzEyebrow: T3('BLITS', 'БЛИЦ', 'BLITZ'),
  ruleEyebrow: T3('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  supportEyebrow: T3('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  // Обещание на хуке
  hookLead: T3(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  hookAfter: T3(
    'Taxmin qayd etildi. Uni dars davomida tekshiramiz.',
    'Прогноз записан. Проверим его по ходу урока.',
    'The prediction is recorded. We will check it during the lesson.',
  ),
  // Проверка своим числом
  proofDone: T3('son bilan tekshirildi', 'проверено числом', 'checked with a number'),
}
