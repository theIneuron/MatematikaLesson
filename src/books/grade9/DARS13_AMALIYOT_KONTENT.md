# DARS13_AMALIYOT_KONTENT — 9-sinf, 13-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars13/D13_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `Choice` · 🟢 · teg `ozgaruvchi-notogri-tanlash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Masala so'z bilan berilgan: ikki xonali son va uning raqamlari haqida. Sistema tuzish kerak. | Задача дана словами: про двузначное число и его цифры. Нужно составить систему. | The problem is given in words: about a two-digit number and its digits. A system must be built. |
| `ask` | Ishni nimadan boshlash kerak? | С чего нужно начать работу? | Where must the work begin? |
| `label` | Har bir noma'lum aniq nimani anglatishini belgilashdan | С определения того, что именно означает каждое неизвестное | By defining exactly what each unknown means |
| `label` | Darhol tenglama yozishdan | Со записи уравнения сразу же | By writing an equation straight away |
| `label` | Javobni taxmin qilib, keyin tekshirishdan | С угадывания ответа и последующей проверки | By guessing the answer and then checking it |
| `label` | Grafik chizishdan | С построения графика | By drawing a graph |
| `correctText` | To'g'ri. Sistema tuzishdan oldin har bir harf nimani bildirishi yozilishi kerak: iks — o'nlar raqami, igrek — birlar raqami, yoki N — sonning o'zi, s — raqamlar yig'indisi. Bu shakl uchun emas: shu yozuvsiz «son» bilan «raqamlar yig'indisi» chalkashib ketadi, va oxirida topilgan son masalaning qaysi savoliga javob berayotgani ham noaniq bo'lib qoladi. | Верно. Прежде чем составлять систему, надо записать, что означает каждая буква: икс — цифра десятков, игрек — цифра единиц, или N — само число, s — сумма цифр. Это не для формы: без такой записи «число» и «сумма цифр» перепутаются, а в конце окажется неясно, на какой вопрос задачи отвечает найденное число. | Correct. Before building a system you must write down what each letter stands for: x is the tens digit, y the units digit, or N the number itself and s the digit sum. This is not a formality: without it "the number" and "the digit sum" get mixed up, and at the end it stays unclear which question of the problem the number answers. |
| `text` | Tenglama nima haqida yoziladi, agar harflar nimani bildirishi hali aytilmagan bo'lsa? N besh s ga teng degan yozuv N bilan s aniqlanmaguncha ma'nosiz. | О чём писать уравнение, если ещё не сказано, что означают буквы? Запись N равно пять s бессмысленна, пока N и s не определены. | What would an equation be about if it has not been said what the letters stand for? Writing N equals five s is meaningless until N and s are defined. |
| `text` | Taxmin bitta javobni topishi mumkin, lekin u boshqasi yo'qligini ko'rsatmaydi. Sistema esa hamma yechimni beradi va shartga zidini ochib tashlaydi. | Угадывание может найти один ответ, но не покажет, что другого нет. Система же даёт все решения и вскрывает противоречащее условию. | Guessing may find one answer but cannot show there is no other. A system gives every solution and exposes the one that contradicts the statement. |
| `text` | Grafik bu masalada yordam bermaydi: raqamlar butun sonlar, ularni chizmadan aniq o'qib bo'lmaydi. Bu yerda asbob — sistema. | График в этой задаче не поможет: цифры — целые числа, с чертежа их точно не считать. Инструмент здесь — система. | A graph will not help here: digits are whole numbers and cannot be read off a drawing exactly. The tool here is a system. |
| `wrongText` | Sistemani yozib ko'ring va o'zingizdan so'rang: bu yerdagi harflar nimani bildiradi? Javob topilmasa, birinchi qadam tushib qolgan. | Попробуй записать систему и спроси себя: что означают эти буквы? Если ответа нет, значит пропущен первый шаг. | Try writing the system and ask yourself: what do these letters mean? If there is no answer, the first step was skipped. |

---

