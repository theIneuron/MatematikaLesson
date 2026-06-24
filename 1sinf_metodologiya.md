# 1-sinf matematika — metodologiya

**Maqsad:** 1-sinf (6–7 yosh) matematika darslarini qurishda foydalaniladigan
**predmet + yosh** metodik kontrakti. Bu hujjat platformaning umumiy pedagogik
o'zagi (`teaching_methodology`) va matematika kursining `methodology` (ayniqsa §8 —
kichik sinflar) tamoyillarining 1-sinfga **proyeksiyasi**. Ya'ni: 10 ta umumiy
tamoyil 6–7 yoshli o'quvchida aniq nimani anglatadi.

**Bu hujjat nima HAQIDA:** *qanday* o'rgatamiz (pedagogika, CRA, misconception'lar,
dars yoyi, mavzu-bo'yicha metodik eslatmalar).

**Bu hujjat nima HAQIDA EMAS:**
- *Qanday ko'rinishda* (Stage, palitra, shrift, ekran turlari, ovoz texnikasi) →
  `DIZAYN_STANDART_1SINF.md` va Notion `design_system` / `screen_types` /
  `audio_rules`. Dizayn qoidalari bu yerda takrorlanmaydi.
- *Nima* (darslar ketma-ketligi) → `src/books/grade1/Matematika_1sinf_35_dars_kontent.md`
  (35 dars reja) + rasmiy darslik `src/books/grade1/1-matematika.pdf`.

**Manbalar (ustunlik tartibida):**
1. `teaching_methodology` (Platform) — kross-kurs pedagogik hribet, BIRINCHI o'qiladi.
2. `methodology` (Math) §1, §8 — predmet tamoyillari va kichik sinflar xususiyatlari.
3. **`1-matematika.pdf`** — RUz rasmiy 1-sinf darsligi (10 bob). 1-sinf **qamrovi
   va termin manbasi** shu (mundarija — §2 da).
4. `program_map_1_11` 1-sinf — yuqori darajadagi blok xaritasi. **Diqqat:** undagi
   1-sinf bloklari `[reconstructed]` va RUz darsligi bilan to'liq mos kelmaydi (§2,
   §10.1). Ziddiyatda darslik va bu hujjat ustun (1-sinf qamrovi bo'yicha).

> **UZ terminlar — draft.** Bu hujjatdagi barcha o'zbekcha matematik terminlar
> RUz darsligidan olingan yoki taklif (draft). Yakuniy tasdiq — o'zbek metodisti +
> `uz_locale` glossariysi. Apostrof — oddiy `'` (modifikator `ʻ` EMAS).

---

## 0. O'rni — pipeline'da qayerda

`skeleton-generator` har 1-sinf darsini qurishda bu hujjatni o'qiydi: dars yoyini
(§6), mavzuga mos misconception'larni (§7), CRA bosqichini (§4) shundan oladi.
`content-generator` — tonni (§3.9), misconception razborlarini (§7), CRA-yakorlarni
(§4) shundan oladi. `qa-validator` — concrete-bosqich majburiyligini (§4),
typing-yo'qligini (§9), baholash siyosatini (§8) tekshiradi.

---

## 1. O'quvchi kim — 6–7 yosh portreti

1-sinf o'quvchisi 5–11 sinfdan **sifat jihatidan** farq qiladi, “kichikroq versiya”
emas:

- **Uzun matnni o'qiy olmaydi.** Ko'pchilik hali ravon o'qimaydi. Demak ovoz —
  asosiy emas, **yagona ishonchli** tushuntirish kanali. Ekran matni = qisqa tayanch,
  tushuntirishni **ko'tarmaydi** (`teaching_methodology` §1.6).
- **Mavhumlik hali shakllanmagan.** Son — bu hali **miqdor** (narsalar soni), belgi
  emas. `2 + 3 = 5` yozuvi predmet bilan ko'rilmaguncha bo'sh belgi.
- **Diqqat qisqa.** 15 slaydlik dars uzun. 1-sinf uchun **8–12 slayd** optimal
  (`methodology` §8.1).
- **Qo'l bilan o'rganadi.** Sanash, surish, bosish — eng yodda qoladigan kanal.
  Klaviatura yo'q → **typing yo'q** (§9).
- **Xato — qo'rquv manbai.** Tonni yumshoq tut: “xato!” emas, “Keling, birga
  ko'ramiz”. Hook ham yumshoq — “jumboq”, “o'quvchi noto'g'ri” emas (`methodology`
  §8.1).

**Asosiy xulosa:** 1-sinfda **concrete bosqich qisqartirilmaydi**. Har yangi amal
avval narsa bilan, keyin yozuv. Mavhumni erta forsirlash — yil davomidagi asosiy
metodik xato.

---

## 2. RUz rasmiy darsligiga moslik (muhim)

1-sinf qamrovi `program_map_1_11` rekonstruktsiyasidan EMAS, **rasmiy RUz
darsligidan** (`1-matematika.pdf`) olinadi. Darslik 10 bobdan iborat:

| Bob | Mavzu | Bet | Reja blokida aks etishi |
|---|---|---|---|
| I | Narsalarning to'plamlari (joylashuv, taqqoslash, xossalar) | 4 | qisman — sanash oldi (Б1 ga kirish) |
| II | 1 dan 10 gacha sonlar | 14 | Б1 (1–6) ✓ |
| III | 10 ichida qo'shish va ayirish | 34 | Б2 (7–11) ✓ |
| IV | **Geometrik shakllar** (burchak, uchburchak, to'rtburchak, kvadrat, ko'pburchak, aylana/doira, simmetriya, bo'laklardan butun, fazoviy shakllar) | 49 | Б6 (32–33) — **2 darsga siqilgan** ⚠ |
| V | 11 dan 20 gacha sonlar | 68 | Б3 (13–15) ✓ |
| VI | 20 ichida o'nlikdan o'tib qo'shish/ayirish | 83 | Б4 (16–20) ✓ — yil tuguni |
| VII | 20 ichida qo'shish/ayirish (jadvallar, **qavslar**, sonli ifodalar, uzunlik/kesma o'lchovi) | 102 | qisman — Б2 d.12 (qavs), Б11 d.34 (uzunlik) |
| VIII | **21 dan 100 gacha sonlar** | 115 | Б8 (21–23) ✓ |
| IX | **100 ichida qo'shish/ayirish** (tarkibli masala, ikki amalli masala, sonli ketma-ketlik, sig'im) | 123 | Б9 (24–27), Б10 (30–31), Б11 (35) ✓ |
| X | **Ma'lumotlar bilan ishlash** | 144 | **rejada YO'Q** ⚠ (§10.3) |

