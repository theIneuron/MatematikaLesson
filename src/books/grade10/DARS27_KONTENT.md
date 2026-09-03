# Урок 37 — Теория вероятностей · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS37_SKELET.md`. Опора в учебнике: алгебра 2022, стр. 165–171, глава
`EHTIMOLLIKLAR NAZARIYASI`.

**Главное решение урока.** Вероятность считают **до** опыта, относительную частоту — **после**.
Это сказано в учебнике дословно (стр. 171), и на этом стоит прибор 7: дробь собирается из
карточек с самого начала, а столбик испытаний встаёт рядом и должен с ней совпасть. Когда
ученик считает неверно, они расходятся — программа при этом ничего не пишет.

**Пример экрана 5 взят из учебника дословно** — стр. 168: двенадцать шаров, пять красных,
четыре чёрных, три белых; событие — вынули красный или чёрный.

**Граничные случаи экрана 7 тоже книжные** — стр. 169, 1-misol и 2-misol.

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПЫТ | TAJRIBA | THE EXPERIMENT |
| `title` | Три исхода или четыре | Uch isxodmi yoki to'rt | Three outcomes or four |
| `row.a.name` | исходов три | isxod uchta | there are three outcomes |
| `row.b.name` | исходов четыре | isxod to'rtta | there are four outcomes |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас выложим исходы карточками. | Javobingiz yozib olindi. Endi isxodlarni kartochka qilib yotqizamiz. | Your answer is saved. Now we will lay the outcomes out as cards. |
| `audio.mount` | Бросаем две монеты и смотрим, что выпало. Вопрос про то, как часто стороны выходят разные. | Ikkita tanga tashlaymiz va nima tushganiga qaraymiz. Savol tomonlar qanchalik tez-tez har xil chiqishi haqida. | We toss two coins and look at what came up. The question is how often the sides come out different. |
| `audio.r1` | Первая запись считает так: два герба, два числа и разные. Исходов три, разные один из трёх, значит одна третья. | Birinchi yozuv shunday sanaydi: ikki gerb, ikki raqam va har xil. Isxod uchta, har xili uchdan bitta, demak bir uchdan. | The first counts like this: two heads, two tails, and different. Three outcomes, different is one of three, so one third. |
| `audio.r2` | Вторая говорит, что исходов четыре, и разные среди них два, значит одна вторая. | Ikkinchisi isxod to'rtta, har xili ular ichida ikkita, demak bir ikkidan deydi. | The second says there are four outcomes, and two of them are different, so one half. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `P(A) = ?` |
| `row.a.value` | `1/3` |
| `row.b.value` | `1/2` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед опытом | Tajribadan oldin uch savol | Three questions before the experiment |
| `q1.prompt` | Что называют исходом опыта? | Tajriba isxodi deb nima ataladi? | What is called an outcome of an experiment? |
| `q1.a` [верно] | каждый отдельный результат | har bir alohida natija | each separate result |
| `q1.b` | только удачный результат | faqat muvaffaqiyatli natija | only a successful result |
| `q1.b.hint` | Неудачный результат тоже исход, его тоже считают. | Muvaffaqiyatsiz natija ham isxod, u ham sanaladi. | An unsuccessful result is an outcome too, it is counted as well. |
| `q1.c` | сам опыт целиком | tajribaning o'zi butunligicha | the whole experiment itself |
| `q1.c.hint` | Опыт один, исходов у него несколько. | Tajriba bitta, isxodlari esa bir nechta. | There is one experiment and several outcomes. |
| `q1.d` | число, которое получилось | chiqqan son | the number that came out |
| `q1.d.hint` | Исход бывает и не числом: герб это тоже исход. | Isxod son bo'lmasligi ham mumkin: gerb ham isxod. | An outcome need not be a number: heads is an outcome too. |
| `q2.prompt` | Когда исходы называют равновозможными? | Isxodlar qachon teng imkoniyatli deyiladi? | When are outcomes called equally likely? |
| `q2.a` [верно] | когда нет причины считать один вероятнее другого | birini ikkinchisidan ehtimolliroq deyishga asos bo'lmaganda | when there is no reason to think one more likely than another |
| `q2.b` | когда их два | ular ikkita bo'lganda | when there are two of them |
| `q2.b.hint` | Два исхода бывают и неравновозможными: дождь и его отсутствие. | Ikki isxod teng imkoniyatsiz ham bo'ladi: yomg'ir va uning yo'qligi. | Two outcomes can be unequal: rain and no rain. |
| `q2.c` | когда их можно посчитать | ularni sanash mumkin bo'lganda | when they can be counted |
| `q2.c.hint` | Посчитать можно любые исходы, дело не в этом. | Har qanday isxodni sanash mumkin, gap bunda emas. | Any outcomes can be counted, that is not the point. |
| `q2.d` | всегда | doim | always |
| `q2.d.hint` | Если бы всегда, объявлять бы не пришлось. | Doim bo'lganda, e'lon qilish shart bo'lmasdi. | If it were always, there would be nothing to declare. |
| `q3.prompt` | Что показывает отношение двух количеств? | Ikki miqdor nisbati nimani ko'rsatadi? | What does a ratio of two counts show? |
| `q3.a` [верно] | какую часть одно составляет от другого | biri ikkinchisining qanday qismi ekanini | what part one makes of the other |
| `q3.b` | их сумму | ularning yig'indisini | their sum |
| `q3.b.hint` | Сумма получается сложением, а здесь деление. | Yig'indi qo'shishdan chiqadi, bu yerda esa bo'lish. | A sum comes from adding, and here there is division. |
| `q3.c` | какое из них больше | qaysi biri kattaligini | which of them is bigger |
| `q3.c.hint` | Это видно и без деления, отношение говорит больше. | Bu bo'lmasdan ham ko'rinadi, nisbat ko'proq narsa aytadi. | That is visible without dividing, a ratio says more. |
| `q3.d` | их разность | ularning ayirmasini | their difference |
| `q3.d.hint` | Разность это вычитание, а отношение это деление. | Ayirma bu ayirish, nisbat esa bo'lish. | A difference is subtraction, a ratio is division. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `E₁, E₂, E₃, …` |
| `q2.done` | `P(E₁) = P(E₂)` |
| `q3.done` | `m/n` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `or-ro-odin-isxod`

