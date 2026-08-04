# 3-sinf: TO'RTINCHI variant (distraktor) — CHERNOVIK, metodist tasdiqlashi kerak

Metodist qarori 2026-08-04: savollarda QAT'IY 4 variant bo'lishi kerak. Hozir grade3 ning
tayyor darslarida ko'p savolda 3 variant. Bu fayl — har savolga taklif qilingan 4-chi
variant va uning tahlili (RU + UZ). **Kodga hali kiritilmagan.**

Ishlash tartibi: metodist shu faylni to'g'ridan-to'g'ri tahrirlaydi (variantni yoki matnni
o'zgartiradi), keyin «kirit» deydi — shundan keyin kodga ko'chiriladi.

UZ matnlar DRAFT: o'zbek matematika metodistining validatsiyasi kerak.

---

## 1. Qayerda 4-chi variant MUMKIN EMAS (tasdiq kerak)

### 1.1. Taqqoslash savollari — javob maydoni YOPIQ

`Dars04` ekran s8, 3 raund: «Какое число больше?» → variantlar `730 / 703 / поровну`.

Mumkin bo'lgan javoblar: birinchi son, ikkinchi son, teng. **Uchtadan ko'p yo'q.**
To'rtinchi variant qo'shilsa, u ma'nosiz bo'ladi va bola uni ko'zdan darrov chiqarib
tashlaydi — savol amalda yana 3 variantli bo'lib qoladi, faqat ekran chalkashadi.

**Taklif:** bu ekranni 3 variant holida qoldirish. Agar metodist «baribir 4 bo'lsin»
desa — savol turini o'zgartirish kerak (masalan «Qaysi belgi to'g'ri?» → `>` `<` `=` va
to'rtinchi sifatida ataylab noto'g'ri yozuv), bu esa KONTENTNI qayta yozish.

### 1.2. Belgi-tanlash raqamlar nurida — 4-chi belgi RASMDA yo'q

`Dars06` ekran s8, 3 raund: «На какой метке стоит число?» → `A / B / C`.

To'rtinchi variant uchun raqamlar nuriga **to'rtinchi belgi (D) qo'shish** kerak — ya'ni
illyustratsiyani o'zgartirish. Texnik jihatdan mumkin, lekin bu vizual qaror: nur
zichlashadi, belgilar bir-biriga yaqinlashadi.

**Taklif:** metodist tasdiqlasa — D belgisi qo'shiladi (nurda bo'sh joy bor).

### 1.3. Xuk-ekranlari (s0) — prognoz, test emas

Har darsda xuk 3 variantli: ikki taxmin + «Не знаю» / «Bilmayman». Bu bilimni emas,
TAXMINNI so'raydi va noto'g'ri javob ham normal. To'rtinchi variant bu yerda ma'no
bermaydi. **Taklif:** tegilmasin.

---

## 2. Taklif qilingan 4-chi variantlar (28 savol)

Belgilar: **№** — dars va ekran, **Berilgan** — savol sharti, **Bor** — hozirgi variantlar
(to'g'ri javob QALIN), **+4** — taklif, **Tahlil** — noto'g'ri variant bosilganda chiqadigan
matn (javobni BERMAYDI, belgiga ishora qiladi).

### Dars05 — yaxlitlash