**Topilma 1 — 100 gacha qamrov to'g'ri.** Reja Б8/Б9 (21–100, 100 ichida amallar),
qavslar (d.12), tarkibli/ikki amalli masala (Б10), uzunlik/sig'im (Б11) —
hammasi **rasmiy darslikdan**, “ortiqcha” emas. `program_map_1_11` ning “1-sinf — 20
gacha” degani `[reconstructed]` taxmin va RUz uchun **noto'g'ri**. Bu —
program_map ochiq savol #6. Program_map'ni shu darsligga moslab yangilash kerak
(`knowledge-updater` orqali, metodist tasdig'i bilan).

**Topilma 2 — tartib farqi (izohlanadi).** Darslik geometriyani **erta** beradi
(IV bob, 1–10 sonlardan keyin), reja esa geometriyani **oxirga** to'playdi (Б6,
32–33). Bu — metodik jihatdan asosli tanlov (raqamli liniyani uzmaslik), lekin
xabardor bo'lgan holda qilingan bo'lsin.

**Topilma 3 — bo'shliqlar va kam-qamrov:** §10.2 va §10.3.

---

## 3. 10 tamoyilning 1-sinfga proyeksiyasi

`teaching_methodology` §1 ning 10 tamoyili 1-sinfda ham to'liq ishlaydi. Quyida —
faqat 1-sinfga xos aniqlashtirishlar.

**3.1. Ochiq raqam (qoidadan oldin).** 1-sinfda “qoida” = ovozli **qisqa xulosa**,
formal ta'rif emas. O'quvchi avval narsani **surib/sanab** qonuniyatni ko'radi,
keyin ovoz uni bir jumlada umumlashtiradi. Ekranga formal ta'rif **yozilmaydi**.

**3.2. Yopiq sikl.** Hook real, kichik maqsad qo'yadi (“Madinaga 3 ta olma kerak,
yetadimi?”), yakun shu maqsadni bajaradi. 1-sinfda maqsad — **ko'rinadigan,
sanaladigan** bo'lsin.

**3.3. Boshqariladigan ochilish.** Uchrashuv → sezish → xulosa → mashq → qo'llash.
1-sinfda “uchrashuv” va “sezish” bosqichlari **uzunroq va concrete**, “xulosa”
qisqa.

