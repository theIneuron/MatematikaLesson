# DARS09_AMALIYOT_KONTENT — 9-sinf, 9-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars09/D09_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `TrueFalse` · 🟢 · teg `sistema-ikkala-tenglama`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Sistema berilgan. Uch mulohaza uning yechimlari haqida. | Дана система. Три суждения — про её решения. | A system is given. Three claims are about its solutions. |
| `ask` | Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Sistema | Система | System |
| `claim` | sistemaning yechimi. | решение системы. | is a solution of the system. |
| `claim` | bitta va o'sha yechim. | одно и то же решение. | are one and the same solution. |
| `claim` | ham sistemaning yechimi. | тоже решение системы. | is a solution of the system too. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri, uchtasi ham. Yechim IKKALA tenglamani ham bir vaqtda qanoatlantirishi kerak: uch qo'shuv to'rt yetti, uch karra to'rt o'n ikki — ikkalasi ham bajarildi. Uch-to'rt va to'rt-uch esa boshqa-boshqa juftliklar: birinchisida iks uchga, ikkinchisida to'rtga teng. Ikki-besh esa faqat birinchi tenglamaga to'g'ri keladi, ko'paytmasi o'n ikki emas, o'n. | Верно, все три. Решение должно удовлетворять ОБОИМ уравнениям сразу: три плюс четыре — семь, три умножить на четыре — двенадцать, оба выполнены. А три-четыре и четыре-три — разные пары: в первой икс равен трём, во второй четырём. Пара два-пять подходит только к первому уравнению: произведение там не двенадцать, а десять. | Correct, all three. A solution must satisfy BOTH equations at once: three plus four is seven, three times four is twelve — both hold. Three-four and four-three are different pairs: in the first x is three, in the second it is four. The pair two-five fits only the first equation: its product is ten, not twelve. |
| `text` | Ikki qo'shuv besh haqiqatan ham yetti. Lekin ikkinchi tenglamani ham tekshiring: ikki karra besh nechchi bo'ladi va u o'n ikkiga tengmi? | Два плюс пять действительно семь. Но проверь и второе уравнение: сколько будет два умножить на пять и равно ли это двенадцати? | Two plus five is indeed seven. But check the second equation too: what is two times five, and does it equal twelve? |
| `text` | Juftlikda tartib ahamiyatli: birinchi son har doim iks, ikkinchisi igrek. Uch-to'rtda iks uchga teng, to'rt-uchda esa to'rtga — bu ikki xil yechim, garchi ikkalasi ham to'g'ri bo'lsa ham. | В паре важен порядок: первое число — всегда икс, второе — игрек. В три-четыре икс равен трём, в четыре-три — четырём: это два разных решения, хотя оба верны. | Order matters in a pair: the first number is always x, the second y. In three-four x is three, in four-three it is four — two different solutions, even though both are correct. |
| `text` | Uchni va to'rtni ikkala tenglamaga ham qo'ying: yig'indisi yetti, ko'paytmasi o'n ikki. Ikkalasi ham bajarilyapti. | Подставь тройку и четвёрку в оба уравнения: сумма семь, произведение двенадцать. Оба выполняются. | Put three and four into both equations: the sum is seven, the product is twelve. Both hold. |
| `wrongText` | Har juftlikni IKKALA tenglamaga ham qo'ying. Bittasi bajarilib, ikkinchisi bajarilmasa, bu juftlik yechim emas. | Подставляй каждую пару в ОБА уравнения. Если одно выполняется, а другое нет, пара решением не является. | Put every pair into BOTH equations. If one holds and the other does not, the pair is not a solution. |

---

