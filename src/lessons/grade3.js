import { createElement, lazy } from 'react'

import { Component } from 'react'

function Grade3LoadFailure() {
  return createElement(
    'section',
    {
      role: 'alert',
      style: {
        width: 'min(520px, calc(100% - 24px))',
        margin: '24px auto',
        padding: 20,
        border: '1px solid #f0b4ad',
        borderRadius: 18,
        background: '#fff7f5',
        color: '#6f241c',
        fontFamily: 'Manrope, system-ui, sans-serif',
        textAlign: 'center',
      },
    },
    createElement('strong', null, 'Урок не загрузился'),
    createElement('p', { style: { margin: '8px 0 14px' } }, 'Обновите страницу и попробуйте ещё раз.'),
    createElement(
      'button',
      {
        type: 'button',
        onClick: () => window.location.reload(),
        style: {
          border: 0,
          borderRadius: 12,
          padding: '10px 16px',
          background: '#b83d30',
          color: '#fff',
          fontWeight: 800,
          cursor: 'pointer',
        },
      },
      'Повторить',
    ),
  )
}

class Grade3RenderBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, details) {
    console.error('[grade3] Lesson render failed.', error, details)
  }

  render() {
    return this.state.failed ? createElement(Grade3LoadFailure) : this.props.children
  }
}

function grade3LoadFailure(error) {
  console.error('[grade3] Lesson module failed to load.', error)
  return Grade3LoadFailure
}

function safeLazy(loader) {
  return lazy(async () => {
    if (typeof loader !== 'function') {
      return { default: grade3LoadFailure(new Error('Lesson module is missing from the grade-3 registry.')) }
    }

    try {
      const lessonModule = await loader()
      if (!lessonModule?.default) throw new Error('Lesson module has no default export.')
      const LessonComponent = lessonModule.default
      return {
        default: function Grade3SafeLesson(props) {
          return createElement(
            Grade3RenderBoundary,
            null,
            createElement(LessonComponent, props),
          )
        },
      }
    } catch (error) {
      return { default: grade3LoadFailure(error) }
    }
  })
}

