# DARS14_AMALIYOT_KONTENT — 9-sinf, 14-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars14/D14_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `RowTable` · 🟢 · teg `urinish-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Bu funksiyaning diskriminanti nolga teng. Jadval buni sonlarda ko'rsatadi. | У этой функции дискриминант равен нулю. Таблица показывает это в числах. | This function has discriminant zero. The table shows it in numbers. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Nol faqat iks beshga teng bo'lganda chiqadi: kvadrat nolga aylanishi uchun qavsning ichi nol bo'lishi kerak. Endi jadvalning eng muhim gapi: uchda to'rt, yettida ham to'rt — beshning ikki tomonida bir xil qiymatlar turibdi, va ikkalasi ham MUSBAT. Kvadrat hech qachon manfiy bo'lmaydi, shuning uchun bu funksiya nolni faqat bir joyda ushlaydi va ishorasini hech qachon almashtirmaydi. | Верно. Нуль выходит только при иксе, равном пяти: чтобы квадрат обратился в нуль, внутри скобки должен быть нуль. А теперь главное в таблице: при трёх — четыре, при семи — тоже четыре; по обе стороны от пяти стоят одинаковые значения, и оба ПОЛОЖИТЕЛЬНЫЕ. Квадрат никогда не бывает отрицательным, поэтому эта функция достаёт нуль лишь в одном месте и знак свой не меняет никогда. | Correct. Zero appears only at x equal to five: for a square to become zero, the inside of the bracket must be zero. And now the main point of the table: at three it is four, at seven also four — the values on both sides of five are equal, and both POSITIVE. A square is never negative, so this function reaches zero in only one place and never changes its sign. |
| `text` | Ishora almashdi. Qavsning ichi iks minus besh: u nolga aylanishi uchun iks BESHGA teng bo'lishi kerak, minus beshga emas. | Сбился знак. Внутри скобки икс минус пять: чтобы это обратилось в нуль, икс должен быть равен ПЯТИ, а не минус пяти. | A sign slipped. Inside the bracket is x minus five: for it to become zero, x must equal FIVE, not minus five. |
| `text` | Nol pastki qatorda turibdi — bu funksiyaning QIYMATI. Yuqori qatorda esa shu qiymatni beradigan iks so'ralyapti. | Нуль стоит в нижней строке — это ЗНАЧЕНИЕ функции. А в верхней строке спрашивают икс, дающий это значение. | The zero sits in the bottom row — that is the VALUE of the function. The top row asks for the x that gives that value. |
| `text` | Yetti minus besh ikkiga teng, lekin qavs KVADRATDA turibdi: ikkining kvadrati to'rt. Kvadratni olish qadami tushib qolgan. | Семь минус пять равно двум, но скобка стоит в КВАДРАТЕ: два в квадрате — четыре. Пропущен шаг возведения в квадрат. | Seven minus five is two, but the bracket is SQUARED: two squared is four. The squaring step was skipped. |
| `text` | Yettida qiymatni o'zingiz hisoblang: yetti minus besh ikki, ikkining kvadrati to'rt. Kvadrat manfiy chiqmaydi. | Посчитай значение при семи сам: семь минус пять — два, два в квадрате — четыре. Квадрат отрицательным не выходит. | Compute the value at seven yourself: seven minus five is two, two squared is four. A square never comes out negative. |
| `wrongText` | Har katakni formula bilan tekshiring: qavsning ichini hisoblang, keyin kvadratga ko'taring. Nol faqat qavs ichi nol bo'lganda chiqadi. | Проверяй каждую клетку по формуле: посчитай внутри скобки, потом возведи в квадрат. Нуль выходит только когда внутри скобки нуль. | Check each cell against the formula: compute the inside of the bracket, then square it. Zero appears only when the bracket is zero. |

---