Карточки выкладываются поштучно. Прибор 7.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Выложим исходы карточками | Isxodlarni kartochka qilib yotqizamiz | Let us lay the outcomes out as cards |
| `show.1.1` | первая монета может лечь двумя способами | birinchi tanga ikki xil tusha oladi | the first coin can land in two ways |
| `show.1.2` | вторая тоже двумя | ikkinchisi ham ikki xil | the second one in two ways as well |
| `show.1.3` | значит карточек четыре | demak kartochka to'rtta | so there are four cards |
| `show.2.1` | герб и число это одна карточка | gerb va raqam bu bitta kartochka | heads then tails is one card |
| `show.2.2` | число и герб это другая | raqam va gerb bu boshqasi | tails then heads is another |
| `show.2.3` | они не одно и то же | ular bir xil narsa emas | they are not one and the same |
| `audio.mount` | Разложим все исходы по одному. Не словами, а карточками: так их можно пересчитать пальцем. | Barcha isxodlarni bittalab yoyamiz. So'z bilan emas, kartochka bilan: shunda ularni barmoq bilan sanash mumkin. | Let us lay out every outcome one by one. Not in words but as cards: that way they can be counted with a finger. |
| `audio.lay*` | Первая монета ложится двумя способами, вторая тоже двумя, и всего сочетаний выходит четыре. Вот они лежат: герб герб, герб число, число герб, число число. Обрати внимание на вторую и третью карточки. В обеих стороны разные, и легко сказать, что это один и тот же случай. Но монеты две, и они различимы: сначала выпал герб, потом число, или наоборот. Это два разных исхода, и лежат они отдельно. Отметь сам те карточки, где стороны разные. | Birinchi tanga ikki xil tushadi, ikkinchisi ham ikki xil, jami birikma to'rtta chiqadi. Mana ular yotibdi: gerb gerb, gerb raqam, raqam gerb, raqam raqam. Ikkinchi va uchinchi kartochkaga e'tibor bering. Ikkalasida ham tomonlar har xil, va buni bitta hol deyish oson. Lekin tanga ikkita, va ular ajratiladi: avval gerb, keyin raqam tushdi, yoki aksincha. Bu ikki xil isxod, va ular alohida yotadi. Tomonlar har xil bo'lgan kartochkalarni o'zingiz belgilang. | The first coin lands in two ways, the second one in two ways as well, and that gives four combinations in all. Here they lie: heads heads, heads tails, tails heads, tails tails. Look at the second and third cards. In both the sides are different, and it is easy to say that this is one and the same case. But there are two coins, and they can be told apart: heads came first and then tails, or the other way round. These are two different outcomes, and they lie separately. Mark the cards where the sides differ yourself. |
| `audio.work` | Отметь все карточки, где стороны разные. | Tomonlar har xil bo'lgan barcha kartochkalarni belgilang. | Mark every card where the sides are different. |
| `pick.prompt` | Отметь исходы, где стороны разные | Tomonlar har xil bo'lgan isxodlarni belgilang | Mark the outcomes where the sides differ |
| `pick.ok` | Две карточки из четырёх. Теперь проверим опытом: нажми и проведи испытания. | To'rtta kartochkadan ikkitasi. Endi tajriba bilan tekshiramiz: bosing va sinov o'tkazing. | Two cards out of four. Now let us check by experiment: press and run the trials. |
| `pick.bad` | Посмотри на каждую карточку отдельно: разные стороны это герб и число в любом порядке. | Har bir kartochkaga alohida qarang: har xil tomon bu istalgan tartibda gerb va raqam. | Look at each card separately: different sides means heads and tails in either order. |
| `card.hh` | ГГ | GG | HH |
| `card.ht` | ГЧ | GR | HT |
| `card.th` | ЧГ | RG | TH |
| `card.tt` | ЧЧ | RR | TT |

**Формулы**

| Ключ | Значение |
|---|---|
| `pick.answer` | `ht  th` |

---

## Экран 4 · `explain2` · ответ `order` · тег `chastota-vmesto-veroyatnosti`

