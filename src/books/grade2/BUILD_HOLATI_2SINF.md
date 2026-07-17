# 2-SINF — BUILD HOLATI VA HANDOFF (boshqa kompyuterga / yangi sessiyaga o'tish uchun)

> **Maqsad:** ishni boshqa mashina yoki yangi sessiyada davom ettirish. Bu fayl git orqali ko'chadi.
> Lokal xotira (`C:\Users\...\.claude\...\MEMORY.md`) YANGI mashinaga o'tmaydi — shuning uchun butun
> kontekst shu yerda jamlangan. Yangilash: har dars tugagach shu faylni ham yangilab bor.
>
> Oxirgi yangilanish: **2026-07-17** — **Dars37 QURILDI (Б6 «Pul», UNCOMMITTED)** + Dars36 (kalendar) + Dars35 (vaqt) +
> Dars34 (ulush) + Dars33 (tenglama) + Dars32 + Dars31 + Dars26–30 registr→siz. Б5 URAN = Dars26–31; **Б6 NEPTUN: Dars32–37**.
> Keyingi: **Dars38 = Б6 d.41 «Kattaликларга masala» (vaqt/pul/uzunlik)** (SYUJET §Б6) — mexanika metodist bilan kelishiladi.
> Dars27–37 prokliklanmagan. **Roadmap (ReadinessMeter) barcha darsda blokiga MOS** (tekshirildi 2026-07-17).
> **AUDIT-FIX (2026-07-17):** Dars34–37 s0 hook'i biom-sahna+Bit ni yo'qotgan edi (faqat mavzu-shakl) → `NeptunBase`+`SaturnCrew`
> qaytarildi (mavzu-vizual sahna ichida oq display-panel sifatida). Endi barcha Dars32–37 hook = Neptun sahnasi + Bit (etalon izchilligi).

---

## 0. TEZKOR HOLAT

**2-sinf NAZARIY darslar (`src/lessons/grade2.js` → `grade2Nazariy`):**

