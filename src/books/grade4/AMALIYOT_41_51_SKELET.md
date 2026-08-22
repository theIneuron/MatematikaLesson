# 4-sinf amaliyoti 41–51 — SKELET

> 1-etap (CLAUDE.md §3). Bu yerda har topshiriqning roli, mexanikasi, modeli va
> misconception'i belgilanadi. Kontent (RU/UZ/EN matnlar) va yig'ish keyingi etaplarda.
>
> Metodist qarori 2026-08-21: **31–40 amaliyoti hozir yaratilmaydi**, faqat 41–51.
> Dizayn va ranglar — `Dars01Practice.jsx` etaloni. Sahna — 17–21 avlodi darajasida:
> haqiqiy interaktiv modellar, tekst qatori emas.

---

## 1. KONTRAKT — 11 faylning hammasiga

**Fayl.** `src/components/grade4/DarsNNPractice.jsx`, bitta avtonom fayl, lokal import
yo'q, uslublar ichkarida. Sabab: LMS lokal importni ko'tarmaydi
(`Dars01Practice.jsx` shapkasidagi izoh). Bu CLAUDE.md §5 dan **ongli chekinish**:
mexanika komponentlari (ScaleModel, Cells, FracBuilder va h.k.) fayl ichida
takrorlanadi, chunki boshqa yo'l yo'q. Har faylda buning sababi izohda yoziladi.

**Ovoz yo'q.** Amaliyot ovozsiz ishlaydi — 30 amaliyotning hammasida shunday.

**Struktura.** Aynan 10 tekshiriladigan topshiriq. Daraja o'qi qat'iy:
`2 green · 5 yellow · 3 red` (1–2 green, 3–7 yellow, 8–10 red).
Janr o'qi qat'iy — `4sinf_metodologiya.md` §13 o'nligi. Mexanika o'qi har darsda
boshqacha, §2 jadvali bo'yicha.

**Ekran tartibi** (3-sinf kanoni, `TIPLAR_AMALIYOT_3SINF.md` §1A):
`daraja+raqam → shart → model → SAVOL → javob maydoni → tahlil → qoida`.

**Model.** Har topshiriqda haqiqiy model bo'ladi yoki umuman bo'lmaydi. Bo'sh oq
ramkaga bitta tekst qatori qo'yish — 22–30 avlodining nuqsoni, takrorlanmaydi.
Model yechimning birinchi qadamini bermaydi. Animatsiya to'g'ri variantga ishora
qilmaydi; natija faqat to'g'ri javobdan keyin modelda yig'iladi.

Uch aniqlik, blok yig'ilgandan keyin qo'shildi:

1. **Kartalar modelni tashiganda alohida sahna talab qilinmaydi.** `sort`,
   `match`, `slots` va `order` da bola bevosita matematik obyektlar bilan
   ishlaydi — yozuv, shakl, qadam kartasi. Ular ustiga yana ramka qo'yish
   ma'no bermaydi.
2. **Boshqa mexanikada sahna yo'q bo'lsa, sabab yoziladi.** Topshiriqda
   `noVisualReason` maydoni bo'ladi (UZ/RU/EN). Audit sababi yozilgan
   chekinishni alohida ro'yxatda ko'rsatadi, xato deb hisoblamaydi. Jim
   chekinish — xato. Blokda ikkita shunday holat bor: 47-dars 06 va 48-dars 01,
   ikkalasida ham javob variantlarining o'zi matematik yozuv.
3. **`shade` ikki rejimda ishlaydi.** Simmetriyada (41-dars) katakning O'RNI
   javobning o'zi, shuning uchun tekshiruv aynan kataklar bo'yicha ketadi va
   panjara `map` bilan beriladi. Kasrda va yuzada (46, 51-dars) muhim narsa
   kataklarning SONI, shuning uchun tekshiruv `selectCount` bo'yicha ketadi.
   Audit ikkisini ajratib tekshiradi.

**Javob va tahlil.**
- `mc` — aynan 4 variant, har ochilganda aralashtiriladi, javob semantik `id`
  bilan saqlanadi; **har noto'g'ri variantga o'z tahlili**, tahlil xato
  strategiyani nomlaydi va nimani tekshirishni ko'rsatadi, javobni bermaydi;
- ikkinchi urinishda `secondHint`, uchinchisida `thirdHint` — modelda tegishli
  joy yoritiladi (`hintLevel >= 2`);
- to'g'ri javobdan keyin `correctText` va `rule`;
- solve-to-advance: topshiriq yechilmasa keyingisiga o'tilmaydi;
- ball — birinchi tekshiruvda to'g'ri javoblar soni, `passed = firstTry >= 6`.

**Til.** UZ / RU / EN uchtasi to'liq. UZ — `siz`, lotin, **apostrof ASCII `'`**
(22–30 da `'` U+2018 ishlatilgan — bu xato, takrorlanmaydi), kirillcha 0 ta.
RU — `ты`, jinsga bog'lanmagan shakl. Sonlar nazariy darsdan **boshqa**.

**Dizayn — `Dars01Practice.jsx` tokenlari.** Fon `#F5F5F0`, qog'oz `#FFFFFF`,
siyoh `#12212C` / `#50616D` / `#87949D`, akcent `#FF5B35` / `#FFF0EA`,
havorang `#168FA3` / `#E5F5F6`, navy `#173B52`, muvaffaqiyat `#227A53` / `#E7F3EC`,
ogohlantirish `#A96F13` / `#FFF5D9`, feedback matni `#1B6644` / `#8A5C10`.
Progress — `linear-gradient(90deg, #168FA3, #FF5B35)`. Shriftlar: Manrope (UI),
Source Serif 4 (savol va tahlil), JetBrains Mono (sonlar). Daraja yorlig'i
yagona akцент rangida. Amal tugmalari chapdan boshlanadi.
`AMALIYOT_GLOBAL_STANDART.md` palitrasi (`#fff7ed`, `#06b6d4`, `#14b8a6`,
`#f59e0b`) **ishlatilmaydi** — u 4-sinf uchun eskirgan, auditda taqiqlangan.

