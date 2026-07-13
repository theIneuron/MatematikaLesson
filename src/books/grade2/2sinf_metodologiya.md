# 2-sinf matematika — metodologiya

**Maqsad:** 2-sinf (7–8 yosh) matematika darslarini qurishda foydalaniladigan
**predmet + yosh** metodik kontrakti. Bu hujjat platformaning umumiy pedagogik
o'zagi (`teaching_methodology`) va matematika kursining `methodology` (§8 — kichik
sinflar) tamoyillarining 2-sinfga **proyeksiyasi**, hamda `1sinf_metodologiya.md`
ning yuqoriga davomi (o'sha yoy 7–8 yoshda nimaga aylanadi).

**Bu hujjat nima HAQIDA:** *qanday* o'rgatamiz (pedagogika, CRA, misconception'lar,
dars yoyi, mavzu-bo'yicha metodik eslatmalar).

**Bu hujjat nima HAQIDA EMAS:**
- *Qanday ko'rinishda* (Stage, palitra, shrift, ekran turlari, ovoz texnikasi) →
  `DIZAYN_STANDART_1SINF.md` (arxitektura o'zgarmaydi) + `ETALON_2SINF.md` (2-sinf
  deltalari) + Notion `design_system` / `screen_types` / `audio_rules`.
- *Qaysi hikoya qatlami* → `SYUJET_2SINF.md`.
- *Nima* (darslar ketma-ketligi) → `Math_1-11_Поурочно_RUz` xlsx «2 класс» varag'i
  (39 dars + 7 nazorat) + rasmiy darslik `src/books/grade2/Matematika 2 sinf UZ.pdf`.

**Manbalar (ustunlik tartibida):**
1. `teaching_methodology` (Platform) — kross-kurs pedagogik hribet, BIRINCHI o'qiladi.
2. `methodology` (Math) §1, §8 — predmet tamoyillari va kichik sinflar xususiyatlari.
3. **`Matematika 2 sinf UZ.pdf`** — RUz rasmiy 2-sinf darsligi (8 bob, 2021, lotin).
   2-sinf **qamrovi va termin manbasi** shu (mundarija — §2).
4. `1sinf_metodologiya.md` — quyi bosqich; prerekvizit va uzluksizlik shundan.
5. xlsx «2 класс» — dars-blok tuzilishi (Б1–Б6). Darslik bilan ziddiyatda darslik ustun.

> **UZ terminlar — draft.** Bu hujjatdagi barcha o'zbekcha matematik terminlar
> RUz darsligidan olingan yoki taklif. Yakuniy tasdiq — o'zbek metodisti +
> `uz_locale` glossariysi. Apostrof — oddiy `'` (modifikator `ʻ` EMAS).

---

## 0. O'rni — pipeline'da qayerda

`skeleton-generator` har 2-sinf darsini qurishda bu hujjatni o'qiydi: dars yoyini
(§6), mavzuga mos misconception'larni (§7), CRA bosqichini (§4) shundan oladi.
`content-generator` — tonni (§3), misconception razborlarini (§7), CRA-yakorlarni
(§4) shundan oladi. `qa-validator` — concrete-bosqich majburiyligini (§4),
typing-yo'qligini (§9), baholash siyosatini (§8) tekshiradi.

**Ikki bo'lim:** har mavzu ikki deliverable beradi — **nazariy** (to'liq Stage-dars,
o'rgatish) va **amaliy** (jsx-question mashqlar, mustahkamlash). Metodika ikkalasiga
ham amal qiladi; farqlar `ETALON_2SINF.md` da. Bu hujjat asosan **nazariy** yoyni
belgilaydi; amaliy — o'sha misconception'larni typingsiz mashq bilan mustahkamlaydi.

---

## 1. O'quvchi kim — 7–8 yosh portreti (1-sinfdan farq)

2-sinf o'quvchisi 1-sinfdan **bir pog'ona** yuqori, lekin hali 5–11 sinfdan sifat
jihatidan farq qiladi:

- **Qisqa matnni o'qiy boshlaydi.** 1-sinfdan yaxshiroq, lekin uzun matn hali og'ir.
  Ovoz — hali **asosiy** tushuntirish kanali; ekran matni qisqa tayanch bo'lib qoladi
  (`teaching_methodology` §1.6). Farq: 2-sinfda bitta qo'shimcha qisqa yozma tayanch
  (masala sharti, qoida qatori) mumkin, lekin tushuntirishni ko'tarmaydi.
- **Mavhumlik shakllana boshlaydi.** `2 + 3 = 5` yozuvi endi ko'proq ma'noli, lekin
  yangi amal (ko'paytirish, bo'lish) avval **narsa/guruh** bilan ko'rilmaguncha bo'sh
  belgi. Razryad (o'nlik/birlik) — endi ishonchli tayanch, ustiga quriladi.
- **Diqqat biroz uzunroq.** 1-sinf 8–12 slayd edi; 2-sinf nazariy dars **kamida 15 ekran**,
  **davomiyligi kamida 15 minut** (faqat nazariy; amaliy alohida, o'z tempida).
  Vaqt-budjeti — §6.1. Amaliy — 1 mashq/fayl.
- **Qo'l bilan o'rganish davom etadi.** Sanash, surish, bosish, guruhlash — eng yodda
  qoladigan kanal. Klaviatura yo'q → **typing yo'q** (§9); javob tap/drag bilan.
- **Xato — hali qo'rquv manbai.** Ton yumshoq: "xato!" emas, "Keling, birga
  ko'ramiz". Hook — jumboq/missiya, "o'quvchi noto'g'ri" emas.

**Asosiy xulosa:** 2-sinfda ham **concrete bosqich qisqartirilmaydi**. Ayniqsa yangi
katta g'oyalar — **ko'paytirish, bo'lish, столбik, доли** — avval narsa/guruh/model
bilan, keyin yozuv. Mavhumni erta forsirlash — yilning asosiy metodik xatosi.

---

## 2. RUz rasmiy darsligiga moslik

2-sinf qamrovi rasmiy RUz darsligidan (`Matematika 2 sinf UZ.pdf`, 2021, 192 bet)
olinadi. Darslik 8 bobdan iborat (mundarija):

| Bob | Mavzu (darslik) | Bet | xlsx blok |
|---|---|---|---|
| — | **1-sinfda o'tilganlarni takrorlash** (100 gacha, qo'shish/ayirish) | 5 | Б1 kirish (nomerlash) |
| I | **100 ичida qo'shish** | 12 | Б2 (qo'shish) |
| II | **100 ичida ayirish** | 32 | Б2 (ayirish, столбik) |
| III | **Geometrik shakllar** | 52 | Б5 |
| IV | **Sonlarni ko'paytirish** | 68 | Б3 |
| V | **Sonlarni bo'lish** | 88 | Б4 |
| VI | **Sonli va harfli ifodalar. Tenglamalar** | 117 | Б6 (ifoda/tenglama) |
| VII | **Butunning bo'laklari. Vaqt** | 140 | Б6 (доли, vaqt) |
| VIII | **Ma'lumotlar bilan ishlash** | 162 | Б6 (data) |

**Topilma 1 — nomerlash bloki (Б1) darslikda "takrorlash" sifatida.** Darslik 100
gacha sonlar (o'nlik/birlik, o'qish/yozish, taqqoslash) ni 1-sinf materiali sifatida
takrorlaydi va ustiga amallar quradi. xlsx esa Б1 ni to'liq 7 darslik nomerlash
bloki qiladi (o'nliklar/birliklar → o'qish/yozish → razryad tarkibi → taqqoslash →
o'nlab sanash → son o'qi). Bu — **1-sinf tugunini mustahkamlab, 2-sinf amallariga
poydevor**. Etalon (Dars01) shu blokdan boshlanadi.

**Topilma 2 — tartib farqi (izohlanadi).** Darslik geometriyani **erta** beradi
(III bob, amallardan oldin), xlsx esa geometriyani ×÷ dan **keyin** (Б5) qo'yadi.
Bu — 1-sinfdagi kabi asosli tanlov (arifmetik zanjirni uzmaslik); xabardor holda.

**Topilma 3 — darslik SHARTLI BELGILARI** (metodikaga foydali): og'zaki bajaramiz ·
aqlni charxlaymiz · yozma bajaramiz · taqqoslaymiz · birga bajaramiz · amaliy
topshiriq · uyda bajaramiz. Bu — CRA va interaksiya turiga tabiiy xarita (og'zaki =
audio-recall, birga = drag/tap, taqqoslaymiz = > < = mashq).

---

## 3. 10 tamoyilning 2-sinfga proyeksiyasi

`teaching_methodology` §1 ning 10 tamoyili 2-sinfda ham to'liq ishlaydi. Quyida —
1-sinfdan farq qiladigan aniqlashtirishlar.

**3.1. Ochiq raqam (qoidadan oldin).** 2-sinfda "qoida" — ovozli qisqa xulosa +
bitta yozma qator (masalan "5 ni 3 marta olsak: `5+5+5` — buni `3 × 5` deb yozamiz").
O'quvchi avval guruhni **quradi/sanaydi**, keyin qoida umumlashtiradi. Formal ta'rif
yo'q.

**3.2. Yopiq sikl.** Hook real, ko'rinadigan maqsad (masalan "3 ta savatda 5 tadan
olma — jami nechta, bittalab sanamasdan?"), yakun shu maqsadni bajaradi.

**3.3. Boshqariladigan ochilish.** Uchrashuv → sezish → xulosa → mashq → qo'llash.
2-sinfda "sezish" bosqichi qonuniyatga urg'u beradi ("har guruhда bir xil — shu
sababli tez").

**3.4. Xato — material.** Har noto'g'ri variantга **aniq** razbor (usulni ko'rsatadi,
sonni bermaydi). **Веди-до-верного** har scored ekranда. Yakuniy son sirqimaydi.

**3.5. Kognitiv yuk.** Bir ekran = bitta g'oya. **Termin va amalni bir vaqtda
kiritma** (ko'paytirish belgisi `×` ni ma'nosidan alohida kiritma). Har yangi
interaksiya turi oldidan qisqa ovozli ko'rsatma. Sonlar diapazoni 100 gacha; jadval
ko'paytmasi 100 gacha.

**3.6. Ovoz — yetakchi kanal.** Tushuntirishni ovoz ko'taradi, vizual takrorlamaydi.
Sonlar ovozda **so'z bilan** ("yigirma besh", "uch marta besh"). `×` = "marta" /
"ko'paytiramiz"; `÷` = "ga bo'lamiz" / "teng bo'lamiz"; `=` = "teng"; столбik = "xona
ostiga xona".

**3.7. Spirallik.** Bir kontsept dars ichida 3–4 ekranда qaytadi; amaliy bo'lim
o'sha kontseptni typingsiz mashq bilan yana mustahkamlaydi. ×↔÷ bog'lanishi butun
Б3–Б4 bo'ylab spiral.

**3.8. Mahsulot.** O'quvchi **o'zi yechadigan** kichik topshiriq (bosib/surib/
guruhlab). AI-baholanadigan erkin matn EMAS (Fuzayl qarori).

**3.9. Hurmatli ton.** "Malades/jonim" yo'q; "Aniq emas" + razbor. UZ — **siz**
(formal), SOV, o'zbek ismlar (Ra'no, Anvar, Zuhra, Jasur — davomiy cast; yangi
masala qahramonlari: Madina, Bekzod, Kamola, Sardor…).

