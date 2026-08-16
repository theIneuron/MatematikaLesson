import { lazy } from 'react'

// 11-sinf darslari.
// Temalar manbasi: src/books/Math_1-11_Поурочно_RUz.xlsx, «11 класс» varag'i
// (58 satr: 50 dars + 7 PK + IK). Reja O'ZGARTIRILMAYDI.
// Yondashuv: src/books/grade11/PODXOD_11SINF.md — avval asbob, keyin darslar.
// Yadro `components/grade11/core.jsx`, asboblar `components/grade11/tools.jsx`.
//
// Ishlab chiqarish tartibi dars raqami bo'yicha EMAS, asbob bo'yicha:
// pilot = Dars 12, keyin 9-11, 13, 14 (Б2 yopiladi), keyin qolgan bloklar.
export const grade11Nazariy = [
  {
    slug: 'dars01-boshlangich-funksiya',
    title: "Dars 1. Boshlang'ich funksiya",
    desc: "Hosilaga teskari amal, + C va oila, daraja qoidasi, javobni differensiallab tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars01.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars02-qoidalar',
    title: 'Dars 2. Qoidalar',
    desc: "O'zgarmas ko'paytuvchi, qo'shiluvchilar alohida, qavs kx + b va k ga bo'lish, differensiallab tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars02.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars03-aniqmas-integral',
    title: 'Dars 3. Aniqmas integral',
    desc: "Integral belgisi, hosilalar jadvali o'ngdan chapga, sinus va kosinus ishorasi, 1/x uchun alohida satr. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars03.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars04-aniq-integral',
    title: 'Dars 4. Aniq integral',
    desc: "Egri chiziqli trapetsiya, chegarani tortish, to'plangan yuza grafigi, integral ishorasi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars04.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars05-nyuton-leybnits',
    title: 'Dars 5. Nyuton-Leybnits formulasi',
    desc: "Formula uch tayanchdan chiqariladi, chegaralar tartibi, o'zgarmas qisqaradi, tezlik ostidagi yuza bu yo'l. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars05.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars06-figura-yuzasi',
    title: 'Dars 6. Tekis figuraning yuzasi',
    desc: "Yuqoridagi minus pastdagi, chegaralar kesishishdan, o'q ham chiziq, manfiy javob signal. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars06.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars07-tatbiqlar',
    title: 'Dars 7. Integralning tatbiqlari',
    desc: "Kesim yuzasi ostida hajm, tezlik ostida yo'l, kuch ostida ish, jadval bo'yicha taxminiy hisob. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars07.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars16-orin-almashtirishlar',
    title: "Dars 16. O'rin almashtirishlar",
    desc: "VA ko'paytiradi, YOKI qo'shadi; natijalar daraxti, n faktorial, takrorlarga bo'lish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars16.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars17-orinlashtirishlar',
    title: "Dars 17. O'rinlashtirishlar",
    desc: "Daraxt joylar tugaganda uziladi, ko'paytuvchilar soni joylarga teng, n!/(n−k)!. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars17.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars18-guruhlashlar',
    title: 'Dars 18. Guruhlashlar',
    desc: "Tartib muhim bo'lmasa har to'plam k! marta sanalgan; C = A / k!, simmetriya. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars18.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars19-nyuton-binomi',
    title: 'Dars 19. Nyuton binomi',
    desc: "Koeffitsient bu yo'llar soni, k bu b ning darajasi, Paskal uchburchagi, yig'indi 2 darajada n. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars19.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars20-ehtimollik',
    title: 'Dars 20. Ehtimollik',
    desc: "Ehtimollik bu ulush, chastota unga yaqinlashadi; yuzta katakcha, tanga o'tmishni eslamaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars20.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars21-qoshish-kopaytirish',
    title: "Dars 21. Ehtimolliklarni qo'shish va ko'paytirish",
    desc: "VA ko'paytiradi, YOKI qo'shadi; kesishma ikki marta sanaladi va bir marta ayiriladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars21.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars22-ortacha-mediana',
    title: "Dars 22. O'rtacha, moda, mediana",
    desc: "Uch son uch xil savolga javob beradi; chekka qiymatlar o'rtachani tortadi, medianani emas. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars22.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars24-taqsimotlar',
    title: 'Dars 24. Binomial va normal taqsimot',
    desc: "Ko'p takror qo'ng'iroq beradi: C(n,k)/2^n, o'rtasi eng ehtimolli lekin kafolat emas, normal taqsimot chegara sifatida. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars24.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars23-ikki-qator',
    title: "Dars 23. Ikki qator ma'lumot",
    desc: "Nuqtalar buluti bog'liqlikni ko'rsatadi, sababni emas; umumiy uchinchi sabab va «ma'lumot yetarli emas» javobi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars23.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars27-silindr',
    title: 'Dars 27. Silindr',
    desc: "To'rtburchakning tomoni atrofida aylanishi; qaysi o'q -- shunday jism; o'q kesimi 2r x l; V = pi r kvadrat l. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars27.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars28-konus',
    title: 'Dars 28. Konus',
    desc: "Uchburchakning katet atrofida aylanishi; balandlik va yasovchi Pifagor bilan bog'langan; o'q kesimi teng yonli uchburchak. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars28.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars29-shar-sfera',
    title: 'Dars 29. Shar va sfera',
    desc: "Yarim doiraning aylanishi; har qanday kesim doira, radiusi r kvadrat = R kvadrat minus d kvadrat; sfera sirt, shar jism. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars29.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars30-sirtlar',
    title: 'Dars 30. Sirtlar yuzasi',
    desc: "Yon sirt yoyiladi: silindrda to'rtburchak, konusda sektor; pi r l yoyilmadan chiqadi; to'liq sirtga asoslar qo'shiladi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars30.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars31-hajm-prizma',
    title: 'Dars 31. Prizma va silindr hajmi',
    desc: "V = S karra h; qatlamlar bir xil, yig'indi aniq; Kavalyeri prinsipi: qiyalik hajmni o'zgartirmaydi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars31.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars32-hajm-konus',
    title: 'Dars 32. Piramida va konus hajmi',
    desc: "To'kish uchdan birni ko'rsatadi, disklar isbotlaydi: kesim yuzasi kvadratik kamayadi. V = 1/3 S h. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars32.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars33-shar-hajmi',
    title: 'Dars 33. Shar hajmi',
    desc: "Kesimlar har xil, disklar faqat yaqinlashadi: aniq javob limitda. V = 4/3 pi R kub; Arximed nisbati 3 : 2 : 1. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars33.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars26-kopyoqliklar',
    title: "Dars 26. Ko'pyoqliklar",
    desc: "Yoq, qirra, cho'qqi asos tomonlaridan chiqadi: n+2, 3n, 2n; Eyler formulasi V - E + F = 2 tekshiruv sifatida. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars26.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars09-korsatkichli-tenglamalar',
    title: 'Dars 9. Ko\'rsatkichli tenglamalar',
    desc: "Bitta asosga keltirish, almashtirish t = aˣ va t > 0 sharti, ildizni qo'yib tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars09.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars10-korsatkichli-tengsizliklar',
    title: "Dars 10. Ko'rsatkichli tengsizliklar",
    desc: "Bitta asosga keltirish, asosga qarab ishora yo'nalishi, javobni nuqta bilan tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars10.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars11-logarifmik-tenglamalar',
    title: "Dars 11. Logarifmik tenglamalar",
    desc: "Yig'indini ko'paytmaga yig'ish, ildizni qo'yib tekshirish, argument musbatligi. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars11.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars13-sistemalar',
    title: 'Dars 13. Sistemalar',
    desc: "Sistema bu VA: to'plamlar kesishmasi, ikki noma'lumli juft, javobni ikkala shartga qo'yib tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars13.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars14-masalalar',
    title: 'Dars 14. Masalalar',
    desc: "Foiz bu ko'paytirish, shartdan tenglamaga, noma'lum ko'rsatkichda, javobni ko'paytirib tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars14.jsx')),
    ownLangSwitch: true,
  },
  {
    slug: 'dars12-logarifmik-tengsizliklar',
    title: 'Dars 12. Logarifmik tengsizliklar',
    desc: "Asos birdan katta va kichik holatlar, argumentga shart, javobni nuqta bilan tekshirish. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade11/Dars12.jsx')),
    // Dars til almashtirgichini O'ZI yuqori panelida chizadi. Previuning
    // qo'shimcha almashtirgichi kerak emas: u darsning ovoz tugmasi ustiga
    // tushib, uni bosilmaydigan qilib qo'yardi.
    ownLangSwitch: true,
  },
]
