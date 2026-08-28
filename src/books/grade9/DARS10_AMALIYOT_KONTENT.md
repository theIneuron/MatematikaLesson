# DARS10_AMALIYOT_KONTENT — 9-sinf, 10-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars10/D10_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `Choice` · 🟢 · teg `grafik-kesishish-nuqtasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Chiziq va parabola bitta tekislikda. Ularning umumiy nuqtasi bor. | Прямая и парабола на одной плоскости. У них есть общая точка. | A line and a parabola on one plane. They have a common point. |
| `ask` | Umumiy nuqta haqida qaysi tasdiq to'g'ri? | Какое утверждение об общей точке верно? | Which statement about the common point is right? |
| `givenLabel` | Sistema | Система | System |
| `label` | Ikkala tenglamani ham qanoatlantiradi | Удовлетворяет обоим уравнениям | It satisfies both equations |
| `label` | Faqat parabolaning tenglamasini qanoatlantiradi | Удовлетворяет только уравнению параболы | It satisfies only the parabola |
| `label` | Umumiy nuqta doim bitta bo'ladi | Общая точка всегда одна | There is always exactly one such point |
| `label` | To'r chizig'idagi har qanday nuqta — yechim | Любая точка на линии сетки — решение | Any point on a grid line is a solution |
| `correctText` | To'g'ri. Kesishish nuqtasi IKKALA grafikda ham yotadi, ya'ni uning koordinatalari ikkala tenglamani ham qanoatlantiradi — sistemaning yechimi aynan shu. Shuning uchun u ikkala tenglamada tekshiriladi. | Верно. Точка пересечения лежит на ОБОИХ графиках, значит её координаты удовлетворяют обоим уравнениям — это и есть решение системы. Потому точку с графика проверяют в обоих уравнениях. | Correct. A crossing point lies on BOTH graphs, so its coordinates satisfy both equations — that is what a solution of a system is. This is why it is checked in both equations. |
| `text` | Nuqta faqat parabolada yotsa, u parabolaning nuqtasi, kesishish nuqtasi emas. Kesishish uchun u chiziqda ham yotishi kerak. | Если точка лежит только на параболе, это точка параболы, а не пересечения. Чтобы быть пересечением, она должна лежать и на прямой. | If a point lies only on the parabola, it is a point of the parabola, not a crossing. To be a crossing it must lie on the line too. |
| `text` | Parabolani ko'z oldingizga keltiring va uni chiziq bilan kesib o'ting: chiziqni yuqoriroq surib ikkita, pastroq surib nolta kesishish olish mumkin. | Представь параболу и проведи через неё прямую: сдвинув прямую выше, получишь две точки, ниже — ни одной. | Picture a parabola and draw a line across it: moved higher the line gives two points, moved lower — none. |
| `text` | To'r chizig'i shunchaki yordamchi belgi. Nuqta yechim bo'ladimi yoki yo'q — buni faqat tenglamalarga qo'yib tekshirish hal qiladi. | Линия сетки — просто вспомогательная разметка. Решение точка или нет, решает только подстановка в уравнения. | A grid line is just auxiliary marking. Whether a point is a solution is decided only by substituting into the equations. |
| `wrongText` | Savolni shunday qo'ying: nuqta yechim bo'lishi uchun nechta tenglamani qanoatlantirishi kerak? | Поставь вопрос так: скольким уравнениям должна удовлетворять точка, чтобы быть решением? | Put the question this way: how many equations must a point satisfy to be a solution? |

---

