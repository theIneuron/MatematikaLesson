# 1-SINF ETALONI — Dars01 (`num-1-01-v1`)

> **Dars01 — 1-sinf darslarining rasmiy etaloni.** Har bir YANGI 1-sinf darsi shu
> hujjatdagi kontraktga va Dars01.jsx naqshlariga to'liq mos qilib yaratiladi
> (5-sinfdagi etalon_v14 ning 1-sinf muqobili). Bu — "taxminan o'xshash" emas,
> **bir xil standart**. Kod nusxasi (copy source) — Dars01.jsx; spec — shu hujjat.

---

## 0. DARS YARATISHNING BIRINCHI QADAMI — PERSONAJ ISMLARINI SO'RASH

Har dars boshida **metodistdan personaj ismlarini so'rash SHART**:
- Ushbu darsda qaysi personajlar ishtirok etadi?
- Ularning ismlari?

Sabab: cast bitta umumiy syujet atrofida kengayadi. Hozir asosiy ikkitasi —
**Ra'no** (syujet yetakchisi) va **Anvar** (mehmon/do'st). **Reja bo'yicha yana 2 ta
personaj qo'shiladi**, ular ham Ra'no–Anvar syujetiga ulanadi va **alohida
chiziladi** (yangi SVG komponent). Yangi personaj qo'shilganda:
1. Yangi SVG komponent chiziladi (mavjudlari uslubida: gradient soya, panja, oyoq
   soyasi, `g1-eyes` pirpiratish).
2. CONTENT'da ismi va `*_label` maydonlari beriladi (RU+UZ).
3. Syujetga mantiqan ulanadi.

Ismlar — har doim **o'zbekcha** (Ra'no, Anvar, Zaynab, Bekzod, Alisher…).

---

## 1. PERSONAJ TIZIMI (SVG, animatsiya)

- Personajlar — **koddan SVG** (PNG emas): `RanoSVG` (kanonik yetakchi —
  `DressStars` ham shuni ishlatadi), `AnvarSVG` (mehmon), `BitSVG` (robot
  boshlovchi). Uslub: sayqalli flat-vector + gradient soya.
- **Bit = boshlovchi/diktor**, syujetdan tashqarida: salomlashadi, darsni ramkalaydi
  (`present` overlay — sIntro/sGuest/yakun ekranlarida), **bitta erkak ovoz** bilan
  butun darsni hikoya qiladi. Ra'no/Anvar o'z ovozi bilan gapirmaydi (Bit 3-shaxsda).
- **Animatsiya HTML o'rovchida** (`.g1-cast-fig` / `.g1-dress`), `<svg>` ildizida EMAS.
  > Muhim: `<svg>` ildizida `transform-box: fill-box` bilan transform brauzerda
  > ko'rinmaydi. Idle/sakrash o'rovchi `<div>`ga qo'yiladi (kafolatli ishlaydi).
- Ra'no **hamma joyda bir xil** (yagona `RanoSVG` manbai). s4 ko'ylakdagi yulduzlar
  — `stars` prop orqali qo'shimcha, lekin ayni Ra'no.

## 2. BIT-KARTOCHKA — har javobda

- **Har javobda** (to'g'ri ham, xato ham) `Reaction` → `.g1-bitcard` chiqadi:
  **chapda animatsion Bit, o'ngda matn** (5-sinf fakt-kartochka uslubi).
  To'g'ri → Bit `happy` (sakraydi); xato → Bit `hint` (qiyshayadi).
- **Xato javob matni YO'NALTIRADI, javobni OCHMAYDI:** usulni ko'rsatadi
  ("bittadan sanang", "qaytadan, diqqat bilan", "ko'proq/kamroq"), aniq sonni
  aytmaydi. Rag'bat so'zlari **navbat bilan, takrorlanmasdan** (`nextEncourage`).
- Pastki-chap overlay'da Ra'no YO'Q (faqat Bit `present` ramka ekranlarida).

## 3. SAHNALAR (SceneBg)

- Hikoya ekranlarida orqa sahna: **`SceneBg`** — `room` (deraza, parda, stol/dasturxon,
  devorda mushuk-rasm) va `door` (eshik, shkaf, gul, mushuk-rasm).
