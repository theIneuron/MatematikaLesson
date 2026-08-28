# DARS11_AMALIYOT_KONTENT — 9-sinf, 11-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars11/D11_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `RowTable` · 🟢 · teg `ozgaruvchini-ifodalash-xatosi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Birinchi tenglamadan igrek ifodalandi. Jadval shu ifoda bo'yicha to'ldiriladi. | Из первого уравнения выражен игрек. Таблица заполняется по этому выражению. | y has been expressed from the first equation. The table is filled from that expression. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Ikkinchi ustunda igrek besh minus ikki, ya'ni uch; uchinchisida esa igrek berilgan va iks so'ralgan, yig'indi beshga teng bo'lishi uchun iks to'rtga teng. Ifodaning kuchi ana shunda: u iksdan igrekni ham, igrekdan iksni ham beradi. Aynan shu ifoda ikkinchi tenglamaga qo'yiladi. | Верно. Во втором столбце игрек равен пять минус два, то есть трём; в третьем дан игрек, а спрашивают икс, и чтобы сумма была пять, икс равен четырём. В этом и сила выражения: оно даёт и игрек по иксу, и икс по игреку. Именно это выражение подставляют во второе уравнение. | Correct. In the second column y is five minus two, that is three; in the third y is given and x is asked, and for the sum to be five, x is four. That is the power of the expression: it gives y from x and x from y alike. This very expression is what gets substituted into the second equation. |
| `text` | Ikkinchi ustunda qo'shildi, ayirilmadi. Ifodada besh MINUS iks turibdi: besh minus ikki uchga teng. | Во втором столбце сложили, а не вычли. В выражении стоит пять МИНУС икс: пять минус два — три. | In the second column you added instead of subtracting. The expression says five MINUS x: five minus two is three. |
| `text` | Uchinchi ustunda igrek berilgan, iks so'ralyapti. Iks bilan igrekning yig'indisi beshga teng: bir qo'shuv nechchi besh beradi? | В третьем столбце дан игрек, а спрашивают икс. Сумма икса и игрека равна пяти: один плюс сколько даёт пять? | In the third column y is given and x is asked. The sum of x and y is five: one plus what makes five? |
| `text` | Uchinchi ustunda ishora tushib qoldi. Ifodani teskari o'qing: iks besh minus igrekka teng, ya'ni besh minus bir. | В третьем столбце потерялся знак. Прочитай выражение в обратную сторону: икс равен пять минус игрек, то есть пять минус один. | A sign was lost in the third column. Read the expression backwards: x equals five minus y, that is five minus one. |
| `text` | Katakka ustunning ikkinchi soni ko'chirilgan. Har katakni jadval tepasidagi ifoda bilan hisoblang, qo'shni katakdan ko'chirmang. | В клетку переписано второе число того же столбца. Считай каждую клетку по выражению над таблицей, а не переписывай из соседней. | The other number of the same column was copied into the cell. Compute each cell from the expression above the table, do not copy from the neighbour. |
| `wrongText` | Har katakni jadval tepasidagi ifoda bilan tekshiring: igrek besh minus iks. Berilgan sonni ifodaga qo'ying va ikkinchisini toping. | Проверяй каждую клетку по выражению над таблицей: игрек равен пять минус икс. Подставь известное число и найди второе. | Check each cell against the expression above the table: y equals five minus x. Substitute the known number and find the other. |

---