**Texnika.** `main` — `min(720px, 100%)`, `overflow-x: clip`, `100dvh`
(`100vh` yo'q), teginish maydoni ≥ 44×44, `:focus-visible` ko'rinadi,
`aria-live="polite"` feedback, `prefers-reduced-motion` da animatsiya o'chadi,
390 va 1440 da gorizontal skroll yo'q. `SCREEN_META` 10 ta, oxirgisi
`scope: 'final'`. `onFinished` payloadi 22–30 kontrakti bo'yicha:
`firstTryCorrect`, `scorePercent`, `passed`, `levelBreakdown`, `skillTags`,
`lessonMeta`, `screenMeta`, `answers`.

**Reyestr.** `src/lessons/grade4.js` dagi `grade4Amaliy` massiviga 11 yozuv
qo'shiladi: `dars41-amaliyot-…` … `dars51-amaliyot-…`, nomi va tavsifi
topshiriqlarga mos.

---

## 2. MEXANIKA RASKLADKASI

`node scripts/grade4-practice-41-51-layout.mjs` bilan hisoblanadi, zerno — dars
raqami, natija takrorlanadi. Tekshiruv: `--check`.

| dars | 1 🟢 | 2 🟢 | 3 🟡 | 4 🟡 | 5 🟡 | 6 🟡 | 7 🟡 | 8 🔴 | 9 🔴 | 10 🔴 |
|---|---|---|---|---|---|---|---|---|---|---|
| **41** | mc | shade | order | numpad | gap | mc | sort | shade | match | sort |
| **42** | match | missing | numpad | slots | missing | match | slots | sort | order | numpad |
| **43** | mc | numpad | order | missing | slots | numpad | sort | mc | match | sort |
| **44** | sort | missing | match | slots | numpad | missing | slots | sort | mc | numpad |
| **45** | match | ticks | order | numpad | missing | match | order | ticks | sort | missing |
| **46** | mc | shade | numpad | missing | fracbuild | numpad | match | mc | order | shade |
| **47** | match | numpad | order | ticks | numpad | mc | order | sort | mc | match |
| **48** | mc | slots | numpad | missing | slots | match | sort | mc | match | missing |
| **49** | sort | numpad | match | slots | numpad | missing | order | sort | mc | match |
| **50** | match | missing | numpad | ticks | missing | match | sort | ticks | order | sort |
| **51** | ticks | shade | slots | missing | numpad | mc | slots | shade | mc | numpad |

Janr o'qi (pozitsiya → nima tekshiriladi): 1 tanib olish · 2 tayanch bilan
qo'llash · 3 tasvirlar orasida o'tish · 4 hisoblash yoki o'lchash · 5 tushib
qolganini tiklash · 6 matnli masala · 7 saralash, moslashtirish, tartib ·
8 chegaraviy holat · 9 xatoni tahlil qilish · 10 ko'chirish.

Qoidalar, generator bajaradi: har darsda ≥ 6 xil mexanika; bitta mexanika
≤ 2 marta; qo'shni pozitsiyalar boshqa; **oralab ham** takrorlanmaydi
(`i` va `i+2` boshqa); qo'shni juftlik dars ichida takrorlanmaydi; bir
pozitsiyada ikki qo'shni dars bir xil mexanikani bermaydi; birinchi topshiriq
boshqarishni o'rgatishni talab qilmaydi.

**Raskladka — topshiriq, taqiq emas.** Mavzu mexanikani ko'tarmasa, muallif
boshqasini qo'yadi va sababini izohda yozadi; audit bunday chekinishni alohida
ro'yxatda ko'rsatadi, xato deb hisoblamaydi.

---

## 3. MEXANIKALAR — donorlar

Yangi kod yozilmaydi, ishlaydigan mexanikalar 4-sinf amaliyotidan olinadi:

| mexanika | bola nima qiladi | donor |
|---|---|---|
| `mc` | 4 variantdan bittasini tanlaydi | `Dars01Practice` |
| `numpad` | raqamli klaviaturada sonni yozadi | `Dars01Practice` |
| `missing` | yozuvdagi `□` ga sonni kiritadi | `Dars17Practice` |
| `match` | chapdagi kartani, keyin o'ngdagi juftini tanlaydi | `Dars17Practice` |
| `order` | qadam kartalarini uyalarga tartib bilan qo'yadi | `Dars17Practice` |
| `ticks` | shkala yoki o'q bo'linmasiga tegadi | `Dars17Practice` (`ScaleModel interactive`) |
| `shade` | kataklarni bo'yaydi | `Dars18Practice` (`Cells onToggle`) |
| `fracbuild` | surat va maxrajni tanlab kasr quradi | `Dars18Practice` |
| `gap` | ikki element orasidagi bo'shliqqa tegadi | `Dars01Practice` (`NumberStrip`) |
| `slots` | kartani nomlangan uyaga joylaydi | `Dars11Practice` |
| `sort` | elementlarni nomlangan guruhlarga ajratadi | `Dars07Practice` |

Har darsga faqat **o'sha darsda ishlatiladigan** mexanikalar ko'chiriladi.

---

## 4. DARS 41 — Simmetriya va burilish simmetriyasi

Nazariya o'zagi: dastgoh naqshning yarmini kesadi, ikkinchi yarmi ko'zgu bilan
chiqadi; shakl bir aylanishda `n` marta mos tushsa, burish burchagi `360 : n`.
Nazariya sonlari amaliyotda takrorlanmaydi.

**Modellar:** katakli setka + simmetriya o'qi chizig'i (`Cells` grid + o'q);
burish uchun bitta barg va aylanish markazi (SVG); naqsh chizig'i (`gap` uchun).

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | mc | setkadagi shakl, 4 xil chiziq | qaysi chiziq simmetriya o'qi | teng yuzaga bo'lgan har chiziq o'q deb hisoblanadi |
| 02 | 🟢 | tayanch bilan qo'llash | shade | 8×4 setka, chap yarmi to'ldirilgan | o'ngdagi mos kataklarni bo'yash | ko'zgu emas, nusxa ko'chiriladi (siljitish) |
| 03 | 🟡 | tasvirlar orasida o'tish | order | qurish qadamlari | ko'zgu qurishning 4 qadamini tartiblash | masofa o'lchanmasdan «ko'zga chamalab» qo'yiladi |
| 04 | 🟡 | hisoblash | numpad | aylanma naqsh, 6 marta mos tushadi | eng kichik burish burchagi (60) | 360 ni mos tushish soniga bo'lish o'rniga ayiriladi |
| 05 | 🟡 | tiklash | gap | 8 elementli naqsh chizig'i | o'q qaysi bo'shliqdan o'tadi | juft elementda bir katak chapga/o'ngga xato |
| 06 | 🟡 | matnli masala | mc | naqsh paneli | yarmida 14 element bo'lsa, butun panelda nechta | o'q ustidagi elementlar ham ikkilantiriladi |
| 07 | 🟡 | saralash | sort | 6 shakl | «bitta o'q» / «bittadan ko'p» / «o'q yo'q» | diagonal o'qni ko'rmaslik |
| 08 | 🔴 | chegaraviy holat | shade | toq ustunli setka (o'q katak ustidan o'tadi) | mos yarmini bo'yash | o'rtadagi ustun ham ikkilantiriladi |
| 09 | 🔴 | xatoni tahlil qilish | match | 3 noto'g'ri qurilma | har xatoni nomiga ulash | «bir tomonga qaragan barglar» xatosi ko'zguga o'xshab ketadi |
| 10 | 🔴 | ko'chirish | sort | yo'l belgilari va koshinlar | 90° / 180° / burish simmetriyasi yo'q | burish simmetriyasi o'q simmetriyasi bilan chalkashtiriladi |

Skill teglari: `line_symmetry`, `mirror_construction`, `equal_distance`,
`rotational_symmetry`, `turn_angle`, `axis_position`, `pattern_count`,
`odd_axis_boundary`, `mirror_error`, `symmetry_transfer`.

---

## 5. DARS 42 — Tenglamalar

Nazariya o'zagi: noma'lumni `x` bilan belgilash; noma'lum qo'shiluvchi =
yig'indi − ma'lum qo'shiluvchi; noma'lum kamayuvchi = ayirma + ayriluvchi.
Nazariyaning `x + 240 = 360` va `x − 240 = 510` sonlari ishlatilmaydi.

**Modellar:** `BarModel` uslubidagi butun-qism lentasi; tenglama yozuvi
uyalar bilan (`slots`); muhrlangan buyurtma kartasi.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | match | 4 yozuv kartasi | yozuvni «noma'lum qo'shiluvchi / kamayuvchi / ayriluvchi / tenglama emas» ga ulash | `180 + 220 = 400` ham tenglama deb hisoblanadi |
| 02 | 🟢 | tayanch bilan qo'llash | missing | lenta: 260 va butun 540 | `x + 260 = 540`, `x = □` | ayirish o'rniga qo'shiladi |
| 03 | 🟡 | tasvirlar orasida o'tish | numpad | lenta: ayirma 480, ayriluvchi 370 | `x − 370 = 480` yechimi (850) | kamayuvchi ham ayirish bilan topiladi deb o'ylash |
| 04 | 🟡 | hisoblash | slots | bo'sh tenglama uyalari | matndan tenglama tuzish: 240 jo'natildi, 510 qoldi | `510 − 240 = x` tartibida yoziladi |
| 05 | 🟡 | tiklash | missing | yozuv `720 = □ + 145` | tushib qolgan qo'shiluvchi (575) | tenglikning o'ng tomonidagi noma'lum «boshqa qoida» deb o'ylanadi |
| 06 | 🟡 | matnli masala | match | 4 qisqa masala | masalani o'z tenglamasiga ulash | «qoldi» so'zi har doim ayirish deb tushuniladi |
| 07 | 🟡 | saralash | slots | 4 yozuv, 4 nomlangan uya | «tenglama / ifoda / tenglik / tengsizlik» | harf bor bo'lsa — tenglama deb hisoblanadi |
| 08 | 🔴 | chegaraviy holat | sort | nol qatnashgan 4 tenglama | ildizi 480 bo'lganlar va 0 bo'lganlar | `x − 480 = 0` da ildiz 0 deb olinadi |
| 09 | 🔴 | xatoni tahlil qilish | order | noto'g'ri yechim yozuvi | to'g'ri yechimni qadamlab tiklash | noma'lum kamayuvchi uchun qo'shish o'rniga ayirish |
| 10 | 🔴 | ko'chirish | numpad | lenta: butun 1 040, qism 680 | noma'lum **ayriluvchi**: `1 040 − x = 680` | ikki noma'lum turdagi qoida bir xil deb qo'llaniladi |

Skill teglari: `equation_meaning`, `unknown_addend`, `unknown_minuend`,
`word_to_equation`, `missing_addend`, `problem_to_equation`,
`record_classification`, `zero_boundary`, `inverse_error`, `unknown_subtrahend`.

---

## 6. DARS 43 — Tenglamalarni yechish va tekshirish

Nazariya o'zagi: noma'lum ko'paytuvchi = ko'paytma : ma'lum ko'paytuvchi;
noma'lum bo'linuvchi = bo'linma × bo'luvchi; javob harf o'rniga qo'yib
tekshiriladi. Nazariyaning `(13 900 − x) : 80 = 140` namunasi takrorlanmaydi.

**Modellar:** teskari amal jadvali; tekshiruv posti yozuvi (ikki tomon
qiymati); murakkab tenglama qavs bilan.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | mc | `x × 7 = 490` | qaysi teskari amal ildizni topadi | ko'paytmani ko'paytuvchiga ko'paytirish |
| 02 | 🟢 | tayanch bilan qo'llash | numpad | ko'paytma jadvali | `x × 9 = 810` (90) | 810 dan 9 ni ayirish |
| 03 | 🟡 | tasvirlar orasida o'tish | order | yechim va tekshiruv qadamlari | `x : 40 = 15` ning 4 qadami | tekshiruv qadamisiz tugatiladi |
| 04 | 🟡 | hisoblash | missing | `□ : 60 = 12` | noma'lum bo'linuvchi (720) | bo'linmani bo'luvchiga bo'lish |
| 05 | 🟡 | tiklash | slots | tekshiruv yozuvi uyalari | topilgan ildizni qo'yib tekshirish | tekshirishda boshqa tenglama ishlatiladi |
| 06 | 🟡 | matnli masala | numpad | murakkab tenglama `(7 200 − x) : 80 = 60` | ildiz (2 400) | qavs ichidagi ifoda oxirida hisoblanadi |
| 07 | 🟡 | saralash | sort | 6 tenglama | «ko'paytirish bilan topiladi» / «bo'lish bilan topiladi» | noma'lumning o'rni hisobga olinmaydi |
| 08 | 🔴 | chegaraviy holat | mc | `x × 1 = 640` | ildiz va sababi | 1 ga ko'paytirish «hech narsa bermaydi» deb ildiz 1 deyiladi |
| 09 | 🔴 | xatoni tahlil qilish | match | 3 noto'g'ri yechim | har xatoni nomiga ulash | teskari amal to'g'ri, lekin tartib teskari |
| 10 | 🔴 | ko'chirish | sort | 4 yechim + tekshiruvi | «tekshiruv o'tdi» / «o'tmadi» | ikki tomon qiymati solishtirilmaydi |

Skill teglari: `unknown_factor`, `factor_inverse`, `solve_and_check_order`,
`unknown_dividend`, `substitution_check`, `compound_equation`,
`inverse_choice`, `unit_factor_boundary`, `solution_error`, `check_verdict`.

---

## 7. DARS 44 — Murakkab masalalar

Nazariya o'zagi: javob birdan chiqmaydi — avval **oraliq** qiymat topiladi,
u javob emas; bir masala ikki yo'l bilan yechiladi va javob bir xil bo'ladi.
Nazariyaning 14 587 / 10 030 / 850 va 10 427 / 4 574 / 1 696 sonlari
ishlatilmaydi.

**Modellar:** ikki qadamli reja sxemasi (oraliq → javob); ombor hisobi
jadvali; ikki usul yonma-yon.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | sort | masala va 4 savol | «oraliq savol» / «asosiy savol» | har savol javobga olib boradi deb o'ylanadi |
| 02 | 🟢 | tayanch bilan qo'llash | missing | reja sxemasi, birinchi uya bo'sh | oraliq qiymat `12 400 + 8 600 = □` | oraliq qiymatga darhol uchinchi son qo'shiladi |
| 03 | 🟡 | tasvirlar orasida o'tish | match | 4 masala va 4 reja | masalani rejasiga ulash | «ko'p» so'ziga qarab qo'shish tanlanadi |
| 04 | 🟡 | hisoblash | slots | reja uyalari | ikki amalni tartib bilan joylash | ikkinchi amal birinchisidan mustaqil deb olinadi |
| 05 | 🟡 | tiklash | numpad | to'liq hisob | `15 200 + 9 800 − 1 400` (23 600) | ayirish qo'shishdan oldin bajariladi |
| 06 | 🟡 | matnli masala | missing | ikkinchi usul yozuvi | `15 200 + (9 800 − 1 400) = □` | ikki usul boshqa javob beradi deb o'ylanadi |
| 07 | 🟡 | saralash | slots | ikki usul uyasi | qadamlarni «1-usul» va «2-usul» ga taqsimlash | usullar aralashtiriladi |
| 08 | 🔴 | chegaraviy holat | sort | 4 savol | «bir amal yetadi» / «ikki amal kerak» | har uzun matn murakkab deb hisoblanadi |
| 09 | 🔴 | xatoni tahlil qilish | mc | oraliq qiymat javob sifatida yozilgan | xato nimada | hisob to'g'ri bo'lsa javob ham to'g'ri deb olinadi |
| 10 | 🔴 | ko'chirish | numpad | uch sisterna sxemasi | uchinchisi ikkinchisidan 1 700 kam: jami | «kam» so'zi butun jami dan ayiriladi |

Skill teglari: `question_role`, `intermediate_value`, `plan_matching`,
`plan_order`, `two_step_compute`, `second_way`, `way_comparison`,
`one_or_two_steps`, `intermediate_as_answer`, `three_part_transfer`.

---

## 8. DARS 45 — Harakatga doir masalalar

Nazariya o'zagi: tezlik = masofa : vaqt, masofa = tezlik × vaqt,
vaqt = masofa : tezlik; javob birligi saqlanadi. Nazariyaning 48/4, 460/2,
39/3, 1 035/15, 1 800/18 sonlari ishlatilmaydi.

**Qamrov tekshirildi va yopildi.** `Dars45.jsx` da yaqinlashish, uzoqlashish
va quvib yetish tezliklari **yo'q** (fayl bo'ylab qidiruv nol natija berdi):
nazariya faqat `v = s : t` uchligi va tezlik birligini beradi. Amaliyot shu
doirada qoldi, 08-topshiriq noldan boshlanmagan shkalaga, 10-topshiriq esa
`t = s : v` ni yangi kontekstda qo'llashga bag'ishlandi. Audit bu qamrovni
qo'riqlaydi: nazariyada yo'q atamalar amaliyotga tushsa, tekshiruv qizil bo'ladi.
Reyestrdagi 45-dars tavsifi nazariyadan keng yozilgan — metodist qaroriga
qoldi.

**Modellar:** masofa chizig'i, ustida harakat nuqtasi (`ScaleModel`
interaktiv); Tezlik / Vaqt / Masofa jadvali; dispetcherlik yo'l xaritasi.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | match | 4 formula kartasi | formulani «nimani topadi» ga ulash | tezlik va masofa formulasi almashtiriladi |
| 02 | 🟢 | tayanch bilan qo'llash | ticks | 0–60 km chizig'i, bo'linma 12 km | 12 km/soat bilan 3 soatdan keyingi joy (36) | bo'linma qiymati hisobga olinmaydi |
| 03 | 🟡 | tasvirlar orasida o'tish | order | yechim qadamlari | ma'lum → amal → hisob → birlik | birlik yozilmasdan tugatiladi |
| 04 | 🟡 | hisoblash | numpad | jadval, tezlik ustuni bo'sh | 480 km 6 soatda → 80 km/soat | masofa vaqtga ko'paytiriladi |
| 05 | 🟡 | tiklash | missing | `s = 80 × 7 = □` | masofa (560) | tezlik birligi javobga ko'chiriladi |
| 06 | 🟡 | matnli masala | match | 4 masala | masalani kerakli amalga ulash | «necha soat» savoliga ko'paytirish tanlanadi |
| 07 | 🟡 | saralash | order | bitta masalaning qadamlari | vaqtni topish yo'li | masofa va tezlik juftligi noto'g'ri olinadi |
| 08 | 🔴 | chegaraviy holat | ticks | shkala 0 dan boshlanmaydi | ko'rsatkich qiymati | shkala har doim noldan boshlanadi deb olinadi |
| 09 | 🔴 | xatoni tahlil qilish | sort | 4 yechim | xato turi bo'yicha ajratish (amal / birlik) | daqiqa va soat bir jadvalda aralashtiriladi |
| 10 | 🔴 | ko'chirish | missing | yangi kontekst | `t = s : v` yangi shaklda | uchta kattalikdan noto'g'ri jufti tanlanadi |

