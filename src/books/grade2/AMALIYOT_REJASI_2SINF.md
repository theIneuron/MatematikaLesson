# 2-SINF AMALIYOTLAR REJASI — amaliyot ustozi uchun kontrakt

> **Kim uchun.** Bu hujjat — 2-sinf **amaliyot (mashq) darslarini** yaratadigan ustoz
> uchun. Nazariy darslar (`DarsNN.jsx`) boshqa ustoz tomonidan tayyorlanadi; siz shu
> nazariy darsning **mustahkamlash bankini** (amaliyot) qurasiz. Ikkalasi bitta mavzuni,
> bitta ketma-ketlikni, bitta dizayn standartini bo'lishadi.
>
> **Nima uchun alohida hujjat.** Siz mening nazariy `.jsx` fayllarimni ochmasдан ham har
> mavzu bo'yicha amaliyot qura olishingiz kerak. Shuning uchun bu yerда har darsning:
> mavzusi, mexanikasi, savol turlari, misconception-tuzoqlari, sahnasi va qiyinlik
> progresssiyasi — hammasi yozib qo'yilgan.
>
> **Manba hujjatlar (haqiqat manbai).** Bu reja quyidagilardan chiqadi, ular bilan
> ziddiyatда — ular haqli:
> - `ETALON_2SINF.md` — kod + dizayn kontrakti (§4 amaliy kontrakt).
> - `SYUJET_2SINF.md` — hikoya biobliyasi (sayyoralar, cast, sahna). Kontekst shundan.
> - `DARSLAR_REJASI_1-11.md` («2 класс») — 46 dars ro'yxati (mavzu ketma-ketligi).
> - `2sinf_metodologiya.md` — metodika.
> - `src/components/grade5/practice/jsx-question-contract.md` — texnik kontrakt (to'liq).
> - **Kod etaloni:** `src/components/grade1/practice/dars01/` — 10 topshiriqlik tayyor
>   amaliyot banki (D01_01…D01_10 + `Dars01Practice.jsx` host). Har yangi amaliyot shu
>   naqshда quriladi.

---

## 1. NIMA QURILADI — har dars = amaliyot banki (10 topshiriq)

Har nazariy dars uchun **bitta amaliyot papkasi**:

```
src/components/grade2/practice/darsNN/
  DNN_01.jsx … DNN_10.jsx      ← 10 mustaqil jsx-question fayli (1 mashq/fayl)
  DarsNNPractice.jsx           ← host: 10 tani chip bilan prokliklaydigan sahifa
```

- **10 topshiriq** — osondan qiyinга (🟢×3–4 → 🟡×3–4 → 🔴×2–3). Grade1 banki bilan bir xil.
- Har topshiriq — **1 mexanika, 1 fayl** (~120–170 qator), o'zini-o'zi ta'minlaydi.
- Host (`DarsNNPractice.jsx`) — grade1 `Dars01Practice.jsx` dan bayt-aniq ko'chiriladi:
  `usePracticeZoom()`, chip-navigatsiya, `PracticeHost` bilan preview.

> **Hozirgi holat.** Faqat Dars01 amaliyoti bor, lekin u eski model bilan
> (`practice/Amaliyot01.jsx` + `Amaliyot01Page.jsx`, 1 topshiriq). **Yangi standart —
> grade1 darsNN/ papka modeli (10 topshiriq).** Dars01 amaliyotини ham shu modelга
> ko'chiring (D01_01…10 papka). Grade2 Amaliyot01Page — eski, uni namuna qilmang.

---

## 2. OLTIN QOIDALAR (buzilmaydi)

1. **Amaliyot MUSTAHKAMLAYDI, o'rgatmaydi.** Yangi kontsept KIRITILMAYDI — faqat nazariy
   darsда o'rgatilган mexanikани takrorlaydi. Agar bola nazariyни o'tган bo'lsa, amaliyotни
   yechа oladi.
2. **Tap-first, TYPINGSIZ.** Klaviaturадан yozish YO'Q. Javob — bosiladigan variant, raqam-plita,
   surish (drag), tegib-bo'yash. 7–8 yoshли bola uchun katta tegish maydonлари.
3. **Ovoz YO'Q.** Amaliyotда TTS yo'q — host faqat "to'g'ri/xato" beep beradi (`playCorrect`/
   `playWrong`). O'z audio-dvigatelingizни qurmang.
4. **O'z "Tekshirish" tugmasi YO'Q.** Tugмани host beradi. Siz faqat `onReady(bool)` va
   `registerCheck(fn)` bilan ulaysiz (§4).
5. **Xato-feedback usulni ko'rsatadi, yakuniy sonни BERMAYDI.** «Qo'shmang: kassetaда o'ntadan…»
   ✓ · «Javob 36» ✗. Bola metodни tushunsin, sonни yodламасин.
6. **Har topshiriq syujet sahnasида** (§SYUJET) — nazariy dars bilan bir dunyo (kosmik yo'l,
   cast: Ra'no/Anvar/Zuhra/Jasur/Bit).

---

## 3. QIYINLIK, TEG, DARAJA — metodik xarita (o'quvchiга ko'rinmaydi)

Har topshiriq faylида yuqorида izoh + `DATA`/`meta`:

```js
const DATA = { target: 36, options: [36, 63, 9, 30], tag: 'razryad_pick',
               level: '🟢', block: 1, ptype: 'P21' };
// onSubmit → meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype }
```

- **`level`** — qiyinlik: `🟢` oson · `🟡` o'rta · `🔴` qiyin. 10 talikда progresssiya:
  taxminan `🟢🟢🟢🟡🟡🟡🟡🔴🔴🔴`.
- **`tag`** — mexanika slug'и (`razryad_pick`, `compare_pick`, `mult_group`…). Analitika uchun.
- **`block`** — 1–6 (SYUJET biomи).
- **`ptype`** — topshiriq tipi kodi (ixtiyoriy, grade1 konvensiyаси: P1, P2, P21…).

**10 topshiriq progresssiyаси (naqsh):**
1. 🟢 asosiy mexanika, kичik sonlar · 2. 🟢 shu mexanика, boshqa kontekst ·
3. 🟢 kичik variatsiya · 4. 🟡 kattaroq son / qo'shimcha qadam ·
5. 🟡 teskari yo'nalish (masalan: son→tasvir o'rniga tasvir→son) ·
6. 🟡 misconception-tuzoq bilan · 7. 🔴 aralash / ikki qadam ·
8. 🟡 boshqa savol turi (drag / tasnif) · 9. 🔴 hayotiy masala ·
10. 🔴 eng qiyin / umumlashtirish.

Har 10 talikда **kamida 3 xil savol turи** bo'lsin (faqat MC bilan to'ldirmang).

