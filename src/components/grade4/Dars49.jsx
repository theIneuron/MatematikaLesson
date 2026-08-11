import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 49 · Matematik mulohazalar
// 15 ekran · 50 asosiy audio beat · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "logic-4-49-v1", slug: "dars49-mulohazalar-va-hukmlar", lessonTitle: {"uz":"Mulohazalar va hukmlar","ru":"Высказывания и суждения","en":"Mathematical statements and judgements"}, skillTags: ["mathematical-statements","truth-values","counterexample","logic"] };
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
  { id: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Lumo mantiq markazi",
      "ru": "Центр логики Лумо",
      "en": "Lumo logic centre"
    },
    "title": {
      "uz": "Har bir to'g'ri to'rtburchak kvadrat",
      "ru": "«Каждый прямоугольник — квадрат»",
      "en": "“Every rectangle is a square”"
    },
    "scene": "logic-hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "Har bir to'g'ri to'rtburchak kvadrat",
        "ru": "Каждый прямоугольник — квадрат",
        "en": "Every rectangle is a square"
      },
      {
        "uz": "Kvadrat bo'lmagan to'g'ri to'rtburchak bor",
        "ru": "Есть прямоугольник, который не является квадратом",
        "en": "There is a rectangle that is not a square"
      },
      {
        "uz": "Gap tekshiriladi va yolg'on",
        "ru": "Высказывание проверяемо и ложно",
        "en": "The statement is testable and false"
      }
    ],
    "question": {
      "uz": "Bu gap matematik mulohazami?",
      "ru": "Является ли это математическим высказыванием?",
      "en": "Is this a mathematical statement?"
    },
    "options": [
      {
        "uz": "Ha, yolg'on mulohaza",
        "ru": "Да, ложное высказывание",
        "en": "Yes, a false statement"
      },
      {
        "uz": "Ha, rost mulohaza",
        "ru": "Да, истинное высказывание",
        "en": "Yes, a true statement"
      },
      {
        "uz": "Yo'q, mulohaza emas",
        "ru": "Нет, это не высказывание",
        "en": "No, it is not a statement"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Gapning vazifasi va rostligini alohida tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим назначение предложения и его истинность отдельно.",
      "en": "Estimate saved. We will check the purpose of each sentence and its truth value."
    },
    "audio": {
      "intro": {
        "uz": [
          "Har bir to'g'ri to'rtburchak kvadrat",
          "Kvadrat bo'lmagan to'g'ri to'rtburchak bor",
          "Gap tekshiriladi va yolg'on"
        ],
        "ru": [
          "Каждый прямоугольник квадрат",
          "Есть прямоугольник который не является квадратом",
          "Высказывание проверяемо и ложно"
        ],
        "en": [
          "Every rectangle is a square",
          "There is a rectangle that is not a square",
          "The statement is testable and false"
        ]
      }
    }
  },
  "s1": {
    "eyebrow": {
      "uz": "Ta'rif",
      "ru": "Определение",
      "en": "Definition"
    },
    "title": {
      "uz": "Mulohazaning ikki belgisi",
      "ru": "Два признака высказывания",
      "en": "Two features of a statement"
    },
    "scene": "logic-definition",
    "frames": [
      {
        "uz": "Tugallangan darak gap",
        "ru": "Завершённое повествовательное предложение",
        "en": "A complete declarative sentence"
      },
      {
        "uz": "Uni tekshirish mumkin",
        "ru": "Его можно проверить",
        "en": "It can be checked"
      },
      {
        "uz": "Rost yoki yolg'on",
        "ru": "Истина или ложь",
        "en": "True or false"
      },
      {
        "uz": "Bu matematik mulohaza",
        "ru": "Это математическое высказывание",
        "en": "This is a mathematical statement"
      }
    ],
    "audio": {
      "uz": [
        "Tugallangan darak gap",
        "Uni tekshirish mumkin",
        "Rost yoki yolg'on",
        "Bu matematik mulohaza"
      ],
      "ru": [
        "Завершённое повествовательное предложение",
        "Его можно проверить",
        "Истина или ложь",
        "Это математическое высказывание"
      ],
      "en": [
        "A complete declarative sentence",
        "It can be checked",
        "True or false",
        "This is a mathematical statement"
      ]
    }
  },
  "s2": {
    "eyebrow": {
      "uz": "Uch tur",
      "ru": "Три типа",
      "en": "Three types"
    },
    "title": {
      "uz": "Rost, yolg'on yoki mulohaza emas",
      "ru": "Истина, ложь или не высказывание",
      "en": "True, false or not a statement"
    },
    "scene": "logic-types",
    "frames": [
      {
        "uz": "7×8=56 — rost",
        "ru": "7×8=56 — истина",
        "en": "7×8=56 is true"
      },
      {
        "uz": "7×8=54 — yolg'on",
        "ru": "7×8=54 — ложь",
        "en": "7×8=54 is false"
      },
      {
        "uz": "7×8 nechaga teng? — savol",
        "ru": "Чему равно 7×8? — вопрос",
        "en": "What is 7×8? — a question"
      },
      {
        "uz": "Hisoblang! — buyruq",
        "ru": "Вычислите! — команда",
        "en": "Calculate! — a command"
      }
    ],
    "audio": {
      "uz": [
        "yetti karra sakkiz teng ellik olti rost",
        "yetti karra sakkiz teng ellik to'rt yolg'on",
        "Yetti karra sakkiz nechaga teng? Bu savol, shuning uchun mulohaza emas",
        "Hisoblang degan gap buyruq, shuning uchun mulohaza emas"
      ],
      "ru": [
        "семь умножить на восемь равно пятьдесят шесть истина",
        "семь умножить на восемь равно пятьдесят четыре ложь",
        "Чему равно семь умножить на восемь? Это вопрос, поэтому он не является высказыванием",
        "Фраза вычислите является командой, поэтому она не является высказыванием"
      ],
      "en": [
        "The statement seven times eight equals fifty six is true",
        "The statement seven times eight equals fifty four is false",
        "What is seven times eight? This is a question, so it is not a statement",
        "The instruction to calculate is a command, so it is not a statement"
      ]
    }
  },
  "s3": {
    "eyebrow": {
      "uz": "Dalil",
      "ru": "Доказательство",
      "en": "Evidence"
    },
    "title": {
      "uz": "Qanday tekshiramiz?",
      "ru": "Как проверяем?",
      "en": "How do we check?"
    },
    "scene": "logic-evidence",
    "frames": [
      {
        "uz": "Hisoblash",
        "ru": "Вычисление",
        "en": "Calculation"
      },
      {
        "uz": "Model",
        "ru": "Модель",
        "en": "Model"
      },
      {
        "uz": "Xossa",
        "ru": "Свойство",
        "en": "Property"
      },
      {
        "uz": "Qarshi misol",
        "ru": "Контрпример",
        "en": "Counterexample"
      }
    ],
    "audio": {
      "uz": [
        "Hisoblash",
        "Model",
        "Xossa",
        "Qarshi misol"
      ],
      "ru": [
        "Вычисление",
        "Модель",
        "Свойство",
        "Контрпример"
      ],
      "en": [
        "Calculation",
        "Model",
        "Property",
        "Counterexample"
      ]
    }
  },
  "s4": {
    "eyebrow": {
      "uz": "Qarshi misol",
      "ru": "Контрпример",
      "en": "Counterexample"
    },
    "title": {
      "uz": "Qarshi misol",
      "ru": "Контрпример",
      "en": "Counterexample"
    },
    "scene": "logic-open",
    "frames": [
      {
        "uz": "Fikr: har bir juft son 4 ga bo'linadi",
        "ru": "Утверждение: каждое чётное число делится на 4",
        "en": "Claim: every even number is divisible by 4"
      },
      {
        "uz": "6 soni juft",
        "ru": "Число 6 чётное",
        "en": "The number 6 is even"
      },
      {
        "uz": "6 soni 4 ga bo'linmaydi",
        "ru": "Число 6 не делится на 4",
        "en": "The number 6 is not divisible by 4"
      },
      {
        "uz": "Bitta qarshi misol fikrni rad etadi",
        "ru": "Один контрпример опровергает утверждение",
        "en": "One counterexample disproves the claim"
      }
    ],
    "audio": {
      "uz": [
        "Fikr har bir juft son to'rtga bo'linadi",
        "olti soni juft",
        "olti soni to'rtga bo'linmaydi",
        "Bitta qarshi misol fikrni rad etadi"
      ],
      "ru": [
        "Утверждение каждое чётное число делится на четыре",
        "Число шесть чётное",
        "Число шесть не делится на четыре",
        "Один контрпример опровергает утверждение"
      ],
      "en": [
        "Claim every even number is divisible by four",
        "The number six is even",
        "The number six is not divisible by four",
        "One counterexample disproves the claim"
      ]
    }
  },
  "s5": {
    "eyebrow": {
      "uz": "Ochiq gap",
      "ru": "Открытое предложение",
      "en": "Open sentence"
    },
    "title": {
      "uz": "Ochiq gap",
      "ru": "Открытое предложение",
      "en": "Open sentence"
    },
    "scene": "logic-and",
    "frames": [
      {
        "uz": "x+3=8",
        "ru": "x+3=8",
        "en": "x+3=8"
      },
      {
        "uz": "x noma'lum",
        "ru": "x неизвестен",
        "en": "x is unknown"
      },
      {
        "uz": "x=5",
        "ru": "x=5",
        "en": "x=5"
      },
      {
        "uz": "5+3=8 — rost",
        "ru": "5+3=8 — истина",
        "en": "5+3=8 is true"
      }
    ],
    "audio": {
      "uz": [
        "x qo'shuv uch teng sakkiz",
        "x noma'lum",
        "x teng besh",
        "besh qo'shuv uch teng sakkiz rost"
      ],
      "ru": [
        "x плюс три равно восемь",
        "x неизвестен",
        "x равно пять",
        "пять плюс три равно восемь истина"
      ],
      "en": [
        "x plus three equals eight",
        "x is unknown",
        "x equals five",
        "five plus three equals eight is true"
      ]
    }
  },
  "s6": {
    "eyebrow": {
      "uz": "YOKI bog'lovchisi",
      "ru": "Связка ИЛИ",
      "en": "OR connector"
    },
    "title": {
      "uz": "Va va yoki",
      "ru": "«И» и «или»",
      "en": "“And” and “or”"
    },
    "scene": "logic-or",
    "frames": [
      {
        "uz": "VA: ikkala qism rost bo'lishi kerak",
        "ru": "И: обе части должны быть истинными",
        "en": "AND: both parts must be true"
      },
      {
        "uz": "2 ta yashil belgi",
        "ru": "2 зелёных знака",
        "en": "2 green marks"
      },
      {
        "uz": "YOKI: kamida 1 ta qism rost",
        "ru": "ИЛИ: хотя бы 1 часть истинна",
        "en": "OR: at least 1 part is true"
      },
      {
        "uz": "1 yoki 2 ta yashil belgi",
        "ru": "1 или 2 зелёных знака",
        "en": "1 or 2 green marks"
      }
    ],
    "audio": {
      "uz": [
        "VA ikkala qism rost bo'lishi kerak",
        "ikkita yashil belgi",
        "YOKI kamida bitta qism rost",
        "bitta yoki ikkita yashil belgi"
      ],
      "ru": [
        "И обе части должны быть истинными",
        "два зелёных знака",
        "ИЛИ хотя бы одна часть истинна",
        "один или два зелёных знака"
      ],
      "en": [
        "AND both parts must be true",
        "two green marks",
        "OR at least one part is true",
        "one or two green marks"
      ]
    }
  },
  "s7": {
    "eyebrow": {
      "uz": "Qarshi misol",
      "ru": "Контрпример",
      "en": "Counterexample"
    },
    "title": {
      "uz": "Mulohazani tekshirish",
      "ru": "Проверка высказывания",
      "en": "Checking a statement"
    },
    "scene": "logic-counterexample",
    "frames": [
      {
        "uz": "Gap tugallanganmi?",
        "ru": "Предложение завершено?",
        "en": "Is the sentence complete?"
      },
      {
        "uz": "Uni tekshirish mumkinmi?",
        "ru": "Можно ли его проверить?",
        "en": "Can it be checked?"
      },
      {
        "uz": "Hisob, model yoki xossa bilan tekshiring",
        "ru": "Проверьте вычислением, моделью или свойством",
        "en": "Check by calculation, model or property"
      },
      {
        "uz": "Kerak bo'lsa, qarshi misol toping",
        "ru": "При необходимости найдите контрпример",
        "en": "Find a counterexample if needed"
      },
      {
        "uz": "Qarshi misol: kvadrat bo'lmagan to'g'ri to'rtburchak → gap yolg'on",
        "ru": "Контрпример: прямоугольник, который не является квадратом → высказывание ложно",
        "en": "Counterexample: a rectangle that is not a square → the statement is false"
      }
    ],
    "audio": {
      "uz": [
        "Gap tugallanganmi?",
        "Uni tekshirish mumkinmi?",
        "Hisob model yoki xossa bilan tekshiring",
        "Kerak bo'lsa qarshi misol toping",
        "Kirishdagi gap yolg'on: kvadrat bo'lmagan to'g'ri to'rtburchak unga qarshi misol bo'ladi"
      ],
      "ru": [
        "Предложение завершено?",
        "Можно ли его проверить?",
        "Проверьте вычислением моделью или свойством",
        "При необходимости найдите контрпример",
        "Высказывание из начала урока ложно: прямоугольник, который не является квадратом, служит контрпримером"
      ],
      "en": [
        "Is the sentence complete?",
        "Can it be checked?",
        "Check by calculation model or property",
        "Find a counterexample if needed",
        "The opening statement is false: a rectangle that is not a square is a counterexample"
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
      "uz": "Rost mulohaza",
      "ru": "Истинное высказывание",
      "en": "True statement"
    },
    "scene": "logic-test-true",
    "closedSet": true,
    "frames": [
      {
        "uz": "Har bir variantni tekshiring",
        "ru": "Проверьте каждый вариант",
        "en": "Check every option"
      },
      {
        "uz": "Faqat bittasi rost",
        "ru": "Только одно истинно",
        "en": "Only one is true"
      }
    ],
    "question": {
      "uz": "Qaysi mulohaza rost?",
      "ru": "Какое высказывание истинно?",
      "en": "Which statement is true?"
    },
    "options": [
      {
        "uz": "8×7=54",
        "ru": "8×7=54",
        "en": "8×7=54"
      },
      {
        "uz": "Kvadratning 4 tomoni bor",
        "ru": "У квадрата 4 стороны",
        "en": "A square has 4 sides"
      },
      {
        "uz": "90° o'tkir burchak",
        "ru": "90° — острый угол",
        "en": "90° is an acute angle"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "Kvadratning 4 tomoni bor",
      "ru": "У квадрата 4 стороны",
      "en": "A square has 4 sides"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: sakkizni yettiga ko'paytirganda ellik olti chiqadi, ellik to'rt emas.",
        "ru": "Посмотрите ещё раз: восемь умножить на семь равно пятидесяти шести, а не пятидесяти четырём.",
        "en": "Look again: eight times seven equals fifty six, not fifty four."
      },
      {
        "uz": "To'g'ri. Kvadratning to'rtta tomoni bor, shuning uchun bu mulohaza rost.",
        "ru": "Верно. У квадрата четыре стороны, поэтому это высказывание истинно.",
        "en": "Correct. A square has four sides, so this statement is true."
      },
      {
        "uz": "Yana bir qarang: to'qson gradusli burchak to'g'ri burchak, o'tkir burchak emas.",
        "ru": "Посмотрите ещё раз: угол в девяносто градусов прямой, а не острый.",
        "en": "Look again: an angle of ninety degrees is a right angle, not an acute angle."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Har bir variantni tekshiring",
          "Faqat bittasi rost"
        ],
        "ru": [
          "Проверьте каждый вариант",
          "Только одно истинно"
        ],
        "en": [
          "Check every option",
          "Only one is true"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Kvadratning to'rtta tomoni bor, shuning uchun bu mulohaza rost.",
        "ru": "Верно. У квадрата четыре стороны, поэтому это высказывание истинно.",
        "en": "Correct. A square has four sides, so this statement is true."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: sakkizni yettiga ko'paytirganda ellik olti chiqadi, ellik to'rt emas.",
          "ru": "Посмотрите ещё раз: восемь умножить на семь равно пятидесяти шести, а не пятидесяти четырём.",
          "en": "Look again: eight times seven equals fifty six, not fifty four."
        },
        {
          "uz": "To'g'ri. Kvadratning to'rtta tomoni bor, shuning uchun bu mulohaza rost.",
          "ru": "Верно. У квадрата четыре стороны, поэтому это высказывание истинно.",
          "en": "Correct. A square has four sides, so this statement is true."
        },
        {
          "uz": "Yana bir qarang: to'qson gradusli burchak to'g'ri burchak, o'tkir burchak emas.",
          "ru": "Посмотрите ещё раз: угол в девяносто градусов прямой, а не острый.",
          "en": "Look again: an angle of ninety degrees is a right angle, not an acute angle."
        }
      ]
    }
  },
  "s9": {
    "eyebrow": {
      "uz": "Mashq 2/6",
      "ru": "Задание 2/6",
      "en": "Task 2/6"
    },
    "title": {
      "uz": "Mulohaza emas",
      "ru": "Не является высказыванием",
      "en": "Not a statement"
    },
    "scene": "logic-test-command",
    "closedSet": true,
    "frames": [
      {
        "uz": "Mulohaza rost yoki yolg'on bo'ladi",
        "ru": "Высказывание бывает истинным или ложным",
        "en": "A statement is true or false"
      },
      {
        "uz": "Har bir gapni rost yoki yolg'on deb tekshiring",
        "ru": "Проверьте, можно ли считать каждое предложение истинным или ложным",
        "en": "Check whether each sentence can be true or false"
      }
    ],
    "question": {
      "uz": "Qaysi gap mulohaza emas?",
      "ru": "Какое предложение не является высказыванием?",
      "en": "Which sentence is not a statement?"
    },
    "options": [
      {
        "uz": "12 juft son",
        "ru": "12 — чётное число",
        "en": "12 is even"
      },
      {
        "uz": "12 ni 3 ga bo'ling!",
        "ru": "Разделите 12 на 3!",
        "en": "Divide 12 by 3!"
      },
      {
        "uz": "12÷3=4",
        "ru": "12÷3=4",
        "en": "12÷3=4"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "12 ni 3 ga bo'ling! — buyruq rost yoki yolg'on bo'lmaydi",
      "ru": "Разделите 12 на 3! Команда не бывает истинной или ложной",
      "en": "Divide 12 by 3! A command is not true or false"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: o'n ikki juft son degan gapni rost yoki yolg'on deb tekshirish mumkin.",
        "ru": "Посмотрите ещё раз: предложение о том, что двенадцать чётное, можно проверить как истинное или ложное.",
        "en": "Look again: the sentence that twelve is even can be checked as true or false."
      },
      {
        "uz": "To'g'ri. Bo'lishni so'ragan gap buyruq, shuning uchun u mulohaza emas.",
        "ru": "Верно. Предложение просит выполнить деление, поэтому это команда, а не высказывание.",
        "en": "Correct. The sentence asks for a division to be carried out, so it is a command rather than a statement."
      },
      {
        "uz": "Yana bir qarang: o'n ikkini uchga bo'lganda to'rt chiqadi degan tenglik rost mulohaza.",
        "ru": "Посмотрите ещё раз: равенство о делении двенадцати на три является истинным высказыванием.",
        "en": "Look again: the equality stating that twelve divided by three equals four is a true statement."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Mulohaza rost yoki yolg'on bo'ladi",
          "Har bir gapni rost yoki yolg'on deb tekshiring"
        ],
        "ru": [
          "Высказывание бывает истинным или ложным",
          "Проверьте можно ли считать каждое предложение истинным или ложным"
        ],
        "en": [
          "A statement is true or false",
          "Check whether each sentence can be true or false"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Bo'lishni so'ragan gap buyruq, shuning uchun u mulohaza emas.",
        "ru": "Верно. Предложение просит выполнить деление, поэтому это команда, а не высказывание.",
        "en": "Correct. The sentence asks for a division to be carried out, so it is a command rather than a statement."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: o'n ikki juft son degan gapni rost yoki yolg'on deb tekshirish mumkin.",
          "ru": "Посмотрите ещё раз: предложение о том, что двенадцать чётное, можно проверить как истинное или ложное.",
          "en": "Look again: the sentence that twelve is even can be checked as true or false."
        },
        {
          "uz": "To'g'ri. Bo'lishni so'ragan gap buyruq, shuning uchun u mulohaza emas.",
          "ru": "Верно. Предложение просит выполнить деление, поэтому это команда, а не высказывание.",
          "en": "Correct. The sentence asks for a division to be carried out, so it is a command rather than a statement."
        },
        {
          "uz": "Yana bir qarang: o'n ikkini uchga bo'lganda to'rt chiqadi degan tenglik rost mulohaza.",
          "ru": "Посмотрите ещё раз: равенство о делении двенадцати на три является истинным высказыванием.",
          "en": "Look again: the equality stating that twelve divided by three equals four is a true statement."
        }
      ]
    }
  },
  "s10": {
    "eyebrow": {
      "uz": "Mashq 3/6",
      "ru": "Задание 3/6",
      "en": "Task 3/6"
    },
    "title": {
      "uz": "Qiymat qo'ying",
      "ru": "Подставьте значение",
      "en": "Substitute a value"
    },
    "scene": "logic-test-substitute",
    "closedSet": true,
    "frames": [
      {
        "uz": "x+4>10",
        "ru": "x+4>10",
        "en": "x+4>10"
      },
      {
        "uz": "x=8",
        "ru": "x=8",
        "en": "x=8"
      }
    ],
    "question": {
      "uz": "Hosil bo'lgan mulohaza qanday?",
      "ru": "Каково полученное высказывание?",
      "en": "What is the resulting statement?"
    },
    "options": [
      {
        "uz": "Rost",
        "ru": "Истина",
        "en": "True"
      },
      {
        "uz": "Yolg'on",
        "ru": "Ложь",
        "en": "False"
      },
      {
        "uz": "Mulohaza emas",
        "ru": "Не высказывание",
        "en": "Not a statement"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "8+4>10 — rost",
      "ru": "8+4>10 — истина",
      "en": "8+4>10 is true"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. x o'rniga sakkiz qo'yilganda o'n ikki o'ndan katta bo'ladi.",
        "ru": "Верно. После подстановки восьми получается двенадцать, а двенадцать больше десяти.",
        "en": "Correct. Substituting eight gives twelve, and twelve is greater than ten."
      },
      {
        "uz": "Yana bir qarang: sakkizga to'rt qo'shilsa o'n ikki chiqadi va bu o'ndan katta.",
        "ru": "Посмотрите ещё раз: восемь плюс четыре равно двенадцати, а это больше десяти.",
        "en": "Look again: eight plus four equals twelve, which is greater than ten."
      },
      {
        "uz": "Yana bir qarang: x qiymati berilgach gap tugallangan va rostligini tekshirish mumkin.",
        "ru": "Посмотрите ещё раз: после задания значения икс предложение завершено и его истинность можно проверить.",
        "en": "Look again: once x has a value, the sentence is complete and its truth can be checked."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "x qo'shuv to'rt o'ndan katta",
          "x teng sakkiz"
        ],
        "ru": [
          "икс плюс четыре больше десяти",
          "икс равен восьми"
        ],
        "en": [
          "x plus four is greater than ten",
          "x equals eight"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. x o'rniga sakkiz qo'yilganda o'n ikki o'ndan katta bo'ladi.",
        "ru": "Верно. После подстановки восьми получается двенадцать, а двенадцать больше десяти.",
        "en": "Correct. Substituting eight gives twelve, and twelve is greater than ten."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. x o'rniga sakkiz qo'yilganda o'n ikki o'ndan katta bo'ladi.",
          "ru": "Верно. После подстановки восьми получается двенадцать, а двенадцать больше десяти.",
          "en": "Correct. Substituting eight gives twelve, and twelve is greater than ten."
        },
        {
          "uz": "Yana bir qarang: sakkizga to'rt qo'shilsa o'n ikki chiqadi va bu o'ndan katta.",
          "ru": "Посмотрите ещё раз: восемь плюс четыре равно двенадцати, а это больше десяти.",
          "en": "Look again: eight plus four equals twelve, which is greater than ten."
        },
        {
          "uz": "Yana bir qarang: x qiymati berilgach gap tugallangan va rostligini tekshirish mumkin.",
          "ru": "Посмотрите ещё раз: после задания значения икс предложение завершено и его истинность можно проверить.",
          "en": "Look again: once x has a value, the sentence is complete and its truth can be checked."
        }
      ]
    }
  },
  "s11": {
    "eyebrow": {
      "uz": "Mashq 4/6",
      "ru": "Задание 4/6",
      "en": "Task 4/6"
    },
    "title": {
      "uz": "Va mulohazasi",
      "ru": "Высказывание с «и»",
      "en": "An “and” statement"
    },
    "scene": "logic-test-and",
    "closedSet": true,
    "frames": [
      {
        "uz": "18 juft va 3 ga bo'linadi",
        "ru": "18 — чётное число и делится на 3",
        "en": "18 is even and divisible by 3"
      },
      {
        "uz": "Ikkala qismni alohida tekshiring",
        "ru": "Проверьте обе части отдельно",
        "en": "Check both parts separately"
      }
    ],
    "question": {
      "uz": "18 juft va 3 ga bo'linadi. Bu mulohaza rostmi yoki yolg'onmi?",
      "ru": "18 — чётное число и делится на 3. Это высказывание истинно или ложно?",
      "en": "18 is even AND divisible by 3. Is this statement true or false?"
    },
    "options": [
      {
        "uz": "Rost",
        "ru": "Истина",
        "en": "True"
      },
      {
        "uz": "Yolg'on",
        "ru": "Ложь",
        "en": "False"
      },
      {
        "uz": "Mulohaza emas",
        "ru": "Не высказывание",
        "en": "Not a statement"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Ikkala qism ham rost",
      "ru": "Обе части истинны",
      "en": "Both parts are true"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. O'n sakkiz juft va uchga qoldiqsiz bo'linadi, demak ikkala qism ham rost.",
        "ru": "Верно. Восемнадцать чётное и делится на три без остатка, поэтому обе части истинны.",
        "en": "Correct. Eighteen is even and is divisible by three without a remainder, so both parts are true."
      },
      {
        "uz": "Yana bir qarang: o'n sakkizning juftligi ham, uchga bo'linishi ham rost.",
        "ru": "Посмотрите ещё раз: истинно и то, что восемнадцать чётное, и то, что оно делится на три.",
        "en": "Look again: both claims are true: eighteen is even and it is divisible by three."
      },
      {
        "uz": "Yana bir qarang: bu tugallangan gap va uning ikkala qismini ham tekshirish mumkin.",
        "ru": "Посмотрите ещё раз: это завершённое предложение, и обе его части можно проверить.",
        "en": "Look again: this is a complete sentence and both of its parts can be checked."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "O'n sakkiz juft va uchga bo'linadi",
          "Ikkala qismni alohida tekshiring"
        ],
        "ru": [
          "Восемнадцать чётное число и делится на три",
          "Проверьте обе части отдельно"
        ],
        "en": [
          "Eighteen is even and divisible by three",
          "Check both parts separately"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. O'n sakkiz juft va uchga qoldiqsiz bo'linadi, demak ikkala qism ham rost.",
        "ru": "Верно. Восемнадцать чётное и делится на три без остатка, поэтому обе части истинны.",
        "en": "Correct. Eighteen is even and is divisible by three without a remainder, so both parts are true."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. O'n sakkiz juft va uchga qoldiqsiz bo'linadi, demak ikkala qism ham rost.",
          "ru": "Верно. Восемнадцать чётное и делится на три без остатка, поэтому обе части истинны.",
          "en": "Correct. Eighteen is even and is divisible by three without a remainder, so both parts are true."
        },
        {
          "uz": "Yana bir qarang: o'n sakkizning juftligi ham, uchga bo'linishi ham rost.",
          "ru": "Посмотрите ещё раз: истинно и то, что восемнадцать чётное, и то, что оно делится на три.",
          "en": "Look again: both claims are true: eighteen is even and it is divisible by three."
        },
        {
          "uz": "Yana bir qarang: bu tugallangan gap va uning ikkala qismini ham tekshirish mumkin.",
          "ru": "Посмотрите ещё раз: это завершённое предложение, и обе его части можно проверить.",
          "en": "Look again: this is a complete sentence and both of its parts can be checked."
        }
      ]
    }
  },
  "s12": {
    "eyebrow": {
      "uz": "Mashq 5/6",
      "ru": "Задание 5/6",
      "en": "Task 5/6"
    },
    "title": {
      "uz": "Bit ikki misol bilan isbotladi",
      "ru": "Бит доказал двумя примерами",
      "en": "Bit proved it with two examples"
    },
    "scene": "logic-error",
    "closedSet": true,
    "frames": [
      {
        "uz": "Bit: 8 va 12 sonlari 4 ga bo'linadi",
        "ru": "Бит: 8 и 12 делятся на 4",
        "en": "Bit: 8 and 12 are divisible by 4"
      },
      {
        "uz": "Bit: barcha juft sonlar 4 ga bo'linadi",
        "ru": "Бит: все чётные числа делятся на 4",
        "en": "Bit: all even numbers are divisible by 4"
      }
    ],
    "question": {
      "uz": "Bitning xatosi nimada?",
      "ru": "В чём ошибка Бита?",
      "en": "What is Bit's mistake?"
    },
    "options": [
      {
        "uz": "Ikki misol barcha holatlarni isbotlamaydi",
        "ru": "Два примера не доказывают все случаи",
        "en": "Two examples do not prove every case"
      },
      {
        "uz": "Barcha juft sonlar 4 ga bo'linadi",
        "ru": "Все чётные числа делятся на 4",
        "en": "All even numbers are divisible by 4"
      },
      {
        "uz": "8 va 12 juft emas",
        "ru": "8 и 12 не являются чётными",
        "en": "8 and 12 are not even"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "6 soni 4 ga bo'linmaydi",
      "ru": "Число 6 не делится на 4",
      "en": "The number 6 is not divisible by 4"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Ikki misol barcha juft sonlar haqidagi xulosani isbotlamaydi; olti qarshi misol bo'ladi.",
        "ru": "Верно. Два примера не доказывают утверждение обо всех чётных числах; число шесть служит контрпримером.",
        "en": "Correct. Two examples do not prove a claim about every even number; six is a counterexample."
      },
      {
        "uz": "Yana bir qarang: olti juft, ammo to'rtga qoldiqsiz bo'linmaydi; demak umumiy xulosa yolg'on.",
        "ru": "Посмотрите ещё раз: число шесть чётное, но оно не делится на четыре без остатка; общий вывод ложен.",
        "en": "Look again: six is even but is not divisible by four, so the general claim is false."
      },
      {
        "uz": "Yana bir qarang: sakkiz ham, o'n ikki ham juft; xato ularni barcha juft sonlarga umumlashtirishda.",
        "ru": "Посмотрите ещё раз: и восемь, и двенадцать чётные; ошибка состоит в переносе этих примеров на все чётные числа.",
        "en": "Look again: eight and twelve are both even; the mistake is generalising from them to every even number."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Bit sakkiz va o'n ikki sonlari to'rtga bo'linadi, dedi",
          "Bit barcha juft sonlar to'rtga bo'linadi, degan xulosa chiqardi"
        ],
        "ru": [
          "Бит сказал, что восемь и двенадцать делятся на четыре",
          "На этом основании Бит решил, что все чётные числа делятся на четыре"
        ],
        "en": [
          "Bit said that eight and twelve are divisible by four",
          "From those examples, Bit concluded that every even number is divisible by four"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Ikki misol barcha juft sonlar haqidagi xulosani isbotlamaydi; olti qarshi misol bo'ladi.",
        "ru": "Верно. Два примера не доказывают утверждение обо всех чётных числах; число шесть служит контрпримером.",
        "en": "Correct. Two examples do not prove a claim about every even number; six is a counterexample."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Ikki misol barcha juft sonlar haqidagi xulosani isbotlamaydi; olti qarshi misol bo'ladi.",
          "ru": "Верно. Два примера не доказывают утверждение обо всех чётных числах; число шесть служит контрпримером.",
          "en": "Correct. Two examples do not prove a claim about every even number; six is a counterexample."
        },
        {
          "uz": "Yana bir qarang: olti juft, ammo to'rtga qoldiqsiz bo'linmaydi; demak umumiy xulosa yolg'on.",
          "ru": "Посмотрите ещё раз: число шесть чётное, но оно не делится на четыре без остатка; общий вывод ложен.",
          "en": "Look again: six is even but is not divisible by four, so the general claim is false."
        },
        {
          "uz": "Yana bir qarang: sakkiz ham, o'n ikki ham juft; xato ularni barcha juft sonlarga umumlashtirishda.",
          "ru": "Посмотрите ещё раз: и восемь, и двенадцать чётные; ошибка состоит в переносе этих примеров на все чётные числа.",
          "en": "Look again: eight and twelve are both even; the mistake is generalising from them to every even number."
        }
      ]
    }
  },
  "s13": {
    "eyebrow": {
      "uz": "Mashq 6/6",
      "ru": "Задание 6/6",
      "en": "Task 6/6"
    },
    "title": {
      "uz": "Lumo kodi",
      "ru": "Код Lumo",
      "en": "Lumo code"
    },
    "scene": "logic-case",
    "closedSet": true,
    "frames": [
      {
        "uz": "Son juft",
        "ru": "Число чётное",
        "en": "The number is even"
      },
      {
        "uz": "Son 10 dan katta",
        "ru": "Число больше 10",
        "en": "The number is greater than 10"
      },
      {
        "uz": "Son 16 dan kichik",
        "ru": "Число меньше 16",
        "en": "The number is less than 16"
      }
    ],
    "question": {
      "uz": "Qaysi son barcha shartlarga mos?",
      "ru": "Какое число подходит всем условиям?",
      "en": "Which number satisfies every condition?"
    },
    "options": [
      {
        "uz": "11",
        "ru": "11",
        "en": "11"
      },
      {
        "uz": "12",
        "ru": "12",
        "en": "12"
      },
      {
        "uz": "17",
        "ru": "17",
        "en": "17"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "12 juft, 10 dan katta va 16 dan kichik",
      "ru": "12 — чётное, больше 10 и меньше 16",
      "en": "12 is even, greater than 10 and less than 16"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: o'n bir o'ndan katta va o'n oltidan kichik, lekin juft son emas.",
        "ru": "Посмотрите ещё раз: одиннадцать больше десяти и меньше шестнадцати, но это нечётное число.",
        "en": "Look again: eleven is greater than ten and less than sixteen, but it is odd."
      },
      {
        "uz": "To'g'ri. O'n ikki juft, o'ndan katta va o'n oltidan kichik.",
        "ru": "Верно. Двенадцать является чётным числом, больше десяти и меньше шестнадцати.",
        "en": "Correct. Twelve is even, greater than ten and less than sixteen."
      },
      {
        "uz": "Yana bir qarang: o'n yetti juft emas va o'n oltidan kichik bo'lish shartiga ham mos kelmaydi.",
        "ru": "Посмотрите ещё раз: семнадцать нечётное и не выполняет условие быть меньше шестнадцати.",
        "en": "Look again: seventeen is odd and also fails the condition of being less than sixteen."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Son juft",
          "Son o'ndan katta",
          "Son o'n oltidan kichik"
        ],
        "ru": [
          "Число чётное",
          "Число больше десяти",
          "Число меньше шестнадцати"
        ],
        "en": [
          "The number is even",
          "The number is greater than ten",
          "The number is less than sixteen"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. O'n ikki juft, o'ndan katta va o'n oltidan kichik.",
        "ru": "Верно. Двенадцать является чётным числом, больше десяти и меньше шестнадцати.",
        "en": "Correct. Twelve is even, greater than ten and less than sixteen."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: o'n bir o'ndan katta va o'n oltidan kichik, lekin juft son emas.",
          "ru": "Посмотрите ещё раз: одиннадцать больше десяти и меньше шестнадцати, но это нечётное число.",
          "en": "Look again: eleven is greater than ten and less than sixteen, but it is odd."
        },
        {
          "uz": "To'g'ri. O'n ikki juft, o'ndan katta va o'n oltidan kichik.",
          "ru": "Верно. Двенадцать является чётным числом, больше десяти и меньше шестнадцати.",
          "en": "Correct. Twelve is even, greater than ten and less than sixteen."
        },
        {
          "uz": "Yana bir qarang: o'n yetti juft emas va o'n oltidan kichik bo'lish shartiga ham mos kelmaydi.",
          "ru": "Посмотрите ещё раз: семнадцать нечётное и не выполняет условие быть меньше шестнадцати.",
          "en": "Look again: seventeen is odd and also fails the condition of being less than sixteen."
        }
      ]
    }
  },
  "s14": {
    "eyebrow": {
      "uz": "Yakun",
      "ru": "Итог",
      "en": "Summary"
    },
    "title": {
      "uz": "Gapdan dalilgacha",
      "ru": "От предложения к доказательству",
      "en": "From sentence to evidence"
    },
    "scene": "logic-final",
    "frames": [
      {
        "uz": "Tugallangan darak gap",
        "ru": "Завершённое повествовательное предложение",
        "en": "A complete declarative sentence"
      },
      {
        "uz": "Tekshirish mumkin",
        "ru": "Можно проверить",
        "en": "It can be checked"
      },
      {
        "uz": "Rost yoki yolg'on",
        "ru": "Истина или ложь",
        "en": "True or false"
      },
      {
        "uz": "Dalil yoki qarshi misol",
        "ru": "Доказательство или контрпример",
        "en": "Evidence or a counterexample"
      },
      {
        "uz": "Keyingi mavzu: grafiklar",
        "ru": "Следующая тема: графики",
        "en": "Next topic: graphs"
      }
    ],
    "audio": {
      "uz": [
        "Tugallangan darak gap",
        "Tekshirish mumkin",
        "Rost yoki yolg'on",
        "Dalil yoki qarshi misol",
        "Keyingi mavzu grafiklar"
      ],
      "ru": [
        "Завершённое повествовательное предложение",
        "Можно проверить",
        "Истина или ложь",
        "Доказательство или контрпример",
        "Следующая тема графики"
      ],
      "en": [
        "A complete declarative sentence",
        "It can be checked",
        "True or false",
        "Evidence or a counterexample",
        "Next topic graphs"
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
const RelationCards = ({ items, frame }) => <div className="relation-cards">{items.map((item, index) => <span className={index <= frame ? 'active' : ''} key={item}>{item}</span>)}</div>;
function ConversionVisual({ c, frame }) {
  const t = useT();
  const kind = String(c.scene || 'review').split('-')[0];
  const items = (c.frames || []).map((item) => t(item));
  const shown = Math.min(items.length, frame + 1);
  if (kind === 'route') {
    const shift = Math.min(36, frame * 12);
    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ width: '92%', height: 62, position: 'relative', display: 'grid', alignItems: 'center' }}>
        <div style={{ height: 8, borderRadius: 99, background: '#D7E5E4' }}/>
        <i style={{ position: 'absolute', left: `${8 + shift}%`, width: 25, height: 25, borderRadius: '50%', background: T.cyan, boxShadow: '0 0 0 7px rgba(22,143,163,.12)', transition: 'left .8s ease' }}/>
        <i style={{ position: 'absolute', right: `${8 + shift}%`, width: 25, height: 25, borderRadius: '50%', background: T.accent, boxShadow: '0 0 0 7px rgba(255,91,53,.12)', transition: 'right .8s ease' }}/>
        <b style={{ position: 'absolute', left: '50%', top: 2, transform: 'translateX(-50%)', color: T.navy, font: "900 12px 'JetBrains Mono',monospace" }}>S</b>
      </div>
      <RelationCards items={items.slice(0, 4)} frame={frame}/>
    </div>;
  }
  if (kind === 'fraction') {
    const active = Math.min(8, shown * 2);
    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ width: '92%', display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 4 }}>
        {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ height: 54, borderRadius: 8, background: index < active ? T.cyan : '#DCE8E7', transform: index < active ? 'scaleY(1)' : 'scaleY(.72)', transformOrigin: 'bottom', transition: 'all .45s ease' }}/>)}
      </div>
      <RelationCards items={items.slice(0, 4)} frame={frame}/>
    </div>;
  }
  if (kind === 'inequality') {
    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ width: '94%', position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 5 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 4, borderRadius: 9, background: '#C9DBDA' }}/>
        {Array.from({ length: 10 }, (_, index) => <span key={index} style={{ zIndex: 1, display: 'grid', gap: 5, justifyItems: 'center', color: T.navy, font: "900 11px 'JetBrains Mono',monospace" }}><i style={{ width: 20, height: 20, borderRadius: '50%', background: index <= frame + 1 ? T.cyan : '#FFF', boxShadow: '0 4px 10px -6px rgba(23,59,82,.6)', transition: 'all .4s ease' }}/>{index}</span>)}
      </div>
      <RelationCards items={items.slice(0, 4)} frame={frame}/>
    </div>;
  }
  if (kind === 'addition') {
    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {items.slice(0, 4).map((item, index) => <span key={index} style={{ minWidth: 78, padding: '13px 10px', borderRadius: 14, opacity: index < shown ? 1 : .18, transform: index < shown ? 'translateY(0)' : 'translateY(8px)', color: index === shown - 1 ? '#FFF' : T.navy, background: index === shown - 1 ? T.cyan : '#FFF', textAlign: 'center', font: "900 13px 'JetBrains Mono',monospace", transition: 'all .4s ease' }}>{item}</span>)}
      </div>
    </div>;
  }
  if (kind === 'logic') {
    const scene = String(c.scene || 'logic-hook');
    const badge = (value, active = true, tone = T.cyan) => <span style={{ minWidth: 54, height: 54, padding: '0 9px', border: '2px solid rgba(23,59,82,.12)', borderRadius: 16, display: 'grid', placeItems: 'center', opacity: active ? 1 : .2, color: active ? '#FFF' : T.navy, background: active ? tone : '#FFF', font: "900 14px 'JetBrains Mono',monospace", transition: 'all .4s ease' }}>{value}</span>;
    if (scene === 'logic-hook' || scene === 'logic-counterexample') {
      const closed = scene === 'logic-counterexample' || frame >= 2;
      return <div className="conversion-visual" aria-label={t(c.title)}>
        <div style={{ display: 'flex', alignItems: 'end', gap: 22 }}>
          <span style={{ width: 118, height: 68, border: `5px solid ${T.cyan}`, borderRadius: 6, background: '#FFF', transform: frame >= 1 ? 'scale(1)' : 'scale(.84)', transition: 'all .55s ease' }}/>
          <span style={{ width: 68, height: 68, border: `5px solid ${T.navy}`, borderRadius: 6, background: '#FFF', opacity: frame >= 1 ? 1 : .18, transition: 'all .55s ease' }}/>
        </div>
        <strong style={{ minWidth: 92, padding: '8px 13px', borderRadius: 12, opacity: closed ? 1 : .18, color: '#FFF', background: closed ? T.accent : T.navy, textAlign: 'center', transition: 'all .4s ease' }}>{closed ? t(bi("Yolg'on", 'Ложно', 'False')) : '?'}</strong>
      </div>;
    }
    if (scene === 'logic-types') {
      const marks = ['✓', '×', '?', '!'];
      const tones = [T.success, T.accent, T.cyan, T.warn];
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,54px)', gap: 9 }}>{marks.map((mark, index) => <React.Fragment key={mark}>{badge(mark, index <= frame, tones[index])}</React.Fragment>)}</div><RelationCards items={items.slice(0, 4)} frame={frame}/></div>;
    }
    if (scene === 'logic-evidence') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,58px)', gap: 9 }}>{['∑', '▦', '◇', '≠'].map((mark, index) => <React.Fragment key={mark}>{badge(mark, index <= frame, index === 3 ? T.accent : T.cyan)}</React.Fragment>)}</div><RelationCards items={items.slice(0, 4)} frame={frame}/></div>;
    }
    if (scene === 'logic-open') {
      return <div className="conversion-visual" aria-label={t(c.title)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{['8', '12', '6'].map((value, index) => <React.Fragment key={value}>{badge(value, index < 2 || frame >= 2, index === 2 && frame >= 2 ? T.accent : T.cyan)}</React.Fragment>)}</div>
        {frame >= 3 && <strong style={{ color: T.accent }}>{t(bi("Qarshi misol", 'Контрпример', 'Counterexample'))}: 6</strong>}
      </div>;
    }
    if (scene === 'logic-and') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{badge('x', true, T.navy)}<b style={{ color: T.accent, fontSize: 26 }}>→</b>{badge(frame >= 2 ? '5' : '?', frame >= 1, T.cyan)}</div>{frame >= 3 && <strong style={{ color: T.success, font: "900 15px 'JetBrains Mono',monospace" }}>5+3=8 ✓</strong>}</div>;
    }
    if (scene === 'logic-or' || scene === 'logic-test-and') {
      const testing = scene === 'logic-test-and';
      return <div className="conversion-visual" aria-label={t(c.title)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{badge(testing ? '18÷2' : 'A', !testing && frame >= 1, T.success)}<strong style={{ color: T.navy }}>{t(bi('VA', 'И', 'AND'))}</strong>{badge(testing ? '18÷3' : 'B', !testing && frame >= 1, T.success)}</div>
        {!testing && frame >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{badge('A', true, T.success)}<strong style={{ color: T.navy }}>{t(bi('YOKI', 'ИЛИ', 'OR'))}</strong>{badge('B', frame >= 3, T.success)}</div>}
      </div>;
    }
    if (scene === 'logic-test-substitute') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{badge('x+4>10', true, T.navy)}<b style={{ color: T.accent, fontSize: 24 }}>x=8</b></div></div>;
    }
    if (scene === 'logic-error') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{badge('8', true)}{badge('12', true)}<b style={{ color: T.navy, fontSize: 24 }}>⇒ ?</b>{badge('6', frame >= 1, T.accent)}</div></div>;
    }
    if (scene === 'logic-case') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{['11', '12', '17'].map((value) => <React.Fragment key={value}>{badge(value, true, T.navy)}</React.Fragment>)}</div><div style={{ display: 'flex', gap: 7 }}>{[t(bi('juft', 'чётное', 'even')), '>10', '<16'].map((value) => <small key={value} style={{ padding: '5px 9px', borderRadius: 9, color: T.cyan, background: '#FFF', fontWeight: 900 }}>{value}</small>)}</div></div>;
    }
    if (scene === 'logic-final' || scene === 'logic-definition') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>{items.slice(0, 5).map((item, index) => <React.Fragment key={index}>{badge(index + 1, index <= frame, index === items.length - 1 ? T.success : T.cyan)}{index < Math.min(4, items.length - 1) && <b style={{ color: T.ink3 }}>→</b>}</React.Fragment>)}</div></div>;
    }
    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
        {items.slice(0, 4).map((item, index) => <span key={index} style={{ minHeight: 58, padding: 10, borderRadius: 14, display: 'grid', placeItems: 'center', opacity: index < shown ? 1 : .16, color: index === shown - 1 ? '#FFF' : T.ink, background: index === shown - 1 ? T.navy : '#FFF', textAlign: 'center', fontWeight: 850, transition: 'all .4s ease' }}>{item}</span>)}
      </div>
    </div>;
  }
  if (kind === 'chart') {
    const heights = [38, 66, 52, 82];
    return <div className="conversion-visual" aria-label={t(c.title)}>
      <div style={{ width: '88%', height: 132, padding: '8px 10px 0', borderLeft: '3px solid #173B52', borderBottom: '3px solid #173B52', display: 'flex', alignItems: 'end', justifyContent: 'space-around', gap: 10 }}>
        {heights.map((height, index) => <i key={index} style={{ width: '17%', height: index < shown ? `${height}%` : '8%', borderRadius: '9px 9px 0 0', background: index === shown - 1 ? T.accent : T.cyan, transition: 'height .65s cubic-bezier(.16,1,.3,1),background .35s ease' }}/>)}
      </div>
      <RelationCards items={items.slice(0, 4)} frame={frame}/>
    </div>;
  }
  return <div className="conversion-visual" aria-label={t(c.title)}>
    <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
      {items.slice(0, 4).map((item, index) => <span key={index} style={{ padding: 13, borderRadius: 14, opacity: index < shown ? 1 : .16, transform: index < shown ? 'scale(1)' : 'scale(.94)', color: index === shown - 1 ? '#FFF' : T.navy, background: index === shown - 1 ? T.cyan : '#FFF', textAlign: 'center', fontWeight: 850, transition: 'all .4s ease' }}>{item}</span>)}
    </div>
  </div>;
}
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
function HookScreen({ screen, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const choose = (index) => { setPicked(index); audio.pushOneOff(t(c.neutral)); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state="think" showBit/><section className="model-card hook-card"><ConversionVisual c={c} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><section className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" className={'option ' + (picked === index ? 'picked' : '')} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div>{picked !== null && <div className="feedback open neutral"><b>◆</b><p>{t(c.neutral)}</p></div>}</section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext, finishLesson }) { const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const summary = screen === 14; const cycle = ['focus', 'point', 'idea']; const bitState = screen === 7 ? 'happy' : cycle[(screen - 1) % cycle.length]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={summary ? finishLesson : onNext} finish={summary}><div className="stack"><Heading c={c} state={summary ? 'wave' : bitState} showBit/><section className={'model-card ' + (summary ? 'summary-card' : '')}><ConversionVisual c={c} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const bitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const revealed = picked !== null; const correct = picked === c.correctIndex; const choose = (index) => { const ok = index === c.correctIndex; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><ConversionVisual c={c} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = revealed && index === picked ? (index === c.correctIndex ? 'right' : 'bad') : ''; return <button type="button" className={'option ' + cls} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div>{revealed && <><div className={'feedback open ' + (correct ? 'correct' : 'wrong')}><b>{correct ? '✓' : '!'}</b><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div><div className="proof">{t(c.proof)}</div></>}</div></section></div></Stage>; }
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
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} state="happy" showBit/><section className="model-card summary-card"><ConversionVisual c={c} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><G4TitleReward unlocked={unlocked} title={{"uz":"Mantiqiy dalil ustasi","ru":"Мастер логических доказательств","en":"Logical reasoning expert"}} answers={answers}/></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars49({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars49 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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

const STYLES = `${G4_TITLE_STYLES}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{flex:0 0 auto;padding-top:14px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:38px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:31px;height:31px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow-y:auto}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover{color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{display:grid;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading.heading-solo{justify-content:flex-start}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:center;gap:18px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{display:grid;gap:8px}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:58px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover{transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:11px 14px;border-radius:13px;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{display:grid;grid-template-columns:.85fr 1.15fr;gap:14px}.test-model{display:grid;align-content:center;gap:12px}.caption{position:sticky;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;z-index:3}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.test-layout{grid-template-columns:1fr}.model-card,.question,.test-model{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.conversion-visual{min-height:170px}.reveal-card{min-height:43px}.test-model .reveal-grid{display:none}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;