Skill teglari: `formula_meaning`, `distance_on_line`, `solution_order`,
`speed_from_distance_time`, `distance_from_speed_time`, `operation_choice`,
`time_path`, `non_zero_scale`, `unit_error`, `time_from_distance_speed`.

---

## 9. DARS 46 — Qism va butunni topish

Nazariya o'zagi: sonning kasrini topish **ikki amal** — maxrajga bo'lish,
suratga ko'paytirish; teskari masalada aksincha — suratga bo'lish, maxrajga
ko'paytirish. Nazariyaning 12 cm, 8 000, 20 km, 9 cm, 15, 78, 30 sonlari
ishlatilmaydi.

**Modellar:** teng kataklarga bo'lingan lenta (`Cells`); kasr quruvchi
(`fracbuild`); taqsimlash paneli.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | mc | 6 katakli lenta | 540 ning oltidan biri qaysi amal bilan | maxrajga ko'paytiriladi |
| 02 | 🟢 | tayanch bilan qo'llash | shade | 8 katakli lenta | uch sakkizdan bir qismini bo'yash | 3 ta emas, 8 ta katak bo'yaladi |
| 03 | 🟡 | tasvirlar orasida o'tish | numpad | bo'yalgan lenta | 450 ning besh uchdan qismi (270) | faqat bitta ulush topib to'xtaladi |
| 04 | 🟡 | hisoblash | missing | bitta ulush 40 | `□ ning to'qqizdan biri 40` (360) | 40 ga 9 ni qo'shiladi |
| 05 | 🟡 | tiklash | fracbuild | bo'yalgan model | modelga mos kasrni qurish | surat va maxraj o'rni almashtiriladi |
| 06 | 🟡 | matnli masala | numpad | kitob lentasi | 2/7 qismi 96 bet → butun (336) | 96 ni 7 ga ko'paytiriladi |
| 07 | 🟡 | saralash | match | 4 masala va 4 sxema | masalani sxemasiga ulash | to'g'ri va teskari masala farqlanmaydi |
| 08 | 🔴 | chegaraviy holat | mc | to'liq bo'yalgan lenta | surat maxrajga teng bo'lsa natija | 5/5 «yarmidan ko'p» deb baholanadi |
| 09 | 🔴 | xatoni tahlil qilish | order | teskari masala yechimi | to'g'ri tartibni tiklash | teskari masalada ham maxrajga bo'linadi |
| 10 | 🔴 | ko'chirish | shade | lenta | 3/8 olingandan keyin **qolgani** ni bo'yash | qolgan qism savoli olingan qism deb o'qiladi |

