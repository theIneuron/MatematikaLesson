# DARS02_AMALIYOT_KONTENT_V2 — 8-sinf, 2-dars amaliyoti (qayta yaratilgan)

> 2-bosqich (KONTENT). Kirish: `DARS02_06_AMALIYOT_SKELET.md` (o'nta mexanika, ketma-ketlik
> jadvali), `src/components/grade8/Dars02.jsx` (`STATEMENTS`, `MISS`).
> Chiqish: `src/components/grade8/practice/dars02/D02_01…10.jsx`.
>
> **Metodist qarori 2026-08-24:** 2-6 darslarning har biri 1-DARSNING o'nta mexanikasidan
> foydalanadi, har darsda boshqa ketma-ketlikda. `TypeExpr` (ifodani yozish) o'nlikda yo'q,
> shuning uchun u 2-darsdan ham chiqdi.
>
> **Bu fayl eski `DARS02_AMALIYOT_KONTENT.md` ni almashtirdi.** Eski fayl mexanikalarning
> avvalgi avlodini (`input`, `sort`, `slots`, `odz` …) tasvirlardi va yig'ilgan darsga mos
> emas edi — metodist qarori bilan 2026-08-24 da o'chirildi, git tarixida qoladi.
>
> Dizayn tegilmadi: fon `#fff7ed`, urg'u `#fe5b1a`, `kit.jsx` palitrasi, chip qatori.

---

## 0. QOIDALAR, ULARSIZ BU FAYL O'QILMAYDI

1. **Matematika til blokidan TASHQARIDA.** Yozuv, karta, variant — tarjima emas,
   matematikaning o'zi. Uch tildagi SO'ZLAR `D02_*.jsx` fayllarida `L()` ichida turadi.
2. **Har noto'g'ri YO'LGA o'z razbori.** `wrongs[]` tartib bilan tekshiriladi, birinchi mos
   kelgani chiqadi, oxirgisi `wrongText`.
3. **Razbor javobni bermaydi, BELGINI ko'rsatadi** va iloji bo'lsa son bilan tekshirishga
   yuboradi.
4. **Javob bir marta tekshiriladi**, keyin topshiriq qulflanadi. Maslahat tugmasi yo'q.
5. UZ — `siz`, apostrof ASCII `'`. RU — `ты`, jinssiz shakl. UZ satrda kirill yo'q.
6. Amaliyotda ovoz YO'Q.

## 1. DARS NIMANI DA'VO QILADI — AMALIYOT SHUNI TEKSHIRADI

| Kod | Tasdiq (`STATEMENTS`) |
|---|---|
| T1 | Surat va maxraj bitta ifodaga ko'paytiriladi yoki bo'linadi, kasrning qiymati o'zgarmaydi |
| T2 | Ko'paytuvchi nol bo'lmaydi: nolda surat ham, maxraj ham nolga aylanadi |
| T3 | Harfli ko'paytuvchi yangi shart qo'shadi |

| Kod | Adashish (`MISS`) |
|---|---|
| З1 | bir xil son qo'shildi, ko'paytirilmadi |
| З2 | ko'paytirishda ruxsat etilgan qiymatlar yo'qoldi |
| З16 | javob son bilan tekshirilmadi |
| З20 | faqat surat yoki faqat maxraj ko'paytirildi |
| З21 | nol ko'paytuvchi qonuniy deb olindi |
| З22 | kasrdagi minus o'zi yo'qoldi |

## 2. RASKLADKA

| № | Mexanika | Qiy. | Teg | Tasdiq / adashish | Manba |
|---:|---|:--:|---|---|---|
| 01 | `TrueFalse` | 🟢 | `property_claims` | T1 T2 · З1 | yangi |
| 02 | `Choice` | 🟢 | `full_answer_choice` | T1 T3 · З2 З20 | ilgari 03 — matn o'sha |
| 03 | `Zones` | 🟢 | `property_held` | T1 T2 T3 · З1 З20 З21 З22 | ilgari 02 — matn o'sha |
| 04 | `TypeValue` | 🟡 | `new_ban_value` | T3 · З2 З16 | yangi (ilgari `HoleSlider`) |
| 05 | `PairSlots` | 🟡 | `missing_numerator` | T1 · З20 | yangi (ilgari `TypeExpr`) |
| 06 | `MarkAll` | 🟡 | `made_by_property` | T1 · З1 З20 | yangi (ilgari `StrikeOut`) |
| 07 | `CodeLock` | 🟡 | `banned_points` | T2 T3 · З2 | yangi (ilgari `NumberLine`) |
| 08 | `MatchPairs` | 🔴 | `record_to_condition` | T3 · З2 | ilgari 05 — m3 qiyinlashdi |
| 09 | `ClozeBank` | 🔴 | `rule_words` | T1 T2 T3 · З1 З21 | yangi |
| 10 | `SwapOrder` | 🔴 | `order_steps` | T1 T3 · З2 | ilgari 07 (`OrderLines`) |

Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. 1-pozitsiyada bitta bosish bilan boshqariladigan
tip. O'nta topshiriq — o'nta xil tip, yonma-yon takror yo'q.