## 02 · `TrueFalse` · 🟢 · teg `notogri-orniga-qoyish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Birinchi tenglamada iks allaqachon ifodalangan. Uch hukm shu ifoda bilan nima qilish mumkinligi haqida. | В первом уравнении икс уже выражен. Три суждения — о том, что с этим выражением можно делать. | In the first equation x is already expressed. Three claims are about what may be done with that expression. |
| `ask` | Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Sistema | Система | System |
| `claim` | ni ikkinchi tenglamadagi iksning o'rniga qo'yish mumkin. | можно подставить вместо икса во второе уравнение. | may be substituted for x in the second equation. |
| `claim` | ni O'Z tenglamasiga qaytarib qo'ysak, igrek topiladi. | если подставить обратно в ЕГО ЖЕ уравнение, найдётся игрек. | if substituted back into ITS OWN equation, gives y. |
| `claim` | topilgach, iks o'sha ifodadan topiladi. | найден — икс находится из того же выражения. | once found, x comes from that same expression. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. Ifoda IKKINCHI tenglamaga qo'yiladi: ikki igrek qo'shuv bir, qo'shuv igrek yettiga teng, ya'ni uch igrek olti, igrek ikki. Undan keyin iks o'sha ifodadan chiqadi: ikki karra ikki qo'shuv bir, ya'ni besh. O'z tenglamasiga qaytarish esa hech nima bermaydi — bu yerda usulning butun ma'nosi: bitta tenglamadan olingan ifoda IKKINCHISIGA yuboriladi. | Верно. Выражение подставляют во ВТОРОЕ уравнение: два игрека плюс один, плюс игрек равно семи, то есть три игрека — шесть, игрек — два. После этого икс выходит из того же выражения: дважды два плюс один, то есть пять. А подстановка в своё же уравнение не даёт ничего — в этом весь смысл способа: выражение из одного уравнения отправляется во ВТОРОЕ. | Correct. The expression goes into the SECOND equation: two y plus one, plus y equals seven, so three y is six and y is two. Then x comes out of the same expression: twice two plus one, that is five. Putting it back into its own equation gives nothing — and that is the whole point of the method: an expression from one equation is sent into the OTHER. |
| `text` | Ifodani o'z tenglamasiga qaytarib qo'ying va nima chiqishini ko'ring: iks o'rniga ikki igrek qo'shuv bir yozilsa, ikkala tomonda bir xil narsa turadi. Bunday tenglikdan igrek topilmaydi. | Подставь выражение обратно в его же уравнение и посмотри, что выйдет: если вместо икса написать два игрека плюс один, в обеих частях окажется одно и то же. Из такого равенства игрек не находится. | Substitute the expression back into its own equation and see what happens: writing two y plus one for x leaves the same thing on both sides. Such an identity gives no y. |
| `text` | Ifoda tayyor turibdi. Ikkinchi tenglamadagi iksning o'rniga uni yozing — o'sha tenglamada faqat igrek qoladi va u yechiladi. | Выражение уже готово. Напиши его вместо икса во втором уравнении — там останется один игрек, и уравнение решится. | The expression is ready. Write it in place of x in the second equation — only y will be left there, and it can be solved. |
| `text` | Sistemaning javobi — JUFTLIK, bitta son emas. Igrek topilgach, uni ifodaga qo'yib iksni ham topish kerak. | Ответ системы — ПАРА, а не одно число. После игрека надо подставить его в выражение и найти икс. | The answer of a system is a PAIR, not one number. After y is found, put it into the expression and find x too. |
| `wrongText` | Har bir hukmni shu savol bilan tekshiring: ifoda QAYSI tenglamaga yuborilyapti, o'zinikigami yoki ikkinchisigami? | Проверяй каждое суждение вопросом: в КАКОЕ уравнение отправляется выражение — в своё или во второе? | Test each claim with this question: into WHICH equation is the expression sent — its own, or the other one? |

---

## 03 · `Choice` · 🟢 · teg `notogri-orniga-qoyish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Birinchi tenglamadan igrek ifodalandi va o'sha ifoda O'SHA tenglamaga qaytarib qo'yildi. Hech qanday yangi natija chiqmadi. | Из первого уравнения выражен игрек, и это выражение подставили обратно в ТО ЖЕ уравнение. Никакого нового результата не вышло. | y was expressed from the first equation, and that expression was put back into the SAME equation. No new result came out. |
| `ask` | Nima uchun bunday qo'yish hech nima bermaydi? | Почему такая подстановка ничего не даёт? | Why does such a substitution give nothing? |
| `givenLabel` | Ifoda | Выражение | Expression |
| `label` | Ikkala tomonda bir xil narsa hosil bo'ladi va o'zgaruvchi yo'qoladi | В обеих частях получается одно и то же, и переменная исчезает | The same thing appears on both sides and the variable disappears |
| `label` | Ifodaning o'zida xato bor | В самом выражении есть ошибка | The expression itself contains a mistake |
| `label` | Bunday qo'yish qoidada taqiqlangan | Такая подстановка запрещена правилом | Such a substitution is forbidden by a rule |
| `label` | Ikkinchi tenglama umuman kerak emas | Второе уравнение вообще не нужно | The second equation is not needed at all |
| `correctText` | To'g'ri. Igrekning o'rniga uch iks minus to'rt yozilsa, tenglama uch iks minus to'rt uch iks minus to'rtga teng bo'ladi — bu har qanday iksda bajariladigan tenglik. O'zgaruvchi ikkala tomonda ham qisqaradi, ya'ni yangi ma'lumot yo'q. Yangi ma'lumot faqat IKKINCHI tenglamada turibdi, shuning uchun ifoda o'sha yerga yuboriladi. | Верно. Если вместо игрека написать три икс минус четыре, уравнение станет «три икс минус четыре равно три икс минус четыре» — это равенство выполняется при любом иксе. Переменная сокращается в обеих частях, то есть новой информации нет. Новая информация лежит только во ВТОРОМ уравнении, туда выражение и отправляют. | Correct. Writing three x minus four for y turns the equation into "three x minus four equals three x minus four" — an identity true for every x. The variable cancels on both sides, so there is no new information. The new information sits only in the SECOND equation, and that is where the expression is sent. |
| `text` | Ifoda to'g'ri: u shu tenglamaning o'zidan olingan. Muammo ifodada emas, uni QAYERGA qo'yishda. | Выражение верное: оно получено из самого этого уравнения. Дело не в выражении, а в том, КУДА его подставили. | The expression is right: it came from that very equation. The trouble is not the expression but WHERE it was put. |
| `text` | Bu taqiq emas. Qo'yish mumkin, faqat undan hech nima chiqmaydi — natijani o'zingiz yozib ko'ring: uch iks minus to'rt uch iks minus to'rtga teng. | Это не запрет. Подставить можно, только ничего не получится — выпиши результат сам: три икс минус четыре равно три икс минус четыре. | This is not a prohibition. You may substitute, only nothing comes of it — write the result out: three x minus four equals three x minus four. |
| `text` | Aksincha: yangi ma'lumot faqat ikkinchi tenglamada. Bittasi ifoda beradi, ikkinchisi shu ifodani SONGA aylantiradi. | Наоборот: новая информация только во втором уравнении. Одно даёт выражение, другое превращает это выражение в ЧИСЛО. | The opposite: the new information is only in the second equation. One gives the expression, the other turns that expression into a NUMBER. |
| `wrongText` | Igrekning o'rniga uch iks minus to'rtni yozing va hosil bo'lgan tenglikka qarang. Unda nechta har xil narsa qoldi? | Напиши вместо игрека три икс минус четыре и посмотри на получившееся равенство. Сколько в нём осталось разного? | Write three x minus four in place of y and look at the equality you get. How much of it is still different? |