## 02 · `Choice` · 🟢 · teg `ikkita-ildiz-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Kvadrat funksiyaning diskriminanti nolga teng. | Дискриминант квадратичной функции равен нулю. | The discriminant of a quadratic function is zero. |
| `ask` | Parabola Ox o'qi bilan qanday joylashadi? | Как парабола расположена относительно оси Ox? | How does the parabola sit relative to the Ox axis? |
| `givenLabel` | Diskriminant | Дискриминант | Discriminant |
| `label` | Bitta nuqtada tegadi | Касается в одной точке | It touches at one point |
| `label` | Ikkita nuqtada kesadi | Пересекает в двух точках | It crosses at two points |
| `label` | Umuman kesmaydi | Не пересекает вовсе | It does not meet it at all |
| `label` | Ox bilan ustma-ust tushadi | Совпадает с осью Ox | It coincides with the Ox axis |
| `correctText` | To'g'ri. Diskriminant nechta ildiz borligini aytadi, ildiz esa Ox bilan kesishish nuqtasi. Nol diskriminant — ikkita ildiz bir joyga qo'shilib ketgani: parabola o'qqa tushadi, tegadi va yana ko'tariladi. Shu sababli bu nuqtada ishora almashmaydi — parabola o'qning ikkinchi tomoniga o'tmaydi. | Верно. Дискриминант говорит, сколько корней, а корень — это точка пересечения с Ox. Нулевой дискриминант означает, что два корня слились в один: парабола опускается к оси, касается её и снова поднимается. Поэтому в этой точке знак не меняется — парабола не переходит на другую сторону оси. | Correct. The discriminant tells how many roots there are, and a root is a point where the graph meets Ox. A zero discriminant means two roots merged into one: the parabola comes down to the axis, touches it and rises again. That is why the sign does not change at this point — the parabola never crosses to the other side. |
| `text` | Ikkita nuqta faqat diskriminant MUSBAT bo'lganda chiqadi. Nolda ikkita ildiz bir joyga qo'shilib, bitta urinish nuqtasi bo'lib qoladi. | Две точки бывают только при ПОЛОЖИТЕЛЬНОМ дискриминанте. При нуле два корня сливаются в одну точку касания. | Two points occur only when the discriminant is POSITIVE. At zero the two roots merge into a single point of tangency. |
| `text` | Umuman kesmaslik — bu diskriminant MANFIY bo'lgan hol. Nol diskriminantda esa aynan bitta umumiy nuqta bor. | Не пересекать вовсе — это случай ОТРИЦАТЕЛЬНОГО дискриминанта. А при нулевом общая точка ровно одна. | Not meeting at all is the case of a NEGATIVE discriminant. With a zero discriminant there is exactly one common point. |
| `text` | Parabola o'q bilan ustma-ust tushmaydi: o'q to'g'ri chiziq, parabola esa egri. Ular faqat nuqtalarda uchrashadi, va bu yerda bitta shunday nuqta bor. | Парабола не совпадает с осью: ось — прямая, а парабола — кривая. Они встречаются только в точках, и здесь такая точка одна. | A parabola does not coincide with the axis: the axis is a line, the parabola a curve. They meet only at points, and here there is one such point. |
| `wrongText` | Diskriminantning ishorasi ildizlar sonini beradi: musbat — ikkita, nol — bitta, manfiy — nolta. Ildiz esa Ox bilan umumiy nuqta. | Знак дискриминанта даёт число корней: положительный — два, нуль — один, отрицательный — ни одного. А корень это общая точка с Ox. | The sign of the discriminant gives the number of roots: positive — two, zero — one, negative — none. And a root is a common point with Ox. |

---

## 03 · `TrueFalse` · 🟢 · teg `diskriminant-manfiy-holati`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Bu uch hadning diskriminanti minus o'n ikkiga teng, tarmoqlari esa yuqoriga qaragan. | У этого трёхчлена дискриминант равен минус двенадцати, а ветви направлены вверх. | This trinomial has discriminant minus twelve, and its branches point upwards. |
| `ask` | Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Uch had | Трёхчлен | Trinomial |
| `claim` | — har qanday iksda to'g'ri. | — верно при любом иксе. | holds for every x. |
| `claim` | — yechimi bor. | — имеет решения. | has solutions. |
| `claim` | bo'lsa ham, grafik Ox ga bitta nuqtada tegadi. | — и всё же график касается Ox в одной точке. | and yet the graph touches Ox at one point. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. Diskriminant manfiy bo'lgani uchun grafik Ox ni umuman kesmaydi va unga tegmaydi ham — umumiy nuqta yo'q. Grafik uzluksiz, demak u o'qning FAQAT bitta tomonida turadi; tarmoqlari yuqoriga qaragani uchun bu yuqori tomon. Shundan ikkita javob chiqadi: musbatlik tengsizligining yechimi — barcha sonlar, manfiylik tengsizligining yechimi esa umuman yo'q. Ikkalasi ham to'liq javob. | Верно. Так как дискриминант отрицателен, график вообще не пересекает Ox и не касается её — общих точек нет. График непрерывен, значит он лежит ТОЛЬКО с одной стороны от оси; а поскольку ветви направлены вверх, это верхняя сторона. Отсюда два ответа: у неравенства «больше нуля» решение — любое число, а у неравенства «меньше нуля» решений нет вовсе. И то и другое — полноценный ответ. | Correct. Since the discriminant is negative, the graph neither crosses nor touches Ox — there are no common points. The graph is continuous, so it lies on ONLY one side of the axis; and since the branches point upwards, that is the upper side. Two answers follow: the "greater than zero" inequality is satisfied by all numbers, while the "less than zero" one has no solution at all. Both are complete answers. |
| `text` | Urinish faqat diskriminant NOLGA teng bo'lganda bo'ladi. Manfiy diskriminantda umumiy nuqta umuman yo'q: na kesishish, na urinish. | Касание бывает только при дискриминанте, равном НУЛЮ. При отрицательном дискриминанте общих точек нет вовсе: ни пересечения, ни касания. | Tangency happens only when the discriminant is ZERO. With a negative discriminant there are no common points at all: neither crossing nor touching. |
| `text` | Grafik butunlay o'qdan yuqorida turibdi, demak funksiya hech qachon manfiy bo'lmaydi. Bir nechta iks qo'yib ko'ring: nolda yetti, minus ikkida uch, minus to'rtda yetti — hammasi musbat. | График целиком лежит выше оси, значит функция никогда не бывает отрицательной. Подставь несколько иксов: в нуле семь, в минус двух три, в минус четырёх семь — всё положительно. | The graph lies entirely above the axis, so the function is never negative. Try a few values: at zero it is seven, at minus two three, at minus four seven — all positive. |
| `text` | Ildiz yo'q va tarmoqlar yuqoriga — demak grafik butunlay o'qdan yuqorida. Bunday funksiya har qanday iksda musbat. | Корней нет и ветви вверх — значит график целиком выше оси. Такая функция положительна при любом иксе. | No roots and branches upwards — so the graph lies entirely above the axis. Such a function is positive for every x. |
| `wrongText` | Grafikni ko'z oldingizga keltiring: ildiz yo'q, tarmoqlar yuqoriga. Bunday egri chiziq o'qning qaysi tomonida turadi va qaysi tomoniga o'tishi mumkin? | Представь график: корней нет, ветви вверх. С какой стороны оси лежит такая кривая и может ли она перейти на другую? | Picture the graph: no roots, branches upwards. Which side of the axis does such a curve lie on, and can it get to the other side? |

