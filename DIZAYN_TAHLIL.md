
# Dizayn auditi — barcha 33 dars (Dars01–Dars33)

**Maqsad:** barcha darslar dizaynini bitta standartga (namuna) tenglashtirish.
**Namuna nomzodi (tavsiya):** **Dars33** — yagona toza etalon; Dars18 va Dars24–32 ham unga teng.
**Audit usuli:** har bir fayl to'liq o'qildi, har slayd 8 ta dizayn-mezoni bo'yicha tekshirildi. Hech narsa o'zgartirilmadi.

---

## 1. Dizayn-mezonlari (8 ta)

Namuna (Dars33) shu 8 belgini o'zida jamlaydi. Boshqa darslar shularga solishtiriladi:

1. **Sarlavha-shapka yo'q** — slayd kontentida katta `<h1/h2 className="title h-title">` blok bo'lmasligi; faqat Stage'ning yuqorisidagi kichik `eyebrow` chip. Kontent darrov mazmun bilan boshlanadi.
2. **Skroll yo'q** — kontent 100dvh (1280×800 / 390×844) ichiga sig'adi. `FeedbackBlock`dagi `scrollIntoView` (≈519-qator) hamma darsda bor va NORMAL (namunada ham bor); faqat **qo'shimcha** `ExplorationStep` step-skrolli muammo.
3. **QuestionScreen v2** — imzoda `factOnCorrect` propi bor.
4. **FactCard (badge+anim)** — to'g'ri javobdan keyin 2-3 muhim test/case slaydida; `FB_*` badge + `Anim*` animatsiya.
5. **reduced-motion** — STYLES'da `@media (prefers-reduced-motion: reduce)`.
6. **s0 jonli animatsiya** — birinchi slayd harakat bilan ochiladi.
7. **Bo'sh joy loop-animatsiya bilan** to'ldirilgan.
8. **ConnectionsBlock** — summary slaydida bog'lanishlar (RefNote/teaser EMAS).

---

## 2. Umumiy moslik jadvali (33 dars × asosiy mezonlar)

Belgilar: ✓ mos · ✗ yo'q · ~ qisman

