# DARS08_AMALIYOT_KONTENT — 9-sinf, 8-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars08/D08_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `RowTable` · 🟢 · teg `butun-deb-kasr-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Yuqori qator — argument, pastki qator — qiymat. Har katakda avval maxraj hisoblanadi. | Верхняя строка — аргумент, нижняя — значение. В каждой клетке сначала считают знаменатель. | The top row is the argument, the bottom row is the value. In each cell the denominator is computed first. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Birda maxraj minus birga aylanadi, o'n ikkini unga bo'lsak minus o'n ikki chiqadi. Beshda esa maxraj uch, o'n ikkini uchga bo'lsak to'rt. Har katakda avval maxraj hisoblanadi, keyin bo'lish bajariladi — kasrni butun ifoda kabi o'qib bo'lmaydi. | Верно. При единице знаменатель обращается в минус один, и двенадцать, делённое на него, даёт минус двенадцать. При пяти знаменатель равен трём, и двенадцать делить на три — четыре. В каждой клетке сначала считают знаменатель, потом делят: дробь нельзя читать как целое выражение. | Correct. At one the denominator becomes minus one, and twelve divided by it gives minus twelve. At five the denominator is three, and twelve divided by three is four. In every cell the denominator comes first and then the division: a fraction cannot be read like an integer expression. |
| `text` | Bu katak yuqori qatorda, u yerga argument yoziladi. Minus o'n ikki — qiymat; savol esa u qaysi iks da chiqishi haqida. | Эта клетка в верхней строке, туда пишут аргумент. Минус двенадцать — это значение; вопрос в том, при каком икс оно получается. | This cell is in the top row, and the argument goes there. Minus twelve is a value; the question is at which x it appears. |
| `text` | Maxrajni minus o'n ikkiga teng deb oldingiz. To'g'ri savol boshqa: maxraj qanday bo'lganda o'n ikkini unga bo'lganda minus o'n ikki chiqadi? | Ты приравнял к минус двенадцати сам знаменатель. Верный вопрос другой: каким должен быть знаменатель, чтобы двенадцать, делённое на него, дало минус двенадцать? | You set the denominator itself to minus twelve. The right question is different: what must the denominator be so that twelve divided by it gives minus twelve? |
| `text` | Maxraj hisobga olinmadi: beshda u uchga teng. O'n ikkini uchga bo'ling. | Знаменатель не учтён: при пяти он равен трём. Раздели двенадцать на три. | The denominator was ignored: at five it equals three. Divide twelve by three. |
| `text` | Avval maxrajni hisoblang: besh minus ikki. Keyin o'n ikkini shu songa bo'ling. | Сначала посчитай знаменатель: пять минус два. Потом раздели на него двенадцать. | Compute the denominator first: five minus two. Then divide twelve by that number. |
| `wrongText` | Har katakda ikki qadam bor: avval maxrajni hisoblang, keyin o'n ikkini unga bo'ling. Ishorani ham unutmang. | В каждой клетке два шага: сначала посчитай знаменатель, потом раздели на него двенадцать. Не забывай про знак. | Every cell has two steps: compute the denominator first, then divide twelve by it. Do not forget the sign. |

---

