import { lazy } from 'react'

// 7-sinf darslari. Reja: src/books/grade7/DARSLAR_REJASI_7SINF.md (48 dars).
// Kirish nuqtasi: START_GRADE7.md (ildizda). Sinf ETALONI -- 1-dars.
//
// 5-dars 2026-08-15 da ro'yxatdan OLIB TASHLANDI (metodist qarori): u eski
// yondashuvda yig'ilgan va yangi etalonga tushmaydi, shuning uchun NOLDAN
// qayta yoziladi. Eski fayllar o'chirilmadi -- ular
// `_archive/unused-code/grade7-dars05/` da yotibdi va u yerdan
// IMPORT QILINMAYDI (CLAUDE.md §6.4). Kerak bo'lsa, ular ongli ravishda
// loyihaga qaytariladi, arxivdan ulanmaydi.
export const grade7Nazariy = [
  {
    // Sinf ETALONI. Yangi darslar shu naqsh bo'yicha yig'iladi:
    // qoidani o'quvchi YIG'ADI, qo'l YOZUVNING ICHIDA ishlaydi, qoida esa
    // xuk savoliga javob beradi. Holat: src/books/grade7/DARS01_HOLAT.md
    slug: 'dars01-sonli-ifodalar',
    title: 'Dars 1. Sonli ifodalar',
    desc: "Amallar tartibi va ifodaning qiymati. Ikki kalkulyator, bitta yozuv, ikki xil son. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars01.jsx')),
  },
  {
    // Raskadrovka va kontent: src/books/grade7/DARS02_SKELET.md
    // Metodist qarorlari 2026-08-15: ishchi so'z «o'zgaruvchi», darslikka
    // havola yo'q, xuk sahnasi o'ziniki (RideScene).
    slug: 'dars02-ozgaruvchili-ifodalar',
    title: "Dars 2. O'zgaruvchili ifodalar",
    desc: "O'zgaruvchi — son uchun joy. Bitta yozuv, ko'p qiymat. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars02.jsx')),
  },
  {
    // Uchinchi marta bir xil manzara: bitta yozuv, ikki tartib -- lekin endi
    // BITTA son, faqat bir yo'l qisqa. Bu 1-darsni ham tushuntiradi.
    slug: 'dars03-amallar-xossalari',
    title: 'Dars 3. Arifmetik amallarning xossalari',
    desc: "Qiymat o'zgarmaydi, mehnat o'zgaradi. O'rin almashtirish, guruhlash, taqsimlash. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars03.jsx')),
  },
  {
    // KECHIKKAN DARS. Metodist 2026-08-16 da to'xtatgan edi: darslikda
    // «ayniyat» so'zi yo'q. 2026-08-21 da qilish kerak dedi. Dars darslik
    // BERADIGAN narsaga qurilgan -- amallarning xossalari va soddalashtirish;
    // atama esa faqat NOM.
    slug: 'dars04-ayniyat',
    title: "Dars 4. Ayniyat va qiymatni saqlaydigan o'zgartirishlar",
    desc: "Bitta son isbot emas: u faqat rad etadi. Isbot esa xossa bilan qayta yozish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars04.jsx')),
  },
  {
    // NOLDAN qayta yozildi (metodist qarori 2026-08-15): eski 5-dars eski
    // yondashuvda edi va loyihadan olib tashlangan.
    // §1.3: qavs oldidagi ISHORA -- bu darsda; qavs oldidagi KO'PAYTUVCHI --
    // 3-darsda. Ular qo'shib yuborilmaydi.
    slug: 'dars05-qavslarni-ochish',
    title: 'Dars 5. Qavslarni ochish qoidasi',
    desc: "Minus qavsni o'chirmaydi, u har bir ishorani ag'daradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars05.jsx')),
  },
  {
    // ATAMA: RU «подобные слагаемые», UZ `o'xshash hadlar` (etalon §3.3).
    // Ko'phad bu darsda hali yo'q, shuning uchun «член» emas, «слагаемое».
    slug: 'dars06-oxshash-hadlar',
    title: "Dars 6. O'xshash hadlarni ixchamlash",
    desc: "Koeffitsiyentlar qo'shiladi, harf umumiy qoladi. Taqsimot xossasi teskari tomonga. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars06.jsx')),
  },
  {
    // B2 BLOKINING BIRINCHI DARSI. 2-darsning Z7 tegini yopadi: u yerda
    // o'zgaruvchi istalgan sonni qabul qilardi, bu yerda tenglik TANLAYDI.
    slug: 'dars07-tenglama-ildizi',
    title: 'Dars 7. Tenglama va uning ildizi',
    desc: "Ifoda hamma sonni qabul qiladi, tenglama esa bittasini tanlaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars07.jsx')),
  },
  {
    // BLOKNING ASBOBI shu darsda tug'iladi: `EquationBalance` -- tarozi,
    // unda «faqat bitta tomonga» degan tugma YO'Q. 7-darsda ildizni TANLAB
    // topgandik, bu yerda uni HISOBLAYMIZ.
    slug: 'dars08-chiziqli-tenglama',
    title: "Dars 8. Bir noma'lumli chiziqli tenglama",
    desc: "Amal ikkala tomonga birdan qo'llanadi. Uch holat: bitta ildiz, ildizi yo'q, cheksiz ko'p. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars08.jsx')),
  },
  {
    // AL-XORAZMIY USULI. Ko'chirish YANGI QOIDA EMAS: u 8-darsdagi
    // tarozining qisqa yozuvi. Asbob shu darsda kengaytirildi --
    // o'zgaruvchi endi ikkala tomonda ham tura oladi.
    slug: 'dars09-tenglamalarni-yechish',
    title: 'Dars 9. Chiziqli tenglamalarni yechish',
    desc: "Al-jabr va val-muqobala. Had ko'chadi -- ishora almashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars09.jsx')),
  },
  {
    // §10.2 YOPILDI. Darslikda modulli tenglamalar paragrafi yo'q, lekin
    // MODULNING TA'RIFI bor -- 6-bet: modul bu noldan uzoqlik. Butun dars
    // shu ta'rifdan chiqadi, tashqi manbadan emas.
    slug: 'dars10-modulli-tenglama',
    title: 'Dars 10. Modul qatnashgan chiziqli tenglama',
    desc: "Modul bu masofa. Bir xil masofada nuqta ikkita -- shuning uchun ildiz ham ikkita. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars10.jsx')),
  },
  {
    // Bu darsda tenglama YECHILMAYDI o'rganilmaydi -- u TUZILADI. Darslik
    // olti qadam beradi, va oxirgisi eng ko'p tashlab ketiladigan qadam:
    // savolga qaytish. Shuning uchun u alohida ekranda turadi.
    slug: 'dars11-masala-tenglama',
    title: 'Dars 11. Masalalarni tenglama yordamida yechish',
    desc: "Kattaliklar, harf, tenglama, savol. x topildi hali javob topildi degani emas. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars11.jsx')),
  },
  {
    // B2 BLOKINING OXIRGI DARSI. 11-darsdan farqi: u yerda ikkinchi kattalik
    // KO'PAYTIRISH bilan bog'langandi, bu yerda esa YIG'INDI ma'lum va
    // ikkinchisi ayirish bilan yoziladi. Ikkinchi harf kerak emas.
    slug: 'dars12-masala-tuzish',
    title: 'Dars 12. Tenglama tuzishga doir masalalar',
    desc: "Jami ma'lum bo'lsa, ikkinchisi 40 ayirish x. Aralashma va harakat. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars12.jsx')),
  },
  {
    // B3 BLOKINING BIRINCHI DARSI. Asbob: `FactorTape` -- muljitellar
    // lentasi. Daraja darslikda MULJITELLAR KO'PAYTMASI orqali ta'riflangan
    // (26-bet), lenta shu ta'rifni ekranga chiqaradi.
    // QIYINLIK DARAJASI: metodist qarori 2026-08-20 -- misollar harfli,
    // ishora va koeffitsiyent bilan; 2 karra 2 karra 2 kabi misollar yo'q.
    slug: 'dars13-daraja',
    title: "Dars 13. Natural ko'rsatkichli daraja",
    desc: "Ko'rsatkich muljitellarni sanaydi. Yig'indi koeffitsiyent beradi, ko'paytma ko'rsatkich. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars13.jsx')),
  },
  {
    // XOSSALAR YOD OLINMAYDI, ULAR SANALADI. Lenta guruhlarga bo'linadi
    // (yonma-yon -- qo'shish, takror -- ko'paytirish) va qisqaradi
    // (bo'lish). Uchta xossaning uchtasi ham sanoqdan chiqadi.
    slug: 'dars14-daraja-xossalari',
    title: 'Dars 14. Daraja xossalari',
    desc: "Ko'paytirishda qo'shiladi, bo'lishda ayiriladi, darajaning darajasida ko'paytiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars14.jsx')),
  },
  {
    // STANDART SHAKL = TARTIBLANGAN LENTA. Lenta endi ARALASH: sonlar va
    // harflar birga. Asbob lentada nima borligini sanaydi, yozuvni esa
    // o'quvchi yig'adi. Darsning o'zagi -- koeffitsiyent ishorasi:
    // darslik aniq aytadi, −b ning koeffitsiyenti (−1).
    slug: 'dars15-bir-had',
    title: 'Dars 15. Bir had va uning standart shakli',
    desc: "Sonlar ko'paytiriladi, harflar sanaladi, koeffitsiyent oldinda. −b ning koeffitsiyenti minus bir. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars15.jsx')),
  },
  {
    // BIRINCHI DARS OBVYAZKASIZ. `Frame` va ildiz komponent `core.jsx` ga
    // chiqarildi (`LessonFrame`, `createLesson`): ular 15 faylda bir xil
    // yozilgan edi. Bu darsda faqat MA'LUMOT bor.
    //
    // 2026-08-20: yozuv bir marta izohga olingan edi -- fayl kommit
    // qilinmagani uchun `vite build` butun loyiha bo'yicha yiqilardi.
    // Endi fayl ham, yozuv ham BITTA kommitda ketadi.
    slug: 'dars16-bir-hadlarni-kopaytirish',
    title: "Dars 16. Bir hadlarni ko'paytirish",
    desc: "Koeffitsiyentlar ko'paytiriladi, bir xil harflarning ko'rsatkichlari qo'shiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars16.jsx')),
  },
  {
    // B3 BLOKINING OXIRGI DARSI. Bir hadni darajaga ko'tarish -- butun
    // lentani n marta takrorlash. Chegaraviy holat darslikdan (37-bet):
    // bo'linuvchining ko'rsatkichi kattaroq bo'lsa, natija BIR HAD EMAS.
    slug: 'dars17-bir-had-darajasi',
    title: 'Dars 17. Bir hadning darajasi',
    desc: "Koeffitsiyent darajaga ko'tariladi, harf ko'rsatkichlari ko'paytiriladi. Bo'linish har doim bir had bermaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars17.jsx')),
  },
  {
    // B4 BLOKINING BIRINCHI DARSI. Ko'phad -- bir hadlarning ALGEBRAIK
    // yig'indisi, ya'ni ishora hadning o'ziga tegishli. Blokning asbobi:
    // HADLAR LENTASI -- u faqat qo'shuv va ayirish belgisi bo'yicha
    // kesiladi, ko'paytirish nuqtasida kesish tugmasi yo'q.
    slug: 'dars18-kophad-va-turlari',
    title: "Dars 18. Ko'phad va uning turlari",
    desc: "Ko'phad bir hadlarning yig'indisi, ishora esa had bilan ketadi. Tur standart shakldagi hadlar soniga qarab aytiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars18.jsx')),
  },
  {
    // Asbobning IKKINCHI REJIMI: hadlar USTUNI. Darslikning o'zi shu
    // ko'rinishni beradi -- o'xshash hadlar birining ostiga ikkinchisi.
    // Qavs oldidagi minus ustun ochilganda HAR hadning ishorasini
    // almashtiradi va bu ko'rinadi.
    slug: 'dars19-kophadlarni-qoshish',
    title: "Dars 19. Ko'phadlarni qo'shish va ayirish",
    desc: "Qavs oldidagi minus ichidagi har hadning ishorasini almashtiradi. Qo'shish faqat ustun ichida. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars19.jsx')),
  },
  {
    // BIRINCHI DARS KONVEYERDA: fayl faqat MA'LUMOT, o'ram `screens.jsx` da.
    // Asbob -- YUZA TO'RTBURCHAGI: kataklar soni qavsdagi hadlar soniga teng
    // va u ko'rinadi, ya'ni ko'paytmani tushirib qoldirish mumkin emas.
    slug: 'dars20-kophadni-birhadga-kopaytirish',
    title: "Dars 20. Ko'phadni bir hadga ko'paytirish",
    desc: "Har katak bitta ko'paytma. Kataklar soni qavsdagi hadlar soniga teng. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars20.jsx')),
  },
  {
    // TO'RTBURCHAK IKKI QATOR BO'LDI: kataklar to'rtta va ular KO'RINADI,
    // ya'ni ikki qavsdan ikkita ko'paytma yasab bo'lmaydi. Ikkinchi yarim
    // ish -- o'xshash hadlar: ular hadlar USTUNIDA qo'shiladi.
    slug: 'dars21-kophadlarni-kopaytirish',
    title: "Dars 21. Ko'phadlarni ko'paytirish",
    desc: "Har had har hadga: kataklar soni chapdagi hadlar karra yuqoridagi hadlar. So'ngra o'xshash hadlar ixchamlanadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars21.jsx')),
  },
  {
    // TESKARI YO'L: ko'paytuvchi ko'z bilan emas, QOIDA bilan topiladi --
    // eng katta umumiy bo'luvchi va eng kichik ko'rsatkich. Birlik 6-ekranda
    // KATAKDA turadi, shuning uchun uni tashlab ketish mumkin emas.
    slug: 'dars22-umumiy-kopaytuvchi',
    title: "Dars 22. Umumiy ko'paytuvchini qavsdan chiqarish",
    desc: "Ko'paytuvchi eng katta olinadi: sonlarning eng katta umumiy bo'luvchisi va harfning eng kichik ko'rsatkichi. Had o'ziga teng bo'lsa, qavsda birlik qoladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars22.jsx')),
  },
  {
    // TO'RT HAD, IKKI GURUH, UMUMIY QAVS. Xuk ishoraga qo'yilgan: blokning
    // bu yerdagi xatosi -- ikkinchi guruhda minus chiqarilganda ishoralar
    // almashtirilmasligi.
    slug: 'dars23-guruhlash-usuli',
    title: "Dars 23. Guruhlash usuli bilan ko'paytuvchilarga ajratish",
    desc: "Hadlar guruhlarga bo'linadi, har guruhda ko'paytuvchi chiqariladi, va ikkovida bir xil qavs qoladi. Minus chiqarilganda ishoralar almashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars23.jsx')),
  },
  {
    // B4 BLOKI YOPILADI. Bo'lish qoida bilan emas, KO'PAYTUVCHILAR LENTASI
    // bilan ko'rsatiladi: bo'luvchi ko'paytuvchilarni o'chiradi. Lenta
    // uchun konveyerga `tape` ekran turi qo'shildi.
    slug: 'dars24-kophadlarni-bolish',
    title: "Dars 24. Birhad va ko'phadlarni bo'lish",
    desc: "Bo'luvchi ko'paytuvchilarni o'chiradi, shuning uchun ko'rsatkich ayiriladi. Har had bo'linadi, o'ziga bo'lingan had esa birlik beradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars24.jsx')),
  },
  {
    // B5 BLOKINING BIRINCHI DARSI. Yilning asosiy xatosi shu yerda:
    // `(a + b)² = a² + b²`. To'rtburchakda `ab` katagi IKKITA va ular
    // ekranda turadi; xuk esa a ikki, b uch bo'lgandagi 13 va 25 ni
    // ko'rsatadi.
    slug: 'dars25-yigindining-kvadrati',
    title: "Dars 25. Yig'indining kvadrati va ayirmaning kvadrati",
    desc: "To'rt katak, uch had: o'rtadagi ikki katak bir xil ab beradi. Ayirmada faqat o'rta hadning ishorasi almashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars25.jsx')),
  },
  {
    // 21-DARSNING CHEGARAVIY HOLATI FORMULA BO'LDI. Qavslarning ishorasi
    // boshqa bo'lsa o'rta kataklar bir-birini yo'q qiladi. Kvadratlar
    // YIG'INDISI esa ajratilmaydi -- son bilan ko'rsatiladi.
    slug: 'dars26-kvadratlar-ayirmasi',
    title: 'Dars 26. Kvadratlar ayirmasi',
    desc: "Ishoralar boshqa bo'lsa o'rta ko'paytmalar yo'q bo'ladi va ikki kvadrat qoladi. Kvadratlar yig'indisi ajratilmaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars26.jsx')),
  },
  {
    // UCHLIKLAR E'LON QILINMAYDI, SANOQDAN CHIQADI: to'rtburchakning
    // yuqori qatorida qavsning KVADRATI turadi, olti katak ochiladi va
    // o'xshash hadlar `3a²b` bilan `3ab²` ni beradi.
    slug: 'dars27-yigindining-kubi',
    title: "Dars 27. Yig'indining kubi va ayirmaning kubi",
    desc: "Olti katak, to'rt had: uchliklar o'xshash kataklarni sanaganda chiqadi. Ayirmada ishoralar navbatlashadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars27.jsx')),
  },
  {
    // YANGI FORMULA YO'Q: ish -- FORMULANI TANLASH. Zonalarning to'rtinchisi
    // «formula yaramaydi», va usiz dars formula har doim bor deb o'rgatib
    // qo'yardi.
    slug: 'dars28-formulalarni-qollash',
    title: "Dars 28. Qisqa ko'paytirish formulalarini qo'llash",
    desc: "Belgi qavslarda ko'rinadi: bir xil qavslar kvadrat, bir xil hadlar boshqa ishora bilan kvadratlar ayirmasi, sonlar boshqa bo'lsa formula yo'q. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars28.jsx')),
  },
  {
    // FORMULALAR TESKARI TOMONGA: qavs yo'q, ko'phad berilgan. Belgi
    // hadlar SONI va ISHORASIDA. To'liq bo'lmagan kvadrat son bilan
    // rad etiladi.
    slug: 'dars29-formulalar-bilan-ajratish',
    title: "Dars 29. Formulalar bilan ko'paytuvchilarga ajratish",
    desc: "Uch had kvadratga yig'iladi, minusli ikki had ko'paytmaga, qo'shuvli ikki had esa ajratilmaydi. Tekshiruv -- ko'paytirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars29.jsx')),
  },
  {
    // BIR YOZUVDA BIR NECHA AMAL. Asosiy xato -- qavs oldidagi minus:
    // u uch hadning HAMMASINING ishorasini almashtiradi.
    slug: 'dars30-butun-ifodalar',
    title: "Dars 30. Butun ifodalarni o'zgartirish",
    desc: "Avval qavslar formulalar bilan ochiladi, keyin minus tarqatiladi, oxirida o'xshash hadlar ixchamlanadi. Ba'zan javob harfga bog'liq bo'lmaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars30.jsx')),
  },
  {
    // OLTI KATAK, TO'RTTASI YO'Q BO'LADI. To'liqsiz kvadratda o'rta had
    // IKKI KARRA emas, va aynan shu narsa to'rt katakni yo'q qiladi.
    slug: 'dars31-kublar-yigindisi',
    title: "Dars 31. Kublar yig'indisi va ayirmasi",
    desc: "Kublar yig'indisi ikki qavsga ajratiladi: ildizlar yig'indisi va to'liqsiz kvadrat. Yig'indining kubi bilan aralashtirmaslik kerak. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars31.jsx')),
  },
  {
    // B5 BLOKI YOPILADI. Dars hajmi metodist qarori bilan cheklangan:
    // qisqartirish va umumiy maxraj. Kasrlar CHIZIQLI yozilgan.
    slug: 'dars32-algebraik-kasrlar',
    title: 'Dars 32. Algebraik kasrlar: qisqartirish va umumiy maxraj',
    desc: "Faqat ko'paytuvchi qisqaradi, qo'shiluvchi esa yo'q. Umumiy maxrajda butun surat ko'paytiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars32.jsx')),
  },
  {
    // B6 BLOKINING BIRINCHI DARSI va blok asbobining birinchi ishi:
    // `Plane` -- koordinatalar tekisligi. Nuqta o'quvchi bosgan joyga
    // tushadi va koordinatalari YOZILADI, ya'ni almashtirgan o'quvchi
    // buni o'zi ko'radi.
    slug: 'dars33-koordinatalar-tekisligi',
    title: 'Dars 33. Dekart koordinatalar sistemasi',
    desc: "Juftlikdagi birinchi son x o'qi bo'yicha, ikkinchisi y bo'yicha. Tartib almashsa nuqta ham almashadi, koordinata nol bo'lsa nuqta o'qda turadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars33.jsx')),
  },
  {
    // TA'RIF DARSLIKDAN: har bir x ga aniq bitta y. Xato ikki yo'l bilan
    // yopiladi: zonalar ta'rif bo'yicha tarqatadi, tekislik esa bitta
    // abssissa ustidagi IKKI nuqtani KO'RSATADI.
    slug: 'dars34-funksiya-tushunchasi',
    title: 'Dars 34. Funksiya tushunchasi',
    desc: "Har bir x ga aniq bitta y mos keladi. Bir xil y ruxsat, bir xil x esa yo'q: chizmada bitta vertikalda ikki nuqta bo'lmaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars34.jsx')),
  },
  {
    // ASBOB BU DARSDA CHIZIQ CHIZADI: `fn` funksiyadan quriladi, nuqtalar
    // ro'yxatidan emas. Blokning xatosi -- k manfiy bo'lganda choraklarni
    // almashtirish -- xukka qo'yilgan.
    slug: 'dars35-chiziqli-funksiya',
    title: 'Dars 35. Chiziqli funksiya',
    desc: "Grafik to'g'ri chiziq. k musbat bo'lsa birinchi va uchinchi chorakdan, manfiy bo'lsa ikkinchi va to'rtinchidan. Tegishlilikni ko'z emas, son qo'yish hal qiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars35.jsx')),
  },
  {
    // IKKI YO'NALISH ATAYIN AJRATILGAN: qurish -- formulaga, o'qish --
    // o'qlarga. Blokning xatosi (o'qlarni almashtirish) xukka qo'yilgan.
    // O'qish ekranlarida tayyor nuqta IMZOSIZ turadi.
    slug: 'dars36-grafiklarni-qurish',
    title: "Dars 36. Grafiklarni qurish va o'qish",
    desc: "Qurishda abssissa formulaga boradi, o'qishda nuqtadan o'qlarga tushiladi. Birinchi son har doim x o'qi bo'yicha. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars36.jsx')),
  },
  {
    // FARQ BITTA HADDA: y = kx da b YO'Q, shuning uchun grafik boshdan
    // o'tadi. Tekshirishning eng qisqa yo'li -- nolni qo'yish. 4-ekranda
    // asbob IKKI chiziq chizadi, ikkinchisi uzuq chiziq bilan.
    slug: 'dars37-togri-proporsionallik',
    title: "Dars 37. To'g'ri proporsionallik va uning grafigi",
    desc: "y = kx da qo'shiluvchi yo'q, shuning uchun grafik koordinatalar boshidan o'tadi. k ning ishorasi choraklarni belgilaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars37.jsx')),
  },
  {
    // DARS HAJMI CHEKLANGAN (metodist qarori): grafik usul va TEKSHIRUV.
    // O'rniga qo'yish va qo'shish usullari kirmaydi. Uch holat ko'rsatiladi:
    // kesishadi, parallel, ustma-ust tushadi.
    slug: 'dars38-tenglamalar-sistemasi',
    title: 'Dars 38. Chiziqli tenglamalar sistemasi',
    desc: "Har tenglama o'z chizig'ini beradi, yechim esa ularning kesishishi va u juftlik bilan yoziladi. Chizmadan olingan nuqta ikki tenglamada tekshiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars38.jsx')),
  },
  {
    // B6 BLOKI YOPILADI. Asbob yangi emas: B4 ning YUZA TO'RTBURCHAGI, va
    // u daraxtdan kuchli -- «uch qo'shuv ikki besh» degan javob mumkin emas,
    // chunki kataklar oltita va ular ko'rinadi. Ma'lumot bilan ishlash
    // metodist qarori bilan kursga kirmaydi.
    slug: 'dars39-variantlarni-sanash',
    title: 'Dars 39. Variantlarni sanash',
    desc: "Kataklar soni tomonlar ko'paytmasiga teng. «Va» ko'paytirishga, «yoki» qo'shishga olib keladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars39.jsx')),
  },
  {
    // B7 BLOKI BOSHLANADI: GEOMETRIYA. Blokning asbobi -- CHIZMA (`Figure`):
    // nuqtalar to'r tugunlarida turadi va uchni boshqa tugunga ko'chirish
    // mumkin. Bu darsda o'lchash TEMANING O'ZI, shuning uchun «taxmin»
    // yorlig'i yo'q -- u 42-darsdan chiqadi.
    slug: 'dars40-chiziqlar-va-burchaklar',
    title: 'Dars 40. Chiziqlar va burchaklar',
    desc: "Qo'shni burchaklar yoyilganini bo'lib oladi, shuning uchun yig'indisi 180. Kesishishda qarama-qarshi burchaklar vertikal va ular teng. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars40.jsx')),
  },
  {
    // IKKI BO'LINISH MUSTAQIL: bir uchburchakka tomonlar bo'yicha ham,
    // burchaklar bo'yicha ham nom qo'yiladi. Chegaraviy holat -- 2, 3, 5:
    // asbob nuqtalarni bir chiziqqa qo'yadi va burchaklar nol, 180, nol
    // chiqadi, ya'ni uchburchakning yo'qligi CHIZMADA ko'rinadi.
    slug: 'dars41-uchburchak-turlari',
    title: 'Dars 41. Uchburchak va uning turlari',
    desc: "Tomonlar bo'yicha teng yonli, teng tomonli, turli tomonli; burchaklar bo'yicha o'tkir, to'g'ri va o'tmas burchakli. Ikki tomon yig'indisi uchinchisidan katta bo'lishi shart. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars41.jsx')),
  },
  {
    // SHU DARSDAN «O'LCHOV ISBOT EMAS» TALABI ISHLAYDI (etalon § 9): asbob
    // o'lchagan son «taxmin» deb imzolanadi. Ikki tomon yetarli emasligi
    // asbobda ko'rsatiladi: A va B qotgan, C ko'chadi, A C besh bo'lib
    // qoladi, uchinchi tomon esa o'zgaradi.
    slug: 'dars42-tenglik-alomatlari',
    title: 'Dars 42. Uchburchaklar tengligi alomatlari',
    desc: "Uchta mos element yetarli: uch tomon; ikki tomon va orasidagi burchak; tomon va unga yopishgan ikki burchak. Uch burchak faqat shaklni beradi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars42.jsx')),
  },
  {
    // DARS BURCHAKLAR YIG'INDISIGA TAYANMAYDI: yig'indi 44-darsning temasi.
    // Bu yerda hamma narsa TENGLIKDAN chiqadi. Asbob xossani sinaydi: uch
    // ko'chganda tomonlar tengligi ham, burchaklar tengligi ham yo'qoladi.
    slug: 'dars43-teng-yonli-uchburchak',
    title: 'Dars 43. Teng yonli uchburchak',
    desc: "Asosdagi burchaklar teng, va teskarisi ham to'g'ri. Uchdan tushirilgan perpendikulyar asosni va uchdagi burchakni teng ikkiga bo'ladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars43.jsx')),
  },
  {
    // DARS HALOL YO'LDAN BORADI: yig'indi O'LCHANADI, har xil uchburchakda
    // bir xil chiqadi va QONUNIYAT deb ataladi -- isbot deb emas. Isbot
    // parallel chiziqlarni talab qiladi, ular 45-darsda. Asbob yig'indini
    // aldamaydi: ikki burchak yaxlitlanadi, uchinchisi ayirma bilan olinadi.
    slug: 'dars44-burchaklar-yigindisi',
    title: "Dars 44. Uchburchak burchaklarining yig'indisi",
    desc: "Uch ko'chadi, burchaklar o'zgaradi, yig'indi esa 180 bo'lib qoladi. Ikkitasi ma'lum bo'lsa uchinchisi ayirma bilan topiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars44.jsx')),
  },
  {
    // BU DARS 44-DARSNING QARZINI YOPADI: ko'chirish ekranida uchdan asosga
    // parallel chiziq o'tkaziladi va o'lchov XULOSAGA aylanadi. Kesuvchi
    // tugunlardan o'tadi -- (2;2) va (-2;-2) -- shuning uchun 45 daraja
    // yorlig'i chizmaga yolg'on gapirmaydi.
    slug: 'dars45-parallel-chiziqlar',
    title: 'Dars 45. Parallel chiziqlar va kesuvchi',
    desc: "Mos va almashinuvchi burchaklar teng, bir tomonlilarning yig'indisi 180. Teskarisi parallellik alomati, va u burchaklar yig'indisini isbotlaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars45.jsx')),
  },
  {
    // METODIST QARORI 2026-08-21: tema BITTA darsda qoladi va NISBATNI oladi.
    // PIFAGOR TEOREMASI YO'Q -- u 8-sinfda. Gipotenuza hisoblanmaydi, asbob
    // uni o'lchaydi (3, 4, 5), va xukda katetlarni qo'shish tuzog'i turadi.
    // O'ttiz daraja holati chizmada ko'rsatilmaydi: to'rda u aniq chiqmaydi.
    slug: 'dars46-togri-burchakli-uchburchak',
    title: "Dars 46. To'g'ri burchakli uchburchak",
    desc: "Katetlar va gipotenuza, o'tkir burchaklar birga 90. Katta burchak qarshisida katta tomon, shuning uchun gipotenuza eng uzun. 30 daraja qarshisidagi katet yarim gipotenuza. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars46.jsx')),
  },
  {
    // ASBOB YOY CHIZMAYDI, LEKIN SIRKULNING MA'NOSI -- TENG MASOFA -- klik
    // bilan to'liq beriladi. Tugunlar yechim YAGONA bo'ladigan qilib
    // tanlangan (tekshirilgan): 3-ekranda faqat (0;3), 6-ekranda faqat
    // (4;-2). Aks holda ikkinchi to'g'ri javob xato deb belgilanardi.
    slug: 'dars47-sirkul-va-chizgich',
    title: "Dars 47. Sirkul va chizg'ich bilan yasashlar",
    desc: "Sirkul teng masofani beradi, chizg'ich chiziqni. Teng uzoqlikdagi nuqtalar o'rta perpendikulyarda yotadi. Yoylar uchrashmasa yasash mumkin emas. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars47.jsx')),
  },
  {
    // B7 BLOKI VA 7-SINF KURSI YOPILADI. Takrorlash qayta aytish emas: har
    // ekran ikki faktni bir masalada uchrashtiradi. Asbobdagi qarama-qarshilik
    // darsning o'zagi: uch ko'chganda asosdagi burchaklar tengligi yo'qoladi,
    // yig'indi esa qoladi -- SHARTLI va SHARTSIZ tasdiqning farqi.
    slug: 'dars48-yakuniy-takrorlash',
    title: 'Dars 48. Yakuniy takrorlash',
    desc: "Blokning to'rt ustuni bir joyda: qo'shni va vertikal burchaklar, yig'indi 180, teng yonlilik, parallellik. Shartli va shartsiz tasdiq farqlanadi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/Dars48.jsx')),
  },
]