## 3. MATEMATIKA — TOPSHIRIQMA-TOPSHIRIQ

### 01 · `TrueFalse` · 🟢 · `property_claims`
```
given:  a/(a + 3)
s1: 3a/(3(a + 3))        -> HA    (ikkala qavat 3 ga KO'PAYTIRILGAN)
s2: (a + 4)/((a + 3) + 4) -> YO'Q  (ikkala qavatga 4 QO'SHILGAN — З1)
```
Ikki qator, biri «ha», biri «yo'q» — javob naqshi o'z-o'zidan chiqmaydi. Son bilan
tekshirish razborda: `a = 1` da dastlabki 1/4, s1 ham 1/4, s2 esa 5/8.
«Faqat bitta qavat» (З20) bu yerda emas — 03 (i6) va 02 (3-variant) da.

### 02 · `Choice` · 🟢 · `full_answer_choice`
```
6/(m + 5) -> maxraji m² + 5m bo'lgan kasrga
0  6m/(m²+5m),  m ≠ −5, m ≠ 0   TO'G'RI
1  6m/(m²+5m),  m ≠ 0           eski shart yo'qoldi (З2)
2  6m/(m²+5m),  m ≠ −5          yangi shart yo'qoldi (З2)
3  6/(m²+5m),   m ≠ −5, m ≠ 0   faqat maxraj ko'paytirildi (З20)
```
Uch variantda kasrning O'ZI bir xil — tanlash uchun shartni chiqarish kerak.

### 03 · `Zones` · 🟢 · `property_held`
```
given: a/(a + 3);   zonalar: XOSSA BAJARILDI / XOSSA BUZILDI
bajarildi: 3a/3(a+3) · ab/(a+3)b · −a/−(a+3) · a²/a(a+3)
buzildi:   (a+4)/((a+3)+4) · 5a/(a+3) · a·0/((a+3)·0) · (a−1)/((a+3)−1)
```
To'rt sabab: qo'shish (З1), bitta qavat (З20), nol ko'paytuvchi (З21), ayirish.
Minus ko'paytuvchi (`−a/−(a+3)`) — З22 ga qarshi: minus bir ham qonuniy ko'paytuvchi.

### 04 · `TypeValue` · 🟡 · `new_ban_value`
```
3(k − 4)/((k + 1)(k − 4))     3/(k + 1) dan yasalgan, ko'paytuvchi (k − 4)
javob: 4        (YANGI taqiq)
tuzoqlar: −1 (ESKI taqiq) · −4 (ishora) · 3 (suratdagi son) · 0
```
Darsning o'zagi: xossa qiymatni saqlaydi, ruxsat etilgan qiymatlar to'plamini esa
QISQARTIRADI. Savol ataylab faqat YANGI taqiqni so'raydi.

### 05 · `PairSlots` · 🟡 · `missing_numerator`
```
given: 4/(3y)
chap (yangi MAXRAJ) ↔ o'ng (yangi SURAT)
15y² ↔ 20y     (ko'paytuvchi 5y)
12y² ↔ 16y     (ko'paytuvchi 4y)
9y³  ↔ 12y²    (ko'paytuvchi 3y²)
```
Asosiy tuzoq — O'XSHASHLIK: `12y²` ikki joyda uchraydi, biri maxraj, biri surat.
Ularni juftlash — З20 ning aynan o'zi. Ilgari bu savol bitta edi va javob yozilardi;
endi uchta va juftlanadi.

### 06 · `MarkAll` · 🟡 · `made_by_property`
```
belgilash: xossa bilan yasalgan 3 kasr
i1  5(q+2)/((q−7)(q+2))   HIT   ko'paytuvchi — qavs
i2  (5+q)/(7+q)                 qo'shiluvchi (З1)
i3  3q/(3q + 9)           HIT   ko'paytuvchi — SON (3q+9 = 3(q+3), ko'rish kerak)
i4  (q−5)/(q−7)                 ayiriluvchi (З1)
i5  q²/(q² − q)           HIT   ko'paytuvchi — HARF (q²−q = q(q−1))
i6  (q²+4)/(q+2)                ajralmaydi — i5 ga ataylab o'xshaydi
```
«Hammasi yoki hech narsa»: uchtasi ham topilishi kerak.

### 07 · `CodeLock` · 🟡 · `banned_points`
```
5(t + 3)/(t(t + 3)(t − 6))    5/(t(t − 6)) dan yasalgan, ko'paytuvchi (t + 3)
kod (o'sish tartibida): −3, 0, 6
   0, 6 — ESKI taqiqlar (dastlabki maxrajdan)
   −3   — YANGI taqiq (ko'paytuvchi olib keldi, qisqartirgandan keyin KO'RINMAYDI)
bank: −6 −3 0 3 5 6   tuzoqlar: 3 (ishora) · −6 (ishora) · 5 (surat)
```
Ilgari bu savol `NumberLine` da edi va ikki taqiq so'ralardi. Endi uchta, va TARTIB
ham talab qilinadi — javob to'plam emas, ketma-ketlik.

