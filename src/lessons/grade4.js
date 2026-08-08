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
  {
    slug: 'dars07-pozitsion-va-nopozitsion-sanoq-sistemalari',
    title: 'Dars 7. Pozitsion va nopozitsion sanoq sistemalari',
    desc: "Rim raqamlarini o'qish va yozish, so'ng pozitsion hamda nopozitsion yozuvlarni dalil bilan farqlash.",
    Component: lazy(() => import('../components/grade4/Dars07.jsx')),
  },
  {
    slug: 'dars08-kop-xonali-sonlarni-qoshish-va-ayirish',
    title: "Dars 8. Ko'p xonali sonlarni qo'shish va ayirish",
    desc: "Ko'p xonali sonlarni xona ostiga xona qilib yozish, ko'chirish va almashtirish bilan hisoblash hamda natijani tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars08.jsx')),
  },
  {
    slug: 'dars09-kop-xonali-sonni-bir-xonali-songa-kopaytirish',
    title: "Dars 9. Ko'p xonali sonni bir xonali songa ko'paytirish",
    desc: "Ko'p xonali sonni bir xonali songa yoyiq va ustun modellar orqali ko'paytirish, ko'chirish va nol qatnashgan xonalarni tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars09.jsx')),
  },
  {
    slug: 'dars10-kop-xonali-sonni-ikki-xonali-songa-kopaytirish',
    title: "Dars 10. Ko'p xonali sonni ikki xonali songa ko'paytirish",
    desc: "Ikki to'liqsiz ko'paytmani tuzish, o'nliklar qatorini bir xona siljitish va natijani taxmin bilan tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars10.jsx')),
  },
  {
    slug: 'dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish',
    title: "Dars 11. Ko'p xonali sonni uch xonali songa ko'paytirish",
    desc: "Birlik, o'nlik va yuzlik to'liqsiz ko'paytmalarini tegishli xonadan boshlab yozish, nol o'rnini saqlash va qatorlarni qo'shish.",
    Component: lazy(() => import('../components/grade4/Dars11.jsx')),
  },
  {
    slug: 'dars12-kop-xonali-sonni-bir-xonali-songa-bolish',
    title: "Dars 12. Ko'p xonali sonni bir xonali songa bo'lish",
    desc: "Birinchi to'liqsiz bo'linuvchini topish, yozma bo'lish siklini bajarish, bo'linmadagi nolni saqlash va natijani teskari amal bilan tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars12.jsx')),
  },
  {
    slug: 'dars13-kop-xonali-sonni-ikki-xonali-songa-bolish',
    title: "Dars 13. Ko'p xonali sonni ikki xonali songa bo'lish",
    desc: "Bo'linma raqamini yaqin ko'paytmalar orqali tanlash, sinov raqamini tuzatish va natijani teskari ko'paytirish bilan tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars13.jsx')),
  },
  {
    slug: 'dars14-harakat-masalalari',
    title: 'Dars 14. Harakatga doir masalalar',
    desc: "Masofa, tezlik va vaqtni o'zgarmas yo'l modelida bog'lash, noma'lum kattalikni aniqlash va mos amalni tanlash.",
    Component: lazy(() => import('../components/grade4/Dars14.jsx')),
  },
  {
    slug: 'dars15-ortacha-arifmetik',
    title: "Dars 15. O'rtacha arifmetik",
    desc: "Qiymatlar yig'indisini teng taqsimlash orqali o'rtacha arifmetikni topish va natijalarni adolatli taqqoslash.",
    Component: lazy(() => import('../components/grade4/Dars15.jsx')),
  },
  {
    slug: 'dars16-formulalar',
    title: 'Dars 16. Formulalar',
    desc: "Konkret shakl va katakli modeldan perimetr hamda yuza formulalariga o'tish, qiymat qo'yish va ikki kattalikni farqlash.",
    Component: lazy(() => import('../components/grade4/Dars16.jsx')),
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
  {
    slug: 'dars07-amaliyot-sanoq-sistemalari',
    title: 'Dars 7. Amaliyot: pozitsion va nopozitsion sanoq sistemalari',
    desc: "10 topshiriq: Rim yozuvi 1 dan 20 gacha, xona qiymati, ikki sanoq sistemasini farqlash, xatoni tahlil qilish va transfer.",
    Component: lazy(() => import('../components/grade4/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot-qoshish-ayirish',
    title: "Dars 8. Amaliyot: ko'p xonali sonlarni qo'shish va ayirish",
    desc: "10 topshiriq: xonalarni tekislash, ko'chirish, nollar orqali maydalash, teskari amal va natijani tekshirish.",
    Component: lazy(() => import('../components/grade4/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot-bir-xonali-kopaytirish',
    title: "Dars 9. Amaliyot: bir xonali songa ko'paytirish",
    desc: "10 topshiriq: teng guruhlar, ustun yozuvi, xona bo'yicha ko'paytirish, ichki nol, taxmin va qulay strategiya.",
    Component: lazy(() => import('../components/grade4/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot-ikki-xonali-kopaytirish',
    title: "Dars 10. Amaliyot: ikki xonali songa ko'paytirish",
    desc: "10 topshiriq: ikki to'liqsiz ko'paytma, o'nliklar qatorini siljitish, nol holati, xato tahlili va transfer.",
    Component: lazy(() => import('../components/grade4/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-amaliyot-uch-xonali-kopaytirish',
    title: "Dars 11. Amaliyot: uch xonali songa ko'paytirish",
    desc: "10 topshiriq: uchta to'liqsiz ko'paytma, 0–1–2 xona siljishi, o'rtadagi nol, xato tahlili va transfer.",
    Component: lazy(() => import('../components/grade4/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-amaliyot-bir-xonali-bolish',
    title: "Dars 12. Amaliyot: bir xonali songa bo'lish",
    desc: "10 topshiriq: birinchi to'liqsiz bo'linuvchi, yozma bo'lish sikli, ichki nol, qoldiq, xato tahlili va transfer.",
    Component: lazy(() => import('../components/grade4/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot-ikki-xonali-bolish',
    title: "Dars 13. Amaliyot: ikki xonali songa bo'lish",
    desc: "10 topshiriq: sinov raqami, yaqin ko'paytma, to'liqsiz bo'linuvchi, qoldiq, xato tahlili va transfer.",
    Component: lazy(() => import('../components/grade4/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot-harakat-masalalari',
    title: 'Dars 14. Amaliyot: harakat masalalari',
    desc: "10 topshiriq: masofa, tezlik va vaqt bog'lanishi, amal tanlash, birliklar, xato tahlili va ikki qismli transfer.",
    Component: lazy(() => import('../components/grade4/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-amaliyot-ortacha-arifmetik',
    title: "Dars 15. Amaliyot: o'rtacha arifmetik",
    desc: "10 topshiriq: yig'indi va qiymatlar soni, tenglashtirish, son chizig'i, chegara holati, xato tahlili va taqqoslash.",
    Component: lazy(() => import('../components/grade4/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot-formulalar',
    title: 'Dars 16. Amaliyot: formulalar',
    desc: "10 topshiriq: perimetr va yuza formulalari, qiymat qo'yish, birliklar, chegara holati, xato tahlili va transfer.",
    Component: lazy(() => import('../components/grade4/Dars16Practice.jsx')),
  },
]