---

## 4. TEXNIK KONTRAKT — jsx-question (qisqa)

To'liq spec: `src/components/grade5/practice/jsx-question-contract.md`. Minimal naqsh:

```jsx
export default function DNN_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null,
          playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // review/retry: oldingi javobni tiklaydi
  useEffect(() => { if (initialAnswer?.studentAnswer?.value != null) setPicked(initialAnswer.studentAnswer.value); }, [initialAnswer]);

  // 1) tayyorlik → host tugmasi yonadi
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  // 2) check ni ro'yxatдан o'tkaz (bir marta, stabil wrapper)
  const check = useCallback(() => {
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t[HINT_BY_VALUE[picked] || 'hint'] });
    setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: DATA.target },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);
  // …
}
```

**Muhim:**
- Tugмани host chizadi — siz `onReady`/`registerCheck` bilan ulaysiz, o'z tugмangiz YO'Q.
- `onSubmit(result)` faqat check ичида, **bir marta**. `correct` (boolean) — MAJBURIY.
- `review` modeда faqat o'qish (lock), verdictни `initialAnswer`дан tiklaysiz.
- CSS — fayl ичида `<style>` (scoped `.aqNN`/`.dNN`). Tashqи import YO'Q.
- **Ruxsat etilган importlar:** `react`, `react-dom`, `framer-motion`/`motion/react`,
  `lucide-react`, `recharts`, `mathjs`. Boshqasi throw qiladi.

