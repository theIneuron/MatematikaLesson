# Dizayn standarti (1-sinf) — dars qurish uchun reference

**Maqsad:** yangi dars (jumladan 1-sinf) qurishda foydalaniladigan aniq dizayn
kontrakti. Bu hujjat — `DIZAYN_TAHLIL.md` (eski darslarning audit/gap-tahlili) va
`AUDIT_KEEP_VISIBLE.md` ning oldinga qaragan, kod tokenlari bilan to'ldirilgan
versiyasi. Tokenlar **Dars37.jsx** (geom, keep-visible 2-B etalon) dan ajratildi.

**Etalon fayllar:**
- **Dars37.jsx** — keep-visible 2-B, eng toza zamonaviy struktura (tokenlar shundan).
- **Dars28.jsx** — 2-C to'liq reestr (keep-visible MC mexanikasi namunasi).
- **Dars33.jsx** — `DIZAYN_TAHLIL.md` da "namuna" sifatida belgilangan (8 mezon).

**Holat (37 dars):** Dars28–37 = reference to'plam (standartda). Dars34–37 ham
mos (reduced-motion ✓, katta in-content sarlavha yo'q, 1 scroll, 936px, FactCard).
Dars01–27 = pre-standart (batafsil `AUDIT_KEEP_VISIBLE.md` da).

---

## 1. Rang palitrasi (`const T`)

Faqat shu ranglar. Yangi rang qo'shma; aksent bitta — `#FF4F28`.

| Token | Hex | Ishlatilishi |
|---|---|---|
| `bg` | `#F6F4EF` | sahifa foni (issiq oq) |
| `ink` | `#0E0E10` | asosiy matn |
| `ink2` | `#5A5A60` | ikkilamchi matn |
| `ink3` | `#A7A6A2` | uchlamchi / disabled |
| `paper` | `#FFFFFF` | kartalar (`.frame`) |
| `accent` | `#FF4F28` | aksent (CTA, tanlangan, urg'u) |
| `accentSoft` | `#FFE8E1` | aksent foni (frame-soft, picked-wrong) |
| `success` | `#1F7A4D` | to'g'ri javob (yashil) |
| `successSoft` | `#E3F0E8` | to'g'ri javob foni |
| `blue` | `#019ACB` | FactCard (fakt) yagona ko'k urg'u |
| frame-tip sariq | `#FBF3D6` / chiziq `#D8A93A` | kalit-g'oya / ogohlantirish kartasi |

---

## 2. Shriftlar (faqat 4 ta — litsenziyali shrift TAQIQ)

| Shrift | Class | Qayerda |
|---|---|---|
| **Manrope** | `.lesson-root` (default), `.body`, tugma/option | UI va asosiy matn |
| **Source Serif 4** | `.title`, `.display`, `.italic` | sarlavhalar (`opsz` 60) |
| **Fraunces** | `.frac` | kasrlar (`opsz` 144) |
| **JetBrains Mono** | `.mono`, badge/eyebrow | son/kod/badge |

## 3. Tipografika shkalasi (v15, yuqori chegara ×0.85)

| Class | font-size | Izoh |
|---|---|---|
| `.h-title` | `clamp(22px, 4vw, 30px)` | **kontent ichida ishlatilmaydi** (faqat zarur joyda kichik) |
| `.h-sub` | `clamp(17px, 2.5vw, 18px)` | savol-sarlavha (test/case) shu bilan |
| `.body` | `clamp(15px, 1.9vw, 15px)`, lh 1.42 | matn |
| `.eyebrow` | `clamp(11px,1.3vw,11px)`, ls 0.18em, UPPERCASE | Stage chip |
| `.small` | `clamp(13px, 1.5vw, 13px)` | izoh |
| `.frac-display` / `-mid` / `-sm` | `clamp(45,9vw,75)` / `24` / `clamp(16,2.5vw,20)` | kasr o'lchamlari |

Display-komponent o'lchamlari: big `clamp(25,4.7vw,38)`, mid `clamp(16,3vw,27)`,
default `clamp(12,2.1vw,18)`. **Display o'lchamlar eski etalonning 80% idan oshmaydi.**

---

## 4. Layout arxitekturasi — `Stage`

```
.stage         max-width: 936px; height: 100dvh; flex-column   ← skroll YO'Q
 ├─ .stage-header   flex-shrink:0; sticky; eyebrow chip + progress
 ├─ .stage-content  flex:1; kontent shu yerda, 100dvh ichiga SIG'ADI
 └─ .stage-nav      flex-shrink:0; orqaga / oldinga tugmalar
```

Qattiq qoidalar:
- **`max-width: 936px`** (720 emas).
- **Skroll yo'q** — kontent 1280×800 (desktop) va 390×844 (mobil) ichiga sig'adi.
  Yagona ruxsat etilgan `scrollIntoView` = `FeedbackBlock` (1 ta). 2+ = buzilish.
- Sticky tugmalar `flex + 100dvh` orqali (padding + sticky EMAS).
- `idx={screen}` (literal `idx={N}` EMAS — qattiq raqam buzilish).

---

## 5. Komponent uslublari

**Kartalar** (radius, soya — ramka yo'q):
- `.frame` — oq, radius 16, `box-shadow`. Asosiy figura/kontent konteyneri.
- `.frame-soft` — `#FFE8E1` + chap aksent chiziq. Urg'u.
- `.frame-success` — `#E3F0E8` + yashil chiziq. To'g'ri/yakun.
- `.frame-tip` — `#FBF3D6` + `#D8A93A` chiziq. Kalit-g'oya / ko'rsatma.
- `.fact-card` — `#EAF6FB` + ko'k chiziq. FAKT (§8).

**Tugmalar** (radius 12, ramka yo'q, soyada):
- `.btn` — qora fon → hover aksent. Asosiy.
- `.btn-white-accent` — oq fon, aksent matn → hover to'la aksent. Test "Tekshir".
- `.btn-white-accent.btn-ready` — **"Davom" faol (bosish kerak) holati**: to'la aksent fon (`#FF4F28`, oq matn) + puls (`btnReadyPulse` 1.5s: scale 1→1.045 + radar-halqa porlash). `prefers-reduced-motion` da puls o'chadi, to'q rang qoladi. `NavNext` da `disabled` o'chgan zahoti avtomat yonadi — bola "endi shu tugmani bos" deb biladi.
- `.btn-ghost` — shaffof. Ikkilamchi (qayta boshlash).

**Option (MC variant)** — keep-visible holatlar:
- `.option` — oq, soyada. `2×N` grid: `repeat(2, minmax(0,1fr))`, gap 10.
- `.option-correct` — yashil, **qoladi**.
- `.option-wrong` — oqarib (opacity .55), **joyida qoladi** (collapse emas).
- `.option-picked-wrong` — aksent (tanlab xato qilgan variant).

---

## 6. Ekran tuzilishi qoidalari (8+10 mezon, birlashtirilgan)

1. **Katta in-content sarlavha YO'Q** — slaydda `<h1/h2 className="title h-title">`
   blok bo'lmaydi. Kontent darrov mazmun bilan ochiladi. Savol kerak bo'lsa `.h-sub`.
   Yagona doimiy sarlavha = Stage tepasidagi kichik `eyebrow` chip.
2. **Top-anchor** — kontent wrapperda `justifyContent:'center'` yoki matnda
   `textAlign:'center'` YO'Q (faqat figura ramkasi gorizontal markazlashi mumkin).
3. **Keep-visible MC** — to'g'ri javobdan keyin savol + to'g'ri variant qoladi,
   faqat noto'g'ri variantlar oqaradi (`.option-wrong`), collapse qilinmaydi. §7.
4. **Javob sirqishi YO'Q** — ovozlanadigan `wrong_N`/`hint`/`on_wrong` da yakuniy
   son bo'lmaydi, faqat metod ("xonalarni tekshir", "qaytadan sana").
5. **`frame-tip`** — kalit-g'oya/ogohlantirish pale-yellow kartada.
6. **`shuffleMC` + `wrong_N`** — har MC testda majburiy (to'g'ri javob A/B/C/D
   bo'ylab tarqaladi; pozitsiyaga bog'langan hint ham `order` bilan ko'chadi).
7. **Ovoz tozaligi** — ovozlanadigan matnda `× ÷ = % < > / + −`, «», uzun tire,
   ikki nuqta+sanash YO'Q (hammasi so'z bilan). Bir segment = bitta fikr.
8. **s0 jonli animatsiya** — birinchi ekran harakat bilan ochiladi (statik emas).
9. **Bo'sh joy** chalg'itmaydigan loop-animatsiya bilan to'ldiriladi.
10. **ConnectionsBlock** — summary slaydida (RefNote/teaser/forward EMAS).

---

## 7. Keep-visible MC mexanikasi

`QuestionScreen` (Dars37/Dars28): savol-sarlavha + variantlar ko'rinadi → bola
javob beradi → noto'g'ri variantlar `.option-wrong` bilan oqarib **o'rnida
qoladi**, to'g'risi `.option-correct` (yashil) bo'ladi → `FeedbackBlock` (1 ta
`scrollIntoView`) ochiladi → "Davom" faqat to'g'ri javobdan keyin ochiladi
(веди-до-верного, `firstTry` analitika uchun loglanadi, oshkor qilinmaydi).
Eski "collapse-on-correct" (`maxHeight: solved ? 0` butun savolni yig'ish) — TAQIQ.

Tolerant tekshiruv: `0,5`=`0.5`, `4/6`=`2/3` (cross-multiply), aralash=noto'g'ri
kasr — barini to'g'ri deb qabul qil (agar dars maqsadi aniq formani talab qilmasa).
Feedback faqat rang emas — har doim rang + belgi (✓/✗) (rang ko'rmaydiganlar uchun).

---

## 8. FactCard (ko'k fakt kartasi)

To'g'ri javobdan keyin 2–3 muhim test/case slaydida (summary'da EMAS, yordam
sifatida EMAS). `.fact-card`: **katta animatsiya** (`clamp(90px,18vw,130px)`) +
**kam matn**. `.fact-badge` (mono, ko'k, "Bilasizmi? · IT/Tarix/Fan"). Fakt
mavzuga `Demak…/Shuning uchun…` linker bilan bog'lanadi; raqam/sana — draft,
metodist tasdiqlaydi. Mexanizm: `QuestionScreen` `factOnCorrect` propi.

---

## 9. Animatsiya

- `.fade-up` (translateY 12px → 0, 0.4s) + `.delay-1..4` (0.12s qadam). Kirish.
- s0 da harakatlanuvchi (loop) animatsiya. Bo'sh joyga dekorativ loop.
- `set-state-in-effect` lintidan qoch: dinamik-target o'sish faqat `from`-li
  keyframe (`@keyframes x { from { width:0 } }`) bilan, inline target → 100%.
- **`@media (prefers-reduced-motion: reduce)`** STYLES'da majburiy — dekorativ
  loop'larni o'chiradi.

---

## 10. 1-SINF UCHUN ADAPTATSIYALAR

> Arxitektura va tokenlar (§1–§9) o'zgarmaydi — Stage, palitra, shriftlar,
> keep-visible, no-scroll, ovoz qoidalari **bir xil**. Quyidagilar 1-sinf yoshiga
> (6–7 yosh, hali yaxshi o'qiy olmaydi) moslashtiriladigan farqlar. Pedagogik
> tafsilotlar Notion `teaching_methodology` + metodist bilan tasdiqlanadi.

**O'zgaradigan (yosh bilan bog'liq):**
1. **Ovoz — asosiy kanal.** Bola matnni o'qiy olmaydi; tushuntirish to'liq audioda.
   Ekrandagi matn minimal, qisqa, yirik. Har test/topshiriq ovozlanadi.
2. **Yirikroq tipografika.** `.body`/savol o'lchamini yuqori chegarada ushlash,
   uzun paragraf yo'q — 1 qatorli qisqa jumlalar. Matn bloki kam.
3. **Vizual/manipulyativ ustun.** Sanash, predmet (olma, tayoqcha, non bo'lagi),
   katta figura. Mavhum belgidan oldin — aniq narsa.
4. **Son diapazoni kichik.** Boshida 1–10, keyin 1–20, keyin 1–100 (program bilan).
   5-sinf misollaridagi katta sonlar/kasrlar emas.
5. **Qisqaroq dars / kamroq slayd.** Diqqat qisqa — slayd soni va matn yuki kam.
6. **MC variant matni — so'z emas, ko'pincha rasm/son.** O'qishga bog'liqlik kam.
   `2×2` grid saqlanadi, lekin variant ichida yirik son yoki ikona.
7. **Soddaroq til.** Qisqa buyruq, `siz` (formal, ota-onaga hurmat), SOV, uzbek
   ismlar (Madina, Zaynab, Alisher, Bekzod).

**O'zgarmaydigan:** Stage/936px/100dvh, palitra `T`, 4 shrift, keep-visible MC,
веди-до-верного, FactCard mexanizmi (faktlar yoshga moslab soddalashtiriladi),
reduced-motion, javob sirqishi taqiqi, ovoz tozaligi, ConnectionsBlock summary.

**Fayl joylashuvi:** `src/components/grade1/DarsNN.jsx`, ro'yxat
`src/lessons/grade1.js`. Manba darslik `src/books/grade1/` (BOOKS.md). Infra
(AudioEngine/useAudio/QuestionScreen/Stage/STYLES) Dars37 dan bayt-aniq ko'chiriladi.

---

## 11. Savol turlari palitrasi (16 tur)

Skelet bosqichida har test ekraniga mavzuga eng mosini tanla — bir darsda
turlarni **almashtirib** ishlat (faqat MC bilan to'ldirma). To'liq tafsilot:
`PROMPT_YANGI_DARS.md` §3. Texnik holat: ✅ infra tayyor · 🔧 moslashtirish kerak ·
🆕 custom screen.

**Har scored turga umumiy qoidalar:** веди-до-верного (noto'g'ri urinish
xiralashadi, "Keyingi" faqat to'g'ridan keyin) · har noto'g'ri yo'lga aniq hint
(umumiy "noto'g'ri" TAQIQ) · test vizuali natijani oshkor qilmaydi (winner-flag
yo'q) · firstTry analitikaga · qaytishda `storedAnswer` dan tiklanadi · scroll'siz
sig'adi · javob BARDOSHLI tekshiriladi (qiymatni solishtir, stringni emas:
`0,5`=`0.5`, `4/6`=`2/3`).

| # | Tur | Guruh | Holat | 1-sinf |
|---|---|---|:--:|:--:|
| 1 | **MC — bitta to'g'ri** (2×2, `shuffleMC` majburiy) | Tanlash | ✅ | ✅ asosiy |
| 2 | Multi-select (bir nechta to'g'ri) | Tanlash | 🆕 | ⚠️ kam |
| 3 | **Ha/Yo'q · To'g'ri/Noto'g'ri** | Tanlash | ✅ | ✅ a'lo |
| 4 | Noto'g'risini top (error-spotting) | Tanlash | 🆕 | ⚠️ kam |
| 5 | Ortiqchasini top (odd-one-out) | Tanlash | 🆕 | ✅ |
| 6 | **Raqam kiritish (NumInput)** | Yaratish | ✅ | ⛔ typing |
| 7 | Bo'sh joyni to'ldirish (fill-in-the-blank) | Yaratish | 🆕 | ⛔ typing |
| 8 | Ko'p kataklik to'ldirish (ColumnSolver) | Yaratish | 🔧 | ⛔ typing |
| 9 | **Drag-and-drop** (juftlash / savatlarga tasnif / tartiblash / katakka tashlash) | Interaktiv | ✅ | ✅ a'lo |
| 10 | Slayder bilan qiymat | Interaktiv | 🔧 | ✅ |
| 11 | **Bosib bo'laklarni tanlash (tap-to-shade)** | Interaktiv | 🔧 | ✅ a'lo |
| 12 | Son o'qiga nuqta qo'yish (drag-on-number-line) | Interaktiv | 🔧 | ✅ |
| 13 | Hajm bo'yicha tartiblash | Tartiblash | 🆕 | ✅ |
| 14 | Yechim qadamlarini tartibga solish | Tartiblash | 🆕 | ⛔ murakkab |
| 15 | **Toifalarga ajratish (savatlar)** | Tasniflash | 🆕 | ✅ |
| 16 | Chama: "qaysi tomonda? / taxminan qancha?" | Baholash | 🔧 | ✅ |

> AI-baholanadigan erkin matn ("tushuntir/asoslab ber") QO'SHILMAYDI (Fuzayl qarori).

## 12. 1-SINF uchun savol turlari — tavsiya (TYPING YO'Q)

6–7 yosh: hali yaxshi o'qiy/yoza olmaydi, klaviatura yo'q. **Qoida: typing
ishlatilmaydi** — №6/7/8 (raqam/katak kiritish) 1-sinfda CHIQARILADI. Javob
har doim **bosish (tap) yoki sudrash (drag)** orqali, ovoz yo'naltiradi.

**✅ Asosiy (1-sinf uchun eng mos):**
- **MC bitta to'g'ri (№1)** — variantlar **son/rasm/ikona**, matn emas. 2×2, yirik.
- **Ha/Yo'q (№3)** — minimal o'qish, tez. Hook va oraliq tekshiruv uchun ideal.
- **Drag-and-drop (№9)** — juftlash (son↔rasm), savatlarga tasnif, tartiblash.
  Qo'l bilan — eng yodda qoladi. Kam element (2–4), yirik nishon, katta drag-zona.
- **Tap-to-shade (№11)** — sanash uchun ideal: "5 ta olmani bos". Bevosita, oson.
- **Toifalarga ajratish (№15)** — 2 ta nomlangan savat (juft/toq, katta/kichik).

**✅ Mos (ehtiyot bilan, yirik/sodda):**
- **Odd-one-out (№5)** — vizual ("qaysi biri ortiqcha?").
- **Slayder (№10)**, **number-line (№12)** — yirik, snap (qadamga yopishadi).
- **Tartiblash (№13)** — 2–3 element, hajm bo'yicha.
- **Chama (№16)** — "qaysi ko'p?" sonli sezgi, MC bilan.

**⚠️ Kamdan-kam / keyinroq:** multi-select (№2), error-spotting (№4) —
teskari/ko'p javob mantig'i 6 yosh uchun og'ir; juda sodda bo'lsagina.

**⛔ 1-sinfda yo'q:** №6/7/8 (typing), №14 (qadam tartiblash — algoritmik, murakkab).

**Raqamli javob typingsiz (NumInput o'rnini bosadi):** `PROMPT_YANGI_DARS.md`
"har darsda ≥1 NumInput" qoidasi 1-sinfda **bosiladigan son** bilan almashtiriladi —
raqam-plitalari (tap/drag number tiles), tap-raqam paneli, yoki sonli MC. Bu
qoidadan chetlanish **metodist tasdig'ini** talab qiladi (§5 CLAUDE.md).

---

## 13. Bog'liq hujjatlar

- `PROMPT_YANGI_DARS.md` — yangi dars generatsiya prompti (to'liq infra + konvensiyalar).
- `DIZAYN_TAHLIL.md` — Dars01–33 ning 8-mezonli audit/gap-tahlili (Dars33 = namuna).
- `AUDIT_KEEP_VISIBLE.md` — Dars01–27 ning 10-mezonli keep-visible auditi.
- Notion: `design_system`, `screen_types`, `infrastructure_v1`, `teaching_methodology`.
