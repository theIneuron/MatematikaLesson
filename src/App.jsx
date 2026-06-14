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
    title: 'Урок 1. Atrofimizdagi katta sonlar',
    desc: "Ko'p xonali sonlarni o'qish va tasavvur qilish",
    Component: lazy(() => import('./components/Dars01.jsx')),
  },
  {
    slug: 'taqqoslash-yaxlitlash',
    title: 'Урок 2. Sonlarni taqqoslash va yaxlitlash',
    desc: "Ko'p xonali sonlarni taqqoslash va yaxlitlash",
    Component: lazy(() => import('./components/Dars02.jsx')),
  },
  {
    slug: 'qoshish-ayirish',
    title: "Урок 3. Ustun shaklida qo'shish va ayirish",
    desc: "Xonalar bo'yicha qo'shish va ayirish",
    Component: lazy(() => import('./components/Dars03.jsx')),
  },
  {
    slug: 'kopaytirish',
    title: "Урок 4. Ustun shaklida ko'paytirish",
    desc: "Ko'p xonali sonlarni ustunda ko'paytirish",
    Component: lazy(() => import('./components/Dars04.jsx')),
  },
  {
    slug: 'bolish',
    title: "Урок 5. Burchak usulida bo'lish",
    desc: "Burchak usulida bo'lish va qoldiqli bo'lish",
    Component: lazy(() => import('./components/Dars05.jsx')),
  },
  {
    slug: 'kasr-nima',
    title: 'Урок 6. Kasr nima',
    desc: 'Kasr — butunning bir qismi',
    Component: lazy(() => import('./components/Dars06.jsx')),
  },
  {
    slug: 'kasr-son-oqida',
    title: "Урок 7. Kasr son o'qida",
    desc: "Kasrni 0…1 va 0…2 oraliqda nuqta sifatida joylashtirish",
    Component: lazy(() => import('./components/Dars07.jsx')),
  },
  {
    slug: 'kasr-bolish',
    title: "Урок 8. Kasr — bo'lish natijasi",
    desc: "a/b — a ni b ga bo'lish: 3 ta nonni 4 do'stga bo'lsak, har biriga 3/4",
    Component: lazy(() => import('./components/Dars08.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-maxraj',
    title: "Урок 9. Bir xil maxrajli kasrlarni taqqoslash",
    desc: "Maxraj bir xil bo'lsa, surati katta kasr katta: 5/8 > 3/8",
    Component: lazy(() => import('./components/Dars09.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-surat',
    title: "Урок 10. Bir xil suratli kasrlarni taqqoslash",
    desc: "Surat bir xil bo'lsa, maxraji kichik kasr katta: 1/3 > 1/5",
    Component: lazy(() => import('./components/Dars10.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-harxil',
    title: "Урок 11. Har xil maxrajli kasrlarni taqqoslash",
    desc: "Umumiy ulushga keltirib solishtirish: 2/3 va 3/4 → 8/12 va 9/12",
    Component: lazy(() => import('./components/Dars11.jsx')),
  },
  {
    slug: 'kasr-ekvivalent',
    title: "Урок 12. Ekvivalent kasrlar — qoida",
    desc: "1/2 = 2/4 = 3/6: surat va maxrajni bir songa ko'paytirish",
    Component: lazy(() => import('./components/Dars12.jsx')),
  },
  {
    slug: 'kasr-qisqartirish',
    title: "Урок 13. Kasrlarni qisqartirish",
    desc: "6/8 = 3/4: surat va maxrajni umumiy bo'luvchiga bo'lish",
    Component: lazy(() => import('./components/Dars13.jsx')),
  },
  {
    slug: 'kasr-qoshish-maxraj',
    title: "Урок 14. Bir xil maxrajli kasrlarni qo'shish",
    desc: "3/5 + 1/5 = 4/5: suratlarni qo'shamiz, maxraj o'zgarmaydi",
    Component: lazy(() => import('./components/Dars14.jsx')),
  },
  {
    slug: 'kasr-ayirish-teng',
    title: "Урок 15. Bir xil maxrajli kasrlarni ayirish",
    desc: "5/6 − 2/6 = 3/6: suratlarni ayiramiz, maxraj o'zgarmaydi",
    Component: lazy(() => import('./components/Dars15.jsx')),
  },
  {
    slug: 'kasr-qoshish-harxil',
    title: "Урок 16. Har xil maxrajli kasrlarni qo'shish",
    desc: "1/2 + 1/3 = 5/6: umumiy maxrajga keltirib qo'shish",
    Component: lazy(() => import('./components/Dars16.jsx')),
  },
  {
    slug: 'kasr-ayirish-harxil',
    title: "Урок 17. Har xil maxrajli kasrlarni ayirish",
    desc: "5/6 − 1/3 = 3/6: umumiy maxrajga keltirib ayirish (kvest)",
    Component: lazy(() => import('./components/Dars17.jsx')),
  },
  {
    slug: 'kasr-aralash-son',
    title: "Урок 18. To'g'ri, noto'g'ri va aralash sonlar",
    desc: "5/3 = 1 2/3: noto'g'ri kasr va aralash son — butun va kasrning yig'indisi",
    Component: lazy(() => import('./components/Dars18.jsx')),
  },
  {
    slug: 'kasr-aralash-otkazish',
    title: "Урок 19. Aralash sonni noto'g'ri kasrga o'tkazish",
    desc: "1 2/3 = 5/3 va 11/4 = 2 3/4: aralash va noto'g'ri kasrni ikki tomonlama o'tkazish",
    Component: lazy(() => import('./components/Dars19.jsx')),
  },
  {
    slug: 'kasr-aralash-qoshish-ayirish',
    title: "Урок 20. Aralash sonlarni qo'shish va ayirish",
    desc: "1 2/3 + 2 2/3 = 4 1/3: ko'chirish va qarz olish, har xil maxraj",
    Component: lazy(() => import('./components/Dars20.jsx')),
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
