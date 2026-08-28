# DARS06_AMALIYOT_KONTENT — 9-sinf, 6-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars06/D06_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `TrueFalse` · 🟢 · teg `javob-doim-tashqi-oraliq`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Tengsizlik berilgan, uch mulohaza esa uning javobi haqida. | Дано неравенство, а три суждения — про его ответ. | An inequality is given, and three claims are about its answer. |
| `ask` | Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Berilgan | Дано | Given |
| `claim` | javob shu oraliq. | ответ — этот промежуток. | the answer is this interval. |
| `claim` | javob shu ikki nurdan iborat. | ответ состоит из этих двух лучей. | the answer is these two rays. |
| `claim` | chegara nuqtalari javobga kiradi. | граничные точки входят в ответ. | the boundary points belong to the answer. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri, uchtasi ham. Tarmoqlar yuqoriga qaragan, demak parabola nollar ORASIDA Ox dan pastda turadi — aynan shu yerda ko'paytma manfiy. Tengsizlik qat'iy bo'lgani uchun ikki va olti javobga kirmaydi: u yerda ko'paytma nolga teng, nol esa manfiy emas. | Верно, все три. Ветви направлены вверх, значит МЕЖДУ нулями парабола лежит ниже Ox — именно там произведение отрицательно. Неравенство строгое, поэтому двойка и шестёрка в ответ не входят: там произведение равно нулю, а нуль не отрицателен. | Correct, all three. The branches point up, so BETWEEN the zeros the parabola lies below Ox — that is exactly where the product is negative. The inequality is strict, so two and six do not belong: there the product is zero, and zero is not negative. |
| `text` | Uchni qo'yib ko'ring: bir ko'paytiruv minus uch, ya'ni manfiy. Uch esa ikki bilan olti orasida turibdi. | Подставь тройку: один умножить на минус три, то есть отрицательно. А тройка стоит между двойкой и шестёркой. | Try three: one times minus three, which is negative. And three lies between two and six. |
| `text` | Yettini qo'ying: besh ko'paytiruv bir, ya'ni musbat. Nollardan tashqarida ko'paytma manfiy emas, demak u yer javobga kirmaydi. | Подставь семь: пять умножить на один, то есть положительно. Вне нулей произведение не отрицательно, значит туда ответ не заходит. | Try seven: five times one, which is positive. Outside the zeros the product is not negative, so the answer does not reach there. |
| `text` | Ikkini qo'ying: birinchi qavs nolga aylanadi va ko'paytma nol chiqadi. Tengsizlikda esa qat'iy kichik turibdi — nol bunga to'g'ri kelmaydi. | Подставь двойку: первая скобка обращается в нуль и произведение равно нулю. А в неравенстве стоит строгое «меньше» — нуль ему не годится. | Try two: the first bracket becomes zero and the product is zero. The inequality asks for strictly less — zero does not fit. |
| `wrongText` | Uchta sonni sinang: nollar orasidan bittasini, nollardan tashqaridan bittasini va nolning o'zini. Har birida ko'paytmaning ishorasini yozing. | Испытай три числа: одно между нулями, одно вне нулей и сам нуль. Для каждого выпиши знак произведения. | Test three numbers: one between the zeros, one outside them, and a zero itself. Write down the sign of the product for each. |

---

