import { lazy } from 'react'

// 10-sinf darslari. Reja: src/books/grade10/DARSLAR_REJASI_10SINF.md (53 dars).
// Yondashuv: src/books/grade10/PODXOD_10SINF.md — avval asboblar, keyin darslar.
// Yadro `components/grade10/core.jsx`, asboblar `components/grade10/tools.jsx`.
//
// ISHLAB CHIQARISH tartibi dars raqami bo'yicha EMAS, asbob bo'yicha bo'ldi:
// pilot = 3-dars, keyin 1, 2, 4, 5, 6, keyin 8, 9, 10, oxirida 7.
//
// RO'YXAT esa RAQAM bo'yicha turadi (metodist qarori 2026-08-14): saytda dars
// uchinchidan boshlanardi, va bu o'quvchi uchun tartibsizlik edi. Ishlab
// chiqarish tartibi bilan ko'rsatish tartibi bir narsa emas.
//
// Darsda faqat MA'LUMOT bo'ladi: o'ram `components/grade10/screens.jsx` da.
// Yangi dars karkasi buyruq bilan yasaladi:
//   node scripts/grade10-new-lesson.mjs <raqam> <slug> "<tema UZ>" "<tema EN>"
export const grade10Nazariy = [
{
    slug: 'dars01-radianlar',
    title: 'Dars 1. Radianlar',
    desc: "Burchak yoy uzunligi bilan o'lchanadi: radiusni yoy bo'ylab yotqizamiz. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars01.jsx')),
  },
{
    slug: 'dars02-sin-cos-tg',
    title: 'Dars 2. sin/cos/tg',
    desc: 'Nuqtaning koordinatalari: birinchi son kosinus, ikkinchisi sinus, nisbati tangens. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars02.jsx')),
  },
{
    slug: 'dars03-trigonometrik-doira',
    title: 'Dars 3. Trigonometrik doira',
    desc: 'Birlik aylana: nuqta koordinatalari kosinus va sinus. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars03.jsx')),
  },
{
    slug: 'dars04-ishoralar-qiymatlar',
    title: 'Dars 4. Ishoralar va qiymatlar',
    desc: "Ishora bu yo'nalish, yodlangan qoida emas. Choraklar, tangens ishorasi, o'tkir burchakka keltirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars04.jsx')),
  },
{
    slug: 'dars05-juftlik-davr',
    title: 'Dars 5. Juftlik va davr',
    desc: "Ko'zgu: siljish qoladi, balandlik ishorasini almashtiradi. To'liq aylana o'sha nuqtaga qaytaradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars05.jsx')),
  },
{
    slug: 'dars06-grafiklar',
    title: 'Dars 6. Grafiklar',
    desc: 'Grafik jadvaldan emas: aylana yoyiladi va nuqtaning balandligi egri chiziqni chizadi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars06.jsx')),
  },
{
    slug: 'dars07-funksiyalar',
    title: 'Dars 7. Funksiyalar',
    desc: "Aniqlanish sohasi gorizontal, qiymatlar to'plami vertikal bo'yicha o'qiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars07.jsx')),
  },
  {
    slug: 'dars08-murakkab-teskari-funksiya',
    title: 'Dars 8. Murakkab va teskari funksiya',
    desc: "Tartib hammasini hal qiladi: ichki funksiya birinchi ishlaydi, teskarisi esa kirish va chiqishni almashtiradi. Ko'zgu -- y teng iks. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars08.jsx')),
  },
{
    slug: 'dars09-arkfunksiyalar',
    title: 'Dars 9. Arkfunksiyalar',
    desc: 'Gorizontal chiziq ikkita nuqta beradi, javob esa bitta: u bir qiymatlilik oynasidan olinadi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars09.jsx')),
  },
{
    slug: 'dars10-sodda-tenglamalar',
    title: 'Dars 10. Sodda tenglamalar',
    desc: "Ikkita nuqta va to'liq aylana: ildiz cheksiz ko'p, javob esa ikkita seriya. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars10.jsx')),
  },
{
    slug: 'dars11-sin-x-a',
    title: 'Dars 11. sin x = a',
    desc: "Ikki seriya bitta qatorga yig'iladi: (−1) daraja n ishorani almashtiradi, qadam esa yarim aylana. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars11.jsx')),
  },
  {
    slug: 'dars12-cos-x-a',
    title: 'Dars 12. cos x = a',
    desc: 'Vertikal chiziq ikkita nuqta beradi, ular bir-birining ostida: shuning uchun plyus-minus yetadi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars12.jsx')),
  },
  {
    slug: 'dars13-tg-x-a',
    title: 'Dars 13. tg x = a',
    desc: 'Qarama-qarshi ikki nuqta bitta kesish beradi: seriya bitta, qadam esa yarim aylana. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars13.jsx')),
  },
  {
    slug: 'dars14-usullar',
    title: 'Dars 14. Usullar',
    desc: "Ko'paytuvchi chiqariladi, bo'linmaydi: bo'lish kosinus nol bo'lgan ildizlarni yo'qotadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars14.jsx')),
  },
  // 5-BLOK boshlanadi. 3 va 4-bloklar (14-25) 10-sinfda qilinmaydi -- hosila
  // 11-sinfda o'tiladi (metodist qarori 2026-08-14), shuning uchun raqamlarda
  // uzilish bor va bu ATAYIN.
  {
    slug: 'dars15-daraja',
    title: "Dars 15. Haqiqiy ko'rsatkichli daraja",
    desc: "Ko'rsatkich zinapoyadan pastga tushadi: nol, manfiy, kasr va irratsional ko'rsatkich o'zi chiqadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars15.jsx')),
  },
  {
    slug: 'dars16-korsatkichli-funksiya',
    title: "Dars 16. Ko'rsatkichli funksiya",
    desc: "Egri chiziq o'qqa yaqinlashadi va tegmaydi: qiymatlar noldan boshlanadi, lekin nol ularda yo'q. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars16.jsx')),
  },
  {
    slug: 'dars17-korsatkichli-tenglamalar',
    title: "Dars 17. Ko'rsatkichli tenglamalar",
    desc: 'Gorizontal egri chiziqni bir marta uchratadi: ildiz bitta, chunki funksiya monoton. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars17.jsx')),
  },
  {
    slug: 'dars18-logarifm',
    title: 'Dars 18. Logarifm',
    desc: "Logarifm yangi amal emas: bu o'sha uchrashuvning ko'rsatkichi, faqat teskari tomondan o'qilgan. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars18.jsx')),
  },
  {
    slug: 'dars19-logarifmik-funksiya',
    title: 'Dars 19. Logarifmik funksiya',
    desc: "Ko'rsatkichlining aksi: kirish va chiqish joy almashadi, asimptota esa tik bo'ladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars19.jsx')),
  },
  {
    slug: 'dars20-logarifmik-tenglamalar',
    title: 'Dars 20. Logarifmik tenglamalar',
    desc: 'Begona ildiz tekshiruvda emas, boshidanoq joiz emas edi: polosa yechimdan oldin chiziladi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars20.jsx')),
  },
  {
    slug: 'dars21-irratsional-tenglamalar',
    title: 'Dars 21. Irratsional tenglamalar',
    desc: "Kvadratga ko'tarish yechim qo'shadi: topilgan har bir son dastlabki tenglamada tekshiriladi. 15 slayd, UZ/RU/EN. Mavzu 22-darsda davom etadi.",
    Component: lazy(() => import('../components/grade10/Dars21.jsx')),
  },
  {
    slug: 'dars22-ratsional-tengsizliklar',
    title: 'Dars 22. Ratsional tengsizliklar',
    desc: "Javob son emas, o'q bo'laklari: nollar o'qni kesadi, har bo'lakka ishora qo'yiladi. 15 slayd, UZ/RU/EN. 21-dars temasining davomi.",
    Component: lazy(() => import('../components/grade10/Dars22.jsx')),
  },
  {
    slug: 'dars23-logarifmik-ifodalar',
    title: 'Dars 23. Logarifmik ifodalar',
    desc: "Ko'rsatkich belgi ostidan ko'paytuvchi bo'lib chiqadi, asos esa kasr bilan almashadi. 15 slayd, UZ/RU/EN. Mavzu 24-darsda davom etadi.",
    Component: lazy(() => import('../components/grade10/Dars23.jsx')),
  },
  {
    slug: 'dars24-korsatkichli-logarifmik-tengsizliklar',
    title: "Dars 24. Ko'rsatkichli va logarifmik tengsizliklar",
    desc: 'Javob uchrashuv nuqtasi emas, undan bir tomon: kamayuvchi egri chiziqda tomon almashadi. 15 slayd, UZ/RU/EN. 23-dars temasining davomi.',
    Component: lazy(() => import('../components/grade10/Dars24.jsx')),
  },
  {
    slug: 'dars25-tenglamalar-sistemasi',
    title: 'Dars 25. Tenglamalar sistemasi',
    desc: "Javob son emas, juftlik: u ikkala satrni ham to'g'ri tenglikka aylantirishi shart. O'rniga qo'yish, algebraik qo'shish, almashtirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars25.jsx')),
  },
  {
    slug: 'dars26-trigonometrik-tengsizliklar',
    title: 'Dars 26. Trigonometrik tengsizliklar',
    desc: 'Javob nuqta emas, yoy: u ikki kesishish orasida yotadi va har aylanishda takrorlanadi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars26.jsx')),
  },
  {
    slug: 'dars27-ehtimolliklar-nazariyasi',
    title: 'Dars 27. Ehtimolliklar nazariyasi',
    desc: "Isxodlar bittalab yotqiziladi, kasr o'zi yig'iladi, tajriba esa uni tekshiradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars27.jsx')),
  },
  {
    slug: 'dars28-stereometriya-aksiomalari',
    title: 'Dars 28. Stereometriya aksiomalari',
    desc: "Fazoning yassi rasmi aldaydi: tekislik yagonami yoki yo'qmi, faqat burilish ko'rsatadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars28.jsx')),
  },
  {
    slug: 'dars29-ayqash-togri-chiziqlar',
    title: "Dars 29. Ayqash to'g'ri chiziqlar",
    desc: "Rasmda kesishgan ikki qirra fazoda ayqash bo'lib chiqadi: buni faqat burilish ko'rsatadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars29.jsx')),
  },
  {
    slug: 'dars30-chiziq-va-tekislik-parallelligi',
    title: 'Dars 30. Chiziq va tekislik parallelligi',
    desc: "Alomatda ikki shart bor, va ikkinchisi yo'qoladi: chiziq tekislikda YOTMASLIGI ham kerak. Uch hol, umumiy nuqtalar soni bilan. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars30.jsx')),
  },
  {
    slug: 'dars31-tekisliklar-parallelligi',
    title: 'Dars 31. Tekisliklarning parallelligi',
    desc: "Alomatga IKKI kesishuvchi chiziq kerak: bir juftlik yetmaydi, uni kesishuvchi yoqlarda ham topish mumkin. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars31.jsx')),
  },
  {
    slug: 'dars32-parallel-proyeksiyalash',
    title: 'Dars 32. Parallel proyeksiyalash',
    desc: "Chizma proyeksiya: uzunlik va burchak o'zgaradi, parallellik va kesma esa qoladi. Ikki xossa -- ishonish mumkin bo'lgan yagona narsa. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars32.jsx')),
  },
  {
    slug: 'dars33-perpendikulyar-chiziq-tekislik',
    title: 'Dars 33. Perpendikulyar chiziq va tekislik',
    desc: "Bitta chiziq kam: burilish og'ishni ko'rsatadi, alomat esa ikki kesishuvchini talab qiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars33.jsx')),
  },
  {
    slug: 'dars34-chiziq-va-tekislik-burchagi',
    title: "Dars 34. To'g'ri chiziq va tekislik orasidagi burchak",
    desc: 'Burchak proyeksiya bilan olinadi: qulay chiziq kichikroq burchak beradi va bu aldov. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars34.jsx')),
  },
  {
    slug: 'dars35-ikki-yoqli-burchak',
    title: 'Dars 35. Ikki yoqli burchak. Perpendikulyar tekisliklar',
    desc: "Chiziqli burchak qirraga perpendikulyar quriladi, va uning kattaligi nuqtaga bog'liq emas. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars35.jsx')),
  },
  {
    slug: 'dars36-ogma-va-uch-perpendikulyar',
    title: "Dars 36. Perpendikulyar, og'ma va uch perpendikulyar",
    desc: 'Teorema proyeksiyaga tayanadi: perpendikulyarga perpendikulyarlik har bir chiziqda bor va hech narsa bermaydi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars36.jsx')),
  },
  {
    slug: 'dars37-prizma',
    title: 'Dars 37. Prizma',
    desc: "Qirra ikki yoqqa tegishli, shuning uchun uchburchakli prizmada olti emas, to'qqiz qirra. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars37.jsx')),
  },
  {
    slug: 'dars38-parallelepiped',
    title: 'Dars 38. Parallelepiped',
    desc: "Bir uchdan ikki diagonal chiqadi: biri yoqda, ikkinchisi jism ichida, va o'lchamlari boshqa. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars38.jsx')),
  },
  {
    slug: 'dars39-piramida',
    title: 'Dars 39. Piramida',
    desc: "Uchdan ikki kesma: qirra tomon uchiga, apofema o'rtasiga, va apofema qisqaroq. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars39.jsx')),
  },
  {
    slug: 'dars40-sirt-yuzasi',
    title: 'Dars 40. Sirt yuzasi',
    desc: "Jism yoyiladi, va sirt yuzasi tanish yassi shakllar yuzalarining yig'indisiga aylanadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars40.jsx')),
  },
  {
    slug: 'dars41-muntazam-jismlar',
    title: 'Dars 41. Muntazam prizma va piramida',
    desc: 'Muntazam barcha qirralar teng degani emas: asos tomoni va balandlik mustaqil. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars41.jsx')),
  },
  {
    slug: 'dars42-kesimlarni-yasash',
    title: 'Dars 42. Kesimlarni yasash',
    desc: "Kesim uchlari qirralarda, tomonlari yoqlarda: izlar usuli va parallel ko'chirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars42.jsx')),
  },
  {
    slug: 'dars43-fazoda-koordinatalar',
    title: 'Dars 43. Fazoda koordinatalar',
    desc: "Uchinchi son ko'tarilish: proyeksiya yozuvni tekshiradi, nollar joyni aytadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars43.jsx')),
  },
  {
    slug: 'dars44-fazoda-vektorlar',
    title: 'Dars 44. Fazoda vektorlar',
    desc: 'Vektorning uchligi manzil emas, siljish: oxir minus boshi. 15 slayd, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade10/Dars44.jsx')),
  },
  {
    slug: 'dars45-vektorlar-amallar',
    title: 'Dars 45. Vektorlar ustida amallar',
    desc: "Yig'indi va ayirma o'qlar bo'yicha; ayirma b oxiridan a oxiriga boradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars45.jsx')),
  },
  {
    slug: 'dars46-skalyar-kopaytma',
    title: "Dars 46. Skalyar ko'paytma",
    desc: "Ko'paytma uzunliklar ko'paytmasi emas: kosinus bor, va nol to'g'ri burchakni bildiradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars46.jsx')),
  },
  {
    slug: 'dars47-tekislik-tenglamasi',
    title: 'Dars 47. Tekislik tenglamasi',
    desc: "Koeffitsiyentlar uchligi normal, nuqta emas: tekshiruv almashtirib qo'yish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars47.jsx')),
  },
]
