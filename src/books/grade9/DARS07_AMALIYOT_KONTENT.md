# DARS07_AMALIYOT_KONTENT — 9-sinf, 7-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars07/D07_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `Choice` · 🟢 · teg `qavs-ochish-ishorasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Qavs | Скобка | Bracket |
| `setup` | Qavs oldida minus turgan yozuvni soddalashtirish kerak. | Нужно упростить запись, перед скобкой которой стоит минус. | A record with a minus in front of the bracket has to be simplified. |
| `ask` | Qavs ochilganda nima bo'ladi? | Что происходит при раскрытии скобки? | What happens when the bracket is opened? |
| `givenLabel` | Berilgan | Дано | Given |
| `label` | Faqat birinchi hadning ishorasi almashadi. | Знак меняет только первое слагаемое. | Only the first term changes sign. |
| `label` | Har bir hadning ishorasi almashadi. | Знак меняет каждое слагаемое. | Every term changes sign. |
| `label` | Hech qaysi hadning ishorasi almashmaydi. | Ни одно слагаемое знак не меняет. | No term changes sign. |
| `label` | Qavs ichidagi amallar almashadi. | Меняются действия внутри скобки. | The operations inside the bracket change. |
| `correctText` | To'g'ri. Qavs oldidagi minus butun qavsga tegishli, ya'ni qavs ichidagi HAMMA narsa minus birga ko'paytiriladi. Ko'paytirish esa har bir hadga alohida tushadi, shuning uchun uchala hadning ham ishorasi almashadi. | Верно. Минус перед скобкой относится ко всей скобке, то есть всё её содержимое умножается на минус один. А умножение раскладывается на каждое слагаемое, поэтому знак меняют все три. | Correct. The minus in front of the bracket applies to the whole bracket, so everything inside is multiplied by minus one. Multiplication distributes over each term, so all three terms change sign. |
| `text` | Minus qavsga tegishli, birinchi hadga emas. Qavsni minus birga ko'paytiring va ko'paytirish har bir hadga tushishini eslang. | Минус относится к скобке, а не к первому слагаемому. Умножь скобку на минус один и вспомни, что умножение раскладывается на каждое слагаемое. | The minus belongs to the bracket, not to the first term. Multiply the bracket by minus one and remember that multiplication distributes over every term. |
| `text` | Agar hech nima almashmasa, minus qayerga ketadi? Sonlarda sinang: besh minus qavs ochiluv ikki qo'shuv bir qavs yopiluv ikki chiqishi kerak. | Если ничего не меняется, куда девается минус? Проверь на числах: пять минус скобка два плюс один должно дать два. | If nothing changes, where does the minus go? Test it on numbers: five minus the bracket two plus one must give two. |
| `text` | Amallar joyida qoladi: qo'shish qo'shish bo'lib qolaveradi. O'zgaradigan narsa — hadlarning ishorasi. | Действия остаются прежними: сложение так и остаётся сложением. Меняются знаки слагаемых. | The operations stay as they are: addition remains addition. What changes is the signs of the terms. |
| `wrongText` | Qavs oldidagi minusni minus bir deb yozing va qavsni unga ko'paytiring. Ko'paytirish qavs ichidagi nechta hadga tushadi? | Запиши минус перед скобкой как минус один и умножь на него скобку. На сколько слагаемых раскладывается умножение? | Write the minus in front of the bracket as minus one and multiply the bracket by it. Over how many terms does the multiplication distribute? |

---

