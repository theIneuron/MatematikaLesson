# UNIVERSAL PROMPT — YANGI MATEMATIKA DARSINI YARATISH

> **Qanday ishlatiladi:** quyidagi `0-BO'LIM`dagi kvadrat qavslarni to'ldiring va shu faylning
> TO'LIQ matnini yangi Claude Code sessiyasiga yuboring (yoki "PROMPT_YANGI_DARS.md ni o'qib,
> 0-bo'limdagi ma'lumotlar bilan dars yarat" deb yozing). Prompt CoddyCamp / Junior IT Academy
> 5-sinf matematika darslari pipeline'iga mos, mavjud 16 ta dars tahlilidan chiqarilgan
> BARCHA standartlarni o'z ichiga oladi.

---

## 0. KIRITILADIGAN MA'LUMOTLAR (metodist to'ldiradi)

```
Dars ID:            frac_5_13 (program Блок 5.1, Смешанные числа)
Fayl:               Dars18.jsx (navbatdagi DarsNN — «Урок 18»)
Mavzu (ru):         Правильные, неправильные, смешанные числа
Mavzu (uz):         To'g'ri, noto'g'ri va aralash sonlar
Maqsad:             O'quvchi to'g'ri va noto'g'ri kasrni farqlaydi; aralash sonni
                    "butun + kasr" sifatida tushunadi.
                    (ru: различать правильные и неправильные дроби, понимать смешанное
                    число как «целое + дробь».)
Prerekvizitlar:     frac_5_01…frac_5_03 (kasr tushunchasi: part-of-whole, son o'qida,
                    bo'lish natijasi), frac_5_11 (kasrlarni taqqoslash)
Misconceptionlar:   1) "noto'g'ri kasr — bu xato" (surat >= maxraj bo'lsa ham — to'liq haqiqiy son);
                    2) "aralash son — bu butunni kasrga KO'PAYTIRISH" (aslida butun + kasr QO'SHUV)
Vizualizator g'oyasi: [bo'sh — Claude skelet bosqichida 2-3 variant taklif qiladi.
                    Dastur yo'nalishi: 1 dan tashqaridagi son o'qi + bir nechta butunli bar-model.]
Hook uslubi:        [bo'sh — Claude taklif qiladi. Eslatma: oldingi Block 4 darslari
                    ko'p "qahramon xatosi/taqqoslov" hook ishlatdi → bu yerda "nega/nima uchun"
                    konseptual hook tabiiyroq bo'lishi mumkin.]
```

Agar dars `src/program_grade5.md` dasturida bo'lsa — maqsad, prerekvizit va misconceptionlarni
o'sha fayldan ol va metodistga ko'rsat. Dastur — ildiz shartnoma.

---

## 1. ROL VA ISH TARTIBI

Sen — CoddyCamp matematika darslari pipeline'idagi ishlab chiqaruvchi vositasan. Yakuniy
foydalanuvchi — O'zbekistondagi 5-sinf o'quvchisi; xato narxi — bolada noto'g'ri matematik
model shakllanishi. "MVP, keyin tuzatamiz" rejimi YO'Q — har dars bir xil standartda chiqadi.

**Bosqichma-bosqich ishla, har bosqichda metodist tasdig'ini kut:**

1. **SKELET** — ekranlar ro'yxati (id, tip, qisqa mazmun, test ekranlariga misconception va
   har variantga noto'g'ri-javob izohi). Shu bosqichda AskUserQuestion bilan taklif qil va
   tasdiqsiz qurma: (a) vizualizator + hook uslubi (2-3 variant, animatsiyalar bilan);
   (b) 2-3 ta qiziqarli fakt mavzusi va ular qaysi ekranlarga qo'yilishi (5-A bo'lim);
   (c) har test ekrani uchun savol turi — 3-bo'limdagi PALITRADAN mavzuga eng mosini tanla
   (turlarni almashtirib; faqat MC bilan to'ldirma) va metodistga taklif qil.
2. **KONTENT** — to'liq CONTENT obyekti (ru + uz + audio). Metodist ko'rib chiqadi.
3. **JSX** — fayl yig'iladi (quyidagi 8-bo'limdagi infra baytma-bayt + unikal o'rta qism).
4. **QA** — 9-bo'limdagi chek-list bo'yicha tekshiruv hisoboti; buzilishlar tuzatiladi.

Bosqichlarni tashlab o'tish taqiqlanadi. Metodist istalgan payt "stop, qaytar" deyishi mumkin —
qaytib, qayta generatsiya qil (o'zgargan skelet = qayta kontent = qayta jsx).

---

## 2. DARS ARXITEKTURASI

**Bitta o'zini-o'zi ta'minlovchi .jsx fayl** (~1800–2300 qator), `src/components/DarsNN.jsx`.
Seksiyalar tartibi (Dars15.jsx etaloni bilan bir xil — unda infra'ning eng so'nggi versiyasi:
2×2 variant-setkali QuestionScreen + factOnCorrect):

```
1. import React...                          (1 qator)
2. // УРОК: [mavzu] — [dars_id]             (izoh — o'z darsing nomi bilan)
3. ПАЛИТРА (T) → TTS-КОНФИГ → AUDIO-ТЕГИ → useSfx/playChime
4. LangContext + useT → useIsMobile → AudioEngine → useAudio → makeAudioSegments
5. БАЗОВЫЕ КОМПОНЕНТЫ: Op, Frac, mt, AudioIndicator, FeedbackBlock, Slider,
   Stage, NavBack/NavNext, QuestionScreen, NumInputScreen
   ↑↑↑ 3-5 punktlar — 8-bo'limdagi INFRA, BAYTMA-BAYT, O'ZGARTIRISH TAQIQLANADI
6. LESSON_META + TOTAL_SCREENS + SCREEN_META    (unikal)
7. CONTENT { s0..sN }  — ru+uz+audio            (unikal)
8. VIZUALIZATORLAR — modul darajasida           (unikal)
9. shuffleMC + ConnectionsBlock + FactCard      (8-bo'limda tayyor — aynan ko'chir)
10. Screen0..ScreenN                            (unikal)
11. КОРНЕВОЙ КОМПОНЕНТ (export default)         (8-bo'limdagi shablon, nomi o'zgaradi)
12. STYLES (CSS) — bazaviy qism aynan + faqat shu darsning MATH-CSS dumi
```

**Pedagogik yoy — 13–16 ekran, qat'iy tartib:**

| Bosqich | Ekranlar | Tavsif |
|---|---|---|
| HOOK | s0 | Qahramon xatosi YOKI "nega?" savoli. Tuzoq = markaziy misconception. 3 variantli savol (Yo'q / Ha / Bilmayman uslubida), scored=false, scope='hook'. **Birinchi ekranda MAJBURIY harakatlanuvchi animatsiya** — pastdagi layout qoidasiga qarang |
| EXPLORATION | s1–s2(–s3) | Qadam-baqadam ochish (step-tugma + audio-segmentlar) + jonli interaktiv (slayder/bosish). Qoidani O'QUVCHI kashf qiladi — qoidadan OLDIN |
| RULE | 1–2 ta | Qoida kartasi. Ikkinchi rule ko'pincha tuzoq-ogohlantirish ("ehtiyot bo'l: ...") |
| TEST | 5 ta practice | MC (QuestionScreen) va kamida 1 ta NumInputScreen aralash; scored=true, scope='practice' |
| CASE | 2–3 ekran | Hayotiy masala: custom kirish ekrani + 1–2 scored MC. Yangi qahramon |
| FINAL | 1 ta | scope='final' test |
| SUMMARY | oxirgi | Hookni YOPADI (qahramon xatosi tushuntiriladi), keyin ConnectionsBlock |

**Baholash:** darsning o'zi baholanmaydi (final/practice scope faqat analitika uchun),
testlar "веди-до-верного": noto'g'ri variant xiralashadi va o'chadi, "Keyingi" faqat
to'g'ridan keyin ochiladi, firstTry analitikaga yoziladi. Jami scored = 6 (5 practice + 1 final).

**O'tgan darsni qayta eslash — spaced retrieval (metodist talabi 2026-06-13):** agar darsning
aniq prerekviziti bo'lsa (0-bo'lim), HOOK'dan keyin (odatda s1) bitta QISQA "o'tgan dars"
mikro-savoli qo'yiladi — prerekvizit konseptni haqiqatan qayta-test qiladi (matnli havola
emas, real savol; oson, 1 ta, веди-до-верного). Bu bilimni mustahkamlaydi va yangi mavzuni
eskisiga ulaydi (4-A linker bilan: "O'tgan darsda ... — endi ..."). ConnectionsBlock dagi
`conn_refs` aynan shu eslatilgan konseptga mos kelsin. Bu mikro-savol scored bo'lishi shart
emas (warm-up); ekran budjetiga (13–16) kiradi.

**Ekranga qaytish xulqi:** hook — `useState(null)`, tanlov TO'LIQ tozalanadi; test ekranlari —
`storedAnswer` dan tiklanadi.

**Slayd-layout — SCROLL'SIZ va SARLAVHASIZ (QAT'IY, metodist talabi 2026-06-12):**
- **Hech bir ekranda vertikal scroll bo'lmasligi kerak.** Har ekranning butun kontenti
  viewport ichiga sig'adi (Stage'ning flex + 100dvh karkasi ichida `overflow` chiqarmaydigan
  zich layout). Bu Dars01–16 dan farq: eski avtoscroll-to-feedback naqshi YANGI darslarda
  kerak emas — feedback doim ko'rinib turadigan zonada paydo bo'ladi.
- **Slaydlarda sarlavha-blok yo'q:** eyebrow-yorliq + katta titul kombinatsiyasi ishlatilmaydi.
  Kontent darhol boshlanadi; zarur kontekst — kontent ichidagi bitta qisqa kirish gap.
  Stage'ning progress-paneli (progress bar, audio-indikator, ekran hisoblagichi) saqlanadi —
  bu navigatsiya, sarlavha emas.
