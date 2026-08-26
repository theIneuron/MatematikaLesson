# DARS01_AMALIYOT_SKELET — 9-sinf, 1-dars amaliyoti, SKELET (1-bosqich)

> Metodist topshirig'i 2026-08-26. Bu **1-bosqich**: o'nta topshiriqning karkasi. Kontent
> (to'liq UZ/RU/EN matn) 2-bosqichda, faqat shu skelet tasdiqlangandan keyin.
>
> Kirish hujjatlari: `TIPLAR_AMALIYOT_9SINF.md` (o'nta mexanikaning kontrakti),
> `src/components/grade9/Dars01.jsx` (`STATEMENTS`, `MISS`, darsning matematikasi),
> `ETALON_9SINF.md`, `src/books/METODIK_PROFIL_MATEMATIKA.md`.
>
> Chiqish: `src/components/grade9/practice/dars01/D01_01…10.jsx`.

---

## 0a. METODIST QARORLARI, SHU REDAKSIYANING SABABI

**2026-08-26, skeletning birinchi variantiga javob:**

1. **Mexanikalarning nomlari qoladi** — Test, Ha/yo'q, Javobni kiritish, Belgilash,
   Sonlar o'qi, Jadval, Saralash, Tartib, Xato qator, Moslashtirish (oxirgisi ikkinchi
   javobda «So'zlar» ga almashtirildi, pastga qarang).
2. **Personaj yo'q. Topshiriq to'liq matematik tilda yoziladi, masala to'g'ridan-to'g'ri
   aytiladi.** Birinchi variantdagi olma bozori (02), Dilnozaning sayri (03) va idishga
   suv quyilishi (04) OLIB TASHLANDI. Ularning o'rnida jadval bilan va grafik bilan
   berilgan funksiyaning o'zi turadi.
3. **09-topshiriq og'irlik qilmaydi**, `−4` va `+4` javoblari aytilaveradi.
4. **01-topshiriq o'zgartirildi.** Birinchi variantda u so'z bilan berilgan ta'rifni
   tanlash edi — bu 2-qaror bilan to'g'ri kelmaydi. Endi savol matematik: to'rtta juftlik
   to'plamidan qaysi biri funksiya EMAS.

**2026-08-26, ikkinchi javob — yig'ilgan amaliyotga:**

5. **04-topshiriq kuchaytirildi.** Jadval GORIZONTAL yoziladi va funksiyaning o'zi ham
   beriladi, lekin ozod hadi noma'lum: `y = 3x + b`. Ikkita katak bo'sh, ikkita nuqta
   so'raladi. Endi topshiriq «jadvaldan ko'chirish» emas — avval ozod had topiladi.
6. **09-topshiriqdan qo'shimcha savol olib tashlandi.** «Qaysi sonda buziladi» maydoni
   yo'q, faqat to'rt qatorli ketma-ketlik qoladi; tushuntirish to'g'ri javobdan keyin
   `correctText` da beriladi. Narxi `TIPLAR §2.1` p. 9 da ochiq yozilgan.
7. **10-topshiriq almashtirildi.** Moslashtirish o'rniga nazariy qoida beriladi va
   tushib qolgan so'zlar joyiga qo'yiladi (8-sinf amaliyotining `ClozeBank` mexanikasi).
   Pul ham shu bilan o'zgardi: `TIPLAR §2` da 10-mexanika endi «So'zlar».

---

## 0b. TASDIQLAR VA MISKONSEPSIYALAR NAZARIY DARSDAN OLINGAN

Bu skeletda birorta ham yangi tasdiq taklif qilinmagan. Hammasi
`src/components/grade9/Dars01.jsx` dan:

**STATEMENTS**

| Kod | Tasdiq |
|---|---|
| T1 | Argumentning har bir qiymatiga funksiyaning aynan bitta qiymati mos keladi |
| T2 | Aniqlanish sohasi — argument qabul qilishi mumkin bo'lgan barcha qiymatlar |
| T3 | Formula bilan berilgan funksiya formula ma'noga ega bo'lgan joyda aniqlangan |

**MISS**

| Teg | Xato |
|---|---|
| `argument-qiymat` | argument va qiymat almashtirildi |
| `grafik-rasm` | grafik yo'l rasmi deb o'qildi |
| `soha-suratdan` | aniqlanish sohasi formula buziladigan joydan olinmadi |
| `tekshirilmagan` | javob son qo'yib tekshirilmadi |

**Qoplash jadvali** (`TIPLAR_AMALIYOT_9SINF.md` §3 p. 6 — tanlab emas, hammasi):

| | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| T1 | • | • | • | • | | | | | | • |
| T2 | | | | | | | • | | | • |
| T3 | | | | | • | • | • | • | • | • |
| `argument-qiymat` | • | • | • | • | | | | | | • |
| `grafik-rasm` | | | • | • | | | | | | |
| `soha-suratdan` | | | | | • | • | • | | • | • |
| `tekshirilmagan` | | | | | | | | • | • | |

---

## 1. RASKLADKA

Qiyinlik: `🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴`. O'nta mexanika, hech biri takrorlanmaydi.

| # | Mexanika | Qiy. | Teg | Chip nomi (uz) |
|---:|---|:---:|---|---|
| 01 | Test | 🟢 | `argument-qiymat` | Juftliklar |
| 02 | Jadval | 🟢 | `argument-qiymat` | Jadval |
| 03 | Ha/yo'q | 🟢 | `grafik-rasm` | Ha yoki yo'q |
| 04 | Belgilash | 🟡 | `argument-qiymat` | Nuqta |
| 05 | Saralash | 🟡 | `soha-suratdan` | Guruhlar |
| 06 | Javobni kiritish | 🟡 | `soha-suratdan` | Taqiq |
| 07 | Sonlar o'qi | 🟡 | `soha-suratdan` | O'q |
| 08 | Tartib | 🔴 | `tekshirilmagan` | Tartib |
| 09 | Xato qator | 🔴 | `tekshirilmagan` | Xato qator |
| 10 | So'zlar | 🔴 | `argument-qiymat` | So'zlar |

Raskladka qoidalari bajarildi: 1-pozitsiyada boshqaruvi ravshan mexanika (Test);
Sonlar o'qi, Tartib, Xato qator, Belgilash birinchi kelmadi; Xato qator 9-pozitsiyada
(7-10 oralig'ida); yonma-yon bir xil mexanika yo'q.

**Sonli misollar takrorlanmaydi**, darsning o'z misollari ham qaytarilmaydi. Darsda
ishlatilgan: `1/(x−3)`, `√(x−3)`, `√x/(x−4)`, `1/(x−5)`, `1/(x²−9)`, `√(4−x)`, `√(2−x)`,
`1/(x²+1)`, `h(t) = 0,1875·t·(10−t)`, yugurchi jadvali. Amaliyotda ularning bittasi ham
yo'q.

**Kontekst yo'q, faqat matematika.** O'nta topshiriqning hech birida hikoya, personaj yoki
turmush sahnasi yo'q. Funksiya to'rt xil ko'rinishda beriladi: juftliklar to'plami (01),
jadval (02, 04), grafik (03) va formula (04-09) — bu 1-darsning o'z uchligi. Oxirgi
topshiriq esa uchala tasdiqni so'z bilan bir gapga yig'adi (10).

---

## 2. O'NTA TOPSHIRIQ

Razbor qoidasi hamma joyda bir xil: **razbor javobni bermaydi, BELGINI ko'rsatadi va son
qo'yib tekshirishga yuboradi**. Quyida razborlarning MAZMUNI berilgan, so'zma-so'z matni —
2-bosqichda.

---

### 01. Test 🟢 — `argument-qiymat`, T1

**Savol.** Quyidagi to'rtta juftliklar to'plamidan qaysi biri funksiya EMAS?

| | Variant | |
|---|---|---|
| a | (1; 3), (2; 5), (3; 7), (4; 9) | funksiya |
| b | (−2; 4), (−1; 1), (0; 0), (1; 1), (2; 4) | funksiya |
| c | (0; 0), (1; 1), (1; −1), (4; 2) | **funksiya emas — to'g'ri javob** |
| d | (1; 5), (2; 5), (3; 5) | funksiya |

Savol matematik va bitta aniq javobi bor: `c` da `x = 1` ga ikkita qiymat mos keladi.
`b` va `d` — tuzoqning o'zi: ularda qiymat takrorlanadi, lekin bu ta'rifni buzmaydi.

**Razborlar**

- **a** tanlangan — bu yerda har bir birinchi son bir marta uchraydi, demak shart
  bajarilgan. Boshqa to'plamlarda birinchi sonlarni sanang.
- **b** tanlangan — bu yerda takrorlanayotgan narsa QIYMAT: 4 ikki marta, 1 ikki marta.
  Shart esa argumentga qo'yiladi. Birinchi sonlarni yozib chiqing: ular takrorlanadimi?
- **d** tanlangan — hamma qiymat 5 ga teng, lekin har bir argument bir martadan turibdi.
  Shart buzilmagan.
- Umumiy razbor: har to'plamda BIRINCHI sonlarni yozib chiqing. Qaysi to'plamda bitta son
  ikki marta uchradi?

---

### 02. Jadval 🟢 — `argument-qiymat`, T1

**Topshiriq.** `y = 3x − 5` funksiyasining jadvalini to'ldiring.

| x | 1 | 2 | 3 | **?** | 6 |
|---|---|---|---|---|---|
| y | −2 | 1 | **?** | 10 | **?** |

**To'g'ri:** `y(3) = 4`; `x = 5`; `y(6) = 13`. "Hammasi yoki hech nima".

O'rtadagi katak ATAYIN teskari yo'nalishda: qiymat berilgan, argument topiladi
(`TIPLAR §2.1` p. 6).

**Razborlar**

- Bo'sh `x` katagiga 10 yozilgan — qatorlar almashtirilgan. Yuqori qator — argument,
  pastki qator — qiymat. Bu katakda `3x − 5 = 10` tenglamasini yechish kerak.
- `x` katagiga `15` yozilgan — `−5` to'g'ri o'tkazilgan, lekin uchga bo'lish qolib
  ketgan.
- `y(3)` ga `9` yozilgan — `−5` qo'shilmagan; `y(3)` ga `14` yozilgan — belgi teskari
  olingan.
- `y(6)` ga `13` emas, boshqa son yozilgan — jadval bir tekis o'smaydi, har katak
  formuladan alohida hisoblanadi.
- Umumiy razbor: to'ldirgan katagingizni formulaga qo'yib tekshiring.

---

### 03. Ha/yo'q 🟢 — `grafik-rasm`, `argument-qiymat`, T1

**Berilgan.** Koordinata tekisligida `y = f(x)` funksiyasining grafigi chizilgan.
Aniqlanish sohasi — `[0; 6]`. Grafik `(0; 1)` nuqtasidan ko'tarilib `(3; 7)` ga yetadi,
so'ng `(6; 1)` gacha tushadi. O'qlar imzolangan.

| | Hukm | Javob |
|---|---|---|
| a | Har bir `x` ga aynan bitta `y` mos keladi | **ha** |
| b | Grafikning eng yuqori nuqtasi funksiyaning eng katta ARGUMENTINI ko'rsatadi | **yo'q** |
| c | `y = 4` qiymati ikki xil `x` da uchraydi | **ha** |

**Uchta hukm, to'rtta emas** (metodist, 2026-08-26). Olib tashlangani — «`x = 8` da
funksiya aniqlangan»: u T2 ni tekshirardi, lekin T2 ni 07 va 10-topshiriqlar ham
yopadi. Qolgan uchtasi yagona: `grafik-rasm` faqat `b` da tekshiriladi, `a` bilan `c`
esa juft bo'lib ishlaydi — shart argumentga qo'yiladi, teskarisiga emas.

Bitta xato — topshiriq o'tmaydi.

**Razborlar**

- **a** ga "yo'q" — grafikda bitta `x` dan tik chiziq o'tkazing: u grafikni necha
  nuqtada kesadi?
- **b** ga "ha" — eng yuqori nuqta `(3; 7)`. 7 — bu argumentmi yoki qiymatmi? Argument
  gorizontal o'qdan o'qiladi, va eng kattasi 6 ga teng.
- **c** ga "yo'q" — `y = 4` gorizontal chiziqni o'tkazing: u grafikni bir joyda
  kesadimi? Ta'rif bir xil qiymatni ikki marta taqiqlamaydi.


---

### 04. Belgilash 🟡 — `argument-qiymat`, `grafik-rasm`, T1

**Berilgan.** Funksiya formula bilan: `y = 3x + b`. Ozod had **noma'lum** va jadvalda
ham yozilmagan. Jadval gorizontal, ikkita katagi bo'sh:

| x | −1 | 0 | ? |
|---|---|---|---|
| y | 0 | ? | −3 |

Chapda formula va jadval, o'ngda koordinata tekisligi. Tekislikda to'r bor, o'q
imzolari HAR bo'linmada, nuqtalar CHIZILMAGAN.

**Topshiriq.** `x = 0` ga mos nuqtani va `y = −3` ga mos nuqtani tekislikka qo'ying.

**Yechim yo'li.** To'liq ustun ozod hadni beradi: `3·(−1) + b = 0`, demak `b = 3`.
Undan keyin `y(0) = 3` va `3x + 3 = −3` dan `x = −2`.

**To'g'ri:** `(0; 3)` va `(−2; −3)`. Ikkalasi ham to'g'ri bo'lsagina zachot.

**Razborlar zona bo'yicha**

- `(0; 0)` — ozod had nol deb olindi. Formulada ozod had bor, uni to'liq ustundan
  toping: minus birda qiymat nolga teng.
- `(−3; −3)` — minus uch QIYMAT sifatida emas, argument sifatida olindi. Uni
  formulaning chap tomoniga qo'ying va tenglamani yeching.
- `(3; 0)` yoki `(−3; −2)` — koordinatalar almashtirildi.
- Bitta nuqta to'g'ri, ikkinchisi emas — razbor aynan qolganini ko'rsatadi.
- Umumiy razbor: avval ozod hadni toping, keyin har nuqtaning ikkala sonini tekshiring.

Bosish zonasi ko'rinib turadi (METODIK_PROFIL), tuzoq nuqtalarning hammasi tekislikda
BOR — ya'ni o'quvchi ularni qila oladi va razbor haqiqatan chiqadi.

**Boshqaruv (bag-report 2026-08-26).** Qo'yilgan nuqta o'z koordinatasi bilan turadi
(`(0; 3)`), o'q imzolari har bo'linmada, va ikkita nuqta qo'yilgandan keyin ortiqcha
bosish hech nimani o'chirmaydi — nuqtani olib tashlash uchun uning o'zini qayta bosish
kerak. Ilgari uchinchi bosish birinchi nuqtani jimgina yo'qotardi.

### 05. Saralash 🟡 — `soha-suratdan`, T3

**Topshiriq.** Oltita yozuvni uchta zonaga ajrating. Zona — XOSSA, nom emas.

| Zona | Yozuvlar |
|---|---|
| Hamma sonlarda aniqlangan | `y = 4x + 9` ; `y = 6/(x² + 4)` |
| Bitta son chiqarib tashlanadi | `y = 1/(x − 6)` ; `y = 15/(x + 8)` |
| Sonlarning butun bir qismi chiqarib tashlanadi | `y = √(x + 2)` ; `y = √(10 − x)` |

"Hammasi yoki hech nima". Barmoq bosadi, tortmaydi.

**Tuzoqlar va razborlar**

- `6/(x² + 4)` "bitta son chiqadi" ga qo'yilgan — maxraj bor, demak taqiq bor deb
  o'ylangan. `x² + 4` nolga aylanadigan sonni topib ko'ring: kvadrat manfiy bo'lmaydi,
  ustiga 4 qo'shiladi.
- `15/(x + 8)` "hamma sonlarda" ga qo'yilgan — maxraj nolga aylanadigan sonni qidiring,
  u musbat emas.
- `√(10 − x)` noto'g'ri zonaga qo'yilgan — ildiz bitta sonni emas, butun bir qismni
  kesadi. `x = 12` ni qo'yib ko'ring.
- `√(x + 2)` "hamma sonlarda" ga qo'yilgan — `x = −5` da ildiz ostida nima chiqadi?
- `4x + 9` biror taqiqli zonaga qo'yilgan — bu yozuvda na maxraj bor, na ildiz. Nimani
  taqiqlash mumkin?
- Umumiy razbor: har yozuvga bitta savol bering — bu formula qaysi sonda hisoblanmay
  qoladi.

---

### 06. Javobni kiritish 🟡 — `soha-suratdan`, T3

**Topshiriq.** `y = 8/(x² − 7x)`. Funksiya aniqlanmagan barcha `x` larni yozing.

**To'g'ri:** `0; 7` (tartib ahamiyatsiz).

**Razborlar**

- Faqat `7` — maxraj ikkita ko'paytuvchidan iborat: `x(x − 7)`. Ko'paytma nolga
  aylanishi uchun bitta ko'paytuvchining nol bo'lishi yetadi. Birinchisini ham
  tekshiring.
- Faqat `0` — ikkinchi ko'paytuvchi qaysi sonda nolga aylanadi?
- `7; −7` — yozuv `x² − 49` emas, `x² − 7x`. `x` ni qavsdan chiqarib ko'ring.
- `−7` — belgi teskari: `x − 7 = 0` dan `x` nimaga teng?
- `8` — bu surat, u maxrajga ta'sir qilmaydi.
- Umumiy razbor: topgan soningizni maxrajga qo'ying va natijani ko'ring.

---

### 07. Sonlar o'qi 🟡 — `soha-suratdan`, T2, T3

**Topshiriq.** `y = √(x + 5)` funksiyasining aniqlanish sohasini o'qda ko'rsating.

**To'g'ri:** chegara `−5` da, nuqta **bo'yalgan**, soha o'ngga ketadi (`x ≥ −5`).

Zachot ikkala shart bajarilgandagina: chegara ham, nuqta turi ham.

**Razborlar**

- Chegara to'g'ri, nuqta BO'SH — `x = −5` da ildiz ostida nol turadi, noldan ildiz esa
  bor va u nolga teng. Bu son sohaga KIRADI.
- Chegara `+5` da — `x + 5` nolga aylanadigan sonni toping, u musbat emas.
- Soha chapga ketgan — `x = 0` ni qo'yib ko'ring: ildiz ostida 5 chiqadi, demak nol
  sohaga kiradi, u esa chegaradan o'ngda.
- Umumiy razbor: chegaraning o'zini ham son sifatida tekshiring — u kiradimi yoki yo'q.

---

### 08. Tartib 🔴 — `tekshirilmagan`, T3

**Topshiriq.** `y = √(12 − x)` ning aniqlanish sohasini topish qadamlarini tartibga
soling. Kartochkalar aralashtirilgan holda beriladi.

| To'g'ri tartib | Kartochka |
|---:|---|
| 1 | Ildiz ostida manfiy son bo'lmaydi |
| 2 | `12 − x ≥ 0` |
| 3 | `x ≤ 12` |
| 4 | Javob: aniqlanish sohasi `x ≤ 12` |
| 5 | Tekshirish: `x = 15` da `12 − 15 = −3`, demak 15 sohaga kirmaydi |

Tartib yagona (`TIPLAR §2.1` p. 8): shart avval so'z bilan aytiladi, keyin yoziladi,
keyin yechiladi, keyin javob, va oxirida son bilan tekshiriladi.

**Razborlar**

- Tekshirish javobdan oldin qo'yilgan — hali tekshiradigan javob yo'q.
- `x ≤ 12` tengsizlikdan oldin qo'yilgan — bu qatorning o'zi tengsizlikni yechish
  natijasi, uni yechilmasdan yozib bo'lmaydi.
- So'z bilan aytilgan shart oxirga tushgan — hamma narsa shundan boshlanadi: nega
  umuman shart yozildi?
- Umumiy razbor: zanjirni yuqoridan pastga o'qing. Har qator o'zidan oldingisidan kelib
  chiqishi kerak.

---

### 09. Xato qator 🔴 — `tekshirilmagan`, `soha-suratdan`, T3

**Berilgan yechim.** `y = 1/(x² − 16)` ning aniqlanish sohasini toping.

| Qator | Matn |
|---:|---|
| 1 | Maxraj nolga teng bo'lmasligi kerak: `x² − 16 ≠ 0` |
| 2 | `x² ≠ 16` |
| 3 | `x ≠ 4` |
| 4 | Javob: `x ≠ 4` |

**To'g'ri:** birinchi xato qator — **3**.

**Metodist qarori 2026-08-26 (ikkinchi):** pastdagi «qaysi sonda buziladi» maydoni
olib tashlandi. Faqat to'rt qatorli ketma-ketlik qoladi, tushuntirish esa to'g'ri
javobdan keyin `correctText` da beriladi: kvadrati o'n oltiga teng bo'lgan son ikkita,
minus to'rt yo'qolgan, va uni maxrajga qo'yganda nol chiqadi.

**Narxi ochiq yozildi** (`TIPLAR_AMALIYOT_9SINF.md` §2.1 p. 9): qarshi misolsiz bu
to'rttadan bittasini tanlash bo'lib qoladi. Buni ikkita talab qoplaydi — qatorlar
bir-biridan kelib chiqadi (4-qator 3-qatorning takrori, ya'ni «oxirgisini bosaman»
yo'li ishlamaydi), va `correctText` xatoning mohiyatini tushuntiradi.

**Razborlar**

- 1-qator tanlangan — bu qator to'g'ri: maxraj haqiqatan ham nolga aylanmasligi kerak.
  Xatoni undan pastda qidiring.
- 2-qator tanlangan — bu ham to'g'ri. Keyingi qadamga qarang: kvadratdan qanday
  qutulindi va shunda nechta son chiqishi kerak edi?
- 4-qator tanlangan — u uchinchisini takrorlaydi, ya'ni xatoni faqat ko'chirib yozgan.
  Bizga birinchi xato kerak, oxirgisi emas.
- Umumiy razbor: kvadrati o'n oltiga teng bo'ladigan sonlarni sanang.

---

### 10. So'zlar 🔴 — `argument-qiymat`, `soha-suratdan`, T1, T2, T3

**Metodist qarori 2026-08-26 (ikkinchi):** moslashtirish o'rniga nazariy qoida beriladi
va tushib qolgan so'zlar joyiga qo'yiladi. Mexanika 8-sinf amaliyotidan olinadi
(`ClozeBank`), nusxa yozilmaydi.

**Qoida (bo'shliqlar kvadrat qavsda).**

> Argumentning har bir qiymatiga funksiyaning aynan **[bitta]** qiymati mos keladi.
> Aniqlanish sohasi — **[argument]** qabul qilishi mumkin bo'lgan barcha qiymatlar.
> Formula bilan berilgan funksiya formula **[ma'noga]** ega bo'lgan joyda aniqlangan.

Qoida darsning UCHALA tasdig'ini o'z ichiga oladi, ya'ni oxirgi topshiriq butun darsni
bir gapga yig'adi.

**Bank:** `bitta` · `argument` · `ma'noga` · **`ikkita`** · **`qiymat`** · **`nolga`**
(oxirgi uchtasi — tuzoq).

**Razborlar**

- `ikkita` qo'yilgan — ikkita qiymat bo'lsa, bu funksiya bo'lmasdi. Bitta x dan ikkita
  strelka chiqadigan taxtani eslang.
- `qiymat` qo'yilgan — aniqlanish sohasi qiymatlar to'plami emas, u argument qabul
  qilishi mumkin bo'lgan sonlar haqida: grafikda bu gorizontal o'q.
- `nolga` qo'yilgan — formula nolga teng bo'lgan joyda emas, hisoblanadigan joyda
  aniqlangan. Nol — bu ham qiymat; sohani nolga BO'LISH kesadi.
- Birinchi ikki bo'shliq almashtirilgan — birinchisida NECHTA qiymat borligi,
  ikkinchisida soha KIMNIKI ekani aytiladi.
- Umumiy razbor: har bo'shliqni gapning o'zi bilan tekshiring.

---

## 3. KADR VA TEXNIKA

- Ish zonasi va topshiriq balandligi 8-sinf amaliyoti bilan bir xil chegarada; eng tor
  til — inglizcha, to'lib ketish o'sha yerda o'lchanadi.
- Javob **bir marta** tekshiriladi, keyin topshiriq qulflanadi; razbor darrov o'sha
  topshiriqning ichida chiqadi; maslahat tugmasi yo'q.
- Qaytib kelganda jonli asbob qayta ochilmaydi — o'quvchining javobi va o'sha razbor
  ko'rsatiladi.
- Matematika til blokidan tashqarida: `expr`, `cards`, `rows`, `items`, `accepts` — uch
  tilda bitta. Juftliklar, jadval sonlari, formulalar va sohalar TARJIMA QILINMAYDI.
- UZ — `siz`, apostrof ASCII `'`, kirillcha yo'q. RU — `ты`, jinssiz shakl.
- Amaliyotda ovoz yo'q.
- Fayllar va reestr: `TIPLAR_AMALIYOT_9SINF.md` §4 (reestrda ikkita tuzatish, bittasi
  emas).
