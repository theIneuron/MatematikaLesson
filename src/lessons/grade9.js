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
  {
    // Dars 30. EHTIMOLLIKNING KLASSIK TA'RIFI.
    // Darslik 34-§ (186-189-bet) va 35-§ (190-193-bet).
    //
    // BU DARS 29-DARSNI YOPADI. U yerda tanga 500 marta tashlanib,
    // chastota 0,504 chiqqandi, va savol ochiq qolgandi: nega aynan
    // yarim atrofida. Xuk shu savoldan boshlanadi — o'sha sonni bitta
    // ham tashlashsiz olish mumkinmi.
    //
    // 13-EKRAN IKKALA YO'LNI YONMA-YON QO'YADI: kubik uchun nazariya
    // 1/6 ≈ 0,167 beradi, 29-darsdagi 2000 tashlash 0,17 bergandi.
    // Keyin darrov chegara ko'rsatiladi: lampochka «yaroqli yoki
    // yaroqsiz» uchun teng imkoniyat YO'Q, u yerda faqat chastota
    // ishlaydi. Ikkita ta'rif raqib emas, ular boshqa vaziyatlar uchun.
    //
    // TUZOQ (12-ekran) 35-§ ning asosiy shartiga qurilgan: Kamron
    // «qizil yoki qizil emas, ikkita natija, demak 1/2» deb hisoblagan.
    // Natijalar ikkita bo'lishi yetarli emas, ular TENG IMKONIYATLI
    // bo'lishi kerak. Ekran uni kuchaytirish bilan yiqitadi: o'sha usul
    // 100 ta ko'k va 1 ta qizil sharda ham yarim beradi.
    //
    // ASBOB: `Gate` (14-17-darslardan), navbatni ikkita savatga
    // ajratish. Bu yerda savatlar «qulay / qulay emas». Asbob nusxa
    // OLINMADI: uning uchta yozuvi (capYes, capNo, varLabel) parametrga
    // chiqarildi, eski darslar tegilmadi. Sabab yozilgan grabli: umumiy
    // mexanika begona chizmani sudrab keladi.
    slug: 'dars30-klassik-ehtimollik',
    title: "Dars 30. Ehtimollikning klassik ta'rifi",
    desc: "O'tgan darsda tanga 500 marta tashlanib 0,504 chiqqandi — bugun o'sha yarim bitta ham tashlashsiz olinadi. Hodisalar uch turga bo'linadi, ehtimollik esa qulay natijalarni barcha teng imkoniyatli natijalarga bo'lish bilan topiladi. Paskalning 1654-yilgi xatidagi mulohaza takrorlanadi. Tuzoq: ikkita natija bo'lishi hali yarim degani emas, ular teng imkoniyatli bo'lishi shart. Oxirida ikkala ta'rif yonma-yon qo'yiladi va ularning chegarasi ko'rsatiladi. Darslikning o'z misollarida (34-35-§). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars30.jsx')),
  },
  {
    // Dars 31. KOMBINATORIKA.
    //
    // DARSLIKDA BU MAVZU YO'Q. Tekshirildi: 9-sinf «Algebra» mundarijasi
    // (237-238-bet) bo'yicha V bob faqat 34-38-§ dan iborat.
    // Reja esa uni 31-dars sifatida talab qiladi va bu o'rinli:
    // 30-darsda ehtimollik m/n bo'lib chiqdi, ya'ni ikkita SONNI sanash
    // kerak, kombinatorika esa aynan shu sanashning usuli. Dars
    // darslikning o'z materialidan o'sib chiqadi, tashqaridan olinmaydi.
    //
    // TAYANCH — 30-DARSNING 11-EKRANI: telefon nomerining oxirgi ikkita
    // raqami, 10 · 10 = 100 (darslikning 470-mashqi). U yerda
    // ko'paytirish qoidasi ATALMASDAN ishlatilgan edi, bugun nom oladi.
    //
    // YANGI ASBOB: `TreeBranch` (asboblar.jsx, 7E). «Nega ko'paytiriladi,
    // qo'shilmaydi» degan savolga so'z javob bermaydi — javob chizmada:
    // birinchi tanlovning HAR BIR shoxidan ikkinchisining HAMMA shoxlari
    // chiqadi. Bola darajalarni birma-bir ochadi, hisoblagich ko'paytmani
    // yozib boradi. Ikkitadan ko'p daraja berilmaydi: uchinchisi
    // telefonga sig'maydi.
    //
    // TUZOQ (12-ekran): 1, 2, 3 raqamlaridan uch xonali son tuzishda
    // raqamlar takrorlansa 3³ = 27, takrorlanmasa 3! = 6. Kamron
    // faktorialni olib 6 degan. Bu «formulani eslamaslik» emas, SHARTNI
    // O'QIMASLIK xatosi — kombinatorikada eng ko'p uchraydigani. Ekran
    // uni bitta misol bilan yiqitadi: 111 soni ham shartga to'g'ri
    // keladi, lekin oltitalik ro'yxatda yo'q.
    //
    // TRANSFER (13-ekran) darsni 30-darsga qaytaradi: P(123) = 1/6,
    // takror bilan esa P(111) = 1/27 — ikkala maxraj ham hozir sanalgan
    // natijalar soni.
    slug: 'dars31-kombinatorika',
    title: 'Dars 31. Kombinatorika',
    desc: "Uchta futbolka va to'rtta yubka yettita emas, o'n ikkita to'plam beradi — daraxt chizmasi nega ko'paytirish kerakligini ko'rsatadi. Qoida uchta va undan ko'p tanlovga kengayadi, keyin qatorga terish va faktorial keladi: 10! uch milliondan ortiq, ya'ni bunday masalalarni sanab chiqib bo'lmaydi. Eng muhim shart — takrorlanishga ruxsat bormi: bir xil raqamlarda javob 6 yoki 27 bo'lishi mumkin. Oxirida hammasi ehtimollik formulasining maxrajiga qaytadi. Darslikda alohida paragraf yo'q, tayanch 35-§ (470-mashq). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars31.jsx')),
  },
  {
    // Dars 32. EHTIMOLLIK VA STATISTIKAGA OID MASALALAR. BLOK Б5 YAKUNI.
    // Darslik: V bobga doir mashqlar (213-bet, 500-508) va 38-§ ning
    // oxirgi qismi (209-210-bet).
    //
    // DARS IKKI ISHNI BAJARADI. Birinchisi — V bobning hamma mavzusini
    // bitta joyga yig'ish (501, 502 klassik ehtimollik; 503 kubik va
    // tanga, ya'ni kombinatorika bilan; 504-507 statistika). Ikkinchisi
    // — DISPERSIYA va SIGMANI kiritish. Ular 28-darsga sig'magandi
    // (u yerda moda, mediana, kenglik, o'rtacha), 508-mashq esa aynan
    // dispersiyani so'raydi, ya'ni ularni tashlab ketib bo'lmaydi.
    //
    // XUK 28-DARSNING XUKINI DAVOM ETTIRADI VA UNI SINDIRADI. U yerda
    // «bitta son yetmaydi» degan edik va kenglik javob bo'lgandi.
    // Bu yerda 1, 5, 5, 5, 9 va 1, 1, 5, 9, 9 tanlanmalarining
    // o'rtachasi ham, medianasi ham, KENGLIGI ham bir xil (5, 5, 8),
    // o'zlari esa boshqa. Kenglik faqat ikkita chekka songa qaraydi.
    // Dispersiya hammasini sanaydi: 6,4 va 12,8.
    //
    // TUZOQ (12-ekran): chetlanishlarni kvadratsiz qo'shish. Yig'indi
    // HAR QANDAY tanlanmada nol, chunki o'rtacha aynan shunday
    // tanlangan. Kamron shundan «tarqoqlik yo'q» degan. Ekran uni
    // ikkinchi misol bilan yiqitadi: 1, 4, 7 ancha tarqoq, yig'indisi
    // baribir nol. Kvadrat ixtiro emas, ehtiyoj.
    //
    // TRANSFER — darslikning 210-betdagi mulohazasi: santimetrda
    // o'lchangan miqdorning dispersiyasi kvadrat santimetrda chiqadi.
    // Ildiz «chiroyli qilish» uchun emas, O'LCHOV BIRLIGINI qaytarish
    // uchun olinadi.
    //
    // YANGI ASBOB YO'Q: `SortRow` (28-dars) medianaga qaytadi.
    slug: 'dars32-ehtimollik-masalalari',
    title: 'Dars 32. Ehtimollik va statistikaga oid masalalar',
    desc: "1, 5, 5, 5, 9 va 1, 1, 5, 9, 9 — o'rtachasi, medianasi va kengligi bir xil, o'zlari esa boshqa: kenglik faqat chekkalarni ko'radi. Dars dispersiyani chiqaradi (6,4 va 12,8) va nega chetlanishlar kvadratga ko'tarilishini ko'rsatadi — ularning oddiy yig'indisi har doim nol. Sigma esa o'lchov birligini qaytaradi. Yonida V bobning masalalari: sharlar, birdan elligacha sonlar, kubik va tanga birga. Darslikning o'z mashqlarida (500-508). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars32.jsx')),
  },
  {
    // Dars 33. TRIGONOMETRIYA ELEMENTLARI. BLOK Б6 NING BOSHI.
    // Darslik: III bob, 17-22-§ (93-119-bet).
    //
    // OLTITA PARAGRAF BITTA DARSDA — reja shunday talab qiladi. Buni
    // «hammasini aytib chiqish» bilan bajarib bo'lmaydi, shuning uchun
    // darsning umurtqasi bitta narsa: BIRLIK AYLANA. Har bir paragraf
    // undan o'qib olinadi:
    //   17-§ radian — yoy radiusga teng bo'lgan burchak;
    //   18-§ burish — (1; 0) nuqtani burchakka burish;
    //   19-§ ta'riflar — abssissa kosinus, ordinata sinus;
    //   20-§ ishoralar — chorak koordinataning ishorasini beradi;
    //   21-§ sin² + cos² = 1 — bu x² + y² = 1 ning o'zi;
    //   22-§ tangens — sinusning kosinusga nisbati.
    // Ya'ni dars oltita mavzuni emas, BITTA chizmani o'rgatadi.
    //
    // YANGI ASBOB: `UnitCircle` (asboblar.jsx, 7F). Bu dars asbobsiz
    // o'tolmaydi: sinus va kosinusning ta'rifi HARAKAT — nuqtani burish
    // va koordinatani o'qish. Bola burchakni tanlaydi, nuqta aylana
    // bo'ylab 0,6 soniyada siljiydi, proyeksiyalar u bilan birga
    // o'zgaradi, pastda cos va sin yoziladi. Burish musbat yo'nalishda.
    //
    // TUZOQ (12-ekran): sinus va kosinusni almashtirish. Bu tasodifiy
    // xato emas — YOZUVDA sinus oldin keladi, CHIZMADA esa abssissa
    // oldin o'qiladi, xato shu qarama-qarshilikdan tug'iladi. Ekran uni
    // yodlatish bilan emas, chizmaga qaytarish bilan yechadi: π/6 kichik
    // burchak, nuqta pastroqda, demak tik koordinata kichik.
    //
    // TRANSFER (13-ekran) 19, 20 va 21-§ ni birga ishlatadi: ayniyat
    // sonning kattaligini beradi, chorak esa ishorasini.
    slug: 'dars33-trigonometriya-elementlari',
    title: 'Dars 33. Trigonometriya elementlari',
    desc: "Burchakni radiusning o'zi bilan o'lchash mumkin — shunda bir radian, taxminan 57 gradus chiqadi. Keyin birlik aylanada (1; 0) nuqta buriladi va uning abssissasi kosinus, ordinatasi sinus bo'lib chiqadi: bu ta'rif emas, o'qish. Ishoralarni yodlash shart emas, ular chorakdan ko'rinadi. sin² + cos² = 1 esa aylananing x² + y² = 1 tenglamasining o'zi. Oltita paragraf bitta chizmadan o'qiladi (17-22-§). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars33.jsx')),
  },
  {
    // Dars 34. TRIGONOMETRIK FORMULALAR. BLOK Б6 YAKUNI.
    // Darslik: 24-§ (121-125), 25-§ (126-128), 26-§ (129-134),
    // 27-§ (135-137).
    //
    // TO'RTTA PARAGRAF BITTA DARSDA. 33-darsda umurtqa BITTA CHIZMA
    // edi, bu yerda BITTA FORMULA — qo'shish formulasi. Qolgan uchtasi
    // uning natijasi va dars ularni aynan shunday CHIQARADI:
    //   25-§ ikkilangan burchak — β o'rniga α qo'yiladi;
    //   26-§ keltirish — β o'rniga π/2 yoki π qo'yiladi;
    //   27-§ yig'indi formulalari — o'sha formula teskari o'qiladi.
    // Bu yodlash hajmini to'rt barobar kamaytiradi va unutilgan
    // formulani qayta chiqarish imkonini beradi.
    //
    // XUK darslikning 1-masalasi (122-bet): cos75°. Bolaning birinchi
    // harakati — cos45° va cos30° ni qo'shish. Javob bahssiz yiqiladi:
    // yig'indi 1,57 chiqadi, kosinus esa birdan katta bo'lolmaydi.
    // Ya'ni xato «formulani bilmaslik» emas, TEKSHIRISH ODATINING
    // yo'qligi — va butun dars shu odatni qo'yishga ishlaydi.
    //
    // TUZOQ (12-ekran) shu chiziqning cho'qqisi: Kamron qo'shish
    // formulasida minus o'rniga plyus yozgan. Yodlatish o'rniga
    // tekshirish beriladi: α = β = 45° da chap tomon cos90° = 0,
    // plyusli formula esa 1 beradi. Bitta almashtirish hal qiladi.
    //
    // TRANSFER — darslikning 300-mashqi: sinα + cosα = 1/2 dan sin2α.
    // Ikkala tomonni kvadratga ko'tarish kerak, va u yerda 33-darsning
    // asosiy ayniyati bugungi ikkilangan burchak bilan BIRGA ishlaydi:
    // (sin + cos)² = 1 + sin2α, javob −3/4. Alfaning o'zi topilmaydi —
    // masalada har doim ham noma'lumni topish shart emasligi shu yerda
    // ko'rinadi.
    //
    // YANGI ASBOB YO'Q: mavzu formulaviy, uning harakati almashtirib
    // tekshirish.
    slug: 'dars34-trigonometrik-formulalar',
    title: 'Dars 34. Trigonometrik formulalar',
    desc: "cos 45 va cos 30 ni qo'shsak, bir butun ellik yetti yuzdan chiqadi — kosinus esa birdan katta bo'lolmaydi, demak bunday qo'shish mumkin emas. Dars bitta qo'shish formulasini beradi va qolgan hammasini undan chiqaradi: β o'rniga α qo'ysak ikkilangan burchak, π/2 qo'ysak keltirish, teskari o'qisak yig'indi formulasi. Tuzoq unutilgan ishorani yodlash bilan emas, qirq besh gradusda tekshirish bilan tiklaydi. Oxirida 33-darsning ayniyati bilan birga ishlanadi. Darslikning o'z misollarida (24-27-§). 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars34.jsx')),
  },
  {
    // Dars 35. FIGURALARNING O'XSHASHLIGI. GEOMETRIYA BLOKI BOSHI (Б7).
    // Darslik ALMASHDI: bu yerdan boshlab «Geometriya 9» ishlatiladi.
    // Manba: 6-dars (28-29-bet), 7-dars (30-31), 8-dars (32-33).
    //
    // DARSNING G'OYASI IKKITA QARAMA-QARSHI AKSILMISOLDA. Ta'rifda
    // ikkita shart bor, bola esa odatda bittasini yetarli deb biladi:
    //   xuk — burchaklar teng, tomonlar proporsional emas (darslikning
    //         2-masalasi: kvadrat va 2×1 to'rtburchak);
    //   3-ekran — tomonlar proporsional, burchaklar teng emas (romblar).
    // Ikkita ko'zgu misol ta'rifni bahssiz qiladi. Keyin uchburchak
    // uchun yengillik: u yerda ikkita burchak YETARLI.
    //
    // TUZOQ (12-ekran): yuzlar nisbatini k deb olish. Ekran uni SANASH
    // bilan yiqitadi: k = 3 da katta kvadratga kichigidan to'qqiztasi
    // sig'adi, uchtasi emas.
    //
    // YANGI ASBOB YO'Q, LEKIN YANGI CHIZMA BOR: `PolyPair` (7G) va
    // `RecallMC` ning `figure` sloti. Sinf qoidasi bo'yicha asbob yangi
    // HARAKATGA beriladi, bu yerda harakat o'sha — variantni tanlash,
    // yangisi faqat KO'RISH kerakligi. Shuning uchun asbob emas, mavjud
    // asbobga chizma sloti ochildi. Bu butun geometriya bloki (35-52)
    // uchun ishlaydi va har darsda yangi asbob yasashdan qutqaradi.
    slug: 'dars35-figuralar-oxshashligi',
    title: "Dars 35. Figuralarning o'xshashligi",
    desc: "Kvadrat va 2×1 to'rtburchakning hamma burchagi to'qson gradus, lekin ular o'xshash emas. Ikkita rombning tomonlari proporsional, ular ham o'xshash emas. Ikkita aksilmisol ta'rifni bahssiz qiladi: o'xshashlik uchun IKKALA shart kerak. Uchburchak uchun esa yengillik bor — ikkita burchak yetarli. Perimetr k marta, yuz esa k kvadrat marta ortadi, va tuzoq aynan shu yerda: k = 3 da katta kvadratga kichigidan to'qqiztasi sig'adi. Geometriya 9, 6-8-darslar. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars35.jsx')),
  },
  {
    // Dars 36. GEOMETRIK ALMASHTIRISHLAR.
    // Darslik: Geometriya 9, 15-dars (48-49), 16-dars (50-51),
    // 17-dars (52-53).
    //
    // DARSNING UMURTQASI — BITTA SAVOL: qaysi almashtirish MASOFANI
    // saqlaydi. Uchtasi saqlaydi (parallel ko'chirish, o'qqa va markazga
    // nisbatan simmetriya) va harakat deb ataladi, 35-darsdagi
    // o'xshashlik esa saqlamaydi. Shuning uchun xuk ikkita darsni
    // ulaydi: siljitilgan figura TENG, kattalashtirilgani esa faqat
    // O'XSHASH. Ta'rif «shakl o'zgarmadi» emas, «masofa o'zgarmadi».
    //
    // KOORDINATALAR TAYANCH: simmetriyani ko'zdan aniqlash aldamchi,
    // koordinatada esa u bitta ishora almashishi. Darslik 16-darsda
    // simmetriya harakat ekanini aynan masofa formulasi bilan
    // isbotlaydi — 5-ekran shu isbotni takrorlaydi: ayirmaning ishorasi
    // almashadi, kvadrati esa yo'q.
    //
    // TUZOQ (12-ekran): Oy o'qiga nisbatan simmetriyada y ni
    // almashtirish. Xato ILDIZI nomda: harf o'QNI ataydi, o'zgaradigan
    // koordinatani emas. Ekran uni yodlatish bilan emas, o'qning
    // yo'nalishini so'rash bilan yechadi.
    //
    // TRANSFER: markaziy simmetriya bu 180 gradusga burish. Ikkita
    // boshqa ta'rif bitta almashtirishni beradi.
    //
    // CHIZMA: `PolyPair` ga `axis` qo'shildi ('v' — o'q, 'c' — markaz).
    // Simmetriyada ikkita figurani ko'rsatishning o'zi yetmaydi, ular
    // ORASIDAGI o'q ko'rinishi shart.
    slug: 'dars36-geometrik-almashtirishlar',
    title: 'Dars 36. Geometrik almashtirishlar',
    desc: "Kattalashtirilgan uchburchakning shakli o'zgarmaydi, lekin masofalar ikki barobar ortadi — demak bu harakat emas. Harakat deb masofani SAQLAYDIGAN almashtirishga aytiladi, ularning uchtasi bor: parallel ko'chirish, o'qqa va markazga nisbatan simmetriya. Koordinatada hammasi bitta ishora almashishi: tik o'q abssissani, yotiq o'q ordinatani, markaz esa ikkalasini. Tuzoq nomdagi harfga qurilgan: Oy o'qi y ni emas, x ni almashtiradi. Geometriya 9, 15-17-darslar. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars36.jsx')),
  },
  {
    // Dars 37. AYLANAGA ICHKI CHIZILGAN BURCHAK.
    //
    // DARSLIK 8-SINFDAN. Tekshirildi: «Geometriya 9» mundarijasida bu
    // mavzu yo'q (V bob aylanaga bag'ishlanmagan), reja ham shuni
    // aytadi. Manba — «Geometriya 8», 36-mavzu (114-117-bet), tayanch
    // 33-mavzu (markaziy burchak, 107-bet). Fayl repozitoriyda bor:
    // src/books/grade8/geometriya_8_uzb.pdf.
    //
    // XUK DARSLIKNING 196-a RASMIDAN va u darsning butun mazmunini
    // bitta kadrda beradi: uchta ichki chizilgan burchak bitta yoyga
    // tiralgan, uchlari esa aylananing turli joylarida. Ko'z bilan ular
    // har xil ko'rinadi, aslida esa TENG. Xulosa: burchakni uchning
    // joyi emas, YOY belgilaydi.
    //
    // TUZOQ (12-ekran): yarmini unutish, ya'ni burchakni yoyga teng deb
    // olish. Bu mavzuning yagona va eng keng tarqalgan xatosi. Ekran
    // uni diametr bilan yiqitadi: agar burchak 180° bo'lsa, u yoyilgan
    // burchak bo'lardi, tomonlari bitta to'g'ri chiziqda yotardi va
    // uchburchak umuman qolmasdi.
    //
    // TRANSFER darslikda yo'q, lekin teoremadan bir qadamda chiqadi:
    // ichki chizilgan to'rtburchakda qarama-qarshi burchaklar yig'indisi
    // 180°, chunki ular ikkita yoyning yarmi, yoylar esa birgalikda
    // 360° beradi.
    //
    // CHIZMA: yangi `CircleFig` (asboblar.jsx, 7H) — aylana, vatarlar,
    // radiuslar va ajratilgan yoy. U 38, 39 va 44-darslar uchun ham
    // ishlaydi, ularning hammasi aylana ustida.
    slug: 'dars37-ichki-chizilgan-burchaklar',
    title: 'Dars 37. Ichki chizilgan burchaklar',
    desc: "Bitta yoyga tiralgan uchta burchakning uchlari aylananing turli joylarida, o'zlari esa teng — burchakni uchning joyi emas, yoy belgilaydi. Teorema: ichki chizilgan burchak yoyning yarmi. Undan ikkita natija chiqadi, ikkinchisi masalalarda eng ko'p ishlatiladi: diametrga tiralgan burchak har doim to'g'ri. Tuzoq yarmini unutishga qurilgan va diametr bilan yiqitiladi. Oxirida ichki chizilgan to'rtburchakning xossasi chiqariladi. Geometriya 8, 36-mavzu. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars37.jsx')),
  },
  {
    // Dars 38. AYLANAGA URINMA.
    // Darslik 8-sinfdan (37-darsdagi kabi): «Geometriya 8», 35-mavzu
    // (111-113-bet). «Geometriya 9» da urinma yo'q.
    //
    // DARSNING UMURTQASI — BITTA SOLISHTIRISH: markazdan chiziqqacha
    // masofa d va radius R. Uchta holni yodlash kerak emas, ular shu
    // taqqoslashdan chiqadi: d > R nuqta yo'q, d = R urinma, d < R
    // kesuvchi. Ikkinchi umurtqa — PERPENDIKULYARLIK: urinma bilan
    // bog'liq deyarli har bir masala shu to'g'ri burchakdan boshlanadi.
    //
    // ISBOT ZANJIRI CHIROYLI VA QISQA, dars uni to'liq yuritadi:
    // 2-ekran «eng qisqa kesma perpendikulyar» → 4-ekran «urinmaning
    // boshqa hamma nuqtasi uzoqroqda, demak radius eng qisqa» → demak
    // radius perpendikulyar. Bola teoremani eshitmaydi, chiqaradi.
    //
    // TUZOQ (12-ekran) 27-DARSNING ODATIGA QAYTADI. Kamron vatar
    // formulasini d > R holda qo'llagan va ildiz ostida manfiy son
    // chiqqan. Manfiy son XATO emas, XABAR: bunday vatar yo'q. Formula
    // shartini o'zi tekshirmaydi — buni o'quvchi qiladi.
    //
    // TRANSFER — darslikning 430-mashqi: A dan BC gacha masofa
    // 33-darsning sinusi bilan topiladi (AC = 10·sin30° = 5), keyin
    // bugungi uchta hol qo'llanadi. Bitta son uchala savolga javob
    // beradi.
    //
    // CHIZMA: `CircleFig` (7H) 37-darsdan qayta ishlatildi.
    slug: 'dars38-aylanaga-urinma',
    title: 'Dars 38. Aylanaga urinma',
    desc: "To'g'ri chiziq aylanani necha joyda kesishi faqat ikkita songa bog'liq: markazdan chiziqqacha masofa va radius. Ularni solishtirish uchala holni ham beradi, yodlash kerak emas. Urinmaning asosiy xossasi qisqa zanjirdan chiqariladi: eng qisqa kesma perpendikulyar, radius esa eng qisqa — demak urinma radiusga perpendikulyar. Tuzoq vatar formulasini d radiusdan katta bo'lgan holda qo'llashga qurilgan: ildiz ostidagi manfiy son xato emas, xabar. Geometriya 8, 35-mavzu. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars38.jsx')),
  },
  {
    // Dars 39. ICHKI VA TASHQI CHIZILGAN KO'PBURCHAKLAR.
    // Darslik: Geometriya 9, 36-dars (104-105) va 38-dars (108-109).
    //
    // DARS 37-DARSNI DAVOM ETTIRADI VA UNI YOPADI. U yerda TRANSFER
    // sifatida ichki chizilgan to'rtburchakda qarama-qarshi burchaklar
    // yig'indisi 180° ekani chiqarilgandi. Bugun shu tenglik IKKINCHI
    // TOMONDAN o'qiladi: u nafaqat natija, balki SHART ham. Ya'ni
    // yig'indi 180° bo'lmasa, tashqi aylana umuman chizilmaydi.
    //
    // XUK KUTILMAGAN: parallelogramm. Bolaga u «yaxshi, tartibli»
    // figura bo'lib tuyuladi, lekin unga tashqi aylana chizib
    // bo'lmaydi — qarama-qarshi burchaklari TENG, demak yig'indi 180°
    // bo'lishi uchun har biri 90° bo'lishi kerak. Faqat to'g'ri
    // to'rtburchak ichki chiziladi.
    //
    // TUZOQ (12-ekran) shu fikrni sinaydi: romb. Unda hamma tomon teng
    // va bu «juda muntazam» taassurot beradi, lekin shart TOMONLAR
    // haqida emas, BURCHAKLAR haqida. Faqat kvadrat ichki chiziladi.
    //
    // TRANSFER 37-darsning «diametrga tiralgan burchak 90°» natijasini
    // TESKARI yo'nalishda ishlatadi: to'g'ri burchakli uchburchakda
    // gipotenuza diametr, demak R = c : 2. Bu 36.4-mashqni bir qatorda
    // yechadi, va o'sha fikr 10-ekranda to'g'ri to'rtburchakning
    // diagonaliga ko'chiriladi.
    //
    // CHIZMA: `CircleFig` (7H) qayta ishlatildi, yangi asbob yo'q.
    slug: 'dars39-ichki-tashqi-kopburchaklar',
    title: "Dars 39. Ichki va tashqi chizilgan ko'pburchaklar",
    desc: "Parallelogramm juda tartibli figura, lekin unga tashqi aylana chizib bo'lmaydi: qarama-qarshi burchaklari teng, demak yig'indi 180° bo'lishi uchun har biri 90° bo'lishi kerak. 37-darsda chiqarilgan tenglik bugun shart bo'lib o'qiladi. Markaz tomonlarning o'rta perpendikulyarlarida yotadi, to'g'ri burchakli uchburchakda esa gipotenuza diametr va radius bir qadamda topiladi. Tuzoq rombga qurilgan: tomonlar emas, burchaklar hal qiladi. Geometriya 9, 36 va 38-darslar. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars39.jsx')),
  },
  {
    // Dars 40. O'XSHASHLIKNING IKKINCHI VA UCHINCHI ALOMATLARI.
    // Darslik: Geometriya 9, 9-dars (34-35), 10-dars (36-37),
    // 12-dars (40-41).
    //
    // REJA O'ZGARTIRILDI, SABABI YOZIB QO'YILDI. Reja bu o'rinda
    // «Vektorlar, 8-sinf darsligidan» deb turardi. Tekshirildi: vektor
    // mavzulari 8-SINF KURSIDA allaqachon yig'ilgan (8-53, 8-54, 8-55),
    // ya'ni reja bo'yicha yozilsa, to'liq takror bo'lardi. Shuning
    // uchun 40-42 darslar 9-sinf darsligining O'ZIDA bo'sh turgan
    // mavzular bilan almashtirildi: 40 — ikkinchi va uchinchi alomat
    // (34-37-bet), 41 — gomotetiya (62-65), 42 — aylanadagi proporsional
    // kesmalar (138-139). Uchalasi ham 8-sinfda yo'q (tekshirildi:
    // grade8.js da «o'xshash» va «gomotet» so'zlari umuman uchramaydi).
    //
    // DARS 35-DARSNI DAVOM ETTIRADI. U yerda faqat BIRINCHI alomat
    // berilgandi — ikkita burchak. Bugungi savol boshqacha: burchaklar
    // umuman berilmagan bo'lsa nima qilish kerak. Xuk shu savolni
    // qo'yadi (3, 4, 5 va 6, 8, 10 — birorta burchak yo'q), javob esa
    // uchta alomat bitta xulosaga uchta turli kirish ekani.
    //
    // TUZOQ (12-ekran): uchta nisbatdan faqat ikkitasini tekshirish.
    // 3, 4, 5 va 6, 8, 11 da birinchi ikkitasi 2 ga teng, uchinchisi
    // 2,2. Xato ayniqsa xavfli, chunki CHIZMADAN ko'rinmaydi: tomonlari
    // 6, 8, 11 bo'lgan uchburchak mavjud (6 + 8 > 11) va oddiy ko'rinadi.
    //
    // TRANSFER — 12-darsning teoremasi: bissektrisa tushgan tomonni
    // qolgan ikki tomonga proporsional ajratadi (8, 6, 7 da bo'laklar
    // 4 va 3). Bu 45-darsdagi metrik munosabatlarga tayanch.
    slug: 'dars40-oxshashlik-alomatlari',
    title: "Dars 40. O'xshashlikning ikkinchi va uchinchi alomatlari",
    desc: "Tomonlari 3, 4, 5 va 6, 8, 10 bo'lgan uchburchaklarda birorta burchak berilmagan — 35-darsning alomati ishlamaydi, lekin javob baribir bor. Uchta tomon proporsional bo'lsa yoki ikkita tomon va ular ORASIDAGI burchak teng bo'lsa, uchburchaklar o'xshash. Uchta alomat bitta xulosaga uchta kirish, tanlash esa berilgan ma'lumotga bog'liq. Tuzoq uchinchi nisbatni tekshirmaslikka qurilgan va chizmadan ko'rinmaydi. Oxirida bissektrisa haqidagi teorema. Geometriya 9, 9, 10 va 12-darslar. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars40.jsx')),
  },
  {
    // Dars 41. GOMOTETIYA.
    // Darslik: Geometriya 9, 20-dars (62-63-bet).
    //
    // REJA O'ZGARTIRILDI, sabab 40-darsning izohida yozilgan: reja bu
    // o'rinda vektorlarni so'rardi, vektorlar esa 8-sinf kursida
    // allaqachon bor (8-53, 8-54, 8-55). Gomotetiya 8-sinfda YO'Q
    // (tekshirildi) va 9-sinf darsligining o'zida turibdi.
    //
    // DARS 36-DARSNING OCHIQ SAVOLIGA JAVOB. U yerda uchta almashtirish
    // ko'rilgandi va hammasi HARAKAT edi, ya'ni masofani saqlardi.
    // Gomotetiya masofani k marta KO'PAYTIRADI, demak harakat emas.
    // Xuk shu qarama-qarshilikdan boshlanadi: shakl kattalashdi, lekin
    // burchaklari o'sha, bu harakat bo'la oladimi.
    //
    // 40-DARS SHU YERDA ISHGA TUSHADI. Gomotetiyaning o'xshashlik ekani
    // IKKINCHI ALOMAT bilan isbotlanadi: XOY va X₁OY₁ uchburchaklarda
    // ∠O umumiy va OX₁/OX = OY₁/OY = k. Kecha o'rganilgan alomat bugun
    // teoremani isbotlaydi — 4-ekran buni ochiq ko'rsatadi.
    //
    // TUZOQ (12-ekran): yuz ham k marta ortadi deb hisoblash. Ekran uni
    // birlik kvadrat bilan yiqitadi: k = 2 da yangi kvadratning tomoni
    // ikki, yuzi to'rt, ya'ni nisbat k emas, k kvadrat.
    //
    // TRANSFER: 20.7-mashqning ma'nosi — istalgan ikkita aylana
    // gomotetik, koeffitsienti radiuslar nisbati. Shundan BARCHA
    // aylanalar o'zaro o'xshash ekani chiqadi, uchburchaklardan farqli:
    // aylanani bitta son belgilaydi, uchburchakni esa uchta.
    slug: 'dars41-gomotetiya',
    title: 'Dars 41. Gomotetiya',
    desc: "36-darsda ko'rilgan uchala almashtirish masofani saqlardi. Gomotetiya birinchi bo'lib uni o'zgartiradi: har bir nuqta OX nurida OX₁ = k · OX shartiga ko'ra siljiydi, shakl esa siqiladi yoki cho'ziladi. Uning o'xshashlik almashtirishi ekani 40-darsning ikkinchi alomati bilan isbotlanadi, shundan yuzlar nisbati k kvadratga teng bo'lib chiqadi. Tuzoq yuzni k marta ko'paytirishga qurilgan. Oxirida: nega barcha aylanalar o'xshash, uchburchaklar esa yo'q. Geometriya 9, 20-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars41.jsx')),
  },
  {
    // Dars 42. AYLANADAGI PROPORSIONAL KESMALAR.
    // Darslik: Geometriya 9, 52-dars (138-139-bet).
    //
    // REJA O'ZGARTIRILDI, sabab 40-darsning izohida. Vektorlar 8-sinf
    // kursida bor, bu mavzu esa 9-sinf darsligining o'zida turibdi va
    // 8-sinfda yo'q.
    //
    // BUTUN DARS BITTA G'OYAGA QURILGAN: nuqtadan chiqqan ikki
    // chiziqning kesmalari KO'PAYTMASI o'zgarmaydi. Ichkarida bu
    // AK · KB = CK · KD, tashqarida esa PA² = PB · PC. Ikkala teorema
    // ham bitta usul bilan isbotlanadi: yoy burchaklarni tenglashtiradi,
    // tenglashgan burchaklar o'xshashlik beradi, o'xshashlik proporsiya
    // beradi, proporsiya esa ko'paytmalar tengligini.
    //
    // IKKALA TAYANCH HAM SHU HAFTADAN: 37-darsdan bitta yoyga tiralgan
    // burchaklarning tengligi, 40-darsdan alomatlar. Isbot boshqa hech
    // narsa talab qilmaydi — radius ham, burchakning kattaligi ham
    // kerak emas, va bu 8-ekranda ochiq so'raladi.
    //
    // TUZOQ (12-ekran): ko'paytirish o'rniga QO'SHISH. Ekran uni
    // sonlar bilan emas, MA'NO bilan yiqitadi: agar yig'indilar teng
    // bo'lganda, ikkala vatar ham bir xil uzunlikda bo'lardi.
    //
    // TRANSFER — 52.6: R = 13, markazdan P gacha 5, vatar 25. P orqali
    // DIAMETR o'tkaziladi, uning bo'laklari 13 + 5 va 13 − 5, ko'paytmasi
    // 144. Demak vatarning bo'laklari 16 va 9. Diametr har doim
    // ishlaydigan yordamchi chiziq, chunki uning bo'laklari radius va
    // markazgacha masofadan darhol chiqadi.
    //
    // CHIZMA: yangi `PowerFig` (7I) — asbob emas, chizma; ikkita rejim:
    // ichkarida kesishgan vatarlar va tashqi nuqtadan urinma bilan
    // kesuvchi. Yangi asbob yasalmadi, chunki yangi qo'l harakati yo'q.
    slug: 'dars42-aylanadagi-kesmalar',
    title: 'Dars 42. Aylanadagi proporsional kesmalar',
    desc: "Ikkita vatar kesishgan, bo'laklaridan uchtasi ma'lum. Radius ham, burchak ham berilmagan, lekin to'rtinchi bo'lak topiladi: yoy burchaklarni tenglashtiradi, tenglashgan burchaklar o'xshashlik beradi, o'xshashlikdan esa AK · KB = CK · KD chiqadi. Tashqi nuqta uchun o'sha g'oya PA² = PB · PC ko'rinishini oladi. Tuzoq ko'paytirish o'rniga qo'shishga qurilgan. Oxirida: vatarning bo'laklarini diametr orqali topish. Geometriya 9, 52-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars42.jsx')),
  },
  {
    // Dars 43. IKKI VEKTOR ORASIDAGI BURCHAK VA SKALYAR KO'PAYTMA.
    // Darslik: Geometriya 9, 31-dars (90-91-bet).
    //
    // BU 8-SINFNING 55-DARSI EMAS, GARCHI MAVZU NOMI O'XSHASH BO'LSA
    // HAM. 8-sinfda skalyar ko'paytma KOORDINATALAR orqali kiritilgan:
    // x₁x₂ + y₁y₂, natija son. U yerda formula ishlaydi, lekin nega
    // ishlashi va nimani bildirishi ochilmagan. Bugungi dars ikkinchi
    // tomonini beradi: ta'rif BURCHAK orqali, ishoraning ma'nosi,
    // perpendikulyarlik alomati va fizik ma'no (kuchning ishi).
    //
    // KOORDINATALI FORMULA BUGUN CHIQARILMAYDI. Darslik uni kosinuslar
    // teoremasi bilan isbotlaydi, kosinuslar teoremasi esa 48-darsda.
    // Shuning uchun isbot 48-darsga transfer sifatida qoldirildi va
    // buni yakun ekranining o'zi aytadi.
    //
    // XUK shu bo'shliqni ko'rsatadi: a(−5; 6) va b(6; 5) uchun 8-sinf
    // formulasi nol beradi. Nol nimani anglatishini esa 8-sinf aytmagan.
    //
    // TUZOQ (12-ekran): sonlardagi qoidani vektorlarga ko'chirish.
    // Sonlarda ko'paytma nol bo'lsa, ko'paytuvchilardan biri nol.
    // Vektorlarda uchinchi ko'paytuvchi bor — kosinus, va aynan u
    // nolga aylanadi, ikkala vektor esa joyida qoladi.
    //
    // TRANSFER — 31.3: romb, koordinatalarsiz. Tomoni va kichik
    // diagonali 4 ga teng, demak ABD teng tomonli va A burchagi 60°,
    // AB · AD = 8. Ikkinchi qadamda diagonallar perpendikulyar
    // bo'lgani uchun OC · OD darhol nolga aylanadi.
    //
    // CHIZMA: yangi `AngleFig` (7J) — asbob emas, chizma: bitta
    // nuqtadan chiqqan ikkita vektor, ixtiyoriy o'qlar va burchak yoyi.
    slug: 'dars43-vektorlar-skalyar-kopaytma',
    title: "Dars 43. Ikki vektor orasidagi burchak va skalyar ko'paytma",
    desc: "8-sinfda o'rganilgan formula a(−5; 6) va b(6; 5) uchun nol beradi, lekin nol nimani bildirishi aytilmagan edi. Bugun ta'rif burchak orqali beriladi: uzunliklar ko'paytmasi karra burchak kosinusi. Shundan ishoraning ma'nosi chiqadi — o'tkir burchakda musbat, o'tmasda manfiy, to'g'ri burchakda nol — va perpendikulyarlik alomati. Fizikada bu kuchning ishi: sumkani ko'tarib yurganda ish nolga teng. Tuzoq sonlardagi qoidani vektorlarga ko'chirishga qurilgan. Koordinatali formulaning isboti 48-darsga, kosinuslar teoremasidan keyinga qoldirilgan. Geometriya 9, 31-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars43.jsx')),
  },
  {
    // Dars 44. AYLANA UZUNLIGI.
    // Darslik: Geometriya 9, 42-dars (116-117-bet).
    //
    // DARS 41-DARSGA TAYANADI VA SHU BILAN π NI TAJRIBADAN EMAS,
    // O'XSHASHLIKDAN CHIQARADI. 41-darsda ko'rsatilgandi: barcha
    // aylanalar o'zaro o'xshash, chunki aylanani bitta son belgilaydi.
    // O'xshashlikda mos uzunliklar bitta k ga ko'payadi, demak uzunlik
    // ham, diametr ham birdek ortadi va ularning nisbati o'zgarmaydi.
    // Aynan shu nisbat π. Darslikning ichki ko'pburchakli isboti
    // 3-ekranda beriladi: P = n · 2R · sin(180°/n) da R faqat
    // ko'paytuvchi, qolgani esa n ga bog'liq.
    //
    // XUK darslikning tajribasini takrorlaydi: diametri 8 bo'lgan shisha
    // va diametri 60 bo'lgan bochka, ipning uzunliklari 25,1 va 188,5.
    // Sonlar butunlay boshqa, nisbat esa ikkalasida 3,14.
    //
    // TUZOQ (12-ekran): formulaga radius o'rniga diametr qo'yish.
    // Javob aynan ikki barobar katta chiqadi, va uni tekshirishning
    // oson yo'li aytiladi: uzunlik diametrdan taxminan uch barobar
    // katta bo'lishi kerak, olti barobar emas.
    //
    // TRANSFER: 42.3 dan Yer radiusi (C = 40 000 km → R ≈ 6370 km),
    // keyin mashhur arqon masalasi. Ekvator arqoniga 6,28 metr
    // qo'shilsa, arqon bir metrga ko'tariladi — javob Yerning
    // radiusiga bog'liq emas, chunki ΔC = 2π · ΔR da R yo'q. Bu
    // 6-ekrandagi «qo'shish va ko'paytirish boshqa narsa» degan
    // farqning eng kuchli tatbig'i.
    //
    // CHIZMA: `PiStrip` DARS FAYLINING O'ZIDA, umumiy qatlamda emas.
    // U faqat shu darsning bitta g'oyasini ko'rsatadi — diametr aylana
    // uzunligiga uch marta va yana biroz joylashishini. Boshqa darsda
    // ishlatilmaydi, shuning uchun umumiy qatlam shishirilmadi.
    // Uslublar sinfning mavjud g9-cf- klasslaridan olindi.
    slug: 'dars44-aylana-uzunligi',
    title: 'Dars 44. Aylana uzunligi',
    desc: "Diametri 8 bo'lgan shisha va diametri 60 bo'lgan bochka ip bilan o'ralganda uzunliklar butunlay boshqa chiqadi, nisbat esa ikkalasida bir xil. Sabab 41-darsda: barcha aylanalar o'xshash, demak uzunlik ham, diametr ham bitta koeffitsientga ko'payadi va nisbat o'zgarmaydi. Shu nisbat π, formulasi C = 2πR. Radiusni ko'paytirish uzunlikni ko'paytiradi, radiusga son qo'shish esa unga 2π karra shu sonni qo'shadi — bu ikkisi bir xil emas. Tuzoq radius o'rniga diametrni qo'yishga qurilgan. Oxirida ekvator arqoni: 6,28 metr qo'shilsa, arqon bir metrga ko'tariladi va bu Yerning kattaligiga bog'liq emas. Geometriya 9, 42-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars44.jsx')),
  },
  {
    // Dars 45. TO'G'RI BURCHAKLI UCHBURCHAKDAGI PROPORSIONAL KESMALAR.
    // Darslik: Geometriya 9, 50-dars (134-135-bet).
    //
    // 42-DARSDA BERILGAN VA'DA SHU YERDA BAJARILADI. U yerda diametrga
    // perpendikulyar vatarning yarmi bo'laklar orasidagi o'rta
    // geometrik bo'lib chiqqandi va «45-darsda balandlik sifatida
    // qaytadi» deb yozilgandi. Transfer aynan shu qarzni uzadi:
    // bo'laklari 9 va 16 bo'lgan diametr ham, proyeksiyalari 9 va 16
    // bo'lgan gipotenuza ham 12 ni beradi — chunki yarim aylanaga
    // ichki chizilgan uchburchak to'g'ri burchakli (37-dars), diametr
    // uning gipotenuzasi, yarim vatar esa balandligi. Ikkita dars
    // bitta chizmaga tayangan ekan.
    //
    // XUK: bitta kesma uchta uchburchak hosil qiladi va uchalasi ham
    // bir xil shaklda. Ko'z bilan buni ilg'ash qiyin — ular har xil
    // tomonga burilgan — shuning uchun savol burchaklar orqali beriladi.
    //
    // PIFAGOR TEOREMASI BU YERDA NATIJA, TAYANCH EMAS. 7-ekran ikkita
    // katet tengligini qo'shadi: AC² + BC² = AB · (AD + BD) = AB².
    // Darslikning aytishicha, aynan shu Pifagorning o'zi yozib
    // qoldirgan isboti. Qoida ekranidagi savol ham shu haqda:
    // tengliklar Pifagordan emas, o'xshashlikdan chiqdi.
    //
    // TUZOQ (12-ekran): balandlikni proyeksiyalarning O'RTA ARIFMETIGI
    // deb olish. 9 va 16 uchun bu 12,5, to'g'ri javob esa 12. Farq
    // atigi yarim birlik, ya'ni xato «deyarli to'g'ri» ko'rinadi —
    // shuning uchun razbor uni ma'no bilan yiqitadi: proporsiyada
    // CD ikki marta qatnashadi, yig'indi esa umuman paydo bo'lmaydi.
    //
    // CHIZMA: yangi `TriFig` (7K) UMUMIY QATLAMDA — 44-darsning
    // `PiStrip` idan farqi shunda: uchburchak 45-49-darslarning
    // hammasida kerak bo'ladi, ya'ni bu chizma bir martalik emas.
    slug: 'dars45-proporsional-kesmalar',
    title: "Dars 45. To'g'ri burchakli uchburchakdagi proporsional kesmalar",
    desc: "To'g'ri burchakdan tushirilgan bitta balandlik chizmani uchta uchburchakka ajratadi va uchalasi ham bir xil shaklda. Shundan uchta tenglik chiqadi: balandlikning kvadrati proyeksiyalar ko'paytmasiga teng, katetning kvadrati esa gipotenuza bilan o'z proyeksiyasi ko'paytmasiga. Ikkinchisini ikkala katet uchun qo'shsak, Pifagor teoremasi o'zidan o'zi kelib chiqadi — darslikka ko'ra bu Pifagorning o'zi qoldirgan isboti. Tuzoq o'rta arifmetikka qurilgan: 9 va 16 uchun u 12,5 beradi, to'g'ri javob 12. Oxirida 42-dars bilan uchrashuv: vatar qoidasi va balandlik qoidasi bitta chizmaning ikkita nomi ekan. Geometriya 9, 50-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars45.jsx')),
  },
  {
    // Dars 46. O'TKIR BURCHAKNING SINUSI, KOSINUSI VA TANGENSI.
    // Darslik: Geometriya 9, 25-dars (76-77-bet).
    //
    // 33-DARS BILAN CHEGARA ANIQ. Algebra bloki (33, 34-darslar)
    // sinusni KOORDINATA orqali bergan: birlik aylana, nuqtaning
    // ordinatasi. Bugungi dars teskari yo'nalishda ishlaydi —
    // koordinatadan TOMONLAR NISBATIGA qaytadi va 47-49-darslarga
    // (sinuslar va kosinuslar teoremalari) yo'l ochadi. 5-ekran ikkala
    // ta'rifni ochiq bog'laydi: birlik aylanada gipotenuza birga teng,
    // shuning uchun nisbat koordinataning o'ziga aylanadi.
    //
    // DARSNING O'ZAGI — NEGA SINUS JADVALI UMUMAN MAVJUD. O'tkir
    // burchagi α bo'lgan BARCHA to'g'ri burchakli uchburchaklar o'zaro
    // o'xshash (40-darsning birinchi alomati), demak katetning
    // gipotenuzaga nisbati uchburchakning kattaligiga emas, faqat α ga
    // bog'liq. Xuk shu yerdan boshlanadi: birlik aylanada sin30° = 0,5,
    // gipotenuzasi 8 bo'lgan uchburchakda esa qarshi katet 4 — o'sha
    // nisbat, sakkiz marta cho'zilgan.
    //
    // TUZOQ (12-ekran): burchak ikki marta ortsa sinus ham ikki marta
    // ortadi degan fikr. sin30° = 0,5, demak sin60° bir bo'lishi kerak
    // edi — lekin sinus birdan katta bo'lolmaydi (katet gipotenuzadan
    // uzun emas), u esa 0,866. Xato hisobda emas, proporsionallikni
    // o'rinsiz ko'chirishda.
    //
    // TRANSFER: 25.6 — o'tmas burchakli uchburchakda balandlik
    // (∠A = 150°, AC = 7 → h = 3,5), keyin amaliy masala: soyasi 12 m,
    // quyosh burchagi 30° bo'lgan daraxtning balandligi. Ikkalasi ham
    // bitta g'oyani ko'rsatadi — o'lchab bo'lmaydigan uzunlik burchak
    // orqali hisoblanadi, va «trigonometriya» so'zining yunoncha
    // ma'nosi ham shu.
    //
    // CHIZMA: `TriFig` (7K) 45-darsdan, unga `angles` qo'shildi —
    // burchakning yoyi va nomi. Yangi chizma yasalmadi.
    slug: 'dars46-sinus-kosinus-tangens',
    title: "Dars 46. O'tkir burchakning sinusi, kosinusi va tangensi",
    desc: "33-darsda sinus birlik aylanadagi nuqtaning ordinatasi edi. Gipotenuzasi 8 bo'lgan uchburchakda esa u qanday ishlaydi. Javob o'xshashlikda: o'tkir burchagi bir xil bo'lgan barcha to'g'ri burchakli uchburchaklar o'xshash, shuning uchun tomonlarning nisbati faqat burchakka bog'liq — aynan shuning uchun sinuslar jadvali umuman mavjud. Uchta nisbat ajratiladi, birlik aylana bilan bog'lanish ko'rsatiladi, keltirish formulalari chizmadan o'qiladi. Tuzoq: burchak ikki barobar ortsa sinus ham ikki barobar ortadi degan fikr. Oxirida o'lchab bo'lmaydigan balandliklar: o'tmas burchakli uchburchak va soyasi bo'yicha daraxt. Geometriya 9, 25-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars46.jsx')),
  },
  {
    // Dars 47. SINUSLAR TEOREMASI.
    // Darslik: Geometriya 9, 28-dars (84-85-bet).
    //
    // ISBOT DARSLIKNING IKKINCHI YO'LI BILAN, VA BU ATAYLAB QILINDI.
    // Darslik teoremani YUZ orqali isbotlaydi (S = ½ab·sinC), yuz
    // formulasi esa 27-darsda — bizning ketma-ketligimizda u hali
    // oldinda (50-dars). Ikkinchi yo'l — tashqi chizilgan aylana —
    // bugun to'liq ochiq: 37-darsdan bitta yoyga tiralgan burchaklar
    // tengligi, 38-darsdan diametrga tiralgan burchakning to'g'riligi.
    // Shu yo'l darhol KUCHLIROQ natija beradi: nisbat 2R ga teng,
    // ya'ni darslikda alohida masala bo'lgan xulosa isbotning o'ziga
    // kirib keladi.
    //
    // XUK 46-DARSNING CHEGARASINI KO'RSATADI: kecha sinus katetning
    // gipotenuzaga nisbati edi, ya'ni faqat to'g'ri burchakli
    // uchburchakda ishlardi. Darslikning 1-masalasida to'g'ri burchak
    // yo'q (AB = 14, ∠A = 30°, ∠C = 65°), eski qurol ishlamaydi.
    //
    // TUZOQ (12-ekran): tomonni o'ziga YONDOSH burchak bilan juftlash.
    // AB ga qarshi C turadi, A emas. Xato javobni 7,78 o'rniga 25,4
    // qiladi — topilgan tomon berilganidan uzun chiqadi, garchi u
    // kichikroq burchakka qarshi tursa ham. Razbor hisobga emas, shu
    // tekshiruvga o'rgatadi: katta burchakka qarshi katta tomon.
    //
    // TRANSFER — 28.5: tomon tashqi aylananing radiusiga teng bo'lsa,
    // sin A = 1/2 chiqadi va javob YAGONA emas: 30° ham, 150° ham
    // to'g'ri (46-darsdan sin(180° − α) = sin α). Darslik bu yerda
    // ikkala holni ko'rishni alohida so'raydi. Shu kamchilik 48-darsga
    // ko'prik bo'ladi: kosinus o'tkir va o'tmas burchakni ishorasi
    // bilan ajratadi, sinus esa ajratmaydi.
    //
    // CHIZMA: `TriFig` (7K) va `CircleFig` (7H) — ikkalasi ham tayyor,
    // yangisi yasalmadi.
    slug: 'dars47-sinuslar-teoremasi',
    title: 'Dars 47. Sinuslar teoremasi',
    desc: "Uchburchakda to'g'ri burchak yo'q, lekin ikkita burchak va bitta tomon ma'lum — 46-darsning quroli bu yerda ishlamaydi. Uchburchakka tashqi aylana chiziladi va bitta uchidan diametr o'tkaziladi: diametrga tiralgan burchak to'g'ri (38-dars), bitta yoyga tiralgan burchaklar esa teng (37-dars). Shundan a/sin A = 2R chiqadi va u uchala tomon uchun bir xil. Tuzoq tomonni yondosh burchak bilan juftlashga qurilgan. Oxirida: sinus bo'yicha burchak qidirilganda javob ikkita bo'ladi, va aynan shu 48-darsda kosinuslar teoremasini talab qiladi. Geometriya 9, 28-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars47.jsx')),
  },
  {
    // Dars 48. KOSINUSLAR TEOREMASI.
    // Darslik: Geometriya 9, 29-dars (86-87-bet).
    //
    // 43-DARSDA BERILGAN QARZ SHU YERDA UZILADI. U yerda skalyar
    // ko'paytma burchak orqali berilgan va koordinatali formulaning
    // isboti ATAYLAB 48-darsga qoldirilgandi, chunki darslik uni
    // kosinuslar teoremasi bilan isbotlaydi. Transfer aynan shu
    // isbotni beradi: |a|² + |b|² − AB² ni yozib chiqsak, yarmi
    // a₁b₁ + a₂b₂ bo'lib chiqadi. Ya'ni 8-sinfning koordinatali
    // formulasi va 9-sinfning burchakli ta'rifi bir xil son ekan.
    //
    // XUK 47-DARSNING CHEGARASINI KO'RSATADI. Sinuslar teoremasi
    // TOMON va uning QARSHISIDAGI BURCHAK juftligini talab qiladi.
    // Darslikning 1-masalasida ikkita tomon va ular ORASIDAGI burchak
    // berilgan (AB = 6, AC = 7, ∠A = 60°) — juftlik yo'q, kechagi
    // teorema ishlamaydi.
    //
    // 2-EKRAN JAVOBNI OLDINDAN BAHOLATADI: Pifagor bo'yicha a² = 85
    // chiqardi, lekin burchak 90° dan 60° ga kamaygan, ya'ni B va C
    // uchlari yaqinlashgan — demak haqiqiy a² kichikroq. Formula
    // chiqarilgunga qadar bola javobning yo'nalishini biladi.
    //
    // TUZOQ (12-ekran): o'tmas burchakda kosinusning MANFIY ishorasini
    // unutish. 120° da cos = −0,5, ya'ni uchinchi qo'shiluvchi
    // qo'shiladi. Ishorani unutgan bola √39 ni oladi, to'g'ri javob
    // √109. Tekshiruv: o'tmas burchakka eng uzun tomon qarshi yotadi,
    // √39 esa 7 dan ham qisqa.
    //
    // CHIZMA: `TriFig` (7K), yangisi yasalmadi.
    slug: 'dars48-kosinuslar-teoremasi',
    title: 'Dars 48. Kosinuslar teoremasi',
    desc: "Ikkita tomon va ular orasidagi burchak berilgan — kechagi sinuslar teoremasi bunday ma'lumot bilan ishlamaydi, chunki unga tomon va uning qarshisidagi burchak juftligi kerak. Balandlik tushirilib, Pifagor teoremasi ikki marta qo'llaniladi va a² = b² + c² − 2bc·cos A chiqadi. Bu Pifagorning umumlashmasi: to'g'ri burchakda kosinus nolga aylanadi va eski formula qaytadi. Teskari yo'nalishda formula uchta tomondan burchakni beradi, kosinusning ishorasi esa burchakning turini. Tuzoq o'tmas burchakdagi manfiy ishorani unutishga qurilgan. Oxirida 43-darsdagi qarz uziladi: skalyar ko'paytmaning koordinatali formulasi shu teoremadan chiqariladi. Geometriya 9, 29-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars48.jsx')),
  },
  {
    // Dars 49. UCHBURCHAKLARNI YECHISH.
    // Darslik: Geometriya 9, 32-dars (94-95-bet).
    //
    // DARSNING O'ZAGI — TARTIB, FORMULA EMAS. Ikkala teorema ham 47 va
    // 48-darslarda chiqarilgan, bugun yangisi yo'q. Yangilik shundaki,
    // ularni QAYSI KETMA-KETLIKDA ishlatish kerak — va bu tartib
    // 47-darsda topilgan kamchilikdan kelib chiqadi: sinus o'tkir va
    // o'tmas burchakni ajratmaydi. Shuning uchun uchta tomon berilganda
    // ENG KATTA tomondan boshlanadi: faqat unga qarshi burchak o'tmas
    // bo'lishi mumkin, kosinusning ishorasi esa buni darhol aytadi.
    // O'tmas burchak topilgach, qolgan ikkitasi albatta o'tkir va
    // sinus xavfsiz bo'ladi. Qoida ekranidagi savol ham shu haqda:
    // bugun yangi formula emas, tartib o'rganildi.
    //
    // XUK: uchta tomon (10, 6, 13), birorta burchak yo'q — sinuslar
    // teoremasi umuman ishga tushmaydi, chunki har bir kasrda ikkita
    // noma'lum qoladi. Qurolni ma'lumot tanlaydi.
    //
    // TUZOQ (12-ekran): kichik tomondan boshlash. Kamron B ni to'g'ri
    // topgan (26°), keyin sinuslar teoremasi bilan C ni izlagan va
    // kalkulyatordan 74° olgan, aslida 106°. Xato hisobda emas: sinus
    // ikkala javobni ham beradi. Tekshiruv: eng katta tomonga eng
    // katta burchak qarshi turishi kerak, 74° esa A dan ham kichik.
    //
    // TRANSFER: yerdagi o'lchov. Daryoning narigi qirg'og'idagi
    // daraxtgacha bo'lgan masofa ruletka bilan o'lchanmaydi, lekin
    // yuz metrli bazis va ikkita burchak yetadi (89,7 m). Bu
    // darslikning 1-masalasining aynan o'zi va «trigonometriya»
    // so'zining yunoncha ma'nosini yopadi.
    //
    // CHIZMA: `TriFig` (7K), yangisi yasalmadi.
    slug: 'dars49-uchburchaklarni-yechish',
    title: 'Dars 49. Uchburchaklarni yechish',
    desc: "Uchta tomon berilgan, birorta burchak yo'q — sinuslar teoremasi umuman ishga tushmaydi. Dars uchta holatni ajratadi: tomon va unga yopishgan ikkita burchak, ikkita tomon va ular orasidagi burchak, uchta tomon. Yangi formula chiqmaydi, yangisi TARTIB: uchta tomon berilganda eng katta tomonning burchagidan boshlanadi, chunki faqat u o'tmas bo'lishi mumkin va kosinusning ishorasi buni darhol ko'rsatadi. Shundan keyin sinus xavfsiz ishlaydi. Tuzoq kichik tomondan boshlashga qurilgan: kalkulyator 74° beradi, aslida 106°. Oxirida daryo kengligini bazis va ikkita burchak bilan o'lchash. Geometriya 9, 32-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars49.jsx')),
  },
  {
    // Dars 50. UCHBURCHAK YUZINI BURCHAK SINUSI ORQALI HISOBLASH.
    // Darslik: Geometriya 9, 27-dars (82-83-bet).
    //
    // DARSLIKDA BU MAVZU SINUSLAR TEOREMASIDAN OLDIN TURADI va u
    // yerda teoremani isbotlash uchun ishlatiladi. Bizda 47-dars
    // isbotni tashqi aylana orqali olib borgan (sabab o'sha darsning
    // izohida: yuz formulasi hali yo'q edi), shuning uchun yuz
    // formulasi mustaqil mavzu bo'lib qoldi va endi to'g'ridan to'g'ri
    // 46-darsning sinusiga tayanadi. Hech narsa yo'qolmadi, faqat
    // tartib boshqacha.
    //
    // XUK: ikkita tomon va ular orasidagi burchak bor, balandlik yo'q.
    // Boshlang'ich sinfdan tanish «asosning yarmi karra balandlik»
    // ishga tushmaydi, chunki balandlik o'lchanmagan.
    //
    // TUZOQ (12-ekran): yarim ko'paytuvchini unutish. Ekran uni javob
    // bilan emas, BAHO bilan yiqitadi: sinus birdan katta bo'lmagani
    // uchun yuz hech qachon ½ab dan oshmaydi. Tomonlari 6 va 4 bo'lgan
    // uchburchakda chegara 12, Kamronning javobi esa aynan 12 — ya'ni
    // u burchakni to'g'ri deb hisoblagan bilan barobar.
    //
    // TRANSFER — 27.8: bissektrisaning uzunligini YUZ orqali topish.
    // S(ABC) = S(ABD) + S(ADC), uchala yuz ham sinus formulasi bilan
    // yoziladi va AD tenglamadan chiqadi (4,8√3). Bu yerda yuz javob
    // emas, VOSITA: uzunlikni topish uchun ishlatiladi.
    //
    // CHIZMA: `TriFig` (7K), yangisi yasalmadi.
    slug: 'dars50-uchburchak-yuzi-sinus',
    title: "Dars 50. Uchburchak yuzini burchak sinusi orqali hisoblash",
    desc: "Ikkita tomon va ular orasidagi burchak ma'lum, balandlik esa yo'q — «asosning yarmi karra balandlik» formulasi ishga tushmaydi. Lekin balandlikning o'zi tomon karra sinusga teng, va shundan S = ½·ab·sin C chiqadi. Formulaning uchta ko'rinishi bor, u teskari yo'nalishda tomonni ham beradi, parallelogrammda yarim yo'qoladi, ixtiyoriy to'rtburchakda esa diagonallar orqali ishlaydi. Tuzoq yarim ko'paytuvchini unutishga qurilgan va baho bilan yiqitiladi: sinus birdan katta emas, demak yuz ½ab dan oshmaydi. Oxirida bissektrisaning uzunligi yuz orqali topiladi. Geometriya 9, 27-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars50.jsx')),
  },
  {
    // Dars 51. MASALALAR YECHISH: IKKALA TEOREMA BIRGA.
    // Darslik: Geometriya 9, 33-dars (96-97-bet).
    //
    // METODISTGA DIQQAT. Rejada bu dars «DTM masalalari (1-qism)» deb
    // nomlangan, ETALON_9SINF.md esa Б7 blokini «profil DTM
    // mutaxassisi bilan kelishuvni kutmoqda» deb belgilaydi — alohida
    // geyt. Shuning uchun 10 va 11-sinfdagi kabi DTM REJIMI (ikkinchi
    // anatomiya, soat, bo'shliqlar xaritasi) BU YERDA YASALMADI: uni
    // yasash grade8/screens.jsx umumiy qatlamiga tegadi, ya'ni
    // 9-sinfning ellik va 8-sinfning ellik besh darsiga. Dars
    // darslikning 33-darsi bo'yicha «masalalar yechish» sifatida
    // yig'ildi. DTM rejimi kerak bo'lsa, u alohida qaror bilan va
    // umumiy qatlamdan boshlab kiritiladi.
    //
    // DARSNING O'ZAGI — KO'P QADAMLI MASALA. 46-50-darslarda har bir
    // qurol alohida berilgandi, bu yerda bitta masalada ikkitasi ham
    // kerak bo'ladi va yechim uch qadamgacha cho'ziladi.
    //
    // XUK — 33.4: tomonlari 7 va 11, medianasi 6. Na sinuslar, na
    // kosinuslar teoremasi to'g'ridan to'g'ri ishlamaydi, chunki
    // medianani ikkalasi ham bilmaydi. Yechim chizmani TO'LDIRISHDAN
    // boshlanadi: mediana ikki barobar uzaytirilsa, uchburchak
    // parallelogrammga to'ladi va mediana diagonalga aylanadi.
    //
    // TUZOQ (12-ekran): oxirgi qadamni tashlab ketish. Kamron yuzni
    // to'g'ri topgan va uni javob deb yozgan, so'ralgan narsa esa
    // balandlik edi. Razbor tekshiruvni beradi: yuz kvadrat birlikda,
    // balandlik oddiy uzunlikda o'lchanadi.
    //
    // TRANSFER — darslikning 3-masalasi: qoidabuzar haydovchi va DAN
    // xodimi. Sinuslar teoremasi ikki marta, keyin vaqt hisobi:
    // 42 soniya va 46 soniya, javob «yo'q».
    //
    // CHIZMA: `TriFig` (7K), yangisi yasalmadi.
    slug: 'dars51-dtm-masalalari',
    title: 'Dars 51. Masalalar yechish: ikkala teorema birga',
    desc: "Uchburchakning ikkita tomoni va uchinchisiga tushirilgan medianasi berilgan — na sinuslar, na kosinuslar teoremasi to'g'ridan to'g'ri ishlamaydi. Yechim chizmani to'ldirishdan boshlanadi: mediana ikki barobar uzaytirilsa, parallelogramm hosil bo'ladi va d₁² + d₂² = 2(a² + b²) tengligi masalani yopadi. Keyin uch qadamli masala: kosinuslar teoremasi tomonni, yuz formulasi balandlikni beradi. Tuzoq oxirgi qadamni tashlab ketishga qurilgan: hisob to'g'ri, javob esa boshqa savolniki. Oxirida darslikning amaliy masalasi — qoidabuzar haydovchi chorrahaga yetib qoladimi. Geometriya 9, 33-dars. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars51.jsx')),
  },
  {
    // Dars 52. TAKRORLASH. KURSNING OXIRGI DARSI, 52 dan 52.
    // Darslik: Geometriya 9, «Bilimingizni sinab ko'ring» — 100-bet
    // (II bob) va 142-bet (IV bob).
    //
    // FORMATI BOSHQACHA, CHUNKI BU OXIRGI DARS. Yangi mavzu yo'q,
    // hamma ekran darslikning NAZORAT TESTLARIGA qurilgan.
    // Testlarning aksariyati «NOTO'G'RI tasdiqni toping» ko'rinishida
    // — bu format hisobni emas, tushunishni tekshiradi: uchta to'g'ri
    // javob orasidan bittasini ajratish uchun to'rttasini ham bilish
    // kerak. Qoida ekranidagi savol ham shu haqda.
    //
    // XUK darhol shu formatni beradi va 50-darsning eng nozik joyiga
    // tegadi: S = ½ab·sin α noto'g'ri, chunki yuz formulasida burchak
    // aynan tomonlar ORASIDA turishi shart, ya'ni γ.
    //
    // TUZOQ (12-ekran): «katta tomon katta burchakka qarshi» qoidasini
    // teskari o'qish. Kamron 22 · sin137° : sin15° deb yozgan, ya'ni
    // javob 22 dan uzun chiqadi — bu esa eng katta tomondan uzunroq
    // tomon degani. Razbor hisobni emas, shu bir qarashli tekshiruvni
    // beradi.
    //
    // TRANSFER — YILNI YOPADIGAN MASALA: kosinuslar teoremasi KVADRAT
    // TENGLAMA beradi (x² − 3x − 40 = 0). Б7 blokining geometriyasi,
    // Б1 blokining algebrasi va 4-darsdagi «ildizni ma'noga qarab
    // tekshirish» odati bitta masalada uchrashadi: ikkinchi ildiz −5
    // va u tomon bo'lolmaydi. Yakun ekrani shu bilan yilni yopadi.
    //
    // CHIZMA: `TriFig` (7K), yangisi yasalmadi.
    slug: 'dars52-takrorlash',
    title: 'Dars 52. Takrorlash',
    desc: "Kursning oxirgi darsi. Yangi mavzu yo'q: hamma ekran darslikning nazorat testlariga qurilgan va ularning aksariyati «noto'g'ri tasdiqni toping» ko'rinishida — bunday savol hisobni emas, tushunishni tekshiradi. Yuz formulasidagi burchakning o'rni, keltirish formulalaridagi ishoralar, teorema tanlash, tomon va burchakning tartibi, balandlik va vatarlar haqidagi tasdiqlar qayta ko'riladi. Tuzoq kichik tomonni katta burchakka qarshi qo'yishga qurilgan va bir qarashda yiqitiladi. Oxirgi masala yilni yopadi: kosinuslar teoremasi kvadrat tenglama beradi, manfiy ildiz esa tomon bo'lolmaydi. Geometriya 9, 100 va 142-betlar. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade9/Dars52.jsx')),
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
  {
    // 2026-08-28. Skelet: src/books/grade9/DARS11_17_AMALIYOT_SKELET.md.
    // Raskladka skriptdan: scripts/grade9-practice-layout.mjs (11-dars).
    slug: 'dars11-amaliyot',
    title: "Dars 11 amaliyoti — o'rniga qo'yish usuli (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: ifodalangan igrek jadvalda ikki tomonga, ifoda qaysi tenglamaga qo'yiladi, o'z tenglamasiga qaytarish nega hech nima bermaydi, kvadrat tenglamaning kichik ildizi o'qda, ikki kasrni yig'indi-ko'paytmaga birlashtirish, ikkala yechimni tekislikka qo'yish, kvadrat manfiy chiqqan holatni guruhlash, ishorasi tushib qolgan xato qator, qoidadagi so'zlar, usulning qadamlari tartibi. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars11/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-amaliyot',
    title: "Dars 12 amaliyoti — qo'shish usuli (10 topshiriq)",
    desc: "10 topshiriq, 10 xil mexanika: qaysi had qo'shganda yo'qoladi, yig'indi shartining jadvali, yo'qotishning ikkita sharti, qo'shishdan keyin igrekni ham topish, iksda to'xtab qolmaslik, iks kvadratdan ikkita ildiz, ikkinchi tenglamalarni yo'qolish turi bo'yicha guruhlash, qoidadagi so'zlar, koeffitsienti tushib qolgan xato qator, usul qadamlarining tartibi. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars12/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot',
    title: 'Dars 13 amaliyoti — masalalar (10 topshiriq)',
    desc: "10 topshiriq, 10 xil mexanika: ishni nimadan boshlash, bitta shart sonni aniqlamasligi, «marta katta» va «ga katta» farqi, natural sonlar sharti, o'nlar bilan birlar raqamining o'rni, iborani amalga o'tkazish, nolga teng ildizni rad etish, masala javobini son tilida yozish, shartdagi ayirmani son deb olgan xato qator, qoidadagi so'zlar. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars13/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot',
    title: 'Dars 14 amaliyoti — ikkinchi darajali tengsizliklar (10 topshiriq)',
    desc: "10 topshiriq, 10 xil mexanika: takroriy ildiz jadvalda, nol diskriminantda parabola o'q bilan qanday joylashishi, manfiy diskriminant haqida uchta hukm, yagona nuqtali javob o'qda, urinish nuqtasini grafikda belgilash, bitta ildizni yozish, diskriminant ishorasi bo'yicha guruhlash, «ildiz yo'q» dan «yechim yo'q» chiqargan xato qator, takroriy ildizli tengsizlikning qadamlari, qoidadagi iboralar. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars14/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-amaliyot',
    title: 'Dars 15 amaliyoti — oraliqlar usuli (10 topshiriq)',
    desc: "10 topshiriq, 10 xil mexanika: takroriy ko'paytuvchi haqida uchta hukm, nega ikki marta almashish bekor bo'lishi, uchta ildizning ishoralar ketma-ketligi jadvalda, grafik Ox ni kesgan barcha nuqtalar, umumiy ko'paytuvchini chiqarish (nol ildiz tushib qolmasin), ko'paytuvchilarni ishora xossasi bo'yicha guruhlash, javobning chegaralangan qismi o'qda, qoidadagi so'zlar, usulning qadamlari, takroriy ildizda ishora almashadi degan xato qator. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars15/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot',
    title: 'Dars 16 amaliyoti — tengsizliklar sistemasi (10 topshiriq)',
    desc: "10 topshiriq, 10 xil mexanika: sistemaning yechimi ta'rifi, har xil turdagi ikki chegara, bitta tengsizlikning chegarasi jadvalda, sonlarni «ikkalasi / faqat birinchisi / faqat ikkinchisi» bo'yicha guruhlash, oraliqdagi butun sonlar, aralash chegarali javob o'qda, ikki grafikning Ox bilan kesishishlari, yechish qadamlarining tartibi, qoidadagi iboralar, kesishma o'rniga birlashma yozgan xato qator. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars16/Dars16Practice.jsx')),
  },
  {
    slug: 'dars17-amaliyot',
    title: 'Dars 17 amaliyoti — kasr-ratsional tengsizliklar (10 topshiriq)',
    desc: "10 topshiriq, 10 xil mexanika: kasrning ikki xil maxsus nuqtasi jadvalda, surat va maxraj nollari haqida uchta hukm, nega maxrajga ko'paytirib bo'lmasligi, barcha nol nuqtalarni yozish, aralash chegarali javob o'qda (biri yopiq, biri ochiq), grafik Ox ni kesgan nuqta, sonlarni surat yoki maxraj noli bo'yicha guruhlash, qisqartirishda teshik nuqtani yo'qotgan xato qator, qoidadagi iboralar, yechish qadamlarining tartibi. UZ/RU/EN, ovozsiz.",
    Component: lazy(() => import('../components/grade9/practice/dars17/Dars17Practice.jsx')),
  },
]
