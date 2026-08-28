# DARS05_08_AMALIYOT_SKELET — 9-sinf, 5-8-darslar amaliyoti, SKELET (1-bosqich)

> Metodist topshirig'i 2026-08-27: **5-17-darslar amaliyoti ham 1-darsdagi AYNAN O'SHA
> o'nta mexanikada quriladi, faqat ketma-ketligi boshqa.**
>
> Kirish: `TIPLAR_AMALIYOT_9SINF.md`, `DARS02_04_AMALIYOT_SKELET.md` (yaqin namuna),
> `src/components/grade9/Dars05…Dars08.jsx`.
> Chiqish: `src/components/grade9/practice/dars05…dars08/`.

---

## 0. O'N UCH DARS UCHTA BLOKDA

13 darsni bir tsiklda (skelet → kontent → sborka → tekshiruv) olib bo'lmaydi: 130 topshiriq
bitta o'tishda sifatni yo'qotadi. Mavzu chegaralari bo'yicha uch blok:

| Blok | Darslar | Mavzu | Topshiriq |
|---|---|---|---|
| **A** | **5-8** | grafik ko'chirish, kvadrat tengsizliklar, butun va kasr-ratsional tenglamalar | 40 |
| B | 9-13 | tenglamalar sistemasi: grafik, o'rniga qo'yish, qo'shish, masalalar | 50 |
| C | 14-17 | ikkinchi darajali tengsizliklar, oraliqlar usuli, sistemalar, kasr-ratsional | 40 |

Bu hujjat — **A bloki**. B va C o'z hujjatlarini oladi.

---

## 1. RASKLADKA — SKRIPTDAN

`scripts/grade9-practice-layout.mjs`, hech qanday qo'l tanlovi yo'q.

| # | 5-dars | 6-dars | 7-dars | 8-dars |
|---:|---|---|---|---|
| 1 🟢 | Jadval | Ha/yo'q | Test | Jadval |
| 2 🟢 | Ha/yo'q | Jadval | Jadval | Test |
| 3 🟢 | Test | Test | Ha/yo'q | Ha/yo'q |
| 4 🟡 | Belgilash | Saralash | Sonlar o'qi | Belgilash |
| 5 🟡 | Sonlar o'qi | Sonlar o'qi | Belgilash | Saralash |
| 6 🟡 | Saralash | Javobni kiritish | Saralash | Sonlar o'qi |
| 7 🟡 | Javobni kiritish | Belgilash | Javobni kiritish | Javobni kiritish |
| 8 🔴 | Xato qator | So'zlar | Tartib | Xato qator |
| 9 🔴 | So'zlar | Xato qator | Xato qator | Tartib |
| 10 🔴 | Tartib | Tartib | So'zlar | So'zlar |

---

## 2. TEXNIKA: «SONLAR O'QI» GA UCH REJIM

Bu yerda birinchi marta haqiqiy to'siqqa uchradik va uni ochiq yozib qo'yaman.

`DomainAxis` hozir faqat BITTA narsani biladi: bitta chegara + nuqta turi + yo'nalish
(nur). 1-4-darslarda shu yetardi — aniqlanish sohasi, o'sish oralig'i, musbat qiymatlar
nuri. **5-8-darslarda esa javobning shakli boshqa:**

| Dars | Javob nima ko'rinishda | Hozirgi asbob |
|---|---|---|
| 5 | o'sish nuri (`x ≥ 3`) | ✓ ishlaydi |
| 6 | **oraliq** (`−1 ≤ x ≤ 5`) — ikkita chegara | ✗ |
| 7 | **bitta nuqta** — tenglamaning ildizi | ✗ |
| 8 | **bitta chiqarib tashlangan nuqta** — ODZ teshigi | ✗ |

Shuning uchun `DomainAxis` ga `mode` qo'shiladi: `ray` (hozirgisi, standart), `interval`
(ikki chegara, har birining o'z nuqta turi bilan), `point` (bitta nuqta, yo'nalishsiz).
Uchala rejimda ham nuqta turi so'raladi — `TIPLAR §2.1` p. 5 shuni talab qiladi.

**Bu buzmaydigan qo'shimcha:** 1-4-darslar `mode` bermaydi, demak ular avvalgidek
`ray` bo'lib qolaveradi.

**C blokida (14-17) yana ikkitasi kerak bo'ladi** va buni oldindan aytib qo'yaman:
`two-rays` (`x < a yoki x > b`) va oraliqlar usuli uchun **bir nechta oraliqni belgilash**.
Ularni C blokining skeletida yozaman — hozir yozib qo'yish «hali hech kim
ishlatmaydigan mexanika» bo'lardi.

