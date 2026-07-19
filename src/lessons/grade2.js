import { lazy } from 'react'

// 2-sinf NAZARIY darslari (Dars01–39 kontent + takrorlash/nazorat). Yangi dars shu yerga qo'shiladi.
// Reja: Math_1-11_Поурочно_RUz.xlsx «2 класс» — 39 kontent (Новый) + 6 nazorat (ПК1,2,4,5,6 + ИК).
// ПК3 alohida emas: Dars18 «Mustahkamlash · o'rin almashish» Б3 yakunini ham bajaradi.
// Etalon kontrakt: src/books/grade2/ETALON_2SINF.md.
const grade2All = [
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
    slug: 'takrorlash-sayyora1',
    title: "Takrorlash — Sayyora 1 (1–6-darslar)",
    desc: "Б1 (Ochiq koinot) yakuni — takrorlash (1–6-darslar): nomerlash, taqqoslash, son o'qi. Yangi konsept yo'q.",
    Component: lazy(() => import('../components/grade2/takrorlash/Dars06R.jsx')),
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
    desc: "O'nlikdan o'tib qo'shish: birliklar 10 ga yetsa, 1 o'nlik ko'chadi (ustun + ko'chuvchi 1); 37 + 25 = 62.",
    Component: lazy(() => import('../components/grade2/Dars09.jsx')),
  },
  {
    slug: 'dars10-ayirish-otishli',
    title: "Dars 10. Ayirish (o'tishli)",
    desc: "O'nlikdan o'tib ayirish: birlik yetmasa, o'nlikdan qarz olinadi (ustun + qarz belgisi); 52 − 27 = 25.",
    Component: lazy(() => import('../components/grade2/Dars10.jsx')),
  },
  {
    slug: 'dars11-ustun-tuzish',
    title: "Dars 11. Ustun usuli (tuzish)",
    desc: "Ustun usulini to'g'ri tuzish: birlik ostiga birlik, o'nlik ostiga o'nlik; bir xonali son — birlik ustuniga (43 + 6).",
    Component: lazy(() => import('../components/grade2/Dars11.jsx')),
  },
  {
    slug: 'dars12-ikki-amalli-masala',
    title: "Dars 12. Ikki amalli masala",
    desc: "Ikki amalli masala: masalani bir amalda yechib bo'lmaydi — avval oraliq natija, keyin oxirgi javob (40 − 15 + 12 = 37).",
    Component: lazy(() => import('../components/grade2/Dars12.jsx')),
  },
  {
    slug: 'takrorlash-sayyora2',
    title: "Takrorlash — Sayyora 2 (7–12-darslar)",
    desc: "Б2 (Mars) yakuni — takrorlash (7–12-darslar): 100 ichida qo'shish/ayirish, ustun. Yangi konsept yo'q.",
    Component: lazy(() => import('../components/grade2/takrorlash/Dars12R.jsx')),
  },
  {
    slug: 'dars13-kopaytirish-manosi',
    title: "Dars 13. Ko'paytirish ma'nosi",
    desc: "Ko'paytirish — teng guruhlarni qo'shishning qisqa yo'li: teng qatorlar (R qator × C) → C+C+C = R × C (Yupiter dalasi).",
    Component: lazy(() => import('../components/grade2/Dars13.jsx')),
  },
  {
    slug: 'dars14-2-va-3-ga-kopaytirish',
    title: "Dars 14. 2 va 3 ga ko'paytirish jadvali",
    desc: "2 ga ikkitadan, 3 ga uchtadan skip-sanash: 2,4,6,8… va 3,6,9,12…; teng qatorlar massivi + jadvalning bo'sh katagini to'ldirish.",
    Component: lazy(() => import('../components/grade2/Dars14.jsx')),
  },
  {
    slug: 'dars15-4-va-5-ga-kopaytirish',
    title: "Dars 15. 4 va 5 ga ko'paytirish jadvali",
    desc: "4 ga to'rttadan, 5 ga beshtadan skip-sanash: 4,8,12,16… va 5,10,15,20… (oxiri 0/5); teng qatorlar massivi + jadvalning bo'sh katagini to'ldirish.",
    Component: lazy(() => import('../components/grade2/Dars15.jsx')),
  },
  {
    slug: 'dars16-6-va-7-ga-kopaytirish',
    title: "Dars 16. 6 va 7 ga ko'paytirish jadvali",
    desc: "6 ga oltitadan, 7 ga yettitadan skip-sanash: 6,12,18,24… va 7,14,21,28…; teng qatorlar massivi + jadvalning bo'sh katagini to'ldirish.",
    Component: lazy(() => import('../components/grade2/Dars16.jsx')),
  },
  {
    slug: 'dars17-8-va-9-ga-kopaytirish',
    title: "Dars 17. 8 va 9 ga ko'paytirish jadvali",
    desc: "8 ga sakkiztadan, 9 ga to'qqiztadan skip-sanash: 8,16,24,32… va 9,18,27,36… (×9 raqamlari yig'indisi 9); to'liq 1–9 jadval-yordamchisi.",
    Component: lazy(() => import('../components/grade2/Dars17.jsx')),
  },
  {
    slug: 'dars18-mustahkamlash-orin-almashish',
    title: "Dars 18. Mustahkamlash — o'rin almashish (a × b = b × a)",
    desc: "Ko'paytirish jadvalini mustahkamlash: o'rin almashish qonuni (a × b = b × a) — Б3 (Yupiter) yakuni.",
    Component: lazy(() => import('../components/grade2/Dars18.jsx')),
  },
  {
    slug: 'dars19-bolish-manosi',
    title: "Dars 19. Bo'lish ma'nosi",
    desc: "Bo'lish = teng ulashish (12 kristalni 3 hamrohga → har biriga 4) va guruhlash (nechta guruh); ×↔÷ oilasi: 3×4=12 → 12÷3=4, 12÷4=3. Saturn koni biomi.",
    Component: lazy(() => import('../components/grade2/Dars19.jsx')),
  },
  {
    slug: 'dars20-kopaytirish-bolish-boglanishi',
    title: "Dars 20. Ko'paytirish va bo'lish bog'lanishi",
    desc: "×↔÷ oilasi: bitta massiv (3×4=12) bitta ko'paytirish va ikki bo'lish beradi (12÷3=4, 12÷4=3); oiladagi yo'q a'zoni topish + moslash. Saturn saralash biomi.",
    Component: lazy(() => import('../components/grade2/Dars20.jsx')),
  },
  {
    slug: 'dars21-2-va-3-ga-bolish',
    title: "Dars 21. 2 ga va 3 ga bo'lish",
    desc: "÷2 va ÷3 jadvali: son o'qida orqaga sakrash (12−2−2−…=0), ÷-jadval qatorini to'ldirish, ×↔÷ oila orqali topish — aralash. Saturn kon-relslari biomi.",
    Component: lazy(() => import('../components/grade2/Dars21.jsx')),
  },
  {
    slug: 'dars22-4-va-5-ga-bolish',
    title: "Dars 22. 4 ga va 5 ga bo'lish",
    desc: "÷4 va ÷5 jadvali: son o'qida orqaga 4/5 talik sakrash, ÷-jadval qatorini to'ldirish, ×↔÷ oila orqali topish — aralash. Saturn kon-relslari biomi.",
    Component: lazy(() => import('../components/grade2/Dars22.jsx')),
  },
  {
    slug: 'dars23-6-7-8-9-ga-bolish',
    title: "Dars 23. 6, 7, 8 va 9 ga bo'lish",
    desc: "Bo'lish jadvalining finali (÷6–9): son o'qida orqaga sakrash, ÷-jadval qatorini to'ldirish, ×↔÷ oila orqali topish — aralash. Saturn kon-relslari biomi.",
    Component: lazy(() => import('../components/grade2/Dars23.jsx')),
  },
  {
    slug: 'dars24-bolishga-masalalar',
    title: "Dars 24. Bo'lishga masalalar",
    desc: "Hayotiy masalalar: teng ulashish/guruhlash → bo'lish; «qaysi amal? ×/÷» tanlash + hisob. Syujet+viz va amal-tanlash aralash. Saturn lager biomi.",
    Component: lazy(() => import('../components/grade2/Dars24.jsx')),
  },
  {
    slug: 'takrorlash-sayyora4',
    title: "Takrorlash — Sayyora 4 (19–24-darslar)",
    desc: "Б4 (Saturn) yakuni — bo'lish bloki takrorlash (19–24-darslar). Yangi konsept yo'q.",
    Component: lazy(() => import('../components/grade2/takrorlash/Dars24R.jsx')),
  },
  {
    slug: 'dars25-nur-togri-chiziq-kesma',
    title: "Dars 25. Nur, to'g'ri chiziq, kesma",
    desc: "Geometriya boshi (Б5 Uran): chiziq turlarini uch soni bo'yicha farqlash — to'g'ri chiziq (0 uch), nur (1 uch), kesma (2 uch); hayotiy langar (temir yo'l/fonar/stol).",
    Component: lazy(() => import('../components/grade2/Dars25.jsx')),
  },
  {
    slug: 'dars26-kopburchaklar',
    title: "Dars 26. Ko'pburchaklar",
    desc: "Ko'pburchaklarni tomon soni bo'yicha tanish (Б5 Uran): uchburchak (3), to'rtburchak (4), beshburchak (5), oltiburchak (6); tomon=burchak soni; doira/ochiq chiziq — ko'pburchak emas. Nom-tanish + tomon-sanash + shakl→nom drag-moslash aralash.",
    Component: lazy(() => import('../components/grade2/Dars26.jsx')),
  },
  {
    slug: 'dars27-uzunlik-sm-dm-m',
    title: "Dars 27. Uzunlik: sm, dm, m",
    desc: "Uzunlik o'lchash (Б5 Uran ustaxonasi): chizg'ich bilan santimetr o'qish (0 ga to'g'irlab), 1 dm = 10 sm, 1 m = 100 sm, qaysi buyumga qaysi birlik. Chizg'ich-o'qish + birlik-tanlash + o'girish aralash.",
    Component: lazy(() => import('../components/grade2/Dars27.jsx')),
  },
  {
    slug: 'dars28-perimetr',
    title: "Dars 28. Perimetr",
    desc: "Perimetr — shakl chetini bo'ylab barcha tomonlar yig'indisi (Б5 Uran, geoboard): panjarada birlik-kesmalarni sanash yoki raqamlangan tomonlarni qo'shish. Yuza YO'Q — faqat chet. Geoboard-sanash + tomonlar-yig'indisi aralash.",
    Component: lazy(() => import('../components/grade2/Dars28.jsx')),
  },
  {
    slug: 'dars29-shakl-yasash',
    title: "Dars 29. Shakl yasash",
    desc: "Berilgan o'lchamga qarab shakl yasash (Б5 Uran maketa): eni va bo'yini kataklab sozlab to'rtburchak qurish yoki o'lchamga mos shaklni tanlash. Stepper-yasash + o'lchamга-mos-tanlash aralash.",
    Component: lazy(() => import('../components/grade2/Dars29.jsx')),
  },
  {
    slug: 'takrorlash-sayyora5',
    title: "Takrorlash — Sayyora 5 (25–29-darslar)",
    desc: "Б5 (Uran) yakuni — geometriya bloki takrorlash (25–29-darslar). Yangi konsept yo'q.",
    Component: lazy(() => import('../components/grade2/takrorlash/Dars29R.jsx')),
  },
  {
    slug: 'dars30-sonli-harfli-ifoda',
    title: "Dars 30. Sonli va harfli ifodalar",
    desc: "Б6 boshi (Neptun stansiyasi): sonli ifoda (3+5) va harfli ifoda (a+5). Harf — ichiga son qo'yiladigan «oyna»: a=2 bo'lsa a+5 = 7. Bitta ifoda, har xil son → har xil qiymat. Oynaga son qo'yish + sonli/harfli ajratish + so'zga mos ifodani tanlash.",
    Component: lazy(() => import('../components/grade2/Dars30.jsx')),
  },
  {
    slug: 'dars31-tenglamalar',
    title: "Dars 31. Tenglamalar",
    desc: "Б6 (Neptun stansiyasi): noma'lumni topish. x+4=9 — x «yashirin son». Tenglama = ikki teng tomon (tarozi). Noma'lumni topish uchun natijadan ma'lumni ol (teskari amal), keyin qo'yib tekshir. Tarozi + yashirin oyna + qo'yib-tekshirish mashqlari.",
    Component: lazy(() => import('../components/grade2/Dars31.jsx')),
  },
  {
    slug: 'dars32-ulushlar',
    title: "Dars 32. Ulushlar (доли)",
    desc: "Б6 (Neptun stansiyasi): ulush — butunning teng qismlaridan biri. Butunni N ta teng qismga bo'l, bittasini bo'ya → «bir Ndan». Faqat birlik ulush; teng qism sharti; ko'proq qism → kichikroq ulush (bir ikkidan > bir to'rtdan). Nomlash + shakl tanlash + solishtirish.",
    Component: lazy(() => import('../components/grade2/Dars32.jsx')),
  },
  {
    slug: 'dars33-vaqt-soat',
    title: "Dars 33. Vaqt (soat va daqiqa)",
    desc: "Б6 (Neptun stansiyasi): soatga qarab vaqtni o'qish. Kalta strelka — soat, uzun — daqiqa (har raqam = 5 daqiqa). Butun soat, yarim (30), chorak (15), 5-daqiqalik. Analog↔raqamli moslash. Ulush ko'prigi: yarim soat = siferblat yarmi.",
    Component: lazy(() => import('../components/grade2/Dars33.jsx')),
  },
  {
    slug: 'dars34-kalendar',
    title: "Dars 34. Kalendar (kun, hafta, oy)",
    desc: "Б6 (Neptun stansiyasi, bort jurnali): hafta kunlari (7, tartib bilan), oylar (12), sana↔hafta kuni. Kecha/bugun/erta. Kalendar-katakni o'qish. Hafta = 7 kun, oy ≈ 30 kun, yil = 12 oy.",
    Component: lazy(() => import('../components/grade2/Dars34.jsx')),
  },
  {
    slug: 'dars35-pul',
    title: "Dars 35. Pul (tanga bilan hisob)",
    desc: "Б6 (Neptun stansiyasi, almashuv): pulni qiymat bo'yicha sanash. Har tangada qiymat bor (dona emas). Nominal 100/200/500 so'm tanga + 1000 so'm banknota. Summani yig'ish, qaysi to'plamda ko'p. Ko'p tanga ≠ ko'p pul.",
    Component: lazy(() => import('../components/grade2/Dars35.jsx')),
  },
  {
    slug: 'dars36-kattaliklarga-masala',
    title: "Dars 36. Kattaliklarga masala",
    desc: "Б6 (Neptun stansiyasi): vaqt, pul, uzunlik bo'yicha matnli masalalar. Nima berilgan, nima so'ralgan — amalni tanla (ko'paydi→qo'shish, kamaydi→ayirish), javobni birlik bilan yoz. Б6 sintez darsi.",
    Component: lazy(() => import('../components/grade2/Dars36.jsx')),
  },
  {
    slug: 'dars37-mantiq',
    title: "Dars 37. Mantiq",
    desc: "Б6 (Neptun stansiyasi): mantiqiy fikrlash. Naqsh-davomi (qoidani top), ortiqchani top (umumiy belgi), sodda xulosa (katta/kichik, oldin/keyin). Rangli shakllar va sonli naqshlar.",
    Component: lazy(() => import('../components/grade2/Dars37.jsx')),
  },
  {
    slug: 'dars38-malumotlar',
    title: "Dars 38. Ma'lumotlar bilan ishlash",
    desc: "Б6 (Neptun stansiyasi): piktogramma va jadval o'qish. 1 rasm = 1 birlik — sanash, solishtirish (qaysi ko'p/kam), jami, farq. Ma'lumotni ikki ko'rinishda o'qish.",
    Component: lazy(() => import('../components/grade2/Dars38.jsx')),
  },
  {
    slug: 'dars39-takrorlash',
    title: "Dars 39. Takrorlash",
    desc: "Б6 (Neptun) takrorlash darsi — ifoda, tenglama, ulush, vaqt, pul, ma'lumot jamlanmasi.",
    Component: lazy(() => import('../components/grade2/Dars39.jsx')),
  },
  {
    slug: 'takrorlash-sayyora6-pk',
    title: "Takrorlash + ПК6 — Sayyora 6 (30–39-darslar)",
    desc: "Б6 (Neptun) yakuni + ПК6 nazorati (30–39-darslar).",
    Component: lazy(() => import('../components/grade2/nazorat/Dars39R.jsx')),
  },
  {
    slug: 'yakuniy-nazorat',
    title: "Yakuniy nazorat — butun kurs",
    desc: "Butun 2-sinf yakuniy nazorati — barcha bloklardan aralash (ИК). Kosmik missiya yakuni.",
    Component: lazy(() => import('../components/grade2/nazorat/Dars39IK.jsx')),
  },
]