| Dars | Avlod | QS v2 | reduced-motion | FactCard | ConnectionsBlock | s0 anim | shapka olib tashlangan | qo'shimcha skroll |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Dars01 | eski-Nat | ✗ | ✗ | ✗ 0 | ✗ (forward) | ~ | ✗ | ✓ step |
| Dars02 | eski-Nat | ✗ | ✗ | ✗ 0 | ✗ (teaser) | ✗ | ✗ | ✓ step |
| Dars03 | eski-Nat | ✗ | ✗ | ✗ 0 | ✗ RefNote | ✗ | ✗ | ✓ step |
| Dars04 | eski-Nat | ✗ | ✗ | ✗ 0 | ✗ RefNote | ✗ | ✗ | — |
| Dars05 | eski-Nat | ✗ | ✗ | ✗ 0 | ✗ RefNote | ✗ | ✗ | ✓ step |
| Dars06 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars07 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars08 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars09 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars10 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars11 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars12 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars13 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step |
| Dars14 | eski-frac | ✗ | ✗ | ✗ 0 | ✓ | ✓ | ✗ | ✓ step (2x) |
| Dars15 | o'tish | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ~ h-sub | — |
| Dars16 | o'tish | ✓ | ✗ | ✓ 4 | ✓ | ✗ | ~ | — |
| Dars17 | o'tish | ✗ | ✗ | ~ 2 (eski) | ✓ | ✓ | ✗ h-title | ✓ step |
| Dars18 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars19 | yangi | ✓ | ✓ | ✓ 3 (siyrak) | ✓ | ✓ | ~ | — |
| Dars20 | yangi | ✓ | ✓ | ✓ 4 | ✓ | ✓ | ~ | ✓ step |
| Dars21 | yangi | ✓ | ✓ | ✓ 3 (zaif qamrov) | ✓ | ✓ | ~ | — |
| Dars22 | yangi | ✓ | ✓ | ✓ 3 (FB_HIST yo'q) | ✓ | ✓ | ~ | ✓ step |
| Dars23 | yangi | ✓ | ✓ | ✓ 3 (siyrak) | ✓ | ✓ | ~ | ✓ step |
| Dars24 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | ✓ step (s2,s3) |
| Dars25 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars26 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars27 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars28 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars29 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars30 | yangi | ✓ | ✓ | ✓ 4 | ✓ | ✓ | ✓ | — |
| Dars31 | yangi | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |
| Dars32 | yangi | ✓ | ✓ | ✓ 4 | ✓ | ✓ | ✓ | — |
| **Dars33** | **namuna** | ✓ | ✓ | ✓ 3 | ✓ | ✓ | ✓ | — |

---

## 3. Ish hajmi bo'yicha guruhlash

**A guruh — to'liq qayta ishlov (eng katta ish): Dars01–14, Dars17 (15 ta dars)**
Bularga 4-5 tizimli o'zgarish kerak: QuestionScreen v1→v2 (factOnCorrect), FactCard infratuzilmasi (FB_* + Anim*) va 2-3 ta fakt, reduced-motion, kontentdagi h-title/h-sub shapkalarni olib tashlash. Dars01–05 ga qo'shimcha: RefNote/forward/teaser → ConnectionsBlock, s0 jonli animatsiya.

**B guruh — kichik tuzatish: Dars15, Dars16, Dars19–24 (8 ta dars)**
- Dars15: deyarli tayyor (faqat ko'rib chiqish).
- Dars16: reduced-motion qo'shish + s0 ga jonli animatsiya.
- Dars19, 21, 23: FactCard qamrovini kuchaytirish (muhim testlarda fakt yo'q).
- Dars20, 22, 23, 24: qo'shimcha `ExplorationStep` step-skrollini olib tashlash.
- Dars22: FB_HIST badge qo'shib xilma-xillik.

**C guruh — o'zgartirish shart emas: Dars18, Dars25–33 (10 ta dars)**
Namuna bilan teng.

---

## 4. Slayd-darajadagi batafsil tahlil

> Quyida har dars uchun lesson-level holat + slaydlar jadvali. "O'zgartirish kerak" ustuni aniq harakatni ko'rsatadi; "—" = mos.

### A GURUH — eski-Nat (Dars01–05)

#### Dars01 — Atrofimizdagi katta sonlar
QS v1 · reduced-motion ✗ · FactCard 0 · bog'lanish: yo'q (s13 `forward` matni) · s0: loop bor (lekin sarlavha bilan)

| Slayd | Tur | Shapka | Skroll | FactCard | O'zgartirish |
|---|---|---|---|---|---|
| s0 | hook | h1.h-title @1447 | — | — | h1 olib tashlash; kontent darrov OrbitDiagram+savol |
| s1 | exploration | h2.h-title @1470 | scroll @1080 | — | h-title olib tashlash; scroll→flex-fit |
| s2 | rule | h2.h-title @1100 | — | — | h-title olib tashlash |
| s3 | test (SpacesInteractive) | h2.h-sub @1275 | — | — | h-sub kichraytirish; FactCard (FB_SCI) |
| s4 | exploration | h2.h-title @1492 | scroll @1080 | — | h-title; scroll→flex-fit |
| s5 | rule | h2.h-title @1100 | — | — | h-title olib tashlash |
| s6 | test (HintChoice) | h2.h-sub @1113 | — | — | h-sub kichraytirish; FactCard |
| s7 | exploration | h2.h-title @1521 | scroll @1080 | — | h-title; scroll→flex-fit |
| s8 | rule | h2.h-title @1100 | — | — | h-title olib tashlash |
| s9 | test/NumInput | h2.h-sub @1161 | — | — | h-sub kichraytirish; FactCard |
| s10 | exploration | h2.h-title @1550 | scroll @1080 | — | h-title; scroll→flex-fit |
| s11 | test/final (DragMatch) | eyebrow+prompt | drag-skroll ehtimoli | — | sarlavha kichraytirish; FactCard |
| s12 | test/final NumInput | h2.h-sub @1161 | — | — | h-sub; FactCard |
| s13 | summary | h2.h-title @1581 | 100dvh xavfi | — | `forward`→ConnectionsBlock |

#### Dars02 — Ko'p xonali sonlarni taqqoslash va yaxlitlash
QS v1 · reduced-motion ✗ · FactCard 0 · bog'lanish: yo'q (teaser) · s0: faqat fade-up (harakatsiz). **Kosmik mavzu — FB_SCI uchun ideal.**

| Slayd | Tur | Shapka | Skroll | FactCard | O'zgartirish |
|---|---|---|---|---|---|
| s0 | hook | h1.h-title @1310 + h-sub @1324 | — | — | h1 blok olib tashlash; s0 ga harakatli kirish |
| s1 | exploration | h2.h-title @1359 | — | — | h-title kichraytirish |
| s2 | rule | h2.h-title @1389 | — | — | sarlavha kichraytirish |
| s3 | test/MC | eyebrow+h-sub @1412 | — | — | FactCard/factOnCorrect |
| s4 | test/MC | eyebrow+h-sub @1418 | — | — | FactCard (FB_SCI sayyoralar) |
| s5 | exploration | h2.h-title @1445 | scroll @1431 | — | scroll olib tashlash |
| s6 | rule | h2.h-title @1488 | — | — | sarlavha kichraytirish |
| s7 | exploration | h2.h-title @1536 | — | — | sarlavha kichraytirish |
| s8 | test/MC | eyebrow+h-sub @1568 | — | — | FactCard |
| s9 | test/NumInput | eyebrow+h-sub @1600 | — | — | sarlavha kichraytirish |
| s10 | test/NumInput | eyebrow+h-sub @1600 | — | — | — |
| s11 | case | h2.h-title @1642 | — | — | sarlavha; FactCard mumkin |
| s12 | case/MC | eyebrow+h-sub @1659 | — | — | FactCard (FB_SCI Yupiter) |
| s13 | case/MC | eyebrow+h-sub @1665 | — | — | factOnCorrect |
| s14 | test/MC final | eyebrow+h-sub @1671 | — | — | FactCard |
| s15 | test/MC final | eyebrow+h-sub @1677 | — | — | FactCard |
| s16 | summary | h2.h-title @1691 | — | — | teaser→ConnectionsBlock |

#### Dars03 — Ustun shaklida qo'shish va ayirish
QS v1 · reduced-motion ✗ · FactCard 0 · bog'lanish: RefNote · s0: harakatsiz. Ko'rinish tartibi `SEQUENCE=[0,1,2,3,4,14,5,...]`.

| Slayd | Tur | Shapka | Skroll | FactCard | O'zgartirish |
|---|---|---|---|---|---|
| s0 | hook | h1.h-title @2180 | past | — | sarlavha; harakatli kirish |
| s1 | exploration/ColumnDemo | title | — | — | eyebrow chip ostida |
| s2 | rule/RuleScreenGold | h2.h-title @2135 + RefNote | — | — | h-title olib tashlash |
| s3 | test/NumInput | eyebrow+h-sub @1044 | scroll @475 | — | h-sub; scroll olib tashlash |
| s4 | test/MC (Retry) | eyebrow+h-sub @1362 | scroll @475 | — | factOnCorrect/FactCard; scroll |
| s14 | test/NumInput | eyebrow+h-sub @1044 | scroll @475 | — | scroll olib tashlash |
| s5 | exploration/ColumnDemo | title | — | — | eyebrow chip ostida |
| s6 | rule/RuleScreenGold | h-title @2135 + RefNote | — | — | h-title olib tashlash |
| s7 | test/NumInput | eyebrow+h-sub @1044 | scroll @475 | — | scroll olib tashlash |
| s8 | test/MC (Retry) | eyebrow+h-sub @1362 | scroll @475 | — | factOnCorrect/FactCard; scroll |
| s9 | case | h2.h-title @2265 + RefNote | — | — | h-title; faktlarni FactCard'ga |
| s10 | case/MC (Retry) | eyebrow+h-sub @1362 | scroll @475 | — | factOnCorrect/FactCard; scroll |
| s11 | test/MC final | eyebrow+h-sub @1362 | scroll @475 | — | factOnCorrect/FactCard; scroll |
| s12 | test/NumInput final | eyebrow+h-sub @1044 | scroll @475 | — | scroll olib tashlash |
| s13 | summary | h2.h-title @2322 + RefNote | scroll @1911 | — | RefNote→ConnectionsBlock; scroll |

#### Dars04 — Ustun shaklida ko'paytirish
QS v1 · reduced-motion ✗ · FactCard 0 · bog'lanish: RefNote+REFS · s0: fade-up delay (loop emas)

| Slayd | Tur | Shapka | Skroll | FactCard | O'zgartirish |
|---|---|---|---|---|---|
| s0 | hook | h1.h-title @1932 + h-sub | — | — | h1; kontent darrov MulBoard |
| s1 | exploration | h2.h-title @1497 | — | — | h-title→eyebrow chip |
| s2 | rule | h2.h-title @1520 | — | — | h-title; RefNote→ConnectionsBlock |
| s3 | test/InteractiveMulColumn | eyebrow+h-sub @1224 | — | — | factOnCorrect/FactCard |
| s4 | test/MC (Retry) | eyebrow+h-sub @1411 | — | — | FactCard |
| s5 | exploration | h2.h-title @1497 | — | — | h-title→eyebrow chip |
| s6 | rule | h2.h-title @1520 | — | — | h-title; RefNote→ConnectionsBlock |
| s7 | test/MC (Retry) | eyebrow+h-sub @1411 | — | — | FactCard |
| s8 | case/MC (Retry) | eyebrow+h-sub @1411 | — | — | FactCard (muhim case) |
| s9 | test/MC final (Retry) | eyebrow+h-sub @1411 | — | — | FactCard (final) |
| s10 | summary | h2.h-title @2033 | — | — | RefNote→ConnectionsBlock |

#### Dars05 — Burchak usulida bo'lish, qoldiqli bo'lish
QS v1 · reduced-motion ✗ · FactCard 0 · bog'lanish: RefNote (REFS hammasi null) · s0: harakatsiz

| Slayd | Tur | Shapka | Skroll | FactCard | O'zgartirish |
|---|---|---|---|---|---|
| s0 | hook | h1.h-title @1613 + h-sub | — | — | h1/h-sub; kirish animatsiyasi |
| s1 | exploration | h2.h-title @1352 | scroll @1337 | — | h-title; endRef scroll o'chirish |
| s2 | exploration | h2.h-title @1352 | scroll @1337 | — | sarlavha + skroll |
| s3 | rule/RuleScreenGold | h2.h-title @1387 | — | — | h-title; RefNote olib tashlash |
| s4 | test/NumInput | eyebrow+h-sub @1525 | — | — | sarlavha→Stage chip; FactCard |
| s5 | test/MC | eyebrow+h-sub @1453 | — | — | sarlavha; FactCard |
| s6 | exploration | h2.h-title @1352 | scroll @1337 | — | sarlavha + skroll |
| s7 | rule/RuleScreenGold | h2.h-title @1387 | — | — | h-title; RefNote olib tashlash |
| s8 | test/NumInputRemainder | eyebrow+h-sub @1588 | — | — | sarlavha; FactCard |
| s9 | test/MC | eyebrow+h-sub @1453 | — | — | sarlavha; FactCard |
| s10 | case | h2.h-title @1652 | — | — | h-title; faktlarni FactCard'ga |
| s11 | case/MC | eyebrow+h-sub @1453 | — | — | sarlavha; FactCard nomzodi |
| s12 | test/MC final | eyebrow+h-sub @1453 | — | — | sarlavha; FactCard nomzodi |
| s13 | test/NumInput final | eyebrow+h-sub @1525 | — | — | sarlavha |
| s14 | summary | h2.h-title @1687 | — | — | RefNote→ConnectionsBlock |

### A GURUH — eski-frac (Dars06–14)

**Bularning umumiy holati bir xil:** QS v1 (factOnCorrect yo'q, ≈590/599-qator), FactCard 0, reduced-motion yo'q, kontentda h-title/h-sub shapka, s1 (ba'zan s7) da `scrollIntoView` step-skroll, feedback-skroll (492/501). **Allaqachon mos:** Stage eyebrow chip, s0 hook animatsiyasi (hook-alive/sheen/glow), ConnectionsBlock summary'da, max-width 936.

**Har biriga bir xil 4 ta ish:** (1) QS→v2 + 2-3 FactCard (odatda s6/s9/s11 yoki s4/s7/s11); (2) reduced-motion qo'shish; (3) step-`scrollIntoView` olib tashlash; (4) kontent h-title/h-sub shapkalarni eyebrow chipga tayanish.

| Dars | Mavzu | s0 hook | scroll (step) | FactCard tavsiya | Summary |
|---|---|---|---|---|---|
| Dars06 | Kasr nima (butun qismi) | h1+h-sub @1073 | s1 @1104 + feedback @492 | s6/s9/s11 | ConnectionsBlock ✓ |
| Dars07 | Kasr son o'qida | h1+h-sub @1117 | s1 @1151 + feedback @501 | s6/s9/s11 | ConnectionsBlock ✓ |
| Dars08 | Kasr — bo'lish natijasi | h1+h-sub @1128 | s1 @1164 + feedback @501 | s6/s9/s11 | ConnectionsBlock ✓ |
| Dars09 | Bir xil maxrajli taqqoslash | h1+h-sub @1129 | s1 @1159 + feedback @501 | s6/s9/s11 | ConnectionsBlock ✓ |
| Dars10 | Bir xil suratli taqqoslash | h1+h-sub @1131 | s1 @1161 + feedback @501 | s6/s9/s11 (+s5 trap/truth h-sub) | ConnectionsBlock ✓ |
| Dars11 | Har xil maxrajli taqqoslash | h1.h-title @1161 | s1 @1191 | s4/s7/s11 | ConnectionsBlock ✓ |
| Dars12 | Ekvivalent kasrlar — qoida | h2.h-sub @1121 | s1 @1146 | s4/s7/s11 | ConnectionsBlock ✓ |
| Dars13 | Kasrlarni qisqartirish | h2.h-sub @1127 | s1 @1152 | s4/s7/s11 | ConnectionsBlock ✓ |
| Dars14 | Bir xil maxrajli qo'shish (16 slayd) | h1.h-title @1189 | s1 @1218 + s7 @1353 | s5/s9/s13 | ConnectionsBlock ✓ |

> Batafsil slayd-jadvallari (har bir s0–s12/s15) audit jurnalida saqlanadi; tuzilma yuqoridagi takrorlanuvchi shablonga mos — har test/case MCScreen, har rule/exploration custom h-title bilan.

### A GURUH — o'tish, eng problemli: Dars17

#### Dars17 — Noto'g'ri kasrlar / aralash sonlar
QS **v1** (factOnCorrect yo'q) · reduced-motion ✗ · FactCard 2 ta **eski uslub** (`💡`+matn, badge/anim yo'q, to'g'ri javobga bog'lanmagan, dekorativ — s2 @1504, s7 @1729) · ConnectionsBlock ✓ · s0 anim ✓

| Slayd | Tur | Shapka | Skroll | FactCard | O'zgartirish |
|---|---|---|---|---|---|
| s0 | hook | **h1.h-title @1387 (KATTA)** | — | — | h1→h-sub (katta shapka taqiq) |
| s1 | test/MC warmup | h-sub @1518 | feedback | — | QS v1→v2 |
| s2 | exploration | h-title @1424 + dekor FactCard | scroll @1417 | eski | h-title→h-sub; step-skroll; FactCard→v2 |
| s3 | exploration | h-title @1465 | — | — | h-title→h-sub |
| s4 | rule | h-title+eyebrow @1489 | — | — | h-title kichraytirish |
| s5 | rule (frac input) | h-title @1598 | — | — | h-title→h-sub |
| s6 | rule | h-title @1646 | — | — | h-title→h-sub |
| s7 | test/MC | eyebrow+h-sub @1670 + dekor FactCard | feedback | eski | QS v1→v2; FactCard→v2 |
| s8 | test/MC | eyebrow+h-sub @1685 | feedback | — | QS v1→v2 |
| s9 | case/MC | h-sub | feedback | — | QS v1→v2 |
| s10–s13 | case/test/MC | eyebrow+h-sub | feedback | — | QS v1→v2; muhim testga FactCard |
| s14 | test/MC final | eyebrow+h-sub @1800 | feedback | — | QS v1→v2 |
| s15 | test/FracInput final | — | — | — | — |
| s16 | summary | h-title+eyebrow @1830 | — | — | ConnectionsBlock ✓ |

### B GURUH — kichik tuzatish (Dars15, 16, 19–24)

#### Dars15 — Teng maxrajli kasrlarni ayirish
QS v2 ✓ · reduced-motion ✓ · FactCard 3 (s4 AnimProgress, s8 AnimBattery, s11 AnimEgypt) · ConnectionsBlock ✓ · s0 anim ✓ (TvRewind). **Deyarli tayyor** — faqat FeedbackBlock skrollini ko'rib chiqish (ixtiyoriy). s5/s7 testlarga ixtiyoriy FactCard qo'shish mumkin.

#### Dars16 — Har xil maxrajli kasrlarni qo'shish
QS v2 ✓ · **reduced-motion ✗** · FactCard 4 (s5 AnimGear, s8 AnimPixel inline, s11 AnimProgress) · ConnectionsBlock ✓ · **s0 STATIK ✗**. **2 ta ish:** (1) STYLES'ga reduced-motion qo'shish; (2) s0 ga jonli animatsiya (Dars15 `hook-alive` kabi).

#### Dars19 — Aralash↔noto'g'ri o'tkazish
QS v2 ✓ · reduced-motion ✓ · FactCard 3 (s10, s13, s14 — bittadan) · ConnectionsBlock ✓ · s0 anim ✓. **Ish:** s8/s9/s11 testlarda FactCard yo'q — qamrovni kuchaytirish.

#### Dars20 — Aralash sonlarni qo'shish/ayirish
QS v2 ✓ · reduced-motion ✓ · FactCard 4 (s8, s11, s13, s14) · ConnectionsBlock ✓ · s0 anim ✓. **Ish:** qo'shimcha `ExplorationStep` skroll (@1342) olib tashlash; s7/s9/s10 ga FactCard.

#### Dars21 — O'nli kasr, tushuncha
QS v2 ✓ · reduced-motion ✓ · FactCard 3 (s6, s10, s12) · ConnectionsBlock ✓ · s0 anim ✓. **Ish — FactCard qamrovi eng zaif:** s7/s8/s9/s13 (jumladan yakuniy s13) faktsiz.

#### Dars22 — O'nli kasrlarni solishtirish/yaxlitlash
QS v2 ✓ · reduced-motion ✓ · FactCard 3 (s7, s12, s13) · ConnectionsBlock ✓ · s0 anim ✓. **Ish:** qo'shimcha step-skroll (@1331) olib tashlash; s10 ga FactCard; FB_HIST badge umuman yo'q — xilma-xillik uchun qo'shish.

#### Dars23 — O'nli kasrlarni qo'shish/ayirish
QS v2 ✓ · reduced-motion ✓ · FactCard 3 (s9, s10, s12) · ConnectionsBlock ✓ · s0 anim ✓ (eng toza s0). **Ish:** qo'shimcha step-skroll (@1219) olib tashlash; s6/s7/s8 muhim testlarda FactCard yo'q.

#### Dars24 — Verguldan keyingi raqamlarni ko'paytirish/bo'lish
QS v2 ✓ · reduced-motion ✓ · FactCard 3 (s8, s10, s14) · ConnectionsBlock ✓ · s0 anim ✓. **Yagona ish:** s2/s3 dagi `ExplorationStep` step-skroll (@1353) — yo bosqichlarni 100dvh ichiga sig'dirish, yo metodist atayin qoldirilgan deb tasdiqlaydi.

### C GURUH — o'zgartirish shart emas (Dars18, 25–33)

Hammasi namuna (Dars33) bilan teng: QS v2, reduced-motion, FactCard (badge+anim), ConnectionsBlock, s0 jonli, shapka yo'q.

| Dars | Mavzu | FactCard soni | Izoh |
|---|---|---|---|
| Dars18 | Aralash sonlardan ayirish | 3 (s8, s12, s13) | etalon-teng |
| Dars25 | Foiz nima | 3 (s6, s10, s12) | to'liq mos |
| Dars26 | Foizni hisoblash | 3 (s6, s10, s13) | to'liq mos |
| Dars27 | Foizi bo'yicha sonni topish | 3 (s6, s11, s13) | to'liq mos |
| Dars28 | Perimetr | 3 (s9, s11, s12) | to'liq mos |
| Dars29 | Natural sonlarni ko'paytirish (yuza) | 3 (s8, s11, s14) | to'liq mos |
| Dars30 | Uchburchak yuzasi | 4 (s10, s11, s13, s14) | mos (FactCard 4 — yumshoq chegaradan +1) |
| Dars31 | Parallelepiped hajmi | 3 (s8, s9, s13) | to'liq mos |
| Dars32 | Butun sonlar / koordinata o'qi | 4 (s7, s8, s11, s12) | mos (FactCard 4) |
| **Dars33** | **Qarama-qarshi sonlar (NAMUNA)** | **3 (s7, s9, s12)** | **etalon** |

---

## 5. Qaror uchun savollar (metodist hal qiladi)

1. **Namuna** — Dars33 ni tasdiqlaysizmi, yoki boshqa darsni belgilaysizmi?
2. **Shapka siyosati** — "shapka yo'q" qat'iy bo'lsa, B guruhdagi `h-sub` savol-sarlavhalarini ham olib tashlaymizmi, yoki `h-sub` (kichik) qoladimi? (Namuna Dars33 da savol `h-sub` bilan beriladi — ya'ni `h-sub` mos, faqat katta `h-title` taqiq.)
3. **FactCard soni** — qat'iy "2-3 ta" mi, yoki 4 ta (Dars30/32) ham maqbulmi?
4. **scrollIntoView** — FeedbackBlock skrolli (hamma darsda, namunada ham bor) qoladi; faqat qo'shimcha step-skroll olib tashlanadi — to'g'rimi?
5. **Boshlash tartibi** — A guruhdan (eng katta farq) boshlaymizmi, yoki B guruhdan (tez g'alaba)?

---

## 6. Dars34–37 (audit kengaytmasi, 2026-06-23)

Bu audit dastlab Dars01–33 ni qamragandi. Geometriya to'plami Dars34–37 keyin
qurilgan va **zamonaviy standartga mos** (tez tekshiruv: reduced-motion ✓,
katta in-content `h-title` yo'q, 1 ta `scrollIntoView`, `max-width: 936`, FactCard).
Ya'ni C guruh (o'zgartirish shart emas) endi **Dars18, 25–37** ni qamraydi.

| Dars | Mavzu | Holat |
|---|---|---|
| Dars34 | To'rtburchak/kvadrat perimetri | mos |
| Dars35 | To'rtburchak/kvadrat yuzasi | mos |
| Dars36 | Uchburchak yuzasi | mos |
| Dars37 | Parallelepiped hajmi | **keep-visible etalon** (tokenlar manbasi) |

> Eslatma: §2/§4 dagi ba'zi mavzu↔raqam yorliqlari (Dars28–33) eski tartibdan
> qolgan — joriy tartib `src/App.jsx` / `src/lessons/grade5.js` da. Dizayn-status
> fayl bo'yicha to'g'ri; faqat mavzu nomlari siljigan bo'lishi mumkin.

Aniq dizayn tokenlari va 1-sinf adaptatsiyalari: **`DIZAYN_STANDART_1SINF.md`**.
