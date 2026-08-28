# DARS16_AMALIYOT_KONTENT — 9-sinf, 16-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars16/D16_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `Choice` · 🟢 · teg `kesishma-emas-birlashma-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Sistemada ikkita tengsizlik turibdi. Ular «va» bilan bog'langan. | В системе стоят два неравенства. Они связаны словом «и». | A system holds two inequalities. They are joined by "and". |
| `ask` | Sistemaning yechimi qanday sonlardan iborat? | Из каких чисел состоит решение системы? | What numbers make up the solution of a system? |
| `label` | Ikkala tengsizlikni bir vaqtda qanoatlantiradigan sonlardan | Из чисел, которые удовлетворяют обоим неравенствам одновременно | The numbers that satisfy both inequalities at once |
| `label` | Hech bo'lmasa bittasini qanoatlantiradigan sonlardan | Из чисел, которые удовлетворяют хотя бы одному из них | The numbers that satisfy at least one of them |
| `label` | Ikkala javobni birlashtirib olingan sonlardan | Из чисел, полученных объединением обоих ответов | The numbers obtained by joining both answers together |
| `label` | Birinchi tengsizlikning javobidan | Из ответа первого неравенства | The answer of the first inequality |
| `correctText` | To'g'ri. «Va» degani ikkala shart ham BIR VAQTDA bajarilishi kerak, ya'ni son ikkala javobga ham tushishi shart. O'qda bu ikki to'plamning ustma-ust tushgan qismi bo'ladi — umumiy qism. Ikkinchi va uchinchi variantlar bir xil narsani aytadi va ikkalasi ham «yoki» ning ta'rifi: u yerda son bitta shartni bajarsa ham yetadi, va o'qda qismlar birlashadi, kesishmaydi. | Верно. «И» означает, что оба условия должны выполняться ОДНОВРЕМЕННО, то есть число обязано попасть в оба ответа. На оси это часть, где два множества наложились друг на друга — общая часть. Второй и третий варианты говорят одно и то же, и оба — определение «или»: там достаточно, чтобы число выполняло одно условие, и на оси части объединяются, а не пересекаются. | Correct. "And" means both conditions must hold AT ONCE, so a number has to fall into both answers. On the axis that is the part where the two sets overlap — the common part. The second and third options say the same thing, and both are the definition of "or": there it is enough for a number to satisfy one condition, and on the axis the parts unite rather than intersect. |
| `text` | Bu «yoki» ning ta'rifi. Sistemada esa «va» turibdi: son ikkala tengsizlikni ham qanoatlantirishi kerak. Sonlarda tekshirib ko'ring: iks noldan katta va iks minus beshdan kichik bo'lgan son bormi? | Это определение «или». А в системе стоит «и»: число должно удовлетворять обоим неравенствам. Проверь на числах: есть ли число, которое больше нуля и меньше минус пяти? | That is the definition of "or". But a system holds "and": a number must satisfy both inequalities. Check on numbers: is there a number greater than zero and less than minus five? |
| `text` | Ikkinchi tengsizlik ham shart, u shunchaki turib qolmagan. Faqat birinchisini olsak, uning javobidagi ko'p sonlar ikkinchi shartga zid bo'lib chiqadi. | Второе неравенство — тоже условие, оно стоит там не просто так. Взяв только первое, получим в ответе много чисел, противоречащих второму условию. | The second inequality is a condition too, it is not there for decoration. Taking only the first leaves many numbers in the answer that break the second condition. |
| `wrongText` | «Va» so'zini so'zma-so'z o'qing: son birinchi shartni bajarsin VA ikkinchisini ham bajarsin. Bittasi yetarli emas. | Прочитай слово «и» буквально: число выполняет первое условие И выполняет второе. Одного недостаточно. | Read the word "and" literally: a number satisfies the first condition AND satisfies the second. One is not enough. |

---

