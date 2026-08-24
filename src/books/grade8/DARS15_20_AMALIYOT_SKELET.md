# 8-SINF AMALIYOTI, 15-20 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-24: **15-20 darslarning amaliyoti 12-14 bilan bir xil qoida
bo'yicha yaratiladi** — 1-darsdagi AYNAN O'SHA o'nta mexanika, har darsda boshqa
ketma-ketlik, fon rangi va dizayn tegilmaydi.

Bu hujjat — 1-etap (skelet). Kontent 2-etapda, faqat skelet tasdiqlangandan keyin.
Oldingi hujjatlar: `DARS12_14_AMALIYOT_SKELET.md` (eng yaqin namuna, razbor uzunligi
budjeti ham o'sha yerda), `DARS07_11_AMALIYOT_SKELET.md` (o'nta mexanikaning kontrakti).

---

## 0. NIMA O'ZGARDI: NAZARIY DARSLAR PAYDO BO'LDI

12-14 darslar skeletida 15 va 16-dars **to'xtatib qo'yilgan** edi, va sababi bitta: ularning
nazariy darsi yo'q edi, amaliyot esa darsning `STATEMENTS` va `MISS` ini qoplashi shart
(TIPLAR §6). O'shanda tasdiqlarni amaliyot skeleti taklif qilishga majbur bo'lardi.

**Endi bu masala yo'q.** Repo'da `Dars15.jsx` … `Dars20.jsx` (va undan keyingilari ham)
paydo bo'ldi. Shu sababli bu skeletda hamma tasdiq va adashish **nazariy fayllardan aynan
olingan**, taklif qilinmagan:

| Dars | Mavzu (`META.topic`) | Tasdiqlar | Adashishlar |
|---:|---|---|---|
| 15 | Kvadrat tenglama va uning elementlari | `ax² + bx + c = 0`, a ≠ 0; a — bosh koeffitsiyent, b — ikkinchi, c — ozod had; ildiz — tenglamani to'g'ri qiladigan son | З16, З38, З39 |
| 16 | Chala kvadrat tenglamalar | b yoki c dan biri nol bo'lsa — chala tenglama; `ax² + c = 0` da ildiz borligi ISHORAGA bog'liq; `ax² + bx = 0` har doim ikki ildizli, biri nol | З16, З40, З41, З42, З43 |
| 17 | Kvadrat tenglama ildizlari formulasi | to'la kvadratni ajratish; `x₁,₂ = (−b ± √(b² − 4ac)) / 2a`; `b² − 4ac` — diskriminant | З16, З38, З40, З44 |
| 18 | Diskriminant va ildizlar soni | D > 0 — ikki TURLI ildiz; D = 0 — BITTA ildiz, yo'q emas; D < 0 — haqiqiy ildiz yo'q | З16, З9, З41 |
| 19 | Viyet teoremasi | `x² + px + q = 0` — keltirilgan tenglama; `x₁ + x₂ = −p`, `x₁ · x₂ = q`; munosabatlar teng ildizlarda ham to'g'ri | З16, З45, З46 |
| 20 | Kasr-ratsional tenglamalar | yechishdan oldin ruhsat etilgan qiymatlar topiladi; maxrajlarga ko'paytirilgan tenglama KO'PROQ ildizga ega bo'lishi mumkin; sohadan chetdagi ildiz begona deyiladi | З16, З2, З3 |

Yangi adashish kodi ham o'ylab topilmadi: З38-З46 ni nazariy darslarning o'zi kiritgan.

---

## 0a. IKKI TERMIN MASALASI — METODIST QARORI KERAK

**0a.1. `ODZ` degan qisqartma.** `ETALON_8SINF.md` §9.1 ni ochiq taqiqlaydi: «`ODZ` писать
запрещено», o'zbekcha shakli — `ruhsat etilgan qiymatlar (sohasi)`. `Dars20.jsx` ning UZ
tasdig'ida esa `ODZ` turadi («kasr-ratsional tenglama yechilishidan oldin ODZ topiladi»).

Bu amaliyotning qarori emas, nazariy darsning holati, lekin amaliyot o'sha so'zni
ishlatishi kerak bo'ladi. **Bu skeletda ETALON tanlangan**: 20-dars amaliyotida
`ruhsat etilgan qiymatlar` yoziladi, `ODZ` yozilmaydi. Agar metodist teskarisini aytsa —
`ETALON_8SINF.md` §9.1 tuzatiladi va ikki joy birga o'zgaradi. Hozircha nazariy dars bilan
amaliyot bu bitta so'zda ajralib turadi.

**0a.2. `koeffitsiyent` yoki `koeffitsient`.** Nazariy darslar (15-19) `koeffitsiyent` deb
yozadi — 46 marta, istisnosiz. 12-14 amaliyotida esa `koeffitsient` turgan edi (49 marta).
«Bitta tushuncha — bitta so'z» qoidasi bo'yicha 12-14 amaliyoti **sinf standartiga
keltirildi**: hamma joyda `koeffitsiyent`. Bu shu skelet bilan birga bajarilgan tuzatish.

---

## 1. KETMA-KETLIKLAR — OLTI DARS, IKKI UCHLIK

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 12 | C | E | B | H | D | J | I | F | A | G |
| 13 | A | B | F | C | J | H | G | D | E | I |
| 14 | F | A | C | G | H | B | D | E | I | J |
| **15** | C | F | B | J | I | D | H | E | A | G |
| **16** | A | E | F | G | H | I | D | B | C | J |
| **17** | F | A | E | B | G | C | I | J | D | H |
| **18** | C | B | E | F | J | A | G | I | D | H |
| **19** | F | E | C | H | G | I | D | A | B | J |
| **20** | A | C | F | G | D | E | I | H | J | B |

Kodlar: A `Choice`, B `Zones`, C `TrueFalse`, D `PairSlots`, E `TypeValue`, F `MarkAll`,
G `CodeLock`, H `ClozeBank`, I `SwapOrder`, J `MatchPairs`. Qiyinlik o'qi hamma darsda
o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴 — qiyinlikni **misol** beradi, mexanika emas.