## 02 · `TrueFalse` · 🟢 · teg `nechta-kesishish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Bitta tekislikda chiziq va parabola turibdi. Uch mulohaza ularning umumiy nuqtalari soni haqida. | На одной плоскости стоят прямая и парабола. Три суждения — про число их общих точек. | A line and a parabola stand on one plane. Three claims are about the number of their common points. |
| `ask` | Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `claim` | ta umumiy nuqta — shunday bo'lishi mumkin. | общие точки — так бывает. | common points — this is possible. |
| `claim` | ta umumiy nuqta — bu ham mumkin. | общих точек — так тоже бывает. | common points — this happens too. |
| `claim` | ta umumiy nuqta — yagona mumkin bo'lgan hol. | общая точка — единственно возможный случай. | common point — the only possible case. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. Chiziqni parabola bo'ylab yuqoriga surib boring: avval u parabolani ikki joyda kesadi, keyin faqat urinib o'tadi, keyin esa umuman tegmaydi. Demak umumiy nuqtalar soni ikkita, bitta yoki nolta bo'lishi mumkin — bu tenglashtirishdan chiqqan kvadrat tenglamaning nechta ildizi borligi bilan bir xil savol. | Верно. Двигай прямую вдоль параболы вверх: сначала она пересекает параболу в двух местах, потом лишь касается, а потом не задевает вовсе. Значит, общих точек может быть две, одна или ни одной — это тот же вопрос, сколько корней у квадратного уравнения, полученного приравниванием. | Correct. Slide the line up along the parabola: first it crosses in two places, then it only touches, then it misses entirely. So the number of common points can be two, one, or none — the same question as how many roots the quadratic from equating them has. |
| `text` | Bitta nuqta — bu faqat URINISH holati, ya'ni maxsus hol. Chiziqni parabolaga nisbatan yuqoriroq yoki pastroq suring va nechta kesishish qolganini sanang. | Одна точка — это только случай КАСАНИЯ, то есть особый случай. Сдвинь прямую выше или ниже относительно параболы и сосчитай, сколько пересечений осталось. | One point is only the TOUCHING case, a special one. Move the line higher or lower relative to the parabola and count how many crossings remain. |
| `text` | Parabola butun tekislikni to'ldirmaydi: uning ustida ham, ostida ham bo'sh joy bor. O'sha bo'sh joydan o'tgan chiziq parabolaga tegmaydi. | Парабола не заполняет всю плоскость: и над ней, и под ней есть пустое место. Прямая, прошедшая по этому пустому месту, параболы не касается. | A parabola does not fill the plane: there is empty room above it and below it. A line running through that empty room never touches the parabola. |
| `text` | Tenglashtirsak, kvadrat tenglama hosil bo'ladi. Kvadrat tenglamaning nechta ildizi bo'lishi mumkinligini eslang — har bir ildiz bitta umumiy nuqta beradi. | Приравняв, получим квадратное уравнение. Вспомни, сколько корней бывает у квадратного уравнения, — каждый корень даёт одну общую точку. | Equating gives a quadratic equation. Recall how many roots a quadratic can have — each root gives one common point. |
| `wrongText` | Tenglashtirishdan chiqqan kvadrat tenglamaning ildizlari soni bilan umumiy nuqtalar soni bir xil. Kvadrat tenglamada esa ildiz ikkita, bitta yoki umuman bo'lmasligi mumkin. | Число общих точек совпадает с числом корней квадратного уравнения, полученного приравниванием. А у квадратного уравнения корней бывает два, один или ни одного. | The number of common points equals the number of roots of the quadratic obtained by equating. And a quadratic has two roots, one, or none. |

---

## 03 · `RowTable` · 🟢 · teg `faqat-bir-chiziqda-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Jadval faqat CHIZIQdan tuzilgan: har ustunda igrek iksdan bittaga katta. | Таблица составлена только по ПРЯМОЙ: в каждом столбце игрек на единицу больше икса. | The table is built from the LINE only: in every column y is one more than x. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Uchinchi ustunda igrek ikkiga, to'rtinchisida esa iks ikkiga teng. Diqqat: bu ustunlarning hammasi CHIZIQda yotadi, lekin sistemaning yechimi bo'lishi shart emas — buning uchun ular parabolada ham yotishi kerak. Masalan bir-ikki paraboladan tashqarida: bir kvadrat minus bir nolga teng, ikkiga emas. | Верно. В третьем столбце игрек равен двум, в четвёртом икс равен двум. Внимание: все эти столбцы лежат на ПРЯМОЙ, но решениями системы быть не обязаны — для этого они должны лежать и на параболе. Скажем, один-два вне параболы: один в квадрате минус один — нуль, а не два. | Correct. In the third column y is two, in the fourth x is two. Note: all these columns lie on the LINE, but they need not be solutions of the system — for that they must lie on the parabola too. One-two, say, is off the parabola: one squared minus one is zero, not two. |
| `text` | To'rtinchi ustunda igrek berilgan, iks so'ralyapti. Igrek iksdan bittaga KATTA, demak iks igrekdan bittaga kichik. | В четвёртом столбце дан игрек, а спрашивают икс. Игрек БОЛЬШЕ икса на единицу, значит икс меньше игрека на единицу. | In the fourth column y is given and x is asked. y is one MORE than x, so x is one less than y. |
| `text` | Uchinchi ustunda parabolaning qoidasi ishlatildi: bir kvadrat minus bir nolga teng. Lekin bu jadval CHIZIQniki: igrek iks qo'shuv bir. | В третьем столбце сработало правило параболы: один в квадрате минус один равно нулю. Но эта таблица — ПРЯМОЙ: игрек равен икс плюс один. | In the third column the rule of the parabola was used: one squared minus one is zero. But this table belongs to the LINE: y equals x plus one. |
| `wrongText` | Har bir katakni jadvalning tepasidagi tenglama bilan tekshiring: igrek iks qo'shuv bir. Berilgan katakni tenglamaga qo'ying va ikkinchisini toping. | Проверяй каждую клетку по уравнению над таблицей: игрек равен икс плюс один. Подставь известную клетку и найди вторую. | Check each cell against the equation above the table: y equals x plus one. Substitute the known cell and find the other one. |