## 02 · `TrueFalse` · 🟢 · teg `chegara-turini-notogri-kochirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Sistemaning ikkita chegarasi har xil turda: bittasi qat'iy, ikkinchisi qat'iy emas. | У системы две границы разного типа: одна строгая, другая нестрогая. | The system has two boundaries of different kinds: one strict, one non-strict. |
| `ask` | Har bir son uchun «Ha» yoki «Yo'q» ni tanlang: u sistemaning yechimimi? | Для каждого числа выбери «Да» или «Нет»: оно решение системы? | For each number choose "Yes" or "No": is it a solution of the system? |
| `givenLabel` | Sistema | Система | System |
| `claim` | — sistemaning yechimi. | — решение системы. | is a solution of the system. |
| `claim` | — sistemaning yechimi. | — решение системы. | is a solution of the system. |
| `claim` | — sistemaning yechimi. | — решение системы. | is a solution of the system. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. Nol ikkala shartni ham bajaradi: nol minus to'rtdan katta, va nol uchdan kichik. Uch ham yechim, chunki ikkinchi belgi qat'iy EMAS: uch uchga teng bo'lishi mumkin. Minus to'rt esa yechim emas: birinchi belgi QAT'IY, ya'ni minus to'rtdan qat'iy katta bo'lishi kerak, o'zi kirmaydi. Bitta sistemada ikkita chegara har xil turda bo'lishi mumkin, va ularni aralashtirib yubormaslik kerak. | Верно. Нуль выполняет оба условия: нуль больше минус четырёх и нуль меньше трёх. Тройка тоже решение, ведь второй знак НЕстрогий: икс может быть равен трём. А минус четыре решением не является: первый знак СТРОГИЙ, то есть икс должен быть строго больше минус четырёх, сама граница не входит. В одной системе границы бывают разного типа, и путать их нельзя. | Correct. Zero satisfies both conditions: zero is greater than minus four, and zero is less than three. Three is a solution too, since the second sign is NON-strict: x may equal three. But minus four is not: the first sign is STRICT, so x must be strictly greater than minus four, and the boundary itself is out. In one system the two boundaries may be of different kinds, and they must not be mixed up. |
| `text` | Ikkinchi belgi «kichik YOKI TENG», ya'ni uchning o'zi ham bo'lishi mumkin. Uchni ikkala shartga qo'yib ko'ring: uch minus to'rtdan katta, va uch uchga teng — ikkalasi ham bajariladi. | Второй знак «меньше ИЛИ РАВНО», то есть сама тройка возможна. Подставь три в оба условия: три больше минус четырёх, и три равно трём — оба выполнены. | The second sign is "less than OR EQUAL", so three itself is allowed. Put three into both conditions: three is greater than minus four, and three equals three — both hold. |
| `text` | Birinchi belgi qat'iy: iks minus to'rtdan KATTA bo'lishi kerak, teng bo'lishi mumkin emas. Minus to'rtning o'zi javobga kirmaydi. | Первый знак строгий: икс должен быть БОЛЬШЕ минус четырёх, равным быть не может. Само минус четыре в ответ не входит. | The first sign is strict: x must be GREATER than minus four, it cannot be equal. Minus four itself is not in the answer. |
| `text` | Nolni ikkala tengsizlikka qo'yib ko'ring: nol minus to'rtdan kattami? Ha. Nol uchdan kichikmi? Ha. Ikkalasi ham bajarilsa, son yechim bo'ladi. | Подставь нуль в оба неравенства: нуль больше минус четырёх? Да. Нуль меньше трёх? Да. Если выполнены оба, число — решение. | Put zero into both inequalities: is zero greater than minus four? Yes. Is zero less than three? Yes. If both hold, the number is a solution. |
| `wrongText` | Har bir sonni IKKALA tengsizlikka alohida qo'yib ko'ring va belgining turiga qarang: «katta» bilan «katta yoki teng» boshqa narsa. | Подставляй каждое число в ОБА неравенства по отдельности и смотри на тип знака: «больше» и «больше или равно» — разные вещи. | Put each number into BOTH inequalities separately and mind the kind of sign: "greater than" and "greater than or equal" are different things. |

---

## 03 · `RowTable` · 🟢 · teg `faqat-bitta-tengsizlikni-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Sistemaning bitta tengsizligi shu ifodadan tuzilgan. Jadval uning chegarasini topishga yordam beradi. | Одно неравенство системы составлено из этого выражения. Таблица помогает найти его границу. | One inequality of the system is built from this expression. The table helps find its boundary. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri: nol uchda chiqadi, beshda esa qiymat to'rt. Demak ikki iks minus olti uchdan chapda manfiy, uchdan o'ngda musbat, va uchning o'zida nol — «katta yoki teng» tengsizligining javobi shu yerdan boshlanadi. Lekin bu hali SISTEMANING javobi emas: ikkinchi tengsizlik ham tekshirilishi kerak, va u chegarani o'ngdan yoki chapdan qisqartirishi mumkin. | Верно: нуль выходит при трёх, а при пяти значение четыре. Значит два икс минус шесть отрицательно левее трёх, положительно правее и равно нулю в самой тройке — отсюда и начинается ответ неравенства «больше или равно». Но это ещё не ответ СИСТЕМЫ: второе неравенство тоже надо проверить, и оно может урезать границу справа или слева. | Correct: zero comes at three, and at five the value is four. So two x minus six is negative left of three, positive to the right, and zero at three itself — that is where the answer of a "greater than or equal" inequality begins. But this is not the answer of the SYSTEM yet: the second inequality must be checked too, and it may cut the range from the right or the left. |
| `text` | Oltini ikkiga bo'lish qadami tushib qolgan. Ikki iks minus olti nolga teng bo'lsa, ikki iks oltiga teng, ya'ni iks uch. | Пропущен шаг деления шести на два. Если два икс минус шесть равно нулю, то два икса равны шести, значит икс равен трём. | The step of dividing six by two was skipped. If two x minus six is zero, then two x is six, so x is three. |
| `text` | Nol pastki qatorda turibdi — bu ifodaning QIYMATI. Yuqori qatorda esa shu qiymatni beradigan iks so'ralyapti. | Нуль стоит в нижней строке — это ЗНАЧЕНИЕ выражения. А в верхней строке спрашивают икс, дающий это значение. | The zero sits in the bottom row — that is the VALUE of the expression. The top row asks for the x that gives that value. |
| `text` | Ozod had tushib qolgan. Ikki karra besh o'n, lekin undan yana oltini ayirish kerak: o'n minus olti to'rt. | Потерян свободный член. Дважды пять — десять, но из него надо ещё вычесть шесть: десять минус шесть — четыре. | The constant term was dropped. Two times five is ten, but six must still be subtracted: ten minus six is four. |
| `text` | Beshda qiymatni o'zingiz hisoblang: ikki karra besh o'n, o'n minus olti to'rt — musbat son. | Посчитай значение при пяти сам: дважды пять — десять, десять минус шесть — четыре, положительное число. | Compute the value at five yourself: two times five is ten, ten minus six is four, a positive number. |
| `wrongText` | Har katakda formulani ishlatib ko'ring: iks berilgan bo'lsa, ikkiga ko'paytirib oltini ayiring; igrek berilgan bo'lsa, teskari yo'lda yuring. | В каждой клетке применяй формулу: если дан икс, умножь на два и вычти шесть; если дан игрек, иди обратным путём. | Use the formula in each cell: given x, multiply by two and subtract six; given y, work backwards. |

