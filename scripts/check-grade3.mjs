import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { toGrade3SpeechText } from '../src/components/grade3/grade3Speech.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const grade3Root = path.join(repoRoot, 'src', 'components', 'grade3')
const practiceRoot = path.join(grade3Root, 'practice')
const lessonRegistryPath = path.join(repoRoot, 'src', 'lessons', 'grade3.js')
const sourceRegistryPath = path.join(practiceRoot, 'sourceRegistry.js')
const questionFactoryPath = path.join(practiceRoot, 'QuestionFactory.jsx')
const newBanksPath = path.join(practiceRoot, 'newBanks.js')
const reviewModePath = path.join(grade3Root, 'grade3ReviewMode.js')
const expectedNumbers = Array.from({ length: 51 }, (_, index) => String(index + 1).padStart(2, '0'))
const failures = []

function expect(condition, message) {
  if (!condition) failures.push(message)
}

for (const number of expectedNumbers) {
  expect(
    fs.existsSync(path.join(grade3Root, `Dars${number}.jsx`)),
    `Missing theory module Dars${number}.jsx`,
  )
  expect(
    fs.existsSync(path.join(practiceRoot, `dars${number}`, `Dars${number}Practice.jsx`)),
    `Missing practice module dars${number}/Dars${number}Practice.jsx`,
  )
  const practiceQuestionFiles = fs
    .readdirSync(path.join(practiceRoot, `dars${number}`))
    .filter((name) => new RegExp(`^D${number}_\\d{2}\\.jsx$`).test(name))
    .sort()
  const expectedQuestionFiles = Array.from(
    { length: 10 },
    (_, index) => `D${number}_${String(index + 1).padStart(2, '0')}.jsx`,
  )
  expect(
    JSON.stringify(practiceQuestionFiles) === JSON.stringify(expectedQuestionFiles),
    `Practice dars${number} must contain exactly D${number}_01.jsx … D${number}_10.jsx`,
  )
  for (const fileName of practiceQuestionFiles) {
    const questionSource = fs.readFileSync(path.join(practiceRoot, `dars${number}`, fileName), 'utf8')
    if (questionSource.includes('permFromSeed')) {
      expect(
        questionSource.includes('shuffleSeed') &&
        !/const D\d{2}_ORDER\s*=\s*permFromSeed/.test(questionSource),
        `${fileName} keeps one predictable option order for every attempt`,
      )
    }
  }
}

const oldTheorySources = expectedNumbers.slice(0, 18).map((number) => ({
  number,
  source: fs.readFileSync(path.join(grade3Root, `Dars${number}.jsx`), 'utf8'),
}))

for (const { number, source } of oldTheorySources) {
  expect(
    source.includes("from './grade3ReviewMode.js'") &&
    source.includes("from './grade3Storage.js'") &&
    source.includes("from './grade3Speech.js'"),
    `Dars${number} is not connected to the shared review/storage/speech infrastructure`,
  )
  expect(!source.includes('scrollIntoView('), `Dars${number} still performs automatic scrolling`)
  expect(
    !/\b(?:const|let|var)\s+FREE_NAV\b/.test(source),
    `Dars${number} still declares a local FREE_NAV switch`,
  )
  expect(
    !/\.tw-collapsed\s*\{[^}]*max-height\s*:\s*0/si.test(source),
    `Dars${number} can collapse its task wrapper to zero height`,
  )
  expect(
    !/\.feedback-block\s*\{[^}]*max-height\s*:\s*0/si.test(source),
    `Dars${number} still hides feedback through max-height: 0`,
  )
  expect(
    !/if\s*\(\s*i\s*!==\s*[01]\s*\)\s*e\.pushOneOff\(c\.audio\.on_correct/.test(source),
    `Dars${number} still plays the correct-answer audio after a wrong Screen0 choice`,
  )
  expect(
    !/lang\s*===\s*'ru'\s*\?\s*'Верный ответ'/.test(source),
    `Dars${number} still renders the explicit Screen0 answer after a wrong choice`,
  )
  expect(
    !/useAdvanceGate\(picked\s*!==\s*null,\s*audio\)/.test(source),
    `Dars${number} still unlocks Screen0 navigation after an incorrect choice`,
  )
}

for (const number of expectedNumbers.slice(18)) {
  const source = fs.readFileSync(path.join(grade3Root, `Dars${number}.jsx`), 'utf8')
  expect(
    source.includes('runtimeProps'),
    `Dars${number} drops the runtime TTS configuration before the shared lesson shell`,
  )
}

const lessonRegistry = fs.readFileSync(lessonRegistryPath, 'utf8')
const theoryBlock = lessonRegistry.slice(
  lessonRegistry.indexOf('export const grade3Nazariy'),
  lessonRegistry.indexOf('// 3-sinf AMALIY'),
)
const theorySlugs = [...theoryBlock.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])

