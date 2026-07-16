# 2-SINF — BUILD HOLATI VA HANDOFF (boshqa kompyuterga / yangi sessiyaga o'tish uchun)

> **Maqsad:** ishni boshqa mashina yoki yangi sessiyada davom ettirish. Bu fayl git orqali ko'chadi.
> Lokal xotira (`C:\Users\...\.claude\...\MEMORY.md`) YANGI mashinaga o'tmaydi — shuning uchun butun
> kontekst shu yerda jamlangan. Yangilash: har dars tugagach shu faylni ham yangilab bor.
>
> Oxirgi yangilanish: **2026-07-16** (Dars18 gacha, Б3 tugadi).

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

**Б3 (Ko'paytirish jadvali) TO'LIQ QURILDI = Dars13–18.** Keyingisi: **Dars19 = Б4 «Bo'lish» boshi** (program d.22).

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

**Keyingi:** **Dars19 = Б4 «Bo'lish ma'nosi»** (program d.22 — kritik tugun). Metodologiya (`2sinf_metodologiya.md`):
ikki ma'no (teng ulashish + guruhlarga bo'lish), ×↔÷ oilasi (`3×4=12 → 12÷3=4, 12÷4=3`). **Yangi mexanika
kerak — boshlashdan oldin metodist bilan kelish.** Sahna: Б4 biom (SYUJET §3). d.20=Dars18 (mustahkamlash),
d.21=takror+ПК3 (nazariy fayl bermasligi mumkin — metodist bilan aniqla).

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