---

## 04 · `Zones` · 🟡 · teg `faqat-bitta-tengsizlikni-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Har bir sonni sistemaning IKKALA tengsizligiga ham qo'yib ko'ring. | Подставь каждое число в ОБА неравенства системы. | Put each number into BOTH inequalities of the system. |
| `ask` | Sonni bosing, keyin guruhni bosing. | Нажми число, потом нажми группу. | Tap a number, then tap a group. |
| `givenLabel` | Sistema | Система | System |
| `label` | Sistemaning yechimi | Решение системы | A solution of the system |
| `label` | Faqat birinchisini | Только первому | Only the first |
| `label` | Faqat ikkinchisini | Только второму | Only the second |
| `correctText` | To'g'ri. Nol va to'rt ikkala shartni ham bajaradi — bular sistemaning yechimlari. Besh va sakkiz minus ikkidan katta, lekin beshdan kichik emas: beshning o'zi ham kirmaydi, chunki ikkinchi belgi qat'iy. Minus uch va minus yetti esa beshdan kichik, lekin minus ikkidan kichik bo'lib qolgan. Ikkinchi va uchinchi guruhning borligi darsning butun gapi: bitta tengsizlikni tekshirish yetmaydi. | Верно. Нуль и четыре выполняют оба условия — это решения системы. Пять и восемь больше минус двух, но не меньше пяти: сама пятёрка тоже не входит, ведь второй знак строгий. А минус три и минус семь меньше пяти, но оказались меньше минус двух. Существование второй и третьей группы и есть весь смысл урока: проверить одно неравенство недостаточно. | Correct. Zero and four satisfy both conditions — they are solutions of the system. Five and eight are greater than minus two but not less than five: five itself is out too, since the second sign is strict. And minus three and minus seven are less than five but turned out to be below minus two. The very existence of the second and third groups is the whole point of the lesson: checking one inequality is not enough. |
| `text` | Bu sonlar birinchi shartni bajaradi, lekin ikkinchisini yo'q: ular beshdan kichik emas. Beshning o'zi ham yechim emas, chunki belgi qat'iy — «kichik», «kichik yoki teng» emas. | Эти числа выполняют первое условие, но не второе: они не меньше пяти. Сама пятёрка тоже не решение, ведь знак строгий — «меньше», а не «меньше или равно». | These numbers satisfy the first condition but not the second: they are not less than five. Five itself is not a solution either, since the sign is strict — "less than", not "less than or equal". |
| `text` | Bu sonlar ikkinchi shartni bajaradi, lekin birinchisini yo'q: minus uch minus ikkidan KICHIK. Sonlar o'qida manfiy sonlar chapga qarab kichrayadi. | Эти числа выполняют второе условие, но не первое: минус три МЕНЬШЕ минус двух. На числовой оси отрицательные числа убывают влево. | These numbers satisfy the second condition but not the first: minus three is LESS than minus two. On the number line negative numbers get smaller to the left. |
| `text` | Nolni va to'rtni ikkala shartga qo'yib ko'ring: ikkalasi ham minus ikkidan katta va ikkalasi ham beshdan kichik. Demak ular sistemaning yechimlari. | Подставь нуль и четыре в оба условия: оба больше минус двух и оба меньше пяти. Значит они решения системы. | Put zero and four into both conditions: both are greater than minus two and both less than five. So they are solutions of the system. |
| `text` | Guruhlar almashib ketdi. Birinchi shart — iks minus ikkidan katta yoki teng, ikkinchisi — iks beshdan kichik. Har sonni ikkalasiga alohida qo'yib chiqing. | Группы перепутаны. Первое условие — икс больше или равен минус двум, второе — икс меньше пяти. Подставь каждое число в оба по очереди. | The groups got swapped. The first condition is x greater than or equal to minus two, the second is x less than five. Put each number into both in turn. |
| `wrongText` | Har son uchun ikkita tekshiruv qiling: u minus ikkidan katta yoki tengmi, va beshdan kichikmi? Ikkalasi ham «ha» bo'lsa — birinchi guruh. | Для каждого числа делай две проверки: больше или равно минус двум, и меньше пяти? Если оба «да» — первая группа. | Make two checks for each number: is it at least minus two, and is it less than five? Both "yes" — the first group. |

