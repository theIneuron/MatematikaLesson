# DARS04_AMALIYOT_KONTENT_V2 — 8-sinf, 4-dars amaliyoti (qayta yaratilgan)

> 2-bosqich (KONTENT). Kirish: `DARS02_06_AMALIYOT_SKELET.md` §6.
> Chiqish: `practice/dars04/D04_01…10.jsx`.
>
> **Metodist qarori 2026-08-24:** 2-6 darslar 1-DARSNING o'nta mexanikasida, har darsda
> boshqa ketma-ketlikda. `TypeExpr` o'nlikda yo'q — 01 endi test.
> Dizayn tegilmadi.

---

## 1. RASKLADKA

| № | Mexanika | Qiy. | Teg | Manba |
|---:|---|:--:|---|---|
| 01 | `Choice` | 🟢 | `same_denominator` | ilgari 01 (`TypeExpr`) — misol o'sha |
| 02 | `MarkAll` | 🟢 | `add_marked_right` | yangi (ilgari `StrikeOut`) |
| 03 | `TrueFalse` | 🟢 | `bans_from_both` | ilgari 03 (`NumberLine`) |
| 04 | `ClozeBank` | 🟡 | `rule_words` | yangi |
| 05 | `CodeLock` | 🟡 | `bans_three_denoms` | yangi |
| 06 | `TypeValue` | 🟡 | `zero_but_banned` | ilgari 10 (`HoleSlider`) |
| 07 | `Zones` | 🟡 | `add_correct_or_not` | ilgari 06 — matn o'sha |
| 08 | `SwapOrder` | 🔴 | `common_denom_order` | ilgari 05 (`OrderLines`) |
| 09 | `MatchPairs` | 🔴 | `which_common_denom` | ilgari 09 — matn o'sha |
| 10 | `PairSlots` | 🔴 | `extra_factor` | yangi (skeletdan chetlanish, §2.10) |

Harflar: b · c · d · w · u · k · g · t · f.

## 2. MATEMATIKA — TOPSHIRIQMA-TOPSHIRIQ

### 01 · `Choice` · 🟢 · `same_denominator`
```
5b/(b+7) + 2b/(b+7)
0  7b/(b+7)      TO'G'RI
1  7b/(2b+14)    maxrajlar ham qo'shildi (З24)
2  10b²/(b+7)²   qo'shish ko'paytirishga aylandi
3  7b            maxraj yo'qoldi
```

### 02 · `MarkAll` · 🟢 · `add_marked_right`
```
i1  3/c + 4/c = 7/c              HIT
i2  3/c + 4/c = 7/2c                   maxrajlar qo'shildi (З24)
i3  (c+8)/c − (c+2)/c = 6/c      HIT
i4  (c+8)/c − (c+2)/c = 10/c           AYIRISHDA QAVS YO'Q (З25)
i5  5/c − 2/c = 3/c              HIT
i6  4/c + 4/c = 8/c²                   maxrajlar ko'paytirildi
```
i3 va i4 yonma-yon turadi va faqat suratda farq qiladi — ayirishdagi qavs shu yerda
tutiladi (ilgari bu alohida `RepairPart` topshirig'i edi).

### 03 · `TrueFalse` · 🟢 · `bans_from_both`
```
given: 3/(d − 2) + 5/(d + 6)
s1: 3/(d−2)  at d = 2  «yig'indi ma'noga ega emas» -> HA
s2: 5/(d+6)  at d = 6  «yig'indi ma'noga ega emas» -> YO'Q  (d+6 = 12)
```

### 04 · `ClozeBank` · 🟡 · `rule_words`
```
Maxrajlar bir xil bo'lsa, faqat [SURATLAR] qo'shiladi, maxraj o'zgarmaydi.
Maxrajlar har xil bo'lsa, avval [UMUMIY MAXRAJ] topiladi.
Shart esa har bir [DASTLABKI] maxrajdan olinadi.
bank: suratlar · maxrajlar · umumiy maxraj · javob · dastlabki · yig'indining
```

### 05 · `CodeLock` · 🟡 · `bans_three_denoms`
```
1/w + 2/(w − 3) − 5/(w + 5)     kod: −5, 0, 3
bank: −5 −3 0 2 3 5   tuzoqlar: −3 va 5 (ishora) · 2 (surat)
```
Uch qo'shiluvchi — uch maxraj — uch taqiq; bittasini unutish javobni buzadi.

### 06 · `TypeValue` · 🟡 · `zero_but_banned`
```
3/(u − 4) − 3/(u − 4)      javob: 4
tuzoqlar: 0 · −4 (ishora) · 3 (surat)
```
«Javob nol, demak shart kerak emas» degan fikr shu yerda o'ladi.

### 07 · `Zones` · 🟡 · `add_correct_or_not`
```
TO'G'RI:   3/k+4/k=7/k · 2/k−5/k=−3/k · 5/k−2/k=3/k · 1/(k+1)+1/(k−1)=2k/(k²−1)
NOTO'G'RI: 3/k+4/k=7/2k · 4/k+4/k=8/k² · 1/k+1/3=2/(k+3) · 1/(k+1)+1/(k−1)=2/(k²−1)
```

### 08 · `SwapOrder` · 🔴 · `common_denom_order`
```
2/g + 3/(g + 1)
l1  g(g+1)          umumiy maxrajni topamiz
l2  2(g+1) + 3g     suratlarni keltiramiz
l3  (5g+2)/(g²+g)   javobni yozamiz
l4  g ≠ 0, g ≠ −1   shartni yozamiz
start: l4, l1, l3, l2
```

### 09 · `MatchPairs` · 🔴 · `which_common_denom`
```
1/t + 1/(t+3) ↔ t(t+3) · 1/(t−3) + 1/(t+3) ↔ t²−9 · 1/t + 1/t² ↔ t² · 1/2t + 1/3t ↔ 6t
```
Chiziq bilan birlashtiriladi (`connect: true`).

### 10 · `PairSlots` · 🔴 · `extra_factor`
```
umumiy maxraj: f² − 4
3/(f−2)  ↔ f+2
5/(f+2)  ↔ f−2
7/(f²−4) ↔ 1        <- «har kasrga albatta qavs kerak» degan fikr shu yerda o'ladi
```
**Skeletdan chetlanish.** Skelet §6.10 da bu o'ringa «yig'indi ↔ shart» juftligi
yozilgan edi. Pazl kartasi telefonda 54px — ikki kasrning yig'indisi u yerga sig'maydi
(o'lchov 2026-08-24). Savol keltirishning ichiga olindi: bu ham 4-darsning o'z
ko'nikmasi va 08 dagi «umumiy maxrajni top» qadamini bevosita davom ettiradi.
Shart bo'yicha qoplov yo'qolmadi — u 03, 04, 05, 06 va 08 da tekshiriladi.

## 3. QAMROV

| Tasdiq / adashish | Qayerda |
|---|---|
| bir xil maxrajda faqat suratlar | 01, 02, 04, 07 |
| umumiy maxrajga keltirish | 04, 08, 09, 10 |
| shart HAR BIR dastlabki maxrajdan | 03, 04, 05, 06, 08 |
| З24 maxrajlar qo'shildi | 01, 02, 04, 07 |
| З25 ayirishda qavs yo'q | 02 |
| З2 shart bitta maxrajdan yoki javobdan | 03, 04, 05, 06, 08 |

## 4. QABUL QILISH

- `npm run build` o'tadi.
- `grade8-practice-check.mjs`: to'g'ri va noto'g'ri yo'l toza.
- `eslint`: yangi xato yo'q.
- Kadrlar: `.tmp/shots/dars04-*`.
