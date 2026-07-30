import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import {
  createGrade3RunSeed,
  restoreGrade3LessonIndex,
  restoreGrade3LessonLanguage,
  seededIndexOrder,
} from '../src/components/grade3/grade3MethodUtils.js'
import { toGrade3SpeechText } from '../src/components/grade3/grade3Speech.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []

function expect(condition, message) {
  if (!condition) failures.push(message)
}

function expectEqual(actual, expected, message) {
  if (actual !== expected) failures.push(`${message}: expected ${expected}, received ${actual}`)
}

const stableOrder = seededIndexOrder(8, 'num-3-22:screen-4')
expectEqual(
  JSON.stringify(stableOrder),
  JSON.stringify(seededIndexOrder(8, 'num-3-22:screen-4')),
  'The same screen seed must remain stable',
)
const variedOrders = new Set(
  Array.from(
    { length: 8 },
    (_, index) => JSON.stringify(seededIndexOrder(8, `num-3-22:screen-${index}`)),
  ),
)
expect(variedOrders.size > 1, 'String screen seeds collapsed to one option order')
expectEqual(restoreGrade3LessonIndex(7, 15), 7, 'Valid saved lesson screen')
for (const invalidIndex of [-1, 15, 1.5, '7', null, undefined]) {
  expectEqual(
    restoreGrade3LessonIndex(invalidIndex, 15),
    0,
    `Invalid saved lesson screen ${String(invalidIndex)}`,
  )
}
expectEqual(restoreGrade3LessonLanguage('ru'), 'ru', 'Saved Russian language')
expectEqual(restoreGrade3LessonLanguage('uz'), 'uz', 'Saved Uzbek language')
expectEqual(restoreGrade3LessonLanguage('en'), 'uz', 'Unsupported saved language fallback')
const runSeeds = new Set(Array.from({ length: 16 }, createGrade3RunSeed))
expectEqual(runSeeds.size, 16, 'A lesson reload must receive a fresh run seed')
const currentRunSeed = [...runSeeds][0]
expectEqual(
  JSON.stringify(seededIndexOrder(8, `${currentRunSeed}:num-3-22:screen-4`)),
  JSON.stringify(seededIndexOrder(8, `${currentRunSeed}:num-3-22:screen-4`)),
  'The option order must remain stable inside one lesson opening',
)

const spoken = toGrade3SpeechText('12 : 3 = 4; 3/4 < 1; 2 кг', 'ru')
expect(!/[=</]/.test(spoken), 'Speech text still contains raw mathematical symbols')
expect(spoken.includes('килограммов'), 'Speech text did not verbalize a Cyrillic unit')
expect(
  spoken.includes('числителем 3') &&
  spoken.includes('знаменателем 4') &&
  !spoken.includes('3 разделить на 4'),
  'A common fraction was pronounced as division',
)
expect(
  toGrade3SpeechText('x + 7 = 12; 12 − 7 = 5; 12 - 7 = 5', 'ru').includes('икс плюс 7 равно 12'),
  'Equation speech did not verbalize the variable or addition',
)
expect(
  !toGrade3SpeechText('12 − 7 = 5; 12 - 7 = 5', 'ru').includes('-'),
  'Subtraction speech left a raw minus or spaced ASCII hyphen',
)
const spokenTimeAndDivision = toGrade3SpeechText('В 14:20; 56 : 8 = 7', 'ru')
expect(
  spokenTimeAndDivision.includes('14 часов 20 минут') &&
  spokenTimeAndDivision.includes('56 разделить на 8') &&
  !spokenTimeAndDivision.includes('14 разделить на 20'),
  'Speech confused a clock time with mathematical division',
)