---

## 05 · `TypeSet` · 🟡 · teg `faqat-bitta-tengsizlikni-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Butun sonlar | Целые числа | Whole numbers |
| `setup` | Birinchi tengsizlik oraliq beradi, ikkinchisi uni chapdan qisqartiradi. | Первое неравенство даёт промежуток, второе урезает его слева. | The first inequality gives an interval, the second cuts it from the left. |
| `ask` | Sistemani qanoatlantiruvchi BARCHA butun sonlarni yozing. | Запиши ВСЕ целые числа, удовлетворяющие системе. | Write down ALL whole numbers satisfying the system. |
| `hint` | Nuqta-vergul bilan ajrating. | Раздели точкой с запятой. | Separate them with semicolons. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri: ikki va uch. Birinchi tengsizlik iks kvadrat o'n oltidan kichik deydi, ya'ni iks minus to'rt bilan to'rt orasida. Ikkinchisi chap chegarani ko'taradi: iks birdan katta. Umumiy qism birdan to'rtgacha, va ikkala chegara ham QAT'IY, shuning uchun bir ham, to'rt ham kirmaydi. Oraliqda faqat ikkita butun son qoladi. | Верно: два и три. Первое неравенство говорит, что икс в квадрате меньше шестнадцати, то есть икс между минус четырьмя и четырьмя. Второе поднимает левую границу: икс больше единицы. Общая часть — от единицы до четырёх, и обе границы СТРОГИЕ, поэтому ни единица, ни четвёрка не входят. В промежутке остаются только два целых числа. | Correct: two and three. The first inequality says x squared is less than sixteen, so x lies between minus four and four. The second lifts the left boundary: x is greater than one. The common part runs from one to four, and both boundaries are STRICT, so neither one nor four is included. Only two whole numbers remain in the interval. |
| `text` | Chegara sonining o'zi qo'shilgan, lekin ikkala belgi ham qat'iy. To'rtni birinchi tengsizlikka qo'ying: o'n olti minus o'n olti nol, nol esa noldan kichik emas. Birni ikkinchisiga qo'ying: bir birdan katta emas. | Добавлено само граничное число, но оба знака строгие. Подставь четыре в первое неравенство: шестнадцать минус шестнадцать — нуль, а нуль не меньше нуля. Подставь один во второе: один не больше одного. | A boundary number itself was added, but both signs are strict. Put four into the first inequality: sixteen minus sixteen is zero, and zero is not less than zero. Put one into the second: one is not greater than one. |
| `text` | Ikkinchi tengsizlik unutildi. Bu sonlar minus to'rt bilan to'rt orasida, lekin birdan katta emas — ular faqat BIRINCHI shartni bajaradi. | Второе неравенство забыто. Эти числа лежат между минус четырьмя и четырьмя, но не больше единицы — они выполняют только ПЕРВОЕ условие. | The second inequality was forgotten. These numbers lie between minus four and four but are not greater than one — they satisfy only the FIRST condition. |
| `text` | Birinchi tengsizlik unutildi. Beshni qo'ying: yigirma besh minus o'n olti to'qqiz, to'qqiz esa noldan kichik emas. Bu sonlar faqat IKKINCHI shartni bajaradi. | Первое неравенство забыто. Подставь пять: двадцать пять минус шестнадцать — девять, а девять не меньше нуля. Эти числа выполняют только ВТОРОЕ условие. | The first inequality was forgotten. Put five in: twenty-five minus sixteen is nine, and nine is not less than zero. These numbers satisfy only the SECOND condition. |
| `text` | Bitta son yozildi. Oraliqda undan boshqa butun son ham bor: birdan to'rtgacha oraliqni sanab chiqing. | Записано одно число. В промежутке есть и другое целое: пересчитай промежуток от единицы до четырёх. | One number was written. There is another whole number in the interval: count through the range from one to four. |
| `text` | O'n olti — ozod had, javob emas. Iks kvadrat o'n oltidan kichik bo'lsa, iksning o'zi minus to'rt bilan to'rt orasida. | Шестнадцать — свободный член, а не ответ. Если икс в квадрате меньше шестнадцати, то сам икс между минус четырьмя и четырьмя. | Sixteen is the constant term, not an answer. If x squared is less than sixteen, then x itself lies between minus four and four. |
| `wrongText` | Avval har bir tengsizlikni alohida yeching: birinchisi minus to'rtdan to'rtgacha, ikkinchisi birdan o'ngga. Umumiy qismini oling va undagi butun sonlarni sanab chiqing. | Сначала реши каждое неравенство отдельно: первое — от минус четырёх до четырёх, второе — правее единицы. Возьми общую часть и пересчитай в ней целые числа. | Solve each inequality separately first: the first from minus four to four, the second right of one. Take the common part and count the whole numbers in it. |

