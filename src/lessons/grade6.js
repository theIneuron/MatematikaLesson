import { lazy } from 'react'

// 6-sinf NAZARIY darslari (Dars01–…). Yangi dars shu yerga qo'shiladi.
// Reja: DARSLAR_REJASI_1-11.md «6 класс» (53 dars, Б1–Б6).
// Darslik: src/books/grade6/matematika_6_uzb_2022.pdf.
// Etalon kontrakt (meros): grade5/Dars01 infratuzilmasi.
//
// UZ TERMIN (darslik, 22-bet): «кратное» = KARRALI («N ga karrali»,
// «N ning karralisi», «karrali sonlar»). `karra` — FAQAT ko'paytirish
// o'qilishi («olti karra olti»), hech qachon «кратное» emas.
//
// ⚠️ Б1 bloki (1–7-darslar, «Bo'linish») DARSLAR_REJASI da `черновик · сверка РУз`
// deb belgilangan. 2022-yilgi o'zbek darsligida bu mavzu alohida bob emas —
// u «5-sinfda o'tilganlarni takrorlash» ichida (10-bet, «Tub va murakkab sonlar.
// EKUB va EKUK»). Blokning o'rni metodist qaroriga qoldirilgan.
export const grade6Nazariy = [
  {
    slug: 'dars01-boluvchilar-va-karrali-sonlar',
    title: "Dars 1. Bo'luvchilar va karrali sonlar",
    desc: "Bitta bo'lish misolidan ikkita nom: a soni b ga qoldiqsiz bo'linsa, b — a ning bo'luvchisi, a — b ning karralisi. Bo'luvchilarni juftlab qidirish; 1 va sonning o'zi doim bo'luvchi; karrali sonlar cheksiz, bo'luvchilar sanoqli.",
    Component: lazy(() => import('../components/grade6/Dars01.jsx')),
  },
  {
    slug: 'dars02-2-5-10-ga-bolinish-alomatlari',
    title: "Dars 2. 2, 5 va 10 ga bo'linish alomatlari",
    desc: "Sonning oxirgi raqamiga qarab uning 2, 5 va 10 ga qoldiqsiz bo'linishini tez aniqlash. Juft va toq sonlarni farqlash hamda bir son uchun bir nechta alomatni birgalikda qo'llash.",
    Component: lazy(() => import('../components/grade6/Dars02.jsx')),
  },
  {
    slug: 'dars03-3-va-9-ga-bolinish-alomatlari',
    title: "Dars 3. 3 va 9 ga bo'linish alomatlari",
    desc: "Son raqamlari yig'indisi orqali 3 va 9 ga bo'linishni tekshirish. 9 ga bo'linadigan sonning 3 ga ham bo'linishi va noma'lum raqamni topish.",
    Component: lazy(() => import('../components/grade6/Dars03.jsx')),
  },
  {
    slug: 'dars04-tub-va-murakkab-sonlar',
    title: 'Dars 4. Tub va murakkab sonlar',
    desc: "Bo'luvchilar soniga qarab tub va murakkab sonlarni ajratish. 1 sonining alohida holati hamda 18 dan 180 gacha bo'lgan sonlarni ustun usulida tub ko'paytuvchilarga ajratish.",
    Component: lazy(() => import('../components/grade6/Dars04.jsx')),
  },
  {
    slug: 'dars05-eng-katta-umumiy-boluvchi',
    title: "Dars 5. Eng katta umumiy bo'luvchi (EKUB)",
    desc: "Ikki sonning umumiy bo'luvchilarini va ularning eng kattasini topish. Ro'yxat hamda tub ko'paytuvchilarga yoyish usullari, o'zaro tub sonlar.",
    Component: lazy(() => import('../components/grade6/Dars05.jsx')),
  },
  {
    slug: 'dars06-eng-kichik-umumiy-karrali',
    title: 'Dars 6. Eng kichik umumiy karrali (EKUK)',
    desc: "Ikki sonning umumiy karrali sonlari ichidan eng kichigini topish. Karralilar qatori, tub ko'paytuvchilarga yoyish va EKUB bilan EKUK orasidagi bog'lanish.",
    Component: lazy(() => import('../components/grade6/Dars06.jsx')),
  },
  {
    slug: 'dars07-kasrning-asosiy-xossasi',
    title: 'Dars 7. Kasrning asosiy xossasi',
    desc: "Kasrning surat va maxrajini bir xil natural songa ko'paytirish yoki umumiy bo'luvchiga bo'lish uning qiymatini o'zgartirmasligi. Teng kasrlar, kasrni kengaytirish va qisqartirish.",
    Component: lazy(() => import('../components/grade6/Dars07.jsx')),
  },
  {
    slug: 'dars08-kasrlarni-qisqartirish',
    title: 'Dars 8. Kasrlarni qisqartirish',
    desc: "Kasrning surat va maxrajini bir xil umumiy bo'luvchiga bo'lish. Qisqarmas kasrlar va EKUB yordamida kasrni bir qadamda eng sodda ko'rinishga keltirish.",
    Component: lazy(() => import('../components/grade6/Dars08.jsx')),
  },
  {
    slug: 'dars09-kasrlarni-umumiy-maxrajga-keltirish',
    title: 'Dars 9. Kasrlarni umumiy maxrajga keltirish',
    desc: "Maxrajlarning EKUKini topish, qo'shimcha ko'paytuvchilarni aniqlash va kasrlarni qiymatini o'zgartirmasdan eng kichik umumiy maxrajda yozish.",
    Component: lazy(() => import('../components/grade6/Dars09.jsx')),
  },
  {
    slug: 'dars10-har-xil-maxrajli-kasrlarni-qoshish-va-ayirish',
    title: "Dars 10. Har xil maxrajli kasrlarni qo'shish va ayirish",
    desc: "Kasrlarni eng kichik umumiy maxrajga keltirish, suratlarni qo'shish yoki ayirish va yakuniy javobni qisqartirish.",
    Component: lazy(() => import('../components/grade6/Dars10.jsx')),
  },
  {
    slug: 'dars11-oddiy-kasrlarni-kopaytirish',
    title: "Dars 11. Oddiy kasrlarni ko'paytirish",
    desc: "Suratlarni va maxrajlarni o'zaro ko'paytirish, ko'paytirishdan oldin qisqartirish hamda sonning kasr qismini topish.",
    Component: lazy(() => import('../components/grade6/Dars11.jsx')),
  },
  {
    slug: 'dars12-oddiy-kasrlarni-bolish',
    title: "Dars 12. Oddiy kasrlarni bo'lish",
    desc: "Bo'lishni teskari kasrga ko'paytirish bilan almashtirish, butun son qatnashgan misollar va natijani ko'paytirish orqali tekshirish.",
    Component: lazy(() => import('../components/grade6/Dars12.jsx')),
  },
  {
    slug: 'dars13-ozaro-teskari-sonlar-va-sonni-qismiga-kora-topish',
    title: "Dars 13. O'zaro teskari sonlar va sonni qismiga ko'ra topish",
    desc: "Ko'paytmasi 1 bo'lgan o'zaro teskari sonlar, nolning alohida holati va ma'lum kasr qismi orqali butun sonni topish.",
    Component: lazy(() => import('../components/grade6/Dars13.jsx')),
  },
  {
    slug: 'dars14-onli-kasrlarni-kopaytirish-va-bolish',
    title: "Dars 14. O'nli kasrlarni ko'paytirish va bo'lish",
    desc: "O'nli kasrlarni ko'paytirish va bo'lish algoritmlari, 10, 100 va 1000 bilan amallarda vergulni to'g'ri siljitish.",
    Component: lazy(() => import('../components/grade6/Dars14.jsx')),
  },
  {
    slug: 'dars15-davriy-onli-kasrlar-va-yaxlitlash',
    title: "Dars 15. Davriy o'nli kasrlar va yaxlitlash",
    desc: "Tugaydigan va davriy o'nli kasrlarni ajratish, davrni qavsda yozish hamda sonlarni o'ndan birlar va yuzdan birlargacha yaxlitlash.",
    Component: lazy(() => import('../components/grade6/Dars15.jsx')),
  },
]

