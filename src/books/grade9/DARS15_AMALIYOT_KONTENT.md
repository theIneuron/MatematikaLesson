# DARS15_AMALIYOT_KONTENT — 9-sinf, 15-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars15/D15_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `TrueFalse` · 🟢 · teg `har-safar-almashadi-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Ko'paytma allaqachon ko'paytuvchilarga ajratilgan, belgisi qat'iy. | Произведение уже разложено на множители, знак строгий. | The product is already factored, and the sign is strict. |
| `ask` | Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `claim` | — takroriy ildiz, unda ishora almashmaydi. | — повторяющийся корень, в нём знак не меняется. | is a repeated root, and the sign does not change there. |
| `claim` | — uchta HAR XIL ildizga ega. | — имеет три РАЗНЫХ корня. | has three DIFFERENT roots. |
| `claim` | — javobga kiradi. | — входит в ответ. | belongs to the answer. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri. Minus ikki takroriy ildiz: qavs kvadratda turgani uchun undan o'tishda ishora ikki marta almashadi, ya'ni o'zgarmaydi. Har xil ildizlar esa ikkita — minus ikki va uch, uchinchisi yo'q: kvadrat qo'shimcha ildiz emas, o'sha ildizni ikki marta beradi. Uchning o'zi javobga kirmaydi, chunki belgi qat'iy: u yerda ko'paytma nolga teng, noldan katta emas. | Верно. Минус два — повторяющийся корень: скобка стоит в квадрате, поэтому при переходе через неё знак меняется дважды, то есть не меняется. Разных корней всего два — минус два и три, третьего нет: квадрат не даёт нового корня, он даёт тот же корень дважды. А сама тройка в ответ не входит, ведь знак строгий: там произведение равно нулю, а не больше нуля. | Correct. Minus two is a repeated root: the bracket is squared, so crossing it flips the sign twice, that is, not at all. There are only two distinct roots — minus two and three; there is no third: a square adds no new root, it gives the same root twice. And three itself is not in the answer, since the sign is strict: the product equals zero there, not more than zero. |
| `text` | Qavs KVADRATDA turibdi, ya'ni ko'paytmada u ikki marta uchraydi. Ikki marta almashish bir-birini bekor qiladi: ishora saqlanadi. | Скобка стоит в КВАДРАТЕ, то есть в произведении она встречается дважды. Двойная перемена знака взаимно уничтожается: знак сохраняется. | The bracket is SQUARED, so it occurs twice in the product. Two sign flips cancel each other: the sign is kept. |
| `text` | Ildizlarni sanab chiqing: qavslar nolga aylanadigan joylar minus ikki va uch — ikkita son. Kvadrat yangi ildiz keltirmaydi. | Пересчитай корни: скобки обращаются в нуль при минус двух и трёх — два числа. Квадрат нового корня не добавляет. | Count the roots: the brackets vanish at minus two and three — two numbers. A square brings no new root. |
| `text` | Uchni ko'paytmaga qo'ying: oxirgi qavs nolga aylanadi, butun ko'paytma ham nol. Nol esa noldan katta emas, belgi qat'iy. | Подставь три в произведение: последняя скобка обращается в нуль, и всё произведение нуль. А нуль не больше нуля, знак строгий. | Substitute three into the product: the last bracket becomes zero, and so does the whole product. And zero is not greater than zero, the sign is strict. |
| `wrongText` | Ikkita savolga alohida javob bering: qaysi qavs ikki marta uchraydi, va qat'iy belgi ildiz nuqtalarini javobga kiritadimi? | Ответь на два вопроса по отдельности: какая скобка встречается дважды, и включает ли строгий знак точки корней в ответ? | Answer two questions separately: which bracket occurs twice, and does a strict sign include the root points in the answer? |

---