---

## 06 · `DomainAxis` · 🟡 · teg `chegara-turini-notogri-kochirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Har bir tengsizlik alohida yechilgan. Endi ikkalasini bitta o'qqa qo'yib, umumiy qismini olish kerak. | Каждое неравенство уже решено. Теперь надо нанести оба на одну ось и взять общую часть. | Each inequality is already solved. Now both must go on one axis and the common part taken. |
| `ask` | Sistemaning javobini o'qda ko'rsating. | Покажи на оси ответ системы. | Show the answer of the system on the axis. |
| `givenLabel` | Sistema | Система | System |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri: birdan yettigacha, chap chegara bo'yalgan, o'ng chegara bo'sh. Chegaraning turi u QAYSI tengsizlikdan kelganiga qarab belgilanadi: bir birinchi tengsizlikdan keldi, u qat'iy emas, demak bir javobga kiradi; yetti ikkinchisidan keldi, u qat'iy, demak yetti kirmaydi. Ikkala nuqtani bir xil qilib qo'yish eng ko'p uchraydigan xato — chegaralar bir-biridan mustaqil. | Верно: от единицы до семи, левая граница закрашена, правая пустая. Тип границы определяется тем, из КАКОГО неравенства она пришла: единица пришла из первого, а он нестрогий, значит единица входит; семь пришла из второго, а он строгий, значит семь не входит. Сделать обе точки одинаковыми — самая частая ошибка: границы независимы друг от друга. | Correct: from one to seven, the left boundary filled, the right hollow. The kind of a boundary is decided by WHICH inequality it came from: one came from the first, which is non-strict, so one is included; seven came from the second, which is strict, so seven is out. Making both points the same is the most common mistake — the boundaries are independent of each other. |
| `text` | Ikkala nuqta ham bo'sh qo'yilgan. Birinchi belgi «katta YOKI TENG», ya'ni bir javobga kiradi va uning nuqtasi bo'yalgan bo'lishi kerak. | Обе точки поставлены пустыми. Первый знак «больше ИЛИ РАВНО», то есть единица входит, и её точка должна быть закрашена. | Both points were left hollow. The first sign is "greater than OR EQUAL", so one is included and its point must be filled. |
| `text` | Ikkala nuqta ham bo'yalgan. Ikkinchi belgi qat'iy: iks yettidan KICHIK, teng bo'lishi mumkin emas — yettining nuqtasi bo'sh bo'lishi kerak. | Обе точки закрашены. Второй знак строгий: икс МЕНЬШЕ семи, равным быть не может — точка семи должна быть пустой. | Both points were filled. The second sign is strict: x is LESS than seven, it cannot be equal — the point at seven must be hollow. |
| `text` | Chegaralarning turi almashib ketdi. Bir qat'iy EMAS tengsizlikdan keldi — bo'yalgan; yetti QAT'IY tengsizlikdan keldi — bo'sh. | Типы границ перепутаны. Единица пришла из НЕстрогого неравенства — закрашена; семь пришла из СТРОГОГО — пустая. | The boundary kinds got swapped. One came from the NON-strict inequality — filled; seven came from the STRICT one — hollow. |
| `text` | Chegaralar tengsizliklardan olinadi, o'qning chetidan emas. Bittasi bir, ikkinchisi yetti. | Границы берут из неравенств, а не с краёв оси. Одна — единица, другая — семь. | Boundaries come from the inequalities, not from the ends of the axis. One is one, the other seven. |
| `text` | Ikkala yechimni o'qda ustma-ust qo'ying: birinchisi birdan o'ngga, ikkinchisi yettidan chapga. Ular ustma-ust tushgan qism javob bo'ladi, va uning chegaralari bir bilan yetti. | Наложи два решения на оси: первое — правее единицы, второе — левее семи. Часть, где они наложились, и есть ответ, а её границы — единица и семь. | Lay the two solutions over each other on the axis: the first right of one, the second left of seven. Where they overlap is the answer, and its boundaries are one and seven. |
| `wrongText` | Ikkala tengsizlikning chegaralarini o'qqa qo'ying va har birining turini O'Z tengsizligidan oling: qat'iy belgi bo'sh nuqta, qat'iy emas belgi bo'yalgan nuqta beradi. | Нанеси границы обоих неравенств на ось и тип каждой возьми из ЕГО неравенства: строгий знак даёт пустую точку, нестрогий — закрашенную. | Put the boundaries of both inequalities on the axis and take each kind from ITS OWN inequality: a strict sign gives a hollow point, a non-strict one a filled point. |