Skill teglari: `unit_fraction_action`, `shade_fraction`, `fraction_of_number`,
`whole_from_unit`, `model_to_fraction`, `whole_from_part`, `scheme_choice`,
`full_fraction_boundary`, `inverse_order_error`, `remaining_part`.

---

## 10. DARS 47 — Tengsizliklarni tanlash usulida yechish

Nazariya o'zagi: harf o'rniga sonlarni qo'yib ko'ramiz va yozuv rost
bo'ladiganlarini topamiz; qat'iy belgi chegara qiymatini ichiga olmaydi,
qat'iy bo'lmagani oladi. Nazariyaning `3 + x < 5`, `6 − x > 4`, `5 · x < 35`,
`36 : x > 4`, `x ≤ 548`, `a · 9 < 54`, `200 − a > 198`, `7 · y > 35`,
`208 − x < 35` yozuvlari ishlatilmaydi.

**Modellar:** son o'qi bo'linmalari bilan (`ScaleModel` interaktiv); sinov
jadvali (qiymat → rost/yolg'on); shart darvozasi.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | match | 4 belgi kartasi | belgini ma'nosiga ulash | `≥` «faqat katta» deb o'qiladi |
| 02 | 🟢 | tayanch bilan qo'llash | numpad | sinov jadvali | `x < 9` ning eng katta natural yechimi (8) | 9 ning o'zi olinadi |
| 03 | 🟡 | tasvirlar orasida o'tish | order | tanlash usuli qadamlari | qadamlarni tartiblash | birinchi rost qiymatda to'xtaladi |
| 04 | 🟡 | hisoblash | ticks | son o'qi 195–205 | `x ≤ 201` ning eng katta yechimi | chegara tashqarida qoldiriladi |
| 05 | 🟡 | tiklash | numpad | `6 · x < 48` | eng katta natural yechim (7) | 48 : 6 = 8 javob deb olinadi |
| 06 | 🟡 | matnli masala | mc | darvoza sharti | shartga mos qiymatlar to'plami | «kamida» va «ko'pi bilan» chalkashtiriladi |
| 07 | 🟡 | saralash | order | sinovlar ketma-ketligi | rostdan yolg'onga o'tish joyini ko'rsatish | o'tish nuqtasi bir qadam surilib ketadi |
| 08 | 🔴 | chegaraviy holat | sort | 199 · 200 · 201 | `x ≥ 200` uchun «yechim» / «yechim emas» | qat'iy va qat'iy bo'lmagan belgi farqlanmaydi |
| 09 | 🔴 | xatoni tahlil qilish | mc | qat'iy belgiga chegara kiritilgan yechim | xato nimada | chegara har doim yechim deb olinadi |
| 10 | 🔴 | ko'chirish | match | 4 tengsizlik va 4 to'plam | tengsizlikni yechimlar to'plamiga ulash | ayirishli tengsizlikda yo'nalish teskari bo'lishi sezilmaydi |

Skill teglari: `sign_meaning`, `largest_solution`, `trial_order`,
`boundary_on_line`, `product_inequality`, `condition_word_problem`,
`truth_transition`, `strict_vs_nonstrict`, `boundary_error`, `solution_set`.

---

## 11. DARS 48 — Qo'shishning xossalari

Nazariya o'zagi: qo'shiluvchilarning o'rni va guruhlanishi yig'indini
o'zgartirmaydi, shuning uchun yumaloq son beradigan juftni oldin qo'shish
mumkin; ayirish bunday erkinlikni bermaydi. Nazariyaning 1 457 + 23 543,
500 + 800 + 500, 14 800 + 5 000 + 200, 20 400 + 600 + 50 800,
73 000 + 22 300 + 700, 69 900 + 30 000 + 100 yozuvlari ishlatilmaydi.

**Modellar:** yig'uv maydoni — qo'shiluvchi kartalari va qavs; juftlik
belgisi; hisob yo'li.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | mc | 4 yozuv | qaysi yozuv o'rin almashtirishni ko'rsatadi | guruhlash o'rin almashtirish deb olinadi |
| 02 | 🟢 | tayanch bilan qo'llash | slots | 3 karta va qavs uyasi | `18 600 + 6 000 + 400` uchun qulay juft | qavs birinchi ikki songa qo'yiladi |
| 03 | 🟡 | tasvirlar orasida o'tish | numpad | guruhlangan yozuv | `26 700 + 3 300 + 5 000` (35 000) | juft topilmasdan chapdan o'ngga hisoblanadi |
| 04 | 🟡 | hisoblash | missing | `600 + 900 + 400 = (600 + □) + 900` | tushib qolgan son (400) | qavs ichiga 900 yoziladi |
| 05 | 🟡 | tiklash | slots | `57 900 + 40 000 + 100` | guruhlashni tiklash | yumaloq son 100 bilan emas, 40 000 bilan izlanadi |
| 06 | 🟡 | matnli masala | match | xarid ro'yxati | har yig'indini qulay juftiga ulash | eng katta ikki son juftlanadi |
| 07 | 🟡 | saralash | sort | 6 yozuv | «o'rin almashtirish» / «guruhlash» | ikkala xossa bitta nom bilan yuritiladi |
| 08 | 🔴 | chegaraviy holat | mc | `900 − (400 − 100)` va `(900 − 400) − 100` | ayirishda guruhlash ishlaydimi | qo'shish qoidasi ayirishga ko'chiriladi |
| 09 | 🔴 | xatoni tahlil qilish | match | 3 noto'g'ri yozuv | xatoni nomiga ulash | qavs qo'yilgan, lekin son o'zgargan |
| 10 | 🔴 | ko'chirish | missing | to'rt qo'shiluvchili zanjir | qulay juftni topib yig'indini yozish | to'rt sonda ikki juft borligi ko'rilmaydi |

Skill teglari: `commutative_property`, `convenient_pair`, `grouped_sum`,
`missing_addend_property`, `restore_grouping`, `pair_matching`,
`property_classification`, `subtraction_boundary`, `property_error`,
`four_addend_transfer`.

---

## 12. DARS 49 — Mulohazalar va hukmlar

Nazariya o'zagi: mulohaza — rost yoki yolg'on deb baholash mumkin bo'lgan
darak gap; buyruq, savol va his-tuyg'u gaplari mulohaza emas; sonli
mulohazani tekshirish uchun hisoblash kifoya. Nazariyaning 214 > 83,
56 − 48 = 18, 569 < 612, 1 soat = 60 daqiqa, 657 + 203 = 650 + 203
misollari ishlatilmaydi.

**Modellar:** qaror moduli — xabar kartalari va R/Y uyalari; hisob paneli;
qarshi misol kartasi.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | sort | 6 gap | «mulohaza» / «mulohaza emas» | savol ham mulohaza deb olinadi |
| 02 | 🟢 | tayanch bilan qo'llash | numpad | sonli yozuv `84 − 37` | qiymatni hisoblab rostligini aniqlash | hisoblamasdan «rost» deb baholanadi |
| 03 | 🟡 | tasvirlar orasida o'tish | match | 4 mulohaza | har birini hukmiga ulash (R yoki Y) | uzun yozuv har doim yolg'on deb olinadi |
| 04 | 🟡 | hisoblash | slots | R va Y uyalari | to'rt mulohazani uyalarga joylash | tekshirish o'rniga taxmin qilinadi |
| 05 | 🟡 | tiklash | numpad | `□` bilan mulohaza | yozuvni rost qiladigan son | har son to'g'ri keladi deb o'ylanadi |
| 06 | 🟡 | matnli masala | missing | taqvim mulohazasi | oy kunlari soni | oylar bir xil deb olinadi |
| 07 | 🟡 | saralash | order | mulohazani tekshirish qadamlari | hisob → solishtirish → hukm | hukm hisobdan oldin aytiladi |
| 08 | 🔴 | chegaraviy holat | sort | «... ekani yolg'on» shaklidagi 4 gap | hukmni aniqlash | ichki inkor e'tiborga olinmaydi |
| 09 | 🔴 | xatoni tahlil qilish | mc | «hamma kvadrat to'g'ri to'rtburchak» va teskarisi | qaysi mulohaza yolg'on va nima uchun | teskari mulohaza ham rost deb olinadi |
| 10 | 🔴 | ko'chirish | match | 4 umumiy mulohaza va 4 qarshi misol | mulohazani uni yolg'on qiladigan misolga ulash | bitta qarshi misol yetarli emas deb o'ylanadi |

Skill teglari: `statement_meaning`, `numeric_check`, `true_false_verdict`,
`verdict_sorting`, `make_it_true`, `calendar_statement`, `check_order`,
`nested_negation`, `converse_statement`, `counterexample`.

---

## 13. DARS 50 — Grafiklar va ma'lumotlar

Nazariya o'zagi: chizmani o'qish uch qadam — avval o'qlar, keyin shkala,
shundan keyingina qiymat; shkalani o'tkazib yuborish eng ko'p uchraydigan
xato. Nazariyaning o'sish grafigi (yosh/bo'y) va to'rt oylik fabrika grafigi
sonlari ishlatilmaydi.

