# DARS12_AMALIYOT_KONTENT — 9-sinf, 12-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars12/D12_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `TrueFalse` · 🟢 · teg `qoshish-orqali-yoqotish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Ikkala tenglamani qo'shishga tayyorlanyapmiz. Uch hukm qo'shishdan keyin nima bo'lishi haqida. | Готовимся сложить оба уравнения. Три суждения — о том, что будет после сложения. | We are getting ready to add both equations. Three claims are about what happens after adding. |
| `ask` | Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Sistema | Система | System |
| `claim` | qo'shilganda bir-birini yo'qotadi. | при сложении уничтожают друг друга. | cancel each other when added. |
| `claim` | ham qo'shilganda yo'qoladi. | тоже исчезает при сложении. | disappears when added as well. |
| `claim` | topilgach, igrek ikkala tenglamadan ham topilishi mumkin. | найден — игрек можно найти из любого из двух уравнений. | once found, y can be found from either of the two equations. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. Uch igrek bilan minus uch igrek qarama-qarshi ishorada, shuning uchun qo'shganda nol beradi. Iks esa ikkala tenglamada ham qo'shi ishorada, demak u yo'qolmaydi, ikkilanadi: ikki iks o'nga teng, iks besh. Igrekni esa ixtiyoriy tenglamadan topish mumkin — ikkalasi ham bir xil natija beradi: besh qo'shuv uch igrek o'n bir, ya'ni igrek ikki; besh minus uch igrek minus bir, yana igrek ikki. | Верно. Три игрека и минус три игрека стоят с противоположными знаками, поэтому при сложении дают нуль. А икс в обоих уравнениях с плюсом, значит он не исчезает, а удваивается: два икса равны десяти, икс равен пяти. Игрек же можно найти из любого уравнения — оба дают одно и то же: пять плюс три игрека — одиннадцать, значит игрек два; пять минус три игрека — минус один, снова игрек два. | Correct. Three y and minus three y have opposite signs, so adding them gives zero. But x carries a plus in both equations, so it does not vanish, it doubles: two x equals ten, x equals five. And y can be found from either equation — both give the same: five plus three y is eleven, so y is two; five minus three y is minus one, again y is two. |
| `text` | Iks ikkala tenglamada ham qo'shi ishorada turibdi. Bir xil ishorada turgan hadlar qo'shilganda yo'qolmaydi, balki ikkilanadi: iks qo'shuv iks ikki iks bo'ladi. | Икс в обоих уравнениях стоит с плюсом. Слагаемые с одинаковым знаком при сложении не исчезают, а удваиваются: икс плюс икс — два икса. | x carries a plus in both equations. Terms with the same sign do not vanish when added, they double: x plus x is two x. |
| `text` | Uch igrekning oldida qo'shuv, ikkinchisining oldida minus turibdi. Ularni qo'shsangiz nol chiqadi — aynan shu narsa qo'shish usulining ma'nosi. | Перед тремя игреками стоит плюс, перед вторыми — минус. Сложив их, получишь нуль — в этом и смысл способа сложения. | The first three y has a plus in front, the second a minus. Adding them gives zero — and that is exactly the point of the addition method. |
| `text` | Sistemaning ikkala tenglamasi ham bir vaqtda bajariladi, shuning uchun igrek ikkalasidan ham bir xil chiqadi. Ikkinchisiga qo'yib ko'rish — bu ayni paytda tekshiruv ham. | Оба уравнения системы выполняются одновременно, поэтому игрек выходит одинаковым из обоих. Подстановка во второе — это заодно и проверка. | Both equations of the system hold at once, so y comes out the same from either. Substituting into the second one doubles as a check. |
| `wrongText` | Har bir hadga alohida qarang: uning ikkala tenglamadagi ishorasi bir xilmi yoki qarama-qarshimi? Javob shundan chiqadi. | Смотри на каждое слагаемое отдельно: его знаки в двух уравнениях одинаковы или противоположны? Из этого и следует ответ. | Look at each term separately: are its signs in the two equations the same or opposite? The answer follows from that. |

---