---

## 04 · `DomainAxis` · 🟡 · teg `notogri-orniga-qoyish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Birinchi tenglamadan igrek tayyor. Uni ikkinchisiga qo'ysangiz, kvadrat tenglama chiqadi. | Из первого уравнения игрек уже готов. Подставь его во второе — получится квадратное уравнение. | y is already given by the first equation. Substituting it into the second gives a quadratic. |
| `ask` | Ikkita ildizdan KICHIGINI o'qda belgilang. | Отметь на оси МЕНЬШИЙ из двух корней. | Mark the SMALLER of the two roots on the axis. |
| `givenLabel` | Sistema | Система | System |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Qo'ysak, iks kvadrat qo'shuv ikki iks qo'shuv bir to'qqizga teng bo'ladi, ya'ni iks kvadrat qo'shuv ikki iks minus sakkiz nolga teng. Ildizlari minus to'rt va ikki, kichigi minus to'rt. Nuqta bo'yalgan: bu ildiz haqiqiy, chunki uning kvadrati o'n olti — musbat son. Agar kvadrat manfiy chiqqanda edi, bunday iks uchun umuman haqiqiy yechim bo'lmasdi. | Верно. После подстановки икс в квадрате плюс два икс плюс один равно девяти, то есть икс в квадрате плюс два икс минус восемь равно нулю. Корни — минус четыре и два, меньший минус четыре. Точка закрашена: этот корень настоящий, ведь его квадрат шестнадцать — положительное число. А если бы квадрат вышел отрицательным, для такого икса действительного решения не было бы вовсе. | Correct. After substituting, x squared plus two x plus one equals nine, that is x squared plus two x minus eight equals zero. The roots are minus four and two, the smaller being minus four. The point is filled: this root is real, since its square is sixteen, a positive number. Had the square come out negative, there would be no real solution for such an x at all. |
| `text` | Ikkala ildiz ham to'g'ri, lekin savolda KICHIGI so'ralgan. Minus to'rt bilan ikkini o'qda solishtiring: manfiy son o'qning chap tomonida turadi. | Оба корня верны, но в вопросе спрашивают МЕНЬШИЙ. Сравни минус четыре и два на оси: отрицательное число стоит левее. | Both roots are right, but the question asks for the SMALLER one. Compare minus four and two on the axis: the negative number stands to the left. |
| `text` | Bu tenglamaning ozod hadi, ildizi emas. Iks kvadrat qo'shuv ikki iks minus sakkiz nolga teng tenglamani yeching: ko'paytmasi minus sakkiz, yig'indisi minus ikki bo'lgan ikkita son kerak. | Это свободный член уравнения, а не корень. Реши уравнение икс в квадрате плюс два икс минус восемь равно нулю: нужны два числа с произведением минус восемь и суммой минус два. | That is the constant term of the equation, not a root. Solve x squared plus two x minus eight equals zero: you need two numbers with product minus eight and sum minus two. |
| `text` | Bu sondagi ikkala tenglamadan ko'chirilgan. Avval ifodani ikkinchi tenglamaga qo'ying va hosil bo'lgan kvadrat tenglamani yeching. | Это число просто переписано из уравнений. Сначала подставь выражение во второе уравнение и реши получившееся квадратное. | That number was simply copied from the equations. Substitute the expression into the second equation first and solve the quadratic you get. |
| `text` | Bu ildiz haqiqiy va javobga kiradi, demak nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta chiqarib tashlangan sonni bildiradi. | Этот корень настоящий и входит в ответ, значит точка должна быть закрашена. Пустая точка означает исключённое число. | This root is real and belongs to the answer, so the point must be filled. A hollow point means an excluded number. |
| `text` | Igrekni ikkinchi tenglamaga qo'ying, hamma hadni bir tomonga o'tkazing va kvadrat tenglamani yeching. Undan keyin ikki ildizdan kichigini tanlang. | Подставь игрек во второе уравнение, перенеси все слагаемые в одну сторону и реши квадратное уравнение. Потом выбери меньший из двух корней. | Substitute y into the second equation, move all terms to one side and solve the quadratic. Then pick the smaller of the two roots. |
| `wrongText` | Ikki iks qo'shuv birni to'qqizdan ayirmang — uni igrekning O'RNIGA qo'ying. Shunda faqat iks qoladi. | Не вычитай два икс плюс один из девяти — подставь его ВМЕСТО игрека. Тогда останется только икс. | Do not subtract two x plus one from nine — put it IN PLACE of y. Then only x is left. |