### 08 · `MatchPairs` · 🔴 · `record_to_condition`
```
m1  7p/4p               ↔  p ≠ 0
m2  7(p − 3)/4(p − 3)   ↔  p ≠ 3
m3  7(p² − 9)/4(p² − 9) ↔  p ≠ 3,  p ≠ −3      <- 🔴 ga ko'tarilgan joy
m4  7/4                 ↔  shart yo'q
```
Ilgari m3 `7(p+1)/4(p+1)` edi (ishora tuzog'i). Endi KVADRAT: ikkita nol, va u m2 bilan
yuzma-yuz turadi — «p − 3 ning ham ikki noli bor» degan adashish shu yerda tutiladi.
Juftlik chiziq bilan birlashtiriladi (`connect: true`); to'g'risidagi qator bilan
juftlansa chiziq to'g'ri (metodist, 2026-08-24).

### 09 · `ClozeBank` · 🔴 · `rule_words`
```
Kasrning surati va maxrajini bir xil ifodaga [KO'PAYTIRSAK], qiymat o'zgarmaydi.
Bu ifoda [NOLGA] teng bo'lmasligi kerak. Harfli ifoda esa yangi [SHART] qo'shadi.
bank: ko'paytirsak · qo'shsak · nolga · birga · shart · javob
javob: ko'paytirsak, nolga, shart
```
Qoidaning uch tayanchi — uch bo'shliq, uch tuzoq: З1 («qo'shsak»), З21 («birga»),
З2 («javob»). Bo'shliqlar tartibi UZ, RU va EN da mos tushadi.

### 10 · `SwapOrder` · 🔴 · `order_steps`
```
4/(n − 6) -> maxraji n² − 6n bo'lgan kasrga
l1  n² − 6n = n(n − 6)      yangi maxrajni ajratamiz
l2  · n                     ko'paytuvchini ikki qavatga qo'yamiz
l3  4n/(n² − 6n)            javobni yozamiz
l4  n ≠ 0,  n ≠ 6           shartni yozamiz
start: l3, l1, l4, l2   (javobgacha uch almashtirish)
```
Eng qimmat buzilish — shartni boshiga yoki o'rtaga qo'yish (З2). SwapOrder kartalari
bir qatorda turadi, shuning uchun matematika qisqa: so'z asosiy, yozuv qisqa dalil.

## 4. QAMROV — BO'SH JOY YO'QLIGINING TEKSHIRUVI

| Kod | Qayerda tekshiriladi |
|---|---|
| T1 | 01, 02, 03, 05, 06, 09, 10 |
| T2 | 01, 03, 07, 09 |
| T3 | 02, 03, 04, 07, 08, 09, 10 |
| З1 | 01, 03, 06, 09 |
| З2 | 02, 04, 07, 08, 10 |
| З16 | 04 (son bilan yozish), razborlarda — 01, 02, 05 |
| З20 | 02, 03, 05, 06 |
| З21 | 03, 09 |
| З22 | 03 (`−a/−(a+3)`) |

## 5. HARFLAR VA SONLAR — TAKRORLANMASLIK

`a` (01, 03) · `m` (02) · `k` (04) · `y` (05) · `q` (06) · `t` (07) · `p` (08) · `n` (10).
01 va 03 bitta harfda, lekin yozuvlari boshqa va ular ketma-ket turmaydi (birinchisi
mulohaza, ikkinchisi sakkiz kartaning saralanishi). Sonli misol dars ichida takrorlanmaydi.

## 6. YIG'ISHDA NIMA O'ZGARDI

1. **`kit.jsx`**: `TrueFalse` va `PairSlots` endi `Given` qatorini chizadi (`given` bo'lmasa
   hech narsa ko'rinmaydi). Yangi TIP qo'shilmadi, dizayn tegilmadi.
2. **`Dars02Practice.jsx`**: chip qatori va metodik xarita yangi o'nlikka moslandi.
3. **`grade8-practice-plan.mjs`**: `PLAN_02` to'liq qayta yozildi — o'nta yangi mexanikaning
   `ok` va `no` yo'llari.
4. Fayllar joyi: eski 03 -> 02, eski 02 -> 03, eski 05 -> 08 (matni saqlangan holda).

## 7. QABUL QILISH

- `npm run build` o'tadi.
- `grade8-practice-check.mjs`: to'g'ri yo'l va noto'g'ri yo'l — 5 o'lcham x 3 til, toza.
- `eslint`: yangi xato yo'q.
- Kadrlar: `.tmp/shots/dars02-*`.