**Nega ikki uchlik, olti emas.** «Har mexanika guruh ichida har xil pozitsiyada» degan
shart 1-3 pozitsiyalarda faqat besh tipdan tanlashga ruxsat beradi (A, B, C, E, F — og'ir
boshqaruv u yerda turmaydi). Olti darsli guruhda bu shart bajarilishi MUMKIN EMAS: beshta
tipni olti darsga takrorlanmasdan tarqatib bo'lmaydi. Shuning uchun 15-17 va 18-20 —
ikki alohida uchlik, va har uchlik ichida shart istisnosiz bajariladi.

**Skript kuchaytirildi** (`scripts/grade8-practice-seq.mjs`). 12-14 da tekshiruv «tartiblar
ustma-ust tushmasin» deganini o'lchagan edi, va shu yetmasligi shu yerda ko'rindi: izlash
18-darsga 15-darsning tartibini bergan — faqat oxirgi ikki pozitsiya almashgan holda.
Rasman boshqa tartib, amalda o'quvchi uchun O'SHA amaliyot. Endi ikki shart qo'shildi:

| Yangi shart | Qiymati |
|---|---|
| ikki tartib kamida shu qadar pozitsiyada farq qiladi | **6** (o'nlikning yarmidan ko'p) |
| birinchi UCHTALIK (head3) takrorlanmaydi | o'quvchi amaliyotni birinchi uch topshiriq bilan tanib oladi |

`node scripts/grade8-practice-seq.mjs check` natijasi: 15-17 va 18-20 guruhlari toza,
juftliklar toza. Skript ikki eski holatni ham ko'rsatadi va ular `ESKI` deb belgilanadi:

- **6 va 14-dars faqat 4 pozitsiyada farq qiladi** (`FACDHBJGIE` va `FACGHBDEIJ`), va
  birinchi uchtaligi ham bir xil. Bu 12-14 ishida ko'rinmagan, chunki o'shanda bunday
  o'lchov yo'q edi. Hozircha bu **amalda sezilmaydi**: 3-6 darslar hali ESKI o'ntalikda
  turadi (`DARS07_11_AMALIYOT_SKELET.md` §11), ya'ni 6-darsning mexanikalari boshqa. Agar
  3-6 yangi o'ntalikka ko'chirilsa, 14-darsning tartibi qayta hisoblanishi kerak.
- 5 va 9, 6 va 10, 10 va 14 — birinchi uchtaligi bir xil (`CBF`, `FAC`). Tarixiy holat.

---

## 2. CHIZMA: FAQAT BITTA JOYDA