## 02 · `RowTable` · 🟢 · teg `had-kochirish-ishorasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi. | Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле. | The top row is the argument, the bottom row is the value. The table is filled from the formula. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Bitta katakda argument berilgan edi va qiymat hisoblandi, ikkinchisida esa teskarisi: qiymat berilgan, argument tenglamadan topildi. Minus to'qqiz o'ng tomonga o'tganda qo'shuv to'qqiz bo'ldi — ko'chirilgan hadning ishorasi almashadi. | Верно. В одной клетке был дан аргумент и вычислялось значение, в другой наоборот: дано значение, а аргумент найден из уравнения. Минус девять при переносе вправо стало плюс девять — у перенесённого слагаемого знак меняется. | Correct. In one cell the argument was given and the value computed; in the other it was the other way round: the value was given and the argument came from an equation. Minus nine became plus nine when moved to the right — a term that moves changes sign. |
| `text` | Bu katak yuqori qatorda, u yerga argument yoziladi. O'n bir — qiymat; undan argumentga o'tish uchun to'rt iks minus to'qqiz o'n birga teng degan tenglamani yeching. | Эта клетка в верхней строке, туда пишут аргумент. Одиннадцать — это значение; чтобы перейти к аргументу, реши уравнение четыре икс минус девять равно одиннадцати. | This cell is in the top row, and the argument goes there. Eleven is a value; to get to the argument, solve four x minus nine equals eleven. |
| `text` | Minus to'qqiz to'g'ri o'tkazildi, lekin to'rtga bo'lish qolib ketdi. To'rt iks yigirmaga teng bo'lsa, iks nimaga teng? | Минус девять перенесено верно, но деление на четыре пропущено. Если четыре икс равно двадцати, чему равен икс? | The minus nine was moved correctly, but the division by four was skipped. If four x equals twenty, what does x equal? |
| `text` | Minus to'qqizni o'ng tomonga o'tkazing va ishorasini almashtiring, keyin to'rtga bo'ling. | Перенеси минус девять вправо, поменяв знак, потом раздели на четыре. | Move the minus nine to the right changing its sign, then divide by four. |
| `text` | Bu ko'paytirish emas: to'rt oltiga ko'paytirilgach, to'qqiz AYIRILADI. | Это не умножение: после умножения четырёх на шесть девять ВЫЧИТАЕТСЯ. | This is not just multiplication: after four times six, nine is SUBTRACTED. |
| `wrongText` | To'ldirgan katagingizni formulaga qo'ying: shu sonni to'rtga ko'paytirib, to'qqiz ayirsangiz nima chiqadi? | Подставь заполненную клетку в формулу: что получится, если это число умножить на четыре и вычесть девять? | Put the cell you filled into the formula: what do you get if you multiply that number by four and subtract nine? |

---

## 03 · `TrueFalse` · 🟢 · teg `butun-vs-kasr-tenglama`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Uch yozuv berilgan. Butun tenglamada maxrajda harf turmaydi. | Даны три записи. У целого уравнения в знаменателе нет буквы. | Three records are given. An integer equation has no letter in the denominator. |
| `ask` | Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `claim` | butun tenglama. | целое уравнение. | is an integer equation. |
| `claim` | ham butun tenglama. | тоже целое уравнение. | is an integer equation too. |
| `claim` | ham butun tenglama. | тоже целое уравнение. | is an integer equation too. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri, uchtasi ham. Butun tenglamani daraja yoki qavslar emas, MAXRAJ belgilaydi: agar iks maxrajda turmasa, tenglama butun. Shuning uchun iks kvadratli yozuv ham butun, kasrli yozuv esa yo'q — undagi iks maxrajda. | Верно, все три. Целое уравнение определяется не степенью и не скобками, а ЗНАМЕНАТЕЛЕМ: если икс не стоит в знаменателе, уравнение целое. Поэтому запись с икс в квадрате тоже целая, а дробная — нет: там икс в знаменателе. | Correct, all three. What makes an equation integer is not the power or the brackets but the DENOMINATOR: if x is not in a denominator, the equation is integer. So the record with x squared is integer too, while the fractional one is not — its x sits in the denominator. |
| `text` | Bu yozuvda iks MAXRAJDA turibdi. Shuning uchun uni yechishdan oldin ODZ yozish kerak — butun tenglamada bunday shart yo'q. | В этой записи икс стоит В ЗНАМЕНАТЕЛЕ. Поэтому перед решением нужно выписать ОДЗ — у целого уравнения такого условия нет. | In this record x stands IN THE DENOMINATOR. That is why the domain must be written before solving — an integer equation has no such condition. |
| `text` | Iks kvadrat butun ifodaning bir qismi: ko'phadlar qo'shish, ayirish va ko'paytirish bilan tuziladi, daraja esa ko'paytirishning o'zi. | Икс в квадрате — часть целого выражения: многочлены строятся сложением, вычитанием и умножением, а степень и есть умножение. | x squared is part of an integer expression: polynomials are built from addition, subtraction and multiplication, and a power is just multiplication. |
| `text` | Bu yozuvda maxrajda harf yo'q, faqat qavs bor. Qavs butunlikni buzmaydi — u ochilganda oddiy ko'phad qoladi. | В этой записи буквы в знаменателе нет, есть только скобка. Скобка целостности не нарушает — при раскрытии останется обычный многочлен. | This record has no letter in a denominator, only a bracket. A bracket does not break integrality — once opened, an ordinary polynomial is left. |
| `wrongText` | Har yozuvda bitta joyga qarang: maxrajda iks bormi? Javob shundan chiqadi. | Смотри в каждой записи в одно место: есть ли икс в знаменателе? Ответ выходит из этого. | Look at one place in every record: is there an x in a denominator? The answer follows from that. |

