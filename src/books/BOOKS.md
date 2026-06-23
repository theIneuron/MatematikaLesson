# Darsliklar manifesti (reference textbooks)

Bu papkadagi PDF'lar — kontent yozishda termin va metodikani solishtirish uchun
**manba**. Saytga import qilinmaydi, GitHub'ga yuborilmaydi (`.gitignore`:
`src/books/**/*.pdf`). Bu fayl (`BOOKS.md`) esa git'da kuzatiladi.

Yangi PDF qo'shganda: tegishli `gradeN/` papkaga sol va quyidagi jadvalga satr qo'sh.

## Qaysi PDF qaysi sinf

| Sinf | Fayl | Til | Matn qatlami / `pdftotext` | Izoh |
|---|---|---|---|---|
| 1 | `grade1/1-matematika.pdf` | UZ | tekshirilmagan | asosiy UZ manba (1-sinf) |
| 1 | `grade1/матем-1.pdf` | RU | skan (~189 MB), faqat Read/OCR | katta hajmli skan |
| 2 | `grade2/Matematika 2 sinf UZ.pdf` | UZ | tekshirilmagan (~157 MB) | |
| 2 | `grade2/матем 2 класс.pdf` | RU | skan (~168 MB), faqat Read/OCR | |
| 3 | `grade3/matematika_3_uzb.pdf` | UZ | tekshirilmagan | |
| 3 | `grade3/матем 3 класс.pdf` | RU | skan (~54 MB), faqat Read/OCR | |
| 4 | `grade4/4-matematika.pdf` | UZ | tekshirilmagan | |
| 4 | `grade4/matematika_4_rus.pdf` | RU | tekshirilmagan | |
| 5 | `grade5/Matematika. 5-sinf (2015, B.Haydarov).pdf` | UZ | **a'lo** — `pdftotext` toza | **asosiy UZ termin manbasi**, 240 bet |
| 5 | `grade5/matematika_1qism_5_rus.pdf` | RU | kirill qatlami buzuq — faqat Read/OCR | 144 bet |
| 5 | `grade5/matematika_5_rus_2.pdf` | RU | kirill qatlami buzuq — faqat Read/OCR | |
| 6 | `grade6/matematika_6_uzb_2022.pdf` | UZ | tekshirilmagan | geometriya termin sverka uchun ishlatilgan |

## Qanday o'qiladi

- **Matn qatlami toza** (Haydarov 5-sinf): tez yo'l —
  `pdftotext "fayl.pdf" - | sed "s/\`/'/g"`. Apostrof `` ` `` va `−` belgilari
  `pdftotext` da buziladi, `sed` bilan tozalanadi.
- **Kirill qatlami buzuq / skan**: `pdftotext` faqat raqam beradi. `Read` tool
  (vision/OCR) bilan kerakli betlarni o'qi.
- Termin qoliplari: `... deb ataladi` / `... deyiladi` / `... — bu ...`.

Batafsil terminologiya eslatmalari xotirada: `textbooks-terminology`.
