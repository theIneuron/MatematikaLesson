import { lazy } from 'react'

// 7-sinf darslari. Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md (48 dars).
// Kirish nuqtasi: START_GRADE7.md (ildizda). Sinf ETALONI -- 1-dars.
//
// 5-dars 2026-08-15 da ro'yxatdan OLIB TASHLANDI (metodist qarori): u eski
// yondashuvda yig'ilgan va yangi etalonga tushmaydi, shuning uchun NOLDAN
// qayta yoziladi. Eski fayllar o'chirilmadi -- ular
// `_archive/unused-code/grade7-dars05/` da yotibdi va u yerdan
// IMPORT QILINMAYDI (CLAUDE.md §6.4). Kerak bo'lsa, ular ongli ravishda
// loyihaga qaytariladi, arxivdan ulanmaydi.
export const grade7Nazariy = [
  {
    // Sinf ETALONI. Yangi darslar shu naqsh bo'yicha yig'iladi:
    // qoidani o'quvchi YIG'ADI, qo'l YOZUVNING ICHIDA ishlaydi, qoida esa
    // xuk savoliga javob beradi. Holat: src/books/grade7/DARS01_HOLAT.md
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: "Amallar tartibi va ifodaning qiymati. Ikki kalkulyator, bitta yozuv, ikki xil son. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
  {
    // Raskadrovka va kontent: src/books/grade7/DARS02_SKELET.md
    // Metodist qarorlari 2026-08-15: ishchi so'z «o'zgaruvchi», darslikka
    // havola yo'q, xuk sahnasi o'ziniki (RideScene).
    slug: 'dars02-ozgaruvchili-ifodalar',
    title: "Dars 2. O'zgaruvchili ifodalar",
    desc: "O'zgaruvchi — son uchun joy. Bitta yozuv, ko'p qiymat. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars02.jsx')),
  },
  {
    // Uchinchi marta bir xil manzara: bitta yozuv, ikki tartib -- lekin endi
    // BITTA son, faqat bir yo'l qisqa. Bu 1-darsni ham tushuntiradi.
    slug: 'dars03-amallar-xossalari',
    title: 'Dars 3. Arifmetik amallarning xossalari',
    desc: "Qiymat o'zgarmaydi, mehnat o'zgaradi. O'rin almashtirish, guruhlash, taqsimlash. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars03.jsx')),
  },
  {
    // NOLDAN qayta yozildi (metodist qarori 2026-08-15): eski 5-dars eski
    // yondashuvda edi va loyihadan olib tashlangan.
    // §1.3: qavs oldidagi ISHORA -- bu darsda; qavs oldidagi KO'PAYTUVCHI --
    // 3-darsda. Ular qo'shib yuborilmaydi.
    slug: 'dars05-qavslarni-ochish',
    title: 'Dars 5. Qavslarni ochish qoidasi',
    desc: "Minus qavsni o'chirmaydi, u har bir ishorani ag'daradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars05.jsx')),
  },
  {
    // ATAMA: RU «подобные слагаемые», UZ `o'xshash hadlar` (etalon §3.3).
    // Ko'phad bu darsda hali yo'q, shuning uchun «член» emas, «слагаемое».
    slug: 'dars06-oxshash-hadlar',
    title: "Dars 6. O'xshash hadlarni ixchamlash",
    desc: "Koeffitsiyentlar qo'shiladi, harf umumiy qoladi. Taqsimot xossasi teskari tomonga. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars06.jsx')),
  },
  {
    // B2 BLOKINING BIRINCHI DARSI. 2-darsning Z7 tegini yopadi: u yerda
    // o'zgaruvchi istalgan sonni qabul qilardi, bu yerda tenglik TANLAYDI.
    slug: 'dars07-tenglama-ildizi',
    title: 'Dars 7. Tenglama va uning ildizi',
    desc: "Ifoda hamma sonni qabul qiladi, tenglama esa bittasini tanlaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars07.jsx')),
  },
  {
    // BLOKNING ASBOBI shu darsda tug'iladi: `EquationBalance` -- tarozi,
    // unda «faqat bitta tomonga» degan tugma YO'Q. 7-darsda ildizni TANLAB
    // topgandik, bu yerda uni HISOBLAYMIZ.
    slug: 'dars08-chiziqli-tenglama',
    title: "Dars 8. Bir noma'lumli chiziqli tenglama",
    desc: "Amal ikkala tomonga birdan qo'llanadi. Uch holat: bitta ildiz, ildizi yo'q, cheksiz ko'p. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars08.jsx')),
  },
  {
    // AL-XORAZMIY USULI. Ko'chirish YANGI QOIDA EMAS: u 8-darsdagi
    // tarozining qisqa yozuvi. Asbob shu darsda kengaytirildi --
    // o'zgaruvchi endi ikkala tomonda ham tura oladi.
    slug: 'dars09-tenglamalarni-yechish',
    title: 'Dars 9. Chiziqli tenglamalarni yechish',
    desc: "Al-jabr va val-muqobala. Had ko'chadi -- ishora almashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars09.jsx')),
  },
  {
    // §10.2 YOPILDI. Darslikda modulli tenglamalar paragrafi yo'q, lekin
    // MODULNING TA'RIFI bor -- 6-bet: modul bu noldan uzoqlik. Butun dars
    // shu ta'rifdan chiqadi, tashqi manbadan emas.
    slug: 'dars10-modulli-tenglama',
    title: 'Dars 10. Modul qatnashgan chiziqli tenglama',
    desc: "Modul bu masofa. Bir xil masofada nuqta ikkita -- shuning uchun ildiz ham ikkita. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars10.jsx')),
  },
  {
    // Bu darsda tenglama YECHILMAYDI o'rganilmaydi -- u TUZILADI. Darslik
    // olti qadam beradi, va oxirgisi eng ko'p tashlab ketiladigan qadam:
    // savolga qaytish. Shuning uchun u alohida ekranda turadi.
    slug: 'dars11-masala-tenglama',
    title: 'Dars 11. Masalalarni tenglama yordamida yechish',
    desc: "Kattaliklar, harf, tenglama, savol. x topildi hali javob topildi degani emas. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars11.jsx')),
  },
  {
    // B2 BLOKINING OXIRGI DARSI. 11-darsdan farqi: u yerda ikkinchi kattalik
    // KO'PAYTIRISH bilan bog'langandi, bu yerda esa YIG'INDI ma'lum va
    // ikkinchisi ayirish bilan yoziladi. Ikkinchi harf kerak emas.
    slug: 'dars12-masala-tuzish',
    title: 'Dars 12. Tenglama tuzishga doir masalalar',
    desc: "Jami ma'lum bo'lsa, ikkinchisi 40 ayirish x. Aralashma va harakat. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars12.jsx')),
  },
  {
    // B3 BLOKINING BIRINCHI DARSI. Asbob: `FactorTape` -- muljitellar
    // lentasi. Daraja darslikda MULJITELLAR KO'PAYTMASI orqali ta'riflangan
    // (26-bet), lenta shu ta'rifni ekranga chiqaradi.
    // QIYINLIK DARAJASI: metodist qarori 2026-08-20 -- misollar harfli,
    // ishora va koeffitsiyent bilan; 2 karra 2 karra 2 kabi misollar yo'q.
    slug: 'dars13-daraja',
    title: "Dars 13. Natural ko'rsatkichli daraja",
    desc: "Ko'rsatkich muljitellarni sanaydi. Yig'indi koeffitsiyent beradi, ko'paytma ko'rsatkich. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars13.jsx')),
  },
  {
    // XOSSALAR YOD OLINMAYDI, ULAR SANALADI. Lenta guruhlarga bo'linadi
    // (yonma-yon -- qo'shish, takror -- ko'paytirish) va qisqaradi
    // (bo'lish). Uchta xossaning uchtasi ham sanoqdan chiqadi.
    slug: 'dars14-daraja-xossalari',
    title: 'Dars 14. Daraja xossalari',
    desc: "Ko'paytirishda qo'shiladi, bo'lishda ayiriladi, darajaning darajasida ko'paytiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars14.jsx')),
  },
  {
    // STANDART SHAKL = TARTIBLANGAN LENTA. Lenta endi ARALASH: sonlar va
    // harflar birga. Asbob lentada nima borligini sanaydi, yozuvni esa
    // o'quvchi yig'adi. Darsning o'zagi -- koeffitsiyent ishorasi:
    // darslik aniq aytadi, −b ning koeffitsiyenti (−1).
    slug: 'dars15-bir-had',
    title: 'Dars 15. Bir had va uning standart shakli',
    desc: "Sonlar ko'paytiriladi, harflar sanaladi, koeffitsiyent oldinda. −b ning koeffitsiyenti minus bir. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars15.jsx')),
  },
  {
    // BIRINCHI DARS OBVYAZKASIZ. `Frame` va ildiz komponent `core.jsx` ga
    // chiqarildi (`LessonFrame`, `createLesson`): ular 15 faylda bir xil
    // yozilgan edi. Bu darsda faqat MA'LUMOT bor.
    //
    // 2026-08-20: yozuv bir marta izohga olingan edi -- fayl kommit
    // qilinmagani uchun `vite build` butun loyiha bo'yicha yiqilardi.
    // Endi fayl ham, yozuv ham BITTA kommitda ketadi.
    slug: 'dars16-bir-hadlarni-kopaytirish',
    title: "Dars 16. Bir hadlarni ko'paytirish",
    desc: "Koeffitsiyentlar ko'paytiriladi, bir xil harflarning ko'rsatkichlari qo'shiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars16.jsx')),
  },
]

// 7-sinf AMALIY mashg'ulotlari. Har nazariy darsga 10 tekshiriladigan
// topshiriq. JOYLASHUV 1, 2 va 5-sinflardagi bilan BIR XIL (metodist qarori
// 2026-08-20):
//   practice/PracticeHost.jsx          -- qobiq, sinfga bitta
//   practice/darsNN/DNN_01..10.jsx     -- bitta topshiriq = bitta fayl
//   practice/darsNN/DarsNNPractice.jsx -- yig'uvchi, ro'yxat shuni chaqiradi
// Ya'ni darsga 11 jsx. Amaliyot ovozsiz ishlaydi.
//
// 7-SINFNING FARQI. Boshqa sinflarda amaliyot UMUMIY shakllardan yig'iladi
// (variant tanlash, kiritish, moslashtirish). Bu yerda unday QILINMAYDI:
// etalon §1.1 tayyor javobni tanlashni cheklaydi. Shuning uchun har
// topshiriqda o'quvchi O'ZI biror narsa qiladi: tartibni qo'yadi, uyani
// to'ldiradi, qatorni tuzatadi, yozuvni yig'adi, zonaga joylashtiradi
// (PODXOD_7SINF.md §9).
//
// 1-DARS AMALIYOTI. 2026-08-20 da to'liq qayta yig'ildi: tuzilma, uslub va
// jsx-question kontrakti 5-sinf amaliyotidan olindi (5-sinfning O'ZIGA
// tegilmadi), matematikasi esa 7-sinfning. Ilgari shu darsda boshqa to'plam
// turgan edi -- metodist uni olib tashlashga qaror qildi.
// Uch topshiriq (03, 04, 08) harfli ifodalar ustida. Metodist qarori
// 2026-08-20: qolsin, chunki bu YANGI material emas, TAKRORLASH -- 6-sinfda
// o'tilgan (shu kursning 31-darsi «Harfli ifodalar», 32-darsi «Qavslarni
// ochish», 33-darsi o'xshash hadlar). 7-sinf rejasida bu mavzular 2, 5 va
// 6-darslarda qaytadan, chuqurroq keladi.
export const grade7Amaliy = [
  {
    slug: 'dars01-amaliyot-sonli-ifodalar',
    title: 'Dars 1. Amaliyot: sonli ifodalar',
    desc: "10 topshiriq: amallar tartibi, qavs, o'nli va oddiy kasrlar, manfiy sonlar, harfli ifodalar. O'nta xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars01/Dars01Practice.jsx')),
  },
]