// 7-sinf AMALIY mashg'ulotlari. Har nazariy darsga 10 tekshiriladigan
// topshiriq. JOYLASHUV 1, 2 va 5-sinflardagi bilan BIR XIL (metodist qarori
// 2026-08-20):
//   practice/PracticeHost.jsx          -- qobiq, sinfga bitta
//   practice/darsNN/DNN_01..10.jsx     -- bitta topshiriq = bitta fayl
//   practice/darsNN/DarsNNPractice.jsx -- yig'uvchi, ro'yxat shuni chaqiradi
// Ya'ni darsga 11 jsx. Amaliyot ovozsiz ishlaydi.
//
// 7-SINFNING FARQI. Boshqa sinflarda amaliyot UMUMIY shakllardan yig'iladi
// (variant tanlash, kiritish, moslashtirish). Bu yerda unday QILINMAYDI:
// etalon §1.1 tayyor javobni tanlashni cheklaydi. Shuning uchun har
// topshiriqda o'quvchi O'ZI biror narsa qiladi: tartibni qo'yadi, uyani
// to'ldiradi, qatorni tuzatadi, yozuvni yig'adi, zonaga joylashtiradi
// (PODXOD_7SINF.md §9).
//
// 1-DARS AMALIYOTI. 2026-08-20 da to'liq qayta yig'ildi: tuzilma, uslub va
// jsx-question kontrakti 5-sinf amaliyotidan olindi (5-sinfning O'ZIGA
// tegilmadi), matematikasi esa 7-sinfning. Ilgari shu darsda boshqa to'plam
// turgan edi -- metodist uni olib tashlashga qaror qildi.
// Uch topshiriq (03, 04, 08) harfli ifodalar ustida. Metodist qarori
// 2026-08-20: qolsin, chunki bu YANGI material emas, TAKRORLASH -- 6-sinfda
// o'tilgan (shu kursning 31-darsi «Harfli ifodalar», 32-darsi «Qavslarni
// ochish», 33-darsi o'xshash hadlar). 7-sinf rejasida bu mavzular 2, 5 va
// 6-darslarda qaytadan, chuqurroq keladi.
export const grade7Amaliy = [
  {
    slug: 'dars01-amaliyot-sonli-ifodalar',
    title: 'Dars 1. Amaliyot: sonli ifodalar',
    desc: "10 topshiriq: amallar tartibi, qavs, o'nli va oddiy kasrlar, manfiy sonlar, harfli ifodalar. O'nta xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars01/Dars01Practice.jsx')),
  },
  {
    // 2-DARS AMALIYOTI. Umumiy qatlam ustida yig'ilgan: mexanikalar
    // `practice/kit.jsx` da, topshiriq fayllarida faqat ma'lumot.
    slug: 'dars02-amaliyot-ozgaruvchili-ifodalar',
    title: "Dars 2. Amaliyot: o'zgaruvchili ifodalar",
    desc: "10 topshiriq: yashiringan ko'paytirish, manfiy son qo'yish, ikki o'zgaruvchi, bir harf ikki joyda, vaziyatdan yozuvga va nolga bo'lish chegarasi. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars02/Dars02Practice.jsx')),
  },
  {
    slug: 'dars03-amaliyot-amallar-xossalari',
    title: 'Dars 3. Amaliyot: amallarning xossalari',
    desc: "10 topshiriq: qulay tartib, yumaloq juftlik, bo'lib ko'paytirish, yarim yo'lda qolgan taqsimot va o'rin almashtirish qayerda ishlaydi. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars03/Dars03Practice.jsx')),
  },
  {
    slug: 'dars05-amaliyot-qavslarni-ochish',
    title: 'Dars 5. Amaliyot: qavslarni ochish',
    desc: "10 topshiriq: minusli qavs, ishora qayerda o'zgaradi, uchta qavs, a − b − c ga teng yozuvlar va qavs oldida belgi emas, ko'paytuvchi turgan holat. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars05/Dars05Practice.jsx')),
  },
  {
    slug: 'dars06-amaliyot-oxshash-hadlar',
    title: "Dars 6. Amaliyot: o'xshash hadlar",
    desc: "10 topshiriq: o'xshash hadni topish, koeffitsiyentlar, ikki guruh, qavsdan keyin yig'ish, soddalashmaydigan yozuvlar va nechta had qolishi. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars06/Dars06Practice.jsx')),
  },
  {
    slug: 'dars07-amaliyot-tenglama-ildizi',
    title: 'Dars 7. Amaliyot: tenglama ildizi',
    desc: "10 topshiriq: ildizni tekshirish, tekshirish qatorini yozish va hisoblash, noma'lum ikki tomonda, manfiy ko'paytuvchi, ildizi yo'q tenglamalar va nechta ildiz bo'lishi. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars07/Dars07Practice.jsx')),
  },
  {
    slug: 'dars08-amaliyot-chiziqli-tenglama',
    title: 'Dars 8. Amaliyot: chiziqli tenglama',
    desc: "10 topshiriq: chiziqli tenglamani tanish, hadni ko'chirish va ishora, yechim qadamlari, qavsli tenglama, ildizi bir xil tenglamalar va masaladan tenglamaga. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars08/Dars08Practice.jsx')),
  },
  {
    slug: 'dars09-amaliyot-tenglamalarni-yechish',
    title: 'Dars 9. Amaliyot: tenglamalarni yechish',
    desc: "10 topshiriq: birinchi qadamni tanlash, qavsni ochish, to'liq yechim, ikki qavsli tenglama, ildizni tekshirish va uch xil ildiz. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars09/Dars09Practice.jsx')),
  },
  {
    slug: 'dars10-amaliyot-modulli-tenglama',
    title: 'Dars 10. Amaliyot: modulli tenglama',
    desc: "10 topshiriq: ikki holat, modul nolga teng, ildizi yo'q tenglamalar, modulni ajratish, modul tashqarisidagi minus va ildizlar soni. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars10/Dars10Practice.jsx')),
  },
  {
    slug: 'dars11-amaliyot-masala-tenglama',
    title: 'Dars 11. Amaliyot: masalalarni tenglama bilan yechish',
    desc: "10 topshiriq: masalaning tenglamasi, ikki barobar ko'p, farqi ma'lum ikki son, ketma-ket sonlar va javob kim haqida ekani. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars11/Dars11Practice.jsx')),
  },
  {
    slug: 'dars12-amaliyot-matnli-masalalar',
    title: 'Dars 12. Amaliyot: matnli masalalar',
    desc: "10 topshiriq: yo'l masalasi, sarflandi va qoldi, uch barobar ko'p, lentaning ikki bo'lagi, ota va o'g'il yoshi, xarid. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars12/Dars12Practice.jsx')),
  },
  {
    slug: 'dars13-amaliyot-daraja',
    title: "Dars 13. Amaliyot: natural ko'rsatkichli daraja",
    desc: "10 topshiriq: darajaning ma'nosi, manfiy asos, qavs bor va qavs yo'q holatlari, darajalar ko'paytmasi va ishorani aniqlash. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars13/Dars13Practice.jsx')),
  },
  {
    slug: 'dars14-amaliyot-daraja-xossalari',
    title: 'Dars 14. Amaliyot: daraja xossalari',
    desc: "10 topshiriq: ko'rsatkichlar qo'shilishi, ayirilishi va ko'paytirilishi, asoslar bir xilmi, ko'paytmani darajaga ko'tarish. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars14/Dars14Practice.jsx')),
  },
  {
    slug: 'dars15-amaliyot-bir-had',
    title: 'Dars 15. Amaliyot: bir had',
    desc: "10 topshiriq: bir hadni tanish, koeffitsiyent, ko'paytirish, standart ko'rinish, o'xshash bir hadlar va bir hadning darajasi. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars15/Dars15Practice.jsx')),
  },
  {
    slug: 'dars16-amaliyot-bir-hadlarni-kopaytirish',
    title: "Dars 16. Amaliyot: bir hadlarni ko'paytirish",
    desc: "10 topshiriq: koeffitsiyentlar ko'paytmasi va ko'rsatkichlar yig'indisi, ishora, ikki harf, uchta ko'paytuvchi, ko'paytmaning darajasi. Yetti xil mexanika, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars16/Dars16Practice.jsx')),
  },
  {
    slug: 'dars17-amaliyot-bir-had-darajasi',
    title: "Dars 17. Amaliyot: bir hadning darajasi",
    desc: "10 topshiriq: qavs ustidagi daraja, manfiy asos, ikki harf, bo'lishda ko'rsatkichlar ayirilishi, ikki qadamli zanjir va qavsning ishoraga ta'siri. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars17/Dars17Practice.jsx')),
  },
  {
    slug: 'dars18-amaliyot-kophad-va-turlari',
    title: "Dars 18. Amaliyot: ko'phad va turlari",
    desc: "10 topshiriq: hadlar soni va turi, standart shakl, ishora had bilan ketishi, ikki harfli hadlar va tur ixchamlashdan keyin aytilishi. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars18/Dars18Practice.jsx')),
  },
  {
    slug: 'dars19-amaliyot-kophadlarni-qoshish',
    title: "Dars 19. Amaliyot: ko'phadlarni qo'shish va ayirish",
    desc: "10 topshiriq: minusli qavs har hadning ishorasini ag'darishi, uch qavs, had yo'qolishi va qavsga olish. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars19/Dars19Practice.jsx')),
  },
  {
    slug: 'dars20-amaliyot-kophadni-birhadga-kopaytirish',
    title: "Dars 20. Amaliyot: ko'phadni bir hadga ko'paytirish",
    desc: "10 topshiriq: har hadga ko'paytirish, manfiy bir had, ikki harf, umumiy ko'paytuvchini qavsga olish va ikki qavsni ixchamlash. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars20/Dars20Practice.jsx')),
  },
  {
    slug: 'dars21-amaliyot-kophadlarni-kopaytirish',
    title: "Dars 21. Amaliyot: ko'phadlarni ko'paytirish",
    desc: "10 topshiriq: to'rt ko'paytma, ko'paytmani tiklash, ikki minus, ikki harf va olti ko'paytma. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars21/Dars21Practice.jsx')),
  },
  {
    slug: 'dars22-amaliyot-umumiy-kopaytuvchi',
    title: "Dars 22. Amaliyot: umumiy ko'paytuvchini qavsga olish",
    desc: "10 topshiriq: eng katta umumiy ko'paytuvchi, minusni chiqarish, ikki harf va umumiy qavs. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars22/Dars22Practice.jsx')),
  },
  {
    slug: 'dars23-amaliyot-guruhlash-usuli',
    title: "Dars 23. Amaliyot: guruhlash usuli",
    desc: "10 topshiriq: ikki guruh, umumiy qavs, minusli guruh va guruhni minusli qavsga olish. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars23/Dars23Practice.jsx')),
  },
  {
    slug: 'dars24-amaliyot-kophadlarni-bolish',
    title: "Dars 24. Amaliyot: ko'phadni bir hadga bo'lish",
    desc: "10 topshiriq: har hadni bo'lish, ko'rsatkichlar ayirilishi, bo'linma bir bo'lishi va bo'linuvchini tiklash. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars24/Dars24Practice.jsx')),
  },
  {
    slug: 'dars25-amaliyot-yigindining-kvadrati',
    title: "Dars 25. Amaliyot: yig'indining kvadrati",
    desc: "10 topshiriq: o'rta had, kvadratni tiklash, ikki harf va ayirmaning kvadrati bilan solishtirish. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars25/Dars25Practice.jsx')),
  },
  {
    slug: 'dars26-amaliyot-kvadratlar-ayirmasi',
    title: "Dars 26. Amaliyot: kvadratlar ayirmasi",
    desc: "10 topshiriq: ko'paytuvchilarga ajratish, o'rta hadning yo'qolishi, ikki harf va sonli hisob. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars26/Dars26Practice.jsx')),
  },
  {
    slug: 'dars27-amaliyot-yigindining-kubi',
    title: "Dars 27. Amaliyot: yig'indining kubi",
    desc: "10 topshiriq: to'rt had, koeffitsiyentlar 1-3-3-1, ishoralar navbatlashishi. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars27/Dars27Practice.jsx')),
  },
  {
    slug: 'dars28-amaliyot-formulalarni-qollash',
    title: "Dars 28. Amaliyot: formulalarni qo'llash",
    desc: "10 topshiriq: qaysi formula, sonli hisob, ikki formula ketma-ket. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars28/Dars28Practice.jsx')),
  },
  {
    slug: 'dars29-amaliyot-formulalar-bilan-ajratish',
    title: "Dars 29. Amaliyot: formulalar bilan ajratish",
    desc: "10 topshiriq: to'liq kvadrat, kvadratlar ayirmasi, umumiy ko'paytuvchi va formula birga. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars29/Dars29Practice.jsx')),
  },
  {
    slug: 'dars30-amaliyot-butun-ifodalar',
    title: "Dars 30. Amaliyot: butun ifodalarni ixchamlash",
    desc: "10 topshiriq: bir necha amal, qavs ichida qavs, ishoralar va tekshirish son bilan. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars30/Dars30Practice.jsx')),
  },
  {
    slug: 'dars31-amaliyot-kublar-yigindisi',
    title: "Dars 31. Amaliyot: kublar yig'indisi va ayirmasi",
    desc: "10 topshiriq: ikki ko'paytuvchi, to'liqsiz kvadrat, ishoralar tartibi. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars31/Dars31Practice.jsx')),
  },
  {
    slug: 'dars32-amaliyot-algebraik-kasrlar',
    title: "Dars 32. Amaliyot: algebraik kasrlar",
    desc: "10 topshiriq: qisqartirish, umumiy maxraj va bir xil maxrajda qo'shish. Mavzu darsga to'liq mos keltirildi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars32/Dars32Practice.jsx')),
  },
  {
    slug: 'dars33-amaliyot-koordinatalar-tekisligi',
    title: "Dars 33. Amaliyot: koordinatalar tekisligi",
    desc: "10 topshiriq: nuqta yozuvi, o'qlar, ikki marta simmetriya, kesma uzunligi va o'rtasi, to'rtinchi uch. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars33/Dars33Practice.jsx')),
  },
  {
    slug: 'dars34-amaliyot-funksiya-tushunchasi',
    title: "Dars 34. Amaliyot: funksiya tushunchasi",
    desc: '10 topshiriq: funksiya belgisi, manfiy argument, jadval, teskari savol, harfli argument, zanjir. UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/practice/dars34/Dars34Practice.jsx')),
  },
  {
    slug: 'dars35-amaliyot-chiziqli-funksiya',
    title: "Dars 35. Amaliyot: chiziqli funksiya",
    desc: "10 topshiriq: manfiy va kasr k, k va b ni ajratish, o'qlarni kesish, ikki nuqtadan formula. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars35/Dars35Practice.jsx')),
  },
  {
    slug: 'dars36-amaliyot-grafiklarni-qurish',
    title: "Dars 36. Amaliyot: grafiklarni qurish va o'qish",
    desc: '10 topshiriq: qurish tartibi, nuqta grafikdami, grafikdan formula, ikki grafik kesishishi. UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/practice/dars36/Dars36Practice.jsx')),
  },
  {
    slug: 'dars37-amaliyot-togri-proporsionallik',
    title: "Dars 37. Amaliyot: to'g'ri proporsionallik",
    desc: '10 topshiriq: manfiy va kasr k, proporsionallikni ajratish, jadval, necha barobar, zanjir. UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/practice/dars37/Dars37Practice.jsx')),
  },
  {
    slug: 'dars38-amaliyot-tenglamalar-sistemasi',
    title: "Dars 38. Amaliyot: tenglamalar sistemasi",
    desc: "10 topshiriq: qo'yish va qo'shish USULLARI, yechimlar soni, tekshirish. Mavzu darsga to'liq mos keltirildi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars38/Dars38Practice.jsx')),
  },
  {
    slug: 'dars39-amaliyot-variantlarni-sanash',
    title: "Dars 39. Amaliyot: variantlarni sanash",
    desc: "10 topshiriq: ko'paytirish va qo'shish qoidasi, takrorli va takrorsiz tanlash, nol birinchi o'rinda. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars39/Dars39Practice.jsx')),
  },
  {
    slug: 'dars40-amaliyot-chiziqlar-va-burchaklar',
    title: 'Dars 40. Amaliyot: chiziqlar va burchaklar',
    desc: "10 topshiriq: qo'shni va vertikal burchaklar, bissektrisa, kesma bo'laklari, nisbat. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars40/Dars40Practice.jsx')),
  },
  {
    slug: 'dars41-amaliyot-uchburchak-turlari',
    title: 'Dars 41. Amaliyot: uchburchak va uning turlari',
    desc: "10 topshiriq: ikki mustaqil bo'linish -- tomonlar va burchaklar bo'yicha, perimetr, harf bilan. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars41/Dars41Practice.jsx')),
  },
  {
    slug: 'dars42-amaliyot-tenglik-alomatlari',
    title: 'Dars 42. Amaliyot: uchburchaklar tengligi alomatlari',
    desc: '10 topshiriq: uchta mos element, moslikni yozish, uch burchak yetarli emas, isbot tartibi. Mexanikalar raskladkadan, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/practice/dars42/Dars42Practice.jsx')),
  },
  {
    slug: 'dars43-amaliyot-teng-yonli-uchburchak',
    title: 'Dars 43. Amaliyot: teng yonli uchburchak',
    desc: "10 topshiriq: asosdagi burchaklar va teskarisi, perimetr, harf bilan tomonlar. Burchaklar yig'indisiga tayanmaydi. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars43/Dars43Practice.jsx')),
  },
  {
    slug: 'dars44-amaliyot-burchaklar-yigindisi',
    title: "Dars 44. Amaliyot: uchburchak burchaklarining yig'indisi",
    desc: '10 topshiriq: 180 gradus, uchinchi burchak, tashqi burchak, nisbat va harf bilan. Mexanikalar raskladkadan, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/practice/dars44/Dars44Practice.jsx')),
  },
  {
    slug: 'dars45-amaliyot-parallel-togri-chiziqlar',
    title: "Dars 45. Amaliyot: parallel to'g'ri chiziqlar",
    desc: "10 topshiriq: mos, ichki almashinuvchi burchaklar, parallellik sharti. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars45/Dars45Practice.jsx')),
  },
  {
    slug: 'dars46-amaliyot-togri-burchakli-uchburchak',
    title: "Dars 46. Amaliyot: to'g'ri burchakli uchburchak",
    desc: "10 topshiriq: katetlar va gipotenuza, o'tkir burchaklar 90 gradus, katta burchak qarshisidagi tomon, uchburchak tengsizligi. Pifagor teoremasi yo'q -- u 8-sinfda. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars46/Dars46Practice.jsx')),
  },
  {
    slug: 'dars47-amaliyot-yasashlar',
    title: "Dars 47. Amaliyot: sirkul va chizg'ich bilan yasashlar",
    desc: '10 topshiriq: sirkul teng masofa beradi, yasash qadamlari va tartibi, yasashdagi xato, yasash mumkinmi. Mexanikalar raskladkadan, UZ/RU/EN.',
    Component: lazy(() => import('../components/grade7/practice/dars47/Dars47Practice.jsx')),
  },
  {
    slug: 'dars48-amaliyot-yakuniy-takrorlash',
    title: 'Dars 48. Amaliyot: yakuniy takrorlash',
    desc: "10 topshiriq: har topshiriqda blokning ikki fakti uchrashadi -- tashqi burchak va yig'indi, teng yonlilik va yig'indi, tenglik va perimetr. UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars48/Dars48Practice.jsx')),
  },
  {
    slug: 'dars04-amaliyot-ayniyat',
    title: "Dars 4. Amaliyot: qiymatni saqlaydigan o'zgartirishlar",
    desc: "10 topshiriq: bitta son isbot emas, xossa bilan qayta yozish, ayniylikni tekshirish. Mexanikalar raskladkadan, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade7/practice/dars04/Dars04Practice.jsx')),
  },
]