## 02 · `Choice` · 🟢 · teg `vieta-teskari-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tenglama | Уравнение | Equation |
| `setup` | Ikki sonning yig'indisi va ko'paytmasi ma'lum. Ular bitta kvadrat tenglamaning ildizlari. | Известны сумма и произведение двух чисел. Они — корни одного квадратного уравнения. | The sum and the product of two numbers are known. They are the roots of one quadratic equation. |
| `ask` | Bu sonlar qaysi tenglamaning ildizlari? | Корнями какого уравнения являются эти числа? | Which equation has these numbers as its roots? |
| `givenLabel` | Berilgan | Дано | Given |
| `correctText` | To'g'ri. Yig'indi tenglamaga QARAMA-QARSHI ishora bilan, ko'paytma esa o'z ishorasida tushadi. Tekshirish oson: uch va yetti — ularning yig'indisi o'n, ko'paytmasi yigirma bir, va ikkalasi ham shu tenglamani nolga aylantiradi. | Верно. Сумма входит в уравнение с ПРОТИВОПОЛОЖНЫМ знаком, а произведение — со своим. Проверить легко: три и семь — их сумма десять, произведение двадцать один, и оба обращают это уравнение в нуль. | Correct. The sum enters the equation with the OPPOSITE sign, while the product keeps its own. The check is easy: three and seven — their sum is ten, their product is twenty-one, and both make this equation zero. |
| `text` | Yig'indi qarama-qarshi ishora bilan tushadi. Uchni bu tenglamaga qo'ying: to'qqiz qo'shuv o'ttiz qo'shuv yigirma bir nolga teng emas. | Сумма входит с противоположным знаком. Подставь тройку в это уравнение: девять плюс тридцать плюс двадцать один нулю не равно. | The sum enters with the opposite sign. Put three into this equation: nine plus thirty plus twenty-one is not zero. |
| `text` | Yig'indi bilan ko'paytma o'rin almashdi. Iks oldida yig'indi, ozod hadda esa ko'paytma turishi kerak. | Сумма и произведение поменялись местами. Перед иксом должна стоять сумма, а в свободном члене — произведение. | The sum and the product changed places. The sum belongs in front of x, the product in the constant term. |
| `text` | Ko'paytma o'z ishorasida tushadi, teskarisida emas. Uchni qo'ying: to'qqiz minus o'ttiz minus yigirma bir nolga teng emas. | Произведение входит со своим знаком, а не с обратным. Подставь тройку: девять минус тридцать минус двадцать один нулю не равно. | The product keeps its own sign, not the opposite one. Put three in: nine minus thirty minus twenty-one is not zero. |
| `wrongText` | Uch va yettini har bir variantga qo'yib ko'ring. Faqat bitta tenglamada ikkalasi ham nol beradi. | Подставь тройку и семёрку в каждый вариант. Только в одном уравнении оба дадут нуль. | Put three and seven into every option. Only one equation gives zero for both. |

---

## 03 · `RowTable` · 🟢 · teg `sistema-ikkala-tenglama`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Jadval faqat birinchi tenglamadan tuzilgan: har ustunda yig'indi yettiga teng. | Таблица составлена только по первому уравнению: в каждом столбце сумма равна семи. | The table is built from the first equation only: in every column the sum is seven. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Jadvalning har bir ustuni birinchi tenglamani qanoatlantiradi, lekin ularning hammasi ham sistemaning yechimi emas. Ikkinchi tenglamani, ya'ni ko'paytmani ham tekshiring: to'rt karra uch o'n ikki — bu yechim; besh karra ikki esa o'n, o'n ikki emas. | Верно. Каждый столбец таблицы удовлетворяет первому уравнению, но не все они — решения системы. Проверь и второе уравнение, произведение: четыре умножить на три — двенадцать, это решение; а пять умножить на два — десять, а не двенадцать. | Correct. Every column of the table satisfies the first equation, but not all of them are solutions of the system. Check the second equation, the product, as well: four times three is twelve — that is a solution; five times two is ten, not twelve. |
| `text` | Bu katak yuqori qatorda, u yerga iks yoziladi. Uch — bu igrek; iksni yig'indidan toping: nima qo'shsak uch bilan yetti chiqadi? | Эта клетка в верхней строке, туда пишут икс. Тройка — это игрек; икс найди из суммы: что нужно прибавить к трём, чтобы вышло семь? | This cell is in the top row, and x goes there. Three is the y; find x from the sum: what must be added to three to make seven? |
| `text` | Yig'indi yettiga teng, ko'paytma emas. Yettidan uchni ayiring. | Сумма равна семи, а не произведение. Вычти из семи тройку. | The sum equals seven, not the product. Subtract three from seven. |
| `text` | Bu ikkinchi tenglamaning soni. Jadval esa birinchisidan tuzilgan: yettidan beshni ayiring. | Это число из второго уравнения. А таблица построена по первому: вычти из семи пятёрку. | That is the number from the second equation. The table is built from the first: subtract five from seven. |
| `text` | Yig'indi yettiga teng bo'lishi kerak. Beshga nimani qo'shsak yetti chiqadi? | Сумма должна равняться семи. Что нужно прибавить к пяти, чтобы вышло семь? | The sum must be seven. What must be added to five to make seven? |
| `wrongText` | Jadval birinchi tenglamadan to'ldiriladi: har ustunda ikki son yettiga qo'shilishi kerak. | Таблицу заполняют по первому уравнению: в каждом столбце два числа должны давать в сумме семь. | The table is filled from the first equation: in every column the two numbers must add up to seven. |