## 02 · `Choice` · 🟢 · teg `har-safar-almashadi-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Test | Тест | Test |
| `setup` | Oraliqlar usulida oddiy ildizdan o'tganda ishora almashadi, takroriy ildizda esa saqlanadi. | В методе интервалов при переходе через простой корень знак меняется, а при повторяющемся сохраняется. | In the interval method the sign changes at a simple root but is kept at a repeated one. |
| `ask` | Nima uchun takroriy ildizda ishora almashmaydi? | Почему в повторяющемся корне знак не меняется? | Why does the sign not change at a repeated root? |
| `givenLabel` | Takroriy ildiz | Повторяющийся корень | Repeated root |
| `label` | Ikki marta almashish bir-birini bekor qiladi | Двойная перемена знака взаимно уничтожается | Two sign flips cancel each other out |
| `label` | Takroriy ildiz umuman ildiz hisoblanmaydi | Повторяющийся корень вообще не считается корнем | A repeated root does not count as a root at all |
| `label` | Kvadrat har doim musbat, shuning uchun u ishoraga ta'sir qilmaydi | Квадрат всегда положителен, поэтому он на знак не влияет | A square is always positive, so it has no effect on the sign |
| `label` | Shunday kelishilgan, sababi yo'q | Так договорились, причины нет | It is a convention, there is no reason |
| `correctText` | To'g'ri. Ildiz ikki marta uchraganda, u ikki marta nolni kesib o'tadi: birinchi o'tish ishorani almashtiradi, ikkinchisi uni joyiga qaytaradi. Shu sababli natijada ishora o'zgarmaydi. Uchinchi variant ham qismi bilan to'g'ri — kvadrat manfiy bo'lmaydi — lekin u nima uchun ISHORA ALMASHMASLIGINI tushuntirmaydi: kvadrat nolga aylanishi mumkin, va ildiz aynan shu yerda turibdi. | Верно. Когда корень встречается дважды, нуль пересекается дважды: первый переход меняет знак, второй возвращает его на место. Поэтому в итоге знак не меняется. Третий вариант отчасти верен — квадрат не бывает отрицательным — но он не объясняет, почему ЗНАК НЕ МЕНЯЕТСЯ: квадрат может обратиться в нуль, и корень стоит именно там. | Correct. When a root occurs twice, zero is crossed twice: the first crossing flips the sign, the second puts it back. So in the end the sign is unchanged. The third option is partly true — a square is never negative — but it does not explain why THE SIGN DOES NOT CHANGE: a square can become zero, and the root sits exactly there. |
| `text` | Takroriy ildiz ham ildiz: o'sha nuqtada ifoda nolga aylanadi. Qat'iy tengsizlikda u javobdan chiqariladi, ya'ni e'tibordan qolmaydi. | Повторяющийся корень — тоже корень: в этой точке выражение обращается в нуль. В строгом неравенстве его исключают из ответа, то есть без внимания он не остаётся. | A repeated root is a root: the expression becomes zero there. In a strict inequality it is excluded from the answer, so it is not ignored. |
| `text` | Kvadrat manfiy bo'lmaydi — bu to'g'ri, lekin u NOLGA aylanishi mumkin, va ildiz aynan shu joyda. Ishora almashmasligining sababi boshqa: ildiz ikki marta uchraydi. | Квадрат не бывает отрицательным — это верно, но он может обратиться в НУЛЬ, и корень стоит именно там. Причина неизменности знака другая: корень встречается дважды. | A square is never negative — true, but it can become ZERO, and the root sits exactly there. The reason the sign is kept is different: the root occurs twice. |
| `text` | Bu kelishuv emas, hisobning natijasi. Ko'paytmani ikkita ildizga ajratib yozing va har biridan o'tishda ishorani kuzatib boring — ikkita almashish bir-birini bekor qiladi. | Это не договорённость, а результат вычисления. Распиши произведение на два корня и следи за знаком при переходе через каждый — две перемены взаимно уничтожаются. | This is not a convention but the outcome of a computation. Write the product out as two roots and follow the sign across each — the two flips cancel. |
| `wrongText` | Kvadratni ikkita bir xil qavs deb yozing. Har bir qavsdan o'tishda ishora almashadi — ikki marta almashsa, natija qanday bo'ladi? | Запиши квадрат как две одинаковые скобки. При переходе через каждую скобку знак меняется — а если он меняется дважды, что получится? | Write the square as two identical brackets. The sign flips at each one — and if it flips twice, what is the result? |

---

## 03 · `RowTable` · 🟢 · teg `nechta-oraliq-notogri-hisoblash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Bu ko'paytmaning uchta ildizi bor: minus ikki, nol va ikki. Jadvalda har oraliqdan bittadan son olingan. | У этого произведения три корня: минус два, нуль и два. В таблице взято по одному числу из каждого промежутка. | This product has three roots: minus two, zero and two. The table takes one number from each interval. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Minus birda: minus bir karra minus uch karra bir — uchta ko'paytuvchidan ikkitasi manfiy, demak natija musbat, uch. O'ng chetda esa iks uchga teng: uch karra bir karra besh, ya'ni o'n besh. Jadvalning eng muhim gapi — ishoralar ketma-ketligi: manfiy, musbat, manfiy, musbat. Uchta ildiz o'qni TO'RTTA oraliqqa bo'ladi, va har ildizda ishora almashadi. | Верно. В минус одном: минус один на минус три на один — из трёх множителей два отрицательных, значит результат положителен, три. А справа икс равен трём: три на один на пять, то есть пятнадцать. Главное в таблице — последовательность знаков: минус, плюс, минус, плюс. Три корня делят ось на ЧЕТЫРЕ промежутка, и в каждом корне знак меняется. | Correct. At minus one: minus one times minus three times one — two of the three factors are negative, so the result is positive, three. And on the right x is three: three times one times five, that is fifteen. The main point of the table is the sequence of signs: minus, plus, minus, plus. Three roots split the axis into FOUR intervals, and the sign changes at each root. |
| `text` | Ishoralarni sanab chiqing: minus bir manfiy, minus bir minus ikki uch manfiy, minus bir qo'shuv ikki bir musbat. Ikkita manfiy ko'paytuvchi musbat natija beradi. | Пересчитай знаки: минус один отрицателен, минус один минус два — минус три, отрицательно, минус один плюс два — один, положительно. Два отрицательных множителя дают положительный результат. | Count the signs: minus one is negative, minus one minus two is minus three, negative, minus one plus two is one, positive. Two negative factors give a positive result. |
| `text` | Bu ustunda igrek MUSBAT o'n besh. Minus uchda esa qiymat minus o'n besh — jadvalning birinchi ustunida shu turibdi. Ishora manfiy ustunni musbatidan ajratadi. | В этом столбце игрек ПОЛОЖИТЕЛЕН — пятнадцать. А при минус трёх значение минус пятнадцать, оно стоит в первом столбце. Знак и отличает отрицательный столбец от положительного. | In this column y is POSITIVE fifteen. At minus three the value is minus fifteen — that stands in the first column. The sign is what tells the negative column from the positive one. |
| `text` | Katakka igrekning qiymati ko'chirilgan. Yuqori qatorda IKS turadi, pastki qatorda igrek: har qator o'zining sonini so'raydi. | В клетку переписано значение игрека. В верхней строке стоит ИКС, в нижней игрек: каждая строка спрашивает своё число. | The value of y was copied into the cell. The top row holds X and the bottom row y: each row asks for its own number. |
| `text` | Uchta ko'paytuvchining hammasini hisoblang: minus bir, minus uch va bir. Ularning ko'paytmasi uch. | Посчитай все три множителя: минус один, минус три и один. Их произведение — три. | Compute all three factors: minus one, minus three, and one. Their product is three. |
| `wrongText` | Har katakda uchta ko'paytuvchini alohida hisoblang va ishoralarini sanab chiqing: nechta manfiy ko'paytuvchi bor? | В каждой клетке считай три множителя по отдельности и пересчитывай знаки: сколько отрицательных множителей? | In each cell compute the three factors separately and count the signs: how many negative factors are there? |