---

## 05 · `TypeSet` · 🟡 · teg `kasr-birlashtirish-xatosi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Qiymatlar | Значения | Values |
| `setup` | Ikkinchi tenglamadagi ikkita kasrni bitta kasrga birlashtiring: surat — yig'indi, maxraj — ko'paytma. | Объедини две дроби во втором уравнении в одну: числитель — сумма, знаменатель — произведение. | Combine the two fractions in the second equation into one: the numerator is the sum, the denominator is the product. |
| `ask` | Iks va igrekning BARCHA qiymatlarini yozing. | Запиши ВСЕ значения икса и игрека. | Write down ALL values of x and y. |
| `hint` | Ikkitasini nuqta-vergul bilan ajrating. | Раздели их точкой с запятой. | Separate them with a semicolon. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri: uch va to'rt. Ikki kasr birlashganda surat iks qo'shuv igrek, maxraj esa iks karra igrek bo'ladi. Surat allaqachon ma'lum — yettiga teng, demak yetti bo'lingan iks karra igrek yetti bo'lingan o'n ikkiga teng, ya'ni ko'paytma o'n ikki. Yig'indisi yetti, ko'paytmasi o'n ikki bo'lgan sonlar uch va to'rt. Sistema simmetrik, shuning uchun ikkala tartib ham javob. | Верно: три и четыре. При объединении двух дробей числителем становится икс плюс игрек, а знаменателем икс на игрек. Числитель уже известен — он равен семи, значит семь делить на икс игрек равно семи двенадцатым, то есть произведение двенадцать. Числа с суммой семь и произведением двенадцать — три и четыре. Система симметрична, поэтому годятся оба порядка. | Correct: three and four. Combining the two fractions makes the numerator x plus y and the denominator x times y. The numerator is already known — it is seven, so seven over xy equals seven twelfths, that is the product is twelve. The numbers with sum seven and product twelve are three and four. The system is symmetric, so either order works. |
| `text` | O'n ikki — bu KO'PAYTMA, javobning o'zi emas. Yig'indisi yetti, ko'paytmasi o'n ikki bo'lgan ikkita sonni toping. | Двенадцать — это ПРОИЗВЕДЕНИЕ, а не сам ответ. Найди два числа с суммой семь и произведением двенадцать. | Twelve is the PRODUCT, not the answer itself. Find the two numbers with sum seven and product twelve. |
| `text` | Yetti — bu yig'indi, u shartda allaqachon berilgan. Bu yig'indi bilan ko'paytmadan ikkita sonning o'zini topish kerak. | Семь — это сумма, она уже дана в условии. По этой сумме и произведению нужно найти сами два числа. | Seven is the sum and it was given in the statement. From that sum and the product you must find the two numbers themselves. |
| `text` | Bitta son yozildi. Sistemaning javobi ikkita sondan iborat: iks va igrek. | Записано одно число. Ответ системы состоит из двух чисел: икс и игрек. | One number was written. The answer of the system consists of two numbers: x and y. |
| `text` | Yig'indisi yetti bo'lgan har qanday juftlik yaramaydi: ikkinchi shart ham bajarilishi kerak. Ikki karra besh o'n, o'n ikki emas. | Не всякая пара с суммой семь подходит: должно выполняться и второе условие. Дважды пять — десять, а не двенадцать. | Not every pair with sum seven will do: the second condition must hold too. Two times five is ten, not twelve. |
| `text` | Maxrajlarni ko'paytirib yubordingiz. Ikkinchi tenglama yetti bo'lingan ko'paytma yetti bo'lingan o'n ikkiga teng deydi: ikkala kasrning surati bir xil, demak maxrajlari ham bir xil. | Знаменатели перемножились. Второе уравнение говорит: семь делить на произведение равно семи двенадцатым; числители одинаковы, значит одинаковы и знаменатели. | The denominators got multiplied together. The second equation says seven over the product equals seven twelfths; the numerators match, so the denominators match too. |
| `wrongText` | Ikki kasrni bitta qilib yozing: surat iks qo'shuv igrek, maxraj iks karra igrek. Suratga yettini qo'ying va ko'paytmani toping, keyin yig'indi bilan ko'paytmadan sonlarni chiqaring. | Запиши две дроби как одну: числитель икс плюс игрек, знаменатель икс на игрек. Подставь в числитель семь, найди произведение, а потом по сумме и произведению — сами числа. | Write the two fractions as one: numerator x plus y, denominator x times y. Put seven into the numerator, find the product, then get the numbers from the sum and the product. |