## 02 · `Choice` · 🟢 · teg `begona-ildizni-qabul-qilish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Nega ODZ | Зачем ОДЗ | Why the domain |
| `setup` | Kasr-ratsional tenglama maxrajlarga ko'paytirib yechiladi, oxirida esa javob ODZ bilan solishtiriladi. | Дробно-рациональное уравнение решают умножением на знаменатели, а в конце ответ сверяют с ОДЗ. | A fractional equation is solved by multiplying by the denominators, and at the end the answer is checked against the domain. |
| `ask` | Nega bu solishtirish kerak? | Зачем нужна эта сверка? | Why is that check needed? |
| `label` | Hisobda xato bo'lishi mumkin. | В вычислениях может быть ошибка. | There may be a mistake in the arithmetic. |
| `label` | Maxrajlarga ko'paytirish yangi ildiz keltirib chiqarishi mumkin. | Умножение на знаменатели может добавить новый корень. | Multiplying by the denominators can bring in a new root. |
| `label` | ODZ javobni chiroyliroq qiladi. | ОДЗ делает ответ красивее. | The domain makes the answer look tidier. |
| `label` | Shunday qabul qilingan. | Так принято. | It is simply the custom. |
| `correctText` | To'g'ri. Maxrajga ko'paytirilganda tenglama KENGAYADI: yangi yozuv asl tenglamada umuman bo'lmagan sonlarda ham bajarilishi mumkin. Aynan shunday son begona ildiz deyiladi. Uni tutadigan yagona narsa — ODZ bilan solishtirish, chunki hisobda hech qanday xato bo'lmasligi ham mumkin. | Верно. При умножении на знаменатель уравнение РАСШИРЯЕТСЯ: новая запись может выполняться и при числах, которых в исходном уравнении не было вовсе. Такое число и называют посторонним корнем. Поймать его может только сверка с ОДЗ — ведь ошибки в вычислениях может и не быть. | Correct. Multiplying by a denominator WIDENS the equation: the new record may hold at numbers that were not in the original at all. Such a number is called an extraneous root. Only the check against the domain catches it — there may be no arithmetic mistake at all. |
| `text` | Hisob mutlaqo to'g'ri bo'lgan holda ham begona ildiz chiqishi mumkin — u xatodan emas, ko'paytirishning o'zidan paydo bo'ladi. | Посторонний корень может появиться и при совершенно верных вычислениях — он берётся не из ошибки, а из самого умножения. | An extraneous root can appear even when the arithmetic is perfectly right — it comes from the multiplication itself, not from a mistake. |
| `text` | Bu ko'rinish masalasi emas. ODZ dan chetga chiqqan son javob bo'lolmaydi: asl tenglamada u yerda bo'lish umuman ta'riflanmagan. | Дело не во внешнем виде. Число вне ОДЗ не может быть ответом: в исходном уравнении деление там вообще не определено. | This is not about looks. A number outside the domain cannot be an answer: in the original equation the division there is not defined at all. |
| `text` | Buning aniq sababi bor. Maxrajga ko'paytirish tenglamani o'zgartiradi, va o'zgargan tenglamaning ildizi asl tenglamaniki bo'lmasligi mumkin. | У этого есть точная причина. Умножение на знаменатель меняет уравнение, и корень изменённого уравнения может не быть корнем исходного. | There is a precise reason. Multiplying by a denominator changes the equation, and a root of the changed equation may not be a root of the original one. |
| `wrongText` | Maxrajga ko'paytirilgandan keyin yozuvda maxraj qoladimi? Agar qolmasa, yangi yozuv qaysi sonlarda bajarilishi mumkin? | Останется ли знаменатель в записи после умножения на него? Если нет, то при каких числах может выполняться новая запись? | Does the denominator stay in the record after you multiply by it? If not, at which numbers can the new record hold? |

---