## 02 · `RowTable` · 🟢 · teg `yigindini-yakuniy-javob-deb-olish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Jadval faqat bitta shartdan tuzilgan: iks bilan igrekning yig'indisi oltiga teng. | Таблица составлена по одному условию: сумма икса и игрека равна шести. | The table is built from one condition only: the sum of x and y is six. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri: ikkiga to'rt, birga besh. Endi eng muhim gap: jadvaldagi to'rttala ustun ham yig'indi shartini bajaradi, lekin ularning bittasigina sistemaning yechimi bo'ladi. Qo'shish usulida ham xuddi shunday — qo'shishdan keyin topilgan yig'indi hali javob emas, u faqat bitta shart. Javob uchun ikkinchi tenglama ham kerak. | Верно: двум — четыре, единице — пять. А теперь главное: все четыре столбца таблицы выполняют условие суммы, но решением системы будет лишь один из них. В способе сложения то же самое — найденная после сложения сумма это ещё не ответ, а только одно условие. Для ответа нужно и второе уравнение. | Correct: two gives four, one gives five. And now the main point: all four columns satisfy the sum condition, yet only one of them is the solution of the system. It is the same in the addition method — the sum found after adding is not an answer yet, only one condition. The second equation is needed for the answer. |
| `text` | Ikkinchi ustunda oltiga ikki qo'shildi. Shart yig'indi haqida: iks bilan igrekning yig'indisi olti bo'lishi kerak, demak igrek olti minus ikki. | Во втором столбце к шести прибавили два. Условие про сумму: сумма икса и игрека должна быть шесть, значит игрек равен шесть минус два. | In the second column two was added to six. The condition is about the sum: x plus y must be six, so y is six minus two. |
| `text` | Uchinchi ustunda birga olti qo'shildi. Bu ustunda igrek berilgan, iks so'ralyapti: nechchi qo'shuv bir olti beradi? | В третьем столбце к единице прибавили шесть. В этом столбце дан игрек, а спрашивают икс: сколько плюс один даёт шесть? | In the third column six was added to one. In this column y is given and x is asked: what plus one makes six? |
| `text` | Katakka yig'indining o'zi yozilgan. Olti — bu iks bilan igrekning YIG'INDISI, alohida katakning qiymati emas. | В клетку записана сама сумма. Шесть — это СУММА икса и игрека, а не значение отдельной клетки. | The sum itself was written into the cell. Six is the SUM of x and y, not the value of a single cell. |
| `text` | Ishora almashdi. Yig'indi olti bo'lishi kerak: manfiy son bilan yig'indi oltidan kichik chiqadi. | Сбился знак. Сумма должна быть шесть: с отрицательным числом сумма выйдет меньше шести. | A sign slipped. The sum must be six: with a negative number the sum comes out less than six. |
| `wrongText` | Har ustunda ikkita sonning yig'indisi oltiga teng bo'lishi kerak. Berilgan sonni oltidan ayirsangiz, ikkinchisi chiqadi. | В каждом столбце сумма двух чисел должна быть равна шести. Вычти известное число из шести — получишь второе. | In every column the two numbers must add up to six. Subtract the known number from six to get the other one. |

---

## 03 · `Choice` · 🟢 · teg `qoshish-orqali-yoqotish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Qo'shish usuli faqat bitta had yo'qolganda ish beradi. Lekin har qanday had yo'qolmaydi. | Способ сложения работает только тогда, когда исчезает одно слагаемое. Но исчезает не всякое слагаемое. | The addition method works only when one term vanishes. But not every term vanishes. |
| `ask` | Had qanday shartda qo'shishda yo'qoladi? | При каком условии слагаемое исчезает при сложении? | Under what condition does a term vanish when the equations are added? |
| `label` | Hadlar ikkala tenglamada bir xil ishorada bo'lsa | Если слагаемые в обоих уравнениях с одинаковым знаком | If the terms have the same sign in both equations |
| `label` | Hadlar qarama-qarshi ishorada va koeffitsientlari teng bo'lsa | Если слагаемые с противоположными знаками и с равными коэффициентами | If the terms have opposite signs and equal coefficients |
| `label` | Hadlar bir xil harf bilan yozilgan bo'lsa | Если слагаемые записаны одной и той же буквой | If the terms are written with the same letter |
| `label` | Had kvadratda turgan bo'lsa | Если слагаемое стоит в квадрате | If the term is squared |
| `correctText` | To'g'ri. Ikkita shart birga kerak. Ishoralar qarama-qarshi bo'lishi kerak, aks holda hadlar qo'shilib ketadi; va koeffitsientlar teng bo'lishi kerak, aks holda hadning bir qismi qoladi. Masalan uch igrek bilan minus uch igrek nol beradi, uch igrek bilan minus ikki igrek esa igrekni qoldiradi. Koeffitsientlar teng bo'lmasa, avval tenglamalar songa ko'paytiriladi. | Верно. Нужны оба условия сразу. Знаки должны быть противоположными, иначе слагаемые сложатся; и коэффициенты должны быть равными, иначе часть слагаемого останется. Скажем, три игрека и минус три игрека дают нуль, а три игрека и минус два игрека оставляют игрек. Если коэффициенты не равны, уравнения сначала умножают на число. | Correct. Both conditions are needed at once. The signs must be opposite, otherwise the terms add up; and the coefficients must be equal, otherwise part of the term is left. For instance three y and minus three y give zero, while three y and minus two y leave a y behind. If the coefficients are unequal, the equations are multiplied by a number first. |
| `text` | Bir xil ishorada turgan hadlar qo'shilganda yo'qolmaydi, ikkilanadi: iks qo'shuv iks ikki iks bo'ladi. Yo'qolish uchun ishoralar QARAMA-QARSHI bo'lishi kerak. | Слагаемые с одинаковым знаком при сложении не исчезают, а удваиваются: икс плюс икс — два икса. Чтобы исчезнуть, знаки должны быть ПРОТИВОПОЛОЖНЫМИ. | Terms with the same sign do not vanish when added, they double: x plus x is two x. To vanish, the signs must be OPPOSITE. |
| `text` | Bir xil harf yetarli emas. Uch igrek bilan minus ikki igrekda ham harf bir xil, lekin qo'shganda igrek qoladi: koeffitsientlar teng emas. | Одной буквы недостаточно. У трёх игреков и минус двух игреков буква одна, но при сложении игрек остаётся: коэффициенты не равны. | The same letter is not enough. Three y and minus two y share the letter, but adding them leaves a y: the coefficients are unequal. |
| `text` | Daraja bunga aloqasi yo'q. Iks kvadrat ham, oddiy iks ham, ko'paytma iks igrek ham — hammasi bir xil qoida bilan yo'qoladi: ishoralar qarama-qarshi, koeffitsientlar teng. | Степень тут ни при чём. И икс в квадрате, и обычный икс, и произведение икс игрек исчезают по одному правилу: противоположные знаки, равные коэффициенты. | The power has nothing to do with it. x squared, a plain x, or the product xy — all vanish by the same rule: opposite signs, equal coefficients. |
| `wrongText` | Ikkita hadni qo'shib ko'ring va nolga tenglashishini tekshiring. Buning uchun ularning ishorasi va koeffitsienti qanday bo'lishi kerak? | Сложи два слагаемых и проверь, получится ли нуль. Какими для этого должны быть их знаки и коэффициенты? | Add two terms together and check whether you get zero. What must their signs and coefficients be for that? |

