# 4-sinf amaliyoti, 31-40 darslar — blok skeleti

> 1-etap hujjati (CLAUDE.md §3.1). Bu yerda 10 amaliyotning 100 topshirig'i
> belgilanadi: daraja, janr, mexanika, skillTag, chizma, mazmun va qaysi xato
> modelini ushlashi. Kontent (RU/UZ/EN to'liq matnlar) 2-etapda yoziladi.
>
> Manbalar: `ETALON_4SINF.md` §9, §12; `4sinf_metodologiya.md` §7, §13;
> `src/books/grade3/TIPLAR_AMALIYOT_3SINF.md` §1A, §3, §5 (mexanika kontrakti va
> raskladka qoidasi); `Dars01Practice.jsx` (dizayn etaloni);
> `scripts/grade4-practice-22-30-audit.mjs` (texnik kontrakt).

---

## 1. NIMA O'ZGARADI 22-30 GA NISBATAN

**1.1. Mexanika o'qi ochiladi.** 22-30 amaliyotlarining hammasi bir xil beshlikda
ishlaydi: `mc · match · order · numpad · missing`. Pozitsiyalar ham deyarli qotib
qolgan, ya'ni bola topshiriq nomeriga qarab mexanikani taxmin qiladi. 3-sinf
kontrakti buni taqiqlaydi (§5, U1-U7). 31-40 da raskladka skript bilan
hisoblanadi: `scripts/grade4-practice-31-40-layout.mjs`.

**1.2. Chizma majburiy bo'ladi.** 22-30 da `visual` — oq quti ichidagi bitta
matn qatori. 31-40 mavzulari geometriya: burchak, transportir, uchburchak,
koordinata burchagi, yoyilma. Ularni matn bilan berib bo'lmaydi. Shuning uchun
har darsda kamida ikkita **chizma mexanikasi** turadi (`sort`, `slots`, `shade`,
`ticks`, `placepick`, `construct`) va har topshiriqda haqiqiy SVG chizma bo'ladi.

**1.3. Chizmalar dars fayli ichida yoziladi.** Nazariy darslarda tegishli
figuralar bor (masalan `AngleSvg` — `Dars33.jsx:1961`), lekin amaliyot fayli
lokal import qilolmaydi: LMS darsni bitta avtonom `.jsx` sifatida qabul qiladi.
Bu CLAUDE.md §5 dagi nusxa taqiqiga zid emas — LMS kontrakti shuni majbur
qiladi; har faylda izohda yozib qo'yiladi.

**1.4. O'zgarmaydigan narsa.** Dizayn, ranglar, tipografika, tugma geometriyasi,
progress gradienti, feedback ranglari — `Dars01Practice.jsx` dan. Texnik kontrakt
(10 topshiriq, 2/5/3, SCREEN_META, uch pog'onali yordam, LMS payload, guardlar,
44px, `100dvh`, reduced-motion, UZ/RU/EN) — 22-30 avlodidan.

---

## 2. RASKLADKA

Qiyinlik o'qi va janr o'qi **qotgan**, mexanika o'qi har darsda boshqacha.

| pozitsiya | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| daraja | 🟢 | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🔴 | 🔴 | 🔴 |
| janr (§13) | tanib olish | tayanch bilan qo'llash | tasvirlar orasida o'tish | hisoblash, o'lchash, yasash | tushib qolganini tiklash | matnli masala | saralash, moslashtirish, tartib | chegaraviy holat, tuzoq | xato tahlili | ko'chirish, strategiya |

| dars | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **31** | mc | order | match | slots | numpad | sign | slots | missing | match | numpad |
| **32** | sign | numpad | shade | order | missing | numpad | match | mc | shade | match |
| **33** | match | order | mc | ticks | sign | missing | order | sort | ticks | missing |
| **34** | mc | missing | ticks | placepick | numpad | order | match | missing | placepick | order |
| **35** | match | order | sort | slots | missing | match | sort | mc | order | missing |
| **36** | mc | missing | match | order | slots | mc | order | sort | slots | match |
| **37** | sign | numpad | mc | shade | missing | order | match | mc | order | shade |
| **38** | match | missing | construct | slots | mc | missing | slots | sort | construct | order |
| **39** | mc | placepick | match | construct | slots | order | match | missing | placepick | slots |
| **40** | match | missing | construct | numpad | mc | missing | order | mc | sort | construct |

Skript bajaradigan shartlar (`--check`):

- **Q1.** Qo'shni darslarda bir xil pozitsiya bir xil mexanikani olmaydi.
- **Q2.** Har bankda kamida 5 xil mexanika (etalon 4 talab qiladi, zapas bilan).
- **Q3.** Bitta mexanika bankda ikkitadan ko'p emas.
- **Q4.** Qo'shni pozitsiyalar har xil.
- **Q5.** 1-topshiriq — browser-solver `wrong-first` tekshiruvini qo'llaydigan va
  boshqarishni o'rgatishni talab qilmaydigan mexanika (`mc`, `sign`, `numpad`,
  `match`, `order`).
- **Q6.** Har bankda kamida ikkita chizma mexanikasi.
- **Q7.** Bank ichida hech bir qo'shni juftlik takrorlanmaydi (ritmni buzadi).
- **Q8.** Bitta mexanika bitta pozitsiyada 10 darsdan ko'pi bilan 4 tasida
  turadi — ikki mexanikaning navbatma-navbat almashishi ham ritm.

