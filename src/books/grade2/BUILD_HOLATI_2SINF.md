# 2-SINF — BUILD HOLATI VA HANDOFF (boshqa kompyuterga o'tish uchun)

> **Maqsad:** ishni boshqa kompyuterda davom ettirish. Bu fayl git orqali ko'chadi.
> Lokal xotira (`C:\Users\...\.claude\...\MEMORY.md`) YANGI mashinaga o'tmaydi — shuning uchun
> butun kontekst shu yerda jamlangan. Yangilash: har dars tugagach shu faylni ham yangilab bor.
>
> Oxirgi yangilanish: 2026-07-15.

---

## 0. TEZKOR HOLAT

**2-sinf NAZARIY darslar (`src/lessons/grade2.js` → `grade2Nazariy`):**

| # | Slug / fayl | Mavzu | Holat |
|---|---|---|---|
| 01 | Dars01 | O'nliklar va birliklar | ✅ etalon (build+test) |
| 02 | Dars02 | Sonlarni o'qish/yozish | ✅ |
| 03 | Dars03 | Razryad tarkibi | ✅ |
| 04 | Dars04 | Sonlarni taqqoslash | ✅ |
| 05 | Dars05 | O'nlab sanash | ✅ |
| 06 | Dars06 | Son o'qi | ✅ (Б1 tugadi) |
| 07 | Dars07 | Qo'shish (o'tishsiz) | ⚠️ build green, **prokliklab-test kutmoqda** |
| 08 | Dars08 | Ayirish (o'tishsiz) | ⚠️ build green, prokliklab-test kutmoqda |
| 09 | Dars09 | Qo'shish (o'tishli / carry) | ⚠️ build green, prokliklab-test kutmoqda |
| 10 | Dars10 | Ayirish (o'tishli / borrow) | ⚠️ build green, prokliklab-test kutmoqda |
| 11 | Dars11 | Столбik (tuzish / tekislash) | ⚠️ build green, **YANGI mexanika — jonli test SHART** |

**Б2 (Mars) arifmetikasi = Dars07–11 QURILDI.** Keyingisi: **Dars12 «Ikki amalli masala»**.

**Har birida ochiq ish (push oldidan):**
- `FREE_NAV = true` → `false` ga qaytarish (Dars07–11 hammasida `const FREE_NAV = true;`, ~65-satr).
- Barcha yangi darslarni **prokliklab-test** qilish (ovoz + interaktiv + mobil).
- UZ atamalari **draft** — o'zbek metodist-matematik validatsiyasi kerak (masalan «bir dilda», «qarz», son-nomlari).

---

## 1. ARXITEKTURA — YANGI DARS QANDAY QURILADI

**Har dars = bitta katta `.jsx` (`src/components/grade2/DarsNN.jsx`, ~6500 satr).**
Infra (AudioEngine, useAudio, Stage, QuestionScreen, LangContext, CSS, sticky-nav,
веди-до-верного) — **Dars01 etalonidan bayt-aniq**, o'zgarmaydi.

**Klon-usuli (Dars07–11 shunday qurildi):**
1. `cp Dars07.jsx DarsNN.jsx` (Dars07 = eng toza «столбик» bazasi: RazryadBreak +
   MarsCargoDone + ColumnCard + DropColumnStage bor).
2. `LESSON_META` (lessonId, title RU+UZ) + fayl boshidagi `// ░░ ... ░░` sarlavha kommenti.
3. `CONTENT` obyektini ekran-ekran qayta yozish (s0…s15). RU + UZ to'liq.
4. Vizual/mexanika komponentlarini moslash (pastda).
5. `MarsBase` (s0 sahna) + `Screen0` javob raqami + `MarsCargoDone` (s15) natija raqami.
6. `BRIDGES`, `S15_PAYOFF` — amalga mos.
7. `src/lessons/grade2.js` `grade2Nazariy` ga ro'yxatga qo'shish.
8. `npm run build` (yashil) + eslint (**err=86, warn=2** — barcha darslarda bir xil; oshsa yangi muammo).

**CONTENT ekran tuzilishi (15 ekran, TOTAL_SCREENS=15):**
- s0 hook (MarsBase sahna + MC, distractor = aynan misconception).
- s1 «NEGA ustunlab» (RazryadBreak — razryadga ajratish, Dars03 ga bog').
- s2 ishlab ko'rsatish (worked, **4 audio segment** — Screen2 step>=3 da `done`).
- s3 QOIDA + tekshiruv (**5 audio segment**, MC check).
- s4 yana misol + ogohlantirish + tekshiruv (**4 audio segment**, MC check).
- s5, s6 mashq (single — drag/place).
- s7–s11 mashq (`rounds: [...]` — 3 tadan misol).
- s12 masala-konteksti (Anvar) + s13 masala-savol (DCase).
- s14 final (rounds + FactCard).
- s15 xulosa (MarsCargoDone sahna + QOIDA recap + conn_refs/conn_next).

---

## 2. VIZUAL/MEXANIKA KOMPONENTLARI (столбик oilasi)

**`ColumnCard`** — umumiy столбик maketi (grid). Har dars uni o'z ehtiyojiga moslaydi:
- **Dars07/08 (o'tishsiz):** oddiy, operator `+`/`−`.
- **Dars09 (carry):** `carry` prop → o'nlik ustida amber «1» (fade-up), row-2 carry qatori.
- **Dars10 (borrow):** `borrow` prop → o'nlik ustida amber (at-1) + birlik ustida «1» + minuend o'nligi `line-through`.
- **Dars11 (tuzish):** `sign` prop ('+'/'−'), `bTensNode`/`bUnitsNode` (B-qatoriga slot),
  bt/bu null→bo'sh (bir xonali son).

**Amal-vizuali (statik, tushuntirish uchun):** `ColumnAdd`(07) / `ColumnSub`(08) /
`ColumnAddCarry`(09) / `ColumnSubBorrow`(10) / `ColumnOp`(11).

**Mashq-mexanikasi:**
- **`DropColumnStage`** (07–10): o'quvchi NATIJA raqamlarini bo'sh natija-slotlariga sudraydi;
  reveal — bosqichli hisob-kitob animatsiyasi (carry/borrow bilan). Drag: pointer-capture +
  hit-test (`onDown/onMove/onUp`), tap-fallback.
- **`AlignStage`** (11, YANGI): o'quvchi IKKINCHI sonni to'g'ri USTUNGA qo'yadi (birlik ostiga
  birlik). Bir xonali → birlik ustuniga (o'nlik slot bo'sh). To'g'ri qo'yilsa javob avto ochiladi.
  eval: `usedIds.length===tileCount`. (DropColumnStage drag plumbing'ini qayta ishlatadi.)

**`RazryadBreak`** (s1) — sonni razryadga ajratadi (34=30+4), o'nlik sariq #FF4F28 / birlik ko'k #019ACB.

**Sahna komponentlari (Dars07 da yaratilgan, hammaga meros):**
- `MarsBase` (s0) — Mars sirti + qo'ngan raketa (`LandedRocket`) + yuk bazasi (`CargoBase`) +
  ikki konteyner (`CargoCrate`) + «?»→javob pufakchasi + Bit. Kraterlar/rover/oylar.
- `MarsCargoDone` (s15) — «yuk sanaldi» xulosa sahnasi: baza + kema + yashil natija tablosi (`total` + ✓).
  (Eski `MarsApproach` = «kemaning Marsga yaqinlashishi» — Б2 uchun MANTIQSIZ, olib tashlangan.)

**Ranglar:** o'nlik = `#FF4F28` (sariq/qizil), birlik = `#019ACB` (ko'k), carry/borrow = `#E8891C` (amber),
to'g'ri = `T.success` (yashil).

**O'lik kod:** har DarsNN da Dars02/07 nasl-nasabidan qolgan ishlatilmaydigan komponentlar bor
(Screen5 HatchDoor, Screen6 NumberLineAnim, Screen10/11/14, MCStage, BuildStage, OmborRaf, CodeTablo…).
`screens` massivida YO'Q → render bo'lmaydi, xavfsiz. eslint no-unused-vars ko'p (~69) — shulardan.
**Tegmang** (err=86 baseline shundan).

---

## 3. GOTCHALAR (xato qilmaslik uchun)

1. **`lead` maydoni alohida.** DropColumnStage/AlignStage ekran sarlavhasi = `c.lead || cur.q`.
   Amalni o'girganda `a/b/q/audio` bilan birga HAR ekranning `lead` ini ham tekshir
   (Dars10 da s5/s6 `lead: «Сложи столбиком»` qolib ketgan edi — metodist topdi).
2. **`useMemo` YO'Q import.** Import qatori: `useState, useEffect, useRef, useCallback, createContext, useContext`.
   `React.useMemo` ishlat (bare `useMemo` crash beradi).
3. **Audio segment soni MUHIM.** Screen2 = 4 segment (step>=3 da `done`, sum ochiladi),
   Screen3 = 5 segment, Screen4 = 4 segment. Kam bersang — javob ochilmaydi / gate ochilmaydi.
4. **Guillemet `«»` — faqat KO'RINADIGAN matnda** (rule, fact_text). **AUDIO segmentlarда YO'Q**
   (TTS-toza qoida). Audio'da sonlar so'z bilan, matematik belgilar yo'q.
5. **Register:** RU `ты` (informal), UZ `siz` (formal). Ismlar o'zbekcha. Apostrof — oddiy `'`.
6. **JS string ichida UZ matn — ikki tirnoq yoki backtick** (bitta tirnoq emas, `O'` bor).
7. **Distractor = aynan misconception.** Har hookда noto'g'ri javob bola tez-tez qiladigan
   xato bo'lsin (07: 59/95 raqam-almash; 09: 62/52 carry-unutish; 10: 25/35 kichikdan-katta;
   11: 55/82 misalignment).
8. **o'tishsiz/o'tishli tekshiruvi:** Dars09 (carry) — birlik ≥10, tens+carry≤9, natija≤99;
   Dars10 (borrow) — birlik au<bu, at-1≥bt; Dars11 (tekislash) — hammasi o'tishsiz (fokus tekislashда).

---

## 4. SYUJET / METODIKA (o'zgarmas kontrakt)

- **`SYUJET_2SINF.md`** — «Bitni uyiga kuzatish»: Yer→Mars→Yupiter→Saturn→Uran→Neptun→Bit uyi.
  Б1 = ochiq koinot (nomerlash, d1–7), **Б2 = MARS (100 ichida amallar, d8–14)**, Б3 = Yupiter (ko'paytirish)…
- **`ETALON_2SINF.md`** — dizayn/spec §11 (accordion, place-value, dual-coding, QOIDA card…).
- **`2sinf_metodologiya.md`** — `[[grade2-explain-not-game]]`: har dars mavzuни OCHIQ tushuntiradi +
  ko'rinadigan QOIDA beradi; o'yin — tushuntirishga xizmat qiladi, uni almashtirmaydi.
- Bit — kapitan+diktor (**ayol ovoz**). Ekipaj: Ra'no, Anvar, Zuhra, Jasur.

---

## 5. KEYINGI ISHLAR

**Ketma-ket (theory-fayl raqami, program ПК/ИК dan ajratilgan):**
- **Dars12 «Ikki amalli masala»** — 2 qadamli matnli masala (Mars davom).
- Dars13 Ko'paytirish ma'nosi (Б3 Yupiter boshlanadi — yangi sahna + teng guruhlar mexanikasi).
- … `SYUJET_2SINF.md` §3 bo'yicha.

**Har dars uchun:** avval MEXANIKANI tanla (metodist), keyin qur (Dars03–11 shunday — mexanika
metodist qaroriga ko'ra). Batafsil qadam — §1.

---

## 6. KOMANDALAR

```bash
npm run build                                   # yashil bo'lishi shart
npx eslint --format json src/components/grade2/DarsNN.jsx   # err=86, warn=2 (baseline)
```

Encoding: UTF-8. Preview — `SETUP.md` (lokal server; Notion MCP QA uchun kerak — hozir ulanmagan).