---

## 04 · `PlacePoint` · 🟡 · teg `orniga-qoyishni-unutish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Qo'shsangiz igrek yo'qoladi va iks topiladi. Lekin yechim — juftlik, demak igrek ham kerak. | При сложении игрек исчезнет и найдётся икс. Но решение — пара, значит нужен и игрек. | Adding makes y vanish and gives x. But a solution is a pair, so y is needed too. |
| `ask` | Sistemaning yechimini tekislikka qo'ying. | Поставь решение системы на плоскость. | Place the solution of the system on the plane. |
| `correctText` | To'g'ri. Qo'shsak, igrek bilan minus igrek nol beradi: ikki iks oltiga teng, iks uch. Endi iksni birinchi tenglamaga qo'yamiz: uch qo'shuv igrek birga teng, ya'ni igrek minus ikki. Nuqta uch va minus ikki. Tekshirish ikkinchi tenglamada: uch minus minus ikki, ya'ni besh — to'g'ri. | Верно. При сложении игрек и минус игрек дают нуль: два икса равны шести, икс равен трём. Теперь подставляем икс в первое уравнение: три плюс игрек равно одному, значит игрек минус два. Точка — три и минус два. Проверка во втором уравнении: три минус минус два, то есть пять — верно. | Correct. Adding makes y and minus y give zero: two x equals six, so x is three. Now substitute x into the first equation: three plus y equals one, so y is minus two. The point is three and minus two. Check in the second equation: three minus minus two, that is five — right. |
| `text` | Koordinatalar o'rin almashdi. Birinchi son har doim iks: uni qo'shish berdi, igrek esa keyin o'rniga qo'yishdan chiqdi. | Координаты поменялись местами. Первое число — всегда икс: его дало сложение, а игрек вышел потом из подстановки. | The coordinates swapped places. The first number is always x: adding gave it, while y came later from the substitution. |
| `text` | Iks to'g'ri topilgan, igrek esa emas. Uchni birinchi tenglamaga qo'ying: uch qo'shuv igrek birga teng bo'lsa, igrek nechchi? | Икс найден верно, а игрек нет. Подставь три в первое уравнение: если три плюс игрек равно одному, чему равен игрек? | x was found correctly but y was not. Put three into the first equation: if three plus y equals one, what is y? |
| `text` | Igrekda ishora tushib qoldi. Uch qo'shuv igrek birga teng: yig'indi uchdan KICHIK, demak igrek manfiy. | В игреке потерялся знак. Три плюс игрек равно одному: сумма МЕНЬШЕ трёх, значит игрек отрицателен. | A sign was lost in y. Three plus y equals one: the sum is LESS than three, so y is negative. |
| `text` | Iks noto'g'ri. Qo'shgandan keyin ikki iks olti bo'ldi, demak iks uchga teng — ikkiga bo'lish qadami tushib qolgan. | Икс неверен. После сложения два икса стали шестью, значит икс равен трём — пропущен шаг деления на два. | x is wrong. After adding, two x became six, so x is three — the step of dividing by two was skipped. |
| `wrongText` | Avval qo'shing va iksni toping, keyin iksni ixtiyoriy tenglamaga qo'yib igrekni toping. Nuqtaning birinchi soni iks. | Сначала сложи и найди икс, потом подставь икс в любое уравнение и найди игрек. Первое число точки — икс. | First add and find x, then substitute x into either equation and find y. The first number of the point is x. |