## 03 · `TrueFalse` · 🟢 · teg `maxraj-nolga-teng`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Tenglama va uning yechimi haqida uch mulohaza. | Три суждения об уравнении и его решении. | Three claims about an equation and its solution. |
| `ask` | Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Berilgan | Дано | Given |
| `claim` | ODZ shunday yoziladi. | ОДЗ записывается так. | the domain is written like this. |
| `claim` | ildiz ODZ ga kiradi. | корень входит в ОДЗ. | the root belongs to the domain. |
| `claim` | ham ildiz bo'lishi mumkin. | тоже может быть корнем. | could also be a root. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri, uchtasi ham. Maxraj uchda nolga aylanadi, shuning uchun uch ODZ dan chiqariladi — va u hech qanday holatda ildiz bo'lolmaydi. Tenglamani yechsak, maxraj uchga teng bo'lishi kerak, ya'ni iks oltiga teng; olti esa ODZ da bor, demak ildiz haqiqiy. | Верно, все три. Знаменатель обращается в нуль при трёх, поэтому тройка исключается из ОДЗ — и корнем быть не может ни при каких условиях. Решив уравнение, получим, что знаменатель равен трём, то есть икс равен шести; шестёрка в ОДЗ есть, значит корень настоящий. | Correct, all three. The denominator becomes zero at three, so three is excluded from the domain — and it can never be a root. Solving the equation gives a denominator of three, that is x equals six; six is in the domain, so the root is genuine. |
| `text` | Uchni maxrajga qo'ying: uch minus uch nolga teng. Nolga bo'lish esa ta'riflanmagan — bunday son hech qachon ildiz bo'lolmaydi. | Подставь тройку в знаменатель: три минус три равно нулю. Деление на нуль не определено — такое число корнем быть не может никогда. | Put three into the denominator: three minus three is zero. Division by zero is undefined — such a number can never be a root. |
| `text` | ODZ maxrajni nolga aylantiradigan sonni chiqarib tashlaydi. Iks minus uch qaysi sonda nolga aylanadi? | ОДЗ исключает число, при котором знаменатель обращается в нуль. При каком числе икс минус три равно нулю? | The domain excludes the number that makes the denominator zero. At which number does x minus three become zero? |
| `text` | Oltini tenglamaga qo'ying: maxraj uchga aylanadi, to'qqizni uchga bo'lsak uch chiqadi — tenglik bajariladi. Olti ODZ dan chiqarilmagan. | Подставь шесть в уравнение: знаменатель станет тройкой, девять делить на три — три, равенство выполняется. Шестёрка из ОДЗ не исключена. | Put six into the equation: the denominator becomes three, nine divided by three is three, and the equality holds. Six is not excluded from the domain. |
| `wrongText` | Ikki savol: maxraj qaysi sonda nolga aylanadi, va topilgan ildiz o'sha sonmi yoki boshqami? | Два вопроса: при каком числе знаменатель обращается в нуль и совпадает ли с ним найденный корень? | Two questions: at which number does the denominator become zero, and is the root you found that same number or a different one? |

---

## 04 · `PlacePoint` · 🟡 · teg `butun-deb-kasr-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Nuqta | Точка | Point |
| `setup` | Funksiya kasr bilan berilgan. Qiymatni topish uchun avval maxraj hisoblanadi. | Функция задана дробью. Чтобы найти значение, сначала считают знаменатель. | The function is given by a fraction. To find the value, the denominator is computed first. |
| `ask` | x = 2 ga mos nuqtani tekislikka qo'ying. | Поставь на плоскости точку, отвечающую x = 2. | Place the point that matches x = 2. |
| `correctText` | To'g'ri. Ikkida maxraj uchga aylanadi, oltini uchga bo'lsak ikki chiqadi. Kasrda argument avval maxrajga tushadi, keyingina bo'lish bajariladi — shuning uchun qiymat argumentdan katta bo'lishi ham, kichik bo'lishi ham mumkin. | Верно. При двух знаменатель равен трём, и шесть делить на три — два. В дроби аргумент сначала попадает в знаменатель и только потом выполняется деление, поэтому значение может быть и больше аргумента, и меньше. | Correct. At two the denominator is three, and six divided by three is two. In a fraction the argument first goes into the denominator and only then the division happens, so the value can be either larger or smaller than the argument. |
| `text` | Maxraj hisobga olinmadi: olti shunchaki ko'chirildi. Ikkini maxrajga qo'ying — u nechchiga aylanadi? | Знаменатель не учтён: шестёрка просто переписана. Подставь двойку в знаменатель — чему он станет равен? | The denominator was ignored: the six was simply copied. Put two into the denominator — what does it become? |
| `text` | Maxrajda iks emas, iks qo'shuv bir turibdi. Bittani qo'shishni unutmang. | В знаменателе стоит не икс, а икс плюс один. Не забудь прибавить единицу. | The denominator is not x but x plus one. Do not forget to add the one. |
| `text` | Sonlar o'rin almashdi. Birinchi son — argument, u gorizontal o'qda; ikkinchisi — qiymat, u tik o'qda. | Числа поменялись местами. Первое число — аргумент, по горизонтальной оси; второе — значение, по вертикальной. | The numbers changed places. The first is the argument, on the horizontal axis; the second is the value, on the vertical one. |
| `wrongText` | Ikki qadam: ikkini maxrajga qo'ying va uni hisoblang, keyin oltini shu songa bo'ling. | Два шага: подставь двойку в знаменатель и посчитай его, потом раздели шесть на это число. | Two steps: put two into the denominator and compute it, then divide six by that number. |