---

## 04 · `DomainAxis` · 🟡 · teg `urinish-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Chap tomonni to'liq kvadrat ko'rinishiga keltiring. Kvadrat esa hech qachon manfiy bo'lmaydi. | Приведи левую часть к виду полного квадрата. А квадрат никогда не бывает отрицательным. | Bring the left side to a perfect square. And a square is never negative. |
| `ask` | Tengsizlikning javobini o'qda ko'rsating. | Покажи на оси ответ неравенства. | Show the answer of the inequality on the axis. |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Chap tomon iks minus olti butunning kvadrati. Kvadrat manfiy bo'lmaydi, demak «kichik» qismi hech qachon bajarilmaydi va faqat «teng» qismi qoladi: iks minus olti nolga teng, ya'ni iks olti. Javob — YAGONA son, oraliq emas. Nuqta bo'yalgan: belgi qat'iy emas, shuning uchun nol qiymat javobga kiradi. Agar belgi qat'iy bo'lganda, javob umuman bo'lmasdi. | Верно. Левая часть — это икс минус шесть в квадрате. Квадрат не бывает отрицательным, значит часть «меньше» не выполняется никогда и остаётся только часть «равно»: икс минус шесть равно нулю, то есть икс равен шести. Ответ — ЕДИНСТВЕННОЕ число, а не промежуток. Точка закрашена: знак нестрогий, поэтому нулевое значение входит в ответ. Будь знак строгим, ответа не было бы вовсе. | Correct. The left side is x minus six, squared. A square is never negative, so the "less than" part never holds and only the "equals" part is left: x minus six equals zero, that is x is six. The answer is a SINGLE number, not an interval. The point is filled: the sign is non-strict, so the zero value belongs to the answer. Had the sign been strict, there would be no answer at all. |
| `text` | Chegara turi noto'g'ri. Belgi «kichik YOKI TENG», ya'ni nol qiymat ham javobga kiradi — nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta qat'iy belgiga tegishli, va qat'iy belgida bu tengsizlikning javobi umuman bo'lmasdi. | Тип границы неверен. Знак «меньше ИЛИ РАВНО», то есть нулевое значение тоже входит в ответ — точка должна быть закрашена. Пустая точка относится к строгому знаку, а при строгом знаке у этого неравенства ответа не было бы вовсе. | The boundary type is wrong. The sign is "less than OR EQUAL", so the zero value belongs to the answer too — the point must be filled. A hollow point belongs to a strict sign, and with a strict sign this inequality would have no answer at all. |
| `text` | O'n ikki — bu iksning oldidagi koeffitsient, ildiz emas. To'liq kvadratni yozib ko'ring: iks minus olti butunning kvadrati. | Двенадцать — это коэффициент перед иксом, а не корень. Выпиши полный квадрат: икс минус шесть в квадрате. | Twelve is the coefficient in front of x, not a root. Write out the perfect square: x minus six, squared. |
| `text` | Nolda chap tomon o'ttiz oltiga teng, ya'ni musbat — tengsizlik bajarilmaydi. Ildizni izlash kerak: to'liq kvadratning ichi nol bo'lgan joyni. | В нуле левая часть равна тридцати шести, то есть положительна — неравенство не выполняется. Нужно искать корень: место, где внутри полного квадрата нуль. | At zero the left side is thirty-six, positive — the inequality fails. What is needed is the root: the place where the inside of the perfect square is zero. |
| `text` | Bu sonni tengsizlikka qo'yib ko'ring: chap tomon musbat chiqadi. Kvadrat faqat bitta joyda nolga aylanadi, va boshqa hamma joyda musbat. | Подставь это число в неравенство: левая часть выйдет положительной. Квадрат обращается в нуль лишь в одном месте, а во всех остальных положителен. | Substitute that number into the inequality: the left side comes out positive. A square becomes zero in only one place and is positive everywhere else. |
| `text` | Chap tomonni to'liq kvadrat ko'rinishida yozing va uning ichi nol bo'lgan iksni toping. | Запиши левую часть как полный квадрат и найди икс, при котором его внутренняя часть равна нулю. | Write the left side as a perfect square and find the x that makes its inside zero. |
| `wrongText` | Iks kvadrat minus o'n ikki iks qo'shuv o'ttiz olti — bu iks minus olti butunning kvadrati. Kvadrat manfiy bo'lmasa, tengsizlik qachon bajariladi? | Икс в квадрате минус двенадцать икс плюс тридцать шесть — это икс минус шесть в квадрате. Если квадрат не бывает отрицательным, когда выполняется неравенство? | x squared minus twelve x plus thirty-six is x minus six, squared. If a square is never negative, when does the inequality hold? |

