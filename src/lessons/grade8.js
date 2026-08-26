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
  {
    slug: 'dars15-kvadrat-tenglama-va-uning-elementlari',
    title: 'Dars 15. Kvadrat tenglama va uning elementlari',
    desc: "ax kvadrat plyus bx plyus c teng nol, a nolga teng emas. Koeffitsiyentlar va ildiz ta'rifi, standart shaklga keltirish. Blok mexanikasi 5-ekranda. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars15.jsx')),
  },
  {
    slug: 'dars16-chala-kvadrat-tenglamalar',
    title: 'Dars 16. Chala kvadrat tenglamalar',
    desc: "Uch ko'rinish: ax kvadrat teng nol, ax kvadrat plyus c teng nol, ax kvadrat plyus bx teng nol. Ildiz bor-yo'qligi ishoraga bog'liq, x ga bo'lish ildiz yo'qotadi. Blok mexanikasi 5-ekranda. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars16.jsx')),
  },
  {
    slug: 'dars17-kvadrat-tenglama-ildizlari-formulasi',
    title: 'Dars 17. Kvadrat tenglama ildizlari formulasi',
    desc: "To'la kvadratni ajratish usulidan formula chiqariladi: x1,2 = (-b ± D dan ildiz) / 2a. D = b² - 4ac diskriminant deb ataladi. Blok mexanikasi 5-ekranda (SquareCut). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars17.jsx')),
  },
  {
    slug: 'dars18-diskriminant-va-ildizlar-soni',
    title: 'Dars 18. Diskriminant va ildizlar soni',
    desc: "D > 0 - ikkita ildiz, D = 0 - bitta ildiz (yo'q emas!), D < 0 - haqiqiy ildiz yo'q. Blok mexanikasi 5-ekranda: erkin had suriladi, parabola o'q bilan uchrashishi ko'rinadi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars18.jsx')),
  },
  {
    slug: 'dars19-viyet-teoremasi',
    title: 'Dars 19. Viyet teoremasi',
    desc: "Keltirilgan tenglama x² + px + q = 0 uchun x1 + x2 = -p, x1 · x2 = q. Ildizlarni tanlash usuli bilan topish, ko'paytuvchilarga ajratish. Blok mexanikasi 5-ekranda (FactorPair). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars19.jsx')),
  },
  {
    slug: 'dars20-kasr-ratsional-tenglamalar',
    title: 'Dars 20. Kasr-ratsional tenglamalar',
    desc: "Avval ODZ topiladi, maxrajlarga ko'paytirib kvadrat tenglama olinadi, ODZ dan chetga chiqqan ildiz posторонний deb rad etiladi. Blok mexanikasi 5-ekranda (TwoSides). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars20.jsx')),
  },
  {
    slug: 'dars21-kvadrat-tenglamalar-yordamida-masalalar-yechish',
    title: 'Dars 21. Kvadrat tenglamalar yordamida masalalar yechish',
    desc: "Noma'lum harf bilan belgilanadi, shartdan tenglama tuziladi, yechiladi. Masala shartiga zid ildiz (manfiy uzunlik, tezlik, vaqt) javobga kiritilmaydi. Blok mexanikasi 5-ekranda (FourWindows). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars21.jsx')),
  },
  {
    slug: 'dars22-kopaytuvchilarga-ajratish-va-bikvadrat-tenglamalar',
    title: 'Dars 22. Ko\'paytuvchilarga ajratish va bikvadrat tenglamalar',
    desc: "ax² + bx + c = a(x - x1)(x - x2) - Viyet teoremasidan chiqadigan umumiy teorema. Bikvadrat tenglama x² = t bilan kvadrat tenglamaga keltiriladi, manfiy t rad etiladi. Blok Б3 yakunlanadi. Blok mexanikasi 5-ekranda (FactorPair). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars22.jsx')),
  },
  {
    slug: 'dars23-sonli-tengsizliklar',
    title: 'Dars 23. Sonli tengsizliklar',
    desc: "a - b ayirma musbat bo'lsa a > b, manfiy bo'lsa a < b. Taqqoslash ayirmaning ishorasiga qaraladi, sonning ko'rinishiga emas. Blok Б4 boshlanadi. Blok mexanikasi 5-ekranda (TwoSides, ayirma usuli). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars23.jsx')),
  },
  {
    slug: 'dars24-sonli-tengsizliklarning-asosiy-xossalari',
    title: 'Dars 24. Sonli tengsizliklarning asosiy xossalari',
    desc: "Ikkala qism musbat songa ko'paytirilsa ishora saqlanadi, manfiy songa ko'paytirilsa ishora buriladi. Blok mexanikasi 5-ekranda (TwoSides, ko'paytirish). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars24.jsx')),
  },
  {
    slug: 'dars25-bir-nomalumli-chiziqli-tengsizliklar',
    title: 'Dars 25. Bir noma\'lumli chiziqli tengsizliklar',
    desc: "ax > b, ax < b ko'rinishidagi tengsizlik. Had ko'chirilganda ishorasi o'zgaradi, manfiy songa bo'linganda tengsizlik ishorasi buriladi. Yechim to'g'ri chiziqda nur, qat'iy tengsizlikda chegara nuqtasi ochiq. Blok mexanikasi 5-ekranda (TwoSides). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars25.jsx')),
  },
  {
    slug: 'dars26-bir-nomalumli-tengsizliklar-sistemasi',
    title: 'Dars 26. Bir noma\'lumli tengsizliklar sistemasi',
    desc: "Sistema yechimi - har ikki tengsizlikni to'g'ri qiladigan qiymat. Ikki yechim kesishtiriladi (birlashtirilmaydi): kattaroq chegara chapdan, kichikroq chegara o'ngdan. Blok mexanikasi 5-ekranda (TwoSides, kesishma). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars26.jsx')),
  },
  {
    slug: 'dars27-sonli-oraliqlar-va-ularning-belgilanishi',
    title: 'Dars 27. Sonli oraliqlar va ularning belgilanishi',
    desc: "a ≤ x ≤ b - kesma [a; b], a < x < b - interval (a; b), aralash holat - yarim-interval. Qavs turi chegaraning kirish-kirmasligini bildiradi. Blok mexanikasi 5-ekranda (TwoSides, qavs yozuviga o'tish). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars27.jsx')),
  },
  {
    slug: 'dars28-tengsizliklar-yordamida-masalalar-yechish',
    title: 'Dars 28. Tengsizliklar yordamida masalalar yechish',
    desc: "Noma'lum harf bilan belgilanadi, shartdan tengsizlik (yoki sistema) tuziladi, yechiladi. Masala shartiga zid qiymatlar (manfiy uzunlik, tezlik, vaqt) javobdan chiqarib tashlanadi. Darslikda alohida paragraf yo'q, 15- va 16-darslar masalalaridan umumlashtirilgan. Blok mexanikasi 5-ekranda (TwoSides). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars28.jsx')),
  },
  {
    slug: 'dars29-sonning-moduli-modul-tenglama-va-tengsizliklar',
    title: 'Dars 29. Sonning moduli. Modul qatnashgan tenglama va tengsizliklar',
    desc: "|a| = a (a ≥ 0), |a| = −a (a < 0). Modul noldan masofa. |x| = a ning ikkita ildizi bor. |x| ≤ a kesma, |x| ≥ a ikki nur beradi. Blok mexanikasi 5-ekranda (ModulusFold, yangi pribor). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars29.jsx')),
  },
  {
    slug: 'dars30-taqribiy-hisoblashlar-va-xatoliklar',
    title: 'Dars 30. Taqribiy hisoblashlar va xatoliklar',
    desc: "Absolut xatolik |x - a|, nisbiy xatolik absolut xatolikning |a| ga nisbati, foizda. Yaxlitlash qoidasi: beshdan kichik - kami bilan, katta yoki teng - ortig'i bilan. Darslikda to'rt paragraf birlashtirilgan (18-21-§). Blok mexanikasi 5-ekranda (ZoomLine). Blok Б4 yakunlanadi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars30.jsx')),
  },
  {
    slug: 'dars31-butun-korsatkichli-daraja',
    title: 'Dars 31. Butun ko\'rsatkichli daraja',
    desc: "a⁰ = 1 (a ≠ 0), a⁻ⁿ = 1/aⁿ (a ≠ 0). Manfiy ko'rsatkich teskari sonni bildiradi, ishorani emas. Darslikda alohida ta'rif sahifasi yo'q, 9-§ misollari asosida umumlashtirilgan. Blok mexanikasi 5-ekranda (PowerLadder). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars31.jsx')),
  },
  {
    slug: 'dars32-butun-korsatkichli-darajaning-xossalari',
    title: 'Dars 32. Butun ko\'rsatkichli darajaning xossalari',
    desc: "aᵖ · aᵠ = aᵖ⁺ᵠ, aᵖ : aᵠ = aᵖ⁻ᵠ, (aᵖ)ᵠ = aᵖᵠ - p, q istalgan butun son bo'lganda ham to'g'ri. Darslik xossalarni ratsional ko'rsatkich uchun beradi (9-§, 44-bet), bu darsda butun holatga qo'llaniladi. Blok mexanikasi 5-ekranda (Transform + WhyStep). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars32.jsx')),
  },
  {
    slug: 'dars33-sonning-standart-korinishi',
    title: 'Dars 33. Sonning standart ko\'rinishi',
    desc: "Har qanday son a × 10ⁿ ko'rinishida yoziladi, bunda 1 ≤ a < 10. Katta son uchun n musbat, kichik son uchun manfiy, nol standart shaklda aniqlanmagan. Darslikda alohida paragraf yo'q, matematik konvensiya sifatida beriladi. Blok mexanikasi 5-ekranda (StandardForm). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars33.jsx')),
  },
  {
    slug: 'dars34-malumotlarni-yigish-va-ifodalash',
    title: 'Dars 34. Ma\'lumotlarni yig\'ish va ifodalash',
    desc: "Variatsion qator, chastota, nisbiy chastota, chastotalar poligoni va ustunli diagramma. Barcha misollar darslikdan (28-§, 188-192-bet): lampochka sinovi, g'o'za g'unchalari, DAN avtomobil tezligi va masofasi. Blok mexanikasi 5-ekranda (FreqTable). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars34.jsx')),
  },
  {
    slug: 'dars35-ortacha-qiymat-moda-mediana',
    title: 'Dars 35. O\'rtacha qiymat, moda, mediana',
    desc: "Sonlar yig'indisi soniga bo'linsa o'rtacha qiymat, eng ko'p uchraydigan qiymat moda, o'rtadagi son (yoki ikkisining o'rtachasi) mediana. Moda va o'rtacha doim teng emas. Barcha misollar darslikdan (29-§, 195-197-bet). Blok mexanikasi 5-ekranda (DataDrag). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars35.jsx')),
  },
  {
    slug: 'dars36-kombinatorika-metod-perebora',
    title: 'Dars 36. Kombinatorika, metod perebora va asosiy qonuni',
    desc: "Barcha holatlarni tanlash (perebor) usuli va ko'paytirish qoidasi: A dan B ga m, B dan C ga n usul bo'lsa, A dan C ga m·n usuli bor. Alternativ yo'llar qo'shiladi, ketma-ket bosqichlar ko'paytiriladi. Barcha misollar darslikdan (30-31-§, 200-204-bet). Blok mexanikasi 5-ekranda (TreeBuild). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars36.jsx')),
  },
  {
    slug: 'dars37-parallelogramm-va-uning-xossalari',
    title: 'Dars 37. Parallelogramm va uning xossalari',
    desc: "Qarama-qarshi tomonlari parallel to'rtburchak parallelogramm deyiladi. Uning tomonlari va burchaklari teng, diagonallari teng ikkiga bo'linadi, bir tomonga yopishgan burchaklari yig'indisi 180 gradus. Barcha teorema va misollar darslikdan (geometriya, I bob, 3-mavzu, 14-15-bet). Yangi priborlar: GeoFigure, ProofLines. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars37.jsx')),
  },
  {
    slug: 'dars38-togri-tortburchak-romb-kvadrat',
    title: 'Dars 38. To\'g\'ri to\'rtburchak, romb va kvadrat',
    desc: "Hamma burchaklari to'g'ri parallelogramm to'g'ri to'rtburchak (diagonallari teng), tomonlari teng parallelogramm romb (diagonallari perpendikulyar, burchaklarni teng ikkiga bo'ladi), ikkalasi birga kvadrat. Uch mavzu darslikdan (geometriya, I bob, 5-7-mavzu, 20-25-bet). Yangi pribor yo'q, GeoFigure va ProofLines qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars38.jsx')),
  },
  {
    slug: 'dars39-trapetsiya-va-uning-xossalari',
    title: 'Dars 39. Trapetsiya va uning xossalari',
    desc: "Ikkita tomoni parallel, qolgan ikkitasi parallel bo'lmagan to'rtburchak trapetsiya. Trapetsiya bo'lishi uchun ikki shart birga kerak: bir tomondagi burchaklar yig'indisi 180°, qo'shni tomondagilarniki esa boshqacha. Bir burchagi to'g'ri bo'lsa, bir xil yon tomondagisi ham to'g'ri. Darslikdan (geometriya, I bob, 9-mavzu, 29-31-bet). Yangi pribor yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars39.jsx')),
  },
  {
    slug: 'dars40-parallelogrammning-yuzi',
    title: 'Dars 40. Parallelogrammning yuzi',
    desc: "Istalgan tomon asos, unga mos balandlik qarama-qarshi tomongacha bo'lgan masofa. Yuzi S = a · h, asos ko'paytirilgan mos balandlik, yon tomonning o'zi emas. Boshqa asos olinsa balandlik boshqacha, lekin yuza o'zgarmaydi. Darslikdan (geometriya, 2-§, 21-mavzu, 77-bet). Blok mexanikasi 5-ekranda (AreaCut, blok priborining pilot darsi). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars40.jsx')),
  },
  {
    slug: 'dars41-uchburchakning-yuzi',
    title: 'Dars 41. Uchburchakning yuzi',
    desc: "Uchburchakning yuzi asosi bilan balandligi ko'paytmasining yarmiga teng, S = ½ a · h — uchburchak parallelogrammning aynan yarmi. To'g'ri burchakli uchburchakda ikki katet bevosita asos va balandlik bo'ladi. Darslikdan (geometriya, 2-§, 22-mavzu, 79-80-bet). Yangi pribor yo'q, AreaCut (dars 40) teskari yo'nalishda qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars41.jsx')),
  },
  {
    slug: 'dars42-trapetsiyaning-yuzi',
    title: 'Dars 42. Trapetsiyaning yuzi',
    desc: "Trapetsiyaning yuzi asoslar yig'indisining yarmi bilan balandligining ko'paytmasiga teng, S = (a+b)/2 · h — bu yuza o'rta chiziq bilan balandlikning ko'paytmasiga ham teng. Darslikdan (geometriya, 2-§, 24-mavzu, 84-bet). Yangi pribor yo'q, AreaCut (dars 40-41) qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars42.jsx')),
  },
  {
    slug: 'dars43-falyes-teoremasi-orta-chizigi',
    title: 'Dars 43. Falyes teoremasi, uchburchak va trapetsiyaning o\'rta chizig\'i',
    desc: "Parallel to'g'ri chiziqlar bir kesuvchidan teng kesmalar ajratsa, boshqasidan ham teng ajratadi (Falyes teoremasi). Uchburchakning o'rta chizig'i uchinchi tomonning yarmiga, trapetsiyaning o'rta chizig'i asoslar yig'indisining yarmiga teng. Uch mavzu darslikdan (geometriya, I bob, 8-, 11-, 12-mavzu, 27-, 34-, 40-bet). Yangi pribor yo'q. BLOK Б6 YAKUNLANADI. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars43.jsx')),
  },
  {
    slug: 'dars44-pifagor-teoremasi',
    title: 'Dars 44. Pifagor teoremasi va uning isboti',
    desc: "Gipotenuzaning kvadrati katetlar kvadratlari yig'indisiga teng, c² = a² + b². Isbot, ikkita bir xil (a+b) tomonli kvadrat orqali, to'rt uchburchak qayta joylashtirilganda bir holatda c², ikkinchisida a² va b² ochiladi. Darslikdan (geometriya, 3-§, 27-28-mavzu, 93-97-bet). Yangi pribor: SquareSwap. BLOK Б7 BOSHLANADI, reja 2026-08-23 qayta qurilgan (Pifagor, aylana, vektorlar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars44.jsx')),
  },
  {
    slug: 'dars45-pifagor-teskari-teorema',
    title: 'Dars 45. Pifagor teoremasiga teskari teorema',
    desc: "Agar uchburchakda bir tomonning kvadrati qolgan ikki tomon kvadratlari yig'indisiga teng bo'lsa, uchburchak to'g'ri burchakli bo'ladi, va to'g'ri burchak aynan eng katta tomonga qarama-qarshi turadi. Tekshirishdan oldin eng katta tomon aniqlanadi. Darslikdan (geometriya, 3-§, 29-mavzu, 98-100-bet). Yangi pribor yo'q, GeoFigure va ProofLines qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars45.jsx')),
  },
  {
    slug: 'dars46-balandlik-geron-formulasi',
    title: 'Dars 46. Tomonlariga ko\'ra balandlik, Geron formulasi',
    desc: "Yarim perimetr p = (a+b+c) : 2, balandlik h_c formula bilan tomonlardan topiladi (katta tomonga kichik balandlik mos keladi), Geron formulasi S = kvadrat ildiz(p(p-a)(p-b)(p-c)) esa yuzani faqat uch tomondan topadi. Darslikning o'zi to'liq isbotni iqtidorli o'quvchilarga qoldirgan (30*-mavzu), shu sabab bu darsda formulalar ishlatishga urg'u berilgan. Darslikdan (geometriya, 3-§, 30-31-mavzu, 101-103-bet). Yangi pribor yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars46.jsx')),
  },
  {
    slug: 'dars47-pifagor-masalalar-yechish',
    title: 'Dars 47. Pifagor teoremasi bilan masalalar yechish',
    desc: "Pifagor teoremasi amaliyotda uch xil vazifada ishlatiladi: burchakning to'g'ri ekanini tekshirish (3, 4, 5 uchligi, ustunni tik o'rnatish), noma'lum tomonni tenglama tuzib topish, va teng tomonli uchburchakning balandligi hamda yuzasini (S = a²·kvadrat ildiz 3 : 4) topish. Darslikdan (geometriya, 3-§, 32-mavzu, 104-106-bet). BLOK Б7NING PIFAGOR QISMI YAKUNLANADI. Yangi pribor yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars47.jsx')),
  },
  {
    slug: 'dars48-aylana-markaziy-burchak',
    title: 'Dars 48. Aylana, markaziy burchak',
    desc: "Aylananing markazidan o'tuvchi vatar diametr deyiladi. Uchi markazda bo'lgan burchak markaziy burchak. Yoyning gradus o'lchovi, u yarim aylanadan kichik bo'lsa markaziy burchakka teng, katta bo'lsa 360° dan burchak ayrilib topiladi. Darslikdan (geometriya, 4-§, 33-mavzu, 107-108-bet). BLOK Б7NING AYLANA QISMI BOSHLANADI. Yangi pribor: CircleFigure. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars48.jsx')),
  },
  {
    slug: 'dars49-vatar-diametr-xossalari',
    title: 'Dars 49. Aylana vatari va diametrining xossalari',
    desc: "Vatarga perpendikulyar diametr shu vatarni va unga tiralgan yoyni teng ikkiga bo'ladi (faqat perpendikulyar bo'lganda). Vatar diametridan katta bo'lmaydi. Markazdan vatargacha bo'lgan masofa radius va vatarning yarmi orqali Pifagor teoremasi bilan topiladi. Darslikdan (geometriya, 4-§, 34-mavzu, 109-110-bet). Yangi pribor yo'q, CircleFigure va ProofLines qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars49.jsx')),
  },
  {
    slug: 'dars50-togri-chiziq-aylana-urinma',
    title: "Dars 50. To'g'ri chiziq va aylana, urinma",
    desc: "Markazdan chiziqqacha masofa d radiusdan katta bo'lsa umumiy nuqta yo'q, teng bo'lsa aylana urinadi (bitta nuqta), kichik bo'lsa ikkita umumiy nuqta bor. Urinma urinish nuqtasiga o'tkazilgan radiusga perpendikulyar. Bir nuqtadan o'tkazilgan ikki urinma teng. Darslikdan (geometriya, 4-§, 35-mavzu, 111-113-bet). Yangi pribor yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars50.jsx')),
  },
  {
    slug: 'dars51-ichki-chizilgan-burchak',
    title: 'Dars 51. Aylanaga ichki chizilgan burchak',
    desc: "Uchi aylanada, tomonlari vatar bo'lgan burchak ichki chizilgan burchak, u o'z uchidan qarama-qarshi yoyga tiraladi va shu yoyning yarmi bilan o'lchanadi. Bir yoyga tiralgan burchaklar teng, diametrga tiralgan burchak esa har doim to'g'ri burchak. Darslikdan (geometriya, 4-§, 36-mavzu, 114-117-bet). Yangi pribor yo'q, CircleFigure va ProofLines qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars51.jsx')),
  },
  {
    slug: 'dars52-ichki-tashqi-aylana-kesuvchi',
    title: 'Dars 52. Ichki va tashqi chizilgan aylanalar, kesuvchi burchaklari',
    desc: "Har qanday uchburchakka ichki aylana chizish mumkin (markazi bissektrisalar kesishgan nuqta) va tashqi aylana chizish mumkin (markazi o'rta perpendikulyarlar kesishgan nuqta). To'g'ri burchaklida R=gipotenuza:2, r=(katet+katet−gipotenuza):2. Ichki chizilgan to'rtburchakda burchaklar yig'indisi 180°, tashqi chizilganida tomonlar yig'indilari teng. Darslikdan (geometriya, 4-§, 37-39-mavzu, 118-125-бет, uch mavzu bir darsga sig'diriladi). BLOK Б7NING AYLANA QISMI YAKUNLANADI. Yangi pribor yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars52.jsx')),
  },
  {
    slug: 'dars53-vektor-qoshish-ayirish',
    title: 'Dars 53. Vektor tushunchasi, qo\'shish va ayirish',
    desc: "Vektor, yo'nalishga ega kesma; uzunligi va yo'nalishi bir xil bo'lgan vektorlar teng, joylashuvi ahamiyatsiz. Vektorlar uchburchak qoidasi bilan qo'shiladi, AB+BC=AC; bitta nuqtadan chiqqan ikki vektorning ayirmasi ikkinchisining uchidan birinchisining uchiga qaraydi, OA−OB=BA. BLOK Б7NING VEKTOR QISMI BOSHLANADI. Darslikdan (geometriya, 5-§, 40-41-mavzu, 129-135-bet). Yangi pribor VectorFigure. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars53.jsx')),
  },
  {
    slug: 'dars54-vektor-songa-kopaytirish',
    title: "Dars 54. Vektorni songa ko'paytirish, masalalarga tatbig'i",
    desc: "k·a⃗ vektorining moduli |k|·|a⃗| ga teng; k musbat bo'lsa yo'nalishi a⃗ bilan bir xil, manfiy bo'lsa teskari. a⃗ va k·a⃗ har doim kollinear. C, AB kesmasining o'rtasi bo'lsa, ixtiyoriy O uchun OC⃗=½(OA⃗+OB⃗); uchburchak o'rta chizig'i uchinchi tomonning yarmiga teng. Darslikdan (geometriya, 5-§, 42-43-mavzu, 136-140-bet). Yangi pribor yo'q, VectorFigure qayta ishlatilgan. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars54.jsx')),
  },
  {
    slug: 'dars55-vektor-koordinatalari-skalyar',
    title: "Dars 55. Vektor koordinatalari, skalyar ko'paytma",
    desc: "Vektorning koordinatalari, oxiri koordinatalaridan boshi koordinatalarini ayirish natijasi: AB⃗(x2−x1; y2−y1). Koordinatalar bilan berilgan vektorlarni qo'shish, ayirish, songa ko'paytirish mos koordinatalar ustida bajariladi. Skalyar ko'paytma x1x2+y1y2 ga teng SON (vektor emas); modul, shu yig'indining ildizi. Darslikdan (geometriya, 5-§, 44-46-mavzu, 142-147-bet). BLOK Б7 VA BUTUN 8-SINF KURSI YAKUNLANADI. Yangi pribor yo'q. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars55.jsx')),
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
    title: 'Dars 1 amaliyoti — ratsional ifodalar va kasrlar (10 topshiriq)',
    desc: "Qayta yaratildi (metodist, 2026-08-22): ilgari bu yerda 7-sinf amaliyotining nusxasi turgan edi. O'nta topshiriq o'nta XIL usulda: mantiqiy test, ikki guruh, ha-yo'q, kvadrat kartalar pazli, eng katta qiymat, belgilash, seyf kodi, so'zlar, qadamlar tartibi, ma'lumot va kasr juftligi. Hammasi bitta savol atrofida: kasr qaysi qiymatda ma'noga ega emas. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars01/Dars01Practice.jsx')),
  },
  // 2-DARS AMALIYOTI — sinfning O'Z mexanikalarida (metodist qarori 2026-08-22).
  // 1-darsdan farqi: nusxa emas, umumiy qatlam practice/kit.jsx dan o'nta
  // XIL mexanika. Dizayn va ranglar 7-sinfnikidek qoldi, savol tiplari
  // esa TIPLAR_AMALIYOT_8SINF.md §5 ro'yxatidan.
  // Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md (2026-08-24 dagi
  // qayta yaratish), skelet: DARS02_06_AMALIYOT_SKELET.md
  {
    slug: 'dars02-amaliyot',
    title: "Dars 2 amaliyoti — kasrning asosiy xossasi (10 topshiriq)",
    desc: "Qayta yaratildi (metodist, 2026-08-24): o'nta topshiriq 1-DARSNING o'nta usulida, lekin boshqa ketma-ketlikda — ha yoki yo'q, to'liq javob testi, ikki guruh, yangi taqiqni yozish, pazl, belgilash, seyf kodi, juftlash, qoidaning so'zlari, qadamlar tartibi. Hammasi bitta savol atrofida: surat va maxrajni bir xil ifodaga ko'paytirsak nima o'zgaradi va nima o'zgarmaydi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars02/Dars02Practice.jsx')),
  },
  // 3-DARSDAN BOSHLAB: 2-darsning o'nta usuli ARALASH tartibda (metodist
  // qarori 2026-08-22). Taqsimot dars raqamidan hisoblanadi va qayta
  // yig'ilganda o'zgarmaydi: scripts/grade8-practice-layout.mjs
  {
    slug: 'dars03-amaliyot',
    title: 'Dars 3 amaliyoti — kasrlarni qisqartirish (10 topshiriq)',
    desc: "Qayta yaratildi (metodist, 2026-08-24): o'nta topshiriq 1-DARSNING o'nta usulida, 2-darsdagidan boshqa tartibda — belgilash, ha yoki yo'q, son yozish, juftlash, guruhlar, qadamlar tartibi, test, pazl, seyf kodi, qoida so'zlari. Qisqartirish faqat ko'paytuvchi bo'yicha, taqiqni esa dastlabki kasr belgilaydi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars03/Dars03Practice.jsx')),
  },
  {
    slug: 'dars04-amaliyot',
    title: "Dars 4 amaliyoti — kasrlarni qo'shish va ayirish (10 topshiriq)",
    desc: "Qayta yaratildi (metodist, 2026-08-24): o'nta topshiriq 1-DARSNING o'nta usulida, 3-darsdan boshqa tartibda — test, belgilash, ha yoki yo'q, qoida so'zlari, seyf kodi, son yozish, guruhlar, qadamlar tartibi, juftlash, pazl. Bir xil maxrajda suratlar qo'shiladi, boshqasida umumiy maxrajga keltiriladi, shart esa har bir dastlabki maxrajdan yig'iladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars04/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot',
    title: "Dars 5 amaliyoti — kasrlarni ko'paytirish va bo'lish (10 topshiriq)",
    desc: "Qayta yaratildi (metodist, 2026-08-24): o'nta topshiriq 1-DARSNING o'nta usulida, 4-darsdan boshqa tartibda — ha yoki yo'q, guruhlar, belgilash, qadamlar tartibi, test, juftlash, pazl, qoida so'zlari, son yozish, seyf kodi. Darsning eng qimmat joyi — uchinchi shart: bo'luvchining surati ham nolga aylanmasligi kerak. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars05/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot',
    title: "Dars 6 amaliyoti — ifodalarni almashtirish (10 topshiriq)",
    desc: "Qayta yaratildi (metodist, 2026-08-24): o'nta topshiriq 1-DARSNING o'nta usulida, 5-darsdan boshqa tartibda — belgilash, test, ha yoki yo'q, pazl, qoida so'zlari, guruhlar, juftlash, seyf kodi, qadamlar tartibi, javobni yozish. Blokning oxirgi kasr darsi: qavs tartibni o'zgartiradi, shartlar esa oraliq satrlardan ham yig'iladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars06/Dars06Practice.jsx')),
  },
  // 7-11 DARSLAR AMALIYOTI — 1-DARSNING O'NTA MEXANIKASI, har darsda
  // BOSHQA tartibda (metodist qarori 2026-08-24). Skelet va taqsimot:
  // src/books/grade8/DARS07_11_AMALIYOT_SKELET.md
  // Ikki yangilik umumiy qatlamda: ildiz USTKI CHIZIQ bilan (`frac.jsx` ->
  // `Root`) va CHIZMALAR (`practice/fig.jsx`) — chizma yozuvning tokeni,
  // yangi mexanika emas.
  {
    slug: 'dars07-amaliyot',
    title: 'Dars 7 amaliyoti — y = k/x va uning grafigi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, ha-yo'q, guruhlar, koeffitsient, nuqta va formula, qaysi chizma, so'zlar, seyf kodi, pazl, qadamlar tartibi. To'rt topshiriqda CHIZMA: tarmoq joyi guruh sarlavhasi bo'lib, nuqtaning koordinatasi chizmadan o'qilib, to'rt variant to'rt chizma bo'lib va qurish qadamlari chizma bilan. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars07/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot',
    title: "Dars 8 amaliyoti — arifmetik ildiz va kasr ko'rsatkich (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: nechta son, belgilash, qiymat, pazl, ha-yo'q, moslashtirish, guruhlar, so'zlar, qadamlar tartibi, seyf kodi. Ildiz USTKI CHIZIQ bilan, kasr ko'rsatkich esa ikki qavatli kasr bo'lib yoziladi. 05-topshiriqda CHIZMA: minus yetti va yetti noldan bir xil masofada — modul shu masofa. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars08/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot',
    title: 'Dars 9 amaliyoti — kvadrat ildiz tushunchasi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, guruhlar, belgilash, so'zlar, chegaralar, qadamlar tartibi, sanoq, pazl, seyf kodi, moslashtirish. B2 blokining birinchi amaliyoti: ildiz har qanday nomanfiy sonda bor, lekin butun chiqmaydi. 06-topshiriqda CHIZMA — son o'qida ildizning o'rni. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars09/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot',
    title: 'Dars 10 amaliyoti — arifmetik kvadrat ildiz (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, test, ha-yo'q, seyf kodi, guruhlar, so'zlar, qadamlar tartibi, moslashtirish, eng kichik qiymat, pazl. Darsning eng qimmat joyi — MODUL: kvadratdan olingan ildiz sonning o'zini emas, modulini beradi. 07-topshiriqda CHIZMA — son o'qida t ning tomoni. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars10/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-amaliyot',
    title: 'Dars 11 amaliyoti — ildizning xossalari (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, qiymat, qaysi katta, moslashtirish, belgilash, pazl, seyf kodi, qadamlar tartibi, guruhlar, so'zlar. Uch xossa ishga tushadi: kvadrat ildizni yechadi, kvadratdan modul chiqadi, ildiz osti katta bo'lsa ildiz ham katta. 08-topshiriqda CHIZMA — son o'qida taqqoslash savoli. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars11/Dars11Practice.jsx')),
  },
  // 12-14 DARSLAR AMALIYOTI — o'sha o'nta mexanika, yana boshqa tartibda
  // (metodist qarori 2026-08-24). Skelet va taqsimot:
  // src/books/grade8/DARS12_14_AMALIYOT_SKELET.md, tekshiruvi
  // `node scripts/grade8-practice-seq.mjs check`.
  // Umumiy qatlamga yangi narsa QO'SHILMADI: `kit.jsx` ning o'nligi, `frac.jsx`
  // ning ildizi va `fig.jsx` ning `axis` speci o'sha holida ishlatildi.
  // 15 va 16-dars TO'XTATIB QO'YILDI (metodist, o'sha kun).
  {
    slug: 'dars12-amaliyot',
    title: "Dars 12 amaliyoti — ko'paytmadan kvadrat ildiz (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: teng yoki teng emas, qiymat, guruhlar, so'zlar, pazl, juftlash, qadamlar tartibi, belgilash, shart, seyf kodi. Darsning butun og'irligi bitta farqda: ildiz KO'PAYTUVCHILARGA bo'linadi, hadlarga esa yo'q. Shart ham shu yerda tekshiriladi — ikkala ko'paytuvchi nomanfiy bo'lishi kerak. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars12/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot',
    title: "Dars 13 amaliyoti — ildizli ifodalarni o'zgartirish (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: qisqaroq, guruhlar, belgilash, ha-yo'q, juftlash, so'zlar, seyf kodi, pazl, kiritish, qadamlar tartibi. Uch ish birga: ildiz ostidan chiqarish, ildiz ostiga kiritish va ildizli hadlarni qo'shish. Har razbor javobni KVADRATGA OSHIRIB rad etadi — tekshirish usuli darsning o'zidan. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars13/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot',
    title: 'Dars 14 amaliyoti — irratsional sonlar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, qaysi son, ha-yo'q, seyf kodi, so'zlar, guruhlar, aniq va yaqin, nechta, isbot, juftlash. Uch adashish qayta-qayta tekshiriladi: ildiz belgisi sonni irratsional qilmaydi, cheksiz yozuv ham belgi emas, yaqinlashish esa aniq qiymat emas. 07-topshiriqda CHIZMA — son o'qida ikkidan ildizning joyi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars14/Dars14Practice.jsx')),
  },
  // 15-20 DARSLAR AMALIYOTI — Б3 bloki, kvadrat tenglamalar (metodist qarori
  // 2026-08-24). O'sha o'nta mexanika, yana boshqa tartibda. Skelet va
  // taqsimot: src/books/grade8/DARS15_20_AMALIYOT_SKELET.md, tekshiruvi
  // `node scripts/grade8-practice-seq.mjs check`.
  // Guruh IKKI UCHLIKDAN yig'ilgan (15-17 va 18-20): «har mexanika guruh
  // ichida har xil pozitsiyada» sharti olti darsli guruhda bajarilmaydi —
  // 1-3 pozitsiyalarga faqat besh tip qo'yish mumkin.
  // Umumiy qatlamga hech narsa qo'shilmadi.
  {
    slug: 'dars15-amaliyot',
    title: 'Dars 15 amaliyoti — kvadrat tenglama va uning elementlari (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: kvadratmi, ozod had, ishora, juftlash, qadamlar tartibi, pazl, so'zlar, c ni topish, qaysi tenglama, seyf kodi. Darsning ikki qimmat joyi: a nolga teng bo'lsa tenglama kvadrat bo'lmay qoladi, va koeffitsiyent ISHORASI bilan o'qiladi. 09-topshiriqda ikki shart birga tekshiriladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars15/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot',
    title: 'Dars 16 amaliyoti — chala kvadrat tenglamalar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ildizlar, musbat ildiz, chala, seyf kodi, so'zlar, qadamlar tartibi, nechta, guruhlar, ha-yo'q, juftlash. Darsning eng qimmat xatosi to'rt joyda tekshiriladi: ikki tomonni x ga bo'lish x = 0 ildizini yo'qotadi. 02-topshiriqda CHIZMA — son o'qida nolga simmetrik ikki nuqta. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars16/Dars16Practice.jsx')),
  },
  {
    slug: 'dars17-amaliyot',
    title: 'Dars 17 amaliyoti — kvadrat tenglama ildizlari formulasi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: minus b, ildizlar, diskriminant, to'la kvadrat, seyf kodi, ha-yo'q, qadamlar tartibi, juftlash, pazl, so'zlar. Formula yodlanmaydi — u to'la kvadratni ajratishdan chiqadi (04 va 07). b ning ishorasi D ga ta'sir qilmaydi, c ning ishorasi esa qiladi: bu farq 09 da ochiq ko'rsatilgan. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars17/Dars17Practice.jsx')),
  },
  {
    slug: 'dars18-amaliyot',
    title: 'Dars 18 amaliyoti — diskriminant va ildizlar soni (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, ishora, nechta, ikki ildiz, juftlash, test, seyf kodi, qadamlar tartibi, pazl, so'zlar. Darsning butun og'irligi bitta farqda: «D nolga teng» «ildiz yo'q» degani emas — beshta topshiriqda va bitta qoidada tekshiriladi, va har joyda razbor ildizni QO'YIB ko'rsatadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars18/Dars18Practice.jsx')),
  },
  {
    slug: 'dars19-amaliyot',
    title: 'Dars 19 amaliyoti — Viyet teoremasi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: keltirilgan, yig'indi, ha-yo'q, so'zlar, seyf kodi, qadamlar tartibi, pazl, ikkinchi ildiz, ishoralar, juftlash. Ikki qoida ikki xil ishlaydi: YIG'INDI ishorani almashtiradi, KO'PAYTMA esa yo'q. 07 da ko'paytma yordam bermaydi, 09 da esa aksincha — faqat u hal qiladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars19/Dars19Practice.jsx')),
  },
  {
    slug: 'dars20-amaliyot',
    title: 'Dars 20 amaliyoti — kasr-ratsional tenglamalar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: taqiq, ha-yo'q, ruxsat, seyf kodi, pazl, yechish, qadamlar tartibi, so'zlar, juftlash, guruhlar. Blokning eng qimmat joyi — BEGONA ILDIZ: maxrajlarga ko'paytirilgan tenglama ko'proq ildizga ega bo'lishi mumkin, va sohadan chetdagi ildiz rad etiladi. 09-topshiriqda maxrajdagi bitta ishora javobni almashtiradi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars20/Dars20Practice.jsx')),
  },

  // 21-30 — 15-20 bilan bir xil qoida bo'yicha (metodist tasdig'i 2026-08-25).
  // O'sha o'nta mexanika, yana boshqa tartibda. Skelet va taqsimot:
  // src/books/grade8/DARS21_30_AMALIYOT_SKELET.md, tekshiruvi
  // `node scripts/grade8-practice-seq.mjs check`.
  // Guruh UCH UCHLIKDAN va bitta yolg'iz qatordan yig'ilgan (21-23, 24-26,
  // 27-29, 30): o'nta dars uchtaga bo'linmaydi, guruh esa uchtadan katta
  // bo'lolmaydi — 1-pozitsiyaga faqat uch tip qo'yiladi.
  // Umumiy qatlamga bitta narsa qo'shildi: `fig.jsx` ning `spans` maydoni
  // (son o'qida oraliqning O'ZI), skelet §0a.2.
  {
    slug: 'dars21-amaliyot',
    title: 'Dars 21 amaliyoti — kvadrat tenglamalar bilan masalalar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: bir shart, eni, guruhlar, seyf kodi, pazl, ha-yo'q, qadamlar tartibi, juftlash, so'zlar, tenglama. Blokning yangi ishi — RAD ETISH: tenglamaning ildizi bo'lish yetarli emas, javob masalaning kattaligiga mos kelishi kerak. 10-topshiriqda daqiqa soatga o'tkaziladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars21/Dars21Practice.jsx')),
  },
  {
    slug: 'dars22-amaliyot',
    title: "Dars 22 amaliyoti — ko'paytuvchilar va bikvadrat tenglamalar (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: ko'paytuvchilar, guruhlar, nechta, pazl, bikvadrat, seyf kodi, ha-yo'q, qadamlar tartibi, juftlash, so'zlar. Belgilashning oxirgi qadami eng ko'p tashlab ketiladi — x ga QAYTISH, va u har musbat t dan ikki ildiz beradi. 09-topshiriqda to'rt tenglama bitta uch soni atrofida yig'ilgan. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars22/Dars22Practice.jsx')),
  },
  {
    slug: 'dars23-amaliyot',
    title: 'Dars 23 amaliyoti — sonli tengsizliklar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, qaysi katta, musbat ayirma, qadamlar tartibi, teskari ayirma, so'zlar, seyf kodi, pazl, guruhlar, juftlash. Б4 blokining birinchi amaliyoti: taqqoslashni sonlarning ko'rinishi emas, AYIRMANING ISHORASI hal qiladi. 09-topshiriqda har juftlik teskarisi bilan yonma-yon turadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars23/Dars23Practice.jsx')),
  },
  {
    slug: 'dars24-amaliyot',
    title: 'Dars 24 amaliyoti — tengsizliklarning xossalari (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, munosabat, chegara, seyf kodi, pazl, qadamlar tartibi, guruhlar, xulosalar, juftlash, so'zlar. Butun og'irlik bitta farqda: manfiy songa ko'paytirish ishorani buradi, musbat esa yo'q. 05-topshiriqda uchinchi hol — nolga ko'paytirish; 08-topshiriqda kvadratga oshirish kontrprimer bilan rad etiladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars24/Dars24Practice.jsx')),
  },
  {
    slug: 'dars25-amaliyot',
    title: 'Dars 25 amaliyoti — chiziqli tengsizliklar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: yechim, yechimlar, guruhlar, eng kichik, seyf kodi, juftlash, pazl, so'zlar, ha-yo'q, qadamlar tartibi. 01 va 02 chegara nuqtasini ikki tomondan ko'rsatadi: qat'iy tengsizlikda u yechim emas, chiziqli belgida esa yechim. 04-topshiriqda CHIZMA — son o'qi va ikki bo'linma orasidagi chegara. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars25/Dars25Practice.jsx')),
  },
  {
    slug: 'dars26-amaliyot',
    title: 'Dars 26 amaliyoti — tengsizliklar sistemasi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: yechimlar, guruhlar, ha-yo'q, pazl, yechim, seyf kodi, nechta, qadamlar tartibi, so'zlar, juftlash. Blokning eng qimmat farqi — KESISHTIRISH va birlashtirish: 10-topshiriqda to'rt sistemada o'sha ikki son turadi, javoblar esa oraliq, nur, nur va bo'sh to'plam. 07-topshiriqda CHIZMA. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars26/Dars26Practice.jsx')),
  },
  {
    slug: 'dars27-amaliyot',
    title: 'Dars 27 amaliyoti — sonli oraliqlar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, nechta, tegishli, pazl, guruhlar, so'zlar, yozuv, qadamlar tartibi, chizmalar, seyf kodi. Butun og'irlik qavsning turida: kvadrat qavs chegarani kiritadi, dumaloq chiqarib tashlaydi. 09-topshiriqda to'rt oraliqning to'rt CHIZMASI — to'plamning o'zi ham chizilgan. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars27/Dars27Practice.jsx')),
  },
  {
    slug: 'dars28-amaliyot',
    title: 'Dars 28 amaliyoti — tengsizliklar bilan masalalar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: tengsizlik, ha-yo'q, guruhlar, so'zlar, eng ko'pi, seyf kodi, qadamlar tartibi, pazl, mos javoblar, juftlash. 21-darsdan farqi bitta so'zda: «teng» tenglama berardi, «yetadi» esa tengsizlik beradi. Yechim hali javob emas — sanoq butun bo'ladi, uzunlik musbat. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars28/Dars28Practice.jsx')),
  },
  {
    slug: 'dars29-amaliyot',
    title: 'Dars 29 amaliyoti — sonning moduli (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: qiymati besh, guruhlar, ildizlar, juftlash, so'zlar, qadamlar tartibi, nechta, seyf kodi, ha-yo'q, pazl. Ikki qimmat joy: modulli tenglamaning ikkita ildizi bor, va |x| ≥ a ning yechimi kesma emas, IKKI NUR. 08-topshiriq ataylab unutilgan manfiy ildizni izlatadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars29/Dars29Practice.jsx')),
  },
  {
    slug: 'dars30-amaliyot',
    title: 'Dars 30 amaliyoti — taqribiy hisoblashlar va xatoliklar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, mumkin, yaxlitlash, so'zlar, guruhlar, seyf kodi, pazl, juftlash, qadamlar tartibi, nisbiy xatolik. Blokning yakuni: absolut xatolik «qancha» degan savolga javob beradi, nisbiysi esa ANIQLIKNI taqqoslaydi. 08-topshiriqda to'rt o'lchovda absolut xatolik bitta, nisbiysi esa yigirma barobar farq qiladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars30/Dars30Practice.jsx')),
  },

  // 31-40 — 21-30 bilan bir xil qoida bo'yicha (metodist tasdig'i 2026-08-25).
  // O'sha o'nta mexanika, yana boshqa tartibda. Skelet va taqsimot:
  // src/books/grade8/DARS31_40_AMALIYOT_SKELET.md, tekshiruvi
  // `node scripts/grade8-practice-seq.mjs check`.
  // Guruh yana uch uchlikdan va bitta yolg'iz qatordan yig'ilgan (31-33,
  // 34-36, 37-39, 40), chegaralar esa MAVZU bo'yicha qo'yilgan.
  //
  // IKKI QAROR UMUMIY QATLAMGA TEGDI (skelet §0a.1 va §0a.2):
  //   1. «Birinchi uchtalik takrorlanmasin» sharti DERAZALI bo'ldi (12 dars):
  //      global shart 31-darsda arifmetik jihatdan bajarilmay qolardi —
  //      36 ta mumkin bo'lgan boshlanishdan 27 tasi band edi.
  //   2. `fig.jsx` ga `poly` turi qo'shildi: 37-40 geometriya, va chizmasiz
  //      «qaysi kesma balandlik» degan savol ta'rifni yodlatadi.
  //
  // HA/YO'Q JAVOBLARI TO'RT KOMBINATSIYADA aylanadi (skelet §0a.3): 21-28
  // darslarning sakkiztasida ham javob «Ha, Yo'q» bo'lgan, ya'ni mexanikani
  // mazmunsiz yengish mumkin edi.
  {
    slug: 'dars31-amaliyot',
    title: "Dars 31 amaliyoti — butun ko'rsatkichli daraja (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: test, guruhlar, ha-yo'q, juftlash, qadamlar tartibi, belgilash, pazl, maxraj, seyf kodi, so'zlar. Б5 blokining birinchi amaliyoti: manfiy ko'rsatkich ISHORANI emas, sonning o'zini ag'daradi, taqiqni esa ko'rsatkich emas, ASOS beradi. 03-topshiriqda ikkala javob ham «Ha». UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars31/Dars31Practice.jsx')),
  },
  {
    slug: 'dars32-amaliyot',
    title: "Dars 32 amaliyoti — darajaning xossalari (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, test, ko'rsatkich, qadamlar tartibi, pazl, juftlash, ha-yo'q, so'zlar, guruhlar, seyf kodi. Butun og'irlik bitta belgida: QAVS bor-yo'qligi ko'rsatkichlar qo'shiladimi yoki ko'paytiriladimi degan savolni hal qiladi. 07-topshiriqda ikki yozuvda aynan o'sha uch son turadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars32/Dars32Practice.jsx')),
  },
  {
    slug: 'dars33-amaliyot',
    title: "Dars 33 amaliyoti — sonning standart ko'rinishi (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, ko'rsatkich, guruhlar, belgilash, seyf kodi, qadamlar tartibi, so'zlar, test, juftlash, pazl. Mantissaning sharti IKKI tomondan chegaralangan, va o'quvchi odatda faqat bittasini eslaydi. 08-topshiriqning ikki xato varianti TO'G'RI sonni beradi, lekin yozuvi standart emas. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars33/Dars33Practice.jsx')),
  },
  {
    slug: 'dars34-amaliyot',
    title: "Dars 34 amaliyoti — ma'lumotlarni yig'ish (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: test, belgilash, ha-yo'q, pazl, juftlash, seyf kodi, so'zlar, chastota, qadamlar tartibi, guruhlar. Chastota — SANOQ, nisbiy chastota — ULUSH, va ular bitta sondan chiqadi. 10-topshiriqda tanlanma umuman yo'q: sonning ko'rinishi javobni beradi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars34/Dars34Practice.jsx')),
  },
  {
    slug: 'dars35-amaliyot',
    title: "Dars 35 amaliyoti — o'rtacha, moda, mediana (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, o'rtacha, test, belgilash, pazl, so'zlar, qadamlar tartibi, guruhlar, seyf kodi, juftlash. Uch o'lchov uch xil ish talab qiladi: qo'shish, sanash va o'rin. 09-topshiriqda bitta qator uch xil javob beradi — 2, 3 va 4. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars35/Dars35Practice.jsx')),
  },
  {
    slug: 'dars36-amaliyot',
    title: 'Dars 36 amaliyoti — kombinatorika (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, ha-yo'q, nechta, seyf kodi, so'zlar, juftlash, pazl, test, guruhlar, qadamlar tartibi. «Va» ko'paytiradi, «yoki» qo'shadi — Б5 blokining yakuniy farqi. 02-topshiriqda ikkala javob ham «Yo'q», chunki takrorli va takrorsiz holatlarning sonlari almashtirilgan. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars36/Dars36Practice.jsx')),
  },
  {
    slug: 'dars37-amaliyot',
    title: 'Dars 37 amaliyoti — parallelogramm (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, figuralar, guruhlar, burchaklar, so'zlar, tomon, seyf kodi, ta'rif, qadamlar tartibi, pazl. Б6 blokining birinchi amaliyoti va sinfda BIRINCHI CHIZMALI topshiriq: 02 da olti to'rtburchakdan uchtasi parallelogramm, va ta'rif ko'z bilan tekshiriladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars37/Dars37Practice.jsx')),
  },
  {
    slug: 'dars38-amaliyot',
    title: "Dars 38 amaliyoti — to'g'ri to'rtburchak, romb, kvadrat (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: figuralar, guruhlar, tomon, so'zlar, pazl, seyf kodi, qadamlar tartibi, ha-yo'q, xulosa, chizmalar. Naqsh bitta: to'g'ri to'rtburchak — BURCHAK va tenglik, romb — TOMON va perpendikulyarlik. 10-topshiriqda to'rt chizmada diagonallar o'tkazilgan, ya'ni shart ko'rinib turadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars38/Dars38Practice.jsx')),
  },
  {
    slug: 'dars39-amaliyot',
    title: 'Dars 39 amaliyoti — trapetsiya (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ta'rif, burchak, ha-yo'q, figuralar, qadamlar tartibi, guruhlar, so'zlar, pazl, juftlash, seyf kodi. Ta'rif IKKI shartdan iborat, va ikkinchisi — inkor — doim tashlab ketiladi. 03-topshiriqda ikkala javob ham «Yo'q»: asoslari teng trapetsiya umuman mavjud emas. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars39/Dars39Practice.jsx')),
  },
  {
    slug: 'dars40-amaliyot',
    title: 'Dars 40 amaliyoti — parallelogrammning yuzi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: balandlik, ha-yo'q, yuza, guruhlar, qadamlar tartibi, pazl, juftlash, seyf kodi, so'zlar, chizmalar. Yuza bloki shu darsdan boshlanadi. Ikki chizmali topshiriq: 01 da balandlikni yon tomondan ajratish, 10 da esa bir xil asos va balandlikdagi uch figurani qiyalikdan qat'i nazar tanish kerak. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars40/Dars40Practice.jsx')),
  },
  {
    slug: 'dars41-amaliyot',
    title: 'Dars 41 amaliyoti — uchburchakning yuzi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, guruhlar, figuralar, seyf kodi, test, so'zlar, juftlash, qadamlar tartibi, pazl, yuza. Butun dars bitta adashish atrofida qurilgan — ikkiga bo'lish unutilishi. 03-topshiriqda olti uchburchakdan uchtasining asosi va balandligi bir xil, qiyaligi esa boshqa: tengdoshlik ko'z bilan ko'rinadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars41/Dars41Practice.jsx')),
  },
  {
    slug: 'dars42-amaliyot',
    title: 'Dars 42 amaliyoti — trapetsiyaning yuzi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: test, yuza, guruhlar, juftlash, seyf kodi, ha-yo'q, figuralar, pazl, so'zlar, qadamlar tartibi. Asoslar QO'SHILADI, ko'paytirilmaydi; balandlik esa yon tomon emas. 06-topshiriqda ikkala javob ham «Ha», va yuk razborga o'tadi. 07 da olti trapetsiyadan uchtasida chizilgan kesma balandlik. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars42/Dars42Practice.jsx')),
  },
  {
    slug: 'dars43-amaliyot',
    title: "Dars 43 amaliyoti — Falyes teoremasi, o'rta chiziq (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: figuralar, test, ha-yo'q, so'zlar, qadamlar tartibi, pazl, asos, guruhlar, seyf kodi, juftlash. Ikki qoida yonma-yon: uchburchakda o'rta chiziq tomonning yarmi, trapetsiyada esa asoslar yig'indisining yarmi. 03-topshiriqda ikkala javob ham «Yo'q» — yarim yo'q va yarim noto'g'ri tomonda. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars43/Dars43Practice.jsx')),
  },
  {
    slug: 'dars44-amaliyot',
    title: 'Dars 44 amaliyoti — Pifagor teoremasi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, guruhlar, test, seyf kodi, pazl, so'zlar, tomon, juftlash, qadamlar tartibi, tenglik. Bu darsda faqat TENGLIK tekshiriladi, xulosa 45-darsda. Uzunliklar emas, kvadratlar qo'shiladi — va bankdagi tuzoqlar aynan shu adashishdan. 10-topshiriqda bitta tenglikning olti yozuvidan uchtasi rost. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars44/Dars44Practice.jsx')),
  },
  {
    slug: 'dars45-amaliyot',
    title: 'Dars 45 amaliyoti — teskari teorema (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: test, belgilash, tomon, juftlash, qadamlar tartibi, ha-yo'q, seyf kodi, pazl, guruhlar, so'zlar. Tekshirish IKKI qadamda: avval eng katta tomonni aniqlash, keyin kvadratlarni solishtirish. Uchliklar ataylab a, b, c tartibida yozilmaydi, va 09-topshiriqda ikki chegara holati bor — farq bittada. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars45/Dars45Practice.jsx')),
  },
  {
    slug: 'dars46-amaliyot',
    title: 'Dars 46 amaliyoti — Geron formulasi (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, test, guruhlar, pazl, juftlash, balandlik, qadamlar tartibi, so'zlar, seyf kodi, ha-yo'q. Yarim perimetr perimetrning O'ZI emas, va katta tomonga KICHIK balandlik mos keladi. 05 va 06 bir uchburchakda davom etadi: avval Geron bilan yuza, keyin yuzadan balandlik. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars46/Dars46Practice.jsx')),
  },
  {
    slug: 'dars47-amaliyot',
    title: 'Dars 47 amaliyoti — Pifagor bilan masalalar (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, kvadrat, test, ha-yo'q, qadamlar tartibi, seyf kodi, juftlash, so'zlar, pazl, guruhlar. Har figurada to'g'ri burchakli uchburchakni KO'RISH kerak: trapetsiyada asoslar ayirmasidan, teng tomonlida yarim asosdan, rombda yarim diagonallardan. 04-topshiriqda ip 3 : 4 : 5 nisbatda bo'linadi, teng emas. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars47/Dars47Practice.jsx')),
  },
  {
    slug: 'dars48-amaliyot',
    title: 'Dars 48 amaliyoti — aylana, markaziy burchak (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: ha-yo'q, yoy, guruhlar, seyf kodi, juftlash, figuralar, so'zlar, qadamlar tartibi, pazl, test. Ikki nuqta aylanada IKKI yoy hosil qiladi: kichigi markaziy burchakka teng, kattasi 360° dan ayirish bilan topiladi. 06-topshiriqda sinfda BIRINCHI AYLANALI chizma: olti vatardan uchtasi diametr. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars48/Dars48Practice.jsx')),
  },
  {
    slug: 'dars49-amaliyot',
    title: 'Dars 49 amaliyoti — vatar va diametr (10 topshiriq)',
    desc: "O'nta topshiriq o'nta xil usulda: figuralar, ha-yo'q, test, so'zlar, seyf kodi, guruhlar, masofa, pazl, juftlash, qadamlar tartibi. Vatarni teng ikkiga bo'ladigan diametr — faqat PERPENDIKULYAR diametr, va hisobga vatarning YARMI kiradi. 09-topshiriqda bir aylanada masofa o'sganda vatar qisqarishi ko'rinadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars49/Dars49Practice.jsx')),
  },
  {
    slug: 'dars50-amaliyot',
    title: "Dars 50 amaliyoti — to'g'ri chiziq va aylana, urinma (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: test, belgilash, ha-yo'q, qadamlar tartibi, guruhlar, so'zlar, juftlash, nuqtalar, seyf kodi, pazl. Uch holat masofa bilan hal qiladi: d > R, d = R, d < R. 03-topshiriqda ikkala javob ham «Yo'q» — chegara ikki yoqdan buziladi. 08-topshiriqda esa birliklar turli: 1 dm va 9 sm. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars50/Dars50Practice.jsx')),
  },
  {
    slug: 'dars51-amaliyot',
    title: "Dars 51 amaliyoti — ichki chizilgan burchak (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: test, javob yozish, chizmalar, so'zlar, guruhlar, ha-yo'q, qadamlar tartibi, seyf kodi, juftlash, pazl. Ichki chizilgan burchak yoyning YARMI, va u uchdan QARAMA-QARSHI yoyga tiraladi. Besh topshiriqda chizma: 03-da olti aylana bir xil siyoh rangida — ichki va markaziy burchakni faqat uchning joyi ajratadi. 06-topshiriqda javoblar «Ha, Yo'q». UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars51/Dars51Practice.jsx')),
  },
  {
    slug: 'dars52-amaliyot',
    title: "Dars 52 amaliyoti — ichki va tashqi chizilgan aylanalar (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, guruhlar, ha-yo'q, radius, test, juftlash, seyf kodi, so'zlar, pazl, qadamlar tartibi. Ichki aylananing markazi bissektrisalarda, tashqisiniki o'rta perpendikulyarlarda; tashqi chizilgan to'rtburchakda tomonlarning YIG'INDILARI teng. Yetti topshiriqda chizma. 03-topshiriqda ikkala javob ham «Ha» — «har qanday uchburchak» degan so'z shubha uyg'otadi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars52/Dars52Practice.jsx')),
  },
  {
    slug: 'dars53-amaliyot',
    title: "Dars 53 amaliyoti — vektor, qo'shish va ayirish (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: test, guruhlar, yozuvlar, juftlash, so'zlar, pazl, uzunlik, ha-yo'q, seyf kodi, qadamlar tartibi. Teng vektorlarning joylashuvi ahamiyatsiz — buni 02-topshiriqdagi sakkiz strelka ko'rsatadi. OA − OB = BA, va nega BA ekani 10-topshiriqda qadamma-qadam chiqariladi. 08-topshiriqda javoblar «Yo'q, Ha». UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars53/Dars53Practice.jsx')),
  },
  {
    slug: 'dars54-amaliyot',
    title: "Dars 54 amaliyoti — vektorni songa ko'paytirish (10 topshiriq)",
    desc: "O'nta topshiriq o'nta xil usulda: belgilash, ha-yo'q, guruhlar, modul, qadamlar tartibi, o'rta chiziq, seyf kodi, so'zlar, pazl, chizmalar. Manfiy koeffitsiyent yo'nalishni buradi, lekin modulni manfiy qilmaydi. 02-topshiriqda ikkala javob ham «Yo'q» — ular bitta xatoning ikki tomoni. 10-topshiriqda k·a ni chizma bilan juftlash. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars54/Dars54Practice.jsx')),
  },
  {
    slug: 'dars55-amaliyot',
    title: "Dars 55 amaliyoti — vektor koordinatalari, skalyar ko'paytma (10 topshiriq)",
    desc: "KURSNING OXIRGI AMALIYOTI. O'nta topshiriq o'nta xil usulda: ha-yo'q, yozuvlar, koordinatalar, seyf kodi, pazl, juftlash, so'zlar, qadamlar tartibi, skalyar, guruhlar. Vektorning koordinatalari OXIRIdan BOSHIni ayirish bilan topiladi; skalyar ko'paytmaning natijasi esa SON. Uch topshiriqda koordinata to'ri. Oxirgi topshiriq butun kursni yopadi: sakkiz yozuv «natija son» va «natija vektor» ga ajratiladi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/practice/dars55/Dars55Practice.jsx')),
  },
]
