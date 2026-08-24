# DARS05_AMALIYOT_KONTENT_V2 — 8-sinf, 5-dars amaliyoti (qayta yaratilgan)

> 2-bosqich (KONTENT). Kirish: `DARS02_06_AMALIYOT_SKELET.md` §7.
> Chiqish: `practice/dars05/D05_01…10.jsx`.
>
> **Metodist qarori 2026-08-24:** 2-6 darslar 1-DARSNING o'nta mexanikasida, har darsda
> boshqa ketma-ketlikda. Dizayn tegilmadi.

---

## 1. RASKLADKA

| № | Mexanika | Qiy. | Teg | Manba |
|---:|---|:--:|---|---|
| 01 | `TrueFalse` | 🟢 | `mul_div_claims` | yangi (ilgari `TypeExpr`) |
| 02 | `Zones` | 🟢 | `mul_div_correct` | ilgari 03 — matn o'sha |
| 03 | `MarkAll` | 🟢 | `flip_marked` | yangi |
| 04 | `SwapOrder` | 🟡 | `divide_order` | ilgari 08 (`OrderLines`), soddalashtirildi |
| 05 | `Choice` | 🟡 | `third_condition` | ilgari 04 — matn o'sha |
| 06 | `MatchPairs` | 🟡 | `mul_or_div_result` | ilgari 06 — matn o'sha |
| 07 | `PairSlots` | 🟡 | `divisor_zero` | yangi (skeletdan chetlanish, §2.07) |
| 08 | `ClozeBank` | 🔴 | `rule_words` | yangi |
| 09 | `TypeValue` | 🔴 | `lost_ban_division` | ilgari 07 (`HoleSlider`) |
| 10 | `CodeLock` | 🔴 | `three_bans` | ilgari 10 (`NumberLine`) |

Harflar: e · g · n · k · h · m · f · s · v.

## 2. MATEMATIKA — TOPSHIRIQMA-TOPSHIRIQ

### 01 · `TrueFalse` · 🟢 · `mul_div_claims`
```
s1: (2/e) · (3/e) = 6/e²   -> HA
s2: (2/e) : (3/e) = 6/e²   -> YO'Q   (ag'darilmadi; to'g'risi 2/3)
```
Yozuvlar deyarli bir xil, farq faqat amal belgisida — «belgiga qaramaslik» birinchi
topshiriqdayoq tutiladi.

### 02 · `Zones` · 🟢 · `mul_div_correct`
Sakkiz tenglik: to'g'ri / noto'g'ri. `5/g : 5 = 25/g` ham bor (songa bo'lish).

### 03 · `MarkAll` · 🟢 · `flip_marked`
```
i1  (3/n) : (5/n) = (3/n)·(n/5)   HIT
i2  (3/n) : (5/n) = (n/3)·(5/n)         BIRINCHI kasr ag'darilgan
i3  (n/4) : 2 = (n/4)·(1/2)       HIT
i4  (n/4) : 2 = (n/4)·2                 songa bo'lish songa ko'paytirish deb olindi
i5  5 : (n/6) = 5·(6/n)           HIT
i6  5 : (n/6) = 5·(n/6)                 umuman ag'darilmagan
```
Javob HISOBLANMAYDI — faqat birinchi qadam tekshiriladi. Har juftlik yonma-yon turadi.
Panjara telefonda ikki ustun (`col: 168`, `itemSize: 12`) — bitta ustunda oltita baland
qator kadrga sig'masdi (o'lchov 2026-08-24).

### 04 · `SwapOrder` · 🟡 · `divide_order`
```
(1/k) : (k/4)
l1  · 4/k       bo'luvchini ag'daramiz
l2  1·4/(k·k)   ko'paytiramiz
l3  4/k²        javobni yozamiz
l4  k ≠ 0       shartni yozamiz
start: l4, l2, l1, l3
```
🔴 dan 🟡 ga tushgani uchun misol soddalashtirildi: bitta harf, bitta shart.

### 05 · `Choice` · 🟡 · `third_condition`
`h/(h+1) : ((h−4)/(h+7))` — uchta shart, biri bo'luvchining SURATIDAN (`h ≠ 4`).

### 06 · `MatchPairs` · 🟡 · `mul_or_div_result`
`m/3 · 6/m ↔ 2` · `m/3 : 6/m ↔ m²/18` · `3/m · m/3 ↔ 1` · `3/m : m/3 ↔ 9/m²`

### 07 · `PairSlots` · 🟡 · `divisor_zero`
```
uchala kasr BO'LUVCHI bo'lib turibdi, qanday f da nolga aylanadi:
(f−4)/f ↔ 4 · (f+4)/f ↔ −4 · f/(f−4) ↔ 0
```
**Skeletdan chetlanish.** Skelet §7.07 da «bo'lish ↔ ag'dargani» juftligi yozilgan edi;
pazl kartasi telefonda 54px va u yerga ikki kasrli yozuv sig'maydi (o'lchov 2026-08-24).
Savol darsning uchinchi shartiga qaratildi — bu 05 va 10 bilan bitta chiziqda turadi va
ular bir-birini takrorlamaydi: 05 to'liq javobni tanlaydi, 07 nolni topadi, 10 uch
taqiqni kodga yozadi.

### 08 · `ClozeBank` · 🔴 · `rule_words`
```
Kasrni kasrga bo'lish uchun [IKKINCHI] kasr ag'dariladi.
Uchinchi shart bo'luvchining [SURATIDAN] keladi, chunki [NOLGA] bo'lish mumkin emas.
bank: ikkinchi · birinchi · suratidan · maxrajidan · nolga · birga
```

### 09 · `TypeValue` · 🔴 · `lost_ban_division`
```
(2/(s+1)) : (6/(s+1))   javob 1/3 — unda harf umuman yo'q
taqiq: s = −1           javobda KO'RINMAYDI
tuzoqlar: 1 (yozuvdagi son) · 6 (bo'luvchining surati, o'zgarmas) · 0
```

### 10 · `CodeLock` · 🔴 · `three_bans`
```
v/(v−2) : ((v+6)/(v−8))     kod: −6, 2, 8
   2   bo'linuvchining maxrajidan
   −6  BO'LUVCHINING SURATIDAN (nolga bo'lish)
   8   bo'luvchining maxrajidan — javobda KO'RINMAYDI
bank: −8 −6 −2 2 6 8   tuzoqlar: −2, 6, −8 (ishora)
```

## 3. QAMROV

| Tasdiq / adashish | Qayerda |
|---|---|
| ko'paytirishda surat suratga, maxraj maxrajga | 01, 02 |
| bo'lishda IKKINCHI kasr ag'dariladi | 01, 02, 03, 04, 08 |
| shart uch joydan, uchinchisi bo'luvchining surati | 05, 07, 08, 10 |
| qisqargan ko'paytuvchi javobda ko'rinmaydi | 09, 10 |
| З26 nolga bo'lish e'tiborsiz | 05, 07, 08, 10 |
| amal belgisiga qaramaslik | 01, 02, 06 |

## 4. QABUL QILISH

- `npm run build` o'tadi.
- `grade8-practice-check.mjs`: to'g'ri va noto'g'ri yo'l toza (telefon-kichik/RU dagi
  03-topshiriqning kadrdan chiqishi tuzatildi).
- `eslint`: yangi xato yo'q.
- Kadrlar: `.tmp/shots/dars05-*`.