**Modellar:** jadval; ustunli diagramma; chiziqli grafik. O'q imzolari majburiy
(`METODIK_PROFIL_MATEMATIKA.md` must-punkti) va auditda tekshiriladi.

Yig'ish paytida ikki qaror qabul qilindi:

- **Javob tugmalari o'qda emas, chizma ostidagi qatorda.** Dastlab bola qiymatni
  vertikal o'qning o'zida bosardi. 360×640 ekranda 44 px teginish maydonlari
  o'qda ustma-ust tushib qoldi va bola kerakli qiymatni bosa olmadi. Endi o'q
  faqat imzo ko'rsatadi, javob esa gorizontal qatordan tanlanadi — teginish
  maydoni har doim saqlanadi.
- **Jadval gorizontal, 01-topshiriqda uch juftlik.** Vertikal jadval olti qator
  berib, javob maydoni bilan birga ekranga sig'masdi; 01-topshiriqda esa
  to'rtta juftlik past ekranda skroll berardi. Shkala tushunchasi 02 va
  09-topshiriqlarda alohida ishlanadi.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | match | diagramma va o'qlar | o'qni «nima o'lchanadi» ga ulash | gorizontal va vertikal o'q almashtiriladi |
| 02 | 🟢 | tayanch bilan qo'llash | missing | shkala: bir katak 5 birlik | ustun qiymati | bir katak bir birlik deb olinadi |
| 03 | 🟡 | tasvirlar orasida o'tish | numpad | jadval → diagramma | jadvaldagi qiymatni diagrammadan o'qish | ustun balandligi katak soni bilan aralashtiriladi |
| 04 | 🟡 | hisoblash | ticks | chiziqli grafik tugunlari | ko'rsatilgan vaqtdagi qiymat | qo'shni tugun tanlanadi |
| 05 | 🟡 | tiklash | missing | jadvalda bo'sh katak | diagrammadan jadvalni tiklash | shkala hisobga olinmasdan ko'chiriladi |
| 06 | 🟡 | matnli masala | match | to'rt oylik diagramma | savolni javobiga ulash (eng ko'p, eng kam, teng, jami) | «eng ko'p» eng baland katak soni deb olinadi |
| 07 | 🟡 | saralash | sort | 5 ustun | qiymati bo'yicha guruhlash | teng ustunlar farqli deb qaraladi |
| 08 | 🔴 | chegaraviy holat | ticks | shkala noldan boshlanmaydi | qiymatni o'qish | boshlang'ich qiymat qo'shilmaydi |
| 09 | 🔴 | xatoni tahlil qilish | order | shkalani hisobga olmagan yechim | to'g'ri o'qish tartibini tiklash | qiymat o'qlarni o'qimasdan aytiladi |
| 10 | 🔴 | ko'chirish | sort | chiziqli grafik | «o'sdi» / «kamaydi» / «o'zgarmadi» oraliqlari | grafikning umumiy shakli bo'yicha xulosa qilinadi |