// 6-sinf AMALIY darslari.
export const grade6Amaliy = [
  {
    slug: 'dars01-boluvchilar-va-karrali-sonlar-amaliyot',
    title: "Dars 1 amaliyoti. Bo'luvchilar va karrali sonlar",
    desc: "10 ta variantli, ha yoki yo'q hamda moslashtirish topshirig'i.",
    Component: lazy(() => import('../components/grade6/practice/Dars01Practice.jsx')),
  },
  {
    slug: 'dars02-2-5-10-ga-bolinish-alomatlari-amaliyot',
    title: "Dars 2 amaliyoti. 2, 5 va 10 ga bo'linish alomatlari",
    desc: "10 ta variantli, ha yoki yo'q hamda moslashtirish topshirig'i.",
    Component: lazy(() => import('../components/grade6/practice/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-3-va-9-ga-bolinish-alomatlari-amaliyot',
    title: "Dars 3 amaliyoti. 3 va 9 ga bo'linish alomatlari",
    desc: "10 ta variantli, ha yoki yo'q hamda moslashtirish topshirig'i.",
    Component: lazy(() => import('../components/grade6/practice/Dars03Practice.jsx')),
  },
  {
    slug: 'dars04-tub-va-murakkab-sonlar-amaliyot',
    title: "Dars 4 amaliyoti. Tub va murakkab sonlar",
    desc: "10 ta variantli, ha yoki yo'q hamda moslashtirish topshirig'i.",
    Component: lazy(() => import('../components/grade6/practice/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-eng-katta-umumiy-boluvchi-amaliyot',
    title: "Dars 5 amaliyoti. Eng katta umumiy bo'luvchi",
    desc: "10 ta variantli, ha yoki yo'q hamda moslashtirish topshirig'i.",
    Component: lazy(() => import('../components/grade6/practice/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-eng-kichik-umumiy-karrali-amaliyot',
    title: "Dars 6 amaliyoti. Eng kichik umumiy karrali",
    desc: "10 ta variantli, ha yoki yo'q hamda moslashtirish topshirig'i.",
    Component: lazy(() => import('../components/grade6/practice/Dars06Practice.jsx')),
  },
  {
    slug: 'dars07-kasrning-asosiy-xossasi-amaliyot',
    title: "Dars 7 amaliyoti. Kasrning asosiy xossasi",
    desc: "Kasrni kengaytirish, qisqartirish va teng kasrlarni aniqlashga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-kasrlarni-qisqartirish-amaliyot',
    title: "Dars 8 amaliyoti. Kasrlarni qisqartirish",
    desc: "Kasrlarni umumiy bo'luvchi va EKUB yordamida qisqartirishga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-kasrlarni-umumiy-maxrajga-keltirish-amaliyot',
    title: "Dars 9 amaliyoti. Kasrlarni umumiy maxrajga keltirish",
    desc: "Eng kichik umumiy maxraj va qo'shimcha ko'paytuvchilarga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-har-xil-maxrajli-kasrlarni-qoshish-va-ayirish-amaliyot',
    title: "Dars 10 amaliyoti. Har xil maxrajli kasrlarni qo'shish va ayirish",
    desc: "Har xil maxrajli kasrlarni qo'shish, ayirish va javobni qisqartirishga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-oddiy-kasrlarni-kopaytirish-amaliyot',
    title: "Dars 11 amaliyoti. Oddiy kasrlarni ko'paytirish",
    desc: "Kasrlarni ko'paytirish, oldindan qisqartirish va sonning kasr qismini topishga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-oddiy-kasrlarni-bolish-amaliyot',
    title: "Dars 12 amaliyoti. Oddiy kasrlarni bo'lish",
    desc: "Bo'lishni teskari kasrga ko'paytirish bilan almashtirishga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-ozaro-teskari-sonlar-va-sonni-qismiga-kora-topish-amaliyot',
    title: "Dars 13 amaliyoti. O'zaro teskari sonlar va sonni qismiga ko'ra topish",
    desc: "O'zaro teskari sonlar va ma'lum kasr qismi orqali butun sonni topishga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-onli-kasrlarni-kopaytirish-va-bolish-amaliyot',
    title: "Dars 14 amaliyoti. O'nli kasrlarni ko'paytirish va bo'lish",
    desc: "O'nli kasrlar bilan amallar va vergulni to'g'ri siljitishga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-davriy-onli-kasrlar-va-yaxlitlash-amaliyot',
    title: "Dars 15 amaliyoti. Davriy o'nli kasrlar va yaxlitlash",
    desc: "Davriy o'nli kasrlarni aniqlash va sonlarni kerakli xonagacha yaxlitlashga oid 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade6/practice/Dars15Practice.jsx')),
  },
]
