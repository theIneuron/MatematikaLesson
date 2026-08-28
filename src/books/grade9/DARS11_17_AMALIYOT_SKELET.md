# DARS11_17_AMALIYOT_SKELET — 9-sinf, 11-17-darslar amaliyoti, SKELET (1-bosqich)

> Metodist topshirig'i 2026-08-28: **11-17-darslar amaliyoti ham 1-darsdagi AYNAN O'SHA
> o'nta mexanikada quriladi, faqat ketma-ketligi boshqa.**
>
> Kirish: `TIPLAR_AMALIYOT_9SINF.md`, `DARS05_08_AMALIYOT_SKELET.md` (yaqin namuna),
> `src/components/grade9/Dars11…Dars17.jsx` (`STATEMENTS` va `MISS` shu yerdan olindi).
> Chiqish: `src/components/grade9/practice/dars11…dars17/`.

---

## 0. QAYSI BLOKLAR

`DARS05_08_AMALIYOT_SKELET.md` §0 da 5-17 uch blokka bo'lingan edi: A = 5-8, B = 9-13,
C = 14-17. Bu hujjat B blokining QOLGAN qismini (11-13) va C blokining hammasini (14-17)
oladi — metodist ularni bitta topshiriq qilib berdi.

| Dars | Mavzu | Blok |
|---|---|---|
| 11 | o'rniga qo'yish usuli | B |
| 12 | qo'shish usuli | B |
| 13 | masalalar (sistema orqali) | B — **blok yopiladi** |
| 14 | ikkinchi darajali tengsizliklar: D = 0 va D < 0 | C |
| 15 | oraliqlar usuli | C |
| 16 | tengsizliklar sistemasi | C |
| 17 | kasr-ratsional tengsizliklar | C — **blok yopiladi** |

Jami 70 topshiriq.

**Tarixiy tuzatish.** 9 va 10-dars sarlavhalarida `DARS09_13_AMALIYOT_SKELET.md` ga havola
turibdi, lekin bunday fayl hech qachon yozilmagan. Sborka paytida o'sha ikki sarlavhadagi
havola shu hujjatga qaratiladi, aks holda kodda mavjud bo'lmagan faylga ishora qoladi.

---

## 1. RASKLADKA — SKRIPTDAN

`node scripts/grade9-practice-layout.mjs 11 12 13 14 15 16 17`. Hech qanday qo'l tanlovi yo'q.

| # | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
|---:|---|---|---|---|---|---|---|
| 1 🟢 | Jadval | Ha/yo'q | Test | Jadval | Ha/yo'q | Test | Jadval |
| 2 🟢 | Ha/yo'q | Jadval | Jadval | Test | Test | Ha/yo'q | Ha/yo'q |
| 3 🟢 | Test | Test | Ha/yo'q | Ha/yo'q | Jadval | Jadval | Test |
| 4 🟡 | Sonlar o'qi | Belgilash | Javobni kiritish | Sonlar o'qi | Belgilash | Saralash | Javobni kiritish |
| 5 🟡 | Javobni kiritish | Sonlar o'qi | Belgilash | Belgilash | Javobni kiritish | Javobni kiritish | Sonlar o'qi |
| 6 🟡 | Belgilash | Javobni kiritish | Saralash | Javobni kiritish | Saralash | Sonlar o'qi | Belgilash |
| 7 🟡 | Saralash | Saralash | Sonlar o'qi | Saralash | Sonlar o'qi | Belgilash | Saralash |
| 8 🔴 | Xato qator | So'zlar | Tartib | Xato qator | So'zlar | Tartib | Xato qator |
| 9 🔴 | So'zlar | Xato qator | Xato qator | Tartib | Tartib | So'zlar | So'zlar |
| 10 🔴 | Tartib | Tartib | So'zlar | So'zlar | Xato qator | Xato qator | Tartib |

---

## 2. TEXNIKA: YANGI MEXANIKA KERAK EMAS

A blokining skeletida (§2) ogohlantirish turgan edi: «C blokida `DomainAxis` ga yana
ikkitasi kerak bo'lishi mumkin — `two-rays` (`x < a yoki x > b`) va oraliqlar usuli uchun
bir nechta oraliqni belgilash».

**Kerak bo'lmadi, va buni ochiq yozib qo'yaman.** Sabab: har bir «Sonlar o'qi» topshirig'i
javobi BITTA nuqta yoki BITTA oraliq bo'ladigan qilib qo'yilgan, ya'ni savolning o'zi
tor. Bu chalg'itish emas — savolda aynan nima so'ralayotgani yozilgan:

| Dars | Rejim | Savol |
|---|---|---|
| 11 | `point` | sistemadan chiqqan kvadrat tenglamaning kichik ildizi |
| 12 | `point` | qo'shishdan keyin TOPILGAN ikkinchi o'zgaruvchi (`y`, `x` emas) |
| 13 | `point` | ikki nomzoddan masala shartiga mos kelgani |
| 14 | `point` | `(x − 6)² ≤ 0` ning yagona yechimi |
| 15 | `interval` | javobning ikki tomondan CHEGARALANGAN qismi |
| 16 | `interval` | ikki tengsizlikning umumiy qismi |
| 17 | `interval` | surat noli yopiq, maxraj noli ochiq — aralash chegara |