Разграничение: вероятность и частота.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Считают до опыта, измеряют после | Tajribadan oldin hisoblanadi, keyin o'lchanadi | Computed before, measured after |
| `show.1.1` | десять испытаний дают разброс | o'nta sinov tarqoqlik beradi | ten trials give a spread |
| `show.1.2` | сегодня шесть, завтра четыре | bugun oltita, ertaga to'rtta | six today, four tomorrow |
| `show.1.3` | а дробь всё это время не менялась | kasr esa shu vaqt ichida o'zgargani yo'q | while the fraction did not change |
| `show.2.1` | двести испытаний ложатся около половины | ikki yuz sinov yarim atrofiga tushadi | two hundred trials land near a half |
| `show.2.2` | чем больше испытаний, тем ближе | sinov qancha ko'p bo'lsa, shuncha yaqin | the more trials, the closer |
| `show.2.3` | но совпадения в точности не обещано | lekin aniq mos kelish va'da qilinmagan | yet an exact match is never promised |
| `audio.mount` | Две серии испытаний подряд. Сначала короткая, потом длинная. | Ketma-ket ikki seriya sinov. Avval qisqasi, keyin uzuni. | Two series of trials in a row. First a short one, then a long one. |
| `audio.two*` | Десять бросков. Разные стороны выпали шесть раз, это ноль целых шесть десятых. Повторим ещё раз, и выйдет другое число, скажем четыре из десяти. Дробь при этом не шелохнулась: исходов по-прежнему четыре, благоприятных по-прежнему два. Теперь двести бросков. Столбик встаёт около половины и почти не гуляет. Вот в чём разница. Дробь это вероятность, её считают до всякого опыта, по карточкам. Столбик это относительная частота, её получают после опыта, счётом удач. Первое предсказывает, второе измеряет, и при длинной серии они сходятся. | O'nta tashlash. Har xil tomon olti marta tushdi, bu nol butun olti o'ndan. Yana takrorlaymiz, boshqa son chiqadi, aytaylik o'ndan to'rtta. Kasr esa qimirlagani yo'q: isxod avvalgidek to'rtta, qulaylik tug'diruvchisi avvalgidek ikkita. Endi ikki yuz tashlash. Ustun yarim atrofida turadi va deyarli tebranmaydi. Farq mana shunda. Kasr bu ehtimollik, u har qanday tajribadan oldin, kartochkalar bo'yicha hisoblanadi. Ustun bu nisbiy chastota, u tajribadan keyin, yutuqlarni sanash bilan olinadi. Birinchisi bashorat qiladi, ikkinchisi o'lchaydi, uzun seriyada esa ular yaqinlashadi. | Ten tosses. Different sides came up six times, that is zero point six. Repeat it and another number comes out, say four out of ten. The fraction did not stir: there are still four outcomes and still two favourable ones. Now two hundred tosses. The bar stands near a half and barely wanders. That is the difference. The fraction is the probability, computed before any experiment, from the cards. The bar is the relative frequency, obtained after the experiment by counting successes. The first predicts, the second measures, and over a long series they converge. |
| `audio.work` | Расставь шаги в том порядке, в котором это делают. | Buni qanday tartibda qilishsa, shu tartibda qadamlarni joylashtiring. | Put the steps in the order in which this is done. |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | выложить исходы | isxodlarni yotqizish | lay out the outcomes |
| `order.s2` | посчитать дробь | kasrni hisoblash | compute the fraction |
| `order.s3` | провести испытания | sinov o'tkazish | run the trials |
| `order.s4` | сравнить с дробью | kasr bilan solishtirish | compare with the fraction |
| `order.ok` | Верно. Дробь получают до опыта, иначе сравнивать будет не с чем. | To'g'ri. Kasr tajribadan oldin olinadi, aks holda solishtiradigan narsa qolmaydi. | Correct. The fraction comes before the experiment, otherwise there is nothing to compare with. |
| `order.bad` | Испытания идут после счёта, а не вместо него. | Sinovlar hisobdan keyin boradi, uning o'rniga emas. | The trials come after the counting, not instead of it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `2/4 = 0,5` |

---

## Экран 5 · `explain3` · ответ `lead` · тег `ravnovozmozhnost-po-privychke`

Пример учебника: урна с двенадцатью шарами.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Двенадцать шаров, девять благоприятных | O'n ikki shar, to'qqiztasi qulaylik tug'diradi | Twelve balls, nine favourable |
| `show.1.1` | в урне двенадцать шаров | idishda o'n ikki shar bor | there are twelve balls in the urn |
| `show.1.2` | пять красных, четыре чёрных, три белых | beshtasi qizil, to'rttasi qora, uchtasi oq | five red, four black, three white |
| `show.1.3` | каждый шар это отдельная карточка | har bir shar alohida kartochka | each ball is a separate card |
| `show.2.1` | шары одинаковы и перемешаны | sharlar bir xil va aralashtirilgan | the balls are alike and well mixed |
| `show.2.2` | значит исходы равновозможны | demak isxodlar teng imkoniyatli | so the outcomes are equally likely |
| `show.2.3` | и это объявляют, а не подразумевают | va buni nazarda tutishmaydi, e'lon qilishadi | and this is declared, not assumed |
| `audio.mount` | Задача из учебника. Из урны наугад берут один шар. | Darslikdagi masala. Idishdan tavakkaliga bitta shar olinadi. | A task from the textbook. One ball is taken from the urn at random. |
| `audio.urn*` | В урне двенадцать шаров: пять красных, четыре чёрных и три белых. Каждый шар лежит своей карточкой, и это важно: не три цвета, а двенадцать исходов. Прежде чем считать, надо кое-что объявить вслух. Шары одинаковы на ощупь, перемешаны и берут их наугад, значит ни один не имеет преимущества. Только теперь исходы равновозможны, и только теперь дробь имеет смысл. Если бы красные были крупнее остальных, все двенадцать карточек остались бы на месте, а вот считать так было бы уже нельзя. Отметь карточки, благоприятные для события: вынули красный или чёрный. | Idishda o'n ikki shar bor: beshtasi qizil, to'rttasi qora va uchtasi oq. Har bir shar o'z kartochkasi bilan yotibdi, va bu muhim: uch rang emas, o'n ikki isxod. Hisoblashdan oldin bir narsani ovoz chiqarib aytish kerak. Sharlar ushlaganda bir xil, aralashtirilgan va tavakkaliga olinadi, demak birortasining ustunligi yo'q. Faqat endi isxodlar teng imkoniyatli, va faqat endi kasr ma'noga ega. Agar qizillari qolganlaridan yirikroq bo'lganida, o'n ikkala kartochka joyida qolardi, lekin bunday hisoblab bo'lmasdi. Hodisaga qulaylik tug'diruvchi kartochkalarni belgilang: qizil yoki qora olindi. | The urn holds twelve balls: five red, four black and three white. Every ball lies as its own card, and that matters: not three colours but twelve outcomes. Before counting, something has to be said out loud. The balls feel the same, they are mixed and drawn at random, so none of them has an advantage. Only now are the outcomes equally likely, and only now does the fraction make sense. If the red ones were larger than the rest, all twelve cards would stay where they are, but counting this way would no longer be allowed. Mark the cards favourable to the event: a red or a black ball was drawn. |
| `audio.work` | Отметь все карточки, благоприятные для этого события. | Bu hodisaga qulaylik tug'diruvchi barcha kartochkalarni belgilang. | Mark every card favourable to this event. |
| `pick.prompt` | Отметь благоприятные исходы: красный или чёрный | Qulaylik tug'diruvchi isxodlarni belgilang: qizil yoki qora | Mark the favourable outcomes: red or black |
| `pick.ok` | Девять карточек из двенадцати. Дробь собралась сама. | O'n ikkitadan to'qqiztasi. Kasr o'zi yig'ildi. | Nine cards out of twelve. The fraction assembled itself. |
| `pick.bad` | Белые шары событию не благоприятны, а все остальные благоприятны. | Oq sharlar hodisaga qulaylik tug'dirmaydi, qolganlarining hammasi tug'diradi. | The white balls are not favourable to the event, all the others are. |
| `card.red` | к | q | r |
| `card.black` | ч | k | b |
| `card.white` | б | o | w |