**3.4. Xato — material.** Har noto'g'ri variantга **aniq** razbor (“qaytadan sana”,
“o'nliklarni tekshir”), umumiy “noto'g'ri” TAQIQ. **Веди-до-верного**: noto'g'ri
xiralashadi, qolganlari faol, “Davom” faqat to'g'ridan keyin. Yakuniy son sirqimaydi
(§8, dizayn §6.4).

**3.5. Kognitiv yuk.** Bir ekran = bitta g'oya. Termin va amalni **bir vaqtda
kiritma**. Har yangi **interaksiya turi** oldidan qisqa ovozli ko'rsatma-slayd.
Sonlar diapazoni dastur bilan o'sadi (1–10 → 1–20 → 21–100).

**3.6. Ovoz — yetakchi kanal.** Tushuntirishni ovoz ko'taradi, vizual takrorlamaydi.
Sonlar ovozda **so'z bilan** (“besh”, “o'n ikki”), raqam/belgi bilan emas
(`audio_rules`). To'g'ri javob ovozi ba'zan sonni **so'z bilan to'liq** aytib qo'yadi
(eshitib to'g'ri o'qishni o'rganadi).

**3.7. Spirallik.** Bir kontsept dars ichida 3–4 ekranda qaytadi. Mustahkamlash
o'yinlari — **oxirida blok bo'lib**, tushuntirilgandan keyin.

**3.8. Mahsulot.** 1-sinfda “mahsulot” = o'quvchi **o'zi yechadigan** kichik
topshiriq (bosib/surib), AI-baholanadigan erkin matn EMAS (Fuzayl qarori, dizayn
§11).

**3.9. Hurmatli ton.** “Malades/jonim” yo'q; “Aniq emas” + razbor. Узбекча — **siz**
(formal, ota-onaga hurmat), SOV tartibi, o'zbek ismlar (Madina, Zaynab, Alisher,
Bekzod).

**3.10. Mentor — platforma ovozi.** Ism/yuz/avatar yo'q; do'st-personajga
aylanmaydi.

---

## 4. CRA progressiyasi 1-sinfda (Concrete → Pictorial → Abstract)

`methodology` §1.2. 1-sinf — **deyarli butunlay Concrete**.

- **Concrete (asosiy).** Har yangi amal avval **narsa** bilan: olma, tayoqcha,
  barmoq, non bo'lagi, tanga. Yoki ularning to'g'ridan-to'g'ri analogi (bosiladigan
  olma-ikonalar). Har yangi amal turida concrete bosqich **kamida bitta to'liq
  ekran** (`qa-validator` tekshiradi).
- **Pictorial (sodda).** Doiracha, tayoqcha, **ten-frame (o'nlik katak — 2×5)** —
  1-sinfning asosiy pictorial vositasi (o'nlik tuzilishini ko'rsatadi). Razryad
  bloklari (o'nlik to'plam + birliklar) — 21–100 va 100 ichida amallar uchun.
- **Abstract.** Faqat **natijani yozish**. Formula yo'q.

**MUHIM CHEGARA — bar model 1-sinfda YO'Q.** Bar model (tasmali model)
`methodology`/program_map bo'yicha **3-sinfdan** ishlaydi (1–2 sinfda concrete + sodda
rasm). 1-sinfda taqqoslash va “qism-butun” — **predmet va ten-frame** bilan, tasma
bilan emas.

---

## 5. Yil bo'ylab raqamli sezgi yadrosi

1-sinf — bitta uzun zanjir; har bo'g'in keyingisini ko'taradi. Yilning tugunlari:

