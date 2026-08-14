import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 50 · Jadvallar, ustunli va chiziqli grafiklar
// 15 ekran · boshqariladigan audio · har bir mazmunli harakat yakunlangach navigatsiya ochiladi.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "data-4-50-v1", slug: "dars50-grafiklar-va-malumotlar", lessonTitle: {"uz":"Grafiklar va ma'lumotlarni tasvirlash usullari","ru":"Графики и способы представления данных","en":"Graphs and ways to represent data"}, skillTags: ["tables","bar-charts","line-graphs","scale","data-representation"] };
const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'hypothesis-choice', goal: 'diagnose-scale-reading', mechanic: 'hypothesis-choice', active: true, assessed: false, scored: false, scope: 'hook', misconceptions: ['ignore-scale', 'blame-table', 'blame-graph'] },
  { id: 's1', type: 'exploration', template: 'guided-table', goal: 'read-table-addresses', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's2', type: 'exploration', template: 'guided-model', goal: 'map-values-to-bars', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['count-bars-not-values'] },
  { id: 's3', type: 'exploration', template: 'guided-scale', goal: 'interpret-scale', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['count-squares-only'] },
  { id: 's4', type: 'exploration', template: 'guided-compare', goal: 'compare-categories', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's5', type: 'exploration', template: 'guided-trend', goal: 'read-change-over-time', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['ignore-order'] },
  { id: 's6', type: 'rule', template: 'guided-translation', goal: 'translate-table-to-graph', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: ['swap-axis-values'] },
  { id: 's7', type: 'rule', template: 'guided-rule', goal: 'formulate-graph-reading-algorithm', mechanic: 'guided-reveal', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's8', type: 'test', template: 'choice-retry', goal: 'identify-maximum', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['choose-first', 'choose-last'] },
  { id: 's9', type: 'test', template: 'choice-retry', goal: 'apply-axis-scale', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['count-marks', 'append-extra-zero'] },
  { id: 's10', type: 'test', template: 'choice-retry', goal: 'compare-two-values', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['subtract-in-wrong-order', 'add-values'] },
  { id: 's11', type: 'strategy', template: 'strategy-choice', goal: 'describe-trend', mechanic: 'choice-retry', active: true, assessed: false, scored: false, scope: 'module-mikro', misconceptions: ['ignore-plateau', 'read-single-point'] },
  { id: 's12', type: 'error', template: 'error-repair', goal: 'analyse-scale-error', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['count-squares', 'use-unit-as-total'] },
  { id: 's13', type: 'case', template: 'life-transfer', goal: 'choose-representation-for-time-series', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['compare-only', 'table-only'] },
  { id: 's14', type: 'summary', template: 'guided-reflection', goal: 'reflect-on-data-checking-strategy', mechanic: 'guided-reveal-and-reflection', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const SOLUTION_LABEL = bi('YECHIM', 'РЕШЕНИЕ', 'SOLUTION');
const HOOK_CORRECT_INDEX = 0;
const REFLECTION = {
  question: bi("Ma'lumotdan xulosa chiqarishda siz avval nimani tekshirasiz?", 'Что ты проверишь сначала, прежде чем сделать вывод по данным?', 'What will you check first before drawing a conclusion from data?'),
  options: [
    bi("Sarlavha va o'qlarni", 'Заголовок и оси', 'The title and axes'),
    bi("Birlik va masshtabni", 'Единицу и масштаб', 'The unit and scale'),
    bi("Vazifaga mos tasvir turini", 'Подходящий для задачи вид представления', 'The representation suited to the task'),
  ],
};
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Lumo kuzatuv markazi",
      "ru": "Центр наблюдения Лумо",
      "en": "Lumo monitoring centre"
    },
    "title": {
      "uz": "Jadval va grafik nega farq qildi?",
      "ru": "Почему таблица и график различаются?",
      "en": "Why do the table and graph disagree?"
    },
    "scene": "chart-hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "Jadvaldagi qiymat: 40",
        "ru": "Значение в таблице: 40",
        "en": "Value in the table: 40"
      },
      {
        "uz": "Diagrammadagi ustun: 4 katak",
        "ru": "Столбец на диаграмме: 4 клетки",
        "en": "Bar on the chart: 4 squares"
      },
      {
        "uz": "1 katak 10 birlik edi",
        "ru": "1 клетка означала 10 единиц",
        "en": "1 square represented 10 units"
      }
    ],
    "question": {
      "uz": "Nega jadval va grafik farq qildi?",
      "ru": "Почему таблица и график дали разные ответы?",
      "en": "Why did the table and graph seem to disagree?"
    },
    "options": [
      {
        "uz": "Masshtab hisobga olinmadi",
        "ru": "Масштаб не учли",
        "en": "The scale was ignored"
      },
      {
        "uz": "Jadval xato",
        "ru": "Таблица неверна",
        "en": "The table is wrong"
      },
      {
        "uz": "Grafik xato",
        "ru": "График неверен",
        "en": "The graph is wrong"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Jadval va grafik bir ma'lumotni qanday ko'rsatishini tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим, как таблица и график представляют одни данные.",
      "en": "Estimate saved. We will compare how a table and graph show the same data."
    },
    "wrong": [
      {
        "uz": "Bu taxmin asosiy sababga qaraydi. Bitta katak nimani bildirishini tekshiramiz.",
        "ru": "Эта гипотеза указывает на главную причину. Проверим, что означает одна клетка.",
        "en": "This estimate points to the main cause. We will check what one square represents."
      },
      {
        "uz": "Jadval aniq qiymatni beradi. Uni grafik masshtabi bilan taqqoslaymiz.",
        "ru": "Таблица даёт точное значение. Сравним его с масштабом графика.",
        "en": "The table gives an exact value. We will compare it with the graph scale."
      },
      {
        "uz": "Grafik faqat boshqacha ko'rinmoqda. Kataklar sonini masshtab bilan bog'laymiz.",
        "ru": "График только выглядит иначе. Свяжем число клеток с масштабом.",
        "en": "The graph only looks different. We will connect the number of squares to the scale."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Salom, do'stim! Bugun grafiklar va ma'lumotlarni tasvirlash usullarini o'rganamiz. Jadvaldagi qiymat qirq",
          "Diagrammadagi ustun to'rt katak",
          "Bitta katak o'n birlikni bildiradi"
        ],
        "ru": [
          "Привет, друг! Сегодня мы изучим графики и способы представления данных. Значение в таблице сорок",
          "Столбец на диаграмме четыре клетки",
          "Одна клетка обозначала десять единиц"
        ],
        "en": [
          "Hey, buddy! Today we'll learn about graphs and ways to represent data. Value in the table forty",
          "Bar on the chart four squares",
          "one square represented ten units"
        ]
      }
    }
  },
  "s1": {
    "eyebrow": {
      "uz": "Jadval tuzilishi",
      "ru": "Строение таблицы",
      "en": "Table structure"
    },
    "title": {
      "uz": "Jadval manzillari",
      "ru": "Адреса таблицы",
      "en": "Table locations"
    },
    "scene": "chart-table",
    "frames": [
      {
        "uz": "Sarlavha",
        "ru": "Заголовок",
        "en": "Title"
      },
      {
        "uz": "Ustun",
        "ru": "Столбец",
        "en": "Column"
      },
      {
        "uz": "Satr",
        "ru": "Строка",
        "en": "Row"
      },
      {
        "uz": "Katakdagi qiymat",
        "ru": "Значение в ячейке",
        "en": "Cell value"
      }
    ],
    "audio": {
      "uz": [
        "Sarlavha",
        "Ustun",
        "Satr",
        "Katakdagi qiymat"
      ],
      "ru": [
        "Заголовок",
        "Столбец",
        "Строка",
        "Значение в ячейке"
      ],
      "en": [
        "Title",
        "Column",
        "Row",
        "Cell value"
      ]
    }
  },
  "s2": {
    "eyebrow": {
      "uz": "Ustunli diagramma",
      "ru": "Столбчатая диаграмма",
      "en": "Bar chart"
    },
    "title": {
      "uz": "Ustunli diagramma",
      "ru": "Столбчатая диаграмма",
      "en": "Bar chart"
    },
    "scene": "chart-bars",
    "frames": [
      {
        "uz": "Kategoriyalar gorizontal o'qda",
        "ru": "Категории расположены на горизонтальной оси",
        "en": "Categories are on the horizontal axis"
      },
      {
        "uz": "Qiymatlar tik o'qda",
        "ru": "Значения расположены на вертикальной оси",
        "en": "Values are on the vertical axis"
      },
      {
        "uz": "Ustunlar yuqoriga o'sadi",
        "ru": "Столбцы растут вверх",
        "en": "The bars grow upwards"
      },
      {
        "uz": "Ustun balandligi masshtab bo'yicha qiymatni ko'rsatadi",
        "ru": "Высота столбца показывает значение с учётом масштаба",
        "en": "Bar height shows the value according to the scale"
      }
    ],
    "audio": {
      "uz": [
        "Kategoriyalar gorizontal o'qda",
        "Qiymatlar tik o'qda",
        "Ustunlar yuqoriga o'sadi",
        "Ustun balandligi masshtab bo'yicha qiymatni ko'rsatadi"
      ],
      "ru": [
        "Категории расположены на горизонтальной оси",
        "Значения расположены на вертикальной оси",
        "Столбцы растут вверх",
        "Высота столбца показывает значение с учётом масштаба"
      ],
      "en": [
        "Categories are on the horizontal axis",
        "Values are on the vertical axis",
        "The bars grow upwards",
        "Bar height shows the value according to the scale"
      ]
    }
  },
  "s3": {
    "eyebrow": {
      "uz": "Masshtab",
      "ru": "Масштаб",
      "en": "Scale"
    },
    "title": {
      "uz": "Masshtab",
      "ru": "Масштаб",
      "en": "Scale"
    },
    "scene": "chart-scale",
    "frames": [
      {
        "uz": "0",
        "ru": "0",
        "en": "0"
      },
      {
        "uz": "10",
        "ru": "10",
        "en": "10"
      },
      {
        "uz": "20, 30, 40",
        "ru": "20, 30, 40",
        "en": "20, 30, 40"
      },
      {
        "uz": "Har bir chiziq 10 birlik",
        "ru": "Каждая линия означает 10 единиц",
        "en": "Each line represents 10 units"
      }
    ],
    "audio": {
      "uz": [
        "nol",
        "o'n",
        "yigirma o'ttiz qirq",
        "Har bir chiziq o'n birlikni bildiradi"
      ],
      "ru": [
        "ноль",
        "десять",
        "двадцать тридцать сорок",
        "Каждая линия означает десять единиц"
      ],
      "en": [
        "zero",
        "ten",
        "twenty thirty forty",
        "Each line represents ten units"
      ]
    }
  },
  "s4": {
    "eyebrow": {
      "uz": "Taqqoslash",
      "ru": "Сравнение",
      "en": "Comparing"
    },
    "title": {
      "uz": "Taqqoslash",
      "ru": "Сравнение",
      "en": "Comparing"
    },
    "scene": "chart-line",
    "frames": [
      {
        "uz": "A=50",
        "ru": "A=50",
        "en": "A=50"
      },
      {
        "uz": "B=30",
        "ru": "B=30",
        "en": "B=30"
      },
      {
        "uz": "50−30",
        "ru": "50−30",
        "en": "50−30"
      },
      {
        "uz": "Farq=20",
        "ru": "Разность=20",
        "en": "Difference=20"
      }
    ],
    "audio": {
      "uz": [
        "A teng ellik",
        "B teng o'ttiz",
        "ellik ayiruv o'ttiz",
        "Farq teng yigirma"
      ],
      "ru": [
        "A равно пятьдесят",
        "B равно тридцать",
        "пятьдесят минус тридцать",
        "Разность равна двадцати"
      ],
      "en": [
        "A equals fifty",
        "B equals thirty",
        "fifty minus thirty",
        "Difference equals twenty"
      ]
    }
  },
  "s5": {
    "eyebrow": {
      "uz": "Ikki ko'rinish",
      "ru": "Два представления",
      "en": "Two representations"
    },
    "title": {
      "uz": "Chiziqli grafik",
      "ru": "Линейный график",
      "en": "Line graph"
    },
    "scene": "chart-transfer",
    "frames": [
      {
        "uz": "Vaqt nuqtalari",
        "ru": "Моменты времени",
        "en": "Time points"
      },
      {
        "uz": "Qiymatlar",
        "ru": "Значения",
        "en": "Values"
      },
      {
        "uz": "Nuqtalarni tartib bilan ulang",
        "ru": "Соедините точки по порядку",
        "en": "Connect the points in order"
      },
      {
        "uz": "Vaqt bo'yicha o'zgarish ko'rinadi",
        "ru": "Видно изменение во времени",
        "en": "The change over time becomes visible"
      }
    ],
    "audio": {
      "uz": [
        "Vaqt nuqtalari",
        "Qiymatlar",
        "Nuqtalarni tartib bilan ulang",
        "Vaqt bo'yicha o'zgarish ko'rinadi"
      ],
      "ru": [
        "Моменты времени",
        "Значения",
        "Соедините точки по порядку",
        "Видно изменение во времени"
      ],
      "en": [
        "Time points",
        "Values",
        "Connect the points in order",
        "The change over time becomes visible"
      ]
    }
  },
  "s6": {
    "eyebrow": {
      "uz": "Tasvirni tanlash",
      "ru": "Выбор представления",
      "en": "Choosing a representation"
    },
    "title": {
      "uz": "Jadvaldan grafikka",
      "ru": "Из таблицы в график",
      "en": "From table to graph"
    },
    "scene": "chart-choice",
    "frames": [
      {
        "uz": "Jadvalning har bir satri nuqtaga aylanadi",
        "ru": "Каждая строка таблицы становится точкой",
        "en": "Each table row becomes a point"
      },
      {
        "uz": "Ikkinchi satr — ikkinchi nuqta",
        "ru": "Вторая строка — вторая точка",
        "en": "The second row becomes the second point"
      },
      {
        "uz": "Barcha nuqtalar joylashtiriladi",
        "ru": "Все точки размещаются",
        "en": "All points are plotted"
      },
      {
        "uz": "Jadval va grafik taqqoslanadi",
        "ru": "Таблица и график сравниваются",
        "en": "The table and graph are compared"
      }
    ],
    "audio": {
      "uz": [
        "Jadvalning har bir satri nuqtaga aylanadi",
        "Ikkinchi satr ikkinchi nuqta",
        "Barcha nuqtalar joylashtiriladi",
        "Jadval va grafik taqqoslanadi"
      ],
      "ru": [
        "Каждая строка таблицы становится точкой",
        "Вторая строка вторая точка",
        "Все точки размещаются",
        "Таблица и график сравниваются"
      ],
      "en": [
        "Each table row becomes a point",
        "The second row becomes the second point",
        "All points are plotted",
        "The table and graph are compared"
      ]
    }
  },
  "s7": {
    "eyebrow": {
      "uz": "O'qish algoritmi",
      "ru": "Алгоритм чтения",
      "en": "Reading algorithm"
    },
    "title": {
      "uz": "Grafikni o'qish algoritmi",
      "ru": "Алгоритм чтения графика",
      "en": "Graph-reading algorithm"
    },
    "scene": "chart-algorithm",
    "frames": [
      {
        "uz": "Sarlavhani o'qing",
        "ru": "Прочитайте заголовок",
        "en": "Read the title"
      },
      {
        "uz": "O'qlarni aniqlang",
        "ru": "Определите оси",
        "en": "Identify the axes"
      },
      {
        "uz": "Birlikni tekshiring",
        "ru": "Проверьте единицу",
        "en": "Check the unit"
      },
      {
        "uz": "Masshtabni tekshiring",
        "ru": "Проверьте масштаб",
        "en": "Check the scale"
      },
      {
        "uz": "4 katak × 10 = 40; jadval va grafik mos",
        "ru": "4 клетки × 10 = 40; таблица и график совпадают",
        "en": "4 squares × 10 = 40; table and graph match"
      }
    ],
    "audio": {
      "uz": [
        "Sarlavhani o'qing",
        "O'qlarni aniqlang",
        "Birlikni tekshiring",
        "Masshtabni tekshiring",
        "Masshtab bo'yicha to'rtta katakning har biri o'n birlik; natija qirq bo'lib, jadvaldagi qiymat bilan mos keladi"
      ],
      "ru": [
        "Прочитайте заголовок",
        "Определите оси",
        "Проверьте единицу",
        "Проверьте масштаб",
        "По масштабу каждая из четырёх клеток означает десять единиц; получаем сорок, как и в таблице"
      ],
      "en": [
        "Read the title",
        "Identify the axes",
        "Check the unit",
        "Check the scale",
        "Using the scale, four squares at ten units each give forty, matching the table"
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
      "uz": "Eng katta ustun",
      "ru": "Самый высокий столбец",
      "en": "Highest bar"
    },
    "scene": "chart-test-bars",
    "closedSet": true,
    "frames": [
      {
        "uz": "Dushanba: 20; seshanba: 35",
        "ru": "Понедельник: 20; вторник: 35",
        "en": "Monday: 20; Tuesday: 35"
      },
      {
        "uz": "Chorshanba: 25",
        "ru": "Среда: 25",
        "en": "Wednesday: 25"
      }
    ],
    "question": {
      "uz": "Eng katta qiymat qaysi kuni?",
      "ru": "В какой день значение наибольшее?",
      "en": "Which day has the highest value?"
    },
    "options": [
      {
        "uz": "Seshanba: 35",
        "ru": "Вторник: 35",
        "en": "Tuesday: 35"
      },
      {
        "uz": "Dushanba: 20",
        "ru": "Понедельник: 20",
        "en": "Monday: 20"
      },
      {
        "uz": "Chorshanba: 25",
        "ru": "Среда: 25",
        "en": "Wednesday: 25"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "35 eng katta qiymat",
      "ru": "35 — наибольшее значение",
      "en": "35 is the highest value"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Seshanbadagi o'ttiz besh yigirma va yigirma beshdan katta.",
        "ru": "Верно. Во вторник значение тридцать пять, оно больше двадцати и двадцати пяти.",
        "en": "Correct. Tuesday's value of thirty five is greater than twenty and twenty five."
      },
      {
        "uz": "Yana bir qarang: dushanbadagi yigirma uch qiymat orasida eng kichigi.",
        "ru": "Посмотрите ещё раз: значение двадцать в понедельник является наименьшим из трёх.",
        "en": "Look again: Monday's twenty is the smallest of the three values."
      },
      {
        "uz": "Yana bir qarang: chorshanbadagi yigirma besh seshanbadagi o'ttiz beshdan kichik.",
        "ru": "Посмотрите ещё раз: двадцать пять в среду меньше тридцати пяти во вторник.",
        "en": "Look again: Wednesday's twenty five is less than Tuesday's thirty five."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Dushanba yigirma seshanba o'ttiz besh",
          "Chorshanba yigirma besh"
        ],
        "ru": [
          "Понедельник двадцать вторник тридцать пять",
          "Среда двадцать пять"
        ],
        "en": [
          "Monday twenty Tuesday thirty five",
          "Wednesday twenty five"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Seshanbadagi o'ttiz besh yigirma va yigirma beshdan katta.",
        "ru": "Верно. Во вторник значение тридцать пять, оно больше двадцати и двадцати пяти.",
        "en": "Correct. Tuesday's value of thirty five is greater than twenty and twenty five."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Seshanbadagi o'ttiz besh yigirma va yigirma beshdan katta.",
          "ru": "Верно. Во вторник значение тридцать пять, оно больше двадцати и двадцати пяти.",
          "en": "Correct. Tuesday's value of thirty five is greater than twenty and twenty five."
        },
        {
          "uz": "Yana bir qarang: dushanbadagi yigirma uch qiymat orasida eng kichigi.",
          "ru": "Посмотрите ещё раз: значение двадцать в понедельник является наименьшим из трёх.",
          "en": "Look again: Monday's twenty is the smallest of the three values."
        },
        {
          "uz": "Yana bir qarang: chorshanbadagi yigirma besh seshanbadagi o'ttiz beshdan kichik.",
          "ru": "Посмотрите ещё раз: двадцать пять в среду меньше тридцати пяти во вторник.",
          "en": "Look again: Wednesday's twenty five is less than Tuesday's thirty five."
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
      "uz": "Masshtabdagi nuqta",
      "ru": "Точка по масштабу",
      "en": "Point on the scale"
    },
    "scene": "chart-test-scale",
    "closedSet": true,
    "frames": [
      {
        "uz": "Har bir chiziq 10 birlik",
        "ru": "Каждая линия означает 10 единиц",
        "en": "Each line represents 10 units"
      },
      {
        "uz": "Nuqta noldan keyingi to'rtinchi chiziqda",
        "ru": "Точка находится на четвёртой линии после нуля",
        "en": "The point is on the fourth line after zero"
      }
    ],
    "question": {
      "uz": "Nuqta qaysi qiymatni ko'rsatadi?",
      "ru": "Какое значение показывает точка?",
      "en": "Which value does the point show?"
    },
    "options": [
      {
        "uz": "4",
        "ru": "4",
        "en": "4"
      },
      {
        "uz": "40",
        "ru": "40",
        "en": "40"
      },
      {
        "uz": "400",
        "ru": "400",
        "en": "400"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "4×10=40",
      "ru": "4×10=40",
      "en": "4×10=40"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: bu variant kataklar sonini qiymat deb olgan.",
        "ru": "Посмотрите ещё раз: этот вариант принял число клеток за значение.",
        "en": "Look again: this option treats the number of squares as the value."
      },
      {
        "uz": "To'g'ri. Noldan keyingi to'rtinchi chiziqqacha to'rtta qadam bor. Har bir qadam o'n birlik, shuning uchun qiymat qirq.",
        "ru": "Верно. Четвёртая линия после нуля при шаге в десять показывает сорок.",
        "en": "Correct. The fourth line after zero shows forty when each step represents ten."
      },
      {
        "uz": "Yana bir qarang: to'rtni o'nga bir marta ko'paytiramiz; to'rt yuzda ortiqcha o'nlik bor.",
        "ru": "Посмотрите ещё раз: четыре умножаем на десять только один раз; в четырёхстах появился лишний множитель десять.",
        "en": "Look again: multiply four by ten only once; four hundred includes an extra factor of ten."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Har bir chiziq o'n birlikni bildiradi",
          "Nuqta noldan keyingi to'rtinchi chiziqda"
        ],
        "ru": [
          "Каждая линия означает десять единиц",
          "Точка находится на четвёртой линии после нуля"
        ],
        "en": [
          "Each line represents ten units",
          "The point is on the fourth line after zero"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Noldan keyingi to'rtinchi chiziqqacha to'rtta qadam bor. Har bir qadam o'n birlik, shuning uchun qiymat qirq.",
        "ru": "Верно. Четвёртая линия после нуля при шаге в десять показывает сорок.",
        "en": "Correct. The fourth line after zero shows forty when each step represents ten."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: bu variant kataklar sonini qiymat deb olgan.",
          "ru": "Посмотрите ещё раз: этот вариант принял число клеток за значение.",
          "en": "Look again: this option treats the number of squares as the value."
        },
        {
          "uz": "To'g'ri. Noldan keyingi to'rtinchi chiziqqacha to'rtta qadam bor. Har bir qadam o'n birlik, shuning uchun qiymat qirq.",
          "ru": "Верно. Четвёртая линия после нуля при шаге в десять показывает сорок.",
          "en": "Correct. The fourth line after zero shows forty when each step represents ten."
        },
        {
          "uz": "Yana bir qarang: to'rtni o'nga bir marta ko'paytiramiz; to'rt yuzda ortiqcha o'nlik bor.",
          "ru": "Посмотрите ещё раз: четыре умножаем на десять только один раз; в четырёхстах появился лишний множитель десять.",
          "en": "Look again: multiply four by ten only once; four hundred includes an extra factor of ten."
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
      "uz": "Ikki kun farqi",
      "ru": "Разница между днями",
      "en": "Difference between two days"
    },
    "scene": "chart-test-difference",
    "closedSet": true,
    "frames": [
      {
        "uz": "55 va 35",
        "ru": "55 и 35",
        "en": "55 and 35"
      },
      {
        "uz": "Ikki qiymat orasidagi farqni toping",
        "ru": "Найдите разницу между двумя значениями",
        "en": "Find the difference between the two values"
      }
    ],
    "question": {
      "uz": "Farq qancha?",
      "ru": "Какова разница?",
      "en": "What is the difference?"
    },
    "options": [
      {
        "uz": "20",
        "ru": "20",
        "en": "20"
      },
      {
        "uz": "30",
        "ru": "30",
        "en": "30"
      },
      {
        "uz": "90",
        "ru": "90",
        "en": "90"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "55−35=20",
      "ru": "55−35=20",
      "en": "55−35=20"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Ellik beshdan o'ttiz beshni ayirsak, farq yigirma bo'ladi.",
        "ru": "Верно. Из пятидесяти пяти вычитаем тридцать пять и получаем разность двадцать.",
        "en": "Correct. Subtracting thirty five from fifty five gives a difference of twenty."
      },
      {
        "uz": "Yana bir qarang: o'ttiz beshdan ellik beshgacha ikkita o'nlik bor, shuning uchun farq o'ttiz emas.",
        "ru": "Посмотрите ещё раз: от тридцати пяти до пятидесяти пяти две десятки, поэтому разность не тридцать.",
        "en": "Look again: there are two tens from thirty five to fifty five, so the difference is not thirty."
      },
      {
        "uz": "Yana bir qarang: to'qson ikki qiymatning yig'indisi; savol esa ularning farqini so'raydi.",
        "ru": "Посмотрите ещё раз: девяносто является суммой двух значений, а вопрос просит найти их разность.",
        "en": "Look again: ninety is the sum of the two values, while the question asks for their difference."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "ellik besh va o'ttiz besh",
          "Ikki qiymat orasidagi farqni toping"
        ],
        "ru": [
          "пятьдесят пять и тридцать пять",
          "Найдите разницу между двумя значениями"
        ],
        "en": [
          "fifty five and thirty five",
          "Find the difference between the two values"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Ellik beshdan o'ttiz beshni ayirsak, farq yigirma bo'ladi.",
        "ru": "Верно. Из пятидесяти пяти вычитаем тридцать пять и получаем разность двадцать.",
        "en": "Correct. Subtracting thirty five from fifty five gives a difference of twenty."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Ellik beshdan o'ttiz beshni ayirsak, farq yigirma bo'ladi.",
          "ru": "Верно. Из пятидесяти пяти вычитаем тридцать пять и получаем разность двадцать.",
          "en": "Correct. Subtracting thirty five from fifty five gives a difference of twenty."
        },
        {
          "uz": "Yana bir qarang: o'ttiz beshdan ellik beshgacha ikkita o'nlik bor, shuning uchun farq o'ttiz emas.",
          "ru": "Посмотрите ещё раз: от тридцати пяти до пятидесяти пяти две десятки, поэтому разность не тридцать.",
          "en": "Look again: there are two tens from thirty five to fifty five, so the difference is not thirty."
        },
        {
          "uz": "Yana bir qarang: to'qson ikki qiymatning yig'indisi; savol esa ularning farqini so'raydi.",
          "ru": "Посмотрите ещё раз: девяносто является суммой двух значений, а вопрос просит найти их разность.",
          "en": "Look again: ninety is the sum of the two values, while the question asks for their difference."
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
      "uz": "Tendensiya",
      "ru": "Тенденция",
      "en": "Trend"
    },
    "scene": "chart-test-trend",
    "closedSet": true,
    "frames": [
      {
        "uz": "Qiymatlar: 20, 30, 30, 45",
        "ru": "Значения: 20, 30, 30, 45",
        "en": "Values: 20, 30, 30, 45"
      },
      {
        "uz": "Nuqtalar vaqt tartibida",
        "ru": "Точки расположены по времени",
        "en": "The points are in time order"
      }
    ],
    "question": {
      "uz": "Qaysi tendensiya to'g'ri?",
      "ru": "Какая тенденция верна?",
      "en": "Which trend is correct?"
    },
    "options": [
      {
        "uz": "O'sdi — o'zgarmadi — o'sdi",
        "ru": "Рост — без изменений — рост",
        "en": "Increased, stayed the same, increased"
      },
      {
        "uz": "Faqat kamaydi",
        "ru": "Только снижалось",
        "en": "Only decreased"
      },
      {
        "uz": "Doim bir xil bo'ldi",
        "ru": "Всегда было одинаково",
        "en": "Always stayed the same"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "20 dan 30 ga o'sdi, 30 da qoldi, keyin 45 ga o'sdi",
      "ru": "Выросло с 20 до 30, осталось 30, затем выросло до 45",
      "en": "It rose from 20 to 30, stayed at 30, then rose to 45"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Qiymat avval yigirmadan o'ttizga oshdi, keyin o'zgarmadi va so'ng qirq beshga oshdi.",
        "ru": "Верно. Значение сначала выросло с двадцати до тридцати, затем не изменилось и после этого выросло до сорока пяти.",
        "en": "Correct. The value first rose from twenty to thirty, then stayed the same, and finally rose to forty five."
      },
      {
        "uz": "Yana bir qarang: ketma-ketlikda birorta ham kamayish yo'q; qiymat ikki marta oshadi.",
        "ru": "Посмотрите ещё раз: в последовательности нет ни одного снижения; значение дважды растёт.",
        "en": "Look again: the sequence never decreases; the value rises twice."
      },
      {
        "uz": "Yana bir qarang: faqat o'rtadagi ikki qiymat bir xil; boshida va oxirida o'sish bor.",
        "ru": "Посмотрите ещё раз: одинаковы только два средних значения; в начале и в конце есть рост.",
        "en": "Look again: only the two middle values are equal; there is growth at the beginning and the end."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Qiymatlar yigirma o'ttiz o'ttiz qirq besh",
          "Nuqtalar vaqt tartibida"
        ],
        "ru": [
          "Значения двадцать тридцать тридцать сорок пять",
          "Точки расположены по времени"
        ],
        "en": [
          "Values twenty thirty thirty forty five",
          "The points are in time order"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Qiymat avval yigirmadan o'ttizga oshdi, keyin o'zgarmadi va so'ng qirq beshga oshdi.",
        "ru": "Верно. Значение сначала выросло с двадцати до тридцати, затем не изменилось и после этого выросло до сорока пяти.",
        "en": "Correct. The value first rose from twenty to thirty, then stayed the same, and finally rose to forty five."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Qiymat avval yigirmadan o'ttizga oshdi, keyin o'zgarmadi va so'ng qirq beshga oshdi.",
          "ru": "Верно. Значение сначала выросло с двадцати до тридцати, затем не изменилось и после этого выросло до сорока пяти.",
          "en": "Correct. The value first rose from twenty to thirty, then stayed the same, and finally rose to forty five."
        },
        {
          "uz": "Yana bir qarang: ketma-ketlikda birorta ham kamayish yo'q; qiymat ikki marta oshadi.",
          "ru": "Посмотрите ещё раз: в последовательности нет ни одного снижения; значение дважды растёт.",
          "en": "Look again: the sequence never decreases; the value rises twice."
        },
        {
          "uz": "Yana bir qarang: faqat o'rtadagi ikki qiymat bir xil; boshida va oxirida o'sish bor.",
          "ru": "Посмотрите ещё раз: одинаковы только два средних значения; в начале и в конце есть рост.",
          "en": "Look again: only the two middle values are equal; there is growth at the beginning and the end."
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
      "uz": "Bit kataklarni sanadimi?",
      "ru": "Бит посчитал клетки?",
      "en": "Did Bit count squares?"
    },
    "scene": "chart-error",
    "closedSet": true,
    "frames": [
      {
        "uz": "Ustun 4 katak baland",
        "ru": "Столбец высотой 4 клетки",
        "en": "The bar is 4 squares high"
      },
      {
        "uz": "Har bir katak 5 birlik",
        "ru": "Каждая клетка означает 5 единиц",
        "en": "Each square represents 5 units"
      }
    ],
    "question": {
      "uz": "To'g'ri qiymat qaysi?",
      "ru": "Каково правильное значение?",
      "en": "What is the correct value?"
    },
    "options": [
      {
        "uz": "20",
        "ru": "20",
        "en": "20"
      },
      {
        "uz": "4",
        "ru": "4",
        "en": "4"
      },
      {
        "uz": "5",
        "ru": "5",
        "en": "5"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "4×5=20",
      "ru": "4×5=20",
      "en": "4×5=20"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'rtta katakning har biri besh birlik bo'lsa, umumiy qiymat yigirma bo'ladi.",
        "ru": "Верно. Четыре клетки по пять единиц дают общее значение двадцать.",
        "en": "Correct. Four squares representing five units each give a total value of twenty."
      },
      {
        "uz": "Yana bir qarang: bu variant kataklar sonini qiymat deb olgan.",
        "ru": "Посмотрите ещё раз: этот вариант принял число клеток за значение.",
        "en": "Look again: this option treats the number of squares as the value."
      },
      {
        "uz": "Yana bir qarang: besh faqat bitta katakning qiymati; ustun esa to'rtta katakdan iborat.",
        "ru": "Посмотрите ещё раз: пять обозначает только одну клетку, а столбец состоит из четырёх клеток.",
        "en": "Look again: five is the value of one square only, while the bar contains four squares."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Ustun to'rt katak baland",
          "Har bir katak besh birlikni bildiradi"
        ],
        "ru": [
          "Столбец высотой четыре клетки",
          "Каждая клетка означает пять единиц"
        ],
        "en": [
          "The bar is four squares high",
          "Each square represents five units"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rtta katakning har biri besh birlik bo'lsa, umumiy qiymat yigirma bo'ladi.",
        "ru": "Верно. Четыре клетки по пять единиц дают общее значение двадцать.",
        "en": "Correct. Four squares representing five units each give a total value of twenty."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'rtta katakning har biri besh birlik bo'lsa, umumiy qiymat yigirma bo'ladi.",
          "ru": "Верно. Четыре клетки по пять единиц дают общее значение двадцать.",
          "en": "Correct. Four squares representing five units each give a total value of twenty."
        },
        {
          "uz": "Yana bir qarang: bu variant kataklar sonini qiymat deb olgan.",
          "ru": "Посмотрите ещё раз: этот вариант принял число клеток за значение.",
          "en": "Look again: this option treats the number of squares as the value."
        },
        {
          "uz": "Yana bir qarang: besh faqat bitta katakning qiymati; ustun esa to'rtta katakdan iborat.",
          "ru": "Посмотрите ещё раз: пять обозначает только одну клетку, а столбец состоит из четырёх клеток.",
          "en": "Look again: five is the value of one square only, while the bar contains four squares."
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
      "uz": "Yetti kunlik suv sarfi",
      "ru": "Расход воды за семь дней",
      "en": "Seven-day water use"
    },
    "scene": "chart-case",
    "closedSet": true,
    "frames": [
      {
        "uz": "7 kunlik suv jadvali",
        "ru": "Таблица расхода воды за 7 дней",
        "en": "A 7-day water-use table"
      },
      {
        "uz": "Vaqt bo'yicha o'zgarish kerak",
        "ru": "Нужно увидеть изменение во времени",
        "en": "We need to see change over time"
      },
      {
        "uz": "Kunlar tartibi muhim",
        "ru": "Порядок дней важен",
        "en": "The order of the days matters"
      }
    ],
    "question": {
      "uz": "Qaysi tasvir eng qulay?",
      "ru": "Какое представление удобнее всего?",
      "en": "Which representation is most suitable?"
    },
    "options": [
      {
        "uz": "Chiziqli grafik",
        "ru": "Линейный график",
        "en": "Line graph"
      },
      {
        "uz": "Ustunli diagramma",
        "ru": "Столбчатая диаграмма",
        "en": "Bar chart"
      },
      {
        "uz": "Faqat jadval",
        "ru": "Только таблица",
        "en": "Table only"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "Chiziqli grafik vaqt bo'yicha o'zgarishni ko'rsatadi",
      "ru": "Линейный график показывает изменение во времени",
      "en": "A line graph shows change over time"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Chiziqli grafik kunlarni tartibda ulab, suv sarfining vaqt bo'yicha o'zgarishini ko'rsatadi.",
        "ru": "Верно. Линейный график соединяет дни по порядку и показывает изменение расхода воды во времени.",
        "en": "Correct. A line graph connects the days in order and shows how water use changes over time."
      },
      {
        "uz": "Yana bir qarang: ustunli diagramma kunlarni taqqoslaydi, ammo ketma-ket vaqt tendensiyasini chiziqli grafikdek aniq ko'rsatmaydi.",
        "ru": "Посмотрите ещё раз: столбчатая диаграмма сравнивает дни, но временную тенденцию показывает менее прямо, чем линейный график.",
        "en": "Look again: a bar chart compares days, but it shows the time trend less directly than a line graph."
      },
      {
        "uz": "Yana bir qarang: jadval aniq qiymatlarni beradi, lekin ko'tarilish va pasayishni grafikdek tez ko'rsatmaydi.",
        "ru": "Посмотрите ещё раз: таблица даёт точные значения, но подъёмы и снижения в ней видны не так быстро, как на графике.",
        "en": "Look again: a table gives exact values, but rises and falls are not as immediate as they are on a graph."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "yetti kunlik suv jadvali",
          "Vaqt bo'yicha o'zgarish kerak",
          "Kunlar tartibi muhim"
        ],
        "ru": [
          "Таблица расхода воды за семь дней",
          "Нужно увидеть изменение во времени",
          "Порядок дней важен"
        ],
        "en": [
          "A seven-day water-use table",
          "We need to see change over time",
          "The order of the days matters"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Chiziqli grafik kunlarni tartibda ulab, suv sarfining vaqt bo'yicha o'zgarishini ko'rsatadi.",
        "ru": "Верно. Линейный график соединяет дни по порядку и показывает изменение расхода воды во времени.",
        "en": "Correct. A line graph connects the days in order and shows how water use changes over time."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Chiziqli grafik kunlarni tartibda ulab, suv sarfining vaqt bo'yicha o'zgarishini ko'rsatadi.",
          "ru": "Верно. Линейный график соединяет дни по порядку и показывает изменение расхода воды во времени.",
          "en": "Correct. A line graph connects the days in order and shows how water use changes over time."
        },
        {
          "uz": "Yana bir qarang: ustunli diagramma kunlarni taqqoslaydi, ammo ketma-ket vaqt tendensiyasini chiziqli grafikdek aniq ko'rsatmaydi.",
          "ru": "Посмотрите ещё раз: столбчатая диаграмма сравнивает дни, но временную тенденцию показывает менее прямо, чем линейный график.",
          "en": "Look again: a bar chart compares days, but it shows the time trend less directly than a line graph."
        },
        {
          "uz": "Yana bir qarang: jadval aniq qiymatlarni beradi, lekin ko'tarilish va pasayishni grafikdek tez ko'rsatmaydi.",
          "ru": "Посмотрите ещё раз: таблица даёт точные значения, но подъёмы и снижения в ней видны не так быстро, как на графике.",
          "en": "Look again: a table gives exact values, but rises and falls are not as immediate as they are on a graph."
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
      "uz": "Ma'lumot navigatori",
      "ru": "Навигатор данных",
      "en": "Data navigator"
    },
    "scene": "chart-final",
    "frames": [
      {
        "uz": "Jadval aniq qiymatni beradi",
        "ru": "Таблица даёт точное значение",
        "en": "A table gives exact values"
      },
      {
        "uz": "Ustunli diagramma kategoriyalarni taqqoslaydi",
        "ru": "Столбчатая диаграмма сравнивает категории",
        "en": "A bar chart compares categories"
      },
      {
        "uz": "Chiziqli grafik vaqt bo'yicha o'zgarishni ko'rsatadi",
        "ru": "Линейный график показывает изменение во времени",
        "en": "A line graph shows change over time"
      },
      {
        "uz": "Masshtabni hisobga oling",
        "ru": "Учитывайте масштаб",
        "en": "Use the scale"
      },
      {
        "uz": "Dalilga tayangan xulosa qiling",
        "ru": "Сделайте вывод на основе данных",
        "en": "Make an evidence-based conclusion"
      }
    ],
    "audio": {
      "uz": [
        "Jadval aniq qiymatni beradi",
        "Ustunli diagramma kategoriyalarni taqqoslaydi",
        "Chiziqli grafik vaqt bo'yicha o'zgarishni ko'rsatadi",
        "Masshtabni hisobga oling",
        "Dalilga tayangan xulosa qiling"
      ],
      "ru": [
        "Таблица даёт точное значение",
        "Столбчатая диаграмма сравнивает категории",
        "Линейный график показывает изменение во времени",
        "Учитывайте масштаб",
        "Сделайте вывод на основе данных"
      ],
      "en": [
        "A table gives exact values",
        "A bar chart compares categories",
        "A line graph shows change over time",
        "Use the scale",
        "Make an evidence-based conclusion"
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
function useGuidedNarration(value, screen, step) { const lang = useLang(); const texts = useMemo(() => { const source = value?.intro ?? value; const localized = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(localized) ? localized : [localized]).filter(Boolean); }, [lang, value]); const intro = useMemo(() => texts.length ? [{ id: 's' + screen + '-beat-0', text: texts[0] }] : [], [screen, texts]); const audio = useAudio(intro); const speakStep = useCallback((index) => { const text = texts[index]; if (text) audio.pushOneOff(text); }, [audio, texts]); return { ...audio, frame: step, caption: texts[step] ?? '', speakStep }; }
const isAudioReady = (audio) => !audio || audio.muted || audio.visualOnly || audio.completed;
const playSfx = (kind) => { const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl; if (!url || typeof window === 'undefined') return; try { new Audio(url).play().catch(() => {}); } catch { /* optional */ } };

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} data-g4-role={className.includes('feedback-bit') ? 'feedback-bit' : undefined} viewBox="0 0 120 150" aria-hidden="true">
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
const AudioIndicator = ({ audio }) => { const t = useT(); const muteLabel = audio.muted ? bi("Ovozni yoqish", 'Включить звук', 'Turn sound on') : bi("Ovozni o'chirish", 'Выключить звук', 'Turn sound off'); return <div className="audio-indicator audio-controls"><button type="button" data-audio-control="mute" onClick={audio.toggleMute} aria-label={t(muteLabel)}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span>{!audio.muted && <button type="button" onClick={audio.replay} aria-label={t(bi('Qayta eshittirish', 'Повторить', 'Replay'))}>↻</button>}</div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), rule: bi('Qoida', 'Правило', "Rule"), strategy: bi('Strategiya', 'Стратегия', 'Strategy'), error: bi('Xatoni tuzatish', 'Исправление ошибки', 'Error repair'), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, canAdvance = true, canFinish = true, finish = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 12 : 24; const ready = canAdvance && canFinish && isAudioReady(audio); const showCaption = Boolean(audio?.caption && (audio.muted || audio.visualOnly)); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}</div><div className="caption-slot" aria-live="polite">{showCaption ? <div className="caption">{audio.caption}</div> : <span aria-hidden="true"/>}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" disabled={!ready} aria-disabled={!ready} onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false }) => { const t = useT(); return <div className={'heading ' + (showBit ? '' : 'heading-solo')}><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{showBit && <BitSVG state={state}/>}</div>; };

const G4TitleReveal = ({ active, title, onComplete }) => {
  const t = useT();
  useEffect(() => { if (!active) return undefined; const timer = window.setTimeout(() => onComplete?.(), window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 80 : 3900); return () => window.clearTimeout(timer); }, [active, onComplete]);
  if (!active || typeof document === 'undefined') return null;
  return createPortal(<div className="g4-title-reveal-overlay rank-boost-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${t(bi('Unvon olindi', 'Звание получено', 'Title earned'))}: ${t(title)}`}><div className="g4-title-reveal-card rank-boost-card"><div className="g4-title-reveal-rays" aria-hidden="true"/><div className="g4-title-reveal-confetti rank-boost-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }}/>)}</div><div className="g4-title-reveal-medal rank-boost-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><h2>{t(title)}</h2></div></div>, document.body);
};
const G4TitleCard = ({ title, answers = [] }) => {
  const t = useT(); const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t(bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED'))}</span><h2>{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t(bi('birinchi urinishda', 'с первой попытки', 'on the first attempt'))}</span></div></aside>;
};
const RelationCards = ({ items, frame }) => <div className="relation-cards">{items.map((item, index) => <span className={index <= frame ? 'active' : ''} key={item}>{item}</span>)}</div>;
const SemanticBarChart = ({ values, labels, max = Math.max(...values), visibleCount = values.length, activeIndex = -1 }) => <div style={{ width: '92%', height: 132, padding: '8px 8px 0', borderLeft: `3px solid ${T.navy}`, borderBottom: `3px solid ${T.navy}`, display: 'flex', alignItems: 'end', justifyContent: 'space-around', gap: 9 }}>
  {values.map((value, index) => { const visible = index < visibleCount; return <span key={`${labels[index]}-${value}`} style={{ width: `${Math.max(16, 70 / values.length)}%`, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', gap: 3 }}><b style={{ opacity: visible ? 1 : 0, color: T.navy, font: "900 10px 'JetBrains Mono',monospace", transition: 'opacity .3s ease' }}>{value}</b><i style={{ width: '100%', height: visible ? `${Math.max(8, value / max * 82)}%` : '5%', opacity: visible ? 1 : .18, borderRadius: '8px 8px 0 0', background: index === activeIndex ? T.accent : T.cyan, transition: 'height .65s cubic-bezier(.16,1,.3,1),opacity .3s ease,background .3s ease' }}/><small style={{ color: T.ink2, fontSize: 9, fontWeight: 900 }}>{labels[index]}</small></span>; })}
</div>;
const SemanticLineChart = ({ values, labels, visibleCount = values.length, connect = true, activeIndex = -1, ariaLabel }) => {
  const max = Math.max(...values, 1); const visibleValues = values.slice(0, visibleCount); const points = visibleValues.map((value, index) => `${24 + index * 74},${112 - value / max * 88}`).join(' ');
  return <svg viewBox="0 0 280 135" width="100%" height="142" role="img" aria-label={ariaLabel}><path d="M22 8 V113 H270" fill="none" stroke={T.navy} strokeWidth="3"/>{connect && visibleValues.length > 1 && <polyline points={points} fill="none" stroke={T.cyan} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>}<g>{values.map((value, index) => { const visible = index < visibleCount; return <g key={`${value}-${index}`} opacity={visible ? 1 : 0}><circle cx={24 + index * 74} cy={112 - value / max * 88} r="6" fill={index === activeIndex ? T.accent : T.cyan}/><text x={24 + index * 74} y={128} textAnchor="middle" fontSize="9" fontWeight="800" fill={T.ink2}>{labels[index]}</text><text x={24 + index * 74} y={104 - value / max * 88} textAnchor="middle" fontSize="9" fontWeight="900" fill={T.navy}>{value}</text></g>; })}</g></svg>;
};
const SemanticScaleAxis = ({ step = 10, steps = 4, visibleSteps = steps, point = null, sparseLabels = false, ariaLabel }) => <svg viewBox="0 0 230 145" width="100%" height="145" role="img" aria-label={ariaLabel}><path d="M62 12 V128 H210" fill="none" stroke={T.navy} strokeWidth="3"/>{Array.from({ length: steps + 1 }, (_, index) => { const y = 128 - index * 27; const visible = index <= visibleSteps; return <g key={index} opacity={visible ? 1 : 0}><path d={`M57 ${y} H210`} stroke="#C9DBDA" strokeWidth="1"/>{(!sparseLabels || index <= 1) && <text x="48" y={y + 4} textAnchor="end" fontSize="10" fontWeight="900" fill={T.navy}>{index * step}</text>}{point === index && <circle cx="150" cy={y} r="8" fill={T.accent}/>}</g>; })}</svg>;
const SemanticMiniTable = ({ rows, activeRow = -1, activeColumn = -1 }) => <div style={{ minWidth: 150, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', border: `2px solid ${T.navy}`, borderRadius: 12, overflow: 'hidden', background: '#FFF' }}>{rows.flatMap((row, rowIndex) => row.map((cell, columnIndex) => { const active = rowIndex === activeRow || columnIndex === activeColumn; return <span key={`${rowIndex}-${columnIndex}`} style={{ padding: '7px 9px', color: active ? '#FFF' : T.navy, background: active ? T.cyan : rowIndex === 0 ? '#E5F5F6' : '#FFF', borderRight: columnIndex === 0 ? '1px solid #D7E5E4' : 0, borderBottom: rowIndex < rows.length - 1 ? '1px solid #D7E5E4' : 0, textAlign: 'center', font: "900 10px 'JetBrains Mono',monospace", transition: 'all .4s ease' }}>{cell}</span>; }))}</div>;
const SemanticWeekTable = ({ dayLabel, valueLabel }) => {
  const values = [24, 28, 25, 30, 27, 29, 31];
  return <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(52px,1.2fr) repeat(7,minmax(27px,1fr))', border: `2px solid ${T.navy}`, borderRadius: 12, overflow: 'hidden', background: '#FFF' }}>{[dayLabel, ...values.map((_, index) => index + 1), valueLabel, ...values].map((cell, index) => <span key={index} style={{ padding: '7px 3px', color: index === 0 || index === 8 ? '#FFF' : T.navy, background: index === 0 || index === 8 ? T.cyan : index < 8 ? '#E5F5F6' : '#FFF', borderRight: index % 8 === 7 ? 0 : '1px solid #D7E5E4', borderBottom: index < 8 ? '1px solid #D7E5E4' : 0, textAlign: 'center', font: "900 9px 'JetBrains Mono',monospace" }}>{cell}</span>)}</div>;
};
function ConversionVisual({ c, frame, revealed = false }) { const visual = <ConversionVisualContent c={c} frame={frame} revealed={revealed}/>; const sceneName = String(c?.scene ?? ''); return /(^|-)hook($|-)/.test(sceneName) ? visual : <div className="canonical-visual-frame" data-g4-role="visual-frame" data-g4-scene={sceneName} style={{ position: 'relative', isolation: 'isolate', minWidth: 0, maxWidth: '100%', height: '100%', overflow: 'hidden' }}>{visual}</div>; }
function ConversionVisualContent({ c, frame, revealed = false }) {
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
    const scene = String(c.scene || 'chart-hook');
    const chartLabel = t(c.title);
    if (scene === 'chart-hook') return <div className="conversion-visual" aria-label={chartLabel}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><SemanticMiniTable rows={[[t(bi('Jadval', 'Таблица', 'Table')), '40']]}/><div style={{ display: 'grid', gridTemplateRows: 'repeat(4,22px)', width: 50, gap: 2, opacity: frame >= 1 ? 1 : .12, transition: 'opacity .35s ease' }}>{Array.from({ length: 4 }, (_, index) => <i key={index} style={{ borderRadius: 4, background: T.cyan }}/>)}</div></div>{frame >= 2 && <strong style={{ color: T.navy, font: "900 13px 'JetBrains Mono',monospace" }}>{t(bi('1 katak = 10', '1 клетка = 10', '1 square = 10'))}</strong>}</div>;
    if (scene === 'chart-table') return <div className="conversion-visual" aria-label={chartLabel}><SemanticMiniTable activeColumn={frame === 1 ? 1 : -1} activeRow={frame >= 2 ? Math.min(2, frame - 1) : -1} rows={[[t(bi('Kun', 'День', 'Day')), t(bi('Qiymat', 'Значение', 'Value'))], [t(bi('Du', 'Пн', 'Mon')), '20'], [t(bi('Se', 'Вт', 'Tue')), '35']]}/><RelationCards items={items.slice(0, 4)} frame={frame}/></div>;
    if (scene === 'chart-bars') return <div className="conversion-visual" aria-label={chartLabel}><SemanticBarChart values={[20, 35, 25]} labels={['A', 'B', 'C']} max={40} visibleCount={frame >= 2 ? 3 : 0}/></div>;
    if (scene === 'chart-scale') return <div className="conversion-visual" aria-label={chartLabel}><SemanticScaleAxis step={10} steps={4} visibleSteps={frame < 2 ? frame : 4} ariaLabel={chartLabel}/></div>;
    if (scene === 'chart-line') return <div className="conversion-visual" aria-label={chartLabel}><SemanticBarChart values={[50, 30]} labels={['A', 'B']} max={50} visibleCount={Math.min(2, frame + 1)}/></div>;
    if (scene === 'chart-transfer') return <div className="conversion-visual" aria-label={chartLabel}><SemanticLineChart values={[20, 30, 30, 45]} labels={['1', '2', '3', '4']} visibleCount={frame >= 1 ? 4 : 0} connect={frame >= 2} ariaLabel={chartLabel}/></div>;
    if (scene === 'chart-choice') return <div className="conversion-visual" aria-label={chartLabel}><div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(120px,.7fr) auto minmax(180px,1.3fr)', alignItems: 'center', gap: 7 }}><SemanticMiniTable activeRow={Math.min(3, frame + 1)} rows={[[t(bi('Vaqt', 'Время', 'Time')), t(bi('Qiymat', 'Значение', 'Value'))], ['1', '20'], ['2', '30'], ['3', '45']]}/><b style={{ color: T.accent, fontSize: 25 }}>→</b><SemanticLineChart values={[20, 30, 45]} labels={['1', '2', '3']} visibleCount={Math.min(3, frame + 1)} connect={frame >= 2} ariaLabel={chartLabel}/></div></div>;
    if (scene === 'chart-algorithm') return <div className="conversion-visual" aria-label={chartLabel}><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><SemanticMiniTable rows={[[t(bi('Jadval', 'Таблица', 'Table')), '40']]}/><div style={{ display: 'grid', gridTemplateRows: 'repeat(4,18px)', width: 44, gap: 2, opacity: frame >= 1 ? 1 : .12, transition: 'opacity .35s ease' }}>{Array.from({ length: 4 }, (_, index) => <i key={index} style={{ borderRadius: 3, background: T.cyan }}/>)}</div></div>{frame >= 4 && <strong style={{ padding: '7px 12px', borderRadius: 11, color: '#FFF', background: T.success, font: "900 13px 'JetBrains Mono',monospace" }}>4 × 10 = 40</strong>}</div>;
    if (scene === 'chart-test-bars') return <div className="conversion-visual" aria-label={chartLabel}><SemanticBarChart values={[20, 35, 25]} labels={[t(bi('Du', 'Пн', 'Mon')), t(bi('Se', 'Вт', 'Tue')), t(bi('Ch', 'Ср', 'Wed'))]} max={40} activeIndex={revealed ? 1 : -1}/></div>;
    if (scene === 'chart-test-scale') return <div className="conversion-visual" aria-label={chartLabel}><SemanticScaleAxis step={10} steps={4} point={4} sparseLabels ariaLabel={chartLabel}/></div>;
    if (scene === 'chart-test-difference') return <div className="conversion-visual" aria-label={chartLabel}><SemanticBarChart values={[55, 35]} labels={['A', 'B']} max={60}/></div>;
    if (scene === 'chart-test-trend') return <div className="conversion-visual" aria-label={chartLabel}><SemanticLineChart values={[20, 30, 30, 45]} labels={['1', '2', '3', '4']} ariaLabel={chartLabel}/></div>;
    if (scene === 'chart-error') return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'grid', gridTemplateRows: 'repeat(4,25px)', width: 62, gap: 3 }}>{Array.from({ length: 4 }, (_, index) => <i key={index} style={{ borderRadius: 5, background: T.cyan }}/>)}</div><strong style={{ color: T.navy, font: "900 13px 'JetBrains Mono',monospace" }}>1 {t(bi('katak', 'клетка', 'square'))} = 5</strong></div>;
    if (scene === 'chart-case') return <div className="conversion-visual" aria-label={chartLabel}><SemanticWeekTable dayLabel={t(bi('Kun', 'День', 'Day'))} valueLabel={t(bi('Suv', 'Вода', 'Water'))}/><strong style={{ color: T.accent, fontSize: 28 }}>→ ?</strong></div>;
    if (scene === 'chart-final') return <div className="conversion-visual" aria-label={t(c.title)}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{['▦', '▥', '⌁'].map((icon, index) => <span key={icon} style={{ width: 58, height: 58, borderRadius: 16, display: 'grid', placeItems: 'center', opacity: index <= frame ? 1 : .2, color: '#FFF', background: index === 2 ? T.accent : T.cyan, fontSize: 25 }}>{icon}</span>)}</div></div>;
    return <div className="conversion-visual" aria-label={chartLabel}><SemanticBarChart values={[20, 35, 25]} labels={['A', 'B', 'C']} max={40}/></div>;
  }
  if (kind === 'chart-legacy') {
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
const RevealFrames = ({ frames, frame }) => { const t = useT(); const currentFrame = Math.max(0, Math.min(frame, frames.length - 1)); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} data-current={index === currentFrame ? 'true' : undefined} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
const GuidedFramePanel = ({ frames, step, onAdvance, audioReady }) => { const t = useT(); const complete = step >= frames.length - 1; return <div className="guided-panel" aria-live="polite"><div className="guided-progress" aria-label={`${step + 1} / ${frames.length}`}>{frames.map((_, index) => <i className={index <= step ? 'active' : ''} key={index}/>)}</div><div className="guided-frame"><b>{step + 1}</b><span>{t(frames[step])}</span></div><div className="guided-action">{complete ? <span className="guided-complete">✓ {t(bi('Bosqichlar tugadi', 'Шаги завершены', 'Steps complete'))}</span> : <button type="button" className="btn-white-accent step-button" disabled={!audioReady} onClick={onAdvance}>{t(bi('Keyingi qadam', 'Следующий шаг', 'Next step'))} →</button>}</div></div>; };
function HookScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const answerReady = isAudioReady(audio); const correct = picked === HOOK_CORRECT_INDEX; const choose = (index) => { if (!answerReady || correct || wrongChoices.includes(index)) return; const ok = index === HOOK_CORRECT_INDEX; const nextAttempts = attempts + 1; const nextWrongChoices = ok ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); audio.pushOneOff(t(c.wrong[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: HOOK_CORRECT_INDEX, correctAnswer: t(c.options[HOOK_CORRECT_INDEX]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}><div className="stack hook-stack" data-g4-screen="hook"><header className="hook-intro"><span data-g4-role="hook-topic">{t(c.eyebrow)}</span><h1 data-g4-role="hook-title">{t(c.title)}</h1><h2 data-g4-role="hook-question">{t(c.question)}</h2></header><section className="hook-card" data-g4-role="hook-scene"><div className="hook-visual-frame" data-g4-role="visual-frame"><div className="hook-visual-content"><div className="hook-model"><ConversionVisual c={c} frame={audio.frame}/></div><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="hook-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question hook-question hook-answers" aria-live="polite"><div className="options">{c.options.map((option, index) => { const cls = correct && index === HOOK_CORRECT_INDEX ? 'right' : wrongChoices.includes(index) ? 'bad' : ''; return <button type="button" data-g4-role="answer-card" data-g4-branch="choice" data-g4-correct={index === HOOK_CORRECT_INDEX ? 'true' : 'false'} className={'option ' + cls} disabled={!answerReady || correct || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div><div className="feedback-slot hook-feedback-slot">{picked !== null && <div className={'feedback open ' + (correct ? 'correct' : 'wrong')} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={correct ? 'solution' : 'wrong'}><div className="feedback-bit-wrap" data-g4-role="feedback-bit"><BitSVG className="feedback-bit" state={correct ? 'nod' : 'awkward'}/></div><p>{correct && <b className="proof-label">{t(SOLUTION_LABEL)}: </b>}{t(c.wrong[picked])}</p></div>}</div></section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext }) { const c = CONTENT[`s${screen}`]; const [step, setStep] = useState(0); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); audio.speakStep(nextStep); }; const cycle = ['focus', 'point', 'idea']; const bitState = screen === 7 ? 'happy' : cycle[(screen - 1) % cycle.length]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={complete}><div className="stack info-stack"><Heading c={c} state={bitState} showBit/><section className="model-card guided-card"><ConversionVisual c={c} frame={step}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []); const revealed = picked !== null; const correct = picked === c.correctIndex; const strategyChoice = SCREEN_META[screen].type === 'strategy'; const activityComplete = strategyChoice ? picked !== null : correct; const canAnswer = isAudioReady(audio); const baseBitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const bitState = revealed ? (activityComplete ? 'happy' : 'awkward') : baseBitState; const choose = (index) => { if (!canAnswer || activityComplete || wrongChoices.includes(index)) return; const ok = index === c.correctIndex; const nextAttempts = attempts + 1; const nextWrongChoices = ok || strategyChoice ? wrongChoices : [...wrongChoices, index]; setPicked(index); setAttempts(nextAttempts); setWrongChoices(nextWrongChoices); playSfx(ok || strategyChoice ? 'correct' : 'wrong'); audio.pushOneOff(t(ok || strategyChoice ? c.audio.on_correct : c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: strategyChoice || ok, firstTry: strategyChoice ? true : storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts, wrongChoices: nextWrongChoices }); }; const showProof = activityComplete || (!correct && wrongChoices.length >= 2); return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={activityComplete}><div className="stack question-stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><ConversionVisual c={c} frame={audio.frame} revealed={revealed}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = index === c.correctIndex && correct ? 'right' : wrongChoices.includes(index) ? 'bad' : strategyChoice && picked === index ? 'picked' : ''; return <button type="button" data-g4-branch={strategyChoice ? undefined : 'choice'} data-g4-correct={strategyChoice ? undefined : index === c.correctIndex ? 'true' : 'false'} className={'option ' + cls} disabled={!canAnswer || activityComplete || wrongChoices.includes(index)} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div><div className="feedback-slot question-feedback-slot">{revealed && <div className="feedback-stack"><div className={'feedback open ' + (activityComplete ? 'correct' : 'wrong')} data-g4-role={activityComplete ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={activityComplete ? 'solution' : 'wrong'}><span className="feedback-bit-wrap" data-g4-role="feedback-bit"><BitSVG state={activityComplete ? 'nod' : 'awkward'}/></span><p>{activityComplete && <b className="proof-label">{t(SOLUTION_LABEL)}: </b>}{t(activityComplete ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div>{showProof && <div className="proof"><b className="proof-label">{t(SOLUTION_LABEL)}</b><span>{t(c.proof)}</span></div>}</div>}</div></div></section></div></Stage>; }
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
function Screen14({ screen, answers, onPrev, finishLesson, finalState, onFinalState }) {
  const t = useT(); const c = CONTENT.s14; const title = { uz: "Ma'lumotlar tahlilchisi", ru: 'Аналитик данных', en: 'Data analyst' }; const storedAnswer = finalState; const [step, setStep] = useState(storedAnswer.step); const [reflection, setReflection] = useState(storedAnswer.reflection); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const [revealRequested, setRevealRequested] = useState(false); const audio = useGuidedNarration(c.audio, screen, step); const complete = step >= c.frames.length - 1; const audioReady = isAudioReady(audio); const titleState = titleClaimed ? 'claimed' : 'unclaimed';
  const advance = () => { if (complete || !audioReady) return; const nextStep = step + 1; setStep(nextStep); onFinalState((previous) => ({ ...previous, step: nextStep })); audio.speakStep(nextStep); };
  const chooseReflection = (index) => { setReflection(index); onFinalState((previous) => ({ ...previous, reflection: index })); };
  const claimTitle = () => { if (reflection === null) return; if (!complete || !audioReady || titleClaimed || revealRequested) return; setRevealRequested(true); };
  const completeReveal = useCallback(() => { setRevealRequested(false); setTitleClaimed(true); onFinalState((previous) => ({ ...previous, titleClaimed: true })); }, [onFinalState]);
  const finish = () => { if (reflection === null || !titleClaimed) return; finishLesson(); };
return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} canAdvance={complete && reflection !== null} canFinish={titleState === 'claimed'} finish><div className="stack summary-stack"><Heading c={c} state={titleState === 'claimed' ? 'happy' : 'idea'} showBit/>{!complete ? <section className="model-card summary-card guided-card"><ConversionVisual c={c} frame={step}/><GuidedFramePanel frames={c.frames} step={step} onAdvance={advance} audioReady={audioReady}/></section> : <div className="summary-complete"><section className="reflection-card final-reflection" data-g4-role="reflection" aria-live="polite"><h2>{t(REFLECTION.question)}</h2><div className="reflection-options">{REFLECTION.options.map((option, index) => <button type="button" className={'option ' + (reflection === index ? 'picked' : '')} disabled={!audioReady || revealRequested} onClick={() => chooseReflection(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div></section><G4TitleReveal active={revealRequested} title={title} onComplete={completeReveal}/>{titleState !== 'claimed' ? <section className="title-claim-card"><span>★</span><h2>{t(title)}</h2><button type="button" data-g4-role="title-claim" className="btn-white-accent g4-title-claim" disabled={reflection === null || revealRequested || !audioReady} onClick={claimTitle}>{t(bi('Unvonni olish', 'Получить звание', 'Claim title'))}</button></section> : null}{titleState === 'claimed' && <G4TitleCard title={title} answers={answers}/>}</div>}</div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars50({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const showPreviewControls = langProp === undefined || langProp === null; const preview = previewMode ?? showPreviewControls; const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = showPreviewControls ? normalizeLang(previewLang) : normalizeLang(langProp); configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [finalState, setFinalState] = useState({ step: 0, reflection: null, titleClaimed: false }); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars50 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{showPreviewControls && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} finalState={finalState} onFinalState={setFinalState} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
  font-family:'Source Serif 4',Georgia,serif;font-size:58px;line-height:1.02;text-shadow:0 4px 24px rgba(0,0,0,.72);
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
.feedback-bit{width:25px;height:31px}.proof-label{margin-right:7px;color:${T.lime}}.title-claim-card{grid-column:1/-1;height:100%;display:grid;place-items:center;align-content:center;gap:12px;border-radius:20px;background:#fff;text-align:center;overflow:hidden}.title-claim-card>span{font-size:48px;color:#FFCE49}
.stage-hook .hook-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{min-height:0;padding-top:9px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:38px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:32px;height:32px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{min-height:0;padding-top:7px;padding-bottom:4px;display:grid;grid-template-rows:minmax(0,1fr) 40px;overflow:hidden}.stage-body{min-height:0;overflow:hidden}.caption-slot{height:40px;min-height:40px;padding-top:4px;overflow:hidden}.caption{height:36px;margin:0;padding:7px 11px;border-radius:12px;overflow:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:11px;line-height:1.2;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}.stage-nav{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled,.btn-ghost:disabled,.option:disabled{cursor:not-allowed;opacity:.48;transform:none}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.hook-stack{grid-template-rows:auto minmax(0,.82fr) minmax(0,1.18fr)}.heading{height:68px;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:16px;overflow:hidden}.heading.heading-solo{justify-content:flex-start}.heading>div{min-width:0}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(24px,4vw,36px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:62px;height:76px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{min-height:0;padding:14px;border-radius:20px;overflow:hidden;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{height:100%;display:grid;grid-template-columns:minmax(250px,.9fr) minmax(300px,1.1fr);align-items:stretch;gap:14px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{min-height:0;display:grid;align-content:center;gap:7px;overflow:hidden}.reveal-card{min-height:44px;padding:7px 10px;border-radius:13px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(7px);overflow:hidden;background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{height:100%;display:grid;grid-template-rows:auto auto minmax(92px,1fr);align-content:start;gap:9px}.question h2{font:720 clamp(16px,2.5vw,21px)/1.22 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.option{min-height:50px;padding:8px;border:0;border-radius:14px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:7px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover:not(:disabled){transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback-slot{min-height:0;overflow:hidden}.feedback-stack{height:100%;display:grid;align-content:start;gap:6px;overflow:hidden}.feedback{padding:8px 10px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:start;gap:7px;font-size:12px;line-height:1.22}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:7px 10px;border-radius:11px;color:#FFF;background:${T.navy};overflow:hidden;text-align:center;font:900 12px/1.2 'JetBrains Mono',monospace}.test-layout{height:100%;min-height:0;display:grid;grid-template-columns:.86fr 1.14fr;gap:10px;overflow:hidden}.test-model{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;gap:8px}.question-feedback-slot{min-height:92px}.hook-feedback-slot{min-height:58px}.guided-panel{min-height:0;display:grid;grid-template-rows:10px minmax(72px,1fr) 50px;gap:10px;overflow:hidden}.guided-progress{display:flex;align-items:center;gap:6px}.guided-progress i{height:6px;flex:1;border-radius:999px;background:#DDE5E3}.guided-progress i.active{background:${T.cyan}}.guided-frame{min-height:72px;padding:12px;border-radius:16px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;overflow:hidden;background:#F8F8F4;font-weight:850}.guided-frame>b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.guided-action{display:flex;align-items:center;justify-content:flex-end;min-height:50px}.step-button{min-width:150px}.guided-complete{padding:10px 12px;border-radius:12px;color:${T.success};background:${T.successSoft};font-size:12px;font-weight:900}.summary-complete{height:100%;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;gap:10px;overflow:hidden}.summary-complete .g4-title-card-stage{height:100%;min-height:0}.reflection-card{min-height:0;padding:14px;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:9px;overflow:hidden;background:#FFF;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.reflection-card h2{font:720 18px/1.22 'Source Serif 4',Georgia,serif}.reflection-options{min-height:0;display:grid;grid-template-rows:repeat(3,minmax(44px,1fr));gap:7px;overflow:hidden}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.lesson-frame .preview-language{display:none!important}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 38px;padding-top:5px;padding-bottom:2px}.caption-slot{height:38px;min-height:38px;padding-top:3px}.caption{height:35px;padding:6px 9px;font-size:10px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr) 34px}.caption-slot{height:34px;min-height:34px}.caption{height:31px;padding:5px 8px}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
.summary-complete>.title-claim-card{grid-column:auto}
@media(max-width:639.98px){.summary-complete{grid-template-rows:minmax(0,1fr) 88px}.title-claim-card{height:88px;padding:6px 7px;grid-template-columns:30px minmax(0,1fr) auto;place-items:center;align-content:center;gap:6px;text-align:left}.title-claim-card>span{font-size:28px}.title-claim-card h2{font-size:13px;line-height:1.1}.title-claim-card .g4-title-claim{min-width:96px;min-height:44px;padding:0 7px}}
@media(max-height:700px){.summary-complete{grid-template-rows:minmax(0,1fr) 82px}}
@media(max-width:639.98px) and (max-height:700px){.title-claim-card{height:82px}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
.lesson-root{font-family:'Manrope',system-ui,sans-serif}.lesson-root h1,.lesson-root [data-g4-role="hook-title"]{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;line-height:1.06;text-align:left}.lesson-root .question h2,.lesson-root [data-g4-role="hook-question"]{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;line-height:1.25;text-align:left}.lesson-root .lead{font-family:'Manrope',system-ui,sans-serif;font-size:clamp(14px,1.8vw,16px);line-height:1.55}.lesson-root .body-copy{font-family:'Manrope',system-ui,sans-serif;font-size:clamp(15px,2vw,18px);line-height:1.5}.lesson-root .screen-count,.lesson-root [class*="formula"],.lesson-root [class*="equation"],.lesson-root .proof-label{font-family:'JetBrains Mono',monospace!important}
.stage-hook .hook-stack{height:100%;grid-template-rows:auto minmax(206px,1fr) auto;gap:10px}.stage-hook .hook-intro{width:min(760px,100%);margin:0 auto;display:grid;gap:5px;text-align:left}.stage-hook [data-g4-role="hook-topic"]{color:${T.cyan};font:900 11px/1.2 'Manrope',system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}.stage-hook [data-g4-role="hook-scene"]{width:min(760px,100%);min-height:206px;margin:0 auto;padding:0;border:0;border-radius:24px;overflow:hidden;background:transparent;box-shadow:none}.stage-hook [data-g4-role="visual-frame"]{position:relative;isolation:isolate;width:100%;height:100%;min-height:206px;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}.stage-hook .hook-visual-content{position:relative;z-index:1;width:100%;height:100%;min-width:0;min-height:206px;padding:12px 154px 12px 12px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:center;gap:12px;overflow:hidden}.stage-hook .hook-visual-content>*{min-width:0;max-width:100%;max-height:182px;overflow:hidden}.stage-hook .hook-visual-content svg,.stage-hook .hook-visual-content img{display:block;max-width:100%;max-height:100%;object-fit:contain}.stage-hook [data-g4-role="hook-bit"]{position:absolute;z-index:2;width:88px;height:110px;right:42px;bottom:-4px;overflow:hidden}.stage-hook [data-g4-role="hook-bit"] .g1-char{width:100%;height:100%}.stage-hook .hook-answers{height:auto;min-height:0;padding:10px 14px;grid-template-rows:auto minmax(0,1fr);gap:8px;overflow:hidden}
.lesson-root .topic-visual,.lesson-root .conversion-visual,.lesson-root .model-card,.lesson-root .test-model{max-width:100%;overflow:hidden}.lesson-root .topic-visual>svg,.lesson-root .conversion-visual>svg{display:block;max-width:100%;max-height:100%;object-fit:contain}.lesson-root [data-g4-role~="feedback-frame"],.lesson-root .question-feedback-slot .feedback{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;gap:13px;overflow:hidden;font-family:'Manrope',system-ui,sans-serif;font-size:14px;line-height:1.42}.lesson-root [data-g4-feedback="wrong"],.lesson-root [data-g4-feedback="retry"],.lesson-root .feedback.wrong{color:#A96F13;background:linear-gradient(135deg,#FFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}.lesson-root [data-g4-feedback="correct"],.lesson-root [data-g4-feedback="solution"],.lesson-root .feedback.correct{color:#227A53;background:linear-gradient(135deg,#FFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}.lesson-root [data-g4-feedback="solution"]{min-height:72px;border-radius:15px;grid-template-columns:51px minmax(0,1fr)}.lesson-root [data-g4-role="feedback-bit"],.lesson-root .feedback>.feedback-bit{width:62px;height:76px;min-width:0;max-width:100%;overflow:hidden}.lesson-root [data-g4-role="feedback-bit"] .feedback-bit{width:100%;height:100%}.lesson-root [data-g4-feedback="solution"]>[data-g4-role="feedback-bit"],.lesson-root [data-g4-feedback="solution"]>.feedback-bit{width:51px;height:64px}.lesson-root [data-g4-role="feedback-bit"] svg{display:block;max-width:100%;max-height:100%}.lesson-root [data-g4-role="feedback-bit"]>svg{display:block;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important}
@media(max-width:639.98px){.lesson-root h1,.lesson-root [data-g4-role="hook-title"]{font-size:25px!important}.stage-hook .hook-stack{grid-template-rows:auto minmax(164px,1fr) auto}.stage-hook [data-g4-role="hook-scene"],.stage-hook [data-g4-role="visual-frame"]{min-height:164px;border-radius:18px}.stage-hook .hook-visual-content{min-height:164px;padding:9px 88px 9px 9px;grid-template-columns:minmax(0,.65fr) minmax(82px,.35fr);grid-template-rows:minmax(0,1fr);align-items:stretch;gap:6px}.stage-hook .hook-visual-content>*{height:146px;max-height:146px;overflow:hidden}.stage-hook .hook-model{position:relative;min-width:0;min-height:0}.stage-hook .hook-model>.topic-visual,.stage-hook .hook-model>.conversion-visual{position:absolute;inset:0 auto auto 0;min-height:0;max-width:none;padding:4px;transform-origin:top left}.stage-hook .hook-model>.topic-visual{width:142.858%;height:142.858%;transform:scale(.7)}.stage-hook .hook-model>.conversion-visual{width:166.667%;height:166.667%;transform:scale(.6)}.stage-hook .hook-model>.topic-visual svg,.stage-hook .hook-model>.conversion-visual svg{max-height:100%}.stage-hook .reveal-grid{height:146px;min-height:0;max-height:none;align-content:center;gap:0;overflow:hidden}.stage-hook .reveal-card{display:none;min-height:0;padding:5px 6px;border-radius:10px;grid-template-columns:1fr;align-content:center;gap:4px;font-size:9px;line-height:1.18;overflow:hidden}.stage-hook .reveal-card[data-current="true"]{display:grid}.stage-hook .reveal-card>b{width:21px;height:21px;border-radius:7px;font-size:8px}.stage-hook .reveal-card>span{overflow-wrap:anywhere}.stage-hook [data-g4-role="hook-bit"]{width:68px;height:85px;right:12px;bottom:-7px}.lesson-root [data-g4-role~="feedback-frame"],.lesson-root .question-feedback-slot .feedback{grid-template-columns:54px minmax(0,1fr)}.lesson-root [data-g4-role="feedback-bit"],.lesson-root .feedback>.feedback-bit{width:54px;height:68px}.lesson-root [data-g4-feedback="solution"]{min-height:68px;border-radius:15px;grid-template-columns:47px minmax(0,1fr)}.lesson-root [data-g4-feedback="solution"]>[data-g4-role="feedback-bit"],.lesson-root [data-g4-feedback="solution"]>.feedback-bit{width:47px;height:59px}.stage-hook .hook-stack:has([data-g4-feedback]){height:auto!important;min-height:0;grid-template-rows:auto!important;align-content:start!important;gap:0;overflow:visible;transform:none!important;animation:none!important}.stage-hook .hook-stack:has([data-g4-feedback]) .hook-intro,.stage-hook .hook-stack:has([data-g4-feedback]) [data-g4-role="hook-scene"]{display:none}.stage-hook .hook-stack:has([data-g4-feedback]) .hook-answers{position:static;display:grid;height:auto;min-height:0;padding:8px;grid-template-rows:auto auto;align-content:start;gap:8px;overflow:visible;transform:none}.stage-hook .hook-stack:has([data-g4-feedback]) .hook-feedback-slot{min-height:88px;overflow:visible}.stage-hook .hook-stack:has([data-g4-feedback]) [data-g4-role~="feedback-frame"]{width:100%;min-height:88px}.stage-question .question-stack:has([data-g4-feedback]){height:auto!important;min-height:0;grid-template-rows:auto!important;align-content:start!important;overflow:visible;transform:none!important;animation:none!important}.stage-question:has([data-g4-feedback]) .stage-body{overflow:visible}.stage-question .question-stack:has([data-g4-feedback]) .heading,.stage-question .question-stack:has([data-g4-feedback]) .test-model{display:none}.stage-question .question-stack:has([data-g4-feedback]) .test-layout{display:block;height:auto;min-height:0;overflow:visible}.stage-question .question-stack:has([data-g4-feedback]) .question{display:grid;height:auto;min-height:0;padding:4px;grid-template-rows:auto auto auto;align-content:start;gap:4px;overflow:visible;transform:none}.stage-question .question-stack:has([data-g4-feedback]) .question-feedback-slot{min-height:88px;overflow:visible}.stage-question .heading{display:none}.stage-question .question-stack{grid-template-rows:minmax(0,1fr)}.stage-question .test-layout{height:100%;grid-template-columns:1fr;grid-template-rows:92px minmax(0,1fr);gap:4px}.stage-question .test-model{padding:3px;min-height:0}.stage-question .test-model>.canonical-visual-frame{height:100%;min-height:0}.stage-question .question{min-height:0;padding:4px;grid-template-rows:auto 42px auto;align-content:start;gap:3px}.stage-question .question h2{font-size:12px!important;line-height:1.12}.stage-question .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage-question .option{min-height:42px;padding:4px;grid-template-columns:1fr;justify-items:center;text-align:center;font-size:9px;line-height:1.1}.stage-question .option>b{display:none}.stage-question .feedback-slot{min-height:68px;overflow:visible}.stage-question .feedback-stack{height:auto;overflow:visible}.stage-question .question-feedback-slot [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 9px}.stage-question .proof{display:none}}
/* Etalon layout adapters: answer feedback replaces the model after selection,
   while the unanswered hook keeps the canonical title/scene/card order. */
.lesson-root .caption{margin-top:0;max-height:100%;overflow:hidden}
.stage-hook .reveal-grid{overflow:visible}
.stage-hook .reveal-card{min-height:0;padding:5px 7px;grid-template-columns:26px minmax(0,1fr);gap:7px;font-size:10px;line-height:1.15}
.stage-hook .reveal-card>b{width:25px;height:25px}
.stage-hook .reveal-card>span{overflow-wrap:anywhere}
.question-stack:has([data-g4-feedback]){height:auto!important;min-height:0;grid-template-rows:auto!important;align-content:start!important;overflow:visible;transform:none!important;animation:none!important}
.stage:has(.question-stack [data-g4-feedback]) .stage-content{min-height:0}
.stage:has(.question-stack [data-g4-feedback]) .stage-body{height:auto;min-height:0;overflow:visible}
.question-stack:has([data-g4-feedback]) .heading,.question-stack:has([data-g4-feedback]) .test-model{display:none}
.question-stack:has([data-g4-feedback]) .test-layout{display:block;height:auto;min-height:0;overflow:visible}
.question-stack:has([data-g4-feedback]) .question{display:grid;height:auto;min-height:0;grid-template-rows:auto auto auto;align-content:start;overflow:visible;transform:none}
.question-stack:has([data-g4-feedback]) .question-feedback-slot,.question-stack:has([data-g4-feedback]) .feedback-stack{height:auto;min-height:88px;overflow:visible;transform:none!important}
.lesson-root .question-feedback-slot .feedback[data-g4-feedback="solution"]{min-height:72px;border-radius:15px}
@media(max-width:639.98px){
  .lesson-root .stage-content{grid-template-rows:minmax(0,1fr) 40px;padding-top:3px;padding-bottom:0}
  .stage-hook .hook-stack:not(:has([data-g4-feedback])){height:auto;grid-template-rows:auto 164px auto;align-content:start;gap:5px;overflow:visible}
  .stage-hook .hook-stack:not(:has([data-g4-feedback])) [data-g4-role="hook-scene"],.stage-hook .hook-stack:not(:has([data-g4-feedback])) [data-g4-role="visual-frame"]{height:164px}
  .stage-hook .hook-answers{height:auto;padding:5px 7px;grid-template-rows:auto auto;gap:4px;overflow:visible}
  .stage-hook .hook-answers .options{gap:4px}
  .stage-hook .hook-answers .option{min-height:42px;padding:5px 6px;font-size:11px;line-height:1.15}
  .stage-hook .hook-answers .option span{overflow-wrap:anywhere}
  .stage-hook .hook-feedback-slot:empty{display:none;min-height:0}
  .stage-hook .hook-visual-content{grid-template-columns:minmax(100px,1.05fr) minmax(105px,.95fr)}
  .canonical-visual-frame>.conversion-visual{position:absolute;inset:0 auto auto 0;width:200%;height:200%;max-width:none;min-height:0;padding:6px;transform:scale(.5);transform-origin:top left}
  .canonical-visual-frame[data-g4-scene="chart-choice"]>.conversion-visual{width:250%;height:250%;transform:scale(.4)}
  .lesson-root .caption-slot{height:40px;min-height:40px}
  .lesson-root .caption{height:auto;min-height:31px;max-height:40px;margin:0;font-size:9px;line-height:1.15;overflow:visible}
  .stage:has(.question-stack) .heading{display:none}
  .stage:has(.question-stack) .question-stack{height:100%;grid-template-rows:minmax(0,1fr)}
  .stage:has(.question-stack) .test-layout{height:100%;grid-template-columns:1fr;grid-template-rows:92px minmax(0,1fr);gap:4px}
  .stage:has(.question-stack) .test-model{padding:3px;min-height:0}
  .stage:has(.question-stack) .test-model>.canonical-visual-frame{height:100%;min-height:0}
  .stage:has(.question-stack) .question{min-height:0;padding:4px;grid-template-rows:auto 42px auto;align-content:start;gap:3px}
  .stage:has(.question-stack) .question h2{font-family:'Manrope',system-ui,sans-serif!important;font-size:12px!important;line-height:1.12}
  .stage:has(.question-stack) .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
  .stage:has(.question-stack) .option{min-height:42px;padding:4px;grid-template-columns:1fr;justify-items:center;text-align:center;font-size:9px;line-height:1.1}
  .stage:has(.question-stack) .option>b{display:none}
  .question-stack:has([data-g4-feedback]) .test-layout{display:block;height:auto;min-height:0;overflow:visible}
  .question-stack:has([data-g4-feedback]) .question{height:auto;padding:4px;grid-template-rows:auto auto auto;gap:4px;overflow:visible}
  .question-stack:has([data-g4-feedback]) .question-feedback-slot,.question-stack:has([data-g4-feedback]) .feedback-stack{height:auto;min-height:88px;overflow:visible}
  .question-stack:has([data-g4-feedback]) .question-feedback-slot [data-g4-feedback="wrong"]{min-height:88px;padding:8px 9px;border-radius:18px}
  .question-stack:has([data-g4-feedback]) .question-feedback-slot [data-g4-feedback="solution"]{min-height:68px;padding:8px 9px;border-radius:15px}
  .stage-summary .final-reflection h2{font-family:'Manrope',system-ui,sans-serif!important}
}
`;