Boshqa yangi mexanika kerak emas: o'ntasi ham joyida.

---

## 3. BESHINCHI DARS — GRAFIKLARNI KO'CHIRISH

**Tasdiqlar.** T1 `y = (x − x₀)² + y₀` — `y = ax²` dan `x₀` va `y₀` ga siljigan.
T2 qavs ichidagi son ishorasi teskari ishlaydi. T3 `a` faqat shaklni o'zgartiradi,
o'rnini hech qachon.

**Xatolar.** `ishora-teskari-siljish` · `gorizontal-vertikal-almashinish` ·
`uchi-notogri-oqish` · `a-joyni-ozgartirmaydi`

**Darsning misollari qaytarilmaydi:** `(x − 2)²`, `3(x + 2)² − 1`, `2(x − 4)² + 7`,
`(x + 3)² − 5`, `(x − 5)² + 2`, `−4(x − 1)² + 3`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Jadval 🟢 | `y = (x − 1)² − 4`, jadval: `x` = −1, ?, 0, 3 ; `y` = 0, −4, ?, 0 | `x = 1` (uchi, yagona) ; `y(0) = −3` |
| 02 | Ha/yo'q 🟢 | `y = 2(x + 3)² − 2`: (a) `y = 2x²` dan chapga 3 ga siljigan; (b) uchi `(3; −2)`; (c) 2 koeffitsienti parabolani yon tomonga siljitadi | ha · yo'q · yo'q |
| 03 | Test 🟢 | Qaysi o'zgarish parabolani FAQAT yuqoriga ko'taradi? (a) qavs ichidagi sonni o'zgartirish (b) qavsdan tashqaridagi songa qo'shish (c) `a` ni kattalashtirish (d) `a` ning ishorasini almashtirish | **b** |
| 04 | Belgilash 🟡 | `y = (x + 2)² − 3` uchini tekislikka qo'ying | `(−2; −3)` |
| 05 | Sonlar o'qi 🟡 | `y = (x − 3)² + 1` o'suvchi bo'lgan oraliq (`mode: ray`) | `3`, bo'yalgan, o'ngga |
| 06 | Saralash 🟡 | uch zona: o'ngga siljigan / chapga siljigan / faqat yuqoriga-pastga. `(x − 6)²`, `(x − 7)² + 2` ; `(x + 5)²`, `(x + 1)² − 3` ; `x² + 6`, `x² − 8` | |
| 07 | Javobni kiritish 🟡 | `y = (x + 7)² − 5` uchining abssissasi | `−7` |
| 08 | Xato qator 🔴 | `y = (x + 4)² − 1` uchini topish: (1) formula (2) `x₀ = 4`, `y₀ = −1` (3) uchi `(4; −1)` (4) javob | **2-qator** |
| 09 | So'zlar 🔴 | Qavs ichidagi son ishorasi **[teskari]** ishlaydi: qavsda minus tursa, parabola **[o'ngga]** siljiydi. `a` koeffitsienti esa parabolaning **[shaklini]** o'zgartiradi, o'rnini emas. Tuzoqlar: `to'g'ri`, `chapga`, `o'rnini` | |
| 10 | Tartib 🔴 | `y = (x + 1)² − 4` ni yasash: (1) yozuvni `y = (x − x₀)² + y₀` bilan solishtiramiz (2) `x₀ = −1`, `y₀ = −4` (3) uchini qo'yamiz (4) `y = x²` ni shu uchidan chizamiz (5) tekshirish: `x = 0` da `y = −3` | |

**Tuzoqlar.** 01: `x` katagiga `−4` (qatorlar almashdi), `−1` (ishora). 04: `(2; −3)`,
`(−2; 3)`. 07: `7`, `−5`. 08: 1-qator (formula to'g'ri), 3 va 4 (ikkinchisining takrori).

**Qoplash.** T1: 01, 04, 08, 10 · T2: 02, 03, 07, 09 · T3: 02, 03, 06, 09
`ishora-teskari-siljish`: 02, 07, 08, 09 · `gorizontal-vertikal-almashinish`: 03, 06 ·
`uchi-notogri-oqish`: 01, 04, 05, 10 · `a-joyni-ozgartirmaydi`: 02, 03

---

## 4. OLTINCHI DARS — KVADRAT TENGSIZLIKLAR