1. **Sanash → avtomatik (10 gacha).** Yilning bosh yutug'i — barmoqsiz, qayta
   sanamasdan. Misconception'lar: sakrab/ikki marta sanash; **kardinallik** yo'q
   (oxirgi son = jami ekanini ko'rmaydi); 0 = “yo'q” degani.
2. **Sonlar tarkibi (domiklar).** 5 = 2+3 = 4+1 = … — bu **qo'shish/ayirishning
   poydevori**. Mustahkam bo'lmasa, o'nlikdan o'tish ham sinadi. Misconception:
   sonni faqat bitta usulda buzish mumkin deb o'ylash.
3. **Qo'shish/ayirish ma'nosi (10 ichida).** Misconception: 1 dan qayta sanash
   (досчитывание yo'q); ayirishni qo'shishning teskarisi sifatida ko'rmaslik.
4. **O'nlik — yangi sanash birligi (11–20).** Yilning **kritik tuguni**:
   “10 ta birlik = 1 o'nlik”. Buni tushunmasa, butun keyingi matematika oqsaydi
   (program_map 1-sinf “riska”). Misconception: 14 ni “bir va to'rt” deb ko'rish,
   o'nlik+birlik emas.
5. **O'nlikdan o'tib qo'shish/ayirish (kritik tugun, Б4).** Asosiy strategiya —
   **o'ngacha to'ldirish (make-ten)**: `8 + 5 = 8 + 2 + 3 = 10 + 3`. Darslik VI
   bob ham aynan shunday (16-dars “o'ngacha to'ldirish”). Misconception: birma-bir
   sanash (make-ten o'rniga); o'tishni yo'qotish.
6. **21–100, 100 ichida amallar (Б8–Б9).** **Razryad printsipi** (“o'rin sonning
   qiymatini belgilaydi”). Misconception: “raqam ko'p = son katta” pozitsiyasiz.
7. **Masalalar (Б5, Б10).** Misconception: amalni **kalit so'z**/sonlarga qarab
   taxmin qilish (“jami” → qo'shish) mazmunini tushunmay.

---

## 6. Dars yoyi — 1-sinf moslamasi

Kanonik 9 qadamli yoy (`teaching_methodology` §2) 1-sinfda **siqiladi va
concrete'lashadi** (8–12 slayd):

| # | Qadam | 1-sinfda |
|---|---|---|
| 1 | Hook | **Yumshoq jumboq** + ko'rinadigan maqsad. s0 jonli animatsiya. |
| 2 | Uchrashuv (concrete) | Narsa bilan vaziyat (olma sanash, tayoqcha to'plash). |
| 3 | Sezish | Qonuniyatga e'tibor (ovoz so'raydi: “nimani sezdingiz?”). |
| 4 | Xulosa (qisqa) | Ovozli bir jumlali umumlashma. Formal ta'rif yo'q. |
| 5 | Boshqariladigan mashq | Tap/drag, веди-до-верного, firstTry yashirin. |
| 6 | Qo'llash | Bitta kichik masala / yangi kontekst. |
| 7 | Yakun (can-do) | “Endi siz … sanay/qo'sha olasiz.” Son ko'rsatilmaydi. |

Mustahkamlash o'yinlari (agar bo'lsa) — **oxirida blok**, oson→qiyin, ovozsiz
o'yinda qisqa “to'g'ri/noto'g'ri” signal.

---

## 7. Mavzu bo'yicha metodik eslatmalar (blok-blok)

Har blok uchun: **kontsept-avval yondashuv**, asosiy **misconception'lar**, CRA,
nimadan qochish.

### Б1 — 10 gacha sonlar (1–6)
- Sanash → raqam → tarkib (domiklar). 0 alohida: “hech narsa qolmadi”.
- Misconception: kardinallik yo'q; raqam ↔ miqdor ulanmaydi; 0 ni tashlab ketish.
- CRA: predmet sanash → doiracha/ten-frame → raqam. Bar model YO'Q.

### Б2 — 10 ichida qo'shish/ayirish (7–11)
- Ma'no avval (birlashtirish/olib tashlash) → keyin amal. O'rin almashtirish
  (`a+b=b+a`) — predmetni teskari sanab ko'rsatiladi.
- d.12 **Qavslar** (darslik VII bob) — 1-sinfga mos, lekin **“ichidagini avval
  sanaymiz”** intuitsiyasi sifatida, formal amallar tartibi sifatida EMAS.
  “Ozshanish” (ознакомление) darajasida ushlash to'g'ri.
- Misconception: 1 dan qayta sanash; ayirish ≠ qo'shishning teskarisi.

### Б3 — 11–20, o'nlik (13–15)
- **Yil tuguni.** O'nlikni **yasash** (10 ta tayoqchani bog'lash) → razryad
  kartalari. Ten-frame to'lib, ikkinchisi boshlanishi.
- Misconception: o'nlikni birlik to'plami deb ko'rmaslik; 14 = “1 va 4”.

### Б4 — O'nlikdan o'tish (16–20) — kritik tugun
- **Make-ten** asosiy: `8+5 = 8+2+3 = 10+3`. Darslik VI bob shunday.
- Qadamlab ochilish (pошаговая), ten-frame to'ldirish vizuali.
- Misconception: birma-bir sanash; o'tishdagi 10 ni yo'qotish; ayirishda qarzni
  noto'g'ri olish.

### Б8 — 21–100 (21–23)
- Razryad modeli: o'nlik bloklar + birliklar. “45 = 4 o'nlik + 5 birlik”.
- Sonli ketma-ketlik: 5 talab, 10 talab oldinga/orqaga.
- Misconception: “raqam ko'p = katta” pozitsiyasiz; ikki xonali sonni razryadsiz
  o'qish.

### Б9 — 100 ichida qo'shish/ayirish (24–27)
- **DIQQAT — столбик YO'Q.** Darslik IX bob amalni **razryad bo'yicha
  (gorizontal) parchalash** bilan beradi: `20+30 = o'nlik+o'nlik (2+3=5)`;
  `53+40 = 50+40, keyin +3`; `22+8+7`. Formal “столбик” (ko'chirish bilan ustun
  algoritmi) — `methodology`/program_map bo'yicha **3-sinf**. 1-sinfda razryad
  modeli + parchalash ishlatiladi (reja d.26–27 dagi “в столбик” formulirovkasi
  shunga tuzatilsin — §10.2).
- Misconception: razryadlarni aralashtirish; o'nlik orqali ayirishda xato.

### Б5 / Б10 — Masalalar (28–29, 30–31)
- Masala tuzilishi: shart → savol → amal → javob. Amalni **mazmundan** tanlash,
  kalit so'zdan emas.
- d.30–31 tarkibli/ikki amalli (darslik IX bob) — mos. 1-sinfda **jadval/sxema
  bilan** (“bor edi / qo'shildi / jami”), ko'p qadamni ovoz boshqaradi.
- Misconception: amalni sonlarga qarab taxmin; ikki qadamni rejalashtirmaslik.

### Б6 — Geometriya (32–33)
- Van Hiele **0-daraja** (vizual tanish): “bu uchburchak, chunki uchburchakka
  o'xshaydi”. Xossalar bo'yicha ta'rif (1-daraja) — hali EMAS.
- **Qamrov (qaror §10.4):** 2 dars saqlanadi, lekin darslik IV bobining keng
  mavzulari — **simmetriya**, **fazoviy/3D shakllar**, bo'laklardan butun — shu 2
  dars **ichiga** kichik bo'lim sifatida kiritiladi (alohida dars qo'shilmaydi).

### Б11 — O'lchov (34–35)
- Uzunlik: kesma, sm/dm/m (darslik VII bob — uzunlik/kesma o'lchovi; sig'im — IX
  bob). Avval **bevosita o'lchash** (birliklarni qo'yib sanash), keyin son.
- Misconception: o'lchashni 0 dan boshlamaslik; birliklar orasini hisobga olmaslik.

### Б12 — Ma'lumotlar bilan ishlash (36) — darslik X bob
- Sodda piktogramma/jadval **o'qish**: rasm-ma'lumotlardan sanash, “qaysi ko'p/kam”,
  sodda jadvalni to'ldirish. Tahlil emas — o'qish va taqqoslash darajasi.
- CRA: rasm-ma'lumot (concrete) → sodda jadval (pictorial). Tap/drag, typing yo'q.
- Misconception: piktogrammada 1 rasm bir nechta birlik bo'lishi (masshtab) — 1-sinfda
  **1 rasm = 1 birlik** ushlanadi.

---

## 8. Baholash siyosati — 1-sinf

`teaching_methodology` §1.4 bo'yicha, o'zgarishsiz:
- **Веди-до-верного** har scored ekranda. “Davom” faqat to'g'ridan keyin.
- Ball **birinchi urinish** (`firstTry`) bo'yicha, LMS'ga ketadi, **o'quvchiga
  ko'rsatilmaydi** (summary'da son yo'q).
- Vizual natijani oshkor qilmaydi (winner-flag yo'q). Feedback — **rang + belgi**
  (✓/✗), faqat rang emas (rang ko'rmaydiganlar uchun).
- Mustahkamlash o'yinlarida (ovozli razbor yo'q) — qisqa **nerechevoy** signal.

---

## 9. Typing yo'q — pedagogik sabab

6–7 yosh hali ravon yozmaydi, klaviatura yo'q. Javob **har doim bosish (tap) yoki
surish (drag)** orqali, ovoz yo'naltiradi. Raqam kiritish (`NumInput`,
fill-in-the-blank, ColumnSolver) — 1-sinfda **chiqariladi**; o'rnida bosiladigan
raqam-plitalar / sonli MC. Tafsilot va savol turlari palitrasi — `DIZAYN_STANDART_1SINF.md`
§12. Bu qoidadan chetlanish metodist tasdig'ini talab qiladi.

---

## 10. Qarorlar (metodist tasdig'i — 2026-06-24)

Boshqaruvchi manba: **`Matematika_1sinf_35_dars_kontent.md`** (reja) + rasmiy
darslik. Ziddiyatda reja/darslik ustun, `program_map_1_11` emas.

**10.1. Qamrov — 100 gacha. ✓ Tasdiqlandi.** 1-sinf reja va darslik bo'yicha 100
gacha boradi (§2). `program_map_1_11` ning “20 gacha” degani (`[reconstructed]`,
ochiq savol #6) **noto'g'ri** — program_map darsligga moslab yangilanadi
(`knowledge-updater`, alohida).

**10.2. Столбик — razryad + parchalash. ✓ Tasdiqlandi.** d.25–27 da formal
“столбик” ISHLATILMAYDI. 100 ichida qo'shish/ayirish **razryad bo'yicha
parchalash** bilan (darslik IX bob): `20+30 → 2 o'nlik+3 o'nlik`, `53+40 = 50+40,
keyin +3`, `22+8+7`. Reja matnidagi “в столбик” formulirovkasi shunga tuzatildi.

**10.3. Ma'lumotlar bilan ishlash — dars qo'shiladi. ✓ Tasdiqlandi.** Darslik X
bobi (sodda piktogramma/jadval o'qish) rejaga **Б12 (d.36)** sifatida qo'shildi.
Taklif qilingan metodika (concept-first, typing-yo'q, tap/drag) bo'yicha quriladi.

**10.4. Geometriya — 2 dars, ichiga to'ldiriladi.** Reja Б6 (d.32–33) saqlanadi,
lekin darslik IV bobining keng mavzulari (simmetriya, fazoviy/3D shakllar,
bo'laklardan butun) **shu 2 dars ichiga** kichik bo'lim sifatida kiritiladi —
alohida dars qo'shilmaydi. Van Hiele 0-daraja (vizual tanish) darajasida.

**10.5. Tartib — reja saqlanadi.** Geometriya oxirda (raqam → keyin geometriya)
to'planadi (darslik erta bersa ham). Asosli guruhlash sifatida qabul qilindi.

---

## 11. UZ terminlar — 1-sinf draft glossariy

Darslikdan olingan / taklif. **Draft — o'zbek metodisti + `uz_locale` tasdig'igacha.**
Apostrof oddiy `'`.

| RU / kontsept | UZ (draft) | Izoh |
|---|---|---|
| счёт / считать | sanash | |
| число | son | |
| цифра | raqam | son ≠ raqam |
| ноль | nol | |
| больше / меньше / равно | katta / kichik / teng | taqqoslash |
| сложение / прибавить | qo'shish | |
| вычитание / отнять | ayirish | |
| сумма | yig'indi | |
| разность | ayirma | |
| слагаемое | qo'shiluvchi | |
| десяток | o'nlik | yil tuguni |
| единица (разряд) | birlik | |
| разряд | xona | razryad |
| переход через десяток | o'nlikdan o'tish | |
| дополнить до 10 | o'ngacha to'ldirish | make-ten |
| скобки | qavslar | darslik VII bob |
| задача | masala | |
| условие / вопрос | shart / savol | |
| отрезок | kesma | |
| прямая / луч / точка | to'g'ri chiziq / nur / nuqta | |
| длина | uzunlik | |
| симметрия | simmetriya | darslik IV bob |
| фигура | shakl | |

> Asosiy darslik termini bilan ziddiyat bo'lsa — darslik ustun. 5–6 sinf
> glossariysidagi `son o'qi` / `sonlar nuri` kabi terminlar 1-sinfga **olib
> o'tilmaydi** (xotira: textbook-term-canon).

---

## 12. Bog'liq hujjatlar

- `DIZAYN_STANDART_1SINF.md` — dizayn kontrakti + §10 1-sinf adaptatsiyalari + §12
  typing-yo'q savol turlari.
- `src/books/grade1/Matematika_1sinf_35_dars_kontent.md` — 35 dars reja.
- `src/books/grade1/1-matematika.pdf` — rasmiy RUz darsligi (qamrov + termin manbasi).
- Notion: `teaching_methodology` (§1, §2 — pedagogik hribet), `methodology` (§1, §8 —
  kichik sinflar), `program_map_1_11` (1-sinf bloklari — `[reconstructed]`, §2/§10.1
  ga qarang), `audio_rules`, `uz_locale`, `screen_types`, `design_system`.