---

## 05 · `PlacePoint` · 🟡 · teg `urinish-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Grafik chizilgan. U Ox o'qiga bir joyda tegadi va ikkinchi tomonga o'tmaydi. | График построен. Он касается оси Ox в одном месте и на другую сторону не переходит. | The graph is drawn. It touches the Ox axis in one place and never crosses to the other side. |
| `ask` | Grafik Ox ga TEGGAN nuqtani belgilang. | Отметь точку, где график КАСАЕТСЯ Ox. | Mark the point where the graph TOUCHES Ox. |
| `correctText` | To'g'ri. Qavsning ichi minus uchda nolga aylanadi, demak urinish nuqtasi minus uch va nol. Chizmaga qarang: grafik o'qqa tushadi, unga tegadi va yana ko'tariladi — o'qning ostiga hech qachon tushmaydi. Aynan shu sababli bu nuqtada ishora almashmaydi: chap tomonda ham, o'ng tomonda ham funksiya musbat. | Верно. Внутри скобки нуль получается при минус трёх, значит точка касания — минус три и нуль. Посмотри на чертёж: график опускается к оси, касается её и снова поднимается — под ось он не уходит никогда. Именно поэтому в этой точке знак не меняется: и слева, и справа функция положительна. | Correct. The inside of the bracket becomes zero at minus three, so the point of tangency is minus three and zero. Look at the drawing: the graph comes down to the axis, touches it and rises again — it never goes below. That is exactly why the sign does not change here: the function is positive both to the left and to the right. |
| `text` | Ishora almashdi. Qavsda iks QO'SHUV uch turibdi: u nolga aylanishi uchun iks minus uchga teng bo'lishi kerak. Chizmada urinish nuqtasi noldan chapda. | Сбился знак. В скобке икс ПЛЮС три: чтобы это обратилось в нуль, икс должен быть равен минус трём. На чертеже точка касания левее нуля. | A sign slipped. The bracket has x PLUS three: for it to become zero, x must be minus three. On the drawing the point of tangency is to the left of zero. |
| `text` | Koordinatalar o'rin almashdi. Urinish nuqtasi Ox o'qida yotadi, demak uning ikkinchi soni har doim NOL. | Координаты поменялись местами. Точка касания лежит на оси Ox, значит её второе число всегда НУЛЬ. | The coordinates swapped places. The point of tangency lies on the Ox axis, so its second number is always ZERO. |
| `text` | Iks to'g'ri, lekin nuqta o'qdan chetda. Urinish o'qning USTIDA bo'ladi, ya'ni igrek nolga teng. | Икс верен, но точка не на оси. Касание происходит НА оси, то есть игрек равен нулю. | x is right, but the point is off the axis. Tangency happens ON the axis, that is, y equals zero. |
| `text` | Nolda grafik o'qdan ancha yuqorida: nol qo'shuv uch uch, uchning kvadrati to'qqiz. Chizmada grafikning o'qqa eng yaqin joyini qidiring. | В нуле график намного выше оси: нуль плюс три — три, три в квадрате — девять. Ищи на чертеже место, где график ближе всего к оси. | At zero the graph is far above the axis: zero plus three is three, three squared is nine. Look on the drawing for where the graph comes closest to the axis. |
| `wrongText` | Grafikning o'qqa tekkan joyini toping va uning ikkala koordinatasini o'qlar bo'ylab sanab oling. Urinish nuqtasining igregi nolga teng. | Найди место, где график коснулся оси, и считай обе его координаты по осям. У точки касания игрек равен нулю. | Find where the graph touches the axis and read both its coordinates off the axes. At a point of tangency y equals zero. |

---