---

## 06 · `PlacePoint` · 🟡 · teg `notogri-orniga-qoyish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Birinchi tenglamadan igrek ifodalangan. Uni ko'paytmaga qo'ysangiz, kvadrat tenglama chiqadi. | Из первого уравнения выражен игрек. Подставь его в произведение — получится квадратное уравнение. | y is expressed from the first equation. Substituting it into the product gives a quadratic. |
| `ask` | Sistemaning IKKALA yechimini tekislikka qo'ying. | Поставь на плоскость ОБА решения системы. | Place BOTH solutions of the system on the plane. |
| `correctText` | To'g'ri. Igrekning o'rniga iks qo'shuv bir yozsak, iks karra iks qo'shuv bir oltiga teng, ya'ni iks kvadrat qo'shuv iks minus olti nolga teng. Ildizlari ikki va minus uch. Har bir iks uchun igrek ifodadan chiqadi: ikkiga uch, minus uchga minus ikki. Ikkala nuqtani ham ko'paytmada tekshirish mumkin: ikki karra uch olti, minus uch karra minus ikki ham olti. | Верно. Написав вместо игрека икс плюс один, получим икс на икс плюс один равно шести, то есть икс в квадрате плюс икс минус шесть равно нулю. Корни — два и минус три. Для каждого икса игрек выходит из выражения: двум — три, минус трём — минус два. Обе точки можно проверить в произведении: два на три — шесть, минус три на минус два — тоже шесть. | Correct. Writing x plus one for y gives x times x plus one equals six, that is x squared plus x minus six equals zero. The roots are two and minus three. For each x, y comes from the expression: two gives three, minus three gives minus two. Both points can be checked in the product: two times three is six, minus three times minus two is six as well. |
| `text` | Koordinatalar o'rin almashdi. Birinchi son har doim iks: gorizontal o'q bo'ylab qancha yurilganini bildiradi. | Координаты поменялись местами. Первое число — всегда икс: сколько прошли по горизонтальной оси. | The coordinates swapped places. The first number is always x: how far you went along the horizontal axis. |
| `text` | Bitta nuqta qo'yildi. Kvadrat tenglamaning ikkita ildizi bor, demak sistemaning ham ikkita yechimi bor. | Поставлена одна точка. У квадратного уравнения два корня, значит и у системы два решения. | One point was placed. The quadratic has two roots, so the system has two solutions. |
| `text` | Igrek ifodadan noto'g'ri hisoblandi: igrek iks qo'shuv BIR. Ikkiga uch, minus uchga minus ikki chiqadi. | Игрек посчитан по выражению неверно: игрек равен икс плюс ОДИН. Двум отвечает три, минус трём — минус два. | y was computed wrongly from the expression: y equals x plus ONE. Two gives three, minus three gives minus two. |
| `text` | Bu nuqta birinchi tenglamada yotadi, lekin ko'paytmasi olti emas. Yechim IKKALA tenglamani ham qanoatlantirishi kerak: bir karra ikki — ikki, olti emas. | Эта точка лежит на первом уравнении, но её произведение не шесть. Решение должно удовлетворять ОБОИМ уравнениям: один на два — два, а не шесть. | This point satisfies the first equation, but its product is not six. A solution must satisfy BOTH equations: one times two is two, not six. |
| `wrongText` | Igrekning o'rniga iks qo'shuv birni yozing, hosil bo'lgan kvadrat tenglamani yeching va har bir iks uchun igrekni o'sha ifodadan hisoblang. | Напиши вместо игрека икс плюс один, реши получившееся квадратное уравнение и для каждого икса посчитай игрек по тому же выражению. | Write x plus one for y, solve the quadratic you get, and compute y for each x from that same expression. |

---