---

## 04 · `TypeSet` · 🟡 · teg `nechta-kesishish-notogri`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Abssissalar | Абсциссы | Abscissas |
| `setup` | Kesishish nuqtasida ikkala igrek ham bir xil. Demak o'ng qismlarni tenglashtirish mumkin. | В точке пересечения оба игрека одинаковы. Значит, правые части можно приравнять. | At a crossing point both y-values are the same. So the right-hand sides can be equated. |
| `ask` | Kesishish nuqtalarining BARCHA abssissalarini yozing. | Запиши ВСЕ абсциссы точек пересечения. | Write down ALL abscissas of the crossing points. |
| `hint` | Bir nechta bo'lsa, nuqta-vergul bilan ajrating. | Если их несколько, раздели точкой с запятой. | If there are several, separate them with a semicolon. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri: minus bir va ikki. Tenglashtirsak, iks qo'shuv bir iks kvadrat minus birga teng bo'ladi, hamma hadni chapga o'tkazsak iks kvadrat minus iks minus ikki nolga teng. Uning ildizlari minus bir va ikki — demak umumiy nuqta IKKITA. Kvadrat tenglamaning ikkinchi ildizini tashlab ketish grafikda bitta kesishishni ko'rmaslik bilan bir xil. | Верно: минус один и два. Приравняв, получим икс плюс один равно икс в квадрате минус один; перенеся всё влево, получим икс в квадрате минус икс минус два равно нулю. Его корни — минус один и два, значит общих точек ДВЕ. Отбросить второй корень квадратного уравнения — то же самое, что не увидеть на графике одно пересечение. | Correct: minus one and two. Equating gives x plus one equals x squared minus one; moving everything left gives x squared minus x minus two equals zero. Its roots are minus one and two, so there are TWO common points. Dropping the second root of a quadratic is the same as missing one crossing on the graph. |
| `text` | Bitta ildiz topildi, ikkinchisi tushib qoldi. Kvadrat tenglamaning ikkita ildizi bor: ko'paytmasi minus ikki, yig'indisi bir bo'lgan ikkinchi sonni ham toping. | Найден один корень, второй потерян. У квадратного уравнения два корня: найди и второе число, у которого произведение минус два, а сумма один. | One root was found and the other lost. The quadratic has two roots: find the second number too, with product minus two and sum one. |
| `text` | Bitta ildiz topildi, ikkinchisi tushib qoldi. Grafikda ikkita kesishish bor, demak ikkita abssissa bo'lishi kerak. | Найден один корень, второй потерян. На графике два пересечения, значит и абсцисс должно быть две. | One root was found and the other lost. There are two crossings on the graph, so there must be two abscissas. |
| `text` | Bular kesishishlarning ORDINATALARI. Savolda abssissa, ya'ni iks so'ralgan. | Это ОРДИНАТЫ пересечений. В вопросе спрашивают абсциссу, то есть икс. | Those are the ORDINATES of the crossings. The question asks for the abscissa, that is x. |
| `text` | Hadlarni ko'chirishda ishora adashdi. O'ng qismdagi minus birni chapga o'tkazsangiz, u qo'shuv bir bo'ladi: iks kvadrat minus iks minus ikki nolga teng. | При переносе слагаемых сбился знак. Перенеся минус один справа налево, получишь плюс один: икс в квадрате минус икс минус два равно нулю. | A sign slipped while moving terms. Moving the minus one from the right gives plus one: x squared minus x minus two equals zero. |
| `wrongText` | Ikkala o'ng qismni tenglashtiring, hamma hadni bir tomonga o'tkazing va hosil bo'lgan kvadrat tenglamani yeching. Uning ildizlari nechta bo'lsa, kesishish ham shuncha. | Приравняй обе правые части, перенеси все слагаемые в одну сторону и реши полученное квадратное уравнение. Сколько у него корней, столько и пересечений. | Equate the two right-hand sides, move all terms to one side and solve the quadratic. It has as many roots as there are crossings. |

