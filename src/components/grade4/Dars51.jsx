import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// 4-sinf · Dars 51 · Bog'langan yakuniy o'quv takrorlash
// 15 ekran · 50 asosiy audio beat · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "review-4-51-v1", slug: "dars51-yakuniy-takrorlash", lessonTitle: {"uz":"O'rganilgan mavzularni yakuniy takrorlash","ru":"Итоговое повторение изученных тем","en":"Final connected review"}, skillTags: ["integrated-review","model-selection","reasoning","explanation"] };
const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'test', template: 'MCScreen', scored: false, scope: 'module-mikro' },
  { id: 's9', type: 'test', template: 'MCScreen', scored: false, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'MCScreen', scored: false, scope: 'module-mikro' },
  { id: 's11', type: 'test', template: 'MCScreen', scored: false, scope: 'module-mikro' },
  { id: 's12', type: 'test', template: 'MCScreen', scored: false, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'MCScreen', scored: false, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Lumo shahrini ishga tushirish",
      "ru": "Запуск города Лумо",
      "en": "Launching Lumo City"
    },
    "title": {
      "uz": "Lumo shahrini qayta ishga tushirish",
      "ru": "Перезапуск города Lumo",
      "en": "Restarting Lumo City"
    },
    "scene": "review-hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "Lumo shahri: sonlar, kasrlar, kattaliklar, geometriya va grafiklar",
        "ru": "Город Lumo: числа, дроби, величины, геометрия и графики",
        "en": "Lumo City: numbers, fractions, measures, geometry and graphs"
      },
      {
        "uz": "Bitta hisoblash usuli barcha modullarga mos kelmaydi",
        "ru": "Один способ вычисления подходит не каждому модулю",
        "en": "A single calculation method does not fit every module"
      },
      {
        "uz": "Avval mos modelni tanlang",
        "ru": "Сначала выберите подходящую модель",
        "en": "Choose the right model first"
      }
    ],
    "question": {
      "uz": "Eng ishonchli yondashuv qaysi?",
      "ru": "Какой подход самый надёжный?",
      "en": "Which approach is most reliable?"
    },
    "options": [
      {
        "uz": "Modelni tanlash, hisoblash va tekshirish",
        "ru": "Выбрать модель, вычислить и проверить",
        "en": "Choose a model, calculate and check"
      },
      {
        "uz": "Har safar faqat qo'shish",
        "ru": "Всегда только складывать",
        "en": "Always use addition"
      },
      {
        "uz": "Javobni taxmin qilish",
        "ru": "Угадать ответ",
        "en": "Guess the answer"
      }
    ],
    "neutral": {
      "uz": "Lumo shahrining har bir moduli uchun mos modelni tanlab ko'ramiz.",
      "ru": "Подберём подходящую модель для каждого модуля города Лумо.",
      "en": "We will choose a suitable model for each Lumo City module."
    },
    "audio": {
      "intro": {
        "uz": [
          "Lumo shahri sonlar kasrlar kattaliklar geometriya va grafiklar",
          "Bitta hisoblash usuli barcha modullarga mos kelmaydi",
          "Avval mos modelni tanlang"
        ],
        "ru": [
          "Город Lumo числа дроби величины геометрия и графики",
          "Один способ вычисления подходит не каждому модулю",
          "Сначала выберите подходящую модель"
        ],
        "en": [
          "Lumo City numbers fractions measures geometry and graphs",
          "A single calculation method does not fit every module",
          "Choose the right model first"
        ]
      }
    }
  },
  "s1": {
    "eyebrow": {
      "uz": "Fikrlash sikli",
      "ru": "Цикл рассуждения",
      "en": "Reasoning cycle"
    },
    "title": {
      "uz": "Universal fikrlash sikli",
      "ru": "Универсальный цикл мышления",
      "en": "Universal thinking cycle"
    },
    "scene": "review-cycle",
    "frames": [
      {
        "uz": "Tushuning",
        "ru": "Поймите",
        "en": "Understand"
      },
      {
        "uz": "Mos modelni tanlang",
        "ru": "Выберите подходящую модель",
        "en": "Choose a suitable model"
      },
      {
        "uz": "Hisoblang",
        "ru": "Вычислите",
        "en": "Calculate"
      },
      {
        "uz": "Tekshiring va tushuntiring",
        "ru": "Проверьте и объясните",
        "en": "Check and explain"
      }
    ],
    "audio": {
      "uz": [
        "Tushuning",
        "Mos modelni tanlang",
        "Hisoblang",
        "Tekshiring va tushuntiring"
      ],
      "ru": [
        "Поймите",
        "Выберите подходящую модель",
        "Вычислите",
        "Проверьте и объясните"
      ],
      "en": [
        "Understand",
        "Choose a suitable model",
        "Calculate",
        "Check and explain"
      ]
    }
  },
  "s2": {
    "eyebrow": {
      "uz": "Ko'p xonali sonlar",
      "ru": "Многозначные числа",
      "en": "Multi-digit numbers"
    },
    "title": {
      "uz": "Ko'p xonali sonlar",
      "ru": "Многозначные числа",
      "en": "Multi-digit numbers"
    },
    "scene": "review-number",
    "frames": [
      {
        "uz": "Razryadlar jadvali",
        "ru": "Таблица разрядов",
        "en": "Place-value chart"
      },
      {
        "uz": "Sonni o'qing",
        "ru": "Прочитайте число",
        "en": "Read the number"
      },
      {
        "uz": "Yoyiq ko'rinishni yozing",
        "ru": "Запишите развёрнутую форму",
        "en": "Write the expanded form"
      },
      {
        "uz": "Taxmin bilan tekshiring",
        "ru": "Проверьте оценкой",
        "en": "Check with an estimate"
      }
    ],
    "audio": {
      "uz": [
        "Razryadlar jadvali",
        "Sonni o'qing",
        "Yoyiq ko'rinishni yozing",
        "Taxmin bilan tekshiring"
      ],
      "ru": [
        "Таблица разрядов",
        "Прочитайте число",
        "Запишите развёрнутую форму",
        "Проверьте оценкой"
      ],
      "en": [
        "Place-value chart",
        "Read the number",
        "Write the expanded form",
        "Check with an estimate"
      ]
    }
  },
  "s3": {
    "eyebrow": {
      "uz": "Arifmetik strategiya",
      "ru": "Арифметическая стратегия",
      "en": "Arithmetic strategy"
    },
    "title": {
      "uz": "Qulay hisoblash",
      "ru": "Удобные вычисления",
      "en": "Efficient calculation"
    },
    "scene": "review-addition",
    "frames": [
      {
        "uz": "398+127+2",
        "ru": "398+127+2",
        "en": "398+127+2"
      },
      {
        "uz": "398 va 2 qulay juft",
        "ru": "398 и 2 образуют удобную пару",
        "en": "398 and 2 form a friendly pair"
      },
      {
        "uz": "(398+2)+127",
        "ru": "(398+2)+127",
        "en": "(398+2)+127"
      },
      {
        "uz": "Natija=527",
        "ru": "Результат=527",
        "en": "Result=527"
      }
    ],
    "audio": {
      "uz": [
        "uch yuz to'qson sakkiz qo'shuv bir yuz yigirma yetti qo'shuv ikki",
        "uch yuz to'qson sakkiz va ikki qulay juft",
        "Avval uch yuz to'qson sakkiz bilan ikkini guruhlaymiz, keyin bir yuz yigirma yettini qo'shamiz",
        "Natija teng besh yuz yigirma yetti"
      ],
      "ru": [
        "триста девяносто восемь плюс сто двадцать семь плюс два",
        "триста девяносто восемь и два образуют удобную пару",
        "Сначала группируем триста девяносто восемь и два, затем прибавляем сто двадцать семь",
        "Результат равен пятистам двадцати семи"
      ],
      "en": [
        "three hundred and ninety eight plus one hundred and twenty seven plus two",
        "three hundred and ninety eight and two form a friendly pair",
        "First group three hundred and ninety eight and two, then add one hundred and twenty seven",
        "Result equals five hundred and twenty seven"
      ]
    }
  },
  "s4": {
    "eyebrow": {
      "uz": "Kasr modeli",
      "ru": "Модель дроби",
      "en": "Fraction model"
    },
    "title": {
      "uz": "Kasr, qism va qoldiq",
      "ru": "Дробь, часть и остаток",
      "en": "Fraction, part and remainder"
    },
    "scene": "review-fraction",
    "frames": [
      {
        "uz": "Butun",
        "ru": "Целое",
        "en": "Whole"
      },
      {
        "uz": "Teng ulushlar",
        "ru": "Равные доли",
        "en": "Equal shares"
      },
      {
        "uz": "Olingan qism",
        "ru": "Взятая часть",
        "en": "Part taken"
      },
      {
        "uz": "Qolgan qism",
        "ru": "Оставшаяся часть",
        "en": "Part remaining"
      }
    ],
    "audio": {
      "uz": [
        "Butun",
        "Teng ulushlar",
        "Olingan qism",
        "Qolgan qism"
      ],
      "ru": [
        "Целое",
        "Равные доли",
        "Взятая часть",
        "Оставшаяся часть"
      ],
      "en": [
        "Whole",
        "Equal shares",
        "Part taken",
        "Part remaining"
      ]
    }
  },
  "s5": {
    "eyebrow": {
      "uz": "Geometriya va kattalik",
      "ru": "Геометрия и величины",
      "en": "Geometry and measures"
    },
    "title": {
      "uz": "Kattalik va geometriya",
      "ru": "Величины и геометрия",
      "en": "Measures and geometry"
    },
    "scene": "review-geometry",
    "frames": [
      {
        "uz": "Uzunlik",
        "ru": "Длина",
        "en": "Length"
      },
      {
        "uz": "Hajm",
        "ru": "Объём",
        "en": "Volume"
      },
      {
        "uz": "Perimetr",
        "ru": "Периметр",
        "en": "Perimeter"
      },
      {
        "uz": "Yuza va birliklar",
        "ru": "Площадь и единицы",
        "en": "Area and units"
      }
    ],
    "audio": {
      "uz": [
        "Uzunlik",
        "Hajm",
        "Perimetr",
        "Yuza va birliklar"
      ],
      "ru": [
        "Длина",
        "Объём",
        "Периметр",
        "Площадь и единицы"
      ],
      "en": [
        "Length",
        "Volume",
        "Perimeter",
        "Area and units"
      ]
    }
  },
  "s6": {
    "eyebrow": {
      "uz": "Noma'lum qiymat",
      "ru": "Неизвестное значение",
      "en": "Unknown value"
    },
    "title": {
      "uz": "Tenglama va tengsizlik",
      "ru": "Уравнение и неравенство",
      "en": "Equation and inequality"
    },
    "scene": "review-algebra",
    "frames": [
      {
        "uz": "Bu darslardagi tenglamalarda bittadan ildiz topdik",
        "ru": "В уравнениях этих уроков мы находили один корень",
        "en": "In these lessons, we found one root for each equation"
      },
      {
        "uz": "Teskari amalni tanlang",
        "ru": "Выберите обратное действие",
        "en": "Choose the inverse operation"
      },
      {
        "uz": "Tengsizlikda bir nechta qiymat yechim bo'lishi mumkin",
        "ru": "У неравенства может быть несколько решений",
        "en": "An inequality may have several solutions"
      },
      {
        "uz": "Tartibli tanlash bilan tekshiring",
        "ru": "Проверьте систематическим подбором",
        "en": "Check by systematic trial"
      }
    ],
    "audio": {
      "uz": [
        "Bu darslardagi tenglamalarda bittadan ildiz topdik",
        "Teskari amalni tanlang",
        "Tengsizlikda bir nechta qiymat yechim bo'lishi mumkin",
        "Tartibli tanlash bilan tekshiring"
      ],
      "ru": [
        "В уравнениях этих уроков мы находили по одному корню",
        "Выберите обратное действие",
        "У неравенства может быть несколько решений",
        "Проверьте систематическим подбором"
      ],
      "en": [
        "In these lessons, we found one root for each equation",
        "Choose the inverse operation",
        "An inequality may have several solutions",
        "Check by systematic trial"
      ]
    }
  },
  "s7": {
    "eyebrow": {
      "uz": "Ma'lumot va xulosa",
      "ru": "Данные и вывод",
      "en": "Data and conclusion"
    },
    "title": {
      "uz": "Ma'lumotdan xulosagacha",
      "ru": "От данных к выводу",
      "en": "From data to conclusion"
    },
    "scene": "review-data",
    "frames": [
      {
        "uz": "Jadval",
        "ru": "Таблица",
        "en": "Table"
      },
      {
        "uz": "Grafik",
        "ru": "График",
        "en": "Graph"
      },
      {
        "uz": "Masshtab",
        "ru": "Масштаб",
        "en": "Scale"
      },
      {
        "uz": "Matematik mulohaza",
        "ru": "Математическое высказывание",
        "en": "Mathematical statement"
      },
      {
        "uz": "Tushuning → modelni tanlang → hisoblang → tekshiring",
        "ru": "Поймите → выберите модель → вычислите → проверьте",
        "en": "Understand → choose a model → calculate → check"
      }
    ],
    "audio": {
      "uz": [
        "Jadval",
        "Grafik",
        "Masshtab",
        "Matematik mulohaza",
        "Shunday qilib, kirishdagi eng ishonchli yondashuvni tasdiqladik: vaziyatni tushunamiz, mos modelni tanlaymiz, hisoblaymiz va tekshiramiz"
      ],
      "ru": [
        "Таблица",
        "График",
        "Масштаб",
        "Математическое высказывание",
        "Так мы подтвердили самый надёжный подход из начала урока: понимаем ситуацию, выбираем подходящую модель, вычисляем и проверяем"
      ],
      "en": [
        "Table",
        "Graph",
        "Scale",
        "Mathematical statement",
        "This confirms the most reliable approach from the opening: understand the situation, choose a suitable model, calculate and check"
      ]
    }
  },
  "s8": {
    "eyebrow": {
      "uz": "Bog'lash 1/6",
      "ru": "Связь 1/6",
      "en": "Connection 1/6"
    },
    "title": {
      "uz": "Razryadli yozuv",
      "ru": "Разрядная запись",
      "en": "Place-value form"
    },
    "scene": "review-test-place",
    "closedSet": true,
    "frames": [
      {
        "uz": "507 042",
        "ru": "507 042",
        "en": "507 042"
      },
      {
        "uz": "Razryadli yozuvni tanlang",
        "ru": "Выберите разрядную запись",
        "en": "Choose the place-value form"
      }
    ],
    "question": {
      "uz": "Qaysi yoyiq yozuv to'g'ri?",
      "ru": "Какая развёрнутая запись верна?",
      "en": "Which expanded form is correct?"
    },
    "options": [
      {
        "uz": "500 000+7 000+40+2",
        "ru": "500 000+7 000+40+2",
        "en": "500 000+7 000+40+2"
      },
      {
        "uz": "50 000+7 000+42",
        "ru": "50 000+7 000+42",
        "en": "50 000+7 000+42"
      },
      {
        "uz": "500 000+700+42",
        "ru": "500 000+700+42",
        "en": "500 000+700+42"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "507 042=500 000+7 000+40+2",
      "ru": "507 042=500 000+7 000+40+2",
      "en": "507 042=500 000+7 000+40+2"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Razryadlar o'z o'rnida yozildi.",
        "ru": "Верно. Все разряды записаны на своих местах.",
        "en": "Correct. Every place value is in its proper position."
      },
      {
        "uz": "Yana bir qarang: birinchi qo'shiluvchi ellik ming bo'lib qolgan; son esa besh yuz minglikdan boshlanadi.",
        "ru": "Посмотрите ещё раз: первое слагаемое стало пятьюдесятью тысячами, а число начинается с пятисот тысяч.",
        "en": "Look again: the first addend is only fifty thousand, while the number begins with five hundred thousand."
      },
      {
        "uz": "Yana bir qarang: yetti ming o'rniga yetti yuz yozilgan, shuning uchun minglik razryadi yo'qolgan.",
        "ru": "Посмотрите ещё раз: вместо семи тысяч записано семьсот, поэтому разряд тысяч потерян.",
        "en": "Look again: seven hundred was written instead of seven thousand, so the thousands place is lost."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "besh yuz yetti ming qirq ikki",
          "Razryadli yozuvni tanlang"
        ],
        "ru": [
          "пятьсот семь тысяч сорок два",
          "Выберите разрядную запись"
        ],
        "en": [
          "five hundred and seven thousand forty two",
          "Choose the place-value form"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Razryadlar o'z o'rnida yozildi.",
        "ru": "Верно. Все разряды записаны на своих местах.",
        "en": "Correct. Every place value is in its proper position."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Razryadlar o'z o'rnida yozildi.",
          "ru": "Верно. Все разряды записаны на своих местах.",
          "en": "Correct. Every place value is in its proper position."
        },
        {
          "uz": "Yana bir qarang: birinchi qo'shiluvchi ellik ming bo'lib qolgan; son esa besh yuz minglikdan boshlanadi.",
          "ru": "Посмотрите ещё раз: первое слагаемое стало пятьюдесятью тысячами, а число начинается с пятисот тысяч.",
          "en": "Look again: the first addend is only fifty thousand, while the number begins with five hundred thousand."
        },
        {
          "uz": "Yana bir qarang: yetti ming o'rniga yetti yuz yozilgan, shuning uchun minglik razryadi yo'qolgan.",
          "ru": "Посмотрите ещё раз: вместо семи тысяч записано семьсот, поэтому разряд тысяч потерян.",
          "en": "Look again: seven hundred was written instead of seven thousand, so the thousands place is lost."
        }
      ]
    }
  },
  "s9": {
    "eyebrow": {
      "uz": "Bog'lash 2/6",
      "ru": "Связь 2/6",
      "en": "Connection 2/6"
    },
    "title": {
      "uz": "Qulay yig'indi",
      "ru": "Удобная сумма",
      "en": "Efficient sum"
    },
    "scene": "review-test-addition",
    "closedSet": true,
    "frames": [
      {
        "uz": "398+127+2",
        "ru": "398+127+2",
        "en": "398+127+2"
      },
      {
        "uz": "Qulay juftni tanlang",
        "ru": "Выберите удобную пару",
        "en": "Choose a friendly pair"
      }
    ],
    "question": {
      "uz": "Qaysi reja eng qulay?",
      "ru": "Какой план самый удобный?",
      "en": "Which plan is most efficient?"
    },
    "options": [
      {
        "uz": "(398+2)+127=527",
        "ru": "(398+2)+127=527",
        "en": "(398+2)+127=527"
      },
      {
        "uz": "(398+127)+2=527",
        "ru": "(398+127)+2=527",
        "en": "(398+127)+2=527"
      },
      {
        "uz": "398+(127−2)=523",
        "ru": "398+(127−2)=523",
        "en": "398+(127−2)=523"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "(398+2)+127=527",
      "ru": "(398+2)+127=527",
      "en": "(398+2)+127=527"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Qulay juft yumaloq son hosil qildi.",
        "ru": "Верно. Удобная пара дала круглое число.",
        "en": "Correct. The friendly pair makes a round number."
      },
      {
        "uz": "Yana bir qarang: bu tartib avval noqulay juftni hisoblaydi.",
        "ru": "Посмотрите ещё раз: этот порядок сначала вычисляет неудобную пару.",
        "en": "Look again: this order calculates the awkward pair first."
      },
      {
        "uz": "Yana bir qarang: ayirish qo'shiluvchilardan birini o'zgartirib yubordi.",
        "ru": "Посмотрите ещё раз: вычитание изменило одно из слагаемых.",
        "en": "Look again: subtraction changes one of the addends."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "uch yuz to'qson sakkiz qo'shuv bir yuz yigirma yetti qo'shuv ikki",
          "Qulay juftni tanlang"
        ],
        "ru": [
          "триста девяносто восемь плюс сто двадцать семь плюс два",
          "Выберите удобную пару"
        ],
        "en": [
          "three hundred and ninety eight plus one hundred and twenty seven plus two",
          "Choose a friendly pair"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Qulay juft yumaloq son hosil qildi.",
        "ru": "Верно. Удобная пара дала круглое число.",
        "en": "Correct. The friendly pair makes a round number."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Qulay juft yumaloq son hosil qildi.",
          "ru": "Верно. Удобная пара дала круглое число.",
          "en": "Correct. The friendly pair makes a round number."
        },
        {
          "uz": "Yana bir qarang: bu tartib avval noqulay juftni hisoblaydi.",
          "ru": "Посмотрите ещё раз: этот порядок сначала вычисляет неудобную пару.",
          "en": "Look again: this order calculates the awkward pair first."
        },
        {
          "uz": "Yana bir qarang: ayirish qo'shiluvchilardan birini o'zgartirib yubordi.",
          "ru": "Посмотрите ещё раз: вычитание изменило одно из слагаемых.",
          "en": "Look again: subtraction changes one of the addends."
        }
      ]
    }
  },
  "s10": {
    "eyebrow": {
      "uz": "Bog'lash 3/6",
      "ru": "Связь 3/6",
      "en": "Connection 3/6"
    },
    "title": {
      "uz": "Kasr va birlik",
      "ru": "Дробь и единица",
      "en": "Fraction and unit"
    },
    "scene": "review-test-fraction",
    "closedSet": true,
    "frames": [
      {
        "uz": "2 kg massaning 3/5 qismi",
        "ru": "3/5 от 2 кг",
        "en": "3/5 of 2 kg"
      },
      {
        "uz": "Grammlarda toping",
        "ru": "Найдите в граммах",
        "en": "Find the mass in grams"
      }
    ],
    "question": {
      "uz": "Massa nechaga teng?",
      "ru": "Чему равна масса?",
      "en": "What is the mass?"
    },
    "options": [
      {
        "uz": "600 g",
        "ru": "600 г",
        "en": "600 g"
      },
      {
        "uz": "1200 g",
        "ru": "1200 г",
        "en": "1200 g"
      },
      {
        "uz": "1500 g",
        "ru": "1500 г",
        "en": "1500 g"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "2000×3÷5=1200 g",
      "ru": "2000×3÷5=1200 г",
      "en": "2000×3÷5=1200 g"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: ikki kilogrammni bir kilogramm deb olish natijani kamaytiradi.",
        "ru": "Посмотрите ещё раз: если принять два килограмма за один, результат уменьшится.",
        "en": "Look again: treating two kilograms as one makes the result too small."
      },
      {
        "uz": "To'g'ri. Avval kilogrammlar grammga aylantirilib, keyin kasr qismi topildi.",
        "ru": "Верно. Сначала килограммы переведены в граммы, затем найдена дробная часть.",
        "en": "Correct. The kilograms were converted to grams before finding the fractional part."
      },
      {
        "uz": "Yana bir qarang: bu natija butunning beshdan uch qismiga emas, to'rtdan uch qismiga mos.",
        "ru": "Посмотрите ещё раз: этот результат соответствует трём четвертям, а не трём пятым.",
        "en": "Look again: this result matches three quarters rather than three fifths."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ikki kilogrammning beshdan uch qismini toping",
          "Grammlarda toping"
        ],
        "ru": [
          "Найдите три пятых от двух килограммов",
          "Найдите в граммах"
        ],
        "en": [
          "Find three fifths of two kilograms",
          "Find the mass in grams"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Avval kilogrammlar grammga aylantirilib, keyin kasr qismi topildi.",
        "ru": "Верно. Сначала килограммы переведены в граммы, затем найдена дробная часть.",
        "en": "Correct. The kilograms were converted to grams before finding the fractional part."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: ikki kilogrammni bir kilogramm deb olish natijani kamaytiradi.",
          "ru": "Посмотрите ещё раз: если принять два килограмма за один, результат уменьшится.",
          "en": "Look again: treating two kilograms as one makes the result too small."
        },
        {
          "uz": "To'g'ri. Avval kilogrammlar grammga aylantirilib, keyin kasr qismi topildi.",
          "ru": "Верно. Сначала килограммы переведены в граммы, затем найдена дробная часть.",
          "en": "Correct. The kilograms were converted to grams before finding the fractional part."
        },
        {
          "uz": "Yana bir qarang: bu natija butunning beshdan uch qismiga emas, to'rtdan uch qismiga mos.",
          "ru": "Посмотрите ещё раз: этот результат соответствует трём четвертям, а не трём пятым.",
          "en": "Look again: this result matches three quarters rather than three fifths."
        }
      ]
    }
  },
  "s11": {
    "eyebrow": {
      "uz": "Bog'lash 4/6",
      "ru": "Связь 4/6",
      "en": "Connection 4/6"
    },
    "title": {
      "uz": "Devor yoki maydon?",
      "ru": "Стена или площадь?",
      "en": "Boundary or area?"
    },
    "scene": "review-test-geometry",
    "closedSet": true,
    "frames": [
      {
        "uz": "To'g'ri to'rtburchak: 8 m × 5 m",
        "ru": "Прямоугольник: 8 м × 5 м",
        "en": "Rectangle: 8 m × 5 m"
      },
      {
        "uz": "Panjara uchun qaysi kattalik kerak?",
        "ru": "Какая величина нужна для ограды?",
        "en": "Which measure is needed for a fence?"
      }
    ],
    "question": {
      "uz": "Qaysi javob to'g'ri?",
      "ru": "Какой ответ верен?",
      "en": "Which answer is correct?"
    },
    "options": [
      {
        "uz": "Panjara: 26 m",
        "ru": "Ограда: 26 м",
        "en": "Fence: 26 m"
      },
      {
        "uz": "Panjara: 40 m²",
        "ru": "Ограда: 40 м²",
        "en": "Fence: 40 m²"
      },
      {
        "uz": "Yuza: 26 m²",
        "ru": "Площадь: 26 м²",
        "en": "Area: 26 m²"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "P=2×(8+5)=26 m; S=8×5=40 m²",
      "ru": "P=2×(8+5)=26 м; S=8×5=40 м²",
      "en": "P=2×(8+5)=26 m; S=8×5=40 m²"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Panjara uchun to'rt tomon uzunligi qo'shildi.",
        "ru": "Верно. Для ограды сложены длины четырёх сторон.",
        "en": "Correct. The four side lengths were added for the fence."
      },
      {
        "uz": "Yana bir qarang: kvadrat metr yuza birligi, panjara esa uzunlik talab qiladi.",
        "ru": "Посмотрите ещё раз: квадратный метр является единицей площади, а для ограды нужна длина.",
        "en": "Look again: square metres measure area, while a fence requires length."
      },
      {
        "uz": "Yana bir qarang: son perimetrga tegishli, lekin kvadrat metr birligi noto'g'ri.",
        "ru": "Посмотрите ещё раз: число относится к периметру, но единица площади неверна.",
        "en": "Look again: the number belongs to the perimeter, but square metres is the wrong unit."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'g'ri to'rtburchak sakkiz metr karra besh metr",
          "Panjara uchun qaysi kattalik kerak?"
        ],
        "ru": [
          "Прямоугольник восемь метров умножить на пять метров",
          "Какая величина нужна для ограды?"
        ],
        "en": [
          "Rectangle eight metres times five metres",
          "Which measure is needed for a fence?"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Panjara uchun to'rt tomon uzunligi qo'shildi.",
        "ru": "Верно. Для ограды сложены длины четырёх сторон.",
        "en": "Correct. The four side lengths were added for the fence."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Panjara uchun to'rt tomon uzunligi qo'shildi.",
          "ru": "Верно. Для ограды сложены длины четырёх сторон.",
          "en": "Correct. The four side lengths were added for the fence."
        },
        {
          "uz": "Yana bir qarang: kvadrat metr yuza birligi, panjara esa uzunlik talab qiladi.",
          "ru": "Посмотрите ещё раз: квадратный метр является единицей площади, а для ограды нужна длина.",
          "en": "Look again: square metres measure area, while a fence requires length."
        },
        {
          "uz": "Yana bir qarang: son perimetrga tegishli, lekin kvadrat metr birligi noto'g'ri.",
          "ru": "Посмотрите ещё раз: число относится к периметру, но единица площади неверна.",
          "en": "Look again: the number belongs to the perimeter, but square metres is the wrong unit."
        }
      ]
    }
  },
  "s12": {
    "eyebrow": {
      "uz": "Bog'lash 5/6",
      "ru": "Связь 5/6",
      "en": "Connection 5/6"
    },
    "title": {
      "uz": "Ikki transport",
      "ru": "Два транспорта",
      "en": "Two vehicles"
    },
    "scene": "review-test-motion",
    "closedSet": true,
    "frames": [
      {
        "uz": "Masofa: 360 km",
        "ru": "Расстояние: 360 км",
        "en": "Distance: 360 km"
      },
      {
        "uz": "Tezliklar: 50 va 40 km/soat, qarama-qarshi",
        "ru": "Скорости: 50 и 40 км/ч, движение навстречу",
        "en": "Speeds: 50 and 40 km/h, moving towards each other"
      }
    ],
    "question": {
      "uz": "Ular necha soatda uchrashadi?",
      "ru": "Через сколько часов они встретятся?",
      "en": "How many hours will it take them to meet?"
    },
    "options": [
      {
        "uz": "4 soat",
        "ru": "4 часа",
        "en": "4 hours"
      },
      {
        "uz": "9 soat",
        "ru": "9 часов",
        "en": "9 hours"
      },
      {
        "uz": "36 soat",
        "ru": "36 часов",
        "en": "36 hours"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "360÷(50+40)=4 soat",
      "ru": "360÷(50+40)=4 часа",
      "en": "360÷(50+40)=4 hours"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Qarama-qarshi harakatda tezliklar qo'shildi.",
        "ru": "Верно. При встречном движении скорости сложены.",
        "en": "Correct. The speeds were added for motion towards each other."
      },
      {
        "uz": "Yana bir qarang: to'qqiz soat uch yuz oltmishni faqat qirq tezlikka bo'lishdan keladi. Ikkinchi transport e'tibordan chetda qolgan.",
        "ru": "Посмотрите ещё раз: девять часов получается, если разделить триста шестьдесят только на скорость сорок. Движение второго транспорта не учтено.",
        "en": "Look again: nine hours comes from dividing three hundred and sixty by forty alone. The second vehicle was ignored."
      },
      {
        "uz": "Yana bir qarang: o'ttiz olti soat tezliklar ayirmasidan keladi. Ayirma quvib yetishga, yig'indi esa uchrashuvga mos.",
        "ru": "Посмотрите ещё раз: тридцать шесть часов получается из разности скоростей. Разность нужна для догоняющего движения, а сумма нужна для встречи.",
        "en": "Look again: thirty six hours comes from the speed difference. Use a difference for catch-up motion and a sum for meeting motion."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Masofa uch yuz oltmish kilometr",
          "Tezliklar ellik va qirq kilometr soatiga qarama-qarshi"
        ],
        "ru": [
          "Расстояние триста шестьдесят километров",
          "Скорости пятьдесят и сорок километров в час движение навстречу"
        ],
        "en": [
          "Distance three hundred and sixty kilometres",
          "Speeds fifty and forty kilometres per hour moving towards each other"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Qarama-qarshi harakatda tezliklar qo'shildi.",
        "ru": "Верно. При встречном движении скорости сложены.",
        "en": "Correct. The speeds were added for motion towards each other."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Qarama-qarshi harakatda tezliklar qo'shildi.",
          "ru": "Верно. При встречном движении скорости сложены.",
          "en": "Correct. The speeds were added for motion towards each other."
        },
        {
          "uz": "Yana bir qarang: to'qqiz soat uch yuz oltmishni faqat qirq tezlikka bo'lishdan keladi. Ikkinchi transport e'tibordan chetda qolgan.",
          "ru": "Посмотрите ещё раз: девять часов получается, если разделить триста шестьдесят только на скорость сорок. Движение второго транспорта не учтено.",
          "en": "Look again: nine hours comes from dividing three hundred and sixty by forty alone. The second vehicle was ignored."
        },
        {
          "uz": "Yana bir qarang: o'ttiz olti soat tezliklar ayirmasidan keladi. Ayirma quvib yetishga, yig'indi esa uchrashuvga mos.",
          "ru": "Посмотрите ещё раз: тридцать шесть часов получается из разности скоростей. Разность нужна для догоняющего движения, а сумма нужна для встречи.",
          "en": "Look again: thirty six hours comes from the speed difference. Use a difference for catch-up motion and a sum for meeting motion."
        }
      ]
    }
  },
  "s13": {
    "eyebrow": {
      "uz": "Bog'lash 6/6",
      "ru": "Связь 6/6",
      "en": "Connection 6/6"
    },
    "title": {
      "uz": "Grafik asosidagi mulohaza",
      "ru": "Высказывание по графику",
      "en": "Graph-based statement"
    },
    "scene": "review-case",
    "closedSet": true,
    "frames": [
      {
        "uz": "Seshanba: 30 birlik",
        "ru": "Вторник: 30 единиц",
        "en": "Tuesday: 30 units"
      },
      {
        "uz": "Chorshanba: 45 birlik",
        "ru": "Среда: 45 единиц",
        "en": "Wednesday: 45 units"
      },
      {
        "uz": "Chorshanba kuni 15 birlik ko'p",
        "ru": "В среду на 15 единиц больше",
        "en": "Wednesday has 15 more units"
      }
    ],
    "question": {
      "uz": "Mulohaza rostmi?",
      "ru": "Верно ли высказывание?",
      "en": "Is the statement true?"
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
        "uz": "Ma'lumot yetarli emas",
        "ru": "Недостаточно данных",
        "en": "Not enough information"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "45−30=15; chorshanba kuni 15 birlik ko'p",
      "ru": "45−30=15; в среду на 15 единиц больше",
      "en": "45−30=15; Wednesday has 15 more units"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Chorshanba va seshanba qiymatlari farqi mulohazani tasdiqlaydi.",
        "ru": "Верно. Разность значений среды и вторника подтверждает высказывание.",
        "en": "Correct. The difference between Wednesday and Tuesday confirms the statement."
      },
      {
        "uz": "Yana bir qarang: chorshanba qiymati seshanba qiymatidan katta.",
        "ru": "Посмотрите ещё раз: значение среды больше значения вторника.",
        "en": "Look again: Wednesday's value is greater than Tuesday's."
      },
      {
        "uz": "Yana bir qarang: jadvalda ikkala kun qiymati ham berilgan.",
        "ru": "Посмотрите ещё раз: в таблице даны значения обоих дней.",
        "en": "Look again: the table gives the values for both days."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Seshanba o'ttiz birlik",
          "Chorshanba qirq besh birlik",
          "Chorshanba kuni o'n besh birlik ko'p"
        ],
        "ru": [
          "Вторник тридцать единиц",
          "Среда сорок пять единиц",
          "В среду на пятнадцать единиц больше"
        ],
        "en": [
          "Tuesday thirty units",
          "Wednesday forty five units",
          "Wednesday has fifteen more units"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Chorshanba va seshanba qiymatlari farqi mulohazani tasdiqlaydi.",
        "ru": "Верно. Разность значений среды и вторника подтверждает высказывание.",
        "en": "Correct. The difference between Wednesday and Tuesday confirms the statement."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Chorshanba va seshanba qiymatlari farqi mulohazani tasdiqlaydi.",
          "ru": "Верно. Разность значений среды и вторника подтверждает высказывание.",
          "en": "Correct. The difference between Wednesday and Tuesday confirms the statement."
        },
        {
          "uz": "Yana bir qarang: chorshanba qiymati seshanba qiymatidan katta.",
          "ru": "Посмотрите ещё раз: значение среды больше значения вторника.",
          "en": "Look again: Wednesday's value is greater than Tuesday's."
        },
        {
          "uz": "Yana bir qarang: jadvalda ikkala kun qiymati ham berilgan.",
          "ru": "Посмотрите ещё раз: в таблице даны значения обоих дней.",
          "en": "Look again: the table gives the values for both days."
        }
      ]
    }
  },
  "s14": {
    "eyebrow": {
      "uz": "O'quv takrorlash yakuni",
      "ru": "Итог учебного повторения",
      "en": "Teaching review summary"
    },
    "title": {
      "uz": "Kursning yagona xaritasi",
      "ru": "Единая карта курса",
      "en": "One map of the course"
    },
    "scene": "review-final",
    "frames": [
      {
        "uz": "Tushuning",
        "ru": "Поймите",
        "en": "Understand"
      },
      {
        "uz": "Mos modelni tanlang",
        "ru": "Выберите подходящую модель",
        "en": "Choose a suitable model"
      },
      {
        "uz": "Hisoblang",
        "ru": "Вычислите",
        "en": "Calculate"
      },
      {
        "uz": "Tekshiring",
        "ru": "Проверьте",
        "en": "Check"
      },
      {
        "uz": "Tushuntiring: siz matematik fikrlashni boshqara olasiz",
        "ru": "Объясните: вы умеете управлять математическим рассуждением",
        "en": "Explain: you can guide mathematical reasoning"
      }
    ],
    "audio": {
      "uz": [
        "Tushuning",
        "Mos modelni tanlang",
        "Hisoblang",
        "Tekshiring",
        "Tushuntiring siz matematik fikrlashni boshqara olasiz"
      ],
      "ru": [
        "Поймите",
        "Выберите подходящую модель",
        "Вычислите",
        "Проверьте",
        "Объясните вы умеете управлять математическим рассуждением"
      ],
      "en": [
        "Understand",
        "Choose a suitable model",
        "Calculate",
        "Check",
        "Explain you can guide mathematical reasoning"
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

const RelationCards = ({ items, frame }) => <div className="relation-cards">{items.map((item, index) => <span className={index <= frame ? 'active' : ''} key={item}>{item}</span>)}</div>;
function ConversionVisual({ c, frame, revealed = false }) {
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
  if (kind === 'review') {
    const scene = String(c.scene || 'review-hook');
    const chip = (value, index, active = true, tone = T.cyan) => <span key={`${value}-${index}`} style={{ minWidth: 54, height: 54, padding: '0 9px', border: '2px solid rgba(23,59,82,.12)', borderRadius: 16, display: 'grid', placeItems: 'center', opacity: active ? 1 : .18, color: active ? '#FFF' : T.navy, background: active ? tone : '#FFF', font: "900 13px 'JetBrains Mono',monospace", transition: 'all .45s ease' }}>{value}</span>;
    if (scene === 'review-hook') {
      const modules = ['123', '3/5', 'm³', '□', '▥'];
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>{modules.map((value, index) => chip(value, index, index <= frame + 2, index === 4 ? T.accent : T.cyan))}</div>{frame >= 2 && <strong style={{ color: T.navy, fontSize: 26 }}>{t(bi('model', 'модель', 'model'))} → ?</strong>}</div>;
    }
    if (scene === 'review-cycle' || scene === 'review-final') {
      const cycle = scene === 'review-final' ? ['1', '2', '3', '4', '5'] : ['1', '2', '3', '4'];
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{cycle.map((value, index) => <React.Fragment key={value}>{chip(value, index, index <= frame, index === cycle.length - 1 ? T.success : T.cyan)}{index < cycle.length - 1 && <b style={{ color: T.ink3 }}>→</b>}</React.Fragment>)}</div></div>;
    }
    if (scene === 'review-number' || scene === 'review-test-place') {
      const digits = scene === 'review-test-place' ? ['5', '0', '7', '0', '4', '2'] : ['100 000', '10 000', '1000', '100', '10', '1'];
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 5 }}>{digits.map((value, index) => chip(value, index, true, index % 2 ? T.navy : T.cyan))}</div>{scene === 'review-test-place' && <strong style={{ color: T.navy, font: "900 14px 'JetBrains Mono',monospace" }}>507 042</strong>}</div>;
    }
    if (scene === 'review-addition' || scene === 'review-test-addition') {
      const moved = scene === 'review-addition' && frame >= 2;
      const values = moved ? ['398', '2', '127'] : ['398', '127', '2'];
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{values.map((value, index) => <React.Fragment key={`${value}-${index}`}>{chip(value, index, true, moved && index < 2 ? T.cyan : T.navy)}{index < 2 && <b style={{ color: T.accent, fontSize: 22 }}>+</b>}</React.Fragment>)}</div>{scene === 'review-addition' && frame >= 3 && <strong style={{ padding: '7px 13px', borderRadius: 11, color: '#FFF', background: T.success }}>527</strong>}</div>;
    }
    if (scene === 'review-fraction' || scene === 'review-test-fraction') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ width: '92%', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>{Array.from({ length: 5 }, (_, index) => <i key={index} style={{ height: 55, border: '2px solid rgba(23,59,82,.12)', borderRadius: 8, background: index < 3 ? T.cyan : '#DCE8E7', transform: index < 3 ? 'scaleY(1)' : 'scaleY(.78)', transformOrigin: 'bottom', transition: 'all .4s ease' }}/>)}</div><strong style={{ color: T.navy }}>{scene === 'review-test-fraction' ? '2 kg × 3/5' : t(bi('qism + qoldiq', 'часть + остаток', 'part + remainder'))}</strong></div>;
    }
    if (scene === 'review-geometry' || scene === 'review-test-geometry') {
      if (scene === 'review-test-geometry') return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ width: 190, height: 112, border: `6px solid ${revealed ? T.accent : T.navy}`, display: 'grid', placeItems: 'center', background: 'repeating-linear-gradient(0deg,#FFF,#FFF 17px,#E5F5F6 18px)', transition: 'all .4s ease' }}><strong style={{ color: T.navy, font: "900 13px 'JetBrains Mono',monospace" }}>8 m × 5 m</strong></div></div>;
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'end', gap: 12 }}>{chip('m', 0, frame >= 0)}{chip('m³', 1, frame >= 1)}<span style={{ width: 58, height: 58, border: `5px solid ${frame >= 2 ? T.accent : '#DCE8E7'}`, background: '#FFF' }}/><span style={{ width: 58, height: 58, border: `2px solid ${T.navy}`, background: frame >= 3 ? T.cyanSoft : '#FFF' }}/></div></div>;
    }
    if (scene === 'review-algebra') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}><div style={{ display: 'grid', placeItems: 'center', gap: 7 }}>{chip('x', 0, true, T.navy)}<small style={{ fontWeight: 900 }}>{t(bi('ildiz', 'корень', 'root'))}</small></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,18px)', alignItems: 'center', gap: 5 }}>{Array.from({ length: 5 }, (_, index) => <i key={index} style={{ width: 18, height: 18, borderRadius: '50%', background: frame >= 2 ? T.cyan : '#FFF', border: '2px solid rgba(23,59,82,.18)' }}/>)}</div></div></div>;
    }
    if (scene === 'review-data') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ padding: 12, border: `2px solid ${T.navy}`, borderRadius: 10, background: '#FFF', fontWeight: 900 }}>▦</span><b style={{ opacity: frame >= 1 ? 1 : .16, color: T.accent, transition: 'opacity .3s ease' }}>→</b><svg viewBox="0 0 120 70" width="130" height="76" aria-hidden="true" style={{ opacity: frame >= 1 ? 1 : .12, transition: 'opacity .3s ease' }}><path d="M8 8 V61 H113" fill="none" stroke={T.navy} strokeWidth="3"/><polyline points="12,50 44,38 76,38 108,18" fill="none" stroke={T.cyan} strokeWidth="4"/><circle cx="108" cy="18" r="5" fill={T.accent}/></svg><span style={{ opacity: frame >= 2 ? 1 : .16, padding: '5px 7px', borderRadius: 8, color: '#FFF', background: T.cyan, font: "900 10px 'JetBrains Mono',monospace", transition: 'opacity .3s ease' }}>1 : 10</span><b style={{ opacity: frame >= 3 ? 1 : .16, color: T.accent, transition: 'opacity .3s ease' }}>→</b><span style={{ opacity: frame >= 3 ? 1 : .16, fontSize: 27, transition: 'opacity .3s ease' }}>✓</span></div>{frame >= 4 && <strong style={{ color: T.success }}>{t(bi("Ma'lumot uchun grafik modeli tanlandi", 'Для данных выбрана графическая модель', 'A graph model was chosen for the data'))}</strong>}</div>;
    }
    if (scene === 'review-test-motion') {
      const progress = revealed ? 1 : frame >= 1 ? .25 : 0;
      const meetingPoint = 8 + 84 * 50 / 90;
      const first = 8 + (meetingPoint - 8) * progress;
      const second = 92 - (92 - meetingPoint) * progress;
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ width: '92%', height: 62, position: 'relative', display: 'grid', alignItems: 'center' }}><div style={{ height: 8, borderRadius: 99, background: '#D7E5E4' }}/><i style={{ position: 'absolute', left: `${first}%`, width: 25, height: 25, borderRadius: '50%', background: T.cyan, transform: 'translateX(-50%)', transition: 'left .6s ease' }}/><i style={{ position: 'absolute', left: `${second}%`, width: 25, height: 25, borderRadius: '50%', background: T.accent, transform: 'translateX(-50%)', transition: 'left .6s ease' }}/><b style={{ position: 'absolute', left: '50%', top: -3, transform: 'translateX(-50%)', color: T.navy }}>360 km</b>{frame >= 1 && <small style={{ position: 'absolute', left: '50%', bottom: -3, transform: 'translateX(-50%)', color: T.ink2, fontWeight: 900 }}>50 : 40</small>}</div></div>;
    }
    if (scene === 'review-case') {
      return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ width: '76%', height: 130, borderLeft: `3px solid ${T.navy}`, borderBottom: `3px solid ${T.navy}`, display: 'flex', alignItems: 'end', justifyContent: 'space-around' }}>{[[30, t(bi('Se', 'Вт', 'Tue'))], [45, t(bi('Ch', 'Ср', 'Wed'))]].map(([value, label], index) => <span key={label} style={{ width: '30%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', gap: 3 }}><b>{value}</b><i style={{ width: '100%', height: `${value * 1.7}%`, borderRadius: '8px 8px 0 0', background: index ? T.accent : T.cyan }}/><small>{label}</small></span>)}</div>{frame >= 2 && <strong style={{ color: T.navy }}>45−30=15</strong>}</div>;
    }
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
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const bitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const revealed = picked !== null; const correct = picked === c.correctIndex; const choose = (index) => { const ok = index === c.correctIndex; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><ConversionVisual c={c} frame={audio.frame} revealed={revealed}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = revealed && index === picked ? (index === c.correctIndex ? 'right' : 'bad') : ''; return <button type="button" className={'option ' + cls} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div>{revealed && <><div className={'feedback open ' + (correct ? 'correct' : 'wrong')}><b>{correct ? '✓' : '!'}</b><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div><div className="proof">{t(c.proof)}</div></>}</div></section></div></Stage>; }
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
function Screen14({ screen, onPrev, finishLesson }) {
  const c = CONTENT.s14; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} state="happy" showBit/><section className="model-card summary-card"><ConversionVisual c={c} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars51({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), assessment: false, totalQuestions: null, correctAnswers: null, scorePercent: null, finalScore: null, finalTotal: null, passed: null, firstTryStats: null, attemptsTotal: answers.filter(Boolean).reduce((sum, answer) => sum + (answer.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars51 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