## 07 · `Zones` · 🟡 · teg `manfiy-kvadrat-holati`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | O'rniga qo'yishdan keyin har bir iks uchun shunday yozuv qoladi. Har biri nechta haqiqiy igrek beradi? | После подстановки для каждого икса остаётся такая запись. Сколько действительных игреков даёт каждая? | After substitution, such a record is left for each x. How many real y-values does each give? |
| `ask` | Yozuvni bosing, keyin guruhni bosing. | Нажми запись, потом нажми группу. | Tap a record, then tap a group. |
| `label` | Ikkita igrek | Два игрека | Two y-values |
| `label` | Bitta igrek | Один игрек | One y-value |
| `label` | Haqiqiy igrek yo'q | Действительного игрека нет | No real y |
| `correctText` | To'g'ri. Musbat son kvadratga teng bo'lsa, igrek ikki xil bo'ladi: besh va minus besh, ikki va minus ikki. Nol esa bitta igrek beradi, chunki nolning qarama-qarshisi yana nol; qavsli yozuvda ham xuddi shunday, faqat bu yerda igrek uchga teng. Manfiy son bilan esa hech nima chiqmaydi: hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi. Aynan shu uchinchi guruh «yechim yo'q» degan javobni beradi. | Верно. Если квадрат равен положительному числу, игрек бывает двух видов: пять и минус пять, два и минус два. Нуль даёт один игрек, ведь противоположное нулю — снова нуль; в записи со скобкой то же самое, только там игрек равен трём. А с отрицательным числом не выходит ничего: квадрат никакого действительного числа не бывает отрицательным. Именно эта третья группа и даёт ответ «решений нет». | Correct. When a square equals a positive number, y comes in two kinds: five and minus five, two and minus two. Zero gives one y, since the opposite of zero is zero again; the bracketed record is the same, only there y equals three. With a negative number nothing comes out: no real number has a negative square. It is this third group that produces the answer "no solution". |
| `text` | Manfiy songa teng kvadratga haqiqiy igrek qidirildi. Ikki musbat sonning ko'paytmasi musbat, ikki manfiy sonning ko'paytmasi ham musbat — demak kvadrat manfiy bo'lolmaydi. | Для квадрата, равного отрицательному числу, искали действительный игрек. Произведение двух положительных положительно, двух отрицательных тоже положительно — значит квадрат не может быть отрицательным. | A real y was sought for a square equal to a negative number. The product of two positives is positive, of two negatives also positive — so a square cannot be negative. |
| `text` | Nol ikkita igrek bermaydi. Nolning qarama-qarshisi ham nol, ya'ni ikki javob bir joyga qo'shilib ketadi. | Нуль не даёт двух игреков. Противоположное нулю — тоже нуль, то есть два ответа сливаются в один. | Zero does not give two y-values. The opposite of zero is zero too, so the two answers merge into one. |
| `text` | Musbat son bitta emas, ikkita igrek beradi. Besh karra besh yigirma besh, minus besh karra minus besh ham yigirma besh. | Положительное число даёт не один, а два игрека. Пять на пять — двадцать пять, минус пять на минус пять — тоже двадцать пять. | A positive number gives two y-values, not one. Five times five is twenty-five, and minus five times minus five is twenty-five as well. |
| `text` | Uchinchi guruhga faqat MANFIY songa teng kvadratlar tushadi. Yigirma besh, to'rt va nol — hammasi manfiy emas. | В третью группу попадают только квадраты, равные ОТРИЦАТЕЛЬНОМУ числу. Двадцать пять, четыре и нуль отрицательными не являются. | Only squares equal to a NEGATIVE number belong to the third group. Twenty-five, four and zero are not negative. |
| `wrongText` | Har bir yozuvga bitta savol bering: kvadratga teng bo'lgan son musbatmi, nolmi yoki manfiymi? Guruh shu javobdan chiqadi. | Задай каждой записи один вопрос: число, которому равен квадрат, положительное, нуль или отрицательное? Из этого ответа и следует группа. | Ask each record one question: is the number the square equals positive, zero, or negative? The group follows from that answer. |

---