## 06 · `TypeSet` · 🟡 · teg `ikkita-ildiz-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ildizlar | Корни | Roots |
| `setup` | Bu tenglamaning chap tomoni to'liq kvadratga aylanadi. | Левая часть этого уравнения складывается в полный квадрат. | The left side of this equation folds into a perfect square. |
| `ask` | Tenglamaning BARCHA ildizlarini yozing. | Запиши ВСЕ корни уравнения. | Write down ALL roots of the equation. |
| `hint` | Bir nechta bo'lsa, nuqta-vergul bilan ajrating. | Если их несколько, раздели точкой с запятой. | If there are several, separate them with a semicolon. |
| `givenLabel` | Tenglama | Уравнение | Equation |
| `correctText` | To'g'ri: bitta ildiz, minus yetti. Chap tomon iks qo'shuv yetti butunning kvadrati, va kvadrat nolga aylanishi uchun qavsning ichi nol bo'lishi kerak: iks qo'shuv yetti nolga teng. Diskriminant ham shuni beradi: o'n to'rtning kvadrati bir yuz to'qson olti, to'rt karra qirq to'qqiz ham bir yuz to'qson olti, ayirmasi nol. Kvadrat tenglamada har doim ikkita ildiz bo'lishi shart emas — bu darsning butun gapi. | Верно: один корень, минус семь. Левая часть — икс плюс семь в квадрате, а чтобы квадрат обратился в нуль, внутри скобки должен быть нуль: икс плюс семь равно нулю. Дискриминант даёт то же: четырнадцать в квадрате — сто девяносто шесть, четырежды сорок девять — тоже сто девяносто шесть, разность нуль. У квадратного уравнения не обязательно два корня — в этом весь смысл урока. | Correct: one root, minus seven. The left side is x plus seven, squared, and for a square to become zero the inside of the bracket must be zero: x plus seven equals zero. The discriminant says the same: fourteen squared is one hundred ninety-six, four times forty-nine is one hundred ninety-six as well, and the difference is zero. A quadratic need not have two roots — that is the whole point of the lesson. |
| `text` | Ikkinchi ildiz o'ylab qo'shilgan. Yettini tenglamaga qo'yib ko'ring: qirq to'qqiz qo'shuv to'qson sakkiz qo'shuv qirq to'qqiz — bir yuz to'qson olti, nol emas. Diskriminant nolga teng bo'lgan tenglamada ildiz BITTA. | Второй корень придуман. Подставь семь в уравнение: сорок девять плюс девяносто восемь плюс сорок девять — сто девяносто шесть, а не нуль. При дискриминанте, равном нулю, корень ОДИН. | The second root was invented. Substitute seven into the equation: forty-nine plus ninety-eight plus forty-nine is one hundred ninety-six, not zero. When the discriminant is zero there is ONE root. |
| `text` | Ishora almashdi. Qavsda iks QO'SHUV yetti turibdi, u nolga aylanishi uchun iks minus yettiga teng bo'lishi kerak. | Сбился знак. В скобке икс ПЛЮС семь, и чтобы это обратилось в нуль, икс должен быть равен минус семи. | A sign slipped. The bracket has x PLUS seven, and for it to become zero x must be minus seven. |
| `text` | Qirq to'qqiz — bu ozod had, ildiz emas. Ildizni to'liq kvadratdan toping: qavsning ichi nol bo'lgan iksni izlang. | Сорок девять — это свободный член, а не корень. Найди корень по полному квадрату: ищи икс, при котором внутри скобки нуль. | Forty-nine is the constant term, not a root. Find the root from the perfect square: look for the x that makes the bracket zero. |
| `text` | O'n to'rt — iksning oldidagi koeffitsient. To'liq kvadratda esa uning YARMI turadi: iks qo'shuv yetti butunning kvadrati. | Четырнадцать — коэффициент перед иксом. А в полном квадрате стоит его ПОЛОВИНА: икс плюс семь в квадрате. | Fourteen is the coefficient in front of x. In the perfect square it is HALF of it that appears: x plus seven, squared. |
| `text` | Ildiz bittadan ortiq yozilgan. Diskriminantni hisoblang: u nolga teng chiqadi, ya'ni ildiz aynan bitta. | Записано больше одного корня. Посчитай дискриминант: он выйдет равным нулю, значит корень ровно один. | More than one root was written. Compute the discriminant: it comes out zero, so there is exactly one root. |
| `wrongText` | Chap tomonni to'liq kvadrat ko'rinishida yozing: iks qo'shuv yetti butunning kvadrati. Kvadrat nolga aylanishi uchun qavsning ichi nechchi bo'lishi kerak? | Запиши левую часть как полный квадрат: икс плюс семь в квадрате. Чему должно быть равно выражение в скобке, чтобы квадрат обратился в нуль? | Write the left side as a perfect square: x plus seven, squared. What must the bracket equal for the square to become zero? |

---