---

## 05 · `Zones` · 🟡 · teg `maxraj-nolga-teng`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Guruhni maxraj hal qiladi: u qaysi sonda nolga aylanadi? | Группу решает знаменатель: при каком числе он обращается в нуль? | The group is decided by the denominator: at which number does it become zero? |
| `ask` | Har bir yozuvni o'z guruhiga qo'ying. | Разложи каждую запись в свою группу. | Put each record into its own group. |
| `bank` | Yozuvlar | Записи | Records |
| `label` | ODZ: x ≠ 0 | ОДЗ: x ≠ 0 | Domain: x ≠ 0 |
| `label` | ODZ: x ≠ 4 | ОДЗ: x ≠ 4 | Domain: x ≠ 4 |
| `label` | ODZ: barcha sonlar | ОДЗ: все числа | Domain: all numbers |
| `correctText` | To'g'ri. ODZ ni surat emas, MAXRAJ hal qiladi: suratda nima turishi ahamiyatsiz. Oxirgi ikkitasida maxrajda kvadrat ustiga musbat son qo'shilgan — bunday yig'indi hech qachon nolga aylanmaydi, shuning uchun taqiq ham yo'q. Maxrajning borligining o'zi hali taqiq degani emas. | Верно. ОДЗ решает не числитель, а ЗНАМЕНАТЕЛЬ: что стоит в числителе, неважно. В последних двух в знаменателе к квадрату прибавлено положительное число — такая сумма никогда не обращается в нуль, поэтому и запрета нет. Наличие знаменателя само по себе ещё не запрет. | Correct. The domain is decided by the DENOMINATOR, not the numerator: what stands on top does not matter. In the last two a positive number is added to a square in the denominator — such a sum never becomes zero, so there is no ban. Having a denominator is not yet a ban. |
| `text` | Maxrajni nolga tenglashtirib ko'ring: kvadrat manfiy bo'lmaydi, ustiga musbat son qo'shiladi. Bunday yig'indi eng kichik holatda nechchiga teng? | Приравняй знаменатель к нулю: квадрат неотрицателен, к нему прибавляют положительное число. Чему равна такая сумма в самом малом случае? | Set the denominator to zero: a square is never negative and a positive number is added to it. What is the smallest such a sum can be? |
| `text` | Suratda iks qo'shuv bir turgani ODZ ga ta'sir qilmaydi. Maxrajga qarang: u qaysi sonda nolga aylanadi? | То, что в числителе стоит икс плюс один, на ОДЗ не влияет. Смотри на знаменатель: при каком числе он обращается в нуль? | The x plus one in the numerator does not affect the domain. Look at the denominator: at which number does it become zero? |
| `text` | Iks minus to'rt qaysi sonda nolga aylanadi? Uni nolga tenglashtiring. | При каком числе икс минус четыре обращается в нуль? Приравняй его к нулю. | At which number does x minus four become zero? Set it equal to zero. |
| `text` | Maxrajda toza iks turibdi, u nolda nolga aylanadi. Suratdagi besh bunga aloqasi yo'q. | В знаменателе стоит чистый икс, он обращается в нуль при нуле. Пятёрка в числителе к этому отношения не имеет. | The denominator is a bare x, and it becomes zero at zero. The five in the numerator has nothing to do with it. |
| `wrongText` | Har yozuvda faqat MAXRAJGA qarang va uni nolga tenglashtiring. Yechimi bo'lmasa, ODZ — barcha sonlar. | Смотри в каждой записи только на ЗНАМЕНАТЕЛЬ и приравнивай его к нулю. Если решения нет, ОДЗ — все числа. | Look only at the DENOMINATOR in each record and set it to zero. If there is no solution, the domain is all numbers. |

---

