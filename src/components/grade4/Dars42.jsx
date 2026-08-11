import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 42 · Tenglama va teskari amallar
// 15 ekran · audio bilan sinxron kadrlar · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "equations-4-42-v1", slug: "dars42-tenglamalar", lessonTitle: {"uz":"Tenglamalar","ru":"Уравнения","en":"Equations"}, skillTags: ["equation","unknown","inverse-operations","balance"] };
const LESSON_REWARD_TITLE = {
  "uz": "Tenglama kompassi",
  "ru": "Компас уравнений",
  "en": "Equation compass"
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
      "uz": "Muvozanat siri",
      "ru": "Секрет равновесия",
      "en": "Balance mystery"
    },
    "title": {
      "uz": "Bo'sh katakdagi son",
      "ru": "Число в пустой клетке",
      "en": "The number in the box"
    },
    "scene": "hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "□ + 28 = 65 tengligi berilgan.",
        "ru": "Дано равенство □ + 28 = 65.",
        "en": "The equality □ + 28 = 65 is given."
      },
      {
        "uz": "Tarozi ikki tomonning tengligini ko'rsatadi.",
        "ru": "Весы показывают, что две стороны равны.",
        "en": "The balance shows that the two sides are equal."
      },
      {
        "uz": "Qaysi son tenglikni rost qiladi?",
        "ru": "Какое число делает равенство верным?",
        "en": "Which number makes the equality true?"
      }
    ],
    "question": {
      "uz": "Bo'sh katakka qaysi son mos?",
      "ru": "Какое число подходит для пустой клетки?",
      "en": "Which number belongs in the empty box?"
    },
    "options": [
      {
        "uz": "37",
        "ru": "37",
        "en": "37"
      },
      {
        "uz": "28",
        "ru": "28",
        "en": "28"
      },
      {
        "uz": "93",
        "ru": "93",
        "en": "93"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Tenglik, noma'lum va teskari amalni tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим равенство, неизвестное и обратное действие.",
      "en": "Estimate saved. We will check equality, the unknown and the inverse operation."
    },
    "audio": {
      "intro": {
        "uz": [
          "Bo'sh katak qo'shilgan yigirma sakkiz teng oltmish besh tengligi berilgan.",
          "Tarozi ikki tomonning tengligini ko'rsatadi.",
          "Qaysi son tenglikni rost qiladi?"
        ],
        "ru": [
          "Дано равенство пустая клетка плюс двадцать восемь равно шестьдесят пять.",
          "Весы показывают, что две стороны равны.",
          "Какое число делает равенство верным?"
        ],
        "en": [
          "An empty box plus twenty eight equals sixty five.",
          "The balance shows that the two sides are equal.",
          "Which number makes the equality true?"
        ]
      }
    }
  },
  "s1": {
    "eyebrow": {
      "uz": "Tushuntirish 1/7",
      "ru": "Объяснение 1/7",
      "en": "Explanation 1/7"
    },
    "title": {
      "uz": "Ifoda va tenglama",
      "ru": "Выражение и уравнение",
      "en": "Expression and equation"
    },
    "scene": "expression",
    "frames": [
      {
        "uz": "35 + 28 — sonli ifoda.",
        "ru": "35 + 28 — числовое выражение.",
        "en": "35 + 28 is a numerical expression."
      },
      {
        "uz": "x + 28 = 65 — noma'lumli tenglik.",
        "ru": "x + 28 = 65 — равенство с неизвестным.",
        "en": "x + 28 = 65 is an equality with an unknown."
      },
      {
        "uz": "Tenglik belgisi ikki tomonni bog'laydi.",
        "ru": "Знак равенства связывает две стороны.",
        "en": "The equals sign links the two sides."
      },
      {
        "uz": "Noma'lumli tenglik tenglama deyiladi.",
        "ru": "Равенство с неизвестным называется уравнением.",
        "en": "An equality with an unknown is called an equation."
      }
    ],
    "audio": {
      "uz": [
        "O'ttiz besh qo'shilgan yigirma sakkiz, sonli ifoda.",
        "Iks qo'shilgan yigirma sakkiz teng oltmish besh, noma'lumli tenglik.",
        "Tenglik belgisi ikki tomonni bog'laydi.",
        "Noma'lumli tenglik tenglama deyiladi."
      ],
      "ru": [
        "Тридцать пять плюс двадцать восемь, числовое выражение.",
        "Икс плюс двадцать восемь равно шестьдесят пять, равенство с неизвестным.",
        "Знак равенства связывает две стороны.",
        "Равенство с неизвестным называется уравнением."
      ],
      "en": [
        "Thirty five plus twenty eight is a numerical expression.",
        "X plus twenty eight equals sixty five is an equality with an unknown.",
        "The equals sign links the two sides.",
        "An equality with an unknown is called an equation."
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
      "uz": "Noma'lum va ildiz",
      "ru": "Неизвестное и корень",
      "en": "Unknown and root"
    },
    "scene": "root",
    "frames": [
      {
        "uz": "x — noma'lum son.",
        "ru": "x — неизвестное число.",
        "en": "x is the unknown number."
      },
      {
        "uz": "x=37 deb olamiz.",
        "ru": "Пусть x = 37.",
        "en": "Let x = 37."
      },
      {
        "uz": "37 + 28 = 65 tengligi rost.",
        "ru": "Равенство 37 + 28 = 65 верно.",
        "en": "The equality 37 + 28 = 65 is true."
      },
      {
        "uz": "Shuning uchun 37 — tenglamaning ildizi.",
        "ru": "Поэтому 37 — корень уравнения.",
        "en": "Therefore, 37 is the solution of the equation."
      }
    ],
    "audio": {
      "uz": [
        "Iks noma'lum son.",
        "Iksni o'ttiz yettiga teng deb olamiz.",
        "O'ttiz yettiga yigirma sakkizni qo'shsak, oltmish besh chiqadi; tenglik rost.",
        "Shuning uchun o'ttiz yetti tenglamaning ildizi."
      ],
      "ru": [
        "Икс является неизвестным числом.",
        "Пусть икс равен тридцати семи.",
        "Тридцать семь плюс двадцать восемь равно шестидесяти пяти; равенство верно.",
        "Поэтому тридцать семь является корнем уравнения."
      ],
      "en": [
        "X is the unknown number.",
        "Let x equal thirty seven.",
        "Thirty seven plus twenty eight equals sixty five, so the equality is true.",
        "Therefore, thirty seven is the solution of the equation."
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
      "uz": "Tarozi modeli",
      "ru": "Модель весов",
      "en": "Balance model"
    },
    "scene": "balance",
    "frames": [
      {
        "uz": "Tenglamaning chap tomoni bor.",
        "ru": "У уравнения есть левая часть.",
        "en": "An equation has a left-hand side."
      },
      {
        "uz": "Tenglamaning o'ng tomoni bor.",
        "ru": "У уравнения есть правая часть.",
        "en": "An equation has a right-hand side."
      },
      {
        "uz": "Ikkala tomonning qiymati teng.",
        "ru": "Значения двух частей равны.",
        "en": "The two sides have equal values."
      },
      {
        "uz": "Tarozi muvozanati saqlanadi.",
        "ru": "Равновесие весов сохраняется.",
        "en": "The balance remains level."
      }
    ],
    "audio": {
      "uz": [
        "Tenglamaning chap tomoni bor.",
        "Tenglamaning o'ng tomoni bor.",
        "Ikkala tomonning qiymati teng.",
        "Tarozi muvozanati saqlanadi."
      ],
      "ru": [
        "У уравнения есть левая часть.",
        "У уравнения есть правая часть.",
        "Значения двух частей равны.",
        "Равновесие весов сохраняется."
      ],
      "en": [
        "An equation has a left-hand side.",
        "An equation has a right-hand side.",
        "The two sides have equal values.",
        "The balance remains level."
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
      "uz": "Qo'shish va ayirish",
      "ru": "Сложение и вычитание",
      "en": "Addition and subtraction"
    },
    "scene": "add-inverse",
    "frames": [
      {
        "uz": "x + 28 = 65 tenglamasi berilgan.",
        "ru": "Дано уравнение x + 28 = 65.",
        "en": "The equation x + 28 = 65 is given."
      },
      {
        "uz": "Noma'lumga 28 qo'shilgan.",
        "ru": "К неизвестному прибавили 28.",
        "en": "28 has been added to the unknown."
      },
      {
        "uz": "Qo'shishga teskari amal — ayirish.",
        "ru": "Вычитание — действие, обратное сложению.",
        "en": "Subtraction is the inverse of addition."
      },
      {
        "uz": "x = 65 − 28 = 37.",
        "ru": "x = 65 − 28 = 37.",
        "en": "x = 65 − 28 = 37."
      }
    ],
    "audio": {
      "uz": [
        "Iks qo'shilgan yigirma sakkiz teng oltmish besh tenglamasi berilgan.",
        "Noma'lumga yigirma sakkiz qo'shilgan.",
        "Qo'shishga teskari amal, ayirish.",
        "Iks teng oltmish besh ayirilgan yigirma sakkiz teng o'ttiz yetti."
      ],
      "ru": [
        "Дано уравнение икс плюс двадцать восемь равно шестьдесят пять.",
        "К неизвестному прибавили двадцать восемь.",
        "Вычитание, действие, обратное сложению.",
        "Икс равно шестьдесят пять минус двадцать восемь равно тридцать семь."
      ],
      "en": [
        "The equation x plus twenty eight equals sixty five is given.",
        "Twenty eight has been added to the unknown.",
        "Subtraction is the inverse of addition.",
        "X equals sixty five minus twenty eight equals thirty seven."
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
      "uz": "Ko'paytirish va bo'lish",
      "ru": "Умножение и деление",
      "en": "Multiplication and division"
    },
    "scene": "multiply-inverse",
    "frames": [
      {
        "uz": "8x = 72 tenglamasi berilgan.",
        "ru": "Дано уравнение 8x = 72.",
        "en": "The equation 8x = 72 is given."
      },
      {
        "uz": "Bu 8 ta teng guruhni bildiradi.",
        "ru": "Это означает 8 равных групп.",
        "en": "It represents 8 equal groups."
      },
      {
        "uz": "Bitta guruhni topish uchun 72 ÷ 8 ni hisoblang.",
        "ru": "Чтобы найти одну группу, вычислите 72 ÷ 8.",
        "en": "To find one group, calculate 72 ÷ 8."
      },
      {
        "uz": "x = 9.",
        "ru": "x = 9.",
        "en": "x = 9."
      }
    ],
    "audio": {
      "uz": [
        "Sakkiz karra iks teng yetmish ikki tenglamasi berilgan.",
        "Bu sakkizta teng guruhni bildiradi.",
        "Bitta guruhni topish uchun yetmish ikki bo'lingan sakkizni hisoblang.",
        "Iks teng to'qqiz."
      ],
      "ru": [
        "Дано уравнение восемь умножить на икс равно семьдесят два.",
        "Это означает восемь равных групп.",
        "Чтобы найти одну группу, вычислите семьдесят два разделить на восемь.",
        "Икс равно девять."
      ],
      "en": [
        "The equation eight multiplied by x equals seventy two is given.",
        "It represents eight equal groups.",
        "To find one group, calculate seventy two divided by eight.",
        "X equals nine."
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
      "uz": "Noma'lum qayerda?",
      "ru": "Где неизвестное?",
      "en": "Where is the unknown?"
    },
    "scene": "components",
    "frames": [
      {
        "uz": "x + 37 = 82 da noma'lum qo'shiluvchi.",
        "ru": "В x + 37 = 82 неизвестно слагаемое.",
        "en": "In x + 37 = 82, the addend is unknown."
      },
      {
        "uz": "x − 46 = 29 da noma'lum kamayuvchi.",
        "ru": "В x − 46 = 29 неизвестно уменьшаемое.",
        "en": "In x − 46 = 29, the minuend is unknown."
      },
      {
        "uz": "96 − x = 38 da noma'lum ayiriluvchi.",
        "ru": "В 96 − x = 38 неизвестно вычитаемое.",
        "en": "In 96 − x = 38, the subtrahend is unknown."
      },
      {
        "uz": "Noma'lum komponent o'rniga qarab teskari amal tanlanadi.",
        "ru": "Обратное действие зависит от места неизвестного компонента.",
        "en": "The inverse operation depends on the unknown component's position."
      }
    ],
    "audio": {
      "uz": [
        "Iks qo'shilgan o'ttiz yetti teng sakson ikkida noma'lum qo'shiluvchi.",
        "Iks ayirilgan qirq olti teng yigirma to'qqizda noma'lum kamayuvchi.",
        "To'qson olti ayirilgan iks teng o'ttiz sakkizda noma'lum ayiriluvchi.",
        "Noma'lum komponent o'rniga qarab teskari amal tanlanadi."
      ],
      "ru": [
        "В икс плюс тридцать семь равно восемьдесят два неизвестно слагаемое.",
        "В икс минус сорок шесть равно двадцать девять неизвестно уменьшаемое.",
        "В девяносто шесть минус икс равно тридцать восемь неизвестно вычитаемое.",
        "Обратное действие зависит от места неизвестного компонента."
      ],
      "en": [
        "In x plus thirty seven equals eighty two, the addend is unknown.",
        "In x minus forty six equals twenty nine, the minuend is unknown.",
        "In ninety six minus x equals thirty eight, the subtrahend is unknown.",
        "The inverse operation depends on the unknown component's position."
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
      "uz": "Tenglama kompassi",
      "ru": "Компас уравнения",
      "en": "Equation compass"
    },
    "scene": "algorithm",
    "frames": [
      {
        "uz": "Noma'lum komponent nomini toping.",
        "ru": "Назовите неизвестный компонент.",
        "en": "Name the unknown component."
      },
      {
        "uz": "Komponentlar orasidagi bog'lanishni eslang.",
        "ru": "Вспомните связь между компонентами.",
        "en": "Recall the relationship between the components."
      },
      {
        "uz": "Teskari amalni bajaring.",
        "ru": "Выполните обратное действие.",
        "en": "Use the inverse operation."
      },
      {
        "uz": "Tenglama ildizini yozing.",
        "ru": "Запишите корень уравнения.",
        "en": "Write the solution of the equation."
      },
      {
        "uz": "x = 37; 37 + 28 = 65.",
        "ru": "x = 37; 37 + 28 = 65.",
        "en": "x = 37; 37 + 28 = 65."
      }
    ],
    "audio": {
      "uz": [
        "Noma'lum komponent nomini toping.",
        "Komponentlar orasidagi bog'lanishni eslang.",
        "Teskari amalni bajaring.",
        "Tenglama ildizini yozing.",
        "Demak iks o'ttiz yettiga teng, chunki o'ttiz yettiga yigirma sakkiz qo'shilsa oltmish besh hosil bo'ladi."
      ],
      "ru": [
        "Назовите неизвестный компонент.",
        "Вспомните связь между компонентами.",
        "Выполните обратное действие.",
        "Запишите корень уравнения.",
        "Итак, икс равен тридцати семи, потому что тридцать семь плюс двадцать восемь равно шестидесяти пяти."
      ],
      "en": [
        "Name the unknown component.",
        "Recall the relationship between the components.",
        "Use the inverse operation.",
        "Write the solution of the equation.",
        "Therefore, x equals thirty seven because thirty seven plus twenty eight equals sixty five."
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
      "uz": "Qaysi yozuv tenglama?",
      "ru": "Какая запись — уравнение?",
      "en": "Which is an equation?"
    },
    "scene": "equation-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "Tenglamada noma'lum va tenglik belgisi bo'ladi.",
        "ru": "В уравнении есть неизвестное и знак равенства.",
        "en": "An equation contains an unknown and an equals sign."
      },
      {
        "uz": "Uch yozuvdan tenglamani tanlang.",
        "ru": "Выберите уравнение из трёх записей.",
        "en": "Choose the equation from the three statements."
      }
    ],
    "question": {
      "uz": "Qaysi yozuv tenglama?",
      "ru": "Какая запись является уравнением?",
      "en": "Which statement is an equation?"
    },
    "options": [
      {
        "uz": "45 + 18",
        "ru": "45 + 18",
        "en": "45 + 18"
      },
      {
        "uz": "x + 18 = 45",
        "ru": "x + 18 = 45",
        "en": "x + 18 = 45"
      },
      {
        "uz": "45 > 18",
        "ru": "45 > 18",
        "en": "45 > 18"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "x + 18 = 45 yozuvida noma'lum va tenglik belgisi bor.",
      "ru": "В записи x + 18 = 45 есть неизвестное и знак равенства.",
      "en": "The statement x + 18 = 45 contains an unknown and an equals sign."
    },
    "audio": {
      "intro": {
        "uz": [
          "Tenglamada noma'lum va tenglik belgisi bo'ladi.",
          "Uch yozuvdan tenglamani tanlang."
        ],
        "ru": [
          "В уравнении есть неизвестное и знак равенства.",
          "Выберите уравнение из трёх записей."
        ],
        "en": [
          "An equation contains an unknown and an equals sign.",
          "Choose the equation from the three statements."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Iks qo'shilgan o'n sakkiz teng qirq besh yozuvida noma'lum va tenglik belgisi bor.",
        "ru": "Верно. В записи икс плюс восемнадцать равно сорок пять есть неизвестное и знак равенства.",
        "en": "Correct. The statement x plus eighteen equals forty five contains an unknown and an equals sign."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Qirq besh qo'shilgan o'n sakkizda tenglik belgisi ham, noma'lum ham yo'q. Bu ifoda, tenglama emas.",
          "ru": "Посмотрите ещё раз: В записи сорок пять плюс восемнадцать нет ни знака равенства, ни неизвестного. Это выражение, а не уравнение.",
          "en": "Look again: Forty-five plus eighteen contains neither an equals sign nor an unknown. It is an expression, not an equation."
        },
        {
          "uz": "To'g'ri. Iks qo'shilgan o'n sakkiz teng qirq besh yozuvida noma'lum va tenglik belgisi bor.",
          "ru": "Верно. В записи икс плюс восемнадцать равно сорок пять есть неизвестное и знак равенства.",
          "en": "Correct. The statement x plus eighteen equals forty five contains an unknown and an equals sign."
        },
        {
          "uz": "Yana bir qarang: Katta belgisi bu yozuvni tengsizlik qiladi, bundan tashqari noma'lum ham yo'q. Tenglamada tenglik belgisi va noma'lum bo'ladi.",
          "ru": "Посмотрите ещё раз: Знак больше делает эту запись неравенством, и неизвестного в ней нет. В уравнении есть неизвестное и знак равенства.",
          "en": "Look again: The greater-than sign makes this an inequality, and it has no unknown. An equation contains an unknown and an equals sign."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Qirq besh qo'shilgan o'n sakkizda tenglik belgisi ham, noma'lum ham yo'q. Bu ifoda, tenglama emas.",
        "ru": "Посмотрите ещё раз: В записи сорок пять плюс восемнадцать нет ни знака равенства, ни неизвестного. Это выражение, а не уравнение.",
        "en": "Look again: Forty-five plus eighteen contains neither an equals sign nor an unknown. It is an expression, not an equation."
      },
      {
        "uz": "To'g'ri. Iks qo'shilgan o'n sakkiz teng qirq besh yozuvida noma'lum va tenglik belgisi bor.",
        "ru": "Верно. В записи икс плюс восемнадцать равно сорок пять есть неизвестное и знак равенства.",
        "en": "Correct. The statement x plus eighteen equals forty five contains an unknown and an equals sign."
      },
      {
        "uz": "Yana bir qarang: Katta belgisi bu yozuvni tengsizlik qiladi, bundan tashqari noma'lum ham yo'q. Tenglamada tenglik belgisi va noma'lum bo'ladi.",
        "ru": "Посмотрите ещё раз: Знак больше делает эту запись неравенством, и неизвестного в ней нет. В уравнении есть неизвестное и знак равенства.",
        "en": "Look again: The greater-than sign makes this an inequality, and it has no unknown. An equation contains an unknown and an equals sign."
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
      "uz": "x+37=82",
      "ru": "x+37=82",
      "en": "x+37=82"
    },
    "scene": "add-equation",
    "closedSet": true,
    "frames": [
      {
        "uz": "x + 37 = 82 tenglamasi berilgan.",
        "ru": "Дано уравнение x + 37 = 82.",
        "en": "The equation x + 37 = 82 is given."
      },
      {
        "uz": "Noma'lum qo'shiluvchini toping.",
        "ru": "Найдите неизвестное слагаемое.",
        "en": "Find the unknown addend."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "45",
        "ru": "45",
        "en": "45"
      },
      {
        "uz": "55",
        "ru": "55",
        "en": "55"
      },
      {
        "uz": "119",
        "ru": "119",
        "en": "119"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "82 − 37 = 45, shuning uchun x = 45.",
      "ru": "82 − 37 = 45, поэтому x = 45.",
      "en": "82 − 37 = 45, so x = 45."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iks qo'shilgan o'ttiz yetti teng sakson ikki tenglamasi berilgan.",
          "Noma'lum qo'shiluvchini toping."
        ],
        "ru": [
          "Дано уравнение икс плюс тридцать семь равно восемьдесят два.",
          "Найдите неизвестное слагаемое."
        ],
        "en": [
          "The equation x plus thirty seven equals eighty two is given.",
          "Find the unknown addend."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Sakson ikki ayirilgan o'ttiz yetti teng qirq besh, shuning uchun iks teng qirq besh.",
        "ru": "Верно. Восемьдесят два минус тридцать семь равно сорок пять, поэтому икс равно сорок пять.",
        "en": "Correct. Eighty two minus thirty seven equals forty five, so x equals forty five."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Sakson ikki ayirilgan o'ttiz yetti teng qirq besh, shuning uchun iks teng qirq besh.",
          "ru": "Верно. Восемьдесят два минус тридцать семь равно сорок пять, поэтому икс равно сорок пять.",
          "en": "Correct. Eighty two minus thirty seven equals forty five, so x equals forty five."
        },
        {
          "uz": "Yana bir qarang: Ellik beshni tekshirsak, ellik beshga o'ttiz yetti qo'shilganda to'qson ikki chiqadi, sakson ikki emas. Ildiz qirq besh.",
          "ru": "Посмотрите ещё раз: Проверка числа пятьдесят пять даёт девяносто два после прибавления тридцати семи, а не восемьдесят два. Корень равен сорока пяти.",
          "en": "Look again: Checking fifty-five gives ninety-two after adding thirty-seven, not eighty-two. The solution is forty-five."
        },
        {
          "uz": "Yana bir qarang: Bir yuz o'n to'qqiz ma'lum sonlarni qo'shishdan chiqadi. Noma'lum qo'shiluvchini topish uchun sakson ikkidan o'ttiz yettini ayiring.",
          "ru": "Посмотрите ещё раз: Сто девятнадцать получается при сложении известных чисел. Чтобы найти неизвестное слагаемое, вычтите тридцать семь из восьмидесяти двух.",
          "en": "Look again: One hundred and nineteen comes from adding the known numbers. Find the unknown addend by subtracting thirty-seven from eighty-two."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Sakson ikki ayirilgan o'ttiz yetti teng qirq besh, shuning uchun iks teng qirq besh.",
        "ru": "Верно. Восемьдесят два минус тридцать семь равно сорок пять, поэтому икс равно сорок пять.",
        "en": "Correct. Eighty two minus thirty seven equals forty five, so x equals forty five."
      },
      {
        "uz": "Yana bir qarang: Ellik beshni tekshirsak, ellik beshga o'ttiz yetti qo'shilganda to'qson ikki chiqadi, sakson ikki emas. Ildiz qirq besh.",
        "ru": "Посмотрите ещё раз: Проверка числа пятьдесят пять даёт девяносто два после прибавления тридцати семи, а не восемьдесят два. Корень равен сорока пяти.",
        "en": "Look again: Checking fifty-five gives ninety-two after adding thirty-seven, not eighty-two. The solution is forty-five."
      },
      {
        "uz": "Yana bir qarang: Bir yuz o'n to'qqiz ma'lum sonlarni qo'shishdan chiqadi. Noma'lum qo'shiluvchini topish uchun sakson ikkidan o'ttiz yettini ayiring.",
        "ru": "Посмотрите ещё раз: Сто девятнадцать получается при сложении известных чисел. Чтобы найти неизвестное слагаемое, вычтите тридцать семь из восьмидесяти двух.",
        "en": "Look again: One hundred and nineteen comes from adding the known numbers. Find the unknown addend by subtracting thirty-seven from eighty-two."
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
      "uz": "x-46=29",
      "ru": "x-46=29",
      "en": "x-46=29"
    },
    "scene": "minuend-equation",
    "closedSet": true,
    "frames": [
      {
        "uz": "x − 46 = 29 tenglamasi berilgan.",
        "ru": "Дано уравнение x − 46 = 29.",
        "en": "The equation x − 46 = 29 is given."
      },
      {
        "uz": "Noma'lum kamayuvchini toping.",
        "ru": "Найдите неизвестное уменьшаемое.",
        "en": "Find the unknown minuend."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "17",
        "ru": "17",
        "en": "17"
      },
      {
        "uz": "75",
        "ru": "75",
        "en": "75"
      },
      {
        "uz": "85",
        "ru": "85",
        "en": "85"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "29 + 46 = 75, shuning uchun x = 75.",
      "ru": "29 + 46 = 75, поэтому x = 75.",
      "en": "29 + 46 = 75, so x = 75."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iks ayirilgan qirq olti teng yigirma to'qqiz tenglamasi berilgan.",
          "Noma'lum kamayuvchini toping."
        ],
        "ru": [
          "Дано уравнение икс минус сорок шесть равно двадцать девять.",
          "Найдите неизвестное уменьшаемое."
        ],
        "en": [
          "The equation x minus forty six equals twenty nine is given.",
          "Find the unknown minuend."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Yigirma to'qqiz qo'shilgan qirq olti teng yetmish besh, shuning uchun iks teng yetmish besh.",
        "ru": "Верно. Двадцать девять плюс сорок шесть равно семьдесят пять, поэтому икс равно семьдесят пять.",
        "en": "Correct. Twenty nine plus forty six equals seventy five, so x equals seventy five."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: O'n yetti qirq oltidan yigirma to'qqizni ayirishdan chiqadi, ammo iks kamayuvchi. Yigirma to'qqizga qirq oltini qo'shing.",
          "ru": "Посмотрите ещё раз: Семнадцать получается при вычитании двадцати девяти из сорока шести, но икс является уменьшаемым. Сложите двадцать девять и сорок шесть.",
          "en": "Look again: Seventeen comes from subtracting twenty-nine from forty-six, but x is the minuend. Add twenty-nine and forty-six."
        },
        {
          "uz": "To'g'ri. Yigirma to'qqiz qo'shilgan qirq olti teng yetmish besh, shuning uchun iks teng yetmish besh.",
          "ru": "Верно. Двадцать девять плюс сорок шесть равно семьдесят пять, поэтому икс равно семьдесят пять.",
          "en": "Correct. Twenty nine plus forty six equals seventy five, so x equals seventy five."
        },
        {
          "uz": "Yana bir qarang: Sakson beshni tekshirsak, undan qirq olti ayirilganda o'ttiz to'qqiz chiqadi, yigirma to'qqiz emas. Iks yetmish besh.",
          "ru": "Посмотрите ещё раз: Проверка числа восемьдесят пять даёт тридцать девять после вычитания сорока шести, а не двадцать девять. Икс равен семидесяти пяти.",
          "en": "Look again: Checking eighty-five gives thirty-nine after subtracting forty-six, not twenty-nine. The solution is seventy-five."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: O'n yetti qirq oltidan yigirma to'qqizni ayirishdan chiqadi, ammo iks kamayuvchi. Yigirma to'qqizga qirq oltini qo'shing.",
        "ru": "Посмотрите ещё раз: Семнадцать получается при вычитании двадцати девяти из сорока шести, но икс является уменьшаемым. Сложите двадцать девять и сорок шесть.",
        "en": "Look again: Seventeen comes from subtracting twenty-nine from forty-six, but x is the minuend. Add twenty-nine and forty-six."
      },
      {
        "uz": "To'g'ri. Yigirma to'qqiz qo'shilgan qirq olti teng yetmish besh, shuning uchun iks teng yetmish besh.",
        "ru": "Верно. Двадцать девять плюс сорок шесть равно семьдесят пять, поэтому икс равно семьдесят пять.",
        "en": "Correct. Twenty nine plus forty six equals seventy five, so x equals seventy five."
      },
      {
        "uz": "Yana bir qarang: Sakson beshni tekshirsak, undan qirq olti ayirilganda o'ttiz to'qqiz chiqadi, yigirma to'qqiz emas. Iks yetmish besh.",
        "ru": "Посмотрите ещё раз: Проверка числа восемьдесят пять даёт тридцать девять после вычитания сорока шести, а не двадцать девять. Икс равен семидесяти пяти.",
        "en": "Look again: Checking eighty-five gives thirty-nine after subtracting forty-six, not twenty-nine. The solution is seventy-five."
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
      "uz": "96-x=38",
      "ru": "96-x=38",
      "en": "96-x=38"
    },
    "scene": "subtrahend-equation",
    "closedSet": true,
    "frames": [
      {
        "uz": "96 − x = 38 tenglamasi berilgan.",
        "ru": "Дано уравнение 96 − x = 38.",
        "en": "The equation 96 − x = 38 is given."
      },
      {
        "uz": "Noma'lum ayiriluvchini toping.",
        "ru": "Найдите неизвестное вычитаемое.",
        "en": "Find the unknown subtrahend."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "58",
        "ru": "58",
        "en": "58"
      },
      {
        "uz": "68",
        "ru": "68",
        "en": "68"
      },
      {
        "uz": "134",
        "ru": "134",
        "en": "134"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "96 − 38 = 58, shuning uchun x = 58.",
      "ru": "96 − 38 = 58, поэтому x = 58.",
      "en": "96 − 38 = 58, so x = 58."
    },
    "audio": {
      "intro": {
        "uz": [
          "To'qson olti ayirilgan iks teng o'ttiz sakkiz tenglamasi berilgan.",
          "Noma'lum ayiriluvchini toping."
        ],
        "ru": [
          "Дано уравнение девяносто шесть минус икс равно тридцать восемь.",
          "Найдите неизвестное вычитаемое."
        ],
        "en": [
          "The equation ninety six minus x equals thirty eight is given.",
          "Find the unknown subtrahend."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'qson olti ayirilgan o'ttiz sakkiz teng ellik sakkiz, shuning uchun iks teng ellik sakkiz.",
        "ru": "Верно. Девяносто шесть минус тридцать восемь равно пятьдесят восемь, поэтому икс равно пятьдесят восемь.",
        "en": "Correct. Ninety six minus thirty eight equals fifty eight, so x equals fifty eight."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'qson olti ayirilgan o'ttiz sakkiz teng ellik sakkiz, shuning uchun iks teng ellik sakkiz.",
          "ru": "Верно. Девяносто шесть минус тридцать восемь равно пятьдесят восемь, поэтому икс равно пятьдесят восемь.",
          "en": "Correct. Ninety six minus thirty eight equals fifty eight, so x equals fifty eight."
        },
        {
          "uz": "Yana bir qarang: Oltmish sakkizni tekshirsak, to'qson oltidan ayirilganda yigirma sakkiz chiqadi, o'ttiz sakkiz emas. Iks ellik sakkiz.",
          "ru": "Посмотрите ещё раз: Проверка числа шестьдесят восемь даёт двадцать восемь после вычитания из девяноста шести, а не тридцать восемь. Икс равен пятидесяти восьми.",
          "en": "Look again: Checking sixty-eight gives twenty-eight when subtracted from ninety-six, not thirty-eight. The solution is fifty-eight."
        },
        {
          "uz": "Yana bir qarang: Bir yuz o'ttiz to'rt to'qson olti bilan o'ttiz sakkizni qo'shishdan chiqadi. Noma'lum ayiriluvchi ayirish bilan topiladi.",
          "ru": "Посмотрите ещё раз: Сто тридцать четыре получается при сложении девяноста шести и тридцати восьми. Неизвестное вычитаемое находят вычитанием.",
          "en": "Look again: One hundred and thirty-four comes from adding ninety-six and thirty-eight. Find the unknown subtrahend by subtraction."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'qson olti ayirilgan o'ttiz sakkiz teng ellik sakkiz, shuning uchun iks teng ellik sakkiz.",
        "ru": "Верно. Девяносто шесть минус тридцать восемь равно пятьдесят восемь, поэтому икс равно пятьдесят восемь.",
        "en": "Correct. Ninety six minus thirty eight equals fifty eight, so x equals fifty eight."
      },
      {
        "uz": "Yana bir qarang: Oltmish sakkizni tekshirsak, to'qson oltidan ayirilganda yigirma sakkiz chiqadi, o'ttiz sakkiz emas. Iks ellik sakkiz.",
        "ru": "Посмотрите ещё раз: Проверка числа шестьдесят восемь даёт двадцать восемь после вычитания из девяноста шести, а не тридцать восемь. Икс равен пятидесяти восьми.",
        "en": "Look again: Checking sixty-eight gives twenty-eight when subtracted from ninety-six, not thirty-eight. The solution is fifty-eight."
      },
      {
        "uz": "Yana bir qarang: Bir yuz o'ttiz to'rt to'qson olti bilan o'ttiz sakkizni qo'shishdan chiqadi. Noma'lum ayiriluvchi ayirish bilan topiladi.",
        "ru": "Посмотрите ещё раз: Сто тридцать четыре получается при сложении девяноста шести и тридцати восьми. Неизвестное вычитаемое находят вычитанием.",
        "en": "Look again: One hundred and thirty-four comes from adding ninety-six and thirty-eight. Find the unknown subtrahend by subtraction."
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
      "uz": "8x=72",
      "ru": "8x=72",
      "en": "8x=72"
    },
    "scene": "factor-equation",
    "closedSet": true,
    "frames": [
      {
        "uz": "8x = 72 tenglamasi berilgan.",
        "ru": "Дано уравнение 8x = 72.",
        "en": "The equation 8x = 72 is given."
      },
      {
        "uz": "Noma'lum ko'paytuvchini toping.",
        "ru": "Найдите неизвестный множитель.",
        "en": "Find the unknown factor."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "8",
        "ru": "8",
        "en": "8"
      },
      {
        "uz": "9",
        "ru": "9",
        "en": "9"
      },
      {
        "uz": "64",
        "ru": "64",
        "en": "64"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "72 ÷ 8 = 9, shuning uchun x = 9.",
      "ru": "72 ÷ 8 = 9, поэтому x = 9.",
      "en": "72 ÷ 8 = 9, so x = 9."
    },
    "audio": {
      "intro": {
        "uz": [
          "Sakkiz karra iks teng yetmish ikki tenglamasi berilgan.",
          "Noma'lum ko'paytuvchini toping."
        ],
        "ru": [
          "Дано уравнение восемь умножить на икс равно семьдесят два.",
          "Найдите неизвестный множитель."
        ],
        "en": [
          "The equation eight multiplied by x equals seventy two is given.",
          "Find the unknown factor."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Yetmish ikki bo'lingan sakkiz teng to'qqiz, shuning uchun iks teng to'qqiz.",
        "ru": "Верно. Семьдесят два разделить на восемь равно девять, поэтому икс равно девять.",
        "en": "Correct. Seventy two divided by eight equals nine, so x equals nine."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Sakkiz ko'paytiruvchi sonning o'zi, lekin noma'lum emas. Iks sakkiz bo'lsa, sakkiz karra sakkiz oltmish to'rt bo'ladi, yetmish ikki emas.",
          "ru": "Посмотрите ещё раз: Восемь является известным множителем, а не неизвестным. Если икс равен восьми, произведение равно шестидесяти четырём, а не семидесяти двум.",
          "en": "Look again: Eight is the known factor, not the unknown. If x were eight, eight times eight would be sixty-four, not seventy-two."
        },
        {
          "uz": "To'g'ri. Yetmish ikki bo'lingan sakkiz teng to'qqiz, shuning uchun iks teng to'qqiz.",
          "ru": "Верно. Семьдесят два разделить на восемь равно девять, поэтому икс равно девять.",
          "en": "Correct. Seventy two divided by eight equals nine, so x equals nine."
        },
        {
          "uz": "Yana bir qarang: Oltmish to'rt yetmish ikkidan sakkizni ayirishdan chiqadi, ammo tenglamada ko'paytirish bor. Yetmish ikkini sakkizga bo'ling.",
          "ru": "Посмотрите ещё раз: Шестьдесят четыре получается при вычитании восьми из семидесяти двух, но в уравнении стоит умножение. Разделите семьдесят два на восемь.",
          "en": "Look again: Sixty-four comes from subtracting eight from seventy-two, but the equation uses multiplication. Divide seventy-two by eight."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Sakkiz ko'paytiruvchi sonning o'zi, lekin noma'lum emas. Iks sakkiz bo'lsa, sakkiz karra sakkiz oltmish to'rt bo'ladi, yetmish ikki emas.",
        "ru": "Посмотрите ещё раз: Восемь является известным множителем, а не неизвестным. Если икс равен восьми, произведение равно шестидесяти четырём, а не семидесяти двум.",
        "en": "Look again: Eight is the known factor, not the unknown. If x were eight, eight times eight would be sixty-four, not seventy-two."
      },
      {
        "uz": "To'g'ri. Yetmish ikki bo'lingan sakkiz teng to'qqiz, shuning uchun iks teng to'qqiz.",
        "ru": "Верно. Семьдесят два разделить на восемь равно девять, поэтому икс равно девять.",
        "en": "Correct. Seventy two divided by eight equals nine, so x equals nine."
      },
      {
        "uz": "Yana bir qarang: Oltmish to'rt yetmish ikkidan sakkizni ayirishdan chiqadi, ammo tenglamada ko'paytirish bor. Yetmish ikkini sakkizga bo'ling.",
        "ru": "Посмотрите ещё раз: Шестьдесят четыре получается при вычитании восьми из семидесяти двух, но в уравнении стоит умножение. Разделите семьдесят два на восемь.",
        "en": "Look again: Sixty-four comes from subtracting eight from seventy-two, but the equation uses multiplication. Divide seventy-two by eight."
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
      "uz": "x÷8=36",
      "ru": "x÷8=36",
      "en": "x÷8=36"
    },
    "scene": "dividend-equation",
    "closedSet": true,
    "frames": [
      {
        "uz": "x ÷ 8 = 36 tenglamasi berilgan.",
        "ru": "Дано уравнение x ÷ 8 = 36.",
        "en": "The equation x ÷ 8 = 36 is given."
      },
      {
        "uz": "Noma'lum bo'linuvchini toping.",
        "ru": "Найдите неизвестное делимое.",
        "en": "Find the unknown dividend."
      },
      {
        "uz": "Ildizni o'rniga qo'yib tekshiring.",
        "ru": "Подставьте корень и проверьте.",
        "en": "Substitute the solution and check it."
      }
    ],
    "question": {
      "uz": "x nechaga teng?",
      "ru": "Чему равен x?",
      "en": "What is x?"
    },
    "options": [
      {
        "uz": "44",
        "ru": "44",
        "en": "44"
      },
      {
        "uz": "288",
        "ru": "288",
        "en": "288"
      },
      {
        "uz": "4",
        "ru": "4",
        "en": "4"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "36 × 8 = 288, shuning uchun x = 288.",
      "ru": "36 × 8 = 288, поэтому x = 288.",
      "en": "36 × 8 = 288, so x = 288."
    },
    "audio": {
      "intro": {
        "uz": [
          "Iks bo'lingan sakkiz teng o'ttiz olti tenglamasi berilgan.",
          "Noma'lum bo'linuvchini toping.",
          "Ildizni o'rniga qo'yib tekshiring."
        ],
        "ru": [
          "Дано уравнение икс разделить на восемь равно тридцать шесть.",
          "Найдите неизвестное делимое.",
          "Подставьте корень и проверьте."
        ],
        "en": [
          "The equation x divided by eight equals thirty six is given.",
          "Find the unknown dividend.",
          "Substitute the solution and check it."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. O'ttiz olti karra sakkiz teng ikki yuz sakson sakkiz, shuning uchun iks teng ikki yuz sakson sakkiz.",
        "ru": "Верно. Тридцать шесть умножить на восемь равно двести восемьдесят восемь, поэтому икс равно двести восемьдесят восемь.",
        "en": "Correct. Thirty six multiplied by eight equals two hundred and eighty eight, so x equals two hundred and eighty eight."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Qirq to'rt o'ttiz olti bilan sakkizni qo'shishdan chiqadi. Iks bo'linuvchi bo'lgani uchun o'ttiz oltini sakkizga ko'paytiring.",
          "ru": "Посмотрите ещё раз: Сорок четыре получается при сложении тридцати шести и восьми. Икс является делимым, поэтому умножьте тридцать шесть на восемь.",
          "en": "Look again: Forty-four comes from adding thirty-six and eight. The unknown is the dividend, so multiply thirty-six by eight."
        },
        {
          "uz": "To'g'ri. O'ttiz olti karra sakkiz teng ikki yuz sakson sakkiz, shuning uchun iks teng ikki yuz sakson sakkiz.",
          "ru": "Верно. Тридцать шесть умножить на восемь равно двести восемьдесят восемь, поэтому икс равно двести восемьдесят восемь.",
          "en": "Correct. Thirty six multiplied by eight equals two hundred and eighty eight, so x equals two hundred and eighty eight."
        },
        {
          "uz": "Yana bir qarang: O'ttiz oltini sakkizga bo'lish noma'lum bo'linuvchini topmaydi. Bo'linuvchi bo'luvchi bilan bo'linma ko'paytmasiga teng: ikki yuz sakson sakkiz.",
          "ru": "Посмотрите ещё раз: Деление тридцати шести на восемь не находит неизвестное делимое. Делимое равно произведению делителя и частного: двести восемьдесят восемь.",
          "en": "Look again: Dividing thirty-six by eight does not find an unknown dividend. The dividend equals divisor times quotient: two hundred and eighty-eight."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Qirq to'rt o'ttiz olti bilan sakkizni qo'shishdan chiqadi. Iks bo'linuvchi bo'lgani uchun o'ttiz oltini sakkizga ko'paytiring.",
        "ru": "Посмотрите ещё раз: Сорок четыре получается при сложении тридцати шести и восьми. Икс является делимым, поэтому умножьте тридцать шесть на восемь.",
        "en": "Look again: Forty-four comes from adding thirty-six and eight. The unknown is the dividend, so multiply thirty-six by eight."
      },
      {
        "uz": "To'g'ri. O'ttiz olti karra sakkiz teng ikki yuz sakson sakkiz, shuning uchun iks teng ikki yuz sakson sakkiz.",
        "ru": "Верно. Тридцать шесть умножить на восемь равно двести восемьдесят восемь, поэтому икс равно двести восемьдесят восемь.",
        "en": "Correct. Thirty six multiplied by eight equals two hundred and eighty eight, so x equals two hundred and eighty eight."
      },
      {
        "uz": "Yana bir qarang: O'ttiz oltini sakkizga bo'lish noma'lum bo'linuvchini topmaydi. Bo'linuvchi bo'luvchi bilan bo'linma ko'paytmasiga teng: ikki yuz sakson sakkiz.",
        "ru": "Посмотрите ещё раз: Деление тридцати шести на восемь не находит неизвестное делимое. Делимое равно произведению делителя и частного: двести восемьдесят восемь.",
        "en": "Look again: Dividing thirty-six by eight does not find an unknown dividend. The dividend equals divisor times quotient: two hundred and eighty-eight."
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
      "uz": "Tenglama yo'li",
      "ru": "Путь уравнения",
      "en": "Equation route"
    },
    "scene": "summary",
    "frames": [
      {
        "uz": "Tenglik ikki tomonning qiymati bir xil ekanini bildiradi.",
        "ru": "Равенство означает, что две стороны имеют одинаковое значение.",
        "en": "An equality means that both sides have the same value."
      },
      {
        "uz": "Noma'lum komponentning o'rnini aniqlang.",
        "ru": "Определите положение неизвестного компонента.",
        "en": "Identify the position of the unknown component."
      },
      {
        "uz": "Teskari amalni tanlang.",
        "ru": "Выберите обратное действие.",
        "en": "Choose the inverse operation."
      },
      {
        "uz": "Topilgan son — tenglama ildizi.",
        "ru": "Найденное число — корень уравнения.",
        "en": "The number found is the equation's solution."
      },
      {
        "uz": "Keyingi darsda ildizni almashtirib tekshiramiz.",
        "ru": "На следующем уроке проверим корень подстановкой.",
        "en": "Next, we will check solutions by substitution."
      }
    ],
    "audio": {
      "uz": [
        "Tenglik ikki tomonning qiymati bir xil ekanini bildiradi.",
        "Noma'lum komponentning o'rnini aniqlang.",
        "Teskari amalni tanlang.",
        "Topilgan son, tenglama ildizi.",
        "Keyingi darsda ildizni almashtirib tekshiramiz."
      ],
      "ru": [
        "Равенство означает, что две стороны имеют одинаковое значение.",
        "Определите положение неизвестного компонента.",
        "Выберите обратное действие.",
        "Найденное число, корень уравнения.",
        "На следующем уроке проверим корень подстановкой."
      ],
      "en": [
        "An equality means that both sides have the same value.",
        "Identify the position of the unknown component.",
        "Choose the inverse operation.",
        "The number found is the equation's solution.",
        "Next, we will check solutions by substitution."
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
  const models = {
    hook: ['□ + 28 = 65', '□ = ?', '? + 28 = 65'],
    expression: ['35 + 28', 'x + 28 = 65', '='],
    root: ['x + 28 = 65', 'x = 37', '37 + 28 = 65'],
    balance: ['L', '=', 'R'],
    'add-inverse': ['x + 28 = 65', '65 − 28', 'x = 37'],
    'multiply-inverse': ['8x = 72', '72 ÷ 8', 'x = 9'],
    components: ['x + 37 = 82', 'x − 46 = 29', '96 − x = 38'],
    algorithm: ['x = ?', '+ ↔ −', 'x'],
    'equation-choice': ['x + 18 = 45', 'x + □ = □', '='],
    'add-equation': ['x + 37 = 82', '82 − 37', 'x = 45'],
    'minuend-equation': ['x − 46 = 29', '29 + 46', 'x = 75'],
    'subtrahend-equation': ['96 − x = 38', '96 − 38', 'x = 58'],
    'factor-equation': ['8x = 72', '72 ÷ 8', 'x = 9'],
    'dividend-equation': ['x ÷ 8 = 36', '36 × 8', 'x = 288'],
    summary: ['L = R', '↔', 'x'],
  };
  const model = models[scene] || models.hook;
  return <div className={'topic-visual topic-v42 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g className={on(0)}><line x1="300" y1="46" x2="300" y2="184" stroke="#173B52" strokeWidth="8"/><line x1="124" y1="90" x2="476" y2="90" stroke="#173B52" strokeWidth="7"/><path d="M124 90 l-62 88 h124z M476 90 l-62 88 h124z" fill="#E5F5F6" stroke="#168FA3" strokeWidth="4"/></g>
    <g className={on(1)}><rect x="78" y="112" width="444" height="48" rx="14" fill="#FFF" stroke="#FF5B35" strokeWidth="4"/><text x="300" y="143" textAnchor="middle" fontSize="25" fontWeight="900" fill="#173B52">{model[0]}</text></g>
    <g className={on(2)}><path d="M214 28 H386" stroke="#FF5B35" strokeWidth="5" strokeDasharray="9 7"/><text x="300" y="22" textAnchor="middle" fontSize="20" fontWeight="900" fill="#FF5B35">{model[1]}</text></g>
    <g className={on(3)}><rect x="210" y="170" width="180" height="42" rx="14" fill="#E7F3EC" stroke="#95C93D" strokeWidth="4"/><text x="300" y="198" textAnchor="middle" fontSize="22" fontWeight="900" fill="#173B52">{model[2]}</text></g>
    <g className={on(4)}><circle cx="556" cy="30" r="15" fill="#95C93D"/><path d="M548 30 l6 6 11-15" fill="none" stroke="#173B52" strokeWidth="4"/></g>
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
export default function Grade4Dars42({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars42 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