**Tasdiqlar.** T1 uch hadni ko'paytuvchilarga ajratib, chiziqli tengsizliklar sistemasiga
keltirish mumkin. T2 grafik `Ox` dan yuqorida — funksiya musbat, pastda — manfiy.
T3 qat'iy tengsizlikda chegara nol javobga kirmaydi, qat'iy bo'lmaganda kiradi.

**Xatolar.** `javob-doim-bitta-oraliq` · `javob-doim-tashqi-oraliq` ·
`belgi-almashtirish-notogri` · `chegara-nuqta-kiritish`

**Darsning misollari qaytarilmaydi:** `(x − 1)(x − 4)`, `(x − 2)(x − 3)`, `(x + 2)(x − 3)`,
`(x − 3)(x + 1)`, `(x + 4)(x − 2)`, `(x + 2)(x − 5)`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Ha/yo'q 🟢 | `(x − 2)(x − 6) < 0`: (a) javob ichki oraliq `2 < x < 6`; (b) javob ikkita tashqi nur; (c) chegara nuqtalari javobga kiradi | ha · yo'q · yo'q |
| 02 | Jadval 🟢 | `y = (x + 1)(x − 5)`, jadval: `x` = −2, −1, ?, 5, 6 ; `y` = 7, 0, −9, 0, ? | `x = 2` (uchi, yagona) ; `y(6) = 7` |
| 03 | Test 🟢 | `(x − a)(x − b) > 0`, `a < b`. Javob qanday ko'rinishda? (a) bitta ichki oraliq (b) ikkita nur (c) barcha sonlar (d) yechim yo'q | **b** |
| 04 | Saralash 🟡 | uch zona: ichki oraliq / ikkita nur / barcha sonlar. `(x−1)(x−7) < 0`, `(x+3)(x−2) < 0` ; `(x−1)(x−7) > 0`, `(x+3)(x−2) > 0` ; `x² + 4 > 0`, `(x−2)² + 1 > 0` | |
| 05 | Sonlar o'qi 🟡 | `(x + 1)(x − 5) ≤ 0` javobini o'qda (`mode: interval`) | `−1` va `5`, ikkalasi bo'yalgan |
| 06 | Javobni kiritish 🟡 | `x² − 8x + 12 ≤ 0`: uch hadni nolga aylantiradigan sonlarni yozing | `2; 6` |
| 07 | Belgilash 🟡 | `y = (x − 1)(x − 5)` grafigi chizilgan. Grafik `Ox` bilan kesishgan IKKALA nuqtani belgilang | `(1; 0)` va `(5; 0)` |
| 08 | So'zlar 🔴 | Kvadrat uch hadni **[ko'paytuvchilarga]** ajratgach, grafik `Ox` dan yuqorida bo'lgan oraliqlarda funksiya **[musbat]** bo'ladi. Qat'iy tengsizlikda chegara nollari javobga **[kirmaydi]**. Tuzoqlar: `hadlarga`, `manfiy`, `kiradi` | |
| 09 | Xato qator 🔴 | `(x − 2)(x − 6) < 0`: (1) nollar 2 va 6 (2) tarmoqlar yuqoriga (3) `< 0`, demak javob nollardan tashqarida (4) javob | **3-qator** |
| 10 | Tartib 🔴 | `x² − 2x − 15 > 0`: (1) ko'paytuvchilarga ajratamiz (2) `(x + 3)(x − 5) > 0` (3) nollar −3 va 5 (4) tarmoqlar yuqoriga, `> 0` → tashqarida (5) javob `x < −3` yoki `x > 5` | |

**Tuzoqlar.** 05: nuqtalar bo'sh (`≤` ekani unutildi), chegaralar `1` va `−5` (ishora).
07: uchini `(3; −4)` bosish. 09: 1 yoki 2-qator (ikkalasi to'g'ri), 4-qator (takror).

**Qoplash.** T1: 03, 06, 10 · T2: 01, 04, 07, 08, 09 · T3: 01, 05, 08
`javob-doim-bitta-oraliq`: 03, 04 · `javob-doim-tashqi-oraliq`: 01, 04, 09 ·
`belgi-almashtirish-notogri`: 02, 06, 10 · `chegara-nuqta-kiritish`: 01, 05, 07, 08

---

## 5. YETTINCHI DARS — BUTUN TENGLAMALAR

**Tasdiqlar.** T1 butun ifoda va butun tenglama ta'rifi. T2 qavs oldida minus turganda,
qavs ochilganda HAR bir hadning ishorasi teskariga aylanadi. T3 topilgan ildiz asl
tenglamaga qo'yib tekshiriladi.

