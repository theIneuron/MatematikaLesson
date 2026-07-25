# ETALON 3-SINF — darslar uchun sifat kontrakti

> Etalon darslar: `src/components/grade3/Dars01.jsx` va
> `src/components/grade3/Dars02.jsx`. Yangi va qayta ishlanadigan 3-sinf darslari
> shu ikki darsning tashqi ko'rinishini ko'chirish bilangina cheklanmaydi:
> ularning pedagogik oqimi, ikki tilliligi, audio boshqaruvi, xatodan
> o'rgatishi va yakuniy diagnostikasi ham saqlanadi.

## 1. O'zgarmas dars oqimi

Nazariy dars mavzuning kognitiv yukiga qarab 13–16 ta mazmuniy ekrandan
iborat bo'lishi mumkin. Ekran soni emas, quyidagi pedagogik vazifalarning
to'liq bajarilishi o'zgarmas mezondir:

1. Kirish diagnostikasi — avvalgi bilimni tekshiradi, yangi qoidani so'ramaydi.
2. Eslatish — yangi mavzu tayangan bitta tayanch bilimni faollashtiradi.
3. Muammo — Lumo syujetidagi to'siqni ko'rsatadi.
4. Konkret model — son, amal yoki shakl ko'rinadigan obyekt bilan quriladi.
5. Ikkinchi model — birinchi modelni boshqa tasvirda ko'rsatadi.
6. O'quvchi kashfiyoti — bola natijani oldindan aytadi yoki qonuniyatni tanlaydi.
7. Qoida — kashf qilingan bog'lanish qisqa va aniq nomlanadi.
8. Birgalikdagi mashq — bir qadamli, kuchli vizual tayanchli.
9. Yo'naltirilgan mashq — tayanch kamayadi.
10. Mustaqil mashq — yangi misol, tayanchsiz yoki minimal tayanch bilan.
11. Teskari topshiriq — javobdan amal/son/modelni tiklash.
12. Xatoni topish — tipik noto'g'ri fikrni aniqlash va tuzatish.
13. Hayotiy masala — matematik amal syujetdagi haqiqiy muammoni yechadi.
14. Yakuniy diagnostika — transfer va tushuntirishni tekshiradi.
15. Refleksiya va syujet yopilishi — nima o'rganilgani aytiladi, to'siq yechiladi.

Ba'zi sodda mavzularda yonma-yon vazifalar bitta ekranda birlashishi mumkin;
murakkab mavzuda esa kashf yoki mashq bir necha ekranga bo'linadi. Ekran
nomlari mavzuga moslashadi, pedagogik ketma-ketlik esa saqlanadi.

## 2. Har ekranning minimal kontrakti

Har ekranda quyidagilar bo'lishi shart:

- bitta aniq o'quv maqsadi;
- UZ va RU matnlarining mazmuniy tengligi;
- ekrandagi ko'rsatmadan kengroq, TTS-toza audio;
- o'quvchi bajaradigan kuzatiladigan harakat;
- to'g'ri javob uchun sababli izoh;
- noto'g'ri javob uchun aynan xatoga mos ishora;
- davom etishdan oldin topshiriq bajarilganini tekshiruvchi holat.

Faqat “To'g'ri!” yoki “Yana urinib ko'ring” yetarli emas. Fikr-mulohaza
qaysi matematik belgiga qarash kerakligini aytadi, javobni darhol bermaydi.

## 3. Metodik me'yorlar

- Avval konkret model, keyin tasvir, so'ng matematik yozuv.
- Qoida o'quvchi kamida bitta qonuniyatni kuzatganidan keyin beriladi.
- Bir ekranda faqat bitta yangi aqliy qadam.
- Misollar osondan murakkabga: to'g'ridan-to'g'ri → tuzoqli → transfer.
- Nol qatnashgan holat, chegara holati va tipik xato alohida ko'riladi.
- Yangi tushuncha eski tushunchadan farqlanadi; faqat ta'rif berilmaydi.
- 3-sinf o'quvchisi uchun matn qisqa, ovoz esa yo'l ko'rsatuvchi asosiy kanal.
- O'quvchi kamida 60 foiz ekranlarda faol qaror qiladi.
- Yakuniy diagnostika darsdagi ayni son yoki rasmni takrorlamaydi.

## 4. Til va ohang

- O'zbekcha lotin yozuvida va `siz` shaklida.
- Ruscha `ты` shaklida, bolaga do'stona.
- Sonlar audio matnida imkon qadar so'z bilan aytiladi.
- Belgilar TTS uchun ma'nosi bilan o'qiladi: `×` — “ko'paytirish”,
  `:` — “bo'lish”, `>` — “katta”.
- UZ va RU versiyalarida javob, birlik, ismlar va matematik mazmun bir xil.
- Syujet ismlari faqat canon: Bit, Ra'no, Anvar, Zuhra, Jasur.

## 5. Syujet kontrakti

Har dars `SYUJET_3SINF.md`dagi kirish va chiqish holatiga mos keladi:

- muammo dars boshida ko'rinadi;
- matematika muammoni yechishning haqiqiy vositasi bo'ladi;
- FactCard hududning tasdiqlangan fan-faktiga mos bo'ladi;
- yakunda ayni to'siq yechilgani ko'rsatiladi;
- keyingi darsga bir jumlalik tabiiy ko'prik beriladi.

Syujet matematik topshiriq ustiga yopishtirilmaydi. Agar rekvizitni olib
tashlaganda topshiriq o'zgarmasa, syujet integratsiyasi yetarli emas.

## 6. Amaliyot kontrakti

Har nazariy darsga 10 topshiriqli amaliyot banki biriktiriladi:

1. tanish va eslash;
2. tayanch bilan sodda qo'llash;
3. boshqa ko'rinishda qo'llash;
4. hisoblash yoki qurish;
5. yetishmayotgan qismni topish;
6. matnli masala;
7. moslashtirish yoki tartiblash;
8. nol/chegara/tuzoq holati;
9. xatoni topish;
10. transfer yoki tushuntirish.

Kamida uch xil interaksiya turi ishlatiladi. Bir xil sonlar ketma-ket
topshiriqlarda qaytarilmaydi. Har topshiriqning xato javoblari tasodifiy emas,
aniq noto'g'ri strategiyani ifodalaydi.

## 7. Qabul qilish mezoni

Dars tayyor deb hisoblanishi uchun:

- barcha nazariy ekranlar ochiladi va `SCREEN_META` bilan soni mos keladi;
- UZ/RU almashtirish har ekranda ishlaydi;
- ovoz o'chirilganda darsni to'liq o'tish mumkin;
- audio yoqilganda ko'rsatma tugamasdan javob berish bloklanadi;
- noto'g'ri javobdan keyin tuzatib, davom etish mumkin;
- mobil va desktopda asosiy boshqaruvlar ko'rinadi;
- konsolda runtime xato yo'q;
- yakuniy ekran natijani saqlaydi va darsni yopadi;
- amaliyot bo'lsa, 10/10 topshiriq ochiladi va tekshiriladi;
- mavzu, dars raqami va tavsif `src/lessons/grade3.js` bilan mos.

## 8. Etalondan ongli farq

Mavzu talab qilsa interaksiya yoki vizual model o'zgarishi mumkin. Bunday
farq pedagogik sabab bilan izohlanadi; infratuzilma, til, audio, accessibility
va diagnostika talablari esa saqlanadi.
