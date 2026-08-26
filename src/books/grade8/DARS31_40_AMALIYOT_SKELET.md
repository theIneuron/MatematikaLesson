# 8-SINF AMALIYOTI, 31-40 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-25: **31-40 darslarning amaliyoti 21-30 bilan bir xil qoida
bo'yicha yaratiladi** — 1-darsdagi AYNAN O'SHA o'nta mexanika, har darsda boshqa
ketma-ketlik, fon rangi va dizayn tegilmaydi. Shu topshiriqda YANGI shart ham bor:
ha/yo'q savollarining javoblari faqat «Ha, Yo'q» ketma-ketligida bo'lmasin — «Ha, Ha»,
«Yo'q, Ha» va «Yo'q, Yo'q» kombinatsiyalari ham bo'lsin (§0a.3).

Bu hujjat — 1-etap (skelet). Kontent 2-etapda, faqat skelet tasdiqlangandan keyin.
Oldingi hujjatlar: `DARS21_30_AMALIYOT_SKELET.md` (eng yaqin namuna),
`DARS15_20_AMALIYOT_SKELET.md`, `DARS07_11_AMALIYOT_SKELET.md` (o'nta mexanikaning
kontrakti).

O'n dars — ikki blokning chegarasi: 31-36 Б5 ning O'ZI (butun ko'rsatkichli daraja,
statistika, kombinatorika), 37-40 esa Б6 ni ochadi (to'rtburchaklar va yuzalar). Bu
oldingi o'ntalikdan qattiqroq burilish: 37-darsdan boshlab mavzu ALGEBRA emas,
GEOMETRIYA, va amaliyotda birinchi marta CHIZMA mazmunning o'zi bo'lib qoladi (§0a.2).

---

## 0. HAMMA TASDIQ NAZARIY DARSDAN OLINGAN

Repo'da `Dars31.jsx` … `Dars40.jsx` turibdi, ya'ni bu skeletda hech bir tasdiq taklif
qilinmagan — hammasi nazariy fayllarning `STATEMENTS` va `MISS` idan aynan olingan.

| Dars | Blok | Mavzu (`META.topic`) | Adashishlar |
|---:|:--:|---|---|
| 31 | Б5 | Butun ko'rsatkichli daraja | З16, З62, З63 |
| 32 | Б5 | Butun ko'rsatkichli darajaning xossalari | З16, З64, З65 |
| 33 | Б5 | Sonning standart ko'rinishi | З16, З66, З67 |
| 34 | Б5 | Ma'lumotlarni yig'ish va ifodalash | З16, З69, З70 |
| 35 | Б5 | O'rtacha qiymat, moda, mediana | З16, З71, З72 |
| 36 | Б5 | Kombinatorika, perebor va asosiy qonun | З16, З73, З74 |
| 37 | Б6 | Parallelogramm va uning xossalari | З16, З75, З76, З77, З78 |
| 38 | Б6 | To'g'ri to'rtburchak, romb va kvadrat | З16, З79, З80 |
| 39 | Б6 | Trapetsiya va uning xossalari | З16, З81, З82 |
| 40 | Б6 | Parallelogrammning yuzi | З16, З83, З84 |

Yangi adashish kodi o'ylab topilmadi: З62-З84 ni nazariy darslarning o'zi kiritgan.
З68 bu o'ntalikda uchramaydi — u nazariy darslarda ham yo'q, raqam bo'sh qolgan.

---

## 0a. OLTITA QAROR — TO'RTTASI SHU YERDA, IKKITASI METODISTNIKI

### 0a.1. BIRINCHI UCHTALIK QOIDASI TUGADI — QAROR KERAK

`scripts/grade8-practice-seq.mjs` ning 4-sharti: **hech bir darsning birinchi uchtaligi
takrorlanmasin** (15-darsdan kuchda). Bu shart 31-darsda amalda BAJARILMAYDI, va sabab
arifmetik:

- 1-pozitsiyaga faqat uch tip qo'yiladi — A `Choice`, C `TrueFalse`, F `MarkAll`;
- 2- va 3-pozitsiyaga og'ir tip qo'yilmaydi, ya'ni faqat A, B, C, E, F;
- demak birinchi uchtalikning JAMI varianti 3 × 4 × 3 = **36 ta**;
- 1-30 darslar ulardan **27 tasini** band qilgan, bo'sh **9 tasi** qolgan:
  `ACE AEB AEC CBA CFE FAB FBE FCA FEA`.

**To'qqizta bo'sh o'rin, o'nta dars.** Ya'ni qoidani o'z holicha qoldirib 31-40 ni yig'ish
mumkin emas, va bu 41-55 da yanada qattiqroq bo'ladi: 55 dars uchun 36 ta uchtalik hech
qachon yetmaydi. Qoida yozilganda 15-20 ko'zda tutilgan edi, kursning oxiri emas.

**Taklif (tavsiya etaman): shart GLOBAL emas, DERAZALI bo'lsin.** Birinchi uchtalik
faqat YAQIN darslar bilan taqqoslansin — ±12 dars. Sababi qoidaning o'z maqsadida:
«o'quvchi amaliyotni birinchi uch topshiriq bilan tanib oladi» degan xavf QO'SHNI darslar
haqida; 1-dars bilan 31-dars orasida o'ttiz hafta bor va tanish hissi yo'q.

- **Ha desangiz:** 31-40 yig'iladi va 41-55 uchun ham joy qoladi. Bu skeletdagi tartiblar
  aynan shu qoida bilan topilgan, va ularda eng yaqin takror **15 dars** narida
  (32-dars 17-dars bilan bir uchtalikdan boshlanadi). Ya'ni deraza 12 bo'lsa ham,
  amalda 15 ga chiqdi.
- **Yo'q desangiz:** ikkinchi yo'l — 1-pozitsiyaga `E TypeValue` ni ham qo'shish
  (uning boshqaruvi bitta maydon, tushuntirishni `MarkAll` dan ko'ra kam talab qiladi).
  U 36 o'rinni 48 ga chiqaradi, bo'sh o'rin 21 ta bo'ladi. Lekin bu YECHIM EMAS,
  KECHIKTIRISH: 41-55 da o'sha devor yana keladi.
- **Uchinchi yo'l — qoidani butunlay olib tashlash** taklif qilinmaydi: o'shanda
  qo'shni ikki dars bir xil boshlanishi mumkin bo'lib qoladi, va aynan shu 18-darsda
  bir marta ushlangan edi.

### 0a.2. GEOMETRIYA CHIZMASIZ QOLADI — `fig.jsx` GA `poly` KERAK

37-40 darslar to'rtburchaklar haqida. `fig.jsx` esa bugun to'rt narsani chizadi:
giperbola, to'g'ri chiziq, nuqtalar va son o'qi. **To'rtburchak chizadigan hech narsa
yo'q**, ya'ni «qaysi figura parallelogramm», «qaysi kesma balandlik», «qaysi uchtasining
yuzi teng» degan savollar SO'Z bilan qoladi.

`DINAMIKA_VA_ILLUSTRATSIYA.md` bo'yicha bu mazmunni yashirish: parallelogrammning
balandligi — CHIZMADAGI perpendikulyar kesma, uni «asosga perpendikulyar, qarama-qarshi
tomongacha bo'lgan kesma» degan gap bilan almashtirish ta'rifni yodlatadi, ko'rsatmaydi.
З83 (yon tomonni balandlik deb olish) aynan chizmada tug'iladi va aynan chizmada o'ladi.

Dars qatlamida `geofigure.jsx` bor, lekin u BOSILADIGAN asbob: `LangProvider` ni talab
qiladi, holat saqlaydi, kadri boshqa o'lchamda. Amaliyotda chizma karta ichida turadi va
hech narsa qilmaydi — u YOZUVNING bo'lagi. Bu `fig.jsx` ning o'zi nega alohida
yaratilganidagi sabab.

**Taklif:** `fig.jsx` ga QO'SHIMCHA (additiv) `poly` turi kiritilsin:

```
{ fig: 'poly', pts: [[x,y], …], names: ['A','B','C','D'],
  ticks: [{ e: 0, n: 1 }, …],   // tomondagi tenglik shtrixi
  arrows: [{ e: 1, n: 1 }, …],  // parallellik strelkasi
  right: [0, 3],                 // to'g'ri burchak kvadratchasi
  segs: [{ from: 1, to: [45, 90], dash: true }] }   // balandlik, diagonal
```

Mavjud hech bir spec o'zgarmaydi, ya'ni 7-30 darslarning chizmalari tegilmaydi — `spans`
qanday qo'shilgan bo'lsa, shunday.

- **Ha desangiz:** oltita topshiriqda chizma turadi (§2 jadvali).
- **Yo'q desangiz:** o'sha oltitasi chizmasiz yig'iladi, har biriga MATNLI zaxira
  varianti shu hujjatda yozilgan. Lekin 40-darsning 01 va 10-topshirig'i o'shanda
  ta'rifni tekshiradi, tushunishni emas — buni ochiq aytaman.

### 0a.3. HA/YO'Q JAVOBLARI — TO'RT KOMBINATSIYA (METODIST TOPSHIRIG'I)

Metodist 2026-08-25 da aytdi: ha/yo'q savollarining javoblari faqat «Ha, Yo'q»
ketma-ketligida bo'lmasin. **O'lchov uni tasdiqlaydi:** 21-28 darslarning HAMMASIDA
`TrueFalse` ning javobi «Ha, Yo'q» bo'lgan (sakkiztadan sakkiztasi). Ya'ni o'quvchi
mexanikani mazmunsiz yenga oladi: birinchisiga «Ha», ikkinchisiga «Yo'q».

Bu o'ntalikda to'rt kombinatsiya aylanadi:

| Dars | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| javob | Ha·Ha | Yo'q·Ha | Yo'q·Yo'q | Ha·Yo'q | Ha·Ha | Yo'q·Yo'q | Yo'q·Ha | Ha·Ha | Yo'q·Yo'q | Ha·Yo'q |

Uchtadan «Ha·Ha», uchtadan «Yo'q·Yo'q», ikkitadan «Yo'q·Ha» va «Ha·Yo'q»; yonma-yon
ikki dars bir xil kombinatsiyada emas.

**Ikkala da'vo bir xil javobli bo'lgan darslarda yuk razborga o'tadi.** «Ikkalasi ham
rost» degan topshiriq oson emas, aksincha: o'quvchi «bittasi yolg'on bo'lishi kerak»
degan kutish bilan keladi va rost da'voni ataylab rad etadi. Shuning uchun bunday
darslarda ikki da'vo bir-biriga YAQIN turadi va razbor har birini alohida SON bilan
tekshiradi (З16). 33, 36 va 39-darsda esa ikkala da'vo ham yolg'on, va ular bitta
adashishning ikki tomonini ko'rsatadi.

Tasdiqlansa, bu qoida `TIPLAR_AMALIYOT_8SINF.md` §7 ga sakkizinchi band bo'lib
yoziladi — u 41-55 uchun ham kerak bo'ladi.

### 0a.4. GURUHLAR: UCH UCHLIK VA BITTA YOLG'IZ, YANA

O'nta dars uchtaga bo'linmaydi, guruh esa uchtadan katta bo'lolmaydi (1-pozitsiyaga
faqat uch tip qo'yiladi). Shuning uchun 21-30 dagi tuzilma takrorlanadi, lekin
chegaralar MAVZU bo'yicha qo'yildi:

- **31-33** — daraja va yozuv (butun ko'rsatkich, xossalar, standart ko'rinish);
- **34-36** — ma'lumot va sanoq (statistika, o'rtachalar, kombinatorika);
- **37-39** — to'rtburchaklarning TURLARI (parallelogramm, romb va kvadrat, trapetsiya);
- **40** — yolg'iz: u yuza bloki ochiladigan birinchi dars (mavzu ta'rifdan O'LCHOVGA
  o'tadi, rejadagi «pribor 5» ham shu yerdan boshlanadi).

40-darsning tartibi qolgan hammasidan kamida **sakkiz pozitsiyada** farq qiladi — 30-dars
uchun qabul qilingan kuchaytirilgan shart saqlandi. Bu bepul chiqmadi: 40-qator AVVAL
tanlandi, 31-39 esa undan sakkiz pozitsiya uzoqda bo'lish sharti bilan izlandi. Teskari
tartibda (avval 31-39, keyin 40) sakkiz umuman topilmaydi — to'liq sanab chiqildi,
qolgan eng yaxshi masofa yettita bo'lardi.

### 0a.5. KARTA MATNI TARJIMA QILINMAYDI — STATISTIKA VA GEOMETRIYADA BU QIMMAT

`PairSlots`, `Zones`, `MarkAll`, `MatchPairs`, `CodeLock` ning kartalari `L()` ni qabul
qilmaydi: ular MATEMATIKA, tarjima emas (`kit.jsx` ning boshidagi qoida). 27-darsda bu
bir marta og'riq bergan edi (`DARS21_30_AMALIYOT_SKELET.md` §9, 04-topshiriq).

Б5 va Б6 da bu masala kattaroq, chunki mazmunning yarmi SO'ZDA: «chastota», «moda»,
«romb», «takrorlanish bilan». Shuning uchun bu o'ntalikda qoida qat'iy:

- kartada faqat **belgi** turadi: `2 → 4`, `0,25`, `∠A = 90°`, `AC ⊥ BD`, `BC ∥ AD`,
  `3,6·10⁴`, `a = 6`;
- so'z kerak bo'lgan joyda mexanika **`ClozeBank`** ga beriladi (uning kartalari `L()`
  oladi) — shuning uchun har darsning qoida-topshirig'i aynan shu tipda;
- kartada bo'shliq iqtisod qilinadi (telefonda karta 54px): `∠A=60°`, `a=8,h=3`.

`∥`, `∦`, `⊥`, `∠`, `→` belgilari uch tilda ham bir xil o'qiladi. `°` va `²` ham.

### 0a.6. ATAMALAR — DARSDAN OLINADI, YANGISI O'YLAB TOPILMAYDI

`variatsion qator`, `chastota`, `nisbiy chastota`, `moda`, `mediana`, `tanlanma hajmi`,
`perebor`, `romb`, `trapetsiya`, `asos`, `yon tomon`, `balandlik` — hammasi
`Dars34.jsx` … `Dars40.jsx` ning matnidan aynan ko'chiriladi. Amaliyot atama kiritmaydi.

Nazariy darslarning o'zida `perebor` ruscha shaklda qolgan («tanlash (perebor) usuli»),
`moda` va `mediana` esa xalqaro shaklda. **Bu skelet ularni o'zgartirmaydi** va o'z
varianti bilan almashtirmaydi: amaliyot darsning tilida gapirishi kerak, aks holda
o'quvchi ikki xil nom ko'radi. Agar atamalar qayta ko'rib chiqilsa, u NAZARIY darsda
qilinadi va amaliyot ergashadi. Har qanday holda bu — **draft, o'zbek metodisti
tomonidan validatsiya talab qiladi**.

---

## 1. KETMA-KETLIKLAR — O'N DARS

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **31** | A | B | C | J | I | F | D | E | G | H |
| **32** | F | A | E | I | D | J | C | H | B | G |
| **33** | C | E | B | F | G | I | H | A | J | D |
| **34** | A | F | C | D | J | G | H | E | I | B |
| **35** | C | E | A | F | D | H | I | B | G | J |
| **36** | F | C | E | G | H | J | D | A | B | I |
| **37** | C | F | B | J | H | E | G | A | I | D |
| **38** | F | B | E | H | D | G | I | C | A | J |
| **39** | A | E | C | F | I | B | H | D | J | G |
| **40** | A | C | E | B | I | D | J | G | H | F |

Kodlar: A `Choice`, B `Zones`, C `TrueFalse`, D `PairSlots`, E `TypeValue`, F `MarkAll`,
G `CodeLock`, H `ClozeBank`, I `SwapOrder`, J `MatchPairs`. Qiyinlik o'qi hamma darsda
o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴 — qiyinlikni **misol** beradi, mexanika emas.

Tekshirilgan holat: guruhlar (31-33, 34-36, 37-39) toza — har mexanika guruh ichida har
xil pozitsiyada; hech bir tartib boshqasi bilan ustma-ust tushmaydi; 31-39 har biri
qolgan hammasidan kamida olti pozitsiyada, 40 esa kamida sakkiz pozitsiyada farq qiladi;
birinchi uchtalikning eng yaqin takrori 15 dars narida (§0a.1).

`SEQ` jadvali skelet tasdiqlangandan keyin yangilanadi — jadval haqiqat manbai, amaliyot
fayllari unga qarab yig'iladi.

---

## 2. CHIZMA: OLTI JOYDA, HAMMASI GEOMETRIYADA

| Dars | Topshiriq | Chizma nima qiladi | Chizmasiz zaxira |
|---:|---|---|---|
| 37 | 02 | olti to'rtburchak, uchtasi parallelogramm: ta'rif KO'Z bilan tekshiriladi (З75) | olti shart yozuvi `∥` va `∦` bilan |
| 38 | 01 | olti to'rtburchak, uchtasi romb: kvadrat ham romb ekani chizmada ko'rinadi (T3) | olti shart yozuvi |
| 38 | 10 | to'rt chizma ↔ to'rt diagonal sharti: `AC=BD`, `AC⊥BD`, ikkalasi, hech biri | o'ng ustunda chizma o'rniga xossa yozuvlari |
| 39 | 04 | olti to'rtburchak, uchtasi trapetsiya: parallelogramm rad etiladi (З81) | olti shart yozuvi |
| 40 | 01 | parallelogramm va to'rt kesma: `AD` asos bo'lsa, balandlik qaysi biri (З83) | to'rt ta'rif matni |
| 40 | 10 | olti parallelogramm, uchtasining yuzi teng: bir xil asos va balandlik, boshqa qiyalik (T3, З84) | olti yozuv `a` va `h` bilan |

Б5 (31-36) da chizma YO'Q, va bu ataylab: daraja, standart yozuv va chastota — YOZUV va
SANOQ haqida, ularni chizish bezak bo'lardi. Diagramma turi (poligon, ustunli diagramma)
ham taklif qilinmaydi: bitta o'ntalikda umumiy qatlamga ikki yangi chizma turini qo'shish
kerak emas, va 34-35 ning mazmuni jadval va sanoq bilan to'liq ochiladi.

---

## 3. DARS 31 — BUTUN KO'RSATKICHLI DARAJA

Tasdiqlar `Dars31.jsx` dan: T1 — `a ≠ 0` bo'lsa `a⁰ = 1`; T2 — `a ≠ 0` va n natural bo'lsa
`a⁻ⁿ = 1/aⁿ`; T3 — `a = 0` uchun nolinchi va manfiy daraja aniqlanmagan.
Adashishlar: З16, З62 (`a⁰` nolga teng deb olindi), З63 (`a⁻ⁿ` minus `aⁿ` deb olindi —
teskari son o'rniga ishora almashtirildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `zero_power_value` | `7⁰` ning qiymati: **`1`** | `0` (З62), `7` (ko'rsatkich e'tiborsiz), «aniqlanmagan» (T3 ni nolmas asosga qo'llash). Razbor `7³ : 7³` ni ikki xil hisoblab ko'rsatadi |
| 02 | B `Zones` | 🟢 | `defined_or_not` | 8 karta ikki zonaga: MA'NOGA EGA / ANIQLANMAGAN. Ega: `5⁰`, `2⁻³`, `(−3)⁻¹`, `(0,5)⁰`; aniqlanmagan: `0⁰`, `0⁻³`, `0⁻¹`, `0⁻²` | T3. Kartalar juft-juft: faqat ASOS farq qiladi, ko'rsatkich o'sha. To'rtta nol ataylab — taqiqni ko'rsatkich emas, asos beradi |
| 03 | C `TrueFalse` | 🟢 | `power_claims` | `(−4)⁰ = 1` → **Ha**; `3⁻² = 1/9` → **Ha** | ikkala da'vo ham ROST (§0a.3). Kutish «bittasi yolg'on», va aynan shu yerda manfiy asos yoki manfiy ko'rsatkich ko'rgan o'quvchi rost da'voni rad etadi. Razbor har birini son bilan tekshiradi |
| 04 | J `MatchPairs` | 🟡 | `power_to_value` | To'rt juft: `2⁻¹ ↔ 1/2`; `2⁻² ↔ 1/4`; `2⁰ ↔ 1`; `(−2)⁻¹ ↔ −1/2` | З63. To'rt yozuvda o'sha ikkilik turadi: minus QAVS ICHIDA bo'lsa javob manfiy, ko'rsatkichda bo'lsa musbat kasr |
| 05 | I `SwapOrder` | 🟡 | `neg_power_steps` | `5⁻²` ni hisoblash: manfiy ko'rsatkichni ko'ramiz → teskari songa o'tamiz (`1/5²`) → darajani hisoblaymiz (`1/25`) → o'nli kasr bilan yozamiz (`0,04`) | З63: «ishorani almashtiramiz» degan qadam ro'yxatda YO'Q, va uni izlash xatoning o'zi. Teskari songa o'tishni darajani hisoblashdan keyin qo'yish ham xato |
| 06 | F `MarkAll` | 🟡 | `equal_one_marked` | 6 yozuvdan 3 tasi BIRGA teng: `9⁰`, `(−7)⁰`, `(2/3)⁰` | `0⁰` (aniqlanmagan — T3), `9⁻¹` (= 1/9), `(−7)⁻¹` (= −1/7). Har juftlik faqat KO'RSATKICHDA farq qiladi: nol va minus bir |
| 07 | D `PairSlots` | 🟡 | `base_to_value` | Uch juft: `4⁻¹ ↔ 1/4`; `(1/4)⁻¹ ↔ 4`; `(−4)⁻¹ ↔ −1/4` | ikkinchisi teskari sonning teskarisi: manfiy ko'rsatkich kasrni AG'DARADI. З63 uchinchi juftlikda |
| 08 | E `TypeValue` | 🔴 | `denominator_of_power` | `3⁻⁴` ni `1/n` shaklida yozdik. `n` = **81** | `12` (`3·4` — ko'rsatkich ko'paytuvchi deb olindi), `−81` (ishora kasrga o'tkazildi — З63), `64` (asos va ko'rsatkich almashdi). Javob butun son, chunki `TypeValue` faqat butun sonni qabul qiladi |
| 09 | G `CodeLock` | 🔴 | `code_exponents` | Uch tenglikning ko'rsatkichi, o'sish tartibida: `1/8 = 2ⁿ` (−3), `1/49 = 7ⁿ` (−2), `1 = 5ⁿ` (0) → kod **−3, −2, 0** | bankda `3`, `2`, `8`: birinchi ikkitasi ishorasi tushib qolgan ko'rsatkich (З63), `8` esa ko'rsatkich o'rniga QIYMAT. Uchinchi tenglik T1 ni teskari tomondan so'raydi |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: `a` nolga teng bo'lmasa `a⁰` **birga** teng, `a⁻ⁿ` esa `aⁿ` ning **teskari soni**; `a` nolga teng bo'lsa bu darajalar **aniqlanmagan** | bankda tuzoq: «nolga» (З62), «qarama-qarshi soni» (З63 ning so'z bilan aytilgani), «birga teng» (T3 ning o'rniga) |

**Qoplov.** T1 — 01, 03, 06, 09, 10. T2 — 02, 04, 05, 07, 08, 09, 10. T3 — 02, 06, 10.
З62 — 01, 06, 10. З63 — 04, 05, 07, 08, 09, 10. З16 — razborlar darajani ko'paytma bilan
qayta hisoblaydi.
**Oldingi blokdan** — 08 va 09 da manfiy sonlarni tartiblash (23-dars).

**Harf.** 01-09 da harf yo'q, sonlar; 10 da `a` va `n` (darslikning yozuvi).
Takrorlanmaydigan narsa — ASOSLAR: bitta asos ikki topshiriqda bir xil ko'rsatkich bilan
uchramaydi.

---

## 4. DARS 32 — BUTUN KO'RSATKICHLI DARAJANING XOSSALARI

Tasdiqlar `Dars32.jsx` dan: T1 — `aᵖ · aᵠ = aᵖ⁺ᵠ`; T2 — `aᵖ : aᵠ = aᵖ⁻ᵠ`; T3 —
`(aᵖ)ᵠ = aᵖᵠ`, va bu xossalar `p`, `q` istalgan butun son bo'lganda ham to'g'ri.
Adashishlar: З16, З64 (ko'paytirishda ko'rsatkichlar ayirildi yoki bo'lishda qo'shildi),
З65 (daraja darajaga ko'tarilganda ko'rsatkichlar ko'paytirish o'rniga qo'shildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `equal_a5_marked` | 6 yozuvdan 3 tasi `a⁵` ga teng: `a²·a³`, `a⁸:a³`, `a⁷·a⁻²` | `a² + a³` (qo'shish daraja bermaydi), `(a²)³` (= `a⁶`), `a⁸:a⁻³` (= `a¹¹`). Oxirgisi З64 ning manfiy ko'rsatkichli shakli |
| 02 | A `Choice` | 🟢 | `product_exponent` | `a³ · a⁻⁵` = **`a⁻²`** | `a⁸` (ayirildi — З64), `a⁻¹⁵` (ko'paytirildi — З65), `a²` (ishora tushib qoldi). Razbor `a = 2` da sonda tekshiradi |
| 03 | E `TypeValue` | 🟢 | `quotient_exponent` | `a⁷ : a⁴ = aⁿ`, `n` = **3** | `11` (qo'shildi — З64), `28` (ko'paytirildi — З65), `−3` (ayirma teskari olindi) |
| 04 | I `SwapOrder` | 🟡 | `simplify_steps` | `(a²)³ · a⁻⁴`: qavsni ochamiz, ko'rsatkichlarni KO'PAYTIRAMIZ (`a⁶`) → bir xil asosli ko'paytma, ko'rsatkichlarni QO'SHAMIZ (`6 + (−4)`) → natijani yozamiz (`a²`) → `a = 2` da tekshiramiz (`64 : 16 = 4`) | ikki xossa ketma-ket, va ular bir-biriga o'xshamaydi: birinchisi ko'paytiradi, ikkinchisi qo'shadi (З65 va З64 yonma-yon). Tekshiruv qadamini birinchi qo'yish — tekshiradigan narsa hali yo'q |
| 05 | D `PairSlots` | 🟡 | `op_to_result` | Uch juft: `a⁴·a³ ↔ a⁷`; `a⁴:a³ ↔ a`; `(a⁴)³ ↔ a¹²` | uch yozuvda o'sha ikki son (4 va 3), farq faqat AMALDA. `a¹` ni `a` deb yozish razborda alohida eslatiladi |
| 06 | J `MatchPairs` | 🟡 | `expr_to_power` | To'rt juft: `a⁵·a⁻² ↔ a³`; `a⁵:a⁻² ↔ a⁷`; `(a⁵)⁻² ↔ a⁻¹⁰`; `a⁻⁵·a⁻² ↔ a⁻⁷` | to'rt yozuvda o'sha 5 va 2, natijalar butunlay boshqa. Ikkinchisi eng qimmat: manfiy ko'rsatkichni AYIRISH uni qo'shishga aylantiradi |
| 07 | C `TrueFalse` | 🟡 | `property_claims` | `a³ · a⁴ = a¹²` → **Yo'q**; `(a³)⁴ = a¹²` → **Ha** | З64 va З65 bitta juftlikda. Ikki yozuvda o'sha uch belgi (3, 4, 12), farq faqat qavsda. Razbor `a = 2` da ikkalasini ham sonda tekshiradi |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: bir xil asosli darajalar ko'paytirilganda ko'rsatkichlar **qo'shiladi**, bo'linganda **ayiriladi**, daraja darajaga ko'tarilganda **ko'paytiriladi** | bankda tuzoq: uch amalning almashib ketishi (З64, З65), «bo'linadi» va «o'zgarmaydi» |
| 09 | B `Zones` | 🔴 | `equals_a6_or_not` | 8 karta ikki zonaga: `a⁶` GA TENG / TENG EMAS. Teng: `a²·a⁴`, `a⁸:a²`, `(a³)²`, `a⁸·a⁻²`; emas: `a²·a³`, `a⁸:a⁻²`, `(a³)³`, `a⁸·a²` | har juftlik bitta belgida farq qiladi: ishora, amal yoki ko'rsatkich. `a⁸:a⁻²` = `a¹⁰` — З64 ning eng sezilmas shakli |
| 10 | G `CodeLock` | 🔴 | `code_exponents` | Uch ifodaning ko'rsatkichi, o'sish tartibida: `(a⁻²)³` (−6), `a⁵:a⁷` (−2), `a⁴·a⁻¹` (3) → kod **−6, −2, 3** | bankda `6`, `2`, `−3`: uchalasi ham ishorasi buzilgan natija. Manfiy ko'rsatkichli hisobda ishora aynan shu yerda yo'qoladi |

**Qoplov.** T1 — 01, 02, 04, 05, 06, 08, 09, 10. T2 — 01, 03, 05, 06, 08, 09, 10.
T3 — 01, 04, 05, 06, 07, 08, 09, 10. З64 — 01, 02, 03, 07, 08, 09, 10.
З65 — 02, 03, 04, 07, 08, 09, 10. З16 — razborlar `a = 2` qo'yib tekshiradi.
**Oldingi blokdan** — hamma joyda manfiy ko'rsatkich (31-dars): xossalar butun
ko'rsatkichga kengaytirilgani T3 ning ikkinchi yarmi.

**Harf.** Hamma joyda `a` (darslikning yozuvi), 03 va 08 da `n`, `p`, `q`.
Takrorlanmaydigan narsa — KO'RSATKICH JUFTLIKLARI.

---

## 5. DARS 33 — SONNING STANDART KO'RINISHI

Tasdiqlar `Dars33.jsx` dan: T1 — har qanday son `a · 10ⁿ` ko'rinishida yoziladi, bunda `a`
bir bilan o'n orasida; T2 — katta son uchun `n` musbat, kichik son uchun `n` manfiy;
T3 — nolni standart shaklda yozib bo'lmaydi.
Adashishlar: З16, З66 (mantissa o'ndan katta yoki teng qoldirildi), З67 (kichik son uchun
ko'rsatkich ishorasi unutildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `standard_claims` | `36 · 10³` standart ko'rinishmi → **Yo'q**; `0,4 · 10⁵` standart ko'rinishmi → **Yo'q** | ikkala da'vo ham YOLG'ON (§0a.3), va ular chegaraning ikki tomonini ko'rsatadi: birinchisida mantissa o'ndan katta (З66), ikkinchisida birdan kichik. Ikki xato bir xil emas, lekin bitta shartni buzadi |
| 02 | E `TypeValue` | 🟢 | `exponent_big` | `4 300 000` = `4,3 · 10ⁿ`, `n` = **6** | `7` (raqamlar soni sanaldi), `5` (vergul bir kam surildi), `−6` (ishora teskari — З67). Razbor vergulni sanab ko'rsatadi |
| 03 | B `Zones` | 🟢 | `standard_or_not` | 8 karta ikki zonaga: STANDART / STANDART EMAS. Standart: `3,6·10⁴`, `1·10⁻³`, `9,99·10²`, `5·10⁰`; emas: `36·10³`, `0,36·10⁵`, `10·10²`, `0` | З66 uch xil shaklda: o'ndan katta, birdan kichik va aynan o'nga teng mantissa. `0` — T3: nolni standart shaklda umuman yozib bo'lmaydi, chunki `a` nol bo'lolmaydi |
| 04 | F `MarkAll` | 🟡 | `negative_exponent_marked` | 6 sondan 3 tasining standart yozuvida ko'rsatkich MANFIY: `0,004`, `0,00071`, `0,09` | `4000`, `71`, `9,2`. Har juftlik o'sha raqamlardan tuzilgan, farq faqat vergulning o'rnida (T2, З67). `9,2` chegara holati: ko'rsatkich nol, ya'ni na musbat, na manfiy |
| 05 | G `CodeLock` | 🟡 | `code_exponents` | Uch sonning standart yozuvidagi ko'rsatkichi, o'sish tartibida: `0,0025` (−3), `0,52` (−1), `520` (2) → kod **−3, −1, 2** | bankda `3`, `1`, `−2`: uchalasi ham ishorasi almashgan (З67). Uch son bir xil raqamlardan tuzilgan |
| 06 | I `SwapOrder` | 🟡 | `to_standard_steps` | `0,00062` ni standart ko'rinishga keltirish: birinchi nolmas raqamni topamiz (`6`) → vergulni undan keyin qo'yamiz (`6,2`) → vergul necha xona surilganini sanaymiz (`4 xona o'ngga`) → ko'rsatkichni yozamiz (`6,2·10⁻⁴`) | ko'rsatkichni SANASHDAN oldin yozish — o'shanda ishora taxmin bo'ladi (З67). Vergulni ko'chirmasdan xona sanash ham xato: sanaladigan narsa hali yo'q |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: standart ko'rinishda birinchi ko'paytuvchi **birdan o'ngacha** bo'ladi, katta son uchun ko'rsatkich **musbat**, kichik son uchun **manfiy** | bankda tuzoq: «noldan birgacha» (З66 ning teskarisi), «musbat» ikkinchi bo'shliqqa ham (З67), «nol» |
| 08 | A `Choice` | 🔴 | `which_standard` | `0,00000045` ning standart ko'rinishi: **`4,5·10⁻⁷`** | `4,5·10⁷` (ishora — З67), `45·10⁻⁸` (mantissa o'ndan katta — З66), `0,45·10⁻⁶` (mantissa birdan kichik). Uch xato uch xil, lekin hammasi bitta yozuvdan chiqadi |
| 09 | J `MatchPairs` | 🔴 | `number_to_standard` | To'rt juft: `0,00072 ↔ 7,2·10⁻⁴`; `0,0072 ↔ 7,2·10⁻³`; `72000 ↔ 7,2·10⁴`; `720 ↔ 7,2·10²` | mantissa TO'RT JOYDA HAM bir xil — `7,2`. Ya'ni javobni raqamlarga qarab tanlab bo'lmaydi, faqat vergulni sanash hal qiladi (T2) |
| 10 | D `PairSlots` | 🔴 | `standard_to_number` | Uch juft: `2,5·10³ ↔ 2500`; `2,5·10⁻³ ↔ 0,0025`; `2,5·10⁰ ↔ 2,5` | teskari yo'nalish: yozuvdan songa. Uchinchisi — nolinchi daraja (31-dars): ko'paytuvchi bir, ya'ni son o'zgarmaydi |

**Qoplov.** T1 — 01, 03, 07, 08. T2 — 02, 04, 05, 06, 07, 09, 10. T3 — 03.
З66 — 01, 03, 07, 08. З67 — 02, 04, 05, 06, 07, 08. З16 — razborlar standart yozuvni
qayta ochib, asl songa qaytaradi.
**Oldingi blokdan** — 10 dagi `10⁰` va 05, 08 dagi manfiy ko'rsatkich (31-dars).

**Harf.** 02, 07 da `a` va `n`, qolganlarida harf yo'q — sonlar.
Takrorlanmaydigan narsa — SONLAR: bitta son ikki topshiriqda uchramaydi.

---

## 6. DARS 34 — MA'LUMOTLARNI YIG'ISH VA IFODALASH

Tasdiqlar `Dars34.jsx` dan: T1 — natijalar o'sish tartibida yozilgan qator variatsion
qator; T2 — variant necha marta takrorlangani chastota, uning tanlanma hajmiga nisbati
nisbiy chastota; T3 — chastotalar yig'indisi doim tanlanma hajmiga teng.
Adashishlar: З16, З69 (chastota va nisbiy chastota chalkashtirilgan), З70 (chastotalar
yig'indisi hajmga tengligi tekshirilmadi).

Darsning tanlanmasi amaliyotda TAKRORLANMAYDI. Bu yerda o'z sahnasi: o'quvchilar bir
haftada nechta kitob o'qigani — `2, 3, 2, 4, 2, 3, 5, 3, 2, 4` (hajm 10).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `which_variation_row` | Tanlanmaning variatsion qatori: **`2, 2, 2, 2, 3, 3, 3, 4, 4, 5`** | `2, 3, 4, 5` (takrorlar tashlandi — variatsion qator VARIANTLAR ro'yxati emas), kamayish tartibi, asl tartibning o'zi. T1 |
| 02 | F `MarkAll` | 🟢 | `frequency_marked` | 6 kartadan 3 tasi TO'G'RI chastota yozuvi (`variant → chastota`): `2 → 4`, `3 → 3`, `5 → 1` | `4 → 3` (aslida 2), `2 → 2`, `3 → 4`. Uch xatoning hammasi QO'SHNI variantning chastotasi: sanoqda qator surilib ketadi |
| 03 | C `TrueFalse` | 🟢 | `data_claims` | `2` ning chastotasi 4 → **Ha**; `2` ning nisbiy chastotasi 4 → **Yo'q** | З69 eng qisqa shaklda: bir xil son, ikki xil nom. Nisbiy chastota `4 : 10 = 0,4`, va u birdan katta bo'lolmaydi |
| 04 | D `PairSlots` | 🟡 | `variant_to_relative` | Uch juft: `2 ↔ 0,4`; `3 ↔ 0,3`; `4 ↔ 0,2` | З69: chapda variant, o'ngda ULUSH. Chastotalar 4, 3, 2 kartada umuman yo'q — juftlash faqat nisbiy chastota bilan bo'ladi, va razbor har bir ulushni bo'lish bilan ko'rsatadi |
| 05 | J `MatchPairs` | 🟡 | `frequency_to_relative` | Tanlanma hajmi 20. To'rt juft: `5 ↔ 0,25`; `4 ↔ 0,2`; `10 ↔ 0,5`; `1 ↔ 0,05` | `4 ↔ 0,2` va `5 ↔ 0,25` yonma-yon: chastota bir birlikka o'zgarsa, ulush 0,05 ga o'zgaradi. Hajm har juftlikda BIR XIL, ya'ni bo'linadigan son o'zgarmaydi (T2) |
| 06 | G `CodeLock` | 🟡 | `code_frequencies` | Qator `7, 5, 7, 9, 5, 7, 9, 7, 9`. Uch variantning chastotasi o'sish tartibida → kod **2, 3, 4** | bankda `5`, `7`, `9` — VARIANTLARNING o'zi (З69 ning boshqa yuzi: nima sanalyapti — qiymatmi yoki necha martami). Yig'indi 9 ga teng, ya'ni javob T3 bilan tekshiriladi |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: natijalar o'sish tartibida yozilsa **variatsion qator** hosil bo'ladi; variant necha marta uchragani **chastota**, uning tanlanma hajmiga nisbati **nisbiy chastota** | bankda tuzoq: «o'rtacha qiymat» va «moda» (35-darsning ishi, bu yerda yolg'on), «tanlanma hajmi» |
| 08 | E `TypeValue` | 🔴 | `missing_frequency` | Jadvalda to'rt variant, chastotalari `6`, `4`, `3` va noma'lum. Tanlanma hajmi 20. To'rtinchi chastota = **7** | `13` (uchtasining yig'indisi), `20` (hajmning o'zi), `5`. З70 aynan shu: chastotalar yig'indisi hajmga TENG, va bu tenglik yo'qolgan sonni topadi |
| 09 | I `SwapOrder` | 🔴 | `table_steps` | Chastota jadvalini tuzish tartibi: natijalarni o'sish tartibida yozamiz → har xil variantlarni ajratamiz → har variantning chastotasini sanaymiz → yig'indini tanlanma hajmi bilan solishtiramiz | tekshiruvni oldinga qo'yish — tekshiradigan narsa hali yo'q (З70 shu yerda tug'iladi). Sanashni variantlarni ajratishdan oldin qo'yish ham xato: nimani sanash hali aniq emas |
| 10 | B `Zones` | 🔴 | `frequency_or_relative` | 8 karta ikki zonaga: CHASTOTA BO'LA OLADI / NISBIY CHASTOTA BO'LA OLADI. Chastota: `3`, `12`, `25`, `7`; nisbiy: `0,3`, `0,05`, `0,5`, `0,84` | З69 ning eng sof shakli: chastota — SANOQ, ya'ni butun son; nisbiy chastota — ULUSH, ya'ni noldan birgacha. Razbor `0,3` ni «uch marta» deb o'qish nega mumkin emasligini aytadi |

**Qoplov.** T1 — 01, 07, 09. T2 — 02, 03, 04, 05, 06, 07, 10. T3 — 06, 08, 09.
З69 — 03, 04, 06, 07, 10. З70 — 08, 09. З16 — razborlar chastotalarni qayta sanaydi va
yig'indini hajm bilan solishtiradi.
**Oldingi blokdan** — 04, 05, 10 da o'nli kasr va ulush (33-darsning yozuv aniqligi).

**Harf.** Hech qayerda harf yo'q — tanlanma, sonlar va jadval; `n` faqat 05 va 08 da,
tanlanma hajmining belgisi sifatida.
Takrorlanmaydigan narsa — TANLANMALAR: har topshiriqda o'z ma'lumoti.

---

## 7. DARS 35 — O'RTACHA QIYMAT, MODA, MEDIANA

Tasdiqlar `Dars35.jsx` dan: T1 — sonlar yig'indisi ularning soniga bo'linsa o'rtacha
qiymat topiladi; T2 — eng ko'p uchraydigan qiymat moda, va moda o'rtacha bilan teng
bo'lmasligi mumkin; T3 — variantalar soni toq bo'lsa mediana o'rtadagi son, juft bo'lsa
o'rtadagi ikki sonning o'rtachasi.
Adashishlar: З16, З71 (moda o'rtacha bilan chalkashtirilgan), З72 (juft qatorda mediana
bitta o'rtadagi son deb olindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `average_claims` | Qator `4, 4, 7`. «Modasi 4» → **Ha**; «o'rtachasi 5» → **Ha** | ikkalasi ham ROST (§0a.3), va aynan shu З71 ni sindiradi: ikki javob ham to'g'ri, lekin ular TENG EMAS. Bitta qatorda moda 4, o'rtacha 5 |
| 02 | E `TypeValue` | 🟢 | `mean_value` | `7, 9, 12, 12` ning o'rtachasi = **10** | `12` (moda aytildi — З71), `40` (yig'indi bo'linmadi), `9` (o'rtadagi son, ya'ni mediana). Uch xato uch xil o'lchov |
| 03 | A `Choice` | 🟢 | `which_mode` | Qator `3, 5, 3, 8, 5, 3` — modasi **`3`** | `5` (ikkinchi darajali takror), `8` (eng katta son), `4,5` (o'rtacha — З71). Moda «eng katta» ham, «o'rtacha» ham emas: u eng KO'P uchraydigani |
| 04 | F `MarkAll` | 🟡 | `median_five_marked` | 6 qatordan 3 tasining medianasi 5: `3, 5, 9`; `2, 4, 6, 8`; `1, 5, 5, 5, 9` | `3, 4, 9` (4), `2, 4, 8, 10` (6), `5, 6, 7` (6). Juft qatorlar ataylab aralashtirilgan: `2, 4, 6, 8` da mediana qatorda YO'Q son (T3, З72) |
| 05 | D `PairSlots` | 🟡 | `row_to_median` | Uch juft: `1,3,5 ↔ 3`; `1,3,5,7 ↔ 4`; `2,2,8 ↔ 2` | ikkinchi qator birinchisidan bitta son bilan farq qiladi, mediana esa qatorda YO'Q songa aylanadi (З72). Uchinchisida mediana takrorlangan son |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: sonlar yig'indisi ularning soniga bo'linsa **o'rtacha qiymat** chiqadi; eng ko'p uchraydigan qiymat **moda**; variantalar soni juft bo'lsa mediana **ikki o'rtadagi sonning o'rtachasi** | bankda tuzoq: «moda» va «o'rtacha qiymat» ni almashtirish (З71), «o'rtadagi son» (З72), «eng katta son» |
| 07 | I `SwapOrder` | 🟡 | `median_steps` | `9, 4, 7, 4, 6, 8` ning medianasi: sonlarni o'sish tartibida yozamiz (`4,4,6,7,8,9`) → nechtaligini sanaymiz (`6 ta, juft`) → o'rtadagi ikki sonni ajratamiz (`6 va 7`) → ularning o'rtachasini olamiz (`6,5`) | tartiblashsiz o'rtadagini olish: asl qatorning o'rtasida `7` va `4` turibdi, ya'ni javob butunlay boshqa chiqadi. Juft-toqni aniqlashni tartiblashdan oldin qo'yish ham qadamni ma'nosiz qiladi |
| 08 | B `Zones` | 🔴 | `mode_or_none` | 8 karta ikki zonaga: MODASI BOR / MODASI YO'Q. Bor: `2,2,5`; `4,7,7,9`; `1,1,1`; `3,6,6,8`; yo'q: `2,5,9`; `4,7,8,9`; `1,2,3`; `3,6,8,9` | har juftlik BITTA raqamda farq qiladi. `1,1,1` chegara holati: hamma son bir xil, ya'ni moda bor va u bitta. T2 |
| 09 | G `CodeLock` | 🔴 | `code_three_measures` | Qator `2, 2, 3, 5, 8`. Modasi, medianasi va o'rtachasi — kodga o'sish tartibida → **2, 3, 4** | bankda `5`, `8`, `6`. Uch o'lchov bitta qatorda uch XIL son beradi (З71 ning to'g'ridan-to'g'ri raddiyasi), va ularni ajratmasdan kodni yig'ib bo'lmaydi |
| 10 | J `MatchPairs` | 🔴 | `row_to_median` | To'rt juft: `1,2,6 ↔ 2`; `1,2,6,8 ↔ 4`; `2,6,6 ↔ 6`; `1,1,6,6 ↔ 3,5` | to'rt qatorda o'sha uch-to'rt son, natijalar boshqa. Oxirgisi juft qator va mediana KASR chiqadi — З72 ning eng aniq joyi |

**Qoplov.** T1 — 01, 02, 06, 09. T2 — 01, 03, 06, 08, 09. T3 — 04, 05, 07, 09, 10.
З71 — 01, 02, 03, 06, 09. З72 — 04, 05, 07, 10. З16 — razborlar yig'indini va sanoqni
qayta hisoblaydi.
**Oldingi blokdan** — 34-darsning variatsion qatori: 04, 07, 10 da mediana faqat
TARTIBLANGAN qatorda topiladi.

**Harf.** Hech qayerda harf yo'q — qatorlar va sonlar.
Takrorlanmaydigan narsa — QATORLAR: bitta sonlar to'plami ikki topshiriqda uchramaydi.

---

## 8. DARS 36 — KOMBINATORIKA: PEREBOR VA ASOSIY QONUN

Tasdiqlar `Dars36.jsx` dan: T1 — barcha holatlarni bittasini ham qoldirmay sanash usuli
tanlash (perebor) usuli; T2 — A dan B ga `m`, B dan C ga `n` usul bo'lsa, A dan C ga
`m · n` usul bor; T3 — bir vaqtda faqat bitta yo'l tanlanadigan holatlar qo'shiladi,
ketma-ket bosqichlar ko'paytiriladi.
Adashishlar: З16, З73 (takrorlanish mumkin va mumkin bo'lmagan holatlar chalkashtirilgan),
З74 (ko'paytirish qoidasi o'rniga qo'shish qoidasi ishlatilgan).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `no_repeat_marked` | `1, 2, 3` raqamlaridan tuzilgan 6 ikki xonali sondan 3 tasining raqamlari TAKRORLANMAYDI: `12`, `23`, `31` | `11`, `22`, `33`. З73 ning ko'zga ko'rinadigan shakli: shart «raqamlar takrorlanmasin» deganda ro'yxat qisqaradi |
| 02 | C `TrueFalse` | 🟢 | `count_claims` | «`1, 2, 3` dan raqamlari takrorlanmaydigan 9 ta ikki xonali son tuziladi» → **Yo'q**; «takrorlanishga ruxsat berilsa 6 ta son tuziladi» → **Yo'q** | ikkala da'vo ham YOLG'ON (§0a.3), chunki javoblar ALMASHTIRILGAN: takrorsiz 6 ta, takrorli 9 ta. З73 aynan shu almashinuv |
| 03 | E `TypeValue` | 🟢 | `product_rule` | 3 ko'ylak va 4 shim. Nechta kiyim juftligi tuziladi → **12** | `7` (qo'shildi — З74), `34` (yonma-yon yozildi), `1`. Razbor jadval bilan sanab ko'rsatadi: har ko'ylakka to'rttadan |
| 04 | G `CodeLock` | 🟡 | `code_three_counts` | Uch savolning javobi o'sish tartibida: ikki tanga tashlanadi (4); 2 shapka va 3 sharf (6); `1, 2, 3, 4` dan takrorsiz ikki xonali son (12) → kod **4, 6, 12** | bankda `5`, `7`, `8` — uchalasi ham qo'shish natijasi (З74): `2+3`, `3+4`, `4+4`. Uch sahna uch xil, qoida bitta |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: A dan B ga `m`, B dan C ga `n` yo'l bo'lsa, A dan C ga **`m · n`** yo'l bor; ketma-ket bosqichlar **ko'paytiriladi**, faqat bittasi tanlanadigan holatlar **qo'shiladi** | bankda tuzoq: «`m + n`» (З74), «qo'shiladi» va «ko'paytiriladi» ni almashtirish (T3), «`m − n`» |
| 06 | J `MatchPairs` | 🟡 | `digits_to_count` | To'rt juft — raqamlar to'plamidan takrorsiz ikki xonali son nechta: `1,2 ↔ 2`; `1,2,3 ↔ 6`; `1,2,3,4 ↔ 12`; `1,2,3,4,5 ↔ 20` | qator `n · (n − 1)`, va u qo'shishga umuman o'xshamaydi. Tuzoq — to'plam hajmini javob deb olish: birinchi juftlikda u ataylab mos tushadi va keyingisida buziladi |
| 07 | D `PairSlots` | 🔴 | `expr_to_value` | Uch juft: `2·3·4 ↔ 24`; `2+3+4 ↔ 9`; `2·3+4 ↔ 10` | З74 sof arifmetikada: o'sha uch son, uch xil bog'lanish, uch xil javob. Uchinchisi aralash hol — ikki bosqich ko'paytiriladi, uchinchi variant esa qo'shiladi (T3) |
| 08 | A `Choice` | 🔴 | `which_count` | Oshxonada 3 xil birinchi taom, 4 xil ikkinchi taom va 2 xil ichimlik. Har biridan bittadan tanlansa, nechta tushlik chiqadi → **24** | `9` (hammasi qo'shildi — З74), `12` (ichimlik unutildi), `14` (`3·4 + 2` — uchinchi bosqich qo'shildi). Uchinchi xato eng qimmat: qoida yarim qo'llanildi |
| 09 | B `Zones` | 🔴 | `equals_12_or_not` | 8 karta ikki zonaga: QIYMATI 12 / QIYMATI 12 EMAS. 12: `3·4`, `2·6`, `2·2·3`, `12·1`; emas: `3+4`, `2+6`, `2·2+3`, `12+1` | har juftlik faqat AMALDA farq qiladi (З74). `12·1` va `12+1` — bir bosqich qo'shilishi natijani qanday buzishini ko'rsatadi |
| 10 | I `SwapOrder` | 🔴 | `count_steps` | `1, 2, 3, 4` dan takrorlanmaydigan uch xonali son nechta: birinchi xonaga nechta raqam qo'yish mumkinligini sanaymiz (`4`) → ikkinchi xonaga qolganini sanaymiz (`3`) → uchinchi xonaga qolganini sanaymiz (`2`) → bosqichlarni ko'paytiramiz (`4·3·2 = 24`) | ko'paytirishni oldinga qo'yish — ko'paytiriladigan sonlar hali yo'q. Har qadamda raqamlar soni KAMAYADI, va bu takrorlanish taqiqidan chiqadi (З73) |

**Qoplov.** T1 — 01, 02, 06, 10. T2 — 03, 04, 05, 06, 08, 09, 10.
T3 — 05, 07, 08, 09, 10. З73 — 01, 02, 06, 10. З74 — 03, 04, 05, 07, 08, 09.
З16 — razborlar kichik holatlarda pereborni to'liq yozib tekshiradi.
**Oldingi blokdan** — 06 va 10 da sanoq natijasi 34-darsning chastotasidek o'qiladi:
nechta holat bor degan savol.

**Harf.** 05 da `m` va `n` (darslikning yozuvi), qolganlarida harf yo'q.
Takrorlanmaydigan narsa — SAHNALAR: bir sahna ikki topshiriqda uchramaydi.

---

## 9. DARS 37 — PARALLELOGRAMM VA UNING XOSSALARI

Tasdiqlar `Dars37.jsx` dan: T1 — qarama-qarshi tomonlari o'zaro parallel bo'lgan
to'rtburchak parallelogramm; T2 — qarama-qarshi tomonlari va qarama-qarshi burchaklari
teng; T3 — diagonallari kesishadi va kesishish nuqtasida teng ikkiga bo'linadi, bir
tomoniga yopishgan burchaklar yig'indisi 180 gradus.
Adashishlar: З16, З75 (ta'rifda parallellik o'rniga tomonlar tengligi olindi), З76
(180 gradus qoidasi qarama-qarshi burchaklarga qo'llanildi), З77 (diagonallar teng deb
hisoblandi), З78 (isbotda noto'g'ri asos tanlandi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `parallelogram_claims` | «Parallelogrammning diagonallari teng» → **Yo'q**; «Diagonallari kesishish nuqtasida teng ikkiga bo'linadi» → **Ha** | З77. Ikki da'vo bir-biridan bir necha so'zda farq qiladi — «teng» va «teng ikkiga bo'linadi», — va ular butunlay boshqa narsa. Razbor cho'zilgan parallelogrammni misol qiladi |
| 02 | F `MarkAll` 🖼 | 🟢 | `parallelogram_marked` | Olti to'rtburchakdan 3 tasi parallelogramm | rad etilganlar: trapetsiya (bir juft parallel), deltoid (ikki juft teng tomon, lekin parallel emas — З75), ixtiyoriy to'rtburchak. Chizmada parallellik STRELKA bilan, tenglik SHTRIX bilan ko'rsatiladi, ya'ni ikki belgi aralashmaydi |
| 03 | B `Zones` | 🟢 | `always_or_not` | 8 karta ikki zonaga: HAR PARALLELOGRAMMDA TO'G'RI / TO'G'RI EMAS. To'g'ri: `AB = CD`, `∠A = ∠C`, `∠A + ∠B = 180°`, `AO = OC`; emas: `AC = BD`, `∠A = ∠B`, `AB = BC`, `AC ⊥ BD` | З75, З76 va З77 bitta jadvalda. Har juftlik yaqin turadi: `∠A = ∠C` (qarama-qarshi, to'g'ri) va `∠A = ∠B` (qo'shni, faqat to'g'ri to'rtburchakda) |
| 04 | J `MatchPairs` | 🟡 | `angle_to_neighbour` | To'rt parallelogramm, har birida `∠A` berilgan, `∠B` topiladi: `50° ↔ 130°`; `60° ↔ 120°`; `90° ↔ 90°`; `110° ↔ 70°` | З76: qo'shni burchaklar 180 gacha to'ldiradi, qarama-qarshilari esa TENG. Uchinchi juftlik chegara holati — to'g'ri burchakda ikki qoida bir xil javob beradi, va aynan shu chalkashlikni yashiradi |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: qarama-qarshi tomonlari **parallel** bo'lgan to'rtburchak parallelogramm deyiladi; uning qarama-qarshi burchaklari **teng**, bir tomoniga yopishgan burchaklari yig'indisi **180°** | bankda tuzoq: «teng» birinchi bo'shliqqa (З75), «180°» ikkinchisiga (З76), «90°» |
| 06 | E `TypeValue` | 🟡 | `neighbour_side` | Parallelogrammning perimetri 36 sm, bir tomoni 8 sm. Qo'shni tomoni = **10** | `28` (`36 − 8`, ya'ni qarama-qarshi tomonlar hisobga olinmadi), `18`, `4`. T2: perimetr ikki qo'shni tomon yig'indisining ikkilangani |
| 07 | G `CodeLock` | 🟡 | `code_angles` | Uch parallelogramm: `∠A = 40°` da `∠B` (140), `∠A = 75°` da `∠C` (75), `∠A = 100°` da `∠B` (80). Kod o'sish tartibida → **75, 80, 140** | bankda `40`, `100`, `105`. Ikkinchi savol qarama-qarshi burchak haqida, qolgan ikkitasi qo'shni haqida — З76 ni ajratish uchun uch savol yonma-yon turadi |
| 08 | A `Choice` | 🔴 | `which_definition` | To'rt shartdan qaysi biri to'rtburchakni parallelogramm qiladi: **«qarama-qarshi tomonlari juft-juft parallel»** | «ikki tomoni teng» (З75), «diagonallari teng» (З77), «bir juft tomoni parallel» (bu trapetsiya, 39-dars). Razbor har bir noto'g'ri shartga MISOL keltiradi, ya'ni rad etish ko'rinadi |
| 09 | I `SwapOrder` | 🔴 | `proof_steps` | «Qarama-qarshi tomonlar teng» isboti: `AC` diagonalini o'tkazamiz → ichki almashinuvchi burchaklar teng (`∠1 = ∠2`, `∠3 = ∠4`) → uchburchaklar teng (tomon va ikki burchak bo'yicha) → mos tomonlar teng: `AB = CD`, `BC = AD` | З78: xulosani uchburchaklar tengligidan OLDIN qo'yish — o'shanda tenglik hech narsadan chiqadi. Diagonalni oxirga qo'yish ham xato: isbot boshlanadigan chiziq shu |
| 10 | D `PairSlots` | 🔴 | `diagonal_to_half` | Uch juft: `AC=12 ↔ AO=6`; `BD=10 ↔ BO=5`; `AO=4 ↔ AC=8` | T3 va З77 birga: har diagonal O'ZI teng ikkiga bo'linadi, lekin ikki diagonal bir-biriga teng emas — `AC = 12` va `BD = 10` bitta figurada tura oladi. Uchinchi juftlik teskari yo'nalishda |

**Qoplov.** T1 — 02, 03, 05, 08. T2 — 03, 04, 05, 06, 09. T3 — 01, 03, 05, 07, 10.
З75 — 02, 03, 05, 08. З76 — 03, 04, 05, 07. З77 — 01, 03, 08, 10. З78 — 09.
З16 — razborlar burchaklar yig'indisini 360 gacha qo'shib tekshiradi.
**Oldingi blokdan** — 06 da perimetr tenglamasi (21-dars usuli: noma'lumni harf bilan).

**Harf.** Hamma joyda `ABCD` va `O` (darslikning belgilashi), burchaklar `∠A` … `∠D`.
Takrorlanmaydigan narsa — BURCHAK QIYMATLARI.

---

## 10. DARS 38 — TO'G'RI TO'RTBURCHAK, ROMB VA KVADRAT

Tasdiqlar `Dars38.jsx` dan: T1 — hamma burchagi to'g'ri bo'lgan parallelogramm to'g'ri
to'rtburchak, uning diagonallari teng; T2 — tomonlari teng bo'lgan parallelogramm romb,
uning diagonallari perpendikulyar va burchaklarni teng ikkiga bo'ladi; T3 — tomonlari
teng bo'lgan to'g'ri to'rtburchak kvadrat, u ikkalasining ham barcha xossalariga ega.
Adashishlar: З16, З79 (diagonallarning teng va perpendikulyar bo'lishi kvadrat uchun
yetarli deb hisoblandi, teng ikkiga bo'linishi unutildi), З80 (to'g'ri to'rtburchak va
romb xossalari aralashtirildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` 🖼 | 🟢 | `rhombus_marked` | Olti to'rtburchakdan 3 tasi romb | rad etilganlar: to'g'ri to'rtburchak (tomonlari teng emas), deltoid (ikki juft teng tomon, lekin parallelogramm emas), ixtiyoriy parallelogramm. Uch rombdan bittasi KVADRAT — u ham romb, va bu T3 ning ko'z bilan ko'riladigan yeri |
| 02 | B `Zones` | 🟢 | `rectangle_or_rhombus` | 8 karta ikki zonaga: FAQAT TO'G'RI TO'RTBURCHAKDA / FAQAT ROMBDA. To'g'ri to'rtburchak: `∠A = 90°`, `AC = BD`, `∠D = 90°`, `∠B = ∠A`; romb: `AB = BC`, `AC ⊥ BD`, `BC = CD`, `∠BAC = ∠CAD` | З80 sof shaklda. «Faqat» so'zi muhim: ikkala figurada ham bajariladigan xossalar (qarama-qarshi tomonlar teng, diagonallar teng ikkiga bo'linadi) kartada YO'Q, chunki ular ajratmaydi |
| 03 | E `TypeValue` | 🟢 | `rhombus_side` | Rombning perimetri 28 sm. Tomoni = **7** | `14` (yarmi), `4`, `28`. T2: rombning TO'RTALA tomoni teng, ya'ni perimetr to'rtga bo'linadi |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: hamma burchagi to'g'ri bo'lgan parallelogramm **to'g'ri to'rtburchak**, tomonlari teng bo'lgan parallelogramm **romb**, va rombning diagonallari o'zaro **perpendikulyar** | bankda tuzoq: «kvadrat» (ikki ta'rifning har biriga ham tushadi, lekin ikkalasi ham emas — З79), «teng» (З80), «trapetsiya» |
| 05 | D `PairSlots` | 🟡 | `rhombus_angles` | Rombda `∠A = 50°`. Uch juft: `∠B ↔ 130°`; `∠BAC ↔ 25°`; `∠AOB ↔ 90°` | T2 ning uch xossasi ketma-ket: qo'shni burchak 180 gacha, diagonal burchakni TENG IKKIGA bo'ladi, diagonallar PERPENDIKULYAR. Ikkinchisi eng ko'p tashlab ketiladi |
| 06 | G `CodeLock` | 🟡 | `code_diagonals` | Uch savol: to'g'ri to'rtburchakda `AC = 10` bo'lsa `BD` (10); rombda `AC = 12` bo'lsa `AO` (6); kvadratda `∠AOB` (90). Kod o'sish tartibida → **6, 10, 90** | bankda `5`, `12`, `45`. `45` — З79 ning izi: diagonal burchakni teng ikkiga bo'ladi (kvadratda 45), lekin savol DIAGONALLAR orasidagi burchak haqida |
| 07 | I `SwapOrder` | 🔴 | `square_proof_steps` | «Diagonallari teng va perpendikulyar to'rtburchak kvadratmi»: diagonallar teng ikkiga bo'linadi, demak PARALLELOGRAMM → diagonallar teng, demak TO'G'RI TO'RTBURCHAK → diagonallar perpendikulyar, demak ROMB → ikkalasi birga, demak KVADRAT | З79 aynan shu yerda: birinchi qadam tashlab ketiladi, va o'shanda «teng va perpendikulyar diagonal» kvadratni bermaydi — bunday to'rtburchak parallelogramm bo'lmasligi mumkin |
| 08 | C `TrueFalse` | 🔴 | `figure_claims` | «Har bir kvadrat — romb» → **Ha**; «Diagonallari o'zaro perpendikulyar bo'lgan parallelogramm — romb» → **Ha** | ikkalasi ham ROST (§0a.3). Birinchisi T3, ikkinchisi T2 ning teskari teoremasi. Kutish «bittasi yolg'on», va odatda ikkinchisi rad etiladi, chunki u qoidani teskari tomondan o'qiydi |
| 09 | A `Choice` | 🔴 | `which_conclusion` | «Parallelogrammning diagonallari teng. Bu qanday figura?» → **to'g'ri to'rtburchak** | `romb` (З80), `kvadrat` (З79 — teng diagonal yetarli emas, perpendikulyarlik ham kerak), `trapetsiya` (parallelogramm emas). Razbor cho'zilgan to'g'ri to'rtburchakni misol qiladi |
| 10 | J `MatchPairs` 🖼 | 🔴 | `condition_to_figure` | To'rt shart ↔ to'rt chizma: `AC = BD` ↔ to'g'ri to'rtburchak; `AC ⊥ BD` ↔ romb; `AC = BD va AC ⊥ BD` ↔ kvadrat; ikkalasi ham yo'q ↔ ixtiyoriy parallelogramm | З79 va З80 birga: to'rt figurada diagonallar CHIZILGAN, ya'ni shart ko'rinib turadi |

**Qoplov.** T1 — 01, 02, 04, 06, 07, 09, 10. T2 — 01, 02, 03, 04, 05, 07, 08, 10.
T3 — 01, 06, 07, 08, 10. З79 — 04, 06, 07, 09, 10. З80 — 02, 04, 09, 10.
З16 — razborlar burchak va tomon qiymatlarini qo'yib tekshiradi.
**Oldingi blokdan** — 05, 06 va 09 da 37-darsning parallelogramm xossalari: har uch
figura ham parallelogramm bo'lib qolaveradi.

**Harf.** Hamma joyda `ABCD` va `O`.
Takrorlanmaydigan narsa — FIGURA VA SON JUFTLIKLARI.

---

## 11. DARS 39 — TRAPETSIYA VA UNING XOSSALARI

Tasdiqlar `Dars39.jsx` dan: T1 — ikkita tomoni parallel (asoslar), qolgan ikki tomoni
parallel bo'lmagan (yon tomonlar) to'rtburchak trapetsiya; T2 — bir burchagi to'g'ri
bo'lsa, o'sha yon tomondagi qo'shni burchak ham to'g'ri; T3 — teng yonli trapetsiyaning
asosidagi burchaklari teng.
Adashishlar: З16, З81 (trapetsiyani aniqlashda faqat bitta shart tekshirildi, ikkinchi
juft tomonning parallel emasligi tekshirilmadi), З82 (to'g'ri burchakli trapetsiyada
faqat bitta burchak to'g'ri deb hisoblandi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `which_definition` | To'rt ta'rifdan qaysi biri trapetsiyaniki: **«bir juft tomoni parallel, ikkinchi juft tomoni parallel emas»** | «bir juft tomoni parallel» (parallelogramm ham bunday — З81), «ikki juft tomoni parallel» (parallelogramm), «yon tomonlari teng» (teng yonli trapetsiyaning belgisi, ta'rif emas). Ta'rif IKKI shartdan iborat, va ikkinchisi doim tashlab ketiladi |
| 02 | E `TypeValue` | 🟢 | `fourth_angle` | Trapetsiyada `∠A = 70°`, `∠B = 110°`, `∠C = 65°`. `∠D` = **115** | `70`, `65` (qarama-qarshi burchak teng deb olindi — bu parallelogrammning xossasi), `105`. To'rtburchakning burchaklari yig'indisi 360 — bu yerda u yagona tayanch |
| 03 | C `TrueFalse` | 🟢 | `trapezoid_claims` | «Trapetsiyaning yon tomonlari doim teng» → **Yo'q**; «Trapetsiyaning asoslari teng» → **Yo'q** | ikkalasi ham YOLG'ON (§0a.3). Birinchisi teng yonli trapetsiyani hamma trapetsiyaga yoyadi; ikkinchisi o'z-o'zini rad etadi — asoslar teng bo'lsa figura parallelogrammga aylanadi va trapetsiya bo'lmay qoladi (З81) |
| 04 | F `MarkAll` 🖼 | 🟡 | `trapezoid_marked` | Olti to'rtburchakdan 3 tasi trapetsiya | rad etilganlar: parallelogramm (ikki juft parallel — З81), ixtiyoriy to'rtburchak (parallel juft yo'q), deltoid. Uch trapetsiyadan bittasi to'g'ri burchakli, bittasi teng yonli. Chizmada parallellik strelka bilan |
| 05 | I `SwapOrder` | 🟡 | `isosceles_steps` | Teng yonli trapetsiyada asosidagi burchaklar tengligi: kichik asosning uchlaridan katta asosga balandlik tushiramiz → hosil bo'lgan ikki to'g'ri burchakli uchburchak teng (gipotenuza va katet bo'yicha) → mos burchaklar teng → `∠A = ∠D` | xulosani uchburchaklar tengligidan oldin qo'yish. Balandlikni oxirga qo'yish ham xato: uchburchaklar hali yo'q |
| 06 | B `Zones` | 🟡 | `trapezoid_or_not` | 8 karta ikki zonaga: TRAPETSIYA BO'LADI / BO'LMAYDI. Bo'ladi: `BC∥AD, AB∦CD`; `AB∥CD, AD∦BC`; `BC∥AD, BC≠AD, AB∦CD`; `MN∥PQ, MQ∦NP`; bo'lmaydi: `BC∥AD, AB∥CD`; `AB∦CD, BC∦AD`; `AB=CD, BC=AD`; `∠A=∠B=∠C=∠D=90°` | З81 to'liq: birinchi rad etilgan karta ikki juft parallel (parallelogramm), ikkinchisi umuman parallel juftsiz, uchinchi va to'rtinchisi parallelogrammning boshqa belgilaridan. Ta'rifning IKKALA sharti ham tekshiriladi |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: ikki tomoni **parallel**, qolgan ikki tomoni **parallel emas** bo'lgan to'rtburchak trapetsiya deyiladi; teng yonli trapetsiyaning **asosidagi** burchaklari teng | bankda tuzoq: «teng» (yon tomonlar tengligini ta'rifga kiritish), «parallel» ikkinchi bo'shliqqa ham (З81), «yon tomonidagi» (o'sha yon tomondagi burchaklar 180 gacha to'ldiradi, teng emas) |
| 08 | D `PairSlots` | 🔴 | `angle_to_neighbour` | Trapetsiyada `BC ∥ AD`. Uch juft: `∠A=60° ↔ ∠B=120°`; `∠D=95° ↔ ∠C=85°`; `∠A=90° ↔ ∠B=90°` | uchinchi juftlik З82 ning o'zi: to'g'ri burchakda «180 gacha to'ldirish» qoidasi ham to'g'ri burchak beradi, ya'ni to'g'ri burchakli trapetsiyada ULAR IKKITA. Birinchi ikki juftlik shu qoidani odatiy holda ko'rsatadi |
| 09 | J `MatchPairs` | 🔴 | `three_angles_to_fourth` | To'rt trapetsiya, har birida uch burchak berilgan, to'rtinchisi topiladi: `70°,110°,65° ↔ 115°`; `90°,90°,50° ↔ 130°`; `60°,120°,100° ↔ 80°`; `75°,105°,105° ↔ 75°` | ikkinchisi to'g'ri burchakli trapetsiya (З82 — ikki to'g'ri burchak birga turadi), to'rtinchisi teng yonli (T3 — ikki burchak teng). Hisob bitta: yig'indi 360 |
| 10 | G `CodeLock` | 🔴 | `code_trapezoid_angles` | Uch trapetsiya: to'g'ri burchakli trapetsiyada `∠A = 90°` bo'lsa `∠B` (90); `∠A = 65°` bo'lgan trapetsiyada `∠B` (115); teng yonli trapetsiyada `∠A = 72°` bo'lsa `∠B` (108). Kod o'sish tartibida → **90, 108, 115** | bankda `72`, `65`, `45`. Uchinchi savol teng yonli trapetsiya haqida, va u yerda `∠B` `∠A` ga TENG EMAS — teng bo'lgani asosidagi ikkinchi burchak (T3 ni З82 dan ajratish) |

**Qoplov.** T1 — 01, 03, 04, 06, 07. T2 — 08, 09, 10. T3 — 05, 07, 09, 10.
З81 — 01, 03, 04, 06, 07. З82 — 08, 09, 10. З16 — razborlar to'rt burchakni 360 gacha
qo'shib tekshiradi.
**Oldingi blokdan** — 06 va 09 da parallelogramm (37-dars) va to'g'ri to'rtburchak
(38-dars): trapetsiya ulardan RAD ETISH bilan ajraladi.

**Harf.** Hamma joyda `ABCD`, `BC ∥ AD` (darslikning yozuvi); 06 da bir marta `MNPQ` —
belgilash o'zgarsa ham ta'rif o'zgarmasligini ko'rsatish uchun.
Takrorlanmaydigan narsa — BURCHAK TO'PLAMLARI.

---

## 12. DARS 40 — PARALLELOGRAMMNING YUZI

Tasdiqlar `Dars40.jsx` dan: T1 — istalgan tomon asos bo'lishi mumkin, unga mos balandlik
qarama-qarshi tomongacha bo'lgan masofa; T2 — `S = a · h`; T3 — boshqa tomon asos qilib
olinsa, balandlik ham boshqacha bo'ladi, lekin yuza o'zgarmaydi.
Adashishlar: З16, З83 (yuza ikki tomon ko'paytmasi deb olindi, yon tomon balandlik bilan
chalkashtirildi), З84 (parallelogrammda bitta balandlik bor deb hisoblandi, asos
o'zgarganda balandlik qayta hisoblanmadi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` 🖼 | 🟢 | `which_is_height` | Chizmada parallelogramm `ABCD` va to'rt kesma. `AD` asos bo'lsa, balandlik qaysi biri | rad etilganlar: yon tomon `AB` (З83 — u qiya, perpendikulyar emas), diagonal `AC`, `BC` dan tushirilgan lekin `AD` ga yetmaydigan kesma. Chizmasiz zaxira: to'rt ta'rif matni, lekin o'shanda savol ta'rifni yodlashga aylanadi (§0a.2) |
| 02 | C `TrueFalse` | 🟢 | `area_claims` | «Yuza asos bilan unga MOS balandlik ko'paytmasiga teng» → **Ha**; «Yuza ikki qo'shni tomon ko'paytmasiga teng» → **Yo'q** | З83. Ikki da'vo bir-biriga juda o'xshaydi, farq bitta so'zda: «balandlik» va «tomon». Razbor cho'zilgan parallelogrammni misol qiladi — tomonlari o'sha, yuzasi kichik |
| 03 | E `TypeValue` | 🟢 | `area_value` | Asos 12 sm, balandlik 5 sm. Yuza = **60** | `17` (qo'shildi), `30` (uchburchak formulasi bilan yarimlandi), `24` (asos ikkilandi). T2 ning to'g'ridan-to'g'ri qo'llanilishi |
| 04 | B `Zones` | 🟡 | `enough_or_not` | 8 karta ikki zonaga: YUZANI TOPISH MUMKIN / MUMKIN EMAS. Mumkin: `a=8, h=3`; `a=10, h=4,5`; `a=6, h=6`; `a=2,5, h=4`; mumkin emas: `a=8, b=3`; `a=10, d=6`; `h=4, b=5`; `∠A=60°, a=8` | З83 sof shaklda: `a` va `b` — ikki TOMON, va ular yuzani bermaydi. Har juftlik yaqin turadi: `a=8, h=3` va `a=8, b=3` faqat bitta harfda farq qiladi |
| 05 | I `SwapOrder` | 🟡 | `area_steps` | Yuzani topish tartibi: asosni tanlaymiz (`AD = 10`) → unga MOS balandlikni topamiz (`BH = 4`) → ko'paytiramiz (`10 · 4`) → yuzani birlik bilan yozamiz (`40 sm²`) | balandlikni asos tanlashdan OLDIN olish — o'shanda «mos» degan so'z ma'nosini yo'qotadi va З84 tug'iladi. Ko'paytirishni balandlikdan oldin qo'yish — ko'paytiriladigan narsa hali yo'q |
| 06 | D `PairSlots` | 🟡 | `base_to_height` | Bitta parallelogramm, `S = 24`. Uch juft: `a=6 ↔ h=4`; `a=8 ↔ h=3`; `a=12 ↔ h=2` | T3 va З84 birga: bitta figurada uch xil asos va uch xil balandlik, YUZA esa o'zgarmaydi. Kartalarni almashtirish darhol boshqa yuzani beradi, va razbor buni ko'paytirib ko'rsatadi |
| 07 | J `MatchPairs` | 🔴 | `given_to_unknown` | To'rt teskari masala: `S=36, a=9 ↔ 4`; `S=48, a=6 ↔ 8`; `S=45, h=5 ↔ 9`; `S=42, a=7 ↔ 6` | uchinchisida noma'lum ASOS, qolganlarida balandlik — ya'ni formula ikki tomonga ham ishlaydi. Tuzoq — yuzani asosga qo'shish yoki ayirish |
| 08 | G `CodeLock` | 🔴 | `code_heights` | Bitta parallelogrammning yuzi 60. Uch asos uchun balandlik, o'sish tartibida: `a=15` (4), `a=12` (5), `a=10` (6) → kod **4, 5, 6** | bankda `15`, `12`, `10` — asoslarning O'ZI. З84: asos o'zgarsa balandlik ham o'zgaradi, va uch javob uch boshqa son bo'ladi. Yuza esa hamma qatorda bir xil |
| 09 | H `ClozeBank` | 🔴 | `rule_words` | qoida: parallelogrammning yuzi **asos** bilan unga mos **balandlik** ko'paytmasiga teng; boshqa tomon asos qilib olinsa, balandlik ham **boshqacha** bo'ladi | bankda tuzoq: «yon tomon» (З83), «o'sha» (З84), «diagonal» |
| 10 | F `MarkAll` 🖼 | 🔴 | `same_area_marked` | Olti parallelogrammdan 3 tasining yuzi teng: asosi va balandligi bir xil, qiyaligi boshqa | rad etilganlar: balandligi boshqa, asosi boshqa, va TOMONI o'sha lekin qiyaligi kattaroq (З83 — tomon uzunligi o'zgarmagani yuzani saqlamaydi). Chizmada har figurada asos va balandlik belgilangan |

**Qoplov.** T1 — 01, 05, 09, 10. T2 — 02, 03, 04, 05, 06, 07, 08, 09.
T3 — 06, 08, 09, 10. З83 — 01, 02, 04, 05, 07, 09, 10. З84 — 05, 06, 08, 09.
З16 — razborlar yuzani teskari amal bilan qayta tekshiradi.
**Oldingi blokdan** — 04 va 10 da 37-darsning parallelogrammi: tomonlar teng bo'lgani
bilan yuzani bermaydi.

**Harf.** Hamma joyda `a`, `h`, `S` (darslikning yozuvi), chizmada `ABCD` va `H`.
Takrorlanmaydigan narsa — O'LCHOVLAR: bitta asos-balandlik juftligi ikki topshiriqda
uchramaydi.

---

## 13. NIMA O'ZGARADI UMUMIY QATLAMDA

| Fayl | O'zgarish | Sabab |
|---|---|---|
| `practice/fig.jsx` | `poly` turi qo'shiladi (additiv) | §0a.2, faqat metodist ruxsati bilan |
| `scripts/grade8-practice-seq.mjs` | `SEQ` ga 31-40 qatorlari; `head3` sharti derazali bo'ladi | §0a.1, faqat metodist ruxsati bilan |
| `scripts/grade8-practice-plan.mjs` | `PLAN_31` … `PLAN_40` va `LESSONS` qatorlari | tekshiruv javoblarni shu moduldan oladi |
| `src/lessons/grade8.js` | `grade8Amaliy` ga o'nta yozuv | reyestrsiz amaliyot ochilmaydi |
| `practice/kit.jsx` | **tegilmaydi** | o'nta mexanika o'zgarmaydi |
| `practice/frac.jsx` | **tegilmaydi** | `poly` `fig.jsx` da, `Row` uni allaqachon chaqiradi |

**DIQQAT — bir vaqtda ikki sessiya.** Bu skelet yozilayotgan paytda repo'da 28-darsning
amaliyoti yig'ilmoqda (`dars28/` fayllari 11:39 dan beri qo'shilmoqda). 21-30 bloki
`SEQ`, `grade8-practice-plan.mjs` va `src/lessons/grade8.js` ga ham yozadi. Shuning
uchun 31-40 ning yig'ilishi shu uch faylga **oxirida va nuqtali** tegadi: 28-30
tugagandan keyin, ularning yozganini o'chirmasdan. Aks holda bitta to'liq qayta yozish
ikkinchi sessiyaning ishini yo'q qiladi.

---

## 14. TEKSHIRUV

```powershell
node scripts/grade8-practice-seq.mjs check      # taqsimot shartlari
npx vite --port 5199                            # alohida terminalda
node scripts/grade8-practice-check.mjs          # to'g'ri javob bilan 10/10 + skroll yo'q
G8_WRONG=1 node scripts/grade8-practice-check.mjs   # razbor bo'shmi
npx eslint src/components/grade8/practice
npm run build
```

---

## 15. TASDIQ

Metodist 2026-08-25 da skeletni to'liq tasdiqladi, jumladan ikki qarorni ham:
**§0a.1** — birinchi uchtalik sharti DERAZALI bo'ldi (12 dars);
**§0a.2** — `fig.jsx` ga `poly` turi qo'shildi.
Shundan keyin 2 va 3-etap bajarildi.

---

## 16. YIG'ISHDA NIMA O'ZGARDI (3-etap yozuvi)

Skelet bajarildi, lekin o'lchov uchta joyda tuzatish talab qildi. Hammasi
`node scripts/grade8-practice-check.mjs` ning natijasi bo'yicha, ya'ni taxmin
bilan emas.

**16.1. Razbor telefonda kadrdan chiqdi — o'n uch joyda.** Eng og'irlari:
34/01, 34/02 (ruscha 30px), 37/02 (ruscha 79px), 38/10 (ruscha 208px),
40/01 va 40/10 (ruscha 110px). Sabab bir xil: `correctText` uch tilda uch xil
uzunlikda, va **ruscha matn eng uzun** — 21-30 blokida ingliz tili eng tor
deb yozilgan edi, bu o'ntalikda esa rus tili. Yechim: razborlar qisqartirildi,
mazmun saqlandi. Razborning uzunligi endi taxminan olti qatordan oshmaydi.

**16.2. Chizmaning kadri kichraytirildi — beshta topshiriqda.** `poly` ning
dastlabki kadri 100×74 edi, va olti figura ikki qatorda turganda u razbor
bilan birga sig'masdi. Yangi o'lchamlar: `MarkAll` da 86×60 (37/02, 38/01,
39/04, 40/10 — oxirgisi 84×62), `Choice` da 78×54 (40/01), `MatchPairs` da
62×44 (38/10). Koordinatalar ham shu nisbatda masshtablandi: `poly` avtomatik
moslamaydi va bu ataylab — bir topshiriqdagi olti figura BIR o'lchovda
bo'lishi kerak (40/10 ning butun mazmuni shunda).

**16.3. Deltoid rombga o'xshab qolgan edi.** 37/02, 38/01 va 39/04 da rad
etiladigan figura sifatida deltoid turadi. Uning birinchi koordinatalarida
qo'shni tomonlar 37 va 42 birlik edi — ko'z bilan farq qilinmaydi, ya'ni
chizma o'quvchini adashtirardi, ayniqsa 38-darsda, u yerda deltoid ROMBLAR
orasida turadi. Yangi koordinatalarda nisbat 1,42 ga chiqarildi va figura
bir qarashda deltoid bo'lib ko'rinadi. Bu 16.1 va 16.2 dan farqli nuqson:
u o'lchov emas, MAZMUN xatosi edi, va uni faqat kadrga qarab topish mumkin.

**16.4. Tekshiruvning natijasi.** O'nta darsning har biri ikki rejimda ham
toza: to'g'ri javob bilan 10/10 va skrollsiz (5 o'lcham × 3 til × 10
topshiriq = 150 o'tish), noto'g'ri javob bilan esa ball berilmaydi va razbor
uch tilda ham bo'sh emas. `npm run build`, `eslint`,
`grade8-practice-lang.mjs` va `grade8-practice-seq.mjs check` — hammasi
yashil.

**16.5. Nima qilinmadi.** `TIPLAR_AMALIYOT_8SINF.md` §7 ga ha/yo'q qoidasi
(§0a.3) hali yozilmadi — u alohida hujjatga tegadi va metodistning ayni shu
bandga ruxsatini kutadi (skelet tasdig'i qoidani hujjatga ko'chirishni
avtomatik anglatmaydi).