---

## 05 · `Zones` · 🟡 · teg `faqat-bir-chiziqda-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Oltita nuqta berilgan. Har birini ikkala tenglamada ham tekshiring. | Даны шесть точек. Проверь каждую в обоих уравнениях. | Six points are given. Check each one in both equations. |
| `ask` | Nuqtani bosing, keyin guruhni bosing. | Нажми точку, потом нажми группу. | Tap a point, then tap a group. |
| `givenLabel` | Sistema | Система | System |
| `label` | Ikkalasida ham | На обоих | On both |
| `label` | Faqat chiziqda | Только на прямой | On the line only |
| `label` | Faqat parabolada | Только на параболе | On the parabola only |
| `correctText` | To'g'ri. Birinchi guruhdagi ikki nuqta ikkala tenglamani ham qanoatlantiradi — bular kesishishlar, ya'ni sistemaning yechimlari. Qolgan to'rttasi faqat bitta grafikda yotadi: ikki-uch bilan minus bir-nol ikkalasida ham to'g'ri chiqadi, nol-bir esa parabolada emas, uch-sakkiz chiziqda emas. Nuqtani BITTA tenglamada tekshirib qo'yish ana shu farqni ko'rsatmaydi. | Верно. Две точки первой группы удовлетворяют обоим уравнениям — это пересечения, то есть решения системы. Остальные четыре лежат только на одном графике: два-три и минус один-нуль верны в обоих, а нуль-один не на параболе, три-восемь не на прямой. Проверка точки в ОДНОМ уравнении этой разницы не показывает. | Correct. The two points in the first group satisfy both equations — they are the crossings, that is, the solutions of the system. The other four lie on one graph only: two-three and minus one-zero hold in both, while zero-one is off the parabola and three-eight is off the line. Checking a point in ONE equation does not reveal this difference. |
| `text` | Bu nuqtalar chiziqning tenglamasini qanoatlantiradi, lekin parabolanikini yo'q. Nol-birni parabolaga qo'ying: nol kvadrat minus bir minus birga teng, birga emas. | Эти точки удовлетворяют уравнению прямой, но не параболы. Подставь нуль-один в параболу: нуль в квадрате минус один равно минус одному, а не одному. | These points satisfy the line but not the parabola. Put zero-one into the parabola: zero squared minus one is minus one, not one. |
| `text` | Bu nuqtalar parabolada yotadi, lekin chiziqda emas. Uch-sakkizni chiziqqa qo'ying: uch qo'shuv bir to'rt, sakkiz emas. | Эти точки лежат на параболе, но не на прямой. Подставь три-восемь в прямую: три плюс один — четыре, а не восемь. | These points lie on the parabola but not on the line. Put three-eight into the line: three plus one is four, not eight. |
| `text` | Ikki-uchni ikkala tenglamada tekshiring: ikki qo'shuv bir uch, ikki kvadrat minus bir ham uch. Ikkalasi ham bajarilsa, nuqta ikkala grafikda yotadi. | Проверь два-три в обоих уравнениях: два плюс один — три, два в квадрате минус один — тоже три. Если верно и то и другое, точка лежит на обоих графиках. | Check two-three in both equations: two plus one is three, two squared minus one is three as well. If both hold, the point lies on both graphs. |
| `text` | Guruhlar almashib ketdi. Chiziq — igrek iks qo'shuv bir, parabola — igrek iks kvadrat minus bir. Har nuqtani ikkalasiga alohida qo'yib ko'ring. | Группы перепутаны. Прямая — игрек равен икс плюс один, парабола — игрек равен икс в квадрате минус один. Подставь каждую точку в обе по очереди. | The groups got swapped. The line is y equals x plus one, the parabola is y equals x squared minus one. Put each point into both in turn. |
| `wrongText` | Har bir nuqta uchun ikkita tekshiruv qiling: avval chiziqqa qo'ying, keyin parabolaga. Ikkalasi ham to'g'ri chiqsa — birinchi guruh. | Для каждой точки делай две проверки: сначала подставь в прямую, потом в параболу. Верно и там и там — первая группа. | Make two checks for every point: put it into the line, then into the parabola. Both true — the first group. |