Skill teglari: `read_axes`, `read_scale`, `table_to_chart`, `value_from_graph`,
`chart_to_table`, `compare_bars`, `group_by_value`, `non_zero_axis`,
`scale_error`, `trend_transfer`.

---

## 14. DARS 51 — Yakuniy takrorlash

Nazariya o'zagi: yakuniy takrorlash amallar ro'yxati emas — avval savol
nimani so'rayotgani aniqlanadi, keyin mos model tanlanadi, faqat oxirida
hisoblanadi. Perimetr va yuzani chalkashtirish shu birinchi qadam tashlab
ketilganda paydo bo'ladi. Nazariyaning 305 026, 692 503 + 243 497,
240 : 4 · 3, 4 m 56 cm, 7×5 to'rtburchagi ishlatilmaydi.

Har hududdan bittadan topshiriq — kurs bo'ylab yopiladigan yig'ma bank.

| № | daraja | janr | mexanika | model | topshiriq o'zagi | misconception |
|---|---|---|---|---|---|---|
| 01 | 🟢 | tanib olish | ticks | son o'qi | ko'p xonali sonni o'qda joylashtirish | ichki nol o'tkazib yuboriladi |
| 02 | 🟢 | tayanch bilan qo'llash | shade | to'rtburchak setkasi | yuzani kataklar bilan bo'yash | perimetr uchun chegara bo'yaladi |
| 03 | 🟡 | tasvirlar orasida o'tish | slots | xonalar jadvali | og'zaki shakldan raqamli yozuvga | bo'sh xonaga nol qo'yilmaydi |
| 04 | 🟡 | hisoblash | missing | ustun yozuvi | ko'p xonali qo'shishda tushib qolgan raqam | ko'chirish hisobga olinmaydi |
| 05 | 🟡 | tiklash | numpad | lenta modeli | butunning qismini topish | bitta ulushda to'xtaladi |
| 06 | 🟡 | matnli masala | mc | o'lchov kartasi | aralash birlikni bitta birlikka keltirish | koeffitsiyent boshqa kattalikdan olinadi |
| 07 | 🟡 | saralash | slots | 4 savol va model uyalari | savolga mos modelni tanlash | model tanlanmasdan hisoblashga o'tiladi |
| 08 | 🔴 | chegaraviy holat | shade | kvadrat setkasi | perimetr va yuza bir sonda chiqadigan holat | ikki kattalik bir xil narsa deb olinadi |
| 09 | 🔴 | xatoni tahlil qilish | mc | yuza formulasi bilan hisoblangan perimetr | xato nimada | birlik farqi (cm va cm kvadrat) sezilmaydi |
| 10 | 🔴 | ko'chirish | numpad | bosh pult hisoboti | ikki hududdan kelgan ma'lumotni bitta javobga yig'ish | oraliq qiymat javob deb yoziladi |