## 02 · `RowTable` · 🟢 · teg `shartni-notogri-tenglamaga-otkazish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Ikki xonali sonning raqamlari yig'indisi o'n bir. Yuqori qator — o'nlar raqami, pastki qator — birlar raqami. | Сумма цифр двузначного числа равна одиннадцати. Верхняя строка — цифра десятков, нижняя — цифра единиц. | The digits of a two-digit number add up to eleven. The top row is the tens digit, the bottom the units digit. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri: uchga sakkiz, beshga olti. Jadvalning to'rttala ustuni ham shartni bajaradi — yigirma to'qqiz, o'ttiz sakkiz, oltmish besh, sakson uch: hammasining raqamlari yig'indisi o'n bir. Demak bitta shart sonni aniqlamaydi, u faqat nomzodlar ro'yxatini beradi. Masalaning IKKINCHI sharti shu ro'yxatdan bittasini tanlaydi. | Верно: трём — восемь, пяти — шесть. Все четыре столбца таблицы выполняют условие — двадцать девять, тридцать восемь, шестьдесят пять, восемьдесят три: у всех сумма цифр одиннадцать. Значит одно условие числа не определяет, оно лишь даёт список кандидатов. ВТОРОЕ условие задачи выбирает из этого списка один. | Correct: three gives eight, five gives six. All four columns satisfy the condition — twenty-nine, thirty-eight, sixty-five, eighty-three: each has digit sum eleven. So one condition does not determine the number, it only gives a list of candidates. The SECOND condition of the problem picks one from that list. |
| `text` | Uchga o'n bir qo'shildi. Shart yig'indi haqida: ikkita raqamning yig'indisi o'n bir bo'lishi kerak, demak birlar raqami o'n bir minus uch. | К трём прибавили одиннадцать. Условие про сумму: сумма двух цифр должна быть одиннадцать, значит цифра единиц равна одиннадцать минус три. | Eleven was added to three. The condition is about the sum: the two digits must add up to eleven, so the units digit is eleven minus three. |
| `text` | Beshga o'n bir qo'shildi. Bu ustunda birlar raqami berilgan, o'nlar raqami so'ralyapti: nechchi qo'shuv besh o'n bir beradi? | К пяти прибавили одиннадцать. В этом столбце дана цифра единиц, а спрашивают цифру десятков: сколько плюс пять даёт одиннадцать? | Eleven was added to five. In this column the units digit is given and the tens digit is asked: what plus five makes eleven? |
| `text` | Katakka yig'indining o'zi yozilgan. O'n bir — bu ikkita raqamning YIG'INDISI, alohida raqam emas: raqam noldan to'qqizgacha bo'ladi. | В клетку записана сама сумма. Одиннадцать — это СУММА двух цифр, а не отдельная цифра: цифра бывает от нуля до девяти. | The sum itself was written into the cell. Eleven is the SUM of two digits, not a digit: a digit runs from zero to nine. |
| `text` | Katakka butun SON yozilgan, raqam esa so'ralgan. Jadvalning har bir katagida bitta raqam turadi. | В клетку записано целое ЧИСЛО, а спрашивают цифру. В каждой клетке таблицы стоит одна цифра. | A whole NUMBER was written into the cell, but a digit is asked. Each cell of the table holds a single digit. |
| `wrongText` | Har ustunda ikkita raqamning yig'indisi o'n bir bo'lishi kerak. Berilgan raqamni o'n birdan ayirsangiz, ikkinchisi chiqadi. | В каждом столбце сумма двух цифр должна быть одиннадцать. Вычти известную цифру из одиннадцати — получишь вторую. | In every column the two digits must add up to eleven. Subtract the known digit from eleven to get the other one. |

---

## 03 · `TrueFalse` · 🟢 · teg `shartni-notogri-tenglamaga-otkazish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Masala: ikki xonali son o'z raqamlari yig'indisidan besh marta katta, raqamlar yig'indisi esa to'qqiz. N — son, s — raqamlar yig'indisi. | Задача: двузначное число в пять раз больше суммы своих цифр, а сумма цифр равна девяти. N — число, s — сумма цифр. | Problem: a two-digit number is five times the sum of its digits, and the digit sum is nine. N is the number, s the digit sum. |
| `ask` | Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `claim` | — «besh marta katta» shartining tenglamasi. | — уравнение условия «в пять раз больше». | is the equation for "five times greater". |
| `claim` | ham xuddi shu shartni beradi. | даёт то же самое условие. | gives the very same condition. |
| `claim` | — shu masalaning javobi. | — ответ этой задачи. | is the answer to this problem. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. «Besh marta katta» — ko'paytirish: N besh s ga teng. «Besh ga katta» esa qo'shish: N s qo'shuv beshga teng. Bu ikki tenglama butunlay boshqa. Yig'indi to'qqiz bo'lgani uchun N besh karra to'qqiz, ya'ni qirq besh. Tekshiramiz: qirq beshning raqamlari yig'indisi to'rt qo'shuv besh, ya'ni to'qqiz — ikkala shart ham bajariladi. | Верно. «В пять раз больше» — это умножение: N равно пять s. А «на пять больше» — сложение: N равно s плюс пять. Эти два уравнения совершенно разные. Так как сумма цифр девять, N равно пятью девять, то есть сорок пять. Проверяем: сумма цифр сорока пяти — четыре плюс пять, то есть девять; оба условия выполнены. | Correct. "Five times greater" means multiplication: N equals five s. "Greater by five" means addition: N equals s plus five. These two equations are entirely different. Since the digit sum is nine, N is five times nine, that is forty-five. Check: the digits of forty-five add to four plus five, that is nine — both conditions hold. |
| `text` | «Marta katta» ko'paytirish, «ga katta» esa qo'shish. Sonlarda ko'rib chiqing: to'qqizdan besh marta katta son qirq besh, to'qqizdan besh ga katta son esa o'n to'rt. | «Раз больше» — это умножение, «на больше» — сложение. Проверь на числах: в пять раз больше девяти — сорок пять, а на пять больше девяти — четырнадцать. | "Times greater" is multiplication, "greater by" is addition. Check on numbers: five times nine is forty-five, while five more than nine is fourteen. |
| `text` | «Besh marta katta» degani berilgan sonni beshga ko'paytirish. Sonni harf bilan yozsak: N besh s ga teng. | «В пять раз больше» значит умножить данное число на пять. Записав буквой: N равно пять s. | "Five times greater" means multiplying the given quantity by five. Written with letters: N equals five s. |
| `text` | Qirq beshni ikkala shartda ham tekshiring: u to'qqizdan besh marta kattami, va uning raqamlari yig'indisi to'qqizmi? | Проверь сорок пять по обоим условиям: оно в пять раз больше девяти, и сумма его цифр девять? | Test forty-five against both conditions: is it five times nine, and do its digits add up to nine? |
| `wrongText` | Har bir hukmni sonlarda tekshirib ko'ring: to'qqizni oling va uni avval beshga ko'paytiring, keyin beshga qo'shing. Natijalar bir xilmi? | Проверяй каждое суждение на числах: возьми девять, сначала умножь на пять, потом прибавь пять. Результаты одинаковы? | Test each claim on numbers: take nine, first multiply it by five, then add five. Are the results the same? |