## 07 · `Zones` · 🟡 · teg `ikkita-ildiz-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Har bir uch had uchun diskriminantni hisoblang va nechta ildiz borligini aniqlang. | Для каждого трёхчлена посчитай дискриминант и определи, сколько корней. | For each trinomial compute the discriminant and decide how many roots there are. |
| `ask` | Yozuvni bosing, keyin guruhni bosing. | Нажми запись, потом нажми группу. | Tap a record, then tap a group. |
| `label` | Ikkita ildiz | Два корня | Two roots |
| `label` | Bitta ildiz | Один корень | One root |
| `label` | Ildiz yo'q | Корней нет | No roots |
| `correctText` | To'g'ri. Birinchi guruhda diskriminant musbat: to'qqiz va yigirma besh. Ikkinchi guruhda nol — ikkalasi ham to'liq kvadrat: iks qo'shuv to'rt butunning kvadrati va ikki iks minus bir butunning kvadrati. Uchinchi guruhda manfiy: minus o'n bir va minus o'n olti. Diskriminantning ISHORASI ildizlar sonini to'g'ridan-to'g'ri beradi, ildizlarni topish shart emas. | Верно. В первой группе дискриминант положителен: девять и двадцать пять. Во второй — нуль, и оба трёхчлена полные квадраты: икс плюс четыре в квадрате и два икс минус один в квадрате. В третьей — отрицателен: минус одиннадцать и минус шестнадцать. ЗНАК дискриминанта прямо даёт число корней, сами корни искать не нужно. | Correct. In the first group the discriminant is positive: nine and twenty-five. In the second it is zero, and both are perfect squares: x plus four squared, and two x minus one squared. In the third it is negative: minus eleven and minus sixteen. The SIGN of the discriminant gives the number of roots directly; the roots themselves need not be found. |
| `text` | Bu yozuvlarda diskriminant manfiy: birida bir minus o'n ikki, ikkinchisida to'rt minus yigirma. Manfiy diskriminantda haqiqiy ildiz umuman bo'lmaydi. | В этих записях дискриминант отрицателен: в одной один минус двенадцать, в другой четыре минус двадцать. При отрицательном дискриминанте действительных корней нет вовсе. | In these records the discriminant is negative: one minus twelve in one, four minus twenty in the other. With a negative discriminant there are no real roots at all. |
| `text` | Bu yozuvlar to'liq kvadrat: diskriminanti nolga teng, ya'ni ildiz bitta. Iks qo'shuv to'rt butunning kvadratini nolga tenglashtiring — bitta ildiz chiqadi. | Эти записи — полные квадраты: дискриминант равен нулю, значит корень один. Приравняй икс плюс четыре в квадрате к нулю — выйдет один корень. | These records are perfect squares: the discriminant is zero, so there is one root. Set x plus four squared to zero — one root comes out. |
| `text` | Bu yozuvlarda diskriminant musbat: qirq to'qqiz minus qirq to'qqizga teng, va to'qqiz qo'shuv o'n olti yigirma beshga teng. Musbat diskriminant IKKITA har xil ildiz beradi, bitta emas. | В этих записях дискриминант положителен: сорок девять минус сорок — девять, и девять плюс шестнадцать — двадцать пять. Положительный дискриминант даёт ДВА разных корня, а не один. | In these records the discriminant is positive: forty-nine minus forty is nine, and nine plus sixteen is twenty-five. A positive discriminant gives TWO different roots, not one. |
| `text` | Uchinchi guruhga faqat diskriminanti MANFIY bo'lgan yozuvlar tushadi. Bu yozuvning diskriminanti manfiy emas. | В третью группу попадают только записи с ОТРИЦАТЕЛЬНЫМ дискриминантом. У этой записи дискриминант не отрицателен. | Only records with a NEGATIVE discriminant belong to the third group. This one does not have a negative discriminant. |
| `wrongText` | Har bir uch had uchun diskriminantni yozib hisoblang: iks oldidagi koeffitsientning kvadrati minus to'rt karra birinchi va oxirgi koeffitsientlarning ko'paytmasi. Uning ishorasi guruhni beradi. | Для каждого трёхчлена выпиши и посчитай дискриминант: квадрат коэффициента при иксе минус четыре на произведение первого и последнего коэффициентов. Его знак и даёт группу. | Write out and compute the discriminant for each trinomial: the square of the x-coefficient minus four times the product of the first and last coefficients. Its sign gives the group. |

---

