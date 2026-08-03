# Reja — QISMAN darslarni "O'RGANA OLADI" darajasiga ko'tarish

> Manba: 2026-07-06 pedagogik samaradorlik bahosi (36 dars, [[grade1-learnability-2026-07-06]]).
> Mezon: `1sinf_metodologiya.md` §3.1 (ochilish-qoidadan-oldin), §4 (concrete-avval/CRA),
> §3.4 (misconception), §6 (yoy). Standart: `ETALON_1SINF.md` — kontent struktura
> o'zgarmaydi, faqat **ekran-interaksiyasi** yangilanadi (restrukturizatsiya emas).

## Asosiy tamoyil: "kashfiyot > tomosha"

Tizimli ildiz sabab — oxirgi darslarda "ochilish" bir-tugmalik PASSIV namoyishga
aylangan ("Hisoblash/Birlashtirish/Ko'rsatish" → javob o'zi chiqadi). Yechim: bu
ekranlarni **erta darslarda ishlagan qo'l-manipulyatsiyaga** aylantirish. Yangi
komponent yozilmaydi — quyidagi **sinalgan** manbalar qayta ishlatiladi:

| Mexanika | Manba komponent | Fayl |
|---|---|---|
| Surib-birlashtirish (drag-combine) | drag-combine | Dars07 s2 |
| Surib-olib tashlash (drag-away) | drag-away | Dars08 s5 |
| O'nlik yasash (drag-to-bundle) | `BookBundle` | Dars13 |
| Ten-frame'ni surib to'ldirish | `TenSlots` | Dars16/17 |
| Razryad bo'yicha qurish (tugma bilan) | `Screen7` ("O'nlik qo'sh"/"Birlik qo'sh") | Dars21/26 |
| Bosib-sanash (tap-to-count) | `CountExamples` | Dars01/04 |
| Tarozi | `Balance` | Dars35 (satr ~3816) |

Har dars o'zgarishi: content-generator → jsx-builder (etalon komponent nusxasi) →
qa-validator → build-green. CONTENT struktura saqlanadi.

---

## P0 — DARHOL (ложная-model xatari, to'g'rilik)

### Dars35 — massa: "katta = og'ir" noto'g'ri modelini sindirish
- **Muammo:** butun vizual qatlam "katta = og'ir" ni MUSTAHKAMLAYDI (tarvuz>uzum>olma
  doim kattaroq=og'irroq); qarshi-namuna yo'q. M1 faqat s9 faktida passiv tilga olinadi.
- **Tuzatish:** s2 (tarozi qoidasi) dan keyin **interaktiv qarshi-namuna ekrani**
  qo'shish — `Balance` komponentida **kichik og'ir** narsa (metall boldoq/tosh) vs
  **katta yengil** narsa (pufak/yostiq); bola "O'lchash" bosadi, kichik palla pastga
  tushadi. Audio: "Katta narsa doim og'ir emas — kichik tosh katta pufakdan og'ir."
- Plus: bitta testda kattaroq narsa yengilroq bo'lsin (hozir hammasida katta=og'ir).
- Anchor: §7 Б11 (hajm ≠ massa), §3.4.

---

## P1 — TIZIMLI (6 QISMAN dars: passiv ochilish → aktiv qurish)

Tartib: concrete=zaif bo'lganlar birinchi.

### Dars31 — ikki qadamli masala (concrete=**zaif**)
- **Muammo:** faqat `ChainFig` (5 +3 −2) + `SolTile` tenglama; sanaladigan predmet yo'q.
  s1/s4 "Keyingi qadam" — tayyor yozuvni tomosha.
- **Tuzatish:** har qadamga **sanaladigan olma** — 1-qadam: 5 ga 3 sur (drag-combine,
  Dars07) → oraliq 8 ko'rinadi; 2-qadam: 8 dan 2 ol (drag-away, Dars08) → 6. Bola
  har qadamni o'zi bajaradi, oraliq natija predmet bilan ko'rinadi.

### Dars30 — masalani jadvalga yozish (concrete=**zaif**)
- **Muammo:** `TableFig` kataklari faqat `DigitGlyph`/`SolTile`; olma faqat hikoya-
  pufakchada. s1/s4 "Hisoblash" (Screen1 ~satr 4025) 950ms da javobni materiallashtiradi.
  "keldi→+, ketdi→−" kalit-so'z qoidasi (blok misconception'ining o'zi).
- **Tuzatish:** jadval kataklariga (edi/keldi/jami) bola **olma-piplarni suradi**
  (drag), miqdor jonli o'sadi/kamayadi → amal **mazmundan** ko'rinadi, kalit-so'zdan
  emas. s2/s5 qoida shundan keyin.

### Dars29 — noma'lum qo'shiluvchi (kontsept-qurish=q, spiral=q)
- **Muammo:** s4 "Ko'rsatish" (~satr 1023) passiv; mashq bor-yo'g'i 1 ekran (s7);
  o'yin `sg` faqat qoldiqqa masala — noma'lum qo'shiluvchi takrorlanmaydi.
- **Tuzatish:** s4 ni aktiv qil — bola **yetmagan qismni o'zi quradi** (butungacha
  olma qo'shadi: "nechta qo'shsak yetadi?"). `sg` o'yiniga **noma'lum-qo'shiluvchi
  raundi** qo'shish (hozir 3 raund ham qoldiq).

### Dars34 — uzunlik (concrete=q, "0 dan" misconception yo'q)
- **Muammo:** s1/s4 "O'lchash/Sanash" (~satr 1149) avto-animatsiya; test s6 da qalam
  chizg'ichga oldindan qo'yilgan — bola birlik qo'ymaydi. "0 dan boshlamaslik" ochilmagan.
- **Tuzatish:** bola **sm-birlik plitkalarni chizg'ich bo'ylab bittalab suradi**
  (`RulerFig` + TenSlots-uslub drag) va sanaydi. Plus **0-dan qarshi-namuna**: narsa
  0 da emas, 1 da qo'yilgan → noto'g'ri sanoq → audio "o'lchashni noldan boshlaymiz".

### Dars36 — ma'lumotlar (jadval testda ochilishsiz kiritiladi)
- **Muammo:** `DataTable` baholi test s7 da to'satdan; s1/s4 "Sanaymiz/Solishtirish"
  (~satr 963) passiv reveal.
- **Tuzatish:** s7 dan OLDIN jadval uchun **explore+qoida** juftini qo'shish (bir
  qatorni bola o'zi o'qib/sanab ko'radi). Piktogramma sanog'ini **tap-to-count** qil
  (`CountExamples`, Dars01): bola har rasmni bosadi, audio "bir rasm — bitta meva".

### Dars12 — qavs (concrete=q, 2 kontsept / 15-16 ekran)
- **Muammo:** qavs butunlay simvolik (`QavsExpr` + raqam-token, s7/s8/s8b/sFinal);
  manipulyatsiya yo'q. Tengsizlik uchun tarozi bor, qavs uchun yo'q.
- **Tuzatish:** s7 dan oldin **konkret qavs-ochilishi**: qavs ichidagi guruhni
  (masalan savatda (3+1) olma) bola **avval bosib sanaydi**, keyin tashqarisi bilan
  birlashtiradi ("ichini avval sanaymiz"). Yuk yuqori bo'lgani uchun qavsni §7 Б2
  bo'yicha **"ozshanish" (ознакомление)** darajasida yengilroq ushlash mumkin.

---

## P2 — MAYDA, korpus bo'ylab (bitta sweep, ixtiyoriy)

- **Ekrandagi xato-feedback javobni oshkor qiladi** (Dars14, 23, 24, 25, 26, 27, 28,
  29, 34): ko'rinadigan `wrong_*` matnini **faqat usul ko'rsatadigan** qilib qayta
  yozish, sonni olib tashlash (kerak bo'lsa audioda qoladi). Веди-до-верного tiklanadi.
  Bu QA-pass topilmasi bilan ham mos.
- **Yumshoq hooklar (sikl=q) va uzunlik (13–17 ekran):** past prioritet, har-dars
  qarori. Hookni sanaladigan missiyaga aylantirish (§3.2), imkon bo'lsa 2–3 ekran qisqartirish.

---

## Ketma-ketlik va hajm

1. **P0 Dars35** — kichik (1 ekran + 1 test), lekin to'g'rilik xatari → birinchi.
2. **P1**: Dars31 → Dars30 → Dars29 → Dars34 → Dars36 → Dars12 (har biri ~1 sessiya:
   yangi interaktiv widget + ulash + qa + build-green).
3. **P2**: oxirида bitta sweep.

Har o'zgarishdan keyin `npm run build` yashil bo'lishi va qa-validator o'tishi shart.
Hech biri kontent strukturasini buzmaydi — faqat passiv ekranni aktivga aylantiradi.
