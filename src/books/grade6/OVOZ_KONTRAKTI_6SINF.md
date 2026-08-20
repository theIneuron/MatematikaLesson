# 6-sinf: OVOZ (TTS) KONTRAKTI va LMS ga yuklash

> ## ⚠ LMS ga QAYSI FAYLNI yuklash kerak
>
> Platformada `src/components/grade6/...` ichidagi manba fayllari ISHLAMAYDI:
> ular lokal importlarga tayanadi (`./Grade6TheoryTheme.css`,
> `../Grade6Question.jsx`, `./D01_01.jsx` va boshqalar), LMS esa faqat tashqi
> paketlarni beradi. Manba fayli yuklansa, «Darsni kompilyatsiya qilib bo'lmadi
> — Modul topilmadi» xatosi chiqadi.
>
> LMS ga FAQAT yig'ilgan avtonom fayllar yuklanadi:
>
> | Nima | Papka | Fayl nomi | Soni |
> |---|---|---|---|
> | Nazariy dars | `lms-grade6-standalone/` | `Dars01.jsx` … `Dars46.jsx` | darsga 1 fayl (46) |
> | Amaliyot topshirig'i | `lms-grade6-practice-standalone/darsNN/` | `D01_01.jsx` … `D01_10.jsx` | darsga 10 fayl (460) |
>
> Amaliyot BITTALAB yuklanadi: platforma har bir topshiriqni alohida
> jsx-question sifatida oladi va «Tekshirish» tugmasini o'zi beradi. Shuning
> uchun bir darsdan 10 fayl chiqadi, `PracticeHost` esa LMS ga kirmaydi (u
> faqat lokal preview uchun).
>
> **`React` DEFAULT importi SHART** (amaliyot fayllarida). LMS jsx ni KLASSIK
> rejimda (`React.createElement`) kompilyatsiya qiladi, lokal vite esa
> "automatic runtime" da — shuning uchun faqat hook'lar import qilingan fayl
> lokal previewda ishlaydi, LMS da esa «React is not defined» beradi.
> Grade5 amaliyot fayllari ham shu naqshda: `import React, { ... } from 'react'`.
> Buni tekshiruv skripti ushlaydi (negativ sinov bilan tasdiqlangan).
>
> Qayta yig'ish (kontent yoki dvijok o'zgarsa MAJBURIY):
> ```powershell
> node scripts/build-grade6-lms.mjs 1-46            # nazariy (46 fayl)
> node scripts/build-grade6-practice-lms.mjs 1-46   # amaliyot (460 fayl)
> node scripts/build-grade6-lms.mjs --check
> node scripts/build-grade6-practice-lms.mjs --check
> node scripts/grade6-lms-theory-check.mjs 1-46     # NAZARIY: LMS rejimida render
> node scripts/grade6-practice-lms-check.mjs        # AMALIYOT: LMS rejimida render
> ```
>
> 2026-08-15 dan dars obvyazkasi `screens.jsx` da yashaydi va LMS fayliga
> sborshchik tomonidan ICHKARIGA qo'yiladi. Shu joyni faqat
> `grade6-lms-theory-check.mjs` ushlaydi: brauzer testi MANBANI ochadi, LMS ga
> esa boshqa fayl ketadi.
> Ikkala papka ham `.gitignore` da — git da saqlanmaydi, LMS ga qo'lda yuklanadi.

---


> 2026-08-04. Metodist topshirig'i: «LMS da ba'zi joyda ovoz bor, ba'zi joyda yo'q»
> muammosini yopish va har bir slaydga o'z ovozini berish.

---

## 1. Muammo nima edi

Dvijok slayd ovozini faqat `audio` (savollarda `intro`) maydonidan olardi. Maydon
bo'sh qolsa, TTS navbatiga `undefined` tushib, ekran **jimjit** o'tib ketardi.
Ekranda matn ko'rinardi, ovoz esa yo'q — muammo faqat platformada sezilardi.

Uch xil sabab bir vaqtda ishlagan edi:

| Sabab | Natija | Qanday tuzatildi |
|---|---|---|
| `audio`/`intro` bo'sh slaydlar | ekran jimjit | dvijokda `slideNarration` / `revealNarration` zaxirasi |
| AudioEngine bitta umumiy instans, yangi ekran uning mute holatini bilmasdi | ayrim slaydlar ovozsiz, tugma «ovoz yoqilgan» ko'rinishida | `useAudio` mute holatini engine'dan oladi va `setMuted` bilan yozadi |
| uzun tire va tipografik apostrof TTS ga xom ketardi | uzbek so'zlari buzilar, tire o'qilmasdi | `toTtsMath` ichida `typographySafe` normalizatsiyasi |