---

## 04 · `PlacePoint` · 🟡 · teg `toliq-korpaytirmaslik`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Belgilash | Отметка | Marking |
| `setup` | Grafik chizilgan. U Ox o'qini bir necha joyda kesib o'tadi. | График построен. Он пересекает ось Ox в нескольких местах. | The graph is drawn. It crosses the Ox axis in several places. |
| `ask` | Grafik Ox ni kesgan BARCHA nuqtalarni qo'ying. | Поставь ВСЕ точки, где график пересекает Ox. | Place ALL the points where the graph crosses Ox. |
| `correctText` | To'g'ri, uchta nuqta: minus bir, nol va uch. Har bir ko'paytuvchi bittadan ildiz beradi — iksning o'zi nolni, iks minus uch uchni, iks qo'shuv bir minus birni. NOLNI tashlab ketish eng ko'p uchraydigan xato: ifodani iksga qisqartirsangiz, ildiz yo'qoladi va oraliqlar soni ham noto'g'ri chiqadi. Chizmada bu ko'rinib turadi: grafik nolda ham o'qni kesib o'tadi. | Верно, три точки: минус один, нуль и три. Каждый множитель даёт по корню — сам икс даёт нуль, икс минус три даёт три, икс плюс один даёт минус один. Потерять НУЛЬ — самая частая ошибка: если сократить выражение на икс, корень исчезнет, и промежутков окажется неверное число. На чертеже это видно: график пересекает ось и в нуле. | Correct, three points: minus one, zero and three. Each factor gives one root — x itself gives zero, x minus three gives three, x plus one gives minus one. Losing the ZERO is the most common mistake: cancelling the expression by x erases that root, and the number of intervals comes out wrong too. The drawing shows it: the graph crosses the axis at zero as well. |
| `text` | Nol tushib qoldi, uning o'rniga bir qo'yilgan. Birinchi ko'paytuvchi iksning O'ZI: u nolda nolga aylanadi, demak nol ham ildiz. Bir esa ildiz emas: bir karra minus ikki karra ikki minus to'rt beradi. | Нуль потерян, а на его место поставлена единица. Первый множитель — САМ икс: он обращается в нуль при нуле, значит нуль тоже корень. А единица корнем не является: один на минус два на два даёт минус четыре. | The zero was lost and one was put in its place. The first factor is X ITSELF: it becomes zero at zero, so zero is a root too. And one is not a root: one times minus two times two gives minus four. |
| `text` | Nol tushib qoldi. Birinchi ko'paytuvchi iksning O'ZI: u nolda nolga aylanadi, demak nol ham ildiz. Chizmada grafik nolda o'qni kesib o'tadi. | Нуль потерян. Первый множитель — САМ икс: он обращается в нуль при нуле, значит нуль тоже корень. На чертеже график пересекает ось в нуле. | The zero was lost. The first factor is X ITSELF: it becomes zero at zero, so zero is a root too. On the drawing the graph crosses the axis at zero. |
| `text` | Ishora almashdi. Qavsda iks QO'SHUV bir turibdi, u minus birda nolga aylanadi. Minus uchda esa grafik o'qdan ancha pastda. | Сбился знак. В скобке икс ПЛЮС один, она обращается в нуль при минус одном. А при минус трёх график далеко ниже оси. | A sign slipped. The bracket has x PLUS one, which becomes zero at minus one. At minus three the graph is far below the axis. |
| `text` | Bir ildiz emas: birni qo'ying — bir karra minus ikki karra ikki, ya'ni minus to'rt, nol emas. Qavs iks minus uch bo'lsa, ildiz uchga teng. | Единица не корень: подставь один — один на минус два на два, то есть минус четыре, а не нуль. Если скобка икс минус три, корень равен трём. | One is not a root: substitute it — one times minus two times two, that is minus four, not zero. If the bracket is x minus three, the root is three. |
| `text` | Nuqtalardan biri o'qdan chetda qolgan. Grafik Ox ni kesgan joyda igrek nolga teng, demak uchala nuqta ham gorizontal o'qda yotadi. | Одна из точек оказалась не на оси. Там, где график пересекает Ox, игрек равен нулю, значит все три точки лежат на горизонтальной оси. | One of the points ended up off the axis. Where the graph crosses Ox, y equals zero, so all three points lie on the horizontal axis. |
| `wrongText` | Har bir ko'paytuvchini alohida nolga tenglashtiring: iks, iks minus uch va iks qo'shuv bir. Har biri bittadan ildiz beradi, va hammasi Ox da yotadi. | Приравняй каждый множитель к нулю по отдельности: икс, икс минус три и икс плюс один. Каждый даёт по корню, и все они лежат на Ox. | Set each factor to zero separately: x, x minus three, and x plus one. Each gives one root, and they all lie on Ox. |

