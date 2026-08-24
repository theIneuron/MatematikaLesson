# DARS03_AMALIYOT_KONTENT_V2 — 8-sinf, 3-dars amaliyoti (qayta yaratilgan)

> 2-bosqich (KONTENT). Kirish: `DARS02_06_AMALIYOT_SKELET.md` §5 (ketma-ketlik jadvali),
> `src/components/grade8/Dars03.jsx`. Chiqish: `practice/dars03/D03_01…10.jsx`.
>
> **Metodist qarori 2026-08-24:** 2-6 darslarning har biri 1-DARSNING o'nta mexanikasidan
> foydalanadi, har darsda boshqa ketma-ketlikda. `TypeExpr` o'nlikda yo'q — u 3-darsdan ham
> chiqdi, o'rniga `PairSlots` keldi.
>
> Dizayn tegilmadi: fon `#fff7ed`, urg'u `#fe5b1a`, `kit.jsx` palitrasi, chip qatori.

---

## 1. RASKLADKA

| № | Mexanika | Qiy. | Teg | Manba |
|---:|---|:--:|---|---|
| 01 | `MarkAll` | 🟢 | `factor_seen` | yangi (ilgari `SlotsBank`) |
| 02 | `TrueFalse` | 🟢 | `cancel_claims` | yangi |
| 03 | `TypeValue` | 🟢 | `hole_after_reduce` | ilgari 03 (`HoleSlider`) — savol o'sha |
| 04 | `MatchPairs` | 🟡 | `reduce_to_what` | ilgari 02 — matn o'sha |
| 05 | `Zones` | 🟡 | `does_it_cancel` | ilgari 09 — matn o'sha |
| 06 | `SwapOrder` | 🟡 | `reduce_order` | ilgari 04 (`OrderLines`) |
| 07 | `Choice` | 🟡 | `full_answer_choice` | yangi misol (ilgari `RepairPart`) |
| 08 | `PairSlots` | 🔴 | `what_cancels` | yangi (ilgari `TypeExpr`) |
| 09 | `CodeLock` | 🔴 | `bans_survive` | ilgari 06 (`NumberLine`), uchinchi taqiq qo'shildi |
| 10 | `ClozeBank` | 🔴 | `rule_words` | yangi |

Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. 1-pozitsiyada bitta bosish bilan boshqariladigan tip.
Harflar: f · b · d · c · q · e · h · r · g — takrorlanmaydi.

## 2. MATEMATIKA — TOPSHIRIQMA-TOPSHIRIQ

### 01 · `MarkAll` · 🟢 · `factor_seen`
```
belgilash: umumiy ko'paytuvchisi bor 3 kasr
i1  (f−3)(f+3) / 3(f−3)   HIT   qavs ko'rinib turibdi
i2  5f/(5+f)                    son qo'shiluvchi bo'lib qolgan
i3  7(f+2)/((f+2)(f−1))   HIT   qavs
i4  (f²−9)/(f²−3)               «kvadratlar qisqaradi»
i5  f(f−8)/(4f)           HIT   harfning o'zi ko'paytuvchi
i6  (f+3)/(f+7)                 ikki xil qavs
```
Bu yerda hali QISQARTIRILMAYDI — faqat KO'RILADI. Ajratish 05, 06 va 08 da so'raladi.

### 02 · `TrueFalse` · 🟢 · `cancel_claims`
```
s1: (b²−9)/(b+3) = b−3      -> HA    (ko'paytuvchi qisqardi)
s2: (b+5)/(b+7) = 5/7       -> YO'Q  (qo'shiluvchi qisqarmaydi)
```
Razborda son bilan tekshirish: `b = 1` da chapda uch to'rtdan, o'ngda besh yettidan.

### 03 · `TypeValue` · 🟢 · `hole_after_reduce`
```
(d² − 25)/(d − 5)      qisqargani: d + 5
javob: 5
tuzoqlar: −5 (surat noli) · 0 · 25 (yozuvdagi son)
```
Qisqartirish taqiqni OLIB TASHLAMAYDI — 3-darsning o'zagi. Ilgari surgich edi, endi
son yoziladi.

### 04 · `MatchPairs` · 🟡 · `reduce_to_what`
```
6c/9c ↔ 2/3 · (c+6)/(c+9) ↔ qisqarmaydi · c(c+6)/c(c+9) ↔ (c+6)/(c+9) · (c²−36)/(c+6) ↔ c−6
```
Chiziq bilan birlashtiriladi (`connect: true`).

### 05 · `Zones` · 🟡 · `does_it_cancel`
```
QISQARADI:    (q²−1)/(q+1) · (3q+6)/(q+2) · (q²+2q)/(q+2) · (q²−4q+4)/(q−2)
QISQARMAYDI:  (q+1)/(q+2) · (q²+1)/(q+1) · 5q/(5+q) · (q²+3)/(q+3)
```
01 dan farqi: bu yerda ko'paytuvchi KO'RINMAYDI, avval ajratish kerak.