---

## 04 · `TypeSet` · 🟡 · teg `nomuvofiq-yechimni-qabul-qilish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar | Числа | Numbers |
| `setup` | Bir NATURAL son ikkinchisidan to'rtga katta, ularning ko'paytmasi qirq besh. | Одно НАТУРАЛЬНОЕ число на четыре больше другого, их произведение сорок пять. | One NATURAL number is four greater than another, and their product is forty-five. |
| `ask` | Ikkala sonni ham yozing. | Запиши оба числа. | Write down both numbers. |
| `hint` | Ikkitasini nuqta-vergul bilan ajrating. | Раздели их точкой с запятой. | Separate them with a semicolon. |
| `givenLabel` | Sistema | Система | System |
| `correctText` | To'g'ri: besh va to'qqiz. Igrekni ifodalab qo'ysak, igrek karra igrek qo'shuv to'rt qirq beshga teng bo'ladi, ya'ni igrek kvadrat qo'shuv to'rt igrek minus qirq besh nolga teng: ildizlari besh va minus to'qqiz. Ikkinchi ildiz minus besh bilan minus to'qqiz juftligini beradi — matematik jihatdan to'g'ri, chunki ularning ko'paytmasi ham qirq besh. Lekin masala NATURAL sonlarni so'ragan, shuning uchun bu nomzod rad etiladi. | Верно: пять и девять. Выразив игрек и подставив, получим игрек на игрек плюс четыре равно сорока пяти, то есть игрек в квадрате плюс четыре игрека минус сорок пять равно нулю: корни пять и минус девять. Второй корень даёт пару минус пять и минус девять — математически верную, ведь их произведение тоже сорок пять. Но задача просила НАТУРАЛЬНЫЕ числа, поэтому этот кандидат отбрасывается. | Correct: five and nine. Expressing y and substituting gives y times y plus four equals forty-five, that is y squared plus four y minus forty-five equals zero, with roots five and minus nine. The second root gives the pair minus five and minus nine — mathematically correct, since their product is forty-five too. But the problem asked for NATURAL numbers, so that candidate is rejected. |
| `text` | Manfiy juftlik tenglamalarni qanoatlantiradi, lekin masalaning shartini yo'q: natural sonlar manfiy bo'lmaydi. Matematik to'g'ri chiqqan yechim ham shartga zid bo'lsa rad etiladi. | Отрицательная пара удовлетворяет уравнениям, но не условию задачи: натуральные числа не бывают отрицательными. Даже математически верное решение отбрасывается, если противоречит условию. | The negative pair satisfies the equations but not the statement: natural numbers are never negative. Even a mathematically correct solution is rejected when it contradicts the statement. |
| `text` | Bitta son yozildi. Masala IKKITA son haqida, ularning biri ikkinchisidan to'rtga katta. | Записано одно число. Задача про ДВА числа, одно из которых на четыре больше другого. | One number was written. The problem is about TWO numbers, one four greater than the other. |
| `text` | Qirq besh — bu KO'PAYTMA, javobning o'zi emas. Ko'paytmasi qirq besh, ayirmasi to'rt bo'lgan ikkita sonni toping. | Сорок пять — это ПРОИЗВЕДЕНИЕ, а не сам ответ. Найди два числа с произведением сорок пять и разностью четыре. | Forty-five is the PRODUCT, not the answer itself. Find the two numbers with product forty-five and difference four. |
| `text` | To'rt — bu AYIRMA, u shartda allaqachon berilgan. Ayirma bilan ko'paytmadan sonlarning o'zini topish kerak. | Четыре — это РАЗНОСТЬ, она уже дана в условии. По разности и произведению нужно найти сами числа. | Four is the DIFFERENCE and it was given in the statement. From the difference and the product you must find the numbers themselves. |
| `text` | Uch karra o'n besh qirq besh, lekin ularning ayirmasi o'n ikki, to'rt emas. Ikkala shart ham bir vaqtda bajarilishi kerak. | Три на пятнадцать — сорок пять, но их разность двенадцать, а не четыре. Оба условия должны выполняться одновременно. | Three times fifteen is forty-five, but their difference is twelve, not four. Both conditions must hold at once. |
| `wrongText` | Birinchi tenglamadan bitta sonni ifodalab, ikkinchisiga qo'ying va kvadrat tenglamani yeching. Ikkita nomzod chiqadi — ularning qaysi biri NATURAL sonlar beradi? | Вырази одно число из первого уравнения, подставь во второе и реши квадратное уравнение. Выйдут два кандидата — какой из них даёт НАТУРАЛЬНЫЕ числа? | Express one number from the first equation, substitute into the second and solve the quadratic. Two candidates appear — which of them gives NATURAL numbers? |