---

## 04 · `DomainAxis` · 🟡 · teg `qavs-ochish-ishorasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ildiz | Корень | Root |
| `setup` | Tenglamaning ildizi — uni to'g'ri tenglikka aylantiradigan son. | Корень уравнения — число, обращающее его в верное равенство. | A root of an equation is a number that turns it into a true equality. |
| `ask` | Tenglamaning ildizini o'qda belgilang. | Отметь на оси корень уравнения. | Mark the root of the equation on the axis. |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Qavs ochilganda ikki iks minus olti chiqadi — ikki HAR IKKALA hadga tushadi. Keyin iks chapga, olti o'ngga ko'chiriladi: iks yettiga teng. Nuqta bo'yalgan, chunki ildiz javobning o'zi. | Верно. При раскрытии скобки получается два икс минус шесть — двойка умножается на ОБА слагаемых. Потом икс переносится влево, шестёрка вправо: икс равен семи. Точка закрашена, потому что корень и есть ответ. | Correct. Opening the bracket gives two x minus six — the two multiplies BOTH terms. Then x moves left and six moves right: x equals seven. The point is filled because the root is the answer itself. |
| `text` | Qavs to'liq ochilmadi: ikki faqat iksga ko'paytirildi, uchga esa yo'q. Ikkini qavs ichidagi HAR IKKALA hadga ko'paytiring. | Скобка раскрыта не полностью: двойка умножена только на икс, а на тройку нет. Умножь двойку на ОБА слагаемых в скобке. | The bracket was not opened fully: the two multiplied only x, not the three. Multiply the two by BOTH terms inside the bracket. |
| `text` | Hadlarni ko'chirishda ishora almashishini tekshiring: minus olti o'ng tomonga o'tganda qanday bo'ladi? | Проверь смену знака при переносе: каким становится минус шесть, переходя вправо? | Check the sign change when moving terms: what does minus six become on the right-hand side? |
| `text` | Ildiz javobning o'zi, u albatta javobga kiradi. Bo'sh nuqta chiqarib tashlangan sonni bildiradi. | Корень — это и есть ответ, он безусловно в него входит. Пустая точка означает исключённое число. | The root is the answer itself, so it certainly belongs. A hollow point means an excluded number. |
| `text` | Uch qadam: qavsni oching, iks li hadlarni bir tomonga yig'ing, sonlarni ikkinchi tomonga. | Три шага: раскрой скобку, собери слагаемые с икс в одну сторону, числа в другую. | Three steps: open the bracket, gather the x terms on one side and the numbers on the other. |
| `wrongText` | Qavsni oching va topgan soningizni ASL tenglamaga qo'yib tekshiring: ikkala tomon teng chiqdimi? | Раскрой скобку и подставь найденное число в ИСХОДНОЕ уравнение: равны ли обе части? | Open the bracket and put your number into the ORIGINAL equation: do both sides come out equal? |

