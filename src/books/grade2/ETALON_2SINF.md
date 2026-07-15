# 2-SINF ETALONI — kod + dizayn kontrakti

> **Dars01 («O'nliklar va birliklar») — 2-sinf darslarining rasmiy etaloni.** Har yangi
> 2-sinf darsi shu kontraktga va Dars01 naqshlariga to'liq mos qilib yaratiladi (1-sinf
> `ETALON_1SINF.md` ning 2-sinf muqobili). "Taxminan o'xshash" emas — **bir xil standart**.
>
> **MUHIM (metodist 2026-07-14):** pilot Dars01 chiqarilib, boyitilib **rasmiy etalon qilindi**.
> Jonli `src/components/grade2/Dars01.jsx` — **kod-haqiqat manbai**. Sessiyada qo'shilgan yangi
> majburiy naqshlar **§11** da qulflangan (akkordeon-stepper, place-value mat, dual-coding,
> QOIDA-karta, matematik qoidalar, recall→mashq, summary kema-sahnasi). §11 ziddiyatда §3 ni
> aniqlashtiradi.
>
> Metodika: `2sinf_metodologiya.md`. Hikoya: `SYUJET_2SINF.md`. Dizayn arxitekturasi
> (o'zgarmaydi): `DIZAYN_STANDART_1SINF.md` (Stage/palitra/keep-visible/ovoz). Bu hujjat —
> 2-sinfga xos **deltalar** + ikki bo'lim (nazariy+amaliy) kod-kontrakti.

---

## 0. BIRINCHI QADAM — PERSONAJ ISMLARINI TASDIQLASH

Har dars boshida metodistdan tasdiqlash: ushbu darsda qaysi personajlar? Doimiy cast —
**Ra'no, Anvar, Zuhra, Jasur** (+ Bit diktor), `SYUJET_2SINF.md` §2. Masala qahramoni
(one-off) — o'zbekcha yangi ism. **Yangi doimiy personaj** kerak bo'lsa — metodistdan ism
so' raladi, keyin SVG mavjudlari uslubida chiziladi. O'zboshimchalik bilan qo'shilmaydi.

---

## 1. IKKI DELIVERABLE — NAZARIY + AMALIY

Har mavzu **ikki fayl** beradi (site drill-down: `nazariy` 📘 / `amaliy` ✏️):

| Bo'lim | Fayl | Format | Ovoz | Host |
|---|---|---|---|---|
| **Nazariy** | `src/components/grade2/DarsNN.jsx` | To'liq Stage-dars (standalone, infra ичida) | v5.2 **ayol** (g=f) | `LessonPage` (propssiz preview) |
| **Amaliy** | `src/components/grade2/practice/AmaliyotNN.jsx` | jsx-question (1 mashq/fayl) | **ovozsiz** (beep) | `PracticeHost` (mock) |

Nazariy = o'rgatish (12–13 min, chuqur tushuntirish). Amaliy = mustahkamlash (typingsiz
mashqlar; yangi kontsept KIRITMAYDI). Ikkalasi registry orqali ulanadi (§9).

---

## 2. NAZARIY DARS — KOD KONTRAKTI

**Bitta o'zini-o'zi ta'minlovchi `.jsx`** (~3500–4200 qator). Infra fayl ичida
**bayt-aniq ko'chiriladi**.

**2.1. Infra manbasi (bayt-aniq).** Grade1 **`Dars28.jsx`** — infra etaloni
(mobil-moslash + keep-visible + MATH v1.2, xotira: infra-v1_2-dars28-components):
`AudioEngine` (v5.2, `setGender`, `buildTtsUrl(base,text,gender)`), `useAudio`,
`makeAudioSegments`, `useCanAnswer`, `useAdvanceGate`, `useSfx`/`playChime`,
`AudioIndicator`, `FeedbackBlock`, `Stage`, `NavBack`/`NavNext`, `QuestionScreen`
(keep-visible, `titleNode`+`question`, `factOnCorrect`, `AnsPop`), `useIsMobile`/
`useMobileZoom`/`useRevealScroll`, `STYLES` (bazaviy CSS + reduced-motion). **`lessonRuntime.js`
dan ko'chirilmaydi** (u eski shim, ishlatilmaydi).