## 02 · `RowTable` · 🟢 · teg `belgi-almashtirish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Yuqori qator — argument, pastki qator — qiymat. Jadval ko'paytmadan to'ldiriladi. | Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по произведению. | The top row is the argument, the bottom row is the value. The table is filled from the product. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Minus to'qqiz faqat bitta joyda, ikkida chiqadi — bu uchi. Nol esa ikki joyda: minus birda va beshda, bular nollar. Jadvalda ishora ikki marta almashadi: minus birgacha musbat, oraliqda manfiy, beshdan keyin yana musbat. | Верно. Минус девять получается только в одном месте, при двух — это вершина. А нуль в двух: при минус единице и при пяти, это нули. В таблице знак меняется дважды: до минус единицы положительно, между — отрицательно, после пяти снова положительно. | Correct. Minus nine appears in one place only, at two — that is the vertex. Zero appears at two places: at minus one and at five, those are the zeros. The sign changes twice across the table: positive before minus one, negative in between, positive again after five. |
| `text` | Bu katak yuqori qatorda, u yerga argument yoziladi. Minus to'qqiz — qiymat; savol esa u qaysi iks da chiqishi haqida. | Эта клетка в верхней строке, туда пишут аргумент. Минус девять — это значение; вопрос в том, при каком икс оно получается. | This cell is in the top row, and the argument goes there. Minus nine is a value; the question is at which x it appears. |
| `text` | Bu sonlarda qiymat boshqa: jadvalda ular allaqachon yozilgan. Minus to'qqiz esa faqat bitta joyda chiqadi. | При этих числах значение другое: они уже выписаны в таблице. А минус девять получается лишь в одном месте. | At these numbers the value is different: they are already written in the table. Minus nine appears in one place only. |
| `text` | Oltini ikkala qavsga qo'ying: yetti va bir. Ikkalasi ham musbat, demak ko'paytma ham musbat. | Подставь шесть в обе скобки: семь и один. Обе положительны, значит и произведение положительно. | Put six into both brackets: seven and one. Both are positive, so the product is positive too. |
| `text` | Bu qo'shish emas, KO'PAYTMA. Ikki qavsning qiymatini alohida hisoblab, keyin ko'paytiring. | Это не сложение, а ПРОИЗВЕДЕНИЕ. Посчитай каждую скобку отдельно, потом перемножь. | This is not addition but a PRODUCT. Compute each bracket separately, then multiply. |
| `wrongText` | Har katakda ikkala qavsni alohida hisoblang, keyin ko'paytiring. Ishorani ham unutmang: ikki manfiy son musbat beradi. | В каждой клетке посчитай обе скобки отдельно, потом перемножь. Не забывай про знак: два отрицательных дают положительное. | In each cell compute both brackets separately, then multiply. Do not forget the sign: two negatives give a positive. |

---

## 03 · `Choice` · 🟢 · teg `javob-doim-bitta-oraliq`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Javob shakli | Вид ответа | Answer shape |
| `setup` | Ikkita ko'paytuvchi, ikkita har xil nol. Tengsizlikda qat'iy katta turibdi. | Два множителя, два разных нуля. В неравенстве стоит строгое «больше». | Two factors, two different zeros. The inequality is a strict "greater than". |
| `ask` | Bunday tengsizlikning javobi qanday ko'rinishda bo'ladi? | Какой вид имеет ответ такого неравенства? | What shape does the answer of such an inequality have? |
| `givenLabel` | Berilgan | Дано | Given |
| `label` | Bitta ichki oraliq. | Один внутренний промежуток. | One inner interval. |
| `label` | Ikkita nur. | Два луча. | Two rays. |
| `label` | Barcha sonlar. | Все числа. | All numbers. |
| `label` | Yechim yo'q. | Решений нет. | No solution. |
| `correctText` | To'g'ri. Tarmoqlar yuqoriga qaragan parabola nollar orasida Ox dan pastda, ikki chetida esa yuqorida turadi. Qat'iy katta so'ralganda javob shu ikki chetdan iborat — bitta oraliq emas, ikkita nur. | Верно. Парабола с ветвями вверх между нулями лежит ниже Ox, а по краям — выше. При строгом «больше» ответ и состоит из этих двух краёв — не один промежуток, а два луча. | Correct. A parabola with branches up lies below Ox between the zeros and above it at the two ends. With a strict "greater than", the answer is exactly those two ends — not one interval but two rays. |
| `text` | Ichki oraliq — bu ko'paytma MANFIY bo'lgan joy. Bu yerda esa musbat so'ralyapti. | Внутренний промежуток — это место, где произведение ОТРИЦАТЕЛЬНО. А здесь спрашивают положительное. | The inner interval is where the product is NEGATIVE. Here a positive one is asked for. |
| `text` | Nollarning o'zida ko'paytma nolga teng, ular orasida esa manfiy. Demak barcha sonlar javob bo'lolmaydi. | В самих нулях произведение равно нулю, а между ними отрицательно. Значит все числа ответом быть не могут. | At the zeros themselves the product is zero, and between them it is negative. So all numbers cannot be the answer. |
| `text` | Nollardan uzoqroq son oling, masalan juda katta: ikkala qavs ham musbat, ko'paytma ham musbat. Demak yechim bor. | Возьми число подальше от нулей, например очень большое: обе скобки положительны, произведение тоже. Значит решения есть. | Take a number far from the zeros, say a very large one: both brackets are positive, so is the product. So solutions do exist. |
| `wrongText` | Uchta joyni sinang: nollardan chapda, ular orasida va o'ngda. Har birida ko'paytmaning ishorasini yozing. | Испытай три места: левее нулей, между ними и правее. Для каждого выпиши знак произведения. | Test three places: left of the zeros, between them, and to the right. Write down the sign of the product for each. |