---

## 05 · `PlacePoint` · 🟡 · teg `tekshirish-otkazib-yuborish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Kesishish | Пересечение | Crossing |
| `setup` | Ikkita chiziq berilgan. Kesishish nuqtasi IKKALA yozuvni ham qanoatlantiradi. | Даны две прямые. Точка пересечения удовлетворяет ОБЕИМ записям. | Two lines are given. The crossing point satisfies BOTH records. |
| `ask` | Ikki chiziqning kesishish nuqtasini tekislikka qo'ying. | Поставь на плоскости точку пересечения двух прямых. | Place the crossing point of the two lines on the plane. |
| `givenLabel` | Berilgan | Дано | Given |
| `correctText` | To'g'ri. Ikkala yozuvning o'ng tomonini tenglashtirsak, ikki iks minus bir iks qo'shuv ikkiga teng bo'ladi, bundan iks uchga teng. Ikkalasiga uchni qo'ysangiz, ikkalasi ham beshni beradi — nuqta har ikkala chiziqda ham yotadi. Aynan shu narsa uni kesishish qiladi. | Верно. Приравняв правые части, получим два икс минус один равно икс плюс два, откуда икс равен трём. Подставив тройку в обе записи, в обеих получим пять — точка лежит на обеих прямых. Именно это и делает её пересечением. | Correct. Setting the right-hand sides equal gives two x minus one equals x plus two, so x is three. Putting three into both records gives five in both — the point lies on both lines. That is exactly what makes it a crossing. |
| `text` | Bu nuqta faqat IKKINCHI yozuvni qanoatlantiradi: ikki qo'shuv ikki to'rtga teng. Birinchisiga qo'ying: ikki karra ikki minus bir uch chiqadi, to'rt emas. Kesishish ikkalasida ham yotishi kerak. | Эта точка удовлетворяет только ВТОРОЙ записи: два плюс два равно четырём. Подставь её в первую: два умножить на два минус один даёт три, а не четыре. Пересечение должно лежать на обеих. | This point satisfies only the SECOND record: two plus two is four. Put it into the first: two times two minus one gives three, not four. A crossing must lie on both. |
| `text` | Bu nuqta faqat BIRINCHI yozuvni qanoatlantiradi: ikki karra bir minus bir birga teng. Ikkinchisiga qo'ying: bir qo'shuv ikki uch chiqadi, bir emas. | Эта точка удовлетворяет только ПЕРВОЙ записи: два умножить на один минус один равно единице. Подставь её во вторую: один плюс два даёт три, а не единицу. | This point satisfies only the FIRST record: two times one minus one is one. Put it into the second: one plus two gives three, not one. |
| `text` | Sonlar o'rin almashdi. Birinchi son gorizontal o'qda, ikkinchisi tik o'qda o'lchanadi. | Числа поменялись местами. Первое откладывают по горизонтальной оси, второе — по вертикальной. | The numbers changed places. The first goes along the horizontal axis, the second along the vertical one. |
| `wrongText` | Ikkala yozuvning o'ng tomonini bir-biriga tenglashtiring va iksni toping. Keyin topgan nuqtangizni IKKALA yozuvga ham qo'yib tekshiring. | Приравняй правые части двух записей друг к другу и найди икс. Потом подставь найденную точку в ОБЕ записи. | Set the right-hand sides of the two records equal to each other and find x. Then check your point against BOTH records. |

---