---

## 06 · `DomainAxis` · 🟡 · teg `nuqta-taxmin-emas-tekshiruv`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Bu yerda parabola o'sha, chiziq esa boshqa. Kesishishlarni yana tenglashtirish beradi. | Парабола здесь та же, а прямая другая. Пересечения снова даёт приравнивание. | The parabola here is the same, the line is different. Equating again gives the crossings. |
| `ask` | Kesishish abssissalaridan KATTASINI o'qda belgilang. | Отметь на оси БОЛЬШУЮ из абсцисс пересечения. | Mark the LARGER of the crossing abscissas on the axis. |
| `givenLabel` | Sistema | Система | System |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Tenglashtirsak, iks qo'shuv besh iks kvadrat minus birga teng; hamma hadni o'ngga o'tkazsak iks kvadrat minus iks minus olti nolga teng bo'ladi. Ildizlari minus ikki va uch, kattasi esa uch. Nuqta bo'yalgan: bu abssissa haqiqiy kesishishga tegishli, chiqarilgan son emas. | Верно. Приравняв, получим икс плюс пять равно икс в квадрате минус один; перенеся всё вправо, получим икс в квадрате минус икс минус шесть равно нулю. Корни — минус два и три, больший из них три. Точка закрашена: эта абсцисса принадлежит настоящему пересечению, а не исключена. | Correct. Equating gives x plus five equals x squared minus one; moving everything right gives x squared minus x minus six equals zero. The roots are minus two and three, and the larger is three. The point is filled: this abscissa belongs to a real crossing, it is not excluded. |
| `text` | Ikkala ildiz ham to'g'ri, lekin savolda KATTASI so'ralgan. Minus ikki bilan uchni sonlar o'qida solishtiring. | Оба корня верны, но в вопросе спрашивают БОЛЬШИЙ. Сравни минус два и три на числовой оси. | Both roots are right, but the question asks for the LARGER one. Compare minus two and three on the number line. |
| `text` | Bu chiziqning ozod hadi, kesishishning abssissasi emas. Avval ikkala o'ng qismni tenglashtiring. | Это свободный член прямой, а не абсцисса пересечения. Сначала приравняй обе правые части. | That is the constant term of the line, not a crossing abscissa. Equate the two right-hand sides first. |
| `text` | Bu kesishishning ORDINATASI emas ham, abssissasi ham emas. Iks kvadrat minus iks minus olti nolga teng tenglamani yeching: ko'paytmasi minus olti, yig'indisi bir bo'lgan ikki sonni qidiring. | Это не ордината пересечения и не его абсцисса. Реши уравнение икс в квадрате минус икс минус шесть равно нулю: ищи два числа с произведением минус шесть и суммой один. | That is neither the ordinate of a crossing nor its abscissa. Solve x squared minus x minus six equals zero: look for two numbers with product minus six and sum one. |
| `text` | Bu abssissa javobga kiradi: uning ustida haqiqiy kesishish turibdi. Bo'sh nuqta chiqarilgan sonni bildiradi. | Эта абсцисса входит в ответ: над ней стоит настоящее пересечение. Пустая точка означает исключённое число. | This abscissa belongs to the answer: a real crossing stands above it. A hollow point means an excluded number. |
| `text` | Ikkala o'ng qismni tenglashtiring va hosil bo'lgan kvadrat tenglamani yeching. Undan keyin ikki ildizdan kattasini tanlang. | Приравняй обе правые части и реши полученное квадратное уравнение. Потом выбери больший из двух корней. | Equate the two right-hand sides and solve the quadratic. Then choose the larger of the two roots. |
| `wrongText` | Iks qo'shuv besh iks kvadrat minus birga teng — bu tenglamani nolga keltiring, ildizlarini toping va kattasini belgilang. | Икс плюс пять равно икс в квадрате минус один — приведи это уравнение к нулю, найди корни и отметь больший. | x plus five equals x squared minus one — bring this to zero, find the roots and mark the larger one. |