const server = await createServer({
  root: repoRoot,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const {
    inputAnswerVariants,
    isCorrectAnswer,
    normalizePracticeAnswer,
    sceneKind,
    seededOrder,
  } = await server.ssrLoadModule('/src/components/grade3/practice/QuestionFactory.jsx')
  const { GEOMETRY_LESSONS } = await server.ssrLoadModule(
    '/src/components/grade3/Grade3GeometryBlock.jsx',
  )
  const { FINAL_LESSONS } = await server.ssrLoadModule(
    '/src/components/grade3/Grade3FinalBlock.jsx',
  )
  const { GRADE3_THEORY_DERIVED_BANKS } = await server.ssrLoadModule(
    '/src/components/grade3/practice/theoryDerivedBanks.js',
  )
  const { restorePracticeIndex } = await server.ssrLoadModule(
    '/src/components/grade3/practice/grade3PracticeUtils.js',
  )

  expectEqual(normalizePracticeAnswer('1000'), normalizePracticeAnswer('1 000'), 'Spaced thousands')
  expectEqual(normalizePracticeAnswer('1000'), normalizePracticeAnswer('1.000'), 'Dotted thousands')
  expect(
    isCorrectAnswer({ type: 'input', correct: '5' }, 'x = 5'),
    'Equation answer x=5 was rejected',
  )
  expect(
    isCorrectAnswer({ type: 'input', correct: '5' }, 'х = 5'),
    'Equation answer х=5 was rejected',
  )
  expect(
    isCorrectAnswer({ type: 'input', correct: '1 kg' }, '1 кг'),
    'Equivalent Cyrillic unit was rejected',
  )
  expect(
    !isCorrectAnswer({ type: 'input', correct: '1 kg' }, '1 g'),
    'A mathematically different unit was accepted',
  )
  expect(
    inputAnswerVariants('1 000 kg').length >= 2,
    'Numeric answer variant without a displayed unit is missing',
  )
  expectEqual(restorePracticeIndex(7, 10), 7, 'Valid saved practice item')
  for (const invalidIndex of [-1, 10, 1.5, '7', null, undefined]) {
    expectEqual(
      restorePracticeIndex(invalidIndex, 10),
      0,
      `Invalid saved practice item ${String(invalidIndex)}`,
    )
  }
  expectEqual(
    sceneKind(
      { type: 'choice', tag: 'calendar-date' },
      { setup: 'Время и календарь', ask: 'Какая дата?' },
    ),
    'calendar',
    'Calendar scene was intercepted by the generic time branch',
  )
  expect(
    JSON.stringify(seededOrder(5, 'attempt-1')) !== JSON.stringify(seededOrder(5, 'attempt-2')),
    'Two practice attempts received the same predictable order',
  )
  for (let length = 2; length <= 10; length += 1) {
    const firstAttempt = JSON.stringify(seededOrder(length, 1000 + length))
    const secondAttempt = JSON.stringify(seededOrder(length, 1001 + length))
    expect(
      firstAttempt !== secondAttempt,
      `Adjacent numeric practice seeds produced the same order for ${length} options`,
    )
  }

  for (const [lessonNumber, lesson] of Object.entries({
    ...GEOMETRY_LESSONS,
    ...FINAL_LESSONS,
  })) {
    expect(
      Array.isArray(lesson.checks) && lesson.checks.length === 15,
      `Theory lesson ${lessonNumber} must contain 15 check screens`,
    )
    lesson.checks?.forEach((check, index) => {
      expect(
        Number.isInteger(check.correct) &&
        check.correct >= 0 &&
        check.correct < check.options.length,
        `Theory lesson ${lessonNumber}, check ${index + 1} has an invalid correct index`,
      )
      expect(
        check.options.length >= 2 &&
        new Set(check.options.map((option) => JSON.stringify(option))).size === check.options.length,
        `Theory lesson ${lessonNumber}, check ${index + 1} has duplicate options`,
      )
    })
  }

  for (let lessonNumber = 20; lessonNumber <= 51; lessonNumber += 1) {
    const bank = GRADE3_THEORY_DERIVED_BANKS[lessonNumber]
    expect(
      Array.isArray(bank?.items) && bank.items.length === 10,
      `Practice lesson ${lessonNumber} must contain 10 derived questions`,
    )
    expect(
      new Set(bank?.items?.map((item) => item.tag)).size === 10,
      `Practice lesson ${lessonNumber} has duplicate question tags`,
    )
  }
} finally {
  await server.close()
}

if (failures.length) {
  console.error('Grade-3 logic validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Grade-3 logic validation passed: speech, seeds, input equivalence, units and calendar.')
