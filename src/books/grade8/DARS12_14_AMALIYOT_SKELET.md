# 8-SINF AMALIYOTI, 12-14 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-24: **12-14 darslarning har biri 1-darsdagi AYNAN O'SHA o'nta
mexanikadan foydalanadi, lekin har darsda ketma-ketlik boshqacha. Fon rangi va dizayn o'z
holicha qoladi.**

Bu hujjat — 1-etap (skelet). Kontent (uch tilda matn va razborlar) 2-etapda yoziladi,
faqat skelet tasdiqlangandan keyin. Oldingi hujjatlar: `DARS02_06_AMALIYOT_SKELET.md`,
`DARS07_11_AMALIYOT_SKELET.md` — o'nta mexanikaning kontrakti va tekshirilgan eslatmalari
o'sha yerda, bu hujjat ularni takrorlamaydi.

---

## 0. NEGA 14-DARSGACHA, VA OCHIQ MASALA YO'Q

Skeletning birinchi qoralamasi **12-16** darslarni qamragan edi. Metodist qarori
2026-08-24: **hozircha faqat 14-darsgacha**, 15 va 16-dars TO'XTATIB QO'YILDI. Ularning
qoralamasi bu hujjatdan chiqarildi — u tasdiqlanmagan edi, va qaytganda §8 dagi ikki
qadam bilan qaytadan yoziladi.

Qaror bir vaqtda uchta ochiq masalani ham yopdi, va bu tasodif emas:

| Masala | Nega yopildi |
|---|---|
| tasdiqlar qaydan olinadi | 12, 13, 14-darsning NAZARIY darsi bor (`Dars12.jsx`, `Dars13.jsx`, `Dars14.jsx`), `STATEMENTS` va `MISS` aynan o'sha fayllardan olindi. 15 va 16-darsning nazariy darsi hali yo'q edi, va ularning tasdiqlarini amaliyot skeleti taklif qilishga majbur bo'lardi |
| yangi adashish kodlari | kerak emas. 12-14 darslar ishlatadigan hamma kod allaqachon mavjud: З4, З16, З32, З34, З35, З36, З37. Yangi З38-З41 faqat kvadrat tenglamalar uchun kerak edi |
| terminologiya | draft so'z yo'q. `ratsional son`, `irratsional son`, `davriy onli kasr` — `Dars14.jsx` da allaqachon ishlatilgan; `kvadrat tenglama`, `ozod had`, `bosh koeffitsient` esa 15-16 darslar bilan birga qoldirildi |

Ya'ni **bu skeletda metodist qaroriga qoldirilgan savol yo'q**: uch dars ham mavjud
nazariy darslarning ustiga qurilgan. Tasdiqlanishi kerak bo'lgani — mazmunning o'zi (§8).

---

## 1. KETMA-KETLIKLAR — UCH DARS, UCH XIL TARTIB

Kodlar `DARS07_11_AMALIYOT_SKELET.md` §1 dan: A `Choice`, B `Zones`, C `TrueFalse`,
D `PairSlots`, E `TypeValue`, F `MarkAll`, G `CodeLock`, H `ClozeBank`, I `SwapOrder`,
J `MatchPairs`.

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 (etalon) | A | B | C | D | E | F | G | H | I | J |
| 2 | C | A | B | E | D | F | G | J | H | I |
| 3 | F | C | E | J | B | I | A | D | G | H |
| 4 | A | F | C | H | G | E | B | I | J | D |
| 5 | C | B | F | I | A | J | D | H | E | G |
| 6 | F | A | C | D | H | B | J | G | I | E |
| 7 | F | C | B | E | J | A | H | G | D | I |
| 8 | A | F | E | D | C | J | B | H | I | G |
| 9 | C | B | F | H | A | I | E | D | G | J |
| 10 | F | A | C | G | B | H | I | J | E | D |
| 11 | C | E | A | J | F | D | G | I | B | H |
| **12** | C | E | B | H | D | J | I | F | A | G |
| **13** | A | B | F | C | J | H | G | D | E | I |
| **14** | F | A | C | G | H | B | D | E | I | J |

Qiyinlik o'qi hamma darsda o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴. Qiyinlikni **misol** beradi,
mexanika emas.