---

## 07 · `PlacePoint` · 🟡 · teg `grafik-kesishish-nuqtasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Ikkala grafik chizilgan: to'g'ri chiziq va parabola. | Оба графика построены: прямая и парабола. | Both graphs are drawn: the line and the parabola. |
| `ask` | Ikkala kesishish nuqtasini ham qo'ying. | Поставь обе точки пересечения. | Place both crossing points. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri. Uzluksiz chiziq va punktir parabola ikki joyda kesishadi: minus bir-nol va ikki-uch. Ikkalasini ham tenglamalarga qo'yib tekshirish mumkin: minus bir qo'shuv bir nol, minus bir kvadrat minus bir ham nol; ikki qo'shuv bir uch, ikki kvadrat minus bir ham uch. Grafik yechimni KO'RSATADI, tekshiruv esa uni TASDIQLAYDI. | Верно. Сплошная прямая и пунктирная парабола пересекаются в двух местах: минус один-нуль и два-три. Обе можно подставить в уравнения: минус один плюс один — нуль, минус один в квадрате минус один — тоже нуль; два плюс один — три, два в квадрате минус один — тоже три. График ПОКАЗЫВАЕТ решение, а проверка его ПОДТВЕРЖДАЕТ. | Correct. The solid line and the dashed parabola cross in two places: minus one-zero and two-three. Both can be substituted: minus one plus one is zero, minus one squared minus one is zero as well; two plus one is three, two squared minus one is three as well. The graph SHOWS the solution, the check CONFIRMS it. |
| `text` | Koordinatalar o'rin almashdi. Birinchi son har doim abssissa: gorizontal o'q bo'ylab qancha yurilganini bildiradi. | Координаты поменялись местами. Первое число — всегда абсцисса: сколько прошли по горизонтальной оси. | The coordinates swapped places. The first number is always the abscissa: how far you went along the horizontal axis. |
| `text` | Bu parabolaning uchi, kesishish emas — va ayni paytda minus bir-nolning teskarisi. Chiziq u yerdan o'tmaydi: nolda chiziqning igregi birga teng. | Это вершина параболы, а не пересечение, и заодно перевёрнутая пара минус один-нуль. Прямая через неё не проходит: в нуле у прямой игрек равен единице. | That is the vertex of the parabola, not a crossing — and also minus one-zero written backwards. The line does not pass through it: at zero the line has y equal to one. |
| `text` | Bitta nuqta qo'yildi, ikkinchisi qoldi. Grafikka yana bir bor qarang: chiziq parabolani nechta joyda kesib o'tyapti? | Поставлена одна точка, вторая осталась. Посмотри на график ещё раз: в скольких местах прямая пересекает параболу? | One point was placed and the other left out. Look at the graph again: in how many places does the line cross the parabola? |
| `text` | Bu nuqta chiziqda yotadi, lekin parabolada emas. Kesishish uchun u IKKALA chiziqda ham bo'lishi kerak. | Эта точка лежит на прямой, но не на параболе. Для пересечения она должна быть на ОБЕИХ линиях. | This point lies on the line but not on the parabola. For a crossing it must be on BOTH curves. |
| `wrongText` | Grafikda ikkala chiziq bir joyda uchrashgan nuqtalarni qidiring va har birining koordinatalarini o'qda sanab oling. | Ищи на графике точки, где обе линии сошлись в одном месте, и считай координаты каждой по осям. | Look for the points where both curves meet, and read each one's coordinates off the axes. |

---