expect(theorySlugs.length === 51, `Expected 51 theory routes, found ${theorySlugs.length}`)
expect(new Set(theorySlugs).size === 51, 'Theory route slugs are not unique')
expect(
  !lessonRegistry.includes('Component: lazy('),
  'Grade-3 registry contains an unsafe lazy() component without a load fallback',
)
expect(
  lessonRegistry.includes('class Grade3RenderBoundary extends Component') &&
  lessonRegistry.includes('getDerivedStateFromError') &&
  /createElement\(\s*Grade3RenderBoundary/.test(lessonRegistry),
  'Grade-3 routes are missing a render-error boundary',
)

const sourceRegistry = fs.readFileSync(sourceRegistryPath, 'utf8')
const questionFactory = fs.readFileSync(questionFactoryPath, 'utf8')
const newBanks = fs.readFileSync(newBanksPath, 'utf8')
const sourceKeys = [...sourceRegistry.matchAll(/^\s{2}(\d+):\s*source\(/gm)].map((match) => Number(match[1]))
const missingSourceKeys = expectedNumbers
  .map(Number)
  .filter((number) => !sourceKeys.includes(number))
const duplicateSourceKeys = sourceKeys.filter((number, index) => sourceKeys.indexOf(number) !== index)

expect(sourceKeys.length === 51, `Expected 51 source records, found ${sourceKeys.length}`)
expect(missingSourceKeys.length === 0, `Missing source records: ${missingSourceKeys.join(', ')}`)
expect(duplicateSourceKeys.length === 0, `Duplicate source records: ${duplicateSourceKeys.join(', ')}`)
expect(
  !/result\s*\?\s*text\.correct\s*:\s*text\.wrong/.test(questionFactory) &&
  !/:\s*text\.wrong\b/.test(questionFactory),
  'Practice factory still reveals the authored solution hint after a wrong answer',
)
expect(
  /function Order\([^)]*\boptionOrder\b/.test(questionFactory) &&
  /<Order\b[^>]*\boptionOrder=\{optionOrder\}/.test(questionFactory),
  'Practice order tasks are not connected to per-attempt option shuffling',
)
for (let lessonNumber = 10; lessonNumber <= 19; lessonNumber += 1) {
  const bankStart = newBanks.indexOf(`export const DARS${lessonNumber}_BANK`)
  const nextBankStart = newBanks.indexOf(`export const DARS${lessonNumber + 1}_BANK`)
  const bankBlock = newBanks.slice(
    bankStart,
    nextBankStart === -1 ? undefined : nextBankStart,
  )
  expect(
    /\bscene:\s*'[^']+'/.test(bankBlock),
    `Practice lesson ${lessonNumber} still relies on wording regex for its visual scene`,
  )
}

const reviewModeSource = fs.readFileSync(reviewModePath, 'utf8')
const reviewModeEnabled = /GRADE3_REVIEW_MODE\s*=\s*true/.test(reviewModeSource)
const spokenMath = toGrade3SpeechText('12 : 3 = 4; 3/4 < 1; 2 кг', 'ru')

expect(!/[=</]/.test(spokenMath), 'Speech normalization left raw math symbols in the phrase')
expect(
  spokenMath.includes('разделить на') &&
  spokenMath.includes('равно') &&
  spokenMath.includes('килограммов'),
  'Speech normalization did not verbalize operations or units',
)

if (failures.length) {
  console.error('Grade-3 validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Grade-3 registry validation passed: 51 theory + 51 practice banks (510 questions), 51 source records.')
console.log(`Grade-3 review mode: ${reviewModeEnabled ? 'ON (temporary)' : 'OFF'}.`)
