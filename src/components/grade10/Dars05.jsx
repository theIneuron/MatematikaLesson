// ============================================================================
// 10-sinf, Dars 5. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS05_KONTENT.md
// DARSNING IKKI GUVOHI. Birinchisi KO'ZGU: nuqta gorizontal o'q bo'ylab aks
// etadi, siljish QIMIRLAMAYDI, balandlik esa ishorasini almashtiradi -- shundan
// ikkala qoida bitta harakatdan chiqadi. Ikkinchisi QAYTISH: to'liq aylanadan
// keyin nuqta o'sha halqaga tushadi, ya'ni o'xshash nuqtaga emas, AYNAN
// o'sha nuqtaga.
//
// Bu darsda MANFIY BURISH sinfda birinchi marta kiritiladi. «Chorak» 4-darsda
// kiritilgan, «funksiya» 6-darsda bo'ladi, kotangens blokda umuman yo'q.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import { MirrorAxis, SameSpot } from './figures.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import {
  AuditRows,
  BuildPoint,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  PlaceAngle,
  ProbeChain,
  Readout,
  Scene,
  TableFill,
  UnitCircle,
} from './tools.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 5
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Juftlik va davr`,
  `Урок ${LESSON_NO}. Чётность/период`,
  `Lesson ${LESSON_NO}. Parity and period`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 5 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('JUFTLIK', 'ЧЁТНОСТЬ', 'PARITY'),
  title: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
  motion: ['mount'],
  audio: [
    A('mount', "Nuqta pastga, o'q ostiga suriladi. Bunday burish manfiy deyiladi.", 'Точка едет вниз, под ось. Такой поворот называют отрицательным.', 'The point moves down, below the axis. Such a turn is called negative.'),
    A('r1', 'Birinchi yozuv ishora saqlandi deydi.', 'Первая запись говорит, что знак сохранился.', 'The first reading says the sign stayed.'),
    A('r2', 'Ikkinchisi esa almashdi deydi.', 'Вторая говорит, что он сменился.', 'The second says it flipped.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi uni ko'zgu bilan tekshiramiz.", 'Твой ответ записан. Сейчас проверим его зеркалом.', 'Your answer is saved. Now the mirror will check it.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ishora saqlandi', 'знак сохранился', 'the sign stayed'),
      value: 'sin(−30°) = 1/2',
    },
    b: {
      name: L('ishora almashdi', 'знак сменился', 'the sign flipped'),
      value: 'sin(−30°) = −1/2',
    },
  },
  expr: 'sin(−30°) = ?',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("Ko'zgu oldidan uch savol", 'Три вопроса перед зеркалом', 'Three questions before the mirror'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Bugun uchalasi ham kerak bo'ladi.", 'Три коротких вопроса. Сегодня понадобятся все три.', 'Three short questions. All three will be needed today.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Musbat burish qayoqqa boradi?', 'Куда идёт положительный поворот?', 'Which way does a positive turn go?'),
      done: '+',
      items: [
        { id: 'a', label: L('soat miliga qarshi', 'против часовой', 'counterclockwise'), correct: true },
        { id: 'b', label: L("soat mili bo'ylab", 'по часовой', 'clockwise'), hint: L("Soat mili bo'ylab manfiy burish boradi, u bugun paydo bo'ladi.", 'По часовой пойдёт отрицательный поворот, и он появится сегодня.', 'Clockwise is the negative turn, and it appears today.') },
        { id: 'c', label: L('tepadan pastga', 'сверху вниз', 'from top to bottom'), hint: L("Sanoq aylana bo'ylab boradi, tepadan pastga emas.", 'Счёт идёт по кругу, а не сверху вниз.', 'The count goes round the circle, not top to bottom.') },
        { id: 'd', label: L('qulay tomondan', 'как удобно', 'whichever way suits'), hint: L("Yo'nalish kelishuv bilan berilgan, aks holda bitta burchak ikki nuqta berardi.", 'Направление задано договором, иначе один угол дал бы две точки.', 'The direction is fixed by agreement, otherwise one angle would give two points.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("O'ttiz gradusning sinusi qancha?", 'Чему равен синус тридцати градусов?', 'What is the sine of thirty degrees?'),
      done: 'sin 30° = 1/2',
      items: [
        { id: 'a', label: L('bir ikkidan', 'одна вторая', 'one half'), correct: true },
        { id: 'b', label: L('uch ildizining yarmi', 'корень из трёх на два', 'root three over two'), hint: L("Bu oltmish gradusning balandligi, o'ttizniki emas.", 'Это высота шестидесяти градусов, а не тридцати.', 'That is the height at sixty degrees, not thirty.') },
        { id: 'c', label: L('ikki ildizining yarmi', 'корень из двух на два', 'root two over two'), hint: L('Bu qirq besh gradus, u yerda ikki son teng.', 'Это сорок пять градусов, там оба числа равны.', 'That is forty five degrees, where both numbers are equal.') },
        { id: 'd', label: L('bir', 'единица', 'one'), hint: L("Bir faqat eng tepada, to'qson gradusda bo'ladi.", 'Единица бывает только на самом верху, на девяноста градусах.', 'One happens only at the very top, at ninety degrees.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("To'liq aylanada necha gradus bor?", 'Сколько градусов в полном обороте?', 'How many degrees are in a full turn?'),
      done: '360°',
      items: [
        { id: 'a', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), correct: true },
        { id: 'b', label: L('yuz sakson', 'сто восемьдесят', 'one hundred eighty'), hint: L('Yuz sakson bu yarim aylana.', 'Сто восемьдесят это половина оборота.', 'One hundred eighty is half a turn.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qson bu chorak aylana.", 'Девяносто это четверть оборота.', 'Ninety is a quarter turn.') },
        { id: 'd', label: L('ikki yuz yetmish', 'двести семьдесят', 'two hundred seventy'), hint: L("Bu uch chorak, to'liq aylanaga yana bittasi yetmaydi.", 'Это три четверти, до полного оборота не хватает ещё одной.', 'That is three quarters, one more is missing for a full turn.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Sanoq ikki tomonga boradi', 'Счёт идёт в обе стороны', 'The count goes both ways'),
  tag: 'sinus-chetnyy',
  show: [
    [
      L('plyus oltmish: yuqoriga', 'плюс шестьдесят: вверх', 'plus sixty: upward'),
      L('bu odatdagi burish', 'это привычный поворот', 'this is the usual turn'),
    ],
    [
      L('minus oltmish: pastga', 'минус шестьдесят: вниз', 'minus sixty: downward'),
      L("o'sha burchak, boshqa tomon", 'тот же угол, другая сторона', 'the same angle, the other way'),
    ],
  ],
  motion: ['down'],
  audio: [
    A('mount', 'Nuqta oltmish gradusda. Sanoq soat miliga qarshi ketdi, bu musbat burish.', 'Точка на шестидесяти градусах. Счёт шёл против часовой, и это положительный поворот.', 'The point is at sixty degrees. The count went counterclockwise, and that is a positive turn.'),
    A('down', "Endi esa nuqta boshqa tomonga, soat mili bo'ylab suriladi. Bunday burish minus ishorasi bilan yoziladi. Burchak o'sha, tomon boshqa.", 'А теперь точка едет в другую сторону, по часовой. Такой поворот записывают со знаком минус. Угол тот же, сторона другая.', 'Now the point moves the other way, clockwise. Such a turn is written with a minus sign. The same angle, the other way.'),
    A('work', "Endi o'zingiz. Nuqtani minus oltmish gradusga qo'ying.", 'Теперь сам. Поставь точку на минус шестьдесят градусов.', 'Now you. Place the point at minus sixty degrees.'),
  ],
  work: {
    prompt: L("Nuqtani minus oltmish gradusga qo'ying.", 'Поставь точку на минус шестьдесят градусов.', 'Place the point at minus sixty degrees.'),
    ok: L("Bu o'sha burchak, lekin soat mili bo'ylab qo'yilgan. Balandlik pastga tushdi, siljish esa o'sha bo'lib qoldi.", 'Это тот же угол, но отложенный по часовой. Высота ушла вниз, а сдвиг остался прежним.', 'The same angle, laid clockwise. The height went down, the shift stayed as it was.'),
    hint: [
      L("Minus soat mili bo'ylab degani, ya'ni o'ng nuqtadan pastga.", 'Минус означает по часовой, то есть вниз от правой точки.', 'Minus means clockwise, that is downward from the right point.'),
      L("Bu juda uzoq. Yuqoriga qancha bo'lsa, shuncha kerak.", 'Это слишком далеко. Нужно ровно столько же, сколько было вверх.', 'That is too far. You need exactly as much as it was upward.'),
      L("Yuqoriga qo'yilgan burchakning o'zini pastga qo'ying.", 'Отложи вниз такой же угол, как был отложен вверх.', 'Lay downward the same angle that was laid upward.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Siljish qoldi, balandlik ag'darildi", 'Сдвиг остался, высота перевернулась', 'The shift stayed, the height flipped'),
  tag: 'sinus-chetnyy',
  show: [
    [
      L("nuqta o'qdan yuqorida", 'точка выше оси', 'the point is above the axis'),
      L('ikki son ham musbat', 'оба числа положительны', 'both numbers are positive'),
    ],
    [
      L("gorizontal o'q bo'ylab ko'zgu", 'зеркало по горизонтальной оси', 'a mirror along the horizontal axis'),
      L('siljish qimirlamadi', 'сдвиг не двинулся', 'the shift did not move'),
    ],
    [
      L("balandlik qarama-qarshi bo'ldi", 'высота стала противоположной', 'the height became the opposite'),
      'cos(−α) = cos α,   sin(−α) = −sin α',
    ],
  ],
  motion: ['mirror', 'both'],
  audio: [
    A('mount', 'Nuqta oltmish gradusda, ikki son ham musbat.', 'Точка на шестидесяти градусах, оба числа положительны.', 'The point is at sixty degrees, both numbers are positive.'),
    A('mirror', 'Gorizontal kesmaga diqqat bilan qarang. Nuqta pastga aks etadi, u esa umuman qimirlamaydi.', 'Смотри внимательно на горизонтальный отрезок. Точка отражается вниз, а он не двигается совсем.', 'Watch the horizontal segment closely. The point reflects downward, and it does not move at all.'),
    A('both', 'Endi ikki nuqta yonma-yon. Siljishi umumiy, balandliklari esa qarama-qarshi. Shundan ikkita qoida chiqadi, va ularni alohida yodlash shart emas.', 'Теперь обе точки рядом. Сдвиг у них общий, а высоты противоположны. Отсюда сразу два правила, и запоминать их по отдельности не нужно.', 'Now both points side by side. They share the shift, their heights are opposite. Two rules come from this at once, and you need not memorise them separately.'),
    A('work', "Endi o'zingiz. Siljishi o'ttiz gradusdagidek, balandligi esa pastga ketgan nuqtani qo'ying.", 'Теперь сам. Поставь точку так, чтобы её сдвиг был как у тридцати градусов, а высота ушла вниз.', 'Now you. Place the point so its shift matches thirty degrees and its height goes down.'),
  ],
  work: {
    prompt: L("Nuqtani qo'ying: siljish o'ttiz gradusdagidek, balandlik pastga.", 'Поставь точку: сдвиг как у тридцати градусов, высота вниз.', 'Place the point: the shift as at thirty degrees, the height down.'),
    ok: L("Bu minus o'ttiz gradus, birinchi ekrandagi o'sha burchak. Kosinus o'sha, sinus esa qarama-qarshi.", 'Это минус тридцать градусов, тот самый угол с первого экрана. Косинус тот же, синус противоположный.', 'That is minus thirty degrees, the very angle from the first screen. The cosine is the same, the sine is the opposite.'),
    hint: [
      L("Siljish o'sha bo'lib qolishi kerak, ya'ni nuqta o'rtadan o'ngda.", 'Сдвиг должен остаться прежним, то есть точка правее середины.', 'The shift must stay the same, so the point is right of the middle.'),
      L("Balandlik o'qdan pastga tushishi kerak.", 'Высота должна уйти ниже оси.', 'The height must go below the axis.'),
      L("Avvalgi nuqtaning aynan tagida nuqta kerak: siljish o'sha, balandlik pastga.", 'Нужна точка ровно под той, что была: сдвиг тот же, высота вниз.', 'You need the point directly below the previous one: the same shift, the height down.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'liq aylana o'sha nuqtaga qaytaradi", 'Полный оборот возвращает в ту же точку', 'A full turn returns to the same point'),
  tag: 'period-bez-vozvrata',
  show: [
    [
      L("nuqta o'ttiz gradusda", 'точка на тридцати градусах', 'the point is at thirty degrees'),
      L('joy halqa bilan belgilangan', 'место отмечено кольцом', 'the spot is marked with a ring'),
    ],
    [
      L("aylana bosib o'tildi", 'оборот пройден', 'the turn is complete'),
      L('nuqta aynan halqaga tushdi', 'точка села ровно в кольцо', 'the point landed exactly in the ring'),
    ],
  ],
  motion: ['turn'],
  audio: [
    A('mount', "Nuqta o'ttiz gradusda. Uning joyi halqa bilan belgilangan, qayerga qaytishi ko'rinsin.", 'Точка на тридцати градусах. Её место отмечено кольцом, чтобы было видно, куда она вернётся.', 'The point is at thirty degrees. Its spot is marked with a ring so you can see where it returns.'),
    A('turn', "Endi nuqta aylana bo'ylab yuradi va to'liq aylanani bosib o'tadi. Qayerga kelishiga qarang.", 'Теперь точка идёт по кругу и проходит полный оборот. Смотри, куда она придёт.', 'Now the point goes round and completes a full turn. Watch where it arrives.'),
    A('same', "U aynan halqaga tushdi. Bu o'xshash nuqta emas, aynan o'sha, demak uning uchala qiymati ham o'sha.", 'Она села ровно в кольцо. Это не похожая точка, а та же самая, значит и все три значения у неё те же.', 'It landed exactly in the ring. Not a similar point but the very same one, so all three of its values are the same too.'),
    A('work', "Endi o'zingiz. Nuqtani uch yuz to'qson gradusga qo'ying.", 'Теперь сам. Поставь точку на триста девяносто градусов.', 'Now you. Place the point at three hundred ninety degrees.'),
  ],
  work: {
    prompt: L("Nuqtani 390 gradusga qo'ying.", 'Поставь точку на 390 градусов.', 'Place the point at 390 degrees.'),
    ok: L("Uch yuz to'qson bu aylana va yana o'ttiz. Nuqta o'ttiz gradusdagi joyda.", 'Триста девяносто это оборот и ещё тридцать. Точка там же, где у тридцати градусов.', 'Three hundred ninety is a turn plus thirty. The point sits where thirty degrees sits.'),
    hint: [
      L("To'liq aylanani tashlab, nima qolganiga qarang.", 'Отбрось полный оборот и посмотри, что осталось.', 'Drop the full turn and see what is left.'),
      L("Uch yuz to'qsondan uch yuz oltmishni ayirsak, o'ttiz bo'ladi.", 'Триста девяносто минус триста шестьдесят даёт тридцать.', 'Three hundred ninety minus three hundred sixty gives thirty.'),
      L("O'ttiz gradusdagi nuqta kerak.", 'Нужна точка на тридцати градусах.', 'You need the point at thirty degrees.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Necha aylana qilsangiz ham', 'Сколько оборотов ни делай', 'However many turns you make'),
  tag: 'period-bez-vozvrata',
  show: [
    [
      L('ketma-ket ikki aylana', 'два оборота подряд', 'two turns in a row'),
      L('nuqta yana halqada', 'точка снова в кольце', 'the point is in the ring again'),
    ],
    [
      L("aylanalar soni har qancha bo'lishi mumkin", 'оборотов может быть сколько угодно', 'there can be any number of turns'),
      'sin(α + 360°k) = sin α',
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Ishonish uchun bitta aylana kam. Ikkitasini qilamiz.', 'Одного оборота мало, чтобы поверить. Сделаем два.', 'One turn is not enough to be sure. Let us make two.'),
    A('two', "Nuqta oldinga yuradi va ikkinchi aylanani bosib o'tadi. Va yana o'sha halqaga tushadi.", 'Точка идёт дальше и проходит второй оборот. И снова садится в то же кольцо.', 'The point goes on and completes a second turn. And lands in the same ring again.'),
    A('rule', "Demak gap uch yuz oltmish sonida emas, butun sondagi aylanalarda. Ularni istagancha qo'shing, nuqta qimirlamaydi.", 'Значит дело не в числе триста шестьдесят, а в целом числе оборотов. Прибавь их сколько угодно, точка не сдвинется.', 'So it is not about the number three hundred sixty but about a whole number of turns. Add as many as you like, the point will not move.'),
    A('work', "Endi o'zingiz. Nuqtani yetti yuz sakson gradusga qo'ying.", 'Теперь сам. Поставь точку на семьсот восемьдесят градусов.', 'Now you. Place the point at seven hundred eighty degrees.'),
  ],
  work: {
    prompt: L("Nuqtani 780 gradusga qo'ying.", 'Поставь точку на 780 градусов.', 'Place the point at 780 degrees.'),
    ok: L('Yetti yuz sakson bu ikki aylana va yana oltmish. Aylanalar ketdi, burchak qoldi.', 'Семьсот восемьдесят это два оборота и ещё шестьдесят. Обороты ушли, остался угол.', 'Seven hundred eighty is two turns plus sixty. The turns are gone, the angle is left.'),
    hint: [
      L('Aylanadan kam qolguncha uch yuz oltmishdan tashlab boring.', 'Отбрасывай по триста шестьдесят, пока останется меньше оборота.', 'Keep dropping three hundred sixty until less than a turn is left.'),
      L("Yetti yuz saksondan yetti yuz yigirmani ayirsak, oltmish bo'ladi.", 'Семьсот восемьдесят минус семьсот двадцать даёт шестьдесят.', 'Seven hundred eighty minus seven hundred twenty gives sixty.'),
      L('Oltmish gradusdagi nuqta kerak.', 'Нужна точка на шестидесяти градусах.', 'You need the point at sixty degrees.'),
    ],
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Tangensning davri qisqaroq', 'У тангенса период короче', 'The tangent has a shorter period'),
  tag: 'period-bez-vozvrata',
  show: [
    [
      L('yarim aylana', 'половина оборота', 'half a turn'),
      L('ikki son ham ishorasini almashtirdi', 'оба числа сменили знак', 'both numbers changed sign'),
      'tg(α + 180°) = tg α',
    ],
  ],
  motion: ['half'],
  audio: [
    A('mount', "Sinus va kosinus to'liq aylanadan keyin takrorlanadi. Tangens esa nisbat, va nisbatning hisobi boshqa.", 'Синус и косинус повторяются через полный оборот. А тангенс это отношение, и у отношения счёт другой.', 'Sine and cosine repeat after a full turn. But the tangent is a ratio, and a ratio counts differently.'),
    A('half', "Yarim aylanani bosib o'tamiz. Ikki son ham qarama-qarshi bo'ldi, minusga minus esa plyus beradi, va nisbat o'sha bo'lib qoldi.", 'Точка идёт дальше и проходит половину оборота. Оба числа стали противоположными, а минус на минус даёт плюс, и отношение осталось тем же.', 'Let us go half a turn. Both numbers became opposite, and minus over minus gives plus, so the ratio stayed the same.'),
    A('work', "O'zingiz hisoblang. Tangens necha gradusdan keyin takrorlanadi?", 'Посчитай сам. Через сколько градусов повторяется тангенс?', 'Compute it yourself. After how many degrees does the tangent repeat?'),
  ],
  work: {
    prompt: L('Tangens necha gradusdan keyin takrorlanadi?', 'Через сколько градусов повторяется тангенс?', 'After how many degrees does the tangent repeat?'),
    ok: L('Yuz sakson. Bu sinus va kosinusnikidan ikki baravar kam, chunki nisbat ikkala ishora almashganini sezmaydi.', 'Сто восемьдесят. Это вдвое меньше, чем у синуса и косинуса, потому что отношение не замечает, что оба знака сменились.', 'One hundred eighty. That is half of the sine and cosine period, because the ratio does not notice that both signs flipped.'),
    hint: [
      L("Sinus va kosinus uch yuz oltmishdan keyin takrorlanadi. Tangensda bu ertaroq bo'ladi.", 'Синус и косинус повторяются через триста шестьдесят. У тангенса это происходит раньше.', 'Sine and cosine repeat after three hundred sixty. For the tangent it happens sooner.'),
      L("Yarim aylana ikkala ishorani almashtiradi, nisbatni esa o'sha holda qoldiradi.", 'Половина оборота меняет оба знака, а отношение оставляет прежним.', 'Half a turn flips both signs and leaves the ratio as it was.'),
      L('Yuz sakson.', 'Сто восемьдесят.', 'One hundred eighty.'),
    ],
    answer: '180',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Juftlik va davr', 'Чётность и период', 'Parity and period'),
  tag: 'sinus-chetnyy',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Nuqta yana bir bor aks etadi, va qoida yonida ochiladi. Juft deb ko'zgu hech narsasini o'zgartirmaganini aytadi.", 'Точка отражается ещё раз, и правило открывается рядом. Чётный тот, у кого зеркало ничего не изменило.', 'The point reflects once more, and the rule opens beside it. Even is the one the mirror left unchanged.'),
  ],
  probe: {
    question: L('Qaysi funksiya juft?', 'Какая функция чётная?', 'Which function is even?'),
    items: [
      { id: 'a', label: L('kosinus', 'косинус', 'the cosine'), correct: true },
      { id: 'b', label: L('sinus', 'синус', 'the sine'), hint: L("Sinusda ko'zgu balandlikni ag'daradi, demak ishora almashadi. Juft deb hech narsasi o'zgarmaganini aytadi.", 'У синуса зеркало переворачивает высоту, значит знак меняется. Чётный тот, у кого ничего не изменилось.', 'For the sine the mirror flips the height, so the sign changes. Even is the one where nothing changed.') },
    ],
  },
  rule: {
    lawLabel: L("Ko'zgu", 'Зеркало', 'The mirror'),
    lines: [
      L('`y = cos x` funksiya juft: `cos(−x) = cos x`.', 'Функция `y = cos x` чётная: `cos(−x) = cos x`.', 'The function `y = cos x` is even: `cos(−x) = cos x`.'),
      L('`y = sin x` va `y = tg x` funksiyalar toq: `sin(−x) = −sin x`, `tg(−x) = −tg x`.', 'Функции `y = sin x` и `y = tg x` нечётные: `sin(−x) = −sin x`, `tg(−x) = −tg x`.', 'The functions `y = sin x` and `y = tg x` are odd: `sin(−x) = −sin x`, `tg(−x) = −tg x`.'),
      L('Sinus va kosinusning asosiy davri `2π`, tangensniki esa `π`.', 'Основной период синуса и косинуса равен `2π`, у тангенса он равен `π`.', 'The main period of sine and cosine is `2π`, of the tangent it is `π`.'),
    ],
    law: 'cos(−x) = cos x,   sin(−x) = −sin x',
  },
}

const S9 = {
  role: 'drill',
  answer: 'build',
  format: 'table',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Uch burchak, bitta ko'zgu", 'Три угла, одно зеркало', 'Three angles, one mirror'),
  tag: 'sinus-chetnyy',
  audio: [
    A('mount', "Uch burchak. Juftliklarni to'ldiring va birinchi ikkitasining farqini ko'ring.", 'Три угла. Заполни пары и посмотри, чем отличаются первые два.', 'Three angles. Fill in the pairs and see how the first two differ.'),
  ],
  table: {
    wrong: L('Chizmaga qarang: nuqta belgilangan. Birinchi son siljish, ikkinchisi balandlik.', 'Смотри на чертёж: точка отмечена. Первое число это сдвиг, второе высота.', 'Look at the drawing: the point is marked. The first number is the shift, the second the height.'),
    swap: L('Sonlar joy almashgan. Birinchisi siljish, ikkinchisi balandlik.', 'Числа перепутаны местами. Первое это сдвиг, второе высота.', 'The numbers are swapped. The first is the shift, the second the height.'),
    ok: L('Birinchi son bir xil, ikkinchisi qarama-qarshi. Juftlik va toqlik shu.', 'Первое число одно и то же, второе противоположное. Это и есть чётность и нечётность.', 'The first number is the same, the second opposite. That is evenness and oddness.'),
    rows: ['30°  →  (√3/2; 1/2)', '−30°  →  (√3/2; −1/2)', '210°  →  (−√3/2; −1/2)'],
    chips: ['√3/2', '−√3/2', '1/2', '−1/2'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('sin(−390°) ni qadamlar bilan toping', 'Найди sin(−390°) по шагам', 'Find sin(−390°) step by step'),
  tag: 'sinus-chetnyy',
  audio: [
    A('mount', "Minus uch yuz to'qson gradus. Qadamlar nomlangan, tartibini o'zingiz qo'yasiz.", 'Минус триста девяносто градусов. Шаги названы, порядок ставишь ты.', 'Minus three hundred ninety degrees. The steps are named, you put them in order.'),
  ],
  order: {
    prompt: L('Yechim qadamlarini tartib bilan joylashtiring.', 'Расставь шаги решения по порядку.', 'Put the steps of the solution in order.'),
    s2: L("to'liq aylanani tashlash", 'отбросить полный оборот', 'drop the full turn'),
    s3: L('sinus toq', 'синус нечётный', 'the sine is odd'),
    ok: L("Minus bir ikkidan. Avval aylanani olib tashladik, keyin burchakdagi minusni qiymat oldiga ko'chirdik.", 'Минус одна вторая. Сначала убрали оборот, потом сняли минус с угла и поставили его перед значением.', 'Minus one half. First we removed the turn, then moved the minus from the angle in front of the value.'),
    bad: L("Avval to'liq aylana olib tashlanadi, keyin toqlik qo'llanadi, keyin qiymat olinadi.", 'Сначала убирается полный оборот, потом применяется нечётность, потом берётся значение.', 'First the full turn is removed, then oddness is applied, then the value is taken.'),
    s1: '−390° = −(360° + 30°)',
    s4: 'sin(−30°) = −1/2',
    mark: '−30°',
  },
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz hisoblang', 'Посчитай без чертежа', 'Compute without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("Minus bir. Kosinus juft, demak burchakdagi minus hech narsani o'zgartirmaydi, yuz saksonda esa siljish minus birga teng.", 'Минус один. Косинус чётный, значит минус у угла ничего не меняет, а у ста восьмидесяти сдвиг равен минус одному.', 'Minus one. The cosine is even, so the minus on the angle changes nothing, and at one hundred eighty the shift is minus one.'),
    hint: [
      L('Kosinus juft: burchakdagi minusni olib tashlash mumkin.', 'Косинус чётный: минус у угла можно убрать.', 'The cosine is even: the minus on the angle can be dropped.'),
      L('Yuz saksonning kosinusi qoladi, bu esa aylananing chap nuqtasi.', 'Остаётся косинус ста восьмидесяти, а это левая точка окружности.', 'The cosine of one hundred eighty is left, and that is the left point of the circle.'),
      L('Minus bir.', 'Минус один.', 'Minus one.'),
    ],
    prompt: 'cos(−180°)  =  ?',
    answer: '−1',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi sinus kichikroq?', 'Какой синус меньше?', 'Which sine is smaller?'),
    ok: L('Siz ishora bilan solishtirdingiz: minus bir minus bir ikkidandan kichik, nol esa bir ikkidandan kichik.', 'Ты сравнил со знаком: минус один меньше минус одной второй, а ноль меньше одной второй.', 'You compared with the sign: minus one is less than minus one half, and zero is less than one half.'),
    bad: L("Avval har yozuvni songa o'tkazing, sinus toq ekanini esda tutib.", 'Сначала переведи каждую запись в число, помня, что синус нечётный.', 'First turn each reading into a number, remembering the sine is odd.'),
    items: ['sin(−90°)', 'sin(−30°)', 'sin 0', 'sin 30°'],
    answer: 'sin(−90°)  sin(−30°)  sin 0  sin 30°',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob noto'g'ri. Qayerda?", 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  audio: [
    A('mount', 'Masala. Minus yuz yigirma gradusning kosinusini topish kerak.', 'Задача. Надо найти косинус минус ста двадцати градусов.', 'A task. We need to find the cosine of minus one hundred twenty degrees.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r2: L("Bu qator to'g'ri: kosinus haqiqatan ham juft.", 'Эта строка верна: косинус действительно чётный.', 'This line is right: the cosine really is even.'),
    r4: L("Yuz yigirma gradusning qiymati to'g'ri hisoblangan. Birinchi xato qator yuqorida.", 'Значение ста двадцати градусов посчитано верно. Первая неверная строка выше.', 'The value at one hundred twenty degrees is computed correctly. The first wrong line is above.'),
  },
  proof: L("Juftlikni yozdi, toqlikni qo'lladi.", 'Чётность записали, а применили нечётность.', 'Evenness was written, oddness was applied.'),
  entry: {
    prompt: L('cos(−120°) qancha?', 'Чему равен cos(−120°)?', 'What is cos(−120°)?'),
    ok: L("Minus nol butun besh. Kosinus juft, demak burchakdagi minus hech narsani o'zgartirmaydi, javob yuz yigirmanikidek.", 'Минус ноль целых пять. Косинус чётный, значит минус у угла ничего не меняет, и ответ такой же, как у ста двадцати.', 'Minus zero point five. The cosine is even, so the minus on the angle changes nothing, and the answer matches one hundred twenty.'),
    hint: [
      L('Kosinus juft: minus yuz yigirmada va yuz yigirmada u bir xil.', 'Косинус чётный: у минус ста двадцати и у ста двадцати он одинаковый.', 'The cosine is even: it is the same at minus one hundred twenty and at one hundred twenty.'),
      L('Yuz yigirma gradusda siljish minus bir ikkidanga teng.', 'У ста двадцати градусов сдвиг равен минус одной второй.', 'At one hundred twenty degrees the shift is minus one half.'),
      L('Minus nol butun besh.', 'Минус ноль целых пять.', 'Minus zero point five.'),
    ],
    answer: '−0,5',
  },
  row: {
    r1: 'cos(−120°) = ?',
    r2: 'cos(−x) = cos x',
    r3: 'cos(−120°) = −cos 120°',
    r4: 'cos 120° = −1/2',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Bitta nuqta, ko'p yozuv", 'Одна точка, много записей', 'One point, many readings'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. Nuqta bitta, unga yozuv esa ko'p.", 'Теперь обратная задача. Точка одна, а записей для неё много.', 'Now the inverse task. There is one point, but many readings for it.'),
    A('work', "Nuqtani qo'ying, keyin shu yerga olib keladigan hamma yozuvni belgilaysiz.", 'Поставь точку, потом отметишь все записи, которые ведут сюда же.', 'Place the point, then you will mark every reading that leads here.'),
  ],
  multi: {
    prompt: L('AYNAN shu nuqtani beradigan hamma yozuvni belgilang.', 'Отметь все записи, которые дают ЭТУ ЖЕ точку.', 'Mark every reading that gives THIS SAME point.'),
    title: L('Qaysi yozuvlar aynan shu nuqtani beradi?', 'Какие записи дают эту же точку?', 'Which readings give this same point?'),
    ok: L("Beshtadan uchtasi. Faqat butun sondagi aylanani qo'shish va ayirish mumkin.", 'Три записи из пяти. Прибавлять и отнимать можно только целое число оборотов.', 'Three out of five. Only a whole number of turns may be added or subtracted.'),
    items: [
      { id: 'd', label: '−30°', hint: L("Minus o'ttiz bu aks etish, u yerda balandlik pastga ketadi.", 'Минус тридцать это отражение, там высота уходит вниз.', 'Minus thirty is the reflection, there the height goes down.') },
      { id: 'e', label: '210°', hint: L("Bu yerda yarim aylana qo'shilgan, butun emas. Nuqta qarshi tomonda bo'ladi.", 'Здесь прибавлена половина оборота, а не целый. Точка окажется напротив.', 'Here half a turn was added, not a whole one. The point ends up opposite.') },
      { id: 'a', label: '390°', ok: true },
      { id: 'b', label: '−330°', ok: true },
      { id: 'c', label: '750°', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 30 gradusga qo'ying.", 'Поставь точку на 30 градусов.', 'Place the point at 30 degrees.'),
    ok: L("Nuqta joyida. Endi bu yerga yana qaysi yozuvlar olib kelishini ko'ramiz.", 'Точка на месте. Теперь посмотрим, какие ещё записи приводят сюда же.', 'The point is in place. Now let us see which other readings lead here.'),
    wrong: L("O'ttiz gradus bu to'g'ri burchakning uchdan biri, o'ng nuqtadan bir oz yuqorida.", 'Тридцать градусов это треть прямого угла, чуть выше правой точки.', 'Thirty degrees is a third of a right angle, just above the right point.'),
    target: '30°',
    step: '30°  +  360°k',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'sinus-chetnyy',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('sin(−30°) qancha?', 'Чему равен sin(−30°)?', 'What is sin(−30°)?'),
      done: 'sin(−30°) = −1/2',
      items: [
        { id: 'a', label: L('minus bir ikkidan', 'минус одна вторая', 'minus one half'), correct: true },
        { id: 'b', label: L('bir ikkidan', 'одна вторая', 'one half'), hint: L("Ko'zgu balandlikni ag'daradi, demak ishora almashadi.", 'Зеркало переворачивает высоту, значит знак меняется.', 'The mirror flips the height, so the sign changes.') },
        { id: 'c', label: L('uch ildizining yarmi', 'корень из трёх на два', 'root three over two'), hint: L("Bu oltmish gradusning balandligi, o'ttizniki emas.", 'Это высота шестидесяти градусов, а не тридцати.', 'That is the height at sixty degrees, not thirty.') },
        { id: 'd', label: L('nol', 'ноль', 'zero'), hint: L("Nol faqat o'qda bo'ladi, o'ttiz gradus esa o'qda emas.", 'Ноль бывает только на оси, а тридцать градусов не на оси.', 'Zero happens only on the axis, and thirty degrees is not on the axis.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('cos(−60°) qancha?', 'Чему равен cos(−60°)?', 'What is cos(−60°)?'),
      done: 'cos(−60°) = 1/2',
      items: [
        { id: 'a', label: L('bir ikkidan', 'одна вторая', 'one half'), correct: true },
        { id: 'b', label: L('minus bir ikkidan', 'минус одна вторая', 'minus one half'), hint: L("Kosinus juft: ko'zgu siljishga tegmaydi.", 'Косинус чётный: зеркало не трогает сдвиг.', 'The cosine is even: the mirror does not touch the shift.') },
        { id: 'c', label: L('uch ildizining yarmi', 'корень из трёх на два', 'root three over two'), hint: L("Bu o'ttiz gradusning siljishi, oltmishniki emas.", 'Это сдвиг тридцати градусов, а не шестидесяти.', 'That is the shift at thirty degrees, not sixty.') },
        { id: 'd', label: L('minus bir', 'минус один', 'minus one'), hint: L("Minus bir faqat chap nuqtada, yuz saksonda bo'ladi.", 'Минус один бывает только у левой точки, у ста восьмидесяти.', 'Minus one happens only at the left point, at one hundred eighty.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Nuqtani qimirlatmasdan burchakka nimani qo'shish mumkin?", 'Что можно прибавить к углу, не сдвинув точку?', 'What can be added to the angle without moving the point?'),
      done: 'α + 360°k',
      items: [
        { id: 'a', label: L('butun sondagi aylana', 'целое число оборотов', 'a whole number of turns'), correct: true, ok: L('Ha. Yarim aylana esa nuqtani qarshi tomonga olib ketadi.', 'Да. Половина оборота уже уводит точку напротив.', 'Yes. Half a turn already sends the point to the opposite side.') },
        { id: 'b', label: L('har qanday gradus soni', 'любое число градусов', 'any number of degrees'), hint: L("Unda nuqta qimirlagan bo'lardi, bizga esa aynan o'sha kerak.", 'Тогда точка сдвинулась бы, а нам нужна та же самая.', 'Then the point would move, and we need the very same one.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Tangens necha gradusdan keyin takrorlanadi?', 'Через сколько градусов повторяется тангенс?', 'After how many degrees does the tangent repeat?'),
      done: 'tg(α + 180°) = tg α',
      items: [
        { id: 'a', label: L('yuz sakson', 'сто восемьдесят', 'one hundred eighty'), correct: true },
        { id: 'b', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), hint: L('Uch yuz oltmishdan keyin sinus va kosinus takrorlanadi, tangens esa ertaroq.', 'Через триста шестьдесят повторяются синус и косинус, а тангенс раньше.', 'After three hundred sixty the sine and cosine repeat, the tangent sooner.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qson gradusdan keyin nisbat o'zgaradi, takrorlanmaydi.", 'Через девяносто градусов отношение меняется, а не повторяется.', 'After ninety degrees the ratio changes, it does not repeat.') },
        { id: 'd', label: L('takrorlanmaydi', 'не повторяется', 'it does not repeat'), hint: L("Takrorlanadi: yarim aylana ikkala ishorani almashtiradi, nisbatni esa o'sha holda qoldiradi.", 'Повторяется: половина оборота меняет оба знака, а отношение оставляет прежним.', 'It does repeat: half a turn flips both signs and leaves the ratio as it was.') },
      ],
    },
  ],
  angles: ['−30°', '−60°', '30°', '210°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Minus o'ttizning sinusi minus bir ikkidan, va bu ko'zgudan ko'rinadi, yoddan emas.", 'Синус минус тридцати равен минус одной второй, и это видно по зеркалу, а не по памяти.', 'The sine of minus thirty is minus one half, and that shows in the mirror, not in memory.'),
  ],
  can: [
    L("Burchakni ikki tomonga ham qo'yaman", 'Откладываю угол в обе стороны', 'I lay an angle both ways'),
    L('Kosinus juft, sinus toq ekanini bilaman', 'Знаю, что косинус чётный, а синус нечётный', 'I know the cosine is even and the sine odd'),
    L('Butun aylanalarni tashlab yuboraman', 'Отбрасываю целые обороты', 'I drop whole turns'),
    L('Tangensning davri qisqaroq ekanini eslayman', 'Помню, что у тангенса период короче', 'I remember the tangent has a shorter period'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: qaysi funksiyada ishora almashadi.', 'Одно место требует повтора: у какой функции знак меняется.', 'One place needs review: which function changes sign.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L("6-dars: o'sha nuqta, lekin uning balandligi vaqt bo'ylab yoziladi, va grafik chiqadi.", 'Урок 6: та же точка, но её высота записывается во времени — и получается график.', 'Lesson 6: the same point, but its height written along time, and that gives the graph.'),
  lifehack: L("Ko'zgu faqat balandlikka tegadi. Siljishga esa hech qachon tegmaydi.", 'Зеркало трогает только высоту. Сдвиг оно не трогает никогда.', 'The mirror touches only the height. It never touches the shift.'),
  sheetTitle: L('Juftlik va davr · shpargalka', 'Чётность и период · шпаргалка', 'Parity and period · cheat sheet'),
  sheetSrc: L('10-sinf · 5-dars', '10 класс · урок 5', 'Grade 10 · lesson 5'),
  hook: {
    a: 'sin(−30°) = 1/2',
    b: 'sin(−30°) = −1/2',
  },
  proved: 'sin(−30°) = −1/2',
  law: 'cos(−x) = cos x,   sin(−x) = −sin x',
  sheet: [
    'cos(−x) = cos x',
    'sin(−x) = −sin x,   tg(−x) = −tg x',
    'sin(x + 360°k) = sin x',
    'tg(x + 180°) = tg x',
    ['T = 2π', 'tg: T = π'],
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число из контента: там оно записано так, как читает методист («−0,5»), а
// прибору нужно настоящее число. Один источник истины — документ контента.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
// Градус ТОЖЕ через нормализатор. В контенте минус это U+2212, а `parseInt`
// его не понимает и возвращает NaN: угол становится NaN, координаты тоже, и
// браузер сыплет «attribute x2: Expected length, NaN». Поймано прогоном
// руками 2026-08-13 — при обычном пролистывании этого не видно.
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Таблица разбирается ИЗ КОНТЕНТА: «30°  →  (√3/2; 1/2)» даёт угол и два чипа.
// Чипы тоже оттуда, их значения нужны прибору, чтобы поставить точку-догадку
// при неверном заполнении.
const CHIP_VAL = { '√3/2': 0.866, '−√3/2': -0.866, '1/2': 0.5, '−1/2': -0.5 }
const PAIR_CHIPS = S9.table.chips.map((label, i) => ({ id: 'c' + i, label, value: CHIP_VAL[label] }))
const chipId = (label) => (PAIR_CHIPS.find((c) => c.label === label) || {}).id
const PAIR_ROWS = S9.table.rows.map((r) => {
  const [a, b] = r.split('→').map((x) => x.trim())
  const [c, s] = b.replace(/[()]/g, '').split(';').map((x) => x.trim())
  return { deg: deg(a), label: a, cos: chipId(c), sin: chipId(s) }
})

const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Точка ОТРАЖАЕТСЯ вниз прямо на хуке: отрицательный поворот виден
        // раньше, чем назван. Координаты не подписаны — прогноз до действия.
        fig={() => <Scene fig={<MirrorAxis step={1} deg={30} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={30} locked drop meaning ticks />} max={300} />
        </Col>
        <Col>
          <ProbeChain items={S2.items} cols={2} audio={audio} onSolved={solve} />
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen3 = (p) => (
  <Screen data={S3} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S3.show.length && !solved ? (
      /* Отрицательный поворот вводится здесь: точка идёт по часовой. Пока без
         формул — просто вторая сторона счёта. */
      <Scene
        fig={<MirrorAxis step={phase} deg={60} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => Math.abs(c - 0.5) < 0.06 && s < -0.5}
        hints={[
          { when: (c, s) => s > 0, text: S3.work.hint[0] },
          { when: (c) => c < 0, text: S3.work.hint[1] },
          { when: () => true, text: S3.work.hint[2] },
        ]}
        okText={S3.work.ok}
        snap={[300]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Свидетель урока. Горизонтальный отрезок НЕ ДВИГАЕТСЯ, пока точка
         отражается вниз, — отсюда обе формулы разом. */
      <Scene
        fig={<MirrorAxis step={phase} deg={30} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      /* Работа на минус тридцати: это тот самый угол с первого экрана, и
         прогноз ученика проверяется его же руками. */
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => Math.abs(c - 0.866) < 0.06 && s < -0.2}
        hints={[
          { when: (c) => c < 0.5, text: S4.work.hint[0] },
          { when: (c, s) => s > 0, text: S4.work.hint[1] },
          { when: () => true, text: S4.work.hint[2] },
        ]}
        okText={S4.work.ok}
        snap={[330]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* Кольцо отмечает, ОТКУДА точка вышла. После полного оборота она садится
         ровно в него: это не похожая точка, а та же самая. */
      <Scene
        fig={<SameSpot step={phase} deg={30} turns={1} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => Math.abs(c - 0.866) < 0.06 && Math.abs(s - 0.5) < 0.06}
        hints={[
          { when: (c, s) => s < 0, text: S5.work.hint[0] },
          { when: (c) => c < 0, text: S5.work.hint[1] },
          { when: () => true, text: S5.work.hint[2] },
        ]}
        okText={S5.work.ok}
        snap={[30]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* ДВА оборота, а не один: с одним ученик запоминает «прибавили триста
         шестьдесят», со вторым видно, что дело в целом числе оборотов. */
      <Scene
        fig={<SameSpot step={phase} deg={30} turns={2} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S6.work.prompt}
        test={(c, s) => Math.abs(c - 0.5) < 0.06 && Math.abs(s - 0.866) < 0.06}
        hints={[
          { when: (c, s) => s < 0, text: S6.work.hint[0] },
          { when: (c) => c < 0, text: S6.work.hint[1] },
          { when: () => true, text: S6.work.hint[2] },
        ]}
        okText={S6.work.ok}
        snap={[60]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* Половина оборота: точка садится НАПРОТИВ кольца. Оба числа сменили
         знак, а их отношение — нет. */
      <Scene
        fig={<SameSpot step={phase} deg={30} turns={0.5} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={210} locked drop values marks={[{ deg: 30, tone: 'ink3', label: '30°' }]} />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S7.work.prompt}
            answer={num(S7.work.answer)}
            okText={S7.work.ok}
            hints={S7.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        // Отражение повторяется в момент ответа: карточка открывается рядом с
        // тем движением, которое её и породило.
        fig={(solved) => <Scene fig={<MirrorAxis step={solved ? 2 : 0} deg={60} />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <TableFill
        // Chizma YORDAMCHI: ish jadvalda, chizma burchakni belgilaydi.
        figH={168}
        rows={PAIR_ROWS}
        chips={PAIR_CHIPS}
        wrongNote={S9.table.wrong}
        swapNote={S9.table.swap}
        okText={S9.table.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen10 = (p) => (
  <Screen data={S10} {...p}>
    {({ audio, solve }) => (
      <OrderRow
        prompt={S10.order.prompt}
        items={ORD10}
        answer={['s1', 's2', 's3', 's4']}
        marks={[{ deg: 330, tone: 'graph', label: S10.order.mark }]}
        okText={S10.order.ok}
        badText={S10.order.bad}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen11 = (p) => (
  <Screen data={S11} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <OrderRow
        prompt={S11.order.prompt}
        items={ORD11}
        answer={ORD11_ANS}
        okText={S11.order.ok}
        badText={S11.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big" style={{ textAlign: 'left' }}>{S11.task.prompt}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            answer={num(S11.task.answer)}
            okText={S11.task.ok}
            hints={S11.task.hint}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen12 = (p) => (
  <Screen data={S12} {...p}>
    {({ audio, stage, setStage, solve }) => (
      <Cols l={1.1} r={1}>
        <Col>
          <AuditRows
            rows={TRAP_ROWS}
            answerId={S12.answerId}
            hints={S12.hint}
            proof={S12.proof}
            audio={audio}
            onSolved={() => setStage(1)}
          />
        </Col>
        <Col>
          {stage === 1 ? (
            /* Чертежа нет, как в уроках 2 и 4: свидетель ловушки — само
               правило чётности, записанное строкой выше и там же нарушенное. */
            <NumberEntry
              compact
              prompt={S12.entry.prompt}
              answer={num(S12.entry.answer)}
              okText={S12.entry.ok}
              hints={S12.entry.hint}
              audio={audio}
              onSolved={solve}
            />
          ) : (
            <Slot mh={170} />
          )}
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen13 = (p) => (
  <Screen data={S13} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <PlaceAngle
        prompt={S13.place.prompt}
        targets={[deg(S13.place.target)]}
        steps={[S13.place.step]}
        okText={S13.place.ok}
        wrongText={S13.place.wrong}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
      />
    ))}
  </Screen>
)

const Screen14 = (p) => (
  <Screen data={S14} {...p}>
    {(s) => (
      <BlitzBody
        {...s}
        data={S14}
        // Угол меняется от вопроса к вопросу: чертёж идёт за блицем.
        fig={(round) => {
          const raw = S14.angles[Math.min(round, S14.angles.length - 1)]
          return <Scene fig={<UnitCircle angle={deg(raw)} locked drop />} max={300} />
        }}
      />
    )}
  </Screen>
)

const Screen15 = (p) => (
  <Screen data={S15} {...p}>
    {(s) => (
      <SummaryBody
        {...s}
        data={{
          ...S15,
          hookLabels: { a: S15.hook.a, b: S15.hook.b, both: '?', none: '?' },
          sheetSteps: S15.sheet,
        }}
        answers={p.answers}
      />
    )}
  </Screen>
)

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default makeLesson({
  meta: { id: LESSON_ID, no: LESSON_NO, title: LESSON_TITLE },
  block: BLOCK,
  screens: SCREENS,
  voice: 'm',
})
