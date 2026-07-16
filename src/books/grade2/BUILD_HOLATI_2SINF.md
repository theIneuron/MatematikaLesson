# 2-SINF — BUILD HOLATI VA HANDOFF (boshqa kompyuterga / yangi sessiyaga o'tish uchun)

> **Maqsad:** ishni boshqa mashina yoki yangi sessiyada davom ettirish. Bu fayl git orqali ko'chadi.
> Lokal xotira (`C:\Users\...\.claude\...\MEMORY.md`) YANGI mashinaga o'tmaydi — shuning uchun butun
> kontekst shu yerda jamlangan. Yangilash: har dars tugagach shu faylni ham yangilab bor.
>
> Oxirgi yangilanish: **2026-07-16** — **Dars19–30 PUSH QILINDI** (Б4 bo'lish TO'LIQ + **Б5 URAN geometriya
> Dars26–30 qurildi**: chiziq turlari · ko'pburchaklar · sm/dm/m · perimetr · shakl yasash). Keyingi: **Dars31 =
> Б5 YAKUNI (takrorlash + ПК5)** — §6 ga qara. Dars26–30 prokliklanmagan (Dars26 dan tashqari).

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

**Б3 TO'LIQ = Dars13–18. Dars19–24 (bo'lish: ma'no + ×↔÷ + ÷2/3 + ÷4/5 + ÷6–9 + masalalar) qurildi** (program d.22–27),
build-green, UNCOMMITTED. **Metodist qarori (2026-07-16): Б4 ga +1 kontent dars — Dars25 «takroriy ayirish»** (program d.28
slotи, ПК4 emas), BOSHQA CHATDA quriladi (spec §6). Keyingisi: **Dars25 = Б4 takroriy ayirish**, keyin **Dars26 = Б5 geometriya boshi**
(chiziq/kesma/nur, program d.29). Fayl↔program ofseti: fayl DarsN = program d.(N+3) Б4 ичida.

**Repo:** `theIneuron/MatematikaLesson`, `main` branch. Barcha Dars13–18 push qilingan. Preview:
`matematika-lesson.vercel.app` → 2-sinf → tegishli dars. Har dars `FREE_NAV=true` (preview; push oldidan
`false` qilinishi kerak, ~57-satr `const FREE_NAV = true;`).

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

**Keyingi: Dars31 = Б5 YAKUNI «Takrorlash + ПК5»** (program d.34, Uran). Butun geometriyani puxtalaydi:
chiziq turlari (uch soni) + ko'pburchaklar (tomon soni) + sm/dm/m + perimetr + yasash.
- **Klon-baza:** Dars30 (unda `GeoFig`/`RectBuildStage`/`PickStage` bor) yoki Dars29 (`PerimStage` geo/sum).
- **Mexanika:** aralash-takrorlash — har mavzudan 2–3 round (LineType/PolyType/Len/Perim/Build meros). Yangi mexanika
  SHART EMAS; odatdagidek AVVAL metodist bilan kelish (§3).
- **Ko'lam:** **yuza (площадь) YO'Q** — Б5 da faqat perimetr (SYUJET §Б5 d.29–34). Bu qat'iy.
- **s15 → Б6 NEPTUN** (d.35+: ifoda, tenglama, ulush, vaqt, data).

### Б5 URAN — NIMA QURILDI (Dars26–30, hammasi PUSHED)

| dars | mexanika (live komponentlar) |
|---|---|
| 26 | `LineFig` (3D sterjen+konus-strelka+shar-uch) · `RealObj` hayotiy langar: **ufq chizig'i**=0 uch, **fonar**=1 uch, **qalam**=2 uch · `LineTypeStage` (ask: type/count) |
| 27 | `PolyFig` (3D plastina, sides=0 doira / −1 ochiq) · `PolyTypeStage` (name/count/ispoly) · `PolyMatchStage` (elastik-sim DRAG shakl→nom, Dars20 meros) |
| 28 | `Ruler` (chizg'ich+detal) · `ObjIcon` (qalam/parta/modul) · `ConvertViz` · `LenStage` (mode: ruler/unit/convert) |
| 29 | `GeoFig` (geoboard, **TEKIS**) · `SumFig` (raqamlangan tomonlar, **TEKIS**) · `PerimStage` (mode: geo/sum) |
| 30 | `RectBuildStage` (eni/bo'yi **stepper** + «Tekshir» o'zi bosadi) · `PickStage` (o'lchamga mos shaklni tanlash) · `GeoFig filled` |

**Umumiy sahna (Dars26–30 da BIR XIL):** `UranBase` — Uran yo'ldoshi. Metodist iteratsiyalari: `IceRidge` (orqa fonda
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

**⚠️ Dars26–30 PROKLIKLANMAGAN** (Dars26 dan tashqari) — yangi sessiyada avval shularni tekshirish tavsiya etiladi.

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