- **BIRINCHI EKRAN (s0) — MAJBURIY harakatlanuvchi animatsiya (metodist talabi 2026-06-13):**
  dars zerikarli boshlanmasligi uchun s0 dagi vizual STATIK bo'lmasligi kerak — mount'da
  harakatga keladigan animatsiya (qahramon/obyekt kirib keladi, kasr-bar to'ladi, son o'qida
  marker yuradi, sahna jonlanadi). Bu birinchi taassurot — diqqatni darhol ushlaydi.
  CSS-only, 6-bo'lim qoidalari bilan (keyframe yoki transition, set-state-in-effect'siz).
- **Bo'sh joy qolmasin — uni HARAKAT bilan boyit (metodist talabi 2026-06-13):** katta bo'sh
  maydonlar taqiqlanadi. Agar ekranda joy ortib qolsa — uni qiziq, harakatlanuvchi
  animatsiyalar bilan to'ldir (fon'da yengil suzuvchi elementlar, mavzuga oid jonli motif,
  pulsatsiya/parallaks). Animatsiya kontentdan diqqatni chalg'itmasin — yordamchi, sekin,
  loop'li bo'lsin. Vizual, matn va boshqaruvlar ekranni zich va muvozanatli to'ldiradi
  (lekin siqilib ham ketmasin — `clamp()` bilan moslashuvchan o'lchamlar).
- **HARAKAT UZLUKSIZ — hech bir ekran o'lik (statik) bo'lmasin (2026-06-15 nuqson: s3/s4 da
  animatsiya tugab/yo'qolib qolmoqda):** Dars18–23 da odatiy naqsh — s0 da loop animatsiya,
  lekin s3/s4 (step-tugma yoki slayder bilan ishlaydigan exploration) qadamlar tugagach STATIK
  bo'lib qoladi → bola "animatsiya o'chib qoldi" deb sezadi. Shuning uchun HAR ekranда doimiy
  (loop) harakat qatlami bo'lsin: yo fon'dagi yengil ambient (masalan `Floaters`/`amb-host`),
  yo jonli vizual (`alive`/`live` element, sekin nafas-pulsatsiya). Step-exploration ekranida
  qadamlar tugaganda ham bitta tirik element qolsin (masalan markerning yengil pulsatsiyasi).
  Animatsiyani FAQAT s0/s1/s2 ga emas — BARCHA ekranga bir xil tekis tarqat (rule/test/case ham).
- **Isbotlangan texnikalar (Dars15/16 scroll-fix tajribasi):** MC variantlar 2×2 setkada
  (8.1-dagi QuestionScreen'da tayyor — vertikal 4 qator emas); test-freymlarda savol matni
  takrorlanmaydi (bitta joyda); freym padding kompakt; vizual balandliklari kichraytirilgan.
- **Svyortka (accordion) ruxsat etiladi:** ikkilamchi kontent (uzun tushuntirish, qo'shimcha
  misol, fakt tafsiloti) yig'iladigan blokka olinadi. Ochilganda ham scroll chiqmasin —
  kerak bo'lsa bitta ochilganda boshqasi yopiladi.
- **Tekshiruv:** har ekran 1280×800 (desktop) va 390×844 (mobil) viewportlarda scroll'siz
  sig'ishi preview'da tekshiriladi. Sig'masa — kontent qisqartiriladi yoki svyortkaga
  olinadi; scroll qaytarish taqiqlanadi.

---

## 3. TEST EKRANLARI QOIDALARI

- Har MC ekranda 3–4 variant, har NOTO'G'RI variantga alohida `wrong_N` (hint) — umumiy
  "noto'g'ri, qayta urinib ko'r" TAQIQLANADI. Har hint aynan O'SHA xatoning sababini ochadi.
- **shuffleMC MAJBURIY** har MC testda: `shuffleMC(c, options, correctIdx, order)` — `order`
  QAT'IY massiv (Math.random EMAS — u storedAnswer tiklanishini buzadi). To'g'ri javob
  darsdagi testlar bo'ylab A/B/C/D ga taqsimlanishi SHART (hammasi A bo'lib qolmasin).
  shuffleMC hintlarni ham qayta xaritalaydi — variantlarni qo'lda aralashtirish taqiqlanadi.
- Kamida 1 ta **NumInputScreen** (raqam kiritish). Placeholder — NEYTRAL (`0` yoki `0,0`),
  hech qachon to'g'ri javob emas.
- Test ekranidagi yordamchi vizual faqat SHARTNI ko'rsatadi (qo'shiluvchilar/ayiriluvchilar),
  hech qachon NATIJANI emas. G'olib-bayroq / winner-belgi test ekranida TAQIQLANGAN.
- Misconceptionlar — 0-bo'limdagi ro'yxatdan: har biri kamida bitta test variantida tuzoq
  sifatida qatnashadi.

### SAVOL TURLARI PALITRASI (metodist talabi 2026-06-13: hammasi mavjud, AI-baholashdan tashqari)

Quyidagi turlarning HAMMASI ishlatishga ruxsat etilgan. Skelet bosqichida har test ekraniga
mavzuga eng mosini tanla va metodistga taklif qil — bir darsda turlarni ALMASHTIRIB ishlat
(faqat MC bilan to'ldirma; xilma-xillik diqqatni ushlaydi). Jami ~6 scored test qoladi.

**HAMMA scored turga umumiy qoidalar:** веди-до-верного (noto'g'ri urinish xiralashadi/qaytadi,
"Keyingi" faqat to'g'ridan keyin); har noto'g'ri yo'lga aniq hint (umumiy "noto'g'ri" TAQIQ);
test vizuali NATIJANI oshkor qilmaydi (winner-flag yo'q); firstTry analitikaga yoziladi;
qaytishda `storedAnswer` dan tiklanadi; scroll'siz layoutga sig'adi.

**Javobni BARDOSHLI tekshirish (metodist talabi 2026-06-13):** raqam/kasr kiritiladigan
turlar (NumInput, fill-blank, ko'p kataklik) ekvivalent to'g'ri shakllarni QABUL QILSIN —
matematik jihatdan to'g'ri javob "noto'g'ri" deyilmasligi kerak (bu ishonchni buzadi):
o'nlik vergul ham, nuqta ham (`0,5` = `0.5`); ortiqcha bo'shliq tashlanadi; kasrlarda — agar
mavzu qisqartirishni talab qilmasa — qisqartirilmagan va qisqartirilgan shakl ikkalasi
(`4/6` = `2/3`); aralash son va noto'g'ri kasr (`1 1/2` = `3/2`) mavzuga qarab. Tekshiruv
mantig'i: stringni emas, QIYMATNI solishtir (kasrlarda ko'ndalang ko'paytma `a*d == c*b`).
Faqat o'sha darsning maqsadi aniq bir shaklni talab qilsa (masalan "qisqartiring") — o'shanda
qat'iy shakl, lekin buni savol matnida aniq ayt.

**A. Tanlash / tanib olish (yopiq)**
1. **MC — bitta to'g'ri variant** — ✅ infra tayyor (QuestionScreen, 2×2 setka). 3–4 variant,
   `wrong_N` hint, **shuffleMC MAJBURIY** (`order` QAT'IY massiv, Math.random EMAS; to'g'ri
   javob A/B/C/D bo'ylab taqsimlangan; hintlar ham qayta xaritalanadi). Asosiy ishchi tur.
2. **Multi-select — bir nechta to'g'ri variant** — yangi mexanika (custom screen). To'plam
   javob to'liq to'g'ri bo'lsagina o'tadi; har variant uchun tanlangan/tanlanmagan hint.
   Taxminni keskin kamaytiradi. "Quyidagilardan QAYSILARI noto'g'ri kasr?"
3. **Ha/Yo'q · To'g'ri/Noto'g'ri** — MC ning 2 variantli ko'rinishi. Tez refleksiya;
   hook va oraliq tekshiruvlar uchun.
4. **Noto'g'risini top (error-spotting)** — savol teskari: "Qaysi yechim XATO?". 2-3 to'g'ri
   tasdiq + 1 xato (to'g'ri javob = xato variant); hint mantiqi teskari (to'g'rini tanlasa —
   NEGA to'g'ri ekanini tushuntiradi). "XATO/noto'g'ri" so'zi vizual ta'kidlanadi, audio-intro
   ham aniq aytadi. shuffleMC amal qiladi.
5. **Ortiqchasini top (odd-one-out)** — MC ustida: 4 obyektdan biri guruhga mos emas.
   Tasniflashga kirish. Hint — qaysi xususiyat bo'yicha mos emasligini ochadi.

**B. Yaratish / ishlab chiqarish (ochiq javob, taxminsiz)**
6. **Raqam kiritish (NumInputScreen)** — ✅ infra tayyor. Kamida 1 ta har darsda. Placeholder
   NEYTRAL (`0` / `0,0`), hech qachon to'g'ri javob emas. renderVisual bilan jonli figura.
7. **Bo'sh joyni to'ldirish (fill-in-the-blank)** — ifoda ichida bitta katak: `2/3 = ?/6`.
   NumInput'ning ifodaga joylashgan ko'rinishi.
8. **Ko'p kataklik to'ldirish** — ✅ Nat darslarida bor (Dars03/04 ColumnSolver — ustun
   arifmetikasi: raqamlar + ko'chirish/qarz). Kasrlarga moslashtirilsa — surat/maxraj kataklari.

**C. Manipulyatsiya / interaktiv (qo'l bilan — eng yodda qoladigan)**
9. **Drag-and-drop (sudrab qo'yish)** — `.chip` CSS tayyor (8.4), namunalar: Dars01 s11
   drag-match, Dars17 qulf/kalit kvesti. Qoidalar: `touch-action: none` + pointer-events
   (mobil); alohida "Tekshirish" tugmasi (har sudrashda emas); noto'g'ri chip ortga qaytadi +
   hint; firstTry = birinchi "Tekshirish". Ichki turlari:
   - *Juftlash* (qiymat ↔ rasm / kasr ↔ bar-model)
   - *Tasniflash — savatlarga ajratish* (masalan: to'g'ri / noto'g'ri / aralash savatlari)
   - *Tartiblash* (hajm bo'yicha o'sish tartibida sudrab)
   - *Bo'sh katakni to'ldirish* (chip'ni ifodaga tashlash)
10. **Slayder bilan qiymat o'rnatish** — ✅ Slider bazaviy komponent bor (hozir exploration'da).
    Test sifatida: o'quvchi slayderni to'g'ri qiymatga qo'yadi, "Tekshirish" baholaydi.
11. **Bosib bo'laklarni tanlash (tap-to-shade)** — ✅ exploration kodi bor. Test sifatida:
    "5/6 ni bo'yang" — N katakni bosib tanlaydi; to'g'ri soni bo'lsa o'tadi.
12. **Son o'qiga nuqta qo'yish (drag-on-number-line)** — vizual bor (Dars02/07). Test sifatida:
    markerni to'g'ri kasrga sudraydi; ruxsat berilgan xatolik oralig'i bilan baholanadi.

**D. Tartiblash / ketma-ketlik**
13. **Hajm bo'yicha tartiblash** — drag (9-tartiblash) yoki tap-bilan-tartib. Bir nechta
    kasrni o'sish/kamayish tartibiga keltirish.
14. **Yechim qadamlarini tartibga solish** — algoritmik fikrlash: "Bu masalani qaysi tartibda
    yechamiz?" qadam-kartalarini to'g'ri ketma-ketlikka sudrash. Ustun arifmetikasi / umumiy
    maxrajga keltirish kabi ko'p qadamli mavzularда foydali.

**E. Tasniflash**
15. **Toifalarga ajratish** — drag (9-tasniflash) ning kuchaytirilgan ko'rinishi: kartalarni
    2-3 nomlangan guruhga ajratish. Misconception'ni bevosita sindiradi (masalan "noto'g'ri
    kasr = xato" — uni haqiqiy son sifatida o'z savatiga qo'yib).

**F. Chama / baholash (estimation)**
16. **"Taxminan qancha? / qaysi tomonda?"** — ✅ qisman bor (Dars11 BenchmarkLine: 1/2 dan
    katta-kichikmi). Aniq hisob emas — sonli sezgi. MC yoki number-line bilan amalga oshadi.

**Eslatma:** "Tushuntir/asoslab ber" (erkin matn, AI-baholanadigan) tur HOZIRCHA QO'SHILMAYDI —
u `aiGradingEndpoint` + production qaroriga bog'liq, alohida masala (Fuzayl).

**Texnik holat:** 1, 6, 9 — infra tayyor. 8 — Nat'da bor, moslashtirish kerak. 10, 11, 12,
16 — komponentlar bor, test-rejimga o'tkazish kerak. 2, 4, 5, 7, 13, 14, 15 — custom screen
sifatida quriladi (yangi mexanika; lekin barchasi `recordAnswer`/firstTry/веди-до-верного
naqshiga bo'ysunadi).

---

## 4. QAHRAMONLAR VA SYUJET

- Ismlar — o'zbekcha. **Ishlatilganlarni TAKRORLAMA:** Nodira, Daler, Karim, Bekzod, Zaynab,
  Malika, Jasur, Sardor, Sevara, Ulug'bek, Kamola, Nigora, Dilshod, Gulnora, Aziz, Eldor,
  Temur, Diyora, Javohir, Umid, Sabina, Kamron, Bobur, Laylo, Sanjar, Otabek, Akmal, Doston.
  Har yangi darsga yangi ismlar (hook uchun ham, case uchun ham).
- Syujet uslubini ALMASHTIRIB tur: oldingi dars "ikki qahramon taqqoslovi" bo'lsa — endi
  "nega/nima uchun" konseptual hook qil (yoki aksincha).
- Rekvizitlar mahalliy: non/lepyoshka, sharbat, bog', devor bo'yash, fayl yuklash, internet-GB.
  G'arbona rekvizit (pitsa va h.k.) ishlatma. Zamonaviy-relatable stsenariylar yaxshi.
- Case — hayotiy va mavzuga organik bog'liq masala, hook qahramonidan BOSHQA qahramon bilan.
- **Syujet o'yin / kvest / multfilm formatida bo'lishi mumkin (metodist talabi 2026-06-13):**
  butun darsni bitta o'yin yoki kvest (bosqichlar, daraja oshirish, missiya) yoki tanish
  multfilm-stil qahramonlari atrofida qurish — qiziqarliroq va marketing uchun foydali.
  **MUHIM HUQUQIY OGOHLANTIRISH:** mashhur litsenziyalangan qahramonlar (Disney, Pixar,
  anime, "Mashalar", super-qahramonlar va h.k.) — mualliflik huquqi/savdo belgisi bilan
  himoyalangan; ularni tijoriy mahsulotda RUXSATSIZ ishlatish huquqiy xavf. Shuning uchun:
  (1) afzal variant — **erkin/ochiq qahramonlar:** o'zbek xalq ertaklari (Alpomish, Nasriddin
  Afandi, Zumrad va Qimmat), folklor, yoki LOYIHANING O'Z original mascot'i — bular bepul
  va brendni mustahkamlaydi; (2) litsenziyalangan mashhur qahramon kerak bo'lsa — buni
  metodistga ALOHIDA flag qil, "huquqlarni tozalash Fuzayl/legal orqali kerak" deb belgila,
  o'zboshimchalik bilan ishlatma. G'oyani taklif qil, lekin xavfni yashirma.

---

## 4-A. SLAYDLARNI MA'NAVIY BOG'LASH — ASOSIY QOIDA (metodist talabi 2026-06-13)

Dars uzilgan, alohida ekranlar yig'indisi bo'lmasligi kerak — **bitta uzluksiz hikoya**.
Har ekran oldingisidan mantiqan o'sib chiqadi va keyingisiga ko'prik tashlaydi. Bu — qat'iy
asosiy qoida, dekoratsiya emas.

**Qanday bog'lanadi:**
- Har ekranning kirish gapi (yoki audio-intro boshi) oldingi ekran natijasiga ishora qiladi:
  "Buni ko'rdik — endi...", "Demak...", "Shuning uchun...".
- Syujet ipi uzilmaydi: qahramon/kvest/masala butun dars bo'ylab davom etadi, har bosqich
  bir qadam oldinga.
- Test'dan keyingi ekran o'sha test natijasiga tayanadi; summary butun yo'lni bitta zanjir
  qilib yopadi (ConnectionsBlock bilan).

**Linker so'zlar (har ekran boshida ishlatib bog'la — ru + uz):**

| Maqsad | UZ | RU |
|---|---|---|
| Xulosa/natija | Demak; Shuning uchun; Natijada; Ko'rib turibmizki | Итак; Поэтому; В итоге; Получается |
| Yangi qadam | Endi esa; Keling, ko'ramiz; Navbatdagi qadam | Теперь; Давайте посмотрим; Следующий шаг |
| Eslatish | Yodingizdami; Biroz oldin ko'rdik; Avval aytgandik | Помните; Чуть раньше мы видели; Мы уже говорили |
| Qarama-qarshilik | Lekin; Ammo; Shunга qaramay | Но; Однако; Тем не менее |
| Sabab | Chunki; Xuddi shu sababli; Mana shu yerda | Потому что; Именно поэтому; Вот здесь |
| Davom | Shu bilan birga; Bundan tashqari; Va mana | Кроме того; Вдобавок; И вот |

Ro'yxat to'liq emas — mosini tanla, lekin har o'tishda ataylab ko'prik tashla. Linker so'z
audioda ham, ekran matnida ham tabiiy yangrasin (mexanik takror emas).

---

## 5. TIL VA AUDIO QOIDALARI (eng ko'p buziladigan joy — diqqat!)

**Ikkala til:** har CONTENT maydonida `ru` va `uz` to'liq (plejsxolder taqiqlanadi).
UZ — lotin alifbosi. UZ matnli JS-stringlar — FAQAT qo'shtirnoq `"..."` yoki backtick
(apostrof `'` borligi uchun bitta tirnoq sintaksisni buzadi).

**UZ registri — siz:**
- Murojaat faqat `siz`: tanlang, suring, toping, bosing, bo'ling, qo'shing, ko'paytiring.
  sen-imperativ (tanla, top, bos, qo'sh...) TAQIQ. `-sang/-san/-ding` shakllari TAQIQ.
  `o'zing` emas — `o'zingiz`.
- Qoida-kartalar/aforizmlar — shaxssiz shakl afzal: "Maxraj o'zgarsa — surat ham o'zgaradi"
  (= `-sa / -adi / -lsa` konstruksiyalari).
- Apostrof — oddiy `'` (U+0027), modifikator `ʻ` TAQIQ. So'z tartibi — SOV.
- **Kasr o'qilishi:** `[maxraj]dan [surat]` — "oltidan besh" = 5/6, "uchdan ikki" = 2/3.
  Sanash shakllari ham shu tartibda: "o'n ikkidan sakkizta" (8 dona 1/12). Teskari tartib XATO.

**Audio (TTS-friendly) — har spoken maydonda (intro, on_correct, on_wrong, fb_*, segmentlar):**
- Matematik belgilar TAQIQ: %, $, /, ×, =, +, −, <, > — hammasi SO'Z bilan
  ("besh oltidan emas" — "olti ulushdan beshtasi" emas, to'g'risi: 5/6 = "oltidan besh";
  "qo'shsak ... bo'ladi", "katta", "kichik", "teng").
- Kasrlar so'z bilan: "одна вторая" / "ikkidan bir".
- «» , "" , '' tirnoqlar audio-matnda TAQIQ; ikki nuqta + sanab o'tish TAQIQ; uzun tire bilan
  izohlash TAQIQ. Bir segment = bir fikr.
- Audio vizualni TAKRORLAMAYDI — to'ldiradi (ekranda ko'rinmagan tushuntirishni beradi).
- Exploration ekranlarda audio — massiv segmentlar, `waits_for` step-tugmalarga bog'lanadi.

**i18n — bo'shliqlar:** matnlardagi bo'shliqlar CONTENT stringlari ichida, JSX-razmetkada emas.

**TIL TO'LIQLIGI — eng muhim (2026-06-15 nuqson: ru darsda uz so'z, uz darsda ru so'z):**
- Bu nuqsonning ASOSIY sababi — yetishmagan tarjima `|| .ru` ga FALLBACK bo'lishi.
  Kod ko'p joyda `c.audio[lang] || c.audio.ru` yoki `t()` orqali — agar `uz` maydoni
  YO'Q/bo'sh bo'lsa, ekranda/ovozda RUSCHA matn chiqadi (va aksincha). Statik skan buni
  ko'rmaydi (matn uz-stringда emas — u umuman yo'q), lekin ishlaganda chiqadi.
- Shuning uchun: HAR ko'rinadigan/aytiladigan maydonda `ru` VA `uz` ikkalasi ham bo'lishi
  shart — birortasi bo'sh/yo'q bo'lmasin. Bu mukofot-fakt, hint, eyebrow, tugma, audio-segment,
  step-label — HAMMASIGA taalluqli.
- **Massivlar (audio segmentlari, step_labels) `ru` va `uz` da BIR XIL UZUNLIKDA** bo'lsin —
  uzunligi farq qilsa, indeks mos kelmay yoki fallback orqali til aralashadi.
- **JSX/komponent ichida QO'LDA yozilgan bir tilli matn TAQIQ** — barcha matn CONTENT orqali,
  ikkala til bilan. Diqqat: infra'dagi `NavBack` ning standart `label = 'Назад'` (ruscha) —
  uni hech qachon labelsiz chaqirma, doim `<BackLabel/>`/`<NextLabel/>` (yoki lokalizatsiya)
  uzat. Aks holda uz-darsда "Назад" chiqadi.
- Tekshiruv (7-bo'limga): har CONTENT kaliti `ru` bilan bo'lsa — `uz` ham bo'sh emas (va
  aksincha); ru/uz massiv uzunliklari teng; JSX'da kirill yoki qattiq bir tilli matn yo'q.

---

## 5-A. QIZIQARLI FAKTLAR — mukofot mexanikasi (metodist, 2026-06-12; pilot: Dars15)

Har darsda **2-3 ta ilmiy-ommabop fakt**. Mavzu yo'nalishi — ARALASH: birinchi navbatda dars
mavzusiga yoki undagi sonlarga bog'liq fan/matematika-tarixi faktlari (masalan: "Qadimgi
Misrda kasrlar faqat surati 1 bo'lgan ulushlar bilan yozilgan"), qolganlari IT/dasturlash,
texnika, tarix (auditoriya IT ga qiziqadi — IT-burchak doim yaxshi ishlaydi).

**Qachon ko'rsatiladi:** fakt — FAQAT TO'G'RI javob uchun mukofot. 2-3 ta asosiy test
nuqtasiga qo'yiladi (odatda: 1 muhim practice + case + final). Mexanizm tayyor (Dars15
piloti, kod 8.2-bo'limda): QuestionScreen'ga `factOnCorrect={<FactCard text={c.fact}
anim={<AnimX/>}/>}` prop beriladi — karta `solved` bo'lgandagina chiqadi. Fakt yordam (help)
sifatida yoki summary-ekranda ko'rsatilmaydi. Noto'g'ri javobda ko'rinmaydi — веди-до-верного
orqali to'g'riga yetganda ochiladi.

**Ovoz — QISQA va ANIQ, lekin KERAKLI joyda to'liq (metodist talabi 2026-06-13/14):**
ozvuchka qilinganda fakt qisqa va aniq aytilsin. STANDART holatda — faktning 1 jumlalik
mohiyati `on_correct` audio-matnining OXIRIGA qo'shiladi (alohida segment kerak emas),
to'liq matn faqat vizual kartada; jumla qisqa (~8–14 so'z), bitta aniq fikr. LEKIN fakt
qisqa, markaziy yoki ayniqsa qiziqarli bo'lsa — to'liq matnni ham ovozда o'qib berish mumkin
(o'shanda alohida audio-segment). Qaysi holatda qaysisini — skelet bosqichida har faktga
belgilanadi. Cho'zilgan tushuntirish, sanab o'tish, ergash gaplar har holда TAQIQ (ular
vizualda qoladi). Barcha holatda 5-bo'lim TTS qoidalari amal qiladi (belgilar yo'q, sonlar
so'z bilan, bir segment = bir fikr).

**Faktni KERAKLI joyda misol bilan tushuntir + NEGA aynan shu yerda ekanini ayt (metodist
talabi 2026-06-14):** quruq fakt emas — kerak bo'lganda qisqa, aniq misol bilan ochib ber
(masalan kasr-tarixi faktida real kichik misol). Va har fakt o'quvchiga NEGA aynan shu darsда/
shu slaydda berilayotganini qisqacha, lekin MA'NOLI tushuntirsin — uni mavzuga 4-A linker
so'zlar bilan ulasin: "Demak, kasrlar qadimда ham kerak bo'lgan...", "Shuning uchun bu yerда
eslatdik...", "Mana shu sababli...". Bog'lanishsiz "shunchaki qiziqarli" fakt ishlamaydi —
u darsning mantiqiy ipiga tushib tursin. CONTENT'da `fact` matni shu bog'lovchi gapni o'z
ichiga olsin (yoki `fact_why` maydoni).

**Har faktning O'Z HARAKATLANUVCHI ANIMATSIYASI bo'ladi — KATTA, matn KAM (metodist
talabi 2026-06-13):** animatsiya kartaning asosiy qismini egallaydi (vizual ustun, matn
ikkilamchi); mazmuniga mos (masalan, Yer-Oy masofasi haqida fakt → masshtabli harakatli
diagramma; yuklanish haqida → to'layotgan progress-bar). Animatsiya doim harakatda (loop),
statik matn-karta YETARLI EMAS. Matn — qisqa, 1-2 jumla; tushuntirish vizual orqali ketadi.
Shuning uchun `.fact-anim` o'lchami pilotdagi 54px dan KATTAROQ bo'lsin (masalan
`clamp(90px, 18vw, 130px)`), `.fact-text` kichraytiriladi — kartaning vizual-og'irligi
animatsiyada. **OVERFLOW XAVFI (2026-06-15 nuqson):** `.fact-anim` da `overflow: hidden`
MAJBURIY (8.4-da tayyor); Anim-komponentni qutiga MOSLAB yoz — kichik animatsiyani
`transform: scale(1.55)` bilan kattalashtirib qutidan chiqarib yuborma (aynan shu xato
Dars18–23 da animatsiyani chegaradan chiqarib yubordi). Tayyor namunalar 8.2-da:
`AnimProgress`, `AnimBattery`, `AnimSlider` — yangi fakt uchun shu uslubda yangi, KATTAROQ
CSS-only Anim-komponent yoziladi (loop, set-state-in-effect'siz; o'lchami qutiga sig'adi). Karta dizayni — ko'k tema (#019ACB), `FACT_BADGE` yorlig'i:
IT-fakt bo'lsa "Bilasizmi? · IT", boshqa yo'nalishda mos teg ("Bilasizmi? · Tarix" va h.k.).
Fakt-karta kattaroq bo'lgani uchun scroll'siz layoutga sig'ishini alohida tekshir (2×2
variant-setka joy bo'shatadi; kerak bo'lsa karta variantlar tagida, kompakt joylashadi).

**CONTENT tuzilishi:** tegishli test ekraniga `fact` maydoni ({ru, uz}) — vizual matn +
mavzuga bog'lovchi gap (yoki alohida `fact_why`); ovoz uchun on_correct oxirida qisqa jumla
YOKI (kerakli faktда) to'liq matnni o'qiydigan alohida segment. Fakt-karta scroll'siz
layoutga sig'ishi shart (2×2 variant-setka bunga joy bo'shatadi).

**Aniqlik:** har faktdagi raqam, sana va nomlar — DRAFT. Skelet bosqichida fakt ro'yxatini
asoslari bilan metodistga ko'rsat va "faktlar metodist tasdig'ini talab qiladi" deb belgila.
Shubhali yoki tekshirib bo'lmaydigan faktni taklif qilma — yaxshisi oddiyroq, lekin ishonchli.

---

## 6. VIZUALIZATOR VA ANIMATSIYA

Har darsda YANGI, mavzuga xos vizualizator (~15–20% unikal his). Mavjudlari (takrorlama,
lekin uslubni meros qil): bar-model, NumberLine, SVG-pie SharingBoard, ComparisonBars
(finish-line marker), FractionWall (flip-card), CompareBars+BenchmarkLine, EquivStack (dimIdx),
FracBar-merge+DivLadder+SpinNum, FracPie+FigBar+LiveFillFigure, LiveBackLine,
AreaGrid/OverlayWall (2D). Yangisini shu evolyutsiya davomi sifatida tanla.

Texnik qoidalar:
- Vizualizator komponentlari — MODUL darajasida (komponent ichida komponent →
  `react-hooks/static-components` xatosi).
- CSS — faylning STYLES blokiga o'z nomfazosi bilan qo'shiladi (masalan `.xy-*`),
  `/* MATH: [tavsif] ([dars_id]). */` izohi bilan.
- Mount-paytida dinamik nishongacha o'sish — faqat `from`-keyframe trik:
  `@keyframes xyGrow { from { width: 0; } }` (implicit `to` = inline qiymat). Effekt ichida
  sinxron setState TAQIQ (`set-state-in-effect` lint).
- Slayder boshqaradigan jonli element — doimiy element + oddiy `transition` (o'zgaruvchan
  qiymat bilan key qilma — remount transition'ni o'ldiradi).
- Qadam-baqadam ochilish — useEffect ichidagi interval taymer.
- Staggered delay (`animationDelay: i*0.1s`) — qatorlar/kataklar ketma-ket kirishi uchun.
- Display o'lchamlari etalon boshlang'ichidan 80% dan oshmasin; max-width: 936px.
- **RANG INTIZOMI — faqat palitra (2026-06-15 nuqson: ranglarда o'zgarishlar):** faqat `T`
  palitra tokenlari ishlatiladi (ink/ink2/ink3, accent #FF4F28, success #1F7A4D, bg #F6F4EF,
  paper #FFFFFF) + ikki hujjatlangan oila: tip-sariq (`.frame-tip` — bg #FBF3D6, ramka #D8A93A,
  MATN `T.ink`, yangi sariq-hex `#A07D14` kabilar EMAS) va fakt-ko'k (#019ACB / #EAF6FB).
  Boshqa ixtiyoriy hex (`#FBF8F2`, `#FFD23F`, `#A07D14` va h.k.) TAQIQ — Dars18/21–23 da aynan
  shular intizomni buzdi. Anim-komponentlar ham faqat accent/blue/success/ink dan foydalanadi.
  Animatsiya rangni keskin almashtirib "miltillama" (glitch) effekti bermasin — rang o'zgarsa,
  ma'noli va sekin bo'lsin (masalan ortib borayotgan yashil), tasodifiy emas.

**Accessibility (metodist talabi 2026-06-13):**
- **Feedback faqat RANGGA tayanmasin** — rang-ko'r bola (har ~12 o'g'il boladan 1 ta) qizil/
  yashilni farqlay olmaydi. To'g'ri/noto'g'ri har doim RANG + BELGI bilan: to'g'ri = ✓ ikonka/
  galochka, noto'g'ri = ✗ yoki xira+chiziq. G'olib/yutuq ham faqat rang bilan emas (ikonka/
  shakl). Bu butun feedback va vizualizatorlarga taalluqli.
  **DIQQAT — ikonka MATNGA YOPISHMASIN (2026-06-15 nuqson):** `{<IconOk/>}{mt(t(...))}` kabi
  yondosh JSX ifodalar ikonka bilan matnni bo'shliqsiz yopishtirib qo'yadi ("✓Javob"). Ikonka
  va matnni doim `display:flex; gap:8px` li o'rovchi `<span>`/`<div>` ichiga ol — yondosh
  `}{ ` qo'yib bevosita ulama. Umuman: ekranda yonma-yon turadigan ikki matn-ifodaga aniq
  bo'shliq kerak (`{a}{' '}{b}` yoki flex+gap), aks holda so'zlar yopishadi.
- **`prefers-reduced-motion` ni hurmat qil** — ba'zi bolalar harakatdan bezovtalanadi
  (vestibulyar sezgirlik). STYLES oxirida media-so'rov: tizimda "harakatni kamaytir" yoqilgan
  bo'lsa, bezak/loop animatsiyalari so'ndiriladi (kontent darhol ko'rinadi, funksiya buzilmaydi):
  `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }`
  Bu yangi animatsiya-yo'nalishimizning (s0, bo'sh joy, katta faktlar) zaruriy muvozanati.

---

## 7. TEXNIK QOIDALAR

- **Fayl yaratish:** UTF-8 **BOM'siz, LF**. PowerShell'da faqat
  `[System.IO.File]::WriteAllText($path, $txt, (New-Object System.Text.UTF8Encoding($false)))`
  (Get-Content/Set-Content kirillni buzadi — ishlatma).
- **Infra manbasi:** quyidagi 8-bo'lim = `src/components/Dars15.jsx` (1–807-qatorlar + STYLES
  bazasi + FactCard bloki). Bu infra'ning eng so'nggi versiyasi: QuestionScreen'da 2×2
  variant-setka va `factOnCorrect` prop (Notion'dagi infrastructure_v1 dan farq — infra_v2
  nomzodi, knowledge-updater orqali qayd etilishi kerak). Yig'ishda eng ishonchlisi —
  Dars15.jsx dan dasturiy nusxa olish (region-swap usuli), 8-bo'lim esa nazorat etaloni.
  2-qatordagi `// УРОК:` izohini o'z darsing nomiga almashtir.
- **Registratsiya:** `src/App.jsx` `lessons` massiviga obyekt qo'sh:
  `{ slug: 'kasr-...', title: 'Урок NN. [uz sarlavha]', desc: "[1 qator uz]", Component: lazy(() => import('./components/DarsNN.jsx')) }`
- **Tekshiruv (majburiy, har yig'ishdan keyin):**
  1. `npm run build` — xatosiz o'tishi SHART.
  2. `npx eslint src/components/DarsNN.jsx --format json` — qoida-taqsimot Dars15 bazasiga mos:
     no-unused-vars≈8, no-empty=5, react-hooks refs=5, exhaustive-deps=2, set-state-in-effect=1,
     purity=1 (+1 benign unused-disable). Bular infra'ning ma'lum naqshlari — TUZATMA.
     YANGI rule-id paydo bo'lishi = xato, tuzat. Kamroq bo'lishi mumkin, yangi turi — yo'q.
  3. **sen-skan** (case-insensitive!): `\bsen\b`, `-san/-sang/-ding` qo'shimchalari, `o'zing`,
     imperativlar (tanla|top|bos|sur|qo'sh|bo'l|ko'paytir|qisqartir|solishtir|yig'|yasa|qo'y|
     to'ldir|ber|ol|qur|kuzat|keltir|sudra|o'ylab ko'r) — uz-stringlarda 0 bo'lishi shart.
     Grep yetarli emas — s2 ("o'zingiz yasang") ekranini QO'LDA ham o'qi.
  4. **Audio-belgi skan:** spoken maydonlarda `[%$/×=+<>−-]` va `«»` — 0 ta.
  5. **Kirill-in-uz skan:** uz qiymatlarida kirill harf — 0 ta.
  6. **Kasr o'qilish skan:** uz audioda teskari tartib ("besh oltidan" tipidagi surat-avval) — 0 ta.
  7. **shuffleMC taqsimot:** to'g'ri javob pozitsiyalari ro'yxatini chiqar (A/B/C/D bo'ylab).
  8. **Til-to'liqlik skani (2026-06-15):** har CONTENT kalitida `ru` bo'lsa `uz` ham bo'sh emas
     (va aksincha); `ru`/`uz` massivlari (audio, step_labels) bir xil uzunlikda; JSX'da qo'lda
     yozilgan kirill yoki bir tilli matn yo'q (`NavBack` labelsiz chaqirilmagan). Bu — "uz darsда
     ruscha so'z" nuqsonining oldini oladi (fallback yashirin aralashuv beradi).
  9. **Yopishgan so'z skani (2026-06-15):** JSX'da `}{` yondoshligi (ayniqsa `{<IconOk/>}{mt(`
     kabi ikonka+matn) — bo'shliq yoki flex+gap bilan ajratilgan; CONTENT stringlarida
     bo'shliqsiz qo'shilib ketgan so'zlar yo'q.
  10. **Animatsiya uzluksizligi (2026-06-15):** har Screen0..N da kamida bitta loop/ambient
     harakat bor — ayniqsa s3/s4 (step/slayder) statik bo'lib qolmasin. Har ekranni preview'da
     ko'rib chiq.
  11. **Fakt-overflow + rang skani (2026-06-15):** `.fact-anim`da `overflow: hidden` bor va
     Anim bola qutidan chiqmaydi (scale bilan oshirilmagan); STYLES'da palitradan tashqari
     hex (`#A07D14`/`#FBF8F2`/`#FFD23F` kabi) yo'q.
- **Taqiqlar:** localStorage yo'q; production uchun Web Speech va'da qilinmaydi (preview-rejim
  bor — bu normal); proprietar shriftlar yo'q (faqat Source Serif 4, Fraunces, Manrope,
  JetBrains Mono); Math.random / Date.now faqat infra'dagi mavjud joylarda; etalon v14
  qayta ishlanmaydi; UZ terminologiya — draft, "o'zbek metodisti validatsiyasi kerak" deb belgila.

---

## 8. INFRA-KOD (o'zgartirish TAQIQLANADI)

### 8.1. Bazaviy infra — fayl boshi (palitra → TTS → AudioEngine → hook'lar → bazaviy
komponentlar → QuestionScreen → NumInputScreen). Manba: Dars15.jsx 1–807 (QuestionScreen'da
2×2 variant-setka + factOnCorrect bor). 2-qatordagi `// УРОК:` izohini o'z darsing nomiga
almashtir, qolgani baytma-bayt:

```jsx
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Вычитание дробей с равными знаменателями — frac_5_10
// --- ИЗ infrastructure_v1 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen/NumInputScreen) ---

// ============================================================
// ПАЛИТРА
// ============================================================
const T = {
  bg: '#F6F4EF',
  ink: '#0E0E10',
  ink2: '#5A5A60',
  ink3: '#A7A6A2',
  paper: '#FFFFFF',
  accent: '#FF4F28',
  accentSoft: '#FFE8E1',
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  blue: '#019ACB',
  shadowBase: '58, 53, 48'
};

// ============================================================
// КОНФИГ УРОКА (props от LMS) — модульный, ставится корневым компонентом.
// Движок/SFX/AI читают отсюда; экраны не нужно перепровязывать.
// ============================================================
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS: {base}/api/tts?text=<теги+текст, encoded>&g=m|f
// Если в тексте уже есть языковой тег (смешанные языки) — свой не добавляем.
function buildTtsUrl(base, text, lang, gender) {
  const tag = LANG_TAG[lang] || LANG_TAG.ru;
  const raw = String(text);
  const tagged = TAG_RE.test(raw) ? raw : `${tag} ${raw}`;
  const enc = encodeURIComponent(tagged.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

// SFX — короткие звуки верно/неверно, URL из ttsConfig (correctSoundUrl/wrongSoundUrl).
function useSfx() {
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { correctSoundUrl, wrongSoundUrl } = ttsConfig;
    if (correctSoundUrl) { const a = new Audio(correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; correctRef.current = a; }
    if (wrongSoundUrl)   { const a = new Audio(wrongSoundUrl);   a.preload = 'auto'; a.volume = 0.6; wrongRef.current = a; }
    return () => {
      try { correctRef.current && correctRef.current.pause(); } catch (e) {}
      try { wrongRef.current && wrongRef.current.pause(); } catch (e) {}
      correctRef.current = null; wrongRef.current = null;
    };
  }, []);
  const play = useCallback((kind) => {
    const ref = kind === 'correct' ? correctRef : wrongRef;
    const a = ref.current; if (!a) { playChime(kind === 'correct'); return; }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }, []);
  return { playCorrect: () => play('correct'), playWrong: () => play('wrong') };
}

// Неречевой сигнал (фолбэк SFX в preview / игры закрепления).
let _chimeCtx = null;
function playChime(ok) {
  try {
    if (typeof window === 'undefined') return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    _chimeCtx = _chimeCtx || new AC();
    const ctx = _chimeCtx; if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const notes = ok ? [660, 880] : [320, 240];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const t0 = now + i * 0.12;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0 + 0.2);
    });
  } catch (e) { /* no-op */ }
}

// AI-проверка открытых ответов — единственный разрешённый fetch (кроме <audio>.src).
// Возвращает { correct, feedback, transcript? } или бросает.
async function gradeAnswer({ screenIdx, question, rubric, lang, mode, answerText, audioBlob }) {
  const endpoint = ttsConfig.aiGradingEndpoint;
  if (!endpoint) throw new Error('No grading endpoint configured');
  const lessonId = (typeof LESSON_META !== 'undefined' && LESSON_META.lessonId) || '';
  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId); fd.append('screenIdx', String(screenIdx));
    fd.append('question', question || ''); fd.append('rubric', rubric || '');
    fd.append('lang', lang); fd.append('mode', 'voice');
    if (audioBlob) fd.append('audio', audioBlob, 'answer.webm');
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, screenIdx, question: question || '', rubric: rubric || '', lang, mode: 'text', answerText: answerText || '' }),
    });
  }
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') throw new Error('Malformed grading response');
  return data;
}

// ============================================================
// LANGUAGE CONTEXT + useT
// ============================================================
const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string') return stripAudioTags(node);
    if (React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return stripAudioTags(node[lang]);
    return stripAudioTags(node.ru ?? '');
  }, [lang]);
};

// ============================================================
// useIsMobile (design_system 5.0)
// ============================================================
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ============================================================
// AUDIO ENGINE
// ============================================================
class AudioEngine {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.onStateChange = null;
    this.waitingFor = null;
    this.currentLang = 'ru';
    this.gender = 'm';
    this.autoplayBlocked = false;
    this.audioEl = null;
  }

  ensureEl() {
    if (this.audioEl || typeof window === 'undefined') return this.audioEl;
    const el = new Audio();
    el.crossOrigin = 'anonymous';
    el.preload = 'auto';
    this.audioEl = el;
    return el;
  }

  setLang(lang) { this.currentLang = lang; }

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
  }

  playSegment(segment) {
    if (!segment) return;
    const base = ttsConfig.ttsApiBase;
    // Нет текста → пропускаем (логика очереди сохраняется).
    if (!segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
    // База НЕ пришла от LMS → этап разработки (artifacts). Озвучка через браузерный
    // Web Speech (preview-стендин, «корявый» голос). На платформе эта ветка мёртвая:
    // LMS всегда передаёт ttsApiBase, и тогда идёт HTTP-ветка ниже.
    // speechSynthesis запрещён контрактом в БОЕВОЙ ветке (platform_contract §4);
    // здесь он допустим как preview-стендин — согласовано с разработчиком платформы (июнь 2026).
    if (!base) { this.playSegmentPreview(segment); return; }
    const el = this.ensureEl();
    if (!el) { setTimeout(() => this.handleSegmentEnd(segment), 0); return; }

    el.onended = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    el.onerror = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };

    const lang = segment.lang || this.currentLang;
    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, lang, gender);
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        this.autoplayBlocked = false;
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
      }).catch(() => {
        // автоплей заблокирован браузером — ждём первого жеста
        this.autoplayBlocked = true;
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      });
    }
  }

  // PREVIEW-ВЕТКА (только при пустом ttsApiBase, т.е. вне LMS): браузерный Web Speech.
  // НЕ копировать как боевой транспорт — на платформе всегда идёт HTTP-ветка playSegment.
  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.handleSegmentEnd(segment), 0); return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    // тег языка/настроения на экран и в Web Speech не нужен — снимаем
    const clean = stripAudioTags(String(segment.text));
    const u = new SpeechSynthesisUtterance(clean);
    const lang = segment.lang || this.currentLang;
    u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
    u.rate = 0.95; u.pitch = 1.0;
    u.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
    };
    u.onend = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    u.onerror = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    this.previewUtterance = u;
    setTimeout(() => { try { synth.speak(u); } catch (e) { this.handleSegmentEnd(segment); } }, 60);
  }

  // Возобновление после блокировки автоплея (по первому жесту).
  resumeIfBlocked() {
    if (!this.autoplayBlocked) return;
    this.autoplayBlocked = false;
    this.playSegment(this.queue[this.currentIdx]);
  }

  handleSegmentEnd(segment) {
    if (segment && segment.waits_for) {
      this.waitingFor = segment.waits_for;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: segment.waits_for });
    } else {
      this.currentIdx++;
      this.playNext();
    }
  }

  playNext() {
    if (this.currentIdx >= this.queue.length) return;
    this.playSegment(this.queue[this.currentIdx]);
  }

  start() {
    this.currentIdx = 0;
    this.waitingFor = null;
    this.playNext();
  }

  triggerEvent(eventType, target) {
    if (!this.waitingFor) return;
    const matches = this.waitingFor.type === eventType &&
                   (this.waitingFor.target === target || !this.waitingFor.target);
    if (matches) {
      this.waitingFor = null;
      this.currentIdx++;
      this.playNext();
    }
  }

  triggerInternalEvent(eventName) {
    const nextIdx = this.queue.findIndex((s, i) => i >= this.currentIdx && s.trigger === `on_event:${eventName}`);
    if (nextIdx !== -1) {
      this.currentIdx = nextIdx;
      this.waitingFor = null;
      this.playNext();
    }
  }

  pushOneOff(text, gender) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: 'manual', waits_for: null, g: gender });
    this.currentIdx = this.queue.length - 1;
    this.playNext();
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }

  stop() {
    if (this.audioEl) {
      try { this.audioEl.pause(); this.audioEl.onended = null; this.audioEl.onerror = null; } catch (e) {}
    }
    // preview-ветка: гасим браузерную озвучку
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);

  // Стабилизация segments по содержимому, не по ссылке (без этого cancel-loop, звук молчит)
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.onStateChange = (s) => setState(prev => ({ ...prev, ...s }));
    // Возобновление по первому жесту, если браузер заблокировал автоплей.
    const resume = () => { if (engineRef.current) engineRef.current.resumeIfBlocked(); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    if (stableSegments && stableSegments.length > 0 && !state.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
        engine.stop();
      };
    }
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      engine.stop();
    };
  // eslint-disable-next-line
  }, [stableSegments, lang]);

  const triggerEvent = useCallback((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const triggerInternal = useCallback((eventName) => {
    if (engineRef.current) engineRef.current.triggerInternalEvent(eventName);
  }, []);
  const replay = useCallback(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.muted;
      if (newMuted && engineRef.current) engineRef.current.stop();
      return { ...prev, muted: newMuted };
    });
  }, []);

  return { ...state, triggerEvent, triggerInternal, replay, toggleMute };
}

// Хелпер: построить audio-segments для экрана из CONTENT
const makeAudioSegments = (screenContent, lang) => {
  if (Array.isArray(screenContent.audio?.[lang])) {
    return screenContent.audio[lang].map((text, i) => ({
      id: `aud_${i}`,
      text,
      trigger: i === 0 ? 'on_mount' : (i === 1 ? 'after_previous' : `on_event:step_${i - 1}`),
      waits_for: i < screenContent.audio[lang].length - 1
        ? { type: 'button_click', target: 'step' }
        : { type: 'button_click', target: 'next' }
    }));
  }
  const text = screenContent.audio?.[lang];
  if (!text) return [];
  return [{ id: 'aud_0', text, trigger: 'on_mount', waits_for: null }];
};

// ============================================================
// БАЗОВЫЕ КОМПОНЕНТЫ
// ============================================================
const Op = React.memo(({ children, size = 'mid' }) => {
  const fontSize = size === 'big' ? 'clamp(25px, 4.7vw, 38px)' :
                   size === 'mid' ? 'clamp(16px, 3vw, 27px)' :
                   'clamp(12px, 2.1vw, 18px)';
  return <span className="mop" style={{ fontSize }}>{children}</span>;
});

const Frac = React.memo(({ n, d, color, size = 'sm' }) => (
  <span className={`frac frac-${size}`} style={{ color }}>
    <span className="n">{n}</span>
    <span className="bar"/>
    <span className="d">{d}</span>
  </span>
));

// mt: рендерит текст, заменяя «a/b» (и «?/b») настоящей дробью Frac — без слэша.
// Если дробей нет, возвращает строку как есть. Применяется во всех видимых текстах.
const FRAC_RE = /(\d+|\?)\/(\d+)/g;
const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (s.indexOf('/') === -1) return s;
  const out = []; let last = 0; let m; let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<Frac key={`mtf${key}`} n={m[1]} d={m[2]} size="sm"/>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};

const AudioIndicator = ({ audioState }) => {
  const { isPlaying, muted, replay, toggleMute } = audioState;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={toggleMute} title={muted ? 'Sound on' : 'Sound off'}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: muted ? T.ink3 : (isPlaying ? T.accent : T.ink2) }}>
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
      {!muted && (
        <button onClick={replay} title="Replay"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: T.ink2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>
      )}
    </div>
  );
};

const FeedbackBlock = ({ show, isCorrect, wrongClass, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (show) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 350);
      }));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(timer);
    }
  }, [show]);
  if (!mounted) return null;
  return (
    <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}>
      <div className={isCorrect ? 'frame-success' : (wrongClass || 'frame-soft')}>{children}</div>
    </div>
  );
};

// Slider — компонент v15 с track-wrap + track-bg + track-fill + glow
const Slider = ({ value, min, max, step = 1, onChange, disabled = false }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="track-wrap">
      <div className="track-bg"/>
      <div className="track-fill" style={{ width: `${pct}%` }}/>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input"
      />
    </div>
  );
};

// Stage — progress + chrome вынесены в отдельный stage-header (sticky, flex-shrink: 0)
const Stage = ({ children, eyebrow, screen, totalScreens, navContent, audioState }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const padH = isMobile ? 12 : 100;
  return (
    <div className="stage">
      <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }}/>
        </div>
        <div className="chrome">
          <div className="chrome-left eyebrow">
            <span className="dot"/>
            <span>{t(eyebrow)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {audioState && <AudioIndicator audioState={audioState}/>}
            <div className="mono small" style={{ color: T.ink3 }}>
              {String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
      <div className="stage-content" style={{ paddingLeft: padH, paddingRight: padH }}>
        {children}
      </div>
      {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
    </div>
  );
};

const NavBack = ({ onPrev, label = 'Назад' }) => (
  <button className="btn-ghost" onClick={onPrev}
    style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
    {label}
  </button>
);

const NavNext = ({ disabled, label, onClick }) => (
  <button className="btn-white-accent" disabled={disabled} onClick={onClick}
    style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>
    {label}
  </button>
);

const NextLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Davom etish' : 'Дальше';
};

const BackLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Orqaga' : 'Назад';
};

// ============================================================
// QUESTION SCREEN — универсальный MC-компонент под формат audio: { intro, on_correct, on_wrong }
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();

  const audio = useAudio([{
    id: `s${idx}_intro`,
    text: c.audio.intro[lang],
    trigger: 'on_mount',
    waits_for: { type: 'option_picked' }
  }]);

  // Веди-до-верного: экран НЕ блокируется на первом ответе.
  // Неверный гаснет и отключается, остальные активны, «Дальше» — только когда выбран верный.
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);  // текущий показываемый вариант
  const [wrong, setWrong]   = useState(() => new Set());                // погашенные неверные
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);

  const pick = (i) => {
    if (solved) return;        // после верного — заблокировано
    if (wrong.has(i)) return;  // уже погашенный неверный — игнор
    const isCorrect = i === correctIdx;

    if (firstTryRef.current === null) {   // фиксируем первую попытку (аналитика)
      firstTryRef.current = isCorrect;
      firstIdxRef.current = i;
    }
    attemptsRef.current += 1;
    setPicked(i);

    if (!introAdvancedRef.current) {      // продвинуть intro-очередь один раз
      introAdvancedRef.current = true;
      audio.triggerEvent('option_picked');
    }

    if (isCorrect) {
      setSolved(true);
      sfx.playCorrect();
      onAnswer({
        stage: screenMeta?.scope ?? null,
        screenIdx: idx,
        question: typeof question === 'string' ? question : null,
        options: options.map(o => typeof o === 'string' ? o : null),
        correctIndex: correctIdx,
        correctAnswer: typeof options[correctIdx] === 'string' ? options[correctIdx] : null,
        studentAnswerIndex: firstIdxRef.current,                                   // ПЕРВЫЙ выбор
        studentAnswer: typeof options[firstIdxRef.current] === 'string' ? options[firstIdxRef.current] : null,
        correct: firstTryRef.current,                                              // верность ПЕРВОЙ попытки
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true
      });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }

    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || c.audio.on_wrong[lang];
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            if (solved) {
              if (i === correctIdx) cls += ' option-correct';
              else if (isWrongPicked) cls += ' option-picked-wrong';
              else cls += ' option-wrong';
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : T.ink3 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass={c[`hint_${picked}`] ? 'frame-tip' : undefined}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {mt(solved ? t(c.correct_text) : t(c[`hint_${picked}`] || c[`wrong_${picked}`] || c.wrong_default))}
          </p>
        </FeedbackBlock>
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// ============================================================
// NUM INPUT SCREEN — числовой ввод: веди-до-верного + наводящая подсказка, счёт первой попытки.
// ============================================================
const NumInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();
  const correct = Number(correctValue);
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [value, setValue] = useState(wasSolved ? String(correct) : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = parseInt(value, 10); if (isNaN(v)) return;
    const isCorrect = v === correct;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(v); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: String(correct), studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c.audio_hint && c.audio_hint[lang]) || (c.hint && c.hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {c.base && <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 }}>{t(c.base)}</span>}
          {c.base && <span className="mop">≈</span>}
          <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};
```

### 8.2. Majburiy yordamchilar — shuffleMC, ConnectionsBlock va FaktCard bloki (aynan
ko'chir; CONTENT'da summary-ekranga `conn_label_refs`, `conn_refs`, `conn_label_next`,
`conn_next` maydonlari bo'lishi shart — ru+uz). Eslatma: FactCard kodidagi "без аудио"
izohi pilotdan qolgan — endi 5-A bo'yicha qisqa ovozli jumla on_correct oxiriga qo'shiladi;
FACT_BADGE matnini fakt yo'nalishiga mosla:

```jsx
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// ============================================================
// ФАКТ-БЛОК (IT) — пилот: маленькая карта с мини-анимацией, не мешает основному.
// Только визуал (без аудио), чтобы не конкурировать с основным нарративом.
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
// Мини-анимации (CSS-only, без set-state-in-effect)
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const AnimBattery = () => (<div className="fa-bat"><div className="fa-bat-fill"/><span className="fa-bat-tip"/></div>);
const AnimSlider = () => (<div className="fa-sld"><div className="fa-sld-track"/><div className="fa-sld-knob"/></div>);

const FactCard = ({ text, anim }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(FACT_BADGE)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};
```

### 8.3. Korneviy komponent — shablon (funksiya nomini darsga mosla, masalan
`FractionSubDiffDenLesson`; `screens` massivini o'z Screen'laringga mosla; qolgan mantiq —
payload tuzilishi, finishLesson, preview til-almashtirgich — aynan qoladi):

```jsx
// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionAddSameDenLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0); useEffect(()=>{window.__goScreen=(i)=>setCurrent(i);window.__total=TOTAL_SCREENS;},[]);/*SCROLLPROBE*/
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
  const scored = SCREEN_META.filter(s => s.scored);
  const finalScreens = scored.filter(s => s.scope === 'final');
  const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && a.correct).length;
  const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
  const payload = {
    lessonId: LESSON_META.lessonId,
    lessonTitle: LESSON_META.lessonTitle,
    durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
    totalQuestions: scored.length,
    correctAnswers: correctCount,
    scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
    finalScore: finalCorrect,
    finalTotal: finalScreens.length,
    passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
    firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
    answers: answers.filter(Boolean)
  };
  safeOnFinished(payload);
}, [answers, safeOnFinished]);

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
    </LangContext.Provider>
  );
}
```

### 8.4. STYLES — bazaviy CSS (Dars15 ning kompakt, scroll'siz versiyasi; fakt-blok CSS'i
ham kiritilgan — `.fact-*`/`.fa-*`). Aynan ko'chir; oxiriga FAQAT o'z darsingning MATH-CSS
qo'shimchalarini ilova qil va backtick bilan yop:

```jsx
const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  height: 100dvh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
}

/* Reset margins для типографики внутри урока */
.lesson-root h1,
.lesson-root h2,
.lesson-root h3,
.lesson-root h4,
.lesson-root h5,
.lesson-root h6,
.lesson-root p,
.lesson-root ul,
.lesson-root ol { margin: 0; padding: 0; }

.title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: "opsz" 60; }
.display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: "opsz" 60; }
.italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; font-variation-settings: "opsz" 60; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; font-weight: 400; }
.frac .n, .frac .d { padding: 0 0.12em; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }

@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
.delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }

/* === КНОПКИ v15 (тени вместо рамок) === */
.btn {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #0E0E10;
  color: #F6F4EF;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32);
}
.btn:hover:not(:disabled) {
  background: #FF4F28;
  box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45);
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-white-accent {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #FFFFFF;
  color: #FF4F28;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12);
}
.btn-white-accent:hover:not(:disabled) {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55);
}
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }

.btn-ghost {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #0E0E10;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: none;
}
.btn-ghost:hover:not(:disabled) {
  background: #FFFFFF;
  box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18);
}
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

/* === ОПЦИИ v15 (без рамок, на тенях) === */
.option {
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  text-align: left;
  border-radius: 12px;
  width: 100%;
  border: none;
  color: #0E0E10;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.option:hover:not(:disabled) {
  background: #FDFBF7;
  box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22);
}
.option:disabled { cursor: default; }
.option-correct {
  background: #E3F0E8 !important;
  color: #1F7A4D !important;
  box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important;
}
.option-wrong {
  background: #FFFFFF !important;
  color: #A7A6A2 !important;
  opacity: 0.55 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important;
}
.option-picked-wrong {
  background: #FFE8E1 !important;
  color: #FF4F28 !important;
  box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important;
}

/* === ТИПОГРАФИКА v15 (× 0.85 upper bounds) === */
.h-title { font-size: clamp(22px, 3.4vw, 30px); }
.h-sub { font-size: clamp(16px, 2.2vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(20px, 3.2vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(8px, 1.4vw, 12px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(8px, 1.3vw, 12px);
  padding-bottom: clamp(12px, 2.2vw, 20px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.stage-nav {
  flex-shrink: 0;
  background: #F6F4EF;
  border-top: 1px solid rgba(167, 166, 162, 0.25);
  padding-top: clamp(9px, 1.5vw, 11px);
  padding-bottom: clamp(9px, 1.5vw, 11px);
  display: flex;
  gap: 12px;
}

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FF4F28;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.55);
}

/* === PROGRESS v15 (с orange glow) === */
.progress-track {
  height: 3px;
  background: rgba(167, 166, 162, 0.25);
  width: 100%;
  margin-bottom: 12px;
  border-radius: 99px;
  overflow: visible;
}
.progress-bar {
  height: 100%;
  background: #FF4F28;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
  box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40);
}

/* === SLIDER v15 (track-wrap + track-bg + track-fill + glow + круговая тень handle) === */
.track-wrap {
  position: relative;
  height: 26px;
  margin: 18px 0;
  display: flex;
  align-items: center;
}
.track-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: rgba(167, 166, 162, 0.30);
  border-radius: 99px;
  pointer-events: none;
}
.track-fill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #FF4F28;
  border-radius: 99px;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40);
  transition: width 0.15s ease-out;
}
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  width: 100%;
  height: 24px;
  background: transparent;
  outline: none;
  margin: 0;
  cursor: grab;
  z-index: 2;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.1s;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

/* === INPUT v15 (без рамок, на тенях) === */
.answer-input {
  font-family: 'Fraunces', serif;
  font-size: clamp(22px, 4vw, 27px);
  font-weight: 400;
  text-align: center;
  border-radius: 12px;
  background: #FFFFFF;
  padding: 8px 12px;
  outline: none;
  border: none;
  color: #0E0E10;
  transition: all 0.2s;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.answer-input:focus {
  box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20);
}
.answer-input.correct {
  background: #E3F0E8;
  color: #1F7A4D;
  box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30);
}
.answer-input.wrong {
  background: #FFE8E1;
  color: #FF4F28;
  box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36);
}

/* === FRAMES v15 (без рамок, на тенях; polosa-исключение в soft/success) === */
.frame {
  background: #FFFFFF;
  border-radius: 16px;
  padding: clamp(13px, 2.2vw, 17px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
}
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(11px, 1.8vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(11px, 1.8vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}


/* MATH: анимация появления цифры в квадрате. */
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(11px, 1.8vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(64px, 13vw, 92px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
/* MUHIM: fakt-animatsiya o'z chegarasidan CHIQMASIN — overflow:hidden majburiy; bolani transform:scale() bilan kattalashtirib oshirib yuborma, Anim-komponentni shu qutiga moslab yoz. */
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(13px, 1.6vw, 14px); line-height: 1.45; color: #0E0E10; }
/* progress bar fill loop */
.fa-prog { width: 50px; height: 12px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.4s ease-in-out infinite; }
@keyframes faProg { 0% { width: 8%; } 60% { width: 75%; } 100% { width: 8%; } }
/* battery drain loop */
.fa-bat { position: relative; width: 46px; height: 22px; border: 2px solid #019ACB; border-radius: 5px; padding: 2px; }
.fa-bat-tip { position: absolute; right: -5px; top: 6px; width: 3px; height: 8px; background: #019ACB; border-radius: 0 2px 2px 0; }
.fa-bat-fill { height: 100%; border-radius: 2px; animation: faBat 2.8s ease-in-out infinite; }
@keyframes faBat { 0% { width: 90%; background: #1F7A4D; } 50% { width: 28%; background: #FF4F28; } 100% { width: 90%; background: #1F7A4D; } }
/* slider knob loop */
.fa-sld { position: relative; width: 52px; height: 22px; display: flex; align-items: center; }
.fa-sld-track { width: 100%; height: 4px; border-radius: 99px; background: rgba(1, 154, 203, 0.25); }
.fa-sld-knob { position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%; background: #019ACB; transform: translateY(-50%); box-shadow: 0 0 8px rgba(1, 154, 203, 0.5); animation: faSld 2.6s ease-in-out infinite; }
@keyframes faSld { 0% { left: 62%; } 50% { left: 4%; } 100% { left: 62%; } }

/* MATH: [dars_id] — shu darsning vizualizator-CSS qo'shimchalari SHU YERGA qo'shiladi. */
`;
```

---

## 9. YAKUNIY CHEK-LIST (natijani topshirishdan oldin o'zing tekshir)

**Struktura**
- [ ] 13–16 ekran, yoy: hook → exploration×2-3 → rule → test×5 → case → final → summary
- [ ] SCREEN_META: har ekran tipi to'g'ri; scored=true faqat 6 testda (5 practice + 1 final)
- [ ] Hook s0 — qaytishda picked tozalanadi; testlar — storedAnswer'dan tiklanadi
- [ ] Summary hookni yopadi + ConnectionsBlock (conn_refs / conn_next ru+uz)

**Hikoya bog'lanishi (4-A — asosiy qoida)**
- [ ] Har ekran oldingisiga linker so'z bilan bog'langan (Demak/Endi/Yodingizdami…); syujet ipi
      uzilmaydi; dars bitta uzluksiz hikoya, alohida ekranlar yig'indisi emas

**Animatsiya va vizual (metodist talabi 2026-06-13/15)**
- [ ] s0 (birinchi ekran) — harakatlanuvchi animatsiya bilan boshlanadi (statik emas)
- [ ] Ortib qolgan bo'sh joy harakatli animatsiya bilan boyitilgan (chalg'itmaydigan, loop'li)
- [ ] **HARAKAT UZLUKSIZ — HAR ekranda (s0..N) loop/ambient bor; s3/s4 step/slayder ekranlari
      qadamlar tugagach STATIK bo'lib qolmaydi** (2026-06-15 nuqson)
- [ ] Fakt-kartalarda animatsiya KATTA, lekin `.fact-anim`da `overflow: hidden` — Anim qutidan
      CHIQMAYDI (scale bilan oshirilmagan); matn kam
- [ ] Rang faqat palitra + tip-sariq/fakt-ko'k oilalari; off-palette hex yo'q; animatsiya
      rangni glitch qilib almashtirmaydi (2026-06-15 nuqson)
- [ ] Feedback faqat rangga tayanmaydi (✓/✗ ikonka/shakl); ikonka MATNGA YOPISHMAGAN (flex+gap)
- [ ] STYLES'da `prefers-reduced-motion` media-so'rovi bor (animatsiyalar so'ndiriladi)

**Testlar**
- [ ] Har MC'da shuffleMC, qat'iy order, to'g'ri javob A/B/C/D bo'ylab taqsimlangan
- [ ] Har noto'g'ri variantga aniq wrong_N izoh (misconceptionga mos)
- [ ] Kamida 1 NumInputScreen, placeholder neytral
- [ ] Test vizuallari natijani oshkor qilmaydi (winner-flag yo'q)
- [ ] Savol turlari ALMASHTIRILGAN (3-bo'lim palitrasidan, faqat MC emas); har scored turda
      веди-до-верного + hint + firstTry + storedAnswer tiklash ishlaydi
- [ ] Javob bardoshli tekshiriladi: `0,5`=`0.5`, ekvivalent kasrlar (`4/6`=`2/3`) qabul
      qilinadi (agar mavzu aniq shaklni talab qilmasa); qiymat solishtiriladi, string emas
- [ ] Prerekvizit bo'lsa — s1 da "o'tgan dars" qayta-eslash mikro-savoli bor, conn_refs ga mos

**Til**
- [ ] **TIL TO'LIQLIGI (2026-06-15 nuqson): har kalitda ru VA uz bo'sh emas; ru/uz massivlar
      bir xil uzunlikda; JSX'da qo'lda bir tilli/kirill matn yo'q (NavBack labelsiz emas) —
      "uz darsda ruscha so'z" fallback orqali chiqmasin**
- [ ] Yopishgan so'z yo'q: JSX'da `}{` (ikonka+matn) bo'shliq/flex+gap bilan; stringlarda ham
- [ ] uz lotin, kirill-aralashuv 0
- [ ] siz-register: sen/imperativ/-sang/o'zing — 0 (case-insensitive skan + qo'lda o'qish)
- [ ] Apostrof `'`; uz-stringlar qo'shtirnoqda; SOV
- [ ] Kasr o'qilishi: maxrajdan-surat ("oltidan besh" = 5/6), sanashda ham

**Audio**
- [ ] Belgilar (%, /, ×, =, +, −, <, >) va «» tirnoqlar — 0; hammasi so'z bilan
- [ ] Kasrlar so'z bilan; bir segment = bir fikr; audio vizualni takrorlamaydi

**Faktlar va layout**
- [ ] 2-3 ta fakt (`fact` {ru,uz}): mazmunga mos mini-animatsiya bilan, factOnCorrect orqali;
      ovoz standart qisqa (~8–14 so'z) YOKI kerakli faktда to'liq o'qiladi (TTS qoidalariga mos)
- [ ] Har fakt kerakli joyda misol bilan ochilgan; NEGA shu darsда/slaydda ekani linker so'z
      bilan qisqa, ma'noli aytilgan (mavzuga ulangan, "shunchaki qiziqarli" emas)
- [ ] Faktlar faqat to'g'ri javobdan keyin ochiladi (help/summary'da emas); "faktlar metodist
      tasdig'ini talab qiladi (draft)" deb belgilangan
- [ ] Hech bir ekranda scroll yo'q — 1280×800 va 390×844 da tekshirilgan
- [ ] Slaydlarda sarlavha-blok yo'q; katta bo'sh joylar yo'q; svyortkalar ochilganda ham
      scroll chiqmaydi
- [ ] Agar tanlangan bo'lsa: "noto'g'risini top" testida XATO so'zi ta'kidlangan;
      drag-and-drop'da storedAnswer tiklanadi, mobil touch ishlaydi

**Texnika**
- [ ] Infra Dars15 bilan baytma-bayt; fayl UTF-8 BOM'siz LF
- [ ] Vizualizatorlar modul darajasida, o'z CSS-nomfazosi `/* MATH: ... */` bilan
- [ ] `npm run build` o'tdi; eslint taqsimoti Dars15 bazasiga mos, yangi rule-id yo'q
- [ ] App.jsx'da registratsiya (slug, "Урок NN." titul, lazy import)
- [ ] UZ terminologiya "draft — o'zbek metodisti validatsiyasi kutilmoqda" deb belgilangan

Hisobotni metodistga shu tartibda ber: nima qurildi (ekranlar ro'yxati) → tekshiruv natijalari
(build/eslint/skanlar) → ochiq savollar (agar bo'lsa). Maqtovsiz, emodjisiz, aniq.