12-14 da chizma bir joyda edi (14/07, son o'qi). Bu oltilikda ham xuddi shunday: mavzular
YOZUV va HISOB haqida — tenglamani standart shaklga keltirish, D ni hisoblash, ildizlarni
tanlash. Bunday joyda chizma mexanizmni ko'rsatmaydi, faqat bezaydi, va
`DINAMIKA_VA_ILLUSTRATSIYA.md` aynan shuni rad etadi.

| Dars | Topshiriq | Chizma nima qiladi |
|---:|---|---|
| 16 | 02 | son o'qi −4 dan 4 gacha, nolga simmetrik ikki `?`: `t²` bir songa teng bo'lganda o'qda IKKI nuqta paydo bo'ladi. Savol esa bittasini so'raydi — З40 («faqat musbat javob yozildi») shu farqda yashaydi. `?` lar belgilangan bo'linmalar ORASIDA turadi, javobni bermaydi |

Render — `practice/fig.jsx` ning `axis` speci, chizma `given` qatorida. Yangi `fig` turi
qo'shilmaydi. 18-darsda parabola chizmasi mantiqiy ko'rinardi, lekin `fig.jsx` da parabola
yo'q, va uni qo'shish umumiy qatlamga tegish degani — bu skeletda qilinmaydi (§8 p. 3).
D ning uch holi 18-darsda SON bilan tekshiriladi, chizma bilan emas.

---

## 3. DARS 15 — KVADRAT TENGLAMA VA UNING ELEMENTLARI

Tasdiqlar `Dars15.jsx` dan: T1 — `ax² + bx + c = 0`, a nolga teng emas; T2 — a bosh
koeffitsiyent, b ikkinchi koeffitsiyent, c ozod had; T3 — ildiz tenglamani to'g'ri qiladigan
son. Adashishlar: З16, З38 (a nolga teng bo'lishi mumkin deb o'ylandi), З39 (had
ko'chirilganda yoki standart shaklda bo'lmagan yozuvdan o'qilganda ishora yo'qoldi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `is_quadratic_claims` | `3x² − 5x + 2 = 0` — «kvadrat tenglama» → Ha; `0·x² + 4x − 1 = 0` — «kvadrat tenglama» → Yo'q | З38 eng ochiq ko'rinishda: kvadrat had YOZILGAN, lekin a nolga teng, ya'ni tenglama chiziqli |
| 02 | F `MarkAll` | 🟢 | `no_constant_marked` | 6 tenglamadan 3 tasida ozod had NOLGA teng: `2y² − 7y = 0`, `y² + 5y = 0`, `3y² = 0` | `y² − 9 = 0` (c = −9), `4y² + y − 1 = 0`, `√5y² + 2y − 1 = 0`. Oxirgisi ikki ish qiladi: c noldan farqli, va bosh koeffitsiyent IRRATSIONAL son bo'lishi mumkinligini ko'rsatadi (Б2 ga qaytish) |
| 03 | B `Zones` | 🟢 | `sign_of_b` | 8 karta ikki zonaga: ikkinchi koeffitsiyent MANFIY / MUSBAT. Manfiy: `p² − 3p + 1`, `2p² − p`, `−p² − 4p + 7`, `5p² − 10p − 2`; musbat: `p² + 3p − 1`, `3p² + p`, `−p² + 4p + 7`, `5p² + 10p − 2` | З39. Kartalar juft-juft: faqat b ning ishorasi farq qiladi. `−p² − 4p + 7` da bosh koeffitsiyent manfiy, lekin bu b ning ishorasini o'zgartirmaydi |
| 04 | J `MatchPairs` | 🟡 | `abc_to_equation` | to'rt uchlik ↔ to'rt tenglama: «1; −4; 3» ↔ `x² − 4x + 3 = 0`; «1; 4; 3» ↔ `x² + 4x + 3 = 0`; «1; −4; −3» ↔ `x² − 4x − 3 = 0`; «3; −4; 1» ↔ `3x² − 4x + 1 = 0` | to'rt tenglama faqat ISHORA va TARTIB bilan farq qiladi — З39 to'liq ochiladi |
| 05 | I `SwapOrder` | 🟡 | `standard_form_steps` | `2z(z − 3) = 5 − z` ni standart shaklga keltirish: qavsni ochamiz → hamma hadni chapga o'tkazamiz → o'xshash hadlarni yig'amiz → koeffitsiyentlarni yozamiz (`a = 2, b = −5, c = −5`) | koeffitsiyentlarni o'xshash hadlarni yig'ishdan OLDIN aytish (`b = −6`); o'tkazishda ishorani saqlamaslik — З39 |
| 06 | D `PairSlots` | 🟡 | `abc_pairs` | yuqorida bitta tenglama: `3x² − 8x + 5 = 0`. Uch juft: `a ↔ 3`, `b ↔ −8`, `c ↔ 5` | T2. Kartalar bir belgili, ya'ni kvadrat kartaga sig'adi. Tuzoq juftlashning o'zida: `b = 8` (ishora tushdi, З39), a bilan c ni almashtirish |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: `ax² + bx + c = 0` kvadrat tenglama deyiladi, bunda a **nolga teng emas**; a — **bosh koeffitsiyent**, c — **ozod had** | bankda tuzoq: «birga teng» (a = 1 shart emas), «ikkinchi koeffitsiyent», «ildiz» |
| 08 | E `TypeValue` | 🔴 | `find_c` | `t = 3` soni `t² − 5t + c = 0` ning ildizi. c ni toping → **6** | `−6` (ishora), `15`, `2`. T3 ning ta'rifi bo'yicha: to'qqiz minus o'n besh qo'shuv c nolga teng |
| 09 | A `Choice` | 🔴 | `which_quadratic_root` | `m = −3` qaysi KVADRAT tenglamaning ildizi: **`m² + m − 6 = 0`** | `0·m² + m + 3 = 0` — minus uch uni to'g'ri qiladi, lekin a nolga teng, ya'ni kvadrat tenglama emas (З38 + T3 bir joyda); `m² − m − 6 = 0` va `m² − 9m + 18 = 0` — kvadrat, lekin minus uch ildiz emas |
| 10 | G `CodeLock` | 🔴 | `code_abc` | `x(x + 6) = 7` ni standart shaklga keltirib, a, b, c ni SHU TARTIBDA kodga yozing → **1, 6, −7** | bankda `−6`, `7`, `−1`. Kod tartibi «o'sish» emas, a, b, c — savol shuni ochiq aytadi. Standart shaklga keltirmasdan o'qigan o'quvchi `c = 7` deb yozadi (З39) |

**Qoplov.** T1 — 01, 07, 09. T2 — 02, 03, 04, 05, 06, 07, 10. T3 — 08, 09.
З38 — 01, 07, 09. З39 — 03, 04, 05, 06, 10. З16 — razborlar ildizni tenglamaga QO'YIB
yoki koeffitsiyentni qayta o'qib tekshiradi.
**Oldingi blokdan** — 02 dagi `√5y² + 2y − 1 = 0`: bosh koeffitsiyent irratsional son
bo'lishi mumkin (Б2, 14-dars), va u nolga teng emas.

**Harf.** 01 va 04, 06, 10 da x (darslik yozuvi), 02 da y, 03 da p, 05 da z, 08 da t,
09 da m. Takrorlanmaydigan narsa — TENGLAMALAR: yuqoridagi qirqqa yaqin tenglamaning hech
biri darsda ikki marta uchramaydi.

---

## 4. DARS 16 — CHALA KVADRAT TENGLAMALAR

Tasdiqlar `Dars16.jsx` dan: T1 — b yoki c dan kamida bittasi nol bo'lsa, tenglama chala
kvadrat tenglama (uch ko'rinishi: `ax² = 0`, `ax² + c = 0`, `ax² + bx = 0`); T2 —
`ax² + c = 0` da ildiz borligi ISHORAGA bog'liq, chunki `x²` manfiy bo'lmaydi; T3 —
`ax² + bx = 0` har doim ikki ildizga ega va biri nolga teng.
Adashishlar: З16, З40 (faqat musbat javob yozildi), З41 (ishoraga qarab xato baholandi),
З42 (`x` ga bo'lib `x = 0` ildizi yo'qotildi), З43 (qaysi koeffitsiyent yo'qligi payqalmadi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `roots_of_incomplete` | `x² − 4x = 0` ning ildizlari: **x = 0 va x = 4** | `x = 4` (З42: x ga bo'lib yuborildi, nol yo'qoldi), `x = 0`, `x = −4` |
| 02 🖼 | E `TypeValue` | 🟢 | `positive_root` | `9t² − 36 = 0` ning MUSBAT ildizi → **2**. Yuqorida CHIZMA: −4 dan 4 gacha son o'qi, nolga simmetrik ikki `?` | `4` (`t² = 4` da to'xtash), `6` (36 dan ildiz, to'qqizga bo'lmasdan), `−2`. Chizma ikki nuqtani ko'rsatadi, savol bittasini so'raydi — З40 ga tayanch |
| 03 | F `MarkAll` | 🟢 | `incomplete_marked` | 6 tenglamadan 3 tasi chala: `3y² − 12 = 0`, `y² + 5y = 0`, `7y² = 0` | to'liq: `y² − 3y + 2 = 0`, `y² − y − 1 = 0`; kvadrat emas: `2y + 6 = 0`. З43: qaysi koeffitsiyent yo'qligini ko'rish kerak |
| 04 | G `CodeLock` | 🟡 | `code_largest_roots` | uch tenglamaning ENG KATTA ildizi o'sish tartibida: `t² + 8t = 0` (0 va −8 → 0), `5t² − 20t = 0` (0 va 4 → 4), `t² − 25 = 0` (±5 → 5) → kod **0, 4, 5** | birinchi tenglamada eng katta ildiz NOL — З42 ni to'g'ridan-to'g'ri tekshiradi. Bankda `−8`, `8`, `20` |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: `ax² + bx = 0` da umumiy ko'paytuvchi chiqariladi va **nol** har doim ildiz bo'ladi; `ax² + c = 0` da `x²` **manfiy** songa teng chiqsa ildiz yo'q; ikki tomonni x ga bo'lish ildizni **yo'qotadi** | bankda tuzoq: «musbat», «bir», «topadi» |
| 06 | I `SwapOrder` | 🟡 | `factor_steps` | `5z² − 15z = 0`: umumiy ko'paytuvchini chiqaramiz `5z(z − 3) = 0` → ko'paytma nolga aylanadi, agar ko'paytuvchidan biri nol bo'lsa → har birini nolga tenglaymiz → ikki ildizni yozamiz, `z = 0`, `z = 3` | ildizlarni nolga tenglashdan OLDIN yozish. Razbor З42 ni aytadi: z ga bo'lish yo'lini tanlagan o'quvchi nol ildizni yo'qotadi |
| 07 | D `PairSlots` | 🟡 | `count_of_roots` | uch juft: `p² = 9 ↔ ikkita`; `4p² = 0 ↔ bitta`; `p² = −9 ↔ yo'q` | uch yozuv bir-biriga o'xshab turadi, farqi ishora va o'ng tomon. З40 (`p² = 9` da ikki javob), З41 (`p² = −9` da ildiz izlash) |
| 08 | B `Zones` | 🔴 | `two_roots_or_none` | 8 karta ikki zonaga: «ikki ildizi bor» / «ildizi yo'q». Bor: `m² − 16 = 0`, `3m² − 27 = 0`, `m² − 5 = 0`, `2m² = 50`; yo'q: `m² + 16 = 0`, `m² + 1 = 0`, `4m² + 9 = 0`, `m² = −25` | З41. `m² − 16` va `m² + 16` yonma-yon: bitta ishora hammasini hal qiladi. `m² − 5 = 0` — ildizlari `±√5`, butun emas, LEKIN bor |
| 09 | C `TrueFalse` | 🔴 | `incomplete_claims` | `x² = 36` — «ikki ildizi bor» → Ha; `x² + 4x = 0` — «bitta ildizi bor» → Yo'q | З40 (ikki javob) va З42 (ikkita: nol va minus to'rt) |
| 10 | J `MatchPairs` | 🔴 | `equation_to_roots` | to'rt ma'lumot ↔ to'rt tenglama: «0 va 5» ↔ `2x² − 10x = 0`; «−7 va 7» ↔ `x² − 49 = 0`; «bitta ildiz — nol» ↔ `6x² = 0`; «ildiz yo'q» ↔ `x² + 9 = 0` | uch ko'rinishning uchtasi ham bir joyda (T1). «bitta ildiz» va «ildiz yo'q» ni aralashtirish; `x² − 49` va `x² + 9` da ishora hal qiladi (З41) |

**Qoplov.** T1 — 03, 05, 07, 10. T2 — 02, 07, 08, 09, 10. T3 — 01, 04, 05, 06, 09, 10.
З40 — 02, 07, 09. З41 — 05, 07, 08, 10. З42 — 01, 04, 05, 06, 09. З43 — 03.
З16 — razborlar ildizni qo'yib tekshiradi.
**Oldingi blokdan** — 08 dagi `m² − 5 = 0`: ildizlari irratsional sonlar (Б2, 13-14 dars),
lekin ular BOR — «chiroyli emas» degani «yo'q» degani emas.

**Harf.** 01, 09, 10 da x, 02 va 04 da t, 03 da y, 06 da z, 07 da p, 08 da m; 05 —
qoida. Ikki topshiriqda t takrorlanadi (02 va 04), boshqa hamma harf bir marta.

---

## 5. DARS 17 — KVADRAT TENGLAMA ILDIZLARI FORMULASI

Tasdiqlar `Dars17.jsx` dan: T1 — to'la kvadratni ajratish usuli chap qismni ikkihadning
to'la kvadratiga aylantiradi; T2 — `x₁,₂ = (−b ± √(b² − 4ac)) / 2a`; T3 — `b² − 4ac`
diskriminant deyiladi va D bilan belgilanadi.
Adashishlar: З16, З38 (a nolga teng bo'lishi mumkin deb o'ylandi, endi formula maxrajida),
З40 (plyus-minus unutildi), З44 (manfiy b ning ishorasi minus b qismida xato qo'llanildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `minus_b_marked` | 6 tenglamadan 3 tasida formulaning «minus b» qismi MUSBAT son beradi: `x² − 7x + 2 = 0`, `x² − x − 5 = 0`, `−x² − 4x + 1 = 0` | `2x² + 3x − 1 = 0`, `3x² + 8x = 0`, `x² + 6x + 9 = 0` — u yerda minus b manfiy. З44 ning tayanchi: minus b degani «minus belgisi», b ning ishorasi bilan birga hisoblanadi |
| 02 | A `Choice` | 🟢 | `roots_by_formula` | `x² − 6x + 5 = 0` ning ildizlari: **1 va 5** | `−1 va −5` (З44: minus b da ishora), `1 va 6`, `5 va 6` |
| 03 | E `TypeValue` | 🟢 | `find_D` | `2z² + 5z − 3 = 0` da D → **49** | `1` (`25 − 24`: c manfiy bo'lganda minus to'rt a c MUSBAT bo'ladi), `13`, `34` |
| 04 | B `Zones` | 🟡 | `perfect_square_zones` | 8 karta ikki zonaga: «to'la kvadrat bo'ladi» / «bo'lmaydi». Bo'ladi: `x² + 6x + 9`, `x² − 10x + 25`, `x² + 4x + 4`, `x² − 2x + 1`; bo'lmaydi: `x² + 6x + 8`, `x² − 10x + 24`, `x² + 4x + 5`, `x² − 2x + 3` | T1. Kartalar juft-juft: faqat ozod had farq qiladi, va shart bitta — c ikkinchi koeffitsiyentning yarmining kvadratiga teng bo'lishi kerak |
| 05 | G `CodeLock` | 🟡 | `code_D` | uch tenglamaning D si o'sish tartibida: `x² + 2x + 7` (−24), `4x² − 4x + 1` (0), `2x² + 3x − 2` (25) → kod **−24, 0, 25** | bankda `−4`, `1`, `36`. Manfiy D va nol D bir kodda turadi — 18-darsga tayanch |
| 06 | C `TrueFalse` | 🟡 | `formula_claims` | `x² − 3x − 4 = 0 → D = 25` — «to'g'ri» → Ha; `x² + 5x + 6 = 0 → (5 ± 1) : 2` — «to'g'ri» → Yo'q | ikkinchisida З44: b musbat bo'lganda suratda MINUS besh turishi kerak, ya'ni `(−5 ± 1) : 2` |
| 07 | I `SwapOrder` | 🟡 | `square_steps` | `x² + 8x − 9 = 0` ni to'la kvadrat bilan yechish: ozod hadni o'ngga → ikkala tomonga o'n olti qo'shamiz → chap tomon to'la kvadrat `(x + 4)² = 25` → ildiz olamiz, `x + 4 = ±5` | T1. Ildiz olish qadamida plyus-minus tushib qolsa bitta ildiz yo'qoladi (З40). Ildiz olish — Б2 ning ishi |
| 08 | J `MatchPairs` | 🔴 | `equation_to_roots` | to'rt tenglama ↔ to'rt ildiz juftligi: `x² − 5x + 6 = 0` ↔ «2 va 3»; `x² + 5x + 6 = 0` ↔ «−2 va −3»; `x² − x − 6 = 0` ↔ «−2 va 3»; `x² + x − 6 = 0` ↔ «2 va −3» | to'rt tenglamada bir xil sonlar, farqi faqat ISHORALARDA — З44 to'liq ochiladi. Ildizlarni qo'yib tekshirish shart |
| 09 | D `PairSlots` | 🔴 | `D_pairs` | yuqorida `D = b² − 4ac`. Uch juft: `1; 2; −8 ↔ 36`; `1; −2; 5 ↔ −16`; `1; 4; 4 ↔ 0` | c ning ishorasi D ni KATTALASHTIRADI (birinchi juftlik), b ning ishorasi esa D ga ta'sir qilmaydi (b kvadratga oshadi) — ikkinchi juftlik shuni ko'rsatadi |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: formulaning suratida **minus b** turadi, undan keyin **plyus-minus** belgisi va ildiz; maxrajda esa **ikki a** turadi | bankda uch tuzoq — uchta adashish: «b» (З44), «plyus» (З40), «a» (З38: maxraj ikki a, va a nolga teng bo'lolmaydi) |

**Qoplov.** T1 — 04, 07. T2 — 02, 06, 07, 08, 10. T3 — 03, 05, 06, 09, 10.
З44 — 01, 02, 06, 08, 10. З40 — 07, 10. З38 — 10. З16 — razborlar ildizni tenglamaga
qo'yadi yoki D ni qayta hisoblaydi.
**Oldingi blokdan** — 07: `(x + 4)² = 25` dan ildiz olish qadami Б2 ning ishi, va u
plyus-minus bilan bajariladi.

**Harf.** Asosan x — formulaning o'zi x bilan yozilgan (`Dars17.jsx` T2). 03 da z,
09 da harf yo'q (koeffitsiyentlar uchligi), 10 — qoida. Takrorlanmaydigan narsa —
TENGLAMALAR.

---

## 6. DARS 18 — DISKRIMINANT VA ILDIZLAR SONI

Tasdiqlar `Dars18.jsx` dan: T1 — D > 0 bo'lsa ikkita TURLI ildiz; T2 — D = 0 bo'lsa BITTA
ildiz, ildiz yo'q emas; T3 — D < 0 bo'lsa haqiqiy ildiz yo'q.
Adashishlar: З16, З9 (D va ildizlar soni chalkashtirildi, «D nolga teng — ildiz yo'q»),
З41 (D manfiy bo'lganda ildiz bor-yo'qligi xato baholandi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `D_zero_claims` | `D = 0` — «bitta ildiz bor» → Ha; `D = −4` — «bitta ildiz bor» → Yo'q | З9 to'g'ridan-to'g'ri: nol bilan manfiy bir xil emas. Nolda plyus-minus YO'QOLADI, ildiz esa qoladi |
| 02 | B `Zones` | 🟢 | `by_D_sign` | 8 karta ikki zonaga: «ildiz bor» / «ildiz yo'q». Bor: `D = 9`, `D = 0`, `D = 1`, `D = 100`; yo'q: `D = −1`, `D = −9`, `D = −16`, `D = −100` | З9 va З41: `D = 0` birinchi zonaga tushadi. Kartalar juft-juft (9 va −9, 1 va −1, 100 va −100) — faqat ishora farq qiladi |
| 03 | E `TypeValue` | 🟢 | `count_roots` | `x² − 6x + 9 = 0` tenglamaning nechta ildizi bor → **1** | `0` (З9), `2`, `3`. D nolga teng, va bu «ildiz yo'q» degani emas |
| 04 | F `MarkAll` | 🟡 | `two_roots_marked` | 6 tenglamadan 3 tasida IKKI TURLI ildiz bor: `y² − 5y + 4 = 0` (D = 9), `2y² + 3y − 2 = 0` (D = 25), `y² + y − 1 = 0` (D = 5) | `y² − 4y + 4 = 0` va `3y² − 6y + 3 = 0` (D = 0, bitta ildiz), `y² + 2y + 5 = 0` (D = −16). `y² + y − 1` da D = 5 — ildizlar irratsional, lekin IKKITA |
| 05 | J `MatchPairs` | 🟡 | `D_to_count` | to'rt ma'lumot ↔ to'rt tenglama: «ikki turli ildiz» ↔ `x² − 7x + 6 = 0`; «bitta ildiz» ↔ `x² + 6x + 9 = 0`; «ildiz yo'q» ↔ `x² + x + 3 = 0`; «ikki ildiz, biri nol» ↔ `x² − 7x = 0` | oxirgisi chala tenglama (16-dars): D ni hisoblamasdan ham ko'rinadi, lekin D = 49 ham shuni aytadi |
| 06 | A `Choice` | 🟡 | `how_many_roots` | `3x² − 12x + 12 = 0` tenglamaning nechta ildizi bor: **bitta** | `ikkita`, `yo'q` (З9), `uchta`. Koeffitsiyentlar katta, D = 144 − 144 |
| 07 | G `CodeLock` | 🟡 | `code_D_values` | uch tenglamaning D si o'sish tartibida: `x² + 2x + 7` (−24)… — **17-darsdagi kod bilan bir xil bo'lmasin**: bu yerda `x² + 4x + 9` (−20), `x² − 6x + 9` (0), `x² − 3x − 10` (49) → kod **−20, 0, 49** | bankda `−4`, `9`, `58`. Uch hol bir kodda: manfiy, nol, musbat |
| 08 | I `SwapOrder` | 🔴 | `count_steps` | `2x² − 6x + 5 = 0` da ildizlar sonini aniqlash tartibi: koeffitsiyentlarni yozamiz (`a = 2, b = −6, c = 5`) → D ni hisoblaymiz `36 − 40` → `D = −4` → D manfiy, haqiqiy ildiz yo'q | xulosani D dan OLDIN qo'yish: o'shanda javob taxmin bo'ladi. Razbor З16 ni aytadi |
| 09 | D `PairSlots` | 🔴 | `count_pairs` | uch juft, a va b bir xil, faqat c o'zgaradi: `1; −8; 16 ↔ bitta`; `1; −8; 7 ↔ ikkita`; `1; −8; 20 ↔ yo'q` | bitta son ildizlar sonini hal qiladi: D = 0, 36, −16. З9 va З41 bir joyda |
| 10 | H `ClozeBank` | 🔴 | `rule_words` | qoida: D noldan katta bo'lsa **ikki turli** ildiz bor; D nolga teng bo'lsa **bitta** ildiz bor; D noldan kichik bo'lsa **haqiqiy ildiz yo'q** | bankda tuzoq: «ikki bir xil», «ildiz yo'q» (З9 aynan shu yerda), «cheksiz ko'p» |

**Qoplov.** T1 — 02, 04, 05, 09, 10. T2 — 01, 03, 05, 06, 09, 10. T3 — 01, 02, 05, 08,
09, 10. З9 — 01, 02, 03, 06, 10. З41 — 02, 05, 08, 09. З16 — 08 va razborlar.
**Oldingi blokdan** — 04 dagi `y² + y − 1 = 0`: D = 5, ildizlari irratsional (Б2), lekin
ikkitasi bor; va 05 dagi `x² − 7x = 0` — chala tenglama (16-dars).

**Harf.** 01 va 02 da faqat D, 03, 05, 06, 07, 08 da x, 04 da y, 09 da koeffitsiyentlar,
10 — qoida.

---

## 7. DARS 19 — VIYET TEOREMASI

Tasdiqlar `Dars19.jsx` dan: T1 — `x² + px + q = 0` keltirilgan kvadrat tenglama deyiladi;
T2 — `x₁ + x₂ = −p`, `x₁ · x₂ = q`; T3 — bu munosabatlar teng ildizlarda (D = 0) ham
to'g'ri. Adashishlar: З16, З45 (ikkinchi koeffitsiyentning ishorasi yig'indiga
to'g'ridan-to'g'ri ko'chirildi), З46 (ikkinchi ildiz ko'paytmadan yoki yig'indidan to'g'ri
aniqlanmadi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `reduced_marked` | 6 tenglamadan 3 tasi keltirilgan (bosh koeffitsiyent bir): `y² − 4y + 3 = 0`, `y² + 3y − 10 = 0`, `y² − 9 = 0` | `2y² − 5y + 6 = 0`, `3y² + y − 2 = 0`, `−y² + 4y − 3 = 0`. Oxirgisi tuzoq: bosh koeffitsiyent minus bir, ya'ni birga teng EMAS |
| 02 | E `TypeValue` | 🟢 | `sum_of_roots` | `x² − 11x + 24 = 0` ildizlarining yig'indisi → **11** | `−11` (З45: p ning ishorasi to'g'ridan-to'g'ri ko'chirildi), `24`, `13`. Ildizlarni topish shart emas — yig'indi minus p ga teng |
| 03 | C `TrueFalse` | 🟢 | `vieta_claims` | `x² + 5x + 6 = 0` — «ildizlar yig'indisi minus besh» → Ha; o'sha tenglama — «ildizlar ko'paytmasi minus olti» → Yo'q | ikki qoida yonma-yon: YIG'INDI ishorani almashtiradi, KO'PAYTMA esa yo'q (З45) |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: keltirilgan tenglamada bosh koeffitsiyent **birga teng**; ildizlar yig'indisi **minus p** ga, ko'paytmasi esa **q** ga teng | bankda tuzoq: «nolga teng», «p» (З45), «minus q» |
| 05 | G `CodeLock` | 🟡 | `code_small_roots` | uch tenglamaning KICHIK ildizi o'sish tartibida: `x² − 5x + 6 = 0` (2), `x² − 8x + 15 = 0` (3), `x² − 8x + 16 = 0` (4) → kod **2, 3, 4** | bankda `5`, `6`, `15` — kattaroq ildizlar va q qiymatlari. Uchinchi tenglamada ildizlar TENG (D = 0), va Viyet u yerda ham ishlaydi: to'rt qo'shuv to'rt sakkiz, to'rt karra to'rt o'n olti (T3) |
| 06 | I `SwapOrder` | 🟡 | `vieta_steps` | `x² + 2x − 15 = 0` ni tanlash usuli bilan yechish: yig'indi minus ikki, ko'paytma minus o'n besh → ko'paytma manfiy, demak ildizlar ishorasi har xil → o'n beshning juftliklari: 1 va 15, 3 va 5 → yig'indi minus ikki beradigan juftlik: 3 va −5 | З46: juftlikni ko'paytma bo'yicha topib, yig'indi bilan tekshirmaslik. Ishora tahlilini oxirga surish |
| 07 | D `PairSlots` | 🟡 | `pq_pairs` | uch juft: `2 va 5 ↔ p = −7`; `−2 va 5 ↔ p = −3`; `2 va −5 ↔ p = 3` | З45 to'liq: ikki juftlikning ko'paytmasi bir xil (minus o'n), ularni faqat p ajratadi. Yig'indi p ning TESKARISI |
| 08 | A `Choice` | 🔴 | `find_second_root` | `x² − 3x + q = 0` ning bir ildizi 5. Ikkinchisi: **−2** | `2` (З45: yig'indini minus uch deb olish), `8`, `−8`. Yig'indi uchga teng, demak ikkinchi ildiz uch minus besh |
| 09 | B `Zones` | 🔴 | `same_or_different_sign` | 8 karta ikki zonaga: ildizlar «bir xil ishorada» / «har xil ishorada». Bir xil: `x² − 7x + 12`, `x² + 7x + 12`, `x² − 4x + 4`, `x² + 8x + 7`; har xil: `x² − x − 12`, `x² + x − 12`, `x² − 6x − 7`, `x² + 6x − 7` | ishorani KO'PAYTMA hal qiladi, ya'ni q ning ishorasi; p ning ishorasi esa chalg'ituvchi. `x² − 4x + 4` da ildizlar teng (T3) |
| 10 | J `MatchPairs` | 🔴 | `roots_to_equation` | to'rt ildiz juftligi ↔ to'rt tenglama: «1 va 6» ↔ `x² − 7x + 6 = 0`; «−1 va −6» ↔ `x² + 7x + 6 = 0`; «−1 va 6» ↔ `x² − 5x − 6 = 0`; «1 va −6» ↔ `x² + 5x − 6 = 0` | teskari teorema. To'rt tenglamada bir xil sonlar, farqi ishoralarda: yig'indi p ni, ko'paytma q ni belgilaydi (З45 va З46 birga) |

**Qoplov.** T1 — 01, 04. T2 — 02, 03, 04, 05, 06, 07, 08, 09, 10. T3 — 05, 09.
З45 — 02, 03, 04, 07, 08, 10. З46 — 06, 08, 10. З16 — razborlar ildizlarni tenglamaga
qo'yib tekshiradi.
**Oldingi blokdan** — 01 dagi `y² − 9 = 0`: chala kvadrat tenglama (16-dars), va u ham
keltirilgan.

**Harf.** 01 da y, qolganlarida x — Viyet teoremasining yozuvi `x₁` va `x₂` bilan berilgan
(`Dars19.jsx` T2), shuning uchun harf mavzuning o'zidan keladi. Takrorlanmaydigan narsa —
TENGLAMALAR.

---

## 8. DARS 20 — KASR-RATSIONAL TENGLAMALAR

Tasdiqlar `Dars20.jsx` dan: T1 — yechishdan oldin ruhsat etilgan qiymatlar topiladi; T2 —
maxrajlarga ko'paytirilgan tenglama asl tenglamadan KO'PROQ ildizga ega bo'lishi mumkin;
T3 — sohadan chetga chiqqan ildiz begona ildiz deyiladi va javobga kiritilmaydi.
Adashishlar: З16, З2 (soha kuzatuvi yo'qotildi), З3 (begona ildiz qabul qilindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `which_forbidden` | `3 / (x − 4) = 1` da x qanday qiymatni qabul qila olmaydi: **4** | `−4` (ishora), `3` (suratdagi son), `0`. T1 |
| 02 | C `TrueFalse` | 🟢 | `extraneous_claims` | `x/(x − 3) = 3/(x − 3)` — «x = 3 ildiz bo'ladi» → Yo'q; `1/y = 1/5` — «y = 5 ildiz» → Ha | З3: uchda maxraj nolga aylanadi, demak uch ildiz emas — tenglikni tekshirib ham bo'lmaydi |
| 03 | F `MarkAll` | 🟢 | `allowed_marked` | 6 kasrdan 3 tasida `y = 3` RUXSAT etilgan: `5/(y − 7)`, `3/(y + 2)`, `y/(y² + 1)` | `4/(y − 3)`, `1/(y² − 9)`, `6/(2y − 6)` — uchtasi ham uchda nolga aylanadi, lekin uch xil ko'rinishda: chiziqli, kvadratlar ayirmasi, qavsdan chiqadigan ikki |
| 04 | G `CodeLock` | 🟡 | `code_forbidden` | uch tenglamaning taqiqlangan qiymati o'sish tartibida: `1/(x − 5) = 2` (5), `3/(x + 1) = x` (−1), `4/(2x − 6) = 1` (3) → kod **−1, 3, 5** | bankda `−5`, `1`, `6`. Uchinchisida maxrajni avval ko'paytuvchilarga ajratish kerak: ikki karra x minus uch |
| 05 | D `PairSlots` | 🟡 | `frac_to_ban` | uch juft: `2/(m − 9) ↔ m = 9`; `5/(m + 4) ↔ m = −4`; `8/m² ↔ m = 0` | Б1 ning ishi tenglama kontekstida. Ishora (`m + 4` ning noli minus to'rtda) va kvadratli maxraj (`m²` ning noli faqat nolda) |
| 06 | E `TypeValue` | 🟡 | `solve_frac` | `12/(x + 1) = 3` tenglamani yeching → **3** | `4` (`x + 1 = 4` da to'xtash), `35`, `−5`. Javobni qo'yib tekshirish: o'n ikki bo'lingan to'rt uch |
| 07 | I `SwapOrder` | 🟡 | `solve_steps` | `(x² − 16)/(x − 4) = 0` ni yechish tartibi: shartni yozamiz `x ≠ 4` → maxrajga ko'paytiramiz `x² − 16 = 0` → ildizlarni topamiz `x = 4`, `x = −4` → shart bilan solishtiramiz: to'rt begona, javob minus to'rt | darsning butun mantig'i bir qatorda. Shartni OXIRGA surish — З2: o'shanda begona ildiz javobga kirib ketadi |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: yechishdan oldin maxrajni nolga aylantiradigan qiymatlar **chiqarib tashlanadi**; maxrajlarga ko'paytirilgandan keyin tenglama **ko'proq** ildizga ega bo'lishi mumkin; sohadan chetga chiqqan ildiz **begona** deyiladi | bankda tuzoq: «qo'shiladi», «kamroq», «asosiy» |
| 09 | J `MatchPairs` | 🔴 | `equation_to_answer` | to'rt tenglama ↔ to'rt javob: `(x² − 1)/(x − 1) = 0` ↔ «x = −1»; `(x² − 1)/(x + 1) = 0` ↔ «x = 1»; `(x² − 4)/(x − 2) = 0` ↔ «x = −2»; `(x² − 4)/(x + 2) = 0` ↔ «x = 2» | to'rt tenglamada surat ikki marta takrorlanadi, javobni esa MAXRAJ hal qiladi: qaysi ildiz begona bo'lib chiqadi. З3 to'liq ochiladi |
| 10 | B `Zones` | 🔴 | `banned_at_two` | yuqorida `x = 2`. 8 karta ikki zonaga: «taqiqlangan» / «ruxsat etilgan». Taqiqlangan: `1/(x − 2)`, `3/(x² − 4)`, `5/(2x − 4)`, `x/(x² − 2x)`; ruxsat etilgan: `1/(x + 2)`, `3/(x² + 4)`, `5/(2x + 4)`, `x/(x² + 2x)` | 03 dan farqi: bu yerda maxrajni AJRATISH kerak — `x² − 2x` bu `x(x − 2)`, `2x − 4` bu `2(x − 2)`, `x² − 4` bu `(x − 2)(x + 2)`. Kartalar juft-juft, faqat ishora farq qiladi |

**Qoplov.** T1 — 01, 03, 04, 05, 07, 08, 10. T2 — 07, 08, 09. T3 — 02, 07, 08, 09.
З2 — 07, 08, 10. З3 — 02, 07, 09. З16 — 06 va razborlar javobni tenglamaga qo'yadi.
**Oldingi blokdan** — 05: kasrning taqiqi Б1 ning (1-6 dars) ishi, endi u tenglamaning
bir qadami bo'lib qaytadi.

**Harf.** 01, 02, 04, 06, 07, 09, 10 da x, 02 ning ikkinchi mulohazasi va 03 da y, 05 da m.
`ODZ` so'zi yozilmaydi — §0a.1 ga ko'ra `ruhsat etilgan qiymatlar`.

---

## 9. UMUMIY QOIDALAR (oltala darsga)

1. **Uch til**: UZ (`siz`, ASCII `'`), RU (`ты`), EN. UZ satrida kirill yo'q.
2. **Razbor har xato yo'lga alohida**, javobni aytmaydi va SON bilan rad etadi. Bu
   oltilikda son bilan rad etishning shakli bitta: **ildizni tenglamaga QO'YIB** ko'rish
   (15, 16, 17, 19, 20) yoki **D ni qayta hisoblash** (18).
3. **`kit.jsx` ga yangi tip qo'shilmaydi, `frac.jsx` va `fig.jsx` tegilmaydi.** Chizma —
   mavjud `axis` speci (§2). Faqat ma'lumot fayllari va yig'uvchilar yoziladi: dars boshiga
   11 fayl, olti darsga **66 fayl**.
4. **Dizayn tegilmaydi**: fon `#fff7ed`, urg'u `#fe5b1a`, `S` / `C` / `HFB` / `Head`
   qatlami, chip qatori — o'sha.
5. **Reyestr**: `src/lessons/grade8.js` ning `grade8Amaliy` iga olti yozuv
   (`dars15-amaliyot` … `dars20-amaliyot`).
6. **Tekshiruv**: `scripts/grade8-practice-plan.mjs` ga `PLAN_15` … `PLAN_20`, keyin
   `grade8-practice-check.mjs` ikki yo'lda ham toza (10/10 va 0/10 + bo'sh bo'lmagan
   razbor, 5 o'lcham × 3 til), va `grade8-practice-panel.mjs` ikki telefonda ham 0 joy.
7. **`TypeValue` faqat BUTUN son oladi.** Shu sababli 17-darsda ildizlar formulasi bilan
   yechish TypeValue ga berilmadi (javob ko'pincha kasr): u yerda TypeValue D ni so'raydi.
   16/02 da javob 2, 20/06 da 3 — ikkalasi ham butun.
8. **`PairSlots` kartasi kvadrat** (76px), demak yozuv qisqa: `a`, `−8`, `p = −7`,
   `m = 9`, `2/(m − 9)`, `1; −8; 16` sig'adi. Uzun tenglama sig'maydi — shuning uchun
   15/06 va 17/09 da tenglama `given` qatorida turadi, kartalarda esa faqat harf va son.
9. **Razborning uzunligi** — `DARS12_14_AMALIYOT_SKELET.md` §6 p. 9 dagi budjet kuchda:
   sakkiz kartali `Zones` va oltita kartali `MarkAll` — 300 belgigacha (RU), `MatchPairs`,
   `PairSlots`, chizmali topshiriq va to'rt so'zli `Choice` — 350 gacha, qolganlari — 450
   gacha. Budjet yetmasa tafsilot `wrongs` ga ko'chadi.
10. **TIPLAR §6 ning majburiy janr tarkibi** (`odz`, `audit`, `build`, `boundary`) bu
    oltilikda ham bajarilmaydi: metodist o'nta MEXANIKANI belgilagan, bu o'nlikda o'sha
    tiplar yo'q. Chetlanish ochiq yozilgan. Oxirgi janr — «oldingi blokdan» — har darsda
    bajarilgan (§3-§8 dagi oxirgi qator).

---

## 10. PARALLEL SESSIYA — TEGILMAYDIGAN FAYLLAR

Repo'da 8-sinfning NAZARIY darslari bo'yicha boshqa ish ketmoqda: `Dars15.jsx` …
`Dars55.jsx` shu kunda paydo bo'ldi, `ETALON_8SINF.md`, `DARSLAR_REJASI_8SINF.md` va
`TIPLAR_AMALIYOT_8SINF.md` ham o'zgargan. Shuning uchun bu ishda TEGILMAYDI:

- `src/components/grade8/Dars*.jsx` — nazariy darslar (faqat O'QILADI: tasdiqlar va
  adashishlar shulardan olinadi);
- `ETALON_8SINF.md`, `TIPLAR_AMALIYOT_8SINF.md`, `DARSLAR_REJASI_8SINF.md`;
- `practice/kit.jsx`, `practice/frac.jsx`, `practice/fig.jsx`, `practice/PracticeHost.jsx`;
- `practice/dars01` … `practice/dars11`.

Ikki umumiy fayl — `src/lessons/grade8.js` va `scripts/grade8-practice-plan.mjs` — ikki
sessiyaga ham kerak. Ularga yozish oxirgi qadamda va faylni QAYTA O'QIB bajariladi.

---

## 11. NIMA TASDIQLANISHI KERAK

1. **§1 jadvali** — olti ketma-ketlik, ikki uchlik, va skriptning ikki yangi sharti
   (MIN_DIFF 6 va takrorlanmaydigan boshlanish).
2. **§0a.1** — 20-dars amaliyotida `ODZ` emas, `ruhsat etilgan qiymatlar` yoziladi
   (ETALON §9.1). Nazariy `Dars20.jsx` da `ODZ` turgani ochiq qoladi.
3. **§0a.2** — `koeffitsiyent` shakli sinf standarti, 12-14 amaliyoti unga keltirildi.
4. **§2** — chizma faqat 16/02 da; 18-darsda parabola chizmasi QO'SHILMAYDI, chunki u
   umumiy qatlamga tegishni talab qiladi.
5. **§3-§8** — oltmish topshiriqning mazmuni.
6. **§9 p. 10** — janr tarkibining bajarilmasligi (1-dars bilan bir xil chetlanish).

Tasdiqdan keyin 2-etap: kontent, sborka, reyestr, tekshiruv rejasi va QA — darsma-dars,
15-darsdan.