## 08 · `OrderLines` · 🔴 · teg `nuqta-taxmin-emas-tekshiruv`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Grafik usulning beshta qadami aralashtirilgan. | Пять шагов графического способа перемешаны. | Five steps of the graphical method are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Sistema | Система | System |
| `label` | Har bir tenglamani igrek orqali yozamiz | Записываем каждое уравнение через игрек | Write each equation in terms of y |
| `label` | Ikkala grafikni bitta tekislikda chizamiz | Строим оба графика на одной плоскости | Draw both graphs on one plane |
| `label` | Kesishishlarning koordinatalarini o'qiymiz | Считываем координаты пересечений | Read off the coordinates of the crossings |
| `label` | Har bir nuqtani ikkala tenglamada tekshiramiz | Проверяем каждую точку в обоих уравнениях | Check each point in both equations |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Grafik usulda tekshiruv javobdan OLDIN turadi, va bu tasodif emas: grafikdan o'qilgan nuqta hali taxmin — to'r chizig'iga tushgan har qanday nuqta yechim bo'lavermaydi. Faqat ikkala tenglamaga qo'yib ko'rgandan keyin u javobga aylanadi. | Верно. В графическом способе проверка стоит ПЕРЕД ответом, и это не случайность: точка, прочитанная с графика, пока лишь предположение — не всякая точка, попавшая на линию сетки, решение. Ответом она становится только после подстановки в оба уравнения. | Correct. In the graphical method the check comes BEFORE the answer, and that is no accident: a point read off the graph is still a guess — not every point landing on a grid line is a solution. It becomes an answer only after substitution into both equations. |
| `text` | Javob tekshiruvdan oldin turibdi. Grafikdan o'qilgan nuqta hali taxmin: uni tenglamalar tasdiqlagandan keyingina javob deb yozish mumkin. | Ответ стоит раньше проверки. Точка, прочитанная с графика, — пока предположение: записать её ответом можно только после того, как её подтвердят уравнения. | The answer stands before the check. A point read off the graph is still a guess: it may be written as an answer only after the equations confirm it. |
| `text` | Koordinatalar chizmadan o'qiladi. Grafiklar hali chizilmagan bo'lsa, nimadan o'qiysiz? | Координаты считывают с чертежа. Если графики ещё не построены, с чего считывать? | Coordinates are read off a drawing. If the graphs are not built yet, what would you read from? |
| `text` | Grafikni chizish uchun har bir tenglama igrek orqali yozilgan bo'lishi kerak: shundagina har iksga igrek qo'yiladi. | Чтобы построить график, каждое уравнение должно быть записано через игрек: только тогда каждому иксу отвечает игрек. | To draw a graph each equation must be written in terms of y: only then does every x get a y. |
| `text` | Tekshirish nimani tekshiradi? Avval nuqtalar o'qilishi kerak, keyin ular tenglamalarga qo'yiladi. | Что проверяет проверка? Сначала точки надо считать, и только потом подставлять их в уравнения. | What does the check test? The points must be read first, and only then substituted into the equations. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

---

## 09 · `ClozeBank` · 🔴 · teg `grafik-kesishish-nuqtasi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Sistemaning grafik yechimi — ikkala grafikning | Графическое решение системы — это точки | The graphical solution of a system is the points where the two graphs |
| `text` | nuqtalari. To'g'ri chiziq va parabolaning umumiy nuqtalari | обоих графиков. Общих точек у прямой и параболы не больше | . A line and a parabola have at most |
| `text` | ortiq bo'lmaydi. Grafikdan o'qilgan nuqta | . Точку, прочитанную с графика, проверяют | common points. A point read off the graph is checked in |
| `text` | tekshiriladi. | . | . |
| `label` | kesishish | пересечения | cross |
| `label` | ikkitadan | двух | two |
| `label` | ikkala tenglamada ham | в обоих уравнениях | both equations |
| `label` | urinish | касания | touch |
| `label` | bittadan | одной | one |
| `label` | faqat bitta tenglamada | только в одном уравнении | only one equation |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: kesishish nuqtasi sistemaning yechimi; chiziq va parabolada bunday nuqta ikkitadan ortiq bo'lmaydi, lekin bittasi ham, nolta ham bo'lishi mumkin; va grafikdan o'qilgan nuqta ikkala tenglamada tekshiriladi, faqat bittasida emas. | Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: точка пересечения — решение системы; у прямой и параболы таких точек не больше двух, но может быть и одна, и ни одной; и точку с графика проверяют в обоих уравнениях, а не в одном. | Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: a crossing point is a solution of the system; a line and a parabola have at most two such points, though there may be one or none; and a point read off the graph is checked in both equations, not one. |
| `text` | Urinish — bu kesishishning maxsus holi, ikkita nuqta bittaga qo'shilib ketgani. Umumiy ta'rifda esa kesishish turishi kerak. | Касание — частный случай пересечения, когда две точки слились в одну. В общем определении должно стоять пересечение. | Touching is a special case of crossing, where two points merge into one. The general definition needs crossing. |
| `text` | Chiziqni parabolaga botiring: u ikki joyda kesib o'tadi. Demak chegara bitta emas, ikkita. | Погрузи прямую в параболу: она пересечёт её в двух местах. Значит граница не одна, а две. | Sink the line into the parabola: it crosses in two places. So the bound is two, not one. |
| `text` | Bitta tenglamani qanoatlantiradigan nuqtalar cheksiz ko'p — ular butun grafikni tashkil qiladi. Yechim bo'lishi uchun nuqta ikkalasini ham qanoatlantirishi kerak. | Точек, удовлетворяющих одному уравнению, бесконечно много — из них и состоит весь график. Чтобы быть решением, точка должна удовлетворять обоим. | There are infinitely many points satisfying one equation — the whole graph is made of them. To be a solution a point must satisfy both. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nuqta qanday hosil bo'lishi haqida, ikkinchisi ularning eng ko'p soni haqida, uchinchisi esa nechta tenglamada tekshirilishi haqida. | Проверяй каждую клетку самим предложением: первое про то, как возникает точка, второе про их наибольшее число, третье про то, в скольких уравнениях идёт проверка. | Check each blank against the sentence itself: the first is about how the point arises, the second about their largest number, the third about how many equations the check uses. |

