# 8-SINF AMALIYOTI, 21-30 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-25: **21-30 darslarning amaliyoti 15-20 bilan bir xil qoida
bo'yicha yaratiladi** — 1-darsdagi AYNAN O'SHA o'nta mexanika, har darsda boshqa
ketma-ketlik, fon rangi va dizayn tegilmaydi.

Bu hujjat — 1-etap (skelet). Kontent 2-etapda, faqat skelet tasdiqlangandan keyin.
Oldingi hujjatlar: `DARS15_20_AMALIYOT_SKELET.md` (eng yaqin namuna),
`DARS12_14_AMALIYOT_SKELET.md` (razbor uzunligi budjeti),
`DARS07_11_AMALIYOT_SKELET.md` (o'nta mexanikaning kontrakti).

O'n dars — ikki blokning chegarasi: 21-22 Б3 ni yopadi (kvadrat tenglamalar), 23-30 esa
Б4 ning O'ZI (tengsizliklar, oraliqlar, modul, xatoliklar). Shu sababli bu skeletda mavzu
bir marta keskin buriladi, mexanikalar esa burilmaydi.

---

## 0. HAMMA TASDIQ NAZARIY DARSDAN OLINGAN

Repo'da `Dars21.jsx` … `Dars30.jsx` turibdi, ya'ni bu skeletda hech bir tasdiq taklif
qilinmagan — hammasi nazariy fayllarning `STATEMENTS` va `MISS` idan aynan olingan.

| Dars | Blok | Mavzu (`META.topic`) | Adashishlar |
|---:|:--:|---|---|
| 21 | Б3 | Kvadrat tenglamalar yordamida masalalar yechish | З16, З3, З45, З47 |
| 22 | Б3 | Ko'paytuvchilarga ajratish va bikvadrat tenglamalar | З16, З38, З40, З46, З48 |
| 23 | Б4 | Sonli tengsizliklar | З16, З49, З50, З51 |
| 24 | Б4 | Sonli tengsizliklarning asosiy xossalari | З16, З52, З53 |
| 25 | Б4 | Bir noma'lumli chiziqli tengsizliklar | З16, З52, З54 |
| 26 | Б4 | Bir noma'lumli tengsizliklar sistemasi | З16, З54, З55 |
| 27 | Б4 | Sonli oraliqlar va ularning belgilanishi | З16, З54, З56 |
| 28 | Б4 | Tengsizliklar yordamida masalalar yechish | З16, З54, З57 |
| 29 | Б4 | Sonning moduli. Modul qatnashgan tenglama va tengsizliklar | З16, З58, З59 |
| 30 | Б4 | Taqribiy hisoblashlar va xatoliklar | З16, З60, З61 |

Yangi adashish kodi o'ylab topilmadi: З45-З61 ni nazariy darslarning o'zi kiritgan.

---

## 0a. BESHTA QAROR — TO'RTTASI SHU YERDA, BITTASI METODISTNIKI

**0a.1. `ODZ` — 21-darsda yana o'sha holat.** `ETALON_8SINF.md` §9.1 uni ochiq taqiqlaydi
(«`ODZ` писать запрещено»), o'zbekcha shakli — `ruhsat etilgan qiymatlar`. `Dars21.jsx`
matnida esa `ODZ` 13 marta uchraydi (`Dars22`-`Dars30` da bitta ham yo'q).
**Bu skeletda ETALON tanlandi**: 21-dars amaliyotida `ruhsat etilgan qiymatlar` yoziladi.
Bu 20-dars uchun qabul qilingan qarorning davomi (`DARS15_20_AMALIYOT_SKELET.md` §0a.1).

**0a.2. `fig.jsx` ning son o'qi ORALIQNI chizmaydi — metodist qarori kerak.**
Hozir `axis` speci faqat bo'linmalar, nuqtalar (`open` — bo'sh doiracha) va `?` ni chizadi.
Ya'ni `[0; 3]` va `(0; 3)` ikki doiracha bilan farq qiladi, oraliqning O'ZI — ular
orasidagi sonlar to'plami — umuman chizilmaydi. Б4 ning butun mazmuni esa aynan shu
to'plam. `DINAMIKA_VA_ILLUSTRATSIYA.md` bo'yicha bunday chizma mexanizmni ko'rsatmaydi:
ikki nuqta to'plamni anglatmaydi.

**Taklif:** `fig.jsx` ning `axis` iga QO'SHIMCHA (additiv) `spans` maydoni kiritilsin —
ikki qiymat orasidagi qalin chiziq, chegarasi cheksiz bo'lsa uchida strelka. Mavjud hech
bir spec o'zgarmaydi, ya'ni 7-20 darslarning chizmalari tegilmaydi.

- **Ha desangiz:** 27/09 va 28/09 da son o'qi haqiqiy to'plamni ko'rsatadi.
- **Yo'q desangiz:** o'sha ikki topshiriq chizmasiz yig'iladi, mazmun yozuvda qoladi.
  **Ikki doirachani chizib qo'yish varianti tanlanmaydi** — u chizmaga o'xshaydi, lekin
  to'plamni ko'rsatmaydi.

Qolgan uch chizma (25/04, 26/07, 29/07) `spans` siz ham ishlaydi va qarordan qat'i nazar
qoladi.

**0a.3. `PairSlots` kartasi va bo'shliqsiz yozuv.** Karta telefonda 54px, ya'ni unga
olti-yetti belgi sig'adi. Б4 ning yozuvi esa uzun: `1 < x < 5` — to'qqiz belgi. Shu sababli
bu blokda `PairSlots` kartalarida yozuv BO'SHLIQSIZ yoziladi: `1<x<5`, `x≤6,6`, `|x|=4`.
Faqat shu mexanikada va faqat karta ichida; `Row` ning boshqa joyida bo'shliq qoladi.
`faceSize: 12, faceSizePhone: 10`.

**0a.4. Nolga ko'paytirish (24-dars, 05-topshiriq).** `Dars24.jsx` ning teoremalari musbat
va manfiy son haqida, nol haqida hech narsa yo'q. Amaliyotda esa u uchinchi juftlik bo'lib
turadi: `×0` da ikkala tomon nolga aylanadi va tengsizlik TENGLIKKA aylanadi. Sabab:
«musbat yoki manfiy» degan ikkilik o'quvchida «uchinchisi yo'q» degan yolg'on to'liqlikni
yaratadi. Razbor buni bir gapda aytadi: nol na musbat, na manfiy.

**0a.5. `%` belgisi.** 30-darsning kartalarida `2%` yoziladi, matnda esa `foiz` so'zi
turadi. Amaliyotda ovoz yo'q, ya'ni ovoz qoidalari bu belgiga tegmaydi.

---

## 1. KETMA-KETLIKLAR — O'N DARS, UCH UCHLIK VA BITTA YOLG'IZ

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **21** | F | E | B | G | D | C | I | J | H | A |
| **22** | A | B | E | D | F | G | C | I | J | H |
| **23** | C | A | F | I | E | H | G | D | B | J |
| **24** | C | A | E | G | D | I | B | F | J | H |
| **25** | A | F | B | E | G | J | D | H | C | I |
| **26** | F | B | C | D | A | G | E | I | H | J |
| **27** | C | E | F | D | B | H | A | I | J | G |
| **28** | A | C | B | H | E | G | I | D | F | J |
| **29** | F | B | A | J | H | I | E | G | C | D |
| **30** | C | F | A | H | B | G | D | J | I | E |

Kodlar: A `Choice`, B `Zones`, C `TrueFalse`, D `PairSlots`, E `TypeValue`, F `MarkAll`,
G `CodeLock`, H `ClozeBank`, I `SwapOrder`, J `MatchPairs`. Qiyinlik o'qi hamma darsda
o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴 — qiyinlikni **misol** beradi, mexanika emas.

**Guruhlar: 21-23, 24-26, 27-29, va 30 yolg'iz.** «Har mexanika guruh ichida har xil
pozitsiyada» degan shart guruhning HAR pozitsiyasida farq talab qiladi, 1-pozitsiyaga esa
faqat uch tip qo'yish mumkin (A, C, F) — ya'ni guruh uchtadan katta bo'lolmaydi. O'nta dars
uchtaga bo'linmaydi, shuning uchun 30-dars alohida qoladi. Uning tartibi qolgan hammasidan
**kamida sakkiz pozitsiyada** farq qiladi (umumiy talab oltita edi): yolg'iz qator uchun
shart kuchaytirildi, aks holda u eng yaqin qo'shnisiga o'xshab qolardi.

`node scripts/grade8-practice-seq.mjs check` natijasi: 21-23, 24-26, 27-29 va 30 guruhlari
toza, juftliklar toza. Skript va `SEQ` jadvali shu skelet bilan birga yangilangan — jadval
haqiqat manbai, amaliyot fayllari unga qarab yig'iladi.

---

## 2. CHIZMA: BESH JOYDA, VA HAMMASI SON O'QI

15-20 da chizma bir joyda edi, chunki mavzular YOZUV va HISOB haqida edi. Б4 boshqa:
tengsizlikning yechimi — son o'qidagi TO'PLAM, va uni ko'rsatmaslik mazmunni yashirish
degani. Shu sababli bu o'nlikda chizma beshta topshiriqda turadi, hammasi `axis`.

| Dars | Topshiriq | Chizma nima qiladi | `spans` kerakmi |
|---:|---|---|:--:|
| 25 | 04 | 0 dan 5 gacha o'q, ikki va uch orasida `?`: `3x > 7` ning eng kichik butun yechimi qayerda TURISHINI aytmaydi, izlash joyini ko'rsatadi | yo'q |
| 26 | 07 | −4 dan 5 gacha o'q, bo'linmalar ochiq: sanaladigan narsa ko'rinib turadi, chegara qaysi tomonga kirishini esa o'quvchi hal qiladi | yo'q |
| 27 | 09 | to'rt oraliqning to'rt surati: `[0;3]`, `(0;3)`, `[0;3)`, `(0;3]` — juftlash mexanikasining o'ng ustuni | **ha** |
| 28 | 09 | `x < 4,5` ning surati: 4,5 da bo'sh doiracha, undan chapga qalin chiziq | **ha** |
| 29 | 07 | −4 dan 4 gacha o'q: `|x| < 3` ning butun yechimlarini sanash uchun | yo'q |

`spans` rad etilsa — 27/09 va 28/09 chizmasiz yig'iladi (§0a.2), qolgan uchtasi
o'zgarmaydi. Yangi `fig` turi qo'shilmaydi, `plot.jsx` ga tegilmaydi.

---

## 3. DARS 21 — KVADRAT TENGLAMALAR YORDAMIDA MASALALAR YECHISH

Tasdiqlar `Dars21.jsx` dan: T1 — noma'lum miqdor harf bilan belgilanadi, qolganlari shu
harf orqali yoziladi; T2 — masala shartidan tenglama tuziladi va yechiladi; T3 — masala
shartiga zid ildiz (manfiy uzunlik, tezlik, vaqt) javobga kiritilmaydi.
Adashishlar: З16, З3 (tenglamaning ruhsat etilgan qiymatlari masalaning hayotiy sharti
bilan chalkashtirildi), З45 (daqiqani soatga o'tkazishda xato), З47 (manfiy yechim javobga
qo'shildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `same_condition_marked` | «Ikki ketma-ket natural sonning ko'paytmasi 56, kichigi x». 6 yozuvdan 3 tasi shu shartni beradi: `x(x + 1) = 56`, `x² + x = 56`, `x² + x − 56 = 0` | `x(x + 2) = 56` (ketma-ket emas, JUFT sonlar), `x + (x + 1) = 56` (yig'indi), `x² = 56` (bitta son). T1 va T2: bir shart uch xil yozilishi mumkin, lekin to'rtinchi yozuv boshqa masala |
| 02 | E `TypeValue` | 🟢 | `rect_side` | To'rtburchakning bo'yi enidan 3 sm ortiq, yuzi 40 sm². Enini toping → **5** | `8` (bo'yi yozildi), `−8` (ildiz, lekin uzunlik manfiy bo'lmaydi — З47), `40`, `20`. Razbor ikkala ildizni ham ko'rsatadi va bittasini SABAB bilan rad etadi |
| 03 | B `Zones` | 🟢 | `accept_or_reject` | `given`: a — tomon uzunligi (sm). 8 qiymat ikki zonaga: JAVOBGA KIRADI / RAD ETILADI. Kiradi: `6`, `1`, `9`, `2,5`; rad: `−6`, `−1`, `0`, `−2,5` | З47. Kartalar juft-juft, faqat ishora farq qiladi. `0` alohida turadi: uzunligi nol bo'lgan tomon yo'q, ya'ni rad etish sababi ishora emas, MA'NO |
| 04 | G `CodeLock` | 🟡 | `code_real_answers` | Uch masala yechilgan, har birida ikki ildiz chiqqan: 5 va −8 (tomon), −2 va 4 (vaqt), −7 va 3 (tezlik). Har masaladan HAQIQIY javobni olib, kodga o'sish tartibida yozing → **3, 4, 5** | bankda `−8`, `−2`, `−7`. З47 uch marta ketma-ket. Tenglama yechish bu yerda talab qilinmaydi — tekshiriladigan ish TANLASH |
| 05 | D `PairSlots` | 🟡 | `equation_to_side` | Uch juft: `x²+x=12 ↔ x=3`; `x²−x=12 ↔ x=4`; `x²+3x=10 ↔ x=2` | har tenglamaning ikkinchi ildizi manfiy (−4, −3, −5) va u kartada YO'Q: juftlash faqat musbat ildiz bilan bo'ladi. Tuzoq — birinchi ikki tenglamani almashtirish (ishora ishi) |
| 06 | C `TrueFalse` | 🟡 | `problem_claims` | «Tomon so'ralgan, ildizlar 6 va −6, javob: 6» → Ha; «Tezlik so'ralgan, ildizlar 4 va −5, javob: 4 va −5» → Yo'q | З47. Birinchisi to'g'ri rad etishning namunasi, ikkinchisi — o'sha xatoning o'zi |
| 07 | I `SwapOrder` | 🟡 | `word_solve_steps` | To'rt qadam: `x` deb belgilaymiz (`x — kichik son`) → tenglama tuzamiz (`x(x+1) = 56`) → yechamiz (`x = 7; x = −8`) → shartga zid ildizni rad etamiz (`x = 7`) | T1, T2, T3 bir qatorda. Rad etishni yechishdan OLDIN qo'yish — o'shanda rad etadigan narsa hali yo'q |
| 08 | J `MatchPairs` | 🔴 | `problem_to_equation` | To'rt shart ↔ to'rt tenglama: «ketma-ket ikki son, ko'paytma 56» ↔ `x(x + 1) = 56`; «ketma-ket ikki JUFT son, ko'paytma 48» ↔ `x(x + 2) = 48`; «son va uning kvadrati, yig'indi 56» ↔ `x + x² = 56`; «ketma-ket ikki son, kvadratlari yig'indisi 85» ↔ `x² + (x + 1)² = 85` | T1 to'liq ochiladi: farq FAQAT ikkinchi kattalikni x orqali qanday yozishda. «Ketma-ket» va «ketma-ket juft» bir belgida farq qiladi |
| 09 | H `ClozeBank` | 🔴 | `rule_words` | qoida: noma'lum kattalik **harf bilan** belgilanadi, qolganlari shu harf orqali yoziladi; shartdan **tenglama** tuziladi; masala shartiga zid ildiz javobga **kiritilmaydi** | bankda tuzoq: «son bilan» (T1 ning teskarisi), «tengsizlik» (28-darsning ishi, bu yerda emas), «kiritiladi» (З47 aynan shu yerda) |
| 10 | A `Choice` | 🔴 | `time_units` | Darsning o'z sahnasi: avtobus 40 km ni taksidan 10 daqiqa ko'p vaqtda bosdi, taksi tezligi 20 km/soat ortiq. Qaysi tenglama shartga mos: **`40/v − 40/(v+20) = 1/6`** | `40/v − 40/(v+20) = 10` (daqiqa soatga o'tkazilmadi — З45), `40/(v+20) − 40/v = 1/6` (ayirma teskari: taksi TEZROQ, ya'ni vaqti KAM), `40/v + 40/(v+20) = 1/6`. Razbor o'n daqiqa nega bir oltidan ekanini bir gapda aytadi |

**Qoplov.** T1 — 01, 05, 07, 08, 09. T2 — 01, 02, 05, 07, 08, 09, 10. T3 — 02, 03, 04, 06,
07, 09. З47 — 03, 04, 06, 09. З45 — 10. З3 — 03 razbori (tenglamaning taqiqi va masalaning
hayotiy sharti — ikki boshqa narsa). З16 — razborlar javobni masalaning O'ZIGA qo'yib
tekshiradi, tenglamaga emas.
**Oldingi blokdan** — 10-topshiriq kasr-ratsional tenglama (20-dars): maxrajlar `v` va
`v + 20`, ya'ni ruhsat etilgan qiymatlar ham bor.

**Harf.** 01, 05, 07, 08 da x (darslik yozuvi), 02 va 03 da `a`, 04 da harf yo'q (tayyor
ildizlar), 10 da `v` (tezlik). Takrorlanmaydigan narsa — MASALALAR: darsdagi hech bir
masala matni ikki marta uchramaydi.

---

## 4. DARS 22 — KO'PAYTUVCHILARGA AJRATISH VA BIKVADRAT TENGLAMALAR

Tasdiqlar `Dars22.jsx` dan: T1 — `ax² + bx + c = a(x − x₁)(x − x₂)`; T2 — `ax⁴ + bx² + c = 0`
bikvadrat tenglama, `x² = t` belgilash bilan kvadratga keltiriladi; T3 — t manfiy chiqsa
undan haqiqiy x topilmaydi.
Adashishlar: З16, З38 (a nolga teng bo'lishi mumkin deb o'ylandi), З40 (plyus-minus
unutildi), З46 (ikkinchi ildiz ko'paytma yoki yig'indidan xato aniqlandi), З48 (manfiy t
dan x topildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `factored_form` | `x² − 5x + 6` ning ko'paytuvchilarga ajratilgani: **`(x − 2)(x − 3)`** | `(x + 2)(x + 3)` (ikkala ishora almashdi), `(x − 2)(x + 3)` (bittasi almashdi), `(x − 5)(x − 6)` (koeffitsiyentlarni ildiz deb o'qish — З46). Razbor qavslarni ochib tekshiradi |
| 02 | B `Zones` | 🟢 | `t_possible` | 8 karta ikki zonaga: `x` TOPILADI / TOPILMAYDI. Topiladi: `t = 9`, `t = 0`, `t = 4`, `t = 1`; topilmaydi: `t = −9`, `t = −1`, `t = −4`, `t = −16` | З48. Kartalar juft-juft, faqat ishora farq qiladi. `t = 0` birinchi zonada va u BITTA ildiz beradi — bu 04-topshiriqda ochiladi |
| 03 | E `TypeValue` | 🟢 | `count_roots` | `x⁴ − 13x² + 36 = 0` tenglamaning nechta ildizi bor → **4** | `2` (t ning ildizlari sanaldi — 4 va 9), `1`, `0`. Har musbat t dan IKKI x chiqadi (З40) |
| 04 | D `PairSlots` | 🟡 | `t_to_x_count` | Uch juft: `t=16 ↔ ikkita`; `t=0 ↔ bitta`; `t=−16 ↔ yo'q` | T3 va З40 bir joyda. Uch t bir-biriga o'xshaydi, farqi — ishora va nol |
| 05 | F `MarkAll` | 🟡 | `biquadratic_marked` | 6 tenglamadan 3 tasi bikvadrat: `x⁴ − 5x² + 4 = 0`, `2x⁴ + 3x² − 5 = 0`, `x⁴ − 16 = 0` | `x⁴ − 5x³ + 4 = 0` (toq daraja), `x³ − 5x + 4 = 0`, `x⁴ + 2x + 1 = 0`. `x⁴ − 16 = 0` da b nolga teng — chala bikvadrat, 16-darsga qaytish |
| 06 | G `CodeLock` | 🟡 | `code_root_counts` | Uch tenglamaning ildizlari SONI o'sish tartibida: `x⁴ + 5x² + 4 = 0` (t = −1 va −4 → 0), `x⁴ − 3x² − 4 = 0` (t = 4 va −1 → 2), `x⁴ − 5x² + 4 = 0` (t = 1 va 4 → 4) → kod **0, 2, 4** | bankda `1`, `3`, `8`. `8` — «har t dan to'rtta» degan qarash; `1` va `3` — manfiy t ni ham sanash. З48 uch tenglamada ketma-ket |
| 07 | C `TrueFalse` | 🟡 | `factor_claims` | `x² − 4x + 3 = (x − 1)(x − 3)` — «to'g'ri» → Ha; `2x² − 2x − 4 = (x − 2)(x + 1)` — «to'g'ri» → Yo'q | ikkinchisida BOSH KOEFFITSIYENT tushib qolgan: to'g'ri yozuv `2(x − 2)(x + 1)`. Qavslarni ochsangiz `x² − x − 2` chiqadi, ya'ni yozuv ikki barobar kichik. T1 ning `a` si — З38 ning yashiringan joyi |
| 08 | I `SwapOrder` | 🔴 | `biquad_steps` | `x⁴ − 5x² + 4 = 0`: belgilash kiritamiz (`x² = t`) → kvadrat tenglamani yozamiz (`t² − 5t + 4 = 0`) → t larni topamiz (`t = 1; t = 4`) → x ga qaytamiz (`x = ±1; x = ±2`) | belgilashga QAYTMASDAN javob yozish: o'shanda t ning qiymatlari javob bo'lib qoladi. Razbor plyus-minusni aytadi (З40) |
| 09 | J `MatchPairs` | 🔴 | `biquad_to_roots` | To'rt tenglama ↔ to'rt javob: `x⁴ − 5x² + 4 = 0` ↔ «±1 va ±2»; `x⁴ − 3x² − 4 = 0` ↔ «±2»; `x⁴ + 5x² + 4 = 0` ↔ «ildiz yo'q»; `x⁴ − 4x² = 0` ↔ «0 va ±2» | to'rt tenglamada bir xil sonlar, farqi ISHORALARDA. Ikkinchisida t = −1 rad etiladi (З48), to'rtinchisida nol ildiz paydo bo'ladi (16-darsning З42 si) |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: uchhadni ko'paytuvchilarga ajratganda qavslar oldida **bosh koeffitsiyent** turadi; bikvadrat tenglamada **`x² = t`** belgilash qilinadi; t **manfiy** chiqsa undan x topilmaydi | bankda tuzoq: «ildiz» (З38: `a` ning o'rniga hech narsa qo'ymaslik), «`x = t`» (belgilash darajasini yo'qotish), «musbat» (T3 ning teskarisi) |

**Qoplov.** T1 — 01, 07, 10. T2 — 03, 05, 06, 08, 09, 10. T3 — 02, 04, 06, 09, 10.
З38 — 07, 10. З40 — 03, 04, 08, 09. З46 — 01, 09. З48 — 02, 04, 06, 09, 10.
З16 — razborlar ildizni tenglamaga QO'YIB tekshiradi.
**Oldingi blokdan** — 05 dagi `x⁴ − 16 = 0` va 09 dagi `x⁴ − 4x² = 0`: chala tenglamalar
(16-dars), va ikkinchisida nol ildiz yo'qolmasligi kerak.

**Harf.** Hamma joyda x — bikvadrat tenglamani darslik x bilan yozadi; 02, 04, 06, 08 da
belgilash harfi `t` ham turadi. Takrorlanmaydigan narsa — TENGLAMALAR.

---

## 5. DARS 23 — SONLI TENGSIZLIKLAR

Tasdiqlar `Dars23.jsx` dan: T1 — `a − b` musbat bo'lsa `a > b`; T2 — `a − b` manfiy bo'lsa
`a < b`; T3 — taqqoslash AYIRMANING ishorasiga qaraydi, sonlarning ko'rinishiga emas.
Adashishlar: З16, З49 (ayirma teskari tartibda olindi), З50 (son qanchalik katta
ko'rinishiga qarab taqqoslandi), З51 (`1/n` da n ortganda kasr ham ortadi deb o'ylandi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `difference_claims` | `a − b = 0,4` — «a > b» → Ha; `a − b = −0,4` — «a > b» → Yo'q | T1 va T2 eng qisqa shaklda. Ikki mulohaza faqat ISHORADA farq qiladi, sonning o'zi bir xil |
| 02 | A `Choice` | 🟢 | `which_greater` | Darsning o'z sahnasi: `4/5` va `3/4` — qaysi biri katta? **`4/5`** | `3/4` (maxraji kichik — «demak kattaroq», З51 ning ko'rinishi), «teng», «hisoblamasdan aytib bo'lmaydi». Razbor ayirmani ko'rsatadi: bir yigirmadan, musbat |
| 03 | F `MarkAll` | 🟢 | `positive_difference` | 6 ayirmadan 3 tasi MUSBAT: `7 − 4`, `−2 − (−5)`, `0,3 − 0,25` | `4 − 7`, `−5 − (−2)`, `0,25 − 0,3` — o'sha uch juftlikning teskarisi. З49: ayirmaning TARTIBI natijaning ishorasini hal qiladi |
| 04 | I `SwapOrder` | 🟡 | `compare_steps` | `4/5` va `3/4` ni taqqoslash tartibi: ayirmani yozamiz (`4/5 − 3/4`) → umumiy maxrajga keltiramiz (`16/20 − 15/20`) → ayirmani hisoblaymiz (`1/20`) → ishoraga qaraymiz (`4/5 > 3/4`) | xulosani ayirmadan OLDIN qo'yish: o'shanda javob taxmin bo'ladi, T3 esa aynan buni taqiqlaydi |
| 05 | E `TypeValue` | 🟡 | `reverse_difference` | `a − b = 12`. `b − a` nimaga teng → **−12** | `12` (tartib e'tiborga olinmadi — З49 aynan shu), `0`, `24`. Razbor: ayirmani almashtirish natijani QARAMA-QARSHI songa aylantiradi |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: ikki sonni taqqoslash uchun ularning **ayirmasi** topiladi; ayirma musbat bo'lsa birinchi son **katta**, manfiy bo'lsa **kichik** | bankda tuzoq: «yig'indisi», «katta yoki teng», «kichik yoki teng». Oxirgi ikkitasi 27-darsning qat'iy bo'lmagan tengsizligi — bu yerda ular yolg'on |
| 07 | G `CodeLock` | 🟡 | `code_differences` | Uch ayirmani hisoblab, kodga o'sish tartibida yozing: `0,5 − 0,3` (0,2), `−1 − 2` (−3), `4 − 4,5` (−0,5) → kod **−3; −0,5; 0,2** | bankda `3`, `0,5`, `−0,2` — uchalasi ham TESKARI ayirmaning natijasi (З49). Manfiy sonlarni tartiblash: `−3` `−0,5` dan kichik |
| 08 | D `PairSlots` | 🔴 | `pair_compare` | Uch juft: `a−b=5 ↔ a>b`; `a−b=−5 ↔ a<b`; `a−b=0 ↔ a=b` | uchinchisi darsda ochiq aytilmagan, lekin T1 va T2 dan chiqadi: ayirma na musbat, na manfiy bo'lsa sonlar teng. Tuzoq — birinchi ikki juftlikni almashtirish |
| 09 | B `Zones` | 🔴 | `first_bigger_or_smaller` | 8 karta ikki zonaga: BIRINCHISI KATTA / BIRINCHISI KICHIK. Katta: `1/3 va 1/4`, `−3 va −7`, `0,7 va 0,65`, `2/5 va 3/8`; kichik: `1/5 va 1/4`, `−7 va −3`, `0,65 va 0,7`, `3/8 va 2/5` | З50 va З51 bir joyda: `1/3` va `1/4` da maxraji KATTA kasr kichik, `−3` va `−7` da esa moduli katta son kichik. Har juftlik teskarisi bilan yonma-yon turadi |
| 10 | J `MatchPairs` | 🔴 | `pair_to_difference` | To'rt juftlik ↔ to'rt ayirma: `4/5 va 3/4` ↔ `1/20`; `5/6 va 4/5` ↔ `1/30`; `3/4 va 2/3` ↔ `1/12`; `2/3 va 3/5` ↔ `1/15` | hamma ayirma musbat va hammasining surati BIR — farq faqat maxrajda. Ko'rinishga qarab taxmin qilib bo'lmaydi, hisoblash shart (T3, З50) |

**Qoplov.** T1 — 01, 03, 06, 08, 10. T2 — 01, 03, 06, 08, 09. T3 — 02, 04, 09, 10.
З49 — 03, 05, 07. З50 — 09, 10. З51 — 02, 09. З16 — razborlar ayirmani SON bilan qayta
hisoblaydi.

**Harf.** 01, 05, 08 da `a` va `b` (darslikning yozuvi), qolganlarida harf yo'q — sonlar.
Takrorlanmaydigan narsa — SON JUFTLIKLARI.

---

## 6. DARS 24 — SONLI TENGSIZLIKLARNING ASOSIY XOSSALARI

Tasdiqlar `Dars24.jsx` dan: T1 — ikkala qism MUSBAT songa ko'paytirilsa ishora o'zgarmaydi;
T2 — MANFIY songa ko'paytirilsa ishora qarama-qarshisiga o'zgaradi; T3 — shu qoida
bo'lishga ham tegishli. Darsning matnida yana ikki teorema bor: o'tuvchanlik (`a > b`,
`b > c` → `a > c`) va ikkala qismga bir xil son qo'shish.
Adashishlar: З16, З52 (manfiy songa ko'paytirilganda ishora burilmadi), З53 (musbat songa
ko'paytirilganda ishora ortiqcha burildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `sign_claims` | `5 > 3` ni 2 ga ko'paytirdik: `10 > 6` — «to'g'ri» → Ha; `5 > 3` ni −2 ga ko'paytirdik: `−10 > −6` — «to'g'ri» → Yo'q | З52 eng ochiq ko'rinishda. Razbor son o'qiga tayanadi: minus o'n minus oltidan CHAPDA turadi |
| 02 | A `Choice` | 🟢 | `multiply_by_negative` | `a > b` bo'lsa, `−3a` va `−3b` orasida qanday munosabat: **`−3a < −3b`** | `−3a > −3b` (З52), `−3a = −3b`, «aniqlab bo'lmaydi». Razbor `a = 5`, `b = 3` ni qo'yib ko'rsatadi (З16) |
| 03 | E `TypeValue` | 🟢 | `bound_after_flip` | `−x > −5`. x qaysi sondan kichik → **5** | `−5` (ishora saqlab qolindi — З52), `0`, `1`. Ikkala tomonni minus birga ko'paytirish — eng qisqa hol |
| 04 | G `CodeLock` | 🟡 | `code_smaller_side` | Uch tengsizlik songa ko'paytirildi; har natijaning KICHIK tomonini kodga o'sish tartibida yozing: `3 < 5` ×2 → 6 va 10, kichigi 6; `3 < 5` ×(−1) → −3 va −5, kichigi −5; `2 > 1` ×3 → 6 va 3, kichigi 3 → kod **−5, 3, 6** | bankda `−3`, `5`, `10`. Ikkinchi qatorda kichik tomon ALMASHADI: ko'paytirishdan oldin 3 kichik edi, keyin −5 kichik bo'ldi (T2) |
| 05 | D `PairSlots` | 🟡 | `multiplier_to_result` | `given`: `−3 < 5`. Uch juft: `×2 ↔ −6<10`; `×(−2) ↔ 6>−10`; `×0 ↔ 0=0` | §0a.4: uchinchi juftlik ataylab. Nol na musbat, na manfiy — shuning uchun ikkala qoida ham unga tegishli emas, tengsizlik esa TENGLIKKA aylanadi |
| 06 | I `SwapOrder` | 🟡 | `divide_steps` | `−2a > 6` dan `a` ni topish: ikkala tomonni −2 ga bo'lamiz → manfiy songa bo'lindi, ishorani buramiz → `a < −3` → tekshiramiz: `a = −4` da `8 > 6` | ishorani burishni bo'lishdan OLDIN qo'yish yoki umuman tashlab ketish. Oxirgi qadam З16: javob SON bilan tekshiriladi |
| 07 | B `Zones` | 🟡 | `flip_or_not` | 8 karta ikki zonaga: ISHORA BURILADI / ISHORA O'ZGARMAYDI. Buriladi: `×(−3)`, `:(−5)`, `×(−1)`, `×(−0,5)`; o'zgarmaydi: `×7`, `:4`, `×1`, `:0,2` | T3: bo'lish ko'paytirishdan farq qilmaydi. `×(−0,5)` va `:0,2` — sonning KATTALIGI emas, ISHORASI hal qiladi |
| 08 | F `MarkAll` | 🔴 | `correct_conclusion_marked` | `a > b` berilgan. 6 xulosadan 3 tasi TO'G'RI: `a + 5 > b + 5`, `a − 4 > b − 4`, `2a > 2b` | `−2a > −2b` (З52), `a + 5 > b` (faqat bir tomonga qo'shildi), `a² > b²` (`a = 1`, `b = −3` da yolg'on). Oxirgisi eng qimmat: kvadratga oshirish xossa emas |
| 09 | J `MatchPairs` | 🔴 | `operation_to_result` | `x > 2` berilgan. To'rt amal ↔ to'rt natija: «uchga ko'paytirildi» ↔ `3x > 6`; «minus uchga ko'paytirildi» ↔ `−3x < −6`; «ikkiga bo'lindi» ↔ `x : 2 > 1`; «minus ikkiga bo'lindi» ↔ `x : (−2) < −1` | to'rt natijada bir xil sonlar, farq ISHORA va TENGSIZLIK BELGISIDA. З52 va З53 bir jadvalda |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: ikkala qism musbat songa ko'paytirilsa ishora **o'zgarmaydi**; manfiy songa ko'paytirilsa **qarama-qarshisiga** o'zgaradi; `a > b` va `b > c` bo'lsa, a son c dan **katta** | bankda tuzoq: «buriladi» (З53 — musbatda burish), «yo'qoladi», «kichik» (o'tuvchanlikni teskari o'qish). Uchinchi bo'shliq darsning birinchi teoremasini qaytaradi |

**Qoplov.** T1 — 01, 04, 07, 08, 09, 10. T2 — 01, 02, 03, 04, 05, 06, 07, 09, 10.
T3 — 06, 07, 09. З52 — 01, 02, 03, 06, 08, 09. З53 — 07, 09, 10.
З16 — 02 va 06 razborlari son qo'yib tekshiradi. O'tuvchanlik — 10; qo'shish xossasi — 08.

**Harf.** 02 va 08 da `a`, `b`; 03 va 09 da x; 06 da `a`; qolganlarida sonlar.
Takrorlanmaydigan narsa — TENGSIZLIKLAR.

---

## 7. DARS 25 — BIR NOMA'LUMLI CHIZIQLI TENGSIZLIKLAR

Tasdiqlar `Dars25.jsx` dan: T1 — `ax > b` ko'rinishidagi tengsizlik bir noma'lumli chiziqli
tengsizlik deyiladi; T2 — tengsizlikni to'g'ri sonli tengsizlikka aylantiradigan qiymat
uning yechimi; T3 — had ko'chirilganda ishorasi o'zgaradi, manfiy songa ko'paytirilganda
tengsizlik ishorasi buriladi.
Adashishlar: З16, З52 (manfiy songa bo'lishda ishora burilmadi), З54 (chegara nuqtasi
qat'iy tengsizlikka yechim sifatida kiritildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `is_solution` | `2x − 3 > 5` tengsizlikning yechimi qaysi son: **5** | `4` (chegara: `2·4 − 3 = 5`, lekin tengsizlik QAT'IY — З54), `0`, `−1`. T2 ning ta'rifi: qo'yib ko'rish |
| 02 | F `MarkAll` | 🟢 | `solutions_marked` | `x ≥ −2` ning yechimi bo'lgan 3 ta sonni belgilang: `−2`, `0`, `5` | `−3`, `−10`, `−2,5`. `−2` ning o'zi YECHIM, chunki tengsizlik qat'iy emas (З54 teskari tomondan) |
| 03 | B `Zones` | 🟢 | `strict_or_not` | 8 karta ikki zonaga: CHEGARA KIRADI / CHEGARA KIRMAYDI. Kiradi: `x ≥ 3`, `x ≤ 3`, `x ≥ −1`, `x ≤ 0`; kirmaydi: `x > 3`, `x < 3`, `x > −1`, `x < 0` | З54. Kartalar juft-juft: bir xil son, farq faqat belgining ostidagi CHIZIQ. 27-darsning qavslariga tayyorgarlik |
| 04 🖼 | E `TypeValue` | 🟡 | `smallest_integer` | `3x > 7` ning eng kichik BUTUN yechimi → **3**. Yuqorida CHIZMA: 0 dan 5 gacha son o'qi, ikki va uch orasida `?` | `2` (`7 : 3` ning butun qismi), `7`, `4`. Chizma qidiruv joyini ko'rsatadi, javobni bermaydi |
| 05 | G `CodeLock` | 🟡 | `code_boundaries` | Uch tengsizlikning chegara sonini o'sish tartibida yozing: `2x < −6` (−3), `x + 4 ≥ 4` (0), `−x > −5` (5) → kod **−3, 0, 5** | bankda `3`, `−5`, `4`. Uchinchisida ikkala tomon minus birga ko'paytiriladi (З52), ikkinchisida had ko'chiriladi (T3) |
| 06 | J `MatchPairs` | 🟡 | `inequality_to_solution` | To'rt tengsizlik ↔ to'rt yechim: `2x > 6` ↔ `x > 3`; `−2x > 6` ↔ `x < −3`; `2x < 6` ↔ `x < 3`; `−2x < 6` ↔ `x > −3` | to'rt yozuvda o'sha sonlar, farq ikki ISHORADA: koeffitsiyentniki va tengsizlikniki. З52 to'liq ochiladi |
| 07 | D `PairSlots` | 🟡 | `reversed_reading` | Uch juft: `4<x ↔ x>4`; `4>x ↔ x<4`; `4=x ↔ x=4` | noma'lum O'NG tomonda turgan yozuvni o'qish. 23-darsning З49 si shu yerda qaytadi: `4 < x` ni «x to'rtdan kichik» deb o'qish eng ko'p uchraydigan xato |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: had bir qismdan ikkinchisiga ko'chirilganda uning **ishorasi o'zgaradi**; ikkala qism manfiy songa bo'linsa tengsizlik ishorasi **buriladi**; qat'iy tengsizlikda chegara nuqtasi yechimga **kirmaydi** | bankda tuzoq: «ishorasi saqlanadi», «o'zgarmaydi» (З52), «kiradi» (З54). Uch tuzoq — uch adashish |
| 09 | C `TrueFalse` | 🔴 | `solution_claims` | `−4x ≤ 12` ning yechimi `x ≥ −3` — «to'g'ri» → Ha; `x < 7` ning eng katta yechimi 7 — «to'g'ri» → Yo'q | birinchisida manfiyga bo'lish TO'G'RI bajarilgan (З52 ning to'g'ri namunasi); ikkinchisida ikki xato birga: 7 yechim emas, va bunday tengsizlikning eng katta yechimi UMUMAN yo'q |
| 10 | I `SwapOrder` | 🔴 | `solve_steps` | `5 − 2x < 11`: hadni o'ngga ko'chiramiz (`−2x < 6`) → ikkala tomonni −2 ga bo'lamiz va ishorani buramiz → `x > −3` → tekshiramiz: `x = 0` da `5 < 11` | ishorani burishni tekshirishdan keyinga qoldirish; ko'chirishda ishorani saqlash (T3). Oxirgi qadam З16 |

**Qoplov.** T1 — 05, 06, 10. T2 — 01, 02, 04, 06, 07, 09, 10. T3 — 05, 08, 10.
З52 — 05, 06, 08, 09, 10. З54 — 01, 02, 03, 08, 09. З16 — 09, 10 va razborlar.
**Oldingi blokdan** — 07: `4 < x` ni teskari o'qish 23-darsning З49 si.

**Harf.** Hamma joyda x — darslik chiziqli tengsizlikni x bilan yozadi. Chegara sonlari
takrorlanmaydi. Takrorlanmaydigan narsa — TENGSIZLIKLAR.

---

## 8. DARS 26 — BIR NOMA'LUMLI TENGSIZLIKLAR SISTEMASI

Tasdiqlar `Dars26.jsx` dan: T1 — HAR IKKI tengsizlikni to'g'ri qiladigan qiymat sistemaning
yechimi; T2 — sistemani yechish yechimlarni topish yoki YO'QLIGINI aniqlash demak;
T3 — har tengsizlik alohida yechiladi, keyin ikki yechim to'g'ri chiziqda kesishtiriladi.
Adashishlar: З16, З54 (chegara nuqtasi noto'g'ri kiritildi), З55 (kesishtirish o'rniga
birlashtirildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `both_true_marked` | Sistema: `x > 1` va `x < 6`. Yechim bo'lgan 3 ta sonni belgilang: `2`, `4`, `5,5` | `1`, `6` (chegaralar, tengsizliklar QAT'IY — З54), `0` (faqat ikkinchisini qanoatlantiradi — З55 ning ildizi). T1 |
| 02 | B `Zones` | 🟢 | `in_or_out` | Sistema: `x ≥ −2` va `x ≤ 3`. 8 son ikki zonaga: YECHIM / YECHIM EMAS. Yechim: `−2`, `0`, `3`, `2,5`; emas: `−3`, `4`, `−2,5`, `10` | bu yerda chegaralar KIRADI, 01-topshiriqda esa kirmagan edi — farq faqat belgining ostidagi chiziqda (З54) |
| 03 | C `TrueFalse` | 🟢 | `system_claims` | `x > 5` va `x > 2` sistemasining yechimi `x > 5` — «to'g'ri» → Ha; `x > 5` va `x < 2` sistemasining yechimi bor — «to'g'ri» → Yo'q | birinchisi: ikki nurdan tor turgani qoladi (T3); ikkinchisi: kesishma bo'sh, va bu ham JAVOB (T2) |
| 04 | D `PairSlots` | 🟡 | `range_to_count` | Uch juft: `1<x<5 ↔ 3`; `−1<x<4 ↔ 4`; `0<x<2 ↔ 1` | butun yechimlarni sanash. Chegaralar QAT'IY, ya'ni 1 va 5 sanalmaydi (З54). Kartalarda yozuv bo'shliqsiz — §0a.3 |
| 05 | A `Choice` | 🟡 | `system_solution` | `x − 1 > 0` va `x + 2 < 6` sistemasining yechimi: **`1 < x < 4`** | `x > 1` (faqat birinchisi — З55), `x < 4` (faqat ikkinchisi), «yechim yo'q». Har tengsizlikni alohida yechish shart (T3) |
| 06 | G `CodeLock` | 🟡 | `code_integers` | `−2 < x ≤ 1` sistemasining BUTUN yechimlarini o'sish tartibida kodga yozing → **−1, 0, 1** | bankda `−2` (chap chegara qat'iy, kirmaydi), `2`, `−3`. O'ng chegara esa KIRADI: bitta yozuvda ikki xil chegara (З54) |
| 07 🖼 | E `TypeValue` | 🟡 | `count_integers` | `−3 ≤ x < 4` sistemasining nechta butun yechimi bor → **7**. Yuqorida CHIZMA: −4 dan 5 gacha son o'qi, bo'linmalar ochiq | `6` (chap chegara sanalmadi), `8` (ikkala chegara ham sanaldi), `5`. Chizma sanaladigan narsani ko'rsatadi, chegara qaysi tomonga kirishini o'quvchi hal qiladi |
| 08 | I `SwapOrder` | 🔴 | `system_steps` | `x − 2 > 0` va `x + 1 < 7` sistemasi: birinchi tengsizlikni yechamiz (`x > 2`) → ikkinchisini yechamiz (`x < 6`) → ikki yechimni to'g'ri chiziqda kesishtiramiz → javobni yozamiz (`2 < x < 6`) | kesishtirishni ikkinchi tengsizlikdan OLDIN qo'yish: kesishtiradigan narsa hali yo'q. Razbor З55 ni aytadi |
| 09 | H `ClozeBank` | 🔴 | `rule_words` | qoida: sistemaning yechimi — **har ikki** tengsizlikni to'g'ri qiladigan qiymat; har tengsizlik **alohida** yechiladi, keyin yechimlar to'g'ri chiziqda **kesishtiriladi** | bankda tuzoq: «kamida bitta» (З55 ning ta'rifdagi ildizi), «birga», «birlashtiriladi» (З55 ning o'zi) |
| 10 | J `MatchPairs` | 🔴 | `system_to_answer` | To'rt sistema ↔ to'rt javob: `x>2, x<5` ↔ `2<x<5`; `x>2, x>5` ↔ `x>5`; `x<2, x<5` ↔ `x<2`; `x>5, x<2` ↔ «yechim yo'q» | to'rt sistemada O'SHA ikki son, farq faqat tengsizlik belgilarida. To'rt xil natija: oraliq, nur, nur, bo'sh to'plam (T2, T3, З55) |

**Qoplov.** T1 — 01, 02, 09. T2 — 03, 05, 10. T3 — 03, 05, 08, 09, 10.
З54 — 01, 02, 04, 06, 07. З55 — 01, 05, 08, 09, 10. З16 — razborlar sonni IKKALA
tengsizlikka qo'yib tekshiradi.
**Oldingi blokdan** — 05 va 08 da har tengsizlik 25-darsning usuli bilan yechiladi.

**Harf.** Hamma joyda x. Sonlar takrorlanmaydi: 01 da 1 va 6, 02 da −2 va 3, 03 da 5 va 2,
04 da uch xil oraliq, 05 da 1 va 4, 06 da −2 va 1, 07 da −3 va 4, 08 da 2 va 6, 10 da 2 va 5.

---

## 9. DARS 27 — SONLI ORALIQLAR VA ULARNING BELGILANISHI

Tasdiqlar `Dars27.jsx` dan: T1 — `a ≤ x ≤ b` to'plami kesma, `[a; b]`; T2 — `a < x < b`
to'plami interval, `(a; b)`; T3 — `a ≤ x < b` yoki `a < x ≤ b` to'plami yarim-interval,
bitta chegara kiradi, ikkinchisi chiqarib tashlanadi.
Adashishlar: З16, З54 (chegara nuqtasi noto'g'ri kiritildi), З56 (qavs turi tengsizlikning
qat'iyligiga mos kelmadi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `interval_claims` | `[2; 5]` — «2 bu to'plamga kiradi» → Ha; `(2; 5)` — «2 bu to'plamga kiradi» → Yo'q | З56 eng qisqa shaklda: ikki yozuvda o'sha sonlar, farq faqat QAVSDA |
| 02 | E `TypeValue` | 🟢 | `count_integers_in` | `[−1; 3]` oralig'ida nechta butun son bor → **5** | `3` (chegaralar sanalmadi), `4`, `6`. Kvadrat qavs ikkala chegarani ham kiritadi (T1) |
| 03 | F `MarkAll` | 🟢 | `belongs_marked` | `(−3; 4]` ga tegishli 3 ta sonni belgilang: `0`, `4`, `−2,5` | `−3` (chap chegara, dumaloq qavs — kirmaydi), `5`, `−4`. Bitta yozuvda ikki xil qavs — T3 ning o'zi |
| 04 | D `PairSlots` | 🟡 | `notation_to_included` | Uch juft: `[2;5] ↔ 2 va 5`; `(2;5) ↔ yo'q`; `[2;5) ↔ 2` | uch yozuvda o'sha ikki son. Javob — QAYSI chegara to'plamga kiradi (T1, T2, T3 bir juftlikda). Kartalarda yozuv bo'shliqsiz — §0a.3 |
| 05 | B `Zones` | 🟡 | `three_inside` | 8 karta ikki zonaga: 3 SONI KIRADI / 3 SONI KIRMAYDI. Kiradi: `[3;8]`, `(1;3]`, `[0;3]`, `(2;4)`; kirmaydi: `(3;8)`, `(1;3)`, `[0;3)`, `[4;9]` | З54 va З56 birga: birinchi uch juftlikda o'sha sonlar, farq faqat qavsning turida. `[4;9]` esa umuman boshqa joyda turadi |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: `a ≤ x ≤ b` to'plami **kesma** deyiladi va **kvadrat qavs** bilan yoziladi; `a < x < b` to'plami esa **interval** deyiladi | bankda tuzoq: «yarim-interval», «dumaloq qavs», «oraliq» (umumiy so'z — uchalasi ham oraliq, ya'ni bu javob hech narsani aytmaydi) |
| 07 | A `Choice` | 🟡 | `inequality_to_interval` | `−1 ≤ x < 6` ni oraliq bilan yozing: **`[−1; 6)`** | `(−1; 6]` (ikkala qavs almashdi), `[−1; 6]`, `(−1; 6)`. Sof З56: har belgi o'z qavsini talab qiladi |
| 08 | I `SwapOrder` | 🔴 | `write_interval_steps` | `x ≥ −2` va `x < 5` yechimini oraliq bilan yozish: chegaralarni yozamiz (`−2 va 5`) → qat'iyligini aniqlaymiz (`≥ va <`) → qavslarni tanlaymiz (`[ va )`) → oraliqni yozamiz (`[−2; 5)`) | qavsni qat'iylikni aniqlashdan OLDIN tanlash — o'shanda tanlash taxminga aylanadi (З56) |
| 09 🖼 | J `MatchPairs` | 🔴 | `interval_to_picture` | To'rt yozuv ↔ to'rt CHIZMA (son o'qi, 0 va 3): `[0;3]` ↔ ikki to'la doiracha; `(0;3)` ↔ ikki bo'sh doiracha; `[0;3)` ↔ chapda to'la, o'ngda bo'sh; `(0;3]` ↔ chapda bo'sh, o'ngda to'la | to'rt chizmada o'sha ikki nuqta, farq faqat doirachaning ICHIDA. `spans` bo'lsa, ular orasidagi to'plam ham qalin chiziq bilan ko'rinadi — §0a.2 |
| 10 | G `CodeLock` | 🔴 | `code_smallest_integer` | Uch oraliqning ENG KICHIK butun sonini o'sish tartibida kodga yozing: `(−4; 0]` (−3), `[1; 5)` (1), `(2; 9)` (3) → kod **−3, 1, 3** | bankda `−4` (dumaloq qavs, kirmaydi), `2`, `0`. Birinchi oraliqda chap chegara kirmaydi, ikkinchisida kiradi — З54 ikki tomondan |

**Qoplov.** T1 — 01, 02, 04, 05, 06. T2 — 01, 04, 05, 06, 09. T3 — 03, 04, 07, 08, 09.
З54 — 02, 03, 05, 10. З56 — 01, 05, 06, 07, 08, 09. З16 — razborlar chegara sonini
tengsizlikka QO'YIB tekshiradi.
**Oldingi blokdan** — 08: yechim 25 va 26-darsning usuli bilan olinadi, bu yerda faqat
YOZILADI.

**Harf.** Hamma joyda x. Chegara sonlari takrorlanmaydi: 01 da 2 va 5, 02 da −1 va 3,
03 da −3 va 4, 05 da 3 atrofidagi to'rt juftlik, 07 da −1 va 6, 08 da −2 va 5, 09 da 0 va 3,
10 da uch xil oraliq.

---

## 10. DARS 28 — TENGSIZLIKLAR YORDAMIDA MASALALAR YECHISH

Tasdiqlar `Dars28.jsx` dan: T1 — noma'lum kattalik harf bilan belgilanadi, masala sharti
tengsizlikka aylantiriladi; T2 — tengsizlik yechiladi, yechim to'g'ri chiziqda topiladi;
T3 — yechimdan masala shartiga zid qiymatlar chiqarib tashlanadi.
Adashishlar: З16, З54 (chegara nuqtasi noto'g'ri kiritildi), З57 (shartga zid qiymat
chiqarib tashlanmadi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `condition_to_inequality` | Daftar 3000 so'm, Azizda 20000 so'm. Qaysi tengsizlik shartga mos: **`3000x ≤ 20000`** | `3000x ≥ 20000` (belgi teskari), `x + 3000 ≤ 20000` (ko'paytirish o'rniga qo'shish), `20000x ≤ 3000` (kattaliklar almashdi). T1 |
| 02 | C `TrueFalse` | 🟢 | `answer_claims` | «Yechim `x ≤ 6,6`, x — daftarlar soni, javob: 6 ta» → Ha; «Yechim `x ≥ −4`, x — tomon uzunligi, javob: `x ≥ −4`» → Yo'q | З57. Birinchisi to'g'ri chiqarib tashlashning namunasi, ikkinchisi — o'sha ishning bajarilmagani |
| 03 | B `Zones` | 🟢 | `fits_condition` | `given`: x — o'quvchilar soni. 8 qiymat ikki zonaga: BO'LISHI MUMKIN / BO'LISHI MUMKIN EMAS. Mumkin: `12`, `1`, `30`, `7`; mumkin emas: `−12`, `0,5`, `−1`, `7,5` | З57. Ikki sabab: manfiy son (odam soni) va KASR son (yarim o'quvchi yo'q). Kartalar juft-juft |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: noma'lum kattalik **harf** bilan belgilanadi; masala sharti **tengsizlikka** aylantiriladi; yechimdan shartga **zid** qiymatlar chiqarib tashlanadi | bankda tuzoq: «son», «tenglamaga» (21-darsning ishi, bu yerda emas), «mos» (З57: mos qiymatlarni tashlash — teskarisi) |
| 05 | E `TypeValue` | 🟡 | `max_count` | Bitta qalam 2500 so'm, Nodirada 17000 so'm. Eng ko'pi bilan nechta qalam oladi → **6** | `7` (`17000 : 2500 = 6,8` yuqoriga yaxlitlandi — pul yetmaydi), `8`, `5`. T2 va T3: javob BUTUN bo'lishi va yechimdan chiqmasligi kerak |
| 06 | G `CodeLock` | 🟡 | `code_min_values` | Uch shartning eng kichik BUTUN qiymatini o'sish tartibida kodga yozing: `x > 4,2` (5), `2x ≥ 14` (7), `x + 3 > 12` (10) → kod **5, 7, 10** | bankda `4`, `6`, `9`. Birinchi va uchinchi tengsizlik QAT'IY, ikkinchisi emas: `x ≥ 7` da 7 ning o'zi yaraydi, `x > 9` da 9 yaramaydi (З54) |
| 07 | I `SwapOrder` | 🟡 | `word_steps` | To'rt qadam: `x` — daftarlar soni deb belgilaymiz → shartdan tengsizlik tuzamiz (`3000x ≤ 20000`) → tengsizlikni yechamiz (`x ≤ 6,6`) → butun sonli javobni tanlaymiz (`x = 6`) | oxirgi qadamni tashlab ketish — o'shanda javob «olti butun oltidan o'n daftar» bo'lib qoladi (З57). T1, T2, T3 bir qatorda |
| 08 | D `PairSlots` | 🔴 | `solution_to_answer` | Uch juft: `x≤6,6 ↔ 6`; `x≥6,6 ↔ 7`; `x≤−2 ↔ yo'q` | yaxlitlash YO'NALISHINI tengsizlik belgisi hal qiladi: bir yozuvda pastga, ikkinchisida yuqoriga. Uchinchisida javob umuman yo'q (son manfiy bo'lolmaydi, З57) |
| 09 🖼 | F `MarkAll` | 🔴 | `valid_answers_marked` | `given`: x — avtobusdagi yo'lovchilar soni, yechim `x < 4,5`. Mos keladigan 3 ta qiymatni belgilang: `1`, `3`, `4`. Yuqorida CHIZMA: `x < 4,5` ning surati | `4,5` (chegara, qat'iy — З54), `5`, `−2` (З57). Ikki xil sabab bilan rad etish bir topshiriqda |
| 10 | J `MatchPairs` | 🔴 | `words_to_inequality` | To'rt ibora ↔ to'rt tengsizlik: «kamida 5 ta» ↔ `x ≥ 5`; «ko'pi bilan 5 ta» ↔ `x ≤ 5`; «5 tadan ko'p» ↔ `x > 5`; «5 tadan kam» ↔ `x < 5` | masala tilining butun og'irligi shu yerda: to'rt ibora bir songa ishora qiladi, ammo to'rt xil to'plamni beradi. «Kamida» va «ko'p» ni chalkashtirish — T1 ning eng qimmat xatosi |

**Qoplov.** T1 — 01, 04, 07, 10. T2 — 05, 06, 07, 09. T3 — 02, 03, 05, 07, 08, 09.
З54 — 06, 09. З57 — 02, 03, 04, 07, 08, 09. З16 — 05 va razborlar javobni masalaning
o'ziga qo'yib tekshiradi (olti qalam 15000 so'm, yetti qalam 17500 so'm).
**Oldingi blokdan** — 06 va 09 dagi tengsizliklar 25-darsning usuli bilan yechiladi.

**Harf.** Hamma joyda x, chunki masalada noma'lum bitta. Ismlar o'zbekcha: Aziz (01, 07),
Nodira (05). Takrorlanmaydigan narsa — MASALALAR.

---

## 11. DARS 29 — SONNING MODULI. MODUL QATNASHGAN TENGLAMA VA TENGSIZLIKLAR

Tasdiqlar `Dars29.jsx` dan: T1 — `|a| = a`, agar `a ≥ 0`; `|a| = −a`, agar `a < 0`;
T2 — `|x| = a` (a > 0) tenglamaning ikkita ildizi bor; T3 — `|x| ≤ a` tengsizlik
`−a ≤ x ≤ a` ga, `|x| ≥ a` esa `x ≤ −a` yoki `x ≥ a` ga teng.
Adashishlar: З16, З58 (faqat musbat ildiz yozildi), З59 (`|x| ≥ a` kesma sifatida yozildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `equals_five_marked` | Qiymati 5 ga teng 3 ta yozuvni belgilang: `|−5|`, `|5|`, `|2 − 7|` | `−|5|`, `−|−5|`, `|2| − |7|` — uchalasining ham qiymati MINUS besh. Modul ichidagi ayirma va modullar ayirmasi bir xil emas (T1) |
| 02 | B `Zones` | 🟢 | `four_or_minus_four` | 8 karta ikki zonaga: QIYMATI 4 / QIYMATI −4. To'rt: `|4|`, `|−4|`, `|1 − 5|`, `|−4 − 0|`; minus to'rt: `−|4|`, `−|−4|`, `−|1 − 5|`, `0 − |4|` | modul belgisining OLDIDAGI minus modul ichiga kirmaydi. Kartalar juft-juft (T1) |
| 03 | A `Choice` | 🟢 | `abs_equation` | `|x| = 7` tenglamaning ildizlari: **7 va −7** | `7` (З58 aynan shu), `−7`, «ildiz yo'q». T2: moduli yettiga teng ikki son bor |
| 04 | J `MatchPairs` | 🟡 | `abs_to_set` | To'rt yozuv ↔ to'rt javob: `|x| = 3` ↔ «3 va −3»; `|x| ≤ 3` ↔ `−3 ≤ x ≤ 3`; `|x| ≥ 3` ↔ «x ≤ −3 yoki x ≥ 3»; `|x| = −3` ↔ «yechim yo'q» | to'rt yozuvda o'sha uchlik, farq faqat BELGIDA. Uchinchisi ikki nur, ikkinchisi kesma (З59); to'rtinchisi — modul manfiy bo'lolmaydi |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: manfiy bo'lmagan sonning moduli **o'ziga** teng, manfiy sonning moduli unga **qarama-qarshi** songa teng; `|x| ≥ a` tengsizlikning yechimi **ikki nur** bo'ladi | bankda tuzoq: «nolga», «teng», «kesma» (З59 aynan shu so'zda yashaydi) |
| 06 | I `SwapOrder` | 🟡 | `abs_ineq_steps` | `|x − 1| ≤ 4`: qo'sh tengsizlikka yozamiz (`−4 ≤ x − 1 ≤ 4`) → hamma qismga 1 qo'shamiz → `−3 ≤ x ≤ 5` → oraliq bilan yozamiz (`[−3; 5]`) | qo'sh tengsizlikka o'tishni qo'shishdan KEYIN qo'yish. Oxirgi qadam 27-darsning yozuvi (T3) |
| 07 🖼 | E `TypeValue` | 🟡 | `count_integers_abs` | `|x| < 3` tengsizlikning nechta butun yechimi bor → **5**. Yuqorida CHIZMA: −4 dan 4 gacha son o'qi | `6` (chegaralar sanaldi — tengsizlik qat'iy), `3` (faqat musbat tomon — З58), `7`. Yechimlar: −2, −1, 0, 1, 2 |
| 08 | G `CodeLock` | 🔴 | `code_negative_roots` | Uch tenglamaning MANFIY ildizini o'sish tartibida kodga yozing: `|x| = 6` (−6), `|x| = 1` (−1), `|x − 2| = 5` (−3) → kod **−6, −3, −1** | bankda `6`, `1`, `3` — uchalasi ham musbat ildizlar (З58). Uchinchisida ildizlar −3 va 7: modul ichida ayirma turganda ikki ildiz nolga simmetrik EMAS |
| 09 | C `TrueFalse` | 🔴 | `abs_claims` | `|x| ≥ 2` ning yechimi `[−2; 2]` — «to'g'ri» → Yo'q; `|x| ≤ 0` ning yagona yechimi `x = 0` — «to'g'ri» → Ha | birinchisi З59 ning aynan o'zi: to'g'ri javob — ikki nur, kesmaning TASHQARISI. Ikkinchisi chegara holi: moduli noldan katta bo'lmagan yagona son — nol |
| 10 | D `PairSlots` | 🔴 | `abs_to_answer` | Uch juft: `|x|=4 ↔ ±4`; `|x|<4 ↔ (−4;4)`; `|x|=−4 ↔ yo'q` | uch yozuvda o'sha to'rtlik, farq belgida. Javoblar uch xil turda: ikki son, oraliq, bo'sh to'plam. Kartalarda yozuv bo'shliqsiz — §0a.3 |

**Qoplov.** T1 — 01, 02, 05. T2 — 03, 04, 08, 10. T3 — 04, 05, 06, 07, 09, 10.
З58 — 03, 07, 08. З59 — 04, 05, 09. З16 — razborlar javobni modulga QO'YIB tekshiradi.
**Oldingi blokdan** — 06 va 10 da javob oraliq bilan yoziladi (27-dars), 07 da butun
yechimlar sanaladi (26-dars).

**Harf.** Hamma joyda x. Sonlar takrorlanmaydi: 01 da 5, 02 da 4, 03 da 7, 04 da 3,
07 da 3 (boshqa belgi bilan), 08 da 6, 1 va 5, 09 da 2 va 0, 10 da 4.

---

## 12. DARS 30 — TAQRIBIY HISOBLASHLAR VA XATOLIKLAR

Tasdiqlar `Dars30.jsx` dan: T1 — aniq qiymat x, taqribiy qiymat a bo'lsa, `|x − a|` absolut
xatolik; T2 — `x = a ± h` yozuvi `a − h ≤ x ≤ a + h` degani; T3 — absolut xatolikning
taqribiy qiymat moduliga nisbati nisbiy xatolik, u ANIQLIKNI taqqoslash uchun ishlatiladi.
Adashishlar: З16, З60 (absolut va nisbiy xatolik aralashtirildi), З61 (yaxlitlash noto'g'ri
yo'nalishda qilindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `error_claims` | Aniq qiymat 3,1416, taqribiy qiymat 3,14; absolut xatolik 0,0016 — «to'g'ri» → Ha; absolut xatolik manfiy bo'lishi mumkin — «to'g'ri» → Yo'q | T1: ta'rifda MODUL turadi, ya'ni xatolik manfiy bo'lolmaydi. Qaysi qiymatdan qaysinisi ayirilishi ahamiyatsiz — modul tenglashtiradi |
| 02 | F `MarkAll` | 🟢 | `in_range_marked` | `x = 20 ± 0,5`. x qabul qila oladigan 3 ta qiymatni belgilang: `19,6`, `20`, `20,5` | `19,4`, `21`, `20,6`. `20,5` chegara va u KIRADI: `±` yozuvi qat'iy bo'lmagan tengsizlik beradi (T2) |
| 03 | A `Choice` | 🟢 | `round_direction` | `2,236…` ni yuzdan birgacha yaxlitlang: **2,24** | `2,23` (З61: keyingi raqam olti, ya'ni yuqoriga yaxlitlanadi), `2,2`, `2,3` (o'ndan birgacha yaxlitlangan) |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: aniq va taqribiy qiymatlar ayirmasining **moduli** absolut xatolik deyiladi; uning taqribiy qiymat moduliga **nisbati** nisbiy xatolik deyiladi; nisbiy xatolik **aniqlikni** taqqoslash uchun ishlatiladi | bankda tuzoq: «yig'indisi», «ko'paytmasi», «kattalikni» (З60: nisbiy xatolik kattalikni emas, ANIQLIKNI taqqoslaydi) |
| 05 | B `Zones` | 🟡 | `absolute_or_relative` | 8 karta ikki zonaga: ABSOLUT XATOLIK / NISBIY XATOLIK. Absolut: `|x − a|`, `0,02 sm`, `1 kg`, `0,5 m`; nisbiy: `|x − a| : |a|`, `2%`, `0,5%`, `0,01` | З60. Farqni BIRLIK ochib beradi: absolut xatolik o'lchov birligida yoziladi, nisbiy xatolik esa birliksiz yoki foizda |
| 06 | G `CodeLock` | 🟡 | `code_bounds` | `x = 7 ± 0,2`. Kodga eng kichik qiymat, taqribiy qiymat va eng katta qiymatni SHU TARTIBDA yozing → **6,8; 7; 7,2** | bankda `6,2`, `7,02`, `8`. Kod tartibi «o'sish» emas — savol tartibni ochiq aytadi. `0,2` ni `0,02` bilan almashtirish — o'nli kasrning eng ko'p uchraydigan xatosi (T2) |
| 07 | D `PairSlots` | 🟡 | `record_to_lower` | Uch juft: `5±0,1 ↔ 4,9`; `5±0,2 ↔ 4,8`; `5±0,5 ↔ 4,5` | uch yozuvda o'sha taqribiy qiymat, farq faqat h da. Javob — pastki chegara, ya'ni `a − h` (T2). Kartalarda yozuv bo'shliqsiz — §0a.3 |
| 08 | J `MatchPairs` | 🔴 | `measure_to_relative` | To'rt o'lchov ↔ to'rt nisbiy xatolik: `10 ± 1` ↔ `10%`; `100 ± 1` ↔ `1%`; `50 ± 1` ↔ `2%`; `200 ± 1` ↔ `0,5%` | to'rt o'lchovda ABSOLUT xatolik bir xil — bitta. Nisbiy xatolik esa to'rt xil, chunki u o'lchanayotgan kattalikka bog'liq. З60 ning eng aniq ko'rinishi (T3) |
| 09 | I `SwapOrder` | 🔴 | `compare_precision_steps` | Ikki o'lchovning qaysi biri aniqroq: absolut xatoliklarni yozamiz → har birining nisbiy xatoligini hisoblaymiz → nisbiy xatoliklarni taqqoslaymiz → aniqrog'ini aytamiz | absolut xatoliklarni taqqoslab XULOSAGA o'tish — З60 aynan shu qadamda tug'iladi. Razbor 08-topshiriqning jadvaliga qaytadi |
| 10 | E `TypeValue` | 🔴 | `relative_percent` | `a = 25`, absolut xatolik `0,5`. Nisbiy xatolik necha foiz → **2** | `5` (0,5 ni to'g'ridan-to'g'ri foizga aylantirish), `20` (`25 : 0,5` teskari nisbat), `50`. Razbor: yarim bo'lingan yigirma besh — nol butun nol ikkidan, ya'ni ikki foiz |

**Qoplov.** T1 — 01, 04, 05. T2 — 02, 06, 07. T3 — 04, 05, 08, 09, 10.
З60 — 04, 05, 08, 09, 10. З61 — 03, 06. З16 — 10 va razborlar hisobni qayta bajaradi.
**Oldingi blokdan** — 02 va 07: `a ± h` yozuvi qo'sh tengsizlikka ochiladi (26-dars) va
29-darsning `|x − a| ≤ h` yozuvi bilan bir xil narsa.

**Harf.** `x` — aniq qiymat, `a` — taqribiy qiymat, `h` — chegara: darslikning yozuvi.
Sonlar takrorlanmaydi: 01 da 3,14, 02 da 20, 03 da 2,236, 06 da 7, 07 da 5, 08 da o'nlik
va yuzlik, 10 da 25.

---

## 13. HA/YO'Q TOPSHIRIQLARINING KOMBINATSIYASI

`DARS07_11_AMALIYOT_SKELET.md` §10 p. 9 (metodist qarori 2026-08-25) ha-yo'q
topshiriqlarida javob naqshi bo'lishini taqiqlaydi: agar har darsda bittasi «ha»,
bittasi «yo'q» bo'lsa, o'quvchi matematikaga qaramay ikkalasini ham to'g'ri oladi.
O'sha hujjatdagi jadval 1-29 darslarni qamraydi, va 21-29 shu jadval bo'yicha
yig'ildi:

| Dars | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| | ha-ha | yo-yo | ha-yo | yo-yo | ha-ha | yo-ha | ha-yo | ha-ha | yo-ha | **ha-yo** |

**30-dars jadvalda yo'q**, chunki u 29 da tugaydi. Bu skeletda unga `ha-yo`
berildi: qo'shni 29-dars `yo-ha`, ya'ni kombinatsiya takrorlanmaydi. Jadvalning
davomi 31-darsdan boshlab keyingi blokda yoziladi.

Ikkinchi shart ham bajarildi: **adashish saqlanadi**. Javob o'zgarganda tuzoq
yo'qolmaydi, u faqat boshqa tugmaga olib boradi — masalan 22-darsda ikkala
yozuv ham yolg'on, lekin sabablari boshqa (ishora almashgan va bosh koeffitsiyent
tushib qolgan).

---
## 14. NIMA QILINMAYDI

1. **Umumiy qatlamga tegilmaydi** — bitta istisno bilan: `fig.jsx` ning `spans` maydoni,
   va u faqat metodist ruxsatidan keyin (§0a.2). `kit.jsx` ga yangi tip qo'shilmaydi,
   `PracticeHost.jsx` ga tegilmaydi, `plot.jsx` ochilmaydi.
2. **`NumberLine` tipi ishlatilmaydi.** U `kit.jsx` da bor (eski o'ntalikdan), lekin
   o'nlikka kirmaydi — mexanika faqat shu o'ntadan olinadi.
3. **Ovoz yo'q**, fon `#fff7ed`, urg'u `#fe5b1a` — dizayn 1-darsdagidek qoladi.
4. **Yangi adashish kodi kiritilmaydi.** Amaliyot nazariy darsning `MISS` idan oladi.
5. **LMS paketi yig'ilmaydi** (CLAUDE.md §5).

---

## 15. BAJARILDI: 2-3-4-ETAPLAR

Metodist tasdig'i 2026-08-25 dan keyin kontent, yig'ish va tekshiruv bajarildi.

**Nima yozildi.** `dars21/` … `dars30/` — har birida 11 jsx, jami 110 fayl;
`src/lessons/grade8.js` ga o'nta yozuv; `scripts/grade8-practice-plan.mjs` ga
`PLAN_21` … `PLAN_30` va `LESSONS` ning o'n qatori. Umumiy qatlamga bitta
qo'shimcha: `fig.jsx` ning `spans` maydoni (§0a.2 bo'yicha, additiv).

**Skeletdan to'rt og'ish, hammasi bir sababdan.** `PairSlots` va `Zones` karta
matnini TARJIMA QILMAYDI: `kit.jsx` da `card.v` va `item.tokens` to'g'ridan-to'g'ri
chiziladi, ular `L()` ni qabul qilmaydi. Skeletda o'sha kartalarda SO'Z turgan
joylar shu sababli matematikaga ko'chirildi — mazmun o'zgarmadi, ko'rinish
hamma tilda bir xil bo'ldi:

| Joy | Skeletda | Bajarildi |
|---|---|---|
| 22/04 | `t=16` ↔ «ikkita» | `t=16` ↔ `2` |
| 27/04 | yozuv ↔ qaysi chegara kiradi | yozuv ↔ TENGSIZLIK |
| 29/10 | `|x|=−4` ↔ «yo'q» | `|x|=0` ↔ `0` (bo'sh to'plam belgisi darsda o'rgatilmagan) |
| 30/05 | `0,02 sm`, `1 kg` | ayirma va bo'linma yozuvlari (birlik ruschada boshqa harf bilan yozilardi) |

**Razborlar qisqartirildi — bu o'lchov, did emas.** Birinchi tahrirda deyarli hamma
`correctText` `DARS12_14_AMALIYOT_SKELET.md` §6 p. 9 dagi budjetdan oshib ketgan edi,
va `grade8-practice-panel.mjs` telefonda (360px) matnning panel ostida qolganini
ko'rsatdi. 95 ta matn qayta yozildi: sakkiz kartali `Zones` va oltita kartali
`MarkAll` — 300 belgigacha, `MatchPairs`, `PairSlots`, `Choice`, `TrueFalse` va
chizmali topshiriq — 350, qolganlari — 450. Oltita kartali `MarkAll` da amaliy
chegara yanada tor chiqdi: 28/09 da chizma 182x34 ga kichraytirildi va razbor
130 belgiga tushirildi.

**Tekshiruv natijasi** (`npx vite --port 5199` turgan holda):

| Tekshiruv | Natija |
|---|---|
| `npm run build` | o'tdi |
| `grade8-practice-check.mjs`, to'g'ri yo'l | 21-30, telefon-kichik x uz/ru/en toza; noutbuk va telefon ham |
| `grade8-practice-check.mjs`, `G8_WRONG=1` | 21-30, telefon-kichik x uz/ru/en toza |
| `grade8-practice-panel.mjs`, ikki yo'l | eng katta qoldiq 7px — blokning ichki bo'shligi |
| `grade8-practice-noscroll.mjs` | 21-30 da gorizontal skroll yo'q |
| `grade8-practice-lang.mjs` | 415 fayl: UZ satrlarda kirillcha yo'q, apostroflar ASCII |
| `grade8-practice-seq.mjs check` | hamma shart bajarildi |

Push qilinmadi: metodistning ko'rigi kutiladi.