**2.2. Personaj/sahna manbasi.** `RanoSVG`/`AnvarSVG`/`BitSVG` — grade1 `Dars01.jsx`;
`ZuhraSVG` — `Dars03.jsx`; `JasurSVG` — `Dars13.jsx`. `SceneBg` (room/door) + yangi
zonalar (maktab/bozor/bog'/qurilish) shu masshtab/uslub qoidasi bilan (SYUJET §4).

**2.3. TTS = v5.2, ayol ovoz.** `voiceGender` default `'f'`; `configureLesson({...,
voiceGender: voiceGender||'f'})`; engine `this.gender='f'`. Til — server aniqlaydi
(kirill=ru, lotin=uz), URL'da `lang` yo'q. ElevenLabs markerlari YO'Q.

**2.4. Stage layout (o'zgarmaydi).** `max-width:936px`, `100dvh`, **skrollsiz** (yagona
`scrollIntoView` = FeedbackBlock); sticky tugmalar flex+100dvh; `idx={screen}` (literal
raqam TAQIQ). Eyebrow chip + progress + audio-indikator + `NN/NN`. Katta in-content
sarlavha YO'Q; top-anchor (markazlamaslik). Keep-visible MC (§DIZAYN_STANDART §7).

**2.5. MOBIL_DESKTOP_MOSLASH — MAJBURIY.** Har Dars faylida `src/books/MOBIL_DESKTOP_MOSLASH.md`
naqshi: `≥640px` — o'zgarmaydi (936px markaz); `<640px` — butun dars **390px etalon
kenglikda** `zoom` bilan fotografik masshtablanadi + paydo bo'lgan kontentga avtoskroll.
QA faqat 390px da. Etalon: Dars28. **Bu band QA'da tekshiriladi.**

**2.6. FREE_NAV.** Yaratish/test paytida `true`; **push oldidan `false`** (audio tugamaguncha
"Davom" ochilmaydi). Push'da birorta `true` qolmasin.

**2.7. payload (`onFinished`).** lessonId, lessonTitle, durationSec, totalQuestions,
correctAnswers, scorePercent, finalScore, finalTotal, passed, answers.

---

## 3. NAZARIY — EKRAN TUZILISHI VA VAQT-BUDJET

**Kamida 15 ekran, kamida 15 minut** (faqat nazariy). `2sinf_metodologiya.md` §6.1 budjeti:

| Faza | Ekran | ~vaqt | scope |
|---|---|---|---|
| Hook (s0, jonli animatsiya) | 1 | ~0.8 | hook |
| Prerekvizit-recall (mikro-savol) | 1 | ~0.7 | null |
| **Chuqur ochilish** (concrete, ≥3 tasvir/qadam) | 5 | **~6** | null |
| Qoida (hookга qaytadi) | 1 | ~1 | null |
| Boshqariladigan mashq (scored) | 4 | ~4 | practice |
| Hayotiy masala | 2 | ~1.5 | null/practice |
| Final test | 1 | ~0.8 | final |
| Yakun (can-do + ConnectionsBlock) | 1 | ~0.7 | final |

**Baholash:** веди-до-верного har scored'да; firstTry LMS'ga, o'quvchiga ko'rsatilmaydi;
scored ~4–5 practice + 1 final. Slayd sonini test bilan EMAS, **chuqur ochilish** (5 ekran)
bilan oshiramiz — **chuqurlik > test** (§6.2).

**"Yaxshi tushuntirish" (QA band, §6.2):** (1) asosiy kontsept **≥2 faol ochilish** ekrani —
bola o'zi suradi/quradi (passiv avto-reveal TAQIQ); (2) **≥2 tasvir** (o'nlik: dasta-tayoqcha
+ razryad kartasi + son o'qi); (3) qoida hookга qaytadi; (4) ovoz tushuntirishni ko'taradi,
vizualni takrorlamaydi.

**Faza chegaralarida bridge** — qisqa ↳ ulovchi qator (ekran) + audio-intro boshiga qo'shiladi
(§4-A linker: "Buni ko'rdik — endi…").

---

## 4. AMALIY MASHQ — jsx-question KONTRAKTI

**Bitta mashq/fayl** (~120–160 qator), `src/components/grade2/practice/AmaliyotNN.jsx`.
Namuna: grade1 `practice/Amaliyot01.jsx`. Spec: `src/components/grade5/practice/jsx-question-contract.md`.

- `export default function` — proplar: `{ lang, mode, initialAnswer, playCorrect, playWrong,
  onReady, registerCheck, onSubmit, studentName }`.
- **O'z "Tekshirish" tugmasi YO'Q** — host beradi. `onReady(bool)` (javob tanlanганда),
  `registerCheck(fn)` (bir marta), `fn` ichida `onSubmit(result)`.
- **Ovoz YO'Q** (host beep cue). CSS-in-JS ich fayl (scoped `.aqNN`), animatsiyali,
  **tap/drag mexanika** (typingsiz).
- `onSubmit` natijasi o'zini tavsiflaydi: `{ questionText, options, studentAnswer,
  correctAnswer, correct, meta:{ tag, level, block, ptype } }`.
- UZ+RU to'liq; `siz`/SOV; xato-feedback **usulni ko'rsatadi, sonni bermaydi**.
- Preview: `PracticeHost` (UZ/RU chip, native Tekshirish/Qayta tugma). Prod: platforma host.
- Amaliy = nazariy mavzuning **1 mexanikasi** (mustahkamlash), yangi kontsept EMAS.

> **Amaliy vizual palitra:** mavjud practice-bank uslubi (ko'k `#2563eb` aksent, kattaroq
> tegish maydonlari — 7–8 yosh). Nazariy T-palitradan (aksent `#FF4F28`) farq qiladi —
> bu practice-bank konvensiyasi (grade1 amaliyot bilan bir xil).