## 06 · `DomainAxis` · 🟡 · teg `maxraj-nolga-teng`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Taqiq | Запрет | Ban |
| `setup` | Kasr-ratsional tenglamani yechishdan oldin ODZ yoziladi. | Перед решением дробно-рационального уравнения выписывают ОДЗ. | Before solving a fractional equation the domain is written down. |
| `ask` | ODZ dan chiqarib tashlangan sonni o'qda belgilang. | Отметь на оси число, исключённое из ОДЗ. | Mark on the axis the number excluded from the domain. |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Maxraj to'rtda nolga aylanadi, shuning uchun to'rt ODZ dan chiqariladi va nuqta BO'SH qoladi. E'tibor bering: ildizni belgilaganda nuqta bo'yalgan bo'lardi — u javobga kiradi. Bu yerda esa aksincha, chiqarib tashlangan son so'ralyapti. | Верно. Знаменатель обращается в нуль при четырёх, поэтому четвёрка исключается из ОДЗ и точка остаётся ПУСТОЙ. Обрати внимание: если бы отмечали корень, точка была бы закрашена — он в ответ входит. А здесь наоборот, спрашивают исключённое число. | Correct. The denominator becomes zero at four, so four is excluded from the domain and the point stays HOLLOW. Note the contrast: marking a root, the point would be filled — a root belongs to the answer. Here the excluded number is asked for instead. |
| `text` | Chegara topildi, lekin nuqta bo'yaldi. Bo'yalgan nuqta «bu son javobga kiradi» degani. Bu yerda esa son ODZ dan CHIQARILGAN. | Граница найдена, но точка закрашена. Закрашенная точка означает «это число входит в ответ». А здесь число из ОДЗ ИСКЛЮЧЕНО. | The boundary is found, but the point was filled. A filled point means "this number belongs". Here the number is EXCLUDED from the domain. |
| `text` | Besh — suratdagi son, u ODZ ga ta'sir qilmaydi. Taqiq faqat maxrajdan chiqadi. | Пятёрка — число из числителя, на ОДЗ она не влияет. Запрет берётся только из знаменателя. | Five is the number from the numerator; it does not affect the domain. The ban comes from the denominator only. |
| `text` | To'qqiz — tenglamaning ildizi, taqiq emas. Savol ODZ dan chiqarilgan son haqida. | Девятка — корень уравнения, а не запрет. Спрашивают число, исключённое из ОДЗ. | Nine is the root of the equation, not the ban. The question is about the number excluded from the domain. |
| `text` | Maxrajni nolga tenglashtiring: iks minus to'rt nolga teng bo'lsa, iks nimaga teng? | Приравняй знаменатель к нулю: если икс минус четыре равно нулю, чему равен икс? | Set the denominator to zero: if x minus four is zero, what does x equal? |
| `wrongText` | Ikki savol: maxraj qaysi sonda nolga aylanadi, va o'sha son javobga kiradimi yoki chiqariladimi? | Два вопроса: при каком числе знаменатель обращается в нуль и входит ли это число в ответ или исключается? | Two questions: at which number does the denominator become zero, and does that number belong to the answer or is it excluded? |

---

