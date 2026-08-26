# 8-SINF AMALIYOTI, 51-55 DARSLAR — SKELET (1-etap)

Metodist topshirig'i 2026-08-25: **51-55 darslarning amaliyoti 41-50 bilan bir xil qoida
bo'yicha** — 1-darsdagi AYNAN O'SHA o'nta mexanika, har darsda boshqa ketma-ketlik, fon
rangi va dizayn tegilmaydi, ha/yo'q javoblari to'rt kombinatsiyada aylanadi.

Bu **kursning oxirgi beshligi**: 55-dars bilan 8-sinf matematikasi yopiladi. Oldingi
hujjatlar: `DARS41_50_AMALIYOT_SKELET.md` (eng yaqin namuna), `DARS31_40_AMALIYOT_SKELET.md`
(ha/yo'q qoidasi va `poly` chizmasi), `DARS07_11_AMALIYOT_SKELET.md` (o'nta mexanikaning
kontrakti).

Besh dars — Б7 blokining oxiri va ikki mavzu: **51-52 aylana** (§4 ning yakuni),
**53-55 vektorlar** (§5). Ikki mavzu orasidagi chegara qat'iy: aylanada FIGURA
o'rganiladi, vektorda esa YO'NALISH — bu 8-sinfda o'quvchi birinchi marta uchraydigan
kattalik, va uni chizmasiz ko'rsatib bo'lmaydi (§0a.2).

---

## 0. HAMMA TASDIQ NAZARIY DARSDAN OLINGAN

Repo'da `Dars51.jsx` … `Dars55.jsx` turibdi, ya'ni bu skeletda hech bir tasdiq taklif
qilinmagan — hammasi nazariy fayllarning `STATEMENTS` va `MISS` idan aynan olingan.

| Dars | Blok | Mavzu (`META.topic`) | Adashishlar |
|---:|:--:|---|---|
| 51 | Б7 | Aylanaga ichki chizilgan burchak | З16, З108, З109 |
| 52 | Б7 | Ichki va tashqi chizilgan aylanalar, kesuvchi burchaklari | З16, З110, З111 |
| 53 | Б7 | Vektor tushunchasi, qo'shish va ayirish | З16, З112, З113 |
| 54 | Б7 | Vektorni songa ko'paytirish, masalalarga tatbig'i | З16, З114, З115 |
| 55 | Б7 | Vektor koordinatalari, skalyar ko'paytma | З16, З116, З117 |

Yangi adashish kodi o'ylab topilmadi: З108-З117 ni nazariy darslarning o'zi kiritgan.

---

## 0a. BESH QAROR — UCHTASI SHU YERDA, IKKITASI METODIST TASDIQLAGAN

### 0a.1. HA/YO'Q JAVOBLARI — TO'RT KOMBINATSIYA

Metodist topshirig'i bu beshlikda ham kuchda (31-40 skeleti §0a.3):

| Dars | 51 | 52 | 53 | 54 | 55 |
|---|:--:|:--:|:--:|:--:|:--:|
| javob | Ha·Yo'q | Ha·Ha | Yo'q·Ha | Yo'q·Yo'q | Ha·Ha |

Besh dars to'rtga bo'linmaydi, shuning uchun bitta kombinatsiya ikki marta keladi —
«Ha·Ha» (52 va 55). Yonma-yon ikki dars bir xil kombinatsiyada emas, va 51 50-darsning
kombinatsiyasini («Yo'q·Yo'q») takrorlamaydi.

Har juftlik mazmun bilan tanlangan, tasodifan emas:

- **51 — Ha·Yo'q.** Ikki da'vo bitta yozuv atrofida: «diametrga tiralgan burchak
  to'g'ri» (rost) va «ichki chizilgan burchak o'zi tiralgan yoyga teng» (yolg'on, З109).
- **52 — Ha·Ha.** «Har qanday uchburchakka ichki aylana chizish mumkin» va «har qanday
  uchburchakka tashqi aylana chizish mumkin» — ikkalasi ham rost, va aynan shu
  kutilmaydi: o'quvchi «har qanday» degan so'zni ko'rib bittasini rad etadi.
- **53 — Yo'q·Ha.** «Teng vektorlar bitta nuqtadan chiqishi kerak» (yolg'on, З112) va
  «AB⃗ + BC⃗ = AC⃗» (rost).
- **54 — Yo'q·Yo'q.** Ikkala da'vo ham yolg'on va ular BITTA adashishning ikki tomonini
  ko'rsatadi (З114): «(−2)a⃗ ning yo'nalishi a⃗ bilan bir xil» — yo'nalish haqida;
  «|(−2)a⃗| = −2|a⃗|» — modul haqida. Modul manfiy bo'lolmaydi, va bu ikkinchi tomoni
  odatda umuman ko'rilmaydi.
- **55 — Ha·Ha.** Kursning oxirgi ha/yo'q ekrani: «a⃗(3;4) ning moduli besh» va
  «a⃗(2;3)·b⃗(4;1) = 11» — ikkalasi ham rost. Ikkinchisi qimmat: javob SON bo'lgani
  uchun u xato bo'lib ko'rinadi (З117).

### 0a.2. CHIZMA — IKKI QO'SHIMCHA, METODIST TASDIQLAGAN

`fig.jsx` bugun beshta narsani chizadi: `hyp`, `lin`, `pts`, `axis`, `circ`, `poly`.
Ikkitasi yetishmaydi, va ikkalasi ham metodist tomonidan tasdiqlandi (2026-08-25):

**1. `vec` — strelkali kesmalar.** Vektor — YO'NALISHGA ega kesma, ya'ni strelkasiz u
shunchaki kesma bo'lib qoladi va darsning butun mavzusi yo'qoladi. З112 («teng
vektorlar bir nuqtadan chiqishi kerak») faqat chizmada rad etiladi: bir xil uzunlik va
yo'nalishdagi ikki strelkani turli joyga qo'yish kerak, va bu yozuv bilan aytilmaydi.

```
{ fig: 'vec', w, h, arrows: [{ from: [x,y], to: [x,y], name: 'a', ref: true }] }
```

`ref: true` — solishtirish uchun turgan vektor, siyoh rangida va ingichkaroq; qolganlari
urg'u rangida. `name` — kesmaning o'rtasida, unga perpendikulyar siljitilgan yozuv.

**2. `circ` ga `radii` maydoni.** 51-darsning butun mazmuni bitta jumlada: ichki
chizilgan burchak markaziy burchakning YARMI. Ikkovini bitta chizmada ko'rsatish uchun
markazdan chiqqan kesmalar kerak, `circ` esa hozir faqat vatar chizadi.

```
{ fig: 'circ', chords: [...], radii: [150, 70] }   // gradusda, `chords` dagidek
```

Ikkalasi ham ADDITIV: mavjud hech bir spec o'zgarmaydi, 7-50 darslarning chizmalari
tegilmaydi — `spans`, `poly` va `circ` qanday qo'shilgan bo'lsa, shunday.