---

## 04 · `Zones` · 🟡 · teg `sistema-ikkala-tenglama`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Har juftlikni ikkala tenglamaga ham qo'ying: yig'indi yettimi, ko'paytma o'n ikkimi? | Подставь каждую пару в оба уравнения: сумма семь? произведение двенадцать? | Put every pair into both equations: is the sum seven? is the product twelve? |
| `ask` | Har bir juftlikni o'z guruhiga qo'ying. | Разложи каждую пару в свою группу. | Put each pair into its own group. |
| `bank` | Juftliklar | Пары | Pairs |
| `givenLabel` | Sistema | Система | System |
| `label` | Sistemaning yechimi | Решение системы | Solution of the system |
| `label` | Faqat yig'indi to'g'ri | Верна только сумма | Only the sum is right |
| `label` | Faqat ko'paytma to'g'ri | Верно только произведение | Only the product is right |
| `correctText` | To'g'ri. Faqat ikkita juftlik ikkala shartni ham bajardi — va ular bir-biridan farq qiladi: uch-to'rtda iks uchga teng, to'rt-uchda to'rtga. Qolganlari bittasini bajardi, ikkinchisini yo'q: shuning uchun ular yechim emas, garchi bitta tenglamaga to'g'ri kelsa ham. | Верно. Только две пары выполнили оба условия — и они различны: в три-четыре икс равен трём, в четыре-три четырём. Остальные выполнили одно условие, а другое нет: поэтому они не решения, хотя одному уравнению и подходят. | Correct. Only two pairs satisfied both conditions — and they differ: in three-four x is three, in four-three it is four. The others satisfied one condition but not the other, so they are not solutions even though they fit one equation. |
| `text` | Yig'indi to'g'ri chiqdi, lekin ko'paytmani ham hisoblang: ikki karra besh va bir karra olti o'n ikkiga tengmi? | Сумма верна, но посчитай и произведение: равны ли двенадцати два умножить на пять и один умножить на шесть? | The sum is right, but compute the product too: are two times five and one times six equal to twelve? |
| `text` | Ko'paytma to'g'ri chiqdi, lekin yig'indini ham tekshiring: ikki qo'shuv olti sakkiz, o'n ikki qo'shuv bir esa o'n uch — ikkalasi ham yetti emas. | Произведение верно, но проверь и сумму: два плюс шесть — восемь, двенадцать плюс один — тринадцать, и ни то, ни другое не семь. | The product is right, but check the sum too: two plus six is eight, twelve plus one is thirteen — neither is seven. |
| `text` | Bu juftliklarni ikkala tenglamaga ham qo'ying: yig'indi yetti, ko'paytma o'n ikki. Ikkalasi ham bajarilyapti, demak ikkalasi ham yechim. | Подставь эти пары в оба уравнения: сумма семь, произведение двенадцать. Оба выполняются, значит обе пары — решения. | Put these pairs into both equations: sum seven, product twelve. Both hold, so both pairs are solutions. |
| `wrongText` | Har juftlik uchun ikkita hisob bajaring: yig'indi va ko'paytma. Guruhni ular nechtasi to'g'ri chiqqani hal qiladi. | Для каждой пары сделай два вычисления: сумму и произведение. Группу решает то, сколько из них сошлось. | For every pair do two computations: the sum and the product. The group is decided by how many of them came out right. |

