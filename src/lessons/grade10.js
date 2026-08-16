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
    desc: "Nuqtaning koordinatalari: birinchi son kosinus, ikkinchisi sinus, nisbati tangens. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars02.jsx')),
  },
{
    slug: 'dars03-trigonometrik-doira',
    title: 'Dars 3. Trigonometrik doira',
    desc: "Birlik aylana: nuqta koordinatalari kosinus va sinus. 15 slayd, UZ/RU/EN.",
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
    desc: "Grafik jadvaldan emas: aylana yoyiladi va nuqtaning balandligi egri chiziqni chizadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars06.jsx')),
  },
{
    slug: 'dars07-funksiyalar',
    title: 'Dars 7. Funksiyalar',
    desc: "Aniqlanish sohasi gorizontal, qiymatlar to'plami vertikal bo'yicha o'qiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars07.jsx')),
  },
{
    slug: 'dars08-arkfunksiyalar',
    title: 'Dars 8. Arkfunksiyalar',
    desc: "Gorizontal chiziq ikkita nuqta beradi, javob esa bitta: u bir qiymatlilik oynasidan olinadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars08.jsx')),
  },
{
    slug: 'dars09-sodda-tenglamalar',
    title: 'Dars 9. Sodda tenglamalar',
    desc: "Ikkita nuqta va to'liq aylana: ildiz cheksiz ko'p, javob esa ikkita seriya. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars09.jsx')),
  },
{
    slug: 'dars10-sin-x-a',
    title: 'Dars 10. sin x = a',
    desc: "Ikki seriya bitta qatorga yig'iladi: (−1) daraja n ishorani almashtiradi, qadam esa yarim aylana. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars10.jsx')),
  },
  {
    slug: 'dars11-cos-x-a',
    title: 'Dars 11. cos x = a',
    desc: "Vertikal chiziq ikkita nuqta beradi, ular bir-birining ostida: shuning uchun plyus-minus yetadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars11.jsx')),
  },
  {
    slug: 'dars12-tg-x-a',
    title: 'Dars 12. tg x = a',
    desc: "Qarama-qarshi ikki nuqta bitta kesish beradi: seriya bitta, qadam esa yarim aylana. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars12.jsx')),
  },
  {
    slug: 'dars13-usullar',
    title: 'Dars 13. Usullar',
    desc: "Ko'paytuvchi chiqariladi, bo'linmaydi: bo'lish kosinus nol bo'lgan ildizlarni yo'qotadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars13.jsx')),
  },
  // 5-BLOK boshlanadi. 3 va 4-bloklar (14-25) 10-sinfda qilinmaydi -- hosila
  // 11-sinfda o'tiladi (metodist qarori 2026-08-14), shuning uchun raqamlarda
  // uzilish bor va bu ATAYIN.
  {
    slug: 'dars26-daraja',
    title: "Dars 26. Haqiqiy ko'rsatkichli daraja",
    desc: "Ko'rsatkich zinapoyadan pastga tushadi: nol, manfiy, kasr va irratsional ko'rsatkich o'zi chiqadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars26.jsx')),
  },
  {
    slug: 'dars27-korsatkichli-funksiya',
    title: "Dars 27. Ko'rsatkichli funksiya",
    desc: "Egri chiziq o'qqa yaqinlashadi va tegmaydi: qiymatlar noldan boshlanadi, lekin nol ularda yo'q. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars27.jsx')),
  },
  {
    slug: 'dars28-korsatkichli-tenglamalar',
    title: "Dars 28. Ko'rsatkichli tenglamalar",
    desc: "Gorizontal egri chiziqni bir marta uchratadi: ildiz bitta, chunki funksiya monoton. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars28.jsx')),
  },
  {
    slug: 'dars29-logarifm',
    title: 'Dars 29. Logarifm',
    desc: "Logarifm yangi amal emas: bu o'sha uchrashuvning ko'rsatkichi, faqat teskari tomondan o'qilgan. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars29.jsx')),
  },
  {
    slug: 'dars30-logarifmik-funksiya',
    title: 'Dars 30. Logarifmik funksiya',
    desc: "Ko'rsatkichlining aksi: kirish va chiqish joy almashadi, asimptota esa tik bo'ladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars30.jsx')),
  },
  {
    slug: 'dars31-logarifmik-tenglamalar',
    title: 'Dars 31. Logarifmik tenglamalar',
    desc: "Begona ildiz tekshiruvda emas, boshidanoq joiz emas edi: polosa yechimdan oldin chiziladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars31.jsx')),
  },
  {
    slug: 'dars32-irratsional-tenglamalar',
    title: 'Dars 32. Irratsional tenglamalar',
    desc: "Kvadratga ko'tarish yechim qo'shadi: topilgan har bir son dastlabki tenglamada tekshiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars32.jsx')),
  },
  {
    slug: 'dars33-ratsional-tengsizliklar',
    title: 'Dars 33. Ratsional tengsizliklar',
    desc: "Javob son emas, o'q bo'laklari: nollar o'qni kesadi, har bo'lakka ishora qo'yiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars33.jsx')),
  },
  {
    slug: 'dars34-logarifmik-ifodalar',
    title: 'Dars 34. Logarifmik ifodalar',
    desc: "Ko'rsatkich belgi ostidan ko'paytuvchi bo'lib chiqadi, asos esa kasr bilan almashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars34.jsx')),
  },
  {
    slug: 'dars35-korsatkichli-logarifmik-tengsizliklar',
    title: "Dars 35. Ko'rsatkichli va logarifmik tengsizliklar",
    desc: "Javob uchrashuv nuqtasi emas, undan bir tomon: kamayuvchi egri chiziqda tomon almashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars35.jsx')),
  },
  {
    slug: 'dars36-trigonometrik-tengsizliklar',
    title: 'Dars 36. Trigonometrik tengsizliklar',
    desc: "Javob nuqta emas, yoy: u ikki kesishish orasida yotadi va har aylanishda takrorlanadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars36.jsx')),
  },
]