**Формулы**

| Ключ | Значение |
|---|---|
| `pick.count` | `9/12` |

---

## Экран 6 · `explain4` · ответ `number` · тег `m-i-n-mestami`

Сам: числитель и знаменатель нельзя менять местами.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Что где стоит в дроби | Kasrda nima qayerda turadi | What stands where in the fraction |
| `show.1.1` | бросают игральный кубик | o'yin kubigi tashlanadi | a die is thrown |
| `show.1.2` | исходов шесть | isxod oltita | there are six outcomes |
| `show.1.3` | чётных среди них три | ular ichida juftlari uchta | three of them are even |
| `show.2.1` | сверху ставят благоприятные | yuqoriga qulaylik tug'diruvchilari qo'yiladi | the favourable ones go on top |
| `show.2.2` | снизу все исходы | pastga barcha isxodlar | all the outcomes go below |
| `show.2.3` | наоборот выйдет число больше единицы | teskarisida birdan katta son chiqadi | the other way round gives a number greater than one |
| `audio.mount` | Другой опыт. Бросают кубик и смотрят, выпало ли чётное число. | Boshqa tajriba. Kubik tashlanadi va juft son tushganmi, qaraladi. | A different experiment. A die is thrown and one looks at whether an even number came up. |
| `audio.place*` | Исходов здесь шесть: от одного до шести, и все они равновозможны. Благоприятных три: два, четыре и шесть. Дробь собирается так: сверху благоприятные, снизу все. Три из шести, то есть одна вторая. А теперь посмотри, что будет при перестановке. Шесть на три это два. Вероятность, равная двум, невозможна: благоприятных исходов не бывает больше, чем всех. Учебник записывает это отдельным свойством: вероятность лежит между нулём и единицей. Так что ответ больше единицы это не ошибка счёта, это знак, что дробь перевёрнута. | Bu yerda isxod oltita: birdan oltigacha, va ularning hammasi teng imkoniyatli. Qulaylik tug'diruvchisi uchta: ikki, to'rt va olti. Kasr shunday yig'iladi: yuqorida qulaylik tug'diruvchilari, pastda hammasi. Oltidan uchtasi, ya'ni bir ikkidan. Endi o'rin almashtirilsa nima bo'lishiga qarang. Oltini uchga bo'lsak ikki. Ikkiga teng ehtimollik bo'lishi mumkin emas: qulaylik tug'diruvchi isxodlar hammasidan ko'p bo'lmaydi. Darslik buni alohida xossa qilib yozadi: ehtimollik nol bilan bir orasida yotadi. Demak birdan katta javob hisob xatosi emas, bu kasr ag'darilganining belgisi. | There are six outcomes here: one to six, and all of them are equally likely. Three are favourable: two, four and six. The fraction is assembled like this: the favourable ones on top, all of them below. Three out of six, that is one half. Now look at what happens if they are swapped. Six over three is two. A probability equal to two is impossible: there are never more favourable outcomes than there are outcomes. The textbook writes this as a separate property: the probability lies between zero and one. So an answer greater than one is not an arithmetic slip, it is a sign that the fraction is upside down. |
| `audio.work` | Посчитай сам. Какое число стоит в знаменателе? | O'zingiz hisoblang. Maxrajda qaysi son turadi? | Work it out yourself. Which number stands in the denominator? |
| `work.prompt` | Что стоит в знаменателе? | Maxrajda nima turadi? | What stands in the denominator? |
| `work.ok` | Шесть. Внизу всегда все исходы, а благоприятные наверху. | Olti. Pastda doim barcha isxodlar, qulaylik tug'diruvchilari esa yuqorida. | Six. All the outcomes always go below, the favourable ones on top. |
| `work.hint.1` | Сколько всего граней у кубика? | Kubikning jami nechta yog'i bor? | How many faces does a die have in all? |
| `work.hint.2` | Внизу дроби стоит общее число исходов. | Kasrning pastida isxodlarning umumiy soni turadi. | The total number of outcomes stands at the bottom. |
| `work.hint.3` | Шесть. | Olti. | Six. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `3/6 = 1/2` |
| `frameB` | `6/3 = 2` |
| `work.expr` | `P(A) = m/n` |
| `work.answer` | `6` |

---

## Экран 7 · `explain5` · ответ `number` · тег `ravnovozmozhnost-po-privychke`

