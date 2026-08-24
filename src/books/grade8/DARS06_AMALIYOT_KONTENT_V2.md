# DARS06_AMALIYOT_KONTENT_V2 — 8-sinf, 6-dars amaliyoti (qayta yaratilgan)

> 2-bosqich (KONTENT). Kirish: `DARS02_06_AMALIYOT_SKELET.md` §8.
> Chiqish: `practice/dars06/D06_01…10.jsx`.
>
> **Metodist qarori 2026-08-24:** 2-6 darslar 1-DARSNING o'nta mexanikasida, har darsda
> boshqa ketma-ketlikda. Dizayn tegilmadi.

---

## 1. RASKLADKA

| № | Mexanika | Qiy. | Teg | Manba |
|---:|---|:--:|---|---|
| 01 | `MarkAll` | 🟢 | `first_action_mark` | yangi |
| 02 | `Choice` | 🟢 | `which_first` | ilgari 01 — matn o'sha |
| 03 | `TrueFalse` | 🟢 | `transform_claims` | yangi |
| 04 | `PairSlots` | 🟡 | `hidden_ban_rows` | yangi (ilgari 04 `HoleSlider`) |
| 05 | `ClozeBank` | 🟡 | `rule_words` | yangi |
| 06 | `Zones` | 🟡 | `transform_correct` | ilgari 10 — matn o'sha |
| 07 | `MatchPairs` | 🟡 | `first_action` | ilgari 03 — matn o'sha |
| 08 | `CodeLock` | 🔴 | `hidden_conditions` | ilgari 07 (`NumberLine`) |
| 09 | `SwapOrder` | 🔴 | `order_of_actions` | ilgari 05 (`OrderLines`) |
| 10 | `TypeValue` | 🔴 | `full_transform` | ilgari 09 (`TypeExpr`) — javob SON |

Harflar: m · c · n · d · b · f · p · k · u.

## 2. MATEMATIKA — TOPSHIRIQMA-TOPSHIRIQ

### 01 · `MarkAll` · 🟢 · `first_action_mark`
```
belgilash: birinchi amal KO'PAYTIRISH yoki BO'LISH bo'lgan 3 ifoda
i1  1/m + 2/m · 3        HIT      i2  (1/m + 2/m) · 3
i3  1/m − 1/m : 2        HIT      i4  (1/m − 1/m) : 2
i5  5 · m/4 + 1          HIT      i6  5 · (m/4 + 1)
```
Ifodalar juft-juft, farq faqat QAVSDA — qavs esa tartibni butunlay o'zgartiradi.

### 02 · `Choice` · 🟢 · `which_first`
`1/c + 2/c · 3` — qaysi amal birinchi va natija qanday.

### 03 · `TrueFalse` · 🟢 · `transform_claims`
```
s1: (1/n + 1/n) · n = 2   -> HA
s2: 1/n + 1/n · n = 2     -> YO'Q   (qavs yo'q: 1/n + 1)
```
`n = 2` da: birinchisi ikki, ikkinchisi bir yarim.

### 04 · `PairSlots` · 🟡 · `hidden_ban_rows`
```
uchala yozuv — yechimning ORALIQ satri, har biri o'z shartini tug'diradi:
(d²−4)/(d−2) ↔ 2 · (d²−4)/(d+2) ↔ −2 · (d²−4)/(4d) ↔ 0
```
Surat uchalasida bir xil — javobni faqat chiziq TAGI hal qiladi. Ilgari bu savol bitta
edi va surgich bilan so'ralardi; endi uchta va juftlanadi.

### 05 · `ClozeBank` · 🟡 · `rule_words`
```
Ifodani almashtirishda avval [QAVS] ichidagi amal bajariladi, keyin [KO'PAYTIRISH]
va bo'lish, oxirida qo'shish va ayirish. Shart esa yechimning [ORALIQ] satrlaridan
ham yig'iladi.
bank: qavs · chapdan o'ngga · ko'paytirish · qo'shish · oraliq · oxirgi
```

### 06 · `Zones` · 🟡 · `transform_correct`
Sakkiz almashtirish: to'g'ri / noto'g'ri. `(b+3)/(b+5) = 3/5` ham bor (harflarni
qisqartirish).

### 07 · `MatchPairs` · 🟡 · `first_action`
To'rt yozuv ↔ ko'paytirish / qavsdagi qo'shish / bo'lish / qavsdagi ayirish.
Chiziq bilan birlashtiriladi (`connect: true`).

### 08 · `CodeLock` · 🔴 · `hidden_conditions`
```
1/p + 1/(p−5) : (2/(p+1))     kod: −1, 0, 5
   0 va 5 — ochiq turgan ikki maxrajdan
   −1 — BO'LUVCHINING maxrajidan; ag'dargandan keyin u yuqoriga ko'chadi va
        javobda umuman ko'rinmaydi
bank: −5 −1 0 1 2 5   tuzoqlar: 1 va −5 (ishora) · 2 (bo'luvchining surati)
```

### 09 · `SwapOrder` · 🔴 · `order_of_actions`
```
1/k + 1/k : 2      (qavs YO'Q)
l1  1/k : 2     qavs yo'q: avval bo'lish
l2  1/(2k)      bo'lishning natijasi
l3  3/(2k)      endi qo'shamiz
l4  k ≠ 0       shartni yozamiz
start: l4, l3, l2, l1
```

### 10 · `TypeValue` · 🔴 · `full_transform`
```
(1/u − 1/(u+3)) · (u(u+3)/3)      javob: 1
tuzoqlar: 0 (qavs nolga teng deb o'ylash) · 3 (qavsning surati) · −3 (taqiq)
```
Darsning oxirgi xulosasi: javob SON bo'lsa ham, shartlar qolaveradi (u ≠ 0, u ≠ −3).
Ilgari bu topshiriq `TypeExpr` edi; javob son bo'lgani uchun `TypeValue` ga to'liq
tushdi va savol o'zgarmadi.

## 3. QAMROV

| Tasdiq / adashish | Qayerda |
|---|---|
| qavs amallar tartibini o'zgartiradi | 01, 02, 03, 07 |
| tartib uch pog'onali | 05, 09 |
| shart ORALIQ satrlardan ham yig'iladi | 04, 05, 08, 10 |
| chapdan o'ngga hisoblash | 01, 02, 03, 09 |
| З2 shart javobdan yig'ildi | 04, 05, 08 |
| harflarni qisqartirish | 06 |

## 4. QABUL QILISH

- `npm run build` o'tadi.
- `grade8-practice-check.mjs`: to'g'ri va noto'g'ri yo'l toza.
- `eslint`: yangi xato yo'q.
- Kadrlar: `.tmp/shots/dars06-*`.
