# TIPLAR_AMALIYOT_9SINF — 9-sinf amaliyotining o'nta mexanikasi

> Metodist qarori 2026-08-26: 9-sinfda ham amaliyot 8-sinfdagi qoida bo'yicha quriladi —
> **52 dars x 10 topshiriq = 520 topshiriq**, har darsda AYNAN shu o'nta mexanika, faqat
> ketma-ketlik boshqa. Uchtasini metodist o'zi ko'rsatdi (test, ha/yo'q, javobni kiritish),
> qolgan yettitasi shu hujjatda tasdiqlandi.
>
> Bu hujjat bitta savolga javob beradi: **o'quvchi barmog'i bilan nima qiladi**. Topshiriq
> nima haqida ekani (janr) — boshqa o'q.
>
> Yaqin namuna: `src/books/grade8/TIPLAR_AMALIYOT_8SINF.md`. U yerdan qoidalar ko'chadi,
> KOD ko'chmaydi (CLAUDE.md §5).

---

## 1. NIMA UCHUN PUL 8-SINFNIKIDAN FARQ QILADI

8-sinfda o'nta mexanika so'z-kartochka mexanikalari edi va o'sha sinfda ish berdi.
9-sinfda bo'linish keskinroq:

| Darslar | Nima | Nechta |
|---|---|---|
| 1-27 | funksiya, grafik, tenglama, tengsizlik, progressiya | 27 |
| 28-34 | statistika, ehtimollik, trigonometriya | 7 |
| **35-52** | **geometriya: o'xshashlik, aylana, vektor, uchburchak yechish** | **18** |

Faqat so'z-kartochka pulini olsak, 18 ta geometriya darsini yopadigan narsa qolmaydi.
Shuning uchun ikkita talab:

1. **Har bir mexanika 52 darsning HAMMASIDA ishlashi kerak.** Faqat geometriyada
   ishlaydigan mexanika pulga kirmaydi — u "har darsda o'sha o'nta" qoidasini buzadi.
2. **Rasm — mexanika emas, KONTENT.** "Chizmada belgilash" alohida tip emas: bitta
   mexanika bor — rasmning to'g'ri joyiga bosish, rasm esa darsga qarab koordinata
   tekisligi, sonlar o'qi, diagramma yoki geometrik chizma bo'ladi.

**Uchinchi talab — sinfning yuzi.** 1-darsning birinchi varianti metodist tomonidan
"faqat nusxa chiqdi" deb qaytarilgan (2026-08-20), sababi 8-sinfning ASBOBLARI ko'chib
kelgani edi. Amaliyotda ham shu chegara: **o'ram va sof kartochka mexanikalari umumiy
qatlamdan import qilinadi, xatti-harakati boshqa bo'lgan mexanikalar esa sinfning o'z
faylida (`grade9/practice/asboblar9.jsx`) yoziladi.** 1-dars yig'ilgandan keyin bo'linish
shunday chiqdi: beshtasi import, beshtasi sinfniki.

---

## 2. O'NTA MEXANIKA

Hammasida majburiy: har noto'g'ri YO'LGA o'z razbori (`wrongs[]`, birinchi mos kelgani
chiqadi), oxirgi razbor `wrongText`, `correctText` son bilan tekshirishga yuboradi, uch
til faqat SO'ZLARDA — matematika til blokidan tashqarida.

| # | Nomi | Barmoq nima qiladi | Qaysi bloklarni yopadi |
|---|---|---|---|
| 1 | **Test** | to'rtta fikrdan bittasini bosadi | hamma |
| 2 | **Ha/yo'q** | har bir hukmga alohida ha yoki yo'q | hamma |
| 3 | **Javobni kiritish** | javobni klaviaturadan yozadi | hamma |
| 4 | **Belgilash** | rasm ustidagi to'g'ri joyni bosadi | 1-6, 10, 14-20, 42 (tekislik); 35-52 (chizma); 28-32 (diagramma) |
| 5 | **Sonlar o'qi** | o'qqa chegara qo'yadi va nuqta turini almashtiradi | 14-20 butunlay, 1, 6, 17, 27 |
| 6 | **Jadval** | katakchalarni to'ldiradi | 1-5, 21-27, 28-32 |
| 7 | **Saralash** | kartochkani bosadi, keyin zonani | hamma |
| 8 | **Tartib** | tayyor qadamlarni to'g'ri ketma-ketlikka qo'yadi | 7-13, 15, 49 |
| 9 | **Xato qator** | tayyor yechimning birinchi xato qatorini bosadi | hamma, har darsda bitta |
| 10 | **So'zlar** | qoidadagi bo'sh joyga so'z kartasini qo'yadi | hamma: har darsning o'z qoidasi bor |

### 2.1. Har bir mexanikaning kontrakti

**1. Test.** To'rtta variant, bittasi to'g'ri. **Savol MANTIQIY bo'lishi shart**: "qaysi
fikr to'g'ri", "qaysi qoida qo'llanadi", "qaysi shart yetishmaydi" — "qaysi javob to'g'ri"
EMAS. 8-sinf kontraktida (`TIPLAR_AMALIYOT_8SINF.md` §5.11) tayyor javobdan tanlash
puldan chiqarilgan, chunki u yechish emas, yechim haqida gapirish. Metodist uni
2026-08-22 da bitta shu shart bilan qaytargan; 9-sinfda ham shart o'z kuchida.

**2. Ha/yo'q.** Uch yoki to'rtta hukm, har biriga alohida ha yoki yo'q. Bitta xato — topshiriq
o'tmaydi. Hukmlar bir-birini takrorlamaydi: bittasi ta'rifni, bittasi miskonsepsiyani,
bittasi chegarani tekshiradi.

**3. Javobni kiritish.** Javob — son, sonlar to'plami yoki shart (`x ≠ 7`, `0; 7`,
`x ≥ −5`). Solishtiriladigan narsa QIYMAT, matn emas. Telefonda tizim klaviaturasi
ko'tarilmaydi.