`two-rays` ni qo'shish «hozircha hech kim ishlatmaydigan mexanika» bo'lardi. 18-darsda
(«majmua») u haqiqatan kerak bo'lsa, o'sha yerda yoziladi.

Qolgan to'qqiz mexanika ham o'zgarishsiz ishlaydi. `PlacePoint` ning `curves` sloti
(10-darsda qo'shilgan) 15, 16, 17-darslarda qayta ishlatiladi.

---

## 3. O'N BIRINCHI DARS — O'RNIGA QO'YISH USULI

**Tasdiqlar.** T1 bitta o'zgaruvchi (yoki uning darajasi) bir tenglamadan ifodalanib,
ikkinchisiga qo'yiladi. T2 o'zgaruvchining kvadrati manfiy chiqsa, haqiqiy yechim yo'q.
T3 `1/x + 1/y = (x + y)/xy`.

**Xatolar.** `ozgaruvchini-ifodalash-xatosi` · `manfiy-kvadrat-holati` ·
`notogri-orniga-qoyish` · `kasr-birlashtirish-xatosi`

**Darsning misollari qaytarilmaydi:** `x − y² = 3, xy² = 28`, `x + y = 12, 1/x + 1/y = 3/8`,
`x² − 3x − 28 = 0`, `y − x² = −5, xy = 6`, `x³ − 5x − 6 = 0`, `x + y² = 10`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Jadval 🟢 | `y = 5 − x` (`x + y = 5` dan ifodalangan), jadval: `x` = 1, 2, ?, 5 ; `y` = 4, ?, 1, 0 | `y(2) = 3` ; `x = 4` |
| 02 | Ha/yo'q 🟢 | `x = 2y + 1`, `x + y = 7`: (a) ifodani ikkinchi tenglamaga qo'yish mumkin; (b) ifodani O'Z tenglamasiga qo'ysak, `y` topiladi; (c) `y` topilgach, `x` ifodadan topiladi | ha · yo'q · ha |
| 03 | Test 🟢 | Nima uchun ifodani o'z tenglamasiga qaytarib qo'yish `y` ni topmaydi? (a) ikkala tomonda bir xil narsa hosil bo'ladi va o'zgaruvchi yo'qoladi (b) ifodada xato bor (c) bunday qo'yish taqiqlangan (d) ikkinchi tenglama umuman kerak emas | **a** |
| 04 | Sonlar o'qi 🟡 | `y = 2x + 1`, `x² + y = 9` → `x² + 2x − 8 = 0`. KICHIK ildizni o'qda belgilang (`mode: point`) | `−4`, bo'yalgan |
| 05 | Javobni kiritish 🟡 | `x + y = 7`, `1/x + 1/y = 7/12` → `xy = 12`. `x` va `y` ning barcha qiymatlarini yozing | `3; 4` |
| 06 | Belgilash 🟡 | `y = x + 1`, `xy = 6` — sistemaning IKKALA yechimini tekislikka qo'ying | `(2; 3)`, `(−3; −2)` |
| 07 | Saralash 🟡 | uch zona: ikkita `y` beradi / bitta `y` beradi / haqiqiy `y` bermaydi. `y² = 25`, `y² = 4` ; `y² = 0`, `(y − 3)² = 0` ; `y² = −1`, `y² = −16` | |
| 08 | Xato qator 🔴 | `y = 3 − x`, `x² + y = 5`: (1) `x² + (3 − x) = 5` (2) `x² − x − 2 = 0` (3) `x₁ = 2, y₁ = 1 ; x₂ = −1, y₂ = 2` (4) tekshirish: `2² + 1 = 5` | **3-qator** (`x = −1` da `y = 4`, ishora tushdi) |
| 09 | So'zlar 🔴 | O'rniga qo'yish usulida o'zgaruvchi yoki uning **[darajasi]** bir tenglamadan ifodalanib, **[ikkinchi]** tenglamaga qo'yiladi. Kvadrati manfiy songa teng chiqsa, bunday `x` uchun **[haqiqiy yechim yo'q]**. Tuzoqlar: `ozod hadi`, `o'sha`, `ikkita yechim bor` | |
| 10 | Tartib 🔴 | `x − y = 1`, `x² − y = 7`: (1) `y` ni ifodalaymiz: `y = x − 1` (2) ikkinchisiga qo'yamiz: `x² − (x − 1) = 7` (3) `x² − x − 6 = 0`, `x = 3` va `x = −2` (4) har bir `x` uchun `y` ni ifodadan topamiz (5) javob `(3; 2)`, `(−2; −3)` | |

**Tuzoqlar.** 01: `y` katagiga `7` (ishora), `x` katagiga `−4`. 04: `2` (kattasi), `9`, `1`.
05: `12` (ko'paytmaning o'zi), `7`, faqat `3`. 06: `(3; 2)` va `(−2; −3)` (koordinatalar
almashdi), bitta nuqta. 08: 1 va 2-qator (ikkalasi to'g'ri), 4-qator (hisobi to'g'ri, lekin
faqat BIRINCHI juftlikni tekshirgan).