Skill teglari: `place_value_line`, `area_by_cells`, `words_to_digits`,
`column_add`, `part_of_number`, `unit_convert`, `model_choice`,
`perimeter_equals_area`, `perimeter_vs_area`, `final_transfer`.

---

## 15. QABUL QILISH — nima tekshiriladi

Har dars uchun:

1. `node scripts/grade4-practice-41-51-layout.mjs --check` — raskladka buzilmagan;
2. `node scripts/grade4-practice-41-51-audit.mjs` — 10 topshiriq, `2/5/3`,
   rejalangan mexanikalar, skill teglari, uch tilning to'liqligi, ASCII
   apostrof, kirillcha yo'qligi, har noto'g'ri variantga tahlil, Dars01 rang
   tokenlari, LMS markerlari va **har topshiriqning matematikasini mustaqil
   qayta hisoblash** (110 ta deterministik tekshiruv);
3. `npx eslint <fayl>` va `npx vite build` — 0 xato;
4. `node scripts/grade4-browser-smoke.mjs DarsNNPractice` — 3 til × 4 viewport,
   10 topshiriqning hammasi yechiladi, skroll va konsol tekshiriladi.
   `grade4-lesson-walk.mjs` bu yerda yaramaydi: u nazariy darsning `.stage` va
   `.btn-next` elementlarini izlaydi;
5. `node scripts/grade4-practice-shots.mjs NN` — vizual ko'rik uchun har
   topshiriqning ikki holati (savol va tahlil) surati, balandlik va skroll
   o'lchovi bilan. Telefon uchun `W=390 H=844`. Oldin `npx vite --port 5179
   --strictPort` turadi;
6. 390×844 da savol holatida skroll yo'q; tahlil holatida bitta boshqariladigan
   skroll (ETALON §10 mobil) ruxsat etiladi va feedback avtomatik ko'rinadi.

Sonlar nazariy darsdan farq qilishi har darsda alohida tekshiriladi: nazariy
faylning sonlari amaliyot bankiga tushmasligi kerak.