Umumiy naqsh: bola YUMALOQ son o'rniga O'NLIKLAR (yuzliklar) SONINI aytadi. Bu haqiqiy
xato: «yetti o'nlik» → «7» deb yozadi.

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s7-1 | 68 → o'nlikkacha | **70** / 60 / 68 | `7` | Семь это число десятков. Само круглое число — семьдесят. | Yetti bu o'nliklar soni. Yumaloq sonning o'zi — yetmish. |
| s7-2 | 34 → o'nlikkacha | **30** / 40 / 34 | `3` | Три это число десятков. Круглое число — тридцать. | Uch bu o'nliklar soni. Yumaloq son — o'ttiz. |
| s7-3 | 55 → o'nlikkacha | **60** / 50 / 55 | `6` | Шесть это число десятков. Круглое число — шестьдесят. | Olti bu o'nliklar soni. Yumaloq son — oltmish. |
| s8-1 | 347 → yuzlikkacha | **300** / 400 / 350 | `3` | Три это число сотен. Круглое число — триста. | Uch bu yuzliklar soni. Yumaloq son — uch yuz. |
| s8-2 | 682 → yuzlikkacha | **700** / 600 / 680 | `7` | Семь это число сотен. Круглое число — семьсот. | Yetti bu yuzliklar soni. Yumaloq son — yetti yuz. |
| s8-3 | 450 → yuzlikkacha | **500** / 400 / 450 | `5` | Пять это число сотен. Круглое число — пятьсот. | Besh bu yuzliklar soni. Yumaloq son — besh yuz. |
| s10 | 623 → yuzlikkacha | **600** / 700 / 620 | `6` | Шесть это число сотен. Круглое число — шестьсот. | Olti bu yuzliklar soni. Yumaloq son — olti yuz. |

### Dars06 — raqamlar nuri

**s6 naqsh:** chegara sifatida YUMALOQ yuzlik emas, sonning O'ZI olinadi.

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s6-1 | 380 | **300 и 400** / 400 и 500 / 200 и 300 | `380 и 400` | Границы это круглые сотни. Само число стоит между ними, а не на границе. | Chegaralar yumaloq yuzlik. Son ularning ORASIDA turadi, chegarada emas. |
| s6-2 | 720 | **700 и 800** / 600 и 700 / 800 и 900 | `720 и 800` | Границы это круглые сотни, а не само число. | Chegaralar yumaloq yuzlik, sonning o'zi emas. |
| s6-3 | 540 | **500 и 600** / 400 и 500 / 600 и 700 | `540 и 600` | Границы это круглые сотни, а не само число. | Chegaralar yumaloq yuzlik, sonning o'zi emas. |

**s7 va s9 naqsh:** bola oldingi yuzlikka tushib ketadi (belgi o'ngda turgani hisobga
olinmaydi). Nur chegaralari tekshirilgan: 250 uchun 100–500, 630 uchun 400–900.

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s7-1 | belgi 250 | **250** / 200 / 350 | `150` | Метка правее двухсот, значит число больше двухсот. | Belgi ikki yuzdan o'ngda, demak son ikki yuzdan katta. |
| s7-2 | belgi 630 | **630** / 600 / 730 | `530` | Метка правее шестисот, значит число больше шестисот. | Belgi olti yuzdan o'ngda, demak son olti yuzdan katta. |
| s7-3 | belgi 480 | **480** / 400 / 580 | `380` | Метка правее четырёхсот, значит число больше четырёхсот. | Belgi to'rt yuzdan o'ngda, demak son to'rt yuzdan katta. |
| s9 | modul belgisi 570 | **570** / 500 / 670 | `470` | Метка правее пятисот, значит число больше пятисот. | Belgi besh yuzdan o'ngda, demak son besh yuzdan katta. |

### Dars08 — rim raqamlari

**s6 naqsh (rim → arab):** bola belgining BIR QISMINI o'qiydi, boshini tushirib qoldiradi.

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s6-1 | XIV | **14** / 16 / 6 | `4` | Ты прочитал только четыре. Впереди ещё десять. | Siz faqat to'rtni o'qidingiz. Oldida yana o'n bor. |
| s6-2 | XL | **40** / 60 / 10 | `50` | Икс перед эль убавляет: пятьдесят без десяти. | L oldidagi X kamaytiradi: ellikdan o'n kam. |
| s6-3 | XXVII | **27** / 22 / 32 | `17` | Здесь два икса, это двадцать, а не десять. | Bu yerda ikki X, bu yigirma, o'n emas. |

