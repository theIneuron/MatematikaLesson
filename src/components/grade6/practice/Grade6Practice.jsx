import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../../grade5/practice/PracticeHost.jsx';
import { GRADE6_PRACTICE_16_26 } from './Grade6PracticeData16_26.js';
import { GRADE6_PRACTICE_27_46, ruPracticeValue27 } from './Grade6PracticeData27_46.js';
import { RU_PROMPTS, RU_RULES, RU_TITLES, ruText } from './Grade6PracticeRu.js';

const yn = (prompt, answer) => ({ type: 'bool', prompt, options: ["Ha", "Yo'q"], answer: answer ? "Ha" : "Yo'q" });
const mc = (prompt, options, answer) => ({ type: 'choice', prompt, options, answer });
const mt = (prompt, left, right, pairs) => ({ type: 'match', prompt, left, right, pairs });
const input = (prompt, answer) => ({ type: 'input', prompt, answer: String(answer) });

const LESSONS = {
  1: {
    title: "Dars 1 amaliyoti. Bo'luvchilar va karrali sonlar",
    items: [
      mc("36 sonining bo'luvchisini toping.", ['5', '7', '9', '11'], '9'),
      input("64 sonining natural bo'luvchilari nechta? Javobni raqam bilan yozing.", 7),
      mt("Ifodalarni javoblari bilan moslashtiring.", ['12 : 3', '15 : 5', '14 : 7'], ['2', '3', '4'], [2, 1, 0]),
      mc("7 ga karrali sonni toping.", ['32', '35', '38', '41'], '35'),
      yn("54 soni 6 ga karrali.", true),
      mt("Har bir sonni mos bo'luvchisi bilan bog'lang.", ['24', '35', '42'], ['6', '7', '8'], [2, 1, 0]),
      mc("45 sonining barcha bo'luvchilari berilgan qatorni toping.", ['1, 3, 5, 9, 15, 45', '1, 3, 5, 15, 45', '1, 5, 9, 45', '3, 5, 9, 15'], '1, 3, 5, 9, 15, 45'),
      input("11 sonining sakkizinchi karralisini hisoblang va javobni yozing.", 88),
      mt("Tavsiflarni mos sonlar bilan bog'lang.", ['5 ning 6-karralisi', '8 ning 4-karralisi', '9 ning 5-karralisi'], ['30', '32', '45'], [0, 1, 2]),
      mc("4 va 6 ga bir vaqtda karrali sonni toping.", ['18', '24', '30', '42'], '24'),
    ],
  },
  2: {
    title: "Dars 2 amaliyoti. 2, 5 va 10 ga bo'linish alomatlari",
    items: [
      mc("2 ga bo'linadigan sonni toping.", ['315', '428', '537', '641'], '428'),
      input("2, 5 va 10 ga bir vaqtda bo'linadigan eng kichik uch xonali sonni yozing.", 100),
      mt("Sonlarni mos bo'linish xususiyati bilan bog'lang.", ['246', '375', '920'], ['faqat 2 ga', 'faqat 5 ga', '2, 5 va 10 ga'], [0, 1, 2]),
      mc("10 ga bo'linadigan sonni toping.", ['405', '430', '522', '615'], '430'),
      yn("785 soni 2 ga bo'linadi.", false),
      mt("Sonlarni ularning oxirgi raqami bilan moslashtiring.", ['618', '745', '830'], ['0', '5', '8'], [2, 1, 0]),
      mc("Bir vaqtda 2 va 5 ga bo'linadigan sonni toping.", ['340', '455', '612', '735'], '340'),
      input("481□ soni 10 ga bo'linishi uchun katakka yoziladigan raqamni kiriting.", 0),
      mt("Sonlarni mos tavsif bilan bog'lang.", ['1260', '1275', '1284'], ['faqat 2 ga', 'faqat 5 ga', '2, 5 va 10 ga'], [2, 1, 0]),
      mc("47□ soni 10 ga bo'linishi uchun katakka qaysi raqam yoziladi?", ['0', '2', '5', '8'], '0'),
    ],
  },
  3: {
    title: "Dars 3 amaliyoti. 3 va 9 ga bo'linish alomatlari",
    items: [
      mc("3 ga bo'linadigan sonni toping.", ['124', '231', '415', '502'], '231'),
      input("357 sonining raqamlari yig'indisini hisoblab, javobni yozing.", 15),
      mt("Sonlarni raqamlari yig'indisi bilan moslashtiring.", ['234', '516', '729'], ['9', '12', '18'], [0, 1, 2]),
      mc("9 ga bo'linadigan sonni toping.", ['316', '423', '527', '614'], '423'),
      yn("642 sonining raqamlari yig'indisini tekshiring: bu son 3 ga bo'linadi, ammo 9 ga bo'linmaydi, degan fikr to'g'rimi?", true),
      mt("Har bir sonning raqamlari yig'indisini tekshiring va uni 3 hamda 9 ga bo'linishiga mos tavsif bilan bog'lang.", ['312', '432', '715'], ['faqat 3 ga', '3 va 9 ga', "3 ga ham bo'linmaydi"], [0, 1, 2]),
      mc("52□ soni 9 ga bo'linishi uchun katakka qaysi raqam yoziladi?", ['1', '2', '4', '7'], '2'),
      input("47□ soni 9 ga bo'linishi uchun katakka yoziladigan raqamni kiriting.", 7),
      mt("Kataklarga mos raqamlarni toping.", ['4□2 soni 9 ga bo‘linadi', '71□ soni 9 ga bo‘linadi', '8□1 soni 9 ga bo‘linadi'], ['1', '3', '0'], [1, 0, 2]),
      mc("3 ga bo'linadigan, lekin 9 ga bo'linmaydigan sonni toping.", ['318', '441', '612', '729'], '318'),
    ],
  },
  4: {
    title: "Dars 4 amaliyoti. Tub va murakkab sonlar",
    items: [
      mc("Tub sonni toping.", ['11', '15', '21', '27'], '11'),
      input("37 tub sonining natural bo'luvchilari sonini yozing.", 2),
      mt("Sonlarni mos tur bilan bog'lang.", ['13', '18', '1'], ['tub son', 'murakkab son', 'tub ham, murakkab ham emas'], [0, 1, 2]),
      mc("Murakkab sonni toping.", ['17', '19', '25', '29'], '25'),
      yn("2 soni eng kichik tub sondir.", true),
      mt("Sonlarni tub ko'paytuvchilarga yoyilmasi bilan moslashtiring.", ['20', '42', '75'], ['2² × 5', '2 × 3 × 7', '3 × 5²'], [0, 1, 2]),
      mc("Qaysi tenglik tub ko'paytuvchilarga to'g'ri ajratilgan?", ['44 = 2² × 11', '44 = 4 × 11', '44 = 2 × 22', '44 = 2³ × 5'], '44 = 2² × 11'),
      input("91 sonining eng kichik tub bo'luvchisini topib yozing.", 7),
      mt("84, 90 va 126 sonlarini tub ko'paytuvchilarga ajrating, so'ng har bir sonni o'zining to'liq yoyilmasi bilan moslashtiring.", ['84', '90', '126'], ['2² × 3 × 7', '2 × 3² × 5', '2 × 3² × 7'], [0, 1, 2]),
      mc("2 × 2 × 3 × 5 ko'paytma qaysi songa teng?", ['30', '45', '60', '90'], '60'),
    ],
  },
  5: {
    title: "Dars 5 amaliyoti. Eng katta umumiy bo'luvchi",
    items: [
      mc("EKUB(12, 18) ni toping.", ['2', '3', '6', '9'], '6'),
      input("21 va 49 sonlarining EKUBini hisoblab yozing.", 7),
      mt("Ifodalarni qiymatlari bilan moslashtiring.", ['EKUB(8, 12)', 'EKUB(15, 25)', 'EKUB(18, 30)'], ['4', '5', '6'], [0, 1, 2]),
      mc("20 va 30 ning eng katta umumiy bo'luvchisini toping.", ['5', '10', '15', '20'], '10'),
      yn("EKUB(14, 21) = 7.", true),
      mt("Sonlar juftini EKUB qiymati bilan bog'lang.", ['24 va 36', '28 va 42', '45 va 60'], ['12', '14', '15'], [0, 1, 2]),
      mc("48 va 72 ning eng katta umumiy bo'luvchisini toping.", ['8', '12', '18', '24'], '24'),
      input("64 va 96 sonlarining EKUBini hisoblab yozing.", 32),
      mt("Sonlar juftini EKUBi bilan moslashtiring.", ['32 va 56', '27 va 63', '50 va 80'], ['8', '9', '10'], [0, 1, 2]),
      mc("36 ta qizil va 48 ta ko'k kartani bir xil tarkibli eng ko'p guruhlarga ajratsak, nechta guruh hosil bo'ladi?", ['6', '8', '12', '16'], '12'),
    ],
  },
  6: {
    title: "Dars 6 amaliyoti. Eng kichik umumiy karrali",
    items: [
      mc("EKUK(4, 6) ni toping.", ['8', '10', '12', '24'], '12'),
      input("7 va 9 sonlarining EKUKini hisoblab yozing.", 63),
      mt("Har bir sonlar juftining eng kichik umumiy karralisini hisoblang va EKUK ifodasini mos qiymat bilan bog'lang.", ['EKUK(3, 5)', 'EKUK(4, 10)', 'EKUK(6, 9)'], ['15', '18', '20'], [0, 2, 1]),
      mc("8 va 12 ning eng kichik umumiy karralisini toping.", ['16', '20', '24', '48'], '24'),
      yn("EKUK(10, 15) = 30.", true),
      mt("Sonlar juftini EKUK qiymati bilan bog'lang.", ['6 va 14', '9 va 12', '15 va 20'], ['36', '42', '60'], [1, 0, 2]),
      mc("18 va 24 ning eng kichik umumiy karralisini toping.", ['36', '48', '72', '96'], '72'),
      input("16 va 18 sonlarining EKUKini hisoblab yozing.", 144),
      mt("Sonlar juftini EKUKi bilan moslashtiring.", ['8 va 15', '14 va 25', '16 va 21'], ['120', '336', '350'], [0, 2, 1]),
      mc("Bir chiroq har 8 soniyada, ikkinchisi har 12 soniyada yonadi. Ular necha soniyadan keyin yana birga yonadi?", ['16', '20', '24', '32'], '24'),
    ],
  },
  7: {
    title: "Dars 7 amaliyoti. Kasrning asosiy xossasi",
    items: [
      mc("2/5 kasrining surat va maxrajini 3 ga ko'paytirsak, qaysi teng kasr hosil bo'ladi?", ['5/8', '6/15', '6/5', '2/15'], '6/15'),
      input("?/28 = 3/7 tenglik to'g'ri bo'lishi uchun noma'lum suratni topib yozing.", 12),
      mt("Har bir kasrni unga teng kasr bilan moslashtiring.", ['1/3', '2/7', '4/5'], ['3/9', '6/21', '12/15'], [0, 1, 2]),
      mc("5/8 kasrini 3 marta kengaytirganda hosil bo'ladigan kasrni toping.", ['8/11', '10/16', '15/24', '15/8'], '15/24'),
      yn("7/9 va 21/27 kasrlari o'zaro teng.", true),
      mt("Kasrlarni ularning qisqartirilgan ko'rinishi bilan bog'lang.", ['8/12', '15/25', '18/24'], ['2/3', '3/5', '3/4'], [0, 1, 2]),
      mc("Quyidagi kasrlardan qaysi biri 4/7 ga teng emas?", ['8/14', '12/21', '16/28', '20/32'], '20/32'),
      input("25/? = 5/6 tenglik to'g'ri bo'lishi uchun noma'lum maxrajni topib yozing.", 30),
      mt("Kengaytirish amalini uning natijasi bilan moslashtiring.", ['3/8 ni 2 ga kengaytirish', '5/11 ni 3 ga kengaytirish', '7/12 ni 4 ga kengaytirish'], ['6/16', '15/33', '28/48'], [0, 1, 2]),
      mc("35/49 kasrini eng sodda ko'rinishgacha qisqartiring.", ['5/7', '7/9', '10/21', '30/49'], '5/7'),
    ],
  },
  8: {
    title: "Dars 8 amaliyoti. Kasrlarni qisqartirish",
    items: [
      mc("18/24 kasrini eng sodda ko'rinishgacha qisqartiring.", ['2/3', '3/4', '4/5', '9/10'], '3/4'),
      input("42/56 kasrining surat va maxraji uchun EKUBni topib yozing.", 14),
      mt("Har bir kasrni uning qisqarmas ko'rinishi bilan moslashtiring.", ['12/18', '20/35', '27/45'], ['2/3', '4/7', '3/5'], [0, 1, 2]),
      mc("Qaysi kasr allaqachon qisqarmas ko'rinishda yozilgan?", ['10/16', '14/21', '8/15', '18/27'], '8/15'),
      yn("14/25 kasri qisqarmas kasr hisoblanadi.", true),
      mt("Kasrlarni eng sodda ko'rinishi bilan bog'lang.", ['22/44', '39/52', '45/63'], ['1/2', '3/4', '5/7'], [0, 1, 2]),
      mc("63/81 kasrini to'liq qisqartirganda qaysi kasr hosil bo'ladi?", ['6/8', '7/9', '9/11', '20/27'], '7/9'),
      input("?/55 kasri qisqartirilganda 3/5 hosil bo'lsa, noma'lum suratni yozing.", 33),
      mt("Har bir kasrni surat va maxrajining EKUBi bilan moslashtiring.", ['28/42', '36/60', '44/77'], ['11', '12', '14'], [2, 1, 0]),
      mc("88/120 kasrini eng sodda ko'rinishgacha qisqartiring.", ['8/11', '11/15', '22/30', '44/60'], '11/15'),
    ],
  },
  9: {
    title: "Dars 9 amaliyoti. Kasrlarni umumiy maxrajga keltirish",
    items: [
      mc("1/6 va 1/8 kasrlari uchun eng kichik umumiy maxrajni toping.", ['14', '24', '36', '48'], '24'),
      input("5/12 kasrini maxraji 60 bo'lgan kasrga aylantirish uchun surat va maxraj nechaga ko'paytiriladi?", 5),
      mt("Kasrlar juftini eng kichik umumiy maxraji bilan moslashtiring.", ['1/4 va 1/10', '1/9 va 1/15', '1/14 va 1/21'], ['20', '42', '45'], [0, 2, 1]),
      mc("3/7 kasrini maxraji 35 bo'lgan teng kasr ko'rinishida yozing.", ['9/35', '12/35', '15/35', '21/35'], '15/35'),
      yn("2/3 va 5/6 kasrlarini 4/6 va 5/6 ko'rinishida umumiy maxrajga keltirish mumkin.", true),
      mt("Kasrlarni maxraji 72 bo'lgan teng kasr bilan bog'lang.", ['5/8', '7/9', '11/12'], ['45/72', '56/72', '66/72'], [0, 1, 2]),
      mc("7/18 va 5/24 kasrlarining eng kichik umumiy maxrajini toping.", ['36', '48', '72', '144'], '72'),
      input("11/15 kasrini maxraji 105 bo'lgan kasrga keltirish uchun qo'shimcha ko'paytuvchini yozing.", 7),
      mt("Har bir juftni to'g'ri umumiy maxrajdagi yozuvi bilan moslashtiring.", ['2/5 va 3/8', '5/6 va 7/10', '3/4 va 5/9'], ['16/40 va 15/40', '25/30 va 21/30', '27/36 va 20/36'], [0, 1, 2]),
      mc("5/16 va 7/20 kasrlari eng kichik umumiy maxrajga to'g'ri keltirilgan qatorni toping.", ['20/80 va 28/80', '25/80 va 28/80', '25/40 va 14/40', '10/32 va 14/40'], '25/80 va 28/80'),
    ],
  },
  10: {
    title: "Dars 10 amaliyoti. Har xil maxrajli kasrlarni qo'shish va ayirish",
    items: [
      mc("1/3 + 1/4 yig'indini hisoblab, qisqarmas javobni toping.", ['2/7', '5/12', '7/12', '8/12'], '7/12'),
      input("7/10 − 1/6 ayirma natijasining suratini yozing.", 8),
      mt("Har bir amalni uning natijasi bilan moslashtiring.", ['1/2 + 1/5', '5/6 − 1/3', '3/8 + 1/4'], ['7/10', '1/2', '5/8'], [0, 1, 2]),
      mc("5/12 + 7/18 yig'indini hisoblang.", ['12/30', '29/36', '31/36', '35/36'], '29/36'),
      yn("3/5 − 1/10 ayirmaning qiymati 1/2 ga teng.", true),
      mt("Amallarni to'g'ri javoblari bilan bog'lang.", ['7/9 − 1/6', '3/10 + 5/12', '11/15 − 2/9'], ['11/18', '43/60', '23/45'], [0, 1, 2]),
      mc("5/8 + 7/20 yig'indini eng sodda ko'rinishda toping.", ['12/28', '19/20', '39/40', '47/40'], '39/40'),
      input("13/14 − 2/7 ayirma natijasining suratini yozing.", 9),
      mt("Har bir ifodani uning qisqarmas natijasi bilan moslashtiring.", ['1/6 + 5/9', '7/8 − 3/10', '4/15 + 7/12'], ['13/18', '23/40', '17/20'], [0, 1, 2]),
      mc("3/4 + 5/12 − 1/6 ifodaning qiymatini toping.", ['5/6', '11/12', '1', '7/6'], '1'),
    ],
  },
  11: {
    title: "Dars 11 amaliyoti. Oddiy kasrlarni ko'paytirish",
    items: [
      mc("2/3 va 5/8 kasrlarini ko'paytiring. Suratlarni va maxrajlarni alohida ko'paytirib, natijani eng sodda ko'rinishda tanlang.", ['5/12', '7/11', '10/11', '5/8'], '5/12'),
      input("7/10 × 5/14 ko'paytmani oldindan qisqartirib hisoblang. Hosil bo'lgan qisqarmas kasrning suratini yozing.", 1),
      mt("Chap ustundagi har bir ko'paytmani hisoblang va uni o'ng ustundagi qisqarmas javobi bilan moslashtiring.", ['3/5 × 10/21', '4/9 × 3/8', '7/12 × 6/35'], ['1/10', '1/6', '2/7'], [2, 1, 0]),
      mc("6 × 5/18 ifodada butun sonni kasrga ko'paytiring va javobni qisqartirilgan kasr ko'rinishida toping.", ['5/3', '5/12', '11/18', '30/18'], '5/3'),
      yn("8/15 × 5/12 ko'paytmaning qisqarmas qiymati 2/9 ga teng, degan fikrni hisoblash orqali tekshiring.", true),
      mt("Har bir sonning berilgan kasr qismini hisoblang va hosil bo'lgan natijalar bilan to'g'ri juftlang.", ['24 ning 5/8 qismi', '36 ning 7/9 qismi', '40 ning 3/5 qismi'], ['15', '24', '28'], [0, 2, 1]),
      mc("9/14 × 7/15 ko'paytmada diagonal sonlarni oldindan qisqartiring va eng sodda natijani tanlang.", ['3/10', '7/30', '9/22', '63/210'], '3/10'),
      input("11/18 × 9/22 ko'paytmani qisqartirib hisoblang. Natijadagi kasrning maxrajini yozing.", 4),
      mt("Ko'paytirishdan oldin qisqartiriladigan sonlar juftini shu amalning qisqarmas natijasi bilan moslashtiring.", ['4/15 × 9/14', '14/25 × 5/21', '9/16 × 4/27'], ['1/12', '2/15', '6/35'], [2, 1, 0]),
      mc("Omborda 48 kilogramm guruch bor. Uning 5/6 qismi paketlarga joylandi. Paketlangan guruch massasini toping.", ['36 kg', '38 kg', '40 kg', '42 kg'], '40 kg'),
    ],
  },
  12: {
    title: "Dars 12 amaliyoti. Oddiy kasrlarni bo'lish",
    items: [
      mc("3/5 kasrni 2/7 kasrga bo'ling. Bo'lishni ikkinchi kasrning teskarisiga ko'paytirish bilan almashtirib, javobni tanlang.", ['21/10', '6/35', '10/21', '5/6'], '21/10'),
      input("7/12 : 14/15 ifodani teskari kasrga ko'paytirib hisoblang. Qisqarmas natijaning suratini yozing.", 5),
      mt("Har bir bo'lish amalini teskari kasr yordamida hisoblang va o'ng ustundagi javobi bilan moslashtiring.", ['4/9 : 2/3', '5/8 : 25/12', '7/10 : 21/25'], ['2/3', '3/10', '5/6'], [0, 1, 2]),
      mc("5 sonini 3/4 kasrga bo'lganda qanday natija hosil bo'lishini toping. Butun sonni maxraji 1 bo'lgan kasr sifatida qarang.", ['15/4', '20/3', '8/5', '5/4'], '20/3'),
      yn("9/14 : 3/7 bo'lish amalining natijasi 3/2 ga teng, degan fikrni teskari kasr bilan tekshiring.", true),
      mt("Chapdagi bo'lish amallarini avval ko'paytirish ko'rinishiga keltiring, so'ng mos qisqarmas javobni tanlang.", ['2/11 : 4/33', '7/12 : 14/9', '15/16 : 9/8'], ['3/8', '3/2', '5/6'], [1, 0, 2]),
      mc("11/18 : 22/27 ifodada ikkinchi kasrni teskarisiga aylantiring, sonlarni qisqartiring va natijani toping.", ['3/4', '4/3', '11/15', '33/40'], '3/4'),
      input("8/21 : 4/7 bo'lish amalini hisoblang. Qisqarmas javobning maxrajini yozing.", 3),
      mt("Har bir butun son va kasr ishtirokidagi bo'lish amalini uning to'g'ri natijasi bilan juftlang.", ['6 : 9/10', '5/12 : 5', '7/8 : 14'], ['1/16', '1/12', '20/3'], [2, 1, 0]),
      mc("3/4 litr sharbat 1/8 litrlik teng stakanlarga quyildi. Barcha sharbat uchun nechta stakan kerak bo'lishini toping.", ['4 ta', '5 ta', '6 ta', '8 ta'], '6 ta'),
    ],
  },
  13: {
    title: "Dars 13 amaliyoti. O'zaro teskari sonlar va sonni qismiga ko'ra topish",
    items: [
      mc("7/11 kasriga o'zaro teskari kasrni toping. Tekshirish uchun ikkala kasrning ko'paytmasi 1 bo'lishini hisobga oling.", ['7/11', '11/7', '4/11', '11/18'], '11/7'),
      input("9/13 kasriga teskari kasrning suratini aniqlang va faqat shu sonni yozing.", 13),
      mt("Chap ustundagi har bir sonni ko'paytmasi 1 bo'ladigan o'zaro teskari son bilan moslashtiring.", ['5/12', '8/3', '7'], ['1/7', '3/8', '12/5'], [2, 1, 0]),
      mc("Quyidagi juftliklardan qaysi biri o'zaro teskari sonlardan tashkil topganini ko'paytirib tekshiring.", ['4/9 va 9/4', '3/7 va 3/7', '5/8 va 8/3', '6 va 1/5'], '4/9 va 9/4'),
      yn("0 sonining o'zaro teskari soni mavjud, degan fikrni ko'paytma 1 bo'lishi sharti asosida tekshiring.", false),
      mt("Sonning ko'rsatilgan kasr qismi ma'lum. Har bir shartdan butun sonni topib, mos javob bilan bog'lang.", ['Sonning 2/5 qismi 14', 'Sonning 3/8 qismi 18', 'Sonning 5/6 qismi 35'], ['42', '48', '35'], [2, 1, 0]),
      mc("Bir sonning 3/8 qismi 21 ga teng. Avval bir qismini, keyin sakkiz qismini topib, noma'lum sonni aniqlang.", ['48', '54', '56', '63'], '56'),
      input("Noma'lum sonning 5/9 qismi 35 ga teng. Butun sonni hisoblab, javobni yozing.", 63),
      mt("Har bir tenglamada noma'lum butun sonni toping va o'ng ustundagi javob bilan moslashtiring.", ['x × 4/7 = 20', 'x × 5/12 = 25', 'x × 7/10 = 49'], ['60', '70', '35'], [2, 0, 1]),
      mc("Kutubxonadagi kitoblarning 4/9 qismi 32 ta ilmiy kitobdan iborat. Kutubxonada jami nechta kitob borligini toping.", ['64 ta', '68 ta', '72 ta', '81 ta'], '72 ta'),
    ],
  },
  14: {
    title: "Dars 14 amaliyoti. O'nli kasrlarni ko'paytirish va bo'lish",
    items: [
      mc("2,4 × 3,5 ko'paytmani hisoblang. Verguldan keyingi raqamlar sonini to'g'ri aniqlab, natijani tanlang.", ['7,4', '8,4', '8,9', '84'], '8,4'),
      input("7,2 : 0,6 bo'lish amalida bo'luvchi va bo'linuvchini 10 ga ko'paytirib hisoblang. Javobni yozing.", 12),
      mt("Chap ustundagi o'nli kasrlar bilan bajarilgan amallarni hisoblang va mos natija bilan bog'lang.", ['1,25 × 0,8', '4,2 : 1,4', '0,36 × 2,5'], ['0,9', '1', '3'], [1, 2, 0]),
      mc("6,37 sonini 100 ga ko'paytirganda vergul qaysi tomonga nechta xona siljishini o'ylab, natijani toping.", ['0,0637', '63,7', '637', '6370'], '637'),
      yn("8,4 : 100 amalining natijasi 0,084 ga teng, degan fikrni vergulni siljitish qoidasi bilan tekshiring.", true),
      mt("Har bir ifodada vergulni kerakli yo'nalishda siljiting va hosil bo'lgan son bilan moslashtiring.", ['5,73 × 10', '48,6 : 100', '0,927 × 1000'], ['0,486', '57,3', '927'], [1, 0, 2]),
      mc("0,48 × 0,25 ko'paytmani oddiy sonlar kabi hisoblab, vergulni to'g'ri qo'yilgan natijani tanlang.", ['0,012', '0,12', '1,2', '12'], '0,12'),
      input("15,75 : 2,5 bo'lish amalini hisoblang. O'nli javobni vergul yordamida yozing.", '6,3'),
      mt("O'nli kasrli amallarni hisoblang va har birini takrorlanmaydigan to'g'ri javobi bilan juftlang.", ['3,6 × 1,5', '9,24 : 2,2', '0,84 : 0,7'], ['1,2', '4,2', '5,4'], [2, 1, 0]),
      mc("Har biri 1,25 kilogramm bo'lgan 6 ta qopchadagi mahsulotning umumiy massasini hisoblang.", ['6,25 kg', '7,25 kg', '7,5 kg', '8,5 kg'], '7,5 kg'),
    ],
  },
  15: {
    title: "Dars 15 amaliyoti. Davriy o'nli kasrlar va yaxlitlash",
    items: [
      mc("Quyidagi yozuvlardan davriy o'nli kasrni toping. Qavs ichidagi raqamlar cheksiz takrorlanishini yodda tuting.", ['0,75', '1,2(4)', '3,125', '6,08'], '1,2(4)'),
      input("6,784 sonini o'ndan birlargacha yaxlitlang. Yuzdan birlar xonasidagi raqamga qarab javobni yozing.", '6,8'),
      mt("Oddiy kasrlarni o'nli yozuvlari bilan moslashtiring. Davriy qism qavs ichida berilganiga e'tibor qarating.", ['1/3', '2/9', '5/6'], ['0,(2)', '0,(3)', '0,8(3)'], [1, 0, 2]),
      mc("4,1(27) davriy o'nli kasrida cheksiz takrorlanadigan davrni aniqlang va to'g'ri javobni tanlang.", ['1', '2', '27', '127'], '27'),
      yn("0,125 soni davriy o'nli kasr, degan fikrni uning yozuvi tugashi yoki davom etishiga qarab tekshiring.", false),
      mt("Har bir sonni o'ndan birlargacha yaxlitlang va o'ng ustundagi mos qiymati bilan bog'lang.", ['3,24', '5,68', '9,95'], ['10,0', '3,2', '5,7'], [1, 2, 0]),
      mc("2,374 sonini yuzdan birlargacha yaxlitlang. Mingdan birlar xonasidagi raqam 4 ekanini hisobga oling.", ['2,3', '2,37', '2,38', '2,40'], '2,37'),
      input("7/9 = 0,(7) ekanidan foydalanib, bu sonni yuzdan birlargacha yaxlitlang va o'nli javobni yozing.", '0,78'),
      mt("Har bir o'nli yozuvni uning turini aniq ifodalovchi tavsif bilan moslashtiring.", ['2,45', '0,(18)', '3,7(2)'], ['Aralash davriy kasr', 'Sof davriy kasr', 'Tugaydigan o‘nli kasr'], [2, 1, 0]),
      mc("Harorat 18,67 °C deb o'lchandi. Uni o'ndan bir darajagacha yaxlitlab, termometrga yoziladigan qiymatni toping.", ['18,6 °C', '18,7 °C', '18,67 °C', '19,0 °C'], '18,7 °C'),
    ],
  },
  ...GRADE6_PRACTICE_16_26.lessons,
  ...GRADE6_PRACTICE_27_46.lessons,
};