---

## 05 · `PlacePoint` · 🟡 · teg `ozgaruvchi-notogri-tanlash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Ikki xonali sonning raqamlari yig'indisi to'qqiz, ayirmasi uch. Iks — o'nlar raqami, igrek — birlar raqami. | Сумма цифр двузначного числа девять, разность — три. Икс — цифра десятков, игрек — цифра единиц. | The digits of a two-digit number add to nine and differ by three. x is the tens digit, y the units digit. |
| `ask` | Raqamlar juftligini tekislikka qo'ying. | Поставь пару цифр на плоскость. | Place the pair of digits on the plane. |
| `correctText` | To'g'ri. Qo'shsak, ikki iks o'n ikkiga teng, iks olti; keyin igrek to'qqiz minus olti, ya'ni uch. Juftlik olti va uch, son esa oltmish uch. Uch va olti juftligi yaramaydi: uch minus olti minus uchga teng, uchga emas. Ayirmaning ishorasi aynan shu narsani ushlaydi — iks o'nlar raqami, va u KATTASI bo'lishi kerak. | Верно. При сложении два икса равны двенадцати, икс — шесть; затем игрек равен девять минус шесть, то есть три. Пара — шесть и три, число — шестьдесят три. Пара три и шесть не годится: три минус шесть равно минус трём, а не трём. Знак разности ловит именно это — икс это цифра десятков, и она должна быть БОЛЬШЕЙ. | Correct. Adding gives two x equals twelve, so x is six; then y is nine minus six, that is three. The pair is six and three, and the number is sixty-three. The pair three and six will not do: three minus six is minus three, not three. The sign of the difference catches exactly this — x is the tens digit, and it must be the LARGER one. |
| `text` | Raqamlar o'rin almashdi. Ikkinchi tenglamada iks minus igrek uchga teng, ya'ni iks KATTA raqam. Uch va olti bilan ayirma minus uch chiqadi va son oltmish uch emas, o'ttiz olti bo'lib qoladi. | Цифры поменялись местами. Во втором уравнении икс минус игрек равно трём, значит икс — БОЛЬШАЯ цифра. С тройкой и шестёркой разность выйдет минус три, а число станет тридцать шесть, а не шестьдесят три. | The digits swapped places. In the second equation x minus y is three, so x is the LARGER digit. With three and six the difference comes out minus three, and the number becomes thirty-six instead of sixty-three. |
| `text` | Bu juftlikda yig'indi to'qqiz emas. Ikkala shartni ham bir vaqtda tekshiring: yig'indi to'qqiz VA ayirma uch. | В этой паре сумма не равна девяти. Проверяй оба условия одновременно: сумма девять И разность три. | In this pair the sum is not nine. Check both conditions at once: the sum is nine AND the difference is three. |
| `text` | Yig'indi to'qqiz, lekin ayirma bir — uch emas. Ikkinchi shart ham bajarilishi kerak. | Сумма девять, но разность единица, а не три. Второе условие тоже должно выполняться. | The sum is nine, but the difference is one, not three. The second condition must hold too. |
| `text` | Bu yerda yig'indi to'qqiz, lekin ayirma ham to'qqiz. Ayirmasi uchga teng juftlikni qidiring: iks igrekdan aynan uchga katta bo'lishi kerak. | Здесь сумма девять, но и разность девять. Ищи пару с разностью, равной трём: икс больше игрека ровно на три. | Here the sum is nine, but so is the difference. Look for a pair whose difference is three: x exceeds y by exactly three. |
| `wrongText` | Ikkala tenglamani qo'shing, iksni toping, keyin igrekni. Nuqtaning birinchi soni — o'nlar raqami, ikkinchisi — birlar raqami. | Сложи оба уравнения, найди икс, потом игрек. Первое число точки — цифра десятков, второе — цифра единиц. | Add both equations, find x, then y. The first number of the point is the tens digit, the second the units digit. |

---

