# Darsliklar manifesti (reference textbooks)

Bu papkadagi PDF'lar — kontent yozishda termin va metodikani solishtirish uchun
**manba**. Saytga import qilinmaydi, GitHub'ga yuborilmaydi (`.gitignore`:
`src/books/**/*.pdf`). Bu fayl (`BOOKS.md`) esa git'da kuzatiladi.

Fayllar `gradeN/` papkalarga bo'lingan. Yangi PDF qo'shganda: tegishli `gradeN/`
papkaga sol va quyidagi jadvalga satr qo'sh.

## Qaysi PDF qaysi sinf

Quyidagi jadval shu kompyuterdagi `src/books/gradeN/` papkalaridagi haqiqiy fayllarni
aks ettiradi (PDF'lar git'ga yuborilmaydi, shuning uchun ikkinchi kompyuterda boshqa
RU manbalar ham bo'lishi mumkin — pastdagi izohga qarang).

| Sinf | Fayl | Til | Tur | Matn qatlami / `pdftotext` | Izoh |
|---|---|---|---|---|---|
| 1 | `grade1/1-matematika.pdf` | UZ | darslik | tekshirilmagan | asosiy UZ manba (1-sinf) |
| 1 | `grade1/1-matematika-yozuv-daftari.pdf` | UZ | ish daftari | tekshirilmagan | |
| 1 | `grade1/1-матем тетрадь.pdf` | RU | ish daftari | skan, faqat Read/OCR | |
| 1 | `grade1/1-матем.pdf` | RU | darslik | skan (~181 MB), faqat Read/OCR | katta hajmli skan |
| 2 | `grade2/Matematika 2 sinf UZ.pdf` | UZ | darslik | tekshirilmagan (~150 MB) | |
| 3 | `grade3/matematika_3_uzb.pdf` | UZ | darslik | tekshirilmagan | asosiy UZ manba (3-sinf) |
| 3 | `grade3/matematika_3-daftar_uzb_2022.pdf` | UZ | ish daftari | tekshirilmagan | |
| 3 | `grade3/matematika_3-metodika_uzb_2022.pdf` | UZ | metodika | tekshirilmagan | o'qituvchi uchun |
| 3 | `grade3/matematika_3-metodika_rus_2022.pdf` | RU | metodika | tekshirilmagan | o'qituvchi uchun |
| 3 | `grade3/3 матем рабочая тетрадь.pdf` | RU | ish daftari | skan, faqat Read/OCR | |
| 3 | `grade3/3 матем сжат.pdf` | RU | darslik | skan (~52 MB), faqat Read/OCR | |
| 4 | `grade4/4-matematika.pdf` | UZ | darslik | tekshirilmagan | |
| 4 | `grade4/matematika_4_rus.pdf` | RU | darslik | tekshirilmagan | |
| 5 | `grade5/Matematika. 5-sinf (2015, B.Haydarov).pdf` | UZ | darslik | **a'lo** — `pdftotext` toza | **asosiy UZ termin manbasi**, 240 bet |
| 6 | `grade6/matematika_6_uzb_2022.pdf` | UZ | darslik | tekshirilmagan | geometriya termin sverka uchun ishlatilgan |

> Eslatma: 5-sinf RU manbalari (`matematika_1qism_5_rus.pdf`, `matematika_5_rus_2.pdf`)
> ikkinchi kompyuterda bo'lishi mumkin — bu yerda hozir yo'q. PDF'lar `.gitignore`
> tufayli sinxronlanmaydi; kerak bo'lsa qo'lda ko'chiriladi.

## Qanday o'qiladi

- **Matn qatlami toza** (Haydarov 5-sinf): tez yo'l —
  `pdftotext "fayl.pdf" - | sed "s/\`/'/g"`. Apostrof `` ` `` va `−` belgilari
  `pdftotext` da buziladi, `sed` bilan tozalanadi.
- **Kirill qatlami buzuq / skan**: `pdftotext` faqat raqam beradi. `Read` tool
  (vision/OCR) bilan kerakli betlarni o'qi.
- Termin qoliplari: `... deb ataladi` / `... deyiladi` / `... — bu ...`.

Batafsil terminologiya eslatmalari xotirada: `textbooks-terminology`.