## 06 · `Zones` · 🟡 · teg `butun-vs-kasr-tenglama`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Guruhni ikki narsa hal qiladi: tenglik belgisi bormi va maxrajda iks turibdimi. | Группу решают две вещи: есть ли знак равенства и стоит ли икс в знаменателе. | Two things decide the group: is there an equals sign, and does x stand in a denominator. |
| `ask` | Har bir yozuvni o'z guruhiga qo'ying. | Разложи каждую запись в свою группу. | Put each record into its own group. |
| `bank` | Yozuvlar | Записи | Records |
| `label` | Butun tenglama | Целое уравнение | Integer equation |
| `label` | Kasr-ratsional tenglama | Дробно-рациональное уравнение | Fractional equation |
| `label` | Umuman tenglama emas | Вообще не уравнение | Not an equation at all |
| `correctText` | To'g'ri. Tenglama bo'lishi uchun tenglik belgisi kerak: oxirgi ikkitasi shunchaki ifoda, ularni yechib bo'lmaydi. Qolgan to'rttasini esa maxraj ajratadi: iks maxrajda tursa — kasr-ratsional, turmasa — butun. Daraja va qavslar bu bo'linishga ta'sir qilmaydi. | Верно. Чтобы запись была уравнением, нужен знак равенства: последние две — просто выражения, их не решишь. А остальные четыре делит знаменатель: икс в знаменателе — дробно-рациональное, нет — целое. Степень и скобки на это деление не влияют. | Correct. To be an equation a record needs an equals sign: the last two are just expressions and cannot be solved. The other four are split by the denominator: x in a denominator makes it fractional, otherwise it is integer. Powers and brackets do not affect this split. |
| `text` | Bu yozuvlarda tenglik belgisi yo'q. Ularni yechib bo'lmaydi: yechish uchun nimadir nimagadir teng bo'lishi kerak. | В этих записях нет знака равенства. Их нельзя решить: чтобы решать, что-то должно чему-то равняться. | These records have no equals sign. They cannot be solved: to solve, something must equal something. |
| `text` | Iks kvadrat maxrajda emas, suratda turibdi. Daraja tenglamani kasr-ratsional qilmaydi. | Икс в квадрате стоит не в знаменателе, а в числителе. Степень не делает уравнение дробно-рациональным. | x squared stands in the numerator, not the denominator. A power does not make an equation fractional. |
| `text` | Bu yozuvlarda iks MAXRAJDA turibdi, ya'ni bo'luvchi harfga bog'liq. Shuning uchun ular kasr-ratsional va ODZ talab qiladi. | В этих записях икс стоит В ЗНАМЕНАТЕЛЕ, то есть делитель зависит от буквы. Поэтому они дробно-рациональные и требуют ОДЗ. | In these records x stands IN THE DENOMINATOR, so the divisor depends on the letter. That makes them fractional and they need a domain condition. |
| `text` | Qavs butunlikni buzmaydi: uni ochsangiz oddiy ko'phad qoladi, maxrajda esa harf yo'q. | Скобка целостности не нарушает: раскрой её — останется обычный многочлен, а буквы в знаменателе нет. | A bracket does not break integrality: open it and an ordinary polynomial is left, with no letter in a denominator. |
| `wrongText` | Har yozuvga ikki savol bering: tenglik belgisi bormi, va iks maxrajda turibdimi? | Задай каждой записи два вопроса: есть ли знак равенства и стоит ли икс в знаменателе? | Ask two questions of every record: is there an equals sign, and is x in a denominator? |

---