---

## 05 · `TypeSet` · 🟡 · teg `toliq-korpaytirmaslik`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ildizlar | Корни | Roots |
| `setup` | Avval umumiy ko'paytuvchini qavsdan chiqaring, keyin qavs ichidagini ko'paytuvchilarga ajratib oling. | Сначала вынеси общий множитель за скобку, потом разложи то, что в скобке. | First take the common factor out of the bracket, then factor what is left inside. |
| `ask` | Tenglamaning BARCHA ildizlarini yozing. | Запиши ВСЕ корни уравнения. | Write down ALL roots of the equation. |
| `hint` | Nuqta-vergul bilan ajrating. | Раздели точкой с запятой. | Separate them with semicolons. |
| `givenLabel` | Tenglama | Уравнение | Equation |
| `correctText` | To'g'ri: nol, bir va uch. Iksni qavsdan chiqarsak, iks karra iks kvadrat minus to'rt iks qo'shuv uch nolga teng bo'ladi; qavs ichidagi uch had esa iks minus bir karra iks minus uchga ajraladi. Uchta ko'paytuvchi — uchta ildiz. Ifodani iksga BO'LIB yuborish mumkin emas: iks nolga teng bo'lishi ham mumkin, va bo'lish aynan shu ildizni o'chirib tashlaydi. | Верно: нуль, один и три. Вынеся икс за скобку, получим икс на икс в квадрате минус четыре икс плюс три равно нулю; а трёхчлен в скобке раскладывается на икс минус один и икс минус три. Три множителя — три корня. Делить выражение на икс нельзя: икс может быть равен нулю, и деление стирает именно этот корень. | Correct: zero, one and three. Taking x out gives x times x squared minus four x plus three equals zero; and the trinomial in the bracket factors into x minus one and x minus three. Three factors — three roots. The expression must not be DIVIDED by x: x may be zero, and dividing erases exactly that root. |
| `text` | Nol tushib qoldi — ifoda iksga bo'lib yuborilgan. Iks nolga teng bo'lganda tenglama bajariladi: nol minus nol qo'shuv nol nolga teng. Nolga bo'lish taqiqlangani uchun umumiy ko'paytuvchi QAVSDAN CHIQARILADI, bo'linmaydi. | Нуль потерян — выражение поделили на икс. При иксе, равном нулю, уравнение выполняется: нуль минус нуль плюс нуль равно нулю. Так как на нуль делить нельзя, общий множитель ВЫНОСЯТ за скобку, а не сокращают. | The zero was lost — the expression was divided by x. At x equal to zero the equation holds: zero minus zero plus zero is zero. Since division by zero is forbidden, a common factor is TAKEN OUT of the bracket, never cancelled. |
| `text` | Bitta ildiz yozildi. Uchinchi darajali tenglamada uchta ildiz bo'lishi mumkin: ifodani oxirigacha ko'paytuvchilarga ajratib chiqing. | Записан один корень. У уравнения третьей степени может быть три корня: разложи выражение на множители до конца. | One root was written. A cubic can have three roots: factor the expression all the way. |
| `text` | To'rt — iks kvadratning oldidagi koeffitsient, ildiz emas. To'rtni tenglamaga qo'yib ko'ring: oltmish to'rt minus oltmish to'rt qo'shuv o'n ikki, ya'ni o'n ikki, nol emas. | Четыре — коэффициент при икс в квадрате, а не корень. Подставь четыре в уравнение: шестьдесят четыре минус шестьдесят четыре плюс двенадцать — двенадцать, а не нуль. | Four is the coefficient of x squared, not a root. Substitute four into the equation: sixty-four minus sixty-four plus twelve is twelve, not zero. |
| `text` | Ishora almashdi. Qavslar iks minus bir va iks minus uch, ya'ni ildizlar MUSBAT bir va uch. Minus birni qo'yib ko'ring: minus bir minus to'rt minus uch, ya'ni minus sakkiz. | Сбился знак. Скобки — икс минус один и икс минус три, значит корни ПОЛОЖИТЕЛЬНЫЕ один и три. Подставь минус один: минус один минус четыре минус три, то есть минус восемь. | A sign slipped. The brackets are x minus one and x minus three, so the roots are POSITIVE one and three. Substitute minus one: minus one minus four minus three, that is minus eight. |
| `wrongText` | Umumiy ko'paytuvchi iksni qavsdan chiqaring, so'ng qavs ichidagi uch hadni ko'paytuvchilarga ajratib oling. Har bir ko'paytuvchi bittadan ildiz beradi — iksning o'zi ham. | Вынеси общий множитель икс за скобку, потом разложи трёхчлен в скобке на множители. Каждый множитель даёт по корню — и сам икс тоже. | Take the common factor x out of the bracket, then factor the trinomial inside. Each factor gives one root — including x itself. |

