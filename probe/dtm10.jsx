// REJIM DTM STENDI (10-sinf, B8, PODXOD_10SINF.md §11).
//
// NEGA STEND. Rejim -- QOBIQ, va uni kodga qarab tasdiqlab bo'lmaydi: soat
// javobdan keyin to'xtadimi, razbor ochilib ketmadimi, manzil ko'rinadimi,
// xarita telefonda satrga sig'dimi. Bularning hammasi kadrda ko'rinadi.
//
// MA'LUMOT BU YERDA YOLG'ON: topshiriqlar rejimni ko'rsatish uchun, dars
// uchun emas. Haqiqiy topshiriqlar 55-darsda bo'ladi, va u DTM gvarditsiyasini
// kutadi.
//
//   npx vite --port 5299 --strictPort
//   http://localhost:5299/probe/dtm10.html
import React from 'react'
import { createRoot } from 'react-dom/client'
import { L } from '../src/components/grade10/core.jsx'
import {
  A,
  DtmBody,
  DtmClock,
  DtmMapBody,
  Screen,
  makeLesson,
} from '../src/components/grade10/screens.jsx'

const BLOCKS = [
  { id: 'B1', label: L('Trigonometrik funksiyalar', 'Тригонометрические функции', 'Trigonometric functions') },
  { id: 'B2', label: L('Trigonometrik tenglamalar', 'Тригонометрические уравнения', 'Trigonometric equations') },
  { id: 'B5', label: L("Ko'rsatkichli va logarifmik", 'Показательные и логарифмические', 'Exponential and logarithmic') },
  { id: 'B6', label: L('Fazoda chiziq va tekislik', 'Прямые и плоскости в пространстве', 'Lines and planes in space') },
  { id: 'B7', label: L("Ko'pyoqlar", 'Многогранники', 'Polyhedra') },
]

// O'n to'rt topshiriq: har blokdan bir nechta, ya'ni xaritada satrlar to'ladi.
const TASK = (i) => {
  const b = BLOCKS[i % BLOCKS.length]
  const right = (i % 4) + 1
  return {
    role: 'drill',
    tag: 'check',
    block: b.id,
    eyebrow: L('DTM', 'ДТМ', 'DTM'),
    title: L('Topshiriq ' + (i + 1), 'Задание ' + (i + 1), 'Task ' + (i + 1)),
    task: L(
      "Qiymatni toping va javobni tanlang.",
      'Найди значение и выбери ответ.',
      'Find the value and choose the answer.',
    ),
    expr: 'x = ' + (i + 1) + ' + ' + right,
    probe: {
      question: L(
        "Qiymatni toping va javobni tanlang.",
        'Найди значение и выбери ответ.',
        'Find the value and choose the answer.',
      ),
      items: [1, 2, 3, 4].map((k) => ({
        id: 'o' + k,
        correct: k === right,
        label: String(i + 1 + k),
      })),
    },
    source: {
      no: 3 + i,
      slug: 'dars03-trigonometrik-doira',
      title: L('Trigonometrik doira', 'Тригонометрический круг', 'The trigonometric circle'),
    },
    audio: [A('mount', 'Topshiriq.', 'Задание.', 'A task.')],
  }
}

const TASKS = Array.from({ length: 14 }, (unused, i) => TASK(i))

const MAP = {
  role: 'summary',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L("Bo'shliqlar xaritasi", 'Карта пробелов', 'The gap map'),
  blocks: BLOCKS,
  note: L(
    "Foiz emas, manzil: qaysi blokka qaytish kerak.",
    'Не процент, а адрес: в какой блок надо вернуться.',
    'Not a percentage but an address: which block to return to.',
  ),
  audio: [A('mount', 'Xarita.', 'Карта.', 'The map.')],
}

const taskScreen = (data) => (p) => (
  <Screen data={data} sect="practice" right={({ solved }) => <DtmClock running={!solved} />} {...p}>
    {(s) => <DtmBody {...s} data={data} />}
  </Screen>
)

const mapScreen = (p) => (
  <Screen data={MAP} sect="result" {...p}>
    {(s) => <DtmMapBody {...s} data={MAP} answers={p.answers} />}
  </Screen>
)

const Lesson = makeLesson({
  meta: { id: 'grade10-55', no: 55, title: L('DTM', 'ДТМ', 'DTM') },
  block: { label: 'B8', from: 50, to: 55, current: 55 },
  screens: TASKS.map(taskScreen).concat([mapScreen]),
  mode: 'dtm',
})

function App() {
  return (
    <div>
      <Lesson lang="ru" />
      <div id="stepnow" style={{ fontFamily: 'monospace', padding: 6 }}>step 0</div>
    </div>
  )
}
createRoot(document.getElementById('r')).render(<App />)