**Raskladka qo'l bilan emas, skript bilan hisoblangan va TEKSHIRILGAN** (TIPLAR §7 p. 1):
`scripts/grade8-practice-seq.mjs`. `node scripts/grade8-practice-seq.mjs check` jadvalning
hamma shartini qaytadan o'lchaydi, `... find 15 2` esa keyingi guruh uchun tartib izlaydi.

| Shart | Bajarilishi |
|---|---|
| 1-pozitsiyada faqat yengil boshqaruv (A, C, F) | 12 — C, 13 — A, 14 — F: uchta tipning har biri bir marta, takrorlanish umuman yo'q |
| 1-3 pozitsiyalarda og'ir boshqaruv yo'q (D, G, H, I, J faqat 4-pozitsiyadan) | bajarildi |
| har mexanika uch darsda uch xil pozitsiyada | bajarildi, istisnosiz — uch dars uchun 1-pozitsiya ham takrorlanmadi |
| oxirgi pozitsiya har darsda boshqa | bajarildi: G, I, J |
| hech bir tartib 1-11 darslar bilan ustma-ust tushmaydi | o'n bir tartib bilan solishtirildi, ustma-ust tushish yo'q |
| yonma-yon bir xil mexanika | mumkin emas: har mexanika darsda bir marta turadi |

Skript **1-6 guruhini** ham o'lchaydi va u yerda «har mexanika besh xil pozitsiyada»
sharti buzilganini ko'rsatadi. Bu nuqson emas, tarix: o'sha shart 7-11 skeletida
kiritilgan, 1-6 tartiblari undan oldin yozilgan, va 3-6 darslar amalda hali eski
o'ntalikda turadi (`DARS07_11_AMALIYOT_SKELET.md` §11). Shuning uchun skript u guruhni
`ESKI` deb belgilaydi va nuqson sanamaydi.

---

## 2. CHIZMA: FAQAT BITTA JOYDA

7-11 darslarda chizma har darsda bor edi: mavzular grafik va son o'qi haqida edi.
12 va 13-dars esa **YOZUV haqida** — ildizni ko'paytuvchilarga ajratish, ildiz ostidan
chiqarish, ildiz ostiga kiritish. Bu yerda chizma mexanizmni ko'rsatmaydi, faqat bezaydi,
`DINAMIKA_VA_ILLUSTRATSIYA.md` esa aynan shuni rad etadi. Shuning uchun chizma bitta
joyda turadi — u yerda rasm so'z aytolmaydigan narsani aytadi:

| Dars | Topshiriq | Chizma nima qiladi |
|---:|---|---|
| 14 | 07 | son o'qi 1 dan 2 gacha, `?` belgisi bilan: irratsional sonning o'qda JOYI bor, yozuvi esa tugamaydi. Yaqinlashish — qo'shni nuqta, o'sha nuqta emas (З37) |

Render — `practice/fig.jsx` ning `axis` speci, chizma `given` qatorida (yozuvning bo'lagi,
yangi mexanika emas). Yangi `fig` turi qo'shilmaydi.

**14-dars aynan chizmani talab qiladigan dars.** Uning mavzusi — yozuvi tugamaydigan son.
So'z bilan aytilganda bu «yo'q narsa» bo'lib ko'rinadi; o'qda esa nuqta BOR va uni qo'shni
nuqtadan ajratib ko'rsatish mumkin. 12 va 13-darsda bunday joy yo'q: u yerda hamma narsa
yozuvning ichida sodir bo'ladi va son bilan tekshiriladi.

---

## 3. DARS 12 — KO'PAYTMADAN KVADRAT ILDIZ