---

## 06 · `Zones` · 🟡 · teg `har-safar-almashadi-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Har bir ko'paytuvchi o'z ildizida ishora bilan nima qiladi? | Что делает со знаком каждый множитель в своём корне? | What does each factor do to the sign at its own root? |
| `ask` | Ko'paytuvchini bosing, keyin guruhni bosing. | Нажми множитель, потом нажми группу. | Tap a factor, then tap a group. |
| `label` | Ishora almashadi | Знак меняется | The sign changes |
| `label` | Ishora saqlanadi | Знак сохраняется | The sign is kept |
| `label` | Haqiqiy ildizi yo'q | Действительных корней нет | No real roots |
| `correctText` | To'g'ri. Birinchi darajali qavs o'z ildizidan o'tganda manfiydan musbatga o'tadi — ishora almashadi. Kvadratda turgan qavs ikki marta uchraydi, ikki marta almashish esa bir-birini bekor qiladi — ishora saqlanadi. Uchinchi guruhdagi yozuvlar hech qachon nolga aylanmaydi va har doim musbat, shuning uchun ular ishoraga umuman ta'sir qilmaydi: o'qqa qo'yiladigan nuqta ham bermaydi. | Верно. Скобка первой степени при переходе через свой корень идёт из минуса в плюс — знак меняется. Скобка в квадрате встречается дважды, а двойная перемена взаимно уничтожается — знак сохраняется. А записи третьей группы никогда не обращаются в нуль и всегда положительны, поэтому на знак они не влияют вовсе: и точки на ось они не дают. | Correct. A first-degree bracket goes from minus to plus across its root — the sign changes. A squared bracket occurs twice, and two flips cancel — the sign is kept. And the records of the third group never become zero and are always positive, so they do not affect the sign at all: they give no point to put on the axis either. |
| `text` | Bu yozuvlar hech qachon nolga aylanmaydi: iks kvadrat manfiy bo'lmaydi, unga musbat son qo'shilsa natija har doim musbat. Ildizi yo'q ko'paytuvchi o'qqa nuqta ham qo'ymaydi. | Эти записи никогда не обращаются в нуль: икс в квадрате не бывает отрицательным, а с прибавленным положительным числом результат всегда положителен. Множитель без корней не ставит на ось и точки. | These records never become zero: x squared is never negative, and with a positive number added the result is always positive. A factor without roots puts no point on the axis either. |
| `text` | Bu qavs KVADRATDA turibdi, ya'ni ko'paytmada ikki marta uchraydi. Ikki marta almashish ishorani joyiga qaytaradi. | Эта скобка стоит в КВАДРАТЕ, то есть в произведении встречается дважды. Двойная перемена возвращает знак на место. | This bracket is SQUARED, so it occurs twice in the product. Two flips put the sign back where it was. |
| `text` | Bu qavs birinchi darajada: u o'z ildizidan bir marta o'tadi va ishorani almashtiradi. Ikkiga yaqin sonlarni qo'yib ko'ring — birda manfiy, uchda musbat. | Эта скобка первой степени: она проходит через свой корень один раз и меняет знак. Подставь числа около двух — при одном отрицательна, при трёх положительна. | This bracket is of first degree: it passes its root once and flips the sign. Try numbers around two — at one it is negative, at three positive. |
| `text` | Uchinchi guruhga faqat haqiqiy ildizi yo'q yozuvlar tushadi. Bu qavs nolga aylanadi, ya'ni ildizi bor. | В третью группу попадают только записи без действительных корней. Эта скобка обращается в нуль, значит корень у неё есть. | Only records without real roots belong to the third group. This bracket does become zero, so it has a root. |
| `wrongText` | Har bir ko'paytuvchiga ikkita savol bering: uning ildizi bormi, va u ko'paytmada nechta marta uchraydi? | Задай каждому множителю два вопроса: есть ли у него корень, и сколько раз он встречается в произведении? | Ask each factor two questions: does it have a root, and how many times does it occur in the product? |

---