## 08 · `AuditLines` · 🔴 · teg `yechim-yoq-yoki-hamma-son`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Tengsizlik yechilgan. Diskriminant to'g'ri hisoblangan, lekin undan chiqarilgan xulosa xato. | Неравенство решено. Дискриминант посчитан верно, но вывод из него сделан неверный. | The inequality was solved. The discriminant is computed correctly, but the conclusion drawn from it is wrong. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `text` | Diskriminant manfiy, ildiz yo'q | Дискриминант отрицателен, корней нет | The discriminant is negative, there are no roots |
| `text` | Ildiz yo'q, demak yechim ham yo'q | Корней нет, значит и решений нет | No roots, so there are no solutions either |
| `text` | Javob: yechim yo'q | Ответ: решений нет | Answer: no solution |
| `correctText` | To'g'ri, xato uchinchi qatorda. Ildiz yo'qligi grafikning Ox bilan umumiy nuqtasi yo'qligini bildiradi, xolos. Grafik uzluksiz, demak u o'qning faqat bitta tomonida turadi — tarmoqlari yuqoriga qaragani uchun butunlay YUQORIDA. Ya'ni ifoda har qanday iksda musbat va javob barcha sonlar. Nolda tekshirib ko'ring: o'n uch, musbat. Ildiz yo'qligidan yechim yo'qligi kelib chiqmaydi — ba'zan aksincha, yechim BARCHA sonlar bo'ladi. | Верно, ошибка в третьей строке. Отсутствие корней означает лишь, что у графика нет общих точек с Ox. График непрерывен, значит он лежит только с одной стороны от оси — а поскольку ветви вверх, целиком ВЫШЕ. То есть выражение положительно при любом иксе и ответ — любое число. Проверь в нуле: тринадцать, положительно. Из отсутствия корней отсутствие решений не следует — иногда наоборот, решением оказываются ВСЕ числа. | Correct, the error is in the third line. No roots means only that the graph has no common points with Ox. The graph is continuous, so it lies on one side of the axis only — and since the branches point upwards, entirely ABOVE it. So the expression is positive for every x and the answer is all numbers. Check at zero: thirteen, positive. No roots does not imply no solutions — sometimes the opposite, the solution is ALL numbers. |
| `text` | Bu qator to'g'ri: minus oltining kvadrati o'ttiz olti, to'rt karra o'n uch ellik ikki, ayirmasi minus o'n olti. | Эта строка верна: минус шесть в квадрате — тридцать шесть, четырежды тринадцать — пятьдесят два, разность минус шестнадцать. | This line is right: minus six squared is thirty-six, four times thirteen is fifty-two, and the difference is minus sixteen. |
| `text` | Bu ham to'g'ri: manfiy diskriminantda haqiqiy ildiz bo'lmaydi. Keyingi qatorga qarang — ildiz yo'qligidan qanday xulosa chiqarilgan? | Эта тоже верна: при отрицательном дискриминанте действительных корней нет. Посмотри на следующую строку: какой вывод сделан из отсутствия корней? | This one is right too: with a negative discriminant there are no real roots. Look at the next line — what conclusion was drawn from having no roots? |
| `text` | To'rtinchi qator xato, lekin u BIRINCHI xato emas: u shunchaki oldingi qatordan ko'chirilgan. Xato o'sha xulosa chiqarilgan joyda paydo bo'lgan. | Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она просто переписана из предыдущей. Ошибка возникла там, где сделали вывод. | The fourth line is wrong, but it is not the FIRST error: it was simply copied from the line before. The error arose where the conclusion was drawn. |
| `wrongText` | Nolni tengsizlikka qo'yib ko'ring: chap tomon nechchi chiqadi va tengsizlik bajariladimi? Agar bajarilsa, «yechim yo'q» degan javob to'g'ri bo'lolmaydi. | Подставь нуль в неравенство: чему равна левая часть и выполняется ли неравенство? Если выполняется, ответ «решений нет» верным быть не может. | Substitute zero into the inequality: what is the left side and does the inequality hold? If it does, the answer "no solution" cannot be right. |

---

## 09 · `OrderLines` · 🔴 · teg `urinish-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Takroriy ildizli tengsizlikni yechishning beshta qadami aralashtirilgan. | Пять шагов решения неравенства с повторяющимся корнем перемешаны. | Five steps of solving an inequality with a repeated root are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `label` | Diskriminantni hisoblaymiz: | Считаем дискриминант: | Compute the discriminant: |
| `label` | Bitta takroriy ildiz: | Один повторяющийся корень: | One repeated root: |
| `label` | Tarmoqlar yuqoriga, urinish nuqtasida ishora almashmaydi | Ветви вверх, в точке касания знак не меняется | Branches up, the sign does not change at the point of tangency |
| `label` | Qat'iy belgi: urinish nuqtasining o'zi javobga kirmaydi | Строгий знак: сама точка касания в ответ не входит | Strict sign: the point of tangency itself is not in the answer |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Diskriminant nol, ya'ni ildiz bitta va u takroriy: minus bir. Ishora bu nuqtada almashmaydi, shuning uchun ifoda o'qning ikki tomonida ham musbat — minus birning o'zida esa nolga teng. Belgi qat'iy bo'lgani uchun nol qiymat javobga kirmaydi, va javob minus birdan boshqa barcha sonlar. Agar belgi qat'iy bo'lmaganda, javob barcha sonlar bo'lardi. | Верно. Дискриминант нуль, значит корень один и он повторяющийся: минус один. Знак в этой точке не меняется, поэтому выражение положительно по обе стороны — а в самой точке минус один равно нулю. Знак строгий, поэтому нулевое значение в ответ не входит, и ответ — любое число, кроме минус одного. Будь знак нестрогим, ответом было бы любое число. | Correct. The discriminant is zero, so there is one root and it is repeated: minus one. The sign does not change there, so the expression is positive on both sides — and at minus one itself it equals zero. The sign is strict, so the zero value is excluded, and the answer is every number except minus one. Had the sign been non-strict, the answer would be all numbers. |
| `text` | Ildiz diskriminantdan chiqadi. Uni hisoblamasdan nechta ildiz borligini ham bilib bo'lmaydi. | Корень выходит из дискриминанта. Не посчитав его, нельзя даже узнать, сколько корней. | The root comes from the discriminant. Without computing it you cannot even tell how many roots there are. |
| `text` | Javob chegara nuqtasi haqidagi qarordan keyin yoziladi. Qat'iy belgi bilan minus bir chiqariladi, qat'iy bo'lmasa esa qoladi — javob shundan aniqlanadi. | Ответ пишется после решения о граничной точке. При строгом знаке минус один исключается, при нестрогом остаётся — от этого и зависит ответ. | The answer is written after the decision about the boundary point. With a strict sign minus one is excluded, with a non-strict one it stays — the answer depends on that. |
| `text` | Ishora QAYSI nuqtada almashmasligi haqida gapirish uchun o'sha nuqta topilgan bo'lishi kerak. | Чтобы говорить, в КАКОЙ точке знак не меняется, эта точка должна быть найдена. | To say at WHICH point the sign does not change, that point must already be found. |
| `text` | Chegara nuqtasi haqidagi qaror ishora tahlilidan keyin keladi: avval ifoda qayerda musbat ekani aniqlanadi, keyin nol qiymat kiradimi yoki yo'qmi hal qilinadi. | Решение о граничной точке идёт после разбора знака: сначала выясняют, где выражение положительно, потом решают, входит ли нулевое значение. | The decision about the boundary point comes after the sign analysis: first where the expression is positive, then whether the zero value is included. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