Raskladka — **muallifga topshiriq, taqiq emas**. Agar mexanika aniq topshiriqqa
yotmasa, muallif boshqasini qo'yadi va sababini izohda yozadi; validator bunday
chetlashishni alohida ro'yxatda ko'rsatadi, tekshiruvni yiqitmaydi.

---

## 3. MEXANIKALARNING DOM KONTRAKTI

Browser-solver (`scripts/grade4-trilingual-browser-smoke.mjs`) topshiriqni o'zi
yechadi, shuning uchun DOM va ma'lumot shakli qat'iy.

| mexanika | ma'lumot | DOM selektor |
|---|---|---|
| `mc`, `sign` | `options[{id,text,correct,wrong}]`, bitta `correct` | `.p4-options button` |
| `missing` (variantli) | `options[…]`, `answer` yo'q | `.p4-missing button` |
| `missing` (sonli), `numpad` | `answer` — satr | `.p4-pad-keys button` |
| `match` | `pairs[{id,left,correctRight}]`, `right[{id,text}]` | `.p4-match-col:first-child button` / `:last-child button` |
| `order` | `steps[]`, `cards[{id,text,order}]` | `.p4-order-slots button` + `.p4-card-bank button` |
| `slots` | `slots[{label,correct}]`, `cards[{id,text}]` | `.p4-slot-list .p4-slot` + `.p4-card-bank .p4-card` |
| `sort` | `bins[{id,label}]`, `items[{text,bin}]` | `.p4-sort-pool button` + `.p4-sort-bin-head` |
| `construct` | `answer` — kartalar ketma-ketligi | `.p4-card-bank button` |
| `ticks` | `answer` — shkaladagi qiymat | `.p4-scale-tick button` |
| `placepick` | `places[{…,correct}]` | `.p4-place-grid button` |
| `shade` | `selectCount` | `.p4-cells button` |

**`shade` haqida ogohlantirish.** Tekshiruv faqat **sonni** solishtiradi
(`selected.length === selectCount`), qaysi kataklar bo'yalganini emas. Shuning
uchun `shade` topshirig'i har doim "nechta" savolini beradi: "bir qatorda nechta
katak bor — shunchasini bo'yang". Aks holda topshiriq yolg'on tekshiradi.

---

## 4. CHIZMA VA ANIMATSIYA KONTRAKTI

1. Ekran tartibi: eyebrow (daraja + topshiriq) → shart → **savol** → chizma →
   javob maydoni → tahlil → qoida. Bola avval nima so'ralayotganini biladi.
2. Chizma **haqiqiy**: burchak gradus bo'yicha yasaladi, transportir shkalasi
   o'qiladigan, koordinata to'ri sanaladigan, yoyilma buklanadigan. Sxematik
   o'rinbosar va emoji yo'q.
3. Chizma **yechimning birinchi qadamini bermaydi**. Burchak turi chizmada
   yozilmaydi, yuza kataklari oldindan bo'yalmaydi.
4. Matn chizmaga so'z bilan tayanmaydi ("rasmda ko'rsatilgan" yo'q) — topshiriq
   chizmasiz ham o'qiladi. Istisno: javob faqat chizmadan olinadigan holatlar
   (`ticks`, `placepick`).
5. Animatsiya **javobni ochmaydi**: paydo bo'lish (prujina, kaskad 0.04 s),
   shkalada yurgan yorug'lik, savol belgisining tebranishi. To'g'ri javobdan
   keyin: bir marta tasdiq to'lqini va natijaning chizmada yig'ilishi
   (perimetr → yuza, qatlam → hajm, yoyilma → jism).
6. Hammasi `prefers-reduced-motion: reduce` da o'chadi.
7. Sahna kunduzgi va yorug' — `#F5F5F0` fon, `#FFFFFF` figure kartasi.

---

## 5. TOPSHIRIQ BANKLARI

Sonlar nazariy darsdan **boshqa**. Faktik o'zgarmaslar (90°, 180°, kubdagi
6/12/8, 1 dm³ = 1000 cm³, koordinata boshi) takrorlanadi — bu son emas, mavzuning
o'zi.

### 5.1. Dars 31 — Kattaliklarga doir masalalar