## 07 · `DomainAxis` · 🟡 · teg `qatiy-tengsizlikda-ildizni-qoshish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Sonlar o'qi | Числовая ось | The number line |
| `setup` | Javob ikki qismdan iborat: ikki tomondan chegaralangan kesma va o'ngga ketuvchi nur. Bu yerda faqat KESMA so'ralyapti. | Ответ состоит из двух частей: ограниченного с двух сторон отрезка и уходящего вправо луча. Здесь спрашивают только ОТРЕЗОК. | The answer has two parts: a segment bounded on both sides, and a ray going right. Here only the SEGMENT is asked for. |
| `ask` | Javobning CHEGARALANGAN qismini o'qda ko'rsating. | Покажи на оси ОГРАНИЧЕННУЮ часть ответа. | Show the BOUNDED part of the answer on the axis. |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri: minus uchdan nolgacha, ikkala chegara ham bo'yalgan. Ildizlar minus uch, nol va besh; eng o'ng oraliqqa oltini qo'ysak, olti karra bir karra to'qqiz — musbat. Chapga qarab ishora almashib boradi: noldan beshgacha manfiy, minus uchdan nolgacha musbat, minus uchdan chapda yana manfiy. Belgi qat'iy emas, shuning uchun ildizlarning o'zi ham javobga kiradi — nuqtalar bo'yalgan. Qat'iy belgida esa ikkalasi ham bo'sh bo'lardi. | Верно: от минус трёх до нуля, обе границы закрашены. Корни — минус три, нуль и пять; подставив шесть в самый правый промежуток, получим шесть на один на девять — положительно. Влево знак меняется: от нуля до пяти отрицательно, от минус трёх до нуля положительно, левее минус трёх снова отрицательно. Знак нестрогий, поэтому сами корни тоже входят в ответ — точки закрашены. При строгом знаке обе были бы пустыми. | Correct: from minus three to zero, both boundaries filled. The roots are minus three, zero and five; substituting six into the rightmost interval gives six times one times nine — positive. Going left the sign alternates: negative from zero to five, positive from minus three to zero, negative again left of minus three. The sign is non-strict, so the roots themselves belong to the answer — the points are filled. With a strict sign both would be hollow. |
| `text` | Chegaralarning turi noto'g'ri. Belgi «katta YOKI TENG», ya'ni ildiz nuqtalarida ko'paytma nolga teng bo'ladi va bu javobga kiradi — ikkala nuqta ham bo'yalgan bo'lishi kerak. | Тип границ неверен. Знак «больше ИЛИ РАВНО», то есть в точках корней произведение равно нулю, и это входит в ответ — обе точки должны быть закрашены. | The boundary type is wrong. The sign is "greater than OR EQUAL", so at the root points the product equals zero, and that belongs to the answer — both points must be filled. |
| `text` | Bu oraliqda ko'paytma MANFIY. Bittasini tekshirib ko'ring: bir karra minus to'rt karra to'rt — minus o'n olti. Musbat oraliqni qidirish kerak. | На этом промежутке произведение ОТРИЦАТЕЛЬНО. Проверь единицей: один на минус четыре на четыре — минус шестнадцать. Нужен положительный промежуток. | On this interval the product is NEGATIVE. Check with one: one times minus four times four is minus sixteen. A positive interval is what is needed. |
| `text` | Minus uchdan chapda ko'paytma manfiy: minus to'rtni qo'yib ko'ring — minus to'rt karra minus to'qqiz karra minus bir, uchta manfiy ko'paytuvchi manfiy natija beradi. Va bu qism chegaralanmagan. | Левее минус трёх произведение отрицательно: подставь минус четыре — минус четыре на минус девять на минус один; три отрицательных множителя дают отрицательный результат. К тому же эта часть не ограничена. | Left of minus three the product is negative: substitute minus four — minus four times minus nine times minus one; three negative factors give a negative result. Besides, that part is unbounded. |
| `text` | Bu son ildiz emas, shuning uchun chegara bo'lolmaydi. Chegaralar faqat ildizlarda bo'ladi: minus uch, nol va besh. | Это число не корень, поэтому границей быть не может. Границы бывают только в корнях: минус три, нуль и пять. | That number is not a root, so it cannot be a boundary. Boundaries occur only at roots: minus three, zero and five. |
| `text` | Uchta ildizni o'qqa qo'ying, eng o'ng oraliqqa son qo'yib ishorani aniqlang va chapga qarab almashtirib boring. Ikki tomondan chegaralangan musbat oraliqni tanlang. | Нанеси три корня на ось, подставь число в самый правый промежуток и меняй знак влево. Выбери положительный промежуток, ограниченный с двух сторон. | Put the three roots on the axis, substitute a number into the rightmost interval and alternate the sign leftwards. Pick the positive interval bounded on both sides. |
| `wrongText` | Ildizlar minus uch, nol va besh. Eng o'ng oraliqqa oltini qo'yib ishorani aniqlang, chapga qarab har ildizda almashtiring, va ikki tomondan chegaralangan musbat oraliqni belgilang. | Корни — минус три, нуль и пять. Подставь шесть в самый правый промежуток, определи знак, меняй его влево на каждом корне и отметь положительный промежуток, ограниченный с двух сторон. | The roots are minus three, zero and five. Substitute six into the rightmost interval, find the sign, alternate it leftwards at each root, and mark the positive interval bounded on both sides. |

---