---

## 10 · `ClozeBank` · 🔴 · teg `diskriminant-manfiy-holati`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta ibora tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три выражения выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three phrases fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Diskriminant nolga teng bo'lsa, parabola bitta nuqtada | Если дискриминант равен нулю, парабола в одной точке | If the discriminant is zero, the parabola |
| `text` | , va bu nuqtaning ikki tomonida ishora | , и по обе стороны от этой точки знак остаётся | at one point, and on both sides of that point the sign stays |
| `text` | qoladi. Diskriminant manfiy bo'lsa, javob | . Если дискриминант отрицателен, ответом будет | . If the discriminant is negative, the answer is |
| `text` |  yoki «yechim yo'q» bo'ladi. |  или «решений нет». |  or "no solution". |
| `label` | Ox ga tegadi | касается Ox | touches Ox |
| `label` | bir xil | одинаковым | the same |
| `label` | barcha sonlar | любое число | all numbers |
| `label` | Ox ni kesadi | пересекает Ox | crosses Ox |
| `label` | teskari | противоположным | the opposite |
| `label` | faqat bitta son | только одно число | only one number |
| `correctText` | To'g'ri, uchala ibora ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: nol diskriminantda parabola o'qqa tegadi, kesmaydi; urinish nuqtasining ikki tomonida ishora bir xil qoladi, chunki parabola o'qning ikkinchi tomoniga o'tmaydi; va manfiy diskriminantda umumiy nuqta yo'q, shuning uchun javob ikkita maxsus shakldan biri bo'ladi — barcha sonlar yoki yechim yo'q. Qaysi biri ekani tarmoqlarning yo'nalishi va tengsizlik belgisi bilan aniqlanadi. | Верно, все три выражения на месте. Правило собирает в одно предложение три дела урока: при нулевом дискриминанте парабола касается оси, а не пересекает её; по обе стороны от точки касания знак остаётся одинаковым, ведь парабола не переходит на другую сторону; а при отрицательном дискриминанте общих точек нет, поэтому ответом будет одна из двух особых форм — любое число или решений нет. Какая именно, определяют направление ветвей и знак неравенства. | Correct, all three phrases are in place. The rule gathers the three jobs of the lesson into one sentence: with a zero discriminant the parabola touches the axis rather than crossing it; on both sides of the point of tangency the sign stays the same, since the parabola never gets to the other side; and with a negative discriminant there are no common points, so the answer is one of two special forms — all numbers, or no solution. Which one is decided by the direction of the branches and the sign of the inequality. |
| `text` | Kesish ikkita nuqtada bo'ladi va faqat diskriminant musbat bo'lganda. Nol diskriminantda parabola o'qqa tegib o'tadi — bir nuqta, ikkinchi tomonga o'tmasdan. | Пересечение бывает в двух точках и только при положительном дискриминанте. При нулевом парабола касается оси — одна точка, без перехода на другую сторону. | Crossing happens at two points and only when the discriminant is positive. At zero the parabola merely touches the axis — one point, without getting to the other side. |
| `text` | Ishora teskari bo'lishi uchun grafik o'qni KESIB o'tishi kerak. Urinishda esa u o'qqa tegib qaytadi, ya'ni ikkala tomonda bir xil ishorada qoladi. | Чтобы знак стал противоположным, график должен ПЕРЕСЕЧЬ ось. А при касании он отходит назад, то есть с обеих сторон остаётся один знак. | For the sign to become opposite, the graph must CROSS the axis. At a tangency it turns back instead, so the sign is the same on both sides. |
| `text` | Bitta son javob bo'ladigan hol boshqa: u diskriminant NOLGA teng va belgi qat'iy emas bo'lganda chiqadi. Manfiy diskriminantda umumiy nuqta umuman yo'q. | Случай, когда ответ — одно число, другой: он бывает при дискриминанте, равном НУЛЮ, и нестрогом знаке. При отрицательном дискриминанте общих точек нет вовсе. | The case where the answer is a single number is different: it happens when the discriminant is ZERO and the sign is non-strict. With a negative discriminant there are no common points at all. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nol diskriminantda grafik o'q bilan nima qilishi haqida, ikkinchisi urinish nuqtasida ishora haqida, uchinchisi esa manfiy diskriminantdagi javob shakli haqida. | Проверяй каждую клетку самим предложением: первая про то, что делает график с осью при нулевом дискриминанте, вторая про знак в точке касания, третья про форму ответа при отрицательном дискриминанте. | Check each blank against the sentence itself: the first is about what the graph does with the axis at a zero discriminant, the second about the sign at a tangency, the third about the form of the answer at a negative discriminant. |