const TOPICS = {
  1: ["Bo'luvchini aniqlash", "Bo'luvchilar soni", "Bo'lish natijalari", "Karrali sonni topish", "Karralilikni tekshirish", "Son va bo'luvchi", "Barcha bo'luvchilar", "Karralini hisoblash", "Karralilarni hisoblash", "Umumiy karrali"],
  2: ["Juft sonni aniqlash", "Eng kichik mos son", "Bo'linish xususiyatlari", "10 ga bo'linish belgisi", "Juft yoki toq son", "Oxirgi raqam", "2 va 5 ga bo'linish", "Katakdagi raqam", "Bir nechta bo'linish belgisi", "Noma'lum raqam"],
  3: ["3 ga bo'linish", "Raqamlar yig'indisi", "Raqamlar yig'indisi", "9 ga bo'linadigan son", "3 va 9 ni farqlash", "Bo'linish xususiyatlari", "Noma'lum raqam", "Katakdagi raqam", "Katakdagi raqam", "Faqat 3 ga bo'linish"],
  4: ["Tub sonni aniqlash", "Bo'luvchilar soni", "Sonlarning turlari", "Murakkab sonni aniqlash", "Eng kichik tub son", "Tub ko'paytuvchilar", "Yoyilmani tekshirish", "Tub bo'luvchini topish", "Yoyilmalarni moslashtirish", "Ko'paytmani hisoblash"],
  5: ["EKUBni hisoblash", "21 va 49 ning EKUBi", "EKUB qiymatlari", "Eng katta bo'luvchi", "EKUB tengligini tekshirish", "Juftlar EKUBi", "48 va 72 ning EKUBi", "64 va 96 ning EKUBi", "EKUBlarni moslashtirish", "Teng guruhlarga ajratish"],
  6: ["EKUKni hisoblash", "7 va 9 ning EKUKi", "EKUK qiymatlari", "8 va 12 ning EKUKi", "EKUK tengligini tekshirish", "Juftlar EKUKi", "18 va 24 ning EKUKi", "16 va 18 ning EKUKi", "EKUKlarni moslashtirish", "Takroriy hodisalar"],
  7: ["Kasrni kengaytirish", "Noma'lum surat", "Teng kasrlar", "Kasrni uch marta kengaytirish", "Tenglikni tekshirish", "Kasrlarni qisqartirish", "Teng bo'lmagan kasr", "Noma'lum maxraj", "Kengaytirish natijalari", "Kasrni to'liq qisqartirish"],
  8: ["Kasrni to'liq qisqartirish", "EKUBni aniqlash", "Qisqarmas ko'rinishlar", "Qisqarmas kasr", "Qisqarmaslikni tekshirish", "Sodda ko'rinishlar", "To'liq qisqartirish", "Noma'lum surat", "Kasrlar EKUBi", "Bir qadamda qisqartirish"],
  9: ["Umumiy maxraj", "Qo'shimcha ko'paytuvchi", "Eng kichik umumiy maxraj", "Teng kasr hosil qilish", "Umumiy maxrajni tekshirish", "72 maxrajiga keltirish", "EKUK orqali maxraj", "Qo'shimcha ko'paytuvchi", "Juftlarni umumiy maxrajga keltirish", "Eng kichik umumiy maxraj"],
  10: ["Kasrlarni qo'shish", "Kasrlarni ayirish", "Amal va natija", "Yig'indini hisoblash", "Ayirmani tekshirish", "Amallarni moslashtirish", "Yig'indini qisqartirish", "Ayirma surati", "Murakkabroq amallar", "Uch kasrli ifoda"],
  11: ["Kasrlar ko'paytmasi", "Natijaning surati", "Ko'paytmalarni moslashtirish", "Butun son va kasr", "Ko'paytmani tekshirish", "Sonning kasr qismi", "Oldindan qisqartirish", "Natijaning maxraji", "Qisqartirib ko'paytirish", "Kasr qismli masala"],
  12: ["Kasrlarni bo'lish", "Natijaning surati", "Bo'linmalarni moslashtirish", "Butun sonni kasrga bo'lish", "Bo'linmani tekshirish", "Teskari kasr usuli", "Oldindan qisqartirish", "Natijaning maxraji", "Butun sonli bo'lish", "Teng qismlarga bo'lish"],
  13: ["Teskari kasr", "Teskari kasrning surati", "O'zaro teskari sonlar", "Ko'paytmasi bir", "Nolning alohida holati", "Qismidan butunni topish", "Noma'lum son", "Kasr qismli tenglama", "Tenglamalarni moslashtirish", "Kitoblar sonini topish"],
  14: ["O'nli kasrlar ko'paytmasi", "O'nli kasrlarni bo'lish", "Amallarni moslashtirish", "100 ga ko'paytirish", "100 ga bo'lish", "Vergulni siljitish", "Ikki o'nli kasr ko'paytmasi", "O'nli javob", "Hisoblash natijalari", "Umumiy massani topish"],
  15: ["Davriy kasrni aniqlash", "O'ndan birgacha yaxlitlash", "Kasr va o'nli yozuv", "Kasrning davri", "Tugaydigan kasr", "Yaxlitlangan qiymatlar", "Yuzdan birgacha yaxlitlash", "Davriy kasrni yaxlitlash", "O'nli yozuvlarning turlari", "Haroratni yaxlitlash"],
  ...GRADE6_PRACTICE_16_26.topics,
  ...GRADE6_PRACTICE_27_46.topics,
};
const EXPLANATIONS = {
  1: [
    "36 : 9 = 4 va qoldiq yo'q. Shuning uchun 9 soni 36 ning bo'luvchisidir.",
    "64 = 2⁶. Uning bo'luvchilari 1, 2, 4, 8, 16, 32 va 64 — jami 7 ta.",
    "12 : 3 = 4, 15 : 5 = 3 va 14 : 7 = 2.",
    "35 = 7 × 5. Demak, 35 soni 7 ga karrali.",
    "54 : 6 = 9 va qoldiq yo'q, shuning uchun fikr to'g'ri.",
    "24 : 8 = 3, 35 : 7 = 5 va 42 : 6 = 7.",
    "45 ning bo'luvchilari: 1, 3, 5, 9, 15 va 45.",
    "11 ning sakkizinchi karralisi 11 × 8 = 88.",
    "5 × 6 = 30, 8 × 4 = 32 va 9 × 5 = 45.",
    "24 soni 4 ga ham, 6 ga ham qoldiqsiz bo'linadi.",
  ],
  2: [
    "428 ning oxirgi raqami 8. Juft raqam bilan tugagan son 2 ga bo'linadi.",
    "Eng kichik uch xonali son 100 bo'lib, u 2, 5 va 10 ga bo'linadi.",
    "246 faqat 2 ga, 375 faqat 5 ga, 920 esa 2, 5 va 10 ga bo'linadi.",
    "430 ning oxirgi raqami 0, shuning uchun u 10 ga bo'linadi.",
    "785 ning oxirgi raqami 5 — toq raqam. Shu sabab fikr noto'g'ri.",
    "618 ning oxirgi raqami 8, 745 niki 5, 830 niki 0.",
    "340 nol bilan tugaydi, demak u 2 va 5 ga bir vaqtda bo'linadi.",
    "10 ga bo'linadigan sonning oxirgi raqami 0 bo'lishi kerak.",
    "1260 uchalasiga, 1275 faqat 5 ga, 1284 esa faqat 2 ga bo'linadi.",
    "47□ soni 10 ga bo'linishi uchun oxirgi raqam 0 bo'lishi kerak.",
  ],
  3: [
    "231 raqamlari yig'indisi 2 + 3 + 1 = 6; 6 soni 3 ga bo'linadi.",
    "3 + 5 + 7 = 15.",
    "234 raqamlari yig'indisi 9, 516 niki 12, 729 niki 18.",
    "4 + 2 + 3 = 9. Shu sabab 423 soni 9 ga bo'linadi.",
    "6 + 4 + 2 = 12; 12 soni 3 ga bo'linadi, ammo 9 ga bo'linmaydi.",
    "312 faqat 3 ga, 432 soni 3 va 9 ga bo'linadi, 715 esa ikkalasiga ham bo'linmaydi.",
    "5 + 2 + 2 = 9. Demak, katakka 2 yoziladi.",
    "4 + 7 + 7 = 18; 18 soni 9 ga bo'linadi.",
    "4□2 uchun 3, 71□ uchun 1, 8□1 uchun 0 yozilsa raqamlar yig'indisi 9 ga karrali bo'ladi.",
    "3 + 1 + 8 = 12; u 3 ga bo'linadi, lekin 9 ga bo'linmaydi.",
  ],
  4: [
    "11 ning faqat 1 va 11 bo'luvchilari bor, shuning uchun u tub son.",
    "37 tub son; uning faqat 1 va 37 bo'luvchilari bor — jami 2 ta.",
    "13 tub, 18 murakkab, 1 esa tub ham, murakkab ham emas.",
    "25 = 5 × 5, demak u murakkab son.",
    "2 ning faqat 1 va 2 bo'luvchilari bor; u eng kichik tub sondir.",
    "20 = 2² × 5, 42 = 2 × 3 × 7, 75 = 3 × 5².",
    "44 = 4 × 11 = 2² × 11; yoyilmadagi barcha ko'paytuvchilar tub.",
    "91 = 7 × 13. Uning eng kichik tub bo'luvchisi 7.",
    "84 = 2² × 3 × 7, 90 = 2 × 3² × 5, 126 = 2 × 3² × 7.",
    "2 × 2 × 3 × 5 = 4 × 15 = 60.",
  ],
  5: [
    "12 va 18 ning umumiy bo'luvchilari 1, 2, 3, 6; eng kattasi 6.",
    "21 va 49 ning umumiy bo'luvchilari 1 va 7; EKUB 7.",
    "EKUB(8,12)=4, EKUB(15,25)=5, EKUB(18,30)=6.",
    "20 va 30 ni bo'ladigan eng katta son 10.",
    "14 va 21 ning eng katta umumiy bo'luvchisi 7, shuning uchun tenglik to'g'ri.",
    "EKUB(24,36)=12, EKUB(28,42)=14, EKUB(45,60)=15.",
    "48 va 72 ning eng katta umumiy bo'luvchisi 24.",
    "64 va 96 ning umumiy bo'luvchilari orasida eng kattasi 32.",
    "EKUB(32,56)=8, EKUB(27,63)=9, EKUB(50,80)=10.",
    "EKUB(36,48)=12, demak kartalarni eng ko'pi bilan 12 ta teng guruhga ajratamiz.",
  ],
  6: [
    "4 ning karralilari 4, 8, 12...; 6 niki 6, 12... Birinchi umumiy karrali 12.",
    "7 va 9 o'zaro tub: EKUK = 7 × 9 = 63.",
    "EKUK(3,5)=15, EKUK(4,10)=20, EKUK(6,9)=18.",
    "8 va 12 ning birinchi umumiy karralisi 24.",
    "10 va 15 ning eng kichik umumiy karralisi 30; fikr to'g'ri.",
    "EKUK(6,14)=42, EKUK(9,12)=36, EKUK(15,20)=60.",
    "18 va 24 ning eng kichik umumiy karralisi 72.",
    "16 = 2⁴, 18 = 2 × 3²; EKUK = 2⁴ × 3² = 144.",
    "EKUK(8,15)=120, EKUK(14,25)=350, EKUK(16,21)=336.",
    "EKUK(8,12)=24, shuning uchun chiroqlar 24 soniyadan keyin yana birga yonadi.",
  ],
  7: [
    "Surat va maxraj 3 ga ko'payadi: 2 × 3 = 6, 5 × 3 = 15. Natija 6/15.",
    "28 : 7 = 4, demak surat ham 3 × 4 = 12 bo'ladi.",
    "1/3 = 3/9, 2/7 = 6/21 va 4/5 = 12/15.",
    "5 × 3 = 15 va 8 × 3 = 24, shuning uchun 5/8 = 15/24.",
    "7 va 9 ni 3 ga ko'paytirsak 21 va 27 chiqadi; kasrlar teng.",
    "8/12 = 2/3, 15/25 = 3/5, 18/24 = 3/4.",
    "20/32 = 5/8; bu 4/7 ga teng emas. Qolganlari 4/7 ga qisqaradi.",
    "25/30 = 5/6, chunki surat va maxraj 5 ga bo'linadi.",
    "3/8→6/16, 5/11→15/33, 7/12→28/48.",
    "35 va 49 ni 7 ga bo'lamiz: 35/49 = 5/7.",
  ],
  8: [
    "18 va 24 ning EKUBi 6: 18 : 6 = 3, 24 : 6 = 4. Natija 3/4.",
    "42 va 56 ning eng katta umumiy bo'luvchisi 14.",
    "12/18 = 2/3, 20/35 = 4/7, 27/45 = 3/5.",
    "8 va 15 ning umumiy bo'luvchisi faqat 1; 8/15 qisqarmaydi.",
    "14 va 25 ning EKUBi 1, shuning uchun 14/25 qisqarmas kasr.",
    "22/44 = 1/2, 39/52 = 3/4, 45/63 = 5/7.",
    "63 va 81 ni 9 ga bo'lamiz: 63/81 = 7/9.",
    "33/55 ni 11 ga bo'lsak 3/5 hosil bo'ladi.",
    "EKUB(28,42)=14, EKUB(36,60)=12, EKUB(44,77)=11.",
    "88 va 120 ning EKUBi 8: 88/120 = 11/15.",
  ],
  9: [
    "EKUK(6,8)=24, demak eng kichik umumiy maxraj 24.",
    "12 × 5 = 60; shu sabab qo'shimcha ko'paytuvchi 5.",
    "EKUK(4,10)=20, EKUK(9,15)=45, EKUK(14,21)=42.",
    "7 × 5 = 35, surat ham 3 × 5 = 15: 3/7 = 15/35.",
    "2/3 ni 2 ga kengaytirsak 4/6; ikkinchi kasr 5/6 bo'lib qoladi.",
    "5/8=45/72, 7/9=56/72, 11/12=66/72.",
    "EKUK(18,24)=72, shuning uchun eng kichik umumiy maxraj 72.",
    "15 × 7 = 105; qo'shimcha ko'paytuvchi 7.",
    "Juftlar mos ravishda 40, 30 va 36 umumiy maxrajlariga keltirildi.",
    "EKUK(16,20)=80: 5/16=25/80 va 7/20=28/80.",
  ],
  10: [
    "1/3 = 4/12 va 1/4 = 3/12; 4/12 + 3/12 = 7/12.",
    "7/10 − 1/6 = 21/30 − 5/30 = 16/30 = 8/15. Surat 8.",
    "1/2+1/5=7/10, 5/6−1/3=1/2, 3/8+1/4=5/8.",
    "5/12=15/36 va 7/18=14/36; yig'indi 29/36.",
    "3/5 = 6/10; 6/10 − 1/10 = 5/10 = 1/2.",
    "Natijalar: 11/18, 43/60 va 23/45.",
    "5/8=25/40 va 7/20=14/40; yig'indi 39/40.",
    "13/14 − 2/7 = 13/14 − 4/14 = 9/14. Surat 9.",
    "Umumiy maxrajga keltirib hisoblasak 13/18, 23/40 va 17/20 chiqadi.",
    "3/4 + 5/12 − 1/6 = 9/12 + 5/12 − 2/12 = 12/12 = 1.",
  ],
  11: [
    "Suratlar: 2 × 5 = 10, maxrajlar: 3 × 8 = 24. 10/24 ni 2 ga qisqartirsak 5/12 hosil bo'ladi.",
    "7/10 × 5/14 da 7 bilan 14, 5 bilan 10 qisqaradi. Natija 1/4, uning surati 1.",
    "3/5 × 10/21 = 2/7, 4/9 × 3/8 = 1/6, 7/12 × 6/35 = 1/10.",
    "6 × 5/18 = 30/18. Surat va maxrajni 6 ga bo'lsak 5/3 hosil bo'ladi.",
    "8/15 × 5/12 da 5 bilan 15, 8 bilan 12 qisqaradi: 2/3 × 1/3 = 2/9.",
    "24 × 5/8 = 15, 36 × 7/9 = 28 va 40 × 3/5 = 24.",
    "9/14 × 7/15 da 7 bilan 14, 9 bilan 15 qisqaradi. Qolgan ko'paytma 3/10.",
    "11/18 × 9/22 = 1/4, chunki 11 bilan 22 va 9 bilan 18 oldindan qisqaradi. Maxraj 4.",
    "4/15 × 9/14 = 6/35, 14/25 × 5/21 = 2/15, 9/16 × 4/27 = 1/12.",
    "48 ning 5/6 qismini topamiz: 48 : 6 × 5 = 8 × 5 = 40 kilogramm.",
  ],
  12: [
    "3/5 : 2/7 = 3/5 × 7/2 = 21/10.",
    "7/12 : 14/15 = 7/12 × 15/14 = 5/8. Natijaning surati 5.",
    "4/9 : 2/3 = 2/3, 5/8 : 25/12 = 3/10, 7/10 : 21/25 = 5/6.",
    "5 : 3/4 = 5 × 4/3 = 20/3.",
    "9/14 : 3/7 = 9/14 × 7/3 = 3/2, shuning uchun fikr to'g'ri.",
    "2/11 : 4/33 = 3/2, 7/12 : 14/9 = 3/8, 15/16 : 9/8 = 5/6.",
    "11/18 : 22/27 = 11/18 × 27/22 = 3/4.",
    "8/21 : 4/7 = 8/21 × 7/4 = 2/3. Natijaning maxraji 3.",
    "6 : 9/10 = 20/3, 5/12 : 5 = 1/12, 7/8 : 14 = 1/16.",
    "Stakanlar soni 3/4 : 1/8 = 3/4 × 8 = 6 ga teng.",
  ],
  13: [
    "7/11 va 11/7 o'zaro teskari, chunki ularning ko'paytmasi 1 ga teng.",
    "9/13 kasrining surat va maxraji almashadi: teskari kasr 13/9. Uning surati 13.",
    "5/12 ga 12/5, 8/3 ga 3/8, 7 ga esa 1/7 o'zaro teskari.",
    "4/9 × 9/4 = 1. Shu sabab bu juftlik o'zaro teskari sonlardan tuzilgan.",
    "Nolni hech qanday songa ko'paytirib 1 hosil qilib bo'lmaydi. Demak, 0 ning teskari soni yo'q.",
    "14 : 2 × 5 = 35, 18 : 3 × 8 = 48, 35 : 5 × 6 = 42.",
    "Sonning 3/8 qismi 21 bo'lsa, butun son 21 : 3 × 8 = 56.",
    "Butun son 35 : 5 × 9 = 63 ga teng.",
    "20 : 4 × 7 = 35, 25 : 5 × 12 = 60, 49 : 7 × 10 = 70.",
    "Jami kitoblar soni 32 : 4 × 9 = 72 ta.",
  ],
  14: [
    "24 × 35 = 840. Ko'paytuvchilarda jami ikki kasr xonasi bor, shuning uchun natija 8,40 = 8,4.",
    "7,2 : 0,6 = 72 : 6 = 12.",
    "1,25 × 0,8 = 1; 4,2 : 1,4 = 3; 0,36 × 2,5 = 0,9.",
    "100 ga ko'paytirganda vergul ikki xona o'ngga siljiydi: 6,37 × 100 = 637.",
    "100 ga bo'lganda vergul ikki xona chapga siljiydi: 8,4 : 100 = 0,084.",
    "5,73 × 10 = 57,3; 48,6 : 100 = 0,486; 0,927 × 1000 = 927.",
    "48 × 25 = 1200. Jami to'rtta kasr xonasi ajratilsa 0,1200 = 0,12 chiqadi.",
    "15,75 : 2,5 = 157,5 : 25 = 6,3.",
    "3,6 × 1,5 = 5,4; 9,24 : 2,2 = 4,2; 0,84 : 0,7 = 1,2.",
    "Umumiy massa 1,25 × 6 = 7,50, ya'ni 7,5 kilogramm.",
  ],
  15: [
    "1,2(4) yozuvida 4 raqami cheksiz takrorlanadi. Shu sabab bu davriy o'nli kasr.",
    "6,784 ni o'ndan birlargacha yaxlitlashda keyingi raqam 8. U 5 dan katta, shuning uchun 6,8 chiqadi.",
    "1/3 = 0,(3), 2/9 = 0,(2), 5/6 = 0,8(3).",
    "4,1(27) yozuvida qavs ichidagi 27 raqamlar guruhi davr hisoblanadi.",
    "0,125 yozuvi uchta kasr xonasidan keyin tugaydi, shuning uchun u davriy emas.",
    "3,24 ≈ 3,2; 5,68 ≈ 5,7; 9,95 ≈ 10,0. Har safar yuzdan birlar raqamiga qaraladi.",
    "Yuzdan birlar xonasidan keyingi raqam 4 bo'lib, 5 dan kichik. Shuning uchun 2,374 ≈ 2,37.",
    "7/9 = 0,777... Yuzdan birlardan keyingi raqam 7 bo'lgani uchun 0,77 soni 0,78 gacha yaxlitlanadi.",
    "2,45 tugaydigan, 0,(18) sof davriy, 3,7(2) esa aralash davriy o'nli kasr.",
    "18,67 ni o'ndan birlargacha yaxlitlashda yuzdan birlar raqami 7. Demak, 18,6 soni 18,7 ga oshadi.",
  ],
  ...GRADE6_PRACTICE_16_26.explanations,
  ...GRADE6_PRACTICE_27_46.explanations,
};
const GUIDES = {
  choice: "Variantlarni shoshilmay taqqoslang. Har bir son yoki ifodani mavzu qoidasiga ko'ra tekshirib, faqat bitta to'g'ri javobni tanlang.",
  bool: "Quyidagi matematik fikrni qoida asosida tekshiring. Fikr har doim to'g'ri bo'lsa «Ha», xato bo'lsa «Yo'q» javobini tanlang.",
  match: "Chap ustundagi har bir karta uchun o'ng ustundan aynan bitta mos javob toping. Avval chapdagi kartani, so'ng unga mos o'ngdagi kartani bosing.",
  input: "Hisoblashni bosqichma-bosqich bajaring. Hosil bo'lgan sonli javobni pastdagi maydonga klaviatura yordamida kiriting.",
};
const RU_GUIDES = {
  choice: 'Сравните варианты и по правилу темы выберите только один правильный ответ.',
  bool: 'Проверьте математическое утверждение. Выберите «Да», если оно верно, и «Нет», если оно неверно.',
  match: 'Для каждой карточки слева найдите ровно одну пару справа. Сначала нажмите левую карточку, затем правую.',
  input: 'Выполните вычисления по шагам и введите числовой ответ с клавиатуры.',
};
const shuffle = (list) => {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const autoScrollBehavior = () => (
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
);

const afterLayout = (callback) => {
  let secondFrame;
  const firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(callback);
  });
  return () => {
    window.cancelAnimationFrame(firstFrame);
    if (secondFrame) window.cancelAnimationFrame(secondFrame);
  };
};

