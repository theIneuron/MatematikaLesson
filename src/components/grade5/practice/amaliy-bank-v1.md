# Amaliy topshiriqlar banki — v1 (kontent, JSX'dan oldin)

7 amaliy format (§2 «Практические задания») bo'yicha **10 ta** namuna topshiriq.
Daraja matritsasi 40/40/20 (4 Б / 4 С / 2 П), 5 blokga tarqalgan, RU + UZ.

> **UZ-termin holati:** barcha o'zbekcha matematik terminlar (kasr, to'g'ri/noto'g'ri kasr,
> aralash son, yuza, hajm, perimetr, foiz, chegirma) — **draft**, o'zbek tilidagi metodist
> tasdig'ini talab qiladi. Obrashcheniye — `siz`. Apostrof — oddiy `'`.
> Audio (tts) segmentlari JSX bosqichida qo'shiladi — bu yerda faqat topshiriq mazmuni.

> **Avto-tekshiruv kontrakti (jsx-question):** har topshiriq `onSubmit(result)` ga
> `correct` (bool) + raqamli/strukturaviy `studentAnswer`/`correctAnswer` yuboradi.
> Ochiq/ijodiy qism (faqat 2.7 da) — ментор/родительский отчёт, gate'ga **kirmaydi**.

---

## 1 — 2.1 Tekstli masala · Blok 1 · С · teg: natural_addsub

**RU.** В школьной библиотеке было 3 450 книг. К новому году привезли ещё 1 280, а
потом 960 книг передали в другую школу. Сколько книг в библиотеке сейчас?

**UZ.** Maktab kutubxonasida 3 450 ta kitob bor edi. Yangi yilga yana 1 280 ta keltirildi,
keyin 960 tasi boshqa maktabga berildi. Hozir kutubxonada nechta kitob bor?

- Qadam 1 (qo'shildi): 3 450 + 1 280 = **4 730**
- Qadam 2 (berildi): 4 730 − 960 = **3 770**
- ✔ Javob: **3 770 ta kitob**

Avto-maydonlar: `step1 = 4730`, `step2 = 3770` (yakuniy). Bar-model sxema podskaska sifatida.

---

## 2 — 2.1 Tekstli masala · Blok 4 · С · teg: percent_of

**RU.** Кроссовки стоят 240 000 сум. На них скидка 20%. Сверху добавляется доставка
5 000 сум. Сколько всего заплатит покупатель?

**UZ.** Krossovka 240 000 so'm turadi. Unga 20% chegirma bor. Ustiga 5 000 so'm yetkazib
berish qo'shiladi. Xaridor jami qancha to'laydi?

- Qadam 1 (chegirma): 240 000 × 20 / 100 = **48 000**
- Qadam 2 (chegirmadan keyin): 240 000 − 48 000 = **192 000**
- Qadam 3 (yetkazib berish): 192 000 + 5 000 = **197 000**
- ✔ Javob: **197 000 so'm**

Avto-maydonlar: `step1 = 48000`, `step2 = 192000`, `step3 = 197000` (yakuniy).

---

## 3 — 2.2 Mantiqiy masala · П · teg: pattern_logic

**RU.** Продолжи ряд: 3, 6, 11, 18, 27, ? И выбери правило.

**UZ.** Qatorni davom ettiring: 3, 6, 11, 18, 27, ? Va qoidani tanlang.

- Ayirmalar: +3, +5, +7, +9 → keyingisi **+11**
- 27 + 11 = **38**
- ✔ Javob: **38**

"Nega" tanlovi (majburiy, avto-tekshiriladigan):
- (a) Ayirma har safar 2 ga ortadi ✔
- (b) Har son oldingisiga 3 qo'shiladi ✗
- (c) Har son 2 ga ko'paytiriladi ✗

Avto-maydonlar: `answer = 38` **VA** `reason = "a"` — ikkalasi to'g'ri bo'lsa hisoblanadi.

---

## 4 — 2.3 Mini-o'yin "Kasr chaqmog'i" · Blok 2 · Б · teg: fraction_reduce

**RU.** За 60 секунд сократи как можно больше дробей до несократимого вида.

**UZ.** 60 soniya ichида iloji boricha ko'p kasrni qisqarmas ko'rinishgacha qisqartiring.

Topshiriq oqimi (10 ta kasr):

| Kasr | ✔ | Kasr | ✔ |
|------|-----|------|-----|
| 4/8 | 1/2 | 6/8 | 3/4 |
| 6/9 | 2/3 | 14/21 | 2/3 |
| 10/15 | 2/3 | 5/10 | 1/2 |
| 8/12 | 2/3 | 12/18 | 2/3 |
| 9/12 | 3/4 | 20/25 | 4/5 |

Mexanika: aniqlik + tezlik; har to'g'ri qisqartirish — koin/strik. Gate emas (formирующий).
Avto-tekshiruv: kiritilgan `num/den` qisqarmas va kasrga teng bo'lsa to'g'ri.

---

## 5 — 2.4 Jadval bilan ishlash · Blok 4 · С · teg: table_calc

**RU.** Заполни столбец «Сумма», найди итог по чеку, затем посчитай оплату со скидкой 10%.

**UZ.** "Summa" ustunini to'ldiring, chek bo'yicha jamini toping, so'ng 10% chegirma bilan
to'lovni hisoblang.

| Tovar | Narx | Soni | Summa |
|-------|------|------|-------|
| Daftar | 1 500 | 4 | ? |
| Ruchka | 2 000 | 3 | ? |
| O'chirg'ich | 800 | 5 | ? |

- Daftar: 1 500 × 4 = **6 000**
- Ruchka: 2 000 × 3 = **6 000**
- O'chirg'ich: 800 × 5 = **4 000**
- Chek jami: 6 000 + 6 000 + 4 000 = **16 000**
- 10% chegirma bilan: 16 000 × 90 / 100 = **14 400**
- ✔ Javoblar: 6 000 · 6 000 · 4 000 · 16 000 · **14 400 so'm**

Avto-maydonlar: 3 ta hujayra + `total = 16000` + `paid = 14400`.

---

## 6 — 2.5 Solishtirish/klassifikatsiya · Blok 3 · Б · teg: fraction_types

**RU.** Разнеси по корзинам: «правильная дробь» / «неправильная дробь» / «смешанное число».
Объекты: 2/5 · 8/3 · 1⅖ · 6/6 · 3/7 · 9/2.

**UZ.** Korzinkalarga ajrating: "to'g'ri kasr" / "noto'g'ri kasr" / "aralash son".
Obyektlar: 2/5 · 8/3 · 1⅖ · 6/6 · 3/7 · 9/2.

- To'g'ri kasr (surat < maxraj): **2/5, 3/7**
- Noto'g'ri kasr (surat ≥ maxraj): **8/3, 6/6, 9/2**
- Aralash son: **1⅖**
- ✔ Barcha obyekt to'g'ri joylashganda hisoblanadi

Mexanika: drag korzinkaga / tap→tap (zaxira). Avto-tekshiruv: korzinka tegishliligi.

---

## 7 — 2.5 Solishtirish/klassifikatsiya · Blok 5 · Б · teg: units_geom

**RU.** Распредели величины по единицам измерения: см / см² / см³.

**UZ.** Kattaliklarni o'lchov birliklari bo'yicha taqsimlang: см / см² / см³.

Obyektlar:
- Devor uzunligi → **см**
- Xona polining yuzasi → **см²**
- Quticha hajmi → **см³**
- Rasm romi perimetri → **см**
- Stol yuzasi → **см²**
- Akvarium hajmi → **см³**

- ✔ Barcha 6 obyekt to'g'ri birlikka tushganda hisoblanadi

Avto-tekshiruv: har obyekt ↔ birlik mosligi (uzunlik/perimetr→см, yuza→см², hajm→см³).

---

## 8 — 2.6 Vizual/sxema · Blok 2 · Б · teg: fraction_visual

**RU.** Прямоугольник разделён на 8 равных частей, закрашено 5. Запиши дробь закрашенной
части и сравни её с 1/2.

**UZ.** To'rtburchak 8 ta teng qismga bo'lingan, 5 tasi bo'yalgan. Bo'yalgan qism kasrini
yozing va uni 1/2 bilan solishtiring.

- Bo'yalgan qism kasri: **5/8**
- Solishtirish: 5/8 va 4/8 → **5/8 > 1/2**
- ✔ Javoblar: **5/8** ; **katta (>)**

Mexanika: rasmдан kasrni o'qish + belgi tanlash (< = >). Avto-tekshiruv: kasr **va** belgi.

---

## 9 — 2.6 Vizual/sxema · Blok 5 · С · teg: area_composite

**RU.** На схеме прямоугольник 6 см × 4 см, из которого вырезан прямоугольный кусок
2 см × 3 см. Найди площадь закрашенной (оставшейся) части.

**UZ.** Sxemada 6 см × 4 см li to'rtburchak, undan 2 см × 3 см li to'rtburchak bo'lak
kesib olingan. Bo'yalgan (qolgan) qismning yuzasini toping.

- Katta to'rtburchak yuzasi: 6 × 4 = **24 см²**
- Kesilgan bo'lak yuzasi: 2 × 3 = **6 см²**
- Qolgan yuza: 24 − 6 = **18 см²**
- ✔ Javob: **18 см²**

Avto-maydonlar: `area = 18`. Sxema o'lchamlar bilan ko'rsatiladi.

---

## 10 — 2.7 Kombinatsiyalangan (mini-keys) · Blok 3 · П · teg: proportion

**RU.** Проект «Кухня». Рецепт на 4 порции нужно пересчитать на 6 порций.

**UZ.** Loyiha "Oshxona". 4 porsiyalik retseptni 6 porsiyaga qayta hisoblang.

Retsept (4 porsiya): un 200 г · shakar 80 г · sut 150 мл.

- Qadam 1 (koeffitsient): 6 ÷ 4 = **1,5**
- Qadam 2 (un): 200 × 1,5 = **300 г**
- Qadam 3 (shakar): 80 × 1,5 = **120 г**
- Qadam 4 (sut): 150 × 1,5 = **225 мл**
- ✔ Avto-qism: **1,5 · 300 · 120 · 225**

**Ochiq qism (gate EMAS):** taom kartochkasini bezash / nom berish → ментор baholaydi,
родительский отчёт'ga ketadi. Avto-tekshiruvga kirmaydi.

Avto-maydonlar: `k = 1.5`, `flour = 300`, `sugar = 120`, `milk = 225`.

---

## Yig'ma jadval

| # | Format | Blok | Daraja | Teg | Avto-maydonlar soni |
|---|--------|------|--------|-----|--------------------|
| 1 | 2.1 Tekstli | 1 | С | natural_addsub | 2 |
| 2 | 2.1 Tekstli | 4 | С | percent_of | 3 |
| 3 | 2.2 Mantiqiy | — | П | pattern_logic | 2 (javob+sabab) |
| 4 | 2.3 Mini-o'yin | 2 | Б | fraction_reduce | 10 kasr |
| 5 | 2.4 Jadval | 4 | С | table_calc | 5 |
| 6 | 2.5 Klassifikatsiya | 3 | Б | fraction_types | 6 obyekt |
| 7 | 2.5 Klassifikatsiya | 5 | Б | units_geom | 6 obyekt |
| 8 | 2.6 Vizual | 2 | Б | fraction_visual | 2 |
| 9 | 2.6 Vizual | 5 | С | area_composite | 1 |
| 10 | 2.7 Kombinatsiyalangan | 3 | П | proportion | 4 + ochiq qism |

Daraja: 4 Б (4,6,7,8) / 4 С (1,2,5,9) / 2 П (3,10) = **40/40/20** ✔
Bloklar: 1, 2, 3, 4, 5 — barchasi qamralgan ✔
Formatlar: 7 ta format ham bor ✔