**s7 naqsh (arab → rim):** birlik soni yoki belgi qiymati adashtiriladi.

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s7-1 | 8 | **VIII** / IIX / IX | `VII` | Здесь только семь. Единиц после пяти должно быть три. | Bu yerda faqat yetti. Beshdan keyin uchta birlik bo'lishi kerak. |
| s7-2 | 9 | **IX** / VIIII / XI | `VIV` | Пять и четыре так не записывают. Девять берут от десяти. | Besh va to'rt bunday yozilmaydi. To'qqiz o'ndan olinadi. |
| s7-3 | 40 | **XL** / XXXX / LX | `L` | Эль это пятьдесят. Чтобы стало сорок, нужен икс перед ним. | L bu ellik. Qirq bo'lishi uchun oldiga X kerak. |
| s9 | VIII oyi | **8** / 6 / 3 | `4` | Ты сложил не все знаки: после пяти стоят три единицы. | Siz belgilarni to'liq qo'shmadingiz: beshdan keyin uchta birlik. |

### Dars10 — ko'paytirish

**s6 va s9 naqsh:** ustunlar soni o'rniga qatorlar soni ikkinchi ko'paytuvchi qilib olinadi
(kvadrat massiv deb o'ylaydi).

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s6-1 | 4 qator × 3 ustun | **12** / 7 / 9 | `16` | Столбцов три, а не четыре. Считай четыре по три. | Ustun uchta, to'rtta emas. To'rtta uchtadan hisoblang. |
| s6-2 | 5 qator × 4 ustun | **20** / 9 / 16 | `25` | Столбцов четыре, а не пять. Пять по четыре. | Ustun to'rtta, beshta emas. Beshta to'rttadan. |
| s6-3 | 6 qator × 3 ustun | **18** / 9 / 15 | `36` | Столбцов три, а не шесть. Шесть по три. | Ustun uchta, oltita emas. Oltita uchtadan. |
| s9 | 5 qator × 6 ustun | **30** / 11 / 25 | `35` | В каждом ряду по шесть, а не по семь. | Har qatorda oltita, yettita emas. |

**s7 naqsh:** ko'paytuvchi bittaga adashadi (qo'shni ustun/satr jadvalda).

| № | Berilgan | Bor | +4 | Tahlil RU | Tahlil UZ |
|---|---|---|---|---|---|
| s7-1 | 6 × 7 | **42** / 48 / 36 | `35` | Это пять на семь. У нас шесть на семь. | Bu besh kerra yetti. Bizda olti kerra yetti. |
| s7-2 | 8 × 4 | **32** / 36 / 24 | `28` | Это семь на четыре. У нас восемь на четыре. | Bu yetti kerra to'rt. Bizda sakkiz kerra to'rt. |
| s7-3 | 9 × 6 | **54** / 56 / 45 | `63` | Это семь на девять. У нас шесть на девять. | Bu yetti kerra to'qqiz. Bizda olti kerra to'qqiz. |

### Dars04 — taqqoslash

4-chi variant MUMKIN EMAS, 1.1-bo'limga qarang.

---

## 3. Yakuniy panellar (har darsda 5 savol)

Yakuniy panellarda MC-savollar `opt0/opt1/opt2` ko'rinishida, ya'ni ham 3 variantli.
Ular ham to'rtga chiqarilishi kerak, LEKIN har biri o'z darsining mavzusiga bog'liq —
bu alohida ro'yxat. Metodist shu (2-bo'lim) ro'yxatni tasdiqlagach tayyorlanadi, aks holda
ikki katta ro'yxatni bir vaqtda tekshirish og'ir bo'ladi.

---

## 4. Kiritilgandan keyin nima tekshiriladi

- variantlar soni: har savolda AYNAN 4 (1-bo'lim istisnolaridan tashqari);
- joylashuv: 2×2 to'r (grade3 naqshi, `cols={2}`);
- ARALASHTIRISH: to'g'ri javob har mount'da boshqa o'rinda;
- har noto'g'ri variantda O'Z tahlili bor va u javobni BERMAYDI;
- UZ: ASCII apostrof, kirill yo'q, «siz» registri;
- `npm run build` + ovozni o'chirib prokliklash.