Yadro: aralash birlikli yozuv; uch qadam (bitta birlikka keltir → amalni bajar →
o'qishga qulay birlikka qaytar) va **tekshiruv**.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | mc | `finished_record` | to'rt yozuv kartasi | Qaysi yozuv tugallangan? **8 m 35 cm**; 7 m 135 cm; 6 m 240 cm; 5 m 100 cm | `unfinished-record` |
| 02 | 🟢 | order | `three_step_method` | qadam yo'lakchasi | 5 m 60 cm + 2 m 70 cm: "maqsad birlik cm" → "560 + 270" → "830 cm" → "8 m 30 cm" | `step-order-broken` |
| 03 | 🟡 | match | `mixed_to_single_unit` | ikki ustunli yozuv jadvali | 3 kg 40 g↔3040 g; 2 t 8 kg↔2008 kg; 1 soat 25 min↔85 min; 6 m 4 cm↔604 cm | `mixed-unit-slip` |
| 04 | 🟡 | slots | `mixed_subtraction_borrow` | yechim blankasi | 7 m 15 cm − 2 m 60 cm: maqsad birlik `cm` / 715 cm / 260 cm / **4 m 55 cm** | `borrow-in-wrong-unit` |
| 05 | 🟡 | numpad | `missing_addend_mixed` | tarozi shkalasi, bir tomoni bo'sh | □ + 1 kg 850 g = 5 kg 200 g. Javob grammda: **3350** | `inverse-operation` |
| 06 | 🟡 | sign | `operation_from_relation` | yuk ustunlari | 2 t 350 kg va 1 t 780 kg chiqdi. Chiqqan yukni 4 t bilan solishtiring: **>** (4130 kg) | `keyword-operation` |
| 07 | 🟡 | slots | `solution_protocol` | to'rt qatorli bayonnoma | 4 kg 200 g − 1 kg 650 g: "4200 g va 1650 g" / "4200 − 1650" / "2 kg 550 g" / "tekshiruv: 2550 + 1650 = 4200" | `strategy-without-check` |
| 08 | 🔴 | missing | `zero_small_part` | qo'shish yozuvi | 3 m 55 cm + 4 m 45 cm javobi: **8 m**; 7 m 100 cm; 8 m 100 cm; 80 m | `unfinished-record` |
| 09 | 🔴 | match | `error_diagnosis` | uch xato yozuv | "6 m 140 cm"↔tugallanmagan yozuv; "2 kg 40 g − 1 kg 60 g = 1 kg 20 g"↔qismlar alohida ayirildi, qarz olinmadi; "3 soat 20 min = 320 min"↔raqamlar yopishtirildi | `unfinished-record`, `borrow-in-wrong-unit`, `mixed-unit-slip` |
| 10 | 🔴 | numpad | `inverse_transfer` | sim g'altagi | 12 m simdan 3 m 75 cm va 4 m 90 cm kesildi. Qolgani santimetrda: **335** | `unreasonable-answer` |

### 5.2. Dars 32 — Hajm birliklari

Yadro: hajm — birlik kublar soni; qatlam usuli; har qadam 1000 barobar, chunki
qirra 10 barobar uzayadi; 1 dm³ = 1 l.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | sign | `volume_unit_reading` | sensor tablosi | Sensor 4000 cm³ berdi. Uni 4 l bilan solishtiring: **=** | `unit-name-swap` |
| 02 | 🟢 | numpad | `layer_count` | 5×3 poydevor, 4 qatlam kub | Jami nechta birlik kub? **60** | `added-layers-instead-of-multiplying` |
| 03 | 🟡 | shade | `layer_model` | 6 ustun × 4 qator kesim to'ri | Bitta qatlamda nechta kub — shunchasini bo'yang: **6** | `added-layers-instead-of-multiplying` |
| 04 | 🟡 | order | `volume_procedure` | quti chizmasi 8×5×3 cm | "poydevor 8 × 5" → "bir qatlam 40 kub" → "qatlam 3 ta" → "120 cm³" | `sum-instead-of-product` |
| 05 | 🟡 | missing | `cubic_step` | birlik kub narvoni | 7 dm³ = □ cm³ → **7000** | `length-step-instead-of-volume-step` |
| 06 | 🟡 | numpad | `volume_word_problem` | bak va suv sathi | Bak 9 dm³, ichida 4 l suv. Yana necha litr sig'adi? **5** | `unit-name-swap` |
| 07 | 🟡 | match | `volume_equivalence` | birlik kartalari | 3 dm³↔3000 cm³; 2 m³↔2000 dm³; 5 l↔5 dm³; 6000 cm³↔6 l | `unit-name-swap` |
| 08 | 🔴 | mc | `dimension_sum_trap` | qirrasi belgilangan kub | Qirrasi 4 cm bo'lgan kubning hajmi: **64 cm³**; 12 cm³; 16 cm³; 96 cm³ | `sum-instead-of-product` |
| 09 | 🔴 | shade | `zero_count_error` | nol lentasi (4 katak) | "8 dm³ = 8 cm³" deb yozilgan. Yetishmagan nollarni bo'yang: **3** | `zero-count-slip` |
| 10 | 🔴 | match | `inverse_volume_transfer` | jism va qirra kartalari | hajmi 1000 cm³ kub↔qirrasi 10 cm; 1 l suv↔1 dm³; hajmi 27 cm³ kub↔qirrasi 3 cm; 2000 dm³↔2 m³ | `inverse-conversion` |

### 5.3. Dars 33 — Burchak turlari

Yadro: burchakni **ochilish** o'lchaydi, tomon uzunligi emas; 90° asosiy o'lchov.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | match | `angle_type_recognition` | 4 burchak, tomonlari **atayin har xil uzunlikda** | 55°↔o'tkir; 90°↔to'g'ri; 115°↔o'tmas; 180°↔yoyiq | `ray-length-decides` |
| 02 | 🟢 | order | `comparison_rule` | qadam yo'lakchasi | "burchakni topamiz" → "90° bilan solishtiramiz" → "kichik, katta yoki teng" → "turini aytamiz" | `type-without-reason` |
| 03 | 🟡 | mc | `description_to_type` | tavsif kartasi, chizmasiz | 105° ga ochilgan burchak: **o'tmas**; o'tkir; to'g'ri; yoyiq | `bigger-than-90-called-right` |
| 04 | 🟡 | ticks | `read_angle_scale` | 0-180 shkala va burchak | Shkaladan o'qing: **65** | `range-vs-value` |
| 05 | 🟡 | sign | `compare_with_right_angle` | 155° burchak va 90° etalon | 155° □ 90° → **>** | `bigger-than-90-called-right` |
| 06 | 🟡 | missing | `angle_complement` | tom qiyaligi | 25° ni 90° ga to'ldirish uchun yana qancha kerak: **65°**; 115°; 25°; 155° | `added-instead-of-subtracted` |
| 07 | 🟡 | order | `order_by_opening` | 4 burchak, tomonlari chalg'itadi | Ochilishi bo'yicha o'sish tartibi: 15°, 75°, 110°, 165° | `ray-length-decides` |
| 08 | 🔴 | sort | `boundary_sort` | 4 chegaraviy burchak | Bins: o'tkir / to'g'ri / o'tmas / yoyiq. Items: 89°, 90°, 91°, 180° | `bigger-than-90-called-right`, `straight-vs-full-turn` |
| 09 | 🔴 | ticks | `scale_read_error` | ikki shkalali transportir | Burchak 115°, Bit 65° o'qidi. To'g'risini shkalada ko'rsating: **115** | `read-the-other-scale` |
| 10 | 🔴 | missing | `transfer_from_description` | soat siferblati 6:00 | Soat millari hosil qilgan burchak: **yoyiq**; to'g'ri; o'tkir; to'liq burilish | `straight-vs-full-turn` |

### 5.4. Dars 34 — Burchaklarni yasash

Yadro: transportirning uch qismi — markaz uchda, asos chizig'i birinchi tomonda,
shkala noli o'sha tomonda bo'lganidan o'qiladi; javob tur bilan tekshiriladi.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | mc | `protractor_centre` | transportir va burchak | Markaz qayerga qo'yiladi: **burchak uchiga**; tomon o'rtasiga; tomon oxiriga; shkala noliga | `centre-off-vertex` |
| 02 | 🟢 | missing | `base_line_alignment` | markaz qo'yilgan holat | Keyingi qadam: **asos chizig'ini birinchi tomonga moslash**; ikkinchi tomonga; gorizontga; shkalaga | `tool-not-aligned` |
| 03 | 🟡 | ticks | `read_from_correct_scale` | transportir, noli o'ng tomonda | Yasalgan burchakni o'qing: **75** | `wrong-scale-side` |
| 04 | 🟡 | placepick | `place_the_centre` | chizmada 4 nomzod nuqta | Markazni qo'yish nuqtasini tanlang (burchak uchi) | `centre-off-vertex` |
| 05 | 🟡 | numpad | `other_scale_value` | ikki shkala yonma-yon | Bir shkalada 65 turadi. Ikkinchisida shu joyda: **115** | `read-the-other-scale` |
| 06 | 🟡 | order | `construction_order` | buyurtma varaqasi 105° | "nurni chizamiz" → "markazni uchga qo'yamiz" → "asos chizig'ini nurga moslaymiz" → "noli shu tomondagi shkaladan 105° ni belgilaymiz" | `step-order-broken` |
| 07 | 🟡 | match | `type_as_check` | 4 yasalgan burchak | 50°↔o'tkir; 90°↔to'g'ri; 115°↔o'tmas; 180°↔yoyiq | `repeat-the-same-path` |
| 08 | 🔴 | missing | `zero_side_boundary` | transportir teskari qo'yilgan | Nol chap tomonda, shkalada 85 turadi. Yasalgan burchak: **95°**; 85°; 90°; 175° | `always-outer-scale` |
| 09 | 🔴 | placepick | `error_in_placement` | markaz uchdan siljigan chizma | Markaz qayerda turishi kerak edi — ko'rsating | `centre-off-vertex` |
| 10 | 🔴 | order | `transfer_next_step` | devor burchagi 90°, keyin 35° nishab | Yangi buyurtmada shu bayonnomani qaytadan tartibga solish | `step-order-broken` |

### 5.5. Dars 35 — Uchburchak turlari

Yadro: bitta uchburchakka **ikkita nom** — burchaklar bo'yicha (eng katta burchak
hal qiladi) va tomonlar bo'yicha (nechta tomon teng).

