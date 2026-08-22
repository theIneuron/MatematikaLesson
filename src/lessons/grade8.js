import { lazy } from 'react'

// 8-sinf NAZARIY darslari.
// Reja: src/books/grade8/DARSLAR_REJASI_8SINF.md
// Kontrakt: src/books/grade8/ETALON_8SINF.md
//
// 2026-08-13, metodist qarori: 8-sinfning HAMMA eski darslari o'chirildi.
// Nima uchun: `Dars01` (16 ekran) va `Dars07` monolit edi, ikkisida ovoz
// dvijokining o'z nusxasi yotardi (§1); `Dars03` (pilot) o'z ma'lumot
// kontraktiga mos emas edi (§21 p. 8); `Dars01v2` boshqa konsepsiya edi.
// O'chirilganlar: git tarixida (Dars01, Dars03, Dars07) va
// `_archive/unused-code/grade8-dars01v2/` da (Dars01v2, labkit).
//
// Endi sinf shu tartibda ishlaydi: `screens.jsx` — o'ram bir marta,
// `tools.jsx` — asboblar, `DarsNN.jsx` — FAQAT ma'lumot.
// Yangi dars: `node scripts/grade8-new-lesson.mjs <N> "<mavzu>"`.
export const grade8Nazariy = [
  {
    slug: 'dars01-ratsional-ifodalar-va-kasrlar',
    title: 'Dars 1. Ratsional ifodalar va ratsional kasrlar',
    desc: "Xuk: bitta yozuv, ikki mashina. 3-ekranda dastur misolni O'ZI yechadi (qo'l, uchuvchi son, chiziqning uzilishi), 4-ekranda o'quvchi shuni o'zi qiladi. Qoidani o'quvchi yig'adi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars01.jsx')),
  },
  {
    slug: 'dars02-kasrning-asosiy-xossasi',
    title: 'Dars 2. Kasrning asosiy xossasi',
    desc: "1-darsning davomi: 3-ekranda o'quvchi bitta bo'linmani boshqa juftliklar berishini ko'rgan edi. Xuk: ikki yozuv va savol belgisi. Uch usul, WhyStep bilan (amal ham, ASOS ham tanlanadi). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars02.jsx')),
  },
  {
    slug: 'dars03-kasrlarni-qisqartirish',
    title: 'Dars 3. Ratsional kasrlarni qisqartirish',
    desc: "2-darsning teskarisi: ko'paytuvchi KETADI, shart esa QOLADI. Uch usul: umumiy ko'paytuvchi, kvadratlar ayirmasi, son bilan tekshirish. 6-ekranda muvaffaqiyatsiz qadam son bilan rad etiladi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars03.jsx')),
  },
  {
    slug: 'dars04-kasrlarni-qoshish-va-ayirish',
    title: "Dars 4. Kasrlarni qo'shish va ayirish",
    desc: "Ikki oldingi dars ishga tushadi: umumiy maxraj 2-darsning xossasi, javobni qisqartirish 3-darsning ishi. Yangi narsa uchta: bir xil maxraj, umumiy maxraj va AYIRISHDAGI QAVS. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars04.jsx')),
  },
  {
    slug: 'dars05-kasrlarni-kopaytirish-va-bolish',
    title: "Dars 5. Kasrlarni ko'paytirish va bo'lish",
    desc: "Darsning eng qimmat joyi — BO'LISHDAGI UCHINCHI SHART: bo'luvchining surati ham nolga aylanmasligi kerak. Uch usul: ko'paytirish, bo'lish, uchinchi shart. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars05.jsx')),
  },
  {
    slug: 'dars06-ifodalarni-almashtirish',
    title: 'Dars 6. Ratsional ifodalarni almashtirish',
    desc: "Blokning oxirgi kasr darsi: to'rt amal birga. Eng qimmat joyi — YASHIRIN SHARTLAR: javob qisqa, shartlar esa oraliq maxrajlardan yig'iladi va javobda ko'rinmaydi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars06.jsx')),
  },
  {
    slug: 'dars07-teskari-proporsionallik-va-grafik',
    title: 'Dars 7. y = k/x funksiyasi va uning grafigi',
    desc: "Grafik darsi: lenta figurasi GIPERBOLA (nuqtalar o'tiradi, tarmoqlar chiziladi), TO'RT OYNA (shart, formula, jadval, grafik) va k bo'yicha SURGICH. Kasrlar bo'limining noli chizmada ko'rinadi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars07.jsx')),
  },
  {
    slug: 'dars08-arifmetik-ildiz-va-daraja',
    title: "Dars 8. Arifmetik ildiz va ratsional ko'rsatkichli daraja",
    desc: "Blokning oxirgi darsi. Asosiy asbob LESTNITSA: kasr ko'rsatkich kelishuv bilan berilmaydi, o'quvchi qatorni o'zi davom ettiradi va yarim ko'rsatkich ildizni berishini ko'radi. Ikkinchi joy: arifmetik ildiz BITTA nomanfiy son. Uchinchi: modul. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars08.jsx')),
  },
  {
    slug: 'dars09-kvadrat-ildiz-tushunchasi',
    title: 'Dars 9. Kvadrat ildiz tushunchasi',
    desc: "B2 blokining birinchi darsi va yangi qoida bo'yicha birinchisi: o'n to'rt ekran 1-darsning asboblarida, bitta ekran blok mexanikasi LUPA. Ildiz bor, oxirgi raqami esa yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars09.jsx')),
  },
  {
    slug: 'dars10-arifmetik-kvadrat-ildiz',
    title: 'Dars 10. Arifmetik kvadrat ildiz',
    desc: "Ekranlarni sinf KARKASI yig'adi: o'n to'rt pozitsiya 1-darsning asboblari, bittasi blok mexanikasi IKKI TOMON. Kvadratdan ildiz modulni beradi, ildiz osti esa nomanfiy bo'lishi shart. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars10.jsx')),
  },
  {
    slug: 'dars11-ildizning-xossalari',
    title: 'Dars 11. Arifmetik kvadrat ildizning xossalari',
    desc: "Uchta xossa: kvadrat ildizni yechadi, √(a²) modulni beradi, ildiz osti katta bo'lsa ildiz ham katta. Blok mexanikasi 5-ekranda — qayta yozish va ASOS. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars11.jsx')),
  },
  {
    slug: 'dars12-kopaytmadan-ildiz',
    title: "Dars 12. Ko'paytmadan kvadrat ildiz",
    desc: "Ildiz KO'PAYTUVCHILARGA bo'linadi, hadlarga esa yo'q. Farq 4-ekrandagi jadvalda bitta qarashda ko'rinadi. Blok mexanikasi 5-ekranda — qayta yozish va ASOS. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars12.jsx')),
  },
  {
    slug: 'dars13-ildizli-ifodalarni-ozgartirish',
    title: "Dars 13. Ildizli ifodalarni o'zgartirish",
    desc: "Uch ish: ko'paytuvchini chiqarish, ildiz ostiga kiritish va ildizli hadlarni qo'shish. Tekshirish usuli — javobni kvadratga oshirish. Blok mexanikasi 5-ekranda. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars13.jsx')),
  },
  {
    slug: 'dars14-irratsional-sonlar',
    title: 'Dars 14. Irratsional sonlar',
    desc: "Kasrning onli yozuvi tugaydi yoki takrorlanadi, uchinchi hol yo'q. Ikkidan ildizga teng kasr yo'qligi juftlik bo'yicha isbotlanadi. Blok mexanikasi 5-ekranda lupa. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars14.jsx')),
  },
]

