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
    slug: 'dars09-kopaytirish-jadvali',
    title: "Dars 9. Ko'paytirish jadvali",
    desc: "Ko'paytirish — teng guruhlarning qisqa yozuvi; massiv (satr × ustun); ko'paytuvchilarni o'rin almashtirish mumkin.",
    Component: lazy(() => import('../components/grade3/Dars09.jsx')),
  },
  {
    slug: 'dars10-kopaytirish-bolish-10-100',
    title: "Dars 10. 10 va 100 ga ko'paytirish va bo'lish",
    desc: "x10 da raqamlar bir xona chapga ko'chadi (birlikka nol), x100 — ikki xona; bo'lish — teskari yo'l (450÷10=45).",
    Component: lazy(() => import('../components/grade3/Dars10.jsx')),
  },
  {
    slug: 'dars11-yigindini-kopaytirish',
    title: "Dars 11. Yig'indini ko'paytirish",
    desc: "Jadval 10 da tugaydi: sonni xona qo'shiluvchilariga bo'lib, har birini ko'paytiramiz va qo'shamiz ((20+3)×4 = 80+12 = 92); bonus — ustun ko'prigi.",
    Component: lazy(() => import('../components/grade3/Dars11.jsx')),
  },
  {
    slug: 'dars12-yigindini-bolish',
    title: "Dars 12. Yig'indini bo'lish",
    desc: "Bo'linuvchini bo'linadigan qismlarga bo'lib, har birini bo'lamiz va bo'linmalarni qo'shamiz (96 : 3 = 30 + 2 = 32); bonus — burchak usuli ko'prigi.",
    Component: lazy(() => import('../components/grade3/Dars12.jsx')),
  },
  {
    slug: 'dars13-amallar-tartibi',
    title: "Dars 13. Amallar tartibi",
    desc: "Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish; 3 + 6 × 2 = 15, (3 + 6) × 2 = 18; bonus — ustunda ko'paytirish, qo'shish va ayirish.",
    Component: lazy(() => import('../components/grade3/Dars13.jsx')),
  },
  {
    slug: 'dars14-komponentlar-boglanishi',
    title: "Dars 14. Ko'paytirish va bo'lishning bog'lanishi",
    desc: "Bitta uchlik son to'rt yozuv beradi (5 × 8 = 40, 40 : 5 = 8, 40 : 8 = 5); noma'lum ko'paytuvchi bo'lish bilan topiladi; bo'lish ko'paytirish bilan, ko'paytirish bo'lish bilan tekshiriladi; bonus — x harfi.",
    Component: lazy(() => import('../components/grade3/Dars14.jsx')),
  },
  {
    slug: 'dars15-masalalar',
    title: "Dars 15. Ko'paytirish va bo'lishga masalalar",
    desc: "Masaladagi so'z amalni tanlaydi: «marta ko'p» — ko'paytirish, «marta kam» — bo'lish, «necha marta ko'p» — kattani kichigiga bo'lish; darslik jadvali «bittasiga — soni — jami»; bonus — ikki qadamli masala va xatoni topish.",
    Component: lazy(() => import('../components/grade3/Dars15.jsx')),
  },
  {
    slug: 'dars16-boluvchilar-karralilar',
    title: "Dars 16. Bo'luvchilar va karrali sonlar",
    desc: "Son qoldiqsiz bo'linadigan sonlar — uning bo'luvchilari (12 uchun 1, 2, 3, 4, 6, 12); ko'paytirishdan chiqadigan sonlar — karralilar (3, 6, 9, 12); bir va sonning o'zi doim bo'luvchi; bonus — qaysi sonning bo'luvchilari ko'p.",
    Component: lazy(() => import('../components/grade3/Dars16.jsx')),
  },
  {
    slug: 'dars17-ikki-xonali-kopaytirish',
    title: "Dars 17. Ikki xonali sonni bir xonaliga ko'paytirish",
    desc: "Sonni qismlarga ajratib ko'paytirish (23 · 4 = 20 · 4 + 3 · 4 = 92) — yig'indini ko'paytirishning davomi; bir xonali birinchi tursa, o'rin almashtiriladi (3 · 27 = 27 · 3). reja satri 18 (nazorat) o'tkazildi — metodist qarori.",
    Component: lazy(() => import('../components/grade3/Dars17.jsx')),
  },
  {
    slug: 'dars18-ikki-xonalini-bolish',
    title: "Dars 18. Ikki xonali sonni bir xonaliga bo'lish",
    desc: "Sonni bo'linadigan qismlarga ajratib bo'lish: 86 : 2 = (80 + 6) : 2 = 43, xonalar to'g'ri kelmasa boshqa qism olinadi (42 : 3 = (30 + 12) : 3 = 14); bonus — ikki xonali bo'luvchi (36 : 12) podbor bilan.",
    Component: lazy(() => import('../components/grade3/Dars18.jsx')),
  },
  {
    slug: 'dars19-qoldiqli-bolish',
    title: "Dars 19. Qoldiqli bo'lish",
    desc: "Teng tarqatib bo'lmasa, ortgani qoldiq bo'ladi (11 : 2 = 5, qoldiq 1); qoldiq doim bo'luvchidan kichik, aks holda yana bittadan tarqatish mumkin; bonus — ikki xonali bo'luvchi (95 : 12) podbor bilan.",
    Component: lazy(() => import('../components/grade3/Dars19.jsx')),
  },
  {
    slug: 'dars20-qoldiqli-tekshirish',
    title: "Dars 20. Qoldiqli bo'lishni tekshirish",
    desc: "Bo'linmani bo'luvchiga ko'paytirib, qoldiqni qo'shamiz (31 : 7 = 4, qoldiq 3, tekshiruv 4 · 7 + 3 = 31); ko'paytirish bo'lish bilan tekshiriladi; tekshiruv mos kelsa ham qoldiq bo'luvchidan kichik bo'lishi shart.",
    Component: lazy(() => import('../components/grade3/Dars20.jsx')),
  },
  {
    slug: 'dars21-ustunda-kopaytirish',
    title: "Dars 21. Yozma usul: ustun",
    desc: "Ustunda ko'paytirish: ikkinchi ko'paytuvchi birliklar tagiga yoziladi, hisob o'ngdan chapga boradi, har ko'paytma o'z xonasi tagiga tushadi (123 · 3 = 369); o'nlikdan o'tganda zaxira o'z xonasi ustida saqlanadi (328 · 3 = 984).",
    Component: lazy(() => import('../components/grade3/Dars21.jsx')),
  },
  {
    slug: 'dars22-ikki-xonaliga-kopaytirish',
    title: "Dars 22. Ikki xonalini ikki xonaliga ko'paytirish",
    desc: "Ikkinchi ko'paytuvchini o'nlik va birlikka ajratib ko'paytirish (12 · 15 = 12 · 10 + 12 · 5 = 180); birinchi son butunicha olinadi; katak to'r modeli ikki bo'lakni ko'rsatadi.",
    Component: lazy(() => import('../components/grade3/Dars22.jsx')),
  },
  {
    slug: 'dars23-ikki-amalli-masalalar',
    title: "Dars 23. Ikki amalli masalalar",
    desc: "Tarkibli masala: avval darrov topiladigani topiladi, keyin savolga aynan javob beriladi (45 + 54 = 99, 99 : 8 = 12 va 3 qoldiq); bo'linma yashiklarni, qoldiq esa sig'maganini sanaydi.",
    Component: lazy(() => import('../components/grade3/Dars23.jsx')),
  },
  {
    slug: 'dars24-ulush-va-kasr-yozuvi',
    title: "Dars 24. Butunning ulushi va uning yozuvi",
    desc: "Butun teng bo'laklarga bo'linadi va ulush paydo bo'ladi (1 : 2 = 1/2); chiziq tagida maxraj — nechtaga bo'lingani, ustida surat — nechtasi olingani; ulush har doim o'z butunidan.",
    Component: lazy(() => import('../components/grade3/Dars24.jsx')),
  },
  {
    slug: 'dars25-maxrajlar-oilasi',
    title: "Dars 25. Maxrajlar oilasi",
    desc: "Bitta tasma turlicha kesiladi: bo'lak ko'p bo'lsa, har biri kichik; surat birdan katta bo'lishi mumkin (5/8); maxrajlar oilasi 2, 4, 8 va 3, 6, 12.",
    Component: lazy(() => import('../components/grade3/Dars25.jsx')),
  },
  {
    slug: 'dars26-ulushlarni-taqqoslash',
    title: "Dars 26. Ulushlarni taqqoslash",
    desc: "Bitta butunning ulushlari maxraj bo'yicha taqqoslanadi: maxraj kichik bo'lsa ulush yirik (1/4 > 1/8); belgi katta ulush tomonga ochiladi; butunlar boshqa bo'lsa qoida ishlamaydi.",
    Component: lazy(() => import('../components/grade3/Dars26.jsx')),
  },
  {
    slug: 'dars27-sonning-ulushi',
    title: "Dars 27. Sonning ulushi",
    desc: "Sonning ulushi ikki qadamda topiladi: avval maxrajga bo'lib bitta bo'lakni bilamiz, keyin suratga ko'paytiramiz (9 : 3 · 2 = 6); qism har doim butundan kichik.",
    Component: lazy(() => import('../components/grade3/Dars27.jsx')),
  },
  {
    slug: 'dars28-butundan-katta-kasrlar',
    title: "Dars 28. Butundan katta kasrlar",
    desc: "Surat maxrajdan kichik bo'lsa kasr to'g'ri, katta bo'lsa noto'g'ri, teng bo'lsa bir; noto'g'ri kasr butun va qoldiq ko'rinishida o'qiladi (5/4 = 1 butun 1/4).",
    Component: lazy(() => import('../components/grade3/Dars28.jsx')),
  },
  {
    slug: 'dars29-kasrlarni-taqqoslash',
    title: "Dars 29. Kasrlarni taqqoslash",
    desc: "Avval nima mos kelganiga qaraymiz: maxraj mos kelsa suratlarni sanaymiz (3/8 < 5/8), surat mos kelsa maxrajlarga qaraymiz (2/3 > 2/5), hech nima mos kelmasa yarim bilan solishtiramiz.",
    Component: lazy(() => import('../components/grade3/Dars29.jsx')),
  },
  {
    slug: 'dars30-kasrlarni-qoshish',
    title: "Dars 30. Kasrlarni qo'shish va ayirish",
    desc: "Maxraji bir xil kasrlarda faqat suratlar qo'shiladi va ayiriladi (2/8 + 3/8 = 5/8), maxraj o'zgarmaydi; surat maxrajga tenglashsa, javob butunga teng.",
    Component: lazy(() => import('../components/grade3/Dars30.jsx')),
  },
  {
    slug: 'dars31-onli-kasrlar',
    title: "Dars 31. O'nli kasrlar",
    desc: "Vergul butunni ulushdan ajratadi: 1/10 = 0,1, 3/10 = 0,3; verguldan keyingi raqam o'ndan bo'laklarni sanaydi, oldidagi nol butun yo'qligini aytadi; taqqoslash ulush bo'yicha, raqam soniga qarab emas.",
    Component: lazy(() => import('../components/grade3/Dars31.jsx')),
  },
  {
    slug: 'dars32-ulushga-doir-masalalar',
    title: "Dars 32. Ulushga doir masalalar",
    desc: "Masala savoli amalni tanlaydi: butun ma'lum bo'lsa maxrajga bo'lamiz, ulush ma'lum bo'lsa maxrajga ko'paytiramiz (3 · 4 = 12); tekshirish teskari amal bilan.",
    Component: lazy(() => import('../components/grade3/Dars32.jsx')),
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
  {
    slug: 'dars04-amaliyot',
    title: "Dars 4 amaliyoti — Uch xonali sonlarni taqqoslash (10 topshiriq)",
    desc: "Belgi qo'yish (> < =), tuzoq-juftlar (600/599, 519/591), saralash, minoralar masalasi, eng katta son yasash — darslik misollarida.",
    Component: lazy(() => import('../components/grade3/practice/dars04/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot',
    title: "Dars 5 amaliyoti — Eng yaqin yumaloq son (10 topshiriq)",
    desc: "Yumaloq o'nlik va yuzlikni tanlash: chiziqda topish, o'rtadagi son (45, 350), ikki qadam, taxminiy hisob — darslik sonlarida.",
    Component: lazy(() => import('../components/grade3/practice/dars05/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot',
    title: "Dars 6 amaliyoti — Son o'qida son (10 topshiriq)",
    desc: "O'qni o'qish (katta belgi — yuzlik, kichigi — o'nlik), oraliqlar, yo'nalish, harakat, A/B/C nuqtalar — darslik 50-bet mashqi bilan.",
    Component: lazy(() => import('../components/grade3/practice/dars06/Dars06Practice.jsx')),
  },
  {
    slug: 'dars07-amaliyot',
    title: "Dars 7 amaliyoti — Yozma qo'shish va ayirish (10 topshiriq)",
    desc: "Ustun shakli: to'g'ri yozuv, o'tkazish va qarz (bir va ikki marta), xatoni topish, ikki qadamli masala — darslik misollarida.",
    Component: lazy(() => import('../components/grade3/practice/dars07/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot',
    title: "Dars 8 amaliyoti — Rim raqamlari (10 topshiriq)",
    desc: "I V X L C belgilari: o'qish, belgi-kartalardan yasash (XXIII, IX), chapda-ayirish tuzoqlari, oylar rim raqamida — darslik 88-89-betlari asosida.",
    Component: lazy(() => import('../components/grade3/practice/dars08/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot',
    title: "Dars 9 amaliyoti — Ko'paytirish jadvali (10 topshiriq)",
    desc: "3-sinf ko'paytirish formatlarida: savatlar, og'zaki, o'rin almashtirish, yo'qolgan son, qulay usul, teskari jadval — darslik uzum masalasi bilan.",
    Component: lazy(() => import('../components/grade3/practice/dars09/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot',
    title: "Dars 10 amaliyoti — 10 va 100 ga ko'paytirish va bo'lish (10 topshiriq)",
    desc: "Razryad siljishi, nol qatnashgan sonlar, teskari amal, yo'qolgan ko'paytuvchi va 10/100 ga doir transfer — to'rt xil interaksiya bilan.",
    Component: lazy(() => import('../components/grade3/practice/dars10/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-amaliyot',
    title: "Dars 11 amaliyoti — Yig'indini ko'paytirish (10 topshiriq)",
    desc: "Sonni o'nlik va birlikka yoyish, qismlarni ko'paytirish, qadamlarni tartiblash, teskari yozuv va tipik xatoni tuzatish.",
    Component: lazy(() => import('../components/grade3/practice/dars11/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-amaliyot',
    title: "Dars 12 amaliyoti — Yig'indini bo'lish (10 topshiriq)",
    desc: "Qoldiqsiz bo'linadigan qulay qismlar, teskari tekshiruv, noma'lum qism, teng taqsimlash va noto'g'ri yoyilmani tahlil qilish.",
    Component: lazy(() => import('../components/grade3/practice/dars12/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot',
    title: "Dars 13 amaliyoti — Amallar tartibi (10 topshiriq)",
    desc: "Qavs, ko'paytirish-bo'lish ustunligi, ikki qadamli masala, teng ifodalar va chapdan o'ngga ko'r-ko'rona hisoblash xatosi.",
    Component: lazy(() => import('../components/grade3/practice/dars13/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot',
    title: "Dars 14 amaliyoti — Komponentlar bog'lanishi (10 topshiriq)",
    desc: "Ko'paytma va bo'linma komponentlari, noma'lum son, to'rtta tenglik oilasi, nol holati va teskari amal bilan tekshirish.",
    Component: lazy(() => import('../components/grade3/practice/dars14/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-amaliyot',
    title: "Dars 15 amaliyoti — Ko'paytirish va bo'lishga masalalar (10 topshiriq)",
    desc: "Teng guruh va teng taqsimlash modeli, masala qadamlari, amal tanlash, ikki qadamli vaziyat, birlik va mantiqiy tekshiruv.",
    Component: lazy(() => import('../components/grade3/practice/dars15/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot',
    title: "Dars 16 amaliyoti — Bo'luvchilar va karrali sonlar (10 topshiriq)",
    desc: "Bo'luvchilar jufti, karralilar qatori, umumiy karrali, qoldiq bilan tekshirish va teng qatorlarga joylash masalalari.",
    Component: lazy(() => import('../components/grade3/practice/dars16/Dars16Practice.jsx')),
  },
  {
    slug: 'dars17-amaliyot',
    title: "Dars 17 amaliyoti — Ikki xonali sonni ko'paytirish (10 topshiriq)",
    desc: "O'nlik va birlikni alohida ko'paytirish, algoritm qadamlari, noma'lum son, nol birlik, xato tahlili va natijani taxminlash.",
    Component: lazy(() => import('../components/grade3/practice/dars17/Dars17Practice.jsx')),
  },
  {
    slug: 'dars18-amaliyot',
    title: "Dars 18 amaliyoti — Ikki xonali sonni bo'lish (10 topshiriq)",
    desc: "Qulay bo'linadigan qismlar, qadamli algoritm, noma'lum qism, teng taqsimlash, xato tahlili va ko'paytirish bilan tekshiruv.",
    Component: lazy(() => import('../components/grade3/practice/dars18/Dars18Practice.jsx')),
  },
  {
    slug: 'dars19-amaliyot',
    title: "Dars 19 amaliyoti — Qoldiqli bo'lish (10 topshiriq)",
    desc: "Qoldiq va bo'linmani topish, teskari yozuv, tekshiruv, chegara holati, xato tahlili va ustaxona masalasi.",
    Component: lazy(() => import('../components/grade3/practice/dars19/Dars19Practice.jsx')),
  },
]
