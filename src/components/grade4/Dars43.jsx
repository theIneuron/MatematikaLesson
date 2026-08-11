import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 43 · Tenglamani yechish va tekshirish
// 15 ekran · audio bilan sinxron kadrlar · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "equation-check-4-43-v1", slug: "dars43-tenglamalarni-yechish-va-tekshirish", lessonTitle: {"uz":"Tenglamalarni yechish va tekshirish","ru":"Решение уравнений с проверкой","en":"Solving and checking equations"}, skillTags: ["equation-solving","substitution","checking","inverse-operations"] };
const LESSON_REWARD_TITLE = {
  "uz": "Ildiz nazoratchisi",
  "ru": "Контролёр корней",
  "en": "Solution checker"
};
const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'test', template: 'MCScreen', scored: true, scope: 'final' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Uch nomzod",
      "ru": "Три кандидата",
      "en": "Three candidates"
    },
    "title": {
      "uz": "42 yoki 52?",
      "ru": "42 или 52?",
      "en": "42 or 52?"
    },
    "scene": "hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "x+158=210 tenglamasi berilgan.",
        "ru": "Дано уравнение x+158=210.",
        "en": "The equation x+158=210 is given."
      },
      {
        "uz": "42 yoki 52 dan qaysi biri ildiz?",
        "ru": "Какое число является корнем: 42 или 52?",
        "en": "Which number is the solution: 42 or 52?"
      },
      {
        "uz": "Faqat o'rniga qo'yib tekshirish javobni isbotlaydi.",
        "ru": "Только подстановка доказывает ответ.",
        "en": "Only substitution proves the answer."
      }
    ],
    "question": {
      "uz": "Tenglamaning ildizi qaysi?",
      "ru": "Каков корень уравнения?",
      "en": "What is the solution of the equation?"
    },
    "options": [
      {
        "uz": "42",
        "ru": "42",
        "en": "42"
      },
      {
        "uz": "52",
        "ru": "52",
        "en": "52"
      },
      {
        "uz": "368",
        "ru": "368",
        "en": "368"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Yechim va o'rniga qo'yish tekshiruvini ko'ramiz.",
      "ru": "Гипотеза сохранена. Рассмотрим решение и проверку подстановкой.",
      "en": "Estimate saved. We will examine solving and checking by substitution."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iks qo'shilgan bir yuz ellik sakkiz teng ikki yuz o'n tenglamasi berilgan.",
          "Qirq ikki yoki ellik ikkidan qaysi biri ildiz?",
          "Faqat o'rniga qo'yib tekshirish javobni isbotlaydi."
        ],
        "ru": [
          "Дано уравнение икс плюс сто пятьдесят восемь равно двести десять.",
          "Какое число является корнем: сорок два или пятьдесят два?",
          "Только подстановка доказывает ответ."
        ],
        "en": [
          "The equation x plus one hundred and fifty eight equals two hundred and ten is given.",
          "Which number is the solution: forty two or fifty two?",
          "Only substitution proves the answer."
        ]
      }
    },
    "correctIndex": 1
  },
  "s1": {
    "eyebrow": {
      "uz": "Tushuntirish 1/7",
      "ru": "Объяснение 1/7",
      "en": "Explanation 1/7"
    },
    "title": {
      "uz": "Tekshiruv nima qiladi?",
      "ru": "Что делает проверка?",
      "en": "What does checking do?"
    },
    "scene": "check",
    "frames": [
      {
        "uz": "Topilgan sonni x o'rniga qo'ying.",
        "ru": "Подставьте найденное число вместо x.",
        "en": "Substitute the number found for x."
      },
      {
        "uz": "Tenglamaning chap tomonini hisoblang.",
        "ru": "Вычислите левую часть уравнения.",
        "en": "Calculate the left-hand side."
      },
      {
        "uz": "Tenglamaning o'ng tomonini hisoblang.",
        "ru": "Вычислите правую часть уравнения.",
        "en": "Calculate the right-hand side."
      },
      {
        "uz": "Qiymatlar teng bo'lsa, ildiz to'g'ri.",
        "ru": "Если значения равны, корень верен.",
        "en": "If the values are equal, the solution is correct."
      }
    ],
    "audio": {
      "uz": [
        "Topilgan sonni iks o'rniga qo'ying.",
        "Tenglamaning chap tomonini hisoblang.",
        "Tenglamaning o'ng tomonini hisoblang.",
        "Qiymatlar teng bo'lsa, ildiz to'g'ri."
      ],
      "ru": [
        "Подставьте найденное число вместо икса.",
        "Вычислите левую часть уравнения.",
        "Вычислите правую часть уравнения.",
        "Если значения равны, корень верен."
      ],
      "en": [
        "Substitute the number found for x.",
        "Calculate the left-hand side.",
        "Calculate the right-hand side.",
        "If the values are equal, the solution is correct."
      ]
    }
  },
  "s2": {
    "eyebrow": {
      "uz": "Tushuntirish 2/7",
      "ru": "Объяснение 2/7",
      "en": "Explanation 2/7"
    },
    "title": {
      "uz": "x + 245 = 700",
      "ru": "x + 245 = 700",
      "en": "x + 245 = 700"
    },
    "scene": "add",
    "frames": [
      {
        "uz": "x + 245 = 700.",
        "ru": "x + 245 = 700.",
        "en": "x + 245 = 700."
      },
      {
        "uz": "x = 700 − 245.",
        "ru": "x = 700 − 245.",
        "en": "x = 700 − 245."
      },
      {
        "uz": "x = 455.",
        "ru": "x = 455.",
        "en": "x = 455."
      },
      {
        "uz": "455 + 245 = 700; demak 700 = 700.",
        "ru": "455 + 245 = 700; значит, 700 = 700.",
        "en": "455 + 245 = 700; therefore, 700 = 700."
      }
    ],
    "audio": {
      "uz": [
        "Iks qo'shilgan ikki yuz qirq besh teng yetti yuz.",
        "Iks teng yetti yuz ayirilgan ikki yuz qirq besh.",
        "Iks teng to'rt yuz ellik besh.",
        "To'rt yuz ellik besh qo'shilgan ikki yuz qirq besh teng yetti yuz, demak yetti yuz teng yetti yuz."
      ],
      "ru": [
        "Икс плюс двести сорок пять равно семьсот.",
        "Икс равно семьсот минус двести сорок пять.",
        "Икс равно четыреста пятьдесят пять.",
        "Четыреста пятьдесят пять плюс двести сорок пять равно семьсот, значит, семьсот равно семьсот."
      ],
      "en": [
        "X plus two hundred and forty five equals seven hundred.",
        "X equals seven hundred minus two hundred and forty five.",
        "X equals four hundred and fifty five.",
        "Four hundred and fifty five plus two hundred and forty five equals seven hundred, therefore, seven hundred equals seven hundred."
      ]
    }
  },
  "s3": {
    "eyebrow": {
      "uz": "Tushuntirish 3/7",
      "ru": "Объяснение 3/7",
      "en": "Explanation 3/7"
    },
    "title": {
      "uz": "900 − x = 376",
      "ru": "900 − x = 376",
      "en": "900 − x = 376"
    },
    "scene": "subtrahend",
    "frames": [
      {
        "uz": "900 − x = 376.",
        "ru": "900 − x = 376.",
        "en": "900 − x = 376."
      },
      {
        "uz": "x = 900 − 376.",
        "ru": "x = 900 − 376.",
        "en": "x = 900 − 376."
      },
      {
        "uz": "x = 524.",
        "ru": "x = 524.",
        "en": "x = 524."
      },
      {
        "uz": "900 − 524 = 376; demak 376 = 376.",
        "ru": "900 − 524 = 376; значит, 376 = 376.",
        "en": "900 − 524 = 376; therefore, 376 = 376."
      }
    ],
    "audio": {
      "uz": [
        "To'qqiz yuz ayirilgan iks teng uch yuz yetmish olti.",
        "Iks teng to'qqiz yuz ayirilgan uch yuz yetmish olti.",
        "Iks teng besh yuz yigirma to'rt.",
        "To'qqiz yuz ayirilgan besh yuz yigirma to'rt teng uch yuz yetmish olti, demak uch yuz yetmish olti teng uch yuz yetmish olti."
      ],
      "ru": [
        "Девятьсот минус икс равно триста семьдесят шесть.",
        "Икс равно девятьсот минус триста семьдесят шесть.",
        "Икс равно пятьсот двадцать четыре.",
        "Девятьсот минус пятьсот двадцать четыре равно триста семьдесят шесть, значит, триста семьдесят шесть равно триста семьдесят шесть."
      ],
      "en": [
        "Nine hundred minus x equals three hundred and seventy six.",
        "X equals nine hundred minus three hundred and seventy six.",
        "X equals five hundred and twenty four.",
        "Nine hundred minus five hundred and twenty four equals three hundred and seventy six, therefore, three hundred and seventy six equals three hundred and seventy six."
      ]
    }
  },
  "s4": {
    "eyebrow": {
      "uz": "Tushuntirish 4/7",
      "ru": "Объяснение 4/7",
      "en": "Explanation 4/7"
    },
    "title": {
      "uz": "x − 268 = 457",
      "ru": "x − 268 = 457",
      "en": "x − 268 = 457"
    },
    "scene": "minuend",
    "frames": [
      {
        "uz": "x − 268 = 457.",
        "ru": "x − 268 = 457.",
        "en": "x − 268 = 457."
      },
      {
        "uz": "x = 457 + 268.",
        "ru": "x = 457 + 268.",
        "en": "x = 457 + 268."
      },
      {
        "uz": "x = 725.",
        "ru": "x = 725.",
        "en": "x = 725."
      },
      {
        "uz": "725 − 268 = 457; demak 457 = 457.",
        "ru": "725 − 268 = 457; значит, 457 = 457.",
        "en": "725 − 268 = 457; therefore, 457 = 457."
      }
    ],
    "audio": {
      "uz": [
        "Iks ayirilgan ikki yuz oltmish sakkiz teng to'rt yuz ellik yetti.",
        "Iks teng to'rt yuz ellik yetti qo'shilgan ikki yuz oltmish sakkiz.",
        "Iks teng yetti yuz yigirma besh.",
        "Yetti yuz yigirma besh ayirilgan ikki yuz oltmish sakkiz teng to'rt yuz ellik yetti, demak to'rt yuz ellik yetti teng to'rt yuz ellik yetti."
      ],
      "ru": [
        "Икс минус двести шестьдесят восемь равно четыреста пятьдесят семь.",
        "Икс равно четыреста пятьдесят семь плюс двести шестьдесят восемь.",
        "Икс равно семьсот двадцать пять.",
        "Семьсот двадцать пять минус двести шестьдесят восемь равно четыреста пятьдесят семь, значит, четыреста пятьдесят семь равно четыреста пятьдесят семь."
      ],
      "en": [
        "X minus two hundred and sixty eight equals four hundred and fifty seven.",
        "X equals four hundred and fifty seven plus two hundred and sixty eight.",
        "X equals seven hundred and twenty five.",
        "Seven hundred and twenty five minus two hundred and sixty eight equals four hundred and fifty seven. Both sides are equal."
      ]
    }
  },
  "s5": {
    "eyebrow": {
      "uz": "Tushuntirish 5/7",
      "ru": "Объяснение 5/7",
      "en": "Explanation 5/7"
    },
    "title": {
      "uz": "8x=376",
      "ru": "8x=376",
      "en": "8x=376"
    },
    "scene": "multiply",
    "frames": [
      {
        "uz": "8x = 376.",
        "ru": "8x = 376.",
        "en": "8x = 376."
      },
      {
        "uz": "x = 376 ÷ 8.",
        "ru": "x = 376 ÷ 8.",
        "en": "x = 376 ÷ 8."
      },
      {
        "uz": "x = 47.",
        "ru": "x = 47.",
        "en": "x = 47."
      },
      {
        "uz": "47 × 8 = 376; demak 376 = 376.",
        "ru": "47 × 8 = 376; значит, 376 = 376.",
        "en": "47 × 8 = 376; therefore, 376 = 376."
      }
    ],
    "audio": {
      "uz": [
        "Sakkiz karra iks teng uch yuz yetmish olti.",
        "Iks teng uch yuz yetmish olti bo'lingan sakkiz.",
        "Iks teng qirq yetti.",
        "Qirq yetti karra sakkiz teng uch yuz yetmish olti, demak uch yuz yetmish olti teng uch yuz yetmish olti."
      ],
      "ru": [
        "Восемь умножить на икс равно триста семьдесят шесть.",
        "Икс равно триста семьдесят шесть разделить на восемь.",
        "Икс равно сорок семь.",
        "Сорок семь умножить на восемь равно триста семьдесят шесть, значит, триста семьдесят шесть равно триста семьдесят шесть."
      ],
      "en": [
        "Eight multiplied by x equals three hundred and seventy six.",
        "X equals three hundred and seventy six divided by eight.",
        "X equals forty seven.",
        "Forty seven multiplied by eight equals three hundred and seventy six, therefore, three hundred and seventy six equals three hundred and seventy six."
      ]
    }
  },
  "s6": {
    "eyebrow": {
      "uz": "Tushuntirish 6/7",
      "ru": "Объяснение 6/7",
      "en": "Explanation 6/7"
    },
    "title": {
      "uz": "Bo'lishning ikki ko'rinishi",
      "ru": "Два вида деления",
      "en": "Two division forms"
    },
    "scene": "division",
    "frames": [
      {
        "uz": "x ÷ 9 = 64 bo'lsa, x = 64 × 9.",
        "ru": "Если x ÷ 9 = 64, то x = 64 × 9.",
        "en": "If x ÷ 9 = 64, then x = 64 × 9."
      },
      {
        "uz": "Shuning uchun x = 576.",
        "ru": "Поэтому x = 576.",
        "en": "Therefore, x = 576."
      },
      {
        "uz": "864 ÷ x = 12 bo'lsa, x = 864 ÷ 12.",
        "ru": "Если 864 ÷ x = 12, то x = 864 ÷ 12.",
        "en": "If 864 ÷ x = 12, then x = 864 ÷ 12."
      },
      {
        "uz": "Shuning uchun x = 72.",
        "ru": "Поэтому x = 72.",
        "en": "Therefore, x = 72."
      }
    ],
    "audio": {
      "uz": [
        "Iks bo'lingan to'qqiz teng oltmish to'rt bo'lsa, iks teng oltmish to'rt karra to'qqiz.",
        "Shuning uchun iks teng besh yuz yetmish olti.",
        "Sakkiz yuz oltmish to'rt bo'lingan iks teng o'n ikki bo'lsa, iks teng sakkiz yuz oltmish to'rt bo'lingan o'n ikki.",
        "Shuning uchun iks teng yetmish ikki."
      ],
      "ru": [
        "Если при делении икса на девять получается шестьдесят четыре, то икс равен произведению шестидесяти четырёх и девяти.",
        "Поэтому икс равен пятистам семидесяти шести.",
        "Если при делении восьмисот шестидесяти четырёх на икс получается двенадцать, то икс равен восьмистам шестидесяти четырём, делённым на двенадцать.",
        "Поэтому икс равен семидесяти двум."
      ],
      "en": [
        "If x divided by nine equals sixty four, then x equals sixty four multiplied by nine.",
        "Therefore, x equals five hundred and seventy six.",
        "If eight hundred and sixty four divided by x equals twelve, then x equals eight hundred and sixty four divided by twelve.",
        "Therefore, x equals seventy two."
      ]
    }
  },
  "s7": {
    "eyebrow": {
      "uz": "Tushuntirish 7/7",
      "ru": "Объяснение 7/7",
      "en": "Explanation 7/7"
    },
    "title": {
      "uz": "Yechim va tekshiruv protokoli",
      "ru": "Протокол решения и проверки",
      "en": "Solve-and-check protocol"
    },
    "scene": "algorithm",
    "frames": [
      {
        "uz": "Noma'lum komponentni nomlang.",
        "ru": "Назовите неизвестный компонент.",
        "en": "Name the unknown component."
      },
      {
        "uz": "Tenglama ildizini toping.",
        "ru": "Найдите корень уравнения.",
        "en": "Find the solution of the equation."
      },
      {
        "uz": "Ildizni x o'rniga qo'ying.",
        "ru": "Подставьте корень вместо x.",
        "en": "Substitute the solution for x."
      },
      {
        "uz": "Chap va o'ng tomonlarni alohida hisoblang.",
        "ru": "Отдельно вычислите левую и правую части.",
        "en": "Calculate the left and right sides separately."
      },
      {
        "uz": "x = 52; 52 + 158 = 210. 42 mos emas.",
        "ru": "x = 52; 52 + 158 = 210. Число 42 не подходит.",
        "en": "x = 52; 52 + 158 = 210. 42 does not work."
      }
    ],
    "audio": {
      "uz": [
        "Noma'lum komponentni nomlang.",
        "Tenglama ildizini toping.",
        "Ildizni iks o'rniga qo'ying.",
        "Chap va o'ng tomonlarni alohida hisoblang.",
        "Demak iks ellik ikkiga teng; ellik ikkiga bir yuz ellik sakkizni qo'shsak, ikki yuz o'n chiqadi, qirq ikki esa tenglamani rost qilmaydi."
      ],
      "ru": [
        "Назовите неизвестный компонент.",
        "Найдите корень уравнения.",
        "Подставьте корень вместо икса.",
        "Отдельно вычислите левую и правую части.",
        "Итак, икс равен пятидесяти двум; пятьдесят два плюс сто пятьдесят восемь равно двумстам десяти, а сорок два уравнению не подходит."
      ],
      "en": [
        "Name the unknown component.",
        "Find the solution of the equation.",
        "Substitute the solution for x.",
        "Calculate the left and right sides separately.",
        "Therefore, x equals fifty two; fifty two plus one hundred and fifty eight equals two hundred and ten, while forty two does not satisfy the equation."
      ]
    }
  },
  "s8": {
    "eyebrow": {
      "uz": "Mashq 1/6",
      "ru": "Задание 1/6",
      "en": "Task 1/6"
    },
    "title": {
      "uz": "x+245=700",
      "ru": "x+245=700",
      "en": "x+245=700"
    },
    "scene": "substitution-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "x + 245 = 700 tenglamasining ildizi 455.",
        "ru": "Корень уравнения x + 245 = 700 равен 455.",
        "en": "The solution of x + 245 = 700 is 455."
      },
      {
        "uz": "To'g'ri tekshiruvni tanlang.",
        "ru": "Выберите правильную проверку.",
        "en": "Choose the correct check."
      }
    ],
    "question": {
      "uz": "Qaysi almashtirish ildizni tasdiqlaydi?",
      "ru": "Какая подстановка подтверждает корень?",
      "en": "Which substitution confirms the solution?"
    },
    "options": [
      {
        "uz": "455 + 245 = 700",
        "ru": "455 + 245 = 700",
        "en": "455 + 245 = 700"
      },
      {
        "uz": "455 − 245 = 700",
        "ru": "455 − 245 = 700",
        "en": "455 − 245 = 700"
      },
      {
        "uz": "700 + 245 = 455",
        "ru": "700 + 245 = 455",
        "en": "700 + 245 = 455"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "455 + 245 = 700 tengligi x = 455 ildizni tasdiqlaydi.",
      "ru": "Равенство 455 + 245 = 700 подтверждает корень x = 455.",
      "en": "The equality 455 + 245 = 700 confirms the solution x = 455."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iksga ikki yuz qirq besh qo'shilsa, yetti yuz chiqadigan tenglama berilgan.",
          "Ildizni tasdiqlaydigan o'rniga qo'yishni tanlang."
        ],
        "ru": [
          "Дано уравнение: икс плюс двести сорок пять равно семистам.",
          "Выберите подстановку, которая подтверждает корень."
        ],
        "en": [
          "The equation x plus two hundred and forty five equals seven hundred is given.",
          "Choose the substitution that confirms the solution."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rt yuz ellik beshga ikki yuz qirq beshni qo'shsak, yetti yuz chiqadi. Demak iks teng to'rt yuz ellik besh.",
        "ru": "Верно. К четырёмстам пятидесяти пяти прибавляем двести сорок пять и получаем семьсот. Значит, икс равен четырёмстам пятидесяти пяти.",
        "en": "Correct. Four hundred and fifty five plus two hundred and forty five is seven hundred. Therefore, x equals four hundred and fifty five."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'rt yuz ellik beshga ikki yuz qirq beshni qo'shsak, yetti yuz chiqadi. Demak iks teng to'rt yuz ellik besh.",
          "ru": "Верно. К четырёмстам пятидесяти пяти прибавляем двести сорок пять и получаем семьсот. Значит, икс равен четырёмстам пятидесяти пяти.",
          "en": "Correct. Four hundred and fifty five plus two hundred and forty five is seven hundred. Therefore, x equals four hundred and fifty five."
        },
        {
          "uz": "Yana bir qarang: Boshlang'ich tenglamada iksga ikki yuz qirq besh qo'shilgan. Iks o'rniga to'rt yuz ellik besh qo'yilganda ham amal qo'shish bo'lib qoladi.",
          "ru": "Посмотрите ещё раз: В исходном уравнении к иксу прибавляют двести сорок пять. После подстановки четырёхсот пятидесяти пяти действие остаётся сложением.",
          "en": "Look again: The original equation adds two hundred and forty-five to x. After substituting four hundred and fifty-five, the operation must still be addition."
        },
        {
          "uz": "Yana bir qarang: Yetti yuz tenglamaning o'ng tomonidagi natija, iks o'rniga qo'yiladigan son emas. Chap tomonda to'rt yuz ellik beshga ikki yuz qirq beshni qo'shing.",
          "ru": "Посмотрите ещё раз: Семьсот является значением правой части, а не числом для подстановки вместо икса. Слева сложите четыреста пятьдесят пять и двести сорок пять.",
          "en": "Look again: Seven hundred is the right-side result, not the value substituted for x. Add four hundred and fifty-five and two hundred and forty-five on the left."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'rt yuz ellik beshga ikki yuz qirq beshni qo'shsak, yetti yuz chiqadi. Demak iks teng to'rt yuz ellik besh.",
        "ru": "Верно. К четырёмстам пятидесяти пяти прибавляем двести сорок пять и получаем семьсот. Значит, икс равен четырёмстам пятидесяти пяти.",
        "en": "Correct. Four hundred and fifty five plus two hundred and forty five is seven hundred. Therefore, x equals four hundred and fifty five."
      },
      {
        "uz": "Yana bir qarang: Boshlang'ich tenglamada iksga ikki yuz qirq besh qo'shilgan. Iks o'rniga to'rt yuz ellik besh qo'yilganda ham amal qo'shish bo'lib qoladi.",
        "ru": "Посмотрите ещё раз: В исходном уравнении к иксу прибавляют двести сорок пять. После подстановки четырёхсот пятидесяти пяти действие остаётся сложением.",
        "en": "Look again: The original equation adds two hundred and forty-five to x. After substituting four hundred and fifty-five, the operation must still be addition."
      },
      {
        "uz": "Yana bir qarang: Yetti yuz tenglamaning o'ng tomonidagi natija, iks o'rniga qo'yiladigan son emas. Chap tomonda to'rt yuz ellik beshga ikki yuz qirq beshni qo'shing.",
        "ru": "Посмотрите ещё раз: Семьсот является значением правой части, а не числом для подстановки вместо икса. Слева сложите четыреста пятьдесят пять и двести сорок пять.",
        "en": "Look again: Seven hundred is the right-side result, not the value substituted for x. Add four hundred and fifty-five and two hundred and forty-five on the left."
      }
    ]
  },
  "s9": {
    "eyebrow": {
      "uz": "Mashq 2/6",
      "ru": "Задание 2/6",
      "en": "Task 2/6"
    },
    "title": {
      "uz": "900-x=376",
      "ru": "900-x=376",
      "en": "900-x=376"
    },
    "scene": "subtrahend-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "900 − x = 376 tenglamasi berilgan.",
        "ru": "Дано уравнение 900 − x = 376.",
        "en": "The equation 900 − x = 376 is given."
      },
      {
        "uz": "Noma'lum ayiriluvchini topib tekshiring.",
        "ru": "Найдите неизвестное вычитаемое и проверьте.",
        "en": "Find the unknown subtrahend and check it."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "524",
        "ru": "524",
        "en": "524"
      },
      {
        "uz": "1 276",
        "ru": "1 276",
        "en": "1,276"
      },
      {
        "uz": "476",
        "ru": "476",
        "en": "476"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "x = 900 − 376 = 524; tekshiruvda 900 − 524 = 376.",
      "ru": "x = 900 − 376 = 524; при проверке 900 − 524 = 376.",
      "en": "x = 900 − 376 = 524; the check gives 900 − 524 = 376."
    },
    "audio": {
      "intro": {
        "uz": [
          "To'qqiz yuz ayirilgan iks teng uch yuz yetmish olti tenglamasi berilgan.",
          "Noma'lum ayiriluvchini topib tekshiring."
        ],
        "ru": [
          "Дано уравнение девятьсот минус икс равно триста семьдесят шесть.",
          "Найдите неизвестное вычитаемое и проверьте."
        ],
        "en": [
          "The equation nine hundred minus x equals three hundred and seventy six is given.",
          "Find the unknown subtrahend and check it."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'qqiz yuzdan besh yuz yigirma to'rt ayirilsa, uch yuz yetmish olti chiqadi. Demak ildiz besh yuz yigirma to'rt.",
        "ru": "Верно. Из девятисот вычитаем пятьсот двадцать четыре и получаем триста семьдесят шесть. Значит, икс равен пятистам двадцати четырём.",
        "en": "Correct. Nine hundred minus five hundred and twenty four equals three hundred and seventy six. Therefore, x equals five hundred and twenty four."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'qqiz yuzdan besh yuz yigirma to'rt ayirilsa, uch yuz yetmish olti chiqadi. Demak ildiz besh yuz yigirma to'rt.",
          "ru": "Верно. Из девятисот вычитаем пятьсот двадцать четыре и получаем триста семьдесят шесть. Значит, икс равен пятистам двадцати четырём.",
          "en": "Correct. Nine hundred minus five hundred and twenty four equals three hundred and seventy six. Therefore, x equals five hundred and twenty four."
        },
        {
          "uz": "Yana bir qarang: Bir ming ikki yuz yetmish olti to'qqiz yuz bilan uch yuz yetmish oltini qo'shishdan chiqadi. Noma'lum ayiriluvchini ayirish bilan toping.",
          "ru": "Посмотрите ещё раз: Одна тысяча двести семьдесят шесть получается при сложении девятисот и трёхсот семидесяти шести. Неизвестное вычитаемое находят вычитанием.",
          "en": "Look again: One thousand two hundred and seventy-six comes from adding nine hundred and three hundred and seventy-six. Find the unknown subtrahend by subtraction."
        },
        {
          "uz": "Yana bir qarang: To'rt yuz yetmish oltini tekshirsak, to'qqiz yuzdan ayirilganda to'rt yuz yigirma to'rt chiqadi. Tenglamadagi natija uch yuz yetmish olti.",
          "ru": "Посмотрите ещё раз: При проверке четырёхсот семидесяти шести из девятисот получается четыреста двадцать четыре. В уравнении должен получиться результат триста семьдесят шесть.",
          "en": "Look again: Checking four hundred and seventy-six gives four hundred and twenty-four when subtracted from nine hundred. The equation requires three hundred and seventy-six."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'qqiz yuzdan besh yuz yigirma to'rt ayirilsa, uch yuz yetmish olti chiqadi. Demak ildiz besh yuz yigirma to'rt.",
        "ru": "Верно. Из девятисот вычитаем пятьсот двадцать четыре и получаем триста семьдесят шесть. Значит, икс равен пятистам двадцати четырём.",
        "en": "Correct. Nine hundred minus five hundred and twenty four equals three hundred and seventy six. Therefore, x equals five hundred and twenty four."
      },
      {
        "uz": "Yana bir qarang: Bir ming ikki yuz yetmish olti to'qqiz yuz bilan uch yuz yetmish oltini qo'shishdan chiqadi. Noma'lum ayiriluvchini ayirish bilan toping.",
        "ru": "Посмотрите ещё раз: Одна тысяча двести семьдесят шесть получается при сложении девятисот и трёхсот семидесяти шести. Неизвестное вычитаемое находят вычитанием.",
        "en": "Look again: One thousand two hundred and seventy-six comes from adding nine hundred and three hundred and seventy-six. Find the unknown subtrahend by subtraction."
      },
      {
        "uz": "Yana bir qarang: To'rt yuz yetmish oltini tekshirsak, to'qqiz yuzdan ayirilganda to'rt yuz yigirma to'rt chiqadi. Tenglamadagi natija uch yuz yetmish olti.",
        "ru": "Посмотрите ещё раз: При проверке четырёхсот семидесяти шести из девятисот получается четыреста двадцать четыре. В уравнении должен получиться результат триста семьдесят шесть.",
        "en": "Look again: Checking four hundred and seventy-six gives four hundred and twenty-four when subtracted from nine hundred. The equation requires three hundred and seventy-six."
      }
    ]
  },
  "s10": {
    "eyebrow": {
      "uz": "Mashq 3/6",
      "ru": "Задание 3/6",
      "en": "Task 3/6"
    },
    "title": {
      "uz": "x-268=457",
      "ru": "x-268=457",
      "en": "x-268=457"
    },
    "scene": "minuend-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "x − 268 = 457 tenglamasi berilgan.",
        "ru": "Дано уравнение x − 268 = 457.",
        "en": "The equation x − 268 = 457 is given."
      },
      {
        "uz": "Noma'lum kamayuvchini topib tekshiring.",
        "ru": "Найдите неизвестное уменьшаемое и проверьте.",
        "en": "Find the unknown minuend and check it."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "189",
        "ru": "189",
        "en": "189"
      },
      {
        "uz": "725",
        "ru": "725",
        "en": "725"
      },
      {
        "uz": "625",
        "ru": "625",
        "en": "625"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "x = 457 + 268 = 725; tekshiruvda 725 − 268 = 457.",
      "ru": "x = 457 + 268 = 725; при проверке 725 − 268 = 457.",
      "en": "x = 457 + 268 = 725; the check gives 725 − 268 = 457."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iks ayirilgan ikki yuz oltmish sakkiz teng to'rt yuz ellik yetti tenglamasi berilgan.",
          "Noma'lum kamayuvchini topib tekshiring."
        ],
        "ru": [
          "Дано уравнение икс минус двести шестьдесят восемь равно четыреста пятьдесят семь.",
          "Найдите неизвестное уменьшаемое и проверьте."
        ],
        "en": [
          "The equation x minus two hundred and sixty eight equals four hundred and fifty seven is given.",
          "Find the unknown minuend and check it."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Yetti yuz yigirma beshdan ikki yuz oltmish sakkiz ayirilsa, to'rt yuz ellik yetti chiqadi. Demak iks yetti yuz yigirma besh.",
        "ru": "Верно. Из семисот двадцати пяти вычитаем двести шестьдесят восемь и получаем четыреста пятьдесят семь. Значит, икс равен семистам двадцати пяти.",
        "en": "Correct. Seven hundred and twenty five minus two hundred and sixty eight equals four hundred and fifty seven. Therefore, x equals seven hundred and twenty five."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Bir yuz sakson to'qqiz ma'lum sonlarni ayirishdan chiqadi, ammo iks kamayuvchi. Kamayuvchini topish uchun to'rt yuz ellik yetti va ikki yuz oltmish sakkizni qo'shing.",
          "ru": "Посмотрите ещё раз: Сто восемьдесят девять получается при вычитании известных чисел, но икс является уменьшаемым. Сложите четыреста пятьдесят семь и двести шестьдесят восемь.",
          "en": "Look again: One hundred and eighty-nine comes from subtracting the known numbers, but x is the minuend. Add four hundred and fifty-seven and two hundred and sixty-eight."
        },
        {
          "uz": "To'g'ri. Yetti yuz yigirma beshdan ikki yuz oltmish sakkiz ayirilsa, to'rt yuz ellik yetti chiqadi. Demak iks yetti yuz yigirma besh.",
          "ru": "Верно. Из семисот двадцати пяти вычитаем двести шестьдесят восемь и получаем четыреста пятьдесят семь. Значит, икс равен семистам двадцати пяти.",
          "en": "Correct. Seven hundred and twenty five minus two hundred and sixty eight equals four hundred and fifty seven. Therefore, x equals seven hundred and twenty five."
        },
        {
          "uz": "Yana bir qarang: Olti yuz yigirma beshdan ikki yuz oltmish sakkiz ayirilsa, uch yuz ellik yetti chiqadi, to'rt yuz ellik yetti emas. Iks yetti yuz yigirma besh.",
          "ru": "Посмотрите ещё раз: Шестьсот двадцать пять минус двести шестьдесят восемь равно триста пятьдесят семь, а не четыреста пятьдесят семь. Икс равен семистам двадцати пяти.",
          "en": "Look again: Six hundred and twenty-five minus two hundred and sixty-eight is three hundred and fifty-seven, not four hundred and fifty-seven. The solution is seven hundred and twenty-five."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Bir yuz sakson to'qqiz ma'lum sonlarni ayirishdan chiqadi, ammo iks kamayuvchi. Kamayuvchini topish uchun to'rt yuz ellik yetti va ikki yuz oltmish sakkizni qo'shing.",
        "ru": "Посмотрите ещё раз: Сто восемьдесят девять получается при вычитании известных чисел, но икс является уменьшаемым. Сложите четыреста пятьдесят семь и двести шестьдесят восемь.",
        "en": "Look again: One hundred and eighty-nine comes from subtracting the known numbers, but x is the minuend. Add four hundred and fifty-seven and two hundred and sixty-eight."
      },
      {
        "uz": "To'g'ri. Yetti yuz yigirma beshdan ikki yuz oltmish sakkiz ayirilsa, to'rt yuz ellik yetti chiqadi. Demak iks yetti yuz yigirma besh.",
        "ru": "Верно. Из семисот двадцати пяти вычитаем двести шестьдесят восемь и получаем четыреста пятьдесят семь. Значит, икс равен семистам двадцати пяти.",
        "en": "Correct. Seven hundred and twenty five minus two hundred and sixty eight equals four hundred and fifty seven. Therefore, x equals seven hundred and twenty five."
      },
      {
        "uz": "Yana bir qarang: Olti yuz yigirma beshdan ikki yuz oltmish sakkiz ayirilsa, uch yuz ellik yetti chiqadi, to'rt yuz ellik yetti emas. Iks yetti yuz yigirma besh.",
        "ru": "Посмотрите ещё раз: Шестьсот двадцать пять минус двести шестьдесят восемь равно триста пятьдесят семь, а не четыреста пятьдесят семь. Икс равен семистам двадцати пяти.",
        "en": "Look again: Six hundred and twenty-five minus two hundred and sixty-eight is three hundred and fifty-seven, not four hundred and fifty-seven. The solution is seven hundred and twenty-five."
      }
    ]
  },
  "s11": {
    "eyebrow": {
      "uz": "Mashq 4/6",
      "ru": "Задание 4/6",
      "en": "Task 4/6"
    },
    "title": {
      "uz": "8x=376",
      "ru": "8x=376",
      "en": "8x=376"
    },
    "scene": "factor-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "8x = 376 tenglamasi berilgan.",
        "ru": "Дано уравнение 8x = 376.",
        "en": "The equation 8x = 376 is given."
      },
      {
        "uz": "Noma'lum ko'paytuvchini topib tekshiring.",
        "ru": "Найдите неизвестный множитель и проверьте.",
        "en": "Find the unknown factor and check it."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "47",
        "ru": "47",
        "en": "47"
      },
      {
        "uz": "48",
        "ru": "48",
        "en": "48"
      },
      {
        "uz": "368",
        "ru": "368",
        "en": "368"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "x = 376 ÷ 8 = 47; tekshiruvda 47 × 8 = 376.",
      "ru": "x = 376 ÷ 8 = 47; при проверке 47 × 8 = 376.",
      "en": "x = 376 ÷ 8 = 47; the check gives 47 × 8 = 376."
    },
    "audio": {
      "intro": {
        "uz": [
          "Sakkiz karra iks teng uch yuz yetmish olti tenglamasi berilgan.",
          "Noma'lum ko'paytuvchini topib tekshiring."
        ],
        "ru": [
          "Дано уравнение восемь умножить на икс равно триста семьдесят шесть.",
          "Найдите неизвестный множитель и проверьте."
        ],
        "en": [
          "The equation eight multiplied by x equals three hundred and seventy six is given.",
          "Find the unknown factor and check it."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Uch yuz yetmish oltini sakkizga bo'lsak, qirq yetti chiqadi. Qirq yetti karra sakkiz uch yuz yetmish oltini qaytaradi.",
        "ru": "Верно. Триста семьдесят шесть разделить на восемь равно сорок семь. При проверке сорок семь умножить на восемь равно триста семьдесят шесть.",
        "en": "Correct. Three hundred and seventy six divided by eight is forty seven. Forty seven multiplied by eight returns three hundred and seventy six."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Uch yuz yetmish oltini sakkizga bo'lsak, qirq yetti chiqadi. Qirq yetti karra sakkiz uch yuz yetmish oltini qaytaradi.",
          "ru": "Верно. Триста семьдесят шесть разделить на восемь равно сорок семь. При проверке сорок семь умножить на восемь равно триста семьдесят шесть.",
          "en": "Correct. Three hundred and seventy six divided by eight is forty seven. Forty seven multiplied by eight returns three hundred and seventy six."
        },
        {
          "uz": "Yana bir qarang: Qirq sakkizni tekshirsak, sakkizga ko'paytirganda uch yuz sakson to'rt chiqadi. Uch yuz yetmish olti uchun iks qirq yetti.",
          "ru": "Посмотрите ещё раз: Проверка числа сорок восемь даёт триста восемьдесят четыре при умножении на восемь. Для трёхсот семидесяти шести икс равен сорока семи.",
          "en": "Look again: Checking forty-eight gives three hundred and eighty-four when multiplied by eight. For three hundred and seventy-six, x is forty-seven."
        },
        {
          "uz": "Yana bir qarang: Uch yuz oltmish sakkiz uch yuz yetmish oltidan sakkizni ayirishdan chiqadi, ammo iks ko'paytuvchi. Ko'paytmani sakkizga bo'ling.",
          "ru": "Посмотрите ещё раз: Триста шестьдесят восемь получается при вычитании восьми из трёхсот семидесяти шести, но икс является множителем. Разделите произведение на восемь.",
          "en": "Look again: Three hundred and sixty-eight comes from subtracting eight from three hundred and seventy-six, but x is a factor. Divide the product by eight."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Uch yuz yetmish oltini sakkizga bo'lsak, qirq yetti chiqadi. Qirq yetti karra sakkiz uch yuz yetmish oltini qaytaradi.",
        "ru": "Верно. Триста семьдесят шесть разделить на восемь равно сорок семь. При проверке сорок семь умножить на восемь равно триста семьдесят шесть.",
        "en": "Correct. Three hundred and seventy six divided by eight is forty seven. Forty seven multiplied by eight returns three hundred and seventy six."
      },
      {
        "uz": "Yana bir qarang: Qirq sakkizni tekshirsak, sakkizga ko'paytirganda uch yuz sakson to'rt chiqadi. Uch yuz yetmish olti uchun iks qirq yetti.",
        "ru": "Посмотрите ещё раз: Проверка числа сорок восемь даёт триста восемьдесят четыре при умножении на восемь. Для трёхсот семидесяти шести икс равен сорока семи.",
        "en": "Look again: Checking forty-eight gives three hundred and eighty-four when multiplied by eight. For three hundred and seventy-six, x is forty-seven."
      },
      {
        "uz": "Yana bir qarang: Uch yuz oltmish sakkiz uch yuz yetmish oltidan sakkizni ayirishdan chiqadi, ammo iks ko'paytuvchi. Ko'paytmani sakkizga bo'ling.",
        "ru": "Посмотрите ещё раз: Триста шестьдесят восемь получается при вычитании восьми из трёхсот семидесяти шести, но икс является множителем. Разделите произведение на восемь.",
        "en": "Look again: Three hundred and sixty-eight comes from subtracting eight from three hundred and seventy-six, but x is a factor. Divide the product by eight."
      }
    ]
  },
  "s12": {
    "eyebrow": {
      "uz": "Mashq 5/6",
      "ru": "Задание 5/6",
      "en": "Task 5/6"
    },
    "title": {
      "uz": "x÷9=64",
      "ru": "x÷9=64",
      "en": "x÷9=64"
    },
    "scene": "dividend-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "x ÷ 9 = 64 tenglamasi berilgan.",
        "ru": "Дано уравнение x ÷ 9 = 64.",
        "en": "The equation x ÷ 9 = 64 is given."
      },
      {
        "uz": "Noma'lum bo'linuvchini topib tekshiring.",
        "ru": "Найдите неизвестное делимое и проверьте.",
        "en": "Find the unknown dividend and check it."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "576",
        "ru": "576",
        "en": "576"
      },
      {
        "uz": "72",
        "ru": "72",
        "en": "72"
      },
      {
        "uz": "711",
        "ru": "711",
        "en": "711"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "x = 64 × 9 = 576; tekshiruvda 576 ÷ 9 = 64.",
      "ru": "x = 64 × 9 = 576; при проверке 576 ÷ 9 = 64.",
      "en": "x = 64 × 9 = 576; the check gives 576 ÷ 9 = 64."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iks bo'lingan to'qqiz teng oltmish to'rt tenglamasi berilgan.",
          "Noma'lum bo'linuvchini topib tekshiring."
        ],
        "ru": [
          "Дано уравнение икс разделить на девять равно шестьдесят четыре.",
          "Найдите неизвестное делимое и проверьте."
        ],
        "en": [
          "The equation x divided by nine equals sixty four is given.",
          "Find the unknown dividend and check it."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Oltmish to'rt karra to'qqiz besh yuz yetmish olti. Besh yuz yetmish oltini to'qqizga bo'lsak, oltmish to'rt qaytadi.",
        "ru": "Верно. Шестьдесят четыре умножить на девять равно пятьсот семьдесят шесть. При проверке пятьсот семьдесят шесть разделить на девять равно шестьдесят четыре.",
        "en": "Correct. Sixty four multiplied by nine is five hundred and seventy six. Five hundred and seventy six divided by nine returns sixty four."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Oltmish to'rt karra to'qqiz besh yuz yetmish olti. Besh yuz yetmish oltini to'qqizga bo'lsak, oltmish to'rt qaytadi.",
          "ru": "Верно. Шестьдесят четыре умножить на девять равно пятьсот семьдесят шесть. При проверке пятьсот семьдесят шесть разделить на девять равно шестьдесят четыре.",
          "en": "Correct. Sixty four multiplied by nine is five hundred and seventy six. Five hundred and seventy six divided by nine returns sixty four."
        },
        {
          "uz": "Yana bir qarang: Yetmish ikki oltmish to'rtga sakkizni qo'shishdan chiqadi, ammo iks bo'linuvchi. Bo'linuvchini topish uchun oltmish to'rtni to'qqizga ko'paytiring.",
          "ru": "Посмотрите ещё раз: Семьдесят два получается при сложении шестидесяти четырёх и восьми, но икс является делимым. Умножьте шестьдесят четыре на девять.",
          "en": "Look again: Seventy-two comes from adding eight to sixty-four, but x is the dividend. Multiply sixty-four by nine."
        },
        {
          "uz": "Yana bir qarang: Yetti yuz o'n bir to'qqizga qoldiqsiz bo'linmaydi, shuning uchun bo'linma oltmish to'rt bo'la olmaydi. Oltmish to'rtni to'qqizga ko'paytiring.",
          "ru": "Посмотрите ещё раз: Семьсот одиннадцать не делится на девять без остатка, поэтому частное не равно шестидесяти четырём. Умножьте шестьдесят четыре на девять.",
          "en": "Look again: Seven hundred and eleven is not divisible by nine without a remainder, so its quotient cannot be sixty-four. Multiply sixty-four by nine."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Oltmish to'rt karra to'qqiz besh yuz yetmish olti. Besh yuz yetmish oltini to'qqizga bo'lsak, oltmish to'rt qaytadi.",
        "ru": "Верно. Шестьдесят четыре умножить на девять равно пятьсот семьдесят шесть. При проверке пятьсот семьдесят шесть разделить на девять равно шестьдесят четыре.",
        "en": "Correct. Sixty four multiplied by nine is five hundred and seventy six. Five hundred and seventy six divided by nine returns sixty four."
      },
      {
        "uz": "Yana bir qarang: Yetmish ikki oltmish to'rtga sakkizni qo'shishdan chiqadi, ammo iks bo'linuvchi. Bo'linuvchini topish uchun oltmish to'rtni to'qqizga ko'paytiring.",
        "ru": "Посмотрите ещё раз: Семьдесят два получается при сложении шестидесяти четырёх и восьми, но икс является делимым. Умножьте шестьдесят четыре на девять.",
        "en": "Look again: Seventy-two comes from adding eight to sixty-four, but x is the dividend. Multiply sixty-four by nine."
      },
      {
        "uz": "Yana bir qarang: Yetti yuz o'n bir to'qqizga qoldiqsiz bo'linmaydi, shuning uchun bo'linma oltmish to'rt bo'la olmaydi. Oltmish to'rtni to'qqizga ko'paytiring.",
        "ru": "Посмотрите ещё раз: Семьсот одиннадцать не делится на девять без остатка, поэтому частное не равно шестидесяти четырём. Умножьте шестьдесят четыре на девять.",
        "en": "Look again: Seven hundred and eleven is not divisible by nine without a remainder, so its quotient cannot be sixty-four. Multiply sixty-four by nine."
      }
    ]
  },
  "s13": {
    "eyebrow": {
      "uz": "Mashq 6/6",
      "ru": "Задание 6/6",
      "en": "Task 6/6"
    },
    "title": {
      "uz": "864÷x=12",
      "ru": "864÷x=12",
      "en": "864÷x=12"
    },
    "scene": "divisor-test",
    "closedSet": true,
    "frames": [
      {
        "uz": "864 ÷ x = 12 tenglamasida x = 72.",
        "ru": "В уравнении 864 ÷ x = 12 значение x равно 72.",
        "en": "In the equation 864 ÷ x = 12, x equals 72."
      },
      {
        "uz": "864 ÷ 72 ni hisoblang.",
        "ru": "Вычислите 864 ÷ 72.",
        "en": "Calculate 864 ÷ 72."
      },
      {
        "uz": "Natija 12 = 12 tengligini beradi.",
        "ru": "Получается равенство 12 = 12.",
        "en": "This gives the equality 12 = 12."
      }
    ],
    "question": {
      "uz": "Qaysi tekshiruv to'g'ri?",
      "ru": "Какое решение и проверка верны?",
      "en": "Which solution and check are correct?"
    },
    "options": [
      {
        "uz": "864 ÷ 72 = 12",
        "ru": "864 ÷ 72 = 12",
        "en": "864 ÷ 72 = 12"
      },
      {
        "uz": "864 − 72 = 12",
        "ru": "864 − 72 = 12",
        "en": "864 − 72 = 12"
      },
      {
        "uz": "72 ÷ 12 = 864",
        "ru": "72 ÷ 12 = 864",
        "en": "72 ÷ 12 = 864"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "x = 72 bo'lsa, 864 ÷ 72 = 12 va tenglama rost bo'ladi.",
      "ru": "При x = 72 получаем 864 ÷ 72 = 12, и уравнение верно.",
      "en": "When x = 72, 864 ÷ 72 = 12, so the equation is true."
    },
    "audio": {
      "intro": {
        "uz": [
          "Sakkiz yuz oltmish to'rt bo'lingan iks teng o'n ikki tenglamasida iks teng yetmish ikki.",
          "Sakkiz yuz oltmish to'rt bo'lingan yetmish ikkini hisoblang.",
          "Natija o'n ikki teng o'n ikki tengligini beradi."
        ],
        "ru": [
          "В уравнении восемьсот шестьдесят четыре разделить на икс равно двенадцать значение икс равно семьдесят два.",
          "Вычислите восемьсот шестьдесят четыре разделить на семьдесят два.",
          "Получается равенство двенадцать равно двенадцать."
        ],
        "en": [
          "In the equation eight hundred and sixty four divided by x equals twelve, x equals seventy two.",
          "Calculate eight hundred and sixty four divided by seventy two.",
          "This gives the equality twelve equals twelve."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Iks yetmish ikki bo'lsa, sakkiz yuz oltmish to'rtni yetmish ikkiga bo'lsak, o'n ikki chiqadi. Tenglama rost.",
        "ru": "Верно. При икс, равном семидесяти двум, восемьсот шестьдесят четыре разделить на семьдесят два равно двенадцать. Уравнение верно.",
        "en": "Correct. When x is seventy two, eight hundred and sixty four divided by seventy two equals twelve. The equation is true."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Iks yetmish ikki bo'lsa, sakkiz yuz oltmish to'rtni yetmish ikkiga bo'lsak, o'n ikki chiqadi. Tenglama rost.",
          "ru": "Верно. При икс, равном семидесяти двум, восемьсот шестьдесят четыре разделить на семьдесят два равно двенадцать. Уравнение верно.",
          "en": "Correct. When x is seventy two, eight hundred and sixty four divided by seventy two equals twelve. The equation is true."
        },
        {
          "uz": "Yana bir qarang: Tekshiruvda boshlang'ich bo'lish amali saqlanadi; ayirish boshqa ifodani tekshiradi. Sakkiz yuz oltmish to'rtni yetmish ikkiga bo'ling.",
          "ru": "Посмотрите ещё раз: При проверке сохраняют исходное действие деления; вычитание проверяет другое выражение. Разделите восемьсот шестьдесят четыре на семьдесят два.",
          "en": "Look again: A check must keep the original division; subtraction tests a different expression. Divide eight hundred and sixty-four by seventy-two."
        },
        {
          "uz": "Yana bir qarang: Bu yozuv bo'linuvchi va bo'luvchini almashtirib yuboradi. Boshlang'ich tartib sakkiz yuz oltmish to'rt bo'lingan yetmish ikki bo'lib qolishi kerak.",
          "ru": "Посмотрите ещё раз: Эта запись меняет местами делимое и делитель. Исходный порядок должен остаться: восемьсот шестьдесят четыре разделить на семьдесят два.",
          "en": "Look again: This statement swaps the dividend and divisor. Keep the original order: eight hundred and sixty-four divided by seventy-two."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Iks yetmish ikki bo'lsa, sakkiz yuz oltmish to'rtni yetmish ikkiga bo'lsak, o'n ikki chiqadi. Tenglama rost.",
        "ru": "Верно. При икс, равном семидесяти двум, восемьсот шестьдесят четыре разделить на семьдесят два равно двенадцать. Уравнение верно.",
        "en": "Correct. When x is seventy two, eight hundred and sixty four divided by seventy two equals twelve. The equation is true."
      },
      {
        "uz": "Yana bir qarang: Tekshiruvda boshlang'ich bo'lish amali saqlanadi; ayirish boshqa ifodani tekshiradi. Sakkiz yuz oltmish to'rtni yetmish ikkiga bo'ling.",
        "ru": "Посмотрите ещё раз: При проверке сохраняют исходное действие деления; вычитание проверяет другое выражение. Разделите восемьсот шестьдесят четыре на семьдесят два.",
        "en": "Look again: A check must keep the original division; subtraction tests a different expression. Divide eight hundred and sixty-four by seventy-two."
      },
      {
        "uz": "Yana bir qarang: Bu yozuv bo'linuvchi va bo'luvchini almashtirib yuboradi. Boshlang'ich tartib sakkiz yuz oltmish to'rt bo'lingan yetmish ikki bo'lib qolishi kerak.",
        "ru": "Посмотрите ещё раз: Эта запись меняет местами делимое и делитель. Исходный порядок должен остаться: восемьсот шестьдесят четыре разделить на семьдесят два.",
        "en": "Look again: This statement swaps the dividend and divisor. Keep the original order: eight hundred and sixty-four divided by seventy-two."
      }
    ]
  },
  "s14": {
    "eyebrow": {
      "uz": "Yakun",
      "ru": "Итог",
      "en": "Summary"
    },
    "title": {
      "uz": "Ildiz nazoratchisi",
      "ru": "Контролёр корня",
      "en": "Root checker"
    },
    "scene": "summary",
    "frames": [
      {
        "uz": "Tenglamani yeching.",
        "ru": "Решите уравнение.",
        "en": "Solve the equation."
      },
      {
        "uz": "Ildizni noma'lum o'rniga qo'ying.",
        "ru": "Подставьте корень вместо неизвестного.",
        "en": "Substitute the solution for the unknown."
      },
      {
        "uz": "Chap tomonni hisoblang.",
        "ru": "Вычислите левую часть.",
        "en": "Calculate the left-hand side."
      },
      {
        "uz": "O'ng tomonni hisoblang.",
        "ru": "Вычислите правую часть.",
        "en": "Calculate the right-hand side."
      },
      {
        "uz": "Tomonlar teng bo'lsa, ildiz isbotlandi.",
        "ru": "Если части равны, корень доказан.",
        "en": "If the sides are equal, the solution is proved."
      }
    ],
    "audio": {
      "uz": [
        "Tenglamani yeching.",
        "Ildizni noma'lum o'rniga qo'ying.",
        "Chap tomonni hisoblang.",
        "O'ng tomonni hisoblang.",
        "Tomonlar teng bo'lsa, ildiz isbotlandi."
      ],
      "ru": [
        "Решите уравнение.",
        "Подставьте корень вместо неизвестного.",
        "Вычислите левую часть.",
        "Вычислите правую часть.",
        "Если части равны, корень доказан."
      ],
      "en": [
        "Solve the equation.",
        "Substitute the solution for the unknown.",
        "Calculate the left-hand side.",
        "Calculate the right-hand side.",
        "If the sides are equal, the solution is proved."
      ]
    }
  }
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const normalizeLang = (value) => ['uz', 'ru', 'en'].includes(value) ? value : 'uz';
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => { const lang = useLang(); return useCallback((value) => { if (value == null) return ''; if (React.isValidElement(value)) return value; if (typeof value === 'string' || typeof value === 'number') return String(value); return value[lang] ?? value.uz ?? ''; }, [lang]); };
function useIsMobile(breakpoint = 640) { const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false); useEffect(() => { if (typeof window === 'undefined') return undefined; const update = () => setMobile(window.innerWidth < breakpoint); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [breakpoint]); return mobile; }
function usePrefersReducedMotion() { const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches); useEffect(() => { if (typeof window === 'undefined' || !window.matchMedia) return undefined; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []); return reduced; }
const buildTtsUrl = (base, text, gender) => base + '/api/tts?text=' + encodeURIComponent(String(text).slice(0, 1000)) + '&g=' + (gender === 'm' ? 'm' : 'f');
class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() { if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer); this.timer = null; if (this.audio) { this.audio.onended = null; this.audio.onerror = null; this.audio.pause(); this.audio.removeAttribute('src'); } if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; } if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); this.previewUtterance = null; }
  load(queue) { this.stop(); this.queue = queue; this.index = 0; this.emit({ isPlaying: false, completed: false, currentSegment: null }); }
  start() { if (!this.queue.length) { this.emit({ completed: true }); return; } this.play(); }
  timed(item) { const ms = Math.max(1500, Math.min(6500, String(item.text).split(/\s+/).length * 330)); this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: true }); this.timer = window.setTimeout(() => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }, ms); }
  play() { const item = this.queue[this.index]; if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; } if (this.muted || !runtimeConfig.ttsApiBase) { if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(item.text)); utterance.lang = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' }[this.lang] || 'uz-UZ'; utterance.rate = 0.94; utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false }); utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }; utterance.onerror = () => this.timed(item); this.previewUtterance = utterance; this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); } }, 50); return; } catch { /* deterministic timer fallback */ } } this.timed(item); return; } if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; } this.audio.onended = () => { this.index += 1; this.play(); }; this.audio.onerror = () => this.timed(item); this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender); this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item)); }
  toggleMute() { this.muted = !this.muted; this.stop(); this.emit({ isPlaying: false, completed: this.muted, currentSegment: null, muted: this.muted, visualOnly: true }); }
  pushOneOff(text) { if (!text) return; this.stop(); this.queue = [{ id: 'feedback-' + Date.now(), text }]; this.index = 0; this.play(); }
}
let audioEngineInstance = null;
const getAudioEngine = () => { if (!audioEngineInstance) audioEngineInstance = new AudioEngine(); return audioEngineInstance; };
function useAudio(segments) { const lang = useLang(); const stableKey = useMemo(() => JSON.stringify(segments), [segments]); const stableSegments = useMemo(() => JSON.parse(stableKey), [stableKey]); const [state, setState] = useState({ isPlaying: false, completed: false, currentSegment: null, muted: false, visualOnly: false }); useEffect(() => { const engine = getAudioEngine(); engine.setLang(lang); engine.listener = (next) => setState((previous) => ({ ...previous, ...next })); engine.load(stableSegments); const timer = window.setTimeout(() => engine.start(), 120); return () => { window.clearTimeout(timer); engine.stop(); }; }, [lang, stableSegments]); return { ...state, replay: () => { const engine = getAudioEngine(); engine.load(stableSegments); engine.start(); }, toggleMute: () => getAudioEngine().toggleMute(), pushOneOff: (text) => getAudioEngine().pushOneOff(text) }; }
function useNarration(value, screen) { const lang = useLang(); const reduced = usePrefersReducedMotion(); const segments = useMemo(() => { const source = value?.intro ?? value; const texts = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: 's' + screen + '-beat-' + index, text })); }, [lang, screen, value]); const audio = useAudio(segments); const active = segments.findIndex((segment) => segment.id === audio.currentSegment); const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1); const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true; const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0; return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' }; }
const playSfx = (kind) => { const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl; if (!url || typeof window === 'undefined') return; try { new Audio(url).play().catch(() => {}); } catch { /* optional */ } };

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};
const AudioIndicator = ({ audio }) => { const t = useT(); return <div className="audio-indicator"><button type="button" onClick={audio.toggleMute} aria-label={t(bi('Audio', 'Аудио', 'Audio'))}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span><button type="button" onClick={audio.replay} aria-label={t(bi('Qayta eshittirish', 'Повторить', 'Replay'))}>↻</button></div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), rule: bi('Qoida', 'Правило', "Rule"), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 14 : 24; const ref = useRef(null); useEffect(() => { ref.current?.scrollTo?.({ top: 0, behavior: 'smooth' }); }, [screen]); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" ref={ref} style={{ paddingLeft: pad, paddingRight: pad }}>{children}{audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false }) => { const t = useT(); return <div className={'heading ' + (showBit ? '' : 'heading-solo')}><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{showBit && <BitSVG state={state}/>}</div>; };

