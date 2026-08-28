# DARS02_04_AMALIYOT_SKELET — 9-sinf, 2-4-darslar amaliyoti, SKELET (1-bosqich)

> Metodist topshirig'i 2026-08-27: **2, 3, 4-darslar amaliyoti 1-darsdagi AYNAN O'SHA
> o'nta mexanikada quriladi, faqat ketma-ketligi boshqa.**
>
> Kirish: `TIPLAR_AMALIYOT_9SINF.md` (pul kontrakti), `DARS01_AMALIYOT_SKELET.md`
> (yaqin namuna), `src/components/grade9/Dars02.jsx`, `Dars03.jsx`, `Dars04.jsx`
> (`STATEMENTS`, `MISS`, darsning matematikasi).
>
> Chiqish: `src/components/grade9/practice/dars02…dars04/`.
>
> Kontent (to'liq UZ/RU/EN matn) 2-bosqichda, faqat shu skelet tasdiqlangandan keyin.

---

## 0. RASKLADKA ENDI SKRIPTDAN CHIQADI

`TIPLAR_AMALIYOT_9SINF.md` §3 p. 1 raskladka dars nomeri bilan aniqlanishini talab
qiladi. Shu qoida endi kodda: `scripts/grade9-practice-layout.mjs`.

**Qoida.** O'nta mexanika qiyinlik o'qi bo'yicha uchta guruhga bo'lingan va har guruh
faqat **o'z ichida** aralashadi:

| Guruh | Pozitsiyalar | Mexanikalar |
|---|---|---|
| yashil | 1-3 | Test · Jadval · Ha/yo'q |
| sariq | 4-7 | Belgilash · Saralash · Javobni kiritish · Sonlar o'qi |
| qizil | 8-10 | Tartib · Xato qator · So'zlar |

Bu bitta qaror uchta qoidani avtomatik bajaradi: 1-pozitsiyada boshqaruvi ravshan
mexanika turadi (§3 p. 3), «Xato qator» 7-10 da qoladi (§3 p. 4), yonma-yon bir xil tip
bo'lmaydi (§3 p. 2). Skript 52 darsning hammasini tekshirib chiqadi — buzilish yo'q.

**`n = 1` da skript 1-darsning yig'ilgan tartibini AYNAN qaytaradi** — ya'ni qoida
o'tmishga ham to'g'ri keladi, keyin o'ylab topilgan narsa emas.

| # | 1-dars | 2-dars | 3-dars | 4-dars |
|---:|---|---|---|---|
| 1 🟢 | Test | **Jadval** | **Ha/yo'q** | Test |
| 2 🟢 | Jadval | **Test** | **Test** | **Ha/yo'q** |
| 3 🟢 | Ha/yo'q | Ha/yo'q | **Jadval** | **Jadval** |
| 4 🟡 | Belgilash | **Saralash** | **Javobni kiritish** | **Sonlar o'qi** |
| 5 🟡 | Saralash | **Belgilash** | Saralash | Saralash |
| 6 🟡 | Javobni kiritish | **Sonlar o'qi** | **Belgilash** | **Javobni kiritish** |
| 7 🟡 | Sonlar o'qi | **Javobni kiritish** | Sonlar o'qi | **Belgilash** |
| 8 🔴 | Tartib | **Xato qator** | **So'zlar** | Tartib |
| 9 🔴 | Xato qator | **Tartib** | **Tartib** | **So'zlar** |
| 10 🔴 | So'zlar | So'zlar | **Xato qator** | **Xato qator** |

---

## 1. UCH DARSNING TASDIQ VA XATOLARI

Hammasi nazariy darslardan olingan, yangi tasdiq taklif qilinmagan.

### 2-dars — Funksiyaning xossalari

| | |
|---|---|
| T1 | Oraliqda kattaroq `x` ga kattaroq `y` mos kelsa, funksiya o'suvchi |
| T2 | Juft funksiyada `y(−x) = y(x)`, grafik `Oy` ga nisbatan oyna kabi simmetrik |
| T3 | Toq funksiyada `y(−x) = −y(x)`, grafik boshga nisbatan burilish bilan simmetrik |

| Teg | Xato |
|---|---|
| `oldinga-orqaga` | argument o'sishi funksiya o'sishi bilan aralashtirildi |
| `bitta-tarmoq` | butun grafik bitta yo'nalishda deb olindi, burilish ko'rilmadi |
| `oyna-vs-burilish` | oyna simmetriyasi bilan burilish simmetriyasi aralashtirildi |
| `bitta-nuqtada-xulosa` | juftlik yoki toqlik bitta songa qo'yib xulosa qilindi |

### 3-dars — Kvadrat funksiya

| | |
|---|---|
| T1 | `y = ax² + bx + c` (`a ≠ 0`) ko'rinishidagi funksiya kvadrat funksiya |
| T2 | Funksiyaning noli — `y` nolga aylanadigan `x`; uchi — grafikning burilish nuqtasi |
| T3 | `a` kattalashsa parabola torayadi, manfiy `a` da pastga qaraydi |

| Teg | Xato |
|---|---|
| `tenglama-vs-funksiya` | kvadrat funksiya kvadrat tenglama bilan aralashtirildi |
| `nol-koeff-a` | `a ≠ 0` sharti unutildi |
| `nol-vs-vershina` | funksiya noli bilan uchi aralashtirildi |
| `a-kattaligi-ishorasi` | `a` ning kattaligi yoki ishorasi teskari tushunildi |

### 4-dars — Parabola

| | |
|---|---|
| T1 | Uchi `x₀ = −b/(2a)`, `y₀ = y(x₀)` formulalari bilan topiladi |
| T2 | Simmetriya o'qi — uchidan o'tuvchi TIK chiziq, `Ox` ning o'zi emas |
| T3 | Grafik besh nuqtadan yig'iladi: uchi, ikki nol, uchiga simmetrik ikki nuqta |

| Teg | Xato |
|---|---|
| `x0-formula-belgisi` | `x₀` formulasida ishora xato qo'yildi |
| `simmetriya-oqi-vertikal` | simmetriya o'qi `Ox` yoki gorizontal chiziq deb o'ylandi |
| `nollarsiz-grafik` | grafik faqat uchi bilan chizilishga urinildi |
| `nosimmetrik-nuqtalar` | qo'shimcha nuqtalar uchiga nisbatan simmetrik olinmadi |

**Darsning o'z misollari amaliyotda QAYTARILMAYDI.** 2-darsda ishlatilgan: `y = x²`,
`y = x³`, `y = 2x + 1`, harorat grafigi. 3-darsda: `x² − 3x`, `x² − 5x + 6`, `x² + 2x − 3`,
`x² − 4`, `−x²`, `2x²`, `−3x²`. 4-darsda: `x² − 4x + 3`, `x² − 2x − 3`, `x² − 6x + 5`,
`x² − 6x + 1`, `−x² + 8x`, `−2x² + 4x + 1`, `x² − 5`. Quyidagi topshiriqlarda ularning
bittasi ham yo'q.

---

## 2. IKKINCHI DARS — O'NTA TOPSHIRIQ

### 02-01. Jadval 🟢 — `oyna-vs-burilish`, T3

`y = 5x`. Gorizontal jadval, ikkita katak bo'sh:

| x | −2 | −1 | 1 | **?** |
|---|---|---|---|---|
| y | **?** | −5 | 5 | 10 |

**To'g'ri:** `y(−2) = −10`; `x = 2`. Bo'sh `x` katagi ATAYIN teskari yo'nalishda.

Tuzoqlar: `y(−2)` ga `10` (ishora tushib qoldi — bu aynan juftlik bilan toqlikni
aralashtirish); `x` katagiga `10` (qatorlar almashdi).

### 02-02. Test 🟢 — `bitta-nuqtada-xulosa`, T2 T3

**Berilgan:** biror funksiya uchun `y(1) = 3` va `y(−1) = 3`.

**Savol.** Bundan qanday xulosa chiqadi?

| | Variant | |
|---|---|---|
| a | Funksiya juft | xato |
| b | Funksiya toq | xato |
| c | Funksiya na juft, na toq | xato |
| d | Bitta sonda tekshirish yetarli emas | **to'g'ri** |

Darslikning o'zi buni `y = 2x + 1` misolida rad etadi (nazariy darsning 12-ekrani).

### 02-03. Ha/yo'q 🟢 — `bitta-tarmoq`, `oldinga-orqaga`, T1 T2

**Berilgan.** `y = f(x)` grafigi `[−4; 4]` da: `(−4; 2)` dan pasayib `(0; −2)` ga tushadi,
so'ng `(4; 2)` ga ko'tariladi (uchi `(0; −2)`).

| | Hukm | Javob |
|---|---|---|
| a | `[0; 4]` oralig'ida funksiya o'suvchi | **ha** |
| b | Butun `[−4; 4]` da funksiya o'suvchi | **yo'q** |
| c | Grafik `Oy` o'qiga nisbatan simmetrik | **ha** |

### 02-04. Saralash 🟡 — `oyna-vs-burilish`, T2 T3

Uch zona: **Juft** / **Toq** / **Na juft, na toq**.

| Zona | Yozuvlar |
|---|---|
| Juft | `y = x⁴` ; `y = x² − 6` |
| Toq | `y = −2x` ; `y = x⁵` |
| Na juft, na toq | `y = 2x + 7` ; `y = x³ + 1` |

Tuzoq: `x³ + 1` — toq funksiyaga qo'shilgan son toqlikni buzadi; `x² − 6` — ayrilgan son
juftlikni buzmaydi.

### 02-05. Belgilash 🟡 — `oyna-vs-burilish`, T3

**Berilgan.** Funksiya TOQ. Tekislikda uning grafigining bitta nuqtasi belgilangan:
`(2; 3)`.

**Topshiriq.** Toqlik bo'yicha unga mos nuqtani qo'ying.

**To'g'ri:** `(−2; −3)`.

Tuzoqlar: `(−2; 3)` — oyna simmetriyasi qo'llanildi, ya'ni funksiya juft deb olindi
(aynan `oyna-vs-burilish`); `(2; −3)` — faqat qiymatning ishorasi almashtirildi.

### 02-06. Sonlar o'qi 🟡 — `bitta-tarmoq`, `oldinga-orqaga`, T1

**Berilgan.** Grafik chizilgan, burilish nuqtasi `x = 1` da, undan chapda pasayadi,
o'ngda ko'tariladi.

**Topshiriq.** Funksiya o'suvchi bo'lgan oraliqni o'qda ko'rsating.

**To'g'ri:** chegara `1`, nuqta **bo'yalgan**, o'ngga.

Tuzoqlar: chapga (kamayish oralig'i olindi); bo'sh nuqta.

### 02-07. Javobni kiritish 🟡 — `bitta-nuqtada-xulosa`, T3

**Berilgan.** `y = x³ − x` — toq funksiya, va `y(3) = 24`.

**Topshiriq.** `y(−3)` ni yozing.

**To'g'ri:** `−24`.

Tuzoqlar: `24` (juft deb olindi); `0`; `−24` ni hisoblab emas, xossadan olish kutiladi —
razbor shuni ko'rsatadi.

### 02-08. Xato qator 🔴 — `bitta-nuqtada-xulosa`, T2 T3

**Berilgan yechim.** `y = x² + x` juftmi yoki toqmi?

| Qator | Matn |
|---:|---|
| 1 | `y(1) = 1 + 1 = 2` |
| 2 | `y(−1) = 1 − 1 = 0` |
| 3 | `y(−1) ≠ y(1)`, demak funksiya toq |
| 4 | Javob: funksiya toq |

**To'g'ri:** birinchi xato — **3-qator**. Juft emasligidan toqlik chiqmaydi: toqlik uchun
`y(−x) = −y(x)` kerak, bu yerda `0 ≠ −2`.

### 02-09. Tartib 🔴 — `bitta-nuqtada-xulosa`, T2

`y = 4 − x²` funksiyasining juftligini isbotlash qadamlari:

| To'g'ri tartib | Kartochka |
|---:|---|
| 1 | Aniqlanish sohasi butun sonlar o'qi, u nolga nisbatan simmetrik |
| 2 | `y(−x) = 4 − (−x)²` |
| 3 | `(−x)² = x²`, demak `y(−x) = 4 − x²` |
| 4 | `y(−x) = y(x)` |
| 5 | Javob: funksiya juft |

Birinchi qadam ATAYIN soha haqida: bitta songa qo'yish isbot emas, isbot HAR QANDAY `x`
uchun yuritiladi.

### 02-10. So'zlar 🔴 — T1 T2 T3

> Agar oraliqda kattaroq `x` ga kattaroq `y` mos kelsa, funksiya shu oraliqda
> **[o'suvchi]**. Juft funksiyaning grafigi **[Oy]** o'qiga nisbatan simmetrik, toq
> funksiyaning grafigi esa koordinatalar **[boshiga]** nisbatan simmetrik.

Bank: `o'suvchi` · `Oy` · `boshiga` · **`kamayuvchi`** · **`Ox`** · **`uchiga`**

---

## 3. UCHINCHI DARS — O'NTA TOPSHIRIQ

### 03-01. Ha/yo'q 🟢 — `tenglama-vs-funksiya`, `nol-koeff-a`, T1

**Berilgan:** `y = 3x² − 12`.

| | Hukm | Javob |
|---|---|---|
| a | Bu yozuv kvadrat funksiya | **ha** |
| b | `3x² − 12 = 0` yozuvi ham kvadrat funksiya | **yo'q** |
| c | `a` nolga teng bo'lganda ham funksiya kvadrat bo'lib qolaveradi | **yo'q** |

### 03-02. Test 🟢 — `nol-koeff-a`, T1

**Savol.** Qaysi yozuv kvadrat funksiya EMAS?

| | Variant | |
|---|---|---|
| a | `y = x² − 7` | kvadrat funksiya |
| b | `y = 5x² + x` | kvadrat funksiya |
| c | `y = 0·x² + 4x − 1` | **kvadrat funksiya emas** |
| d | `y = −x² + 2x + 9` | kvadrat funksiya |

### 03-03. Jadval 🟢 — `nol-vs-vershina`, T2

`y = x² − 9`.

| x | −3 | **?** | 2 | 3 |
|---|---|---|---|---|
| y | 0 | −9 | **?** | 0 |

**To'g'ri:** `x = 0` (bu YAGONA son — uchi); `y(2) = −5`.

Teskari katak ataylab UCHIGA qo'yilgan: qolgan qiymatlar ikki `x` da uchraydi, uchi esa
bitta. Jadvalda nollar (`−3` va `3`) ham ko'rinib turadi — `nol-vs-vershina` shu yerda
ochiladi.

### 03-04. Javobni kiritish 🟡 — `nol-vs-vershina`, T2

**Topshiriq.** `y = x² − 6x` funksiyasining barcha nollarini yozing.

**To'g'ri:** `0; 6`.

Tuzoqlar: faqat `6` (`x` ni qavsdan chiqarish qolib ketdi); `3` (uchi berildi); `−6`.

### 03-05. Saralash 🟡 — `a-kattaligi-ishorasi`, T3

Solishtirish asosi `y = x²` — shartda aytiladi. Uch zona:

| Zona | Yozuvlar |
|---|---|
| `y = x²` dan TOR, yuqoriga | `y = 4x²` ; `y = 3x²` |
| `y = x²` dan KENG, yuqoriga | `y = 0,2x²` ; `y = 0,5x²` |
| Pastga qaragan | `y = −5x²` ; `y = −0,5x²` |

Tuzoq: `−0,5x²` — u ham keng, lekin zonani YO'NALISH hal qiladi; `0,2x²` — kichik son
parabolani toraytirmaydi, kengaytiradi.

### 03-06. Belgilash 🟡 — `nol-vs-vershina`, T2

**Berilgan.** Parabola chizilgan: nollari `−1` va `3`, uchi `(1; −4)`.

**Topshiriq.** Funksiyaning uchini belgilang.

**To'g'ri:** `(1; −4)`.

Tuzoqlar: `(−1; 0)` yoki `(3; 0)` — nol uchi deb olindi; `(1; 0)` — uchining faqat
abssissasi olindi, ordinatasi `Ox` dan.

### 03-07. Sonlar o'qi 🟡 — `nol-vs-vershina`, T2

**Topshiriq.** `y = x² − 4` funksiyasi qaysi `x` lardan boshlab musbat qiymat oladi?
O'qda ko'rsating.

**To'g'ri:** chegara `2`, nuqta **bo'sh**, o'ngga.

Tuzoqlar: bo'yalgan nuqta (`x = 2` da qiymat nol, musbat emas — nol chegarani KESADI);
chegara `4` (`x²` bilan `x` aralashdi); chapga.

### 03-08. So'zlar 🔴 — T1 T2 T3

> `y = ax² + bx + c` ko'rinishidagi funksiya kvadrat funksiya deyiladi, bunda `a`
> **[nolga teng emas]**. Funksiyaning **[noli]** — `y` nolga aylanadigan `x` qiymati.
> `a` soni kattalashsa parabola **[torayadi]**.

Bank: `nolga teng emas` · `noli` · `torayadi` · **`birga teng`** · **`uchi`** ·
**`kengayadi`**

### 03-09. Tartib 🔴 — `nol-vs-vershina`, `tenglama-vs-funksiya`, T2

`y = x² + 2x − 8` funksiyasining nollarini topish qadamlari:

| To'g'ri tartib | Kartochka |
|---:|---|
| 1 | Funksiyaning noli — `y` nolga aylanadigan `x` |
| 2 | `x² + 2x − 8 = 0` |
| 3 | `x₁ = −4`, `x₂ = 2` |
| 4 | Javob: nollar `−4` va `2` |
| 5 | Tekshirish: `x = 2` da `4 + 4 − 8 = 0` |

Bu yerda funksiyadan TENGLAMAGA o'tish qadami ko'rinadi — `tenglama-vs-funksiya` shu
qadamda tugaydi: tenglama funksiyaning noli topilayotgan payt paydo bo'ladi, undan oldin
emas.

### 03-10. Xato qator 🔴 — `nol-koeff-a`, T1

**Berilgan yechim.** `y = 5 − 2x²` funksiyasining `a` koeffitsientini toping.

| Qator | Matn |
|---:|---|
| 1 | Yozuvni `y = ax² + bx + c` ko'rinishiga solishtiramiz |
| 2 | Birinchi had `5`, demak `a = 5` |
| 3 | `a = 5`, ya'ni `a ≠ 0` |
| 4 | Javob: `a = 5` |

**To'g'ri:** birinchi xato — **2-qator**. `a` — birinchi had emas, `x²` OLDIDAGI son,
ya'ni `a = −2`.

---

## 4. TO'RTINCHI DARS — O'NTA TOPSHIRIQ

### 04-01. Test 🟢 — `x0-formula-belgisi`, T1

**Berilgan:** `y = 2x² − 8x + 1` va `y = 2x² − 8x + 9`.

**Savol.** Bu ikki parabolaning uchlari haqida nima deyish mumkin?

| | Variant | |
|---|---|---|
| a | Uchlarining abssissalari bir xil | **to'g'ri** |
| b | Uchlarining ordinatalari bir xil | xato |
| c | Ikkalasining ham uchi `Oy` o'qida | xato |
| d | Uchlari bir-biriga umuman bog'liq emas | xato |

Savol MANTIQIY, hisob emas (`TIPLAR §2.1` p. 1): `x₀ = −b/(2a)` formulasida `c` umuman
qatnashmaydi, demak ozod hadning o'zgarishi uchining abssissasiga ta'sir qilmaydi —
ordinatasiga esa qiladi. Javob to'rtta tayyor sondan tanlanmaydi, MULOHAZADAN chiqadi.

### 04-02. Ha/yo'q 🟢 — `simmetriya-oqi-vertikal`, T2

**Berilgan:** `y = x² − 6x + 8`, uchi `(3; −1)`.

| | Hukm | Javob |
|---|---|---|
| a | Simmetriya o'qi — `x = 3` tik chizig'i | **ha** |
| b | Simmetriya o'qi — `y = −1` gorizontal chizig'i | **yo'q** |
| c | Parabolaning ikki tarmog'i shu o'qqa nisbatan simmetrik | **ha** |

### 04-03. Jadval 🟢 — `nosimmetrik-nuqtalar`, T3

`y = x² + 4x + 3`.

| x | −4 | −3 | **?** | −1 | 0 |
|---|---|---|---|---|---|
| y | 3 | 0 | −1 | 0 | **?** |

**To'g'ri:** `x = −2` (uchi, yagona son); `y(0) = 3`.

Jadval simmetriyani ko'rsatib turadi: chetlarda ikkala qiymat ham `3`, nollar `−3` va
`−1`, o'rtada uchi.

### 04-04. Sonlar o'qi 🟡 — `x0-formula-belgisi`, T1

**Topshiriq.** `y = x² − 8x + 12` funksiyasi qaysi `x` lardan boshlab o'sadi? O'qda
ko'rsating.

**To'g'ri:** chegara `4`, nuqta **bo'yalgan**, o'ngga.

Tuzoqlar: chegara `−4` (ishora); chegara `8` (`2a` unutildi); chapga (kamayish).

### 04-05. Saralash 🟡 — `x0-formula-belgisi`, T1

Uch zona — uchi `Oy` o'qiga nisbatan qayerda:

| Zona | Yozuvlar |
|---|---|
| Chapda (`x₀ < 0`) | `y = x² + 6x` ; `y = x² + 2x + 5` |
| `Oy` o'qida (`x₀ = 0`) | `y = x² − 7` ; `y = 3x² + 1` |
| O'ngda (`x₀ > 0`) | `y = x² − 10x` ; `y = 2x² − 4x` |

Butun zona `−b/(2a)` ning ISHORASI bilan hal qilinadi — hisoblash shart emas, lekin
ishorani chalkashtirish darrov ko'rinadi.

### 04-06. Javobni kiritish 🟡 — `x0-formula-belgisi`, T1

**Topshiriq.** `y = −x² + 6x − 5` parabolasi uchining ordinatasi `y₀` ni yozing.

**To'g'ri:** `4`. (`x₀ = 3`, `y₀ = −9 + 18 − 5 = 4`.)

Tuzoqlar: `3` (abssissa berildi); `−4`; `14` (`x₀` ni formulaga qo'yishda ishora xatosi).

### 04-07. Belgilash 🟡 — `nosimmetrik-nuqtalar`, `simmetriya-oqi-vertikal`, T3

**Berilgan.** `y = x² + 6x + 5` parabolasi chizilgan, uchi `(−3; −4)`. Grafikda `(−1; 0)`
nuqtasi belgilangan.

**Topshiriq.** Unga simmetrik nuqtani qo'ying.

**To'g'ri:** `(−5; 0)`.

Tuzoqlar: `(1; 0)` — `Oy` o'qiga nisbatan aks ettirildi, simmetriya o'qiga emas (aynan
`simmetriya-oqi-vertikal`); `(−3; 0)` — uchining abssissasi olindi.

### 04-08. Tartib 🔴 — `nollarsiz-grafik`, T3

`y = x² − 4x` grafigini yasash qadamlari:

| To'g'ri tartib | Kartochka |
|---:|---|
| 1 | Uchini topamiz: `x₀ = −b/(2a)` |
| 2 | `x₀ = 2`, `y₀ = −4` |
| 3 | Nollarni topamiz: `x² − 4x = 0`, `x = 0` va `x = 4` |
| 4 | Uchiga nisbatan simmetrik ikki nuqta: `(1; −3)` va `(3; −3)` |
| 5 | Besh nuqtadan parabolani o'tkazamiz |

### 04-09. So'zlar 🔴 — T1 T2 T3

> Uchining abssissasi topilgach, ordinatasi uni **[formulaga qo'yib]** hisoblanadi.
> Simmetriya o'qi — uchidan o'tuvchi **[tik]** chiziq. Grafik uchi, ikki **[nol]** va
> uchiga nisbatan simmetrik ikki qo'shimcha nuqtadan yig'iladi.

Bank: `formulaga qo'yib` · `tik` · `nol` · **`jadvaldan`** · **`gorizontal`** ·
**`uchi`**

### 04-10. Xato qator 🔴 — `x0-formula-belgisi`, T1

**Berilgan yechim.** `y = x² + 10x + 7` parabolasi uchining abssissasini toping.

| Qator | Matn |
|---:|---|
| 1 | `x₀ = −b/(2a)` |
| 2 | `a = 1`, `b = 10` |
| 3 | `x₀ = 10/2 = 5` |
| 4 | Javob: `x₀ = 5` |

**To'g'ri:** birinchi xato — **3-qator**. Formulada `b` ning oldida minus turibdi:
`x₀ = −10/2 = −5`.

---

## 5. QOPLASH JADVALLARI

`TIPLAR_AMALIYOT_9SINF.md` §3 p. 6 — tanlab emas, hammasi.

**2-dars**

| | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| T1 | | | • | | | • | | | | • |
| T2 | | • | • | • | | | | • | • | • |
| T3 | • | • | | • | • | | • | • | | • |
| `oldinga-orqaga` | | | • | | | • | | | | |
| `bitta-tarmoq` | | | • | | | • | | | | |
| `oyna-vs-burilish` | • | | | • | • | | | | | • |
| `bitta-nuqtada-xulosa` | | • | | | | | • | • | • | |

**3-dars**

| | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| T1 | • | • | | | | | | • | | • |
| T2 | | | • | • | | • | • | • | • | |
| T3 | | | | | • | | | • | | |
| `tenglama-vs-funksiya` | • | | | | | | | | • | |
| `nol-koeff-a` | • | • | | | | | | • | | • |
| `nol-vs-vershina` | | | • | • | | • | • | | • | |
| `a-kattaligi-ishorasi` | | | | | • | | | • | | |

**4-dars**

| | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| T1 | • | | | • | • | • | | • | • | • |
| T2 | | • | | | | | • | | • | |
| T3 | | | • | | | | • | • | • | |
| `x0-formula-belgisi` | • | | | • | • | • | | | | • |
| `simmetriya-oqi-vertikal` | | • | | | | | • | | • | |
| `nollarsiz-grafik` | | | | | | | | • | • | |
| `nosimmetrik-nuqtalar` | | | • | | | | • | | | |

---

## 6. TEXNIKA

Hammasi 1-dars bilan bir xil: javob bir marta tekshiriladi, razbor darrov o'sha
topshiriqda chiqadi, maslahat tugmasi yo'q, matematika til blokidan tashqarida,
amaliyotda ovoz yo'q, UZ `siz`, RU `ты`.

**Yangi mexanika kerak emas.** O'nta mexanikaning hammasi 1-darsda yozilgan va
tekshirilgan. `DomainAxis` bu uch darsda ham bitta chegara bilan ishlaydi (o'suvchi
oraliq, musbat qiymatlar oralig'i) — ikki chegarali oraliq bu blokda uchramaydi.

**Reestrda uch qator qo'shiladi** (`src/lessons/grade9.js` dagi `grade9Amaliy`):
`dars02-amaliyot`, `dars03-amaliyot`, `dars04-amaliyot`.

**Tekshiruv** — `scripts/grade9-practice-plan.mjs` ga uch dars qo'shiladi, keyin
`node scripts/grade9-practice-check.mjs` va `G9_WRONG=1 …` (5 o'lcham x 3 til).