**4. Belgilash.** Rasm — `grade9/asboblar.jsx` dan (`Trace`, `Board`, `Gate`, `Sweep`,
`Machine`), geometriyada chizma moduli. O'quvchi rasmning to'g'ri joyini bosadi.
Majburiy: **bosish zonasi ko'rinib turadi** (METODIK_PROFIL), va tuzoq nuqta bo'ladi —
koordinatalari almashgan yoki boshqa o'qdan o'qilgan.

**5. Sonlar o'qi.** Chegara qo'yiladi VA nuqta turi almashtiriladi (bo'yalgan / bo'sh).
Ikkalasi ham to'g'ri bo'lsagina zachot: `x ≤ 5` va `x < 5` — boshqa javob. Razbor
NUQTA haqida gapiradi, son haqida emas.

**6. Jadval.** Bir nechta katak to'ldiriladi, "hammasi yoki hech nima". Kamida bitta katak
QARAMA-QARSHI yo'nalishda bo'ladi (qiymatdan argumentga) — shusiz jadval argument bilan
qiymatni ajratishni tekshirmaydi.

**7. Saralash.** Zona — nom emas, XOSSA: "hamma sonlarda aniqlangan / bitta son chiqadi /
butun bir qism chiqadi", "ildiz / chet ildiz", "arifmetik / geometrik". Barmoq bosadi,
tortmaydi (telefonda barmoq zonadan chiqib ketadi). Hamma kartochka joylashishi shart.

**8. Tartib.** Qadamlar aralashtirilgan holda beriladi, tartib **bir xil bo'lishi shart** —
ikki xil to'g'ri tartib bo'ladigan zanjir bu mexanikaga berilmaydi. Oxirgi qadam ko'pincha
TEKSHIRUV: javobga son qo'yib ko'rish.

**9. Xato qator.** Tayyor yechim, har bir qatori to'g'riday ko'rinadi, javob esa xato.
O'quvchi **birinchi** xato qatorni bosadi.