## 08 · `AuditLines` · 🔴 · teg `ozgaruvchini-ifodalash-xatosi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim o'rniga qo'yish usulida yozilgan. Tekshiruv ham bor, lekin u xatoni tutmagan. | Решение записано способом подстановки. Проверка тоже есть, но ошибку она не поймала. | The solution is written by substitution. There is a check too, but it did not catch the error. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Sistema | Система | System |
| `text` | Yechimlar: | Решения: | Solutions: |
| `text` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Birinchi juftlik joyida: iks ikkiga teng bo'lganda igrek uch minus ikki, ya'ni bir. Ikkinchisida esa iks minus birga teng, demak igrek uch minus minus bir, ya'ni to'rt — yozuvda esa ikki turibdi. Minusning minusi qo'shuvga aylanadi, aynan shu qadam tushib qolgan. To'rtinchi qator buni ko'rsatmaydi: u faqat birinchi juftlikni tekshirgan, xato esa ikkinchisida. | Верно, ошибка в третьей строке. Первая пара на месте: при иксе, равном двум, игрек равен три минус два, то есть единице. А во второй икс равен минус одному, значит игрек равен три минус минус один, то есть четырём — в записи же стоит два. Минус на минус даёт плюс, и именно этот шаг пропущен. Четвёртая строка этого не показывает: она проверила только первую пару, а ошибка во второй. | Correct, the error is in the third line. The first pair is fine: at x equal to two, y is three minus two, that is one. But in the second, x is minus one, so y is three minus minus one, that is four — while the record shows two. Minus times minus becomes plus, and that is the step that was skipped. The fourth line does not reveal it: it checked only the first pair, and the error is in the second. |
| `text` | Bu qator to'g'ri: igrekning o'rniga uch minus iks yozildi, ya'ni birinchi tenglamadan olingan ifoda ikkinchisiga qo'yildi. | Эта строка верна: вместо игрека написано три минус икс, то есть выражение из первого уравнения подставлено во второе. | This line is right: three minus x was written for y, that is, the expression from the first equation was put into the second. |
| `text` | Bu ham to'g'ri: qavsni ochib hadlarni yig'sak, iks kvadrat minus iks minus ikki nolga teng, ildizlari ikki va minus bir. Keyingi qatorga qarang — igreklar to'g'ri hisoblanganmi? | Эта тоже верна: раскрыв скобку и собрав слагаемые, получим икс в квадрате минус икс минус два равно нулю, корни два и минус один. Посмотри на следующую строку: верно ли посчитаны игреки? | This one is right too: opening the bracket and collecting terms gives x squared minus x minus two equals zero, with roots two and minus one. Look at the next line — are the y-values computed correctly? |
| `text` | To'rtinchi qatorda hisob to'g'ri: to'rt qo'shuv bir haqiqatan besh. Uning kamchiligi boshqada — u ikkita juftlikdan faqat bittasini tekshirgan, xato esa undan yuqorida. | В четвёртой строке вычисление верно: четыре плюс один действительно пять. Её недостаток в другом — она проверила лишь одну пару из двух, а сама ошибка выше. | The arithmetic in the fourth line is right: four plus one really is five. Its flaw is different — it checked only one of the two pairs, and the error itself is above. |
| `wrongText` | Har bir ildizni ifodaga alohida qo'ying va igrekni o'zingiz hisoblang: iks minus birga teng bo'lganda uch minus minus bir nechchi bo'ladi? | Подставь каждый корень в выражение по отдельности и посчитай игрек сам: сколько будет три минус минус один? | Put each root into the expression separately and compute y yourself: what is three minus minus one? |

---

## 09 · `ClozeBank` · 🔴 · teg `manfiy-kvadrat-holati`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | O'rniga qo'yish usulida o'zgaruvchi yoki uning | В способе подстановки переменная или её | In the substitution method a variable or its |
| `text` | bir tenglamadan ifodalanib, | выражается из одного уравнения и подставляется во | is expressed from one equation and substituted into |
| `text` | tenglamaga qo'yiladi. Kvadrati manfiy songa teng chiqsa, bunday iks uchun | уравнение. Если квадрат оказался равен отрицательному числу, для такого икса | equation. If the square equals a negative number, for such an x there |
| `text` | . | . | . |
| `label` | darajasi | степень | power |
| `label` | ikkinchi | второе | the second |
| `label` | haqiqiy yechim yo'q | действительного решения нет | is no real solution |
| `label` | ozod hadi | свободный член | constant term |
| `label` | o'sha | то же | the same |
| `label` | ikkita yechim bor | есть два решения | are two solutions |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: ifodalanadigan narsa o'zgaruvchining o'zi ham, uning darajasi ham bo'lishi mumkin; ifoda IKKINCHI tenglamaga yuboriladi, o'zinikiga emas; va kvadrat manfiy chiqsa, bu iks uchun haqiqiy yechim yo'q — bu ham to'liq javob, xato emas. | Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: выражать можно и саму переменную, и её степень; выражение отправляется во ВТОРОЕ уравнение, а не в своё; и если квадрат вышел отрицательным, для этого икса действительного решения нет — это тоже полноценный ответ, а не ошибка. | Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: what gets expressed can be the variable itself or its power; the expression is sent into the SECOND equation, not its own; and if the square comes out negative, there is no real solution for that x — which is a complete answer, not a mistake. |
| `text` | Ozod had — bu harfsiz son, uni ifodalashning ma'nosi yo'q. Ifodalanadigan narsa iks yoki igrek, yoki ularning kvadrati. | Свободный член — это число без буквы, выражать его незачем. Выражают икс или игрек, или их квадрат. | A constant term is a number without a letter; there is nothing to express there. What gets expressed is x or y, or their square. |
| `text` | Ifodani o'z tenglamasiga qaytarsangiz, ikkala tomonda bir xil narsa turadi va o'zgaruvchi qisqarib ketadi. Yangi ma'lumot faqat ikkinchi tenglamada. | Если вернуть выражение в его же уравнение, в обеих частях окажется одно и то же и переменная сократится. Новая информация только во втором уравнении. | Returning the expression to its own equation leaves the same thing on both sides and the variable cancels. The new information is only in the second equation. |
| `text` | Manfiy songa teng kvadratdan ikkita yechim ham chiqmaydi, bittasi ham. Hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi. | Из квадрата, равного отрицательному числу, не выходит ни двух решений, ни одного. Квадрат никакого действительного числа не бывает отрицательным. | A square equal to a negative number yields neither two solutions nor one. No real number has a negative square. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nima ifodalanishi haqida, ikkinchisi ifoda qaysi tenglamaga borishi haqida, uchinchisi esa kvadrat manfiy chiqqanda nima bo'lishi haqida. | Проверяй каждую клетку самим предложением: первая про то, что выражают, вторая про то, в какое уравнение идёт выражение, третья про то, что будет при отрицательном квадрате. | Check each blank against the sentence itself: the first is about what gets expressed, the second about which equation it goes into, the third about what happens when the square is negative. |