Tasdiqlar va adashishlar `Dars12.jsx` dan: T1 — ko'paytmadan ildiz ildizlar ko'paytmasiga
teng, **ikkala ko'paytuvchi nomanfiy bo'lganda**; T2 — yig'indi uchun bunday xossa YO'Q,
ildiz hadlarga bo'linmaydi; T3 — xossa katta sonni qulay ko'paytuvchilarga ajratib
hisoblash imkonini beradi. Adashishlar: З4, З16, З32.

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `product_or_sum` | `√(4·25)` — «`√4 · √25` ga teng» → Ha; `√(9+16)` — «`√9 + √16` ga teng» → Yo'q | З4. Razbor son bilan: 10 va 2·5 teng; 5 va 3+4 teng emas |
| 02 | E `TypeValue` | 🟢 | `product_value` | `√(36·49)` → **42** | `13` (ildizlarni ko'paytirish o'rniga qo'shish), `1764` (ildiz olinmadi), `85` (36+49) |
| 03 | B `Zones` | 🟢 | `splits_or_not` | 8 karta ikki zonaga: «ikki ildizga ajratiladi» / «ajratib bo'lmaydi». Ajratiladi: `√(9·49)`, `√(16·81)`, `√(4·121)`, `√(25·144)`; ajratilmaydi: `√((−9)·(−4))`, `√((−16)·(−25))`, `√((−2)·(−50))`, `√((−1)·(−81))` | З32 — darsning 12-ekrani. Ikkinchi guruhda ko'paytma musbat va ildiz BOR, lekin ko'paytuvchilardan alohida ildiz olib bo'lmaydi. Ko'paytmaning qiymatiga qarab ajratgan o'quvchi shu yerda tutiladi |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: ko'paytmadan ildiz ildizlarning **ko'paytmasiga** teng, agar ikkala ko'paytuvchi ham **nomanfiy** bo'lsa; **yig'indi** uchun bunday xossa yo'q | bankda tuzoq: «yig'indisiga», «musbat» (nolni chiqarib tashlaydi), «ko'paytma» |
| 05 | D `PairSlots` | 🟡 | `split_pairs` | uch juft: `√(2·8) ↔ 4`; `√(3·27) ↔ 9`; `√(5·80) ↔ 20` | ko'paytuvchilarning O'ZI to'liq kvadrat emas — avval ko'paytirish kerak. Tuzoq: `2·8` dan 16 chiqarish (ildiz olinmadi), `2+8` |
| 06 | J `MatchPairs` | 🟡 | `value_to_record` | to'rt qiymat ↔ to'rt yozuv: «qiymati 8» ↔ `√(4·16)`; «12» ↔ `√(6·24)`; «14» ↔ `√(2·98)`; «25» ↔ `√(5·125)` | oson naqsh yo'q: `6·24` da ikkala ko'paytuvchi ham kvadrat emas. Tuzoq: `6+24`, «katta ko'paytuvchining yarmi» |
| 07 | I `SwapOrder` | 🟡 | `compute_steps` | `√4900` ni hisoblash tartibi: `4900 = 196·25` → `√196 · √25` → `14 · 5` → `70` | xulosani boshiga qo'yish; `4900 = 490·10` deb ajratib to'xtash — razbor T3 ni aytadi: ajratish QULAY bo'lishi kerak, ya'ni ko'paytuvchilar to'liq kvadrat |
| 08 | F `MarkAll` | 🔴 | `true_equality_marked` | 6 tenglikdan 3 tasi to'g'ri: `√(2·18) = 6`, `√(50·2) = 10`, `√(7·28) = 14` | `√(16+9) = 4+3` (З4), `√(5·5) = 25` (ildiz olinmadi), `√((−9)·(−16)) = √(−9)·√(−16)` (З32: chap tomonning qiymati bor, o'ng tomonning yo'q) |
| 09 | A `Choice` | 🔴 | `which_condition` | `√(x·y) = √x · √y` tenglik qaysi holda to'g'ri: **x va y ning ikkalasi ham nomanfiy bo'lganda** | `x·y` nomanfiy bo'lganda (З32, aynan 03 dagi holat), har qanday x va y da, x va y MUSBAT bo'lganda (nol chiqib qoladi) |
| 10 | G `CodeLock` | 🔴 | `code_products` | `√(12·3)`, `√(2·32)`, `√(20·45)` qiymatlari o'sish tartibida → kod **6, 8, 30** | bankda `36` (12·3, ildiz olinmadi), `15` (12+3), `65` (20+45) |

**Qoplov.** T1 — 01, 02, 03, 04, 05, 07, 09, 10. T2 — 01, 04, 08. T3 — 02, 06, 07, 10.
З4 — 01, 08. З32 — 03, 08, 09. З16 — hamma razbor javobni son bilan rad etadi.
**Oldingi blokdan** (TIPLAR §6, oxirgi janr) — 08 dagi `√((−9)·(−16))` va 09 dagi shart:
ikkisi ham 10-darsning «ildiz osti nomanfiy» qoidasiga qaytadi.

**Harf.** Dars sonli, harf faqat 09 da (x va y — xossaning umumiy yozuvi). Takrorlanmaydigan
narsa — YOZUVLAR: yuqoridagi o'ttizdan ortiq misolning hech biri darsda ikki marta
uchramaydi.

---

## 4. DARS 13 — ILDIZLI IFODALARNI O'ZGARTIRISH

Tasdiqlar `Dars13.jsx` dan: T1 — ildiz ostidan to'liq kvadrat bo'lgan ko'paytuvchini
chiqarish mumkin; T2 — ildizli hadlar ildiz ostilari BIR XIL bo'lganda qo'shiladi;
T3 — har qanday o'zgartirishni javobni kvadratga oshirib tekshirish mumkin.
Adashishlar: З4, З16, З32, З34.

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` | 🟢 | `take_out` | `√50` nimaga teng: **`5√2`** | `2√5` (kvadrati 20), `25√2` (1250), `5√10` (250) — razbor har birini KVADRATGA OSHIRIB rad etadi (T3) |
| 02 | B `Zones` | 🟢 | `same_radicand` | 8 karta ikki zonaga: «hadlar qo'shiladi» / «qo'shilmaydi». Qo'shiladi: `2√3 + 5√3`, `7√5 − 2√5`, `4√2 + √2`, `6√7 − 3√7`; qo'shilmaydi: `√2 + √3`, `√5 + √7`, `3√2 + 3√5`, `√6 − √10` | З34 ning eng oddiy ko'rinishi: ildiz osti bir xilmi yoki yo'qmi. Razborda `√2 + √3 = √5` yozuvi SON bilan rad etiladi (1,41 + 1,73 va 2,23) — З4 ham shu yerda |
| 03 | F `MarkAll` | 🟢 | `correct_transform_marked` | 6 tenglikdan 3 tasi to'g'ri: `√45 = 3√5`, `√98 = 7√2`, `4√2 = √32` | `√20 = 2√10` (kvadrat ko'paytuvchi noto'g'ri tanlandi), `√8 = 4√2` (`√8 = 2√2`), `√13 + √13 = √26` (З34). `4√2` bir kartada to'g'ri, boshqasida yolg'on tomonda turadi — yozuvni tanib olish yetmaydi, hisoblash kerak |
| 04 | C `TrueFalse` | 🟡 | `add_and_sign` | `√18 + √2` — «`4√2` ga teng» → Ha; `−3√2` — «`√18` ga teng» → Yo'q | T2 (`3√2 + √2`) va З32: chap tomon manfiy, arifmetik ildiz esa manfiy bo'lmaydi. Manfiy koeffitsient ildiz ostiga KIRMAYDI |
| 05 | J `MatchPairs` | 🟡 | `sum_to_result` | to'rt tavsif ↔ to'rt yozuv: «koeffitsienti 5, ildiz ostida 2» ↔ `√8 + √18`; «4 va 3» ↔ `√27 + √3`; «2 va 5» ↔ `√80 − √20`; «5 va 7» ↔ `√28 + √63` | ikki tavsifda koeffitsient 5 — faqat koeffitsientga qarab bo'lmaydi. Hamma to'rt yozuvda ildiz ostilari BOSHQACHA ko'rinadi, avval chiqarish kerak (З34); `√8 + √18 = √26` degan yo'l razborda son bilan rad etiladi (З4) |
| 06 | H `ClozeBank` | 🟡 | `rule_words` | qoida: ildiz ostidan **to'liq kvadrat** bo'lgan ko'paytuvchi chiqariladi; hadlar **ildiz ostilari** bir xil bo'lganda qo'shiladi; o'zgartirish javobni **kvadratga oshirib** tekshiriladi | bankda tuzoq: «har qanday ko'paytuvchi», «koeffitsientlari», «ikkiga bo'lib» |
| 07 | G `CodeLock` | 🟡 | `code_coefficients` | `√125`, `√108`, `√288` ni chiqargandan keyingi koeffitsientlar o'sish tartibida → kod **5, 6, 12** | bankda `2` va `3` — CHIQARISH OXIRIGACHA bajarilmagan holat (`√288 = 2√72`, `√108 = 3√12`); `25` — 125 ni beshga bo'lish |
| 08 | D `PairSlots` | 🔴 | `out_in_pairs` | uch juft: `√48 ↔ 4√3`; `√75 ↔ 5√3`; `√44 ↔ 2√11` | ikki juftda ildiz osti bir xil (`√3`) — koeffitsientni hisoblash kerak. `√44` da tuzoq: `4√11` deb yozish. Ikkala tomon ham matematika, demak kartalar `side` bilan beriladi |
| 09 | E `TypeValue` | 🔴 | `bring_in` | `5√6 = √n` — n ni yozing → **150** | `30` (kvadratga oshirmasdan ko'paytirish), `900` (ikkisini ham kvadratga oshirish), `11` (5+6) |
| 10 | I `SwapOrder` | 🔴 | `take_out_steps` | `√72` ni qisqartirish tartibi: `72 = 36·2` → `√36 · √2` → `6√2` → tekshirish `(6√2)² = 36·2 = 72` | tekshirishni boshiga qo'yish; `72 = 8·9` deb ajratib to'xtash — razbor eng KATTA to'liq kvadratni tanlash haqida gapiradi |

**Qoplov.** T1 — 01, 03, 06, 07, 08, 09, 10. T2 — 02, 04, 05, 06. T3 — 01, 06, 10.
З34 — 02, 03, 05. З4 — 02 va 05 razborlari. З32 — 04 (`−3√2`) va 09 razbori.
З16 — razborlar javobni kvadratga oshirib tekshiradi (bu darsda tekshirishning shakli
mavzuning o'zi).
**Oldingi blokdan** — 04 dagi `−3√2`: 10-darsning «arifmetik ildiz nomanfiy» qoidasi.

**Harf.** 09 da n, qolgan topshiriqlar sonli. Yozuvlar takrorlanmaydi: `√50` faqat 01 da,
`√72` faqat 10 da; `√2` esa har joyda BOSHQA yozuv ichida turadi (`4√2 + √2`, `√18 + √2`,
`4√2 = √32`), alohida misol bo'lib takrorlanmaydi.

---

## 5. DARS 14 — IRRATSIONAL SONLAR

Tasdiqlar `Dars14.jsx` dan: T1 — kasr ko'rinishida yozilgan son ratsional, maxraj nolga
teng emas; T2 — ratsional sonning onli yozuvi tugaydi yoki takrorlanadi; T3 — yozuvi
tugamaydigan va takrorlanmaydigan son irratsional, ikkidan ildiz shunday.
Adashishlar: З16, З34, З35 (cheksiz yozuv — irratsionallik belgisi deb olindi),
З36 (har qanday ildiz irratsional deb olindi), З37 (yaqinlashish aniq qiymat deb olindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `rational_marked` | 6 sondan 3 tasi ratsional: `0,25`, `√49`, `1/3` | `√49` — ildiz, lekin ratsional (З36); `1/3` — yozuvi cheksiz, lekin ratsional (З35). Ratsional emas: `√2`, `√11`, `√30` |
| 02 | A `Choice` | 🟢 | `which_irrational` | qaysi son irratsional: **`√8`** | `√81` (= 9; «ildiz — demak irratsional» degan o'quvchi shu yerda ikkilanadi, З36), `2,5`, `4/9` |
| 03 | C `TrueFalse` | 🟢 | `record_claims` | `1/7` — «yozuvi cheksiz, lekin son ratsional» → Ha; `√2 + √2` — «`√4` ga teng, demak ratsional» → Yo'q | З35 va З34. Razbor son bilan: `2√2 ≈ 2,83`, `√4 = 2` |
| 04 | G `CodeLock` | 🟡 | `code_rational_roots` | bankdagi oltita sondan ildizi RATSIONAL bo'lgan uchtasi o'sish tartibida → kod **25, 144, 169** | bankda `18`, `27`, `50` — ildizi irratsional. З36 ni to'g'ridan-to'g'ri tekshiradi |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: kasr ko'rinishida yozilishi mumkin bo'lgan son **ratsional** deyiladi; uning onli yozuvi tugaydi yoki **takrorlanadi**; tugamaydigan va takrorlanmaydigan son **irratsional** deyiladi | bankda tuzoq: «butun», «yaqinlashadi», «cheksiz» |
| 06 | B `Zones` | 🟡 | `rational_or_irrational` | 8 karta ikki zonaga. Ratsional: `√100`, `0,75`, `22/7`, `0,(12)`; irratsional: `√3`, `√20`, `√12`, `0,101001000…` | uchta adashish bitta topshiriqda: `√100` — ildiz, lekin ratsional (З36); `0,(12)` — cheksiz, lekin davriy (З35); `22/7` — pi ning yaqinlashishi, lekin O'ZI ratsional kasr (З37) |
| 07 🖼 | D `PairSlots` | 🟡 | `exact_and_near` | uch juft: `√2 ↔ 1,41…`; `√5 ↔ 2,23…`; `√10 ↔ 3,16…`. Yuqorida CHIZMA: 1 dan 2 gacha son o'qi, `?` belgisi bilan | З37: yaqinlashish — QO'SHNI nuqta, o'sha nuqta emas; razbor buni chizma bilan aytadi. Tuzoq: `2,23` ni `√2` ga qo'yish (kvadratini tekshirmaslik) |
| 08 | E `TypeValue` | 🔴 | `count_finite` | oltita kasrdan nechtasining onli yozuvi CHEKLI: `1/16`, `1/6`, `1/9`, `1/40`, `1/15`, `1/50` → **3** | `6` (hammasining yozuvi chekli deb o'ylash), `2` (`1/40` ni tashlab ketish), `4` (`1/15` ni qo'shib yuborish). Belgi 6-sinfdan: qisqarmas kasr maxrajida faqat 2 va 5 |
| 09 | I `SwapOrder` | 🔴 | `proof_steps` | `√2` irratsionalligining isbot tartibi: `√2 = p/q` deb faraz qilamiz, kasr qisqarmas → kvadratga oshiramiz, `2q² = p²` → p juft, demak q ham juft chiqadi → qisqarmas kasrda ikkisi juft bo'lolmaydi, faraz yolg'on | xulosani juftlik qadamidan OLDIN qo'yish: o'shanda isbot yo'q, faqat da'vo qoladi |
| 10 | J `MatchPairs` | 🔴 | `fact_to_number` | to'rt ma'lumot ↔ to'rt son: «onli yozuvi tugaydi» ↔ `3/8`; «cheksiz, lekin takrorlanadi» ↔ `5/6`; «tugamaydi va takrorlanmaydi» ↔ `√6`; «butun son» ↔ `√196` | `3/8` va `5/6` ni ajratish yana o'sha belgini talab qiladi; `√196` — ildiz va BUTUN (З36) |

**Qoplov.** T1 — 01, 05, 06, 08, 10. T2 — 03, 05, 06, 08, 10. T3 — 02, 04, 06, 07, 09.
З35 — 01, 03, 05, 06. З36 — 01, 02, 04, 06, 10. З37 — 06 (`22/7`), 07. З34 — 03.
З16 — razborlar kvadratga oshirib tekshiradi (`2,23² = 4,97`, ya'ni `√5`, `√2` emas).
**Oldingi blokdan** — 04: «ildizi ratsional bo'lgan son» savoli 9-darsning to'liq kvadrat
belgisini qaytaradi.

**Harf.** 09 da p va q (isbotning yozuvi). Qolgan topshiriqlar sonli.
**Bitta ataylab qilingan istisno:** `√2` darsda uch marta uchraydi — 01 da karta, 07 da
yaqinlashish juftligi, 09 da isbotning obyekti. Bu 7-darsdagi k bilan bir xil holat
(`DARS07_11_AMALIYOT_SKELET.md` §10 p. 1): mavzuning O'ZI shu sonni belgilagan. Qolgan
hamma yozuv takrorlanmaydi.

---
## 6. UMUMIY QOIDALAR (uchala darsga)

1. **Uch til**: UZ (`siz`, ASCII `'`), RU (`ты`), EN. UZ satrida kirill yo'q. UZ-kontentli
   JS satri — qo'shtirnoq yoki backtick.
2. **Razbor har xato yo'lga alohida**, javobni aytmaydi — belgiga ishora qiladi va SON
   bilan rad etadi (З16 ning qopqog'i). Uchala darsda ham son bilan rad etishning shakli
   bitta: **javobni KVADRATGA OSHIRIB** ildiz ostidagi son bilan solishtirish. 13-darsda
   bu usul mavzuning o'zi (`Dars13.jsx`, T3), 12 va 14-darsda esa u qarz olinadi.
3. **`kit.jsx` ga yangi tip qo'shilmaydi. `frac.jsx` va `fig.jsx` tegilmaydi.** Ildiz —
   `{ r: … }` tokeni, chizma — mavjud `axis` speci (§2). Faqat ma'lumot fayllari
   (`D1N_MM.jsx`) va yig'uvchi (`DarsNNPractice.jsx`) yoziladi: dars boshiga 11 fayl,
   uch darsga **33 fayl**.
4. **Dizayn tegilmaydi** (metodist topshirig'idagi shart): fon `#fff7ed`, urg'u `#fe5b1a`,
   `S` / `C` / `HFB` / `Head` qatlami, chip qatori — o'sha.
5. **Reyestr**: `src/lessons/grade8.js` ning `grade8Amaliy` massiviga uch yozuv
   (`dars12-amaliyot`, `dars13-amaliyot`, `dars14-amaliyot`). `src/lessons/index.js` ga
   tegish kerak emas — `amaliy` bo'limi allaqachon ro'yxatdan o'tgan.
6. **Tekshiruv**: `scripts/grade8-practice-plan.mjs` ga `PLAN_12`, `PLAN_13`, `PLAN_14`
   qo'shiladi (`ok` va `no` qadamlari), keyin `grade8-practice-check.mjs` ikki yo'lda ham
   toza bo'lishi kerak — to'g'ri javoblarda 10/10, noto'g'rida 0/10 va BO'SH BO'LMAGAN
   razbor, 5 o'lcham × 3 tilda skrollsiz.
7. **`TypeValue` faqat BUTUN son oladi** (`DARS07_11` §1). Uchala darsning `TypeValue`
   javobi butun: 12/02 — 42, 13/09 — 150, 14/08 — 3. Kasr yoki ildizli javob bu mexanikaga
   berilmadi.
8. **`PairSlots` kartasi kvadrat** (76px), demak yozuv qisqa bo'lishi kerak. 12/05 da o'ng
   tomon son (`4`, `9`, `20`) — `v` bilan; 13/08 va 14/07 da ikkala tomon ham matematika
   (`√48` ↔ `4√3`, `√2` ↔ `1,41…`), demak kartalar `side` bilan beriladi — 8-dars
   amaliyotida kiritilgan naqsh.
9. **RAZBORNING UZUNLIGI — o'lchov, did emas.** Telefonda (390px va 360px) razbor panel
   ostiga kirib ketmasligi kerak, va chegara mexanikaning balandligiga bog'liq. 2026-08-24
   dagi o'lchov bergan amaliy budjet, RU matni uchun (eng uzun til):
   sakkiz kartali `Zones` va oltita kartali `MarkAll` — **300 belgigacha**; `MatchPairs`,
   `PairSlots`, chizmali topshiriq va to'rt so'zli `Choice` — **350 belgigacha**;
   `TypeValue`, `CodeLock`, `SwapOrder`, `ClozeBank` — **450 belgigacha**. Budjet
   yetmasa, tafsilot `wrongs` ga ko'chiriladi: u yerda bir vaqtda bittasi ko'rinadi.
   Tekshiruvi — `grade8-practice-panel.mjs`, ikki yo'lda ham.
10. **TIPLAR §6 ning majburiy janr tarkibi** (`odz`, `audit`, `build`, `boundary`) bu uch darsda
   ham bajarilmaydi — sababi 1-dars bilan bir xil: metodist o'nta MEXANIKANI belgilagan,
   va bu o'nlikda o'sha tiplar yo'q. Chetlanish ochiq yozilgan,
   `DARS01_AMALIYOT_KONTENT.md` §0a dagidek. Oxirgi janr — «oldingi blokdan» — esa har
   darsda bajarilgan (§3-§5 dagi oxirgi qator).

---

## 7. PARALLEL SESSIYA — TEGILMAYDIGAN FAYLLAR

Bu skelet yozilayotganda repo'da 8-11 darslar amaliyoti bo'yicha **boshqa ish** ketmoqda:
`practice/dars08/` da o'nta fayldan ikkitasi bor, `dars09`–`dars11` hali yo'q. Shuning
uchun 12-14 darslar ishida quyidagilar TEGILMAYDI:

- `practice/kit.jsx`, `practice/frac.jsx`, `practice/fig.jsx`, `practice/PracticeHost.jsx`;
- `practice/dars07/` … `practice/dars11/`;
- `DARS07_11_AMALIYOT_SKELET.md`.

Ikki umumiy fayl — `src/lessons/grade8.js` va `scripts/grade8-practice-plan.mjs` — ikki
sessiyaga ham kerak. Ularga yozish **oxirgi qadamda** va faylni QAYTA O'QIB bajariladi,
yozuvlar massiv va faylning OXIRIGA qo'shiladi.

---

## 8. NIMA TASDIQLANISHI KERAK

1. **§1 jadvali** — uch ketma-ketlik. Hamma shart bajarilgan va
   `node scripts/grade8-practice-seq.mjs check` bilan o'lchangan.
2. **§2** — chizma faqat 14/07 da; 12 va 13-darsda chizma yo'q.
3. **§3-§5** — o'ttizta topshiriqning mazmuni: qaysi misol, qaysi tuzoq, qaysi adashish.
4. **§6 p. 10** — janr tarkibining bajarilmasligi (1-dars bilan bir xil chetlanish).

Tasdiqdan keyin 2-etap boshlanadi: har dars uchun kontent (UZ/RU/EN + razborlar), keyin
sborka, reyestr, tekshiruv rejasi va QA — darsma-dars, 12-darsdan.

**15 va 16-dars TO'XTATIB QO'YILDI** (metodist, 2026-08-24), o'chirilmadi. Ular qaytganda
ikki narsa kerak bo'ladi: nazariy `Dars15.jsx` va `Dars16.jsx` (ular hali yo'q, ya'ni
amaliyot tasdiqlarni qaydan olishi savol bo'ladi) va `node scripts/grade8-practice-seq.mjs
find 15 2` — jadval o'shanda 12-14 bilan mos qilib hisoblanadi.

---

## 9. BAJARILGANI — 2026-08-24

**Skelet tasdiqlandi** (metodist), va o'sha kuni 2, 3 va 4-etap ham yopildi.

| Etap | Natija |
|---|---|
| 2. Kontent | 30 topshiriq, uch tilda matn va har xato yo'lga alohida razbor |
| 3. Sborka | 33 fayl: `practice/dars12`, `dars13`, `dars14` (10 ma'lumot + yig'uvchi) |
| 3. Reyestr | `src/lessons/grade8.js` ning `grade8Amaliy` iga uch yozuv |
| 4. Tekshiruv rejasi | `scripts/grade8-practice-plan.mjs`: `PLAN_12`, `PLAN_13`, `PLAN_14` |

Umumiy qatlamga hech narsa qo'shilmadi: `kit.jsx` ning o'nligi, `frac.jsx` ning `{ r: … }`
tokeni va `fig.jsx` ning `axis` speci o'sha holida ishlatildi (§6 p. 3 bajarildi).

**O'lchovlar** (`http://localhost:5201`, 2026-08-24):

| Tekshiruv | Natija |
|---|---|
| `grade8-practice-seq.mjs check` | 12-14 guruhi toza |
| `grade8-practice-check.mjs` (to'g'ri yo'l) | 12, 13, 14 — 150 o'tish, 5 o'lcham × 3 til, skroll yo'q |
| `grade8-practice-check.mjs` `G8_WRONG=1` | 30 o'tish, ball berilmadi, razbor bo'sh emas |
| `grade8-practice-panel.mjs` (ikki yo'l, `telefon` va `telefon-kichik`) | 0 joy panel ostida |
| `grade8-practice-lang.mjs` | 158 fayl toza: UZ da kirill yo'q, apostroflar ASCII |
| `npm run build` | o'tadi |

**Ikki tuzatish o'lchovdan keyin kiritildi** (ikkisi ham fayl shapkasida yozilgan):

1. **13-darsning 03-topshirig'i** telefonda RU razbor bilan kadrdan 10px chiqib ketgan edi
   (`grade8-practice-check.mjs`) — razbor qisqartirildi.
2. **Yigirma yetti joyda razborning oxirgi satrlari panel ostida qolgan edi**
   (`grade8-practice-panel.mjs`, eng chuqurisi 14/01 da 88px). Razborlar va ikki joyda
   `setup` qisqartirildi, mazmun esa saqlandi: sonli rad etish `wrongs` ning shartlarida
   to'liq turadi. Solishtirish uchun: o'sha tekshiruvda 1-dars amaliyotida 2 joy,
   11-darsda 3 joy qoladi — 12-14 da bittasi ham yo'q.

**Qarz qolgani.** `TIPLAR_AMALIYOT_8SINF.md` ning shapkasida hali «faqat 1-dars amaliyoti
yig'ilgan, qolgan 54 — sinfning qarzi» deb turadi. Bu satr eskirgan (hozir 1-14 yig'ilgan),
lekin u fayl parallel sessiya tomonidan ham tahrirlanmoqda, shuning uchun tegilmadi —
metodist ikki ish tugagandan keyin bir marta yangilashi to'g'ri bo'ladi.