**Tolerant tekshirish (majburiy):** matematik jihatдан to'g'ri javobни xato demang.
Agar javob raqamli/ekvivalent bo'lsa (`0,5`=`0.5`, `4/6`=`2/3`), teng qiymatни qabul qiling —
darsning maqsadи aynan bitta shaklни talab qilмаса.

---

## 5. FAYL JOYLASHUVI VA REGISTRY

1. Papka: `src/components/grade2/practice/darsNN/` (10 fayl + `DarsNNPractice.jsx`).
2. Host — grade1 `Dars01Practice.jsx` dan ko'chiriling: `usePracticeZoom`, chip-lar, `PracticeHost`.
3. Registry: `src/lessons/grade2.js` → `grade2Amaliy` massivига qator qo'shing:
   ```js
   { slug: 'amaliyot-NN-<mavzu-slug>', title: "Amaliyot NN. <Mavzu>",
     desc: "<qisqa>", Component: lazy(() => import('../components/grade2/practice/darsNN/DarsNNPractice.jsx')) },
   ```
4. Ulanish avtomatik: `src/lessons/index.js` REGISTRY 2-sinf `amaliy` ni allaqachon oladi.
   URL: `/2-sinf/matematika/amaliy/<slug>`.
5. Slug/nomер nazariy dars bilan **mos** bo'lsin (Amaliyot 7 = Dars 7 mavzusi).

---

## 6. DIZAYN STANDARTI (amaliy palitra)

`ETALON_2SINF §4` + grade1 practice-bank konvensiyаси:

- **Palitra:** aksent **ko'k `#2563eb`** (tanlangan variant), to'g'ri = yashil `#1a7f43`,
  xato = qizil `#c0392b`. (Nazariy T-palitра `#FF4F28` дан farq qiladi — bu practice
  konvensiyаси, ataylab.)