---

## 10 · `OrderLines` · 🔴 · teg `ozgaruvchini-ifodalash-xatosi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | O'rniga qo'yish usulining beshta qadami aralashtirilgan. | Пять шагов способа подстановки перемешаны. | Five steps of the substitution method are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Sistema | Система | System |
| `label` | Birinchi tenglamadan igrekni ifodalaymiz: | Выражаем игрек из первого уравнения: | Express y from the first equation: |
| `label` | Ifodani ikkinchi tenglamaga qo'yamiz: | Подставляем выражение во второе уравнение: | Substitute the expression into the second equation: |
| `label` | Kvadrat tenglamani yechamiz: | Решаем квадратное уравнение: | Solve the quadratic: |
| `label` | Har bir iks uchun igrekni ifodadan topamiz va tekshiramiz | Для каждого икса находим игрек по выражению и проверяем | For each x, find y from the expression and check it |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Zanjir ifodalashdan boshlanadi va juftliklar bilan tugaydi. Ikkita qadam ataylab ajratilgan: kvadrat tenglamaning ildizi hali javob emas — u faqat IKS, va har bir iks uchun igrekni ham topish kerak. Tekshirish esa ikkala tenglamada bajariladi: uch minus ikki bir, to'qqiz minus ikki yetti; minus ikki minus minus uch ham bir, to'rt minus minus uch ham yetti. | Верно. Цепочка начинается с выражения и заканчивается парами. Два шага разделены намеренно: корень квадратного уравнения — ещё не ответ, это только ИКС, и для каждого икса надо найти игрек. А проверка идёт по обоим уравнениям: три минус два — один, девять минус два — семь; минус два минус минус три — тоже один, четыре минус минус три — тоже семь. | Correct. The chain starts with expressing and ends with pairs. Two steps are deliberately separated: a root of the quadratic is not yet an answer — it is only an X, and for each x a y must be found too. And the check runs in both equations: three minus two is one, nine minus two is seven; minus two minus minus three is one as well, four minus minus three is seven as well. |
| `text` | Ikkinchi tenglamaga nima qo'yiladi, agar ifoda hali yozilmagan bo'lsa? Avval bitta o'zgaruvchi ifodalanadi, keyin u yuboriladi. | Что подставлять во второе уравнение, если выражение ещё не записано? Сначала выражают одну переменную, потом её отправляют. | What is there to substitute into the second equation if the expression is not written yet? First one variable is expressed, then it is sent. |
| `text` | Javob juftliklardan iborat, kvadrat tenglamaning ildizi esa faqat iks. Igreklarni topmasdan javob yozib bo'lmaydi. | Ответ состоит из пар, а корень квадратного уравнения — только икс. Не найдя игреки, ответ записать нельзя. | The answer consists of pairs, while a root of the quadratic is only an x. Without finding the y-values the answer cannot be written. |
| `text` | Igrekni nimadan topasiz, agar ikslar hali topilmagan bo'lsa? Avval kvadrat tenglama yechiladi. | Из чего находить игрек, если иксы ещё не найдены? Сначала решается квадратное уравнение. | From what would you find y if the x-values are not found yet? The quadratic is solved first. |
| `text` | Kvadrat tenglama o'z-o'zidan paydo bo'lmaydi: u ifodani ikkinchi tenglamaga qo'yishdan hosil bo'ladi. | Квадратное уравнение не появляется само: оно возникает после подстановки выражения во второе уравнение. | The quadratic does not appear by itself: it arises from substituting the expression into the second equation. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