---

## 07 · `PlacePoint` · 🟡 · teg `faqat-bitta-tengsizlikni-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Uzluksiz chiziq va punktir parabola chizilgan. | Построены сплошная прямая и пунктирная парабола. | A solid line and a dashed parabola are drawn. |
| `ask` | Ikkala grafikning Ox bilan kesishgan BARCHA nuqtalarini qo'ying. | Поставь ВСЕ точки, где оба графика пересекают Ox. | Place ALL the points where the two graphs cross Ox. |
| `correctText` | To'g'ri, uchta nuqta. Parabola Ox ni minus ikkida va ikkida kesib o'tadi — bu iks kvadrat minus to'rt tengsizligining chegaralari; chiziq esa minus birda — bu iks qo'shuv bir tengsizligining chegarasi. Uchala son sistemaning javobini bo'lib chiqadi. Faqat parabolaning nuqtalarini olsak, chiziqning chegarasi tushib qoladi va javob noto'g'ri bo'lib chiqadi. | Верно, три точки. Парабола пересекает Ox при минус двух и двух — это границы неравенства с икс в квадрате минус четыре; а прямая — при минус одном, это граница неравенства икс плюс один. Все три числа и разбивают ответ системы. Если взять только точки параболы, граница прямой потеряется и ответ выйдет неверным. | Correct, three points. The parabola crosses Ox at minus two and two — the boundaries of the inequality with x squared minus four; and the line at minus one, the boundary of the x plus one inequality. All three numbers cut up the answer of the system. Taking only the parabola points loses the boundary of the line, and the answer comes out wrong. |
| `text` | Chiziqning chegarasi tushib qoldi: uzluksiz chiziq ham Ox ni kesib o'tadi. Chizmada u qayerda o'qni kesib o'tganiga qarang — parabolaning ikki nuqtasidan tashqari yana bittasi bor. | Граница прямой потеряна: сплошная прямая тоже пересекает Ox. Посмотри на чертёж, где именно — кроме двух точек параболы есть ещё одна. | The boundary of the line was lost: the solid line crosses Ox as well. Look at the drawing to see where — besides the two parabola points there is one more. |
| `text` | Bu nuqtalar grafiklarning Oy bilan kesishishi, Ox bilan emas. Ox bilan kesishishda IGREK nolga teng. | Это точки пересечения графиков с Oy, а не с Ox. При пересечении с Ox ИГРЕК равен нулю. | These are where the graphs meet Oy, not Ox. At a crossing with Ox, Y equals zero. |
| `text` | Bu son ildiz emas. Har bir grafikni alohida nolga tenglashtiring: iks kvadrat minus to'rt nolga teng, va iks qo'shuv bir nolga teng. | Это число не корень. Приравняй каждый график к нулю по отдельности: икс в квадрате минус четыре равно нулю, и икс плюс один равно нулю. | That number is not a root. Set each graph to zero separately: x squared minus four equals zero, and x plus one equals zero. |
| `wrongText` | Chizmada ikkala egri chiziqni alohida kuzatib boring: har biri Ox ni qayerda kesib o'tadi? Parabola ikki joyda, chiziq bir joyda. | Проследи на чертеже за каждой линией по отдельности: где каждая пересекает Ox? Парабола в двух местах, прямая в одном. | Follow each curve separately on the drawing: where does each cross Ox? The parabola in two places, the line in one. |

---