// 3-sinf NAZARIY darslari (Dars01–…). Yangi dars shu yerga qo'shiladi.
// Reja: DARSLAR_REJASI_1-11.md «3 класс» (51 dars + 7 nazorat).
// Syujet: src/books/grade3/SYUJET_3SINF.md («Bit sayyorasi Lumo»).
// Etalon kontrakt (meros): src/books/grade2/ETALON_2SINF.md → grade-3 etaloni Dars01.
export const grade3Nazariy = [
  {
    slug: 'dars01-yuzlik-onlik-birlik',
    title: "Dars 1. Yuzliklar, o'nliklar va birliklar",
    desc: "O'nta o'nlik — bitta yuzlik; uch xonali son = yuzlik + o'nlik + birlik (345 = 3 yuzlik 4 o'nlik 5 birlik); nol o'rinni saqlaydi (305).",
    Component: safeLazy(() => import('../components/grade3/Dars01.jsx')),
  },
  {
    slug: 'dars02-oqish-yozish',
    title: "Dars 2. Sonlarni o'qish va yozish",
    desc: "Son nomi va raqamli yozuv o'rtasidagi ko'prik (uch yuz besh = 305); har xona o'z nomi; nol o'rinni yozuvda saqlaydi.",
    Component: safeLazy(() => import('../components/grade3/Dars02.jsx')),
  },
  {
    slug: 'dars03-razryad-qoshiluvchilari',
    title: "Dars 3. Razryad qo'shiluvchilari",
    desc: "Sonni razryad qo'shiluvchilariga ajratish va yig'ish (345 = 300 + 40 + 5); bo'sh xona qo'shiluvchi bermaydi.",
    Component: safeLazy(() => import('../components/grade3/Dars03.jsx')),
  },
  {
    slug: 'dars04-taqqoslash',
    title: "Dars 4. Uch xonali sonlarni taqqoslash",
    desc: "Sonlarni xonama-xona, chapdan o'ngga taqqoslash (> < =); belgi kattaga ochiladi.",
    Component: safeLazy(() => import('../components/grade3/Dars04.jsx')),
  },
  {
    slug: 'dars05-yaxlitlash',
    title: "Dars 5. Sonlarni yaxlitlash",
    desc: "O'nlik va yuzlikkacha yaxlitlash; o'ngdagi raqam besh yoki katta — yuqoriga, kichik — pastga; yumaloq son nol bilan tugaydi.",
    Component: safeLazy(() => import('../components/grade3/Dars05.jsx')),
  },
  {
    slug: 'dars06-son-oqi',
    title: "Dars 6. Son o'qida son",
    desc: "Sonni son o'qida joylash va belgi bo'yicha o'qish; katta belgi — yuzlik, kichik — o'nlik.",
    Component: safeLazy(() => import('../components/grade3/Dars06.jsx')),
  },
  {
    slug: 'dars07-yozma-qoshish-ayirish',
    title: "Dars 7. Yozma qo'shish va ayirish",
    desc: "10000 gacha sonlarni ustunda qo'shish va ayirish; xona xona ostida, o'ngdan chapga; o'tkazish va qarz.",
    Component: safeLazy(() => import('../components/grade3/Dars07.jsx')),
  },
  {
    slug: 'dars08-rim-raqamlari',
    title: "Dars 8. Rim raqamlari",
    desc: "Sanoq sistemalari; Rim belgilari (I V X L C); kichik belgi o'ngda qo'shiladi, chapda ayiriladi (IX = 9).",
    Component: safeLazy(() => import('../components/grade3/Dars08.jsx')),
  },
  {
    slug: 'dars09-kopaytirish-jadvali',
    title: "Dars 9. Ko'paytirish jadvali",
    desc: "Ko'paytirish — teng guruhlarning qisqa yozuvi; massiv (satr × ustun); ko'paytuvchilarni o'rin almashtirish mumkin.",
    Component: safeLazy(() => import('../components/grade3/Dars09.jsx')),
  },
  {
    slug: 'dars10-10-100-ga-kopaytirish-bolish',
    title: "Dars 10. 10 va 100 ga ko'paytirish va bo'lish",
    desc: "10 ga ko'paytirsak o'ngga bitta nol qo'shiladi, 100 ga — ikkita; bo'lganda nollar qaytadi. Razryad siljishi.",
    Component: safeLazy(() => import('../components/grade3/Dars10.jsx')),
  },
  {
    slug: 'dars11-yigindini-kopaytirish',
    title: "Dars 11. Yig'indini ko'paytirish",
    desc: "Jadvalda yo'q sonni ko'paytirish: sonni o'nlik va birlikka ajratib, har bo'lakni alohida ko'paytiramiz va qo'shamiz.",
    Component: safeLazy(() => import('../components/grade3/Dars11.jsx')),
  },
  {
    slug: 'dars12-yigindini-bolish',
    title: "Dars 12. Yig'indini bo'lish",
    desc: "Jadvalda yo'q sonni bo'lish: sonni qoldiqsiz bo'linadigan bo'laklarga ajratib, har birini bo'lamiz va qo'shamiz.",
    Component: safeLazy(() => import('../components/grade3/Dars12.jsx')),
  },
  {
    slug: 'dars13-amallar-tartibi',
    title: 'Dars 13. Amallar tartibi',
    desc: "Avval qavs, keyin ko'paytirish va bo'lish, oxirida qo'shish va ayirish: 5 + 3 × 2 = 11 (16 emas); tartib natijani o'zgartiradi.",
    Component: safeLazy(() => import('../components/grade3/Dars13.jsx')),
  },
  {
    slug: 'dars14-komponentlar-boglanishi',
    title: "Dars 14. Komponentlar bog'lanishi",
    desc: "Bitta massivdan to'rt tenglik oilasi (3×4=12, 12:3=4…); komponent nomlari; noma'lum ko'paytuvchi bo'lish orqali topiladi.",
    Component: safeLazy(() => import('../components/grade3/Dars14.jsx')),
  },
  {
    slug: 'dars15-masalalar',
    title: "Dars 15. Ko'paytirish va bo'lishga masalalar",
    desc: "Masala yechish yo'li: nima ma'lum, nima so'ralyapti, qaysi amal, yechim, birlik bilan javob; teng guruhlar amalni tanlatadi.",
    Component: safeLazy(() => import('../components/grade3/Dars15.jsx')),
  },
  {
    slug: 'dars16-boluvchi-karrali',
    title: 'Dars 16. Bo\'luvchilar va karrali sonlar',
    desc: "Bo'luvchi — son qoldiqsiz bo'linadigan son (12: 1,2,3,4,6,12); karrali — jadval qatori (5, 10, 15…), cheksiz davom etadi.",
    Component: safeLazy(() => import('../components/grade3/Dars16.jsx')),
  },
  {
    slug: 'dars17-ikki-xonali-kopaytirish',
    title: "Dars 17. Ikki xonali sonni ko'paytirish",
    desc: "Ustaxona hududi: 23×4 = 20×4 + 3×4 — o'nlik va birlik alohida ko'paytiriladi va qo'shiladi (yig'indini ko'paytirish davomi).",
    Component: safeLazy(() => import('../components/grade3/Dars17.jsx')),
  },
  {
    slug: 'dars18-ikki-xonali-bolish',
    title: "Dars 18. Ikki xonali sonni bo'lish",
    desc: "96:4 = (80+16):4 — sonni QULAY bo'laklarga yoyamiz (har bo'lak bo'linsin!), alohida bo'lamiz va qo'shamiz; ko'paytirish bilan tekshiramiz.",
    Component: safeLazy(() => import('../components/grade3/Dars18.jsx')),
  },
  {
    slug: 'dars19-qoldiqli-bolish',
    title: "Dars 19. Qoldiqli bo'lish",
    desc: "Teng guruhlarga ajratishda ortib qolgan qism; bo'linuvchi = bo'luvchi × bo'linma + qoldiq va qoldiq bo'luvchidan kichik.",
    Component: safeLazy(() => import('../components/grade3/Dars19.jsx')),
  },
  {
    slug: 'dars20-amallarni-tekshirish',
    title: "Dars 20. Amallarni teskari amal bilan tekshirish",
    desc: "Qo'shish va ayirish, ko'paytirish va bo'lishning teskari bog'lanishi orqali natijani tekshirish va xatoni aniqlash.",
    Component: safeLazy(() => import('../components/grade3/Dars20.jsx')),
  },
  {
    slug: 'dars21-yozma-kopaytirish-bolish',
    title: "Dars 21. Yozma ko'paytirish va bo'lish",
    desc: "Razryadlarni tekislash, o'tkazish, yozma ko'paytirish va bo'lish qadamlari hamda teskari amal bilan tekshirish.",
    Component: safeLazy(() => import('../components/grade3/Dars21.jsx')),
  },
  {
    slug: 'dars22-ikki-xonali-ikki-xonali',
    title: "Dars 22. Ikki xonali sonni ikki xonali songa ko'paytirish",
    desc: "Ikkinchi ko'paytuvchini o'nlik va birlikka ajratish, qismiy ko'paytmalar, yozma usul va razryad siljishi.",
    Component: safeLazy(() => import('../components/grade3/Dars22.jsx')),
  },
  {
    slug: 'dars23-qurilish-masalalari',
    title: "Dars 23. Qurilishga oid masalalar",
    desc: "Ma'lum va so'ralganni ajratish, miqdorlar bog'lanishidan amal tanlash, bir va ikki qadamli ustaxona masalalari.",
    Component: safeLazy(() => import('../components/grade3/Dars23.jsx')),
  },
  {
    slug: 'dars24-kattalik-ulushi',
    title: "Dars 24. Kattalik ulushi",
    desc: "Butun va teng bo'laklar, yarim, uchdan bir va chorak; predmet, uzunlik hamda vaqtning ulushini topish.",
    Component: safeLazy(() => import('../components/grade3/Dars24.jsx')),
  },
  {
    slug: 'dars25-kasr-hosil-bolishi',
    title: "Dars 25. Kasrlarning hosil bo'lishi",
    desc: "Teng ulush modelidan kasr yozuviga o'tish; surat, maxraj, kasr chizig'i va model bilan yozuv orasidagi ikki tomonlama bog'lanish.",
    Component: safeLazy(() => import('../components/grade3/Dars25.jsx')),
  },
  {
    slug: 'dars26-ulushlarni-taqqoslash',
    title: "Dars 26. Ulushlarni taqqoslash",
    desc: "Bir xil butun sharti, birlik kasrlarni model va son o'qida taqqoslash; maxraj kattalashganda bitta ulushning kichrayishi.",
    Component: safeLazy(() => import('../components/grade3/Dars26.jsx')),
  },
  {
    slug: 'dars27-sonning-ulushi',
    title: "Dars 27. Sonning ulushini topish",
    desc: "Maxraj bo'yicha bitta teng ulushni, surat bo'yicha bir nechta ulushni topish; teskari va ikki qadamli masalalar.",
    Component: safeLazy(() => import('../components/grade3/Dars27.jsx')),
  },
  {
    slug: 'dars28-kasr-turlari-aralash-son',
    title: "Dars 28. To'g'ri va noto'g'ri kasrlar. Aralash son",
    desc: "Bir butun chegarasi, surat va maxraj munosabati; noto'g'ri kasrni aralash songa va aralash sonni kasrga aylantirish.",
    Component: safeLazy(() => import('../components/grade3/Dars28.jsx')),
  },
  {
    slug: 'dars29-kasrlarni-taqqoslash',
    title: "Dars 29. Kasrlarni taqqoslash",
    desc: "Bir xil maxraj va surat, butun chegarasi, model va son o'qi; aralash sonlarni taqqoslash uchun mos strategiyani tanlash.",
    Component: safeLazy(() => import('../components/grade3/Dars29.jsx')),
  },
  {
    slug: 'dars30-kasrlarni-qoshish-ayirish',
    title: "Dars 30. Bir xil maxrajli kasrlarni qo'shish va ayirish",
    desc: "Teng o'lchamdagi ulushlarni birlashtirish va olib tashlash; suratlar ustida amal, umumiy maxrajni saqlash va teskari tekshiruv.",
    Component: safeLazy(() => import('../components/grade3/Dars30.jsx')),
  },
  {
    slug: 'dars31-onli-kasrlar',
    title: "Dars 31. O'nli kasrlarni o'qish, yozish va taqqoslash",
    desc: "O'ndan va yuzdan ulush modeli, vergul va nolning vazifasi, oddiy kasr bilan o'nli yozuv orasidagi bog'lanish va razryadli taqqoslash.",
    Component: safeLazy(() => import('../components/grade3/Dars31.jsx')),
  },
  {
    slug: 'dars32-ulush-kasr-masalalari',
    title: "Dars 32. Ulush va kasrlarga oid masalalar",
    desc: "Sonning kasr qismini va qolganini topish, ma'lum ulushdan butunni tiklash, oddiy va o'nli kasrli ko'p qadamli masalalar.",
    Component: safeLazy(() => import('../components/grade3/Dars32.jsx')),
  },
  {
    slug: 'dars33-perimetr',
    title: 'Dars 33. Perimetr',
    desc: "Shakl chegarasi, barcha tomonlar yig'indisi; to'g'ri to'rtburchak va kvadrat perimetrini topish, teskari va hayotiy masalalar.",
    Component: safeLazy(() => import('../components/grade3/Dars33.jsx')),
  },
  {
    slug: 'dars34-yuza-birliklari',
    title: 'Dars 34. Yuza birliklari',
    desc: "Shakl egallagan joyni birlik kvadratlar bilan o'lchash; cm², dm², m² va katakli modelda yuzani aniqlash.",
    Component: safeLazy(() => import('../components/grade3/Dars34.jsx')),
  },
  {
    slug: 'dars35-togri-tortburchak-yuzasi',
    title: "Dars 35. To'g'ri to'rtburchak yuzasi",
    desc: "Katakli modeldan S = a × b formulasini kashf qilish; yuzani hisoblash, noma'lum tomonni tiklash va qurilish masalalari.",
    Component: safeLazy(() => import('../components/grade3/Dars35.jsx')),
  },
  {
    slug: 'dars36-kvadrat-yuzasi',
    title: 'Dars 36. Kvadrat yuzasi',
    desc: "Kvadratning teng tomonlari va S = a × a formulasi; yuzani hisoblash, tomonni tiklash hamda yuza-perimetr xatosini farqlash.",
    Component: safeLazy(() => import('../components/grade3/Dars36.jsx')),
  },
  {
    slug: 'dars37-perimetr-yuzani-taqqoslash',
    title: 'Dars 37. Perimetr va yuzani taqqoslash',
    desc: "Chegara va ichki joyni, uzunlik va kvadrat birliklarni farqlash; bir xil perimetrli shakllarning yuzalarini taqqoslash.",
    Component: safeLazy(() => import('../components/grade3/Dars37.jsx')),
  },
  {
    slug: 'dars38-perimetr-yuza-masalalari',
    title: 'Dars 38. Perimetr va yuzaga oid masalalar',
    desc: "Qurilish vaziyatida kerakli miqdor va formulani tanlash; noma'lum o'lcham, qoplama va chegara masalalarini yechish.",
    Component: safeLazy(() => import('../components/grade3/Dars38.jsx')),
  },
  {
    slug: 'dars39-uchburchak-chiziqlar',
    title: 'Dars 39. Uchburchak turlari. Parallel va perpendikulyar chiziqlar',
    desc: "Uchburchaklarni tomonlariga ko'ra tasniflash; parallel va perpendikulyar chiziqlarni kesishish xususiyatiga ko'ra ajratish.",
    Component: safeLazy(() => import('../components/grade3/Dars39.jsx')),
  },
  {
    slug: 'dars40-simmetriya-burchak',
    title: "Dars 40. O'q simmetriyasi va burchak gradusi",
    desc: "Shaklning simmetriya o'qini aniqlash va ikkinchi yarmini tiklash; burchaklarni gradusda o'lchash hamda turlarga ajratish.",
    Component: safeLazy(() => import('../components/grade3/Dars40.jsx')),
  },
  {
    slug: 'dars41-piramida-konus',
    title: 'Dars 41. Piramida va konus',
    desc: "Hajmli jismlarni asos, yoq, sirt, qirra va uchlariga ko'ra tanish; piramida bilan konusning umumiy va farqli belgilarini aniqlash.",
    Component: safeLazy(() => import('../components/grade3/Dars41.jsx')),
  },
  {
    slug: 'dars42-massa',
    title: 'Dars 42. Massa',
    desc: "Gramm, kilogramm va tonna orasidagi bog'lanish; massalarni aylantirish, taqqoslash va hayotiy yuk masalalarida qo'llash.",
    Component: safeLazy(() => import('../components/grade3/Dars42.jsx')),
  },
  {
    slug: 'dars43-vaqt',
    title: 'Dars 43. Vaqt',
    desc: "Soat, daqiqa, soniya va sutka; vaqt oralig'i, boshlanish va tugash vaqtini 60 lik bog'lanish asosida hisoblash.",
    Component: safeLazy(() => import('../components/grade3/Dars43.jsx')),
  },
  {
    slug: 'dars44-uzunlik-birliklari',
    title: 'Dars 44. Uzunlik birliklari va nisbatlari',
    desc: "Kilometr, metr, detsimetr va santimetr orasidagi nisbatlar; birliklarni tenglashtirib amal va taqqoslash bajarish.",
    Component: safeLazy(() => import('../components/grade3/Dars44.jsx')),
  },
  {
    slug: 'dars45-kalendar',
    title: 'Dars 45. Kalendar',
    desc: "Yil, oy, hafta va kunlarning davriy tartibi; sana oralig'i, keyingi va oldingi sanalarni kalendarda aniqlash.",
    Component: safeLazy(() => import('../components/grade3/Dars45.jsx')),
  },
  {
    slug: 'dars46-tenglamalar',
    title: 'Dars 46. Tenglamalar',
    desc: "Noma'lum son qatnashgan tenglik; qo'shish va ayirish komponentlari bog'lanishi orqali sodda tenglamalarni yechish.",
    Component: safeLazy(() => import('../components/grade3/Dars46.jsx')),
  },
  {
    slug: 'dars47-tenglamalarni-tekshirish',
    title: 'Dars 47. Tenglamalarni yechish va tekshirish',
    desc: "Ko'paytirish va bo'lishli tenglamalarni teskari amal bilan yechish, topilgan qiymatni dastlabki tenglikka qo'yib tekshirish.",
    Component: safeLazy(() => import('../components/grade3/Dars47.jsx')),
  },
  {
    slug: 'dars48-murakkab-masalalar',
    title: 'Dars 48. Murakkab masalalar',
    desc: "Oraliq noma'lumni aniqlash, yechim rejasini tuzish va bir necha bog'langan amalni tartib bilan bajarish.",
    Component: safeLazy(() => import('../components/grade3/Dars48.jsx')),
  },
  {
    slug: 'dars49-tengsizlik-fikrlar',
    title: "Dars 49. Tengsizliklar, rost va yolg'on fikrlar",
    desc: "≤ va ≥ belgilarini qo'llash; sonli tengsizliklar hamda fikrlarni hisob, misol va qarshi misol orqali tekshirish.",
    Component: safeLazy(() => import('../components/grade3/Dars49.jsx')),
  },
  {
    slug: 'dars50-doiraviy-diagramma',
    title: "Dars 50. Doiraviy diagramma va ma'lumotlar",
    desc: "Doiraviy diagrammada butun va sektorlar bog'lanishi; ulush, foiz va miqdorni o'qish, tiklash hamda taqqoslash.",
    Component: safeLazy(() => import('../components/grade3/Dars50.jsx')),
  },
  {
    slug: 'dars51-yakuniy-takrorlash',
    title: 'Dars 51. Yakuniy takrorlash',
    desc: "Sonlar, amallar, kasrlar, o'lchovlar, tenglamalar, ma'lumotlar va geometriya bo'yicha umumlashtiruvchi transfer topshiriqlari.",
    Component: safeLazy(() => import('../components/grade3/Dars51.jsx')),
  },
]

