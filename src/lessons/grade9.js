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
  {
    // 2026-08-27. Darslik §4 (14-16-bet): darslikning o'z rivoji
    // y=x² → y=(x−1)² → y=(x−1)²+2, so'ngra umumiy qoida (15-bet oxiri).
    // Yangi asbob yo'q: RecallMC/RuleScreen va yig'ish uchun `Trace`
    // (Dars01, Dars04dan). O'z misoli: y=(x−2)²+1, 3-darsdagi a bilan
    // aralashtirmaslik uchun alohida qayd etilgan (a shaklga, joyga emas).
    slug: 'dars05-grafiklarni-almashtirish',
    title: "Dars 5. Grafiklarni ko'chirish",
    desc: "Qavs ichidagi son teskari ishlaydi (o'ngga, agar minus bo'lsa), qavsdan tashqaridagi son to'g'ridan-to'g'ri (yuqoriga, agar plyus bo'lsa). Uchini formuladan bir qarashda o'qish, a koeffitsienti joyni emas faqat shaklni o'zgartirishini ajratish, besh nuqtadan siljigan parabolani yig'ish. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars05.jsx')),
  },
  {
    // 2026-08-27. Darslik §6 (24-25-bet): ko'paytuvchilarga ajratish usuli,
    // misol x²-5x+6>0. §7 (28-29-bet): grafik usuli, misol 2x²-x-1<=0.
    // BIRINCHI MARTA: `SignAxis` — sinfning bosh asbobi («Prибор 1»,
    // PODXOD_9SINF.md §4, 13 darsda ishlatiladi), asboblar.jsx ga yozilgan.
    // Bu yerda uning eng sodda holati: ikkita turli haqiqiy nol, teshik
    // nuqta yo'q (u 17-darsda qo'shiladi). Blok 1 ning oxirgi darsi.
    slug: 'dars06-kvadrat-tengsizliklar',
    title: 'Dars 6. Kvadrat tengsizliklar',
    desc: "Grafik va son o'qi bosh asbobi birinchi marta: nollarni qo'yish, eng o'ng oraliqni sonni qo'yib isbotlash, qolganlarini grafikdan o'qish, tengsizlikka mos oraliq(lar)ni bo'yash. Javob ikki ajralgan oraliqdan iborat bo'lishi mumkinligi va chegara nolning qat'iylikka bog'liqligi ikkala darslik misolida (x²-5x+6>0 va 2x²-x-1<=0). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars06.jsx')),
  },
  {
    // 2026-08-27. Bu mavzu Algebra 9 da alohida bobga ega emas: ta'rif
    // Algebra 8, 1-§ (8-bet, "butun ifoda"), texnika 7-sinf kursini
    // takrorlash bo'limidan (3-bet). BLOK 2 BOSHLANDI. BIRINCHI MARTA:
    // `Track` — sinfning ikkinchi umumiy asbobi («Prибор 4»,
    // PODXOD_9SINF.md §7, 7 darsda ishlatiladi), asboblar.jsx ga
    // yozilgan. Bu yerda uning eng sodda holati: maxrajda harf yo'q,
    // begona ildiz xavfi yo'q (u 8-darsda qo'shiladi).
    slug: 'dars07-butun-tenglamalar',
    title: 'Dars 7. Butun tenglamalar',
    desc: "Tenglama uchun har ikki tomonga birdan qadam bosh asbobi birinchi marta: qavs ochish (yolg'iz minus bilan ham), had ko'chirishda ishorani almashtirish, topilgan ildizni asl tenglamaga qo'yib tekshirish. Butun va kasr-ratsional tenglama farqi (maxrajda harf) keyingi darsga ko'prik sifatida. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars07.jsx')),
  },
  {
    // 2026-08-27. Bu mavzu ham alohida bobga ega emas (grade8/Dars20.jsx
    // ning o'z izohi tasdiqlaydi). ОDZ + maxrajga ko'paytirish (7-darsdan
    // tanish) + ildizni ОDZ bilan solishtirish darsda umumlashtirilgan.
    // `Track` KENGAYTIRILDI: `checkAsk`/`checkFn` (asboblar.jsx) — endi
    // xavfli nomzod ⚠ bilan belgilanadi va o'quvchi bosgan tugma bilan
    // ОDZ ga solishtiriladi, rad etish avtomatik emas.
    slug: 'dars08-kasr-ratsional-tenglamalar',
    title: 'Dars 8. Kasr-ratsional tenglamalar',
    desc: "Track asbobi ⚠ bilan birinchi marta: ОDZ topish, maxrajga ko'paytirib butun tenglamaga keltirish, topilgan ildizni ОDZ bilan solishtirish. Bir misolda begona ildiz (yechim yo'q), ikkinchisida haqiqiy ildiz — ⚠ doim rad etish degani emasligini ko'rsatadi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars08.jsx')),
  },
  {
    // 2026-08-27. Darslik: II bob «Sistemalar va tengsizliklar», 13-§
    // (68-69-bet) — Viyet teoremasi teskarisi (2-masala, bosh misol) va
    // to'liq kvadratga keltirish (1-masala, uchburchak katetlari). Yangi
    // asbob yo'q: RecallMC intro/steps qatlami (1-8-darsdan tanish)
    // ishlatildi — bu darslikning o'z taqdimot uslubi. `Track` (ikki
    // amal) 11-12-darslarga qoldirildi, ular amal-baamal berilgan.
    slug: 'dars09-tenglamalar-sistemasi',
    title: 'Dars 9. Tenglamalar sistemasi',
    desc: "Sistema yechimi — ikkala tenglamani ham qanoatlantiradigan (x; y) juftlik. Viyet teoremasi teskarisi bilan yig'indi va ko'paytmadan tenglama tuzish, ikkita javobni tartib bilan yozish, x kvadrat qo'shi y kvadrat berilganda to'liq kvadratga keltirish — darslikning o'z misolida (uchburchak katetlari, 2 va 3, Dars06 bilan bog'liq). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars09.jsx')),
  },
  {
    // 2026-08-27. Darslik 14-§ (72-76-bet) faqat algebraik usullarni
    // ko'rsatadi, grafik usulning o'z misoli yo'q (PODXOD_9SINF.md §7 da
    // ham shu tarzda kutilgan: «графический способ подключает прибор 1»).
    // Darsning o'z misoli: y=x+1 (chiziq) va y=x²-1 (parabola), ikkalasi
    // ham x²-x-2=0 ga keladi — Dars06 va Dars09 bilan bog'liq. Yangi
    // asbob yo'q: Plane/pathOf ikki egri chiziqni bitta tekislikda
    // chizadi, GraphPick (Dars01dan) o'z MiniSystem render funksiyasi
    // bilan nomzod nuqtalarni tanlash uchun ishlatildi.
    slug: 'dars10-grafik-usul',
    title: 'Dars 10. Grafik usul',
    desc: "Ikki egri chiziq (chiziq va parabola) bitta tekislikda, kesishish nuqtalari sistema yechimi sifatida. Ikkala tenglamani tenglashtirish, kesishishlar soni (ikki, bir yoki nol) chiziqning joyiga bog'liqligi, grafikdan o'qilgan nuqtani ikkala tenglamada ham tekshirish — darsning o'z misolida. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars10.jsx')),
  },
  {
    // 2026-08-27. Darslik 14-§, 2-masala (72-bet, bosh misol: y kvadratni
    // ifodalab qo'yish, manfiy kvadrat holatida yechim yo'qligi) va
    // 3-masala (72-73-bet, kasr sistemasi Dars09dagi Viyet teoremasi
    // teskarisiga ulanadi). RecallMC intro/steps qatlami ishlatildi —
    // Dars09dagi qaror bilan bir xil: darslik yozma hisob beradi, amal
    // menyusi emas, shuning uchun Track (Dars07-08dan) bu yerda ishlatilmadi.
    slug: 'dars11-orniga-qoyish-usuli',
    title: "Dars 11. O'rniga qo'yish usuli",
    desc: "Bitta o'zgaruvchi (yoki uning darajasi) bir tenglamadan ifodalanib, ikkinchisiga qo'yiladi. Yangi diqqat: y kvadrat manfiy songa teng chiqsa, haqiqiy yechim yo'q. Ikkinchi misol kasrlarni yig'indi-ko'paytma ko'rinishiga keltirib, Dars09dagi Viyet teoremasi teskarisiga ulanadi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars11.jsx')),
  },
  {
    // 2026-08-27. Darslik 14-§, 1-masala (72-bet, bosh misol): ikki xy
    // qarama-qarshi ishorada bo'lgani uchun qo'shishda yo'qoladi, x qo'shi
    // y topiladi va Dars11dagi o'rniga qo'yish texnikasi bilan
    // YAKUNLANADI. Hosil bo'lgan kvadrat tenglama Dars04dagi bilan bir
    // xil (x²-4x+3=0, ildizlari 1 va 3) — ataylab bog'langan. RecallMC
    // ishlatildi (Dars09, Dars11dagi qaror bilan bir xil).
    slug: 'dars12-qoshish-usuli',
    title: "Dars 12. Qo'shish usuli",
    desc: "Ikkala tenglama qo'shiladi: qarama-qarshi ishorali had yo'qoladi, sodda tenglama qoladi. Yangi diqqat: x qo'shi y topilishi hali yakuniy javob emas, ikkinchi tenglamaga qo'yib davom etiladi (Dars11 texnikasi bilan). Ikkita ildiz, ikkita to'liq javob. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars12.jsx')),
  },
  {
    // 2026-08-27. Darslik: II bobga mashqlar, 205(1)-masala (86-bet):
    // ikki xonali son o'z raqamlari yig'indisidan uch marta katta,
    // yig'indining kvadrati esa sondan uch marta katta. Sistema N va s
    // orqali tuziladi, Dars11dagi o'rniga qo'yish bilan yechiladi, va
    // ikkita nomzoddan biri (ikki xonali son shartiga zid) rad etiladi —
    // yangi diqqat: matematik to'g'ri, lekin masala shartiga mos kelmaydigan
    // yechim. BLOK 2 (7-13-DARSLAR) SHU DARS BILAN YAKUNLANADI.
    slug: 'dars13-masalalar',
    title: 'Dars 13. Masalalar',
    desc: "Sistema orqali masala yechish: noma'lumni belgilash, so'zdagi har bir shartni tenglamaga aylantirish, sistemani yechish (9, 11-darslardagi texnika), va matematik to'g'ri, lekin masala shartiga zid nomzodni rad etish. Darslikning o'z misolida (ikki xonali son, 27). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars13.jsx')),
  },
  {
    // 2026-08-27. Darslik 7-§ (28-29-bet): 6-darsda ISHLATILMAGAN ikki
    // maxsus holat — 2-masala (y=4x²+4x+1, D=0, urinish x=−0,5) va Рис.20
    // (y=−x²+x−1, D<0, kesishmaydi). BLOK 3 (TENGSIZLIKLAR) BOSHLANDI.
    // `SignAxis` KENGAYTIRILDI: endi `roots` massivi 0, 1 yoki 2 ta ildiz
    // bilan ishlaydi (ilgari qattiq 2 ta ildizga bog'langan edi). Dars06dagi
    // 2-ildiz holati orqaga qarab tekshirildi (regressiya yo'q, build o'tdi).
    slug: 'dars14-ikkinchi-darajali-tengsizliklar',
    title: 'Dars 14. Ikkinchi darajali tengsizliklar',
    desc: "Bosh asbob endi bitta ildiz (urinish nuqtasi) va nolta ildiz (kesishmaydi) bilan ham ishlaydi. Takroriy ildizda ishora almashmasligi, diskriminant manfiy bo'lganda butun grafik bir xil ishorada turishi, va shundan kelib chiqadigan ikki maxsus javob — \"yechim yo'q\" hamda \"barcha sonlar\" — darslikning ikkala maxsus misolida (4x²+4x+1 va −x²+x−1). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars14.jsx')),
  },
  {
    // 2026-08-27. Darslik 8-§ (32-35-bet): 1-masala — 6-darsning o'z
    // takrori (kvadrat uchhad); 2-masala — x³−x<0, BIRINCHI MARTA uchta
    // ildizli ko'paytma; 3-masala — (x+3)²(x−2)(x−3)>0 uslubidagi
    // takroriy ildiz uch omilli ko'paytmada (o'z sonlari bilan qayta
    // qurilgan, grafik tekis chizilishi uchun). 4-masala (kasr-ratsional,
    // "выколотая точка") BU DARSGA KIRMAYDI — u 17-darsning mavzusi
    // (PODXOD_9SINF.md §12, Шаг 2). `SignAxis` BIRINCHI MARTA uchta
    // ildiz bilan sinovdan o'tkazildi (Dars14dagi umumlashtirish aynan
    // shu daraja uchun tayyorlangan edi, qo'shimcha kod o'zgarishi
    // talab qilinmadi).
    slug: 'dars15-oraliqlar-usuli',
    title: 'Dars 15. Oraliqlar usuli',
    desc: "Uchta va undan ortiq ko'paytuvchili ifodalarni yechish: to'liq ko'paytuvchilarga ajratish, ildizlarni o'qqa qo'yish, eng o'ng oraliqni sonni qo'yib isbotlash, chapga qarab ishorani almashtirish. Nega ishora almashadi (faqat bitta ko'paytuvchi nolni kesib o'tadi) va nega takroriy ildizda saqlanadi (ikki marta almashish bir-birini bekor qiladi) — darslikning o'z misollarida (x³−x<0 va takroriy ildizli ko'paytma). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars15.jsx')),
  },
  {
    // 2026-08-27. Darslik 15-§ (77-80-bet): 1-masala — kvadrat + chiziqli
    // tengsizlik, chegara turlari aralash; 2-masala — modul ichidagi
    // tengsizlik ikki kvadrat tengsizlikdan iborat sistemaga keltiriladi;
    // 3-masala — funksiya aniqlanish sohasi (amaliy qo'llanish); 182(1)-
    // mashq (80-bet) TRANSFER ekranida. YANGI ASBOB: `Overlap` — ikki
    // (yoki undan ortiq) TAYYOR yechimni bitta o'qda solishtiradi,
    // chegara nuqta ochiq/yopiqligi hisoblanadi, qo'lda kuzatilmaydi.
    // PODXOD_9SINF.md da oldindan rejalashtirilmagan edi, mavzudan
    // chiqdi. 18-darsda («majmua») xuddi shu asbob `mode="or"` bilan
    // qayta ishlatiladi.
    slug: 'dars16-tengsizliklar-sistemasi',
    title: 'Dars 16. Tengsizliklar sistemasi',
    desc: "Ikkita tengsizlikning har biri alohida yechiladi, keyin ikkala yechim bitta o'qqa qo'yilib, umumiy qismi (kesishmasi) topiladi. Nega \"va\" birlashma emas kesishma berishi, umumiy qism yo'q holat, va chegara nuqtaning ochiq yoki yopiqligi qaysi tengsizlikdan kelganiga qarab belgilanishi — darslikning uchta misolida (kvadrat+chiziqli, modul, aniqlanish sohasi). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars16.jsx')),
  },
  {
    // 2026-08-27. Bu mavzu alohida bobga ega emas (8-§, 4-masala, 35-bet
    // — yagona darslik misoli). `SignAxis` KENGAYTIRILDI: `roots` elementi
    // endi oddiy son (surat nol nuqtasi, `strict`ga bo'ysunadi) yoki
    // `{ x, excluded: true }` (maxraj nol nuqtasi, HAR DOIM ochiq,
    // `strict`dan qat'i nazar) bo'lishi mumkin. 14-15-darslardagi
    // ogohlantirish aynan shu dars uchun edi (PODXOD_9SINF.md §12, Шаг 2).
    // «Maxrajga ko'paytirib yechish» usuli ATAYLAB ishlatilmaydi — hammasi
    // bitta tomonga ko'chiriladi (§2: o'zgaruvchiga ko'paytirish xavfli).
    slug: 'dars17-kasr-ratsional-tengsizliklar',
    title: 'Dars 17. Kasr-ratsional tengsizliklar',
    desc: "Kasrni maxrajga ko'paytirmasdan, hammasini bitta tomonga ko'chirib, bitta kasr hosil qilish. Surat va maxrajning nollari bitta o'qda, lekin ikki xil qoida bilan: surat nuqtasi tengsizlik qat'iyligiga qarab kiradi yoki kirmaydi, maxraj nuqtasi esa hech qachon kirmaydi. Umumiy ko'paytuvchini qisqartirish teshik nuqtani yo'qotishi — darslikning o'z misolida (surat va maxraj ikkalasi ham ko'paytuvchilarga ajratilgan kasr). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars17.jsx')),
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
  {
    // 2026-08-27. Raskladka skriptdan: scripts/grade9-practice-layout.mjs.
    // 1-darsdagi AYNAN o'sha o'nta mexanika, faqat ketma-ketligi boshqa.
    slug: 'dars02-amaliyot',
    title: "Dars 2 amaliyoti — funksiyaning xossalari (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: toq funksiyaning jadvali, bitta juftlikdan xulosa chiqarib bo'lmasligi, grafik bo'yicha uchta hukm, toqlik bo'yicha simmetrik nuqta, juft va toq funksiyalarni guruhlash, o'sish oralig'i o'qda, xossadan qiymat topish, 'juft emas' dan 'toq' chiqmasligi, juftlik isbotining zanjiri, qoidadagi tushib qolgan so'zlar. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars02/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-amaliyot',
    title: "Dars 3 amaliyoti — kvadrat funksiya (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: funksiya va tenglama farqi, a nolga teng bo'lgan yozuv, uchi bilan nollarni ajratuvchi jadval, funksiyaning nollarini yozish, a ning kattaligi va ishorasi bo'yicha guruhlash, grafikda uchini belgilash, musbat qiymatlar oralig'i o'qda, qoidadagi so'zlar, nollarni topish tartibi, a koeffitsientidagi xato qator. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars03/Dars03Practice.jsx')),
  },
  {
    slug: 'dars04-amaliyot',
    title: "Dars 4 amaliyoti — parabola (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: ozod had uchining abssissasiga ta'sir qilmasligi, simmetriya o'qi haqida uchta hukm, simmetriyani ko'rsatuvchi jadval, o'sish oralig'i o'qda, uchining o'rni bo'yicha guruhlash, uchining ordinatasini hisoblash, simmetrik nuqtani qo'yish, grafik yasash tartibi, qoidadagi so'zlar, x0 formulasidagi ishora xatosi. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars04/Dars04Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot',
    title: "Dars 5 amaliyoti — grafiklarni ko'chirish (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: uchini jadvaldan ajratish, qavsdagi ishoraning teskari ishlashi, qaysi son parabolani yuqoriga ko'taradi, uchini tekislikka qo'yish, o'sish oralig'i o'qda, siljish yo'nalishi bo'yicha guruhlash, uchining abssissasi, uchi formulasidagi ishora xatosi, qoidadagi so'zlar, yasash tartibi. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars05/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot',
    title: "Dars 6 amaliyoti — kvadrat tengsizliklar (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: javob ichki oraliqmi yoki ikki nurmi, ko'paytmaning ishorasi jadvalda, javob shakli mulohazadan, tengsizlik ishorasi bo'yicha guruhlash, javobni o'qda oraliq bilan ko'rsatish, uch hadning nollari, grafikning Ox bilan kesishgan nuqtalari, qoidadagi so'zlar, ishoradan javob shaklini noto'g'ri chiqarish, yechim tartibi. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars06/Dars06Practice.jsx')),
  },
  {
    slug: 'dars07-amaliyot',
    title: "Dars 7 amaliyoti — butun tenglamalar (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: qavs oldidagi minus qoidasi, had ko'chirish jadvalda, butun va kasr tenglamani ajratish, ildizni o'qda nuqta bilan belgilash, ikki chiziqning kesishishi, yozuvlarni turiga ko'ra guruhlash, ildizni yozish, yechim tartibi, qavs ochishdagi xato qator, qoidadagi so'zlar. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars07/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot',
    title: "Dars 8 amaliyoti — kasr-ratsional tenglamalar (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: kasrni jadvalda hisoblash, ODZ nega kerakligi, ODZ va ildiz haqida uchta hukm, kasrning nuqtasini qo'yish, ODZ bo'yicha guruhlash, taqiqlangan sonni o'qda bo'sh nuqta bilan belgilash, ildizni yozish, begona ildizni qabul qilgan xato qator, yechim tartibi, qoidadagi so'zlar. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars08/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot',
    title: "Dars 9 amaliyoti — tenglamalar sistemasi (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: juftlik ikkala tenglamani qanoatlantiradimi, yig'indi va ko'paytmadan tenglama tuzish, jadvalning bo'sh kataklari, yechim va yarim yechimni guruhlash, ko'paytmani yozish, sistemaning yechimini tekislikka qo'yish, kichik ildizni o'qda belgilash, qoidadagi so'zlar, yechim tartibi, juftlik tushib qolgan xato qator. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars09/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot',
    title: "Dars 10 amaliyoti — grafik usul (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: kesishish nuqtasining ma'nosi, umumiy nuqtalar soni haqida uchta hukm, chiziq jadvalining bo'sh kataklari, tenglashtirishdan chiqqan abssissalar, nuqtalarni chiziq va parabola bo'yicha guruhlash, katta abssissani o'qda belgilash, ikkala grafik chizilgan tekislikda kesishishlarni qo'yish, grafik usul qadamlarining tartibi, qoidadagi so'zlar, ishorasi tushib qolgan xato qator. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars10/Dars10Practice.jsx')),
  },
]