**Xatolar.** `qavs-ochish-ishorasi` · `had-kochirish-ishorasi` ·
`tekshirish-otkazib-yuborish` · `butun-vs-kasr-tenglama`

**Darsning misollari qaytarilmaydi:** `2(x − 2) = x + 7`, `12 + 3x = 2x − 10`,
`2(3x − 1)`, `2(x + 3)`, `2(x − 5)`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Test 🟢 | Qavs oldida minus turganda qavs ochilsa nima bo'ladi? (a) faqat birinchi had ishorasi almashadi (b) har bir had ishorasi almashadi (c) hech nima almashmaydi (d) qavs ichidagi amal almashadi | **b** |
| 02 | Jadval 🟢 | `y = 4x − 9`, jadval: `x` = 1, 3, ?, 6 ; `y` = −5, 3, 11, ? | `x = 5` ; `y(6) = 15` |
| 03 | Ha/yo'q 🟢 | (a) `3(x − 4) = x + 2` butun tenglama; (b) `5/(x − 1) = 2` ham butun tenglama; (c) butun tenglamada har bir had ko'phad | ha · yo'q · ha |
| 04 | Sonlar o'qi 🟡 | `2(x − 3) = x + 1` ildizini o'qda belgilang (`mode: point`) | `7`, bo'yalgan |
| 05 | Belgilash 🟡 | `y = 4x − 9` va `y = x + 3` chiziqlari chizilgan. Kesishish nuqtasini belgilang | `(4; 7)` |
| 06 | Saralash 🟡 | uch zona: butun tenglama / kasr-ratsional tenglama / umuman tenglama emas. `3(x−1) = 7`, `x² − 2x = 5` ; `4/(x+2) = 1`, `(x−1)/x = 3` ; `2x + 5`, `x² − 9` | |
| 07 | Javobni kiritish 🟡 | `5 − 2(x − 4) = 3x + 8` ildizini yozing | `1` |
| 08 | Tartib 🔴 | `3(x − 2) = x + 6`: (1) qavsni ochamiz (2) `3x − 6 = x + 6` (3) hadlarni ko'chiramiz: `2x = 12` (4) `x = 6` (5) tekshirish: `3(6 − 2) = 12`, `6 + 6 = 12` | |
| 09 | Xato qator 🔴 | `7 − (x − 3) = 2x`: (1) qavsni ochamiz (2) `7 − x − 3 = 2x` (3) `4 = 3x` (4) `x = 4/3` | **2-qator** (minus faqat birinchi hadga tushdi) |
| 10 | So'zlar 🔴 | Qavs oldida minus turganda, qavs ochilganda har bir hadning ishorasi **[teskariga]** aylanadi. Had tenglamaning ikkinchi tomoniga ko'chirilganda ham uning ishorasi **[almashadi]**. Topilgan ildiz **[asl]** tenglamaga qo'yib tekshiriladi. Tuzoqlar: `o'zgarmasdan`, `saqlanadi`, `soddalashtirilgan` | |

**Tuzoqlar.** 07: `−1`, `3` (qavs ishorasi). 09: 1-qator (to'g'ri), 3-qator (2 dan kelib
chiqadi), 4-qator (oxirgisi).

**Qoplash.** T1: 03, 06 · T2: 01, 07, 09, 10 · T3: 04, 08, 10
`qavs-ochish-ishorasi`: 01, 07, 09, 10 · `had-kochirish-ishorasi`: 02, 08, 10 ·
`tekshirish-otkazib-yuborish`: 04, 08 · `butun-vs-kasr-tenglama`: 03, 06

---

## 6. SAKKIZINCHI DARS — KASR-RATSIONAL TENGLAMALAR

**Tasdiqlar.** T1 ODZ — maxrajni nolga aylantiradigan qiymatlardan tashqari barcha sonlar.
T2 har bir ildiz ODZ bilan solishtiriladi, chetga chiqqani begona ildiz.
T3 yagona ildiz begona bo'lsa, yechim yo'q — bu ham to'liq javob.

**Xatolar.** `maxraj-nolga-teng` · `begona-ildizni-qabul-qilish` · `yechim-yoq-holati` ·
`butun-deb-kasr-oqish`

**Darsning misollari qaytarilmaydi:** `(x + 1)/(2x − 8) = 4`, `2/(x + 6) = 3`,
`3/(x + 7) = 1`, `(2x − 1)/(x − 3)`, `(x + 4)/(x − 1)`.

| # | Mexanika | Topshiriq | Javob |
|---:|---|---|---|
| 01 | Jadval 🟢 | `y = 12/(x − 2)`, jadval: `x` = −1, ?, 4, 5 ; `y` = −4, −12, 6, ? | `x = 1` ; `y(5) = 4` |
| 02 | Test 🟢 | Nima uchun kasr-ratsional tenglamada javob oxirida ODZ bilan solishtiriladi? (a) hisob xato bo'lishi mumkin (b) maxrajlarga ko'paytirish yangi ildiz keltirib chiqarishi mumkin (c) ODZ javobni chiroyli qiladi (d) shunday qabul qilingan | **b** |
| 03 | Ha/yo'q 🟢 | `9/(x − 3) = 3` uchun: (a) ODZ — `x ≠ 3`; (b) topilgan ildiz `x = 6` ODZ ga kiradi; (c) `x = 3` ham ildiz bo'lishi mumkin | ha · ha · yo'q |
| 04 | Belgilash 🟡 | `y = 6/(x + 1)` grafigi chizilgan. `x = 2` ga mos nuqtani qo'ying | `(2; 2)` |
| 05 | Saralash 🟡 | uch zona: ODZ `x ≠ 0` / ODZ `x ≠ 4` / ODZ barcha sonlar. `5/x`, `(x+1)/x` ; `7/(x−4)`, `2/(x−4)` ; `x/(x²+1)`, `3/(x²+2)` | |
| 06 | Sonlar o'qi 🟡 | `5/(x − 4) = 1` uchun ODZ dan chiqarib tashlangan sonni o'qda belgilang (`mode: point`) | `4`, **bo'sh** nuqta |
| 07 | Javobni kiritish 🟡 | `10/(x + 3) = 2` ildizini yozing | `2` |
| 08 | Xato qator 🔴 | `(x² − 4)/(x − 2) = 0`: (1) ODZ: `x ≠ 2` (2) surat nolga teng: `x² − 4 = 0` (3) `x = 2` va `x = −2`, ikkalasi ham ildiz (4) javob `x = 2; −2` | **3-qator** (`x = 2` ODZ dan chiqarilgan) |
| 09 | Tartib 🔴 | `8/(x − 1) = 4`: (1) ODZ: `x ≠ 1` (2) ikkala tomonni `x − 1` ga ko'paytiramiz (3) `8 = 4(x − 1)` (4) `x = 3` (5) ODZ bilan solishtiramiz: `3 ≠ 1`, ildiz mos | |
| 10 | So'zlar 🔴 | Maxrajida harf bo'lgan tenglamada avval **[ODZ]** yoziladi. Maxrajlarga ko'paytirilgach hosil bo'lgan ildiz ODZ dan chetga chiqsa, u **[begona]** ildiz deyiladi. Agar yagona ildiz begona bo'lsa, tenglamaning **[yechimi yo'q]**. Tuzoqlar: `javob`, `qo'shimcha`, `cheksiz ko'p yechimi bor` | |

**Tuzoqlar.** 01: `x` katagiga `−12`. 04: `(2; 6)` (maxraj hisobga olinmadi). 06: nuqta
bo'yalgan (ODZ dan chiqarilgan son javobga kirmaydi). 08: 1 va 2-qator (ikkalasi to'g'ri),
4-qator (uchinchisining takrori).

**Qoplash.** T1: 03, 05, 06, 10 · T2: 02, 03, 08, 09, 10 · T3: 08, 10
`maxraj-nolga-teng`: 03, 05, 06 · `begona-ildizni-qabul-qilish`: 02, 08, 09, 10 ·
`yechim-yoq-holati`: 10 · `butun-deb-kasr-oqish`: 01, 02, 04, 07

---

## 7. NIMA TASDIQLANISHI KERAK

1. **Uch blokka bo'lish** (§0): A = 5-8, B = 9-13, C = 14-17.
2. **`DomainAxis` ga uch rejim** (§2): `ray`, `interval`, `point`. C blokida yana ikkitasi
   kerak bo'ladi va u yerda yoziladi.
3. Qirq topshiriqning mavzusi va javoblari (§3-§6).

Tasdiqlasangiz, A bloki bo'yicha 2-bosqichga o'taman: 40 topshiriqning to'liq UZ/RU/EN
matni, keyin sborka va tekshiruv (5 o'lcham x 3 til).
