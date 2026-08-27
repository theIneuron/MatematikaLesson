import { lazy } from 'react'

// 9-sinf darslari. Reja: src/books/grade9/DARSLAR_REJASI_9SINF.md (52 o'quv dars,
// PK va IK kirmaydi). Temalar manbasi: Math_1-11_Поурочно_RUz_v4 (2).xlsx, «9 класс».
// Yondashuv: src/books/grade9/PODXOD_9SINF.md — avval asbob, keyin darslar.
// Kontrakt: src/books/grade9/ETALON_9SINF.md.
//
// 2026-08-25: pilot bo'lgan Dars 15 (eski `grade9/tools.jsx` asbobida, birinchi
// etalon reduksiyasi bo'yicha) metodist qaroriga ko'ra o'chirildi — sinfning
// o'z asboblariga (`grade9/asboblar.jsx`) ko'chirilmasdan qolgan edi. Mavzu
// («15. Oraliqlar usuli») DARSLAR_REJASI_9SINF.md da qoladi, qayta yig'iladi.
export const grade9Nazariy = [
  {
    // 2026-08-20. 1-dars 8-sinf karkasida yig'ildi, keyin metodist «faqat
    // nusxa chiqdi» deganidan keyin SINFNING O'Z ASBOBLARIGA ko'chirildi
    // (`grade9/asboblar.jsx`: mashina, taxta, iz, punkt, chizg'ich).
    // Fayl nomi va slug sinf rejasi bo'yicha.
    slug: 'dars01-funksiya',
    title: 'Dars 1. Funksiya',
    desc: "To'p uchirish: qiymatlar mashinasi, vaqt sirg'ituvchisi, moslik taxtasi, juftliklardan iz, aniqlanish sohasi o'tkazish punkti. Qoidani o'quvchi o'zi yig'adi, keyin mashqlar, xato qatorni topish va qadamlab yechim. Ta'rif darslikdan (9-§, 37-bet). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars01.jsx')),
  },
  {
    // 2026-08-26. Эталон уровня — урок 1 (своя механика под тему), но
    // приборы идут по блокам (PODXOD_9SINF.md §12), решение методиста в
    // этой же сессии. Новой механики в этом уроке нет: чтение графика и
    // сравнение (x; f(x)) с (−x; f(−x)) закрыты готовыми экранами общего
    // слоя (RecallMC, CheckReveal — уже были в Dars01, Drill — из
    // grade8/feed.jsx). Полный прибор 1 (график + ось со знаками) сюда
    // не пишется: знаковая таблица впервые понадобится в уроке 6.
    slug: 'dars02-funksiya-xossalari',
    title: 'Dars 2. Funksiyaning xossalari',
    desc: "Harorat kun davomida: o'sish va kamayish bitta grafikda, keyin y=x², y=x³, y=2x+1 orqali juftlik va toqlik. Qoida darslikdan so'zma-so'z (RU va UZ nashri), na juft na toq holat darslikning o'z misolida. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars02.jsx')),
  },
  {
    // 2026-08-27. Darslik §1 (ta'rif, 5-bet, rejada ko'rsatilmagan lekin
    // mavzu nomi shuni talab qiladi), §2 (7-8-bet, faqat uchi/nol farqi —
    // qolgani 2-darsda), §3 (10-11-bet, koeffitsient a). Yangi asbob yo'q:
    // RecallMC/CheckReveal va Drill, 1-2-darsda QA topgan ikki grabladan
    // (sahna klassi, CheckReveal grafik balandligi) boshidanoq xoli.
    slug: 'dars03-kvadrat-funksiya',
    title: 'Dars 3. Kvadrat funksiya',
    desc: "Ikki parabola bir xil qoidadan: ta'rif y=ax²+bx+c, funksiyaning nollari (x²−3x misolida), nol va uchi farqi, koeffitsient a ning cho'zish/siqish/aks etish ta'siri. Qoida darslikdan so'zma-so'z. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars03.jsx')),
  },
  {
    // 2026-08-27. Darslik §4 (14-17-bet: to'liq kvadratni ajratish, uchi
    // formulasi x0=−b/2a), §5 (18-19-bet: besh qadamli qurish algoritmi).
    // Butun dars darslikning aynan o'z misolida (y=x²−4x+3, 1-masala,
    // 18-bet). Yangi asbob yo'q: RecallMC/RuleScreen (1-3-darsdan) va
    // yakuniy yig'ish uchun `Trace` (Dars01dan) — besh nuqtani birma-bir
    // qo'yib, parabolani ulardan chiqaradi.
    slug: 'dars04-parabola',
    title: 'Dars 4. Parabola',
    desc: "Yangi uchi qayerda turishini formula bilan bilish: x0=−b/2a, y0=y(x0). Simmetriya o'qi (tik chiziq, Ox emas), nollar va besh nuqtadan (uchi, ikki nol, ikki simmetrik nuqta) parabolani yig'ish — darslikning o'z misolida (y=x²−4x+3). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars04.jsx')),
  },
]

// 9-sinf AMALIYOTI. Metodist qarori 2026-08-26: 52 dars x 10 topshiriq,
// har darsda AYNAN o'sha o'nta mexanika, faqat ketma-ketlik boshqa.
// Kontrakt: src/books/grade9/TIPLAR_AMALIYOT_9SINF.md.
// Amaliyot ovozsiz. Marshrut: /9-sinf/matematika/amaliy/<slug>.
export const grade9Amaliy = [
  {
    slug: 'dars01-amaliyot',
    title: "Dars 1 amaliyoti — funksiya va aniqlanish sohasi (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: juftliklardan funksiyani ajratish, jadvalni ikki tomonga to'ldirish, grafik bo'yicha to'rtta hukm, tekislikka nuqta qo'yish, formulalarni taqiq turi bo'yicha guruhlash, ikkita taqiqni yozish, sohani o'qda ko'rsatish, yechim qadamlarini tartibga solish, birinchi xato qatorni topish, to'rtta yozuvni sohasi bilan moslashtirish. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars01/Dars01Practice.jsx')),
  },
]