---

## 05 · `DomainAxis` · 🟡 · teg `orniga-qoyishni-unutish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Qo'shsangiz igrek yo'qoladi va iks topiladi. Savol esa igrek haqida. | При сложении игрек исчезнет и найдётся икс. А вопрос — про игрек. | Adding makes y vanish and gives x. But the question is about y. |
| `ask` | IGREKNI o'qda belgilang. | Отметь на оси ИГРЕК. | Mark Y on the axis. |
| `givenLabel` | Sistema | Система | System |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Qo'shsak, ikki igrek bilan minus ikki igrek nol beradi: ikki iks o'nga teng, iks besh. Bu hali javob emas — savol igrek haqida. Beshni birinchi tenglamaga qo'yamiz: besh qo'shuv ikki igrek to'qqiz, ya'ni ikki igrek to'rt, igrek ikki. Nuqta bo'yalgan: bu aniq son, chiqarib tashlangan chegara emas. | Верно. При сложении два игрека и минус два игрека дают нуль: два икса равны десяти, икс равен пяти. Это ещё не ответ — вопрос про игрек. Подставляем пять в первое уравнение: пять плюс два игрека — девять, значит два игрека — четыре, игрек — два. Точка закрашена: это конкретное число, а не исключённая граница. | Correct. Adding makes two y and minus two y give zero: two x equals ten, so x is five. That is not the answer yet — the question is about y. Substitute five into the first equation: five plus two y is nine, so two y is four and y is two. The point is filled: this is a definite number, not an excluded boundary. |
| `text` | Besh — bu IKS, qo'shishdan chiqqan natija. Uni tenglamaga qaytarib qo'ying va igrekni toping: besh qo'shuv ikki igrek to'qqizga teng. | Пять — это ИКС, результат сложения. Подставь его обратно в уравнение и найди игрек: пять плюс два игрека равно девяти. | Five is X, the result of adding. Put it back into an equation and find y: five plus two y equals nine. |
| `text` | To'rt — bu IKKI igrek, igrekning o'zi emas. Ikkiga bo'lish qadami qoldi. | Четыре — это ДВА игрека, а не сам игрек. Остался шаг деления на два. | Four is TWO y, not y itself. The step of dividing by two is left. |
| `text` | Bu son ikkala tenglamadan ham chiqmaydi. Qo'shishdan ikki iks o'n chiqadi, undan iks besh; keyin igrekni tenglamadan toping. | Это число не выходит ни из одного уравнения. Из сложения получается два икса — десять, отсюда икс пять; потом найди игрек из уравнения. | This number comes from neither equation. Adding gives two x equals ten, hence x is five; then find y from an equation. |
| `text` | Bu son sistemaning yechimiga kiradi, demak nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta chiqarib tashlangan sonni bildiradi. | Это число входит в решение системы, значит точка должна быть закрашена. Пустая точка означает исключённое число. | This number belongs to the solution of the system, so the point must be filled. A hollow point means an excluded number. |
| `text` | Ikki qadam kerak: qo'shish iksni beradi, keyin iks tenglamaga qaytariladi va igrek topiladi. | Нужны два шага: сложение даёт икс, потом икс возвращается в уравнение и находится игрек. | Two steps are needed: adding gives x, then x goes back into an equation and y is found. |
| `wrongText` | Qo'shishdan keyin to'xtamang. Topilgan iksni ixtiyoriy tenglamaga qo'ying, ikki igrekni toping va uni ikkiga bo'ling. | Не останавливайся после сложения. Подставь найденный икс в любое уравнение, найди два игрека и раздели на два. | Do not stop after adding. Put the x you found into either equation, find two y, and divide by two. |

---