// 8-sinf AMALIY mashg'ulotlari.
//
// 1-DARS AMALIYOTI — 7-SINFNING 1-DARS AMALIYOTIDAN AYNAN NUSXA (metodist
// qarori 2026-08-21). Ko'chirilgan: `practice/kit.jsx`, `practice/frac.jsx`,
// `practice/PracticeHost.jsx` va `practice/dars01/` ning o'n bir fayli.
// Matematika ham hozircha 7-sinfning: sonli ifodalar, amallar tartibi.
// Metodist nimani o'zgartirishni aytadi, shundan keyin bu 8-sinfning
// amaliyoti bo'ladi.
//
// DIQQAT: bu NUSXA, ya'ni CLAUDE.md §5 ga zid holat. Ikki sinfda bir xil
// qatlam turadi va bitta nuqson ikki joyda tuzatiladi. Ataylab shunday
// qilingan — boshlang'ich nuqta sifatida.
export const grade8Amaliy = [
  {
    slug: 'dars01-amaliyot',
    title: 'Dars 1 amaliyoti — 10 topshiriq (7-sinf nusxasi)',
    desc: "7-sinfning 1-dars amaliyotidan aynan nusxa: amallar tartibi, qavs, o'nli va oddiy kasrlar, manfiy sonlar, harfli ifodalar. O'nta xil mexanika, UZ/RU/EN. Metodist ko'rsatgandan keyin 8-sinfga moslashtiriladi.",
    Component: lazy(() => import('../components/grade8/practice/dars01/Dars01Practice.jsx')),
  },
]