---

## 05 · `TypeSet` · 🟡 · teg `kvadratni-tuldirish-esdan-chiqarish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ko'paytma | Произведение | Product |
| `setup` | Yig'indining kvadratini yozing: unda kvadratlar ham, ikki karra ko'paytma ham bor. | Выпиши квадрат суммы: в нём есть и квадраты, и удвоенное произведение. | Write out the square of the sum: it contains both squares and twice the product. |
| `ask` | xy ko'paytmani toping. | Найди произведение xy. | Find the product xy. |
| `hint` | Javob bitta son. | Ответ — одно число. | The answer is a single number. |
| `givenLabel` | Berilgan | Дано | Given |
| `correctText` | To'g'ri, sakkiz. Yig'indining kvadrati o'ttiz oltiga teng, va u kvadratlar yig'indisi ustiga IKKI KARRA ko'paytmadan iborat. Yigirmani ayirsak, ikki karra ko'paytma o'n oltiga teng bo'ladi, demak ko'paytmaning o'zi sakkizga teng. Ikkiga bo'lish qadamini tashlab ketib bo'lmaydi. | Верно, восемь. Квадрат суммы равен тридцати шести, и он складывается из суммы квадратов и УДВОЕННОГО произведения. Вычтя двадцать, получим удвоенное произведение шестнадцать, значит само произведение равно восьми. Шаг деления на два пропустить нельзя. | Correct, eight. The square of the sum is thirty-six, and it consists of the sum of the squares plus TWICE the product. Subtracting twenty leaves twice the product as sixteen, so the product itself is eight. The halving step cannot be skipped. |
| `text` | O'n olti — bu IKKI KARRA ko'paytma. Yig'indining kvadratida ko'paytma ikki marta uchraydi, shuning uchun yana ikkiga bo'lish kerak. | Шестнадцать — это УДВОЕННОЕ произведение. В квадрате суммы произведение встречается дважды, поэтому нужно ещё разделить на два. | Sixteen is TWICE the product. In the square of a sum the product appears twice, so one more division by two is needed. |
| `text` | Ayirish o'rniga qo'shdingiz. Kvadratlar yig'indisi yig'indining kvadratidan AYIRILADI. | Вместо вычитания ты сложил. Сумму квадратов ВЫЧИТАЮТ из квадрата суммы. | You added instead of subtracting. The sum of the squares is SUBTRACTED from the square of the sum. |
| `text` | Yig'indining o'zini emas, uning KVADRATINI oling: olti emas, o'ttiz olti. | Возьми не саму сумму, а её КВАДРАТ: не шесть, а тридцать шесть. | Take not the sum itself but its SQUARE: thirty-six, not six. |
| `text` | Bu berilgan sonlarning o'zi. Ular orasidagi bog'lanish yig'indining kvadrati formulasi orqali topiladi. | Это сами данные числа. Связь между ними находят через формулу квадрата суммы. | Those are the given numbers themselves. The link between them comes from the square-of-a-sum formula. |
| `wrongText` | Yig'indining kvadratini yozing va undagi uchta hadni sanang: iks kvadrat, ikki karra iks igrek, igrek kvadrat. Qaysi ikkitasi allaqachon ma'lum? | Выпиши квадрат суммы и пересчитай его три слагаемых: икс в квадрате, удвоенное икс игрек, игрек в квадрате. Какие два уже известны? | Write out the square of the sum and count its three terms: x squared, twice xy, y squared. Which two are already known? |