---

## 04 · `Zones` · 🟡 · teg `javob-doim-tashqi-oraliq`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Hamma yozuvda tarmoqlar yuqoriga qaragan. Guruhni tengsizlik ishorasi hal qiladi. | Во всех записях ветви направлены вверх. Группу решает знак неравенства. | In every record the branches point up. The group is decided by the sign of the inequality. |
| `ask` | Har bir yozuvni o'z guruhiga qo'ying. | Разложи каждую запись в свою группу. | Put each record into its own group. |
| `bank` | Yozuvlar | Записи | Records |
| `label` | Javob ichki oraliq | Ответ — внутренний промежуток | Answer is an inner interval |
| `label` | Javob ikkita nur | Ответ — два луча | Answer is two rays |
| `label` | Javob barcha sonlar | Ответ — все числа | Answer is all numbers |
| `correctText` | To'g'ri. Bir xil ko'paytma ikki xil javob berdi: kichik so'ralganda nollar orasidagi oraliq, katta so'ralganda esa ikki chet. Oxirgi ikkitasida ko'paytma hech qachon nolga aylanmaydi va har doim musbat — shuning uchun javob barcha sonlar. | Верно. Одно и то же произведение дало два разных ответа: при «меньше» — промежуток между нулями, при «больше» — два края. В последних двух произведение никогда не обращается в нуль и всегда положительно, поэтому ответ — все числа. | Correct. The same product gave two different answers: with "less than" it is the interval between the zeros, with "greater than" it is the two ends. In the last two the product never becomes zero and is always positive, so the answer is all numbers. |
| `text` | Kichik so'ralyapti, ya'ni ko'paytma manfiy bo'ladigan joy kerak. Nollar orasidan bitta son olib sinang. | Спрашивают «меньше», значит нужно место, где произведение отрицательно. Возьми число между нулями и проверь. | "Less than" is asked, so you need where the product is negative. Take a number between the zeros and check. |
| `text` | Katta so'ralyapti, ya'ni ko'paytma musbat bo'ladigan joy. Nollardan uzoqroq son oling: ikkala qavs ham bir xil ishorada bo'ladi. | Спрашивают «больше», значит нужно место, где произведение положительно. Возьми число подальше от нулей: обе скобки будут одного знака. | "Greater than" is asked, so you need where the product is positive. Take a number far from the zeros: both brackets will have the same sign. |
| `text` | Bu yozuvlarni nolga tenglashtirib ko'ring: iks kvadrat qo'shuv to'rt hech qachon nolga aylanmaydi. Nol yo'q bo'lsa, ishora ham almashmaydi. | Приравняй эти записи к нулю: икс в квадрате плюс четыре в нуль не обращается никогда. Если нулей нет, то и знак не меняется. | Set these records to zero: x squared plus four never becomes zero. With no zeros there is no sign change either. |
| `wrongText` | Har yozuvda ikki savol: nollari bormi, va tengsizlikda katta turibdimi yoki kichik? | Два вопроса к каждой записи: есть ли у неё нули и что стоит в неравенстве — «больше» или «меньше»? | Two questions for each record: does it have zeros, and does the inequality say greater or less? |

---