## 06 · `Zones` · 🟡 · teg `shartni-notogri-tenglamaga-otkazish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Har bir tenglama so'zdagi bitta iboradan chiqqan. Qaysi iboradan? | Каждое уравнение получено из одной фразы в тексте. Из какой? | Each equation came from one phrase in the text. From which one? |
| `ask` | Tenglamani bosing, keyin guruhni bosing. | Нажми уравнение, потом нажми группу. | Tap an equation, then tap a group. |
| `label` | Marta katta | Раз больше | Times greater |
| `label` | Ga katta | На больше | Greater by |
| `label` | Kvadrati | Квадрат | The square |
| `correctText` | To'g'ri. «Marta katta» ko'paytirishga aylanadi: N olti s ga teng. «Ga katta» qo'shishga: N s qo'shuv oltiga teng. «Kvadrati» esa sonning o'zini o'ziga ko'paytiradi: N s kvadratga teng. Sonlarda ko'rinadi: s olti bo'lsa, birinchi guruh o'ttiz olti beradi, ikkinchisi o'n ikki, uchinchisi ham o'ttiz olti — lekin uchinchi guruhda bu tasodif, s ni almashtirsangiz natijalar ajralib ketadi. | Верно. «Раз больше» превращается в умножение: N равно шесть s. «На больше» — в сложение: N равно s плюс шесть. А «квадрат» умножает само число на себя: N равно s в квадрате. На числах это видно: при s равном шести первая группа даёт тридцать шесть, вторая — двенадцать, третья — тоже тридцать шесть; но в третьей группе это совпадение, поменяй s и результаты разойдутся. | Correct. "Times greater" becomes multiplication: N equals six s. "Greater by" becomes addition: N equals s plus six. And "the square" multiplies the number by itself: N equals s squared. On numbers it shows: at s equal to six the first group gives thirty-six, the second twelve, the third thirty-six as well — but in the third group that is a coincidence; change s and the results part ways. |
| `text` | Bu yerda qo'shish turibdi, ko'paytirish emas. «Olti marta katta» N olti s ga teng, «oltiga katta» esa N s qo'shuv oltiga teng — sonlarda tekshiring: oltidan olti marta katta o'ttiz olti, oltiga katta esa o'n ikki. | Здесь стоит сложение, а не умножение. «В шесть раз больше» — N равно шесть s, «на шесть больше» — N равно s плюс шесть; проверь на числах: в шесть раз больше шести — тридцать шесть, на шесть больше — двенадцать. | This is addition, not multiplication. "Six times greater" is N equals six s, while "greater by six" is N equals s plus six; check on numbers: six times six is thirty-six, six more than six is twelve. |
| `text` | Bu yerda koeffitsient turibdi, qo'shiluvchi emas. Olti s degani s ni oltiga KO'PAYTIRISH. | Здесь стоит коэффициент, а не слагаемое. Шесть s означает УМНОЖИТЬ s на шесть. | This is a coefficient, not an addend. Six s means MULTIPLY s by six. |
| `text` | Kvadrat — bu sonni o'ziga ko'paytirish, boshqa songa emas. s kvadrat oltita s ham emas, s qo'shuv olti ham emas. | Квадрат — это умножение числа на само себя, а не на другое число. s в квадрате — это ни шесть s, ни s плюс шесть. | A square multiplies a number by itself, not by another number. s squared is neither six s nor s plus six. |
| `text` | Uchinchi guruhga faqat kvadrat yozilgan tenglamalar tushadi. Bu yozuvda daraja yo'q. | В третью группу попадают только уравнения с квадратом. В этой записи степени нет. | Only equations with a square belong to the third group. This record has no power in it. |
| `wrongText` | Har bir tenglamani so'zga qaytarib o'qing: bu yerda ko'paytirilyaptimi, qo'shilyaptimi yoki son o'ziga ko'paytirilyaptimi? | Прочитай каждое уравнение обратно словами: здесь умножают, прибавляют или число умножают на себя? | Read each equation back into words: is something multiplied, added, or is the number multiplied by itself? |

---

