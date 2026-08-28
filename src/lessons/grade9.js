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
  {
    // 2026-08-27. Bu mavzu ham alohida bobga ega emas (DARSLAR_REJASI_9SINF.md:
    // «внутри Алг. §15, отдельного нет»). Darslikda «majmua» so'zi alohida
    // ta'riflanmagan, lekin uning misoli bor: 8-sinf takrori, 7(3)-mashq
    // (3-bet), |3x − 4| ≥ 2. `Overlap` (Dars16) `mode="or"` bilan BIRINCHI
    // MARTA ishlatildi — kod o'zgarishi talab qilinmadi, asbob aynan shu
    // ikkinchi rejim uchun oldindan tayyorlangan edi. Ikkinchi (o'z) misol:
    // |x² − 4x − 1| ≥ 4, javob uchta alohida oraliqdan iborat; xuddi shu
    // ikki tengsizlik sistema (va) bo'lganda kesishma bo'sh chiqishi
    // alohida ekranda ko'rsatildi.
    slug: 'dars18-tengsizliklar-majmuasi',
    title: 'Dars 18. Tengsizliklar majmuasi',
    desc: "Modulli tengsizlik ikki holatga ajraladi, har biri alohida yechilib, birlashtiriladi: kamida bitta shartga mos kelish yetarli. Sistemadan (kesishma, «va») farqi — bir xil ikki tengsizlik majmua (birlashma, «yoki») sifatida butunlay boshqa javob berishi, va chegara manfiy bo'lganda «barcha son» yoki «yechim yo'q» holatini tanish — darslikning o'z misolida (8-sinf takrori, |3x−4|≥2) va sinfning o'z kvadrat misolida. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars18.jsx')),
  },
  {
    // 2026-08-27. BLOK 3 NING OXIRGI AMALIY DARSI. Darslik: II bobga
    // mashqlar (86-87-bet). Bosh misol darslikning O'Z sonlarida —
    // «Тестовые задания к главе II», 4-topshiriq (87-bet): perimetri 30,
    // yuzi 56, tomonlari 7 va 8; bu dars uni TENGSIZLIK ko'rinishida
    // oladi. TRANSFER ekrani — 207(1)-mashq (86-bet) so'zma-so'z.
    // 208-209-mashqlar (eng katta va eng kichik qiymat) ATAYLAB
    // olinmadi: ular 16-§ dagi o'rta arifmetik va o'rta geometrik
    // tengsizligiga tayanadi, u esa 20-darsning mavzusi.
    // Darsning o'z qadami: matematik javobni MA'NO bo'yicha kesish
    // (uzunlik musbat, predmet soni butun) — 16-darsdagi kesishma
    // g'oyasi amalda. Yangi asbob yo'q.
    slug: 'dars19-tengsizlik-masalalari',
    title: 'Dars 19. Tengsizlik masalalari',
    desc: "Matndan tengsizlik tuzish va javobni oraliq ko'rinishida olish: qaysi so'z qaysi belgini beradi (kamida, oshmaydi, kam), noma'lumni qulay tanlash, va eng asosiysi — matematik javobni masalaning ma'nosi bilan kesishtirish, chunki uzunlik manfiy, predmet soni esa kasr bo'la olmaydi. Darslikning o'z sonlarida (perimetr 30, yuz kamida 56) va o'z mashqida (207-mashq, tengsizliklar sistemasi). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars19.jsx')),
  },
  {
    // 2026-08-27. BLOK B3 SHU DARS BILAN YOPILADI. Darslik: 16-§
    // (80-83-bet) UCHTA NOMLI USULNI beradi, har biri o'z masalasida:
    // 1-masala — ta'rifga asoslanib (ayirmani kvadratga keltirish),
    // (a+b)/2 ≥ √(ab); 2-masala — oldin isbotlangandan foydalanib;
    // 3-masala — teskarisini faraz qilib, a + 1/a ≥ 2. 4-masala
    // (tarozi va olma, javob «продавец в убытке») darsning XUKI bo'ldi
    // va 7-ekranda isbotlanadi: taxmin dalilga aylanadi. Mashqlar
    // 183(1), 184(1), 184(2) — mashq va transfer ekranlarida.
    //
    // YANGI ASBOB YO'Q, ATAYLAB: isbot — yozma chiqarish, sinfda bunday
    // holat uchun qaror Dars09da qabul qilingan (RecallMC intro/steps,
    // Track emas). Darsning yangi ko'nikmasi — qaysi usulni tanlash —
    // Drill ga tushdi. SignAxis ishlatilmadi: javob emas, DALIL so'raladi.
    slug: 'dars20-tengsizliklarni-isbotlash',
    title: 'Dars 20. Tengsizliklarni isbotlash',
    desc: "Isbot bir necha sonni tekshirish emas: dalil barcha qiymatlar uchun bir yo'la ishlashi kerak. Uchta nomli usul darslikning o'z masalalarida: ta'rifga asoslanib (ayirmani yozib, kvadratga keltirish), oldin isbotlangan tengsizlikdan foydalanib, va teskarisini faraz qilib. Dars nosoz tarozi haqidagi kutilmagan javob bilan ochiladi va o'sha javobni isbot bilan yopadi. Tuzoq mantiqiy: isbotni isbotlanishi kerak bo'lgan narsadan boshlash. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars20.jsx')),
  },
  {
    // 2026-08-27. BLOK B4 SHU DARS BILAN BOSHLANADI. Darslik: IV bob,
    // 28-§ (150-152-bet). Ta'rif, 1-masala (a_n = n(n−2), a_100 = 9800),
    // 2-masala (a_n = 2n+3: 43 ning nomeri 20; 50 esa had EMAS, chunki
    // n = 23,5 natural emas — darsning bosh fikri), 3-masala (rekurrent).
    //
    // DARSLIKDA OPECHATKA: 3-masalada formula `b_(n+2) = b_(n+1) + b_1`
    // deb chop etilgan, lekin o'sha yerdagi yechim `+ b_n` bo'yicha
    // hisoblaydi va b_5 = 11 beradi (bosilgan formula 6 berardi).
    // Darsda YECHIM bo'yicha olindi, izoh Dars21.jsx shapkasida.
    //
    // YANGI ASBOB: `SeqTable` — sinfning beshinchi asbobi (PODXOD_9SINF.md
    // §3, «прибор 5», B4 ning 7 darsi). B3 da uchta dars yangi asbobsiz
    // yig'ilgan edi, chunki qo'l harakati eskisi qolgandi; bu yerda
    // harakat boshqa — jadvalni birma-bir to'ldirish.
    slug: 'dars21-ketma-ketliklar',
    title: 'Dars 21. Ketma-ketliklar',
    desc: "Nomer va had ikki xil narsa: har bir natural n ga bitta a_n mos keladi. Jadvalni birma-bir to'ldirish, formula bilan uzoq hadga bitta qadamda sakrash, had bo'yicha nomerni topish, va darsning bosh fikri — nomer faqat natural bo'ladi, shuning uchun tenglama yechilsa ham kasr nomer chiqqan son had emas. Rekurrent usulda esa sakrab bo'lmaydi. Darslikning o'z misollarida (28-§, 1-3-masalalar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars21.jsx')),
  },
  {
    // 2026-08-27. Darslik: 29-§ (153-155-bet). Kirish masalasi (kuniga
    // 5 ta test: 5, 10, 15, 20) darsning XUKI. Ta'rif a_(n+1) = a_n + d;
    // darslikning uchta misoli ayirma musbat, MANFIY va NOL bo'lishini
    // ataylab ko'rsatadi. Nom sababi: har bir had ikki qo'shnisining
    // o'rta ARIFMETIGI. Formula (1): a_n = a_1 + (n − 1)d. 2-masala
    // (a_100 = 390), 3-masala (99 ning nomeri 49), 4-masala (a_8 va
    // a_12 berilgan, sistema orqali formulani topish) — mashq, qog'oz
    // va transfer ekranlarida.
    //
    // ASBOB: `SeqTable` (Dars21) ikkinchi marta, endi qadam bir xil
    // bo'lgan holatda. Yangi asbob kerak emas: qo'l harakati o'sha.
    // Darsning bosh tuzog'i — formulada (n − 1) o'rniga n olish, bu
    // mavzuning eng keng tarqalgan xatosi, 12-ekranda ochiladi.
    slug: 'dars22-arifmetik-progressiya',
    title: 'Dars 22. Arifmetik progressiya',
    desc: "Qadam bir xil bo'lgan ketma-ketlik: har bir keyingi had oldingisidan bir xil songa farq qiladi. Ayirma musbat, manfiy va nol bo'lishi, nomning sababi (har bir had qo'shnilarining o'rta arifmetigi), va n-chi had formulasi a_n = a_1 + (n − 1)d — nega aynan n minus bir, chunki birinchi hadga qadam qilinmaydi. Darslikning o'z misollarida (29-§, kirish masalasi va 2-4-masalalar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars22.jsx')),
  },
  {
    // 2026-08-27. Darslik: 30-§ (158-160-bet). 1-masala (birdan yuzgacha
    // yig'indi, yig'indini IKKI MARTA teskari tartibda yozib qo'shish)
    // darsning XUKI. Teorema S_n = (a_1 + a_n)/2 · n xuddi shu usul bilan
    // isbotlanadi. 3-masala IKKI QADAMLI: avval n topiladi, keyin S.
    // 4-masala formulaning ikkinchi ko'rinishini talab qiladi va kvadrat
    // tenglama beradi, uning MANFIY ildizi rad etiladi — bu 19-darsdagi
    // «javobni ma'no bilan kesish» qadamining aynan o'zi, shu sabab
    // tuzoq ekrani shundan qurilgan.
    //
    // ASBOB: `SeqTable` uchinchi marta, endi jadval hadlarni emas,
    // QISMIY YIG'INDILARNI to'ldiradi. Qo'l harakati o'sha, shuning uchun
    // yangi asbob kerak emas, lekin jadvalning ma'nosi boshqa.
    slug: 'dars23-arifmetik-progressiya-yigindisi',
    title: "Dars 23. Arifmetik progressiya yig'indisi",
    desc: "Yig'indini ikki marta, to'g'ri va teskari tartibda yozib qo'shsak, barcha juftlar bir xil bo'ladi — shundan formula chiqadi: chekka ikki hadning o'rtasi, hadlar soniga ko'paytirilgan. Formulaning ikkinchi ko'rinishi oxirgi had noma'lum bo'lganda ishlaydi. Ikki qadamli masala: avval hadlar soni, keyin yig'indi. Va hadlar soni manfiy chiqqan ildizni rad etish. Darslikning o'z misollarida (30-§, 1-4-masalalar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars23.jsx')),
  },
  {
    // Dars 24. GEOMETRIK PROGRESSIYA. Darslik 31-§ (162-165-bet).
    //
    // 22-DARS BILAN PARALLEL QURILDI. U yerda har qadamda d QO'SHILARDI,
    // bu yerda q ga KO'PAYTIRILADI; u yerda had qo'shnilarining o'rta
    // ARIFMETIGI, bu yerda o'rta GEOMETRIGI (darslik nomni aynan shundan
    // chiqaradi, 163-bet); formulada esa ikkalasida ham (n − 1), va sababi
    // bir xil — birinchi hadga qadam qilinmaydi. Parallel atayin: yangi
    // mavzu eski mavzuning yonida turgani uchun tez o'zlashadi, farq esa
    // bitta amalda jamlanadi.
    //
    // XUK — darslikning o'z chizmasi (162-bet): tomoni 4 sm teng tomonli
    // uchburchak, o'rta chiziqlari bilan ichma-ich: 4, 2, 1, 1/2. Bola
    // ayirmani izlaydi va topolmaydi — ayiriladigan son har safar boshqa.
    //
    // MAXRAJNING TO'RT XIL HOLI darslikdan olindi (162-163-bet): butun,
    // kasr, MANFIY (ishoralar almashadi) va bir (o'zgarmas qator).
    // Manfiy maxraj alohida ekranda va alohida jadvalda ishlanadi:
    // 22-darsda bunday hol yo'q edi, ya'ni bu chinakam yangi narsa.
    //
    // TRANSFER — darslikning 4-masalasi (164-bet): b6 = 96, b8 = 384 dan
    // q² = 4 chiqadi, ya'ni IKKITA javob: q = 2 (b1 = 3) va q = −2
    // (b1 = −3). 22-darsning o'xshash masalasida javob bitta edi, farq
    // shundaki, u yerda ayirma chiziqli, bu yerda maxraj kvadratda.
    //
    // ASBOB: `SeqTable` to'rtinchi marta. Qo'l harakati o'sha — katakni
    // birma-bir to'ldirish, shuning uchun yangi asbob kerak emas.
    slug: 'dars24-geometrik-progressiya',
    title: 'Dars 24. Geometrik progressiya',
    desc: "Uchburchak ichida uchburchak: 4, 2, 1, 1/2 — bu yerda qo'shilmaydi, ko'paytiriladi. Maxraj butun, kasr yoki manfiy bo'lishi mumkin, manfiy bo'lganda ishoralar navbatma-navbat almashadi. Nom sababi: musbat hadlarda har bir had qo'shnilarining o'rta geometrigiga teng. Formula b_n = b_1·q^(n−1) da yana o'sha (n − 1). Oxirida ikkita hadi berilgan masala ikkita javob beradi. Darslikning o'z misollarida (31-§, 1-4-masalalar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars24.jsx')),
  },
  {
    // Dars 25. GEOMETRIK PROGRESSIYA DASTLABKI n TA HADINING YIG'INDISI.
    // Darslik 32-§ (167-169-bet).
    //
    // DARSNING BUTUN G'OYASI BITTA QADAMDA: yig'indini q ga ko'paytirib,
    // o'zidan ayirish. Darslikning 1-masalasi (167-bet) shu qadamni
    // SONLARDA ko'rsatadi (S = 1 + 3 + ... + 3⁵, 3S − S = 3⁶ − 1,
    // S = 364), teorema esa AYNAN O'SHA qadamni harflarda takrorlaydi.
    // Shuning uchun urok sonlardan boshlanadi va harflarga o'tadi, teskari
    // emas: bola formulani yodlab emas, chiqarib oladi.
    //
    // 23-DARS BILAN PARALLEL VA FARQ. U yerda ham yig'indi aylanma yo'l
    // bilan olingandi — teskari tartibda yozib qo'shish orqali. Bu yerda
    // o'sha yo'l ISHLAMAYDI, chunki juftlar tenglashmaydi (1 + 27 = 28,
    // lekin 3 + 9 = 12). 2-ekran shu urinishni ataylab qildiradi: yangi
    // usul eskisining o'rniga emas, eskisi to'xtagan joyda tug'iladi.
    //
    // TUZOQ (12-ekran) 24-DARSDAN O'SIB CHIQADI: had formulasida daraja
    // n − 1, yig'indi formulasida esa n. Kamron 2 + 6 + 18 + 54 uchun 3³
    // olib, 26 chiqargan — bu S₃, ya'ni xato ANIQ bitta hadni tushirib
    // qoldiradi. Ekran shu tekshiruvni ochiq ko'rsatadi: xato javob
    // «tasodifiy noto'g'ri» emas, boshqa savolning javobi.
    //
    // q = 1 HOLI alohida ekranda (7-ekran): maxraj nolga aylanadi, bu
    // teoremaning «q ≠ 1» sharti qayerdan kelganini tushuntiradi.
    //
    // TRANSFER — 403-mashq: q = −2, S₈ = 85 → b₁ = −1, b₈ = 128. Manfiy
    // maxrajning JUFT darajasi musbat bo'lishi shu yerda hal qiladi.
    //
    // ASBOB: `SeqTable` beshinchi marta, 23-darsdagidek qismiy
    // yig'indilar bilan. Yangi qo'l harakati yo'q.
    slug: 'dars25-geometrik-progressiya-yigindisi',
    title: "Dars 25. Geometrik progressiya yig'indisi",
    desc: "Yig'indini q ga ko'paytirib, o'zidan ayirsak, o'rtadagi hadlar qisqaradi va faqat ikkitasi qoladi — oltita qo'shish o'rniga bitta ayirish. Shundan formula chiqadi, uning ikkinchi ko'rinishi esa hadlar soni noma'lum bo'lganda ishlaydi. q birga teng bo'lgan hol alohida: maxraj nolga aylanadi. Tuzoq had formulasining n − 1 darajasini yig'indiga olib kirishga qurilgan. Darslikning o'z misollarida (32-§, 1-5-masalalar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars25.jsx')),
  },
  {
    // Dars 26. PROGRESSIYALARGA OID MASALALAR.
    // Darslik: IV bobga doir mashqlar (177-178-bet), 423-438.
    // YANGI NAZARIYA YO'Q — dars butunlay TANIB OLISHGA bag'ishlangan.
    //
    // NEGA ALOHIDA DARS KERAK. 22-25-darslarda to'rtta formula yig'ildi:
    // a_n va S_n arifmetikda, b_n va S_n geometrikda. Har biri o'z
    // darsida oson ishlaydi, chunki tur oldindan ma'lum. Aralashtirilgan
    // masalada esa birinchi qadam formulani qo'llash emas, TANLASH bo'lib
    // qoladi — va aynan shu qadam hech qaysi darsda mashq qilinmagan.
    //
    // XUK ataylab yasalgan juftlik: 3, 6, 9, 12 va 3, 6, 12, 24 —
    // BIRINCHI IKKITA HADI BIR XIL. Ikki had har doim ikkala turga ham
    // to'g'ri keladi, chunki bitta o'tishni «uch qo'shildi» deb ham,
    // «ikkiga ko'paytirildi» deb ham o'qish mumkin. 12-ekrandagi tuzoq
    // shu xatoni Kamronning yechimida takrorlaydi.
    //
    // TRANSFER 22- va 24-DARSNI BIR JOYGA KELTIRADI (437-mashq):
    // −10 va 5 orasiga arifmetik progressiya uchun son qo'yish mumkin
    // (o'rta arifmetik −2,5), geometrik uchun esa mumkin emas
    // (x² = −50). Ya'ni o'rta geometrik faqat bir xil ishorali sonlar
    // orasida yashaydi. Darslikda bu ochiq yozilmagan, lekin 24-darsdagi
    // «musbat hadlarda» shartidan bevosita kelib chiqadi.
    //
    // DARSLIK XATOSI, 433.1: «128, 64, 31, ...» chop etilgan, 31 emas
    // 32 bo'lishi kerak (q = 1/2). 11-ekranda tuzatilgan holda olindi,
    // S_6 = 252. Bu 9-sinf darsligida topilgan ikkinchi terish xatosi.
    //
    // YANGI ASBOB YO'Q: tanib olish qo'l harakati emas, savol.
    slug: 'dars26-progressiya-masalalari',
    title: 'Dars 26. Progressiyalarga oid masalalar',
    desc: "3, 6, 9, 12 va 3, 6, 12, 24 bir xil boshlanadi, lekin bir xil emas — ikkita hadga qarab hukm chiqarib bo'lmaydi. Dars to'rtta tanish formuladan keraklisini tanlashga o'rgatadi: avval tur, keyin had yoki yig'indi. Yig'indi so'ralganda hadlar soni berilmagan bo'lishi mumkin, uni topish kerak. Oxirida −10 va 5 orasiga son qo'yiladi: arifmetik uchun mumkin, geometrik uchun yo'q. Darslikning IV bobga doir mashqlarida (177-178-bet). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars26.jsx')),
  },
  {
    // Dars 27. CHEKSIZ KAMAYUVCHI GEOMETRIK PROGRESSIYA.
    // Darslik 33-§ (171-174-bet). BLOK Б4 NING OXIRGI DARSI.
    //
    // BU YERDA 9-SINF BIRINCHI MARTA LIMIT BILAN UCHRASHADI. Darslik
    // 173-betda lim belgisini kiritadi, lekin dars uni ATAMA sifatida
    // olmaydi: 2- va 5-ekranda hammasi «nolga intiladi» darajasida
    // qoladi. Sabab oddiy — limitning ta'rifi 10-11-sinf ishi, bu yerda
    // esa u faqat formulani chiqarish uchun kerak.
    //
    // XUK darslikning 85-rasmi: tomoni 1 bo'lgan kvadratning yarmi,
    // keyin qolganining yarmi shtrixlanadi. 1/2 + 1/4 + 1/8 + ... = 1
    // ko'z bilan ko'rinadi. Bolaning eng kuchli qarshiligi shu yerda:
    // «cheksiz ko'p qo'shsak, cheksiz chiqadi-ku». Chizma bu qarshilikni
    // bahssiz sindiradi — bo'laklar kvadratdan chiqib keta olmaydi.
    //
    // TA'RIFDA MODUL MUHIM (172-bet). Darslikning (3) misoli ataylab
    // manfiy maxrajli: 1, −1/3, 1/9, −1/27 ham cheksiz kamayuvchi.
    // 3-ekran shu ustiga qurilgan, 9-ekranda esa uchta qatordan biri
    // yana manfiy maxrajli.
    //
    // TUZOQ (12-ekran) SHARTNI TEKSHIRISHGA O'RGATADI. Kamron 1, 2, 4, 8
    // qatoriga formulani qo'llab, S = 1/(1 − 2) = −1 chiqargan. Javob
    // BEMA'NI: musbat sonlar yig'indisi manfiy bo'lolmaydi. Formula shart
    // buzilganda xato aytmaydi, u shunchaki son beradi — ma'nosiz sonni
    // ushlash o'quvchining ishi. Bu 25-darsdagi q = 1 holidan kuchliroq:
    // u yerda nolga bo'lish darrov ko'rinardi, bu yerda esa hech narsa
    // ko'rinmaydi.
    //
    // TRANSFER — darslikning 4-masalasi: 0,(15) = 15/99 = 5/33. Davriy
    // kasr ortida cheksiz kamayuvchi progressiya turgani — mavzuning
    // butunlay boshqa sohaga, sonlarga o'tishi.
    //
    // YANGI ASBOB YO'Q.
    slug: 'dars27-cheksiz-kamayuvchi-progressiya',
    title: 'Dars 27. Cheksiz kamayuvchi geometrik progressiya',
    desc: "Kvadratning yarmi, keyin qolganining yarmi va shu tarzda cheksiz — bo'laklar cheksiz ko'p, lekin ular butun kvadratdan chiqmaydi, demak yig'indi chekli. Shart maxrajning o'zi haqida emas, uning MODULI haqida: manfiy maxrajli qator ham kamayuvchi bo'lishi mumkin. Formula S = b_1 : (1 − q). Tuzoq shartni tekshirmaslikka qurilgan: 1 + 2 + 4 + 8 uchun formula minus bir beradi, ya'ni bema'nilik. Oxirida davriy kasr oddiy kasrga aylanadi. Darslikning o'z misollarida (33-§, 1-4-masalalar). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars27.jsx')),
  },
  {
    // Dars 28. STATISTIK XARAKTERISTIKALAR. BLOK Б5 NING BIRINCHI DARSI.
    // Darslik 38-§ (206-208-bet), 37-§ dan tasodifiy miqdor (198-bet).
    //
    // MAVZU 8-SINFDAN QAYTADI, LEKIN BOSHQA SAVOL BILAN. U yerda har bir
    // xarakteristika alohida o'rgatilgandi. Bu yerda esa asosiy savol
    // boshqa: NEGA ULAR BIR NECHTA. Xuk shu savolni qo'yadi — 5, 5, 5,
    // 5, 5 va 3, 4, 5, 6, 7 guruhlarining o'rtachasi bir xil, o'zlari
    // esa butunlay boshqa. Transfer (13-ekran) shu savolni yopadi:
    // 1, 2, 3, 4, 100 da o'rtacha uchdan yigirma ikkiga sakraydi,
    // mediana esa uchligicha qoladi.
    //
    // DARSLIKDA IKKITA XATO TOPILDI, ikkalasi ham tuzatib olindi:
    //   1) 1-masala 1) (207-bet): 8, 2, 0, 5, −5, 4, 8 tanlanmasi
    //      «−5, 0, 2, 5, 4, 8, 8» deb tartiblangan (5 va 4 o'rin
    //      almashgan) va mediana 5 deb berilgan. To'g'ri tartibda
    //      o'rtada 4 turadi. Bu terish emas, MATEMATIK xato, va u
    //      aynan shu darsning asosiy xatosidan — tartiblamaslikdan —
    //      kelib chiqqan.
    //   2) Kenglik misoli (208-bet): 190, 187, 198, 189, 195, 190 uchun
    //      eng kichik qiymat 186 deb olingan va R = 12 chiqarilgan.
    //      Qatorda 186 yo'q, eng kichigi 187, demak R = 11.
    //
    // YANGI ASBOB: `SortRow` (asboblar.jsx, 7C) — qatorni o'sish
    // tartibida terib chiqish. Sinf qoidasi bo'yicha asbob yangi
    // MAVZUGA emas, yangi QO'L HARAKATIGA beriladi, va bu yerda shunday
    // harakat bor. Asbob tartib buzilishini jismonan imkonsiz qiladi:
    // ya'ni u aynan darslik xato qilgan joyni himoya qiladi. Qator
    // to'lgach o'rtasi o'zi yonadi — mediana sanab emas, ko'rib topiladi.
    //
    // 12-EKRANDAGI TUZOQ darslikning o'z xatosini takrorlaydi: Kamron
    // 10, 3, 8, 1, 6 qatorining o'rtasidan 8 ni olgan.
    slug: 'dars28-statistik-xarakteristikalar',
    title: 'Dars 28. Statistik xarakteristikalar',
    desc: "Ikki guruhning o'rtacha bahosi bir xil, guruhlar esa butunlay boshqa — bitta son hammasini aytmaydi. Dars yana uchtasini beradi: moda eng ko'p uchraydigan qiymat (ikkita bo'lishi yoki umuman bo'lmasligi mumkin), mediana tartiblangan qatorning o'rtasi, kenglik esa tarqoqlik o'lchovi. Chastotalar jadvali bo'yicha o'rtacha alohida ishlanadi. Oxirida bitta chetlashgan son o'rtachani uchdan yigirma ikkiga sudraydi, mediana esa joyida qoladi. Darslikning o'z misollarida (38-§). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars28.jsx')),
  },
  {
    // Dars 29. TASODIFIY HODISANING NISBIY CHASTOTASI.
    // Darslik 36-§ (194-196-bet).
    //
    // REJA §36 NI §34-35 DAN OLDIN QO'YADI, ya'ni darslikning tartibiga
    // teskari: klassik ta'rif 30-darsda keladi. Bu tartib SAQLANDI va
    // u ataylab yaxshi. Darslik 36-§ ni «klassik ta'rif har doim
    // ishlamaydi» degan e'tirozdan boshlaydi, lekin bu e'tiroz hali
    // klassik ta'rifni ko'rmagan bolaga hech narsa demaydi. Teskari
    // tartibda tabiiy chiqadi: avval TAJRIBA (chastotani sanash uchun
    // nazariya kerak emas), keyin savol «nega u aynan yarim atrofida
    // turibdi» — va 30-dars shu savolga javob bo'ladi.
    //
    // YANGI ASBOB: `FreqRun` (asboblar.jsx, 7D). Katta sonlar qonunini
    // gapirib berish mumkin emas: «tajribalar ko'paygan sari chastota
    // barqarorlashadi» degan jumla isbot emas, iltimos bo'lib qoladi.
    // Asbobda bola tajribani O'ZI o'tkazadi, siniq chiziq o'sib boradi:
    // 10 tashlashda W = 1 (o'ntasi ham gerb), 20 da 0,7, 50 da 0,6,
    // 100 da 0,54, 200 da 0,495, 500 da 0,504. Tasodif qat'iy berilgan
    // (mulberry32, seed 513) — rasm har safar bir xil, aks holda
    // tushuntirish «bugun shunday chiqdi» ga aylanardi.
    //
    // XUK shu traektoriyaning boshiga tayanadi: 10 tashlashdan 7 marta
    // gerb hech narsani isbotlamaydi. 4-ekranda bola buni o'z ko'zi
    // bilan ko'radi — asbobning birinchi o'nligi undan ham keskin.
    //
    // TUZOQ (12-ekran): Kamron 30 dan 6 tasini 6 : 24 deb hisoblagan,
    // ya'ni butunga emas QOLDIQQA bo'lgan. Xato xavfli, chunki javob
    // to'g'riga yaqin chiqadi (0,25 va 0,2) va o'zini bildirmaydi.
    // Ekran uni chegaraviy hol bilan yiqitadi: hamma besh baho olsa,
    // Kamronning maxraji nolga aylanadi.
    //
    // TRANSFER (13-ekran) darslikda yo'q: 200 lampochkadan 6 tasi
    // yaroqsiz bo'lsa, 5000 talik partiyada taxminan 150 ta. Chastota
    // shu yerda o'lchovdan BASHORATGA aylanadi — statistikaning butun
    // amaliy ma'nosi shunda.
    slug: 'dars29-chastota-va-ehtimollik',
    title: 'Dars 29. Nisbiy chastota va ehtimollik',
    desc: "O'n tashlashdan yettitasi gerb — bu tanga haqida deyarli hech narsa demaydi. Dars nisbiy chastotani kiritadi va uni bolaning o'z tajribasida ko'rsatadi: asbobda tashlashlar soni ortib boradi va siniq chiziq birdan yarimga tushib, unga yopishib qoladi. Byuffon va Pirsonning haqiqiy tajribalari shu xulosani tasdiqlaydi. Tuzoq maxrajga butun o'rniga qoldiq qo'yishga qurilgan. Oxirida chastota o'lchovdan bashoratga aylanadi. Darslikning o'z misollarida (36-§). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars29.jsx')),
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