## 05 · `DomainAxis` · 🟡 · teg `chegara-nuqta-kiritish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | O'q | Ось | Axis |
| `setup` | O'qda ikkita chegara qo'yiladi, keyin har biri uchun nuqta turi tanlanadi. | На оси ставят две границы, потом для каждой выбирают тип точки. | Two boundaries are placed on the axis, then a point type is chosen for each. |
| `ask` | Tengsizlikning javobini o'qda ko'rsating. | Отметь на оси ответ неравенства. | Mark the answer of the inequality on the axis. |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Nollar minus bir va besh, javob esa ular orasida: tarmoqlar yuqoriga qaragani uchun parabola aynan shu yerda Ox dan pastda. Tengsizlik qat'iy emas, shuning uchun ikkala nuqta ham bo'yalgan: nollarning o'zida ko'paytma nolga teng, nol esa «kichik yoki teng» ga to'g'ri keladi. | Верно. Нули — минус один и пять, а ответ между ними: ветви направлены вверх, поэтому именно там парабола ниже Ox. Неравенство нестрогое, поэтому обе точки закрашены: в самих нулях произведение равно нулю, а нуль подходит под «меньше или равно». | Correct. The zeros are minus one and five, and the answer lies between them: with branches up the parabola is below Ox exactly there. The inequality is not strict, so both points are filled: at the zeros the product is zero, and zero fits "less than or equal". |
| `text` | Tengsizlikda «kichik yoki teng» turibdi. Minus birni qo'ying: ko'paytma nol chiqadi. Nol bu shartga to'g'ri keladimi? | В неравенстве стоит «меньше или равно». Подставь минус единицу: произведение равно нулю. Подходит ли нуль под это условие? | The inequality says "less than or equal". Put in minus one: the product is zero. Does zero fit that condition? |
| `text` | Ikkala qavsni alohida nolga tenglashtiring: iks qo'shuv bir nolga teng bo'lsa iks minus bir, iks minus besh nolga teng bo'lsa iks besh. | Приравняй каждую скобку к нулю отдельно: если икс плюс один равно нулю, то икс минус один; если икс минус пять равно нулю, то икс пять. | Set each bracket to zero separately: if x plus one is zero then x is minus one; if x minus five is zero then x is five. |
| `text` | Ikkita ko'paytuvchi bor, demak nollar ham ikkita. Ikkalasini ham o'qqa qo'ying. | Множителей два, значит и нулей два. Поставь на ось оба. | There are two factors, so there are two zeros. Put both on the axis. |
| `wrongText` | Avval ikkala qavsni nolga tenglashtirib chegaralarni toping, keyin tengsizlikning ishorasiga qarab nuqta turini tanlang. | Сначала найди границы, приравняв обе скобки к нулю, потом по знаку неравенства выбери тип точек. | First find the boundaries by setting both brackets to zero, then choose the point type from the sign of the inequality. |

---