- **Rang-kod (nazariy bilan bir xil, agar razryad bo'lsa):** o'nlik = sariq/apelsin,
  birlik = ko'k `#019ACB`; xato-tuzoq = qizil. Bola bir mavzuда bir xil rangни ko'rsin.
- **Katta tegish maydonлари** (7–8 yosh): variant tugmalари ≥66px, plitalar yirik.
- **Feedback rang + IKONKA** (faqat rang emas — rang ko'rmaydiganlar uchun): `✓`/`✗` SVG.
- **Animatsiya** — mexаникани ko'rsatadi (batareya suzib kiradi, lola ochiladi), lekin
  javобни OSHKOR qilmaydi (test paytида "g'olib bayrog'и" YO'Q).
- **`prefers-reduced-motion`** — bezak animatsiyаларни o'chiring (media query).
- **Skrollsiz + mobil:** `usePracticeZoom` (fixed root, `<640px` да 390px etalon + zoom).
  Kartа ekрандан chiqib ketмаsин — bu funksional bug.
- **Font:** Manrope (practice). Fraunces/Source Serif — nazарийда.

---

## 7. TIL VA REGISTR (buzilmaydi)

- **RU va UZ ikkalasi to'liq** — har ko'rinadиган matn `t.uz` va `t.ru` da. Massivlar bir xil
  uzunликda. Til aralashмаsин.
- **Register:** UZ — **`siz`** (formal; `sen`-imperativ TAQIQ: «bosing» ✓ «bos» ✗).
  RU — **`ты`**, lekin **jinssiz** shakl (o'tган zamon erkak/ayol fe'l TAQIQ: «ты выбрал» ✗;
  «выбери» / «твой ответ» ✓).
- **UZ apostrof — oddiy `'`** (`ʻ` emas). UZ-stringlar JS'da **qo'shtirnoq yoki backtick**
  (bitta tirnoq ичидаги UZ apostrofни buzadi).
- **Ismlar o'zbekcha.** Cast: Ra'no, Anvar, Zuhra, Jasur, Bit. One-off masala qahramoni —
  yangi o'zbek ism (Madina, Bekzod, Kamola, Sardor, Dilnoza, Otabek…).
- **Matn TTS-toza bo'lishi shart EMAS** (ovoz yo'q), lekin **xato-hint metodни beradi, sonни
  bermaydi** qoidasi baribir amal qiladi.

---

## 8. SAVOL TURLARI PALITRASI (tap-first)

Bir 10-talikда almashtirib ishlating:

| Tur | Mexanika | Qachon qulay |
|---|---|---|
| **MC bitta to'g'ri** (2×2) | 4 variantдан tanlash; `shuffleMC` bilan to'g'ri o'rnини almashtirib | universal; tuzoq-variantлар uchun |
| **Ha/Yo'q · to'g'ri/xato** | bitta tasdiqни baholash | «`34 = 3 + 4` to'g'rими?» |
| **Drag-and-drop** | juftlash / savatlarга tasnif / tartiblash | razryad→qiymat, guruhларга ajratish |
| **Tap-to-shade / tap-to-count** | tegib sanash/belgилаш | teng guruhlar, o'nlab sanash |
| **Toifаларга ajratish** | element→to'g'ri savat | «o'nlik / birlik», «juft / toq» |
| **Son o'qига qo'yish** | markerни snap bilan qo'yish | son o'qи, taqqoslash |
| **Raqam-plита** | bosiladиган raqamлар (typing EMAS) | raqamли javob, столбik kataklari |
| **Find-the-wrong** | xato variantни topish (teskari savol) | misconception-buzish |

Har topshiriq 4 variantли MC bo'lса — `shuffleMC` bilan to'g'ri javob har safar A/B/C/D
o'rtасида almashsin (bola pozitsияни yodlаб o'ynамаsin).

---

## 9. PER-LESSON SPEC — 46 dars (mavzu · mexanika · tuzoqlar · sahna)

> Ustunlar: **Mexanika** (nima bilan mashq) · **Savol turlari** (aralash) ·
> **Misconception-tuzoqlar** (xato variantлар shundan yasaladi + hint metodни beradi) ·
> **Sahna** (SYUJET biomи). Har dar uchun 10 topshiriq shu mexаникани osondan qiyinга.

### 🚀 Б1 — OCHIQ KOINOT · 100 gacha nomerlash (d.1–7) · sahna: kema, ochiq koinot, batareya=birlik/kasseta=o'nlik

| № | Mavzu | Mexanika | Savol turlari | Misconception-tuzoqlar | Sahna |
|---|---|---|---|---|---|
| 1 | O'nliklar va birliklar | Kasseta(o'nlik)+batareya(birlik)dан sonни top | MC, drag(o'nlik/birlik savatiga), tap-count | `63` (o'rin almashgan), `9` (o'nликни qo'shган: 3+6), `30` (birlикни unutган) | kema ichи |
| 2 | Sonни o'qish/yozish | Kod↔nom: `47`↔«qirq yetти»; nom→kod raqam-plита | MC (nom→son), raqam-plита (son yozish), Ha/Yo'q | `74` (o'rin), «yetти qirq» (teskari o'qиш), o'nlik/birlik nomи aralashган | boshqaruv paneli |
| 3 | Razryad tarkibi | `45 = 40 + 5`; nol-o'rin `30 = 3 o'nlik 0 birlik` | drag(razryad→qiymat), MC, toifа | `45=4+5` (razryad qiymати emas), `30=3` (nol tashlab), `30=3+0` chalkash | yoqilg'i ombori |
| 4 | Sonlarни taqqoslash | Avval o'nlik, keyin birlik; `> < =` | MC(belgи tanlash), drag(3 sonни tartiblash), son o'qи | faqat birликка qarаб (`19>21`?), belgи yo'nalishи teskari, teng holатни o'tkazиб yuborиш | ikki tank |
| 5 | O'nlab sanash | `10,20…100` oldинга/orqаga; yetишmaган o'nlik | tap-count(o'nlab), MC(keyingi/oldинги), son o'qиga snap | `+10` o'rniga `+1`, orqаga sanашда adashиш, `100` dан keyин davom | orbita hisoblagichи |
| 6 | Son o'qи | Sonни o'qда joyга; qaysи ikki o'nlik orasида | son o'qиga snap, MC(oraliq), drag | notekis bo'lиnиш, `34`ни `40`га yaqin deб `4x`ga qo'yиш, chala-qadam | uchиш trassаси |
| 7 | Takrorlash + **ПК1** | Б1 aralash: razryad+taqqoslаш+sanаш | aralash (har turdан) | Б1 tuzoqлари takrori | port markazи |

### 🔴 Б2 — MARS · 100 ичida amallar, столбik (d.8–14) · sahna: yuk bazаси, konteyner-raflar

| № | Mavzu | Mexanika | Savol turlari | Misconception-tuzoqlar | Sahna |
|---|---|---|---|---|---|
| 8 | Qo'shиш (o'tishsiz) | `34+25`: o'nlik+o'nlik, birlik+birlik | raqam-plита, MC, drag(razryadга) | razryadни aralashtirиб (`34+25=…` birликни o'nликка), o'rin-qiymat yo'qolган | yuk rafи |
| 9 | Ayirиш (o'tishsiz) | `59−25` xonама-xona | raqam-plита, MC, Ha/Yo'q | birликдан o'nликни ayirган, kичикдан kattани noto'g'ri | yuk rafи |
| 10 | Qo'shиш (o'tishли) | `37+25=62`: birlik 10ga yetsа 1 o'nlik ko'chади | raqam-plита(ko'chувчи 1), MC, tap(guruhlаш) | ko'chувчи 1ни unutган (`37+25=52`), ikki xonани alohида yozган | saralаш tasmаси |
| 11 | Ayirиш (o'tishли) | `52−27=25`: birlik yetмаса o'nликдан qarz | raqam-plита(qarz belgиsи), MC | qarzни unutган, katta-kичикни o'rin almashtirган (`7−2` birликда) | saralаш tasmаси |
| 12 | Столбik | Xona ostига xona; to'g'ri tekislаш | raqam-plита(katakларга), drag(razryad tekislаш), find-wrong | razryadни noto'g'ri tekislаш (birlик o'nlик ostида), ko'chувчини noto'g'ri joyга | hisob terminали |
| 13 | Ikki amалli masala | Ketма-ket 2 amal; oraliq natija | MC(bosqichли), drag(qadamlar tartибi), raqam-plита | bitta amал bilan to'xtаш, amaлларни teskari tartибда | stansiya |
| 14 | Takrorlash + **ПК2** | Б2 aralash: +/−, столбik, masala | aralash | Б2 tuzoqлари | stansiya |

### 🟠 Б3 — YUPITER · Ko'paytirish, teng guruhlar (d.15–21) · sahna: dala/issiqxona, qatorlar×ustunlar

| № | Mavzu | Mexanika | Savol turlari | Misconception-tuzoqlar | Sahna |
|---|---|---|---|---|---|
| 15 | Ko'paytirиш ma'носи | `5+5+5 = 3 marta 5`; massiv(satr×ustun) | tap-count(guruh), MC, drag(guruhга ajratиш) | teng bo'lмаган guruhни marta deб, `3+5` (qo'shган), satr↔ustun aralaш | dala |
| 16 | ×2 va ×3 | 2lik/3lik guruhlar; jadval | MC, tap-count, raqam-plита | `2×3=5` (qo'shган), guruh sonини noto'g'ri, o'tkazиб sanаш | issiqxona |
| 17 | ×4 va ×5 | 4lik/5lik guruhlar | MC, drag(juftlаш), tap-count | qo'shиш bilan chalkаш, ×5 да oxирги raqam (0/5) buzилган | issiqxona |
| 18 | ×6 va ×7 | 6lik/7lik guruhlar | MC, raqam-plита, find-wrong | jadval yodlашда adashиш, qo'shни natijага sakraш | dala |
| 19 | ×8 va ×9 | 8lik/9lik guruhlar | MC, drag, tap-count | ×9 naqshини (o'nlик−1) chalkаш, katta guruhда o'tkazиб sanаш | dala |
| 20 | Mustahkamlаш | Jadvalни qo'llаш; `3×5 = 5×3` (o'rin almashtириш) | MC, drag(juft-natijа), Ha/Yo'q | `3×5 ≠ 5×3` deб o'ylаш, jadval bo'sh joyини noto'g'ri | ombor |
| 21 | Takrorlash + **ПК3** | Б3 aralash: guruh, jadval, o'rin almashtириш | aralash | Б3 tuzoqлари | dala |

### 🪐 Б4 — SATURN · Bo'lish, teng ulash (d.22–28) · sahna: kon/lager, kristall-o'ljани teng ulash

| № | Mavzu | Mexanika | Savol turlari | Misconception-tuzoqlar | Sahna |
|---|---|---|---|---|---|
| 22 | Bo'lиш ma'носи | `12 ÷ 3`: 3 hamrohга teng ulаш — har biriга nechta | tap(ulашish), MC, drag(savatlarга teng) | teng bo'lмаган ulush, `12−3` (ayirган), qoldiqни tashlаб | kon og'зи |
| 23 | × va ÷ bog'lanиши | `3×4=12 → 12÷3=4, 12÷4=3` oila | drag(oila juftlаш), MC, find-wrong | oilани noto'g'ri (`12÷5`), ×↔÷ teskari bog' | saralаш |
| 24 | ÷2 va ÷3 | 2ga, 3ga bo'lиш | MC, tap(teng ulаш), raqam-plита | ko'paytириш jadvалидан teskari izlашда adashиш | kon |
| 25 | ÷4 va ÷5 | 4ga, 5ga bo'lиш | MC, drag, tap | teng bo'lмаган guruh, qoldiqли sonда adashиш | kon |
| 26 | ÷6–9 | 6–9ga bo'lиш | MC, raqam-plита, find-wrong | katta bo'luvchида jadvални chalkаш | kon |
| 27 | Masalalar | Bo'lишга hayotiy masala (teng ulаш/guruhlаш) | MC(bosqичли), drag, tap-count | «teng» shartини e'tибordан tashlаш, qoldiq | lager |
| 28 | Takrorlash + **ПК4** | Б4 aralash: bo'lиш, oila, masala | aralash | Б4 tuzoqлари | lager |

### 🔵 Б5 — URAN · Geometriya, perimetr (d.29–34) · sahna: maydon/ustaxona, modul-qurиш, o'lchаш

| № | Mavzu | Mexanika | Savol turlari | Misconception-tuzoqlar | Sahna |
|---|---|---|---|---|---|
| 29 | Nur, to'g'ri chiziq, kesма | Chiziq turlарини farqlаш | MC, toifа(3 savatga), drag | kesма↔nur↔to'g'ri chiziqни chalkаш (chegара bor/yo'q) | maydon |
| 30 | Ko'pburchaklar | Tomon/burchak sanаш; nomlаш | tap-count(tomon), MC, toifа | tomon↔burchakни chalkаш, egри chiziqни ko'pburchak deб | maydon |
| 31 | sm, dm, m | Uzunlik birlikлари; o'lchаш; `1 dm = 10 sm` | son o'qи/lineyка, MC, drag(mos birlик) | birlikни almashtirишда adashиш (`2 m = 2 dm`?), noldан boshламаслик | ustaxona |
| 32 | Perimetr | Tomonlар bo'ylab sanаб qo'shиш | tap(tomonlарни bosиб qo'shиш), raqam-plита, MC | bitta tomonни tashlаб, tomonни ikki marta, yuza bilan chalkаш | panjара |
| 33 | Yasаш (qurиш) | Berilган o'lchамда shakl yasаш | drag(nuqtа/tomon qo'yиш), MC | o'lchамни noto'g'ri, yopиq bo'lмаган shakl | maketа |
| 34 | Takrorlash + **ПК5** | Б5 aralash: chiziq, shakl, perimetr, birlик | aralash | Б5 tuzoqлари (birlик almashtириш, tomon sanаш) | ustaxona |

### 🔵 Б6 — NEPTUN → Bit uyi · ifoda, tenglama, доли, vaqt, data (d.35–46) · sahna: stansiya, oshxona, bort soati, Yer'ga qo'nиш

| № | Mavzu | Mexanika | Savol turlari | Misconception-tuzoqlar | Sahna |
|---|---|---|---|---|---|
| 35 | Sonли/harfли ifodalar | `a + 5` — harf o'rniга son qo'yиб qiymат | raqam-plита, MC, drag | harfni «qo'shиш» deб (`a+5 = a5`), amал tartибини buzиш | stansiya |
| 36 | Tenglamalar | `x + 4 = 9` — yashirин sonни topиш | raqam-plита, MC, tap(muvozanат) | teskari amал o'rniга to'g'риsини (`x=9+4`), ikki tomonни chalkаш | shlyuz-kod |
| 37 | Доли: yarim, chorak, uchdан bir | Butun teng bo'lакка; buklаш (kasr belgиsи EMAS) | tap-to-shade, MC, drag(teng bo'lак) | teng bo'lмаган bo'lакni «yarim» deб, ko'p bo'lак=katta ulush deб | oshxona |
| 38 | Soat, minut | Vaqtни o'qиш (соат/minut) | soat-strelка(drag/snap), MC | soat↔minut strelкасини chalkаш, `15` minutни `3` deб (raqam↔minut) | bort soатi |
| 39 | Kalendar | Kun/hafta/oy tartibи | drag(tartиблаш), MC, toifа | hafta kunлари tartибi, oy kunлари sonи | bort jurnали |
| 40 | Pul | Tanga/pul bilan hisob; teng qiymат | drag(tanga yig'иш), raqam-plита, MC | nomiналni sanоqда chalkаш, mayda-yirikни teng deб | almashuv |
| 41 | Kattaликларга masala | Vaqt/pul/uzunликка hayotiy masala | MC(bosqичли), raqam-plита | birlикni chalkаш, savol shartини to'liq o'qимаслik | stansiya |
| 42 | Mantiq | Mantiqий naqsh/tartib/ortiqчани topиш | odd-one-out, drag(naqsh davomi), MC | naqshни noto'g'ri, faqat bitta belgига qarаш | stansiya |
| 43 | Ma'lumot bilan ishlаш | Jadval/piktogramма o'qиш (1 rasm = 1 birlik) | tap-count, MC(taqqoslаш), drag | piktogramма masshtабini (1 rasm = N) e'tибordан, ustun/qatorни chalkаш | panel |
| 44 | Takrorlash | Б6 aralash takror | aralash | Б6 tuzoqлари | stansiya |
| 45 | Takrorlash + **ПК6** | Б6 nazorат | aralash | Б6 tuzoqлари | stansiya |
| 46 | **Yakuniy nazorат (ИК)** | Butun kurs aralash (Б1–Б6) | har blokдан aralash | yil bo'yи asosий tuzoqлар | **Yer'ga qo'nиш** |

> **Nazorат darslari (7, 14, 21, 28, 34, 45 + 46).** Bu ПК/ИК darslarида amaliyot =
> blokning barcha mexаникаларидан **aralash 10 topshiriq** (yangi kontsept yo'q,
> misconception-tuzoqлар takrorланади). Bular baholаш eshigi — grade1 `pk/` naqshига qarang
> (agar mavjud bo'lsa). Aralashда har blok mavzusидан kamida bittадан bo'lsin.

---

## 10. SIFAT CHEKLISTI (topshiriqни topshиrишдан oldин)

**Har topshiriq:**
- [ ] 1 mexanika, tap-first, typingsiz, ovozsиz?
- [ ] `onReady`/`registerCheck`/`onSubmit` ulanган; o'z tugмаси YO'Q?
- [ ] `correct` (boolean) `onSubmit` да bor; `meta` (tag/level/block/ptype) to'ldirилган?
- [ ] `review` mode да tiklаnади (`initialAnswer`)?
- [ ] Xato-hint metodни beradi, yakuniy sonни BERMAYDI?
- [ ] Tolerant tekshириш (ekvivalent javобни qabul qiladi)?
- [ ] Tuzoq-variantлар misconceptionга asosланган (tasodifий emas)?
- [ ] Feedback — rang **+ ikonка**; `prefers-reduced-motion` bor?
- [ ] MC bo'lса — `shuffleMC` bilan to'g'ri o'rин almashади?

**Til:**
- [ ] `t.uz` va `t.ru` to'liq, massivlar teng uzunликда?
- [ ] UZ `siz` (sen-imperatив yo'q); RU `ты` jinssiz (o'tган zamon jins fe'l yo'q)?
- [ ] UZ apostrof oddiy `'`; UZ-string qo'shtirnoq/backtickда?
- [ ] Ismlар o'zbekcha?