## 08 · `ClozeBank` · 🔴 · teg `toliq-korpaytirmaslik`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Oraliqlar usulida ifoda oxirigacha | В методе интервалов выражение до конца разлагают на | In the interval method the expression is fully split into |
| `text` | ajratiladi va barcha ildizlar o'qqa qo'yiladi. Har bir oddiy ildizdan o'tishda ishora | , и все корни наносят на ось. При переходе через каждый простой корень знак | , and all the roots are put on the axis. At every simple root the sign |
| `text` | , takroriy ildizda esa | , а при повторяющемся корне | , but at a repeated root it |
| `text` | . | . | . |
| `label` | ko'paytuvchilarga | множители | factors |
| `label` | almashadi | меняется | changes |
| `label` | saqlanadi | сохраняется | stays the same |
| `label` | hadlarga | слагаемые | terms |
| `label` | yo'qoladi | исчезает | disappears |
| `label` | ham almashadi | тоже меняется | changes as well |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: ifoda OXIRIGACHA ko'paytuvchilarga ajratiladi — bitta ildiz tushib qolsa, oraliqlar ham noto'g'ri chiqadi; oddiy ildizda ishora almashadi, chunki bitta ko'paytuvchi nolni kesib o'tadi; takroriy ildizda esa saqlanadi, chunki nol ikki marta kesiladi va ikkita almashish bir-birini bekor qiladi. | Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: выражение разлагают на множители ДО КОНЦА — пропусти один корень, и промежутки выйдут неверными; в простом корне знак меняется, ведь нуль пересекает один множитель; а в повторяющемся сохраняется, ведь нуль пересекается дважды и две перемены взаимно уничтожаются. | Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: the expression is factored ALL THE WAY — miss one root and the intervals come out wrong; at a simple root the sign changes, since one factor crosses zero; at a repeated root it is kept, since zero is crossed twice and the two flips cancel. |
| `text` | Hadlarga ajratish — bu qo'shish, oraliqlar usuli esa KO'PAYTMA bilan ishlaydi. Faqat ko'paytmaning ishorasini ko'paytuvchilar bo'yicha aniqlash mumkin. | Разложить на слагаемые — это сложение, а метод интервалов работает с ПРОИЗВЕДЕНИЕМ. Только у произведения знак можно определить по множителям. | Splitting into terms is addition, while the interval method works with a PRODUCT. Only for a product can the sign be read off the factors. |
| `text` | Ishora yo'qolmaydi — ifoda ildizda nolga aylanadi, lekin ildizning ikki tomonida ishora bor. O'tishda u almashadi. | Знак не исчезает — выражение обращается в нуль в корне, но по обе стороны от корня знак есть. При переходе он меняется. | The sign does not disappear — the expression becomes zero at the root, but on both sides of the root there is a sign. Crossing it flips. |
| `text` | Takroriy ildizda ishora almashmaydi: qavs ikki marta uchraydi, ya'ni nol ikki marta kesiladi va almashishlar bir-birini bekor qiladi. | В повторяющемся корне знак не меняется: скобка встречается дважды, то есть нуль пересекается дважды, и перемены взаимно уничтожаются. | At a repeated root the sign does not change: the bracket occurs twice, so zero is crossed twice and the flips cancel. |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ifoda nimaga ajratilishi haqida, ikkinchisi oddiy ildizda ishora haqida, uchinchisi esa takroriy ildizda ishora haqida. | Проверяй каждую клетку самим предложением: первая про то, на что разлагают выражение, вторая про знак в простом корне, третья про знак в повторяющемся. | Check each blank against the sentence itself: the first is about what the expression is split into, the second about the sign at a simple root, the third about the sign at a repeated one. |

---

## 09 · `OrderLines` · 🔴 · teg `nechta-oraliq-notogri-hisoblash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Tartib | Порядок | Order |
| `setup` | Oraliqlar usulining beshta qadami aralashtirilgan. | Пять шагов метода интервалов перемешаны. | Five steps of the interval method are shuffled. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `label` | Ildizlarni topamiz: | Находим корни: | Find the roots: |
| `label` | Ildizlarni o'qqa qo'yamiz: o'q to'rtta oraliqqa bo'linadi | Наносим корни на ось: ось делится на четыре промежутка | Put the roots on the axis: it splits into four intervals |
| `label` | Eng o'ng oraliqqa son qo'yamiz: | Подставляем число в самый правый промежуток: | Substitute a number into the rightmost interval: |
| `label` | Chapga qarab har ildizda ishorani almashtiramiz | Влево на каждом корне меняем знак | Alternate the sign leftwards at each root |
| `label` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri. Uchta ildiz o'qni to'rtta oraliqqa bo'ladi — bu son ildizlar sonidan bittaga ko'p, va uni sanab chiqish kerak, taxmin qilinmaydi. Eng o'ng oraliqda uchta ko'paytuvchi ham musbat, ya'ni natija musbat. Chapga qarab har ildizda ishora almashadi: manfiy, musbat, manfiy. Bizga manfiy oraliqlar kerak, ular ikkita: minus uchdan chapda va bir bilan ikki orasida. Ildizlarning o'zi kirmaydi, chunki belgi qat'iy. | Верно. Три корня делят ось на четыре промежутка — это число на единицу больше числа корней, и его надо пересчитать, а не угадывать. В самом правом промежутке все три множителя положительны, значит и результат положителен. Влево знак меняется на каждом корне: минус, плюс, минус. Нам нужны отрицательные промежутки, их два: левее минус трёх и между единицей и двойкой. Сами корни не входят, ведь знак строгий. | Correct. Three roots split the axis into four intervals — one more than the number of roots, and that count must be made, not guessed. In the rightmost interval all three factors are positive, so the result is positive. Going left the sign flips at each root: minus, plus, minus. We need the negative intervals, and there are two: left of minus three and between one and two. The roots themselves are excluded, since the sign is strict. |
| `text` | O'qqa nima qo'yiladi, agar ildizlar hali topilmagan bo'lsa? Avval har bir ko'paytuvchi nolga tenglashtiriladi. | Что наносить на ось, если корни ещё не найдены? Сначала каждый множитель приравнивают к нулю. | What would you put on the axis if the roots are not found yet? Each factor is set to zero first. |
| `text` | «Eng o'ng oraliq» degan gap o'qda ildizlar turgandan keyin ma'noga ega bo'ladi: oraliqlarni aynan ildizlar hosil qiladi. | Слова «самый правый промежуток» обретают смысл только после того, как корни на оси: именно корни и создают промежутки. | The phrase "the rightmost interval" makes sense only once the roots are on the axis: it is the roots that create the intervals. |
| `text` | Nimani almashtiramiz, agar birorta oraliqning ishorasi hali ma'lum bo'lmasa? Almashtirish uchun BOSHLANG'ICH ishora kerak, u esa son qo'yishdan chiqadi. | Что менять, если знак ни одного промежутка ещё не известен? Для чередования нужен НАЧАЛЬНЫЙ знак, а он выходит из подстановки числа. | What would you alternate if no interval has a known sign yet? Alternating needs a STARTING sign, and that comes from substituting a number. |
| `text` | Javob barcha oraliqlarning ishorasi ma'lum bo'lgandan keyin yoziladi. Bittasining ishorasi bilan javob yozib bo'lmaydi: manfiy oraliqlar ikkita. | Ответ пишут после того, как знаки всех промежутков известны. По знаку одного промежутка ответ не запишешь: отрицательных промежутков два. | The answer is written once the signs of all intervals are known. One interval is not enough: there are two negative intervals. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

