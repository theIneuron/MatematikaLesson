import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home.jsx'
import LessonPage from './components/LessonPage.jsx'
import './App.css'

// Darsliklar shu yerda ro'yxatga olinadi (lazy — har biri alohida yuklanadi).
// Yangi darslik qo'shish: faylni import qilib, massivga bitta obyekt qo'shing.
const lessons = [
  {
    slug: 'katta-sonlar',
    title: 'Atrofimizdagi katta sonlar',
    desc: "Ko'p xonali sonlarni o'qish va tasavvur qilish",
    Component: lazy(() => import('./components/Nat5_01.jsx')),
  },
  {
    slug: 'taqqoslash-yaxlitlash',
    title: 'Sonlarni taqqoslash va yaxlitlash',
    desc: "Ko'p xonali sonlarni taqqoslash va yaxlitlash",
    Component: lazy(() => import('./components/Nat5_02.jsx')),
  },
  {
    slug: 'qoshish-ayirish',
    title: "Ustun shaklida qo'shish va ayirish",
    desc: "Xonalar bo'yicha qo'shish va ayirish",
    Component: lazy(() => import('./components/Nat5_03.jsx')),
  },
  {
    slug: 'kopaytirish',
    title: "Ustun shaklida ko'paytirish",
    desc: "Ko'p xonali sonlarni ustunda ko'paytirish",
    Component: lazy(() => import('./components/Nat5_04.jsx')),
  },
  {
    slug: 'bolish',
    title: "Burchak usulida bo'lish",
    desc: "Burchak usulida bo'lish va qoldiqli bo'lish",
    Component: lazy(() => import('./components/Nat5_05.jsx')),
  },
  {
    slug: 'kasr-nima',
    title: 'Kasr nima',
    desc: 'Kasr — butunning bir qismi',
    Component: lazy(() => import('./components/Frac5_01.jsx')),
  },
  {
    slug: 'kasr-son-oqida',
    title: "Kasr son o'qida",
    desc: "Kasrni 0…1 va 0…2 oraliqda nuqta sifatida joylashtirish",
    Component: lazy(() => import('./components/Frac5_02.jsx')),
  },
  {
    slug: 'kasr-bolish',
    title: "Kasr — bo'lish natijasi",
    desc: "a/b — a ni b ga bo'lish: 3 ta nonni 4 do'stga bo'lsak, har biriga 3/4",
    Component: lazy(() => import('./components/Frac5_03.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-maxraj',
    title: "Bir xil maxrajli kasrlarni taqqoslash",
    desc: "Maxraj bir xil bo'lsa, surati katta kasr katta: 5/8 > 3/8",
    Component: lazy(() => import('./components/Frac5_04.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-surat',
    title: "Bir xil suratli kasrlarni taqqoslash",
    desc: "Surat bir xil bo'lsa, maxraji kichik kasr katta: 1/3 > 1/5",
    Component: lazy(() => import('./components/Frac5_05.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-harxil',
    title: "Har xil maxrajli kasrlarni taqqoslash",
    desc: "Umumiy ulushga keltirib solishtirish: 2/3 va 3/4 → 8/12 va 9/12",
    Component: lazy(() => import('./components/Frac5_11.jsx')),
  },
  {
    slug: 'kasr-ekvivalent',
    title: "Ekvivalent kasrlar — qoida",
    desc: "1/2 = 2/4 = 3/6: surat va maxrajni bir songa ko'paytirish",
    Component: lazy(() => import('./components/Frac5_07.jsx')),
  },
  {
    slug: 'kasr-qisqartirish',
    title: "Kasrlarni qisqartirish",
    desc: "6/8 = 3/4: surat va maxrajni umumiy bo'luvchiga bo'lish",
    Component: lazy(() => import('./components/Frac5_08.jsx')),
  },
  {
    slug: 'kasr-qoshish-maxraj',
    title: "Bir xil maxrajli kasrlarni qo'shish",
    desc: "3/5 + 1/5 = 4/5: suratlarni qo'shamiz, maxraj o'zgarmaydi",
    Component: lazy(() => import('./components/Frac5_09.jsx')),
  },
]

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home lessons={lessons} />} />
      {lessons.map((lesson) => (
        <Route
          key={lesson.slug}
          path={`/dars/${lesson.slug}`}
          element={<LessonPage lesson={lesson} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