### 06 · `SwapOrder` · 🟡 · `reduce_order`
```
(2e + 10)/(e² − 25)
l1  2(e+5)/((e−5)(e+5))   ikkala qavatni ajratamiz
l2  e + 5                 umumiy ko'paytuvchini qisqartiramiz
l3  2/(e − 5)             javobni yozamiz
l4  e ≠ 5,  e ≠ −5        shartni yozamiz
start: l4, l3, l2, l1   (teskari; javobgacha ikki almashtirish)
```
Ikki qimmat buzilish: ajratishdan OLDIN qisqartirish; shartni boshiga yoki o'rtaga qo'yish.

### 07 · `Choice` · 🟡 · `full_answer_choice`
```
(3h + 9)/(h² − 9)
0  3/(h−3),  h ≠ 3, h ≠ −3   TO'G'RI
1  3/(h−3),  h ≠ 3           shart JAVOBdan olindi
2  3/(h−3)                   shart umuman yo'q
3  3/(h+3),  h ≠ 3, h ≠ −3   noto'g'ri qavs qoldirildi
```
Uch variantda kasrning o'zi bir xil — tanlash uchun shartni chiqarish kerak.

### 08 · `PairSlots` · 🔴 · `what_cancels`
```
surat hamma joyda bir xil, javobni faqat MAXRAJ hal qiladi:
(r²−9)/(2r−6)   ↔  r−3
(r²−9)/(r²+3r)  ↔  r+3
(r²−9)/(9−r²)   ↔  r²−9      (butun yozuv qisqaradi, minus bir qoladi)
```
Yozuv ZICH (bo'shliqsiz): pazl kartasi telefonda 54px, bo'shliqli yozuv ikki qatorga
bo'linib ketardi va o'ng bo'lakning matni ramkadan chiqardi (o'lchov 2026-08-24).

### 09 · `CodeLock` · 🔴 · `bans_survive`
```
g(g+4) / (g(g−2)(g+4))     qisqargani: 1/(g − 2)
kod (o'sish tartibida): −4, 0, 2
   −4 va 0 qisqaradi va javobda KO'RINMAYDI, lekin taqiq qoladi
   2 javobda ham ko'rinadi
bank: −4 −2 0 1 2 4   tuzoqlar: 4 va −2 (ishora) · 1 (qisqargan kasrning surati)
```
Ilgari `NumberLine` da ikki taqiq so'ralardi; endi uchta va TARTIB ham talab qilinadi.

### 10 · `ClozeBank` · 🔴 · `rule_words`
```
Kasrni qisqartirish — surat va maxrajni ularning umumiy [KO'PAYTUVCHI] ga bo'lish.
Uni ko'rish uchun ikkala qavatni ham [AJRATISH] kerak.
Shart esa qisqargan javobdan emas, [DASTLABKI] maxrajdan olinadi.
bank: ko'paytuvchi · qo'shiluvchi · ajratish · ko'paytirish · dastlabki · qisqargan
```

## 3. QAMROV

| Tasdiq / adashish | Qayerda |
|---|---|
| T1 faqat umumiy KO'PAYTUVCHI qisqaradi | 01, 02, 04, 05, 08, 10 |
| T2 taqiqni DASTLABKI kasr belgilaydi | 03, 06, 07, 09, 10 |
| T3 son qo'yish rad etadi | 02, 03, 07, 08 (razborlarda) |
| З1 had qisqartirildi | 01, 02, 04, 05 |
| З2 taqiq yo'qoldi | 03, 06, 07, 09, 10 |
| З15 ko'paytuvchi topilmadi | 01, 04, 06, 08 |

## 4. YIG'ISHDA NIMA O'ZGARDI

1. Fayllar joyi: eski 02 -> 04, eski 09 -> 05 (matni saqlangan holda).
2. Yangi yozilgan: 01, 02, 07, 08, 10; qayta yozilgan: 03 (`TypeValue`), 06 (`SwapOrder`),
   09 (`CodeLock`).
3. `Dars03Practice.jsx`: chip qatori va metodik xarita yangilandi.
4. `grade8-practice-plan.mjs`: `PLAN_03` to'liq qayta yozildi.
5. `kit.jsx` ga tegilmadi (2-darsda qo'shilgan `Given` qatori yetarli).

## 5. QABUL QILISH

- `npm run build` o'tadi.
- `grade8-practice-check.mjs`: to'g'ri va noto'g'ri yo'l — 5 o'lcham x 3 til, toza.
- `eslint`: yangi xato yo'q.
- Kadrlar: `.tmp/shots/dars03-*`.