function MathText({ text }) {
  const source = String(text);
  const parts = [];
  const renderPlainText = (value, keyPrefix) => String(value).split(/([×·])/).map((part, index) => (
    part === '×' || part === '·'
      ? <span className="g6q-multiply-dot" aria-label="ko‘paytirish" key={`${keyPrefix}-multiply-${index}`}/>
      : part
  ));
  const fractionPattern = /(\?|\d+)\s*\/\s*(\d+)/g;
  let cursor = 0;
  let match;
  while ((match = fractionPattern.exec(source)) !== null) {
    if (match.index > cursor) parts.push(...renderPlainText(source.slice(cursor, match.index), `text-${cursor}`));
    parts.push(
      <span className="g6q-frac" key={`${match.index}-${match[0]}`} aria-label={`${match[2]} dan ${match[1]}`}>
        <span>{match[1]}</span><i/><span>{match[2]}</span>
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) parts.push(...renderPlainText(source.slice(cursor), `text-${cursor}`));
  return parts;
}

const parseNumericAnswer = (value) => Number(String(value).trim().replace(',', '.'));

function Question({ item, index, lesson, lang = 'uz', mode, onReady, registerCheck, onSubmit, playCorrect, playWrong }) {
  const locked = mode === 'review';
  const isRussian = lang === 'ru';
  const prompt = isRussian ? item.promptRu || RU_PROMPTS[lesson]?.[index] || item.prompt : item.prompt;
  const displayText = useCallback((value) => (
    isRussian ? lesson >= 27 ? ruPracticeValue27(ruText(value)) : ruText(value) : String(value)
  ), [isRussian, lesson]);
  const colors = ['#06b6d4', '#14b8a6'];
  const options = useMemo(() => shuffle(item.options || []), [item]);
  const right = useMemo(() => shuffle(item.right || []), [item]);
  const [answer, setAnswer] = useState(item.type === 'match' ? Array(item.left.length).fill(null) : item.type === 'input' ? '' : null);
  const [active, setActive] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const feedbackRef = useRef(null);
  const ready = item.type === 'match' ? answer.every(Boolean) : item.type === 'input' ? answer.trim() !== '' : answer !== null;

  useEffect(() => onReady?.(ready && !checked), [ready, checked, onReady]);
  const check = useCallback(() => {
    const ok = item.type === 'match'
      ? answer.every((v, i) => v === item.right[item.pairs[i]])
      : item.type === 'input' ? parseNumericAnswer(answer) === parseNumericAnswer(item.answer) : answer === item.answer;
    setChecked(true); setCorrect(ok);
    (ok ? playCorrect : playWrong)?.();
    onSubmit?.({ questionText: item.prompt, studentAnswer: answer, correctAnswer: item.answer || item.pairs, correct: ok, meta: { lesson, task: index + 1 } });
  }, [answer, index, item, lesson, onSubmit, playCorrect, playWrong]);
  useEffect(() => registerCheck?.(check), [check, registerCheck]);
  useEffect(() => {
    if (!checked) return;
    return afterLayout(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: autoScrollBehavior(),
        block: 'center',
        inline: 'nearest',
      });
    });
  }, [checked]);
  return <div className="g6q" style={{ '--c1': colors[0], '--c2': colors[1] }}>
    <style>{`
      .g6q{max-width:650px;margin:auto;padding:8px 4px 18px;color:#172033;background:#fff7ed;font-family:Manrope,system-ui,sans-serif}
      .g6q-bars{display:grid;grid-template-columns:1fr 1fr;gap:6px}.g6q-bars i{height:5px;border-radius:9px;background:#fb923c}.g6q-bars i+ i{background:#fb923c}
      .g6q-tag{margin-top:12px;color:#f97316;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.g6q h2{font-size:25px;line-height:1.3;margin:7px 0 8px}
      .g6q-heading{display:block}
      .g6q-frac{display:inline-grid;grid-template-rows:auto 2px auto;align-items:center;min-width:1.35em;margin:0 .12em;vertical-align:middle;text-align:center;font-family:Manrope,system-ui,sans-serif;font-weight:900;line-height:1}.g6q-frac>span{padding:.08em .18em}.g6q-frac>i{display:block;width:100%;height:2px;border-radius:2px;background:currentColor}
      .g6q-multiply-dot{display:inline-block;width:.38em;height:.38em;margin:0 .24em;border-radius:50%;background:currentColor;vertical-align:.12em;box-shadow:none}
      .g6q-explain{margin:0 0 18px;padding:11px 13px;border-left:4px solid var(--c1);border-radius:0 12px 12px 0;background:#fff;color:#526071;font-size:14px;font-weight:650;line-height:1.55}
      .g6q-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}.g6q button{font:800 17px inherit;color:#172033;cursor:pointer}
      .g6q-option{min-height:76px;padding:14px 16px;border:2.5px solid var(--c1);border-radius:17px;background:#fff;font-size:clamp(21px,3.5vw,28px)!important;font-weight:900!important;line-height:1.15;box-shadow:0 5px 0 color-mix(in srgb,var(--c1) 30%,white),0 9px 20px rgba(15,118,110,.08);transition:transform .15s,box-shadow .15s}.g6q-option:hover{transform:translateY(-2px)}.g6q-option.on{border-color:var(--c2);background:color-mix(in srgb,var(--c2) 16%,white);box-shadow:0 5px 0 color-mix(in srgb,var(--c2) 38%,white),0 0 0 3px color-mix(in srgb,var(--c2) 22%,transparent)}
      .g6q-option.right,.g6q-card.right{border-color:#22c55e!important;background:#dcfce7!important;box-shadow:0 0 0 3px #22c55e33!important;color:#166534}.g6q-option.wrong,.g6q-card.wrong{border-color:#ef4444!important;background:#fee2e2!important;box-shadow:0 0 0 3px #ef444433!important;color:#991b1b}
      .g6q-match{display:grid;grid-template-columns:minmax(0,1fr) 82px minmax(0,1fr);gap:8px;align-items:stretch}.g6q-col{display:grid;grid-template-rows:repeat(3,minmax(64px,1fr));gap:12px}.g6q-card{min-height:64px;padding:10px 12px;border:0;border-radius:12px;background:color-mix(in srgb,var(--c1) 18%,white);box-shadow:inset 0 0 0 2px var(--c1);font-size:clamp(20px,3.6vw,27px)!important;font-weight:900!important;line-height:1.12}.g6q-links+ .g6q-col .g6q-card{background:color-mix(in srgb,var(--c2) 18%,white);box-shadow:inset 0 0 0 2px var(--c2)}.g6q-card.on{box-shadow:inset 0 0 0 4px var(--c1)}.g6q-card.done{opacity:.82}
      .g6q-links{display:block;width:100%;height:100%;min-height:216px;overflow:visible}.g6q-link{fill:none;stroke:var(--c1);stroke-width:5;stroke-linecap:round;filter:drop-shadow(0 2px 2px rgba(6,182,212,.18))}.g6q-link.right{stroke:#22c55e}.g6q-link.wrong{stroke:#ef4444}
      .g6q-input-wrap{display:flex;justify-content:center;padding:12px}.g6q-input{width:min(100%,280px);height:82px;border:3px solid var(--c1);border-radius:17px;background:#fff;text-align:center;font:900 34px Manrope,system-ui,sans-serif;color:#172033;outline:none;box-shadow:0 6px 0 #a5f3fc}.g6q-input:focus{border-color:var(--c2);box-shadow:0 6px 0 #99f6e4}.g6q-input.right{border-color:#22c55e;background:#dcfce7;box-shadow:0 6px 0 #86efac}.g6q-input.wrong{border-color:#ef4444;background:#fee2e2;box-shadow:0 6px 0 #fca5a5}
      .g6q-feedback{margin-top:16px;padding:14px 16px;border:2px solid #f59e0b;border-radius:8px;background:#fef3c7;font-weight:800;color:#78350f;box-shadow:0 5px 0 #fcd34d;line-height:1.45;scroll-margin-block:16px 104px}.g6q-feedback strong{display:block;margin-bottom:4px;font-size:17px}.g6q-feedback-why{display:block;color:#713f12;font-size:14px}
      @media(max-width:520px){.g6q h2{font-size:20px;margin-bottom:7px}.g6q-explain{font-size:12px;line-height:1.4;margin-bottom:10px;padding:8px 10px}.g6q-options{gap:8px}.g6q-option{min-height:62px;padding:10px;font-size:20px!important}.g6q-match{grid-template-columns:minmax(0,1fr) 54px minmax(0,1fr);gap:4px}.g6q-col{grid-template-rows:repeat(3,minmax(58px,1fr));gap:8px}.g6q-card{font-size:19px!important;min-height:58px;padding:7px 5px}.g6q-links{min-height:190px}.g6q-link{stroke-width:4}}
    `}</style>
    <div className="g6q-bars"><i/><i/></div>
    <div className="g6q-tag">{isRussian ? item.topicRu || RU_TITLES[lesson] || TOPICS[lesson][index] : TOPICS[lesson][index]}</div>
    <div className="g6q-heading">
      <h2><MathText text={prompt}/></h2>
    </div>
    <p className="g6q-explain">{isRussian ? RU_GUIDES[item.type] : GUIDES[item.type]}</p>
    {item.type === 'input' ? <div className="g6q-input-wrap">
      <input className={`g6q-input ${checked ? correct ? 'right' : 'wrong' : ''}`} inputMode="decimal" value={answer} disabled={checked || locked} aria-label="Sonli javob"
        onChange={(event) => {
          const cleaned = event.target.value.replace(/[^\d,.-]/g, '').replace('.', ',');
          const sign = cleaned.startsWith('-') ? '-' : '';
          const unsigned = cleaned.replace(/-/g, '');
          const [whole, ...decimal] = unsigned.split(',');
          setAnswer(`${sign}${whole}${decimal.length ? `,${decimal.join('')}` : ''}`);
        }}/>
    </div> : item.type !== 'match' ? <div className="g6q-options">{options.map(x => {
      const resultClass = checked && answer === x ? (correct ? 'right' : 'wrong') : '';
      return <button type="button" className={`g6q-option ${answer === x ? 'on' : ''} ${resultClass}`} key={x} disabled={checked || locked} onClick={() => setAnswer(x)}><MathText text={displayText(x)}/></button>;
    })}</div> : <div className="g6q-match">
      <div className="g6q-col">{item.left.map((x, i) => {
        const resultClass = checked ? (answer[i] === item.right[item.pairs[i]] ? 'right' : 'wrong') : '';
        return <button type="button" className={`g6q-card ${active === i ? 'on' : ''} ${answer[i] ? 'done' : ''} ${resultClass}`} key={x} disabled={checked || locked} onClick={() => setActive(i)}><MathText text={displayText(x)}/></button>;
      })}</div>
      <svg className="g6q-links" viewBox="0 0 100 216" preserveAspectRatio="none" aria-hidden="true">
        {answer.map((selected, leftIndex) => {
          if (!selected) return null;
          const rightIndex = right.indexOf(selected);
          const y1 = 36 + leftIndex * 72;
          const y2 = 36 + rightIndex * 72;
          const state = checked ? (selected === item.right[item.pairs[leftIndex]] ? 'right' : 'wrong') : '';
          return <path className={`g6q-link ${state}`} d={`M0 ${y1} C34 ${y1}, 66 ${y2}, 100 ${y2}`} key={`${leftIndex}-${selected}`}/>;
        })}
      </svg>
      <div className="g6q-col">{right.map(x => {
        const linkedIndex = answer.indexOf(x);
        const resultClass = checked && linkedIndex >= 0 ? (x === item.right[item.pairs[linkedIndex]] ? 'right' : 'wrong') : '';
        return <button type="button" className={`g6q-card ${resultClass}`} key={x} disabled={checked || locked} onClick={() => { if (active !== null) { setAnswer(v => v.map((old, i) => i === active ? x : old === x ? null : old)); setActive(null); } }}><MathText text={displayText(x)}/></button>;
      })}</div>
    </div>}
    {checked && <div className="g6q-feedback" ref={feedbackRef}>{correct
      ? isRussian
        ? <><strong>✓ Верно!</strong><span className="g6q-feedback-why"><MathText text={item.explanationRu || `${item.type === 'match' ? 'Все пары найдены правильно. ' : `Правильный ответ: ${displayText(item.answer)}. `}${RU_RULES[lesson] || ''}`}/></span></>
        : <><strong>✓ To‘g‘ri!</strong><span className="g6q-feedback-why"><MathText text={EXPLANATIONS[lesson][index]}/></span></>
      : isRussian ? 'Ответ неверный. Вспомните правило и попробуйте ещё раз.' : "Javob noto'g'ri. Qoidani eslab, qayta urinib ko'ring."}</div>}
  </div>;
}