---

## 5. SAVOL TURLARI — TAP-FIRST, TYPINGSIZ

`DIZAYN_STANDART_1SINF.md` §11–12 palitrasi 2-sinfda ham amal qiladi (typing yo'q, §9
metodologiya). Asosiy turlar: **MC bitta to'g'ri** (2×2, `shuffleMC` majburiy, `wrong_N`
hint), **Ha/Yo'q**, **drag-and-drop** (juftlash/savatlarga tasnif/tartiblash), **tap-to-shade**
(sanash), **toifalarga ajratish**, slayder/number-line (snap). Raqamli javob — **bosiladigan
raqam-plita** (NumInput typing EMAS). **Столбik — tap-plita** (raqamni katakka bosib/surib,
klaviaturasiz). Bir darsда turlarni almashtirib ishlat.

---

## 6. GRADE1'DAN DELTALAR (2-sinfga xos)

1. **≥15 min / ≥15 ekran** (1-sinf 8–12 edi); slayd sonini chuqur ochilish bilan oshiramiz,
   test bilan emas (chuqurlik > test).
2. **Столбik paydo bo'ladi** — tap-plita, razryad bloklaridan keyin (concrete-avval).
3. **Ko'paytirish = teng guruhlar/массив**; **bo'lish = ulashish + ×↔÷ oila**. Yangi
   vizualizatorlar: guruh/qator massivi, teng-ulash animatsiyasi.
4. **Доли = teng bo'laklar** (buklab), kasr belgisi EMAS.
5. **Bar model YO'Q** (3-sinf) — qism-butun concrete + razryad + guruh + son o'qi.
6. **Ikki bo'lim** (nazariy+amaliy alohida fayl) — drilling amaliyga ko'chadi.
7. Matn biroz uzunroq bo'lishi mumkin (1 qo'shimcha yozma tayanch), lekin ovoz hali asosiy.

---

## 7. AUDIO + REGISTER (o'zgarmaydi, deltalari bilan)