---

## 06 · `PlacePoint` · 🟡 · teg `juftlik-tartib-farqi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Juftlik | Пара | Pair |
| `setup` | Sistemaning yechimi — juftlik. Birinchi son iks, ikkinchisi igrek. | Решение системы — пара. Первое число — икс, второе — игрек. | The solution of a system is a pair. The first number is x, the second is y. |
| `ask` | Sistemaning yechimini tekislikka qo'ying. | Поставь решение системы на плоскости. | Place the solution of the system on the plane. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri. Ikkala tenglamani qo'shsak, igrek yo'qoladi va ikki iks sakkizga teng bo'ladi, ya'ni iks to'rtga. Uni birinchi tenglamaga qo'ysak, igrek ikkiga teng. Nuqtaning birinchi soni har doim iks, ikkinchisi igrek — shu tartib yechimni belgilaydi. | Верно. Сложив оба уравнения, игрек исчезает и два икс равно восьми, то есть икс равен четырём. Подставив его в первое уравнение, получим игрек равен двум. Первое число точки — всегда икс, второе — игрек, и именно этот порядок задаёт решение. | Correct. Adding the two equations makes y vanish and gives two x equals eight, so x is four. Putting it into the first equation gives y equals two. The first number of a point is always x and the second is y — that order is what defines the solution. |
| `text` | Sonlar o'rin almashdi. Ikkinchi tenglamani tekshiring: ikki minus to'rt minus ikkiga teng, ikkiga emas. Juftlikda tartib ahamiyatli. | Числа поменялись местами. Проверь второе уравнение: два минус четыре равно минус двум, а не двум. В паре важен порядок. | The numbers changed places. Check the second equation: two minus four is minus two, not two. Order matters in a pair. |
| `text` | Bu juftlik faqat birinchi tenglamani qanoatlantiradi: uch qo'shuv uch olti. Ikkinchisini tekshiring: uch minus uch nolga teng, ikkiga emas. | Эта пара удовлетворяет только первому уравнению: три плюс три — шесть. Проверь второе: три минус три равно нулю, а не двум. | This pair satisfies only the first equation: three plus three is six. Check the second: three minus three is zero, not two. |
| `text` | Igrekning ishorasi chalkashdi. Iksni birinchi tenglamaga qo'ying: to'rt qo'shuv igrek oltiga teng bo'lsa, igrek musbat. | Перепутан знак игрека. Подставь икс в первое уравнение: если четыре плюс игрек равно шести, игрек положителен. | The sign of y got mixed up. Put x into the first equation: if four plus y is six, then y is positive. |
| `wrongText` | Ikkala tenglamani qo'shing — igrek yo'qoladi va iks topiladi. Keyin iksni istalgan tenglamaga qo'yib igrekni toping, va nuqtani shu tartibda qo'ying. | Сложи оба уравнения — игрек исчезнет и найдётся икс. Потом подставь икс в любое уравнение и найди игрек, и ставь точку в этом порядке. | Add the two equations — y vanishes and x is found. Then put x into either equation to find y, and place the point in that order. |

---

