# SYUJET BIBLIYASI — 2-sinf (umumiy hikoya kontrakti) · **v3 «Bitni uyiga kuzatish» (haqiqiy sayyoralar)**

> **Bu hujjat — yagona haqiqat manbai (single source of truth) butun 2-sinf syujeti
> bo'yicha.** Har dars shu yerdagi *kirish holati* va *chiqish holati* matnlaridan
> kelib chiqadi. Hech bir dars syujet o'tishini O'ZI O'YLAB TOPMAYDI — u shu hujjatdan
> ko'chiriladi. Aks holda hikoyalar bir-biriga zid keladi.
>
> Spec/dizayn: `ETALON_2SINF.md`. Metodika: `2sinf_metodologiya.md`. Mavzular:
> `DARSLAR_REJASI_1-11.md` («2 класс») + darslik `src/books/grade2/Matematika 2 sinf UZ.pdf`.
> Bu hujjat — faqat HIKOYA qatlami (matematikani belgilamaydi, unga sahna beradi).
>
> **v2 (metodist, 2026-07-13):** butun kurs qobig'i **«Bit uyga qaytadi»** yo'l-sarguzashti.
> v1 (aralash mahalla-dunyo + Zona A yulduz porti) shu bilan almashtirildi; o'zak
> matematik metafora (GURUH) va cast saqlandi.

---

## 1. O'ZAK G'OYA — «BITNI UYIGA KUZATISH» (Quyosh sistemasi bo'ylab, v3)

Bit va do'stlari — **Ra'no, Anvar, Zuhra, Jasur** — **Yer'dan uchib chiqishdi**: ular
Bitni uyiga — **qo'shni yulduz sistemasidagi** uyiga — kuzatib bormoqda. Yo'l Quyosh
sistemasi bo'ylab **tashqariga** ketadi: kema har blokda bir **haqiqiy sayyoraga** yetadi
(Mars → Yupiter → Saturn → Uran → Neptun), oldinga uchish uchun o'sha yerdagi **to'siqni
yechish** kerak — to'siq aynan o'sha bloknиng matematik ko'nikmasi bilan yechiladi. Oxirida,
Neptundan keyin, ekipaj **qo'shni sistemaga — Bit uyiga** yetadi. Dars01'da ekipaj Yer'dan
endi uchib, **ochiq koinotda** yoqilg'isiz to'xtab qolgan (birinchi sayyorага yetishdan oldin).

**Har sayyora — HAQIQIY Quyosh sistemasi sayyorasi + animatsion tanishtiruv.** Kema
sayyorага yetganда qisqa **animatsiyали tanishtiruv** beriladi: sayyoraning haqiqiy
ko'rinishi (Saturn halqasi, Yupiter katta dog'i, qizil Mars, ko'k Neptun) + bitta bolabop
**fakt** (TTS-toza, FactCard uslubида). Matematik yo'lga haqiqiy **astronomiya** qo'shadi
(fanlararo bog', ota-onaга ham qiziqarli).

**O'zak matematik metafora — GURUH (saqlanadi).** Ko'paytirish/bo'lish = teng guruhlar;
kosmik dunyo buni ko'taradi (yoqilg'i o'ntalab, hosil qatorlar, o'lja teng ulush).

**Yopiq sikl (har dars).** Sayyorага yetish/muammo = ko'rinadigan to'siq. Yakun = to'siq
yechilib, kema uchadi, ekipaj **Bit uyiga bir qadam yaqin**. Matematika — uchishning
haqiqiy vositasi, bezak emas.

**Bit — sayohatchi + diktor birga.** Bit ekipaj bilan ekranда ko'rinadi (qahramon) VA ovoz
uning/ekipajning yo'lini yuritadi (**ayol ovoz** canon, `ETALON_2SINF §2.3`). Har darsni
o'tganга ulaydi ("O'tgan sayyorада …").