---

## 10 · `AuditLines` · 🔴 · teg `har-safar-almashadi-deb-oylash`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Tengsizlik oraliqlar usulida yechilgan. Ildizlar to'g'ri topilgan, xato keyinroq. | Неравенство решено методом интервалов. Корни найдены верно, ошибка позже. | The inequality was solved by the interval method. The roots are right, the error comes later. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Tengsizlik | Неравенство | Inequality |
| `text` | Ildizlar: | Корни: | Roots: |
| `text` | To'rt — takroriy ildiz | Четыре — повторяющийся корень | Four is a repeated root |
| `text` | To'rtdan o'tishda ishora almashadi | При переходе через четыре знак меняется | Crossing four flips the sign |
| `text` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri, xato uchinchi qatorda. To'rt TAKRORIY ildiz — qavs kvadratda, ya'ni nol ikki marta kesiladi va ishora joyida qoladi. Beshni qo'ysak: besh karra bir — musbat; to'rtdan chapga o'tsak ishora o'zgarmaydi, ya'ni noldan to'rtgacha ham musbat; faqat nolda almashadi. Demak javob noldan o'ngga, to'rtning o'zidan tashqari: u yerda ko'paytma nolga teng, belgi esa qat'iy. To'rtinchi qator xato, lekin u uchinchisidan kelib chiqadi. | Верно, ошибка в третьей строке. Четыре — ПОВТОРЯЮЩИЙСЯ корень: скобка в квадрате, то есть нуль пересекается дважды и знак остаётся на месте. Подставим пять: пять на один — положительно; переходя влево через четыре, знак не меняется, значит от нуля до четырёх тоже положительно; меняется только в нуле. Значит ответ — правее нуля, кроме самой четвёрки: там произведение равно нулю, а знак строгий. Четвёртая строка неверна, но она следует из третьей. | Correct, the error is in the third line. Four is a REPEATED root: the bracket is squared, so zero is crossed twice and the sign stays put. Substitute five: five times one — positive; crossing four leftwards does not flip it, so from zero to four it is positive too; it flips only at zero. So the answer is to the right of zero, except four itself: there the product equals zero, and the sign is strict. The fourth line is wrong, but it follows from the third. |
| `text` | Bu qator to'g'ri: iks nolda nolga aylanadi, iks minus to'rt esa to'rtda. Boshqa ildiz yo'q. | Эта строка верна: икс обращается в нуль при нуле, а икс минус четыре — при четырёх. Других корней нет. | This line is right: x becomes zero at zero, and x minus four at four. There are no other roots. |
| `text` | Bu ham to'g'ri: qavs kvadratda turibdi, ya'ni to'rt ko'paytmada ikki marta uchraydi. Keyingi qatorga qarang — takroriy ildizda ishora nima bo'ladi? | Эта тоже верна: скобка стоит в квадрате, то есть четвёрка встречается в произведении дважды. Посмотри на следующую строку: что происходит со знаком в повторяющемся корне? | This one is right too: the bracket is squared, so four occurs twice in the product. Look at the next line — what happens to the sign at a repeated root? |
| `text` | To'rtinchi qator xato, lekin u BIRINCHI xato emas: u oldingi qatorning natijasi. Xato o'sha «ishora almashadi» degan xulosada. | Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она следствие предыдущей. Ошибка в самом выводе «знак меняется». | The fourth line is wrong, but it is not the FIRST error: it follows from the previous one. The error is in the conclusion "the sign flips". |
| `wrongText` | Ikkita sonni tekshirib ko'ring: beshda ko'paytma musbatmi, va uchda? Ikkalasida ham bir xil ishora chiqsa, to'rtda ishora almashmagan. | Проверь два числа: положительно ли произведение при пяти и при трёх? Если знак одинаков, значит в четырёх он не менялся. | Test two numbers: is the product positive at five, and at three? If the sign is the same, then it did not flip at four. |