- **TTS-toza:** sonlar so'z bilan; `× ÷ = + − < > % /`, «», uzun tire, ikki nuqta+ro'yxat
  TAQIQ; bir segment = bir fikr; ovozlanadigan `wrong_N`/`hint`/`on_wrong` da yakuniy son
  YO'Q (faqat metod). 2-sinf o'qilishi: `×`="marta"/"ko'paytiramiz", `÷`="ga bo'lamiz"/"teng
  bo'lamiz", столбik="xona ostiga xona".
- **Register:** RU `ты`; UZ `siz` (-ng/-ing; sen-imperativ TAQIQ). Apostrof oddiy `'`.
  UZ-stringlar JS'da qo'shtirnoq/backtick. Bit murojaati yakka.
- **Til to'liqligi:** har ko'rinadigan/aytiladigan maydonda `ru` VA `uz` (fallback orqali
  til aralashmasin); massivlar bir xil uzunlikda.

---

## 8. FAYL JOYLASHUVI VA REGISTRY

- Nazariy: `src/components/grade2/DarsNN.jsx`.
- Amaliy: `src/components/grade2/practice/AmaliyotNN.jsx` + `PracticeHost.jsx`
  (grade1 practice/PracticeHost dan ko'chiriladi).
- Registry: **`src/lessons/grade2.js`** — `export const grade2Nazariy = [...]`,
  `export const grade2Amaliy = [...]` (grade1.js kabi lazy import, slug/title/desc).
- Ulash: `src/lessons/index.js` REGISTRY'ga
  `'2-sinf': { matematika: { nazariy: grade2Nazariy, amaliy: grade2Amaliy } }`.
- URL: `/2-sinf/matematika/nazariy/<slug>` va `/…/amaliy/<slug>`.
- Manba: darslik `src/books/grade2/Matematika 2 sinf UZ.pdf`; reja `DARSLAR_REJASI_1-11.md`.

---

## 9. PIPELINE (har dars uchun)

`[0]` personaj tasdig'i → `[1]` skeleton (ekranlar, tip, misconception, savol turi) →
`[2]` content (RU+UZ+audio, vaqt-budjetга mos) → `[3]` jsx (infra Dars28'dan bayt-aniq +
personaj/sahna + MOBIL_DESKTOP_MOSLASH) → `[4]` qa → amaliy uchun: jsx-question + PracticeHost
preview. Har bosqichда metodist tasdig'i; bosqich tashlab o'tilmaydi.

---

## 10. PRODUCTION / QA

- `FREE_NAV = false` (prod); mobil QA **390px** da (MOBIL_DESKTOP_MOSLASH).
- `npm run build` yashil; qa-validator: audio-tozalik, UZ-register, keep-visible,
  веди-до-верного, scroll'siz, ≥2 ochilish + ≥2 tasvir (§6.2), scope-ичida sonlar,
  MOBIL_DESKTOP_MOSLASH mavjudligi.
- Web Speech — faqat preview; prod LMS TTS (ayol).

---

## 11. PILOT DARS01 — QULFLANGAN YANGI STANDART (metodist 2026-07-14)

> Pilot Dars01 boyitilib **rasmiy etalon qilindi** (§200). Jonli `Dars01.jsx` — kod-haqiqat
> manbai. Quyidagi naqshlar har 2-sinf darsida **majburiy**. Ziddiyatда bu bo'lim §3 ni
> aniqlashtiradi.

**11.1. Tushuntirish = akkordeon-stepper (progressive disclosure / «svyortka»).** Chuqur konsept
ekрани bir necha qadamга bo'linadi: faol qadam fokusда to'liq tushuntiriladi, tugagani **tepага
ixcham ✓-chip** bo'lib yig'iladi (skrollsiz). «Keyingi» tugmasi ovoz tugagach ochiladi. Bir slaydда
ko'p + aniq tushuntirish, ammo skroll YO'Q. (Dars01 s5: `NumberLine`/`RazryadTable`/step-viz.)

**11.2. Place-value mat (3 qatorli) + izchil rang-kod.** Har razryad ustuni: **yorliq → raqam →
konkret buyum** ustma-ust (`RazryadTable concrete`). Rang-kod butun dars bo'yi bir xil:
**o'nlik = `#FF4F28` (sariq), birlik = `#019ACB` (ko'k)**; xato = qizil `#D64545` (sariq EMAS).
Konkret buyumlar `g1-pop-in` bilan paydo bo'ladi. Mat s3/s4/s5 da bir xil.