## 07 · `TypeSet` · 🟡 · teg `qavs-ochish-ishorasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ildiz | Корень | Root |
| `setup` | Qavs oldida minus turibdi: uni ochishda har bir hadning ishorasiga qarang. | Перед скобкой стоит минус: раскрывая её, следи за знаком каждого слагаемого. | There is a minus in front of the bracket: watch the sign of every term while opening it. |
| `ask` | Tenglamaning ildizini yozing. | Напиши корень уравнения. | Write the root of the equation. |
| `hint` | Javob bitta son. | Ответ — одно число. | The answer is a single number. |
| `correctText` | To'g'ri, bir. Qavs ochilganda minus ikki iks va QO'SHUV sakkiz chiqadi: minus ikki minus to'rtga ko'paytirilganda musbat bo'ladi. Chap tomonda o'n uch minus ikki iks qoladi, keyin hadlar to'planadi: besh teng besh iks, ya'ni iks birga teng. | Верно, единица. При раскрытии скобки получается минус два икс и ПЛЮС восемь: минус два умножить на минус четыре даёт положительное. Слева остаётся тринадцать минус два икс, потом слагаемые собираются: пять равно пяти икс, то есть икс равен единице. | Correct, one. Opening the bracket gives minus two x and PLUS eight: minus two times minus four is positive. The left side becomes thirteen minus two x, then the terms gather: five equals five x, so x is one. |
| `text` | Qavs ochilganda ikkinchi hadning ishorasi hisobga olinmadi. Minus ikkini minus to'rtga ko'paytiring: natija musbatmi yoki manfiy? | При раскрытии скобки не учтён знак второго слагаемого. Умножь минус два на минус четыре: результат положительный или отрицательный? | While opening the bracket the sign of the second term was ignored. Multiply minus two by minus four: is the result positive or negative? |
| `text` | Hadlarni ko'chirishda ishora almashishini tekshiring: minus ikki iks o'ng tomonga o'tganda qanday bo'ladi? | Проверь смену знака при переносе: каким становится минус два икс, переходя вправо? | Check the sign change when moving terms: what does minus two x become on the right-hand side? |
| `text` | Besh — bu tenglikning bir tomonidagi son, javob emas. Uni beshga bo'lish qadamini bajaring. | Пятёрка — это число в одной части равенства, а не ответ. Выполни шаг деления на пять. | Five is a number on one side of the equality, not the answer. Carry out the division by five. |
| `wrongText` | Qavsni to'liq oching, keyin iks li hadlarni bir tomonga, sonlarni ikkinchi tomonga yig'ing. Javobni ASL tenglamaga qo'yib tekshiring. | Раскрой скобку полностью, потом собери слагаемые с икс в одну сторону, числа в другую. Проверь ответ подстановкой в ИСХОДНОЕ уравнение. | Open the bracket fully, then gather the x terms on one side and the numbers on the other. Check the answer in the ORIGINAL equation. |

---

## 08 · `OrderLines` · 🔴 · teg `tekshirish-otkazib-yuborish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi. | Пять шагов перемешаны. Вместе они составляют одну цепочку решения. | Five steps are shuffled. Together they make one chain of solution. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Yeching | Решить | Solve |
| `label` | Qavsni ochamiz | Раскрываем скобку | Open the bracket |
| `label` | Hadlarni ko'chiramiz: | Переносим слагаемые: | Move the terms: |
| `label` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri. Zanjir qavsni ochishdan boshlanadi, keyin hadlar to'planadi, keyin ildiz topiladi va oxirida ASL tenglamaga qo'yib tekshiriladi. Tekshiruv qo'shimcha emas: darsning qoidasi bo'yicha yechim faqat shundan keyin yakunlangan hisoblanadi. | Верно. Цепочка начинается с раскрытия скобки, потом собираются слагаемые, потом находится корень, и в конце он проверяется подстановкой в ИСХОДНОЕ уравнение. Проверка — не добавка: по правилу урока решение считается завершённым только после неё. | Correct. The chain starts by opening the bracket, then the terms are gathered, then the root is found, and at the end it is checked in the ORIGINAL equation. The check is not an extra: by the rule of the lesson the solution counts as finished only after it. |
| `text` | Bu qator qavs ochilishining natijasi. Qavs hali ochilmagan bo'lsa, uch iks minus olti qayerdan chiqadi? | Эта строка — результат раскрытия скобки. Если скобка ещё не раскрыта, откуда возьмётся три икс минус шесть? | This line is the result of opening the bracket. If the bracket is not opened yet, where would three x minus six come from? |
| `text` | Ildiz hadlar to'plangandan keyin chiqadi. Ikki iks o'n ikkiga teng bo'lmasa, iks oltiga teng deb qayerdan aytasiz? | Корень получается после того, как собраны слагаемые. Если ещё нет два икс равно двенадцати, откуда взять икс равно шести? | The root appears once the terms are gathered. Without two x equals twelve, where does x equals six come from? |
| `text` | Tekshirish topilgan ildizni tekshiradi. Ildiz hali topilmagan bo'lsa, nimani qo'yasiz? | Проверка проверяет найденный корень. Если корень ещё не найден, что подставлять? | The check tests the root that was found. If the root is not found yet, what would you substitute? |
| `text` | Yechim nimadan boshlanadi? Qavs turgan ekan, avval u ochiladi, keyin qolgan hamma narsa. | С чего начинается решение? Раз есть скобка, сначала раскрывают её, а потом всё остальное. | Where does the solution start? Since there is a bracket, it is opened first, and everything else follows. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qator o'zidan oldingisidan kelib chiqadimi? | Прочитай цепочку сверху вниз: следует ли каждая строка из предыдущей? | Read the chain from top to bottom: does every line follow from the one above it? |

