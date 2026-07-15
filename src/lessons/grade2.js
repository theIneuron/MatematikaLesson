import { lazy } from 'react'

// 2-sinf NAZARIY darslari (Dars01–…). Yangi dars shu yerga qo'shiladi.
// Reja: DARSLAR_REJASI_1-11.md «2 класс» (39 dars + 7 nazorat).
// Etalon kontrakt: src/books/grade2/ETALON_2SINF.md.
export const grade2Nazariy = [
  {
    slug: 'dars01-onliklar-va-birliklar',
    title: "Dars 1. O'nliklar va birliklar",
    desc: "O'nta birlik — bitta o'nlik (dasta); ikki xonali son = o'nliklar + birliklar (45 = 4 o'nlik 5 birlik).",
    Component: lazy(() => import('../components/grade2/Dars01.jsx')),
  },
  {
    slug: 'dars02-sonlarni-oqish-yozish',
    title: "Dars 2. Sonlarni o'qish va yozish",
    desc: "Ikki xonali sonni o'qish (kod → nom) va yozish (nom → kod): o'nlik nomi + birlik nomi; o'rin muhim (47 ≠ 74).",
    Component: lazy(() => import('../components/grade2/Dars02.jsx')),
  },
  {
    slug: 'dars03-razryad-tarkibi',
    title: "Dars 3. Sonning razryad tarkibi",
    desc: "Ikki xonali sonni razryadlarga ajratish: 45 = 40 + 5 (o'nliklar qiymati + birliklar qiymati); nol-o'rin (30 = 3 o'nlik 0 birlik).",
    Component: lazy(() => import('../components/grade2/Dars03.jsx')),
  },
  {
    slug: 'dars04-sonlarni-taqqoslash',
    title: "Dars 4. Sonlarni taqqoslash",
    desc: "Ikki xonali sonlarni taqqoslash: avval o'nliklar, keyin birliklar; katta/kichik/teng (> < =).",
    Component: lazy(() => import('../components/grade2/Dars04.jsx')),
  },
  {
    slug: 'dars05-onlab-sanash',
    title: "Dars 5. O'nlab sanash",
    desc: "O'nlab sanash: 10, 20, 30 … 100 (oldinga va orqaga); har o'nlik = +10; yetishmagan sonni topish.",
    Component: lazy(() => import('../components/grade2/Dars05.jsx')),
  },
  {
    slug: 'dars06-son-oqi',
    title: "Dars 6. Son o'qi",
    desc: "Son o'qi (0…100): sonni o'qda joyiga qo'yish; qaysi ikki o'nlik orasida turadi (34 → 30 va 40 orasida).",
    Component: lazy(() => import('../components/grade2/Dars06.jsx')),
  },
  {
    slug: 'dars07-qoshish-otishsiz',
    title: "Dars 7. Qo'shish (o'tishsiz)",
    desc: "Ikki xonali sonlarni xonama-xona qo'shish (o'tishsiz): o'nlik+o'nlik, birlik+birlik (34 + 25 = 59).",
    Component: lazy(() => import('../components/grade2/Dars07.jsx')),
  },
  {
    slug: 'dars08-ayirish-otishsiz',
    title: "Dars 8. Ayirish (o'tishsiz)",
    desc: "Ikki xonali sonlarni xonama-xona ayirish (o'tishsiz): birlikdan birlik, o'nlikdan o'nlik (59 − 25 = 34).",
    Component: lazy(() => import('../components/grade2/Dars08.jsx')),
  },
  {
    slug: 'dars09-qoshish-otishli',
    title: "Dars 9. Qo'shish (o'tishli)",
    desc: "O'nlikdan o'tib qo'shish: birliklar 10 ga yetsa, 1 o'nlik ko'chadi (столбik + ko'chuvchi 1); 37 + 25 = 62.",
    Component: lazy(() => import('../components/grade2/Dars09.jsx')),
  },
  {
    slug: 'dars10-ayirish-otishli',
    title: "Dars 10. Ayirish (o'tishli)",
    desc: "O'nlikdan o'tib ayirish: birlik yetmasa, o'nlikdan qarz olinadi (столбik + qarz belgisi); 52 − 27 = 25.",
    Component: lazy(() => import('../components/grade2/Dars10.jsx')),
  },
  {
    slug: 'dars11-stolbik-tuzish',
    title: "Dars 11. Столбik (tuzish)",
    desc: "Столбikni to'g'ri tuzish: birlik ostiga birlik, o'nlik ostiga o'nlik; bir xonali son — birlik ustuniga (43 + 6).",
    Component: lazy(() => import('../components/grade2/Dars11.jsx')),
  },
  {
    slug: 'dars12-ikki-amalli-masala',
    title: "Dars 12. Ikki amalli masala",
    desc: "Ikki amalli masala: masalani bir amalda yechib bo'lmaydi — avval oraliq natija, keyin oxirgi javob (40 − 15 + 12 = 37).",
    Component: lazy(() => import('../components/grade2/Dars12.jsx')),
  },
  {
    slug: 'dars13-kopaytirish-manosi',
    title: "Dars 13. Ko'paytirish ma'nosi",
    desc: "Ko'paytirish — teng guruhlarni qo'shishning qisqa yo'li: teng qatorlar (R qator × C) → C+C+C = R × C (Yupiter dalasi).",
    Component: lazy(() => import('../components/grade2/Dars13.jsx')),
  },
]

// 2-sinf AMALIY mashqlari (jsx-question, PracticeHost preview orqali).
export const grade2Amaliy = [
  {
    slug: 'amaliyot01-onliklar-va-birliklar',
    title: "Amaliyot 1. O'nliklar va birliklar",
    desc: "Dasta (o'nlik) va tayoqchalardan (birlik) sonni toping — tap-tanlash.",
    Component: lazy(() => import('../components/grade2/practice/Amaliyot01Page.jsx')),
  },
]