**11.3. Dual-coding — ovoz↔vizual sinxron.** `audio.currentSegment` bilan gapga mos razryad/raqam/
ustun yonadi (opacity/scale), boshqasi so'nadi (ustoz doskада ko'rsatgandek). Konsept ekрани
segment-ma-segment vizual bilan sinxronlanadi. (Dars01 s5/s7 `emph`.)

**11.4. QOIDA — aniq aksent.** Qoida oddiy qator EMAS: **belgili karta** («QOIDA»/«ПРАВИЛО» pill,
aksent ramka, iliq fon), matn ичида kalit so'zlar rang-kodli; ovoz «mana qoida» deganда karta
pulse qiladi. Qoidадан keyin **faol farqlash-check** (yangi songa qo'llash), «Davom» shунга bog'lanadi.

**11.5. Matematik qoidalar tushuntirishга (grade-2 doirasida, `×` yo'q).** Konsept ekранлари
quyidagilarни qamraydi: **nol — o'rin belgisi** (`30 = 3 o'nlik 0 birlik`, `30≠3`); **yonma-yon ≠
qo'shish** (`34≠3+4`); **son o'qi** (`34` = 3 o'nlik-sakrash + 4 birlik-qadam); **yozuv↔nom↔razryad**
uch bog'lanishi. Har biri chuqur ochilishда faol ko'rsatiladi.

**11.6. Struktura — 7 tushuntirish / 6 mashq / final / summary.** Prerekvizit-recall tushuntirishдан
**mashq blokiga** ko'chdi (razryad-tekshiruv, scored). Demak 15 ekran: **1** hook+mavzu · **2–6**
chuqur ochilish (kamida biri akkordeon-stepper) · **7** qoida | **8–13** mashq (recall shu yerда) |
**14** final | **15** summary. (§3 budjeti shунга yangilanди.)

**11.7. Summary — ConnectionsBlock O'RNIGA to'liq-kenglik kema-sahna.** Metodist qarori: summary'да
**ConnectionsBlock olib tashlandi**. O'rnida: tepада ixcham miltirovchi yulduzlar (twinkle) + can-do +
**to'liq-kenglik `d2-scene`** kema-devori (`S15Walls`: qovurg'a/parchin/boshqaruv paneli/tutqich/
panjara-pol) + markazда **warp-porthole** (ichki panelsiz — devor foni bilan bir xil rangда) +
suzuvchi yuk (chap/o'ng zonalar) + nafas oluvchi nur (pulse). O'tgan/kelgan darsга bog'lanish istalса —
yengil bitta qатор bilan qайтарилиши mumkin (metodist qaroriga ko'ra), ammo default YO'Q.

**11.8. Mavzu e'loni (kanonik).** s0 da Bit avval mavzuni aytади («Bugungi mavzu: …») + ekранда
`topic`-chip, keyin missiya-hook (kashfiyot yoyи saqlanadi).

**11.9. RU-registr — jinssiz.** RU'да o'quvchiga murojaatда jins bilinмайдиган shakl kerak
(erkak/ayol o'tgan zamon fe'l TAQIQ — masalan «ты забыл»/«ты помог» EMAS). Buyruq (`не забудь`)
yoki jinssiz qayta yozuv. UZ `siz` — o'zgarmaydi.

---

*Etalon o'zgarishi — alohida protsedura (metodist/Fuzayl orqali), navbatdagi darsning yon
ta'siri sifatida emas. §11 — pilot Dars01 ni etalon qilish qarori (metodist 2026-07-14).*
