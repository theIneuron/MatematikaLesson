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
    title: 'Dars 1. Atrofimizdagi katta sonlar',
    desc: "Ko'p xonali sonlarni o'qish va tasavvur qilish",
    Component: lazy(() => import('./components/Dars01.jsx')),
  },
  {
    slug: 'taqqoslash-yaxlitlash',
    title: 'Dars 2. Sonlarni taqqoslash va yaxlitlash',
    desc: "Ko'p xonali sonlarni taqqoslash va yaxlitlash",
    Component: lazy(() => import('./components/Dars02.jsx')),
  },
  {
    slug: 'qoshish-ayirish',
    title: "Dars 3. Ustun shaklida qo'shish va ayirish",
    desc: "Xonalar bo'yicha qo'shish va ayirish",
    Component: lazy(() => import('./components/Dars03.jsx')),
  },
  {
    slug: 'kopaytirish',
    title: "Dars 4. Ustun shaklida ko'paytirish",
    desc: "Ko'p xonali sonlarni ustunda ko'paytirish",
    Component: lazy(() => import('./components/Dars04.jsx')),
  },
  {
    slug: 'bolish',
    title: "Dars 5. Burchak usulida bo'lish",
    desc: "Burchak usulida bo'lish va qoldiqli bo'lish",
    Component: lazy(() => import('./components/Dars05.jsx')),
  },
  {
    slug: 'manfiy-sonlar',
    title: "Dars 6. Manfiy sonlar koordinata chizig'ida",
    desc: "Dengiz sathidan past: 0 dan chapda manfiy son, −5 < −3 (whole-number bias)",
    Component: lazy(() => import('./components/Dars06.jsx')),
  },
  {
    slug: 'butun-sonlar-taqqoslash',
    title: "Dars 7. Butun sonlarni taqqoslash va qarama-qarshi sonlar",
    desc: "O'ngroq — kattaroq, −2 < 3; qarama-qarshi son — ishorani almashtirish (4 → −4)",
    Component: lazy(() => import('./components/Dars07.jsx')),
  },
  {
    slug: 'daraja-kvadrat-kub',
    title: "Dars 8. Sonning darajasi. Kvadrat va kub",
    desc: "Daraja — bir xil ko'paytuvchilar ko'paytmasi; kvadrat a²=a·a, kub a³=a·a·a",
    Component: lazy(() => import('./components/Dars08.jsx')),
  },
  {
    slug: 'kasr-nima',
    title: 'Dars 9. Kasr nima',
    desc: 'Kasr — butunning bir qismi',
    Component: lazy(() => import('./components/Dars09.jsx')),
  },
  {
    slug: 'kasr-son-oqida',
    title: "Dars 10. Kasr son o'qida",
    desc: "Kasrni 0…1 va 0…2 oraliqda nuqta sifatida joylashtirish",
    Component: lazy(() => import('./components/Dars10.jsx')),
  },
  {
    slug: 'kasr-bolish',
    title: "Dars 11. Kasr — bo'lish natijasi",
    desc: "a/b — a ni b ga bo'lish: 3 ta nonni 4 do'stga bo'lsak, har biriga 3/4",
    Component: lazy(() => import('./components/Dars11.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-maxraj',
    title: "Dars 12. Bir xil maxrajli kasrlarni taqqoslash",
    desc: "Maxraj bir xil bo'lsa, surati katta kasr katta: 5/8 > 3/8",
    Component: lazy(() => import('./components/Dars12.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-surat',
    title: "Dars 13. Bir xil suratli kasrlarni taqqoslash",
    desc: "Surat bir xil bo'lsa, maxraji kichik kasr katta: 1/3 > 1/5",
    Component: lazy(() => import('./components/Dars13.jsx')),
  },
  {
    slug: 'kasr-taqqoslash-harxil',
    title: "Dars 14. Har xil maxrajli kasrlarni taqqoslash",
    desc: "Umumiy ulushga keltirib solishtirish: 2/3 va 3/4 → 8/12 va 9/12",
    Component: lazy(() => import('./components/Dars14.jsx')),
  },
  {
    slug: 'kasr-ekvivalent',
    title: "Dars 15. Ekvivalent kasrlar — qoida",
    desc: "1/2 = 2/4 = 3/6: surat va maxrajni bir songa ko'paytirish",
    Component: lazy(() => import('./components/Dars15.jsx')),
  },
  {
    slug: 'kasr-qisqartirish',
    title: "Dars 16. Kasrlarni qisqartirish",
    desc: "6/8 = 3/4: surat va maxrajni umumiy bo'luvchiga bo'lish",
    Component: lazy(() => import('./components/Dars16.jsx')),
  },
  {
    slug: 'kasr-qoshish-maxraj',
    title: "Dars 17. Bir xil maxrajli kasrlarni qo'shish",
    desc: "3/5 + 1/5 = 4/5: suratlarni qo'shamiz, maxraj o'zgarmaydi",
    Component: lazy(() => import('./components/Dars17.jsx')),
  },
  {
    slug: 'kasr-ayirish-teng',
    title: "Dars 18. Bir xil maxrajli kasrlarni ayirish",
    desc: "5/6 − 2/6 = 3/6: suratlarni ayiramiz, maxraj o'zgarmaydi",
    Component: lazy(() => import('./components/Dars18.jsx')),
  },
  {
    slug: 'kasr-qoshish-harxil',
    title: "Dars 19. Har xil maxrajli kasrlarni qo'shish",
    desc: "1/2 + 1/3 = 5/6: umumiy maxrajga keltirib qo'shish",
    Component: lazy(() => import('./components/Dars19.jsx')),
  },
  {
    slug: 'kasr-ayirish-harxil',
    title: "Dars 20. Har xil maxrajli kasrlarni ayirish",
    desc: "5/6 − 1/3 = 3/6: umumiy maxrajga keltirib ayirish (kvest)",
    Component: lazy(() => import('./components/Dars20.jsx')),
  },
  {
    slug: 'kasr-aralash-son',
    title: "Dars 21. To'g'ri, noto'g'ri va aralash sonlar",
    desc: "5/3 = 1 2/3: noto'g'ri kasr va aralash son — butun va kasrning yig'indisi",
    Component: lazy(() => import('./components/Dars21.jsx')),
  },
  {
    slug: 'kasr-aralash-otkazish',
    title: "Dars 22. Aralash sonni noto'g'ri kasrga o'tkazish",
    desc: "1 2/3 = 5/3 va 11/4 = 2 3/4: aralash va noto'g'ri kasrni ikki tomonlama o'tkazish",
    Component: lazy(() => import('./components/Dars22.jsx')),
  },
  {
    slug: 'kasr-aralash-qoshish-ayirish',
    title: "Dars 23. Aralash sonlarni qo'shish va ayirish",
    desc: "1 2/3 + 2 2/3 = 4 1/3: ko'chirish va qarz olish, har xil maxraj",
    Component: lazy(() => import('./components/Dars23.jsx')),
  },
  {
    slug: 'onlik-kasr-konsept',
    title: "Dars 24. O'nli kasr — tushuncha",
    desc: "0,1 = 1/10: vergul, razryadlar (o'ndan, yuzdan, mingdan)",
    Component: lazy(() => import('./components/Dars24.jsx')),
  },
  {
    slug: 'onlik-solishtirish-yaxlitlash',
    title: "Dars 25. O'nli kasrlarni solishtirish va yaxlitlash",
    desc: "0,5 katta 0,45 dan: vergul ostiga vergul, razryadma-razryad solishtirish va yaxlitlash",
    Component: lazy(() => import('./components/Dars25.jsx')),
  },
  {
    slug: 'onlik-qoshish-ayirish',
    title: "Dars 26. O'nli kasrlarni qo'shish va ayirish",
    desc: "2 + 0,5 = 2,5: vergulni vergul ostiga qo'yib, xonalab qo'shish va ayirish",
    Component: lazy(() => import('./components/Dars26.jsx')),
  },
  {
    slug: 'onlik-kopaytirish-bolish',
    title: "Dars 27. O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish",
    desc: "2,5 × 10 = 25: vergulni surish — o'nga, yuzga, mingga ko'paytirish va bo'lish",
    Component: lazy(() => import('./components/Dars27.jsx')),
  },
  {
    slug: 'onli-kopaytirish',
    title: "Dars 28. O'nli kasrlarni ko'paytirish",
    desc: "Vergulsiz ko'paytir, kasr xonalar yig'indisicha vergul qo'y; birdan kichikka ko'paytirish kichraytiradi",
    Component: lazy(() => import('./components/Dars28.jsx')),
  },
  {
    slug: 'onli-bolish',
    title: "Dars 29. O'nli kasrlarni bo'lish",
    desc: "O'nlini butun va o'nliga bo'lish; vergulni surish; birdan kichikka bo'lish kattalashtiradi",
    Component: lazy(() => import('./components/Dars29.jsx')),
  },
  {
    slug: 'foiz-yuzdan-ulush',
    title: "Dars 30. Foiz — yuzdan bir ulush",
    desc: "1% = 1/100 = 0,01: foiz — yuzdan ulush, bitta sonning to'rt ko'rinishi",
    Component: lazy(() => import('./components/Dars30.jsx')),
  },
  {
    slug: 'foiz-sonning-foizi',
    title: "Dars 31. Sonning foizini topish",
    desc: "iPhone $1200 ga 20% chegirma = $240: 1% ni topib foizga ko'paytirish",
    Component: lazy(() => import('./components/Dars31.jsx')),
  },
  {
    slug: 'foiz-songa-foiz',
    title: "Dars 32. Foizi bo'yicha sonni topish",
    desc: "20% i 10 bo'lsa, butun 50: teskari foiz — qism va foizdan butunni topish",
    Component: lazy(() => import('./components/Dars32.jsx')),
  },
  {
    slug: 'geometriya-boshlanishi',
    title: "Dars 33. Burchak, chiziqlar va aylana",
    desc: "Geometriya boshlanishi: kesma/nur/to'g'ri chiziq, burchak (to'g'ri va yoyiq), aylana (radius, diametr)",
    Component: lazy(() => import('./components/Dars33.jsx')),
  },
  {
    slug: 'perimetr',
    title: "Dars 34. To'rtburchak va kvadrat perimetri",
    desc: "5 ga 3 tomorqa: perimetr = 16 metr, chegara bo'ylab barcha tomonlar yig'indisi",
    Component: lazy(() => import('./components/Dars34.jsx')),
  },
  {
    slug: 'yuza',
    title: "Dars 35. To'rtburchak va kvadrat yuzasi",
    desc: "5 ga 3 to'rtburchak: yuza = 15 katak, bo'yi ko'paytirilgan eni (S = a × b)",
    Component: lazy(() => import('./components/Dars35.jsx')),
  },
  {
    slug: 'uchburchak-yuza',
    title: "Dars 36. Uchburchak yuzasi",
    desc: "Uchburchak — to'rtburchakning yarmi: yuza = (asos × balandlik) : 2",
    Component: lazy(() => import('./components/Dars36.jsx')),
  },
  {
    slug: 'hajm-parallelepiped',
    title: "Dars 37. To'rtburchakli parallelepiped hajmi",
    desc: "Quti birlik kublardan: hajm = uzunlik × en × balandlik (V = a × b × c, sm³)",
    Component: lazy(() => import('./components/Dars37.jsx')),
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