---

## 10 · `AuditLines` · 🔴 · teg `faqat-bir-chiziqda-tekshirish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim grafik usulda emas, tenglashtirish bilan yozilgan. Tekshiruv ham bor, lekin u xatoni tutmagan. | Решение записано не по графику, а приравниванием. Проверка тоже есть, но ошибку она не поймала. | The solution is written by equating rather than from the graph. There is a check too, but it did not catch the error. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Sistema | Система | System |
| `text` | Nuqtalar: | Точки: | Points: |
| `text` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Iks minus birga teng bo'lganda chiziq bo'yicha igrek MINUS ikki chiqadi, yozuvda esa musbat ikki turibdi. To'rtinchi qator buni ko'rsatmaydi: u faqat ikkinchi nuqtani va faqat CHIZIQda tekshirgan. | Верно, ошибка в третьей строке. При иксе минус один по прямой игрек равен МИНУС двум, а в записи стоит плюс два. Четвёртая строка этого не показывает: она проверила только вторую точку и только по ПРЯМОЙ. | Correct, the error is in the third line. At x equal to minus one the line gives y equal to MINUS two, while the record shows plus two. The fourth line does not reveal this: it checked only the second point and only against the LINE. |
| `text` | Bu qator to'g'ri: kesishish nuqtasida ikkala igrek ham bir xil, shuning uchun o'ng qismlarni tenglashtirish mumkin. | Эта строка верна: в точке пересечения оба игрека одинаковы, поэтому правые части можно приравнять. | This line is right: at a crossing both y-values are the same, so the right-hand sides may be equated. |
| `text` | Bu ham to'g'ri: hadlarni bir tomonga o'tkazsak iks kvadrat minus ikki iks minus uch nolga teng, ildizlari minus bir va uch. Keyingi qatorga qarang — ordinatalar to'g'ri hisoblanganmi? | Эта тоже верна: перенеся слагаемые, получим икс в квадрате минус два икс минус три равно нулю, корни минус один и три. Посмотри на следующую строку: верно ли посчитаны ординаты? | This one is right too: moving the terms gives x squared minus two x minus three equals zero, with roots minus one and three. Look at the next line — are the ordinates computed correctly? |
| `text` | To'rtinchi qatorda hisob to'g'ri: uch karra ikki haqiqatan olti. Uning kamchiligi boshqada — u faqat bitta nuqtani va faqat bitta tenglamani tekshirgan, xatoning o'zi esa undan yuqorida. | В четвёртой строке вычисление верно: три умножить на два действительно шесть. Её недостаток в другом — она проверила лишь одну точку и лишь одно уравнение, а сама ошибка выше. | The arithmetic in the fourth line is right: three times two really is six. Its flaw is different — it checked only one point and only one equation, while the error itself is above. |
| `wrongText` | Har bir ildizni chiziqning tenglamasiga qo'ying va igrekni o'zingiz hisoblang: iks minus birga teng bo'lganda igrek qanday ishorada chiqadi? | Подставь каждый корень в уравнение прямой и посчитай игрек сам: какой знак получается при иксе минус один? | Put each root into the equation of the line and compute y yourself: what sign comes out at x equal to minus one? |