Граничные случаи из учебника: ноль и единица.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Когда благоприятных нет и когда все | Qulaylik tug'diruvchi yo'q va hammasi bo'lgan hol | When none are favourable and when all are |
| `show.1.1` | в коробке десять шаров | qutida o'n shar bor | there are ten balls in the box |
| `show.1.2` | четыре белых, остальные чёрные | to'rttasi oq, qolganlari qora | four white, the rest black |
| `show.1.3` | красного шара нет вовсе | qizil shar umuman yo'q | there is no red ball at all |
| `show.2.1` | ни одна карточка не подсвечена | birorta kartochka yoritilmagan | not a single card is lit |
| `show.2.2` | сверху ноль, снизу десять | yuqorida nol, pastda o'n | zero on top, ten below |
| `show.2.3` | вероятность равна нулю | ehtimollik nolga teng | the probability equals zero |
| `audio.mount` | Два коротких случая из учебника. Оба считаются на тех же карточках. | Darslikdagi ikki qisqa hol. Ikkalasi ham o'sha kartochkalarda hisoblanadi. | Two short cases from the textbook. Both are computed on the same cards. |
| `audio.edge*` | В коробке десять шаров: четыре белых, остальные чёрные. Спрашивают вероятность вынуть красный. Выкладываем десять карточек и ищем благоприятные. Их нет ни одной: красного шара в коробке не было. Сверху ноль, снизу десять, вероятность равна нулю. Такое событие называют невозможным. Теперь наоборот. Двадцать шаров пронумерованы от одного до двадцати, спрашивают вероятность вынуть шар с номером не больше двадцати. Благоприятны все двадцать, двадцать делить на двадцать это единица. Такое событие называют достоверным. Отсюда и границы: меньше нуля и больше единицы вероятность не бывает никогда. | Qutida o'n shar bor: to'rttasi oq, qolganlari qora. Qizil olish ehtimolligi so'ralyapti. O'nta kartochkani yotqizamiz va qulaylik tug'diruvchilarini izlaymiz. Ular bitta ham yo'q: qutida qizil shar bo'lmagan. Yuqorida nol, pastda o'n, ehtimollik nolga teng. Bunday hodisani mumkin bo'lmagan deyishadi. Endi aksincha. Yigirma shar birdan yigirmagacha raqamlangan, tartib raqami yigirmadan katta bo'lmagan shar olish ehtimolligi so'ralyapti. Yigirmatasi ham qulaylik tug'diradi, yigirmani yigirmaga bo'lsak bir. Bunday hodisani muqarrar deyishadi. Chegaralar shundan: ehtimollik noldan kichik va birdan katta hech qachon bo'lmaydi. | The box holds ten balls: four white, the rest black. The probability of drawing a red one is asked. We lay out ten cards and look for favourable ones. There is not a single one: there was no red ball in the box. Zero on top, ten below, the probability equals zero. Such an event is called impossible. Now the other way round. Twenty balls are numbered from one to twenty, and the probability of drawing a ball numbered no more than twenty is asked. All twenty are favourable, twenty divided by twenty is one. Such an event is called certain. Hence the bounds: a probability is never less than zero and never greater than one. |
| `audio.work` | Посчитай сам. Чему равна вероятность вынуть красный шар? | O'zingiz hisoblang. Qizil shar olish ehtimolligi nechaga teng? | Work it out yourself. What is the probability of drawing a red ball? |
| `work.prompt` | Чему равна вероятность? | Ehtimollik nechaga teng? | What does the probability equal? |
| `work.ok` | Нулю. Благоприятных исходов нет ни одного. | Nolga. Qulaylik tug'diruvchi isxod bitta ham yo'q. | Zero. There is not a single favourable outcome. |
| `work.hint.1` | Посчитай, сколько красных шаров в коробке. | Qutida nechta qizil shar borligini sanang. | Count how many red balls are in the box. |
| `work.hint.2` | Ноль, делённый на десять, это ноль. | Nolni o'nga bo'lsak nol. | Zero divided by ten is zero. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `0/10 = 0` |
| `frameB` | `20/20 = 1` |
| `work.expr` | `0 ≤ P(A) ≤ 1` |
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `chastota-vmesto-veroyatnosti`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Вероятность и частота | Ehtimollik va chastota | Probability and frequency |
| `probe.question` | Чем вероятность отличается от частоты? | Ehtimollik chastotadan nimasi bilan farq qiladi? | How does a probability differ from a frequency? |
| `probe.a` [верно] | вероятность считают до опыта, частоту после | ehtimollik tajribadan oldin, chastota keyin hisoblanadi | a probability is computed before the experiment, a frequency after |
| `probe.b` | это одно и то же, только называется по-разному | bu bir xil narsa, faqat har xil ataladi | they are the same thing under different names |
| `probe.b.hint` | Тогда десять бросков давали бы каждый раз одно и то же число. | U holda o'nta tashlash har safar bir xil son berardi. | Then ten tosses would give the same number every time. |
| `rule.lawLabel` | КАК СЧИТАЮТ | QANDAY HISOBLANADI | HOW IT IS COUNTED |
| `rule.lines.1` | выложить все исходы поштучно и объявить их равновозможными | barcha isxodlarni bittalab yotqizib, teng imkoniyatli deb e'lon qilish | lay out every outcome one by one and declare them equally likely |
| `rule.lines.2` | сверху благоприятные, снизу все | yuqorida qulaylik tug'diruvchilari, pastda hammasi | the favourable ones on top, all of them below |
| `rule.lines.3` | ответ лежит между нулём и единицей | javob nol bilan bir orasida yotadi | the answer lies between zero and one |
| `audio.mount` | Соберём правило. Оно короткое, потому что счёт весь на карточках. | Qoidani yig'amiz. U qisqa, chunki hisobning hammasi kartochkalarda. | Let us put the rule together. It is short, because all the counting is on the cards. |
| `audio.rule*` | Первое: выложить все исходы поштучно и объявить их равновозможными. Это отдельный шаг, и его нельзя пропустить: если исходы неравновозможны, дальше считать нельзя вовсе. Второе: отметить благоприятные и поставить их сверху, а общее число исходов снизу. Отношение и есть вероятность события. Третье: проверить границы. Ноль означает, что событие невозможно, единица означает, что оно наступит наверняка, а всё остальное лежит между ними. И держи в голове разницу: это число получено до опыта. Опыт может дать другое, особенно если испытаний мало. | Birinchi: barcha isxodlarni bittalab yotqizish va ularni teng imkoniyatli deb e'lon qilish. Bu alohida qadam, uni o'tkazib bo'lmaydi: agar isxodlar teng imkoniyatli bo'lmasa, keyin umuman hisoblab bo'lmaydi. Ikkinchi: qulaylik tug'diruvchilarini belgilab, ularni yuqoriga, isxodlarning umumiy sonini pastga qo'yish. Nisbat hodisaning ehtimolligi bo'ladi. Uchinchi: chegaralarni tekshirish. Nol hodisa mumkin emasligini, bir esa u albatta ro'y berishini bildiradi, qolgani ular orasida yotadi. Farqni ham eslang: bu son tajribadan oldin olingan. Tajriba boshqa natija berishi mumkin, ayniqsa sinov kam bo'lsa. | First: lay out every outcome one by one and declare them equally likely. That is a separate step and it cannot be skipped: if the outcomes are not equally likely, no further counting is allowed at all. Second: mark the favourable ones and put them on top, with the total number of outcomes below. The ratio is the probability of the event. Third: check the bounds. Zero means the event is impossible, one means it is certain, and everything else lies between. And keep the difference in mind: this number was obtained before the experiment. The experiment may give another, especially when there are few trials. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `P(A) = m/n,   0 ≤ P(A) ≤ 1` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `m-i-n-mestami`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини счёт с вероятностью | Hisobni ehtimollik bilan ulang | Match each count with its probability |
| `match.prompt` | Слева благоприятные и все исходы | Chapda qulaylik tug'diruvchilari va barcha isxodlar | On the left the favourable and the total outcomes |
| `match.ok` | Верно. Ни одна вероятность не вышла больше единицы, и это проверка. | To'g'ri. Birorta ehtimollik birdan katta chiqmadi, va bu tekshiruv. | Correct. No probability came out greater than one, and that is a check. |
| `audio.mount` | Четыре пары чисел и четыре вероятности. Считай в уме. | To'rt juft son va to'rt ehtimollik. Xayolda hisoblang. | Four pairs of numbers and four probabilities. Compute in your head. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `m = 3, n = 6` · `m = 0, n = 10` · `m = 20, n = 20` · `m = 9, n = 12` |
| `match.a` | `1/2` |
| `match.b` | `0` |
| `match.c` | `1` |
| `match.d` | `3/4` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `or-ro-odin-isxod`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Посчитай вероятность целиком | Ehtimollikni to'liq hisoblang | Compute the probability from start to finish |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | выложить исходы | isxodlarni yotqizish | lay out the outcomes |
| `order.s2` | объявить равновозможными | teng imkoniyatli deb e'lon qilish | declare them equally likely |
| `order.s3` | отметить благоприятные | qulaylik tug'diruvchilarini belgilash | mark the favourable ones |
| `order.s4` | записать отношение | nisbatni yozish | write the ratio |
| `order.ok` | Верно. Равновозможность объявляют до счёта, а не после. | To'g'ri. Teng imkoniyatlilik hisobdan oldin e'lon qilinadi, keyin emas. | Correct. Equal likelihood is declared before the counting, not after. |
| `order.bad` | Отмечать благоприятные можно только после того, как исходы выложены. | Qulaylik tug'diruvchilarini faqat isxodlar yotqizilgandan keyin belgilash mumkin. | The favourable ones can be marked only after the outcomes are laid out. |
| `audio.mount` | Теперь весь счёт целиком. Четыре шага, порядок важен. | Endi butun hisob. To'rt qadam, tartib muhim. | Now the whole count. Four steps, and the order matters. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `P(A) = m/n` |
| `order.mark` | `2/4 = 1/2` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Сколько шаров не синие | Nechta shar ko'k emas | How many balls are not blue |
| `task.ok` | Девять. Пятнадцать всего, шесть синих, остальные другие. | To'qqiz. Jami o'n besh, oltitasi ko'k, qolganlari boshqa. | Nine. Fifteen in all, six of them blue, the rest are other. |
| `task.hint.1` | Вычти синие из общего числа. | Ko'klarni umumiy sondan ayiring. | Subtract the blue ones from the total. |
| `task.hint.2` | Пятнадцать минус шесть. | O'n besh minus olti. | Fifteen minus six. |
| `task.hint.3` | Девять. | To'qqiz. | Nine. |
| `order.prompt` | Расставь события по возрастанию вероятности | Hodisalarni ehtimolligi o'sishi bo'yicha joylashtiring | Put the events in order of increasing probability |
| `order.title` | от менее вероятного к более | kam ehtimollidan ko'proq ehtimolliga | from less likely to more likely |
| `order.ok` | Верно. Большое число сверху ещё не значит большую вероятность. | To'g'ri. Yuqoridagi katta son katta ehtimollik degani emas. | Correct. A big number on top does not yet mean a big probability. |
| `order.bad` | Сравнивай отношения, а не числители. | Suratlarni emas, nisbatlarni solishtiring. | Compare the ratios, not the numerators. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `n = 15,   m = 6` |
| `task.answer` | `9` |
| `order.items` | `m = 1, n = 4` · `m = 3, n = 4` · `m = 0, n = 5` · `m = 1, n = 2` |
| `order.answer` | `m = 0, n = 5  m = 1, n = 4  m = 1, n = 2  m = 3, n = 4` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Числа посчитаны верно: шаров двенадцать, благоприятных девять. | Sonlar to'g'ri sanalgan: shar o'n ikkita, qulaylik tug'diruvchisi to'qqizta. | The counts are right: twelve balls, nine favourable. |
| `hint.r2` | Посмотри, что оказалось сверху, а что снизу. | Yuqoriga nima, pastga nima tushganiga qarang. | Look at what ended up on top and what below. |
| `hint.r3` | Из предыдущей строки это следует верно, но сама она уже неверна. | Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri. | This follows correctly from the previous line, but that line is already wrong. |
| `proof` | Вероятность не бывает больше единицы, а здесь вышло больше. | Ehtimollik birdan katta bo'lmaydi, bu yerda esa kattaroq chiqdi. | A probability is never greater than one, and here it came out greater. |
| `entry.prompt` | Какое число должно стоять в числителе? | Suratda qaysi son turishi kerak? | Which number should stand in the numerator? |
| `entry.ok` | Девять. Сверху всегда благоприятные, и тогда выходит три четверти. | To'qqiz. Yuqorida doim qulaylik tug'diruvchilari, va shunda uch to'rtdan chiqadi. | Nine. The favourable ones always go on top, and then it comes out three quarters. |
| `entry.hint.1` | Сверху стоит то, чего меньше или столько же. | Yuqorida kamroq yoki shuncha bo'lgan narsa turadi. | On top stands what is fewer or equal in number. |
| `entry.hint.2` | Благоприятных было девять. | Qulaylik tug'diruvchisi to'qqizta edi. | There were nine favourable ones. |
| `entry.hint.3` | Девять. | To'qqiz. | Nine. |
| `audio.mount` | Четыре строки. Числа верные, а ответ невозможный. Найди, где это случилось. | To'rt qator. Sonlar to'g'ri, javob esa mumkin emas. Bu qayerda sodir bo'lganini toping. | Four lines. The counts are right and the answer is impossible. Find where that happened. |
| `audio.next` | Дальше обратная задача: по вероятности восстанови число благоприятных. | Keyin teskari masala: ehtimollikka qarab qulaylik tug'diruvchilar sonini tiklang. | Next comes the reverse task: rebuild the number of favourable outcomes from the probability. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `n = 12,   m = 9` |
| `row.r2` | `P(A) = n/m` |
| `row.r3` | `P(A) = 12/9` |
| `row.r4` | `P(A) ≈ 1,33` |
| `answerId` | `r2` |
| `entry.answer` | `9` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Всего исходов двенадцать, вероятность равна одной четвёртой. Сколько благоприятных? | Jami isxod o'n ikkita, ehtimollik bir to'rtdanga teng. Nechtasi qulaylik tug'diradi? | There are twelve outcomes in all and the probability is one quarter. How many are favourable? |
| `entry.ok` | Три. Одна четвёртая от двенадцати это три. | Uch. O'n ikkining bir to'rtdani uch. | Three. One quarter of twelve is three. |
| `entry.hint.1` | Дробь равна одной четвёртой, а знаменатель двенадцать. | Kasr bir to'rtdanga teng, maxraj esa o'n ikki. | The fraction equals one quarter and the denominator is twelve. |
| `entry.hint.2` | Двенадцать разделить на четыре. | O'n ikkini to'rtga bo'ling. | Twelve divided by four. |
| `entry.hint.3` | Три. | Uch. | Three. |
| `multi.prompt` | Отметь все невозможные события | Barcha mumkin bo'lmagan hodisalarni belgilang | Mark every impossible event |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Такое случается редко, но случается: событие случайное. | Bu kamdan-kam bo'ladi, lekin bo'ladi: hodisa tasodifiy. | That happens rarely but it happens: the event is random. |
| `multi.d.hint` | Это событие наступает всегда, оно достоверное, а не невозможное. | Bu hodisa doim ro'y beradi, u muqarrar, mumkin bo'lmagan emas. | This event always occurs, it is certain, not impossible. |
| `multi.ok` | Верно. Невозможному событию отвечает ноль благоприятных исходов. | To'g'ri. Mumkin bo'lmagan hodisaga nolta qulaylik tug'diruvchi isxod mos keladi. | Correct. An impossible event has zero favourable outcomes. |
| `audio.mount` | Теперь наоборот. По вероятности назови число благоприятных исходов. | Endi teskarisiga. Ehtimollikka qarab qulaylik tug'diruvchilar sonini ayting. | Now the other way round. From the probability, name the number of favourable outcomes. |
| `audio.work` | Потом отметь все события, которые не могут произойти. | Keyin ro'y bera olmaydigan barcha hodisalarni belgilang. | Then mark every event that cannot happen. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `P(A) = 1/4,   n = 12` |
| `entry.answer` | `3` |
| `multi.a` [верно] | `7` |
| `multi.b` [верно] | `0` |
| `multi.c` | `6` |
| `multi.d` | `1` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `chastota-vmesto-veroyatnosti`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Сколько исходов у броска двух монет? | Ikki tanga tashlashda nechta isxod bor? | How many outcomes does tossing two coins have? |
| `q1.a` [верно] | четыре | to'rt | four |
| `q1.b` | три | uch | three |
| `q1.b.hint` | Три выходит, если склеить герб с числом и число с гербом. | Uch gerb bilan raqamni va raqam bilan gerbni yopishtirganda chiqadi. | Three comes from gluing heads-tails and tails-heads together. |
| `q1.c` | два | ikki | two |
| `q1.c.hint` | Два исхода у одной монеты, а их две. | Ikki isxod bitta tangada, ular esa ikkita. | Two outcomes belong to one coin, and there are two coins. |
| `q1.d` | шесть | olti | six |
| `q1.d.hint` | Шесть это у кубика. | Olti kubikda bo'ladi. | Six belongs to a die. |
| `q2.prompt` | Из десяти бросков семь удачных. Чему равна вероятность? | O'nta tashlashning yettitasi muvaffaqiyatli. Ehtimollik nechaga teng? | Seven of ten tosses were successful. What is the probability? |
| `q2.a` [верно] | из этого её узнать нельзя | bundan uni bilib bo'lmaydi | it cannot be found from this |
| `q2.b` | ноль целых семь десятых | nol butun yetti o'ndan | zero point seven |
| `q2.b.hint` | Это относительная частота короткой серии, а не вероятность. | Bu qisqa seriyaning nisbiy chastotasi, ehtimollik emas. | That is the relative frequency of a short series, not the probability. |
| `q2.c` | одна вторая | bir ikkidan | one half |
| `q2.c.hint` | Одна вторая была бы, если исходы равновозможны, а про них ничего не сказано. | Bir ikkidan isxodlar teng imkoniyatli bo'lganda bo'lardi, ular haqida esa hech nima aytilmagan. | One half would hold if the outcomes were equally likely, and nothing was said about them. |
| `q2.d` | семь | yetti | seven |
| `q2.d.hint` | Вероятность больше единицы не бывает. | Ehtimollik birdan katta bo'lmaydi. | A probability is never greater than one. |
| `q3.prompt` | Чему равна вероятность достоверного события? | Muqarrar hodisaning ehtimolligi nechaga teng? | What is the probability of a certain event? |
| `q3.a` [верно] | единице | birga | one |
| `q3.a.ok` | Единице. Благоприятны все исходы без исключения. | Birga. Istisnosiz barcha isxodlar qulaylik tug'diradi. | One. Every single outcome is favourable. |
| `q3.b` | нулю | nolga | zero |
| `q3.b.hint` | Ноль у невозможного события, а не у достоверного. | Nol mumkin bo'lmagan hodisada, muqarrarda emas. | Zero belongs to an impossible event, not to a certain one. |
| `q3.c` | одной второй | bir ikkidanga | one half |
| `q3.c.hint` | Одна вторая это когда благоприятна половина исходов. | Bir ikkidan isxodlarning yarmi qulaylik tug'dirganda bo'ladi. | One half is when half the outcomes are favourable. |
| `q3.d` | зависит от числа исходов | isxodlar soniga bog'liq | it depends on the number of outcomes |
| `q3.d.hint` | Сколько бы их ни было, благоприятны все, и отношение равно единице. | Ular qancha bo'lmasin, hammasi qulaylik tug'diradi, nisbat esa birga teng. | However many there are, all are favourable, and the ratio equals one. |
| `q4.prompt` | Когда вероятность и частота сходятся? | Ehtimollik va chastota qachon yaqinlashadi? | When do a probability and a frequency converge? |
| `q4.a` [верно] | при большом числе испытаний | sinov soni katta bo'lganda | when the number of trials is large |
| `q4.b` | всегда | doim | always |
| `q4.b.hint` | При десяти бросках они расходятся заметно. | O'nta tashlashda ular sezilarli farq qiladi. | With ten tosses they differ noticeably. |
| `q4.c` | никогда | hech qachon | never |
| `q4.c.hint` | Двести испытаний легли около половины, значит сходятся. | Ikki yuz sinov yarim atrofiga tushdi, demak yaqinlashadi. | Two hundred trials landed near a half, so they do converge. |
| `q4.d` | когда исходов два | isxod ikkita bo'lganda | when there are two outcomes |
| `q4.d.hint` | Число исходов тут ни при чём, дело в числе испытаний. | Isxodlar sonining bunga aloqasi yo'q, gap sinovlar sonida. | The number of outcomes is not involved, it is the number of trials that matters. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `4` |
| `q2.done` | `W(A) = 7/10` |
| `q3.done` | `P(Ω) = 1` |
| `q4.done` | `n → ∞` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Выкладываю все исходы поштучно | Barcha isxodlarni bittalab yotqizaman | I lay out every outcome one by one |
| `can.2` | Объявляю их равновозможными отдельным шагом | Ularni alohida qadam bilan teng imkoniyatli deb e'lon qilaman | I declare them equally likely as a separate step |
| `can.3` | Ставлю благоприятные сверху, все снизу | Qulaylik tug'diruvchilarini yuqoriga, hammasini pastga qo'yaman | I put the favourable ones on top and all of them below |
| `can.4` | Отличаю вероятность от частоты | Ehtimollikni chastotadan ajrataman | I tell a probability from a frequency |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: равновозможность. | Bir joy takrorlashni talab qiladi: teng imkoniyatlilik. | One spot needs a second look: equal likelihood. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va beshinchi ekranga qayting. | Go back to the rule and to screen five. |
| `bridge` | Блок закрыт. Дальше практикум повторения: степень, логарифм, неравенства и вероятность вместе. | Blok yopildi. Keyin takrorlash amaliyoti: daraja, logarifm, tengsizliklar va ehtimollik birga. | The block is closed. Next comes the review practicum: powers, logarithms, inequalities and probability together. |
| `lifehack` | Не знаешь, с чего начать, выложи исходы по одному. Дальше задача считается сама. | Nimadan boshlashni bilmasangiz, isxodlarni bittalab yotqizing. Keyin masala o'zi hisoblanadi. | If you do not know where to start, lay the outcomes out one by one. After that the task counts itself. |
| `sheetTitle` | Вероятность · шпаргалка | Ehtimollik · shpargalka | Probability · cheat sheet |
| `sheetSrc` | 10 класс · урок 37 | 10-sinf · 37-dars | Grade 10 · lesson 37 |
| `audio.mount` | Прогноз был про три исхода и четыре. Посмотрим, что вышло. | Taxmin uch va to'rt isxod haqida edi. Nima chiqqanini ko'ramiz. | The guess was about three outcomes and four. Let us see how it turned out. |
| `audio.next` | Исходов четыре, и опыт это подтвердил. Герб с числом и число с гербом это разные исходы. | Isxod to'rtta, tajriba buni tasdiqladi. Gerb bilan raqam va raqam bilan gerb har xil isxod. | There are four outcomes, and the experiment confirmed it. Heads then tails and tails then heads are different outcomes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `1/3` |
| `hook.b` | `1/2` |
| `proved` | `1/2` |
| `law` | `P(A) = m/n` |
| `sheet.1` | `0 ≤ P(A) ≤ 1` |
| `sheet.2` | `P(Ω) = 1` |
| `sheet.3` | `P(∅) = 0` |
| `sheet.4` | `W(A) = M/N` |
| `sheet.5` | `2/4 = 0,5` |