## 07 · `DomainAxis` · 🟡 · teg `nomuvofiq-yechimni-qabul-qilish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Ikki xonali son masalasidan shu tenglama chiqdi; bu yerda s — raqamlar yig'indisi. Uning ikkita ildizi bor, lekin ikkalasi ham masalaga mos kelmaydi. | Из задачи про двузначное число вышло это уравнение; здесь s — сумма цифр. У него два корня, но не оба подходят задаче. | This equation came out of a problem about a two-digit number; here s is the digit sum. It has two roots, but not both fit the problem. |
| `ask` | Masalaning shartiga MOS keladigan ildizni o'qda belgilang. | Отметь на оси корень, ПОДХОДЯЩИЙ условию задачи. | Mark on the axis the root that FITS the problem. |
| `givenLabel` | Tenglama | Уравнение | Equation |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Hamma hadni chapga o'tkazsak, s kvadrat minus yetti s nolga teng, ya'ni s karra s minus yetti nolga teng: ildizlari nol va yetti. Nol matematik jihatdan mukammal ildiz, lekin ikki xonali sonning raqamlari yig'indisi nol bo'lolmaydi — buning uchun ikkala raqam ham nol bo'lishi kerak, o'nlar raqami esa noldan boshlanmaydi. Shuning uchun javob yetti. Bu darsning eng muhim odati: har bir ildizni masalaning SHARTIGA qaytarib tekshirish. | Верно. Перенеся всё влево, получим s в квадрате минус семь s равно нулю, то есть s на s минус семь равно нулю: корни нуль и семь. Нуль — математически безупречный корень, но сумма цифр двузначного числа нулём быть не может: для этого обе цифры должны быть нулями, а цифра десятков с нуля не начинается. Поэтому ответ семь. Это главная привычка урока: возвращать каждый корень в УСЛОВИЕ задачи. | Correct. Moving everything left gives s squared minus seven s equals zero, that is s times s minus seven equals zero, with roots zero and seven. Zero is a perfectly good root mathematically, but the digit sum of a two-digit number cannot be zero: that would need both digits to be zero, and a tens digit does not start at zero. Hence the answer is seven. This is the key habit of the lesson: take every root back to the STATEMENT of the problem. |
| `text` | Nol tenglamani qanoatlantiradi, lekin masalani yo'q. Raqamlar yig'indisi nol bo'lsa, ikkala raqam ham nol bo'ladi va ikki xonali son qolmaydi. | Нуль удовлетворяет уравнению, но не задаче. Если сумма цифр нуль, то обе цифры нули, и двузначного числа не остаётся. | Zero satisfies the equation but not the problem. If the digit sum is zero, both digits are zero, and no two-digit number is left. |
| `text` | Ishora almashdi. Hadni chapga o'tkazganda s kvadrat minus yetti s chiqadi, ildizlari esa nol va MUSBAT yetti. Raqamlar yig'indisi manfiy bo'lishi ham mumkin emas. | Сбился знак. При переносе слагаемого влево выходит s в квадрате минус семь s, а корни — нуль и ПОЛОЖИТЕЛЬНЫЕ семь. Сумма цифр к тому же не бывает отрицательной. | A sign slipped. Moving the term left gives s squared minus seven s, and the roots are zero and POSITIVE seven. A digit sum cannot be negative either. |
| `text` | Bir bu tenglamaning ildizi emas: bir kvadrat bir, yetti karra bir esa yetti. Tenglamani ko'paytuvchilarga ajratib ildizlarini toping. | Единица не корень этого уравнения: один в квадрате — один, а семью один — семь. Разложи уравнение на множители и найди корни. | One is not a root of this equation: one squared is one, while seven times one is seven. Factor the equation and find its roots. |
| `text` | Bu ildiz masalaning javobiga kiradi, demak nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta chiqarib tashlangan sonni bildiradi — bu yerda chiqarib tashlangani nol. | Этот корень входит в ответ задачи, значит точка должна быть закрашена. Пустая точка означает исключённое число — здесь исключён нуль. | This root belongs to the answer of the problem, so the point must be filled. A hollow point means an excluded number — and here the excluded one is zero. |
| `text` | Avval tenglamani yechib ikkita ildizni toping, keyin har birini masalaning shartiga qo'yib ko'ring: raqamlar yig'indisi shunday bo'lishi mumkinmi? | Сначала реши уравнение и найди два корня, потом проверь каждый по условию задачи: может ли сумма цифр быть такой? | First solve the equation and find both roots, then test each against the statement: can a digit sum be like that? |
| `wrongText` | Tenglamani nolga keltiring va ko'paytuvchilarga ajratib ildizlarini toping. Keyin har bir ildizni masalaning shartiga qaytarib tekshiring. | Приведи уравнение к нулю, разложи на множители и найди корни. Потом верни каждый корень в условие задачи и проверь. | Bring the equation to zero, factor it and find the roots. Then take each root back to the statement and test it. |

---