## 06 · `TypeSet` · 🟡 · teg `faqat-bitta-yechim-yozish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Qiymatlar | Значения | Values |
| `setup` | Bu yerda qarama-qarshi ishorada iks KVADRAT turibdi. Qo'shsangiz u yo'qoladi va igrek topiladi. | Здесь с противоположными знаками стоит икс в КВАДРАТЕ. При сложении он исчезнет и найдётся игрек. | Here it is x SQUARED that carries opposite signs. Adding makes it vanish and gives y. |
| `ask` | Iksning BARCHA qiymatlarini yozing. | Запиши ВСЕ значения икса. | Write down ALL values of x. |
| `hint` | Bir nechta bo'lsa, nuqta-vergul bilan ajrating. | Если их несколько, раздели точкой с запятой. | If there are several, separate them with a semicolon. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri: minus ikki va ikki. Qo'shsak, iks kvadrat bilan minus iks kvadrat nol beradi: ikki igrek o'n ikkiga teng, igrek olti. Uni birinchi tenglamaga qo'ysak, iks kvadrat to'rtga teng bo'ladi. Iks kvadrat to'rt bo'lsa, iks ikki xil bo'lishi mumkin: ikki va minus ikki, chunki ikkalasining kvadrati ham to'rt. Demak sistemaning ikkita yechimi bor: ikki-olti va minus ikki-olti. | Верно: минус два и два. При сложении икс в квадрате и минус икс в квадрате дают нуль: два игрека равны двенадцати, игрек шесть. Подставив его в первое уравнение, получим икс в квадрате равен четырём. Если икс в квадрате четыре, икс бывает двух видов: два и минус два, ведь квадрат каждого из них четыре. Значит у системы два решения: два-шесть и минус два-шесть. | Correct: minus two and two. Adding makes x squared and minus x squared give zero: two y equals twelve, so y is six. Substituting it into the first equation gives x squared equals four. If x squared is four, x comes in two kinds: two and minus two, since each has square four. So the system has two solutions: two-six and minus two-six. |
| `text` | Bitta ildiz topildi, ikkinchisi tushib qoldi. Minus ikkining kvadrati ham to'rt, demak u ham sistemani qanoatlantiradi. | Найден один корень, второй потерян. Квадрат минус двух тоже четыре, значит он тоже удовлетворяет системе. | One root was found and the other lost. The square of minus two is four as well, so it satisfies the system too. |
| `text` | Bitta ildiz topildi, ikkinchisi tushib qoldi. Kvadrat to'rtga teng bo'lgan ikkinchi son ham bor: ikkining kvadrati ham to'rt. | Найден один корень, второй потерян. Есть и второе число с квадратом четыре: квадрат двух тоже четыре. | One root was found and the other lost. There is a second number with square four: the square of two is four as well. |
| `text` | To'rt — bu iks KVADRAT, iksning o'zi emas. Kvadrati to'rtga teng bo'lgan sonlarni toping. | Четыре — это икс в КВАДРАТЕ, а не сам икс. Найди числа, квадрат которых равен четырём. | Four is x SQUARED, not x itself. Find the numbers whose square is four. |
| `text` | Bu igrekka tegishli son. Qo'shishdan ikki igrek o'n ikki chiqadi, igrek olti; savol esa iks haqida. | Это число относится к игреку. Из сложения получается два игрека — двенадцать, игрек шесть; а вопрос про икс. | That number belongs to y. Adding gives two y equals twelve, so y is six; but the question is about x. |
| `text` | Qo'shishda igreklar ham qo'shilishini unutmang: igrek qo'shuv igrek ikki igrek, o'ng tomonda esa o'n qo'shuv ikki, ya'ni o'n ikki. | Не забывай, что игреки при сложении тоже складываются: игрек плюс игрек — два игрека, а справа десять плюс два, то есть двенадцать. | Remember the y-terms add up too: y plus y is two y, and on the right ten plus two, that is twelve. |
| `wrongText` | Ikkala tenglamani qo'shing, igrekni toping va uni birinchi tenglamaga qaytarib qo'ying. Iks kvadrat topilgach, kvadrati shu songa teng bo'lgan IKKITA sonni yozing. | Сложи оба уравнения, найди игрек и подставь его обратно в первое уравнение. Найдя икс в квадрате, запиши ДВА числа с таким квадратом. | Add both equations, find y, and put it back into the first equation. Once x squared is known, write the TWO numbers with that square. |

---