## 07 · `DomainAxis` · 🟡 · teg `vieta-teskari-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Kichik son | Меньшее число | The smaller number |
| `setup` | Yig'indi va ko'paytmadan sonlarning o'zini topish mumkin: ular kvadrat tenglamaning ildizlari. | По сумме и произведению можно найти сами числа: они — корни квадратного уравнения. | The numbers themselves can be found from the sum and the product: they are the roots of a quadratic equation. |
| `ask` | Ikki sondan KICHIGINI o'qda belgilang. | Отметь на оси МЕНЬШЕЕ из двух чисел. | Mark the SMALLER of the two numbers on the axis. |
| `givenLabel` | Berilgan | Дано | Given |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Yig'indi va ko'paytmadan kvadrat tenglama tuziladi: zet kvadrat minus o'n zet qo'shuv yigirma bir nolga teng. Uning ildizlari uch va yetti, kichigi esa uch. Nuqta bo'yalgan: bu son javobning o'zi. | Верно. По сумме и произведению составляется квадратное уравнение: зет в квадрате минус десять зет плюс двадцать один равно нулю. Его корни — три и семь, меньший из них три. Точка закрашена: это число и есть ответ. | Correct. The sum and the product give a quadratic equation: z squared minus ten z plus twenty-one equals zero. Its roots are three and seven, and the smaller is three. The point is filled: this number is the answer itself. |
| `text` | Ikkala ildiz ham to'g'ri topilgan, lekin savolda KICHIGI so'ralgan. Uch bilan yettini solishtiring. | Оба корня найдены верно, но в вопросе спрашивают МЕНЬШЕЕ. Сравни тройку и семёрку. | Both roots are found correctly, but the question asks for the SMALLER one. Compare three and seven. |
| `text` | Bu berilgan sonlarning o'zi — yig'indi yoki ko'paytma. Sonlarni topish uchun ulardan kvadrat tenglama tuziladi. | Это сами данные числа — сумма или произведение. Чтобы найти числа, из них составляют квадратное уравнение. | Those are the given numbers themselves — the sum or the product. To find the numbers you build a quadratic equation from them. |
| `text` | Bu son javobning o'zi, u albatta javobga kiradi. Bo'sh nuqta chiqarib tashlangan sonni bildiradi. | Это число и есть ответ, оно безусловно в него входит. Пустая точка означает исключённое число. | This number is the answer itself, so it certainly belongs. A hollow point means an excluded number. |
| `text` | Ko'paytmasi yigirma bir, yig'indisi o'n bo'lgan ikki sonni qidiring. Yigirma birning bo'luvchilarini sanab chiqing. | Ищи два числа с произведением двадцать один и суммой десять. Перебери делители двадцати одного. | Look for two numbers with product twenty-one and sum ten. Go through the divisors of twenty-one. |
| `wrongText` | Ko'paytmasi yigirma bir bo'lgan sonlar juftini toping, keyin ulardan yig'indisi o'nga tengini tanlang va kichigini belgilang. | Найди пары чисел с произведением двадцать один, выбери ту, где сумма равна десяти, и отметь меньшее. | Find the pairs with product twenty-one, choose the one whose sum is ten, and mark the smaller number. |

---