const G4TitleReveal = ({ title }) => {
  const t = useT(); const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setVisible(false), 3900); return () => window.clearTimeout(timer); }, []);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${t(bi('Unvon olindi', 'Звание получено', 'Title earned'))}: ${t(title)}`}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true"/><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }}/>)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{t(title)}</h2></div></div>, document.body);
};
const G4TitleCard = ({ title, answers = [] }) => {
  const t = useT(); const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t(bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED'))}</span><h2>{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t(bi('birinchi urinishda', 'с первой попытки', 'on the first attempt'))}</span></div></aside>;
};
const G4TitleReward = ({ unlocked, title, answers }) => {
  const [hasUnlocked, setHasUnlocked] = useState(unlocked);
  useEffect(() => { if (!unlocked || hasUnlocked) return undefined; const frameId = window.requestAnimationFrame(() => setHasUnlocked(true)); return () => window.cancelAnimationFrame(frameId); }, [hasUnlocked, unlocked]);
  if (!hasUnlocked) return null;
  return <><G4TitleReveal title={title}/><G4TitleCard title={title} answers={answers}/></>;
};
function ConversionVisual({ scene, frame }) {
  const f = Math.max(0, Math.min(4, frame));
  const on = (step) => step <= f ? 'topic-step topic-on' : 'topic-step';
  if (scene === 'division') return <div className="topic-visual topic-v43 scene-division" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><rect x="34" y="28" width="226" height="58" rx="15" fill="#FFF0EA" stroke="#FF5B35" strokeWidth="4"/><text x="147" y="65" textAnchor="middle" fill="#173B52" fontSize="23" fontWeight="900">x ÷ 9 = 64</text><path d="M270 57 H340" stroke="#168FA3" strokeWidth="5" strokeDasharray="9 7"/><path d="M335 47 l18 10 -18 10z" fill="#168FA3"/></g>
    <g className={on(1)}><rect x="356" y="28" width="210" height="58" rx="15" fill="#E7F3EC" stroke="#95C93D" strokeWidth="4"/><text x="461" y="65" textAnchor="middle" fill="#173B52" fontSize="22" fontWeight="900">x = 64 × 9 = 576</text></g>
    <g className={on(2)}><rect x="34" y="132" width="226" height="58" rx="15" fill="#E5F5F6" stroke="#168FA3" strokeWidth="4"/><text x="147" y="169" textAnchor="middle" fill="#173B52" fontSize="23" fontWeight="900">864 ÷ x = 12</text><path d="M270 161 H340" stroke="#FF5B35" strokeWidth="5" strokeDasharray="9 7"/><path d="M335 151 l18 10 -18 10z" fill="#FF5B35"/></g>
    <g className={on(3)}><rect x="356" y="132" width="210" height="58" rx="15" fill="#E7F3EC" stroke="#95C93D" strokeWidth="4"/><text x="461" y="169" textAnchor="middle" fill="#173B52" fontSize="22" fontWeight="900">x = 864 ÷ 12 = 72</text></g>
  </svg></div>;
  const models = {
    hook: ['x + 158 = 210', '42 ? 52', '? = ?'],
    check: ['x = ?', 'L = R', '✓'],
    add: ['x + 245 = 700', '455 + 245', '700 = 700'],
    subtrahend: ['900 − x = 376', '900 − 524', '376 = 376'],
    minuend: ['x − 268 = 457', '725 − 268', '457 = 457'],
    multiply: ['8x = 376', '47 × 8', '376 = 376'],
    division: ['x ÷ 9 = 64', '576 ÷ 9', '64 = 64'],
    algorithm: ['x = ?', 'x → □', 'L = R'],
    'substitution-choice': ['x + 245 = 700', '455 + 245', '700 = 700'],
    'subtrahend-test': ['900 − x = 376', '900 − 524', '376 = 376'],
    'minuend-test': ['x − 268 = 457', '725 − 268', '457 = 457'],
    'factor-test': ['8x = 376', '47 × 8', '376 = 376'],
    'dividend-test': ['x ÷ 9 = 64', '576 ÷ 9', '64 = 64'],
    'divisor-test': ['864 ÷ x = 12', '864 ÷ 72', '12 = 12'],
    summary: ['x = ?', 'x → □', 'L = R'],
  };
  const model = models[scene] || models.hook;
  return <div className={'topic-visual topic-v43 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><rect x="42" y="36" width="236" height="64" rx="16" fill="#FFF0EA" stroke="#FF5B35" strokeWidth="4"/><text x="160" y="76" textAnchor="middle" fontSize="24" fontWeight="900" fill="#173B52">{model[0]}</text></g>
    <g className={on(1)}><path d="M286 68 H350" stroke="#168FA3" strokeWidth="5" strokeDasharray="10 7"/><path d="M347 58 l18 10 -18 10z" fill="#168FA3"/></g>
    <g className={on(2)}><rect x="370" y="36" width="188" height="64" rx="16" fill="#E5F5F6" stroke="#168FA3" strokeWidth="4"/><text x="464" y="76" textAnchor="middle" fontSize="23" fontWeight="900" fill="#173B52">{model[1]}</text></g>
    <g className={on(3)}><rect x="176" y="132" width="248" height="60" rx="16" fill="#E7F3EC" stroke="#95C93D" strokeWidth="5"/><text x="300" y="170" textAnchor="middle" fontSize="25" fontWeight="900" fill="#173B52">{model[2]}</text></g>
    <g className={on(4)}><circle cx="540" cy="166" r="18" fill="#95C93D"/><path d="M531 166 l7 7 13-17" fill="none" stroke="#173B52" strokeWidth="5"/></g>
  </svg></div>;
}
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
function HookScreen({ screen, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const choose = (index) => { setPicked(index); audio.pushOneOff(t(c.neutral)); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state="think" showBit/><section className="model-card hook-card"><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><section className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" className={'option ' + (picked === index ? 'picked' : '')} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div>{picked !== null && <div className="feedback open neutral"><b>◆</b><p>{t(c.neutral)}</p></div>}</section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext, finishLesson }) { const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const summary = screen === 14; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={summary ? finishLesson : onNext} finish={summary}><div className="stack"><Heading c={c} state={screen === 7 ? 'happy' : ['focus', 'point', 'idea'][(screen - 1) % 3]} showBit/><section className={'model-card ' + (summary ? 'summary-card' : '')}><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const revealed = picked !== null; const correct = picked === c.correctIndex; const choose = (index) => { const ok = index === c.correctIndex; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state={screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'} showBit/><section className="test-layout"><div className="test-model"><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = revealed && index === picked ? (index === c.correctIndex ? 'right' : 'bad') : ''; return <button type="button" className={'option ' + cls} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div>{revealed && <><div className={'feedback open ' + (correct ? 'correct' : 'wrong')}><b>{correct ? '✓' : '!'}</b><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div><div className="proof">{t(c.proof)}</div></>}</div></section></div></Stage>; }
const Screen0 = (props) => <HookScreen {...props}/>;
const Screen1 = (props) => <InfoScreen {...props}/>;
const Screen2 = (props) => <InfoScreen {...props}/>;
const Screen3 = (props) => <InfoScreen {...props}/>;
const Screen4 = (props) => <InfoScreen {...props}/>;
const Screen5 = (props) => <InfoScreen {...props}/>;
const Screen6 = (props) => <InfoScreen {...props}/>;
const Screen7 = (props) => <InfoScreen {...props}/>;
const Screen8 = (props) => <QuestionScreen {...props}/>;
const Screen9 = (props) => <QuestionScreen {...props}/>;
const Screen10 = (props) => <QuestionScreen {...props}/>;
const Screen11 = (props) => <QuestionScreen {...props}/>;
const Screen12 = (props) => <QuestionScreen {...props}/>;
const Screen13 = (props) => <QuestionScreen {...props}/>;
function Screen14({ screen, answers, onPrev, finishLesson }) {
  const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const reduced = usePrefersReducedMotion(); const unlocked = audio.frame >= 4 || audio.completed || audio.muted || reduced;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} state="happy" showBit/><section className="model-card summary-card"><ConversionVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><G4TitleReward unlocked={unlocked} title={LESSON_REWARD_TITLE} answers={answers}/></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars43({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars43 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

const TOPIC_STYLES = `
.topic-visual{width:100%;min-height:156px;display:grid;place-items:center;padding:8px 10px;border-radius:18px;background:linear-gradient(145deg,#FFFFFF,#EEF5F3);box-shadow:0 16px 34px -27px rgba(58,53,48,.58);overflow:hidden}
.topic-visual svg{display:block;width:min(100%,680px);height:auto;max-height:210px}
.topic-step{opacity:0;transform:translateY(8px) scale(.985);transform-origin:center;transition:opacity .5s ease,transform .6s cubic-bezier(.16,1,.3,1)}
.topic-step.topic-on{opacity:1;transform:none;animation:topic-micro-in .62s cubic-bezier(.16,1,.3,1) both}
.topic-v39 .topic-step.topic-on circle,.topic-v43 .topic-step.topic-on circle{animation:topic-pulse 1.8s ease-in-out infinite}
.topic-v41 .topic-step.topic-on:nth-child(3){transition:transform .8s ease}
@keyframes topic-micro-in{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
@keyframes topic-pulse{0%,100%{filter:drop-shadow(0 0 0 rgba(149,201,61,0))}50%{filter:drop-shadow(0 0 8px rgba(149,201,61,.8))}}
@media (max-width:640px){.topic-visual{min-height:128px;padding:4px}.topic-visual svg{max-height:160px}}
@media (prefers-reduced-motion:reduce){.topic-step,.topic-step.topic-on{animation:none!important;transition:none!important;opacity:1;transform:none}.topic-v39 circle,.topic-v43 circle{animation:none!important}}
`;

const G4_TITLE_STYLES = `
.g4-title-reveal-overlay{
  position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;
  background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-overlay-life 3.8s ease both
}
.g4-title-reveal-card{
  position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;
  background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)
}
.g4-title-reveal-card::after{
  content:"";position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;
  background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%);pointer-events:none
}
.g4-title-reveal-rays{
  position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;
  background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);
  transform:translate(-50%,-50%);
  animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-spin 26s linear .8s 1 both
}
.g4-title-reveal-medal{
  position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;margin:0;border:6px solid rgba(255,255,255,.72);border-radius:50%;
  display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);
  box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);
  font-size:52px;transform:translate(-50%,-50%);animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both
}
.g4-title-reveal-card h2{
  position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0;
  font-family:'Source Serif 4',Georgia,serif;font-size:clamp(34px,5vw,58px);line-height:1.02;text-shadow:0 4px 24px rgba(0,0,0,.72);
  transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both
}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-reveal-confetti i{
  position:absolute;top:-20px;left:calc(3% + var(--g4-title-i) * 5.35%);width:8px;height:14px;border-radius:2px;background:#FFE284;
  animation:g4-title-reveal-confetti-fall 2.4s linear var(--g4-title-delay) 2 both
}
.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
.g4-title-card-stage{
  position:relative;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;
  display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;
  background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);
  box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)
}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}
.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-medal{
  position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;
  display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);
  box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px
}
.g4-title-card-kicker{color:#A8EAF0;font:900 10px 'JetBrains Mono',monospace;letter-spacing:.13em}
.g4-title-card-stage h2{max-width:590px;margin:0;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif}
.g4-title-card-score{
  align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10)
}
.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-confetti-fall 2.4s linear 2 both}
.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}
.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
@keyframes g4-title-reveal-overlay-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}
@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}
@keyframes g4-title-reveal-rays-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes g4-title-reveal-confetti-fall{to{transform:translateY(470px) rotate(560deg)}}
@keyframes g4-title-card-confetti-fall{to{transform:translateY(230px) rotate(460deg)}}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@media(max-width:639.98px){
  .g4-title-reveal-card{min-height:100dvh;padding:24px 18px}
  .g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}
  .g4-title-reveal-card h2{top:calc(50% + 62px);font-size:29px}
  .g4-title-card-stage{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}
  .g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}
  .g4-title-card-bit{width:57px;height:71px}
  .g4-title-card-stage h2{font-size:14px}
}
@media(prefers-reduced-motion:reduce){
  .g4-title-reveal-overlay,.g4-title-reveal-overlay *,.g4-title-card-stage,.g4-title-card-stage *{animation:none!important;transition:none!important}
  .g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}
  .g4-title-reveal-rays{opacity:.28!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-medal{opacity:1!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-card h2{opacity:1!important;transform:translateX(-50%)!important}
  .g4-title-card-stage{transform:none!important}
}
`;

const STYLES = `${G4_TITLE_STYLES}${TOPIC_STYLES}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{flex:0 0 auto;padding-top:14px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:38px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:31px;height:31px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow-y:auto}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover{color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{display:grid;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading.heading-solo{justify-content:flex-start}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:center;gap:18px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{display:grid;gap:8px}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:58px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover{transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:11px 14px;border-radius:13px;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{display:grid;grid-template-columns:.85fr 1.15fr;gap:14px}.test-model{display:grid;align-content:center;gap:12px}.caption{position:sticky;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;z-index:3}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.test-layout{grid-template-columns:1fr}.model-card,.question,.test-model{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.conversion-visual{min-height:170px}.reveal-card{min-height:43px}.test-model .reveal-grid{display:none}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;