---

## 09 · `AuditLines` · 🔴 · teg `qavs-ochish-ishorasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi. | Решение готово, но ответ неверный. Каждая строка выглядит правильной. | The solution is finished, but the answer is wrong. Every line looks right. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Yeching | Решить | Solve |
| `label` | Qavsni ochamiz | Раскрываем скобку | Open the bracket |
| `correctText` | To'g'ri, xato ikkinchi qatorda. Qavs oldidagi minus IKKALA hadga tushishi kerak edi: minus iks va QO'SHUV uch. Demak chap tomonda yetti minus iks qo'shuv uch, ya'ni o'n minus iks bo'lishi kerak. Uchinchi qator esa ikkinchisidan to'g'ri chiqqan — u xato emas, faqat noto'g'ri qatorning natijasi. | Верно, ошибка во второй строке. Минус перед скобкой должен был попасть на ОБА слагаемых: минус икс и ПЛЮС три. Значит слева должно быть семь минус икс плюс три, то есть десять минус икс. А третья строка из второй выходит верно — она не ошибка, а следствие ошибочной строки. | Correct, the error is in the second line. The minus in front of the bracket had to reach BOTH terms: minus x and PLUS three. So the left side should be seven minus x plus three, that is ten minus x. The third line follows correctly from the second — it is not an error but a consequence of the wrong line. |
| `text` | Bu qator hali hech narsa hisoblamaydi, u faqat keyingi qadamni e'lon qiladi. Xatoni hisobning o'zida qidiring. | Эта строка ещё ничего не считает, она лишь объявляет следующий шаг. Ищи ошибку в самом вычислении. | This line computes nothing yet, it only announces the next step. Look for the error in the computation itself. |
| `text` | Bu qator ikkinchisidan to'g'ri chiqqan: yetti minus uch to'rt, iks lar bir tomonga yig'ilgan. Xato undan yuqorida. | Эта строка выходит из второй верно: семь минус три — четыре, иксы собраны в одну сторону. Ошибка выше. | This line follows from the second correctly: seven minus three is four, and the x terms are gathered. The error is above it. |
| `text` | To'rtinchi qator uchinchisidan chiqadi. Bizga BIRINCHI xato kerak, oxirgisi emas. | Четвёртая строка выходит из третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя. | The fourth line follows from the third. We need the FIRST error, not the last one. |
| `wrongText` | Qavs oldidagi minusni minus bir deb yozing va qavsni unga ko'paytiring. Qavs ichida nechta had bor va ularning nechtasi ishorasini almashtirishi kerak? | Запиши минус перед скобкой как минус один и умножь на него скобку. Сколько слагаемых в скобке и сколько из них должны поменять знак? | Write the minus in front of the bracket as minus one and multiply the bracket by it. How many terms are inside, and how many of them must change sign? |