## 08 · `OrderLines` · 🔴 · teg `kesishma-emas-birlashma-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Tengsizliklar sistemasini yechishning beshta qadami aralashtirilgan. | Пять шагов решения системы неравенств перемешаны. | Five steps of solving a system of inequalities are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Sistema | Система | System |
| `label` | Har bir tengsizlikni ALOHIDA yechamiz | Решаем каждое неравенство ОТДЕЛЬНО | Solve each inequality SEPARATELY |
| `label` | Birinchisi: | Первое: | The first: |
| `label` | Ikkinchisi: | Второе: | The second: |
| `label` | Ikkala yechimni bitta o'qqa qo'yib, umumiy qismini olamiz | Наносим оба решения на одну ось и берём общую часть | Put both solutions on one axis and take the common part |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Sistemaning yechimi bir yo'la topilmaydi: avval har bir tengsizlik alohida yechiladi, keyin ikkala javob bitta o'qqa qo'yiladi va ustma-ust tushgan qism olinadi. Javobdagi chegaralar ikki xil turda, va bu tasodif emas: ikki ikkinchi tengsizlikdan keldi, u qat'iy emas, shuning uchun kiradi; besh birinchisidan keldi, u qat'iy, shuning uchun kirmaydi. | Верно. Решение системы не находится сразу: сначала каждое неравенство решают отдельно, потом оба ответа наносят на одну ось и берут наложившуюся часть. Границы в ответе разного типа, и это не случайность: двойка пришла из второго неравенства, оно нестрогое, поэтому входит; пятёрка — из первого, оно строгое, поэтому не входит. | Correct. The solution of a system is not found in one go: each inequality is solved separately first, then both answers go on one axis and the overlapping part is taken. The boundaries in the answer are of different kinds, and that is no accident: two came from the second inequality, which is non-strict, so it is included; five came from the first, which is strict, so it is out. |
| `text` | Umumiy qismni nimadan olamiz, agar tengsizliklardan hech bo'lmasa bittasi hali yechilmagan bo'lsa? Avval ikkala javob ham tayyor bo'lishi kerak. | Из чего брать общую часть, если хотя бы одно неравенство ещё не решено? Сначала должны быть готовы оба ответа. | What would you take the common part of if at least one inequality is not solved yet? Both answers must be ready first. |
| `text` | Javob umumiy qismni olishdan keyin yoziladi. Ikkita alohida javob hali sistemaning javobi emas. | Ответ пишут после того, как взята общая часть. Два отдельных ответа — ещё не ответ системы. | The answer is written after the common part is taken. Two separate answers are not yet the answer of the system. |
| `text` | Yechimlar o'z-o'zidan paydo bo'lmaydi: birinchi qadam — har bir tengsizlikni alohida yechishga qaror qilish. | Решения не появляются сами: первый шаг — решить каждое неравенство отдельно. | The solutions do not appear by themselves: the first step is to solve each inequality on its own. |
| `text` | Tengsizliklar sistemada yozilgan tartibda yechiladi: avval birinchisi, keyin ikkinchisi. Javob o'zgarmaydi, lekin yozuv o'qilishi kerak. | Неравенства решают в том порядке, в каком они записаны в системе: сначала первое, потом второе. Ответ не изменится, но запись должна читаться. | The inequalities are solved in the order they are written in the system: the first, then the second. The answer does not change, but the record must read cleanly. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: umumiy qismni olish uchun ikkala yechim ham tayyor bo'lishi kerakmi? | Прочитай цепочку сверху вниз: нужны ли готовыми оба решения, чтобы взять общую часть? | Read the chain from top to bottom: must both solutions be ready before the common part can be taken? |

---

## 09 · `ClozeBank` · 🔴 · teg `kesishma-emas-birlashma-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta ibora tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три выражения выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three phrases fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Sistemaning yechimi —  | Решение системы — это числа, которые удовлетворяют | The solution of a system is the numbers that satisfy |
| `text` | qanoatlantiradigan sonlar, ya'ni ikki yechimning | , то есть | , that is, the |
| `text` | . Umumiy qism topilmasa, sistemaning | двух решений. Если общей части нет, то | of the two solutions. If there is no common part, |
| `text` | . | . | . |
| `label` | ikkalasini birga | обоим сразу | both at once |
| `label` | umumiy qismi | общая часть | common part |
| `label` | yechimi yo'q | решений нет | it has no solution |
| `label` | bittasini bo'lsa ham | хотя бы одному | just one of them |
| `label` | birlashmasi | объединение | union |
| `label` | javobi barcha sonlar | подходит любое число | any number works |
| `correctText` | To'g'ri, uchala ibora ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: «va» ikkala shartni bir vaqtda talab qiladi, ya'ni son ikkala javobga ham tushishi kerak; o'qda bu ikki to'plamning umumiy qismi bo'ladi, birlashmasi emas; va umumiy qism topilmasa, sistemaning yechimi yo'q — bu ham to'liq javob, xato emas. | Верно, все три выражения на месте. Правило собирает в одно предложение три дела урока: «и» требует оба условия одновременно, то есть число должно попасть в оба ответа; на оси это общая часть двух множеств, а не их объединение; а если общей части нет, у системы нет решений — это тоже полноценный ответ, а не ошибка. | Correct, all three phrases are in place. The rule gathers the three jobs of the lesson into one sentence: "and" demands both conditions at once, so a number must fall into both answers; on the axis that is the common part of the two sets, not their union; and if there is no common part, the system has no solution — which is a complete answer, not a mistake. |
| `text` | «Hech bo'lmasa bittasi» — bu «yoki» ning ta'rifi. Sistemada esa «va» turibdi: ikkala shart ham bir vaqtda bajarilishi kerak. | «Хотя бы одному» — это определение «или». А в системе стоит «и»: оба условия должны выполняться одновременно. | "At least one" is the definition of "or". But a system holds "and": both conditions must hold at once. |
| `text` | Birlashma «yoki» ga tegishli: u ikkala qismni ham oladi. Sistemada esa faqat ustma-ust tushgan qism qoladi, ya'ni umumiy qism. | Объединение относится к «или»: оно берёт обе части. А в системе остаётся только наложившаяся часть, то есть общая. | A union belongs to "or": it takes both parts. In a system only the overlapping part is left, that is, the common part. |
| `text` | Umumiy qism yo'q bo'lsa, hech bir son ikkala shartni bir vaqtda bajarmaydi — demak yechim yo'q. «Barcha sonlar» esa teskari hol. | Если общей части нет, ни одно число не выполняет оба условия одновременно — значит решений нет. А «любое число» — противоположный случай. | If there is no common part, no number satisfies both conditions at once — so there is no solution. "Any number" is the opposite case. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi son nechta shartni bajarishi haqida, ikkinchisi o'qda nima olinishi haqida, uchinchisi esa umumiy qism yo'q bo'lgan hol haqida. | Проверяй каждую клетку самим предложением: первая про то, скольким условиям отвечает число, вторая про то, что берут на оси, третья про случай, когда общей части нет. | Check each blank against the sentence itself: the first is about how many conditions a number meets, the second about what is taken on the axis, the third about the case with no common part. |