**3.10. Mentor — platforma ovozi.** Bit — diktor (3-shaxs, ayol ovoz canon); ism/yuz/
avatar do'st-personajga aylanmaydi.
**(2-sinf v2 istisno, 2026-07-13):** «Bit uyga qaytadi» syujetida Bit sayohatchi-qahramon
HAM (ekranda ekipaj bilan); ovoz canon (ayol) saqlanadi. Manba — `SYUJET_2SINF.md` v2.

---

## 4. CRA progressiyasi 2-sinfda (Concrete → Pictorial → Abstract)

`methodology` §1.2. 2-sinf — **concrete asosiy, pictorial kuchayadi, abstract cheklangan**.

- **Concrete (yangi amallar uchun majburiy).** Har yangi amal avval **narsa/guruh**
  bilan: olma, tanga, o'nlik-bloklari, teng guruhlar (koptoklar), butun bo'laklari
  (non/tort/qog'oz). Har yangi amal turida concrete bosqich **kamida bitta to'liq
  ekran** (`qa-validator` tekshiradi).
- **Pictorial (kuchayadi).** Ten-frame va **razryad bloklari (o'nlik + birlik)** —
  nomerlash va 100 ичida amallar uchun asosiy. **Массив/guruh modeli** (satr×ustun
  nuqtalar) — ko'paytirish uchun asosiy pictorial. **Son o'qida sakrash** — bo'lish/
  karrali sanash uchun.
- **Abstract.** Yozuv: `3 × 5 = 15`, столбik yozuvi, `x + 4 = 9`. Faqat concrete/
  pictorial'dan keyin, natijani rasmiylashtirish sifatida.

**MUHIM CHEGARA — bar model 2-sinfda hali YO'Q.** Tasmali (bar) model
`methodology`/program_map bo'yicha **3-sinfdan**. 2-sinfda "qism-butun" va masala —
**concrete + razryad bloklari + guruh/massiv + son o'qi** bilan, tasma bilan emas.

**MUHIM YANGILIK — столбik 2-sinfda PAYDO bo'ladi.** 1-sinfda столбik yo'q edi
(razryad parchalash bilan). 2-sinf darslik I–II bobi va xlsx d.12 столбikni beradi.
Lekin **concrete-avval**: столбik yozuvidan oldin o'nlik/birlik bloklari bilan
"xonama-xona qo'shamiz/ayiramiz, o'nга yetsa — bitta o'nlik ko'chadi" ko'rilsin. Столбик —
razryad tushunchasining tez yozuvi, alohida sehr emas.

---

## 5. Yil bo'ylab raqamli sezgi yadrosi (tugunlar)

2-sinf — 1-sinf zanjirining davomi; har bo'g'in keyingisini ko'taradi.

1. **Razryad 100 gacha (Б1).** "O'rin qiymatni belgilaydi": `45 = 4 o'nlik + 5 birlik`.
   Misconception: "raqam ko'p = son katta" pozitsiyasiz; ikki xonali sonni razryadsiz
   o'qish; o'nlab sanashда birlikni yo'qotish.
2. **100 ичida qo'shish/ayirish, столбik (Б2).** O'tishli (`47+38`) va o'tishsiz;
   столбik = xonama-xona + ko'chirish/qarz. Misconception: xonalarni aralashtirish
   (birlikni o'nlikka qo'shish); столбikда ko'chirishni unutish; qarz olishда xato.
3. **Ko'paytirish ma'nosi va jadval (Б3) — yil tuguni.** `3 × 5` = "3 ta 5 talik" =
   `5+5+5`. Teng guruhlar / massiv. O'rin almashish (`3×5 = 5×3`) — massivni burab
   ko'rsatiladi. Misconception: `3 × 5` ni "3 va 5" yoki `3+5` deb ko'rish; teng
   bo'lmagan guruhларni ko'paytirish; jadvalni tushunmay yodlash.
4. **Bo'lish ma'nosi va ×↔÷ bog'lanishi (Б4) — kritik tugun.** Ikki ma'no: **teng
   guruhga ulashish** (12 ni 3 ga → har birida 4) va **guruhlarga bo'lish** (12 ni
   4 tadan → 3 guruh). ×↔÷ oilasi: `3×4=12 → 12÷3=4, 12÷4=3`. Misconception: bo'lishni
   ayirish deb ko'rish; ×↔÷ bog'lanishini ko'rmaslik; qoldiqni e'tiborsiz qoldirish.
5. **Geometriya va perimetr (Б5).** Chiziq turlari (to'g'ri/nur/kesma), ko'pburchak,
   sm/dm/m, **perimetr** = tomonlar yig'indisi. Misconception: perimetrni yuza bilan
   aralashtirish; o'lchashni 0 dan boshlamaslik.
6. **Ifoda, tenglama, доли, vaqt, data (Б6).** Sonli/harfli ifoda (`a+5`); sodda
   tenglama (`x+4=9` — noma'lumni topish); **доли** (yarim/chorak/uchdan bir — butun
   bo'laklari, kasr EMAS); soat/vaqt, kalendar, pul; ma'lumot o'qish. Misconception:
   доли da bo'laklar teng bo'lishi shart ekanini unutish; tenglamada noma'lumni
   mexanik ko'chirish.

---

## 6. Dars yoyi — 2-sinf moslamasi (nazariy dars)

Kanonik yoy (`teaching_methodology` §2) 2-sinfda **concrete-avval, uch-fazali** bo'ladi
(12–15 slayd). Faza chegaralarida bridge-ko'prik (audio + ekranда qisqa ↳ qator).

| Faza | # | Qadam | 2-sinfda |
|---|---|---|---|
| **NAZARIY** | 1 | Hook | Yumshoq missiya/jumboq + ko'rinadigan maqsad. s0 jonli animatsiya. |
| | 1a | Prerekvizit-recall | Bitta qisqa "o'tgan dars" mikro-savoli (spaced retrieval, §3.7). |
| | 2 | Uchrashuv (concrete) | Narsa/guruh bilan vaziyat (guruhlar, o'nlik-bloklari). |
| | 3 | Sezish | Qonuniyatga urg'u (ovoz: "har guruhда bir xil — shuning uchun tez"). |
| | 4 | Xulosa (qoida) | Ovozli bir jumla + bitta yozma qator. Formal ta'rif yo'q. |
| **MASHQ** | 5 | Boshqariladigan mashq | Tap/drag, веди-до-верного, firstTry yashirin (2–3 scored). |
| | 6 | Qo'llash (masala) | Bitta hayotiy masala, boshqa qahramon bilan. |
| **УРОК-ТЕСТ** | 7 | Final test | scope='final' scored. |
| | 8 | Yakun (can-do) | "Endi siz … qila olasiz." Son ko'rsatilmaydi. ConnectionsBlock. |

**Amaliy dars** — alohida jsx-question(lar): o'sha mavzuning 1 mexanikasi, typingsiz,
ovozsiz, animatsiyali; host "Tekshirish" tugmasi, natija analitikaga (tag/level/blok).
Amaliy metodika = nazariy misconception'ni mustahkamlash; yangi kontsept KIRITMAYDI.

### 6.1. Vaqt-budjeti — kamida 15 minut, kamida 15 ekran (nazariy, metodist 2026-07-07)

Nazariy dars **kamida 15 minut**, **kamida 15 ekran** (faqat nazariy; amaliy alohida).
FREE_NAV=false bo'lgani uchun jami audio uzunligi vaqtning **pastki chegarasi** — har ekran
audiosi shu budjetга qarab yoziladi (jami audio ~10 min + interaksiya ~5 min ≈ 15–16 min).

| Faza | Ekran | Nishon vaqt |
|---|---|---|
| Hook + prerekvizit-recall | 2 | ~1.5 min |
| **Chuqur ochilish** (concrete manipulyatsiya, ≥3 tasvir/qadam) | 5 | **~6 min** |
| Qoida (hookга qaytadi) | 1 | ~1 min |
| Boshqariladigan mashq | 4 | ~4 min |
| Hayotiy masala | 2 | ~1.5 min |
| Final test + yakun | 2 | ~1.5 min |

Vaqtning eng katta ulushi **ochilishga** (~6 min, 5 ekran) — slayd sonini test bilan emas,
**chuqur tushuntirish/tasvir** bilan oshiramiz (chuqurlik > test). Takror drilling amaliyga
ko'chadi. Pilot darsdan keyin budjet sozlanishi mumkin (metodist).

### 6.2. "Mavzu yaxshi tushuntirilsin" — o'lchanadigan mezon (metodist 2026-07-07)

Chuqurlik > test-og'ir. `qa-validator` tekshiradigan band:
1. **Asosiy kontsept ≥2 faol ochilish ekrani oladi** — bola o'zi suradi/quradi/sanaydi
   (passiv "tomosha" — bir-tugmalik avto-reveal — TAQIQ; 1-sinf auditidagi
   kashfiyot→tomosha nuqsonidan qochish).
2. **Kamida 2 xil tasvir** bilan (masalan o'nlik: dasta-tayoqcha + razryad kartasi +
   son o'qi) — bir g'oyani ko'p ko'rinishда.
3. **Qoida hookга qaytadi** — ochilgan qonuniyat hookdagi maqsad/jumboqni yopadi (sikl).
4. Ovoz tushuntirishni **ko'taradi**, vizualni takrorlamaydi; qadam-baqadam, bir segment
   = bir fikr.
5. **Mavzu OCHIQ tushuntiriladi + aniq QOIDA beriladi (o'yin emas)** — o'quvchilar
   iltimosi (2026-07-13; "dars tushuntirilmayapti" past bahosi): (a) ochiq tushuntirish
   beati — Bit NIMA va NEGA ni ravshan aytadi (ovoz yetakchi), har ochilish "qiladi +
   tushuntiradi"; (b) ko'rinadigan QOIDA kartasi — sodda, rang-kodli, qonun sifatida,
   ovozda AYTILADI + ekranda YOZILADI (§1.6 bitta yozma tayanch); (c) qoida sikli:
   hook → ochilish → QOIDA ekrani → yakunda recap. Interaktiv/o'yin tushuntirishga
   XIZMAT qiladi, o'rnini bosmaydi.
6. **Tushuntirish O'ZI harakatlanadi (tugmasiz); kashfiyot AVVAL savol beradi** —
   (metodist 2026-07-13). Tushuntirish/ochilish slaydida vizual ovoz bilan **sinxron
   o'zi animatsiyalanadi** (razryad ustuni ovozga qarab yonadi, son o'qida marker
   o'zi sakraydi, 10→1 birlashuv o'zi yig'iladi) — **«Дальше»-stepper (bir-tugmalik
   qadam) TAQIQ** (§6.2.1 passiv avto-reveal bilan bir xil nuqson). Kashfiyot avval
   **SAVOL/TAXMIN** beradi (bola chiziqda bosib taxmin qiladi / bashorat), keyin ochadi;
   savol ovozi kirish-ko'prigисиз, to'g'ridan boshlanadi. Etalon: Dars01 s1 (birlashuv),
   s4 (razryad), s6 (son o'qi — savol-birinchi).

---

## 7. Mavzu bo'yicha metodik eslatmalar (blok-blok)

Har blok uchun: kontsept-avval yondashuv, misconception'lar, CRA, nimadan qochish.

### Б1 — 100 gacha nomerlash (d.1–7)
- Razryad avval: o'nlik-bloklari + birliklar → o'qish/yozish → taqqoslash → o'nlab
  sanash → son o'qi. `45 = 4 o'nlik + 5 birlik`.
- Misconception: pozitsiyasiz taqqoslash; `45`↔`54` chalkashligi; o'nlab sanashда adashish.
- CRA: o'nlik-bloklari (concrete) → razryad kartalari (pictorial) → yozuv. **Bar model YO'Q.**

### Б2 — 100 ичida qo'shish/ayirish, столбик (d.8–14)
- O'tishsiz → o'tishli → столбik → ikki amalli masala. Столбik avval bloklar bilan
  (§4). "O'nга yetsa — bitta o'nlik ko'chadi"; "birlik yetmasa — o'nlikdan qarz".
- Misconception: xonalarni aralashtirish; ko'chirish/qarzni unutish; ikki amalни
  rejalashtirmaslik.

### Б3 — Ko'paytirish jadvali (d.15–21)
- Ma'no avval: teng guruhlar / massiv → `a × b` = "a ta b talik" (darslik IV bob:
  "bir nechta teng qo'shiluvchilar yig'indisi"). O'rin almashish massivni burab.
- Jadvalni **tuzilishi bilan** o'rgatish (2 lab, 5 lab qulay yakor), quruq yodlash emas.
- Misconception: `3×5`↔`3+5`; teng bo'lmagan guruh; ×0 va ×1 chegara holatlari.

### Б4 — Bo'lish jadvali (d.22–28) — kritik tugun
- Ma'no avval: **teng ulashish** va **guruhlarga bo'lish** (darslik V bob: "teng
  guruhlarga bo'lish", son o'qida `16−2−2−…=0`). ×↔÷ oilasi asosiy strategiya.
- Misconception: bo'lish=ayirish; ×↔÷ bog'lanishini ko'rmaslik; teng bo'lmagan bo'lish.

### Б5 — Geometriya, uzunlik, perimetr (d.29–34)
- Van Hiele **0–1 daraja**: shaklni tanish + sodda xossa (tomon/burchak sanash).
  Perimetr = tomonlar **yig'indisi** (concrete: tomonlar bo'ylab birlik sanash → qo'shish).
- Misconception: perimetr↔yuza; o'lchashni 0 dan boshlamaslik; kesma↔to'g'ri chiziq.

### Б6 — Ifoda, tenglama, доли, vaqt, data (d.35–46)
- **Доли — kasr EMAS.** "Yarim, chorak, uchdan bir" = butunning **teng** bo'laklari
  (non/tort/qog'oz buklash). Teng bo'lmasa — доля emas.
- **Tenglama** — noma'lumni "yashirin son" sifatida topish (`x+4=9`: "nechta qo'shsak
  9?"), mexanik ko'chirish emas. Concrete: tarozi/qutича modeli.
- **Vaqt/pul/data** — o'qish va sodda hisob; typingsiz (tap/drag). Piktogrammada
  **1 rasm = 1 birlik** (masshtab yo'q).
- Misconception: доли teng emas; tenglama = "javobni yoz"; soatда minut/soat aralashi.

---

## 8. Baholash siyosati — 2-sinf

`teaching_methodology` §1.4 bo'yicha, 1-sinf bilan bir xil:
- **Веди-до-верного** har scored ekranда. "Davom" faqat to'g'ridan keyin.
- Ball **birinchi urinish** (`firstTry`) bo'yicha, LMS'ga, **o'quvchiga ko'rsatilmaydi**.
- Vizual natijani oshkor qilmaydi (winner-flag yo'q). Feedback — **rang + belgi** (✓/✗).
- Amaliy (jsx-question) — o'z `correct` verdikti + `onSubmit` natija (tag/level/blok);
  host retry/scoring boshqaradi. Nazariy dars scored ekranлари: 2–3 mashq + 1 final.

---

## 9. Typing yo'q — pedagogik sabab (2-sinf)

7–8 yosh yozishни o'rganmoqда, klaviatura yo'q. Javob **har doim bosish (tap) yoki
surish (drag)** orqali, ovoz yo'naltiradi. Raqam kiritish (`NumInput`, fill-in,
ColumnSolver-typing) — 2-sinfda ham **chiqariladi**; o'rnida bosiladigan raqam-plitalar,
tap-raqam paneli, yoki sonli MC. Столбик ham **tap-plita** bilan quriladi (raqamni
katakka bosib/surib qo'yadi), klaviaturasiz. Bu qoidadan chetlanish metodist
tasdig'ini talab qiladi (§5 CLAUDE.md). Batafsil savol turlari — `ETALON_2SINF.md`.

---

## 10. Qarorlar (metodist tasdig'i — 2026-07-07)

Boshqaruvchi manba: xlsx «2 класс» (39 dars) + rasmiy darslik. Ziddiyatда darslik/reja
ustun, `program_map_1_11` emas.

**10.1. Qamrov — 100 gacha + ko'paytirish/bo'lish jadvali. ✓** Darslik va xlsx
bo'yicha (§2).

**10.2. Ikki bo'lim — nazariy + amaliy alohida. ✓** Har mavzu = nazariy Stage-dars +
amaliy jsx-question. Site drill-down (nazariy/amaliy) bilan mos.

**10.3. Cast — 1-sinf davomi. ✓** Ra'no/Anvar/Zuhra/Jasur 2-sinfda; dunyo kengayadi.
Detallar — `SYUJET_2SINF.md`.

**10.4. Typing yo'q. ✓** Tap-first (столбik ham tap-plita). §9.

**10.5. Столбik — 2-sinfda kiritiladi, concrete-avval. ✓** Razryad bloklaridan keyin
tez yozuv sifatida (§4). Formal algoritm sehri EMAS.

**10.6. Bar model — hali yo'q (3-sinf). ✓** §4 chegarasi.

**10.7. Nazariy dars = kamida 15 minut, kamida 15 ekran. ✓** (metodist 2026-07-07 reviziya —
oldingi 12–13 o'rniga). Faqat nazariy (amaliy alohida). Slayd sonini test bilan emas, chuqur
ochilish bilan oshiramiz. Vaqt-budjeti §6.1; pilotdan keyin sozlanishi mumkin.

**10.8. Chuqurlik > test-og'ir. ✓** "Mavzu yaxshi tushuntirilsin" o'lchanadigan mezon
(§6.2): ≥2 faol ochilish, ≥2 tasvir, qoida hookга qaytadi. Drilling amaliyga ko'chadi.

**10.9. MOBIL_DESKTOP_MOSLASH — har darsga majburiy. ✓** 390px mobil zoom-qatlam +
avtoskroll (`MOBIL_DESKTOP_MOSLASH.md`, etalon Dars28) har Dars .jsx faylida bo'ladi.

---

## 11. UZ terminlar — 2-sinf draft glossariy

Darslikdan olingan / taklif. **Draft — o'zbek metodisti + `uz_locale` tasdig'igacha.**
1-sinf glossariysi (`1sinf_metodologiya.md` §11) davom etadi; quyida 2-sinf qo'shimchalari.

| RU / kontsept | UZ (draft) | Izoh |
|---|---|---|
| разряд / разрядный состав | xona / razryad tarkibi | 45 = 4 o'nlik 5 birlik |
| двузначное число | ikki xonali son | |
| в столбик | ustun (столбик) | xona ostiga xona |
| перенос (в столбик) | ko'chirish | o'nга yetsa |
| заём (в столбик) | qarz olish | birlik yetmasa |
| умножение | ko'paytirish | teng guruhlar yig'indisi |
| множитель | ko'paytuvchi | |
| произведение | ko'paytma | |
| таблица умножения | ko'paytirish jadvali | |
| деление | bo'lish | teng guruhlarga |
| делимое / делитель / частное | bo'linuvchi / bo'luvchi / bo'linma | |
| луч / прямая / отрезок | nur / to'g'ri chiziq / kesma | |
| многоугольник | ko'pburchak | |
| периметр | perimetr | tomonlar yig'indisi |
| сантиметр / дециметр / метр | santimetr / detsimetr / metr | sm / dm / m |
| выражение (числовое / буквенное) | ifoda (sonli / harfli) | |
| уравнение | tenglama | noma'lumni topish |
| доля / половина / четверть / треть | ulush (доля) / yarim / chorak / uchdan bir | butun bo'laklari, kasr EMAS |
| время / час / минута | vaqt / soat / minut | |
| данные / таблица / диаграмма | ma'lumot / jadval / diagramma | 1 rasm = 1 birlik |

> Asosiy darslik termini bilan ziddiyatда — darslik ustun. 5–6 sinf glossariysidagi
> `son o'qi` / `sonlar nuri` 2-sinfga olib o'tilmaydi (xotira: textbook-term-canon);
> 2-sinfda son o'qi — darslik shakli bilan (agar bo'lsa).

---

## 12. Bog'liq hujjatlar

- `ETALON_2SINF.md` — dizayn+kod kontrakti (nazariy+amaliy), grade1 dan deltalar, savol turlari.
- `SYUJET_2SINF.md` — 2-sinf hikoya bibliyasi (cast davomi, dars-uyalari).
- `DIZAYN_STANDART_1SINF.md` — dizayn arxitektura (o'zgarmaydi: Stage/palitra/keep-visible).
- `1sinf_metodologiya.md` — quyi bosqich; uzluksizlik va prerekvizit.
- xlsx «2 класс» (39 dars) + `src/books/grade2/Matematika 2 sinf UZ.pdf` (qamrov + termin).
- Notion: `teaching_methodology`, `methodology` (§1, §8), `audio_rules`, `uz_locale`,
  `screen_types`, `design_system`.