**Diqqat, matematik aniqlik.** "Teng tomonli" va "teng yonli" ni bir-birini rad
etuvchi qutilarga bo'lish yolg'on model beradi. Shuning uchun `sort` qutilari
xossa bilan nomlanadi: "uchta tomoni teng", "faqat ikkita tomoni teng", "hech bir
tomoni teng emas".

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | match | `two_name_recognition` | 3 uchburchak, burchaklari yozilgan | (75°,60°,45°)↔o'tkir burchakli; (90°,65°,25°)↔to'g'ri burchakli; (115°,40°,25°)↔o'tmas burchakli | `majority-of-angles` |
| 02 | 🟢 | order | `naming_order` | blanka ikki qatori | "eng katta burchakni topamiz" → "burchaklar bo'yicha nomni yozamiz" → "teng tomonlarni sanaymiz" → "tomonlar bo'yicha nomni yozamiz" | `one-name-is-enough` |
| 03 | 🟡 | sort | `sort_by_sides` | 3 uchburchak, tomonlari o'lchamlangan | Bins: uchta tomoni teng / faqat ikkita tomoni teng / hech biri teng emas. Items: (6,6,6), (7,7,4), (5,8,9) | `equal-two-versus-three` |
| 04 | 🟡 | slots | `fill_both_names` | ferma blankasi, (90°,45°,45°) | Slots: "burchaklar bo'yicha" / "tomonlar bo'yicha". Cards: to'g'ri burchakli / faqat ikkita tomoni teng (+ chalg'ituvchilar) | `one-name-is-enough` |
| 05 | 🟡 | missing | `two_right_angles` | blankaning bo'sh qatori | Bir burchagi 90°. Qolgan ikkitasi: **ikkalasi ham o'tkir**; bittasi to'g'ri; bittasi o'tmas; ikkalasi to'g'ri | `two-right-angles` |
| 06 | 🟡 | match | `truss_selection` | uch buyurtma varaqasi | "ikki yoni bir xil qiya"↔teng yonli ferma; "burchagi to'g'ri"↔to'g'ri burchakli; "hamma tomoni teng panjara"↔teng tomonli | `measure-what-is-already-known` |
| 07 | 🟡 | sort | `sort_by_angles` | 3 uchburchak, eng katta burchagi belgilangan | Bins: o'tkir / to'g'ri / o'tmas burchakli. Items: 78°, 90°, 105° | `majority-of-angles` |
| 08 | 🔴 | mc | `impossible_triangle` | to'rt tavsif kartasi | Bo'lishi mumkin emas: **ikkita to'g'ri burchakli**; o'tmas va teng yonli; to'g'ri burchakli va teng yonli; o'tkir va teng tomonli | `two-right-angles` |
| 09 | 🔴 | order | `repair_naming_order` | Bit to'ldirgan blanka | Bit "o'tkir burchakli" deb yozdi, chunki ikki burchak o'tkir. Tuzatish: "eng katta burchakni topamiz" → "u 112°" → "demak o'tmas burchakli" → "tomonlarni sanab ikkinchi nomni yozamiz" | `majority-of-angles` |
| 10 | 🔴 | missing | `name_from_description` | chizmasiz tavsif | Uchta tomoni ham 9 cm. Burchaklari: **uchtasi ham o'tkir va teng**; bittasi to'g'ri; bittasi o'tmas; aniqlash mumkin emas | `measure-what-is-already-known` |

### 5.6. Dars 36 — To'g'ri to'rtburchak va kvadrat

Yadro: kvadrat — **maxsus** to'g'ri to'rtburchak; kvadratlar to'plami to'g'ri
to'rtburchaklar to'plami ichida turadi.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | mc | `extra_property` | kvadrat va to'g'ri to'rtburchak yonma-yon | Kvadratda ORTIQ nima bor: **to'rtta tomoni ham teng**; to'rtta to'g'ri burchak; qarama-qarshi tomonlari teng; to'rtta tomon | `shared-property-mistaken-for-special` |
| 02 | 🟢 | missing | `restore_property_line` | xossa jadvali, bir qatori bo'sh | Kvadrat, "tomonlar" qatori: **to'rttasi teng**; qarama-qarshilari teng, qo'shnilari har xil; hech biri teng emas; ikkitasi teng | `sides-only-check` |
| 03 | 🟡 | match | `figure_to_statement` | 3 figura: kvadrat 5 dm, to'g'ri to'rtburchak 7×3 dm, romb 5 dm/70° | figura↔to'g'ri gap: "to'g'ri to'rtburchak ham"; "kvadrat emas"; "burchaklari to'g'ri emas" | `equal-sides-are-enough` |
| 04 | 🟡 | order | `panel_check_order` | tekshiruv bayonnomasi | "burchaklarni tekshiramiz" → "to'rttasi to'g'rimi" → "tomonlarni tekshiramiz" → "to'rttasi tengmi" | `early-conclusion` |
| 05 | 🟡 | slots | `nesting_slots` | ichma-ich to'plam diagrammasi | Slots: "Hamma kvadrat — …" / "Hamma to'g'ri to'rtburchak — …". Cards: to'g'ri to'rtburchak / kvadrat bo'lishi shart emas (+ chalg'ituvchilar) | `inclusion-reversed` |
| 06 | 🟡 | mc | `facade_order` | ombor qutilari | Tomoni 6 dm kvadrat panellarni "to'g'ri to'rtburchak panellar" qutisidan olish mumkinmi: **ha, kvadrat ham to'g'ri to'rtburchak**; yo'q, boshqa figura; faqat tomoni teng bo'lsa; aniqlash mumkin emas | `square-is-not-a-rectangle` |
| 07 | 🟡 | order | `nesting_order` | uch panel | Umumiydan maxsusga: to'rtburchak → to'g'ri to'rtburchak → kvadrat | `inclusion-reversed` |
| 08 | 🔴 | sort | `rhombus_boundary` | 3 figura o'lchamlari bilan | Bins: kvadrat / to'g'ri to'rtburchak, kvadrat emas / ikkisi ham emas. Items: 4 dm & 90°; 8×3 dm; 5 dm & 70° | `equal-sides-are-enough` |
| 09 | 🔴 | slots | `repair_sorting` | Bit saralagan qutilar | Slots: "Bit qo'ygan quti" / "to'g'ri quti" / "xato nomi". Cards: boshqa figuralar / to'g'ri to'rtburchaklar / kvadratni to'g'ri to'rtburchakdan ajratdi | `square-is-not-a-rectangle` |
| 10 | 🔴 | match | `name_from_description` | chizmasiz tavsiflar | "to'rtta to'g'ri burchak, qo'shni tomonlari har xil"↔to'g'ri to'rtburchak, kvadrat emas; "to'rtta to'g'ri burchak, to'rtta teng tomon"↔kvadrat; "to'rtta teng tomon, to'g'ri burchak yo'q"↔ikkisi ham emas | `equal-sides-are-enough` |

### 5.7. Dars 37 — Perimetr va yuza

Yadro: bitta maydondan ikki kattalik. Perimetr — chegara uzunligi, tomonlar
yig'indisi, metrda. Yuza — egallangan sirt, uzunlik × en, kvadrat metrda.
Birlikning o'zi javobni tekshiradi.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | sign | `equal_perimeter_trap` | ikki maydon yonma-yon | 11 m × 23 m va 15 m × 19 m maydonlarning perimetrlarini solishtiring: **=** (68 m), yuzalari esa 253 va 285 m² | `perimeter-decides-area` |
| 02 | 🟢 | numpad | `rectangle_perimeter` | tomonlari yozilgan maydon | 22 m × 17 m maydonning perimetri: **78** | `side-times-side-for-perimeter` |
| 03 | 🟡 | mc | `question_to_quantity` | buyurtma varaqasi | "Gazon uchun o't urug'i" — qaysi kattalik kerak: **yuza**; perimetr; tomon uzunligi; burchak soni | `perimeter-used-as-area` |
| 04 | 🟡 | shade | `area_by_cells` | 5 ustun × 4 qator katakli maydon | Bitta qatorda nechta katak — shunchasini bo'yang: **5**; qoida: 5 × 4 = 20 m² | `add-instead-of-multiply` |
| 05 | 🟡 | missing | `missing_side` | bir tomoni bo'sh maydon | Yuza 253 m², bir tomoni 11 m. Ikkinchi tomon: **23** | `add-instead-of-multiply` |
| 06 | 🟡 | order | `order_the_two_lines` | ikki qatorli buyurtma | "panjara — perimetr" → "(15 + 19) × 2 = 68 m" → "gazon — yuza" → "15 × 19 = 285 m²" | `operation-before-question` |
| 07 | 🟡 | match | `quantity_to_unit` | kvadrat maydon 27 m | perimetr↔108 m; yuza↔729 m²; panjara uzunligi↔68 m; gazon yuzasi↔285 m² | `wrong-unit` |
| 08 | 🔴 | mc | `square_perimeter_trap` | kvadrat maydon 35 m | Perimetri: **140 m**; 70 m; 1225 m²; 35 m | `side-times-side-for-perimeter` |
| 09 | 🔴 | order | `repair_the_swap` | Bit to'ldirgan buyurtma | Bit ikkala qatorga perimetr sonini yozdi. Tuzatish: "savolni o'qiymiz — gazon" → "gazon — yuza" → "22 × 17" → "374 m²" | `perimeter-used-as-area` |
| 10 | 🔴 | shade | `from_perimeter_to_area` | katakli kvadrat maydon | Perimetri 24 katak. Bir tomonini bo'yang: **6**; keyin yuza 36 katak | `perimeter-decides-area` |

### 5.8. Dars 38 — Geometrik yasashlar

Yadro: har asbob bitta savolga javob beradi — chizg'ich uzunlikni, go'niya to'g'ri
burchakni, transportir istalgan burchakni. Yasash tartibi: nima yasaymiz → mos
asbob → aniq moslash → tekshirish.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | match | `tool_to_question` | asboblar javoni | kesma uzunligi↔chizg'ich; to'g'ri burchak↔go'niya; istalgan burchak↔transportir | `one-tool-does-everything` |
| 02 | 🟢 | missing | `align_the_tool` | go'niya chiziqqa moslanmagan | Keyingi qadam: **asosini chiziqqa aniq moslash**; darrov chizish; transportirga almashtirish; ko'zga qarab to'g'rilash | `tool-not-aligned` |
| 03 | 🟡 | construct | `words_to_notation` | ikki chiziq AB va CD | Kartalardan yozuvni yig'ing: **AB → perpendikulyar → CD** | `parallel-versus-perpendicular` |
| 04 | 🟡 | slots | `perpendicular_steps` | chiziq va undagi nuqta | Slots 1-4 qadam; cards: nuqtani belgilaymiz / go'niyani chiziqqa moslaymiz / perpendikulyarni chizamiz / to'g'ri burchakni tekshiramiz | `drawing-by-eye` |
| 05 | 🟡 | mc | `missing_tool` | bayonnoma, asbob nomi bo'sh | "Nuqtadan chiziqqa □ bilan to'g'ri burchak yasaymiz": **go'niya**; chizg'ich; transportir shkalasi; ko'z | `drawing-by-eye` |
| 06 | 🟡 | missing | `window_frame_lines` | deraza ramkasi | Qarama-qarshi tomonlar bir-biridan bir xil masofada — bu qanday chiziqlar: **parallel**; perpendikulyar; kesishuvchi; yoyiq | `parallel-versus-perpendicular` |
| 07 | 🟡 | slots | `order_to_tool` | uch buyurtma qatori | Slots: "kesma 15 cm" / "to'g'ri burchak" / "110° burchak". Cards: chizg'ich / go'niya / transportir | `one-tool-does-everything` |
| 08 | 🔴 | sort | `by_eye_trap` | to'rt ish kartasi | Bins: yasash / ko'zga qarab chizish. Items: go'niya bilan to'g'ri burchak; ko'z bilan to'g'ri burchak; transportir bilan 65°; chizg'ichsiz qo'lda chiziq | `trust-the-eye` |
| 09 | 🔴 | construct | `repair_the_construction` | 83° chiqib qolgan burchak | Tuzatish ketma-ketligini yig'ing: **go'niya → chiziqqa moslash → chizish → tekshirish** | `trust-the-eye` |
| 10 | 🔴 | order | `drop_a_perpendicular` | chiziq va undan TASHQARIDA nuqta | Nuqtadan chiziqqa perpendikulyar tushirish qadamlari | `tool-not-aligned` |

### 5.9. Dars 39 — Nuqta koordinatalari

Yadro: nuqtani ikkita son **tartib bilan** belgilaydi. Sanoq koordinata boshidan:
avval x bo'ylab o'ngga, keyin y bo'ylab yuqoriga.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | mc | `read_the_pair` | koordinata burchagi, nuqta (6;2) | Nuqtaning yozuvi: **(6;2)**; (2;6); (6;0); (0;2) | `x-and-y-swapped` |
| 02 | 🟢 | placepick | `place_the_point` | to'r va 4 nomzod nuqta | (4;7) nuqtasini tanlang | `starts-from-y` |
| 03 | 🟡 | match | `record_to_mark` | to'rda 3 belgi | (1;6), (6;1), (3;3) yozuvlarini belgilarga ulang | `order-does-not-matter` |
| 04 | 🟡 | construct | `build_the_record` | to'rda belgilangan nuqta | Yozuvni yig'ing: avval x, keyin y — **8 → 3** | `x-and-y-swapped` |
| 05 | 🟡 | slots | `missing_coordinate` | ( □ ; 4 ) yozuvi va nuqta | Bo'sh joyga: **7**; cards 4 / 7 / 0 / 1 | `zero-misread` |
| 06 | 🟡 | order | `walk_order` | favvora (6;6) | "koordinata boshidan boshlaymiz" → "x bo'ylab 6 ga o'ngga" → "y bo'ylab 6 ga yuqoriga" → "nuqtani belgilaymiz" | `starts-from-y` |
| 07 | 🟡 | match | `axis_points` | o'qlardagi 3 nuqta | x o'qida 8↔(8;0); y o'qida 7↔(0;7); x o'qida 3↔(3;0) | `zero-misread` |
| 08 | 🔴 | missing | `origin_boundary` | koordinata boshi | Nuqta koordinata boshida. Yozuvi: **(0;0)**; (1;1); (0;1); yozib bo'lmaydi | `zero-misread` |
| 09 | 🔴 | placepick | `swap_error` | to'rda (3;8) va (8;3) belgilangan | Favvora (3;8) da bo'lishi kerak edi, Bit (8;3) ga qo'ydi. To'g'ri joyni ko'rsating | `x-and-y-swapped` |
| 10 | 🔴 | slots | `two_objects_apart` | shahar rejasi, ikki bino | Slots: "maktab" / "kutubxona". Maktab x dan 1, y dan 8. Cards: (1;8) / (8;1) | `order-does-not-matter` |

### 5.10. Dars 40 — Fazoviy shakllar va yoyilmalar

Yadro: yoq — tekis yuza, qirra — ikki yoq kesishgan chiziq, uch — uchta qirra
uchrashgan nuqta. Kubda va quti shaklidagi jismda 6 yoq, 12 qirra, 8 uch.
Yoyilma yaroqli bo'lishi uchun kvadratlar soni ham, joylashuvi ham to'g'ri.

| № | 🎯 | mexanika | skillTag | chizma | mazmun | xato modeli |
|---|---|---|---|---|---|---|
| 01 | 🟢 | match | `face_edge_vertex` | kub, qismlari yoritilgan | tekis yuza↔yoq; ikki yoq kesishgan chiziq↔qirra; uchta qirra uchrashgan nuqta↔uch | `face-edge-vertex-mixed` |
| 02 | 🟢 | missing | `count_faces` | kub, orqa yoqlari punktir | Kubda nechta yoq: **6** | `only-visible-faces` |
| 03 | 🟡 | construct | `assemble_the_counts` | kub va sanoq blankasi | Yozuvni yig'ing: **6 yoq → 12 qirra → 8 uch** | `face-edge-vertex-mixed` |
| 04 | 🟡 | numpad | `count_net_squares` | yaroqsiz yoyilma | Chizmadagi yoyilmada nechta kvadrat bor: **7** | `six-squares-are-enough` |
| 05 | 🟡 | mc | `missing_word` | bayonnoma, so'z bo'sh | "Kubda 12 ta □ bor": **qirra**; yoq; uch; tomon | `face-edge-vertex-mixed` |
| 06 | 🟡 | missing | `gift_box_net` | oltita kvadrat, ikkitasi ustma-ust | Nima qilish kerak: **kvadratlarning joylashuvini o'zgartirish**; yettinchi kvadrat qo'shish; bittasini olib tashlash; hech narsa, oltita yetadi | `six-squares-are-enough` |
| 07 | 🟡 | order | `fold_order` | yoyilma va buklash o'qlari | "asosni tanlaymiz" → "yon kvadratlarni ko'taramiz" → "qopqoqni yopamiz" → "bo'sh joy qoldimi, tekshiramiz" | `six-squares-are-enough` |
| 08 | 🔴 | mc | `cube_versus_box` | to'rt jism tavsifi | Qaysi jism kub: **qirralari 4, 4, 4 cm**; 4, 4, 9 cm; oltita yoqi bor har qanday jism; asosi kvadrat bo'lgan har qanday jism | `cube-versus-box` |
| 09 | 🔴 | sort | `sort_the_claims` | to'rt gap kartasi | Bins: to'g'ri / xato. Items: "kubda 8 uch bor"; "kvadrat — fazoviy jism"; "oltita kvadrat bo'lsa yoyilma albatta yaroqli"; "qirra ikki yoq kesishgan chiziq" | `flat-versus-solid`, `six-squares-are-enough` |
| 10 | 🔴 | construct | `build_the_net` | sovg'a qutisi va kvadratlar | Yaroqli yoyilmani buklash tartibida yig'ing: **asos → old → o'ng → orqa → chap → qopqoq** | `six-squares-are-enough` |

---

## 6. HAR FAYL BAJARADIGAN TEXNIK KONTRAKT

`scripts/grade4-practice-22-30-audit.mjs` dan olingan, 31-40 uchun ham amal
qiladi:

- `TASKS` aynan 10 ta, `id` lar `'01'`…`'10'`; daraja 2 green / 5 yellow / 3 red;
- har topshiriqda `skillTag`, `visual`, `setup`, `prompt`, `correctText`, `rule`,
  `secondHint`, `thirdHint` — uchala tilda;
- variantli topshiriqda aynan bitta `correct`, har noto'g'ri variantda **o'z**
  `wrong` tahlili (strategiyani nomlaydi, javobni bermaydi);
- `SCREEN_META` 10 ta, `TASKS` bilan 1:1, hammasi `scored: true`, faqat 10-si
  `scope: 'final'`;
- `lessonId: 'num-4-NN-practice'`, `export default function Grade4DarsNNPractice`;
- `['uz', 'ru', 'en']` selektori; ovoz, `AudioEngine`, `useNarration`, Bit — yo'q;
- `role="status"` + `aria-live="polite"`; `:focus-visible`; 44×44 px teginish;
- `100dvh` (`100vh` taqiqlangan), `overflow-x: clip`, 720 px konteyner;
- `@media (prefers-reduced-motion: reduce)`;
- Dars01 rang tokenlari to'liq, 22-30 ning eski tokenlari (`#fff7ed`, `#06b6d4`,
  `#14b8a6`, `#f59e0b`) yo'q; Manrope + Source Serif 4 + JetBrains Mono;