## 07 · `Zones` · 🟡 · teg `qoshish-orqali-yoqotish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Har bir yozuvni yuqoridagi tenglamaga QO'SHIB ko'ring: nima yo'qoladi? | Прибавь каждую запись к уравнению сверху: что исчезнет? | Add each record to the equation above: what vanishes? |
| `ask` | Yozuvni bosing, keyin guruhni bosing. | Нажми запись, потом нажми группу. | Tap a record, then tap a group. |
| `givenLabel` | Birinchi tenglama | Первое уравнение | First equation |
| `label` | Igrek yo'qoladi | Игрек исчезает | y vanishes |
| `label` | Iks yo'qoladi | Икс исчезает | x vanishes |
| `label` | Hech nima yo'qolmaydi | Ничего не исчезает | Nothing vanishes |
| `correctText` | To'g'ri. Birinchi guruhda igrekning koeffitsienti ikki, ishorasi esa qarama-qarshi — ikki igrek bilan minus ikki igrek nol beradi, iksning koeffitsienti esa ahamiyatsiz. Ikkinchi guruhda iks minus ishorada va koeffitsienti bir, ya'ni yuqoridagi iks bilan yo'qoladi. Uchinchi guruhda esa har ikkala o'zgaruvchi ham bir xil ishorada yoki koeffitsientlari teng emas, shuning uchun qo'shish soddalashtirmaydi — bunday sistemani avval songa ko'paytirish kerak. | Верно. В первой группе коэффициент игрека равен двум, а знак противоположный — два игрека и минус два игрека дают нуль, коэффициент икса при этом не важен. Во второй группе икс стоит с минусом и коэффициентом один, то есть исчезает вместе с иксом сверху. А в третьей группе обе переменные либо с одинаковым знаком, либо с неравными коэффициентами, поэтому сложение не упрощает — такую систему сначала умножают на число. | Correct. In the first group y has coefficient two with the opposite sign — two y and minus two y give zero, and the coefficient of x does not matter. In the second group x carries a minus with coefficient one, so it vanishes together with the x above. In the third group both variables either share a sign or have unequal coefficients, so adding does not simplify — such a system must first be multiplied by a number. |
| `text` | Bu yozuvlarda hech nima yo'qolmaydi. Ikki iks qo'shuv uch igrekni yuqoridagi tenglamaga qo'shsangiz, uch iks qo'shuv besh igrek qoladi — ikkita o'zgaruvchi ham joyida. | В этих записях ничего не исчезает. Прибавив два икса плюс три игрека к уравнению сверху, получишь три икса плюс пять игреков — обе переменные на месте. | Nothing vanishes in these records. Adding two x plus three y to the equation above leaves three x plus five y — both variables are still there. |
| `text` | Bu yerda igrek emas, IKS yo'qoladi: minus iks bilan yuqoridagi qo'shuv iks nol beradi. Igreklarning ishorasi esa bir xil, ular qo'shiladi. | Здесь исчезает не игрек, а ИКС: минус икс и плюс икс сверху дают нуль. А знаки игреков одинаковы, они складываются. | It is not y but X that vanishes here: minus x and the plus x above give zero. The y-terms share a sign, so they add up. |
| `text` | Bu yerda iks yo'qolmaydi: ikkala tenglamada ham u qo'shuv ishorada. Yo'qoladigan narsa igrek — ikki igrek bilan minus ikki igrek. | Здесь икс не исчезает: в обоих уравнениях он с плюсом. Исчезает игрек — два игрека и минус два игрека. | x does not vanish here: it carries a plus in both equations. What vanishes is y — two y and minus two y. |
| `text` | Uchinchi guruhga faqat hech nima yo'qolmaydigan yozuvlar tushadi. Bu yozuvda esa bitta o'zgaruvchi qarama-qarshi ishorada va koeffitsienti teng — u yo'qoladi. | В третью группу попадают только записи, где ничего не исчезает. А в этой записи одна переменная стоит с противоположным знаком и равным коэффициентом — она исчезнет. | Only records where nothing vanishes belong to the third group. In this record one variable has the opposite sign and an equal coefficient — it will vanish. |
| `wrongText` | Har bir yozuvni yuqoridagi tenglamaga qo'shib, natijani yozib ko'ring. Qaysi o'zgaruvchi nolga aylandi? | Прибавь каждую запись к уравнению сверху и выпиши результат. Какая переменная обратилась в нуль? | Add each record to the equation above and write out the result. Which variable turned into zero? |

---