## 06 · `TypeSet` · 🟡 · teg `belgi-almashtirish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Nollar | Нули | Zeros |
| `setup` | Tengsizlikni yechish ko'paytuvchilarga ajratishdan boshlanadi. | Решение неравенства начинается с разложения на множители. | Solving the inequality starts from factoring. |
| `ask` | Kvadrat uch hadni nolga aylantiradigan sonlarni yozing. | Выпиши числа, при которых квадратный трёхчлен обращается в нуль. | Write the numbers at which the quadratic trinomial becomes zero. |
| `hint` | Bir nechta son bo'lsa, ularni nuqta-vergul bilan ajrating. | Если чисел несколько, раздели их точкой с запятой. | If there is more than one number, separate them with a semicolon. |
| `correctText` | To'g'ri, ikkita son. Ko'paytmasi o'n ikki, yig'indisi sakkiz bo'lgan sonlar ikki va olti — demak uch had iks minus ikki ko'paytiruv iks minus oltiga ajraladi. Shu ikki son javobning chegaralari bo'ladi. | Верно, два числа. Числа с произведением двенадцать и суммой восемь — это два и шесть, значит трёхчлен раскладывается на икс минус два умножить на икс минус шесть. Эти два числа и станут границами ответа. | Correct, two numbers. The numbers with product twelve and sum eight are two and six, so the trinomial factors into x minus two times x minus six. Those two numbers become the boundaries of the answer. |
| `text` | Ishoralar teskari olindi. Qavslarni oching: minus ikki va minus olti bo'lganda yig'indi manfiy chiqardi, bu yerda esa minus sakkiz iks turibdi. | Знаки взяты наоборот. Раскрой скобки: при минус двух и минус шести сумма вышла бы отрицательной, а здесь стоит минус восемь икс. | The signs were taken the other way. Expand the brackets: with minus two and minus six the sum would be negative, but here it is minus eight x. |
| `text` | Bitta son topildi, ikkinchisi qoldi. Ko'paytmasi o'n ikki bo'lgan yana qaysi son bor? | Одно число найдено, второе осталось. Какое ещё число даёт в произведении двенадцать? | One number found, the other left behind. Which other number gives twelve in the product? |
| `text` | Sakkiz va o'n ikki — yozuvdagi koeffitsientlar, nollar emas. Ular orqali nollar topiladi: yig'indisi sakkiz, ko'paytmasi o'n ikki. | Восемь и двенадцать — коэффициенты записи, а не нули. Через них нули и находят: сумма восемь, произведение двенадцать. | Eight and twelve are the coefficients of the record, not the zeros. The zeros are found through them: sum eight, product twelve. |
| `wrongText` | Ikkita son qidiring: ularning yig'indisi sakkizga, ko'paytmasi esa o'n ikkiga teng bo'lsin. | Ищи два числа: их сумма равна восьми, а произведение двенадцати. | Look for two numbers: their sum is eight and their product is twelve. |

---

## 07 · `PlacePoint` · 🟡 · teg `chegara-nuqta-kiritish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Kesishish | Пересечение | Crossings |
| `setup` | Tekislikda parabola chizilgan. U gorizontal o'qni ikki joyda kesadi. | На плоскости построена парабола. Она пересекает горизонтальную ось в двух местах. | A parabola is drawn on the plane. It crosses the horizontal axis in two places. |
| `ask` | Grafik Ox bilan kesishgan IKKALA nuqtani belgilang. | Отметь ОБЕ точки пересечения графика с Ox. | Mark BOTH points where the graph crosses Ox. |
| `correctText` | To'g'ri. Bu ikki nuqta funksiyaning nollari: aynan ular tengsizlikning chegarasi bo'ladi. Ular orasida grafik Ox dan pastda, ya'ni qiymat manfiy; tashqarisida esa yuqorida. | Верно. Эти две точки — нули функции: именно они становятся границами неравенства. Между ними график ниже Ox, то есть значение отрицательно; вне их — выше. | Correct. These two points are the zeros of the function: they become the boundaries of the inequality. Between them the graph is below Ox, so the value is negative; outside them it is above. |
| `text` | Bu uchi — grafikning eng past nuqtasi, u Ox dan PASTDA. Kesishish esa o'qning o'zida, ya'ni qiymat nolga teng bo'lgan joyda. | Это вершина — самая нижняя точка графика, она НИЖЕ Ox. А пересечение — на самой оси, там, где значение равно нулю. | That is the vertex — the lowest point of the graph, BELOW Ox. A crossing is on the axis itself, where the value is zero. |
| `text` | Bitta kesishish topildi. Parabola gorizontal o'qni ikki joyda kesadi — ikkinchisini ham toping. | Одно пересечение найдено. Парабола пересекает горизонтальную ось в двух местах — найди и второе. | One crossing found. The parabola crosses the horizontal axis in two places — find the other one. |
| `wrongText` | Kesishish nuqtasining ordinatasi nolga teng: u aynan gorizontal o'qning ustida yotadi. Grafik o'qni qayerda kesib o'tadi? | У точки пересечения ордината равна нулю: она лежит прямо на горизонтальной оси. Где график пересекает ось? | The ordinate of a crossing point is zero: it lies right on the horizontal axis. Where does the graph cross it? |

---