- MC variantlari har ochilishda Fisher-Yates bilan aralashadi, javob semantik
  `option.id` bilan saqlanadi;
- `onFinished` payloadi: `firstTryCorrect`, `correctAnswers`, `finalScore`,
  `attemptsTotal`, `durationSec`, `levelBreakdown`, `skillTags`, `lessonMeta`,
  `screenMeta`, `answers`; `passed` — birinchi urinishda 6/10 dan yuqori;
- ikki marta yakunlash va ikki marta o'tishdan guard (`finishedRef`,
  `advancedRef`), restartda taymer va holat tozalanadi.

---

## 7. YETISHMAYDIGAN INFRATUZILMA

| nima | holat |
|---|---|
| `scripts/grade4-practice-31-40-layout.mjs` | **yozildi**, `--check` o'tadi |
| `scripts/grade4-practice-31-40-audit.mjs` | **yozildi**; raskladkaga muvofiqlik, chizma mexanikasi soni, RU `ты`, `slots`/`sort`/`ticks`/`placepick`/`shade` ma'lumot shakli va har topshiriqning mustaqil hisobi tekshiriladi |
| `package.json` → `audit:grade4` | **qo'shildi**: `audit:grade4:practice-31-40` |
| `src/lessons/grade4.js` → `grade4Amaliy` | 31-40 qo'shildi |
| `scripts/grade4-migration-immutability-guard.mjs` | **tuzatildi**: baseline fayli o'zgarsa yoki yo'qolsa — buzilish; baseline tashqarisidagi yangi fayl — faqat xabar. Ilgari ro'yxat aynan 30 ta bo'lishini talab qilib, blokni yozishga imkon bermasdi |
| `scripts/grade4-i18n-audit.mjs` | **tuzatildi**: amaliyot qamrovi 51 tagacha ochildi. Ilgari 30 ta bilan chegaralanib, yangi fayl «scope tashqarisidagi fayl» xatosini beribgina qolmay, i18n tekshiruvidan ham tushib qolardi |
| `scripts/grade4-trilingual-browser-smoke.mjs` | **tuzatildi**: amaliyot qamroviga reyestrda bor va fayli mavjud 31-40 darslar qo'shiladi; TASKS dan oldingi yordamchi doimiylar ham baholanadi |
| `scripts/check-grade4.mjs --through=30` | chegara hozircha o'zgartirilmadi: u nazariy darslar auditi, amaliyotga tegishli emas |
| browser-solver | `construct`, `sort`, `slots`, `ticks`, `placepick`, `shade` allaqachon qo'llanadi — o'zgartirish shart emas |