## 07 · `TypeSet` · 🟡 · teg `butun-deb-kasr-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ildiz | Корень | Root |
| `setup` | Ikkala tomonni maxrajga ko'paytiring, keyin hosil bo'lgan tenglamani yeching. | Умножь обе части на знаменатель, потом реши получившееся уравнение. | Multiply both sides by the denominator, then solve the equation you get. |
| `ask` | Tenglamaning ildizini yozing. | Напиши корень уравнения. | Write the root of the equation. |
| `hint` | Javob bitta son. | Ответ — одно число. | The answer is a single number. |
| `correctText` | To'g'ri, ikki. Ikkala tomonni iks qo'shuv uchga ko'paytirsak, o'n ikki karra qavsga teng bo'ladi; ikkiga bo'lsak besh teng iks qo'shuv uch, ya'ni iks ikkiga teng. ODZ esa iks minus uchga teng emas — ikki unga kiradi, demak ildiz haqiqiy. | Верно, два. Умножив обе части на икс плюс три, получим десять равно двум умножить на скобку; разделив на два, получим пять равно икс плюс три, то есть икс равен двум. ОДЗ здесь икс не равен минус трём — двойка в него входит, значит корень настоящий. | Correct, two. Multiplying both sides by x plus three gives ten equals two times the bracket; dividing by two gives five equals x plus three, so x is two. The domain is x not equal to minus three — two belongs to it, so the root is genuine. |
| `text` | Maxrajni o'nga teng deb oldingiz. Tenglikning o'ng tomonida esa ikki turibdi: o'n ikkiga bo'linganda maxraj nechchi bo'lishi kerak? | Ты приравнял знаменатель к десяти. Но в правой части стоит двойка: каким должен быть знаменатель, чтобы десять, делённое на него, дало два? | You set the denominator equal to ten. But the right-hand side is two: what must the denominator be so that ten divided by it gives two? |
| `text` | Ko'paytirishda ikki faqat iksga tushdi. Ikkini QAVSGA ko'paytiring: u ikkala hadga ham tegishli. | При умножении двойка попала только на икс. Умножь двойку на СКОБКУ: она относится к обоим слагаемым. | While multiplying, the two reached only the x. Multiply the two by the BRACKET: it applies to both terms. |
| `text` | Minus uch — ODZ dan chiqarilgan son, ildiz emas. Uni qo'ysangiz maxraj nolga aylanadi. | Минус три — исключённое из ОДЗ число, а не корень. При его подстановке знаменатель обращается в нуль. | Minus three is the number excluded from the domain, not a root. Substituting it makes the denominator zero. |
| `text` | Besh — oraliq natija: u maxrajning qiymati. Iks qo'shuv uch beshga teng bo'lsa, iks nimaga teng? | Пятёрка — промежуточный результат: это значение знаменателя. Если икс плюс три равно пяти, чему равен икс? | Five is an intermediate result: it is the value of the denominator. If x plus three is five, what does x equal? |
| `wrongText` | Ikkala tomonni maxrajga ko'paytiring va qavsni to'liq oching. Javobni ODZ bilan solishtirishni ham unutmang. | Умножь обе части на знаменатель и раскрой скобку полностью. Не забудь сверить ответ с ОДЗ. | Multiply both sides by the denominator and open the bracket fully. Do not forget to check the answer against the domain. |

---

## 08 · `AuditLines` · 🔴 · teg `begona-ildizni-qabul-qilish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi. | Решение готово, но ответ неверный. Каждая строка выглядит правильной. | The solution is finished, but the answer is wrong. Every line looks right. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Yeching | Решить | Solve |
| `text` | ODZ: | ОДЗ: | Domain: |
| `text` | Surat nolga teng: | Числитель равен нулю: | The numerator is zero: |
| `text` | x = 2 va x = −2, ikkalasi ham ildiz | x = 2 и x = −2, оба корня подходят | x = 2 and x = −2, both are roots |
| `text` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Ikki va minus ikki suratni nolga aylantiradi, lekin ikki BIRINCHI QATORDA allaqachon chiqarib tashlangan: u yerda maxraj ham nolga aylanadi. Demak ikki begona ildiz, va javobda faqat minus ikki qoladi. Yechim o'z shartini o'zi unutgan. | Верно, ошибка в третьей строке. Двойка и минус двойка обращают числитель в нуль, но двойка ИСКЛЮЧЕНА ЕЩЁ В ПЕРВОЙ СТРОКЕ: там знаменатель тоже обращается в нуль. Значит двойка — посторонний корень, и в ответе остаётся только минус два. Решение забыло собственное условие. | Correct, the error is in the third line. Two and minus two make the numerator zero, but two was ALREADY EXCLUDED IN THE FIRST LINE: the denominator becomes zero there as well. So two is an extraneous root and only minus two remains in the answer. The solution forgot its own condition. |
| `text` | Bu qator to'g'ri: maxraj ikkida nolga aylanadi, demak ikki ODZ dan chiqariladi. Xatoni undan pastda qidiring — ayni shu shart keyinroq unutilgan. | Эта строка верна: знаменатель обращается в нуль при двух, значит двойка исключается из ОДЗ. Ищи ошибку ниже — именно это условие потом и забыли. | This line is right: the denominator becomes zero at two, so two is excluded. Look for the error below — that very condition is forgotten later. |
| `text` | Bu ham to'g'ri: kasr nolga teng bo'lishi uchun uning surati nolga teng bo'lishi kerak. Keyingi qadamga qarang. | Эта тоже верна: чтобы дробь равнялась нулю, её числитель должен быть нулём. Посмотри на следующий шаг. | This one is right too: for a fraction to be zero its numerator must be zero. Look at the next step. |
| `text` | To'rtinchi qator uchinchisining natijasini ko'chirgan. Bizga BIRINCHI xato kerak, oxirgisi emas. | Четвёртая строка переписала результат третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя. | The fourth line copied the result of the third. We need the FIRST error, not the last one. |
| `wrongText` | Birinchi qatorni va uchinchi qatorni yonma-yon qo'ying. Birinchisida qaysi son taqiqlangan, uchinchisida esa qaysi sonlar qabul qilingan? | Положи рядом первую и третью строки. Какое число запрещено в первой и какие числа приняты в третьей? | Put the first and third lines side by side. Which number is banned in the first, and which numbers are accepted in the third? |