## 08 · `ClozeBank` · 🔴 · teg `yigindini-yakuniy-javob-deb-olish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Qo'shish usulida ikkala tenglama qo'shiladi: qarama-qarshi ishorada turgan had | В способе сложения оба уравнения складываются: слагаемое с противоположными знаками | In the addition method both equations are added: the term with opposite signs |
| `text` | . Qo'shishdan keyin topilgan natija | . Найденный после сложения результат — | . The result found after adding is |
| `text` | , u yana bir tenglamaga qo'yiladi. Kvadrat tenglamaning ikkita ildizi bo'lsa, | , его подставляют ещё в одно уравнение. Если у квадратного уравнения два корня, | , it is substituted into one more equation. If the quadratic has two roots, |
| `text` | . | . | . |
| `label` | yo'qoladi | исчезает | disappears |
| `label` | hali javob emas | ещё не ответ | not the answer yet |
| `label` | ikkalasi ham yoziladi | записывают оба | both are written down |
| `label` | ikkilanadi | удваивается | doubles |
| `label` | allaqachon javob | уже ответ | already the answer |
| `label` | faqat bittasi yoziladi | записывают только одно | only one is written down |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: qarama-qarshi ishorada turgan had qo'shganda yo'qoladi, bir xil ishorada turgani esa ikkilanadi; qo'shishdan chiqqan natija — masalan iks qo'shi igrek yoki iks kvadrat — hali javob emas, uni yana bir tenglamaga qo'yish kerak; va kvadrat tenglama ikkita ildiz bergan joyda sistemaning ham ikkita yechimi bo'ladi, ikkalasi ham yoziladi. | Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: слагаемое с противоположными знаками при сложении исчезает, а с одинаковыми — удваивается; результат сложения, скажем икс плюс игрек или икс в квадрате, это ещё не ответ, его надо подставить ещё в одно уравнение; и там, где квадратное уравнение дало два корня, у системы тоже два решения, и записывают оба. | Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: a term with opposite signs vanishes when added, one with the same sign doubles; the result of adding — say x plus y, or x squared — is not an answer yet and must go into one more equation; and where the quadratic gave two roots, the system has two solutions too, and both are written down. |
| `text` | Ikkilanish bir xil ishorada turgan had bilan bo'ladi: iks qo'shuv iks ikki iks. Qarama-qarshi ishorada esa nol chiqadi. | Удваивается слагаемое с одинаковым знаком: икс плюс икс — два икса. А с противоположными знаками получается нуль. | Doubling happens to a term with the same sign: x plus x is two x. With opposite signs the result is zero. |
| `text` | Qo'shishdan keyin faqat BITTA son topiladi, javob esa juftlik. Shuning uchun natija tenglamaga qaytariladi. | После сложения находится только ОДНО число, а ответ — пара. Поэтому результат возвращают в уравнение. | Adding gives only ONE number, while the answer is a pair. That is why the result goes back into an equation. |
| `text` | Ikkita ildiz ikkita yechim beradi. Bittasini tashlab ketish — sistemaning yarmini yo'qotish bilan barobar. | Два корня дают два решения. Отбросить одно — то же, что потерять половину системы. | Two roots give two solutions. Dropping one is the same as losing half of the system. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi qarama-qarshi ishorada nima bo'lishi haqida, ikkinchisi natija javobmi yoki yo'qmi, uchinchisi esa nechta yechim yozilishi haqida. | Проверяй каждую клетку самим предложением: первая про то, что бывает при противоположных знаках, вторая про то, ответ это или нет, третья про то, сколько решений записывают. | Check each blank against the sentence itself: the first is about what happens with opposite signs, the second about whether the result is an answer, the third about how many solutions are written down. |

---

## 09 · `AuditLines` · 🔴 · teg `orniga-qoyishni-unutish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim qo'shish usulida yozilgan. Qo'shish to'g'ri bajarilgan, xato keyinroq. | Решение записано способом сложения. Сложение выполнено верно, ошибка позже. | The solution is written by the addition method. The adding was done right, the error comes later. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Sistema | Система | System |
| `text` | Qo'shamiz: | Складываем: | Add: |
| `text` | Igrek: | Игрек: | Y: |
| `text` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Birinchi tenglamada iksning oldida UCH turibdi, demak uchni qo'yganda uch karra uch, ya'ni to'qqiz chiqadi: igrek o'n to'rt minus to'qqiz, ya'ni besh. Yozuvda esa uch karra uch hisoblanmagan, o'n to'rtdan uchning o'zi ayirilgan. To'rtinchi qator uchinchisining natijasini ko'chiradi, shuning uchun u ham xato — lekin BIRINCHI xato uchinchi qatorda. | Верно, ошибка в третьей строке. В первом уравнении перед иксом стоит ТРИ, значит при подстановке трёх выйдет трижды три, то есть девять: игрек равен четырнадцать минус девять, то есть пять. А в записи трижды три не посчитано, из четырнадцати вычли сам икс. Четвёртая строка переписывает результат третьей, поэтому она тоже неверна — но ПЕРВАЯ ошибка в третьей строке. | Correct, the error is in the third line. In the first equation x carries a THREE in front, so substituting three gives three times three, that is nine: y equals fourteen minus nine, that is five. In the record three times three was never computed; x itself was subtracted from fourteen. The fourth line copies the result of the third, so it is wrong too — but the FIRST error is in the third line. |
| `text` | Bu qator to'g'ri: igrek bilan minus igrek nol beradi, uch iks qo'shuv uch iks olti iks, o'ng tomonda o'n to'rt qo'shuv to'rt, ya'ni o'n sakkiz. | Эта строка верна: игрек и минус игрек дают нуль, три икса плюс три икса — шесть иксов, справа четырнадцать плюс четыре, то есть восемнадцать. | This line is right: y and minus y give zero, three x plus three x is six x, and on the right fourteen plus four, that is eighteen. |
| `text` | Bu ham to'g'ri: olti iks o'n sakkizga teng bo'lsa, iks uchga teng. Keyingi qatorga qarang — igrek to'g'ri hisoblanganmi? | Эта тоже верна: если шесть иксов равны восемнадцати, икс равен трём. Посмотри на следующую строку: верно ли посчитан игрек? | This one is right too: if six x equals eighteen, then x is three. Look at the next line — is y computed correctly? |
| `text` | To'rtinchi qator xato, lekin u BIRINCHI xato emas: u shunchaki oldingi qatordan ko'chirilgan. Xato aynan igrek hisoblangan joyda paydo bo'lgan. | Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она просто переписана из предыдущей. Ошибка возникла именно там, где считали игрек. | The fourth line is wrong, but it is not the FIRST error: it was simply copied from the line before. The error arose exactly where y was computed. |
| `wrongText` | Uchni birinchi tenglamaga o'zingiz qo'ying: uch karra uch qo'shuv igrek o'n to'rtga teng. Igrek nechchi chiqadi? | Подставь три в первое уравнение сам: трижды три плюс игрек равно четырнадцати. Чему равен игрек? | Substitute three into the first equation yourself: three times three plus y equals fourteen. What is y? |

