import { lazy } from 'react'

// 3-sinf NAZARIY darslari (Dars01–…). Yangi dars shu yerga qo'shiladi.
// Reja: DARSLAR_REJASI_1-11.md «3 класс» (51 dars + 7 nazorat).
// Syujet: src/books/grade3/SYUJET_3SINF.md («Bit sayyorasi Lumo»).
// Etalon kontrakt (meros): src/books/grade2/ETALON_2SINF.md → grade-3 etaloni Dars01.
export const grade3Nazariy = [
  {
    slug: 'dars01-yuzlik-onlik-birlik',
    title: "Dars 1. Yuzliklar, o'nliklar va birliklar",
    desc: "O'nta o'nlik — bitta yuzlik; uch xonali son = yuzlik + o'nlik + birlik (345 = 3 yuzlik 4 o'nlik 5 birlik); nol o'rinni saqlaydi (305).",
    Component: lazy(() => import('../components/grade3/Dars01.jsx')),
  },
  {
    slug: 'dars02-oqish-yozish',
    title: "Dars 2. Sonlarni o'qish va yozish",
    desc: "Son nomi va raqamli yozuv o'rtasidagi ko'prik (uch yuz besh = 305); har xona o'z nomi; nol o'rinni yozuvda saqlaydi.",
    Component: lazy(() => import('../components/grade3/Dars02.jsx')),
  },
  {
    slug: 'dars03-razryad-qoshiluvchilari',
    title: "Dars 3. Razryad qo'shiluvchilari",
    desc: "Sonni razryad qo'shiluvchilariga ajratish va yig'ish (345 = 300 + 40 + 5); bo'sh xona qo'shiluvchi bermaydi.",
    Component: lazy(() => import('../components/grade3/Dars03.jsx')),
  },
  {
    slug: 'dars04-taqqoslash',
    title: "Dars 4. Uch xonali sonlarni taqqoslash",
    desc: "Sonlarni xonama-xona, chapdan o'ngga taqqoslash (> < =); belgi kattaga ochiladi.",
    Component: lazy(() => import('../components/grade3/Dars04.jsx')),
  },
  {
    slug: 'dars05-yaxlitlash',
    title: "Dars 5. Sonlarni yaxlitlash",
    desc: "O'nlik va yuzlikkacha yaxlitlash; o'ngdagi raqam besh yoki katta — yuqoriga, kichik — pastga; yumaloq son nol bilan tugaydi.",
    Component: lazy(() => import('../components/grade3/Dars05.jsx')),
  },
  {
    slug: 'dars06-son-oqi',
    title: "Dars 6. Son o'qida son",
    desc: "Sonni son o'qida joylash va belgi bo'yicha o'qish; katta belgi — yuzlik, kichik — o'nlik.",
    Component: lazy(() => import('../components/grade3/Dars06.jsx')),
  },
  {
    slug: 'dars07-yozma-qoshish-ayirish',
    title: "Dars 7. Yozma qo'shish va ayirish",
    desc: "10000 gacha sonlarni ustunda qo'shish va ayirish; xona xona ostida, o'ngdan chapga; o'tkazish va qarz.",
    Component: lazy(() => import('../components/grade3/Dars07.jsx')),
  },
  {
    slug: 'dars08-rim-raqamlari',
    title: "Dars 8. Rim raqamlari",
    desc: "Sanoq sistemalari; Rim belgilari (I V X L C); kichik belgi o'ngda qo'shiladi, chapda ayiriladi (IX = 9).",
    Component: lazy(() => import('../components/grade3/Dars08.jsx')),
  },
  {
    slug: 'dars10-kopaytirish-jadvali',
    title: "Dars 10. Ko'paytirish jadvali",
    desc: "Ko'paytirish — teng guruhlarning qisqa yozuvi; massiv (satr × ustun); ko'paytuvchilarni o'rin almashtirish mumkin.",
    Component: lazy(() => import('../components/grade3/Dars10.jsx')),
  },
  {
    slug: 'dars11-10-100-ga-kopaytirish-bolish',
    title: "Dars 11. 10 va 100 ga ko'paytirish va bo'lish",
    desc: "10 ga ko'paytirsak o'ngga bitta nol qo'shiladi, 100 ga — ikkita; bo'lganda nollar qaytadi. Razryad siljishi.",
    Component: lazy(() => import('../components/grade3/Dars11.jsx')),
  },
  {
    slug: 'dars12-yigindini-kopaytirish',
    title: "Dars 12. Yig'indini ko'paytirish",
    desc: "Jadvalda yo'q sonni ko'paytirish: sonni o'nlik va birlikka ajratib, har bo'lakni alohida ko'paytiramiz va qo'shamiz.",
    Component: lazy(() => import('../components/grade3/Dars12.jsx')),
  },
  {
    slug: 'dars13-yigindini-bolish',
    title: "Dars 13. Yig'indini bo'lish",
    desc: "Jadvalda yo'q sonni bo'lish: sonni qoldiqsiz bo'linadigan bo'laklarga ajratib, har birini bo'lamiz va qo'shamiz.",
    Component: lazy(() => import('../components/grade3/Dars13.jsx')),
  },
]

// 3-sinf AMALIY darslari — har dars = 10 topshiriqli bank (grade2 darsNN/ naqshi).
export const grade3Amaliy = [
  {
    slug: 'dars01-amaliyot',
    title: "Dars 1 amaliyoti — Yuzliklar, o'nliklar va birliklar (10 topshiriq)",
    desc: "Razryadlar: sonni yig'ish va o'qish, nol razryad, raqam qiymati, son o'qi, minglik blok — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade3/practice/dars01/Dars01Practice.jsx')),
  },
  {
    slug: 'dars02-amaliyot',
    title: "Dars 2 amaliyoti — Sonlarni o'qish va yozish (10 topshiriq)",
    desc: "So'z va raqam yozuvi orasidagi ko'prik: o'qish, yozish, nol bilan yozish, xatoni topish, raqamlardan son yasash — darslik misollarida.",
    Component: lazy(() => import('../components/grade3/practice/dars02/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-amaliyot',
    title: "Dars 3 amaliyoti — Razryad qo'shiluvchilari (10 topshiriq)",
    desc: "Yoyilma va yig'ish: 427 = 400+20+7, nol razryad qo'shiluvchi bermaydi, plitalardan yig'ish, xatoni topish — darslik misollarida.",
    Component: lazy(() => import('../components/grade3/practice/dars03/Dars03Practice.jsx')),
  },
]