## 08 · `ClozeBank` · 🔴 · teg `vieta-teskari-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Sistemaning yechimi — | Решение системы — это пара, удовлетворяющая | A solution of a system is a pair that satisfies |
| `text` | tenglamani ham qanoatlantiradigan juftlik. Yig'indi va ko'paytma ma'lum bo'lsa, sonlar | уравнениям. Если известны сумма и произведение, числа являются корнями | equations. If the sum and the product are known, the numbers are the roots of a |
| `text` | tenglamaning ildizlari bo'ladi. Kvadratlar yig'indisiga ikki karra ko'paytma | уравнения. Если к сумме квадратов удвоенное произведение | equation. If twice the product is |
| `text` | yig'indining kvadrati hosil bo'ladi. | , получится квадрат суммы. | to the sum of the squares, the square of the sum appears. |
| `label` | ikkala | обоим | both |
| `label` | kvadrat | квадратного | quadratic |
| `label` | qo'shilsa | прибавить | added |
| `label` | bitta | одному | one |
| `label` | chiziqli | линейного | linear |
| `label` | ayirilsa | вычесть | subtracted |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoidada darsning uchta ishi turibdi: yechim ikkala tenglamaga ham tegishli, yig'indi bilan ko'paytma sonlarni kvadrat tenglama orqali beradi, va kvadratlar yig'indisi ikki karra ko'paytma bilan to'ldirilganda yig'indining kvadratiga aylanadi. | Верно, все три слова на месте. В правиле стоят три дела урока: решение относится к обоим уравнениям, сумма с произведением дают числа через квадратное уравнение, а сумма квадратов, дополненная удвоенным произведением, превращается в квадрат суммы. | Correct, all three words are in place. The rule holds the three jobs of the lesson: a solution belongs to both equations, the sum and the product give the numbers through a quadratic equation, and the sum of the squares completed by twice the product turns into the square of the sum. |
| `text` | Bitta tenglamani qanoatlantiradigan juftliklar juda ko'p. Yechim bo'lishi uchun ikkalasi ham bir vaqtda bajarilishi kerak. | Пар, удовлетворяющих одному уравнению, очень много. Чтобы быть решением, должны выполняться оба сразу. | There are very many pairs satisfying one equation. To be a solution, both must hold at once. |
| `text` | Chiziqli tenglamaning bitta ildizi bor, bu yerda esa ikkita son qidirilyapti. Ikkita ildiz kvadrat tenglamadan chiqadi. | У линейного уравнения один корень, а здесь ищут два числа. Два корня даёт квадратное уравнение. | A linear equation has one root, but two numbers are being sought here. Two roots come from a quadratic equation. |
| `text` | Yig'indining kvadratini yozib ko'ring: iks kvadrat QO'SHUV ikki iks igrek QO'SHUV igrek kvadrat. Ikkala qo'shuv ham qo'shish, ayirish emas. | Выпиши квадрат суммы: икс в квадрате ПЛЮС два икс игрек ПЛЮС игрек в квадрате. Оба плюса — сложение, а не вычитание. | Write out the square of a sum: x squared PLUS two xy PLUS y squared. Both signs are addition, not subtraction. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nechta tenglama haqida, ikkinchisi qanday tenglama haqida, uchinchisi esa qanday amal haqida. | Проверяй каждую клетку самим предложением: первое про число уравнений, второе про вид уравнения, третье про действие. | Check each blank against the sentence itself: the first is about how many equations, the second about which kind of equation, the third about which operation. |

---

## 09 · `OrderLines` · 🔴 · teg `vieta-teskari-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi. | Пять шагов перемешаны. Вместе они составляют одну цепочку решения. | Five steps are shuffled. Together they make one chain of solution. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Yeching | Решить | Solve |
| `label` | Yig'indi va ko'paytma ma'lum | Известны сумма и произведение | The sum and the product are known |
| `label` | Tenglama tuzamiz: | Составляем уравнение: | Build the equation: |
| `label` | Javob: | Ответ: | Answer: |
| `label` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri. Yig'indi va ko'paytmadan kvadrat tenglama tuziladi, uning ildizlari topiladi, keyin javob yoziladi — va javobda IKKALA juftlik ham turadi, chunki ildizlar orasida tartib yo'q, juftlikda esa bor. Oxirida ikkala shart ham son bilan tekshiriladi. | Верно. По сумме и произведению составляют квадратное уравнение, находят его корни, потом записывают ответ — и в ответе стоят ОБЕ пары, ведь у корней порядка нет, а у пары есть. В конце оба условия проверяют числами. | Correct. The sum and the product give a quadratic equation, its roots are found, then the answer is written — and BOTH pairs stand in it, since roots have no order while a pair does. At the end both conditions are checked with numbers. |
| `text` | Ildizlar tenglamadan chiqadi. Tenglama hali tuzilmagan bo'lsa, uch va beshni qayerdan olasiz? | Корни берутся из уравнения. Если уравнение ещё не составлено, откуда взять тройку и пятёрку? | The roots come from the equation. If the equation is not built yet, where do three and five come from? |
| `text` | Tenglama nimadan tuziladi? Avval yig'indi bilan ko'paytma ma'lumligi aytiladi, keyin ular tenglamaga kiritiladi. | Из чего составляется уравнение? Сначала говорят, что известны сумма и произведение, и только потом вносят их в уравнение. | What is the equation built from? First it is said that the sum and the product are known, and only then they go into the equation. |
| `text` | Tekshirish tayyor javobni tekshiradi. Javob hali yozilmagan bo'lsa, nimani solishtirasiz? | Проверка проверяет готовый ответ. Если ответ ещё не записан, что сравнивать? | The check tests the finished answer. If the answer is not written yet, what would you compare? |
| `text` | Javobda juftliklar turadi, juftliklar esa ildizlardan yig'iladi. Ildizlarni oldin toping. | В ответе стоят пары, а пары собираются из корней. Сначала найди корни. | The answer holds pairs, and pairs are assembled from the roots. Find the roots first. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