## 08 · `ClozeBank` · 🔴 · teg `chegara-nuqta-kiritish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Kvadrat uch hadni | Разложив квадратный трёхчлен на | Once the quadratic trinomial is split into |
| `text` | ajratgach, grafik Ox dan yuqorida bo'lgan oraliqlarda funksiya | , на промежутках, где график выше Ox, функция | , on the intervals where the graph is above Ox the function is |
| `text` | bo'ladi. Qat'iy tengsizlikda chegara nollari javobga | . При строгом неравенстве граничные нули в ответ | . In a strict inequality the boundary zeros |
| `text` | . | . |  to the answer. |
| `label` | ko'paytuvchilarga | множители | factors |
| `label` | musbat | положительна | positive |
| `label` | kirmaydi | не входят | do not belong |
| `label` | hadlarga | слагаемые | terms |
| `label` | manfiy | отрицательна | negative |
| `label` | kiradi | входят | belong |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoidada uchta qadam turibdi: ajratish nollarni beradi, nollar oraliqlarni ajratadi, tengsizlikning ishorasi esa chegaralar javobga kirishini hal qiladi. | Верно, все три слова на месте. В правиле стоят три шага: разложение даёт нули, нули делят ось на промежутки, а знак неравенства решает, входят ли границы в ответ. | Correct, all three words are in place. The rule holds three steps: factoring gives the zeros, the zeros split the axis into intervals, and the sign of the inequality decides whether the boundaries belong to the answer. |
| `text` | Hadlar qo'shish bilan bog'langan, ko'paytuvchilar esa ko'paytirish bilan. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi kifoya — nollarni shu qoida beradi. | Слагаемые связаны сложением, а множители умножением. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя — именно это правило и даёт нули. | Terms are joined by addition, factors by multiplication. A product becomes zero as soon as one factor is zero — that is the rule that gives the zeros. |
| `text` | Ox dan yuqorida turgan nuqtalarning ordinatasi noldan katta. Grafikning shu qismidan bitta nuqta oling va uning balandligiga qarang. | У точек выше Ox ордината больше нуля. Возьми точку с этой части графика и посмотри на её высоту. | Points above Ox have an ordinate greater than zero. Take a point from that part of the graph and look at its height. |
| `text` | Qat'iy tengsizlikda nol javobga to'g'ri kelmaydi: qat'iy katta noldan katta bo'lishni talab qiladi, nolning o'zi esa noldan katta emas. | При строгом неравенстве нуль не подходит: строгое «больше» требует быть больше нуля, а сам нуль больше нуля не является. | In a strict inequality zero does not fit: a strict "greater" demands being greater than zero, and zero itself is not greater than zero. |
| `wrongText` | Uchta qadamni ajrating: ajratish, oraliqlarning ishorasi, chegaralarning taqdiri. | Раздели три шага: разложение, знак на промежутках, судьба границ. | Separate the three steps: the factoring, the sign on the intervals, the fate of the boundaries. |

---

