import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 36 · To'g'ri to'rtburchak va kvadrat
// 15 ekran · 50 asosiy audio beat · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
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
const LESSON_KIND = "quadrilateral";
const LESSON_META = { lessonId: "geometry-4-36-v1", slug: "dars36-togri-tortburchak-va-kvadrat", lessonTitle: {"uz":"To'g'ri to'rtburchak va kvadrat","ru":"Прямоугольник и квадрат","en":"Rectangle and square"}, skillTags: ["rectangle-properties","square-properties","class-inclusion","orientation-invariant"] };
const CONTENT = {
  "s0": {
    "eyebrow": {
      "uz": "Muammo",
      "ru": "Проблема",
      "en": "Problem"
    },
    "title": {
      "uz": "Kvadrat qaysi oilada?",
      "ru": "К какому семейству относится квадрат?",
      "en": "Which family does a square belong to?"
    },
    "scene": "quad-hook",
    "closedSet": true,
    "frames": [
      {
        "uz": "To'g'ri to'rtburchak",
        "ru": "Прямоугольник",
        "en": "Rectangle"
      },
      {
        "uz": "Kvadrat uning ichiga mos tushadi",
        "ru": "Квадрат помещается внутри него",
        "en": "A square fits inside it"
      },
      {
        "uz": "Har bir kvadrat to'g'ri to'rtburchakmi?",
        "ru": "Каждый ли квадрат является прямоугольником?",
        "en": "Is every square a rectangle?"
      }
    ],
    "question": {
      "uz": "Kvadrat to'g'ri to'rtburchakmi?",
      "ru": "Является ли квадрат прямоугольником?",
      "en": "Is a square a rectangle?"
    },
    "options": [
      {
        "uz": "Ha, uning maxsus turi",
        "ru": "Да, это его особый вид",
        "en": "Yes, it is a special type"
      },
      {
        "uz": "Yo'q, ular butunlay boshqa",
        "ru": "Нет, это совсем разные фигуры",
        "en": "No, they are completely different"
      },
      {
        "uz": "Faqat qiya turganda",
        "ru": "Только когда он наклонён",
        "en": "Only when it is tilted"
      }
    ],
    "neutral": {
      "uz": "Taxmin saqlandi. Figuralarni nomiga emas, xossalariga ko'ra tekshiramiz.",
      "ru": "Гипотеза сохранена. Проверим фигуры по свойствам, а не по названию.",
      "en": "Estimate saved. We will check the shapes by properties, not names."
    },
    "audio": {
      "intro": {
        "uz": [
          "Sahnada to'g'ri to'rtburchak turibdi.",
          "Kvadrat uning ichiga joylashadi.",
          "Har bir kvadrat to'g'ri to'rtburchakmi."
        ],
        "ru": [
          "На сцене находится прямоугольник.",
          "Квадрат помещается внутрь него.",
          "Каждый ли квадрат является прямоугольником?"
        ],
        "en": [
          "A rectangle is shown on the stage.",
          "A square fits inside it.",
          "Is every square a rectangle?"
        ]
      }
    }
  },
  "s1": {
    "eyebrow": {
      "uz": "Tadqiqot",
      "ru": "Исследование",
      "en": "Explore"
    },
    "title": {
      "uz": "To'rtburchak",
      "ru": "Четырёхугольник",
      "en": "Quadrilateral"
    },
    "scene": "quad-parts",
    "frames": [
      {
        "uz": "4 ta tomon",
        "ru": "4 стороны",
        "en": "4 sides"
      },
      {
        "uz": "4 ta uch",
        "ru": "4 вершины",
        "en": "4 vertices"
      },
      {
        "uz": "4 ta burchak",
        "ru": "4 угла",
        "en": "4 angles"
      },
      {
        "uz": "Har bir to'rtburchak to'g'ri to'rtburchak yoki kvadrat emas",
        "ru": "Не каждый четырёхугольник является прямоугольником или квадратом",
        "en": "Not every quadrilateral is a rectangle or square"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'rt tomonning o'zi maxsus tur uchun yetmaydi burchak va tomon xossalari ham tekshiriladi. To'rtta tomon.",
          "To'rtta uch",
          "To'rtta burchak.",
          "Har bir to'rtburchak to'g'ri to'rtburchak yoki kvadrat emas."
        ],
        "ru": [
          "Четырёх сторон недостаточно для особого вида нужно проверить углы и стороны. Четыре стороны.",
          "Четыре вершины",
          "Четыре угла.",
          "Не каждый четырёхугольник является прямоугольником или квадратом."
        ],
        "en": [
          "Four sides alone do not identify a special type inspect the angles and side properties too. Four sides.",
          "Four vertices",
          "Four angles.",
          "Not every quadrilateral is a rectangle or square."
        ]
      }
    }
  },
  "s2": {
    "eyebrow": {
      "uz": "Tadqiqot",
      "ru": "Исследование",
      "en": "Explore"
    },
    "title": {
      "uz": "To'rtta to'g'ri burchak",
      "ru": "Четыре прямых угла",
      "en": "Four right angles"
    },
    "scene": "quad-rect",
    "frames": [
      {
        "uz": "Birinchi 90° belgi",
        "ru": "Первая отметка 90°",
        "en": "First 90° marker"
      },
      {
        "uz": "Ikkinchi 90° belgi",
        "ru": "Вторая отметка 90°",
        "en": "Second 90° marker"
      },
      {
        "uz": "4 ta 90° burchak",
        "ru": "4 угла по 90°",
        "en": "4 angles of 90°"
      },
      {
        "uz": "To'g'ri to'rtburchak",
        "ru": "Прямоугольник",
        "en": "Rectangle"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'rtta to'g'ri burchak to'g'ri to'rtburchakni aniqlovchi asosiy belgidir. Birinchi to'qson daraja belgi.",
          "Ikkinchi to'qson daraja belgi",
          "To'rtta to'g'ri burchak.",
          "To'g'ri to'rtburchak."
        ],
        "ru": [
          "Четыре прямых угла являются определяющим свойством прямоугольника. Первая отметка девяносто градусов.",
          "Вторая отметка девяносто градусов",
          "Четыре угла по девяносто градусов.",
          "Прямоугольник."
        ],
        "en": [
          "Four right angles are the defining property of a rectangle. First ninety-degree marker.",
          "Second ninety-degree marker",
          "Four angles of ninety degrees.",
          "Rectangle."
        ]
      }
    }
  },
  "s3": {
    "eyebrow": {
      "uz": "Tadqiqot",
      "ru": "Исследование",
      "en": "Explore"
    },
    "title": {
      "uz": "Qarama-qarshi tomonlar",
      "ru": "Противоположные стороны",
      "en": "Opposite sides"
    },
    "scene": "quad-sides",
    "frames": [
      {
        "uz": "Yuqori va pastki tomonlar",
        "ru": "Верхняя и нижняя стороны",
        "en": "Top and bottom sides"
      },
      {
        "uz": "Ular teng va parallel",
        "ru": "Они равны и параллельны",
        "en": "They are equal and parallel"
      },
      {
        "uz": "Chap va o'ng tomonlar",
        "ru": "Левая и правая стороны",
        "en": "Left and right sides"
      },
      {
        "uz": "Ular ham teng va parallel",
        "ru": "Они тоже равны и параллельны",
        "en": "They are also equal and parallel"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'g'ri to'rtburchakning qarama qarshi tomonlari teng va parallel bo'lib juftlashadi. Yuqori va pastki tomonlar.",
          "Ular teng va parallel",
          "Chap va o'ng tomonlar.",
          "Ular ham teng va parallel."
        ],
        "ru": [
          "Противоположные стороны прямоугольника попарно равны и параллельны. Верхняя и нижняя стороны.",
          "Они равны и параллельны",
          "Левая и правая стороны.",
          "Они тоже равны и параллельны."
        ],
        "en": [
          "A rectangle's opposite sides form equal and parallel pairs. Top and bottom sides.",
          "They are equal and parallel",
          "Left and right sides.",
          "They are also equal and parallel."
        ]
      }
    }
  },
  "s4": {
    "eyebrow": {
      "uz": "Tadqiqot",
      "ru": "Исследование",
      "en": "Explore"
    },
    "title": {
      "uz": "Kvadratning qo'shimcha xossasi",
      "ru": "Дополнительное свойство квадрата",
      "en": "The square's extra property"
    },
    "scene": "quad-square",
    "frames": [
      {
        "uz": "To'rtta 90° burchak",
        "ru": "Четыре угла по 90°",
        "en": "Four 90° angles"
      },
      {
        "uz": "Birinchi tomon belgilanadi",
        "ru": "Отмечена первая сторона",
        "en": "The first side is marked"
      },
      {
        "uz": "Qolgan uch tomon ham tenglashadi",
        "ru": "Остальные три стороны становятся равными",
        "en": "The other three sides become equal"
      },
      {
        "uz": "Barcha tomonlari teng kvadrat",
        "ru": "Квадрат со всеми равными сторонами",
        "en": "A square with all sides equal"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'g'ri burchaklarga barcha teng tomonlar qo'shilsa figura kvadrat bo'ladi. To'rtta to'g'ri burchak.",
          "Birinchi tomon belgilanadi",
          "Qolgan uch tomon ham tenglashadi.",
          "Barcha tomonlari teng kvadrat."
        ],
        "ru": [
          "Если к прямым углам добавить четыре равные стороны получится квадрат. Четыре угла по девяносто градусов.",
          "Отмечена первая сторона",
          "Остальные три стороны становятся равными.",
          "Квадрат со всеми равными сторонами."
        ],
        "en": [
          "Adding four equal sides to the right angle properties makes a square. Four right angles.",
          "The first side is marked",
          "The other three sides become equal.",
          "A square with all sides equal."
        ]
      }
    }
  },
  "s5": {
    "eyebrow": {
      "uz": "Tadqiqot",
      "ru": "Исследование",
      "en": "Explore"
    },
    "title": {
      "uz": "Umumiy va farqli",
      "ru": "Общее и различное",
      "en": "Shared and different"
    },
    "scene": "quad-compare",
    "frames": [
      {
        "uz": "4 ta tomon",
        "ru": "4 стороны",
        "en": "4 sides"
      },
      {
        "uz": "To'rtta 90° burchak",
        "ru": "Четыре угла по 90°",
        "en": "Four 90° angles"
      },
      {
        "uz": "Qarama-qarshi tomonlar teng",
        "ru": "Противоположные стороны равны",
        "en": "Opposite sides are equal"
      },
      {
        "uz": "Kvadratda barcha tomonlar teng",
        "ru": "У квадрата все стороны равны",
        "en": "A square has all sides equal"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Kvadrat to'g'ri to'rtburchak oilasiga kiradi ammo har bir to'g'ri to'rtburchak kvadrat emas. To'rtta tomon.",
          "To'rtta to'g'ri burchak",
          "Qarama qarshi tomonlar teng.",
          "Kvadratda barcha tomonlar teng."
        ],
        "ru": [
          "Квадрат входит в семейство прямоугольников но не каждый прямоугольник является квадратом. Четыре стороны.",
          "Четыре угла по девяносто градусов",
          "Противоположные стороны равны.",
          "У квадрата все стороны равны."
        ],
        "en": [
          "A square belongs to the rectangle family but not every rectangle is a square. Four sides.",
          "Four right angles",
          "Opposite sides are equal.",
          "A square has all sides equal."
        ]
      }
    }
  },
  "s6": {
    "eyebrow": {
      "uz": "Qoida",
      "ru": "Правило",
      "en": "Rule"
    },
    "title": {
      "uz": "Har bir qoidasi",
      "ru": "Правило «каждый»",
      "en": "The “every” rule"
    },
    "scene": "quad-rule",
    "frames": [
      {
        "uz": "Har bir kvadrat to'g'ri to'rtburchak - rost",
        "ru": "Каждый квадрат является прямоугольником - истина",
        "en": "Every square is a rectangle - true"
      },
      {
        "uz": "Har bir to'g'ri to'rtburchak kvadrat - yolg'on",
        "ru": "Каждый прямоугольник является квадратом - ложь",
        "en": "Every rectangle is a square - false"
      },
      {
        "uz": "Faqat barcha tomonlari teng bo'lsa kvadrat",
        "ru": "Квадрат только тогда, когда все стороны равны",
        "en": "It is a square only when all sides are equal"
      },
      {
        "uz": "Xossalarni saqlang",
        "ru": "Сохраняйте свойства",
        "en": "Keep the properties"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Oilaviy qoida maxsus figura umumiy figuraning barcha xossalarini saqlashini talab qiladi. Har bir kvadrat to'g'ri to'rtburchak degan gap rost.",
          "Har bir to'g'ri to'rtburchak kvadrat degan gap yolg'on",
          "Faqat barcha tomonlari teng bo'lsa kvadrat.",
          "Xossalarni saqlang."
        ],
        "ru": [
          "Правило семейства требует чтобы особая фигура сохраняла все свойства общей фигуры. Утверждение Каждый квадрат является прямоугольником истинно.",
          "Утверждение Каждый прямоугольник является квадратом ложно",
          "Квадрат только тогда когда все стороны равны.",
          "Сохраняйте свойства."
        ],
        "en": [
          "A family rule requires the special shape to retain every property of the general shape. The statement Every square is a rectangle is true.",
          "Every rectangle is a square is false. A rectangle may have unequal adjacent sides, unlike a square.",
          "It is a square only when all sides are equal.",
          "Keep the properties."
        ]
      }
    }
  },
  "s7": {
    "eyebrow": {
      "uz": "Qoida",
      "ru": "Правило",
      "en": "Rule"
    },
    "title": {
      "uz": "Fasad katalogi",
      "ru": "Каталог фасада",
      "en": "Façade catalogue"
    },
    "scene": "quad-payoff",
    "frames": [
      {
        "uz": "To'rtta 90° burchak",
        "ru": "Четыре угла по 90°",
        "en": "Four 90° angles"
      },
      {
        "uz": "To'rtta teng tomon",
        "ru": "Четыре равные стороны",
        "en": "Four equal sides"
      },
      {
        "uz": "Kvadrat",
        "ru": "Квадрат",
        "en": "Square"
      },
      {
        "uz": "Kvadrat - maxsus to'g'ri to'rtburchak",
        "ru": "Квадрат - особый прямоугольник",
        "en": "A square is a special rectangle"
      },
      {
        "uz": "Katalogga o'tkazing",
        "ru": "Перенесите в каталог",
        "en": "Move it to the catalogue"
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Fasadni kataloglashda avval to'g'ri burchaklar keyin barcha tomonlarning tengligi tekshiriladi. To'rtta to'g'ri burchak.",
          "To'rtta teng tomon",
          "Kvadrat.",
          "Kvadrat maxsus to'g'ri to'rtburchakdir.",
          "Katalogga o'tkazing."
        ],
        "ru": [
          "При каталогизации фасада сначала проверяют прямые углы затем равенство всех сторон. Четыре угла по девяносто градусов.",
          "Четыре равные стороны",
          "Квадрат.",
          "Квадрат является особым прямоугольником.",
          "Перенесите в каталог."
        ],
        "en": [
          "When cataloguing a façade check right angles first and then whether all sides are equal. Four right angles.",
          "Four equal sides",
          "Square.",
          "A square is a special rectangle.",
          "Move it to the catalogue."
        ]
      }
    }
  },
  "s8": {
    "eyebrow": {
      "uz": "Mashq",
      "ru": "Задание",
      "en": "Task"
    },
    "title": {
      "uz": "Xossadan figuraga",
      "ru": "От свойства к фигуре",
      "en": "From property to shape"
    },
    "scene": "quad-rect",
    "frames": [
      {
        "uz": "4 ta tomon va to'rtta 90° burchak",
        "ru": "4 стороны и четыре угла по 90°",
        "en": "4 sides and four 90° angles"
      },
      {
        "uz": "Figurani tanlang",
        "ru": "Выберите фигуру",
        "en": "Choose the shape"
      }
    ],
    "question": {
      "uz": "Qaysi figura?",
      "ru": "Какая это фигура?",
      "en": "Which shape is it?"
    },
    "options": [
      {
        "uz": "Uchburchak",
        "ru": "Треугольник",
        "en": "Triangle"
      },
      {
        "uz": "To'g'ri to'rtburchak",
        "ru": "Прямоугольник",
        "en": "Rectangle"
      },
      {
        "uz": "Beshburchak",
        "ru": "Пятиугольник",
        "en": "Pentagon"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "4 tomon va to'rtta 90° burchak - to'g'ri to'rtburchak",
      "ru": "4 стороны и четыре угла по 90° образуют прямоугольник",
      "en": "4 sides and four 90° angles make a rectangle"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: Uchburchakda uchta tomon bo'ladi. Berilgan figurada esa to'rtta tomon va to'rtta to'g'ri burchak bor.",
        "ru": "Посмотрите ещё раз: У треугольника три стороны. У данной фигуры четыре стороны и четыре прямых угла.",
        "en": "Look again: A triangle has three sides. The given shape has four sides and four right angles."
      },
      {
        "uz": "To'g'ri. To'rt tomon va to'rtta to'g'ri burchak to'g'ri to'rtburchakni bildiradi.",
        "ru": "Верно. Четыре стороны и четыре угла по девяносто градусов образуют прямоугольник.",
        "en": "Correct. Four sides and four right angles make a rectangle."
      },
      {
        "uz": "Yana bir qarang: Beshburchakda beshta tomon bo'ladi. Berilgan figurada esa to'rtta tomon bor.",
        "ru": "Посмотрите ещё раз: У пятиугольника пять сторон. У данной фигуры только четыре стороны.",
        "en": "Look again: A pentagon has five sides. The given shape has only four sides."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Figuraning to'rt tomoni va to'rtta to'qson gradusli burchagi bor.",
          "Figurani tanlang."
        ],
        "ru": [
          "У фигуры четыре стороны и четыре угла по девяносто градусов.",
          "Выберите фигуру."
        ],
        "en": [
          "The shape has four sides and four ninety-degree angles.",
          "Choose the shape."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rt tomon va to'rtta to'g'ri burchak to'g'ri to'rtburchakni bildiradi.",
        "ru": "Верно. Четыре стороны и четыре угла по девяносто градусов образуют прямоугольник.",
        "en": "Correct. Four sides and four right angles make a rectangle."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: Uchburchakda uchta tomon bo'ladi. Berilgan figurada esa to'rtta tomon va to'rtta to'g'ri burchak bor.",
          "ru": "Посмотрите ещё раз: У треугольника три стороны. У данной фигуры четыре стороны и четыре прямых угла.",
          "en": "Look again: A triangle has three sides. The given shape has four sides and four right angles."
        },
        {
          "uz": "To'g'ri. To'rt tomon va to'rtta to'g'ri burchak to'g'ri to'rtburchakni bildiradi.",
          "ru": "Верно. Четыре стороны и четыре угла по девяносто градусов образуют прямоугольник.",
          "en": "Correct. Four sides and four right angles make a rectangle."
        },
        {
          "uz": "Yana bir qarang: Beshburchakda beshta tomon bo'ladi. Berilgan figurada esa to'rtta tomon bor.",
          "ru": "Посмотрите ещё раз: У пятиугольника пять сторон. У данной фигуры только четыре стороны.",
          "en": "Look again: A pentagon has five sides. The given shape has only four sides."
        }
      ]
    }
  },
  "s9": {
    "eyebrow": {
      "uz": "Mashq",
      "ru": "Задание",
      "en": "Task"
    },
    "title": {
      "uz": "Yo'qolgan tomon",
      "ru": "Пропавшая сторона",
      "en": "Missing side"
    },
    "scene": "quad-sides",
    "frames": [
      {
        "uz": "To'g'ri to'rtburchak tomonlari: 8 cm, 5 cm, 8 cm, ?",
        "ru": "Стороны прямоугольника: 8 см, 5 см, 8 см, ?",
        "en": "Rectangle sides: 8 cm, 5 cm, 8 cm, ?"
      },
      {
        "uz": "Yo'qolgan tomonni toping",
        "ru": "Найдите неизвестную сторону",
        "en": "Find the missing side"
      }
    ],
    "question": {
      "uz": "Yo'qolgan tomon qancha?",
      "ru": "Чему равна неизвестная сторона?",
      "en": "What is the missing side?"
    },
    "options": [
      {
        "uz": "5 cm",
        "ru": "5 см",
        "en": "5 cm"
      },
      {
        "uz": "8 cm",
        "ru": "8 см",
        "en": "8 cm"
      },
      {
        "uz": "13 cm",
        "ru": "13 см",
        "en": "13 cm"
      }
    ],
    "correctIndex": 0,
    "closedSet": true,
    "proof": {
      "uz": "Qarama-qarshi tomonlar teng, demak 5 cm",
      "ru": "Противоположные стороны равны, поэтому ответ 5 см",
      "en": "Opposite sides are equal, so the answer is 5 cm"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Qarama qarshi tomonlar teng, demak noma'lum tomon besh santimetr.",
        "ru": "Верно. Противоположные стороны равны, поэтому неизвестная сторона равна пяти сантиметрам.",
        "en": "Correct. Opposite sides are equal, so the missing side is five centimetres."
      },
      {
        "uz": "Yana bir qarang: Sakkiz santimetrli tomon qarshisidagi sakkiz santimetrli tomon bilan juftlashadi. Noma'lum tomon besh santimetrli tomon qarshisida.",
        "ru": "Посмотрите ещё раз: Сторона восемь сантиметров парна противоположной стороне восемь сантиметров. Неизвестная сторона противоположна стороне пять сантиметров.",
        "en": "Look again: The eight-centimetre side pairs with the opposite eight-centimetre side. The missing side is opposite the five-centimetre side."
      },
      {
        "uz": "Yana bir qarang: O'n uch santimetr qo'shni sakkiz va besh santimetrni qo'shishdan chiqadi. Qarama-qarshi tomonlar esa juft-juft teng.",
        "ru": "Посмотрите ещё раз: Тринадцать сантиметров получены сложением соседних сторон восемь и пять сантиметров. Противоположные стороны равны попарно.",
        "en": "Look again: Thirteen centimetres comes from adding adjacent sides of eight and five centimetres. Opposite sides are equal in pairs."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "To'g'ri to'rtburchak tomonlari sakkiz santimetr, besh santimetr, sakkiz santimetr va noma'lum.",
          "Noma'lum tomon uzunligini toping."
        ],
        "ru": [
          "Стороны прямоугольника равны восьми сантиметрам, пяти сантиметрам, восьми сантиметрам и неизвестной длине.",
          "Найдите неизвестную сторону."
        ],
        "en": [
          "The rectangle sides are eight centimetres, five centimetres, eight centimetres and one unknown length.",
          "Find the unknown side."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Qarama qarshi tomonlar teng, demak noma'lum tomon besh santimetr.",
        "ru": "Верно. Противоположные стороны равны, поэтому неизвестная сторона равна пяти сантиметрам.",
        "en": "Correct. Opposite sides are equal, so the missing side is five centimetres."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Qarama qarshi tomonlar teng, demak noma'lum tomon besh santimetr.",
          "ru": "Верно. Противоположные стороны равны, поэтому неизвестная сторона равна пяти сантиметрам.",
          "en": "Correct. Opposite sides are equal, so the missing side is five centimetres."
        },
        {
          "uz": "Yana bir qarang: Sakkiz santimetrli tomon qarshisidagi sakkiz santimetrli tomon bilan juftlashadi. Noma'lum tomon besh santimetrli tomon qarshisida.",
          "ru": "Посмотрите ещё раз: Сторона восемь сантиметров парна противоположной стороне восемь сантиметров. Неизвестная сторона противоположна стороне пять сантиметров.",
          "en": "Look again: The eight-centimetre side pairs with the opposite eight-centimetre side. The missing side is opposite the five-centimetre side."
        },
        {
          "uz": "Yana bir qarang: O'n uch santimetr qo'shni sakkiz va besh santimetrni qo'shishdan chiqadi. Qarama-qarshi tomonlar esa juft-juft teng.",
          "ru": "Посмотрите ещё раз: Тринадцать сантиметров получены сложением соседних сторон восемь и пять сантиметров. Противоположные стороны равны попарно.",
          "en": "Look again: Thirteen centimetres comes from adding adjacent sides of eight and five centimetres. Opposite sides are equal in pairs."
        }
      ]
    }
  },
  "s10": {
    "eyebrow": {
      "uz": "Mashq",
      "ru": "Задание",
      "en": "Task"
    },
    "title": {
      "uz": "Doim to'g'ri gap",
      "ru": "Всегда верное утверждение",
      "en": "Always true statement"
    },
    "scene": "quad-compare",
    "frames": [
      {
        "uz": "Qaysi gap doim rost?",
        "ru": "Какое утверждение всегда верно?",
        "en": "Which statement is always true?"
      },
      {
        "uz": "Xossalarni solishtiring",
        "ru": "Сравните свойства",
        "en": "Compare the properties"
      }
    ],
    "question": {
      "uz": "Qaysi gap doim to'g'ri?",
      "ru": "Какое утверждение всегда верно?",
      "en": "Which statement is always true?"
    },
    "options": [
      {
        "uz": "Har bir kvadrat to'g'ri to'rtburchak",
        "ru": "Каждый квадрат является прямоугольником",
        "en": "Every square is a rectangle"
      },
      {
        "uz": "Har bir to'g'ri to'rtburchak kvadrat",
        "ru": "Каждый прямоугольник является квадратом",
        "en": "Every rectangle is a square"
      },
      {
        "uz": "Har bir to'rtburchak kvadrat",
        "ru": "Каждый четырёхугольник является квадратом",
        "en": "Every quadrilateral is a square"
      }
    ],
    "correctIndex": 0,
    "closedSet": true,
    "proof": {
      "uz": "Kvadrat to'g'ri to'rtburchakning barcha xossalariga ega",
      "ru": "Квадрат обладает всеми свойствами прямоугольника",
      "en": "A square has all the properties of a rectangle"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Kvadrat to'g'ri to'rtburchakning barcha xossalariga ega.",
        "ru": "Верно. Квадрат обладает всеми свойствами прямоугольника.",
        "en": "Correct. A square has all the properties of a rectangle."
      },
      {
        "uz": "Yana bir qarang: To'g'ri to'rtburchakning qo'shni tomonlari teng bo'lishi shart emas. Sakkizga besh o'lchamli to'g'ri to'rtburchak kvadrat emas.",
        "ru": "Посмотрите ещё раз: Соседние стороны прямоугольника не обязаны быть равными. Например, прямоугольник восемь на пять не является квадратом.",
        "en": "Look again: A rectangle's adjacent sides need not be equal. For example, an eight-by-five rectangle is not a square."
      },
      {
        "uz": "Yana bir qarang: Oddiy to'rtburchakda teng tomonlar ham, to'g'ri burchaklar ham bo'lishi shart emas. Shuning uchun u doim kvadrat emas.",
        "ru": "Посмотрите ещё раз: У произвольного четырёхугольника не обязаны быть равные стороны или прямые углы. Поэтому он не всегда является квадратом.",
        "en": "Look again: A general quadrilateral need not have equal sides or right angles. Therefore, it is not always a square."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Uchta mulohaza berilgan.",
          "Doimo rost mulohazani tanlang."
        ],
        "ru": [
          "Даны три утверждения.",
          "Выберите утверждение, которое всегда верно."
        ],
        "en": [
          "Three statements are given.",
          "Choose the statement that is always true."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Kvadrat to'g'ri to'rtburchakning barcha xossalariga ega.",
        "ru": "Верно. Квадрат обладает всеми свойствами прямоугольника.",
        "en": "Correct. A square has all the properties of a rectangle."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Kvadrat to'g'ri to'rtburchakning barcha xossalariga ega.",
          "ru": "Верно. Квадрат обладает всеми свойствами прямоугольника.",
          "en": "Correct. A square has all the properties of a rectangle."
        },
        {
          "uz": "Yana bir qarang: To'g'ri to'rtburchakning qo'shni tomonlari teng bo'lishi shart emas. Sakkizga besh o'lchamli to'g'ri to'rtburchak kvadrat emas.",
          "ru": "Посмотрите ещё раз: Соседние стороны прямоугольника не обязаны быть равными. Например, прямоугольник восемь на пять не является квадратом.",
          "en": "Look again: A rectangle's adjacent sides need not be equal. For example, an eight-by-five rectangle is not a square."
        },
        {
          "uz": "Yana bir qarang: Oddiy to'rtburchakda teng tomonlar ham, to'g'ri burchaklar ham bo'lishi shart emas. Shuning uchun u doim kvadrat emas.",
          "ru": "Посмотрите ещё раз: У произвольного четырёхугольника не обязаны быть равные стороны или прямые углы. Поэтому он не всегда является квадратом.",
          "en": "Look again: A general quadrilateral need not have equal sides or right angles. Therefore, it is not always a square."
        }
      ]
    }
  },
  "s11": {
    "eyebrow": {
      "uz": "Mashq",
      "ru": "Задание",
      "en": "Task"
    },
    "title": {
      "uz": "Qiya turgan kvadrat",
      "ru": "Наклонённый квадрат",
      "en": "A tilted square"
    },
    "scene": "quad-rotated",
    "frames": [
      {
        "uz": "Kvadrat qiya turibdi",
        "ru": "Квадрат стоит наклонно",
        "en": "The square is tilted"
      },
      {
        "uz": "Xossalari o'zgardimi?",
        "ru": "Изменились ли его свойства?",
        "en": "Did its properties change?"
      }
    ],
    "question": {
      "uz": "Kvadrat o'zgardimi?",
      "ru": "Изменился ли квадрат?",
      "en": "Did the square change?"
    },
    "options": [
      {
        "uz": "Yo'q, o'zgarmadi",
        "ru": "Нет, не изменился",
        "en": "No, it did not change"
      },
      {
        "uz": "Ha, to'g'ri to'rtburchakka aylandi",
        "ru": "Да, стал прямоугольником",
        "en": "Yes, it became a rectangle"
      },
      {
        "uz": "Ha, tomonlari teng emas",
        "ru": "Да, стороны перестали быть равными",
        "en": "Yes, the sides are no longer equal"
      }
    ],
    "correctIndex": 0,
    "closedSet": true,
    "proof": {
      "uz": "Burilish kvadrat xossalarini o'zgartirmaydi",
      "ru": "Поворот не меняет свойства квадрата",
      "en": "Rotation does not change the square's properties"
    },
    "feedbackAudio": [
      {
        "uz": "To'g'ri. Burilish kvadrat xossalarini o'zgartirmaydi.",
        "ru": "Верно. Поворот не меняет свойства квадрата.",
        "en": "Correct. Rotation does not change the square's properties."
      },
      {
        "uz": "Yana bir qarang: Kvadrat burilishdan oldin ham to'g'ri to'rtburchak oilasiga kirgan. Burilish uning tasnifini o'zgartirmaydi.",
        "ru": "Посмотрите ещё раз: Квадрат и до поворота относился к семейству прямоугольников. Поворот не меняет его классификацию.",
        "en": "Look again: The square already belonged to the rectangle family before the turn. Rotation does not change its classification."
      },
      {
        "uz": "Yana bir qarang: Burilish tomonlarning yo'nalishini o'zgartiradi, uzunligini emas. To'rtta tomon ham tengligicha qoladi.",
        "ru": "Посмотрите ещё раз: Поворот меняет направление сторон, но не их длину. Все четыре стороны остаются равными.",
        "en": "Look again: Rotation changes the direction of the sides, not their lengths. All four sides remain equal."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Kvadrat qiya holatga burilgan.",
          "Uning xossalari o'zgarganmi?"
        ],
        "ru": [
          "Квадрат повернули в наклонное положение.",
          "Изменились ли его свойства?"
        ],
        "en": [
          "The square is tilted.",
          "Did its properties change?"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. Burilish kvadrat xossalarini o'zgartirmaydi.",
        "ru": "Верно. Поворот не меняет свойства квадрата.",
        "en": "Correct. Rotation does not change the square's properties."
      },
      "on_wrong": [
        {
          "uz": "To'g'ri. Burilish kvadrat xossalarini o'zgartirmaydi.",
          "ru": "Верно. Поворот не меняет свойства квадрата.",
          "en": "Correct. Rotation does not change the square's properties."
        },
        {
          "uz": "Yana bir qarang: Kvadrat burilishdan oldin ham to'g'ri to'rtburchak oilasiga kirgan. Burilish uning tasnifini o'zgartirmaydi.",
          "ru": "Посмотрите ещё раз: Квадрат и до поворота относился к семейству прямоугольников. Поворот не меняет его классификацию.",
          "en": "Look again: The square already belonged to the rectangle family before the turn. Rotation does not change its classification."
        },
        {
          "uz": "Yana bir qarang: Burilish tomonlarning yo'nalishini o'zgartiradi, uzunligini emas. To'rtta tomon ham tengligicha qoladi.",
          "ru": "Посмотрите ещё раз: Поворот меняет направление сторон, но не их длину. Все четыре стороны остаются равными.",
          "en": "Look again: Rotation changes the direction of the sides, not their lengths. All four sides remain equal."
        }
      ]
    }
  },
  "s12": {
    "eyebrow": {
      "uz": "Mashq",
      "ru": "Задание",
      "en": "Task"
    },
    "title": {
      "uz": "To'rtta teng tomon yetarlimi?",
      "ru": "Достаточно ли четырёх равных сторон?",
      "en": "Are four equal sides enough?"
    },
    "scene": "quad-rhombus",
    "frames": [
      {
        "uz": "To'rtta teng tomonli romb",
        "ru": "Ромб с четырьмя равными сторонами",
        "en": "A rhombus with four equal sides"
      },
      {
        "uz": "90° burchak yo'q",
        "ru": "Нет углов по 90°",
        "en": "There are no 90° angles"
      }
    ],
    "question": {
      "uz": "Bu kvadratmi?",
      "ru": "Это квадрат?",
      "en": "Is it a square?"
    },
    "options": [
      {
        "uz": "Kvadrat",
        "ru": "Квадрат",
        "en": "Square"
      },
      {
        "uz": "Kvadrat emas, 90° ham kerak",
        "ru": "Не квадрат: нужны ещё углы по 90°",
        "en": "Not a square: 90° angles are also needed"
      },
      {
        "uz": "To'g'ri to'rtburchak",
        "ru": "Прямоугольник",
        "en": "Rectangle"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "To'rtta teng tomon yetarli emas, to'rtta 90° burchak ham kerak",
      "ru": "Четырёх равных сторон недостаточно, нужны четыре угла по 90°",
      "en": "Four equal sides are not enough; four 90° angles are also needed"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: To'rtta teng tomonning o'zi yetarli emas. Kvadrat uchun to'rtta to'qson darajali burchak ham kerak.",
        "ru": "Посмотрите ещё раз: Одних четырёх равных сторон недостаточно. Квадрату нужны также четыре угла по девяносто градусов.",
        "en": "Look again: Four equal sides alone are not enough. A square also needs four ninety-degree angles."
      },
      {
        "uz": "To'g'ri. To'rtta teng tomon yetarli emas. To'rtta to'g'ri burchak ham kerak.",
        "ru": "Верно. Четырёх равных сторон недостаточно нужны четыре угла по девяносто градусов.",
        "en": "Correct. Four equal sides are not enough. Four right angles are also needed."
      },
      {
        "uz": "Yana bir qarang: To'g'ri to'rtburchakda to'rtta to'qson darajali burchak bo'lishi kerak. Berilgan rombda bunday burchaklar yo'q.",
        "ru": "Посмотрите ещё раз: У прямоугольника должны быть четыре угла по девяносто градусов. У данного ромба таких углов нет.",
        "en": "Look again: A rectangle must have four ninety-degree angles. The given rhombus has none."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Rombning to'rtta tomoni teng.",
          "Unda to'qson gradusli burchaklar yo'q. Bu kvadratmi?"
        ],
        "ru": [
          "У ромба четыре равные стороны.",
          "У него нет углов по девяносто градусов. Это квадрат?"
        ],
        "en": [
          "A rhombus has four equal sides.",
          "It has no ninety-degree angles. Is it a square?"
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rtta teng tomon yetarli emas. To'rtta to'g'ri burchak ham kerak.",
        "ru": "Верно. Четырёх равных сторон недостаточно нужны четыре угла по девяносто градусов.",
        "en": "Correct. Four equal sides are not enough. Four right angles are also needed."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: To'rtta teng tomonning o'zi yetarli emas. Kvadrat uchun to'rtta to'qson darajali burchak ham kerak.",
          "ru": "Посмотрите ещё раз: Одних четырёх равных сторон недостаточно. Квадрату нужны также четыре угла по девяносто градусов.",
          "en": "Look again: Four equal sides alone are not enough. A square also needs four ninety-degree angles."
        },
        {
          "uz": "To'g'ri. To'rtta teng tomon yetarli emas. To'rtta to'g'ri burchak ham kerak.",
          "ru": "Верно. Четырёх равных сторон недостаточно нужны четыре угла по девяносто градусов.",
          "en": "Correct. Four equal sides are not enough. Four right angles are also needed."
        },
        {
          "uz": "Yana bir qarang: To'g'ri to'rtburchakda to'rtta to'qson darajali burchak bo'lishi kerak. Berilgan rombda bunday burchaklar yo'q.",
          "ru": "Посмотрите ещё раз: У прямоугольника должны быть четыре угла по девяносто градусов. У данного ромба таких углов нет.",
          "en": "Look again: A rectangle must have four ninety-degree angles. The given rhombus has none."
        }
      ]
    }
  },
  "s13": {
    "eyebrow": {
      "uz": "Shahar vazifasi",
      "ru": "Городская задача",
      "en": "City task"
    },
    "title": {
      "uz": "Oyna loyihasi",
      "ru": "Проект окна",
      "en": "Window design"
    },
    "scene": "quad-case",
    "frames": [
      {
        "uz": "To'rtta 90° burchak",
        "ru": "Четыре угла по 90°",
        "en": "Four 90° angles"
      },
      {
        "uz": "Barcha tomonlar 6 dm",
        "ru": "Все стороны по 6 дм",
        "en": "All sides are 6 dm"
      },
      {
        "uz": "Figurani aniqlang",
        "ru": "Определите фигуру",
        "en": "Identify the shape"
      }
    ],
    "question": {
      "uz": "Eng aniq nom qaysi?",
      "ru": "Какое название самое точное?",
      "en": "Which is the most precise name?"
    },
    "options": [
      {
        "uz": "To'g'ri to'rtburchak",
        "ru": "Прямоугольник",
        "en": "Rectangle"
      },
      {
        "uz": "Kvadrat",
        "ru": "Квадрат",
        "en": "Square"
      },
      {
        "uz": "Har qanday to'rtburchak",
        "ru": "Любой четырёхугольник",
        "en": "Any quadrilateral"
      }
    ],
    "correctIndex": 1,
    "closedSet": true,
    "proof": {
      "uz": "To'rtta 90° burchak va barcha teng tomonlar kvadratni bildiradi",
      "ru": "Четыре угла по 90° и все равные стороны образуют квадрат",
      "en": "Four 90° angles and four equal sides make a square"
    },
    "feedbackAudio": [
      {
        "uz": "Yana bir qarang: To'g'ri to'rtburchak umumiy nom, ammo barcha tomonlar teng bo'lgani uchun eng aniq nom kvadrat.",
        "ru": "Посмотрите ещё раз: Прямоугольник является общим названием. Из-за равенства всех сторон самое точное название этой фигуры это квадрат.",
        "en": "Look again: Rectangle is a general name, but because all sides are equal, the most precise name is square."
      },
      {
        "uz": "To'g'ri. To'rtta to'g'ri burchak va barcha teng tomonlar kvadratni bildiradi.",
        "ru": "Верно. Четыре угла по девяносто градусов и все равные стороны образуют квадрат.",
        "en": "Correct. Four right angles and four equal sides make a square."
      },
      {
        "uz": "Yana bir qarang: Bu ixtiyoriy to'rtburchak emas: to'rtta to'g'ri burchak va to'rtta teng tomon uning kvadrat ekanini aniqlaydi.",
        "ru": "Посмотрите ещё раз: Это не произвольный четырёхугольник: четыре прямых угла и четыре равные стороны определяют квадрат.",
        "en": "Look again: This is not just any quadrilateral: four right angles and four equal sides identify a square."
      }
    ],
    "audio": {
      "intro": {
        "uz": [
          "Oynaning to'rtta burchagi to'qson gradus.",
          "Barcha tomonlari olti detsimetr.",
          "Eng aniq nomni tanlang."
        ],
        "ru": [
          "У окна четыре угла по девяносто градусов.",
          "Все стороны равны шести дециметрам.",
          "Выберите самое точное название."
        ],
        "en": [
          "The window has four ninety-degree angles.",
          "All sides measure six decimetres.",
          "Choose the most precise name."
        ]
      },
      "on_correct": {
        "uz": "To'g'ri. To'rtta to'g'ri burchak va barcha teng tomonlar kvadratni bildiradi.",
        "ru": "Верно. Четыре угла по девяносто градусов и все равные стороны образуют квадрат.",
        "en": "Correct. Four right angles and four equal sides make a square."
      },
      "on_wrong": [
        {
          "uz": "Yana bir qarang: To'g'ri to'rtburchak umumiy nom, ammo barcha tomonlar teng bo'lgani uchun eng aniq nom kvadrat.",
          "ru": "Посмотрите ещё раз: Прямоугольник является общим названием. Из-за равенства всех сторон самое точное название этой фигуры это квадрат.",
          "en": "Look again: Rectangle is a general name, but because all sides are equal, the most precise name is square."
        },
        {
          "uz": "To'g'ri. To'rtta to'g'ri burchak va barcha teng tomonlar kvadratni bildiradi.",
          "ru": "Верно. Четыре угла по девяносто градусов и все равные стороны образуют квадрат.",
          "en": "Correct. Four right angles and four equal sides make a square."
        },
        {
          "uz": "Yana bir qarang: Bu ixtiyoriy to'rtburchak emas: to'rtta to'g'ri burchak va to'rtta teng tomon uning kvadrat ekanini aniqlaydi.",
          "ru": "Посмотрите ещё раз: Это не произвольный четырёхугольник: четыре прямых угла и четыре равные стороны определяют квадрат.",
          "en": "Look again: This is not just any quadrilateral: four right angles and four equal sides identify a square."
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
      "uz": "To'rtburchaklar oilasi",
      "ru": "Семейство четырёхугольников",
      "en": "Quadrilateral family"
    },
    "scene": "quad-final",
    "frames": [
      {
        "uz": "To'rtburchak",
        "ru": "Четырёхугольник",
        "en": "Quadrilateral"
      },
      {
        "uz": "To'g'ri to'rtburchak",
        "ru": "Прямоугольник",
        "en": "Rectangle"
      },
      {
        "uz": "Kvadrat",
        "ru": "Квадрат",
        "en": "Square"
      },
      {
        "uz": "Umumiy xossalar saqlanadi",
        "ru": "Общие свойства сохраняются",
        "en": "Shared properties are retained"
      },
      {
        "uz": "Keyingi mavzu: perimetr va yuza",
        "ru": "Следующая тема: периметр и площадь",
        "en": "Next topic: perimeter and area"
      }
    ],
    "rewardTitle": {
      "uz": "To'rtburchaklar oilasi me'mori",
      "ru": "Архитектор семейства четырёхугольников",
      "en": "Quadrilateral family architect"
    },
    "audio": {
      "intro": {
        "uz": [
          "To'rtburchaklar oilasida yangi xossa qo'shiladi ammo umumiy xossalar yo'qolmaydi. To'rtburchak.",
          "To'g'ri to'rtburchak",
          "Kvadrat.",
          "Umumiy xossalar saqlanadi.",
          "Keyingi mavzu perimetr va yuza."
        ],
        "ru": [
          "В семействе четырёхугольников новые свойства добавляются а общие не исчезают. Четырёхугольник.",
          "Прямоугольник",
          "Квадрат.",
          "Общие свойства сохраняются.",
          "Следующая тема периметр и площадь."
        ],
        "en": [
          "Within the quadrilateral family new properties are added while shared ones remain. Quadrilateral.",
          "Rectangle",
          "Square.",
          "Shared properties are retained.",
          "Next topic perimeter and area."
        ]
      }
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
function MeasureScene({ scene, frame, p }) {
  if (scene === 'measure-time') { const angle = -90 + p * 240; const rad = angle * Math.PI / 180; return <svg viewBox="0 0 300 170"><circle className="tv-soft" cx="150" cy="82" r="58"/><circle className="tv-outline" cx="150" cy="82" r="58"/><path className="tv-ray" d="M150 82V43"/><path className="tv-ray tv-accent" d={`M150 82L${150 + 43 * Math.cos(rad)} ${82 + 43 * Math.sin(rad)}`}/><circle className="tv-pulse" cx="150" cy="82" r="7"/><path className="tv-carry" d={frame > 1 ? 'M205 47c20 10 23 31 6 44' : 'M205 47c8 4 12 10 13 16'}/></svg>; }
  if (scene === 'measure-sub') return <svg viewBox="0 0 300 170"><path className="tv-grid" d="M35 132H265"/><rect className="tv-mass" x="48" y={50 + 38 * p} width="204" height={72 - 38 * p} rx="8"/><path className="tv-path" d="M42 132H258"/><circle className="tv-pulse" cx={245 - 140 * p} cy="132" r="8"/></svg>;
  if (scene === 'measure-repeat') { const active = Math.ceil(4 * p); return <svg viewBox="0 0 300 170">{Array.from({length:4},(_,i)=><g key={i} style={{opacity:i<active?1:.18,transform:`translateY(${i<active?0:8}px)`}}><rect className="tv-soft" x={28+i*66} y="58" width="53" height="36" rx="10"/><path className="tv-path" d={`M34 ${76+i%2}H${74+i*66}`}/></g>)}<path className="tv-grid" d="M28 123H272"/></svg>; }
  if (['measure-map','measure-rule','measure-final'].includes(scene)) { const total = scene === 'measure-final' ? 5 : 4; const active = Math.ceil(total * p); return <svg viewBox="0 0 300 170">{Array.from({length:total},(_,i)=><g key={i} style={{opacity:i<active?1:.16}}><rect className={i===active-1?'tv-card active':'tv-card'} x={18+i*(264/total)} y={48+(i%2)*12} width={44} height="58" rx="9"/><path className="tv-grid" d={`M${27+i*(264/total)} ${68+(i%2)*12}h26 M${27+i*(264/total)} ${81+(i%2)*12}h20`}/></g>)}<path className="tv-arrow" d="M32 132H268"/></svg>; }
  if (['measure-standard','measure-bit'].includes(scene)) return <svg viewBox="0 0 300 170"><rect className="tv-mass" x="43" y="72" width={95 + 55*p} height="48" rx="12"/><rect className="tv-soft" x="172" y="72" width={80 - 34*p} height="48" rx="12"/><path className="tv-carry" d={frame>0?'M185 53c-18-17-48-17-66 0':'M185 53h-24'}/><circle className="tv-pulse" cx={frame>0?119:185} cy="53" r="8"/></svg>;
  const joined = frame >= 2 || scene === 'measure-payoff'; const leftEnd=92+56*p; const rightStart=204-56*p; return <svg viewBox="0 0 300 170"><path className="tv-grid" d="M28 128H272 M48 118V138 M98 118V138 M148 118V138 M198 118V138 M248 118V138"/><path className="tv-cable a" d={joined?'M34 72H148':`M34 58H${leftEnd}`}/><path className="tv-cable b" d={joined?'M148 72H264':`M${rightStart} 88H264`}/><circle className="tv-pulse" cx={joined?148:(leftEnd+rightStart)/2} cy={joined?72:74} r="9"/><path className="tv-carry" d={frame>2?'M174 42c18 4 31 16 34 31':frame>0?'M174 42c10 2 19 7 24 15':'M174 42h24'}/></svg>;
}
function VolumeScene({ scene, frame, p }) {
  if (scene === 'volume-litre') return <svg viewBox="0 0 300 175"><path className="tv-container" d="M82 35h136l-12 116H94z"/><rect className="tv-water" x="96" y={143-92*p} width="108" height={92*p} rx="5"/><path className="tv-grid" d="M96 88H204 M150 42V145"/></svg>;
  if (scene === 'volume-dimensions') return <svg viewBox="0 0 300 175"><path className="tv-line" d="M42 120H252"/><rect className="tv-area" x="82" y="58" width="132" height="74" style={{opacity:frame>0?1:.12}}/><path className="tv-cube-wire" d="M105 121V55l70-28 70 36v65l-70 28z M105 55l70 37 70-29 M175 92v64" style={{opacity:frame>1?1:.12}}/>{frame>2&&<circle className="tv-pulse" cx="175" cy="92" r="9"/>}</svg>;
  if (scene === 'volume-choice') return <svg viewBox="0 0 300 175">{[18,28,42,58].map((size,i)=><g key={size} style={{opacity:i<=frame?1:.2}}><rect className="tv-soft" x={26+i*66} y={128-size} width={size} height={size} rx="6"/><path className="tv-cube-edge" d={`M${26+i*66} ${128-size}l10-8h${size}l-10 8`}/></g>)}</svg>;
  if (scene === 'volume-unit') return <svg viewBox="0 0 300 175"><path className="tv-cube-wire" d="M78 70l72-38 72 38v72l-72 32-72-32z M78 70l72 38 72-38 M150 108v66"/><path className="tv-accent" d={frame===0?'M78 142h72':frame===1?'M78 70l72 38':frame===2?'M150 108v66':'M78 70l72-38'}/></svg>;
  if (scene === 'volume-bit') return <svg viewBox="0 0 300 175"><path className="tv-cube-wire" d="M70 68l72-34 72 34v70l-72 33-72-33z M70 68l72 35 72-35 M142 103v68"/><path className="tv-accent" d={frame===0?'M70 138H214':'M142 103V171'}/><circle className="tv-pulse" cx="142" cy={frame===0?138:103} r="8"/></svg>;
  const total = scene === 'volume-dm' ? 30 : 24; const active = Math.max(1,Math.ceil(total*p)); return <div className="tv-layer-wrap">{Array.from({length:total},(_,i)=><i key={i} className={i<active?'active':''} style={{transform:`translateY(${-Math.floor(i/12)*4}px)`}}/> )}</div>;
}
const ANGLE_DEGREES = { 'angle-acute':35,'angle-right':90,'angle-obtuse':125,'angle-straight':180,'angle-case':110,'angle-payoff':125,'angle-equal':55,'angle-hook':55 };
function AngleScene({ scene, frame, p }) {
  if (['angle-scale','angle-final'].includes(scene)) return <svg viewBox="0 0 300 175"><path className="tv-scale acute" d="M30 130A120 120 0 0 1 150 10"/><path className="tv-scale obtuse" d="M150 10A120 120 0 0 1 270 130"/><circle className="tv-pulse" cx={30+240*p} cy="130" r="9"/><path className="tv-grid" d="M30 130H270 M150 10V130"/></svg>;
  if (scene === 'angle-parts') return <svg viewBox="0 0 300 175"><path className="tv-ray" d="M145 125H260" style={{opacity:frame>0?1:.22}}/><path className="tv-ray" d="M145 125L82 43" style={{opacity:frame>1?1:.22}}/><circle className="tv-pulse" cx="145" cy="125" r={frame===0?12:7}/><path className="tv-arc" d="M185 125A40 40 0 0 0 121 93" style={{opacity:frame>2?1:.2}}/></svg>;
  const degree = ANGLE_DEGREES[scene] || 60; const equalOpening=['angle-hook','angle-equal'].includes(scene); const shown = equalOpening?degree:degree*Math.max(.18,p); const rad=shown*Math.PI/180; const x=145+96*Math.cos(rad); const y=125-96*Math.sin(rad); if (equalOpening) { const short=48+14*p; const long=58+38*p; return <svg viewBox="0 0 300 175"><g transform="translate(-55 0)"><path className="tv-ray" d={`M145 125h${short}`}/><path className="tv-ray" d={`M145 125L${145+short*Math.cos(rad)} ${125-short*Math.sin(rad)}`}/></g><g transform="translate(80 0)"><path className="tv-ray" d={`M145 125h${long}`}/><path className="tv-ray" d={`M145 125L${145+long*Math.cos(rad)} ${125-long*Math.sin(rad)}`}/></g></svg>; } return <svg viewBox="0 0 300 175"><path className="tv-ray" d="M145 125H260"/><path className="tv-ray" d={`M145 125L${x} ${y}`}/><path className="tv-arc" d={`M185 125A40 40 0 0 0 ${145+40*Math.cos(rad)} ${125-40*Math.sin(rad)}`}/><circle className="tv-pulse" cx="145" cy="125" r="7"/></svg>;
}
const PROTRACTOR_DEGREES = {'protractor-hook':frame=>frame>0?120:60,'protractor-zero':()=>70,'protractor-start':()=>70,'protractor-mark':()=>70,'protractor-obtuse':()=>120,'protractor-check':()=>70,'protractor-rule':()=>70,'protractor-centre':()=>70,'protractor-order':()=>70,'protractor-error':frame=>frame>0?50:130,'protractor-case':()=>135,'protractor-final':()=>70,'protractor-parts':()=>90};
function ProtractorScene({ scene, frame, p }) { const degree=(PROTRACTOR_DEGREES[scene]||(()=>70))(frame); const rad=degree*Math.PI/180; const x=145+96*Math.cos(rad); const y=125-96*Math.sin(rad); return <svg viewBox="0 0 300 175"><path className="tv-protractor" d="M45 125A100 100 0 0 1 245 125"/><path className="tv-grid" d="M45 125H245 M145 25V125"/><path className="tv-ray" d="M145 125H260"/><circle className="tv-pulse" cx="145" cy="125" r={frame===0?10:6}/>{frame>0&&<circle className="tv-mark" cx={x} cy={y} r="7"/>}{frame>1&&<path className="tv-ray" d={`M145 125L${x} ${y}`}/>}<path className="tv-arc" d={`M185 125A40 40 0 0 0 ${145+40*Math.cos(rad*p)} ${125-40*Math.sin(rad*p)}`} style={{opacity:frame>1?1:.25}}/></svg>; }
function TriangleScene({ scene, frame, p }) { const variant=scene.includes('equal')?'equal':scene.includes('iso')||scene.includes('hook')||scene.includes('case')||scene.includes('payoff')?'iso':scene.includes('right')?'right':scene.includes('angles')?'angles':'scalene'; if(variant==='angles') return <svg viewBox="0 0 300 175"><polygon className="tv-shape" points="20,140 78,54 136,140" style={{opacity:frame>=0?1:.15}}/><polygon className="tv-shape" points="98,140 98,54 182,140" style={{opacity:frame>0?1:.15}}/><polygon className="tv-shape" points="164,140 211,82 282,140" style={{opacity:frame>1?1:.15}}/>{frame>2&&<circle className="tv-pulse" cx="150" cy="86" r="10"/>}</svg>; const points=variant==='right'?'65,140 65,40 245,140':variant==='equal'?'55,140 150,28 245,140':variant==='iso'?'45,140 150,42 255,140':'38,140 122,35 264,140'; const rotate=scene==='triangle-rotate'?90*p:0; const early=scene==='triangle-case'?0:1; return <svg viewBox="0 0 300 175"><g style={{transformOrigin:'150px 95px',transform:`rotate(${rotate}deg)`,transition:'transform .6s ease'}}><polygon className="tv-shape" points={points}/><path className="tv-path" d="M86 94l12 8" style={{opacity:frame>=early?1:.16}}/><path className="tv-path" d="M202 102l12-8" style={{opacity:frame>early?1:.16}}/>{variant==='equal'&&<path className="tv-path" d="M142 140v-14" style={{opacity:frame>early+1?1:.16}}/>}{(variant==='right'||scene.includes('case')||scene.includes('hook')||scene.includes('payoff'))&&<path className="tv-right" d="M65 120h20v20" style={{opacity:frame>0?1:.16}}/>}{frame>3&&<circle className="tv-pulse" cx="150" cy="78" r="10"/>}</g></svg>; }
function QuadScene({ scene, frame, p }) { if(['quad-hook','quad-compare','quad-final'].includes(scene)) return <svg viewBox="0 0 300 175"><rect className="tv-shape" x="20" y="54" width="145" height="82"/><rect className="tv-shape accent" x={145-30*p} y={40-8*p} width="105" height="105"/><path className="tv-right" d="M20 72h18V54 M232 40v18h18"/></svg>; if(scene==='quad-rhombus') return <svg viewBox="0 0 300 175"><polygon className="tv-shape" points="150,24 260,88 150,152 40,88"/><path className="tv-path" d="M88 58l10 12 M202 70l10-12 M88 118l10-12 M202 106l10 12" style={{opacity:frame>0?1:.18}}/></svg>; const square=['quad-square','quad-rotated','quad-case','quad-payoff'].includes(scene); const rotate=scene==='quad-rotated'?45*p:0; const marks=Math.min(4,frame+1); return <svg viewBox="0 0 300 175"><g style={{transformOrigin:'150px 88px',transform:`rotate(${rotate}deg)`,transition:'transform .6s ease'}}><rect className="tv-shape" x={square?90:44} y={square?28:48} width={square?120:212} height={square?120:92}/>{marks>0&&<path className="tv-right" d={square?'M90 48h20V28':'M44 68h20V48'}/>} {marks>1&&<path className="tv-right" d={square?'M190 28v20h20':'M236 48v20h20'}/>} {marks>2&&<path className="tv-right" d={square?'M210 128h-20v20':'M256 120h-20v20'}/>} {marks>3&&<path className="tv-right" d={square?'M110 148v-20H90':'M64 140v-20H44'}/>}</g>{frame>3&&<circle className="tv-pulse" cx="150" cy="88" r="10"/>}</svg>; }
function PerimeterScene({ scene, frame, p, screen }) { if(scene==='perimeter-compare') return <svg viewBox="0 0 300 180"><rect className="tv-border" x="20" y="45" width="120" height="58" style={{strokeDashoffset:420*(1-p)}}/><rect className="tv-border" x="160" y="33" width="100" height="82" style={{strokeDashoffset:420*(1-p)}}/><g className="tv-cells"><rect className="tv-cell" x="165" y="38" width="90" height="72" style={{opacity:frame > 0 ? .55 : .08}}/></g></svg>; const dims=screen===0||screen===7?[8,5]:screen===8||screen===9?[7,4]:screen===10?[6,6]:screen===12?[7,5]:screen===13?[10,6]:[6,4]; const cols=Math.min(10,dims[0]); const rows=Math.min(6,dims[1]); const cells=cols*rows; const area=scene.includes('area')||scene==='perimeter-case'||scene==='perimeter-hook'||scene==='perimeter-payoff'||scene==='perimeter-meaning'||scene==='perimeter-final'; const border=!scene.includes('area')||scene==='perimeter-case'||scene==='perimeter-hook'||scene==='perimeter-payoff'||scene==='perimeter-meaning'||scene==='perimeter-final'; return <svg viewBox="0 0 300 180">{area&&Array.from({length:cells},(_,i)=>{const col=i%cols,row=Math.floor(i/cols);return <rect className="tv-cell" key={i} x={58+col*184/cols} y={38+row*99/rows} width={184/cols-1} height={99/rows-1} style={{opacity:i < Math.ceil(cells*p) ? .62 : .08}}/>})}{border&&<rect className="tv-border" x="55" y="35" width="190" height="105" style={{strokeDashoffset:590*(1-p)}}/>}{scene==='perimeter-case'&&<rect className="tv-pool" x="132" y="82" width="46" height="31"/>}</svg>; }
function LessonVisual({ scene, frame, screen }) { const t=useT(); const c=CONTENT[`s${screen}`]; const safeFrame=Math.min(frame,c.frames.length-1); const label=t(c.frames[safeFrame]); const p=(safeFrame+1)/FRAME_COUNTS[screen]; let visual; if(LESSON_KIND==='measure') visual=<MeasureScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='volume') visual=<VolumeScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='angle') visual=<AngleScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='protractor') visual=<ProtractorScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='triangle') visual=<TriangleScene scene={scene} frame={safeFrame} p={p}/>; else if(LESSON_KIND==='quadrilateral') visual=<QuadScene scene={scene} frame={safeFrame} p={p}/>; else visual=<PerimeterScene scene={scene} frame={safeFrame} p={p} screen={screen}/>; return <div className={`conversion-visual topic-visual ${LESSON_KIND}-visual scene-${scene}`} aria-label={label}>{visual}<strong>{label}</strong></div>; }
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
function HookScreen({ screen, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const choose = (index) => { setPicked(index); audio.pushOneOff(t(c.neutral)); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state="think" showBit/><section className="model-card hook-card"><LessonVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><section className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" className={'option ' + (picked === index ? 'picked' : '')} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div>{picked !== null && <div className="feedback open neutral"><b>◆</b><p>{t(c.neutral)}</p></div>}</section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext, finishLesson }) { const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const summary = screen === 14; const bitState = summary ? 'wave' : screen === 7 ? 'happy' : ['focus', 'point', 'idea'][(screen - 1) % 3]; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={summary ? finishLesson : onNext} finish={summary}><div className="stack"><Heading c={c} state={bitState} showBit/><section className={'model-card ' + (summary ? 'summary-card' : '')}><LessonVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const revealed = picked !== null; const correct = picked === c.correctIndex; const baseBitState = screen === 12 ? 'awkward' : screen === 13 ? 'point' : 'focus'; const bitState = revealed ? (correct ? 'happy' : 'awkward') : baseBitState; const choose = (index) => { const ok = index === c.correctIndex; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state={bitState} showBit/><section className="test-layout"><div className="test-model"><LessonVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = revealed && index === picked ? (index === c.correctIndex ? 'right' : 'bad') : ''; return <button type="button" className={'option ' + cls} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div>{revealed && <><div className={'feedback open ' + (correct ? 'correct' : 'wrong')}><b>{correct ? '✓' : '!'}</b><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div><div className="proof">{t(c.proof)}</div></>}</div></section></div></Stage>; }
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
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} state="happy" showBit/><section className="model-card summary-card"><LessonVisual scene={c.scene} frame={audio.frame} screen={screen}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><G4TitleReward unlocked={unlocked} title={c.rewardTitle} answers={answers}/></div></Stage>;
}
const TOPIC_STYLES = `
.topic-visual{overflow:hidden;text-align:center}.topic-visual svg{width:min(100%,330px);height:175px;overflow:visible}.topic-visual strong{max-width:360px;color:${T.navy};font-size:12px;line-height:1.35}.topic-visual text{fill:${T.navy};font:900 14px 'JetBrains Mono',monospace}.tv-grid{fill:none;stroke:${T.ink3};stroke-width:2;opacity:.35}.tv-soft{fill:${T.cyanSoft};transition:.6s ease}.tv-outline,.tv-line{fill:none;stroke:${T.navy};stroke-width:4}.tv-path,.tv-ray,.tv-arc,.tv-accent,.tv-arrow,.tv-carry,.tv-cube-edge{fill:none;stroke:${T.cyan};stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.tv-accent,.tv-carry{stroke:${T.accent};stroke-width:5}.tv-arrow{stroke-width:4;marker-end:none}.tv-path{stroke-dasharray:10 7;animation:topicDash 3s linear infinite}.tv-pulse{fill:${T.accent};transform-box:fill-box;transform-origin:center;animation:topicPulse 1.7s ease-in-out infinite}.tv-cable{fill:none;stroke:${T.cyan};stroke-width:18;stroke-linecap:round;transition:.55s}.tv-cable.b{stroke:${T.lime}}.tv-mass{fill:${T.cyan};opacity:.78;transition:.55s}.tv-card{fill:${T.paper};stroke:${T.ink3};stroke-width:3;transition:.4s}.tv-card.active{fill:${T.successSoft};stroke:${T.lime}}.tv-container{fill:rgba(22,143,163,.06);stroke:${T.navy};stroke-width:5}.tv-water{fill:rgba(22,143,163,.62);transition:.6s}.tv-cube-wire{fill:rgba(22,143,163,.08);stroke:${T.navy};stroke-width:4;stroke-linejoin:round}.tv-layer-wrap{width:208px;display:grid;grid-template-columns:repeat(6,1fr);gap:5px;transform:skewY(-5deg)}.tv-layer-wrap i{aspect-ratio:1;border-radius:6px;background:#DDE7E6;opacity:.14;transform:scale(.72);transition:.42s}.tv-layer-wrap i.active{opacity:1;transform:scale(1);background:linear-gradient(145deg,${T.cyan},${T.navy});box-shadow:3px 4px 0 rgba(23,59,82,.16)}.tv-protractor{fill:rgba(22,143,163,.09);stroke:${T.cyan};stroke-width:3}.tv-mark{fill:${T.accent};stroke:#fff;stroke-width:3}.tv-arc{stroke:${T.accent};stroke-width:4}.tv-scale{fill:none;stroke-width:18;stroke-linecap:round}.tv-scale.acute{stroke:${T.lime}}.tv-scale.obtuse{stroke:${T.accent}}.tv-shape{fill:rgba(22,143,163,.11);stroke:${T.navy};stroke-width:5;stroke-linejoin:round;transition:.55s}.tv-shape.accent{fill:rgba(149,201,61,.2);stroke:${T.lime}}.tv-right{fill:none;stroke:${T.accent};stroke-width:4}.tv-area{fill:rgba(22,143,163,.12)}.tv-cell{fill:rgba(149,201,61,.58);stroke:#fff;stroke-width:1;transition:opacity .4s}.tv-border{fill:none;stroke:${T.accent};stroke-width:7;stroke-dasharray:590;transition:stroke-dashoffset .55s}.tv-pool{fill:${T.cyan};stroke:#fff;stroke-width:3}.muted{opacity:.2}@keyframes topicDash{to{stroke-dashoffset:-34}}@keyframes topicPulse{50%{transform:scale(1.28);opacity:.62}}@media(max-width:639.98px){.topic-visual svg{height:145px}.topic-visual strong{font-size:11px}.tv-layer-wrap{width:165px}}@media(prefers-reduced-motion:reduce){.topic-visual *{animation:none!important;transition:none!important}.tv-border{stroke-dashoffset:0!important}}
`;
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars36({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars36 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES + TOPIC_STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