**Qoplash.** T1: 01, 02, 03, 04, 06, 08, 10 · T2: 07, 09 · T3: 05
`ozgaruvchini-ifodalash-xatosi`: 01, 08, 10 · `manfiy-kvadrat-holati`: 07, 09 ·
`notogri-orniga-qoyish`: 02, 03, 04, 06 · `kasr-birlashtirish-xatosi`: 05

---

## 4. O'N IKKINCHI DARS — QO'SHISH USULI

**Tasdiqlar.** T1 ikkala tenglama qo'shiladi, qarama-qarshi ishorali had yo'qoladi.
T2 qo'shishdan keyin topilgan natija hali yakuniy javob emas. T3 kvadrat tenglamaning
ikkita ildizi bo'lsa, ikkala yechim ham yoziladi.

**Xatolar.** `qoshish-orqali-yoqotish-notogri` · `yigindini-yakuniy-javob-deb-olish` ·
`orniga-qoyishni-unutish` · `faqat-bitta-yechim-yozish`

**Darsning misollari qaytarilmaydi:** `x + 2xy = 7, x − 2xy = −1`, `x + y + xy = 9`,
`x + y² = 13, x − y² = 5`, `x² − 4x + 3 = 0`, `4y − x² = 9`, `5x − y² = 4`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Ha/yo'q 🟢 | `x + 3y = 11`, `x − 3y = −1`: (a) qo'shganda `3y` yo'qoladi; (b) qo'shganda `x` ham yo'qoladi; (c) `x` topilgach, `y` ixtiyoriy tenglamadan topiladi | ha · yo'q · ha |
| 02 | Jadval 🟢 | `x + y = 6`, jadval: `x` = 0, 2, ?, 6 ; `y` = 6, ?, 1, 0 | `y(2) = 4` ; `x = 5` |
| 03 | Test 🟢 | Qo'shganda had qachon yo'qoladi? (a) hadlar bir xil ishorada (b) hadlar qarama-qarshi ishorada va koeffitsientlari teng (c) hadlar bir xil harfda (d) hadlar kvadratda | **b** |
| 04 | Belgilash 🟡 | `x + y = 1`, `x − y = 5` — yechimni tekislikka qo'ying | `(3; −2)` |
| 05 | Sonlar o'qi 🟡 | `x + 2y = 9`, `x − 2y = 1` → `x = 5`. **`y` ni** o'qda belgilang (`mode: point`) | `2`, bo'yalgan |
| 06 | Javobni kiritish 🟡 | `x² + y = 10`, `−x² + y = 2` → `y = 6`, `x² = 4`. `x` ning BARCHA qiymatlarini yozing | `−2; 2` |
| 07 | Saralash 🟡 | birinchi tenglama `x + 2y = 9`. Ikkinchisini guruhlang: `y` yo'qoladi / `x` yo'qoladi / hech nima yo'qolmaydi. `x − 2y = 1`, `3x − 2y = 5` ; `−x + 4y = 3`, `−x + y = 2` ; `2x + 3y = 8`, `x + 5y = 7` | |
| 08 | So'zlar 🔴 | Qo'shish usulida qarama-qarshi ishorada turgan had **[yo'qoladi]**. Qo'shishdan keyin topilgan natija hali **[yakuniy javob emas]**. Kvadrat tenglamaning ikkita ildizi bo'lsa, **[ikkala]** yechim ham yoziladi. Tuzoqlar: `ikkilanadi`, `tayyor javob`, `faqat bitta` | |
| 09 | Xato qator 🔴 | `3x + y = 14`, `3x − y = 4`: (1) qo'shamiz: `6x = 18` (2) `x = 3` (3) `y = 14 − 3 = 11` (4) javob `(3; 11)` | **3-qator** (`3x` o'rniga `x` qo'yildi, `y = 14 − 9 = 5`) |
| 10 | Tartib 🔴 | `x + y = 7`, `x² − y = 5`: (1) qo'shamiz, `y` yo'qoladi (2) `x² + x = 12` (3) `x² + x − 12 = 0`, `x = 3` va `x = −4` (4) har bir `x` uchun `y` ni birinchi tenglamadan topamiz (5) javob `(3; 4)`, `(−4; 11)` | |

**Tuzoqlar.** 02: `y` katagiga `8`, `x` katagiga `1`. 04: `(−2; 3)`, `(5; 1)`. 05: `5`
(`x` da to'xtadi), `4` (`2y` yozildi), `10`. 06: faqat `2`, `4` (`x²` ning o'zi), `6` (`y`).
09: 1 va 2-qator (ikkalasi to'g'ri), 4-qator (uchinchisidan kelib chiqadi).

**Qoplash.** T1: 01, 03, 07, 09, 10 · T2: 02, 05, 08, 09 · T3: 06, 08, 10
`qoshish-orqali-yoqotish-notogri`: 01, 03, 07 · `yigindini-yakuniy-javob-deb-olish`: 02, 08 ·
`orniga-qoyishni-unutish`: 04, 05, 09 · `faqat-bitta-yechim-yozish`: 06, 10

---

## 5. O'N UCHINCHI DARS — MASALALAR

**Tasdiqlar.** T1 avval har bir noma'lum aniq nima anglatishini belgilash kerak.
T2 so'zdagi har bir shart alohida tenglamaga aylanadi. T3 matematik to'g'ri chiqqan
yechim masala shartiga zid bo'lsa, rad etiladi.

**Xatolar.** `ozgaruvchi-notogri-tanlash` · `shartni-notogri-tenglamaga-otkazish` ·
`nomuvofiq-yechimni-qabul-qilish` · `javobni-masala-tiliga-qaytarmaslik`

**Darsning misollari qaytarilmaydi:** `N = 3s, s² = 3N` (javob 27), `N = 4s, s² = 1,5N`
(javob 24), `s(s − 9) = 0`, `a = 5b`, `a = b + 5`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Test 🟢 | Masalani sistema orqali yechishda BIRINCHI qadam nima? (a) har bir noma'lum nimani anglatishini belgilash (b) darhol tenglama yozish (c) javobni taxmin qilish (d) grafik chizish | **a** |
| 02 | Jadval 🟢 | `a + b = 11` (ikki xonali sonning raqamlari), jadval: `a` = 2, 3, ?, 8 ; `b` = 9, ?, 5, 3 | `b(3) = 8` ; `a = 6` |
| 03 | Ha/yo'q 🟢 | «Son raqamlari yig'indisidan 5 marta katta, yig'indisi 9»: (a) `N = 5s` shu shartdan chiqadi; (b) «5 ga katta» va «5 marta katta» bir xil tenglama beradi; (c) `s = 9` bo'lsa `N = 45` | ha · yo'q · ha |
| 04 | Javobni kiritish 🟡 | «Bir son ikkinchisidan 4 ga katta, ko'paytmasi 45». Ikkala NATURAL sonni yozing | `5; 9` |
| 05 | Belgilash 🟡 | Raqamlar yig'indisi 9, ayirmasi 3. `x` — o'nlar raqami, `y` — birlar raqami. Nuqtani qo'ying | `(6; 3)` |
| 06 | Saralash 🟡 | uch zona: marta katta / ga katta / kvadrati. `N = 6s`, `a = 4b` ; `N = s + 6`, `a = b + 4` ; `N = s²`, `a = b²` | |
| 07 | Sonlar o'qi 🟡 | `s² = 7s` dan `s = 0` va `s = 7`. Ikki xonali son uchun MOS ildizni belgilang (`mode: point`) | `7`, bo'yalgan |
| 08 | Tartib 🔴 | Raqamlar yig'indisi 12, raqamlar almashsa son 18 ga kamayadi: (1) `x` — o'nlar, `y` — birlar raqami (2) `x + y = 12`, `9(x − y) = 18` (3) `x + y = 12`, `x − y = 2` → `x = 7`, `y = 5` (4) shartga mosligini tekshiramiz (5) javob: son 75 | |
| 09 | Xato qator 🔴 | «Bir son ikkinchisidan 3 ga katta, kvadratlari ayirmasi 33»: (1) `(x − y)(x + y) = 33` (2) `3(x + y) = 33`, `x + y = 11` (3) sonlar: `x = 8`, `y = 3` (4) tekshirish: `8 + 3 = 11` | **3-qator** (`y` shartdagi AYIRMA deb olindi; `x = 7`, `y = 4`) |
| 10 | So'zlar 🔴 | Sistema orqali yechishda avval har bir noma'lum nimani anglatishi **[belgilanadi]**. So'zdagi har bir shart **[alohida]** tenglamaga aylanadi. Masala shartiga zid yechim **[rad etiladi]**. Tuzoqlar: `taxmin qilinadi`, `bitta umumiy`, `qabul qilinadi` | |

**Tuzoqlar.** 02: `b` katagiga `9`, `a` katagiga `5`. 04: `−9` ni ham qo'shish, faqat `5`.
05: `(3; 6)` (raqamlar almashdi — son 36 chiqadi, 63 emas). 07: `0` (nol ikki xonali son
bermaydi), `−7`. 09: 1 va 2-qator (ikkalasi to'g'ri), 4-qator (hisobi to'g'ri, lekin faqat
YIG'INDINI tekshirgan, ayirmani emas).

**Qoplash.** T1: 01, 05, 08, 10 · T2: 02, 03, 06, 08, 09, 10 · T3: 04, 07, 10
`ozgaruvchi-notogri-tanlash`: 01, 05 · `shartni-notogri-tenglamaga-otkazish`: 02, 03, 06, 09 ·
`nomuvofiq-yechimni-qabul-qilish`: 04, 07 · `javobni-masala-tiliga-qaytarmaslik`: 08, 10

---

## 6. O'N TO'RTINCHI DARS — IKKINCHI DARAJALI TENGSIZLIKLAR (D = 0, D < 0)

**Tasdiqlar.** T1 `D = 0` — parabola `Ox` ga bitta nuqtada tegadi, ishora ikki tomonda
bir xil. T2 `D < 0` — `Ox` umuman kesilmaydi, butun grafik bir ishorada. T3 javob
«yechim yo'q» yoki «barcha sonlar» bo'lishi mumkin.

**Xatolar.** `ikkita-ildiz-deb-oylash` · `urinish-notogri-oqish` ·
`diskriminant-manfiy-holati` · `yechim-yoq-yoki-hamma-son`

**Darsning misollari qaytarilmaydi:** `4x² + 4x + 1`, `−x² + x − 1`, `x² − 8x + 16`,
`x² + 2x + 5`, `x² − 5x + 6`, `−x² + 4x − 4`, `x² − 4x + 4`, `x² − 6x + 9`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Jadval 🟢 | `y = (x − 5)²`, jadval: `x` = 3, 4, ?, 7 ; `y` = 4, 1, 0, ? | `x = 5` (urinish) ; `y(7) = 4` |
| 02 | Test 🟢 | `D = 0` bo'lsa, parabola `Ox` bilan qanday joylashadi? (a) bitta nuqtada tegadi (b) ikkita nuqtada kesadi (c) umuman kesmaydi (d) `Ox` bilan ustma-ust tushadi | **a** |
| 03 | Ha/yo'q 🟢 | `y = x² + 4x + 7` (`D = −12`): (a) `x² + 4x + 7 > 0` har qanday `x` da to'g'ri; (b) `x² + 4x + 7 < 0` ning yechimi bor; (c) grafik `Ox` ni bitta nuqtada kesadi | ha · yo'q · yo'q |
| 04 | Sonlar o'qi 🟡 | `x² − 12x + 36 ≤ 0` javobini o'qda ko'rsating (`mode: point`) | `6`, **bo'yalgan** |
| 05 | Belgilash 🟡 | `y = (x + 3)²` grafigi chizilgan. Grafik `Ox` ga TEGGAN nuqtani belgilang | `(−3; 0)` |
| 06 | Javobni kiritish 🟡 | `x² + 14x + 49 = 0` — BARCHA ildizlarni yozing | `−7` |
| 07 | Saralash 🟡 | uch zona: ikkita ildiz / bitta ildiz / ildiz yo'q. `x² − 7x + 10`, `x² + 3x − 4` ; `x² + 8x + 16`, `4x² − 4x + 1` ; `x² + x + 3`, `x² − 2x + 5` | |
| 08 | Xato qator 🔴 | `x² − 6x + 13 > 0`: (1) `D = 36 − 52 = −16` (2) `D < 0`, ildiz yo'q (3) ildiz yo'q, demak yechim ham yo'q (4) javob: yechim yo'q | **3-qator** (ildiz yo'qligi grafik `Ox` dan YUQORIDA turishini bildiradi) |
| 09 | Tartib 🔴 | `x² + 2x + 1 > 0`: (1) `D = 4 − 4 = 0` (2) bitta takroriy ildiz `x = −1` (3) tarmoqlar yuqoriga, urinish nuqtasida ishora almashmaydi (4) qat'iy belgi: urinish nuqtasining o'zi kirmaydi (5) javob: `x ≠ −1` bo'lgan barcha sonlar | |
| 10 | So'zlar 🔴 | `D = 0` bo'lsa, parabola `Ox` ga bitta nuqtada **[tegadi]**, va bu nuqtaning ikki tomonida ishora **[bir xil]** qoladi. `D < 0` bo'lsa, javob **[barcha sonlar]** yoki «yechim yo'q» bo'ladi. Tuzoqlar: `kesadi`, `teskari`, `faqat bitta son` | |

**Tuzoqlar.** 01: `x` katagiga `−5`, `y` katagiga `2`. 04: nuqta bo'sh (`≤` ekani unutildi),
`12`, `−6`. 05: `(3; 0)` (ishora), `(0; 3)` (koordinatalar almashdi). 06: `−7; 7` (ikkita
ildiz deb o'ylash), `7`. 08: 1 va 2-qator (ikkalasi to'g'ri), 4-qator (uchinchisidan kelib
chiqadi).

**Qoplash.** T1: 01, 02, 04, 05, 09, 10 · T2: 03, 07, 08, 10 · T3: 08, 09, 10
`ikkita-ildiz-deb-oylash`: 02, 06, 07 · `urinish-notogri-oqish`: 01, 04, 05, 09 ·
`diskriminant-manfiy-holati`: 03, 07, 10 · `yechim-yoq-yoki-hamma-son`: 08, 09, 10

---

## 7. O'N BESHINCHI DARS — ORALIQLAR USULI

**Tasdiqlar.** T1 to'liq ko'paytuvchilarga ajratib, BARCHA ildizlarni topish kerak.
T2 oddiy ildizda ishora almashadi, takroriy ildizda saqlanadi. T3 qat'iy tengsizlikda
har bir ildiz javobdan chiqariladi.

**Xatolar.** `toliq-korpaytirmaslik` · `har-safar-almashadi-deb-oylash` ·
`qatiy-tengsizlikda-ildizni-qoshish` · `nechta-oraliq-notogri-hisoblash`

**Darsning misollari qaytarilmaydi:** `x³ − x`, `x³ − 9x`, `x³ + x² − 6x`, `(x² − 4)(x − 1)`,
`x⁴ − x²`, `(x − 1)(x − 2)(x − 3)(x − 4)`, `(x + 2)²(x − 5)`, `(x + 1)(x − 3)²(x − 6)`,
`(x + 1)²(x − 2)`, `(x + 2)(x + 1)(x − 1)(x − 3)`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Ha/yo'q 🟢 | `(x + 2)²(x − 3) > 0`: (a) `−2` takroriy ildiz, unda ishora almashmaydi; (b) ifodaning uchta HAR XIL ildizi bor; (c) `x = 3` javobga kiradi | ha · yo'q · yo'q |
| 02 | Test 🟢 | Nima uchun takroriy ildizda ishora almashmaydi? (a) ikki marta almashish bir-birini bekor qiladi (b) takroriy ildiz umuman ildiz emas (c) u har doim musbat (d) shunday kelishilgan | **a** |
| 03 | Jadval 🟢 | `y = x(x − 2)(x + 2)`, jadval: `x` = −3, −1, 1, ? ; `y` = −15, ?, −3, 15 | `y(−1) = 3` ; `x = 3` |
| 04 | Belgilash 🟡 | `y = x(x − 3)(x + 1)` chizilgan. Grafik `Ox` ni kesgan BARCHA nuqtalarni qo'ying | `(−1; 0)`, `(0; 0)`, `(3; 0)` |
| 05 | Javobni kiritish 🟡 | `x³ − 4x² + 3x = 0` — barcha ildizlarni yozing | `0; 1; 3` |
| 06 | Saralash 🟡 | uch zona: ildizda ishora almashadi / ishora saqlanadi / haqiqiy ildizi yo'q. `(x − 2)`, `(x + 5)` ; `(x − 2)²`, `(x + 5)²` ; `(x² + 1)`, `(x² + 4)` | |
| 07 | Sonlar o'qi 🟡 | `x(x − 5)(x + 3) ≥ 0` javobining CHEGARALANGAN qismini o'qda ko'rsating (`mode: interval`) | `−3` va `0`, ikkalasi bo'yalgan |
| 08 | So'zlar 🔴 | Oraliqlar usulida ifoda oxirigacha **[ko'paytuvchilarga]** ajratiladi. Har bir oddiy ildizdan o'tishda ishora **[almashadi]**, takroriy ildizda esa **[saqlanadi]**. Tuzoqlar: `hadlarga`, `yo'qoladi`, `ham almashadi` | |
| 09 | Tartib 🔴 | `(x + 3)(x − 1)(x − 2) < 0`: (1) ildizlar `−3`, `1`, `2` (2) ildizlarni o'qqa qo'yamiz, o'q to'rtta oraliqqa bo'linadi (3) eng o'ng oraliqqa son qo'yamiz: `x = 3` da musbat (4) chapga qarab har ildizda ishorani almashtiramiz (5) javob `x < −3` yoki `1 < x < 2` | |
| 10 | Xato qator 🔴 | `x(x − 4)² > 0`: (1) ildizlar `0` va `4` (2) `4` — takroriy ildiz (3) `4` dan o'tishda ishora almashadi (4) javob `x < 0` yoki `x > 4` | **3-qator** (takroriy ildizda ishora saqlanadi; javob `x > 0`, `x ≠ 4`) |

**Tuzoqlar.** 03: `y` katagiga `−3`, `x` katagiga `−3`. 04: `0` ni tashlab ketish
(`x` ga qisqartirish), faqat bitta nuqta. 05: `1; 3` (`x` ga bo'lindi, `0` yo'qoldi).
07: nuqtalar bo'sh (`≥` ekani unutildi), chegaralar `0` va `5`. 10: 1 va 2-qator (ikkalasi
to'g'ri), 4-qator (uchinchisidan kelib chiqadi).

**Qoplash.** T1: 03, 04, 05, 08 · T2: 01, 02, 06, 08, 09, 10 · T3: 01, 07
`toliq-korpaytirmaslik`: 04, 05, 08 · `har-safar-almashadi-deb-oylash`: 01, 02, 06, 10 ·
`qatiy-tengsizlikda-ildizni-qoshish`: 01, 07 · `nechta-oraliq-notogri-hisoblash`: 03, 09

---

## 8. O'N OLTINCHI DARS — TENGSIZLIKLAR SISTEMASI

**Tasdiqlar.** T1 yechim — ikkala tengsizlikni BIR VAQTDA qanoatlantiradigan sonlar,
ya'ni umumiy qism. T2 har biri alohida yechiladi, keyin bitta o'qqa qo'yiladi.
T3 umumiy qism bo'lmasa, yechim yo'q — bu ham to'liq javob.

**Xatolar.** `kesishma-emas-birlashma-deb-oylash` · `faqat-bitta-tengsizlikni-tekshirish` ·
`kesishma-yoq-holatni-tanimaslik` · `chegara-turini-notogri-kochirish`

**Darsning misollari qaytarilmaydi:** `x < 5, x > 1`, `x ≤ 0 yoki x ≥ 4, x > 2`,
`x < −2, x > 3`, `x > 0, x < −5`, `x ≥ −2, x ≤ 6`, `x² − 9 < 0 va 2x + 1 ≥ 0`,
`−x² − 6x − 8 ≥ 0`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Test 🟢 | Tengsizliklar sistemasining yechimi nima? (a) ikkala tengsizlikni bir vaqtda qanoatlantiradigan sonlar (b) hech bo'lmasa bittasini qanoatlantiradigan sonlar (c) ikkala javobning birlashmasi (d) birinchi tengsizlikning javobi | **a** |
| 02 | Ha/yo'q 🟢 | `x > −4` va `x ≤ 3`: (a) `x = 0` yechim; (b) `x = 3` yechim; (c) `x = −4` yechim | ha · ha · yo'q |
| 03 | Jadval 🟢 | `y = 2x − 6`, jadval: `x` = 0, 2, ?, 5 ; `y` = −6, −2, 0, ? | `x = 3` ; `y(5) = 4` |
| 04 | Saralash 🟡 | sistema `x ≥ −2` va `x < 5`. uch zona: sistemaning yechimi / faqat birinchisini qanoatlantiradi / faqat ikkinchisini. `0`, `4` ; `5`, `8` ; `−3`, `−7` | |
| 05 | Javobni kiritish 🟡 | `x² − 16 < 0` va `x > 1` sistemasini qanoatlantiruvchi BUTUN sonlarni yozing | `2; 3` |
| 06 | Sonlar o'qi 🟡 | `x ≥ 1` va `x < 7` sistemasining javobini o'qda ko'rsating (`mode: interval`) | `1` bo'yalgan, `7` bo'sh |
| 07 | Belgilash 🟡 | `y = x² − 4` va `y = x + 1` chizilgan. Har ikkala grafikning `Ox` bilan kesishgan BARCHA nuqtalarini qo'ying | `(−2; 0)`, `(2; 0)`, `(−1; 0)` |
| 08 | Tartib 🔴 | `x² − 25 < 0` va `3x ≥ 6`: (1) har birini alohida yechamiz (2) birinchisi: `−5 < x < 5` (3) ikkinchisi: `x ≥ 2` (4) ikkala yechimni bitta o'qqa qo'yib, umumiy qismini olamiz (5) javob `2 ≤ x < 5` | |
| 09 | So'zlar 🔴 | Sistemaning yechimi — ikkala tengsizlikni ham **[bir vaqtda]** qanoatlantiradigan sonlar, ya'ni ikki yechimning **[umumiy qismi]**. Umumiy qism topilmasa, sistemaning **[yechimi yo'q]**. Tuzoqlar: `hech bo'lmasa bittasini`, `birlashmasi`, `barcha sonlar javob` | |
| 10 | Xato qator 🔴 | `x ≤ −1` va `x > 2`: (1) birinchi yechim `x ≤ −1` (2) ikkinchi yechim `x > 2` (3) umumiy qism: `x ≤ −1` yoki `x > 2` (4) javob `x ≤ −1` yoki `x > 2` | **3-qator** («va» birlashma emas, kesishma; umumiy qism yo'q) |

**Tuzoqlar.** 03: `x` katagiga `6`, `y` katagiga `10`. 05: `1` yoki `4` ni qo'shish
(chegara), `−3; −2` (ikkinchi tengsizlik unutildi). 06: `7` bo'yalgan (qat'iy belgi),
chegaralar almashdi. 07: faqat parabolaning nuqtalari, `(0; −4)` (uchi). 10: 1 va 2-qator
(ikkalasi to'g'ri), 4-qator (uchinchisidan kelib chiqadi).

**Qoplash.** T1: 01, 02, 04, 09 · T2: 03, 05, 07, 08 · T3: 09, 10
`kesishma-emas-birlashma-deb-oylash`: 01, 08, 09 · `faqat-bitta-tengsizlikni-tekshirish`: 03, 04, 05, 07 ·
`kesishma-yoq-holatni-tanimaslik`: 09, 10 · `chegara-turini-notogri-kochirish`: 02, 06

---

## 9. O'N YETTINCHI DARS — KASR-RATSIONAL TENGSIZLIKLAR

**Tasdiqlar.** T1 maxrajga ko'paytirilmaydi, hammasi bitta tomonga ko'chiriladi.
T2 surat noli qat'iy emas tengsizlikda javobga kiradi, maxraj noli hech qachon kirmaydi.
T3 umumiy ko'paytuvchini qisqartirish teshik nuqtani yo'qotadi.

**Xatolar.** `maxrajga-korpaytirib-yechish` · `maxraj-nolini-javobga-kiritish` ·
`surat-maxrajni-qisqartirib-yoqotish` · `nollarni-toliq-belgilamaslik`

**Darsning misollari qaytarilmaydi:** `(x − 5)/(x + 2)`, `(x² − 4)/(x + 1)`,
`(x + 6)/(x² − x − 6)`, `(x − 2)/(x − 5) ≥ 0`, `(x + 1)/(x − 3) > 0`,
`(x − 2)(x + 1)/(x − 2) ≥ 0`, `3/(x + 2) < 2`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Jadval 🟢 | `y = (x + 3)/(x − 1)`, jadval: `x` = −3, 0, ?, 5 ; `y` = 0, −3, 3, ? | `x = 3` ; `y(5) = 2` |
| 02 | Ha/yo'q 🟢 | `(x − 4)/(x + 2) ≥ 0`: (a) `x = 4` javobga kiradi; (b) `x = −2` javobga kiradi; (c) maxrajga ko'paytirib, oddiy tengsizlikdek yechish mumkin | ha · yo'q · yo'q |
| 03 | Test 🟢 | Nima uchun kasr tengsizlikni maxrajga ko'paytirib bo'lmaydi? (a) maxrajning ishorasi noma'lum, ko'paytirishda tengsizlik belgisi almashishi mumkin (b) hisob uzayadi (c) maxraj nolga teng bo'la olmaydi (d) shunday qoida bor | **a** |
| 04 | Javobni kiritish 🟡 | `(x² − 1)/(x − 6)` — surat va maxrajning BARCHA nol nuqtalarini yozing | `−1; 1; 6` |
| 05 | Sonlar o'qi 🟡 | `(x + 1)/(x − 4) ≤ 0` javobini o'qda ko'rsating (`mode: interval`) | `−1` bo'yalgan, `4` bo'sh |
| 06 | Belgilash 🟡 | `y = (x − 3)/(x + 1)` chizilgan. Grafik `Ox` ni KESGAN nuqtani belgilang | `(3; 0)` |
| 07 | Saralash 🟡 | kasr `(x − 3)(x + 2) / (x − 5)(x + 4)`. uch zona: surat noli / maxraj noli / nol nuqta emas. `3`, `−2` ; `5`, `−4` ; `0`, `1` | |
| 08 | Xato qator 🔴 | `(x − 1)(x + 5)/(x − 1) ≥ 0`: (1) umumiy ko'paytuvchi `x − 1` (2) qisqartirgach `x + 5 ≥ 0` (3) javob `x ≥ −5` (4) tekshirish: `x = 0` da kasr `5`, `5 ≥ 0` | **3-qator** (`x = 1` teshik nuqta, javobdan chiqariladi) |
| 09 | So'zlar 🔴 | Kasr tengsizlikda maxrajga ko'paytirilmaydi, hammasi **[bitta tomonga]** ko'chiriladi. Suratning nol nuqtasi qat'iy emas tengsizlikda javobga **[kiradi]**, maxrajning nol nuqtasi esa **[hech qachon]** kirmaydi. Tuzoqlar: `ikkala tomonga`, `kirmaydi`, `har doim` | |
| 10 | Tartib 🔴 | `(x − 5)/(x + 1) > 0`: (1) surat va maxrajning nollarini topamiz: `5` va `−1` (2) ikkala nolni ham o'qqa qo'yamiz, maxraj noli har doim ochiq (3) eng o'ng oraliqqa son qo'yamiz: `x = 6` da kasr musbat (4) chapga qarab ishorani almashtiramiz (5) javob `x < −1` yoki `x > 5` | |

**Tuzoqlar.** 01: `x` katagiga `1` (maxraj noli), `y` katagiga `8`. 04: `6` tushib qolishi
(maxraj sanalmadi), faqat `1`. 05: `4` bo'yalgan (maxraj noli javobga kiritildi), `−1` bo'sh.
06: `(−1; 0)` (maxraj noli — u yerda nuqta umuman yo'q). 08: 1 va 2-qator (ikkalasi
to'g'ri), 4-qator (hisobi to'g'ri, lekin teshik nuqtaga tegmaydigan sonni tekshirgan).

**Qoplash.** T1: 02, 03, 09, 10 · T2: 01, 02, 05, 06, 07, 09 · T3: 07, 08
`maxrajga-korpaytirib-yechish`: 02, 03, 10 · `maxraj-nolini-javobga-kiritish`: 02, 05, 06, 09 ·
`surat-maxrajni-qisqartirib-yoqotish`: 08 · `nollarni-toliq-belgilamaslik`: 01, 04, 07

---

## 10. NIMA TASDIQLANISHI KERAK

1. **Yangi mexanika qo'shilmasligi** (§2): A blokida ogohlantirilgan `two-rays` kerak
   bo'lmadi, chunki har «Sonlar o'qi» topshirig'ining savoli bitta nuqta yoki bitta
   oraliqqa qaratilgan.
2. **70 topshiriqning mavzusi va javoblari** (§3-§9).
3. 9 va 10-dars sarlavhalaridagi o'lik havolani shu hujjatga qaratish (§0).

Tasdiqlasangiz, 2 va 3-bosqichga o'taman: 70 topshiriqning to'liq UZ/RU/EN matni va
sborka, keyin tekshiruv (5 o'lcham x 3 til, `grade9-practice-check.mjs`), reestr
(`grade9.js` + `index.js`) va kontent hujjatlari (`grade9-practice-kontent.mjs`).