---

## 8. ISH TARTIBI

Har dars uchun: **kontent → sborka → QA**, keyin keyingi dars. Blok skeleti
(shu hujjat) bir marta tasdiqlanadi.

1. Kontent (RU/UZ/EN, 10 topshiriq, har xato variantiga tahlil).
2. Sborka: `DarsNNPractice.jsx` + reyestr yozuvi.
3. QA: `grade4-practice-31-40-audit.mjs` + `grade4-trilingual-browser-smoke.mjs DarsNNPractice`
   (3 til × 3 viewport, solver 10 topshiriqni o'zi yechadi, gorizontal overflow va
   konsol xatosi tekshiriladi) + `npm run build`.
4. Blok yakunida to'liq `audit:grade4` va metodist ko'rigi.

**Holat.** Blok yopildi: 31-40 — barchasi tayyor va tekshiruvdan o'tgan.
Audit 10/10, browser smoke 10 route × 3 til × 3 viewport, solver 100 topshiriqni
o'zi yechdi.

**Kontent qayerda turadi.** 31-dars uchun kontent alohida fayl bilan ko'rikka
berildi (`context/GRADE4_DARS31_PRACTICE_CONTENT.js`). 32-darsdan boshlab kontent
faqat komponent ichida turadi: ikkita manba bo'lsa ular ertami-kechmi ajralib
ketadi, komponent esa LMS ga ketadigan yagona haqiqat.