// 3-sinf AMALIY darslari — har dars = 10 topshiriqli bank (grade2 darsNN/ naqshi).
const extendedGrade3PracticeMeta = [
  [20, 'Amallarni teskari amal bilan tekshirish'],
  [21, "Yozma ko'paytirish va bo'lish"],
  [22, "Ikki xonali sonni ikki xonali songa ko'paytirish"],
  [23, 'Qurilishga oid masalalar'],
  [24, 'Kattalik ulushi'],
  [25, "Kasrlarning hosil bo'lishi"],
  [26, 'Ulushlarni taqqoslash'],
  [27, 'Sonning ulushini topish'],
  [28, "To'g'ri va noto'g'ri kasrlar. Aralash son"],
  [29, 'Kasrlarni taqqoslash'],
  [30, "Bir xil maxrajli kasrlarni qo'shish va ayirish"],
  [31, "O'nli kasrlarni o'qish, yozish va taqqoslash"],
  [32, 'Ulush va kasrlarga oid masalalar'],
  [33, 'Perimetr'],
  [34, 'Yuza birliklari'],
  [35, "To'g'ri to'rtburchak yuzasi"],
  [36, 'Kvadrat yuzasi'],
  [37, 'Perimetr va yuzani taqqoslash'],
  [38, 'Perimetr va yuzaga oid masalalar'],
  [39, 'Uchburchak turlari. Parallel va perpendikulyar chiziqlar'],
  [40, "O'q simmetriyasi. Burchakni gradusda o'lchash"],
  [41, 'Piramida va konus'],
  [42, 'Massa birliklari'],
  [43, 'Vaqt birliklari'],
  [44, 'Uzunlik birliklari va nisbatlari'],
  [45, 'Kalendar'],
  [46, 'Tenglamalar'],
  [47, 'Tenglamalarni yechish va tekshirish'],
  [48, 'Murakkab masalalar'],
  [49, "Tengsizliklar. Rost va yolg'on fikrlar"],
  [50, "Doiraviy diagramma va ma'lumotlar"],
  [51, 'Yakuniy takrorlash'],
]