## 08 · `OrderLines` · 🔴 · teg `javobni-masala-tiliga-qaytarmaslik`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Masala: ikki xonali sonning raqamlari yig'indisi o'n ikki; raqamlar o'rni almashtirilsa, son o'n sakkizga kamayadi. Beshta qadam aralashtirilgan. | Задача: сумма цифр двузначного числа двенадцать; если цифры переставить, число уменьшится на восемнадцать. Пять шагов перемешаны. | Problem: the digits of a two-digit number add to twelve; swapping the digits decreases the number by eighteen. Five steps are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `label` | Noma'lumlarni belgilaymiz: iks — o'nlar raqami, igrek — birlar raqami | Обозначаем неизвестные: икс — цифра десятков, игрек — цифра единиц | Name the unknowns: x is the tens digit, y the units digit |
| `label` | Har bir shartni tenglamaga aylantiramiz: | Превращаем каждое условие в уравнение: | Turn each condition into an equation: |
| `label` | Sistemani yechamiz: | Решаем систему: | Solve the system: |
| `label` | Topilgan raqamlarni masala shartiga qo'yib tekshiramiz: | Проверяем найденные цифры по условию задачи: | Check the digits found against the statement: |
| `label` | Javob — izlangan son: | Ответ — искомое число: | Answer — the number sought: |
| `correctText` | To'g'ri. Zanjir belgilashdan boshlanadi va SON bilan tugaydi, raqamlar bilan emas: iks yetti va igrek besh — bu hali javob emas, masala son haqida so'ragan. Ikkinchi shart tenglamaga aylanganda to'qqizga qisqaradi: o'n iks qo'shuv igrekdan o'n igrek qo'shuv iksni ayirsak, to'qqiz karra iks minus igrek chiqadi, ya'ni iks minus igrek ikkiga teng. Tekshiruv javobdan oldin turadi: yetmish beshdan ellik yettini ayirsak, haqiqatan o'n sakkiz. | Верно. Цепочка начинается с обозначений и заканчивается ЧИСЛОМ, а не цифрами: икс семь и игрек пять — это ещё не ответ, задача спрашивала про число. Второе условие при переводе в уравнение сокращается на девять: из десять икс плюс игрек вычитаем десять игрек плюс икс и получаем девять на икс минус игрек, то есть икс минус игрек равно двум. Проверка стоит перед ответом: из семидесяти пяти вычесть пятьдесят семь — действительно восемнадцать. | Correct. The chain starts with naming and ends with the NUMBER, not the digits: x is seven and y is five — that is not the answer yet, the problem asked about the number. The second condition reduces by nine when turned into an equation: subtracting ten y plus x from ten x plus y gives nine times x minus y, so x minus y is two. The check comes before the answer: seventy-five minus fifty-seven is indeed eighteen. |
| `text` | Tenglamada iks va igrek turibdi, lekin ular nimani bildirishi hali aytilmagan. Belgilash birinchi qadam. | В уравнении стоят икс и игрек, но ещё не сказано, что они означают. Обозначение — первый шаг. | The equation uses x and y, but it has not been said what they mean. Naming is the first step. |
| `text` | Javob tekshiruvdan oldin turibdi. Masalada har doim shunday xavf bor: sistema to'g'ri yechilgan bo'lsa ham, natija masala shartiga zid bo'lishi mumkin. | Ответ стоит раньше проверки. В задаче всегда есть такая опасность: даже при верно решённой системе результат может противоречить условию. | The answer stands before the check. In a word problem there is always this danger: even with the system solved correctly, the result may contradict the statement. |
| `text` | Sistemani yechish uchun uning o'zi kerak. Shartlar tenglamaga aylanmaguncha, yechadigan narsa yo'q. | Чтобы решить систему, она должна быть. Пока условия не превращены в уравнения, решать нечего. | To solve a system you must have one. Until the conditions become equations there is nothing to solve. |
| `text` | Tekshirish nimani tekshiradi? Avval raqamlar topilishi kerak, keyin ular shartga qo'yiladi. | Что проверяет проверка? Сначала надо найти цифры, и только потом подставлять их в условие. | What does the check test? The digits must be found first, and only then put into the statement. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? Va oxirida masalaning savoliga javob berilganmi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? И отвечает ли последний на вопрос задачи? | Read the chain from top to bottom: does every step use the result of the one before it? And does the last one answer the question asked? |

---

## 09 · `AuditLines` · 🔴 · teg `shartni-notogri-tenglamaga-otkazish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Masala: bir son ikkinchisidan uchga katta, kvadratlarining ayirmasi o'ttiz uch. Yechimda tekshiruv ham bor, lekin u xatoni tutmagan. | Задача: одно число на три больше другого, разность их квадратов тридцать три. В решении есть и проверка, но ошибку она не поймала. | Problem: one number is three greater than another, and the difference of their squares is thirty-three. The solution has a check too, but it did not catch the error. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Sistema | Система | System |
| `text` | Sonlar: | Числа: | The numbers: |
| `text` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri, xato uchinchi qatorda. Igrek uchga teng deb olingan, lekin uch — bu shartdagi AYIRMA, ikkinchi sonning o'zi emas. To'g'ri yechish uchun ikkita tenglamani birga olish kerak: yig'indi o'n bir, ayirma uch, demak iks yetti va igrek to'rt. Tekshiramiz: yetti minus to'rt uch, qirq to'qqiz minus o'n olti o'ttiz uch. To'rtinchi qator xatoni tutmaydi, chunki u faqat yig'indini tekshirgan: sakkiz qo'shuv uch ham o'n bir. | Верно, ошибка в третьей строке. Игрек принят равным трём, но три — это РАЗНОСТЬ из условия, а не само второе число. Чтобы решить верно, надо взять два уравнения вместе: сумма одиннадцать, разность три, значит икс семь и игрек четыре. Проверяем: семь минус четыре — три, сорок девять минус шестнадцать — тридцать три. Четвёртая строка ошибку не ловит, потому что проверила только сумму: восемь плюс три — тоже одиннадцать. | Correct, the error is in the third line. y was taken to be three, but three is the DIFFERENCE from the statement, not the second number itself. To solve it properly the two equations must be taken together: the sum is eleven, the difference is three, so x is seven and y is four. Check: seven minus four is three, forty-nine minus sixteen is thirty-three. The fourth line does not catch the error because it checked only the sum: eight plus three is eleven as well. |
| `text` | Bu qator to'g'ri: kvadratlar ayirmasi yig'indi bilan ayirmaning ko'paytmasiga teng — bu ko'paytirishning qisqa formulasi. | Эта строка верна: разность квадратов равна произведению суммы на разность — это формула сокращённого умножения. | This line is right: the difference of squares equals the product of the sum and the difference — the standard identity. |
| `text` | Bu ham to'g'ri: ayirma uchga teng, shuning uchun uni uch bilan almashtirish mumkin, va yig'indi o'n bir chiqadi. Keyingi qatorga qarang — sonlar shu ikki shartdan topilganmi? | Эта тоже верна: разность равна трём, поэтому её можно заменить тройкой, и сумма выходит одиннадцать. Посмотри на следующую строку: найдены ли числа из этих двух условий? | This one is right too: the difference is three, so it may be replaced by three, and the sum comes out eleven. Look at the next line — were the numbers found from those two conditions? |
| `text` | To'rtinchi qatorda hisob to'g'ri: sakkiz qo'shuv uch haqiqatan o'n bir. Uning kamchiligi boshqada — u faqat yig'indini tekshirgan, ayirmani esa yo'q: sakkiz minus uch besh, uch emas. | В четвёртой строке вычисление верно: восемь плюс три действительно одиннадцать. Её недостаток в другом — она проверила только сумму, а разность нет: восемь минус три — пять, а не три. | The arithmetic in the fourth line is right: eight plus three really is eleven. Its flaw is different — it checked only the sum, not the difference: eight minus three is five, not three. |
| `wrongText` | Ikkita shartni birga oling: yig'indi o'n bir va ayirma uch. Shu ikki tenglamadan sonlarni o'zingiz toping va yozuvdagi bilan solishtiring. | Возьми два условия вместе: сумма одиннадцать и разность три. Найди числа из этих двух уравнений сам и сравни с записью. | Take the two conditions together: the sum is eleven and the difference is three. Find the numbers from those two equations yourself and compare with the record. |