**52-dars ataylab CHIZMASIZ qoladi.** Uning uchta tasdig'i «qaysi chiziqlar kesishadi»
(bissektrisalar yoki o'rta perpendikulyarlar) va «nima nimaga teng» (burchaklar
yig'indisi 180°, tomonlar yig'indilari teng) haqida. Birinchisini chizma bilan ko'rsatish
uchun aylana va uchburchakni BIR kadrda chizish kerak bo'lardi, ustiga ichki aylananing
markazi aylananing burchaklaridan aniqlanmaydi — ya'ni bu `circ` ga emas, yangi turga
tegadi. Ikkinchisi esa sonlar bilan to'liq ochiladi. Shuning uchun 52 belgilar va
sonlar bilan yig'iladi, va buni ochiq yozib qo'yaman: bu kamchilik emas, tanlov.

### 0a.3. GURUHLAR: BITTA JUFTLIK VA BITTA UCHLIK

Besh dars ikki guruhga bo'linadi, chegara MAVZU bo'yicha:

- **51-52** — aylana (Б7 §4 ning yakuni);
- **53-55** — vektorlar (Б7 §5).

Guruh uchtadan katta bo'lolmaydi (1-pozitsiyaga faqat A, C, F qo'yiladi), va besh dars
uchtaga bo'linmaydi. Ikki va uch — yagona bo'linish, va u mavzu chegarasi bilan aynan
mos tushdi. Yolg'iz qator bu safar yo'q: 47-darsdagi kabi kuchaytirilgan shart
qo'llanmaydi, chunki ikkilik ham guruh — undagi ikki qator o'nta pozitsiyaning
HAMMASIDA farq qiladi.

### 0a.4. KARTA MATNI TARJIMA QILINMAYDI — QOIDA O'SHA

`PairSlots`, `Zones`, `MarkAll`, `MatchPairs`, `CodeLock` ning kartalari `L()` ni qabul
qilmaydi (`kit.jsx` ning boshidagi qoida). Vektor mavzusi bu qoidaga qulay: uning
yozuvi belgidan iborat va uch tilda bir xil o'qiladi — `AB⃗ + BC⃗ = AC⃗`, `−2a⃗`,
`(3;4)`, `a⃗·b⃗`. Aylanada ham shunday: `yoy 80° → 40°`, `∠A + ∠C = 180°`.

So'z kerak bo'lgan ikki joyda mexanika `ClozeBank` yoki `Choice` ga beriladi — ularning
kartalari `L()` oladi. Bu 52/05 («ichki aylananing markazi qaysi chiziqlar kesishgan
nuqta») va har darsning qoida-topshirig'i.

**Vektor belgisi.** Harf ustidagi strelka `U+20D7` (`a⃗`) bilan yoziladi — u
`JetBrains Mono` da chiqadi va uch tilda bir xil. Kartada joy tor bo'lsa strelka
tushiriladi va shart matnida bir marta aytiladi.

### 0a.5. 55-DARS — FAQAT O'Z TASDIQLARI

Rejada 55-darsning yonida «+ итоговое повторение курса» yozilgan, nazariy darsning
`META.topic` i esa faqat «vektor koordinatalari, skalyar ko'paytma». Metodist qarori
2026-08-25: **amaliyot faqat 55-darsning o'z tasdiqlarini tekshiradi.** Sabab:
amaliyot darsdan chetga chiqmaydi, va kursni takrorlash — bu ПК va ИК ning ishi,
ular esa numeratsiyaga kirmaydi (`DARSLAR_REJASI_8SINF.md`).

Qolgan to'qqiz darsdagidek, bitta topshiriq oldingi blokdan oziqlanadi: 55/06 da
`|a⃗| = kvadrat ildiz(x² + y²)` Pifagor teoremasidan chiqadi (44-dars), va razbor buni
ochiq aytadi.

---

## 1. KETMA-KETLIKLAR — BESH DARS

| Dars | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **51** | A | E | F | H | B | C | I | G | J | D |
| **52** | F | B | C | E | A | J | G | H | D | I |
| **53** | A | B | F | J | H | D | E | C | G | I |
| **54** | F | C | B | A | I | E | G | H | D | J |
| **55** | C | F | A | G | D | J | H | I | E | B |

Kodlar: A `Choice`, B `Zones`, C `TrueFalse`, D `PairSlots`, E `TypeValue`, F `MarkAll`,
G `CodeLock`, H `ClozeBank`, I `SwapOrder`, J `MatchPairs`. Qiyinlik o'qi hamma darsda
o'sha: 🟢🟢🟢 · 🟡🟡🟡🟡 · 🔴🔴🔴 — qiyinlikni **misol** beradi, mexanika emas.

Tekshirilgan holat: guruhlar (51-52, 53-55) toza — har mexanika guruh ichida har xil
pozitsiyada; hech bir tartib boshqasi bilan ustma-ust tushmaydi; har qator qolgan
ellik to'rttasidan kamida olti pozitsiyada farq qiladi; birinchi uchtalikning eng
yaqin takrori **25 dars** narida (55 va 30 — `CFA`).

`SEQ` jadvali skelet tasdiqlangandan keyin yangilanadi — jadval haqiqat manbai, amaliyot
fayllari unga qarab yig'iladi.

---

## 2. CHIZMA: BESH JOYDA

> **Bu tabel eskirdi.** Metodist 2026-08-25 da chizmani hamma kerakli joyga
> qo'shishni topshirdi, va chizma yigirma olti topshiriqqa chiqdi — §11.1 ga
> qarang. Quyidagi beshtasi dastlabki rejadagi minimal to'plam.

| Dars | Topshiriq | Tur | Chizma nima qiladi |
|---:|---|---|---|
| 51 | 01 | `circ` + `radii` | aylana, markaziy burchak (ikki radius) va o'sha yoyga tiralgan ichki chizilgan burchak (ikki vatar) BIR kadrda: «yarmi» degan so'z ko'rinadi |
| 51 | 03 | `circ` + `radii` | olti aylana: uchtasida uchi AYLANADA (ichki chizilgan), uchtasida uchi MARKAZDA (markaziy). T1 ko'z bilan tekshiriladi |
| 53 | 01 | `vec` | to'rt strelka: bittasi a⃗ ga teng (boshqa joyda), qolganlari teskari, uzunroq va boshqa yo'nalishda |
| 53 | 02 | `vec` | sakkiz strelka ikki guruhga: a⃗ ga teng va teng emas. З112 aynan shu yerda o'ladi |
| 54 | 10 | `vec` | to'rt kadr, har birida a⃗ (siyoh rangda) va k·a⃗ (urg'u rangda): manfiy k da strelka teskari buriladi |

52 va 55 chizmasiz (§0a.2 va §0a.5): birinchisining mazmuni chiziqlar va yig'indilarda,
ikkinchisiniki esa koordinatalarda — ikkalasi ham belgi bilan to'liq ochiladi.

---

## 3. DARS 51 — AYLANAGA ICHKI CHIZILGAN BURCHAK