const extendedGrade3PracticeModules = import.meta.glob(
  '../components/grade3/practice/dars*/Dars*Practice.jsx',
)

const extendedGrade3PracticeLessons = extendedGrade3PracticeMeta.map(([number, topic]) => ({
  slug: `dars${number}-amaliyot`,
  title: `Dars ${number} amaliyoti — ${topic} (10 topshiriq)`,
  desc: `${topic}: model, mustaqil hisob, teskari topshiriq, matnli vazifa, xato tahlili va transferdan iborat 10 ta UZ/RU interaktiv mashq.`,
  Component: safeLazy(extendedGrade3PracticeModules[
    `../components/grade3/practice/dars${number}/Dars${number}Practice.jsx`
  ]),
}))

export const grade3Amaliy = [
  {
    slug: 'dars01-amaliyot',
    title: "Dars 1 amaliyoti — Yuzliklar, o'nliklar va birliklar (10 topshiriq)",
    desc: "Razryadlar: sonni yig'ish va o'qish, nol razryad, raqam qiymati, son o'qi, minglik blok — 10 ta interaktiv topshiriq, osondan qiyinga.",
    Component: safeLazy(() => import('../components/grade3/practice/dars01/Dars01Practice.jsx')),
  },
  {
    slug: 'dars02-amaliyot',
    title: "Dars 2 amaliyoti — Sonlarni o'qish va yozish (10 topshiriq)",
    desc: "So'z va raqam yozuvi orasidagi ko'prik: o'qish, yozish, nol bilan yozish, xatoni topish, raqamlardan son yasash — darslik misollarida.",
    Component: safeLazy(() => import('../components/grade3/practice/dars02/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-amaliyot',
    title: "Dars 3 amaliyoti — Razryad qo'shiluvchilari (10 topshiriq)",
    desc: "Yoyilma va yig'ish: 427 = 400+20+7, nol razryad qo'shiluvchi bermaydi, plitalardan yig'ish, xatoni topish — darslik misollarida.",
    Component: safeLazy(() => import('../components/grade3/practice/dars03/Dars03Practice.jsx')),
  },
  {
    slug: 'dars04-amaliyot',
    title: "Dars 4 amaliyoti — Uch xonali sonlarni taqqoslash (10 topshiriq)",
    desc: "Belgi qo'yish (> < =), tuzoq-juftlar (600/599, 519/591), saralash, minoralar masalasi, eng katta son yasash — darslik misollarida.",
    Component: safeLazy(() => import('../components/grade3/practice/dars04/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot',
    title: "Dars 5 amaliyoti — Eng yaqin yumaloq son (10 topshiriq)",
    desc: "Yumaloq o'nlik va yuzlikni tanlash: chiziqda topish, o'rtadagi son (45, 350), ikki qadam, taxminiy hisob — darslik sonlarida.",
    Component: safeLazy(() => import('../components/grade3/practice/dars05/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot',
    title: "Dars 6 amaliyoti — Son o'qida son (10 topshiriq)",
    desc: "O'qni o'qish (katta belgi — yuzlik, kichigi — o'nlik), oraliqlar, yo'nalish, harakat, A/B/C nuqtalar — darslik 50-bet mashqi bilan.",
    Component: safeLazy(() => import('../components/grade3/practice/dars06/Dars06Practice.jsx')),
  },
  {
    slug: 'dars07-amaliyot',
    title: "Dars 7 amaliyoti — Yozma qo'shish va ayirish (10 topshiriq)",
    desc: "Ustun shakli: to'g'ri yozuv, o'tkazish va qarz (bir va ikki marta), xatoni topish, ikki qadamli masala — darslik misollarida.",
    Component: safeLazy(() => import('../components/grade3/practice/dars07/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot',
    title: "Dars 8 amaliyoti — Rim raqamlari (10 topshiriq)",
    desc: "I V X L C belgilari: o'qish, belgi-kartalardan yasash (XXIII, IX), chapda-ayirish tuzoqlari, oylar rim raqamida — darslik 88-89-betlari asosida.",
    Component: safeLazy(() => import('../components/grade3/practice/dars08/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot',
    title: "Dars 9 amaliyoti — Ko'paytirish jadvali (10 topshiriq)",
    desc: "3-sinf ko'paytirish formatlarida: savatlar, og'zaki, o'rin almashtirish, yo'qolgan son, qulay usul, teskari jadval — darslik uzum masalasi bilan.",
    Component: safeLazy(() => import('../components/grade3/practice/dars09/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot',
    title: "Dars 10 amaliyoti — 10 va 100 ga ko'paytirish va bo'lish (10 topshiriq)",
    desc: "Razryad siljishi, nol qatnashgan sonlar, teskari amal, yo'qolgan ko'paytuvchi va 10/100 ga doir transfer — to'rt xil interaksiya bilan.",
    Component: safeLazy(() => import('../components/grade3/practice/dars10/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-amaliyot',
    title: "Dars 11 amaliyoti — Yig'indini ko'paytirish (10 topshiriq)",
    desc: "Sonni o'nlik va birlikka yoyish, qismlarni ko'paytirish, qadamlarni tartiblash, teskari yozuv va tipik xatoni tuzatish.",
    Component: safeLazy(() => import('../components/grade3/practice/dars11/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-amaliyot',
    title: "Dars 12 amaliyoti — Yig'indini bo'lish (10 topshiriq)",
    desc: "Qoldiqsiz bo'linadigan qulay qismlar, teskari tekshiruv, noma'lum qism, teng taqsimlash va noto'g'ri yoyilmani tahlil qilish.",
    Component: safeLazy(() => import('../components/grade3/practice/dars12/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot',
    title: "Dars 13 amaliyoti — Amallar tartibi (10 topshiriq)",
    desc: "Qavs, ko'paytirish-bo'lish ustunligi, ikki qadamli masala, teng ifodalar va chapdan o'ngga ko'r-ko'rona hisoblash xatosi.",
    Component: safeLazy(() => import('../components/grade3/practice/dars13/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot',
    title: "Dars 14 amaliyoti — Komponentlar bog'lanishi (10 topshiriq)",
    desc: "Ko'paytma va bo'linma komponentlari, noma'lum son, to'rtta tenglik oilasi, nol holati va teskari amal bilan tekshirish.",
    Component: safeLazy(() => import('../components/grade3/practice/dars14/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-amaliyot',
    title: "Dars 15 amaliyoti — Ko'paytirish va bo'lishga masalalar (10 topshiriq)",
    desc: "Teng guruh va teng taqsimlash modeli, masala qadamlari, amal tanlash, ikki qadamli vaziyat, birlik va mantiqiy tekshiruv.",
    Component: safeLazy(() => import('../components/grade3/practice/dars15/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot',
    title: "Dars 16 amaliyoti — Bo'luvchilar va karrali sonlar (10 topshiriq)",
    desc: "Bo'luvchilar jufti, karralilar qatori, umumiy karrali, qoldiq bilan tekshirish va teng qatorlarga joylash masalalari.",
    Component: safeLazy(() => import('../components/grade3/practice/dars16/Dars16Practice.jsx')),
  },
  {
    slug: 'dars17-amaliyot',
    title: "Dars 17 amaliyoti — Ikki xonali sonni ko'paytirish (10 topshiriq)",
    desc: "O'nlik va birlikni alohida ko'paytirish, algoritm qadamlari, noma'lum son, nol birlik, xato tahlili va natijani taxminlash.",
    Component: safeLazy(() => import('../components/grade3/practice/dars17/Dars17Practice.jsx')),
  },
  {
    slug: 'dars18-amaliyot',
    title: "Dars 18 amaliyoti — Ikki xonali sonni bo'lish (10 topshiriq)",
    desc: "Qulay bo'linadigan qismlar, qadamli algoritm, noma'lum qism, teng taqsimlash, xato tahlili va ko'paytirish bilan tekshiruv.",
    Component: safeLazy(() => import('../components/grade3/practice/dars18/Dars18Practice.jsx')),
  },
  {
    slug: 'dars19-amaliyot',
    title: "Dars 19 amaliyoti — Qoldiqli bo'lish (10 topshiriq)",
    desc: "Qoldiq va bo'linmani topish, teskari yozuv, tekshiruv, chegara holati, xato tahlili va ustaxona masalasi.",
    Component: safeLazy(() => import('../components/grade3/practice/dars19/Dars19Practice.jsx')),
  },
  ...extendedGrade3PracticeLessons,
]