---

## 09 · `OrderLines` · 🔴 · teg `yechim-yoq-holati`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi. | Пять шагов перемешаны. Вместе они составляют одну цепочку решения. | Five steps are shuffled. Together they make one chain of solution. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Yeching | Решить | Solve |
| `label` | ODZ: | ОДЗ: | Domain: |
| `label` | Ikkala tomonni x − 1 ga ko'paytiramiz | Умножаем обе части на x − 1 | Multiply both sides by x − 1 |
| `label` | ODZ bilan solishtiramiz: 3 ≠ 1, ildiz mos | Сверяем с ОДЗ: 3 ≠ 1, корень подходит | Check against the domain: 3 ≠ 1, the root fits |
| `correctText` | To'g'ri. ODZ birinchi qadam: u yechishdan OLDIN yoziladi, chunki keyin maxraj yozuvdan yo'qoladi va taqiqni eslab qolish imkonsiz bo'lib qoladi. Oxirgi qadam esa o'sha ODZ ga qaytadi. Agar ildiz taqiqlangan songa tushib qolganida, javob «yechim yo'q» bo'lardi — bu ham to'liq javob. | Верно. ОДЗ — первый шаг: его выписывают ДО решения, потому что потом знаменатель из записи исчезнет и запрет уже не вспомнишь. А последний шаг возвращается к этому же ОДЗ. Если бы корень совпал с запрещённым числом, ответом было бы «решений нет» — и это тоже полный ответ. | Correct. The domain is the first step: it is written BEFORE solving, because afterwards the denominator disappears from the record and the ban can no longer be recalled. The last step returns to that same domain. Had the root fallen on the banned number, the answer would be "no solution" — and that is a complete answer too. |
| `text` | ODZ yechishdan oldin yoziladi. Maxrajga ko'paytirgandan keyin u yozuvdan yo'qoladi — taqiqni keyin qayerdan eslaysiz? | ОДЗ выписывают до решения. После умножения на знаменатель он исчезает из записи — откуда потом вспомнить запрет? | The domain is written before solving. After multiplying by the denominator it vanishes from the record — where would you recall the ban from? |
| `text` | Bu qator ko'paytirishning natijasi. Ko'paytirish e'lon qilinmasdan, maxrajsiz yozuv qayerdan chiqadi? | Эта строка — результат умножения. Откуда возьмётся запись без знаменателя, если умножение ещё не объявлено? | This line is the result of the multiplication. Where would a record without a denominator come from if the multiplication has not been announced? |
| `text` | Ildiz maxrajsiz tenglamadan chiqadi. Uni yechmasdan iks uchga teng deb qayerdan aytasiz? | Корень получается из уравнения без знаменателя. Откуда взять икс равно трём, не решив его? | The root comes from the equation without a denominator. Where would x equals three come from without solving it? |
| `text` | Solishtirish topilgan ildizni tekshiradi. Ildiz hali topilmagan bo'lsa, nimani solishtirasiz? | Сверка проверяет найденный корень. Если корень ещё не найден, что сверять? | The check tests the root that was found. If the root is not found yet, what would you compare? |
| `wrongText` | Zanjirning ikki uchiga qarang: ODZ eng boshida yoziladi va eng oxirida ishlatiladi. Orasidagi uch qadam esa oddiy yechish. | Посмотри на два конца цепочки: ОДЗ выписывают в самом начале и используют в самом конце. А три шага между ними — обычное решение. | Look at the two ends of the chain: the domain is written at the very start and used at the very end. The three steps between are ordinary solving. |

