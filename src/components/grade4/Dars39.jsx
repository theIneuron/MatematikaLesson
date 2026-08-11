import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 39 · Birinchi chorakdagi koordinatalar
// 15 ekran · audio bilan sinxron kadrlar · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: "coordinates-4-39-v1", slug: "dars39-nuqta-koordinatalari", lessonTitle: {"uz":"Nuqta koordinatalari va koordinata burchagi","ru":"Координаты точки и координатный угол","en":"Point coordinates and the coordinate plane"}, skillTags: ["coordinates","first-quadrant","axes","points"] };
const LESSON_REWARD_TITLE = {
  "uz": "Koordinata navigatori",
  "ru": "Координатный навигатор",
  "en": "Coordinate navigator"
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
      "uz": "Xarita signali",
      "ru": "Сигнал карты",
      "en": "Map signal"
    },
    "title": {
      "uz": "(4; 3) yoki (3; 4)?",
      "ru": "(4; 3) или (3; 4)?",
      "en": "(4, 3) or (3, 4)?"
    },
    "scene": "hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "A(4; 3) va B(3; 4) ikki boshqa nuqtani ko'rsatadi.",
        "ru": "A(4; 3) и B(3; 4) обозначают две разные точки.",
        "en": "A(4, 3) and B(3, 4) identify two different points."
      },
      {
        "uz": "Ikkala yozuvda bir xil sonlar bor, ammo ularning tartibi boshqacha.",
        "ru": "В обеих записях одни и те же числа, но их порядок различается.",
        "en": "Both coordinate pairs use the same numbers, but in a different order."
      },
      {
        "uz": "Nega sonlar tartibi muhim?",
        "ru": "Почему порядок чисел важен?",
        "en": "Why does the order matter?"
      }
    ],
    "question": {
      "uz": "A nuqtaga qanday boramiz?",
      "ru": "Как попасть в точку A?",
      "en": "How do we reach point A?"
    },
    "options": [
      {
        "uz": "4 birlik o'ngga, 3 birlik yuqoriga",
        "ru": "На 4 единицы вправо, на 3 вверх",
        "en": "4 units right, then 3 units up"
      },
      {
        "uz": "3 birlik o'ngga, 4 birlik yuqoriga",
        "ru": "На 3 единицы вправо, на 4 вверх",
        "en": "3 units right, then 4 units up"
      },
      {
        "uz": "4 birlik diagonal bo'ylab",
        "ru": "На 4 единицы по диагонали",
        "en": "4 units diagonally"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Koordinata yo'lini bosqichma-bosqich tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим координатный маршрут по шагам.",
      "en": "Estimate saved. We will check the coordinate route step by step."
    },
    "audio": {
      "intro": {
        "uz": [
          "A nuqta to'rt; uchda, B nuqta esa uch; to'rtda joylashgan.",
          "Ikkala yozuvda bir xil sonlar bor, ammo ularning tartibi boshqacha.",
          "Nega sonlar tartibi muhim?"
        ],
        "ru": [
          "Точка A имеет координаты четыре; три, а точка B имеет координаты три; четыре.",
          "В обеих записях одни и те же числа, но их порядок различается.",
          "Почему порядок чисел важен?"
        ],
        "en": [
          "Point A has coordinates four, three, while point B has three, four.",
          "Both coordinate pairs use the same numbers, but in a different order.",
          "Why does the order matter?"
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
      "uz": "Koordinata burchagi",
      "ru": "Координатный угол",
      "en": "Coordinate plane"
    },
    "scene": "axes",
    "frames": [
      {
        "uz": "O — koordinata boshi.",
        "ru": "O — начало координат.",
        "en": "O is the origin."
      },
      {
        "uz": "x o'qi gorizontal yo'naladi.",
        "ru": "Ось x направлена горизонтально.",
        "en": "The x-axis runs horizontally."
      },
      {
        "uz": "y o'qi vertikal yo'naladi.",
        "ru": "Ось y направлена вертикально.",
        "en": "The y-axis runs vertically."
      },
      {
        "uz": "O'qlar navbat bilan yoritilib, yo'nalishni ko'rsatadi.",
        "ru": "Оси по очереди подсвечиваются и показывают направления.",
        "en": "The axes light up in turn to show their directions."
      }
    ],
    "audio": {
      "uz": [
        "O, koordinata boshi.",
        "Iks o'qi gorizontal yo'naladi.",
        "Igrek o'qi vertikal yo'naladi.",
        "O'qlar navbat bilan yoritilib, yo'nalishni ko'rsatadi."
      ],
      "ru": [
        "O, начало координат.",
        "Ось икс направлена горизонтально.",
        "Ось игрек направлена вертикально.",
        "Оси по очереди подсвечиваются и показывают направления."
      ],
      "en": [
        "O is the origin.",
        "The x-axis runs horizontally.",
        "The y-axis runs vertically.",
        "The axes light up in turn to show their directions."
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
      "uz": "Sanash qayerdan boshlanadi?",
      "ru": "Откуда начинаем считать?",
      "en": "Where do we start counting?"
    },
    "scene": "origin",
    "frames": [
      {
        "uz": "Sanash O nuqtadan boshlanadi.",
        "ru": "Отсчёт начинается от точки O.",
        "en": "Counting begins at point O."
      },
      {
        "uz": "O = (0; 0).",
        "ru": "O = (0; 0).",
        "en": "O = (0, 0)."
      },
      {
        "uz": "Birinchi katak O dan keyin sanaladi.",
        "ru": "Первую клетку считают после O.",
        "en": "Count the first square after O."
      },
      {
        "uz": "Sanash noldan boshlanadi, birdan emas.",
        "ru": "Отсчёт начинается с нуля, а не с единицы.",
        "en": "Counting starts at zero, not one."
      }
    ],
    "audio": {
      "uz": [
        "Sanash O nuqtadan boshlanadi.",
        "O nuqtaning koordinatalari nol va nol.",
        "Birinchi katak O dan keyin sanaladi.",
        "Sanash noldan boshlanadi, birdan emas."
      ],
      "ru": [
        "Отсчёт начинается от точки O.",
        "Координаты точки O, ноль и ноль.",
        "Первую клетку считают после O.",
        "Отсчёт начинается с нуля, а не с единицы."
      ],
      "en": [
        "Counting begins at point O.",
        "Point O has coordinates zero and zero.",
        "Count the first square after O.",
        "Counting starts at zero, not one."
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
      "uz": "Avval x, keyin y",
      "ru": "Сначала x, затем y",
      "en": "First x, then y"
    },
    "scene": "route",
    "frames": [
      {
        "uz": "A(4; 3) nuqtani joylashtiramiz.",
        "ru": "Разместим точку A(4; 3).",
        "en": "We will plot point A(4, 3)."
      },
      {
        "uz": "O dan 4 birlik o'ngga yuring.",
        "ru": "От O пройдите 4 единицы вправо.",
        "en": "Move 4 units right from O."
      },
      {
        "uz": "So'ng 3 birlik yuqoriga yuring.",
        "ru": "Затем пройдите 3 единицы вверх.",
        "en": "Then move 3 units up."
      },
      {
        "uz": "Shu joyga A nuqtani qo'ying.",
        "ru": "Поставьте в этом месте точку A.",
        "en": "Place point A there."
      }
    ],
    "audio": {
      "uz": [
        "Koordinatalari to'rt va uch bo'lgan A nuqtani joylashtiramiz.",
        "O dan to'rt birlik o'ngga yuring.",
        "So'ng uch birlik yuqoriga yuring.",
        "Shu joyga A nuqtani qo'ying."
      ],
      "ru": [
        "Разместим точку A с координатами четыре и три.",
        "От O пройдите четыре единицы вправо.",
        "Затем пройдите три единицы вверх.",
        "Поставьте в этом месте точку A."
      ],
      "en": [
        "We will plot point A with coordinates four and three.",
        "Move four units right from O.",
        "Then move three units up.",
        "Place point A there."
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
      "uz": "Koordinatani o'qish",
      "ru": "Чтение координаты",
      "en": "Reading coordinates"
    },
    "scene": "read",
    "frames": [
      {
        "uz": "Nuqtadan x o'qiga yo'naltiruvchi chiziq tushiring.",
        "ru": "Опустите из точки направляющую к оси x.",
        "en": "Drop a guide from the point to the x-axis."
      },
      {
        "uz": "O'qdagi qiymat x = 2.",
        "ru": "Значение на оси равно x = 2.",
        "en": "The value on the axis is x = 2."
      },
      {
        "uz": "Nuqtadan y o'qiga yo'naltiruvchi chiziq o'tkazing.",
        "ru": "Проведите из точки направляющую к оси y.",
        "en": "Draw a guide from the point to the y-axis."
      },
      {
        "uz": "Nuqtaning manzili B(2; 5).",
        "ru": "Координаты точки: B(2; 5).",
        "en": "The point is B(2, 5)."
      }
    ],
    "audio": {
      "uz": [
        "Nuqtadan iks o'qiga yo'naltiruvchi chiziq tushiring.",
        "O'qdagi qiymat iks teng ikki.",
        "Nuqtadan igrek o'qiga yo'naltiruvchi chiziq o'tkazing.",
        "B nuqtaning koordinatalari ikki va besh."
      ],
      "ru": [
        "Опустите из точки направляющую к оси икс.",
        "Значение на оси равно икс равно два.",
        "Проведите из точки направляющую к оси игрек.",
        "Координаты точки B, два и пять."
      ],
      "en": [
        "Drop a guide from the point to the x-axis.",
        "The value on the axis is x equals two.",
        "Draw a guide from the point to the y-axis.",
        "Point B has coordinates two and five."
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
      "uz": "Bir xil x va bir xil y",
      "ru": "Одинаковые x и y",
      "en": "Equal x and equal y"
    },
    "scene": "alignment",
    "frames": [
      {
        "uz": "x koordinatalari bir xil nuqtalar vertikal chiziqda yotadi.",
        "ru": "Точки с одинаковой координатой x лежат на вертикальной прямой.",
        "en": "Points with the same x-coordinate lie on a vertical line."
      },
      {
        "uz": "Nuqtalarni vertikal yo'nalishda tekislang.",
        "ru": "Выровняйте точки по вертикали.",
        "en": "Align the points vertically."
      },
      {
        "uz": "y koordinatalari bir xil nuqtalar gorizontal chiziqda yotadi.",
        "ru": "Точки с одинаковой координатой y лежат на горизонтальной прямой.",
        "en": "Points with the same y-coordinate lie on a horizontal line."
      },
      {
        "uz": "Nuqtalarni gorizontal yo'nalishda tekislang.",
        "ru": "Выровняйте точки по горизонтали.",
        "en": "Align the points horizontally."
      }
    ],
    "audio": {
      "uz": [
        "Iks koordinatalari bir xil nuqtalar vertikal chiziqda yotadi.",
        "Nuqtalarni vertikal yo'nalishda tekislang.",
        "Igrek koordinatalari bir xil nuqtalar gorizontal chiziqda yotadi.",
        "Nuqtalarni gorizontal yo'nalishda tekislang."
      ],
      "ru": [
        "Точки с одинаковой координатой икс лежат на вертикальной прямой.",
        "Выровняйте точки по вертикали.",
        "Точки с одинаковой координатой игрек лежат на горизонтальной прямой.",
        "Выровняйте точки по горизонтали."
      ],
      "en": [
        "Points with the same x-coordinate lie on a vertical line.",
        "Align the points vertically.",
        "Points with the same y-coordinate lie on a horizontal line.",
        "Align the points horizontally."
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
      "uz": "Masshtab",
      "ru": "Масштаб",
      "en": "Scale"
    },
    "scene": "scale",
    "frames": [
      {
        "uz": "1 katak = 2 birlik.",
        "ru": "1 клетка = 2 единицы.",
        "en": "1 square = 2 units."
      },
      {
        "uz": "Bir katak yo'l 2 birlikni bildiradi.",
        "ru": "Путь в одну клетку означает 2 единицы.",
        "en": "A one-square move means 2 units."
      },
      {
        "uz": "Ikki katak yo'l 4 birlikni bildiradi.",
        "ru": "Путь в две клетки означает 4 единицы.",
        "en": "A two-square move means 4 units."
      },
      {
        "uz": "Koordinataga katak sonini emas, qiymatni yozing.",
        "ru": "Записывайте значение, а не число клеток.",
        "en": "Record the value, not the number of squares."
      }
    ],
    "audio": {
      "uz": [
        "Bir katak teng ikki birlik.",
        "Bir katak marshrut ikki birlikni bildiradi.",
        "Ikki katak marshrut to'rt birlikni bildiradi.",
        "Koordinataga katak sonini emas, qiymatni yozing."
      ],
      "ru": [
        "Одна клетка равна двум единицам.",
        "Путь в одну клетку означает две единицы.",
        "Путь в две клетки означает четыре единицы.",
        "Записывайте значение, а не число клеток."
      ],
      "en": [
        "One square equals two units.",
        "A one-square move means two units.",
        "A two-square move means four units.",
        "Record the value, not the number of squares."
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
      "uz": "Koordinata algoritmi",
      "ru": "Алгоритм координат",
      "en": "Coordinate algorithm"
    },
    "scene": "algorithm",
    "frames": [
      {
        "uz": "O nuqtadan boshlang.",
        "ru": "Начните от точки O.",
        "en": "Start at point O."
      },
      {
        "uz": "Masshtabni tekshiring.",
        "ru": "Проверьте масштаб.",
        "en": "Check the scale."
      },
      {
        "uz": "Avval x bo'yicha yuring.",
        "ru": "Сначала двигайтесь по x.",
        "en": "Move along x first."
      },
      {
        "uz": "Keyin y bo'yicha yuring.",
        "ru": "Затем двигайтесь по y.",
        "en": "Then move along y."
      },
      {
        "uz": "(4; 3): avval 4 o'ngga, keyin 3 yuqoriga.",
        "ru": "(4; 3): сначала 4 вправо, затем 3 вверх.",
        "en": "(4, 3): first 4 right, then 3 up."
      }
    ],
    "audio": {
      "uz": [
        "O nuqtadan boshlang.",
        "Masshtabni tekshiring.",
        "Avval iks bo'yicha yuring.",
        "Keyin igrek bo'yicha yuring.",
        "Demak to'rt va uch koordinatalari avval to'rt birlik o'ngga, keyin uch birlik yuqoriga yurishni bildiradi; tartib almashtirilmaydi."
      ],
      "ru": [
        "Начните от точки O.",
        "Проверьте масштаб.",
        "Сначала двигайтесь по икс.",
        "Затем двигайтесь по игрек.",
        "Итак, координаты четыре и три означают сначала четыре единицы вправо, затем три единицы вверх; порядок не меняют."
      ],
      "en": [
        "Start at point O.",
        "Check the scale.",
        "Move along x first.",
        "Then move along y.",
        "Therefore, coordinates four and three mean four units right first, then three units up; the order is not swapped."
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
      "uz": "A(2; 5)",
      "ru": "A(2; 5)",
      "en": "A(2, 5)"
    },
    "scene": "point-choice",
    "closedSet": true,
    "frames": [
      {
        "uz": "A(2; 5) koordinata yozuvi berilgan.",
        "ru": "Дана запись координат A(2; 5).",
        "en": "The coordinate notation A(2, 5) is given."
      },
      {
        "uz": "Koordinatalar tartibiga qarang: avval x, keyin y.",
        "ru": "Учитывайте порядок координат: сначала x, затем y.",
        "en": "Use the coordinate order: x first, then y."
      }
    ],
    "question": {
      "uz": "Qaysi nuqta A(2; 5)?",
      "ru": "Какая точка имеет координаты A(2; 5)?",
      "en": "Which point is A(2, 5)?"
    },
    "options": [
      {
        "uz": "2 o'ngga, 5 yuqoriga",
        "ru": "2 вправо, 5 вверх",
        "en": "2 right, 5 up"
      },
      {
        "uz": "5 o'ngga, 2 yuqoriga",
        "ru": "5 вправо, 2 вверх",
        "en": "5 right, 2 up"
      },
      {
        "uz": "2 yuqoriga, 5 o'ngga",
        "ru": "2 вверх, 5 вправо",
        "en": "2 up, 5 right"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "A(2; 5) uchun O dan 2 birlik o'ngga va 5 birlik yuqoriga yuriladi.",
      "ru": "Для A(2; 5) от O идут на 2 единицы вправо и на 5 единиц вверх.",
      "en": "To reach A(2, 5), move 2 units right and 5 units up from O."
    },
    "audio": {
      "intro": {
        "uz": [
          "A nuqtaning koordinatalari ikki va besh.",
          "Avval iks, keyin igrek tartibini qo'llang."
        ],
        "ru": [
          "Координаты точки A: два и пять.",
          "Используйте порядок: сначала икс, затем игрек."
        ],
        "en": [
          "Point A has coordinates two and five.",
          "Use the order x first, then y."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. A, ikki, besh, uchun O dan ikki birlik o'ngga va besh birlik yuqoriga yuriladi.",
        "ru": "Верно. Для точки A сначала проходят две единицы вправо, затем пять единиц вверх.",
        "en": "Correct. To reach A, two, five, move two units right and five units up from O."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. A, ikki, besh, uchun O dan ikki birlik o'ngga va besh birlik yuqoriga yuriladi.",
          "ru": "Верно. Для точки A сначала проходят две единицы вправо, затем пять единиц вверх.",
          "en": "Correct. To reach A, two, five, move two units right and five units up from O."
        },
        {
          "uz": "Yana bir qarang: Bu yo'l koordinatalarni almashtirib, besh; ikki nuqtaga olib boradi. Ikki; besh uchun avval ikki o'ngga, keyin besh yuqoriga yuring.",
          "ru": "Посмотрите ещё раз: Этот путь меняет координаты местами и приводит в точку пять; два. Для точки два; пять двигайтесь на два вправо, затем на пять вверх.",
          "en": "Look again: This route swaps the coordinates and reaches five, two. For two, five, move two right and then five up."
        },
        {
          "uz": "Yana bir qarang: Birinchi koordinata gorizontal siljishni bildiradi, vertikal siljishni emas. Avval ikki o'ngga, so'ng besh yuqoriga yuring.",
          "ru": "Посмотрите ещё раз: Первая координата задаёт горизонтальное, а не вертикальное перемещение. Сначала двигайтесь на два вправо, затем на пять вверх.",
          "en": "Look again: The first coordinate gives the horizontal move, not the vertical one. Move two right first, then five up."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. A, ikki, besh, uchun O dan ikki birlik o'ngga va besh birlik yuqoriga yuriladi.",
        "ru": "Верно. Для точки A сначала проходят две единицы вправо, затем пять единиц вверх.",
        "en": "Correct. To reach A, two, five, move two units right and five units up from O."
      },
      {
        "uz": "Yana bir qarang: Bu yo'l koordinatalarni almashtirib, besh; ikki nuqtaga olib boradi. Ikki; besh uchun avval ikki o'ngga, keyin besh yuqoriga yuring.",
        "ru": "Посмотрите ещё раз: Этот путь меняет координаты местами и приводит в точку пять; два. Для точки два; пять двигайтесь на два вправо, затем на пять вверх.",
        "en": "Look again: This route swaps the coordinates and reaches five, two. For two, five, move two right and then five up."
      },
      {
        "uz": "Yana bir qarang: Birinchi koordinata gorizontal siljishni bildiradi, vertikal siljishni emas. Avval ikki o'ngga, so'ng besh yuqoriga yuring.",
        "ru": "Посмотрите ещё раз: Первая координата задаёт горизонтальное, а не вертикальное перемещение. Сначала двигайтесь на два вправо, затем на пять вверх.",
        "en": "Look again: The first coordinate gives the horizontal move, not the vertical one. Move two right first, then five up."
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
      "uz": "x o'qidagi nuqta",
      "ru": "Точка на оси x",
      "en": "Point on the x-axis"
    },
    "scene": "axis-point",
    "closedSet": true,
    "frames": [
      {
        "uz": "Uch koordinata jufti berilgan.",
        "ru": "Даны три пары координат.",
        "en": "Three coordinate pairs are given."
      },
      {
        "uz": "x o'qida yotgan nuqtani tanlang.",
        "ru": "Выберите точку на оси x.",
        "en": "Choose the point on the x-axis."
      }
    ],
    "question": {
      "uz": "Qaysi nuqta x o'qida yotadi?",
      "ru": "Какая точка лежит на оси x?",
      "en": "Which point lies on the x-axis?"
    },
    "options": [
      {
        "uz": "(4; 0)",
        "ru": "(4; 0)",
        "en": "(4, 0)"
      },
      {
        "uz": "(0; 4)",
        "ru": "(0; 4)",
        "en": "(0, 4)"
      },
      {
        "uz": "(4; 4)",
        "ru": "(4; 4)",
        "en": "(4, 4)"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "(4; 0) nuqta x o'qida yotadi, chunki uning y koordinatasi 0.",
      "ru": "Точка (4; 0) лежит на оси x, потому что её координата y равна 0.",
      "en": "Point (4, 0) lies on the x-axis because its y-coordinate is 0."
    },
    "audio": {
      "intro": {
        "uz": [
          "Uch koordinata juftini solishtiring.",
          "Iks o'qida yotgan nuqtani tanlang."
        ],
        "ru": [
          "Сравните три пары координат.",
          "Выберите точку, лежащую на оси икс."
        ],
        "en": [
          "Compare the three coordinate pairs.",
          "Choose the point that lies on the x-axis."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rt, nol nuqtaning igrek koordinatasi nol, shuning uchun u iks o'qida yotadi.",
        "ru": "Верно. У точки четыре, ноль координата игрек равна нулю, поэтому она лежит на оси икс.",
        "en": "Correct. Point four, zero has a y-coordinate of zero, so it lies on the x-axis."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. To'rt, nol nuqtaning igrek koordinatasi nol, shuning uchun u iks o'qida yotadi.",
          "ru": "Верно. У точки четыре, ноль координата игрек равна нулю, поэтому она лежит на оси икс.",
          "en": "Correct. Point four, zero has a y-coordinate of zero, so it lies on the x-axis."
        },
        {
          "uz": "Yana bir qarang: Nol; to'rt nuqtada iks nol, shuning uchun u igrek o'qida yotadi. Iks o'qidagi nuqtaning igrek koordinatasi nol bo'ladi.",
          "ru": "Посмотрите ещё раз: У точки ноль; четыре координата икс равна нулю, поэтому она лежит на оси игрек. На оси икс координата игрек равна нулю.",
          "en": "Look again: At zero, four, x is zero, so the point lies on the y-axis. A point on the x-axis has y equal to zero."
        },
        {
          "uz": "Yana bir qarang: To'rt; to'rt nuqtaning ikkala koordinatasi ham nol emas, shuning uchun u hech bir o'qda yotmaydi. Iks o'qi uchun igrek nol bo'lsin.",
          "ru": "Посмотрите ещё раз: У точки четыре; четыре обе координаты ненулевые, поэтому она не лежит ни на одной оси. На оси икс игрек равен нулю.",
          "en": "Look again: At four, four, neither coordinate is zero, so the point lies on neither axis. On the x-axis, y must be zero."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. To'rt, nol nuqtaning igrek koordinatasi nol, shuning uchun u iks o'qida yotadi.",
        "ru": "Верно. У точки четыре, ноль координата игрек равна нулю, поэтому она лежит на оси икс.",
        "en": "Correct. Point four, zero has a y-coordinate of zero, so it lies on the x-axis."
      },
      {
        "uz": "Yana bir qarang: Nol; to'rt nuqtada iks nol, shuning uchun u igrek o'qida yotadi. Iks o'qidagi nuqtaning igrek koordinatasi nol bo'ladi.",
        "ru": "Посмотрите ещё раз: У точки ноль; четыре координата икс равна нулю, поэтому она лежит на оси игрек. На оси икс координата игрек равна нулю.",
        "en": "Look again: At zero, four, x is zero, so the point lies on the y-axis. A point on the x-axis has y equal to zero."
      },
      {
        "uz": "Yana bir qarang: To'rt; to'rt nuqtaning ikkala koordinatasi ham nol emas, shuning uchun u hech bir o'qda yotmaydi. Iks o'qi uchun igrek nol bo'lsin.",
        "ru": "Посмотрите ещё раз: У точки четыре; четыре обе координаты ненулевые, поэтому она не лежит ни на одной оси. На оси икс игрек равен нулю.",
        "en": "Look again: At four, four, neither coordinate is zero, so the point lies on neither axis. On the x-axis, y must be zero."
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
      "uz": "Bir balandlikda",
      "ru": "На одной высоте",
      "en": "At the same height"
    },
    "scene": "height-point",
    "closedSet": true,
    "frames": [
      {
        "uz": "C(2; 4) nuqtasi berilgan.",
        "ru": "Дана точка C(2; 4).",
        "en": "Point C(2, 4) is given."
      },
      {
        "uz": "Shu balandlikdagi nuqtani tanlang.",
        "ru": "Выберите точку на той же высоте.",
        "en": "Choose the point at the same height."
      }
    ],
    "question": {
      "uz": "Qaysi nuqta C bilan bir balandlikda?",
      "ru": "Какая точка находится на одной высоте с C?",
      "en": "Which point is at the same height as C?"
    },
    "options": [
      {
        "uz": "(5; 4)",
        "ru": "(5; 4)",
        "en": "(5, 4)"
      },
      {
        "uz": "(4; 5)",
        "ru": "(4; 5)",
        "en": "(4, 5)"
      },
      {
        "uz": "(2; 5)",
        "ru": "(2; 5)",
        "en": "(2, 5)"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "(5; 4) nuqtaning y koordinatasi 4, shuning uchun u C bilan bir balandlikda.",
      "ru": "У точки (5; 4) координата y равна 4, поэтому она находится на одной высоте с C.",
      "en": "Point (5, 4) has y-coordinate 4, so it is at the same height as C."
    },
    "audio": {
      "intro": {
        "uz": [
          "C nuqtaning koordinatalari ikki va to'rt.",
          "Shu balandlikdagi nuqtani tanlang."
        ],
        "ru": [
          "Дана точка C с координатами два и четыре.",
          "Выберите точку на той же высоте."
        ],
        "en": [
          "Point C has coordinates two and four.",
          "Choose the point at the same height."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Besh, to'rt nuqtaning igrek koordinatasi to'rt, shuning uchun u C bilan bir balandlikda.",
        "ru": "Верно. У точки пять, четыре координата игрек равна четырём, поэтому она находится на одной высоте с C.",
        "en": "Correct. Point five, four has a y-coordinate of four, so it is at the same height as C."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Besh, to'rt nuqtaning igrek koordinatasi to'rt, shuning uchun u C bilan bir balandlikda.",
          "ru": "Верно. У точки пять, четыре координата игрек равна четырём, поэтому она находится на одной высоте с C.",
          "en": "Correct. Point five, four has a y-coordinate of four, so it is at the same height as C."
        },
        {
          "uz": "Yana bir qarang: To'rt; besh nuqtaning igrek koordinatasi besh, C nuqtaniki esa to'rt. Bir balandlik uchun igrek koordinatalari teng bo'lishi kerak.",
          "ru": "Посмотрите ещё раз: У точки четыре; пять координата игрек равна пяти, а у C: четырём. Для одной высоты координаты игрек должны совпадать.",
          "en": "Look again: The point four, five has y equal to five, while C has y equal to four. Equal height requires equal y-coordinates."
        },
        {
          "uz": "Yana bir qarang: Ikki; besh nuqta C bilan bir vertikalda, chunki iks bir xil. Ammo igrek besh bo'lgani uchun ular bir balandlikda emas.",
          "ru": "Посмотрите ещё раз: Точка два; пять находится с C на одной вертикали, потому что икс одинаков. Но разные координаты игрек дают разную высоту.",
          "en": "Look again: Two, five is vertically aligned with C because x matches. Its y is five, however, so it is not at the same height."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Besh, to'rt nuqtaning igrek koordinatasi to'rt, shuning uchun u C bilan bir balandlikda.",
        "ru": "Верно. У точки пять, четыре координата игрек равна четырём, поэтому она находится на одной высоте с C.",
        "en": "Correct. Point five, four has a y-coordinate of four, so it is at the same height as C."
      },
      {
        "uz": "Yana bir qarang: To'rt; besh nuqtaning igrek koordinatasi besh, C nuqtaniki esa to'rt. Bir balandlik uchun igrek koordinatalari teng bo'lishi kerak.",
        "ru": "Посмотрите ещё раз: У точки четыре; пять координата игрек равна пяти, а у C: четырём. Для одной высоты координаты игрек должны совпадать.",
        "en": "Look again: The point four, five has y equal to five, while C has y equal to four. Equal height requires equal y-coordinates."
      },
      {
        "uz": "Yana bir qarang: Ikki; besh nuqta C bilan bir vertikalda, chunki iks bir xil. Ammo igrek besh bo'lgani uchun ular bir balandlikda emas.",
        "ru": "Посмотрите ещё раз: Точка два; пять находится с C на одной вертикали, потому что икс одинаков. Но разные координаты игрек дают разную высоту.",
        "en": "Look again: Two, five is vertically aligned with C because x matches. Its y is five, however, so it is not at the same height."
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
      "uz": "4 birlik o'ngga",
      "ru": "На 4 единицы вправо",
      "en": "4 units right"
    },
    "scene": "move-point",
    "closedSet": true,
    "frames": [
      {
        "uz": "A(2; 3) nuqtasi berilgan.",
        "ru": "Дана точка A(2; 3).",
        "en": "Point A(2, 3) is given."
      },
      {
        "uz": "Uni 4 birlik o'ngga suring.",
        "ru": "Сдвиньте её на 4 единицы вправо.",
        "en": "Move it 4 units right."
      }
    ],
    "question": {
      "uz": "Yangi koordinata qaysi?",
      "ru": "Какова новая координата?",
      "en": "What is the new coordinate?"
    },
    "options": [
      {
        "uz": "(6; 3)",
        "ru": "(6; 3)",
        "en": "(6, 3)"
      },
      {
        "uz": "(2; 7)",
        "ru": "(2; 7)",
        "en": "(2, 7)"
      },
      {
        "uz": "(6; 7)",
        "ru": "(6; 7)",
        "en": "(6, 7)"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "2 ga 4 qo'shilsa, x koordinata 6 bo'ladi; y koordinata 3 bo'lib qoladi.",
      "ru": "Если к 2 прибавить 4, координата x станет 6, а координата y останется 3.",
      "en": "Adding 4 to 2 makes the x-coordinate 6, while the y-coordinate stays 3."
    },
    "audio": {
      "intro": {
        "uz": [
          "A nuqtaning koordinatalari ikki va uch.",
          "Uni to'rt birlik o'ngga suring."
        ],
        "ru": [
          "Дана точка A с координатами два и три.",
          "Сдвиньте её на четыре единицы вправо."
        ],
        "en": [
          "Point A has coordinates two and three.",
          "Move it four units right."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Olti, uch koordinatali nuqta mos. Ikkiga to'rt qo'shilsa, iks koordinata olti bo'ladi, igrek koordinata uch bo'lib qoladi.",
        "ru": "Верно. Подходит точка с координатами шесть и три. К двум прибавили четыре. Координата икс стала равна шести, а координата игрек осталась равна трём.",
        "en": "Correct. The point with coordinates six and three fits. Adding four to two makes the x-coordinate six, while the y-coordinate stays three."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Olti, uch koordinatali nuqta mos. Ikkiga to'rt qo'shilsa, iks koordinata olti bo'ladi, igrek koordinata uch bo'lib qoladi.",
          "ru": "Верно. Подходит точка с координатами шесть и три. К двум прибавили четыре. Координата икс стала равна шести, а координата игрек осталась равна трём.",
          "en": "Correct. The point with coordinates six and three fits. Adding four to two makes the x-coordinate six, while the y-coordinate stays three."
        },
        {
          "uz": "Yana bir qarang: Ikki; yetti nuqta yuqoriga siljishni ko'rsatadi, chunki igrek o'zgargan. O'ngga to'rt birlik yurganda iks olti bo'ladi.",
          "ru": "Посмотрите ещё раз: Точка два; семь показывает движение вверх, потому что изменилась координата игрек. При движении вправо икс становится равным шести.",
          "en": "Look again: Two, seven represents an upward move because y changed. Moving four units right makes x equal to six."
        },
        {
          "uz": "Yana bir qarang: Olti; yetti nuqtada iks ham, igrek ham o'zgargan. Gorizontal siljishda faqat iks olti bo'ladi, igrek uchligicha qoladi.",
          "ru": "Посмотрите ещё раз: В точке шесть; семь изменились обе координаты. При горизонтальном движении меняется только икс, а игрек остаётся равным трём.",
          "en": "Look again: At six, seven, both coordinates changed. A horizontal move changes only x to six, while y remains three."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Olti, uch koordinatali nuqta mos. Ikkiga to'rt qo'shilsa, iks koordinata olti bo'ladi, igrek koordinata uch bo'lib qoladi.",
        "ru": "Верно. Подходит точка с координатами шесть и три. К двум прибавили четыре. Координата икс стала равна шести, а координата игрек осталась равна трём.",
        "en": "Correct. The point with coordinates six and three fits. Adding four to two makes the x-coordinate six, while the y-coordinate stays three."
      },
      {
        "uz": "Yana bir qarang: Ikki; yetti nuqta yuqoriga siljishni ko'rsatadi, chunki igrek o'zgargan. O'ngga to'rt birlik yurganda iks olti bo'ladi.",
        "ru": "Посмотрите ещё раз: Точка два; семь показывает движение вверх, потому что изменилась координата игрек. При движении вправо икс становится равным шести.",
        "en": "Look again: Two, seven represents an upward move because y changed. Moving four units right makes x equal to six."
      },
      {
        "uz": "Yana bir qarang: Olti; yetti nuqtada iks ham, igrek ham o'zgargan. Gorizontal siljishda faqat iks olti bo'ladi, igrek uchligicha qoladi.",
        "ru": "Посмотрите ещё раз: В точке шесть; семь изменились обе координаты. При горизонтальном движении меняется только икс, а игрек остаётся равным трём.",
        "en": "Look again: At six, seven, both coordinates changed. A horizontal move changes only x to six, while y remains three."
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
      "uz": "Bit kataklarni sanadimi?",
      "ru": "Бит посчитал клетки?",
      "en": "Did Bit count squares?"
    },
    "scene": "scale-point",
    "closedSet": true,
    "frames": [
      {
        "uz": "Masshtabda 1 katak 2 birlikka teng.",
        "ru": "В этом масштабе 1 клетка равна 2 единицам.",
        "en": "On this scale, 1 square equals 2 units."
      },
      {
        "uz": "Nuqta O dan 3 katak o'ngda.",
        "ru": "Точка находится на 3 клетки правее O.",
        "en": "The point is 3 squares right of O."
      }
    ],
    "question": {
      "uz": "Nuqtaning x koordinatasi nechaga teng?",
      "ru": "Чему равна координата x?",
      "en": "What is the x-coordinate?"
    },
    "options": [
      {
        "uz": "3",
        "ru": "3",
        "en": "3"
      },
      {
        "uz": "6",
        "ru": "6",
        "en": "6"
      },
      {
        "uz": "5",
        "ru": "5",
        "en": "5"
      }
    ],
    "correctIndex": 1,
    "proof": {
      "uz": "3 katakning har biri 2 birlik: 3 × 2 = 6.",
      "ru": "Каждая из 3 клеток равна 2 единицам: 3 × 2 = 6.",
      "en": "Each of the 3 squares represents 2 units: 3 × 2 = 6."
    },
    "audio": {
      "intro": {
        "uz": [
          "Masshtabda bir katak ikki birlikka teng.",
          "Nuqta O dan uch katak o'ngda."
        ],
        "ru": [
          "В этом масштабе одна клетка равна двум единицам.",
          "Точка находится в трёх клетках справа от O."
        ],
        "en": [
          "On this scale, one square equals two units.",
          "The point is three squares right of O."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Uch katakning har biri ikki birlik: uch karra ikki teng olti.",
        "ru": "Верно. Каждая из трёх клеток равна двум единицам: три умножить на два равно шесть.",
        "en": "Correct. Each of the three squares represents two units: three multiplied by two equals six."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Uch faqat kataklar soni. Har katak ikki birlik bo'lgani uchun uchni ikkiga ko'paytiring: iks olti.",
          "ru": "Посмотрите ещё раз: Три обозначает только число клеток. Каждая клетка равна двум единицам, поэтому три умножить на два равно шести.",
          "en": "Look again: Three is only the number of squares. Each square represents two units, so three multiplied by two gives x equal to six."
        },
        {
          "uz": "To'g'ri. Uch katakning har biri ikki birlik: uch karra ikki teng olti.",
          "ru": "Верно. Каждая из трёх клеток равна двум единицам: три умножить на два равно шесть.",
          "en": "Correct. Each of the three squares represents two units: three multiplied by two equals six."
        },
        {
          "uz": "Yana bir qarang: Shkala belgilari nol, ikki, to'rt, olti tarzida boradi. Besh belgi orasida qoladi, nuqta esa uchinchi chiziqda, ya'ni oltida.",
          "ru": "Посмотрите ещё раз: Шкала идёт как ноль, два, четыре, шесть. Пять находится между отметками, а точка стоит на третьей линии, то есть на шести.",
          "en": "Look again: The scale runs zero, two, four, six. Five lies between marks, while the point is on the third line, at six."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Uch faqat kataklar soni. Har katak ikki birlik bo'lgani uchun uchni ikkiga ko'paytiring: iks olti.",
        "ru": "Посмотрите ещё раз: Три обозначает только число клеток. Каждая клетка равна двум единицам, поэтому три умножить на два равно шести.",
        "en": "Look again: Three is only the number of squares. Each square represents two units, so three multiplied by two gives x equal to six."
      },
      {
        "uz": "To'g'ri. Uch katakning har biri ikki birlik: uch karra ikki teng olti.",
        "ru": "Верно. Каждая из трёх клеток равна двум единицам: три умножить на два равно шесть.",
        "en": "Correct. Each of the three squares represents two units: three multiplied by two equals six."
      },
      {
        "uz": "Yana bir qarang: Shkala belgilari nol, ikki, to'rt, olti tarzida boradi. Besh belgi orasida qoladi, nuqta esa uchinchi chiziqda, ya'ni oltida.",
        "ru": "Посмотрите ещё раз: Шкала идёт как ноль, два, четыре, шесть. Пять находится между отметками, а точка стоит на третьей линии, то есть на шести.",
        "en": "Look again: The scale runs zero, two, four, six. Five lies between marks, while the point is on the third line, at six."
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
      "uz": "Yo'qolgan uch",
      "ru": "Пропавшая вершина",
      "en": "Missing vertex"
    },
    "scene": "rectangle-point",
    "closedSet": true,
    "frames": [
      {
        "uz": "A(2;2), B(6;2), C(6;5) nuqtalar berilgan.",
        "ru": "Даны точки A(2;2), B(6;2), C(6;5).",
        "en": "Points A(2,2), B(6,2) and C(6,5) are given."
      },
      {
        "uz": "Ular to'g'ri to'rtburchakning uchta uchi.",
        "ru": "Это три вершины прямоугольника.",
        "en": "They are three vertices of a rectangle."
      },
      {
        "uz": "To'rtinchi uchni toping.",
        "ru": "Найдите четвёртую вершину.",
        "en": "Find the fourth vertex."
      }
    ],
    "question": {
      "uz": "Yo'qolgan uch qaysi?",
      "ru": "Каковы координаты точки D?",
      "en": "What are the coordinates of D?"
    },
    "options": [
      {
        "uz": "(2; 5)",
        "ru": "(2; 5)",
        "en": "(2, 5)"
      },
      {
        "uz": "(5; 2)",
        "ru": "(5; 2)",
        "en": "(5, 2)"
      },
      {
        "uz": "(6; 6)",
        "ru": "(6; 6)",
        "en": "(6, 6)"
      }
    ],
    "correctIndex": 0,
    "proof": {
      "uz": "(2; 5) nuqta A bilan bir xil x, C bilan bir xil y koordinataga ega.",
      "ru": "Точка (2; 5) имеет ту же координату x, что A, и ту же координату y, что C.",
      "en": "Point (2, 5) has the same x-coordinate as A and the same y-coordinate as C."
    },
    "audio": {
      "intro": {
        "uz": [
          "A nuqtaning koordinatalari ikki va ikki. B nuqtaniki olti va ikki. C nuqtaniki olti va besh.",
          "Ular to'g'ri to'rtburchakning uchta uchi.",
          "To'rtinchi uchni toping."
        ],
        "ru": [
          "Даны точки A с координатами два и два, B с координатами шесть и два, C с координатами шесть и пять.",
          "Это три вершины прямоугольника.",
          "Найдите четвёртую вершину."
        ],
        "en": [
          "Points A, B and C have coordinates two and two, six and two, and six and five.",
          "They are three vertices of a rectangle.",
          "Find the fourth vertex."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Ikki, besh koordinatali nuqta mos. Uning iks koordinatasi A nuqtaniki bilan, igrek koordinatasi C nuqtaniki bilan teng.",
        "ru": "Верно. Подходит точка с координатами два и пять. Её координата икс совпадает с координатой точки A. Координата игрек совпадает с координатой точки C.",
        "en": "Correct. The point with coordinates two and five fits. Its x-coordinate matches A, and its y-coordinate matches C."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Ikki, besh koordinatali nuqta mos. Uning iks koordinatasi A nuqtaniki bilan, igrek koordinatasi C nuqtaniki bilan teng.",
          "ru": "Верно. Подходит точка с координатами два и пять. Её координата икс совпадает с координатой точки A. Координата игрек совпадает с координатой точки C.",
          "en": "Correct. The point with coordinates two and five fits. Its x-coordinate matches A, and its y-coordinate matches C."
        },
        {
          "uz": "Yana bir qarang: Besh; ikki kerakli koordinatalarni almashtiradi. Chap uch uchun iks A dagidek ikki, yuqori uch uchun igrek C dagidek besh bo'lsin.",
          "ru": "Посмотрите ещё раз: В точке пять; два нужные координаты поменяны местами. Слева икс должен быть равен двум, а сверху игрек должен быть равен пяти.",
          "en": "Look again: Five, two swaps the needed coordinates. The left vertex needs x equal to two, and the top vertex needs y equal to five."
        },
        {
          "uz": "Yana bir qarang: Olti; olti na chap tomonning iks koordinatasini, na yuqori tomonning igrek koordinatasini saqlaydi. Yetishmagan uch ikki; besh.",
          "ru": "Посмотрите ещё раз: Точка шесть; шесть не сохраняет ни координату икс левой стороны, ни координату игрек верхней стороны. Нужна точка два; пять.",
          "en": "Look again: Six, six matches neither the left side's x-coordinate nor the top side's y-coordinate. The missing vertex is two, five."
        }
      ]
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Ikki, besh koordinatali nuqta mos. Uning iks koordinatasi A nuqtaniki bilan, igrek koordinatasi C nuqtaniki bilan teng.",
        "ru": "Верно. Подходит точка с координатами два и пять. Её координата икс совпадает с координатой точки A. Координата игрек совпадает с координатой точки C.",
        "en": "Correct. The point with coordinates two and five fits. Its x-coordinate matches A, and its y-coordinate matches C."
      },
      {
        "uz": "Yana bir qarang: Besh; ikki kerakli koordinatalarni almashtiradi. Chap uch uchun iks A dagidek ikki, yuqori uch uchun igrek C dagidek besh bo'lsin.",
        "ru": "Посмотрите ещё раз: В точке пять; два нужные координаты поменяны местами. Слева икс должен быть равен двум, а сверху игрек должен быть равен пяти.",
        "en": "Look again: Five, two swaps the needed coordinates. The left vertex needs x equal to two, and the top vertex needs y equal to five."
      },
      {
        "uz": "Yana bir qarang: Olti; olti na chap tomonning iks koordinatasini, na yuqori tomonning igrek koordinatasini saqlaydi. Yetishmagan uch ikki; besh.",
        "ru": "Посмотрите ещё раз: Точка шесть; шесть не сохраняет ни координату икс левой стороны, ни координату игрек верхней стороны. Нужна точка два; пять.",
        "en": "Look again: Six, six matches neither the left side's x-coordinate nor the top side's y-coordinate. The missing vertex is two, five."
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
      "uz": "Koordinata navigatori",
      "ru": "Координатный навигатор",
      "en": "Coordinate navigator"
    },
    "scene": "summary",
    "frames": [
      {
        "uz": "O — koordinata boshi.",
        "ru": "O — начало координат.",
        "en": "O is the origin."
      },
      {
        "uz": "Masshtabni avval tekshiring.",
        "ru": "Сначала проверьте масштаб.",
        "en": "Check the scale first."
      },
      {
        "uz": "Avval x koordinata bo'yicha yuring.",
        "ru": "Сначала двигайтесь по координате x.",
        "en": "Move along the x-coordinate first."
      },
      {
        "uz": "Keyin y koordinata bo'yicha yuring.",
        "ru": "Затем двигайтесь по координате y.",
        "en": "Then move along the y-coordinate."
      },
      {
        "uz": "Keyingi darsda fazoviy shakllarni o'rganamiz.",
        "ru": "На следующем уроке изучим пространственные фигуры.",
        "en": "Next, we will study solid shapes."
      }
    ],
    "audio": {
      "uz": [
        "O, koordinata boshi.",
        "Masshtabni avval tekshiring.",
        "Avval iks koordinata bo'yicha yuring.",
        "Keyin igrek koordinata bo'yicha yuring.",
        "Keyingi darsda fazoviy shakllarni o'rganamiz."
      ],
      "ru": [
        "O, начало координат.",
        "Сначала проверьте масштаб.",
        "Сначала двигайтесь по координате икс.",
        "Затем двигайтесь по координате игрек.",
        "На следующем уроке изучим пространственные фигуры."
      ],
      "en": [
        "O is the origin.",
        "Check the scale first.",
        "Move along the x-coordinate first.",
        "Then move along the y-coordinate.",
        "Next, we will study solid shapes."
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
  if (scene === 'hook') return <div className="topic-visual topic-v39 scene-hook" aria-hidden="true"><svg viewBox="0 0 600 220">
    <g opacity=".22">{Array.from({length:8},(_,i)=><line key={'v'+i} x1={76+i*68} y1="18" x2={76+i*68} y2="190" stroke="#168FA3" strokeWidth="1.5"/>)}{Array.from({length:7},(_,i)=><line key={'h'+i} x1="76" y1={190-i*31} x2="552" y2={190-i*31} stroke="#168FA3" strokeWidth="1.5"/>)}</g>
    <g className={on(0)}><line x1="76" y1="190" x2="566" y2="190" stroke="#173B52" strokeWidth="5"/><line x1="76" y1="200" x2="76" y2="10" stroke="#173B52" strokeWidth="5"/><path d="M566 190 l-15 -8 v16z M76 10 l-8 15 h16z" fill="#173B52"/><circle cx="348" cy="97" r="10" fill="#FF5B35" stroke="#173B52" strokeWidth="3"/><text x="363" y="84" fill="#173B52" fontSize="18" fontWeight="900">A(4; 3)</text></g>
    <g className={on(1)}><path d="M76 190 H280 V66" fill="none" stroke="#168FA3" strokeWidth="4" strokeDasharray="9 7"/><circle cx="280" cy="66" r="10" fill="#95C93D" stroke="#173B52" strokeWidth="3"/><text x="294" y="50" fill="#173B52" fontSize="18" fontWeight="900">B(3; 4)</text></g>
    <g className={on(2)}><path d="M348 111 C330 138 302 138 282 80" fill="none" stroke="#FF5B35" strokeWidth="4" strokeDasharray="8 6"/><path d="M276 86 l5-17 13 12z" fill="#FF5B35"/><text x="320" y="158" textAnchor="middle" fill="#FF5B35" fontSize="24" fontWeight="900">x ↔ y ?</text></g>
  </svg></div>;
  const targets = {
    hook: [4, 3, 'A(4; 3)'], axes: [0, 0, 'O'], origin: [0, 0, 'O = (0; 0)'],
    route: [4, 3, 'A(4; 3)'], read: [2, 5, 'B(2; 5)'],
    algorithm: [4, 3, 'A(4; 3)'],
    'point-choice': [2, 5, 'A(2; 5)'], 'axis-point': [4, 0, '(4; 0)'],
    'height-point': [5, 4, '(5; 4)'], 'move-point': [6, 3, '(6; 3)'],
    'scale-point': [3, 0, 'x = 6'], 'rectangle-point': [2, 5, '(2; 5)'],
  };
  const [tx, ty, label] = targets[scene] || [2, 3, scene === 'origin' ? 'O = (0; 0)' : '(x; y)'];
  const px = 76 + tx * 68; const py = 190 - ty * 31;
  const scaleMode = /scale/.test(scene); const alignment = scene === 'alignment'; const rectangle = scene === 'rectangle-point';
  return <div className={'topic-visual topic-v39 scene-' + scene} aria-hidden="true"><svg viewBox="0 0 600 220">
    <g opacity=".22">{Array.from({length:8},(_,i)=><line key={'v'+i} x1={76+i*68} y1="18" x2={76+i*68} y2="190" stroke="#168FA3" strokeWidth="1.5"/>)}{Array.from({length:7},(_,i)=><line key={'h'+i} x1="76" y1={190-i*31} x2="552" y2={190-i*31} stroke="#168FA3" strokeWidth="1.5"/>)}</g>
    <g className={on(0)}><line x1="76" y1="190" x2="566" y2="190" stroke="#173B52" strokeWidth="5"/><line x1="76" y1="200" x2="76" y2="10" stroke="#173B52" strokeWidth="5"/><path d="M566 190 l-15 -8 v16z M76 10 l-8 15 h16z" fill="#173B52"/><text x="60" y="210" fill="#173B52" fontSize="17" fontWeight="900">O</text></g>
    {scaleMode && <g className={on(1)}><path d="M76 204 H144" stroke="#FF5B35" strokeWidth="5"/><text x="110" y="216" textAnchor="middle" fill="#173B52" fontSize="14" fontWeight="900">× 2</text></g>}
    {!alignment && <g className={on(1)}><path d={'M76 190 H'+px+' V'+py} fill="none" stroke="#FF5B35" strokeWidth="5" strokeDasharray="10 8"/></g>}
    {!alignment && <g className={on(2)}><circle cx={px} cy={py} r="11" fill="#95C93D" stroke="#173B52" strokeWidth="4"/><text x={px+16} y={Math.max(22,py-12)} fill="#173B52" fontSize="18" fontWeight="900">{label}</text></g>}
    {!alignment && <g className={on(3)}><line x1={px} y1={py} x2={px} y2="190" stroke="#168FA3" strokeWidth="3" strokeDasharray="6 6"/><line x1={px} y1={py} x2="76" y2={py} stroke="#168FA3" strokeWidth="3" strokeDasharray="6 6"/></g>}
    {alignment && <g className={on(1)}><line x1="280" y1="35" x2="280" y2="190" stroke="#FF5B35" strokeWidth="5"/><circle cx="280" cy="128" r="10" fill="#95C93D"/><circle cx="280" cy="35" r="10" fill="#95C93D"/></g>}
    {alignment && <g className={on(2)}><line x1="144" y1="66" x2="484" y2="66" stroke="#168FA3" strokeWidth="5"/><circle cx="212" cy="66" r="10" fill="#FF5B35"/><circle cx="484" cy="66" r="10" fill="#FF5B35"/></g>}
    {rectangle && <g className={on(4)}><path d="M212 128 H484 V35 H212 Z" fill="none" stroke="#FF5B35" strokeWidth="5"/></g>}
    <g className={on(4)}><circle cx="548" cy="28" r="15" fill="#95C93D"/><path d="M540 28 l6 6 11-15" fill="none" stroke="#173B52" strokeWidth="4"/></g>
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
export default function Grade4Dars39({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars39 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