// 2-sinf AMALIY mashqlari (10 topshiriq, grade1/grade5 uslubi — per-task jsx + PracticeHost).
export const grade2Amaliy = [
  {
    slug: 'dars01-amaliyot',
    title: "Dars 1 amaliyoti — O'nliklar va birliklar (10 topshiriq)",
    desc: "O'nliklar va birliklar — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars01/Dars01Practice.jsx')),
  },
  {
    slug: 'dars02-amaliyot',
    title: "Dars 2 amaliyoti — Sonlarni o'qish va yozish (10 topshiriq)",
    desc: "Sonlarni o'qish va yozish — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars02/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-amaliyot',
    title: "Dars 3 amaliyoti — Sonning razryad tarkibi (10 topshiriq)",
    desc: "Sonning razryad tarkibi — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars03/Dars03Practice.jsx')),
  },
  {
    slug: 'dars04-amaliyot',
    title: "Dars 4 amaliyoti — Sonlarni taqqoslash (10 topshiriq)",
    desc: "Sonlarni taqqoslash — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars04/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot',
    title: "Dars 5 amaliyoti — O'nlab sanash (10 topshiriq)",
    desc: "O'nlab sanash — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars05/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot',
    title: "Dars 6 amaliyoti — Son o'qi (10 topshiriq)",
    desc: "Son o'qi — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars06/Dars06Practice.jsx')),
  },
  {
    slug: 'dars07-amaliyot',
    title: "Dars 7 amaliyoti — Qo'shish (o'tishsiz) (10 topshiriq)",
    desc: "Qo'shish (o'tishsiz) — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars07/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot',
    title: "Dars 8 amaliyoti — Ayirish (o'tishsiz) (10 topshiriq)",
    desc: "Ayirish (o'tishsiz) — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars08/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot',
    title: "Dars 9 amaliyoti — Qo'shish (o'tishli) (10 topshiriq)",
    desc: "Qo'shish (o'tishli) — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars09/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot',
    title: "Dars 10 amaliyoti — Ayirish (o'tishli) (10 topshiriq)",
    desc: "Ayirish (o'tishli) — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars10/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-amaliyot',
    title: "Dars 11 amaliyoti — Stolbik tuzish (10 topshiriq)",
    desc: "Stolbik tuzish — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars11/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-amaliyot',
    title: "Dars 12 amaliyoti — Ikki amalli masala (10 topshiriq)",
    desc: "Ikki amalli masala — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars12/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot',
    title: "Dars 13 amaliyoti — Ko'paytirish ma'nosi (10 topshiriq)",
    desc: "Ko'paytirish ma'nosi — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars13/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot',
    title: "Dars 14 amaliyoti — 2 va 3 ga ko'paytirish (10 topshiriq)",
    desc: "2 va 3 ga ko'paytirish — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars14/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-amaliyot',
    title: "Dars 15 amaliyoti — 4 va 5 ga ko'paytirish (10 topshiriq)",
    desc: "4 va 5 ga ko'paytirish — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars15/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot',
    title: "Dars 16 amaliyoti — ×6 va ×7 jadvali (10 topshiriq)",
    desc: "×6 va ×7 jadvali — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars16/Dars16Practice.jsx')),
  },
  {
    slug: 'dars17-amaliyot',
    title: "Dars 17 amaliyoti — ×8 va ×9 jadvali (10 topshiriq)",
    desc: "×8 va ×9 jadvali — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars17/Dars17Practice.jsx')),
  },
  {
    slug: 'dars18-amaliyot',
    title: "Dars 18 amaliyoti — Mustahkamlash · o'rin almashish (a × b = b × a) (10 topshiriq)",
    desc: "O'rin almashish (a × b = b × a) — ko'paytirish jadvalini mustahkamlash, 10 ta interaktiv topshiriq.",
    Component: lazy(() => import('../components/grade2/practice/dars18/Dars18Practice.jsx')),
  },
  {
    slug: 'dars19-amaliyot',
    title: "Dars 19 amaliyoti — Bo'lish ma'nosi (teng ulash) (10 topshiriq)",
    desc: "Bo'lish ma'nosi (teng ulash) — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars19/Dars19Practice.jsx')),
  },
  {
    slug: 'dars20-amaliyot',
    title: "Dars 20 amaliyoti — Ko'paytirish va bo'lish bog'lanishi (10 topshiriq)",
    desc: "Ko'paytirish va bo'lish bog'lanishi — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: lazy(() => import('../components/grade2/practice/dars20/Dars20Practice.jsx')),
  },
]

// Sayt bo'limlari (papka tuzilishiga mos): kontent / takrorlash / nazorat
export const grade2Nazariy = grade2All.filter((l) => !/^takrorlash-sayyora\d+$/.test(l.slug) && l.slug !== 'yakuniy-nazorat' && !/-pk$/.test(l.slug))
export const grade2Takrorlash = grade2All.filter((l) => /^takrorlash-sayyora\d+$/.test(l.slug))
export const grade2Nazorat = grade2All.filter((l) => l.slug === 'yakuniy-nazorat' || /-pk$/.test(l.slug))
