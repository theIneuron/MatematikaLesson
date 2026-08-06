import { lazy } from 'react'

// 4-sinf NAZARIY darslari. Barcha yangi komponentlar faqat components/grade4/ ichida yaratiladi.
export const grade4Nazariy = [
  {
    slug: 'dars01-kop-xonali-sonlar-sinflari',
    title: "Dars 1. Ko'p xonali sonlar sinflari",
    desc: "Ko'p xonali sonni o'ngdan uch raqamli sinflarga ajratish, raqamning o'rin qiymatini aniqlash va ichki nol qatnashgan sonlarni tuzish.",
    Component: lazy(() => import('../components/grade4/Dars01.jsx')),
  },
  {
    slug: 'dars02-kop-xonali-sonlarni-oqish-va-yozish',
    title: "Dars 2. Ko'p xonali sonlarni o'qish va yozish",
    desc: "Ko'p xonali sonlarni sinflar bo'yicha o'qish, ovozli shakldan raqamli yozuvga o'tish, ichki nollarni saqlash va qayta o'qib tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars02.jsx')),
  },
  {
    slug: 'dars03-kop-xonali-sonning-xona-tarkibi',
    title: "Dars 3. Ko'p xonali sonning xona tarkibi",
    desc: "Raqam, xona va xona qiymatini farqlash, sonni xona qo'shiluvchilariga yoyish hamda yoyiq yozuvdan sonni tiklash.",
    Component: lazy(() => import('../components/grade4/Dars03.jsx')),
  },
  {
    slug: 'dars04-kop-xonali-sonlarni-taqqoslash',
    title: "Dars 4. Ko'p xonali sonlarni taqqoslash",
    desc: "Avval raqamlar sonini, keyin chapdagi birinchi farqli xonani taqqoslash, belgini to'g'ri qo'yish va sonlarni tartiblash.",
    Component: lazy(() => import('../components/grade4/Dars04.jsx')),
  },
  {
    slug: 'dars05-kop-xonali-sonlarni-yaxlitlash',
    title: "Dars 5. Ko'p xonali sonlarni yaxlitlash",
    desc: "Ko'p xonali sonlarni o'nlik, yuzlik va minglikkacha yaxlitlash hamda vaziyatga mos aniqlikni tanlash.",
    Component: lazy(() => import('../components/grade4/Dars05.jsx')),
  },
  {
    slug: 'dars06-sonlarning-xonalari-va-sinflari',
    title: "Dars 6. Sonlarning xonalari va sinflari",
    desc: "Sinf va xona, o'qish-yozish, yoyiq tarkib, taqqoslash hamda yaxlitlashni bitta murakkab ma'lumot paketida birlashtirish.",
    Component: lazy(() => import('../components/grade4/Dars06.jsx')),
  },
]

// 4-sinf AMALIY mashg'ulotlari. Har nazariy darsga 10 tekshiriladigan topshiriq
// (ETALON_4SINF §9). Amaliyot ovozsiz ishlaydi.
export const grade4Amaliy = [
  {
    slug: 'dars01-amaliyot-sinflar',
    title: "Dars 1. Amaliyot: sonlar sinflari",
    desc: "10 topshiriq: sinf chegarasi, xona qiymati, ichki nollar, xatoni topish va yangi shaklga ko'chirish.",
    Component: lazy(() => import('../components/grade4/Dars01Practice.jsx')),
  },
  {
    slug: 'dars02-amaliyot-oqish-yozish',
    title: "Dars 2. Amaliyot: sonlarni o'qish va yozish",
    desc: "10 topshiriq: sinflar bo'yicha o'qish, ovozli shakldan yozuvga o'tish, ichki nollar va qayta o'qib tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-amaliyot-xona-tarkibi',
    title: "Dars 3. Amaliyot: sonning xona tarkibi",
    desc: "10 topshiriq: raqamning xona qiymati, yoyiq yozuv, sonni tiklash, ichki nollar va xatoni tahlil qilish.",
    Component: lazy(() => import('../components/grade4/Dars03Practice.jsx')),
  },
  {
    slug: 'dars04-amaliyot-taqqoslash',
    title: "Dars 4. Amaliyot: sonlarni taqqoslash",
    desc: "10 topshiriq: raqamlar soni, birinchi farqli xona, belgilar, tartiblash va noto'g'ri strategiyani tuzatish.",
    Component: lazy(() => import('../components/grade4/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot-yaxlitlash',
    title: "Dars 5. Amaliyot: sonlarni yaxlitlash",
    desc: "10 topshiriq: o'nlik, yuzlik, minglik va o'n minglikkacha yaxlitlash, chegaraviy holat va aniqlik tanlash.",
    Component: lazy(() => import('../components/grade4/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot-xonalar-sinflar',
    title: "Dars 6. Amaliyot: sonlarning xonalari va sinflari",
    desc: "10 topshiriq: o'qish, yoyish, xona qiymati, taqqoslash va yaxlitlashni bir paketda birlashtirish.",
    Component: lazy(() => import('../components/grade4/Dars06Practice.jsx')),
  },
]