**Bank (10 topshiriq):**
- [ ] Qiyinlik osondан qiyinга (🟢→🟡→🔴)?
- [ ] Kamида 3 xil savol turи?
- [ ] Sahna SYUJET biomига mos (nazarий bilan bir dunyo)?
- [ ] Yangi kontsept KIRITILMAGAN (faqat mustahkamlаш)?
- [ ] Host (`DarsNNPractice.jsx`) + registry (`grade2.js`) ulanган; `npm run build` yashил?

---

## 11. ISH JARAYONI VA KOORDINATSIYA

**Kim nima beradi:**
- **Nazarий ustoz (men):** `src/components/grade2/DarsNN.jsx` — mavzuни o'rgatади. Sizга
  bu fayl KERAK EMAS; bu reja + SYUJET + DARSLAR_REJASI yetarli.
- **Amaliyot ustoz (siz):** `src/components/grade2/practice/darsNN/` — 10 topshiriq + host.

**Sinxronlik.** Ikkalamiz bir manbага tayanаmiz: `DARSLAR_REJASI_1-11.md` (mavzu ketма-ketлиги) +
`SYUJET_2SINF.md` (sahна/cast). Bu ikki hujjat o'zgаrsа — ish TO'XTAYDI, o'zgаriш git orqали
sinxronланади, KEYIN davом. Syujetни O'ZINGIZ o'ylаб topмaysiz — sahна aynan SYUJETдан.

**Tartиб.** Nazarий dars tayyor bo'lган (yoki mavzu qulflanган) darslardан boshланг. Hozир
tayyor: Dars01–10 (nazarий, `grade2.js` `grade2Nazariy`). Amaliyot Dars01дан boshланади;
navbат — nazarий tayyor bo'lган mavzuга.

**Ziddiyат.** Agar bu reja SYUJET/ETALON/kontrakt bilan ziddiyатда bo'lsа — **ular haqли**,
menга ayting, rejани tuzataman. Agar biror mexаника typingни talab qilса yoki yangi kontsept
kiritса — bu amaliyot emas, to'xtaб menга ayting.

*Reja versияsи: 2026-07-15. Manba: ETALON_2SINF §4, SYUJET_2SINF v3, DARSLAR_REJASI «2 класс»,
jsx-question-contract, grade1 practice banki (etalon: dars01/).*