---

## 1a. TIL MARKERI (ElevenLabs talaffuzi) — 2026-08-04

LMS dagi ElevenLabs tilni matn alifbosidan o'zi taxmin qilardi va lotin
yozuvidagi o'zbek matnini **ruscha (ba'zan inglizcha) talaffuzda** o'qirdi.
Metodist qarori: har bir ovoz yo'lakchasi til markeri bilan yuboriladi.

```
[O'zbekcha tallaffuz]      — uz yo'lakchalari
[Русское произношение]     — ru yo'lakchalari
```

Markerni **dvijok qo'yadi**, kontentga yozish shart emas: `buildTtsUrl(base,
text, gender, lang)` matn boshiga markerni qo'shadi. Shu sababli:

- 1152 ta audio qatorni qo'lda o'zgartirish kerak bo'lmadi;
- marker ekranda ko'rinmaydi (`stripAudioTags` uni matndan oladi) va
  brauzer Web Speech previewiga ham tushmaydi;
- kontentda marker allaqachon bo'lsa, ikkinchisi qo'shilmaydi;
- til `segment.lang` yoki ekran tilidan olinadi; ikkisi ham bo'lmasa
  alifbodan aniqlanadi (kirill = ru, lotin = uz);
- kvadrat qavslar URL da ataylab kodlanmaydi (`%5B` emas, `[`) — server
  markerni ko'rishi kerak.

Tekshirish: `node scripts/grade6-audio-smoke.mjs 1-46` har bir yo'lakchada
marker borligini va ikkilanmaganini tekshiradi. Ovoz muammosi qaytsa, avval
so'rov matnini ko'ring: marker matn BOSHIDA turishi shart.

---

## 2. Ovoz qayerdan olinadi (zaxira tartibi)

`FractionTheoryLesson.jsx`:

```js
slideNarration(slide, lang)   // audio -> intro -> title -> prompt -> subtitle -> steps
revealNarration(slide, lang)  // audio (massiv) -> steps -> slideNarration
```

- **title / summary / finalChain / hook** — `slideNarration`.
- **info / rule** — `revealNarration`: `audio` MASSIV bo'lishi shart, har bir qatori
  bitta qadamni ovozlaydi.
- **question / multi / match / classify** — `slideNarrationByLanguage(slide)`
  (`intro` bo'lmasa sarlavha va savol o'qiladi).

Zaxira bor, lekin u **oxirgi chora**. Har bir slaydga avtorlik `audio` yozilishi
kerak: ekran matnini takrorlamaslik, ovoz ekrandan **kengroq** bo'lishi shart.

`Dars07.jsx` da ham shu tartib: `D7RevealScreen` avval `slide.audio` ni tekshiradi.

---

## 3. Kontent formati

**Inline darslar (Dars07–Dars15):** slayd ichida
```js
audio: {
  uz: ["...", "...", "..."],
  ru: ["...", "...", "..."],
},
```
massiv uzunligi `steps` soniga TENG.

**Grade6TheoryData16_26.js:** `info(title, steps, visual, eyebrow, audio)` — audio
5-o'rinda; `rule(title, steps, visual, audio)` — 4-o'rinda.

**Grade6TheoryData27_46.js:** `C(title, steps, visual, rule, audio)` — audio 5-o'rinda.

---

## 4. Ovoz matni qoidalari

- Ovoz — ekran matnining nusxasi emas: o'qituvchi tilida qayta aytilgan izoh
  (bog'lovchilar: «Qarang», «Endi», «Eslab qoling», «E'tibor bering» / «Смотрите»,
  «Теперь», «Запомните», «Обратите внимание»). Slaydda yo'q yangi son va fakt
  KIRITILMAYDI.
- Bitta qator = bitta tugallangan fikr (1–2 gap).
- RU — «вы» ga murojaat, buyruq shakli (Сравните, Найдите). UZ — `siz` shakli,
  LOTIN yozuvi, SOV tartibi, apostrof faqat ASCII `'`.
- Barcha belgilar SO'Z bilan: `= + − × · : / % < > ² ³ ° π` va kasrlar.
  Dvijok (`toTtsMath`) ularni o'zi ham aylantiradi, lekin kontentda so'z bilan
  yozish afzal — matn shunda tabiiy o'qiladi.
- Kirill harfi UZ qatorida BO'LMAYDI.

---

## 5. Tekshirish (har o'zgarishdan keyin)

```powershell
# 1. Ma'lumot modullari buzilmaganini tekshirish
node -e "import('file:///C:/Users/USER/MatematikaLesson/src/components/grade6/Grade6TheoryData27_46.js').then(m=>console.log('OK',Object.keys(m.GRADE6_THEORY_27_46).length))"

# 2. Ovoz smoke-testi: har bir ekranda TTS navbati matn bilan boshlanadimi
#    va har bir yo'lakchada TIL MARKERI bormi
npx vite --port 5199            # alohida terminalda
node scripts/grade6-audio-smoke.mjs 1-46
#    MUHIM: test paytida boshqa Playwright/og'ir jarayon ishlamasin —
#    render kechikkanda test darsni «tugagan» deb hisoblab qolishi mumkin.

# 3. Sayt sborkasi
npm run build

# 4. LMS fayllarini qayta yig'ish (kontent yoki dvijok o'zgarsa MAJBURIY)
node scripts/build-grade6-lms.mjs 1-46
node scripts/build-grade6-lms.mjs --check
```

`scripts/grade6-audio-smoke.mjs` brauzerda darsni ochadi, TTS so'rovlarini
ushlaydi va JIMJIT ekranni nomi bilan aytadi. 2026-08-04 holati: 1–46, RU va UZ —
jimjit ekran yo'q.

---

## 6. EKRAN QULFI (metodist qarori 2026-08-05)

> ⚠ **2026-08-20, metodist qarori: QULF BUTUN SINFDA YOQILDI.** «Davom» tugmasi
> slayd ovozi TO'LIQ aytilgandan keyin ochiladi.
> 2026-08-13 da qulf 1-dars uchun o'chirilgan edi, lekin `navLock: false` shablon
> orqali 46 darsning HAMMASIGA tarqalgan edi — ya'ni qulf amalda hech qayerda
> ishlamasdi. Endi darslar `navLock` ni umuman uzatmaydi, qatlamdagi standart
> qiymat `true`.
>
> Klapan ham to'g'rilandi: NAV_UNLOCK_MS taymeri ilgari HAR DOIM ishlardi va uzun
> izohli slaydda qulf to'qqizinchi soniyada ochilardi. Endi taymer faqat ovoz
> BOSHLANMAGAN holatda ishlaydi — ya'ni TTS javob bermasa. Ovoz o'chirilgan
> bo'lsa qulf yo'q: dars ovozsiz ham to'liq o'tiladi (tekshirilgan brauzerda:
> ovoz bilan tugma 35-soniyada, ovozsiz 15-soniyada ochildi).

«Davom» tugmasi ovoz tugamaguncha ochilmaydi.

**Ilgari qanday edi.** 6-sinfda `FREE_NAV` degan flag YO'Q, ekranlar esa
`NavNext` ga `disabled` propini uzatib turardi. Lekin `NavNext` bu propni
QABUL QILMASDI — ya'ni qulf hech qachon ishlamagan, tugma har doim faol edi.
CSS da `.btn-white-accent:disabled` uslubi allaqachon bor edi, demak qulf
mo'ljallangan, lekin ulanmagan qolgan.

**Endi qanday.** `NavNext` `disabled` ni qabul qiladi va `useAudio`
`canAdvance` qiymatini qaytaradi:

```js
canAdvance = muted || navTimedOut || (hasStarted && !isBusy)
```

Ya'ni tugma ovoz BOSHLANIB, TUGAGANDAN keyin ochiladi. Faqat `isBusy` ga
tayanish yetarli emasdi: ekran ochilgandan TTS yuklanguncha oradagi bir necha
yuz millisekundda tugma faol bo'lib turardi.

**Ikki xavfsizlik klapani** (3-sinfda qulf darsni qotirib qo'ygani uchun):
1. ovoz o'chirilgan bo'lsa (`muted`) qulf ishlamaydi;
2. TTS javob bermasa, `NAV_UNLOCK_MS` (9 s) dan keyin qulf o'zi ochiladi.

Savol ekranlarida tugma bundan tashqari `!solved` shartiga ham bog'liq — bu
oldindan shunday edi va o'zgarmadi.

**Tekshirilgani:** ovoz ketayotganda tugma yopiq; to'g'ri javobdan va izoh
tugagandan keyin ochiladi (kutish 5–8 s); ovoz o'chirilganda va TTS javob
bermaganda dars qotib qolmaydi.

**Test cheklovi:** `grade6-audio-smoke.mjs` javoblarni bilmaydi, shuning uchun
bir nechta javobli va moslashtirish ekranlarida to'xtab qolishi mumkin. Bu
darsning nuqsoni EMAS: to'g'ri javob berilganda tugma ochilishi alohida
tekshirilgan. Ovoz qoplamasi qulf yoqilishidan OLDIN to'liq tekshirilgan
(46 dars, 1914 yo'lakcha, 0 muammo).