---

## 10 · `ClozeBank` · 🔴 · teg `had-kochirish-ishorasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Qavs oldida minus turganda, qavs ochilganda har bir hadning ishorasi | Когда перед скобкой стоит минус, при её раскрытии знак каждого слагаемого | When a minus stands in front of a bracket, on opening it the sign of every term |
| `text` | aylanadi. Had tenglamaning ikkinchi tomoniga ko'chirilganda ham uning ishorasi | . При переносе слагаемого в другую часть уравнения его знак тоже | . When a term moves to the other side of the equation its sign also |
| `text` | Topilgan ildiz | . Найденный корень подставляют в | . The root that is found is checked in the |
| `text` | tenglamaga qo'yib tekshiriladi. | уравнение для проверки. | equation. |
| `label` | teskariga | меняется на противоположный | flips |
| `label` | almashadi | меняется | changes |
| `label` | asl | исходное | original |
| `label` | o'zgarmasdan qoladi | остаётся прежним | stays the same |
| `label` | saqlanadi | сохраняется | is kept |
| `label` | soddalashtirilgan | упрощённое | simplified |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoidada uchta joy bor, va uchalasida ham ishora yoki tenglik saqlanishi haqida gap boradi: qavs ochilganda ishora almashadi, had ko'chirilganda ham, va oxirida ildiz ASL tenglamaga qo'yiladi — chunki soddalashtirish paytida xato ketgan bo'lishi mumkin. | Верно, все три слова на месте. В правиле три места, и во всех трёх речь о знаке или о сохранении равенства: при раскрытии скобки знак меняется, при переносе тоже, а в конце корень подставляют в ИСХОДНОЕ уравнение — ведь ошибка могла произойти при упрощении. | Correct, all three words are in place. The rule has three places, and all three are about signs or keeping the equality: opening a bracket flips the sign, moving a term flips it too, and at the end the root goes into the ORIGINAL equation — because a mistake could have crept in while simplifying. |
| `text` | Sonlarda sinang: besh minus qavs ochiluv ikki qo'shuv bir qavs yopiluv ikkiga teng. Agar ishoralar o'zgarmasa, natija boshqa chiqardi. | Проверь на числах: пять минус скобка два плюс один равно двум. Если бы знаки не менялись, результат вышел бы другим. | Test it on numbers: five minus the bracket two plus one is two. If the signs did not change, the result would be different. |
| `text` | Ikki iks qo'shuv uch yettiga teng bo'lsin. Uchni o'ng tomonga o'tkazing: agar u o'z ishorasida qolsa, ikki iks o'nga teng bo'lardi — bu esa noto'g'ri. | Пусть два икс плюс три равно семи. Перенеси тройку вправо: если она сохранит знак, выйдет два икс равно десяти — а это неверно. | Let two x plus three equal seven. Move the three to the right: if it kept its sign, you would get two x equals ten — which is wrong. |
| `text` | Soddalashtirilgan tenglamada xato allaqachon bo'lishi mumkin — unga qo'yish o'sha xatoni ko'rsatmaydi. Shuning uchun tekshiruv har doim ASL yozuvga qaytadi. | В упрощённом уравнении ошибка уже могла быть — подстановка в него эту ошибку не покажет. Поэтому проверка всегда возвращается к ИСХОДНОЙ записи. | The simplified equation may already contain the mistake — substituting into it would not reveal it. That is why the check always goes back to the ORIGINAL record. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi qavs haqida, ikkinchisi ko'chirish haqida, uchinchisi esa tekshiruv qaysi yozuvda o'tkazilishi haqida. | Проверяй каждую клетку самим предложением: первое про скобку, второе про перенос, третье про то, в какой записи делают проверку. | Check each blank against the sentence itself: the first is about the bracket, the second about moving a term, the third about which record the check is done in. |