- **Masshtab qulflangan:** sahna `aspect-ratio: 400/230` (fon viewBox bilan bir xil)
  + `container-type: size` + personajlar `cqh`, stol `cqw`. Shunda fon va personajlar
  **birga** miqyoslanadi, proporsiya buzilmaydi. SceneBg svg — `preserveAspectRatio
  ="xMidYMax meet"` (elementlar qirqilmaydi).
- Real masshtab: personaj ~165 sm; deraza ~123 sm bo'yi, tokcha ~80 sm; eshik shkaf
  balandligida (tepaga cho'zilmaydi). Stol — `DasturxonScene` (batafsil: non, choynak+
  bug', olma, milliy naqsh).

## 4. WIDGETLAR

- **`BasketArt`** — toza SVG savat (egma to'qilgan dasta, konus tana, egri to'qima,
  oval gardish). Olmalar gardishdan ko'rinadi. Yakuniy bayram + o'yin-zonada. CSS
  clip-path savat ISHLATILMAYDI (qo'pol).
- Sanash animatsiyalari: `CountDemo`, `CountExamples`, `CountTrack`, `CountingHand`
  (5 barmoq). Yakunda **bitta** animatsiya (ikki raqobatlashuvchi animatsiya — yomon).

## 5. AUDIO + REGISTER

- **Audio (TTS-toza):** sonlar so'z bilan (bir, ikki, uch…); tirnoq, matematik belgi
  (× = + % /), kasr-literal YO'Q; **ro'yxat oldidan ikki nuqta YO'Q**, izohli **uzun
  tире YO'Q** (ovozda); bitta segment = bitta fikr; RU/UZ juftligi to'liq.
- **Register:** RU — **ты** (norasmiy, kurs standarti); UZ — **siz** (rasmiy:
  -ng/-ing; "sen" — `sana`, `ayt`, `top`, `et`, `o'yla` — TAQIQLANGAN). Apostrof —
  oddiy `'`. UZ-stringlar JS'da ikki tirnoqda. Bit murojaati: "Salom, do'stim" (yakka).
- Atama: `raqam` (цифра, belgi) ≠ `son` (число, miqdor) — ma'noga qarab.

## 6. EKRAN TUZILISHI

- **15 ekran**, tepada yulduz-kopilka YO'Q. Tartib (Dars01):
  hook(tanishuv) → hook(jumboq) → exploration → exploration → rule → test →
  exploration → rule → test → exploration → test → o'yin → hook(ko'prik) →
  test(final) → summary.
- SCREEN_META `scope`: faqat `null` / `'hook'` / `'module-mikro'` / `'final'`.
- Hook qaytishda to'liq reset (`useState(null)`); test `storedAnswer`'ni tiklaydi.
- **"Davom" tugmasi faollashganda belgi beradi**: `NavNext` da `disabled` o'chgan zahoti
  `.btn-ready` (to'q aksent fon + `btnReadyPulse` puls) yonadi — bola bosish vaqtini
  ko'radi. `prefers-reduced-motion` da puls o'chadi, to'q rang qoladi. (dizayn: §Tugmalar.)
- payload (`onFinished`): lessonId, lessonTitle, durationSec, totalQuestions,
  correctAnswers, scorePercent, finalScore, finalTotal, passed, answers.

## 7. PIPELINE (har dars uchun)

`[0]` personaj ismlarini so'rash → `[1]` skeleton → `[2]` content (RU+UZ+audio) →
`[3]` jsx (infratuzilma + bu etalondan personaj/sahna/savat/Bit-kartochka nusxasi) →
`[4]` qa → `[5]` knowledge-updater. Har dars — **mustaqil `.jsx`** (faqat React import;
butun infratuzilma ichida — artifacts'da prokliklash uchun).

## 8. PRODUCTION

- `FREE_NAV = false` (productionda). Test paytida vaqtincha `true`, push oldidan
  qaytariladi.
- Web Speech — faqat preview; productionda LMS TTS (Yandex/ElevenLabs — Fuzayl qaror).

---

*Etalon o'zgarishi — alohida protsedura (Fuzayl orqali), navbatdagi darsning yon
ta'siri sifatida emas.*