Tasdiqlar `Dars51.jsx` dan: T1 — ichki chizilgan burchakning uchi aylanada, tomonlari
vatarlar, va u O'Z UCHIDAN FARQLI, qarama-qarshi yoyga tiraladi; T2 — u tiralgan
yoyning yarmi bilan o'lchanadi; T3 — bir yoyga tiralgan hamma burchaklar teng,
diametrga tiralgani esa har doim to'g'ri.
Adashishlar: З16, З108 (uchi turgan yoy tiralgan yoy deb olindi), З109 (burchak yoyga
teng deb olindi, aslida yarmiga).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` 🖼 | 🟢 | `half_of_arc` | Chizmada aylana: AC yoyi 80° (markaziy burchak ikki radius bilan), ∠ABC esa ikki vatar bilan. ∠ABC = **40°** | `80°` (З109: burchak yoyga teng), `160°` (yarmi o'rniga ikkilandi), `140°` (qarama-qarshi yoy 280 ning yarmi — З108). Chizma «yarmi» degan so'zni ko'rinadigan qiladi |
| 02 | E `TypeValue` | 🟢 | `arc_from_angle` | ∠ABC = 35°. U tiralgan AC yoyi necha gradus → **70** | `35` (З109 teskari tomondan), `17`, `145`. Teskari yo'nalish: burchakdan yoyga, ya'ni IKKILASH |
| 03 | F `MarkAll` 🖼 | 🟢 | `inscribed_marked` | Olti aylanadan 3 tasida burchak ICHKI CHIZILGAN (uchi aylanada, tomonlari vatar) | rad etilganlarda uch MARKAZDA va tomonlari radius — bu markaziy burchak. T1 ning ta'rifi ko'z bilan tekshiriladi, va shu bilan 01-topshiriqning chizmasi o'qiladigan bo'ladi |
| 04 | H `ClozeBank` | 🟡 | `rule_words` | qoida: ichki chizilgan burchakning uchi **aylanada** yotadi, tomonlari **vatarlar**, va u tiralgan yoyning **yarmi** bilan o'lchanadi | bankda tuzoq: «markazda» (markaziy burchakning ta'rifi), «radiuslar», «o'zi» (З109: yoyning o'ziga teng) |
| 05 | B `Zones` | 🟡 | `pair_right_or_not` | 8 karta ikki zonaga: TO'G'RI / NOTO'G'RI. To'g'ri: `60° → 30°`, `100° → 50°`, `180° → 90°`, `140° → 70°`; noto'g'ri: `60° → 60°`, `100° → 130°`, `180° → 180°`, `140° → 110°` | ikki adashish yonma-yon: `60 → 60` va `180 → 180` — З109; `100 → 130` va `140 → 110` — З108 (qarama-qarshi yoyning yarmi olingan). Har juftlikda yoy bir xil, javob esa boshqa |
| 06 | C `TrueFalse` | 🟡 | `inscribed_claims` | «Diametrga tiralgan ichki chizilgan burchak to'g'ri» → **Ha**; «Ichki chizilgan burchak o'zi tiralgan yoyga teng» → **Yo'q** | birinchisi T3 ning alohida holi, ikkinchisi З109 ning o'zi. Razbor birinchisini ikkinchisi orqali tushuntiradi: diametr 180 graduslik yoy, uning yarmi to'qson |
| 07 | I `SwapOrder` | 🟡 | `inscribed_steps` | ∠ABC ni topish tartibi: uch qayerda turganini aniqlaymiz (`B aylanada`) → qaysi yoyga tiralganini topamiz (`AC, B siz`) → yoyning gradusini yozamiz (`80°`) → yarmini olamiz (`40°`) | З108 aynan ikkinchi qadamda: uchi turgan yoyni olish. Yarmini olishni yoyni topishdan oldin qo'yish — yarimlanadigan narsa hali yo'q |
| 08 | G `CodeLock` | 🔴 | `code_angles` | Uch yoy uchun ichki chizilgan burchak, o'sish tartibida: `80°` (40), `140°` (70), `180°` (90) → kod **40, 70, 90** | bankda `80`, `140`, `180` — YOYLARNING o'zi (З109). Uchinchi yoy diametr, ya'ni javob to'qson: T3 kodning ichida turadi |
| 09 | J `MatchPairs` | 🔴 | `arc_to_angle` | To'rt juft, ikki manbadan: `yoy 50° ↔ 25°`; `markaziy 90° ↔ 45°`; `yoy 160° ↔ 80°`; `markaziy 200° ↔ 100°` | markaziy burchak yoyga TENG, ya'ni ikki manba bitta hisobni beradi. Oxirgisi o'tmas ichki burchak — u ham bo'ladi, va bu odatda kutilmaydi |
| 10 | D `PairSlots` | 🔴 | `vertex_arc_to_angle` | UCHI TURGAN yoy berilgan (З108 ning yuzi): `260° ↔ 50°`; `280° ↔ 40°`; `200° ↔ 80°` | ikki qadam: avval uch yuz oltmishdan ayirish, keyin yarimlash. Bir qadamni tashlab ketish ikki xil xato beradi, va razbor ikkalasini ajratadi |

**Qoplov.** T1 — 01, 03, 04, 07. T2 — 01, 02, 05, 08, 09, 10. T3 — 06, 08, 09.
З108 — 05, 07, 10. З109 — 01, 04, 05, 06, 08. З16 — razborlar javobni yoy bilan qayta
tekshiradi.
**Oldingi blokdan** — 09 dagi markaziy burchak 48-darsdan.

**Harf.** Hamma joyda `A`, `B`, `C` va `O` (darslikning belgilashi).
Takrorlanmaydigan narsa — YOY QIYMATLARI.

---

## 4. DARS 52 — ICHKI VA TASHQI CHIZILGAN AYLANALAR

Tasdiqlar `Dars52.jsx` dan: T1 — har qanday uchburchakka ichki aylana chiziladi,
markazi BISSEKTRISALAR kesishgan nuqta; T2 — har qanday uchburchakka tashqi aylana
chiziladi, markazi O'RTA PERPENDIKULYARLAR kesishgan nuqta, to'g'ri burchaklida
gipotenuzaning o'rtasi va R = gipotenuza : 2; T3 — ichki chizilgan to'rtburchakning
qarama-qarshi burchaklari yig'indisi 180°, tashqi chizilganning qarama-qarshi
tomonlari YIG'INDILARI teng.
Adashishlar: З16, З110 (ichki aylananing markazi o'rta perpendikulyarlarda deb
o'ylandi), З111 (tashqi chizilgan to'rtburchakda tomonlar teng deb o'ylandi, aslida
ularning yig'indilari).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `inscribed_angles_marked` | Ichki chizilgan to'rtburchakning qarama-qarshi burchaklari. 6 juftlikdan 3 tasi mumkin: `70° + 110°`, `90° + 90°`, `120° + 60°` | `70° + 100°`, `80° + 80°`, `120° + 70°` — yig'indisi 180 emas. Har juftlik qo'shni bilan bir necha gradusda farq qiladi, ya'ni ko'z bilan emas, QO'SHISH bilan hal qilinadi |
| 02 | B `Zones` | 🟢 | `circumscribed_sides` | Tashqi chizilgan to'rtburchak: tomonlari tartib bilan berilgan. 8 karta ikki zonaga: MUMKIN / MUMKIN EMAS. Mumkin: `5, 6, 9, 8`; `7, 4, 5, 8`; `10, 3, 2, 9`; `6, 6, 6, 6`; mumkin emas: `5, 6, 9, 7`; `7, 4, 5, 9`; `10, 3, 2, 8`; `6, 6, 7, 6` | З111 sof shaklda: birinchi va uchinchi tomonning yig'indisi ikkinchi va to'rtinchisining yig'indisiga teng bo'lishi kerak. Har juftlik BITTA sonda farq qiladi. `6, 6, 6, 6` — chegara holati: romb har doim bo'ladi |
| 03 | C `TrueFalse` | 🟢 | `circle_claims` | «Har qanday uchburchakka ichki aylana chizish mumkin» → **Ha**; «Har qanday uchburchakka tashqi aylana chizish mumkin» → **Ha** | ikkalasi ham ROST (§0a.1), va aynan «har qanday» degan so'z shubha uyg'otadi. Razbor sababni aytadi: uch bissektrisa ham, uch o'rta perpendikulyar ham har doim bitta nuqtada kesishadi |
| 04 | E `TypeValue` | 🟡 | `radius_from_hypotenuse` | To'g'ri burchakli uchburchakning gipotenuzasi 26 sm. Tashqi chizilgan aylananing radiusi = **13** | `26` (diametr radius deb olindi), `52`, `6`. T2 ning ikkinchi yarmi: to'g'ri burchaklida markaz gipotenuzaning O'RTASIDA, ya'ni gipotenuza — diametr |
| 05 | A `Choice` | 🟡 | `which_centre` | Ichki chizilgan aylananing markazi qaysi chiziqlar kesishgan nuqta: **bissektrisalar** | «o'rta perpendikulyarlar» (З110 — bu tashqi aylananiki), «balandliklar», «medianalar». Razbor sababni aytadi: bissektrisadagi nuqta ikki TOMONDAN teng uzoqlikda, o'rta perpendikulyardagi esa ikki UCHDAN |
| 06 | J `MatchPairs` | 🟡 | `quad_to_opposite_angle` | Ichki chizilgan to'rtburchak, to'rt juft: `∠A = 70° ↔ 110°`; `∠A = 95° ↔ 85°`; `∠B = 120° ↔ 60°`; `∠B = 90° ↔ 90°` | oxirgisi chegara holati: to'qsonning «qarama-qarshisi» ham to'qson, va bu tenglik tasodif — u faqat to'g'ri burchakda chiqadi (37-darsning 04-topshirig'idagi naqsh) |
| 07 | G `CodeLock` | 🟡 | `code_three` | Uch savol: gipotenuzasi 20 bo'lgan uchburchakning tashqi aylanasi R (10); ichki chizilgan to'rtburchakda ∠A = 115° bo'lsa ∠C (65); tashqi chizilgan to'rtburchakda AB=7, BC=5, CD=9 bo'lsa DA (11). Kod o'sish tartibida → **10, 11, 65** | bankda `20`, `115`, `16`. Oxirgi `16` — З111: tomonlar teng deb olinganda chiqadigan son. Uch savol uch tasdiqqa tegadi, ya'ni kod darsning uchala qismini bir joyga yig'adi |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: ichki aylananing markazi **bissektrisalar** kesishgan nuqta, tashqi aylananiki esa **o'rta perpendikulyarlar** kesishgan nuqta; ichki chizilgan to'rtburchakning qarama-qarshi burchaklari yig'indisi **180°** | bankda tuzoq: ikkovini almashtirish (З110), «teng» (З111 ning so'z bilan aytilgani), «balandliklar» |
| 09 | D `PairSlots` | 🔴 | `fourth_side` | Tashqi chizilgan to'rtburchakda uch tomon berilgan, to'rtinchisi izlanadi: `7, 5, 9 ↔ 11`; `6, 4, 8 ↔ 10`; `10, 3, 5 ↔ 12` | З111 hisobga aylanadi: birinchi va uchinchi tomonning yig'indisidan ikkinchisini ayirish. Tomonlar teng deb olinsa javob ikkinchi tomonning o'zi bo'lardi, va u bankda YO'Q — javobni tenglikdan chiqarish kerak |
| 10 | I `SwapOrder` | 🔴 | `inscribed_circle_steps` | Ichki aylanani qurish tartibi: ikki burchakning bissektrisasini o'tkazamiz → kesishgan nuqta markaz bo'ladi → markazdan tomonga perpendikulyar tushiramiz → uning uzunligi radius, aylana chiziladi | markazni bissektrisalarsiz belgilash — З110 ning qurilishdagi ko'rinishi. Radiusni markazdan OLDIN o'lchash ham xato: o'lchanadigan joy hali yo'q |

**Qoplov.** T1 — 03, 05, 08, 10. T2 — 03, 04, 07, 08. T3 — 01, 02, 06, 07, 08, 09.
З110 — 05, 08, 10. З111 — 02, 07, 08, 09. З16 — razborlar yig'indini qayta hisoblaydi.
**Oldingi blokdan** — 04 va 07 da gipotenuza (44-dars), 06 da qarama-qarshi burchaklar
(37-dars bilan qarama-qarshi qo'yiladi: parallelogrammda ular TENG, ichki chizilgan
to'rtburchakda esa 180 gacha to'ldiradi).

**Harf.** `ABC` uchburchak, `ABCD` to'rtburchak, `R` radius.
Takrorlanmaydigan narsa — SON TO'PLAMLARI.

---

## 5. DARS 53 — VEKTOR TUSHUNCHASI, QO'SHISH VA AYIRISH

Tasdiqlar `Dars53.jsx` dan: T1 — vektor yo'nalishga ega kesma, uzunligi va yo'nalishi
bir xil vektorlar TENG, joylashuvi ahamiyatsiz; T2 — uchburchak qoidasi
AB⃗ + BC⃗ = AC⃗, qarama-qarshi vektor −a⃗ va a⃗ + (−a⃗) = 0⃗; T3 — bitta nuqtadan
chiqqan ikki vektorning ayirmasi OA⃗ − OB⃗ = BA⃗.
Adashishlar: З16, З112 (teng vektorlar bir nuqtadan chiqishi kerak deb o'ylandi),
З113 (ayirmaning yo'nalishi teskari olindi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | A `Choice` 🖼 | 🟢 | `which_equal` | Yuqorida a⃗ turibdi. To'rt chizmadan qaysi biri unga TENG: **uzunligi va yo'nalishi o'sha, joylashuvi boshqa** | teskari yo'nalish (bu −a⃗), uzunroq (bu 2a⃗ ga o'xshaydi), boshqa yo'nalish. Joylashuvning boshqa bo'lgani to'g'ri javobda ATAYLAB: З112 aynan shu yerda rad etiladi |
| 02 | B `Zones` 🖼 | 🟢 | `equal_or_not` | `given`: a⃗. Sakkiz strelka ikki zonaga: a⃗ GA TENG / TENG EMAS. Teng: to'rtta, hammasi boshqa joyda; teng emas: teskari, uzunroq, qisqaroq, boshqa yo'nalishda | to'rt teng strelka kadrning to'rt burchagida turadi, ya'ni «joylashuv ahamiyatsiz» degan gap sakkiz kartada takrorlanadi. Rad etilganlar uch xil sababdan: yo'nalish, uzunlik va ikkalasi |
| 03 | F `MarkAll` | 🟢 | `triangle_rule_marked` | 6 yozuvdan 3 tasi to'g'ri: `AB⃗ + BC⃗ = AC⃗`, `MN⃗ + NP⃗ = MP⃗`, `OA⃗ + AB⃗ = OB⃗` | `AB⃗ + BC⃗ = CA⃗` (natija teskari), `AB⃗ + CB⃗ = AC⃗` (ikkinchi vektor teskari yo'nalgan), `AB⃗ + BC⃗ = AB⃗`. Qoida harflar bilan tekshiriladi: o'rtadagi harf ikki marta uchraydi va tushib qoladi |
| 04 | J `MatchPairs` | 🟡 | `expr_to_vector` | To'rt juft: `AB⃗ + BC⃗ ↔ AC⃗`; `OA⃗ − OB⃗ ↔ BA⃗`; `OB⃗ − OA⃗ ↔ AB⃗`; `AB⃗ + BA⃗ ↔ 0⃗` | ikkinchi va uchinchi juftlik yonma-yon turadi va faqat TARTIB bilan farq qiladi — З113 ning eng aniq joyi. To'rtinchisi nol vektor: qarama-qarshi vektorlarning yig'indisi |
| 05 | H `ClozeBank` | 🟡 | `rule_words` | qoida: vektor — **yo'nalishga** ega kesma; uzunligi va yo'nalishi bir xil vektorlar **teng** deyiladi, ularning **joylashuvi** esa ahamiyatsiz | bankda tuzoq: «boshlanishi» (З112 — teng vektorlar bir nuqtadan chiqishi kerak degan fikr), «uzunligi» (yo'nalishsiz), «kesma» |
| 06 | D `PairSlots` | 🟡 | `chain_to_vector` | Uch juft: `AB+BC+CD ↔ AD`; `AB+BA ↔ 0`; `AB−CB ↔ AC` | uchinchisi eng qimmat: ayirmani qo'shishga aylantirish kerak — `−CB` bu `BC`, ya'ni `AB + BC = AC`. Birinchisi zanjir: uchburchak qoidasi ikki marta ketma-ket ishlaydi |
| 07 | E `TypeValue` | 🟡 | `sum_length` | To'g'ri to'rtburchak ABCD, AB = 8, BC = 6. `\|AB⃗ + BC⃗\|` = **10** | `14` (uzunliklar qo'shildi — vektor yig'indisining uzunligi uzunliklarning yig'indisi EMAS), `48`, `2`. Uchburchak qoidasi AC diagonalini beradi, uning uzunligi esa Pifagor bilan topiladi (44-dars) |
| 08 | C `TrueFalse` | 🔴 | `vector_claims` | «Teng vektorlar bitta nuqtadan chiqishi kerak» → **Yo'q**; «AB⃗ + BC⃗ = AC⃗» → **Ha** | З112 va T2 bitta ekranda. Razbor birinchisiga chizma tilida javob beradi: ikki strelkani parallel ko'chirish ularni o'zgartirmaydi |
| 09 | G `CodeLock` | 🔴 | `code_results` | Uch ifodaning natijasi, ifodalar tartibida: `AB⃗ + BC⃗` (AC), `OA⃗ − OB⃗` (BA), `AB⃗ + BA⃗` (0) → kod **AC, BA, 0** | bankda `CA`, `AB`, `BC` — uchalasi ham harflari TESKARI yozilgan javob (З113). Kod bu safar sonlardan emas, yozuvlardan yig'iladi, va tartib ifodalarning tartibi bo'yicha |
| 10 | I `SwapOrder` | 🔴 | `difference_steps` | `OA⃗ − OB⃗` ni topish: ayirmani qo'shishga aylantiramiz (`OA⃗ + (−OB⃗)`) → qarama-qarshi vektorni yozamiz (`−OB⃗ = BO⃗`) → uchburchak qoidasini qo'llaymiz (`BO⃗ + OA⃗`) → natijani yozamiz (`BA⃗`) | З113 nega tug'ilishini ko'rsatadi: `BA` degan javob `B` dan boshlanadi, chunki qo'shish `BO` dan boshlangan. Bu qadamlarsiz tartibni yodlashdan boshqa yo'l qolmaydi |

**Qoplov.** T1 — 01, 02, 05, 08. T2 — 03, 04, 06, 07, 08, 09, 10. T3 — 04, 06, 09, 10.
З112 — 01, 02, 05, 08. З113 — 04, 06, 09, 10. З16 — razborlar natijani harflar bo'yicha
qayta yozib tekshiradi.
**Oldingi blokdan** — 07 da Pifagor teoremasi (44-dars).

**Harf.** `A`, `B`, `C`, `O`, `M`, `N`, `P` (darslikning belgilashi); `a⃗` faqat qoidada.
Takrorlanmaydigan narsa — YOZUVLAR.

---

## 6. DARS 54 — VEKTORNI SONGA KO'PAYTIRISH

Tasdiqlar `Dars54.jsx` dan: T1 — |k·a⃗| = |k|·|a⃗|, k musbat bo'lsa yo'nalish a⃗ bilan
bir xil, manfiy bo'lsa teskari; T2 — a⃗ va k·a⃗ har doim kollinear, va (kl)a⃗ = k(la⃗),
(k+l)a⃗ = ka⃗ + la⃗, k(a⃗+b⃗) = ka⃗ + kb⃗; T3 — C, AB ning o'rtasi bo'lsa
OC⃗ = ½(OA⃗+OB⃗), uchburchakning o'rta chizig'i uchinchi tomonning yarmiga teng va unga
parallel.
Adashishlar: З16, З114 (k manfiy bo'lganda yo'nalish burilishi unutildi), З115 (o'rtaga
tortilgan vektor formulasida yarim koeffitsiyent unutildi).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | F `MarkAll` | 🟢 | `collinear_marked` | 6 yozuvdan 3 tasi a⃗ ga KOLLINEAR: `3a⃗`, `−2a⃗`, `0,5a⃗` | `a⃗ + b⃗`, `b⃗`, `2b⃗`. T2 ning birinchi yarmi: songa ko'paytirish yo'nalishni saqlaydi yoki teskari buradi, lekin YANGI yo'nalish yaratmaydi. Manfiy koeffitsiyent kollinearlikni buzmaydi — bu ataylab birinchi topshiriqda |
| 02 | C `TrueFalse` | 🟢 | `scalar_claims` | «(−2)a⃗ ning yo'nalishi a⃗ bilan bir xil» → **Yo'q**; «\|(−2)a⃗\| = −2\|a⃗\|» → **Yo'q** | ikkalasi ham YOLG'ON (§0a.1) va ular З114 ning ikki tomoni: birinchisi yo'nalish haqida, ikkinchisi modul haqida. Modul manfiy bo'lolmaydi — javob ikki barobar uzunlik, ya'ni `2\|a⃗\|` |
| 03 | B `Zones` | 🟢 | `same_or_opposite` | 8 karta ikki zonaga: a⃗ BILAN BIR XIL YO'NALISH / TESKARI. Bir xil: `3a⃗`, `0,5a⃗`, `7a⃗`, `2,5a⃗`; teskari: `−3a⃗`, `−0,5a⃗`, `−1a⃗`, `−4a⃗` | З114 sof shaklda: kartalar juft-juft turadi va faqat ISHORA bilan farq qiladi. Koeffitsiyentning kattaligi hech narsani hal qilmaydi — `0,5a⃗` ham, `7a⃗` ham bir xil yo'nalishda |
| 04 | A `Choice` | 🟡 | `which_length` | \|a⃗\| = 6. \|−3a⃗\| = **18** | `−18` (modul manfiy bo'lolmaydi — З114 ning modul tomoni), `3`, `9`. Razbor formulani ochadi: modul `\|k\|` ga ko'payadi, `k` ga emas |
| 05 | I `SwapOrder` | 🟡 | `midpoint_steps` | `OC⃗ = ½(OA⃗+OB⃗)` ni chiqarish: C — AB ning o'rtasi → `OC⃗ = OA⃗ + AC⃗` → `AC⃗ = ½AB⃗ = ½(OB⃗−OA⃗)` → qavsni ochib yig'amiz (`OC⃗ = ½(OA⃗+OB⃗)`) | З115 oxirgi qadamda tug'iladi: qavs ochilmasa yarim koeffitsiyent yo'qoladi. Uchinchi qadamni ikkinchisidan oldin qo'yish — `AC⃗` hali yozilmagan |
| 06 | E `TypeValue` | 🟡 | `midline` | Uchburchakning tomoni 14 sm. Unga parallel o'rta chiziq = **7** | `28` (ikkilandi — З115 ning teskari tomoni), `14`, `4`. T3 ning ikkinchi yarmi, va u 43-darsdan tanish |
| 07 | G `CodeLock` | 🟡 | `code_moduli` | \|a⃗\| = 4. Uch modul o'sish tartibida: \|0,5a⃗\| (2), \|−2a⃗\| (8), \|3a⃗\| (12) → kod **2, 8, 12** | bankda `4`, `6`, `−8`. `−8` — З114: manfiy koeffitsiyent modulga o'tkazildi. Uch koeffitsiyentdan bittasi manfiy va bittasi kasr: ikkalasi ham modulni MANFIY qilmaydi |
| 08 | H `ClozeBank` | 🔴 | `rule_words` | qoida: `k·a⃗` ning moduli **\|k\|·\|a⃗\|** ga teng; k musbat bo'lsa yo'nalish a⃗ bilan **bir xil**, k manfiy bo'lsa **teskari** | bankda tuzoq: «k·\|a⃗\|» (modulsiz koeffitsiyent — manfiy uzunlik beradi), «bir xil» uchinchi bo'shliqqa (З114), «perpendikulyar» |
| 09 | D `PairSlots` | 🔴 | `identity_to_result` | T2 ning uch tengligi: `(2+3)a⃗ ↔ 5a⃗`; `(2·3)a⃗ ↔ 6a⃗`; `2(a⃗+b⃗) ↔ 2a⃗+2b⃗` | birinchi ikki yozuvda o'sha ikki son va o'sha harf, farq faqat AMALDA — qo'shish va ko'paytirish. Uchinchisi taqsimot qonuni: koeffitsiyent qavs ichidagi HAR IKKALA vektorga tegadi |
| 10 | J `MatchPairs` 🖼 | 🔴 | `k_to_arrow` | To'rt juft: `2a⃗`, `−a⃗`, `−2a⃗`, `0,5a⃗` ↔ to'rt chizma. Har chizmada a⃗ siyoh rangda va natija urg'u rangida | З114 ko'z bilan: manfiy koeffitsiyent strelkani teskari buradi. `−a⃗` va `0,5a⃗` yonma-yon turadi — bittasi yo'nalishni, ikkinchisi uzunlikni o'zgartiradi, va ularni chalkashtirish oson |

**Qoplov.** T1 — 02, 03, 04, 07, 08, 10. T2 — 01, 09. T3 — 05, 06.
З114 — 02, 03, 04, 07, 08, 10. З115 — 05, 06. З16 — razborlar modulni son bilan
tekshiradi.
**Oldingi blokdan** — 06 da o'rta chiziq (43-dars).

**Harf.** `a⃗`, `b⃗`, `k`, `l`; `O`, `A`, `B`, `C` faqat 05 da.
Takrorlanmaydigan narsa — KOEFFITSIYENTLAR.

---

## 7. DARS 55 — VEKTOR KOORDINATALARI, SKALYAR KO'PAYTMA

Tasdiqlar `Dars55.jsx` dan: T1 — AB⃗ ning koordinatalari oxirining koordinatalaridan
boshining koordinatalarini ayirish natijasi; T2 — qo'shish, ayirish va songa
ko'paytirish mos koordinatalar ustida bajariladi; T3 — skalyar ko'paytma x₁x₂ + y₁y₂
ga teng SON, va |a⃗| = kvadrat ildiz(x² + y²).
Adashishlar: З16, З116 (tartib teskarilandi: boshidan oxiri ayirildi), З117 (skalyar
ko'paytma vektor sifatida yozildi).

Bu kursning oxirgi amaliyoti. Metodist qarori bo'yicha u faqat 55-darsning tasdiqlarini
tekshiradi (§0a.5).

| № | Tip | Qiy. | Teg | Nima tekshiriladi | Tuzoq / adashish |
|---:|---|:--:|---|---|---|
| 01 | C `TrueFalse` | 🟢 | `coord_claims` | «a⃗(3;4) ning moduli 5» → **Ha**; «a⃗(2;3) · b⃗(4;1) = 11» → **Ha** | ikkalasi ham ROST (§0a.1). Ikkinchisi qimmat: javob SON, va aynan shu uni xato qilib ko'rsatadi (З117). Razbor har birini hisoblab ko'rsatadi |
| 02 | F `MarkAll` | 🟢 | `coords_marked` | 6 yozuvdan 3 tasi to'g'ri: `(1;2)→(4;6): (3;4)`; `(5;1)→(2;7): (−3;6)`; `(0;3)→(4;3): (4;0)` | `(1;2)→(4;6): (−3;−4)` (З116), `(5;1)→(2;7): (3;6)` (birinchi koordinatada ishora yo'qoldi), `(0;3)→(4;3): (4;3)` (ikkinchi koordinata umuman ayirilmadi, nol chiqishi kerak edi) |
| 03 | A `Choice` | 🟢 | `which_coords` | A(2;5), B(7;1). AB⃗ = **(5;−4)** | `(−5;4)` (З116: tartib teskari), `(9;6)` (qo'shildi), `(5;4)` (ikkinchi koordinatada ishora tushib qoldi). Razbor tekshirishni aytadi: boshga koordinatalarni qo'shsak, oxiri chiqishi kerak |
| 04 | G `CodeLock` | 🟡 | `code_dot` | Uch skalyar ko'paytma, o'sish tartibida: `(2;−1)·(3;5)` (1), `(1;2)·(3;4)` (11), `(0;4)·(2;3)` (12) → kod **1, 11, 12** | bankda `−1`, `3`, `5`. Birinchi ko'paytma alohida: `6 + (−5) = 1` — natija ikki katta sondan kichik chiqadi, va bu manfiy koordinata borligidan. Uchinchisida nol ko'paytuvchi bor, lekin natija nol emas |
| 05 | D `PairSlots` | 🟡 | `op_to_coords` | a⃗(2;3), b⃗(3;4). Uch juft: `a+b ↔ (5;7)`; `a−b ↔ (−1;−1)`; `2a ↔ (4;6)` | T2: amal HAR koordinata ustida alohida bajariladi. Ayirmada ikkala koordinata ham manfiy chiqadi, va bu tasodif emas — b⃗ ning ikkala koordinatasi ham kattaroq |
| 06 | J `MatchPairs` | 🟡 | `vector_to_length` | To'rt juft: `(3;4) ↔ 5`; `(6;8) ↔ 10`; `(5;12) ↔ 13`; `(8;15) ↔ 17` | to'rttasi ham Pifagor uchligi (44-dars): modul — katetlari koordinatalar bo'lgan to'g'ri burchakli uchburchakning gipotenuzasi. Ikkinchisi birinchisining ikki barobari, va modul ham ikki barobar — bu T2 bilan bog'lanadi |
| 07 | H `ClozeBank` | 🟡 | `rule_words` | qoida: vektorning koordinatalari **oxirining** koordinatalaridan **boshining** koordinatalarini ayirish natijasi; skalyar ko'paytma esa **son** | bankda tuzoq: ikkovini almashtirish (З116), «vektor» (З117), «juftlik» |
| 08 | I `SwapOrder` | 🔴 | `dot_steps` | a⃗(2;3), b⃗(4;−1) uchun skalyar ko'paytma: mos koordinatalarni ko'paytiramiz (`2·4` va `3·(−1)`) → natijalarni yozamiz (`8` va `−3`) → qo'shamiz (`8 + (−3)`) → javob SON (`5`) | oxirgi qadam ataylab alohida: З117 aynan shu joyda o'ladi — ikki ko'paytma yozilgandan keyin ular QO'SHILADI, juftlik bo'lib qolmaydi. Qo'shishni ko'paytirishdan oldin qo'yish — qo'shiladigan narsa hali yo'q |
| 09 | E `TypeValue` | 🔴 | `dot_value` | a⃗(5;−2) · b⃗(3;4) = **7** | `23` (`15 + 8` — ikkinchi ko'paytmada ishora yo'qoldi), `−7`, `15` (bitta ko'paytma yozildi). Razbor ikki ko'paytmani alohida yozib, ishorani ko'rsatadi |
| 10 | B `Zones` | 🔴 | `number_or_vector` | 8 karta ikki zonaga: NATIJA SON / NATIJA VEKTOR. Son: `a⃗·b⃗`, `\|a⃗\|`, `a⃗·a⃗`, `\|a⃗+b⃗\|`; vektor: `a⃗+b⃗`, `a⃗−b⃗`, `3a⃗`, `a⃗+2b⃗` | З117 sof shaklda, va bu kursning oxirgi topshirig'i. Ikki belgi ajratadi: nuqta va modul chiziqlari SON beradi, qo'shish va songa ko'paytirish esa VEKTOR. `\|a⃗+b⃗\|` eng qiyini: ichida vektor amali turibdi, lekin natija baribir son |

**Qoplov.** T1 — 02, 03, 07. T2 — 05, 06. T3 — 01, 04, 06, 07, 08, 09, 10.
З116 — 02, 03, 07. З117 — 01, 07, 08, 10. З16 — razborlar koordinatalarni qo'shib
qaytadan tekshiradi.
**Oldingi blokdan** — 06 da Pifagor teoremasi (44-dars): modul aynan shundan chiqadi.

**Harf.** `a⃗`, `b⃗`, `A`, `B`; koordinatalar `(x; y)` nuqtali vergul bilan —
darslikning yozuvi.
Takrorlanmaydigan narsa — KOORDINATA JUFTLIKLARI.

---

## 8. NIMA O'ZGARADI UMUMIY QATLAMDA

| Fayl | O'zgarish | Sabab |
|---|---|---|
| `practice/fig.jsx` | `vec` turi va `circ` ga `radii` (additiv) | §0a.2, metodist tasdiqladi |
| `practice/fig.jsx` | `circ` ga `verts`, `tang`, `cev`, `plain`; `vec` ga `segs` | §11.2, yig'ishda kerak bo'ldi |
| `scripts/grade8-practice-seq.mjs` | `SEQ` ga 51-55 qatorlari | §1 |
| `scripts/grade8-practice-plan.mjs` | `PLAN_51` … `PLAN_55` va `LESSONS` qatorlari | tekshiruv javoblarni shu moduldan oladi |
| `src/lessons/grade8.js` | `grade8Amaliy` ga beshta yozuv | reyestrsiz amaliyot ochilmaydi |
| `practice/kit.jsx` | **tegilmaydi** | o'nta mexanika o'zgarmaydi |

**Bu KURSNING OXIRGI beshligi.** 51-55 yig'ilgandan keyin 8-sinfning 55 darsi ham,
550 amaliyot topshirig'i ham to'liq bo'ladi. LMS paketi esa CLAUDE.md §5 bo'yicha
alohida buyruq bilan yig'iladi — o'z tashabbusi bilan emas.

---

## 9. TEKSHIRUV

```powershell
node scripts/grade8-practice-seq.mjs check      # taqsimot shartlari
npx vite --port 5199                            # alohida terminalda
node scripts/grade8-practice-check.mjs          # to'g'ri javob bilan 10/10 + skrollsiz
G8_WRONG=1 node scripts/grade8-practice-check.mjs   # razbor bo'shmi
node scripts/grade8-practice-lang.mjs           # UZ da kirillcha va apostrof
npx eslint src/components/grade8/practice
npm run build
```

31-40 blokining tajribasi (o'sha skelet §16): razborning uzunligini oldindan
cheklash kerak — telefonda rus tilidagi matn eng uzun chiqadi, va chizmali
topshiriqlarda kadr ham joy oladi. Shuning uchun bu beshlikda razborlar boshidanoq
qisqaroq yoziladi, chizmalarning kadri esa `MarkAll` da 86×60 dan oshmaydi.

---

## 10. TASDIQ

Metodist 2026-08-25 da skeletni tasdiqladi va bitta topshiriq qo'shdi:
**«chizma talab qilinadigan darslarda misollarga chizma qo'shaver»**. Shu
sababli §0a.2 ning «52-dars chizmasiz qoladi» degan bandi BEKOR QILINDI: 52
ham chizmali bo'ldi, va chizma boshqa darslarda ham kengaytirildi (§11.1).

---

## 11. YIG'ISHDA NIMA O'ZGARDI (3-etap yozuvi)

### 11.1. CHIZMA BESH JOYDAN YIGIRMA OLTI JOYGA CHIQDI

Skeletning §2 tabeli beshta chizmani sanagan edi. Metodistning topshirig'idan
keyin chizma **yigirma olti topshiriqda** turadi. Sanoq tasodifiy emas:
`TIPLAR_AMALIYOT_8SINF.md` §7 ning 7-qoidasi geometriya darslarida (37-55)
chizma o'nta pozitsiyadan **5-7 tasini** olishini talab qiladi, va beshala
dars endi shu oraliqda — 5, 6, 5, 5, 5:

52/02 da chizma bor edi va o'chirildi: u topshiriqda sakkiz karta ikki
qatorda, ikki zona va razbor turadi, telefonda esa chizmaga joy qolmaydi.
Sig'adigan o'lchamda (42px) aylananing tomonlarga urinishi ko'rinmay qoladi,
ya'ni chizma o'z ishini bajarmaydi. Razborni qisqartirish yo'li yopiq, shu
sababli chizma yon berdi. O'sha figura 52/09 da to'liq o'lchamda turadi.

| Dars | Chizmali topshiriqlar | Chizma nima qiladi |
|---:|---|---|
| 51 | 01, 03, 06, 07, 10 | ichki va markaziy burchakni ajratadi, tiralgan yoyni ko'rsatadi |
| 52 | 01, 03, 04, 05, 09, 10 | «ichki» va «tashqi» degan ikki iborani ajratadi, bissektrisalarni punktir bilan beradi |
| 53 | 01, 02, 03, 07, 10 | strelka: teng vektorlar, uchburchak qoidasi, ayirma |
| 54 | 01, 03, 05, 06, 10 | a⃗ va b⃗ ning yo'nalishi, o'rtaga tortilgan vektor, o'rta chiziq, k·a⃗ |
| 55 | 02, 03, 05, 09, 10 | koordinata to'ri: surilishni katak bilan sanash mumkin |

### 11.2. `fig.jsx`: IKKITA TASDIQLANGAN, UCHTASI YIG'ISHDA QO'SHILDI

Metodist ikkitasini tasdiqlagan edi (`vec` va `circ.radii`). Yig'ishda yana
uchtasi kerak bo'ldi, va uchalasi ham o'sha ikki qarorning davomi:

- **`circ.verts` va `circ.tang`** — aylanaga ichki yoki tashqi chizilgan
  ko'pburchak, hamda **`circ.cev`** — punktir bissektrisalar va o'rta
  perpendikulyarlar. Bularsiz 52-dars chizmasiz qolardi. Hammasi GRADUS bilan
  beriladi, ya'ni `circ` ning bor modelidan chiqmaydi.
- **`circ.plain`** — hamma chiziqni siyoh rangida chizadi. Sababi 51/03 da
  topildi: vatarlar urg'u rangida, radiuslar siyoh rangida edi, va o'quvchi
  ichki burchakni geometriyaga emas, RANGGA qarab tanlay olardi. Rang javobni
  ochib qo'ymasligi kerak.
- **`vec.segs`** — strelkasiz kesma (54/05 da AB kesmasi kerak edi).

### 11.3. UCHTA MAZMUN NUQSONI — HAMMASI KADRGA QARAB TOPILDI

Bular o'lchov emas, MAZMUN xatolari, va ularni faqat chizmani ko'rib topish
mumkin:

1. **51/03 da rang javob berib qo'yardi** (§11.2). Ustiga faqat ichki
   chizilgan burchaklarda `B` harfi turgan edi — o'quvchi harfga qarab
   tanlashi mumkin edi. Nomlar olib tashlandi, hamma chiziq bir rangda.
2. **52/05 da uchburchak TENG TOMONLI chiqdi.** Teng tomonli uchburchakda
   bissektrisa, mediana, balandlik va o'rta perpendikulyar ustma-ust tushadi,
   ya'ni chizma to'rt variantning HECH BIRINI rad eta olmasdi. Uchburchak
   turli tomonli qilindi (52/03 va 52/10 da ham).
3. **54/10 da `0,5a` ko'rinmay qolgan edi.** Solishtiruvchi a⃗ va natija bitta
   nuqtadan chiqardi, va yarim uzunlikdagi strelka a⃗ ning tagida butunlay
   yashirinardi. Endi ular yonma-yon parallel turadi.

### 11.4. KADRDAN CHIQISH — SAKKIZ TOPSHIRIQDA, VA BITTA XATO YO'L

31-40 blokining tajribasi takrorlandi, lekin bu safar sabab boshqa: u yerda
matn uzun edi, bu yerda esa CHIZMA katta edi. Kadrdan chiqqani: 51/10, 52/02,
52/07, 52/08, 52/09, 53/02, 54/10, 55/05. Eng og'iri 54/10 (ruscha 58px) va
53/02 (kichik telefonda 59px).

**Men avval xato yo'ldan bordim.** Kadrni to'g'rilash uchun chizmani
kichraytirdim VA razborlarni qisqartirdim. Ikkinchisi metodistning aniq
qaroriga zid: 41-50 blokini ko'rgandan keyin u qirq beshta qisqartirilgan
razborni qaytartirgan va «razborning uzunligi metodik qaror, kadr esa texnik
cheklov» degan. Sakkizta razbor asl holiga TIKLANDI, kadr esa faqat chizma
hisobiga to'g'rilandi.

**Qoida shu bo'lib qoldi:** kadr yetmasa, uch narsaga qarash mumkin —
chizmaning o'lchami, joylashuvning nuqsoni, tekshiruvning talabi. Metodik
matn bu ro'yxatda YO'Q.

**Yangi o'lchov qoidasi:** `Zones` va `MatchPairs` da chizmali karta
**46-78px** dan oshmasligi kerak — undan kattasi razbor bilan birga kadrga
sig'maydi. `PairSlots` va `Zones` ning `given` chizmasi 58-70px,
`Choice`/`SwapOrder`/`TypeValue` ning `expr` ida esa 150px gacha
bemalol turadi. Kadrni kichraytirganda `poly` va `vec` ning
koordinatalarini shu nisbatda masshtablash SHART: ular xom viewBox
koordinatasida ishlaydi.

### 11.4a. RAZBORNING CHUQURLIGI — O'LCHOV

Tiklangandan keyin bu beshlikning to'g'ri javob razborlari o'rtacha **354
belgi**, eng uzuni 491. Taqqoslash uchun 41-50 blokida (metodist razborlarni
qaytartirgandan keyingi holat) o'rtacha **539 belgi**, eng uzuni 814.

Ya'ni mening razborlarim uy standartidan uchdan bir qismga qisqaroq. O'ntasi
uch yuz belgidan qisqa, eng qisqasi 51/02 (169 belgi). 41-50 ning uslubi
uch qismdan iborat: usulni aytish, NEGA aynan shu usul ekanini tushuntirish,
keyin misolni oxirigacha hisoblab ko'rsatish. Menda ba'zi joyda o'rtadagi
qism yo'q.

O'ntasini bir-bir o'qib chiqdim: to'qqiztasida uch qism ham bor, ular
shunchaki ixchamroq yozilgan. Faqat BITTASIDA — 51/02 da — o'rtadagi qism
haqiqatan yo'q edi (169 belgi: usul va tekshirish, sababsiz). U
kengaytirildi va 538 belgi bo'ldi.

Qolgan to'qqiztasi tegilmadi: ularni uzaytirish mazmun qo'shmasdan belgi
qo'shish bo'lardi. Agar 41-50 ning chuqurligi qat'iy talab bo'lsa, ayting —
qaysi biriga nima yetishmayotganini ko'rsatib kengaytiraman.

### 11.5. TEKSHIRUVNING NATIJASI

Beshta darsning har biri ikki rejimda ham toza: to'g'ri javob bilan 10/10 va
skrollsiz (5 o'lcham × 3 til × 10 topshiriq = 150 o'tish), noto'g'ri javob
bilan esa ball berilmaydi va razbor uch tilda ham bo'sh emas. Jami o'nta
o'tish, 1500 tekshiruv.

Oxirgi holat razborlar TIKLANGAN va chizmalar qo'yilgandan keyin o'lchandi,
ya'ni bu raqamlar hozirgi kontentga tegishli.

`npm run build`, `eslint`, `grade8-practice-lang.mjs` (609 fayl) va
`grade8-practice-seq.mjs check` — hammasi yashil.

### 11.6. NIMA QILINMADI

`TIPLAR_AMALIYOT_8SINF.md` §7 ga ha/yo'q qoidasi hali yozilmadi (31-40
skeleti §16.5 da ham shu yozuv turibdi). U alohida hujjatga tegadi va
metodistning ayni shu bandga ruxsatini kutadi.