---

## 10 · `AuditLines` · 🔴 · teg `juftlik-tartib-farqi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim tayyor, lekin javob to'liq emas. Har bir qator to'g'riday ko'rinadi. | Решение готово, но ответ неполный. Каждая строка выглядит правильной. | The solution is finished, but the answer is incomplete. Every line looks right. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Yeching | Решить | Solve |
| `text` | Javob: | Ответ: | Answer: |
| `text` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Ildizlar to'g'ri topilgan, lekin ulardan IKKITA juftlik yig'iladi: uch-olti va olti-uch. Ildizlar orasida tartib yo'q, juftlikda esa bor — iks uchga ham, oltiga ham teng bo'lishi mumkin. Javobda ikkalasi ham yozilishi kerak edi. To'rtinchi qator xatoni ko'rsatmaydi, chunki u faqat yozilgan juftlikni tekshirgan. | Верно, ошибка в третьей строке. Корни найдены правильно, но из них собираются ДВЕ пары: три-шесть и шесть-три. У корней порядка нет, а у пары есть — икс может равняться и трём, и шести. В ответе должны были стоять обе. Четвёртая строка ошибку не показывает, ведь она проверила только записанную пару. | Correct, the error is in the third line. The roots are found correctly, but TWO pairs are assembled from them: three-six and six-three. Roots have no order, a pair does — x can equal three or six. Both pairs had to stand in the answer. The fourth line does not reveal the error because it checked only the pair that was written. |
| `text` | Bu qator to'g'ri: yig'indi qarama-qarshi ishora bilan, ko'paytma esa o'z ishorasida tushgan. Xatoni undan pastda qidiring. | Эта строка верна: сумма вошла с противоположным знаком, произведение — со своим. Ищи ошибку ниже. | This line is right: the sum entered with the opposite sign and the product with its own. Look for the error below. |
| `text` | Bu ham to'g'ri: uch va oltining yig'indisi to'qqiz, ko'paytmasi o'n sakkiz. Keyingi qadamga qarang — ikki ildizdan nechta juftlik yig'iladi? | Эта тоже верна: сумма трёх и шести — девять, произведение — восемнадцать. Посмотри на следующий шаг: сколько пар собирается из двух корней? | This one is right too: three and six sum to nine and multiply to eighteen. Look at the next step — how many pairs are assembled from two roots? |
| `text` | To'rtinchi qatorda hisob to'g'ri: uch qo'shuv olti haqiqatan to'qqiz. U xatoni ko'rsatmaydi, chunki faqat bitta juftlikni tekshirgan — lekin xatoning o'zi undan yuqorida. | В четвёртой строке вычисления верны: три плюс шесть действительно девять. Она не показывает ошибку, потому что проверила лишь одну пару, — но сама ошибка выше. | The arithmetic in the fourth line is right: three plus six really is nine. It does not reveal the error because it checked only one pair — but the error itself is above. |
| `wrongText` | Ikkita ildizdan nechta juftlik tuzish mumkin? Iks uchga teng bo'lgan holat va iks oltiga teng bo'lgan holat — bir xilmi? | Сколько пар можно составить из двух корней? Случай, когда икс равен трём, и случай, когда икс равен шести, — это одно и то же? | How many pairs can be made from two roots? Is the case x equals three the same as the case x equals six? |

