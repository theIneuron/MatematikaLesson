# DARS01_AMALIYOT_KONTENT — 8-sinf, 1-dars amaliyoti, o'nta topshiriqning to'liq matni

> 2-bosqich (KONTENT). Kirish: metodist topshirigi 2026-08-22 (o'nta topshiriqning tipi va
> mazmuni og'zaki berilgan), `TIPLAR_AMALIYOT_8SINF.md`, `src/components/grade8/Dars01.jsx`
> (`STATEMENTS`, `MISS`).
> Chiqish: `src/components/grade8/practice/dars01/D01_01…10.jsx` uchun ma'lumot.
>
> **Metodist qarori 2026-08-22 (ikkinchi):** 1-dars amaliyoti QAYTA yaratiladi. Ilgari bu
> yerda 7-sinf amaliyotining aynan nusxasi (sonli ifodalar) turgan edi — u olib tashlanadi.
> Yangi to'plamning mavzusi darsning O'ZI: kasr qaysi qiymatda ma'noga ega emas.
> Dizayn va ranglar o'zgarmaydi: fon `#fff7ed`, urg'u `#fe5b1a`, `kit.jsx` palitrasi.

---

## 0. QOIDALAR, ULARSIZ BU FAYL O'QILMAYDI

1. **Matematika til blokidan TASHQARIDA.** `MA'LUMOT` bo'limidagi yozuv, karta, variant —
   tarjima emas, matematikaning o'zi. `UZ / RU / EN` bo'limlarida faqat SO'ZLAR.
2. **Har noto'g'ri YO'LGA o'z razbori.** «Noto'g'ri» — razbor emas. `wrongs[]` tartib bilan
   tekshiriladi, birinchi mos kelgani chiqadi, oxirgisi `wrongText`.
3. **Razbor javobni bermaydi, BELGINI ko'rsatadi** va son bilan tekshirishga yuboradi
   (`З16` shu yerda o'ladi).
4. **Javob bir marta tekshiriladi**, keyin topshiriq qulflanadi. Maslahat tugmasi yo'q.
5. UZ — `siz`, apostrof ASCII `'`. RU — `ты`, jinssiz shakl. Kirillcha UZ satrda yo'q.
6. Amaliyotda ovoz YO'Q.

## 0a. IKKI CHETLANISH, OCHIQ YOZILADI

| Nima | Nega |
|---|---|
| **01 — tayyor to'rt variantdan tanlash.** `TIPLAR_AMALIYOT_8SINF.md` §5.11 bu tipni pul'dan ataylab chiqargan | Metodist topshirigi 2026-08-22: 1-topshiriq test bo'lsin, savol MANTIQIY bo'lsin, misol bo'lmasin. Savol yechimni emas, MULOHAZANI so'raydi, ya'ni §5.11 dagi «yechim haqida gapirish» e'tirozi tushmaydi |
| **§6 dagi majburiy janr tarkibi bajarilmaydi:** `odz`, `audit`, `build`, `boundary` yo'q | Metodist o'nta tipni aniq ko'rsatdi (CLAUDE.md §6.1 p. 1 — sessiyadagi to'g'ridan-to'g'ri ko'rsatma birinchi o'rinda). Bu darsga tegishli, boshqa darslarga §6 o'z kuchida qoladi |

## 1. DARS NIMANI DA'VO QILADI — AMALIYOT SHUNI TEKSHIRADI

| Kod | Tasdiq (`STATEMENTS`, `Dars01.jsx`) |
|---|---|
| T1 | Songa bo'linsa — butun ifoda, harfga bo'linsa — kasr ifoda |
| T2 | Ruhsat etilgan qiymatlarni maxraj beradi, uning nollari mumkin emas |
| T3 | Suratdagi nol — qiymat nol, maxrajdagi nol — qiymat yo'q |

| Kod | Adashish (`MISS`) |
|---|---|
| З2 | ruhsat etilgan qiymatlar topilmadi yoki yo'qoldi |
| З16 | javob son bilan tekshirilmadi |
| З18 | suratdagi nol va maxrajdagi nol aralashtirildi |
| З19 | songa bo'lish harfli ifodaga bo'lish deb olindi |

## 2. RASKLADKA

| № | Mexanika | Qiy. | Teg | Tasdiq / adashish |
|---:|---|:--:|---|---|
| 01 | `Choice` (mantiqiy, 4 variant) | 🟢 | `which_claim` | T2 T3 · З18 З19 |
| 02 | `Zones` (ikki guruh) | 🟢 | `same_value_groups` | T1 T2 · З19 |
| 03 | `TrueFalse` (ha / yo'q) | 🟢 | `true_or_false` | T1 T2 T3 · З18 З19 |
| 04 | `PairSlots` (6 karta → 3 uya) | 🟡 | `pair_ban` | T2 · З2 |
| 05 | `TypeValue` (eng katta qiymat) | 🟡 | `largest_ban` | T2 · З2 З16 |
| 06 | `MarkAll` (6 dan 3 ta) | 🟡 | `always_defined` | T1 T2 · З16 З19 |
| 07 | `CodeLock` (seyf kodi) | 🟡 | `code_bans` | T2 · З2 З16 |
| 08 | `ClozeBank` (so'zlar) | 🔴 | `rule_words` | T2 T3 · З18 |
| 09 | `SwapOrder` (tartib, almashtirish) | 🔴 | `order_steps` | T2 · З2 |
| 10 | `MatchPairs` (ma'lumot ↔ kasr) | 🔴 | `info_to_frac` | T2 · З2 З16 |

Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴 (TIPLAR §7). Yonma-yon bir xil tip yo'q.
1-pozitsiyada boshqarish tushuntirishni talab qilmaydigan tip turadi.
Sonli misollar amaliyot ichida takrorlanmaydi (§7 p. 6) — tekshiruvi §12.

## 3. YANGI MEXANIKALAR — `kit.jsx` GA QO'SHILADI

Beshtasi umumiy qatlamda yo'q edi. Nusxa OLINMAYDI, `kit.jsx` ga qo'shiladi va
`S`, `C`, `HFB`, `Head`, `Given` dan foydalanadi — ya'ni dizayn va ranglar o'sha.

| Tip | Barmoq nima qiladi | `data-*` (tekshiruv uchun) |
|---|---|---|
| `TrueFalse` | har mulohaza yonidagi «Ha» yoki «Yo'q» ni bosadi | `data-tf="s1:yes"` |
| `PairSlots` | kartani bosadi, keyin uyani bosadi; uyaga IKKI karta sig'adi | `data-card`, `data-slot` |
| `CodeLock` | seyf kodining uch uyasini bank kartalari bilan to'ldiradi | `data-card`, `data-slot` |
| `ClozeBank` | matndagi bo'sh kartochkaga so'z qo'yadi | `data-card`, `data-slot` |
| `SwapOrder` | bir qatordagi ikki kartani ketma-ket bosib joyini almashtiradi | `data-card` |

Ikki mavjud tip kengaytiriladi (buzmaydigan qo'shimcha):
`Zones` — guruh sarlavhasida matn o'rniga KASR turishi mumkin (`zones[].tokens`);
`MatchPairs` — chapda so'z (`items[].label`), o'ngda kasr (`targets[].tokens`) turishi mumkin.

## 4. SARLAVHA VA CHIP QATORI

```
HEAD = {
  uz: "Dars 1 amaliyoti — 10 topshiriq (ratsional ifodalar va kasrlar)",
  ru: "Практика урока 1 — 10 заданий (рациональные выражения и дроби)",
  en: "Lesson 1 practice — 10 tasks (rational expressions and fractions)",
}
```

| № | uz | ru | en |
|---:|---|---|---|
| 01 | Fikr | Утверждение | Claim |
| 02 | Guruhlar | Группы | Groups |
| 03 | Ha yoki yo'q | Да или нет | Yes or no |
| 04 | Pazl | Пазл | Puzzle |
| 05 | Eng katta | Наибольшее | Largest |
| 06 | Belgilash | Отметить | Mark |
| 07 | Kod | Код | Code |
| 08 | So'zlar | Слова | Words |
| 09 | Tartib | Порядок | Order |
| 10 | Moslashtirish | Соответствие | Match |

---

# 01 · `Choice` · 🟢 · teg `which_claim`

**Nima tekshiriladi.** Ma'noga ega bo'lmaslikning sababi BITTA: nolga bo'lish. Savol misol
emas, MULOHAZA haqida: to'rt fikrdan bittasi har qanday kasr uchun to'g'ri, uchtasi esa
aniq bir misolda buziladi. Uchta noto'g'ri fikr — uchta adashish (З19, З18, va «harf bor,
demak taqiq ham bor»).

**MA'LUMOT (matematika, til blokidan tashqarida).**

```
correct: 1        // variantlar har ochilganda aralashtiriladi, raqam ma'lumotda qoladi
optCols: 1
```

Variantlarning O'ZI so'z, shuning uchun ular `L()` ichida. Har bir variantdagi matematika
razborda turadi: `a² + 1`, `0 : (−2)`, `7`.

**UZ.**
- eyebrow: `Fikr`
- setup: `To'rt fikr kasr haqida. Bittasi har doim to'g'ri, uchtasi misolda buziladi.`
- ask: `Qaysi fikr har doim to'g'ri?`
- opt 0: `Maxrajda harf bo'lsa, kasr albatta biror qiymatda ma'noga ega bo'lmaydi.`
- opt 1: `Kasr ma'noga ega bo'lmasligi uchun uning maxraji nolga aylanishi kerak.`
- opt 2: `Surat nolga aylansa, kasr ma'noga ega bo'lmaydi.`
- opt 3: `Maxrajda son turgan kasr ham ba'zi qiymatlarda ma'noga ega bo'lmaydi.`
- correctText: `To'g'ri. Ma'noga ega bo'lmaslikning bitta sababi bor — nolga bo'lish. Demak savol ham doim bitta: maxraj qachon nolga aylanadi. Maxrajda harf turishining o'zi hech narsani hal qilmaydi: a kvadrat qo'shuv bir eng kichik holatda birga teng, ya'ni nolga hech qachon aylanmaydi.`
- wrong (picked = 0): `Harf bor, lekin taqiq bo'lmasligi ham mumkin. a kvadrat qo'shuv birni nolga tenglashga urinib ko'ring: kvadrat manfiy bo'lmaydi, demak yig'indi kamida bir. Harfning borligi emas, maxrajning noli hal qiladi.`
- wrong (picked = 2): `Bu yerda suratdagi nol maxrajdagi nol bilan aralashib ketdi. Nolni minus ikkiga bo'lsangiz nol chiqadi — qiymat bor, u nolga teng. Qiymat faqat chiziqning TAGIDA nol paydo bo'lganda yo'qoladi.`
- wrong (picked = 3): `Maxrajda son turganda kasr harfning har qanday qiymatida hisoblanadi: yetti nolga aylanmaydi, u o'zgarmaydi ham. Harf faqat suratda qolsa, taqiq qo'yadigan narsa yo'q.`
- wrongText: `Bitta savol bering: bu kasrning maxraji qachon nolga aylanadi? Har to'rt fikrni shu savol bilan tekshiring.`

**RU.**
- eyebrow: `Утверждение`
- setup: `Четыре утверждения про дробь. Одно верно всегда, три ломаются на примере.`
- ask: `Какое утверждение верно всегда?`
- opt 0: `Если в знаменателе есть буква, дробь где-то обязательно не имеет смысла.`
- opt 1: `Чтобы дробь не имела смысла, её знаменатель должен обратиться в нуль.`
- opt 2: `Если числитель обращается в нуль, дробь не имеет смысла.`
- opt 3: `Дробь с числом в знаменателе тоже где-то не имеет смысла.`
- correctText: `Верно. У «не имеет смысла» одна причина — деление на нуль. Значит вопрос всегда один: когда знаменатель обращается в нуль. Буква сама ничего не решает: a в квадрате плюс один не меньше единицы.`
- wrong (picked = 0): `Буква есть, а запрета может и не быть. Попробуй приравнять a в квадрате плюс один к нулю: квадрат неотрицателен, значит сумма не меньше единицы. Решает не наличие буквы, а нуль знаменателя.`
- wrong (picked = 2): `Здесь нуль числителя спутан с нулём знаменателя. Нуль разделить на минус два — нуль: значение есть. Оно исчезает только когда нуль появляется ПОД чертой.`
- wrong (picked = 3): `Когда в знаменателе число, дробь считается при любом значении буквы: семь в нуль не обращается и вообще не меняется. Если буква осталась только в числителе, запрещать нечего.`
- wrongText: `Задай один вопрос: когда знаменатель этой дроби обращается в нуль? Проверь этим вопросом все четыре утверждения.`

**EN.**
- eyebrow: `Claim`
- setup: `Four claims about fractions. One is always true, three break on an example.`
- ask: `Which claim is always true?`
- opt 0: `If the denominator contains a letter, the fraction must fail at some value.`
- opt 1: `For a fraction to have no value, its denominator must become zero.`
- opt 2: `If the numerator becomes zero, the fraction has no value.`
- opt 3: `A fraction with a number in the denominator also fails at some values.`
- correctText: `Correct. Having no value has one cause — division by zero. So the question is always the same: when does the denominator become zero. A letter alone settles nothing: a squared plus one is one at its smallest, so it never becomes zero.`
- wrong (picked = 0): `The letter is there, but the ban need not be. Try setting a squared plus one to zero: a square is never negative, so the sum is at least one. What decides is the zero of the denominator, not the letter.`
- wrong (picked = 2): `Here the zero of the numerator is confused with the zero of the denominator. Zero divided by minus two is zero: the value exists and it is zero. The value disappears only when a zero appears BELOW the bar.`
- wrong (picked = 3): `With a number in the denominator the fraction is computed for every value of the letter: seven never becomes zero and never changes. If the letter stays only in the numerator, there is nothing to forbid.`
- wrongText: `Ask one question: when does the denominator of this fraction become zero? Test all four claims with it.`

---

# 02 · `Zones` · 🟢 · teg `same_value_groups`

**Nima tekshiriladi.** Yozuv boshqa, qiymat bir xil bo'lishi mumkin. Ikki guruh bir-biriga
teskari: birinchisida harf CHIZIQ TAGIDA, ikkinchisida USTIDA. To'rt karta ko'rinishidan
juft-juft o'xshash, ajratadigan narsa faqat harf qaysi qavatda turgani (T1). Birinchi
guruhning kartalari a noldan boshqa hamma joyda aniqlangan, ikkinchi guruhda esa taqiq
umuman yo'q — bu razborda aytiladi (T2).

**MA'LUMOT.**

```
zones:  z1 -> 4/a            z2 -> a/4
items:  i1 -> 8/(2a)   z1      i2 -> 12/(3a)  z1
        i3 -> 2a/8     z2      i4 -> 3a/12    z2
zoneLbl: 92    itemSize: 20
```

Tekshirish soni: `a = 2` da birinchi guruh 2 beradi, ikkinchisi 0,5 beradi.

**UZ.**
- eyebrow: `Guruhlar`
- setup: `Yuqorida ikki guruh turadi, har birida bitta kasr. Pastdagi to'rt kartaning qiymati shu kasrlardan biriga teng, yozuvi esa boshqacha.`
- ask: `Kartani bosing, keyin uning guruhini bosing.`
- bank: `Kartalar`
- correctText: `To'g'ri. Sakkizni ikki a ga bo'lsangiz to'rt a ga qoladi, o'n ikkini uch a ga bo'lsangiz ham xuddi shu. a ni ikkiga qo'ying: birinchi guruhda ikki chiqadi, ikkinchisida yarim. Birinchi guruhda a nolga teng bo'lmasligi kerak, ikkinchisida esa taqiq umuman yo'q — chunki u yerda harf chiziqning ustida.`
- wrong (i1 yoki i2 ikkinchi guruhda): `Bu ikkisida harf chiziqning TAGIDA qoldi: sakkizni ikki a ga bo'lyapmiz, ikki a ni sakkizga emas. a ni ikkiga qo'yib ikkala guruhning qiymatini solishtiring.`
- wrong (i3 yoki i4 birinchi guruhda): `Bu ikkisida harf chiziqning USTIDA: ikki a ni sakkizga bo'lyapmiz. Bunday kasr a o'sganda o'sadi, birinchi guruh esa teskari — a o'sganda kamayadi.`
- wrong (uch yoki to'rtta xato): `Har kartada bitta narsani ko'ring: a qaysi qavatda? Chiziq tagida bo'lsa birinchi guruh, ustida bo'lsa ikkinchi guruh.`
- wrongText: `a ni ikkiga qo'yib har kartani hisoblang. Ikki chiqsa birinchi guruh, yarim chiqsa ikkinchisi.`

**RU.**
- eyebrow: `Группы`
- setup: `Сверху две группы, в каждой по одной дроби. Значение каждой из четырёх карточек снизу равно одной из них, а запись другая.`
- ask: `Нажми карточку, потом её группу.`
- bank: `Карточки`
- correctText: `Верно. Восемь разделить на два a — остаётся четыре a; двенадцать на три a — то же самое. Подставь a равное двум: в первой группе выйдет два, во второй — половина. В первой группе a не должно быть нулём, во второй запрета нет вовсе — там буква стоит над чертой.`
- wrong (i1 yoki i2 ikkinchi guruhda): `В этих двух буква осталась ПОД чертой: делим восемь на два a, а не два a на восемь. Подставь a равное двум и сравни значения обеих групп.`
- wrong (i3 yoki i4 birinchi guruhda): `В этих двух буква стоит НАД чертой: два a делим на восемь. Такая дробь растёт вместе с a, а первая группа наоборот — с ростом a убывает.`
- wrong (uch yoki to'rtta xato): `Смотри в каждой карточке одно: на каком этаже стоит a? Под чертой — первая группа, над чертой — вторая.`
- wrongText: `Подставь a равное двум и посчитай каждую карточку. Вышло два — первая группа, вышла половина — вторая.`

**EN.**
- eyebrow: `Groups`
- setup: `Two groups are shown above, one fraction in each. Each of the four cards below has the value of one of them, written differently.`
- ask: `Tap a card, then tap its group.`
- bank: `Cards`
- correctText: `Correct. Eight over two a leaves four over a; twelve over three a gives the same. Put a equal to two: the first group gives two, the second gives one half. In the first group a must not be zero; in the second there is no ban at all, because the letter is above the bar.`
- wrong (i1 yoki i2 ikkinchi guruhda): `In these two the letter stayed BELOW the bar: eight is divided by two a, not two a by eight. Put a equal to two and compare the values of both groups.`
- wrong (i3 yoki i4 birinchi guruhda): `In these two the letter is ABOVE the bar: two a is divided by eight. Such a fraction grows with a, while the first group does the opposite.`
- wrong (uch yoki to'rtta xato): `Look for one thing in each card: which floor is a on? Below the bar means the first group, above it the second.`
- wrongText: `Put a equal to two and compute each card. Two means the first group, one half means the second.`

---

# 03 · `TrueFalse` · 🟢 · teg `true_or_false`

**Nima tekshiriladi.** IKKI mulohaza, ikki qaror (metodist, 2026-08-22: ilgari to'rtta edi).
Qolganlari darsning eng qimmat ikki adashishiga tegadi: s1 — З19, chiziq tagida SON turganda
taqiq yo'q; s2 — З18, suratdagi nol qiymatni yo'q qilmaydi, uni nolga aylantiradi.

Olib tashlangan ikkitasi qoplovsiz qolmadi: `a/(a − 6)` turidagi taqiq 04, 05, 07 va 09 da,
«kvadratli maxrajda albatta nol bor» degan fikr esa 06 va 10 da tekshiriladi. Metodistga
aytilgan e'tiroz: ikki qatorda taxmin bilan topish ehtimoli 25% (to'rt qatorda 6%).

**MA'LUMOT.**

```
s1  (a − 4)/5      a = 5    -> YO'Q   maxrajda son, taqiq yo'q            (З19)
s2  0/(a − 2)      a = 0    -> HA     0 : (−2) = 0, qiymat bor va nol     (З18, T3)
itemSize: 17
```

Tekshiriladigan qiymat kasr yonida turadi, da'vo esa uning o'ng tomonida.

**UZ.**
- eyebrow: `Ha yoki yo'q`
- setup: `Ikki mulohaza. Har birida kasr, tekshiriladigan qiymat va da'vo turadi.`
- ask: `Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.`
- claim s1: `ma'noga ega emas`
- claim s2: `qiymati nolga teng`
- yes: `Ha` · no: `Yo'q`
- correctText: `To'g'ri. Birinchisida chiziq tagida SON turadi: besh nolga aylanmaydi, demak beshda ham kasr hisoblanadi — bir bo'linadi beshga. Ikkinchisida esa nol chiziqning USTIDA: nolni minus ikkiga bo'lsangiz nol chiqadi, ya'ni qiymat bor va u nolga teng.`
- wrong (s1 xato): `Birinchi mulohazada chiziq tagida SON turadi. Besh hech qachon nolga aylanmaydi, a esa faqat suratda: beshni qo'ysangiz bir bo'linadi beshga, qiymat bor.`
- wrong (s2 xato): `Ikkinchi mulohazada nol chiziqning USTIDA. Nolni ikkiga, minus ikkiga, yuzga bo'lsangiz — har doim nol. Qiymat yo'qoladigan joy faqat chiziq tagi.`
- wrongText: `Har mulohazada bitta ish qiling: qiymatni chiziq tagiga qo'ying va maxraj nol bo'ladimi deb qarang.`

**RU.**
- eyebrow: `Да или нет`
- setup: `Два утверждения. В каждом дробь, проверяемое значение и само утверждение.`
- ask: `Если утверждение верно — нажми «Да», если ложно — «Нет».`
- claim s1: `не имеет смысла`
- claim s2: `значение равно нулю`
- yes: `Да` · no: `Нет`
- correctText: `Верно. В первом под чертой стоит ЧИСЛО: пять в нуль не обращается, и при пяти дробь считается — один делить на пять. Во втором нуль стоит НАД чертой: нуль разделить на минус два — нуль, значение есть и равно нулю.`
- wrong (s1 xato): `В первом утверждении под чертой стоит ЧИСЛО. Пять в нуль не обращается никогда, а a осталась только в числителе: подставь пять — получится один делить на пять, значение есть.`
- wrong (s2 xato): `Во втором утверждении нуль стоит НАД чертой. Нуль, делённый на два, на минус два, на сто — всегда нуль. Значение исчезает только под чертой.`
- wrongText: `В каждом утверждении делай одно: подставь значение под черту и посмотри, стал ли знаменатель нулём.`

**EN.**
- eyebrow: `Yes or no`
- setup: `Two claims. Each shows a fraction, the value to test and the claim itself.`
- ask: `Tap «Yes» if the claim is true, «No» if it is false.`
- claim s1: `has no value`
- claim s2: `its value is zero`
- yes: `Yes` · no: `No`
- correctText: `Correct. In the first a NUMBER stands below the bar: five never becomes zero, so at five the fraction is computed — one divided by five. In the second the zero is ABOVE the bar: zero over minus two is zero, so the value exists and equals zero.`
- wrong (s1 xato): `In the first claim a NUMBER stands below the bar. Five never becomes zero, and a stays only in the numerator: substitute five and you get one divided by five, a real value.`
- wrong (s2 xato): `In the second claim the zero is ABOVE the bar. Zero divided by two, by minus two, by a hundred is always zero. The value disappears only below the bar.`
- wrongText: `Do one thing in each claim: put the value below the bar and check whether the denominator became zero.`

---

# 04 · `PairSlots` · 🟡 · teg `pair_ban`

**Nima tekshiriladi.** Har kasrga o'z taqiqi. Oltita bo'lak ikkitadan birlashib uchta pazl
hosil qiladi. Metodist rasmi (2026-08-22): bo'laklar TISHI bilan kirishadi, CHAP bo'lakda
faqat ifoda, O'NG bo'lakda faqat javob. Shu sababli karta noto'g'ri tomonga umuman
tushmaydi — xato faqat mazmunda bo'ladi, boshqaruvda emas.

Bo'laklar BIR-BIRINI TO'LDIRADI (metodist 2026-08-24): bitta aylana ikki konturni chizadi —
chapda tish tanadan chiqadi, o'ngda xuddi shu aylana tanaga uya bo'lib kiradi. 2026-08-22
dagi birinchi yozuvda ikkala yoy ham tashqariga qaragan edi: yonma-yon ikki tish turib,
uya hech qayerda paydo bo'lmagan.

Uyalarning O'ZARO tartibi ahamiyatsiz, ichidagi juftlik muhim. Ikki tuzoq: `a + 5` ning noli
MINUS beshda (ishora), va `2a` ning noli nolda — ikkiga ko'paytirish yangi taqiq qo'shmaydi.

**MA'LUMOT.**

```
chap bo'laklar (ifoda):  f1 -> 4/(a − 8)     f2 -> 7/(a + 5)     f3 -> 6/(2a)
o'ng bo'laklar (javob):  v1 -> a = 8         v2 -> a = −5        v3 -> a = 0
juftlar: f1+v1 · f2+v2 · f3+v3       (uch uya, uyalar tartibi ahamiyatsiz)
tomon KARTANING O'ZIDAN chiqadi: tokenlar bo'lsa chap, matn bo'lsa o'ng
```

**UZ.**
- eyebrow: `Pazl`
- setup: `Pastda oltita karta: uchtasida kasr, uchtasida qiymat. Har kasrning o'z taqiqi bor — ular juftlanib uchta bo'sh kartaga o'tiradi.`
- ask: `a ning qanday qiymatida kasr ma'noga ega emas? Kasrni bosing, keyin uyani bosing.`
- bank: `Kartalar`
- correctText: `To'g'ri. Uchtasida ham chiziq tagi nolga tenglashtirildi: a minus sakkiz sakkizda nolga aylanadi, a qo'shuv besh minus beshda, ikki a esa nolda. Qo'yib tekshiring: minus beshda a qo'shuv besh nol bo'ladi, arti beshda esa o'n.`
- wrong (f1 va f2 juftlari almashib ketgan): `Ishorani tekshiring: a qo'shuv beshni nolga aylantirish uchun MINUS besh kerak, a minus sakkizni nolga aylantirish uchun esa arti sakkiz. Ikkalasini qo'yib ko'ring.`
- wrong (f3 juftida a = 0 emas): `Ikki a nolga faqat a nolda aylanadi: ikkiga ko'paytirish yangi taqiq qo'shmaydi. Nolni qo'ying — maxraj nol bo'ladi.`
- wrong (f1 nol bilan yoki f3 sakkiz bilan juftlashdi): `a minus sakkizni nolga aylantirish uchun sakkiz kerak, nol emas: nolda bu maxraj minus sakkizga teng. Qo'yib tekshiring.`
- wrongText: `Chiziq tagiga qaraysiz, uni nolga tenglaysiz, yechimni topasiz — kasr va qiymat kartasi shunda juft bo'ladi.`

**RU.**
- eyebrow: `Пазл`
- setup: `Снизу шесть карточек: в трёх дроби, в трёх значения. У каждой дроби свой запрет — они собираются в пары и садятся в три пустые карточки.`
- ask: `При каком значении a дробь не имеет смысла? Нажми дробь, потом ячейку.`
- bank: `Карточки`
- correctText: `Верно. Везде приравнивалось к нулю то, что под чертой: a минус восемь — при восьми, a плюс пять — при минус пяти, два a — при нуле. Проверь: при минус пяти a плюс пять даёт нуль.`
- wrong (f1 va f2 juftlari almashib ketgan): `Проверь знак: чтобы a плюс пять обратилось в нуль, нужно МИНУС пять, а чтобы a минус восемь — плюс восемь. Подставь оба.`
- wrong (f3 juftida a = 0 emas): `Два a обращается в нуль только при a равном нулю: умножение на два нового запрета не добавляет. Подставь нуль — знаменатель станет нулём.`
- wrong (f1 nol bilan yoki f3 sakkiz bilan juftlashdi): `Чтобы обратить a минус восемь в нуль, нужно восемь, а не нуль: при нуле этот знаменатель равен минус восьми. Проверь подстановкой.`
- wrongText: `Смотришь под черту, приравниваешь к нулю, решаешь — вот и пара для дроби.`

**EN.**
- eyebrow: `Puzzle`
- setup: `Six cards below: three hold fractions, three hold values. Every fraction has its own ban — they pair up and sit in the three empty cards.`
- ask: `At which value of a does the fraction have no value? Tap a fraction, then a slot.`
- bank: `Cards`
- correctText: `Correct. In all three what stands below the bar was set to zero: a minus eight becomes zero at eight, a plus five at minus five, two a at zero. Check by substituting: at minus five a plus five is zero, at plus five it is ten.`
- wrong (f1 va f2 juftlari almashib ketgan): `Check the sign: a plus five needs MINUS five to become zero, while a minus eight needs plus eight. Substitute both.`
- wrong (f3 juftida a = 0 emas): `Two a becomes zero only at a equal to zero: multiplying by two adds no new ban. Substitute zero and the denominator becomes zero.`
- wrong (f1 nol bilan yoki f3 sakkiz bilan juftlashdi): `To make a minus eight zero you need eight, not zero: at zero this denominator equals minus eight. Check by substituting.`
- wrongText: `Look below the bar, set it to zero, solve it — that is the pair for the fraction.`

---

# 05 · `TypeValue` · 🟡 · teg `largest_ban`

**Nima tekshiriladi.** Maxrajda ikkita nol bor, o'quvchi ikkinchisini ko'rishi kerak.
`8a − 2a² = 2a(4 − a)`, nollari 0 va 4, eng kattasi 4. Eng ko'p uchraydigan xato — birinchi
nolni topib to'xtash (`a = 0`) yoki ishorani teskari olish (`a = −4`).

**MA'LUMOT.**

```
expr:   (a + 3)/(8a − 2a²)          8a − 2a² = 2a(4 − a)
target: 4         allowNeg: true
nollar: a = 0, a = 4
tekshirish: a = 4 -> 32 − 32 = 0 ;  a = 8 -> 64 − 128 = −64 ;
            a = 2 -> 16 − 8 = 8  ;  a = −4 -> −32 − 32 = −64
```

**UZ.**
- eyebrow: `Eng katta`
- setup: `Maxrajda ikkita had turadi va ularning umumiy ko'paytuvchisi bor. Umumiy ko'paytuvchini qavsdan chiqaring — nol qayerda paydo bo'lishi ko'rinadi.`
- label: `a ning eng katta qiymati`
- ask: `a ning qanday eng katta qiymatida kasr qiymatga ega emas?`
- correctText: `To'g'ri. Sakkiz a minus ikki a kvadrat — bu ikki a karra to'rt minus a. Ko'paytma nolga ikki joyda aylanadi: a nolda va a to'rtda. Kattasi to'rt. Tekshiring: to'rtda maxraj o'ttiz ikki minus o'ttiz ikki, ya'ni nol.`
- wrong (javob 0): `Nol ham taqiqlangan, lekin savol eng KATTAsini so'radi. Ikkinchi ko'paytuvchini nolga tenglang: to'rt minus a qachon nolga aylanadi?`
- wrong (javob 8): `Sakkiz — yozuvdagi son, ildiz emas. Qo'yib ko'ring: sakkiz karra sakkiz oltmish to'rt, ikki karra oltmish to'rt bir yuz yigirma sakkiz, ayirmasi minus oltmish to'rt — nol emas.`
- wrong (javob 2): `Ikki — qavsdan chiqarilgan son, ildiz emas. Ikki a nolga a nolda aylanadi. Ikkida maxraj o'n olti minus sakkiz, ya'ni sakkiz.`
- wrong (javob −4): `Ishora teskari: to'rt minus a nolga ARTI to'rtda aylanadi. Minus to'rtda maxraj minus o'ttiz ikki minus o'ttiz ikki, ya'ni minus oltmish to'rt.`
- wrong (javob −3): `Minus uch — suratning noli. U yerda kasrning qiymati nolga teng bo'ladi, lekin qiymat BOR. Savol chiziqning tagi haqida.`
- wrongText: `Maxrajni ko'paytuvchilarga ajratib nolga tenglang: ikki a karra to'rt minus a. Ikkita nol chiqadi, kattasini yozing.`

**RU.**
- eyebrow: `Наибольшее`
- setup: `В знаменателе два слагаемых, и у них есть общий множитель. Вынеси его за скобку — станет видно, где появляется нуль.`
- label: `наибольшее значение a`
- ask: `При каком наибольшем значении a дробь не имеет значения?`
- correctText: `Верно. Восемь a минус два a в квадрате — это два a на четыре минус a. Произведение обращается в нуль в двух местах: при a равном нулю и при a равном четырём. Наибольшее — четыре. Проверь: при четырёх знаменатель тридцать два минус тридцать два, то есть нуль.`
- wrong (javob 0): `Нуль тоже запрещён, но спрошено НАИБОЛЬШЕЕ. Приравняй к нулю второй множитель: когда четыре минус a обращается в нуль?`
- wrong (javob 8): `Восемь — число из записи, а не корень. Подставь: восемь на восемь — шестьдесят четыре, два на шестьдесят четыре — сто двадцать восемь, разность минус шестьдесят четыре, а не нуль.`
- wrong (javob 2): `Два — вынесенное число, а не корень. Два a обращается в нуль при a равном нулю. При двух знаменатель шестнадцать минус восемь, то есть восемь.`
- wrong (javob −4): `Знак наоборот: четыре минус a обращается в нуль при ПЛЮС четырёх. При минус четырёх знаменатель минус тридцать два минус тридцать два, то есть минус шестьдесят четыре.`
- wrong (javob −3): `Минус три — нуль числителя. Там значение дроби равно нулю, но оно ЕСТЬ. Вопрос про то, что под чертой.`
- wrongText: `Разложи знаменатель на множители и приравняй к нулю: два a на четыре минус a. Выйдут два нуля — запиши больший.`

**EN.**
- eyebrow: `Largest`
- setup: `The denominator has two terms with a common factor. Take it out of the bracket and you will see where the zero appears.`
- label: `the largest value of a`
- ask: `At which largest value of a does the fraction have no value?`
- correctText: `Correct. Eight a minus two a squared is two a times four minus a. The product becomes zero in two places: at a equal to zero and at a equal to four. The larger is four. Check: at four the denominator is thirty two minus thirty two, that is zero.`
- wrong (javob 0): `Zero is banned too, but the question asked for the LARGEST. Set the second factor to zero: when does four minus a become zero?`
- wrong (javob 8): `Eight is a number from the record, not a root. Substitute: eight times eight is sixty four, two times sixty four is one hundred twenty eight, the difference is minus sixty four, not zero.`
- wrong (javob 2): `Two is the factor taken out, not a root. Two a becomes zero at a equal to zero. At two the denominator is sixteen minus eight, that is eight.`
- wrong (javob −4): `The sign is reversed: four minus a becomes zero at PLUS four. At minus four the denominator is minus thirty two minus thirty two, that is minus sixty four.`
- wrong (javob −3): `Minus three is the zero of the numerator. There the value of the fraction is zero, but it EXISTS. The question is about what is below the bar.`
- wrongText: `Factor the denominator and set it to zero: two a times four minus a. Two zeros come out — write the larger one.`

---

# 06 · `MarkAll` · 🟡 · teg `always_defined`

**Nima tekshiriladi.** «Har qanday a da ma'noga ega» degani uch xil sababdan chiqadi:
maxrajda kvadrat qo'shuv musbat son (nolga aylanmaydi), yoki maxrajda umuman harf yo'q
(З19 shu yerda o'ladi). Uchta noto'g'ri karta esa uch xil nol beradi: kvadratlar ayirmasi
(ikkita nol), harfning o'zi (nol), chiziqli ifoda (bitta nol).

**MA'LUMOT.**

```
i1  5/(a² + 1)     BELGILANADI    a² + 1 kamida 1
i2  8/(a² − 25)    yo'q           a = 5, a = −5
i3  (a − 2)/7      BELGILANADI    maxrajda son, harf faqat suratda
i4  9/a            yo'q           a = 0
i5  3/(a² + 4)     BELGILANADI    a² + 4 kamida 4
i6  2/(5a − 10)    yo'q           a = 2
col: 168    itemSize: 21
```

**UZ.**
- eyebrow: `Belgilash`
- setup: `Oltita kasr. Ba'zilarida taqiqlangan qiymat bor, ba'zilarida umuman yo'q.`
- ask: `a ning ixtiyoriy qiymatida ham ma'noga ega bo'lgan 3 ta kasrni belgilang.`
- note: `Uchta`
- correctText: `To'g'ri. Uchtasining sababi uch xil: a kvadrat qo'shuv bir kamida birga teng, a kvadrat qo'shuv to'rt kamida to'rtga, uchinchisida esa maxrajda yetti turadi va harf umuman yo'q. Qolgan uchtasi nolga aylanadi: a kvadrat minus yigirma besh beshda va minus beshda, a nolda, besh a minus o'n ikkida.`
- wrong (i3 belgilanmagan): `Maxrajda son turgan kasrni chetlab o'tdingiz. Yetti nolga aylanmaydi va o'zgarmaydi, a esa faqat suratda: bunday kasr har qanday a da hisoblanadi.`
- wrong (i4 belgilangan): `Nolni qo'yib ko'ring: chiziq tagida nolning o'zi qoladi va bo'lish to'xtaydi. Maxrajda faqat harf turishi — eng qisqa taqiq.`
- wrong (i2 yoki i6 belgilangan): `Bu maxrajlarni nolga tenglang. a kvadrat minus yigirma besh nolga ikki joyda aylanadi, besh a minus o'n esa bir joyda. Qo'yib tekshiring.`
- wrong (uchtadan boshqa son belgilangan): `Aynan uchta kasr kerak. Har birini nolga tenglashga urinib ko'ring: tenglama yechimga ega bo'lsa, u kasr taqiqli.`
- wrongText: `Har maxrajni nolga tenglang. Yechimi yo'q bo'lsa — kasr har qanday a da ma'noga ega.`

**RU.**
- eyebrow: `Отметить`
- setup: `Шесть дробей. У некоторых есть запрещённое значение, у некоторых нет вовсе.`
- ask: `Отметь 3 дроби, которые имеют смысл при любом значении a.`
- note: `Три`
- correctText: `Верно. Причины разные: a в квадрате плюс один не меньше единицы, a в квадрате плюс четыре не меньше четырёх, а в третьей под чертой семь и буквы нет вовсе. Остальные три обращаются в нуль: при пяти и минус пяти, при нуле, при двух.`
- wrong (i3 belgilanmagan): `Дробь с числом в знаменателе осталась в стороне. Семь в нуль не обращается и не меняется, a стоит только в числителе: такая дробь считается при любом a.`
- wrong (i4 belgilangan): `Подставь нуль: под чертой останется сам нуль, и деление прекратится. Одна буква в знаменателе — самый короткий запрет.`
- wrong (i2 yoki i6 belgilangan): `Приравняй эти знаменатели к нулю. a в квадрате минус двадцать пять обращается в нуль в двух местах, пять a минус десять — в одном. Проверь подстановкой.`
- wrong (uchtadan boshqa son belgilangan): `Нужно ровно три дроби. Попробуй приравнять каждый знаменатель к нулю: если уравнение имеет решение, у дроби есть запрет.`
- wrongText: `Приравняй каждый знаменатель к нулю. Нет решения — дробь имеет смысл при любом a.`

**EN.**
- eyebrow: `Mark`
- setup: `Six fractions. Some have a forbidden value, some have none at all.`
- ask: `Mark the 3 fractions that have a value for every a.`
- note: `Three`
- correctText: `Correct. The three have different reasons: a squared plus one is at least one, a squared plus four is at least four, and the third has seven below the bar with no letter there at all. The other three become zero: a squared minus twenty five at five and minus five, a at zero, five a minus ten at two.`
- wrong (i3 belgilanmagan): `The fraction with a number in the denominator was left out. Seven never becomes zero and never changes, and a stays only in the numerator: such a fraction is computed for every a.`
- wrong (i4 belgilangan): `Substitute zero: the zero itself stays below the bar and the division stops. A single letter in the denominator is the shortest ban there is.`
- wrong (i2 yoki i6 belgilangan): `Set these denominators to zero. a squared minus twenty five becomes zero in two places, five a minus ten in one. Check by substituting.`
- wrong (uchtadan boshqa son belgilangan): `Exactly three fractions are needed. Try setting each denominator to zero: if the equation has a solution, that fraction has a ban.`
- wrongText: `Set each denominator to zero. No solution means the fraction has a value for every a.`

---

# 07 · `CodeLock` · 🟡 · teg `code_bans`

**Nima tekshiriladi.** Ko'paytma nolga aylanadi, agar ko'paytuvchilardan bittasi nolga
aylansa. Uchta ko'paytuvchi — uchta taqiq, va ular kodga O'SISH tartibida yoziladi.
Bankdagi ikki tuzoq — ikki xil ishora xatosi (`2a + 4` uchun 2, `12 − 3a` uchun −4),
uchinchisi — yozuvdagi son (12).

**MA'LUMOT.**

```
expr:  5/(a(2a + 4)(12 − 3a))
nollar: a = 0 ; 2a + 4 = 0 -> a = −2 ; 12 − 3a = 0 -> a = 4
kod (o'sish tartibida): −2 , 0 , 4
bank: −4 , −2 , 0 , 2 , 4 , 12
tekshirish: 2a + 4 da a = 2 -> 8 ;  12 − 3a da a = −4 -> 24 ;  a = 12 -> 12 − 36 = −24
```

**UZ.**
- eyebrow: `Kod`
- setup: `Xonada seyf turadi, kodi uch xonali. Kodni yozuvning o'zi beradi: maxraj uchta ko'paytuvchidan yig'ilgan, va kod — kasr ma'noga ega bo'lmaydigan qiymatlar.`
- ask: `Kasr qaysi qiymatlarda ma'noga ega emasligini toping va kodga o'sha sonlarni o'sish tartibida yozing.`
- bank: `Sonlar`
- slotLabel: `Kod`
- correctText: `To'g'ri. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nolga aylanishi kifoya. a nolda, ikki a qo'shuv to'rt minus ikkida, o'n ikki minus uch a esa to'rtda. O'sish tartibida: minus ikki, nol, to'rt. Har birini qo'yib ko'ring — maxraj nolga aylanadi.`
- wrong (kodda 2 bor): `Ikki a qo'shuv to'rt nolga ikkida emas, MINUS ikkida aylanadi: ikkida u sakkizga teng. Tenglamani yechib ko'ring.`
- wrong (kodda −4 bor): `O'n ikki minus uch a nolga ARTI to'rtda aylanadi: minus to'rtda u yigirma to'rtga teng. Ishorani qo'yib tekshiring.`
- wrong (kodda 12 bor): `O'n ikki — yozuvdagi son, ildiz emas. O'n ikkida bu ko'paytuvchi o'n ikki minus o'ttiz olti, ya'ni minus yigirma to'rt bo'ladi.`
- wrong (sonlar to'g'ri, tartib buzilgan): `Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish tartibi eng kichigidan boshlanadi, va manfiy son noldan kichik.`
- wrong (kodda nol yo'q): `Birinchi ko'paytuvchi — a ning o'zi. U nolda nolga aylanadi, ya'ni nol ham kodning bir raqami.`
- wrongText: `Uch ko'paytuvchining har birini alohida nolga tenglang. Uch yechim chiqadi — ularni kichikdan kattaga qarab yozing.`

**RU.**
- eyebrow: `Код`
- setup: `В комнате сейф, код трёхзначный. Код даёт сама запись: знаменатель собран из трёх множителей, а код — это значения, при которых дробь не имеет смысла.`
- ask: `Найди, при каких значениях дробь не имеет смысла, и запиши эти числа в код по возрастанию.`
- bank: `Числа`
- slotLabel: `Код`
- correctText: `Верно. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя. a — при нуле, два a плюс четыре — при минус двух, двенадцать минус три a — при четырёх. По возрастанию: минус два, нуль, четыре. Подставь каждое — знаменатель обращается в нуль.`
- wrong (kodda 2 bor): `Два a плюс четыре обращается в нуль не при двух, а при МИНУС двух: при двух он равен восьми. Реши уравнение.`
- wrong (kodda −4 bor): `Двенадцать минус три a обращается в нуль при ПЛЮС четырёх: при минус четырёх он равен двадцати четырём. Проверь знак подстановкой.`
- wrong (kodda 12 bor): `Двенадцать — число из записи, а не корень. При двенадцати этот множитель равен двенадцать минус тридцать шесть, то есть минус двадцать четыре.`
- wrong (sonlar to'g'ri, tartib buzilgan): `Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего, и отрицательное число меньше нуля.`
- wrong (kodda nol yo'q): `Первый множитель — сама a. Она обращается в нуль при нуле, значит нуль тоже цифра кода.`
- wrongText: `Приравняй к нулю каждый из трёх множителей по отдельности. Выйдут три решения — запиши их от меньшего к большему.`

**EN.**
- eyebrow: `Code`
- setup: `There is a safe in the room and its code has three places. The record itself gives the code: the denominator is built from three factors, and the code is the values at which the fraction has no value.`
- ask: `Find the values at which the fraction has no value and write those numbers into the code in increasing order.`
- bank: `Numbers`
- slotLabel: `Code`
- correctText: `Correct. One zero factor is enough for the product to become zero. a at zero, two a plus four at minus two, twelve minus three a at four. In increasing order: minus two, zero, four. Substitute each and the denominator becomes zero.`
- wrong (kodda 2 bor): `Two a plus four becomes zero not at two but at MINUS two: at two it equals eight. Solve the equation.`
- wrong (kodda −4 bor): `Twelve minus three a becomes zero at PLUS four: at minus four it equals twenty four. Check the sign by substituting.`
- wrong (kodda 12 bor): `Twelve is a number from the record, not a root. At twelve this factor is twelve minus thirty six, that is minus twenty four.`
- wrong (sonlar to'g'ri, tartib buzilgan): `The numbers are right, the order is not. Increasing starts from the smallest, and a negative number is smaller than zero.`
- wrong (kodda nol yo'q): `The first factor is a itself. It becomes zero at zero, so zero is one of the code digits too.`
- wrongText: `Set each of the three factors to zero separately. Three solutions come out — write them from smallest to largest.`

---

# 08 · `ClozeBank` · 🔴 · teg `rule_words`

**Nima tekshiriladi.** Darsning asosiy qoidasi so'z bilan. Ikki nol qarshi qo'yiladi:
maxrajdagi nol qiymatni YO'Q qiladi, suratdagi nol esa qiymatni NOLGA aylantiradi (T3, З18).
Bankda ikki tuzoq: `ko'paytuvchi` — bu darsning so'zi emas, `aniqlanmagan` — aynan З18.

**MA'LUMOT.**

```
uch bo'shliq:  1 -> maxraj      2 -> surat      3 -> nol
bank (5 karta): maxraj · surat · nol · ko'paytuvchi · aniqlanmagan
```

Uch tilda gapning SHAKLI bir xil: matn, bo'shliq, matn, bo'shliq, matn, bo'shliq, matn.
Shu sababli bo'shliqlarning tartibi hamma tilda bir xil bo'ladi.

**UZ.**
- eyebrow: `So'zlar`
- setup: `Qoida yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.`
- ask: `Kartani bosing, keyin bo'sh kartochkani bosing.`
- bank: `Kartalar`
- matn: `Kasr —` ⟨1⟩ `nolga aylanadigan qiymatlarda ma'noga ega emas.` ⟨2⟩ `nolga aylanadigan qiymatlarda esa kasrning qiymati` ⟨3⟩ `bo'ladi.`
- kartalar: `maxraj` · `surat` · `nol` · `ko'paytuvchi` · `aniqlanmagan`
- correctText: `To'g'ri. Ikki nolning ikki xil ishi bor. Maxrajdagi nol bo'lishni to'xtatadi — qiymat yo'q. Suratdagi nol bo'lishni to'xtatmaydi: nolni beshga bo'lsangiz nol chiqadi, ya'ni qiymat bor va u nolga teng.`
- wrong (birinchi va ikkinchi bo'shliq almashib ketgan): `Ikki so'z joyini almashtirdi. Nolni beshga bo'lib ko'ring: javob nol, qiymat bor. Endi beshni nolga bo'lishga urinib ko'ring: bunday amal yo'q. Demak qiymatni yo'q qiladigan nol chiziqning tagida turadi.`
- wrong (uchinchi bo'shliqda «aniqlanmagan»): `Suratdagi nol qiymatni yo'q qilmaydi, uni nolga aylantiradi. Nol bo'lingan minus ikki nolga teng — bu aniq javob.`
- wrong (bo'shliqda «ko'paytuvchi»): `Ko'paytuvchi bu darsning so'zi emas: bu yerda gap chiziqning usti va tagi haqida boradi.`
- wrongText: `Bitta savol bering: nol qaysi qavatda turganda bo'lish to'xtaydi? O'sha qavatning nomini birinchi bo'shliqqa qo'ying.`

**RU.**
- eyebrow: `Слова`
- setup: `Правило записано, но три слова выпали. Поставь их из карточек снизу.`
- ask: `Нажми карточку, потом пустую клетку.`
- bank: `Карточки`
- matn: `Дробь не имеет смысла при тех значениях, при которых в нуль обращается` ⟨1⟩ `. Если же в нуль обращается` ⟨2⟩ `, значение дроби равно` ⟨3⟩ `.`
- kartalar: `знаменатель` · `числитель` · `нулю` · `множитель` · `не определено`
- correctText: `Верно. У двух нулей две разные работы. Нуль в знаменателе прекращает деление — значения нет. Нуль в числителе деление не прекращает: нуль разделить на пять — нуль, то есть значение есть и оно равно нулю.`
- wrong (birinchi va ikkinchi bo'shliq almashib ketgan): `Два слова поменялись местами. Раздели нуль на пять: ответ нуль, значение есть. Теперь попробуй разделить пять на нуль: такого действия нет. Значит нуль, убивающий значение, стоит под чертой.`
- wrong (uchinchi bo'shliqda «aniqlanmagan»): `Нуль в числителе не убивает значение, а делает его нулём. Нуль разделить на минус два равно нулю — это точный ответ.`
- wrong (bo'shliqda «ko'paytuvchi»): `Множитель — слово не из этого урока: здесь речь про то, что над чертой и что под ней.`
- wrongText: `Задай один вопрос: на каком этаже нуль прекращает деление? Название этого этажа и ставь в первую клетку.`

**EN.**
- eyebrow: `Words`
- setup: `The rule is written down, but three words fell out. Put them back from the cards below.`
- ask: `Tap a card, then tap an empty cell.`
- bank: `Cards`
- matn: `A fraction has no value at those values where` ⟨1⟩ `becomes zero. Where` ⟨2⟩ `becomes zero, the value of the fraction is` ⟨3⟩ `.`
- kartalar: `the denominator` · `the numerator` · `zero` · `the factor` · `undefined`
- correctText: `Correct. The two zeros do two different jobs. A zero in the denominator stops the division — there is no value. A zero in the numerator does not stop it: zero divided by five is zero, so the value exists and equals zero.`
- wrong (birinchi va ikkinchi bo'shliq almashib ketgan): `Two words swapped places. Divide zero by five: the answer is zero, the value exists. Now try dividing five by zero: there is no such operation. So the zero that kills the value stands below the bar.`
- wrong (uchinchi bo'shliqda «aniqlanmagan»): `A zero in the numerator does not kill the value, it makes it zero. Zero divided by minus two equals zero — an exact answer.`
- wrong (bo'shliqda «ko'paytuvchi»): `Factor is not a word from this lesson: here it is about what is above the bar and what is below it.`
- wrongText: `Ask one question: on which floor does a zero stop the division? Put the name of that floor into the first cell.`

---

# 09 · `SwapOrder` · 🔴 · teg `order_steps`

**Nima tekshiriladi.** Ish tartibi: chiziq tagini ajratamiz, nolga tenglaymiz, tenglamani
yechamiz, shartni yozamiz. Eng ko'p uchraydigan buzilish — xulosani (`a = 5`) tenglamadan
OLDIN qo'yish, ya'ni javobni ko'chirib olib keyin asoslash.

**MA'LUMOT.**

```
expr: 15/(4a − 20)
l1  chiziq tagi ajratiladi      4a − 20
l2  nolga tenglanadi            4a − 20 = 0
l3  tenglama yechiladi          a = 5
l4  shart yoziladi              a ≠ 5
javob: l1 l2 l3 l4
boshlang'ich tartib (qat'iy, tasodifiy emas): l3 l1 l4 l2
tekshirish: 4 · 5 − 20 = 0
```

**UZ.**
- eyebrow: `Tartib`
- setup: `Kasr qaysi qiymatda ma'noga ega emasligini topishning to'rt yo'li bir qatorda turadi, lekin tartibi buzilgan.`
- ask: `To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.`
- l1: `chiziq tagini ajratamiz`
- l2: `maxrajni nolga tenglaymiz`
- l3: `tenglamani yechamiz`
- l4: `shartni yozamiz`
- correctText: `To'g'ri. Tartib har doim shunday: chiziq tagini ajratamiz, uni nolga tenglaymiz, tenglamani yechamiz va shartni yozamiz. Beshni qo'yib tekshiring: to'rt karra besh yigirma, yigirma minus yigirma nol — demak beshda kasr ma'noga ega emas.`
- wrong (birinchi karta l3): `Xulosadan boshlab bo'lmaydi: a beshga teng degan natija tenglamadan CHIQADI, undan oldin turmaydi.`
- wrong (l4 l3 dan oldin): `Shartni yechimdan oldin yozib bo'lmaydi: taqiqlanadigan sonni bilmasdan a nolga teng emas degan yozuvni to'ldirish mumkin emas.`
- wrong (birinchi karta l2): `Nolga tenglashdan oldin NIMANI tenglashni ajratib olish kerak. Birinchi qadam — chiziqning tagiga qarash.`
- wrong (l1 va l2 almashib ketgan): `Yozuvni nolga tenglash uchun avval o'sha yozuvni ajratib olish kerak. Ikki qadamning o'rnini almashtiring.`
- wrongText: `Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon ma'lum bo'lishi kerak? Javobi yo'q qadam birinchi turadi.`

**RU.**
- eyebrow: `Порядок`
- setup: `Четыре шага поиска значения, при котором дробь не имеет смысла, стоят в одну строку, но порядок нарушен.`
- ask: `Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.`
- l1: `выделяем то, что под чертой`
- l2: `приравниваем знаменатель к нулю`
- l3: `решаем уравнение`
- l4: `записываем условие`
- correctText: `Верно. Порядок всегда такой: выделяем то, что под чертой, приравниваем к нулю, решаем уравнение и записываем условие. Проверь подстановкой: четыре на пять — двадцать, двадцать минус двадцать — нуль, значит при пяти дробь не имеет смысла.`
- wrong (birinchi karta l3): `Начинать с вывода нельзя: результат a равно пяти ВЫХОДИТ из уравнения, а не стоит перед ним.`
- wrong (l4 l3 dan oldin): `Условие не записать раньше решения: не зная запрещённого числа, нечего поставить в запись a не равно.`
- wrong (birinchi karta l2): `Прежде чем приравнивать к нулю, надо выделить ЧТО приравнивать. Первый шаг — посмотреть под черту.`
- wrong (l1 va l2 almashib ketgan): `Чтобы приравнять запись к нулю, эту запись сначала надо выделить. Поменяй эти два шага местами.`
- wrongText: `Спроси у каждого шага: что должно быть уже известно, чтобы его сделать? Шаг без такого требования и стоит первым.`

**EN.**
- eyebrow: `Order`
- setup: `The four steps for finding where a fraction has no value stand in one row, but their order is broken.`
- ask: `Put them in the right sequence: tap two cards in a row to swap them.`
- l1: `single out what is below the bar`
- l2: `set the denominator to zero`
- l3: `solve the equation`
- l4: `write the condition`
- correctText: `Correct. The order is always this: single out what is below the bar, set it to zero, solve the equation and write the condition. Check by substituting: four times five is twenty, twenty minus twenty is zero, so at five the fraction has no value.`
- wrong (birinchi karta l3): `You cannot start from the conclusion: the result a equals five COMES OUT of the equation, it does not stand before it.`
- wrong (l4 l3 dan oldin): `The condition cannot be written before the solution: without knowing the forbidden number there is nothing to put into a is not equal to.`
- wrong (birinchi karta l2): `Before setting something to zero you must single out WHAT to set. The first step is to look below the bar.`
- wrong (l1 va l2 almashib ketgan): `To set a record to zero, that record has to be singled out first. Swap these two steps.`
- wrongText: `Ask every step: what must already be known to do it? The step with no such requirement stands first.`

---

# 10 · `MatchPairs` · 🔴 · teg `info_to_frac`

**Nima tekshiriladi.** To'rt kasrning surati bir xil, farqi faqat maxrajda — demak javobni
faqat chiziq tagi hal qiladi. Chapda ma'lumot so'z bilan berilgan, o'ngda kasrlar turadi
(o'ng ustun har ochilganda aralashtiriladi). Taqiqlar SONI so'raladi: bir, ikki, nol, va
alohida holat — taqiq faqat nolda.

Tanlangan juftlik CHIZIQ bilan birlashtiriladi (`connect: true`, metodist 2026-08-22).
Ikki ustun orasida alohida yo'lak bor. Chiziqning shakli juftlikka qarab ikki xil (metodist
2026-08-24, bu 2026-08-22 dagi «kamon» qarorini bekor qiladi):

- ma'lumot TO'G'RISIDAGI qator bilan juftlansa — TO'G'RI chiziq (kesma);
- boshqa qator bilan juftlansa — avvalgidek kubik Bezye: katakdan gorizontal chiqadi,
  o'rtasida ko'tariladi yoki tushadi.

`kit.jsx` dagi eng eski qaror («chiziq tortilmaydi, telefonda ustma-ust tushadi») yo'lak
bilan yopilgan, u o'z kuchida qoladi. `connect` yo'q darslarda (2, 3, 4, 6) juftlash
ko'rinishi o'zgarmadi.

**MA'LUMOT.**

```
chap (ma'lumot)                    o'ng (kasr)
m1 faqat bitta taqiq          ->   t1  5/(a − 3)        a = 3
m2 ikkita taqiq               ->   t2  5/(a² − 9)       a = 3, a = −3
m3 taqiq umuman yo'q          ->   t3  5/(a² + 9)       nol yo'q, kamida 9
m4 taqiq faqat nolda          ->   t4  5/(4a)           a = 0
itemSize: 15
```

**UZ.**
- eyebrow: `Moslashtirish`
- setup: `To'rt kasrning surati bir xil, farqi faqat maxrajda. Chapda har bir kasr haqida bitta ma'lumot turadi.`
- ask: `Chapdan ma'lumotni bosing, keyin o'ngdan unga mos kasrni bosing.`
- m1: `faqat bitta taqiqlangan qiymat bor`
- m2: `ikkita taqiqlangan qiymat bor`
- m3: `taqiq umuman yo'q`
- m4: `taqiq faqat nolda`
- correctText: `To'g'ri. a minus uch bitta joyda nolga aylanadi — uchda. a kvadrat minus to'qqiz ikki joyda: uchda va minus uchda, chunki har ikkisining kvadrati to'qqiz. a kvadrat qo'shuv to'qqiz esa hech qachon: eng kichik qiymati to'qqiz. To'rt a nolga faqat nolda aylanadi.`
- wrong (m2 va m3 almashib ketgan): `Ishorani ko'ring: bir maxrajda AYIRISH turadi, ikkinchisida QO'SHISH. Ayirish to'qqizga yetganda nolga tushadi, qo'shish esa hech qachon: uchni ham, minus uchni ham qo'yib tekshiring.`
- wrong (m4 juftida to'rt a emas): `To'rtga ko'paytirish yangi taqiq qo'shmaydi: to'rt a nolga faqat a nolda aylanadi. Boshqa hech qanday son bu maxrajni nolga aylantirmaydi.`
- wrong (m1 juftida kvadratli maxraj): `Chiziqli maxrajning bitta noli bor, kvadratning esa ikkita bo'lishi mumkin. Kvadratli maxrajga minus uchni ham qo'yib ko'ring.`
- wrong (uch yoki to'rtta xato): `Har kasrda bitta ish qiling: maxrajni nolga tenglang va nechta yechim chiqqanini SANANG. Nechta yechim — shuncha taqiq.`
- wrongText: `Maxrajni nolga tenglab yechimlar sonini sanang: nol, bir yoki ikki. Ma'lumot aynan shu sonni aytadi.`

**RU.**
- eyebrow: `Соответствие`
- setup: `У четырёх дробей одинаковый числитель, разница только в знаменателе. Слева про каждую дробь сказано одно.`
- ask: `Нажми сведение слева, потом подходящую дробь справа.`
- m1: `есть ровно один запрет`
- m2: `есть два запрета`
- m3: `запретов нет вовсе`
- m4: `запрет только в нуле`
- correctText: `Верно. a минус три обращается в нуль в одном месте — при трёх. a в квадрате минус девять в двух: при трёх и минус трёх, ведь квадрат обоих равен девяти. A в квадрате плюс девять — никогда: его наименьшее значение девять. Четыре a обращается в нуль только при нуле.`
- wrong (m2 va m3 almashib ketgan): `Посмотри на знак: в одном знаменателе ВЫЧИТАНИЕ, в другом СЛОЖЕНИЕ. Вычитание доходит до нуля на девяти, сложение — никогда: подставь и три, и минус три.`
- wrong (m4 juftida to'rt a emas): `Умножение на четыре нового запрета не добавляет: четыре a обращается в нуль только при a равном нулю. Никакое другое число этот знаменатель не обнулит.`
- wrong (m1 juftida kvadratli maxraj): `У линейного знаменателя один нуль, у квадрата их может быть два. Подставь в квадратный знаменатель ещё и минус три.`
- wrong (uch yoki to'rtta xato): `С каждой дробью делай одно: приравняй знаменатель к нулю и ПОСЧИТАЙ, сколько вышло решений. Сколько решений — столько запретов.`
- wrongText: `Приравняй знаменатель к нулю и посчитай решения: нуль, одно или два. Сведение говорит именно про это число.`

**EN.**
- eyebrow: `Match`
- setup: `The four fractions share the same numerator; the difference is only in the denominator. On the left, one fact is stated about each fraction.`
- ask: `Tap a fact on the left, then tap the matching fraction on the right.`
- m1: `there is exactly one ban`
- m2: `there are two bans`
- m3: `there are no bans at all`
- m4: `the ban is only at zero`
- correctText: `Correct. a minus three becomes zero in one place — at three. a squared minus nine in two: at three and at minus three, since both squares are nine. a squared plus nine never does: its smallest value is nine. Four a becomes zero only at zero.`
- wrong (m2 va m3 almashib ketgan): `Look at the sign: one denominator has SUBTRACTION, the other ADDITION. Subtraction reaches zero at nine, addition never does: substitute both three and minus three.`
- wrong (m4 juftida to'rt a emas): `Multiplying by four adds no new ban: four a becomes zero only at a equal to zero. No other number makes this denominator vanish.`
- wrong (m1 juftida kvadratli maxraj): `A linear denominator has one zero; a square can have two. Substitute minus three into the square denominator as well.`
- wrong (uch yoki to'rtta xato): `Do one thing with every fraction: set the denominator to zero and COUNT the solutions. As many solutions as bans.`
- wrongText: `Set the denominator to zero and count the solutions: none, one or two. The fact on the left is about exactly that number.`

---

# 11. NIMA QOPLANDI

| Tasdiq / adashish | Qaysi topshiriqlarda |
|---|---|
| T1 songa bo'linsa butun, harfga bo'linsa kasr | 01 (opt 3) · 02 · 03 (s2) · 06 (i3) |
| T2 ruhsat etilgan qiymatlarni maxraj beradi | 01 · 03 · 04 · 05 · 06 · 07 · 08 · 09 · 10 |
| T3 suratdagi nol — qiymat nol | 01 (opt 2) · 03 (s3) · 05 (javob −3) · 08 |
| З2 ODZ topilmadi yoki yo'qoldi | 04 · 05 · 07 · 09 · 10 |
| З16 javob son bilan tekshirilmadi | hamma `correctText` va razborlar son bilan tekshiradi; 06 va 10 da bu talab |
| З18 surat va maxrajdagi nol aralashdi | 01 · 03 · 05 · 08 |
| З19 songa bo'lish harfga bo'lish deb olindi | 01 · 03 · 06 |

# 12. SONLI MISOLLAR TAKRORLANMAYDI (TIPLAR §7 p. 6)

```
01  a² + 1 ; 0 : (−2) ; 7                 06  a²+1 · a²−25 · (a−2)/7 · 9/a · a²+4 · 5a−10
02  4/a · a/4 · 8/(2a) · 12/(3a) ·        07  a(2a + 4)(12 − 3a)
    2a/8 · 3a/12                          08  (yozuv yo'q, faqat so'z)
03  a/(a−6) · (a−4)/5 · 0/(a−2) ·         09  15/(4a − 20)
    12/(a²+3)                             10  5/(a−3) · 5/(a²−9) · 5/(a²+9) · 5/(4a)
04  4/(a−8) · 7/(a+5) · 6/(2a)
05  (a+3)/(8a − 2a²)
```

Bir xil yozuv ikki topshiriqda uchramaydi. Yaqin ko'ringan juftlar ataylab boshqa:
`6/(2a)` (04) va `9/a` (06); `a² + 1`/`a² + 4` (06) va `a² + 9` (10) — uchi ham «nolga
aylanmaydigan maxraj», lekin har biri o'z topshirig'ida o'z ishini qiladi.

# 13. TEKSHIRUV (2026-08-22)

```
node scripts/grade8-practice-plan.mjs   -- javob yo'llari: PLAN_01
G8_LESSON=dars01 node scripts/grade8-practice-check.mjs           -> 150 o'tish, toza
G8_WRONG=1 G8_LESSON=dars01 node scripts/grade8-practice-check.mjs -> 150 o'tish, toza
G8_VP=noutbuk node scripts/grade8-practice-check.mjs               -> 180 o'tish (1-6 dars), toza
npx eslint src/components/grade8/practice                          -> yangi xato yo'q
npm run build                                                      -> o'tdi
```

Topilgan va tuzatilgan bitta nuqson: 01-topshiriqda telefonda RU razbor bilan 26px kadrdan
chiqib ketardi (360px da 18px). Shart matni uch tilda ham qisqartirildi, RU ning ikki
varianti ham. `Choice` tipiga tegilmadi: u 6-darsda ham ishlaydi.

# 14. METODIST TUZATISHLARI — IKKINCHI TUR (2026-08-22)

| Nima so'ralgan | Nima qilindi |
|---|---|
| «4-topshiriqda pazl shunday yig'ilishi kerak (rasm), chap tarafga faqat ifodalar, o'ng tarafga faqat javoblar» | `PairSlots` qayta yozildi: bo'lak konturi SVG bilan chiziladi, chap bo'lakning tishi o'ngga chiqadi, o'ng bo'lakning chap qirrasida uya. Uyalar TIP bo'yicha: ifoda faqat chapga, javob faqat o'ngga tushadi. Uch juft telefonda ham bir qatorga sig'adi |
| «10-topshiriqda tanlangan juftlar chiziq bilan birlashtirilsin, lekin to'g'ri chiziq emas» | `MatchPairs` ga `connect` qo'shildi: ikki ustun orasida yo'lak, juftlik ustida kubik Bezye. Bir qatordagi juftlikda chiziq kamon kabi egiladi, ishora qator bo'yicha almashadi. Boshqa darslarga tegmadi |
| «3-topshiriqda 4 ta qator bor, 2 ta qator qil» | Ikki mulohaza qoldi: `(a − 4)/5` (З19) va `0/(a − 2)` (З18). Qolgan ikkitasining mazmuni 04, 05, 06, 07, 09, 10 da tekshiriladi |

Tekshiruv tuzatishlardan keyin: `dars01` to'g'ri yo'l 150 o'tish toza, noto'g'ri yo'l 150
o'tish toza, 1-6 darslar regressiyasi 180 o'tish toza, `eslint` da yangi xato yo'q,
`npm run build` o'tadi.

# 15. TOPILGAN UMUMIY NUQSON — METODIST QARORINI KUTADI

`PracticeHost.jsx` ning pastdagi paneli `position: sticky` va kontentni YOPIB qo'yishi
mumkin. `grade8-practice-check.mjs` buni ko'rmaydi: u faqat skrollni o'lchaydi, panel ostida
qolgan matn esa skroll bermaydi. Ya'ni razbor ekranda bo'lmasligi mumkin, tekshiruv esa
yashil beradi — «eng sezilmas nuqson» ning aynan o'zi (TIPLAR §8).

O'lchov uchun `scripts/grade8-practice-panel.mjs` yozildi. 1-darsda topilganlari
tuzatildi (matnlar qisqartirildi, qolgani 4–8px, ya'ni blokning ichki bo'shligi).
**Boshqa darslarda tuzatilmagan**, chunki bu topshiriq doirasidan tashqarida:

```
dars02  telefon  uz/ru  02-topshiriq  56px      03-topshiriq  29px    ru 04  13px
dars04  telefon  uz/ru/en  06-topshiriq  26px   08-topshiriq  20px    en 07  11px
dars03, dars05, dars06 — toza
```

Ikki yo'l bor: har darsning matnini qisqartirish, yoki umumiy qatlamni tuzatish — panelga
to'liq fon berib, ishchi maydonga panel balandligicha pastdan joy qo'shish. Ikkinchisi
bitta joyda tuzatadi, lekin skroll paydo bo'lishi mumkin va 2-6 darslar qayta o'lchanishi
kerak. Qaysi biri — metodist aytadi.

---

# 15. METODIST TUZATISHLARI — UCHINCHI TUR (2026-08-24)

| Nima so'ralgan | Nima qilindi |
|---|---|
| «4-topshiriqdagi pazllarni bir-birini to'ldiruvchi pazl qilish kerak (rasm)» | `PairSlots` geometriyasi tuzatildi. Ilgari ikki konturning yoyi ham TASHQARIGA qaragan edi — bo'laklar bir-biriga kirmasdi. Endi tish va uya bitta aylana: chapda qavariq, o'ngda botiq, markazi bir nuqtada. O'ng bo'lak `2r + 2` piksel chapga suriladi, shunda orada bo'sh joy ham, ortiqcha ustma-ust tushish ham qolmaydi. Surilgan ramka chap tishning bosishini o'g'irlamasligi uchun bosishni konturning o'zi qabul qiladi (`pointer-events`) |
| «10-topshiriqda to'g'risidagi qator bilan juftlansa chiziq to'g'ri bo'lsin, qolganlarida hozirgi holida qolsin» | `MatchPairs` da `bow` olib tashlandi: ikki katakning markazi bir balandlikda bo'lsa — kesma, aks holda avvalgi kubik Bezye. Bu 2026-08-22 dagi «bir qatorda ham kamon» qarorini bekor qiladi. `connect` yo'q darslarga (2, 3, 4, 6) tegmadi |

Ikkala o'zgarish ham `kit.jsx` ning umumiy qatlamida — `D01_04.jsx` va `D01_10.jsx`
ma'lumotiga tegilmadi. Tekshiruv: `npm run build` o'tadi, kadrlar
`.tmp/shots/dars01-04-*` va `dars01-10-*` da.