> **CANON CHETLANISHI (ongли, yozib qo'yilgan):** `2sinf_metodologiya.md §3.10` "Bit —
> faqat diktor, ism/yuz/avatar do'st-personajga aylanmaydi" degan edi. v2 da Bit
> **sayohatchi-qahramon HAM** bo'ladi. Bu — metodist qarori (2026-07-13); metodika §3.10
> shunга moslab yangilanadi (knowledge-updater). Bit hali ham platforma ovozi/mentori.

**O'zgarmas qoidalar (canon):**
- Ra'no — ekipaj/syujet yetakchisi; Anvar/Zuhra/Jasur — hamrohlar; Bit — kapitan-diktor.
- Ismlar — o'zbekcha. Register: RU `ты`, UZ `siz`. Ton yumshoq, do'stona
  (o'lim/qo'rquv/raqobat-yutqazish yo'q; "adashib qolish" emas — "uyга yo'l").
- Rekvizit — mahalliy ildizли, kosmik kontekstда: non/patir (kema oshxonasi), choy,
  olma/uzum (zaxira), tanga, daftar/kitob (bort jurnali). G'arbona rekvizit yo'q.

---

## 2. PERSONAJLAR

| Personaj | Roli (v2) | Holat | SVG | Kiyim (v2) |
|---|---|---|---|---|
| **Bit** | **Kapitan + diktor** (ayol ovoz), sayohatchi | 1-sinfдан davom | `BitSVG` | kosmik kapitan (kaska/nishon) |
| **Ra'no** | Ekipaj yetakchisi | 1-sinfдан davom | `RanoSVG` | sayohat kombinezoni |
| **Anvar** | Hamroh | 1-sinfдан davom | `AnvarSVG` | sayohat kombinezoni |
| **Zuhra** | Hamroh | 1-sinfдан davom | `ZuhraSVG` | sayohat kombinezoni |
| **Jasur** | Hamroh | 1-sinfдан davom | `JasurSVG` | sayohat kombinezoni |

**Kiyim (v2 delta).** Mavjud SVG'lar **qayta ishlatiladi**; ustiga **sayohat/skafandr
kostyum qatlami** qo'shiladi (kombinezon, kaska/vizor, nishon) — o'sha personaj, yangi
libos. Yuz/soch/rang belgilari o'zgarmaydi (tanilsin). Kostyum — alohida SVG qatlam,
`jsx-builder` bosqichида.

**Yangi doimiy personaj — faqat metodist qaroriga ko'ra** (ETALON §0). O'zboshimchalik
bilan qo'shilmaydi. Sayyora "aholisi" bo'lsa — **one-off** (bir martalik, o'zbek ismli:
Madina, Bekzod, Kamola, Sardor, Dilnoza, Otabek…), doimiy castга kirmaydi.

---

## 3. YO'L — HAQIQIY SAYYORALAR (Yer'dan tashqariga · blok Б1–Б6) → Bit uyi (qo'shni sistema)

Ekipaj Yer'dan uchib, Quyosh sistemasi bo'ylab **tashqariga** uchadi. Har blok = yo'lning
bir bosqichi: Б1 **ochiq koinot** (Yer'dan uchish), keyin **haqiqiy sayyoralar** — Mars →
Yupiter → Saturn → Uran → Neptun; oxirida **qo'shni sistema (Bit uyi)**. Har blokda to'siq
o'sha blok matematikasi bilan yechiladi.

**Har sayyoraga yetganда — animatsion tanishtiruv + fakt** (sayyoraning haqiqiy ko'rinishi +
bitta bolabop TTS-toza fakt, FactCard uslubида). Quyida har dars uchun: **joy** (sahna),
**kirish holati** (muammo/to'siq), **chiqish holati** (to'siq yechildi → uchish, Bit uyiga yaqin).

### 🚀 Б1 — «OCHIQ KOINOT» · Yer'dan uchish · 100 gacha nomerlash (d.1–7)

Ekipaj Yer'dan endi uchdi va **ochiq koinotда** quvvatsiz to'xtab qoldi (birinchi sayyorага —
Marsга — yetishдан oldin). Dvigatel quvvatni **faqat o'ntadan (kassetada)** oladi. Rekvizit:
batareya (birlik), **kasseta = 10 batareya** (o'nlik), neon-displey, kod-eshik paneli,
quvvat hisoblagichi, illyuminatordan ochiq koinot + uzoqdagi Yer.
(Metafora: kema **elektr/ion** kema — batareya-kassetalar = **quvvat**; «yoqilg'i/tank/yonish» ishlatilmaydi, chunki raketa suyuq yoqilg'ida uchadi, batareyada emas.)

| № | Mavzu | Joy | Kirish holati | Chiqish holati |
|---|---|---|---|---|
| 1 | O'nliklar va birliklar | kema ichi (ochiq koinot) | **[ETALON]** Ekipaj Yer'dan uchdi, kema ochiq koinotда quvvatsiz to'xtadi; batareyalar tarqalgan, dvigatel faqat o'ntadan oladi — tez yig'ish yo'li? | 10 batareya = 1 kasseta; har son = o'nlik + birlik; quvvat ortildi, kema uchdi — **Bit uyiga bir qadam yaqin** |
| 2 | Ikki xonali sonni o'qish/yozish | boshqaruv paneli | Bort kodlarини o'qish/yozish (displeyда sonlar) | Ikki xonali kodlar o'qildi va yozildi |
| 3 | Razryad tarkibi | quvvat ombori | Kodni xonaларга ajratish (`45 = 40 + 5`) | Razryad tarkibi ochildi |
| 4 | Sonlarни taqqoslash | ikki blok | Qaysi blokда quvvat ko'p? Ikki sonni taqqoslash | Katta/kichik/teng (`> < =`) ikki xonали sonда |
| 5 | O'nlab sanash | orbita hisoblagichi | 10 lab oldinga-orqаga sanash (quvvat shkalasi) | O'nlab sanash mahkamlandi |
| 6 | Son o'qi | uchish trassasi | Sonни trassa-shkалага qo'yish, oraliqни topish | Son o'qidа o'rin topildi |
| 7 | Takrorlash + ПК1 | port markazi | Sayyora 1 yakuni — katta quvvat-tekshiruvi | Nomerlash puxtalandi; keyingi sayyoraга yo'l ochiq |

### 🔴 Б2 — MARS · qizil sayyora, yuk bazasi · 100 ичida amallar, столбik (d.8–14)
> *Fakt (namuna): Marsда Quyosh sistemasidagi eng baland tog' — Olimp bor. Rangi qizil, chunki temir-zang.*

Konteyner-yuklar bilan hisob-kitob. Xonama-xona qo'shish/ayirish; столбik = konteyner
raflari (xona ostiga xona).

| № | Mavzu | Joy | Kirish holati | Chiqish holati |
|---|---|---|---|---|
| 8 | Qo'shish (o'tishsiz) | yuk rafi | O'nlik+o'nlik, birlik+birlik — xonama-xona | O'tishsiz qo'shish ochildi |
| 9 | Ayirish (o'tishsiz) | yuk rafi | Xonама-xona ayirish | O'tishsiz ayirish ochildi |
| 10 | Qo'shish (o'tishli) | saralash tasmasi | Birlik o'nга yetsa — o'nlik ko'chadi | O'tishли qo'shish ochildi |
| 11 | Ayirish (o'tishли) | saralash tasmasi | Birlik yetmasa — o'nlikдан qarz | O'tishли ayirish ochildi |
| 12 | Столбik | hisob terminali | Amalни tez yozish — xona ostига xona | Столбик yozuvi ochildi |
| 13 | Ikki amалли masala | stansiya | Ketма-ket ikki amal | Ikki qadamли masala yechildi |
| 14 | Takrorlash + ПК2 | stansiya | Sayyora 2 yakuni | 100 ичида amallar puxtalandi |

### 🟠 Б3 — YUPITER · eng katta, ko'p yo'ldoshli · Ko'paytirish, teng guruhlar (d.15–21)
> *Fakt (namuna): Yupiter — eng katta sayyora; unда asrlar davom etayotgan ulkan bo'ron — Katta Qizil Dog' bor.*

> **⚠️ ILMIY TUZATISH (metodist 2026-07-15): Yupiter — GAZ sayyorasi. Unда qattiq sirt YO'Q,
> hosil O'SMAYDI, kema QO'NA OLMAYDI.** Shuning uchun ekipaj Yupiter **ORBITASIDA** uchadi va hosil
> **KEMA ICHIDAGI ISSIQXONADA** (teng qator-planterlarда) o'stiradi; Yupiter **panorama oynadan**
> ko'rinadi. Quyidagi jadvalда «dala/ombor» = **kema issiqxonasi/bort-omborи** (Yupiter sirti EMAS).
> Dars13 shunга ko'ra qurildi (`ShipGreenhouse`); Dars14+ ham shu ramkаda.

Hosil **teng qator/guruhlarда** (kema issiqxonasi planterlarида) o'sadi — bittalab sanash uzoq.
Massiv (satr×ustun) leytmotivi.

| № | Mavzu | Joy | Kirish holati | Chiqish holати |
|---|---|---|---|---|
| 15 | Ko'paytirish ma'nosi | kema issiqxonasi (orbita) | 3 qатorда 5 tadan ko'chat — jami? `5+5+5` → `3 marta 5` | Ko'paytirish = teng guruhlar yig'indisi |
| 16 | ×2 va ×3 | kema issiqxonasi | 2 lik va 3 lik guruhlar | ×2, ×3 jadvali ochildi |
| 17 | ×4 va ×5 | kema issiqxonasi | 4 lik va 5 lik guruhlar | ×4, ×5 ochildi |
| 18 | ×6 va ×7 | kema issiqxonasi | 6 lik va 7 lik guruhlar | ×6, ×7 ochildi |
| 19 | ×8 va ×9 | kema issiqxonasi | 8 lik va 9 lik guruhlar | ×8, ×9 ochildi |
| 20 | Mustahkamlash | bort-ombori | Jadvalни qo'llash, o'rin almashish (`3×5=5×3`) | Ko'paytirish jadvali mahkamlandi |
| 21 | Takrorlash + ПК3 | kema issiqxonasi | Sayyora 3 yakuni | Jadval puxtalandi |

### 🪐 Б4 — SATURN · halqali sayyora, halqalarni teng ulash · Bo'lish (d.22–28)
> *Fakt (namuna): Saturn halqalari muz va tosh bo'laklaridan; ular teng qismlarга bo'linadi.*

Topilgan kristall-o'ljani **ekipajга teng ulashish** kerak. ×↔÷ oilasi asosiy strategiya.

| № | Mavzu | Joy | Kirish holati | Chiqish holати |
|---|---|---|---|---|
| 22 | Bo'lish ma'nosi | kon og'zи | 12 kristalни 3 hamrohга teng — har biriга nechta? | Bo'lish = teng ulashish/guruhlash |
| 23 | × va ÷ bog'lanishи | saralash | `3×4=12` → `12÷3=4, 12÷4=3` oila | ×↔÷ oilasi ochildi |
| 24 | ÷2 va ÷3 | kon | 2 ga, 3 ga bo'lish | ÷2, ÷3 ochildi |
| 25 | ÷4 va ÷5 | kon | 4 ga, 5 ga bo'lish | ÷4, ÷5 ochildi |
| 26 | ÷6–9 | kon | 6–9 ga bo'lish | ÷6–9 ochildi |
| 27 | Masalalar | lager | Bo'lishга hayotiy masalalar | Bo'lish masalалари yechildi |
| 28 | Takrorlash + ПК4 | lager | Sayyora 4 yakuni | Bo'lish puxtalandi |

### 🔵 Б5 — URAN · yonboshlab aylanuvchi, stansiya qurish · Geometriya, perimetr (d.29–34)
> *Fakt (namuna): Uran boshqa sayyoralar kabi tik emas — yonboshlab, dumalab aylanadi.*

Uchish uchun modul/panjара qurish va o'lchash kerak.

| № | Mavzu | Joy | Kirish holати | Chiqish holати |
|---|---|---|---|---|
| 29 | Nur, to'g'ri chiziq, kesma | maydon | Chiziq turlarини farqlash | Nur/to'g'ri chiziq/kesma ajratildi |
| 30 | Ko'pburchaklar | maydon | Tomon/burchak sanash | Ko'pburchaklar tanildi |
| 31 | sm, dm, m | ustaxona | Uzunlik birliklari, o'lchash | sm/dm/m bilan o'lchandi |
| 32 | Perimetr | panjara | Tomonlar bo'ylab sanаб qo'shish | Perimetr = tomonlar yig'indisi |
| 33 | Yasash (qurish) | maketa | Berilган o'lchамда shakl yasash | Shakl yasaldi |
| 34 | Takrorlash + ПК5 | ustaxona | Sayyora 5 yakuni | Geometriya puxtalandi |

### 🔵 Б6 — NEPTUN → qo'shni sistema (Bit uyi) · ifoda, tenglama, доли, vaqt, data (d.35–46)
> *Fakt (namuna): Neptun — eng uzoq sayyora, muzdek va shamolli; undan keyin ekipaj qo'shni yulduz sistemasiga — Bit uyiga yetadi.*

Uy ko'rindi — Yer orbitasidаги stansiya. Kodlar, taqsimlash, vaqt, ma'lumot; oxirida
**Yer'ga qo'nish**.

| № | Mavzu | Joy | Kirish holати | Chiqish holати |
|---|---|---|---|---|
| 35 | Sonли va harfли ifodalar | stansiya | `a + 5` — harf o'rniga son | Ifoda tushunildi |
| 36 | Tenglamalar | shlyuz-kod | `x + 4 = 9` — yashirин sonни topish | Sodda tenglama yechildi |
| 37 | Доли: yarim, chorak, uchdан bir | oshxona | Ratsionни teng bo'laklarга bo'lish | Butun bo'laklari (доли) tushunildi |
| 38 | Soat, minut | bort soati | Vaqtни o'qish | Soat/minut o'qildi |
| 39 | Kalendar | bort jurnali | Kun/hafta/oy | Kalendar o'qildi |
| 40 | Pul | almashuv | Tanga/pul bilan hisob | Pul hisobi qilindi |
| 41 | Kattaликларга masala | stansiya | Vaqt/pul/uzunликка masala | Kattalik masalалари yechildi |
| 42 | Mantiq | stansiya | Mantiqий topshiriq | Mantiqий fikrlash mashqи |
| 43 | Ma'lumotlar bilan ishlash | panel | Jadval/piktogramма o'qish (1 rasm = 1 birlik) | Ma'lumot o'qildi/taqqoslandi |
| 44 | Takrorlash | stansiya | Sayyora 6 takrori | Yil materiали jamlandi |
| 45 | Takrorlash + ПК6 | stansiya | Sayyora 6 yakuni | Kurs puxtalandi |
| 46 | Yakuniy nazorat (ИК) | **Yer'ga qo'nish** | Butun kurs — uyга qaytish tekshiruvи | **Uyга yetdi!** Yil yakunlandi |

---

## 4. TAKRORLANUVCHI ELEMENTLAR (canon davomiyligi)

- **Yo'l xaritasi (progress).** Har darsda ekipaj **Bit uyiga** (qo'shni sistemaga)
  yaqinlashaётган mini-xarita: Yer → Mars → Yupiter → Saturn → Uran → Neptun → Bit uyi;
  joriy dars — qaysi bosqichда ekanini ko'rsatadi. `ETALON_2SINF §2.4`
  progress elementinинг tematik ko'rinishi (hozirgi "Tayyorlik shkalasi" o'rnida).
  *(Darslararo saqlanish — platforma progress'иga bog'liq, alohida aniqlanadi; dars-ичи
  versiyasi majburiy.)*
- **Bit ulamasi:** har `sIntro` "O'tган sayyorада …" bir jumла bilan boshlanadi
  (qayta tanishtirish YO'Q — ekipaj tanish).
- **Olmали savat (`BasketArt`)** — 1-sinfдан do'stona belgи; bayram/yakun zonalarида
  (kema oshxonаси/zaxира sifatида).
- **Guruh motivi:** ×÷ sayyoralarида (3/4) teng guruhлар vizual leytmotiv
  (qatorlar/ulushлар).
- **Ekipaj kadrи:** hook va yakunда do'stlar (yangi kiyimда) yonда; masala (case) —
  ekipajдан bir hamroh bilan (`2sinf_metodologiya §6` "boshqa qahramon bilan").

---

## 5. HIKOYA ↔ TUSHUNTIRISH MUVOZANATI (v2 eslatma)

Kosmik sarguzasht — **ramка**, dars mazmuni EMAS. `[[grade2-explain-not-game]]` talabi:
har dars mavzuни ochiq tushuntiradi + ko'rinadиган QOIDA kartаси beradi; syujet uni
almashtirmaydi. Sayyora "to'sig'i" = matematik konsept; uni yechish = konseptни
**tushunish** (o'yin — tushuntirishга xizmat qiladi). Batafsil — `2sinf_metodologiya §6.2`.

---

## 6. YANGILANISH TARTIBI

Bu hujjat o'zgarsa (yangi personaj, biom matnи, dars syujeti) — o'zgarish shu faylга
kiritiladi, git orqали sinxronlanadi, KEYIN ishlanadi. Yaratish paytида hujjat statik.
Syujet o'zagи o'zgarishi — alohida, ongли qaror (navbatдаги darsning yon ta'siri
sifatида emas). Zona chegараларида kirish/chiqish holати AYNAN shu jadvalдан olinadi.

*v2 → v3 o'zgarishi (2026-07-13): Yer'dan uchib Bitni **qo'shni sistemadagi uyiga** kuzatish;
tashqariga Quyosh sistemasi bo'ylab **HAQIQIY sayyoralar** (Mars→Yupiter→Saturn→Uran→Neptun),
har sayyoraga **animatsion tanishtiruv + fakt**; Dars01 = Yer'dan uchib ochiq koinotда to'xtash.
v1 → v2 (2026-07-13): aralash mahalla-dunyo → «Bit uyga qaytadi» 6 sayyora-yo'l;
Bit sayohatchi+diktor; cast birга sayohat (yangi kiyim). O'zak GURUH metaforası va cast
saqlandi.*