---

## 10 · `ClozeBank` · 🔴 · teg `javobni-masala-tiliga-qaytarmaslik`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Masalani sistema orqali yechishda avval har bir noma'lum nimani anglatishi | При решении задачи через систему сначала | When solving a problem through a system, what each unknown means is |
| `text` | . So'zdagi har bir shart | , что означает каждое неизвестное. Каждое условие в тексте превращается в | first. Each condition in the text becomes |
| `text` | tenglamaga aylanadi. Matematik to'g'ri chiqqan yechim masala shartiga zid bo'lsa, u | уравнение. Если математически верное решение противоречит условию задачи, его | equation. If a mathematically correct solution contradicts the problem, it is |
| `text` | . | . | . |
| `label` | belgilanadi | определяют | defined |
| `label` | alohida | отдельное | a separate |
| `label` | rad etiladi | отбрасывают | rejected |
| `label` | taxmin qilinadi | угадывают | guessed |
| `label` | bitta umumiy | одно общее | one common |
| `label` | qabul qilinadi | принимают | accepted |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: harflar nimani bildirishi ISHNING BOSHIDA yoziladi, taxmin qilinmaydi; har bir shart o'z tenglamasini oladi, ikkitasi bitta tenglamaga siqilmaydi; va oxirida har bir yechim masalaning shartiga qaytariladi — matematik to'g'ri chiqqani ham zid bo'lsa rad etiladi. | Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: что означают буквы, записывают В НАЧАЛЕ работы, а не угадывают; каждое условие получает своё уравнение, два в одно не сжимаются; и в конце каждое решение возвращают в условие задачи — даже математически верное отбрасывается, если противоречит. | Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: what the letters mean is written down AT THE START, not guessed; each condition gets its own equation, two are not squeezed into one; and at the end every solution goes back to the statement — even a mathematically correct one is rejected if it contradicts it. |
| `text` | Noma'lum taxmin qilinmaydi, belgilanadi. Taxmin bitta javob topishi mumkin, lekin boshqasi yo'qligini ko'rsatmaydi. | Неизвестное не угадывают, а определяют. Угадывание может найти один ответ, но не покажет, что другого нет. | An unknown is not guessed, it is defined. Guessing may find one answer but cannot show there is no other. |
| `text` | Ikki shart bitta tenglamaga siqilmaydi: har biri o'z tenglamasini beradi, va shu ikkitasidan sistema tuziladi. | Два условия не сжимаются в одно уравнение: каждое даёт своё, и из этих двух составляется система. | Two conditions do not squeeze into one equation: each gives its own, and the system is built from the two. |
| `text` | Zid yechim qabul qilinmaydi. Nol raqamlar yig'indisi bo'lolmaydi, manfiy son natural bo'lolmaydi — bunday nomzod tashlab yuboriladi. | Противоречащее решение не принимают. Нуль не бывает суммой цифр, отрицательное число не бывает натуральным — такой кандидат отбрасывается. | A contradicting solution is not accepted. Zero cannot be a digit sum, a negative number cannot be natural — such a candidate is thrown out. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ish boshida nima qilinishi haqida, ikkinchisi har shart nechta tenglama berishi haqida, uchinchisi esa zid yechim bilan nima qilinishi haqida. | Проверяй каждую клетку самим предложением: первая про то, что делают в начале, вторая про то, сколько уравнений даёт каждое условие, третья про то, что делают с противоречащим решением. | Check each blank against the sentence itself: the first is about what is done at the start, the second about how many equations each condition gives, the third about what is done with a contradicting solution. |