> **Metodist qarori 2026-08-26 (ikkinchi).** Ilgari bu yerda ikkinchi shart ham turardi:
> qatorni tanlashdan tashqari, u buziladigan SONNI ham kiritish kerak edi. Metodist uni
> olib tashladi — pastdagi qo'shimcha savol yo'q, faqat qatorlar ketma-ketligi qoladi.
> **Buning narxi ochiq:** to'rt qatordan bittasini tanlash — bu tasodifan to'g'ri
> tushish ehtimoli to'rtdan bir. Ilgari qarshi misol aynan shuni yopardi. Buni
> qoplaydigan ikkita talab kuchaytirildi: qatorlar **bir-biridan kelib chiqishi** kerak
> (oxirgi qator oldingisining natijasi bo'lsin, ya'ni «oxirgisini bosaman» yo'li ishlamasin),
> va `correctText` xatoning MOHIYATINI tushuntirsin — nima yo'qolgani va uni qaysi son
> ochib berishi.

**10. So'zlar.** Nazariy qoida yozilgan, undan bir nechta so'z tushib qolgan; o'quvchi
kartani bosadi, keyin bo'sh joyni bosadi. Majburiy: qoida darsning **hamma
`STATEMENTS`** ini o'z ichiga oladi, va bankda **tuzoq kartalar** bo'ladi — har biri
darsning aniq bir `MISS` iga tegadi. Tuzoqsiz bank topshiriqni terib chiqishga
aylantiradi. Bu yerda kartalar SO'Z, ya'ni `L()` ichida (matematika emas), `parts` esa
uch tilda bir xil shaklda: matn, uya, matn, uya...

---

## 3. RAQAMLAR VA JANRLAR

Qiyinlik o'qi hamma darsda bir xil: `🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴`.

Raskladka qoidalari:

1. Raskladka dars nomeri bilan aniqlanadi — qayta yig'ilsa o'sha chiqadi.
2. Yonma-yon bir xil mexanika turmaydi.
3. 1-pozitsiyaga boshqaruvi tushuntirishni talab qiladigan mexanika qo'yilmaydi:
   **Sonlar o'qi, Tartib, Xato qator, Belgilash** birinchi kelmaydi. Birinchi — Test,
   Ha/yo'q, Jadval yoki Javobni kiritish.
4. **Xato qator — 7-10 pozitsiyalar**: mavzu qo'lda bo'lishi kerak.
5. Bitta amaliyot ichida sonli misollar takrorlanmaydi.
6. Topshiriqlar darsning HAMMA `STATEMENTS` va HAMMA `MISS` ini yopadi, tanlab emas.
7. Geometriya darslarida (35-52) **Belgilash** ikki-uch pozitsiyani oladi, rasm esa chizma
   bo'ladi.

---

## 4. FAYLLAR VA REESTR

```
src/components/grade9/practice/
  asboblar9.jsx              — sinfning o'z mexanikalari: Jadval, Belgilash,
                               Javobni kiritish, Sonlar o'qi, Xato qator; va
                               `FuncGraph` — grafikning o'zi (mexanika emas, rasm)
  Amaliyot.jsx               — o'ram, SINFGA BITTA: makePractice({ HEAD, ITEMS })
  dars01/
    D01_01.jsx … D01_10.jsx  — bitta topshiriq = bitta fayl, ichida FAQAT ma'lumot
    Dars01Practice.jsx       — META + ITEMS, makePractice chaqiradi
```

O'ram va beshta mexanika **import qilinadi**, nusxalanmaydi:
`grade8/practice/PracticeHost.jsx` va `grade8/practice/kit.jsx` (`Choice`, `TrueFalse`,
`Zones`, `OrderLines`, `ClozeBank`). Xuddi shu yo'l bilan `grade9/Dars01.jsx` ham
`grade8/core.jsx`, `screens.jsx` ni oladi.

Qolgan beshtasi umumiy qatlamda YO'Q yoki u yerda BOSHQA xatti-harakat bilan turibdi
(sabablari `DARS01_AMALIYOT_KONTENT.md` §0a da bir-bir yozilgan): `RowTable`,
`PlacePoint`, `TypeSet`, `DomainAxis`, `AuditLines`.

**Xavf ochiq yozilgan:** `kit.jsx` endi 55 ta 8-sinf darsi va N ta 9-sinf darsiga
tegishli. Undagi har tuzatish ikki sinfni ham qimirlatadi. Shuning uchun 9-sinf uchun
kerak bo'lgan har qanday o'zgarish `kit.jsx` ga emas, `practice/asboblar9.jsx` ga
yoziladi.

**Reestr — ikkita tuzatish, bittasi emas:**

1. `src/lessons/grade9.js` — ikkinchi massiv `grade9Amaliy`.
2. `src/lessons/index.js` — `grade9Amaliy` importi va 9-sinfga `amaliy` bo'limini
   ro'yxatga olish. Hozir u yerda 9-sinfda faqat `nazariy` turibdi.

Marshrut: `/9-sinf/matematika/amaliy/dars01-amaliyot`.

Amaliyot ovozsiz.

---

## 5. TEKSHIRUVLAR

```
npx vite --port 5199

node scripts/grade9-practice-check.mjs                # to'g'ri javoblar bilan 10/10 + skroll yo'q
G9_WRONG=1 node scripts/grade9-practice-check.mjs     # noto'g'ri yo'llar: razbor BOR va bo'sh emas
npx eslint src/components/grade9/practice
npm run build
```

Javoblar va bosish ketma-ketligi `scripts/grade9-practice-plan.mjs` da — alohida modulda,
chunki ular razmetkada tursa, ularni o'quvchi ham ko'radi.

O'lchamlar: 1366x615, 1366x655, 1920x950, 390x745, 360x690, uch tilda. **Eng tor til —
inglizcha**, to'lib ketish o'sha yerda topiladi.
