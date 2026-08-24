# DARS02_AMALIYOT_KONTENT — 8-sinf, 2-dars amaliyoti, o'nta topshiriqning to'liq matni

> 2-bosqich (KONTENT). Kirish: `TIPLAR_AMALIYOT_8SINF.md` (o'nta tip, janrlar, raskladka),
> `src/components/grade8/Dars02.jsx` (`STATEMENTS`, `MISS`, uchta USUL).
> Chiqish: `src/components/grade8/practice/dars02/D02_01…10.jsx` uchun ma'lumot.
>
> Metodist qarori 2026-08-22: 1-dars amaliyotiga TEGILMAYDI (7-sinf nusxasi joyida qoladi).
> Dizayn va ranglar 7-sinfnikidek: fon `#fff7ed`, urg'u `#fe5b1a`, `kit.jsx` palitrasi.
> O'zgaradigan narsa — matematika va o'nta MEXANIKA.

---

## 0. QOIDALAR, ULARSIZ BU FAYL O'QILMAYDI

1. **Matematika til blokidan TASHQARIDA.** `MA'LUMOT` bo'limidagi yozuv, karta, variant —
   tarjima emas, matematikaning o'zi. `UZ / RU / EN` bo'limlarida faqat SO'ZLAR.
2. **Har noto'g'ri YO'LGA o'z razbori.** «Noto'g'ri» — razbor emas. `wrongs[]` tartib bilan
   tekshiriladi, birinchi mos kelgani chiqadi, oxirgisi `wrongText`.
3. **Razbor javobni bermaydi, BELGINI ko'rsatadi** va iloji bo'lsa son bilan tekshirishga
   yuboradi (`З16` shu yerda o'ladi).
4. **Javob bir marta tekshiriladi**, keyin topshiriq qulflanadi. Maslahat tugmasi yo'q.
5. UZ — `siz`, apostrof ASCII `'`. RU — `ты`, jinssiz shakl. Kirillcha UZ satrda yo'q.
6. Amaliyotda ovoz YO'Q.

## 1. DARS NIMANI DA'VO QILADI — AMALIYOT SHUNI TEKSHIRADI

| Kod | Tasdiq (`STATEMENTS`) |
|---|---|
| T1 | Surat va maxraj bitta ifodaga ko'paytiriladi yoki bo'linadi, kasrning qiymati o'zgarmaydi |
| T2 | Ko'paytuvchi nol bo'lmaydi: nolda surat ham, maxraj ham nolga aylanadi |
| T3 | Harfli ko'paytuvchi yangi shart qo'shadi; tenglik ikki yozuv ham aniqlangan joyda turadi |

| Kod | Adashish (`MISS`) |
|---|---|
| З1 | bir xil son qo'shildi, ko'paytirilmadi |
| З2 | ko'paytirishda ruhsat etilgan qiymatlar yo'qoldi |
| З16 | javob son bilan tekshirilmadi |
| З20 | faqat surat yoki faqat maxraj ko'paytirildi |
| З21 | nol ko'paytuvchi qonuniy deb olindi |
| З22 | kasrdagi minus o'zi yo'qoldi |

## 2. RASKLADKA

| № | Mexanika | Janr | Qiy. | Teg | Tasdiq / adashish |
|---:|---|---|:--:|---|---|
| 01 | `input` | to'g'ridan-to'g'ri | 🟢 | `missing_factor` | T1 · З1 З20 |
| 02 | `sort` | to'g'ridan-to'g'ri | 🟢 | `property_held` | T1 T2 T3 · З1 З20 З21 З22 |
| 03 | `slots` | natija + shart | 🟢 | `chain_condition` | T1 T3 · З2 З20 З21 |
| 04 | `odz` | natija + shart | 🟡 | `result_and_odz` | T3 · З2 З20 |
| 05 | `steps` | to'g'ridan-to'g'ri | 🟡 | `minus_move` | T1 T2 · З20 З22 |
| 06 | `boundary` | chegara | 🟡 | `where_split` | T2 · З2 З16 З21 |
| 07 | `tapparts` | to'g'ridan-to'g'ri | 🟡 | `common_factor` | T1 · З1 З20 |
| 08 | `audit` | audit | 🔴 | `first_wrong_line` | T3 · З2 З16 |
| 09 | `build` | teskari masala | 🔴 | `inverse_build` | T1 T2 T3 · З20 З21 |
| 10 | `markall` | oldingi dars | 🔴 | `always_true` | T1 T2 T3 · З1 З21 З22 |

Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. `audit` 7–10 da, `boundary` 6 dan oldin emas,
1-pozitsiyada boshqarish tushuntirishni talab qiladigan tip yo'q, yonma-yon bir xil tip yo'q.

## 3. SARLAVHA VA CHIP QATORI

```
HEAD = {
  uz: "Dars 2 amaliyoti — 10 topshiriq (kasrning asosiy xossasi)",
  ru: "Практика урока 2 — 10 заданий (основное свойство дроби)",
  en: "Lesson 2 practice — 10 tasks (the basic property of a fraction)",
}
```

| № | uz | ru | en |
|---:|---|---|---|
| 01 | Ko'paytuvchi | Множитель | Factor |
| 02 | Xossa | Свойство | Property |
| 03 | Zanjir | Цепочка | Chain |
| 04 | Shart | Условие | Condition |
| 05 | Minus | Минус | Minus |
| 06 | Chegara | Граница | Boundary |
| 07 | Juftlik | Пара | Pair |
| 08 | Audit | Аудит | Audit |
| 09 | Yig'ish | Сборка | Assemble |
| 10 | Tenglik | Равенства | Equalities |

---

## 01 · `input` · 🟢 · `missing_factor`

### MA'LUMOT

```
expr:    4/(3y)  =  ?/(15y²)
answer:  20y                       // judgeExpr: qiymat solishtiriladi, matn emas
probe:   y = 2  →  4/6 = 2/3   va   40/60 = 2/3
hints:
  '20'     — ko'paytuvchi 5 deb olindi, y tushib qoldi
  '5y'     — ko'paytuvchining o'zi javob deb yozildi
  '20y^2'  — 15y² : 3 = 5y² deb bo'lindi, 3y ga emas
  '12y'    — eski maxraj 3y ga ko'paytirildi
  '4+5y'   — qo'shildi, ko'paytirilmadi (З1)
```

### UZ

- eyebrow: `Ko'paytuvchi`
- title: `Yetmagan surat`
- setup: `Bu ikki kasr teng. O'ng tomonning maxraji chap tomonnikidan ko'paytirish bilan hosil qilingan, surati esa yozilmagan.`
- ask: `Surat qanday bo'ladi?`
- correct: `To'g'ri. O'n besh y kvadratni uch y ga bo'lsangiz, ko'paytuvchi besh y chiqadi. Surat ham shunga ko'paytiriladi: to'rt karra besh y — yigirma y. Y ni ikkiga teng qo'yib tekshiring: chapda ikki uchdan, o'ngda ham ikki uchdan.`
- wrongs:
  - `'20'` → `Ko'paytuvchi besh emas, besh y. Maxraj uch y dan o'n besh y kvadratga o'tdi: bu yerda son ham, harf ham ko'paydi. Surat ikkalasini birga olishi kerak.`
  - `'5y'` → `Bu ko'paytuvchining o'zi, surat emas. Uni to'rtga ko'paytiring.`
  - `'20y^2'` → `O'n besh y kvadratni uch y ga bo'ling, uchning o'ziga emas. Bo'linma besh y bo'ladi, besh y kvadrat emas.`
  - `'12y'` → `Siz eski maxrajga ko'paytirdingiz. Kerak bo'lgani — eski maxrajni yangisiga o'tkazadigan ko'paytuvchi.`
  - `'4+5y'` → `Xossa qo'shish haqida emas, ko'paytirish haqida. Y ni ikkiga qo'ying: to'rt qo'shuv o'n bu o'n to'rt, kerakli javob esa qirq.`
- wrongText: `Avval ko'paytuvchini toping: yangi maxrajni eskisiga bo'ling. Keyin suratni o'sha ko'paytuvchiga ko'paytiring.`

### RU

- eyebrow: `Множитель`
- title: `Пропавший числитель`
- setup: `Эти две дроби равны. Знаменатель справа получен из левого умножением, а числитель не записан.`
- ask: `Каким будет числитель?`
- correct: `Верно. Пятнадцать игрек в квадрате делим на три игрек — множитель пять игрек. Числитель умножаем на него же: четыре на пять игрек — двадцать игрек. Подставь игрек равный двум: слева две трети, справа тоже две трети.`
- wrongs:
  - `'20'` → `Множитель не пять, а пять игрек. Знаменатель прошёл путь от трёх игрек до пятнадцати игрек в квадрате: выросло и число, и буква. Числитель обязан взять сразу оба.`
  - `'5y'` → `Это сам множитель, а не числитель. Умножь на него четыре.`
  - `'20y^2'` → `Дели пятнадцать игрек в квадрате на три игрек, а не на тройку. Частное — пять игрек, а не пять игрек в квадрате.`
  - `'12y'` → `Ты умножил на старый знаменатель. Нужен тот множитель, который переводит старый знаменатель в новый.`
  - `'4+5y'` → `Свойство про умножение, а не про прибавление. Подставь игрек равный двум: четыре плюс десять — четырнадцать, а нужно сорок.`
- wrongText: `Сначала найди множитель: раздели новый знаменатель на старый. Потом умножь на него числитель.`

### EN

- eyebrow: `Factor`
- title: `The missing numerator`
- setup: `These two fractions are equal. The right denominator came from the left one by multiplication; the numerator is not written.`
- ask: `What is the numerator?`
- correct: `Correct. Fifteen y squared divided by three y gives the factor five y. The numerator takes the same: four times five y is twenty y. Put y equal to two: two thirds on the left, two thirds on the right.`
- wrongs:
  - `'20'` → `The factor is not five, it is five y. The denominator went from three y to fifteen y squared: both the number and the letter grew. The numerator must take both at once.`
  - `'5y'` → `That is the factor itself, not the numerator. Multiply four by it.`
  - `'20y^2'` → `Divide fifteen y squared by three y, not by three. The quotient is five y, not five y squared.`
  - `'12y'` → `You multiplied by the old denominator. What is needed is the factor that turns the old denominator into the new one.`
  - `'4+5y'` → `The property is about multiplying, not adding. Put y equal to two: four plus ten is fourteen, but forty is needed.`
- wrongText: `First find the factor: divide the new denominator by the old one. Then multiply the numerator by it.`

---

## 02 · `sort` · 🟢 · `property_held`

### MA'LUMOT

```
base:  a/(a + 3)
zones: 'held' | 'broken'
items:
  i1   3a / (3(a + 3))           held     son ko'paytuvchi 3
  i2   ab / ((a + 3)b)           held     harfli ko'paytuvchi b, yangi shart b ≠ 0
  i3   (−a) / (−(a + 3))         held     ko'paytuvchi −1
  i4   a² / (a(a + 3))           held     ko'paytuvchi a, yangi shart a ≠ 0
  i5   (a + 4) / ((a + 3) + 4)   broken   qo'shildi (З1)
  i6   5a / (a + 3)              broken   faqat surat (З20)
  i7   (a · 0) / ((a + 3) · 0)   broken   nol ko'paytuvchi (З21)
  i8   (a − 1) / ((a + 3) − 1)   broken   ayirildi (З1)
tekshiruv: hammasi yoki hech narsa
probe:  a = 1  →  base = 1/4;  i1 = 3/12 = 1/4 ✓;  i5 = 5/8 ✗;  i8 = 0/3 = 0 ✗
```

### UZ

- eyebrow: `Xossa`
- title: `Bajarildimi yoki buzildimi`
- setup: `Chapdagi kasrdan sakkizta yozuv yasalgan. Ba'zilarida asosiy xossa bajarilgan, ba'zilarida buzilgan.`
- ask: `Kartani bosing, keyin zonani bosing. Sakkizala yozuv ham joyini topishi kerak.`
- zones: `XOSSA BAJARILDI` / `XOSSA BUZILDI`
- bank: `Yozuvlar`
- note: `Zonadagi kartani bosish uni qaytarib oladi.`
- correct: `To'g'ri. Xossa bitta narsani so'raydi: surat ham, maxraj ham BITTA va O'SHA ko'paytuvchiga ko'paytirilsin, va o'sha ko'paytuvchi nol bo'lmasin. Son, harf va minus bir — hammasi qonuniy ko'paytuvchi.`
- wrongs:
  - `i3 → 'broken'` → `Minus ham ko'paytuvchi: u minus bir. Surat ham, maxraj ham unga ko'paytirilgan, demak xossa bajarilgan. Minus bir hech qachon nol emas, shuning uchun yangi shart ham qo'shilmaydi.`
  - `i7 → 'held'` → `Nol ko'paytuvchi bo'la olmaydi. Unga ko'paytirsangiz suratda ham, maxrajda ham nol qoladi, va kasr butunlay yo'qoladi.`
  - `i5 yoki i8 → 'held'` → `Xossa KO'PAYTIRISH haqida. Bir xil sonni qo'shish yoki ayirish kasrni o'zgartiradi: a ni birga teng qo'ying va o'zingiz ko'ring.`
  - `i6 → 'held'` → `Bu yerda faqat surat ko'paytirilgan, maxraj tegilmagan. Xossa ikkalasini birga so'raydi.`
  - `i2 yoki i4 → 'broken'` → `Harfli ko'paytuvchi ham ko'paytuvchi. U xossani buzmaydi, faqat yangi shart qo'shadi: harf nolga aylanadigan qiymat endi mumkin emas.`
- wrongText: `Har yozuvga bitta savol bering: surat va maxraj BITTA va O'SHA narsaga ko'paytirilganmi? Agar qo'shilgan yoki faqat bir tomoni tegilgan bo'lsa — buzilgan.`

### RU

- eyebrow: `Свойство`
- title: `Выполнено или нарушено`
- setup: `Из левой дроби сделали восемь записей. В одних основное свойство выполнено, в других нарушено.`
- ask: `Нажми карточку, потом зону. Все восемь записей обязаны найти место.`
- zones: `СВОЙСТВО ВЫПОЛНЕНО` / `СВОЙСТВО НАРУШЕНО`
- bank: `Записи`
- note: `Нажатие на карточку в зоне возвращает её обратно.`
- correct: `Верно. Свойство требует одного: и числитель, и знаменатель умножены на ОДНО И ТО ЖЕ, и это одно и то же не нуль. Число, буква и минус один — всё это законные множители.`
- wrongs:
  - `i3 → 'broken'` → `Минус — тоже множитель: это минус один. И верх, и низ умножены на него, значит свойство выполнено. Минус один никогда не нуль, поэтому нового условия тоже нет.`
  - `i7 → 'held'` → `Нуль множителем не бывает. После умножения на него и сверху, и снизу останется нуль, и дробь исчезнет совсем.`
  - `i5 или i8 → 'held'` → `Свойство про УМНОЖЕНИЕ. Прибавить или отнять одно и то же — значит изменить дробь: подставь а равное одному и посмотри сам.`
  - `i6 → 'held'` → `Здесь умножен только числитель, знаменатель не тронут. Свойство просит оба сразу.`
  - `i2 или i4 → 'broken'` → `Буквенный множитель — тоже множитель. Он не нарушает свойство, он добавляет условие: значение, при котором буква обращается в нуль, теперь недопустимо.`
- wrongText: `К каждой записи один вопрос: числитель и знаменатель умножены на ОДНО И ТО ЖЕ? Если прибавили или тронули только одну сторону — нарушено.`

### EN

- eyebrow: `The property`
- title: `Held or broken`
- setup: `Eight records were made from the fraction on the left. In some the basic property holds, in others it is broken.`
- ask: `Tap a card, then a zone. All eight records must find a place.`
- zones: `PROPERTY HELD` / `PROPERTY BROKEN`
- bank: `Records`
- note: `Tapping a card inside a zone takes it back.`
- correct: `Correct. The property asks for one thing: numerator and denominator multiplied by the SAME thing, and that same thing is not zero. A number, a letter and minus one are all legitimate factors.`
- wrongs:
  - `i3 → 'broken'` → `The minus is a factor too: it is minus one. Both top and bottom are multiplied by it, so the property holds. Minus one is never zero, so no new condition appears either.`
  - `i7 → 'held'` → `Zero is never a factor. Multiply by it and zero is left both above and below, and the fraction disappears entirely.`
  - `i5 or i8 → 'held'` → `The property is about MULTIPLYING. Adding or subtracting the same thing changes the fraction: put a equal to one and see for yourself.`
  - `i6 → 'held'` → `Here only the numerator is multiplied, the denominator is untouched. The property asks for both at once.`
  - `i2 or i4 → 'broken'` → `A factor with a letter is still a factor. It does not break the property, it adds a condition: the value where the letter becomes zero is now not allowed.`
- wrongText: `Ask one question of each record: are numerator and denominator multiplied by the SAME thing? If something was added, or only one side was touched, it is broken.`

---

## 03 · `slots` · 🟢 · `chain_condition`

### MA'LUMOT

```
rows:
  6/(m + 5)  =  (6 · [s1]) / ((m + 5) · [s2])  =  [s3] / (m² + 5m)
  Shart:  m ≠ [s4],   m ≠ [s5]

answer:  s1 = m,  s2 = m,  s3 = 6m,  {s4, s5} = {−5, 0}   // ikki shart tartibsiz qabul qilinadi
cards (bank):  m · m · 6m · 6m² · 6 · 0 · 5 · −5 · m + 5
tuzoq kartalar va ular javob beradigan adashish:
  '5'      — maxrajdagi sonni ishorasiz ko'chirish
  '0'      — s1/s2 ga qo'yilsa: nol ko'paytuvchi (З21)
  '6'      — suratning o'z soniga ko'paytirish
  'm + 5'  — butun maxrajga ko'paytirish
  '6m²'    — suratni m² ga ko'paytirish
tekshiruv: hammasi yoki hech narsa
probe:  m = 1  →  6/6 = 1   va   6/6 = 1
```

### UZ

- eyebrow: `Zanjir`
- title: `Yechim va uning sharti`
- setup: `Kasr maxraji m² + 5m bo'lgan kasrga aylantirilgan. Yechim yozilgan, lekin beshta joyi bo'sh.`
- ask: `Kartani bosing, keyin bo'sh katakni bosing.`
- bank: `Kartalar`
- note: `Pastdagi ikki katak — shart. Ular tartibi muhim emas.`
- correct: `To'g'ri. Maxraj m ga ko'paytirilgan, demak surat ham m ga ko'paytiriladi: olti m. Shartlar ikkita: eskisi maxraj m qo'shuv besh dan — m minus beshga teng emas, yangisi ko'paytuvchi m dan — m nolga teng emas.`
- wrongs:
  - `s1 ≠ s2` → `Surat va maxraj bitta va o'sha ifodaga ko'paytiriladi. Ikki xil ko'paytuvchi kasrning qiymatini o'zgartiradi.`
  - `s1 yoki s2 = '0'` → `Nol ko'paytuvchi emas: unda surat ham, maxraj ham nolga aylanadi va kasr yo'qoladi.`
  - `s1 yoki s2 = 'm + 5'` → `Siz butun maxrajga ko'paytirdingiz. Kerakli ko'paytuvchini toping: yangi maxraj m² qo'shuv besh m ni eskisiga bo'ling.`
  - `s3 = '6m²'` → `Surat oltini m ga ko'paytiradi, m kvadratga emas. Ko'paytuvchi maxrajda ham bitta m edi.`
  - `s4 yoki s5 = '5'` → `Maxraj m qo'shuv besh nolga m minus beshda aylanadi, m beshda emas. Qo'yib ko'ring: besh qo'shuv besh — o'n.`
  - `ikkala shart katagi bir xil` → `Shartlar ikkita va ular boshqa joydan keladi: biri eski maxrajdan, ikkinchisi yangi ko'paytuvchidan. Biri ikkinchisining o'rnini bosmaydi.`
- wrongText: `Ko'paytuvchini toping, uni ikkala qavatga ham qo'ying, keyin ikkita shartni yozing: eskisi maxrajdan, yangisi ko'paytuvchidan.`

### RU

- eyebrow: `Цепочка`
- title: `Решение и его условие`
- setup: `Дробь привели к знаменателю m² + 5m. Решение записано, но пять мест пустые.`
- ask: `Нажми карточку, потом пустую клетку.`
- bank: `Карточки`
- note: `Две нижние клетки — условие. Их порядок не важен.`
- correct: `Верно. Знаменатель умножен на m, значит и числитель умножается на m: шесть m. Условий два: старое из знаменателя m плюс пять — m не равно минус пяти, новое из множителя m — m не равно нулю.`
- wrongs:
  - `s1 ≠ s2` → `Числитель и знаменатель умножают на одно и то же. Два разных множителя меняют значение дроби.`
  - `s1 или s2 = '0'` → `Нуль не множитель: при нём и числитель, и знаменатель обращаются в нуль, и дробь исчезает.`
  - `s1 или s2 = 'm + 5'` → `Ты умножил на весь знаменатель. Найди нужный множитель: раздели новый знаменатель m² плюс пять m на старый.`
  - `s3 = '6m²'` → `Числитель умножают шестёрку на m, а не на m в квадрате. В знаменателе множителем тоже была одна m.`
  - `s4 или s5 = '5'` → `Знаменатель m плюс пять обращается в нуль при m равном минус пяти, а не при пяти. Подставь: пять плюс пять — десять.`
  - `обе клетки условия одинаковые` → `Условий два, и приходят они из разных мест: одно из старого знаменателя, другое из нового множителя. Одно не заменяет другое.`
- wrongText: `Найди множитель, поставь его на оба этажа, потом запиши два условия: старое из знаменателя, новое из множителя.`

### EN

- eyebrow: `Chain`
- title: `The solution and its condition`
- setup: `The fraction was brought to the denominator m² + 5m. The solution is written, but five places are empty.`
- ask: `Tap a card, then an empty cell.`
- bank: `Cards`
- note: `The two lower cells are the condition. Their order does not matter.`
- correct: `Correct. The denominator was multiplied by m, so the numerator is multiplied by m too: six m. There are two conditions: the old one from the denominator m plus five — m is not minus five, and the new one from the factor m — m is not zero.`
- wrongs:
  - `s1 ≠ s2` → `Numerator and denominator are multiplied by the same thing. Two different factors change the value of the fraction.`
  - `s1 or s2 = '0'` → `Zero is not a factor: with it both numerator and denominator become zero, and the fraction disappears.`
  - `s1 or s2 = 'm + 5'` → `You multiplied by the whole denominator. Find the right factor: divide the new denominator m² plus five m by the old one.`
  - `s3 = '6m²'` → `The numerator multiplies six by m, not by m squared. In the denominator the factor was one m as well.`
  - `s4 or s5 = '5'` → `The denominator m plus five becomes zero at m equal to minus five, not at five. Substitute: five plus five is ten.`
  - `both condition cells the same` → `There are two conditions and they come from different places: one from the old denominator, the other from the new factor. One does not replace the other.`
- wrongText: `Find the factor, put it on both floors, then write two conditions: the old one from the denominator, the new one from the factor.`

---

## 04 · `odz` · 🟡 · `result_and_odz`

### MA'LUMOT

```
expr:    8/(c − 2)   →   maxraji c² − 2c bo'lgan kasrga
factor:  c            // chunki c² − 2c = c(c − 2)
field 1 (natija):  8c/(c² − 2c)          judgeExpr
field 2 (shart):   c ≠ 0,  c ≠ 2         judgeOdz, tartib muhim emas
probe:   c = 3  →  8/(3 − 2) = 8   va   24/(9 − 6) = 8
wrongs uchun holatlar:
  r_ok + odz = {2}        — yangi shart yo'qoldi (З2)
  r_ok + odz = {0}        — eski shart yo'qoldi (З2)
  r = 8/(c² − 2c)         — faqat maxraj ko'paytirildi (З20)
  r = 8c/(c − 2)          — faqat surat ko'paytirildi (З20)
  odz = {0, −2}           — c − 2 nolga −2 da aylanadi deb o'ylandi
```

### UZ

- eyebrow: `Shart`
- title: `Natija va uning sharti`
- setup: `Kasrni maxraji c² − 2c bo'ladigan qilib qayta yozing. Yozuvning o'zi va uning to'liq sharti kerak.`
- ask: `Yuqoriga kasrni yozing, pastga shartni.`
- labelResult: `Kasr`
- labelOdz: `Shart`
- note: `Telefonda bitta maydon ochiq turadi, ikkinchisini bosib oching. Tekshirish bitta, ikkala javob birga.`
- correct: `To'g'ri. C kvadrat minus ikki c bu c ni c minus ikkiga ko'paytirgani, demak ko'paytuvchi c. Surat ham c ga ko'paytiriladi: sakkiz c. Shart ikkita: c nolga teng emas va c ikkiga teng emas.`
- wrongs:
  - `kasr to'g'ri, shart = {2}` → `Kasr to'g'ri yozildi, shart esa yarim qoldi. Ko'paytuvchi c yangi taqiq qo'shdi: c nolda yangi maxraj nolga aylanadi. Nolni qo'ying va o'zingiz ko'ring.`
  - `kasr to'g'ri, shart = {0}` → `Yangi shartni topdingiz, eskisi esa yo'qoldi. Dastlabki kasr c ikkida ham ma'noga ega emas edi, va u shunday qolaveradi: qayta yozish taqiqni olib tashlamaydi.`
  - `kasr = 8/(c² − 2c)` → `Faqat maxraj ko'paytirilgan, surat tegilmagan. Bunda kasrning qiymati o'zgaradi: c ni uchga teng qo'ying, dastlabkisi sakkiz beradi, sizniki esa sakkiz uchdan.`
  - `kasr = 8c/(c − 2)` → `Faqat surat ko'paytirilgan. Maxraj esa c minus ikki bo'lib qoldi, ya'ni talab qilingan c kvadrat minus ikki c emas.`
  - `shart = {0, −2}` → `Maxraj c minus ikki nolga c ikkida aylanadi, minus ikkida emas. Minus ikkini qo'ying: minus ikki minus ikki bu minus to'rt.`
  - `shart bo'sh` → `Shartsiz javob to'liq emas. Ko'paytuvchi harfli bo'lsa, u har doim yangi taqiq olib keladi.`
- wrongText: `Ko'paytuvchini maxrajdan toping, uni ikkala qavatga qo'ying, so'ng ikkita shartni yozing: eski maxrajdan va yangi ko'paytuvchidan.`

### RU

- eyebrow: `Условие`
- title: `Результат и его условие`
- setup: `Перепиши дробь так, чтобы знаменателем стало c² − 2c. Нужна сама запись и её полное условие.`
- ask: `Сверху запиши дробь, снизу условие.`
- labelResult: `Дробь`
- labelOdz: `Условие`
- note: `На телефоне открыто одно поле, второе раскрывается нажатием. Проверка одна, оба ответа вместе.`
- correct: `Верно. C в квадрате минус два c — это c, умноженное на c минус два, значит множитель c. Числитель тоже умножается на c: восемь c. Условий два: c не равно нулю и c не равно двум.`
- wrongs:
  - `дробь верна, условие = {2}` → `Дробь записана верно, а условие осталось наполовину. Множитель c добавил новый запрет: при c равном нулю новый знаменатель обращается в нуль. Подставь нуль и посмотри сам.`
  - `дробь верна, условие = {0}` → `Новое условие ты нашёл, а старое потерялось. Исходная дробь и при c равном двум не имела значения, и это остаётся: переписывание запрет не снимает.`
  - `дробь = 8/(c² − 2c)` → `Умножен только знаменатель, числитель не тронут. От этого значение дроби меняется: подставь c равное трём — исходная даёт восемь, а твоя восемь третьих.`
  - `дробь = 8c/(c − 2)` → `Умножен только числитель. Знаменатель так и остался c минус два, то есть не тот, который требовался.`
  - `условие = {0, −2}` → `Знаменатель c минус два обращается в нуль при c равном двум, а не при минус двух. Подставь минус два: минус два минус два — минус четыре.`
  - `условие пустое` → `Без условия ответ не полон. Если множитель буквенный, он всегда приносит новый запрет.`
- wrongText: `Найди множитель по знаменателю, поставь его на оба этажа, потом запиши два условия: от старого знаменателя и от нового множителя.`

### EN

- eyebrow: `Condition`
- title: `The result and its condition`
- setup: `Rewrite the fraction so that its denominator becomes c² − 2c. Both the record itself and its full condition are needed.`
- ask: `Write the fraction above, the condition below.`
- labelResult: `Fraction`
- labelOdz: `Condition`
- note: `On a phone one field is open, the second one unfolds on tap. There is one check, and both answers go together.`
- correct: `Correct. C squared minus two c is c times c minus two, so the factor is c. The numerator is multiplied by c as well: eight c. There are two conditions: c is not zero and c is not two.`
- wrongs:
  - `fraction right, condition = {2}` → `The fraction is right, but the condition is half done. The factor c added a new ban: at c equal to zero the new denominator becomes zero. Substitute zero and see for yourself.`
  - `fraction right, condition = {0}` → `You found the new condition, and the old one was lost. The original fraction had no value at c equal to two either, and that stays: rewriting does not lift a ban.`
  - `fraction = 8/(c² − 2c)` → `Only the denominator was multiplied, the numerator untouched. That changes the value: put c equal to three — the original gives eight, yours gives eight thirds.`
  - `fraction = 8c/(c − 2)` → `Only the numerator was multiplied. The denominator stayed c minus two, which is not the one that was asked for.`
  - `condition = {0, −2}` → `The denominator c minus two becomes zero at c equal to two, not at minus two. Substitute minus two: minus two minus two is minus four.`
  - `condition empty` → `Without a condition the answer is incomplete. When the factor has a letter, it always brings a new ban.`
- wrongText: `Find the factor from the denominator, put it on both floors, then write two conditions: from the old denominator and from the new factor.`

---

## 05 · `steps` · 🟡 · `minus_move`

### MA'LUMOT

```
start:  9/(−k)
goal:   maxrajdagi minusni chiqarish
steps (har qadamda IKKI slot: amal + asos; qadam ikkalasi to'g'ri bo'lsagina sanaladi):
  1  amal: "surat va maxrajni −1 ga ko'paytiraman"   asos: "2-USUL. Minus ko'chishi"
  2  amal: "−9/k"                                     asos: "Xossa: surat va maxraj bitta ifodaga ko'paytiriladi"
  3  amal: "shart o'sha: k ≠ 0"                       asos: "3-USUL: ko'paytuvchi −1 hech qachon nol emas"

actions bank:
  ✓ "surat va maxrajni −1 ga ko'paytiraman"
  ✓ "−9/k"
  ✓ "shart o'sha: k ≠ 0"
  ✗ "maxrajni −1 ga bo'laman"        (З20)
  ✗ "minusni o'chiraman"             (З22)
  ✗ "9/k"                            (З22)
  ✗ "yangi shart: k ≠ −1"
  ✗ "shart yo'qoladi"

reasons bank:
  ✓ "2-USUL. Minus ko'chishi"
  ✓ "Xossa: surat va maxraj bitta ifodaga ko'paytiriladi"
  ✓ "3-USUL: ko'paytuvchi −1 hech qachon nol emas"
  ✗ "Minus kasrda o'zi yo'qoladi"    (З22)
  ✗ "1-USUL: yetmagan ko'paytuvchini topamiz"
  ✗ "−1 yangi shart qo'shadi: k ≠ −1"

probe:  k = 3  →  9/(−3) = −3   va   −9/3 = −3
```

### UZ

- eyebrow: `Minus`
- title: `Minus maxrajdan chiqadi`
- setup: `Maxrajda minus turibdi. Uni kasr oldiga chiqarish kerak, va har qadamda nima qilganingizni ham, nega mumkinligini ham ko'rsatasiz.`
- ask: `Har qatorga ikkita karta qo'ying: amal va uning asosi.`
- colAction: `AMAL`
- colReason: `ASOS`
- correct: `To'g'ri. Minus o'z-o'zidan ko'chmaydi: siz surat va maxrajni minus birga ko'paytirdingiz, xossa esa buni ruxsat etadi. Minus bir hech qachon nol bo'lmagani uchun yangi shart paydo bo'lmadi, eskisi esa o'z joyida: k nolga teng emas.`
- wrongs:
  - `amal "minusni o'chiraman" yoki asos "Minus kasrda o'zi yo'qoladi"` → `Minus o'z-o'zidan yo'qolmaydi. U faqat bir yo'l bilan ko'chadi: surat ham, maxraj ham minus birga ko'paytiriladi. K ni uchga teng qo'ying: to'qqiz bo'lingan minus uch bu minus uch, to'qqiz bo'lingan uch esa uch.`
  - `amal "maxrajni −1 ga bo'laman"` → `Faqat maxraj tegilsa kasrning qiymati o'zgaradi. Xossa ikkala qavatni birga so'raydi.`
  - `amal "9/k"` → `Minus yo'qolib qoldi. Uni yozuvdan olib tashlab bo'lmaydi, faqat boshqa joyga ko'chirish mumkin: kasr oldiga.`
  - `amal "yangi shart: k ≠ −1" yoki asos "−1 yangi shart qo'shadi"` → `Yangi shart faqat ko'paytuvchi nolga aylanadigan joyda tug'iladi. Minus bir esa hech qachon nol emas, demak yangi taqiq yo'q.`
  - `amal "shart yo'qoladi"` → `Maxrajda k qolgan. K nolda kasr baribir ma'noga ega emas, minusning ko'chishi bunga ta'sir qilmaydi.`
  - `asos "1-USUL: yetmagan ko'paytuvchini topamiz"` → `Birinchi usul maxrajni boshqa maxrajga o'tkazish uchun. Bu yerda maxraj o'zgarmaydi, faqat minus joyini almashtiradi.`
  - `amal to'g'ri, asos noto'g'ri` → `Amal to'g'ri, asos esa mos emas. Amaliyotda ikkalasi ham so'raladi: nima qildingiz va nega bunday qilish mumkin.`
- wrongText: `Minus — bu ko'paytuvchi minus bir. Uni ikkala qavatga ham qo'llang, keyin shart o'zgardimi yoki yo'qmi, shuni tekshiring.`

### RU

- eyebrow: `Минус`
- title: `Минус уходит из знаменателя`
- setup: `В знаменателе стоит минус. Его нужно вынести перед дробью, и на каждом шаге ты показываешь и что сделал, и почему это можно.`
- ask: `В каждую строку поставь две карточки: действие и его основание.`
- colAction: `ДЕЙСТВИЕ`
- colReason: `ОСНОВАНИЕ`
- correct: `Верно. Минус не переезжает сам: ты умножил числитель и знаменатель на минус один, а свойство это разрешает. Минус один никогда не нуль, поэтому нового условия не появилось, а старое осталось на месте: k не равно нулю.`
- wrongs:
  - `действие "стираю минус" или основание "минус в дроби пропадает сам"` → `Минус сам не пропадает. Он переезжает единственным способом: и числитель, и знаменатель умножают на минус один. Подставь k равное трём: девять делить на минус три — минус три, а девять делить на три — три.`
  - `действие "делю знаменатель на −1"` → `Если тронут только знаменатель, значение дроби меняется. Свойство просит оба этажа сразу.`
  - `действие "9/k"` → `Минус пропал. Убрать его из записи нельзя, можно только перенести в другое место: перед дробь.`
  - `действие "новое условие: k ≠ −1" или основание "−1 добавляет условие"` → `Новое условие рождается только там, где множитель обращается в нуль. Минус один нулём не бывает, значит нового запрета нет.`
  - `действие "условие исчезает"` → `В знаменателе осталась k. При k равном нулю дробь по-прежнему не имеет значения, переезд минуса на это не влияет.`
  - `основание "СПОСОБ 1: ищем недостающий множитель"` → `Первый способ нужен, чтобы перевести знаменатель в другой знаменатель. Здесь знаменатель не меняется, минус только меняет место.`
  - `действие верно, основание нет` → `Действие верное, а основание не подходит. В практике спрашивают оба: что сделал и почему так можно.`
- wrongText: `Минус — это множитель минус один. Примени его к обоим этажам, потом проверь, изменилось условие или нет.`

### EN

- eyebrow: `Minus`
- title: `The minus leaves the denominator`
- setup: `There is a minus in the denominator. It has to move in front of the fraction, and at every step you show both what you did and why it is allowed.`
- ask: `Put two cards in each row: the action and its reason.`
- colAction: `ACTION`
- colReason: `REASON`
- correct: `Correct. The minus does not move on its own: you multiplied numerator and denominator by minus one, and the property allows exactly that. Minus one is never zero, so no new condition appeared, and the old one stayed: k is not zero.`
- wrongs:
  - `action "I erase the minus" or reason "the minus vanishes on its own"` → `A minus does not vanish on its own. It moves one way only: numerator and denominator are both multiplied by minus one. Put k equal to three: nine over minus three is minus three, nine over three is three.`
  - `action "I divide the denominator by −1"` → `If only the denominator is touched, the value of the fraction changes. The property asks for both floors at once.`
  - `action "9/k"` → `The minus is gone. It cannot be removed from the record, only moved elsewhere: in front of the fraction.`
  - `action "new condition: k ≠ −1" or reason "−1 adds a condition"` → `A new condition is born only where the factor becomes zero. Minus one is never zero, so there is no new ban.`
  - `action "the condition disappears"` → `The k is still in the denominator. At k equal to zero the fraction still has no value; moving the minus does not change that.`
  - `reason "METHOD 1: find the missing factor"` → `The first method is for taking one denominator to another. Here the denominator does not change, only the minus changes place.`
  - `action right, reason wrong` → `The action is right, the reason does not fit. Practice asks for both: what you did and why it is allowed.`
- wrongText: `A minus is the factor minus one. Apply it to both floors, then check whether the condition changed or not.`

---

## 06 · `boundary` · 🟡 · `where_split`

### MA'LUMOT

```
left:   2d/(7d)
right:  2/7
answer: d = 0                        // judgeOdz normalizatsiyasi, to'plam sifatida
show after check:
  d = 0  →  chapda 0/0 (qiymat yo'q),  o'ngda 2/7
  d = 1  →  2/7  va  2/7             (bir xil)
  d = −3 →  −6/−21 = 2/7  va  2/7    (bir xil)
hints:
  '∅' / "hech qachon"  — qisqartirishda shart yo'qoldi (З2)
  '7'                   — maxrajdagi son taqiq beradi deb o'ylandi
  '2'                   — suratdagi son
  '2/7'                 — savol qiymat haqida deb tushunildi
```

### UZ

- eyebrow: `Chegara`
- title: `Ikki yozuv qayerda ajraladi`
- setup: `Bu ikki yozuv deyarli hamma joyda bir xil qiymat beradi. Deyarli.`
- ask: `Qaysi qiymatda ular bir xil emas?`
- correct: `To'g'ri. Nolda o'ng yozuv ikki yettidan beradi, chap yozuv esa nol bo'lingan nolga aylanadi va qiymati bo'lmaydi. Qisqartirishda harf yozuvdan ketdi, taqiq esa qolaverdi.`
- wrongs:
  - `hech qachon / bo'sh` → `Bitta joy bor. Nolni ikkala yozuvga ham qo'ying: o'ngda ikki yettidan, chapda esa nol bo'lingan nol. Bu qiymat emas.`
  - `'7'` → `Yettini qo'ying: chapda o'n to'rt bo'lingan qirq to'qqiz, bu ikki yettidan. Yozuvlar bir xil. Maxrajdagi son taqiq bermaydi, taqiqni harf beradi.`
  - `'2'` → `Ikkini qo'ying: chapda to'rt bo'lingan o'n to'rt, bu ham ikki yettidan. Bu yerda ajralish yo'q.`
  - `'2/7'` → `Savol qiymat haqida emas, d haqida: qaysi qiymatda ikki yozuv boshqacha ish tutadi.`
- wrongText: `Chap yozuvda harf maxrajda ham, suratda ham bor. Uni nolga aylantiring va nima bo'lishini ko'ring.`

### RU

- eyebrow: `Граница`
- title: `Где две записи расходятся`
- setup: `Эти две записи почти всюду дают одно и то же значение. Почти.`
- ask: `При каком значении они не совпадают?`
- correct: `Верно. При нуле правая запись даёт две седьмых, а левая обращается в нуль делить на нуль и значения не имеет. При сокращении буква ушла из записи, а запрет остался.`
- wrongs:
  - `никогда / пусто` → `Место есть, и оно одно. Подставь нуль в обе записи: справа две седьмых, слева нуль делить на нуль. Это не значение.`
  - `'7'` → `Подставь семь: слева четырнадцать делить на сорок девять, это две седьмых. Записи совпали. Число в знаменателе запрета не даёт, запрет даёт буква.`
  - `'2'` → `Подставь два: слева четыре делить на четырнадцать, это тоже две седьмых. Расхождения тут нет.`
  - `'2/7'` → `Вопрос не про значение, а про d: при каком значении две записи ведут себя по-разному.`
- wrongText: `В левой записи буква стоит и сверху, и снизу. Обрати её в нуль и посмотри, что получится.`

### EN

- eyebrow: `Boundary`
- title: `Where the two records split`
- setup: `These two records give the same value almost everywhere. Almost.`
- ask: `At which value do they differ?`
- correct: `Correct. At zero the right record gives two sevenths, while the left one becomes zero over zero and has no value. When the letter was cancelled it left the record, but the ban stayed.`
- wrongs:
  - `never / empty` → `There is one such place. Put zero into both records: two sevenths on the right, zero over zero on the left. That is not a value.`
  - `'7'` → `Put seven: fourteen over forty-nine on the left, which is two sevenths. The records agree. A number in the denominator gives no ban; the letter does.`
  - `'2'` → `Put two: four over fourteen on the left, again two sevenths. There is no split here.`
  - `'2/7'` → `The question is not about the value but about d: at which value the two records behave differently.`
- wrongText: `In the left record the letter stands both above and below the bar. Make it zero and see what happens.`

---

## 07 · `tapparts` · 🟡 · `common_factor`

### MA'LUMOT

```
frac:
  num:  [ '3', '(p − 6)' ]
  den:  [ '(p + 1)', '(p − 6)' ]
answer taps:  num '(p − 6)'  va  den '(p − 6)'    // ikkalasi, hammasi yoki hech narsa
belgilanmaydi:  num '3',  den '(p + 1)'
QISQARTIRISH BU YERDA BAJARILMAYDI — u 3-darsning ishi. Hozir faqat ko'rish.
```

### UZ

- eyebrow: `Juftlik`
- title: `Ikkala qavatda ham turgan ko'paytuvchi`
- setup: `Surat ham, maxraj ham ko'paytuvchilarga ajratilgan. Ulardan bittasi ikkala qavatda ham bor.`
- ask: `Yozuvning o'zida shu ko'paytuvchini belgilang — tepasida ham, pastida ham.`
- note: `Qisqartirish kerak emas: hozir uni faqat ko'rish kifoya.`
- correct: `To'g'ri. P minus olti tepada ham, pastda ham turibdi — bu xossa ishlaydigan joy. Uchlik faqat suratda, p qo'shuv bir faqat maxrajda: ularning juftligi yo'q.`
- wrongs:
  - `faqat bitta '(p − 6)' belgilandi` → `Bitta joyni belgiladingiz. Ko'paytuvchi juftlik bo'lib ishlaydi: u tepada ham, pastda ham turishi kerak, aks holda xossaning ham hech qanday aloqasi yo'q.`
  - `'3' belgilandi` → `Uchlik — surat ko'paytuvchisi, lekin maxrajda uchlik yo'q. Ikkala qavatda ham bir xil bo'lgani qidirilyapti.`
  - `'(p + 1)' belgilandi` → `P qo'shuv bir faqat maxrajda turibdi. Suratda unga juft yo'q.`
  - `hammasi belgilandi` → `Hammasini belgilash javob emas. To'rttasi ham ko'paytuvchi, ammo savol boshqa: qaysi biri tepada ham, pastda ham BIR XIL.`
- wrongText: `Suratdagi ko'paytuvchilarni maxrajdagilari bilan solishtiring va aynan bir xil yozilganini toping.`

### RU

- eyebrow: `Пара`
- title: `Множитель, который стоит на обоих этажах`
- setup: `И числитель, и знаменатель разложены на множители. Один из них есть на обоих этажах.`
- ask: `Отметь этот множитель прямо в записи — и сверху, и снизу.`
- note: `Сокращать не нужно: сейчас достаточно его увидеть.`
- correct: `Верно. P минус шесть стоит и сверху, и снизу — это то место, где работает свойство. Тройка есть только в числителе, p плюс один только в знаменателе: пары у них нет.`
- wrongs:
  - `отмечено только одно '(p − 6)'` → `Ты отметил одно место. Множитель работает парой: он должен стоять и сверху, и снизу, иначе свойство тут ни при чём.`
  - `отмечено '3'` → `Тройка — множитель числителя, но в знаменателе тройки нет. Ищется то, что одинаково на обоих этажах.`
  - `отмечено '(p + 1)'` → `P плюс один стоит только в знаменателе. В числителе пары у него нет.`
  - `отмечено всё` → `Отметить всё — не ответ. Множителей действительно четыре, но вопрос другой: какой из них ОДИН И ТОТ ЖЕ сверху и снизу.`
- wrongText: `Сравни множители числителя с множителями знаменателя и найди тот, что записан ровно так же.`

### EN

- eyebrow: `Pair`
- title: `The factor standing on both floors`
- setup: `Both numerator and denominator are split into factors. One of them stands on both floors.`
- ask: `Mark that factor right inside the record — above and below.`
- note: `No cancelling is needed: for now it is enough to see it.`
- correct: `Correct. P minus six stands both above and below — that is where the property works. The three is only in the numerator, p plus one only in the denominator: neither has a pair.`
- wrongs:
  - `only one '(p − 6)' marked` → `You marked one place. A factor works as a pair: it has to stand above and below, otherwise the property has nothing to do with it.`
  - `'3' marked` → `The three is a factor of the numerator, but there is no three in the denominator. What is being looked for is the same thing on both floors.`
  - `'(p + 1)' marked` → `P plus one stands only in the denominator. It has no pair in the numerator.`
  - `everything marked` → `Marking everything is not an answer. There really are four factors, but the question is different: which one is THE SAME above and below.`
- wrongText: `Compare the numerator factors with the denominator factors and find the one written exactly the same way.`

---

## 08 · `audit` · 🔴 · `first_wrong_line`

### MA'LUMOT

```
rows:
  r1   7/(n + 2)
  r2   = (7 · n) / ((n + 2) · n)
  r3   = 7n / (n² + 2n)
  r4   Javob:  7n/(n² + 2n),   shart  n ≠ −2

answerId: 'r4'                 // BIRINCHI noto'g'ri satr: yangi shart n ≠ 0 yozilmagan
counter:  n = 0                // kontrprimer, MAJBURIY ikkinchi shart
tekshiruv: satr ham, kontrprimer ham to'g'ri bo'lsagina sanaladi

nima uchun aynan 0:
  n = 0  →  dastlabki kasr 7/2,  yangi kasr 0/0 (qiymat yo'q)
r2 va r3 haqiqatan to'g'ri:
  r2 — surat ham, maxraj ham n ga ko'paytirilgan
  r3 — qavs ochilgan: (n + 2)n = n² + 2n
```

### UZ

- eyebrow: `Audit`
- title: `Birinchi xato qayerda`
- setup: `Kasr maxraji n² + 2n bo'lgan kasrga keltirilgan. Har satr alohida to'g'riday ko'rinadi, lekin yechim noto'g'ri.`
- ask: `Birinchi xato satrni bosing va u buziladigan sonni yozing.`
- labelCounter: `Bu son`
- note: `Ikkinchi, uchinchi xato satrlar emas, aynan BIRINCHISI kerak.`
- correct: `To'g'ri. Uchinchi satrgacha hammasi joyida: surat ham, maxraj ham n ga ko'paytirilgan va qavs ochilgan. Xato to'rtinchi satrda: shart yarim yozilgan. Nolni qo'ying — dastlabki kasr yetti ikkidan beradi, yangisi esa nol bo'lingan nol, ya'ni qiymatsiz. Demak n nolga teng emas ham yozilishi kerak edi.`
- wrongs:
  - `r1 tanlandi` → `Birinchi satr — berilgan yozuvning o'zi, unda hali hech narsa qilinmagan.`
  - `r2 tanlandi` → `Ikkinchi satr to'g'ri: surat ham, maxraj ham bitta va o'sha n ga ko'paytirilgan. Xossa aynan shuni ruxsat etadi. Xato keyinroq.`
  - `r3 tanlandi` → `Uchinchi satrda faqat qavs ochilgan: n qo'shuv ikkini n ga ko'paytirsak n kvadrat qo'shuv ikki n chiqadi. Bu to'g'ri hisob.`
  - `r4 tanlandi, kontrprimer −2` → `Satrni to'g'ri topdingiz. Lekin minus ikki — bu ESKI shart, u javobda allaqachon yozilgan. Yetishmayotgani boshqasi: ko'paytuvchi n ni nolga aylantiradigan son.`
  - `r4 tanlandi, kontrprimer boshqa son` → `Satr to'g'ri. Endi shu sonni dastlabki kasrga ham, yangi kasrga ham qo'ying: agar ikkalasi ham hisoblansa, bu son xatoni ko'rsatmaydi.`
  - `r4 tanlandi, kontrprimer bo'sh` → `Satrni topdingiz, endi uni son bilan tugating: yangi kasr ma'noga ega bo'lmaydigan, dastlabkisi esa bemalol hisoblanadigan sonni yozing.`
- wrongText: `Har satrni alohida tekshiring: nima qilingan va bu mumkinmi. Keyin oxirgi satrni son bilan sinang — ko'paytuvchi n qaysi qiymatda nolga aylanadi?`

### RU

- eyebrow: `Аудит`
- title: `Где первая ошибка`
- setup: `Дробь привели к знаменателю n² + 2n. Каждая строка по отдельности выглядит верной, а решение неверное.`
- ask: `Нажми первую неверную строку и впиши число, на котором она ломается.`
- labelCounter: `Это число`
- note: `Нужна не вторая и не третья ошибка, а именно ПЕРВАЯ.`
- correct: `Верно. До третьей строки всё на месте: и числитель, и знаменатель умножены на n, скобка раскрыта. Ошибка в четвёртой строке: условие записано наполовину. Подставь нуль — исходная дробь даёт семь вторых, а новая нуль делить на нуль, то есть значения нет. Значит нужно было дописать и n не равно нулю.`
- wrongs:
  - `выбрана r1` → `Первая строка — сама исходная запись, в ней ещё ничего не сделано.`
  - `выбрана r2` → `Вторая строка верна: и числитель, и знаменатель умножены на одну и ту же n. Свойство именно это и разрешает. Ошибка дальше.`
  - `выбрана r3` → `В третьей строке только раскрыта скобка: n плюс два умножить на n даёт n в квадрате плюс два n. Это верный счёт.`
  - `выбрана r4, контрпример −2` → `Строку ты нашёл верно. Но минус два — это СТАРОЕ условие, оно в ответе уже записано. Не хватает другого: числа, при котором множитель n обращается в нуль.`
  - `выбрана r4, контрпример другое число` → `Строка верная. Теперь подставь это число и в исходную дробь, и в новую: если считаются обе, это число ошибку не показывает.`
  - `выбрана r4, контрпример пуст` → `Строку ты нашёл, теперь доведи её числом: впиши то, при котором новая дробь значения не имеет, а исходная спокойно считается.`
- wrongText: `Проверь каждую строку отдельно: что сделано и можно ли так. Потом испытай последнюю строку числом — при каком значении множитель n обращается в нуль?`

### EN

- eyebrow: `Audit`
- title: `Where the first error is`
- setup: `The fraction was brought to the denominator n² + 2n. Every line looks right on its own, yet the solution is wrong.`
- ask: `Tap the first wrong line and type the number that breaks it.`
- labelCounter: `This number`
- note: `Not the second or the third error is wanted, but exactly the FIRST one.`
- correct: `Correct. Up to the third line everything is in place: numerator and denominator are both multiplied by n and the bracket is expanded. The error is in the fourth line: the condition is only half written. Put zero — the original fraction gives seven halves, the new one gives zero over zero, that is, no value. So n is not zero had to be written too.`
- wrongs:
  - `r1 chosen` → `The first line is the original record itself; nothing has been done in it yet.`
  - `r2 chosen` → `The second line is right: numerator and denominator are multiplied by one and the same n. That is exactly what the property allows. The error comes later.`
  - `r3 chosen` → `In the third line the bracket is only expanded: n plus two times n gives n squared plus two n. That is correct arithmetic.`
  - `r4 chosen, counterexample −2` → `You found the line correctly. But minus two is the OLD condition, and it is already written in the answer. Something else is missing: the number where the factor n becomes zero.`
  - `r4 chosen, counterexample another number` → `The line is right. Now put that number into both the original and the new fraction: if both compute, that number does not expose the error.`
  - `r4 chosen, counterexample empty` → `You found the line; now finish it with a number: write the one where the new fraction has no value while the original computes fine.`
- wrongText: `Check every line on its own: what was done and whether it is allowed. Then test the last line with a number — at which value does the factor n become zero?`

---

## 09 · `build` · 🔴 · `inverse_build`

### MA'LUMOT

```
target:   5/(t − 3) ga TENG kasr, yangi sharti t ≠ 4
areas:    surat (num) va maxraj (den), kursor istalgan joyga qo'yiladi
cards:    5 · t · 3 · 4 · 0 · + · − · · · ( · )

want (IKKI predikat, satr solishtirish YO'Q):
  p1  qiymat 5/(t − 3) ga teng:  probe t ∈ {1, 2, 6, 10} da ikkalasi bir xil
  p2  t = 4 da yozuv ma'noga ega emas (maxraj nolga aylanadi)
  p3  maxraj ayniyatan nol emas (bo'sh yoki nol yozuvni rad etadi)

to'g'ri javoblardan ba'zilari:
  5(t − 4) / ((t − 3)(t − 4))
  (5t − 20) / ((t − 3)(t − 4))
  (5t − 20) / (t² − 7t + 12)

probe misoli:  t = 6  →  kerakli 5/3;   faqat maxraj ko'paytirilsa 5/(3·2) = 5/6  ✗
```

### UZ

- eyebrow: `Yig'ish`
- title: `Shartni o'zingiz qo'ying`
- setup: `Kasr berilgan. Unga teng, lekin bitta yangi taqiqi bor kasr yig'ish kerak.`
- ask: `Kartalardan shunday kasr yig'ingki, u berilganiga teng bo'lsin va t to'rtda ma'noga ega bo'lmasin.`
- bank: `Kartalar`
- note: `To'g'ri javob bitta emas. Muhimi ikki narsa: qiymat o'sha qolsin va yangi taqiq aynan to'rtda tug'ilsin.`
- correct: `To'g'ri. Siz surat va maxrajni bitta va o'sha ko'paytuvchiga ko'paytirdingiz, shuning uchun qiymat o'zgarmadi. Ko'paytuvchi esa to'rtda nolga aylanadi, va aynan shundan yangi shart tug'ildi.`
- wrongs:
  - `yozuv 5/(t − 3) ning o'zi` → `Yozuv o'zgarmadi, demak yangi shart ham yo'q: t to'rtda bu kasr bemalol hisoblanadi. Ko'paytuvchi qo'shish kerak.`
  - `faqat maxraj ko'paytirildi` → `Faqat maxraj ko'paytirilgan, qiymat o'zgarib ketdi. T ni oltiga teng qo'ying: kerakli kasr besh uchdan, sizniki esa besh oltidan.`
  - `faqat surat ko'paytirildi` → `Faqat surat ko'paytirilgan. Bunda ham qiymat o'zgaradi, ham yangi taqiq tug'ilmaydi: taqiq faqat maxrajdan keladi.`
  - `nol ko'paytuvchi ishlatildi` → `Nolga ko'paytirsangiz kasr butunlay yo'qoladi: suratda ham, maxrajda ham nol qoladi. Nol ko'paytuvchi bo'lmaydi.`
  - `(t + 4) ko'paytuvchi ishlatildi` → `Kasr teng chiqdi, lekin taqiq boshqa joyda tug'ildi: t qo'shuv to'rt nolga minus to'rtda aylanadi. Sizga to'rtda kerak edi.`
  - `qiymat teng emas` → `Yangi taqiq to'g'ri joyda, lekin qiymat o'zgargan. Surat va maxraj bitta va o'sha ifodaga ko'paytirilishi kerak: t ni oltiga qo'yib ikkala kasrni solishtiring.`
- wrongText: `Ko'paytuvchini o'zingiz tanlang: u to'rtda nolga aylanishi kerak. Keyin uni surat va maxrajga birga qo'ying.`

### RU

- eyebrow: `Сборка`
- title: `Поставь условие сам`
- setup: `Дробь дана. Нужно собрать другую — равную ей, но с одним новым запретом.`
- ask: `Собери из карточек дробь, равную данной, у которой при t равном четырём значения нет.`
- bank: `Карточки`
- note: `Верный ответ не один. Важны две вещи: значение осталось прежним и новый запрет родился ровно в четвёрке.`
- correct: `Верно. Ты умножил числитель и знаменатель на один и тот же множитель, поэтому значение не изменилось. А сам множитель обращается в нуль при четырёх — отсюда и новое условие.`
- wrongs:
  - `запись равна 5/(t − 3)` → `Запись не изменилась, значит нового условия нет: при t равном четырём эта дробь спокойно считается. Нужен множитель.`
  - `умножен только знаменатель` → `Умножен только знаменатель, значение уехало. Подставь t равное шести: нужная дробь даёт пять третьих, а твоя пять шестых.`
  - `умножен только числитель` → `Умножен только числитель. От этого и значение меняется, и новый запрет не появляется: запрет приходит только из знаменателя.`
  - `использован нулевой множитель` → `Умножишь на нуль — дробь исчезнет совсем: и сверху, и снизу останется нуль. Нуль множителем не бывает.`
  - `использован множитель (t + 4)` → `Дробь получилась равной, но запрет родился не там: t плюс четыре обращается в нуль при минус четырёх. А нужен был запрет в четвёрке.`
  - `значение не совпадает` → `Новый запрет на месте, а значение изменилось. Числитель и знаменатель должны быть умножены на одно и то же: подставь t равное шести и сравни обе дроби.`
- wrongText: `Выбери множитель сам: он должен обращаться в нуль при четырёх. Потом поставь его и в числитель, и в знаменатель.`

### EN

- eyebrow: `Assemble`
- title: `Set the condition yourself`
- setup: `A fraction is given. You have to assemble another one — equal to it, but with one new ban.`
- ask: `Assemble from the cards a fraction equal to the given one that has no value at t equal to four.`
- bank: `Cards`
- note: `There is more than one right answer. Two things matter: the value stays the same and the new ban is born exactly at four.`
- correct: `Correct. You multiplied numerator and denominator by one and the same factor, so the value did not change. And the factor itself becomes zero at four — that is where the new condition comes from.`
- wrongs:
  - `record equals 5/(t − 3)` → `The record did not change, so there is no new condition: at t equal to four this fraction computes fine. A factor is needed.`
  - `only the denominator multiplied` → `Only the denominator was multiplied, and the value drifted. Put t equal to six: the required fraction gives five thirds, yours gives five sixths.`
  - `only the numerator multiplied` → `Only the numerator was multiplied. That changes the value and brings no new ban either: a ban comes only from the denominator.`
  - `zero factor used` → `Multiply by zero and the fraction disappears entirely: zero is left above and below. Zero is never a factor.`
  - `factor (t + 4) used` → `The fraction came out equal, but the ban was born in the wrong place: t plus four becomes zero at minus four. The ban was needed at four.`
  - `value does not match` → `The new ban is in the right place, but the value changed. Numerator and denominator must be multiplied by the same thing: put t equal to six and compare the two fractions.`
- wrongText: `Choose the factor yourself: it has to become zero at four. Then put it into both the numerator and the denominator.`

---

## 10 · `markall` · 🔴 · `always_true`

### MA'LUMOT

```
ask: qaysi tengliklar HAMMA qiymatda to'g'ri EMAS
items:
  e1  2x/(3x) = 2/3                mark    x = 0 da chap tomon qiymatsiz
  e2  (x + 2)/(x + 5) = 2/5        mark    qo'shiluvchilar qisqarmaydi (З1); faqat x = 0 da to'g'ri
  e3  (−4)/(−y) = 4/y              KEEP    −1 qonuniy ko'paytuvchi; ikkala yozuv y = 0 da qiymatsiz
  e4  3(z − 1)/(7(z − 1)) = 3/7    mark    z = 1 da chap tomon qiymatsiz
  e5  (7 + w)/(9 + w) = 7/9        mark    qo'shildi (З1); faqat w = 0 da to'g'ri
  e6  6a/(6b) = a/b                KEEP    6 ≠ 0, ikkala yozuvning sharti bir xil: b ≠ 0
  e7  (0 · m)/(0 · n) = m/n        mark    chap tomon hech qanday qiymatda aniqlanmagan (З21)

answer: {e1, e2, e4, e5, e7}      // hammasi yoki hech narsa
```

### UZ

- eyebrow: `Tenglik`
- title: `Hamma qiymatda to'g'rimi`
- setup: `Yettita tenglik berilgan. Ba'zilari har qanday qiymatda bajariladi, ba'zilari esa yo'q.`
- ask: `HAMMA qiymatda to'g'ri BO'LMAGANLARINI belgilang. Hammasini.`
- note: `Bitta yozuv qiymatsiz bo'lsa, tenglik o'sha joyda buziladi.`
- correct: `To'g'ri. Ikki xil buzilish bor. Birinchisi: harfli ko'paytuvchi qisqarganda taqiq yozuvdan yo'qoladi, lekin o'zi qolaveradi. Ikkinchisi: qo'shiluvchilar qisqarmaydi, va bunday tenglik faqat bitta sonda tasodifan bajariladi. Minus bir va olti esa qonuniy ko'paytuvchilar: ular hech qachon nol emas.`
- wrongs:
  - `e3 belgilandi` → `Minus bir — ko'paytuvchi, va u hech qachon nol emas. Ikkala yozuv ham y nolda qiymatsiz, qolgan hamma joyda esa teng. Demak bu tenglik buzilmaydi.`
  - `e6 belgilandi` → `Olti nolga teng emas, demak qonuniy ko'paytuvchi. Ikkala yozuvning sharti ham bir xil: b nolga teng emas. Yangi taqiq tug'ilmadi.`
  - `e1 yoki e4 belgilanmadi` → `Bu yerda qisqargani harf. Harf nolga aylanishi mumkin, va o'sha joyda chap yozuvda nol bo'lingan nol qoladi. Nolni qo'ying va o'zingiz ko'ring.`
  - `e2 yoki e5 belgilanmadi` → `Qo'shiluvchilar qisqarmaydi. Bu tenglik faqat bitta sonda bajariladi, boshqa hech qayerda emas: birni qo'ying va ikkala tomonni hisoblang.`
  - `e7 belgilanmadi` → `Nol bo'lingan nol — bu qiymat emas. Chap tomon hech qanday m va n da hisoblanmaydi, demak tenglik hech qachon bajarilmaydi.`
- wrongText: `Har tenglikda ikki savol bering: nima qisqargan — son, harf yoki qo'shiluvchi; va shu qisqargan narsa nolga aylanishi mumkinmi.`

### RU

- eyebrow: `Равенства`
- title: `Верно ли при всех значениях`
- setup: `Даны семь равенств. Одни выполняются при любом значении, другие нет.`
- ask: `Отметь те, что верны НЕ при всех значениях. Все такие.`
- note: `Если одна из записей не имеет значения, равенство в этом месте ломается.`
- correct: `Верно. Поломок здесь два вида. Первый: при сокращении буквенного множителя запрет уходит из записи, а сам остаётся. Второй: слагаемые не сокращаются, и такое равенство случайно выполняется ровно в одном числе. А минус один и шестёрка — законные множители: они никогда не нули.`
- wrongs:
  - `отмечено e3` → `Минус один — множитель, и он никогда не нуль. Обе записи не имеют значения при y равном нулю, а во всех остальных местах равны. Значит это равенство не ломается.`
  - `отмечено e6` → `Шесть не равно нулю, значит это законный множитель. Условие у обеих записей одно и то же: b не равно нулю. Нового запрета не появилось.`
  - `не отмечено e1 или e4` → `Здесь сократилась буква. Буква может обратиться в нуль, и там в левой записи останется нуль делить на нуль. Подставь нуль и посмотри сам.`
  - `не отмечено e2 или e5` → `Слагаемые не сокращаются. Такое равенство выполняется ровно в одном числе и больше нигде: подставь единицу и посчитай обе стороны.`
  - `не отмечено e7` → `Нуль делить на нуль — это не значение. Левая часть не считается ни при каких m и n, значит равенство не выполняется никогда.`
- wrongText: `К каждому равенству два вопроса: что сократили — число, букву или слагаемое; и может ли это сокращённое обратиться в нуль.`

### EN

- eyebrow: `Equalities`
- title: `True at every value?`
- setup: `Seven equalities are given. Some hold at any value, some do not.`
- ask: `Mark the ones that are NOT true at every value. All of them.`
- note: `If one of the records has no value, the equality breaks in that place.`
- correct: `Correct. There are two kinds of break here. First: when a factor with a letter is cancelled, the ban leaves the record but stays in force. Second: summands do not cancel, and such an equality happens to hold at exactly one number. Minus one and six are legitimate factors: they are never zero.`
- wrongs:
  - `e3 marked` → `Minus one is a factor, and it is never zero. Both records have no value at y equal to zero, and everywhere else they are equal. So this equality does not break.`
  - `e6 marked` → `Six is not zero, so it is a legitimate factor. Both records carry the same condition: b is not zero. No new ban appeared.`
  - `e1 or e4 not marked` → `Here a letter was cancelled. A letter can become zero, and there the left record is left with zero over zero. Put zero and see for yourself.`
  - `e2 or e5 not marked` → `Summands do not cancel. Such an equality holds at exactly one number and nowhere else: put one and compute both sides.`
  - `e7 not marked` → `Zero over zero is not a value. The left side does not compute for any m and n, so the equality never holds.`
- wrongText: `Ask two questions of every equality: what was cancelled — a number, a letter or a summand; and can that cancelled thing become zero.`

---

## 4. QAMROV — BO'SH JOY YO'QLIGINING TEKSHIRUVI

| | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| T1 | + | + | + | | + | | + | | + | + |
| T2 | | + | | | + | + | | | + | + |
| T3 | | + | + | + | | | | + | + | + |
| З1 | + | + | | | | | + | | | + |
| З2 | | | + | + | | + | | + | | |
| З16 | | | | | | + | | + | | |
| З20 | + | + | + | + | + | | + | | + | |
| З21 | | + | + | | | + | | | + | + |
| З22 | | + | | | + | | | | | + |

Har tasdiq kamida to'rt topshiriqda, har adashish kamida ikkitasida. Bo'sh satr yo'q.

## 5. RAQAMLAR — DARS BILAN VA O'ZARO TAKRORLANMASLIK

**Darsning o'zida ishlatilgan va shuning uchun bu yerda YO'Q:** `1200/8`, `1200/4`,
`3/4 → 15/20`, `5/(x+2)`, `7/(−x)`, `5/a`, `7/8 → 21/?`, `a/4 → ?/(4b)`, `3/x → 12/(4x)`,
`4/a`, `2/(x−3)`, `a/(a+2)`, `4/3 → 4x/(3x)`, `(2+3)/(5+3)`, `0/0`.

**Amaliyot ichida harflar bo'yicha ajratilgan:** 01 — `y`, 02 — `a`, 03 — `m`, 04 — `c`,
05 — `k`, 06 — `d`, 07 — `p`, 08 — `n`, 09 — `t`, 10 — `x, y, z, w, a, b, m, n`.
Bitta ham topshiriq boshqasining yozuvini takrorlamaydi.

Bu ro'yxat yig'ishdan keyin `scripts/grade8-practice-check.mjs` bilan qayta tekshiriladi,
ko'z bilan emas.

## 6. YIG'ISH BOSQICHIGA O'TGANDA NIMA YOZILADI

`kit.jsx` da hozir yettita 7-sinf mexanikasi bor. Bu amaliyot uchun:

| Mexanika | Holat |
|---|---|
| 02 `sort`, 03 `slots`, 10 `markall` | `Zones`, `SlotsBank`, `MarkAll` — tayyor |
| 01 `input` | `TypeValue` kengaytiriladi: javob ifoda, `judgeExpr` + `MathField` |
| 07 `tapparts` | `TapTerms` ikki qavatli kasr ichida ishlashi kerak |
| 09 `build` | `BuildLine` ga XOSSA predikatlari qo'shiladi, satr solishtirish o'rniga |
| 04 `odz` | YANGI: ikki maydon, `judgeExpr` va `judgeOdz` alohida |
| 05 `steps` | YANGI: qadamda ikki slot, ikkalasi to'g'ri bo'lsagina sanaladi |
| 06 `boundary` | YANGI: qiymatlar to'plami, `judgeOdz` normalizatsiyasi |
| 08 `audit` | YANGI: satr tanlash va kontrprimer maydoni birga |

Import qilinadi, qayta yozilmaydi: `judgeExpr`, `judgeOdz`, `MathField`
(`src/components/grade8/math.jsx`), `domainHoles`, `valueAt`, `checkIdentity`
(`src/components/grade8/mathcore.js`).

**Balandlik xavfi.** 1366×615 da topshiriq 363px dan oshmasligi kerak. Eng balandlari —
04 (ikki maydon), 05 (uch qator × ikki slot), 08 (to'rt satr + maydon), 10 (yetti yozuv).
Ingliz tili eng zichi. Bu QA da emas, yig'ish paytida o'lchanadi.

## 7. QABUL QILISH

```powershell
npx vite --port 5199
node scripts/grade8-practice-check.mjs            # to'g'ri javoblar: 10/10, skroll yo'q
G8_WRONG=1 node scripts/grade8-practice-check.mjs # noto'g'ri yo'llar: 0/10 va razbor bo'sh emas
G8_VP=telefon node scripts/grade8-practice-check.mjs
npx eslint src/components/grade8/practice
npm run build
```

Beshta o'lcham (1366×615, 1366×655, 1920×950, 390×745, 360×690) × uch til = 15 sochetanie.
Javoblar va bosish ketma-ketligi `scripts/grade8-practice-plan.mjs` da, razmetkada emas.