---

## 10 · `AuditLines` · 🔴 · teg `kesishma-yoq-holatni-tanimaslik`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Sistema yechilgan. Har bir tengsizlik to'g'ri yechilgan, xato keyinroq. | Система решена. Каждое неравенство решено верно, ошибка позже. | The system was solved. Each inequality is solved correctly, the error comes later. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Sistema | Система | System |
| `text` | Birinchi yechim: | Первое решение: | First solution: |
| `text` | Ikkinchi yechim: | Второе решение: | Second solution: |
| `text` | Umumiy qism: | Общая часть: | Common part: |
| `text` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri, xato uchinchi qatorda. U yerda umumiy qism o'rniga BIRLASHMA yozilgan: «yoki» ikkala qismni ham oladi, sistema esa «va» talab qiladi. Ikkala yechimni bitta o'qqa qo'yib ko'ring: bittasi minus birdan chapda, ikkinchisi ikkidan o'ngda — ular ustma-ust tushmaydi. Bir vaqtda minus birdan kichik va ikkidan katta bo'lgan son yo'q, demak sistemaning yechimi yo'q. Bu ham to'liq javob. | Верно, ошибка в третьей строке. Там вместо общей части записано ОБЪЕДИНЕНИЕ: «или» берёт обе части, а система требует «и». Нанеси оба решения на одну ось: одно левее минус одного, другое правее двух — они не накладываются. Числа, которое одновременно меньше минус одного и больше двух, не существует, значит у системы нет решений. Это тоже полноценный ответ. | Correct, the error is in the third line. A UNION was written there instead of the common part: "or" takes both pieces, while a system demands "and". Put both solutions on one axis: one lies left of minus one, the other right of two — they do not overlap. There is no number that is at once less than minus one and greater than two, so the system has no solution. That too is a complete answer. |
| `text` | Bu qator to'g'ri: birinchi tengsizlik shundayligicha yozilgan, uni yechish ham kerak emas edi. | Эта строка верна: первое неравенство переписано как есть, решать его и не требовалось. | This line is right: the first inequality is written as it stands, it needed no solving. |
| `text` | Bu ham to'g'ri: ikkinchi tengsizlik ham tayyor ko'rinishda berilgan. Keyingi qatorga qarang — ikkala yechimdan umumiy qism to'g'ri olinganmi? | Эта тоже верна: второе неравенство тоже дано в готовом виде. Посмотри на следующую строку: верно ли взята общая часть? | This one is right too: the second inequality is given ready-made as well. Look at the next line — was the common part taken correctly? |
| `text` | To'rtinchi qator xato, lekin u BIRINCHI xato emas: u uchinchisining natijasini ko'chirgan. Xato umumiy qism olingan joyda paydo bo'lgan. | Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она переписала результат третьей. Ошибка возникла там, где брали общую часть. | The fourth line is wrong, but it is not the FIRST error: it copied the result of the third. The error arose where the common part was taken. |
| `wrongText` | Bitta son o'ylab ko'ring: u bir vaqtda minus birdan kichik va ikkidan katta bo'lishi mumkinmi? Agar bunday son topilmasa, yozuvdagi javob to'g'ri bo'lolmaydi. | Придумай одно число: может ли оно быть одновременно меньше минус одного и больше двух? Если такого нет, ответ в записи верным быть не может. | Think of one number: can it be at once less than minus one and greater than two? If no such number exists, the recorded answer cannot be right. |