export default function Grade6Practice({ lesson }) {
  usePracticeZoom();
  const data = LESSONS[lesson];
  const [index, setIndex] = useState(0);
  const [lang, setLang] = useState('uz');
  const bodyRef = useRef(null);
  const item = data.items[index];
  const scrollBodyToTop = useCallback(() => afterLayout(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: autoScrollBehavior() });
  }), []);
  useEffect(() => {
    return scrollBodyToTop();
  }, [index, scrollBodyToTop]);
  const Q = useMemo(() => (props) => <Question {...props} item={item} index={index} lesson={lesson}/>, [index, item, lesson]);
  return <div className="g6-practice">
    <style>{`
      .g6-practice{position:fixed;inset:0;overflow:hidden;background:#fff7ed;display:flex;flex-direction:column;zoom:var(--pqz,1)}
      .g6-tabs{flex:none;display:grid;grid-template-columns:repeat(10,1fr);gap:5px;padding:48px 10px 7px;background:#fff7ed;border-bottom:1px solid #fed7aa}
      .g6-tabs button{padding:7px 3px;border:1.5px solid #fb923c;border-radius:999px;background:#fff;color:#9a3412;font-weight:800;cursor:pointer}.g6-tabs button.on{background:#ffedd5}
      .g6-body{flex:1;min-height:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:contain;scroll-behavior:smooth;scroll-padding-block:12px 104px;-webkit-overflow-scrolling:touch;scrollbar-gutter:stable}.g6-body>div{height:auto;min-height:100%!important;background:#fff7ed}.g6-body>div>div{background:#fff7ed!important}.g6-body>div>div:nth-child(2){min-height:0;overflow:visible;padding:7px 12px!important}.g6-body>div>div:last-child{padding:7px 12px!important;background:linear-gradient(transparent,#fff7ed 28%)!important}
      @media(max-width:639.98px){.g6-practice{width:390px}.g6-tabs{padding-top:45px;gap:3px}.g6-tabs button{font-size:11px;padding:6px 1px}}
      @media(prefers-reduced-motion:reduce){.g6-body{scroll-behavior:auto}}
    `}</style>
    <div className="g6-tabs">{data.items.map((_, i) => <button type="button" className={i === index ? 'on' : ''} key={i} onClick={() => setIndex(i)}>{i + 1}</button>)}</div>
    <div className="g6-body" ref={bodyRef}><PracticeHost key={`${lesson}-${index}`} Question={Q} lang={lang} onLangChange={setLang} onReset={scrollBodyToTop} title={{ uz: data.title, ru: data.titleRu || RU_TITLES[lesson] }} showLanguageSwitch/></div>
  </div>;
}