---

## 10 · `ClozeBank` · 🔴 · teg `yechim-yoq-holati`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Maxrajida harf bo'lgan tenglamada avval | В уравнении с буквой в знаменателе сначала выписывают | In an equation with a letter in the denominator, first the |
| `text` | yoziladi. Maxrajlarga ko'paytirilgach hosil bo'lgan ildiz undan chetga chiqsa, u | . Если полученный после умножения на знаменатели корень выходит за него, его называют | is written down. If a root obtained after multiplying by the denominators falls outside it, that root is called |
| `text` | ildiz deyiladi. Agar yagona ildiz begona bo'lsa, tenglamaning | корнем. Если единственный корень оказался посторонним, у уравнения | . If the only root turns out to be extraneous, the equation |
| `text` | . | . | . |
| `label` | ODZ | ОДЗ | domain |
| `label` | begona | посторонним | extraneous |
| `label` | yechimi yo'q | решений нет | has no solution |
| `label` | javob | ответ | answer |
| `label` | qo'shimcha | дополнительным | additional |
| `label` | cheksiz ko'p yechimi bor | бесконечно много решений | has infinitely many solutions |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoidada butun yechimning karkasi turibdi: ODZ boshida yoziladi, oxirida u bilan solishtiriladi, va agar hamma ildiz chetga chiqsa — javob «yechimi yo'q» bo'ladi. Bu bo'sh javob emas: tenglamada ildiz yo'qligi ham aniq matematik natija. | Верно, все три слова на месте. В правиле стоит каркас всего решения: ОДЗ выписывают в начале, в конце с ним сверяются, и если все корни вышли за него — ответом будет «решений нет». Это не пустой ответ: отсутствие корней у уравнения — тоже точный математический результат. | Correct, all three words are in place. The rule holds the frame of the whole solution: the domain is written at the start, checked against at the end, and if every root falls outside it the answer is "no solution". That is not an empty answer: having no roots is a precise mathematical result too. |
| `text` | Javob yechimning oxirida turadi, boshida emas. Boshida esa taqiq yoziladi — maxrajni nolga aylantiradigan sonlar. | Ответ стоит в конце решения, а не в начале. В начале выписывают запрет — числа, обращающие знаменатель в нуль. | The answer stands at the end of a solution, not at the start. At the start the ban is written — the numbers that make the denominator zero. |
| `text` | Bunday ildiz qo'shimcha emas — u umuman ildiz emas. Uni asl tenglamaga qo'yib bo'lmaydi: u yerda maxraj nolga aylanadi. | Такой корень не дополнительный — он вообще не корень. Его нельзя подставить в исходное уравнение: там знаменатель обращается в нуль. | Such a root is not additional — it is not a root at all. It cannot be put into the original equation: the denominator becomes zero there. |
| `text` | Bu teskari xulosa. Yagona ildiz chetga chiqsa, qoladigan ildiz umuman yo'q — cheksiz ko'p emas, birorta ham. | Это обратный вывод. Если единственный корень вышел за ОДЗ, не остаётся ни одного корня — не бесконечно много, а вовсе ни одного. | That is the opposite conclusion. If the only root falls outside the domain, no roots remain at all — not infinitely many, but none. |
| `wrongText` | Yechimning uch nuqtasini ajrating: boshida nima yoziladi, chetga chiqqan ildiz qanday ataladi, va hamma ildiz chetga chiqsa javob qanday bo'ladi. | Раздели три точки решения: что выписывают в начале, как называют вышедший за ОДЗ корень и каким будет ответ, если все корни вышли. | Separate the three points of a solution: what is written at the start, what a root outside the domain is called, and what the answer is when every root falls outside. |

