import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang} from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars45 — "Kalendar: sutka, hafta, oy, yil" (num-3-45) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 50-satr). SAHNA: 1-DARSNING shahri, tugun — kalendar varag'i.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 166-bet).
// YADRO: katta vaqt o'lchovlari: 1 sutka = 24 soat, 1 hafta = 7 kun, 1 yil = 12 oy.
//   Oydagi kun soni har xil: 30, 31 yoki 28.
// Misconception: M1 «har oyda 30 kun»; M2 sana va hafta kunini chalkashtirish; M3 «yilda
//   12 hafta»; M4 ikki sana orasidagi kunni noto'g'ri sanash.
// FactCard: kabisa yili — Yer Quyoshni 365 kunu qariyb 6 soatda aylanadi, to'rt yilda bir
//   sutka yig'iladi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-45',
  lessonTitle: { ru: 'Урок 45. Календарь: сутки, неделя, месяц, год', uz: '45-dars. Kalendar: sutka, hafta, oy, yil' }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Календарь', uz: 'Kalendar' },
    lead: { ru: 'На стене лист календаря', uz: 'Devorda kalendar varag\'i' },
    order_cap: { ru: 'клетки стоят рядами по семь', uz: 'kataklar yettitadan qatorda turadi' },
    plate: ['1', '=', '7'],
    q: { ru: 'Почему в строке календаря ровно семь клеток?', uz: "Nega kalendar qatorida rosa yettita katak bor?" },
    opt0: { ru: 'в неделе семь дней', uz: 'haftada yetti kun' },
    opt1: { ru: 'так удобнее рисовать', uz: 'shunday chizish qulay' },
    opt2: { ru: 'в месяце семь недель', uz: 'oyda yetti hafta' },
    opt3: { ru: 'семь это счастливое число', uz: 'yetti baxtli son' },
    audio: {
      intro: {
        ru: [
          'Часы и минуты позади. Возьмём мерки покрупнее.',
          'На стене висит лист календаря. Все клетки стоят ровными рядами.',
          'В каждом ряду ровно семь клеток, ни больше ни меньше.',
          'Как думаешь, почему именно семь?'
        ],
        uz: [
          "Soat va daqiqa ortda qoldi. Yiriroq o'lchovlarni olamiz.",
          "Devorda kalendar varag'i osilgan. Hamma kataklar tekis qatorlarda turadi.",
          "Har qatorda rosa yettita katak, ko'p ham emas, kam ham emas.",
          "Sizningcha, nega aynan yettita?"
        ]
      },
      on_correct: { ru: 'Верно! Строка календаря это одна неделя, а в неделе семь дней.', uz: "To'g'ri! Kalendar qatori bu bitta hafta, haftada esa yetti kun bor." },
      on_wrong1: { ru: 'Дело не в рисунке. Ряд повторяет неделю.', uz: "Gap rasmda emas. Qator haftani takrorlaydi." },
      on_wrong2: { ru: 'В месяце четыре недели с небольшим, а не семь.', uz: "Oyda to'rt haftadan sal ko'p, yetti emas." },
      on_idk: { ru: 'Ничего. Сейчас посчитаем клетки вместе.', uz: "Hechqisi yo'q. Hozir kataklarni birga sanaymiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'От суток к неделе', uz: 'Sutkadan haftaga' },
    task_line: 'одна клетка календаря',
    task_line_uz: "kalendarning bitta katagi",
    step1: { ru: '1 сутки = 24 часа', uz: '1 sutka = 24 soat' },
    step1_cap: { ru: 'клетка это целые сутки', uz: 'katak bu butun sutka' },
    step2: { ru: '1 неделя = 7 суток', uz: '1 hafta = 7 sutka' },
    step2_cap: { ru: 'строка это неделя', uz: 'qator bu hafta' },
    res: { ru: '7 клеток в строке', uz: 'qatorda 7 katak' },
    btn1: { ru: 'Раскрыть клетку', uz: 'Katakni ochish' },
    btn2: { ru: 'Посчитать строку', uz: 'Qatorni sanash' },
    done_text: { ru: 'Одна клетка это сутки, а вся строка это неделя из семи суток.', uz: "Bitta katak bu sutka, butun qator esa yetti sutkadan iborat hafta." },
    audio: {
      ru: [
        'Посмотрим, что прячется в одной клетке календаря.',
        'Клетка это целые сутки, а в сутках двадцать четыре часа. Это полный оборот часовой стрелки два раза.',
        'Семь клеток подряд складываются в неделю. Поэтому строка календаря всегда одинаковой длины.'
      ],
      uz: [
        "Kalendarning bitta katagida nima yashiringanini ko'ramiz.",
        "Katak bu butun sutka, sutkada esa yigirma to'rt soat bor. Bu soat strelkasining ikki marta to'liq aylanishi.",
        "Ketma-ket yettita katak haftaga yig'iladi. Shuning uchun kalendar qatori har doim bir xil uzunlikda."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'Месяцы бывают разной длины', uz: 'Oylar har xil uzunlikda bo\'ladi' },
    capA: { ru: 'в январе 31 день', uz: 'yanvarda 31 kun' },
    capB: { ru: 'в феврале 28 или 29', uz: 'fevralda 28 yoki 29' },
    res: { ru: 'в году 12 месяцев', uz: 'yilda 12 oy' },
    btn1: { ru: 'Открыть январь', uz: 'Yanvarni ochish' },
    btn2: { ru: 'Открыть февраль', uz: 'Fevralni ochish' },
    done_text: { ru: 'В месяце тридцать или тридцать один день, а в феврале двадцать восемь. Год всегда из двенадцати месяцев.', uz: "Oyda o'ttiz yoki o'ttiz bir kun, fevralda esa yigirma sakkiz kun bo'ladi. Yil har doim o'n ikki oydan iborat." },
    audio: {
      ru: [
        'Теперь посмотрим на месяцы.',
        'В январе тридцать один день, и таких длинных месяцев в году семь.',
        'А в феврале всего двадцать восемь дней, иногда двадцать девять. Значит правило про тридцать дней в каждом месяце не работает. Месяцев в году всегда двенадцать.'
      ],
      uz: [
        "Endi oylarga qaraymiz.",
        "Yanvarda o'ttiz bir kun, yilda bunday uzun oylar yettita.",
        "Fevralda esa atigi yigirma sakkiz kun, ba'zan yigirma to'qqiz. Demak har oyda o'ttiz kun degan qoida ishlamaydi. Yildagi oy soni esa har doim o'n ikkita."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Сколько часов в одних сутках?', uz: 'Bir sutkada necha soat bor?' },
    opts: [
      { ru: '24', uz: '24' },
      { ru: '12', uz: '12' },
      { ru: '60', uz: '60' },
      { ru: '7', uz: '7' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двенадцать это половина суток, один круг часовой стрелки.', uz: "O'n ikki bu sutkaning yarmi, soat strelkasining bir aylanasi." },
      2: { ru: 'Шестьдесят это минуты в часе.', uz: "Oltmish bu soatdagi daqiqa." },
      3: { ru: 'Семь это дни в неделе.', uz: "Yetti bu haftadagi kunlar." }
    },
    on_correct: { ru: 'Верно. В сутках двадцать четыре часа.', uz: "To'g'ri. Sutkada yigirma to'rt soat bor." },
    rule_lines: {
      ru: ['1 сутки = 24 часа', '1 неделя = 7 суток', '1 год = 12 месяцев'],
      uz: ["1 sutka = 24 soat", "1 hafta = 7 sutka", "1 yil = 12 oy"]
    },
    rule_ex: { ru: 'месяц: 30, 31 или 28 дней', uz: 'oy: 30, 31 yoki 28 kun' },
    rule_speech: { ru: 'В сутках двадцать четыре часа, в неделе семь суток, в году двенадцать месяцев. А вот дней в месяце бывает по-разному, тридцать, тридцать один или двадцать восемь.', uz: "Sutkada yigirma to'rt soat, haftada yetti sutka, yilda o'n ikki oy bor. Oydagi kun soni esa har xil bo'ladi, o'ttiz, o'ttiz bir yoki yigirma sakkiz." },
    audio: {
      intro: { ru: 'Соберём правило. Мерок времени стало больше.', uz: "Qoidani yig'amiz. Vaqt o'lchovlari ko'paydi." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'В строке календаря 7 клеток. Сколько суток в 3 строках?', uz: "Kalendar qatorida 7 katak. 3 qatorda necha sutka bor?" },
    fig_w: 7,
    fig_h: 3,
    opts: [
      { ru: '21', uz: '21' },
      { ru: '10', uz: '10' },
      { ru: '37', uz: '37' },
      { ru: '3', uz: '3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Десять это семь и три сложенные, а нужно умножить.', uz: "O'n bu yetti va uchning yig'indisi, kerak bo'lgani ko'paytirish." },
      2: { ru: 'Числа не приписывают друг к другу.', uz: "Sonlar yonma-yon yozilmaydi." },
      3: { ru: 'Три это число строк, а спрашивают про сутки.', uz: "Uch bu qatorlar soni, so'ralgani esa sutkalar." }
    },
    audio: {
      intro: { ru: 'Посмотри на календарь. В каждой строке семь клеток. Сколько суток в трёх строках?', uz: "Kalendarga qarang. Har qatorda yettita katak. Uch qatorda necha sutka bor?" },
      on_correct: { ru: 'Верно. Три недели по семь суток.', uz: "To'g'ri. Yetti sutkadan uch hafta." },
      on_wrong: { ru: 'Умножай семь на число строк.', uz: "Yettini qatorlar soniga ko'paytiring." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи мерки времени', uz: "Vaqt o'lchovlarini ajrating" },
    bin_a: { ru: 'короче суток', uz: 'sutkadan qisqa' },
    bin_b: { ru: 'длиннее суток', uz: 'sutkadan uzun' },
    items: [
      { n: { ru: 'час', uz: 'soat' }, a: true, hint: { ru: 'В сутках двадцать четыре часа.', uz: "Sutkada yigirma to'rt soat bor." } },
      { n: { ru: 'неделя', uz: 'hafta' }, a: false, hint: { ru: 'Неделя это семь суток.', uz: "Hafta bu yetti sutka." } },
      { n: { ru: 'минута', uz: 'daqiqa' }, a: true, hint: { ru: 'Минута совсем короткая.', uz: "Daqiqa juda qisqa." } },
      { n: { ru: 'месяц', uz: 'oy' }, a: false, hint: { ru: 'В месяце около тридцати суток.', uz: "Oyda taxminan o'ttiz sutka bor." } }
    ],
    audio: {
      intro: { ru: 'Четыре мерки времени. Сравни каждую с сутками.', uz: "To'rtta vaqt o'lchovi. Har birini sutka bilan solishtiring." },
      on_correct: { ru: 'Всё на месте. Сутки оказались посередине между минутой и годом.', uz: "Hammasi joyida. Sutka daqiqa bilan yil o'rtasida turdi." },
      on_wrong: { ru: 'Спроси себя, поместится ли эта мерка в одни сутки.', uz: "O'zingizdan so'rang, bu o'lchov bir sutkaga sig'adimi." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Сколько суток в 2 неделях?', uz: '2 haftada necha sutka bor?' },
    opts: [
      { ru: '14', uz: '14' },
      { ru: '9', uz: '9' },
      { ru: '27', uz: '27' },
      { ru: '30', uz: '30' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Девять это семь и два сложенные.', uz: "To'qqiz bu yetti va ikkining yig'indisi." },
      2: { ru: 'Числа не приписывают друг к другу.', uz: "Sonlar yonma-yon yozilmaydi." },
      3: { ru: 'Тридцать это примерно месяц, а не две недели.', uz: "O'ttiz bu taxminan bir oy, ikki hafta emas." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько суток в двух неделях?', uz: "Tez savol. Ikki haftada necha sutka bor?" },
      on_correct: { ru: 'Верно, два раза по семь.', uz: "To'g'ri, yettidan ikki marta." },
      on_wrong: { ru: 'В неделе семь суток, значит умножай на семь.', uz: "Haftada yetti sutka, demak yettiga ko'paytiring." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Поход начался 5-го и длился 9 дней', uz: "Sayohat 5-sanada boshlanib, 9 kun davom etdi" },
    swap_line: { ru: 'поход 9 дней', uz: 'sayohat 9 kun' },
    cells: [
      { head: { ru: 'полных недель', uz: "to'liq hafta" }, label: '9 : 7', ans: 1, hint: { ru: 'Сколько раз семь помещается в девяти.', uz: "Yetti to'qqizga necha marta sig'adi." } },
      { head: { ru: 'ещё суток', uz: 'yana sutka' }, label: { ru: 'остаток', uz: 'qoldiq' }, ans: 2, hint: { ru: 'Что осталось после одной недели.', uz: "Bitta haftadan keyin nima qoldi." } },
      { head: { ru: 'день окончания', uz: 'tugash sanasi' }, label: '5 + 9', ans: 14, hint: { ru: 'К началу прибавь длину похода.', uz: "Boshiga sayohat uzunligini qo'shing." } }
    ],
    check: { ru: '9 дней = 1 неделя и 2 дня', uz: '9 kun = 1 hafta va 2 kun' },
    check_label: { ru: 'недели и остаток', uz: 'haftalar va qoldiq' },
    audio: {
      intro: { ru: 'Заполни три окна. Полные недели, остаток суток и день окончания.', uz: "Uchta oynani to'ldiring. To'liq haftalar, qolgan sutkalar va tugash sanasi." },
      on_correct: { ru: 'Одна неделя и два дня, а закончится поход четырнадцатого.', uz: "Bir hafta va ikki kun, sayohat esa o'n to'rtinchi sanada tugaydi." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Записали: в году 12 недель. Где ошибка?', uz: "Yilda 12 hafta deb yozilibdi. Xato qayerda?" },
    fig_line: { ru: 'год = 12 …', uz: 'yil = 12 …' },
    opts: [
      { ru: 'в году 12 месяцев, а не недель', uz: 'yilda 12 oy, hafta emas' },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'в году 10 месяцев', uz: 'yilda 10 oy' },
      { ru: 'в неделе не 7 дней', uz: 'haftada 7 kun emas' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двенадцать недель это меньше трёх месяцев.', uz: "O'n ikki hafta bu uch oydan kam." },
      2: { ru: 'Месяцев в году именно двенадцать.', uz: "Yildagi oy aynan o'n ikkita." },
      3: { ru: 'В неделе как раз семь дней, это верно.', uz: "Haftada aynan yetti kun, bu to'g'ri." }
    },
    audio: {
      intro: { ru: 'Кто-то перепутал мерки года. Найди ошибку.', uz: "Kimdir yil o'lchovlarini chalkashtiribdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Двенадцать это месяцы. Недель в году больше пятидесяти.', uz: "To'g'ri. O'n ikki bu oylar. Yildagi hafta esa elliktadan ko'p." },
      on_wrong: { ru: 'Посчитай, сколько недель в одном месяце, и умножь.', uz: "Bir oyda nechta hafta borligini sanab, ko'paytiring." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит считает дни до праздника', uz: 'Bit bayramgacha kunlarni sanayapti' },
    lines: ['сегодня 10-е, праздник 30-го', 'Бит: в каждом месяце 30 дней, значит ждать 20'],
    lines_uz: ["bugun 10-sana, bayram 30-sanada", "Bit: har oyda 30 kun, demak 20 kun kutish kerak"],
    line_cap: { ru: 'Бит: месяц всегда одинаковый', uz: "Bit: oy har doim bir xil" },
    trap_label: { ru: 'Верна ли причина?', uz: 'Sabab to\'g\'rimi?' },
    trap_opts: { ru: ['нет, в месяцах разное число дней', 'да, в месяце всегда 30'], uz: ["yo'q, oylarda kun soni har xil", "ha, oyda har doim 30"] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Ответ Бит получил верный, а причина неверная. Дней до праздника ровно двадцать, но не потому, что в месяце тридцать дней, а потому, что из тридцатого вычли десятое. В феврале тридцатого числа вообще не бывает.', uz: "Ha. Bit javobni to'g'ri olibdi, sababi esa noto'g'ri. Bayramgacha rosa yigirma kun, lekin oyda o'ttiz kun bo'lgani uchun emas, o'ttizinchi sanadan o'ninchisi ayirilgani uchun. Fevralda o'ttizinchi sana umuman bo'lmaydi." },
    trap_wrong: { ru: 'Вспомни февраль. В нём двадцать восемь дней, и тридцатого числа нет вовсе.', uz: "Fevralni eslang. Unda yigirma sakkiz kun bor va o'ttizinchi sana umuman yo'q." },
    audio: {
      ru: [
        'Бит считает, сколько ждать до праздника.',
        'Сегодня десятое, праздник тридцатого. В каждом месяце тридцать дней, значит ждать двадцать.',
        'Верна ли причина?'
      ],
      uz: [
        "Bit bayramgacha qancha kutishni sanayapti.",
        "Bugun o'ninchi, bayram o'ttizinchi sanada. Har oyda o'ttiz kun, demak yigirma kun kutish kerak.",
        "Sabab to'g'rimi?"
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько суток в 4 неделях?', uz: '4 haftada necha sutka bor?' },
    ans: 28,
    check: '4 · 7',
    check_label: { ru: 'недели в сутки', uz: 'haftadan sutkaga' },
    hint: { ru: 'Умножь четыре на семь.', uz: "To'rtni yettiga ko'paytiring." },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько суток в четырёх неделях?', uz: "Endi o'zingiz hisoblang. To'rt haftada necha sutka bor?" },
      on_correct: { ru: 'Двадцать восемь суток, ровно как в феврале.', uz: "Yigirma sakkiz sutka, xuddi fevraldagidek." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Сколько часов в 2 сутках?', uz: '2 sutkada necha soat bor?' },
    ans: 48,
    check: '2 · 24',
    check_label: { ru: 'сутки в часы', uz: 'sutkadan soatga' },
    hint: { ru: 'В сутках двадцать четыре часа.', uz: "Sutkada yigirma to'rt soat bor." },
    audio: {
      intro: { ru: 'И ещё вопрос. Сколько часов в двух сутках?', uz: "Yana savol. Ikki sutkada necha soat bor?" },
      on_correct: { ru: 'Сорок восемь часов.', uz: "Qirq sakkiz soat." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Расписание экспедиции', uz: 'Ekspeditsiya jadvali' },
    q: { ru: 'Экспедиция длится 3 недели и ещё 4 дня. Сколько это суток и сколько часов в последних 4 днях?', uz: "Ekspeditsiya 3 hafta va yana 4 kun davom etadi. Bu necha sutka va oxirgi 4 kunda necha soat bor?" },
    q_speech: { ru: 'экспедиция длится три недели и ещё четыре дня. Сколько это суток и сколько часов в последних четырёх днях?', uz: "ekspeditsiya uch hafta va yana to'rt kun davom etadi. Bu necha sutka va oxirgi to'rt kunda necha soat bor?" },
    tbl_heads: [
      { ru: 'недели', uz: 'hafta' },
      { ru: 'дни', uz: 'kun' },
      { ru: 'вопрос', uz: 'savol' }
    ],
    tbl_cells: ['3', '4', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: 'перевести недели в сутки', uz: 'haftani sutkaga o\'tkazish' },
      { ru: 'сложить 3 и 4', uz: "3 va 4 ni qo'shish" },
      { ru: 'умножить 4 на 24', uz: "4 ni 24 ga ko'paytirish" },
      { ru: 'разделить 4 на 7', uz: "4 ni 7 ga bo'lish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Недели и дни это разные мерки, складывать их числа нельзя.', uz: "Hafta va kun har xil o'lchov, ularning sonini qo'shib bo'lmaydi." },
      2: { ru: 'Часы понадобятся во втором вопросе.', uz: "Soat ikkinchi savolda kerak bo'ladi." },
      3: { ru: 'Делить тут нечего.', uz: "Bu yerda bo'ladigan narsa yo'q." }
    },
    pick_ok: { ru: 'Верно. Сначала одна мерка, потом часы.', uz: "To'g'ri. Avval bitta o'lchov, keyin soatlar." },
    step1_q: { ru: 'Сколько всего суток длится экспедиция?', uz: 'Ekspeditsiya jami necha sutka davom etadi?' },
    ans1: 25,
    hint1: { ru: 'Три недели это двадцать один день, прибавь четыре.', uz: "Uch hafta bu yigirma bir kun, to'rtni qo'shing." },
    step2_q: { ru: 'Сколько часов в последних 4 днях?', uz: 'Oxirgi 4 kunda necha soat bor?' },
    ans2: 96,
    hint2: { ru: 'Четыре раза по двадцать четыре.', uz: "Yigirma to'rtdan to'rt marta." },
    check: { ru: '25 суток, 96 часов', uz: '25 sutka, 96 soat' },
    setup_audio: { ru: 'Экспедицию расписывают по дням. Посмотри на таблицу и реши, с чего начать.', uz: "Ekspeditsiya kunlab rejalashtirilmoqda. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Экспедиция три недели и ещё четыре дня. Сколько суток и сколько часов в последних четырёх днях?', uz: "Ekspeditsiya uch hafta va yana to'rt kun. Necha sutka va oxirgi to'rt kunda necha soat?" },
      on_correct: { ru: 'Двадцать пять суток, а в последних четырёх днях девяносто шесть часов.', uz: "Yigirma besh sutka, oxirgi to'rt kunda esa to'qson olti soat." },
      on_wrong: { ru: 'Сначала переведи недели в сутки.', uz: "Avval haftani sutkaga o'tkazing." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Помни, чем мерят', uz: "Uchta topshiriq. Nima bilan o'lchashni yodda tuting" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько месяцев в году?', uz: 'Yilda necha oy bor?' },
        q_speech: { ru: 'сколько месяцев в году?', uz: 'yilda necha oy bor?' },
        ans: 12,
        hint: { ru: 'Столько листов в настенном календаре.', uz: "Devoriy kalendarda shuncha varaq bor." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько суток в 5 неделях?', uz: '5 haftada necha sutka bor?' },
        q_speech: { ru: 'сколько суток в пяти неделях?', uz: 'besh haftada necha sutka bor?' },
        ans: 35,
        hint: { ru: 'Умножь пять на семь.', uz: "Beshni yettiga ko'paytiring." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько часов в 3 сутках?', uz: '3 sutkada necha soat bor?' },
        q_speech: { ru: 'сколько часов в трёх сутках?', uz: 'uch sutkada necha soat bor?' },
        ans: 72,
        hint: { ru: 'Три раза по двадцать четыре.', uz: "Yigirma to'rtdan uch marta." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Раз в четыре года февраль становится длиннее на день. Дело в том, что Земля обходит Солнце не ровно за 365 суток, а почти на шесть часов дольше. За четыре года эти часы складываются в целые сутки, и их добавляют в календарь.',
      uz: "To'rt yilda bir marta fevral bir kunga uzayadi. Gap shundaki, Yer Quyoshni rosa 365 sutkada emas, qariyb olti soat ko'proq vaqtda aylanadi. To'rt yilda bu soatlar butun sutkaga yig'iladi va uni kalendarga qo'shishadi."
    },
    fact_audio: {
      ru: 'Вот почему в календаре бывает лишний день. Земля обходит Солнце не ровно за триста шестьдесят пять суток, а почти на шесть часов дольше. Эти лишние часы никуда не деваются. За четыре года их набирается почти двадцать четыре, то есть целые сутки. Тогда в феврале появляется двадцать девятое число, и календарь снова сходится с небом.',
      uz: "Kalendarda ortiqcha kun mana nega paydo bo'ladi. Yer Quyoshni rosa uch yuz oltmish besh sutkada emas, qariyb olti soat ko'proq vaqtda aylanadi. Bu ortiqcha soatlar yo'qolmaydi. To'rt yilda ular qariyb yigirma to'rtta, ya'ni butun sutka bo'lib yig'iladi. Shunda fevralda yigirma to'qqizinchi sana paydo bo'ladi va kalendar yana osmon bilan mos tushadi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Мерки времени теперь разные.', uz: "Oxirida uchta topshiriq. Vaqt o'lchovlari endi har xil." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Вспомни, сколько частей в этой мерке.', uz: "Bu o'lchovda nechta qism borligini eslang." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Календарь прочитан!', uz: 'Kalendar o\'qildi!' },
    cando: {
      ru: ['перевожу недели в сутки', 'помню, что месяцы разной длины', 'считаю дни между датами'],
      uz: ["haftani sutkaga o'tkazaman", "oylar har xil uzunlikda ekanini bilaman", "sanalar orasidagi kunni sanayman"]
    },
    rule_recap: { ru: 'В сутках 24 часа, в неделе 7 суток, в году 12 месяцев, а дней в месяце по-разному.', uz: "Sutkada 24 soat, haftada 7 sutka, yilda 12 oy, oydagi kun soni esa har xil." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 43: час и минута; урок 19: деление с остатком', uz: "43-dars: soat va daqiqa; 19-dars: qoldiqli bo'lish" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'уравнения: равенство с неизвестным', uz: 'tenglama: noma\'lumli tenglik' },
    audio: {
      ru: 'Календарь прочитан. Запомни главное. В сутках двадцать четыре часа, в неделе семь суток, в году двенадцать месяцев. А вот дней в месяце бывает по-разному, и это единственная мерка времени, у которой нет постоянной длины. Поэтому дни между датами считают по самому календарю, а не по правилу тридцать. В следующий раз возьмём равенство, в котором одно число спрятано!',
      uz: "Kalendar o'qildi. Asosiysini eslab qoling. Sutkada yigirma to'rt soat, haftada yetti sutka, yilda o'n ikki oy bor. Oydagi kun soni esa har xil bo'ladi, bu uzunligi doimiy bo'lmagan yagona vaqt o'lchovi. Shuning uchun sanalar orasidagi kunlar o'ttiz qoidasi bilan emas, kalendarning o'zi bilan sanaladi. Keyingi safar bitta soni yashiringan tenglikni olamiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Раскроем одну клетку.', uz: 'Bitta katakni ochamiz.' },
  s2:  { ru: 'Теперь месяцы.', uz: 'Endi oylar.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай календарь.', uz: "Kalendarni o'qing." },
  s5:  { ru: 'Разложи мерки.', uz: "O'lchovlarni ajrating." },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут перепутали мерки года.', uz: "Bu yerda yil o'lchovlari chalkashibdi." },
  s9:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна мерка.', uz: "Yana bitta o'lchov." },
  s12: { ru: 'Задача от экспедиции.', uz: 'Ekspeditsiyadan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Календарь прочитан. Недели и месяцы встали по местам.',
  uz: "Kalendar o'qildi. Haftalar va oylar o'z o'rniga turdi."
};

// --- SAHNA TUGUNI (D45): 1-DARSNING shahri, ustiga kalendar varag'i.
const CalendarNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(140 96)">
      <rect x="0" y="0" width="120" height="86" rx="6" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      <rect x="0" y="0" width="120" height="16" rx="6" fill="#C06A2E"/>
      <text x="60" y="12" textAnchor="middle" fontSize="8" letterSpacing="1.4" fill="#FFF3E9" fontFamily="'JetBrains Mono', monospace">OY</text>
      {Array.from({ length: 4 }).map((_, r) => (
        Array.from({ length: 7 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={6 + c * 16} y={22 + r * 15} width="14" height="13" rx="2"
            fill={r === 1 && c === 3 ? '#FFD98A' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.7"/>
        ))
      ))}
      <text x="60" y="98" textAnchor="middle" fontSize="7" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? '1 неделя = 7 дней' : '1 hafta = 7 kun'}</text>
    </g>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <CalendarNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): uch qatorli kalendar bo'lagi.
const CalendarFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 110" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    {Array.from({ length: 3 }).map((_, r) => (
      Array.from({ length: 7 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={16 + c * 27} y={14 + r * 28} width="24" height="24" rx="3"
          fill="#EAF4FA" stroke="#7FA8BF" strokeWidth="1.2"/>
      ))
    ))}
    {Array.from({ length: 3 }).map((_, r) => (
      <text key={r} x="8" y={31 + r * 28} textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">{r + 1}</text>
    ))}
    <text x="110" y="106" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? '? суток' : '? sutka'}</text>
  </svg>
  );
};

// --- FACTCARD QAHRAMONI: Yer orbitasi va ortiqcha olti soat.
const LeapFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <ellipse cx="96" cy="52" rx="62" ry="34" fill="none" stroke="#7FA8BF" strokeWidth="1.8" strokeDasharray="5 4"/>
    <circle cx="96" cy="52" r="14" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.8"/>
    <circle cx="158" cy="52" r="7" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.6"/>
    <path d="M150 34 a30 22 0 0 1 -14 -12" fill="none" stroke="#C06A2E" strokeWidth="2" strokeLinecap="round"/>
    <g transform="translate(186 52)">
      <circle r="17" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      <line x1="0" y1="0" x2="0" y2="-11" stroke="#3A3530" strokeWidth="2.4" strokeLinecap="round"/>
      <line x1="0" y1="0" x2="8" y2="4" stroke="#C06A2E" strokeWidth="2" strokeLinecap="round"/>
      <text x="0" y="32" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">6</text>
    </g>
    <text x="96" y="100" textAnchor="middle" fontSize="8" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">365 + 6</text>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: LeapFig,
  figs: { s4: <CalendarFig/> }
});