---

## 10 · `OrderLines` · 🔴 · teg `faqat-bitta-yechim-yozish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Qo'shish usulining beshta qadami aralashtirilgan. | Пять шагов способа сложения перемешаны. | Five steps of the addition method are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Sistema | Система | System |
| `label` | Ikkala tenglamani qo'shamiz, igrek yo'qoladi: | Складываем оба уравнения, игрек исчезает: | Add both equations, y vanishes: |
| `label` | Hosil bo'lgan tenglamani nolga keltiramiz: | Приводим полученное уравнение к нулю: | Bring the equation to zero: |
| `label` | Ildizlarni topamiz: | Находим корни: | Find the roots: |
| `label` | Har bir iks uchun igrekni birinchi tenglamadan topamiz | Для каждого икса находим игрек из первого уравнения | For each x, find y from the first equation |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Qo'shishdan iks kvadrat qo'shuv iks o'n ikkiga teng chiqadi, uni nolga keltirsak, iks kvadrat qo'shuv iks minus o'n ikki nolga teng bo'ladi: ildizlari uch va minus to'rt. Ikkita ildiz bergan joyda ikkita yechim bo'ladi, va har biri uchun igrek alohida topiladi: uchga to'rt, minus to'rtga o'n bir. Tekshiruv ikkinchi tenglamada: to'qqiz minus to'rt besh, o'n olti minus o'n bir ham besh. | Верно. Из сложения выходит икс в квадрате плюс икс равно двенадцати; приведя к нулю, получим икс в квадрате плюс икс минус двенадцать равно нулю: корни три и минус четыре. Там, где корней два, и решений два, и для каждого игрек находится отдельно: трём — четыре, минус четырём — одиннадцать. Проверка во втором уравнении: девять минус четыре — пять, шестнадцать минус одиннадцать — тоже пять. | Correct. Adding gives x squared plus x equals twelve; bringing it to zero gives x squared plus x minus twelve equals zero, with roots three and minus four. Where there are two roots there are two solutions, and y is found separately for each: three gives four, minus four gives eleven. Check in the second equation: nine minus four is five, sixteen minus eleven is five as well. |
| `text` | Javob juftliklardan iborat, ildizlar esa faqat ikslar. Har bir iks uchun igrek topilmasa, javob yozib bo'lmaydi. | Ответ состоит из пар, а корни — только иксы. Пока для каждого икса не найден игрек, ответ записать нельзя. | The answer consists of pairs, while the roots are only x-values. Until y is found for each x, the answer cannot be written. |
| `text` | Nolga keltiriladigan tenglama qo'shishdan hosil bo'ladi. Qo'shishdan oldin nolga keltirish uchun hech nima yo'q. | Уравнение, которое приводят к нулю, возникает после сложения. До сложения приводить нечего. | The equation that gets brought to zero arises from adding. Before the adding there is nothing to bring anywhere. |
| `text` | Ildizlar nolga keltirilgan tenglamadan topiladi. Ikki tomonda ham had turgan yozuvdan Viyet teoremasi ham, diskriminant ham ishlamaydi. | Корни находят по уравнению, приведённому к нулю. Из записи, где слагаемые стоят с обеих сторон, не работают ни теорема Виета, ни дискриминант. | The roots come from the equation brought to zero. With terms on both sides neither Vieta nor the discriminant applies. |
| `text` | Igrekni nimadan topasiz, agar ikslar hali topilmagan bo'lsa? Avval ildizlar chiqadi. | Из чего находить игрек, если иксы ещё не найдены? Сначала выходят корни. | From what would you find y if the x-values are not found yet? The roots come first. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