| # | Fayl | Mavzu | Blok | Holat |
|---|---|---|---|---|
| 01–06 | Dars01–06 | O'nlik/birlik … son o'qi | Б1 | ✅ (Dars01 = etalon) |
| 07–12 | Dars07–12 | Amallar + столбик + ikki-amalli | Б2 Mars | ⚠️ build green, prokliklab-test kutmoqda |
| 13 | Dars13 | Ko'paytirish ma'nosi | Б3 Yupiter | ✅ PUSHED, prokliklandi |
| 14 | Dars14 | ×2 va ×3 jadvali | Б3 | ✅ PUSHED (2e5e14a) |
| 15 | Dars15 | ×4 va ×5 jadvali | Б3 | ✅ PUSHED (f9ea5f4) |
| 16 | Dars16 | ×6 va ×7 jadvali | Б3 | ✅ PUSHED (86aaeca) |
| 17 | Dars17 | ×8 va ×9 jadvali | Б3 | ✅ PUSHED (50ca053) |
| 18 | Dars18 | Mustahkamlash + o'rin almashish | Б3 **YAKUN** | ✅ PUSHED (c22ea8f) |
| 19 | Dars19 | Bo'lish ma'nosi | Б4 SATURN **boshi** | ✅ PUSHED, prokliklandi (metodist syujet+personaj iterativ tuzatdi) |
| 20 | Dars20 | × va ÷ bog'lanishi (oila) | Б4 SATURN | ✅ PUSHED, prokliklandi (moslash→drag+lyuk metodist iteratsiyasi) |
| 21 | Dars21 | 2 ga va 3 ga bo'lish (÷2/÷3) | Б4 SATURN | ✅ PUSHED, prokliklandi (son o'qi animatsiya sekinlashtirildi) |
| 22 | Dars22 | 4 ga va 5 ga bo'lish (÷4/÷5) | Б4 SATURN | ✅ PUSHED, prokliklanmagan |
| 23 | Dars23 | 6,7,8,9 ga bo'lish (÷6–9) | Б4 SATURN | ✅ PUSHED, prokliklanmagan |
| 24 | Dars24 | Bo'lishga masalalar | Б4 SATURN | ✅ PUSHED, prokliklanmagan |
| 25 | Dars25 | Mustahkamlash · **takroriy ayirish** | Б4 SATURN **YAKUN** | ✅ PUSHED, prokliklanmagan (RepeatSub viz + tenglama; Anvar+Zuhra) |
| 26 | Dars26 | Nur, to'g'ri chiziq, kesma | Б5 **URAN boshi** | ✅ PUSHED, metodist prokliklab iteratsiya qildi (LineFig 3D + hayotiy langar: ufq/fonar/qalam) |
| 27 | Dars27 | Ko'pburchaklar | Б5 URAN | ✅ PUSHED, prokliklanmagan (PolyFig 3D + PolyTypeStage nom/tomon-sanash/ispoly + PolyMatchStage DRAG shakl→nom) |
| 28 | Dars28 | Uzunlik: sm, dm, m | Б5 URAN ustaxona | ✅ PUSHED, prokliklanmagan (Ruler chizg'ich + LenStage ruler/unit/convert; 1 dm=10 sm, 1 m=100 sm) |
| 29 | Dars29 | Perimetr | Б5 URAN panjara | ✅ PUSHED, prokliklanmagan (GeoFig geoboard birlik-sanash + SumFig tomonlar-yig'indisi; **yuza YO'Q**; figuralar TEKIS) |
| 30 | Dars30 | Shakl yasash | Б5 URAN maketa | ✅ PUSHED, prokliklanmagan (RectBuildStage eni/bo'yi stepper+Tekshir + PickStage o'lchamga-mos tanlash; GeoFig filled) |
| 31 | Dars31 | Takrorlash · butun geometriya | Б5 URAN **YAKUN** | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (YANGI ChainStage zanjir + meros mexanikalar aralash) |
| 32 | Dars32 | Sonli va harfli ifodalar | Б6 **NEPTUN boshi** | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (YANGI OYNA/SlotExpr + EvalStage/ClassifyStage/PickExprStage; YANGI Neptun biom) |
| 33 | Dars33 | Tenglamalar (noma'lumni topish) | Б6 NEPTUN | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (GIBRID: YANGI BalanceScale tarozi + SlotEq yashirin oyna + EqStage engine → BalanceStage/SlotFindStage/SubstStage; `x+4=9`) |
| 34 | Dars34 | Ulush (доли: butunning qismi) | Б6 NEPTUN | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (BO'LAK-BO'YASH: YANGI ShareFig doira/lenta/to'rtburchak + FracMCStage/PickShapeStage/EqualCheckStage; birlik ulush bir Ndan) |
| 35 | Dars35 | Vaqt (soat va daqiqa) | Б6 NEPTUN | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (ARALASH: YANGI ClockFace + ReadClockStage/MatchToClockStage; butun/yarim/chorak/5-daq; analog↔raqamli) |
| 36 | Dars36 | Kalendar (kun, hafta, oy) | Б6 NEPTUN | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (ARALASH: YANGI WeekStrip/CalendarFig + CalMCStage→WeekDay/CalendarRead/MonthStage; hafta 7 kun, oy 12; sana↔kun) |
| 37 | Dars37 | Pul (tanga bilan hisob) | Б6 NEPTUN | ⚠️ **UNCOMMITTED**, build-green, prokliklanmagan (ARALASH: YANGI CoinFig/CoinSet + MoneyMCStage/GatherStage; real UZ 100/200/500/1000 so'm; dona≠qiymat) |

**Б3 TO'LIQ = Dars13–18. Dars19–24 (bo'lish: ma'no + ×↔÷ + ÷2/3 + ÷4/5 + ÷6–9 + masalalar) qurildi** (program d.22–27),
build-green, UNCOMMITTED. **Metodist qarori (2026-07-16): Б4 ga +1 kontent dars — Dars25 «takroriy ayirish»** (program d.28
slotи, ПК4 emas), BOSHQA CHATDA quriladi (spec §6). Keyingisi: **Dars25 = Б4 takroriy ayirish**, keyin **Dars26 = Б5 geometriya boshi**
(chiziq/kesma/nur, program d.29). Fayl↔program ofseti: fayl DarsN = program d.(N+3) Б4 ичida.

**Repo:** `theIneuron/MatematikaLesson`, `main` branch. Barcha Dars13–18 push qilingan. Preview:
`matematika-lesson.vercel.app` → 2-sinf → tegishli dars. Har dars `FREE_NAV=true` (preview; push oldidan
`false` qilinishi kerak, ~57-satr `const FREE_NAV = true;`).

### 0.0. ⚠️ COMMIT QAMROVI — 2026-07-17 sessiya (yangi sessiya BUNI O'QISIN)
Oxirgi commit: `15d8fff` (Dars19–30). Undan keyin ikki sessiya ishi working-tree'da aralash yotibdi.
**BU SESSIYA (2026-07-17) qilgan ish — commit qilinsa MANA SHU fayllar birga:**
- `src/components/grade2/Dars26.jsx … Dars30.jsx` — UZ registr `siz` ga (135 qator).
- `src/components/grade2/Dars31.jsx` (YANGI, Б5 yakuni), `src/components/grade2/Dars32.jsx` (YANGI, Б6 boshi),
  `Dars33` (tenglama), `Dars34` (ulush), `Dars35` (vaqt), `Dars36` (kalendar), `src/components/grade2/Dars37.jsx` (YANGI, pul).
- `src/lessons/grade2.js` (Dars31…Dars37 ro'yxatga qo'shildi).
- `src/books/grade2/BUILD_HOLATI_2SINF.md` (shu fayl), `Dars31/33/34/35/36_CONTENT.md`, `Dars37_CONTENT.md` (YANGI).

**BU SESSIYA TEGMAGAN — parallel/oldingi ish, `git add` QILMA:**
`Dars07–Dars18.jsx` (parallel sessiya), `src/lessons/index.js`, `src/books/grade2/SYUJET_2SINF.md`,
`src/books/grade3/*`, `src/components/grade3/*`, `src/lessons/grade3.js`, `._audio.mjs`, `.claude/settings.json`.
→ Commit qilsang: `git add` ni **faqat yuqoridagi «BU SESSIYA» ro'yxati bilan** aniq nomla, `git add .` ISHLATMA.
Prokliklab-test tugagach, `FREE_NAV=true → false` (Dars31 ~59-satr, Dars32 ~59-satr) va push.

### 0.1. ⚠️ PARALLEL SESSIYA — hook/xulosa sahnalari (UNCOMMITTED)
Boshqa Claude sessiyasi **Dars14/15/16 ning s0(hook)/s15(xulosa) sahnalarini XILMA-XIL** qildi (takror
issiqxona-planter o'rniga): **D14 = Yupiter yo'ldoshlari** (MoonBall/ShipMoonDeck), **D15 = quyosh panellari**
(SolarPanel/ShipSolarBay), **D16 = probirka/laboratoriya** (TestTube/ShipLab). Yupiter illyuminator + R×C
ma'no + × qoida saqlanadi; FAQAT s0/s15 o'zgardi (o'rta slaydlar hali o'simlik-massiv).
**Bu o'zgarishlar working-tree'да COMMIT QILINMAGAN** (`git status` → `M Dars14/15/16`).
- **QOIDA:** Dars18/keyingi darslarni commit qilganda **FAQAT o'z faylingni + grade2.js ni `git add` qil**,
  Dars14/15/16 ni HECH QACHON `git add .` bilan tortma — parallel sessiya ishini clobber qilasan.
- **Metodist tamoyili:** hook/xulosa sahnalari xilma-xil bo'lsin (Dars17+ ham). **Dars17 va Dars18 hali
  ShipGreenhouse (o'simlik)** — metodist ularga ham alohida sahna (masalan Dars18 = «ombor/quti») so'rashi mumkin.

### 0.2. Har darsda ochiq ish (push oldidan / QA)
- `FREE_NAV = true` → `false` ga qaytarish.
- **Prokliklab-test** (ovoz + interaktiv + mobil 390px).
- UZ atamalari **draft** — o'zbek metodist-matematik validatsiyasi kerak.
- Kirill-slip faqat KOMMENTLARDA qolgan (klon merosi, neytral — render'ga chiqmaydi).

---

## 1. Б3 MEXANIKASI — KO'PAYTIRISH JADVALI (Dars13–18)

**Yadro model (metodist tanlagan):** teng qatorlar massivi → skip-sanash → ko'paytma. Tushuntirish =
abstrakt geo-nuqta (`variant:'geo'`), yakuniy test/masala = haqiqiy o'simlik (`variant:'plant'`, CropSprout).

**Asosiy komponentlar (Dars13da yaratilgan, Dars14–18 meros):**
- **`ArrayViz` ({r,c,reveal,variant})** — massiv; reveal 0-3: massiv → qator-struktura → takroriy qo'shish
  (C+C+…) → R×C+jami. `arrayOpts` distraktor = R+C (qo'shish-misconception).
- **`ArrayStage`** — bitta MC «jami nechta?», `rounds:[{r,c}]` yoki top-level `{r,c}`; `variant`, `fact`.
- **`TableFillStage` + `TableRow`** (Dars14 YANGI) — skip-sanash qatori (`by` ga: by,2·by,3·by…), bitta
  katak bo'sh (`blank` 1-indeks), MC bilan to'ldiriladi. `tableFillOpts` distraktor = qo'shni katak (±by, ±1).
- **`MultTable` ({max,hr,hc,hres})** — Pifagor jadval-yordamchisi. Har test slaydida `.btn-ghost` toggle
  bilan ochiladi (o'quvchi jadvalni hali yod bilmaydi). **max jadval darsiga qarab:** Dars14/15 = 6,
  Dars16 = 7, Dars17/18 = **9** (to'liq).
- **`ScreenTable`/sTBL** — jadval qurish/ko'rsatish ekrani. Dars14–17: `TableRow` bilan bitta jadval
  qatorini bosqichli quradi. Dars18: TO'LIQ `MultTable max=9` + simmetriya info.
- **`CommuteViz` + `CommuteStage`** (Dars18 YANGI, kommutativlik) — pastda §2.

**Sahna (Б3 biom):** `ShipGreenhouse` (kema issiqxonasi, Yupiter ORBITASIDA — panorama-oynada Yupiter,
shiftdan osilgan grow-light, teng-qator planter), `YupiterScene`(s0 hook), `YupiterField`(s15 xulosa),
`YupiterPlanet`. **⚠️ ILMIY CANON: Yupiter gaz sayyorasi — QO'NISH YO'Q, hosil kema ichida o'sadi.**
Kosmik rekvizit fizikasi: raketa suyuqlikda uchadi (yoqilg'i/tokda emas) → [[grade2-quvvat-not-yoqilgi]].

**Dars13–18 sonlari (natija chegarasi):** D14 ≤18 (×2/×3), D15 ≤30 (×4/×5), D16 ≤42 (×6/×7),
D17 ≤54 (×8/×9). ×8/×9 da array-nuqta zich bo'lmasin uchun **qator soni r≤4** bilan cheklangan.
**Nishonlar:** ×5 oxiri 0/5; ×9 raqamlar yig'indisi 9 (enrichment); ×7 «roppa-rosa 7 qo'sh, diqqat bilan».

---

## 2. Dars18 — MUSTAHKAMLASH + O'RIN ALMASHISH (kommutativlik, YANGI mexanika)

Program d.20, Б3 yakuni. Klon emas — yangi tushuncha: **a×b = b×a**.
- **`CommuteViz` ({r,c,reveal})** — massiv R×C va uni BURGAN C×R yonma-yon (↻ «bur»); ikkalasi bir xil
  jami. reveal 0=chap, 1=+burilgan, 2=+tenglama. Yordamchi: `MiniArray`, `CDot`.
- **`CommuteStage`** — «teng?» Ha/Yo'q. Ikki ko'paytma (`{a,b,e,f}` → a×b va e×f) MiniArray bilan;
  `isEqual = a*b===e*f`; =/≠ solvedда. O'rin almashgan juft (3×4 vs 4×3) → Ha; boshqa sonlar (3×5 vs
  5×4) → Yo'q. `3×5 ≠ 5×3` misconception'ini davolaydi.
- **Ekran routing:** s5/s7/s10 = CommuteStage; s6/s8 = TableFillStage (aralash `by`); s9/s11 = ArrayStage
  (aralash jadval); ACase(s13)/A14(s14) = ArrayStage. **ArrayStage'ning eski A5/A7 wrapperlari O'CHIRILDI.**
- Tushuntirish: s1 CommuteViz 3×5, s2 2×6, s3 qoida + check(6×2=12), s4 «qulay tomondan sana» (9×2 ni
  2×9 orqali) + check(4×3=12). sTBL = to'liq jadval + simmetriya.
- Hook s0 = 3×5 vs 5×3 = 15 (planter 3×5). s13 masala = ombor (Zuhra qutilar 4×6=24). s15 → keyingi: bo'lish.

---

## 2b. Dars19 — BO'LISH MA'NOSI (Б4 SATURN boshi, YANGI mexanika + YANGI biom)

Program d.22, Б4 boshi. Dars18 klon (16 ekran) lekin YANGI tushuncha + YANGI mexanika + YANGI sahna.
**Metodist qarori (2026-07-16): ikkala mexanika** — teng ulashish + guruhlash (ikki ma'no).

- **Mexanika-1 `DealViz`/`DealStage`** — TENG ULASHISH (partitiv): JAMI ni k idishga birma-bir tarqatish →
  «har biriga nechta?» (`DEAL_Q`). reveal 0=kristall uyumi, 1=idishlarga ulashilgan (pop-in stagger),
  2=tenglama `total÷groups=per`. cKey: s5/s7/s9/s11/s13.
- **Mexanika-2 `ArrayRevViz`/`ArrayRevStage`** — GURUHLASH (kvotativ): JAMI ni size tadan guruhlash →
  «nechta guruh?» (`GRP_Q`). reveal 0=uyum, 1=guruhlangan qatorlar, 2=`total÷size=count` + `count×size=total`
  (×↔÷ ko'rinadi). cKey: s6/s8/s10/s14.
- **`FamilyViz` ({a,b,reveal})** — ×↔÷ OILA kartasi: bitta massiv → 1 ta × va 2 ta ÷ (`3×4=12 → 12÷3=4, 12÷4=3`).
  reveal 0 = faqat massiv+× (check javobini yashiradi), >=1 = ÷ oila ochiladi. sTBL(s4×5) + Screen4(3×4) da.
- **`Crystal`** — Saturn koni o'ljasi (qirrali, porlaydigan 3D kristall); `CrystalPile`/`CrystalGrid`/`SortBins`.
- **Distraktor = misconception:** `quotOpts` → `total−div` (bo'lishni AYIRISH deb ko'rish), `div`, ±1.
  Hook s0 distraktor = 8 (=12−4). **Barcha bo'lish BUTUN (qoldiqsiz).** Sonlar ×2–×6 doirasida, jami ≤24.
- **SYUJET (metodist 2026-07-16):** **Anvar va Jasur** Saturn yo'ldoshida 12 kristal terib, kemaga keltirib,
  Bitdan «qanday bo'lamiz?» deb so'raydi → butun ekipajga (**4 kishi**) teng ulashiladi = **12÷4=3**.
- **Ekran routing:** s0 hook (12÷4=3, Anvar/Jasur) · s1 DealViz teach (12÷4=3) · s2 step-reveal DealViz (10÷2) ·
  s3 QOIDA (÷ belgi, misol 12÷4=3) + check(8÷2) · s4 ×↔÷ FamilyViz(3×4) + check(12÷4) · sTBL FamilyViz(4×5) ·
  s5–s11 mashq (deal/guruh miks) · s13 masala DealStage (**Jasur 16÷4=4**) · s14 final ArrayRevStage + Fakt(Saturn halqasi) ·
  s15 xulosa → keyingi bo'lish jadvali. **Eski ArrayStage/CommuteStage/TableFillStage O'LIK KOD bo'ldi (tegilmaydi).**
- **YANGI BIOM = SATURN KONI** (SYUJET §Б4). `SaturnPlanet` (**fotorealistik** halqali sayyora: oblat tana +
  ko'p gaz-kamar + muzli A/B/C halqa + Cassini bo'shlig'i + OLD/ORQA halqa yoyi + halqa-soyasi tanada +
  planeta-soyasi halqada + rim-light + halo). `SaturnMine` (g'or: qoya devor + `CrystalVein` + kon-lampa +
  kon og'zidan Saturn + `dealt` prop: 12-kristal UYUMI ↔ `SortBins` 4×3 + `OreCart` + `MineBot` + chang).
- **PERSONAJLAR: `CrewFace`** — Anvar (to'q sariq skafandr) + Jasur (moviy), **SHAFFOF dubulg'a ostida YUZI KO'RINADI**
  (metodist talabi); `SaturnCrew` = Bit(kapitan)+Anvar+Jasur ism-yorliqlari bilan. Anvar/Jasur `hold` = qo'lда kristall.
  `SaturnScene`(s0,answer=3,uyum) + `SaturnField`(s15,«3✓»,dealt). CSS `d19-sathalo/satband/cryglow`+`d13-*`. Raketa Б4(Saturn 50%).
- **OCHIQ:** prokliklab-test (ovoz+interaktiv+390px); UZ atamalar draft; `FREE_NAV=true` (push oldidan false);
  s2 InfoNote Dars18-меros bilan bir xil ko'rinmaydi (reveal 2 = tenglama payoff yetarli).

---

## 3. YANGI DARS QANDAY QURILADI (klon-usuli)

**Har dars = bitta katta `.jsx` (~7200 satr).** Infra (AudioEngine, useAudio, Stage, QuestionScreen,
LangContext, CSS, sticky-nav, веди-до-верного) — Dars01 etalonidan bayt-aniq, o'zgarmaydi.

1. `cp DarsNN.jsx DarsMM.jsx` — **eng yaqin bazani** klonla (jadval darsi → oldingi jadval darsi;
   yangi mexanika → strukturasi yaqin dars).
2. Fayl boshidagi `// ░░ ... ░░` sarlavha + `LESSON_META` (lessonId, title RU+UZ) + STRUKTURA kommenti.
3. `CONTENT` obyektini ekran-ekran qayta yoz (s0…s15). **RU + UZ to'liq.**
4. Vizual qiymatlar: Screen0/1/2/3/4 dagi `ArrayViz`/`CommuteViz` r,c; `ScreenTable` (TableRow/MultTable);
   `YupiterScene answer`, planter (`PlanterRow n=…` + qator soni), pufak/`YupiterField` natija raqami.
5. `BRIDGES` (slaydlararo audio-ko'prik), `S15_PAYOFF`.
6. `src/lessons/grade2.js` `grade2Nazariy` ga ro'yxatga qo'shish.
7. `npx vite build` (yashil) + audio-digit scan + kirill scan (pastda §6).
8. **Commit FAQAT `DarsMM.jsx` + `grade2.js`** (§0.1 parallel-sessiya qoidasi).

**CONTENT ekran tuzilishi (16 ekran, TOTAL_SCREENS=16, Dars13+ jadval darslari):**
- s0 hook (YupiterScene + MC, distraktor = misconception).
- s1–s4 tushuntirish (custom Screen1–4; Screen1=TeachStage figure, Screen2/3/4 step-reveal + MC check).
- sTBL jadval ekrani (ScreenTable).
- s5–s11 mashq (single + `rounds:[…]`).
- s13 masala (ACase), s14 final (A14, rounds + FactCard Yupiter). s12 = ishlatilmaydigan kontekst.
- s15 xulosa (YupiterField + rule_recap + conn_refs/conn_next).

---

## 4. GOTCHALAR (xato qilmaslik uchun)

1. **`useMemo` YO'Q import.** `React.useMemo` ishlat (bare `useMemo` crash).
2. **Audio segment soni MUHIM.** Screen2 = 4 seg (step≥3 da done), Screen3 = 5 seg, Screen4 = 4 seg,
   sTBL = darsga qarab (Dars18 = 3 seg, `done` sTBL_2 da). Kam bersang gate/reveal ochilmaydi.
3. **AUDIO TTS-toza:** sonlar SO'Z bilan (raqam YO'Q), `«»`/`×`/`=`/`+` YO'Q, ikki-nuqta-ro'yxat ehtiyot.
   Guillemet/belgilar faqat KO'RINADIGAN matnda (rule/info/fact). **Har build oldidan audio-digit scan (§6).**
   ⚠️ Klonlashda «2 ga jadval» kabi digit-slip audio'ga tushib qoladi — skript bilan ushla.
4. **Register:** RU `ты`, UZ `siz`. Ismlar o'zbekcha. Apostrof oddiy `'` (modifikator `ʻ` emas).
5. **JS string ichida UZ matn — ikki tirnoq yoki backtick** (bitta tirnoq emas, `O'`/`'` bor).
6. **Distraktor = aynan misconception** (ko'paytirishda R+C = qo'shish xatosi; kommutativlikda «teng emas»).
7. **Check-javob scope'да:** natija joriy jadval ichida, ≤ dars chegarasi.
8. **SCREEN_META kommentlari klonda eskirib qoladi** (masalan «3×4=12» deydi) — zararsiz, lekin adashtirmasin.
9. **O'lik kod ko'p** (Dars07 nasl-nasabi: столбик/HatchDoor/CodeTablo…). `screens` massivida yo'q → render
   bo'lmaydi. eslint no-unused-vars baseline ~92 err shundan. **Tegmang.**

---

## 5. SYUJET / METODIKA (o'zgarmas kontrakt)

- **`SYUJET_2SINF.md`** — «Bitni uyiga kuzatish»: Yer→Mars→**Yupiter**→Saturn→…→Bit uyi.
  Б1 ochiq koinot (d1–7), Б2 Mars (d8–14 amallar), **Б3 Yupiter (d15–21 ko'paytirish jadvali)**,
  Б4 bo'lish (d22–28). §3 Б3 = kema issiqxonasi/orbita (Yupiter gaz — issiqxona, tuzatilgan).
- **`ETALON_2SINF.md`** §11 — dizayn/spec. **`2sinf_metodologiya.md`** — har dars OCHIQ tushuntiradi +
  ko'rinadigan QOIDA; o'yin tushuntirishga xizmat qiladi ([[grade2-explain-not-game]]).
- Bit — kapitan+diktor (**ayol ovoz**, g=f). Ekipaj: Ra'no, Anvar, Zuhra, Jasur.

---

## 6. KEYINGI ISHLAR + KOMANDALAR

**Keyingi: Dars38 = Б6 d.41 «Kattaликларга masala» (vaqt/pul/uzunlik)** (SYUJET §Б6). **Mexanika metodist bilan
kelishiladi** (§3). Klon-baza Dars37. Keyin d.42–44 (program_map), d.45 takrorlash+ПК6, d.46 yakuniy nazorat (Yer'ga qo'nish, ИК).

### Б6 NEPTUN — NIMA QURILDI (Dars37 «Pul», UNCOMMITTED)

**Dars37 = Б6 «Pul: tanga bilan hisob»** (program d.40, «almashuv» sahna) — QURILDI, build-green, **UNCOMMITTED**, prokliklanmagan.
- **Metodist qarori (2026-07-17):** mexanika = **ARALASH** (sanash + yig'ish/solishtirish); **nominal = REAL UZ (100/200/500/1000 so'm)**.
- **YANGI komponentlar:** `CoinFig` ({value}) — <1000 dumaloq tanga (100 mis/200 kumush/500 tilla `COIN_TONE`), ≥1000 yashil
  banknota · `CoinSet` ({coins}) — qator · `MoneyMCStage` (matn-MC engine, figure) → CountMoneyStage (CountFig) / CompareMoneyStage
  (CompareFig, ikki to'plam+chap/o'ng) · `GatherStage` (summa → CoinSet choices, PickShape-uslub). `CUR`={ru:сум,uz:so'm}, `LR` (chap/o'ng).
- **Ekran routing:** s0 hook (3 tanga=«3 so'm»?) · s1 CoinSet teach (100+200) · s2 summa yig'ish · s3 QOIDA+check · s4 solishtirish (2×100<500)+warn ·
  sTBL 4 nominal · s5/s7/s10=CountMoney · s6/s9=Gather · s8/s11=CompareMoney · s13 masala (500+200+100=800) · s14 aralash+fakt.
- **Ko'lam:** summalar ≤ ~2000, 100 ga karrali (yuzliklarni sanash). **Distraktor=misconception:** M1 dona↔qiymat (3 tanga=«3 so'm») · M2 ko'p tanga=ko'p pul · M3 dona bo'yicha yig'ish · M4 yig'indi xato.
- **⚠️ RU valyuta:** vizual RU option «сум» ga o'zgartirildi (splice'da ` so\'m`→` сум`, faqat RU backslash-apostrofli). Audio RU «сумов». UZ «so'm».
- **⚠️ UZ (validatsiya):** pul/tanga/so'm/banknota DRAFT; sonlar yuzlik/minglik (grade-2 dan kengroq). Xaydarov solishtirilmadi.
- **CONTENT manbasi:** `Dars37_CONTENT.md`. QA lokal: audio-digit=0, kirill=0, sen=0. FREE_NAV=true (~59-satr).

### Б6 NEPTUN — NIMA QURILDI (Dars36 «Kalendar», UNCOMMITTED)

**Dars36 = Б6 «Kalendar: kun, hafta, oy»** (program d.39, «bort jurnali» sahna) — QURILDI, build-green, **UNCOMMITTED**, prokliklanmagan.
- **Metodist qarori (2026-07-17):** mexanika = **ARALASH** — hafta kunlari (teach + qoida) + kalendar-katak o'qish (mashq) + oylar.
- **YANGI komponentlar:** `WeekStrip` ({hi, caps}) — 7 kun chiplari (Du..Ya), ajratish + yorliq · `CalendarFig` ({mark}) — mavhum
  oy jadvali (1-sana=Chorshanba `CAL_START=2`, 30 kun; `weekdayOf(N)=(N+1)%7`), sana ajratiladi · `CalMCStage` (matn-MC engine,
  `figure` prop null bo'lsa freym yo'q) → **WeekDayStage** (WeekFig) · **CalendarReadStage** (CalFig) · **MonthStage** (figure yo'q).
  `WEEKDAYS`/`MONTHS` konstantalari (to'liq+qisqartma, ru+uz). `WORD_OPT` (so'z-variant stili) + `FRAC_OPT` (raqam, s4 check).
- **Ekran routing:** s0 hook (chorshanba ajratilgan) · s1 WeekStrip teach · s2 kecha/bugun/erta (3 ajratilgan+caps) · s3 QOIDA+check ·
  s4 12 oy (MonthRow) + warn + check (raqam) · sTBL WeekStrip+birlik · s5/s7/s11=WeekDay · s6/s8/s10=CalendarRead · s9=Month · s13 masala(15→chorshanba) · s14 aralash(week/cal)+fakt.
- **Kalendar:** MAVHUM (real sanaga bog'lanmagan), hafta boshi=Dushanba. **CalendarRead soddalashtirildi:** faqat sana→kun (kun→sana ko'p javobli).
- **Distraktor=misconception:** M1 kun tartibi (s0/s5/s11) · M2 sana↔hafta kuni (CalendarRead) · M3 hafta=7 vs oy (s4 warn/s9) · M4 oy tartibi (s9).
- **⚠️ UZ (validatsiya kerak):** hafta kunlari (Dushanba…Yakshanba, qisqartma Du/Se/Ch/Pa/Ju/Sh/Ya), oylar (yanvar…dekabr), kecha/bugun/erta. **Hafta boshi=Dushanba** — o'zbek/rus standarti, tekshir. (Notion MCP uzuq — Xaydarov solishtirilmadi.)
- **CONTENT manbasi:** `Dars36_CONTENT.md`. QA lokal: audio-digit=0, kirill=0, sen=0, guillemet=0. FREE_NAV=true (~59-satr).

### Б6 NEPTUN — NIMA QURILDI (Dars35 «Vaqt/soat», UNCOMMITTED)

**Dars35 = Б6 «Vaqt: soat va daqiqa»** (program d.38) — QURILDI, build-green, **UNCOMMITTED**, prokliklanmagan.
- **Metodist qarori (2026-07-17):** mexanika = **ARALASH** — soat o'qish (teach + qoida) + analog↔raqamli moslash (mashq).
- **YANGI komponentlar:** `ClockFace` ({h,m,w}) — analog siferblat: 12 belgi + `12/3/6/9` raqamlari, kalta strelka (soat, ACCENT
  yo'g'on), uzun strelka (daqiqa, BLUE ingichka); soat strelkasi daqiqaga proporsional siljiydi. `ReadClockStage` (ClockFace
  ko'rsatiladi → raqamli yozuvni tanla; read + toDigital bir xil) · `MatchToClockStage` (raqamli yozuv → mos mini-ClockFace tanlash).
- **Ekran routing:** s0 hook (3:00, «12:15»mi?) · s1 teach ikki strelka (3:00 step) · s2 yarim (3:30) · s3 QOIDA+check (6:00) ·
  s4 chorak+warn+check (2:15) · sTBL 3 ClockFace+yozuv · s5/s7/s9/s10=ReadClockStage · s6=ReadClockStage(toDigital) ·
  s8/s11=MatchToClockStage · s13 masala (7:30) · s14 final ×3+fakt.
- **Ko'lam:** butun soat, yarim(30), chorak(15/45), 5-daqiqalik(s10). Daqiqa 5-karrali, 12-soatlik, AM/PM yo'q. Ulush ko'prigi (d.37): yarim=yarim, chorak=chorak.
- **Distraktor=misconception:** M1 strelka almashish (s0/s5 «12:15») · **M2 daqiqa×5** (s4 warn + s9/s10 «2:03») · M3 soat yaxlitlash (s7 «5:30») · M4 noto'g'ri yozuv (s6/s8).
- **⚠️ UZ (validatsiya kerak):** vaqt-o'qish shakli DRAFT — «soat to'rt, o'ttiz daqiqa» (4:30). **Idiomatik «uch yarim»/«половина четвёртого» QO'LLANMADI** (grade-2 sodda). `yarim soat`/`chorak soat` draft.
- **⚠️ GOTCHA:** s0 audio/q da uz «...» guillemet bor edi → audio-digit skan ushladi → olib tashlandi (audio+ko'rinadigan matnda «» yo'q). Klonlashda diqqat.
- **CONTENT manbasi:** `Dars35_CONTENT.md`. QA lokal: audio-digit=0, kirill=0, sen=0, jingalak apostrof=0. FREE_NAV=true (~59-satr).

### Б6 NEPTUN — NIMA QURILDI (Dars34 «Ulush/доли», UNCOMMITTED)

**Dars34 = Б6 «Ulush (доли): butunning qismi»** (program d.37) — QURILDI, build-green, **UNCOMMITTED**, prokliklanmagan.
- **Metodist qarori (2026-07-17):** mexanika = **BO'LAK-BO'YASH** — butunni N ta TENG qismga bo'l, bittasini bo'ya → «bir Ndan».
- **YANGI komponentlar:** `ShareFig` ({shape:'circle'|'bar'|'rect', parts, shaded, equal}) — pie/lenta/to'rtburchak N qismga bo'linadi
  (`equal:false`→birinchi bo'lak katta, teng emas); k tasi bo'yalgan · `FracMCStage` (text-MC engine, figure prop = `UlushFig`/
  `CompareFig`, per-option wrong) · `PickShapeStage` (nomga mos ShareFig ni tanlash, choices) · `EqualCheckStage` (teng qismmi? Ha/Yo'q).
  `ULUSH_NAME[N]` = «bir Ndan» xaritasi (jadval/yorliq).
- **Ekran routing:** s0 hook (bar 2 teng emas — «yarim»mi? Yo'q) · s1 ShareFig teach (circle/3 step-reveal) · s2 nomlash (2/3/4) ·
  s3 QOIDA+check (circle/4) · s4 CompareFig+warn+check (circle 2 vs 4) · sTBL 3 ShareFig qatori (bar 2/3/4+nom) ·
  s5/s8/s11=UlushFig NameStage · s6/s10=PickShapeStage · s7=EqualCheckStage · s9=CompareFig · s13 masala (payk circle/4) · s14 final ×3+Fakt.
- **Ko'lam:** faqat birlik ulush (N dan 1), N=2,3,4 (s8/s14 da 6). «Kasr/maxraj» atamasi YO'Q.
- **Distraktor=misconception:** M1 teng emas ham «ulush/yarim» (s0/s7) · **M2 ko'p qism=katta ulush** (s4 warn + s9 Compare) ·
  M3 nom=qism soni (uch, bir uchdan emas) · M4 shakl tanlashda teng/N e'tiborsiz.
- **⚠️ UZ (validatsiya kerak):** atamalar DRAFT — `bir ikkidan/uchdan/to'rtdan…`; **`bir Ndan` vs `Ndan bir` tartibi** o'zbek
  metodist tasdig'i kerak. `yarim` (1/2) s0 da ma'no sifatida ishlatildi. (Notion MCP uzuq — Xaydarov solishtirilmadi.)
- **⚠️ GOTCHA:** klon merosida o'lik `NameFig` (raqam-nom span, d.4392) bor edi → mening `NameFig` bilan to'qnashdi
  (`Identifier already declared`) → meniki `UlushFig` deb nomlandi. **Yangi figure-nom qo'yishdan oldin grep bilan tekshir.**
- **CONTENT manbasi:** `Dars34_CONTENT.md`. QA lokal: audio-digit=0, kirill=0, sen-form=0 (yagona «yasang» false-positive). FREE_NAV=true (~59-satr).

### Б6 NEPTUN — NIMA QURILDI (Dars33 «Tenglamalar», UNCOMMITTED)

**Dars33 = Б6 «Tenglamalar: noma'lumni topish»** (program d.36) — QURILDI, build-green, **UNCOMMITTED**, prokliklanmagan.
- **Metodist qarori (2026-07-17):** mexanika = **GIBRID** — tarozi (teach + qoida) + yashirin oyna (mashq) + qo'yib-tekshir.
- **YANGI komponentlar:** `BalanceScale` (ikki pallali tarozi: chap `x op n`, o'ng `res`, tekis to'sin + piramida-tayanch; solved→`x=sol`) ·
  `SlotEq` (`[oyna] op n = res`, oyna=x, solved→yashil son) · `EqStage` (bitta MC-engine, `rounds||[c]`, `figure` prop + per-option
  `wrong` hint, veди-до-верного) → **BalanceStage/SlotFindStage/SubstStage** (figure = `BalanceFig`/`SlotFig`/`SubstFig`).
- **Ekran routing:** s1 tarozi teach (audio step-reveal) · s2 SlotEq teach · s3 QOIDA+check (SlotEq x+2=6) · s4 qo'yib-tekshir+warn
  (SubstFig x=5→5+4=9) · sTBL KALIT (3 SlotEq qatori) · s5/s7/s10/s13/s14 = BalanceFig · s6/s8/s11 = SlotFig · s9 = SubstFig.
- **Yechim modeli:** `sol = op '+' ? res−n : res+n`. Barcha tenglama BUTUN musbat; operand bir xonali; natija ≤ 12; ayirish faqat `x−n`.
- **Distraktor = misconception:** M1 `x=res+n` (teskari amal yo'q) · M2 ayirishda yo'nalish teskari (`x−n=res → res−n`) ·
  M3 «tenglama=o'ng tomonni yoz» (s9 SubstStage bevosita qo'yib-tekshiradi) · M4 `+n` e'tiborsiz. Hook s0 distr = 13 (=9+4).
- **⚠️ UZ (validatsiya kerak):** `x` ovozda «iks» (rus an'anasi; o'zbek lotinda x=/χ/), har joyda «yashirin son» deb qayta bog'landi.
  Atamalar draft: tenglama/noma'lum/muvozanat/qo'yib tekshirish (Notion MCP uzuq — Xaydarov darsligiga solishtirilmadi).
- **Klon-baza Dars32:** SlotExpr/EvalStage/ClassifyStage/PickExprStage + geometriya = O'LIK KOD (tegilmadi, no-undef yo'q).
  Neptun sahna (`NeptunScene`/`NeptunField`/`SaturnCrew`/`CodeTerminal`) qayta ishlatildi; NeptunScene hook-pufagi 7→**5**.
- **CONTENT manbasi:** `Dars33_CONTENT.md` (shu papkada) — metodist tasdiqlagan.
- **QA (lokal skript):** audio-digit=0, kirill-in-uz=0, sen-form=0 (yagona «yasang» = siz-shakli false-positive, o'lik RectBuildStage).
- **⚠️ GOTCHA:** t(o) EqStage variantida `o={ru,uz,ok?,wrong:{ru,uz}}` — useT `o[lang]` qaytaradi (wrong sub-obyekt e'tiborsiz). FREE_NAV=true (~59-satr).

### Б6 NEPTUN — NIMA QURILDI (Dars32, UNCOMMITTED)

**Dars32 = Б6 boshi «Sonli va harfli ifodalar»** (program d.35) — QURILDI, build-green, **UNCOMMITTED**, prokliklanmagan.
- **Metodist qarori (2026-07-17):** asosiy mexanika = **OYNA/SLOT** (harf = ichiga son qo'yiladigan porlaydigan oyna).
  Mashina (input→output) va aralash variant RAD ETILDI — grade-2 uchun eng konkret, `a+5=a5` misconception'ini bevosita o'ldiradi.
- **YANGI komponentlar:** `SlotExpr` (harf/son oynasi + amal + son; reveal → `= qiymat`) · `ExprText` (matn ifoda; harf accent,
  op=null → yopishtirilgan `a3`). Uch test-format: **EvalStage** (oynaga son qo'y → qiymatni MC) · **ClassifyStage** (sonli/harfli?) ·
  **PickExprStage** (so'zga mos ifoda; `a3` konkatenatsiya distraktori).
- **Ekran routing:** s5/s6/s8/s10/s13/s14 = EvalStage · s7/s11 = ClassifyStage · s9 = PickExprStage. s1 sonli ifoda (ExprText),
  s2 harfli ifoda (SlotExpr step-reveal), s3 QOIDA, s4 «bitta ifoda har xil qiymat» + warn, sTBL almashtirish jadvali.
- **Sonlar:** bir xonali operand, natija ≤ 15, +/− aralash, harflar `a b k` (x — Dars33 tenglama uchun saqlandi). **Distraktor = misconception:**
  s0 → 25 (`a5` yopishtirish); EvalStage → konkatenatsiya (`evalOpts` ≤30 bo'lsa) + teskari amal; PickExpr → `a3` glued.
- **YANGI BIOM = NEPTUN** (SYUJET §Б6). ⚠️ **Neptun gaz-muz giganti — QO'NISH YO'Q** (Yupiter/Saturn kabi) → sahna = **ORBITAL
  STANSIYA DEKASI** (metall pol, SIRT EMAS): `NeptunPlanet` (ko'k gigant + Buyuk qora dog' + gaz kamarlari) + deraza + `CodeTerminal`
  (harfli ifoda = «kod», Б6 tematik) + `NeptunBase`/`NeptunScene`/`NeptunField`. Ekipaj = `SaturnCrew` (qayta ishlatildi). Fakt: eng kuchli shamollar.
- **CONTENT manbasi:** `Dars32_CONTENT.md`? — YO'Q, CONTENT to'g'ridan .jsx da (skeleton md yozilmadi; keyingi safar yozish tavsiya).

**⚠️ Dars32 GOTCHA'lar (klon zanjiri):**
1. **Sahna blokini almashtirsang, ichidagi YORDAMCHI komponentlar o'chib ketadi.** Uran blokida `StationModule` bor edi →
   o'lik `ObjIcon` (Dars28 LEN) unga murojaat qiladi → **no-undef**. Yechim: `StationModule` ni Neptun blokiga qayta qo'shdim.
   `KEY_CAP` ham ChainStage (Dars31) blokida edi → mexanika blokiga qayta qo'shildi. **Regex bilan blok o'chirishdan oldin
   `npx eslint <fayl> | grep no-undef` bilan tashqi murojaatlarni tekshir.**
2. **Yalang'och buyruq `qo'y`/`hisobla` registr skanidan o'tib ketishi mumkin** — standart BAD-regexda yo'q edi. Kengaytirilgan
   skript (`reg32.mjs`: `qo'y|hisobla|ayir|qidir|kirit` qo'shilgan) bilan 7 ta tuzatildi. Har darsda kengaytirilgan skan.

### Б5 URAN — TUGADI (Dars26–31)

**Dars31 = Б5 YAKUNI «Takrorlash · butun geometriya»** (program d.34) — QURILDI, build-green, **UNCOMMITTED**.
- **Metodist qarori (2026-07-17):** «miks + ZANJIR» — sof aylantirish emas, Б5 ni **bog'laydigan** yangi mexanika.
- **YANGI `ChainStage`** — BITTA shakl, uch qadam ketma-ket (har biri MC, oldingisi yechilmasa keyingisi ochilmaydi):
  1) shakl nomi (`SumFig` raqamsiz — javob sizmasin) → 2) tomon uzunligi (`SumFig` da tomon yonadi + `Ruler`) →
  3) perimetr (`SumFig` raqamlar bilan) + tenglama. Qadam-chiplar (1 shakl · 2 uzunlik · 3 perimetr) yuqorida.
  Kontrakt: `round = { shape:'rect'|'tri', dims:[a,b]|[a,b,c], measure }`. Hint qadamga xos: `wrong_shape/len/perim`.
- **`SumFig` kengaytirildi:** rect endi **o'lchamga proporsional** (3×3 kvadrat kvadrat bo'lib ko'rinadi, 4×2 keng);
  yangi proplar `labels` (raqamsiz rejim) va `hi` (o'lchanayotgan tomonni ajratish).
- **Dars26 dan `LineFig`/`RealObj`/`LineTypeStage` KO'CHIRILDI** — klon zanjirida (D27→D30) yo'qolgan edi.
- **Ekran routing:** s5/s8/s13/s14 = ChainStage · s6 = LineTypeStage · s7 = PolyTypeStage · s9 = LenStage ·
  s10 = PerimStage (r3 = L-shakl, yuza tuzog'i) · s11 = RectBuildStage. `PickStage`/`PolyMatchStage`/`GeoFig` —
  qisman o'lik (GeoFig hali RectBuildStage ichida jonli).
- **Sonlar:** perimetr 8–18, tomon 2–6 sm, chizg'ich ≤10 sm, convert 3 dm = 30 sm. **Yuza YO'Q.**
- **Distraktor = misconception:** s0 → 9 (bitta tomon tashlab ketilgan 3+3+3 *va* 3×3); s4 check → 4 (ikki tomon);
  s10 r3 → «faqat chetni sanang, ichidagi kataklarni emas».
- **Fakt:** Uran halqalari tik (yonboshlab aylangani uchun) — Dars30 dagi «4 barobar katta» takrorlanmasin.
- **CONTENT manbasi:** `Dars31_CONTENT.md` (shu papkada) — metodist tasdiqlagan.

**⚠️ UZ REGISTR TUZATILDI (2026-07-17, metodist qarori «2 keyin 1»):** Dars26–30 da yalang'och buyruq
(`sana`, `qo'sh`, `sozla`, `qara`, `tekshir`, `yasa` …) va **sen-shakli** (`bilasan`, `yasaysan`) bor edi —
CLAUDE.md talabi esa **siz**. 5 faylda **135 qator** skript bilan tuzatildi (`sanang`, `qo'shing`, `bilasiz` …).
Build yashil, CRLF butun. **Bu fayllar ham UNCOMMITTED.** Dars31 boshidanoq siz-registrda.
Skript namunasi: uz-string literallari ichida `\b` bo'yicha butun-so'z almashtirish (RU tegilmaydi).

### Б5 URAN — NIMA QURILDI (Dars26–30 PUSHED, Dars31 UNCOMMITTED)

| dars | mexanika (live komponentlar) |
|---|---|
| 26 | `LineFig` (3D sterjen+konus-strelka+shar-uch) · `RealObj` hayotiy langar: **ufq chizig'i**=0 uch, **fonar**=1 uch, **qalam**=2 uch · `LineTypeStage` (ask: type/count) |
| 27 | `PolyFig` (3D plastina, sides=0 doira / −1 ochiq) · `PolyTypeStage` (name/count/ispoly) · `PolyMatchStage` (elastik-sim DRAG shakl→nom, Dars20 meros) |
| 28 | `Ruler` (chizg'ich+detal) · `ObjIcon` (qalam/parta/modul) · `ConvertViz` · `LenStage` (mode: ruler/unit/convert) |
| 29 | `GeoFig` (geoboard, **TEKIS**) · `SumFig` (raqamlangan tomonlar, **TEKIS**) · `PerimStage` (mode: geo/sum) |
| 30 | `RectBuildStage` (eni/bo'yi **stepper** + «Tekshir» o'zi bosadi) · `PickStage` (o'lchamga mos shaklni tanlash) · `GeoFig filled` |
| 31 | **`ChainStage`** (YANGI — bitta shakl, uch qadam: nom → `Ruler` bilan o'lchov → perimetr) · `SumFig` kengaytmasi (proporsional rect + `labels`/`hi`) · **Dars26 dan ko'chirilgan** `LineFig`/`RealObj`/`LineTypeStage` · meros `PolyTypeStage`/`LenStage`/`PerimStage`/`RectBuildStage` |

**Umumiy sahna (Dars26–31 da BIR XIL):** `UranBase` — Uran yo'ldoshi. Metodist iteratsiyalari: `IceRidge` (orqa fonda
katta muz-tog' tizmasi, zIndex 1 → sirt uni pastdan yopadi) + `UranStation` (Mars `CargoBase` MIQYOSIDA katta baza) +
IceRock/SurveyTripod/Beacon/UranDrone/muz-zarra. Sahna o'zgarsa — **beshala faylga birdan** qo'llash kerak (skript bilan).

**⚠️ MUHIM GOTCHA'lar (yangi sessiya uchun):**
1. **Fayllar CRLF** — skript bilan blok almashtirsangiz `};` ni `\r` bilan solishtiring, aks holda topilmaydi.
2. **`transform-box: fill-box`** (`.d13-wave`) + px `transformOrigin` = origin element bbox'idan hisoblanadi → **qo'l
   yelkadan uzilib uchadi**. Yechim: inline `transformBox: "view-box"`. Dars26–30 TUZATILDI; **Dars13–25 da hali BOR**
   (faqat qo'l silkinadigan ekranda — s15 `happy` — ko'rinadi).
3. **Kirill ifloslanishi:** uz matnga Latin so'z ichiga kirill «га» kirib qolgan edi (11 ta). Har doim uz-kirill skan.
4. **Nom to'qnashuvi:** infra'da eski `BuildStage` bor → Dars30 da `RectBuildStage` deb nomlandi.
5. **Audio:** sonlar SO'Z bilan, birliklar to'liq nom («santimetr», «sm» emas). Ko'rinadigan matnda digit/abbr OK.
6. **UZ registr — `siz`** (`sanang`, `qo'shing`, `toping`). Yalang'och buyruq va `-san/-sang` YO'Q. Har dars oxirida
   uz-string skani (skript: `\b(sana|qo'sh|tanla|sozla|qara|tekshir|yasa|top|bilasan|yasaysan)\b`).
7. **Klon merosidagi yorliqlar eskiradi:** Dars31 da `UranField label` hali Dars26 niki («Chiziqlar ajratildi») edi —
   qo'lda tuzatildi. Yangi darsda s0/s15 sahna yorliqlarini ALBATTA tekshiring.
8. **`SumFig` rect endi proporsional** (Dars31 dan). Dars29/30 dagi eski SumFig o'zgarmagan — agar ular ham
   proporsional bo'lishi kerak bo'lsa, alohida ish.

**⚠️ Dars27–31 PROKLIKLANMAGAN** — yangi sessiyada avval shularni tekshirish tavsiya etiladi.
**⚠️ Notion MCP ULANMAGAN** — qa-validator/knowledge-updater knowledge base'ni o'qiy/yozolmaydi (autentifikatsiya kerak).
QA lokal skriptlar bilan qilindi (audio-digit · uz-kirill · registr · CONTENT-kalit · segment-sanoq).

---

**BAJARILDI (tarix): Dars25 = Б4 «Bo'lish mustahkamlash · TAKRORIY AYIRISH» (Saturn YAKUNI) — QURILDI va PUSHED.**
Metodist qarori (2026-07-16, internet-tadqiqot asosida): bo'lish blokiga +1 dars — takroriy ayirishni OSHKORA ko'rsatish.
- **Yadro g'oya:** son o'qidagi orqaga sakrashning YONiga AYIRISH TENGLAMASINI chiqar: `12 − 3 − 3 − 3 − 3 = 0` →
  «3 tadan 4 marta ayirdik» = `12 ÷ 3 = 4`. Bola Б2 Mars (ayirish) ko'nikmasiga bog'laydi. Bu — manbalar bir ovozdan
  tavsiya qilgan grade-2 bo'lish strategiyasi (repeated subtraction); bizda hozir faqat vizual son o'qi bor edi, tenglama emas.
- **Klon-baza:** Dars24 yoki Dars21 (ikkalasида ham `NumberLineBackViz`/`NumberLineBackStage` bor — shu vizualga
  tenglama-qatlam qo'shiladi). YANGI mexanika = masalan `RepeatSubStage` (son o'qi + `12−3−3…=0` sinxron ochilish +
  «necha marta ayirdik?» MC). Meros `FamilyViz` (×↔÷) bilan aralashtirilishi mumkin (metodist «aralash» tanlasa).
- **Distraktor = misconception:** javob = SAKRASH/AYIRISH SONI (necha marta ayirdik), ayirilgan son (masalan 3) EMAS;
  `total−div` ham. Bo'lish=ayirish adashuvини aynan shu dars mustahkam yopadi.
- **Ko'lam:** butun bo'lish (qoldiqsiz), ÷2–÷9 (allaqачон o'rgangan sonlar). Saturn biom (SaturnScene/SaturnField/SaturnMine meros).
- **s15 xulosa → Б5 geometriya (Dars26).** Butun bo'lish blokini (ma'no + ×↔÷ + jadval + masala + takroriy ayirish) yakunlaydi.
- **AVVAL metodist bilan mexanikani kelish** (§3, klon-usuli), keyin skeleton → content → jsx → qa. `FREE_NAV=true` (test).

**BAJARILDI (tarix): Dars26 = Б5 GEOMETRIYA boshi** (program d.29) — QURILDI va PUSHED. Quyidagi reja amalga oshdi:
YANGI BLOK — yangi biom (SYUJET §Б5, Saturn→Uran o'tish) + YANGI mexanika (geometrik: shakl chizish/tanish, o'lchash,
perimetr = tomonlar yig'indisi). Bo'lish klon-bazasi MOS EMAS (matematikasi boshqa) — metodist bilan mexanika+biomni
kelish. Van Hiele 0–1 daraja (metodologiya §Б5).

**Dars24 = «bo'lishga masalalar» (Б4 YAKUNI) QURILDI** (metodist «aralash»):
- **YANGI `OpChoiceStage`** (s8/s9/s11) — hayotiy masala → AVVAL amal tanlanadi (÷/× ifoda) → KEYIN javob (MC).
  2-bosqichli; amalni tanib olishga urg'u. `CrystalPile` illyustratsiya.
- Syujet masala + MEROS viz: DealStage (s5/s10/s13 ulashish), NumberLineBackStage (s6 guruhlash), FamilyFindStage (s7/s14 ×↔÷).
- Teach: s1 ulashish(DealViz), s2 guruhlash(NLB), s3 QOIDA «poровну/каждому→÷» + check, s4 «×/÷?» + check. sTBL=bo'lish-KALITI+DivTable[3,6,9].
- Hook 20÷5=4 (lager, distraktor 15). Sahna answer=4. **Dars19–24 hali commit qilinmagan** (§0.1).

**Dars23 = «÷6, 7, 8, 9 ga bo'lish» (bo'lish jadvali FINALI) QURILDI** (Dars22 klon, mexanika o'zgarmadi):
- `DivTable` [6,7,8,9] upto5. Hook 24÷6=4 (distraktor 18=24−6). Teach: s1 ÷6 son o'qi(24÷6), s2 ÷7 jadval,
  s3 QOIDA+÷8 check(24÷8=3), s4 ÷9 son o'qi(27÷9=3). Mashqlar ÷6–9 aralash. Masala 30÷6=5. Sonlar butun (54÷6, 72÷9 gacha).
- Sahna answer=4, SortBins 6×4. `on_wrong` s7/s14 generik (raqamsiz). **Dars19–23 hali commit qilinmagan** (§0.1).

**Dars22 = «÷4 va ÷5 jadvali» QURILDI** (Dars21 klon, mexanika o'zgarmadi — faqat sonlar):
- Mexanika: DivTableFillStage (s5/s8/s11) + NumberLineBackStage (s6/s9/s13) + FamilyFindStage (s7/s10/s14).
- `DivTable` [4,5] ga o'zgardi. Hook 20÷4=5 (distraktor 16=20−4). Teach: s1 son o'qi(20÷4), s2 ÷4 jadval,
  s3 QOIDA+check(16÷4), s4 ÷5 son o'qi(15÷5). Sonlar ÷4/÷5 butun (32÷4, 35÷5 gacha). Sahna answer=5.
- **Dars19–22 hali commit qilinmagan** — metodist tasdiqlagach commit (§0.1).

**Dars21 = «÷2 va ÷3 jadvali» QURILDI** (metodist «aralash» tanladi — uch mexanika):
- **`DivTableFillStage`** (s5/s8/s11) — ÷by jadval-qatorining (by·n÷by=n) bo'sh katagini MC bilan to'ldirish; `DivTableRow`.
- **`NumberLineBackStage`** (s6/s9/s13) — son o'qida orqaga step-talik sakrash (total→0), sakrashlar=total/step; `NumberLineBackViz` (SVG, yoy-strelkalar, Saturn kon-relsi).
- **`FamilyFindStage`** (s7/s10/s14) — Dars20 meros, ×↔÷ oila orqali ÷ topish.
- `DivTable` (sTBL) = ÷2 va ÷3 to'liq jadval. Teach: s1 son o'qi(12÷2), s2 ÷2 jadval, s3 QOIDA+check(8÷2), s4 ÷3 son o'qi(9÷3). Hook 12÷2=6 (distraktor 10=12−2). Sonlar ÷2/÷3, butun. MatchStage/DealStage/ArrayRevStage O'LIK.
- **Dars19+20+21 hali commit qilinmagan** — metodist tasdiqlagach commit (§0.1).

**Dars20 = «× va ÷ bog'lanishi» (oila) QURILDI** (metodist «ikkisi aralash» tanladi):
- **`FamilyFindStage`** (s5/s7/s9/s11/s13/s14) — ×↔÷ oilaning BO'SH ÷ a'zosini top (MC). `FamilyViz blankBy` +
  `quotOpts` distraktor (total−div ayirish-xato). Oila: `a×b=p → p÷a=b, p÷b=a`.
- **`MatchStage`** (s6/s8/s10) — × faktni bir oiladagi ÷ faktiga MOSLASH (tap: chap × ustun → o'ng ÷ ustun,
  mahsulot bo'yicha; `c.pairs=[{a,b}...]`, o'ng ustun shuffleArr; matched=yashil✓, xato=qizil flash).
- Tushuntirish Screen1–4/sTBL = `FamilyViz` (bitta massiv → 1× + 2÷). DealStage/ArrayRevStage endi O'LIK KOD.
- Hook s0 = `3×4=12 → 12÷4=?` (distraktor 8=12−4). Sonlar ×2–×6, butun. Sahna = Saturn davom (answer=3, «saralash»).
- **Dars19+Dars20 hali commit qilinmagan** — metodist tasdiqlagach commit (§0.1: faqat o'z fayl + `grade2.js` + shu md).

**Har dars uchun:** avval MEXANIKANI tanla (metodist qarori), keyin qur (§3).

```bash
npx vite build 2>&1 | tail -3          # yashil bo'lishi shart

# audio-digit scan (audio blokida raqam/belgi bo'lmasligi kerak):
node -e 'const fs=require("fs");const L=fs.readFileSync("src/components/grade2/DarsNN.jsx","utf8").split("\n");
let inA=false,d=0,h=0;for(let i=0;i<L.length;i++){const x=L[i];if(/\baudio:\s*[\{\[]/.test(x)){inA=true;d=0;}
if(inA){d+=(x.match(/[\{\[]/g)||[]).length-(x.match(/[\}\]]/g)||[]).length;(x.match(/'[^']*'|"[^"]*"/g)||[]).forEach(s=>{if(/[0-9%$×=+<>«»]/.test(s.slice(1,-1))){console.log("L"+(i+1)+": "+s.slice(0,60));h++;}});if(d<=0&&/[\}\]]/.test(x))inA=false;}}console.log("digits:",h);'

# git — FAQAT o'z fayling + grade2.js (parallel sessiya uchun!):
git add src/components/grade2/DarsNN.jsx src/lessons/grade2.js && git commit -m "…" && git push origin main
```

Encoding: UTF-8. Preview — `SETUP.md`. Notion MCP (QA/knowledge base) hozir ULANMAGAN — autentifikatsiya kerak.
```