## 09 · `AuditLines` · 🔴 · teg `javob-doim-tashqi-oraliq`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi. | Решение готово, но ответ неверный. Каждая строка выглядит правильной. | The solution is finished, but the answer is wrong. Every line looks right. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Yeching | Решить | Solve |
| `text` | Nollar: | Нули: | Zeros: |
| `text` | Tarmoqlar yuqoriga qaragan | Ветви направлены вверх | The branches point up |
| `text` | Tengsizlik < 0, demak javob nollardan TASHQARIDA | Неравенство < 0, значит ответ ВНЕ нулей | The inequality is < 0, so the answer is OUTSIDE the zeros |
| `text` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Tarmoqlar yuqoriga qaragan parabola nollardan TASHQARIDA Ox dan yuqorida turadi, ya'ni u yerda ko'paytma musbat. Manfiy esa nollar ORASIDA. Uchni qo'yib ko'ring: bir ko'paytiruv minus uch, ya'ni manfiy — uch esa ikki bilan olti orasida. | Верно, ошибка в третьей строке. Парабола с ветвями вверх ВНЕ нулей лежит выше Ox, то есть там произведение положительно. А отрицательно оно МЕЖДУ нулями. Подставь тройку: один умножить на минус три, отрицательно — а тройка стоит между двойкой и шестёркой. | Correct, the error is in the third line. A parabola with branches up lies above Ox OUTSIDE the zeros, so the product is positive there. It is negative BETWEEN the zeros. Try three: one times minus three, which is negative — and three lies between two and six. |
| `text` | Bu qator to'g'ri: qavslarni nolga tenglashtirsak, aynan ikki va olti chiqadi. Xatoni undan pastda qidiring. | Эта строка верна: приравняв скобки к нулю, получим как раз два и шесть. Ищи ошибку ниже. | This line is right: setting the brackets to zero gives exactly two and six. Look for the error below. |
| `text` | Bu ham to'g'ri: qavslarni ochsak, iks kvadrat oldida bir turadi, ya'ni musbat. Keyingi qadamga qarang. | Эта тоже верна: раскрыв скобки, перед икс в квадрате получим единицу, то есть положительное число. Посмотри на следующий шаг. | This one is right too: expanding the brackets gives one in front of x squared, a positive number. Look at the next step. |
| `text` | To'rtinchi qator uchinchisining natijasini yozib qo'ygan. Bizga BIRINCHI xato kerak, oxirgisi emas. | Четвёртая строка лишь записала результат третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя. | The fourth line merely wrote down the result of the third. We need the FIRST error, not the last one. |
| `wrongText` | Nollar orasidan bitta son oling va ko'paytmaning ishorasini hisoblang. Tengsizlikda esa qaysi ishora so'ralgan? | Возьми число между нулями и посчитай знак произведения. А какой знак спрашивают в неравенстве? | Take a number between the zeros and compute the sign of the product. And which sign does the inequality ask for? |

---

## 10 · `OrderLines` · 🔴 · teg `belgi-almashtirish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi. | Пять шагов перемешаны. Вместе они составляют одну цепочку решения. | Five steps are shuffled. Together they make one chain of solution. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Yeching | Решить | Solve |
| `label` | Kvadrat uch hadni ko'paytuvchilarga ajratamiz | Раскладываем квадратный трёхчлен на множители | Factor the quadratic trinomial |
| `label` | Nollar: | Нули: | Zeros: |
| `label` | Tarmoqlar yuqoriga, > 0 → javob nollardan tashqarida | Ветви вверх, > 0 → ответ вне нулей | Branches up, > 0 → the answer is outside the zeros |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Zanjir ajratishdan boshlanadi: ko'paytuvchilarsiz nollarni topib bo'lmaydi. Nollar topilgach, tarmoqlarning yo'nalishi va tengsizlikning ishorasi birgalikda javobning shaklini beradi, va faqat shundan keyin javob yoziladi. | Верно. Цепочка начинается с разложения: без множителей нули не найти. Когда нули найдены, направление ветвей и знак неравенства вместе дают вид ответа, и только после этого ответ записывают. | Correct. The chain starts from factoring: without factors the zeros cannot be found. Once the zeros are there, the direction of the branches and the sign of the inequality together give the shape of the answer, and only then is the answer written. |
| `text` | Nollar ko'paytuvchilardan chiqadi. Ajratilmagan uch haddan qavslar qayerdan olinadi? | Нули берутся из множителей. Откуда взять скобки, если трёхчлен ещё не разложен? | The zeros come from the factors. Where would the brackets come from if the trinomial is not factored yet? |
| `text` | Bu qadam nollarga tayanadi: «tashqarida» yoki «orasida» degan so'z nollar bo'lmasa ma'nosiz. | Этот шаг опирается на нули: слова «вне» или «между» без нулей бессмысленны. | This step rests on the zeros: the words "outside" and "between" mean nothing without them. |
| `text` | Javob zanjirning oxirida turadi, hamma qaror qabul qilingandan keyin. | Ответ стоит в конце цепочки, после того как все решения приняты. | The answer stands at the end of the chain, after every decision is made. |
| `text` | Yechim nimadan boshlanadi? Uch had avval ko'paytmaga aylantiriladi, keyin qolgan hamma narsa shundan chiqadi. | С чего начинается решение? Сначала трёхчлен превращают в произведение, а дальше всё выходит из него. | Where does the solution start? The trinomial is turned into a product first, and everything else follows from it. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

